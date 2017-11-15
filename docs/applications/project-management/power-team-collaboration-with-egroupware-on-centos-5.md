---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Build a groupware system with eGroupware.'
keywords: ["groupware", "email", "collaboration", "centos"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/project-management/egroupware/centos-5/']
modified: 2011-08-22
modified_by:
  name: Linode
published: 2010-02-03
title: Power Team Collaboration with eGroupware on CentOS 5
external_resources:
 - '[eGroupware Home Page](http://www.egroupware.org/)'
 - '[eGroupware Documentation](http://www.egroupware.org/wiki/)'
 - '[eGroupware Applications](http://www.egroupware.org/applications)'
---

The eGroupware suite provides a group of server-based applications that offer collaboration and enterprise-targeted tools to help enable communication and information sharing between teams and institutions. These tools are tightly coupled and allow users to take advantage of data from one system, like the address book, and make use of it in other systems, including the calendar, CRM, and email systems. eGroupware is designed to be flexible and adaptable, and is capable of scaling to meet the demands of a diverse class of enterprise needs and work groups, all without the need to rely on a third-party vendor. As eGroupware provides its applications entirely independent of any third party service, the suite is a good option for organizations who need web-based groupware solutions, but do not want to rely on a third party provider for these services.

Before installing eGroupware, we assume that you have followed our [getting started guide](/docs/getting-started/). If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).Additionally, you will need install a [LAMP stack](/content/lamp-guides/centos-5) as a prerequisite for installing eGroupware.

## Install eGroupware

In this guide, we will be installing eGroupware from the packages provided by the eGroupware project and built by the OpenSUSE build service for CentOS 5. We've chosen to install using this method in an effort to ensure greater stability, easy upgrade paths, and a more straight forward installation process. Begin the installation by issuing the following commands to initialize the eGroupware repositories:

    yum update
    yum install wget
    cd /etc/yum.repos.d/
    wget http://download.opensuse.org/repositories/server:/eGroupWare/CentOS_5/server:eGroupWare.repo
    yum update

Now you can issue the following command to install eGroupware and other required packages:

    yum install eGroupware mysql-server

Congratulations, you've now installed eGroupware!

## Configure Access to eGroupware

The configuration options for eGroupware are located in the file `/etc/httpd/conf.d/egroupware`. Add the following line to your virtual hosting configuration:

{{< file-excerpt "Apache Virtual Hosting Configuration" apache >}}
Alias /egroupware /usr/share/egroupware

{{< /file-excerpt >}}


When inserted into the virtual hosting configuration for `example.com`, accessing the URL `http://example.com/egroupware/` will allow you to access your eGroupware site. If you do not have virtual hosting configured, eGroupware will be accessible at `/egroupware` of the default Apache host.

Before continuing with the installation of eGroupware, issue the following commands to start the webserver and database server for the first time. Furthermore the `chkconfig` commands will ensure that these services are initiated following reboots:

    /etc/init.d/httpd start
    /etc/init.d/mysqld start
    chkconfig mysqld on
    chkconfig httpd on

## Configure eGroupware

Before we begin the configuration of eGroupware, we need to ensure that a number of directories exist for use by eGroupware. Issue the following sequence of commands:

    mkdir -p /srv/www/example.com/backup
    mkdir -p /srv/www/example.com/tmp
    mkdir -p /srv/www/example.com/files
    chown apache:apache -R /srv/www/example.com/backup/
    chown apache:apache -R /srv/www/example.com/tmp
    chown apache:apache -R /srv/www/example.com/files

Visit `http://example.com/egroupware/setup/` in your web browser to begin the setup process presented by the eGroupware application. When you have completed the initial "Header Setup" process, select the option to write the "header" file and then continue to the "Setup/Admin." Ensure that you've selected the correct "Domain" if you configured more than one. At this juncture, you must install the eGroupware applications that you will expect to use. Select the proper character set and select the button to "'Install' all applications." You can now "Recheck" your installation. In the "Configuration" setup page, supply eGroupware with paths to the `backup/` `tmp/` and `files/` directory created above. Additionally, you will need to create an admin account for your eGroupware domain, which you can accomplish from this Setup Domain page.

When all applications have been installed, you will be provided with a number of options that you can use to fine-tune the operations and behavior of your eGroupware instance. If you wish to use eGroupware to help manage email, you will need to have a running email system.
