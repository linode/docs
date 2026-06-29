---
slug: how-to-use-grep
title: "Using the grep Command in Linux: Finding Text & Strings in Files"
description: "Use the grep command to filter output from administrative commands, so you get only relevant data. This guide shows you how. ✓ Click to learn today!"
authors: ["Phil Zona"]
contributors: ["Phil Zona"]
published: 2017-04-10
modified: 2017-11-27
keywords: ["linux", "how to", "grep", "filter"]
aliases: ['/quick-answers/linux/how-to-use-grep/','/quick-answers/how-to-use-grep/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
tags: ["linux"]
---

In this guide, you'll learn how to use the `grep` command. When performing administrative tasks on your Linode, many commands will give you more information than you need. Using `grep` allows you to filter that output in order to find only the data that's relevant.

1.  To search a file for a particular string, provide the string and filename as arguments:

        grep 'some text' /etc/ssh/sshd_config

2.  You may also redirect output from a command to `grep` using a [pipe](http://man7.org/linux/man-pages/man2/pipe.2.html):

        tail -f /var/log/apache/error.log | grep 'some text'

    This will monitor your Apache error logs, and display only the lines of output that contain the given string.

3.  Regex patterns are also supported by the `-E` option if you want to search for a set of strings rather than one literal:

        grep -E "[[:alpha:]]{16,20}" /etc/ssh/sshd_config

    This example will search the `/etc/ssh/sshd_config` file for strings of alphabetic characters that are 16-20 characters long, but you can use any regex pattern you like.

These are simply a few basic ways to use `grep`. Many other options exist, and in combination with other tools, it serves as an invaluable utility for performing administrative tasks on your Linode. For more information on some of `grep`'s advanced features, check out our guide on how to [search and filter text with grep](/cloud/guides/how-to-use-grep-command/).
