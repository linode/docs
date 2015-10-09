---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Learn how you can install Nginx with the ngx_pagespeed module on Ubuntu 14.04.'
keywords: 'install ngx_pagespeed, install Nginx from source'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Friday, September 11th, 2015'
modified: Friday, September 11th, 2015
modified_by:
    name: Linode
title: 'How to Install ngx_pagespeed module with Nginx on Ubuntu 14.04'
contributor:
    name: Vaibhav Rajput
    link: https://twitter.com/rootaux
external_resources:
 - '[Google PageSpeed Filter Docs](https://developers.google.com/speed/pagespeed/module/config_filters)'
---

This document describes how you can install Nginx (pronounced engine-x) with the ngx_pagespeed module. PageSpeed module helps us to minify CSS, javascript, images, remove whitespaces from HTML and many other features.

Make sure that before starting this guide you have read through and completed our [Getting Started](/docs/getting-started#debian-7--slackware--ubuntu-1404) guide.

##Set the hostname

1.  Before you install any packages, ensure that your hostname is correct by completing the [Setting Your Hostname](/docs/getting-started#sph_setting-the-hostname) section of the Getting Started guide. Issue the following commands to verify:

        hostname
        hostname -f

##System Setup

2.  Make sure your system is up to date using apt:

        sudo apt-get update && apt-get upgrade

This ensures that all software is up to date and running the latest version.

##Installing required packages

Pagespeed module requires some extra packages which you should install to make it run properly, issue the following command in the terminal.

    sudo apt-get install build-essential zlib1g-dev libpcre3 libpcre3-dev unzip

##Download ngx_pagespeed module

After installing necessary packages, you need to download the module. In this guide, we will be installing latest version of ngx_pagespeed which is 1.9.32.6 at the time of writing.

1.  Make sure you are in the home directory.

        cd

2.  We are defining the version number which we will be installing.

        NPS_VERSION=1.9.32.6

3.  Now we need to download the source of the module. 
    
        wget https://github.com/pagespeed/ngx_pagespeed/archive/release-${NPS_VERSION}-beta.zip

4.  Extract the file using `unzip` command. 
    
        unzip release-${NPS_VERSION}-beta.zip
 
5.  Move to the directory of the module.
    
        cd ngx_pagespeed-release-${NPS_VERSION}-beta/
 
6.  We need to download some additional files. 
    
        wget https://dl.google.com/dl/page-speed/psol/${NPS_VERSION}.tar.gz
 
7.  Extract the files using `tar` command.

        tar -xzvf ${NPS_VERSION}.tar.gz

##Download and build Nginx

Now we have downloaded ngx_pagespeed we need to compile Nginx with the ngx_pagespeed module. Issue the following command in the terminal.

1.  We now need to move back to our home directory.

        cd

2.  In this command, we are defining the version of Nginx which we will be using so that we won't have to write it again and again. At the time of writing current stable version of Nginx is 1.8.0.

        NGINX_VERSION=1.8.0

3.  We will download Nginx source from their official website using wget.

        wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz

4.  In this command, we are extracting the source of Nginx.

        tar -xvzf nginx-${NGINX_VERSION}.tar.gz

5.  After extracting the source, we need to change our directory.

        cd nginx-${NGINX_VERSION}/

6.  Now we are compiling the Nginx with PageSpeed module.

        ./configure --add-module=$HOME/ngx_pagespeed-release-${NPS_VERSION}-beta

7.  Here we are getting everything ready for the installation.

        make

8.  Now issue the following command and it will install Nginx with Pagespeed module.

        sudo make install

##Configuring Nginx with ngx_pagespeed

1.  Pagespeed requires a new directory where it can store the cache of minified CSS and javascript.

        sudo mkdir /var/ngx_pagespeed_cache

2.  You need to change the ownership of the folder so that webserver can write to this directory.

        sudo chown www-data:www-data /var/ngx_pagespeed_cache

3.  We need to add some new code in Nginx config file in order to use the module.

        sudo nano /usr/local/nginx/conf/nginx.conf

4.  Then you need to add the following code to the server block where you want to enable Pagepeed module.

    {: .file-excerpt}
    /usr/local/nginx/conf/nginx.conf
    :   ~~~ conf
        pagespeed on;
        pagespeed FileCachePath /var/ngx_pagespeed_cache;
        location ~ "\.pagespeed\.([a-z]\.)?[a-z]{2}\.[^.]{10}\.[^.]+" {
         add_header "" "";
        }
        location ~ "^/pagespeed_static/" { }
        location ~ "^/ngx_pagespeed_beacon$" { }
        ~~~

Also make sure that Nginx is running as `www-data`. In the top of the `conf` file uncomment `user` and replace `nobody` with `www-data`.

##Starting Nginx
Now we have everything configured correctly, we need to start our web server.

1.  To start the web server. Issue the following command.

        sudo /usr/local/nginx/sbin/nginx

2.  To stop the web server. Issue the following command.
 
        sudo /usr/local/nginx/sbin/nginx -s stop

