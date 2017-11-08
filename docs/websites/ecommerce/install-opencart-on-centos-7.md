---
author:
  name: Jonathan Chun
  email: docs@linode.com
description: 'This tutorial will guide you through basic installation and set-up of popular ecommerce platform OpenCart on CentOS 7.'
keywords: ["opencart", "ecommerce", "commerce", "store", "centos"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/e-commerce/opencart/centos-7/','websites/ecommerce/opencart-on-centos-7/']
modified: 2017-08-21
modified_by:
  name: Jonathan Chun
published: 2017-04-29
title: How to Install OpenCart on CentOS 7
external_resources:
 - '[OpenCart Website](https://www.opencart.com)'
 - '[OpenCart Documentation](http://docs.opencart.com/)'
 - '[OpenCart Community Forums](http://forum.opencart.com/)'
---

## What is OpenCart?

[OpenCart](https://www.opencart.com/) is free open source ecommerce platform for online merchants. OpenCart provides a professional and reliable foundation from which to build a successful online store. This foundation appeals to a wide variety of users; ranging from seasoned web developers looking for a user-friendly interface to use, to shop owners just launching their business online for the first time. OpenCart has an extensive amount of features that gives you a strong hold over the customization of your store. With OpenCart's tools, you can help your online shop live up to its fullest potential.

## Before You Begin

1.  You should set up [LAMP on CentOS 7](/docs/web-servers/lamp/lamp-on-centos-7).

2.  Install the Extra Packages for Enterprise Linux (EPEL) repository.
        sudo yum install epel-release

3.  Make sure your server packages are up to date.
        sudo yum update

4.  Install the unzip utility.
        sudo yum install unzip


## PHP Setup

Make sure that you have the following PHP extensions/modules installed (They should be installed by default on almost all PHP installations):
- Curl
- Zip
- Zlib
- GD Library
- Mcrypt
- Mbstrings
- Xml

You can install them by running the following commands:

    sudo yum install php-mcrypt curl zlib php-gd php-mbstring php-xml php-mysql

## Create a Database and User

You will need to make sure you have a MySQL database and a database user set up for OpenCart. To create a database and a database user, please complete the following instructions:

1.  Login to MySQL/MariaDB:

        mysql -u root -p

    Enter your MySQL/MariaDB root password when prompted. You should now see a MySQL prompt similar to

        MariaDB [(none)]>

2.  Create a new database and user with permissions to use it for OpenCart:

        create database opencart;
        grant all on opencart.* to 'ocuser' identified by 'yourpassword';
        flush privileges;

    In the above example, `opencart` is the name of the database, `ocuser` the user, and `yourpassword` a strong password.

3.  Exit MySQL/MariaDB.

        quit

## Install OpenCart

### Download OpenCart and configure permissions

Issue the following commands to download and unpack OpenCart into your web root directory:

    cd /var/www/html/example.com/public_html/
    curl -OL https://github.com/opencart/opencart/releases/download/2.3.0.2/2.3.0.2-compiled.zip
    unzip 2.3.0.2-compiled.zip 'upload/*'
    cp upload/config-dist.php upload/config.php
    cp upload/admin/config-dist.php upload/admin/config.php
    sudo chown -R apache:apache upload
    shopt -s dotglob
    mv upload/* .
    rm -rf upload

In the above example, replace `/var/www/html/example.com/public_html/` with your virtual host's web root and `2.3.0.2-compiled.zip` with the file name of the latest OpenCart release.

{{< note >}}
You can find the latest version of OpenCart from their [Download Page](https://www.opencart.com/?route=cms/download).
{{< /note >}}

Next, run the following commands to make sure these directories are writable.

    chmod 0755 system/storage/cache/
    chmod 0755 system/storage/logs/
    chmod 0755 system/storage/download/
    chmod 0755 system/storage/upload/
    chmod 0755 system/storage/modification/
    chmod 0755 image/
    chmod 0755 image/cache/
    chmod 0755 image/catalog/
    chmod 0755 config.php
    chmod 0755 admin/config.php

### Run the OpenCart Installer

Visit your website in your browser. You should be redirected to the OpenCart Installer in a page that looks like this:

[![OpenCart Installer Page 1.](/docs/assets/opencart-1-scaled.png)](/docs/assets/opencart-1.png)

Press **CONTINUE** and you will see the _Pre-Installation_ page.

[![OpenCart Installer Page 2.](/docs/assets/opencart-2-scaled.png)](/docs/assets/opencart-2.png)

Make sure that you see the green checkmark for every section before proceeding. If you see any red marks, please go back and make sure all of the instructions in this guide were followed properly. Once you've confirmed that every section has a green checkmark, press the **CONTINUE** button to see the OpenCart configuration page:

[![OpenCart Installer Page 3.](/docs/assets/opencart-3-scaled.png)](/docs/assets/opencart-3.png)

Here, select the **MySQLi** driver and fill out the form with the relevant information from the [Create a Database and User](#create-a-database-and-user) section of this guide. You also need to select a username and password for the default administrator account for this OpenCart installation.

Finally, press the **CONTINUE** button and you should now see the _**Installation complete**_ screen. You will also see a warning box telling you to remove your installation directory. We can do this by going back to your web root directory and running:

    rm -rf install

Once you've done that, the installation is complete. Browse to

    http://example.com/admin

In the above example, `example.com` is your domain name.

You can now login using the administrator account details you entered previously.

## Recommended Next Steps

Now that you have your OpenCart installation up and running, there are a few more steps that we recommend. Because of the security-sensitive nature of ecommerce websites, you will want to make sure your system is secure.

1.  Make sure you follow our [Securing Your Server](/docs/security/securing-your-server) guide.

2.  Secure your website with SSL/TLS. Learn to [Install a SSL certificate with Apache on CentOS 7](/docs/security/ssl/ssl-apache2-centos). Once you've installed a certificate, enable **Use SSL** by following the [Opencart Documentation on SSL](http://docs.opencart.com/administration/ssl/).

3.  Follow the [Basic Security Practices](http://docs.opencart.com/administration/security/) from the OpenCart documentation.

4.  Install [vQmod](https://github.com/vqmod/vqmod) if you wish to use 3rd party extensions.
