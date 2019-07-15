---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'An Introduction to AWK'
keywords: ["UNIX", "shell", "AWK"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-07-12
modified_by:
  name: Linode
title: 'Learn the AWK Programming Language'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[GNU awk](https://www.gnu.org/software/gawk/)'
---

## Before You Begin

{{< note >}}
This guide is written for a non-root user. Depending on your configuration, some commands might require the help of `sudo` in order to get property executed. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## An Introduction to AWK

The name AWK is derived from the family names of its three authors:
[Alfred Aho](https://en.wikipedia.org/wiki/Alfred_Aho), [Peter Weinberger](https://en.wikipedia.org/wiki/Peter_J._Weinberger) and [Brian Kernighan](https://en.wikipedia.org/wiki/Brian_Kernighan) and is a handy *pattern matching* programming language that is *Turing-complete*, which means that AWK is a fully featured programming language. AWK is often mentioned in the same sentence with [sed](https://www.gnu.org/software/sed/manual/sed.html), which is another traditional UNIX command line tool. However, `sed` is more appropriate for one line UNIX shell commands and is typically used only for text processing.

AWK allows you to do analysis, extraction, and reporting of data and supports arrays, associative arrays, functions, variables, loops, and regular expressions.

Current Linux systems use an improved version of the original AWK utility. The biggest difference between these new variants and the original version of AWK is that they support a larger set of built-in functions and variables.

{{< note >}}
Input is read either from standard input or from files specified as command line arguments. Additionally, this input is read one record at a time. By default each line defines a new record. After a record is read, it is automatically split into fields. AWK does not alter the original input.
{{< /note >}}

### The versions of AWK

There are many versions of AWK available, the most widely used are: `gawk`, `mawk`, and `nawk`.

 - `gawk` or GNU-AWK, was introduced back in 1986.  `gawk` is a powerful and popular version of AWK that is included in some Linux distributions as their default AWK implementation. Find more information about `gawk` in [here](https://www.gnu.org/software/gawk/).

 - Michael Brennan wrote another AWK variant named `mawk`. Find more information about `mwak` [here](https://invisible-island.net/mawk/).

 - Brian Kernighan programmed BWK-AWK or `nawk`. `nawk` is often called the *One True AWK* because it was written by one of the original authors. You can find more information about `nawk` [here](https://linux.die.net/man/1/nawk).

To find the version of AWK you are using, execute the following:

{{< file >}}
if awk --version 2>&1 | grep -q "GNU Awk"
then
    awk 'BEGIN {print "I am gawk"}'

elif awk -Wv 2>&1 | grep -q "mawk"
then
    awk 'BEGIN {print "I am mawk"}'

else
    awk 'BEGIN {print "I am probably nawk, might not be"}'
fi
{{< /file >}}

{{< note >}}
This guide uses the `gawk` version of AWK.
{{< /note >}}

## The Hello World Program in AWK

The *Hello World!* program in AWK can be written in two ways. The first is a command line version; the second is saving the AWK code into a separate file and then executing that file. If you want to reuse your code later, it is better to store your AWK code in a file.

### Command Line Version Hello World

1.  Execute the command as follows:

        awk 'BEGIN { print "Hello World!" }'

1.  The output will be as follows:

    {{< output >}}
Hello World!
{{< /output >}}

    When an AWK program contains the `BEGIN` pattern **only**, then it will not process any input files, which is the reason that it just prints the desired message before exiting.

### The File Version Hello World

In this subsection you will learn how to store AWK code in a file and execute it from there.

1.  Create a file called `helloworld.awk` with the following:

    {{< file "helloworld.awk" awk >}}
BEGIN { print "Hello World!" }
{{< /file >}}

1.  Execute `helloworld.awk` as follows:

        awk -f hw.awk

1.  The output will be as follows:

    {{< output >}}
Hello World!
{{< /output >}}

1.  Open `helloworld.awk` and add a bash script line to the top as follows and save it without the `awk` extension as `helloworld`:

    {{< file "helloworld" bash >}}
#!/usr/bin/awk -f

BEGIN { print "Hello World!" }
{{< /file >}}

    The ``#!/usr/bin/awk -f`` line defines the starting of the script execution and it allows us to choose the correct shell or in this case the correct program that will be used for executing the commands and statements
that follow.

1.  Give execute permissions to `helloworld` by running the following command:

        chmod +x helloworld

1.  Execute `helloworld`:

        ./helloworld

1.  The output will be as follows:

    {{< output >}}
Hello World!
{{< /output >}}

## Variables in AWK

AWK supports two kinds of variables, predefined and user defined. Predefined variables are defined by AWK itself whereas user defined variables, which are case sensitive, are defined by the developer.

### Predefined Variables

AWK has many built-in variables that are automatically initialized. Some of the most important ones are the following:

| Variable | Definition |
| --- | --- |
| `NF` | Holds the number of fields in the current input record. Notice that each record can have a different number of fields. |
| `FS` | The input field separator. Its default value is the single space but it also matches any sequence of spaces and tabs. Additionally, any number of leading or trailing spaces and tabs is being ignored. If the value of `FS` becomes the null string, then each character in the current line becomes a separate field. |
| `FILENAME` | Holds the filename of the file currently being processed. Notice that you cannot use `FILENAME` inside the `BEGIN` block because it is not yet defined. |
| `NR` | Used for keeping track of the total number of records that have been read so far. |
| `FNR` | Used for keeping the total number of records that have been read from the current input file only. |
| `IGNORECASE` | Used for telling AWK to ignore case in all of its comparisons or regular expressions. |
| `ARGC` | Holds the number of command line arguments. |
| `ARCV` | Holds the actual command line arguments of an AWK program. |

### User Defined Variables

The way you use an AWK variable the first time will define its type. The following AWK code uses the variable `n` to count the number of lines that contain the string `three`:

    awk '/three/ { n++ }; END { print n+0 }'

 - The code above tells AWK to execute `n++` each time there is a match to the `/three/` regular expression.

 - When the processing is done, the code in `END` is executed, which prints the current value of `n` converted to number by adding the numeral zero.

1.  To see output for this code, provide input either as a filename or user input from the console:

        awk '/three/ { n++ }; END { print n+0 }' file.txt

2.  Our file looked like this:

    {{< file "file.txt" text >}}
    one
    two
    three
    four
    three
    two
    one
{{< /file >}}

3.  The output looks as follows:

    {{< output >}}
2
{{< /output >}}

{{< note >}}
AWK automatically initializes user defined variables to the **empty string**, which is zero if you convert a variable to a number. You are free to convert a string to a number and vice versa as long as the string can be converted to a valid number–--this also means that AWK is not a type safe programming language, which can generate bugs. Last, it is allowed to change the kind of value that a variable can hold in your AWK code.
{{< /note >}}

## AWK Basics

In this section of the guide you will learn more about the basics of AWK. AWK has support for arrays, associative arrays, functions, and user defined functions.

AWK programs have of blocks, called *patterns*, like `BEGIN` and `END` that are executed at specified times by AWK.

A pattern in AWK controls the execution of *rules* and a rule is executed when its pattern is a match for the current input record.

### BEGIN and END

AWK has two patterns named `BEGIN` and `END` with special meaning and functionality. Note that each of them are executed only once: before getting any input and after finishing processing all input, respectively. They are useful for performing startup and cleanup actions in your AWK programs.

Although it is not required to have the `BEGIN` rule at the beginning of your AWK program or
the `END` rule at the end of it, it is considered a good practice to put them there. Also, an AWK program can have multiple `BEGIN` and `END` blocks.

If an AWK program has only `BEGIN` rules without any other code, the program terminates without reading any of the specified input. However, if an AWK program contains only `END` rules without any additional code, all the specified input is read in case the `END` rule needs to reference the `FNR` or `NR` variables.

### BEGINFILE and ENDFILE

{{< note >}}
`BEGINFILE` and `ENDFILE` only work with `gawk`.
{{< /note >}}

Two other handy patterns with special functionality are `BEGINFILE` and `ENDFILE`. `BEGINFILE` is executed before AWK reads the first record from a file whereas `ENDFILE` is executed after AWK is done with the last record of a file.

`ENDFILE` is convenient for recovering from I/O errors during processing; the AWK program can pass the control to `ENDFILE`, instead of stopping abnormally, and set the `ERRNO` variable that describes the error that just happened. AWK clears the `ERRNO` variable before it starts processing the next file. Similarly, the `nextfile` statement, when used inside `BEGINFILE`, allows gawk to move to the next data file instead of exiting with a fatal error without executing the `ENDFILE` block.

1.  Create a file called `BEGINFILE.awk`:

    {{< file "BEGINFILE.awk" awk >}}
BEGIN {
    numberOfFiles = 0
}

BEGINFILE {
    print "New file", FILENAME

    # Check if there is an error while trying to read the file
    if (ERRNO) {
        print "Cannot read", FILENAME, "– processing next file!"
        nextfile
    }
}

ENDFILE {
    numberOfFiles++
}

END {
    print "Total number of files processed: ", numberOfFiles
}
{{< /file >}}

  - This program showcases the usage of `BEGIN`, `END`, `BEGINFILE`, and `ENDFILE` by printing the total number of files read as well as the filename of each file.

  - The code also reports if there is a problem while reading a file.

  - The printing of the filename is done with the help of the `FILENAME` variable.

1.  Execute the file with the following command:

        gawk -f BEGINFILE.awk hw.awk BEGINFILE.awk givenLine.awk doesNotExist

1.  The output will be similar to the following:

    {{< output >}}
New file: hw.awk
New file: BEGINFILE.awk
New file: givenLine.awk
New file: doesNotExist
Cannot read doesNotExist
Total number of files processed: 3
{{< /output >}}

### Looping in AWK

AWK supports `for`, `do-while`, and `while` loops that similarly like they do in other programming languages.

1.  Create a and save a file called `loops.awk`:

    {{< file "loops.awk" awk >}}
BEGIN {
    for (i = 0; i < ARGC; i++)
        printf "ARGV[%d] = %s\n", i, ARGV[i]

    k = 0
    while ( k < ARGC ) {
        printf "ARGV[%d] = %s\n", k, ARGV[k]
        k++
    }

    m = 0
    do {
        printf "ARGV[%d] = %s\n", m, ARGV[m]
        m++
    } while ( m < ARGC )
}

END {
    for (i = 0; i < 10; i++)
        printf "%d ", i
    printf "\n"
}
{{< /file >}}

  - The `ARGC` variable iterates over the command line arguments of an AWK command with the help of a loop.

1.  Executing `loops.awk` with the following command:

        echo "" | awk -f loops.awk

1.  The output will be similar to the following:

    {{< output >}}
ARGV[0] = awk
ARGV[0] = awk
ARGV[0] = awk
0 1 2 3 4 5 6 7 8 9
{{< /output >}}

### Arrays and Associative Arrays

This part of the guide will introduce you *Arrays* and *Associative Arrays*. Arrays and associative arrays in AWK are almost the same thing with one exception; the indices of an array are positive integers whereas the indices of an associative array are strings. However, AWK uses string keys internally in both cases. So, technically both arrays and associative arrays are what other programming languages call *hashes* or *hash maps*.

1.  Create the file `arrays.awk`.

    {{< file "arrays.awk" awk >}}
BEGIN {
    a[0] = 1;
    a[1] = 2;
    a[2] = 3;
    a[3] = 4;

    for (i in a)
        print "Index:", i, "with value:", a[i];
        print "Adding two elements and deleting a[0]";

        a["One"] = "One_value";
        a["Two"] = "Two_value";
        delete a[0];

    for (i in a)
        print "Index:", i, "with value:", a[i];

    if (a["1"] == a[1])
        printf "a[1] = a[\"1\"] = %s\n", a["1"];
}
{{< /file >}}

  - Elements `a["1"]` and `a[1]` are exactly the same thing and that are pointing to the same array element. You will learn about the `for` loop in a while.

  - Use the `delete` statement for removing an element from an array.

2. Run the program with the following command:

        awk -f arrays.awk

3.  The output will look similar to the following:

    {{< output >}}
Index: 2 with value: 3
Index: 3 with value: 4
Index: 0 with value: 1
Index: 1 with value: 2
Adding two elements and deleting a[0]
Index: 2 with value: 3
Index: 3 with value: 4
Index: Two with value: Two_value
Index: One with value: One_value
Index: 1 with value: 2
a[1] = a["1"] = 2
{{< /output >}}

    {{< note >}}
The order of the index could be out of order. This is because arrays in AWK are associative and not assigned in blocks of contiguous memory.
{{< /note >}}

### Predefined Functions

AWK has built-in functions for string, number, time, and date manipulation. You can
easily generate random numbers using the `rand()` function. However, `rand()` can
generate repeatable output.

The use of the `rand()` function is illustrated in the following example.

1.  Create and save the `rand.awk` file:

    {{< file "rand.awk" awk >}}
BEGIN {
    for (i=0; i<=10; i++)
        rnd[i] = 0;

    while (i < 500) {
        n = int(rand()*10);
        rnd[n]++;
        i++;
    }

    for (i=0; i<10; i++)
        print i, "Occurred", rnd[i], "times";
}
{{< /file >}}

  - You will recall from the `helloworld.awk` program, the use of `BEGIN` is mandatory in order to avoid waiting for input, which is not required in this program.

1.  Executing the `rand.awk` with the following command:

        awk -f rand.awk

1.  The output will look similar to the following:

    {{< output >}}
0 Occurred 42 times
1 Occurred 50 times
2 Occurred 52 times
3 Occurred 51 times
4 Occurred 43 times
5 Occurred 44 times
6 Occurred 64 times
7 Occurred 47 times
8 Occurred 49 times
9 Occurred 47 times
{{< /output >}}

### User Defined Functions

The AWK programming language allows you to define your own functions and use them in your AWK programs.

1.  Create and save the `myFunction.awk` file:

    {{< file "myFunction.awk" awk >}}
function isnum(x) { return(x==x+0) }

function sumToN(n) {
    sum = 0
    if (n < 0) { n = -n }
    if ( isnum(n) ) {
        for (j = 1; j <= n; j++)
            sum = sum + j
    } else { return -1 }
    return sum
}
{
    for (i=1; i<=NF; i++)
        print $i, "\t:", sumToN($i)
}
{{< /file >}}

  - The user defined function is called `sumToN()`.

  - The `isnum()` function makes sure that the input to `sumToN()` will be numeric.

1.  Executing `myFunction.awk` with the following command:

        echo "10 12" | awk -f myFunction.awk

1.  It will generate output similar to the following:

    {{< output >}}
10 : 55
12 : 78
{{< /output >}}

## Practical Examples

In this section of the guide you will see practical uses of AWK. Try all these examples on your own UNIX machine.

### Printing a Given Line from a File

AWK can help you print a given line from a text file.

1.  Create and save the `givenLine.awk` file:

    {{< file "givenLine.awk" awk >}}
{
    if (NR==line)
        print $0;
}
{{< /file >}}

  - The parameter `line` should be given as a command line argument to the AWK script using the `-v` flag.

1.  Execute `givenLine.awk` with the following command, passing `line=1` and the previous file you created `myFunction.awk` as arguments:

        awk -v line=1 -f givenLine.awk myFunction.awk

1.  The output is as follows:

    {{< output >}}
function isnum(x) { return(x==x+0) }
{{< /output >}}

1.  Execute `givenLine.awk` again passing line 4:

        awk -v line=4 -f givenLine.awk myFunction.awk

1.  This time the output is as follows:

    {{< output >}}
    sum = 0
{{< /output >}}

### Printing Lines that Follow a Numeric Pattern

In this exercise you will learn how to print lines 10, 20, 30, etc. of a file using a variation of the code found in `givenLine.awk`.

1.  Create and save a file `multipleLines.awk`:

    {{< file "multipleLines.awk" awk >}}
{
    if (NR % line == 0)
        print $0;
}
{{< /file >}}

  - If the value of `line` is `1`, then `multipleLines.awk` will print the contents of all input files.

1.  Execute `multipleLines.awk` with the following command, passing `line=1` and the previous file `givenLine.awk` as the inputs:

        awk -v line=1 -f multipleLines.awk givenLine.awk

1. The output will be as follows:

    {{< output >}}
{
    if (NR==line)
        print $0;
}
{{< /output >}}

### Printing Two Given Fields from a File

For this exercise you will have a file with multiple fields but print only the values of the 1st and the 3rd fields.

1.  Create and save the file `field1and3.awk`:

    {{< file "field1and3.awk" awk >}}
{
    print $1, $3;
}
{{< /file >}}

1.  Create and save the file `words.txt`:

    {{< file "words.txt" text >}}
one two three
{{< /file >}}

1.  Execute `field1and3.awk` with the following command, passing itself as an argument:

        awk -f field1and3.awk words.txt

1.  The output will look similar to this:

    {{< output >}}
one three
{{< /output >}}

1.  You can also execute `field1and3.awk` as a command line statement because it is small with the following command:

        awk '{print $1, $3}' words.txt

1.  The output will be the same:

    {{< output >}}
one three
{{< /output >}}

### Counting Lines

In this exercise you will count the number of lines that were given to AWK for processing.

1.  Create and save the `countLines.awk` file:

    {{< file "countLines.awk" awk >}}
{
    if (FNR==1)
        print "Processing:", FILENAME;
}

END {
    print "Read", NR, "records in total";
}
{{< /file >}}

  - The use of `FNR` makes sure that the filename of each processed file will be printed only once.

  - The use of `END` makes sure that the results will be printed just before AWK finishes its job.

1.  Create and save the `data.txt` file:

    {{< file "data.txt" text >}}
one
two
three
4

6
seven not eight
{{< /file >}}

1.  Execute `countLines.awk` with the following command, passing `data.txt` as input:

        awk -f countLines.awk data.txt

1.  The output will look similar to the following:

    {{< output >}}
Processing: data.txt
Read 7 records in total
{{< /output >}}

1.  Execute `countLines.awk` with multiple files to process as follows, `words.txt` is from the previous exercise:

        awk -f countLines.awk data.txt words.txt

1.  The output will look similar to the following:

    {{< output >}}
Processing: data.txt
Processing: words.txt
Read 8 records in total
{{< /output >}}

### Counting Characters

In this exercise you calculate the number of characters found in the input files.

1.  Create and save the file `countChars.awk`:

    {{< file "countChars.awk" awk >}}
BEGIN {
    n = 0;
}

{
    if (FNR==1)
        print "Processing:", FILENAME;

    n = n + length($0) + 1;
}

END {
    print "Read", n, "characters in total";
}
{{< /file >}}

  - Note that the `+ 1` is for including the new line character that each line has.

1.  Execute `countChars.awk` by running the following command, pass it the `countLines.awk` file from the previous exercise:

        awk -f countChars.awk countLines.awk

1.  The output will look similar to the following:

    {{< output >}}
Processing: countLines.awk
Read 110 characters in total
{{< /output >}}

1.  Execute `countChars.awk` with multiple files to process as follows:

        awk -f countChars.awk countLines.awk field1and3.awk

    {{< output >}}
Processing: countLines.awk
Processing: field1and3.awk
Read 132 characters in total
{{< /output >}}

### Calculating Word Frequencies

This example is relatively challenging but shows some of the advanced capabilities of AWK. The file `wordFreq.awk` reads a text file and counts how many times each word appears in the text file using associative arrays.

1.  Create and save the file `wordFreq.awk`:

    {{< file "wordFreq.awk" awk >}}
{
    for (i= 1; i<=NF; i++ ) {
        $i = tolower($i)
        freq[$i]++
    }
}

END {
    for (word in freq)
        print word, ":", freq[word]
}
{{< /file >}}

1.  Create and save the file `text.txt`:

    {{< file "text.txt" text >}}
one two
three one four seven Seven
One Two TWO

one three five
{{< /file >}}

1.  Executing `wordFreq.awk` with the following command:

        awk -f wordFreq.awk text.txt | sort -k3rn

    {{< note >}}
The `sort -k3rn` command is used for properly sorting the output of `wordFreq.awk`. Please type `man sort` for the man page of the `sort(1)` command.
{{< /note >}}

1.  The output will be similar to the following:

    {{< output >}}
one : 4
two : 3
seven : 2
three : 2
five : 1
four : 1
{{< /output >}}

Try writing the `wordFreq.awk` program in C and you will appreciate AWK even more!

### Updating Docker Images

1.  Use the following command to update all Docker images found on your local machine to their latest version:

        docker images | grep -v REPOSITORY | awk '{print $1}' | xargs -L1 docker pull

  - In this example, AWK is just a part of the command and not the center of the command. However, AWK does the job of extracting the first field of `docker images` output.

### Finding the Top-10 Commands of your Command History

1.  Use The following shell command to find the top-10 commands using the output of the `history` command as  input:

        history | awk '{CMD[$2]++;count++;} END {for (a in CMD)print CMD[a] " "CMD[a]/count*100 " % " a;} ' | grep -v "./" | column -c3 -s " " -t | sort -rn | head -n10

  - First, you're executing the `history` command to get your input.

  - This is processed by a rather large `awk` command that calculates the number of times each command appears in `history` by considering the second field only, which is the name of the command.

  - This is stored in the `CMD` associative array.

  - At the same time, the total number of commands that have been processed is stored in the `count` variable.

  - The frequency of each command is calculated with the `CMD[a]/count*100` statement and printed on the screen along with the command name.

  - The formatting and the sorting of the output is handled by the `grep`, `column`, `sort`, and `head` command line utilities.

1.  The output will look similar to this:

    {{< output >}}
2318  18.4775    %  git
1224  9.75688    %  ll
1176  9.37425    %  go
646   5.14946    %  docker
584   4.65524    %  cat
564   4.49582    %  brew
427   3.40375    %  lenses-cli
421   3.35592    %  cd
413   3.29215    %  vi
378   3.01315    %  rm
{{< /output >}}

### Finding the Number of Records that Appear More than Once

The logic of the program is based on AWK associative arrays. The keys of the associative array that is being used are the entire lines of the input. This means that if a line appears more than once, it will be found in the associative array and will have a value that is different from the default, which is `0`.

1.  Create and save the file `nDuplicates.awk`:

    {{< file "nDuplicates.awk" awk >}}
BEGIN {
    total = 0;
}

{
    i = tolower($0);
    if (freq[i] == 1) {
        # print $0;
        total = total + 2;
        # print total;
    } else if (freq[i] > 1) {
        # print $0;
        total++;
        # print total;
    }
        freq[i]++;
}

END {
    print "Found", total, "lines with records that already exist.";
}
{{< /file >}}

1.  Executing `nDuplicates.awk` with the following command, passing the file to itself as input:

        awk -f nDuplicates.awk nDuplicates.awk

1.  The output will look similar to the following:

    {{< output >}}
Found 9 lines with records that already existed
{{< /output >}}

1.  Execute the command again, passing the file twice to itself:

        awk -f nDuplicates.awk nDuplicates.awk nDuplicates.awk

1.  The output will look similar to the following:

    {{< output >}}
Found 42 lines with records that already existed
{{< /output >}}