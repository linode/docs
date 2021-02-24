---
slug: modify-file-permissions-with-chmod
author:
  name: Linode
  email: docs@linode.com
description: 'This guide will show you how to modify file and directory permissions using CHMOD for owner, group, and others in Unix systems.'
keywords: ["chmod", "commands", "reference", "file permissions"]
tags: ["security","linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/linux-tools/common-commands/chmod/','/tools-reference/modify-file-permissions-with-chmod/','/tools-reference/tools/modify-file-permissions-with-chmod/']
modified: 2018-01-24
modified_by:
  name: Sam Foo
published: 2010-07-01
title: Modify File Permissions with chmod
external_resources:
 - '[Manage File Permission with Users and Groups](/docs/tools-reference/linux-users-and-groups)'
 - '[Administration Basics](/docs/using-linux/administration-basics)'
---

![Modify File Permissions with chmod](modify_file_permissions_with_chmod_smg.png "Modify File Permissions with chmod")

## Modify File Permissions with CHMOD
CHMOD allows users to change read and write permissions in Unix systems. In this guide, we will show you how to modify file and directory permissions with CHMOD.

Unix-like systems, including the Linux systems that run on the Linode platform, have an incredibly robust access control system that allows systems administrators to effectively permit multiple users access to a single system without giving every user access to every file on the file system. The `chmod` command is the best and easiest way to modify these file permissions.

This guide provides a brief overview of file permissions and the operation of the `chmod` command in addition to a number of practical examples and applications of `chmod`. If you find this guide helpful, please consider our [basic administration practices guide](/docs/tools-reference/linux-system-administration-basics/) and the [Linux users and groups guide](/docs/tools-reference/linux-users-and-groups/) next.

## How to Use CHMOD

In this guide, `chmod` refers to recent versions of `chmod` such as those provided by the GNU project. By default, `chmod` is included with all images provided by Linode, and as part of the common "base" selection of packages provided in nearly all distributions of Linux-based operating systems.

### What Are CHMOD Permissions?

CHMOD permissions are a set of commands that can be used to modify file and directory permissions for any kind of Unix user.  These permissions are applied to three types of users in Unix: Owner, Group, and Other Users/Public. CHMOD Permissions define who out of these three types of users can read, write, or execute files/directories in a Unix system.

### Linux File Permission Basics With CHMOD

All file system objects on Unix-like systems have three main types of permissions: read, write, and execute access. Permissions are bestowed upon three possible classes: the user, the usergroup, and all system users.

To view the file permissions of a set of files, use:

    ls -lha

In the first column of the output, there are 10 characters that represent the permission bits. To understand why they are called permission bits, see the section on [octal notation](#octal-notation) below.

    drwxr-xr-x 2 user group       4.0K 2009-08-13 10:16 docs
    -rw-r--r-- 1 user group       8.1K 2009-07-09 16:23 roster.py
    lrwxrwxrwx 2 user group       4.0K 2009-08-13 10:16 team.docs

A way to understand the meaning of this column is to divide the bits into groups.

File type           | User  | Group | Global
--------------------|-------|-------|---------
 `d`  Directory     | `rwx` | `r-x` | `r-x`
 `-`  Regular file  | `rw-` | `r--` | `r--`
 `l`  Symbolic Link | `rwx` | `rwx` | `rwx`

The first character represents the type of file. The remaining nine bits in groups of three represent the permissions for the user, group, and global respectively. Each stands for:

* `r`: **R**ead
* `w`: **W**rite
* `x`: e**X**ecute

Note that access to files targeted by symbolic links is controlled by the permissions of the targeted file, not the permissions of the link object. There are [additional file permissions](/docs/tools-reference/linux-users-and-groups/#additional-file-permissions) that control other aspects of access to files.

### How Do I Change File Permissions In CHMOD?

To change the file permissions using CHMOD, use chmod `<permission> <directory or filename>`. The owner can change file permissions for any user, group or others by adding - to remove or + to add certain permissions. These permissions are categorized into read, write, or executable. 

In the next few sections, we are going to dive deep into CHMOD syntax.

### Using chmod Command Syntax And Options For Files

The format of a `chmod` command is:

    chmod [who][+,-,=][permissions] filename

Consider the following `chmod` command:

    chmod g+w ~/group-project.txt

This grants all members of the usergroup that owns the file `~/group-project.txt` write permissions. Other possible options to change permissions of targeted users are:

Who (Letter) | Meaning
-------------|---------
       u     |  user
       g     |  group
       o     |  others
       a     |  all

The `+` operator grants permissions whereas the `-` operator takes away permissions. Copying permissions is also possible:

    chmod g=u ~/group-project.txt

The parameter `g=u` means grant group permissions to be same as the user's.

Multiple permissions can be specified by separating them with a comma, as in the following example:

    chmod g+w,o-rw,a+x ~/group-project-files/

This adds write permissions to the usergroup members, and removes read and write permissions from the "other" users of the system. Finally the `a+x` adds the execute permissions to all categories. This value may also be specified as `+x`. If no category is specified, the permission is added or subtracted to all permission categories.

In this notation the owner of the file is referred to as the `user` (e.g. `u+x`).

    chmod -R +w,g=rw,o-rw, ~/group-project-files/

The `-R` option applies the modification to the permissions recursively to the directory specified and to all of its contents.

### What Is rw-rw-r--?

`rw-rw-r--` enables the following permissions: read and write for the owner; read and write for the group; read for others. In terms of numerical code, `rw-rw-r--` translates to `664`. You will learn how to use that later in this guide.

### How to Use CHMOD Octal Notation For File Permissions

Another method for setting permissions is through octal notation.

Here is example of a file permission that is equivalent to `chmod u=rwx,g=rx,o=`.

    chmod 750 ~/group-project.txt

The permissions for this file are `- rwx r-x ---`.

Disregarding the first bit, each bit that is occupied with a `-` can be replaced with a `0` while `r`, `w`, or `x` is represented by a `1`. The resulting conversion is:

    111 101 000

This is called octal notation because the binary numbers are converted to base-8 by using the digits 0 to 7:

Binary | Octal | Permission
-------|-------|-----------
  000  |   0   |   ---
  001  |   1   |   --x
  010  |   2   |   -w-
  011  |   3   |   -wx
  100  |   4   |   r--
  101  |   5   |   r-x
  110  |   6   |   rw-
  111  |   7   |   rwx

Each digit is independent of the other two. Therefore, `750` means the current user can read, write, and execute, the group cannot write, and others cannot read, write, or execute.

`744`, which is a typical default permission, allows read, write, and execute permissions for the owner, and read permissions for the group and "world" users.

Either notation is equivalent, and you may choose to use whichever form more clearly expresses your permissions needs.

### What Does CHMOD 777 do?

chmod 777 is used to grant permissions to everyone to read, write, and execute a file. For example, the group-project.txt from the previous section was set at chmod 750, we can enable everyone in Unix system to be able to read, write and execute this file by running the following command:

        chmod 777 group-project.txt


### What Does CHMOD 600 Mean?

A CHMOD 600 means that only the owner of the file has full read and write access to it. Once a file permission is set at CHMOD 600, no one else can access the file.

`chmod 600` translates to the following:

        chmod 600 a+rawx, u-x, g-rwx, o-rwx

## Making a File Executable

The following examples changes the file permissions so that any user can execute the file "~/group-project.py":

    chmod +x ~/group-project.py

## Restore Default File Permissions

The default permissions for files on a Unix system are often `600` or `644`. Permissions of `600` mean that the owner has full read and write access to the file, while no other user can access the file. Permissions of `644` mean that the owner of the file has read and write access, while the group members and other users on the system only have read access.

Issue one of the following examples to achieve these "default" permissions:

    chmod 600 ~/roster.txt
    chmod 644 ~/gigs.txt

For executable files, the equivalent settings would be `700` and `755` which correspond to `600` and `644` except with execution permission.

Use one of the following examples to achieve these executable "default" permissions:

    chmod 700 ~/generate-notes.py
    chmod 755 ~/regenerate-notes.py

### How Do I Remove CHMOD Read Write Permissions?

In order to remove a chmod read write permission given to a file, you can use the following syntax:

        chmod o-r <file_name>

For our file roster.txt, we can remove read write permissions using chmod for group by running the following command:

        chmod  g-rx roster.txt

To remove chmod read write permissions from the group while adding read write permission to public/others, we can use the following command:

        chmod g-rx, o+rx roster.txt

But, if you wish to remove all permissions for group and others, you can do so using the go= instead:

        chmod go=roster.txt

## Restrict File Access: Remove all Group and World Permissions

There are a number of cases where administrators and users should restrict access to files, particularly files that contain passwords and other sensitive information. The configuration files for msmtp and Fetchmail (`~/.msmtprc` and `~/.fetchmailrc`) are two common examples.

You can remove all access to these files with commands in one of the following forms:

    chmod 600 .msmtprc
    chmod g-rwx,o-rwx .fetchmail

### Understanding Linux Directory Permissions

We looked at file permissions in the earlier section, let’s now see how the same permissions apply to directories too.

To see all directories with a read permission, run the ls command in your current working directory.  In our case, the example working directory we used was .../Linode/ and there were one folder(86201) and a file(executable_file) inside this directory. Our output from ls in this case is

        86201  executable_file

Let’s check directory permissions for 86201. We can check directory permissions by running the following command:

        ls -dl 86201

The output looks something like this:

        drwxr-xr-x 2 linode linode 4096 Jan  3 17:38 86201

To see all permissions of 86201, we can use -al in our previous command instead:

        ls -al 86201

        total 8

        drwxr-xr-x 2 linode linode 4096 Jan  3 17:38 .

        drwxr-xr-x 3 linode linode 4096 Jan  3 17:38 ..

If you specify no directories, you’ll get permissions for all files in the current directory if you run:

        ls -al

Which returns the following output

        total 16

        drwxr-xr-x 3 networkx networkx 4096 Jan  3 17:38 .

        drwxr-xr-x 7 networkx networkx 4096 Jan  3 17:38 ..

        drwxr-xr-x 2 networkx networkx 4096 Jan  3 17:38 86201

        -rw-r--r-- 1 networkx networkx   18 Jan  2 13:43 executable_file


## How To Change Directory Permissions In Linux

Similar to how we change file permissions in Linux, we can use similar commands in the case of directories too.

You can add permissions to a directory (e.g. linode) by the following command:

        chmod +rwx linode

To remove permissions added to linode run the following command:

        chmod -rwx linode

To add executable permissions use the following command

        chmod +x linode

And, running the following command removes executable and write permissions on your directory.

{{< community >}}
* [How to set permissions for the webserver directory](https://www.linode.com/community/questions/8808/setting-ownership-and-permissions-for-webserver-directories)
* [Permission issues with Ubuntu](https://www.linode.com/community/questions/6076/permission-issues-with-ubuntu-amp-wordpress-chown-fails)
* [Issues with /var/www permissions](https://www.linode.com/community/questions/7302/varwww-permissions)
{{</ community >}}
