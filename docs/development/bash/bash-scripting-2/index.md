---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
<<<<<<< HEAD
description: 'In this guide, you will build off of what you have already learned and put together more complex Bash scripts for common operations used by Linux system administrators, like creating interactive Bash scripts with menu options, scripts that generate nicely formatted output of your data, and working with files and directories in your scripts. Each section will provide a brief introduction to each concept and command with a few examples that you can run to better understand its function.'
keywords: ["shell", "bash", "printf", "script"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-05
modified_by:
  name: Linode
title: 'An Intermediate Guide to Bash Scripting'
h1_title: 'Intermediate: Continuing with Bash Scripting'
=======
description: 'An introduction to bash shell programming - part 2.'
keywords: ["UNIX", "shell", "bash"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-08-26
modified_by:
  name: Linode
title: 'Writing more interesting bash scripts'
>>>>>>> ae2f32067a67f9a1fd811b0d26754967341871d1
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[GNU Bash](https://www.gnu.org/software/bash/)'
---

<<<<<<< HEAD
In the previous guide of this series, [Beginners: Getting Started with Bash Scripting](/docs/development/bash/intro-bash-shell-scripting/), you learned Bash basics, like creating and using variables, getting user input, using environment variables, and more. In this guide, you will build off of what you have already learned and put together more complex Bash scripts for common operations used by Linux system administrators, like creating interactive Bash scripts with menu options, scripts that generate nicely formatted output of your data, and working with files and directories in your scripts. Each section will provide a brief introduction to each concept and command with a few examples that you can run to better understand its function.

In this guide, you will learn about:

* [Standard Streams](/docs/development/bash/bash-scripting-2/#standard-streams)
* [Creating menus with the select statement](/docs/development/bash/bash-scripting-2/#create-menus-with-the-select-statement)
* [Using the printf command to format the output of your scripts](/docs/development/bash/bash-scripting-2/#introduction-to-the-printf-command)
* [Using file and directory test operators to control the flow of your scripts](/docs/development/bash/bash-scripting-2/#file-and-directory-test-operators)
* [Reading files and searching directories in your scripts](/docs/development/bash/bash-scripting-2/#read-files-and-searching-directories)
* [Bash exit codes](/docs/development/bash/bash-scripting-2/#bash-exit-codes)

## Before You Begin

1. All example scripts in this guide are run from the `bin` directory in the user's home directory, i.e. `/home/username/bin/`. If you do not have a `bin` directory in your home directory, create one and move into the directory:

        cd ~ && mkdir bin && cd bin

1. Verify that the `bin` directory is in your system PATH (i.e. `/home/username/bin`):

        echo $PATH

1. If it is not, add the new `bin` directory to your system's PATH:

        PATH=$PATH:$HOME/bin/

  {{< note >}}
Ensure all scripts throughout this guide are executable. To add execute permissions to a file, issue the following command:

    chmod +x my-script.sh

{{</ note >}}

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

    Enter some text after the prompt and you will see it echoed back to you in the terminal.

## Create Menus with the Select Statement

You can use the `select` statement to create menu systems in your bash scripts that users can interact with. When you combine `select` with the `case` statement you can create more sophisticated menu options. This section will provide three examples that use `select` to create menus. If you are not familiar with the `case` statement, you can refer to our [Introduction to Bash Shell Scripting](/docs/development/bash/bash1/#the-case-statement) guide.

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

The third example, `submen.sh`, uses all the previously covered concepts and enhances them by adding a submenu with a new series of options for the user to select. The script will read all files in the current working directory and display them to the user as selectable options. Once the user selects a file, a submenu will appear prompting the user to select an action to perform on the previously selected file. The submenu allows a user to delete a file, display the file's contents, or to simply exit the script.

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

    {{< note >}}
Ensure that the directory you are executing your script from contains at least one file in order to run through the full demo of the `submenu.sh` script.
    {{</ note >}}

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

        printf "%s\n" "0x29A"
    {{< output >}}
666
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

{{< note >}}
The `-v var` option causes the output of `printf` to be assigned to a variable instead of being printed to the standard output. In the example below, the result of the `printf` format specifier and argument will be stored in a varialble named `myvar`. To view the result, the example echoes the value of `$myvar`.

    printf -v myvar "%d\n" "0x29A"
    echo $myvar

  {{< output >}}
666
  {{</ output >}}
{{</ note >}}

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

=======
## Introduction

Now that you know the basics of bash scripting from the first guide, it is time to go a little deeper and learn how to process text files, work with files and directories, use `printf`, read from standard input, and search directory structures.

{{< note >}}
This guide is written for a non-root user. Depending on your configuration, some commands might require the help of `sudo` in order to get property executed. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Standard Input, Output and Error

Every UNIX operating system has three files open all the time for its processes named *Standard Input*, *Standard Output* and *Standard Error*. So, by default all UNIX systems support three special and standard filenames: `/dev/stdin`, `/dev/stdout` and `/dev/stderr` that can also be accessed using file descriptors `0`, `1`, and `2`, respectively.

### Reading from Standard Input

Being able to get the input of a bash script from standard input can be very handy in some cases. The presented script expects to get its input from a file but if that file is not there, it tries to read from standard input (`/dev/stdin`):

	{{< file "input.sh" bash >}}
#!/bin/bash

f=$1

if [[ "$f" == "" || (! -f "$f") ]]
then
    echo Using standard input!
    f="/dev/stdin"
fi

while read line
do
  echo "$line"
done < "${f}"
{{< /file >}}

The script reads from `$1` (the first command line argument of the script) if it is both defined and exists. Otherwise it uses `/dev/stdin`. This is specified in the `if` statement at the beginning of the script.

The output of `input.sh` will resemble the following:

    ./input.sh text
    {{< output >}}
12 3
155
{{< /output >}}

The contents of `text` are the ones presented in the output of `./input.sh text`. If the file does not exist, the program will wait from your input. Notice that in order to tell bash to stop reading from standard input, you should press Control+D at the beginning of a new line.

## The select command

The `select` command (statement) allows you to create menu systems in bash scripts really easily. The use of the `select` statement is illustrated in the `select.sh` bash script:

	{{< file "select.sh" bash >}}
#!/bin/bash

select number in 1 2 3
do
    echo Your selection is $number.
    break
done

select number in 1 2 3 4 5 6
do
case $number in
1 | 2)
    echo "$number is pretty small!"
;;
3 | 4)
    echo "$number is relatively big!"
;;
*)
    echo "Big number!"
    break
;;
esac
done

select number in 10 20 30
do
case $number in
10 | 20)
    echo $number
    break
;;
30)
    # This is a sub menu
    select n in 31 32 33
    do
    case $n in
    31 | 32)
    echo "Your selection is $n!"
    break
    ;;
    33)
    echo You really like $n!
    break
    ;;
    esac
    done
esac
done
{{< /file >}}

The program presents three versions of `select`. The first one is simple and straightforward because the same command is executed for all options. The second one is more complex, which makes it more useful, because the options are processed using `case`. The third version illustrates how to create menus and submenus using `select`.

Notice that in a `select` block you do not have to type the actual value but the number that appears on the left side of the value. Additionally, if you select something that does not exist, `select` will do nothing and continue waiting for a valid selection.

The output of `select.sh` will resemble the following:

    ./select.sh
    {{< output >}}
1) 1
2) 2
3) 3
#? 1
Your selection is 1.
1) 1
2) 2
3) 3
4) 4
5) 5
6) 6
#? 6
Big number!
1) 10
2) 20
3) 30
#? 3
1) 31
2) 32
3) 33
#? 3
You really like 33!
#?
1) 10
2) 20
3) 30
#? 1
10
{{< /output >}}

