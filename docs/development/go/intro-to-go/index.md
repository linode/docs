---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'An introduction to the Go Programming Language.'
keywords: ["Go", "Golang", "functions", "loops"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-09-14
modified_by:
  name: Linode
title: 'Learning about Go functions, loops and errors.'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[Go](https://golang.org)'
---

## Introduction

[Go](https://golang.com) is a very popular open source programming language. This guide will be a quick introduction to how to execute Go code, how to create functions and how to use loops.

{{< note >}}
At the time of writing this the latest Go version is 1.13. However, the presented Go code will be able to run without any problems with future Go versions.
{{< /note >}}

## The history of Go

Go is a modern generic purpose programming language that was officially announced at the end of 2009, was begun as an internal Google project and has been inspired by many other programming languages including C, Pascal, Alef and Oberon. Its spiritual fathers are Robert Griesemer, Ken Thomson and Rob Pike who designed Go as a language for professional programmers that want to build reliable, robust and efficient software. Apart from its syntax and its standard functions, Go comes with a pretty rich standard library.

### The Advantages of Go

Although Go is not perfect, it has many advantages, including the following:

- Go is a modern programming language that was made by experienced developers for developers.
- Go code is easy to read.
- Go keeps concepts orthogonal because a few orthogonal features work better that many overlapping ones.
- The Go compiler prints practical warning and error messages that help you solve the actual problem.
- Go has support for Procedural, Concurrent and Distributed Programming.
- Go supports Garbage Collection so you do not have to deal with memory allocation and deallocation.
- Go can build Web applications and provides a simple Web server for testing purposes.
- The standard Go library offers many packages that simplify the work of the developer.
- Go uses static linking by default, which means that the produced binary files can be easily transferred to other machines with the same OS and architecture. As a consequence, once a Go program is compiled successfully and the executable file is generated, the developer does not need to worry about dependencies and library versions.
- Go code is portable, especially among UNIX machines.
- Go can be used for writing UNIX systems software.
- Go supports Unicode by default that means that you do not need any extra code for printing characters from multiple human languages or symbols.

## Executing Go code

There exist two kinds of Go programs: autonomous programs that are executable and Go libraries. Go does not care about the name of the source file of an autonomous program as long as the package name is `main` and there is a single `main()` function in it because the `main()` function is where the program execution begins. As a result, you cannot have multiple `main()` functions in the files of a single project.

### A Simple Go program

This is the Go version of the *Hello World* program:

    {{< file "./hw.go" go >}}
package main

import (
    "fmt"
)

func main() {
    fmt.Println("Hello World!")
}
{{< /file >}}

All Go code is delivered as part of Go packages – for executable programs the name of the package should be `main`. Package declarations begin with the `package` keyword. Additionally, executable programs should have a function named `main()` without any function parameters. Function definitions begin with the `func` keyword. Go packages might include `import` statements for importing Go packages. However, Go demands that you use some functionality from each one of the packages that you import. Notice that there is a way to bypass this rule but generally speaking, it is considered a good practice to not bypass that rule.

The `hw.go` file imports the `fmt` package only and uses the `fmt.Println()` function from that package. Notice that all exported package functions should begin with an uppercase letter - this is another Go rule: if you want to export something outside the current package, that should begin with an uppercase letter, even if we are talking about the fields of a Go structure or a global variable included in a Go package. Last, Go statements do not need to end with a semicolon – however, you are free to use semicolons if you want. With all the information in mind, let us try to execute `hw.go`. The `go run` command offers the simplest way to execute Go code:

    go run hw.go
{{< output >}}
Hello World!
{{< /output >}}

This is one of the two ways that you can execute Go code. The `go run` command compiles the code and creates a *temporary* executable file that is automatically executed and then it deletes that temporary executable file. This looks a lot like using a scripting programming language.

The second was is with the use of the `go build` command followed by the Go source file that you want to compile. The result of that command is a binary executable file that you have to manually execute – this is similar to the way you execute C code on a UNIX machine. The executable file is named after the Go source filename, which means that in this case the result of `go build hw.go` will be an executable file named `hw`. Go creates *statically linked executable files* that have no dependencies to external libraries. In this case, executing `hw` will create the following output:

    ./hw
{{< output >}}
Hello World!
{{< /output >}}

{{< note >}}
The `go run` command is what is usually used while experimenting and developing new Go projects. However, if you need to transfer an executable file to another system with the same architecture, you have to use `go build` first.
{{< /note >}}

### How to format Curly Braces in Go

The following version of the "Hello World" program will not compile:

    {{< file "./curly.go" go >}}
package main

import (
    "fmt"
)

func main()
{
    fmt.Println("Hello World!")
}
{{< /file >}}

If you try to execute it, you will get the following error message from the Go compiler:

    go run curly.go
{{< output >}}
# command-line-arguments
./curly.go:7:6: missing function body
./curly.go:8:1: syntax error: unexpected semicolon or newline before {
{{< /output >}}

The official explanation for this error message is that Go requires the use of semicolons as statement terminators in many contexts and the compiler automatically inserts the required semicolons when it thinks that they are necessary. Putting the opening curly brace (`{`) in its own line makes the Go compiler to insert a semicolon at the end of the previous line (`func main()`), which is the cause of the error message.

The point is that there is only one way to format curly braces in Go! Additionally, you should use curly braces even if a code block such as the body of a `for` loop contains a single Go statement – this is not illustrated in `curly.go` but is another Go rule.

## About := and =

Go supports the `:=` and `=` operators. However, they are used in different situations. `:=` is part of the *short variable declarations clause*. With `:=` you can declare a variable and assign a value to it at the same time. The type of the variable is inferred from the given value.

`=` is the assign operator. You can use `=` in two cases. First, to assign a new value to an existing variable and second, to declare a new variable, provided that you also type its type like `var aVariable int = 10`, which is equivalent to `aVariable := 10`.

Notice that when you specifically want to control the type of a variable, it is safer to use `var` and `=` instead of just `:=`.

## Loops in Go

The Go code of `loops.go` demonstrates loops in Go:

    {{< file "./loops.go" go >}}
package main

import (
    "fmt"
)

func main() {
    for i := 0; i < 20; i++ {
        if i%10 == 0 {
            continue
        }

        if i == 19 {
            break
        }
        fmt.Print(i, " ")
    }
    fmt.Println()

    # Using break for exiting the for loop
    i := 10
    for {
        if i < 0 {
            break
        }
        fmt.Print(i, " ")
        i--
    }
    fmt.Println()

    # This is similar to a while(true) do something loop
    i = 0
    anExpression := true
    for ok := true; ok; ok = anExpression {
        if i > 10 {
            anExpression = false
        }

        fmt.Print(i, " ")
        i++
    }
    fmt.Println()

    anArray := [5]int{0, 1, -1, 2, -2}
    for i, value := range anArray {
        fmt.Println("index:", i, "value: ", value)
    }
}
{{< /file >}}

There exist two types of loops in Go: loops that use `for` and loops that iterate over the elements of a Go data type such as an array or a map using the `range` keyword. Go has no direct support for `while` loops. However, if you want to use a `while` loop, you will have to emulate it with a `for` loop.

In their simplest form, `for` loops allow you to iterate a predefined number of times, for as long as a condition is valid, or according to a value that is calculated at the beginning of the `for` loop. Such values include the size of a slice or an array, or the number of keys on a map. However, `range` is much more popular in accessing all the elements of a slice, an array or a map. The main advantage of the `range` keyword is that you do not need to know the cardinality of a slice, a map, or a channel in advance in order to process its elements one by one. 

You can completely exit a `for` loop using the `break` keyword. The `break` keyword also allows you to create a `for` loop without an exit condition because the exit condition can be included in the code block of the `for` loop. You are also allowed to have multiple exit conditions in a `for` loop. Additionally, you can skip a single iteration of a for loop using the `continue` keyword.

Executing `loops.go` will generate the following output:

    go run loops.go
{{< output >}}
1 2 3 4 5 6 7 8 9 11 12 13 14 15 16 17 18
10 9 8 7 6 5 4 3 2 1 0
0 1 2 3 4 5 6 7 8 9 10 11
index: 0 value:  0
index: 1 value:  1
index: 2 value:  -1
index: 3 value:  2
index: 4 value:  -2
{{< /output >}}

## Functions in Go

Functions are first class citizens in Go, which means that functions can even be parameters to other functions or returned by functions. This section will illustrate various types of functions.

Go also supports *anonymous functions*, which can be defined inline without the need for a name and they are usually used for implementing things that require a small amount of code. In Go, a function can return an anonymous function or take an anonymous function as one of its arguments. Additionally, anonymous functions can be attached to Go variables. Note that anonymous functions are also called *closures*, especially in functional programming terminology. It is considered a good practice for anonymous functions to have a small implementation and a local focus. 

### Regular functions

This section will present the implementation of some traditional functions.

    {{< file "./functions.go" go >}}
package main

import (
    "fmt"
)

func doubleSquare(x int) (int, int) {
    return x * 2, x * x
}

func namedMinMax(x, y int) (min, max int) {
    if x > y {
        min = y
        max = x
    } else {
        min = x
        max = y
    }
    return
}

func minMax(x, y int) (min, max int) {
    if x > y {
        min = y
        max = x
    } else {
        min = x
        max = y
    }
    return min, max
}

func main() {
    y := 10

    square := func(s int) int {
        return s * s
    }
    fmt.Println("The square of", y, "is", square(y))

    double := func(s int) int {
        return s + s
    }
    fmt.Println("The double of", y, "is", double(y))

    fmt.Println(doubleSquare(y))
    d, s := doubleSquare(y)
    fmt.Println(d, s)

    a1 := -10
    a2 := -1
    fmt.Println(minMax(a1, a2))
    min, max := minMax(a1, a2)
    fmt.Println(min, max)
    fmt.Println(namedMinMax(a1, a2))
    min, max = namedMinMax(a1, a2)
    fmt.Println(min, max)
}
{{< /file >}}

The `main()` function takes no arguments and returns no arguments - once the special function `main()` exits, the program automatically ends. The `doubleSquare()` function requires a single `int` parameter and returns two `int` values, which is defined as `(int, int)`. Notice that all function arguments must have a name – variadic functions are the only exception to this rule. If a function returns a single value you do not need to put parenthesis around its type.

The `namedMinMax()` function uses named return parameters. There is a tricky point here: the `namedMinMax()` function does not need to explicitly return any variables or values in its `return` statement at the end. Nevertheless, as this function has named return values in its signature, the `min` and `max` parameters are **automatically returned** in the order in which they were put in the function definition. The `minMax()` function has the same functionality as `namedMinMax()` but it explicitly returns its values.

Each one of the `square` and `double` variables in `main()` holds an *anonymous function*. The bad part is that you are allowed to change the value of `square`, `double`, or any other variable that holds an anonymous function, afterwards, which means that both variables may calculate something else instead in the future.

The output of `functions.go` will resemble the following:

    go run functions.go
{{< output >}}
The square of 10 is 100
The double of 10 is 20
20 100
20 100
-10 -1
-10 -1
-10 -1
-10 -1
{{< /output >}}

### Variadic functions

*Variadic functions* are functions that accept a variable number of arguments – the most popular variadic functions in Go can be found in the `fmt` package. The code of `variadic.go` illustrates the creation and the use of variadic functions.

    {{< file "./variadic.go" go >}}
package main

import (
    "fmt"
)

func varFunc(input ...string) {
    fmt.Println(input)
}

func oneByOne(message string, s ...int) int {
    fmt.Println(message)
    sum := 0
    for i, a := range s {
        fmt.Print(i, a, "\t")
        sum = sum + a
    }
    fmt.Println()
    s[0] = -1000
    return sum
}

func main() {
    many := []string{"12", "3", "b"}
    varFunc(many...)
    sum := oneByOne("Adding numbers...", 1, 2, 3, 4, 5, -1, 10)
    fmt.Println("Sum:", sum)
    s := []int{1, 2, 3}
    sum = oneByOne("Adding numbers...", s...)
    fmt.Println(s)
}
{{< /file >}}

The `...` operator used as `...Type` is called the *pack operator* whereas the *unpack operator* ends with `...` and begins with a slice. Each variadic function cannot use the pack operator more than once. The `oneByOne()` function accepts a single `string` and a variable number of integer arguments using the `s` slice. The `varFunc` function accepts a single argument and just calls the `fmt.Println()` function.

Please notice that as the second call to `oneByOne()` is using a slice, any changes you make to that slice inside the variadic function will persist after the function exits because this is how slices work in Go.

The output of `variadic.go` will be similar to the following:

    go run variadic.go
{{< output >}}
[12 3 b]
Adding numbers...
0 1 1 2 2 3 3 4 4 5 5 -1    6 10
Sum: 24
Adding numbers...
0 1 1 2 2 3
[-1000 2 3]
{{< /output >}}

### Functions and pointer variables

Go supports *pointers* and this section will briefly present how functions can work with pointers. Another Go guide will talk about pointers in more detail.

    {{< file "./fPointers.go" go >}}
package main

import (
    "fmt"
)

func getPtr(v *float64) float64 {
    return *v * *v
}

func returnPtr(x int) *int {
    y := x * x
    return &y
}

func main() {
    x := -12.12
    fmt.Println(getPtr(&x))
    x = -12
    fmt.Println(getPtr(&x))

    sq := returnPtr(10)
    fmt.Println("sq value:", *sq)
    fmt.Println("sq memory address:", sq)
}
{{< /file >}}

The `getPtr()` function takes a pointer argument to a `float64`, which is defined as `v *float64`, whereas `returnPtr()` returns a pointer to an `int`, which is declared as `*int`. The next Go guide will shed some light on pointers in Go.

The output of `fPointers.go` will resemble the following:

    go run fPointers.go
{{< output >}}
146.8944
144
sq value: 100
sq memory address: 0xc00001a0b8
{{< /output >}}

### Functions having functions as parameters

Go functions can have functions as parameters.

    {{< file "./fArgF.go" go >}}
package main

import "fmt"

func f1(i int) int {
    return i + i
}

func f2(i int) int {
    return i * i
}

func funFun(f func(int) int, v int) int {
    return f(v)
}

func main() {
    fmt.Println("function1:", funFun(f1, 12))
    fmt.Println("function2:", funFun(f2, 12))
    fmt.Println("Inline", funFun(func(i int) int { return i * i * i }, 12))
}
{{< /file >}}

The `funFun()` function accepts two parameters, a function parameter named `f` and an `int` value. The `f` parameter should be a function that takes one `int` argument and returns an `int` value.

The first `fmt.Println()` call in `main()` uses `funFun()` with `f1()` without any parentheses as its first parameter, whereas the second `fmt.Println()` call uses `funFun()` with `f2` as its first parameter. In the last `fmt.Println()` statement the implementation of the function parameter is defined inside the call to `funFun()` using an anonymous function.

Executing `fArgF.go` will generate the following output:

    go run fArgF.go
{{< output >}}
function1: 24
function2: 144
Inline 1728
{{< /output >}}

### Functions returning functions

Go functions are allowed to return other functions!

    {{< file "./fRetF.go" go >}}
package main

import (
    "fmt"
)

func f() func() int {
    i := 0
    return func() int {
        i++
        return i * i
    }
}

func main() {
    i := f()
    j := f()

    fmt.Println("1:", i())
    fmt.Println("2:", i())
    fmt.Println("j1:", j())
    fmt.Println("3:", i())
}
{{< /file >}}

So, `f()` returns an anonymous function with the `func() int` signature. As `f()` is called two times, you will need to use two separate variables to keep the two return values of `f()`.

Executing `fRetF.go` will generate the following output:

    go run fRetF.go
{{< output >}}
1: 1
2: 4
j1: 1
3: 9
{{< /output >}}

Notice that the values of `i()` and `j()` are not connected even though they both came from `f()`.

## Errors in Go

*Errors* and *error handling* are two very important topics in Go. Go likes error messages so much that it has a separate data type for errors, named `error`. This also means that you can easily create your own error messages if you find that what Go gives you is not adequate. You will most likely need to create and handle your own errors when you are developing your own Go packages.

Please note that having an error condition is one thing while deciding how to react to an error condition is a totally different thing. Therefore, some error conditions might require that you immediately stop the execution of the program whereas in other error situations you might just print a warning message and continue.

    {{< file "./errors.go" go >}}
package main

import (
    "errors"
    "fmt"
    "strconv"
)

func main() {

    customError := errors.New("My Custom Error!")
    if customError.Error() == "My Custom Error!" {
        fmt.Println("!!")
    }

    a := "123"
    b := "43W"
    _, err := strconv.Atoi(a)
    if err != nil {
        fmt.Println(err)
        return
    }

    _, err = strconv.Atoi(b)
    if err != nil {
        fmt.Println(err)
        return
    }
}
{{< /file >}}

The `strconv.Atoi()` function tries to convert a string to an integer, provided that the string is a valid integer and returns two things, an integer value and an `error` variable. If the `error` variable is `nil`, then the conversion was successful and you get a valid integer. The `_` character tells Go to ignore one, as in this case, or more of the return values of a function.

Most of the times, you need to check whether an error variable is equal to `nil` or not and then act accordingly – this kind of Go code is very popular in Go programs and you will see it and use it multiple times. What is also presented here is the use `errors.New()` function that allows you to create a custom error message and the use of `errors.Error()` that allows you to convert an `error` variable into a `string` variable.

Executing `errors.go` will resemble the following output:

    go run errors.go
{{< output >}}
!!
strconv.Atoi: parsing "43W": invalid syntax
{{< /output >}}

## Summary

The next Go guide will talk about the standard Go library, working with command line arguments and the basic Go data types.
