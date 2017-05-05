---
author:
  name: Phil Zona
  email: docs@linode.com
description: 'View the beginning of a text file with the head command.'
keywords: 'linux,how to,head,first lines,file'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 'Monday, April 10th, 2017'
modified_by:
  name: Phil Zona
published: 'Monday, April 10th, 2017'
title: How to Use the Head Command
---

In this guide, you'll learn how to use the `head` command. Using `head` is a simple way to show the beginning of text files, for example, when analyzing logs and other text files that change over time. It may also be combined with other tools for selective, real-time monitoring. When performing administrative tasks on your Linode, `head` is one of the most useful tools available.

1.  Enter the `head` command, followed by the file of which you'd like to view:

        head /var/log/auth.log

    This will print the first ten lines of the `/var/log/auth.log` file to your terminal output. 

2.  To change the number of lines displayed, use the `-n` option:

        head -n 50 /var/log/auth.log

    In this example, the first 50 lines will be shown, but you can modify this number to show as few or as many lines as you need.

3.  To show the beginning of a file up to a specific number of bytes, you may use the -c option:

        head -c 1000 /var/log/auth.log

    This will print the first 1000 bytes of the file to your screen, and can be useful in situations where a file must be broken into pieces of a fixed size (e.g., for uploading to a separate server).

4.  The `head` command can even be combined with other tools like `grep` to filter the results:

        head /var/log/auth.log | grep 198.51.100.1

    This command would search the first ten lines of your access log and only display those that contain the IP address `198.51.100.1`. You can also apply options to `head` for an even more specific output.

These are just the basics of how to use `head`. It is an incredibly useful tool with many more options than we've listed here. To learn more advanced techniques, please check out our full guide on [the head command](/docs/tools-reference/tools/view-the-beginning-of-text-files-with-head).