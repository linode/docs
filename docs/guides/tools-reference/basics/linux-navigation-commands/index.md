---
slug: linux-navigation-commands
description: 'Learn how to navigate the Linux terminal and create and remove directories and files.'
keywords: ['ls command','change directory in linux','cp command in linux']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-08
modified_by:
  name: Linode
title: "Navigate the Linux Terminal and File System"
authors: ["Jeff Novotny"]
---

For users more familiar with a graphical user interface (GUI), the Linux command line interface can initially appear daunting. It is not always apparent how to perform common file and directory operations. Fortunately, Linux commands are very powerful and flexible, and with some practice, you can accomplish any file management operation you want. This guide explains how to navigate the Linux file structure and how to perform common management operations on files and directories.

## An Introduction to the Linux File System

Linux has a directory-based structure. Files are stored within a particular directory, which is also referred to as a folder. Each directory can also contain other directories. These directories can in turn contain files and directories.

Conceptually, this can be thought of in terms of a tree structure. At the trunk of the tree is the `/` directory, also known as the *root directory*. All other directories branch off of the root directory. The *root file system* contains all the files and directories which are on the same disk partition as the root directory. All the files required to boot the system must be contained inside the root file system. Other file systems can be mounted as subdirectories within the root file system.

Every Linux prompt is actually a process that is associated with a location that maps to a directory within the file system. The directory a user is currently working in is known as the *current working directory* or *present working directory* (PWD). The name of this directory can be retrieved using the `pwd` command. It is possible to navigate from this point through the file system using either absolute or relative path names.

The root directory of most Linux file systems includes several standard, well-defined directories. The most important of these directories include the following:

- **/bin:** contains user-executable programs and files.
- **/boot:** contains the bootloader and the files required to boot the computer.
- **/etc:** stores configuration files for the system.
- **/home:** contains the home directories for the various user accounts. Each user has a subdirectory located at `/home/userid`. While a user is logged in, their home directory is aliased as the `~` directory.
- **/lib:** shared system library files are located in this directory.
- **/root:** this is the home directory for the `root` user. This is not the same as the root, or `/` directory.
- **/usr:** contains shared binary, library, and documentation files for all users.
- **/var:** data files are typically stored here.

## How to List Files in Linux

The `ls` command provides a way to list files within a directory. However, many options allow for output filtering or to change what information to display.

### The ls Command

1. To display all files and directories except hidden files, use the `ls` command. Specify the relative or absolute path of a directory to list files in that directory. If no directory is specified, the contents of the current directory are displayed.

        ls

    {{< output >}}
cities.txt  countries.txt  payroll  states.txt  states2.txt
    {{< /output >}}

    To list the contents inside the `wpbackup` directory, use `ls` followed by the directory name.

        ls wpbackup

    {{< output >}}
public_html
    {{< /output >}}

1. To list only the subdirectories, use the `-d */` option.

        ls -d */

    {{< output >}}
accounts/  backup/  mysqlbackup/  phpcomposer/  wpbackup/
    {{< /output >}}

1. The default output of `ls` command is very terse and only displays the file or directory names. To list the entries in more detail, use the `-l` option.

        ls -l

    {{< output >}}
-rw-rw-r-- 1 userid userid   29 Aug 31 14:51 cities.txt
-rw-rw-r-- 1 userid userid   42 Aug 31 14:51 countries.txt
drwxrwxr-x 2 userid userid 4096 Sep  2 16:51 payroll
-rw-rw-r-- 1 userid userid   51 Aug 31 14:51 states.txt
-rw-rw-r-- 1 userid userid   51 Aug 31 14:51 states2.txt
    {{< /output >}}

1. By default, files starting with `.` are not displayed. Files which have names beginning with `.` are known as *hidden files*. The `ls` command normally hides the links to the current working and parent directories. To include all entries starting with a `.`, use the `-a` option. To include the hidden files, but not the `.` and `..` directories, use the `-A` option, meaning `almost-all`.

    {{< note respectIndent=false >}}
The `.` directory refers to the current working directory. The `..` entry is a hard link to the parent directory. This is the directory containing the current directory.
    {{< /note >}}

        ls -la

    {{< output >}}
drwxrwxr-x  3 userid userid 4096 Sep  3 10:56 .
drwxr-xr-x 10 userid userid 4096 Sep  1 08:48 ..
-rw-rw-r--  1 userid userid   51 Sep  3 10:56 .states2.txt
-rw-rw-r--  1 userid userid   29 Aug 31 14:51 cities.txt
-rw-rw-r--  1 userid userid   42 Aug 31 14:51 countries.txt
drwxrwxr-x  2 userid userid 4096 Sep  2 16:51 payroll
-rw-rw-r--  1 userid userid   51 Aug 31 14:51 states.txt
-rw-rw-r--  1 userid userid   51 Aug 31 14:51 states2.txt
    {{< /output >}}

        ls -lA

    {{< output >}}
