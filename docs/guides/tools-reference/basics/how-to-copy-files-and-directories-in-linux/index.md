---
slug: how-to-copy-files-and-directories-in-linux
description: 'This guide explains how to copy files and folders in Linux, including how to copy to different directories.'
keywords: ['Copy a file linux','Copying a file linux','Copying files linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-18
modified_by:
  name: Linode
title: "Copy Files and Directories in Linux"
title_meta: "How to Copy Files and Directories in Linux"
external_resources:
- '[man page for cp command](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/cp.html)'
- '[Ubuntu 22.04 documentation for the cp command](https://manpages.ubuntu.com/manpages/jammy/man1/cp.1.html)'
authors: ["Jeff Novotny"]
---

Copying a file is one of the most common Linux tasks. Ubuntu and other Linux distributions use the `cp` command to copy one or more files, and to copy entire directories. This guide explains how to use the `cp` command to copy files on Linux. It also lists the different variations of this command and describes the different `cp` command options.

## An Introduction to cp

The `cp` command is used to copy one or more files on a Linux system to a new location. It is similar to the `mv` command, except it does not move or remove the original file, which remains in place. Like most Linux commands, `cp` is run using the command line of a system terminal.

The `cp` command allows users to copy a file to either the same directory or a different location. It is also possible to give the copy a different name than the original file. The `-r` option enables the `cp` command to operate recursively and copy a directory along with any files and subdirectories it contains. `cp` has a number of options, allowing users to run it interactively, use verbose mode, or preserve the file attributes of the original.

Users must have `sudo` privileges to copy protected files. Otherwise, `sudo` is not required.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Use the cp Command to Copy Files and Directories in Linux

The `cp` command works similarly on most Linux distributions. The command operates in four basic modes.

-   Copies a file to the same directory. The new file must have a different name.
-   Copies a file to a different directory. It is possible to rename the file or retain the old name.
-   Copy multiple files to a different target directory.
-   Recursively copy the contents of a directory, including subdirectories, to a different target directory.

There are a number of concerns to be aware of when using `cp`. For instance, `cp` does not display a warning when overwriting an existing file. This situation occurs when copying a file to a new directory already containing a file with the same name. This problem is more likely to happen when copying multiple files. To avoid this problem, users can use *interactive mode* to force Linux to request confirmation before overwriting a file.

`cp` is often used in conjunction with the `ls` command. `ls` lists the contents of the current directory. This is handy for confirming the exact name and location of the source files and directories.

Some of the most important `cp` command options include the following:

-   `-f`: Forces a copy in all circumstances.
-   `-i`: Runs `cp` in interactive mode. In this mode, Linux asks for confirmation before overwriting any existing files or directories. Without this option, Linux does not display any warnings.
-   `-p`: Preserves the file attributes of the original file in the copy. File attributes include the date stamps for file creation and last modification, user ID, group IP, and file permissions.
-   `-R`: Copies files recursively. All files and subdirectories in the specified source directory are copied to the destination.
-   `-u`: Overwrites the destination file only if the source file is newer than the destination file.
-   `-v`: Runs `cp` in *verbose* mode. This mode provides extra information on the copying process. This is useful for keeping track of progress when copying a large number of files.

The options `-H`, `-L`, and `-P` indicate how the `cp` command should process symbolic links. See the [cp man page](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/cp.html) for a full description of `cp` and symbolic links. The options for `cp` vary between Linux distributions. A list for Ubuntu 22.04 LTS is available in the [Ubuntu cp documentation](https://manpages.ubuntu.com/manpages/jammy/man1/cp.1.html).

### How to Copy a File in Linux

One common use of `cp` is to make a second copy of the source file in the same directory. Supply a different name for the copy to differentiate it from the original. A common convention is to add an extra extension such as `.bak` or `.cp` to the existing file name. For example, a standard name for a backup copy of `archive.txt` is `archive.txt.bak`.

The `cp` command operates in the context of the current working directory. However, files can be specified using either an absolute or relative path. Here is the basic `cp` command to copy a file within the same directory.

```command
cp [options] sourcefile targetfile
```

The following example demonstrates how to make a backup copy of `clock.txt` named `clock.txt.bak`.

```command
cp clock.txt clock.txt.bak
```

To confirm the copy operation, use `ls` to list the files in the directory. Both the original source file and the copy are listed.

```command
ls -l
```

{{< output >}}
-rw-rw-r-- 1 test test 2208 Jul 18 06:00 clock.txt
-rw-rw-r-- 1 test test 2208 Jul 20 08:11 clock.txt.bak
{{< /output >}}

The same command could be executed using absolute paths for both filenames.

```command
cp ~/clock.txt ~/clock.txt.bak
```

To copy a protected file that the `root` account owns, use `sudo`.

{{< note type="alert" respectIndent=false >}}
Be very careful when copying any files owned by root, especially those in the system `/` directories.
{{< /note >}}

```command
cd /etc
sudo cp bash.bashrc bash.bashrc.bak
ls -l bash.*
```

{{< output >}}
-rw-r--r-- 1 root root 2319 Jan  6  2022 bash.bashrc
-rw-r--r-- 1 root root 2319 Jul 20 08:15 bash.bashrc.bak
{{< /output >}}

To protect against an accidental overwrite, use the interactive option `-i`. The Linux system prompts for confirmation before it overwrites any existing files.

```command
cp clock.txt clock.txt.bak -i
```

{{< output >}}
cp: overwrite 'clock.txt.bak'?
{{< /output >}}

Use the `-p` option to retain the file attributes of the original file in the copy. For example, Ubuntu assigns the duplicate the same date stamp as the original.

```command
cp clock.txt clock.txt.bak -p
```

{{< output >}}
-rw-rw-r-- 1 test test 2208 Jul 18 06:00 clock.txt
-rw-rw-r-- 1 test test 2208 Jul 18 06:00 clock.txt.bak
{{< /output >}}

The `-v` command echoes each copy operation to the standard output. This can be handy for tracking operations that copy hundreds or thousands of files.

```command
cp -v clock.txt clock.txt.cp
```

{{< output >}}
'clock.txt' -> 'clock.txt.cp'
{{< /output >}}

If you accidentally make an unwanted copy of the wrong file, remove the copy using the `rm` command.

```command
sudo rm bash.bashrc.bak
```

###  How to Copy a File to a Another Directory in Linux

The `cp` command can copy a file to a completely different destination directory on the same Linux system. The copy can retain the same name as the original, but it is also possible to specify a new name for the file. The target directory must already exist before copying any files. The path of the target directory can be either relative or absolute.

All the caveats and options that apply when copying a file within a directory also apply in this case. For instance, the `cp` command silently overwrites an existing file in the destination directory unless the -`i` option is added.

Here is the pattern for copying a file to a directory on Linux.

```command
cp sourcefile target_directory_path
```

To give the copy a new name, append the name to the path of the target directory.

```command
cp sourcefile target_directory_path/targetfile
```

This example makes a new copy of `clock.txt` in the `archive` directory. In this example, the `archive` directory already exists.

```command
cp clock.txt ~/archive
```

Change to the new directory to confirm the successful copy.

```command
cd archive
ls -l
```

{{< output >}}
-rw-rw-r-- 1 test test 2208 Jul 20 09:08 clock.txt
{{< /output >}}

To give the copy a new name, append the new name to the end of the directory path. Linux gives the new file the filename `clock.txt.bak`.

```command
cp clock.txt ~/archive/clock.txt.bak
```

###  How to Copy Multiple Files in Linux

`cp` allows users to copy multiple files at a time, but only to a different directory. Here is a template for using `cp` in this context:

```command
cp sourcefile1 sourcefile2 target_directory_path
```

This example copies two files to the `archive` directory.

```command
cp clock.txt system.txt archive
```

The `cp` command treats the `*` character is a wildcard. By itself, the wildcard symbol symbolizes all files. The command `cp * targetdirectory` copies all files in the current directory to `targetdirectory`. However, it does not copy any directories or perform a recursive copy.

When used as part of a string, the `*` symbol matches any number of any characters. The filter `*.txt` matches all source files ending with the `.txt` extension. This example copies all `.exe` files to the `archive` directory.

```command
cp *.exe archive
```

Change context to the `archive` directory to confirm both `.exe` files, and only those files, were copied.

```command
cd archive
ls
```

{{< output >}}
cleanup.exe  mk_backup.exe
{{< /output >}}

###  How to Copy a Directory in Linux

In addition to copying files, Linux can also copy directories. The `-R` option is used to copy a directory and all of its subdirectories and files recursively. The Linux command to copy a directory follows this structure.

```command
cp -R source_directory target_directory
```

To copy the directory `archive`, along with all of its files and subdirectories, to `archive_bkup` use this command.

```command
cp -R archive archive_bkup
```

Change context to the `archive_bkup/archive` directory and confirm all the files and subdirectories of `archive` have been copied.

```command
cd archive_bkup/archive
ls -l
```

{{< output >}}
-rw-rw-r-- 1 test test    0 Jul 20 11:10 cleanup.exe
-rw-rw-r-- 1 test test    0 Jul 20 11:10 mk_backup.exe
drwxrwxr-x 2 test test 4096 Jul 20 11:10 records
{{< /output >}}

## Conclusion

The `cp` command is used for copying files on Linux systems. It operates similarly to the `mv` directive, but leaves the original file unaltered and in place. To copy a file to the same directory on Linux, use `cp` with the name of the source file and the name of the copy. The `cp` command can also be used to copy the file to a different directory, to copy multiple files, or to recursively copy entire directories. For more in-depth documentation on how to copy files using the Linux `cp` command, see the [cp man page](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/cp.html).