---
slug: linux-remove-symbolic-link
title: "Remove Symbolic Links"
title_meta: "How to Remove a Symbolic Link in Linux"
description: 'In Linux, remove symbolic link commands include rm, unlink, and find. Learn how to remove symbolic links with each of the three commands.'
keywords: ['linux remove symbolic link','remove symlink','remove symbolic link','remove symlink linux','linux remove symlink','how to remove symbolic link','unlink in linux','how to remove a symbolic link','unlink linux','delete symbolic link']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Stephen Satchell"]
published: 2023-04-18
modified_by:
  name: Linode
external_resources:
- '[LinuxHint: How Do I Remove a Symbolic Link in Linux?](https://linuxhint.com/remove-symbolic-link-linux/)'
- '[nixCraft: How To: Linux Delete Symbolic Link Softlink](https://www.cyberciti.biz/faq/linux-remove-delete-symbolic-softlink-command/)'
- '[Baeldung: How to Remove Symbolic Links](https://www.baeldung.com/linux/remove-symbolic-links)'
---

Symbolic links (also known as *symlinks*) in Linux are special files that reference other files, directories, devices, or pipes. In other operating systems, symlinks may be called "shortcuts". Symlinks can be used to control access to files. For example, you can build links in a user’s home directory that accesses a more public file for reading and writing. Group permissions perform this function as well, but with a higher administrative maintenance load. Symlinks also bring access to a file deeply nested within a directory tree. Thus, users do not have to walk the file directory tree to access the file.

Learn how to create symlinks in our guide [How to Create Linux Symlinks](/docs/guides/linux-symlinks/).

## What is a Symlink?

A Linux symbolic link is a special kind of file. The content of this file is a file path, for example `/tmp/file`. The path name can be any valid path, so a symlink can cross over into other file systems, including network file systems. Most operations, such as reading, overwriting, appending, changing permissions, and changing owners affect the target object, not the symlink. However, you cannot delete the target via a symlink as a delete request affects the symlink directly.

Symlinks can point to other symlinks, too. The operating system traverses the chain of symlinks to arrive at the ultimate targeted file object.

When you use the `ls -l` to display a symlink, the output looks like this:

```output
symlink -> /tmp/reference-file
```

The first part is the symlink, the part after the arrow is where the symlink points to.

## How to Remove a Symbolic Link

To remove a symlink, you need write permission for the directory containing the symlink.

Keep in mind that when you remove a symlink, you do not affect the file system object the symlink points to. The target object is completely unaffected in any way when a symlink to it is removed.

When the target object is moved or deleted, the symlink that points to it becomes a *dangling symlink*.

### Using `rm` Command

The `rm` command treats a symlink like any other file. Just use the normal `rm` syntax:

```command
rm <symlink>
```

The command can specify any number or combination of files, wildcards, and modifiers, including symlinks:

```command
rm <symlink> <regular-file> <*.py> <log[123].txt> <2nd-symbolic-link>
```

Include the `-i` flag to be prompted before each file deletion.

### Using `unlink`

The `unlink` command also treats a symlink like any other file. However, you can only specify one object per invocation. For example:

```command
unlink <symlink>
```

### Using Find and Delete

To see all symlinks in a specific directory and its sub-directories, use the `find` command with the `-type l` flag:

```command
find /path/to/directory -type l
```

To look only in the specified directory, ignoring the contents of any subdirectories, add the `-maxdepth 1` switch:

```command
find /path/to/directory -type l -maxdepth 1
```

For example, the following command searches the `/tmp` directory for symlinks:

```command
find /tmp -maxdepth 1 -type l
```

Here's an how the output of that command would look like:

```output
/tmp/dangling-symlink1
/tmp/dangling-symlink3
/tmp/symlink2
/tmp/symlink1
/tmp/symlink
/tmp/symlink3
/tmp/dangling-symlink2
```

To unconditionally delete all symlinks in a directory, add the `-delete` switch:

```command
find /path/to/directory -maxdepth 1 -type l -delete
```

## How to Find Dangling Symlinks

Overuse of symlinks can clog your file system and consume resources. To see the dangling symlinks in a single directory, use the `find` command with the `-xtype l` flag:

```command
find /path/to/directory -maxdepth 1 -xtype l
```

The command outputs each symlink, one per line. For example, the following command finds all dangling symlinks in the `/tmp` directory:

```command
find /tmp -maxdepth 1 -xtype l
```

Here's an example of how that output should appear:

```output
/tmp/dangling-symlink1
/tmp/dangling-symlink3
/tmp/dangling-symlink2
```

When you want to make a clean sweep of the excess symlinks, add the `delete` flag:

```command
find /path/to/directory -maxdepth 1 -xtype l -delete
```

Change the `-maxdepth 1` to the recursion level needed, or remove the switch completely to cleanse all subdirectories of useless, dangling symlinks.

## Removing Strings of Symlinks

A symlink can point to another symlink, which in turn can point to a symlink. This linking continues until you finally get to the target file, directory, device, pipe, or other file system target. Removing a chain of symlinks safely is a manual process.

First, install the package `util-linux` if it’s not already loaded into the Linux system.

The command `namei` takes a file path. If the file path is a symlink, it follows it all the way to the end, or until the symlink recursion limit is reached. For this example, inspect a chained symlink from `/tmp/symlink` to the file `/home/satch/target` with the following command:

```command
namei /tmp/symlink
```

It creates this output:

```output
f: /tmp/symlink
 d /
 d tmp
 l symlink -> symlink1
   l symlink1 -> symlink2
     l symlink2 -> symlink3
       l symlink3 -> /home/satch/target
         d /
         d home
         d satch
         - target
```

The command follows the path through directories and symbolic links until it encounters a socket, block device, character device, FIFO (named pipe) or regular file. When deleting the symlink chain, start at the top symlink, changing the working directory as you go. In the output of the `namei` command, the first letter indicates the kind of file system object for that name. Here `d` stands for directory, `l` for symbolic link, and `-` for a regular file. The [`namei` man page](https://man7.org/linux/man-pages/man1/namei.1.html) describes the indicator letters for other file system objects. Given the output shown above, issue the following to remove all levels of the symlink:

```command
cd /tmp
rm symlink
rm symlink1
rm symlink2
rm symlink3
```

Run the `namei` command with the `-mov` flag to show when the remove command needs to be run with `sudo`:

```command
namei -mov /tmp/symlink
```

Here's an example output from this command:

```output
f: /tmp/symlink
dr-xr-xr-x root  root  /
drwxrwxrwt root  root  tmp
lrwxrwxrwx satch satch symlink -> symlink1
lrwxrwxrwx satch satch   symlink1 -> symlink2
lrwxrwxrwx satch satch     symlink2 -> symlink3
lrwxrwxrwx satch satch       symlink3 -> /home/satch/target
dr-xr-xr-x root  root          /
drwxr-xr-x root  root          home
drwx--x--- satch satch         satch
-rw-rw-r-- satch satch         target
```

The difference is that the permissions and ownership are shown. This can save time and error messages when a symlink chain bounces through multiple partitions, network file systems, and protected directories.

## Conclusion

Tidying up a file system of obsolete Linux symlinks frees up resources on your disks and network file systems. It’s good practice to remove a symbolic link when it is no longer needed, or the target has been moved or deleted.