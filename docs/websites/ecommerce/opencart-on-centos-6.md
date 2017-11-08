---
author:
  name: Linode
  email: docs@linode.com
description: 'Set up and manage an online storefront with OpenCart.'
keywords: ["opencart", "ecommerce", "commerce", "store", "centos"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/e-commerce/opencart/centos-6/']
modified: 2011-09-20
modified_by:
  name: Linode
published: 2011-09-20
title: OpenCart on CentOS 6
---

OpenCart is an open source storefront designed to give you flexibility and fine-grained control over your online storefront. Before getting started, you should have already set up a [LAMP stack](/docs/lamp-guides) on your Linode. You should have also [set the hostname](/docs/getting-started#setting-the-hostname).

# PHP Settings

In order to use OpenCart, you will need to ensure that PHP is configured properly. Make sure the settings below match the values in your `/etc/php.ini` file:

{{< file >}}
/etc/php.ini
{{< /file >}}

> register\_globals = Off magic\_quotes\_gpc = Off file\_uploads = 1 session\_auto\_start = 0

Additionally, you will need to make sure that the following PHP extensions are installed:

    yum install php-mysql php-gd php-curl php-pecl-zip

# MySQL Credentials

You will also need to create a database and a database user for OpenCart. To create a database and grant your users permissions on it, issue the following command. Note, the semi-colons (`;`) at the end of the lines are crucial for ending the commands. Your command should look like this:

    create database mystore;
    grant all on mystore.* to 'opencart' identified by 'p@$$w0rD';
    flush privileges;

In the example above, `mystore` is the name of the database for your store, `opencart` is the username, and `p@$$w0rD` is the password.

# Install OpenCart

Issue the following commands to download and unpack OpenCart:

    cd /opt
    wget http://opencart.googlecode.com/files/opencart_v1.5.1.1.zip
    unzip opencart_v1.5.1.1.zip

You will now need to move the files located in the "Upload" directory to your web root. For example, if you wanted your OpenCart installation to be located at `http://www.example.com`, your document root might look something like `/srv/www/example.com/public_html`.

Next, you will need to make sure that OpenCart has access to write to specific folders and files. Issue the following commands:

    chmod 755 image/
    chmod 755 image/cache/
    chmod 755 image/data/
    chmod 755 cache/
    chmod 755 download/
    chmod 755 config.php
    chmod 755 admin/config.php
    chmod 755 system/cache/
    chmod 755 system/logs/

You may then visit your OpenCart instance via a web browser to continue with the installation process. In our example, this would be `http://www.example.com`.

Read and accept the license agreement, and make sure that the pre-installation checks are passed on the second page. Configure the database connection details by providing OpenCart with the MySQL credentials that you created earlier. Additionally, you will also create your administrator user at this time. Be sure to type your password and email address correctly!

Once you have completed the installation, be sure to delete the `install` directory by issuing the following command:

    rm -rf /srv/www/example.com/public_html/install

Congratulations! You are now ready to manage your own online storefront!



