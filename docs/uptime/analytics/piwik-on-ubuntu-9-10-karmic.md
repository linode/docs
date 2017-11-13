---
deprecated: true
author:
  name: Stan Schwertly
  email: docs@linode.com
description: 'Get in-depth website visitor statistics with Piwik, a self-hosted, open source analytics solution on Ubuntu 9.10 (Karmic).'
keywords: ["open source analytics", "piwik ubuntu 9.10", "piwik", "analytics", "ubuntu", "tracking", "statistics"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/analytics/piwik/ubuntu-9-10-karmic/']
modified: 2011-04-27
modified_by:
  name: Linode
published: 2009-12-23
title: 'Piwik on Ubuntu 9.10 (Karmic)'
---



Piwik is a "downloadable, open source (GPL licensed) web analytics software program." As an alternative to services like Google Analytics, Piwik allows you to host your statistics services on your own server and have full ownership of and control over the data collected from your visitors.

For the purpose of this guide, we assume that you have running and functional server, and have followed the [getting started](/docs/getting-started/) guide. If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

Beyond the basics, Piwik requires a functioning LAMP stack. You can install the LAMP software with the [Ubuntu 9.10 LAMP guide](/docs/lamp-guides/ubuntu-9-10-karmic/). Make sure you follow the steps for installing PHP and PHP-MySQL support. You will also want to be logged in over SSH as root.

# Prerequisites

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Piwik requires a few additional dependencies beyond LAMP fundamentals. Most importantly, Piwik requires the `php5-gd` package to draw the "sparklines." These are the small graphs displayed in the control panel. We'll also need `wget` and `unzip` to access the files in the Piwik package. Install `php5-gd` and `unzip` by running the following command:

    apt-get install php5-gd unzip wget

### Configure PHP Memory Settings

By default, PHP's `memory_limit` value is set to 64 megabytes. For "medium to high traffic" sites, Piwik's creators recommend setting this value to 128 megabytes. If you choose to follow this recommendation edit the `php.ini` file so `memory_limit` setting is as follows:

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

{{< file "/etc/apache2/sites-available/stats.example.com" apache >}}
<VirtualHost 12.34.56.78:80>
    ServerAdmin admin@stats.example.com
    ServerName stats.example.com
    ServerAlias stats.example.com
    DocumentRoot /srv/www/stats.example.com/public_html/
    ErrorLog /srv/www/stats.example.com/logs/error.log
    CustomLog /srv/www/stats.example.com/logs/access.log combined
</VirtualHost>

{{< /file >}}


We'll need to create the `logs/` and `public_html/` directories by issuing the following commands:

    mkdir -p /srv/www/stats.example.com/public_html
    mkdir /srv/www/stats.example.com/logs

Enable the virtual host and reload the web server's configuration with the following two commands:

    a2ensite stats.example.com
    /etc/init.d/apache2 reload

Remember that the configuration of a special virtual host for Piwik is optional. If you use a web server other than Apache, you will need to pursue different steps to configure the virtual host.

# Installing Piwik

First we'll download the latest distribution of the Piwik package. Issue the following two commands:

    cd /srv/www/stats.example.com/
    wget http://piwik.org/latest.zip

Uncompress the archive and move the contents of the archive to the directory where you want to install Piwik. Use these two commands:

    unzip latest.zip
    mv piwik/* public_html

Before running Piwik's installation script, we need to change the permissions of several directories. Piwik requires these permissions to remain set to function properly. Issue the following commands:

    chmod a+w /srv/www/stats.example.com/public_html/tmp
    chmod a+w /srv/www/stats.example.com/public_html/config

Visit your new Piwik instance in your browser. In our example, this is located at `http://stats.example.com/`. Follow the instructions provided by the Piwik installation process. It will prompt you for the name of your MySQL database as well as access credentials for this database. This information was created when you installed the LAMP stack.

When Piwik's installation process is complete, you will receive JavaScript snippet that you can insert in every page on your site that you want to track using Piwik.

If you are concerned about the security of the data collected by Piwik, consider limiting access to Piwik's virtual host, using either [rule-based](/docs/web-servers/apache/configuration/rule-based-access-control) or [authentication based access control](/docs/web-servers/apache/configuration/http-authentication).

Congratulations! You now have a fully functional statistics and web traffic analytics package running on your own server.



