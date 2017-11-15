---
author:
    name: Linode Community
    email: docs@linode.com
description: 'PageSpeed is an open source Google project created to optimize website performance. Learn how to set up PageSpeed for Nginx.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/nginx/nginx-with-pagespeed-on-ubuntu-14-04/','web-servers/nginx/nginx-with-pagespeed-on-ubuntu-14-04/ ', 'web-servers/nginx/nginx-with-pagespeed-on-ubuntu-16-04/']
published: 2015-11-03
modified: 2017-09-14
modified_by:
    name: Linode
title: 'Install Nginx ngx_pagespeed Module on Ubuntu 16.04'
contributor:
    name: Vaibhav Rajput
    link: https://twitter.com/rootaux
external_resources:
 - '[Google PageSpeed Filter Docs](https://developers.google.com/speed/pagespeed/module/config_filters)'
 - '[Pagespeed Filter Examples](https://www.ngxpagespeed.com/)'
---

*This is a Linode Community guide. Write for us and earn $300 per published guide.*
<hr>

Pagespeed is a tool built by Google that boosts the speed and performance of a website by automatically minifying assets (such as CSS, Javascript, and images), and applying other web performance best practices.

This guide will show you how to use Pagespeed with Nginx to reduce the page load times of your website, using the [ngx_pagespeed](https://developers.google.com/speed/pagespeed/module/) module.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3. Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Install ngx_pagespeed

Download and install the `ngx_pagespeed` module and its dependencies.

1. Install the required dependencies:

        sudo apt-get install build-essential zlib1g-dev libpcre3 libpcre3-dev unzip

2. Make sure you are in the home directory:

        cd

3.  Define the version of `ngx_pagespeed` to be installed :

        NPS_VERSION=1.12.34.2-stable

    {{< note >}}
This guide uses the current stable version as of this writing. However, you can check
the [ngx_pagespeed release notes](https://www.modpagespeed.com/doc/release_notes) and update this command with the most recent version.
{{< /note >}}

4.  Download the module source code:

        wget https://github.com/pagespeed/ngx_pagespeed/archive/release-${NPS_VERSION}-beta.zip

5.  Extract the file and move to the module's directory:

        unzip v${NPS_VERSION}.zip
        cd ngx_pagespeed-${NPS_VERSION}

6.  Pagespeed also requires some additional files. Download and unzip them:

        NPS_RELEASE_NUMBER=${NPS_VERSION/stable/}
        psol_url=https://dl.google.com/dl/page-speed/psol/${NPS_RELEASE_NUMBER}.tar.gz [ -e scripts/format_binary_url.sh ]
        psol_url=$(scripts/format_binary_url.sh PSOL_BINARY_URL)
        wget ${psol_url}
        tar -xzvf $(basename ${psol_url})

## Download and build Nginx

Now compile Nginx with the `ngx_pagespeed` module.

1.  Move back to your home directory:

        cd

2.  Define the version of Nginx which will be used, so that you won't have to write it repeatedly. At the time of this writing, the current stable version of Nginx is 1.12.1:

        NGINX_VERSION=1.12.1

3.  Download Nginx source from its official website using `wget`:

        cd
        wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz

4.  Extract the Nginx source:

        tar -xvzf nginx-${NGINX_VERSION}.tar.gz

5.  Move to the Nginx directory:

        cd nginx-${NGINX_VERSION}/

6.  Configure Nginx to include the PageSpeed module:

        ./configure --add-module=$HOME/ngx_pagespeed-${NPS_VERSION} ${PS_NGX_EXTRA_FLAGS}

7.   Build and install Nginx:

            make
            sudo make install

## Configuring Nginx with ngx_pagespeed

1.  Pagespeed requires a new directory where it can store the cache of minified CSS and javascript. Create this directory if it doesn't already exist:

        sudo mkdir /var/ngx_pagespeed_cache

2.  Change the ownership of the directory so that the webserver can write to it:

        sudo chown www-data:www-data /var/ngx_pagespeed_cache

3.  Open `/usr/local/nginx/conf/nginx.conf` and add the following code to the server block where you want to enable the PageSpeed module:

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

## Starting Nginx
Once everything is configured correctly, start the web server.

1.  To start the web server:

        sudo /usr/local/nginx/sbin/nginx

2.  To stop the web server:

        sudo /usr/local/nginx/sbin/nginx -s stop

## Check Your Installation

You may want to check if the module is working before deploying the application:

    curl -I localhost:80/

You should see something like `X-Page-Speed: 1.9.32.6` in the response. Congratulations, you have successfully installed `ngx_pagespeed` on your Linode.
