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

Typical use cases involve using `file` to enumerate files that are incorrectly titled with the wrong extension and will likely cause an error when being opened by an application. The `file` command is also helpful if you want to investigate a suspicious file that may have been purposely mistitled for malicious reasons.  Eventually, you will encounter files that are missing their extension completely.  The `file` command will often be your irreplacable as your first and final troubleshooting step in dealing with these issues.

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



- using the `-s` flag will allow `file` to analyze block and character special files, rarely found outside of Linux's kernel, boot and /dev/ files.  Without this flag, `file` will only tell you that the file is a "block special".
