---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'The basics of REST API.'
keywords: ["UNIX", "shell", "REST API", "Go", "Golang"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-05-15
modified_by:
  name: Linode
title: 'Learn how to implement REST API clients and servers in Go'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[The Go Programming Language](https://golang.org/)'
  - '[A Tutorial for Learning Structs in Go](https://www.linode.com/docs/development/go/go-structures/)'
  - '[Mastering Go, 2nd edition](https://www.packtpub.com/programming/mastering-go-second-edition)'
  - '[Postman](https://www.postman.com/)'
  - '[Hypertext Transfer Protocol (HTTP/1.1)](https://tools.ietf.org/html/rfc7231)'
  - '[List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)'
---

## Introduction

Nowadays, RESTful services and REST APIs are very popular and they will continue to be. As a result, the subject of this guide will be the development and use of simple RESTful servers and clients using the Go programming language. Note that REST is not tied to any operating system or system architecture and that REST is not a protocol; however, in order to implement a RESTful service you will need to use a protocol such as HTTP. Last, note that sometimes RESTful services are also called *microservices* because they share some common characteristics with microservices.

{{< note >}}
This guide is written for a non-root user. Depending on your configuration, some commands might require the help of `sudo` in order to get property executed. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

In this guide you will:

- Understand the basics of RESTful services
- Understand HTTP routing in Go
- Create a simple REST Server
- Create two simple REST Clients
- Use `curl(1)` for making client requests

## Before You Begin

To run the examples in this guide, your workstation or server will need to have Go installed, and the `go` CLI will need to be set in your terminal’s `PATH`. If you install Go using the Linux package manager that comes with your Linux distribution you will most likely not need to worry about setting the `PATH` shell variable.

{{< note >}}
This guide was written with Go version 1.14 but the code will be executed on any recent Go version.
{{< /note >}}

## An Introduction to REST API

Most modern web applications work by exposing their APIs and allowing clients to use these APIs to interact and communicate with them. REST, which is an acronym for *REpresentational State Transfer*, is an **architecture** for designing web services. Although REST is not tied to HTTP, most web services use HTTP as their underlying protocol. Additionally, although REST can work with any data format, usually REST means *JSON over HTTP* because most of the times data is exchanged in JSON format. There are also times where data is exchanged in plain text format, usually when the exchanged data is simple and there is no need for using JSON records.

Due to the way a RESTful service works, it should have an architecture that follows the next principles:

- Client–server design
- Stateless implementation
- Cacheable
- Uniform interface
- Layered system

### Why use Go for developing a RESTful server

[Go](https://golang.com) is a modern, open source and general-purpose programming language that began as an internal Google project and was officially announced at the end of 2009.

The main reasons that many people choose Go for creating RESTful servers and clients are the following:

- Go works pretty well with JSON data
- Go can create HTTP servers and clients easily
- Go has support for Unicode text
- Go has support for concurrency
- Go code is easy to read and write
- Go is really good at creating command line utilities

### Principles of RESTFul services

According to the HTTP protocol, you are allowed to perform the following operations on an HTTP server:

- `POST`, which is usually used for creating new resources.
- `GET`, which is usually used for reading (*getting*) existing resources.
- `PUT`, which is usually used for updating existing resources. As a convention, a `PUT` request should contain the full and updated version of an existing resource.
- `DELETE`, which is usually used for deleting existing resources.
- `PATCH`, which is usually used for updating existing resources. A `PATCH` request only contains the modifications to an existing resource.

These are not strict rules – they are just guidelines. The important thing here is that everything you do, especially when it is out of the ordinary, must be well documented.

There also exist some conventions regarding the returning HTTP status code of each client request. The most popular HTTP status codes as well as their meaning are as follows:

- `200` means that everything went well and the specified action was executed without any issues.
- `201` means that the desired resource was *created*.
- `202` means that the request was *accepted* and is currently being processed. This is usually used when an action takes too much time to complete.
- `301` means that the requested resource has been *moved permanently* – the new URI should be part of the response. This is rarely used in RESTful services because usually you use *API versioning*.
- `400` means that there was a *bad request* and that you should change your initial request before sending it again.
- `401` means that the client tried to access a protected request without *authorization*.
- `403` means that the client does not have the required permissions for accessing a resource even though the client is property authorized. In UNIX terminology, `403` means that the user does not have the required privileges to perform an action.
- `404` means that the resource was not found at the moment.
- `405` means that the client used a method that is not *allowed by the type of resource*.
- `500` means internal server error – this is not a problem with the client and it probably indicates a server failure.
- `501` means that the particular request is *not yet implemented*.

The important thing here is that you should send back the appropriate HTTP status code in order to inform the client about what happened with a request. It goes without says that the client should *always* examine the HTTP status code first before using any information from the body of the response.

### Routing requests

The single most important task of a RESTful server is routing incoming requests to the appropriate handler, which is usually a separate function. This guide is going to use the default Go HTTP router as implemented in the `net/http` Go package.

{{< note >}}
In the next guide we are going to use `gorilla/mux` for routing HTTP requests. You can find more information about `gorilla/mux` [here](https://github.com/gorilla/mux).
{{< /note >}}

### About the default Go router

The `net/http` package offers functions and data types that allow you to develop powerful web servers and clients. The `http.Set()` and `http.Get()` methods can be used to make HTTP and HTTPS requests, whereas the `http.ListenAndServe()` function is used for creating web servers by specifying the IP address and the TCP port number to which the server will listen to, given the user specified handler function or functions that will handle incoming requests. As most REST APIs have support for multiple end points, you will end up needing multiple discrete functions for handling incoming requests, which also leads to a better design of your services.

The simplest way to define the supported endpoints as well as the handler function that will respond to each client request is with the use of `http.HandleFunc()`. However, part of the `net/http` package is the `ServeMux` [type](https://golang.org/pkg/net/http/#ServeMux), which is an HTTP request multiplexer that provides a slightly different way of defining handler functions and end points. If you do not create and configure your own `ServeMux` variable, then `net/http` and `http.HandleFunc()` will use `DefaultServeMux`, which is the default `ServeMux`.

Note that if a function has the `func(http.ResponseWriter, *http.Request)` signature, then it can be converted into a `http.HandlerFunc` **type** and be used by the `ServeMux` type and its `Handle()` method. On the other hand, the `http.HandleFunc()` **function** does that conversion automatically while using `DefaultServeMux` internally.

Moreover, when using a different `ServeMux` than the default one, you should do that conversion explicitly by calling `http.HandlerFunc()`, which makes the `http.HandlerFunc` **type** to act as an *adapter* that allows the use of ordinary functions as HTTP handlers provided that they have the appropriate signature.

As an example, for the `/time` end point and the `timeHandler()` handler function, you should call `mux.Handle()` as `mux.Handle("/time", http.HandlerFunc(timeHandler))`. If you were using `http.HandleFunc()` and as a consequence `DefaultServeMux`, then you should call `http.HandleFunc("/time", timeHandler)` instead.

After this quick and somehow theoretical introduction, it is time to begin talking about more practical topics, beginning with the implementation of a simple client that logins to an existing RESTful server.

## Login to a RESTful server

This section will present the code of a simple client that connects to an existing RESTful server in order to get an authentication token.
The endpoint that is going to be visited on the server is `/api/login`. The output of a successful login request is an authentication token, which is returned by the server as a string.

### Details about the login RESTful server

In order to login to that particular server, you will need to send a JSON message of the following format:

{{< output >}}
{
  "user": "admin",
  "password": "admin"
}
{{< /output >}}

The possible server responses are the following:

- On successful login, the REST endpoint returns a security token in the response body and an HTTP status code of `200`.
- On unsuccessful login, the REST endpoint returns an HTTP status code of `401` and a body with the `UNAUTHORIZED` value.

The important thing to remember here is that apart from the endpoint, the format of the JSON message and the server HTTP response codes, you need no other information in order to be able to communicate with the RESTful server, which acts as a black box to your client.

### The implementation

The Go code of the login client is the following:

{{< file "./client.go" go >}}
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "os"
    "time"
)

type User struct {
    Username string `json:"user"`
    Password string `json:"password"`
}

func loginEndpoint(server string, user User) (int, string) {
    userMarshall, _ := json.Marshal(user)
    u := bytes.NewReader(userMarshall)

    req, err := http.NewRequest("POST", server+endPoint, u)
    if err != nil {
        fmt.Println("Error in req: ", err)
        return 400, ""
    }
    req.Header.Set("Content-Type", "application/json")

    c := &http.Client{
        Timeout: 15 * time.Second,
    }

    resp, err := c.Do(req)
    defer resp.Body.Close()

    if resp == nil || (resp.StatusCode == http.StatusNotFound) {
        return resp.StatusCode, ""
    }

    data, _ := ioutil.ReadAll(resp.Body)
    return resp.StatusCode, string(data)
}

const endPoint = "/api/login"

func main() {
    if len(os.Args) != 4 {
        fmt.Println("Wrong number of arguments!")
        fmt.Println("Need: Server username password")
        return
    }

    server := os.Args[1]
    username := os.Args[2]
    password := os.Args[3]
    loginInfo := User{username, password}

    HTTPcode, token := loginEndpoint(server, loginInfo)

    if HTTPcode != 200 {
        fmt.Println("Return code:", HTTPcode)
        return
    }
    fmt.Println("Authentication token:", token)
}
{{< /file >}}

`login.go` requires three command line arguments in the following order:

- First, the HTTP address of the RESTful server that supports the `/api/login` endpoint.
- Second, the username the user will use to login.
- Third, the password the user will use to login.

If you execute the `login.go` program without providing any command line arguments, you will get the following output:

    go run login.go

{{< output >}}
go run login.go 
Wrong number of arguments!
Need: Server username password
{{< /output >}}

If everything is fine, `login.go` will return an authentication token that will be used in all future server interactions.

   go run login.go http://localhost:1234 admin admin

{{< output >}}
Authentication token: 3f7ae833-7fc8-4d9b-b5cf-2eaf2b1da65b
{{< /output >}}

If the login information is not successful, you will get the following kind of output from the program:

   go run login.go http://localhost:1234 admin admi

{{< output >}}
Return code: 401
{{< /output >}}

In this case, the password was wrongly typed and as a result the login process has failed.

### About Marshalling and UnMarshalling

In order to send your JSON data over the network, you will need to marshal it first. Similarly, in order to convert the JSON data that you have read over the network into JSON records, you will need to unmarshal it first.

The `json:"user"` and `json:"password"` strings found in the definition of the `User` structure are called *struct tags*. These *struct* tags change the name of the output in the JSON record.

Apart from the `json.Marshal()` and `json.Unmarshal()` functions, the `json` package offers the `Encoder` and `Decoder` types as well as some related methods for encoding and decoding JSON data. The difference between the marshalling functions and the functionality offered by the `Encoder` and `Decoder` types is that the latter write the JSON encoding directly to an `io.Writer` and read encoded JSON data directly from an `io.Reader`, respectively. As a result the use of `Encoder` and `Decoder` does not require any extra memory for storing or reading the encoded JSON data. Although for smaller applications, this might not be a problem, it can be a real issue when working with large amounts of JSON data.

{{< note >}}
You can learn more about Go Structures and JSON in [this Linode guide](https://www.linode.com/docs/development/go/go-structures/).
{{< /note >}}

### How `login.go` works

There exist three main points in `login.go`:

- First, the interaction with the server happens inside the `loginEndpoint()` function.
- Second, you will need to define the JSON record that will be used for sending your data to the server (`User`). Generally speaking, if you are going to create both the client and the server of a RESTful service, it is good to share your data type definitions using a separate Go package.
- Third, you will need to examine the return values of `loginEndpoint()` on your own in order to find out whether the login attempt was successful or not.

### Using `curl(1)`

In this subsection you will see how to perform the same action using the handy `curl(1)` utility.

    curl -H 'Content-Type: application/json' --request POST --data '{"user":"admin","password":"admin"}' http://localhost:1234/api/login

{{< output >}}
8bb50137-3653-47cd-9f6b-7a5108918deb
{{< /output >}}

So, in order to send JSON data via `curl(1)`, you will need to use `-H 'Content-Type: application/json'` as well as `--data` followed by a JSON record. The first option specifies that the content type will be JSON whereas the second option is for defining the actual JSON data.

Now that you know some handy implementation details about RESTful services, let us continue with developing a RESTful server in order to begin understanding how the server part is defined and implemented.

## A Simple RESTful Server

In this section we are going to implement a simple RESTful server in Go. Note that usually RESTful services exchange messages using the JSON format, which is how the presented server will work. However, there exist some cases where returning a single string is simpler, faster and more convenient.

The presented RESTful server allows you to work with *username and password pairs*. All available pairs will be stored in memory using a Go map for reasons of simplicity. The key of the map will be the username and the value will be the password. Although this approach requires that you convert from JSON to plain text and vice versa, it is fast and allows you to search for existing usernames easily using the characteristics of Go maps.

The end points that the REST API will support are the following:

- `/time`, which returns the time on the server as a string. On success, it will return `200` and on failure it will return `400`.
- `/get`, which tells whether the given username already exists. The user data is given as a JSON record. On success, it will return `200` and on failure it will return `404`.
- `/add`, which adds a new user. The user data is given as a JSON record. On success, it will return `200` and on failure it will return `400`.
- `/delete`, which deletes a user if the username already exists. The user data is given as a JSON record. On success, it will return `200` and on failure it will return `404`.
- `/`, which is the default handler if there is no other match. In our implementation, `/` will return a message. That endpoint returns `404` all the time - it is a good way to check the health of a RESTful server.

Note the following Go representations of the HTTP Status codes used in the RESTful server.

| HTTP Status Code | Go Representation |
| ---------------- | ----------------- |
| `200` | `http.StatusOK` |
| `400` | `http.StatusBadRequest` |
| `404` | `http.StatusNotFound` |

All these data can be found in the documentation of the [net/http](https://golang.org/pkg/net/http/) Go package.

The one thing that is really missing from `server.go` is the server returning multiple JSON records – for example returning all available usernames and passwords. But for that, we will have to wait for the next guide.

### Implementing the Server

The Go code for the RESTful server is the following:

{{< file "./server.go" go >}}
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
    "os"
    "time"
)

type User struct {
    Username string `json:"user"`
    Password string `json:"password"`
}

// user is just a global variable
var user User

// PORT is where the web server listens to
var PORT = ":1234"

// DATA is the map that holds User records
var DATA = make(map[string]string)

func defaultHandler(w http.ResponseWriter, r *http.Request) {
    log.Println("Serving:", r.URL.Path, "from", r.Host)
    w.WriteHeader(http.StatusNotFound)
    Body := "Thanks for visiting!\n"
    fmt.Fprintf(w, "%s", Body)
}

func timeHandler(w http.ResponseWriter, r *http.Request) {
    log.Println("Serving:", r.URL.Path, "from", r.Host)
    t := time.Now().Format(time.RFC1123)
    Body := "The current time is:" + t + "\n"
    fmt.Fprintf(w, "%s", Body)
}

func addHandler(w http.ResponseWriter, r *http.Request) {
    log.Println("Serving:", r.URL.Path, "from", r.Host)
    d, err := ioutil.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Error:", http.StatusBadRequest)
        return
    }

    err = json.Unmarshal(d, &user)
    if err != nil {
        log.Println(err)
        http.Error(w, "Error:", http.StatusBadRequest)
        return
    }

    if user.Username != "" {
        DATA[user.Username] = user.Password
        log.Println(DATA)
        w.WriteHeader(http.StatusOK)
    } else {
        http.Error(w, "Error:", http.StatusBadRequest)
        return
    }
}

func getHandler(w http.ResponseWriter, r *http.Request) {
    log.Println("Serving:", r.URL.Path, "from", r.Host)
    d, err := ioutil.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "ReadAll - Error", http.StatusBadRequest)
        return
    }

    err = json.Unmarshal(d, &user)
    if err != nil {
        log.Println(err)
        http.Error(w, "Unmarshal - Error", http.StatusBadRequest)
        return
    }
    fmt.Println(user)

    _, ok := DATA[user.Username]
    if ok && user.Username != "" {
        log.Println("Found!")
        w.WriteHeader(http.StatusOK)
        fmt.Fprintf(w, "%s\n", d)
    } else {
        log.Println("Not found!")
        w.WriteHeader(http.StatusNotFound)
        http.Error(w, "Map - Resource not found!", http.StatusNotFound)
    }
    return
}

func deleteHandler(w http.ResponseWriter, r *http.Request) {
    log.Println("Serving:", r.URL.Path, "from", r.Host)
    d, err := ioutil.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "ReadAll - Error", http.StatusBadRequest)
        return
    }

    err = json.Unmarshal(d, &user)
    if err != nil {
        log.Println(err)
        http.Error(w, "Unmarshal - Error", http.StatusBadRequest)
        return
    }
    log.Println(user)

    _, ok := DATA[user.Username]
    if ok && user.Username != "" {
        // If the password is correct delete user
        if user.Password == DATA[user.Username] {
            delete(DATA, user.Username)
            // 302 response missing Location header
            w.WriteHeader(http.StatusOK)
            fmt.Fprintf(w, "%s\n", d)
            log.Println(DATA)
        }
    } else {
        log.Println("User", user.Username, "Not found!")
        w.WriteHeader(http.StatusNotFound)
        http.Error(w, "Delete - Resource not found!", http.StatusNotFound)
    }
    log.Println("After:", DATA)
    return
}

