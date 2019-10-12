---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'An introduction to Go Structures.'
keywords: ["Structures", "Golang", "Go", "Pointers"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-10-14
modified_by:
  name: Linode
title: 'Learn how to create and use structures in Go'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[Go](https://golang.org)'
---

## Introduction

Although arrays, slices and maps are all very useful, they cannot group and hold values of multiple data types at the same place. When you need to group various types of variables and create new data types, you can use *structures* – the various elements of a structure are called *fields* of the structure or just fields. For reasons that will become clear in a while, the fields of a structure usually begin with an uppercase letter. Last, the order in which you put the fields in the definition of a structure type is significant for the type identity of the defined structure.

{{< note >}}
This guide is written for a non-root user – none of the presented commands requires elevated privileges.
{{< /note >}}

## In This Guide

This guide you teach you about creating and using structures in Go, the `new` keyword, pointers to structures and implementing functions that work with structures. All you need to follow this guide is to have Go and your favorite text editor installed on your Linode machine.

## A simple structure

The following Go program defines and uses a new structure type called `XYZ`.

{{< file "./structures.go" go >}}
package main

import (
    "fmt"
)

type XYZ struct {
    X int
    Y string
    Z float64
}

func main() {
    var s1 XYZ
    fmt.Println(s1.X, s1.Z)

    p1 := XYZ{23, "Hello!", -2}
    p2 := XYZ{Z: 12, Y: "Hi!"}
    fmt.Println(p1)
    fmt.Println(p2)

    p := [3]XYZ{}
    p[2] = p1
    p[0] = p2
    fmt.Println("p:", p)
    p2 = XYZ{1, "Two", 3.1}
    fmt.Println("p2:", p2)
    fmt.Println("p:", p)
}
{{< /file >}}

The program defines a new structure named `XYZ` that has three fields named `X`, `Y` and `Z`. In order to be able to use a structure and its fields outside of the Go package that the structure type is defined, both the structure name and the desired field names must begin with an uppercase letter. Therefore, if a structure has some field names that begin with a lowercase letter, then these particular fields will be *private* to the Go package that the structure is defined. This is a global Go rule that also applies to functions and variables.

The program also defines an array of structures named `p`. You can access a specific field using the structure variable name followed by a `.` character followed by the name of the field. So, given a `XYZ` variable named `W`, the three fields of `XYZ` can be individually accessed as `W.X`, `W.Y` and `W.Z`. Last, the `p[2] = p1` assignment creates a copy of `p1` and saves it in the array at the specified place (`p[2]`). Changing the `p1` variable will not affect the contents of the `p` array after the assignment.

{{< note >}}
Go allows you to use the `XYZ{Z: 12, Y: "Hi!"}` notation for initializing or changing some or all the fields of a structure because sometimes it is hard to remember the order of the fields of the structure and because sometimes you do not want to change all the fields of a structure at once.
{{< /note >}}

The output of `structures.go` will be the following:

    go run structures.go
{{< output >}}
0 0
{23 Hello! -2}
{0 Hi! 12}
p: [{0 Hi! 12} {0  0} {23 Hello! -2}]
p2: {1 Two 3.1}
p: [{0 Hi! 12} {0  0} {23 Hello! -2}]
{{< /output >}}

{{< note >}}
Structures, in particular, and Go types, in general, are usually defined outside the `main()` function in order to have a global scope and be available to the entire Go package, unless you want to clarify that a type is only useful within the current scope and is not expected to be used elsewhere in your code.
{{< /note >}}

## Pointers and Structures

As Go supports pointers, you can create pointers to structures. The use of pointer structures is illustrated in `pointers.go`.

{{< file "./pointers.go" go >}}
package main

import (
    "fmt"
)

type myStructure struct {
    Name    string
    Surname string
    Height  int32
}

func main() {
    ptr := &myStructure{"Mihalis", "Pointer", 123}
    s2 := myStructure{"Mihalis", "s2", 123}

    fmt.Println("Getting a specific structure field:", (*ptr).Surname)
    fmt.Println(s2.Name, s2.Surname)
    fmt.Println("As a pointer:", ptr)
    fmt.Println("Memory address:", &ptr)
    fmt.Println("Value:", *ptr)
    fmt.Println("Value:", s2)
}
{{< /file >}}

`ptr` is a pointer variable whereas `s2` is a regular variable, which means that you will need the `*ptr` notation in order to dereference `ptr`. Additionally, if you want to get the value of a specific field of a pointer to a structure, you will need to use the `(*ptr).Surname` notation to separate the pointer from the field name. Last, notice that both `ptr` and `s2` are initialized in the code.

The output of `pointers.go` will resemble the following:

    go run pointers.go
{{< output >}}
Getting a specific structure field: Pointer
Mihalis s2
As a pointer: &{Mihalis Pointer 123}
Memory address: 0xc00009e000
Value: {Mihalis Pointer 123}
Value: {Mihalis s2 123}
{{< /output >}}

## Functions and Structures

### Functions with structure arguments

The `processStructure()` function illustrates that functions accept structure arguments as arguments of any other data type.

{{< file "functions.go" go >}}
func processStructure(x myStructure) string {
    return x.Name + " " + x.Surname
}
{{< /file >}}

{{< note >}}
If want to make changes to an existing structure variable inside a function, you will need to pass a pointer to that structure variable because otherwise the structure variable will be passed by value, not by reference, and the changes you make to it inside the function will get lost.
{{< /note >}}

### Functions Returning Structures

A function can return a structure or a pointer to a structure. The `retStructure()` function does the former whereas the `createStruct()` function implements the latter.

{{< file "functions.go" go >}}
func retStructure(n, s string, h int32) myStructure {
    if h > 300 {
        h = 0
    }
    return myStructure{n, s, h}
}

func createStruct(n, s string, h int32) *myStructure {
    if h > 300 {
        h = 0
    }
    return &myStructure{n, s, h}
}
{{< /file >}}

This approach for creating new structure variables allows you to check whether the provided information is correct and valid in advance. Additionally, with this approach you have a central point where structure variables are initialized so if there is something wrong with your structure variables, you know exactly where to look.

{{< note >}}
For those of you with a C or C++ background, it is perfectly legal for a Go function to return the memory address of a local variable. Nothing gets lost so everybody is happy!
{{< /note >}}

### Example

The usage of Go functions that work with structures is illustrated in `functions.go`.

{{< file "./functions.go" go >}}
package main

import (
    "fmt"
)

type myStructure struct {
    Name    string
    Surname string
    Height  int32
}

func createStruct(n, s string, h int32) *myStructure {
    if h > 300 {
        h = 0
    }
    return &myStructure{n, s, h}
}

func retStructure(n, s string, h int32) myStructure {
    if h > 300 {
        h = 0
    }
    return myStructure{n, s, h}
}

func processStructure(x myStructure) string {
    return x.Name + " " + x.Surname
}

func processPtr(x *myStructure) string {
    return (*x).Name + " " + (*x).Surname
}

func main() {
    ptr := createStruct("Mihalis", "Tsoukalos", 123)
    s2 := retStructure("Mihalis", "Tsoukalos", 123)
    fmt.Println((*ptr).Name)
    fmt.Println(s2.Name)
    fmt.Println(ptr)
    fmt.Println(s2)

    fmt.Println(processStructure(s2))
    fmt.Println(processPtr(ptr))
}
{{< /file >}}

The `processPtr()` function accepts a pointer to a structure argument, which means that you will need to dereference that variable in order to get the values of the structure fields.

The execution of `functions.go` will resemble the following output:

    go run functions.go
{{< output >}}
Mihalis
Mihalis
&{Mihalis Tsoukalos 123}
{Mihalis Tsoukalos 123}
Mihalis Tsoukalos
Mihalis Tsoukalos
{{< /output >}}

## Using the new keyword

Go supports the `new` keyword that allows you to allocate new objects. However, there is a very important detail that you need to remember about `new`: `new` returns the memory address of the allocated object. Put simply, `new` returns a pointer! The second important detail that you need to know is that `new` allocates zeroed storage before returning a pointer.

The use of `new` is illustrated in the Go code that follows.

{{< file "./new.go" go >}}
package main

import (
    "encoding/json"
    "fmt"
)

func prettyPrint(s interface{}) {
    p, _ := json.MarshalIndent(s, "", "\t")
    fmt.Println(string(p))
}

type Record struct {
    Name string
    Main Telephone
    Tel  []Telephone
}

type Telephone struct {
    Mobile bool
    Number string
}

func main() {
    s := new(Record)
    t := new(Telephone)

    if s.Main == (Telephone{}) {
        fmt.Println("s.Main is an empty Telephone structure!!")
    }
    fmt.Println("s.Main")
    prettyPrint(s.Main)

    if s.Tel == nil {
        fmt.Println("Tel is nil!!")
    }

    fmt.Println("s")
    prettyPrint(s)
    fmt.Println("t")
    prettyPrint(t)
}
{{< /file >}}

As `Record.Tel` is a slice, its zero value is `nil`. However as `s.Main` is a `Telephone` structure, it cannot be compared to `nil` – it can only be compared to `Telephone{}`. Additionally, have in mind that using `new` with a structure type is the same as using `structureType{}`. Therefore, `t := new(Telephone)` is equivalent to `t := Telephone{}`. Last, the `prettyPrint()` function is just used for printing the contents of a structure in a readable and pleasant way with the help of the `json.MarshalIndent()` function.

Executing `new.go` will generate the following output:

    go run new.go
{{< output >}}
s.Main is an empty Telephone structure!!
s.Main
{
    "Mobile": false,
    "Number": ""
}
Tel is nil!!
s
{
    "Name": "",
    "Main": {
        "Mobile": false,
        "Number": ""
    },
    "Tel": null
}
t
{
    "Mobile": false,
    "Number": ""
}
{{< /output >}}

## Structures and JSON

Structures are really handy when we have to work with JSON data. This section is going to present a simple example where a structure is used for reading a text file that contains data in the JSON format and for creating data in the JSON format.

{{< file "./json.go" go >}}
package main

import (
    "encoding/json"
    "fmt"
    "os"
)

type Record struct {
    Name    string
    Surname string
    Tel     []Telephone
}

type Telephone struct {
    Mobile bool
    Number string
}

func loadFromJSON(filename string, key interface{}) error {
    in, err := os.Open(filename)
    if err != nil {
        return err
    }

    decodeJSON := json.NewDecoder(in)
    err = decodeJSON.Decode(key)
    if err != nil {
        return err
    }
    in.Close()
    return nil
}

func saveToJSON(filename *os.File, key interface{}) {
    encodeJSON := json.NewEncoder(filename)
    err := encodeJSON.Encode(key)
    if err != nil {
        fmt.Println(err)
        return
    }
}

func main() {
    arguments := os.Args
    if len(arguments) == 1 {
        fmt.Println("Please provide a filename!")
        return
    }

    filename := arguments[1]

    var myRecord Record
    err := loadFromJSON(filename, &myRecord)
    if err == nil {
        fmt.Println(myRecord)
    } else {
        fmt.Println(err)
    }

    myRecord = Record{
        Name:    "Mihalis",
        Surname: "Tsoukalos",
        Tel: []Telephone{Telephone{Mobile: true, Number: "1234-5678"},
            Telephone{Mobile: true, Number: "6789-abcd"},
            Telephone{Mobile: false, Number: "FAVA-5678"},
        },
    }

    saveToJSON(os.Stdout, myRecord)
}
{{< /file >}}

The `loadFromJSON()` function is used for decoding the data of a JSON file according to a data structure that is given as the second argument to it. We first call `json.NewDecoder()` to create a new JSON decode variable that is associated with a file and then we call the `Decode()` function for actually decoding the contents of the file and putting them into the desired variable. The function uses the empty interface type (`interface{}`) in order to be able to accept any data type – you will learn more about interfaces in a forthcoming guide. The `saveToJSON()` function creates a JSON encoder variable named `encodeJSON`, which is associated with a filename, which is where the data is going to be put. The call to `Encode()` is what puts the data into the desired file after encoding it. In our case `saveToJSON()` is called using `os.Stdout`, which means that data is going to standard output. Last, the `myRecord` variable contains sample data using the `Record` and `Telephone` structures defined at the beginning of the program. It is the contents of the `myRecord` variable that are processed by `saveToJSON()`.

For the purposes of this section we are going to use a simple JSON file named `record.json` that has the following contents:

{{< file "./record.json" json >}}
{
    "Name":"Mihalis",
    "Surname":"Tsoukalos",
    "Tel":[
        {"Mobile":true,"Number":"1234-567"},
        {"Mobile":true,"Number":"1234-abcd"},
        {"Mobile":false,"Number":"abcc-567"}
    ]
}
{{< /file >}}

Executing `json.go` and processing the data found in `record.json` will generate the following output:

    go run json.go record.json
{{< output >}}
{Mihalis Tsoukalos [{true 1234-567} {true 1234-abcd} {false abcc-567}]}
{"Name":"Mihalis","Surname":"Tsoukalos","Tel":[{"Mobile":true,"Number":"1234-5678"},{"Mobile":true,"Number":"6789-abcd"},{"Mobile":false,"Number":"FAVA-5678"}]}
{{< /output >}}

## Summary

Structures are the most versatile Go data type because they allow you to create new data types by combining existing data types. Additionally, they play a key role when working with JSON data. However, according to the Go philosophy, they are simple to use.
