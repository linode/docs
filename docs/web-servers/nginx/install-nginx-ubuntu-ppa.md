---
author:
  name: Jared Kobos
  email: docs@linode.com
description: 'Shortguide for installing NGINX on Ubuntu.'
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-03-05
modified_by:
  name: Linode
published: 2018-03-05
title: How to Install NGINX Using the NGINX ppa Repositories
---

These instructions install NGINX on Ubuntu 16.04. For other distributions, please see the [NGINX official docs](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/). For information on configuring NGINX for production environments, use our [series on NGINX](/docs/web-servers/nginx/nginx-installation-and-basic-setup/).

1.  Open `/etc/apt/sources.list` in a text editor and add the following two lines:

    {{< file-excerpt "/etc/apt/sources.list" >}}
deb http://nginx.org/packages/ubuntu/ xenial nginx
deb-src http://nginx.org/packages/ubuntu/ xenial nginx
{{< /file-excerpt >}}

2.  Install NGINX:

        sudo apt update
        sudo apt install nginx

3.  If you receive a GPG key error, run the following command. Replace the example GPG key signature (`ABF5BD827BD9BF62`) with the key that is output during the error message:

        sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys ABF5BD827BD9BF62

    When this completes, run step 2 again to install NGINX.
