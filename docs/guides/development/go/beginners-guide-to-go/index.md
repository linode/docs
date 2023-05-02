---
slug: beginners-guide-to-go
description: 'This guide will introduce you to the Go programming language and will also instruct you on how you can create and run your first program and more.'
keywords: ['golang','go','command line arguments']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-02-11
modified_by:
  name: Linode
image: GettingStartedwithGo.png
title: "Getting Started with Go"
title_meta: "A Beginner's Guide to Go"
external_resources:
- '[The Go Programming Language Specification](https://golang.org/ref/spec)'
- '[Go](https://golang.org)'
- '[Effective Go](https://golang.org/doc/effective_go.html)'
- '[A Tour of Go](https://tour.golang.org/welcome/1)'
aliases: ['/development/go/beginners-guide-to-go/']
authors: ["Mihalis Tsoukalos"]
---

## Introduction

[Go](https://golang.com) is a modern, open source, and general-purpose programming language that began as an internal Google project and was officially announced at the end of 2009. Go was inspired by many other programming languages including C, Pascal, Alef, and Oberon. Its spiritual fathers were Robert Griesemer, Ken Thomson, and Rob Pike, who all designed Go as a language for professional programmers that want to build reliable, robust, and efficient software. Apart from its syntax and its standard functions, Go comes with a [rich standard library](#the-standard-go-library).

In this guide you'll learn how to:

- [Execute your first go program](#executing-go-code)
- Learn the syntax for [how variables are declared](#variable-declarations)
- See an example of [how to work with command line arguments](#working-with-command-line-arguments) by using the `os` package

### The Advantages of Go

Although Go is not perfect, it has many advantages, including the following:

- It is a modern programming language that was made by experienced developers for developers.
- The code is easy to read.
- Go keeps concepts orthogonal, or simple, because a few orthogonal features work better than many overlapping ones.
- The compiler prints practical warnings and error messages that help you solve the actual problem.
- It has support for [procedural](https://en.wikipedia.org/wiki/Procedural_programming), [concurrent](https://en.wikipedia.org/wiki/Concurrent_computing), and [distributed programming](https://en.wikipedia.org/wiki/Distributed_computing).
- Go supports [garbage collection](https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)) so you do not have to deal with memory allocation and deallocation.
- Go can be used to build web applications and it provides a simple web server for testing purposes.
- The standard Go library offers many packages that simplify the work of the developer.
- It uses static linking by default, which means that the produced binary files can be easily transferred to other machines with the same OS and architecture. As a consequence, once a Go program is compiled successfully and the executable file is generated, the developer does not need to worry about dependencies and library versions.
- The code is portable, especially among UNIX machines.
- Go can be used for writing UNIX systems software.
- It supports Unicode by default, which means that you do not need any extra code for printing characters from multiple human languages or symbols.

## Before You Begin

{{< content "before-you-begin-install-go-shortguide" >}}

{{< note respectIndent=false >}}
This guide was written with Go version 1.13.
{{< /note >}}

## Executing Go Code

There are two kinds of Go programs: autonomous programs that are executable, and Go libraries. This section will describe how to format and run autonomous programs.

### A Simple Go Program

This is the Go version of the *Hello World* program:

{{< file "helloworld.go" go >}}
package main

import (
    "fmt"
)

func main() {
    fmt.Println("Hello World!")
}
{{< /file >}}

* All Go code is delivered within Go packages. For executable programs, the package name should be `main`. Package declarations begin with the `package` keyword.

* Executable programs should have a function named `main()` without any function parameters. You cannot have multiple `main()` functions in the files of a single project. Function definitions begin with the `func` keyword.

    {{< note respectIndent=false >}}
For more information on how functions in Go are formatted and used, review our [Go Functions, Loops, and Errors](/docs/guides/learning-go-functions-loops-and-errors-a-tutorial/) tutorial.
{{< /note >}}

* Go packages might include `import` statements for importing other Go packages. However, Go demands that you use some functionality from each one of the packages that you import. There is a way to bypass this rule, however, it is considered a bad practice to do this.

    The `helloworld.go` file above imports the `fmt` package and uses the `fmt.Println()` function from that package.

    {{< note respectIndent=false >}}
All exported package functions begin with an uppercase letter. This follows the Go rule: if you export something outside the current package, it should begin with an uppercase letter. This rule applies even if the field of the Go structure or the global variable is included in a Go package.

For example, if the print function used in the above example was instead named `println()`, it would not be accessible to this program.
{{< /note >}}

* Go statements do not *need* to end with a semicolon, as the Go compiler will automatically insert semicolons where they are expected. You are free to use semicolons if you wish. For example, if you want to put two separate statements on a single line, a semicolon is needed between them.

* Go has specific rules for [how opening curly braces are formatted](#formatting-curly-braces).

### Running the Program

1. Now that you better understand the `helloworld.go` program, execute it with the `go run` command:

        go run helloworld.go

    You will see the following output:
{{< output >}}
Hello World!
{{< /output >}}

    This is the simplest of two ways that you can execute Go code. The `go run` command compiles the code and creates a temporary executable file that is automatically executed, and then it deletes that temporary executable file. This is similar to using a scripting programming language.

1. The second method to execute Go code is to use the `build` command. Run the following command to use this method:

        go build helloworld.go

    The result of that command is a binary executable file that you have to manually execute. This method is similar to the way you execute C code on a UNIX machine. The executable file is named after the Go source filename, which means that in this case the result will be an executable file named `helloworld`. Go creates *statically linked executable files* that have no dependencies to external libraries.

1. Execute the `helloworld` file:

        ./helloworld

    You will see the following output:
{{< output >}}
Hello World!
{{< /output >}}

    {{< note respectIndent=false >}}
The `go run` command is usually used while experimenting and developing new Go projects. However, if you need to transfer an executable file to another system with the same architecture, you should use `go build`.
    {{< /note >}}

### Formatting Curly Braces

The following version of the "Hello World" program will not compile:

{{< file "curly.go" go >}}
package main

import (
    "fmt"
)

func main()
{
    fmt.Println("Hello World!")
}
{{< /file >}}

If you execute the program above, the following error message is generated by the compiler:

    go run curly.go

{{< output >}}
# command-line-arguments
./curly.go:7:6: missing function body
./curly.go:8:1: syntax error: unexpected semicolon or newline before {
{{< /output >}}

* This error message is generated because Go requires the use of semicolons as statement terminators in many contexts, and the compiler automatically inserts the required semicolons when it thinks that they are necessary. Putting the opening curly brace (`{`) on its own line makes the Go compiler look for a semicolon at the end of the previous line (`func main()`), which is the cause of the error message.

* There is only one way to format curly braces in Go: **the opening curly brace must not appear on its own line**. Additionally, you must use curly braces even if a code block contains a single Go statement, like in the body of a `for` loop. You can see an example of this in the [first version of the `helloworld.go`](#a-simple-go-program) program.

## Variable Declarations

Go supports assignment (`=`) operators and short variable declarations (`:=`), demonstrated in this example:

{{< file "variables.go" go >}}
package main

import (
    "fmt"
)

func main() {
    myFirstVariable := 10
    myFirstVariable = 5
    var mySecondVariable int = 10

    fmt.Println(myFirstVariable)
    fmt.Println(mySecondVariable)
}
{{< /file >}}

* With `:=` you can declare a variable and assign a value to it at the same time, without also listing the type of the variable. The type of the variable is *inferred* from the given value.

* You can use `=` in two cases:

    - To assign a new value to an existing variable

    - To declare a new variable, provided that you also specify its type.

    For example, `myFirstVariable := 10` and `var mySecondVariable int = 10` will both create variables of type `int` with the value `10`.

* When you specifically want to control a variable's type, it is safer to declare the variable and its type using `var` and then assign a value to it using `=`.

### Naming Conventions

The common naming convention for variables in Go is [camel case](https://en.wikipedia.org/wiki/Camel_case) (though it is not required by the compiler), e.g.: `myVariableName`.

Every variable whose name begins with a capital letter is exported from the package that it belongs to, e.g.: `MyExportedVariableName`. This style is enforced by the compiler.

### Uninitialized Variables

Variables that are declared and not assigned a value will have the *zero value* for its type. For example, this program shows that the zero value for an int is `0`:

{{< file "uninitialized.go" go >}}
package main

import (
    "fmt"
)

func main() {
    var aVariable int
    fmt.Println(aVariable)
}
{{< /file >}}

The output from this program is:

    go run uninitialized.go

{{< output >}}
0
{{< /output >}}

{{< note respectIndent=false >}}
The zero value for a string variable is an empty string.
{{< /note >}}

### Value Semantics

If a new variable is declared by assigning another variable to it, then the new variable will be a copy of the first variable. This means that changing the value of either of these variables will not affect the other, as illustrated in this example:

{{< file "values.go" go >}}
package main

import (
    "fmt"
)

func main() {
    myFirstVariable := 10
    mySecondVariable := myFirstVariable
    myFirstVariable = 5
    fmt.Println(myFirstVariable)
    fmt.Println(mySecondVariable)
}
{{< /file >}}

The output from this program is:

    go run values.go

{{< output >}}
5
10
{{< /output >}}

If you want to manipulate the value of an existing variable, you can use [pointers](https://tour.golang.org/moretypes/1) instead.

## Working with Command Line Arguments

This section will illustrate how you can work with command line arguments in Go. The presented program finds out the minimum and the maximum integer of the given command line arguments.

{{< file "cla.go" go >}}
package main

import (
    "fmt"
    "os"
    "strconv"
)

func main() {
    if len(os.Args) == 1 {
        fmt.Println("Please give one or more integers.")
        return
    }

    var min, max int

    arguments := os.Args
    temp, err := strconv.Atoi(arguments[1])
    if err != nil {
        fmt.Println("Error encountered, exiting:")
        fmt.Println(err)
        return
    } else {
        min = temp
        max = temp
    }

    for i := 2; i < len(arguments); i++ {
        n, err := strconv.Atoi(arguments[i])
        if err != nil {
            fmt.Println("Error encountered, exiting:")
            fmt.Println(err)
            return
        }

        if n < min {
            min = n
        }
        if n > max {
            max = n
        }
    }

    fmt.Println("Min:", min)
    fmt.Println("Max:", max)
}
{{< /file >}}

If you need to work with the command line arguments of a Go program you will need to import the `os` package. All command line arguments are kept in the `os.Args` slice, which you will have to process on your own. As it also happens with C, the first element of `os.Args` is the name of the executable, which in this case should not be processed. The `len()` function, used on line 10, returns the length of a slice or an array.

If the first command line argument of the program is a valid integer, then both `min` and `max` are initialized to its value in lines 18-26. Otherwise, the script will exit. Afterwards, the script iterates through any remaining arguments in lines 28-42. This loop compares the remaining arguments' values to the previous values found and updates `min` and `max` accordingly.

The output of `cla.go` will resemble the following:

    go run cla.go -1 2 3

{{< output >}}
Min: -1
Max: 3
{{< /output >}}

## Next Steps

The next guide in our Go language series is our [Go Functions, Loops, and Errors](/docs/guides/learning-go-functions-loops-and-errors-a-tutorial/) tutorial. More advanced guides are listed in the [Go section index](/docs/development/go/).

### The Standard Go Library

In addition to reading through our guides, you might also want to review Go's rich, well-tested and handy standard library. The list of the most important Go packages includes the following:

| Package name | Description |
|--------------|-------------|
| `io` | Used for performing primitive I/O operations. |
| `bufio` | Used for executing buffered I/O. |
| `os` | The package offers a **platform-independent** interface to OS functionality. |
| `os/signal` | Used for working with OS signals. |
| `net` | The package provides a portable interface for network I/O. |
| `net/http` | The package offers HTTP client and server implementations. |
| `errors` | Used for manipulating errors. |
| `flag` | Used for working with command line arguments and flags. |
| `log` | Used for logging. |
| `log/syslog` | Used for communicating with the system log service. |
| `math` | Provides mathematical constants and functions. |
| `strconv` | Used for converting strings to other basic Go data types and vice versa. |
| `strings` | Used for manipulating Unicode strings. |
| `sync` | This package offers basic synchronization primitives. Mainly used in concurrent programming. |
| `testing` | Used for creating automated testing of Go packages. |
| `time` | This package offers functions for working with time. |

You can find the full list of the packages of the Go standard library [here](https://golang.org/pkg/).