## The printf command

The bash scripting language supports the `printf` command, which allows you to customize the output of your scripts. Its roots are in the C programming language, which implements a function by the same name (`man 3 printf`). There is a format string followed by an argument that defines the way the argument is going to be displayed. You can have as many format strings and arguments as you want and you can also print plain text like `echo` does. Last, the `-v var` option causes the output of `printf` to be assigned to the variable `var` instead of being printed to the standard output.

The `d` format string is used for printing a value as a signed decimal number whereas the `u` format string is used for printing a value as an unsigned decimal number. The `x` format string is used for printing a value as a hexadecimal number with lower case `a-f` whereas `X` does the same but uses upper case `A-F`. Last, `s` is used for formatting a value as a string.

### Using the printf command

This section will present an example that uses the `printf` command. The code of `printf.sh` is the following:

	{{< file "printf.sh" bash >}}
#!/bin/bash

for i in $( seq 1 10 ); do printf "%04d\t" "$i"; done
echo

for i in $( seq 1 10 ); do printf "%x\t" "$i"; done
echo

for i in $( seq 1 10 ); do printf "%X\t" "$i"; done
echo

for i in $( seq 10 15 ); do printf "%04d\t is %X\t in HEX.\n" $i $i; done

for i in $( seq 5 10 ); do printf "%.10s is %X in HEX.\n" "$i............." $i; done
{{< /file >}}

