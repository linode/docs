---
author:
  name: Linode
  email: docs@linode.com
description: This tutorial will teach you how to install and use Nano text editor to create and edit files in Linux.
keywords: ["nano", "editor"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/text-editors/nano/','tools-reference/tools/using-nano/']
modified: 2011-11-08
modified_by:
  name: Linode
published: 2011-11-08
title: How to Use Nano Text Editor Commands in Linux
---

GNU nano is a popular command line text editor used on many operating systems including Unix-based systems and BSD variants. It is a popular editor for users who may find `vi` or `emacs` commands to be non-intuitive.

![Using Nano](/docs/assets/using_nano_smg.png)

## Nano Set Up and Basic Commands

Nano is included with many Linux distributions by default, but some users may need to install it through their distribution's [package management](/docs/using-linux/package-management/) tool:

Debian/Ubuntu users can issue the following command to install nano:

    apt-get install nano

CentOS/Fedora users can issue the following command to install nano:

    yum install nano

When using nano, control characters (CTRL) are represented by a carat (`^`). For example, if you wish to cut a line of text, you would use the "CTRL" key followed by the "K" key. This sequence of commands is represented as `^K` in nano. Some commands use the "Alt" key in order to function, which is represented by the letter "M". A command represented as `M-R` in nano would be performed by pressing the "Alt" key followed by the "R" key. Please note that Mac users may need to use the "Escape" (Esc) key instead of the "Alt" key to perform these commands.

## Create and Open Files

There are different ways to start nano depending on what type of file you wish to edit. Please read through the options below to determine which is best for you.

### Create Files

Nano can be used to create blank files that are then opened to be edited. To create a new file, issue a command similar to the following:

    nano ~/public_html/index.html

In the command above, nano is used to create a file called `index.html` in the `~/public_html` folder.

You do not need to provide an absolute path for the file you wish to create. If the file already exists, nano will simply open it instead of creating it. If you decide not to save the file after you edit it, no new files are created on the file system.

### Open Text Files

To edit a basic text file (e.g. that end with `.txt`), you can use `nano /path/to/file.txt` to open or create a text file in a specific location. If you wanted to open a file located at `~/mystuff/plan.txt`, you would issue the following command:

    nano ~/mystuff/plan.txt

To open files at a specific line or column number, open nano with the following arguments:

    nano +LINE,COLUMN File

omit a number and it assumes column one, line number \$x

To open a file as "read only," use the following form:

    nano -v myfile

### Open Configuration Files

When editing files used to configure applications or system utilities, it is important that you start nano with `-w`.

    nano -w /etc/mysql/my.cnf

Opening nano in this manner will prevent it from wrapping lines that are too long to fit on your screen, which can create problems if config directives are saved across multiple lines. `nano -w` is also useful for creating new files that you do not wish to word wrap.

## Edit Files

### Cut and Paste Lines of Text

To cut a line of text, use `^K`. To paste it back, simply move the cursor where you want the text to be placed and use `^U`. If you would like to cut multiple lines, use a series of `^K` commands until all lines you wish to cut have been removed. When you go to paste them back with `^U`, the lines will all be pasted at once.

### Search Text

To search for text in a document, use `^W`. When using this command, you will be presented with a number of options to assist you in your search.

If you would like to do a simple word search, you may enter the word to search for at the prompt. This prompt appears by default when you use `^W`.

Nano also supports a number of other search features that are all listed under the main search menu.

    ^G Get Help         ^Y First Line       ^T Go To Line       ^W Beg of Par       M-J FullJstify      M-B Backwards
    ^C Cancel           ^V Last Line        ^R Replace          ^O End of Par       M-C Case Sens       M-R Regexp

#### Regex Searches

If you wish to search for text by using a regular expression, you may do so by entering `ALT`+`R` (`ESC`+`R` on Macs) at the search menu and typing your regex into the prompt.

#### Go to Line Number

To go to a line number, enter `^T` at the search prompt and enter the line number that you wish to navigate to.

#### Find and Replace Text

At the search menu, enter `^R`. You will be presented with two prompts. The first prompt will ask you to enter the text you wish to replace. Once you have done so, enter the test you wish to replace the previous text with.

### Spell Check

Nano has a built in spell checking feature that relies on the `spell` package to function. To install this package, issue the appropriate command from below:

Debian/Ubuntu:

    apt-get install spell

CentOS/Fedora:

    yum install spell

Once you have installed spell, you may use the spell checking feature by issuing `^T` while editing a file.

## Save and Exit

When you're done editing your file, you can save it and exit the program.

### Save

To save your work, issue `^O` or "WriteOut". This will save the document and leave nano open for you to continue working.

### Save with Backups

Nano will allow you to create backups of files that you are editing when you exit. These backups can be placed in a directory that you choose, otherwise these backup files are placed in the same directory as the modified file.

Using the `-B` option when starting nano will create backups of the file for you, while using the `-C` option will allow you to specify the directory to place backup files in:

    nano -BC ~/backups index.php

The command listed above will create a backup copy of `index.php` in the `backups` folder in the current user's home directory.

### Exit

Once you're ready to exit, issue `^X` to exit nano. If you have not saved your work, you will be prompted to save the changes or cancel the exit routine.
