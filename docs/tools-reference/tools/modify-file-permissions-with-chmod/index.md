---
author:
  name: Linode
  email: docs@linode.com
description: 'Use the chmod command to modify file permissions on your Linode.'
keywords: ["TAGS=chmod", "commands", "reference", "file permissions"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/common-commands/chmod/','tools-reference/modify-file-permissions-with-chmod/']
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

## chmod Lets You Change Read and Write Permissions in Linux

Unix-like systems, including the Linux systems that run on the Linode platform, have an incredibly robust access control system that allows systems administrators to effectively permit multiple users access to a single system without giving every user access to every file on the file system. The `chmod` command is the best and easiest way to modify these file permissions.

This guide provides a brief overview of file permissions and the operation of the `chmod` command in addition to a number of practical examples and applications of `chmod`. If you find this guide helpful, please consider our [basic administration practices guide](/docs/tools-reference/linux-system-administration-basics/) and the [Linux users and groups guide](/docs/tools-reference/linux-users-and-groups/) next.

## How to Use chmod

In this guide, `chmod` refers to recent versions of `chmod` such as those provided by the GNU project. By default, `chmod` is included with all images provided by Linode, and as part of the common "base" selection of packages provided in nearly all distributions of Linux-based operating systems.

### Linux File Permission Basics

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

### chmod Command Syntax and Options

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

### How to Use Octal Notation for File Permissions

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

## Restrict File Access: Remove all Group and World Permissions

There are a number of cases where administrators and users should restrict access to files, particularly files that contain passwords and other sensitive information. The configuration files for msmtp and Fetchmail (`~/.msmtprc` and `~/.fetchmailrc`) are two common examples.

You can remove all access to these files with commands in one of the following forms:

    chmod 600 .msmtprc
    chmod g-rwx,o-rwx .fetchmail

{{< community >}}
* [How to set permissions for the webserver directory](https://www.linode.com/community/questions/8808/setting-ownership-and-permissions-for-webserver-directories)
* [Permission issues with Ubuntu](https://www.linode.com/community/questions/6076/permission-issues-with-ubuntu-amp-wordpress-chown-fails)
* [Issues with /var/www permissions](https://www.linode.com/community/questions/7302/varwww-permissions)
{{</ community >}}
