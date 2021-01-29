---
slug: install-and-configure-apache-on-centos-7
author:
    name: Linode
    email: docs@linode.com
description: 'Learn how to install & configure Apache web server on Centos 7 on a Linode.'
keywords: ["CentOS", "CentOS 7", "apache", "yum install httpd"]
tags: ["centos","web server","apache"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/web-servers/apache/install-and-configure-apache-on-centos-7/','/websites/apache/install-and-configure-apache-on-centos-7/']
modified: 2021-01-29
modified_by:
    name: Geoffrey Sperl
published: 2016-11-18
title: How to Install Apache on CentOS 7
external_resources:
 - '[CentOS Linux Home Page](http://www.centos.org/)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.4/)'
relations:
    platform:
        key: install-apache-server
        keywords:
            - distribution: CentOS 7
---

![How to Install and Configure Apache Web Server on CentOS 7](How_to_Install_Apache_on_CentOS_7_smg.jpg)

This guide explains how to install and configure the Apache web server on CentOS 7. Apache is an [open-source web server](https://httpd.apache.org/ABOUT_APACHE.html) that can be configured to serve a single or multiple websites using the same Linode.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

Replace each instance of `example.com` in this guide with your site's domain name.
{{< /note >}}


## Before you begin

1.  Ensure you have followed both the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides.

2.  Check that the Linode's [hostname is set](/docs/getting-started#setting-the-hostname). To check your hostname run:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your Fully Qualified Domain Name (FQDN).

3.  Use `yum` to update your system and make sure everything is current:

        sudo yum update
        

## Configure firewalld to allow web traffic

By default, CentOS 7 is set to block web traffic. Run the following commands to allow web traffic through the firewall:

    sudo firewall-cmd --add-service=http --permanent && sudo firewall-cmd --add-service=https --permanent
    sudo systemctl restart firewalld


## Install and configure Apache

### Installing Apache

1.  Install Apache 2.4 using `yum`:

        sudo yum install httpd

2.  Once you confirm the installation, let `yum` install Apache and its dependencies.


### Configuring httpd.conf

1.  Before changing any configuration files, we recommend that you make a backup. To make a backup of the `httpd.conf` file, use:

    `cp /etc/httpd/conf/httpd.conf ~/httpd.conf.backup`

2.  Modify `httpd.conf` with your document root directory in order to point Apache to your site's files. Add the `<IfModule prefork.c>` section below to adjust the resource use settings (these are a good starting point for a **Linode 2GB**)

{{< file "/etc/httpd/conf/httpd.conf" aconf >}}
DocumentRoot "/var/www/html/example.com/public_html"

...

<IfModule prefork.c>
    StartServers        5
    MinSpareServers     20
    MaxSpareServers     40
    MaxRequestWorkers   256
    MaxConnectionsPerChild 5500
</IfModule>
{{< /file >}}

{{< note >}}
These settings may also be added to a separate file. The file must be located in either the `conf.module.d` or `conf` directories and must end in `.conf` (as this is the format of files included in the resulting configuration).
{{< /note >}}

### Configuring a name-based virtual host

#### A single domain

There are multiple ways to set up a virtual host, but in this section we explain (and recommend) one of the easier methods.

1.  Within the `conf.d` directory, create the file `vhost.conf` to store your virtual host configurations.

2.  Edit `vhost.conf` using the example below. Remember to substitute your domain name for `example.com`.

{{< file "/etc/httpd/conf.d/vhost.conf" aconf >}}
NameVirtualHost *:80

<VirtualHost *:80>
    ServerAdmin webmaster@example.com
    ServerName example.com
    ServerAlias www.example.com
    DocumentRoot /var/www/html/example.com/public_html/
    ErrorLog /var/www/html/example.com/logs/error.log
    CustomLog /var/www/html/example.com/logs/access.log combined
</VirtualHost>

{{< /file >}}

3.  Create the directories referenced above:

        sudo mkdir -p /var/www/html/example.com/{public_html,logs}
        
{{< note >}}
The `ErrorLog` and `CustomLog` entries are suggested for more specific logging, but are not required. If they are defined (as shown in the example above), the `logs` directories must be created before you restart Apache.
{{< /note >}}

4.  Enable Apache to start at boot, and restart the service for the above changes to take effect:

        sudo systemctl enable httpd.service
        sudo systemctl restart httpd.service

5.  Visit your domain to test the Apache server. A default Apache page will be visible if no index page is found in the document root declared in `httpd.conf`:

    ![Apache on CentOS 7 Welcome Screen](centos7-apache-welcome.png "Welcome to Apache on CentOS 7")


#### Mulitple domains

Additional domains may be used with the `vhost.conf` file as necessary. When new requests come in from the internet, Apache checks which VirtualHost block matches the requested URL and serves the appropriate content:

![Apache VirtualHost Traffic Flow](apache-vhost-flow.png "Apache VirtualHost Traffic Flow")

To add additional domains, copy the example above and add it to the end of the existing file, modify its values for the new domain, create the directories, restart Apache, and test the newly added domain. Repeat as necessary.


Congratulations! You've set up Apache and you're now ready to host websites. If you're wondering what additional configuration changes are available to get the most out of your server, some optional steps can be found below.


## Next Steps: Additional security and high availability

### Secure your server with SELinux

SELinux is a *mandatory access control* (MAC) system that confines privileged processes and automates security policy creation. To enable it on your Linode, see our [Beginner's Guide  to SELinux on CentOS 7](/docs/guides/a-beginners-guide-to-selinux-on-centos-7/).

### Secure your site with SSL

To add additional security to your site, consider [enabling a *secure sockets layer* (SSL) certificate](/docs/security/ssl/ssl-apache2-centos).

### Install and Configure GlusterFS, Galera, and XtraDB for High Availability

Consult our [Host a Website with High Availability](/docs/websites/host-a-website-with-high-availability) guide to mitigate downtime through redundancy, monitoring, and failover.
