---
slug: faster-file-navigation-with-autojump
description: 'autojump is a cd command that learns - jump to your most frequently visited directories.'
og_description: "Navigate files in the command line more efficiently with autojump, a tool that jumps to your most frequently accessed directories."
keywords: ["autojump", "python", "command-line"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-12-29
modified_by:
  name: Sam Foo
published: 2017-12-29
title: Faster File Navigation with autojump
external_resources:
 - '[autojump GitHub](https://github.com/wting/autojump)'
 - '[Autojump Is a Faster Way to Browse Your Filesystem – Lifehacker](https://lifehacker.com/5583546/autojump-is-a-faster-way-to-browse-your-filesystem)'
tags: ["linux"]
aliases: ['/tools-reference/tools/faster-file-navigation-with-autojump/']
authors: ["Sam Foo"]
---

## What is autojump?

`autojump` is a command line utility similar to `cd`. It helps speeds up file navigation by maintaining a history of directories that have been previously navigated by the user. If there are directories with the same name, `autojump` maintains a weighted history to favor the most frequently accessed directory.

## Install autojump

This guide will cover installation on Linux and MacOS. Support for Windows [is limited](https://github.com/wting/autojump#known-issues).

### Debian/Ubuntu

1.  Install the `autojump` package:

        sudo apt install autojump

2.  On Debian-based distros, manual activation is required. Add the following line to `~/.bashrc`(for Bash) or `~/.zshrc` (if you use zsh):

      {{< file "~/.bashrc" >}}
. /usr/share/autojump/autojump.sh
{{< /file >}}

More information is available in the README:

    cat /usr/share/doc/autojump/README.Debian

### CentOS

    yum install autojump

For shell specific installation, use `autojump-zsh` for zsh and `autojump-fish` for fish.

### MacOS

The recommended installation method is to use [Homebrew](https://brew.sh/):

    brew install autojump

Be sure to follow the instructions and add the line from installation into the corresponding configuration file. If using `oh-my-zsh`, add `autojump` as a plugin.

    {{< output >}}
Add the following line to your ~/.bash_profile or ~/.zshrc file (and remember
to source the file to update your current session):
  [[ -s `brew --prefix`/etc/autojump.sh ]] && . `brew --prefix`/etc/autojump.sh
{{< /output >}}

### Install autojump via Python

1.  Ensure that git is installed, navigate to the directory where autojump should be installed, then clone the autojump repo:

        git clone git://github.com/joelthelion/autojump.git

2.  Run the install script:

        cd autojump/
        ./install.py

    {{< note respectIndent=false >}}
autojump supports Python 2.6+, with the exception of 3.2.
{{< /note >}}

## How to Use autojump

Both `autojump` and `j` are equivalent for most purposes. `j` is preferred for convenience.

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

3.  Run `j -s` again. The new weights should be reflected in the results:

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

A more comprehensive description of the arguments can be found with:

    j --help

### Jump to a Directory

Jump to a directory:

    j bar

### Jump to a Child Directory

Jumping to a child with `c` is supported:

    jc foo

### Jump with Multiple Arguments

Multiple arguments can be used with partial names of the full path.

    j fu bar

### Open Using File Manager

The `o` command opens the file manager and can also be used in conjunction with `c`.

    jco fuu

### Purge Deleted Directories from autojump

When a directory is deleted, its weights remain in autojump's records. You should regularly purge these weights to prevent autojump from navigating to nonexistent directories.

1.  Navigate to the home directory and delete the `foo/` directory:

        cd ~
        rm -rf foo/

2.  Purge the deleted directory from autojump:

        j --purge

## Common Issues

* `autojump` can only be used to jump to directories that have been visited after installation. If you attempt to jump to a directory not yet visited, `autojump` will return `.`

    Visit the directory before attempting to jump.

* When using `oh-my-zsh`, opening a new Z shell causes the following error:

    {{< output >}}
/Users/linode/.rvm/scripts/initialize:48: __rvm_cleanse_variables: function definition file not found
/Users/linode/.rvm/scripts/initialize:50: command not found: rvm_error
{{< /output >}}

    Make sure `autojump` is added as a plugin in `.zshrc` then remove all `zcomp*` files.

        rm ~/.zcomp*
