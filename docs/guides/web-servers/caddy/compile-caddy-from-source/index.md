---
slug: compile-caddy-from-source
author:
  name: Linode
  email: docs@linode.com
description: 'This guide will explain how to build Caddy from source'
keywords: ["caddy", "web server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-09-14
modified: 2019-01-07
modified_by:
  name: Linode
title: 'How To Build Caddy From Source'
external_resources:
- '[Caddy Official Site](https://caddyserver.com)'
tags: ["web server"]
aliases: ['/web-servers/caddy/compile-caddy-from-source/']
---

[Caddy](https://caddyserver.com/) is a fast, open-source and security-focused web server written in [Go](https://golang.org/). Caddy includes modern features such as support for virtual hosts, minification of static files, and HTTP/2. Caddy is also the first web-server that can obtain and renew SSL/TLS certificates automatically using [Let's Encrypt](https://letsencrypt.org/).

Caddy has recently updated their license, clearly defining what is considered personal or enterprise use. A commercial license is now required for commercial or enterprise use, including any installation that uses precompiled Caddy binaries. However, because the project is Apache licensed, by building it from source you have access to the original, [Apache-licensed web server](https://twitter.com/mholt6/status/908041929438371840).

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

Caddy is now installed on your Linode. Read our guide on [Installing and Configuring Caddy](/docs/web-servers/caddy/install-and-configure-caddy-on-centos-7/) to learn more about Caddy.
