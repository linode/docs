---
slug: power-team-collaboration-with-egroupware-on-fedora-13
title: Power Team Collaboration with EGroupware on Fedora 13
description: 'This guide shows how you can build a collaborative groupware system to share information in your organization with the EGroupware software on Fedora 13.'
authors: ["Linode"]
contributors: ["Linode"]
published: 2010-09-16
modified: 2013-10-04
keywords: ["groupware", "email", "collaboration", "fedora"]
tags: ["fedora", "email", "lamp"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/applications/project-management/power-team-collaboration-with-egroupware-on-fedora-13/','/web-applications/project-management/egroupware/fedora-13/']
relations:
    platform:
        key: collaborate-with-egroupware
        keywords:
            - distribution: Fedora 13
deprecated: true
---

The EGroupware suite provides a group of server-based applications that offer collaboration and enterprise-targeted tools to help enable communication and information sharing between teams and institutions. These tools are tightly coupled and allow users to take advantage of data from one system, like the address book, and make use of it in other systems including the calendar, CRM, and email systems. EGroupware is designed to be flexible and adaptable, and is capable of scaling to meet the demands of a diverse class of enterprise needs and work groups without the need to rely on a third-party vendor.

Before installing EGroupware, it is assumed that you have followed our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/). If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/guides/introduction-to-linux-concepts/), [beginner's guide](/docs/products/compute/compute-instances/faqs/) and [administration basics guide](/docs/guides/linux-system-administration-basics/). Additionally, you will need install a [LAMP stack](/docs/guides/how-to-install-lamp-stack-on-fedora-alma-rocky-linux/) as a prerequisite for installing EGroupware.

## Install EGroupware

In this guide, you will be installing EGroupware from the packages provided by the EGroupware project and built by the openSUSE build service for Fedora 13. Begin the installation by issuing the following commands to initialize the EGroupware repositories:

    yum update
    yum install wget
    cd /etc/yum.repos.d/
    wget http://download.opensuse.org/repositories/server:/eGroupWare/Fedora_13/server:eGroupWare.repo
    yum update

Now you can issue the following command to install the EGroupware package:

    yum install EGroupware

Congratulations, you've now installed EGroupware!

## Configure Access to EGroupware

The configuration options for EGroupware are located in the file `/etc/httpd/conf.d/egroupware`. Add the following line to your virtual hosting configuration:

{{< file "Apache Virtual Hosting Configuration" apache >}}
Alias /egroupware /usr/share/egroupware

{{< /file >}}


When inserted into the virtual hosting configuration for `example.com`, accessing the URL `http://example.com/egroupware/` will allow you to access your EGroupware site. If you do not have virtual hosting configured, EGroupware will be accessible at `/egroupware` of the default Apache host.

## Configure EGroupware

Before you begin the configuration of EGroupware, you need to ensure that a number of directories exist for use by EGroupware. Issue the following sequence of commands:

    mkdir -p /srv/www/example.com/backup
    mkdir -p /srv/www/example.com/tmp
    mkdir -p /srv/www/example.com/files
    chown apache:apache -R /srv/www/example.com/backup/
    chown apache:apache -R /srv/www/example.com/tmp
    chown apache:apache -R /srv/www/example.com/files

Visit `http://example.com/egroupware/setup/` in your web browser to begin the setup process presented by the EGroupware application. When you have completed the initial "Header Setup" process, select the option to write the "header" file and then continue to the "Setup/Admin." Ensure that you've selected the correct "Domain" if you configured more than one. At this juncture, you must install the EGroupware applications that you will expect to use. Select the proper character set and select the button to "'Install' all applications." You can now "Recheck" your installation. In the "Configuration" setup page, supply EGroupware with paths to the `backup/` `tmp/` and `files/` directory created above. Additionally, you will need to create an admin account for your EGroupware domain, which you can accomplish from this Setup Domain page.

When all applications have been installed, you will be provided with a number of options that you can use to fine-tune the operations and behavior of your EGroupware instance. If you wish to use EGroupware to help manage email, you will need to have a running email system.

## More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [EGroupware Home Page](http://www.egroupware.org/)
- [EGroupware Documentation](http://www.egroupware.org/wiki/)
- [EGroupware Applications](http://www.egroupware.org/applications)



