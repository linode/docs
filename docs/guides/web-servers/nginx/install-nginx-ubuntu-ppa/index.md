---
slug: install-nginx-ubuntu-ppa
author:
  name: Jared Kobos
  email: docs@linode.com
description: 'Shortguide for installing NGINX on Ubuntu.'
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-04-23
modified_by:
  name: Linode
published: 2018-03-05
headless: true
show_on_rss_feed: false
title: Install NGINX on Ubuntu from the Official NGINX Repository
tags: ["web server","nginx"]
aliases: ['/web-servers/nginx/install-nginx-ubuntu-ppa/']
---

These steps install NGINX Mainline on Ubuntu from NGINX Inc's official repository. For other distributions, see the [NGINX admin guide](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/#installing-a-prebuilt-package). For information on configuring NGINX for production environments, see our *[Getting Started with NGINX](/docs/guides/getting-started-with-nginx-part-1-installation-and-basic-setup/)* series.

1.  Open `/etc/apt/sources.list` in a text editor and add the following line to the bottom. Replace `CODENAME` in this example with the codename of your Ubuntu release. For example, for Ubuntu 18.04, named Bionic Beaver, insert `bionic` in place of `CODENAME` below:

    {{< file "/etc/apt/sources.list" >}}
deb http://nginx.org/packages/mainline/ubuntu/ CODENAME nginx
{{< /file >}}

2.  Import the repository's package signing key and add it to `apt`:

        sudo wget http://nginx.org/keys/nginx_signing.key
        sudo apt-key add nginx_signing.key

3.  Install NGINX:

        sudo apt update
        sudo apt install nginx

4.  Ensure NGINX is running and enabled to start automatically on reboot:

        sudo systemctl start nginx
        sudo systemctl enable nginx
