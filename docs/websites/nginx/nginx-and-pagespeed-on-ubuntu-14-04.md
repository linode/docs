---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Learn how you can install Nginx with the ngx_pagespeed module on Ubuntu 14.04.'
keywords: 'install ngx_pagespeed, install Nginx from source'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Weekday, Month 00th, 2015'
modified: Friday, September 11th, 2015
modified_by:
    name: Linode
title: 'How to Install ngx_pagespeed module with Nginx on Ubuntu 14.04'
contributor:
    name: Vaibhav Rajput
    link: https://twitter.com/IamVRajput
external_resources:
 - '[Google PageSpeed Filter Docs](https://developers.google.com/speed/pagespeed/module/config_filters)'
---

This document describes how you can install Nginx (pronounced engine-x) with the ngx_pagespeed module. PageSpeed module helps us to minify CSS, javascript, images, remove whitespaces from HTML and many other features.

Make sure that before starting this guide you have read through and completed our [Getting Started](/docs/getting-started/) guide.

##Set the hostname

Before you install any packages, ensure that your hostname is correct by completing the [Setting Your Hostname](/docs/getting-started#sph_setting-the-hostname) section of the Getting Started guide. Issue the following commands to verify:

    hostname
    hostname -f

##System Setup

Make sure your system is up to date using apt:

    sudo apt-get update

This ensures that all software is up to date and running the latest version.

##Installing required packages

Pagespeed module requires some extra packages which you should install to make it run properly, issue the following command in terminal.

    sudo apt-get install build-essential zlib1g-dev libpcre3 libpcre3-dev unzip

##Download ngx_pagespeed module

After installing necessary packages, you need to download ngx_pagespeed. Issue the following command in the terminal one by one.

    cd
    NPS_VERSION=1.9.32.6
    wget https://github.com/pagespeed/ngx_pagespeed/archive/release-${NPS_VERSION}-beta.zip
    unzip release-${NPS_VERSION}-beta.zip
    cd ngx_pagespeed-release-${NPS_VERSION}-beta/
    wget https://dl.google.com/dl/page-speed/psol/${NPS_VERSION}.tar.gz
    tar -xzvf ${NPS_VERSION}.tar.gz

You need to run the above commands one by one. In this example, we will be installing ngx_pagespeed version 1.9.32.6.

##Download and build Nginx

Now we have downloaded ngx_pagespeed we need to compile Nginx with the ngx_pagespeed module. Issue the following command in the terminal one by one.

We now need to move back to our home directory.
    cd

In the command, we are defining the version of Nginx we will be using so that we won't have to write it again and again. At the time of writing current stable version of Nginx is 1.8.0

    NGINX_VERSION=1.8.0

We will download Nginx source from their official website using wget.

    wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz

In this command, we are extracting the source of Nginx.

    tar -xvzf nginx-${NGINX_VERSION}.tar.gz

After extracting the source, we need to change our directory.

    cd nginx-${NGINX_VERSION}/

Now we are compiling the Nginx with PageSpeed module.

    ./configure –add-module=$HOME/ngx_pagespeed-release-${NPS_VERSION}-beta

Here we are getting everything ready for the installation.
    make

Now issue the following command and it will install Nginx with Pagespeed module.

    sudo make install

##Configuring Nginx with ngx_pagespeed

Pagespeed requires and new directory where it can store the cache of minified CSS and javascript.

    mkdir /var/ngx_pagespeed_cache

Now that we have successfully compiled Nginx with Pagespeed module. We need to add some new code in Nginx config file in order to use the module.

    sudo nano /usr/local/nginx/conf/nginx.conf

Then you need to add the following code to the server block where you want to enable Pagepeed module.

{: .file }
/usr/local/nginx/conf/nginx.conf
:   ~~~ conf
    pagespeed on;
    pagespeed FileCachePath /var/ngx_pagespeed_cache;
    location ~ “\.pagespeed\.([a-z]\.)?[a-z]{2}\.[^.]{10}\.[^.]+” {
    add_header “” “”;
    }
    location ~ “^/pagespeed_static/” { }
    location ~ “^/ngx_pagespeed_beacon$” { }
    ~~~

{: .caution}
>
> If improperly configured pagespeed module will not work.

##Starting Nginx
Now we have everything configured correctly, we need to start our web server.

To start the web server. Issue the following command.

    sudo /usr/local/nginx/sbin/nginx

To stop the web server. Issue the following command.

    sudo /usr/local/nginx/sbin/nginx -s stop
