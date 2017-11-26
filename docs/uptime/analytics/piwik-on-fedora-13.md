---
deprecated: true
author:
  name: Stan Schwertly
  email: docs@linode.com
description: 'Get in-depth website visitor statistics with Piwik, a self-hosted, open source analytics solution on Fedora 13.'
keywords: ["open source analytics", "piwik fedora 13", "piwik", "analytics", "centos", "tracking", "statistics"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/analytics/piwik/fedora-13/']
modified: 2013-10-01
modified_by:
  name: Linode
published: 2010-12-28
title: Piwik on Fedora 13
---



Piwik is a downloadable, open source (GPL licensed) web analytics software program. As an alternative to services like Google Analytics, Piwik allows you to host your statistics services on your own server and have full ownership and control of the data collected from your visitors.

For the purpose of this guide, we assume that you have a running and functional server, and have followed the [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

Beyond the basics, Piwik requires a functioning LAMP stack. You can install the LAMP software with the [Fedora 13 LAMP guide](/docs/lamp-guides/fedora-13/). Make sure you follow the steps for installing PHP and PHP-MySQL support. You will also want to be logged in over SSH as root.

# Prerequisites

Make sure your system is up to date by issuing the following command:

    yum update

Piwik requires a few additional dependencies beyond LAMP fundamentals. Most importantly, Piwik requires the `php-gd` package to draw the "sparklines". These are the small graphs displayed in the control panel. We'll also need `wget` and `unzip` to access the files in the Piwik package. Install `php-gd` and `unzip` by running the following command:

    yum install php-xml php-gd unzip wget php-mbstring

### Configure PHP Memory Settings

By default, PHP's `memory_limit` value is set to 16 megabytes. For medium to high traffic sites, Piwik's creators recommend setting this value to 128 megabytes. If you choose to follow this recommendation edit the `php.ini` file so `memory_limit` setting is as follows:

{{< file-excerpt "/etc/php.ini" ini >}}
memory_limit = 128M

{{< /file-excerpt >}}


### Restart the Web Server

You'll need to restart Apache after installing php-gd and modifying the PHP settings. You can do this by issuing the following command:

    service httpd restart

# Configure a Dedicated Virtual Host for Piwik

This phase of the installation process is optional, but recommended. Here we configure a subdomain and virtual host configuration in Apache specifically for Piwik. This makes it easy to separate the statistics package from the website or websites that Piwik monitors.

To create a virtual host we need to add an "[A Record](/docs/networking/dns/dns-records-an-introduction/#a-and-aaaa)" for the subdomain that Piwik will use; in our example this is `stats.example.com`. If your DNS is hosted with Linode's DNS servers, you can configure the A record in the [DNS manager](/docs/dns-guides/configuring-dns-with-the-linode-manager). Additionally, we'll need to create a new virtual hosting file for this sub domain.

We'll append the following virtual host to our `vhost.conf` file, located at `/etc/httpd/conf.d/vhost.conf`:

{{< file "/etc/httpd/conf.d/vhost.conf" apache >}}
<VirtualHost *:80>
     ServerAdmin admin@example.net
     ServerName stats.example.net
     DocumentRoot /srv/www/stats.example.net/public_html/
     ErrorLog /srv/www/stats.example.net/logs/error.log
     CustomLog /srv/www/stats.example.net/logs/access.log combined
</VirtualHost>

{{< /file >}}


We'll need to create the `logs` and `public_html` directories by issuing the following commands:

    mkdir -p /srv/www/stats.example.net/public_html
    mkdir /srv/www/stats.example.net/logs

Enable the virtual host and restart the web server with the following command:

    /etc/init.d/httpd reload

Remember that the configuration of a special virtual host for Piwik is optional. If you use a web server other than Apache, you will need to pursue different steps to configure the virtual host.

# Installing Piwik

First we'll download the latest distribution of the Piwik package. Issue the following two commands:

    cd /srv/www/stats.example.net/
    wget http://piwik.org/latest.zip

Uncompress the archive and move the contents of the archive to the directory where you want to install Piwik. Use these two commands:

    unzip latest.zip
    mv piwik/* public_html

Before running Piwik's installation script, we need to change the permissions of several directories. Piwik requires these permissions to remain set to function properly. Issue the following commands:

    chmod a+w /srv/www/stats.example.net/public_html/tmp
    chmod a+w /srv/www/stats.example.net/public_html/config
    chown -R apache:apache /srv/www/stats.example.net/public_html

Visit your new Piwik instance in your browser. In our example, this is located at `http://stats.example.com`. Follow the instructions provided by the Piwik installation process. You will be prompted for the name of your MySQL database as well as access credentials for this database. This information was created when you installed the LAMP stack. After this step, you may see the following message:

    "Client connection to the database server is not set to UTF8 by default.
    This is not critical issue: Piwik should work correctly. However for
    consistency, it is recommended that you do one of the following:

        * in your piwik config/config.ini.php, add charset = utf8 under
          the [database] section of your Piwik configuration file
          config/config.ini.php"
        * recompile libmysql --with-charset=utf8""

After installation, follow the first recommendation by adding `charset = utf8` to your `config.ini.php` file under the `[database]` section.

When Piwik's installation process is complete, you will receive a JavaScript snippet that you can insert in every page on your site that you want to track using Piwik.

If you are concerned about the security of the data collected by Piwik, consider limiting access to Piwik's virtual host, using either [rule-based](/docs/web-servers/apache/configuration/rule-based-access-control) or [authentication based access control](/docs/web-servers/apache/configuration/http-authentication).

Congratulations! You now have a fully functional statistics and web traffic analytics package running on your own server.

# Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the Piwik security announcement posts, and development mailing lists to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [Piwik Security Announcements](http://piwik.org/blog/category/security/)
-   [Piwik Mailing Lists](http://lists.piwik.org/mailman/listinfo)

When upstream sources offer new releases, repeat the instructions for installing the Piwik software as needed. These practices are crucial for the ongoing security and functioning of your system.



