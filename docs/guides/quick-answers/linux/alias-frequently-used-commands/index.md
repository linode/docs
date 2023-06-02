---
slug: alias-frequently-used-commands
description: 'Alias is a built-in Unix command that helps create shortcuts to frequently used commands. This guide shows how to create and remove aliases.'
keywords: ["bash", "alias", "command line"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-07-05
modified: 2018-07-05
modified_by:
  name: Linode
title: 'Alias Frequently Used Commands in Linux'
external_resources:
- '[alias on man7.org](http://man7.org/linux/man-pages/man1/alias.1p.html)'
tags: ["linux"]
aliases: ['/quick-answers/linux/alias-frequently-used-commands/']
authors: ["Edward Angert"]
---

## What is an Alias?

An alias is a custom shortcut set to represent a set of commands or a single command run with specific options. Use an alias to execute frequently used processes with as little as a single character.

## List Existing Aliases

    alias

## Where to Find and Edit Aliases in Bash, Z shell (ZSH), and fish

The Bash shell is the default on most modern operating systems. If using [ZSH](https://en.wikipedia.org/wiki/Z_shell), [oh-my-zsh](https://ohmyz.sh/) or [fish](https://fishshell.com/), the shell's configuration file may be in another location. Based on the shell in use, the configuration profile will be found in:

* **Bash:** `~/.bashrc`
* **ZSH:** `~/.zshrc`
* **fish:** `~/.config/fish/config.fish`

## Create a Temporary Alias

Aliases can be created through the command line using the syntax `alias customName="commands the alias should run"`. For example:

    alias webroot="cd /var/www/html/example.com/public_html"

## Remove an Alias

Any alias added through the command line can be unaliased using `unalias`:

    unalias testalias

## Create a Permanent Alias

To create a persistent alias, edit the [configuration profile for your shell](#where-to-find-and-edit-aliases-in-bash-z-shell-zsh-and-fish) and add the alias to the end of the file:

{{< file "~/.bashrc" bash >}}
...
alias la="ls -al"
...
{{< /file >}}

### Refresh the Configuration

`source` the configuration file to refresh the configuration changes:

    source ~/.bashrc

## Alias Existing Linux Commands

Existing Linux commands can be aliased to run with frequently-used options. As with any alias, this should be used with caution as once a user is accustomed to the results of the alias, the user may expect the same results on other machines or terminals where the alias may not exist.

In this example, change the default behavior of the `ls` command to provide more information about files and directory structure:

    alias ls="ls -aFhl"
