---
slug: how-to-use-grep
title: How to use grep
description: "Learn how to use grep to search files, filter command output, and match text patterns with regular expressions on Linux systems."
authors: ["Akamai"]
contributors: ["Akamai", "Adam Overa"]
published: 2010-06-30
modified: 2026-06-05
keywords: ["grep", "linux grep", "grep command", "regular expressions", "text search"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
  - '[Grep | Regular-Expressions.info](https://www.regular-expressions.info/grep.html)'
  - '[Perl Regular Expressions](https://perldoc.perl.org/perlre.html)'
aliases: ['/tools-reference/how-to-grep-for-text-in-files/','/tools-reference/search-and-filter-text-with-grep/','/tools-reference/tools/how-to-grep-for-text-in-files/','/linux-tools/common-commands/grep/','/guides/how-to-grep-for-text-in-files/','/quick-answers/linux/how-to-use-grep/','/quick-answers/how-to-use-grep/','/guides/how-to-use-grep-command/']
tags: ["linux"]
---

`grep` is a command-line utility for searching and filtering text in files, command output, and log streams using pattern matching and regular expressions.

This guide provides an overview of `grep`, a brief introduction to regular expression syntax, and practical examples.

## Basic `grep` command syntax

A basic `grep` command uses the following syntax:

```command
grep "string" ~/example.txt
```

The first argument to `grep` is a search pattern. The second (optional) argument is the name of a file to search. The example above searches `~/example.txt` for lines containing the word "string".

You can use `grep` to search a single file or multiple files. To search files in a directory, include the `-r` flag. It enables recursive searching through a directory tree, including subdirectories:

```command
grep -r "string" ~/example/
```

When used on a specific file, `grep` only outputs the lines that contain the matching string. In recursive mode, `grep` outputs the full path to the file, followed by a colon, and the contents of the line that matches the pattern.

`grep` also provides a number of options to control its output:

| Flag | Usage |
| -- | -- |
| `-o` | Output only the matching segment of each line, rather than the full contents of each matched line. |
| `-i` | Ignore case distinctions, so that characters only differing in case still match. |
| `-n` | Print the line number of each matched line. |
| `-C 2` | Show 2 (or any number of) adjacent lines in addition to the matched line. |
| `-v` | Invert the matching logic, to print non-matching lines. |
| `-e` | Specify a pattern. If this option is used multiple times, search for all patterns given. This option can be used to protect a pattern beginning with `-`. |

### Regular expressions

By default, `grep` uses basic regular expressions (BRE). You can also use extended regular expressions (ERE) or Perl-compatible regular expressions (PCRE) with the following flags:

| Flag | Usage |
| -- | -- |
| `-E` | Use extended regular expression syntax. Replaces the deprecated `egrep` command. |
| `-P` | Use Perl-compatible regular expression (PCRE) syntax. Support for this option depends on the `grep` implementation available on your system. |

The following examples use extended regular expression syntax (`grep -E`). While most characters in a regular expression match literal text, the following characters have special meaning:

| Symbol | Result |
|--|--|
| `.` | Matches any character. |
| `*` | Matches zero or more instances of the preceding character. |
| `+` | Matches one or more instances of the preceding character. |
| `[]` | Matches any of the characters within the brackets. |
| `()` | Creates a sub-expression for grouping patterns. |
| `|` | The **OR** operator. For example, `(www|ftp)` matches either `www` or `ftp`. |
| `^` | Matches the beginning of a line. |
| `$` | Matches the end of the line. |
| `\\` | Escapes the following character. Since `.` matches any character, to match a literal period you would need to use `\.`.  |

## Filtering logs

A common use of `grep` is searching system-generated text files such as logs:

```command
grep -Eoc "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}.* 200"  /srv/www/example.com/logs/access.log
```

Here, `grep` filters an Apache access log for lines beginning with an IP address, followed by a number of characters, a space, and `200` (representing a successful HTTP connection). The `-c` option only outputs the number of matches. To get the output of the IP address of the visitor and the path of the requested file for successful requests, omit the `-c` flag:

```command
grep -Eo "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}.* 200"  /srv/www/example.com/logs/access.log
```

The curly brackets specify the number of instances of the pattern. `{1,3}` requires that the previous character occur at least once, but no more than three times. The character class `[0-9]` matches a single numeric digit. Combined with `{1,3}`, it matches between one and three digits. You can also generate similar output that reports on unsuccessful attempts to access content by searching for `404` instead of `200`:

```command
grep -Eo "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}.* 404"  /srv/www/example.com/logs/access.log
```

The following command generates a list of unique IP addresses found in the access log. Using the `-o` option, only the matching strings are sent to standard output. The results are sorted and deduplicated using `sort -u`:

```command
grep -Eo "^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" /srv/www/example.com/logs/access.log | sort -u
```

The next example searches authentication logs for invalid user login attempts. On Debian-based systems, these events are typically recorded in `/var/log/auth.log`. On RHEL-based systems, similar authentication events are usually logged to `/var/log/secure`:

```command
grep -Eo "Invalid user.*([0-9]{1,3}\.){3}[0-9]{1,3}" /var/log/auth.log
```

To output a unique list of IP addresses associated with failed login attempts, match only the IP address portion and sort the results:

```command
grep -Eo "Invalid user.*([0-9]{1,3}\.){3}[0-9]{1,3}" /var/log/auth.log | grep -Eo "([0-9]{1,3}\.){3}[0-9]{1,3}" | sort -u
```

`grep` can filter live command output to monitor specific events in real time:

```command
journalctl -f | grep ssh
```

In this example, `journalctl -f` follows the system journal in real time, while `grep` filters the stream to show only lines related to SSH activity.

## Filtering command output

In addition to reading content from files, `grep` can read and filter text from standard input. You can pipe command output or other text streams to `grep`, which filters the incoming text according to the specified match pattern and prints only matching lines. For example:

```command
ls --help | grep "dired"
```

This filters the output of the `ls` command's help text and prints lines containing "dired":

```output
  -D, --dired                generate output designed for Emacs' dired mode
```

`grep` can be used to filter long help files. This command filters the `tar` help text to display options related to `bzip` files:

```command
tar --help | grep "bzip"
```

## Excluding patterns

You can also use `grep` to return non-matching lines by using the `-v` flag to perform an invert search. For example, the following command only returns lines that do *not* contain the pattern "string":

```command
grep -v "string" ~/threads.txt
```

You can also exclude multiple search patterns using invert search with `grep -v` by using the `-e` flag before each pattern as follows:

```command
grep -v -e "string" -e "yarn" ~/threads.txt
```

When you run the above command, it outputs all lines that do not contain "string" or "yarn".

### Excluding `grep` when using `ps`

For process searches, `pgrep` is usually a cleaner option than filtering `ps` output manually:

```command
pgrep -af log
```

```output
576 @dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only
583 /usr/sbin/rsyslogd -n -iNONE
592 /lib/systemd/systemd-logind
```

Older `ps | grep` patterns are still common and useful to understand. For example, the following command searches for running processes that contain the pattern "log":

```command
ps ax | grep log
```

```output
576 ?        Ss     0:00 @dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only
583 ?        Ssl    0:00 /usr/sbin/rsyslogd -n -iNONE
592 ?        Ss     0:00 /lib/systemd/systemd-logind
4967 pts/0    S+     0:00 grep --color=auto log
```

Notice the last line of the output contains `grep log`, which is not relevant to the purpose of the search. You can exclude this line by using a pipe operator (`|`) and adding `grep -v grep` after it as follows:

```command
ps ax | grep log | grep -v grep
```

```output
576 ?        Ss     0:00 @dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only
583 ?        Ssl    0:00 /usr/sbin/rsyslogd -n -iNONE
592 ?        Ss     0:00 /lib/systemd/systemd-logind
```

While `grep -v grep` excludes the `grep log` line, it also excludes any other lines containing the word "grep", which may not be ideal.

Another approach uses a character class match to avoid matching the `grep` process itself:

```command
ps ax | grep '[l]og'
```

```output
576 ?        Ss     0:00 @dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only
583 ?        Ssl    0:00 /usr/sbin/rsyslogd -n -iNONE
592 ?        Ss     0:00 /lib/systemd/systemd-logind
```

## Search compressed files with `zgrep`

On systems with `gzip` installed, the `zgrep` command provides `grep`-like searching for files compressed with `gzip`. For example, to search an older compressed log:

```command
zgrep -Eo "Invalid user.*([0-9]{1,3}\.){3}[0-9]{1,3}" /var/log/auth.log.2.gz
```

`zgrep` operations take longer than standard `grep` operations because of the additional overhead of reading the compressed files.