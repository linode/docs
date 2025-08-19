---
slug: how-to-use-pipes-to-combine-command-line-commands
author:
  name: Linode Community
  email: docs@linode.com
modified_by:
  name: Linode
title: "How to Use Pipes to Combine Command Line Commands"
h1_title: "How to Use Pipes to Combine Command Line Commands"
description: 'This guide will give you a basic understanding of pipes on the command line and how they can be used to do complex processing workflows without the need for any programming; just using the basic tools provided by a standard Linux installation.'
og_description: 'This guide will give you a basic understanding of pipes on the command line and how they can be used to do complex processing workflows without the need for any programming; just using the basic tools provided by a standard Linux installation.'
keywords: ['linux','pipes','command line']
tags: ["linux","pipes"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-20
enable_h1: true
contributor:
  name: Lars Kotthoff
  link: https://github.com/larskotthoff
external_resources:
- '[Ubuntu Manual page for awk](https://manpages.ubuntu.com/manpages/focal/en/man1/awk.1.html)'
- '[Ubuntu Manual page for cut](https://manpages.ubuntu.com/manpages/focal/en/man1/cut.1.html)'
- '[Ubuntu Manual page for grep](https://manpages.ubuntu.com/manpages/focal/en/man1/grep.1.html)'
- '[Ubuntu Manual page for sort](https://manpages.ubuntu.com/manpages/focal/en/man1/sort.1.html)'
- '[Ubuntu Manual page for tr](https://manpages.ubuntu.com/manpages/focal/en/man1/tr.1.html)'
- '[Ubuntu Manual page for uniq](https://manpages.ubuntu.com/manpages/focal/en/man1/uniq.1.html)'
- '[Ubuntu Manual page for wc](https://manpages.ubuntu.com/manpages/focal/en/man1/wc.1.html)'
---

Many of the commands available on a Linux command line can feel a little bit basic in their functionality. For example, `ls` can list files and directories in various ways, but it can't count them. This is very much intentional; the UNIX philosophy is to have one simple tool per task, and only one, that solves the task well. Listing files and counting things are two different tasks, so there should be two tools. This may seem limiting at first, but the pipe character `|` allows to combine and compose these simple tools to achieve arbitrarily complex functionality, all from simple building blocks without the need to write code!

## Listing Files and Counting

Let's return to our example -- list files and count them. The `ls` command cannot do this, but if we use a pipe to redirect its output to another command, we can count:

    ls /usr/bin/ | wc -l

But what exactly is happening here? Let's have a look at each part. First, we simply run `ls` on the `/usr/bin` directory. Without a pipe after it, this would output all the files in that directory -- several thousand on a typical Linux system, so you definitely don't want to count those manually! The pipe character `|` now instructs the shell to not print the output, but redirect it to the command after the pipe. Technically, we are connecting the standard output `stdout` of `ls` to the standard input `stdin` of the next command. Here, this is the word count utility `wc`, which we are instructing to count lines (`-l`) because we want to count the number of files (one per line), not the number of characters in the file names or the number of words.

## Useful Utilities

Many of the commands on the Linux command line can be combined in this way. Here are some of the most useful ones:

| Command  | Description                                                                     |
|----------|:--------------------------------------------------------------------------------|
| `awk`    | General-purpose scripting utility for text processing.                          |
| `cut`    | Cut input into fields based on separation characters and select fields to output, for example extract columns from a CSV file. |
| `grep`   | Output lines that match a pattern.                                              |
| `sort`   | Sort the input lines.                                                           |
| `tr`     | Change sets of characters into others, for example uppercase.                   |
| `uniq`   | Omit duplicate lines in output.                                                 |
| `wc`     | Count lines, words, and characters.                                             |

With the help of these utilities, we can, for example, output the names of all the files in `/usr/bin/` in upper case:

    /bin/ls /usr/bin/ | tr '[:lower:]' '[:upper:]'

Why did we use the full path to the `ls` command (`/bin/ls`) here rather than simply `ls` as before? In most modern Linux distributions, `ls` is an alias that includes some additional options to the command. On my system, the alias is `ls -F --color`, which makes the output more readable by adding colors and characters to denote the type of directory entries, for example a trailing `/` to denote a directory and a trailing `*` to denote an executable file. While this is nice for humans to look at, it interferes with upper-casing the file names (we don't want to include the `*`), so we are avoiding the alias by calling the command directly.

## Finding Duplicate File Names

For a more complex example, let's have a look at finding file names that are duplicated in two or more directories. We will list their contents using `ls` and then process the output with additional commands, using pipes to connect them. The `uniq` command allows to filter duplicates, but it requires its input to be sorted, so we use `sort` as well:

    /bin/ls /usr/sbin/ /usr/bin/ | sort | uniq

This works, but does not quite do what we want -- it removes the duplicates we are looking for! Fortunately, there's a flag to `uniq` to count how many occurrences there are instead of removing duplicates -- `-c`:

    /bin/ls /usr/sbin/ /usr/bin/ | sort | uniq -c

With this we can see which file names are duplicated; everything with a number of at least 2 in front of it. Checking the output manually can still be tedious for large directories though; ideally, we would be able to filter out all non-duplicates. The `grep` command comes to mind, but it only allows us to match text, not compare numbers. Another command line tool, `awk`, provides that functionality:

    /bin/ls /usr/sbin/ /usr/bin/ | sort | uniq -c | awk '{ if($1 > 1) print }'

Here we are simply instructing `awk` to compare the first field of each line (`$1`, fields separated by white space by default) to the number 2. This will automatically parse the input text into a number. If that number is greater than 1, i.e. there are at least 2 occurrences and therefore at least one duplicate, we call `print`, which outputs the input line.

Taken altogether, our four-component pipe will output all file names that occur at least twice in the directories we are listing, together with the number of occurrences. There are different ways of doing this and, depending on your preference, you may opt for fewer components in the pipe, for example by having `awk` do the counting of duplicates as well.

## Writing your own Composable Commands

Sometimes, you need to solve a task for which there is no generic utility program, for example something that needs to work with a custom data format. Even in this case, you can easily take advantage of all existing commands and pipes to compose them with your own script, for example implemented in Python. The convention you need to adhere to to be able to make your script part of a pipeline like the ones we talked about here is that it must accept input from `stdin` and output to `stdout`. The latter usually happens automatically if you simply use the `print` command or equivalent in your favorite programming language. As long as you avoid reading from and writing to files, your script can probably be used with pipes.
