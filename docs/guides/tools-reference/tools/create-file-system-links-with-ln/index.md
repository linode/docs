---
slug: create-file-system-links-with-ln
description: 'This guide provides you with step-by-step instructions for creating hard and sym (symbolic) links with the ln command on the Linux operating system.'
keywords: ["linux", "common commands", "unix", "command line", "file systems"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/tools-reference/tools/create-file-system-links-with-ln/','/linux-tools/common-commands/ln/']
modified: 2018-03-12
modified_by:
  name: Linode
published: 2010-10-11
title: Create File System Links with ln
external_resources:
  - '[What is the Difference Between a Hard Link and a Symbolic Link? (Ask Ubuntu)](https://askubuntu.com/questions/108771/what-is-the-difference-between-a-hard-link-and-a-symbolic-link)'
tags: ["linux"]
authors: ["Linode"]
---

![Create File System Links with ln](create_file_system_links_with_ln_smg.png)

The `ln` command creates **links** which point to other objects in the file system. Links are similar to (but not the same as) **aliases**. Links may point to files, directories, or other links. Although improper use can lead to disorganization and confusion, links are useful for providing access to files and file system organization.

`ln` can create two different types of links:

**Symbolic links** (or **symlinks**) are pointers that only contain a reference to the location of the target object; they inherit all other properties from the linked file. These are the easiest links to understand and are the most commonly used.

**Hard links** create a new file that points to the contents of the original file. If the name or location of the original file is changed, the hard link to it will still function. It is impossible to create hard links to objects that are on different disk devices or file systems. Hard links cannot point to directories.

## File System Links

### Basic Syntax

`ln` uses a syntax that closely resembles tools like `cp` and `mv`:

    ln -s <from> <to>

{{< note respectIndent=false >}}
The `-s` flag specifies a symbolic link. If this flag is omitted, a hard link is created by default.
{{< /note >}}

You can make symbolic links to both files and directories. For example, to create a link from a directory in `/var/www/html` to your home directory:

    ln -s /var/www/html/example.com ~/example.com

If you do not specify the second argument, `ln` will make a link to your current directory. You can get the same result as the previous command with:

    ln -s /var/www/html/example.com

This link will appear in the output of commands like `ls`, and for most purposes can be treated as though it were the original directory. Files copied or moved to the link using `cp test.txt ~/example.com/` will appear in the original directory in `/var/www/html/`. However, permissions for symbolic links are inherited from their sources, so you will not be able to write or delete files within this directory without using `sudo`.

The symbolic link can have a different name from its linked file or directory:

    ln -s /srv/file.txt /usr/bin/different-file.txt

### Use Cases for Symbolic Links

If your web site's public files are located in the directory `/srv/www/example.com/public_html/`, but you want a number of users to be able to access this directory in their `/home/` directories, you can create multiple symbolic links in these `/home/` directories that point to `/srv/www/example.com/public_html/`.

If you want to keep your web server configuration files in version control, so that they can be easily updated and shared between projects and servers, you can keep the files in a Git repository in your home directory and make symlinks to the NGINX or Apache configuration directories:

    mkdir ~/nginx-configs
    sudo mv /etc/nginx/conf.d/* ~/nginx-configs
    cd ~/nginx-configs && git init && git add --all && git commit
    sudo ln -s /home/username/nginx-configs/ /etc/nginx/conf.d/
    sudo systemctl restart nginx

### Security Concerns

Symbolic links can be moved, renamed, and removed at any time. When a link is created with a relative path specified and the link is later moved, the target of the link is also expected to move. If it doesn't, the link will point to an object that doesn't exist. This can lead to potential security flaws if a symbolic link is copied or transferred to a different system, or if the link object is moved and the target is replaced with malicious content.

## Examples

### Create Symbolic Links with Relative Paths

{{< output >}}
$ ls -l
total 0
-rw-r--r-- 1 username username 0 Aug 27 10:35 foo

$ ln -s foo bar

$ ls -l
total 0
lrwxrwxrwx 1 username username 3 Aug 27 10:35 bar -> foo
-rw-r--r-- 1 username username 0 Aug 27 10:35 foo
{{< /output >}}

The first column of metadata on the `bar` object is `l`, which indicates that `bar` is a link. Additionally, `ls` prints the location of the symbolic link. The above link is relative: `bar` is linked to the object `foo` in the same directory.

Relative symbolic links always retain the path that they used when the link was first created. If you move the link to a location that has a different relationship to the target file, the link will break. As an example, use the following directory structure:

{{< output >}}
/home/username
├── example.txt
├── foo/
│   └── baz/
└── bar/
{{< /output >}}

Add content to the example file and create a relative symlink:

    echo "Test file" >> example.txt
    cd foo
    ln -s ../example.txt exampleLink

This creates a link that expects its target to be exactly one directory higher than the link itself. If you move the link to another directory that shares this relationship, such as `bar`, `exampleLink` will still function. But if you move the link to `baz`, one level lower down the directory structure, the link will still look for `../example.txt` and will therefore break:

    mv exampleLink ../bar
    cat ../bar/exampleLink

{{< output >}}
Test file
{{< /output >}}

    mv ../bar/exampleLink baz/
    cat baz/exampleLink

{{< output >}}
cat: baz/example.txt: No such file or directory
{{< /output >}}


### Create a Symbolic Link With Absolute Paths

To avoid the pitfalls of specifying relative symbolic link targets, you may create symbolic links that point to absolute paths:

{{< output >}}
$ ln -s /srv/www/example.com/public_html /home/username/public

$ ls -l /home/username
total 0
lrwxrwxrwx 1 username username 3 Aug 27 11:43 public -> /srv/www/example.com/public_html

$ ls -l /home/username/public
total 48K
-rw-r--r-- 1 username username 355 2010-06-10 14:50 index.htm
-rw-r--r-- 1 username username 38K 2010-06-10 12:37 logo.png
{{< /output >}}
