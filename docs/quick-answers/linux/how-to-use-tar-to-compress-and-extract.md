---
author:
  name: Angel Guarisma
  email: docs@linode.com
description: 'Tar, is a GNU utility that provides the ability to create tar archives, extract and compress files.'
og_description: 'This guide will detail how to compress and extract files using tar on the Unix filesystem'
keywords: ["tar", "star", "GNU-Tar"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-02-01
modified: 2018-02-01
modified_by:
  name: Linode
title: 'Extract and Compress Files with TAR'
---

`tar` and `gzip` provide a standard interface for creating archives and compressing files on Linux. Fundamentally, the function of these utilities is to take a large number of files, save them together in an archive, and compress the archive to save space.

## Compress and Zip a Directory

1. Make a directory on your system:

        mkdir testdir && touch testdir/touch.txt

2. Use `tar` to compress the new directory:

        tar -cvf testdir.tar testdir/

3. Check for the newely compressed file:

        ls
  {{< output >}}
tesdir testdir.tar
{{< /output >}}

4. Zip the file using `gzip`:

        gzip testdir.tar

5. Checking for the file will now show:

        ls
  {{< output >}}
testdir.tar.gz
{{< /output >}}

    The chained file extensions (.tar.gz) indicate that this is a compressed archive. You can see the difference in size between the two files:

    {{< output >}}
[Docs@tar ]$ ls -l --block-size=KB
total 9kB
drwxrwxr-x 2 linode linode 5kB Jan 30 13:13 testdir
-rw-rw-r-- 1 linode linode 1kB Jan 30 13:29 testdir.tar.gz
{{</ output >}}

6. Extract the directory:

        rm -r testdir
        tar -xzvf testdir.tar.gz

    {{< output >}}
testdir/
testdir/test.txt
{{</ output >}}

In these examples the flags that were used are:

* `-c`: Creates a new archive in the form of a `tar` file.
* `-v`: Verbose flag, outputs a log after running the command.
* `-z`: Zips or unzips using `gzip`.
* `-x`: Extracts a file from the archive.
* `-f`: Defines STDOUT as the filename, or uses the next parameter.

Some of the common flags used with the `tar` command are:

|Flag   |Function   |
|---|---|
|-A |Append tar files to an already existing archive.   |
|-d |Show differences between an archive and a local filesystem.   |
|-delete |Delete from the archive.   |
|-r |Append files to the end of an archive.   |
|-t |List the contents of an archive.   |
|-u |Append but don't overwrite the current archive.   |


These are just the basics. For a more wholistic approach to archiving and compressing, check out our guide: [Archiving and Compressing files with GNU tar and GNU zip](/docs/tools-reference/tools/archiving-and-compressing-files-with-gnu-tar-and-gnu-zip)
