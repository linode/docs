---
author:
  name: Stan Schwertly
  email: docs@linode.com
description: 'Installing and configuring CakePHP for developing PHP applications on your Debian 5 (Lenny) Linode.'
keywords: ["cakephp", "cakephp debian", "php framework", "debian", "develop php"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/cakephp/','websites/frameworks/cakephp-on-debian-5-lenny/']
modified: 2014-02-10
modified_by:
  name: Alex Fornuto
published: 2010-05-26
title: 'CakePHP on Debian 5 (Lenny)'
deprecated: true
---

CakePHP is a framework used to develop PHP applications quickly. Many people choose CakePHP because of the simple deployment process and extensive documentation available on the CakePHP website.

Before installing CakePHP, we assume that you have followed our [getting started guide](/docs/getting-started/) as well as our [LAMP guide](/docs/lamp-guides/debian-5-lenny/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/docs/using-linux/administration-basics).

Installation
------------

For this guide, we'll be installing the latest version of CakePHP, which is currently at 1.2.6. Make sure you download the latest version of CakePHP by checking [the CakePHP website](http://cakephp.org/). Issue the following commands to install CakePHP on your Linode:

    cd /srv/www/example.com/public_html
    wget http://github.com/cakephp/cakephp1x/tarball/1.2.6
    tar xvfz cakephp-cakephp1x-1.2.6-0-gbe7ddfb.tar.gz
    rm cakephp-cakephp1x-ef18ab2.tar.gz
    mv cakephp-cakephp1x-ef18ab2/ cake_1_2
    chown -R www-data:www-data cake_1_2/app/tmp/

At this point, your installation of CakePHP is considered to be deployed for development purposes. You can now begin developing CakePHP applications. If you're using your domain for a single CakePHP application, continue following the guide to deploy CakePHP in production mode.

Production
----------

The transition from a development installation of CakePHP to a production installation is easy. After following the steps above, open the Apache configuration file for the website you're installing CakePHP to. In our example, this file is located at `/etc/apache2/sites-available/example.com`. You'll need to change the `DocumentRoot` to reflect the path of the application in CakePHP, which in our example is `/srv/www/example.com/public_html/cake_1_2/app/webroot/`

{{< file "/etc/apache2/sites-available/example.com" apache >}}
<VirtualHost *:80>
     ServerAdmin username@example.com
     ServerName example.com
     ServerAlias www.example.com
     DocumentRoot /srv/www/example.com/public_html/cake_1_2/app/webroot/
     ErrorLog /srv/www/example.com/logs/error.log
     CustomLog /srv/www/example.com/logs/access.log combined
</VirtualHost>

{{< /file >}}


You'll also want to adjust the debug level for CakePHP. The line controlling the debug level is in the following file.

{{< file "/srv/www/example.com/public\\_html/cakephp-2.4.5/app/Config/core.php" php >}}
Configure::write('debug', 2);

{{< /file >}}


Change the `2` to a `0`. Run the following command after saving and closing the file:

    /etc/init.d/apache2 reload

You're now running a production version of CakePHP, ready for development!

Testing CakePHP
---------------

If you're new to CakePHP, you may want to begin with their 15 minute blog tutorial. You can find the [15 Minute Blog Tutorial](http://book.cakephp.org/view/219/Blog) on their manual page. Congratulations! You have now successfully installed CakePHP on your Debian Linode!

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The Cookbook, CakePHP's documentation](http://book.cakephp.org)
- [15 Minute Blog Tutorial](http://book.cakephp.org/view/219/Blog)
- [Creating a Simple ACL controlled application](http://book.cakephp.org/view/641/Simple-Acl-controlled-Application)



