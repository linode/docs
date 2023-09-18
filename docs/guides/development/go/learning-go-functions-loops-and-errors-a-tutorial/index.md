---
slug: learning-go-functions-loops-and-errors-a-tutorial
description: 'Learn how to use loops, how to create functions, and how to handle errors in the Go language.'
keywords: ["Go", "Golang", "functions", "loops"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-13
modified_by:
  name: Linode
title: 'A Tutorial for Learning Go Functions, Loops, and Errors'
title_meta: 'Learning Go Functions, Loops, and Errors - A Tutorial'
external_resources:
  - '[Go](https://golang.org)'
  - '[Effective Go](https://golang.org/doc/effective_go.html)'
  - '[A Tour of Go](https://tour.golang.org/welcome/1)'
aliases: ['/development/go/learning-go-functions-loops-and-errors-a-tutorial/']
authors: ["Mihalis Tsoukalos"]
---

After you've learned the syntax of a simple "Hello World" script in Go, you'll likely want to start making more complicated programs. This guide will introduce language constructs that help with structuring your programs, including:

- How to [use loops](#loops-in-go)
- How to [create functions](#functions-in-go)
- How to [handle errors](#errors-in-go)

## Before You Begin

If you're just starting with Go, we recommend reading our [Beginner's Guide to Go](/docs/guides/beginners-guide-to-go/) guide first.

{{< content "before-you-begin-install-go-shortguide" >}}

{{< note respectIndent=false >}}
This guide was written with Go version 1.13.
{{< /note >}}

## Loops in Go

The file `loops.go` demonstrates loops in Go:

{{< file "./loops.go" go >}}
package main

import (
    "fmt"
)

func main() {
    for loopIndex := 0; loopIndex < 20; loopIndex++ {
        if loopIndex%10 == 0 {
            continue
        }

        if loopIndex == 19 {
            break
        }
        fmt.Print(loopIndex, " ")
    }
    fmt.Println()

    // Use break to exit the for loop
    loopIndex := 10
    for {
        if loopIndex < 0 {
            break
        }
        fmt.Print(loopIndex, " ")
        loopIndex--
    }
    fmt.Println()

    // This is similar to a while(true) do something loop
    loopIndex = 0
    anExpression := true
    for ok := true; ok; ok = anExpression {
        if loopIndex > 10 {
            anExpression = false
        }

        fmt.Print(loopIndex, " ")
        loopIndex++
    }
    fmt.Println()

    anArray := [5]int{0, 1, -1, 2, -2}
    for loopIndex, value := range anArray {
        fmt.Println("index:", loopIndex, "value: ", value)
    }
}
{{< /file >}}

* There are two types of `for` loops in Go. Traditional `for` loops that use a control variable initialization, condition, and afterthought; and those that iterate over the elements of a Go data type such as an [array](https://golang.org/doc/effective_go.html#arrays) or a [map](https://golang.org/doc/effective_go.html#maps) using the `range` keyword.

* Go has no direct support for `while` loops. If you want to use a `while` loop, you can emulate it with a `for` loop.

* In their simplest form, `for` loops allow you to iterate, a predefined number of times, for as long as a condition is valid, or according to a value that is calculated at the beginning of the `for` loop. Such values include the size of a [slice](https://blog.golang.org/go-slices-usage-and-internals) or an array, or the number of keys on a map. However, `range` is more often used for accessing all the elements of a slice, an array, or a map because you do not need to know the object's cardinality in order to process its elements one by one. For simplicity, this example uses an array, and a later example will use a slice.

* You can completely exit a `for` loop using the `break` keyword. The `break` keyword also allows you to create a `for` loop without an exit condition because the exit condition can be included in the code block of the `for` loop. You are also allowed to have multiple exit conditions in a `for` loop.

* You can skip a single iteration of a for loop using the `continue` keyword.

1. Execute the `loops.go` program:

        go run loops.go

    You will see the following output:

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

Functions are first class citizens in Go, which means that functions can be parameters to other functions as well as returned by functions. This section will illustrate various types of functions.

Go also supports *anonymous functions*. These can be defined inline without the need for a name and they are usually used for implementing operations that require a small amount of code. In Go, a function can return an anonymous function or take an anonymous function as one of its arguments. Additionally, anonymous functions can be attached to Go variables. In functional programming terminology anonymous functions are  called *closures*. It is considered a good practice for anonymous functions to have a small implementation and a local focus.

### Regular functions

This section will present the implementation of some traditional functions.

{{< file "./functions.go" go >}}
package main

import (
    "fmt"
)

func doubleSquare(firstNum int) (int, int) {
    return firstNum * 2, firstNum * firstNum
}

func namedMinMax(firstNum, secondNum int) (min, max int) {
    if firstNum > secondNum {
        min = secondNum
        max = firstNum
    } else {
        min = firstNum
        max = secondNum
    }
    return
}

func minMax(firstNum, secondNum int) (min, max int) {
    if firstNum > secondNum {
        min = secondNum
        max = firstNum
    } else {
        min = firstNum
        max = secondNum
    }
    return min, max
}

func main() {
    secondNum := 10

    square := func(numberToSquare int) int {
        return numberToSquare * numberToSquare
    }
    fmt.Println("The square of", secondNum, "is", square(secondNum))

    double := func(numberToDouble int) int {
        return numberToDouble + numberToDouble
    }
    fmt.Println("The double of", secondNum, "is", double(secondNum))

    fmt.Println(doubleSquare(secondNum))
    doubledNumber, squaredNumber := doubleSquare(secondNum)
    fmt.Println(doubledNumber, squaredNumber)

    value1 := -10
    value2 := -1
    fmt.Println(minMax(value1, value2))
    min, max := minMax(value1, value2)
    fmt.Println(min, max)
    fmt.Println(namedMinMax(value1, value2))
    min, max = namedMinMax(value1, value2)
    fmt.Println(min, max)
}
{{< /file >}}

* The `main()` function takes no arguments and returns no arguments. Once the special function `main()` exits, the program automatically ends.

* The `doubleSquare()` function requires a single `int` parameter and returns two `int` values, which is defined as `(int, int)`.

* All function arguments must have a name – [variadic functions](#variadic-functions) are the only exception to this rule.

* If a function returns a single value, you do not need to put parenthesis around its type.

* Because `namedMinMax()` has named return values in its signature, the `min` and `max` parameters are **automatically returned** in the order in which they were put in the function definition. Therefore, the function does not need to explicitly return any variables or values in its return statement at the end, and does not. `minMax()` function has the same functionality as `namedMinMax()` but it explicitly returns its values demonstrating that both ways are valid.

* Both `square` and `double` variables in `main()` are assigned an *anonymous function*. However, nothing stops you from changing the value of `square`, `double`, or any other variable that holds the result of an anonymous function, afterwards. This means that both variables may have a different value in the future.

1. Execute the `functions.go` program.

        go run functions.go

    Your output will resemble the following:

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

*Variadic functions* are functions that accept a variable number of arguments. The most popular variadic functions in Go can be found in the `fmt` package. The code of `variadic.go` illustrates the creation and the use of variadic functions.

{{< file "./variadic.go" go >}}
package main

import (
    "fmt"
)

func varFunc(input ...string) {
    fmt.Println(input)
}

func oneByOne(message string, sliceOfNumbers ...int) int {
    fmt.Println(message)
    sum := 0
    for indexInSlice, sliceElement := range sliceOfNumbers {
        fmt.Print(indexInSlice, sliceElement, "\t")
        sum = sum + sliceElement
    }
    fmt.Println()
    sliceOfNumbers[0] = -1000
    return sum
}

func main() {
    many := []string{"12", "3", "b"}
    varFunc(many...)
    sum := oneByOne("Adding numbers...", 1, 2, 3, 4, 5, -1, 10)
    fmt.Println("Sum:", sum)
    sliceOfNumbers := []int{1, 2, 3}
    sum = oneByOne("Adding numbers...", sliceOfNumbers...)
    fmt.Println(sliceOfNumbers)
}
{{< /file >}}


* The `...` operator used as a prefix to a type like `...int` is called the *pack operator*, whereas the *unpack operator* appends a *slice* like `sliceOfNumbers...`. A slice is a Go data type that is essentially an abstraction of an array of unspecified length.

* Each variadic function can use the pack operator once. The `oneByOne()` function accepts a single `string` and a variable number of integer arguments using the `sliceOfNumbers` slice.

* The `varFunc` function accepts a single argument and just calls the `fmt.Println()` function.

* Another note about slices: the second call to `oneByOne()` is using a slice. Any changes you make to that slice inside the variadic function will persist after the function exits because this is how slices work in Go.

1. Execute the `variadic.go` program:

        go run variadic.go

    The output will resemble the following

    {{< output >}}
[12 3 b]
Adding numbers...
0 1     1 2     2 3     3 4     4 5     5 -1     6 10
Sum: 24
Adding numbers...
0 1     1 2     2 3
[-1000 2 3]
    {{< /output >}}

### Functions and pointer variables

Go supports *pointers* and this section will briefly present how functions can work with [pointers](https://golang.org/doc/effective_go.html#pointers_vs_values). A future Go guide will talk about pointers in more detail, but here is a brief overview.

{{< file "./fPointers.go" go >}}
package main

import (
    "fmt"
)

func getPointer(varToPointer *float64) float64 {
    return *varToPointer * *varToPointer
}

func returnPointer(testValue int) *int {
    squareTheTestValue := testValue * testValue
    return &squareTheTestValue
}

func main() {
    testValue := -12.12
    fmt.Println(getPointer(&testValue))
    testValue = -12
    fmt.Println(getPointer(&testValue))

    theSquare := returnPointer(10)
    fmt.Println("sq value:", *theSquare)
    fmt.Println("sq memory address:", theSquare)
}
{{< /file >}}

* The `getPointer()` function takes a pointer argument to a `float64`, which is defined as `varToPointer *float64`, where `returnPointer()` returns a pointer to an `int`, which is declared as `*int`.

1. Execute the `fPointers.go` program:

        go run fPointers.go

    The output will resemble the following:

    {{< output >}}
146.8944
144
sq value: 100
sq memory address: 0xc00001a0b8
    {{< /output >}}

### Functions with Functions as Parameters

Go functions can have functions as parameters.

{{< file "./fArgF.go" go >}}
package main

import "fmt"

func doubleIt(numToDouble int) int {
    return numToDouble + numToDouble
}

func squareIt(numToSquare int) int {
    return numToSquare * numToSquare
}

func funFun(functionName func(int) int, variableName int) int {
    return functionName(variableName)
}

func main() {
    fmt.Println("funFun Double:", funFun(doubleIt, 12))
    fmt.Println("funFun Square:", funFun(squareIt, 12))
    fmt.Println("Inline", funFun(func(numToCube int) int { return numToCube * numToCube * numToCube }, 12))
}
{{< /file >}}

* The `funFun()` function accepts two parameters, a function parameter named `functionName` and an `int` value. The `functionName` parameter should be a function that takes one `int` argument and returns an `int` value.

* The first `fmt.Println()` call in `main()` uses `funFun()` and passes the `doubleIt` function, without any parentheses, as its first parameter.

* The second `fmt.Println()` call uses `funFun()` with `squareIt` as its first parameter.

* In the last `fmt.Println()` statement the implementation of the function parameter is defined inside the call to `funFun()` using an anonymous function.

1. Execute the `fArgF.go` program:

        go run fArgF.go

    The output will resemble the following:

    {{< output >}}
function1: 24
function2: 144
Inline 1728
    {{< /output >}}

### Functions Returning Functions

Go functions can return functions.

{{< file "./fRetF.go" go >}}
package main

import (
    "fmt"
)

func squareFunction() func() int {
    numToSquare := 0
    return func() int {
        numToSquare++
        return numToSquare * numToSquare
    }
}

func main() {
    square1 := squareFunction()
    square2 := squareFunction()

    fmt.Println("First Call to square1:", square1())
    fmt.Println("Second Call to square1:", square1())
    fmt.Println("First Call to square2:", square2())
    fmt.Println("Third Call to square1:", square1())
}
{{< /file >}}

* `squareFunction()` returns an anonymous function with the `func() int` signature.

* As `squareFunction()` is called two times, you will need to use two separate variables, `square1` and `square2` to keep the two return values.

1. Execute the `fRetF.go` program:

        go run fRetF.go

    Your output will resemble the following:

    {{< output >}}
First Call to square1: 1
Second Call to square1: 4
First Call to square2: 1
Third Call to square1: 9
    {{< /output >}}

    Notice that the values of `square1` and `square2` are not connected even though they both came from `squareFunction()`.

## Errors in Go

*Errors* and *error handling* are two important topics in Go. Go puts so much importance on error messages that it has a dedicated data type for errors, aptly named `error`. This also means that you can easily create your own error messages if you find that what Go gives you is not adequate. You will most likely need to create and handle your own errors when you are developing your own Go packages.

Recognizing an error condition is one task, while deciding how to react to an error condition is another task. Therefore, some error conditions might require that you immediately stop the execution of the program, whereas in other error situations, you might just print a warning message and continue.

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

    stringToConvert1 := "123"
    stringToConvert2 := "43W"
    _, err := strconv.Atoi(stringToConvert1)
    if err != nil {
        fmt.Println(err)
        return
    }

    _, err = strconv.Atoi(stringToConvert2)
    if err != nil {
        fmt.Println(err)
        return
    }
}
{{< /file >}}

* The `strconv.Atoi()` function tries to convert a string into an integer, provided that the string is a valid integer, and returns two things, an integer value and an `error` variable. If the `error` variable is `nil`, then the conversion was successful and you get a valid integer. The `_` character tells Go to ignore one, as in this case, or more of the return values of a function.

* Most of the time, you need to check whether an error variable is equal to `nil` and then act accordingly. This kind of Go code is very popular in Go programs and you will see it and use it multiple times.

* Also presented here is the `errors.New()` function that allows you to create a custom error message and `errors.Error()` function that allows you to convert an `error` variable into a `string` variable.

1. Execute the `errors.go` program:

        go run errors.go

    Your output will resemble the following:

    {{< output >}}
!!
strconv.Atoi: parsing "43W": invalid syntax
    {{< /output >}}

## Summary

In this guide you learned the basics about the Go programming language, how to execute programs, how to write loops, how to handle errors, and you saw examples for various function types.
