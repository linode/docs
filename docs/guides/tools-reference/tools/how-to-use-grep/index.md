---
slug: how-to-use-grep
title: How to Use the Grep Command to Find Information in Files
description: "An extensive guide on how to grep for text in files in Unix based systems. Understand search, match, and advanced regex to grep for text in files."
keywords: ["how to use grep", "grep usage", "grep tutorial"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Linode"]
published: 2010-06-30
modified: 2023-11-14
modified_by:
  name: Linode
external_resources:
  - '[Grep | Regular-Expressions.info](https://www.regular-expressions.info/grep.html)'
  - '[Perl Regular Expressions](https://perldoc.perl.org/perlre.html)'
aliases: ['/tools-reference/how-to-grep-for-text-in-files/','/tools-reference/search-and-filter-text-with-grep/','/tools-reference/tools/how-to-grep-for-text-in-files/','/linux-tools/common-commands/grep/','/guides/how-to-grep-for-text-in-files/']
tags: ["linux"]
image: search_and_filter_text_with_grep_smg.png
---

Grep is a command-line utility that can search and filter text using a common regular expression syntax. It is so ubiquitous that the verb "to grep" has emerged as a synonym for "to search". The `grep` command is a useful tool for finding all occurrences of a search term in a selection of files or the output of another command. It can also come in handy when filtering a log file or stream and when used as part of a script or chain of commands.

This tutorial provides an overview of how to use `grep`, a brief introduction to regular expression syntax, and practical examples.

## How to Use Grep

This guide references recent versions of GNU grep, which are included by default in all images provided by Akamai. It is also provided as part of the common base selection of packages provided in nearly all Linux distributions.

### The Grep Command

A basic `grep` command uses the following syntax:

```command
grep "string" ~/example.txt
```

The first argument to `grep` is a search pattern. The second (optional) argument is the name of a file to be searched. The above sequence searches for all occurrences of the word "string" in the `~/example.txt` file.

You can use `grep` to search a single file or multiple files. If you want to search files in a directory, include the `-r` flag. It enables recursive searching through a directory tree, including subdirectories:

```command
grep -r "string" ~/example/
```

When used on a specific file, `grep` only outputs the lines that contain the matching string. In recursive mode, `grep` outputs the full path to the file, followed by a colon, and the contents of the line that matches the pattern. By default, patterns in `grep` are basic regular expressions. If you need a more expressive regular expression syntax, `grep` is capable of accepting patterns in alternate formats with the following flags:

| Flag | Usage |
| -- | -- |
| `-E` | Use extended regular expression syntax. Equivalent to the deprecated `egrep` command. |
| `-P` | Use Perl regular expression syntax. |

Grep provides a number of powerful options to control its output:

| Flag | Usage |
| -- | -- |
| `-o` | Output only the matching segment of each line, rather than the full contents of each matched line. |
| `-i` | Ignore case distinctions, so that characters only differing in case still match. |
| `-n` | Print the line number of each matched line. |
| `-C 2` | Show 2 (or any number of) adjacent lines in addition to the matched line. |
| `-v` | Invert the sense of matching, to select non-matching lines. |
| `-e` | Specify a pattern. If this option is used multiple times, search for all patterns given. This option can be used to protect a pattern beginning with `-`. |

### Piping Command Outputs to grep

In addition to reading content from files, `grep` can read and filter text from standard input. The output of any command or stream can be piped to the `grep` command. Then `grep` then filters this output according to the match pattern specified and outputs only the matching lines. For example:

```command
ls --help | grep "dired"
```

This filters the output of the `ls` command's help text and looks for appearances of "dired", and outputs them to standard out:

```output
  -D, --dired                generate output designed for Emacs' dired mode
```

### Regular Expression Overview

While straightforward pattern matching is sufficient for some filtering tasks, the true power of `grep` is its ability to use regular expressions for complex pattern matching. Most characters in regular expressions match with input data literally. However, there are some sequences that carry special significance:

| Symbol | Result |
|--|--|
| `.` | Matches any character. |
| `*` | Matches zero or more instances of the preceding character. |
| `+` | Matches one or more instances of the preceding character. |
| `[]` | Matches any of the characters within the brackets. |
| `()` | Creates a sub-expression that can be combined to make more complicated expressions. |
| `\|` | The **OR** operator. For Example, (www\|ftp) matches either "www" or "ftp". |
| `^` | Matches the beginning of a line. |
| `$` | Matches the end of the line. |
| `\\` | Escapes the following character. Since `.` matches any character, to match a literal period you would need to use `\.`.  |

## Filtering Logs with Grep

Another popular use of `grep` is to find text files generated by a system, such as logs:

```command
grep -Eoc "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}.* 200"  /srv/www/example.com/logs/access.log
```

Here, `grep` filters an Apache access log for lines beginning with an IP address, followed by a number of characters, a space, and `200` (representing a successful HTTP connection). The `-c` option only outputs the number of matches. To get the output of the IP address of the visitor and the path of the requested file for successful requests, omit the `-c` flag:

```command
grep -Eo "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}.* 200"  /srv/www/example.com/logs/access.log
```

The curly brackets specify the number of instances of the pattern. `{1,3}` requires that the previous character occur at least once, but no more than three times. The character class `[0-9]` matches against one or more numeric digits. You can also generate similar output that reports on unsuccessful attempts to access content by searching for `404` instead of `200`:

```command
grep -Eo "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}.* 404"  /srv/www/example.com/logs/access.log
```

The following command generates a list of all IP addresses that have attempted to connect to your web server. Using the `-o` option, only the matching strings are sent to standard output. This output is filtered through the utility `uniq` with the *pipe* operator (`|`) to filter out duplicate entries:

```command
grep -Eo "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" /srv/www/example.com/logs/access.log | uniq
```

The next example uses an alternative pattern for matching an IP address in a different log. The following command searches the most recent `/var/log/auth.log` file for invalid login attempts:

```command
grep -Eo "Invalid user.*([0-9]{1,3}\.){3}[0-9]{1,3}" /var/log/auth.log
```

You can split the above command into two layers to output a list of IP addresses with failed login attempts to your system:

```command
grep "Invalid user" /var/log/auth.log | grep -Eo "([0-9]{1,3}\.){3}[0-9]{1,3}" | uniq
```

`grep` can filter the output of commands such as `tail -F` to provide real-time monitoring of specific log events:

```command
tail ~/.procmail/procmail.log -F | grep "Subject"
```

In this case, `tail` follows the `~/.procmail/procmail.log` file. This output is passed to `grep`, which filters the stream and prints only lines that contain the string "Subject".

## Filtering Commands with Grep

`grep` can be used to filter long help files. This command filters the `tar` help text to more efficiently find the options for dealing with `bzip` files:

```command
tar --help | grep "bzip"
```

`grep` is also useful for filtering the output of `ls` when listing the contents of directories with a large number of files:

```command
ls /usr/lib | grep "xml"
```

## Excluding Patterns with grep

You can also use `grep` to return non-matching lines by using the `-v` flag to perform an invert search. For example, the following command only returns lines that do *not* contain the pattern "string":

```command
grep -v "string" ~/threads.txt
```

You can also exclude multiple search patterns using invert search with `grep -v` by using the `-e` flag before each pattern as follows:

```command
grep -v -e "string" -e "yarn" ~/threads.txt
```

When you run the above command, it outputs all lines that do not contain "string" or "yarn".

## Excluding grep When Using ps

A useful application of invert searching is to exclude "grep" itself from a `grep` output, such as when using the `ps` command. For example, use the following command to search for all current processes that contain the pattern "log":

```command
ps ax | grep log
```

```output
576 ?        Ss     0:00 @dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only
583 ?        Ssl    0:00 /usr/sbin/rsyslogd -n -iNONE
592 ?        Ss     0:00 /lib/systemd/systemd-logind
4967 pts/0    S+     0:00 grep --color=auto log
```

Notice the last line of the output contains `grep log`, which is not relevant to the purpose of the search. You can exclude this line by using a pipe operator `|` and adding `grep -v grep` after it as follows:

```command
ps ax | grep log| grep -v grep
```

```output
576 ?        Ss     0:00 @dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only
583 ?        Ssl    0:00 /usr/sbin/rsyslogd -n -iNONE
592 ?        Ss     0:00 /lib/systemd/systemd-logind
```

While using `grep -v grep` not only excludes the `grep log` line, it also skips all other lines that contain "grep", which may not be ideal. Luckily, there are other ways to remove `grep` from your output.

You can modify the `grep log` command and add a character class match to specifically match the first character `l` from log. This works because the excluded line contains `grep [l]og`, while only matches for "log" are returned. Run the command below to do a character class match for `l` as a character:

```command
ps ax | grep '[l]og'
```

```output
576 ?        Ss     0:00 @dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only
583 ?        Ssl    0:00 /usr/sbin/rsyslogd -n -iNONE
592 ?        Ss     0:00 /lib/systemd/systemd-logind
```

Alternatively, you can use the `pgrep` command instead of `grep` to search your current processes:

```command
pgrep -af log
```

```output
576 @dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only
583 /usr/sbin/rsyslogd -n -iNONE
592 /lib/systemd/systemd-logind
```

## Grep Compressed Files with zgrep

The `zgrep` command functions identically to the `grep` command above. However, it adds the ability to run `grep` operations on files that have been compressed with gzip without requiring decompression. To search an older compressed log:

```command
zgrep -Eo "Invalid user.*([0-9]{1,3}\.){3}[0-9]{1,3}" /var/log/auth.log.2.gz
```

`zgrep` operations take longer than standard `grep` operations because of the additional overhead of reading the compressed files.