---
author:
  name: Linode
  email: docs@linode.com
description: 'Practical examples for using grep to find strings in text files and streams.'
keywords: ["grep", "search", "files", "filtering", "regular expressions"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/common-commands/grep/', 'tools-reference/search-and-filter-text-with-grep/']
modified: 2011-05-04
modified_by:
  name: Linode
og_description: “Learn how to use Grep for practical applications including filtering log files and finding strings in text files and streams.”
published: 2010-06-30
title: How to Grep for Text in Files
---

The `grep` utility provides users of most Unix-like operating systems with a tool to search and filter text using a common regular expression syntax. Indeed, `grep` is so ubiquitous that the verb "to grep" has emerged as a synonym for "to search." `grep` is an ideal tool for finding all occurrences of a value in a selection of files, filtering a log file for certain entries, or as part of a script or chain of commands.

This document provides an overview of `grep` usage, accompanied by a number of practical applications of `grep`. If you find this guide helpful, please consider our guide to [basic administration practices](/docs/using-linux/administration-basics) or the rest of the [Tools & Reference section](/docs/tools-reference/).

![Using Grep](/docs/assets/search_and_filter_text_with_grep_smg.png "Search and filter text with Grep")


## Using Grep

This `grep` guide references recent versions of `GNU grep`, which are included by default in all images provided by Linode. It is also provided as part of the common "base" selection of packages provided in nearly all distributions of Linux-based operating systems.

### The Grep Command

A typical `grep` command takes the following form:

    grep "string" ~/threads

The `grep` invocation is followed by a pattern, or a "search term," and then optionally by the name of a file. The above sequence will search for the `string` sequence of characters located in the `~/threads` file. `grep` also permits recursive searching throughout directory trees. Issue a command in the following format:

    grep -r "string" ~/thread/

When used on a specific file, `grep` only outputs the lines that contain the matching string. When run in recursive mode, grep outputs the full path to the file, followed by a colon, and the contents of the line that matches the pattern. Patterns in grep are, by default, "basic regular expressions;" however, if you need a more expressive regular expression syntax grep is capable of accepting patterns in alternate formats with the following switches:

-   Use `-E` to access the extended regular expression syntax. Equivalent to the deprecated `egrep` command.
-   Use `-P` to access Perl compatible regular expression syntax.

Grep provides a number of very powerful options to control its output. The most significant of these options are:

-   Set `-o` to only output the matching segment of the line, rather than the full contents of the line.
-   Set `-n` to print the line number of where the pattern matches occur.
-   Set `-C 2`, where 2 can be replaced by any number to show, in addition to the matching line, the specified number of "context" lines.

In addition to reading content from files, `grep` can read and filter a text feed on standard input. The output of any command or stream can be "piped" (e.g. with the `|` operator) to the `grep` command. Then, `grep` filters this output according to the match pattern specified and outputs only the matching lines. For instance, given the following command:

    ls --help | grep "dired"

This filters the output of the `ls` commands help text and looks for appearances of "dired", and outputs them to standard out (the current session). The output resembles:

    -D, --dired                generate output designed for Emacs' dired mode

The combination of both input possibilities makes `grep` a powerful tool for interacting with large amounts of textual data.

### Regular Expression Overview

While straight-forward pattern matching is powerful for some filtering tasks, the true power of `grep` lies in its ability to use regular expressions for complex pattern matching that make it possible to write more expressive patterns. Most characters in regular expressions match with input data literally; however, there are some sequences that carry special significance. If you want to mach these characters literally you can use the escape character `\` to transform the *next* character into a literal match. Consider the following characters with special significance in `grep` substitution scripts:

-   The `.` symbol matches any character.
-   The `*` symbol causes the character immediately proceeding character to successfully match to *zero* or more instances of that character in the data set.
-   The `+` symbol causes the character immediately proceeding character to successfully match to *one* or more instances of that character in the data set.
-   Square brackets, `[]`, enclose a set of characters, that match against any member of the set of specified characters. When prefaced with a caret, as in `[^ABC]`, this matches *none* of the characters specified in the set.
-   The `|` character provides an "OR" operator, so the sequence `^(www|ftp)\.` would match a line that began with the characters `www` or `ftp`.
-   Parenthetical characters, `()`, allow you to write more complex expressions, particularly in conjunction with the pipe `|` operator. Parentheses create "sub expressions" which can be modified in a single group.
-   The `^` character matches the beginning of a line.
-   The `$` character matches the end of a line.
-   The `\` character, as previously stated, escapes the following character for literal matching if it caries additional meaning.

These operators provide only a very limited overview of the capabilities of `grep`'s regular expression syntax. Remember that `grep` operations are non-destructive, which makes it easy to experiment with matching patterns. Consider the examples that follow as a more practical introduction to this tool.

## Filtering Logs with Grep

One popular use of `grep` is to extract useful information from system logs. Consider the following examples.

    grep -Eoc "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}.* 200"  /srv/www/example.com/logs/access.log

In this command, grep filters an apache access log for a line that begins with an IP address, is followed by a number of characters, a space and then the characters `200` (where 200 represents the record of a successful HTTP connection). The `-c` option outputs only a count of the number of matches. To get the output of the IP address of the visitor and the path of the requested file for successful requests, omit the `-c` option as follows:

    grep -Eo "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}.* 200"  /srv/www/example.com/logs/access.log

The squiggly brackets (e.g. `{` and `}`) indicate the number of instances of the match. `{1,3}` requires that the previous character or character class must occur at least once, but no more than three times. The character class `[0-9]` will successfully match against one or more numeric digits. To generate similar output but report on unsuccessful attempts to access content, use a command that resembles the following:

    grep -Eo "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}.* 404"  /srv/www/example.com/logs/access.log

The following variant of the above command generates a list of all IP addresses that have attempted to connect to your web server. Using the `-o` option, only the matching strings are sent to standard output. This output is filtered through the utility `uniq` with the "pipe" operator (e.g. `|`) to filter out duplicate entries from a single IP address:

    grep -Eo "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" /srv/www/example.com/logs/access.log | uniq

In the next example, you can see an alternate pattern for matching an IP address in a different log. The following command searches the most recent `/var/log/auth.log` file for invalid login attempts:

    grep -Eo "Invalid user.*([0-9]{1,3}\.){3}[0-9]{1,3}" /var/log/auth.log

You can split the above command into two layers to output a quick list of IP addresses with failed login attempts to your system:

    grep "Invalid user" /var/log/auth.log | grep -Eo "([0-9]{1,3}\.){3}[0-9]{1,3}" | uniq

The `grep` tool, when accepting input from standard output, can filter the output of commands like `tail -F` to provide real-time monitoring of specific log events. Consider the following command:

    tail ~/.procmail/procmail.log -F | grep "Subject"

In this case, `tail` follows the `~/procmail/procmail.log` file where the `procmail` mail filtering tool logs filtering. This output is passed to `grep`, which filters the stream and prints only lines that contain the string `Subject` and prints those lines.

These examples outline several distinct ways that the `grep` tool is used to aid in the administration of Linux-based systems. Because grep operations are almost always non-destructive, it is easy to experiment with `grep` to generate the kind of information you require from text files.

## Filtering Commands with Grep

Beyond its uses in shell scripting and log filtering, `grep` has many alternate uses. In the following example, `grep` filters the lengthy `tar` help text to more efficiently find the options for dealing with `bzip` files:

    tar --help | grep "bzip"

`grep` is also useful for filtering the output of `ls` when listing the contents of directories with a large number of files. Take the following example:

    ls /usr/lib | grep "xml"

While there may be many files in the `/usr/lib` directory, the list of files with the string `xml` in their title may be more useful.

## Grep Compressed Files with zgrep

The `zgrep` command functions identically to the grep command above; however, it adds the ability to run grep operations on files that have been compressed with gzip without requiring an extra compression and decompression step. Consider the following command, adapted from above to search an older compressed log:

    zgrep -Eo "Invalid user.*([0-9]{1,3}\.){3}[0-9]{1,3}" /var/log/auth.log.2.gz

`zgrep` operations take longer than standard `grep` operations because of the additional overhead of reading the compressed files.
