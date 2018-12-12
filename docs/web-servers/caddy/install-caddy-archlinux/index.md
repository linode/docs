---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Caddy is an open source HTTP/2-enabled web server with automatic HTTPS. This guide demonstrates how to install Caddy on Arch Linux.'
keywords: ['caddy', 'install caddy', 'archlinux', 'web server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-10-17
modified: 2018-10-17
modified_by:
  name: Linode
title: "Install Caddy on Arch Linux"
contributor:
  name: Claudio Costa
  link: https://github.com/streamer45
external_resources:
- '[Caddy Official Documentation](https://caddyserver.com/docs)'
---

## Before You Begin

1. Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access and remove unnecessary network services.

1. You will need to register your site's domain name and follow our [DNS Manager Overview](/docs/networking/dns/dns-manager-overview#add-records) guide to point your domain to your Linode.

1. Update your system with `sudo pacman -Syu`

1. Install the development package group with `sudo pacman -S base-devel`

## What is Caddy?

Caddy is an open source HTTP/2 capable web server with automatic HTTPS written in [Go](https://golang.org/). It supports a vast variety of web site technologies which, alongside its security defaults and usability, make it one of the most easy to use web servers.

## Install Caddy

The best way to install Caddy on Arch Linux is by using a snapshot from the *Arch User Repository* (AUR).

1. Download the snapshot from the AUR.

        curl https://aur.archlinux.org/cgit/aur.git/snapshot/caddy.tar.gz -o caddy.tar.gz

1. Unpack the snapshot.

        tar xf caddy.tar.gz

1. Navigate to the directory.

        cd caddy

1. Build and install the package.

        makepkg -si

## Test Caddy

1. Start Caddy:

        sudo systemctl start caddy

1. Enable the Caddy service:

        sudo systemctl enable caddy

1. Navigate to your Linode's domain name or IP address in a web browser. You should see the Caddy default page displayed.

## Configure Caddy

Caddy configuration files reside in `/etc/caddy/` and website configuration files should be created in `/etc/caddy/caddy.conf.d/`.

1. Create a sample configuration file for your website. Replace `example.com` with your Linode's domain name, or `:80` if you don't have a domain yet but still want to get started with Caddy.

    {{< file "/etc/caddy/caddy.conf.d/example.com.conf" caddy >}}
example.com {
    root /usr/share/caddy/
}
{{< /file >}}

    {{< note >}}
If you choose to serve your site from a filesystem directory other than `/usr/share/caddy/`, you must remove the Caddy test site files located there. The folder `/usr/share/caddy/` is prioritized over other locations, even when specified in the Caddyfile, so this directory must then be emptied.
{{< /note >}}

1. Reload Caddy:

        sudo systemctl reload caddy

1. Navigate to your Linode's domain name in a web browser. You should be able to see content served from the root directory configured above.
