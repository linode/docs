---
slug: creating-reading-and-writing-files-in-go-a-tutorial
description: 'This guide provides you instructions for performing various file I/O operations in the Go programming language, such as verifying a path exists, and more.'
keywords: ["Go", "File", "UNIX", "Input", "Output", "Golang"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-09-06
modified_by:
  name: Linode
title: 'Creating, Reading and Writing Files in Go'
title_meta: 'Creating, Reading and Writing Files in Go - A Tutorial'
external_resources:
  - '[Go](https://golang.org)'
  - '[The os package](https://golang.org/pkg/os/)'
  - '[The io package](https://golang.org/pkg/io/)'
  - '[The viper package](https://github.com/spf13/viper)'
aliases: ['/development/go/creating-reading-and-writing-files-in-go-a-tutorial/']
authors: ["Mihalis Tsoukalos"]
---

## Introduction

This guide provides examples related to performing common file input and output operations in Go.

{{< note respectIndent=false >}}
This guide is written for a non-root user. However, some commands might require the help of `sudo` in order to properly execute. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## In This Guide

In this guide, you will learn how to:

- [Read files in Go](#reading-files-in-go)
- [Check whether a file or a directory exists](#checking-if-a-path-exists)
- [Create new files](#creating-a-new-file)
- [Write data to files](#writing-data-to-a-file)
- [Implement a simple version of the `cat(1)` command line utility in Go](#implementing-cat-in-go)

## Before You Begin

- To follow this guide you need to have [Go installed on your computer](/docs/guides/install-go-on-ubuntu/) and access to your preferred text editor.

- For the purposes of this guide, a text file named `data.txt` with the following contents will be used:

        cat /tmp/data.txt

    {{< output >}}
1 2
One Two

Three
    {{< /output >}}

## Checking if a Path Exists

In order to read a file, you will need to open it first. In order to be able to open a file, it must exist at the given path and be an actual file, not a directory. The code of this section will check if *the given path* exists.

{{< file "./doesItExist.go" go >}}
package main

import (
    "fmt"
    "os"
)

func main() {
    arguments := os.Args
    if len(arguments) == 1 {
        fmt.Println("Please give one argument.")
        return
    }
    path := arguments[1]

    _, err := os.Stat(path)
    if err != nil {
        fmt.Println("Path does not exist!", err)
    }
}
{{< /file >}}

All the work here is done by the powerful `os.Stat()` function. If the call to `os.Stat()` is successful, then the error value will be `nil`, which confirms that the given path exists. Notice that if the given path exists, the program generates no output according to the UNIX philosophy.

Executing `doesItExist.go` will resemble the following output:

    go run doesItExist.go /bin/What
{{< output >}}
Path does not exist! stat /bin/What: no such file or directory
{{< /output >}}

{{< note respectIndent=false >}}
The fact that a path does exist does not necessarily mean that it is a regular file or a directory. There exist additional tests and functions that will help you determine the kind of file you are dealing with.
{{< /note >}}

## Checking if a Path is a Regular File

There exist a special function in the Go standard library, `IsRegular()`, that checks whether a path belongs to a file or not. This function is illustrated in the below example.

{{< file "./isFile.go" go >}}
package main

import (
    "fmt"
    "os"
)

func main() {
    arguments := os.Args
    if len(arguments) == 1 {
        fmt.Println("Please give one argument.")
        return
    }
    path := arguments[1]

    fileInfo, err := os.Stat(path)
    if err != nil {
        fmt.Println("Path does not exist!", err)
    }

    mode := fileInfo.Mode()
    if mode.IsRegular() {
        fmt.Println(path, "is a regular file!")
    }
}
{{< /file >}}

After getting information about the mode of the file using `Mode()`, you need to call the `IsRegular()` function to determine whether the given path belongs to a regular file or not. If the path is a regular file, the output of `IsRegular()` will give you this information.

Executing `isFile.go` will resemble the following output:

    go run isFile.go /bin/ls
{{< output >}}
/bin/ls is a regular file!
{{< /output >}}


{{< note respectIndent=false >}}
Most of the examples in this guide will not test whether the file that is going to be read exists in order to minimize the amount of code. The `os.Open()` function does some of this work, but in a less elegant way. However, on production code all necessary tests should be performed in order to avoid crashes and bugs in your software.
{{< /note >}}

## Reading Files in Go

Reading files in Go is a simple task. Go treats both text and binary files the same, and it is up to you to interpret the contents of a file. One of the many ways to read a file, `ReadFull()`, is presented in the `readFile.go` file below.

{{< file "./readFile.go" go >}}
package main

import (
    "fmt"
    "io"
    "os"
)

func main() {
    if len(os.Args) != 2 {
        fmt.Println("Please provide a filename")
        return
    }

    filename := os.Args[1]
    f, err := os.Open(filename)
    if err != nil {
        fmt.Printf("error opening %s: %s", filename, err)
        return
    }
    defer f.Close()

    buf := make([]byte, 8)
    if _, err := io.ReadFull(f, buf); err != nil {
        if err == io.EOF {
            err = io.ErrUnexpectedEOF
        }
    }
    io.WriteString(os.Stdout, string(buf))
    fmt.Println()
}
{{< /file >}}

The `io.ReadFull()` function reads from the reader of an open file and puts the data into a *byte slice* with 8 places. The `io.WriteString()` function is used for sending data to standard output (`os.Stdout`), which is also a file as far as UNIX is concerned. The read operation is executed only once. If you want to read an entire file, you will need to use a `for` loop, which is illustrated in other examples of this guide.

Executing `readFile.go` will generate the following output:

    go run readFile.go /tmp/data.txt
{{< output >}}
1 2
One
{{< /output >}}

### Reading a file line by line

The following code shows how you can read a text file in Go line by line.

{{< file "./lByL.go" go >}}
package main

import (
    "bufio"
    "flag"
    "fmt"
    "io"
    "os"
)

func lineByLine(file string) error {
    var err error
    fd, err := os.Open(file)
    if err != nil {
        return err
    }
    defer fd.Close()

    reader := bufio.NewReader(fd)
    for {
        line, err := reader.ReadString('\n')
        if err == io.EOF {
            break
        } else if err != nil {
            fmt.Printf("error reading file %s", err)
            break
        }
        fmt.Print(line)
    }
    return nil
}

func main() {
    flag.Parse()
    if len(flag.Args()) == 0 {
        fmt.Printf("usage: lByL <file1> [<file2> ...]\n")
        return
    }

    for _, file := range flag.Args() {
        err := lineByLine(file)
        if err != nil {
            fmt.Println(err)
        }
    }
}
{{< /file >}}

The core functionality of the program can be found in the `lineByLine()` function. After ensuring the filename can be opened, the function create a new reader using `bufio.NewReader()`. Then, the function uses that reader with `bufio.ReadString()` in order to read the input file line by line. This is accomplished by passing the *newline character* parameter to `bufio.ReadString()`. `bufio.ReadString()` will continue to read the file until that character is found. Constantly calling `bufio.ReadString()` when that parameter is the newline character results in reading the input file line by line. The `for` loop in the `main()` function exists to help to process multiple command line arguments.

Executing `lByL.go` will generate the following kind of output:

    go run lByL.go /tmp/data.txt
{{< output >}}
1 2
One Two

Three
{{< /output >}}

### Reading a Text File Word by Word

The following code shows how you can read a text file word by word.

{{< file "./wByW.go" go >}}
package main

import (
    "bufio"
    "flag"
    "fmt"
    "io"
    "os"
    "regexp"
)

func wordByWord(file string) error {
    var err error
    fd, err := os.Open(file)
    if err != nil {
        return err
    }
    defer fd.Close()

    reader := bufio.NewReader(fd)
    for {
        line, err := reader.ReadString('\n')
        if err == io.EOF {
            break
        } else if err != nil {
            fmt.Printf("error reading file %s", err)
            return err
        }

        r := regexp.MustCompile("[^\\s]+")
        words := r.FindAllString(line, -1)
        for i := 0; i < len(words); i++ {
            fmt.Println(words[i])
        }
    }
    return nil
}

func main() {
    flag.Parse()
    if len(flag.Args()) == 0 {
        fmt.Printf("usage: wByW <file1> [<file2> ...]\n")
        return
    }

    for _, file := range flag.Args() {
        err := wordByWord(file)
        if err != nil {
            fmt.Println(err)
        }
    }
}
{{< /file >}}

The core functionality of the program can be found in the `wordByWord()` function. Initially the text file is read line by line. Then a regular expression, which is stored in the `r` variable, is used for determining the words in the current line. Those words are stored in the `words` variable. After that, a `for` loop is used for iterating over the contents of `words` and print them on the screen before continuing with the next line of the input file.

Executing `wByW.go` will generate the following kind of output:

    go run wByW.go /tmp/data.txt
{{< output >}}
1
2
One
Two
Three
{{< /output >}}

### Reading a file character by character

The following code shows how you can read a text file character by character.

{{< file "./cByC.go" go >}}
package main

import (
    "bufio"
    "flag"
    "fmt"
    "io"
    "os"
)

func charByChar(file string) error {
    var err error
    fd, err := os.Open(file)
    if err != nil {
        return err
    }
    defer fd.Close()

    reader := bufio.NewReader(fd)
    for {
        line, err := reader.ReadString('\n')
        if err == io.EOF {
            break
        } else if err != nil {
            fmt.Printf("error reading file %s", err)
            return err
        }

        for _, x := range line {
            fmt.Println(string(x))
        }
    }
    return nil
}

func main() {
    flag.Parse()
    if len(flag.Args()) == 0 {
        fmt.Printf("usage: cByC <file1> [<file2> ...]\n")
        return
    }

    for _, file := range flag.Args() {
        err := charByChar(file)
        if err != nil {
            fmt.Println(err)
        }
    }
}
{{< /file >}}

The `charByChar()` function does all the work. Once again, the input file is ready line by line. Within a `for` loop, `range` iterates over the characters of each line.

Executing `cByC.go` will generate the following kind of output:

    go run cByC.go /tmp/data.txt
{{< output >}}
1

2


O
n
e

T
w
o




T
h
r
e
e


{{< /output >}}

## Other Examples

### Checking if a Path is a Directory

In this section you will learn how to differentiate between directories and the other types of UNIX files.

{{< file "./isDirectory.go" go >}}
package main

import (
    "fmt"
    "os"
)

func main() {
    arguments := os.Args
    if len(arguments) == 1 {
        fmt.Println("Please give one argument.")
        return
    }
    path := arguments[1]

    fileInfo, err := os.Stat(path)
    if err != nil {
        fmt.Println("Path does not exist!", err)
    }

    mode := fileInfo.Mode()
    if mode.IsDir() {
        fmt.Println(path, "is a directory!")
    }
}
{{< /file >}}

All the work is done by the `IsDir()` function. If it is a directory, then it will return `true`.

Executing `isDirectory.go` will generate the following kind of output:

    go run isDirectory.go /tmp
{{< output >}}
/tmp is a directory!
{{< /output >}}

### Creating a New File

In this section you will learn how to create a new file in Go.

{{< file "./createFile.go" go >}}
package main

import (
    "fmt"
    "os"
)

func main() {
    if len(os.Args) != 2 {
        fmt.Println("Please provide a filename")
        return
    }
    filename := os.Args[1]
    var _, err = os.Stat(filename)

    if os.IsNotExist(err) {
        file, err := os.Create(filename)
        if err != nil {
            fmt.Println(err)
            return
        }
        defer file.Close()
    } else {
        fmt.Println("File already exists!", filename)
        return
    }

    fmt.Println("File created successfully", filename)
}
{{< /file >}}

It is really important to make sure that the file you are going to create does not already exist, otherwise you might overwrite an existing file and therefore lose its data. `os.Create()` will truncate the destination file if it already exists. The `IsNotExist()` function returns `true` if a file or directory does not exist. This is indicated by the contents of the `error` variable that is passed as an argument to `IsNotExist()`. The `error` variable was returned by a previous call to `os.Stat()`.

Executing `createFile.go` will generate the following output:

    go run createFile.go /tmp/newFile.txt
{{< output >}}
File created successfully /tmp/newFile.txt
{{< /output >}}

### Writing Data to a File

In this section you will learn how to write data to a new file using `fmt.Fprintf()`.

{{< file "./writeFile.go" go >}}
package main

import (
    "fmt"
    "os"
)

func main() {
    if len(os.Args) != 2 {
        fmt.Println("Please provide a filename")
        return
    }

    filename := os.Args[1]
    destination, err := os.Create(filename)
    if err != nil {
        fmt.Println("os.Create:", err)
        return
    }
    defer destination.Close()

    fmt.Fprintf(destination, "[%s]: ", filename)
    fmt.Fprintf(destination, "Using fmt.Fprintf in %s\n", filename)
}
{{< /file >}}

The use of the `fmt.Fprintf()` function for writing allows us to write formatted text to files in a way that is similar to the way the `fmt.Printf()` function works. Notice that `fmt.Fprintf()` can write to any `io.Writer` interface. Once again, remember that `os.Create()` will truncate the destination file if it already exists.

A successful execution of `writeFile.go` will generate no output - in this case the executed command will be `go run writeFile.go /tmp/aNewFile`. However, it would be interesting to see the contents of `/tmp/aNewFile`.

    cat /tmp/aNewFile
{{< output >}}
[/tmp/aNewFile]: Using fmt.Fprintf in /tmp/aNewFile
{{< /output >}}

### Appending Data to a File

You will now learn how to append data to a file, which means adding data to the end of the file without deleting existing data.

{{< file "./append.go" go >}}
package main

import (
    "fmt"
    "os"
    "path/filepath"
)

func main() {
    arguments := os.Args
    if len(arguments) != 3 {
        fmt.Printf("usage: %s message filename\n", filepath.Base(arguments[0]))
        return
    }
    message := arguments[1]
    filename := arguments[2]

    file, err := os.OpenFile(filename, os.O_RDWR|os.O_APPEND|os.O_CREATE, 0660)
    if err != nil {
        fmt.Println(err)
        return
    }
    defer file.Close()
    fmt.Fprintf(file, "%s\n", message)
}
{{< /file >}}

The actual appending is taken care of by the `os.O_APPEND` flag of the `os.OpenFile()` function. This flag tells Go to write at the end of the file. Additionally, the `os.O_CREATE` flag will make `os.OpenFile()` create the file if it does not exist, which is pretty handy. Apart from that, the information is written to the file using `fmt.Fprintf()`.

The `append.go` program generates no output when executed successfully. In this example, it was executed as `go run append.go "123" /tmp/data.txt`. However, the contents of `/tmp/data.txt` will not be the same:

    cat /tmp/data.txt
{{< output >}}
1 2
One Two

Three
123
{{< /output >}}

### Copying Files

In this section you will learn one way of creating a copy of an existing file.

{{< file "./fileCopy.go" go >}}
package main

import (
    "fmt"
    "io"
    "os"
    "path/filepath"
    "strconv"
)

var BUFFERSIZE int64

func Copy(src, dst string, BUFFERSIZE int64) error {
    sourceFileStat, err := os.Stat(src)
    if err != nil {
        return err
    }

    if !sourceFileStat.Mode().IsRegular() {
        return fmt.Errorf("%s is not a regular file.", src)
    }

    source, err := os.Open(src)
    if err != nil {
        return err
    }
    defer source.Close()

    _, err = os.Stat(dst)
    if err == nil {
        return fmt.Errorf("File %s already exists.", dst)
    }

    destination, err := os.Create(dst)
    if err != nil {
        return err
    }
    defer destination.Close()

    buf := make([]byte, BUFFERSIZE)
    for {
        n, err := source.Read(buf)
        if err != nil && err != io.EOF {
            return err
        }
        if n == 0 {
            break
        }

        if _, err := destination.Write(buf[:n]); err != nil {
            return err
        }
    }
    return err
}

func main() {
    if len(os.Args) != 4 {
        fmt.Printf("usage: %s source destination BUFFERSIZE\n", filepath.Base(os.Args[0]))
        return
    }

    source := os.Args[1]
    destination := os.Args[2]
    BUFFERSIZE, _ = strconv.ParseInt(os.Args[3], 10, 64)

    fmt.Printf("Copying %s to %s\n", source, destination)
    err := Copy(source, destination, BUFFERSIZE)
    if err != nil {
        fmt.Printf("File copying failed: %q\n", err)
    }
}
{{< /file >}}

`fileCopy.go` allows you to set the size of the buffer that will be used during the copy process. In this Go program, the buffer is implemented using a *byte slice* named `buf`. The copy takes place in the `Copy()` function, which keeps reading the input file using the required amount of `Read()` calls, and writes it using the required amount of `Write()` calls. The `Copy()` function performs lots of tests to make sure that the source file exists and is a regular file and that the destination file does not exist.

The output of `fileCopy.go` will resemble the following:

    go run fileCopy.go /tmp/data.txt /tmp/newText 16
{{< output >}}
Copying /tmp/data.txt to /tmp/newText
{{< /output >}}

### Implementing cat in Go

In this section we will implement the core functionality of the `cat(1)` command line utility in Go. The `cat(1)` utility is used to print the contents of a file to a terminal window.

{{< file "./cat.go" go >}}
package main

import (
    "bufio"
    "fmt"
    "io"
    "os"
)

func printFile(filename string) error {
    f, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer f.Close()
    scanner := bufio.NewScanner(f)
    for scanner.Scan() {
        io.WriteString(os.Stdout, scanner.Text())
        io.WriteString(os.Stdout, "\n")
    }
    return nil
}

func main() {
    filename := ""
    arguments := os.Args
    if len(arguments) == 1 {
        io.Copy(os.Stdout, os.Stdin)
        return
    }

    for i := 1; i < len(arguments); i++ {
        filename = arguments[i]
        err := printFile(filename)
        if err != nil {
            fmt.Println(err)
        }
    }
}
{{< /file >}}

If you execute `cat.go` without any command line arguments, then the utility will just copy from standard input to standard output using the `io.Copy(os.Stdout, os.Stdin)` statement. However, if there are command-line arguments, then the program will process them all in the same order that they were given using the `printFile()` function.

{{< note respectIndent=false >}}

Command Line arguments when using `cat.go` will only be file paths. `cat.go` does not support the arguments you'd see with the traditional `cat` command, only the core functionality.

{{< /note >}}

The output of `cat.go` will resemble the following:

    go run cat.go /tmp/data.txt
{{< output >}}
1 2
One Two

Three
{{< /output >}}

## Summary

File I/O is a huge subject that cannot be covered in a single guide. However, now that you know the basics of file input and output in Go, you are free to begin experimenting and writing your own system utilities.
