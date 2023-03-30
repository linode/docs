---
slug: an-intermediate-guide-to-bash-scripting
description: 'In this guide, you will learn more advanced methods of creating complex Bash Scripts to perform common operations frequently used by Linux system administrators.'
keywords: ["shell", "bash", "printf", "script"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-05
modified_by:
  name: Linode
title: 'Continuing with Bash Scripting'
title_meta: 'An Intermediate Guide to Bash Scripting'
external_resources:
  - '[GNU Bash](https://www.gnu.org/software/bash/)'
aliases: ['/development/bash/an-intermediate-guide-to-bash-scripting/']
authors: ["Mihalis Tsoukalos"]
---

In the previous guide of this series, [Getting Started with Bash Scripting](/docs/guides/intro-bash-shell-scripting/), you learned Bash basics, like creating and using variables, getting user input, using environment variables, and more. In this guide, you will build off what you have already learned and put together more complex Bash scripts for common operations used by Linux system administrators like creating interactive Bash scripts with menu options, scripts that generate formatted output of your data, and scripts that work with files and directories. Each section will provide a brief introduction to each concept and commands with a few examples that you can run to better understand its function.

In this guide, you will learn about:

* [Standard Streams](#standard-streams)
* [Creating menus with the select statement](#create-menus-with-the-select-statement)
* [Using the printf command to format the output of your scripts](#introduction-to-the-printf-command)
* [Using file and directory test operators to control the flow of your scripts](#file-and-directory-test-operators)
* [Reading files and searching directories in your scripts](#read-files-and-searching-directories)
* [Bash exit codes](#bash-exit-codes)

## Before You Begin

1. All example scripts in this guide are run from the `bin` directory in the user's home directory, i.e. `/home/username/bin/`. If you do not have a `bin` directory in your home directory, create one and move into the directory:

        cd ~ && mkdir bin && cd bin

1. Verify that the `bin` directory is in your system PATH (i.e. `/home/username/bin`):

        echo $PATH

1. If it is not, add the new `bin` directory to your system's PATH:

        PATH=$PATH:$HOME/bin/

    {{< note respectIndent=false >}}
Ensure all scripts throughout this guide are executable. To add execute permissions to a file, issue the following command:

    chmod +x my-script.sh

{{< /note >}}

## Standard Streams

A *standard stream* is a communication mechanism used between a computer program and its environment. Every UNIX operating system contains three types of standard streams, *standard input* (stdin), *standard output* (stdout), and *standard error* (stderr). These three streams are represented by three files, `/dev/stdin`, `/dev/stdout` and `/dev/stderr`. Since these three files are always open, you can *redirect* their stream to another location. Redirection is when you use the output from one source, a file, program, script, or command and feed it as input to another source. In the context of Bash scripting, you can access stdin, stdout, and stderr using file descriptors `0`, `1`, and `2`, respectively.

### Reading from Standard Input

Bash scripts very often make use of standard input. The example script `input.sh` gets its input from a file, but if the file is not available in the expected location, it tries to read standard input (`/dev/stdin`):

{{< file "input.sh" bash >}}
#!/bin/bash

file=$1

if [[ "$file" == "" || (! -f "$file") ]]
then
    echo Using standard input!
    file="/dev/stdin"
fi

while read -r line
do
    echo "$line"
done < "${file}"
{{< /file >}}

* The script reads the first value passed as a command line argument, represented by `$1`. If a text file is passed, the script will read and output each line of text.
* If a no command line argument is passed or if the file does not exist, standard input (`/dev/stdin`) is used instead. This will prompt you to enter text and will output to the terminal screen what is received as input. To signal the end of your stdin input type **CTRL+D**

1. Using your preferred text editor create an example file for the `input.sh` script to read:

        echo -e 'Ultimately, literature is nothing but carpentry. \nWith both you are working with reality, a material just as hard as wood.' > marquez.txt

1. Run the script and pass `marquez.txt` as a command line argument:

        ./input.sh marquez.txt

    {{< output >}}
Ultimately, literature is nothing but carpentry.
With both you are working with reality, a material just as hard as wood.
    {{</ output >}}

1. Run the script without a command line argument:

        ./input.sh

    Enter some text after the prompt followed by *enter* and you will see it echoed back to you in the terminal. Use **CTRL+D** to end the script.

## Create Menus with the Select Statement

You can use the `select` statement to create menu systems in your bash scripts that users can interact with. When you combine `select` with the `case` statement you can create more sophisticated menu options. This section will provide three examples that use `select` to create menus. If you are not familiar with the `case` statement, you can refer to our [Getting Started with Bash Shell Scripting](/docs/guides/intro-bash-shell-scripting/#the-case-statement) guide.

The general format for the `select` statement is the following:

{{< file bash>}}
select WORD [in LIST];
do COMMANDS;
done
{{</ file >}}

### Create a Basic Menu

The `simple-menu.sh` script expands on the skeleton example to create a basic menu that will prompt the user for their favorite color, print out the value of any valid menu selection, and then break out of the select statement:

{{< file "simple-menu.sh">}}
#!/bin/bash

echo "Enter the number corresponding to your favorite color:"

select COLOR in blue yellow red green
do
    echo "Your selection is: $COLOR"
    break
done
{{</ file >}}

1. Copy and paste the contents of `simple-menu.sh` into a new file and save it.

1. Run the script:

        ./simple-menu.sh

    Your output will resemble the following, but may vary depending on the menu selection you make:

    {{< output >}}
Enter the number corresponding to your favorite color:
1) blue
2) yellow
3) red
4) green
#? 2
Your selection is: yellow
    {{</ output >}}

### Create a Menu Using the Case Statement
The second example script, `computing-terms.sh`, improves on the previous example script by using the `case` statement and by explicitly providing a way for the user to exit the script. By adding a `case` for each selection, the script can execute separate tasks based on what the user selects. The reserved Bash variable `PS3` is reserved for use with `select` statements to provide a custom prompt to the user. This script will prompt you to select one of a series of cloud related terms and return its corresponding definition when selected.

{{< file "computing-terms.sh">}}
#!/bin/bash

echo "This script shows you how to create select menus in your Bash scripts"
echo "Enter a number corresponding to the term whose definition you'd like to view"
PS3="My selection is:"

select TERM in cloud-computing virtual-machine object-storage exit;
do
    case $TERM in
        cloud-computing)
            echo "Cloud Computing: A combined system of remote servers, hosted on the internet, to store, manage, and process data."
            ;;
        virtual-machine)
            echo "Virtual Machine: The emulating of a computer system, such that a single piece of hardware can deploy and manage a number of host environments, by providing the functionality of physical hardware."
            ;;
        object-storage)
            echo "Object Storage: stores data, called objects, in containers, called buckets, and each object is given a unique identifier with which it is accessed."
            ;;
        exit)
            echo "You are now exiting this script."
                break
                ;;
        *)
            echo "Please make a selection from the provided options."
    esac
