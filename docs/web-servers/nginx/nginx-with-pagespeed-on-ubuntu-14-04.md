---
author:
    name: Linode Community
    email: docs@linode.com
description: 'This guide will walk you through setting up the ngx_pagespeed module for nginx on Ubuntu 14.04.'
og_description: 'PageSpeed is an open source Google project created to optimize website performance using modules for Apache and nginx. PageSpeed is available as .deb or .rpm binaries, or can be compiled from source. This guide shows you how to set up the ngx_pagespeed module for nginx on Ubuntu 14.04.'
keywords: ["nginx", "PageSpeed", "ngx_pagespeed", "pagespeed", "ubuntu", "Ubuntu 14.04", ""]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/nginx/nginx-with-pagespeed-on-ubuntu-14-04/']
published: 2015-11-03
modified: 2015-11-03
modified_by:
    name: Linode
title: 'Set Up Nginx with PageSpeed on Ubuntu 14.04'
contributor:
    name: Vaibhav Rajput
    link: https://twitter.com/rootaux
external_resources:
 - '[Google PageSpeed Filter Docs](https://developers.google.com/speed/pagespeed/module/config_filters)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

## What is PageSpeed?

PageSpeed is an open source Google project created to optimize website performance using modules for Apache and nginx. PageSpeed is available as .deb or .rpm binaries, or can be compiled from source.

This document describes how you can install nginx (pronounced engine-x) with the [ngx_pagespeed](https://developers.google.com/speed/pagespeed/module/) module. PageSpeed helps you minify CSS, JavaScript and images, remove whitespaces from HTML, and perform many other tasks.

Before starting this guide, make sure that  you have read through and completed our [Getting Started](/docs/getting-started#debian-7--slackware--ubuntu-1404) and [Securing Your Server](/docs/security/securing-your-server/) guides.

## Set the Hostname

1.  Before you install any package, ensure that your hostname is correct by completing the [Setting Your Hostname](/docs/getting-started#setting-the-hostname) section of the Getting Started guide. Issue the following commands to verify that hostname:

        hostname
        hostname -f

## System Setup

2.  Make sure your system is up to date using apt:

        sudo apt-get update && apt-get upgrade

This ensures that all software is up to date and running the latest version.

## Install required packages

Pagespeed requires some extra packages, which you should install for proper operation. Do so by issuing the following command in the terminal:

    sudo apt-get install build-essential zlib1g-dev libpcre3 libpcre3-dev unzip

## Download ngx_pagespeed module

After installing necessary packages, you must download the module. In this guide, you will be installing the latest  ngx_pagespeed, version 1.9.32.6, at the time of writing.

1.  Make sure you are in the home directory:

        cd

2.  You are defining the version number which  will be installed:

        NPS_VERSION=1.9.32.6

3.  Now, you need to download the source of the module:

        wget https://github.com/pagespeed/ngx_pagespeed/archive/release-${NPS_VERSION}-beta.zip

4.  Extract the file using `unzip` command:

        unzip release-${NPS_VERSION}-beta.zip

5.  Move to the module's directory:

        cd ngx_pagespeed-release-${NPS_VERSION}-beta/

6.  Download some additional files:

        wget https://dl.google.com/dl/page-speed/psol/${NPS_VERSION}.tar.gz

7.  Extract the files using `tar` command:

        tar -xzvf ${NPS_VERSION}.tar.gz

## Download and build Nginx

Now that we have downloaded ngx_pagespeed, we need to compile Nginx with the ngx_pagespeed module. Issue the following commands in the terminal.

1.  You now need to move back to your home directory:

        cd

2.  In this command, you are defining the version of Nginx which will be used, so that you won't have to write it again and again. At the time of this writing, the current, stable version of Nginx is 1.8.0:

        NGINX_VERSION=1.8.0

3.  Download Nginx source from its official website using wget:

        wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz

4.  In this command, you are extracting the source of Nginx:

        tar -xvzf nginx-${NGINX_VERSION}.tar.gz

5.  After extracting the source, you must change your directory:

        cd nginx-${NGINX_VERSION}/

6.  Next, compile the Nginx with PageSpeed module:

        ./configure --add-module=$HOME/ngx_pagespeed-release-${NPS_VERSION}-beta

7.  At this point, you are getting everything ready for the installation:

        make

8.  Issue the following command and it will install Nginx with Pagespeed module:

        sudo make install

## Configure Nginx with ngx_pagespeed

1.  Pagespeed requires a new directory where it can store the cache of minified CSS and javascript:

        sudo mkdir /var/ngx_pagespeed_cache

2.  You need to change the ownership of the folder so that webserver can write to this directory:

        sudo chown www-data:www-data /var/ngx_pagespeed_cache

3.  You need to add some new code in Nginx config file in order to use the module:

        sudo nano /usr/local/nginx/conf/nginx.conf

4.  Then, you need to add the following code to the server block where you want to enable PageSpeed module:

    {{< file-excerpt "/usr/local/nginx/conf/nginx.conf" aconf >}}
pagespeed on;
pagespeed FileCachePath /var/ngx_pagespeed_cache;
location ~ "\.pagespeed\.([a-z]\.)?[a-z]{2}\.[^.]{10}\.[^.]+" {
 add_header "" "";
}
location ~ "^/pagespeed_static/" { }
location ~ "^/ngx_pagespeed_beacon$" { }

{{< /file-excerpt >}}


Also make sure that Nginx is running as `www-data`. In the top of the `conf` file, uncomment `user` and replace `nobody` with `www-data`.

## Start Nginx
Now that you have everything configured correctly, start your web server.

1.  To start the web server:

        sudo /usr/local/nginx/sbin/nginx

2.  To stop the web server:

        sudo /usr/local/nginx/sbin/nginx -s stop

## Check if module works or not

You have compiled and configured the module. You may want to check if the module is working (or not) before deploying the application. Issue the following command at the terminal of your local machine (i.e., your computer):

    curl -I website_url_or_IP_adress

You will see something like `X-Page-Speed: 1.9.32.6` in the response. This means that you have successfully installed ngx_pagespeed on your Linode.
