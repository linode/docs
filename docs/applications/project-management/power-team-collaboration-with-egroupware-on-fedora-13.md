---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Build a groupware system with eGroupware.'
keywords: ["groupware", "email", "collaboration", "fedora"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/project-management/egroupware/fedora-13/']
modified: 2013-10-04
modified_by:
  name: Linode
published: 2010-09-16
title: Power Team Collaboration with eGroupware on Fedora 13
---



The eGroupware suite provides a group of server-based applications that offer collaboration and enterprise-targeted tools to help enable communication and information sharing between teams and institutions. These tools are tightly coupled and allow users to take advantage of data from one system, like the address book, and make use of it in other systems including the calendar, CRM, and email systems. eGroupware is designed to be flexible and adaptable, and is capable of scaling to meet the demands of a diverse class of enterprise needs and work groups without the need to rely on a third-party vendor.

Before installing eGroupware, it is assumed that you have followed our [getting started guide](/docs/getting-started/). If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics). Additionally, you will need install a [LAMP stack](/content/lamp-guides/fedora-13/) as a prerequisite for installing eGroupware.

# Install eGroupware

In this guide, you will be installing eGroupware from the packages provided by the eGroupware project and built by the OpenSUSE build service for Fedora 13. Begin the installation by issuing the following commands to initialize the eGroupware repositories:

    yum update
    yum install wget
    cd /etc/yum.repos.d/
    wget http://download.opensuse.org/repositories/server:/eGroupWare/Fedora_13/server:eGroupWare.repo
    yum update

Now you can issue the following command to install the eGroupware package:

    yum install eGroupware

Congratulations, you've now installed eGroupware!

# Configure Access to eGroupware

The configuration options for eGroupware are located in the file `/etc/httpd/conf.d/egroupware`. Add the following line to your virtual hosting configuration:

{{< file-excerpt "Apache Virtual Hosting Configuration" apache >}}
Alias /egroupware /usr/share/egroupware

{{< /file-excerpt >}}


When inserted into the virtual hosting configuration for `example.com`, accessing the URL `http://example.com/egroupware/` will allow you to access your eGroupware site. If you do not have virtual hosting configured, eGroupware will be accessible at `/egroupware` of the default Apache host.

# Configure eGroupware

Before you begin the configuration of eGroupware, you need to ensure that a number of directories exist for use by eGroupware. Issue the following sequence of commands:

    mkdir -p /srv/www/example.com/backup
    mkdir -p /srv/www/example.com/tmp
    mkdir -p /srv/www/example.com/files
    chown apache:apache -R /srv/www/example.com/backup/
    chown apache:apache -R /srv/www/example.com/tmp
    chown apache:apache -R /srv/www/example.com/files

Visit `http://example.com/egroupware/setup/` in your web browser to begin the setup process presented by the eGroupware application. When you have completed the initial "Header Setup" process, select the option to write the "header" file and then continue to the "Setup/Admin." Ensure that you've selected the correct "Domain" if you configured more than one. At this juncture, you must install the eGroupware applications that you will expect to use. Select the proper character set and select the button to "'Install' all applications." You can now "Recheck" your installation. In the "Configuration" setup page, supply eGroupware with paths to the `backup/` `tmp/` and `files/` directory created above. Additionally, you will need to create an admin account for your eGroupware domain, which you can accomplish from this Setup Domain page.

When all applications have been installed, you will be provided with a number of options that you can use to fine-tune the operations and behavior of your eGroupware instance. If you wish to use eGroupware to help manage email, you will need to have a running email system.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [eGroupware Home Page](http://www.egroupware.org/)
- [eGroupware Documentation](http://www.egroupware.org/wiki/)
- [eGroupware Applications](http://www.egroupware.org/applications)



