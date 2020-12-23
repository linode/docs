---
slug: find-files-in-linux-using-the-command-line
author:
  name: Linode
  email: docs@linode.com
description: 'Learn how to find files in Linux using the Command line. Examples of how to find image files, files with specific text, files in the current directory, and much more.'
keywords: ["find command", "linux", "command line"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/tools-reference/tools/filter-file-systems-with-the-find-command/','/tools-reference/tools/find-files-in-linux-using-the-command-line/','/linux-tools/common-commands/find/']
modified: 2016-09-15
modified_by:
  name: Edward Angert
published: 2010-10-25
title: How to Find Files in Linux Using the Command Line
external_resources:
- '[Online man Pages](http://man7.org/linux/man-pages/man1/find.1.html)'
- '[ExplainShell](http://explainshell.com/explain/1/find)'
tags: ["linux"]
---

`find` is a command for recursively filtering objects in the file system based on a simple conditional mechanism. Use `find` to search for a file or directory on your file system. Using the `-exec` flag, files can be found and immediately [processed within the same command](#how-to-find-and-process-files-using-the-find-command).

![Find Files in Linux using the command line](find-files-title.jpg "Find Files in Linux using the command line")

## Find Linux Files by Name or Extension
Use `find` from the command line to locate a specific file by name or extension.
The following example searches for `*.err` files in the `/home/username/` directory and all sub-directories:

    find /home/username/ -name "*.err"

You should see an output like below in your console:

    /home/username/y231.err
    The matching file in the /home/username/ directory is "y231.err"

## Common Linux Find Commands and Syntax

The `find` command usually takes the following form:

    find options starting/path expression

* The `options` attribute will control the behavior and optimization method of the `find` process.
* The `starting/path` attribute will define the top level directory where `find` begins filtering.
* The `expression` attribute controls the tests that search the directory hierarchy to produce output.

## Find a file in Linux using the filename

To find a file using the filename, use the syntax `find -name filename`. To illustrate this, let’s find a file named “y231.err” in our /username/ directory by searching over the entire disk:

    find -name y231.err

You should see an output like this:

    ./username/y231.err

## Find a file in your current directory using  find command 

Look at the directory structure and files in it below:

    ├── directory_1
    │   ├── subdirectory_1
    │   │   └── y231.err
    │   └── y231.err
    ├── directory_2
    │   └── y231.err
    ├── directory_3
    │   └── y231.err
    ├── image01.png
    ├── web_files
    │   ├── app.html
    │   ├── cb=gapi.loaded_0
    │   ├── edit.html
    │   ├── m=_b,_tp
    │   ├── rs=AA2YrTtgyE1yYXiu-GuLS6sbJdYr0u8VBQ
    │   ├── rs=AA2YrTvod91nzEJFOvvfJUrn6_vLwwY0bw
    │   ├── saved_resource.html
    │   ├── single.html
    │   └── unnamed.jpg
    ├── web.html
    └── y231.err

Let’s say we are in directory_1 and we want to find the file `y231.err` in it. To only find those that are inside directory_1 and its subdirectories (e.g. subdirectory_1), run the following command:

    find . -name y231.err

You should see an output like below:

    ./y231.err
    ./directory_1/y231.err

The output reflects what we see in our directory structure:

    ├── directory_1
    │   ├── subdirectory_1
    │   │   └── y231.err
    │   └── y231.err

## Find image files in Linux using Command line

Referencing the file structure in the above example, there is an image image01.png, located at /.

To find the file image01.png, run the following find command that finds all .png files located inside /.

    find -name *.png

You should see an output like this:

    ./image01.png

Change the image file type and look for any jpg files here by using the command:

    find -name *.jpg

This generates an output like below. Refer to the file structure tree diagram above to locate the file:

    ./web_files/unnamed.jpg 

## Find an empty file in your directory using command line

To find an empty file in your directory using command line, use the following command:

    find . -type f -empty

If you see no output, then there isn’t an empty file within your directory.

## Options and optimizations for finding files in Linux using command line

The default configuration for `find` will ignore symbolic links (shortcut files). If you want `find` to follow and return symbolic links, you can add the `-L` option to the command, as shown below:

    find -O3 -L /var/www/ -name "*.html"

This command enables the maximum optimization level (-O3) and allows `find` to follow symbolic links (`-L`). `find` searches the entire directory tree beneath `/var/www/` for files that end with `.html`.

`find` optimizes its filtering strategy to increase performance. Three user-selectable optimization levels are specified as `-O1`, `-O2`, and `-O3`. The `-O1` optimization is the default and forces `find` to filter based on filename before running all other tests.

Optimization at the `-O2` level prioritizes file name filters, as in `-O1`, and then runs all file-type filtering before proceeding with other more resource-intensive conditions. Level `-O3` optimization allows `find` to perform the most severe optimization and reorders all tests based on their relative expense and the likelihood of their success.

| Command     | Description                                                                                               |
|------------:|:----------------------------------------------------------------------------------------------------------|
| `-O1`       | (Default) filter based on file name first.                                                                 |
| `-O2`       | File name first, then file-type.                                                                           |
| `-O3`       | Allow `find` to automatically re-order the search based on efficient use of resources and likelihood. of success |
| `-maxdepth X` | Search current directory as well as all sub-directories X levels deep.                                   |
| `-iname`    | Search without regard for text case.                                                                       |
| `-not`      | Return only results that do not match the test case.                                                       |
| `-type f`   | Search for files.                                                                                          |
| `-type d`   | Search for directories.                                                                                    |

## Find files in Linux by modification time using command line

The `find` command contains the ability to filter a directory hierarchy based on when the file with extension .err was last modified:

    find / -name "*err" -mtime -7

This command displays all files that were modified in the last 7 days:

    /home/username/directory_3/y231.err 
    /home/username/username/y231.err 
    /home/username/username/directory_2/y231.err
    /home/username/username/directory_1/y231.err 
    /home/username/username/directory_1/subdirectory_1/y231.err 

## Use Grep to find files in Linux using command line

The `find` command is only able to filter the directory hierarchy based on a file's name and meta data. If you need to search based on the content of the file, use a tool like [grep](/docs/tools-reference/search-and-filter-text-with-grep). Consider the following example:

    find . -type f -exec grep "test" '{}' \; -print

The file used in our example (y231.err) has a text inside of it that says “test”. When you run the command above, you should see an output like below:

    test 
    ./directory_3/y231.err  
    test 
    ./y231.err 
    test 
    ./directory_2/y231.err 
    test 
    ./directory_1/y231.err 
    test 
    ./directory_1/subdirectory_1/y231.err 

Grep identified every file within our current working directory that has “test” in it.

This searches every object in the current directory hierarchy (.) that is a file (`-type f`) and then runs the command grep "test" for every file that satisfies the conditions. The files that match are printed on the screen (`-print`). The curly braces ({}) are a placeholder for the find match results. The {} are enclosed in single quotes (') to avoid handing grep a malformed file name. The `-exec` command is terminated with a semicolon (;), which should be escaped (\;) to avoid interpretation by the shell. 

Before the implementation of the `-exec` option, this kind of command might have used the xargs command to generate a similar output:

    find . -type f -print | xargs grep "test"

## Process and find files using the find command in Linux 

The `-exec` option runs commands against every object that matches the find expression. Consider the following example:

    find . -name "y231.err" -exec chmod o+r '{}' \;

This filters every object in the current hierarchy (`.`) for files named `rc.conf` and runs the `chmod o+r` command to modify file permissions of the `find` results.

The commands run with the `-exec` are executed in the root directory of the `find` process. Use `-execdir` to execute the specified command in the directory where the match resides. This may alleviate security concerns and produce more desirable performance for some operations.

The `-exec` or `-execdir` options run without further prompts. If you prefer to be prompted before action is taken, replace `-exec` with `-ok` or `-execdir` with `-okdir`.

## How to Find and Delete Files in the Linux Command Line

{{< caution >}}
Use this option with extreme caution.
{{< /caution >}}

Add the option `-delete` to the end of a match expression to delete all files that match. Use this option when you are certain that the results *only* match the files that you wish to delete.

In the following example, `find` locates all files in the hierarchy starting at the current directory and fully recursing into the directory tree. In this example, `find` will delete all files that end with the characters `.err`:

    find . -name "*.err" -delete

{{< community >}}
* [Where are My Files?](https://www.linode.com/community/questions/17057/where-are-my-files)
* [How do I check my server's log files?](https://www.linode.com/community/questions/295/how-do-i-check-my-servers-log-files)
* [Can I check my files through the Linode Manager?](https://www.linode.com/community/questions/11220/can-i-check-my-files-through-linode-manager)
{{< /community >}}
