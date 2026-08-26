```bash
---
author:
  name: Linode
  email: docs@linode.com
description: 'Learn about the file command, why its useful and when to use it.'
keywords: ["linux", "terminal", "basics"]
tags: ["quick-answers", "linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-09
modified_by:
  name: Linode
title: 'How To Use The File Command'
contributor:
  name: Jan Slezak
  link: https://github.com/scumdestroy
external_resources:
  - '[The IEEE and The Open Group - File](https://pubs.opengroup.org/onlinepubs/009604599/utilities/file.html)'
  - '[Man Page for File](https://man7.org/linux/man-pages/man1/file.1.html)'
  - '[Wikipedia Page for File(command)](https://en.wikipedia.org/wiki/File_(command))'
---
```

Linux's `file` command is an essential utility that examines a specified file and reports on its filetype.  

### Syntax

Coupled with its simple explanation is an equally simple syntax.

        file [OPTIONS] [FILE]

### When To Use `file`

Typical use cases involve using `file` to enumerate files that are incorrectly titled with the wrong extension and will likely cause an error when being opened by an application. The `file` command is also helpful if you want to investigate a suspicious file that may have been purposely mistitled for malicious reasons.  Eventually, you will encounter files that are missing their extension completely.  Under UNIX and Linux systems, a file extension has no real meaning The `file` command will often be your irreplacable as your first and final troubleshooting step in dealing with these issues.

### Examples

Output from `file` may be quite brief or extensive, depending on the information received from its enumeration tests.

       file /home/user/go/bin/jaeles

{{< output >}}

/home/user/go/bin/jaeles: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linu
x-x86-64.so.2, BuildID[sha1]=19626540e62d483ee7d397a85502805a00e17100, for GNU/Linux 3.2.0, stripped

{{< /output >}}

        file file1

{{< output >}}

file1: UTF-8 Unicode text

{{< /output >}}



`file` can be used to test multiple files at a time

        file file1 file2 file3 file4



- using the flag `-i` will show a file's mime-type instead

        file -i file1

{{< output >}}

file1: text/plain; charset=utf-8

{{< /output >}}



- using the `-z` flag will report the files within a compressed archive (like .zip, .tar, .gz and .7zip files)

        file -z archive.tar

{{< output >}}

archive.tar: ASCII text (tar compressed data, was "archive.txt")

{{< /output >}}


- using the `-b` flag will only show the filetype, without echoing the filename.  This clean output can be useful when scripting

        file -b ~/.profile

{{< output >}}

ASCII text

{{< /output >}}

- using the `-F` flag will allow you to specify your own field seperator, instead of the default ":" that exists between the filename and the filetype.  As above, this would likely only be used in scripting, commonly to organize or measure groups of files and their attributes.

        $ file -F ":: [[As I focus on this file, certain words come to mind...]]" NTUSER.DAT

{{< output >}}

NTUSER.DAT:: [[As I focus on this file, certain words come to mind...]] writable, executable, regular file, no read permission

{{< /output >}}


- using the `--extension` flag will print a slash-seperated list of valid extensions for the file you queried.  This can be useful in troubleshooting various programs, restoring corrupted files and other analytical purposes.

        file --extension libpq.dll

{{< output >}}

libpq.dll: dll/cpl/tlb/ocx/acm/ax/ime

{{< /output >}}


- using the `-k` flag will cause file to continue enumerating the file beyond the first match it finds.  Matches beyond the first will automatically have `\012- ` prepended to them.  Subsequent matches can be displayed on a newline by adding the `-r` flag for improved readability.

        file cert.der ; file -k cert.der

{{< output >}}

cert.der: Certificate, Version=3
cert.der: Certificate, Version=3\012- data

{{< /output >}}

- using the `-s` flag will allow `file` to analyze block and character special files, rarely found outside of Linux's kernel, boot and /dev/ files.  Without this flag, `file` will only tell you that the file is a "block special".

### Deep Dive Into The `file` Command

*Though not essential to succesful and effective use of the file command, the following information can assist with debugging strange behavior or further aid in difficult to classify files*

In order to determine the filetype of a given file, this seemingly simple command performs quite a bit of testing and enumeration in the background.  To best classify a file, the system performs three sets of ordered tests (filesystem, magic and language).  The first of these to succeed will be printed in the terminal and the rest will be skipped.  

Filesystem tests attempt to determine filetype by examining the return from a stat(2) system call.  These tests include checks to see if the file is empty, if it is a known special file, a file relevant to the specific operating system being ran and its capabilities and checks into the system header file (`<sys/stat.h>`) for a match.

The magic tests check for data bound to fixed formats, specifically a "magic number" stored in a particular place near the beginning of the file that lets the system know that it is one of several types of binary executables.  Any files with a small, fixed offset, for identification purposes is usually identified throughout this set of tests.  The list of potential identifiers to check against is typically found at `/usr/share/misc/magic.mgc` or `/usr/share/misc/magic`.

Finally, if a file has not been identified in the first two sets of tests, its contents are examined for printable text and its contents are matched to character sets such as ASCII, UTF-8-encoded-Unicode, EBCDIC and more.  Further clues can be found in the text's method of line termination (whether it uses CR, CRLF or NEL, rather than the Unix-standard LF) and other artifacts, such as embedded escape sequences or overstriking.  Once a character set is determined for the file, it looks for keywords that may denote a programming language, like the keyword "struct" would most likely be found within a C program.  If no tests are passed, the file will simply be called "data".

The testing flow described above can be customized through the usage of the `-e` flag, which allows you to exclude tests of your choise.  Valid test names include:
- apptype
- ascii
- encoding
- tokens
- cdf (acronym for "Compound Document Files")
- compress
- csv
- elf
- json
- soft (consults magic files)
- tar
- text (synonymous for ascii)