func main() {
    arguments := os.Args
    if len(arguments) != 1 {
        PORT = ":" + arguments[1]
    }

    mux := http.NewServeMux()
    s := &http.Server{
        Addr:         PORT,
        Handler:      mux,
        IdleTimeout:  10 * time.Second,
        ReadTimeout:  time.Second,
        WriteTimeout: time.Second,
    }

    mux.Handle("/time", http.HandlerFunc(timeHandler))
    mux.Handle("/add", http.HandlerFunc(addHandler))
    mux.Handle("/get", http.HandlerFunc(getHandler))
    mux.Handle("/delete", http.HandlerFunc(deleteHandler))
    mux.Handle("/", http.HandlerFunc(defaultHandler))

    fmt.Println("Ready to serve at", PORT)
    err := s.ListenAndServe()
    if err != nil {
        fmt.Println(err)
        return
    }
}
{{< /file >}}

If you execute the program above without any command line arguments, the following message will be generated by the program:

    go run server.go

{{< output >}}
Ready to serve at :1234
{{< /output >}}

If you want to change the default TCP port number, you will have to give it as a command line argument. Executing `server.go` with an integer argument will generate the following output:

    go run server.go 8888

{{< output >}}
Ready to serve at :8888
{{< /output >}}

Note that the implementation of the presented RESTful server is far from perfect. The following is a list of improvements that we can do:

- Use a better HTTP router (*request multiplexer*) than the default one.
- Work with real data using bigger JSON records.
- Verify that the data we receive from the client or from the server is valid.
- Put all handler functions into a separate Go package. Do not forget that only functions whose name begins with an uppercase letter are *exported* from Go packages – this is a Go rule that also applies to variable names.
- Accept certain methods for some HTTP requests. As an example, requiring `DELETE` for the `/delete` endpoint looks rational.

### Explaining the code of the REST Server

The way `server.go` works can be explained by the following bullet points:

- The functions of `server.go` return nothing to the `main()` function. This happens because data is exchanged using HTTP requests, which means that the desired HTTP code as well as the required data are being transferred over the network. Therefore, the purpose of the `main()` function is to setup the router and begin the HTTP server using `ListenAndServe()`.
- The `log.Println("Serving:", r.URL.Path, "from", r.Host)` statement in each handler function is used for better understanding the URL of the request as well as the hostname the client runs on.
- All data is kept in the `DATA` map, which is a global variable.
- The `defaultHandler()` handler function is used for `/` as well as any other URL that is not a match by the existing rules. This function just returns a message as well as the `http.StatusNotFound` HTTP status code.
- The `timeHandler()` handler function returns the current time on the server and (*automatically)* the `200` HTTP status code.
- The `addHandler()` handler function adds a new entry in the Go map, provided that the `username` field is not empty. The client input is read using `ioutil.ReadAll(r.Body)` before being processed by the `json.Unmarshal()` function in order to become a JSON record. On success, the HTTP status code that is returned is `http.StatusOK`. On failure, the handler function returns `http.StatusBadRequest`.
- The `getHandler()` handler function works the same way as `addHandler()`. However, if the input JSON record cannot be found on the `DATA` map, it sends an error message using `http.Error()`.
- The `deleteHandler()` handler function checks whether a JSON record is already stored in the Go map before deleting it using `delete()`. On success, the HTTP status code that is returned is `http.StatusOK`. On failure, `deleteHandler()` returns `http.StatusNotFound`.