done
{{</ file >}}

1. Copy and paste the contents of `computing-terms.sh` into a new file and save it.

1. Run the script:

        ./computing-terms.sh

    Your output will resemble the following, but may vary depending on the menu selection you make:

    {{< output >}}
This script shows you how to create select menus in your Bash scripts
Enter a number corresponding to the term whose definition you'd like to view
1) cloud-computing
2) virtual-machine
3) object-storage
4) exit
My selection is:3
Object Storage: stores data, called objects, in containers, called buckets, and each object is given a unique identifier with which it is accessed.
My selection is:4
You are now exiting this script.
    {{</ output >}}

### Create a Menu that Includes a Submenu

The third example, `submenu.sh`, uses all the previously covered concepts and enhances them by adding a submenu with a new series of options for the user to select. The script will read all files in the current working directory and display them to the user as selectable options. Once the user selects a file, a submenu will appear prompting the user to select an action to perform on the previously selected file. The submenu allows a user to delete a file, to display the file's contents, or to simply exit the script.

{{< file "submenu.sh" bash >}}
#!/bin/bash

echo "Use this script to manipulate files in your current working directory:"
echo "----------------------------------------------------------------------"
echo "Here is a list of all your files. Select a file to access all"
echo "available file actions:"

select FILE in * exit;
do
    case $FILE in
    exit)
        echo "Exiting script ..."
        break
        ;;
    *)
        select ACTION in delete view exit;
        do
            case $ACTION in
            delete)
                echo "You've chose to delete your file" "$FILE"
                rm -i "$FILE"
                echo "File ""$FILE" "has been deleted"
                echo "Exiting script ..."
                break
                ;;
            view)
                echo "Your selected file's contents will be printed to the terminal:"
                cat "$FILE"
                echo "------------------------"
                echo "Exiting script ..."
                break
                ;;
            exit)
                echo "Exiting script ..."
                break
                ;;
            esac
        done
        break
        ;;
    esac
