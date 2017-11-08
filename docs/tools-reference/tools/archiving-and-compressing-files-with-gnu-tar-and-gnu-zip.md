---
author:
  name: Linode
  email: docs@linode.com
description: 'Use GNU tools to compress and archive files.'
keywords: ["tar", "gnu tar", "gzip", "gnu zip", "tar.gz. tgz", "file archive"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/common-commands/tar-gzip/']
modified: 2011-08-22
modified_by:
  name: Linode
published: 2010-07-27
title: Archiving and Compressing files with GNU Tar and GNU Zip
external_resources:
 - '[GNU tar](http://www.gnu.org/software/tar/)'
 - '[GNU gzip](http://www.gzip.org/)'
---

`tar` and `gzip` provide a standard interface for creating archives and compressing files on Linux-based systems. Fundamentally, the function of these utilities is to take a large number of files, save them together in an archive (i.e. as a single file), and compress the archive to save space. However, tar and gzip provide a multitude of features that may obfuscate even the most simple of operations.

This document provides an overview of `tar` and `gzip` usage, accompanied by a number of practical applications of these utilities. If you find this guide helpful, please consider our guide to [basic administration practices](/docs/using-linux/administration-basics) or the rest of the [Tools & Reference](/docs/tools-reference/) series.

![Title graphic](/docs/assets/archiving_and_compressing_files_with_gnu_tar_and_gnu_zip_smg.png)

## Using Tar and Gzip

In this guide, `tar` and `gzip` refer to recent versions of "GNU tar" and "GNU gzip" which are included by default in all images provided by Linode, and as part of the common "base" selection of packages provided in nearly all distributions of Linux-based operating systems.

### The tar Command

The complexity of `tar` does not derive from its basic form, but rather from the number of options and settings that you can use to create and interact with archives. Given the `tar` file `~/backup-archive.tar`, the following command can be used to extract the contents of this file into the current directory:

    tar -xf ~/backup-archive.tar

This will extract (`-x`) the archive specified by the file (`-f`) named on the prompt. This archive is not compressed. To create an archive of all the files in the directory `~/backup`, issue a command on the following form:

    tar -c ~/backup > backup-archive.tar

By default, `tar` sends the contents of the archive file to the standard output, you can use to this to further process the archive you create. You may choose to bypass the standard output functionality with the `-f` option. The following command is equivalent to the previous command:

    tar -cf backup_archive.tar ~/backup

When using the `-f` option, always specify the file name of the archive you want to create before specifying the contents of the archive. You may also add a `-v` option to increase the verbosity of some commands. For instance the following command will output a list of files as they are added to the archive:

    tar -cvf backup_archive.tar ~/backup

The order of options is sometimes important. The `-f` option needs to be the last option, and thus appear closest to the name of the file that it specifies. Therefore `-cvf` will perform as expected while `-cfv` will fail. Many common tasks using the `tar` command are explained below.

### The gzip Command

`gzip` and the accompanying `gunzip` command provide a simple and standard method of compressing individual files. Just as `tar` does not contain the ability to compress the files that it archives, the `gzip` tools are only able to act on single files. The following command takes the file `full-text.txt` and compresses it in the file `full-text.txt.gz` :

    gzip full-text.txt

You can then use either of the following commands to decompress this file:

    gunzip full-text.txt.gz
    gzip -d full-text.txt.gz

You can add the `-v` flag to increase verbosity and output statistics regarding the rate of compression. This command would resemble the following:

    gzip -v full-text.txt

`gzip` accepts standard input and thus can be used to compress the output of a stream of text. Consider the following example:

    cat full-text.txt | gzip > full-text.txt.gz

The compression algorithm that gzip uses to compress files (e.g. `DEFLATE`), can be configured to compress content more severely and thus save space at the expense of time. This ratio is controlled by a numeric argument between `-1` and `-9`. The default configuration is `-6`. `gzip` also contains `--fast` (equivalent to `-1`) and `--best` (equivalent to `-9`) as helpful mnemonics. Consider the following examples and their output:

    gzip --best -v full-text.txt
    gzip --fast -v full-text.txt
    gzip -3 -v full-text.txt
    gzip -8 -v full-text.txt

## Creating An Archive

As stated above you can create a `tar` archive of the `~/backup` directory with the following command:

    tar -c ~/backup > backup-archive.tar

The archive, which is uncompressed, will end up in the `backup-archive.tar` file. To create a file without using the standard output redirection, you may consider the following equivalent form:

    tar -cf backup_archive.tar ~/backup

The order that options (e.g. the `-cf`) are invoked in is important, and the `-f` option must be followed directly by the name of the file that the `tar` archive will create. The final argument is the folder or selection of files to be included in the archive.

## Compressing Archives

### Compress an Archive using Gzip

In conventional usage, `tar` is combined with a compression utility to not only archive files for more efficient backup but also compress them. However, some alternate compression and archiving tools with which you may be familiar include both functions in a single procedure. However, modern versions of `tar` are able to interface with common compression libraries and tools like `gzip` to compress archives effectively. Consider the following command:

    tar -czf ~/backup-archive.tar.gz ~/backup/

The `-z` option in this command compresses the archive using `gzip`, which is a common practice when creating "tar files".

### Compress an Archive using Bzip2 and Xzip Compression

`tar` also supports using other compression systems which may offer better compression rates at the expense of processor time. To compress using `bzip2`, issue the following command:

    tar -cjf ~/backup-archive.tar.bz2 ~/backup/

To use the `xzip` tool for compression use the `-J` option as follows:

    tar -cJf ~/backup-archive.tar.xz ~/backup/

### Automatically Determining Compression Based on File Extension

To remove the necessity of remembering the corresponding file extensions and `tar` options, you can use the `-a` option which allows tar to detect the desired compression system based on the file extension. Therefore, the following commands will all create a `tar` archive compressed with `gzip`:

    tar -czf ~/backup-archive.tar.gz ~/backup/
    tar -caf ~/backup-archive.tar.gz ~/backup/
    tar -caf ~/backup-archive.tgz ~/backup/

Similarly the following commands will all create archives with `tar` compressed with `bzip`:

    tar -cjf ~/backup-archive.tar.bz2 ~/backup/
    tar -caf ~/backup-archive.tar.bz2 ~/backup/
    tar -caf ~/backup-archive.tb2 ~/backup/
    tar -caf ~/backup-archive.tbz ~/backup/

As above, `tar` will auto detect for zip compression given the extensions `.tar.xz` and `.txz`.

## Discover the Contents of an Archive

While you can always extract the contents of an archive to learn the manifest of files, this may prove inefficient or prohibitively inconvenient. `tar` provides the ability to view the manifest of files in an archive. Consider the following example:

    tar -tf ~/backup-archive.tar

This will produce a list of files contained within the archive. This command works with both compressed and uncompressed tar archives.

## Extracting Files from a tar Archive

To extract files from a `tar` archive, issue the following command:

    tar -xf ~/backup-archive.tar

This command simply extracts the content of an uncompressed `tar` archive into the current directory. Let's consider a more practical example of how `tar` may be used to extract files from a compressed archive:

    tar -xzvf ~/backup-archive.tar.gz

The options specified have the following effects: `-x` extracts the contents of the archive, `-z` filters the archive through the `gzip` compression tool, `-v` enables verbose output which prints a list of files as they are extracted from the archive, and `-f` specifies that `tar` will read input from the subsequently specified file `~/backup-archive.tar.gz`.

When an archive is compressed with one of the other compatible compression tools, you will need to replace the `-z` option with the appropriate option flag for the compression type used. Therefore, to unpack an archive compressed with the `bzip2` tool you might issue a command in the following form:

    tar -xcvi ~/backup-archive.tar.bz2

The `-a` option that automatically determines which compression tool to use based on the file extension is available in conjunction with the extraction option `-x`. Additionally, `tar` provides a `-k` option to prevent replacing an existing file with a similar named file from a `tar` archive.

## Compressing Log Files

There are some files, particularly log files created by long running daemons like web and email servers, that can grow to a great size. While removing these files does not present a viable option, these files can grow unmanageably large in a short time. Since they are plain text, compression is very effective; however, because log files tend to be distinct and independent of each other, it doesn't make sense to use a tool like `tar`. In these cases it makes sense to use `gzip` directly as in the following example:

    gzip /var/log/mail.log

This will replace the original `/var/log/mail.log` with a file named `mail.log.gz`. If you need to access to the contents of this file you can issue the following command to uncompress the contents:

    gunzip /var/log/mail.log.gz

However, in most cases you do not need to fully uncompress a file in order to access its contents. The `gzip` tool includes tools for accessing "gzipped" files with conventional Unix tools. You can access the contents of files compressed with gzip using the following utilities: `zcat` (equivalent to `cat`), `zgrep` (equivalent to `grep`) and `zless` (equivalent to `less`).
