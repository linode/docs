---
slug: compress-files-using-the-command-line
description: "Tar, is a GNU utility that provides the ability to create tar archives, extract and compress files in Linux. Check out our step-by-step guide here"
og_description: "This guide will detail how to compress and extract files using tar on the Unix filesystem"
keywords: ["tar", "star", "GNU-Tar", "cryptocurrency"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-02-01
modified: 2018-02-01
modified_by:
  name: Linode
title: "Archive, Compress, and Extract Files in Linux Using the Command Line"
title_meta: "How to Archive, Extract & Compress Files in Linux"
tags: ["linux"]
aliases: ['/quick-answers/linux/compress-files-using-the-command-line/']
authors: ["Angel Guarisma"]
---

`tar` and `gzip` provide a standard interface to create archives and to compress files in Linux. These utilities take a large number of files, save them together in an archive, and compresses the archive to save space. `tar` does not compress files by itself. Used in conjunction with `gzip`, an archived file can be compressed to reduce disk space. The resulting archived file has the file extension, `tar.gz` and is sometimes called a "tarball".

## Archive a Directory

1.  Make a directory on your system and create a text file:

        mkdir testdir && touch testdir/example.txt

2.  Use `tar` to archive the directory:

        tar -cvf testdir.tar testdir/

3.  Check for the newly archived tar compressed file:

        ls

    {{< output >}}
tesdir  testdir.tar
{{< /output >}}

## Compression with gzip

1.  Compress files in Linux using `gzip`:

        gzip testdir.tar

2.  Checking for the output file will show:

        ls

    {{< output >}}
testdir  testdir.tar.gz
{{< /output >}}

3.  The chained file extension (`.tar.gz`) indicates that this is a compressed archive. You can see the difference in size between the two files, before and after compression:

        ls -l --block-size=KB

    {{< output >}}
total 9kB
drwxrwxr-x 2 linode linode 5kB Jan 30 13:13 testdir
-rw-rw-r-- 1 linode linode 1kB Jan 30 13:29 testdir.tar.gz
{{</ output >}}

## Extract a Tarball

Extract the directory:

    tar -xzvf testdir.tar.gz

{{< output >}}
testdir/
testdir/test.txt
{{</ output >}}

The flags used in these example stand for:

* `-c`: Create a new archive in the form of a `tar` file.
* `-v`: Verbose flag, outputs a log after running the command.
* `-z`: Zips or unzips using `gzip`.
* `-x`: Extract a file from the archive.
* `-f`: Define STDOUT as the filename, or uses the next parameter.

## Common Options for Compressing and Archiving Files in Linux

Additional flags used with the `tar` command are:

|Flag   |Function                                                   |
|-------|-----------------------------------------------------------|
|-A     |Append tar files to an existing archive.                   |
|-d     |Show differences between an archive and a local filesystem.|
|-delete|Delete from the archive.                                   |
|-r     |Append files to the end of an archive.                     |
|-t     |List the contents of an archive.                           |
|-u     |Append but don't overwrite the current archive.            |

These are the basics for working within the command line. Be sure to check the man pages `man tar` for a more detailed listing of possible flags when compressing and extracting files.

