---
author:
    name: Linode
    email: docs@linode.com
description: 'Learn how to install & configure Apache web server on Centos 7 on a Linode.'
keywords: 'CentOS,CentOS 7,apache'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 'Thursday, October 20, 2016'
modified_by:
    name: Edward Angert
published: 'Thursday, October 20, 2016'
title: How to install Apache on CentOS 7
external_resources:
 - '[CentOS Linux Home Page](http://www.centos.org/)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.4/)'
---

This guide explains how to install and configure the Apache web server on CentOS 7.

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
>
>Replace each instance of `example.com` in this guide with your site's domain name.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname run:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your Fully Qualified Domain Name (FQDN).

2.  Update your system:

        sudo yum update

## Apache

### Install and Configure Apache

1.  Install Apache 2.4:

        sudo yum install httpd

2.  Modify `httpd.conf` with your document root directory to point Apache to your site's files. Add the `<IfModule prefork.c>` section below to adjust the resource use settings. The settings shown below are a good starting point for a **Linode 2GB**:

    {: .note}
    >
    > Before changing any configuration files, we recommend that you make a backup of the file. To make a backup:
    >
    >     cp /etc/httpd/conf/httpd.conf ~/httpd.conf.backup

    {: .file-excerpt }
    /etc/httpd/conf/httpd.conf
    :   ~~~ conf

        DocumentRoot "/var/www/html/example.com/public_html"
        
        ...
        
        <IfModule prefork.c>
            StartServers        5
            MinSpareServers     20
            MaxSpareServers     40
            MaxRequestWorkers   256
            MaxConnectionsPerChild 5500
        </IfModule>
        ~~~

    These settings can also be added to a separate file. The file must be located in the `conf.module.d` or `conf` directories, and must end in `.conf`, since this is the format of files included in the resulting configuration.

### Configure Name-based Virtual Hosts

You can choose many ways to set up a virtual host. In this section we recommend and explain one of the easier methods.

1.  Within the `conf.d` directory create `vhost.conf` to store your virtual host configurations. The example below is a template for website `example.com`; change the necessary values for your domain:

    {: .file-excerpt }
    /etc/httpd/conf.d/vhost.conf
    :   ~~~ conf
        NameVirtualHost *:80
        
        <VirtualHost *:80>
            ServerAdmin webmaster@example.com
            ServerName example.com
            ServerAlias www.example.com
            DocumentRoot /var/www/html/example.com/public_html/
            ErrorLog /var/www/html/example.com/logs/error.log
            CustomLog /var/www/html/example.com/logs/access.log combined
        </VirtualHost>
        ~~~

    Additional domains can be added to the `vhost.conf` file as needed. To add domains, copy the `VirtualHost` block above and modify its values for each additional virtual host.

    {: .note}
    >
    >`ErrorLog` and `CustomLog` entries are suggested for more specific logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.

2.  Create the directories referenced above:

        sudo mkdir -p /var/www/html/example.com/{public_html,logs}

3.  Enable Apache to start at boot, and restart the service for the above changes to take place:

        sudo systemctl enable httpd.service
        sudo systemctl restart httpd.service

    You can now visit your domain to test the Apache server. A default Apache page will be visible if no index page is found in your Document Root as declared in `/etc/httpd/conf/httpd.conf`:

    ![Apache on CentOS 7 Welcome Screen](/docs/assets/centos7-apache-welcome.png "Welcome to Apache on CentOS 7")

## Next Steps: Add SSL for Security and Install GlusterFS for High Availability

Congratulations! You've set up Apache and you're now ready to host websites. If you're wondering what additional configuration changes are available to get the most out of your server, some optional steps can be found below.

### Secure Your Site with SSL

To add additional security to your site, consider [enabling a Secure Sockets Layer (SSL) certificate](/docs/security/ssl/ssl-apache2-centos).

### Install and Configure GlusterFS, Galera, and XtraDB for High Availability

Consult our [Host a Website with High Availability](/docs/websites/host-a-website-with-high-availability) guide to mitigate downtime through redundancy, monitoring, and failover.
