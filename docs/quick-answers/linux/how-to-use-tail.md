---
author:
  name: Phil Zona
  email: docs@linode.com
description: 'View and follow the end of files with the tail command.'
keywords: 'linux,how to,tail,last lines,file'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['quick-answers/how-to-use-tail/']
modified: 'Monday, April 10th, 2017'
modified_by:
  name: Phil Zona
published: 'Monday, April 10th, 2017'
title: How to Use the Tail Command
---

In this guide, you'll learn how to use the `tail` command. Using `tail` is a simple way to show the ends of files, for example, when analyzing logs and other text files that change over time. It may also be combined with other tools for selective, real-time monitoring. When performing administrative tasks on your Linode, `tail` is one of the most useful tools available.

1.  Enter the `tail` command, followed by the file you'd like to view:

        tail /var/log/auth.log

    This will print the last ten lines of the `/var/log/auth.log` file to your terminal output. 

2.  To change the number of lines displayed, use the `-n` option:

        tail -n 50 /var/log/auth.log

    In this example, the last 50 lines will be shown, but you can modify this number to show as many or as few lines as you need.

3.  To show a real-time, streaming output of a changing file, use the `-f` or `--follow` options:

        tail -f /var/log/auth.log

    This will print the end of the file to your screen, and update it as the file changes. For example, you can use this option with `/var/log/auth.log` (on Debian and Ubuntu systems) to show your access log in real time. This will run as a foreground process, so to cancel it, press **CTRL+C**.

4.  Tail can even be combined with other tools like `grep` to filter the results:

        tail /var/log/auth.log | grep 198.51.100.1

    This command would search the last ten lines of your access log and only display those that contain the IP address `198.51.100.1`. You can also apply options to `tail` in order to show more or less lines, view the filtered results in real time, and more.

These are just the basics of how to use `tail`. It is an incredibly useful tool with many more options than we've listed here. To learn more advanced techniques, please check out our full guide on [the tail command](/docs/tools-reference/tools/view-and-follow-the-end-of-text-files-with-tail).
