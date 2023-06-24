---
slug: how-to-install-and-configure-caddy-on-ubuntu-18-04
description: "In this guide, you will install the Caddy web server on Ubuntu 18.04. You will also configure Caddy to serve your site's domain over HTTPS."
keywords: ['web server','caddy','https','Caddyfile']
tags: ["web server","ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-05
modified: 2022-02-04
modified_by:
  name: Linode
title: "Install and Configure the Caddy Web Server on Ubuntu 18.04"
title_meta: "Install and Configure the Caddy Web Server on Ubuntu"
image: CaddyWebServ_Ubuntu1804.png
relations:
    platform:
        key: install-caddy-server
        keywords:
            - distribution: Ubuntu 18.04
aliases: ['/web-servers/caddy/how-to-install-and-configure-caddy-on-ubuntu-18-04/']
authors: ["Linode"]
---

[Caddy](https://caddyserver.com/) is a fast, open-source, and security-focused web server written in [Go](https://golang.org/). Caddy includes modern features such as support for virtual hosts, minification of static files, and HTTP/2. Caddy is also the first web-server that can obtain and renew SSL/TLS certificates automatically using [Let's Encrypt](https://letsencrypt.org/).

## Before You Begin

1.  Familiarize yourself with the [Getting Started](/docs/products/platform/get-started/) guide and complete the steps for setting your Linode's [hostname](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-custom-hostname) and [timezone](/docs/products/compute/compute-instances/guides/set-up-and-secure/#set-the-timezone).

1.  Complete the sections of the [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to [create a standard user account](/docs/products/compute/compute-instances/guides/set-up-and-secure/#add-a-limited-user-account), [harden SSH access](/docs/products/compute/compute-instances/guides/set-up-and-secure/#harden-ssh-access), and [remove unnecessary network services](/docs/products/compute/compute-instances/guides/set-up-and-secure/#remove-unused-network-facing-services).

1.  Register (purchase) your site's domain name and follow our [DNS Manager Overview](/docs/products/networking/dns-manager/#add-records) guide to point the domain to your Linode.

1.  Update your system:

        sudo apt update && sudo apt upgrade

## Install Caddy

1.  Download Caddy:

        sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
        curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
        curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list

1.  Install Caddy:

        sudo apt update && sudo apt install caddy

1.  To verify the installation of Caddy, run the following command:

        caddy version

    This should output a message similar to the text below:

    {{<output>}}
v2.4.3 h1:Y1FaV2N4WO3rBqxSYA8UZsZTQdN+PwcoOcAiZTM8C0I=
{{</output>}}

## Allow HTTP and HTTPS Connections

Caddy serves websites using HTTP and HTTPS protocols, so you need to allow access to the ports 80, and 443.

    sudo ufw allow proto tcp from any to any port 80,443

An output similar to the following appears:

{{< output >}}
Rule added
Rule added (v6)
{{< /output >}}

1.  Verify the changes:

        sudo ufw status

An output similar to the following appears:
{{< output >}}
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
80,443/tcp                 ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
80,443/tcp (v6)            ALLOW       Anywhere (v6)
{{< /output >}}

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

1.  Verify that the service is active:

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

1. Open a web browser and visit your domain. You should see the contents of the `index.html`page that you created in the [Add Web Content section](#add-web-content).
