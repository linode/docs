---
deprecated: true
author:
  name: Stan Schwertly
  email: docs@linode.com
description: 'Selling products online with Magento, an open source e-commerce solution on a Debian 5 (Lenny) Linode.'
keywords: ["Magento", "Debian", "ecommerce", "Store"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/e-commerce/magento/debian-5-lenny/']
modified: 2011-08-22
modified_by:
  name: Linode
published: 2010-01-18
title: 'Magento on Debian 5 (Lenny)'
---

Magento is a self hosted e-commerce solution used by many people to sell products online. It runs on a [LAMP stack](/docs/lamp-guides/debian-5-lenny/) and offers the user a wide variety of options.

Before installing Magento we assume that you have followed our [getting started](/docs/getting-started/) guide as well as our [LAMP guide.](/docs/lamp-guides/debian-5-lenny/) If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/content/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

# Installing Prerequisites

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Magento requires Apache to be installed to serve webpages, as well as PHP 5 and MySQL. If you're running an older version of PHP, you can use our [PHP-CGI Apache](/docs/web-servers/apache/php-cgi/debian-5-lenny) guide to run PHP5 as a binary. Along with the base PHP5 install, you'll need several other extensions. The following command will attempt to install every required extension and then restart Apache:

    apt-get install php5-mysql php5-curl php5-gd php5-mcrypt
    a2enmod rewrite
    /etc/init.d/apache2 restart

You will need to modify your PHP cli settings to ensure that the Magento installer has enough memory to run. You will want to set your PHP cli memory limit to at least 64M as shown below:

{{< file-excerpt "/etc/php5/cli/php.ini" ini >}}
memory_limit = 64M

{{< /file-excerpt >}}


You'll also need to create a database for Magento, and a user with permission to access that database. The following commands provide an example of what steps would need to be taken to accomplish this:

    mysql -u root -p
    CREATE DATABASE magento;
    CREATE USER mage;
    GRANT ALL ON magento.* TO 'mage' IDENTIFIED BY 'password';
    exit

Please see our [MySQL](/docs/databases/mysql/debian-5-lenny) document for additional tips for optimizing memory. At this point your server has the prerequisites to install Magento.

# Installing Magento

Magento requires you to have a cookie on your system in order to download their packages. Alternatively, you can find the latest version of Magento on [this wiki page for installing Magento via ssh](http://www.magentocommerce.com/wiki/1_-_installation_and_configuration/installing_magento_via_shell_ssh). First we'll switch into the directory you'd like to install Magento to. For this example we'll be installing Magento to our root directory. After switching, we'll download the latest version of Magento, unpack it, grant the proper permissions and run `pear`. Run the following commands to install Magento:

    cd /srv/www/example.com/public_html/
    wget http://www.magentocommerce.com/downloads/docs/assets/1.4.1.0/magento-1.4.1.0.tar.gz
    tar -zxvf magento-1.4.1.0.tar.gz
    mv magento/* magento/.htaccess .
    chmod -R 777 var var/.htaccess app/etc media
    chown -R root:www-data app/etc/ var/ media/
    ./pear mage-setup .
    ./pear install magento-core/Mage_All_Latest-stable
    rm -rf downloader/pearlib/cache/* downloader/pearlib/download/*
    rm -rf magento/ magento-1.4.1.0.tar.gz

### Web-based Installer

From here you can point your browser to the URL you installed Magento at. All of these steps are straightforward. You'll be prompted to enter your database credentials that you created earlier, as well as an administrative username and password. After you finish the steps in the web-based installer, you will have a fully operating installation of Magento ready to be customized!

### SSL Certificates

You may want to install a commercial SSL certificate on your Magento website in order to encrypt the data passed between your customer's computer and your server. After following our [obtaining a commercial SSL certificate](/docs/security/ssl/obtaining-a-commercial-ssl-certificate) document, you can set up your SSL certificate in the Administrative Area. After logging into Magento, scroll over the "System" tab and select "Configuration". Click the "Web" tab on the left-hand side and drop down the "Secure" listing. From here you can alter your Base URL to include the `https` protocol.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Magento's Website](http://www.magentocommerce.com/)
- [Magento's Knowledge Base](http://www.magentocommerce.com/knowledge-base)
- [Tutorial: Creating Products](http://www.magentocommerce.com/knowledge-base/entry/knowledge-base/entry/tutorial-creating-products)



