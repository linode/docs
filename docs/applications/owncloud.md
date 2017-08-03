---
author:
  name: Angel Guarisma
  email: docs@linode.com
description: 'This guide will explain how to get started with OwnCloud'
keywords: 'owncloud, install owncloud'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Monday, August 7th, 2017'
modified: 'Monday, August 7th, 2017'
modified_by:
  name: Linode
title: 'Install OwnCloud'
external_resources:
  - '[ownCloud Official Documentation](https://doc.owncloud.org/)'

---

ownCloud is an open source, cloud-based, file hosting service. 

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  Update your system:

        sudo apt update && sudo apt upgrade


### Install a LAMP stack

Owncloud is a hosted service, in this guide we will host ownCloud with with a LAMP stack. If you do not have a LAMP stack installed on your Linode, follow our guide to install one:  [Installing a LAMP stack](docs/web-servers/lamp/install-lamp-stack-on-ubuntu-16-04)


### Install ownCloud

The easiest way to install ownCloud is to visit the [ownCloud](http://download.owncloud.org/download/repositories/9.1/owncloud/) install page and follow the instructions for your distribution. On Ubuntu 16.04, you add the repository key to apt, and then install:

	sudo curl https://download.owncloud.org/download/repositories/stable/Ubuntu_16.04/Release.key 
    sudo apt-key add -
    sudo sh -c "echo 'deb http://download.owncloud.org/download/repositories/9.1/Ubuntu_16.04/ /' > /etc/apt/sources.list.d/owncloud.list"
    sudo apt update 
	sudo apt install owncloud

### Configure MySQL

Login to your MySQL database, and enter your root password: 

    mysql -p -u root

Create a new database for ownCloud:

    create database ownCloud;
	create user ownCloud@localhost

Assign the user to the database:

    grant all privileges on ownCloud.* to owncloud@localhost;
	flush privileges;
	exit

You can check the current user in MySQL using the `select current_user();` command. 


	mysql> select current_user();
	+--------------------+
	| current_user()     |
	+--------------------+
	| owncloud@localhost |
	+--------------------+
	1 row in set (0.00 sec)



### Create an Admin Account

After ownCloud is installed, and MySQL is configured, point your browser to `ip_address_or_domain/owncloud`. 

![owncloudlogin](/docs/assets/ownCloud/login.png)

Create an admin account, and click on the `Finish Setup` button. 

![ownCloudgreeting](/docs/assets/ownCloud/owncloud.png)

### Configure ownCloud

You should install [ClamAV](https://www.clamav.net/). The open source antivirus engine works with the antivirus plugin in ownCloud.

  apt install clamav clamav-daemon

The `clamav` package starts a daemon on your system. 

Enable the antivirus app in ownCloud:

![antivirus](/docs/assets/ownCloud/antivirus.png)

Configure your antivirus mode, in ownCloud, to reflect the changes to your system:

![socket](/docs/assets/ownCloud/owncloudsocket.png)

You can add new users through the Users menu:

![userpanel](/docs/assets/ownCloud/owncloudusers.png)

## Moving Forward

Now that ownCloud is installed and configured, you should secure your system. The official documentation has a well written section on hardening your system: [ownCloud Server Administration Manual](https://doc.owncloud.org/server/9.0/admin_manual/configuration_server/harden_server.html). This manual will cover everything from using HTTPS, to JavaScript Asset Managing.
