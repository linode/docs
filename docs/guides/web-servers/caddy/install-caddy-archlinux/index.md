---
slug: install-caddy-archlinux
description: "Caddy is an open source HTTP/2-enabled web server with automatic HTTPS. This guide demonstrates how to install Caddy on Arch Linux."
keywords: ['caddy', 'install caddy', 'archlinux', 'web server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-12-14
modified: 2021-12-30
modified_by:
  name: Linode
title: "Install Caddy on Arch Linux"
external_resources:
- '[Caddy Official Documentation](https://caddyserver.com/docs)'
relations:
    platform:
        key: install-caddy-server
        keywords:
            - distribution: Arch Linux
tags: ["web server"]
aliases: ['/web-servers/caddy/install-caddy-archlinux/']
authors: ["Claudio Costa"]
---

## Before You Begin

1.  Familiarize yourself with the [Getting Started](/docs/products/platform/get-started/) guide and complete the steps for setting your Linode's [hostname](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-custom-hostname) and [timezone](/docs/products/compute/compute-instances/guides/set-up-and-secure/#set-the-timezone).

1.  Complete the sections of the [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to [create a standard user account](/docs/products/compute/compute-instances/guides/set-up-and-secure/#add-a-limited-user-account), [harden SSH access](/docs/products/compute/compute-instances/guides/set-up-and-secure/#harden-ssh-access), and [remove unnecessary network services](/docs/products/compute/compute-instances/guides/set-up-and-secure/#remove-unused-network-facing-services).

1.  Register (purchase) your site's domain name and follow our [DNS Manager Overview](/docs/products/networking/dns-manager/#add-records) guide to point the domain to your Linode.

1.  Update your system:

        sudo pacman -Syu

## What is Caddy?

Caddy is an open source HTTP/2 capable web server with automatic HTTPS written in [Go](https://golang.org/). It supports a variety of web site technologies, includes security defaults, and is very easy to use.

## Install Caddy

You can install Caddy on Arch Linux by using the caddy package. It comes with both of Caddy's systemd service unit files, but does not enable them by default.

    sudo pacman -Syu caddy

## Allow HTTP and HTTPS Connections

Caddy serves websites using HTTP and HTTPS protocols, so you need to allow access to the ports 80, and 443.

    sudo firewall-cmd --permanent --zone=public --add-service=http
    sudo firewall-cmd --permanent --zone=public --add-service=https
    sudo firewall-cmd --reload

## Add Web Content

1.  Set up a home directory, **web root**, for your website:

        sudo mkdir -p /var/www/html/example.com

1.  Create a test page:

        echo '<!doctype html><head><title>Caddy Test Page</title></head><body><h1>Hello, World!</h1></body></html>' > /var/www/html/example.com/index.html

## Configure the Caddyfile

Add your hostname and web root to the Caddy configuration. Use an editor of your choice and replace `:80` with your domain name. Set the root directory of the site to `/var/www/html/example.com` Replace `example.com` with your site's domain name:

{{< file "/etc/caddy/Caddyfile" caddy >}}
example.com {
    root * /var/www/html/example.com
    file_server
}
{{< /file >}}

## Start and Enable the Caddy Service

1.  Enable the Caddy service:

        sudo systemctl start caddy

1. Verify that the service is active:

        sudo systemctl status caddy

    An output similar to the following appears:

    {{< output >}}
● caddy.service - Caddy
   Loaded: loaded (/usr/lib/systemd/system/caddy.service; disabled; vendor preset: disabled)
   Active: active (running) since Thu 2021-09-02 18:25:29 IST; 4s ago
     Docs: https://caddyserver.com/docs/
 Main PID: 19314 (caddy)
   CGroup: /system.slice/caddy.service
           └─19314 /usr/bin/caddy run --environ --config /etc/caddy/Caddyfile...

Sep 02 18:25:29 caddy caddy[19314]: SHELL=/sbin/nologin
Sep 02 18:25:29 caddy caddy[19314]: {"level":"info","ts":1630587329.1270738..."}
Sep 02 18:25:29 caddy systemd[1]: Started Caddy.
Sep 02 18:25:29 caddy caddy[19314]: {"level":"info","ts":1630587329.1316314...]}
Sep 02 18:25:29 caddy caddy[19314]: {"level":"info","ts":1630587329.1317837...0}
Sep 02 18:25:29 caddy caddy[19314]: {"level":"info","ts":1630587329.1324193..."}
Sep 02 18:25:29 caddy caddy[19314]: {"level":"info","ts":1630587329.1324632..."}
Sep 02 18:25:29 caddy caddy[19314]: {"level":"info","ts":1630587329.1325648..."}
Sep 02 18:25:29 caddy caddy[19314]: {"level":"info","ts":1630587329.1326034..."}
Sep 02 18:25:29 caddy caddy[19314]: {"level":"info","ts":1630587329.1326299..."}
Hint: Some lines were ellipsized, use -l to show in full.
{{</ output >}}

    To check the latest logs without truncation use `sudo journalctl -u caddy --no-pager | less +G`.

1.  Open a web browser and visit your domain. You should see the contents of the `index.html`page that you created in the [Add Web Content section](#add-web-content).
