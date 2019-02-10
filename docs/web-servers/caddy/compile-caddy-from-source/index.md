---
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
---

[Caddy](https://caddyserver.com/) is a fast, open-source and security-focused web server written in [Go](https://golang.org/). Caddy includes modern features such as support for virtual hosts, minification of static files, and HTTP/2. Caddy is also the first web-server that can obtain and renew SSL/TLS certificates automatically using [Let's Encrypt](https://letsencrypt.org/).

Caddy has recently updated their license, clearly defining what is considered personal or enterprise use. A commercial license is now required for commercial or enterprise use, including any installation that uses precompiled Caddy binaries. However, because the project is Apache licensed, by building it from source you have access to the original, [Apache-licensed web server.](https://twitter.com/mholt6/status/908041929438371840).

## Build Caddy

You will need a current version of Go on your Linode. Read our guide on [installing Go](/docs/development/go/install-go-on-ubuntu/).

1. Print your Go installation's current `$GOPATH`:

        go env GOPATH

1. Pull Caddy from the source. Replace `$GOPATH` with the path retrieved in the previous step.

        cd $GOPATH/src
        go get -u github.com/mholt/caddy
        go get -u github.com/caddyserver/builds

2. Navigate to the Caddy directory and start the build:

        cd $GOPATH/src/github.com/mholt/caddy/caddy
        go run build.go -goos=linux -goarch=amd64

3. When the build finishes you will have a Caddy binary in the current directory. Move the binary to `/usr/bin` so that Caddy can function correctly:

        sudo cp caddy /usr/bin/

Caddy is now installed on your Linode. Read our guide on [Installing and Configuring Caddy](/docs/web-servers/caddy/install-and-configure-caddy-on-centos-7/) to learn more about Caddy.
