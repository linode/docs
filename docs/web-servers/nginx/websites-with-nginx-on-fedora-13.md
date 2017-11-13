---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: A basic guide to installing nginx from source on Fedora 13
keywords: ["nginx fedora 13", "nginx fedora", "nginx", "http", "web servers", "fedora 13"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/installation/fedora-13/','websites/nginx/websites-with-nginx-on-fedora-13/']
modified: 2011-04-29
modified_by:
  name: Linode
published: 2010-05-25
title: Websites with nginx on Fedora 13
---



Nginx is a lightweight and high performance HTTP web server designed with the purpose of delivering large amounts of static content quickly and with efficient use of system resources. In contrast to the [Apache HTTP server](/docs/web-servers/apache/) that uses a threaded or process-oriented approach to handling requests, nginx uses an asynchronous event-driven model which provides more predictable performance under load.

Although nginx is a relatively new entrant in the web server field, it has achieved a great deal of respect for its agility and efficiency, particularly in high profile situations. Many very high traffic and profile websites have begun to use nginx for its efficiency. At the same time, administrators of smaller systems have found nginx ideal for their systems for its slim memory footprint.

Before we begin installing the nginx web server, we assume that you have followed our [getting started](/docs/getting-started/) guide. If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

# Installing nginx from EPEL Packages

Nginx is included in the Fedora software repositories. While using this method to install nginx will leave you with a working web server, *it is not the preferred method for installing nginx.* Nevertheless, if you want to install in this manner, use the process that follows.

The following sequence of commands first ensures that your system's package databases and installed programs are up to date and then installs the nginx web server:

    yum update
    yum install nginx

Once finished, start nginx the following command:

    /etc/init.d/nginx start

You can now continue with the [configuration](/docs/websites/nginx/basic-nginx-configuration) of nginx. Installing nginx in this manner will allow you to rely on the Fedora package maintainers to provide quality control, testing, and security updates to ensure that you're running the best possible version of the software. However, the packages provided by the Fedora project may not track the latest development of the nginx server and do not allow you to enable certain nginx options at compile time. Given the rapid development of nginx and variances between recent versions, installing from distribution packages is not ideal for many users. Continue to the next section to install nginx directly from source.

# Installing nginx from the Source Distribution

### Install Prerequisites

Because of the rapid development of the nginx web server and recent changes to the interface, many users of nginx compile their version of the software from sources provided by the nginx developers. Additional benefits include the ability to configure nginx to support additional third party modules and options which much be set at compile time. This document is written against the most recent release in the stable series of the server (version 1.0.0).

Begin by ensuring that your system's package database and installed programs are up to date by issuing the following command:

    yum update

You will also need to install several dependent package before proceeding with nginx installation. Issue the following command:

    yum install zlib-devel wget openssl-devel pcre pcre-devel sudo gcc make autoconf automake

At this point you can continue with the compilation and installation of nginx.

### Download and Compile nginx

The source files and binaries will be downloaded in the `/opt/` directory of the file system in this example. Issue the following sequence of commands to enter this directory, download the required files, and extract the source files from the archive. Be sure to check the [nginx download page](http://nginx.org/en/download.html#stable_versions) for the current version, changing the `wget` command below if necessary.

    cd /opt/
    wget http://nginx.org/download/nginx-1.0.0.tar.gz
    tar -zxvf nginx-1.0.0.tar.gz
    cd /opt/nginx-1.0.0

Now we can compile the nginx server. If you want to enable [third-party nginx modules](http://wiki.nginx.org/Nginx3rdPartyModules), append options to `./configure` at this juncture. Issue the following command to configure the build options:

    ./configure --prefix=/opt/nginx --user=nginx --group=nginx --with-http_ssl_module

When the configuration process completes successfully, you will see the following output:

    Configuration summary
      + using system PCRE library
      + using system OpenSSL library
      + md5: using OpenSSL library
      + sha1 library is not used
      + using system zlib library

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

To build and install nginx with the above configuration, use the following command sequence:

    make
    make install

You will also need to create a user and group for nginx, issue the following command:

    useradd -M -r --shell /bin/bash --home-dir /opt/nginx nginx

Nginx is now installed in `/opt/nginx`.

### Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please follow the announcements, lists, and RSS feeds on the following pages to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [nginx Security Advisories](http://nginx.org/en/security_advisories.html)
-   [nginx Announcements](http://nginx.org/)

When upstream sources offer new releases, repeat the instructions for installing nginx, spawn-fcgi, and uWSGI, and recompile your software when needed. These practices are crucial for the ongoing security and functioning of your system.

### Create an Init Script to manage nginx

Before we can begin to use the nginx server, we must create a means of controlling the daemon process. You can create an "init script" using [this example](/docs/assets/635-init-rpm.sh) to control nginx. Issue the following commands to download the file, change the execution mode, and set the system to initialize nginx on boot:

    wget -O init-rpm.sh http://www.linode.com/docs/assets/635-init-rpm.sh
    mv init-rpm.sh /etc/rc.d/init.d/nginx
    chmod +x /etc/rc.d/init.d/nginx
    chkconfig --add nginx
    chkconfig --level 2345 nginx on

You can now start, stop, and restart nginx just like any other server daemon. For example, to start the server, issue the following command:

    /etc/init.d/nginx start

Congratulations! You now have a running and fully functional HTTP server powered by the nginx web server. Continue reading our introduction to [basic nginx configuration](/docs/websites/nginx/basic-nginx-configuration) for more information about using and setting up the web server.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Linode Docs nginx Documentation](/docs/web-servers/nginx/)
- [nginx Community Documentation](http://wiki.nginx.org)
