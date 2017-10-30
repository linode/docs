---
author:
  name: Sam Foo
  email: docs@linode.com
description: 'A cd command that learns - jump to your most frequently visited directories.'
og_description: "Navigate files in the command line more efficiently with autojump, a tool that jumps to your most frequently accessed directories."
keywords: ["autojump", "python", "command-line"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-12-29
modified_by:
  name: Sam Foo
published: 2017-12-29
title: Faster File Navigation with Autojump
external_resources:
 - '[Github autojump](https://github.com/wting/autojump)'
---

`autojump` helps speeds up file navigation by maintaining a history of directories that have been navigated by the user. Even if there are directories with the same name, `autojump` maintains a weighted history to favor the most frequently accessed directory.

## Installation
Although there is limited support for Windows, this guide will focus on Linux and OS X.

### Ubuntu

    sudo apt install autojump

### CentOS

    yum install autojump

{{< note >}}
For shell specific installation, use `autojump-zsh` for zsh and `autojump-fish` for fish.
{{< /note >}}

### OS X

1.  Recommended installation is through Homebrew

        brew install autojump

    Be sure to follow the instructions and add the line from installation into the corresponding configuration file. If using `oh-my-zsh`, add `autojump` as a plugin.

    {{< output >}}
Add the following line to your ~/.bash_profile or ~/.zshrc file (and remember
to source the file to update your current session):
  [[ -s `brew --prefix`/etc/autojump.sh ]] && . `brew --prefix`/etc/autojump.sh
{{< /output >}}

### Installation via Python

1.  Ensure git is installed.

        git clone git://github.com/joelthelion/autojump.git

2.  Use the install script.

        cd autojump/
        ./install.py

    {{< note >}}
Supported versions are Python 2.6+ with the exception of 3.2
{{< /note >}}

## Quickstart
Both `autojump` and `j` are equivalent for most purposes with `j` being preferred for convenience.

1.  Before jumping to any directory, check the weights of the installation:

        j -s

    Since no directories have been visited since installation, the total weight is 0.

    {{< output >}}
________________________________________

0:       total weight
0:       number of entries
0.00:    current directory weight

data:    /Users/linode/Library/autojump/autojump.txt
{{< /output >}}

2.  Create an example directory and child. Visit each directory then navigate back to home.

        mkdir -p foo/bar/
        mkdir -p fuu/bar/
        cd foo/
        cd bar/
        cd ~
        cd fuu/
        cd bar/
        cd ~

3.  Run `j -s` again. The new weights should be reflected after vising each directory.

    {{< output >}}
10.0:   /Users/linode/foo
10.0:   /Users/linode/foo/bar
10.0:   /Users/linode/fuu/bar
10.0:   /Users/linode/fuu
________________________________________

40:      total weight
4:       number of entries
0.00:    current directory weight

data:    /Users/linode/Library/autojump/autojump.txt
{{< /output >}}

A more complete description of arguments can be found by:

    j --help

### Jump to a Directory

Jump to a directory.

    j bar

### Jump to a Child

Jumping to a child with `c` is supported.

    jc foo

### Jump with Multiple Arguments

Notice that multiple arguments can be used with partial names of the full path.

    j fu bar

### Open the File Manager

The `o` command opens the file manager and can also be used in conjunction with `c`.

    jco fuu

## Purge Deleted Directories

Navigate to the home directory. Delete the `foo/` directory.

    rm -rf foo/
    j --purge

As expected, two entries were purged from this command.

## Common Issues

1.  Jumping to directories returns `.`

    **Solution:**

    Ensure the directory has been previously visited before attempting to jump.

2.  When using `oh-my-zsh`, opening a new Z shell is met with the following error:

    {{< output >}}
/Users/linode/.rvm/scripts/initialize:48: __rvm_cleanse_variables: function definition file not found
/Users/linode/.rvm/scripts/initialize:50: command not found: rvm_error
{{< /output >}}

    **Solution:**

    Make sure `autojump` is added as a plugin in `.zshrc` then remove all `zcomp*` files.

        rm ~/.zcomp*

