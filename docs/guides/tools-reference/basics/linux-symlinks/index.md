---
slug: linux-symlinks
title: "How to Create Linux Symlinks"
title_meta: "The Ultimate Guide to Creating Linux Symlinks"
description: 'Linux symlinks are used for managing and collating files. Learn the basics of Linux symlinks.'
keywords: ['linux symlinks','symbolic link linux','soft link in linux','linux symbolic link','ln command','linux ln','linux create symbolic link','ln linux','linux ln command','create symbolic link linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Stephen Satchell"]
published: 2023-04-18
modified_by:
  name: Linode
external_resources:
- '[freeCodeCamp: Symlink Tutorial in Linux – How to Create and Remove a Symbolic Link](https://www.freecodecamp.org/news/symlink-tutorial-in-linux-how-to-create-and-remove-a-symbolic-link/)'
- '[LinuxHint: Symbolic Link in Linux](https://linuxhint.com/symbolic-link-linux/)'
---

A symbolic link, or symlink, creates a name that references another file, directory, or other Linux file system object. Using symlinks minimizes the necessity of having multiple copies of a file within a system. Any changes can be made in one place, instead of modifying many copies.

Symlinks also provide a way to manage access. Multiple directories each owned by a user can reference a subset of a set of files. This limits visibility in a more complex manner than the file system permissions system permits.

Symlinks are a vital tool to file management and organization.

## What is a Symlink?

A *symlink* is a type of special file whose "data" is a path to the name of a file system object, which could be a:

-   file
-   directory
-   pipe - via `mkfifo`
-   special device
-   symlink - see [Chains of Soft Links](/docs/guides/linux-symlinks/#chains-of-soft-links) below

Also known as a "soft link" in Linux, the term "shortcut" describes symlinks in other operating systems.

### Soft Link Versus Hard Link

It is easy to confuse a symlink with a hard link. A disk’s file system has a number of control blocks called *inodes*. These describe the details of files and other objects, including where on the disk any associated data is stored. Entries in a Linux directory associate a name, for example "config", with an inode number. A hard link creates an alias, or an *associated* name with the same inode number. See the [man page for the `ln` utility](https://man7.org/linux/man-pages/man1/ln.1.html) for details, particularly limitations on creating and removing hard links.

The symlink (AKA soft link) is a referrer rather than an alias. Think of it as a signpost pointing to where the target file can be found. The Linux system reads the symlink’s file path to reach the target.

Soft links make restoring backups easier than doing so with hard links. Use of symlinks can simplify the installation or update of an application or file system tree.

### Chains of Soft Links

Symlinks can be used in special cases where the symlink points to another symlink. The Linux system progresses down such a chain of symlinks to get to the final object. When you unlink the head of a symlink chain, you remove only that symlink. When you unlink an intermediate symlink, you break the chain. In both cases, the target remains untouched.

To prevent chain loops from overloading the system, Linux limits the number of hops through a symlink chain to 40.

{{< note >}}
To see all the nodes in a symlink chain, use [the `namei` command](https://man7.org/linux/man-pages/man1/namei.1.html). Here is sample output from one computer:

```output
d .
d Desktop
d backup.per
d satch
d Desktop
d ietf
d rfcs
l in-notes -> in-notes
  l in-notes -> in-notes
    l in-notes -> in-notes
      l in-notes -> in-notes
        …
```
{{< /note >}}

The command follows from the specified directory down the file system tree. In this case, one of the symlinks points to itself – a chain loop that’s pretty direct.

## How to Create a Symbolic Link in Linux

There are various ways to create symbolic links depending on how you want to use them. The basic syntax to create a symlink is as follows:

```command
ln -s </target-directory/target-file> </symlink-directory/example-symlink>
```

The `-s` switch is important because it tells the Linux `ln` command to create a soft link instead of a hard link. The `</symlink-directory/>` is optional. If not specified, the symlink is created in the current working directory.

{{< note >}}
When you use the Linux `ln` command in a shell script, the command returns true (0) on success.
{{< /note >}}

### Creating a Symlink to a File

The following example command creates the `symlink-file` symlink in the current directory, which points to `/tmp/reference-file`:

```command
ln -s /tmp/reference-file symlink-file
```

{{< note >}}
In this example, the file pathname is absolute. You can create a symlink with a relative path. However, make sure that anything using the symlink first sets the current working directory, otherwise the link is broken.
{{</ note >}}

### Creating a Symlink to a Directory/Folder

The same command can also be used to create a symlink that points to a directory. The following example command creates the  `symlink-directory` symlink in the current directory, which points to `/tmp/reference-directory`:

```command
ln -s /tmp/reference-directory symlink-directory
```

Any reference to `symlink-directory` acts on the directory `/tmp/reference-directory`. This includes adding or deleting files in the directory, changing the ownership, and changing the permission if allowed.

### Force Overwriting of a Symbolic Link

If the path in a symlink is wrong, for example a typo, or the target has moved, you can update the link using the `-f` flag:

```command
ln -sf /tmp/new-reference-directory symlink-directory
```

This results in the old symlink’s contents being replaced with the new. The `-f` switch automatically removes any conflicting symlink-filepath files or symlinks if there is a conflict. Making a symlink without the `-f` switch, using a sympath-name that is already in use, results in the command failing.

### Display the Contents of a Symlink

To show the contents of a symlink, use the Linux `ls` command:

```commnad
ls -l symlink-directory
```

The output looks like this:

```output
symlink-file -> /tmp/reference-file
```

## Using Linux Symlinks

Almost all file-based actions on a symlink act on or affect the target file, but not the symlink or symlink chain itself. Therefore `touch`, `chmod`, `chown`, `chgrp`, shell redirection, and their program/script equivalents all act on the target file/directory and its attributes. When the file is open, all read and write activity accesses or modifies the target file. However, there are exceptions, described in the next section.

## Removing Symlinks

The exceptions to the above-described rule are the Linux commands `unlink`, `rm`, `rmdir`, and their associated system calls. These commands either fail or remove the symlink itself instead of the target file or directory. These exceptions prevent the inadvertent removal of the target.

See more information about removing symlinks in our [Remove Symbolic Links](/docs/guides/linux-remove-symbolic-link/).

## Finding Dangling Symlinks

A dangling symlink occurs when the target does not exist. The original file may have been deleted or moved to another part of the file system tree.

While breaking a symlink can be intentional, dangling symlinks can clutter up the file system if not intended. To find these dangling symlinks within a file system tree, use this command:

```command
find </directory/to/search> -xtype l
```

{{< note >}}
Do not immediately pipe this to the `rm` command. Investigate first, so you can repair inadvertently broken symlinks.
{{< /note >}}

## Conclusion

Symlinks help reduce clutter and maintenance when many applications use a common file. When a sysadmin changes the common file, it affects all applications using it, in one simple operation. Using symlinks is an alternative to using directories like `/etc` (which requires root access) to store such much-used files. Moreover, the application developer can use a local file for testing and debugging. Then upon release, replace that local file with the symlink to the production version of the application.

If a portion of the file system tree expands to overflow the disk partition, move that tree to another partition, perhaps on another disk. Then replace the top of that tree with a symlink pointing to its new home. This method of doing disk maintenance reduces the clutter in `/etc/fstab` by associating the new location to the old.