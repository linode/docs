---
slug: delete-file-linux-command-line
author:
  name: Edward Angert
  email: docs@linode.com
description: "This guide provides you instructions for deleting files, directories, content and more using rm command from the Linux Command Line on any distribution."
keywords: ["remove files", "delete files", "rm"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-07-03
modified: 2022-01-14
modified_by:
  name: Edward Angert
title: "Use rm to Delete Files and Directories on Linux (Command Line)"
tags: ["linux"]
aliases: ['/quick-answers/linux/delete-file-linux-command-line/']
---

This guide shows how to use `rm` to remove files, directories, and other content from the command line in Linux.

{{< note >}}
To avoid creating examples that might remove important files, this Quick Answer uses variations of `filename.txt`. Adjust each command as needed.
{{< /note >}}

## The Basics of Using rm to Delete a File

-   Delete a single file using `rm`:

        rm filename.txt

-   Delete multiple files:

        rm filename1.txt filename2.txt

-   Delete all `.txt` files in the directory:

        rm *.txt

## Options Available for rm

### `-i` Interactive mode

Confirm each file before delete:

    rm -i filename.txt

### `-f` Force

Remove without prompting:

    rm -f filename.txt

### `-v` Verbose

Show report of each file removed:

    rm -v filename*.txt

### `-d` Directory

Remove the directory:

    rm -d filenames/

**Note:** This option only works if the directory is empty. To remove non-empty directories and the files within them, use the `r` flag.

### `-r` Recursive

Remove a directory and any contents within it:

    rm -r filenames/

### Combine Options

Options can be combined. For example, to remove all `.png` files with a prompt before each deletion and a report following each:

    rm -iv *.png

{{< output >}}
remove filename01.png? y
filename01.png
remove filename02.png? y
filename02.png
remove filename03.png? y
filename03.png
remove filename04.png? y
filename04.png
remove filename05.png? y
filename05.png
{{< /output >}}

### `-rf` Remove Files and Directories, Even if Not Empty

Add the `f` flag to a recursive `rm` command to skip all confirmation prompts:

    rm -rf filenames/

## Combine rm with Other Commands

### Remove Old Files Using find and rm

Combine the [find command](/docs/guides/find-files-in-linux-using-the-command-line/)'s `-exec` option with `rm` to find and remove all files older than 28 days old.  The files that match are printed on the screen (`-print`):

    find filename* -type f -mtime +28 -exec rm '{}' ';' -print

In this command's syntax, `{}` is replaced by the `find` command with all files that it finds, and `;` tells `find` that the command sequence invoked with the `-exec` option has ended. In particular, `-print` is an option for `find`, not the executed `rm`. `{}` and `;` are both surrounded with single quote marks to protect them from interpretation by the shell.