---
author:
  name: Edward Angert
  email: docs@linode.com
description: 'Easy to remember Linux command line time savers.'
keywords: ["terminal", "command line", "shell", "tips", "tricks", "easy linux", "cli"]
aliases: ['quick-answers/linux-command-line-tips/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-04-13
modified: 2017-07-17
modified_by:
  name: Edward Angert
title: 'Linux Command Line Tips'
---

These are just a few of the many commands and tricks available in the Linux terminal. Visit our guide for a deeper [introduction to Linux concepts](/docs/tools-reference/introduction-to-linux-concepts).

## Basic Linux Terminal Things to Know

* Scroll through previous commands with the **Up** arrow on your keyboard. Press **Enter** to send the command.
* Stop the current process and get back to the prompt: **CTRL+C**
* Use the **TAB** key to autocomplete commands and file paths

## Easy Ways to Fix or Undo Text in the Terminal

* Jump left one word: **ESC+B**
* Jump right one word: **ESC+F**
* Jump to the beginning of the line: **CTRL+A**
* Jump to the end of the line: **CTRL+E**
* Delete the previous word: **CTRL+W**
* Clear the entire line: **CTRL+U**

## Quickly Find and Replace within the Last-Entered Command

This is especially useful for both fixing typos and re-running system commands.

In the following example, we correct the typo in the first line using the command in the second:

    sudo apt update && sudp apt upgrade
    ^sudp^sudo

Use it to change the action in a system command:

    sudo systemctl stop nginx.service
    ^stop^start

## Redo the Previous Command with Sudo

    sudo !!

## Exit Vi(m)

Found your way into the Vi(m) editor?

* To exit without saving: **ESC** then **:q!**
* Save and exit: **ESC** then **:wq**
