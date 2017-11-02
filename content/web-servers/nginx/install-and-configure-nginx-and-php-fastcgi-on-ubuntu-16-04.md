---
author:
  name: Linode
  email: docs@linode.com
description: 'Serve Dynamic Websites and Applications with the Lightweight Nginx Web Server and PHP-FastCGI on Ubuntu 16.04 LTS'
keywords: ["nginx", "ubuntu 16.04", "fastcgi", "php"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/php-fastcgi/ubuntu-12-04-precise-pangolin/','websites/nginx/install-and-configure-nginx-and-php-fastcgi-on-ubuntu-16-04/']
modified: 2016-09-13
modified_by:
  name: Edward Angert
published: 2015-06-12
title: 'Install and configure nginx and PHP-FastCGI on Ubuntu 16.04'
external_resources:
 - '[The nginx Homepage](http://nginx.org/)'
 - '[FastCGI article on Wikipedia](https://en.wikipedia.org/wiki/FastCGI)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
 - '[How to Configure Ngnix](/docs/websites/nginx/how-to-configure-nginx/)'
---

The nginx web server is a fast, lightweight server designed to efficiently handle the needs of both low- and high-traffic websites. Although commonly used to serve static content, it's quite capable of handling dynamic pages as well. This guide will help you install and run nginx with PHP via FastCGI on your Ubuntu 16.04 Linode.

![Install and configure nginx and PHP-FastCGI on Ubuntu 16.04](/docs/assets/nginx-php-fcgi-tg.png "Install and configure nginx and PHP-FastCGI on Ubuntu 16.04")

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the **sudo** prefix. For more information on privileges, see our [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

- Complete the [Getting Started](/docs/getting-started/) guide, specifically [setting the hostname](/docs/getting-started#setting-the-hostname).

- To confirm your hostname, issue the following commands on your Linode:

        hostname
        hostname -f

    The first command shows your short hostname, and the second shows your fully qualified domain name (FQDN).

- If you are new to Linux systems administration, you may want to consider the [Introduction to Linux Concepts](/docs/tools-reference/introduction-to-linux-concepts) guide and the [Linux Administration Basics](/docs/using-linux/administration-basics) guide.

- Update your system:

      sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install nginx, PHP for Processing, and Required Packages

Install the nginx web server and PHP dependencies:

    sudo apt-get install nginx php7.0-cli php7.0-cgi php7.0-fpm

## Configure nginx Virtual Hosting and the PHP Processor

In this guide, the domain `example.com` is used as an example site. Substitute your own FQDN or IP in the configuration steps that follow.

Nginx uses `server` directives to specify name-based virtual hosts. Nginx calls these *server blocks*. All server blocks are contained within `server` directives in site files, located in `/etc/nginx/sites-available`. When activated, these are included in the main nginx configuration by default.

1.  Nginx includes a sample configuration that you may use as a template. To create a new file with a basic server block for configuration, enter the following command, replacing `example.com` with your domain:

        tail /etc/nginx/sites-available/default -n 13 | cut -c 2- | sudo tee /etc/nginx/sites-available/example.com 1> /dev/null

    The command above reads the example server block contained in the last 13 lines of the default site file, cuts out the `#` comment symbols, and outputs the result to a new site file. For added security, there is no visual output.

    Alternatively, you may manually copy the last section from `/etc/nginx/sites-available/default` into a new file, `/etc/nginx/sites-available/example.com`. You will have to manually remove the `#` in front of the relevant lines.

2.  You should now have the following server block in the nginx virtual host configuration. Replace all instances of `example.com` with your domain, modify the **root** path as shown below, and add the `location ~ \.php$` block:

    {{< file "/etc/nginx/sites-available/example.com" nginx >}}
server {
    listen 80;
    listen [::]:80;

    server_name example.com;

    root   /var/www/html/example.com/public_html;
    index  index.html index.php;

    location / {
        try_files $uri $uri/ =404;
    }
    location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            include fastcgi_params;
            fastcgi_pass unix:/run/php/php7.0-fpm.sock;
            fastcgi_param SCRIPT_FILENAME /var/www/html/example.com/public_html$fastcgi_script_name;
    }
}

{{< /file >}}


3.  Create the root directory referenced in this configuration, replacing `example.com` with your domain name:

        sudo mkdir -p /var/www/html/example.com/public_html

4.  Enable the site, disable the default host, and restart the web server:

        sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled
        sudo rm /etc/nginx/sites-enabled/default
        sudo systemctl restart php7.0-fpm nginx

    To deactivate a site, simply delete the symbolic link:

        sudo rm /etc/nginx/sites-enabled/example.com
        sudo systemctl restart nginx

    The source file is saved, and the site can be re-enabled at any time by recreating the symbolic link.

If you are using nginx to host more than one site, create multiple virtual host files using the method above.

You may also want to edit the `http` block in `/etc/nginx/nginx.conf`, which applies across all sites and allows the following options, among others:

-   Hide HTTP header information using `server_tokens`
-   Configure SSL/TLS settings
-   Customize log file paths

### Important Security Considerations

If you're planning to run applications that support file uploads (images, for example), the above configurations may expose you to a security risk by allowing arbitrary code execution. The short explanation for this behavior is that a properly crafted URI which ends in ".php", in combination with a malicious image file that actually contains valid PHP, can result in the image being processed as PHP.

To mitigate this issue, you may wish to modify your configuration to include a `try_files` directive as shown in this excerpt:

{{< file "/etc/nginx/sites-available/example.com" nginx >}}
location ~ \.php$ {
    try_files $uri =404;
    include /etc/nginx/fastcgi_params;
    fastcgi_pass unix:/run/php/php7.0-fpm.sock;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /var/www/html/example.com/public_html/$fastcgi_script_name;
}

{{< /file >}}


Additionally, it's a good idea to secure any upload directories your applications may use. The following configuration excerpt demonstrates securing an `/images` directory:

{{< file "/etc/nginx/sites-available/example.com" nginx >}}
location ~ \.php$ {
    include /etc/nginx/fastcgi_params;
    if ($uri !~ "^/images/") {
        fastcgi_pass unix:/run/php/php7.0-fpm.sock;
    }
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /var/www/html/example.com/public_html/$fastcgi_script_name;
}

{{< /file >}}


## Test PHP with FastCGI

Create a file called `test.php` in your site's `public_html` directory with the following contents:

{{< file "/var/www/html/example.com/public_html/test.php" php >}}
<?php phpinfo(); ?>

{{< /file >}}


When you visit `http://www.example.com/test.php` in your browser, the standard "PHP info" output is shown.

Congratulations, you've configured the nginx web server to use PHP-FastCGI for dynamic content!
