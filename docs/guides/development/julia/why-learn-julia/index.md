---
slug: why-learn-julia
description: 'This guide introduces you to the main features, benefits, and limitations of the Julia language, and includes a brief section on installation and use.'
keywords: ['data science','julia','python','why learn Julia']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-12-11
modified: 2019-02-01
modified_by:
  name: Linode
title: Why You Should Learn Julia
external_resources:
- '[Julia](https://julialang.org/)'
- '[Julia By Example](https://juliabyexample.helpmanual.io/)'
- '[JuliaBox](https://juliabox.com/)'
audiences: ["beginner"]
concentrations: ["Scientific Computing and Big Data"]
languages: ["julia"]
dedicated_cpu_link: true
aliases: ['/development/julia/why-learn-julia/']
authors: ["Linode"]
---
![Why You Should Learn Julia](Why_You_Should_Learn_Julia_smg.jpg)

## What is Julia?

Julia is a functional programming language released in 2012. Its creators wanted to combine the readability and simplicity of Python with the speed of statically-typed, compiled languages like C.

## Who is Julia For?

Julia is popular among data scientists and mathematicians. It shares features (such as 1-based array indexing and functional design) with mathematical and data software like Mathematica, and its syntax is closer to the way mathematicians are used to writing formulas. Julia also includes excellent support for parallelism and cloud computing, making it a good choice for big data projects.

## Should I Learn Julia?

Julia is a relatively new language and is still under development. This means there are more bugs and fewer native packages than you would expect from a more mature language. Established languages like Python and Java also have much larger communities, making it easier to find tutorials, third-party packages, and answers to your questions. On the other hand, Julia's speed, ease of use, and suitability for big-data applications (through its high-level support for parallelism and cloud computing) have helped it to grow quickly and it continues to attract new users. Julia developers are already working at companies including Google, NASA, and Intel, and major projects like RStudio have announced plans to add support for Julia.

### Compiling

Julia is a compiled language, that's one of the reasons that it performs faster than interpreted languages. However, unlike traditional compiled languages, Julia is not strictly statically typed. It uses JIT (Just In Time) compilation to infer the type of each individual variable in your code. The result is a dynamically-typed language that can be run from the command line like Python, but that can achieve comparable speeds to compiled languages like C and Go.

### Parallelism

It is possible to run code in parallel in Python in order to take advantage of all of the CPU cores on your system. This requires importing modules and involves some quirks that can make concurrency difficult to work with. In contrast, Julia has top-level support for parallelism and a simple, intuitive syntax for declaring that a function should be run concurrently:

    nheads = @parallel (+) for i = 1:100000000
      rand(Bool)
    end

### Libraries

Python is older than Julia and has a wider user base and a large, enthusiastic community. As a result, Python has a huge library of well-maintained libraries and packages. Julia, as a much newer language with a smaller user base, has far fewer packages available. It is possible to run Python libraries in Julia (through the `PyCall` package), and C/Fortran libraries can be called and run directly from Julia code. This allows Julia users to access a wider range of external libraries than it would otherwise have, but Python still has the advantage of a large set of native packages and a vibrant community.

### Type Checking

Python is a dynamically-typed language, meaning that you declare a variable without specifying its type; the Python interpreter determines the type from the value provided (e.g. `m = 5` will be interpreted as an integer). Variables in Julia can be declared in this way as well; however, it is possible to specify types, or a range of possible types, for a variable. Specifying the expected types for a function helps the compiler optimize for better performance, and can also prevent errors resulting from unexpected or incorrect input.

### Multiple Dispatch

**Multiple dispatch** refers to declaring different versions of the same function to better handle input of different types. For example, you might write two different `reverse` functions, one that accepts an array as an argument and one that accepts a string. The Julia interpreter will check the type of the argument whenever `reverse` is called, and dispatch it to the version matching that type.

### Array Indexing

One small but significant difference between Julia and Python (along with most other modern programming languages) is that arrays in Julia are 1-indexed, meaning that you access the first element of an array with `this_array[1]` rather than `this_array[0]`. This choice was made to make Julia more intuitive for users of Mathematica and other technical computing tools, but can be a source of frustration (and errors) for users used to zero-indexed languages.

## How Can I Get Started with Julia?

### Install Julia

On all platforms, the recommended way to install Julia is through the official packages on the [Julialang downloads page](https://julialang.org/downloads/index.html). The Mac and Windows versions will automatically install Julia on your computer; on Linux, you will have to unarchive the `.tar` file and move or symlink it to a location on your system PATH:

    wget https://julialang-s3.julialang.org/bin/linux/x64/0.6/julia-0.6.3-linux-x86_64.tar.gz
    tar -xvf julia-d55cadc350
    mv julia-d55cadc350 julia
    sudo cp -r julia /usr/local/bin
    julia

  {{< output >}}
  _
_       _ _(_)_     |  A fresh approach to technical computing
(_)     | (_) (_)    |  Documentation: https://docs.julialang.org
_ _   _| |_  __ _   |  Type "?help" for help.
| | | | | | |/ _` |  |
| | |_| | | | (_| |  |  Version 0.6.3 (2018-05-28 20:20 UTC)
_/ |\__'_|_|_|\__'_|  |  Official http://julialang.org/ release
|__/                   |  x86_64-pc-linux-gnu

julia>
{{< /output >}}

### Write your First Program

1.  In a text editor, create `example.jl` and add the following content:

    {{< file "example.jl" julia >}}
function circumference(radius::Float64)
  return 2pi * radius
end

circumference(10.0)
{{< /file >}}

    The `circumference` function specifies that it should only accept a floating point value as input (specifically a `Float64`). In addition, `pi` is a built-in variable, and you can multiply it by 2 with `2pi`, rather than `pi * 2` in Python or similar languages.

1.  There are several ways to run this example program. If the Julia binary is in your PATH, you can call it from the command line:

        julia example.jl

    {{< output >}}
62.83185307179586
{{< /output >}}

1.  From the command line, start the Julia REPL and include `example.jl`:

        julia
        include("example.jl")

1.  You can then call functions directly from within `example.jl`. This time, call `circumference` with an integer:

        circumference(10)

    {{< output >}}
ERROR: MethodError: no method matching circumference(::Int64)
Closest candidates are:
  circumference(::Float64) at /Users/jkobos/dev/julia/example.jl:2
{{< /output >}}

    This error occurs because `circumference` will only accept floating point values, and there is no version of the function available that will accept integers. You can avoid this error by allowing any number as an argument (using `radius::Real` to allow all real numbers, for example). You can also make use of multiple dispatch by declaring another function with the same name that takes integers:

    {{< file "example.jl" julia >}}
function circumference(radius::Float64)
  return 2pi * radius
end

function circumference(radius::Int64)
  return 2pi * radius
end
{{< /file >}}
