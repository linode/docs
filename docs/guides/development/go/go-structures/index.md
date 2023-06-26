---
slug: go-structures
description: "Learn how to use structs in Go, including how structs use value semantics, how to handle pointers to structs, and how to associate methods with structs."
keywords: [" Structs", "Golang", "Go", "Pointers"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-12-16
modified_by:
  name: Linode
image: ATutorialforLearningStructsinGo.png
title: "A Tutorial for Learning Structs in Go"
external_resources:
  - '[Go](https://golang.org)'
aliases: ['/development/go/go-structures/']
authors: ["Mihalis Tsoukalos"]
---

## Introduction

Go's array, slice, and map types can be used to group multiple elements, but they cannot hold values of multiple data types. When you need to group different types of variables and create new data types, you can use *structs*.

{{< note respectIndent=false >}}
Go does not have a concept of *classes* from other object oriented languages. Structs will be used in similar ways as classes, with important differences. For example, there is no class inheritance feature in Go.
{{< /note >}}

In this guide you will:

- [Review a simple introductory struct](#a-simple-struct) and learn about basic struct semantics.
- Find out how to use [pointers to structs](#pointers-and-structs).
- Implement [methods with structs](#methods).
- Explore the different ways to [instantiate structs](#creating-structs).
- Read through an example of how to [encode and decode JSON](#structs-and-json) with structs.

## Before You Begin

{{< content "before-you-begin-install-go-shortguide" >}}

An introductory-level knowledge of Go is assumed by this guide. If you're just getting started with Go, check out our [Learning Go Functions, Loops, and Errors](/docs/guides/learning-go-functions-loops-and-errors-a-tutorial/) tutorial.

{{< note respectIndent=false >}}
This guide was written with Go version 1.13.
{{< /note >}}

## A Simple Struct

The various elements of a struct are called the *fields* of the struct. The following Go program defines and uses a new struct type called `Employee`, which is composed of an employee's first name and their employee ID. The program then instantiates this type:

{{< file "employee.go" go >}}
package main

import (
    "fmt"
)

type Employee struct {
    FirstName string
    employeeID int
}

func main() {
    var nathan Employee
    fmt.Println(nathan)
    nathan = Employee{FirstName: "Nathan", employeeID: 8124011}
    fmt.Println(nathan)

    var heather Employee = Employee{FirstName: "Heather"}
    fmt.Println(heather)

    mihalis := Employee{"Mihalis", 1910234}
    fmt.Println(mihalis)
}
{{< /file >}}

{{< note respectIndent=false >}}
 Structs, in particular, and Go types, in general, are usually defined outside the `main()` function in order to have a global scope and be available to the entire Go package, unless you want to clarify that a type is only useful within the current scope and is not expected to be used elsewhere in your code.
{{< /note >}}

The output of `employee.go` will be:

    go run employee.go

{{< output >}}
{ 0}
{Nathan 8124011}
{Heather 0}
{Mihalis 1910234}
{{< /output >}}

The example illustrates some (but not all) of the ways a struct can be created:

- When the variable `nathan` is defined, it is not assigned a value. Go will assign the default zero value to any fields that are not given values. For a string, the zero value is the empty string, which is why a blank space appears to the left of the `0` in the first line of the output.

- One way to create a struct is to use a struct literal, as shown on line 15. When using a struct literal, you supply a comma-delimited list of the field names and the values they should be assigned.

- When using a struct literal in this way, you do not need to specify all of the fields, as shown on line 18. Because the employeeID for `heather` was not defined, it takes on the zero value (for an integer, this is `0`).

- Lastly, you can also use a struct literal without listing the fields' names, as shown on line 21. The values for the fields will be assigned according to the order that the fields are defined in the struct type definition. You must supply values for all of the fields in order to use this syntax.

    {{< note respectIndent=false >}}
The `mihalis` variable is defined using the `:=` syntax, which infers the `Employee` type for the variable from the assigned value.
{{< /note >}}

### Comparing Structs

Structs can be compared for equality. Two structs are equal if they have the same type and if their fields' values are equal.

{{< file "employee.go" go >}}
package main

import (
    "fmt"
)

type Employee struct {
    FirstName string
    employeeID int
}

func main() {
    employee1 := Employee{"Heather", 1910234}
    employee2 := Employee{"Heather", 1910234}
    fmt.Println(employee1 == employee2)
}
{{< /file >}}

The output of `employee.go` will be:

    go run employee.go

{{< output >}}
true
{{< /output >}}

{{< note respectIndent=false >}}
Structs cannot be ordered with operators like greater-than  `>` or less-than `<`.
{{< /note >}}

### Accessing Fields

You can access a specific field using the struct variable name followed by a `.` character followed by the name of the field (also referred to as *dot notation*). Given an `Employee` variable named `mihalis`, the struct's two fields can be individually accessed as `mihalis.FirstName` and `mihalis.employeeID`:

{{< file "employee.go" go >}}
package main

import (
    "fmt"
)

type Employee struct {
    FirstName string
    employeeID int
}

func main() {
    mihalis := Employee{"Mihalis", 1910234}
    fmt.Println("My name is", mihalis.FirstName, "and my employee ID is", mihalis.employeeID)
}
{{< /file >}}

The output of `employee.go` will be:

    go run employee.go

{{< output >}}
My name is Mihalis and my employee ID is 1910234
{{< /output >}}

### Public and Private Fields

In order to be able to use a struct and its fields outside of the Go package where the struct type is defined, both the struct name and the desired field names must begin with an uppercase letter. Therefore, if a struct has some field names that begin with a lowercase letter, then these particular fields will be *private* to the Go package that the struct is defined. This is a global Go rule that also applies to functions and variables.

To illustrate, consider these two Go files:

{{< file "employee/employee.go" go >}}
package employee

type Employee struct {
    FirstName string
    employeeID int
}
{{< /file >}}

{{< file "main.go" go >}}
package main

import (
    "fmt"
    . "./employee"
)

func main() {
    mihalis := Employee{"Mihalis", 1910234}
    fmt.Println("My name is", mihalis.FirstName, "and my employee ID is", mihalis.employeeID)
}
{{< /file >}}

{{< note respectIndent=false >}}
In this example, `employee.go` is created within an `employee` directory.
{{< /note >}}

The output of `main.go` will be:

    go run main.go

{{< output >}}
# command-line-arguments
./main.go:9:31: implicit assignment of unexported field 'employeeID' in employee.Employee literal
./main.go:10:80: mihalis.employeeID undefined (cannot refer to unexported field or method employeeID)
{{< /output >}}

This error reflects the fact that `employeeID` has a lowercase name and is not an exported field of the `Employee` struct.

### Value Semantics

By default, when a struct is assigned to a variable, it is copied. Consider this example:

{{< file "employee.go" go >}}
package main

import (
    "fmt"
)

type Employee struct {
    FirstName string
    employeeID int
}

func main() {
    employee1 := Employee{"Nathan", 8124011}
    fmt.Println("employee1:", employee1)
    employee2 := employee1
    employee2.FirstName = "Andy"
    employee2.employeeID = 1231410
    employee1.FirstName = "Nate"
    fmt.Println("employee1:", employee1)
    fmt.Println("employee2:", employee2)
}
{{< /file >}}

The output of `employee.go` will be:

    go run employee.go

{{< output >}}
employee1: {Nathan 8124011}
employee1: {Nate 8124011}
employee2: {Andy 1231410}
{{< /output >}}

The `employee2 := employee1` assignment creates a copy of `employee1` and saves it in `employee2`. Changing the `employee1` variable will not affect the contents of `employee2` after the assignment.

### Value Semantics with Functions

A struct can be passed to a function. By default, the struct will be copied to its function argument variable. Consider this example:

{{< file "employee.go" go >}}
package main

import (
    "fmt"
)

type Employee struct {
    FirstName string
    employeeID int
}

func ChangeEmployeeID(e Employee, newID int) {
    e.employeeID = newID
}

func main() {
    employee1 := Employee{"Nathan", 8124011}
    fmt.Println(employee1)
    ChangeEmployeeID(employee1, 1012843)
    fmt.Println(employee1)
}
{{< /file >}}

The output of `employee.go` will be:

    go run employee.go

{{< output >}}
{Nathan 8124011}
{Nathan 8124011}
{{< /output >}}

Calling the `ChangeEmployeeID` function has no effect on the value of `employee` outside of the function scope. As a result, the output of the print statement on line 20 will be the same as the output of line 18's print statement.

## Pointers and Structs

As Go supports pointers, you can create pointers to structs. The use of pointer structs is illustrated in `pointers.go`.

{{< file "pointers.go" go >}}
package main

import (
    "fmt"
)

type Employee struct {
    FirstName string
    employeeID int
}

func main() {
    var employeePointer1 *Employee = &Employee{"Nathan", 1201921}
    fmt.Println("Getting a specific struct field:", (*employeePointer1).FirstName)
    fmt.Println("With implicit dereferencing:", employeePointer1.FirstName)

    employeePointer2 := employeePointer1
    employeePointer2.FirstName = "Nate"
    fmt.Println("FirstName for employeePointer2:", employeePointer2.FirstName)
    fmt.Println("FirstName for employeePointer1:", employeePointer1.FirstName)
}
{{< /file >}}

The output of `pointers.go` will be:

    go run pointers.go

{{< output >}}
Getting a specific struct field: Nathan
With implicit dereferencing: Nathan
FirstName for employeePointer2: Nate
FirstName for employeePointer1: Nate
{{< /output >}}

`employeePointer1` points to the memory location of the struct created with the struct literal on line 13. Inserting an ampersand (`&`) before the struct literal (e.g. `Employee{"Nathan", 1201921}`) indicates that the memory location for it should be assigned.

Line 14 shows how to *dereference* the pointer by inserting a `*` before the variable name, which tells Go to return the struct located at the memory location of your pointer. Surrounding this with parentheses and then using dot notation (e.g. `(*employeePointer1).FirstName`) allows you to access fields within the struct.

However, Go allows you to *implicitly* dereference a pointer to a struct in this circumstance. This means that you can simply use normal dot notation (e.g. `employeePointer1.FirstName`) to access fields, even if your struct variable is a pointer.

Lines 17-20 show that creating a second pointer to a struct allows you to manipulate that struct from another variable. In this case, the value of the `FirstName` field for `employeePointer1` has been updated after it was assigned through `employeePointer2` on line 18. This is in contrast with the [value semantics](#value-semantics) demonstrated previously.

### Pointers and Structs and Functions

Passing a pointer to a struct as an argument to a function will allow you to mutate that struct from inside the function scope. Consider this example:

{{< file "pointers.go" go >}}
package main

import (
    "fmt"
)

type Employee struct {
    FirstName string
    employeeID int
}

func ChangeEmployeeID(e *Employee, newID int) {
    e.employeeID = newID
}

func main() {
    employeePointer1 := &Employee{"Nathan", 8124011}
    fmt.Println(*employeePointer1)
    ChangeEmployeeID(employeePointer1, 1012843)
    fmt.Println(*employeePointer1)
}
{{< /file >}}

The output of `pointers.go` will be:

    go run pointers.go

{{< output >}}
{Nathan 8124011}
{Nathan 1012843}
{{< /output >}}

Alternatively, using this code in the `main` function instead will produce identical results:

{{< file "pointers.go" go >}}
func main() {
    employee1 := Employee{"Nathan", 8124011}
    fmt.Println(employee1)
    ChangeEmployeeID(&employee1, 1012843)
    fmt.Println(employee1)
}
{{< /file >}}

## Methods

Go *methods* allow you to associate functions with structs. A method definition looks like other function definitions, but it also includes a *receiver* argument. The receiver argument is the struct that you wish to associate the method with.

Once defined, the method can be called using dot-notation on your struct variable. Here's an example of what this looks like:

{{< file "method.go" go >}}
package main

import (
    "fmt"
)

type Employee struct {
    FirstName string
    employeeID int
}

func (e Employee) PrintGreeting() {
    fmt.Println("My name is", e.FirstName, "and my employee ID is", e.employeeID)
}

func main() {
    employee1 := Employee{"Nathan", 8124011}
    employee1.PrintGreeting()
}
{{< /file >}}

The output of `method.go` will be:

    go run method.go

{{< output >}}
My name is Nathan and my employee ID is 8124011
{{< /output >}}

The receiver argument is listed in parentheses, prior to the function name, and has the syntax `(variableName Type)`; see line 12 for an example of this.

### Pointers and Methods

Using a pointer as the receiver type will allow you to mutate the pointed-to struct from within the method's scope:

{{< file "method.go" go >}}
package main

import (
    "fmt"
)

type Employee struct {
    FirstName string
    employeeID int
}

func (e *Employee) ChangeEmployeeID(newID int) {
    e.employeeID = newID
}

func main() {
    var employeePointer1 *Employee = &Employee{"Nathan", 8124011}
    fmt.Println(*employeePointer1)
    employeePointer1.ChangeEmployeeID(1017193)
    fmt.Println(*employeePointer1)
}
{{< /file >}}

The output of `method.go` will be:

    go run method.go

{{< output >}}
{Nathan 8124011}
{Nathan 1017193}
{{< /output >}}

You can also call a method with a pointer-type receiver on a normal non-pointer struct variable. Go will automatically convert the non-pointer struct variable to its memory location, and the struct will still be mutated within the function scope. This example will produce identical results to the one above:

{{< file "method.go" go >}}
package main

import (
    "fmt"
)

type Employee struct {
    FirstName string
    employeeID int
}

func (e *Employee) ChangeEmployeeID(newID int) {
    e.employeeID = newID
}

func main() {
    var employee1 Employee = Employee{"Nathan", 8124011}
    fmt.Println(employee1)
    employee1.ChangeEmployeeID(1017193)
    fmt.Println(employee1)
}
{{< /file >}}

## Creating Structs

In addition to the struct literal syntax used so far, there are a few other common ways to create a struct:

### Constructor Functions

One common pattern for creating structs is with a "constructor" function. In Go, this is just a normal function that returns a struct, or a pointer to a struct. This example will demonstrate returning a pointer to a struct:

{{< file "constructor.go" go >}}
package main

import (
    "fmt"
)

type Employee struct {
    FirstName string
    employeeID int
}

func NewEmployee(name string, employeeID int) *Employee {
    if employeeID <= 0 {
        return nil
    }
    return &Employee{name, employeeID}
}

func main() {
    employeePointer1 := NewEmployee("Nathan", 8124011)
    fmt.Println(*employeePointer1)
}
{{< /file >}}

This approach for creating new struct variables allows you to check whether the provided information is correct and valid in advance; for example, the above code checks the passed `employeeID` from lines 13 to 15. Additionally, with this approach you have a central point where struct fields are initialized, so if there is something wrong with your fields, you know exactly where to look.

{{< note respectIndent=false >}}
For those of you with a C or C++ background, it is perfectly legal for a Go function to return the memory address of a local variable. Nothing gets lost, so everybody is happy!
{{< /note >}}

### Using the new Keyword

Go supports the `new` keyword that allows you to allocate new objects with the following syntax:

{{< file "" go >}}
variable := new(StructType)
{{< /file >}}

`new` has these behaviors:

- `new` returns the memory address of the allocated object. Put simply, `new` returns a pointer.
- `new` allocates zeroed storage.

    {{< note respectIndent=false >}}
Using `new` with a struct type is similar to assigning `structType{}` to a variable. In other words, `t := new(Telephone)` is equivalent to `t := Telephone{}`.
{{< /note >}}

The following code example explores this behavior in more depth:

{{< file "new.go" go >}}
package main

import (
    "encoding/json"
    "fmt"
)

func prettyPrint(s interface{}) {
    p, _ := json.MarshalIndent(s, "", "\t")
    fmt.Println(string(p))
}

type Contact struct {
    Name string
    Main Telephone
    Tel  []Telephone
}

type Telephone struct {
    Mobile bool
    Number string
}

func main() {
    contact := new(Contact)
    telephone := new(Telephone)

    if contact.Main == (Telephone{}) {
        fmt.Println("contact.Main is an empty Telephone struct.")
    }
    fmt.Println("contact.Main")
    prettyPrint(contact.Main)

    if contact.Tel == nil {
        fmt.Println("contact.Tel is nil.")
    }

    fmt.Println("contact")
    prettyPrint(contact)
    fmt.Println("telephone")
    prettyPrint(telephone)
}
{{< /file >}}

{{< note respectIndent=false >}}
The `prettyPrint()` function is just used for printing the contents of a struct in a readable and pleasant way with the help of the `json.MarshalIndent()` function.
{{< /note >}}

Executing `new.go` will generate the following output:

    go run new.go
{{< output >}}
contact.Main is an empty Telephone struct.
contact.Main
{
    "Mobile": false,
    "Number": ""
}
contact.Tel is nil.
contact
{
    "Name": "",
    "Main": {
        "Mobile": false,
        "Number": ""
    },
    "Tel": null
}
telephone
{
    "Mobile": false,
    "Number": ""
}
{{< /output >}}

- As `Record.Tel` is a slice, its zero value is `nil`. Lines 34-36 show that comparing it to `nil` returns true.
- `Record.Main` is a `Telephone` struct, so it cannot be compared to `nil` – it can only be compared to `Telephone{}`, as demonstrated in lines 28-30.

## Structs and JSON

 Structs are really handy when we have to work with JSON data. This section is going to present a simple example where a struct is used for reading a text file that contains data in the JSON format and for creating data in the JSON format.

{{< file "json.go" go >}}
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
    fmt.Println("JSON file loaded into struct:")
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

    fmt.Println("struct saved to JSON:")
    saveToJSON(os.Stdout, myRecord)
}
{{< /file >}}

- The `loadFromJSON()` function is used for decoding the data of a JSON file according to a data structure that is given as the second argument to it.
    - We first call `json.NewDecoder()` to create a new JSON decoder variable that is associated with a file.
    - We then call the `Decode()` function for actually decoding the contents of the file and putting them into the desired variable.
    - The function uses the empty interface type (`interface{}`) in order to be able to accept any data type.

        {{< note respectIndent=false >}}
You will learn more about interfaces in a forthcoming guide.
{{< / note >}}
- The `saveToJSON()` function creates a JSON encoder variable named `encodeJSON`, which is associated with a filename, which is where the data is going to be put.
    - The call to `Encode()` is what puts the data into the desired file after encoding it.
    - In this example, `saveToJSON()` is called using `os.Stdout`, which means that data is going to standard output.
    - Last, the `myRecord` variable contains sample data using the `Record` and `Telephone` structs defined at the beginning of the program. It is the contents of the `myRecord` variable that are processed by `saveToJSON()`.

### Run the JSON Example

For the purposes of this section we are going to use a simple JSON file named `record.json` that has the following contents:

{{< file "record.json" json >}}
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

## Next Steps

Structs are a versatile Go data type because they allow you to create new types by combining existing data types. If you feel confident in the topics covered in this tutorial, try exploring our [other guides on the Go language](/docs/development/go/).
