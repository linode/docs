---
slug: creating-git-aliases
description: 'This guide shows you how to create Git aliases using the Git configuration files. You also learn how to write and execute a Bash script to customize Git.'
keywords: ['git alias','git config alias']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-04-01
modified_by:
  name: Linode
title: "Create Git Aliases to Quickly Run Git or Shell Commands"
authors: ["Stephen Savitzky"]
---

To customize Git on your computer, you have two options. The first method to customize Git is using *aliases* that are stored in a Git configuration file. The second way is using *custom programs* that Git finds by looking in your system's `$PATH` for executable programs. These programs must be named with a `git-` prefix. These methods are similar to the way shells, like Bash, are extended. Git, however, has multiple configuration files, which lets you make repo-specific aliases.

## Git Aliases

Git aliases let you define short names for longer Git commands. The best place to define your Git aliases is in your home directory's `.gitconfig` file. Add the alias definitions in the `[alias]` section of the file. For example:

{{< file "~/example_user/.gitconfig" >}}
[alias]
    st = status
    amend = commit -a --amend
{{</ file >}}

The example `.gitconfig` file defines `st` as an alias for the `git status` command, and `amend` as an alias for `git commit -a --amend` command. The alias is replaced by its definition following the `git` command. Anything after the alias on the command line comes after the definition, so the following two commands are equivalent:

    git amend --no-edit
    git commit -a --amend --no-edit

An alias definition doesn't have to start with a subcommand; it can include parameters that come before the subcommand as well as after it. For example, you can create an alias with the following definition:

{{< file "~/example_user/.gitconfig" >}}
ps = --paginate status
{{</ file >}}

The `--paginate status` flag paginates the output of the `git status` command. The list of options that can precede the subcommand can be found by viewing Git's `man` page.

## Git Aliases for Shell Commands

Git aliases aren't confined to Git subcommands and their options. An alias prefixed with an exclamation point is passed directly to the shell instead of to Git. For example:

{{< file "~/example_user/.gitconfig" >}}
[alias]
    ...
    k = !gitk --all&
    top = !pwd
{{</ file >}}

The `k` alias runs the GUI repository browser [GitKraken](https://www.gitkraken.com/) in the background. The `top` alias prints out the top level of the working tree, because that's where Git runs shell aliases. As with ordinary aliases, the expanded alias is followed by the arguments that you would normally pass to the command on the command line. For example:

{{< file "~/example_user/.gitconfig" >}}
[alias]
    ...
    f = !git ls-files | grep
{{</ file >}}

The alias definition above finds filenames that contain a given string. To run the above alias on the command line, you issue the following command:

    git f example_filename

Sometimes you need the command-line arguments someplace other than the end of the command. You can often handle simple cases by defining and invoking a shell function. So, in the previous example, you might want to pass an argument to `git-ls-files`; for example `--modified`. You can do that with the following modification to your alias.

{{< file "~/example_user/.gitconfig" >}}
[alias]
    ...
    g = "!f () { git ls-files $2 | grep $1; }; f"
{{</ file >}}

To pass options to `grep` do so by quoting the first argument, e.g. `git g "-i foo"`.

## Local Git Aliases

Use the `git-config` subcommand to define aliases from the command line without using an editor. For example:

    git config --global alias.ls 'log --oneline'

Without the `--global` parameter, `git-config` makes its configuration changes in the local repository, i.e. in `.git/config`.

You can remove the aliases you created with the `git config` command in the following way:

    git config --unset alias.build

## Modifying Git With Scripts

Aliases work for many simple extensions, but more complicated subcommands are best implemented as separate scripts. These Git scripts can be written in Bash, or another scripting language, like Python.

Adding a new subcommand to Git is similar to adding a new command to your operating system. This requires that you add your script to a file, make it executable, and store it in a directory that is available to your `$PATH`. These directories are typically `~/bin` or `/usr/local/bin`. Git only does two things differently from what Bash or any other shell does. It finds the program name by looking for the `git-` prefix. It also looks in some high-priority directories first before looking in the directories listed in your system `$PATH`.

Use the command below to locate where Git stores its core commands. On most Linux systems, the location is `/usr/lib/git-core`:

    git --exec-path

{{< output >}}
/usr/lib/git-core
{{</ output >}}

For information on Bash scripting, refer to our [Introduction to Bash Shell Scripting](/docs/guides/intro-bash-shell-scripting/) guide. This guide on Bash includes topics like, Bash variables, if statements, and getting user input from the command line. The examples found in the Bash shell scripting guide can help you construct your scripts to modify Git's behavior.

### Git Script Example

You can implement the first example in the [Aliases for Shell Commands](#git-aliases-for-shell-commands) section with a Bash script. Improve the example by passing `gitk`, making `--all` the default option if no arguments are given.

{{< file "~/git-example-scrip.sh" >}}
#!/bin/bash
#  run gitk in the background.
#  Defaults to --all if no parameters provided on the command line

if [ -z "$*" ]; then
    gitk --all &
else
    gitk $* &
fi
{{</ file >}}

Remember, your script must be executable in order for you to run it. From the directory that stores your script, update your script's permissions with the following command:

    chmod 755 git-example-script.sh

Now, execute the your custom Git script:

    ./git-example-script.sh

You can apply the same steps for any Git script that you create with your Git customizations.