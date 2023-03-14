---
slug: manipulate-lists-with-sort-and-uniq
description: "This guide shows how you can use 'sort' and 'uniq', which are utilities built into Linux that you can use to sort or order lists, as well as manipulate them."
keywords: ["linux", "common commands", "sort", "uniq", "shell", "bash"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/tools-reference/tools/manipulate-lists-with-sort-and-uniq/','/linux-tools/common-commands/sort-uniq/']
modified: 2018-01-23
modified_by:
  name: Linode
published: 2010-11-29
title: 'Manipulate Lists with sort and uniq'
tags: ["linux"]
authors: ["Linode"]
---

![Manipulate Lists with sort and uniq](manipulate_lists_with_sort_and_uniq_smg.png "Manipulate Lists with sort and uniq")

## What are sort and uniq?

The Linux utilities `sort` and `uniq` are useful for ordering and manipulating data in text files and as part of shell scripting. The `sort` command takes a list of items and sorts them alphabetically and numerically. The `uniq` command takes a list of items and removes adjacent duplicate lines. Though narrow in their focus, both of these tools are useful in a number of different command line operations.

## How to Use sort

The `sort` command accepts input from a text file or standard output, sorts the input by line, and outputs the result. Sorted text is sent to standard output and printed on the terminal unless redirected. `sort` commands take the following format:

    sort ~/roster.txt

`sort` also accepts input from other commands as in the following example:

    grep -i "retired" ~/roster.txt | sort

This uses [grep](/docs/guides/how-to-grep-for-text-in-files/) to filter the `~/roster.txt` file for the string `retired`, regardless of case. These results are sent to `sort`, which reorders this output alphabetically.

In the default configuration, this `sort` prints the output on the terminal. To write this content to a file, redirect the output as in the following example:

    grep -i "retired" ~/roster.txt | sort > ~/retired-roster.txt

Here, the sorted output is written to the `~/retired-roster.txt` file.

## How to Use uniq

The `uniq` command takes input and removes repeated lines. Because `uniq` only removes identical adjacent lines, it is often used in conjunction with `sort` to remove non-adjacent duplicate lines.

    sort ~/roster.txt | uniq

## Sort and Uniq Examples

The examples in this section will use the following text file as an input:

{{< file "names-list.txt" conf >}}
Richard Longly
Joni Governor
Michael Bitley
Michael Watts
Beth Thompson
Sarah O'Malley
beth thompson
Thompson Geller
Bartram Miller
Earnest Quail
Erin Governor
sarah o'malley
Aaron Smith
Aaron Smith
Erin Smith
erin smyth
Gil Watson
Joni Governor
{{< /file >}}

### Reorder Lists with sort

{{< output >}}
$ sort names-list.txt
Aaron Smith
Aaron Smith
Bartram Miller
beth thompson
Beth Thompson
Earnest Quail
Erin Governor
erin smith
Erin Smith
Gil Watson
Joni Governor
Joni Governor
Michael Bitley
Michael Watts
Richard Longly
sarah o'malley
Sarah O'Malley
Thompson Geller
{{< /output >}}

Sort simply reorders the list alphabetically and outputs the sorted list to the standard output. Capital letters are ordered *after* lower case letters.

You can reverse the order of `sort` output with the `-r` option, as follows:

{{< output >}}
$ sort -r names-list.txt
Thompson Geller
Sarah O'Malley
sarah o'malley
Richard Longly
Michael Watts
Michael Bitley
Joni Governor
Joni Governor
Gil Watson
erin smyth
Erin Smith
Erin Governor
Earnest Quail
Beth Thompson
beth thompson
Bartram Miller
Aaron Smith
Aaron Smith
{{< /output >}}

### Scramble List Order with sort

`sort` can scramble the order of lines using the `-R` option:

{{< output >}}
$ sort -R names-list.txt
beth thompson
Richard Longly
Beth Thompson
Michael Watts
Erin Smith
Michael Bitley
Bartram Miller
Thompson Geller
sarah o'malley
Sarah O'Malley
Erin Governor
Earnest Quail
Joni Governor
Joni Governor
Gil Watson
erin smyth
Aaron Smith
Aaron Smith
{{< /output >}}

The pseudo-random order is determined by using a cryptographic hash of the contents of lines, which produces a fast shuffle. Identical lines are always printed adjacently to each other.

If you prefer, `sort` can scramble a list using the system's random number generator `/dev/random` or pseudo-random number generator `/dev/urandom`. Consider the output of the following commands:

{{< output >}}
$ sort -R names-list.txt --random-source=/dev/random
Beth Thompson
Erin Governor
Richard Longly
Aaron Smith
Aaron Smith
Thompson Geller
Joni Governor
Joni Governor
Earnest Quail
erin smyth
sarah o'malley
Sarah O'Malley
Erin Smith
Michael Watts
beth thompson
Michael Bitley
Bartram Miller
Gil Watson
{{< /output >}}

{{< output >}}
$ sort -R names-list.txt --random-source=/dev/urandom
erin smyth
beth thompson
Richard Longly
Sarah O'Malley
Joni Governor
sarah o'malley
Joni Governor
Gil Watson
Earnest Quail
Erin Smith
Erin Governor
Michael Watts
Michael Bitley
Bartram Miller
Beth Thompson
Thompson Geller
Aaron Smith
Aaron Smith
{{< /output >}}

### Ignore Case when Reordering with sort

The `-f` option for `sort` forces sort to ignore the case of a letter when ordering lines. The default sorting algorithm used by `sort` is [unstable](https://stackoverflow.com/questions/1517793/what-is-stability-in-sorting-algorithms-and-why-is-it-important) because lines judged to be identical may be printed out of order with regards to their original place:

{{< output >}}
$ cat names-list.txt
Richard Longly
Joni Governor
Michael Bitley
Michael Watts
Beth Thompson
Sarah O'Malley
beth thompson
Thompson Geller
Bartram Miller
Earnest Quail
Erin Governor
sarah o'malley
Aaron Smith
Aaron Smith
Erin Smith
erin smyth
Gil Watson
Joni Governor
{{< /output >}}

{{< output >}}
$ sort -f names-list.txt
Aaron Smith
Aaron Smith
Bartram Miller
beth thompson
Beth Thompson
Earnest Quail
Erin Governor
Erin Smith
erin smyth
Gil Watson
Joni Governor
Joni Governor
Michael Bitley
Michael Watts
Richard Longly
sarah o'malley
Sarah O'Malley
Thompson Geller
{{< /output >}}

{{< output >}}
$ sort -fs names-list.txt
Aaron Smith
Aaron Smith
Bartram Miller
Beth Thompson
beth thompson
Earnest Quail
Erin Governor
Erin Smith
erin smyth
Gil Watson
Joni Governor
Joni Governor
Michael Bitley
Michael Watts
Richard Longly
Sarah O'Malley
sarah o'malley
Thompson Geller
{{< /output >}}

The `-s` option in the second command stabilizes the sort, ensuring that identical lines are output in the same order in which they occurred in the input.

### Remove Duplicate Lines with uniq

To remove duplicate adjacent lines in a file, send the output of `sort` to the `uniq` command, as in the following example (using the above example):

{{< output >}}
$  sort names-list.txt | uniq
Aaron Smith
Bartram Miller
beth thompson
Beth Thompson
Earnest Quail
Erin Governor
Erin Smith
erin smyth
Gil Watson
Joni Governor
Michael Bitley
Michael Watts
Richard Longly
sarah o'malley
Sarah O'Malley
Thompson Geller
{{< /output >}}

The `-u` option for `sort` achieves the same result:

{{< output >}}
$  sort -u names-list.txt
Aaron Smith
Bartram Miller
beth thompson
Beth Thompson
Earnest Quail
Erin Governor
Erin Smith
erin smyth
Gil Watson
Joni Governor
Michael Bitley
Michael Watts
Richard Longly
sarah o'malley
Sarah O'Malley
Thompson Geller
{{< /output >}}

### Ignore Case Differences when Removing Duplicate Lines with uniq

`sort` and `uniq` provide the ability to ignore case differences when dropping duplicate adjacent lines. The stability of the sorting method used can affect the final output generated.

{{< output >}}
$ sort names-list.txt | uniq -i
Aaron Smith
Bartram Miller
beth thompson
Earnest Quail
Erin Governor
Erin Smith
erin smyth
Gil Watson
Joni Governor
Michael Bitley
Michael Watts
Richard Longly
sarah o'malley
Thompson Geller
{{< /output >}}

{{< output >}}
$ sort -fs names-list.txt | uniq -i
Aaron Smith
Bartram Miller
Beth Thompson
Earnest Quail
Erin Governor
Erin Smith
erin smyth
Gil Watson
Joni Governor
Michael Bitley
Michael Watts
Richard Longly
Sarah O'Malley
Thompson Geller
{{< /output >}}

### Count the Number of Duplicate Lines with uniq

The `-c` option for `uniq` counts the number of occurrences of a line in a file:

{{< output >}}
$ sort names-list.txt | uniq -ic
    2 Aaron Smith
    1 Bartram Miller
    2 beth thompson
    1 Earnest Quail
    1 Erin Governor
    1 Erin Smith
    1 erin smyth
    1 Gil Watson
    2 Joni Governor
    1 Michael Bitley
    1 Michael Watts
    1 Richard Longly
    2 sarah o'malley
    1 Thompson Geller
{{< /output >}}

This command combines the `-c` and `-i` options to ignore the case differences.

### Print Duplicate Lines with uniq

The `-D` option inverts the behavior of `uniq`, and prints only the duplicated lines:

{{< output >}}
$ sort names-list.txt | uniq -iD
Aaron Smith
Aaron Smith
beth thompson
Beth Thompson
Joni Governor
Joni Governor
sarah o'malley
Sarah O'Malley
{{< /output >}}

In cases like this, it is often helpful to pipe the output of one `uniq` command through another `uniq` command:

{{< output >}}
$ sort names-list.txt | uniq -iD | uniq -i
Aaron Smith
beth thompson
Joni Governor
sarah o'malley
{{< /output >}}

{{< output >}}
$ sort names-list.txt | uniq -D | uniq -i
Aaron Smith
Joni Governor
{{< /output >}}
