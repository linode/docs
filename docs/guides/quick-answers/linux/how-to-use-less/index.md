---
slug: how-to-use-less
description: 'Use the less command to display file and command output one page at a time.'
og_description: 'Use the less command to display file and command output one page at a time'
keywords: ["linux", "how to", "less", "page"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-09-05
modified_by:
  name: Nathan Melehan
published: 2018-09-05
title: How to Use the Less Command
tags: ["linux"]
aliases: ['/quick-answers/linux/how-to-use-less/']
authors: ["Nathan Melehan"]
---

## What is Less?

On Linux systems, `less` is a command that displays file contents or command output one page at a time in your terminal. `less` is most useful for viewing the content of large files or the results of commands that produce many lines of output. The content displayed by `less` can be navigated by entering keyboard shortcuts.

## Invoking Less

To view the content of a file with `less`:

    less your-file-name

To view the output of another command with `less`, redirect the output from that command using a [pipe](http://man7.org/linux/man-pages/man2/pipe.2.html):

    ps -ef | less

To see line numbers on each line, use the `-N` option:

    less -N your-file-name

## Keyboard Navigation in Less

Use the following key commands to navigate through content viewed by `less`:

{{< content "how-to-navigate-less-shortguide" >}}