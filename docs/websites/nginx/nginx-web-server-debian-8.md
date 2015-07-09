---
author:
    name: Linode
    email: docs@linode.com
description: 'A basic guide to installing nginx from source on Debian 7 (Wheezy)'
keywords: 'nginx,http,web servers,debian,debian jessie,debian 8'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Thursday, July 9th, 2015
modified_by:
    name: Elle Krout
published: 'Thursday, July 9th, 2015'
title: 'Nginx Web Server on Debian 8'
external_resources:
 - '[Linode Library Nginx Documentation](/docs/web-servers/nginx/)'
 - '[Nginx Community Documentation](http://wiki.nginx.org)'
---

Nginx is a lightweight, high performance web server designed with the purpose of delivering large amounts of static content quickly and with efficient use of system resources. In contrast to the [Apache server](/docs/web-servers/apache/), Nginx uses an asynchronous event-driven model which provides more predictable performance under load.

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname run:

        hostname
        hostname -f

    The first command should show the short hostname, and the second should show the fully qualified domain name (FQDN).

2.  Update your system:

        sudo apt-get update && sudo apt-get upgrade


## Installing Nginx


### Install Nginx from Repositories

The simplest way to install Nginx on a server is by downloading it from Debian's repositories:

1.  Install Nginx and start the daemon:

        sudo apt-get install nginx

    Installing Nginx from the Debian repositories ensures that Nginx has been tested and successfully runs at its best on Debian. However, the Debian repositories are often a few versions behind the latest Nginx release.

2.  Nginx can be tested by navigating to your FQDN in your browser. The default Nginx page should be present.

### Install Nginx from a Source Distribution

The Debian project does not track the latest development of Nginx server. If you require a newer version, Nginx can be downloaded and installed from a source distribution.

1.  Install Nginx's dependencies:

        sudo apt-get install libpcre3-dev build-essential libssl-dev

2.  The source files and binaries will be downloaded in the `/opt/` directory. Navigate to `/opt/`:

        cd /opt/

3.  Download the [latest version](http://nginx.org/) of Nginx, which can be found on their website. At the time of publication, Nginx 1.9.2 is the mainline version:

        sudo wget http://nginx.org/download/nginx-1.9.2.tar.gz

4.  Expand the file, then navigate to the new directory:

        sudo tar -zxvf nginx*.tar.gz
        cd /opt/nginx-*

5.  Configure the build options:

        sudo ./configure --prefix=/opt/nginx --user=nginx --group=nginx --with-http_ssl_module --with-ipv6

    When this finishes running, it will output configuration information:

        nginx path prefix: "/opt/nginx"
        nginx binary file: "/opt/nginx/sbin/nginx"
        nginx configuration prefix: "/opt/nginx/conf"
        nginx configuration file: "/opt/nginx/conf/nginx.conf"
        nginx pid file: "/opt/nginx/logs/nginx.pid"
        nginx error log file: "/opt/nginx/logs/error.log"
        nginx http access log file: "/opt/nginx/logs/access.log"
        nginx http client request body temporary files: "client_body_temp"
        nginx http proxy temporary files: "proxy_temp"
        nginx http fastcgi temporary files: "fastcgi_temp"
        nginx http uwsgi temporary files: "uwsgi_temp"
        nginx http scgi temporary files: "scgi_temp"

6.  Build and install Nginx with the above configuration:

        sudo make
        sudo make install

7.  As the root user create a user and group for Nginx:

        sudo adduser --system --no-create-home --disabled-login --disabled-password --group nginx

    Nginx is now installed in `/opt/nginx`.

8.  Create a script to run Nginx:

    {: .file}
    /lib/systemd/system/nginx.service
    :   ~~~ shell
        [Unit]
        Description=A high performance web server and a reverse proxy server
        After=network.target

        [Service]
        Type=forking
        PIDFile=/opt/nginx/logs/nginx.pid
        ExecStartPre=/opt/nginx/sbin/nginx -t -q -g 'daemon on; master_process on;'
        ExecStart=/opt/nginx/sbin/nginx -g 'daemon on; master_process on;'
        ExecReload=/opt/nginx/sbin/nginx -g 'daemon on; master_process on;' -s reload
        ExecStop=-/sbin/start-stop-daemon --quiet --stop --retry QUIT/5 --pidfile /opt/nginx/logs/nginx.pid
        TimeoutStopSec=5
        KillMode=mixed

        [Install]
        WantedBy=multi-user.target
        ~~~

9.  Change the ownership of the script:

        sudo chmod +x /lib/systemd/system/nginx.service

10.  Start Nginx:

         sudo systemctl start nginx


Continue reading our introduction to [Basic Nginx Configuration](/docs/websites/nginx/basic-nginx-configuration) for more information about using and setting up a web server.