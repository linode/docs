---
author:
  name: Linode
  email: docs@linode.com
description: 'A basic guide to installing nginx from source on Debian 7 (Wheezy)'
keywords: ["nginx", "http", "web servers", "debian", "debian wheezy", "debian 7", " install nginx on debian 7", " install nginx"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/installation/debian-7-wheezy/','websites/nginx/basic-nginx-installation/','websites/nginx/websites-with-nginx-on-debian-7-wheezy/','websites/nginx/websites-with-nginx-on-debian-7-wheezy/index.cfm/','websites/nginx/install-nginx-debian-7/','websites/nginx/how-to-install-nginx-on-debian-7-wheezy/index.cfm/','websites/nginx/how-to-install-nginx-on-debian-7-wheezy/']
modified: 2014-01-28
modified_by:
  name: Linode
published: 2014-01-28
title: 'How to Install Nginx on Debian 7 (Wheezy)'
external_links:
 - '[Linode Nginx Documentation](/docs/web-servers/nginx/)'
 - '[Nginx Community Documentation](http://wiki.nginx.org)'
---

Nginx is a lightweight and high performance web server designed with the purpose of delivering large amounts of static content quickly and with efficient use of system resources. In contrast to the [Apache HTTP server](/docs/web-servers/apache/) that uses a threaded or process-oriented approach to handling requests, Nginx uses an asynchronous event-driven model which provides more predictable performance under load.

Although Nginx is a relatively new entry in the web server field, it has achieved a great deal of respect for its agility and efficiency, particularly in high profile situations. Many very high traffic/profile websites have begun to use Nginx for its efficiency. At the same time administrators of smaller systems have found Nginx ideal for their systems for its slim memory footprint.

Before you begin installing the Nginx web server, it is assumed that you have followed our [Getting Started Guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [Beginner's Guide](/docs/beginners-guide/) and [Administration Basics Guide](/docs/using-linux/administration-basics).

## Set the Hostname

Before you begin installing and configuring the components described in this guide, make sure you have followed the instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure the hostname is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

## Installing Nginx from Debian Repositories

All of the following updates, upgrades, and installs use a non-root account. Therefore, `sudo` is required before commands, if you are using `root` to perform these commands than sudo would not be required. For more information regarding account permissions, view our [Linux Users and Groups Guide](/docs/tools-reference/linux-users-and-groups/).

Nginx is included as part of the Debian software repositories. The preferred installation method utilizes the Debian repositories. The commands for installation are as follows:

    sudo apt-get update
    sudo apt-get upgrade
    sudo apt-get install nginx
    sudo service nginx start

Installing Nginx with the Debian package maintainers provides quality control, testing, and security updates that ensure that you are running the best possible version of the software for your operating system. This document is written against the release version 1.2.1-22.

To test if the installation of Nginx was successful, open a web browser and in the address bar enter the IP address of your server. You should see a message similar to the one below:

![Nginx test page.](/docs/assets/1536-nginx-test.png)

## Installing and Compiling a Nginx Source Distribution

The Debian project does not track the latest development of Nginx server. Therefore, if you require a newer version, you will need to download and compile the newest distribution of Nginx (current version as of this publication is 1.5.9).

### Installation Prerequisites

Due to rapid development of the Nginx web server and recent changes to the interface, many users of Nginx compile their version of the software from sources provided by the Nginx developers. Additional benefits include the ability to configure Nginx to support additional third party modules and options which must be set at the time of compile.

Begin by making sure, your system's package database and installed programs are up to date. The commands for updating and upgrading are as follows:

    sudo apt-get update
    sudo apt-get upgrade

You will also need to install several dependent packages before proceeding with Nginx installation. The command for updating dependencies is as follows:

    sudo apt-get install libpcre3-dev build-essential libssl-dev

### Download and Compile Nginx

The source files and binaries will be downloaded in the `/opt/` directory of the file system in this example. Issue the following sequence of commands to enter this directory, download the required files, and extract the source files from the archive:

    cd /opt/
    sudo wget http://nginx.org/download/nginx-1.5.9.tar.gz
    sudo tar -zxvf nginx-1.5.9.tar.gz
    cd /opt/nginx-1.5.9/

Now you may compile the Nginx server. If you want to enable [third-party modules](http://wiki.nginx.org/Nginx3rdPartyModules), append options to `./configure` at this point. Issue the following command to configure the build options:

    sudo ./configure --prefix=/opt/nginx --user=nginx --group=nginx --with-http_ssl_module --with-ipv6

When the configuration process completes successfully, you will see the following output:

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

To build and install Nginx with the above configuration, use the following command sequence:

    sudo make
    sudo make install

You will also need to create a user and group for Nginx, issue the following command:

    sudo adduser --system --no-create-home --disabled-login --disabled-password --group nginx

Nginx is now installed in `/opt/nginx`.

### Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up-to-date versions of all software is crucial for the security and integrity of a system.

Please follow the announcements, lists, and RSS feeds on the following pages to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [Nginx Security Advisories](http://nginx.org/en/security_advisories.html)
-   [Nginx Announcements](http://nginx.org/)

When upstream sources offer new releases, repeat the instructions for installing Nginx and recompile your software as needed. These practices are crucial for the ongoing security and functioning of your system.

### Create an Init Script to Manage Nginx

Before you can use the Nginx server, you must create a means of controlling the daemon process. You can create an "init script" using [this example](/docs/assets/1538-init-deb.sh) to control Nginx. Issue the following commands to download the file, change the execution mode, and set the system to initialize Nginx on boot:

    sudo wget -O init-deb.sh http://www.linode.com/docs/assets/1538-init-deb.sh
    sudo mv init-deb.sh /etc/init.d/nginx
    sudo chmod +x /etc/init.d/nginx
    sudo /usr/sbin/update-rc.d -f nginx defaults

You can now start, stop, and restart Nginx just like any other server daemon. For example, to start the server, issue the following command:

    sudo /etc/init.d/nginx start

You now have a running and fully functional HTTP server powered by the Nginx web server. To test if the installation of Nginx was successful, open a web browser and in the address bar enter the IP address of your server. You should see a default Nginx page.

Continue reading our introduction to [Basic Nginx Configuration](/docs/websites/nginx/basic-nginx-configuration) for more information about using and setting up a web server.
