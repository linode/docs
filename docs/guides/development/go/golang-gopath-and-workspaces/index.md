---
slug: golang-gopath-and-workspaces
description: 'The GOPATH in Golang is used to point to a Go Workspace. The Go Workspace is where you store your Go source code and binary executables. This guide takes a deep dive into the GOPATH.'
keywords: ['gopath','what is go path ','set go path']
tags: ['Go', 'Go Programming']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-11
modified_by:
  name: Linode
title: "The GOPATH in Golang"
title_meta: "Golang’s GOPATH and Workspaces"
authors: ["Cameron Laird"]
---

A team of Google employees [designed the Go programming language](https://qarea.com/blog/the-evolution-of-go-a-history-of-success) in 2007 to help developers make better use of high-performance, networked, multi-core computing chips. [Well over a million coders around the world](https://research.swtch.com/gophercount) now work in Go.

One of Go’s main objectives is *manageable packaging*. Reliable and expressive [cooperation with external libraries](https://www.freecodecamp.org/news/code-dependencies-are-the-devil-35ed28b556d/) is an important criterion for modern programming. It doesn't matter how wonderful the syntax and semantics of your programming language are if its use of libraries is difficult, fragile, or opaque. It's important that application code can be easily shared and run amongst developers.

Golang's `GOPATH` is at the heart of its package management. This guide uses examples to explain how the `GOPATH` is used in Golang and its relationship to Go Workspaces.

## What is the GOPATH?

The `GOPATH` is an environment variable that points to the location of a Go Workspace's root folder. A *Go Workspace*, contains source files, compiled binaries, external libraries, and various cached objects. This collection of files includes everything necessary for a Golang development project.

You can view your system's currently configured `GOPATH` by issuing the following command:

    go env GOPATH

The `go env` command displays all of a system's Go environment variables. To limit the output of the command, target the Go environment variable that you'd like to inspect further. In this case, the example command displays the `GOPATH` environment variable's location. You should see a similar output.

{{< output >}}
    GOPATH="/home/example_user/go"
{{</ output >}}

If you have not set your `GOPATH` environment variable, the default location is `$HOME/go` on Linux and macOS, and `%USERPROFILE%\go` on Windows.

## Go Workspace Layout

As stated in the previous section, a Go Workspace contains source files and compiled binaries. These files are stored within a specific directory hierarchy that looks as follows:

- `$GOPATH/src/`: This subdirectory contains Go source files. This is the directory where you store your `.go` files that contain your Go code in development. A Go workspace's `src` directory can contain multiple Go source repositories or projects.
- `$GOPATH/bin/`: Stores compiled executable binaries that are built by the Go engine.

Typically, Go developers use a single Go Workspace to store all of their Go source code. Another convention used by Go developers is to organize the code in the `$GOPATH/src/` directory by *source repository*. This convention is suggested because it is assumed that you eventually store your Go code in a remote repository, like GitHub. This makes your Go code available to collaborators and users. An example directory hierarchy that uses this convention resembles the following Go Workspace tree:

{{< output >}}
$GOPATH/go/
           bin/
               hello_world                          # command executable
           src/
               github.com/username/go_example/
                   .git/                            # Git repository metadata
               hello_world/
                   hello_world.go                   # command source
{{</ output >}}

## Go Workspace Configuration: Set the GOPATH

It is not necessary to set your `GOPATH` unless you want to use a location that is different from the default location. The default location of the `GOPATH` is `$HOME/go`. On a Linux system, the full path is `/home/username/go`. Setting your `GOPATH` is similar to [setting any Linux system environment variable](/docs/guides/how-to-set-linux-environment-variables/). To set your `GOPATH`, use the following command:

    export = GOPATH=/home/example_user/a_new_workspace

Replace `/home/example_user/a_new_workspace` with your desired directory.

You should add the `$GOPATH/bin` directory to your system `PATH`. This makes it so you do not have to enter the full path to a Go executable when running your Go apps in development.

    export PATH=$PATH:$(go env GOPATH)/bin

{{< note respectIndent=false >}}
The examples below assume you are using the default location for your `GOPATH` (`/home/username/go`). If the `go` directory does not yet exist in your home folder, create it now.

    mkdir ~/go
{{< /note >}}

To start writing your first Go program, first create the `bin`, and `src` directories in your Go Workspace.

    mkdir $GOPATH/{bin,src}

In the following sections, you create a `Hello, World!` Go program. You should follow Go conventions and store the program as if it is pushed to a remote version control repository. The example below continues to build your Go Workspace's directory hierarchy. Create the directories to store your `Hello, World!` Go program.

    mkdir -p $GOPATH/src/github.com/username/go_example/hello_world/

Using your preferred text editor, create a new file named `hello_world.go` in the `$GOPATH/bin/github.com/username/go_example/hello_world/` directory. Add and save the following content to your file.

{{< file >}}
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
{{</ file >}}

To illustrate the behavior of the `$GOPATH`, run the `go install` command from your home directory (`cd ~`).

    go install github.com/username/hello_world

As a result of running the above command, Go creates an executable binary named `hello_world` in your `$GOPATH/bin` directory. Since your `$GOPATH/bin` directory was added to your system `PATH`, you can invoke the `hello_world` executable from your home directory without providing its full path.

    hello_world

Your Go program prints the following message:

{{< output >}}
Hello, World!
{{</ output >}}

## Conclusion

Understanding how the `GOPATH` is used by Go is essential in helping you get started writing Go programs. The `GOPATH` points to the location of a Go Workspace. By default this location is `/home/username/go` on Linux systems. Like any environment variable, you can assign a custom value to your `GOPATH` if you'd like to point it to a different directory. Abiding by Go program conventions around directory hierarchy and organization also helps you keep your Go programs shareable with outside collaborators or users. As a next step, check out our [Getting Started with Go Packages](/docs/guides/getting-started-with-go-packages/) guide to learn more about organizing, packaging, and distributing your Go programs.







