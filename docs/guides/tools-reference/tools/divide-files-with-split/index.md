---
slug: divide-files-with-split
description: 'Practical examples for using split to divide large files into multiple smaller files.'
og_description: 'split is a Unix command line utility for dividing large files into smaller files. This guide provides basic and advanced examples along with explanations of the most common options and parameters.'
keywords: ["split", "files", "unix", "command-line"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-01-29
modified_by:
  name: Linode
published: 2018-01-29
title: How to Divide Files with split
tags: ["linux"]
aliases: ['/tools-reference/tools/divide-files-with-split/']
authors: ["Linode"]
---

## What is split?

`split` is a Unix command-line utility similar to `grep` or `tail`. It allows you to divide a larger file into several smaller files.

{{< note respectIndent=false >}}
Certain options for `split` will not work by default on macOS because the GNU version of split does not come pre-installed. Use Homebrew to install `brew install coreutils` then invoke in GNU split via `gsplit`.
{{< /note >}}

## Example Files

1.  Create `example.txt` in a text editor and add the following content:

    {{< file "example.txt" text >}}
example line 1
example line 2
example line 3
example line 4
example line 5
example line 6
example line 7
example line 8
example line 9
example line 10
{{< /file >}}

2.  Download the text of Moby Dick to demonstrate working with larger files:

        wget -O moby-dick.txt https://archive.org/stream/mobydickorwhale01melvuoft/mobydickorwhale01melvuoft_djvu.txt

## Basic Usage

1.  Run the `split` command with default options:

        split moby-dick.txt

2.  Check your working directory:

        ls

    {{< output >}}
moby-dick.txt  xaa  xab  xac  xad  xae  xaf  xag  ...
{{< /output >}}

    The new files present in the directory (`xaa`, `xab`, etc.) each contain a portion of the original file. By default, `split` divides a file into subfiles of 1000 lines each. The original `moby-dick.txt` file had 16,000 lines, resulting in 16 subfiles. The original `moby-dick.txt` file is left unchanged.

## Options and Parameters

#### Prefix

The first argument to `split` is the name of the file, as demonstrated above. An optional second argument allows you to specify the prefix for the output files. By default, this value is `x`.

    split moby-dick.txt moby-dick

Each of the files will begin with `moby-dick`.

{{< output >}}
moby-dick.txt  moby-dickaa  moby-dickab  moby-dickac  ...
{{< /output >}}

#### Split by Number of Lines

The `-l` option sets the length in lines of each subfile. This value is 1000 by default. The files output by the following command will each contain two lines of text:

    split -l 2 example.txt

{{< output >}}
$ cat xaa
example line 1
example line 2
{{< /output >}}

#### Split by Size

The `-b` (or `--size`) option divides files by size rather than number of lines. The following command will split the input file into subfiles of 100KB each:

    split -b 100k moby-dick.txt

You can specify this value in different formats:

- megabytes - **m**
- gigabytes - **g**
- terabytes - **t**

#### Split by Number of Files

To split a file into a specific number of subfiles, regardless of size or length, use the `-n` option. For example, to split a file into 3 parts:

    split -n 3 example.txt

#### Label Files Numerically

Use the `-d` option to label the output files numerically rather than alphabetically:

    split -l 2 -d example.txt

{{< output >}}
x00  x01  x02  x03  x04
{{< /output >}}


#### Set Suffix Length

Use the `-a` option to set the number of digits or letters used when labeling the output files. This option defaults to two (i.e. `x00`).

    split -a 1 -d -l 2 example.txt

{{< output >}}
x0  x1  x2  x3  x4
{{< /output >}}

## Advanced Examples

The following command combines the options above to split `example.txt` into 4 subfiles, each prefixed with `example-` and labeled numerically:

    split -a 1 -n 4 -d example.txt example-

{{< output >}}
example-0  example-1  example-2  example-3  example.txt
{{< /output >}}

`split` can also be used to display portions of files **without** creating subfiles. The following command will break Moby Dick into 100 pieces (without creating any new files) and display the 10th of those pieces:

    split -n 10/100 moby-dick.txt

Like many shell commands, `split` can also accept input from the output of another command using the pipe operator:

    grep whale moby-dick.txt | split -l 100
