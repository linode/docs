---
slug: using-xargs-with-examples
description: 'Learn what the xargs command is, how it works, and a few of the many functions it can be used to perform within Linux. '
keywords: ['xarg examples']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-17
modified_by:
  name: Linode
title: "Use the xargs Command"
title_meta: "How to Use the xargs Command in Linux"
external_resources:
- '[The IEEE and Open Group Base Specification](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/xargs.html)'
- '[The GNU organization reference page for `xargs`](https://www.gnu.org/software/findutils/manual/html_node/find_html/Invoking-xargs.html)'
- '[Wikipedia Page on `xargs`](https://en.wikipedia.org/wiki/Xargs)'
authors: ["Jeff Novotny"]
---

The `xargs` command is a handy Linux utility that is used to convert input data into a string of arguments. `xargs`, which is short for "extended arguments", is available on all Linux distributions. Its most common use is to chain commands together. For example, `xargs` can accept standard input from an initial command and convert it into properly formatted arguments for subsequent commands. This guide explains how `xargs` works and when to use it, and provides some examples demonstrating how it is used.

## Linux xargs: An Overview

Linux operating systems have three standard data streams, which are named *stdin*, *stderr*, and *stdout*. The data is handled in the same matter whether it comes from a file, program output, or user input. Stdin is the standard input stream, which accepts text from either the user or a file. Programs or commands send their results to *stdout* while directing any error messages to *stderr*.

In isolation, the relationship of programs, streams, and commands is very simple. However, when one program must send its results to another, it becomes more complicated. Linux provides the *pipe* command, represented by the `|` symbol, to redirect the standard output from one command to a second command. This allows you to "chain" commands together and assemble a command pipeline. For example, you can send the results of the `cat` command to the `grep` commands to search a file for a particular keyword. Only the lines that match the keyword are displayed. For example:

    cat example.com.conf | grep ErrorLog

{{< output >}}
ErrorLog  /var/www/html/example.com/log/error.log
{{< /output >}}

Unfortunately, not all commands accept data from the pipe command as input. Certain commands, such as `cp`, `rm`, and `mkdir`, must receive their input directly as command arguments. This presents a problem for anyone who wants to use them as part of a sequence. The `xargs` command resolves this issue. It accepts piped input from any source, including a file or a command, and converts it into a string. It then calls the target command and provides it with the string, which represents the arguments for the command. This means that the target command receives the arguments in the format it expects. If no target command is specified, `xargs` calls `echo`.

To use the `xargs` command, use the `|` symbol to pipe the results of the initial command to `xargs`. Follow the `xargs` keyword with any optional parameters as well as the target command. In the following example, the results of the `find` command are piped to `args`, which sends this input to `rm` as arguments.

      find /path -type f -name '*.txt' | xargs rm

When `xargs` receives the piped input, it converts it into a list or series of lists. Each list contains one or more elements. The number of elements is constrained by the system limit and the values of the `-n` or `-s` parameters. It invokes the target command once for every list and provides the list as an argument. In the previous example, if `/path` contains `file1.txt` and `file2.txt`, then `xargs` generates the following command:

      rm file1.txt file2.txt

If the `-n` option is given a value of `1`, `xargs` would generate two commands instead. It keeps calling `rm` with only one file until the list of files from `find` is completely consumed.

      rm file1.txt
      rm file2.txt

## Common xargs Use Cases

