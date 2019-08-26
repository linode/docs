---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'An introduction to bash shell programming - part 2.'
keywords: ["UNIX", "shell", "bash"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-08-26
modified_by:
  name: Linode
title: 'Writing more interesting bash scripts'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[GNU Bash](https://www.gnu.org/software/bash/)'
---

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

Talking more about the `printf` command is beyond the scope of this guide.

## File and Directory Test Operators

The scripting language of bash offers a plethora of operators that allow you to work with all kinds of files including regular files and directories – each operator returns either `true` or `false` depending on the result of the performed test. The list includes the following operators, which should all be followed by a path to a UNIX file:

| Command | Description |
| `-a` | File exists. |
| `-b` | File exists and is a block special file. |
| `-c` | File exists and is a character special file. |
| `-d` | File exists and is a directory. |
| `-e` | File exists and is a file of any type (node, directory, socket, etc.). |
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
#!/bin/bash

if [[ $# -le 0 ]]
then
	echo Usage: $0 files!
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

    [ -r "$arg" -a -d "$arg" ] && echo "* $arg is a readable directory."
    [[ -r "$arg" && -f "$arg" ]] && echo "* $arg is a readable regular file."
done
{{< /file >}}

Notice that you can avoid using `if` statements if you use `[]` or `[[]]` instead, depending on whether you are using `-a` or `&&`, respectively. You can perform as many tests as you want but use common sense in order to create compact and readable code.

On the UNIX command line, execute `fileOps.sh` as follows:

    ./fileOps.sh /dev/fd/2
    {{< output >}}
* /dev/fd/2 is not a regular file!
* /dev/fd/2 is not a directory.
* /dev/fd/2 is not executable.
* /dev/fd/2 is not a symbolic link.
* /dev/fd/2 has zero size.
{{< /output >}}

If you try to test a directory, the output of `fileOps.sh` will be similar to the next:

    ./fileOps.sh /var/log
    {{< output >}}
* /var/log is not a regular file!
* /var/log is a directory.
* /var/log is executable.
* /var/log is not a symbolic link.
* /var/log has nonzero size.
* /var/log is a readable directory.
{{< /output >}}

## Working With Files and Directories

### Reading a file line by line

The presented bash shell script will illustrate how you can read a text file line by line.

	{{< file "lByL.sh" bash >}}
#!/bin/bash

if [[ $# -le 0 ]]
then
	echo Usage: $0 filename!
	exit
fi

f=$1

if [ ! -f "$f" ]
then
	echo "File does not exist!"
fi

while IFS='' read -r line || [[ -n "$line" ]]; do
    echo "$line"
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
#!/bin/bash

if [[ $# -le 0 ]]
then
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
#!/bin/bash

if [[ $# -le 0 ]]
then
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
#!/bin/bash

if [[ $# -le 1 ]]
then
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
#!/bin/bash

set -e

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
