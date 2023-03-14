---
slug: getting-started-with-go-packages
description: 'This guide provides you with step-by-step instructions for getting started with the Go programming language, used by many modern applications, such as Docker.'
keywords: ["go","golang","packages","export"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-06-06
modified: 2018-06-06
modified_by:
  name: Linode
title: 'Getting Started with Go Packages'
external_resources:
  - '[A Tour of Go](https://tour.golang.org/)'
  - '[The Go Standard Library](https://golang.org/pkg/)'
  - '[Go Essentials for Full Stack Web Development](https://www.packtpub.com/web-development/go-essentials-full-stack-web-development-video/)'
audiences: ["beginner"]
languages: ["go"]
aliases: ['/development/go/getting-started-with-go-packages/']
authors: ["Kamesh Balasubramanian"]
---

## What is Go?

Go is a compiled, [statically typed](https://en.wikipedia.org/wiki/Type_system#Static_type_checking) programming language developed by Google. Many modern applications, including Docker, Kubernetes, and Caddy, are written in Go.

Go packages allow developers to organize and reuse Go code in a simple and maintainable manner. Using and declaring Go packages are essential tasks that are performed when writing Go applications. This guide will demonstrate and help you to understand how to create and use Go packages.

## Before You Begin

If you haven't installed Go on your server yet, follow the instructions from the [Install Go on Ubuntu](/docs/guides/install-go-on-ubuntu/) guide before proceeding.

If you prefer to experiment with Go without installing it first, you can run the examples found in this guide using the [Go Playground](https://play.golang.org).

## Packages

Packages provide the capability to organize and reuse source code.

### Declaring a Package

In a text editor, create a `hellogopher.go` file in your [GOPATH](/docs/guides/install-go-on-ubuntu/#adjust-the-path-variable) and add the following content to create a simple "Hello world" program:

{{< file "hellogopher.go" go >}}
package main

import "fmt"

func main() {
        fmt.Println("Hello Gopher!")
}
{{< /file >}}

The first statement declares the package `main` using the `package` keyword.

Every Go source file must declare a package. This tells Go which package the source code file is part of. Any Go app that's intended to run on the command line declares the package `main`. The `main` function that we define after declaring package `main` is where execution of the Go code begins. The `main` function takes no arguments and returns no values.

Run the program:

    go run hellogopher.go

{{< output >}}
Hello Gopher!
{{< /output >}}

### Import a Package

Import the `fmt` package using the `import` keyword:

{{< highlight go >}}
import "fmt"
{{< /highlight >}}

The `fmt` package includes functionality for formatting output to the screen such as the `Println` function:

{{< highlight go >}}
fmt.Println("Hello Gopher!")
{{< /highlight >}}

### Grouping Imports

To have the example program print the current time as well as a greeting, add the `time` package. You could add each `import` on its own line:

{{< highlight go >}}
import "fmt"
import "time"
{{< /highlight >}}

Instead of using `import` on each line, replace the import statements with an import grouping that includes both the `fmt` and `time` packages.

{{< highlight go >}}
import (
        "fmt"
        "time"
)
{{< /highlight >}}

If your text editor includes a Go language plugin, it may adjust the text automatically.

In the `main` function, right after the greeting is printed, use the `Now()` function in the `time` module to print out the current time:

{{< highlight go >}}
fmt.Println(time.Now())
{{< /highlight >}}

We print out the current time by printing out the `time` value returned from the `Now` function of the `time` package. The `time` package and the `fmt` package are part of [Go's robust standard library](https://golang.org/pkg/).

After making these two changes, the Hello Gopher program now looks like this:

{{< file "hellogopher.go" go >}}
package main

import (
        "fmt"
        "time"
)

func main() {
        fmt.Println("Hello Gopher!")
        fmt.Println(time.Now())
}
{{< /file >}}

Run the modified program:

    run hellogopher.go

{{< output >}}
Hello Gopher!
2018-04-29 14:41:08.715214 -0700 PDT m=+0.000391168
{{< /output >}}

### Aliasing a Package

Go provides the ability to alias imported packages. For example, in the Hello Gopher program we can use an alias, `f`, to refer to the `fmt` package like so:

{{< highlight go >}}
package main

import (
        f "fmt"
        "time"
)

func main() {
        f.Println("Hello Gopher!")
        f.Println(time.Now())
}
{{< /highlight >}}

We alias the `fmt` package with the name `f`, by placing the alias name in front of the package name inside the import grouping.

Notice that all `Println` function calls to the `fmt` package have now been replaced to call the `fmt` package's alias, `f`.

### Create a Package

Create a package called `greetings`, which will contain functionality to print out a greeting to the screen.

Go packages follow a convention where Go source files that implement a particular package must be housed in a directory whose name matches the package's name. In this example, our package is called `greetings`, and we create a directory called `greetings` for the Go source file that implements the `greetings` package.

Create and change to a new directory for the `greetings` package:

    mkdir -p $GOPATH/src/greetings && cd $GOPATH/src/greetings

Create a source file called `greetings.go` and place it inside the `greetings` directory with the following contents:

{{< file "$GOPATH/src/greetings/greetings.go" go >}}
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
{{< /file >}}

The first line of code in `greetings.go` declares the `greetings` package, using the `package` keyword.

The `PrintGreetings` function in the `greetings` package is responsible for printing out the greeting. In Go, capitalizing the first letter of a function name has a special significance – it indicates that a function is an exported function. An exported function is a function that can be called from outside a package.

Function names that begin with a lowercase letter are only accessible by Go source files within the same package. The `printGreetingsUnexported` function also prints out a variation of the "Hello Gopher" greeting, but it cannot be called outside of the `greetings` package, since it is an unexported function.

A Go package can contain multiple Go source files. Let's create another Go source file named `magic.go` inside the `greetings` directory with the following contents:

{{< file "magic.go" go >}}
package greetings

import "fmt"

var magicNumber int

// PrintMagicNumber : Prints the internal variable magicNumber
func PrintMagicNumber() {
        fmt.Println("The magic number is...", magicNumber)
}

// PrintTheUnexportedGreetings : Prints the unexported greeting
func PrintTheUnexportedGreetings() {
        printGreetingsUnexported()
}

func init() {
        magicNumber = 108
}
{{< /file >}}

The first line of code declares that `magic.go` belongs to the `greetings` package.

In the same manner by which we declare exported and unexported functions by capitalization of the first letter, we can follow the same rules when declaring package variables.

For example, the `magicNumber` variable is an unexported package variable of type `int` (integer):

{{< highlight go >}}
var magicNumber int
{{< /highlight >}}

This means that it can be accessed by any Go source file within the `greetings` package, but the `magicNumber` variable cannot be accessed outside of the `greetings` package.

The `PrintMagicNumber` function prints out the value of the `magicNumber` variable.

The `magicNumber` package variable gets initialized in the `init` function, which is a special function in the Go language. The `init` function is used to initialize the state of a package. Go will automatically call the `init` function defined here, prior to calling the `main` function of a command line Go program.

We use the `PrintTheUnexportedGreetings` function, an exported function, to call the unexported `printGreetingsUnexported` function. This allows Go source files outside of the `greetings` package to call the `printGreetingsUnexported` function.

Although `printGreetingsUnexported` is defined in a different source file than `magic.go`, the `PrintTheUnexportedGreetings` function is able to call it because both source files belong to the `greetings` package.

### Use a Custom Package

At this point we've created our own custom package, and now it's time to use the functionality defined in the package.

Create a new directory called `usegreetings` inside the `$GOPATH/src` directory and create a source file called `usegreetings.go` with the following contents:

{{< file "$GOPATH/src/usegreetings/usegreetings.go" go >}}
package main

import (
        "greetings"
)

func main() {
        greetings.PrintGreetings()
        greetings.PrintMagicNumber()
        greetings.PrintTheUnexportedGreetings()
}
{{< /file >}}

The `usegreetings.go` source file implements a command line program, so we have to declare the `main` package and function which is the primary entry point of the command line Go program.

Notice that we have included the `greetings` package in the import grouping.

Run the program:

    go run usegreetings.go

{{< output >}}
Hello Gopher!
The magic number is... 108
Hello Gopher! (from unexported)
{{< /output >}}
