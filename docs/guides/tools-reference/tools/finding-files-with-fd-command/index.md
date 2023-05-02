---
slug: finding-files-with-fd-command
description: 'This guide shows you how to install and use the fd tool on a Linux system. fd is a user-friendly alternative to the find command.'
keywords: ['fd linux command','find command linux','alternative to find','linux fd']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-05
modified_by:
  name: Linode
title: "Find Files With the fd Command"
title_meta: "How to Find Files With the fd Command"
external_resources:
- '[fd GitHub page](https://github.com/sharkdp/fd)'
authors: ["Jeff Novotny"]
---

Linux users typically rely upon the built-in [`find` command](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/find.html) to locate files and directories on their system. It provides a large number of powerful and useful options, but its default behavior often fails to provide intuitive results. The free open-source [*fd*](https://github.com/sharkdp/fd) utility provides a user-friendly alternative to the `find` command. It is more efficient and easier to use, with default behavior that is better suited for the majority of searches. This guide compares the `find` and `fd` commands and explains how to use and install the `fd` command on Linux systems.

## An Introduction to fd

As with the `find` command, the `fd` command allows users to find entries in their filesystem. The basic syntax for the command is `fd <search_pattern>`. Rather than being a complete replacement for find, fd focuses on simplicity, performance, and ease of use.

The `fd` command does not support every option that the `find` command does. However, it has a more intuitive syntax with sensible defaults, so users do not usually have to append additional options. For instance, a search in `fd` is only case sensitive if a capital letter is included in the search term. Otherwise, the search is case insensitive.

According to rigorous benchmark testing on Linux systems, fd generates results much more quickly than find does. It often takes only one-tenth as long to execute the same search and return the same results. fd achieves better performance due to its parallel tree traversal along with improved regex and ignore algorithms.

## Key Differences Between fd vs find

Because the `fd` command has been optimized for everyday use, it behaves differently than `find` in certain situations. Here are some of the main differences between the two commands:

- By default, fd searches are based on directory name or filename. The `-name` or `-iname` options are not required, as they are often used when using the `find` command.
- Support for regular expressions is tightly integrated into fd.
- fd uses color output to highlight file types similar to the `ls` command.
- fd supports parallel command execution.
- Searches in fd are usually case-insensitive, but become case sensitive if a capital letter is included in the search term. The `find` command uses the `-iname` option to control this behavior.
- Default fd searches ignore hidden files and directories, as well as any patterns listed in the `.gitignore` file.

## Install fd

The `fd` command is available as part of the default packages on most Linux distributions. Instructions for the most common systems are as follows.

### Ubuntu / Debian

For release 19.04 and higher of Ubuntu, the fd application is available through APT. Ubuntu already has a package named `fd`, so the `fd` binary is referred to as `fdfind`. An alias must be added to use the `fd` command.

{{< note respectIndent=false >}}
For information on installing fd on earlier releases of Ubuntu, see [*the fd GitHub page*](https://github.com/sharkdp/fd#installation).
{{< /note >}}

1. Install fd using APT.

    {{< note respectIndent=false >}}
Use `apt-get` in place of `apt` on Debian distributions.
    {{< /note >}}

        sudo apt install fd-find

1. (**Optional**) Create an alias for `fd` that refers to `fdfind`. To start using the `fd` command immediately, use the `alias` command.

        alias fd=fdfind

1. (**Optional**) Add this entry to the `bashrc` file to make the alias permanent.

    {{< file "~/.bashrc" >}}
alias fd=fdfind
    {{< /file >}}

### RHEL Derivatives

On Red Hat-based distributions, fd can be installed using DNF. There is no requirement to create an alias.

    dnf install fd-find

{{< output >}}
...
Installed:
  fd-find-8.1.1-3.fc33.x86_64

Complete!
{{< /output >}}

### Arch

On the Arch Linux distribution, the fd package can be installed from the official "pacman" repository.

    pacman -S fd

### Alpine

On the Alpine distribution, the fd package can be installed using apk.

    apk add fd

{{< note respectIndent=false >}}
The `fd` command can also be installed on macOS using Homebrew. Use the command `brew install fd`. For instructions on downloading, installing, and using Homebrew, see the [Homebrew webpage](https://brew.sh/).
{{< /note >}}

## How to Use fd

The `fd` command is very useful on its own but can be made even more useful by adding regular expressions and command options.

To see all of the available flags and options, along with usage instructions, use `fd -h`. The `fd --help` command provides even more detail about each option.

    fd -h

{{< output >}}
fd 7.4.0

USAGE:
    fd [FLAGS/OPTIONS] [<pattern>] [<path>...]

FLAGS:
    -H, --hidden            Search hidden files and directories
...
    -V, --version           Prints version information

OPTIONS:
    -d, --max-depth <depth>            Set maximum search depth (default: none)
...
    -S, --size <size>...               Limit results based on the size of files.
        --changed-within <date|dur>    Filter by file modification time (newer than)
        --changed-before <date|dur>    Filter by file modification time (older than)

ARGS:
    <pattern>    the search pattern: a regular expression unless '--glob' is used (optional)
    <path>...    the root directory for the filesystem search (optional)

Note: `fd -h` prints a short overview while `fd --help` gives all details.
{{< /output >}}

### Basic Search Functionality

If fd is used without any arguments, it recursively displays all files and directories in the current working directory. This is very similar to the behavior of the `ls -r` command. However, `fd` is typically used with a parameter specifying the search pattern.

Use `fd <search_pattern>` to find all entries in the current directory that match the search pattern. An entry is considered to be a match if its name contains the search pattern. The command searches all subdirectories recursively, so it also displays any matching entries in any directory that has the current directory in its path.

    fd backup

{{< output >}}
accounts/payroll/backup_file.sql
accounts/payroll/backup_files.sql
backup
backup/accounts/payroll/backup_file.sql
backup/accounts/payroll/backup_files.sql
mysqlbackup
mysqlbackup/backup_file.sql
mysqlbackup/backup_files.sql
wpbackup
{{< /output >}}

To search in a specific directory other than the current one, provide the full path of the directory as the second argument. The command pattern for this type of search is `fd <search_pattern> <target_dir>`.

    fd backup /usr

{{< output >}}
/usr/lib/mysql/plugin/component_mysqlbackup.so
...
/usr/src/linux-headers-5.4.0-86-generic/include/config/net/team/mode/activebackup.h
{{< /output >}}

To list all files in a specific directory, use the wild card symbol `.` as the search pattern.

    fd . ~/wpbackup/public_html/wp-content/themes/twentytwentyone

### Advanced Search Features

The `fd` command also allows searches based on regular expressions, file extensions, exact file names, and hidden files.

Technically, every fd search uses regular expressions. However, the search pattern can be specified in a regex format. The following search looks for entries starting with an `m` and containing the substring `back` at any other position. For more information on the regular expression syntax, consult the [regex documentation](https://docs.rs/regex/1.0.0/regex/).

    fd '^m.*back.*$'

{{< output >}}
mysqlbackup
{{< /output >}}

The `fd` command can be used with the `-e` option to find files with a particular extension. In the example below, the command finds all SQL files.

    fd -e sql

{{< output >}}
accounts/payroll/backup_file.sql
...
mysqlbackup/customer_file.sql
{{< /output >}}

Typically, fd works in regexp mode and parses the search term as a regular expression. However, adding the `-g` option forces `fd` to perform a glob-based search. This causes it to only display entries that exactly match the search term. In the following search, the `backup` directory matches, but `wpbackup` does not perfectly match and is not listed.

    fd -g backup

{{< output >}}
backup
{{< /output >}}

Without any options, `fd` skips over hidden files and directories. These are entries that have names beginning with the `.` character. However, adding the `-H` option causes `fd` to include these entries in its search.

    fd -H bash

{{< output >}}
.bash_history
.bash_logout
.bashrc
{{< /output >}}

The `-x` option allows the results to be piped to another command. This is referred to as *command execution*. The format of the command is `fd <search_term> -x <command_to_execute>`. For instance, `fd -e txt -x vim` opens each file that matches the search criteria in Vim. To launch the command only once with the list of the files as a string of arguments, use `-X` instead. The `{}` token represents a placeholder for the filename in the target command. This allows for the execution of more complex commands. Consult the [fd documentation](https://github.com/sharkdp/fd) for a full list of all placeholders.

In the following example, a backup copy is made of each `txt` file found by `fd`. The new file has the same name as the old file with `.bak` appended to the end. The `-x` option invokes the command for each matching entry.

    fd -e txt -x cp {} {}.bak

For a full list of options, use `fd --help` or consult the [fd GitHub page](https://github.com/sharkdp/fd). Here are a few more options that might be useful:

- To search for a match on the full path of the file, as opposed to only the filename, use `fd -p`.
- The `-I` option includes both hidden files and those that match a pattern in the `.gitignore` directory.
- `-E <exclude_string>` excludes all entries matching the excluded string.
- `-s` is used to force `fd` to perform a case-sensitive search.
- The `-t <filetype>` option is used to filter entries by entry type. Some common types are `f` for file, `d` for the directory, `l` for symlink, and `x` for executable.
- The `-d` option is used to set the maximum search depth in terms of the number of levels of subdirectories.

### Using fd With Other Programs

Because fd supports command execution, users can easily integrate other programs. For example, the output from fd can be piped to the as-tree program and represented in tree format. This is usually more useful than running the Linux `tree` command because `fd` has already pre-processed which files to display. To use the two programs together, run the following command.

    fd backup | as-tree

{{< output >}}
.
├── accounts/payroll
│   ├── backup_file.sql
│   └── backup_files.sql
├── backup/accounts/payroll
│   ├── backup_file.sql
│   └── backup_files.sql
├── mysqlbackup
│   ├── backup_file.sql
│   └── backup_files.sql
└── wpbackup
{{< /output >}}

For information on installing and using as-tree, consult the [*as-tree GitHub page*](https://github.com/jez/as-tree).

The [fd documentation](https://github.com/sharkdp/fd) also explains how fd can be used in conjunction with Emacs, the fzf fuzzy finder, and the menu builder rofi.

## Conclusion

The `fd` command for Linux is an alternative to the built-in `find` command that is more intuitive and easier to use. fd runs more quickly and has intelligent defaults that align with the needs of most users. It can be installed on most Linux distributions and is usually part of the default package.

`fd` is not able to do everything the `find` command does, but it has a large number of options that allow users to refine their searches. By default, fd ignores hidden files and is case sensitive only when a capital letter is included in the search term. fd uses regular expressions in its searches, and has powerful regexp capabilities. The `fd` command also supports command execution, which allows the search results to serve as input for another program or command.
