---
slug: install-nginx-debian
author:
  name: Linode
  email: docs@linode.com
description: 'This guide shows how to install the popular and highly performant web server Nginx on your Linode server running the Linux Operating System.'
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-03-20
modified_by:
  name: Linode
published: 2018-03-20
title: Install NGINX on Debian from the Official NGINX Repository
relations:
    platform:
        key: how-to-install-nginx
        keywords:
            - distribution: Debian 9
tags: ["web server","nginx"]
aliases: ['/web-servers/nginx/install-nginx-debian/']
---

These instructions install NGINX Mainline on Debian 9 from NGINX Inc's official repository. For other distributions, see the [NGINX admin guide](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/#installing-a-prebuilt-package). For information on configuring NGINX for production environments, see our *[Getting Started with NGINX](/docs/guides/getting-started-with-nginx-part-1-installation-and-basic-setup/)* series.

1.  Open `/etc/apt/sources.list` in a text editor and add the following line to the bottom:

    {{< file "/etc/apt/sources.list" >}}
deb http://nginx.org/packages/mainline/debian/ stretch nginx
{{< /file >}}

2.  Import the repository's package signing key and add it to `apt`:

        sudo wget http://nginx.org/keys/nginx_signing.key
        sudo apt-key add nginx_signing.key

3.  Install NGINX:

        sudo apt update
        sudo apt install nginx

4.  Ensure NGINX is running and enabled to start automatically on reboots:

        sudo systemctl start nginx
        sudo systemctl enable nginx
