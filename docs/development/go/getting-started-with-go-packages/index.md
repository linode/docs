---
author:
  name: Kamesh Balasubramanian
  email: kamesh@wirecog.com
description: 'Learn how to get started with using Go packages.'
keywords: ["go","golang","packages","init","exported","unexported"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-04-01
modified: 2018-04-01
modified_by:
  name: Linode
title: 'Getting Started with Go Packages'
contributor:
  name: Kamesh Balasubramanian
  link: https://twitter.com/EngineerKamesh
external_resources:
  - '[A Tour of Go](https://tour.golang.org)'
  - '[The Go Standard Library](https://golang.org/pkg/)'
  - '[Go Essentials for Full Stack Web Development](https://www.packtpub.com/web-development/go-essentials-full-stack-web-development-video)'
  - '[Isomorphic Go](https://isomorphicgo.org)'
---

# Getting Started with Go Packages

## Introduction

Go is a compiled, statically typed programming language developed by Google. Many modern applications, including Docker, Kubernetes, and Caddy, are written in Go.

Go packages allow developers to organize and reuse Go code in a simple and maintainable manner. Using and declaring Go packages are essential tasks that are performed when writing Go programs. This guide will demonstrate and help you to understand how to create and use Go packages.

## Before You Begin

If you haven't installed Go on your server yet, follow the instructions from the [Install Go on Ubuntu](/docs/development/go/install-go-on-ubuntu/) article before proceeding.

If you prefer to experiment with Go without installing it first, you can run the examples found in this guide using the [Go Playground](https://play.golang.org).

## Packages

In Go, **packages** are the mechanism that provide the capability to organize and reuse source code.

### Declaring a Package

In a text editor, create `hellogopher.go` in your $GOPATH and add the following content to create a simple "Hello world" program in Go:

{{< file "hellogopher.go" go >}}
package main

import "fmt"

func main() {
	fmt.Println("Hello Gopher!")
}
{{< /file >}}

Notice that the very first statement in the Hello Gopher program was that we declared package `main` using the `package` keyword.

Every go source file must declare a package. This tells Go which package the Go source code file is part of. Any Go program, that's intended to run on the command line, declares package `main`. The `main` function that we define after declaring package `main`, is where execution of the Go program begins. The `main` function takes no arguments and returns no values.

    Run the program:
    $ run hellogopher.go

    Output:
    Hello Gopher!

### Importing a Package

We import a package using the `import` keyword. For example, in the Hello Gopher program, we import the `fmt` package:

```go
import "fmt"
```

The `fmt` package includes functionality for formatting output to the screen.

Notice how we call the `Println` function, from the `fmt` package to print a line to the screen:

```go
fmt.Println("Hello Gopher!")
```

The `.` (dot) notation is used to refer to both data and functions located in the imported package. We called the `Println` function from the `fmt` package, using the dot notation, to print the message "Hello Gopher" to `stdout` (standard out).

If we did not import the `fmt` package, and we tried to compile the program, the compiler would complain. If we want to make use of functionality from other packages we must import the packages first.

### Grouping Imports

When a Go program has to import more than one package, it's handy to use an import grouping. For example, let's consider the scenario where we wanted the Hello Gopher program to print out the current time, right after printing out the "Hello Gopher" greeting.

1. We can replace the import statement that we declared previously, with an import grouping that includes both the `fmt` and `time` packages like so:

```go
import (
	"fmt"
	"time"
)
```

2. In the `main` function, right after we print out the greeting, we can include the following `fmt.Println` statement to print out the current time:

```go
	fmt.Println(time.Now())
```

We print out the current time, by printing out the `Time` value returned from the `Now` function of the `time` package. The `time` package and the `fmt` package are part of [Go's robust standard library](https://golang.org/pkg/).

After making these two changes, the Hello Gopher program now looks like this:

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("Hello Gopher!")
	fmt.Println(time.Now())
}
```
Let's run the modified Hello Gopher program and observe its results.


    Run the program:
    $ run hellogopher.go

    Output:
    Hello Gopher!
    2018-04-29 14:41:08.715214 -0700 PDT m=+0.000391168


### Aliasing a Package

Go provides the facility to alias imported packages. For example, in the Hello Gopher program we can use an alias, `f`, to refer to the `fmt` package like so:

```go
package main

import (
	f "fmt"
	"time"
)

func main() {
	f.Println("Hello Gopher!")
	f.Println(time.Now())
}
```
We alias the `fmt` package with the name `f`, by placing the alias name in front of the package name inside the import grouping.

Notice that all `Println` function calls to the `fmt` package have Now been replaced to call the `fmt` package's alias, `f`.

### Creating a Package

Now, we're going to consider an example where we create our very own custom package. We will create a package named "greetings", which will contain functionality to simply print out a greeting to the screen.

Navigate to your `$GOPATH/src` directory and create a new directory for the `greetings` package:

    $ cd $GOPATH/src
    $ mkdir greetings

Note: If the `src` directory doesn't exist in your `$GOPATH`, you should create it using the `mkdir` command.

Go packages follow a convention where Go source files that implement a particular package, must be housed in a directory containing the package's name. Since our package name is `greetings`, we must create a directory called "greetings" which houses the Go source file that implements the `greetings` package.

Let's create a source file named "greetings.go" and place it inside the "greetings" folder with the following contents:

<greetings.go>

```go
package greetings

import (
  "fmt"
)

func PrintGreetings() {
	fmt.Println("Hello Gopher!")
}

func printGreetingsUnexported() {
	fmt.Println("Hello Gopher! (from unexported)")
}
```

Notice that the very first line of code in the `greetings.go` source file declares the `greetings` package, using the `package` keyword.

The `PrintGreetings` function in the `greetings` package is responsible for printing out the greeting. In Go, upper-casing the first letter of a function name has a special significance – it indicates that a function is an exported function. An exported function, is a function that can be called outside a package.

Function names that have their first letter lower-cased, are only accessible by Go source files within the same package. The `printGreetingsUnexported` function also prints out a variation of the "Hello Gopher" greeting, but it cannot be called outside of the `greetings` package, since it is an unexported function.

A Go package can contain multiple Go source files. Let's create another Go source file named `magic.go` inside the "greetings" directory with the following contents:

<magic.go>

```go
package greetings

import "fmt"

var magicNumber int

func PrintMagicNumber() {
	fmt.Println("The magic number is...", magicNumber)
}

func PrintTheUnexportedGreetings() {
  printGreetingsUnexported()
}

func init() {
	magicNumber = 108
}
```

Notice again, that the very first line of code declares that the `magic.go` Go source file belongs to the `greetings` package.

In the same manner by which we declare exported and unexported functions, by upper-casing or lower-casing the first letter, respectively, we can follow the same rules when declaring package variables.

For example, the `magicNumber` variable is an unexported package variable of type `int` (integer):

```go
var magicNumber int
```

 This means that it can be accessed by any Go source file within the `greetings` package, but the `magicNumber` variable cannot be accessed outside of the `greetings` package.

The `PrintMagicNumber` function prints out the value of the `magicNumber` variable.

The `magicNumber` package variable gets initialized in the `init` function, which is a special function in the Go language. The `init` function is used to initialize the state of a package. Go will automatically call the `init` function defined here, prior to calling the `main` function of a command line Go program.

We use the `PrintTheUnexportedGreetings` function, an exported function, to call the unexported `printGreetingsUnexported` function. This allows Go source files outside of the `greetings` package to call the `printGreetingsUnexported` function.

The reason that the `PrintTheUnexportedGreetings` function, defined in the `magic.go` source file, is able to call the unexported `printGreetingsUnexported` function, is because this source file belongs to the same package, `greetings`, where the unexported function is declared.

### Using a Custom Package

At this point we've created our own custom package, and now it's time to use the functionality defined in the package.

Let's create a new directory called `usegreetings` inside the `$GOPATH/src` directory. Let's create a Go source file named `usegreetings.go` in the `usegreetings` directory with the following contents:

<usegreetings.go>

```go
package main

import (
	"greetings"
)

func main() {
	greetings.PrintGreetings()
	greetings.PrintMagicNumber()
	greetings.PrintTheUnexportedGreetings()
}
```

The `usegreetings.go` source file implements a command line program, therefore we have to declare package `main` and we have to define a `main` function which is the primary entry point of the command line Go program.

Notice that we have included the `greetings` package in the import grouping.

Inside the `main` function, we call all of the exported functions in the `greetings` package.

Let's go ahead and run the `usegreetings.go` program.

    Run the program:
    $ go run usegreetings.go

    Output:
    Hello Gopher!
    The magic number is... 108
    Hello Gopher! (from unexported)
