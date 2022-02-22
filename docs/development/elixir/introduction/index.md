---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'An introduction to the Elixir Programming Language.'
keywords: ["Erlang", "Elixir", "Development", "Programming", "BEAM", "Functional Programming"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-12-03
modified_by:
  name: Linode
title: 'Getting to know the basics of the Elixir Programming Language'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[Elixir](https://elixir-lang.org/)'
  - '[Elixir on GitHub](https://github.com/elixir-lang/elixir)'
  - '[Elixir on Twitter](@elixirlang on Twitter)'
  - '[The IO Elixir module](https://hexdocs.pm/elixir/IO.html)'
---

## Introduction

*Elixir* is a programming language created by [José Valim](https://github.com/josevalim) that is built on top of the Erlang Virtual Machine. Elixir tries to improve the complicated parts of Erlang while keeping the good parts intact. As Elixir is based on Erlang VM, an Elixir program can call any Erlang function without any runtime cost. Elixir offers a command line utility to compile your projects as well as an interactive environment. This guide is a gentle introduction to the basics of Elixir in order to get you started. If you want to begin creating production applications in Elixir you will need to begin learning more about OTP, processing lists and maps, parsing command line arguments in command line utilities and creating Elixir projects using `mix`.

The contents of this guide include the following:

- How to write and execute Elixir code.
- The basic Data Types of Elixir.
- The main differences between Elixir and Erlang.
- How to develop modules in Elixir.
- How to perform basic File I/O operations in Elixir.

The `.ex` extension is used for storing files with Elixir code whereas the `.exs` extension is used for Elixir scripts – note that this is just a convention. Last, Elixir offers the [Phoenix framework](https://www.phoenixframework.org/) for developing Web applications.

## In This Guide

This guide you will teach you about the basic Elixir data types, how to compile and execute Elixir code, how to work with files and the way pattern matching works in Elixir. Last, it will introduce you to the `mix` tool, which is the Elixir software project management tool. All you need to follow this guide is to have Elixir as well as Erlang and your favorite text editor installed on your Linode machine.

### Installing Elixir

You should install Elixir on your Linux machine using the package manager of your Linux distribution or by following the instructions found [here](https://elixir-lang.org/install.html). Note that Elixir needs Erlang to work so you will also need to install [Erlang](https://www.erlang.org/).

You can find the version of Elixir you are using by executing the following command:

    elixir --version
{{< output >}}
Erlang/OTP 22 [erts-10.5.6] [source] [64-bit] [smp:8:8] [ds:8:8:10] [async-threads:1] [hipe] [dtrace]

Elixir 1.9.4 (compiled with Erlang/OTP 22)
{{< /output >}}

This means that we will be using Elixir version 1.9.4 in this guide.

### Differences Between Erlang and Elixir Code

The main differences between Elixir and Erlang code are the following:

- The biggest difference between Elixir and Erlang is that in Elixir the value of a variable can change after its initial assignment whereas in Erlang this is not allowed.
- Every Erlang command should end with a `.` whereas Elixir expressions are delimited by a line break or a semicolon.
- Elixir offers a tool for creating new projects called `mix`. To get a list of all available mix options execute `mix --help`. If you want to find more information about the `new` command you can execute `mix help new` – this works for every other `mix` command.
- The Elixir syntax looks a lot like Ruby syntax whereas the Erlang syntax looks like the syntax of Lisp.
- Elixir is a more modern programming language than Erlang – the way Elixir code looks proves that.
- All functions in Elixir modules are public unless they are defined using `defp` instead of `def`. No need to keep an export list as it happens with Erlang.
- Comments in Elixir begin with `#` whereas in Erlang you should use the `%` character to declare a comment.

{{< note >}}
As all Elixir and Erlang processes communicate with messages, it does not matter whether all processes are running on the same machine or not because they will be able to communicate with each other if needed. This guide will not use this Elixir feature.
{{< /note >}}

## Your First Elixir Program

This is the *Hello World* program written in Elixir:

{{< file "./hw.ex" elixir >}}
defmodule HW do
  def hello do
    IO.puts "Hello World!"
  end
end
{{< /file >}}

The `defmodule` keyword defines a new module named `HW` whereas the `def` keyword begins the implementation of a function named `hello`.

### How to Execute Elixir Code

You can execute `hw.ex` using the interactive Elixir shell (`iex`) or compile it using the Elixir compiler (`elixirc`). Alternatively, you can use the *Elixir script runner*, named `elixir`, that is similar to `iex` with the difference that it automatically exits when the Elixir script finishes its execution.

#### Using the Elixir Compiler

Compiling and executing an Elixir module such as `hw.ex` is a two step process:

- Compiling your Elixir code using the `elixirc` compiler.
- Executing the desired function from the BEAM file from another module or from `iex`.

If the code is syntactically correct, `elixirc` will silently generate a BEAM file, which in this case will be named `Elixir.HW.beam`, that you should use to execute your code. Note that the BEAM file is named after the name of the module not the name of the file with the Elixir code. After that we are going to use `iex` to execute the `HW.hello` function:

    iex
{{< output >}}
iex(1)> HW.hello
Hello World!
:ok
{{< /output >}}

#### Using the Elixir Shell

You should first go to the Elixir shell by executing `iex` with the source file as its argument:

    iex hw.ex
{{< output >}}
iex(1)> HW.hello
Hello World!
:ok
{{< /output >}}

This will compile and load the Elixir code in order for you to execute the desired functions.

Alternatively, you can do the following:

    iex
{{< output >}}
iex(1)> c("hw.ex")
[HW]
iex(2)> HW.hello
Hello World!
:ok
{{< /output >}}

The `c("hw.ex")` command compiles `hw.ex` and returns the name of the module (`HW`). After that you execute `HW.hello` as before. You can exit `iex` by executing `:init.stop`, which is an Erlang command – all Erlang functions called in Elixir begin with `:`.

#### Using the Elixir Script Runner

In order to execute `HW.hello` in an Elixir script, you will need to make a copy of `hw.ex`, name it `hw.exs` and add the function that you want to call at the end of the file. The `s` at the file extension denotes that this is an Elixir script and should be interpreted at runtime instead of compiled. The final version of `hw.exs` will be the following:

{{< file "./hw.exs" elixir >}}
defmodule HW do
  def hello do
    IO.puts "Hello World!"
  end
end

HW.hello
{{< /file >}}

The only difference between `hw.exs` and `hw.ex` is the `HW.hello` call at the end of `hw.exs`. Executing `hw.exs` will generate the following output:

    elixir hw.exs
{{< output >}}
Hello World!
{{< /output >}}

Note that you are also free to execute `hw.exs` using `elixirc`:

    elixirc hw.exs
{{< output >}}
Hello World!
{{< /output >}}

You can also execute the code from `hw.ex` with `elixir` provided that you add the required parameters:

    elixir -r hw.ex -e HW.hello
{{< output >}}
Hello World!
{{< /output >}}

However, if you try to execute `elixir -r hw.ex`, you will get no output because there is not a function in `hw.ex` that is going to be called automatically.  So, `-e` tells `elixir` to execute a certain function. Note that you can use `-e` multiple times for calling multiple functions.

If by mistake you execute `elixirc -r hw.ex -e HW.hello`, you will get the following output:

    elixirc -r hw.ex -e HW.hello
{{< output >}}
Hello World!
No files matched provided patterns
{{< /output >}}

{{< note >}}
The main difference between using `elixir` and `elixirc` is that `elixir` automatically deletes the BEAM file that it creates when compiling Elixir code.
{{< /note >}}

### Elixir Data Types

Elixir supports the following data types:

- *Atoms*: As it happens in Erlang, atoms are just constants whose name is their value – they are created with the `:` symbol (`:linode`). Elixir offers the `is_atom()` that helps you determine whether a value is an atom or not.
- *Lists*: A List is an ordered and sequentially accessed collection of data that can be used for iteration. Lists elements are enclosed in square brackets like `[val1, val2, val3, ...]`. You can learn more about lists [here](https://hexdocs.pm/elixir/List.html).
- *Tuples*: A Tuple is an ordered and randomly accessed collection of data that cannot be used for iteration. A tuple looks like `{val1, val2, val3, ...}`. Tuples usually have a small amount of elements (up to four) – if you need something bigger, then you should look at maps.
- *Booleans*: The value of a boolean in Elixir can be either `true` or `false`.
- *Strings*: A String in Elixir is defined using a string literal, which is text surrounded by double quotes.
- *Maps*: A Map in Elixir stores collections of key and value pairs without any order. You can learn more about maps [here](https://hexdocs.pm/elixir/Map.html).
- *Sets*: A Set in Elixir is for storing unique elements. Elixir allows you to perform operations such as union, intersection and difference between sets.
- *Structs*: A Struct in Elixir allows you to define data structures with properties and values of any data type. You can consider structs as enhanced maps.
- *Keyword Lists*: A Keyword List in Elixir is a list of key and value pairs where **the key should be an atom**. You can consider the elements of a keyword lists as tuples with two items. Keyword lists are good for command line parameters and flags. You can learn more about keyword lists [here](https://hexdocs.pm/elixir/Keyword.html).
- *Anonymous Functions*: Functions play a key role in every functional programming language and Elixir is no exception. Therefore, Elixir supports anonymous functions. Anonymous functions are created using the `fn` keyword.
- *Binaries*: A Binary (or *Bitstring*) in Elixir is used for keeping binary data.

Additionally, Elixir has support for both *integer* and *floating point* numerical types. Note that unlike most programming languages, division between integer values always returns a float in Elixir.

#### The difference between Lists and Tuples

Lists in Elixir are implemented as *Linked Lists*, which means that accessing an element on a list is a linear operation. In fact, finding the length of a list in Elixir is a linear operation – all the elements of the list are accessed in order to find its length. On the other hand, tuples are stored contiguously in memory. In practice, this means that accessing a tuple element using its index is fast. However, adding or deleting elements from a tuple is pretty expensive because Elixir has to create an entirely new tuple in memory, which is not the case for Elixir lists.

### The Elixir shell

The following output shows an interaction with the Elixir shell in order to get used to Elixir data types:

    iex
{{< output >}}
iex(1)> an_atom = :an_atom
:an_atom
iex(2)> is_atom(an_atom)
true
iex(3)> is_atom(:an_atom)
true
iex(4)> a_String="This is a string"
"This is a string"
iex(5)> an_integer=12345
12345
iex(6)> a_float=12.1234
12.1234
iex(7)> floats_should_begin_with_a_number=.1
** (SyntaxError) iex:7: syntax error before: '.'

iex(7)> floats_should_begin_with_a_number=0.1
0.1
iex(8)> 2 * a_float
24.2468
iex(9)> a_tuple = {:ok, "hello"}
{:ok, "hello"}
iex(10)> tuple_size(a_tuple)
2
iex(11)> {a1, a2} = a_tuple
{:ok, "hello"}
iex(12)> a1
:ok
iex(13)> a2
"hello"
iex(14)> a_list = [1, :true, "Hello", 4]
[1, true, "Hello", 4]
iex(15)> another_list = [5, 6, "Seven"]
[5, 6, "Seven"]
iex(16)> big_list = a_list ++ another_list
[1, true, "Hello", 4, 5, 6, "Seven"]
iex(17)> a_function = fn a1, a2 -> a1+a2 end
#Function<13.126501267/2 in :erl_eval.expr/5>
iex(18)> a_function.(4, 5)
9
iex(19)> a_keyword_list = [one: "value_one", two: "value_two", three: "value_three"]
[one: "value_one", two: "value_two", three: "value_three"]
iex(20)> the_same_keyword_list = [ {:one, "value_one"}, {:two, "value_two"}, {:three, "value_three"} ]
[one: "value_one", two: "value_two", three: "value_three"]
{{< /output >}}

Note that in order to call an anonymous function like `a_function`, you need to put a `.` character between the function name and the list of function arguments (`a_function.(4, 5)`). Also, note that there exist two ways to define a keyword list, as illustrated by the `a_keyword_list` and `the_same_keyword_list` variables.

Elixir also supports *ranges* as illustrated in the next interaction with the Elixir shell:

{{< output >}}
iex(2)> a_range = 5..12
5..12
iex(3)> for n <- a_range, do:
...(3)>    IO.write n
56789101112[:ok, :ok, :ok, :ok, :ok, :ok, :ok, :ok]
{{< /output >}}

The Elixir shell is the perfect place to experiment with Elixir, learn about Elixir data types and try new things.

## Writing Elixir code

### A Simple Elixir Program

The following Elixir code calculates numbers of the Fibonacci sequence:

{{< file "./fibonacci.ex" elixir >}}
defmodule Fibonacci do 
    def fibonacci(0) do 0 end
    def fibonacci(1) do 1 end
    def fibonacci(n) do fibonacci(n-1) + fibonacci(n-2) end
end

for n <- 0..10, do:
    IO.puts Fibonacci.fibonacci(n)

for n <- 6..12, do:
    IO.write "#{Fibonacci.fibonacci(n)} "
IO.write("\n")
{{< /file >}}

The implementation of the `fibonacci()` function uses pattern matching to decide what to do with its input, which is a very common way of programming in Elixir, that looks like having multiple definitions of the same function. The first match that will be found is the one that is going to be executed so the order you define your pattern matching rules is important.

You can also see that `for` loops in Elixir use ranges. Also, you can see `IO.write` and `IO.puts` in action. Although both functions are used for printing output on the screen, `IO.puts` appends a newline character after its execution. If you want to print a newline character with `IO.write` you should use `\n`. Last, note that if you need to put the value of a variable inside a string, you use the `#{NAME}` notation, which works for both variables and the return values of functions.

Executing `fibonacci.ex` will generate the following kind of output:

    elixir fibonacci.ex
{{< output >}}
0
1
1
2
3
5
8
13
21
34
55
8 13 21 34 55 89 144
{{< /output >}}

### Elixir Modules

*Modules* are namespaces created using the `defmodule` keyword where you can safely define things you want and use them later. If you want to use a function from a module outside the current module, you should prefix it with the name of the module.

{{< file "./a_module.ex" elixir >}}
defmodule Linode do
    def hello do
      IO.puts "Hello Linode World!"
    end
	
  defmodule Tsoukalos do
      def hello do
        IO.puts "Hello Tsoukalos World!"
      end
  end
end
{{< /file >}}

The presented Elixir module has an internal structure and contains a submodule named `Tsoukalos`. However, as module nesting is in reality an illusion, the previous Elixir code could be written in an equivalent way as follows:

{{< file "./a_module.ex" elixir >}}
defmodule Linode do
    def hello do
      IO.puts "Hello Linode World!"
    end
end
	
defmodule Linode.Tsoukalos do
    def hello do
        IO.puts "Hello Tsoukalos World!"
    end
end
{{< /file >}}

Note that compiling anyone of the two versions of `a_module.ex` will generate two BEAM files named `Elixir.Linode.Tsoukalos.beam` and `Elixir.Linode.beam`.

### Working With Files

The `File` module has many functions that allow you to work with the file system including functions for opening, reading and writing to files. By default, Elixir opens files in binary mode. Most functions can be called with or without an exclamation mark (`!`). However, the version without the exclamation mark is usually preferred because it allows you to personally take care of the various situations using pattern matching. You will learn the difference between the two versions in a while.

The presented program opens a file for reading and processes it line by line. Each line is converted to uppercase and written to a new file. Both input and output files must be given as command line arguments.

{{< file "./files.ex" elixir >}}
defmodule FileOperations do

    def processFile(filename, output) do
        {:ok, newFile} = File.open output, [:write]
        processEachLine(filename, fn(line) -> IO.binwrite newFile, String.upcase(line) end)
        File.close(newFile)
        File.close(filename)
    end

    def processEachLine(filename, lineHandler) do
            stream = File.stream!(filename)
            Enum.each stream, fn(line) -> {lineHandler.(line), IO.write "."} end
    		IO.puts ""
    end
end

[input, output] = System.argv
IO.puts "Input file: #{input}"
IO.puts "Output file: #{output}"

FileOperations.processFile(input, output)
{{< /file >}}

The program uses the `File.stream!(filename)` call to open a file for reading which is a different way of opening and processing a file. The input file is opened for reading inside the `processEachLine()` function. The `File.stream` function reads a file line by line, and the `Enum.each` function processes each line – after copying a line to the new file using an anonymous function, a `.` character is printed on the screen using the `IO.write "."` statement. The `IO.binwrite newFile` command writes to the new file that was opened for writing using the `{:ok, newFile} = File.open output, [:write]` statement. The approach might look a little strange if you are used to reading files in programming languages such as C or Perl but it is pretty smart. An open file can be closed with the `File.close()` function. The presented Elixir code presents a naive way of reading the command line arguments of a program (`[input, output] = System.argv`). If you are really into developing command line applications, you will most likely need the advanced capabilities of [OptionParserView](https://hexdocs.pm/elixir/OptionParser.html). Last, the `String.upcase(line)` statement converts each line from the input file into uppercase before writing it to the output file.

The input file for `files.ex` will be `data.txt` and has the following contents

    cat data.txt
{{< output >}}
1 two
three 4 5
six Seven
{{< /output >}}

Executing the code in `files.ex` will generate the following kind of output:

    elixir files.ex data.txt /tmp/copy_of_data.txt
{{< output >}}
Input file: data.txt
Output file: /tmp/copy_of_data.txt
...
{{< /output >}}

The contents of `/tmp/copy_of_data.txt` will be as follows:

    cat /tmp/copy_of_data.txt
{{< output >}}
1 TWO
THREE 4 5
SIX SEVEN
{{< /output >}}

#### The difference between File.open! and File.open

There is a subtle difference between `File.open!` and `File.open` - this rule also applies to the other functions of `File`. The `File.open` function returns a tuple all the time whereas the `File.open!` function it will either return an `io_device` variable on success or it will raise an error on failure. If the first value of the tuple returned from `File.open` is `:ok`, then its second value will be an `io_device`. On the other hand, if the first value of the tuple returned from `File.open` is `:error`, then the second value will contain the reason of failure. This is illustrated in the next interaction with the Elixir shell:

    iex
{{< output >}}
iex(26)> file = File.open!("/tmp/DonesNotExist", [:read, :utf8])
** (File.Error) could not open "/tmp/DonesNotExist": no such file or directory
    (elixir) lib/file.ex:1439: File.open!/2
iex(27)> file = File.open("/tmp/DonesNotExist", [:read, :utf8])
{:error, :enoent}
iex(28)> file = File.open("/tmp/exists.log", [:read, :utf8])
{:ok, #PID<0.156.0>}
iex(29)> file = File.open!("/tmp/1.log", [:read, :utf8])
#PID<0.158.0>
{{< /output >}}

If the file that you want to open for reading does not exist, `File.open!()` will return an error message whereas `File.open()` will return a tuple that you can process. In the first case, the program will crash whereas in the second case, you can handle the error situation in any way you want.

### Pattern Matching

Elixir program flow is strongly based on pattern matching. The way pattern matching work in Elixir will be illustrated in the following interaction with the Elixir shell:

    iex
{{< output >}}
iex(24)> a_list = [-1, 0, 1]
[-1, 0, 1]
iex(25)> [a1, a2, a3] = a_list
[-1, 0, 1]
{{< /output >}}

The first statement defines a new list with three elements named `a_list` whereas the second statement matches the elements of `a_list` with three distinct variables. If you provide the wrong number of variables, the matching with `a_list` will fail:

{{< output >}}
iex(26)> [aa1, aa2] = a_list
** (MatchError) no match of right hand side value: [-1, 0, 1]
    (stdlib) erl_eval.erl:453: :erl_eval.expr/5
    (iex) lib/iex/evaluator.ex:257: IEx.Evaluator.handle_eval/5
    (iex) lib/iex/evaluator.ex:237: IEx.Evaluator.do_eval/3
    (iex) lib/iex/evaluator.ex:215: IEx.Evaluator.eval/3
    (iex) lib/iex/evaluator.ex:103: IEx.Evaluator.loop/1
    (iex) lib/iex/evaluator.ex:27: IEx.Evaluator.init/4
iex(26)> [aa1, aa2, aa3, aa4] = a_list
** (MatchError) no match of right hand side value: [-1, 0, 1]
    (stdlib) erl_eval.erl:453: :erl_eval.expr/5
    (iex) lib/iex/evaluator.ex:257: IEx.Evaluator.handle_eval/5
    (iex) lib/iex/evaluator.ex:237: IEx.Evaluator.do_eval/3
    (iex) lib/iex/evaluator.ex:215: IEx.Evaluator.eval/3
    (iex) lib/iex/evaluator.ex:103: IEx.Evaluator.loop/1
    (iex) lib/iex/evaluator.ex:27: IEx.Evaluator.init/4
{{< /output >}}

Similarly, the following statement will also fail but for a different reason:

{{< output >}}
iex(26)> [aa, aa, aa] = a_list
** (MatchError) no match of right hand side value: [-1, 0, 1]
    (stdlib) erl_eval.erl:453: :erl_eval.expr/5
    (iex) lib/iex/evaluator.ex:257: IEx.Evaluator.handle_eval/5
    (iex) lib/iex/evaluator.ex:237: IEx.Evaluator.do_eval/3
    (iex) lib/iex/evaluator.ex:215: IEx.Evaluator.eval/3
    (iex) lib/iex/evaluator.ex:103: IEx.Evaluator.loop/1
    (iex) lib/iex/evaluator.ex:27: IEx.Evaluator.init/4
{{< /output >}}

The reason for the error message is that **variables bind once per match** and keep their values until the end of the match.

It would surprise you to learn that when you type `a = 12` inside the Elixir shell, the equal sign does not initially assign the value on the right to the variable on the left! The equal sign is a *match operator* in Elixir terminology and Elixir tries to make the `a = 12` expression `true` by giving variable `a` the value that is on the right side!

    iex
{{< output >}}
iex(22)> aa = 12
12
iex(23)> aa = 13
13
iex(24)> 12 = aa
** (MatchError) no match of right hand side value: 13
    (stdlib) erl_eval.erl:453: :erl_eval.expr/5
    (iex) lib/iex/evaluator.ex:257: IEx.Evaluator.handle_eval/5
    (iex) lib/iex/evaluator.ex:237: IEx.Evaluator.do_eval/3
    (iex) lib/iex/evaluator.ex:215: IEx.Evaluator.eval/3
    (iex) lib/iex/evaluator.ex:103: IEx.Evaluator.loop/1
    (iex) lib/iex/evaluator.ex:27: IEx.Evaluator.init/4
{{< /output >}}

However, in the `12 = aa` statement, Elixir cannot change the value of `12`, which is the reason for the `(MatchError) no match of right hand side value: 13` error message.

### Using mix

This section is a quick introduction to the `mix` utility that offers all the tools needed for creating, building and executing professional Elixir projects.

The most important options of `mix` are the following:

- The `mix new` command is for creating a new project.
- The `mix compile` command compiles source files.
- The `mix clean` command deletes the generated application files.
- The `mix run` command begins and runs the current application.
- The `mix test` command runs the tests of the project.

For the full list of supported command please type `mix help` on your Linux shell.

#### A Sample mix Project

First, we will need to execute the following two commands:

- `mix new simple_cli`
- `cd simple_cli`

Running `mix compile` at this point will compile the project and verify that there are not any errors in the Elixir code.

The structure and the files of the initial `mix` project are as follows:

    tree
{{< output >}}
.
├── README.md
├── _build
│   ├── dev
│   │   └── lib
│   └── test
│       └── lib
├── lib
│   └── simple_cli.ex
├── mix.exs
└── test
    ├── simple_cli_test.exs
    └── test_helper.exs

7 directories, 5 files
{{< /output >}}

The purpose of the `mix.exs` file is to configure your project and its dependencies in case you need to use any external libraries, which is usually the case and has three parts. 

- The `project` function is used for describing the project 
- The `application` function is used for describing the application itself. 
- The `deps` function is used for listing the dependencies of the project.

The code for the project can be found in `lib/simple_cli.ex` but you can add more Elixir source files inside `./lib`.

The final version of `./lib/simple_cli.ex` is the following:

    cat ./lib/simple_cli.ex
{{< output >}}
defmodule SimpleCli do
  @moduledoc """
  Documentation for SimpleCli.
  """

  @doc """
  Hello world.

  ## Examples

      iex> SimpleCli.hello()
      :world

  """
  def hello do
    :world
	IO.puts "Using mix!"
	IO.puts "Hello World!"
  end
end
{{< /output >}}

The following command shows how to execute your project:

    mix run -e SimpleCli.hello
{{< output >}}
Using mix!
Hello World!
{{< /output >}}

You can find more information about the `mix` tool [here](https://hexdocs.pm/mix/Mix.html).

## Summary

Programming with a functional programming language, such as Elixir, for the first time requires some getting used to it in order to see the advantages of Elixir and the OTP library. Only your experience can tell you when you should use Elixir when developing a new project or some other programming language.
