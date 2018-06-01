---
author:
  name: Linode
  email: docs@linode.com
description: This tutorial will teach you how to install the Nano text editor and use it to create and edit files in Linux.
og_description: This tutorial will teach you how to install the Nano text editor and use it to create and edit files in Linux.
keywords: ["nano", "text editor"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/text-editors/nano/','tools-reference/tools/using-nano/']
modified: 2018-04-23
modified_by:
  name: Linode
published: 2011-11-08
title: How to Use Nano Text Editor Commands in Linux
---

GNU nano is a popular command line text editor that is included in most Linux distributions. Its interface is comparable to GUI-based text editors, which makes it a popular choice for those who find `vi` or `emacs` commands non-intuitive.

![Using Nano](using_nano_smg.png)

## Nano Set Up and Basic Commands

Nano is included with many Linux distributions by default, but some users may need to install it through their distribution's [package management](/docs/using-linux/package-management/) tool:

**Debian/Ubuntu**:

    apt install nano

**CentOS/Fedora**:

    yum install nano

### Command Keys

When using nano, control characters (CTRL) are represented by a carat (`^`). For example, if you wish to cut a line of text, you would use the "CTRL" key followed by the "K" key. This sequence of commands is represented as `^K` in nano. Some commands use the "Alt" key in order to function, which is represented by the letter "M". A command represented as `M-R` in nano would be performed by pressing the "Alt" key followed by the "R" key. Mac users may need to use the "Escape" (Esc) key instead of the "Alt" key to use these commands.

## Create and Open Files

### Create a New File

Typing `nano` without any arguments will open a blank file for editing:

    nano

If you make changes and save the file, you will be prompted to choose a filename.

### Open a File

To open a file, pass the filename as an argument:

    nano ~/public_html/index.html

If `index.html` exists in the `~/public_html` directory, nano will open it. If the file does not exist, nano will create it.

You can also open files at a specific line or column number:

    nano +LINE /path/to/file
    nano +LINE,COLUMN /path/to/file

To open a file as read only:

    nano -v myfile

### Open Configuration Files

When editing files used to configure applications or system utilities, start nano with the `-w` flag:

    nano -w /etc/mysql/my.cnf

This flag will prevent nano from wrapping lines that are too long to fit on your screen, which can create problems if config directives are saved across multiple lines.

## Edit Files

Unlike `vi`, there is no need to enter Edit Mode before inputting text; you can begin typing as soon as the window opens. Use the arrow keys to move the cursor. A partial menu of available commands is displayed at the bottom of the terminal window.

### Cut and Paste Lines of Text

To cut a line of text, use `^K`. To paste, move the cursor where you want the text to be placed and use `^U`. If you would like to cut multiple lines, use a series of `^K` commands until all lines you wish to cut have been removed. When you go to paste them back with `^U`, the lines will all be pasted at once.

### Search Text

To search for text in a document, use `^W`. This will open a search prompt and a submenu of search-related commands.

    ^G Get Help         ^Y First Line       ^T Go To Line       ^W Beg of Par       M-J FullJstify      M-B Backwards
    ^C Cancel           ^V Last Line        ^R Replace          ^O End of Par       M-C Case Sens       M-R Regexp

#### Regex Searches

To search for text by using a regular expression, enter `ALT`+`R` (`ESC`+`R` on Macs) from the search menu and typing your regex into the prompt.

#### Go to Line Number

To go to a line number, enter `^T` at the search prompt and enter the line number that you wish to navigate to.

#### Find and Replace Text

At the search menu, enter `^R`. Enter the text to be replaced and press enter, then enter the replacement text. You will be prompted to confirm the replacement for each instance found, or to select **All** to confirm all instances.

### Spell Check

Nano has a built in spell checking feature, but you will need to install the `spell` package:

**Debian/Ubuntu**:

    apt install spell

**CentOS/Fedora**:

    yum install spell

Once you have installed `spell`, you can use the spell checking feature by pressing `^T` while editing a file.

## Save

To save your work, use `^O` or "WriteOut". This will save the document and leave nano open for you to continue working.

### Save with Backups

Nano can create backups of files when you exit. These backups can be placed in a directory of your choice; by default they are placed in the same directory as the modified file.

Using the `-B` option when starting nano will create backups of the file for you, while using the `-C` option will allow you to specify the directory to place backup files in:

    nano -BC ~/backups index.php

The command listed above will create a backup copy of `index.php` in the `backups` folder in the current user's home directory.

## Exit

Use `^X` to exit nano. If you have not saved your work, you will be prompted to save the changes or cancel the exit routine.
