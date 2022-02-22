---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'Developing a powerful RESTful server'
keywords: ["UNIX", "REST API", "RESTful", "Go", "Golang"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-05-22
modified_by:
  name: Linode
title: 'Learn how to implement a RESTful server'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[gorilla/mux](https://github.com/gorilla/mux)'
  - '[Gorilla Web Toolkit](http://www.gorillatoolkit.org/pkg/mux)'
  - '[The Go Playground](https://play.golang.org/)'
  - '[Mastering Go, 2nd edition](https://www.packtpub.com/programming/mastering-go-second-edition)'
  - '[REST API](https://en.wikipedia.org/wiki/Representational_state_transfer)'
  - '[Hypertext Transfer Protocol (HTTP/1.1)](https://tools.ietf.org/html/rfc7231)'
  - '[List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)'
  - '[SQLite3](https://www.sqlite.org/)'
  - '[Go validator package](https://github.com/go-playground/validator)'
---

## Introduction

In this guide we will develop a RESTful server with many advanced features including the use of a powerful Go package for routing HTTP requests, data persistency and JSON validation.

{{< note >}}
This guide is written for a non-root user. Depending on your configuration, some commands might require the help of `sudo` in order to get property executed. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

In this guide you will learn to:

- Define a REST API and a RESTful server
- Use the [gorilla/mux](https://github.com/gorilla/mux) Go package
- Validate JSON data
- Define the supported HTTP methods for each endpoint
- Create an endpoint that can return back multiple JSON records
- Use the `Encoder` and `Decoder` types for working with JSON data
- Have data persistency by using a Database
- Pass parameters to the server using a URI
- Update existing entries
- Use `curl(1)` for testing the RESTful server

## Before You Begin

To run the examples in this guide, your workstation or server will need to have Go installed, and the `go` CLI will need to be set in your terminal’s `PATH`. If you install Go using the Linux package manager that comes with your Linux distribution, you will most likely not need to worry about setting the `PATH` shell variable.

{{< note >}}
This guide was written with Go version 1.14.
{{< /note >}}

As a reference, have in mind that the *HTTP methods* supported by Go are defined as constants in `net/http` and are the following:

{{< file "" go >}}
const (
    MethodGet     = "GET"
    MethodHead    = "HEAD"
    MethodPost    = "POST"
    MethodPut     = "PUT"
    MethodPatch   = "PATCH" // RFC 5789
    MethodDelete  = "DELETE"
    MethodConnect = "CONNECT"
    MethodOptions = "OPTIONS"
    MethodTrace   = "TRACE"
)
{{< /file >}}

## The REST API of the Server

The RESTful server is going to support the following endpoints:

- `/`, for catching and serving everything that does not match any of the existing endpoints.
- `/getall`, for getting the full contents of the database. Executing that requires a user with administrative privileges, which is sent to the server using the `UserPass` structure. This endpoint might return multiple JSON records of the `Input` data type.
- `/update`, for updating the username, the password or the `Admin` value of a user – the ID of the user will remain the same. This command requires two JSON records as input. The first one is the user issuing the command, which should have administrative privileges, and the second one is the user that is going to be updated. Both users are given using the `Input` structure. For reasons of efficiency, the server will expect the data as an array of `Input` structures with 2 elements – each element is a JSON record.
- `/getid`, for finding out the ID of a user, given the username and password of that user that will be sent to the server process using the `UserPass` structure.
- `/username/ID`, which will work on the user with ID equal to `<id>`. The actual action that is going to be performed depends on the HTTP method used. The `DELETE` method will delete that user whereas the `GET` method will return the user information as a `User` structure. This endpoint should be issued by a user with administrative privileges – this data is sent to the server using the `UserPass` structure.
- `/logged`, for getting a list of all logged in users. Executing that requires a user with administrative privileges, which is sent to the user using the `UserPass` structure.
- `/login`, for logging in to the system. The username and the password will be sent to the server process using the `UserPass` structure.
- `/logout`, for logging out of the system. The username and the password will be sent to the server process using the `UserPass` structure.
- `/add`, for adding a new user to the database. This command requires two JSON records as input. The first one is the user issuing the command, which should have administrative privileges, and the second one is the user that is going to be added to the database. Both users are given using the `Input` structure. For reasons of efficiency, the server will expect the data as an array of `Input` structures with 2 elements - each element is a JSON record.
- `/time`, for getting the time from the server machine. This endpoint does not require any input.

{{< note >}}
The API of a web application helps you implement the functionality that you have in mind. However, this is a job for the client, not the server. The job of the server is to facilitate the job of the client as much as possible by supporting a simple yet fully working functionality through a properly defined and implemented REST API.
{{< /note >}}

The following table explains whether an HTTP method (*action*) is supported by an endpoint or not.

| Resource | `POST` | `GET`  | `PUT` | `DELETE` |
| --------- | ------ | ------ | ----- | -------- |
| `/getall` | NO | YES | NO | NO |
| `/logged` | NO | YES | NO | NO |
| `/time` | NO | YES | NO | NO |
| `/getid` | NO | YES | NO | NO |
| `update` | NO | NO | YES | NO |
| `/username/id` | NO | YES | NO | YES |
| `/` | YES | YES | YES | YES |
| `/add` | YES | NO | NO | NO |
| `/login` | YES | NO | NO | NO |
| `/logout` | YES | NO | NO | NO |

{{< note >}}
Sometimes, you might need to improvise or decide on your own about the behavior of an HTTP action in relation to a resource. There is nothing wrong with it as long as your decisions are well documented and correctly implemented. In the previous table, it is clearly stated that `PUT` is used for updating existing resources (`/update`).
{{< /note >}}

### Interacting with a Database

This subsection will discuss how the presented RESTful server is able to interact with a database, which is this case is [SQLite3](https://sqlite.org/). The main reason for using a database for your data in *data persistency*. Additionally, the main reason for using SQLite3 in this guide is simplicity – you can use any database you want as long as there exist a working Go driver for that database.

The following two Go programs show how you can save and retrieve data from a SQLite3 database in Go.

{{< file "./writeSQL.go" go >}}
package main

import (
  "database/sql"
  "fmt"
  "os"
  "strconv"

  _ "github.com/mattn/go-sqlite3"
)

func main() {
  arguments := os.Args
  if len(arguments) != 2 {
    fmt.Println("Need SQLite3 Database File")
    return
  }
  database := arguments[1]

  fmt.Println("Writing to SQLite3:", database)
  db, err := sql.Open("sqlite3", database)
  if err != nil {
    fmt.Println(nil)
    return
  }

  fmt.Println("Emptying database table.")
  _, _ = db.Exec("DROP TABLE data")

  fmt.Println("Creating table from scratch.")
  _, err = db.Exec("CREATE TABLE data (Username STRING, Password STRING, Admin Bool);")
  if err != nil {
    fmt.Println(nil)
    return
  }

  fmt.Println("Populating", database)
  stmt, _ := db.Prepare("INSERT INTO data(Username, Password, Admin) values(?,?,?)")
  for i := 20; i < 25; i++ {
    if i%2 == 0 {
      _, _ = stmt.Exec("name"+strconv.Itoa(i), "pass"+strconv.Itoa(2*i), true)
    } else {
      _, _ = stmt.Exec("name"+strconv.Itoa(i), "pass"+strconv.Itoa(2*i), false)
    }
  }
}
{{< /file >}}

Once you have your data in a SQLite3 database, it is easy to read it using Go code as illustrated in `readSQL.go`:

{{< file "./readSQL.go" go >}}
package main

import (
  "bytes"
  "database/sql"
  "encoding/json"
  "fmt"
  "os"

  "github.com/mactsouk/handlers"
  _ "github.com/mattn/go-sqlite3"
)

const (
  empty = ""
  tab   = "\t"
)

// PrettyJSON beautifies the printing of JSON records
func PrettyJSON(data interface{}) (string, error) {
  buffer := new(bytes.Buffer)
  encoder := json.NewEncoder(buffer)
  encoder.SetIndent(empty, tab)

  err := encoder.Encode(data)
  if err != nil {
    return empty, err
  }
  return buffer.String(), nil
}

func main() {
  arguments := os.Args
  if len(arguments) != 2 {
    fmt.Println("Need SQLite3 Database File")
    return
  }
  database := arguments[1]

  fmt.Println("Reading from SQLite3:", database)
  db, err := sql.Open("sqlite3", database)
  if err != nil {
    fmt.Println(err)
    return
  }

  rows, err := db.Query("SELECT * FROM data")
  if err != nil {
    fmt.Println(nil)
    return
  }

  var c1, c2 string
  var c3 bool

  for rows.Next() {
    err = rows.Scan(&c1, &c2, &c3)
    temp := handlers.Input{c1, c2, c3}
    t, _ := PrettyJSON(temp)
    fmt.Println(t)
  }
}
{{< /file >}}

Note that `readSQL.go` returns JSON records that are formatted using `PrettyJSON()`. Additionally, you will learn more about the code and the use of `github.com/mactsouk/handlers` in a while.

At this point, you can execute `writeSQL.go` to put some sample data into an SQLite3 database, which will be given as a command line argument:

    go run writeSQL.go /tmp/test.db

{{< output >}}
Writing to SQLite3: /tmp/test.db
Emptying database table.
Creating table from scratch.
Populating /tmp/test.db
{{< /output >}}

At this point, you can interact with SQLite3 to make sure that your data is in it:

    sqlite3 /tmp/test.db

{{< output >}}
SQLite version 3.28.0 2019-04-15 14:49:49
Enter ".help" for usage hints.
sqlite> .header on
sqlite> .mode column
sqlite> .schema data
CREATE TABLE data (Username STRING, Password STRING, Admin Bool);
sqlite> pragma table_info(data);
cid         name        type        notnull     dflt_value  pk
----------  ----------  ----------  ----------  ----------  ----------
0           Username    STRING      0                       0
1           Password    STRING      0                       0
2           Admin       Bool        0                       0
sqlite> select * from data;
Username    Password    Admin
----------  ----------  ----------
name20      pass40      1
name21      pass42      0
name22      pass44      1
name23      pass46      0
name24      pass48      1
{{< /output >}}

Executing `readSQL.go` will generate the following kind of output:

    go run readSQL.go /tmp/test.db

{{< output >}}
Reading from SQLite3: /tmp/test.db
{
        "user": "name20",
        "password": "pass40",
        "admin": true
}

{
        "user": "name21",
        "password": "pass42",
        "admin": false
}

{
        "user": "name22",
        "password": "pass44",
        "admin": true
}

{
        "user": "name23",
        "password": "pass46",
        "admin": false
}

{
        "user": "name24",
        "password": "pass48",
        "admin": true
}
{{< /output >}}

Some of the code of `writeSQL.go` and `readSQL.go` will be used for the development of the RESTful server.

### Routing requests using `gorilla/mux`

This guide will use a different library, which is named `gorilla/mux`, than the default Go library for routing HTTP requests. The main reason for doing so is that `gorilla/mux` is better and more efficient at complex routing tasks.

Although there exist many differences between `http.ServeMux` and `mux.Router`, the main difference is that `mux.Router` can **support multiple conditions** when matching a route with a handler function. This means that you will have to write less code to handle some options such as the HTTP method used for data exchange.

Let us begin by presenting some examples:

- `r.HandleFunc("/url", UrlHandlerFunction)`: The previous command will call the `UrlHandlerFunction` function each time `/url` is visited.
- `r.HandleFunc("/url", UrlHandlerFunction).Methods(http.MethodPut)`: This example shows how you can tell Gorilla to match specific HTTP methods (`PUT` in this case, which is defined by the use of `http.MethodPut`), which saves you from having to write code to do that manually, with a specific URL and handler function.
- `mux.NotFoundHandler = http.HandlerFunc(handlers.DefaultHandler)`: With Gorilla, the right way to match anything that is not a match by all the other paths is by using `mux.NotFoundHandler`.
- `mux.MethodNotAllowedHandler = notAllowed`: If a method is not allowed for an existing route, it will be handled with the help of `MethodNotAllowedHandler`. Please see the Go code of `rServer.go` for more details and the relevant Go code.
- `s.HandleFunc("/users/{id:[0-9]+}"), HandlerFunction)`: This last example shows that you can define a variable in a path using a name or a pattern and Gorilla will do the matching for you! If there is not a regular expression, then the match will be anything from the beginning slash to the next slash in the path.

Yes, `gorilla/mux` might be more difficult than the default Go router but you should understand by now the benefits of the `gorilla/mux` [package](https://github.com/gorilla/mux) when creating RESTful services.

### Passing Parameters to the RESTful server

Although we are going to use the capabilities of [Gorilla](https://github.com/gorilla/mux) for reading parameters from a URL, it is good to know that there is an alternative way to do so. In order to illustrate that, we are going to use a small Go program named `getID.go`.

We are going to use *regular expressions* for separating the main path from the parameter that is given as part of the URI. As always, use the simplest regular expression that does your job. What we want to do is using the `/get` endpoint to get information about the user that corresponds to a given ID. It is that ID that will be given in the `/get` call as `/get/<ID>`.

The Go code of `getID.go`, which is fully working HTTP server, is the following:

{{< file "./getID.go" go >}}
package main

import (
  "fmt"
  "log"
  "net/http"
  "os"
  "regexp"
  "strconv"
  "time"
)

// PORT is where the web server listens to
var PORT = ":1234"

func defaultHandler(w http.ResponseWriter, r *http.Request) {
  log.Println("Serving:", r.URL.Path, "from", r.Host)
  Body := "Thanks for visiting!\n"
  fmt.Fprintf(w, "%s", Body)
}

func idHandler(w http.ResponseWriter, r *http.Request) {
  log.Println("ID Serving:", r.URL.Path, "from", r.Host)
  reg := regexp.MustCompile(`/([0-9]+)`)
  match := reg.FindAllStringSubmatch(r.URL.Path, -1)
  if len(match) != 1 {
    log.Println("Invalid URI - More than one ID!")
    http.Error(w, "Invalid URI", http.StatusBadRequest)
    return
  }

  idText := match[0][1]
  id, err := strconv.Atoi(idText)
  if err != nil {
    log.Println("Cannot convert to integer", idText)
    http.Error(w, "Invalid URI", http.StatusBadRequest)
    return
  }

  log.Println("ID:", id)
  Body := "Looking for information about ID: " + idText
  fmt.Fprintf(w, "%s\n", Body)
}

func main() {
  arguments := os.Args
  if len(arguments) >= 2 {
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

  mux.Handle("/", http.HandlerFunc(defaultHandler))
  mux.Handle("/id", http.HandlerFunc(idHandler))
  mux.Handle("/id/", http.HandlerFunc(idHandler))

  fmt.Println("Ready to serve at", PORT)
  err := s.ListenAndServe()
  if err != nil {
    fmt.Println(err)
    return
  }
}
{{< /file >}}

All the work takes place inside `idHandler()`, which is the handler function for `/id...`. As mentioned before, this method requires the use of regular expressions inside the handler function whereas `gorilla/mux` defines the regular expression in the `HandleFunc()` call, that is, outside of the handler function – you can still use regular expressions inside the handler function in `gorilla/mux`.

We are going to execute `getID.go` as `go run getID.go` and interact with it using `curl(1)`.

If we send a valid URL to `getID.go`, the output of `curl(1)` will be as follows:

    curl localhost:1234/id/56

{{< output >}}
Looking for information about ID: 56
{{< /output >}}

If the input URL is not appropriate, `curl(1)` will return the following kind of output:

    curl localhost:1234/id/ad

{{< output >}}
Invalid URI
{{< /output >}}

For these two interactions, the debugging output of `getID.go` was the following:

{{< output >}}
Ready to serve at :1234
2020/05/11 21:30:02 ID Serving: /id/56 from localhost:1234
2020/05/11 21:30:02 ID: 56
2020/05/11 21:30:34 ID Serving: /id/ad from localhost:1234
2020/05/11 21:30:34 Invalid URI - More than one ID!
{{< /output >}}

### Updating existing entries

There are many ways to update existing resources. The presented RESTful server will require the user related data of the full record (`Username` and `Password`) in order to update it, the value of the `Admin` field and a `PUT` action using the `/update` endpoint.

The rest of the work requires updating the relevant SQLite3 record, if the username value exists, using the `UpdateUser()` function. Therefore, updating a user record is mainly a database related task.

### The implementation of the server

The following output is the full implementation of the RESTful server, which is saved as `rServer.go`:

{{< file "./rServer.go" go >}}
package main

import (
  "log"
  "net/http"
  "os"
  "os/signal"
  "time"

  "github.com/gorilla/mux"
  "github.com/mactsouk/handlers"
)

// PORT is where the web server listens to
var PORT = ":1234"

type notAllowedHandler struct{}

func (h notAllowedHandler) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
  handlers.MethodNotAllowedHandler(rw, r)
}

func main() {
  arguments := os.Args
  if len(arguments) >= 2 {
    PORT = ":" + arguments[1]
  }

  // Each time you restart the server, SQLite3 is initialized
  // Create SQLite3 database + admin user
  if !handlers.CreateDatabase() {
    log.Println("Cannot create database!")
    return
  }

  // Create a new ServeMux using Gorilla
  mux := mux.NewRouter()

  s := http.Server{
    Addr:         PORT,
    Handler:      mux,
    ErrorLog:     nil,
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 5 * time.Second,
    IdleTimeout:  10 * time.Second,
  }

  mux.NotFoundHandler = http.HandlerFunc(handlers.DefaultHandler)

  notAllowed := notAllowedHandler{}
  mux.MethodNotAllowedHandler = notAllowed

  // Register GET
  getMux := mux.Methods(http.MethodGet).Subrouter()
  getMux.HandleFunc("/time", handlers.TimeHandler)
  getMux.HandleFunc("/getall", handlers.GetAllHandler)
  getMux.HandleFunc("/getid", handlers.GetIDHandler)
  getMux.HandleFunc("/logged", handlers.LoggedUsersHandler)
  getMux.HandleFunc("/username/{id:[0-9]+}", handlers.GetUserDataHandler)

  // Register PUT
  // Update User
  putMux := mux.Methods(http.MethodPut).Subrouter()
  putMux.HandleFunc("/update", handlers.UpdateHandler)

  // Register POST
  // Add User + Login + Logout
  postMux := mux.Methods(http.MethodPost).Subrouter()
  postMux.HandleFunc("/add", handlers.AddHandler)
  postMux.HandleFunc("/login", handlers.LoginHandler)
  postMux.HandleFunc("/logout", handlers.LogoutHandler)

  // Register DELETE
  // Delete User
  deleteMux := mux.Methods(http.MethodDelete).Subrouter()
  deleteMux.HandleFunc("/username/{id:[0-9]+}", handlers.DeleteHandler)

  go func() {
    log.Println("Listening to", PORT)
    err := s.ListenAndServe()
    if err != nil {
      log.Printf("Error starting server: %s\n", err)
      return
    }
  }()

  sigs := make(chan os.Signal, 1)
  signal.Notify(sigs, os.Interrupt)
  sig := <-sigs
  log.Println("Quitting after signal:", sig)
  time.Sleep(5 * time.Second)
  s.Shutdown(nil)
}
{{< /file >}}

Three things are really important here:

- The size of `rServer.go`, which is really small!
- The use of `gorilla/mux`, which is simple even when configuring complex tasks.
- The use of another custom Go package named `handlers`.

### Putting Handler functions in a Separate Go Package

In order to improve the readability of the program, all handler functions were put in a separate Go package named `handlers`. Additionally, in order to be able to work with that package from your Go projects, the `handlers` package was put in a *separate GitHub repository*. For reasons of simplicity, the `handlers` package also contains the custom data types that will be shared between the server and the client in a separate source file named `data.go`.

The contents of `handlers.go` are the following:

{{< file "./handlers.go" go >}}
package handlers

import (
  "encoding/json"
  "fmt"
  "io/ioutil"
  "log"
  "net/http"
  "strconv"
  "time"

  "github.com/gorilla/mux"
)

// DefaultHandler is for handling /
func DefaultHandler(rw http.ResponseWriter, r *http.Request) {
  log.Println("Serving:", r.URL.Path, "from", r.Host, "with method", r.Method)
  rw.WriteHeader(http.StatusNotFound)
  Body := r.URL.Path + " is not supported. Thanks for visiting!\n"
  fmt.Fprintf(rw, "%s", Body)
}

// MethodNotAllowedHandler is executed when the method is incorrect
func MethodNotAllowedHandler(rw http.ResponseWriter, r *http.Request) {
  log.Println("Serving:", r.URL.Path, "from", r.Host, "with method", r.Method)
  rw.WriteHeader(http.StatusNotFound)
  Body := "Method not allowed!\n"
  fmt.Fprintf(rw, "%s", Body)
}

// TimeHandler is for handling /time
func TimeHandler(rw http.ResponseWriter, r *http.Request) {
  log.Println("Serving:", r.URL.Path, "from", r.Host)
  rw.WriteHeader(http.StatusOK)
  t := time.Now().Format(time.RFC1123)
  Body := "The current time is: " + t + "\n"
  fmt.Fprintf(rw, "%s", Body)
}

// AddHandler is for adding a new user
func AddHandler(rw http.ResponseWriter, r *http.Request) {
  log.Println("Serving:", r.URL.Path, "from", r.Host)
  d, err := ioutil.ReadAll(r.Body)
  if err != nil {
    rw.WriteHeader(http.StatusBadRequest)
    log.Println(err)
    return
  }

  if len(d) == 0 {
    rw.WriteHeader(http.StatusBadRequest)
    log.Println("No input!")
    return
  }

  var users = []Input{}
  err = json.Unmarshal(d, &users)
  if err != nil {
    log.Println(err)
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  log.Println(users)

  u := UserPass{users[0].Username, users[0].Password}
  if !IsUserAdmin(u) {
    log.Println("Command issued by non-admin user:", u.Username)
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  newUser := User{-1, users[1].Username, users[1].Password, time.Now().Unix(), users[1].Admin, 0}
  result := AddUser(newUser)
  if !result {
    rw.WriteHeader(http.StatusBadRequest)
  }
}

// DeleteHandler is for deleting an existing user + DELETE
func DeleteHandler(rw http.ResponseWriter, r *http.Request) {
  log.Println("Serving:", r.URL.Path, "from", r.Host)
  id, ok := mux.Vars(r)["id"]
  if !ok {
    log.Println("ID value not set!")
    rw.WriteHeader(http.StatusNotFound)
    return
  }

  var user = UserPass{}
  err := user.FromJSON(r.Body)
  if err != nil {
    log.Println(err)
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  if !IsUserAdmin(user) {
    log.Println("User", user.Username, "is not admin!")
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  intID, err := strconv.Atoi(id)
  if err != nil {
    log.Println("id", err)
    return
  }

  t := FindUserID(intID)
  if t.Username != "" {
    log.Println("About to delete:", t)
    deleted := DeleteUser(intID)
    if deleted {
      log.Println("User deleted:", id)
      rw.WriteHeader(http.StatusOK)
      return
    } else {
      log.Println("Cannot delete user:", id)
      rw.WriteHeader(http.StatusNotFound)
    }
  }
  rw.WriteHeader(http.StatusNotFound)
}

// GetAllHandler is for getting all data from the user database
func GetAllHandler(rw http.ResponseWriter, r *http.Request) {
  log.Println("Serving:", r.URL.Path, "from", r.Host)
  d, err := ioutil.ReadAll(r.Body)
  if err != nil {
    rw.WriteHeader(http.StatusBadRequest)
    log.Println(err)
    return
  }

  if len(d) == 0 {
    rw.WriteHeader(http.StatusBadRequest)
    log.Println("No input!")
    return
  }

  var user = UserPass{}
  err = json.Unmarshal(d, &user)
  if err != nil {
    log.Println(err)
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  if !IsUserValid(user) {
    log.Println("User", user, "does not exist!")
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  err = SliceToJSON(ReturnAllUsers(), rw)
  if err != nil {
    log.Println(err)
    rw.WriteHeader(http.StatusBadRequest)
    return
  }
}

// GetIDHandler returns the ID of an existing user
func GetIDHandler(rw http.ResponseWriter, r *http.Request) {
  log.Println("Serving:", r.URL.Path, "from", r.Host)

  d, err := ioutil.ReadAll(r.Body)
  if err != nil {
    rw.WriteHeader(http.StatusBadRequest)
    log.Println(err)
    return
  }

  if len(d) == 0 {
    rw.WriteHeader(http.StatusBadRequest)
    log.Println("No input!")
    return
  }

  var user = UserPass{}
  err = json.Unmarshal(d, &user)
  if err != nil {
    log.Println(err)
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  log.Println("Input user:", user)
  if !IsUserValid(user) {
    log.Println("User", user.Username, "not valid!")
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  t := FindUserUsername(user.Username)
  Body := "User " + user.Username + " has ID:"
  fmt.Fprintf(rw, "%s %d\n", Body, t.ID)
}

// GetUserDataHandler + GET returns the full record of a user
func GetUserDataHandler(rw http.ResponseWriter, r *http.Request) {
  log.Println("Serving:", r.URL.Path, "from", r.Host)
  id, ok := mux.Vars(r)["id"]
  if !ok {
    log.Println("ID value not set!")
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  intID, err := strconv.Atoi(id)
  if err != nil {
    log.Println("id", err)
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  t := FindUserID(intID)
  if t.Username != "" {
    err := t.ToJSON(rw)
    if err != nil {
      rw.WriteHeader(http.StatusBadRequest)
      log.Println(err)
      return
    }
  } else {
    log.Println("User not found:", id)
    rw.WriteHeader(http.StatusBadRequest)
    return
  }
}

// UpdateHandler is for updating the data of an existing user + PUT
func UpdateHandler(rw http.ResponseWriter, r *http.Request) {
  log.Println("Serving:", r.URL.Path, "from", r.Host)
  d, err := ioutil.ReadAll(r.Body)
  if err != nil {
    rw.WriteHeader(http.StatusBadRequest)
    log.Println(err)
    return
  }

  if len(d) == 0 {
    rw.WriteHeader(http.StatusBadRequest)
    log.Println("No input!")
    return
  }

  var users = []Input{}
  err = json.Unmarshal(d, &users)
  if err != nil {
    log.Println(err)
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  u := UserPass{users[0].Username, users[0].Password}
  if !IsUserAdmin(u) {
    log.Println("Command issued by non-admin user:", u.Username)
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  log.Println(users)
  t := FindUserUsername(users[1].Username)
  t.Username = users[1].Username
  t.Password = users[1].Password
  t.Admin = users[1].Admin

  if !UpdateUser(t) {
    log.Println("Update failed:", t)
    rw.WriteHeader(http.StatusBadRequest)
  }
}

// LoginHandler is for updating the LastLogin time of a user
// And changing the Active field to true
func LoginHandler(rw http.ResponseWriter, r *http.Request) {
  log.Println("Serving:", r.URL.Path, "from", r.Host)
  d, err := ioutil.ReadAll(r.Body)
  if err != nil {
    rw.WriteHeader(http.StatusBadRequest)
    log.Println(err)
    return
  }

  if len(d) == 0 {
    rw.WriteHeader(http.StatusBadRequest)
    log.Println("No input!")
    return
  }

  var user = UserPass{}
  err = json.Unmarshal(d, &user)
  if err != nil {
    log.Println(err)
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  log.Println("Input user:", user)

  if !IsUserValid(user) {
    log.Println("User", user.Username, "not valid!")
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  t := FindUserUsername(user.Username)
  log.Println("Logging in:", t)

  t.LastLogin = time.Now().Unix()
  t.Active = 1
  if UpdateUser(t) {
    log.Println("User updated:", t)
  } else {
    log.Println("Update failed:", t)
    rw.WriteHeader(http.StatusBadRequest)
  }
}

// LogoutHandler is for logging out a user
// And changing the Active field to false
func LogoutHandler(rw http.ResponseWriter, r *http.Request) {
  log.Println("Serving:", r.URL.Path, "from", r.Host)

  d, err := ioutil.ReadAll(r.Body)
  if err != nil {
    rw.WriteHeader(http.StatusBadRequest)
    log.Println(err)
    return
  }

  if len(d) == 0 {
    rw.WriteHeader(http.StatusBadRequest)
    log.Println("No input!")
    return
  }

  var user = UserPass{}
  err = json.Unmarshal(d, &user)
  if err != nil {
    log.Println(err)
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  if !IsUserValid(user) {
    log.Println("User", user.Username, "exists!")
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  t := FindUserUsername(user.Username)
  log.Println("Logging out:", t.Username)
  t.Active = 0
  if UpdateUser(t) {
    log.Println("User updated:", t)
  } else {
    log.Println("Update failed:", t)
    rw.WriteHeader(http.StatusBadRequest)
  }
}

// LoggedUsersHandler returns the list of currently logged in users
func LoggedUsersHandler(rw http.ResponseWriter, r *http.Request) {
  log.Println("Serving:", r.URL.Path, "from", r.Host)
  var user = UserPass{}
  err := user.FromJSON(r.Body)

  if err != nil {
    log.Println(err)
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  if !IsUserValid(user) {
    log.Println("User", user.Username, "exists!")
    rw.WriteHeader(http.StatusBadRequest)
    return
  }

  err = SliceToJSON(ReturnLoggedUsers(), rw)
  if err != nil {
    log.Println(err)
    rw.WriteHeader(http.StatusBadRequest)
    return
  }
}
{{< /file >}}

Feel free to put each handler into a separate Go file under `handlers`. The general idea is that if you are having lots of handler functions, using a separate file for each handler function is a good practice.

The contents of `data.go` are the following:

{{< file "./data.go" go >}}
package handlers

import (
  "bytes"
  "database/sql"
  "encoding/json"
  "io"
  "log"
  "time"

  "github.com/go-playground/validator"
  _ "github.com/mattn/go-sqlite3"
)

var SQLFILE = "/tmp/users.db"

type User struct {
  ID        int    `json:"id"`
  Username  string `json:"user"`
  Password  string `json:"password"`
  LastLogin int64  `json:"lastlogin"`
  Admin     int    `json:"admin"`
  Active    int    `json:"active"`
}

type Input struct {
  Username string `json:"user"`
  Password string `json:"password"`
  Admin    int    `json:"admin"`
}

type UserPass struct {
  Username string `json:"user" validate:"required"`
  Password string `json:"password" validate:"required"`
}

// FromJSON decodes a serialized JSON record - User{}
func (p *User) FromJSON(r io.Reader) error {
  e := json.NewDecoder(r)
  return e.Decode(p)
}

// FromJSON decodes a serialized JSON record - UserPass{}
func (p *UserPass) FromJSON(r io.Reader) error {
  e := json.NewDecoder(r)
  return e.Decode(p)
}

// ToJSON encodes a JSON record
func (p *User) ToJSON(w io.Writer) error {
  e := json.NewEncoder(w)
  return e.Encode(p)
}

// SliceToJSON encodes a slice with JSON records
func SliceToJSON(slice interface{}, w io.Writer) error {
  e := json.NewEncoder(w)
  return e.Encode(slice)
}

// SliceFromJSON decodes a serialized slice with JSON records
func SliceFromJSON(slice interface{}, r io.Reader) error {
  e := json.NewDecoder(r)
  return e.Decode(slice)
}

// AddUser is for adding a new user to the database
func AddUser(u User) bool {
  log.Println("Adding user:", u)
  db, err := sql.Open("sqlite3", SQLFILE)
  if err != nil {
    log.Println(err)
    return false
  }
  defer db.Close()

  stmt, err := db.Prepare("INSERT INTO users(Username, Password, LastLogin, Admin, Active) values(?,?,?,?,?)")
  if err != nil {
    log.Println("Adduser:", err)
    return false
  }
  stmt.Exec(u.Username, u.Password, u.LastLogin, u.Admin, u.Active)
  return true
}

// UpdateUser allows you to update user name
func UpdateUser(u User) bool {
  log.Println("Updating user:", u)

  db, err := sql.Open("sqlite3", SQLFILE)
  if err != nil {
    log.Println(err)
    return false
  }
  defer db.Close()

  stmt, err := db.Prepare("UPDATE users SET Username=?, Password=?, LastLogin=?, Admin=?, Active =? WHERE ID = ?\n")
  if err != nil {
    log.Println("Statement failed:", err)
    return false
  }

  res, err := stmt.Exec(u.Username, u.Password, u.LastLogin, u.Admin, u.Active, u.ID)
  if err != nil {
    log.Println("Exec failed:", err)
    return false
  }

  affect, err := res.RowsAffected()
  log.Println("Affected:", affect)
  return true
}

// CreateDatabase initializes the SQLite3 database and adds the admin user
func CreateDatabase() bool {
  log.Println("Writing to SQLite3:", SQLFILE)
  db, err := sql.Open("sqlite3", SQLFILE)
  if err != nil {
    log.Println(err)
    return false
  }
  defer db.Close()

  log.Println("Emptying database table.")
  _, _ = db.Exec("DROP TABLE users")

  log.Println("Creating table from scratch.")
  _, err = db.Exec("CREATE TABLE users (ID integer NOT NULL PRIMARY KEY AUTOINCREMENT, Username TEXT, Password TEXT, Lastlogin integer, Admin integer, Active integer);")
  if err != nil {
    log.Println(err)
    return false
  }

  log.Println("Populating", SQLFILE)
  admin := User{-1, "admin", "admin", time.Now().Unix(), 1, 0}
  return AddUser(admin)
}

// DeleteUser is for deleting a user defined by ID
func DeleteUser(ID int) bool {
  log.Println("Deleting from SQLite3:", ID)
  db, err := sql.Open("sqlite3", SQLFILE)
  if err != nil {
    log.Println(err)
    return false
  }
  defer db.Close()

  stmt, _ := db.Prepare("DELETE FROM users WHERE ID = ?")
  if err != nil {
    log.Println("DeleteUser:", err)
    return false
  }
  stmt.Exec(ID)
  return true
}

// ReturnAllUsers is for returning all users from database
func ReturnAllUsers() []User {
  log.Println("Reading from SQLite3:", SQLFILE)
  db, err := sql.Open("sqlite3", SQLFILE)
  if err != nil {
    log.Println(err)
    return nil
  }
  defer db.Close()

  rows, err := db.Query("SELECT * FROM users \n")
  if err != nil {
    log.Println(err)
    return nil
  }

  all := []User{}
  var c1 int
  var c2, c3 string
  var c4 int64
  var c5, c6 int

  for rows.Next() {
    err = rows.Scan(&c1, &c2, &c3, &c4, &c5, &c6)
    temp := User{c1, c2, c3, c4, c5, c6}
    all = append(all, temp)
  }

  log.Println("All:", all)
  return all
}

// FindUserID is for returning a user record defined by ID
func FindUserID(ID int) User {
  log.Println("Get User Data from SQLite3:", ID)
  db, err := sql.Open("sqlite3", SQLFILE)
  if err != nil {
    log.Println(err)
    return User{}
  }
  defer db.Close()

  rows, err := db.Query("SELECT * FROM users where ID = $1 \n", ID)
  if err != nil {
    log.Println("Query:", err)
    return User{}
  }
  defer rows.Close()

  u := User{}
  var c1 int
  var c2, c3 string
  var c4 int64
  var c5, c6 int

  for rows.Next() {
    err = rows.Scan(&c1, &c2, &c3, &c4, &c5, &c6)
    if err != nil {
      log.Println(err)
      return User{}
    }
    u = User{c1, c2, c3, c4, c5, c6}
    log.Println("Found user:", u)
  }
  return u
}

// FindUserUsername is for returning a user record defined by username
func FindUserUsername(username string) User {
  log.Println("Get User Data from SQLite3:", username)
  db, err := sql.Open("sqlite3", SQLFILE)
  if err != nil {
    log.Println(err)
    return User{}
  }
  defer db.Close()

  rows, err := db.Query("SELECT * FROM users where Username = $1 \n", username)
  if err != nil {
    log.Println("FindUserUsername Query:", err)
    return User{}
  }
  defer rows.Close()

  u := User{}
  var c1 int
  var c2, c3 string
  var c4 int64
  var c5, c6 int

  for rows.Next() {
    err = rows.Scan(&c1, &c2, &c3, &c4, &c5, &c6)
    if err != nil {
      log.Println(err)
      return User{}
    }
    u = User{c1, c2, c3, c4, c5, c6}
    log.Println("Found user:", u)
  }
  return u
}

// ReturnLoggedUsers is for returning all logged in users
func ReturnLoggedUsers() []User {
  log.Println("Reading from SQLite3:", SQLFILE)
  db, err := sql.Open("sqlite3", SQLFILE)
  if err != nil {
    log.Println(err)
    return nil
  }
  defer db.Close()

  rows, err := db.Query("SELECT * FROM users WHERE Active = 1 \n")
  if err != nil {
    log.Println(err)
    return nil
  }

  all := []User{}
  var c1 int
  var c2, c3 string
  var c4 int64
  var c5, c6 int

  for rows.Next() {
    err = rows.Scan(&c1, &c2, &c3, &c4, &c5, &c6)
    if err != nil {
      log.Println(err)
      return []User{}
    }
    temp := User{c1, c2, c3, c4, c5, c6}
    log.Println("temp:", all)
    all = append(all, temp)
  }

  log.Println("Logged in:", all)
  return all
}

// IsUserAdmin determines whether a user is
// an administrator or not
func IsUserAdmin(u UserPass) bool {
  err := u.Validate()
  if err != nil {
    log.Println("IsUserAdmin - Validate:", err)
    return false
  }

  db, err := sql.Open("sqlite3", SQLFILE)
  if err != nil {
    log.Println(err)
    return false
  }
  defer db.Close()

  rows, err := db.Query("SELECT * FROM users WHERE Username = $1 \n", u.Username)
  if err != nil {
    log.Println(err)
    return false
  }

  temp := User{}
  var c1 int
  var c2, c3 string
  var c4 int64
  var c5, c6 int

  // If there exist multiple users with the same username,
  // we will get the FIRST ONE only.
  for rows.Next() {
    err = rows.Scan(&c1, &c2, &c3, &c4, &c5, &c6)
    if err != nil {
      log.Println(err)
      return false
    }
    temp = User{c1, c2, c3, c4, c5, c6}
  }

  if u.Username == temp.Username && u.Password == temp.Password && temp.Admin == 1 {
    return true
  }
  return false
}

func IsUserValid(u UserPass) bool {
  err := u.Validate()
  if err != nil {
    log.Println("IsUserValid - Validate:", err)
    return false
  }

  db, err := sql.Open("sqlite3", SQLFILE)
  if err != nil {
    log.Println(err)
    return false
  }
  defer db.Close()

  rows, err := db.Query("SELECT * FROM users WHERE Username = $1 \n", u.Username)
  if err != nil {
    log.Println(err)
    return false
  }

  temp := User{}
  var c1 int
  var c2, c3 string
  var c4 int64
  var c5, c6 int

  // If there exist multiple users with the same username,
  // we will get the FIRST ONE only.
  for rows.Next() {
    err = rows.Scan(&c1, &c2, &c3, &c4, &c5, &c6)
    if err != nil {
      log.Println(err)
      return false
    }
    temp = User{c1, c2, c3, c4, c5, c6}
  }

  if u.Username == temp.Username && u.Password == temp.Password {
    return true
  }
  return false
}

// Validate method validates the data of UserPass
func (p *UserPass) Validate() error {
  validate := validator.New()
  return validate.Struct(p)
}
{{< /file >}}

The `data.go` file is the right place to put any structures we define as well as all the functions for working with users and the SQLite3 database. These functions are going to be called from the handler functions of the web server.

{{< note >}}
The GitHub repository for the `handlers` package is https://github.com/mactsouk/handlers. The use of the `handlers` package simplifies the code and the design of `rServer.go`.
{{< /note >}}

#### Using the Encoder and Decoder types for JSON

In `rServer.go`, a part of JSON record marshalling and unmarshalling is implemented using the `Encoder` and `Decoder` types. The relevant code can be found in the `data.go` file and more specifically at the implementation of the `ToJSON()`,`FromJSON()`, `SliceToJSON()` and `SliceFromJSON()` methods and functions.

As explained in the previous guide, the use of `Encoder` and `Decoder` requires less memory, which can be particularly handy when working with large amounts of JSON data.
You will see more of this technique in the next guide where a client for the RESTful service will be implemented as a command line utility.

### Signal Handling for Server Termination

The RESTful server will perform some UNIX signal handling in order to be able to terminate gracefully. There exist many reasons for doing so – the single most important reason is for *properly closing* database connections and connections to other services, if any. However, due to the simplicity of SQLite3, no cleanup tasks take place here.

All relevant code can be found at the end of the `main()` function:

{{< file "" go >}}
sigs := make(chan os.Signal, 1)
signal.Notify(sigs, os.Interrupt)
sig := <-sigs
log.Println("Quitting after signal:", sig)
time.Sleep(5 * time.Second)
s.Shutdown(nil)
{{< /file >}}

Note that in this case, the web server runs as a separate goroutine whereas the `sig := <-sigs` statement blocks the termination of the program while waiting for data. The `time.Sleep()` command is for giving time to the web server to serve any open connections before shutting down.

### Validating JSON data

This subsection will illustrate how you can validate the data you receive in your JSON records using an external Go package. For reasons of simplicity, we are going to validate the `UserPass` structure only but you can apply the same principles in any other Go structure.

First we will need to change the definition of the `UserPass` structure from the next:

{{< file "" go >}}
type UserPass struct {
  Username string `json:"user"`
  Password string `json:"password"`
}
{{< /file >}}

to the following:

{{< file "" go >}}
type UserPass struct {
  Username string `json:"user" validate:"required"`
  Password string `json:"password" validate:"required"`
}
{{< /file >}}

The two `validate:"required"` statements tell `validator` that both fields are required – this makes perfect sense since you usually do not want a `UserPass` structure without username and password values. However, we are not done yet – we should write some extra code that checks these two conditions when needed.

The current implementation performs the validations on the `UserPass` structure in `IsUserValid()` and `IsUserAdmin()` functions using a call to the `Validate()` method that is defined as follows:

{{< file "" go >}}
// Validate method validates the data of UserPass
func (p *UserPass) Validate() error {
  validate := validator.New()
  return validate.Struct(p)
}
{{< /file >}}

Although the `validator` package can do many more advanced things, the current usage of it performs two essential tasks very quickly with the minimum amount of code.

Let us say that we connect to the `/username` endpoint by issuing a command like the following:

    curl -X DELETE -H 'Content-Type: application/json' -d '{"user": "", "password": ""}' -X DELETE localhost:1234/username/2 -v

The validator will catch the issues of the `UserPass` structure that was given as input to the RESTful server:

{{< output >}}
2020/05/19 12:43:22 IsUserAdmin - Validate: Key: 'UserPass.Username' Error:Field validation for 'Username' failed on the 'required' tag
Key: 'UserPass.Password' Error:Field validation for 'Password' failed on the 'required' tag
{{< /output >}}

The first issue is that there is no `username` field and therefore there is no value for it. The second issue is that the value of the `password` field is an empty string. Therefore, the JSON record that was passed is not valid.

It is really important to realize that for adding validation, you will not need to make any changes to the Go code of `rServer.go`.

### The use of Subrouters

The server implementation uses *subrouters*. A subrouter is a nested route that is only being examined for potential matches if the parent route matches. The good thing is that the parent route can contain conditions that are common among all paths that are defined under a subrouter, which includes hosts, path prefixes and, as it happens in our case, HTTP request methods. As a result, our subrouters are divided based on the common request method of the endpoints that follow. Not only this optimizes the request matchings, it makes the structure of the code easier to understand.

As an example, the subrouter for the `DELETE` HTTP method is as simple as the following:

{{< file "" go >}}
deleteMux := mux.Methods(http.MethodDelete).Subrouter()
deleteMux.HandleFunc("/username/{id:[0-9]+}", handlers.DeleteHandler)
{{< /file >}}

The first statement is for defining the common characteristics of the subrouter, which is this case is the `http.MethodDelete` HTTP method, whereas the remaining statements, which in this case is only one, is for defining the supported paths.

### Visiting all Routes

The `gorilla/mux` package offers a `Walk` function that can be used for visiting all the registered routes of a router. This feature is illustrated in the following Go code:

{{< file "./walkAll.go" go >}}
package main

import (
  "fmt"
  "net/http"
  "strings"

  "github.com/gorilla/mux"
)

func handler(w http.ResponseWriter, r *http.Request) {
  return
}

func (h notAllowedHandler) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
  handler(rw, r)
}

type notAllowedHandler struct{}

func main() {
  r := mux.NewRouter()

  r.NotFoundHandler = http.HandlerFunc(handler)
  notAllowed := notAllowedHandler{}
  r.MethodNotAllowedHandler = notAllowed

  // Register GET
  getMux := r.Methods(http.MethodGet).Subrouter()
  getMux.HandleFunc("/time", handler)
  getMux.HandleFunc("/getall", handler)
  getMux.HandleFunc("/getid", handler)
  getMux.HandleFunc("/logged", handler)
  getMux.HandleFunc("/username/{id:[0-9]+}", handler)

  // Register PUT
  // Update User
  putMux := r.Methods(http.MethodPut).Subrouter()
  putMux.HandleFunc("/update", handler)

  // Register POST
  // Add User + Login + Logout
  postMux := r.Methods(http.MethodPost).Subrouter()
  postMux.HandleFunc("/add", handler)
  postMux.HandleFunc("/login", handler)
  postMux.HandleFunc("/logout", handler)

  // Register DELETE
  // Delete User
  deleteMux := r.Methods(http.MethodDelete).Subrouter()
  deleteMux.HandleFunc("/username/{id:[0-9]+}", handler)

  err := r.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
    pathTemplate, err := route.GetPathTemplate()
    if err == nil {
      fmt.Println("ROUTE:", pathTemplate)
    }
    pathRegexp, err := route.GetPathRegexp()
    if err == nil {
      fmt.Println("Path regexp:", pathRegexp)
    }
    queriesTemplates, err := route.GetQueriesTemplates()
    if err == nil {
      fmt.Println("Queries templates:", strings.Join(queriesTemplates, ","))
    }
    queriesRegexps, err := route.GetQueriesRegexp()
    if err == nil {
      fmt.Println("Queries regexps:", strings.Join(queriesRegexps, ","))
    }
    methods, err := route.GetMethods()
    if err == nil {
      fmt.Println("Methods:", strings.Join(methods, ","))
    }
    fmt.Println()
    return nil
  })

  if err != nil {
    fmt.Println(err)
  }

  http.Handle("/", r)
}
{{< /file >}}

The general idea behind `walkAll.go` is that you assign an empty handler to each route that you have in your server and then you call `mux.Walk` for visiting all the routes.

If you execute `walkAll.go`, you will get the following output, which can also be used for debugging:

    go run walkAll.go

{{< output >}}
Queries templates: 
Queries regexps: 
Methods: GET

ROUTE: /time
Path regexp: ^/time$
Queries templates: 
Queries regexps: 
Methods: GET

ROUTE: /getall
Path regexp: ^/getall$
Queries templates: 
Queries regexps: 
Methods: GET

ROUTE: /getid
Path regexp: ^/getid$
Queries templates: 
Queries regexps: 
Methods: GET

ROUTE: /logged
Path regexp: ^/logged$
Queries templates: 
Queries regexps: 
Methods: GET

ROUTE: /username/{id:[0-9]+}
Path regexp: ^/username/(?P<v0>[0-9]+)$
Queries templates: 
Queries regexps: 
Methods: GET

Queries templates: 
Queries regexps: 
Methods: PUT

ROUTE: /update
Path regexp: ^/update$
Queries templates: 
Queries regexps: 
Methods: PUT

Queries templates: 
Queries regexps: 
Methods: POST

ROUTE: /add
Path regexp: ^/add$
Queries templates: 
Queries regexps: 
Methods: POST

ROUTE: /login
Path regexp: ^/login$
Queries templates: 
Queries regexps: 
Methods: POST

ROUTE: /logout
Path regexp: ^/logout$
Queries templates: 
Queries regexps: 
Methods: POST

Queries templates: 
Queries regexps: 
Methods: DELETE

ROUTE: /username/{id:[0-9]+}
Path regexp: ^/username/(?P<v0>[0-9]+)$
Queries templates: 
Queries regexps: 
Methods: DELETE
{{< /output >}}

The output shows the HTTP methods that each route supports as well as the format of the router including any potential regular expressions as is the case with `/username`.

### Testing the server with `curl`

This is a very important task of the development process because without a proper testing methodology, we cannot be sure that the server works as expected. In this case, we are going to use the `curl` utility as the client to the RESTful server.

First you will need to execute the server process in order to be able to accept user requests.

    go run rServer.go

#### Testing GET requests

    curl -X GET -H 'Content-Type: application/json' -d '{"user": "admin", "password" : "admin"}' localhost:1234/getall

{{< output >}}
[{"id":1,"user":"admin","password":"admin","lastlogin":1589986220,"admin":1,"active":0}]
{{< /output >}}

    curl -X GET localhost:1234/time

{{< output >}}
The current time is: Wed, 20 May 2020 17:52:05 EEST
{{< /output >}}

Then we are going to get an ID of a user:

    curl -X GET -H 'Content-Type: application/json' -d '{"user": "admin", "password" : "admin"}' localhost:1234/getid

{{< output >}}
User admin has ID: 1
{{< /output >}}

The last command that uses the `GET` HTTP method is for finding the logged users, which in this case is an empty list.

    curl -X GET -H 'Content-Type: application/json' -d '{"user": "admin", "password" : "admin"}' localhost:1234/logged

{{< output >}}
[]
{{< /output >}}

#### Testing PUT requests

The next command will update the password of the `admin` user:

    curl -X PUT -H 'Content-Type: application/json' -d '[{"user": "admin", "password" : "admin", "admin":1}, {"user": "admin", "password" : "newPass", "admin":1} ]' localhost:1234/update

This command returns no output - however, you can verify its actions by issuing a `/getall` command:

    curl -X GET -H 'Content-Type: application/json' -d '{"user": "admin", "password" : "newPass"}' localhost:1234/getall

{{< output >}}
[{"id":1,"user":"admin","password":"newPass","lastlogin":1589986220,"admin":1,"active":0}]
{{< /output >}}

#### Testing POST requests

First, we are going to add a new user to the database:

    curl -X POST -H 'Content-Type: application/json' -d '[{"user": "admin", "password" : "newPass", "admin":1}, {"user": "mtsouk", "password" : "admin", "admin":1} ]' localhost:1234/add

We will now verify the last action:

    curl -X GET -H 'Content-Type: application/json' -d '{"user": "admin", "password" : "newPass"}' localhost:1234/getall

{{< output >}}
[{"id":1,"user":"admin","password":"newPass","lastlogin":1589986220,"admin":1,"active":0},{"id":2,"user":"mtsouk","password":"admin","lastlogin":1589986694,"admin":1,"active":0}]
{{< /output >}}

Then, we will login as `mtsouk`:

    curl -X POST -H 'Content-Type: application/json' -d '{"user": "mtsouk", "password" : "admin"}' localhost:1234/login

The last command generates no output - however, the next command will verify that user `mtsouk` has successfully logged in into the system:

    curl curl -X GET -H 'Content-Type: application/json' -d '{"user": "admin", "password" : "newPass"}' localhost:1234/logged

{{< output >}}
[{"id":2,"user":"mtsouk","password":"admin","lastlogin":1589986860,"admin":1,"active":1}]
{{< /output >}}

The user can logout from the system by issuing the next command:

     curl -X POST -H 'Content-Type: application/json' -d '{"user": "mtsouk", "password" : "admin"}' localhost:1234/logout

#### Testing DELETE requests

There is only one endpoint that uses the `DELETE` HTTP method, which is `/username`. Deleting the user with an ID value of `2` is as simple as executing the following command, given an admin user:

    curl -H 'Content-Type: application/json' -d '{"user": "admin", "password": "newPass"}' -X DELETE localhost:1234/username/2

You can see that the user with ID of `2` has been deleted by running the next command:

    curl -X GET -H 'Content-Type: application/json' -d '{"user": "admin", "password" : "newPass"}' localhost:1234/getall

{{< output >}}
[{"id":1,"user":"admin","password":"newPass","lastlogin":1589986220,"admin":1,"active":0}]
{{< /output >}}

Of course, if you try to delete the same user twice, the operation will fail:

    curl -H 'Content-Type: application/json' -d '{"user": "admin", "password": "newPass"}' -X DELETE localhost:1234/username/2 -v

{{< output >}}
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 1234 (#0)
> DELETE /username/2 HTTP/1.1
> Host: localhost:1234
> User-Agent: curl/7.64.1
> Accept: */*
> Content-Type: application/json
> Content-Length: 40
>
* upload completely sent off: 40 out of 40 bytes
< HTTP/1.1 404 Not Found
< Date: Wed, 20 May 2020 15:38:57 GMT
< Content-Length: 0
<
* Connection #0 to host localhost left intact
* Closing connection 0
{{< /output >}}

#### Visiting an Endpoint that does not Exist

If you try to visit an endpoint that does not exist, you will get the following kind of output:

    curl -X DELETE localhost:1234/doesNotExist

{{< output >}}
/doesNotExist is not supported. Thanks for visiting!
{{< /output >}}

#### Using the wrong HTTP Request Method

You might now ask what happens if you try to call an endpoint using a non supported request method. Once again, the simplest way to find that out is by using `curl(1)` and the `-X` parameter that allows you to specify the request method.

We will call the `/getall` endpoint using a `DELETE` HTTP request method:

    curl -X DELETE -H 'Content-Type: application/json' -d '{"user": "admin", "password" : "newPass"}' localhost:1234/getall

The output that we will get from the server will be the following:

{{< output >}}
Method not allowed!
{{< /output >}}

Note that this is implemented by Gorilla using `mux.MethodNotAllowedHandler`, which means that is pretty fast.

#### The output of the server

The server process is programmed so that it generates logs that help you understand what is happening behind the scenes. For the presented interactions the generated server logs were as follows:

{{< output >}}
2020/05/20 17:50:20 Writing to SQLite3: /tmp/users.db
2020/05/20 17:50:20 Emptying database table.
2020/05/20 17:50:20 Creating table from scratch.
2020/05/20 17:50:20 Populating /tmp/users.db
2020/05/20 17:50:20 Adding user: {-1 admin admin 1589986220 1 0}
2020/05/20 17:50:20 Listening to :1234
2020/05/20 17:50:47 Serving: /getall from localhost:1234
2020/05/20 17:50:47 Reading from SQLite3: /tmp/users.db
2020/05/20 17:50:47 All: [{1 admin admin 1589986220 1 0}]
2020/05/20 17:52:05 Serving: /time from localhost:1234
2020/05/20 17:52:56 Serving: /getid from localhost:1234
2020/05/20 17:52:56 Input user: {mtsouk m}
2020/05/20 17:52:56 User mtsouk not valid!
2020/05/20 17:53:11 Serving: /getid from localhost:1234
2020/05/20 17:53:11 Input user: {admin admin}
2020/05/20 17:53:11 Get User Data from SQLite3: admin
2020/05/20 17:53:11 Found user: {1 admin admin 1589986220 1 0}
2020/05/20 17:53:32 Serving: /login from localhost:1234 with method GET
2020/05/20 17:53:40 Serving: /logged from localhost:1234
2020/05/20 17:53:40 Reading from SQLite3: /tmp/users.db
2020/05/20 17:53:40 Logged in: []
2020/05/20 17:55:34 Serving: /update from localhost:1234
2020/05/20 17:55:34 [{admin admin 1} {admin newPass 1}]
2020/05/20 17:55:34 Get User Data from SQLite3: admin
2020/05/20 17:55:34 Found user: {1 admin admin 1589986220 1 0}
2020/05/20 17:55:34 Updating user: {1 admin newPass 1589986220 1 0}
2020/05/20 17:55:34 Affected: 1
2020/05/20 17:56:46 Serving: /getall from localhost:1234
2020/05/20 17:56:46 Reading from SQLite3: /tmp/users.db
2020/05/20 17:56:46 All: [{1 admin newPass 1589986220 1 0}]
2020/05/20 17:58:14 Serving: /add from localhost:1234
2020/05/20 17:58:14 [{admin newPass 1} {mtsouk admin 1}]
2020/05/20 17:58:14 Adding user: {-1 mtsouk admin 1589986694 1 0}
2020/05/20 17:58:17 Serving: /getall from localhost:1234
2020/05/20 17:58:17 Reading from SQLite3: /tmp/users.db
2020/05/20 17:58:17 All: [{1 admin newPass 1589986220 1 0} {2 mtsouk admin 1589986694 1 0}]
2020/05/20 18:00:53 Serving: /login from localhost:1234 with method GET
2020/05/20 18:01:00 Serving: /login from localhost:1234
2020/05/20 18:01:00 Input user: {mtsouk admin}
2020/05/20 18:01:00 Get User Data from SQLite3: mtsouk
2020/05/20 18:01:00 Found user: {2 mtsouk admin 1589986694 1 0}
2020/05/20 18:01:00 Logging in: {2 mtsouk admin 1589986694 1 0}
2020/05/20 18:01:00 Updating user: {2 mtsouk admin 1589986860 1 1}
2020/05/20 18:01:00 Affected: 1
2020/05/20 18:01:00 User updated: {2 mtsouk admin 1589986860 1 1}
2020/05/20 18:34:53 Serving: /logged from localhost:1234
2020/05/20 18:34:53 User admin exists!
2020/05/20 18:35:03 Serving: /logged from localhost:1234
2020/05/20 18:35:03 Reading from SQLite3: /tmp/users.db
2020/05/20 18:35:03 temp: []
2020/05/20 18:35:03 Logged in: [{2 mtsouk admin 1589986860 1 1}]
2020/05/20 18:35:46 Serving: /logout from localhost:1234
2020/05/20 18:35:46 Get User Data from SQLite3: mtsouk
2020/05/20 18:35:46 Found user: {2 mtsouk admin 1589986860 1 1}
2020/05/20 18:35:46 Logging out: mtsouk
2020/05/20 18:35:46 Updating user: {2 mtsouk admin 1589986860 1 0}
2020/05/20 18:35:46 Affected: 1
2020/05/20 18:35:46 User updated: {2 mtsouk admin 1589986860 1 0}
2020/05/20 18:35:48 Serving: /logged from localhost:1234
2020/05/20 18:35:48 Reading from SQLite3: /tmp/users.db
2020/05/20 18:35:48 Logged in: []
2020/05/20 18:37:37 Serving: /username/2 from localhost:1234
2020/05/20 18:37:37 IsUserAdmin - Validate: Key: 'UserPass.Username' Error:Field validation for 'Username' failed on the 'required' tag
Key: 'UserPass.Password' Error:Field validation for 'Password' failed on the 'required' tag
2020/05/20 18:37:37 User  is not admin!
2020/05/20 18:37:51 Serving: /username/2 from localhost:1234
2020/05/20 18:37:51 IsUserAdmin - Validate: Key: 'UserPass.Username' Error:Field validation for 'Username' failed on the 'required' tag
2020/05/20 18:37:51 User  is not admin!
2020/05/20 18:38:16 Serving: /username/2 from localhost:1234
2020/05/20 18:38:16 Get User Data from SQLite3: 2
2020/05/20 18:38:16 Found user: {2 mtsouk admin 1589986860 1 0}
2020/05/20 18:38:16 About to delete: {2 mtsouk admin 1589986860 1 0}
2020/05/20 18:38:16 Deleting from SQLite3: 2
2020/05/20 18:38:16 User deleted: 2
2020/05/20 18:38:42 Serving: /getall from localhost:1234
2020/05/20 18:38:42 Reading from SQLite3: /tmp/users.db
2020/05/20 18:38:42 All: [{1 admin newPass 1589986220 1 0}]
2020/05/20 18:38:52 Serving: /username/2 from localhost:1234
2020/05/20 18:38:52 Get User Data from SQLite3: 2
2020/05/20 18:38:57 Serving: /username/2 from localhost:1234
2020/05/20 18:38:57 Get User Data from SQLite3: 2
2020/05/20 18:40:41 Serving: / from localhost:1234 with method DELETE
2020/05/20 18:40:56 Serving: /doesNotExist from localhost:1234 with method DELETE
2020/05/20 18:47:36 Serving: /getall from localhost:1234 with method DELETE
{{< /output >}}

## Summary

In this guide we talked about creating a RESTful server will lots of capabilities and a great design that can be used in production.

The next guide will illustrate how to create a RESTful client in Go that will get and process data from the REST API server developed in this guide. Additionally, it will tell you how to test RESTful servers using [Postman](https://www.postman.com/).
