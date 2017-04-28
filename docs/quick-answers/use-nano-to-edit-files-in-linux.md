---
author:
  name: Edward Angert
  email: docs@linode.com
description: 'Use GNU nano to edit text and system files from the command line.'
keywords: 'nano, editor,terminal,command line,shell'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Thursday, April 120, 2017'
modified: 'Thursday, April 20, 2017'
modified_by:
  name: Edward Angert
title: 'Use nano to Edit Files in Linux'
---

GNU nano, or more commonly, nano is the basic editor built-in to most Linux distributions. In this QuickAnswer, we'll cover some basics to help you get started.
To learn more, visit our guide on [using nano](/docs/tools-reference/tools/using-nano).

## Use nano to Open a System File

From the terminal, call `nano` and the file name. If the file doesn't exist, nano will create a new, temporary version in the location you specify. In this example, we'll use `sudo` permissions to open the system's hosts file:

    sudo nano /etc/hosts

The above example opens the system hosts file, similar to the following screenshot:

![Ubuntu hosts file in nano](/docs/assets/nano-hosts-ubuntu.png "Ubuntu hosts file in nano")

In the default view, nano shows the file being edited at the top

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