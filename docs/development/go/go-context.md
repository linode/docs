
---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'Showcasing the use of the context Go package.'
keywords: ["go", "golang", "context"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-05-31
modified_by:
  name: Linode
title: 'Using the context Go package'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[Go](https://www.golang.com)'
---

## Before You Begin

You will need to install a recent version of Go on your computer in order to follow the
presented commands. Any Go version newer than 1.8 will do but it is considered a good
practice to have the latest version of Go installed. You can check your Go version
by executing `go version`.

If you still need to install Go, you can follow our guide for Ubuntu installation [here](https://www.linode.com/docs/development/go/install-go-on-ubuntu/).

{{< note >}}
This guide is written for a non-root user. Depending on your configuration, some commands might require the help of `sudo` in order to get property executed. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## About the context package

The main purpose of the `context` package is to define the `Context` type and
support *cancellation*. This happens because there are times where you want to
abandon what you are doing but it an elegant way. However, it would be very helpful
to be able to include some extra information about your cancelling decisions and propagate
the information in a standard and portable way. The `context` package defines the
`context.Context` type that can carry deadlines and cancellation signals between processes.

If you take a look at the source code of the `context` package, you will realize that its
implementation is pretty simple — even the implementation of the `Context` type is pretty
simple, yet the `context` package is very important.

The `Context` type is a Go *interface* with four methods, named `Deadline()`, `Done()`,
`Err()`, and `Value()`. The good news is that you do not need to implement all of these
functions of the `Context` interface – you just need to declare and modify a `Context`
variable using functions such as `context.WithCancel()`, `context.WithDeadline()` and
`context.WithTimeout()`.

The source code of the `context` package includes the following information:

{{< note >}}
// The WithCancel, WithDeadline, and WithTimeout functions take a
// Context (the parent) and return a derived Context (the child) and a
// CancelFunc. Calling the CancelFunc cancels the child and its
// children, removes the parent's reference to the child, and stops
// any associated timers. Failing to call the CancelFunc leaks the
// child and its children until the parent is canceled or the timer
// fires. The go vet tool checks that CancelFuncs are used on all
// control-flow paths.
{{< /note >}}

## A simple example

The first code example will be relatively simple and illustrate the use of the
`context.Context` type with the help of `simple.go`.

### Explaining the Go code of the Example

The Go code of `simple.go` is as follows:

{{< file "./simple.go" go >}}
package main

import (
        "context"
        "fmt"
        "os"
        "strconv"
        "time"
)

func f1(t int) {
        c1 := context.Background()
        c1, cancel := context.WithCancel(c1)
        defer cancel()

        go func() {
                time.Sleep(4 * time.Second)
                cancel()
        }()

        select {
        case <-c1.Done():
                fmt.Println("f1():", c1.Err())
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
                fmt.Println("f2():", c2.Err())
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
                fmt.Println("f3():", c3.Err())
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

The program contains four functions including the `main()` function. Functions `f1()`,
`f2()` and `f3()` require just one parameter, which is a time delay, because everything
else is defined inside the function.

The first thing to remember is that you need to call the `context.Background()` function
in order to initialize an empty `Context`. The other function that can create an empty
`Context` is `context.TODO()` and is going to be presented later in this guide.

Notice that the `cancel` variable in `f1()`, which is a function, is one of the return values of
`context.CancelFunc()`. The `context.WithCancel()` function uses an existing `Context` and creates a
child of it with cancellation. The `context.WithCancel()` function also retuns a `Done` channel
that can be closed, either when the `cancel()` function is called, as shown in the preceding code,
or when the `Done` channel of the parent context is closed.

{{< note >}}
One of the return values of `Context.Done()` is a Go channel, because otherwise you would not have
been able to use it in a `select` statement.
{{< /note >}}

On the other hand the `cancel` variable in `f2()` comes from `context.WithTimeout()`.
This function showcases the use of the `context.WithTimeout()` function, which requires
two parameters: a `Context` parameter and a `time.Duration` parameter. When the timeout
period expires, the `cancel()` function is called automatically.

Last, the `cancel` variable in `f3()` comes from `context.WithDeadline()`. The `f3()` function
illustrates the use of the `context.WithDeadline()` function that requires two parameters:
a `Context` variable and a `time` in the future that signifies the deadline of the operation.
When the deadline passes, the `cancel()` function is called automatically.

{{< note >}}
Notice that contexts should not be stored in structures – they should be passed as
separate parameters to functions. It is considered a good practice to pass them as
the first parameter of a function.
{{< /note >}}

### Using simple.go

Executing `simple.go` with a delay period of *4 seconds* will generate the following kind of output:

    go run simple.go 4
{{< output >}}
Delay: 4
f1(): 2019-05-29 08:39:48.219616 +0300 EEST m=+4.004039510
f2(): context deadline exceeded
f3(): 2019-05-29 08:39:56.224505 +0300 EEST m=+12.009254674
{{< /output >}}

The long lines of the output are the return values of the `time.After()` function calls.
They denote normal operation of the program. The point here is that the operation of the
program is cancelled when there are delays in its execution.

If you use a bigger delay (*10 seconds*), which is executed as a call to `time.Sleep()`, you
will get the following kind of output:

    go run simple.go 10
{{< output >}}
Delay: 10
f1(): context canceled
f2(): context canceled
f3(): context canceled
{{< /output >}}

The calls to `time.Sleep()` simulate a program that is slow or an operation that takes too
much time to finish. Production code does not usually have such `time.Sleep()` function calls.

## Using Context for HTTP

In this section of the guide you will learn how to timeout HTTP connections on the client side.

The presented utility, which is called `http.go`, requires two command line arguments,
which are the URL to connect to and the allowed delay value in seconds.

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
                fmt.Println("The request was cancelled!")
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

The timeout period is defined by the `context.WithTimeout()` method in `main()`.
The `connect()` function that is executed as a goroutine will either terminate
normally or when the `cancel()` function is executed. 

{{< note >}}
It is considered a good practice to use `context.Background()` in the `main()` function,
the `init()` function of a package or at tests.
{{< /note >}}

The `connect()` function is used for connecting to the desired URL. The `connect()`
function also starts a goroutine before the `select` block takes control in order
to either wait for web data as returned by the goroutine or for a timeout with
the help of the `Context` variable.

### Using http.go

If the desired delay is too small, then `http.go` will timeout. One such example is
when you declare that you want a delay of `0` seconds, as in the following example:

        go run http.go https://www.linode.com/ 0
{{< output >}}
Delay: 0
Connecting to https://www.linode.com/
The request was cancelled!
Exiting...
{{< /output >}}

If the timeout period is long enough, then the output from `http.go` will be similar
to the following:

        go run http.go http://localhost:8001 10
{{< output >}}
Delay: 1
Connecting to http://localhost:8001
Server Response: Serving: /

Exiting...
{{< /output >}}

Notice that `http://localhost:8001` uses a custom made HTTP server that returns
a small amount of data. However, nothing prohibits you from trying commands such
as `go run http.go https://www.linode.com/ 10` .

## Another use of Context

In this section of the guide you are going to learn how to pass values in a `Context`.

The `more.go` program illustrates the use of the `context.TODO()` function as well
as the use of the `context.WithValue()` function.

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

This time we create a context using the `context.TODO()` function instead
of the `context.Background()` function. Although both functions return a non-nil,
empty `Context`, their purposes differ. You should never pass a `nil` context – use
the `context.TODO()` function to create a suitable context – and remember that
the `context.TODO()` function should be used when you are not sure about the
`Context` that you want to use.

The `context.TODO()` function signifies that we intend to use an operation context,
without being sure about it yet. The good thing is that `TODO()` is recognized by
static analysis tools, which allows them to determine whether a `context.Context` variable
is propagated correctly in a program or not.

The `context.WithValue()` function that is used in `main()` offers a way to associate
a value with a `Context`.

The `searchKey()` function retrieves a value from a `Context` variable and checks
whether that value exists or not.

### Using more.go

Executing `more.go` will generate the following output:

    go run moreContext.go
{{< output >}}
found value: mySecretValue
key not found: notThere
key not found: notThere
{{< /output >}}

### Propagation over HTTP

In order to share a common context among multiple processes, you will need
to propagate that context on your own.

The logic of this technique is based on the Go code of `more.go`. The `context.WithValue()`
function can be used for adding your data into a context that you will need to serialize
and send over HTTP. Then, you will need to decode the data, get the context and use
`context.Value()` to check whether the desired key and the desired values are in place or not.

{{< note >}}
The `http.Request` type has the `Context()` method that returns the context of the request
and the `WithContext()` method that according to the Go documentation
*returns a shallow copy of r with its context changed to ctx*. You can learn more about
both methods at https://golang.org/pkg/net/http/.
{{< /note >}}
