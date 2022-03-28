---
slug: create-git-aliases
author:
  name: Stephen Savitzky
description: 'This guide shows you how to create Git aliases using the Git config file.'
keywords: ['git alias','git config alias']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-03
modified_by:
  name: Linode
title: "Create Git Aliases"
h1_title: "How to Create Git Aliases"
enable_h1: true
contributor:
  name: Stephen Savitzky
  link: https://github.com/ssavitzky/
---

There are two ways to customize Git–*Aliases*, which Git finds in its configuration files, and *custom programs*, which Git finds by looking along your `$PATH` for executable programs with names that start with `git-`. This is almost the same as the way shells, like Bash, can be extended. Git, however, has multiple configuration files, which lets you make repo-specific aliases.

## Aliases

Aliases let you define short names for longer Git commands. The best place to define your Git aliases is in your home directory's `.gitconfig` file. Add the alias definitions in the `[alias]` section of the file. For example:

{{< file "~/example_user/.gitconfig" >}}
[alias]
    st = status
    amend = commit -a --amend
{{</ file >}}

The example `.gitconfig` file defines `st` as an alias for the `git status` command, and `amend` as an alias for `git commit -a --amend` command. The alias is replaced by its definition following the `git` command. Anything after the alias on the command line comes after the
definition, so the following two commands are equivalent:

    git amend --no-edit
    git commit -a --amend --no-edit

An alias definition doesn't have to start with a subcommand; it can include parameters that come before the subcommand as well as after it. For example, you can create an alias with the following definition:

{{< file "~/example_user/.gitconfig" >}}
ps = --paginate status
{{</ file >}}


The `--paginate status` flag paginates the output of the `git status` command. The list of options that can precede the subcommand is on Git's `man` page.

## Aliases for Shell Commands

Git aliases aren't confined to Git subcommands and their options. An alias prefixed with an exclamation point is passed directly to the shell instead of to Git. For example:

{{< file "~/example_user/.gitconfig" >}}
[alias]
    ...
    k = !gitk --all&
    top = !pwd
{{</ file >}}

The `k` alias runs the GUI repository browser [GitKraken](https://www.gitkraken.com/) in the background. The `top` alias prints out the top level of the working tree, because that's where Git runs shell aliases. As with ordinary aliases, the expanded alias is followed by whatever arguments followed the alias on the command line. For example:

{{< file "~/example_user/.gitconfig" >}}
[alias]
    ...
    f = !git ls-files | grep
{{</ file >}}

The alias definition above finds filenames that contain a given string. To run the above alias on the command line, you issue the following command:

    git f example_filename

Sometimes you need the command-line arguments someplace other than the end of the command. You can often handle simple cases by defining and invoking a shell function. So in the previous example, you might want to pass an argument to `git-ls-files`; for example `--modified`.
You can do that with the following modification to your alias.

{{< file "~/example_user/.gitconfig" >}}
[alias]
    ...
    g = "!f () { git ls-files $2 | grep $1; }; f"
{{</ file >}}

To pass options to `grep` do so by quoting the first argument, e.g. `git g "-i foo"`.

## Local Aliases

Use the `git-config` subcommand to define aliases from the command line without using an editor. For example:

    git config --global alias.ls 'log --oneline'

Without the `--global` parameter, `git-config` makes its configuration changes in the local repository, i.e. in `.git/config`.

You can remove the aliases you created with the `git config` command with the following command:

    git config --unset alias.build

## Scripts

Aliases work for many simple extensions, but more complicated subcommands are best implemented as separate programs, often written in Bash, or some other scripting language.

Adding a new subcommand to Git is almost the same as adding a new command to your operating system. This requires that you create a script, make it executable, and store it in a directory that is available to your `$PATH`. These directories are typically `~/bin` or `/usr/local/bin`. Git only does two things differently from what Bash or any other shell does. It gets the program name by prepending `git-` to the subcommand name, and it looks in some high-priority places first before looking in the directories listed in `$PATH`.

Find out where Git keeps its core commands with the `--exec-path` option. On most Linux systems, the location is `/usr/lib/git-core`:

    git --exec-path

{{< output >}}
/usr/lib/git-core
{{</ output >}}

### Script Example

You can implement the first example in the Aliases for Shell Commands section with a shell script. Improve the example by passing `gitk`, the options on the rest of the command line, making `--all` the default if no arguments are given.

{{< file "~/example_script.sh" >}}
#!/bin/bash
#  run gitk in the background.
#  Defaults to --all if no parameters provided on the command line

if [ -z "$*" ]; then
    gitk --all &
else
    gitk $* &
fi
{{</ file >}}