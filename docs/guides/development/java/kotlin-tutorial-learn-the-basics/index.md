---
slug: kotlin-tutorial-learn-the-basics
description: 'This Kotlin tutorial covers variables, functions, string templates, and classes. It uses code examples to cover the basics of the Kotlin programming language syntax.'
keywords: ['kotlin tutorial','kotlin function','kotlin class']
tags: ['java']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-19
modified_by:
  name: Linode
title: "Kotlin Tutorial: An Introduction to the Basics"
title_meta: "Kotlin Tutorial: Learn the Basics"
authors: ["John Mueller"]
---

Kotlin is a new cross-platform, statically typed, general-purpose programming language. It was originally created in 2011 by [JetBrains](https://www.jetbrains.com/) and was initially released in 2016. It relies on the Java Virtual Machine (JVM), just like Java, but there are significant differences that you can learn about in our [Kotlin vs Java guide](/docs/guides/kotlin-vs-java-understanding-their-differences/). One of the most interesting differences is that you can compile Kotlin to output JavaScript, Android, and Native (which runs on iOS). In 2019, Google announced that Kotlin is now the preferred language for all Android development. This Kotlin tutorial provides you basics to help you no matter what type of output you need. You also learn how to work with Kotlin variables, Kotlin strings, Kotlin arrays, Kotlin lists, Kotlin collections, Kotlin functions. And finally, you develop a simple Kotlin class.

{{< note respectIndent=false >}}
To execute the Kotlin code snippets demonstrated in this guide, you can use the [Kotlin online playground](https://try.kotlinlang.org/). Or, if you are using an IDE like Android Studio or IntelliJ, you can install the [Kotlin plugin](https://kotlinlang.org/docs/install-eap-plugin.html).
{{< /note >}}

## Declaring Kotlin Variables

Variables store data. A variable provides a name to a specific piece of memory that contains data you can use in your code. Kotlin variables come in several types that have different characteristics. To use any variable, you must declare it so that the compiler knows to set the required memory aside and how to configure that memory for use. Variables in Kotin can be declared using two different keywords–`val` and `var`.

- `val`: Used for a variable whose value never changes and cannot be reassigned to a variable that was declared.
- `var`: Used for a variable whose value changes frequently.

The following sections describe variables and their uses in more detail.

### Understanding Variables

Kotlin variables vary by type and by the actions you can perform with them. In many cases, the compiler only needs a variable declaration and the data its value to determine its type. The actions you can perform on variables are determined by a combination of the **variable types** and the **operators** you choose to use. The following sections discuss Kotlin variable types and operators.

#### Kotlin Variable Types

Even if you don’t specifically assign a type to a variable, Kotlin variables always receive a type. In many cases, that type is assigned for you by the compiler. For example, the line of code below produces a Kotlin variable of the `Int` type even though you don’t declare it as `Int`.

    var MyInt = 3

The variable with the name `MyInt` now contains an `Int` value of `3`. Sometimes a different type is needed and you can specify it as part of the declaration. For example, the following line of code defines `MyInt` as type `Long`.

    var MyInt: Long = 3

To verify that `MyInt` is actually type `Long` and not type `Int`, you can use the `is` keyword with `println()`, as show below:

    fun main() {
      var MyInt: Long = 3
      println(MyInt is Long)    //prints true
    }

The [`is` keyword](https://kotlinlang.org/docs/keyword-reference.html) helps you determine the variable type. Sometimes the result of defining a variable type as part of the declaration produces unexpected results. For example, declare a variable as type `Float`.

    var MyFloat: Float = 3
    var MyFloat: Float = 3.0

Using either of the above lines of code results in the following error:

{{< output >}}
The integer literal does not conform to the expected type Float
{{</ output >}}

The first case tries to assign what Kotlin views as an `Int` to a `Float`. The second case tries to assign what Kotlin views as a `Double` to a `Float`. To make this declaration work, you must update the line of code as follows:

    var MyFloat: Float = 3.0f

The addition of `f` to `3.0` changes the value from a `Double` to a `Float`. You must specifically add the `f` to declare the variable as a `Float`. Shorten the declaration to look as follows:

    var MyFloat = 3.0f

Assignments of numbers need not appear in decimal form. You can also use binary and hexadecimal input as shown below:

    var MyBin = 0b0110_1100
    var MyHex = 0xFF

Binary values appear with a `0b` prefix, while hexadecimal values appear with a `0x` prefix. It’s possible to use underscores to separate groups of numbers when making an assignment. This makes long sequences of numbers easier to read. Kotlin variables support [other types](https://kotlinlang.org/docs/basic-types.html) as well.

#### Employing Operators With Variables

Kotlin operators determine how variables interact with data and other variables. The assignment operator (`=`) appears several times in the guide so far. It places a value into a variable. Using augmented assignment operators, `+=`, `-=`, `*=`, `/=`, `%=`, saves coding time and space. For example, `A += 2` adds `2` to the value currently found in `A`.

Kotlin also supports the common math operators: `+`, `-`, `*`, `/`, and `%`. The following code assigns a value of `1` to `A`, a value of `2` to `B`, and outputs the addition of the two variables, which is `3`.

    var A = 1
    var B = 2
    println(A + B)

The special modulus operator, `%`, returns the remainder in integer division. For example, `println(5 / 3)` returns a value of `1`, while `println(5 % 3)` returns a value of `2`.

You can increase a variable's value using the increment (`++`) operator. For example, `println(A++)` returns a value of `2` when `A `contains a value of `1`.

Unary operators appear in a number of ways, such as the unary not (`!`) operator where `println(!true)` results in an output of `false`.

There is no ternary operator in Kotlin as you might find in other languages. For example, the condition `? then : else` construction isn’t available. You can use the `if..else` expression to achieve the same result:

    var max: Int
    if (a > b) {
        max = a
        print ("A is Greater")
    } else {
        max = b
        print ("B is Greater")
    }

Assuming `A` is equal to `1` and `B` is equal to `2`, the output is `B is Greater`. Note the use of the comparison "greater than" operator (`>`).

Kotlin supports the usual logical operators: `&&`, `||`, `!`, comparison operators: `<`, `>`, `<=`, `>=`, equality operators: `==`, `!=`, and referential equality operators: `===`, `!==`. A referential equality operator determines whether two variables point to the same object, rather than whether they have the same value. Refer Kotlin’s [other standard operators](https://kotlinlang.org/docs/keyword-reference.html#operators-and-special-symbols) for more information.

{{< note respectIndent=false >}}
Something not mentioned in the standard reference (at least with the operators) is the use of the bitwise and bitshift operators. The bitwise operators perform operations on variables at the bit level and include `or`, `and`, `xor`, and the `inv()` function.
{{< /note >}}

The `inv()` function looks a bit odd until you think about what task it performs. For example, you can type `println(1.inv())` and see a legitimate output of `-2`. The input value of `0001` is inverted to appear as `1110`, or `-2`.

The bitshift operators shifts bits left (`shl`), right (`shr`), or unsigned right (`ushr`). For example, `println(1 shl 2)` means to shift the bit value `0001` left two places resulting in `0100` or a value of `4`.

### Using Mutable Variables

All of the variables used in this guide so far are mutable, which means the application can change them directly. Any variable declared using the `var` keyword is mutable.

### Using Read-only Variables

Kotlin read-only variables can receive a value at the time of creation, but an application can’t change the value directly later. The following sections describe read-only variables in more detail.

#### Declaring and Using a Read-only Variable

To declare a read-only variable, use the `val` keyword, instead of the `var` keyword. In the following example, the application defines `A` as having a value of `4` at the time of creation. The attempt to change the value to `5` results in an error:

    val A = 4  // A is assigned a value of 4.
    A = 5      //Produces an error message - val cannot be reassigned

#### Differentiating Between Read-only and Immutable

There is some confusion between read-only and immutable. A Kotlin read-only variable isn’t immutable, which means that its value could never change. The computed value of a read-only variable can change. To understand what this means, consider the following example of the `Square` class.

{{< file "variables_example.kt" kotlin >}}
fun main() {
  var MySquare = Square()
  println("The value of Area is: ${MySquare.area}")

  MySquare.width = 4
  MySquare.height = 5

  println("The value of Area is: ${MySquare.area}")
}

class Square {
  var width: Int = 2
  var height: Int = 4
  val area: Int
    get() {
      return (width * height)
    }
}

{{</ file >}}

If an application attempts to directly assign a value to `area`, Kotlin produces an error message, just as it does for any read-only variable. However, when you view the output from the above example code, you see the value of `area` does change during application execution as shown below:

{{< output >}}
The value of Area is: 8
The value of Area is: 20
{{</ output >}}

The value of `area` is computed within the `Square` class for this reason the value of `area` changes. However, a direct assignment of `area` is not possible.[Classes](/docs/guides/kotlin-tutorial-learn-the-basics/#declare-a-kotlin-class) are discussed in more detail later in this guide.

The same thing holds true, but in a different way, for read-only variables that contain a [lambda function](https://kotlinlang.org/docs/lambdas.html) like in the following example:

    val DoAdd: (Int, Int) -> Int = {A, B -> A + B}

When an application processes `println(DoAdd(1, 2))` and receives an output of `3`, the read-only variable `DoAdd()` is the same. What is different is the calculated value of the lambda expression.

## Kotlin String Templates

Strings form an important part of any application. Kotlin supports a variety of string formation types that include *string literals* and *string templates*. Within these two categories are escaped strings and raw strings. The following sections discuss the various string permutations within Kotlin, focusing on Kotlin string templates.

### String Literals

A string literal is one in which the entire value of the string appears as part of the assignment. Consider the following example:

{{< file "string_literal_example.kt" kotlin>}}
fun main() {
  var MyEscapedString = "Hello\nWorld!"
  println("Example of Escaped String: ${MyEscapedString}")

  var MyRawString = """Hello
  World!"""
  println("Example of Raw String: ${MyRawString}")
}
{{</ file >}}

In the above example, the first form of string literal (i.e., the variable, `MyEscapedString`) is an escaped string, where special codes, such as `\n`, perform formatting. The second form of string literal (i.e., the variable, `MyRawString`) is a raw string. In a raw string, the actual appearance of the string performs the formatting and no escape characters are used. The output for `MyRawString` has `Hello` appear on the first line, and `World!` appears on the second line. Raw string literals are always contained within triple quotes as shown in the example above.

{{< output >}}
Example of Escaped String: Hello
World!
Example of Raw String: Hello
    World!
{{</ output >}}

Kotlin supports the following escape sequences:

- `\t` - Tab
- `\b` - Backspace
- `\n` - Newline
- `\r` - Carriage return
- `\'` - Single quote character
- `\"` - Double quote character
- `\\` - Backslash
- `\$` - Dollar character

### Creating and Using String Templates

String templates are string literals that store a specific expression. A string template can contain variables, which Kotlin then evaluates and displays the variable's value. For example, the code below makes use of the string template `$A` and `$B`.

    var A = 1
    var B = 2
    var Total = A + B
    println("The sum of $A plus $B is $Total.")

When this code is executed, it displays the following string: `The sum of 1 plus 2 is 3.`. The `$` that appears before each of the variable names tells Kotlin to evaluate the variable and provide its value as output. If the application attempts to provide a variable that doesn't exist, Kotlin outputs an error message. The error message can be a little confusing, because it mentions initializing the variable. It’s not possible to initialize any variable within a string template; the variable must exist before you use it in the string template.

### Working with Expressions in String Templates

In addition to working with variables in a string template, it’s also possible to work with expressions. For example, the following code also prints the sum of `A` and `B` from the previous section, but it does so using an expression:

    var A = 1
    var B = 2
    println("The sum of $A plus $B is ${A + B}.")

In this case, a pair of curly brackets enclose an expression that performs the required math instead of performing it outside of the string template. Using this approach can make your application faster, easier to understand, and far less prone to errors. The expressions used within a string template can perform any task. For example, the following code determines whether the string `Str` contains the word "hello" in it.

    var Str = "hello there!"
    println("Str contains the word \"hello\": ${Str.contains("hello")}.")

{{< note respectIndent=false >}}
Refer to [Kotlin's documentation](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) to view all the string functions supported by Kotlin.
{{< /note >}}

### Using Raw String Templates

As with string literals, you can use raw string templates. This approach is most useful when the string contains characters that you normally escape. The following code, based on the example in the previous section, works well, and avoids the use of escaped characters.

    println("""Str contains the word "hello": ${Str.contains("hello")}.""")

## Create a Kotlin Array

A Kotlin array stores a set of values and provides a method to access each value as needed. Kotlin arrays rely on the underlying Java JVM. For this reason creating and using arrays in Kotlin is the same as it is in Java. Arrays make it possible to store a group of values in a single variable, rather than individually. This makes code easier to read and less error-prone. The following sections discuss the use of arrays in Kotlin.

### Declaring a Kotlin Array

Unless you specify otherwise, you can mix data types in a Kotlin array. For example, you can declare the following array with mixed value types.

    val Stuff = arrayOf("Hello", 3, true, 4.5)

A Kotlin array is a fixed size, so you normally declare it using `val`. The `arrayOf()` function creates the array for you. In this case, the array contains a variety of value types.

### Making the Array a Specific Type

You can also ensure an array contains data of a specific type. There are several options to make this happen. The first is to declare the data type as shown below:

    val Places = arrayOf<String>("Mountain", "Ocean", "Farm", "City")

Because this call to `arrayOf<String>()` includes a data type, any attempt to add another data type to the array causes an error message.

Kotlin also provides a number of factory methods to create arrays of primitive types.

- `byteArrayOf()`
- `charArrayOf()`
- `shortArrayOf()`
- `intArrayOf()`
- `longArrayOf()`

For example, you can declare an array of integers in the following way:

    val Numbers = intArrayOf(1, 2, 3, 4, 5)

### Iterate Through a Kotlin Array

An array provides a zero-based index to each member of the array. Consequently, the first member of the array is at index `0`, while the last member of the array is the size of the array minus `1`. The last value in an array of size 4 would have an index of `3`. Using the `Places` array created in the previous section, the following code outputs a value of `Ocean`.

    println(Places[1])

Notice that the index appears in square brackets behind the variable name. An attempt to access `Places[4]` would result in an error message because the `Places` array contains only four entries.

The more common way to iterate a Kotlin array is with a `for` loop. The following code outputs each of the `Places` array members:

    for (Place in Places) {
      println(Place)
    }

The values appear one at a time where you can perform any operation with the value.

### Using Indexing with Kotlin Arrays

Other languages often provide `for` loops that allow accessing individual values within an array based on an indexing variable. You can mimic this behavior using a number of methods in Kotlin. One way to perform this task is to rely on the `indices` property as shown below (printing only the even index items in `Places`).

    for (i in Places.indices) {
      if (i % 2 == 0) {
        println("Index $i is ${Places[i]}")
      }
    }

Another alternative is to rely on the `withIndex()` function as shown below:

    for ((index, value) in Places.withIndex()) {
      println("$value occupies the $index place in the Places array.")
    }

Kotlin provides a rich mixture of [properties and functions](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/) to use with arrays to achieve specific effects.

### Adding to an Array

Kotlin arrays have a fixed size. Using the various techniques available, you can add a new element to an array using the code shown below:

    var Places = arrayOf<String?>("Mountain", "Ocean", "Farm", "City")
    val temp = arrayOfNulls<String>(Places.size + 1)
    System.arraycopy(Places, 0, temp, 0, Places.size)
    temp[Places.size] = "Valley"
    Places = temp

`Places` is declared as a `var` and it’s also of a nullable `String` type (the `<String?>` part of the declaration means that either a `String` or a `null` value is acceptable). If you declare `Places` as `val`, then you can’t assign a new array to `Places`. The result of this code is that `Places` now contains `Valley` as the last entry and has five elements instead of four. It’s not possible to add directly to a Kotlin array, you must create a temporary array instead.

## Kotlin Collections

In many respects, working with a Kotlin collection is much the same as working with a Kotlin array. You use many of the same techniques with them. Unlike arrays, a Kotlin collection isn’t a direct use of the underlying Java JVM. Instead, it relies on Kotlin interfaces. In addition, the [Kotlin collection](https://kotlinlang.org/docs/collections-overview.html) interfaces act as the parents for three more distinct methods of organizing data (you don’t use collections directly in your code).

- [List](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/): An ordered collection that allows access to members using indices, much the same as an array. A Kotlin list can contain duplicate values and mixed data types (unless you specify a particular data type).

- [Set](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/): An unordered collection that doesn't allow duplicate values. However, a Kotlin set can contain mixed data types unless you specify otherwise. Unlike a list, you can’t use indices to access specific members of a set, but you can use the `withIndex()` method to create index-like access.

- [Map](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/): A key/value pair ordering of data. The key is unique, while the values can be duplicates. Theoretically, you can create both keys and values of mixed data types, but in practice, it’s unlikely to happen due to the problems of attempting to interact with the resulting data structure. The index for a Kotlin map is the key provided when adding the item to the map, so the indices are not guaranteed to be contiguous or in any particular order.

Collections can also be read-only using the [`Collection` interface](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/) or mutable using the [`MutableCollection` interface](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-collection/). The `MutableCollection` interface extends the `Collection` interface and provides additional functions to add, remove, and perform other mutable interactions with the collection.

## Create a Kotlin List

A Kotlin list ensures the order of the data within the list remains the same. Consequently, if you look for the value at index `2`, a list always returns the same value. This is the case unless you’re working with a mutable list and add or remove a value from the list. The list is ordered so you can use indices when working with it. Lists also come in read-only and mutable forms. The read-only list doesn't allow modification of the list after you create it. The mutable list allows modifications including additions, removals, and value changes. The following sections discuss Kotlin lists in more detail.

### Declaring Read-Only Lists

A Kotlin read-only `List` is a specialized form of a `Collection`. Once you declare a read-only list, you can’t modify it in any way. Below is a typical list declaration using a specific data type for entry.

    val Places = listOf<String>("Mountain", "Ocean", "Farm", "City")

If you compare this declaration to the array declaration earlier in the guide, you see that the declarations are almost the same. The only major difference is that you use `listOf()`, rather than `arrayOf()`. All of the same coding examples, like the one shown below, work well.

    for (i in Places.indices) {
      if (i % 2 == 0) {
        println("Index $i is ${Places[i]}")
      }
    }

There are differences between lists and arrays. Even though you can’t resize an array, you can modify its values. In the following code, the change to array element `2` works, but the change to list element `2` doesn't.

    val MyArray = arrayOf(1, 2, 3, 4)
    MyArray[2] = 60
    val MyList = listOf(1, 2, 3, 4)
    MyList[2] = 60

This immutable difference means that a list is more secure than an array because you can depend on list values remaining constant. You can also read list values using an index.

In many cases, a Kotlin list is more convenient. For example, a Kotlin list provides the `containsAll()` method. This method allows checking a list for a list of items (rather than one at a time), while an array doesn't. You also find the `subList()` method that allows creating a new list based on part of the content of an existing list. An advantage to arrays is that it provides more low-level functionality that is hidden when working with a list. Both data structures are important and which you use depends on what you need to achieve in your code.

### Declare Mutable Lists

Kotlin [`MutableList` objects](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/) extend the `List` interface's features by providing additional functionality. It’s now possible to do things like add additional values to the list or to remove unnecessary values without recreating the list. The following code shows how to declare a mutable list:

    var Places = mutableListOf<String>("Mountain", "Ocean", "Farm", "City")

The two big changes are that you use the `var` keyword and rely on the `mutableListOf()` method. The following sections rely on the `Places` mutable list to provide additional insights.

#### Changing, Adding, and Removing Values

Because this list is mutable, you can now do things like change individual elements.

    Places[1] = "Shore"

It’s also possible to extend the list to include other items using the `add()` or `addAll()` methods as shown below:

    Places.add("Resort")
    Places.addAll(mutableListOf("Town", "Sea"))

Adding more than one item requires the creation of a new list of the correct type. When addition is successful, the function returns `true` so that you can verify the addition in your code. As long as the additions are of the correct type, the call succeeds.

Removing items follows the same pattern. You can remove a single item, a group of items, or an item at a particular index as shown below:

    Places.remove("Town")
    Places.removeAll(mutableListOf("Town", "Sea"))
    Places.removeAt(0)

The first two methods return `true` or `false` depending on whether Kotlin found at least one of the items in the list. This is an important consideration for `removeAll()` because even if Kotlin finds one item, it returns `true`, so you can’t be sure all of the items were removed. When working with `removeAt()`, the method returns the value removed, rather than `true` or `false`. This action allows you to verify that the correct value was removed. There is an odd sort of reverse-delete method you can also use, `retainAll()`. Instead of removing specific values, this method retains the values you specify and gets rid of everything else in the list.

#### Sorting Lists

Not all of the methods you can use with lists appear in the interface section of Kotlin's documentation. For example, you find a number of methods to sort a list, but they all require a [comparator](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/). The code below works well even though the `sorted()` method doesn't appear in the interfaces documentation.

    for (item in Places.sorted())
      println(item)

In this case, the [Collection Ordering documentation](https://kotlinlang.org/docs/collection-ordering.html) provides the details you need. The Kotlin documentation is a little less than clear in some cases regarding the use of comparators. For example, to sort by the length of each item in the `Places` list, you use the following code:

    for (item in Places.sortedBy({it.length}))
      println(item)

Notice that the comparator is enclosed in curly brackets, indicating that it’s a lambda expression. The [`it` keyword](https://kotlinlang.org/docs/lambdas.html#it-implicit-name-of-a-single-parameter) refers to a single variable passed to the lambda expression, which is a single list value in this case. The code uses the `length` property of each item in the list as a means of ordering the entries and outputs them in the sorted order.

## Kotlin Functions

A function provides the means to package code for reuse. The following sections detail the use of Kotlin functions.

### Kotlin Built-in Functions

Kotlin provides many functions as part of the language. For example, you use a function when calling `println()` to output data to the display. Kotlin functions appear as part of the standard library. Kotlin functions differ from class methods because you can use these built-in functions directly without instantiating a class. The code is part of the underlying language support. Most Kotlin functions are extensions of Java. For example, the `Kotlin.io.path` package is an extension of the `java.nio.file.Path` package.

### User-Defined Functions

User-defined functions provide the means for a developer to package code for later use. A user-defined function differs from a class method in that the user-defined function is "free-standing". They perform utility tasks, such as a calculation or interacting with the user in some manner. When creating code to interact with data objects, using methods is the preferred approach. The function `Howdy()` is declared using the `fun` keyword as shown below:

    fun Howdy() {
      println("Hello There!")
    }

Even though this is a limited function, it does demonstrate the basic structure of what functions do. `Howdy()` provides a utility-type packaging of code that interacts with the user. Every time you want to greet the user, you can simply add `Howdy()` to your code.

### Create Functions that Accept Parameters

Functions that work as a black box without any input can be powerful, but after a while they demonstrate the limits of not allowing input. The input provided to a function is a *parameter*. Functions can have as many parameters as needed and they can be of any type. The following sections discuss function parameters in more detail.

#### Standard Parameters

When you create a function that accepts parameters, every parameter must appear with a name and a type. For example, you could add a `name` parameter to `Howdy()` to personalize the message as shown below:

    fun Howdy(name: String) {
      println("Hello $name!")
    }

In order to use `Howdy()`, provide a string containing a name, such as `Howdy("Sam")`. The difference between Kotlin and many other programming languages is that Kotlin supports [function overloading](https://kotlinlang.org/spec/overload-resolution.html). If your code contains two versions of `Howdy()`, one that accepts a name and another that doesn't, Kotlin uses the version of `Howdy()` based on the input provided in the application.

#### Default Parameters

In some cases, you may need to ensure that a parameter has a value even if the user doesn't supply one. To accomplish this task, use parameters that have default values assigned to them as shown below:

    fun Howdy(name: String, timeOfDay: String = "Morning") {
      println("Good $timeOfDay $name!")
    }

The example has one standard parameter, `name`, and one default parameter, `timeOfDay`. The function always requires that you provide `name`, but if you don’t provide `timeOfDay`, the function defaults to `Morning` as a value. Consequently, if the application contains `Howdy("Sam")`, Kotlin outputs `Good Morning Sam!` If the application contains `Howdy("Sally", "Afternoon")`, then Kotlin outputs `Good Afternoon Sally!`.

#### Named Parameters

Functions that contain default parameters don’t require that you provide when calling the function. Typing the inputs in order means that you are using positional arguments. Each input appears in its place as part of the function call. When a function contains a number of parameters, it may prove inconvenient to type the inputs you don’t need to change. This is where positional arguments come into place. Consider the example function below:

    fun Howdy(name: String, timeOfDay: String = "Morning", manager: Boolean = true) {
      if (manager)
        println("Good $timeOfDay manager $name!")
      else
        println("Good $timeOfDay $name!")
    }

Assuming it is morning and that the person concerned is a manager, you call this version of `Howdy()` using a named parameter. For example, `Howdy("Jennifer", manager=true)` uses a named parameter. The call skips the `timeOfDay` parameter by naming the `manager` parameter. The output is as expected below:

{{< output >}}
Good Morning manager Jennifer!
{{</ output >}}

### Create Functions that Return Values

Besides accepting parameters as input, a function can also return values after performing a task. It’s good coding practice to return a value, rather than set a global variable in application code with the result of a particular task. This requirement is always the case when performing a calculation but often is also the case when working with the user. This is because the developer may want to control when (or even if) the user sees the output. To provide a return value, you include the return type when declaring the function and use the `return` keyword to return the value as shown below:

    fun Howdy(name: String): String {
      return "Hello $name!"
    }

In this case, `Howdy()` returns a `String`, instead of printing the output itself. To use this version of `Howdy()`, provide a variable to contain the message or output the message immediately. For example, you could output the message using `println()` as shown below:

    println(Howdy("Annie"))

All Kotlin functions provide a return value, but those that don’t specify a return value use a special return value of `Unit`. The `Unit` type is sort of a null value. You can’t do anything with it. If you were to use `println()` with one of the earlier versions of `Howdy()`, `println()` would provide an output of `kotlin.Unit`.

## Declare a Kotlin Class

A Kotlin class goes beyond the code packaging provided by Kotlin functions by embracing the [Object Oriented Programming (OOP)](https://en.wikipedia.org/wiki/Object-oriented_programming) paradigm. This provides the means to package code and data together. It also reduces errors and makes it possible to update code with fewer consequences. OOP is found in most programming languages today because it provides a framework that developers find convenient. The following sections provide a brief overview on how to create and use Kotlin classes.

### Create a Class Body

In its most basic form, a Kotlin class includes the `class` keyword, followed by a class name, and opening, and closing braces, as follows:

    class Rectangle {
    }

Of course, this class wouldn't do much, but you could still create an object from it, such as `var Test = Rectangle()`.

### Provide a Default Constructor

A class always has a primary constructor. If you don’t provide one, then Kotlin provides one that doesn't accept any parameters. However, you can also specify a constructor in the following way:

    class Rectangle(height: Int, width: Int) {
      var Height: Int = height
      var Width: Int = width
      var RectStr: String
      init {
        RectStr = "The rectangle is $height X $width"
      }
    }

To instantiate an object based on `Rectangle`, provide the `height` and `width` values, such as `var Test = Rectangle(2, 4)`. If you provide default values for the two parameters, you could call it using the same strategy as when working with [default parameters and named parameters for functions](/docs/guides/kotlin-tutorial-learn-the-basics/#default-parameters). For example, the class declaration below allows instantiating `Rectangle` without any arguments.

    class Rectangle(height: Int = 2, width: Int = 2) {
      ...
    }

The `height` and `width` parameters are internal to the class. In order to make these parameters publicly available, create fields and make assignments as shown above. A constructor allows the use of `init` blocks that can set property values or perform other tasks during the object instantiation process.

### Add Properties

When working with Kotlin, properties are variables with extra functionality. The previous section shows the `Height`, `Width`, and `RectStr` properties as simple variables. To create a read-only property, declare the variable using the `val` keyword, rather than the `var` keyword.

Kotlin properties allow modification of the *getter* and *setter* for a property so that it becomes possible to perform validation and other tasks. The following version of `Rectangle` class shows range checks for `Height` and `Width` so that the input values don’t become too great or too small. In addition, it automatically updates `RectStr` as needed for height and width changes.

    class Rectangle(height: Int, width: Int) {
      var Height: Int = height
        set(value) {
          if (value < 1 || or value > 40)
            Throw IllegalArgumentException("Height must be between 1 and 40.")
          }
      var Width: Int = width
        set(value) {
          if (value < 1 || or value > 40)
            Throw IllegalArgumentException("Width must be between 1 and 40.")
          }
      var RectStr: String
        get() = "The rectangle is $height X $width"
      init {
        RectStr = "The rectangle is $height X $width"
      }
    }

### Class Methods

Instance methods (those that are accessed from a class instance) in Kotlin classes are functions. You declare them precisely the same way as any function you create, except that the function appears within the class body. The same rules and features apply to methods as they do to functions.

Static methods require the use of companion objects. A static method is one you can call directly from the class without creating an instance first. Here is an example of a static method:

    class TestStatic {
      companion object Test {
        fun SayHowdy() {
          println("Hello There!")
        }
      }
    }

To use the `SayHowdy()` method, call it from `TestStatic` class using `TestStatic.SayHowdy()`. Static methods normally see the use for tasks that affect the class as a whole, rather than a particular class instance.

## Conclusion

This guide provides the basics of the Kotlin language. Kotlin is a robust language used for a wide variety of needs. It simplifies much of the functionality that Java provides, reduces errors, and speeds development. Kotlin also provides a significant level of flexibility in developing code for a variety of needs and environments. If you are not as familiar with Java, read our [Kotlin vs. Java: Key Differences](/docs/guides/kotlin-vs-java-understanding-their-differences/) to understand how the two languages compare.
