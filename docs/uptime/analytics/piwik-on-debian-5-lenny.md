---
deprecated: true
author:
  name: Stan Schwertly
  email: docs@linode.com
description: 'Get in-depth web analytics with Piwik, a self-hosted, open source solution on Debian Lenny.'
keywords: ["open source analytics", "piwik debian", "piwik", "analytics", "debian. tracking", "statistics"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/analytics/piwik/debian-5-lenny/']
modified: 2014-01-28
modified_by:
  name: Linode
published: 2009-12-10
title: 'Piwik on Debian 5 (Lenny)'
---

Piwik is a "downloadable, open source (GPL licensed) web analytics software program." As an alternative to services like Google Analytics, Piwik allows you to host your statistics services on your own server and have full ownership of control of the data collected from your visitors.

For the purpose of this guide, we assume that you have running and functional server, and have followed the [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

Beyond the basics, Piwik requires a functioning LAMP stack, which is outlined in our [Debian 5 (Lenny) LAMP guide](/docs/lamp-guides/debian-5-lenny/). Make sure you follow the steps for installing PHP and PHP-MySQL support. You will also want to be logged in over SSH as root.

# Prerequisites

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Piwik requires a few additional dependencies beyond LAMP fundamentals. Most importantly, Piwik requires the `php5-gd` package to draw the "sparklines." These are the small graphs displayed in the control panel. We'll also need `wget` and `unzip` to access the files in the Piwik package. Install `php5-gd` and `unzip` by running the following command:

    apt-get install php5-gd unzip wget

### Configure PHP Memory Settings

If you followed our recommended settings in the LAMP guide for Debian, you would have set PHP's `memory_limit` value to 64 megabytes. For "medium to high traffic" sites, Piwik's creators recommend setting this value to 128 megabytes. Edit the `php.ini` file so `memory_limit` setting is reflects this value:

{{< file-excerpt "/etc/php5/apache2/php.ini" ini >}}
memory_limit = 128M

{{< /file-excerpt >}}


### Restart the Web Server

You'll need to restart Apache after installing php5-gd and modifying the PHP settings. You can do this by issuing the following command:

    /etc/init.d/apache2 restart

# Configure a Dedicated Virtual Host for Piwik

This phase of the installation process is optional, but recommended. Here we configure a subdomain and virtual host configuration in Apache specifically for Piwik. This makes it easy to separate the statistics package from the website or websites that Piwik monitors.

To create a virtual host we need to add an "[A Record](/docs/networking/dns/dns-records-an-introduction/#a-and-aaaa)," for the subdomain that Piwik will use; in our example this is `stats.example.com`. If your DNS is hosted with Linode's DNS servers, you can configure the A record in the [DNS manager](/docs/dns-guides/configuring-dns-with-the-linode-manager). Additionally, we'll need to create a new virtual hosting file for this sub domain.

We'll create the following host file, located at `/etc/apache2/sites-available/stats.example.com`:

{{< file "/etc/apache2/sites-available/stats.example.org" apache >}}
<VirtualHost *:80>
    ServerAdmin admin@stats.example.org
    ServerName stats.example.org
    ServerAlias stats.example.org
    DocumentRoot /srv/www/stats.example.org/public_html/
    ErrorLog /srv/www/stats.example.org/logs/error.log
    CustomLog /srv/www/stats.example.org/logs/access.log combined
</VirtualHost>

{{< /file >}}


We'll need to create the `logs/` and `public_html/` directories by issuing the following commands:

    mkdir -p /srv/www/stats.example.org/public_html
    mkdir /srv/www/stats.example.org/logs

Enable the virtual host and reload the web server's configuration with the following two commands:

    a2ensite stats.example.org
    /etc/init.d/apache2 reload

Remember that the configuration of a special virtual host for Piwik is optional. If you use a web server other than Apache, you will need to pursue different steps to configure the virtual host.

# Installing Piwik

First we'll download the latest distribution of the Piwik package. Issue the following two commands:

    cd /srv/www/stats.example.org/
    wget http://builds.piwik.org/latest.zip

Uncompress the archive and move the contents of the archive to the directory where you want to install Piwik. Use these two commands:

    unzip latest.zip
    mv piwik/* public_html
    rmdir piwik
    chown -R www-data:www-data public_html

Before running Piwik's installation script, we need to change the permissions of several directories. Piwik requires these permissions to remain set to function properly. Issue the following commands:

    chmod a+w /srv/www/stats.example.org/public_html/tmp
    chmod a+w /srv/www/stats.example.org/public_html/config

Visit your new Piwik instance in your browser. In our example, this is located at `http://stats.example.org/`. Follow the instructions provided by the Piwik installation process. It will prompt you for the name of your MySQL database as well as access credentials for this database. This information was created when you installed the LAMP stack. Alternatively, feel free to create a new database and user specifically for Piwik.

When Piwik's installation process is complete, you will receive JavaScript snippet that you can insert in every page on your site that you want to track using Piwik. If you are concerned about the security of the data collected by Piwik, consider limiting access to Piwik's virtual host, using either [rule-based](/docs/web-servers/apache/configuration/rule-based-access-control) or [authentication based access control](/docs/web-servers/apache/configuration/http-authentication).

Congratulations! You now have a fully functional statistics and web traffic analytics package running on your own server.

# Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the Piwik security announcement posts, and development mailing lists to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [Piwik Security Announcements](http://piwik.org/blog/category/security/)
-   [Piwik Mailing Lists](http://lists.piwik.org/mailman/listinfo)

When upstream sources offer new releases, repeat the instructions for installing the Piwik software as needed. These practices are crucial for the ongoing security and functioning of your system.



