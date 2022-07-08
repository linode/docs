---
slug: gnu-make-tutorial-automate-tasks
author:
  name: Stephen Savitzky
description: 'In this tutorial, you will learn how to use GNU Make to automate any task that involves updating files or performing actions based on file changes.'
og_description: 'In this tutorial, you will learn how to use GNU Make to automate any task that involves updating files or performing actions based on file changes.'
keywords: ['gnu make tutorial']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-30
image: GNUMakeTutorial-LearntoAutomateTasks.jpg
modified_by:
  name: Linode
title: "GNU Make Tutorial: Learn to Automate Tasks"
h1_title: "Use GNU Make to Automate Tasks"
enable_h1: true
contributor:
  name: Stephen Savitzky
---

[GNU make](https://www.gnu.org/software/make/manual/make.html) is designed as a utility for building large programs. It automatically determines which parts need to be recompiled and issues the commands needed to recompile them. Its uses are not limited to compiling and linking C programs. It can also be a surprisingly effective scripting language for automating any task that involves updating files or performing actions whenever files change.

In this guide `make`  or "Make" always refers to GNU Make; the version found on almost all Linux distributions. It has a number of useful extensions -- pattern rules and simply-expanded variables.

{{< note >}}
The [Features](https://www.gnu.org/software/make/manual/make.html#Features) and [ Incompatibilities and Missing Features](https://www.gnu.org/software/make/manual/make.html#Missing) sections of the [GNU Make Manual](https://www.gnu.org/software/make/manual/make.html) describe GNU Make's differences from the BSD and System V versions.
{{< /note >}}

## Make Basics

Make starts by reading a file called *makefile* that tells it what to do. The makefile is made up of three primary components or *rules*. The *target* contains rules that describe the file(s) to be built. The *prerequisites* point to a file containing any required inputs related to the target. Finally, the *recipe* includes the actions that are to be performed by GNU Make. A typical rule resembles the following example:

{{< file "makefile" >}}
target... : prerequisite...
    recipe...
{{< /file >}}

The recipe is run whenever the target does not exist or if any of its prerequisites has been modified since the last time it was built. The following list outlines some syntax elements and how GNU Make interprets them:

 - Targets and prerequisites are separated by spaces; spaces around the colon are ignored.
 - The recipe is a series of shell commands, each preceded by a **TAB** character. This needs to be a literal tab, not some number of spaces. Any text editor that understands the format of makefiles warns you by showing spaces in the recipe in a different color.
- Each line of the recipe is run in a separate shell process, after removing the leading tab.
- Shell commands are separated by a semicolon, and long lines are read until a new line is encountered. For improved readability, you can break up a long command using a backslash (`\`).

{{< note >}}
All versions of Make use `/bin/sh` as the default shell for portability purposes. Make inherits almost all of the environment variables exported by the shell that invokes it; `SHELL` is an exception.
{{< /note >}}

## Rules and Prerequisites

The file below is an example makefile for an extremely simple website:

{{< file "makefile" >}}
# everything between a hash-mark and the end of the line is ignored
site/index.html: index.md
    pandoc -s -o site/index.html index.md
{{< /file >}}

The makefile contains one rule, and Make uses the first rule it encounters in the file as the default. Now, every time `index.md` is modified, Make determines that `site/index.html` is older and re-makes it.

There are two problems with the behavior outlined above. The first time you run Make in your directory it fails because there is no directory named `site`. You can fix this by adding an *order-only prerequisite*, separated from the ordinary prerequisites by a pipe (`|`). Make builds order-only prerequisites if they don't exist, but does not try to rebuild them if they are out of date. The example file below includes an order-only prerequisite for a directory named `site` (in the current working directory).

{{< file "makefile" >}}
site/index.html: index.md | site
    pandoc -s -o site/index.html index.md

site:
    mkdir -p site
{{< /file >}}

{{< note >}}
A rule with no prerequisites is run only if the target does not exist. Order-only prerequisites are not rebuilt even if they have prerequisites of their own.
{{< /note >}}

The second issue with the original example is the following: when you add a second rule to the example file, Make does not run it. This is a problem if, for example, you wanted to add an about page to your site. Make does not run the rule unless you mention *both* targets on the command line. One way to solve this is to add another rule that depends on both pages:

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

The `.PHONY` target tells Make that `build` isn't a real file, just the name of a recipe. Even if a file called `build` gets added to the directory, Make still runs the recipe when you pass `build` as a goal on the make command line or as a prerequisite of some other target.

Use a *double-colon* rule for build and notice there are two rules with `build` as their target. Each double-colon rule has its prerequisites checked independently which makes it easy to add additional rules for the same target, but different prerequisites. Unlike a single-colon rule, the recipe for a double-colon rule with no prerequisites is always run, even if the file exists. For example:

{{< output >}}
built-on.md::
    date > $@
{{< /output >}}

The example uses an *automatic variable* (`$@`) that evaluates to the name of the target.

## Implicit Rules

To start simplifying and generalizing the example, replace the two explicit rules by a single implicit rule. Make has many built-in implicit rules for programs and documents written in several different languages. If you run the command `make foo` in a directory containing a file named `foo.c`, Make is able to deduce that it needs to use the C compiler to make it. Make doesn't include a built-in rule for turning Markdown into HTML, but you can write a pattern rule that does that.

A pattern rule has a target that contains a single `%` character that matches a non-empty substring of the target. That substring, called the *stem* is substituted for `%` wherever it appears in the prerequisites. You can generate HTML files from Markdown with the following rule:

{{< output >}}
site/%.html: %.md | site/
    pandoc -s -o $@ $<
{{< /output >}}

The rule use `$@`, which evaluates to the target, and also uses the automatic variables `$<`. The automatic variable evaluates to the first prerequisite of the rule in which it appears. You can find the complete list of automatic variables in the [Automatic Variables](https://www.gnu.org/software/make/manual/make.html#Automatic-Variables) section of the GNU Make manual.

{{< note >}}
The `$` is used for variable expansion in both Make and the Shell. For this reason, you pass a `$` to the shell in a Make recipe by doubling it (`$$`).
{{< /note >}}

## Variables

Another way to simplify and generalize a `makefile` is with variables. One obvious use for a variable is the list of targets. You can update your example file in the following way:

{{< file "makefile" >}}
pages = site/index.html site/about.html
build: $(pages)
site/%.html: %.md | site
        pandoc -s -o $@ $<
{{< /file >}}

{{< note >}}
If the parentheses around the variable name are missing, the variable name is the single character after the dollar sign. This is why most of the automatic variables used in rules, like `$@`, have single-character names.
{{< /note >}}

Make also uses variables like constants, so it's common practice to use uppercase for those variables. Use the variable `MARKDOWN` to point to the location of your Markdown processor, `/usr/bin/pandoc`. Include the `pandoc`-specific option `-s` (`--standalone`) in the variable's definition, since other Markdown processors are likely to use a different set of options.

{{< file "makefile" >}}
MARKDOWN = /usr/bin/pandoc -s
pages = site/index.html site/about.html
build: $(pages)
site/%.html: %.md | site
        $(MARKDOWN) -o $@ $<
{{< /file >}}

The variable `MAKE` is a reserved variable used by Make. Make uses it to identify recursive statements in recipes that it needs to execute even if the `-n` (`--just-print`) option is set on the command line. This tells Make to print recipes without executing them. You can find more about using Make recursively in [Section 5.7](https://www.gnu.org/software/make/manual/make.html#Recursion) of the manual.

## Functions

You can use Make *functions* to manipulate filenames and other text. Modify the example to add `$(wildcard *.md)`, which evaluates to a list of all files in the current directory with a `.md` extension. Then use the `subst` function to replace `.md` with `.html`. Use `addprefix` to add the destination directory. The updated example resembles the following:

{{< file "makefile" >}}
pages = $(addprefix site/, $(subst .md,.html,$(wildcard *.md)))
{{< /file >}}

Instead of `subst`, you can also use `basename` and `addsuffix` as demonstrated below:

{{< file "makefile" >}}
pages = $(addprefix site/, $(addsuffix .html, $(basename $(wildcard *.md))))
{{< /file >}}

The `shell` function lets you use shell commands to do things that are difficult or impossible with Make's somewhat limited set of functions. However, it's better to use native-Make functionality if you can, because it's faster and often significantly more readable. The example below shows the usage of the `shell` function:

{{< file "makefile" >}}
DATE := $(shell date --rfc-3339=seconds)
{{< /file >}}

You can find the complete set of Make functions in [Section 8](https://www.gnu.org/software/make/manual/make.html#Functions) of the manual.

The example above demonstrates GNU Make's second kind of variable assignment. Variables assigned with `=` are called *recursively expanded variables*. Their value is parsed, and any variables or functions they contain are expanded every time they are used. Most of the time that's what you want. An expression like `$(basename $@)` is useless unless it is expanded in every recipe it is used in.

Simply expanded variables are assigned using `:=` or `::=`. Most versions of Make recognize the `::=` version of the assignment operator. Any variables or functions they contain are expanded only once; at the point where the variable is assigned. Using a simply-expanded variable for `DATE` ensures that it always expands to the same string for a given run of Make.

## Updating a Website with Make and Git

You can update a website by using a bare Git repository on the same server the hosts your website. A `post-update` hook pulls from the bare repository into the site's root directory whenever a developer pushes an update. Simply pulling works as long as all of the website's files are under Git control, but in many cases the files are build products. That's where Make comes in.

### A Versatile Post-Update Hook

If Git finds an executable file called `/hooks/post-update` in its repository, it is run whenever that website is pushed to. The command line contains the names of all the refs pushed. The example post-update hook runs `make` in the website's directory when changes are pushed:

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

If you're supporting more than one static site and builder on your server, you can use Make to give them all a uniform command-line interface. The example below contains a simple set of recipes for a Jekyll site. The site can be deployed by pushing either to GitHub Pages, or to a staging server that uses the hook shown in the previous section. The corresponding remotes are called `github` and `staging`.

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
{{< /file >}}

The recipe for `prod` automates all of the Git housekeeping around making a release. GitHub builds Jekyll pages and serves them automatically. The `staging` recipe uses the hook in the previous section to build a copy of the site on your Linode for further testing. This guide covers only a few of GNU Make's potential uses and features. Make's combination of declarative rules, filename and string-processing functions, and Shell scripting make it a versatile addition to any programmer's or system administrator's toolkit.

