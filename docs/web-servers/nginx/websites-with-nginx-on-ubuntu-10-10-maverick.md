---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'A basic guide to installing nginx from source on Ubuntu 10.10 (Maverick)'
keywords: ["nginx", "nginx ubuntu 10.10", "http", "web servers", "ubuntu", "ubuntu maverick"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/installation/ubuntu-10-10-maverick/','websites/nginx/websites-with-nginx-on-ubuntu-10-10-maverick/']
modified: 2012-10-08
modified_by:
  name: Linode
published: 2011-02-15
title: 'Websites with nginx on Ubuntu 10.10 (Maverick)'
---



Nginx is a lightweight and high performance web server designed with the purpose of delivering large amounts of static content quickly and with efficient use of system resources. In contrast to the [Apache HTTP server](/docs/web-servers/apache/) that uses a threaded or process-oriented approach to handling requests, nginx uses an asynchronous event-driven model which provides more predictable performance under load.

Before we begin installing the nginx web server, we assume that you have followed our [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Installing nginx from Ubuntu Packages

Nginx is included in the Ubuntu software repositories. While this method is sufficient for many cases, nginx development proceeds rapidly and this method may result in a running nginx instance that is older than your application requires. If you want to install in this manner, the following sequence of commands ensure that your system's package databases and installed programs are up to date:

    apt-get update
    apt-get upgrade

Install the nginx web server by issuing the following command:

    apt-get install nginx

To start the server for the first time use the following command:

    /etc/init.d/nginx start

Using the Ubuntu packages for nginx allows you to rely on your distribution's quality control, testing, and security teams to ensure that you're running the best possible version of the server. However, the packages provided by the Ubuntu project do not track the latest development of the nginx server. Given the rapid development of nginx, and variances between recent versions this is not ideal for many users. Continue to the next section to install nginx directly from source.

# Installing nginx from the Source Distribution

### Install Prerequisites

Because of the rapid development of the nginx web server and recent changes to the interface, many users of nginx compile their version of the software from sources provided by the nginx developers. Additional benefits include the ability to configure nginx to support additional third party modules and options which much be set at compile time.

Begin by ensuring that your system's package database and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade

You will also need to install several dependent packages before proceeding with nginx installation. Issue the following command:

    apt-get install libpcre3-dev build-essential libssl-dev

### Download and Compile nginx

The source files and binaries will be downloaded in the `/opt/` directory of the file system in this example. Check the [nginx download page](http://nginx.org/en/download.html#stable_versions) for the URL of the latest stable release, and then issue the following commands to obtain it (substituting a newer link if necessary):

    cd /opt/
    wget http://nginx.org/download/nginx-1.0.0.tar.gz
    tar -zxvf nginx-1.0.0.tar.gz
    cd /opt/nginx-1.0.0/

Now we can compile the nginx server. If you want to enable [third-party modules](http://wiki.nginx.org/Nginx3rdPartyModules), append options to `./configure` at this juncture. Issue the following command to configure the build options:

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
      nginx http uwsgi temporary files: "uwsgi_temp"
      nginx http scgi temporary files: "scgi_temp"

To build and install nginx with the above configuration, use the following command sequence:

    make
    make install

You will also need to create a user and group for nginx. Issue the following command to do so:

    adduser --system --no-create-home --disabled-login --disabled-password --group nginx

Nginx is now installed in `/opt/nginx`.

### Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please follow the announcements, lists, and RSS feeds on the following pages to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [nginx Security Advisories](http://nginx.org/en/security_advisories.html)
-   [nginx Announcements](http://nginx.org/)

When upstream sources offer new releases, repeat the instructions for installing nginx, spawn-fcgi, and uWSGI, and recompile your software when needed. These practices are crucial for the ongoing security and functioning of your system.

### Create an Init Script to Manage nginx

Before we can begin to use the nginx server, we must create a means of controlling the daemon process. You can use our [nginx init script](/docs/assets/661-init-deb.sh) to start, stop, or restart nginx. Issue the following commands to download the file, change the execution mode, and set the system to initialize nginx on boot:

    wget -O init-deb.sh http://www.linode.com/docs/assets/661-init-deb.sh
    mv init-deb.sh /etc/init.d/nginx
    chmod +x /etc/init.d/nginx
    /usr/sbin/update-rc.d -f nginx defaults

You can now start, stop, and restart nginx just like any other server daemon. For example, to start the server, issue the following command:

    /etc/init.d/nginx start

Congratulations! You now have a running and fully functional HTTP server powered by nginx. Continue reading our introduction to [basic nginx configuration](/docs/websites/nginx/basic-nginx-configuration) for more information about using and setting up the web server.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Linode Docs nginx Documentation](/docs/web-servers/nginx/)
- [nginx Community Documentation](http://wiki.nginx.org)
- [Configure Perl and FastCGI with nginx](/docs/web-servers/nginx/perl-fastcgi/ubuntu-10-10-maverick)
- [Configure PHP and FastCGI with nginx](/docs/web-servers/nginx/php-fastcgi/ubuntu-10-10-maverick)
