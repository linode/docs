---
slug: modify-file-permissions-with-chmod
title: Modify File Permissions with chmod
description: 'This guide will show you how to modify file and directory permissions using chmod for owner, group, and others in Unix systems.'
authors: ["Linode"]
contributors: ["Linode","Adam Overa","Matt Wildman"]
published: 2010-07-01
modified: 2023-11-14
keywords: ["chmod", "commands", "reference", "file permissions"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
 - '[Manage File Permission with Users and Groups](/docs/guides/linux-users-and-groups/)'
 - '[Administration Basics](/docs/guides/linux-system-administration-basics/)'
aliases: ['/linux-tools/common-commands/chmod/','/tools-reference/modify-file-permissions-with-chmod/','/tools-reference/tools/modify-file-permissions-with-chmod/']
bundles: ['debian-security', 'centos-security']
tags: ["security","linux"]
image: modify_file_permissions_with_chmod_smg.png
---

## Modify File Permissions with chmod

The `chmod` command allows users to change read and write permissions in Unix systems. This guide covers how to use `chmod` to view and modify these permission on files and directories.

Unix-like systems, including the Linux distributions that run on the Akamai cloud computing platform, have an incredibly robust access control system. It allows systems administrators to effectively permit multiple users access to a single system, without giving every user access to every file. The `chmod` command is the simplest way to modify these file permissions.

This guide provides an overview of file permissions and the `chmod` command, along with a number of practical examples and applications of `chmod`. If you find this guide helpful, also consider reading our [basic administration practices guide](/docs/guides/linux-system-administration-basics/) and the [Linux users and groups guide](/docs/guides/linux-users-and-groups/).

### Basics of Linux File Permissions

All file system objects on Unix-like systems have three main types of permissions: *read*, *write*, and *execute* access. Permissions are bestowed upon three possible classes: the *owner*, the *group*, and all *other* system users.

To view the file permissions of a set of files, use:

```command
ls -lha
```

In the first column of the output, there are 10 characters that represent the permission bits. To understand why they are called permission bits, see the section on [octal notation](#octal-notation) below.

```output
drwxr-xr-x 2 owner group 4.0K 2009-08-13 10:16 docs
-rw-r--r-- 1 owner group 8.1K 2009-07-09 16:23 roster.py
lrwxrwxrwx 2 owner group 4.0K 2009-08-13 10:16 team.docs
```

A way to understand the meaning of this column is to divide the bits into groups:

| File Type | User | Group | Global |
| -- | -- | -- | -- |
| `d` **Directory**     | `rwx` | `r-x` | `r-x` |
| `-` **Regular file**  | `rw-` | `r--` | `r--` |
| `l` **Symbolic Link** | `rwx` | `rwx` | `rwx` |

The first character represents the type of file. The remaining nine bits in groups of three represent the permissions for the user, group, and global respectively. Each stands for:

- `r`: **R**ead
- `w`: **W**rite
- `x`: e**X**ecute

{{< note >}}
Access to files targeted by symbolic links is controlled by the permissions of the targeted file, not the permissions of the link object. There are [additional file permissions](/docs/guides/linux-users-and-groups/#additional-file-permissions) that control other aspects of access to files.
{{< /note >}}

## How to Use chmod

In this guide, `chmod` refers to recent versions of `chmod` such as those provided by the GNU project. By default, `chmod` is included with all images provided by Akamai, and as part of the base selection of packages in nearly all Linux distributions.

### Changing File Permissions with chmod

To change the file permissions using `chmod`, run `chmod PERMISSION DIRECTORY_OR_FILENAME`, swapping in the desired file permissions and the directory or file. The owner can change file permissions for any user, group, or others by adding `-` to remove or `+` to add certain permissions. These permissions are categorized into read, write, or executable.

The next few sections dive deep into `chmod` syntax.

### Using Symbolic Notation Syntax with chmod

The format of a `chmod` command is:

```command
chmod WHO[+,-,=]PERMISSIONS FILENAME
```

Consider the following `chmod` command:

```command
chmod g+w ~/example.txt
```

This grants write permissions to all members of the usergroup that owns the `~/example.txt` file. Other possible options to change permissions of targeted users are:

| Who (Letter) | Meaning |
| -- | -- |
| **u** | user   |
| **g** | group  |
| **o** | others |
| **a** | all    |

The `+` operator grants permissions whereas the `-` operator takes away permissions. Copying permissions is also possible using the `=` operator, for example:

```command
chmod g=u ~/example.txt
```

The parameter `g=u` grants the group the same permissions as the user.

Multiple permissions can be specified by separating them with a comma, as in the following example:

```command
chmod g+w,o-rw,a+x ~/example-files/
```

This adds write permissions to the group members, and removes read and write permissions from the "other" users of the system. Finally the `a+x` adds the execute permissions to all categories. This value may also be specified as `+x`. If no category is specified, the permission is added or subtracted to all permission categories. In the following example, all categories are given write permissions with `+w`:

```command
chmod -R +w,g=rw,o-rw, ~/example-files/
```

The `-R` option applies the modification to the permissions recursively to the specified directory and to all of its contents.

### Using Octal Notation Syntax with chmod

Another method for setting permissions is through octal notation.

Here is example of a file permission that is equivalent to `chmod u=rwx,g=rx,o=`:

```command
chmod 750 ~/example.txt
```

The permissions for this file are `- rwx r-x ---`.

Disregarding the first bit, each bit that is occupied with a `-` can be replaced with a `0` while `r`, `w`, or `x` is represented by a `1`. The resulting conversion is:

```command
111 101 000
```

This is called octal notation because the binary numbers are converted to base-8 by using the digits 0 to 7:

| Binary | Octal | Permission |
|--|--|--|
| 000 | 0 | --- |
| 001 | 1 | --x |
| 010 | 2 | -w- |
| 011 | 3 | -wx |
| 100 | 4 | r-- |
| 101 | 5 | r-x |
| 110 | 6 | rw- |
| 111 | 7 | rwx |

Each digit is independent of the other two. Therefore, `750` means the current user can read, write, and execute, the group cannot write, and others cannot read, write, or execute.

`744` is a typical default permission. It allows read, write, and execute permissions for the owner, read permissions for the group, and read permissions for "other" users.

Either notation is equivalent, and you may choose to use whichever form more clearly expresses your permissions needs.

## Examples of Common Permissions with chmod

### chmod 600 (`rw-------`)

600 permissions means that only the owner of the file has full read and write access to it. Once a file permission is set to 600, no one else can access the file. Below are example `chmod` commands in octal and symbolic notions that set permissions to 600:

```command
chmod 600 example.txt
chmod u=rw,g=,o= example.txt
chmod a+rwx,u-x,g-rwx,o-rwx example.txt
```

### chmod 664 (`rw-rw-r--`)

664 (`rw-rw-r--`) enables read and write for the owner, read and write for the group, and read for others. If you trust other users within the same group and everyone needs write access to the files, this is a common setting to use. Below are example `chmod` commands in octal and symbolic notions that set permissions to 664:

```command
chmod 664 example.txt
chmod u=rw,g=rw,o=r example.txt
chmod a+rwx,u-x,g-x,o-wx example.txt
```

### chmod 777 (`rwxrwxrwx`)

`chmod 777` is used to grant permissions to everyone to read, write, and execute. While using these permissions can quickly overcome a permissions-based error, it is not best practice for securing most files and applications. Below are example `chmod` commands in octal and symbolic notions that set permissions to 777:

```command
chmod 777 example.txt
chmod u=rwx,g=rwx,o=rwx example.txt
chmod a=rwx example.txt
```

## Making a File Executable

The following example changes the file permissions so that any user can execute the `~/example.py` file:

```command
chmod +x ~/example.py
```

## Restore Default File Permissions

The default permissions for files on a Unix system are often `600` or `644`. Permissions of `600` give the owner full read and write access to the file, but no other user can access it. Alternatively, `644` grants the owner read and write access, while the group members and other system users only have read access.

Issue one of the following `chmod` commands to reset the permissions back to one of the likely defaults:

```command
chmod 600 ~/example.txt
```

```command
chmod 644 ~/example.txt
```

For executable files, the equivalent settings would be `700` and `755` which correspond to `600` and `644` except with execution permission.

Use one of the following examples to achieve these default executable permissions:

```command
chmod 700 ~/example.py
```

```command
chmod 755 ~/example.py
```

## Removing File Permissions with chmod

In order to remove global read and write permissions given to a file, use the following syntax:

```command
chmod o-rw example.txt
```

Run the following `chmod` command to remove read and write permissions for the group:

```command
chmod g-rx example.txt
```

Use the following `chmod` command to remove read and write permissions from the group, while adding read and write permission for other users:

```command
chmod g-rx, o+rx example.txt
```

Alternatively, if you wish to remove all permissions for group and others, do so using `go=`:

```command
chmod go= example.txt
```

## Restrict File Access: Remove all Group and Other Permissions

There are a number of cases where administrators and users should restrict access to files, particularly files that contain passwords and other sensitive information. The configuration files for msmtp and Fetchmail (`~/.msmtprc` and `~/.fetchmailrc`) are two common examples.

You can remove all access to these files with commands in one of the following forms:

```command
chmod 600 .msmtprc
```

```command
chmod g-rwx,o-rwx .fetchmail
```

## Understanding Linux Directory Permissions

While directory permissions within Linux are similar to file permissions, there are a few key differences regarding how these permissions affect user operations:

- **Read** (`r`): User can list the items in a directory, such as when using the `ls` command.
- **Write** (`w`): User can add, delete, or rename files in a directory, provided the user also has execute permissions.
- **Execute** (`x`): User can navigate to the directory, such as when using the `cd` command.

To view permissions of all files and directories within the working directory, run the following command:

```command
ls -la
```

The output should be similar to the snippet below:

```output
total 12
drwxr-xr-x 3 user group 4096 Apr 16 12:34 .
drwxr-xr-x 4 user group 4096 Apr 16 12:33 ..
drwxr-xr-x 2 user group 4096 Apr 16 12:34 example-directory
-rw-r--r-- 1 user group    0 Apr 16 12:34 file1.txt
```

Directories are differentiated from files by the first bit within the permissions. As covered previously, `d` stands for directory and `-` denotes the item is a file.

Permissions on an individual directory can also be viewed using the following command syntax:

`ls -dl EXAMPLE_DIRECTORY`

### How To Change Directory Permissions using chmod

Directory permissions can be adjusted using the same `chmod` commands as previously outlined for modifying file permissions. The following example changes permissions on an example directory to `755`:

```command
chmod 755 /example-directory/
```

In many cases, the permissions should also be changed recursively on all files and subdirectories. This can be done through `chmod` by using the `-R` option. Run the following command to change all permissions for files within a directory to `644`:

```command
sudo chmod -R 644 /var/www/html/
```

{{< community >}}
* [How to set permissions for the webserver directory](https://www.linode.com/community/questions/8808/setting-ownership-and-permissions-for-webserver-directories)
* [Permission issues with Ubuntu](https://www.linode.com/community/questions/6076/permission-issues-with-ubuntu-amp-wordpress-chown-fails)
* [Issues with /var/www permissions](https://www.linode.com/community/questions/7302/varwww-permissions)
{{</ community >}}