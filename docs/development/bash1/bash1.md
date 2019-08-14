---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'An introduction to bash shell scripting.'
keywords: ["UNIX", "shell", "bash", "programming"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-08-14
modified_by:
  name: Linode
title: 'Learning to program the scripting language of the bash shell'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[GNU Bash](https://www.gnu.org/software/bash/)'
---

## Introduction

This guide is an introduction to bash shell programming with many handy code examples.
Among other things, you will learn about loops, variables, getting user input and working
with files and directories using the programming language provided by the `bash(1)` shell.

{{< note >}}
This guide is written for a non-root user. Depending on your configuration, some commands might require the help of `sudo` in order to get property executed. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## The bash executable

The executable file for the bash shell can be usually found inside `/bin` – its full
path is `/bin/bash`. Please have that path in mind as it will be used in all
presented bash scripts. After all, the bash shell is just another executable file.

## Bash Scripts

The following code is the "Hello World" program written in `bash(1)`:

{{< file "hw.sh" bash >}}
#!/bin/bash

echo "Hello World!"
{{< /file >}}

The first line is required for the bash script to become autonomous and be executed
as a command. The `.sh` file extension is not required but it is good to have it in
order to inform people that this is a shell script and not a binary file.

Notice that `echo` is a bash shell built-in command. All shells have their own built-in
commands.

In order for a bash script to be executable, it needs to have the appropriate
file permissions. The easiest way to make a bash script executable is to execute
the `chmod +x file.sh` command. After that you can execute it as `./file.sh`.
Alternatively you can execute `chmod 755 file.sh`.

Therefore, for the `hw.sh` script to become executable, you will need to run one
of the following two commands:

    chmod +x hw.sh
	chmod 755 hw.sh

After that the file permissions of `hw.sh` will be similar to the following:

    ls -l hw.sh
{{< output >}}
-rwxr-xr-x 1 mtsouk  staff  32 Aug  1 20:09 hw.sh
{{< /output >}}

Executing `hw.sh` will generate the following output:

    ./hw.sh
{{< output >}}
Hello World!
{{< /output >}}

The `./` in front of the script name tells bash that the file you want to execute is
in the current directory and is necessary for executing any file that is not located
in the `PATH` – the `PATH` *environment variable* contains a list of directories that
bash will search through for executable commands. You can execute `echo $PATH` to find
its current value.

{{< note >}}
You will need to give all bash scripts of this guide the execute file permission
in order to be able to execute them as regular UNIX commands.
{{< /note >}}

{{< note >}}
The `#` character is used for adding single line comments in bash scripts. The bash shell
also supports multi line comments but they are not being used so often so it would be
better to use multiple single line comments when you want to write bigger comment blocks.
{{< /note >}}

## Defining and using Variables

The programming language of the bash shell has support for variables. Variables
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

There exist two variables here: the first one is called `VAR1` and the second one
is called `myVar`. Although both variables are defined inside the program, the first
variable is defined with a direct assignment whereas the second variable is defined
as the output of an external program, the `pwd(1)` command. The value of `myVar` depends
on your place in the filesystem.

The two variables are read as `${VAR1}` and `$myVar`, respectively – both notations work.
Notice that in order to prevent `echo` from printing a newline character, you will have to
call it as `echo -n`. Last, notice that `"$(pwd)"` and `` `pwd` `` are equivalent.

Executing `vars.sh` will generate the following kind of output:

    ./vars.sh
{{< output >}}
My name is Mihalis
and I work from /home/mtsouk/
/home/mtsouk/
{{< /output >}}

## Getting User Input

The bash shell offers the `read` command for getting user input. However, this is
rarely used because it makes bash shell scripts less autonomous. Nevertheless, the
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

Two of the sections that follow will show two alternative ways for getting user input that
are more common in the UNIX world than the `read` command.

## Using UNIX Environment Variables

In this section of the guide you will learn how to read a UNIX environment variable,
change its value, delete it and create a new one. This is a very popular way of
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

Notice that `PATH` is automatically available to the bash script. The `-z` operator
tests whether a variable has a length of zero or not and can be pretty handy when
checking if an environment variable is set or not.

Executing `env.sh` will create the following kind of output:

    ./env.sh
{{< output >}}
PATH: /usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/texbin:/opt/X11/bin
PATH: /usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/texbin:/opt/X11/bin:/tmp
PATH is empty!
MYPATH: /bin:/sbin:/usr/bin
{{< /output >}}

{{< note >}}
Notice that all changes to environment variables that take place inside a bash
script will be lost when that bash script ends because they have a local scope.
{{< /note >}}

## The if statement

The bash shell supports the `if` statement using a somehow strange syntax, which
is illustrated in `whatIf.sh`:

{{< file "whatIf.sh" bash >}}
#!/bin/bash

VAR1="4 "
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

So, `if` statements in bash script use square brackets for the condition part and also
have support for `else` and `elif` branches.

As filenames and paths may contain space characters, it is good to embed them in double
quotes – this has nothing to do with the `if` statement per se. Notice that this unofficial
rule applies to other variables that might contain space characters in them. This is
illustrated with the use of the `VAR1` variable. Last, the `==` operator is for checking
string values for equality.

    ./whatIf.sh
{{< output >}}
Equal!
Not equal!
Not equal!
{{< /output >}}

The `if` statement is used extensively in bash scripts, which means that you are going to
see it many times in this guide.

## Loops

The bash shell has support for loops, which are going to be illustrated in this section
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

The code of `loops` begins with three `for` loops before presenting a `while` loop and
an `until` loop. Notice that the third `for` loop processes the output of `./c*.sh`,
which is equivalent to the output of the `ls ./c*.sh` command – this is a pretty handy
way of selecting and processing files from the Linux filesystem.

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

The bash scripting language offers support for the `break` and `continue` statements
for exiting a loop and for skipping the current iteration, respectively.

## Command Line Arguments

The easiest and most common way to pass your own data to scripts is the use of command
line arguments. The `cla.sh` bash script shows ways for working with command line
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

The name of the program is always `$0` and the first command line argument, if it
exists, is always `$1`. The full list of arguments is stored as `$@` and the
number of arguments is stored as `$#`. Last, a `for` loop can be used for iterating
over the list of command line arguments.

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

## Checking the number of command line arguments

The following bash script, which is named `nCla.sh` requires that you pass at least
two command line arguments to it:

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

## The case statement

The bash scripting language supports the `case` statement, which is illustrated
in `case.sh`:

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
not offer direct support for numeric ranges, which makes the code pretty complex.
If you find the code difficult to understand, you can always use multiple `if`
statements instead of a `case` block.

`case.sh` illustrates two ways of supporting ranges in a `case` statement. The first
one uses regular expressions whereas the second one offers ranges but in an unusual way.
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

## Combining commands in bash scripts

The greatness of UNIX comes not from the execution of single commands but from
the execution of a combination of commands. This capability is illustrated in
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

The `total=$(($total+$ti))` statement is needed for adding the value of `ti` to
the value of `total`. Additionally, the `ti=$(($ti + 0))` statement is used for
converting the value of `ti` from string to integer. Last, the initial value of
`ti` is taken from the output of a command with two parts. The first part uses
`grep` to look for the `while` word in the file that is being processed and the
second part counts the number of times that the `while` word was found in the
current file. Before exiting, `combine.sh` prints the total number of times the
`while` word was found in all processed files.

    ./combine.sh
{{< output >}}
Total: 2
{{< /output >}}

## Working with Files and Directories

The single most important operation that you are going to need to perform is specifying
whether a given file or directory actually exists. This will be illustrated using the
code of `files.sh`:

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

In part 2 of the bash scripting guides you will learn more about working with files and
directories with the bash scripting language.

## Finding all text files that match a given string

The presented bash script will accept one command line argument, that is the string
that interests you, and a list of files that will be searched for that given string.
If there is a match, then the filename of the file will appear on the screen.

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

## Summary

The scripting language of bash can do many more things than the ones presented in
this guide. The next part of this guide will present more interesting bash shell
scripts and shed more light into topics such as working with files and directories,
the `printf` command, the `select` statement and reading files.
