---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'An introduction to bash shell programming - part 3'
keywords: ["UNIX", "shell", "bash", "Linux", "programming"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-08-30
modified_by:
  name: Linode
title: 'Solving real world problems with bash scripts'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[GNU Bash](https://www.gnu.org/software/bash/)'
---

## Introduction

The purpose of this guide is to present some of the advanced capabilities of the bash shell by showing practical and fully functional bash scripts and by illustrating how you can work with dates and times in bash scripts and how to write and use functions in bash.

{{< note >}}
This guide is written for a non-root user. Depending on your configuration, some commands might require the help of `sudo` in order to get property executed. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Functions in bash shell

The bash scripting language has support for functions. The parameters of a function can be accessed as `$1`, `$2`, etc. and you can have as many parameters as you want. If you are interested in finding out the name of the function, you can use the `FUNCNAME` variable. Functions are illustrated in `functions.sh`, which is as follows:

    {{< file "functions.sh" bash >}}
#!/bin/bash

function f1 {
    echo Hello from $FUNCNAME!
    VAR="123"
}

f2() {
    p1=$1
    p2=$2
    sum=$((${p1} + ${p2}))
    echo "${sum}"
}

f1
echo ${VAR}

mySum="$(f2 1 2)"
echo mySum = $mySum

mySum="$(f2 10 -2)"
echo mySum = $mySum
{{< /file >}}

There exist two ways to define a function in bash: writing `functionName()` followed by the implementation of the function or writing `function functionName` followed by the implementation of the function. In both cases you will need to include the function body in curly braces (`{}`. The presented script defines two functions, named `f1()` and `f2()`. The first function does not require any parameters whereas the second function expects two numeric parameters. As you can see from `f2()`, you do not need to define the parameters in the function signature. The only thing that can be returned from a bash function is the return status (`$?`)! If you need to return one or more values from a function, you have two choices. The first one is to store it to a global variable. The second one is to assign the desired return value to a variable and `echo` that variable in your function before the function returns. `f1()` uses the first technique, whereas `f2()` uses the second technique.

    ./functions.sh
    {{< output >}}
Hello from f1!
123
mySum = 3
mySum = 8
{{< /output >}}

Notice that if you want to check whether a function parameter exists or not, you can use a `if [ -z "$1" ]` statement.

### Using bash Functions as Shell Commands

This is a trick that allows you to use bash functions as shell commands. If you put the `f1` function implementation in a text file named `my_function.sh`, then you can execute its code as `. ./my_function.sh` (please notice the dot in front of the text file). After than you can use `f1` as a regular command in the terminal where you executed `. ./my_function.sh`. If you want that function to be globally available, you can put its implementation to a bash configuration file that is automatically executed by bash each time a new bash session begins. A good place to put that function implementation would be `~/.bash_profile`.

## Working with Dates and Times

Bash allows you to work with dates and times using traditional UNIX utilities such as `date(1)`. The main problem when working with dates and times is getting or using the format you really want – this is a problem of using `date(1)` with the correct parameters and has nothing to be with bash scripting per se. Using `date(1)` as `date +[something]` means that we want to use a custom format – this is signified by the use of `+` in the command line argument of `date(1)`.

A pretty cool way to create unique filenames is to use UNIX epoch time or, if you want your filename to be more descriptive, a date-time combination. The uniqueness in the filename comes from the fact that if you use a great accuracy in the time part, you will not have the same time value even if you execute the script multiple times on the same UNIX machine..

The example that follows will shed some light on the use of `date(1)`.

### Using Dates and Times in bash scripts

The code of `dateTime.sh` is the following:

    {{< file "dateTime.sh" bash >}}
#!/bin/bash

# Print default output
echo `date`

# Print current date without the time
echo `date +"%m-%d-%y"`

# Use 4 digits for year
echo `date +"%m-%d-%Y"`

# Display time only
echo `date +"%T"`

# Display 12 hour time
echo `date +"%r"`

# Time without seconds
echo `date +"%H:%M"`

# Print full date
echo `date +"%A %d %b %Y %H:%M:%S"`

# Nanoseconds
echo Nanoseconds: `date +"%s-%N"`

# Different timezone by name
echo Timezone: `TZ=":US/Eastern" date +"%T"`
echo Timezone: `TZ=":Europe/UK" date +"%T"`

# Print epoch time - convenient for filenames
echo `date +"%s"`

# Print week number
echo Week number: `date +"%V"`

# Create unique filename
f=`date +"%s"`
touch $f
ls -l $f
rm $f

# Add epoch time to existing file
f="/tmp/test"
touch $f
mv $f $f.`date +"%s"`
ls -l "$f".*
rm "$f".*
{{< /file >}}

If you want a truly unique filename, you can use nanoseconds in the time part.

The output of `dateTime.sh` will resemble the following:

    ./dateTime.sh
    {{< output >}}
Fri Aug 30 13:05:09 EEST 2019
08-30-19
08-30-2019
13:05:09
01:05:09 PM
13:05
Friday 30 Aug 2019 13:05:09
Nanoseconds: 1567159562-373152585
Timezone: 06:05:09
Timezone: 10:05:09
1567159509
Week number: 35
-rw-r--r--  1 mtsouk  staff  0 Aug 30 13:05 1567159509
-rw-r--r--  1 mtsouk  wheel  0 Aug 30 13:05 /tmp/test.1567159509
{{< /output >}}

## Bash scripts for Administrators

This section will present some bash scripts that are helpful for UNIX system administrators and power users.

### Watching Free Disk Space

The bash script that follows watches the free space of your hard disks and warns you when that free space is below a given threshold – the value  of the threshold is given by the user as a command line argument. Notice that if the program gets no command line argument, a default value is given to the threshold.

    {{< file "freeDisk.sh" bash >}}
#!/bin/bash

PERCENT=30

if [[ $# -le 0 ]]
then
    printf "Using default value for threshold!\n"
else
    if [ $1 -eq $1 2>/dev/null ]
    then
        PERCENT=$1
    fi
fi

let "PERCENT += 0"
printf "Threshold = %d\n" $PERCENT

df -Ph | grep -vE '^Filesystem|tmpfs|cdrom' | awk '{ print $5,$1 }' | while read data;
do
    used=$(echo $data | awk '{print $1}' | sed s/%//g)
    p=$(echo $data | awk '{print $2}')
    if [ $used -ge $PERCENT ]
    then
        echo "WARNING: The partition \"$p\" has used $used% - Date: $(date)"
    fi
done
{{< /file >}}

The `sed s/%//g` command is used for omitting the percent sign from the output of `df -Ph`. Also, `awk(1)` is used for extracting the desired fields from output of the `df(1)` command.

The output of `freeDisk.sh` will resemble the following:

    ./freeDisk.sh
    {{< output >}}
Using default value for threshold!
Threshold = 30
WARNING: The partition "/dev/root" has used 61% - Date: Wed Aug 28 21:14:51 EEST 2019
{{< /output >}}

{{< note >}}
This kind of scripts can be easily executed as cron jobs and automate things the UNIX way.
{{< /note >}}

Notice that the code of `freeDisk.sh` looks relatively complex. This mainly happens because bash is not that good at working with numeric values and converting between strings and numbers – more than half of the code is for initializing the `PERCENT` variable correctly.

### Rotating Log Files

The presented bash script will help you rotate a log file, which is a very common job, after exceeding a given size. If the log file is connected to a server process, you might need to stop the process before the rotation and starting it again after the log rotation is done – this is not the case with `rotate.sh`.

    {{< file "rotate.sh" bash >}}
#!/bin/bash

f="/home/mtsouk/connections.data"

if [ ! -f $f ]
then
  echo $f does not exist!
  exit
fi

touch ${f}
MAXSIZE=$((4096*1024))

size=`du -b ${f} | tr -s '\t' ' ' | cut -d' ' -f1`
if [ ${size} -gt ${MAXSIZE} ]
then
    echo Rotating!
    timestamp=`date +%s`
    mv ${f} ${f}.$timestamp
    touch ${f}
fi
{{< /file >}}

Please notice that the value of `MAXSIZE` is totally arbitrary and it is up to you to decide that threshold – you can even make changes to the existing code and provide that value as a command line argument to the program.

The output of `rotate.sh` will resemble the following:

    ./rotate.sh
    {{< output >}}
Rotating!
{{< /output >}}

After that, there will be the following two files on the Linux system:

    ls -l connections.data*
    {{< output >}}
-rw-r--r-- 1 mtsouk mtsouk       0 Aug 28 20:18 connections.data
-rw-r--r-- 1 mtsouk mtsouk 2118655 Aug 28 20:18 connections.data.1567012710
{{< /output >}}

If you want to make `rotate.sh` more generic, you can provide the name of the log file as a command line argument to the bash script.

### Monitoring the Number of TCP Connections

The presented bash script calculates the number of TCP connections at the current machine and prints that on the screen along with date and time related information.

    {{< file "tcpConnect.sh" bash >}}
#!/bin/bash

C=$(/bin/netstat -nt | tail -n +3 | grep ESTABLISHED | wc -l)
D=$(date +"%m %d")
T=$(date +"%H %M")
printf "%s %s %s\n" "$C" "$D" "$T"
{{< /file >}}

The main reason for using the full path of `netstat(1)` when calling it is to make the script as secure as possible - if you do not provide the full path then the script will search all the directories of the `PATH` variable to find that executable file. Apart from the number of connections, the script prints the month, day of the month, hour of the day and minutes of the hour. If you want, you can also print the year in the date part and the seconds in the time part.

    ./tcpConnect.sh
    {{< output >}}
8 08 28 16 22
{{< /output >}}

`tcpConnect.sh` can be easily executed as a `cron(8)` job as follows:

    */4 * * * * /home/mtsouk/bin/tcpConnect.sh >> ~/connections.data    

The previous `cron(8)` job executes `tcpConnect.sh` every 4 minutes, every hour of each day and appends the results to `~/connections.data` in order to be able to watch or visualize them at any time.

## Additional Examples

### Sorting in bash

The presented example will show how you can sort integer values in bash using the `sort(1)` utility:

    {{< file "sort.sh" bash >}}
#!/bin/bash

if [[ $# -le 0 ]]
then
    printf "Not enough arguments!\n"
    exit
fi

count=1

for arg in "$@"
do
    if [ $arg -eq $arg 2>/dev/null ]
    then
        n[$count]=${arg}
        let "count += 1"
    else
        echo "$arg is not a valid integer!"
    fi
done

sort -n <(printf "%s\n" "${n[@]}")
{{< /file >}}

The presented technique uses an *array* to store all integer values before sorting them. All numeric values are given as command line arguments to the script. The sorting part is done using `sort -n`, which sorts things numerically. If you want to deal with strings, then you should omit the `-n` flag. The `printf` command after `sort -n` prints every element of the array in a separate line whereas the `<` character tells `sort -n` to use the output of `printf` as input. Last, the script tests whether each command line argument is a valid integer before adding it to the `n` array.

The output of `sort.sh` will resemble the following:

    ./sort.sh 100 a 1.1 1 2 3 -1
    {{< output >}}
a is not a valid integer!
1.1 is not a valid integer!
-1
1
2
3
100
{{< /output >}}

### A Game Written in bash

This section will present a simple guessing game written in `bash(1)`. The logic of the game is based on a random number generator that produces random numbers between 1 and 20 and expects from the user to guess them.

    {{< file "guess.sh" bash >}}
#!/bin/bash

echo "$0 - Guess a number between 1 and 20"

(( secret = RANDOM % 20 + 1 ))

while (( guess != secret )); do
    num=$((${num} + 1))
    read -p "Enter guess: " guess

    if (( guess < $secret )); then
        echo "Try higher..."
    elif (( $guess > $secret )); then
        echo "Try lower..."
    fi
done

printf "It took you $num guesses.\n"
{{< /file >}}

The output of `guess.sh` will resemble the following:

    ./guess.sh
    {{< output >}}
./guess.sh - Guess a number between 1 and 20
Enter guess: 1
Try higher...
Enter guess: 5
Try higher...
Enter guess: 7
Try lower...
Enter guess: 6
It took you 4 guesses.
{{< /output >}}

### Calculating letter frequencies

The presented bash script will calculate the number of times each letter appears on a file.

    {{< file "freqL.sh" bash >}}
#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 filename."
    exit 1
fi

filename=$1

while read -n 1 c
do
    echo "$c"
done < "$filename" | grep '[[:alpha:]]' | sort | uniq -c | sort -nr
{{< /file >}}

The script reads the input file character by character, prints each character and processes the output using the `grep`, `sort` and `uniq` commands in order to count the frequency of each character. The `[:alpha:]` pattern used by `grep(1)` matches all alphabetic characters and is equivalent to `A-Za-z`. If you also want to include numeric characters in the output, you should use `[:alnum:]` instead.

The output of `freqL.sh` will resemble the following:

    ./freqL.sh text
    {{< output >}}
   2 b
   1 s
   1 n
   1 i
   1 h
   1 a
{{< /output >}}

Last, if you want the output to be sorted alphabetically instead of numerically, you should execute `freqL.sh` and then process its output using the `sort -k2,2` command.

### Timing Out read Operations

The `read` builtin command supports the `-t timeout` option that allows you to time out a read operation after a given time, which can be very convenient when you are expecting user input that takes too long. The technique is illustrated in `timeOut.sh`.

    {{< file "timeOut.sh" bash >}}
#!/bin/bash

if [[ $# -le 0 ]]
then
    printf "Not enough arguments!\n"
    exit
fi

TIMEOUT=$1

while :
do
  read -t $TIMEOUT -p "Do you want to Quit(Y/N): "
  if [ $? -gt 128 ]; then
    echo "Timing out - user response took too long!"
    break
  fi

  case $REPLY in
  [yY]*)
    echo "Quitting!"
    break
    ;;
  [nN]*)
    echo "Do not quit!"
    break
    ;;
  *) echo "Please choose Y or N!"
     ;;
  esac
done
{{< /file >}}

The timeout of the `read` operation is given as a command line argument to the script. The `case` block is what handles the available options. Notice that what you are going to do in each case is up to you – the presented code uses simple commands to illustrate the technique.

The output of `timeOut.sh` will resemble the following:

    ./timeOut.sh 2
    {{< output >}}
Do you want to Quit(Y/N): Please choose Y or N!
Do you want to Quit(Y/N): Y
Quitting!
{{< /output >}}

### Converting tabs to spaces

The presented utility, which is named `t2s.sh`, will read a text file and convert each tab to the specified number of space characters. Notice that the presented script replaces each tab character with 4 spaces but you can change that value in the code or even get it as command line argument.

    {{< file "t2s.sh" bash >}}
#!/bin/bash

for f in "$@"
do
    if [ ! -f $f ]
    then
      echo $f does not exist!
      continue
    fi
    echo "Converting $f.";
    newFile=$(expand -t 4 "$f");
    echo "$newFile" > "$f";
done
{{< /file >}}

The script uses the `expand(1)` utility that does the job of converting tabs to spaces for us. `expand(1)` writes its results to standard output – the script saves that output and replaces the current file with the new output, which means that the original file will change. Although `t2s.sh` does not use any fancy techniques or code, it does the job pretty well.

The output of `t2s.sh` will resemble the following:

    ./t2s.sh textfile
    {{< output >}}
Converting textfile.
{{< /output >}}

### Counting files

The presented script will look into a predefined list of directories and count the number of files that exist in each directory and its subdirectories. If that number of above a threshold, then the script will generate a warning message.

    {{< file "./countFiles.sh" bash >}}
#!/bin/bash

DIRECTORIES="/bin:/home/mtsouk/code:/srv/www/www.mtsoukalos.eu/logs:/notThere"

if [[ $# -le 0 ]]
then
    printf "Not enough arguments!\n"
    exit
fi

if [ $1 -eq $1 2>/dev/null ]
then
    COUNT=$1
else
    echo "Using default value for COUNT!"
    COUNT=50
fi

while read -d ':' dir; do
    if [ ! -d "$dir" ]
    then
        echo "**" Skipping $dir
        continue
    fi
    files=`find $dir -type f | wc -l`
    if [ $files -lt $COUNT ]
    then
        echo "Everything is fine in $dir: $files"
    else
        echo "WARNING: Large number of files in $dir: $files!"
    fi
done <<< "$DIRECTORIES:"
{{< /file >}}

The counting of the files is done with the `find $dir -type f | wc -l` command.

The output of `countFiles.sh` will resemble the following:

    ./countFiles.sh 100
    {{< output >}}
WARNING: Large number of files in /bin: 118!
Everything is fine in /home/mtsouk/code: 81
WARNING: Large number of files in /srv/www/www.mtsoukalos.eu/logs: 106!
** Skipping /notThere
{{< /output >}}

## Summary

The bash scripting language is a powerful programming language that can save you time and energy once you spend some time to learn it. If you have lots of useful bash scripts, then you can automate things by creating cron jobs that execute your bash scripts. It is up to the developer to decide whether they prefer to use bash or a different scripting language such as perl, ruby or python.
