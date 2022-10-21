---
slug: view-the-beginning-of-text-files-with-head
author:
  name: Linode
  email: docs@linode.com
description: "The 'head' command is a core Linux utility used to view the beginning of a text file. This guide shows how to use this utility to view the beginning of text files."
og_description: "Head is a Unix command line utility for viewing the beginning of text files. This guide shows how to use head and gives practical examples."
keywords: ["head", "linux", "utilities", "cli", "text files"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/tools-reference/tools/view-the-beginning-of-text-files-with-head/','/linux-tools/common-commands/head/']
modified: 2018-02-02
modified_by:
  name: Linode
published: 2010-10-25
title: View the Beginning of Text Files with head
tags: ["linux"]
---

The `head` command is a core Linux utility used to view the very beginning of a text file. Despite its narrow functionality, `head` is useful in many systems administration and scripting tasks. For similar functionality that address the end of a file, use the [tail](/docs/guides/view-and-follow-the-end-of-text-files-with-tail/) utility instead.

![View Beginning of Files with Head](view_the_beginning_of_text_files_with_head_smg.png)

## Using head

List the file or files you want to view after the `head` command:

    head /etc/rc.conf

This will print the first 10 lines of `/etc/rc.conf` to standard output. If a file has fewer than 10 lines, `head` will print the entire file.

### Control the Length of Output

With the `-n` option, the number of lines that `head` outputs can be modified:

    head -n 24 /etc/logrotate.conf

This prints the first 24 lines of `/etc/logrotate.conf` to the terminal. You can specify the number of lines before or after you declare the file:

    head /etc/logrotate.conf -n 24

If a file is smaller than the specified number of lines, `head` will print the entire file.

### View Multiple Files

`head` can process multiple files at once:

    head example.txt names.txt

{{< output >}}
==> example.txt <==
lollipop
The Joke
Jockey to the Fair
Simon's Fancy
Truckles

==> names.txt <==
John
Susan
Michael
Robert
Justin

Herbert
Marissa
George
Jacob
{{< /output >}}

To view the first line of every file in a directory, you can use the `-n` option combined with the `*` wild card:

    head -n 1 *

### View Command Output

By using the pipe operator, `head` can be used to filter the output of commands as well as files:

    cat --help | head -n 2

{{< output >}}
Usage: cat [OPTION]... [FILE]...
Concatenate FILE(s), or standard input, to standard output.
{{< /output >}}

    ls /usr/lib | head

{{< output >}}
alsa-lib
ao
apr.exp
apr-util-1
aprutil.exp
aspell
aspell-0.60
avahi
awk
bmp
{{< /output >}}
