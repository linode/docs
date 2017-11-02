---
author:
  name: Angel G
  email: docs@linode.com
description: 'This guide shows you how to prepare a system for, then install and set up the agribusiness management web app, FarmOS.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-09-09
modified: 2017-09-20
modified_by:
    name: Linode
title: 'Install and Configure FarmOS, an Agricultural Management, Planning and Record-Keeping Web App'
---

![Farm_OS Banner](/docs/assets/FarmOS.png)

## What is FarmOS?

[FarmOS](http://farmos.org/) is a one-of-a-kind web application that enables farmers to manage and track all aspects of their farm. Built atop Drupal and licensed under [GPL V.3](https://www.gnu.org/licenses/gpl-3.0.en.html), FarmOS is a great free-software solution for farms to explore.

This guide explains how to install, setup and host your own FarmOS web app on a Linode.


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade


4. Install a LAMP Stack

   Drupal needs to be built atop a web-server. The LAMP stack provides a quick and easy solution to serve web applications, like Drupal. Install the LAMP stack using our guide on [installing a LAMP stack](https://www.linode.com/docs/web-servers/lamp/install-lamp-stack-on-ubuntu-16-04).


## MySQL Setup

After installing the LAMP Stack, you need to create a database for Drupal to use.

1. Log into the root account of your database:

        mysql -u root -p

2. Create a database and a database user:

        CREATE DATABASE drupaldb;
        CREATE USER DRUPAL_USER@LOCALHOST IDENTIFIED BY 'PASSWORD';

3. Grant privileges to the user:

        GRANT ALL PRIVILEGES ON drupaldb.* TO DRUPAL_USER@LOCALHOST;

## Optimize PHP

Download the following PHP libraries:

          sudo apt install php-gd php-xml php-xmlrpc

          sudo apt install php-mysql phpmyadmin

If prompted to automatically configure a database, choose "yes."


## Install FarmOS

FarmOS is bundled as a Drupal distribution, so you do not need to install Drupal **BEFORE** installing FarmOS. The Drupal installation is bundled in. FarmOS should be installed in `/var/www/html/example.com/public_html/FarmOS`.

1. Download the FarmOS distribution package:

        wget https://ftp.drupal.org/files/projects/farm-7.x-1.0-beta15-core.tar.gz

2. Uncompress the file:

         tar -zxvf farm-7.x-1.0-beta15-core.tar.gz

3. Install FarmOS, and move the contents of `farm-7.x-1.0-beta15` to `/var/www/html/example.com/public_html/FarmOS`.

         sudo mv -r farm-7.x-1.0-beta15/*  /var/www/html/example.com/public_html/FarmOS

4. Make sure the permissions for `sites/default` and `sites/default/settings.php` are set correctly:

         cd /var/www/html/example.com/public_html/FarmOS
         sudo chmod 777 ./sites/default
         sudo cp ./sites/default/default.settings.php ./sites/default/settings.php
         sudo chmod 777 ./sites/default/settings.php

5. If you've configured everything correctly, you can now point your web browser to your Linode's public IPaddress/FarmOS.

         192.0.0.1/FarmOS

## Configure FarmOS

FarmOS will configure Drupal and itself at the same time:

1. The first screen you will encounter asks you to choose a profile and a language:

    ![firstscreen](/docs/assets/FarmOS/firstscreen.png)

2. Drupal checks if the install is correct in the **Verify requirements** section. Then, it will move to configuring the database. In this section you should input the information from the database built earlier in this tutorial:

    ![DatabaseConfig](/docs/assets/FarmOS/second.png)

3. Once FarmOS hooks into the database, you will need to configure your FarmOS site. This is where you will define the name and the main user account:

    ![Configure](/docs/assets/FarmOS/configure.png)

4. The next section is going to ask you what modules you want to install. You can install and uninstall modules at any time, but this is a chance to install personalized modules that will work for your specific type of farm.

    ![modules](/docs/assets/FarmOS/modules.png)

5. Finally, after installing the modules, you will be dropped into the FarmOS dashboard:

    ![welcome](/docs/assets/FarmOS/welcome.png)

6. After the installation has finished, you may want to reset your file permissions to avoid security vulnerabilities:

       sudo chmod 644 sites/default
       sudo chmod 644 ./sites/default/settings.php


## Add Users
To add users to your FarmOS distribution, you can do so from the **People** tab under **Manage**.

   ![adduser](/docs/assets/FarmOS/Adduser.png)


After each user is created, use the **people** tab, to verify success:

![peoplescreen](/docs/assets/FarmOS/peoplescreen.png)

## Next Steps

### Registering a Domain Name for FarmOS
If you want to register a domain name (e.g., `yourfarm.com`), check out our guide on the [DNS Manager](https://www.linode.com/docs/networking/dns/dns-manager-overview) and add your FQDN to the Linode Manager. A FQDN will provide you, and the people who plan on using FarmOS, the ability to navigate to a URL, instead of your Linode's public IP address. If you plan on using FarmOS internally, you can skip this step.


### Generate a Google API Key
FarmOS can interface with GoogleMaps. You need a GoogleAPI key to use this feature. The FarmOS official documentation has a section about using GoogleMaps in its [docs](http://farmos.org/hosting/googlemaps/). Interfacing with GoogleMaps allows you to save certain geographical areas into FarmOS. When creating FarmOS projects and tasks, you can use the Google Maps API to pinpoint where the task takes place.




