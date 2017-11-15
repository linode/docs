---
author:
  name: Linode
  email: docs@linode.com
description: 'Use the chmod command to modify file permissions on your Linode.'
keywords: ["TAGS=chmod", "commands", "reference", "file permissions"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/common-commands/chmod/']
modified: 2011-07-07
modified_by:
  name: Linode
published: 2010-07-01
title: Modify File Permissions with chmod
external_resources:
 - '[Manage File Permission with Users and Groups](/docs/tools-reference/linux-users-and-groups)'
 - '[Administration Basics](/docs/using-linux/administration-basics)'
---

Unix-like systems, including the Linux systems that run on the Linode platform, have an incredibly robust access control system that allows systems administrators to effectively permit multiple users access to a single system without giving every user access to every file on the file system. The `chmod` command is the best and easiest way to modify these file permissions.

![Title graphic](/docs/assets/modify_file_permissions_with_chmod_smg.png)

This document provides a brief overview of file permissions and the operation of the `chmod` command in addition to a number of practical examples and applications of `chmod`. If you find this guide helpful, please consider our [basic administration practices guide](/docs/using-linux/administration-basics) and the [Linux users and groups guide](/docs/tools-reference/linux-users-and-groups/).

## Using Chmod

In this guide, `chmod` refers to recent versions of `chmod` such as those provided by the GNU project. By default, `chmod` is included with all images provided by Linode, and as part of the common "base" selection of packages provided in nearly all distributions of Linux-based operating systems.

<div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><iframe src="https://fast.wistia.net/embed/iframe/h5sfokgpgm?videoFoam=true" title="Linode - How to use the chmod command" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="100%" height="100%"></iframe></div></div>
<script src="https://fast.wistia.net/assets/external/E-v1.js" async></script>

### File Permission Basics

All file system objects on Unix-like systems have three main types of permissions: read, write, and execute access. Furthermore, permissions are bestowed upon three possible classes: the user that owns the file system object, the user group that owns the file system object, and all system users. To view the file permissions of a set of files, use the `ls -lha` command. The output will resemble the following:

    drwxr-xr-x 2 username username       4.0K 2009-08-13 10:16 docs
    -rw-r--r-- 1 username username       8.1K 2009-07-09 16:23 roster.py
    lrwxrwxrwx 2 username username       4.0K 2009-08-13 10:16 team.docs

The first block of data contains information regarding the file permissions and settings, and we'll focus on that in this section. The first column specifies the type of file system object. `d` indicates that the object is a directory. `-` indicates that the object is a normal file. `l` indicates that the object is a symbolic link.

The remaining characters represent the core permissions. In groupings of three, these characters represent read, write, and execute permissions. The first grouping represents the owners permissions, the second grouping represents the usergroup that owns the file, and the final grouping represents the permissions of all users on the system.

Any object on the file system may have any combination of permissions. Note, access to the files targeted by symbolic links is controlled by the permissions of the targeted file, not the permissions of the link object. There are [additional file permissions](/docs/tools-reference/linux-users-and-groups#additional-file-permissions) that control other aspects of access to files.

### The Chmod Command

Consider the following invocation of `chmod`:

    chmod g+w ~/group-project.txt

This grants all members of the usergroup that owns the file `~/group-project.txt` write permissions. To remove this permission later, switch the `+` sign to a `-`, as in the following example.

    chmod g-w ~/group-project.txt

You can specify multiple permissions by separating them with a comma, as in the following example:

    chmod g+w,o-rw,a+x ~/group-project-files/

This adds write permissions to the usergroup members, and removes read and write permissions from the "other" users of the system. Finally the `a+x` adds the execute permissions to all categories. This value may also be specified as `+x`. If no category is specified, the permission is added or subtracted to all permission categories. In this notation the owner of the file is referred to as the `user` (e.g. `u+x`).

    chmod -R +w,g=rw,o-rw, ~/group-project-files/

The `-R` option applies the modification to the permissions recursively to the directory specified and all of its contents. You may also specify file permissions using the `=` sign rather than the `+` or `-` operators to signify only the specified permissions if you need to specify a set of permissions without relation to the current state of the file's permission.

The notation used in this document thus far can be confusing for particularly complex file permission requirements. `chmod` provides an alternate "octal" notation that you may find more sensible:

    0 ---      indicates no permissions
    1 --x      indicates execute permissions
    2 -w-      indicates write permissions
    3 -wx      indicates write and execute permissions
    4 r--      indicates read permissions
    5 r-x      indicates read and execute permissions
    6 rw-      indicates read and write permissions
    7 rwx      indicates read, write, and execute permissions

Each digit is independent of the other two. Therefore, 777 creates read, write, and execute privileges for all users. 744, which is a typical default permission, allows read, write, and execute permissions for the owner, and read permissions for the group and world users. To chmod the "roster.py" file so that the owner can read, write, and execute the file, the group can read and execute the file, and the world can execute the file, issue the following command:

    chmod 751 ~/roster.py

Either notation is equivalent, and you may chose to use whichever form is more able to clearly express your desires for the permissions.

## Making a File Executable

Issue the following command to change the file permissions so that any user can execute the file "~/group-project.py":

    chmod +x ~/group-project.py

## Restore Default File Permissions

In many cases the default permissions for files on a Unix system are often `600` or `644`. Permissions of `600` mean that the owner has full read and write access to the file, while no other user can access the file. Permissions of `644` mean that the owner of the file has read and write access, while the group members and other users on the system only have read access. Issue one of the following commands to achieve these "default" permissions:

    chmod 600 ~/roster.txt
    chmod 644 ~/gigs.txt

For executable files, the equivalent settings would be `700` and `755` which correspond to `600` and `644` except with execution permission. Issue one of the following commands to achieve these executable "default" permissions:

    chmod 700 ~/generate-notes.py
    chmod 755 ~/regenerate-notes.py

## Removing all Group and World Permissions

There are a number of cases where administrators and users would be wise to restrict access to files, particularly files that contain passwords and other sensitive information. The configuration files for msmtp and fetchmail (`~/.msmtprc` and `~/.fetchmailrc`) are two common examples. You can remove all access to these files with commands in one of the following forms:

    chmod 600 .msmtprc
    chmod g-rwx,o-rwx .fetchmail
