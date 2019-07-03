---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'An introduction to AWK.'
keywords: ["UNIX", "shell", "AWK"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-06-20
modified_by:
  name: Linode
title: 'Learn the AWK programming language'
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
[Alfred Aho](https://en.wikipedia.org/wiki/Alfred_Aho),
[Peter Weinberger](https://en.wikipedia.org/wiki/Peter_J._Weinberger) and
[Brian Kernighan](https://en.wikipedia.org/wiki/Brian_Kernighan)
and is a handy *pattern matching* programming language that is *Turing-complete*, which
means that AWK is a fully featured programming language. AWK is often mentioned in the
same sentence with `sed`, which is another tradition UNIX command line tool. However,
`sed` is more appropriate for one line UNIX shell commands.

AWK allows you to do analysis, extraction and reporting of data and supports arrays,
associative arrays, functions, variables, loops and regular expressions.

Nowadays, every Linux system uses an improved version of the original AWK utility.
The biggest difference between the various variants and the original version of AWK
is that they support a larger set of built-in functions and variables.

{{< note >}}
Input is read either for the standard input or from files specified as command line
arguments. Input is read one record at a time – by default each line defines a new
record. After a record is read, it is automatically split into fields. AWK does not
alter the original input.
{{< /note >}}

### The various versions of AWK

There exist three AWK versions: `gawk`, `mawk` and `pawk`.

The first `gawk` version was introduced back in 1986. Michael Brennan wrote
another AWK variant named `mawk` and Nelson H.F. Beebe programmed `pawk`. Gawk
is the most powerful and popular version of AWK and is the one that is going
to be used in this guide. `pawk` is not being [maintained](ftp://ftp.math.utah.edu/pub/pawk/)
any more.

You can find more information about `gawk` in [here](https://www.gnu.org/software/gawk/)
and about `mwak` [here](https://invisible-island.net/mawk/).

If you want to find out the version of AWK you are using, you can execute `awk -V`.

## The Hello World program in AWK

The *Hello World!* program in AWK can be written in two ways. The first one is
the command line version and the second one is by storing the AWK code into a
separate file and executing that file. It is usually better to store your AWK
code on a file especially if you are going to reuse it later on.

### The Command Line Version

You can execute the command line version of the *Hello World!* in AWK as follows:

	awk 'BEGIN { print "Hello World!" }'
{{< output >}}
Hello World!
{{< /output >}}

When an AWK program contains the `BEGIN` pattern **only**, then it will not process any input files,
which is the reason that it just prints the desired message before exiting.

### The File Version

In this subsection you will learn how to store AWK code in a file and execute it
from there. The contents of the `hw.awk` file will be as follows:

{{< file "hw.awk" awk >}}
BEGIN { print "Hello World!" }
{{< /file >}}

You can now execute `hw.awk` as follows:

    awk -f hw.awk
{{< output >}}
Hello World!
{{< /output >}}

Based on that version, you can rewrite `hw.awk` as follows and save it as `hw`:
{{< file "hw" bash >}}
#!/usr/bin/awk -f

BEGIN { print "Hello World!" }
{{< /file >}}

If you give execute permissions to `hw` by running `chmod +x hw` on your UNIX shell,
you can execute `hw` as a regular UNIX command:

    ./hw
{{< output >}}
Hello World!
{{< /output >}}

{{< note >}}
The name `hw` is a matter of personal preference. It could have been anything you like
as long as it has the execute permission. Additionally, the ``#!/usr/bin/awk -f`` line
defines the starting of the script execution and it allows us to choose the correct shell or
in this case the correct program that will be used for executing the commands and statements
that follow.
{{< /note >}}

## Variables in AWK

AWK supports two kinds of variables, predefined and user defined ones. Predefined
variables are defined by AWK itself whereas user defined variables, which are case
sensitive, are defined by the developer.

### Predefined Variables

AWK has many built-in variables that are automatically initialized. Some of the
most important ones are the following:

- The `NF` variable holds the number of fields in the current input record.
    Notice that each record can have a different number of fields.
- The `FS` variable is the input field separator. Its default value is the single space
    but it also matches any sequence of spaces and tabs. Additionally, any number
	of leading or trailing spaces and tabs is being ignored. If the value of `FS` becomes the null
	string, then each character in the current line becomes a separate field.
- The `FILENAME` built-in variable holds the filename of the file currently being
    processed. Notice that you cannot use `FILENAME` inside the `BEGIN` block because
	it is not defined yet.
- The `NR` variable is used for keeping track of the total number of records that have been read so far.
- The `FNR` variable is used for keeping the total number of records that have been read from the current input file only.
- The `IGNORECASE` variable is used for telling AWK to ignore case in all of its comparisons or regular expressions.
- The `ARGC` variables holds the number of command line arguments.
- The `ARGV` variable holds the actual command line arguments of an AWK program.

### User Defined Variables in AWK

The way you use an AWK variable the first time will define its type. The following
AWK code uses the `n` variable to count the number of lines that contain a given
string, which is this case is the word `three`:

    awk '/three/ { n++ }; END { print n+0 }'

The above code says AWK to execute the `n++` code each time there is a match to the
`/three/` regular expression. When the processing is done, the code in `END` will be
executed, which just prints the current value of `n` converted to number.

If you provide some input to it, either a filename or user input from the console, you
will get some output from the AWK code.

Notice that AWK automatically initializes user defined variables to the **empty string**,
which is zero if you convert a variable to a number. You are free to convert a string
to a number and vice versa as long as the string can be converted to a valid number –
this also means that AWK is not a type safe programming language, which can generate bugs.
Last, it is allowed to change the kind of value that a variable can hold in your AWK code.

## AWK Basics

In this section of the guide you will learn more about the basics of AWK. AWK has support
for **arrays** and **associative arrays**. It also supports functions and user
defined functions. AWK programs can have various types of blocks (*patterns*) like
`BEGIN` and `END` that are executed at the time that is specified by AWK.

A pattern in AWK controls the execution of rules – a rule is executed when its pattern is
a match for the current input record.

### Arrays and Associative Arrays in AWK

This part of the guide will introduce you to AWK **Arrays** and **Associative Arrays**.
At this point it would be good to know that arrays and associative arrays in AWK are
exactly the same thing. What logically distinguishes an array from an associative array
is that the indices of an array are positive integers whereas the keys of an associative
array are strings. However, AWK uses string keys internally in both cases! Additionally, you
should use the `delete` statement for removing an element from an array.

Notice that associative arrays are called *hashes* in other programming languages.

#### An example

The following example illustrates associative arrays in AWK using the code found in `arrays.awk`.

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

	if (a["1"] == a[1]) {
		printf "a[1] = a[\"1\"] = %s\n", a["1"];
	}
}
{{< /file >}}

Notice that elements `a["1"]` and `a[1]` are exactly the same thing and that are
pointing to the same array element. You will learn about the `for` loop in a while.

The output of `arrays.awk` will clarify its code:

    awk -f arrays.awk
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

### Looping in AWK

AWK supports `for`, `do-while` and `while` loops that pretty much work like they
do in the C programming language.

#### An example

The `ARGC` variable can help you iterate over the command line arguments of an AWK command
with the help of a loop. This is illustrated in `loops.awk`, which is as follows:

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

Executing `loops.awk` will generate the following kind of output:

    echo "" | awk -f loops.awk
{{< output >}}
ARGV[0] = awk
ARGV[0] = awk
ARGV[0] = awk
0 1 2 3 4 5 6 7 8 9
{{< /output >}}

### Functions in AWK

#### Predefined AWK functions

AWK has built-in functions for string, number, time and date manipulation. You can
easily generate random numbers using the `rand()` function. However `rand()` can
generate repeatable output.

The use of the `rand()` function is illustrated in the following code, which is saved in
`rand.awk`:

{{< file "rand.awk" awk >}}
BEGIN {
for (i=0; i<=10; i++) {
	rnd[i] = 0;
}

while(i < 500)
{
	n = int(rand()*10);
	rnd[n]++;
	i++;
}

for( i=0; i<10; i++) {
	print i, "Occurred", rnd[i], "times";
}
}
{{< /file >}}

If you recall from the `hw.awk` program, the use of `BEGIN` is mandatory in order
to avoid waiting for input, which is not required in this program. Apart from this,
you just have two `for` loops and a single `while` loop.

Executing `rand.awk` will generate the following kind of output:

    awk -f rand.awk
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

### User Defined functions in AWK 

The AWK programming language allows you to define your own functions and use them
in your AWK programs. This is illustrated in `myFunction.awk`, which is as follows:

{{< file "myFunction.awk" awk >}}
function isnum(x) { return(x==x+0) }

function sumToN(n)
{
    sum = 0
    if (n < 0) { n = -n }
    if ( isnum(n) )
    {
        for (j = 1; j <= n; j++) { sum = sum + j }
    }
    else { return -1 }
    return sum
}

{
    for (i=1; i<=NF; i++)
    {
        print $i, "\t:", sumToN($i)
    }
}
{{< /file >}}

The user defined function is called `sumToN()`. The `isnum()` function is for making
sure that the input to `sumToN()` will be numeric.

Executing `myFunction.awk` will generate the following kind of output:

    echo "10 12" | awk -f myFunction.awk
{{< output >}}
10 	: 55
12 	: 78
{{< /output >}}

### BEGIN and END

AWK has two patterns named `BEGIN` and `END` with special meaning and functionality. It
should be noted that both of them are executed only once: before getting any input and
after finishing processing all input, respectively. They are useful for performing startup
and cleanup actions in your AWK programs.

Although it is not required to have the `BEGIN` rule at the beginning of your AWK program and
the `END` rule at the end of it, it is considered a good practice to put them there.
An AWK program can have multiple `BEGIN` and `END` blocks!

If an AWK program has only `BEGIN` rules without any other code, the program terminates
without reading any of the specified input. However, if an AWK program contains only `END` rules
without any additional code, all the specified input is read in case the `END` rule needs
to reference the `FNR` or `NR` variables.

### BEGINFILE and ENDFILE

Two other handy patterns with special functionality are `BEGINFILE` and `ENDFILE`.
Please note that they only work on `gawk`. `BEGINFILE` is executed before `gawk` reads
the first record from a file whereas `ENDFILE` is executed after `gawk` is done with
the last record of a file.

`ENDFILE` can be very convenient for recovering from I/O errors during processing;
the AWK program can pass the control to `ENDFILE` (instead of stopping abnormally)
and set the `ERRNO` variable that describes the error that just happened. Gawk clears
the `ERRNO` variable before it starts processing the next file. Similarly,
the `nextfile` statement, when used inside `BEGINFILE`, allows gawk to move to the next
data file instead of exiting with a fatal error without executing the `ENDFILE` block.

#### An Example

The presented code showcases the usage of `BEGIN`, `END`, `BEGINFILE` and `ENDFILE` by printing
the total number of files read as well as the filename of each file. The code also reports if
there is a problem while reading a file. The printing of the filename is done with the help of
the `FILENAME` variable.

{{< file "BEGINFILE.awk" awk >}}
BEGIN {
    numberOfFiles = 0
}

BEGINFILE {
    print "New file", FILENAME

    # Check if there is an error while trying to read the file
    if (ERRNO)
    {
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

This is a pretty clever AWK program that showcases the power of AWK when used
correctly.

Executing `BEGINFILE.awk` using `gawk` will generate the following kind of output:

    gawk -f BEGINFILE.awk hw.awk BEGINFILE.awk givenLine.awk doesNotExist
{{< output >}}
New file: hw.awk
New file: BEGINFILE.awk
New file: givenLine.awk
New file: doesNotExist
Cannot read doesNotExist
Total number of files processed: 3
{{< /output >}}

## Practical examples

In this section of the guide you will see practical uses of AWK. The best advice that I
can give you is to try all these examples on your own UNIX machines.

### Printing a Given Line from a File

Imagine that you want to print a given line from a text file. Well, AWK can help
you. The AWK code that implements that is the following:

{{< file "givenLine.awk" awk >}}
{
	if (NR==line)
	{
		print $0;
	}
}
{{< /file >}}

The `givenLine.awk` uses a parameter named `line` that should be given as a command
line argument to the AWK script using the `-v` flag.

Executing `givenLine.awk` will generate the following kind of output:

    awk -v line=1 -f givenLine.awk ./givenLine.awk
{{< output >}}
{
{{< /output >}}

    awk -v line=4 -f givenLine.awk ./givenLine.awk
{{< output >}}
		print $0;
{{< /output >}}

### Printing Lines that Follow a Numeric Pattern

In this section you will learn how to print lines 10, 20, 30, etc. of a file using
a variation of the code found in `givenLine.awk`. The AWK code is saved as
`multipleLines.awk` and is as follows:

{{< file "multipleLines.awk" awk >}}
{
	if (NR % line == 0)
	{
		print $0;
	}
}
{{< /file >}}

The trick here is done by the modulus operator (`%`).

Executing `multipleLines.awk` will generate the following kind of output:

    awk -v line=1 -f multipleLines.awk ./multipleLines.awk
{{< output >}}
{
	if (NR % line == 0)
	{
		print $0;
	}
}
{{< /output >}}

If the value of `line` is `1`, then `multipleLines.awk` will print the contents of
all input files.

### Printing two Given Fields from a File

Let us say that you have a file with multiple fields and that you want to print the
values of the 1st and the 3rd fields only. Well, AWK can help you with this as follows:

{{< file "field1and3.awk" awk >}}
{
	print $1, $3;
}
{{< /file >}}

Executing `field1and3.awk` will generate the following kind of output:

    awk -f field1and3.awk field1and3.awk
{{< output >}}
{
print $3;
}
{{< /output >}}

As `field1and3.awk` is pretty small, you can also execute it as follows:

    awk '{print $1, $3}' field1and3.awk
{{< output >}}
{
print $3;
}
{{< /output >}}

### Counting Lines

In this subsection you will learn how to count the number of lines that were given to AWK
for processing.

{{< file "countLines.awk" awk >}}
{
	if (FNR==1) {
		print "Processing:", FILENAME;
	}
}

END {
	print "Read", NR, "records in total";
}
{{< /file >}}

The use of `FNR` makes sure that the filename of each processed file will be
printed only once whereas the use of `END` makes sure that the results will be
printed just before the AWK finished its job.

Executing countLines.awk will generate the following kind of output:

	awk -f countLines.awk data.txt
{{< output >}}
Processing: data.txt
Read 7 records in total
{{< /output >}}

The contents of `data.txt` are the following:

{{< file "data.txt" text >}}
one
two
three
4

6
seven not eight
{{< /file >}}

If you give `countLines.awk` multiple files to process, you will get the following kind
of output:

	awk -f countLines.awk data.txt text
{{< output >}}
Processing: data.txt
Processing: text
Read 12 records in total
{{< /output >}}

### Counting Characters

This subsection will present AWK code that allows you to calculate the number
of characters found in the input files. The name of the AWK script is `countChars.awk`
and contains the following code:

{{< file "countChars.awk" awk >}}
BEGIN {
	n = 0;
}

{
	if (FNR==1) {
		print "Processing:", FILENAME;
	}
	n = n + length($0) + 1;
}

END {
	print "Read", n, "characters in total";
}
{{< /file >}}

Notice that the `+ 1` is for including the new line character that each line has.

Executing `countChars.awk` will generate the following kind of output:

    awk -f countChars.awk countChars.awk
{{< output >}}
Processing: countChars.awk
Read 149 characters in total
{{< /output >}}

	awk -f countChars.awk countChars.awk countLines.awk
{{< output >}}
Processing: countChars.awk
Processing: countLines.awk
Read 252 characters in total
{{< /output >}}

### Calculating Word Frequencies

The example of this section is relatively challenging but shows some of the advanced
capabilities of AWK. The presented AWK script (`wordFreq.awk`) reads a text file
and counts how many times each word appears in the text file with the help of
associative arrays.

The AWK code of `wordFreq.awk` is the following:

{{< file "wordFreq.awk" awk >}}
{
	for (i= 1; i<=NF; i++ ) {
		$i = tolower($i)
		freq[$i]++
	}
}

END {
	for (word in freq) print word, ":", freq[word] }
{{< /file >}}

Executing `wordFreq.awk` will generate the following kind of output:

	awk -f wordFreq.awk text | sort -k3rn
{{< output >}}
one : 4
two : 3
seven : 2
three : 2
five : 1
four : 1
{{< /output >}}

The `sort -k3rn` command is used for properly sorting the output of `wordFreq.awk`.
Please type `man sort` for the man page of the `sort(1)` command.

The contents of the `text` file are the following:

{{< file "text" text >}}
one two
three one four seven Seven
One Two TWO

one three five
{{< /file >}}

Try writing the `wordFreq.awk` program in C and you are going to appreciate AWK even
more!

### Updating your Docker Images

The following command will update all Docker images found on your local machine to their
latest version:

    docker images | grep -v REPOSITORY | awk '{print $1}' | xargs -L1 docker pull

In this example, AWK is just a part of the command and not the center of the command.
Still, AWK does the job of extracting the first field of `docker images` output pretty
well.

### Finding the top-10 commands of your Command History

The following shell command finds the top-10 commands using the output of the `history`
command as its input:

    history | awk '{CMD[$2]++;count++;} END {for (a in CMD)print CMD[a] " "CMD[a]/count*100 " % " a;} ' | grep -v "./" | column -c3 -s " " -t | sort -rn | head -n10
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

First, you execute the `history` command to get your input, which is processed by a rather
large `awk` command that calculates the number of times each command appears in `history` by 
considering the second field only, which is the name of the command – this is stored in the
`CMD` associative array. At the same time, the total number of commands that have been
processed is stored in the `count` variable. The frequency of each command is calculated
with the `CMD[a]/count*100` statement and printed on the screen along with the command name.
The formatting and the sorting of the output is handled by the `grep`, `column`, `sort` and
`head` command line utilities.

### Finding the Number of Records that Appear More than Once

The logic of the program is based on AWK associative arrays. The keys of the associative
array that is being used are the entire lines of the input. This means that if a line
appears more than once, it will be found in the associative array and will have a value
that is different from the default, which is `0`.

The AWK code of `nDuplicates.awk` is as follows:

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
	}
	else if (freq[i] > 1) {
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

Executing `nDuplicates.awk` will generate the following kind of output:

    awk -f nDuplicates.awk nDuplicates.awk
{{< output >}}
Found 11 lines with records that already existed
{{< /output >}}

    awk -f nDuplicates.awk nDuplicates.awk nDuplicates.awk
{{< output >}}
Found 44 lines with records that already existed
{{< /output >}}