-rw-rw-r--  1 userid userid   51 Sep  3 10:56 .states2.txt
-rw-rw-r--  1 userid userid   29 Aug 31 14:51 cities.txt
-rw-rw-r--  1 userid userid   42 Aug 31 14:51 countries.txt
drwxrwxr-x  2 userid userid 4096 Sep  2 16:51 payroll
-rw-rw-r--  1 userid userid   51 Aug 31 14:51 states.txt
-rw-rw-r--  1 userid userid   51 Aug 31 14:51 states2.txt
    {{< /output >}}

1. To search for files in reverse order, use the `-r` option. Options can be combined. The following command lists the items in reverse order and with full detail, by combining the `-l` and `-r` options. Multiple options can be combined into one string, preceded by the `-` symbol.

        ls -lr

    {{< output >}}
-rw-rw-r-- 1 userid userid   51 Aug 31 14:51 states2.txt
-rw-rw-r-- 1 userid userid   51 Aug 31 14:51 states.txt
drwxrwxr-x 2 userid userid 4096 Sep  2 16:51 payroll
-rw-rw-r-- 1 userid userid   42 Aug 31 14:51 countries.txt
-rw-rw-r-- 1 userid userid   29 Aug 31 14:51 cities.txt
    {{< /output >}}

1. Files can be listed by size using the `-S` option.

        ls -lS

    {{< output >}}
drwxrwxr-x 2 userid userid 4096 Sep  2 16:51 payroll
-rw-rw-r-- 1 userid userid   51 Aug 31 14:51 states.txt
-rw-rw-r-- 1 userid userid   51 Aug 31 14:51 states2.txt
-rw-rw-r-- 1 userid userid   42 Aug 31 14:51 countries.txt
-rw-rw-r-- 1 userid userid   29 Aug 31 14:51 cities.txt
    {{< /output >}}

1. The final sorting option of interest is the `-t` option. This option sorts files by age.

        ls -lt

    {{< output >}}
drwxrwxr-x 3 userid userid 4096 Sep  2 16:51 accounts
drwxrwxr-x 2 userid userid 4096 Sep  1 08:47 backup
-rw-rw-r-- 1 userid userid   42 Aug 31 14:50 countries.txt
-rw-rw-r-- 1 userid userid   51 Aug 31 14:43 states.txt
drwxrwxr-x 3 userid userid 4096 Aug 24 17:08 phpcomposer
drwxrwxr-x 2 userid userid 4096 Jul 21 13:24 mysqlbackup
drwxrwxr-x 3 userid userid 4096 Jul 21 12:06 wpbackup
-rw-r--r-- 1 userid userid  196 Jul 20 14:42 testconnection2.php
    {{< /output >}}

1. It is possible to pipe the output of the `ls -l` command to the `sort` command to sort on any column. The `sort` option accepts a column number and sorts the list based on the contents of this column. The output of the `ls` command must be in list format for this technique to work. The following example orders the list output based on the eighth column, the time of day when the file or directory was created.

        ls -l | sort -k8

    {{< output >}}
drwxrwxr-x 2 userid userid 4096 Sep  1 08:47 backup
drwxrwxr-x 3 userid userid 4096 Sep  3 10:56 accounts
drwxrwxr-x 3 userid userid 4096 Jul 21 12:06 wpbackup
drwxrwxr-x 2 userid userid 4096 Jul 21 13:24 mysqlbackup
-rw-r--r-- 1 userid userid  196 Jul 20 14:42 testconnection2.php
-rw-rw-r-- 1 userid userid   51 Aug 31 14:43 states.txt
-rw-rw-r-- 1 userid userid   42 Aug 31 14:50 countries.txt
drwxrwxr-x 3 userid userid 4096 Aug 24 17:08 phpcomposer
    {{< /output >}}

1. Files inside subdirectories can be listed recursively using the `-R` option. This displays all the files and directories in the current directories and inside all child subdirectories.

        ls -lR

{{< note respectIndent=false >}}
The `ls` command has many more options. Consult the [Linux manual page for ls](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/ls.html), also known as the command *man* page, for complete information.
{{< /note >}}

## How to Change Directories in Linux

It is possible to navigate the Linux file system in a relative or absolute manner. An *absolute path* indicates the location of a directory from the root directory, and always begins with the `/` symbol. A *relative path* is defined in relation to the current working directory.

The `cd` command is used to change directories. This command is very straightforward to use, but it does have a few useful shortcuts. More information about the `cd` command can be found on the [Linux man page](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/cd.html).

### The cd Command

