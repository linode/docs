---
slug: go-context
description: 'This article showcases some of the use cases of the context package which is part of Go, a programming language created by Google and uised in many popular apps.'
keywords: ["go", "golang", "context"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-05-31
modified_by:
  name: Linode
title: 'Using the context Go package'
external_resources:
  - '[The Go Programming Language Website](https://www.golang.com)'
aliases: ['/development/go/go-context/']
authors: ["Mihalis Tsoukalos"]
---
[Go](https://golang.org/) is a compiled, statically typed programming language developed by Google. Many modern applications, including Docker, Kubernetes, and Caddy, are written in Go.

Running a go command is as simple as:

    go run [filename]

The context package provides contextual information that a goroutine may need such as how long it should run and how and when it should end. It can also pass informational key-value pairs for use down the call chain.

In this guide you will learn:

 - How the [context package](/docs/guides/go-context/#about-the-context-package) works.

 - Work through a [simple example](/docs/guides/go-context/#a-simple-example) that demonstrate the main `context.Context` features.

 - [Use context for http](/docs/guides/go-context/#using-context-for-http) requests.

 - [Use context as a key-value store](/docs/guides/go-context/#using-contexts-as-key-value-stores).

## Before You Begin

You will need to install a recent version of Go on your computer in order to follow the presented commands. Any Go version newer than 1.8 will do but it is considered a good practice to have the latest version of Go installed. You can check your Go version by executing `go version`.

If you still need to install Go, you can follow our guide for Ubuntu installation [here](/docs/guides/install-go-on-ubuntu/).

{{< note respectIndent=false >}}
This guide is written for a non-root user. Depending on your configuration, some commands might require the help of `sudo` in order to get property executed. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## About the context package

The context package supports both the handling of multiple concurrent operations and the passing of (typically request-scoped) contextual data in key-value pairs.

If you take a look at the source code of the context package, you will realize that its implementation is pretty simple. The context package defines the `Context` type, which is a Go interface with four methods, named `Deadline()`, `Done()`, `Err()`, and `Value()`:

{{< file "context.go" go >}}
type Context interface {
    Deadline() (deadline time.Time, ok bool)
    Done() <-chan struct{}
    Err() error
    Value(key interface{}) interface{}
}
{{< /file >}}

 - The developer will need to declare and modify a Context variable using functions such as `context.WithCancel()`, `context.WithDeadline()` and `context.WithTimeout()`.

 - All three of these functions return a derived Context (the child) and a `CancelFunc` function. Calling the `CancelFunc` function removes the parent's reference to the child and stops any associated timers. This means that the Go garbage collector is free to garbage collect the child goroutines that no longer have associated parent goroutines.

 - For garbage collection, the parent goroutine needs to keep a reference to each child goroutine. If a child goroutine ends without the parent knowing about it, then a memory leak occurs until the parent is canceled as well.

## A simple example

This first code example is relatively simple and illustrates the use of the `context.Context` type with the help of `simple.go`.

### Explaining the Go code of the Example

The code of `simple.go` is as follows:

{{< file "./simple.go" go >}}
package main

import (
        "context"
        "fmt"
        "os"
        "strconv"
        "time"
)

// The f1 function creates and executes a goroutine
// The time.Sleep() call simulates the time it would take a real goroutine
// to do its job - in this case it is 4 seconds. If the c1 context calls
// the Done() function in less than 4 seconds, the goroutine will not have
// enough time to finish.
func f1(t int) {
        c1 := context.Background()
        // WithCancel returns a copy of parent context with a new Done channel
        c1, cancel := context.WithCancel(c1)
        defer cancel()

        go func() {
                time.Sleep(4 * time.Second)
                cancel()
        }()

        select {
        case <-c1.Done():
                fmt.Println("f1() Done:", c1.Err())
                return
        case r := <-time.After(time.Duration(t) * time.Second):
                fmt.Println("f1():", r)
        }
        return
}

func f2(t int) {
        c2 := context.Background()
        c2, cancel := context.WithTimeout(c2, time.Duration(t)*time.Second)
        defer cancel()

        go func() {
                time.Sleep(4 * time.Second)
                cancel()
        }()

        select {
        case <-c2.Done():
                fmt.Println("f2() Done:", c2.Err())
                return
        case r := <-time.After(time.Duration(t) * time.Second):
                fmt.Println("f2():", r)
        }
        return
}

func f3(t int) {
        c3 := context.Background()
        deadline := time.Now().Add(time.Duration(2*t) * time.Second)
        c3, cancel := context.WithDeadline(c3, deadline)
        defer cancel()

        go func() {
                time.Sleep(4 * time.Second)
                cancel()
        }()

        select {
        case <-c3.Done():
                fmt.Println("f3() Done:", c3.Err())
                return
        case r := <-time.After(time.Duration(t) * time.Second):
                fmt.Println("f3():", r)
        }
        return
}

func main() {
        if len(os.Args) != 2 {
                fmt.Println("Need a delay!")
                return
        }

        delay, err := strconv.Atoi(os.Args[1])
        if err != nil {
                fmt.Println(err)
                return
        }
        fmt.Println("Delay:", delay)

        f1(delay)
        f2(delay)
        f3(delay)
}
{{< /file >}}

 - The program contains four functions including the `main()` function. Functions `f1()`, `f2()`, and `f3()` each require just one parameter, which is a time delay, because everything else they need is defined inside their functions.

 - In this example we call the `context.Background()` function to initialize an empty Context. The other function that can create an empty Context is `context.TODO()` which will be presented later in this guide.

 - Notice that the `cancel` variable, a function, in `f1()` is one of the return values of
`context.CancelFunc()`. The `context.WithCancel()` function uses an existing Context and creates a
child with cancellation. The `context.WithCancel()` function also returns a `Done` channel that can be closed, either when the `cancel()` function is called, as shown in the preceding code, or when the `Done` channel of the parent context is closed.

    {{< note respectIndent=false >}}
One of the return values of `Context.Done()` is a Go channel, which means that you will have to use a `select` statement to work with. Although `select` looks like `switch`, `select` allows a goroutine to wait on multiple communications operations.
{{< /note >}}

 - The `cancel` variable in `f2()` comes from `context.WithTimeout()`. `context.WithTimeout()` requires
two parameters: a Context parameter and a `time.Duration` parameter. When the timeout period expires, the `cancel()` function is called automatically.

 - The `cancel` variable in `f3()` comes from `context.WithDeadline()`. `context.WithDeadline()` requires two parameters: a Context variable and a `time` in the future that signifies the deadline of the operation. When the deadline passes, the `cancel()` function is called automatically.

    {{< note respectIndent=false >}}
Notice that contexts should not be stored in structures – they should be passed as separate parameters to functions. It is considered a good practice to pass them as the first parameter of a function.
{{< /note >}}

### Using simple.go

Execute `simple.go` with a delay period of *3 seconds*:

    go run simple.go 3

It will generate the following kind of output:
{{< output >}}
go run simple.go 3
Delay: 3
f1(): 2019-05-31 19:29:38.664568 +0300 EEST m=+3.004314767
f2(): 2019-05-31 19:29:41.664942 +0300 EEST m=+6.004810929
f3(): 2019-05-31 19:29:44.668795 +0300 EEST m=+9.008786881
{{< /output >}}

The long lines of the output are the return values from the `time.After()` function. They denote normal operation of the program. The point here is that the operation of the program is canceled when there are delays in its execution.

If you use a bigger delay (*10 seconds*), which is executed as a call to `time.Sleep()`:

    go run simple.go 10

You will get the following kind of output:
{{< output >}}
Delay: 10
f1() Done: context canceled
f2() Done: context canceled
f3() Done: context canceled
{{< /output >}}

The calls to `time.Sleep()` simulate a program that is slow or an operation that takes too much time to finish. Production code does not usually have such `time.Sleep()` function calls.

## Using Context for HTTP

In this section of the guide you will learn how to timeout HTTP connections on the client side.

{{< note respectIndent=false >}}
This example makes a request to a local web server. A suitable, simple web server is available via Python and can be started with the following commands:

Python 3.X

    python3 -m http.server

Python 2.X

    python -m SimpleHTTPServer
{{< /note >}}

The presented utility, which is called `http.go`, requires two command line arguments, which are the URL to connect to and the allowed delay value in seconds.

### Explaining the Go Code of the Example

The Go code of the `http.go` utility is the following:

{{< file "./http.go" go >}}
package main

import (
        "context"
        "fmt"
        "io/ioutil"
        "net/http"
        "os"
        "strconv"
        "sync"
        "time"
)

var (
        myUrl string
        delay int = 5
        w     sync.WaitGroup
)

type myData struct {
        r   *http.Response
        err error
}

// In packages that use contexts, convention is to pass them as
// the first argument to a function.
func connect(c context.Context) error {
        defer w.Done()
        data := make(chan myData, 1)
        tr := &http.Transport{}
        httpClient := &http.Client{Transport: tr}
        req, _ := http.NewRequest("GET", myUrl, nil)

        go func() {
                response, err := httpClient.Do(req)
                if err != nil {
                        fmt.Println(err)
                        data <- myData{nil, err}
                        return
                } else {
                        pack := myData{response, err}
                        data <- pack
                }
        }()

        select {
        case <-c.Done():
                tr.CancelRequest(req)
                <-data
                fmt.Println("The request was canceled!")
                return c.Err()
        case ok := <-data:
                err := ok.err
                resp := ok.r
                if err != nil {
                        fmt.Println("Error select:", err)
                        return err
                }
                defer resp.Body.Close()

                realHTTPData, err := ioutil.ReadAll(resp.Body)
                if err != nil {
                        fmt.Println("Error select:", err)
                        return err
                }
                // Although fmt.Printf() is used here, server processes
                // use the log.Printf() function instead.
                fmt.Printf("Server Response: %s\n", realHTTPData)
        }
        return nil
}

func main() {
        if len(os.Args) == 1 {
                fmt.Println("Need a URL and a delay!")
                return
        }

        myUrl = os.Args[1]
        if len(os.Args) == 3 {
                t, err := strconv.Atoi(os.Args[2])
                if err != nil {
                        fmt.Println(err)
                        return
                }
                delay = t
        }

        fmt.Println("Delay:", delay)
        c := context.Background()
        c, cancel := context.WithTimeout(c, time.Duration(delay)*time.Second)
        defer cancel()

        fmt.Printf("Connecting to %s \n", myUrl)
        w.Add(1)
        go connect(c)
        w.Wait()
        fmt.Println("Exiting...")
}
{{< /file >}}

 - The timeout period is defined by the `context.WithTimeout()` method in `main()`.

 - The `connect()` function that is executed as a goroutine will either terminate normally or when the `cancel()` function is executed.

    {{< note respectIndent=false >}}
It is considered a good practice to use `context.Background()` in the `main()` function, the `init()` function of a package or at tests.
{{< /note >}}

 - The `connect()` function is used for connecting to the desired URL. The `connect()` function also starts a goroutine before the `select` block takes control in order to either wait for web data as returned by the goroutine or for a timeout with the help of the Context variable.

### Using http.go

If the desired delay is too small, then `http.go` will timeout. One such example is when you declare that you want a delay of `0` seconds, as in the following example:

    go run http.go https://www.linode.com/ 0

The output is as follows:
{{< output >}}
Delay: 0
Connecting to https://www.linode.com/
The request was canceled!
Exiting...
{{< /output >}}

If the timeout period is sufficient, say 10 seconds.

    go run http.go http://localhost:8000 10

Then the output from `http.go` will be similar to the following:

    Delay: 1
    Connecting to http://localhost:8000
    Server Response: Serving: <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
    <html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Directory listing for /</title>
    </head>
    <body>
    <h1>Directory listing for /</h1>
    <hr>
    <ul>
    <li><a href="http.go">http.go</a></li>
    <li><a href="more.go">more.go</a></li>
    <li><a href="simple.go">simple.go</a></li>
    </ul>
    <hr>
    </body>
    </html>

Notice that `http://localhost:8000` uses a custom made HTTP server that returns a small amount of data. However, nothing prohibits you from trying commands such as:

    go run http.go https://www.linode.com/ 10

## Using Contexts as key-value stores

In this section of the guide you will pass values in a Context and use it as a key-value store. This is a case where we do not pass values into contexts in order to provide further information about why they where canceled.

The `more.go` program illustrates the use of the `context.TODO()` function as well as the use of the `context.WithValue()` function.

### Explaining the Go Code

The Go code of `more.go` is the following:

{{< file "./more.go" go >}}
package main

import (
        "context"
        "fmt"
)

type aKey string

func searchKey(ctx context.Context, k aKey) {
        v := ctx.Value(k)
        if v != nil {
                fmt.Println("found value:", v)
                return
        } else {
                fmt.Println("key not found:", k)
        }
}

func main() {
        myKey := aKey("mySecretValue")
        ctx := context.WithValue(context.Background(), myKey, "mySecretValue")
        searchKey(ctx, myKey)

        searchKey(ctx, aKey("notThere"))
        emptyCtx := context.TODO()
        searchKey(emptyCtx, aKey("notThere"))
}
{{< /file >}}

 - This time we create a context using `context.TODO()` instead of `context.Background()`. Although both functions return a non-nil, empty Context, their purposes differ. You should never pass a nil context –-- use the `context.TODO()` function to create a suitable context. Use the `context.TODO()` function when you are not sure about the Context that you want to use.

 - The `context.TODO()` function signifies that we intend to use an operation context, without being sure about it yet. The good thing is that `TODO()` is recognized by static analysis tools, which allows them to determine whether a `context.Context` variable is propagated correctly in a program or not.

 - The `context.WithValue()` function that is used in `main()` offers a way to associate a value with a Context`.

 - The `searchKey()` function retrieves a value from a Context variable and checks whether that value exists or not.

### Using more.go

Execute `more.go` with the following command:

    go run more.go

It will generate the following output:
{{< output >}}
found value: mySecretValue
key not found: notThere
key not found: notThere
{{< /output >}}

### Propagation over HTTP

In order to share a common context among multiple processes, you will need to propagate that context on your own.

The logic of this technique is based on the Go code of `more.go`. First use the `context.WithValue()` function to add your data into a context, serialize and send over HTTP, decode the data, get the context, and finally use `context.Value()` to check whether the desired key and desired values are in place or not.

{{< note respectIndent=false >}}
The `http.Request` type has the `Context()` method that returns the context of the request and the `WithContext()` method that according to the Go documentation *returns a shallow copy of r with its context changed to ctx*. You can learn more about both methods at https://golang.org/pkg/net/http/.
{{< /note >}}
