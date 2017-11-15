---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Using PHP-FastCGI for dynamic sites under Cherokee on Ubuntu 10.04 LTS (Lucid)'
keywords: ["cherokee php-fastcgi", "cherokee fastcgi", "web sever", "cherokee ubuntu 10.04", "cherokee ubuntu lucid", "ubuntu lucid"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/cherokee/php-fastcgi-ubuntu-10-04-lucid/','websites/cherokee/web-apps-with-cherokee-and-phpfastcgi-on-ubuntu-10-04-lts-lucid/']
modified: 2013-10-07
modified_by:
  name: Linode
published: 2010-06-11
title: 'Web Apps with Cherokee and PHP-FastCGI on Ubuntu 10.04 LTS (Lucid)'
---



Cherokee is a fast, flexible web server for POSIX compliant operating systems such as Linux. It's designed to be easy to administer, and includes support for a wide range of common web server functions.

This tutorial explains how to configure Cherokee to serve dynamic content with PHP via FastCGI on Ubuntu 10.04 LTS (Lucid). Please make sure you are logged into your Linode as root via SSH.

This document assumes that you already have a working and up to date Ubuntu 10.04 system. If you have not followed our [getting started](/docs/getting-started/) guide, it is recommended that you do so prior to following these instructions.

# Prerequisites

Make sure your repositories and packages are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade

If you haven't already installed Cherokee, please follow our [Ubuntu 10.04 Cherokee installation](/docs/web-servers/cherokee/installing-cherokee-ubuntu-10-04-lucid) guide before continuing with these instructions.

# Install Required Packages

Issue the following commands to install support for PHP and FastCGI:

    apt-get install php5-cli php5-cgi spawn-fcgi

Issue the following sequence of commands to create scripts to control `spawn-fcgi` and the PHP-FastCGI process, set the permissions for these scripts, ensure that PHP-FastCGI starts as part of the boot process, and start PHP-FastCGI For the first time:

    cd /opt/
    wget -O php-fastcgi-deb.sh http://www.linode.com/docs/assets/579-pp-php-fastcgi-deb.sh
    wget -O php-fastcgi-init-deb.sh http://www.linode.com/docs/assets/580-php-fastcgi-init-deb.sh
    mv /opt/php-fastcgi-deb.sh /usr/bin/php-fastcgi
    mv /opt/php-fastcgi-init-deb.sh /etc/init.d/php-fastcgi
    chmod 755 /usr/bin/php-fastcgi
    chmod 755 /etc/init.d/php-fastcgi
    update-rc.d php-fastcgi defaults
    /etc/init.d/php-fastcgi start

# Configure Your Site

Create directories for your site by issuing the following commands. Substitute your domain name for "mydomain.com" in these commands.

    mkdir -p /srv/www/mydomain.com/www/public_html
    mkdir /srv/www/mydomain.com/www/logs
    chown -R www-data:www-data /srv/www/mydomain.com

If you haven't already done so, start the Cherokee administration program by issuing the following command. Alternately, you may wish to follow our instructions for [secure Cherokee admin access](/docs/web-servers/cherokee/websites-with-the-cherokee-web-server-on-ubuntu-10-04-lts-lucid/#secure-admin-panel-access).

    cherokee-admin -b &

Navigate to the "General" page in the admin interface. You may wish to enable SSL support, change the server tokens, or enable graphs.

[![General settings in Cherokee admin panel on Ubuntu 10.04 LTS](/docs/assets/239-00-cherokee-ubuntu-10-04-general-settings.png)](/docs/assets/239-00-cherokee-ubuntu-10-04-general-settings.png)

Click the "Add New Virtual Server" button on the "Virtual Servers" page.

[![Virtual servers listing in Cherokee admin panel on Ubuntu 10.04 LTS](/docs/assets/240-01-cherokee-ubuntu-10-04-virtual-servers.png)](/docs/assets/240-01-cherokee-ubuntu-10-04-virtual-servers.png)

Assign a nickname for your new virtual server and specify its document root:

[![New virtual server basic settings in Cherokee admin panel on Ubuntu 10.04 LTS](/docs/assets/241-02-cherokee-ubuntu-10-04-new-virtual-server.png)](/docs/assets/241-02-cherokee-ubuntu-10-04-new-virtual-server.png)

[![New virtual server listing in Cherokee admin panel on Ubuntu 10.04 LTS](/docs/assets/242-03-cherokee-ubuntu-10-04-virtual-servers.png)](/docs/assets/242-03-cherokee-ubuntu-10-04-virtual-servers.png)

Click on your new virtual server's nickname in the server list. Specify which files you would like to consider directory indexes on the "Basic" tab.

[![Configuring directory indexes in Cherokee admin panel on Ubuntu 10.04 LTS](/docs/assets/243-04-cherokee-ubuntu-10-04-directory-indexes.png)](/docs/assets/243-04-cherokee-ubuntu-10-04-directory-indexes.png)

On the "Host Match" tab, enter your base domain name and the domain prefixed by "www":

[![Configuring host matching in Cherokee admin panel on Ubuntu 10.04 LTS](/docs/assets/244-05-cherokee-ubuntu-10-04-host-match.png)](/docs/assets/244-05-cherokee-ubuntu-10-04-host-match.png)

On the "Behavior" tab, remove all rules except for the "Default" rule:

[![Behavior rules list in Cherokee admin panel on Ubuntu 10.04 LTS](/docs/assets/245-06-cherokee-ubuntu-10-04-behavior.png)](/docs/assets/245-06-cherokee-ubuntu-10-04-behavior.png)

On the "Logging" tab, specify the location of your access and error logs:

[![Logging configuration in Cherokee admin panel on Ubuntu 10.04 LTS](/docs/assets/246-07-cherokee-ubuntu-10-04-logging.png)](/docs/assets/246-07-cherokee-ubuntu-10-04-logging.png)

Navigate to the "Information Source" page. Specify a new information source with the following settings:

[![PHP-FastCGI information source setttings in Cherokee admin panel on Ubuntu 10.04 LTS](/docs/assets/247-08-cherokee-ubuntu-10-04-information-sources.png)](/docs/assets/247-08-cherokee-ubuntu-10-04-information-sources.png)

Navigate back to the "Virtual Servers" page. Create an extensions rule for PHP files on the "Behavior" tab of your virtual server's configuration page.

[![PHP extensions rule in Cherokee admin panel on Ubuntu 10.04 LTS](/docs/assets/248-09-cherokee-ubuntu-10-04-virtual-servers-rule.png)](/docs/assets/248-09-cherokee-ubuntu-10-04-virtual-servers-rule.png)

On the "Handler" tab, specify the following settings for PHP-FastCGI:

[![PHP-FastCGI handler settings in Cherokee admin panel on Ubuntu 10.04 LTS](/docs/assets/249-10-cherokee-ubuntu-10-04-virtual-servers-handler.png)](/docs/assets/249-10-cherokee-ubuntu-10-04-virtual-servers-handler.png)

On the "Encoding" tab, enable gzip/deflate compression:

[![PHP-FastCGI gzip/deflate compression settings in Cherokee admin panel on Ubuntu 10.04 LTS](/docs/assets/250-11-cherokee-ubuntu-10-04-virtual-servers-encoding.png)](/docs/assets/250-11-cherokee-ubuntu-10-04-virtual-servers-encoding.png)

# Test Your Configuration

Restart Cherokee by clicking the "Save" button under the left page navigation list. Once Cherokee has restarted, create a test PHP script as follows:

{{< file "/srv/www/mydomain.com/www/public\\_html/test.php" php >}}
<?php phpinfo(); ?>

{{< /file >}}


Visit "/test.php" on your site to verfify PHP-FastCGI is operating correctly. You should see the standard PHPInfo page. Congratulations, you've successfully configured PHP-FastCGI for dynamic content using the Cherokee web server!

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Cherokee Web Server Documentation](http://www.cherokee-project.com/doc/)
- [FastCGI Project Information](http://www.fastcgi.com/drupal/)