done
{{</ file >}}

1. Copy and paste the contents of `submenu.sh` into a new file and save it.

1. Run the script:

        ./submenu.sh

    {{< note respectIndent=false >}}
Ensure that the directory you are executing your script from contains at least one file in order to run through the full demo of the `submenu.sh` script.
    {{< /note >}}

    Your output will resemble the following, but may vary depending on the menu selection you make:

    {{< output >}}
Use this script to manipulate files in your current working directory:
----------------------------------------------------------------------
Here is a list of all your files. Select a file to access all
available file actions:
1) example-file-1.txt
2) example-file-2.txt
3) exit
#? 2
1) delete
2) view
3) exit
#? 2
Your selected file's contents will be printed to the terminal:
Lorem ipsum lorem ipsum
------------------------
Script is exiting ...
    {{</ output >}}

## Introduction to the printf Command

The bash scripting language supports the `printf` command, which allows you to customize the terminal output of your scripts. Its roots are in the C programming language. You can read about C's `printf` function by accessing your operating system's manual pages with the following command: `man 3 printf`.

The general syntax for `printf` is a *format string* followed by *arguments* that will be first modified by the defined format and then inserted into the final output. A format string specifies where and how data will be output by `printf`.

    printf FORMAT [ARGUMENT]...

You can use variables as arguments to your `printf` commands. This is a powerful way to write dynamic scripts that will display varied output based on variable values. For example, the following `printf` command will format your output by adding line breaks, defining an output color, and replacing part of the format string with the argument's variable value. `$PWD` is an environment variable that stores your current working directory.

    printf "Your current working directory is: \x1b[32m\n %s\n" $PWD

{{< output "bash" >}}
Your current working directory is:
 /home/user
{{</ output >}}

### Format Strings

Format strings accept regular characters, which are unchanged in their output and *format specifiers*, which define where and how a string will be presented in the output.

Below is a list of common format specifiers:

* `%s`: formatting an argument as a string

        printf "%s\n" $OSTYPE
    {{< output >}}
linux-gnu
    {{</ output >}}

* `%d`: printing a value as an integer

        printf "%d\n" "0xF9"
    {{< output >}}
249
    {{</ output >}}

* `%x`: printing a value as a hexadecimal number with lower case `a-f`. You could similarly use an upper case `X` to print the hexadecimal value with upper case `A-F`

        printf "%x\n" "2000000"
    {{< output >}}
1e8480
    {{</ output >}}

* `%f`: printing floating point values

        printf "%f\n" "0.01" "0.99"

    {{< output >}}
0.010000
0.990000
    {{</ output >}}

