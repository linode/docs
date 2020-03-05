---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-04
modified_by:
  name: Linode
title: "Index"
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---
## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
In this guide, you will install Caddy from source. Caddy is not yet available in the yum and epel upstream repositories on CentOS 8.
{{</ note >}}

## Install Go

You will need Go version 1.13 in order to use Caddy.

1. Install `wget`, `tar`, and `git` programs to your system:

        sudo yum install wget -y && sudo yum install tar -y && sudo yum install git -y

1. Download the Go binary for your CentOS 8 system:

        sudo wget https://dl.google.com/go/go1.14.linux-amd64.tar.gz

1. Verify the tarball's checksum:

        sudo sha256sum go1.14.linux-amd64.tar.gz

    Your output should resemble the following. Ensure that the hash printed from the `sha256sum` command matches the one listed on [Go's downloads page](https://golang.org/dl/) (under the **SHA256 Checksum** heading).

    {{< output >}}
08df79b46b0adf498ea9f320a0f23d6ec59e9003660b4c9c1ce8e5e2c6f823ca  go1.14.linux-amd64.tar.gz
    {{</ output >}}

1. Extract the tarball to your system's `/usr/local` directory.

        sudo tar -C /usr/local -xf go1.14.linux-amd64.tar.gz

1. Use the text editor of your choice to add the location of the Go executable to your system's `$PATH`.

    {{< file "/etc/profile">}}
export PATH=$PATH:/usr/local/go/bin
    {{</ file >}}

    Load your $PATH environment variable to your shell session.

        source /etc/profile

    {{< note >}}
This will add Go to your `$PATH` system wide.
    {{</ note >}}

1. Ensure that your Go installation was successful by printing its current version

        go version

    You should see a similar output:

      {{< output >}}
go version go1.14 linux/amd64
      {{</ output >}}

## Build Caddy from Source
### Install Go

1. You will need a current version of Go installed on your Linode. Complete the steps in our guide on [installing Go](/docs/development/go/install-go-on-ubuntu/).

1. Print your Go installation's current `$GOPATH`:

        go env GOPATH

1. Set the transitional environment variable for Go modules.

        cd $GOPATH/src
        export GO111MODULE=on

### Build Caddy

* To build without plugins:

        go get github.com/caddyserver/caddy/caddy

* To build custom Caddy with plugins:
    1. Create a folder named `plugins` and add a `main.go` file with the following contents:

        {{< file "$GOPATH/plugins/main.go" >}}
package main

import (
  "github.com/caddyserver/caddy/caddy/caddymain"

  // plug in plugins here, for example:
  // _ "import/path/here"
)

func main() {
  // optional: disable telemetry
  // caddymain.EnableTelemetry = false
  caddymain.Run()
}
    {{< /file >}}
    1. Create a new go module for Caddy:

            go mod init caddy
    1. Download and save the packages in `$GOPATH/src/<import-path>`:

            go get github.com/caddyserver/caddy
    1. Install Caddy in `$GOPATH/bin`:

            go install

          {{< note >}} To install Caddy in the current directory you can run `go build`
          {{< /note >}}