---
slug: compile-caddy-from-source
author:
  name: Linode
  email: docs@linode.com
description: 'This guide provides you with step-by-step instructions for building Caddy, the fast, open-source, security focused web server from source on Linux.'
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

## Before you Begin

### Install Go

1. You need the latest version of Go installed on your Linode. Complete the steps in our guide on [installing Go](/docs/guides/install-go-on-ubuntu/).

### Install xcaddy

Install the latest version of `xcaddy`, a command line tool that downloads and builds Caddy and its plugins for you easily.

1. Download and install `xcaddy`:

        sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
        curl -1sLf 'https://dl.cloudsmith.io/public/caddy/xcaddy/gpg.key' | sudo tee /etc/apt/trusted.gpg.d/caddy-xcaddy.asc
        curl -1sLf 'https://dl.cloudsmith.io/public/caddy/xcaddy/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-xcaddy.list
        sudo apt update
        sudo apt install xcaddy

### Build Caddy

1. Create a folder named `caddy` and go to the folder to install Caddy:
        mkdir ~/caddy
        cd ~/caddy
* To build the latest version of Caddy without any plugins:
        xcaddy build

* To install Caddy with plugins use the `--with` option. For example:

        xcaddy build \
          --with github.com/caddyserver/nginx-adapter \
          --with github.com/caddyserver/ntlm-transport@v0.1.1```

1. Move the `caddy` executable from the `caddy` folder to `/usr/bin` to install:

        sudo mv caddy /usr/bin

1. To verify the installation of caddy type:
       caddy version
    An output similar to the following appears:

        v2.4.4 h1:QBsN1jXEsCqRpKPBb8ebVnBNgPxwL50HINWWTuZ7evU=

Caddy is now installed on your Linode. Read our guide on [Installing and Configuring Caddy](/docs/guides/install-and-configure-caddy-on-centos-7/) to learn more about Caddy.
