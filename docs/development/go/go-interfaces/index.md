---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'An introduction to Go Interfaces.'
keywords: ["Go", "Interfaces", "Golang", "Programming"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-10-16
modified_by:
  name: Linode
title: 'Learning how to create and use Interfaces in Go'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[Go](https://golang.org)'
  - '[The Go Playground](https://play.golang.org/)'
---

## Introduction

Go supports the *Interface* type. Strictly speaking, a Go interface type defines (or describes) the **behavior** of other types by specifying a set of methods (functions) that need to be implemented. For a type to satisfy an interface, it needs to implement *all the methods* required by that interface, which are usually not too many. Therefore, interfaces are *abstract types* that specify a set of functions that need to be implemented so that another type can be considered an instance of the interface. So, an interface is two things: a set of methods and a type.

The biggest advantage you get from interfaces is that you can pass a variable of a data type that implements a particular interface to any function that expects a parameter of that specific interface.

### In This Guide

This guide will tell you how to create interfaces in Go, how to use existing interfaces, how to combine interfaces to create a new one and about the handy *empty interface type*. All you need to follow this guide is to have Go and your favorite text editor installed on your Linode machine.

## Existing Go Interfaces

Two very common Go interfaces are `io.Reader` and `io.Writer`, which are used for all kinds of file input and output operations. Each one of these interface definitions requires the implementation of a single function. In other words, for an interface to be popular or successful it does not need to include too many functions in its definition. Usually, the fewer functions an interface requires, the more useful it will be.

The definition of `io.Reader` is as follows:

    type Reader interface {
        Read(p []byte) (n int, err error)
    }

The `Read()` method takes a byte slice as input, which will be filled with data up to its size, and returns the number of bytes read and an `error` variable.

The definition of `io.Writer` is the following:

	type Writer interface {
	    Write(p []byte) (n int, err error)
	}

The `Write()` method takes a byte slice, which contains the data that you want to write, as input and returns the number of bytes written and an `error` variable.

Two less popular interfaces can be found in the `encoding/json` package – their names are `Marshaler` and `Unmarshaler`. Each one of these interfaces requires the implementation of a single method, named `MarshalJSON()` and `UnmarshalJSON()`, respectively. These two methods allow you to perform custom JSON marshalling and unmarshalling, respectively.

## Creating and Using a New Interface

In this section you will see the definition and the use of a new interface named `Shape`.

{{< file "./myInter.go" go >}}
package main

import (
    "fmt"
    "math"
)

type Shape interface {
    Area() float64
    Perimeter() float64
}

type square struct {
    X float64
}

type circle struct {
    R float64
}

type Nothing struct{}

func (s square) Area() float64 {
    return s.X * s.X
}

func (s square) Perimeter() float64 {
    return 4 * s.X
}

func (s circle) Area() float64 {
    return s.R * s.R * math.Pi
}

func (s circle) Perimeter() float64 {
    return 2 * s.R * math.Pi
}

func (s Nothing) Area() float64 {
    return 0
}

func (s Nothing) Perimeter() float64 {
    return 0
}

func Calculate(x Shape) {
    c, ok := x.(circle)
    if ok {
        fmt.Println("Is a circle!", c)
    } else {
        fmt.Printf("%T cannot be converted to circle!\n", x)
    }

    v, ok := x.(square)
    if ok {
        fmt.Println("Is a square:", v)
    }

    fmt.Println(x.Area())
    fmt.Println(x.Perimeter())
}

func main() {
    x := square{X: 10}
    fmt.Println("Perimeter:", x.Perimeter())
    Calculate(x)
    y := circle{R: 5}
    Calculate(y)

    n := Nothing{}
    Calculate(n)
}
{{< /file >}}

The `Shape` interface requires the implementation of two functions (a.k.a. *methods*) named `Area()` and `Perimeter()`. All `square`, `circle` and `Nothing` structures satisfy the `Shapre` interface by implementing its two functions. If you have a `square` variable named `c`, you can call the two functions of the `Shape` interface as `c.Area()` and `c.Perimeter()`.

The `Calculate()` function uses a technique that determines whether you can convert a data type to another – this is called type assertion and it is going to be explained later on in this guide. `Calculate()` performs two tests to determine whether the current function argument is a `circle` or a `square` data type using the `c, ok := x.(circle)` and `v, ok := x.(square)` statements, respectively. If the value of `ok` is `true` then the conversion can be performed successfully. Notice that the `Calculate()` function accepts all variables that satisfy the `Shape` interface.

`Nothing` is a structure without any fields, that is, an empty structure. Its main advantage is that `Nothing` is a concrete type that we can use for attaching some functions to it – in this case we attach the functions needed by the `Shape` interface that makes the empty structure a *method receiver*.

{{< note >}}
Interfaces are usually defined in external packages, not in the `main` package. For reasons of simplicity, `myInter.go` contains the `main()` function as well as the definition of the `Shape` interface and the use of it. According to the Go rules, if an interface name begins with an uppercase letter, it will be automatically exported and you will be able to use it outside of the current package; otherwise, it will be available to the current package only.
{{< /note >}}

Executing `myInter.go` will resemble the following output:

    go run myInter.go
{{< output >}}
Perimeter: 40
main.square cannot be converted to circle!
Is a square: {10}
100
40
Is a circle! {5}
78.53981633974483
31.41592653589793
main.Nothing cannot be converted to circle!
0
0
{{< /output >}}

{{< note >}}
Notice that if you want a method to modify the receiver object, you must make the receiver a *pointer*. This is not needed in `myInter.go`.
{{< /note >}}

### Combining Interfaces

You can combine multiple existing interfaces and create new ones. This capability is illustrated in `combine.go`.

{{< file "./combine.go" go >}}
package main

import (
    "fmt"
)

type A interface {
    functionA() int
}

type B interface {
    functionB() int
}

type AandB interface {
    A
    B
}

type C struct {
    X int
}

func (c C) functionA() int {
    return c.X + c.X
}

func (c C) functionB() int {
    return c.X * c.X
}

func compute(x AandB) {
    fmt.Println(x.functionA())
    fmt.Println(x.functionB())
}

func main() {
    c := C{10}
    compute(c)

    var k AandB = c
    compute(k)
}
{{< /file >}}

In this program, the `AandB` interface is a combination of interfaces `A` and `B`. As functions `functionA()` and `functionB()` are implemented for the `C` data type, `C` automatically satisfies interface `AandB` and therefore the `c` variable can be used as an argument to the `compute()` function. Notice that `C` also satisfies the `A` and `B` interfaces.

Executing `combine.go` will generate the following output:

    go run combine.go
{{< output >}}
20
100
20
100
{{< /output >}}

The combination of interfaces allows you to upgrade existing interfaces and add more functionality to them when and if required.

## The Empty Interface Type

You are also allowed to create and use an interface with an empty type, which is defined as `interface{}`. The empty interface type is mainly used for accepting **values of any type**. This happens because every type satisfies that interface as there are no methods that you need to implement for it. As a result, any function with an argument of `interface{}` can accept any data type!

### Finding out the Type of a Variable

As you have just learned, in order to be able to develop a function that accepts any data type, you need to use `interface{}`. The presented example will allow you to use the `switch` statement in a function in order to tell the data type of a variable.

{{< file "./findType.go" go >}}
package main

import (
    "fmt"
)

type Square struct {
    X float64
}

type Circle struct {
    R float64
}

type Rectangle struct {
    X float64
    Y float64
}

func tellInterface(x interface{}) {
    switch v := x.(type) {
    case Square:
        fmt.Println("This is a Square!")
    case Circle:
        fmt.Printf("%v is a Circle!\n", v)
    case Rectangle:
        fmt.Println("This is a Rectangle!")
    default:
        fmt.Printf("Unknown type %T!\n", v)
    }
}

func main() {
    x := Circle{R: 15}
    tellInterface(x)
    y := Rectangle{X: 2, Y: 1}
    tellInterface(y)
    z := Square{X: 3}
    tellInterface(z)
    tellInterface("Hello World!")
    tellInterface(-12)
}
{{< /file >}}

The `tellInterface()` function accepts any data type in order to process it using a `switch` block. Each of the cases in the `switch` is a data type – you will have to put all the data types that you want to support. The `default:` case will handle the remaining data types. Please notice the use of the `x.(type)` statement that returns the data type of the variable.

Executing `findType.go` will generate the following output:

    go run findType.go
{{< output >}}
{15} is a Circle!
This is a Rectangle!
This is a Square!
Unknown type string!
Unknown type int!
{{< /output >}}

## Type Assertion

*Type Assertion* is when you want to convert an interface type to a different data type – the notation that is used is `x.(T)`, where `x` is an interface type and `T` is a data type. For a type assertion to work, `x` should not be `nil` and the dynamic type of `x` should be identical to the `T` type. The technique is illustrated in `typeAssertion.go`.

{{< file "./typeAssertion.go" go >}}
package main

import (
    "fmt"
)

func returnNumber() interface{} {
    return 12
}

func main() {
    x := returnNumber()
    // This will fail:
    // x++
    number := x.(int)
    number++
    fmt.Println(number)

    v, ok := x.(int64)
    if ok {
        fmt.Println("Type assertion successful: ", v)
    } else {
        fmt.Println("Type assertion failed!")
    }
}
{{< /file >}}

The type assertion allows you to work with the value of `x`, which is stored in `number`, and use its integer value. As the type of `x` is in reality an integer, the type assertion will work. Notice that the type of `number` is `int`, which means that trying to convert it to `int64` will fail – this is showcased in the `if else` block at the end of the `main()` function. Additionally, if you are not sure about a type assertion, this is the right way to try and see if a type assertion fails or not.

Executing `typeAssertion.go` will generate the following output:

    go run typeAssertion.go
{{< output >}}
13
Type assertion failed!
{{< /output >}}

## Summary

Interfaces play a key role in Go and can simplify the code of your programs when they have to deal with multiple data types. But remember, interfaces should be as simple as possible!
