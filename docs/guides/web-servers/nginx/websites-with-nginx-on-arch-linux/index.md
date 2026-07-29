---
slug: websites-with-nginx-on-arch-linux
title: Websites with NGINX on Arch Linux
description: 'Nginx is a lightweight and high performance web server designed to deliver large amounts of content with efficiency. This guide shows how to install it on Arch Linux.'
authors: ["Linode"]
contributors: ["Linode"]
published: 2011-02-02
modified: 2014-03-27
keywords: ["nginx arch linux", "nginx arch", "nginx", "http server", "web server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: []
relations:
    platform:
        key: websites-with-nginx
        keywords:
            - distribution: Arch Linux
tags: ["web server","nginx"]
deprecated: true
---

Nginx is a lightweight and high performance web server, designed with the purpose of delivering large amounts of static content quickly and with efficient use of system resources. In contrast to the [Apache HTTP server](/cloud/guides/web-servers/apache/), which uses a threaded or process-oriented approach to handling requests, NGINX uses an asynchronous event-driven model to provide more predictable performance under load.

Before you begin installing the NGINX web server, it is assumed that you have followed our [Setting Up and Securing a Compute Instance](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance). If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/cloud/guides/introduction-to-linux-concepts/), our [beginner's guide](https://techdocs.akamai.com/cloud-computing/docs/faqs-for-compute-instances), and our [administration basics guide](/cloud/guides/linux-system-administration-basics/).

## Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance#configure-a-custom-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

## Installing NGINX

Nginx is included in the Arch Linux software repositories. Issue following sequence of commands ensure that your system's package manager and databases are up to date:

    pacman -Sy
    pacman -S pacman

Install the NGINX web server by issuing the following command:

    pacman -S nginx

Edit the `/etc/rc.conf` file, adding "nginx" to the "DEAMONS=" line as shown in the following excerpt:

{{< file >}}
/etc/rc.conf
{{< /file >}}

> DAEMONS=(syslog-ng network netfs crond sshd ntpd nginx)

To start the server for the first time, use the following command:

    /etc/rc.d/nginx start

Congratulations! You now have a running and fully functional HTTP server powered by NGINX. Continue reading our introduction to [basic NGINX configuration](/cloud/guides/how-to-configure-nginx/) for more information about using and setting up the web server.

## More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Linode Docs NGINX Documentation](/cloud/guides/web-servers/nginx/)
- [NGINX Community Documentation](http://wiki.nginx.org)
- [Configure Perl and FastCGI with NGINX](/cloud/guides/nginx-and-perlfastcgi-on-arch-linux/)
- [Configure PHP and FastCGI with NGINX](/cloud/guides/nginx-and-phpfastcgi-on-arch-linux/)
