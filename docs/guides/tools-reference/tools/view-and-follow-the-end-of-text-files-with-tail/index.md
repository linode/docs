---
slug: view-and-follow-the-end-of-text-files-with-tail
description: 'This guide demonstrates the syntax and basic usage of the Linux utility tail, which you can use to view the end of text files, and also how to use follow mode.'
keywords: ["tail", "linux commands", "linux", "common commands", "unix", "cli"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/tools-reference/tools/view-and-follow-the-end-of-text-files-with-tail/','/linux-tools/common-commands/tail/']
modified: 2018-04-02
modified_by:
  name: Linode
published: 2010-11-29
title: View and Follow the End of Text Files with tail
tags: ["linux"]
authors: ["Linode"]
---

![View and Follow the End of Text Files with tail](view_and_follow_the_end_of_text_files_with_tail_smg.png)

## What is tail?

The `tail` command is a core Linux utility used to view the end of text files. You can also use **follow mode** to see new lines as they're added to a file in real time. `tail` is similar to the [head utility](/docs/guides/view-the-beginning-of-text-files-with-head/), used for viewing the beginning of files.

## Syntax and Basic Usage

Tail uses the following basic syntax:

    tail example.txt

This will print the last ten lines of `example.txt` to standard output on the terminal. `tail` is useful for reading files such as logs, where new content is appended to the end of the file.

To view multiple files, specify their names as additional arguments or use a wildcard:

    tail example.txt example2.txt

  {{< output >}}
==> example.txt <==
Line 1
Line 2
Line 3
Line 4
Line 5
Line 6
Line 7
Line 8
Line 9
Line 10

==> example2.txt <==
Line 1
Line 2
{{< /output >}}

View the end of all `.log` files in a directory:

    tail *.log

## Control the Length of tail Output

By default, `tail` will output the final ten lines of a file. To view more or fewer than ten lines, use the `-n [number]` option to control the number of lines that the `tail` command prints:

    tail -n 5 example.txt

{{< output >}}
Line 6
Line 7
Line 8
Line 9
Line 10
{{< /output >}}

    tail example.txt -n 2
{{< output >}}
Line 9
Line 10
{{< /output >}}

## Follow Mode

With the `-f` option, `tail` operates in **follow mode**. Here, `tail` prints the final lines of a file, then watches for new additions to the end of the file. When new lines are added they are printed to the terminal, giving you a live feed of the end of the file.

`tail` will continue to follow a file until the user sends a break (e.g. `Control+c`) to the terminal. Additionally, if the file is deleted or renamed, `tail -f` will fail. Use the `-F` option to force `tail` to follow file names rather than file objects. This can prevent problems with [log rotation](/docs/guides/use-logrotate-to-manage-log-files/) and other programs that may alter file names.

Follow mode is very useful when troubleshooting issues because it allows you to watch logs in real time.

### Filter with grep

`tail` can be combined with [grep](/docs/guides/how-to-grep-for-text-in-files/) to filter the contents of a log file in real time. You can use this to track specific types of errors, such as 404 responses from an Apache web server:

    tail -F /var/log/apache2/access.log | grep "404"
