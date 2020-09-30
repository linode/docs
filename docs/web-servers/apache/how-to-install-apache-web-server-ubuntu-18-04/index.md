---
author:
  name: Linode
  email: docs@linode.com
description: 'Install Apache on your Ubuntu 18.04 LTS server, configure virtual hosting, and set up modules and scripting.'
og_description: 'Install Apache on your Ubuntu 18.04 LTS server, configure virtual hosting, and set up modules and scripting.'
keywords: ["apache", "ubuntu", "ubuntu 18.04", "http", "web server"]
tags: ["web server","apache","ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-12-31
modified_by:
  name: Linode
published: 2015-07-31
title: 'How to Install Apache Web Server on Ubuntu 18.04 LTS'
h1_title: 'Installing Apache Web Server on Ubuntu 18.04 LTS'
external_resources:
 - '[Apache HTTP Server Version 2.4 Documentation](http://httpd.apache.org/docs/2.4/)'
 - '[Apache Configuration](/docs/web-servers/apache/configuration/)'
image: 'How_to_Install_Apache_Web_Server_on_Ubuntu_1804_LTS_1200x631.png'
---

The *Apache HTTP Web Sever* (Apache) is an open source web application for deploying web servers. This guide explains how to install and configure an Apache web server on Ubuntu 18.04 LTS.

If instead you would like to install a full LAMP (Linux, Apache, MySQL and PHP) stack, please see the [How to Install a LAMP Stack on Ubuntu 18.04](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-ubuntu-18-04/) guide.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{</ note >}}

## Before You Begin

1.  Set up your Linode in the [Getting Started](/docs/getting-started/) and [Securing your Server](/docs/security/securing-your-server/) guides.

