---
slug: how-to-use-the-linux-alias-command
author:
  name: Linode
  email: docs@linode.com
description: 'Using the command line terminal in Linux is a convenient and fast way to interface with the operating system. To make your life easier, the alias command helps save you time. alias is like a shortcut that you can customize.'
og_description: 'Using the command line terminal in Linux is a convenient and fast way to interface with the operating system. To make your life easier, the alias command helps save you time. alias is like a shortcut that you can customize.'
keywords: ["linux alias command"]
aliases: ['/quick-answers/linux/how-to-use-the-linux-alias-command/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-11-06
modified_by:
  name: Heather Zoppetti
published: 2020-11-06
title: How to Use the Linux Alias Command
h1_title: Using the Linux Alias Command
tags: ["linux"]
---

Using the command line terminal in Linux is a convenient and fast way to interface with the operating system. You issue commands in the terminal to make the system do what you want. Often, you end up sending the same commands again and again and some of these commands can be lengthy, hard to remember, or just repetitive. To make your life easier, the `alias` command helps save you time. `alias` is like a shortcut that you can customize.

## List Current Aliases

Most, if not all, systems have some aliases configured by default. You can list them by running the command `alias`:

    alias

Here is the output from Ubuntu 20.04:

{{< output >}}
alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert$//'\'')"'
alias egrep='egrep --color=auto'
alias fgrep='fgrep --color=auto'
alias grep='grep --color=auto'
alias l='ls -CF'
alias la='ls -A'
alias ll='ls -alF'
alias ls='ls --color=auto'
{{</ output >}}

## How to Create an Alias

There are two ways to create aliases for your use, temporary and permanent. Temporary aliases are only available to use until you close your current terminal session. Permanent aliases are saved to the shell configuration file and are available for every session you create.

### Overwriting Command Names

It's typical when creating aliases to give them unique names that don't conflict with other utilities or existing commands. However, you can also purposefully overwrite command names with an alias to force a command to always take an option or replace it with a different command. For example, you can tell the `top` command to run `htop` instead. Or you can have `ls` always run `ls -lah`. If you want to run the original command without the alias, simply run it with a prepended `\`. For example:

    \top

### Create a Temporary Alias

Create a temporary alias by using the alias command followed by the shortcut and the command you want it to replace.

For example:

    alias shortcut="your custom command"

For a more concrete example, say you want to create an alias to update and upgrade your system without having to type the entire command `sudo apt update && sudo apt upgrade`. You can make an alias for this called `update`:

    alias update="sudo apt update && sudo apt upgrade"

To have the `top` command run `htop` instead:

    alias top="htop"

### Create a Permanent Alias

Again, temporary aliases are only good for the current terminal session. Once you close that session, they are no longer available. To make them permanent, you can save your aliases in the shell configuration file. Depending on your shell, this file could be:

- Bash: ~/.bashrc
- ZSH: ~/.zshrc
- Fish: ~/.config/fish/config.fish

The syntax for creating a permanent alias is the same as creating a temporary one. However, now you save it in the configuration file.

With your preferred text editor, open the configuration file, in this example, `~/.bashrc`. There may be other things in this file. You can add your aliases anywhere in this file, one alias per line. It's probably best to keep your aliases grouped together.

{{< file "~/.bashrc" >}}
...

#aliases
alias update="sudo apt update && sudo apt upgrade"
alias top="htop"

...
{{</ file >}}

Any newly added aliases are available for use in your next terminal session; they are not immediately available for any current sessions.

If you wish to use them right away in a current session, use one of the following commands:

    source ~/.bashrc
    source ~/.zshrc
    source ~/.config/fish/config.fish

## Remove Aliases

To remove an alias, use the `unalias` command:

    unalias alias-name

For example, for our `update` alias above, to remove this:

    unalias update

To remove all aliases:

    unalias -a

{{< note >}}
Removing all aliases also removes the system default aliases.
{{</ note >}}

## Helpful Examples

Here are some helpful alias examples that you may wish to save.

To go change quickly into a specific directory that you visit often, you can set an alias:

    alias docs="cd /Users/exampleuser/mydirectory/docs"

If you work in Python, you can use these two aliases to create a virtual environment quickly:

    alias ve='python3 -m venv ./venv'
    alias va='source ./venv/bin/activate'

Use this alias to find your external IP quickly:

    alias ipe="curl ipinfo.io/ip"

If you use `git` and wish to see an output of differences between the current branch you are on and the development branch, change `development` to whatever branch name you want to compare:

    alias gdd="git diff --name-only $(git merge-base $(git rev-parse HEAD) development)"

Again, for `git`, if you want to view a list of your most recent branches:

    alias glh="git for-each-ref --sort=-committerdate refs/head | head"