1. While relatively navigating the Linux file system, it is often useful to know the path to the current directory. To display the full pathname of the present working directory, use the `pwd` command.

        pwd

    {{< output >}}
/home/userid
    {{< /output >}}

1. To navigate to a subdirectory relative to your current working directory, use the `cd` command followed by the target directory.

    {{< note respectIndent=false >}}
Most Linux distributions offer an auto-complete function. While typing the name of a file or directory, press the `tab` key. If the name is unambiguous, the system automatically completes the rest of the name. If there are multiple potential options, the system either lists all possible choices or auto-completes the characters common to all alternatives.
    {{< /note >}}

        cd accounts/payroll

1. To move up one directory in the hierarchy to the parent directory, type `cd` followed by the `..` symbol. The `..` indicator can be repeated multiple times to move up multiple levels in the tree. For example `cd ../..` moves up to the parent directory of the parent directory.

        cd ..

1. The command `cd .` takes no action because the `.` symbol is an alias for the current directory. This is sometimes required in scripts in case a subdirectory cannot be created.

        cd .

1. To return to your home directory, enter `cd` without any arguments. The `cd ~` command accomplishes the same thing.

        cd

1. To quickly change to any directory anywhere in the system, use `cd` with the full absolute pathname of the target directory. To change to a directory, a user must have the right permissions to access it.

        cd /usr/bin

1. To change to the home directory of another user, follow `cd` with `~username`, substituting the name of the actual user.

        cd ~username

1. If `cd` is used with the `-` symbol, it switches to the previous directory. This is useful for toggling between two directories that are not on the same path.

        cd /usr/bin
        cd ~/accounts
        cd -

    {{< output >}}
/usr/bin
    {{< /output >}}

## How to Copy and Move Files in Linux

Files can be duplicated using the `cp` command. To move files, use the `mv` command. See the [Linux man page for the mv command](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/mv.html) or [the cp command](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/cp.html) for more information.

### The cp Command

1. Use the `cp` command to copy files. The format of the command is `cp sourcefile_1 sourcefile_n ... destination_dir`. The final argument is always the destination directory. This can be either an absolute or relative path. The following command copies `states2.text` to the `payroll` subdirectory:

        cp states2.txt payroll

    The command below demonstrates how to copy two files into a directory specified with an absolute path:

        cp backup_file.sql backup_files.sql ~/accounts/payroll/

1. It is possible to save the copy in the same directory. Specify a name for the duplicate file in place of the destination directory. The following example makes a copy of `countries.txt` named `countries_bkup.txt` in the same directory.

        cp countries.txt countries_bkup.txt

1. The `-i` option prompts the user before overwriting an existing file, whereas the `-f` option forces an overwrite without any prompt.

        cp -i states2.txt payroll
        cp -f states2.txt payroll

1. When copying a file, it is possible to give the copy a new name at the same time.

        cp states2.txt payroll/states2_bkup.txt

1. The verbose command, `-v` prints confirmation of the file actions being performed.

        cp -v countries.txt countries_bkup.txt

    {{< output >}}
'countries.txt' -> 'countries_bkup.txt'
    {{< /output >}}

1. A directory and all of its contents can be copied recursively using the `-r` option. The following command re-creates the directory `accounts` as a subdirectory inside `backup`. All of the files and subdirectories inside `accounts` are also copied over to the new subdirectory.

        cp -r accounts/ backup

### The mv Command

1. To move files or directories instead of copying them, use the `mv` command. The command takes the format `mv sourcefile_1 ... sourcefile_n destination_dir`. The following command moves the `cities.txt` file to the `payroll` directory. Multiple files can be moved using the same command.

        mv cities.txt payroll

1. By default, this command overwrites any existing file or directory with the same name. For added safety, add the `-i` option to the `mv` command. This option prompts for approval before overwriting any files.

        mv -i cities.txt payroll

    {{< output >}}
mv: overwrite 'payroll/cities.txt'?
    {{< /output >}}

1. Linux does not have a dedicated command to rename a file. Instead, use the `mv` command to rename a file. Specify the old filename as the source and the new filename as the destination. The following command renames `cities.txt` to `newcities.txt`.

        mv cities.txt newcities.txt

## How to Create Files and Directories in Linux

There are several methods to create files on a Linux system, but directories can only be created using the `mkdir` command.

### The touch Command

An easy way to create a file is with the `touch` command. This method creates a new empty file in the current directory.

1. To create a new file with no contents, use the `touch` command followed by the name of the file.

        touch newfile1.txt

1. Alternatively, the redirect, or `>` symbol can accomplish the same task.

        > newfile1.txt

1. The `touch` command can create multiple files at the same time.

        touch newfile2.txt newfile3.txt

