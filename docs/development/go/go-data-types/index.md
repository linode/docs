---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'An introduction to basic Go Data Types.'
keywords: ["Go", "Golang", "Arrays", "Slices", "Maps"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-09-18
modified_by:
  name: Linode
title: 'Learning about Go arrays, slices, maps, numbers and pointers.'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[Go](https://golang.org)'
  - '[Go Packages](https://golang.org/pkg/)'
---

## Introduction

The main subject of this guide is the *basic data types* of Go. This list includes *numeric types*, *arrays*, *slices* and *maps*. Despite their simplicity, these data types can help you make numeric calculations, store, retrieve and alter your data of your programs in a very convenient and quick way. Additionally, you will learn about working with command line arguments and pointers.

## The Standard Go Library

Go comes with a very rich, well-tested and handy standard library. The list of the most important Go packages includes the following:

| Package name | Description |
------------------------------
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

## Working with Command Line Arguments

This section will illustrate how you can work with command line arguments in Go. The presented program finds out the minimum and the maximum integer of the given command line arguments.

    {{< file "./cla.go" go >}}
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
        fmt.Println(err)
        min = 0
        max = 0
    } else {
        min = temp
        max = temp
    }

    for i := 2; i < len(arguments); i++ {
        n, err := strconv.Atoi(arguments[i])
        if err != nil {
            fmt.Println("Skipping", arguments[i])
            fmt.Println(err)
            continue
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

If you need to work with the command line arguments of a Go program you will need to import the `os` package. All command line arguments are kept in the `os.Args` slice, which you will have to process on your own. As it also happens with C, the first element of `os.Args` is the name of the executable, which in this case should not be processed. The `len()` function returns the length of a slice or an array.

If the first command line argument of the program is a valid integer, then both `min` and `max` are initialized to its value. Otherwise they are both initialized to 0. This happens because you need to have an initial value for both these variables.

The output of `cla.go` will resemble the following:

    go run cla.go -1 2 3 a
{{< output >}}
Skipping a
strconv.Atoi: parsing "a": invalid syntax
Min: -1
Max: 3
{{< /output >}}

## Go Data Types

### Numeric Types

#### Integers

Go offers support for four different sizes of signed and unsigned integers, named *int8*, *int16*, *int32*, *int64*, *uint8*, *uint16*, *uint32* and *uint64*, respectively. The number at the end of each type represents the number of bits used for representing that type. Additionally, there exist *int* and *uint* that are the most efficient signed and unsigned integers for the current machine. Therefore, when in doubt, use `int` and `uint`.

Notice that when you are dividing integer variables, the result will be an integer, which means that if the division is not perfect, you will not get the expected result. In `numeric.go` you will find a technique to bypass that rule.

#### Floating point numbers

Go supports only two types of floating point numbers, named `float32` and `float64`. The first one provides about six decimal digits of precision whereas the second one gives you fifteen digits of precision.

#### Complex numbers

Similarly to floating point numbers, Go offers two complex number types named `complex64` and `complex128`. The first one uses two `float32` floats, one for the real part and the other for the imaginary part of the complex number whereas `complex128` uses two `float64`.

#### Example

The use of the numeric types of Go is illustrated in `numeric.go`.

    {{< file "./numeric.go" go >}}
package main

import (
    "fmt"
)

func main() {
    c1 := -12 + 1i
    c2 := complex(5, 7)
    fmt.Printf("Type of c1: %T\n", c1)
    fmt.Printf("Type of c2: %T\n", c2)

    var c3 complex64 = complex64(c1 + c2)
    fmt.Println("c3:", c3)
    fmt.Printf("Type of c3: %T\n", c3)

    cZero := c3 - c3
    fmt.Println("cZero:", cZero)

    x := 12
    k := 7
    fmt.Printf("Type of x: %T\n", x)

    div := x / k
    fmt.Println("Integer division generates an integer:", div)
    fmt.Println("Convert to float64:", float64(x)/float64(k))

    var m, n float64
    m = 1.223
    fmt.Println("m, n:", m, n)

    y := 4 / 2.3
    fmt.Println("y:", y)

    divFloat := float64(x) / float64(k)
    fmt.Println("divFloat:", divFloat)
    fmt.Printf("Type of divFloat: %T\n", divFloat)
}
{{< /file >}}

So, if you are dividing two integers named `x` and `k`, you can generate a `float64` by executing `float64(x)/float64(k)`.

Notice that if you mistakenly try to create a complex number as `aComplex := -12 + 2 * i`, there will be two possible outcomes due to the fact that this statement tells Go that you want to perform an addition and a multiplication using a variable named `i`. If there is no numeric variable named `i` in the current scope, this statement will create a syntax error and the compilation of your Go code will fail. However, if a numeric variable named `i` exists, the calculation will be successful, but you will not get the desired complex number as the result.

The output of `numeric.go` will be as follows:

    go run numeric.go
{{< output >}}
Type of c1: complex128
Type of c2: complex128
c3: (-7+8i)
Type of c3: complex64
cZero: (0+0i)
Type of x: int
Integer division generates an integer: 1
Convert to float64: 1.7142857142857142
m, n: 1.223 0
y: 1.7391304347826086
divFloat: 1.7142857142857142
Type of divFloat: float64
{{< /output >}}

### Arrays

Arrays are one of the most popular data structures for two reasons. The first one is that they are simple and easy to understand and the second is that they are very versatile and can store different kinds of data.

You can define an array that stores four `int` values using the `anArray := [4]int{1, 0, 0, -4}` statement. The index of the first element of any dimension of an array is `0`. The length of an array is specified at its declaration and cannot change. Last, you can find the length of an array using the `len()` function.

#### Disadvantages of Arrays

Go arrays have many disadvantages that will make you reconsider using them in your Go projects. As you already know, once you define an array, you cannot change its size. Putting it simply, if you need to add an element to an existing array that has no space left, you will need to create a bigger array and copy all the elements of the old array to the new one. Then, when you pass an array to a function as a parameter, you actually pass a copy of the array, which means that any changes you make to an array inside a function will be lost after the function exits. Last, passing a large array to a function can be pretty slow because Go has to create a copy of the array. The solution to all these problems is to use slices.

### Slices

Go slices are very powerful and it would not be an exaggeration to tell that slices could totally replace the use of arrays in Go. There are only a few occasions that you will need to use an array instead of a slice. The most obvious one is when you are absolutely sure that you will need to store a fixed number of elements. As slices are *passed by reference* to functions, which means that what is actually passed is the memory address of the slice variable (*a pointer*), any modifications you make to a slice inside a function will not be lost after the function exits. Moreover, passing a big slice to a function is significantly faster than passing an array with the same number of elements because Go will not have to make a copy of the slice. Slices can grow dynamically – you can add new elements to an existing slice using the `append()` function. Actually, the only way to increase the length of a slice is with the use of the `append()` function.

#### Example

In this section you will see a Go program that illustrates the use of both arrays and slices.

    {{< file "./arrSli.go" go >}}
package main

import (
    "fmt"
)

func main() {
    anArray := [5]int{-1, -2, -3, -4, -5}
    twoD := [4][4]int{{1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12}, {-13, -14, -15, -16}}
    threeD := [2][2][2]int{{{1, 0}, {-2, 4}}, {{5, -1}, {7, 0}}}

    fmt.Println("The length of", anArray, "is", len(anArray))
    fmt.Println("The first element of", twoD, "is", twoD[0][0])
    fmt.Println("The length of", threeD, "is", len(threeD))

    for _, v := range threeD {
        for _, m := range v {
            for _, s := range m {
                fmt.Print(s, " ")
            }
        }
        fmt.Println()
    }

    aSlice := []int{1, 2, 3, 4, 5}
    fmt.Println(aSlice)
    integers := make([]int, 2)
    fmt.Println(integers)

    integers = nil
    fmt.Println("integers:", integers)

    refAnArray := anArray[:]
    fmt.Println(anArray)
    fmt.Println("refAnArray:\t", refAnArray)
    anArray[4] = -100
    fmt.Println("refAnArray:\t", refAnArray)
    fmt.Println("anArray:\t", anArray)

    s := make([]byte, 5)
    fmt.Println("Byte slice:\t", s)
    twoDSlice := make([][]int, 3)
    fmt.Println(twoDSlice)

    for i := 0; i < len(twoDSlice); i++ {
        for j := 0; j < 2; j++ {
            twoDSlice[i] = append(twoDSlice[i], i*j)
        }
    }

    for _, x := range twoDSlice {
        for i, y := range x {
            fmt.Println("i:", i, "value:", y)
        }
    }
}
{{< /file >}}

There are many things happening in `arrSli.go`. First, you can see that you can access all the elements of an array or a slice using `for` loops or `range`. The latter is more elegant than the former and does not require calling `len()`. However, if you want to know the number of iterations that are going to be executed in advance, you cannot use the `range` keyword. Additionally, both arrays and slices can have multiple dimensions. However, when using more than two or three dimensions, things get complicated.

Go offers a way for a slice to reference the elements of an entire array (`anArray[:]`). In order to select the second and third elements of a slice or an array using the `[:]` notation, you should use `[1:3]`, which means starting with index number `1` and going up to index number `3`, without including index number `3`.

{{< note >}}
If you try to access an array element or a slice element that does not exist, your program will crash. This is called an *out-of-bounds error*. The same thing will happen if you use a negative index number. The good thing is that the Go compiler will catch that kind of errors.
{{< /note >}}

Executing `arrSli.go` will generate the following output:

    go run arrSli.go
{{< output >}}
The length of [-1 -2 -3 -4 -5] is 5
The first element of [[1 2 3 4] [5 6 7 8] [9 10 11 12] [-13 -14 -15 -16]] is 1
The length of [[[1 0] [-2 4]] [[5 -1] [7 0]]] is 2
1 0 -2 4
5 -1 7 0
[1 2 3 4 5]
[0 0]
integers: []
[-1 -2 -3 -4 -5]
refAnArray:  [-1 -2 -3 -4 -5]
refAnArray:  [-1 -2 -3 -4 -100]
anArray:     [-1 -2 -3 -4 -100]
Byte slice:  [0 0 0 0 0]
[[] [] []]
i: 0 value: 0
i: 1 value: 0
i: 0 value: 0
i: 1 value: 1
i: 0 value: 0
i: 1 value: 2
{{< /output >}}

#### Sorting slices using sort.Slice()

Go provides the `sort.Slice()` function for sorting slices, which is illustrated in `sortSlice.go`:

    {{< file "./sortSlice.go" go >}}
package main

import (
    "fmt"
    "sort"
)

func main() {
    mySlice := make([]int, 0)
    mySlice = append(mySlice, 90)
    mySlice = append(mySlice, 45)
    mySlice = append(mySlice, 45)
    mySlice = append(mySlice, 50)
    mySlice = append(mySlice, 0)

    fmt.Println("0:", mySlice)

    sort.Slice(mySlice, func(i, j int) bool {
        return mySlice[i] < mySlice[j]
    })
    fmt.Println("<:", mySlice)

    sort.Slice(mySlice, func(i, j int) bool {
        return mySlice[i] > mySlice[j]
    })
    fmt.Println(">:", mySlice)
}
{{< /file >}}

The `sort.Slice()` function **rearranges** of the elements in the slice according to the sorting function. The sorting function, which defines the way the elements of the slice will be sorted, is provided as an argument to `sort.Slice()`. If we are talking about numeric values or strings, then sorting them is really easy and straightforward because we have the `<` and `>` operators. However, if you ever want to sort a slice of structures based on a given structure field, then the implementation of the sorting function will be slightly more complex.

Executing `sortSlice.go` will create the following output:

    go run sortSlice.go
{{< output >}}
0: [90 45 45 50 0]
<: [0 45 45 50 90]
>: [90 50 45 45 0]
{{< /output >}}

#### Appending an array to a slice

This section will present a technique that shows how you can append an array to an existing slice.

    {{< file "./appendA2S.go" go >}}
package main

import (
    "fmt"
)

func main() {
    a := [3]int{14, 15, 16}
    s := []int{-1, -2, -3}

    ref := a[:]
    fmt.Println("Existing array:\t", ref)
    t := append(s, ref...)
    fmt.Println("New slice:\t", t)
    s = append(s, ref...)
    fmt.Println("Existing slice:\t", s)

    s = append(s, s...)
    fmt.Println("s+s:\t\t", s)
}
{{< /file >}}

The program defines an array named `a` and a slice named `s`. For this to work, you need to create a reference to the existing array using a statement like `ref := a[:]`. Then, we create a new slice named `t` that contains the elements of `a + s`, we append the array named `a` to the slice named `s` using the reference to the array and we store the result to the `s` slice. Last, we append a slice to itself using the `s = append(s, s...)` statement.

The output of `appendA2S.go` will be the following:

    go run appendA2S.go
{{< output >}}
Existing array:  [14 15 16]
New slice:   [-1 -2 -3 14 15 16]
Existing slice:  [-1 -2 -3 14 15 16]
s+s:         [-1 -2 -3 14 15 16 -1 -2 -3 14 15 16]
{{< /output >}}

#### The capacity and the length of a slice

The *length* of a slice is the same as the length of an array with the same number of elements and can be found using the `len()` function. The *capacity* of a slice is the current room that has been allocated for this particular slice and can be found with the `cap()` function – arrays do not have a capacity property. As slices are dynamic in size, if a slice runs out of room and you append a new element to it, Go automatically doubles its current capacity to make room for even more elements. This is illustrated in the following code:

    {{< file "./capacity.go" go >}}
package main

import (
    "fmt"
)

func printSlice(x []int) {
    for _, number := range x {
        fmt.Print(number, " ")
    }
    fmt.Println()
    fmt.Printf("Cap: %d, Length: %d\n", cap(x), len(x))
}

func main() {
    aSlice := []int{-1, 0, 4}
    fmt.Printf("aSlice: ")
    printSlice(aSlice)

    aSlice = append(aSlice, -10)
    fmt.Printf("aSlice: ")
    printSlice(aSlice)

    aSlice = append(aSlice, -12)
    aSlice = append(aSlice, -3)
    aSlice = append(aSlice, -40)
    printSlice(aSlice)
}
{{< /file >}}

The output of `capacity.go` will be the following:

    go run capacity.go
{{< output >}}
aSlice: -1 0 4
Cap: 3, Length: 3
aSlice: -1 0 4 -10
Cap: 6, Length: 4
-1 0 4 -10 -12 -3 -40
Cap: 12, Length: 7
{{< /output >}}

The initial size of the slice was three. As a result, the initial value of its capacity was also three. After adding one element to the slice, its size became four, whereas its capacity doubled and became six. After adding three more elements to the slice, its size became seven, whereas its capacity was doubled one more time and became 12.

#### About make()

The `make()` function allows you to create empty slices with the desired *length* and *capacity* based on the parameters passed to `make()`. The first parameter is the data type of the slice, the second is the length and the third is the capacity, which is the only parameter that can be omitted. In that case, the capacity of the slice will be the same as its length. So, you can define a new empty slice with 20 places that can be automatically expanded when needed using the `make([]int, 20)` statement.

Notice that Go **automatically initializes** the elements of an empty slice to the zero value of its type, which means that the value of the initialization depends on the type of the object stored in the slice. For integers, the zero value is `0`.

As you will see in a while, `make()` can also create maps in Go.

### Maps

A Go Map is equivalent to the well-known *hash table* found in other programming languages. The main advantage of maps is that they can use any data type as their index, which is this case it is called a *map key* or just a *key*. Although Go maps do not exclude any data types from being used as keys, for a data type to be used as a key, it must be comparable, which means that the Go compiler must be able to differentiate one key from another or, putting it simply, that the keys of a map must support the `==` operator. However using the `bool` data type as the key to a map will definitely limit your options!

#### Example

The presented example shows how you can work with Go maps.

    {{< file "./maps.go" go >}}
package main

import (
    "fmt"
)

func main() {

    iMap := make(map[string]int)
    iMap["k1"] = 12
    iMap["k2"] = 13
    fmt.Println("iMap:", iMap)

    mapB := map[string]int{
        "k1": 12,
        "k2": 13,
    }

    fmt.Println("mapB:", mapB)
    delete(mapB, "k1")
    delete(mapB, "k1")
    delete(mapB, "k1")
    fmt.Println("mapB:", mapB)

    _, ok := iMap["doesItExist"]
    if ok {
        fmt.Println("Exists!")
    } else {
        fmt.Println("Does NOT exist")
    }

    for key, value := range iMap {
        fmt.Println(key, value)
    }
}
{{< /file >}}

You can create an empty map with `string` keys and `int` values with the help of the `make()` function: `make(map[string]int)`. You can add elements to that Go map without the need for an `append()` function like you did for slices (`iMap["k1"] = 12`). Additionally, Go supports maps literals, which is illustrated in the definition of the `mapB` map. You can delete an element of a map using the `delete()` function. The program also contains a technique that allows you to find out whether a key exists in a map or not. A `iMap["doesItExist"]` statement returns two things. The second thing is a boolean value. If that boolean value is `true` then the `doesItExist` key exists, which means that there is a value in `iMap["doesItExist"]`. Last, notice that you cannot make any assumptions about the order the map pairs are going to be displayed on your screen because that order is totally random.

The output of `maps.go` will resemble the following:

    go run maps.go
{{< output >}}
iMap: map[k1:12 k2:13]
mapB: map[k1:12 k2:13]
mapB: map[k2:13]
Does NOT exist
k1 12
k2 13
{{< /output >}}

### Pointers

Go supports pointers! Pointers are *memory addresses* that offer improved speed in exchange for difficult to debug code and nasty bugs. When working with pointers, you need `*` to get the value of a pointer, which is called *dereferencing* the pointer, and `&` to get the memory address of a non-pointer variable. If a variable is a pointer, then it holds a memory address that should be used for getting the value stored there. There is no need to use `&` for pointer variables. Similarly, there is no need to use `*` for non-pointer variables.

#### Example

Pointers are illustrated in `pointers.go`.

    {{< file "./pointers.go" go >}}
package main

import (
    "fmt"
)

func getPointer(n *int) {
    *n = *n * *n
}

func returnPointer(n int) *int {
    v := n * n
    return &v
}

func main() {
    i := -10
    j := 25

    pI := &i
    pJ := &j

    fmt.Println("pI memory address:", pI)
    fmt.Println("pJ memory address:", pJ)
    fmt.Println("pI value:", *pI)
    fmt.Println("pJ value:", *pJ)

    *pI = 123456
    *pI--
    fmt.Println("i:", i)

    getPointer(pJ)
    fmt.Println("j:", j)
    k := returnPointer(12)
    fmt.Println("Value of k:", *k)
    fmt.Println("Memory address of k:", k)
}
{{< /file >}}

The good and dangerous thing with `getPointer()` is that it updates the variable passed to it without the need to return anything to the caller function because the pointer passed as a parameter contains the memory address of the variable. The `returnPointer()` function gets an integer parameter and returns a pointer to an integer, which is denoted by `return &v`. Although both `getPointer()` and `returnPointer()` find the square of an integer, they use a totally different approach. `getPointer()` stores the result to the provided parameter whereas `returnPointer()` returns the result, which requires a different variable for storing it.

The output of `pointers.go` will resemble the following:

    go run pointers.go
{{< output >}}
pI memory address: 0xc00001a0b0
pJ memory address: 0xc00001a0b8
pI value: -10
pJ value: 25
i: 123455
j: 625
Value of k: 144
Memory address of k: 0xc00001a0d0
{{< /output >}}

## Summary

This guide talked about the basic data types of Go as well as how to work with command line arguments in Go and pointers. The next Go guide will discuss Go structures.
