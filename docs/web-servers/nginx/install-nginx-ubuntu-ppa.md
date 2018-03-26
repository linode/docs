---
author:
  name: Jared Kobos
  email: docs@linode.com
description: 'Shortguide for installing NGINX on Ubuntu.'
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-03-16
modified_by:
  name: Linode
published: 2018-03-05
shortguide: true
show_on_rss_feed: false
title: Install NGINX on Ubuntu from the Official NGINX Repository
---

These instructions install NGINX Mainline on Ubuntu 16.04 from NGINX Inc's official repository. For other distributions, see the [NGINX admin guide](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/#installing-a-prebuilt-package). For information on configuring NGINX for production environments, see our *[Getting Started with NGINX](/docs/web-servers/nginx/nginx-installation-and-basic-setup/)* series.

1.  Open `/etc/apt/sources.list` in a text editor and add the following line to the bottom:

    {{< file-excerpt "/etc/apt/sources.list" >}}
deb http://nginx.org/packages/mainline/ubuntu/ xenial nginx
{{< /file-excerpt >}}

2.  Import the repository's package signing key and add it to `apt`:

        sudo wget http://nginx.org/keys/nginx_signing.key
        sudo apt-key add nginx_signing.key

3.  Install NGINX:

        sudo apt update
        sudo apt install nginx

4.  Ensure NGINX is running and and enabled to start automatically on reboot:

        sudo systemctl start nginx
        sudo systemctl enable nginx
