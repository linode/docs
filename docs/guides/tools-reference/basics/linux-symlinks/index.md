---
slug: linux-symlinks
title: "How to Create Linux Symlinks"
title_meta: "The Ultimate Guide to Creating Linux Symlinks"
description: 'Linux symlinks are used for managing and collating files. Learn the basics of Linux links and how to create symbolic links like a pro. ✓ Get organized today!'
keywords: ['linux symlinks','symbolic link linux','soft link in linux','linux symbolic link','ln command','linux ln','linux create symbolic link','ln linux','linux ln command','create symbolic link linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Stephen Satchell"]
published: 2023-03-23
modified_by:
  name: Linode
external_resources:
- '[phoenixNAP: Ln Command: How to Create Symbolic Links in Linux](https://phoenixnap.com/kb/symbolic-link-linux)'
- '[freeCodeCamp: Symlink Tutorial in Linux – How to Create and Remove a Symbolic Link](https://www.freecodecamp.org/news/symlink-tutorial-in-linux-how-to-create-and-remove-a-symbolic-link/)'
- '[LinuxHint: Symbolic Link in Linux](https://linuxhint.com/symbolic-link-linux/)'
---

A symbolic link, or symlink, creates a name that references another file, directory, or other Linux file system object. Using symlinks minimizes multiple copies of a file within a system. Any changes can be made in one place, instead of modifying many copies.

Symlinks also provide a way to manage access. Multiple directories each owned by a user can reference a subset of a set of files. This limits visibility in a more complex manner than the file system permissions system permits.

Symlinks are a vital tool to file management and organization.

## What is a Symlink?

A *symlink* is a type of special file whose "data" is a path to the name of a file system object, which could be a:

-   file
-   directory
-   pipe - via `mkfifo`
-   special device
-   symlink - see [Chains of Soft Links](docs/guides/tools-reference/basics/linux-symlinks#chains-of-soft-links) below

Also known as a "soft link" in Linux, the term "shortcut" describes symlinks in other operating systems.

### Soft Link Versus Hard Link

Don’t confuse a symlink with a hard link. A disk’s file system has a number of control blocks called *inodes*. These describe the details of files and other objects, including where on the disk any associated data is stored. Entries in a Linux directory associate a name, for example "config", with an inode number. A hard link creates an alias, as it associates *another* name with the same inode number. See the [man page for the `ln` utility](https://man7.org/linux/man-pages/man1/ln.1.html) for details, particularly limitations on creating and removing hard links.

The symlink (AKA soft link) is a referrer rather than an alias. Think of it as a signpost to where the target file can be found. The Linux system reads the symlink’s file path to reach the target.

Soft links make restoring backups easier than doing so with hard links. Use of symlinks can simplify the installation or update of an application or file system tree.

### Chains of Soft Links

A special case is a symlink pointing to another symlink. The Linux system walks down such a chain to get to the final object. When you unlink the head of a symlink chain, you remove only that symlink. When you unlink an intermediate symlink, you break the chain. In both cases, the target remains untouched.

To prevent chain loops from overloading the system, Linux limits the number of hops through a symlink chain to 40.

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

The command follows from the specified directory down the file system tree. In this case, one of the symlinks points to itself – a chain loop that’s pretty direct.

## How to Create a Symbolic Link in Linux

There are various ways to create symbolic links depending on how you want to use them.

### Creating a Symlink to a File

Use the following command to create the `working-file` symlink in the current directory, which points to `/tmp/my-working-file`:

```command
ln -s /tmp/my-working-file working-file
```

In this example, the file pathname is an absolute path. You can create a symlink with a relative path. However, make sure that anything using the symlink first sets the current working directory the same way, or the link is broken.

### Creating a Symlink to a Directory/Folder

Use the following command to create the  `my-directory` symlink in the current directory, which points to `/tmp/reference-directory`:

```command
ln -s /tmp/reference-directory my-directory
```

Any reference to `my-directory` acts on the directory `/tmp/reference-directory`. This includes as adding or deleting files in the directory, changing the ownership, and changing the permission if allowed.

### Force Overwriting of a Symbolic Link

If the path in a symlink is wrong, for example a typo, or the target has moved, you can update the link using this command:

```command
ln -sf /tmp/new-reference-directory my-directory
```

This results in the old symlink’s contents being replaced with the new.

### General Form of the “ln” Command

The `-s` switch is important because it tells the Linux ln command to create a soft link instead of a hard link.

The `-f` switch automatically removes any conflicting symlink-filepath files or symlinks if there is a conflict. Making a symlink without the `-f` switch, using a sympath-name that is already in use, results in the command failing.

```command
ln -s [-f] target-filepath symlink-filepath
```

When you use the Linux `ln` command in a shell script, the command returns true (0) on success.

### Display the Contents of a Symlink

To show the contents of a symlink, use the Linux `ls` command:

```commnad
ls -l working-file
```

The output looks like this:

```output
working-file -> /tmp/my-working-file
```

## Using Linux Symlinks

Almost all file-based actions on a symlink act on or affect the target file, but not the symlink or symlink chain itself. Therefore `touch`, `chmod`, `chown`, `chgrp`, shell redirection, and their program/script equivalents all act on the target file/directory and its attributes. When the file is open, all read and write activity accesses or modifies the target file. However, there are exceptions, described in the next section.

## Removing Symlinks

The exceptions to the above-described rule are the Linux commands `unlink`, `rm`, `rmdir`, and their associated system calls. These commands either fail or remove the symlink itself instead of the target file or directory. These exceptions prevent the inadvertent removal of the target.

## Finding Dangling Symlinks

A dangling symlink occurs when the target does not exist. The original file may have been deleted or moved to another part of the file system tree.

While breaking a symlink can be intentional, dangling symlinks can clutter up the file system if not intended. To find these dangling symlinks within a file system tree, use this command:

```command
find file-tree-to-search/ -xtype l
```

Don’t immediately pipe this to the `rm` command, though. Investigate first, so you can repair inadvertently broken symlinks.

## Conclusion

Symlinks help reduce clutter and maintenance when many applications use a common file. When a sysadmin changes the common file, it affects all applications using it, in one simple operation. Using symlinks is an alternative to using directories like `/etc` (which requires root access) to store such much-used files. Moreover, the application developer can use a local file for testing and debugging. Then upon release, replace that local file with the symlink to the production version of the application.

If a portion of the file system tree expands to overflow the disk partition, move that tree to another partition, perhaps on another disk. Then replace the top of that tree with a symlink pointing to its new home. This method of doing disk maintenance reduces the clutter in `/etc/fstab` by associating the new location to the old.