The `%.10s` format string tells `printf` to print a string using no more than 10 characters - if the string is bigger, the string will be truncated. Similarly, `%04d` tells `printf` to print a decimal number using up to 4 digits. If the number has fewer digits, then zeros will printed in front of it. Last, `\t` and `\n` are used for printing tabs and newlines, respectively.

The output of `printf.sh` will resemble the following:

    ./printf.sh
>>>>>>> ae2f32067a67f9a1fd811b0d26754967341871d1
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
<<<<<<< HEAD
    {{< /output >}}

## File and Directory Test Operators

Bash offers file and directory test operators that return a boolean value based on each operator's specific test criteria. These operators can be used in your Bash scripts to present different behavior depending on the state of a file or directory. A list of all test operators is included in the expandable note, "File and Directory Test Operators" below.

The general format for file and directory test operators is the following:

    test -[OPERATOR] [FILE]

The example below tests if your `/etc/passwd` file exists. If the file exists, you will see `"Yes, it exists!"` printed as output. If the file does not exist, the first part of the command, `test -a /etc/passwd`, will return an exit status of `1` (the exit value will not print as output) and the second part of the command, `echo "Yes, it exists!"`, will not execute.

    test -a /etc/passwd && echo "Yes, it exists!"

{{< disclosure-note "File and Directory Test Operators">}}

| Operator | Description |
=======
{{< /output >}}

Talking more about the `printf` command is beyond the scope of this guide.

## File and Directory Test Operators

The scripting language of bash offers a plethora of operators that allow you to work with all kinds of files including regular files and directories – each operator returns either `true` or `false` depending on the result of the performed test. The list includes the following operators, which should all be followed by a path to a UNIX file:

