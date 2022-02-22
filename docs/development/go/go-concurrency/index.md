---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'Concurrent programming in Go.'
keywords: ["Go", "Concurrency", "Golang", "Goroutines", "Channels", "Programming"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-10-28
modified_by:
  name: Linode
title: 'Go Goroutines and Channels'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[Go](https://golang.org)'
  - '[The Go Playground](https://play.golang.org/)'
  - '[The sync Package](https://golang.org/pkg/sync/)'
  - '[Mastering Go](https://www.packtpub.com/programming/mastering-go-second-edition)'
---

## Introduction

This guide will talk about Go goroutines and channels, which are the building blocks of the Go concurrency model, using easy to understand code.

## In This Guide

This guide will teach you about Go Concurrency by illustrating how you can create and synchronize goroutines as well as the basics of working with channels. All you need to follow this guide is to have Go and your favorite text editor installed on your Linode machine.

## Processes, Threads and Goroutines

A *process* is an execution environment that contains instructions, user data and system data parts, as well as other types of resources that are obtained during runtime, whereas a *program* is a file that contains instructions and data that are used for initializing the instruction and user-data parts of a process. A UNIX *thread* is a smaller and lighter entity than a process or a program. Threads are created by processes and have their own flow of control and stack. A quick and simplistic way to differentiate a thread from a process is to consider a process as the running binary file and a thread as a subset of a process.

*Goroutines* are the smallest Go entities that can be executed on their own in a Go program. *Channels* can get data from goroutines, which allows goroutines to have a point of reference and communicate with each other. **Everything in Go is executed using goroutines**, which makes perfect sense since Go is a concurrent programming language by design. Therefore, when a Go program starts its execution, its single goroutine calls the `main()` function, which starts the program execution. Goroutines live in UNIX threads that live in UNIX processes.

{{< note >}}
You should not make any assumptions about the order of execution of the goroutines of a program because this is totally up to the *Go Scheduler*, the available system resources and the operating system.
{{< /note >}}

### Creating two Goroutines

The `go` keyword allows you to create goroutines. It can be followed by either an anonymous function or a function name that is implemented as usual. This is demonstrated in `goR.go`, which contains the following code:

{{< file "./goR.go" go >}}
package main

import (
	"fmt"
)

func print1to10() {
	for i := 0; i < 10; i++ {
		fmt.Print(i)
	}
}

func main() {
	go print1to10()

	go func() {
		for i := 10; i < 20; i++ {
			fmt.Print(i, " ")
		}
	}()
}
{{< /file >}}

The code creates two goroutines. The first one is a goroutine for the `print1to10()` function and the second one is a goroutine for an anonymous function.

Unfortunately, executing `goR.go` as `go run goR.go` will generate no output! The reason for this is simple once you realize how Go code is executed: the two goroutines we have created as well as the goroutine for the `main()` function are executed concurrently. The thing is that once the goroutine of the `main()` function ends, the entire program exits! This gives no time to the other two goroutines to do their job and print any output, which is the reason for getting no output from `goR.go`. Therefore, we will need to find a way to give our goroutines enough time to execute before the program ends.

### Slowing Down your Program

In this section we are going to see a naive way of slowing down the ending of a program and giving our goroutines enough time to finish. The presented technique is far from perfect and too far from being sufficient for use in production systems. Nevertheless, it gives you a better idea of what is going on with goroutines and how they work.

{{< file "./goSlow.go" go >}}
package main

import (
	"fmt"
	"time"
)

func print1to10() {
	for i := 0; i < 10; i++ {
		fmt.Print(i)
	}
}

func main() {
	go print1to10()

	go func() {
		for i := 10; i < 20; i++ {
			fmt.Print(i, " ")
		}
	}()

	time.Sleep(1 * time.Second)
	fmt.Println()
}
{{< /file >}}

Once again, two goroutines are created. However, the `main()` function sleeps for 1 second due to the `time.Sleep(1 * time.Second)` statement. This gives the two goroutines enough time to finish their job and print their output. The next section will present a technique for synchronizing goroutines that uses a more rational approach that follows the Go philosophy.

Executing `goSlow.go` will generate the following output:

    go run goSlow.go    
{{< output >}}
10 11 12 13 14 15 16 17 18 19 0123456789
{{< /output >}}

If you execute `goSlow.go` one more time, you will most likely get a different output.

    go run goSlow.go
{{< output >}}
012345678910 11 12 13 14 15 16 17 18 19
{{< /output >}}

This proves that you should not make any assumptions about the order of execution of the goroutines of a program - welcome to concurrent programming!

### Creating Multiple Goroutines the Right Way

This section will present a technique that allows `main()` to wait for all goroutines to finish before exiting. This happens with the use of the functionality offered by the `sync` package. The program can create a variable number of goroutines, according to the value of the `-n` flag – if there is no `-n` flag, the code is instructed to generate 10 goroutines.

{{< file "./syncGo.go" go >}}
package main

import (
	"flag"
	"fmt"
	"sync"
)

func main() {
	n := flag.Int("n", 10, "Number of goroutines")
	flag.Parse()
	count := *n
	fmt.Printf("Going to create %d goroutines.\n", count)

	var waitGroup sync.WaitGroup
	fmt.Printf("%#v\n", waitGroup)
	for i := 0; i < count; i++ {
		waitGroup.Add(1)
		go func(x int) {
			defer waitGroup.Done()
			fmt.Printf("%d ", x)
		}(i)
	}

	fmt.Printf("%#v\n", waitGroup)
	waitGroup.Wait()
	fmt.Println("\nExiting...")
}
{{< /file >}}

First, you will need to define a `sync.WaitGroup` variable, which in reality is a Go structure. The number of goroutines that belong to a `sync.WaitGroup` group is defined by one or multiple calls to the `sync.Add()` function. Each call to `sync.Add()` increases the counter in the related `sync.WaitGroup` variable by the number that is given as a parameter to `sync.Add()`. Notice that it is really important to call `sync.Add()` before the `go` statement in order to prevent any race conditions. When each goroutine finishes its job, the `sync.Done()` function will be executed, which will decrease the same counter. The `sync.Wait()` call **blocks** until the counter in the relevant `sync.WaitGroup` variable becomes zero, giving your goroutines enough time to finish.

The output of `syncGo.go` will resemble the following:

    go run syncGo.go -n 20
{{< output >}}
Going to create 20 goroutines.
sync.WaitGroup{noCopy:sync.noCopy{}, state1:[3]uint32{0x0, 0x0, 0x0}}
1 3 2 4 12 6 sync.WaitGroup{noCopy:sync.noCopy{}, state1:[3]uint32{0x0, 0x11, 0x0}}
19 13 14 15 16 17 18 9 8 10 11 0 5 7
Exiting...
{{< /output >}}

Are we totally safe? Generally speaking, yes. However, there are still some tricky points that you will need to consider when creating multiple goroutines. The most important things to consider are avoiding race conditions and making sure that you are having the same number of `Done()` and `Add()` function calls.

### What if We Wait for More Goroutines?

If you have more `Add()` calls than `Done()` calls, things are not going to work well. So, let us say that we put a `waitGroup.Add(1)` statement after the `for` loop of `syncGo.go`. Then the execution of `syncGo.go` will create the following output:

    go run syncGo.go
{{< output >}}
Going to create 10 goroutines.
sync.WaitGroup{noCopy:sync.noCopy{}, state1:[3]uint32{0x0, 0x0, 0x0}}
sync.WaitGroup{noCopy:sync.noCopy{}, state1:[3]uint32{0x0, 0xb, 0x0}}
9 4 5 6 7 1 0 2 8 3 fatal error: all goroutines are asleep - deadlock!

goroutine 1 [semacquire]:
sync.runtime_Semacquire(0xc00001a0d8)
	/usr/local/Cellar/go/1.13.3/libexec/src/runtime/sema.go:56 +0x42
sync.(*WaitGroup).Wait(0xc00001a0d0)
	/usr/local/Cellar/go/1.13.3/libexec/src/sync/waitgroup.go:130 +0x64
main.main()
	/Users/mtsouk/syncGo.go:27 +0x33f
exit status 2
{{< /output >}}

The program crashed with the `fatal error: all goroutines are asleep - deadlock!` error message that states that we have goroutines (one or more) that are asleep and the program is going to wait forever for them to finish, which is called a *deadlock*. This happens because the counter in `sync.WaitGroup` will never become zero, which makes the program believing that we are waiting for more goroutines to call the `Done()` function.

### What if We Wait for Fewer Goroutines?

If you have fewer `Add()` calls than the `Done()` calls things are not going to work properly as well. So, let us say that we put a `waitGroup.Done()` statement after the `for` loop of `syncGo.go`. Then the execution of `syncGo.go` will create the following output:

    go run syncGo.go
{{< output >}}
Going to create 10 goroutines.
sync.WaitGroup{noCopy:sync.noCopy{}, state1:[3]uint32{0x0, 0x0, 0x0}}
sync.WaitGroup{noCopy:sync.noCopy{}, state1:[3]uint32{0x0, 0x9, 0x0}}
9 6 7 8 2 0 4 3 1 5
Exiting...
panic: sync: negative WaitGroup counter

goroutine 23 [running]:
sync.(*WaitGroup).Add(0xc000098030, 0xffffffffffffffff)
	/usr/local/Cellar/go/1.13.3/libexec/src/sync/waitgroup.go:74 +0x139
sync.(*WaitGroup).Done(0xc000098030)
	/usr/local/Cellar/go/1.13.3/libexec/src/sync/waitgroup.go:99 +0x34
main.main.func1(0xc000098030, 0x5)
	/Users/mtsouk/syncGo.go:22 +0xf2
created by main.main
	/Users/mtsouk/syncGo.go:19 +0x265
exit status 2
{{< /output >}}

The error message is `panic: sync: negative WaitGroup counter`, which tells us that the counter of the `WaitGroup` variable has a negative value - this is not allowed. Notice that is this case, the problem might not appear all of the time!

### Race Conditions

Working with goroutines might look simple at first, but there are hard to discover bugs. In this section, you are going to see an example where a race condition exists. A *Race Condition* happens when the behavior of a program depends on uncontrollable events.

{{< file "./race.go" go >}}
package main

import (
	"fmt"
	"sync"
)

func main() {
	count := 10

	var waitGroup sync.WaitGroup
	fmt.Printf("%#v\n", waitGroup)
	for i := 0; i < count; i++ {
		waitGroup.Add(1)
		go func() {
			defer waitGroup.Done()
			fmt.Printf("%d ", i)
		}()
	}

	fmt.Printf("%#v\n", waitGroup)
	waitGroup.Wait()
	fmt.Println("\nExiting...")
}
{{< /file >}}

The output of `race.go` will resemble the following:

    go run race.go
{{< output >}}
sync.WaitGroup{noCopy:sync.noCopy{}, state1:[3]uint32{0x0, 0x0, 0x0}}
sync.WaitGroup{noCopy:sync.noCopy{}, state1:[3]uint32{0x0, 0xa, 0x0}}
10 10 10 10 10 10 10 10 10 10
Exiting...
{{< /output >}}

As you can see, most of the expected output is missing – we only get `10` as output and not any other number. If you execute it another time, some other output might be missing! So, there is clearly a problem here. The *Go race detector*, which is executed with the `-race` flag, will reveal the problem:

    go run -race race.go
{{< output >}}
sync.WaitGroup{noCopy:sync.noCopy{}, state1:[3]uint32{0x0, 0x0, 0x0}}
==================
WARNING: DATA RACE
Read at 0x00c0000ac040 by goroutine 7:
  main.main.func1()
      /Users/mtsouk/race.go:17 +0x8a

Previous write at 0x00c0000ac040 by main goroutine:
  main.main()
      /Users/mtsouk/race.go:13 +0x1dc

Goroutine 7 (running) created at:
  main.main()
      /Users/mtsouk/race.go:15 +0x1b8
==================
1 2 3 4 5 6 7 8 9 sync.WaitGroup{noCopy:sync.noCopy{}, state1:[3]uint32{0x0, 0x0, 0x1}}
10
Exiting...
Found 1 data race(s)
exit status 66
{{< /output >}}

There exists a data race that affects the value of `i` as it passed in each goroutine when the goroutine is actually being executed. This means that the value of `i` cannot be specified deterministically because it depends on external circumstances such as the Go scheduler and the Linux scheduler. If you want to correct the problem, you will have to call the anonymous function in the way it was called in `syncGo.go`, that is, with a parameter that is passed to it at the time it is executed as a goroutine – this allows Go to define `i` without any ambiguity. If you correct the code, the output of the race detector will be empty and you will get the expected output from the program.

## Channels

Channels, which are a *communication mechanism*, play a key role in the Go Concurrency model. Each channel allows the exchange of a specific data type, which is called the *element type* of the channel. You should declare a new channel using the `chan` keyword, and you can close a channel using the `close()` function. In order to create a new channel that works with `int` values, you should use a `make(chan int)` statement.

### Working with Channels

In this section you will learn more about working with channels.

{{< file "./usingChannels.go" go >}}
package main

import (
	"fmt"
)

func usingChannel(c chan int) {
	for i := 0; i < 10; i++ {
		c <- i
	}

	close(c)
}

func main() {
	fmt.Println("Using Channels!")
	aChannel := make(chan int)
	go usingChannel(aChannel)

	for myInt := range aChannel {
		fmt.Printf("%d ", myInt)
	}
	fmt.Println()

	_, ok := <-aChannel
	if ok {
		fmt.Println("Channel is open.")
	} else {
		fmt.Println("Channel is closed!")
	}

	fmt.Println("Exiting...")
}
{{< /file >}}

So, you should use the `<-aChannel` notation to read from a channel and the `aChannel <-` notation to write to a channel. Additionally, you can use the `range` keyword to keep reading from a channel until it is closed. If you do not close the channel, `range` will keep waiting to read and will never return – this is not necessarily a bad thing as long as you have it in mind and have a different way of exiting your program. In our case, the `for` loop with `range` is in the `main()` function but the related channel is closed in the `usingChannel()` function that is executed as a goroutine. Also, note that the data in a channel is read in the way it was written (*FIFO*). Last, there is a way of checking whether a channel is open or not – this is illustrated at the end of the `main()` function. Have in mind, that **reading from a closed channel** returns the zero value of its data type, which in this case will be 0.

Executing `usingChannels.go` will create the following output:

    go run usingChannels.go
{{< output >}}
Using Channels!
0 1 2 3 4 5 6 7 8 9
Channel is closed!
Exiting...
{{< /output >}}

### Functions and Channels

You can limit the functionality of a channel parameter used in a function by specifying its direction; that is, whether it is going to be used for sending or receiving only. Therefore, you should use this capability because it will make your programs more robust. You will not be able to send data accidentally to a channel from which you should only receive data, or receive data from a channel to which you should only be sending data. As a result, if you declare that a channel function parameter will be used for reading only and you try to write to that channel, you will get an error message that will most likely save you from nasty bugs in the future.

{{< file "./inOutCh.go" go >}}
package main

import (
	"fmt"
)

func send(out chan int, value int) {
	fmt.Println(value)
	// Write
	out <- value
}

func sendOnly(out chan<- int, value int) {
	fmt.Println(value)
	// Write
	out <- value
}

func receive(out chan int, in chan int) {
	// Read
	val := <-in
	fmt.Println("val:", val)
	// Write
	out <- val
}

func receiveOnly(out chan<- int, in <-chan int) {
	val := <-in
	fmt.Println("val:", val)
	out <- val
}

func main() {
	myChannel := make(chan int, 10)
	sendChannel := make(chan int, 5)

	send(myChannel, 123)
	receive(sendChannel, myChannel)

	sendOnly(myChannel, -123)
	receiveOnly(sendChannel, myChannel)
}
{{< /file >}}

Although both `send()` and `sendOnly()` implement the same functionality and are implemented the same way, their signatures are slightly different. The difference is created by the `<-` symbol found on the right of the `chan` keyword in the definition of the `sendOnly` function. This denotes that the `out` channel can be used for writing only. If the code of a Go function attempts to read from a write-only channel (**send-only channel**), the Go compiler will generate an error message and the program will not compile (`(receive from send-only type chan<- int)`).

Similarly, both `receive()` and `receiveOnly()` offer the same functionality. However, `receiveOnly()` combines a read-only channel named `in` with a write-only channel named `out` whereas in `receive()` both channels can be used without any restrictions. If you accidentally try to write and close a read-only channel (**receive-only channel**) parameter of a function, the Go compiler will generate an error message and the program will not compile (`(send to receive-only type <-chan int)`).

Note that both `myChannel` and `sendChannel` have a capacity, which is `10` and `5`, respectively. This is an optional property that is sometimes used in order to limit the size of a channel and therefore the amount of data it can hold.

The output of `inOutCh.go` will resemble the following:

    go run inOutCh.go
{{< output >}}
123
val: 123
-123
val: -123
{{< /output >}}

### The Powerful select Statement

The `select` statement in Go looks like a `switch` statement for channels. This means that `select` allows a goroutine to wait on multiple communication operations. Therefore, you can work with multiple channels using a single `select` block. As a consequence, you can have **nonblocking operations** on channels, provided that you have appropriately configured `select` blocks. Note that `select` statements do not require a `default` branch as it happens with `switch`.

It is important to remember that the branches of a `select` statement are not evaluated sequentially – all of its channels are examined simultaneously. If none of the channels in a `select` statement is ready, the `select` statement will block until one of the channels becomes ready. If multiple channels of a `select` statement are ready at the same time, then the Go runtime will make a random selection from the set of these ready channels. The Go runtime tries to make this random selection between these ready channels as uniformly and as fairly as possible.

{{< file "./select.go" go >}}
package main

import (
	"fmt"
	"math/rand"
	"os"
	"strconv"
	"time"
)

func gen(min, max int, createNumber chan int, end chan bool) {
	for {
		select {
		case createNumber <- rand.Intn(max-min) + min:
		case <-end:
			close(end)
			return
		case <-time.After(4 * time.Second):
			fmt.Println("\ntime.After()!")
		}
	}
}

func main() {
	rand.Seed(time.Now().Unix())
	createNumber := make(chan int)
	end := make(chan bool)

	if len(os.Args) != 2 {
		fmt.Println("Please give me an integer!")
		return
	}

	n, _ := strconv.Atoi(os.Args[1])
	fmt.Printf("Going to create %d random numbers.\n", n)
	go gen(-n, n, createNumber, end)

	for i := 0; i < n; i++ {
		val := <-createNumber
		fmt.Printf("%d ", val)
	}

	time.Sleep(5 * time.Second)
	fmt.Println("Exiting...")
}
{{< /file >}}

The `select` statement that can be found in the `gen()` function has three branches. The first one creates the random numbers, the second one listens for data from a channel and the third one implements a timer that will be triggered after 4 seconds (`4 * time.Second`). This means that if the program takes too long to end, the branch for the timer will be executed. You can consider the third branch of the `select` statement of the aforementioned code as a clever `default` branch because `time.After()` waits for the specified duration to elapse and then sends the current time on the returned channel – this will **unblock** the `select` statement in case all of the other branches are blocked for some reason.

The main purpose of the `time.Sleep(5 * time.Second)` statement in `main()` is to give the `time.After()` function of `gen()` enough time to return and therefore activate the relevant branch of the `select` statement.

Executing `select.go` will generate the following output:

    go run select.go 20
{{< output >}}
Going to create 20 random numbers.
10 -7 -13 15 -7 -11 3 15 -3 -7 -1 -17 5 9 -16 -6 1 -12 -17 14
time.After()!
Exiting...
{{< /output >}}

## Summary

If you going to create concurrent software in Go, chances are that you are going to use goroutines or channels or both and connect multiple channels using `select` blocks because the entire Go concurrency model is based on goroutines and channels. Experiment with these Go concepts in order to understand them better before using them in production code.
