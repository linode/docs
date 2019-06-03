---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'Developing UDP and TCP Clients and Servers in Go.'
keywords: ["go", "golang", "server", "client", "TCP", "UDP", "programming", "cli"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-05-30
modified_by:
  name: Linode
title: 'Programming UDP and TCP servers and clients in Go'
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

If you still need to install Go, you can follow our guide for Ubuntu installation
[here](https://www.linode.com/docs/development/go/install-go-on-ubuntu/).

{{< note >}}
This guide is written for a non-root user. Depending on the TCP/IP port numbers that you are going to choose for the TCP server and the UDP server, some commands might require the help of `sudo` in order to get property executed. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## About TCP/IP

**TCP** stands for Transmission Control Protocol and its principal characteristic
is that it is a reliable protocol by design. If there is no proof of a packet delivery,
TCP will resend that particular packet. Among other things, a TCP packet can be used
for establishing connections, transferring data, sending acknowledgements, and closing
connections.

**IP** stands for Internet Protocol. The main characteristic of IP is that it is not a
reliable protocol by nature. IP encapsulates the data that travels over a TCP/IP
network because it is responsible for delivering packets from the source host
to the destination host according to the IP addresses. IP has to find an addressing
method to send the packet to its destination effectively.

**UDP** (User Datagram Protocol) is based on IP, which means that it is also
unreliable. Generally speaking, the UDP protocol is simpler than the TCP protocol mainly
because UDP is not reliable by design. As a result, UDP messages can be lost, duplicated,
or arrive out of order. Furthermore, UDP packets can arrive faster than the recipient can
process them. So, UDP is used when speed is more important than reliability!

A TCP client can be reasonably generic whereas a TCP server cannot be generic because
it has to perform a specific task. The same unofficial rule applies to UDP clients
and servers.

## The net Go Package

The `net` package of the Go library is what will be used for creating TCP/IP servers and clients.

The parameters of the `net.Listen()` function define the kind of server that you are going to create.
The first parameter of the `net.Listen()` function defines the type of network that will be used,
while the second parameter defines the server address as well as the port number the server will
listen to. Valid values for the first parameter are `tcp`, `tcp4` (IPv4-only), `tcp6` (IPv6-only),
`udp`, `udp4` (IPv4-only), `udp6` (IPv6-only), `ip`, `ip4` (IPv4-only), `ip6` (IPv6-only),
`Unix` (Unix sockets), `Unixgram` and `Unixpacket`.

Apart from the `net.Listen()` function, there exist `net.ListenUDP()` and `net.ListenTCP()`, which
are for creating UDP and TCP servers, respectively. These two functions should be paired with
`net.ResolveUDPAddr()` and `net.ResolveTCPAddr()`, respectively.

Similarly, the parameters of the `net.Dial()`, `net.DialTCP()` and `net.DialUDP()` specify the
kind of client you are going to create. The `net.Dial()` function is the most generic one because
it can create all kinds of network clients whereas `net.DialTCP()` and `net.DialUDP()` can
create TCP and UDP clients, respectively.

The TCP part of this guide will use the generic functions whereas the UDP part will use
`net.ResolveUDPAddr()`, `net.ListenUDP()` and `net.DialUDP()`.

{{< note >}}
All versions of `net.Dial()` and `net.Listen()` return data types that implement the
`io.Reader` and `io.Writer` interfaces. This means that you can use regular File I/O
functions to send and receive data from a TCP/IP connection if you want.
{{< /note >}}

{{< note >}}
If you ever want to test a TCP/IP application, either a server or a client, you might
find the `nc(1)` command line utility very handy.
{{< /note >}}

## A TCP Client

In this section of the guide, we are going to see how to develop a generic TCP client in Go.
The utility will allow you to interact with any TCP server.

### Looking at the Go code of the TCP client

The Go code of the TCP client is the following:

{{< file "./tcpC.go" go >}}
package main

import (
        "bufio"
        "fmt"
        "net"
        "os"
        "strings"
)

func main() {
        arguments := os.Args
        if len(arguments) == 1 {
                fmt.Println("Please provide host:port.")
                return
        }

        CONNECT := arguments[1]
        c, err := net.Dial("tcp", CONNECT)
        if err != nil {
                fmt.Println(err)
                return
        }

        for {
                reader := bufio.NewReader(os.Stdin)
                fmt.Print(">> ")
                text, _ := reader.ReadString('\n')
                fmt.Fprintf(c, text+"\n")

                message, _ := bufio.NewReader(c).ReadString('\n')
                fmt.Print("->: " + message)
                if strings.TrimSpace(string(text)) == "STOP" {
                        fmt.Println("TCP client exiting...")
                        return
                }
        }
}
{{< /file >}}

The first part of the `main()` function works with the command line arguments of the
program and has nothing to do with TCP. The implementation of the TCP client begins
with a call to `net.Dial()` that allows you to connect to the desired TCP server.
The second parameter of `net.Dial()` has two virtual parts. The first part is the hostname
or the IP address of the TCP server and the second part is the port number the TCP server
listens to.

The program reads user input using `bufio.NewReader(os.Stdin)` and `ReadString()`, which
is sent to the TCP server over the network using `Fprintf()`.

Last, the TCP client reads the response of the TCP server using another `bufio` reader and
the `bufio.NewReader(c).ReadString('\n')` statement. The `error` variable is ignored here for
reasons of simplicity only.

There exists an endless `for` loop in the program that will terminate when you send the
word `STOP` to the TCP server.

## A TCP Server

In this section of the guide, we are going to see how to develop a TCP server in Go.
What this TCP server does is returning the current date and time to the TCP client
in a single network packet.

### Looking at the Go code of the TCP server

The implementation of the TCP server contains the following Go code:

{{< file "./tcpS.go" go >}}
package main

import (
        "bufio"
        "fmt"
        "net"
        "os"
        "strings"
        "time"
)

func main() {
        arguments := os.Args
        if len(arguments) == 1 {
                fmt.Println("Please provide port number")
                return
        }

        PORT := ":" + arguments[1]
        l, err := net.Listen("tcp", PORT)
        if err != nil {
                fmt.Println(err)
                return
        }
        defer l.Close()

        c, err := l.Accept()
        if err != nil {
                fmt.Println(err)
                return
        }

        for {
                netData, err := bufio.NewReader(c).ReadString('\n')
                if err != nil {
                        fmt.Println(err)
                        return
                }
                if strings.TrimSpace(string(netData)) == "STOP" {
                        fmt.Println("Exiting TCP server!")
                        return
                }

                fmt.Print("-> ", string(netData))
                t := time.Now()
                myTime := t.Format(time.RFC3339) + "\n"
                c.Write([]byte(myTime))
        }
}
{{< /file >}}

The `net.Listen()` function, which is what makes that program a TCP server, returns
a `Listener` variable, which is a generic network listener for stream-oriented protocols.

Notice that it is only after a successful call to `Accept()` that the TCP server can
begin interacting with TCP clients. The current implementation of the TCP server can
only serve the first TCP client that connects to it because the `Accept()` call
is outside of the `for` loop. Later in this guide you will see the implementation of
a concurrent TCP server that can serve multiple TCP clients using goroutines.

The TCP server uses regular File I/O functions for interacting with TCP clients.
That interaction takes place inside the `for` loop. As soon as the TCP server
receives the word `STOP` from the TCP client, it will terminate.

### Using the TCP Client and Server

You will need to execute the TCP server first for the TCP client to have somewhere to
connect to:

    go run tcpS.go 1234

That particular server listens to port number `1234`.

Then you can execute the TCP client and interact with the TCP server:

    go run tcpC.go 127.0.0.1:1234
{{< output >}}
>> Hello!
->: 2019-05-23T19:43:21+03:00
>> STOP
->: TCP client exiting...
{{< /output >}}

The output on the TCP server side will be as follows:

{{< output >}}
-> Hello!
Exiting TCP server!
{{< /output >}}

If a TCP server is not running on the desired TCP port, you will get the following
kind of error message from `tcpC.go`:

        go run tcpC.go localhost:1234
{{< output >}}
        dial tcp [::1]:1234: connect: connection refused
{{< /output >}}

{{< note >}}
Notice that the TCP server waits before writing back to the TCP client whereas
the client writes first before trying to get an answer from the TCP server.
This is part of the official or unofficial protocol that governs a TCP or
a UDP connection. In this case we have an unofficial protocol that is based on TCP
and is both defined and implemented by us.
{{< /note >}}

## A UDP Client

As it happened with the TCP client, a UDP client can be generic and can communicate
with multiple UDP servers whereas a UDP server cannot be as generic because it has to
implement a certain functionality.

### Looking at the Go code of the UDP Client

The Go code of the UDP client is the following:

{{< file "./udpC.go" go >}}
package main

import (
        "bufio"
        "fmt"
        "net"
        "os"
        "strings"
)

func main() {
        arguments := os.Args
        if len(arguments) == 1 {
                fmt.Println("Please provide a host:port string")
                return
        }
        CONNECT := arguments[1]

        s, err := net.ResolveUDPAddr("udp4", CONNECT)
        c, err := net.DialUDP("udp4", nil, s)
        if err != nil {
                fmt.Println(err)
                return
        }

        fmt.Printf("The UDP server is %s\n", c.RemoteAddr().String())
        defer c.Close()

        for {
                reader := bufio.NewReader(os.Stdin)
                fmt.Print(">> ")
                text, _ := reader.ReadString('\n')
                data := []byte(text + "\n")
                _, err = c.Write(data)
                if strings.TrimSpace(string(data)) == "STOP" {
                        fmt.Println("Exiting UDP client!")
                        return
                }

                if err != nil {
                        fmt.Println(err)
                        return
                }

                buffer := make([]byte, 1024)
                n, _, err := c.ReadFromUDP(buffer)
                if err != nil {
                        fmt.Println(err)
                        return
                }
                fmt.Printf("Reply: %s\n", string(buffer[0:n]))
        }
}
{{< /file >}}

The UDP client uses regular File I/O functions for interacting with the UDP server
and it will terminate when you send the `STOP` message to the UDP server. This is
not part of the UDP protocol but it is good for a client to have a way to exit.

The connection to the UDP server happens with the use of the `net.DialUDP()` function.
The `net.ResolveUDPAddr()` function returns an address of UDP end point, which is
a `UDPAddr` Go structure.

## A UDP Server

In this section of the guide, we are going to see how to develop an UDP server in Go.
What this UDP server does is returning random numbers to its UDP clients.

### Looking at the Go code of the UDP Server


{{< file "./udpS.go" go >}}
package main

import (
        "fmt"
        "math/rand"
        "net"
        "os"
        "strconv"
        "strings"
        "time"
)

func random(min, max int) int {
        return rand.Intn(max-min) + min
}

func main() {
        arguments := os.Args
        if len(arguments) == 1 {
                fmt.Println("Please provide a port number!")
                return
        }
        PORT := ":" + arguments[1]

        s, err := net.ResolveUDPAddr("udp4", PORT)
        if err != nil {
                fmt.Println(err)
                return
        }

        connection, err := net.ListenUDP("udp4", s)
        if err != nil {
                fmt.Println(err)
                return
        }

        defer connection.Close()
        buffer := make([]byte, 1024)
        rand.Seed(time.Now().Unix())

        for {
                n, addr, err := connection.ReadFromUDP(buffer)
                fmt.Print("-> ", string(buffer[0:n-1]))

                if strings.TrimSpace(string(buffer[0:n])) == "STOP" {
                        fmt.Println("Exiting UDP server!")
                        return
                }

                data := []byte(strconv.Itoa(random(1, 1001)))
                fmt.Printf("data: %s\n", string(data))
                _, err = connection.WriteToUDP(data, addr)
                if err != nil {
                        fmt.Println(err)
                        return
                }
        }
}
{{< /file >}}

The `net.ListenUDP()` function tells the application to listen for incoming UDP
connections, which are served inside the `for` loop. This is the function call
that makes the program a UDP server.

The `ReadFromUDP()` and `WriteToUDP()` functions are used for reading data from a UDP
connection and writing data to a UDP connection, respectively. A byte slice named
`data` is used for writing the desired data and another one named `buffer` for reading
purposes.

As UDP is a stateless protocol, each UDP client is served and then the connection closes
automatically. The UDP server program will exit when it receives the `STOP` keyword
from any UDP client. Otherwise the `for` loop will make the program to keep waiting for
more UDP connections from other clients.

### Using the UDP Client and Server

You will need to execute the UDP server first:

    go run udpS.go 1234

Then you can execute the UDP client and interact with the UDP server:

    go run udpC.go 127.0.0.1:1234
{{< output >}}
The UDP server is 127.0.0.1:1234
>> Hello!
Reply: 82
>> STOP
Exiting UDP client!
{{< /output >}}

The output on the UDP server side will be as follows:
{{< output >}}
-> Hello!
data: 82
-> STOP
Exiting UDP server!
{{< /output >}}

## A Concurrent TCP Server

In this section you will see the implementation of a concurrent TCP server in Go.
The good thing with concurrent TCP servers is that they can serve multiple clients.
In Go, this is usually done by creating a separate *goroutine* for serving each TCP client.

The created TCP server keeps a counter that counts the number of TCP clients it has served
so far. The counter increases by one each time a new TCP client connects to the TCP server.
The current value of that counter is returned to each TCP client.

### Looking at the Go code of the concurrent TCP Server

The Go code of the concurrent TCP server is the following:

{{< file "./concTCP.go" go >}}
package main

import (
        "bufio"
        "fmt"
        "net"
        "os"
        "strconv"
        "strings"
)

var count = 0

func handleConnection(c net.Conn) {
        fmt.Print(".")
        for {
                netData, err := bufio.NewReader(c).ReadString('\n')
                if err != nil {
                        fmt.Println(err)
                        return
                }

                temp := strings.TrimSpace(string(netData))
                if temp == "STOP" {
                        break
                }
                fmt.Println(temp)
                counter := strconv.Itoa(count) + "\n"
                c.Write([]byte(string(counter)))
        }
        c.Close()
}

func main() {
        arguments := os.Args
        if len(arguments) == 1 {
                fmt.Println("Please provide a port number!")
                return
        }

        PORT := ":" + arguments[1]
        l, err := net.Listen("tcp4", PORT)
        if err != nil {
                fmt.Println(err)
                return
        }
        defer l.Close()

        for {
                c, err := l.Accept()
                if err != nil {
                        fmt.Println(err)
                        return
                }
                go handleConnection(c)
                count++
        }
}
{{< /file >}}

Each TCP client is served by a separate goroutine that executes the `handleConnection()`
function. This means that while a TCP client is served, the TCP server is free to
interact with more TCP clients, which are connected using the `Accept()` function.

Although the `Accept()` function can be executed multiple times, the `net.Listen()`
function needs to be executed only once.

As it happens with most TCP/IP servers, the `for` loop in the `main()` function never
ends because TCP/IP servers usually run all the time. However, if a `handleConnection()`
function receives the `STOP` message, the goroutine that runs it will exit and the related
TCP connection will close.

### Using the concurrent TCP Server

You will need to execute the TCP server first:

    go run concTCP.go 1234

That particular TCP server listens to port number `1234` but you can use
any port number you want provided that it is not already in use and that
you have the required privileges.

Then you can execute `nc(1)` and interact with the TCP server:

    nc 127.0.0.1 1234
{{< output >}}
Hello!
1
{{< /output >}}

While the `nc` client is connected to the TCP server, you can also connect to
the TCP server using `tcpC.go`:

    go run tcpC.go 127.0.0.1:1234
{{< output >}}
>> Hello!
->: 2
>> STOP
->: TCP client exiting...
{{< /output >}}

As this is the second TCP client, the return value from the TCP server will be `2`
from now on on all TCP clients.

The output on the TCP server side will be as follows:
{{< output >}}
.Hello!
.Hello!
{{ < /output >}}