{{< note respectIndent=false >}}
The `-v var` option causes the output of `printf` to be assigned to a variable instead of being printed to the standard output. In the example below, the result of the `printf` format specifier and argument will be stored in a variable named `myvar`. To view the result, the example echoes the value of `$myvar`.

    printf -v myvar "%d\n" "0xF9"
    echo $myvar

{{< output >}}
249
{{</ output >}}
{{< /note >}}

### Use printf in a Script

The example script below makes use of `printf` to create a readable and nicely formatted report of various sequences of numbers. A `for` loop is used with the `seq` command to generate the number sequence, while each printf statement uses different format specifiers to provide slightly varying information from each number sequence. Below is a list of the format specifiers used in the script that have not yet been covered:

* `%04d` tells `printf` to print a decimal number using up to 4 digits. If the number has fewer digits, zeros will be added to the front of the number to fulfill the criteria.
* The `%.10s` format string tells `printf` to print a string using no more than 10 characters; if the string is bigger, the string will be truncated.
*  `\t` and `\n` are used for printing tabs and newlines, respectively.

    {{< file "printf.sh" bash >}}
#!/bin/bash

for i in $( seq 1 10 )
do
    printf "%04d\t" "$i"
done
echo

for i in $( seq 1 10 )
do
    printf "%x\t" "$i"
done
echo

for i in $( seq 1 10 )
do
    printf "%X\t" "$i"
done
echo

for i in $( seq 10 15 )
do
    printf "%04d\t is %X\t in HEX.\n" "$i" "$i"
done

for i in $( seq 5 10 )
do
    printf "%.10s is %X in HEX.\n" "$i............." "$i"
done
{{< /file >}}

1. Copy and paste the contents of `printf.sh` into a new file and save it.

1. Run the script:

        ./printf.sh

    The output of `printf.sh` will resemble the following:

    {{< output >}}
0001	0002	0003	0004	0005	0006	0007	0008	0009	0010
1	2	3	4	5	6	7	8	9	a
1	2	3	4	5	6	7	8	9	A
0010	 is A	 in HEX.
0011	 is B	 in HEX.
0012	 is C	 in HEX.
0013	 is D	 in HEX.
0014	 is E	 in HEX.
0015	 is F	 in HEX.
5......... is 5 in HEX.
6......... is 6 in HEX.
7......... is 7 in HEX.
8......... is 8 in HEX.
9......... is 9 in HEX.
10........ is A in HEX.
    {{< /output >}}

## File and Directory Test Operators

Bash offers file and directory test operators that return a boolean value based on each operator's specific test criteria. These operators can be used in your Bash scripts to present different behaviors depending on the state of a file or directory. A list of all test operators is included in the expandable note, "File and Directory Test Operators" below.

The general format for file and directory test operators is the following:

    test -[OPERATOR] [FILE]

The example below tests if your `/etc/passwd` file exists. If the file exists, you will see `"Yes, it exists!"` printed as output. If the file does not exist, the first part of the command, `test -a /etc/passwd`, will return an exit status of `1` (the exit value will not print as output) and the second part of the command, `echo "Yes, it exists!"`, will not execute.

    test -a /etc/passwd && echo "Yes, it exists!"

