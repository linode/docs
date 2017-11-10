---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'A basic guide to installing nginx on Arch Linux.'
keywords: ["nginx arch linux", "nginx arch", "nginx", "http server", "web server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/installation/arch-linux/','websites/nginx/websites-with-nginx-on-arch-linux/']
modified: 2014-03-27
modified_by:
  name: Alex Fornuto
published: 2011-02-02
title: Websites with Nginx on Arch Linux
---

Nginx is a lightweight and high performance web server, designed with the purpose of delivering large amounts of static content quickly and with efficient use of system resources. In contrast to the [Apache HTTP server](/docs/web-servers/apache/), which uses a threaded or process-oriented approach to handling requests, nginx uses an asynchronous event-driven model to provide more predictable performance under load.

Before you begin installing the nginx web server, it is assumed that you have followed our [getting started guide](/docs/getting-started/). If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts), our [beginner's guide](/docs/beginners-guide/), and our [administration basics guide](/content/using-linux/administration-basics).

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Installing nginx

Nginx is included in the Arch Linux software repositories. Issue following sequence of commands ensure that your system's package manager and databases are up to date:

    pacman -Sy
    pacman -S pacman

Install the nginx web server by issuing the following command:

    pacman -S nginx

Edit the `/etc/rc.conf` file, adding "nginx" to the "DEAMONS=" line as shown in the following excerpt:

{{< file-excerpt >}}
/etc/rc.conf
{{< /file-excerpt >}}

> DAEMONS=(syslog-ng network netfs crond sshd ntpd nginx)

To start the server for the first time, use the following command:

    /etc/rc.d/nginx start

Congratulations! You now have a running and fully functional HTTP server powered by nginx. Continue reading our introduction to [basic nginx configuration](/docs/websites/nginx/basic-nginx-configuration) for more information about using and setting up the web server.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Linode Docs nginx Documentation](/docs/web-servers/nginx/)
- [nginx Community Documentation](http://wiki.nginx.org)
- [Configure Perl and FastCGI with nginx](/docs/web-servers/nginx/perl-fastcgi/arch-linux)
- [Configure PHP and FastCGI with nginx](/docs/web-servers/nginx/php-fastcgi/arch-linux)