| Command | Description |
>>>>>>> ae2f32067a67f9a1fd811b0d26754967341871d1
|---------|-------------|
| `-a` | File exists. |
| `-b` | File exists and is a block special file. |
| `-c` | File exists and is a character special file. |
| `-d` | File exists and is a directory. |
| `-e` | File exists and is a file of any type (node, directory, socket, etc.). |
<<<<<<< HEAD
| `-f` | File exists and is a regular file (not a directory or a device file). |
| `-G` | File exists and has the same group as the active user running the bash script. |
| `-h` | Files exists and is a symbolic link. |
| `-g` | Files exists and has the [set group ID flag](/docs/tools-reference/tools/modify-file-permissions-with-chmod/#chmod-command-syntax-and-options) set. |
| `-k` | File exists and has a [sticky bit flag](/docs/tools-reference/tools/modify-file-permissions-with-chmod/#chmod-command-syntax-and-options) set. |
| `-L` | File exists and is a symbolic link. |
| `-N` | File exists and has been modified since it was last read. |
| `-O` | File exists and is owned by the effective user id. |
| `-p` | File exists and is a [pipe](https://stackoverflow.com/questions/40067887/what-is-a-pipe-file). |
| `-r` | File exists and is readable. |
| `-S` | File exists and is socket. |
| `-s` | File exists and has a nonzero size. |
| `-u` | File exists and its [set user ID flag](docs/tools-reference/tools/modify-file-permissions-with-chmod/#chmod-command-syntax-and-options) is set. |
| `-w` | File exists and is writable by the current user. |
| `-x` | File exists and is executable by the current user. |

{{</ disclosure-note >}}

### Use File and Directory Test Operators in a Script

The example script, `file-operators.sh`, takes file or directory locations as arguments and returns information about each type of file that is passed to it. The script makes use of file and directory test operators to generate this information. The first `if` statement tests to ensure you have passed the script arguments. The `for` loop then goes on to test if the arguments are files that actually exist and then continues through a series of statements to test the file or directory for other criteria.

{{< note >}}
You can use `[]` and `[[]]` commands instead of using the `if` conditional statement to create file conditions. The script makes use of this format on lines 26 - 40.
{{</ note >}}

{{< file "file-operator.sh" bash >}}
=======
| `-f` | File exists and is a regular file – not a directory or a device file. |
| `-G` | File exists and has the same group as the active user running the bash script. |
| `-h` | Files exists and is a symbolic link. |
| `-g` | Files exists and has the set-group-id flag set. |
| `-k` | File exists and has a sticky bit flag set. |
| `-L` | File exists and is a symbolic link. |
| `-N` | File exists and has been modified since it was last read. |
| `-O` | File exists and is owned by the effective user id. |
| `-p` | File exists and is a pipe. |
| `-r` | File exists and is readable. |
| `-S` | File exists and is socket. |
| `-s` | File exists and has nonzero size. |
| `-u` | File exists and its set-user-id flag is set. |
| `-w` | File exists and is writable by the current user. |
| `-x` | File exists and is executable by the current user. |

Should you wish to check whether two or more files exist, you can use the `-a` operator. As an example, `-f FILE1 -a -f FILE1` will test whether both `FILE1` and `FILE2` exist. Notice that `-a` can be replaced by `&&`. Last, each test expression can be negated using the `!` (*logical NOT*) operator.

### Using File and Directory Test Operators

The presented example will use some of the file and directory test Operators:

    {{< file "fileOps.sh" bash >}}
>>>>>>> ae2f32067a67f9a1fd811b0d26754967341871d1
#!/bin/bash

if [[ $# -le 0 ]]
then
<<<<<<< HEAD
     echo "You did not pass any files as arguments to the script."
     echo "Usage:" "$0" "my-file-1 my-file-2"
     exit
=======
	echo Usage: $0 files!
	exit
>>>>>>> ae2f32067a67f9a1fd811b0d26754967341871d1
fi

for arg in "$@"
do
<<<<<<< HEAD
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

=======
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

    [ -r "$arg" -a -d "$arg" ] && echo "* $arg is a readable directory."
    [[ -r "$arg" && -f "$arg" ]] && echo "* $arg is a readable regular file."
done
{{< /file >}}

Notice that you can avoid using `if` statements if you use `[]` or `[[]]` instead, depending on whether you are using `-a` or `&&`, respectively. You can perform as many tests as you want but use common sense in order to create compact and readable code.

On the UNIX command line, execute `fileOps.sh` as follows:

    ./fileOps.sh /dev/fd/2
>>>>>>> ae2f32067a67f9a1fd811b0d26754967341871d1
    {{< output >}}
* /dev/fd/2 is not a regular file!
* /dev/fd/2 is not a directory.
* /dev/fd/2 is not executable.
* /dev/fd/2 is not a symbolic link.
* /dev/fd/2 has zero size.
<<<<<<< HEAD
    {{< /output >}}

1. Run the script and pass it a directory location as an argument:

        ./file-operator.sh /var/log

    Your output will resemble the following:

=======
{{< /output >}}

If you try to test a directory, the output of `fileOps.sh` will be similar to the next:

    ./fileOps.sh /var/log
>>>>>>> ae2f32067a67f9a1fd811b0d26754967341871d1
    {{< output >}}
* /var/log is not a regular file!
* /var/log is a directory.
* /var/log is executable.
* /var/log is not a symbolic link.
* /var/log has nonzero size.
* /var/log is a readable directory.
<<<<<<< HEAD
    {{< /output >}}

## Read Files and Searching Directories

This section will present a few utility scripts that can be adopted and expanded on to perform common operations on files and directories, like reading the contents of a text file by line, word, or character. These scripts make use of several of the concepts and techniques covered in this guide and in the [Introduction to Bash Shell Scripting](/docs/development/bash/bash1/) guide.

### Read a File Line by Line

The example file, `line-by-line.sh`, expects a file passed to it as an argument. It will then read the contents of the file line by line. The `IFS` variable (internal field separator) is a built-in Bash variable that defines how Bash recognizes word boundaries when splitting words. The script sets `IFS` to the null string to preserve leading and trailing white space within your text file.

{{< file "line-by-line.sh" bash >}}
=======
{{< /output >}}

## Working With Files and Directories

### Reading a file line by line

The presented bash shell script will illustrate how you can read a text file line by line.

	{{< file "lByL.sh" bash >}}
>>>>>>> ae2f32067a67f9a1fd811b0d26754967341871d1
#!/bin/bash

if [[ $# -le 0 ]]
then
<<<<<<< HEAD
     echo "You did not pass any files as arguments to the script."
     echo "Usage:" "$0" "my-file"
	   exit
fi

file=$1

if [ ! -f "$file" ]
then
     echo "File does not exist!"
=======
	echo Usage: $0 filename!
	exit
fi

f=$1

if [ ! -f "$f" ]
then
	echo "File does not exist!"
>>>>>>> ae2f32067a67f9a1fd811b0d26754967341871d1
fi

while IFS='' read -r line || [[ -n "$line" ]]; do
    echo "$line"
<<<<<<< HEAD
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
=======
done < "${f}"
{{< /file >}}

The `IFS` variable is the Internal field separator and determines how bash recognizes word boundaries. As the default value of `IFS` does not work for reading a file line by line using the presented technique, the script changes its value.

On the UNIX command line, execute `lByL.sh` as follows:

    ./lByL.sh text
    {{< output >}}
12 3
155
{{< /output >}}

### Reading a file word by word

The presented bash shell script will illustrate how you can read a text file word by word.

    {{< file "wByW.sh" bash >}}
>>>>>>> ae2f32067a67f9a1fd811b0d26754967341871d1
#!/bin/bash

if [[ $# -le 0 ]]
then
<<<<<<< HEAD
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
=======
	echo Usage: $0 filename!
	exit
fi

f=$1

if [ ! -f "$f" ]
then
	echo "File does not exist!"
fi

for word in `cat ${f}`
do
  echo $word
done
{{< /file >}}

The default value of the `IFS` variable separates a line into words, which in this case does all the work without the need for changing its value.

Execute `wByW.sh` with the following command:

    ./wByW.sh text
    {{< output >}}
12
3
155
{{< /output >}}

### Reading a file character by character

The presented bash shell script will illustrate how you can read a text file character by character.

    {{< file "cByC.sh" bash >}}
>>>>>>> ae2f32067a67f9a1fd811b0d26754967341871d1
#!/bin/bash

if [[ $# -le 0 ]]
then
<<<<<<< HEAD
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
=======
	echo Usage: $0 filename!
	exit
fi

f=$1

if [ ! -f "$f" ]
then
	echo "File does not exist!"
fi

while read -n1 c; do
    echo "$c"
done < ${f}
{{< /file >}}

The presented bash shell adds the ``-n`` flag to the standard `read` command in order to specify the number of characters to read, which in this case is just 1 character at a time! This command does all the work for us.

Execute `cByC.sh` with the following command to see it at work:

    ./cByC.sh text
    {{< output >}}
1
2

3

1
5
5

{{< /output >}}

### Searching directory structures

The presented bash script will search directory structures for files and directories that begin with a given string that will be given as a command line argument. All matching regular files and directories will be presented on the screen.

    {{< file "search.sh" bash >}}
>>>>>>> ae2f32067a67f9a1fd811b0d26754967341871d1
#!/bin/bash

if [[ $# -le 1 ]]
then
<<<<<<< HEAD
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

{{< disclosure-note "Exit Codes">}}
The table lists and describes reserved exit codes. You should not use any of the reserved exit codes in your Bash scripts.

| Code | Description |
| --------- | ------------- |
| `0` | Successful execution |
| `1` | General failure |
| `2` | Incorrect usage of Bash builtin commands, by using invalid options, or missing arguments |
| `126` | Command found, but is not executable |
| `127` | Command not found |
| `128+n` | Command terminated on a fatal signal `n`. The final exit code will be `128` plus the corresponding termination signal number. For example, a script that is terminated using the `kill` signal will have an exit code of `137` (128+9).|
| `130` | Execution terminated by **CTRL-C** |
| `255` | Exit status out of range |

{{</ disclosure-note >}}

### Learning the exit code of a shell command

You can understand whether a bash command was executed successfully or not by accessing the exit code of the command. The built-in Bash variable `$?` stores the exit (return) status of the previously executed command. The example below issues the long format list files (`ls -l`) command against your `/tmp` directory and redirects standard output and standard error to `/dev/null` in order to suppress any output. Without any direct output there is no way of knowing if the command executed successfully of failed. To circumvent this scenario you can `echo` the value of the `$?` variable to view the command's exit status.

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

    {{< note >}}
After you execute `echo $?`, the value of `$?` will always be `0` because `echo $?` was successfully executed.
    {{</ note >}}

### Using set -e

The `set` command is used to set or unset different shell options or positional parameters. A very useful option that can be set with this command is the `-e` option, which causes a bash script to exit if any command or statement generates a non-zero exit code. This option is useful, because it works globally on all commands contained in a script, so you don't have to test the return status of each command that is executed.

The example script, `set-example.sh`, tries to create a file at the specified path. If the file cannot be written to and created, the script will immediately exit and none of the remaining commands will be executed. In the case of a non-zero exit code, you should not expect to see the last line execute the `echo "Script is exiting" ` command.

{{< file "set-example.sh" bash >}}
=======
	echo Usage: $0 string directory!
	exit
fi

d=$2
string=$1

if [ ! -d "$d" ]
then
	echo "Directory $d does not exist!"
    exit
fi

for i in `find $d -name "$string*"`;
do
 if [ -d $i ]
 then
    echo $i [Directory]
 elif [ -f $i ]
 then
    echo $i [File]
 fi
done
{{< /file >}}

The script uses the `find(1)` UNIX command for searching. Additionally, it looks for everything that begins with the given string using a regular expression (`$string*`).

    ./search.sh text ../..
    {{< output >}}
../../bash2.Linode/code/text [File]
{{< /output >}}

{{< note >}}
Although the functionality of the presented bash script is similar to the functionality of the `find(1)` utility, a shell script can do many more things that `find(1)` cannot do, mainly because `find(1)` is not a programming language.
{{< /note >}}

## Additional Examples

### Converting Celsius Degrees to Fahrenheit Degrees and vice versa

The presented utility will allow you to convert between Celsius and Fahrenheit degrees. This is a complete program that could have been written in another scripting or compiled programming language and its main purpose is to illustrate how you can write complete programs in bash. The code of `degrees.sh` is the following:

    {{< file "degrees.sh" bash >}}
#!/bin/bash

if [[ $# -le 1 ]]
then
	echo "Usage: $0 [cC|fF] degrees!"
	exit
fi

option=$1

if [ $2 -eq $2 2>/dev/null ]
then
     echo "$2 is a valid integer!"
else
    echo "$2 is not an integer!"
    exit
fi

case $option in
    [Ff])
        echo "$(( ($2 - 32) * 5 / 9 )) ˚C"
        ;;
    [cC])
        echo "$(( $2 * 9 / 5 + 32 )) ˚F"
        ;;
    *)
        echo "Usage: $0 [cC|fF] degrees!"
esac
{{< /file >}}

The `degrees.sh` script uses the `case` command to simplify its design and expects 2 command line arguments. The second command line argument is the temperature you want to convert and should be an integer number and the first command line argument is for specifying the metric system. The `$2 -eq $2 2>/dev/null` statement makes sure that the temperature is a valid integer – you can use this technique in your own bash scripts.

Executing `degrees.sh` will generate the following kind of output:

    ./degrees.sh F 100
    {{< output >}}
100 is a valid integer!
37 ˚C
{{< /output >}}

### Learning the exit code of a shell command

Being able to read the exit code of a command is important because you can understand whether a bash command was executed successfully or not. The bash shell has a special variable named `$?` that holds the exit (return) status of the previous command – this is illustrated in the next two interactions with the bash shell:

    ls -l /tmp 2>/dev/null 1>/dev/null

The previous command will be successful as the `/tmp` directory is there – the redirections of both standard error (`2>/dev/null`) and standard output (`1>/dev/null`) mean that the command will generate no output on the screen, which means that there is no way of knowing whether its execution was successful or not. You can find out the value of `$?` as follows

    echo $?
    {{< output >}}
0
{{< /output >}}

On the other hand, if you try to see a directory that does not exist, the `ls` command will fail:

    ls -l /doesNotExist 2>/dev/null 1>/dev/null

Therefore, the output of the following command will be as follows:

    echo $?
    {{< output >}}
1
{{< /output >}}

Notice that after the execution of `echo $?`, the value of `$?` will always be `0` because `echo $?` was successfully executed!

### Using set -e

`set -e` tells the bash script to exit as soon as any statement returns a non-true return value. This command saves you from having to test the return status of each command that you execute in your bash scripts – the code of `setE.sh` illustrates the use of `set -e`:

    {{< file "setE.sh" bash >}}
>>>>>>> ae2f32067a67f9a1fd811b0d26754967341871d1
#!/bin/bash

set -e

if [[ $# -le 0 ]]
then
<<<<<<< HEAD
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

{{< note >}}
Any output generated by the `set -x` execution trace will be preceded by a `+` character. This value is stored in the builtin variable, `PS4`.
{{</ note >}}

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
=======
	echo Usage: $0 files!
	exit
fi

path=$1

echo "About to begin!"

if [ -e "$path" ]
then
    echo "${path} already exists!"
    exit
fi

echo About to write!
echo "Test" >> "$path"

echo "Good bye!"
{{< /file >}}

The script tries to create a file at the specified path. If the file can be created at the specified path, the output of `setE.sh` will be as follows:

    ./setE.sh /tmp/newFile
    {{< output >}}
About to begin!
About to write!
Good bye!
{{< /output >}}

However, if the file path cannot be created for some reason, which in this case is not having the required permissions, the output of `setE.sh` will be the following:

    ./setE.sh /dev/newFile
    {{< output >}}
About to begin!
About to write!
./setE.sh: line 22: /dev/newFile: Operation not permitted
{{< /output >}}

So, in this case the `echo "Good bye!"` command is not executed as the script exist earlier.

If `set -e` was not included in the script, then the output of `./setE.sh /dev/newFile` would have been as follows:

    ./setE.sh /dev/newFile
    {{< output >}}
About to begin!
About to write!
./setE.sh: line 22: /dev/newFile: Operation not permitted
Good bye!
{{< /output >}}

### Using set -x

Things do not always work as expected the first time. The `set -x` option is a debug option that tells bash to print to standard error the command that is about to be executed before executing it. Have in mind that output generated by `set -x` begins with the `+` character.

    {{< file "setX.sh" bash >}}
#!/bin/bash

set -x

if [[ $# -le 0 ]]
then
	echo Usage: $0 files!
	exit
fi

path=$1
echo "About to begin!"
if [ -e "$path" ]
then
    echo "${path} already exists!"
    exit
fi

echo "Good bye!"
{{< /file >}}

The actual commands of the script do not matter – what it matters is its output, which will look as follows:

    ./setX.sh aFile
    {{< output >}}
+ [[ 1 -le 0 ]]
+ path=aFile
+ echo 'About to begin!'
About to begin!
+ '[' -e aFile ']'
+ echo 'Good bye!'
Good bye!
{{< /output >}}

## Summary

This guide talked about many interesting features of bash that can help you work with files and directories, use `printf` and debug your scripts. The last guide on bash scripting will talk about functions, times, dates and will present various real world bash scripts.
>>>>>>> ae2f32067a67f9a1fd811b0d26754967341871d1
