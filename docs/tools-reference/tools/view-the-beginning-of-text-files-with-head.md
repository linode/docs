---
author:
  name: Linode
  email: docs@linode.com
description: Use the Linux command head to view the beginning of a text file
keywords: ["head", "linux", "common commands", "cli"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/common-commands/head/']
modified: 2011-04-19
modified_by:
  name: Linode
published: 2010-10-25
title: View the Beginning of Text Files with head
---

The `head` command is a core Linux utility used to view the very beginning of a text file. Despite its narrow functionality, `head` is useful in many systems administration and scripting tasks. For similar functionality that address the end of a file, consider the tail utility.

![Title graphic](/docs/assets/view_the_beginning_of_text_files_with_head_smg.png)

## Using head

Consider the following invocation:

    head /etc/rc.conf

This will print the first 10 lines of the `/etc/rc.conf` file to standard output on the terminal. Thus, `head` is useful for a number of different situations such as determining the contents of a file if the file names are ambiguous.

If a file has fewer than 10 lines, `head` will print the entire file.

### Control the Length of Output with head

With the `-n` option, the number of lines that `head` outputs can be modified. For example:

    head -n 24 /etc/logrotate.conf

This prints the first 24 lines of the `/etc/logrotate.conf` file to the terminal. You can specify the number of lines before or after you declare the file. Therefore, the following command is equivalent to the previous command:

    head /etc/logrotate.conf -n 24

If a file is smaller than the specified number of lines, `head` will print the entire file.

### View the Beginning of Multiple Files with head

`head` can process multiple files at once. Consider the following:

    $ ls
    example  roster

    $ head *
    ==> example <==
    lollipop
    The Joke
    Jockey to the Fair
    Simon's Fancy
    Truckles

    ==> roster <==
    John
    Susan
    Michael
    Robert
    Justin

    Herbert
    Marissa
    George
    Jacob

`head` outputs the first ten lines of each file by default. If you are using `head` to read more than one file, you may also use the `-n` option to control the number of lines printed.

### Combine head with Other Commands

`head` can be used to filter the output of commands as well as files. For instance:

    % cat --help | head -n 2
    Usage: cat [OPTION]... [FILE]...
    Concatenate FILE(s), or standard input, to standard output.

    $ ls /usr/lib | head
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

In the first example, `head` filters the full output of `cat --help` to generate only the first two lines of the output of the command. In the second example, `head` prints the first ten lines of the output of the `ls` command.
