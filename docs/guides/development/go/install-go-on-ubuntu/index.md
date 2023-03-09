---
slug: install-go-on-ubuntu
description: 'This guide shows how to install the Go programming language on Ubuntu.'
og_description: 'Go is a statically typed, compiled programming language developed by Google. This guide will show you how to install Go on Ubuntu.'
keywords: ["Go", "Go Programming", "Golang", "Ubuntu"]
tags: ["ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-01-29
modified: 2019-08-22
modified_by:
  name: Linode
title: 'How to Install Go on Ubuntu'
audiences: ["beginner"]
languages: ["go"]
aliases: ['/development/go/install-go-on-ubuntu/']
authors: ["Linode"]
---

![How to Install Go on Ubuntu](install-go-ubuntu-title.jpg "How to Install Go on Ubuntu")

## What is Go?

[Go](https://golang.org/) is a compiled, statically typed programming language developed by Google. Many modern applications such as Docker, Kubernetes, and Caddy are written in Go.

## Install Go

1. Use `curl` or `wget` to download the current binary for Go from the official [download page](https://golang.org/dl/). As of this writing, the current version is 1.12.9. Check the download page for updates, and replace `1.12.9` with the most recent stable version if necessary.

        curl -O https://storage.googleapis.com/golang/go1.12.9.linux-amd64.tar.gz

2. Verify the `.tar` file using `sha256sum`:

        sha256sum go1.12.9.linux-amd64.tar.gz

    {{< output >}}
aac2a6efcc1f5ec8bdc0db0a988bb1d301d64b6d61b7e8d9e42f662fbb75a2b9b  go1.12.9.linux-amd64.tar.gz
{{< /output >}}

3. Extract the tarball:

        tar -xvf go1.12.9.linux-amd64.tar.gz

4. Adjust the permissions and move the `go` directory to `/usr/local`:

        sudo chown -R root:root ./go
        sudo mv go /usr/local

## Adjust the Path Variable

1. Using a text editor, open the `~/.profile` file and add the following two lines to the bottom of the file:

    {{< file "~/.profile" conf >}}
export GOPATH=$HOME/go
export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin
{{< /file >}}

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

4. Run the script:

        ./hello

    {{< output >}}
hello, world
{{< /output >}}