{{< note respectIndent=false >}}
The `touch` command can also be used to modify timestamps on existing files. The options list for this command is fairly extensive. See the [Linux man page](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/touch.html) for more information.
{{< /note >}}

### The echo and cat Commands

There are two ways to create a file and immediately populate it with data. Both methods allow for the insertion of data directly from the command line. It is not necessary to open the file with a text editor or save the file.

1. The easiest way to create a file with a short amount of text is by using the `echo` command. Specify the required text, then use the `>` symbol to redirect the output to the new file. The format of the command is: `echo "line of text" > newfile_name`.

        echo "Placeholder for final text" > tmp_file.txt

1. The `cat` command can be adapted to create longer and more complex files. Use the `cat` command with the `>` symbol and the name of the new file, then hit `ENTER`. Then add the lines of text. When you are done, enter the `CTRL-D` command to terminate the command.

        cat > scores.txt
        12-0
        13-1
        15-9
        CTRL-D
        cat scores.txt

    {{< output >}}
12-0
13-1
15-9
    {{< /output >}}

### The mkdir Command

The only way to create a new directory is with the `mkdir` command, but a few different options are available. Full information is available on the [Linux man page on mkdir](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/mkdir.html).

1. To create a new subdirectory inside the current directory, use the `mkdir` command along with the name of the new directory. If the directory already exists, `mkdir` displays the `cannot create directory` error.

        mkdir tmpdir

1. To confirm the directory has been created, use the `ls -l` command.

        ls -l

    {{< output >}}
drwxrwxr-x 2 userid userid 4096 Sep  6 11:50 tmpdir
    {{< /output >}}

1. Multiple directories can be created using a single `mkdir` command.

        mkdir tmpdir tmpdir2

1. To create a directory in a different location, specify the absolute path of the new directory. You must have the correct permissions to be able to create the directory. Otherwise, the system displays the error `mkdir: cannot create directory ‘dir_name’: Permission denied`.

        mkdir /usr/bin/tmpdir

1. To set the directory permissions at the same time, use the `-m` option along with the file permission.

        mkdir -m 777 tmpdir3

1. By default, the parent directory of the new directory must already exist. However, the `-p` option is used to automatically create any missing parent directories along the path. The following command creates `dir1` if it does not already exist.

        mkdir -p tmpdir/dir1/dir2

1. The `mkdir` command allows users to create an entire directory tree, using the `{}` and `,` symbols. Separate the individual subdirectories using commas, and start and end the list of directories using the `{` and `}` characters. For example, the command below creates five directories inside the `sports` directory. This technique can be used in a nested fashion to create another layer of subdirectories inside each subdirectory.

        mkdir -p sports/{football,hockey,soccer,baseball,basketball}
        cd sports
        ls

    {{< output >}}
baseball  basketball  football  hockey  soccer
    {{< /output >}}

## How to Delete Files and Folders in Linux

Remove files using the `rm` command, and remove directories using either `rm` or `rmdir`. Consult the Linux man pages to learn more about the [rm](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/rm.html) or [rmdir](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/rmdir.html) commands.

{{< note type="alert" respectIndent=false >}}
Recovering files that have been deleted with the `rm` command is somewhere between difficult and impossible. Take great care when using the `rm` or `rmdir` commands.
{{< /note >}}

### The rm and rmdir Commands

1. To delete a single file, use `rm` along with the name of the file.

        rm scores2.txt

1. If the file is write-protected, you must confirm the request before the file is removed.

        rm scores.txt

    {{< output >}}
rm: remove write-protected regular empty file 'scores.txt'?
y
    {{< /output >}}

1. The `rm` command can remove several files at once.

        rm scores.txt scores2.txt

1. To require a confirmation for each deletion, add the `-i` option to the command. The `-f` command forces the deletion of each file, even if some of the files are write-protected.

        rm -i scores.txt
        rm -f scores.txt scores2.txt

1. To remove several files based on the filenames matching a particular string of text, use the wildcard symbol `*`. The command `rm *.txt` removes all text files.

    {{< note type="alert" respectIndent=false >}}
This command can be dangerous because it can accidentally delete files that were not intended for deletion. To use this command more securely, specify the `-i` option. This option tells the system to prompt before each deletion.
    {{< /note >}}

        rm *.txt

1. To remove an empty directory, use the `rmdir` or `rm -d` commands. The following two commands are functionally equivalent. The `rmdir` command is safer because it can only delete empty directories and cannot delete files.

        rmdir soccer
        rm -d hockey

1. The `-r` option is used to remove non-empty directories along with all their files and subdirectories.

    {{< note type="alert" respectIndent=false >}}
This command can also be very destructive, especially when used with the force `-f` option or with wildcards. To be safe, use the `-i` option when running this command. This option prompts for confirmation.
    {{< /note >}}

        rm -r sports
