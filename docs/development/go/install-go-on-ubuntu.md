---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide will show you how to install the Go programming language on Ubuntu'
keywords: ["Go", "Go Programming", "Golang", "Ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-30-01
modified: 2018-31-01
modified_by:
  name: Linode
title: 'How to Install Go on Ubuntu'
---

The Go programming language is a popular language that is currently developed by Google, and used to write  modern applications like Docker, Kubernetes, and Caddy. Go is a compiled, statically typed language, similar to the C programming language.


## Install Go

1. Use `curl` or `wget` to download the current binary for Go from the official [download pagge](https://golang.org/dl/). The package should download very quickly:

        curl -O https://storage.googleapis.com/golang/go1.9.3.linux-amd64.tar.gz

2. Verify the `.tar` file using `sha256sum`:

        a4da5f4c07dfda8194c4621611aeb7ceaab98af0b38bfb29e1be2ebb04c3556c  go1.9.3.linux-amd64.tar.gz

    {{< note >}}
At the time of this writing the output above should correspond with version `1.9.3` of the Go binary.
{{</ note >}}

3. Extract the tarball:

        tar -xvf go1.9.3.linux-amd64.tar.gz

4. Adjust the permissions and move the `go` directory to `/usr/local`:

        sudo chown -R root:root ./go
        sudo mv go /usr/local

## Adjust the Path Variable

1. Using a text editor, open the `~/.profile` file and add the following two lines to the bottom of the file:


    {{< output >}}
export GOPATH=$HOME/go
export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin
{{</ output >}}

2. Save the file, and load the commands into the current shell instance:

        source ~/.profile

## Test the Installation

According to [the official documentation](https://golang.org/doc/install#testing), the following steps are the recommended way to test the success of the installation:

1. In your home directory create a folder named `go`, this will be your workspace:

        mkdir go

2. Within that directory create `/src/hello` and within that directory copy and paste the contents of the file below:

        mkdir -p go/src/hello && cd go/src/hello
        touch hello.go
    {{< file "hello.go" go >}}
package main

import "fmt"

func main() {
    fmt.Printf("hello, world\n")
}

{{</ file >}}

3. Build the `hello.go` file:

        go build
4. Run the newly created file:

        ./hello

5. The console should now output:

        hello, world

If this test works you have succesffuly installed the Go programming language onto your Linode.


