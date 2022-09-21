---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'UNIX signal handling in Go.'
keywords: ["Go", "Signals", "UNIX", "Golang", "kill"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-10-16
modified_by:
  name: Linode
title: 'Learning how to handle or ignore UNIX Signals'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[Go](https://golang.org)'
  - '[The Go Playground](https://play.golang.org/)'
---

## Introduction

The Go Standard Library provides the `os/signal` package to developers for working with UNIX signals. This guide will show you how to use it for UNIX signal handling.

{{< note >}}
This guide is written for a non-root user. Depending on your configuration, some commands might require the help of `sudo` in order to get property executed. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## In This Guide

This guide illustrates the handling of UNIX signals using Go code by presenting two code examples. The first one handles just two signals whereas the second one handles all signals that can be handled. All you need to follow this guide is to have Go and your favorite text editor installed on your Linode machine.

## About UNIX Signals

Have you ever pressed Control+C in order to stop a running program? If the answer is *Yes*, then you are already familiar with UNIX signals because Control+C sends the `SIGINT` signal to a program. Strictly speaking, UNIX Signals are software interrupts that can be accessed either by name or by number that provide a way to handle asynchronous events on UNIX systems. Generally speaking, it is safer to send a signal by name because it is less likely to send the wrong signal accidentally.

The most common way to send a signal to a UNIX process is by using the `kill(1)` utility. By default, `kill(1)` sends the `SIGTERM` signal. If you want to find all of the supported signals on your UNIX machine, you should execute the `kill -l` command.

A program cannot handle all of the available signals because some of the signals cannot be caught, handled or ignored. The reason for this is that they provide the kernel and the root user a way of stopping any process they desire. These signals are `SIGKILL` and `SIGSTOP`. The `SIGKILL` signal, which is also known by the number `9` (`kill -9`), is usually called in extreme conditions where you need to act fast without considering the consequences of your actions. Thus, it is the only signal that is usually called by number, simply because it is quicker to do so. The usual behavior of `SGISTOP` is to pause the process in its current state. The process will resume after receiving the `SIGCONT` signal.

If you try to send a signal to a process without having the required permissions, `kill(1)` will not do the job and you will get an error message similar to the following:

    kill 8231
{{< output >}}
-bash: kill: (1210) - Operation not permitted
{{< /output >}}

{{< note >}}
`signal.SIGINFO`, which is a signal supported by Go, is not available on Linux machines, which means that if you find it in a Go program that you want to run on a Linux machine, you need to replace it with another signal or your Go program will not be able to compile and execute.
{{< /note >}}

### Handling Two Signals

The presented example will show you how to handle two specific UNIX signals with your Go code.

    {{< file "./twoSignals.go" go >}}
package main

import (
    "fmt"
    "os"
    "os/signal"
    "syscall"
    "time"
)

func handleSignal(signal os.Signal) {
    fmt.Println("handleSignal() Caught:", signal)
}

func main() {
    sigs := make(chan os.Signal, 1)
    signal.Notify(sigs, os.Interrupt, syscall.SIGUSR2)
    go func() {
        for {
            sig := <-sigs
            switch sig {
            case os.Interrupt:
                fmt.Println("Caught:", sig)
            case syscall.SIGUSR2:
                handleSignal(sig)
                return
            }
        }
    }()

    for {
        fmt.Printf(".")
        time.Sleep(20 * time.Second)
    }
}
{{< /file >}}

The `handleSignal()` function handles the `syscall.SIGINFO` signal, while the `os.Interrupt` signal is handled directly in the relevant `case` branch. This technique works as follows: 

- You define a *channel*, which is this case is named `sigs`, that helps you pass data around.
- You call `signal.Notify()` in order to state the signals that interest you. 
- You provide an anonymous function that runs as a *goroutine* in order to act when you receive any one of the signals you care about.

Notice that the endless `for` loop in `main()` is used for prohibiting the program from terminating, as it has no real work to do. In an actual application, there would be no need to use similar code. The `time.Sleep()` call is used for slowing down the `for` loop - each iteration of the `for` loop prints a `.` character on the screen.

Executing `twoSignals.go` and interacting with it from another terminal will resemble the following output:

    go run twoSignals.go
{{< output >}}
.Caught: interrupt
.Caught: interrupt
.handleSignal() Caught: user defined signal 2
.signal: terminated
{{< /output >}}

The commands executed on the second terminal were the following:

- `kill -s INT 52962`
- `kill -s INT 52962`
- `kill -s USR1 52962` (This will be ignored)
- `kill -s USR2 52962`
- `kill 52962`

The process ID used here is `52962` – you should find out the process ID used by `twoSignals.go` on your Linux machine and use that. The `ps(1)` and `top(1)` commands might help you with this.

### Handling All Signals

You will now learn how to handle all signals but only respond to the ones that interest you.

    {{< file "./all.go" go >}}
package main

import (
    "fmt"
    "os"
    "os/signal"
    "syscall"
    "time"
)

func handle(signal os.Signal) {
    fmt.Println("Received:", signal)
}

func main() {
    sigs := make(chan os.Signal, 1)
    signal.Notify(sigs)
    go func() {
        for {
            sig := <-sigs
            switch sig {
            case os.Interrupt:
                handle(sig)
            case syscall.SIGTERM:
                handle(sig)
                os.Exit(0)
            case syscall.SIGUSR2:
                fmt.Println("Handling syscall.SIGUSR2!")
            default:
                fmt.Println("Ignoring:", sig)
            }
        }
    }()

    for {
        fmt.Printf(".")
        time.Sleep(30 * time.Second)
    }
}
{{< /file >}}

All the work is done by the `signal.Notify(sigs)` statement. As no signals are specified, all incoming signals will be handled. One of the signals (`syscall.SIGTERM`) is used for exiting the program, which is a good practice. This gives you the opportunity to do some housekeeping in your program when needed. Once again, there is an endless `for` loop that prevents the program for terminating.

Executing `all.go` and interacting with it from another terminal will resemble the following output:

    go run all.go
{{< output >}}
.Ignoring: hangup
.Ignoring: user defined signal 1
Handling syscall.SIGUSR2!
.Received: interrupt
Received: terminated
{{< /output >}}

The commands executed on the second terminal were the following:

- `kill -s HUP 53077`
- `kill -s USR1 53077`
- `kill -s USR2 53077`
- `kill -s INT 53077`
- `kill -s TERM 53077`

The process ID used here is `53077` – you will need to replace that with your own process ID.

## Summary

Signal handling we make your Go programs more professional and robust, especially when you are developing server processes. Just remember that not all UNIX signals can be handled.
