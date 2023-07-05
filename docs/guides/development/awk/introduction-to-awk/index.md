---
slug: introduction-to-awk
description: 'This guide provides you with an introduction to the Turing-complete pattern matching programming language, AWK, which is great for data reporting and more.'
keywords: ["UNIX", "shell", "AWK"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-07-30
modified_by:
  name: Linode
title: 'Learn the AWK Programming Language'
external_resources:
  - '[GNU awk](https://www.gnu.org/software/gawk/)'
aliases: ['/development/awk/introduction-to-awk/','/development/introduction-to-awk/']
authors: ["Mihalis Tsoukalos"]
---

## What is AWK?

AWK is a [*Turing-complete*](https://en.wikipedia.org/wiki/Turing_completeness) *pattern matching* programming language. The name AWK is derived from the family names of its three authors: [Alfred Aho](https://en.wikipedia.org/wiki/Alfred_Aho), [Peter Weinberger](https://en.wikipedia.org/wiki/Peter_J._Weinberger) and [Brian Kernighan](https://en.wikipedia.org/wiki/Brian_Kernighan). AWK is often associated with [sed](https://www.gnu.org/software/sed/manual/sed.html), which is a UNIX command line tool. However, sed is more appropriate for one line UNIX shell commands and is typically used only for text processing.

AWK is great for data reporting, analysis, and extraction and supports arrays, associative arrays, functions, variables, loops, and regular expressions. Current Linux systems use [improved versions](https://en.wikipedia.org/wiki/AWK#Versions_and_implementations) of the original AWK utility. The main enhancement to these AWK variants is support for a larger set of built-in functions and variables. The most widely used variants of AWK are: [Gawk](https://www.gnu.org/software/gawk/), [Mawk](https://invisible-island.net/mawk/), and [Nawk](https://linux.die.net/man/1/nawk).

{{< note respectIndent=false >}}
This guide uses the Gawk version of AWK.
{{< /note >}}

There are many practical uses of AWK. For example, you can use AWK and the [history](https://en.wikipedia.org/wiki/History_(command)) command to find your top 10 most frequently issued commands:

    history | awk '{CMD[$2]++;count++;} END {for (a in CMD)print CMD[a] " "CMD[a]/count*100 " % " a;} ' | grep -v "./" | column -c3 -s " " -t | sort -rn | head -n10

This guide assumes familiarity with programming language concepts and is meant to provide an overview of some basic elements of the AWK programming language. In this guide you will learn:

* [How to write and execute AWK programs](#hello-world-command-line)
* [The basics of the AWK programming language](#awk-basics)
* [Practical uses of AWK](#practical-examples)

## AWK Basics

In this section you will learn basics of the AWK programming language, including:

* How to execute AWK from the command line with one-off commands and by storing AWK code in files.
* Creating and using variables, arrays, and functions.
* Special patterns, like `BEGIN` and `END`.

{{< note respectIndent=false >}}
A pattern in AWK controls the execution of *rules* and a rule is executed when its pattern is a match for the current [input record](https://www.gnu.org/software/gawk/manual/html_node/Records.html#Records).
{{< /note >}}

### Run an AWK Program

A program in AWK can be written via the command line or by executing a file containing the program. If you want to reuse your code, it is better to store it in a file. AWK reads input from standard input or from files specified as command line arguments. Input is divided into individual *records* and *fields*. By default, new lines are parsed as a record and whitespace is parsed as a field. After a record is read, it is split into fields. AWK does not alter the original input.

The next two sections will walk you through creating a *Hello World!* program that you will run, both as a one-off program on the command line, and as reusable code saved in a file.

#### Hello World! - Command Line

When an AWK program contains the `BEGIN` pattern without another special pattern, AWK will not expect any further command line input and exit. Typically, when an AWK program is executed on the command line, without the `BEGIN` special pattern, AWK will continue to expect input until you exit by typing **CTRL-D**. The example *Hello World!* program below will print and immediately exit.

1.  Execute the command as follows:

        awk 'BEGIN { print "Hello World!" }'

    The output will be as follows:

    {{< output >}}
Hello World!
{{< /output >}}


#### Hello World! - Input File

In this section, you will create an AWK program in an input file and then run it from the command line.

1.  Create a file called `helloworld.awk` with the following content:

    {{< file "helloworld.awk" awk >}}
BEGIN { print "Hello World!" }
    {{< /file >}}

1.  On the command line, run the `helloworld.awk` program. The `-f` option tells AWK to expect a source file as the program to run.

        awk -f helloworld.awk

1.  The output will be as follows:

    {{< output >}}
Hello World!
    {{< /output >}}

1.  You can also run AWK programs as executable scripts. Open `helloworld.awk` and add a bash script line to the top of the file and save it **without** the `.awk` extension.

    {{< file "helloworld" bash >}}
#!/usr/bin/awk -f

BEGIN { print "Hello World!" }
    {{< /file >}}

    The ``#!/usr/bin/awk -f`` line defines the start of script execution.

1.  Add execute permissions to `helloworld`:

        chmod +x helloworld

1.  Execute the `helloworld` program:

        ./helloworld

1.  The output will resemble the following:

    {{< output >}}
Hello World!
    {{< /output >}}

### Variables in AWK

AWK supports built-in and user defined variables. Built-in variables are native to AWK, whereas user defined variables are ones you define.

#### Built-in Variables

AWK has many built-in variables that are automatically initialized. Some of the most important ones are the following:

| Variable | Definition |
| --- | --- |
| `NF` | Holds the number of fields in the current input record. Each record can have a different number of fields. |
| `FS` | Defines the input field separator. The default value is a whitespace, but it also matches any sequence of spaces and tabs. Additionally, any number of leading or trailing whitespaces and tabs are ignored. If the value of `FS` is set to the null string, then each character in the current line becomes a separate field. |
| `FILENAME` | Stores the filename of the current input file. You cannot use `FILENAME` inside a `BEGIN` block, because there are no input files being processed. |
| `NR` | Keeps track of the total number of records that have been read so far. |
| `FNR` | Stores the total number of records that have been read from the current input file. |
| `IGNORECASE` | Tells AWK whether or not to ignore case in all of its comparisons or regular expressions. If `IGNORECASE` stores a non-zero or null value, then AWK will ignore case. |
| `ARGC` | Holds the number of command line arguments. |
| `ARGV` | Stores the actual command line arguments of an AWK program. |

#### User Defined Variables

User defined variables can store numeric or string values. AWK dynamically assigns variables a type based on the variable's initial value. User defined variables, by default, are initialized to the **empty string**. If you convert a variable from a string to a number, the default value is zero. You can convert a string to a number and vice versa as long as the string can be converted to a valid number. It is important to keep in mind that AWK is not a [type safe programming language](https://en.wikipedia.org/wiki/Type_safety), since this can sometimes generate bugs.

- You can set a variable via the command line using the `-v` option. This command will initialize the variable `count` and print its value:

        awk -v count=8 'BEGIN { print count }'

- To initialize variables within an input file, you can use the form `myvariable = "myvar" ` for strings and `myvariable = 10` for numeric values. Create a file named `count.awk` and add the following content:

    {{< file "count.awk" awk>}}
BEGIN {
    count = 10
    print count
}
    {{</ file >}}

    To run this file, switch back to the command line and execute the following command:

        awk -f count.awk

    Your output should display:

    {{< output >}}
      10
    {{</ output >}}

### Special Patterns

AWK uses patterns to control how a rule should be executed against an input record. The two main categories of patterns in AWK are *regular expressions* and *expressions*.  [Regular expressions](https://www.gnu.org/software/gawk/manual/html_node/Regexp.html#Regexp) use a special format to target specific sets of strings, while expressions encompass various ways to target patterns in AWK, like comparison expressions that may utilize regular expressions. Special patterns in AWK include reserved keywords that perform special actions within your AWK programs. The sections below discuss the special patterns `BEGIN`, `END`, `BEGINFILE`, and `ENDFILE`.

#### BEGIN and END

`BEGIN` and `END` are executed only once: before receiving any input and after processing all input, respectively. In this way, they can be used to perform startup and cleanup actions in your AWK programs.

Although it is not required to use `BEGIN` and `END` at the beginning and end of your AWK programs, it is considered good practice to do so. Additionally, you can include multiple `BEGIN` and `END` blocks in one program.

If an AWK program uses only `BEGIN` rules without any other code, the program terminates without reading any of the specified input. However, if an AWK program contains only `END` rules without any additional code, all the specified input is read. This is necessary in case the `END` rule references the [`FNR` and `NR` variables](#built-in-variables).

#### BEGINFILE and ENDFILE

{{< note respectIndent=false >}}
`BEGINFILE` and `ENDFILE` only work with `gawk`.
{{< /note >}}

Two other patterns with special functionality are `BEGINFILE` and `ENDFILE`. `BEGINFILE` is executed before AWK reads the first record from a file, whereas `ENDFILE` is executed after AWK is done with the last record of a file.

`ENDFILE` is convenient for recovering from I/O errors during processing. The AWK program can pass control to `ENDFILE`, and instead of stopping abnormally it sets the `ERRNO` variable to describe the error that occurred. AWK clears the `ERRNO` variable before it starts processing the next file. Similarly, the [`nextfile` statement](https://www.gnu.org/software/gawk/manual/html_node/Nextfile-Statement.html#Nextfile-Statement) -- when used inside `BEGINFILE` -- allows gawk to move to the next data file instead of exiting with a fatal error and without executing the `ENDFILE` block.

1.  As an example, create a file named `beginfile.awk`:

    {{< file "beginfile.awk" awk >}}
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

  - If there is a problem while reading a file, the code will report it.

  - Printing the filename is done with the help of the `FILENAME` variable.

1.  Execute the file with the following command:

        gawk -f hw.awk beginfile.awk givenLine.awk doesNotExist

1.  The output will be similar to the following example. The program does not stop abnormally when it does not find an input file and provides a useful error message.

    {{< output >}}
New file hw.awk
Cannot read hw.awk – processing next file!
New file beginfile.awk
New file givenLine.awk
Cannot read givenLine.awk – processing next file!
New file doesNotExist
Cannot read doesNotExist – processing next file!
Total number of files processed:  1
    {{< /output >}}

### Looping in AWK

AWK supports `for`, `do-while`, and `while` loops that behave similarly to control flow statements in other programming languages. Loops execute code contained within a code block as many times as specified in the control flow statement. To illustrate loops in AWK, a working example is provided below.

1.  Create and save a file named `loops.awk`:

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

  - The program uses the value of the [`ARGC` built-in variable](#built-in-variables) to control how many times to loop through each separate block of code. The result will vary depending on how many command line arguments you pass to AWK when executing the program.
  - The `for` loop after the `END` special pattern will print numbers from 0 - 9.

1.  Execute the `loops.awk` input program with the following command:

        echo "" | awk -f loops.awk

1.  The output will be similar to the following:

    {{< output >}}
ARGV[0] = awk
ARGV[0] = awk
ARGV[0] = awk
0 1 2 3 4 5 6 7 8 9
{{< /output >}}

### Arrays

AWK does not require array indices to be consecutive integers. Instead, strings and numbers may be used. This is because AWK uses string keys internally to represent an array's indices, and so arrays in AWK are more like associative arrays that store a collection of pairs. Unlike other programming languages, you do not need to declare an array and its size before using it, and new pairs can be added at any time. The file below serves to illustrate the behavior of arrays in AWK.

1.  Create the file `arrays.awk`:

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

  - The program creates the `a[]` array and initializes it with four separate numeric values.
  - The `for` block will loop through the array and print the current index and value.
  - It then adds two new elements to array `a[]` that use string indices instead of numbers.
  - It demonstrates how to delete an element from an array by deleting the `a[0]` element.
  - Finally, the `if` statement evaluates if `a["1"]` and `a[1]` are equivalent. Since AWK stores all array elements as string keys, both indices point to the same array element and the code in the `if` statement executes.

2. Run the program with the following command:

        awk -f arrays.awk

3.  The output will look similar to the following:

    {{< output >}}
Index: 0 with value: 1
Index: 1 with value: 2
Index: 2 with value: 3
Index: 3 with value: 4
Adding two elements and deleting a[0]
Index: Two with value: Two_value
Index: One with value: One_value
Index: 1 with value: 2
Index: 2 with value: 3
Index: 3 with value: 4
a[1] = a["1"] = 2
  {{</ output >}}

    {{< note respectIndent=false >}}
The order of the array indices may be out of order. This is because arrays in AWK are associative and not assigned in blocks of contiguous memory.
  {{< /note >}}

### Functions

Like most programming languages, AWK supports user-defined functions and ships with several useful built-in functions. This section will provide examples demonstrating how to use both types of functions.

#### Predefined Functions

AWK's built-in functions provide mechanisms for string manipulation, numeric operations, and I/O functions to work with files and shell commands. The example below utilizes the built-in numeric functions `rand()` and `int()` to show how to call built-in functions.

1.  Create and save a file named `rand.awk`:

    {{< file "rand.awk" awk >}}
BEGIN {
    while (i < 20) {
        n = int(rand()*10);
        print "value of n:", n;
        i++;
    }
}
{{< /file >}}

  - The `rand.awk` program uses the `rand()` function to generate a random number and stores it in the `n` variable. By default, `rand()` returns a random number between 0 and 1. To generate numbers larger than 1, the program multiplies the returned random number by 10.
  - AWK's `int()` function rounds the result of the `rand()` function to the nearest integer.

1.  Execute the `rand.awk` program with the following command:

        awk -f rand.awk

1.  The output will resemble the following:

    {{< output >}}
value of n: 2
value of n: 2
value of n: 8
value of n: 1
value of n: 5
value of n: 1
value of n: 8
value of n: 1
...
{{< /output >}}

#### User Defined Functions

The AWK programming language allows you to define your own functions and call them throughout an AWK program file. A function definition must include a name and can include a parameter list. Function names can only contain a sequence of letters, digits, and underscores. The function name cannot begin with a digit. In the example below, you will declare a function definition and utilize it within the AWK program.

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

  - The user defined function `sumToN()` takes a single parameter `n` and uses a for loop to increment its value and stores it in the `sum` variable.
  - The program will take command line input, and pass it as a parameter to the `sumToN()` function and print the calculated `sum`.

1.  Execute `myFunction.awk` with the following command:

        echo "10 12" | awk -f myFunction.awk

1.  Your output will resemble the example below. If you use a different set of numbers, your output will differ from the example.

    {{< output >}}
10 : 55
12 : 78
{{< /output >}}

## Practical Examples

This section of the guide provides a variety of practical examples to further demonstrate the AWK programming language. You can try out each example on your own Linux machine or expand on the examples for your own specific needs.

### Printing
#### Printing a Given Line from a File

1.  To use AWK to print a given line from a text file, create and save the `givenLine.awk` file:

    {{< file "givenLine.awk" awk >}}
{
    if (NR == line)
        print $0;
}
{{< /file >}}

  - This program will print out the record that corresponds to the value passed to the `line` variable. The program will require input either from the command line or from a file.
  - You should pass the value of the `line` variable to the AWK program as a command line argument using the `-v` option.

1.  By executing the `givenLine.awk` program as follows, it will print out the first line found in the `myFunction.awk` program written in the previous section. (You could similarly pass it any text file.)

        awk -v line=1 -f givenLine.awk myFunction.awk

    The output will resemble the following:

    {{< output >}}
function isnum(x) { return(x==x+0) }
{{< /output >}}

1.  Execute `givenLine.awk` again, passing line 4:

        awk -v line=4 -f givenLine.awk myFunction.awk

1.  This time the output is as follows:

    {{< output >}}
    sum = 0
{{< /output >}}

#### Printing Two Given Fields from a File

In this example, the AWK program will print the values of the first and third fields of any text file.

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

1.  Execute `field1and3.awk` passing `words.txt` as input:

        awk -f field1and3.awk words.txt

1.  The output will print only the first and third words (fields) contained in the file:

    {{< output >}}
one three
{{< /output >}}

    {{< note respectIndent=false >}}
You can also execute the contents of `field1and3.awk` on the command line and pass `words.txt` as input:

    awk '{print $1, $3}' words.txt
    {{< /note >}}

### Counting
#### Counting Lines

The following example AWK program will count the number of lines that are found in the given text file(s).

 `FNR` stores the total number of records that have been read from the current input file.

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
  - `END` makes sure that the results will be printed just before AWK finishes executing `countLines.awk`.

1.  Create and save the `data.txt` file. This file will be passed to AWK as input for processing.

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

1.  The output will resemble the following:

    {{< output >}}
Processing: data.txt
Read 7 records in total
{{< /output >}}

1.  Execute `countLines.awk` with multiple files for processing. You can use `words.txt` from the previous exercise.

        awk -f countLines.awk data.txt words.txt

1.  You should see a similar output:

    {{< output >}}
Processing: data.txt
Processing: words.txt
Read 8 records in total
{{< /output >}}

#### Counting Lines with a Specific Pattern

The following AWK code uses the variable `n` to count the number of lines that contain the string `three`:

    awk '/three/ { n++ }; END { print n+0 }'

 - The code above tells AWK to execute `n++` each time there is a match to the `/three/` regular expression.

 - When the processing is done, the code in `END` is executed. This code prints the current value of `n` converted to a number by adding the numeral zero.

 1. Create a file named `dataFile.txt` to pass to AWK as input for processing:

     {{< file "dataFile.txt" text >}}
    one
    two
    three
    four
    three
    two
    one
{{< /file >}}

1.  Execute the example code and pass `dataFile.txt` as input:

        awk '/three/ { n++ }; END { print n+0 }' dataFile.txt


3.  The output will look as follows:

    {{< output >}}
2
{{< /output >}}

#### Counting Characters

In this example, the `countChars.awk` file calculates the number of characters found in an input file.

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

  - This program makes use of the built-in string function `length()`, which returns the number of characters in a string. In the case of the program, the string will be provided by the entirety of the current record, which is indicated by `$0`.
  - The `+ 1` appended to the `length()` function is used to account for the new line character that each line includes.

1.  Execute `countChars.awk` by running the following command and pass it the `countLines.awk` file from the previous exercise.

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

This example demonstrates some of the advanced capabilities of AWK. The file `wordFreq.awk` reads a text file and counts how many times each word appears in the text file using associative arrays.

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

    - `wordFreq.awk` uses a for loop to traverse through an input file and add each record to the `freq[]` array.
    - The `tolower()` built-in string function is used to ensure the program does not count the same word multiple times based on differences in case, e.g., seven and Seven are not counted as different words.
    - Before the program exits, the `END` block prints out each word and its frequency with the input file.

1.  Create and save the file `wordFreq.txt` to use as an input file.

    {{< file "wordFreq.txt" text >}}
one two
three one four seven Seven
One Two TWO

one three five
{{< /file >}}

1.  Execute the `wordFreq.awk` program and pass `wordFreq.txt` as input:

        awk -f wordFreq.awk wordFreq.txt | sort -k3rn

    {{< note respectIndent=false >}}
The `sort -k3rn` command is used to sort the output of `wordFreq.awk` based on a numeric sort in reverse order.
    {{< /note >}}

1.  The output will resemble the following:

    {{< output >}}
one : 4
two : 3
seven : 2
three : 2
five : 1
four : 1
{{< /output >}}

### Updating Docker Images

1.  Use the following series of piped commands to update all Docker images found on your local machine to their latest version:

        docker images | grep -v REPOSITORY | awk '{print $1}' | xargs -L1 docker pull

  - In this example, AWK is just a piece of the entire command. AWK does the job of extracting the first field from the result of executing the `docker images` command.

### Finding
#### Finding the Top-10 Commands of your Command History

1.  Use The following shell command to find your top 10 most used commands by piping the output of `history` to AWK as input:

        history | awk '{CMD[$2]++;count++;} END {for (a in CMD)print CMD[a] " "CMD[a]/count*100 " % " a;} ' | grep -v "./" | column -c3 -s " " -t | sort -rn | head -n10

  - First, the command executes the `history` command to be used as AWK's input.

  - This is processed by a complex `awk` command that calculates the number of times each command appears in `history` by considering the second field of each record. This is the field that corresponds to the previously issued commands. These values are stored in the `CMD[]` associative array.

  - At the same time, the total number of commands that have been processed are stored in the `count` variable.

  - The frequency of each command is calculated with the `CMD[a]/count*100` statement and printed on the screen along with the command name.

  - The formatting and the sorting of the output is handled by the `grep`, `column`, `sort`, and `head` command line utilities.

1.  Your output should resemble the following:

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

#### Finding the Number of Records that Appear More than Once

This program's logic utilizes the behavior of AWK associative arrays. The associative array's keys are the entire lines of the passed input. This means that if a line appears more than once, it will be found in the associative array and will have a value that is different from the default, which is `0`.

1.  Create and save the file `nDuplicates.awk`:

    {{< file "nDuplicates.awk" awk >}}
BEGIN {
    total = 0;
}

{
    i = tolower($0);
    if (freq[i] == 1) {
        total = total + 2;
    } else if (freq[i] > 1) {
        total++;
    }
        freq[i]++;
}

END {
    print "Found", total, "lines with duplicate records.";
}
{{< /file >}}

1.  Execute the `nDuplicates.awk` file and pass the file to itself as input:

        awk -f nDuplicates.awk nDuplicates.awk

1.  The output will look similar to the following:

    {{< output >}}
Found 5 lines with duplicate records.
    {{< /output >}}

1.  Execute the command again, passing the file twice to itself:

        awk -f nDuplicates.awk nDuplicates.awk nDuplicates.awk

1.  The output will look similar to the following:

    {{< output >}}
Found 42 lines with records that already existed
{{< /output >}}