---
author:
  name: Linode
  email: docs@linode.com
description: 'Manage your Linode with the Kloxo control panel on CentOS 5.'
keywords: ["kloxo", "control panel", "cpanel", "plesk"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/control-panels/kloxo/installation/']
modified: 2013-10-03
modified_by:
  name: Linode
published: 2011-10-31
title: Install Kloxo on CentOS 5
deprecated: true
---

Kloxo is a web-based control panel that is a free alternative to options such as cPanel and Plesk. At this time, Kloxo only supports 32 bit systems. If you would like to use Kloxo on a 64 bit system, you can follow the documentation [listed on their wiki page](http://wiki.lxcenter.org/Kloxo-64).

# Initial Setup

Before getting started, you'll need to make sure that your [hostname](/docs/getting-started#setting-the-hostname) has been properly set and that [static networking](/docs/networking/configuring-static-ip-interfaces) has been configured **even if you only have one IP address**. You will also need to install MySQL. To do so, issue the following commands:

    yum update
    yum install mysql-server
    /etc/init.d/mysqld start

Secure the installation by running the following command and answering the prompts:

    /usr/bin/mysql_secure_installation

# Installation

This guide assumes that you would like your instance of Kloxo to be the master node. You will be downloading the master installation script.

Download and run the script, making sure to pass your MySQL root password to it. Replace "mypassword" in the example below with your MySQL root password.

    wget http://download.lxcenter.org/download/kloxo/production/kloxo-install-master.sh
    chmod +x kloxo-install-master.sh
    sh ./kloxo-install-master.sh --db-rootpassword=mypassword

Follow the instructions and prompts on the screen in order to complete the installation.

Once the script has finished, you can reach your new Kloxo installation by navigating to `https://12.34.56.78:7777`, where `12.34.56.78` is your Linode's IP address. The installation can also be accessed at `http://12.34.56.78:7778`. Please note that port `7778` does **not** use SSL and traffic including passwords and customer data will be sent unencrypted. Use a username of "admin" and a password of "admin" to log in for the first time. You will be forced to change your password after logging in for the first time.

After you have installed Kloxo, you may receive a few warnings. Click the errors at the top of the screen and follow the steps outlined on screen to resolve the issues.

Congratulations on your new Kloxo installation!



