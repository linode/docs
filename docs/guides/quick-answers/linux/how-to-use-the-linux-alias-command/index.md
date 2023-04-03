---
slug: how-to-use-the-linux-alias-command
description: 'Save time with the Linux "alias" command by creating customizable shortcuts.'
keywords: ["linux alias command"]
aliases: ['/quick-answers/linux/how-to-use-the-linux-alias-command/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-11-06
modified_by:
  name: Heather Zoppetti
published: 2020-11-17
title: Using the Linux alias Command
title_meta: How to Use the Linux alias Command
tags: ["linux"]
authors: ["Linode"]
---

The command line terminal is a convenient and fast tool for interfacing with the Linux operating system. However, you may find yourself sending the same commands again and again while issuing instructions to your system. This may cost you a significant amount of time, especially if your commands are lengthy, hard to remember, or just repetitive. To help save time and reduce frustration, this guide shows you how to use the `alias` command to create customizable shortcuts.

## List Current Aliases

Most if not all systems have some aliases configured by default. You can list them by running the command `alias`:

    alias

Here is the output from the default installation of Ubuntu 20.04:

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

## Overwriting Command Names

It's typical to create aliases with unique names that don't conflict with other utilities or existing commands. You can also purposefully overwrite command names with `alias` so they always take certain options, or replace them with different names. For example, you can have the `top` command run `htop` instead. Or you can have `ls` always run as `ls -lah`.

If you later want to run an original command without an alias, simply prepend `\` to the command. For example:

    \top

## How to Create an Alias

There are two ways to create aliases for your use: temporary or permanent. [Temporary aliases](#create-a-temporary-alias) are only available to use until you close your current terminal session. [Permanent aliases](#create-a-permanent-alias) are saved to the shell configuration file and are available for every new session you create.

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

With your preferred text editor, open the appropriate configuration file, such as `~/.bashrc`. Enter one alias per line. While you can add your aliases anywhere in this file, grouping them together makes them easier to reference and adjust.

{{< file "~/.bashrc" >}}
...

#aliases
alias update="sudo apt update && sudo apt upgrade"
alias top="htop"

...
{{</ file >}}

Any newly added aliases are available for use in your next terminal session; they are not immediately available for any current sessions.

If you wish to use them right away in a current session, use one of the following commands as appropriate:

    source ~/.bashrc
    source ~/.zshrc
    source ~/.config/fish/config.fish

## How to Remove Aliases

To remove an alias, use the `unalias` command:

    unalias alias-name

For example, to remove the `update` temporary alias from [above](#create-a-temporary-alias), enter:

    unalias update

To remove all aliases:

    unalias -a

{{< note respectIndent=false >}}
Removing all aliases also removes the system default aliases.
{{< /note >}}

## Helpful Examples

Here are some helpful `alias` examples that you may wish to save:

1.  To change quickly into a specific directory that you visit often, you can set an alias:

        alias docs="cd /Users/exampleuser/mydirectory/docs"

1.  If you work in Python, you can use these two aliases to create a virtual environment quickly:

        alias ve='python3 -m venv ./venv'
        alias va='source ./venv/bin/activate'

1.  Use this alias to find your external IP quickly:

        alias ipe="curl ipinfo.io/ip"

1.  If you use `git` and wish to see the differences between your current branch the development branch (change `development` to any other branch you wish to compare):

        alias gdd="git diff --name-only $(git merge-base $(git rev-parse HEAD) development)"

1.  Again, for `git`, if you want to view a list of your most recent branches:

        alias glh="git for-each-ref --sort=-committerdate refs/head | head"

## Next Steps

To learn more about saving permanent aliases in Bash configuration files as well as using arguments in aliases utilizing Bash functions, see the guide [How to Add the Linux alias Command in the .bashrc File](/docs/guides/how-to-add-linux-alias-command-in-bashrc-file/).
