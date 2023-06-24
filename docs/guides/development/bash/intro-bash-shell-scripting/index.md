---
slug: intro-bash-shell-scripting
description: 'An introduction to bash shell scripting, including variables, if statements, loops, how to get user input, and working with files and directories.'
keywords: ["UNIX", "shell", "bash", "programming", "script"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/development/bash/bash1/','/development/bash/intro-bash-shell-scripting/']
published: 2019-09-27
modified_by:
  name: Linode
title: 'Introduction to Bash Shell Scripting'
external_resources:
  - '[GNU Bash](https://www.gnu.org/software/bash/)'
authors: ["Mihalis Tsoukalos"]
---

## Introduction

This guide is an introduction to bash shell programming. Bash shell programming empowers Linux users to take programmatic control over the Linux operating system. The bash shell provides a number of concepts common to many other programming languages, so if you know another language then you should be able to pick up bash with relative ease.

## In This Guide

Among other things, you will learn about:

- [Bash Scripts](#bash-scripts)
- [Variables](#defining-and-using-variables)
- [How to get user input](#getting-user-input)
- [`if` statements](#the-if-statement)
- [How to use environment variables](#using-unix-environment-variables)
- [Loops](#loops)
- [How to use command line arguments](#command-line-arguments)
- [`case` statements](#the-case-statement)
- [How to combine commands](#combining-commands-in-bash-scripts)
- [How to work with files and directories](#working-with-files-and-directories)

{{< note respectIndent=false >}}
This guide is written for a non-root user. Depending on your configuration, some commands might require the help of `sudo` in order to properly execute. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Bash Basics

### The bash Executable

The bash shell is an executable file. The executable file for the bash shell can be usually found inside `/bin` – its full
path being `/bin/bash`. Please keep this file path in mind as it will be used in all
bash scripts.

### Bash Scripts

The following code is the "Hello World" program written in `bash(1)`:

{{< file "hello_world.sh" bash >}}
#!/bin/bash

echo "Hello World!"
{{< /file >}}

The first line is required for the bash script to become autonomous and executable
as a command. The `#!` characters are called a *shebang*, and instruct Linux to use following path as the file interpreter. The `.sh` file extension is not required but it is good to have it in
order to inform people that this is a shell script and not a binary file.

Notice that `echo` is a bash shell built-in command that outputs text. All shells have their own built-in
commands.

In order for a bash script to be executable, it needs to have the appropriate
file permissions. To give a file permissions that allow it to be executable, use
the `chmod +x file.sh` command, substituting `file.sh` for the name of the file. After that you can execute it as `./file.sh`.
Alternatively you can use `chmod 755 file.sh`.

For the `hello_world.sh` script to become executable, you will need to run one
of the following two commands:

    chmod +x hello_world.sh
    chmod 755 hello_world.sh

After that the file permissions of `hello_world.sh` will be similar to the following:

    ls -l hello_world.sh

{{< output >}}
-rwxr-xr-x 1 mtsouk  staff  32 Aug  1 20:09 hello_world.sh
{{< /output >}}

{{< note respectIndent=false >}}
You will need to give all bash scripts of this guide the execute file permission
in order to be able to execute them as regular UNIX commands. For more information on file permissions, see our [Linux Users and Groups Guide](/docs/guides/linux-users-and-groups/).
{{< /note >}}

Executing `hello_world.sh` will generate the following output:

    ./hello_world.sh

{{< output >}}
Hello World!
{{< /output >}}

The `./` in front of the script name tells bash that the file you want to execute is
in the current directory. This is necessary for executing any file that is not located
in the `PATH`. The `PATH` *environment variable* contains a list of directories that
bash will search through for executable commands. You can execute `echo $PATH` to find
its current value.

{{< note respectIndent=false >}}
The `#` character is used for adding single line comments in bash scripts. The bash shell
also supports multi line comments, but they are not used as often, so it would be
better to use multiple single line comments when you want to write bigger comment blocks.
{{< /note >}}

### Defining and Using Variables

The programming language of the bash shell has support for variables. Variables, like in math, have values that can be declared in a program and later changed or passed around to different functions. Variables
are illustrated in `vars.sh`, which is as follows:

{{< file "vars.sh" bash >}}
#!/bin/bash

VAR1="Mihalis"
myVar="$(pwd)"

echo "My name is ${VAR1}"
echo -n "and I work from "
echo $myVar

myVar=`pwd`
echo $myVar
{{< /file >}}

There are two variables defined in this example: the first one is called `VAR1` and the second one
is called `myVar`. Although both variables are defined inside the program, the first
variable is defined with a direct assignment whereas the second variable is defined
as the output of an external program, the `pwd(1)` command, which outputs the current working directory. The value of `myVar` depends
on your place in the filesystem.

The two variables are read as `${VAR1}` and `$myVar`, respectively – both notations work.
Notice that in order to prevent `echo` from printing a newline character, you will have to
call it as `echo -n`. Lastly, notice that `"$(pwd)"` and `` `pwd` `` (note the use of backticks instead of quotation marks) are equivalent.

Executing `vars.sh` will generate the following kind of output:

    ./vars.sh

{{< output >}}
My name is Mihalis
and I work from /home/mtsouk/
/home/mtsouk/
{{< /output >}}

### Getting User Input

The bash shell offers the `read` command for getting user input. However, this is
rarely used because it makes bash shell scripts less autonomous as it depends on user interaction. Nevertheless, the
`read.sh` script illustrates the use of `read`:

{{< file "read.sh" bash >}}
#!/bin/bash

echo -n "What is your name? "
read name

echo "Hello" "$name!"

echo -n "Please state your name and your surname: "
read name surname
echo "Hello" "$name $surname!"
{{< /file >}}

Executing `read.sh` will generate the following kind of output:

    ./read.sh
{{< output >}}
What is your name? Mihalis
Hello Mihalis!
Please state your name and your surname: Mihalis Tsoukalos
Hello Mihalis Tsoukalos!
{{< /output >}}

The second `read` is different than the first, because it accepts two variable values. The `read` command looks for a space or tab separator in the input text in order to split the text into multiple values. If more than one space is provided, then all remaining values are combined. This means that if the user's surname is a compound of two or more additional words they will all become the value of `$surname`.

The sections on [Environment Variables](#using-unix-environment-variables) and [Command Line Arguments](#command-line-arguments) show alternative ways of retrieving user input that
is more common in the UNIX world than the `read` command.

### The if statement

The bash shell supports `if` statements using a unique syntax, which
is illustrated in `whatIf.sh`:

{{< file "whatIf.sh" bash >}}
#!/bin/bash

VAR1="4"
VAR2="4"

if [ $VAR1 == 4 ]
then
    echo Equal!
fi

if [ "$VAR1" == 4 ]
then
    echo Equal!
else
    echo Not equal!
fi

if [ "$VAR1" == $VAR2 ]
then
    echo Equal!
elif [ "$VAR1" == $VAR1 ]
then
    echo Tricky Equal!
else
    echo Not equal!
fi
{{< /file >}}

`if` statements allow for logic to be applied to a block of code. If the statement is true, the code is executed. `if` statements in bash script use square brackets for the logical condition and also
have support for `else` and `elif` (else if) branches. Bash supports standard programming language conditional operators such as equals (`==`), not equals (`!=`), less than and greater than (`<`, `>`),  and a number of other file specific operators.

All `if` statements contain a conditional express, and a `then` statement, and all statements are ended with `fi`.

As filenames and paths may contain space characters, it is good to embed them in double
quotes – this has nothing to do with the `if` statement per se. Notice that this unofficial
rule applies to other variables that might contain space characters in them. This is
illustrated with the use of the `VAR1` variable. Lastly, the `==` operator is for checking
string values for equality.

    ./whatIf.sh

{{< output >}}
Equal!
Not equal!
Not equal!
{{< /output >}}

The `if` statement is used extensively in bash scripts, which means that you are going to
see it many times in this guide.

### Loops

The bash shell has support for loops, which are illustrated in this section
of the guide using the code of `loops.sh`:

{{< file "loops.sh" bash >}}
#!/bin/bash

# For loop
numbers="One Two Three List"
for n in $numbers
do
    echo $n
done

for x in {1..4}
do
    echo -n "$x "
done
echo

for x in ./c*.sh
do
    echo -n "$x "
done
echo

# While loop
c=0
while [ $c -le 5 ]
do
    echo -n "$c "
    ((c++))
done
echo

# Until loop
c=0
until [ $c -gt 5 ]
do
    echo -n "$c "
    ((c++))
done
echo
{{< /file >}}

{{< note respectIndent=false >}}

The bash scripting language offers support for the `break` statement for exiting a loop, and the `continue` statement
for skipping the current iteration.

{{< /note >}}

The `loops.sh` example begins with three `for` loops. These loops will iterate over values in a series, here represented by the `numbers` list variable or a range like `{1..4}`, and complete the block of code after the `do` command for each value. In a set of four values a loop will iterate four times. Notice that the third `for` loop processes the output of `./c*.sh`, which is equivalent to the output of the `ls ./c*.sh` command – this is a pretty handy way of selecting and processing files from the Linux filesystem.

Similarly, the `while` statement and the `until` statement will continually loop so long as the conditional statement is true (while), or until the statement becomes true (until). The `-le` and `-gt` operators used in the `while` and `until` loops are used strictly to compare numbers, and mean "less than or equal to" and "greater than," respectively.

Executing `loops.sh` will create the following output:

    ./loops.sh
{{< output >}}
One
Two
Three
List
1 2 3 4
./case.sh ./cla.sh
0 1 2 3 4 5
0 1 2 3 4 5
{{< /output >}}

{{< note respectIndent=false >}}
The `./case.sh` and `./cla.sh` scripts will be created in later sections of this guide.
{{< /note >}}

## Using UNIX Environment Variables

In this section of the guide you will learn how to read a UNIX environment variable,
change its value, delete it, and create a new one. This is a very popular way of
getting user input or reading the setup of the current user.

The related bash shell script is called `env.sh` and is as follows:

{{< file "env.sh" bash >}}
#!/bin/bash

# Read
if [[ -z "${PATH}" ]]; then
    echo "PATH is empty!"
else
    echo "PATH: $PATH"
fi

# Change
PATH=${PATH}:/tmp
echo "PATH: $PATH"

# Delete
export PATH=""
if [[ -z "${PATH}" ]]; then
    echo "PATH is empty!"
else
    echo "PATH: $PATH"
fi

# Create
MYPATH="/bin:/sbin:/usr/bin"
echo "MYPATH: ${MYPATH}"
{{< /file >}}

Notice that the `PATH` environment variable is automatically available to the bash script. You can view it's current value in the output of the first `if` statement. The `-z` operator
tests whether a variable has a length of zero or not and can be pretty handy when
checking if an environment variable is set or not.

Executing `env.sh` will create the following output:

    ./env.sh

{{< output >}}
PATH: /usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/texbin:/opt/X11/bin
PATH: /usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/texbin:/opt/X11/bin:/tmp
PATH is empty!
MYPATH: /bin:/sbin:/usr/bin
{{< /output >}}

{{< note respectIndent=false >}}
Notice that all changes to environment variables that take place inside a bash
script will be lost when that bash script ends because they have a local scope.
{{< /note >}}

## Bash and Command Line Arguments

### Command Line Arguments

The easiest and most common way to pass your own data to scripts is the use of command
line arguments. For instance, review the following command:

    ./cla.sh 1 2 3

This example command is executing the `cla.sh` command, and supplying a number of arguments, in this case the numbers 1, 2, and 3. Those numbers could be any type of information the bash script needs to execute.

The `cla.sh` bash script demonstrates how to work with command line
arguments:

{{< file "cla.sh" bash >}}
#!/bin/bash

echo "Arguments: $@"
echo "Number of arguments: $#"

for arg in "$@"
do
    echo "$arg"
done

echo "The name of the script is: $0"
echo "The first argument is: $1"

if [ -x $0 ]
then
    echo "$0" file exists!
fi
{{< /file >}}

The full list of arguments is stored as `$@` and the number of arguments is stored as `$#`. A `for` loop can be used for iterating over the list of command line arguments. Lastly, the name of the program is always `$0` and the first command line argument, if it exists, is always `$1`.

Executing `cla.sh` will generate the following output:

    ./cla.sh 1 2 3

{{< output >}}
Arguments: 1 2 3
Number of arguments: 3
1
2
3
The name of the script is: ./cla.sh
The first argument is: 1
./cla.sh file exists!
{{< /output >}}

### Checking the Number of Command Line Arguments

In the previous section you learned how to pass command line arguments to a bash script. The following bash script, which is named `nCla.sh`, requires that you pass at least two command line arguments to it:

{{< file "nCla.sh" bash >}}
#!/bin/bash

if [ "$#" -lt 2 ]
then
    echo Need more arguments than $#!
else
    echo "Thanks for the $# arguments!"
fi
{{< /file >}}

Notice that numeric comparisons require the use of `-lt` in an `if` statement, which
is an alias for `less than`.

Executing `nCla.sh` with the right number of arguments will generate the following
output:

    ./nCla.sh 1 2

{{< output >}}
Thanks for the 2 arguments!
{{< /output >}}

Executing `nCla.sh` with an insufficient number of arguments will generate the following
output:

    ./nCla.sh

{{< output >}}
Need more arguments than 0!
{{< /output >}}

### Combining Commands in bash Scripts

Bash has the additional capability of executing a combination of commands. This capability is illustrated in
`combine.sh`:

{{< file "combine.sh" bash >}}
#!/bin/bash

total=0
for n in ./*.sh
do
    ti=`grep while ${n} | wc -l`
    ti=$(($ti + 0))
    if [[ $ti -gt 0 ]]
    then
        total=$(($total+$ti))
    fi
done

echo "Total:" $total
{{< /file >}}

The `for` loop in this example iterates over every bash script file in the current working directory.
The initial value of `ti` is taken from the output of a command with two parts. The first part uses
`grep` to look for the `while` word in the file that is being processed and the
second part counts the number of times that the `while` word was found in the
current file. The `total=$(($total+$ti))` statement is needed for adding the value of `ti` to
the value of `total`. Additionally, the `ti=$(($ti + 0))` statement is used for
converting the value of `ti` from string to integer. Last,  before exiting, `combine.sh` prints the total number of times the
`while` word was found in all processed files.

    ./combine.sh

{{< output >}}
Total: 2
{{< /output >}}

## The Case Statement

The bash scripting language supports the `case` statement. A case statement provides a number of possible values for a variable and maps code blocks to those values. For example, the case statement included in `case.sh` script below defines a number of possible outputs depending on the number provided as a command line argument:

{{< file "case.sh" bash >}}
#!/bin/bash

if [ $# -lt 1 ]
then
    echo "Usage : $0 integer"
    exit
fi

NUM=$1
echo "Testing ${NUM}"

if [[ ! $NUM =~ ^[0-9]+$ ]] ; then
    echo "Not an integer"
    exit
fi

case $NUM in
    0)
        echo "Zero!"
        ;;
    1)
        echo "One!"
        ;;
    ([2-9]|[1-7][0-9]|80) echo "From 2 to 80"
        ;;
    (8[1-9]|9[0-9]|100) echo "From 81 to 100"
        ;;
    *)
        echo "Too big!"
        ;;
esac

case  1:${NUM:--} in
(1:*[!0-9]*|1:0*[89]*)
    ! echo NAN
;;
($((NUM<81))*)
    echo "$NUM smaller than 80"
;;
($((NUM<101))*)
    echo "$NUM between 81 and 100"
;;
($((NUM<121))*)
    echo "$NUM between 101 and 120"
;;
($((NUM<301))*)
    echo "$NUM between 121 and 300"
;;
($((NUM>301))*)
    echo "$NUM greater than 301"
;;
esac
{{< /file >}}

The script requires a command line argument, which is an integer value. A regular
expression verifies that the input is a valid positive integer number with the
help of an `if` statement.

From the presented code you can understand that branches in `case` statements do
not offer direct support for numeric ranges, which makes the code more complex.
If you find the code difficult to understand, you may also use multiple `if`
statements instead of a `case` block.

`case.sh` illustrates two ways of supporting ranges in a `case` statement. The first
one uses regular expressions (which are divided by the OR operator, a pipe `|`), whereas the second offers ranges through a different approach.
Each expression such as `(NUM<81)` is evaluated and if it is `true`, the code in the
respective branch is executed. Notice that the order of the branches is significant because
only the code from the first match will be executed.

Executing `case.sh` will generate the following output:

    ./case.sh 12

{{< output >}}
Testing 12
From 2 to 80
12 smaller than 80
{{< /output >}}

If you give `case.sh` a different input, you will get the following output:

    ./case.sh 0
{{< output >}}
Testing 0
Zero!
0 smaller than 80
{{< /output >}}


## File and Directory Basics

### Working with Files and Directories

One often important operation that you may find yourself needing to perform is specifying
whether a given file or directory actually exists. This is idea is illustrated in `files.sh`:

{{< file "files.sh" bash >}}
#!/bin/bash

if [[ $# -le 0 ]]
then
    echo Not enough arguments!
fi

for arg in "$@"
do
    # Does it actually exist?
    if [[ -e "$arg" ]]
    then
        echo -n "$arg exists "
    fi

    # Is it a file or Is it a directory?
    if [ -f "$arg" ]
    then
        echo "and is a regular file!"
    elif [ -d "$arg" ]
    then
        echo "and is a regular directory!"
    else
        echo "and is neither a regular file nor a regular directory!"
    fi
done
{{< /file >}}

The `-e` operator will check whether a file exists regardless of its type – this
is the first test that we are performing. The other two tests use `-f` and `-d`
for specifying whether we are dealing with a regular file or a directory,
respectively. Last, the `-le` operator stands for `less than or equal` and is used
for comparing numeric values.

Executing `files.sh` will generate the following output:

    ./files.sh /tmp aFile /dev/stdin

{{< output >}}
/tmp exists and is a regular directory!
aFile exists and is a regular file!
/dev/stdin exists and is neither a regular file nor a regular directory!
{{< /output >}}

The following bash script will accept one command line argument, which is a string you'd like to find, and then a list of files that will be searched for that given string. If there is a match, then the filename of the file will appear on the screen.

{{< file "match.sh" bash >}}
#!/bin/bash

if [[ $# -le 1 ]]
then
    echo Usage: $0 string files!
fi

string=$1
for arg in "${@:2}"
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
        ti=`grep ${string} ${arg} | wc -l`
        ti=$(($ti + 0))
        if [[ $ti -gt 0 ]]
        then
            echo ${arg}
        fi
    else
        echo "* $arg is not a regular file!"
    fi
done
{{< /file >}}

The `"${@:2}"` notation allows you to skip the first element from the list
of command line arguments because this is the string that we will be looking for
in the list of files that follow.

Executing `match.sh` will generate the following output:

    ./match.sh while *.sh /tmp /var/log ./combine.sh doesNotExist

{{< output >}}
combine.sh
loops.sh
* /tmp is not a regular file!
* /var/log is not a regular file!
./combine.sh
* Skipping doesNotExist
{{< /output >}}

In part 2 of the bash scripting guides you will learn more about working with files and
directories with the bash scripting language.

## Summary

The scripting language of bash can do many more things than the ones presented in
this guide. The next part of this guide will present more interesting bash shell
scripts and shed more light into topics such as working with files and directories,
the `printf` command, the `select` statement and reading files. Another interesting usage of Bash shell scripting is using it to customize Git, the version control system. Our guide [Creating Git Aliases](/docs/guides/creating-git-aliases/) includes a Bash script example.
