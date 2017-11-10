---
author:
  name: Ozan Yerli
  email: oyerli@gmail.com
description: 'Installing and configuring Symfony for developing PHP applications on your CentOS 5 Linode.'
keywords: 'cakephp,cakephp debian,php framework,debian,develop php'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['frameworks/symfony/','websites/frameworks/symfony-on-centos-5/']
modified: Friday, September 27th, 2013
modified_by:
  name: Linode
published: 'Tuesday, June 8th, 2010'
expiryDate: 2015-09-27
title: Symfony on CentOS 5
deprecated: true
---

Symfony is a PHP web application framework, providing the classes and tools required to build and enhance both simple and complex applications. Featuring easy AJAX integration, an admin interface generator, and more, Symfony has become a very popular choice for web application development.

Before installing Symfony, it is assumed that you have followed our [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/docs/using-linux/administration-basics).

Basic System Configuration
--------------------------

First, update all of the base packages:

    yum update

Install `make`, as it will be required for installation of the other packages:

    yum install make

Since CentOS does not include the latest version of PHP 5.2 (which is required for the Symfony Framework), you'll need to add an external repository. Add the [webtatic](http://www.webtatic.com/) repository:

    rpm -ivh http://repo.webtatic.com/yum/centos/5/`uname -i`/webtatic-release-5-0.noarch.rpm

Edit the file `/etc/yum.repos.d/webtatic.repo`. Under `[webtatic]` add the following line:

{: .file-excerpt }
/etc/yum.repos.d/webtatic.repo

> exclude=php\*5.3\*

This will ensure that no PHP 5.3 packages will be installed, as Symfony does not use any features of PHP 5.3.

Install Required Packages
-------------------------

Install the Apache web server with devel package:

    yum --enablerepo=webtatic install httpd httpd-devel

Install the MySQL database server:

    yum --enablerepo=webtatic install mysql mysql-server

Install PHP 5.2 with the packages required for the Symfony:

    yum --enablerepo=webtatic install php php-mysql php-pear php-devel php-xml php-posix php-mbstring

Install the compiler packages, as we will need them for the installation of the APC accelerator:

    yum install gcc

Install the APC accelerator using PECL:

    pecl install apc

Answer "yes" to all questions. After the installation complete, execute the following command to add the APC module to the web server:

    echo extension=apc.so > /etc/php.d/apc.ini

Set the MySQL server to start on boot and start it:

    /sbin/chkconfig --levels 235 mysqld on
    service mysqld start

Set the root password for the MySQL server and apply the security necessities:

    mysql_secure_installation

Edit /etc/php.ini and find the following line:

{: .file-excerpt }
/etc/php.ini
:   ~~~ ini
    short_open_tag = On
    ~~~

Replace it with this line:

{: .file-excerpt }
/etc/php.ini
:   ~~~ ini
    short_open_tag = Off
    ~~~

Set the web server to start on boot and start it:

    /sbin/chkconfig --levels 235 httpd on
    service httpd start

Download the Symfony system configuration check file and run it:

    wget http://sf-to.org/1.4/check.php
    php check_configuration.php

You should get "OK" for all the tests.

Create Your First Symfony Project
---------------------------------

Create a project folder under `/home`. We will use sfproject as our project name:

    mkdir /home/sfproject
    cd /home/sfproject

Create lib/vendor folder under the /home/sfproject:

    mkdir -p lib/vendor
    cd lib/vendor

Download the latest Symfony release:

    wget http://www.symfony-project.org/get/symfony-1.4.5.tgz

Extract it and rename it:

    tar zxpf symfony-1.4.5.tgz
    rm symfony-1.4.5.tgz
    mv symfony-1.4.5 symfony

Go to the project root and generate the project:

    cd /home/sfproject
    php lib/vendor/symfony/data/bin/symfony generate:project sfproject

Now, Symfony has created all necessary files/folders for the project. You can have a look at them.

There is now a symfony executable shortcut under `/home/sfproject`. From now on you can use the `./symfony` shortcut (when you are in the `/home/sfproject` directory) to execute Symfony commands.

Configure the database, entering your MySQL root password for "pass":

    ./symfony configure:database "mysql:host=localhost;dbname=dbname" root pass

Generate the frontend application:

    ./symfony generate:app frontend

Now, we need to configure the web server to serve our new project.

Edit `/etc/httpd/conf/httpd.conf` and add at the end:

{: .file-excerpt }
/etc/httpd/conf/httpd.conf
:   ~~~ apache
    NameVirtualHost *:80
    <VirtualHost *:80>
      DocumentRoot "/home/sfproject/web"
      DirectoryIndex index.php
      <Directory "/home/sfproject/web">
        AllowOverride All
        Allow from All
      </Directory>

      Alias /sf /home/sfproject/lib/vendor/symfony/data/web/sf
      <Directory "/home/sfproject/lib/vendor/symfony/data/web/sf">
        AllowOverride All
        Allow from All
      </Directory>
    </VirtualHost>
    ~~~

Restart the web server:

    service httpd restart

Using your browser, browse to your Linode's IP address. You should now see the Symfony Project Created page. From now on, you can easily follow the [official Symfony tutorial](http://www.symfony-project.org/jobeet/1_4/Doctrine/en/).

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Symfony Project Website](http://www.symfony-project.org/)



