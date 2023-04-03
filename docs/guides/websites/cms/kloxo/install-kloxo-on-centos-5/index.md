---
slug: install-kloxo-on-centos-5
description: 'This guide shows how to install Kloxo, the free web-based server control panel alternative to cPanel and Plesk, on a server running CentOS 5.'
keywords: ["kloxo", "control panel", "cpanel", "plesk"]
tags: ["centos","cms"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/websites/cms/kloxo/install-kloxo-on-centos-5/','/web-applications/control-panels/kloxo/installation/','/websites/cms/install-kloxo-on-centos-5/']
modified: 2013-10-03
modified_by:
  name: Linode
published: 2011-10-31
title: Install Kloxo on CentOS 5
deprecated: true
authors: ["Linode"]
---

Kloxo is a web-based control panel that is a free alternative to options such as cPanel and Plesk. At this time, Kloxo only supports 32 bit systems. If you would like to use Kloxo on a 64 bit system, you can follow the documentation [listed on their GitHub page](https://github.com/lxcenter/kloxo).

## Initial Setup

Before getting started, you'll need to make sure that your [hostname](/docs/products/platform/get-started/#setting-the-hostname) has been properly set and that [static networking](/docs/products/compute/compute-instances/guides/manual-network-configuration/) has been configured **even if you only have one IP address**. You will also need to install MySQL. To do so, issue the following commands:

    yum update
    yum install mysql-server
    /etc/init.d/mysqld start

Secure the installation by running the following command and answering the prompts:

    /usr/bin/mysql_secure_installation

## Installation

This guide assumes that you would like your instance of Kloxo to be the master node. You will be downloading the master installation script.

Download and run the script, making sure to pass your MySQL root password to it. Replace "mypassword" in the example below with your MySQL root password.

    wget http://download.lxcenter.org/download/kloxo/production/kloxo-install-master.sh
    chmod +x kloxo-install-master.sh
    sh ./kloxo-install-master.sh --db-rootpassword=mypassword

Follow the instructions and prompts on the screen in order to complete the installation.

Once the script has finished, you can reach your new Kloxo installation by navigating to `https://12.34.56.78:7777`, where `12.34.56.78` is your Linode's IP address. The installation can also be accessed at `http://12.34.56.78:7778`. Please note that port `7778` does **not** use SSL and traffic including passwords and customer data will be sent unencrypted. Use a username of "admin" and a password of "admin" to log in for the first time. You will be forced to change your password after logging in for the first time.

After you have installed Kloxo, you may receive a few warnings. Click the errors at the top of the screen and follow the steps outlined on screen to resolve the issues.

Congratulations on your new Kloxo installation!



