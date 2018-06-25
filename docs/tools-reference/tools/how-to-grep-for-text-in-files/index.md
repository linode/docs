---
author:
  name: Linode
  email: docs@linode.com
description: 'Practical examples for using grep to find strings in text files and streams.'
keywords: ["grep", "search", "files", "filtering", "regular expressions"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/common-commands/grep/', 'tools-reference/search-and-filter-text-with-grep/','tools-reference/how-to-grep-for-text-in-files/']
modified: 2018-02-01
modified_by:
  name: Linode
og_description: “Learn how to use Grep for practical applications including filtering log files and finding strings in text files and streams.”
published: 2010-06-30
title: How to Grep for Text in Files
external_resources:
  - '[Grep | Regular-Expressions.info](https://www.regular-expressions.info/grep.html)'
  - '[Perl Regular Expressions](https://perldoc.perl.org/perlre.html)'
---

![Using Grep](search_and_filter_text_with_grep_smg.png "Search and filter text with Grep")

Grep is a command-line utility that can search and filter text using a common regular expression syntax. It is so ubiquitous that the verb "to grep" has emerged as a synonym for "to search." `grep` is a useful tool for finding all occurrences of a search term in a selection of files, filtering a log file or stream, or as part of a script or chain of commands.

This guide provides an overview of `grep` usage, a brief introduction to regular expression syntax, and practical examples.

## Using Grep

This guide references recent versions of GNU grep, which are included by default in all images provided by Linode. It is also provided as part of the common base selection of packages provided in nearly all distributions of Linux-based operating systems.

### The Grep Command

A basic `grep` command uses the following syntax:

    grep "string" ~/threads.txt

The first argument to `grep` is a search pattern. The second (optional) argument is the name of a file to be searched. The above sequence will search for all occurrences of "string" in the `~/threads` file.

If you want to search multiple files, the `-r` flag enables recursive searching through a directory tree:

    grep -r "string" ~/thread/

When used on a specific file, grep only outputs the lines that contain the matching string. When run in recursive mode, grep outputs the full path to the file, followed by a colon, and the contents of the line that matches the pattern. Patterns in grep are, by default, basic regular expressions. If you need a more expressive regular expression syntax, grep is capable of accepting patterns in alternate formats with the following flags:

| Flag | Usage |
|---|---------|
| -E | Use extended regular expression syntax. Equivalent to the deprecated `egrep` command.  |
| -P | Use Perl regular expression syntax.  |

Grep provides a number of powerful options to control its output:

| Flag  | Usage  |
|---|---|
| -o  |  Output only the matching segment of each line, rather than the full contents of each matched line. |
| -n  |  Print the line number of each matched line. |
| -C 2  | Show 2 (or another number of) context lines in addition to the matched line.  |

In addition to reading content from files, `grep` can read and filter text from standard input. The output of any command or stream can be piped to the `grep` command. Then, `grep` filters this output according to the match pattern specified and outputs only the matching lines. For instance, given the following command:

    ls --help | grep "dired"

This filters the output of the `ls` command's help text and looks for appearances of "dired", and outputs them to standard out:

  {{< output >}}
-D, --dired                generate output designed for Emacs' dired mode
{{< /output >}}

### Regular Expression Overview

While straightforward pattern matching is sufficient for some filtering tasks, the true power of `grep` lies in its ability to use regular expressions for complex pattern matching. Most characters in regular expressions match with input data literally; however, there are some sequences that carry special significance:

| Symbol | Result |
|---|--------------------------|
| .  | Matches any character.  |
| *  | Matches zero or more instances of the preceding character.  |
| +  | Matches one or more instances of the preceding character.  |
| [] | Matches any of the characters within the brackets.  |
| () | Creates a sub-expression that can be combined to make more complicated expressions.  |
| \|\ | **OR** operator; (www\|ftp) matches either "www" or "ftp".  |
| ^  | Matches the beginning of a line.  |
| $  | Matches the end of the line.  |
| \\ | Escapes the following character. Since `.` matches any character, to match a literal period you would need to use `\.`.   |

## Filtering Logs with Grep

One popular use of `grep` is to extract useful information from system logs:

    grep -Eoc "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}.* 200"  /srv/www/example.com/logs/access.log

In this command, grep filters an Apache access log for all lines that begin with an IP address, followed by a number of characters, a space and then the characters `200` (where 200 represents a successful HTTP connection). The `-c` option outputs only a count of the number of matches. To get the output of the IP address of the visitor and the path of the requested file for successful requests, omit the `-c` flag:

    grep -Eo "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}.* 200"  /srv/www/example.com/logs/access.log

The curly brackets specify the number of instances of the pattern. `{1,3}` requires that the previous character occur at least once, but no more than three times. The character class `[0-9]` will match against one or more numeric digits. You can also generate similar output but report on unsuccessful attempts to access content:

    grep -Eo "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}.* 404"  /srv/www/example.com/logs/access.log

The following command generates a list of all IP addresses that have attempted to connect to your web server. Using the `-o` option, only the matching strings are sent to standard output. This output is filtered through the utility `uniq` with the **pipe** operator (`|`) to filter out duplicate entries:

    grep -Eo "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" /srv/www/example.com/logs/access.log | uniq

The next example uses an alternative pattern for matching an IP address in a different log. The following command searches the most recent `/var/log/auth.log` file for invalid login attempts:

    grep -Eo "Invalid user.*([0-9]{1,3}\.){3}[0-9]{1,3}" /var/log/auth.log

You can split the above command into two layers to output a list of IP addresses with failed login attempts to your system:

    grep "Invalid user" /var/log/auth.log | grep -Eo "([0-9]{1,3}\.){3}[0-9]{1,3}" | uniq

`grep` can filter the output of commands such as `tail -F` to provide real-time monitoring of specific log events:

    tail ~/.procmail/procmail.log -F | grep "Subject"

In this case, `tail` follows the `~/procmail/procmail.log` file. This output is passed to `grep`, which filters the stream and prints only lines that contain the string "Subject".

## Filtering Commands with Grep

`grep` can be used to filter long help files. This command filters the `tar` help text to more efficiently find the options for dealing with `bzip` files:

    tar --help | grep "bzip"

`grep` is also useful for filtering the output of `ls` when listing the contents of directories with a large number of files:

    ls /usr/lib | grep "xml"

## Grep Compressed Files with zgrep

`zgrep` command functions identically to the grep command above; however, it adds the ability to run grep operations on files that have been compressed with gzip without requiring an extra compression and decompression step. To search an older compressed log:

    zgrep -Eo "Invalid user.*([0-9]{1,3}\.){3}[0-9]{1,3}" /var/log/auth.log.2.gz

`zgrep` operations take longer than standard `grep` operations because of the additional overhead of reading the compressed files.
