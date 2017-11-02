---
deprecated: true
author:
  name: Stan Schwertly
  email: docs@linode.com
description: 'How to set up an online store using the open source osCommerce system on Debian 5 (Lenny).'
keywords: ["osCommerce", "Debian", "Store", "Ecommerce"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/e-commerce/oscommerce/debian-5-lenny/']
modified: 2011-08-22
modified_by:
  name: Linode
published: 2010-01-22
title: 'osCommerce on Debian 5 (Lenny)'
---

osCommerce is an open source solution for creating your own online store. It runs on a LAMP stack and is a strong alternative to Magento, which can be difficult to administer for some.

Before installing osCommerce we assume that you have followed our [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/docs/using-linux/administration-basics). Additionally, osCommerce requires Apache, MySQL, and PHP to be installed. We assume you've followed our [Debian LAMP guide](/docs/lamp-guides/debian-5-lenny).

Installation
------------

### Prerequisites

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Before we begin installing osCommerce, we'll need to install some additional PHP packages as well as the `unzip` tool. Run the following commands:

    apt-get install unzip php5-gd php5-curl
    /etc/init.d/apache2 restart

Installing osCommerce is straightforward and simple. `cd` into your document root directory and download the latest version of osCommerce. You can find the latest version available on [the osCommerce website](http://www.oscommerce.com/solutions/downloads). Run the following commands to install osCommerce in the document root of your website:

    cd /srv/www/example.com/public_html
    wget http://www.oscommerce.com/ext/oscommerce-2.2rc2a.zip
    unzip oscommerce-2.2rc2a.zip
    mv oscommerce-2.2rc2a/catalog/* .

If you want to install osCommerce in a subdirectory, simply `cd` into that subdirectory before downloading and unzipping the package. Now we'll create a database for osCommerce, as well as a user for the new database:

    mysql -u root -p
    CREATE DATABASE oscommerce;
    CREATE USER oscom;
    GRANT ALL ON oscommerce.* TO 'oscom' IDENTIFIED BY 'password';
    exit;

Lastly, change the permissions on the following two `configure.php` files to allow the online setup process to work:

    chmod 777 admin/includes/configure.php includes/configure.php

### Web Configuration

At this point you can finish the rest of the installation process through the web. Point your browser to the domain or IP of the osCommerce install and append `/install/` to the end. In our example the URL would be `http://www.example.com/install/`. You'll be prompted to fill in your database details. Use "localhost" for the address of the database server, and the credentials from the user and database we created above. The rest of the installation process is self explanatory. After the installation you'll be able to see your store as well as the administrative interface.

### Post Installation

After the installation, certain files need to be removed or renamed for security reasons. First, we need to remove the installation folder:

    rm -rf /srv/www/example.com/public_html/install

Change the permissions on `configure.php` to prevent security issues:

    chmod 644 /srv/www/example.com/public_html/includes/configure.php
        chmod 644 /srv/www/example.com/public_html/admin/includes/configure.php

Change the permissions of the `images` and `graphs` directory to be accessible by the server:

    chmod -R 777 images/
    chmod -R 777 admin/images/graphs

Finally, change the permissions of the `backups` directory to be accessible by the server:

    chmod -R 777 admin/backups

From here you can begin customizing your store. The default index page will give you instructions for where to begin. You can also check our "More Information" section below.

SSL Certificates
----------------

You may want to install a commercial SSL certificate on your store to encrypt the data sent from your customer to your server. After [Obtaining a Commercial SSL Certificate](/docs/security/ssl/obtaining-a-commercial-ssl-certificate), you'll need to make a couple of changes to your `includes/configure.php` file. Below is an example section from that file that highlights the changes you need to make:

{{< file-excerpt "/srv/www/example.com/public\\_html/includes/configure.php" php >}}
// Define the webserver and path parameters
// * DIR_FS_* = Filesystem directories (local/physical)
// * DIR_WS_* = Webserver directories (virtual/URL)
define('HTTP_SERVER', 'http://www.example.com'); // eg, http://localhost - should not be empty for productive servers
define('HTTPS_SERVER', 'https://example.com'); // eg, https://localhost - should not be empty for productive servers
define('ENABLE_SSL', true); // secure webserver for checkout procedure?
define('HTTP_COOKIE_DOMAIN', 'www.example.com');
define('HTTPS_COOKIE_DOMAIN', 'example.com);
define('HTTP_COOKIE_PATH', '/');
define('HTTPS_COOKIE_PATH', '/');
define('DIR_WS_HTTP_CATALOG', '/');
define('DIR_WS_HTTPS_CATALOG', '/');

{{< /file-excerpt >}}


It should be noted that in this example, the certificate was issued without the `www` qualifier. Your specific requirements may require tweaking.

Monitor for Software Updates and Security Notices
-------------------------------------------------

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the osCommerce security forums and mailing lists to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [osCommerce Security Forums](http://forums.oscommerce.com/forum/77-security/?s=82fef4edc6197910baa8281a3f82de1b)
-   [osCommerce Mailing Lists](http://oscommerce.list-manage.com/subscribe?u=a5961750a3635e18fdf4bb539&id=10af90c126)

When upstream sources offer new releases, repeat the instructions for installing the osCommerce software as needed. These practices are crucial for the ongoing security and functioning of your system.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [osCommerce Website](http://www.oscommerce.com/)
- [osCommerce Knowledge Base](http://www.oscommerce.info/)
- [osCommerce Forums](http://forums.oscommerce.com/)



