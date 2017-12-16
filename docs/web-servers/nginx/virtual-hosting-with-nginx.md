---
author:
  name: Linode Community
  email: docs@Linode.com
description: 'Hosting virtual sites with the Nginx web server is an effective way to publish multiple websites on a single Linode server instance.'
keywords: ["nginx", "virtual sites", "virtual domains"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-12-15
modified:
modified_by:
  name: Linode
title: 'Virtual Hosting with Nginx'
contributor:
   name: Andrew Lescher
   link: https://www.linkedin.com/in/andrew-lescher-87027940
external_resources:
  - '[How to Configure nginx](/docs/web-servers/nginx/how-to-configure-nginx/)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn up to $300 per published guide.*

---

## Introduction To Virtual Hosting with Nginx

This guide will outline the basic steps for hosting multiple domains on a single Nginx server instance. Upon completion, you will be able to navigate to any owned web domain on port 80 or port 443 and Nginx will automatically find and load the correct server block.

## Before You Begin

1. Working through this tutorial requires a root user account, and is written as if commands are issued as the root user. Readers choosing to use a limited user account will need to prefix commands with `sudo` where required. If you have yet to create a limited user account, follow the steps in the [Securing Your Server](/docs/security/securing-your-server) guide.

2. The instructions in this guide can be performed on any Linux distribution where Nginxn is installed. Be aware that directory locations may differ slightly depending on your distribution, however.

3. An Nginx web server instance will need to be installed and running on your machine. Typically, most users will benefit from having an entire LEMP stack installed. If need guidance on installing Nginx or a LEMP stack, you will find tutorials for most Linux distributions by searching the [Linode docs repository](https://linode/docs/).

# Create Virtual Hosting Framework

A typical virtual hosting setup with Nginx will include an overall *HTTP* block in the **nginx.conf** file which will encompass any directives that should apply to all enabled domains. The *Server* block is then removed from **nginx.conf** and placed in a separate configuration file(s) for each active domain. Lastly, a *sites-enabled* and *sites-available* directory will be created to simplify the process of enabling/disabling any particular domain. The first step involves creating the necessary directories which will act as the virtual hosting framework.

1. Navigate to the main Nginx directory. 

        cd /etc/nginx

2. Create two new directories within **/etc/nginx** titled *sites-available* and *sites-enabled*. Update the permissions on each directory as shown.

        mkdir /etc/nginx/[sites-enabled,sites-available]
        chmod 755 /etc/nginx/[sites-enabled,sites-available]

3. Navigate to the **/etc/nginx/sites-available** directory and create a configuration file for each domain you would like to host. The following example will include two domains titled **example-site1.com** and **example-site2.com**. Change the domain names to reflect your particular domains.

        touch [example-site1.com.conf,example-site2.com.conf]

4. Before Nginx will load the domains added to **/sites-available**, the configuration files must exist in the **/sites-enabled** directory. This configuration allows any domain to be easily switched on or off. For each domain you would like to host, create a symlink from **/sites-available** to **/sites-enabled**. The following instructions will use the two example domains created in the previous step.

        ln -s /etc/nginx/sites-available/example-site1.com.conf /etc/nginx/sites-enabled/example-site1.com.conf
        ln -s /etc/nginx/sites-available/example-site2.com.conf /etc/nginx/sites-enabled/example-site2.com.conf

# Edit Configuration Files

With the framework in place, the configuration files can now be populated.

## Universal HTTP Configuration

1. Open the **nginx.conf** file with your preferred text editor, and replace the existing contents with the ones shown below. This file will now define the universal behavior of Nginx for each enabled domain. The following configuration should be a sufficient starting point for most users, and can be expanded upon if necessary.

{{< file-excerpt "/etc/nginx/conf/nginx.conf"  >}}

# Universal configuration for all Nginx virtual sites

user nginx;
worker_processes 2;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    server_tokens off;
    keepalive_timeout 65;
    keepalive_requests 100000;
    sendfile         on;
    tcp_nopush       on;
    tcp_nodelay      on;

    client_body_buffer_size    128k;
    client_max_body_size       10m;
    client_header_buffer_size    1k;
    large_client_header_buffers  4 4k;
    output_buffers   1 32k;
    postpone_output  1460;

    client_header_timeout  3m;
    client_body_timeout    3m;
    send_timeout           3m;

    open_file_cache max=1000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 5;
    open_file_cache_errors off;

    # [ debug | info | notice | warn | error | crit | alert | emerg ]
    error_log  /var/log/nginx/error.log  warn;

    log_format main      '$remote_addr - $remote_user [$time_local]  '
      '"$request" $status $bytes_sent '
      '"$http_referer" "$http_user_agent" '
                     '"$gzip_ratio"';

    log_format download  '$remote_addr - $remote_user [$time_local]  '
      '"$request" $status $bytes_sent '
      '"$http_referer" "$http_user_agent" '
                '"$http_range" "$sent_http_content_range"';

    map $status $loggable {
        ~^[23]  0;
        default 1;
    }

   include /etc/nginx/sites-enabled/*.conf;

    ## Increase the amount of memory allocated to parsing domain names (useful for multiple domains).
    server_names_hash_bucket_size 64;

    upstream php_workers {
        server unix:/var/run/php-fpm/php-fpm.socket;
    }
}
{{< /file-excerpt >}}

## Domain Server Configuration

1. A server block will need to be configured for each virtual domain in the **sites-available** directory. These configuration files will determine how Nginx serves each site individually. In the following example, replace *example-site1.com* with your own domain name. You may also need to modify any file paths listed below if they differ from your current setup. Additionally, some sections (such as the SSL section) are commented out, and you may uncomment them as needed to suit your domain setup.

        {{< file-excerpt "/etc/nginx/sites-available/example-site1.com.conf" >}}

server {
    listen 80;
    listen [::]:80;
    server_name example-site1.com;

    location / {
        root  /var/www/example-site1.com/public_html;
        try_files $uri $uri/ =404;
        index  index.html index.htm index.php;
        access_log /var/www/example-site1.com/logs/access.log;
        error_log /var/www/example-site1.com/logs/error.log info;
    }

# Uncomment this section if Nginx has been compiled with fastcgi.
#    location ~\.php$ {
#        try_files $uri =404;
#        fastcgi_split_path_info ^(.+\.php)(/.+)$;
#        fastcgi_pass unix:/var/run/php5-fpm.sock;
#        fastcgi_index index.php;
#        include fastcgi_params;
#    }

# Uncomment if any custom error pages are included
#    error_page  500 502 503 504  /50x.html;
#
#    location = /50x.html {
#        root  /usr/share/nginx/html;
#    }

#    Uncomment if http traffic should be redirected to https
#    if ($scheme != "https") {
#        return 301 https://$host$request_uri;
#    }
}

# Uncomment if using SSL encryption (https)
#server {
#    listen 443 ssl;
#    listen [::]:443 ssl;
#    server_name example-site1.com;
#    }
#
#    location / {
#        root  /var/www/example-site1.com/public_html;
#        index  index.html index.htm index.php;
#        try_files $uri $uri/ =404;
#        access_log /var/www/example-site1.com/logs/access.log;
#        error_log /var/www/example-site1.com/logs/error.log info;
#    }
#
#    ssl_certificate /path/to/ssl/cert.pem
#    ssl_certificate_key /path/to/ssl/privkey.pem
#

# Uncomment this section if Nginx has been compiled with fastcgi.
#    location ~ \.php$ {
#        try_files $uri =404;
#        fastcgi_split_path_info ^(.+\.php)(/.+)$;
#        fastcgi_pass unix:/var/run/php5-fpm.sock;
#        fastcgi_index index.php;
#        include fastcgi_params;
#    }

# Uncomment if any custom error pages are included
#    error_page  500 502 503 504  /50x.html;
#
#    location = /50x.html {
#        root  /usr/share/nginx/html;
#    }
}
{{< /file-excerpt >}}

# Where To Go From Here

Remember, the configuration files shown in this guide serve as a basic starting point which should suffice for most users. If you have started with a fresh Nginx installation, the next step is to customize these files in a way that will best serve the needs of your specific setup. Additionally, if you are unfamiliar with any of the syntax in these configuration files, you may wish to learn and expand on what has been provided. The [How to Configure nginx](/docs/web-servers/nginx/how-to-configure-nginx/) guide will address both of these concerns, and provide more in depth explanations for most of the syntax introduced in this guide.
