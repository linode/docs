---
author:
  name: Linode
  email: docs@linode.com
description: 'Create hard and symbolic links with ln on Linux Systems.'
keywords: ["linux", "common commands", "unix", "command line", "file systems"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/common-commands/ln/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2010-10-11
title: Create File System Links with ln
---

The `ln` command creates "meta objects" in the file system that link to other objects located on the file system. Links may point to files, directories, or other links. Although improper use can lead to disorganization and confusion, links are useful for providing access to files and file system organization.

![Title graphic](/docs/assets/create_file_system_links_with_ln_smg.png)

## File System Linking

### The ln Command

Consider the following command:

    ln -s /srv/www/example.com

This creates a link, named `example.com` in the current directory to the directory or file located at `/srv/www/example.com`. If you want to specify a different name for the link object, append that name to the end of the above command as in the following:

    ln -s /srv/www/example.com example

If you want to create a symbolic link in a directory other than your current directory, you can specify a full path in the final argument of the command:

    ln -s /srv/www/example.com/public_html /home/username/public/example

### Symbolic and Hard Links

Symbolic links are "pointers" that don't contain any information other than the location of the target object and inherit all other properties from the linked file. These are the easiest links to use and understand.

Hard links allow two apparent files, potentially with different names, to point to the same data. It is impossible to create hard links to objects that are on different disk devices or file systems. Hard links cannot point to directories, only files.

### Use Cases for Symbolic Links

File system links are very convenient and may simplify some file system organization issues. However, link objects can create confusion, particularly when links point to other links or when links point to source files that do not exist or have been removed. When used correctly, links can be a powerful asset in the toolkit of a systems administrator.

If your web site's public files are located in the directory `/srv/www/example.com/public_html/`, but you want a number of users to be able to access this directory in their `/home/` directories, you could create multiple symbolic links in these `/home/` directories that point to `/srv/www/example.com/public_html/`.

If you want to save all of your custom configuration options in a version controlled folder located in `/opt/configs/` and want to be able to update configurations by simply updating the version control system, you could create a number of symbolic links in your `/etc` directory to files and folders in `/opt/configs/`.

### Security Concerns

Symbolic links can be moved, renamed, and removed at any time. When a link is created with a relative path specified and the link is later moved, the target of the link is also expected to move. If it doesn't, the link will point to an object that doesn't exist. This can lead to potential security flaws if a symbolic link is copied or transferred to a different system, or if the link object is moved and the "target" is replaced with malicious content. Be wary of potential issues that this may create.

## Examples

### Create Symbolic Links with Relative Paths

Consider the output of the following sequence of commands, which creates and displays a very simple symbolic link:

    $ ls -l
    total 0
    -rw-r--r-- 1 username username 0 Aug 27 10:35 foo

    $ ln -s foo bar

    $ ls -l
    total 0
    lrwxrwxrwx 1 username username 3 Aug 27 10:35 bar -> foo
    -rw-r--r-- 1 username username 0 Aug 27 10:35 fooh

The first column of meta data on the `bar` object is `l`, which indicates that `bar` is a link. Additionally, `ls` prints the location of the symbolic link. The above link is relative: `bar` is linked to the object `foo` in the same directory. Consider the following relative link:

    $ ln -s ../example.txt

    $ ls -l
    lrwxrwxrwx 1 username username 6 Aug 27 10:54 example.txt -> ../example.txt

The `ln -s` command will succeed as long as a there are no files in the target directory that would conflict with the name of the link to be created. While the target file must exist when the link is created, the link or the target may be moved resulting in a broken link.

### Create a Symbolic Link With Absolute Paths

To avoid the pitfalls of specifying relative symbolic link targets, you may create symbolic links that point to absolute paths. Consider the following example:

    $ ln -s /srv/www/example.com/public_html /home/username/public

    $ ls -l /home/username
    total 0
    lrwxrwxrwx 1 username username 3 Aug 27 11:43 public -> /srv/www/example.com/public_html

    $ ls -l /home/username/public
    total 48K
    -rw-r--r-- 1 username username 355 2010-06-10 14:50 index.htm
    -rw-r--r-- 1 username username 38K 2010-06-10 12:37 logo.png

### Create a Hard Link

In most cases, symbolic links are preferable over hard links. There are some situations that require hard links. Consider the following example:

    $ ls -l
    total 4.0K
    -rw-r--r-- 1 username username 3 Aug 27 12:23 foo

    $ ln foo bar

    $ ls -l
    total 8.0K
    -rw-r--r-- 2 username username 3 Aug 27 12:23 bar
    -rw-r--r-- 2 username username 3 Aug 27 12:23 foo

    $ touch foo

    $ ls -l
    total 8.0K
    -rw-r--r-- 2 username username 3 Aug 27 12:24 bar
    -rw-r--r-- 2 username username 3 Aug 27 12:24 foo