The most frequent use of `xargs` is to allow a command to act on the output of another command. It is extremely common to see `find` and `xargs` used together to process a long list of files. However, `xargs` has some other handy uses. Many of these cases are covered in more depth in the [How To Use xargs](#how-to-use-xargs) section.

- `xargs` helps you work around maximum argument lengths for commands. For example, certain kernels limit the maximum size of an argument array. Additionally, some commands might impose even more stringent limits on the number of arguments. `xargs` can divide the results of `ls` or `find` into smaller lists and feed these shorter lists to the second command.

- You can use `xargs` in conjunction with the `-P` or `maxprocs` option to run operations in parallel. This allows `xargs` to launch many processes at once, each working on separate data.

- `xargs` allows you to implement command substitution through the use of the `-I` option. In this case, `xargs` replaces all instances of the substitution string with the list of arguments.

- `xargs` can call a shell script that uses `sh`. This allows for a much higher degree of complexity in the target command.

- Certain options allow file names with special characters such as `,` to be processed. Newline characters can also be gracefully handled. Typically the `-print0` option is added to the initial `find` command, while `xargs` is specified using the `-0` option.

- The `xargs` command is frequently a more efficient alternative to `exec` when either option could be used. `exec` runs more slowly due to the way that processes are created.

## xargs Command-Line Options

Calling `xargs` with different command-line options can dramatically change the behavior of the utility. Here is a list of some of the most common options.

- `-0` tells `xargs` to use the null character as a separator instead of separating on newline characters and spaces. It is almost always used together with the `print0` option, which adds a null character to the end of each string that it passes to `xargs`. All characters are accepted literally with no backslash substitutions. This helps deal with unwieldy or non-standard file names. However, it is important to note that not all applications support null-terminated strings. The `--null` flag has the same meaning as `-0`.

- `-a` along with the name of a file reads data from the file rather than standard input.

- `-d` specifies a character to use as a string delimiter. A backslash or escape character such as `\n` might be used instead.

- `-I` followed by a *placeholder string* is used to implement substitutions. Every time the placeholder occurs in the target command, `xargs` replaces it with the data from standard input. In the command `find /path -name '*.txt' | xargs -I % cp % ~/backups`, whenever the `%` symbol occurs in the target `cp` command, `xargs` replaces it with the input from `find`. Multiple substitutions can occur in the same command. This command sets `-L` to `1` and only processes one line at a time.

- `-L` specifies the maximum number of non-blank input lines to use in each list.

- `-n` indicates the maximum number of arguments supplied each time the target command is invoked. The size option `-s` takes precedence over `-n`. If `xargs -n 1` is used with the `find` command, one filename is used in each invocation of the target command.

- `-o` associates the `xargs` command with the input console. This is useful for running `xargs` in an interactive context.

- `-P` is the `maxprocs` option. This causes `xargs` to run up to this many processes simultaneously. The default is `1`, while `0` tells `xargs` to run as many processes as the system allows.

- `-p` prompts the user before running each command. It is a good idea to use this option if the target command is potentially dangerous.

- `-s` specifies the maximum number of characters supplied to each command, including the command itself and any terminating nulls.

- `-t` prints each command that is executed to standard output.

## How To Use xargs

The following examples demonstrate several common use cases for the `xargs` command. In most cases, the `-t` option has been added solely to illustrate the resulting commands.

### Using xargs Without Any Options

The simplest way to use `xargs` is without any options. The following example displays the word count of every file in the current directory. `xargs` converts the `ls` results into a string of arguments for `wc`.

    ls | xargs -t wc

{{< output >}}
wc test1.txt test2.txt
1 10 42 test1.txt
1 10 42 test2.txt
2 20 84 total
{{< /output >}}

### Using xargs and Command Substitution

In the following example, `xargs` calls `cp` once for each `.txt` file in the `/path` directory. When the `%` symbol is encountered in the target command, it is replaced with the name of the file. This allows for the insertion of the filename someplace other than at the end of the entire target command.

    find ./xargstest -type f -name '*.txt' | xargs -t -I % cp -a % ~/backups

{{< output >}}
cp -a ./xargstest/test2.txt /home/user/backups
cp -a ./xargstest/test1.txt /home/user/backups
{{< /output >}}

### Using the `-0` Option to Deal With Complex File Names

In the following example, all directories in the `/path` directory are removed. The combination of the `-print0` option to `find` and the `-0` option for `xargs` handles directory names with spaces or special characters. The `find` command inserts a null character after each entry it finds, while `xargs` uses the null character to distinguish the entries.

    find ./xargstest/test1 -type d -name '*_*' -print0 | xargs -t -0 rmdir

{{< output >}}
rmdir  ./xargstest/test1/test_1 ./xargstest/test1/test_2
{{< /output >}}

### Spawning Multiple Processes

The `-P` option allows a larger number of processes to run simultaneously. The following example unzips four archives at a time. When one of the processes finishes, another one is launched, as long as more zip files remain. The `-L` option must also be used to launch the target commands properly. In the following example, two and only two processes run at any given time. See the documentation from the [*GNU organization*](https://www.gnu.org/software/findutils/manual/html_node/find_html/Controlling-Parallelism.html) for more information.

    find ./xargstest -name '*.zip' | xargs -t  -P 2  -L 1 -I % unzip -u  %

{{< output >}}
unzip -u ./xargstest/test4.zip
unzip -u ./xargstest/test5.zip
Archive:  ./xargstest/test4.zip
unzip -u ./xargstest/test2.zip
Archive:  ./xargstest/test5.zip
unzip -u ./xargstest/test1.zip
Archive:  ./xargstest/test2.zip
unzip -u ./xargstest/test3.zip
Archive:  ./xargstest/test1.zip
Archive:  ./xargstest/test3.zip
{{< /output >}}

### Invoke xargs to a Shell Script

If the target command is complex or several commands must be executed, an elegant trick is to use `sh` as the target command. This feeds the results as input to the shell script. Command substitution can be used to translate the input data into the proper sequence. In this case, the shell runs the word count program on each text file and then copies it to the `/archive` directory. Additional information on using `xargs` to call `sh` can be found on the [*GNU site*](https://www.gnu.org/software/findutils/manual/html_node/find_html/Invoking-the-shell-from-xargs.html).

    ls *.txt* | xargs  -t -I %  sh -c 'wc %; cp % archive'

{{< output >}}
sh -c 'wc test1.txt; cp test1.txt archive'
1 10 42 test1.txt
sh -c 'wc test2.txt; cp test2.txt archive'
1 10 42 test2.txt
{{< /output >}}

### Call a Command Using a Subset of the Results

The `-n` option limits the number of arguments `xargs` sends to the target command, while the `-L` option selects many lines. If `-n` is set to `1`, then the command only selects the next entry. In the following example, `xargs` takes the next two text files from the `find` command and sends them to `diff` for a comparison.

    find ./xargstest/archive  -type f -name '*.txt*'  -print0 | xargs  -0 -t -n 2 diff

{{< output >}}
diff ./xargstest/archive/test2.txt ./xargstest/archive/test1.txt
1c1
< this is test 1. It has a number of words.
---

> this is test 1. It has a number of words and more.
{{< /output >}}

If `n` were set to `1`, the command would `diff` the file against its parent. In some cases, the `-L 1` option could also be used to achieve the same results.

- The `-n` option enables an efficient method of copying files to multiple directories at the same time.
- The `echo` command passes in a list of destination directories to `xargs`, while the target command describes the specific details of the `cp` command.
- Adding the `-n 1` option instructs `xargs` to pass in each destination directory one at a time.

The following example copies each text file in the current directory sequentially to `archive` and `backup`.

    echo ~/xargstest/archive/ ~/xargstest/backup/ | xargs -t -n 1 cp -v ./*.txt

{{< output >}}
cp -v ./test1.txt ./test2.txt /home/user/xargstest/archive/
'./test1.txt' -> '/home/user/xargstest/archive/test1.txt'
'./test2.txt' -> '/home/user/xargstest/archive/test2.txt'
cp -v ./test1.txt ./test2.txt /home/user/xargstest/backup/
'./test1.txt' -> '/home/user/xargstest/backup/test1.txt'
'./test2.txt' -> '/home/user/xargstest/backup/test2.txt'
{{< /output >}}

### Use xargs Debug Options

The  `-p` and `-t` options are used to debug `xargs` commands. The `-t` option prints the full command line to the standard error output before running it. The `-p` option prints each command, and prompts the user to enter `y` or`Y` before executing it. The following command prompts you to approve each potential delete operation before `rm` does anything.

    find ./xargstest/archive -type f -print0 | xargs -0 -n 1 -p rm

{{< output >}}
rm ./xargstest/archive/test2.txt ?...y
rm ./xargstest/archive/test1.txt ?...y
{{< /output >}}
