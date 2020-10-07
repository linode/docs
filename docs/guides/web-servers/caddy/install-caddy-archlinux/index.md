---
slug: install-caddy-archlinux
author:
  name: Linode Community
  email: docs@linode.com
description: 'Caddy is an open source HTTP/2-enabled web server with automatic HTTPS. This guide demonstrates how to install Caddy on Arch Linux.'
keywords: ['caddy', 'install caddy', 'archlinux', 'web server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-12-14
modified: 2018-12-14
modified_by:
  name: Linode
title: "Install Caddy on Arch Linux"
contributor:
  name: Claudio Costa
  link: https://github.com/streamer45
external_resources:
- '[Caddy Official Documentation](https://caddyserver.com/docs)'
relations:
    platform:
        key: install-caddy-server
        keywords:
            - distribution: Arch Linux
tags: ["web server"]
aliases: ['/web-servers/caddy/install-caddy-archlinux/']
---

## Before You Begin

1. Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access and remove unnecessary network services.

1. You will need to register your site's domain name and follow our [DNS Manager Overview](/docs/networking/dns/dns-manager-overview#add-records) guide to point your domain to your Linode.

1. Update your system with `sudo pacman -Syu`

1. Install the development package group with `sudo pacman -S base-devel`

## What is Caddy?

Caddy is an open source HTTP/2 capable web server with automatic HTTPS written in [Go](https://golang.org/). It supports a variety of web site technologies, includes security defaults, and is very easy to use.

## Install Caddy

You can install Caddy on Arch Linux by using a snapshot from the *Arch User Repository* (AUR).

1. Download the snapshot from the AUR:

        curl https://aur.archlinux.org/cgit/aur.git/snapshot/caddy.tar.gz -o caddy.tar.gz

1. Unpack the snapshot:

        tar xf caddy.tar.gz

1. Navigate to the `caddy` directory:

        cd caddy

1. Build and install the package:

        makepkg -si

## Test Caddy

1. Start the Caddy web server:

        sudo systemctl start caddy

1. Enable the Caddy service:

        sudo systemctl enable caddy

1. Navigate to your Linode's domain name or IP address in a web browser. You should see the Caddy default page displayed.

## Configure Caddy

Caddy configuration files reside in `/etc/caddy/` and website configuration files should be created in the `/etc/caddy/caddy.conf.d/` directory.

1. Create a sample configuration file for your website. Replace `example.com` with your Linode's domain name. If you have not set up a domain, but still want to get started with Caddy, replace `example.com` with `:80`.

    {{< file "/etc/caddy/caddy.conf.d/example.com.conf" caddy >}}
example.com {
    root /usr/share/caddy/
}
{{< /file >}}

    {{< note >}}
If you choose to serve your site from a directory other than `/usr/share/caddy/`, you must remove the Caddy test site files located in that directory. The `/usr/share/caddy/` directory is prioritized over other locations, so any files stored in that directory will be served first, even if you have configured a different directory location.
{{< /note >}}

1. Reload Caddy:

        sudo systemctl reload caddy

1. Navigate to your Linode's domain name in a web browser. You should be able to see content served from the root directory configured above.
