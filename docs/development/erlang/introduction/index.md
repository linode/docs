---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'An Introduction to the Erlang Programming Language.'
keywords: ["Erlang", "Development", "Programming"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-23
modified_by:
  name: Linode
title: 'Getting to Know the Erlang Programming Language'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[Erlang](https://www.erlang.org/)'
---

## Introduction

This guide is about the Erlang programming language. Erlang is a *Functional* programming language used for building massively scalable and real-time software systems with requirements for high availability. *Functional Programming* is a different kind of programming paradigm where computations are treated as an evaluation of mathematical functions. Therefore, you should forget most of the things you already know about Procedural or Object Oriented programming and start thinking in a new way. Other Functional programming languages are Elixir, SML, Scala and Idris.
The design and programming of Erlang software follows some basic principles. The first principle is that **systems fail**; you cannot avoid system failure, so let it crash! What you cannot avoid is detecting failures. However, it is not enough to just detect a failure, you must also be able to know why something failed. Another principle is that computations should be independent in order to make the code safer so that you can be able to use multiple CPUs and Cores without worrying about shared variables and shared memory. This has a very desirable side effect: you will be able to scale better! Last, Erlang processes talk to each other via messages; this is good because Erlang offers very fast message passing. Erlang can also program web services with the help of the [MochiWeb library](https://github.com/mochi/mochiweb).

This guide is a gentle introduction to Erlang that illustrates the following:

- The Erlang terminology.
- How to execute Erlang code.
- The Erlang data types.
- How to write Erlang modules and functions.
- The look of the Erlang code.

### In This Guide

This guide will teach you how to execute Erlang code, how to create modules, how to work with functions and variables, and how to work with files. All you need to follow this guide is to have Erlang and your favorite text editor installed on your Linode machine.

### Installing Erlang

You should install Erlang on your Linux machine using the package manager of your Linux distribution or by following the instructions found [here](https://www.erlang.org/downloads).

#### About BEAM

*BEAM* stands for Bodgan's Erlang Abstract Machine, which is a virtual machine that interprets optimized BEAM code. Each time you compile an Erlang program, the Erlang compiler converts the code into a BEAM file, which is what is going to be executed. BEAM files are binary files that have the `.beam` file extension.

#### About OTP

OTP stands for *Open Telecom Platform* and is Erlang’s collection of open source libraries and tools. OTP was designed for building big projects with big teams and is about taking all the generic components, putting them into libraries, making sure they work fine and reliably and then reusing that code as often as possible. So, what is left for the programmer? The programmer has to deal with things that change from application to application. Note that if you are going to write real world Erlang software, you will eventually have to learn the OTP Framework. OTP consists of three main parts that are the following:

- The Erlang language itself.
- The various tools that come with Erlang.
- The design rules, which are generic *behaviors* and abstract *principles* that allow you to focus on the logic of the system. The behaviors can be *worker processes* that do the dirty work while *supervisor processes* monitor workers as well as other supervisors.

OTP is the most important and vital part of Erlang. Unfortunately, talking more about OTP and its capabilities is beyond the scope of this guide.

## Erlang Basics

Erlang is designed to follow the next six principles:

- *Isolation*: Erlang processes are isolated by design. Each Erlang process has its own stack and heap and is separately garbage collected. Also, processes cannot see the memory of other processes and therefore cannot damage other processes.
- *Concurrency*: Erlang processes are concurrent. Therefore, in theory, all processes can run in parallel. This is a very good thing now that computers have multi core processors because processes can be spread over the available cores.
- *Failure Detection*: Erlang processes can detect failures. You can also create a link between two processes. Therefore, when a process dies for some reason, some other process can be informed about the failure of the first process. So, when something fails, you let someone else fix the problem.
- *Fault Identification*: When a process fails, the error signal contains additional data provided by the Erlang runtime system that tells you exactly why the process has failed.
- *Live Code Upgrade*: Erlang can be modified as it runs! Erlang applications can be upgraded while running.
- *Stable Storage*: This is not done in Erlang but in third party libraries. You can use Mnesia, Riak, etc. for storing data. Every process can access the data of a database because the data is shared among Erlang processes.

Note that all functional programming languages use *recursion* and *pattern matching* a lot and Erlang is no exception.

### Erlang Terminology

- *Atoms*: An *Atom* is used for representing a constant value. Atoms have a global scope and start with lowercase letters. The value of an atom is the atom itself! Although it looks strange to discuss about the value of an atom or an integer, the functional nature of Erlang requires that each expression has a value, which also applies to atoms and integers, despite the fact that they are naive expressions.
- *Maps*: A *Map* is a set of key and value pairs that is called a dictionary or a hash in other programming languages. Each pair is called an element – the total number of elements is called the size of the map.
- *Lists*: The *List* is the most important data type in Erlang, which is not strange because lists play a key role in almost all functional programming languages. A List can either be empty or contain data and has a variable number of elements. The first element of a list is the *head* whereas the remaining part is called the *tail* of the list. You know that you have processed all the elements of a list when you end up with an empty list, which is represented as `[]`.
- *Funs*: A *Fun* is a functional object that also allows you to create anonymous functions that you can pass as arguments to other functions as if they were variables without having to use their names.
- *Guards*: A *Guard* allows you to specify the kind of data a given function will accept. The `when` keyword indicates a guard. The condition of a guard is simple and allows you to do pattern matching based on the content of the argument and not just on its shape.
- *Tuples*: A *Tuple* is a composite data type, which means that a tuple allows you to combine multiple items into a single data type and store them using a **single** variable.

### Your First Erlang Program

The following is the Erlang version of the *Hello World* program:

{{< file "./hello.erl" erlang >}}
%% Programmer: Mihalis Tsoukalos
%% Date: Saturday 16 November 2019

-module(hello).
    -export([helloWorld/0]).

    helloWorld() -> io:fwrite("Hello world!\n").
{{< /file >}}

Erlang code is only delivered in modules. Lines that begin with `%%` are comments. Apart from the comments, the `hello` module contains a function named `helloWord()`, which uses `io:fwrite()` to print a message on the screen, requires no input arguments and returns no values.

In the next section you will learn how to execute the Erlang code of the `hello` module.

### How to Execute Erlang Code

In this section you will learn how to compile and execute `hello.erl`. First, you will need to execute the `erlc hello.erl` command; this command will compile the Erlang code and generate a BEAM file that is named after the filename with the Erlang code – in this case it will be `hello.beam`:

    ls -l hello.beam
{{< output >}}
-rw-r--r--  1 mtsouk  staff  672 Nov 20 15:16 hello.beam
{{< /output >}}

As you can see the `erlc hello.erl` command created a small binary file named `hello.beam`.

Then you will need to execute the following command in order to run the `helloWorld()` function from the `hello` module:

    erl -noshell -s hello helloWorld -s init stop
{{< output >}}
Hello world!
{{< /output >}}

Let us talk about the arguments of the `erl` command:

- `-noshell` tells `erl` to be executed without entering the Erlang shell. This makes possible for the Erlang runtime system to be part of a UNIX pipe.
- `-s` tells `erl` to call a specific functions from a specific module. First, the `helloWorld` function from the `hello` module and then the `stop` function from the `init` module. The former function prints the message on the screen and the latter ends the execution of `erl`. If you want to execute any code as a regular UNIX command line utility, then you should put the `-s init stop` an the end of the `erl` command.

The second way of executing Erlang code is by using the *Erlang shell* and it will explained in the next section.

### The Erlang Shell

The *Erlang shell* can be called by executing `erl` without any other command line arguments.

    erl
{{< output >}}
Erlang/OTP 22 [erts-10.5.5] [source] [64-bit] [smp:8:8] [ds:8:8:10] [async-threads:1] [hipe] [dtrace]

Eshell V10.5.5  (abort with ^G)
1>
{{< /output >}}

In order to exit the Erlang shell you will need to type the `init:stop().` and press the Enter key – you already saw that function in the previous section. If you press Control+C in the Erlang shell you will get access to the following menu:

{{< output >}}
1>
BREAK: (a)bort (c)ontinue (p)roc info (i)nfo (l)oaded
       (v)ersion (k)ill (D)b-tables (d)istribution
{{< /output >}}

If you press `a`, you will exit the Erlang shell.

The following output shows an interaction with the Erlang shell that compiles and executes `hw.erl`.

    erl
{{< output >}}
1> c(hello).
{ok,hello}
2> hello:helloWorld().
Hello world!
ok
{{< /output >}}

The `c(hello).` command compiles the `hello.erl` file whereas the `hello:helloWorld().` command calls the `helloWorld()` function from the `hello` module. After that you might want to type `init:stop().` to exit the Erlang shell. Note that Erlang commands in the Erlang shell should end with the `.` character.

## Writing Erlang Code

### Erlang Variables and Numbers

Erlang *variables* start with Capital Letters or underscores whereas "words" starting with lower case letters are *Atoms*. Remember that atoms are constants with their own name as their value. After declaring a variable inside the Erlang shell, you cannot change its value – Erlang uses the *single assignment model*, which allows each variable to be assigned a value only once in a given session or context. This is illustrated in the following interaction with the Erlang shell:

    erl
{{< output >}}
1> A_Variable="My Variable".
"My Variable"
2> Another_String="Another Variable".
"Another Variable"
{{< /output >}}

However, if you try to change the value of a variable, you will get an error message from Erlang:

{{< output >}}
3> Another_String="Change me!".
** exception error: no match of right hand side value "Change me!"
{{< /output >}}

This happens because you cannot change the value of a variable. Although this looks strange and inconvenient, it minimizes the side effects of your code, making it safer and better at concurrency.

Erlang also supports two kinds of numbers, *integers* and *floats*. When defining floats, you should always have a number on the left of the decimal point even if it is zero (`0.15`).

    erl
{{< output >}}
1> Var=12.
12
2> Float=12.1.
12.1
3> Sum=Var+Float.
24.1
{{< /output >}}

If you try to execute `Var=Var+1.`, you will get an error message (`** exception error: no match of right hand side value 13`) because from a mathematical perspective, the `12=12+1` expression is false.

### Erlang Modules

Erlang modules are governed by the following two basic rules:

- Only the functions in the `export()` list can be called from outside the module code (*public*).
- All other functions are *private*.

The following is an Erlang module named `square` with two public functions named `lenght()` and `area()`:

{{< file "./square.erl" erlang >}}
%%% Filename: square.erl
%% Programmer: Mihalis Tsoukalos
%% Date: Saturday 16 November 2019

-module(square).
-export([length/1, area/1]).

length(Side) -> 4 * Side.

area(Side) ->  Side * Side.
{{< /file >}}

Every Erlang module begins with the definition of the module's name using a `module()` statement followed by the `export()` statement. The `/1` after a function name in the `export()` list tells us that the function requires a single argument only.

We are going to use the functions of `square.erl` from the Erlang shell:

    erl
{{< output >}}
1> c(square).
{ok,square}
2> square:area(10).
100
3> square:area(10.5).
110.25
4> square:length(10.5).
42.0
{{< /output >}}

Both `square:area()` and `square:length()` can process integers as well as floating point numbers. However, if you give an invalid argument, such as a string, to any of them you will get an error message similar to the following:

{{< output >}}
2> square:length("123").
** exception error: an error occurred when evaluating an arithmetic expression
     in operator  */2
        called as "123" * 4
     in call from square:length/1 (square.erl, line 8)
{{< /output >}}

### Erlang Functions

A *Function* in Erlang is *a sequence of function clauses* that are separated by semicolons and terminated using a period. Functions are first class citizens in Erlang as in every other Functional Programming language and can be used as arguments to other functions. The number of the arguments of a function is called the *arity* of the function. Note that it is the combination of the module name (`m`), the function name (`f`) and the arity (`N`) that uniquely identifies a function as `m:f/N`.

The following module implements four functions:

{{< file "./functions.erl" erlang >}}
-module(functions).
-export([main/1,check_temperature/1]).

%%
fibo1(0) -> 0;
fibo1(1) -> 1;
fibo1(N) ->
    fibo1(N + 1, [1,0]).

fibo1(End, [H|_]=L) when length(L) == End -> H;
fibo1(End, [A,B|_]=L) ->
    fibo1(End, [A+B|L]).

%%
fibo2(N) when N > 0 -> fibVar(N, 0, 1).

fibVar(0, F1, _F2) -> F1;
fibVar(N, F1,  F2) -> fibVar(N - 1, F2, F1 + F2).

%%
check_temperature(Temp) ->
	case Temp of
		{celsius, N} when N >= 20, N =< 45 ->
			'Hot';
		{celsius, N} when N >= 46 ->
			'Way too hot!';
		{celsius, N} when N =< 19 ->
			'It is getting cold...';
		{kelvin, N} ->
			'Cannot tell about Kelvin!';
		{fahrenheit, N} ->
			'Do not know about Fahrenheit!';
		_ ->
			'What?'
	end.

main([Arg|_]) ->
    N = list_to_integer(atom_to_list(Arg)),
	io:format("fibo1: ~w -> ~w~n", [N, fibo1(N)]),
	io:format("fibo2: ~w -> ~w~n", [N, fibo2(N)]).
{{< /file >}}

As told before, the `/1` after a function name in the `export()` list tells us that the function takes a single argument. If a function has many clauses, as it happens with `fibo1()` that has three clauses, then you put a `;` character after each clause. The last statement of a function ends with `.`. The `check_temperature()` function processes *tuples* using *guards* and a `case` statement, which is a pretty common practice in Erlang. The `_` branch catches everything that has not be caught by anyone of the previous branches of the `case` statement.

We are going to execute `main()` from the command line and `check_temperature()` from the Erlang shell. We will begin with `main()`:

    erl -noshell -s functions main 20 -s init stop
{{< output >}}
fibo1: 20 -> 6765
fibo2: 20 -> 6765
{{< /output >}}

Then, we will continue with `check_temperature()`:

    erl
{{< output >}}
1> functions:check_temperature({fahrenheit, 50}).
'Do not know about Fahrenheit!'
2> functions:check_temperature({celsius, 50}).
'Way too hot!'
4> functions:check_temperature({"What is this?", 50}).
'What?'
{{< /output >}}

The main reason for calling these two function separately is that providing tuples as command line arguments is much trickier and usually requires the use of [Erlang script](http://erlang.org/doc/man/escript.html).

### Working with Files

No programming language can be considered important if it cannot deal with text and binary files because you cannot develop practical system tools without reading data from existing files or storing your data to files.

Most of the functions related to file operations can be found in the `file` module that gives you an interface to the file system. The two most important Erlang functions of the `file` module that are related to file input and output are `file:read()` and `file:write()`. You will also need two more functions in order to open and close a file, which are `open(File, Mode)` and `close(Device)`, respectively. The `file:open()` function takes two arguments, which are the path of the file you want to open and the *mode* in which you want to open the file. A successful call to `file:open()` returns a *tuple* of type `{ok, Fd}`. The first element shows that the operation was successful and the second element is used for referencing the file afterwards. The `Mode` part can have four values: `Read`, `Write`, `Append` and `Exclusive`.

#### File Copy in Erlang

The presented Erlang code will show a quick way of copying files in Erlang.

{{< file "./files.erl" erlang >}}
-module(files).
-export([copy/2]).

copy(Source, Destination) ->
	{ok, Data} = file:read_file(Source),
	{ok, FD} = file:open(Destination, [write]),
	file:write(FD, Data).
{{< /file >}}

The `file:read_file()` function reads the input file, the `file:open()` function opens a new file for writing and the `file:write()` function writes data to the opened file. The code does not perform any tests on whether the source file exists and is a regular file or the destination file can be created but it shows that Erlang can be good at systems programming tasks due to its rich standard library.

Executing `files.erl` from the Erlang shell will generate the following output:

    erl
{{< output >}}
2> c(files).
{ok,files}
3> files:copy("/bin/ls", "/tmp/ls").
ok
{{< /output >}}

The previous command created a copy of `/bin/ls` that was named `/tmp/ls`.

#### Processing Command Line Arguments

The following Erlang code shows how to iterate over the command line arguments of a program:

{{< file "./args.erl" erlang >}}
-module(args).
-export([main/1]).

main(Args) ->
    io:format("*** Printing command line arguments:~n"),
    lists:foreach(fun(Arg) -> io:format("* Arg: ~p~n", [Arg]) end,Args).
{{< /file >}}

The name of the module is `args` – only the `main()` function is exported. The `lists:foreach()` function iterates over the elements of the `fun(Arg)` list in order to process all of its elements and it will stop when the list is empty.

You will need to compile `args.erl` by executing `erlc args.erl` in order to create the BEAM file. Then, you will be able to execute the BEAM file that corresponds to `args.erl` as follows:

    erl -noshell -s args main 1. Hello 2. Linode 3. World -s init stop
{{< output >}}
*** Printing command line arguments:
* Arg: '1.'
* Arg: 'Hello'
* Arg: '2.'
* Arg: 'Linode'
* Arg: '3.'
* Arg: 'World'
{{< /output >}}

#### Reading a File Line by Line

The example of this section will present Erlang code that allows you to read a text file line by line.

{{< file "./lineByLine.erl" erlang >}}
-module(lineByLine).
-export([lineByLine/1]).

lineByLine(File) ->
	{ok, FD} = file:open(File,[read]),
	read_line_by_line(FD),
	file:close(FD).
	
read_line_by_line(FD) ->
    case file:read_line(FD) of
        {ok, Line} -> io:format("~s", [Line]),
                   read_line_by_line(FD);
        eof        -> ok
    end.

{{< /file >}}

The `read_line_by_line()` function gets a file descriptor from `lineByLine()` that is used for iterating over the lines of the file that is associated with the given file descriptor. All the work is done by the `file:read_line()` [function](http://erlang.org/doc/man/file.html#read_line-1). The `read_line_by_line()` function recursively calls itself until all the lines of the file are read. When there is nothing more to read from the file, the code in the `eof` branch will be executed and the function will return `ok`.

The text file that will be used for testing `lineByLine.erl` has the following contents:

    cat /tmp/data.txt
{{< output >}}
1 2
Three
Four 5
Lines of plain text!
{{< /output >}}

After compiling `lineByLine.erl` with `erlc`, you can execute it as follows:

    erl -noshell -s lineByLine lineByLine /tmp/data.txt
{{< output >}}
1 2
Three
Four 5
Lines of plain text!
^C
BREAK: (a)bort (c)ontinue (p)roc info (i)nfo (l)oaded
       (v)ersion (k)ill (D)b-tables (d)istribution
a
{{< /output >}}

Note that the reason for not putting `-s stop exit` at the end of the previous command is that it will call `stop:exit()` concurrently, which will not give `lineByLine:lineByLine()` enough time to finish, which will crash the program. The only downside to this approach is that you will have to terminate it on your own. Alternatively, you can execute `lineByLine:lineByLine()` inside the Erlang shell.

#### Finding out Your Erlang Version

Finding out the version of Erlang you are using requires the execution of a pretty complex command that includes a call to the `file:read_file()` function in combination to a call to `erlang:system_info()`:

    erl -eval '{ok, Version} = file:read_file(filename:join([code:root_dir(), "releases", erlang:system_info(otp_release), "OTP_VERSION"])), io:fwrite(Version), halt().' -noshell
{{< output >}}
22.1.7
{{< /output >}}

## Summary

This guide presented a gentle introduction to Erlang. Both Erlang and the functional programming paradigm need some time to get used to them. 

Erlang is a powerful programming language that can be used for systems programming and for creating robust and concurrent fault tolerant server processes, provided that you spend the required amount of time to experiment and learn it. Begin by developing small programs in Erlang before working with OTP and programming fault tolerant applications.