The next guide in the REST API series will improve the functionality and the implementation of the RESTful server. For now, try to experiment with the Go code of `server.go` and add your own handler functions.

### Using curl as a client

The easiest way to test your RESTful server if you have not developed a client for it is by using `curl(1)`. The following `curl(1)` commands test the various endpoints of the implemented REST API.

{{< note >}}
If you include data in a `curl(1)` command and you do not specify an HTTP verb, then `curl(1)` will automatically default to `-X POST`.
{{< /note >}}

We will begin with the `/` endpoint:

    curl localhost:1234/

{{< output >}}
Thanks for visiting!
{{< /output >}}

Then, we will test the `/add` endpoint:

    curl -H 'Content-Type: application/json' -d '{"user": "mtsouk", "password" : "admin"}' http://localhost:1234/add -v

{{< output >}}
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 1234 (#0)
> POST /add HTTP/1.1
> Host: localhost:1234
> User-Agent: curl/7.64.1
> Accept: */*
> Content-Type: application/json
> Content-Length: 40
> 
* upload completely sent off: 40 out of 40 bytes
< HTTP/1.1 200 OK
< Date: Fri, 01 May 2020 19:10:10 GMT
< Content-Length: 0
< 
* Connection #0 to host localhost left intact
* Closing connection 0
{{< /output >}}

The `-d` option is used for passing data to a server and is equivalent to the `--data` option whereas the `-v` option generates more verbose output.

If the JSON record is not correct or the input is not being understood by the server, the output of `curl(1)` will be as follows:

    curl -H -d '{"user": "admin"}' http://localhost:1234/add

{{< output >}}
curl: (3) URL using bad/illegal format or missing URL
Error:
{{< /output >}}

After that, we will interact with the `/get` endpoint:

    curl -H 'Content-Type: application/json' -d '{"user": "admin", "password" : "admin"}' http://localhost:1234/get

{{< output >}}
{"user": "admin", "password" : "admin"}
{{< /output >}}

The output verifies that the user defined by `{"user": "admin", "password" : "admin"}` was found in the server. If the user does not exist, the output will be different.

    curl -H 'Content-Type: application/json' -d '{"user": "admin", "password" : "admin"}' http://localhost:1234/get

{{< output >}}
Map - Resource not found!
{{< /output >}}

Last, we will test the `/delete` endpoint:

    curl -H 'Content-Type: application/json' -d '{"user": "mtsouk", "password" : "admin"}' http://localhost:1234/delete

{{< output >}}
{"user": "mtsouk", "password" : "admin"}
{{< /output >}}

If the user is not found in the server, the output will be different:

{{< output >}}
Delete - Resource not found!
{{< /output >}}

{{< note >}}
If you want to get all the details and all the data from the connection, you can use `curl(1)` with the `-v` option.
{{< /note >}}

The output generated by the server process would look like the following:

{{< output >}}
Ready to serve at :1234
2020/05/01 22:06:32 Serving: / from localhost:1234
2020/05/01 22:06:46 Serving: / from localhost:1234
2020/05/01 22:06:57 Serving: /add from localhost:1234
2020/05/01 22:06:57 unexpected end of JSON input
2020/05/01 22:07:04 Serving: /add from localhost:1234
2020/05/01 22:07:04 unexpected end of JSON input
2020/05/01 22:07:28 Serving: /add from localhost:1234
2020/05/01 22:07:28 map[admin:admin]
2020/05/01 22:07:57 Serving: /add from localhost:1234
2020/05/01 22:07:57 map[admin:admin]
2020/05/01 22:08:10 Serving: /add from localhost:1234
2020/05/01 22:08:10 unexpected end of JSON input
2020/05/01 22:09:04 Serving: /add from localhost:1234
2020/05/01 22:09:04 map[admin:admin]
2020/05/01 22:09:37 Serving: /add from localhost:1234
2020/05/01 22:09:37 map[admin:admin]
2020/05/01 22:10:10 Serving: /add from localhost:1234
2020/05/01 22:10:10 map[admin:admin mtsouk:admin]
2020/05/01 22:11:12 Serving: /get from localhost:1234
{admin admin}
2020/05/01 22:11:12 Found!
2020/05/01 22:12:04 Serving: /get from localhost:1234
{doesNotExist admin}
2020/05/01 22:12:04 Not found!
2020/05/01 22:12:04 http: superfluous response.WriteHeader call from main.getHandler (server.go:90)
2020/05/01 22:13:07 Serving: /delete from localhost:1234
2020/05/01 22:13:07 {mtsouk admin}
2020/05/01 22:13:07 map[admin:admin]
2020/05/01 22:13:07 After: map[admin:admin]
2020/05/01 22:13:10 Serving: /delete from localhost:1234
2020/05/01 22:13:10 {mtsouk admin}
2020/05/01 22:13:10 User mtsouk Not found!
2020/05/01 22:13:10 http: superfluous response.WriteHeader call from main.deleteHandler (server.go:124)
2020/05/01 22:13:10 After: map[admin:admin]
{{< /output >}}

## A Simple RESTful Client

This section will present a simple REST client written in Go for working with the previously developed server. Note that the **client should already know** about the endpoints that are implemented by the server as well as the data they require in order to call them. For reasons of simplicity, the presented client will automatically call all available functions one by one.

- `addEndpoint()`, which uses the `/add` endpoint.
- `getEndpoint()`, which uses the `/get` endpoint.
- `deleteEndpoint()`, which uses the `/delete` endpoint.
- `timeEndpoint()`, which uses the `/time` endpoint.
- `slashEndpoint()`, which uses the `/` endpoint.

Additionally, the JSON data will be included in the Go code.

Should you wish to make the client better, you should wait for a forthcoming guide that will showcase the use of [cobra](https://github.com/spf13/cobra) for creating better command line utilities that support commands. You can find more information about `cobra` [here](https://www.linode.com/docs/development/go/using-cobra/).

The Go code for the client is the following:

{{< file "./client.go" go >}}
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "os"
    "time"
)

type User struct {
    Username string `json:"user"`
    Password string `json:"password"`
}

var u1 = User{"admin", "admin"}
var u2 = User{"tsoukalos", "pass"}
var u3 = User{"", "pass"}

func deleteEndpoint(server string, user User) int {
    userMarshall, _ := json.Marshal(user)
    u := bytes.NewReader(userMarshall)

    req, err := http.NewRequest("DELETE", server+deleteEndPoint, u)
    if err != nil {
        fmt.Println("Error in req: ", err)
        return http.StatusInternalServerError
    }
    req.Header.Set("Content-Type", "application/json")

    c := &http.Client{
        Timeout: 15 * time.Second,
    }

    resp, err := c.Do(req)
    defer resp.Body.Close()

    if err != nil {
        fmt.Println("Error:", err)
    }
    if resp == nil {
        return http.StatusNotFound
    }

    data, err := ioutil.ReadAll(resp.Body)
    fmt.Print("/delete returned: ", string(data))
    if err != nil {
        fmt.Println("Error:", err)
    }
    return resp.StatusCode
}

func getEndpoint(server string, user User) int {
    userMarshall, _ := json.Marshal(user)
    u := bytes.NewReader(userMarshall)

    req, err := http.NewRequest("GET", server+getEndPoint, u)
    if err != nil {
        fmt.Println("Error in req: ", err)
        return http.StatusInternalServerError
    }
    req.Header.Set("Content-Type", "application/json")

    c := &http.Client{
        Timeout: 15 * time.Second,
    }

    resp, err := c.Do(req)
    defer resp.Body.Close()

    if err != nil {
        fmt.Println("Error:", err)
    }
    if resp == nil {
        return http.StatusNotFound
    }

    data, err := ioutil.ReadAll(resp.Body)
    fmt.Print("/get returned: ", string(data))
    if err != nil {
        fmt.Println("Error:", err)
    }
    return resp.StatusCode
}

func addEndpoint(server string, user User) int {
    userMarshall, _ := json.Marshal(user)
    u := bytes.NewReader(userMarshall)

    req, err := http.NewRequest("POST", server+addEndPoint, u)
    if err != nil {
        fmt.Println("Error in req: ", err)
        return http.StatusInternalServerError
    }
    req.Header.Set("Content-Type", "application/json")

    c := &http.Client{
        Timeout: 15 * time.Second,
    }

    resp, err := c.Do(req)
    defer resp.Body.Close()

    if resp == nil || (resp.StatusCode == http.StatusNotFound) {
        return resp.StatusCode
    }

    return resp.StatusCode
}

func timeEndpoint(server string) (int, string) {
    req, err := http.NewRequest("POST", server+timeEndPoint, nil)
    if err != nil {
        fmt.Println("Error in req: ", err)
        return http.StatusInternalServerError, ""
    }

    c := &http.Client{
        Timeout: 15 * time.Second,
    }

    resp, err := c.Do(req)
    defer resp.Body.Close()

    if resp == nil || (resp.StatusCode == http.StatusNotFound) {
        return resp.StatusCode, ""
    }

    data, _ := ioutil.ReadAll(resp.Body)
    return resp.StatusCode, string(data)
}

func slashEndpoint(server, URL string) (int, string) {
    req, err := http.NewRequest("POST", server+URL, nil)
    if err != nil {
        fmt.Println("Error in req: ", err)
        return http.StatusInternalServerError, ""
    }

    c := &http.Client{
        Timeout: 15 * time.Second,
    }

    resp, err := c.Do(req)
    defer resp.Body.Close()

    if resp == nil {
        return resp.StatusCode, ""
    }

    data, _ := ioutil.ReadAll(resp.Body)
    return resp.StatusCode, string(data)
}

const addEndPoint = "/add"
const getEndPoint = "/get"
const deleteEndPoint = "/delete"
const timeEndPoint = "/time"

func main() {
    if len(os.Args) != 2 {
        fmt.Println("Wrong number of arguments!")
        fmt.Println("Need: Server")
        return
    }
    server := os.Args[1]

    fmt.Println("/add")
    HTTPcode := addEndpoint(server, u1)
    if HTTPcode != http.StatusOK {
        fmt.Println("u1 Return code:", HTTPcode)
    } else {
        fmt.Println("u1 Data added:", u1, HTTPcode)
    }

    HTTPcode = addEndpoint(server, u2)
    if HTTPcode != http.StatusOK {
        fmt.Println("u2 Return code:", HTTPcode)
    } else {
        fmt.Println("u2 Data added:", u2, HTTPcode)
    }

    HTTPcode = addEndpoint(server, u3)
    if HTTPcode != http.StatusOK {
        fmt.Println("u3 Return code:", HTTPcode)
    } else {
        fmt.Println("u3 Data added:", u3, HTTPcode)
    }

    fmt.Println("/get")
    HTTPcode = getEndpoint(server, u1)
    fmt.Println("/get u1 return code:", HTTPcode)
    HTTPcode = getEndpoint(server, u2)
    fmt.Println("/get u2 return code:", HTTPcode)
    HTTPcode = getEndpoint(server, u3)
    fmt.Println("/get u3 return code:", HTTPcode)

    fmt.Println("/delete")
    HTTPcode = deleteEndpoint(server, u1)
    fmt.Println("/delete u1 return code:", HTTPcode)
    HTTPcode = deleteEndpoint(server, u1)
    fmt.Println("/delete u1 return code:", HTTPcode)
    HTTPcode = deleteEndpoint(server, u2)
    fmt.Println("/delete u2 return code:", HTTPcode)
    HTTPcode = deleteEndpoint(server, u3)
    fmt.Println("/delete u3 return code:", HTTPcode)

    fmt.Println("/time")
    HTTPcode, myTime := timeEndpoint(server)
    fmt.Print("/time returned: ", HTTPcode, " ", myTime)
    time.Sleep(time.Second)
    HTTPcode, myTime = timeEndpoint(server)
    fmt.Print("/time returned: ", HTTPcode, " ", myTime)

    fmt.Println("/")
    URL := "/"
    HTTPcode, response := slashEndpoint(server, URL)
    fmt.Print("/ returned: ", HTTPcode, " with response: ", response)

    fmt.Println("/what")
    URL = "/what"
    HTTPcode, response = slashEndpoint(server, URL)
    fmt.Print(URL, " returned: ", HTTPcode, " with response: ", response)
}
{{< /file >}}

If you execute the program above without any command line arguments, you will get the following message:

    go run client.go

{{< output >}}
Wrong number of arguments!
Need: Server
{{< /output >}}

If you execute the program using a valid command line argument, you will get the following kind of output back:

    go run client.go http://localhost:1234

{{< output >}}
/add
u1 Data added: {admin admin} 200
u2 Data added: {tsoukalos pass} 200
u3 Return code: 400
/get
/get returned: {"user":"admin","password":"admin"}
/get u1 return code: 200
/get returned: {"user":"tsoukalos","password":"pass"}
/get u2 return code: 200
/get returned: Map - Resource not found!
/get u3 return code: 404
/delete
/delete returned: {"user":"admin","password":"admin"}
/delete u1 return code: 200
/delete returned: Delete - Resource not found!
/delete u1 return code: 404
/delete returned: {"user":"tsoukalos","password":"pass"}
/delete u2 return code: 200
/delete returned: Delete - Resource not found!
/delete u3 return code: 404
/time
/time returned: 200 The current time is:Fri, 01 May 2020 22:27:37 EEST
/time returned: 200 The current time is:Fri, 01 May 2020 22:27:38 EEST
/
/ returned: 404 with response: Thanks for visiting!
/what
/what returned: 404 with response: Thanks for visiting!
{{< /output >}}

Put simply, in this case the `client.go` utility is mainly used for testing the operation of the RESTful server. However, it is considered a good practice to also write separate test code for testing your HTTP handlers – you will see how in a forthcoming guide.

### Explaining the code of the RESTful Client

Note that the Go code of the RESTful client has many similarities to the code of the server process. However, there exist some differences.

- The main difference is that the client does not need to send any HTTP status codes.
- Another difference is that the client should examine the returned HTTP status code in order to understand if the call was successful.
- The client must know about the endpoints in order to use them.
- The `User` structure can be found in both `server.go` and `client.go`, which is a bad programming practice that will correct in the future.
- The client does not unmarshal the data that is returned by the server not because it is not necessary but because it will not have to process it. For reasons of simplicity, the Go code converts the network data into regular text using `string()`.
- All functions have to return the HTTP Status code to the caller function, which in this case is `main()`, in order to inform the caller function what happened.

A forthcoming guide will shed more light on the details of programming a RESTful client. For now, experiment with the existing code to understand it better.

## Summary

In this guide we talked about the principles of RESTful services, the use of `http.ListenAndServe()`, illustrated the use of `curl(1)`, presented the implementation of a RESTful server and two RESTful clients and saw all these programs in action. Although all these *working* implementations are far from perfect, they can be used for understanding the theory and the principles behind REST APIs.

The next guide will go deeper into the implementation of the server part and develop a much more robust and skillful RESTful server. In the meantime, feel free to experiment with the code of this guide, create and implement your own simple REST API to support your RESTful service and make your own mistakes in the process!
