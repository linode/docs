---
deprecated: true
author:
  name: Stan Schwertly
  email: docs@linode.com
description: 'Installing Magento on an Ubuntu 9.10 LAMP stack.'
keywords: ["magento", "ecommerce", "store", "cart", "shop", "shopping"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/e-commerce/magento/ubuntu-9-10-karmic/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2010-02-05
title: 'Magento on Ubuntu 9.10 (Karmic)'
---

Magento is a self hosted e-commerce solution used by many people to sell products online. It runs on a [LAMP stack](/docs/lamp-guides/ubuntu-9-10-karmic/) and offers the user a wide variety of options.

Before installing Magento, we assume that you have followed our [getting started guide](/docs/getting-started/) as well as our [LAMP guide](/docs/lamp-guides/ubuntu-9-10-karmic/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/content/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

# Installing Prerequisites

Before installing Magento, we must ensure that the `universe` repositories are enabled on your system. Your `/etc/apt/sources.list` should resemble the following (you may have to uncomment or add the `universe` lines:)

{{< file "/etc/apt/sources.list" >}}
## main & restricted repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic main restricted
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic main restricted

deb http://security.ubuntu.com/ubuntu karmic-security main restricted
deb-src http://security.ubuntu.com/ubuntu karmic-security main restricted

## universe repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe

deb http://security.ubuntu.com/ubuntu karmic-security universe
deb-src http://security.ubuntu.com/ubuntu karmic-security universe

{{< /file >}}


If you had to enable new repositories, issue the following command to update your package lists:

    apt-get update
    apt-get upgrade

Magento requires Apache to be installed to serve webpages, as well as PHP 5 and MySQL. Along with the base PHP5 install, you'll need several other extensions. The following commands will attempt to install every required extension and then restart Apache:

    apt-get install php5-mysql php5-curl php5-gd php5-mcrypt php5-cli
    a2enmod rewrite
    /etc/init.d/apache2 restart

You'll also need to create a database for Magento, and a user with permission to access that database. The following commands provide an example of what steps would need to be taken to accomplish this:

    mysql -u root -p
    CREATE DATABASE magento;
    CREATE USER mage;
    GRANT ALL ON magento.* TO 'mage' IDENTIFIED BY 'password';
    exit

Please see our [MySQL](/docs/databases/mysql/ubuntu-9-10-karmic) document for additional information regarding MySQL.

Additionally you will want to increase PHP's `memory_limit` setting, by editing the `/etc/php5/cli/php.ini` and `/etc/php5/apache2/php.ini` file as follows:

{{< file-excerpt "/etc/php5/cli/php.ini and /etc/php5/apache2/php.ini" ini >}}
memory_limit = 64M

{{< /file-excerpt >}}


At this point your server has the prerequisites to install Magento.

# Installing Magento

Magento requires you to have a cookie on your system in order to download their packages. Alternatively, you can find the latest version of Magento on [this wiki page for installing Magento via ssh](http://www.magentocommerce.com/wiki/1_-_installation_and_configuration/installing_magento_via_shell_ssh). First we'll switch to the directory in which you'd like to install Magento. For this example we'll be installing Magento to our document root directory. After changing to the proper directory, we'll download the latest version of Magento, unpack it, grant the proper permissions and run `pear`. Run the following commands to install Magento:

    cd /srv/www/example.com/public_html/
    wget http://www.magentocommerce.com/downloads/docs/assets/1.4.0.1/magento-1.4.0.1.tar.gz
    tar -zxvf magento-1.4.0.1.tar.gz
    mv magento/* magento/.htaccess .
    chmod -R 777 var var/.htaccess app/etc media
    chown -R root:www-data app/etc/ var/ media/
    ./pear mage-setup .
    ./pear install magento-core/Mage_All_Latest-stable
    rm -rf downloader/pearlib/cache/* downloader/pearlib/download/*
    rm -rf magento/ magento-1.4.0.1.tar.gz

### Web-based Installer

From here you can point your browser to the URL you installed Magento to. All of these steps are straightforward. You'll be prompted to enter your database credentials that you created earlier, as well as an administrative username and password. After you finish the steps through the web-based installer, you will have a fully operating installation of Magento ready to be customized!

**NOTE:** If you receive an error message "example.com is not accessible \# Unable to read response, or response is empty" during the Magento web-based installation procedure, be sure to check the "Skip URL validation" box before clicking continue.

### SSL Certificates

You may want to install a commercial SSL certificate on your Magento website in order to encrypt the data passed between your customer's computer and your server. After following our [obtaining a commercial SSL certificate](/docs/security/ssl/obtaining-a-commercial-ssl-certificate) document, you can set up your SSL certificate in the Administrative Area. After logging in to Magento, scroll over the "System" tab and select "Configuration". Click the "Web" tab on the left-hand side and drop down the "Secure" listing. From here you can alter your Base URL to include the `https` protocol.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Magento's Website](http://www.magentocommerce.com/)
- [Magento's Knowledge Base](http://www.magentocommerce.com/knowledge-base)
- [Tutorial: Creating Products](http://www.magentocommerce.com/knowledge-base/entry/knowledge-base/entry/tutorial-creating-products)



