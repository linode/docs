---
slug: gnu-make-tutorial
author:
  name: Stephen Savitsky
description: 'The GNU make tool is used to generate non-source files needed to build a program. However, you can also use GNU make to automate any task that involves updating files or performing actions based on file changes. This guide shows you how to use GNU make and Git to update a simple website.'
og_description: 'The GNU make tool is used to generate non-source files needed to build a program. However, you can also use GNU make to automate any task that involves updating files or performing actions based on file changes. This guide shows you how to use GNU make and Git to update a simple website.'
keywords: ['gnu make tutorial']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-28
modified_by:
  name: Linode
title: "GNU Make Tutorial: Learn to Automate Tasks"
h1_title: "Use GNU Make to Automate Tasks"
enable_h1: true
contributor:
  name: Stephen Savitsky
---

[GNU make](https://www.gnu.org/software/make/manual/make.html) is designed as a utility for building large programs. It automatically determines which parts need to be recompiled, and issues the commands needed to recompile them. Its uses are not limited to compiling and linking C programs. It can also be a surprisingly effective scripting language for automating any task that involves updating files or performing actions whenever files change.

In this guide `make`  or "Make" always refers to GNU Make; the version found on almost all Linux distributions. It has a number of useful extensions -- pattern rules and simply-expanded variables.

{{< note >}}
The [Features](https://www.gnu.org/software/make/manual/make.html#Features) and [ Incompatibilities and Missing Features](https://www.gnu.org/software/make/manual/make.html#Missing) sections of the [GNU Make Manual](https://www.gnu.org/software/make/manual/make.html) describe GNU Make's differences from the BSD and System V versions.
{{< /note >}}

## Make Basics

Make starts by reading a file called *makefile* that tells it what to do. The makefile is made up of three primary components or *rules*. The *target* contains rules that describe the file(s) to be built. The *prerequisites* point to a file containing any required inputs related to the target. Finally, the *recipe* includes the actions that are to be performed by GNU Make. So, a typical rule resembles the following example:

{{< file "makefile" >}}
target... : prerequisite...
    recipe...
{{< /file >}}

The recipe is run whenever the target does not exist, or if any of its prerequisites has been modified since the last time it was built. The following list outlines some syntax elements and how GNU Make interprets them:

 - Targets and prerequisites are separated by spaces; spaces around the colon are ignored.
 - The recipe is a series of shell commands, each preceded by a **TAB** character. This needs to be a literal tab, not some number of spaces. Any text editor that understands the format of makefiles warns you by showing spaces in the recipe in a different color.
- Each line of the recipe is run in a separate shell process, after removing the leading tab.
- Shell commands are separated by a semicolon, and long lines are are read until a new line is encountered. For improved readability, you can break up a long command using a backslash (`\`).

{{< note >}}
All versions of Make use `/bin/sh` as the default shell for portability purposes. You change it by assigning to the `SHELL` variable -- `/bin/bash`. Make inherits almost all of the environment variables exported by the shell that invokes it; `SHELL` is an exception.
{{< /note >}}

## Rules and Prerequisites

As an oversimplified example, this is a makefile for an extremely simple website:

{{< file "makefile" >}}
# everything between a hash-mark and the end of the line is ignored
site/index.html: index.md
    pandoc -s -o site/index.html index.md
{{< /file >}}

This makefile has one rule; Make uses the first rule it encounters in the file as the default. Now, every time `index.md` is modified, Make determines that `site/index.html` is older, and re-makes it.

There are two problems with this. The first is that the first time you run Make in this directory it fails because there is no directory called `site`. Fix this by adding an *order-only prerequisite*, separated from the ordinary prerequisites by a `|`. Make builds order-only prerequisites if they don't exist, but does not try to rebuild them if they are out of date.

{{< file "makefile" >}}
site/index.html: index.md | site
    pandoc -s -o site/index.html index.md

site:
    mkdir -p site
{{< /file >}}

{{< note >}}
A rule with no prerequisites is run only if the target does not exist. Order-only prerequisites are not rebuilt even if they have prerequisites of their own.
{{< /note >}}

The second problem is that, if we want to add an "about" page, the rule to make it won't be the first in the makefile, so Make doesn’t  run it unless we mention *both* targets on the command line.  One way to solve this is to add another rule that depends on both pages:

{{< file "makefile" >}}
.PHONY: build
build:: site/index.html site/about.html

site/index.html: index.md | site
    pandoc -s -o site/index.html index.md

site/about.html: about.md | site
    pandoc -s -o site/about.html about.md

site:
    mkdir -p site

build::
    echo build complete
{{< /file >}}

The `.PHONY` target tells Make that `build` isn't a real file, just the name of a recipe.  Even if a file called `build` gets added to the directory, Make still runs the recipe when you give `build` as a goal on the make command line or as a prerequisite of some other target.

Use a *double-colon* rule for build and notice there are two rules with `build` as their target. Each double-colon rule has its prerequisites checked independently which makes it easy to add additional rules for the same target but different prerequisites. Unlike a single-colon rule, the recipe for a double-colon rule with no prerequisites is always run, even if the file exists. For example:

{{< output >}}
built-on.md::
    date > $@
{{< /output >}}

This uses an *automatic variable*, `$@`, which evaluates to the name of the target.

## Implicit Rules

Start simplifying and, more importantly, generalizing this by replacing the two explicit rules by a single implicit rule. Make has many built-in implicit rules for programs and documents written in several different languages. You can say `make foo` in a directory containing a file called `foo.c` and Make is able to deduce that it needs to use the C compiler to make it. Make doesn't include a built-in rule for turning Markdown into HTML, but you can write a pattern rule that does that.

A pattern rule has a target that contains a single `%` character, which matches a non-empty substring of the target. That substring, called the stem is substituted for `%` wherever it appears in the prerequisites. So we can make the HTML files with a rule like:

{{< output >}}
site/%.html: %.md | site/
    pandoc -s -o $@ $<
{{< /output >}}

In addition to `$@`, which evaluates to the target, this rule uses the automatic variables `$<`, which evaluates to the first prerequisite of the rule in which it appears. You'll find the complete list of automatic variables in the [Automatic Variables](https://www.gnu.org/software/make/manual/make.html#Automatic-Variables) of the manual.

{{< note >}}
Because `$` is used for variable expansion in both Make and the shell, you pass a dollar sign to the shell in a recipe by doubling it. (There's nothing special about this: Make has a built-in variable `$` that evaluates to the string "`$`".)
{{< /note >}}

## Variables

Another way to simplify and generalize a `makefile` is with variables. One obvious use for a variable is the list of targets:

{{< file "makefile" >}}
pages = site/index.html site/about.html
build: $(pages)
site/%.html: %.md | site
        pandoc -s -o $@ $<
{{< /file >}}

{{< note >}}
If the parentheses around the variable name are missing, the variable name is the single character after the dollar sign (which is why most of the automatic variables used in rules, like `$@`, have single-character names).
{{< /note >}}

Make also uses variables like constants, so it's common practice to use uppercase for these in place of program names. Use `PANDOC` to point to `/usr/bin/pandoc`. It’s better in this case to use something generic like `MARKDOWN` in case you want to change it. Include the `pandoc`-specific option `-s` (`--standalone`) in the variable's definition, since other Markdown processors are likely to use a different set of options.

{{< file "makefile" >}}
MARKDOWN = /usr/bin/pandoc -s
pages = site/index.html site/about.html
build: $(pages)
site/%.html: %.md | site
        $(MARKDOWN) -o $@ $<
{{< /file >}}

The variable `MAKE` is treated specially. Make uses it to identify recursive statements in recipes that it needs to execute even if the `-n` (`--just-print`) option is set on the command line, telling Make to "just print" recipes without executing them.  You can find more about using Make recursively in [Section 5.7](https://www.gnu.org/software/make/manual/make.html#Recursion) of the manual.

## Functions

List all the targets in a project for something like a C program, but it's tedious and error-prone for a website. Fortunately, Make has _functions_ for manipulating filenames and other text. Start with `$(wildcard *.md)`, which evaluates to a list of all files in the current directory with a `.md` extension. Then use the `subst` function to replace `.md` with `.html`, and `addprefix` to add the destination directory and you have:

{{< file "makefile" >}}
pages = $(addprefix site/, $(subst .md,.html,$(wildcard *.md)))
{{< /file >}}

Note that instead of `subst` we could have used `basename` and `addsuffix`:

{{< file "makefile" >}}
pages = $(addprefix site/, $(addsuffix .html, $(basename $(wildcard *.md))))
{{< /file >}}

The `shell` function lets you use shell "one-liners" to do things that are difficult or impossible with Make's somewhat limited set of functions. It's better to do things in Make if you can, because it's faster and often significantly more readable. For example:

{{< file "makefile" >}}
DATE := $(shell date --rfc-3339=seconds)
{{< /file >}}

You can find the complete set of functions in [Section 8](https://www.gnu.org/software/make/manual/make.html#Functions) of the manual.

This also demonstrates GNU Make's second kind of variable assignment. Variables assigned with `=` are called "recursively expanded variables". Their value is parsed, and any variables or functions they contain are expanded every time they are used. Most of the time that's what you want. An expression like `$(basename $@)` is  useless unless it is expanded in every recipe it is used in.

"Simply expanded variables" are assigned using `:=` or `::=` The second is the only form recognized by most other versions of Make. Any variables or functions they contain are expanded only once, at the point where the variable is assigned. Using a simply-expanded variable for `DATE` ensures that, no matter how many times you use it, it will always expand to the same string for a given run of Make.

## Updating a website with Make and Git

In “[A web-focused Git workflow](http://joemaller.com/990/a-web-focused-git-workflow/)”, Joe Maller describes a popular way of updating a web site that uses a bare repository on the same server as the site, with a `post-update` hook that pulls from the bare repo into the site's root directory whenever a developer pushes an update. Simply pulling will work as long as all of the website's files are under Git control, but in most cases they are build products. That's where Make comes in.

### A versatile post-update hook

If Git finds an executable file called `/hooks/post-update` in its repository, it is run whenever that website is pushed to. The command line contains the names of all the refs pushed.  This post-update hook runs `make` in the website's directory when changes are pushed:

{{< file "website.git/hooks/post-update" bash >}}
#!/bin/bash
# this hook is written assuming that `website.git` and `website` are
# siblings, i.e. both are subdirectories of the same parent.
unset GIT_DIR; export GIT_DIR
for ref in $*; do
    # The refs being updated are passed on the command line.
    # We are only interested in main.
    if [ "$ref" = refs/heads/main ]; then
        # --ff-only ensures that un-pushed changes won't be overwritten
        git -C ../website pull --ff-only
        # If the website has a makefile, make build
        [[ -f ../website/makefile ]] && make -C ../website build
    fi
done
{{< /file >}}

The `-C` option in both Git and Make tells them to change to the indicated directory. Building on the server means that derived files, some of which can be large, don't have to be under Git control.

## Makefiles for Static Site Builders

Static site builders like Jekyll, which is used for GitHub Pages and Hugo do a great deal for you. If you're supporting more than one site, and they're built with different builders, you can use Make to give them all a uniform command-line interface.

Here is a simple set of recipes for a Jekyll site that can be deployed by pushing either to GitHub Pages, or to a staging server that uses the hook shown in the previous section. The corresponding
remotes are called `github` and `staging`.

{{< file "website.git/hooks/post-update" bash >}}
serve:                       # run a local server for initial testing
    jekyll serve

staging:
    git status
    git push staging main

# this target is invoked by the post-update hook on the staging server
build:
    jekyll JEKYLL_ENV=production build

prod:
    git checkout production
    git merge --ff-only --no-edit main
    git tag -a -m "pushed to production $$(date)"
    git push github production
    git checkout main
{{< /file >}}}

The recipe for `prod` automates all of the git housekeeping around making a release.  GitHub builds Jekyll pages and serves them automatically. The `staging` recipe uses the hook in the previous section to build a copy of the site on your Linode for further testing.

Of course you could go farther and use Make as your static site builder. The first section of this guide gives you an idea of how to start.

This guide covers only a few of GNU Make's potential uses and features. Make's combination of declarative rules, filename and string-processing functions, and shell scripting make it a versatile addition to any programmer's or system administrator's toolkit.

