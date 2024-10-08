---
slug: power-team-collaboration-with-egroupware-on-debian-5-lenny
title: 'Power Team Collaboration with EGroupware on Debian 5 (Lenny)'
description: 'This guide shows how you can build a collaborative groupware system to share information in your organization with the EGroupware software on Debian 5 "Lenny".'
authors: ["Linode"]
contributors: ["Linode"]
published: 2010-01-26
modified: 2011-08-22
keywords: ["groupware", "email", "collaboration", "debian"]
tags: ["debian", "email", "lamp"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/web-applications/project-management/egroupware/debian-5-lenny/','/applications/project-management/power-team-collaboration-with-egroupware-on-debian-5-lenny/']
relations:
    platform:
        key: collaborate-with-egroupware
        keywords:
            - distribution: Debian 5
deprecated: true
---

The EGroupware suite provides a group of server-based applications that offer collaboration and enterprise-targeted tools to help enable communication and information sharing between teams and institutions. These tools are tightly coupled and allow users to take advantage of data from one system, like the address book, and make use of it in other systems, including the calendar, CRM, and email systems. EGroupware is designed to be flexible and adaptable, and is capable of scaling to meet the demands of a diverse class of enterprise needs and work groups, all without the need to rely on a third-party vendor. As EGroupware provides its applications entirely independent of any third party service, the suite is a good option for organizations who need web-based groupware solutions, but do not want to rely on a third party provider for these services.

Before installing EGroupware we assume that you have followed our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/). If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/guides/introduction-to-linux-concepts/), [beginner's guide](/docs/products/compute/compute-instances/faqs/) and [administration basics guide](/docs/guides/linux-system-administration-basics/). Additionally, you will need install a [LAMP stack](/docs/guides/how-to-install-a-lamp-stack-on-debian-11/) as a prerequisite for installing EGroupware. You may also want to use EGroupware to help manage email, and will need to have a running email system. Consider running [Postfix with Courier and MySQL](/docs/guides/email-with-postfix-courier-and-mysql-on-debian-5-lenny/).

## Install EGroupware

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

In this guide we will be installing EGroupware from the packages provided by the Debian project. Although there are some slightly more contemporary versions of EGroupware available from upstream sources, we've chosen to install using this method in an effort to ensure greater stability, easy upgrade paths, and a more straight forward installation process. Begin the installation by issuing the following command:

    apt-get install egroupware

During the installation process, an interactive "package configuration" is provided by Debian's `debconf` system. This provides a URL to access the setup utility after you've finished the installation process. Make note of the URL, the form is `http://example/egroupware/setup/` where `example` is the hostname of the system. Continue with the installation process.

The `debconf` process creates an administrator account, which it allows you to specify at this time. By default this EGroupware username is "admin." Change the username, if you like, and create a password as instructed. When this process is complete, the installation process is finished. You will also want to issue the following commands to install additional dependencies and resolve several minor issues with the distribution package in order:

    pear install Auth_SASL
    rm /usr/share/egroupware/etemplate/doc
    cp -R /usr/share/doc/egroupware-etemplate/ /usr/share/egroupware/etemplate/doc
    rm /usr/share/egroupware/sitemgr/doc
    cp -R /usr/share/doc/egroupware-sitemgr/ /usr/share/egroupware/sitemgr/doc

Congratulations, you've now installed EGroupware!

## Configure Access to EGroupware

If you do not have any virtual hosts enabled and your domain is `example.com`, you should be able to visit `http://example.com/egroupware/setup` to access the remainder of the EGroupware setup provided that `example.com` points to the IP of your server. However, if you have virtual hosting setup, you will need to issue the following command to create a symbolic link to EGroupware:

    ln -s /usr/share/egroupware/ /srv/www/example.com/public_html/egroupware

Replace `/srv/example.com/public_html/` with the path to your virtual host's `DocumentRoot`, or other location within the `DocumentRoot` where you want EGroupware to be located. Then, visit `http://example.com/egroupware/setup/` to complete the setup process. You will be prompted for a password then brought to a configuration interface. Review the settings and modify them to reflect the specifics of your deployment, particularly the database settings. Do not forget to create an administrative user for the database instance you are creating. When you have completed the EGroupware configuration, select the "'Write' Configuration file" option. Continue to the "Login" page.

## Configure EGroupware

When you have completed the initial "Header Setup," select the option to write the "header" file and then continue to the "Setup/Admin." Ensure that you've selected the correct "Domain" if you configured more than one. At this juncture you must install the EGroupware applications that you will expect to use. Select the proper character set and select the button to "'Install' all applications." You can now "Recheck" your installation. Supply EGroupware with the configuration for your email server. Additionally, you will need to create an admin account for your EGroupware domain, which you can accomplish from this page.

When all applications have been installed, you will be provided with a number of options that you can use to fine-tune the operations and behavior of your EGroupware instance. You've now successfully installed and configured EGroupware!

## More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [EGroupware Home Page](http://www.egroupware.org/)
- [EGroupware Documentation](http://www.egroupware.org/wiki/)
- [EGroupware Applications](http://www.egroupware.org/applications)



