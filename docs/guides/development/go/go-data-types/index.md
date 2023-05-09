---
slug: go-data-types
description: "In this guide, we will walk you through the basics of the Go programming language, including pointers, available numeric types, arrays, slices, and maps."
keywords: ["Go", "Golang", "Pointers", "Arrays", "Slices", "Maps"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-03-19
modified_by:
  name: Linode
title: "A Tutorial for Learning Go Data Types"
external_resources:
  - '[Go](https://golang.org)'
  - '[Go Packages](https://golang.org/pkg/)'
image: GoDataTypes.png
aliases: ['/development/go/go-data-types/']
authors: ["Mihalis Tsoukalos"]
---

This guide serves as an introduction to several useful data types in Go. Specifically, you'll learn about:

- How [pointers](#pointers) work in Go.

- The various [numeric types](#numeric-types) that are available.

- How [arrays](#arrays) work, and their limitations.

- How to use [slices](#slices), which are like arrays, but with more flexibility.

- How to use [maps](#maps), which are similar to hash tables in other languages.

## Before You Begin

If you're just starting with Go, we recommend reading our [Beginner's Guide to Go](/docs/guides/beginners-guide-to-go/) guide first.

{{< content "before-you-begin-install-go-shortguide" >}}

{{< note respectIndent=false >}}
This guide was written with Go version 1.13.
{{< /note >}}

## Pointers

Go supports pointers! Pointers are *memory addresses* that allow you to manipulate the values held at their addresses. When a pointer variable is passed to a function, this behavior allows you to mutate the variable's value from inside the scope of the function. Using pointers can result in improved speed for your program, but they can also sometimes make your code harder to debug.

- Prepend a non-pointer's variable name with the `&` symbol to get the memory address of that variable:

    {{< file "" go >}}
var anInteger int = 5
anIntegerPointer := &anInteger
{{< /file >}}

- The type for a pointer variable is the type of the pointer's value with the `*` symbol prepended to it:

    {{< file "" go >}}
var anotherIntegerPointer *int = &anInteger
{{< /file >}}

- Once you have a pointer variable, prepend the `*` symbol to that pointer's name to get the value held at its memory address. This is called *dereferencing* the pointer:

    {{< file "" go >}}
// Prints "5"
fmt.Println(*anIntegerPointer)
{{< /file >}}

- You can dereference the pointer to change the value at that memory location:

    {{< file "" go >}}
*anIntegerPointer = 10
// Prints "10"
fmt.Println(*anIntegerPointer)

// Prints "10".
// The original non-pointer variable
// now also has this value.
fmt.Println(anInteger)
{{< /file >}}

### Pointers Example

More complex examples of pointers are illustrated in `pointers.go`, including how a pointer can be used with a function:

{{< note respectIndent=false >}}
For more information on how to use functions in Go, review our [functions, loops, and errors guide](/docs/guides/learning-go-functions-loops-and-errors-a-tutorial/).
{{< /note >}}

{{< file "pointers.go" go >}}
package main

import (
    "fmt"
)

func triple(n *int) {
    *n = *n * 3
}

func returnTripleOf(n int) *int {
    v := n * 3
    return &v
}

func main() {
    i := -10
    j := 25

    pI := &i
    pJ := &j

    fmt.Println("pI memory address:\t", pI)
    fmt.Println("pJ memory address:\t", pJ)
    fmt.Println("pI value:\t\t", *pI)
    fmt.Println("pJ value:\t\t", *pJ)

    *pI = 123456
    *pI--
    fmt.Println("i:\t\t\t", i)

    triple(pJ)
    fmt.Println("j:\t\t\t", j)

    k := returnTripleOf(12)
    fmt.Println("Value of k:\t\t", *k)
    fmt.Println("Memory address of k:\t", k)
}
{{< /file >}}

The output of `pointers.go` will resemble the following:

    go run pointers.go

{{< output >}}
pI memory address:       0xc000016058
pJ memory address:       0xc000016070
pI value:                -10
pJ value:                25
i:                       123455
j:                       75
Value of k:              36
Memory address of k:     0xc000016098
{{< /output >}}

- `triple()` multiplies a number by three. This function will update the variable passed to it without returning anything to the caller function. This is because the pointer passed as a parameter (`n *int`) contains the memory address of the variable.

- `returnTripleOf()` also multiplies a number by three. This function accepts an integer parameter (`n int`), stores the result of is calculation in a new integer (`v`), and returns a pointer to this new integer (`return &v`).

## Numeric Types

### Integers

Go offers support for four different sizes of signed integers (`int8`, `int16`, `int32`, `int64`) and unsigned integers (`uint8`, `uint16`, `uint32` and `uint64`). The number at the end of each type represents the number of bits used for representing that type. Additionally, there exist `int` and `uint` types that are the most efficient signed and unsigned integers for the current machine. Therefore, when in doubt, use `int` and `uint`.

Note that when you are dividing integer variables, the returned value will be an integer. Specifically, the result be the largest integer less than or equal to the result of the calculation:

{{< file "" go >}}
// result will be 3
result := 13 / 4
{{< /file >}}

If you want to preserve any decimal points in the result, you can first convert the integers to [floating point numbers](#floating-point-numbers), as demonstrated in [the `numeric.go` example](#numeric-types-example).

### Floating Point Numbers

Go supports two types of floating point numbers, named `float32` and `float64`. The first one provides about six decimal digits of precision whereas the second one gives you fifteen digits of precision.

### Complex Numbers

Similar to floating point numbers, Go offers two [complex number](https://en.wikipedia.org/wiki/Complex_number) types named `complex64` and `complex128`. The first one uses two `float32` floats: one for the real part and the other for the imaginary part of the complex number. A `complex128` is composed of two `float64` parts.

### Numeric Types Example

The use of the numeric types of Go is illustrated in `numeric.go`:

{{< file "numeric.go" go >}}
package main

import (
    "fmt"
)

func main() {
    c1 := -12 + 2i
    c2 := complex(5, 7)
    fmt.Println("Type of c1:\t", c1)
    fmt.Println("Type of c2:\t", c2)

    var c3 complex64 = complex64(c1 + c2)
    fmt.Println("c3:\t\t", c3)
    fmt.Println("Type of c3:\t", c3)

    cZero := c3 - c3
    fmt.Println("cZero:\t\t", cZero)

    x := 12
    k := 7
    fmt.Println("Type of x:\t", x)

    div := x / k
    fmt.Println("Integer division generates an integer:", div)
    fmt.Println("Convert to float64:", float64(x)/float64(k))

    var m, n float64
    m = 1.223
    fmt.Println("m, n:\t\t", m, n)

    y := 4 / 2.3
    fmt.Println("y:\t\t", y)

    divFloat := float64(x) / float64(k)
    fmt.Println("divFloat:\t", divFloat)
    fmt.Println("Type of divFloat:", divFloat)
}
{{< /file >}}

The output of `numeric.go` will be as follows:

    go run numeric.go

{{< output >}}
Type of c1:      (-12+2i)
Type of c2:      (5+7i)
c3:              (-7+9i)
Type of c3:      (-7+9i)
cZero:           (0+0i)
Type of x:       12
Integer division generates an integer: 1
Convert to float64: 1.7142857142857142
m, n:            1.223 0
y:               1.7391304347826086
divFloat:        1.7142857142857142
Type of divFloat: 1.7142857142857142
{{< /output >}}

- Lines 8-18 show how to work with complex numbers. Line 8 shows how to use the shorthand syntax to declare a complex number, and line 9 shows how to use the [built in `complex` function](https://golang.org/pkg/builtin/#complex).

    {{< note respectIndent=false >}}
Please note that the shorthand syntax for a complex number is `-12 + 2i`, not `-12 + 2 * i`. The incorrect statement would tell Go that you want to perform an addition and a multiplication using a variable named `i`. If there is no numeric variable named `i` in the current scope, this statement will create a syntax error and the compilation of your Go code will fail. However, if a numeric variable named `i` exists, the calculation will be successful, but you will not get the desired complex number as the result.
{{< /note >}}

- Line 26 demonstrates how to divide two integers and receive a float by first converting them into floats.

## Arrays

Arrays store an ordered list of values that are all of the same type:

-   An array is defined with the length of the array and the type of its elements. This syntax will declare an array that can store four `int` values:

    {{< file "" go >}}
var anArray [4]int
{{< /file >}}

-   You can define an array with pre-defined elements by using the array literal syntax, where the values are specified in curly braces after the type:

    {{< file "" go >}}
anArray := [4]int{1, 0, 0, -4}
{{< /file >}}

    {{< note respectIndent=false >}}
An array's type is composed of both its length and its elements' type. This means that when using the array literal syntax, you must supply the length of the array in the declaration. If you don't (for example, by writing `[]int{1, 0, 0, -4}`), you will create a [slice](#slices), not an array.

Having said that, the Go compiler provides a convenience syntax which will count the items in your array literal for you:

{{< file "" go >}}
anArray := [...]int{1, 0, 0, -4}
{{< /file >}}
{{< /note >}}

-   The index of the first element an array is `0`.

-   The length of an array is specified at its declaration and cannot change.

-   You can access an element in an array or assign a value to it with the `anArray[index]` syntax:

    {{< file "" go >}}
anArray := [4]int{1, 0, 0, -4}
// Prints "-4"
fmt.Println(anArray[3])

anArray[3] = -5
// Prints "-5"
fmt.Println(anArray[3])
{{< /file >}}

    {{< note respectIndent=false >}}
If you try to access an array element or a [slice](#slices) element that does not exist, your program will crash. This is called an *out-of-bounds error*. The same thing will happen if you use a negative index number. The good thing is that the Go compiler will catch that kind of error.
{{< /note >}}

-   Last, you can find the length of an array using the `len()` function:

    {{< file "" go >}}
anArray := [4]int{1, 0, 0, -4}
// Prints "4"
fmt.Println(len(anArray))
{{< /file >}}

### Multi-Dimensional Arrays

An array's elements can also be arrays, and you can create multi-dimensional arrays as a result. Here's an example of multi-dimensional arrays:

{{< file "multiDimensionalArrays.go" go >}}
package main

import (
    "fmt"
)

func main() {
    oneDimension := [5]int{-1, -2, -3, -4, -5}
    twoDimension := [4][4]int{{1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12}, {-13, -14, -15, -16}}
    threeDimension := [2][2][2]int{ {{1, 0}, {-2, 4}}, {{5, -1}, {7, 0}} }

    fmt.Println("The length of", oneDimension, "is", len(oneDimension))
    fmt.Println("The first element of twoDimension (", twoDimension, ") is", twoDimension[0][0])
    fmt.Println("The length of threeDimension (", threeDimension, ") is", len(threeDimension))

    fmt.Println("\nIterating through threeDimension: ")
    for _, topLevelArray := range threeDimension {
        for _, secondLevelArray := range topLevelArray {
            for _, thirdLevelArray := range secondLevelArray {
                fmt.Print(thirdLevelArray, " ")
            }
        }
        fmt.Println()
    }
}
{{< /file >}}

Executing `multiDimensionalArrays.go` will generate the following output:

    go run multiDimensionalArrays.go

{{< output >}}
The length of [-1 -2 -3 -4 -5] is 5
The first element of twoDimension ( [[1 2 3 4] [5 6 7 8] [9 10 11 12] [-13 -14 -15 -16]] ) is 1
The length of threeDimension ( [[[1 0] [-2 4]] [[5 -1] [7 0]]] ) is 2

Iterating through threeDimension:
1 0 -2 4
5 -1 7 0
{{< /output >}}

{{< note respectIndent=false >}}
This example uses the `range` keyword and `for` loops to iterate through the elements of the `threeDimension` array. For more information on how to use loops in Go, review our [functions, loops, and errors guide](/docs/guides/learning-go-functions-loops-and-errors-a-tutorial/).
{{< /note >}}

### Disadvantages of Arrays

Go arrays have some disadvantages, and you may decide to not use them in your Go projects:

- Once you define an array, you cannot change its size.

- If you need to add an element to an existing array that has no space left, you will need to create a bigger array and copy all the elements of the old array to the new one.

- When you pass an array to a function as a parameter, you actually pass a copy of the array, which means that any changes you make to an array inside a function will be lost after the function exits.

- Last, passing a large array to a function can be slow because Go has to create a copy of the array.

Instead of using arrays, you will more often use [slices](#slices).

## Slices

Go *slices* are similar to arrays, but with fewer limitations in their usage. For example, slices can expand and shrink dynamically. You can add new elements to an existing slice using the `append()` function:

{{< file "" go >}}
aSliceOfStrings = append(aSliceOfStrings, "another element", "one more element")
{{< /file >}}

While an array's type is defined by both its length and its elements' type, a slice's type is only defined by its elements' type:

{{< file "" go >}}
// Creates a nil slice of integers
var aSliceOfInts []int

// Create a slice of strings with the slice literal syntax:
aSliceOfStrings := []string{"first string", "second string", "third string"}
{{< /file >}}

Importantly, **a slice actually references an array** that Go maintains internally.
Unlike arrays, slices are *passed by reference* to functions, which means that what is actually passed is the memory address of the slice value (*a pointer*). Any modifications you make to the elements of a slice inside a function will not be lost after the function exits. Moreover, passing a large slice to a function is significantly faster than passing an array with the same number of elements because Go will not have to make a copy of the slice.

### The Slice Operator

A slice can be formed from an existing array or from other slices by using the slice operator syntax, also referred to as *slicing*. The resulting slice will be a segment of the original array or slice:

-   To use the slice operator, pass a starting and ending index within square brackets, separated by a colon:

    {{< file "" go >}}
anArray := [4]string{"Go", "Data", "Types", "Tutorial"}
var aSlice []string = anArray[1:3]

// Prints [Data Types]
fmt.Println(aSlice)
{{< /file >}}

    {{< note respectIndent=false >}}
Note that the element at the ending index is not included in the resulting slice.
{{< /note >}}

-   When creating a new slice from an existing array or slice, the new slice will actually reference the original array, or the internal array of the original slice. This means that if you update an element of the new slice, **you will also update that element in the original array or slice**:

    {{< file "" go >}}
anArray := [4]string{"Go", "Data", "Types", "Tutorial"}
var aSlice []string = anArray[1:4]
aSlice[2] = "Guide"

// Prints [Go Data Types Guide]
fmt.Println(anArray)
{{< /file >}}

    {{< note respectIndent=false >}}
Note that the element at `aSlice[2]` is equal to the element at `anArray[3]`. This is because `aSlice` starts at the second element of `anArray` (see line 2).
{{< /note >}}

-   When creating a slice, you can omit the starting or ending index. Omitting the starting index will make the resulting slice start from the beginning of the original array or slice (line 3 below). Omitting the ending index will make the resulting slice end with the last element of the original array or slice (line 7 below):

    {{< file "" go >}}
aSlice := []string{"Go", "Data", "Types", "Tutorial"}

var goDataTypesSlice []string = aSlice[:3]
// Prints [Go Data Types]
fmt.Println(goDataTypesSlice)

dataTypesTutorialSlice := aSlice[1:]
// Prints [Data Types Tutorial]
fmt.Println(dataTypesTutorialSlice)
{{< /file >}}

-   You can also omit both the starting and ending indices, which will make a new slice with the same elements as the original array or slice:

    {{< file "" go >}}
aSlice := []string{"Go", "Data", "Types", "Tutorial"}
anotherSlice := aSlice[:]

// Prints [Go Data Types Tutorial]
fmt.Println(anotherSlice)
{{< /file >}}


### The Length and Capacity of a Slice

The *length* of a slice is the same as the length of an array with the same number of elements, and it can be found using the `len()` function. The *capacity* of a slice is the current room that has been allocated for a slice, which can be found with the `cap()` function and may be greater than the length.

{{< note respectIndent=false >}}
Arrays do not have a capacity property.
{{< /note >}}

If a slice runs out of room and you append a new element to it, Go automatically creates a new slice with a higher capacity to make room for even more elements. This is illustrated in the following code:

{{< file "capacity.go" go >}}
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

### Creating Slices with make()

The `make()` function allows you to create empty slices with a desired *length* and *capacity*. `make()` accepts three parameters, in this order:

- The data type of the slice
- The length of the slice
- The capacity of the slice, which is optional. If omitted, the capacity of the slice will be the same as its length.

For example, you can create a new empty slice for five integers with:

{{< file "" go >}}
aSlice := make([]int, 5)

// Prints [0 0 0 0 0]
fmt.Println(aSlice)
{{< /file >}}

Note that Go automatically initializes the elements of an empty slice to the zero value of the elements' type. This means that the value of the initialization depends on the type of the object stored in the slice. For integers, the zero value is `0`.

As you will see in a while, `make()` can also create [maps](#maps) in Go.

### Slices Example

Here's a Go program that illustrates the use of slices:

{{< file "slices.go" go >}}
package main

import (
    "fmt"
)

func main() {
    aSlice := []int{1, 2, 3, 4, 5}
    fmt.Println("aSlice:\t\t", aSlice)
    integers := make([]int, 2)
    fmt.Println("integers:\t", integers)
    integers = nil
    fmt.Println("integers:\t", integers)
    fmt.Println()

    anArray := [5]int{-1, -2, -3, -4, -5}
    sliceFromArray := anArray[:]
    fmt.Println("anArray:\t",anArray)
    fmt.Println("sliceFromArray:\t", sliceFromArray)
    anArray[4] = -100
    fmt.Println("Updating fourth element of sliceFromArray...")
    fmt.Println("sliceFromArray:\t", sliceFromArray)
    fmt.Println("anArray:\t", anArray)
    fmt.Println()

    s := make([]byte, 5)
    fmt.Println("Byte slice:\t", s)
    fmt.Println()

    twoDSlice := make([][]int, 3)
    fmt.Println("twoDSlice:\t",twoDSlice)
    fmt.Println("Adding elements to twoDSlice...")
    for i := 0; i < len(twoDSlice); i++ {
        for j := 0; j < 2; j++ {
            twoDSlice[i] = append(twoDSlice[i], i*j)
        }
    }
    for _, secondLevelSlice := range twoDSlice {
        fmt.Println(secondLevelSlice)
    }
}
{{< /file >}}

Executing `slices.go` will generate the following output:

    go run slices.go

{{< output >}}
aSlice:          [1 2 3 4 5]
integers:        [0 0]
integers:        []

anArray:         [-1 -2 -3 -4 -5]
sliceFromArray:  [-1 -2 -3 -4 -5]
Updating fourth element of sliceFromArray...
sliceFromArray:  [-1 -2 -3 -4 -100]
anArray:         [-1 -2 -3 -4 -100]

Byte slice:      [0 0 0 0 0]

twoDSlice:       [[] [] []]
Adding elements to twoDSlice...
[0 0]
[0 1]
[0 2]
{{< /output >}}

- Lines 16-24 demonstrate creating a slice from an array and the manipulating the elements of the array from the slice. The `sliceFromArray := anArray[:]` syntax is a quick and common way to get another reference to an array.

- Lines 30-40 show that slices can also be multi-dimensional, like arrays.

### Sorting Slices using sort.Slice()

Go provides the `sort.Slice()` function for sorting slices, which is illustrated in `sortSlice.go`:

{{< file "sortSlice.go" go >}}
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

    fmt.Println("Unsorted:\t\t", mySlice)

    sort.Slice(mySlice, func(i, j int) bool {
        return mySlice[i] < mySlice[j]
    })
    fmt.Println("Ascending order:\t", mySlice)

    sort.Slice(mySlice, func(i, j int) bool {
        return mySlice[i] > mySlice[j]
    })
    fmt.Println("Descending order:\t", mySlice)
}
{{< /file >}}

Executing `sortSlice.go` will create the following output:

    go run sortSlice.go

{{< output >}}
Unsorted:                [90 45 45 50 0]
Ascending order:         [0 45 45 50 90]
Descending order:        [90 50 45 45 0]
{{< /output >}}

The `sort.Slice()` function rearranges the elements in the slice according to a sorting function that you provide. The sorting function defines the way any two elements in the slice should be ordered. This function is passed as an argument to `sort.Slice()`.

If a slice contains numeric values or strings, then sorting them is straightforward because the `<` and `>` operators can be used in the sorting function. If you want to sort a slice of [structures](/docs/guides/go-structures/) based on a given structure field, then the implementation of the sorting function will be slightly more complex.

### Appending an Array's Elements to a Slice

You can append an array's elements to an existing slice:

{{< file "appendA2S.go" go >}}
package main

import (
    "fmt"
)

func main() {
    anArray := [3]int{14, 15, 16}
    aSlice := []int{-1, -2, -3}
    fmt.Println("aSlice:\t\t\t\t", aSlice)
    fmt.Println("anArray:\t\t\t", anArray)

    sliceFromArray := anArray[:]
    fmt.Println("sliceFromArray:\t\t\t", sliceFromArray)
    fmt.Println()

    aSlicePlusSliceFromArray := append(aSlice, sliceFromArray...)
    fmt.Println("aSlice + sliceFromArray:\t", aSlicePlusSliceFromArray)

    aSlicePlusSameSlice := append(aSlice, aSlice...)
    fmt.Println("aSlice + aSlice:\t\t", aSlicePlusSameSlice)
}
{{< /file >}}

The output of `appendA2S.go` will be the following:

    go run appendA2S.go
{{< output >}}
aSlice:                          [-1 -2 -3]
anArray:                         [14 15 16]
sliceFromArray:                  [14 15 16]

aSlice + sliceFromArray:         [-1 -2 -3 14 15 16]
aSlice + aSlice:                 [-1 -2 -3 -1 -2 -3]
{{< /output >}}

-    The program defines an array named `anArray` and a slice named `aSlice`.

-    Before you can append an array to a slice, you first need to create another slice from the array (line 13).

-    Then, we create a new slice named `aSlicePlusSliceFromArray` that contains the elements of `aSlice` and `anArray`. This is done by *unpacking* `sliceFromArray` and passing it to the `append()` function (line 18).

    -   The syntax for unpacking is the name of the slice followed by three dots: `sliceFromArray...`

    -   Unpacking separates the elements of `sliceFromArray` into individual arguments that are passed to the `append()` function.

    -   This unpacking is performed because `append()` is a [*variadic* function](/docs/guides/learning-go-functions-loops-and-errors-a-tutorial/#variadic-functions).

-    Line 21 shows that a slice can be appended to itself.


## Maps

Like arrays and slices, Go *maps* store collections of values, and maps are equivalent to the *hash tables* found in other programming languages. The main advantage of maps over arrays or slices is that they can use any data type as their index, while arrays or slices are always indexed with integers. A map's index is called a *map key* or just a *key*.

Although Go maps do not exclude any data types from being used as keys, for a data type to be used as a key, it must be comparable to other values of the same type. This means that the Go compiler must be able to differentiate one key from another. In other words, the keys of a map must support the `==` and `!=` operators.

{{< note respectIndent=false >}}
While the `bool` data type is comparable, using it for the keys to a map will limit your options, as `true` and `false` are the only values available.
{{< /note >}}

-   A map's type is defined by its keys' type and its values' type:

    {{< file "" go >}}
// Creates a nil map with strings as the keys and integers as the values:
var aMapOfStringsToIntegers map[string]int
{{< /file >}}

-   You can create an initialized, empty map with `string` keys and `int` values with the help of the `make()` function:

    {{< file "" go >}}
// Creates an initialized map with strings as the keys and integers as the values:
aMapOfStringsToIntegers := make(map[string]int)
{{< /file >}}

-   You can access an element in a map or assign a value to it with the `aMap[key]` syntax:

    {{< file "" go >}}
aMap := make(map[string]int)
aMap["one"] = 1
// Prints "1"
fmt.Println(aMap["one"])
{{< /file >}}

    {{< note respectIndent=false >}}
You can add elements to a Go map without the need for an `append()` function like you did for slices.
{{< /note >}}

### Maps Example

The presented example shows how you can work with Go maps:

{{< file "maps.go" go >}}
package main

import (
    "fmt"
)

func main() {
    mapA := make(map[string]int)
    mapA["k1"] = 12
    mapA["k2"] = 13
    fmt.Println("mapA:", mapA)
    fmt.Println()

    mapB := map[string]int{
        "k1": 12,
        "k2": 13,
    }

    fmt.Println("mapB:", mapB)
    fmt.Println("Deleting key `k1` from mapB...")
    delete(mapB, "k1")
    delete(mapB, "k1")
    fmt.Println("mapB:", mapB)
    fmt.Println()

    fmt.Println("Checking if the `doesItExist` key exists in mapA...")
    _, ok := mapA["doesItExist"]
    if ok {
        fmt.Println("Exists!")
    } else {
        fmt.Println("Does NOT exist")
    }
    fmt.Println()

    fmt.Println("Iterating through keys and values of mapA...")
    for key, value := range mapA {
        fmt.Println(key, ":", value)
    }
}
{{< /file >}}

The output of `maps.go` will resemble the following:

    go run maps.go
{{< output >}}
mapA: map[k1:12 k2:13]

mapB: map[k1:12 k2:13]
Deleting key `k1` from mapB...
mapB: map[k2:13]

Checking if the `doesItExist` key exists in mapA...
Does NOT exist

Iterating through keys and values of mapA...
k1 : 12
k2 : 13
{{< /output >}}

-   Lines 8-11 show the creation of a map with the `make()` function, and how `fmt.Println()` will display the map.

-   Go also supports maps literals, which is illustrated in the definition of the `mapB` map on lines 14-17.

-   You can delete an element of a map using the `delete()` function, as shown on lines 19-23. The `delete()` function can be called for a key that does not already exist without generating an error, as shown on line 22.

-   The program also contains a technique that allows you to find out whether a key exists in a map or not, demonstrated on lines 26-32:

    -   The `mapA["doesItExist"]` statement can return two things:

        1. The value in the map at the specified key (stored in Go's [*blank identifier*](https://golang.org/doc/effective_go.html#blank) (`_`) in this example).

        1. A boolean value that represents whether the key exists in the map at all (stored in the variable `ok` in this example).

    -   If `ok` is `true`, then the `doesItExist` key exists, which means that there is a value stored at `mapA["doesItExist"]`.

    -   If `ok` is false, then the key doesn't exist. When this is the case, the zero value of the map's value type is set in the first returned value. Because the above example stores the first returned value in the blank identifier, it is discarded.

-   Lines 35-38 demonstrate that you cannot make any assumptions about the order the map pairs are going to be displayed on your screen because that order is random.

## Next Steps

If you haven't visited them yet, then our [Learning Go Functions, Loops, and Errors](/docs/guides/learning-go-functions-loops-and-errors-a-tutorial/) and [Structs in Go](/docs/guides/go-structures/) tutorials are good next steps when learning Go. Afterwards, other advanced topics are covered in the [Go](/docs/development/go/) section of our library.