1.  If you want a custom domain name for your site, you can set this up using our [DNS Manager](/docs/platform/manager/dns-manager/) guide.

    - Don't forget to update your `/etc/hosts` file with the public IP address and your site's fully qualified domain name as explained in the [Update Your System's hosts File](/docs/getting-started/#update-your-system-s-hosts-file) section of the [Getting Started](/docs/getting-started/) guide.

    {{< content "limited-user-note-shortguide" >}}

## Install Apache

Install Apache 2.4:

    sudo apt-get install apache2

## Multi-Processing Modules

Apache 2.4 offers several multi-processing modules (MPMs) to handle connections. In Ubuntu 18.04 LTS the default MPM is the *event module*, although the *prefork module* is still recommended if you’re using standard PHP. Below are the basic default settings. For detailed explanations and advanced settings for these modules, see the [Tuning Your Apache Server](/docs/web-servers/apache-tips-and-tricks/tuning-your-apache-server/#multi-processing-modules) guide.

1.  You can check which MPM is currently configured with the following command:

        sudo apachectl -V | grep -i mpm

    {{< output >}}
Server MPM:     event
{{</ output >}}

### The Prefork Module

The Prefork Module is ideal for single threaded applications. It's a single parent with multiple forked child servers that are identical processes which wait for incoming requests. Each child process handles a single request. The Prefork Module is resource intensive but necessary for applications that do not support multi-threading such as PHP.

1.  Open `/etc/apache2/mods-available/mpm_prefork.conf` in your text editor and edit the values as needed. The following are the default values:

    {{< file "/etc/apache2/mods-available/mpm_prefork.conf" conf >}}
# prefork MPM
# StartServers: number of server processes to start
# MinSpareServers: minimum number of server processes which are kept spare
# MaxSpareServers: maximum number of server processes which are kept spare
# MaxRequestWorkers: maximum number of server processes allowed to start
# MaxConnectionsPerChild: maximum number of requests a server process serves

<IfModule mpm_prefork_module>
        StartServers              5
        MinSpareServers           5
        MaxSpareServers           10
        MaxRequestWorkers         150
        MaxConnectionsPerChild    0
</IfModule>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
{{</ file >}}

1.  On Ubuntu 18.04, the *event module* is enabled by default. Disable it, and enable the *prefork module* :

        sudo a2dismod mpm_event
        sudo a2enmod mpm_prefork

1.  Restart Apache:

        sudo service apache2 restart

### The Worker Module

The Worker Module is a hybrid Prefork, multi-threaded, multi-processor module. It's similar to Prefork, but each child is multi-threaded.

1.  Open `/etc/apache2/mods-available/mpm_worker.conf` in your text editor and edit the values as needed. The following are the default values:

    {{< file "/etc/apache2/mods-available/mpm_worker.conf" conf >}}
# worker MPM
# StartServers: initial number of server processes to start
# MinSpareThreads: minimum number of worker threads which are kept spare
# MaxSpareThreads: maximum number of worker threads which are kept spare
# ThreadLimit: ThreadsPerChild can be changed to this maximum value during a
#                         graceful restart. ThreadLimit can only be changed by stopping
#                         and starting Apache.
# ThreadsPerChild: constant number of worker threads in each server process
# MaxRequestWorkers: maximum number of threads
# MaxConnectionsPerChild: maximum number of requests a server process serves

<IfModule mpm_worker_module>
        StartServers             2
        MinSpareThreads          25
        MaxSpareThreads          75
        ThreadLimit              64
        ThreadsPerChild          25
        MaxRequestWorkers        150
        MaxConnectionsPerChild   0
</IfModule>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
{{</ file >}}

1.  On Ubuntu 18.04, the *event module* is enabled by default. Disable it, and enable the *worker module* :

        sudo a2dismod mpm_event
        sudo a2enmod mpm_worker

1.  Restart Apache:

        sudo service apache2 restart

### The Event Module

The Event Module is similar to the Worker Module except each thread has a dedicated listener so that threads are not locked in wait. As of Apache 2.4 the Event Module is considered stable. For versions before 2.4, use the [Worker Module](#the-worker-module).

1.  If you choose to keep the *event module* enabled, open `/etc/apache2/mods-available/mpm_event.conf` in your text editor and edit the values as needed. The following are the default values:

    {{< file "/etc/apache2/mods-available/mpm_event.conf" conf >}}
# event MPM
# StartServers: initial number of server processes to start
# MinSpareThreads: minimum number of worker threads which are kept spare
# MaxSpareThreads: maximum number of worker threads which are kept spare
# ThreadsPerChild: constant number of worker threads in each server process
# MaxRequestWorkers: maximum number of worker threads
# MaxConnectionsPerChild: maximum number of requests a server process serves
<IfModule mpm_event_module>
        StartServers             2
        MinSpareThreads          25
        MaxSpareThreads          75
        ThreadLimit              64
        ThreadsPerChild          25
        MaxRequestWorkers        150
        MaxConnectionsPerChild   0
</IfModule>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
{{</ file >}}

1.  Restart Apache:

        sudo service apache2 restart

## Configure Virtual Hosting

Apache supports *name-based virtual hosting*, which allows you to host multiple domains on a single server with a single IP. Although there are different ways to set up virtual hosts, the method below is recommended.

1.  Disable the default Apache virtual host:

        sudo a2dissite 000-default.conf

1.  Create an `example.com.conf` file in `/etc/apache2/sites-available` with your text editor, replacing instances of `example.com` with your own domain URL in both the configuration file and in the file name:

    {{< file "/etc/apache2/sites-available/example.com.conf" aconf >}}
<VirtualHost *:80>
     ServerAdmin webmaster@example.com
     ServerName example.com
     ServerAlias www.example.com
     DocumentRoot /var/www/example.com/public_html/
     ErrorLog /var/www/example.com/logs/error.log
     CustomLog /var/www/example.com/logs/access.log combined
</VirtualHost>
{{</ file >}}

    Repeat this process for any other domains you host.

    {{< note >}}
If you would like to enable Perl support, add the following lines above the closing `</VirtualHost>` tag:

{{< file "/etc/apache2/sites-available/example.com.conf" aconf >}}
Options ExecCGI
AddHandler cgi-script .pl
{{</ note >}}

{{< /file >}}

1.  Create directories for your websites and websites' logs, replacing `example.com` with your own domain information:

        sudo mkdir -p /var/www/example.com/public_html
        sudo mkdir /var/www/example.com/logs

1.  Create a simple page for your `index.html`.

    {{< file "/var/www/example.com/public_html/index.html" html >}}
<!DOCTYPE html>
<html>
    <head>
        <title>Hello World</title>
    </head>
    <body>
        <h1>Hello World! This is my sample website with Apache on Ubuntu!</h1>
    </body>
</html>
{{</ file >}}

1.  Enable the site:

        sudo a2ensite example.com.conf

1.  Restart Apache:

        sudo service apache2 restart

1.  Visit your site by navigating to your domain name in the web browser.

    ![Sample Website Loaded in Browser](install-apache-example-website-ubuntu.png "Sample Website Loaded in Browser")

## Apache Mods and Scripting

### Install Apache Modules

One of Apache's strengths is its ability to be customized with modules. The default installation directory for Apache modules is the `/etc/apache2/mods-available/` directory.

1.  List available Apache modules:

        sudo apt-cache search libapache2*

1.  Install any desired modules:

        sudo apt-get install [module-name]

1.  All mods are located in the `/etc/apache2/mods-available` directory. Edit the `.conf` file of any installed module if needed, then enable the module:

        sudo a2enmod [module-name]

    To disable a module that is currently enabled:

        a2dismod [module-name]

### Optional: Install Support for Scripting

The following commands install Apache support for server-side scripting in Perl, Python, and PHP. Support for these languages is optional based on your server environment.

To install:

-   Perl support:

        sudo apt-get install libapache2-mod-perl2

-   Python support:

        sudo apt-get install libapache2-mod-python

-   PHP support:

        sudo apt-get install libapache2-mod-php7.2 php7.2 php-pear

## Check Server Status

You can check your Apache web server status with the command:

    sudo systemctl status apache2

The output will look similar to the following:

{{< output >}}
● apache2.service - The Apache HTTP Server
   Loaded: loaded (/lib/systemd/system/apache2.service; enabled; vendor preset: enabled)
  Drop-In: /lib/systemd/system/apache2.service.d
           └─apache2-systemd.conf
   Active: active (running) since Thu 2020-02-27 14:28:23 EST; 1h 19min ago
 Main PID: 4296 (apache2)
    Tasks: 55 (limit: 1108)
   CGroup: /system.slice/apache2.service
           ├─4296 /usr/sbin/apache2 -k start
           ├─4300 /usr/sbin/apache2 -k start
           └─4301 /usr/sbin/apache2 -k start
{{</ output >}}

- From here you can see that the server is running successfully. However, if something isn't working correctly, you can check the logs for errors. The logs locations are defined for each virtual host you set up in [Configure Virtual Hosting](#configure-virtual-hosting).

- Typically they will be at `/var/www/example.com/logs/error.log` and `/var/www/example.com/logs/access.log` where `example.com` is your domain name.

## Controlling Apache

You can control the server in the following ways.

1.  Stopping the server when it's running:

        sudo systemctl stop apache2

1.  Start the server when it's stopped:

        sudo systemctl start apache2

1.  Stop and start the server when it's running:

        sudo systemctl restart apache2

1.  Reload the configurations while the server is running without stopping it:

        sudo systemctl reload apache2

1.  You can disable Apache so that it stops and doesn't restart again when rebooting the system:

        sudo systemctl disable apache2

1.  To re-enable Apache if it's been disabled. This will also enable it to restart when the system reboots:

        sudo systemctl enable apache2

### Optional: Firewall

Depending on your firewall configuration, you may need to modify your settings to allow access to web ports. A common firewall for Ubuntu is [UFW](/docs/security/firewalls/configure-firewall-with-ufw/).

If you had UFW installed before you installed Apache, Apache will have registered with UFW during installation and provides some simple to use configurations.

1.  To view these options, run the following command:

        sudo ufw app list

    {{< output >}}
Available applications:
Apache
Apache Full
Apache Secure
OpenSSH
{{</ output >}}

1.  To view what these different configurations do, run this command:

        sudo ufw app info 'Apache'

    Replace `Apache` with `Apache Full` or `Apache Secure` to see information about those applications. Below is a table summary.

    | Profile | Title | Ports |
    | ------- | ----- | ----- |
    | Apache | Web Server | 80/tcp |
    | Apache Full | Web Server (HTTP,HTTPS) | 80,443/tcp |
    | Apache Secure | Web Server (HTTPS) | 443/tcp |

1.  To enable a profile use the following command:

        sudo ufw allow 'Apache'

    {{< output >}}
Rules updated
Rules updated (v6)
{{</ output >}}

1.  Verify the rules are updated with the following:

        sudo ufw status

    {{< output >}}
Status: active

To              Action      From
--              -----       ----
Apache          ALLOW       Anywhere
Apache (v6)     ALLOW       Anywhere (v6)
{{</ output>}}