```bash
---
author:
  name: Linode
  email: docs@linode.com
description: 'Learn about the wc command, what it can do and how to use it.'
keywords: ["linux", "terminal", "basics"]
tags: ["quick-answers", "linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-09
modified_by:
  name: Linode
title: 'How To Use The Wc Command'
contributor:
  name: Jan Slezak
  link: https://github.com/scumdestroy
external_resources:
  - '[The IEEE and The Open Group - Wc](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/wc.html)'
  - '[Man Page for wc](https://man7.org/linux/man-pages/man1/file.1.html)'
  - '[Wikipedia Page for File(command)](https://en.wikipedia.org/wiki/Wc_%28Unix%29)'
---
```

Linux's `wc` command counts the words, characters or bytes of any non-binary files it receives.  It is a simple command that epitomizes the original Linux ethos of "Focus on one thing and do it well".   

### Syntax

Coupled with its simple explanation is an equally simple syntax.  The `wc` command can be followed by a file, though when one is not present, it will default to analyzing input that is piped to it (or "reading standard input").  

```
    wc [OPTIONS] [FILE]
    cat *.txt | wc [OPTIONS]
```

## Options

- `-c` or `--bytes` will print byte count

- `-m` or `--chars` will print character count

- `-l` or `--lines` will print newline or row count

- `-w` or `--words` will print word count

- `-L` will print the length of the longest word in characters 

### Usage

Output from `wc` is minimal, allowing for simple piping into other command line tools.

```
   cat file.txt | wc -l 
```

{{< output >}}

315 file.txt

{{< /output >}}

```
   wc customers.txt items.txt
```

{{< output >}}

22  22  101 customers.txt
15  19  145 items.txt
37  41  246 total

{{< /output >}}

### Common Usage Examples of `wc`

Counting the number of files and folders in your current directory.

```
   ls | wc -l 
```

{{< output >}}

22

{{< /output >}}

Comparing the output of an automated daily task against yesterdays data.
```
   wc -l today.txt yesterday.txt 
```

{{< output >}}

323 today.txt
311 yesterday.txt

{{< /output >}}
