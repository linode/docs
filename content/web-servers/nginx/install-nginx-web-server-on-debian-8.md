---
author:
  name: Linode
  email: docs@linode.com
description: 'How to Install Nginx from Source on Debian 8 (Jessie)'
keywords: ["nginx", "http", "web servers", "debian", "debian jessie", "debian 8"]
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 2015-07-09
modified: 2016-08-18
modified_by:
    name: Phil Zona
title: 'Install Nginx Web Server on Debian 8'
aliases: ['websites/nginx/nginx-web-server-debian-8/','websites/nginx/install-nginx-web-server-on-debian-8/']
external_resources:
 - '[Linode nginx Documentation](/docs/websites/nginx/)'
 - '[Nginx Community Documentation](http://wiki.nginx.org)'
---

Nginx is a lightweight, high-performance web server designed for the purpose of delivering large amounts of static content quickly and with efficient use of system resources. In contrast to the [Apache server](/docs/web-servers/apache/), nginx uses an asynchronous event-driven model which provides more predictable performance under load.

![Install Nginx Web Server on Debian 8](/docs/assets/nginx-on-debian-8.png "Install Nginx Web Server on Debian 8")

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname run:

        hostname
        hostname -f

    The first command should show the short hostname, and the second should show the fully qualified domain name (FQDN).

2.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Install nginx

### From Debian Repositories

The simplest way to install nginx on a server is to download it from Debian's repositories.

1.  Install nginx and start the daemon:

        sudo apt-get install nginx

    Installing nginx from the Debian repositories ensures that nginx has been tested and will optimally run on Debian. However, Debian repositories are often a few versions behind the latest nginx release.

2.  Nginx can be tested by navigating to your FQDN in your browser. The default nginx page should be present.

### From Nginx Package Repository

This method differs from the one above in that it installs from the official nginx repository rather than use the package provided by Debian. Follow these steps if you would like to install the latest stable version of nginx.

1.  Create the `/etc/apt/sources.list.d/nginx.list` file, which instructs the package manager to download packages from the nginx repositories:

        touch /etc/apt/sources.list.d/nginx.list

2.  Add the following lines to the file:

    {{< file "/etc/apt/sources.list.d/nginx.list" >}}
deb http://nginx.org/packages/debian/ jessie nginx
deb-src http://nginx.org/packages/debian/ jessie nginx

{{< /file >}}


3.  Download the PGP key used to sign the packages in the nginx repository and import it into your keyring:

        curl http://nginx.org/keys/nginx_signing.key | apt-key add -

4.  Update your list of available packages:

        apt-get update

5.  Instruct the package manager to install the nginx package:

        apt-get install nginx

### From Source

The Debian project does not track the latest development of the nginx server. Consequently, nginx can be downloaded and installed from a source distribution if you require a newer version.

1.  Install nginx dependencies:

        sudo apt-get install libpcre3-dev build-essential libssl-dev

2.  The source files and binaries will be downloaded to the `/opt/` directory. Navigate to `/opt/`:

        cd /opt/

3.  Download the [latest stable version](http://nginx.org/en/download.html) of nginx, which can be found on its website. At the time of this publication, nginx 1.11.2 is the latest stable version:

        sudo wget http://nginx.org/download/nginx-1.11.2.tar.gz

4.  Extract the file, then navigate to the new directory:

        sudo tar -zxvf nginx-1.*.tar.gz
        cd /nginx-1.*

5.  Configure the build options. You may also wish to install additional modules and specify additional settings in this step, depending on your needs:

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

6.  Build and install nginx with the above configuration:

        sudo make
        sudo make install

    Nginx is now installed in `/opt/nginx`.

7.  As the root user, create a user and group for nginx:

        sudo adduser --system --no-create-home --disabled-login --disabled-password --group nginx

8.  Create a systemd service script to run nginx:

    {{< file "/lib/systemd/system/nginx.service" shell >}}
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

{{< /file >}}


    {{< note >}}
This script assumes that you used the build configuration options specified in Step 5. If your script is not working correctly, be sure that the path in the line beginning with `PIDFile` matches your PID file, and the path in lines beginning with `Exec` match your binary file. These file paths can be found in the output when you configured your build options.
{{< /note >}}

9.  Change the ownership of the script:

        sudo chmod +x /lib/systemd/system/nginx.service

10. Start nginx:

        sudo systemctl start nginx

    Optionally, you can enable it to start automatically on boot:

        sudo systemctl enable nginx

Continue reading our introduction to [Basic nginx Configuration](/docs/websites/nginx/basic-nginx-configuration) for more helpful information about using and setting up a web server.