{{< note type="secondary" title="File and Directory Test Operators" isCollapsible=true >}}
| Operator | Description |
| -- | -- |
| `-a` | File exists. |
| `-b` | File exists and is a block special file. |
| `-c` | File exists and is a character special file. |
| `-d` | File exists and is a directory. |
| `-e` | File exists and is a file of any type (node, directory, socket, etc.). |
| `-f` | File exists and is a regular file (not a directory or a device file). |
| `-G` | File exists and has the same group as the active user running the bash script. |
| `-h` | Files exists and is a symbolic link. |
| `-g` | Files exists and has the [set group ID flag](/docs/guides/modify-file-permissions-with-chmod/#chmod-command-syntax-and-options) set. |
| `-k` | File exists and has a [sticky bit flag](/docs/guides/modify-file-permissions-with-chmod/#chmod-command-syntax-and-options) set. |
| `-L` | File exists and is a symbolic link. |
| `-N` | File exists and has been modified since it was last read. |
| `-O` | File exists and is owned by the effective user id. |
| `-p` | File exists and is a [pipe](https://stackoverflow.com/questions/40067887/what-is-a-pipe-file). |
| `-r` | File exists and is readable. |
| `-S` | File exists and is socket. |
| `-s` | File exists and has a nonzero size. |
| `-u` | File exists and its [set user ID flag](/docs/guides/modify-file-permissions-with-chmod/#chmod-command-syntax-and-options) is set. |
| `-w` | File exists and is writable by the current user. |
| `-x` | File exists and is executable by the current user. |
{{< /note >}}

### Use File and Directory Test Operators in a Script

The example script, `file-operator.sh`, takes file or directory locations as arguments and returns information about each type of file that is passed to it. The script makes use of file and directory test operators to generate this information. The first `if` statement tests to ensure you have passed the script arguments. The `for` loop then goes on to test if the arguments are files that actually exist and then continues through a series of statements to test the file or directory for other criteria.

{{< note >}}
You can use `[]` and `[[]]` commands instead of using the `if` conditional statement to create file conditions. The script makes use of this format on lines 26 - 40.
{{< /note >}}

{{< file "file-operator.sh" bash >}}
#!/bin/bash

if [[ $# -le 0 ]]
then
    echo "You did not pass any files as arguments to the script."
    echo "Usage:" "$0" "my-file-1 my-file-2"
    exit
fi

for arg in "$@"
do
    # Does it actually exist?
    if [[ ! -e "$arg" ]]
    then
        echo "* Skipping ${arg}"
        continue
    fi

    # Is it a regular file?
    if [ -f "$arg" ]
    then
        echo "* $arg is a regular file!"
    else
        echo "* $arg is not a regular file!"
    fi

    [ -b "$arg" ] && echo "* $arg is a block device."
    [ -d "$arg" ] && echo "* $arg is a directory."
    [ ! -d "$arg" ] && echo "* $arg is not a directory."

    [ -x "$arg" ] && echo "* $arg is executable."
    [ ! -x "$arg" ] && echo "* $arg is not executable."

    [[ -h "$arg" ]] && echo "* $arg is a symbolic link."
    [ ! -h "$arg" ] && echo "* $arg is not a symbolic link."

    [[ -s "$arg" ]] && echo "* $arg has nonzero size."
    [ ! -s "$arg" ] && echo "* $arg has zero size."

    [[ -r "$arg" && -d "$arg" ]] && echo "* $arg is a readable directory."
    [[ -r "$arg" && -f "$arg" ]] && echo "* $arg is a readable regular file."
done
{{< /file >}}

1. Copy and paste the contents of `file-operator.sh` into a new file and save it.

1. Run the script and pass it a file location as an argument:

        ./file-operator.sh /dev/fd/2

    Your output will resemble the following:

    {{< output >}}
* /dev/fd/2 is not a regular file!
* /dev/fd/2 is not a directory.
* /dev/fd/2 is not executable.
* /dev/fd/2 is not a symbolic link.
* /dev/fd/2 has zero size.
    {{< /output >}}

1. Run the script and pass it a directory location as an argument:

        ./file-operator.sh /var/log

    Your output will resemble the following:

    {{< output >}}
* /var/log is not a regular file!
* /var/log is a directory.
* /var/log is executable.
* /var/log is not a symbolic link.
* /var/log has nonzero size.
* /var/log is a readable directory.
    {{< /output >}}

## Read Files and Searching Directories

This section will present a few utility scripts that can be adopted and expanded on to perform common operations on files and directories, like reading the contents of a text file by line, word, or character. These scripts make use of several of the concepts and techniques covered in this guide and in the [Getting Started with Bash Shell Scripting](/docs/guides/intro-bash-shell-scripting/) guide.

### Read a File Line by Line

The example file, `line-by-line.sh`, expects a file passed to it as an argument. It will then read the contents of the file line by line. The `IFS` variable (internal field separator) is a built-in Bash variable that defines how Bash recognizes word boundaries when splitting words. The script sets `IFS` to the null string to preserve leading and trailing white space within your text file.

{{< file "line-by-line.sh" bash >}}
#!/bin/bash

if [[ $# -le 0 ]]
then
    echo "You did not pass any files as arguments to the script."
    echo "Usage:" "$0" "my-file"
    exit
fi

file=$1

if [ ! -f "$file" ]
then
    echo "File does not exist!"
fi

while IFS='' read -r line || [[ -n "$line" ]]; do
    echo "$line"
done < "${file}"
{{< /file >}}

1. Copy and paste the contents of `line-by-line.sh` into a new file and save it.

1. Create an example file for the `line-by-line.sh` script to read. The leading whitespace in the example file is intentional.

        echo -e '     Ultimately, literature is nothing but carpentry. With both you are working with reality, a material just as hard as wood.' > marquez.txt

1. Run the script and pass it a file location as an argument:

        ./line-by-line.sh marquez.txt

    Your output will resemble the following:

    {{< output >}}
     Ultimately, literature is nothing but carpentry. With both you are working with reality, a material just as hard as wood.
    {{< /output >}}

### Read a File Word by Word

The example bash script, `word-by-word.sh` expects a file to be passed as an argument. It will run checks to ensure an argument has been passed to the script and that it is a file. It then uses a for loop with the `cat` command to echo each word in the file to your output. The default value of the `IFS` variable separates a line into words, so in this case there is no need to change its value.

{{< file "word-by-word.sh" bash >}}
#!/bin/bash

if [[ $# -le 0 ]]
then
    echo "You did not pass any files as arguments to the script."
    echo "Usage:" "$0" "my-file"
    exit
fi

file=$1

if [ ! -f "$file" ]
then
    echo "File does not exist!"
fi

for word in $(cat "${file}")
do
    echo "$word"
done
{{< /file >}}

1. Copy and paste the contents of `word-by-word.sh` into a new file and save it.

1. Create an example file for the `word-by-word.sh` script to read.

        echo -e 'Ultimately, literature is nothing but carpentry. With both you are working with reality, a material just as hard as wood.' > marquez.txt

1. Run the script and pass it a file location as an argument:

        ./word-by-word.sh marquez.txt

    Your output will resemble the following:

    {{< output >}}
Ultimately,
literature
is
nothing
but
carpentry.
With
both
you
are
working
with
reality,
a
material
just
as
hard
as
wood.
    {{</ output>}}

### Read a File Character by Character

The example bash script, `char-by-char.sh` expects a file to be passed as an argument. It will run checks to ensure an argument has been passed to the script and that it is a file. It then uses a while loop with the `read` command to echo each character in the file to your shell's output. The `-n1` flag is added to the standard `read` command in order to specify the number of characters to read at a time, which in this case is `1`.

{{< file "char-by-char.sh" bash >}}
#!/bin/bash

if [[ $# -le 0 ]]
then
    echo "You did not pass any files as arguments to the script."
    echo "Usage:" "$0" "my-file"
    exit
fi

file=$1

if [ ! -f "$file" ]
then
    echo "File does not exist!"
fi

while read -r -n1 char; do
    echo "$char"
done < "${file}"
{{< /file >}}

1. Copy and paste the contents of `char-by-char.sh` into a new file and save it.

1. Create an example file for the `char-by-char.sh` script to read. The leading whitespace in the example file is intentional.

        echo -e 'Linode' > linode.txt

1. Run the script and pass it a file location as an argument:

        ./char-by-char.sh linode.txt

    Your output will resemble the following:

    {{< output >}}
L
i
n
o
d
e
    {{</ output >}}

### Search Directories

The bash script, `search.sh` will search a directory for files and directories that begin with the string passed as a command line argument. All matching regular files and directories will be presented as output. The script expects the search string as the first argument and a directory location as the second argument. The script uses the `find` UNIX command for searching a directory and looks for everything that begins with matched regular expression, `$string*`.

{{< file "search.sh" bash >}}
#!/bin/bash

if [[ $# -le 1 ]]
then
    echo "You did not pass any files as arguments to the script."
    echo "Usage:" "$1" "my-file"
    exit
fi

dir=$2
string=$1

if [ ! -d "$dir" ]
then
    echo "Directory" "$dir" "does not exist!"
    exit
fi

for i in $(find "$dir" -name "$string*");
do
    if [ -d "$i" ]
    then
       echo "$i" "[Directory]"
    elif [ -f "$i" ]
    then
        echo "$i" "[File]"
    fi
done
{{< /file >}}

1. Copy and paste the contents of `search.sh` into a new file and save it.

1. Move to your home directory and create an example file and directory for the `search.sh` script to find.

        cd ~ && echo -e 'Ultimately, literature is nothing but carpentry.' > marquez.txt && mkdir marketing

1. Run the script and pass it a string and directory location as arguments. Ensure you replace the value of `/home/user/` with your own home directory.

        ./bin/search.sh mar /home/user/

    Your output will resemble the following:

    {{< output >}}
/home/user/marketing [Directory]
/home/user/marquez.txt [File]
    {{</ output >}}

## Bash Exit Codes

An *exit code* is the code returned to a [parent process](https://en.wikipedia.org/wiki/Parent_process) after executing a command or a program. Using exit codes in your Bash scripts allows the script to modify its behavior based on the success or failure of your script's commands. Exit codes range between `0 - 255`. An exit code of `0` indicates success, while any non-zero value indicates failure. This section will provide an introduction to Bash exit codes and a few examples on how to use them in your scripts.

{{< note type="secondary" title="Exit Codes" isCollapsible=true >}}
The table lists and describes reserved exit codes. You should not use any of the reserved exit codes in your Bash scripts.

| Code | Description |
| --| -- |
| `0` | Successful execution |
| `1` | General failure |
| `2` | Incorrect usage of Bash built-in commands, by using invalid options, or missing arguments |
| `126` | Command found, but is not executable |
| `127` | Command not found |
| `128+n` | Command terminated on a fatal signal `n`. The final exit code will be `128` plus the corresponding termination signal number. For example, a script that is terminated using the `kill` signal will have an exit code of `137` (128+9).|
| `130` | Execution terminated by **CTRL-C** |
| `255` | Exit status out of range |
{{< /note >}}

### Learning the Exit Code of a Shell Command

You can understand whether a bash command was executed successfully or not by accessing the exit code of the command. The built-in Bash variable `$?` stores the exit (return) status of the previously executed command. The example below issues the long format list files (`ls -l`) command against your `/tmp` directory and redirects standard output and standard error to `/dev/null` in order to suppress any output. Without any direct output there is no way of knowing if the command executed successfully or failed. To circumvent this scenario you can `echo` the value of the `$?` variable to view the command's exit status.

1. Execute the following example command. You should not see any output, however, the command should have executed successfully.

        ls -l /tmp 2>/dev/null 1>/dev/null

1. Find the value of `$?` to determine if your command executed successfully or not.

        echo "$?"

      The exit code status should output `0` if the command was successful:

      {{< output >}}
0
      {{< /output >}}

1. Issue the long form list files command against a directory that does not exist

        ls -l /doesNotExist 2>/dev/null 1>/dev/null

1. Find the value of `$?` to determine if your command executed successfully or not.

        echo "$?"

      The exit code status should output `1` if the command failed:

      {{< output >}}
1
      {{< /output >}}

    {{< note respectIndent=false >}}
After you execute `echo $?`, the value of `$?` will always be `0` because `echo $?` was successfully executed.
    {{< /note >}}

### Using set -e

The `set` command is used to set or unset different shell options or positional parameters. A very useful option that can be set with this command is the `-e` option, which causes a bash script to exit if any command or statement generates a non-zero exit code. This option is useful, because it works globally on all commands contained in a script, so you don't have to test the return status of each command that is executed.

The example script, `set-example.sh`, tries to create a file at the specified path. If the file cannot be written to and created, the script will immediately exit and none of the remaining commands will be executed. In the case of a non-zero exit code, you should not expect to see the last line execute the `echo "Script is exiting" ` command.

{{< file "set-example.sh" bash >}}
#!/bin/bash

set -e

if [[ $# -le 0 ]]
then
    echo "You did not pass any file paths as arguments to the script."
    echo "Usage:" "$0" "my-new-file-path"
    exit
fi

fpath=$1

echo "About to create file: " "$fpath"

if [ -e "$fpath" ]
then
    echo "${fpath}" "already exists!"
    exit
fi

echo "Creating and writing to the file: " "$fpath"
echo "Test" >> "$fpath"

echo "Script is exiting"
{{< /file >}}

1. Copy and paste the contents of `set-example.sh` into a new file and save it.

1. Run the script and pass it a file location as an argument.

        ./set-example.sh /tmp/new-file

    Creating a file in this location should be successful and your output will resemble the following:

    {{< output >}}
About to create file:  /tmp/new-file
About to create and write to the file:  /tmp/new-file
Script is exiting
    {{</ output >}}

1. Now, run the script and pass it a file location that you likely do not have elevated enough permissions to write to.

        ./set-example.sh /dev/new-file

    Creating a file in this location should not be successful and your script will exit prior to executing the final `echo` command:

    {{< output >}}
About to create file:  /dev/new-file
About to create and write to the file:  /dev/new-file
./set-e.sh: line 23: /dev/new-file: Permission denied
    {{</ output >}}

### Using set -x

Another handy way to use the `set` command is by enabling the `-x` option. This option displays commands and arguments before they're executed, which makes this a great option for debugging scripts.

{{< note respectIndent=false >}}
Any output generated by the `set -x` execution trace will be preceded by a `+` character. This value is stored in the built-in variable, `PS4`.
{{< /note >}}

The example script below, `debug-set-example.sh`, contains identical code to the example in the previous section, however, it makes use of `set -x` in order to print out all commands before they're executed.

{{< file "debug-set-example.sh" bash >}}
#!/bin/bash

set -xe

if [[ $# -le 0 ]]
then
    echo "You did not pass any file paths as arguments to the script."
    echo "Usage:" "$0" "my-new-file-path"
    exit
fi

fpath=$1

echo "About to create file: " "$fpath"

if [ -e "$fpath" ]
then
    echo "${fpath}" "already exists!"
    exit
fi

echo "Creating and writing to the file: " "$fpath"
echo "Test" >> "$fpath"

echo "Script is exiting"
{{< /file >}}

1. Copy and paste the contents of `debug-set-example.sh` into a new file and save it.

1. Run the script and pass it a file location as an argument.

        ./debug-set-example.sh /dev/new-file

    Creating a file in this location should not be successful and your script will exit prior to executing the final echo command. However, since you also have the `set -x` option enabled, you will be able to clearly see on which command the script exited.

    {{< output >}}
+ [[ 1 -le 0 ]]
+ fpath=/dev/new-file
+ echo 'About to create file: ' /dev/new-file
About to create file:  /dev/new-file
+ '[' -e /dev/new-file ']'
+ echo 'About to create and write to the file: ' /dev/new-file
About to create and write to the file:  /dev/new-file
+ echo Test
./set-e.sh: line 23: /dev/new-file: Permission denied
    {{</ output >}}