---
author:
  name: Linode
  email: docs@linode.com
description: Use find to recursively filter file systems for files
keywords: 'find,linux,commands,shell'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['linux-tools/common-commands/find/']
modified: Tuesday, April 19th, 2011
modified_by:
  name: Linode
published: 'Monday, October 25th, 2010'
title: Filter File systems with the find Command
---

`find` is a command for recursively filtering objects in the file system based on a simple conditional system. Use `find` when you need to locate a set of files on your file system.

## Command Syntax for find

`find` expressions take the following form:

    find [options] [starting path] [expression]

In this example, the `[options]` control the behavior and optimization method of the `find` process. The `[starting path]` defines the top level directory where `find` begins filtering. The `[expression]` statement controls the tests that filter the directory hierarchy to produce output. Consider the following example command:

    find -O3 -L /srv/www/ -name "*.html" 

This command enables the maximum optimization level and allows `find` to follow symbolic links. `find` filters the entire directory tree beneath `/srv/www/` for files that end with `.html`.

## Options and Optimization for find

The default configuration for `find` will ignore symbolic links. If you want `find` to follow and return symbolic links, you can use the `-L` option to the command, as above.

`find` optimizes its filtering strategy to increase performance. There are three user-selectable optimization levels that are specified as `-O1`, `-O2`, and `-O3`. The `-O1` optimization is default and it forces `find` to filter based on file name before running all other tests.

Optimization at the `-O2` level prioritizes file name filters as in `-O1` and then runs all file-type filtering before proceeding with other more expensive conditions. Level "`-O3` optimization allows `find` to perform the most severe optimization and reorders all tests based on their relative expense and the likelihood of their success.

## Filter Files by Name or Extension

The simplest use of `find` is for crawling a directory hierarchy in search file with names that match a string. Use the `-name "[string]"` expression form. Consider the following examples:

    find / -name "*.err"

    find /home/squire/ -name "*.el*" 

In the first command, the list of all readable objects on the file system is filtered for all items that end with the characters `.err`. The second command returns all items beneath the `/home/squire/` directory that end with "`.el`.

## Filter Files by Modification Time

`find` contains the ability to filer a directory hierarchy based on when the file was last modified.

    find / -name "*conf" -mtime 7 

    find /home/squire/ -name "*conf" -mtime 3

The first command returns a list of all files in entire file system that end with the characters `conf` and have been modified in the last 7 days. The second command filters `squire` user's home directory for files with names that end with the characters `conf` and have been modified in the last 3 days.

## Delete Matching Files

Add the option `-delete` to the end of a match expression to delete all files that match. Use this option when you are certain that the find expression *only* matches the files that you wish to delete. Consider the following example:

    find . -name "*.bak" -delete

Here, `find` filters all files in the hierarchy starting at the current directory and fully recursing into the directory tree. In this example, `find` will delete all files that end with the characters `.bak`.

Use this option with extreme caution.

## Filter Files Based on Content with Grep

`find` is only able to filter the directory hierarchy based on a file's name and meta data. If you need to filter based on the content of the file, use a tool like [grep](/docs/tools-reference/search-and-filter-text-with-grep) to filter using grep. Take the following example:

    find . -type f -exec grep "example" '{}' \; -print 

This filters every object in the current hierarchy (e.g. `.`) that is a file (e.g. `-type f`) and then runs the command `grep "example"` for every file that matches. The files that match are printed. (e.g. `-print`). The curly braces (e.g. "`{}`) are a placeholder for the `find` match results. The `{}` are enclosed in single quotes to avoid handing `grep` a malformed file name. The `-exec` command is terminated with a semi-colon (e.g. `;`), which should be escaped (e.g. "`\;`) to avoid interpretation by the shell.

Before the implementation of the `-exec` option, this kind of command might have used the `xargs` command to generate a similar output:

    find . -type f -print | xargs grep "example

## Process Files with find

The `-exec` option runs commands against every object that matches the find expression. Consider the following:

    find . -name "rc.conf" -exec chmod o+r '{}' \; 

This filters every object in the current hierarchy (e.g. `.`) for files named `rc.conf` and runs the "`chmod o+r` command with the results of the `find` match.

The commands run with the `-exec` are executed in the root directory of the `find` process. Use `-execdir` to execute the specified command in the directory where the match resides. This may eliminate security concerns and produce more desirable performance for some operations.

If the `-exec` or `-execdir` options are replaced with the `-ok` or `-okdir` options, `find` will prompt the user for feedback before running the specified command.