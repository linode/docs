---
slug: find-files-in-linux-using-the-command-line
author:
  name: Linode
  email: docs@linode.com
description: 'Learn how to find files in Linux using the dommand line. You can find examples for the following things: how to find image files, files with specific text, files in the current directory, and much more.'
og_description: 'Learn how to find files in Linux using the command line. You can find examples for the following things: how to find image files, files with specific text, files in the current directory, and much more.'
keywords: ["find command", "linux", "command line"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/tools-reference/tools/filter-file-systems-with-the-find-command/','/tools-reference/tools/find-files-in-linux-using-the-command-line/','/linux-tools/common-commands/find/']
modified: 2020-12-23
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

![Find files in Linux using the command line](find-files-title.jpg "Find Files in Linux using the command line")

## Find Linux Files by Name or Extension
Use `find` from the command line to locate a specific file by name or extension. The following example searches for `*.err` files in the `/home/username/` directory and all sub-directories:

    find /home/username/ -name "*.err"

You should see a similar output in your console:

{{< output >}}
/home/username/example.err
The matching file in the /home/username/ directory is "example.err"
    {{</ output >}}

## Common Linux Find Commands and Syntax

The `find` command usually takes the following form:

    find options starting/path expression

* The `options` attribute controls the behavior and optimization method of the `find` process.
* The `starting/path` attribute defines the top level directory where `find` begins filtering.
* The `expression` attribute controls the tests that search the directory hierarchy to produce output.

## Find a File in Linux Using the Filename

To find a file using the filename, use the syntax `find -name filename`. Omitting the path searches for the file over the entire disk. For example, you can find a file named `example.err` located in your `/home/username` directory with the following command:

    find -name example.err

You should see a similar output:

{{< output >}}

./username/example.err
    {{</ output >}}

## Find a File in Your Current Directory Using the Find Command

Take a look at the example directory structure and files. They are referred to throughout this guide's examples.

{{< output >}}

├── directory_1
│   ├── subdirectory_1
│   │   └── example.err
│   └── example.err
├── directory_2
│   └── example.err
├── directory_3
│   └── example.err
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
└── example.err
    {{</ output >}}

If you are in `directory_1` and you want to find the file `example.err` within the directory or any of its subdirectories, you can issue the following command:

    find . -name example.err

Your output resembles the following:

{{< output >}}
./example.err
./directory_1/example.err
    {{</ output >}}

The output reflects `directory_1` directory structure:

{{< output >}}
├── directory_1
│   ├── subdirectory_1
│   │   └── example.err
│   └── example.err
    {{</ output >}}

## Find Image Files in Linux Using the Command Line

Referencing the file structure in the previous section, there is an image named `image01.png` that is located at the root (`/`)s of the directory structure.

To find the file `image01.png`, run the following `find` command which locates all `.png` files stored inside the `/` directory.

    find -name *.png

You should see a similar output:

{{< output >}}

./image01.png
    {{</ output >}}

Change the image file type and look for any `.jpg` files within the root directory (`/`):

    find -name *.jpg

The output resembles the example. Refer to the example directory structure in the previous section to view the file's location.

{{< output >}}
./web_files/unnamed.jpg
    {{</ output >}}

## Find an Empty File in Your Directory Using the Command Line

To find an empty file in your directory using the command line, issue the following command:

    find . -type f -empty

If no output is returned, then there isn’t an empty file within your current directory.

## Options and Optimizations for Finding Files in Linux Using the Command Line

The default configuration for `find` ignores [symbolic links](/docs/guides/linux-system-administration-basics/#symbolic-links). If you want `find` to follow and return symbolic links, add the `-L` option to the command, as shown below:

    find -O3 -L /var/www/ -name "*.html"

This command enables the maximum optimization level (`-O3`) and allows `find` to follow symbolic links (`-L`). `find` searches the entire directory tree beneath `/var/www/` for files that end with `.html`.

`find` optimizes its filtering strategy to increase performance. Three user-selectable optimization levels are specified as `-O1`, `-O2`, and `-O3`. The `-O1` optimization is the default and forces `find` to filter based on filename before running all other tests.

Optimization at the `-O2` level prioritizes filename filters, as in `-O1`, and then runs all file-type filtering before proceeding with other more resource-intensive conditions. Level `-O3` optimization allows `find` to perform the most severe optimization and reorders all tests based on their relative expense and the likelihood of their success.

| Command     | Description                                                                                               |
|------------:|:----------------------------------------------------------------------------------------------------------|
| `-O1`       | Filter based on filename first (default).                                                                 |
| `-O2`       | File name first, then file-type.                                                                           |
| `-O3`       | Allow `find` to automatically re-order the search based on efficient use of resources and likelihood. of success |
| `-maxdepth X` | Search current directory as well as all sub-directories X levels deep.                                   |
| `-iname`    | Search without regard for text case.                                                                       |
| `-not`      | Return only results that do not match the test case.                                                       |
| `-type f`   | Search for files.                                                                                          |
| `-type d`   | Search for directories.                                                                                    |

## Find Files in Linux by Modification Time Using the Command Line

The `find` command can filter a directory hierarchy based on when a file was last modified. For example, the following command finds any file with the `.err` extension that was modified in the last 7 days:

    find / -name "*err" -mtime -7

The example command returns the following output:

{{< output >}}
/home/username/directory_3/example.err
/home/username/username/example.err
/home/username/username/directory_2/example.err
/home/username/username/directory_1/example.err
/home/username/username/directory_1/subdirectory_1/example.err
    {{</ output >}}

## Use Grep to Find Files in Linux Using the Command Line

The `find` command is only able to filter the directory hierarchy based on a file's name and metadata. If you need to search based on the content of the file, use a tool like [grep](/docs/tools-reference/search-and-filter-text-with-grep). Consider the following example:

    find . -type f -exec grep "test" '{}' \; -print

This command searches every object in the current directory hierarchy (`.`) that is a file (`-type f`) and then runs the command `grep "test"` for every file that satisfies the conditions. The files that match are printed on the screen (`-print`). The curly braces (`{}`) are a placeholder for the find match results. The `{}` are enclosed in single quotes (`'`) to avoid handing `grep` a malformed filename. The `-exec` command is terminated with a semicolon (`;`), which should be escaped (`\;`) to avoid interpretation by the shell.

The file used in the example (`example.err`) has text inside of it that says “test”. When you run the example command, you see a similar output:

{{< output >}}
test
./directory_3/example.err
test
./example.err
test
./directory_2/example.err
test
./directory_1/example.err
test
./directory_1/subdirectory_1/example.err
    {{</ output >}}

Grep identified every file within the current working directory that contains the string “test”.

{{< note >}}

Before the `find` command's implementation of the `-exec` option, you could generate a similar output to the example above using the `xargs` command:

    find . -type f -print | xargs grep "test"

    {{</ note >}}

## Process and Find Files Using the Find Command in Linux

The `-exec` option runs commands against every object that matches the `find` expression. Consider the following example:

    find . -name "example.err" -exec chmod o+r '{}' \;

This filters every object in the current hierarchy (`.`) for files named `rc.conf` and runs the `chmod o+r` command to modify file permissions of the `find` command's results.

The example command runs and executes the `-exec` option in the root directory of the `find` process. Use `-execdir` to execute the specified command in the directory where the match resides. This may alleviate security concerns and produce better performance for some operations.

The `-exec` or `-execdir` options run without further prompts. If you prefer to be prompted before action is taken, replace `-exec` with `-ok` or `-execdir` with `-okdir`.

## How to Find and Delete Files Using the Linux Command Line

{{< caution >}}
Use this option with extreme caution.
{{< /caution >}}

Add the option `-delete` to the end of a match expression to delete all files that match. Use this option when you are certain that the results *only* match the files that you wish to delete.

In the example below, `find` recursively locates all files in the hierarchy starting at the current directory and deletes all files that end with the `.err` extension:

    find . -name "*.err" -delete

{{< community >}}
* [Where are My Files?](https://www.linode.com/community/questions/17057/where-are-my-files)
* [How do I check my server's log files?](https://www.linode.com/community/questions/295/how-do-i-check-my-servers-log-files)
* [Can I check my files through the Linode Manager?](https://www.linode.com/community/questions/11220/can-i-check-my-files-through-linode-manager)
{{< /community >}}
