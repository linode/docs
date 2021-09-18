---
slug: how-to-use-tldr-pages
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how to use tldr-pages through the tldr command-line tool. With tldr-pages, you get a more approachable version of traditional man pages, making it easier to get started with new command-line tools."
og_description: "Learn how to use tldr-pages through the tldr command-line tool. With tldr-pages, you get a more approachable version of traditional man pages, making it easier to get started with new command-line tools."
keywords: ['tldr pages linux','tldr man pages','tldr linux command']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-18
modified_by:
  name: Nathaniel Stickman
title: "How to Use tldr-pages on Linux"
h1_title: "How to Use tldr-pages on Linux"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
---

The tldr-pages project, similar to man pages, offers pages describing wide range of commands and options you can use with them. But, compared to man pages, each tldr page aims to be more intuitive and readable, making tldr-pages a great place to start when learning new commands.

In this guide, learn more about tldr-pages and how its pages compare to man pages. Additionally, learn how to start using tldr-pages via the `tldr` command-line tool, which this guide shows you how to install and use `tldr`.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, you can do this with:

            sudo apt update && sudo apt upgrade

    - On AlmaLinux, CentOS (8 or later), or Fedora, use:

            sudo dnf upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What is tldr-pages?

The [tldr-pages project](https://github.com/tldr-pages/tldr) aims to provide a simple alternative to man pages, one that emphasizes readability and practical examples.

As with man pages, you can use tldr-pages to find a description of a command and its available options. But, unlike man pages, tldr-pages does not try to provide a comprehensive list of options for each command. Instead, it focuses on each command's most useful options and giving clear and practical examples for each.

The result is a resource that can make it much easier to learn and start using a new command. A command's man page can be useful if you know the command and want to work out specific actions, but can be difficult to engage with if you are new. A command's tldr page, on the other hand, introduces you to a command, and often gives you everything you need short of advanced usage.

## How to Install tldr

To interact with tldr-pages, you can use one of the `tldr` clients. These give you access to tldr-pages from the command line or other, in some cases, other platforms.

Several `tldr` clients are available, and you can see the full listing on the check out the `tldr` [GitHub page](https://github.com/tldr-pages/tldr#how-do-i-use-it).

This guide gives you installation steps for two of the more popular clients, one using Node.js and the other using Python 3. Take a look at the each client's section below to see how you can install the clients on your Linux system.

### Using Node.js

1. Install NPM. The recommended way to do this is by first installing the Node Version Manager (NVM).

    You can use the series of commands shown below to first install NVM and then use it to install the current version of Node.js. The Node.js installation includes the current NPM release.

    Before proceeding, check the NVM [releases page](https://github.com/nvm-sh/nvm/releases), and replace `v0.38.0` below with the version number of the latest release you find there:

        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
        source ~/.bashrc
        nvm install node

    You can then verify your NPM installation with:

        npm --version

    {{< output >}}
7.21.0
    {{< /output >}}

1. Install `tldr` via NPM. Use the `-g` option to install `tldr` as a global NPM package:

        npm install tldr -g

### Using Python 3

1. Make sure you have Python 3 installed.

    On Debian and Ubuntu, recent releases include Python 3 by default, which you can verify:

        python3 --version

    {{< output >}}
Python 3.8.10
    {{< /output >}}

    On AlmaLinux, CentOS (8 or later), and Fedora, use the command below to install Python 3:

        sudo dnf install python3

1. Install `tldr` via Pip 3, the default package installer for Python 3:

        sudo pip3 install tldr

## How to Use tldr

You can start using `tldr` simply by entering it in the command line followed by the name of a command you want to know more about. For example, you can get the tldr page for the `ls` command with:

    tldr ls

{{< output >}}
  ls

  List directory contents.
  More information: https://www.gnu.org/software/coreutils/ls.

  - List files one per line:
    ls -1

  - List all files, including hidden files:
    ls -a

  - List all files, with trailing `/` added to directory names:
    ls -F

  - Long format list (permissions, ownership, size, and modification date) of all files:
    ls -la

  - Long format list with size displayed using human-readable units (KiB, MiB, GiB):
    ls -lh

  - Long format list sorted by size (descending):
    ls -lS

  - Long format list of all files, sorted by modification date (oldest first):
    ls -ltr

  - Only list directories:
    ls -d */
{{< /output >}}

By way of contrast, here is an excerpt from the extensive man page for `ls`:

    man ls

{{< output >}}
LS(1)                                                                            User Commands                                                                            LS(1)

NAME
       ls - list directory contents

SYNOPSIS
       ls [OPTION]... [FILE]...

DESCRIPTION
       List information about the FILEs (the current directory by default).  Sort entries alphabetically if none of -cftuvSUX nor --sort is specified.

       Mandatory arguments to long options are mandatory for short options too.

       -a, --all
              do not ignore entries starting with .

       -A, --almost-all
              do not list implied . and ..

       --author
              with -l, print the author of each file

       -b, --escape
              print C-style escapes for nongraphic characters

       --block-size=SIZE
              with -l, scale sizes by SIZE when printing them; e.g., '--block-size=M'; see SIZE format below

       -B, --ignore-backups
              do not list implied entries ending with ~
[...]
{{< /output >}}

As you can see, the tldr page focuses on giving you clear descriptions and examples of some of the most relevant options for the command. The man page, on the other hand, focuses on a comprehensive listing of options. Thus, man pages' descriptions of options are not always clear and can fall short in helping you find the most useful options.

Here is another example that goes even further in illustrating the contrast:

    tldr vim

{{< output >}}
  vim

  Vim (Vi IMproved), a command-line text editor, provides several modes for different kinds of text manipulation.
  Pressing `i` enters insert mode. `Esc` enters normal mode, which enables the use of Vim commands.
  More information: https://www.vim.org.

  - Open a file:
    vim path/to/file

  - Open a file at a specified line number:
    vim +line_number path/to/file

  - View Vim's help manual:
    :help<Enter>

  - Save and Quit:
    :wq<Enter>

  - Undo the last operation:
    u

  - Search for a pattern in the file (press `n`/`N` to go to next/previous match):
    /search_pattern<Enter>

  - Perform a regular expression substitution in the whole file:
    :%s/regular_expression/replacement/g<Enter>

  - Display the line numbers:
    :set nu<Enter>
{{< /output >}}

And here again is an excerpt from the man page for comparison:

    man vim

{{< output >}}
VIM(1)                                                                      General Commands Manual                                                                      VIM(1)

NAME
       vim - Vi IMproved, a programmer's text editor

SYNOPSIS
       vim [options] [file ..]
       vim [options] -
       vim [options] -t tag
       vim [options] -q [errorfile]

       ex gex
       view
       gvim gview vimx evim eview
       rvim rview rgvim rgview

DESCRIPTION
       Vim is a text editor that is upwards compatible to Vi.  It can be used to edit all kinds of plain text.  It is especially useful for editing programs.

       There  are  a  lot  of enhancements above Vi: multi level undo, multi windows and buffers, syntax highlighting, command line editing, filename completion, on-line help,
       visual selection, etc..  See ":help vi_diff.txt" for a summary of the differences between Vim and Vi.

       While running Vim a lot of help can be obtained from the on-line help system, with the ":help" command.  See the ON-LINE HELP section below.

       Most often Vim is started to edit a single file with the command

            vim file

       More generally Vim is started with:

            vim [options] [filelist]

       If the filelist is missing, the editor will start with an empty buffer.  Otherwise exactly one out of the following four may be used to choose one or more files  to  be
       edited.

       file ..     A  list of filenames.  The first one will be the current file and read into the buffer.  The cursor will be positioned on the first line of the buffer.  You
                   can get to the other files with the ":next" command.  To edit a file that starts with a dash, precede the filelist with "--".

       -           The file to edit is read from stdin.  Commands are read from stderr, which should be a TTY.

       -t {tag}    The file to edit and the initial cursor position depends on a "tag", a sort of goto label.  {tag} is looked up in the tags file, the associated file becomes
                   the  current  file and the associated command is executed.  Mostly this is used for C programs, in which case {tag} could be a function name.  The effect is
                   that the file containing that function becomes the current file and the cursor is positioned on the start of the function.  See ":help tag-commands".

       -q [errorfile]
                   Start in quickFix mode.  The file [errorfile] is read and the first error is displayed.  If [errorfile] is  omitted,  the  filename  is  obtained  from  the
                   'errorfile'  option  (defaults  to "AztecC.Err" for the Amiga, "errors.err" on other systems).  Further errors can be jumped to with the ":cn" command.  See
                   ":help quickfix".
[...]
{{< /output >}}

Notice that, with the tldr page, there is little reference to command-line arguments. This is because Vim does not frequently use them. Instead, the tldr page focuses on the commands you may want to use within Vim, which is much more helpful in getting started using a tool like Vim.

By contrast, the man page does not provide anything on commands you can use once you have Vim up and running. Instead, true to its goal, the man page gives you an exhaustive list of command-line options. It even includes the seldom-used alternative command names for starting Vim in different modes.

### How to Use tldr-pages and man Pages Together

tldr-pages works best when used in conjunction with man pages. With a command's tldr page, you get a clear and succinct introduction to the command. The inclusion of examples and focus on generally useful commands makes the tldr page a valuable place to start.

But the tldr-pages format necessary leaves some information out for many commands. For instance, say you see the following `ls` command:

    ls -Alh

The tldr page informs you that the `-l` and `-h` options give you a long-listing format and human-readable file sizes, respectively. But, then, what does the `-A` option do? That is where the man page can be useful.

Typically, this is a good method to keep in mind when using tldr-pages. A command's tldr page frequently contains all you need to get started; sometimes, you need nothing more than what the tldr page offers. But then, if you find yourself needing to dig deeper into a command, you can build off of what you learn on the tldr page with the wealth of details you can find on the man page.

## Conclusion

You now have the knowledge you need to get started using tldr-pages in your daily life! It might be helpful to go ahead and start checking out the tldr pages for some commands you are already using. That way, you get to know tldr-pages better and maybe learn something toward getting more out of those commands.

Do you see something missing while looking over a tldr page? Is there a command you notice does not have a tldr page yet? Or do you just like what tldr-pages is doing and want to be a part of it? The tldr-pages project maintainers keep an open invitation for contributors. All of the tldr pages are stored on the project's [GitHub repository](https://github.com/tldr-pages/tldr), and the tldr team provides a [guide for contributing](https://github.com/tldr-pages/tldr/blob/main/CONTRIBUTING.md).

