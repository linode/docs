---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Build a groupware system with eGroupware on Ubuntu 9.10 (Karmic).'
keywords: ["groupware", "email", "collaboration", "ubuntu", "karmic"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/project-management/egroupware/ubuntu-9-10-karmic/']
modified: 2011-08-22
modified_by:
  name: Linode
published: 2010-02-01
title: 'Power Team Collaboration with eGroupware on Ubuntu 9.10 (Karmic)'
---

The eGroupware suite provides a group of server-based applications that offer collaboration and enterprise-targeted tools to help enable communication and information sharing between teams and institutions. These tools are tightly coupled and allow users to take advantage of data from one system, like the address book, and make use of it in other systems, including the calendar, CRM, and email systems. eGroupware is designed to be flexible and adaptable, and is capable of scaling to meet the demands of a diverse class of enterprise needs and work groups, all without the need to rely on a third-party vendor. As eGroupware provides its applications entirely independent of any third party service, the suite is a good option for organizations who need web-based groupware solutions, but do not want to rely on a third party provider for these services.

Before installing eGroupware, we assume that you have followed our [getting started guide](/docs/getting-started/). If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics). Additionally, you will need install a [LAMP stack](/content/lamp-guides/ubuntu-9-10-karmic/) as a prerequisite for installing eGroupware.

# Install eGroupware

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

In this guide we will be installing eGroupware from the packages provided by the Ubuntu community. Although there are some slightly more contemporary versions of eGroupware available from upstream sources, we've chosen to install using this method in an effort to ensure greater stability, easy upgrade paths, and a more straight forward installation process. Before we begin the installation, we must enable the "universe" repositories for Ubuntu 9.10. Uncomment the following lines from `/etc/apt/sources.list` to make these repositories accessible:

{{< file-excerpt "/etc/apt/sources.list" >}}
deb http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe

deb http://security.ubuntu.com/ubuntu karmic-security universe
deb-src http://security.ubuntu.com/ubuntu karmic-security universe

{{< /file-excerpt >}}


Issue the following command to update your local package database:

    apt-get update

Finally, begin the installation by issuing the following command:

    apt-get install egroupware

During the installation process, an interactive "package configuration" is provided by Ubuntu's `debconf` system. This provides a URL to access the setup utility after you've finished the installation process. Make note of the URL; the form is `http://example/egroupware/setup/` where `example` is the hostname of the system. Continue with the installation process.

The `debconf` process creates an administrator account for the "header system", which it allows you to specify at this time. By default this eGroupware username is "admin". Change the username if you would like and create a password as instructed. When this process is complete, the installation process is finished. You will also want to issue the following commands to install additional dependencies and resolve several minor issues with the distribution package in order:

    pear install Auth_SASL
    rm /usr/share/egroupware/etemplate/doc
    cp -R /usr/share/doc/egroupware-etemplate/ /usr/share/egroupware/etemplate/doc
    rm /usr/share/egroupware/sitemgr/doc
    cp -R /usr/share/doc/egroupware-sitemgr/ /usr/share/egroupware/sitemgr/doc
    rm /usr/share/egroupware/sitemgr-link
    cp /usr/share/egroupware/sitemgr/sitemgr-link.php /usr/share/egroupware/sitemgr/sitemgr-link

Additionally edit your `/etc/php5/apach2/php.ini` file to include the following line:

{{< file-excerpt "/etc/php5/apache2/php.ini" ini >}}
mbstring.func_overload = 7

{{< /file-excerpt >}}


Congratulations, you've now installed eGroupware!

# Configure Access to eGroupware

If you do not have any virtual hosts enabled and your domain is `example.com`, you should be able to visit `http://example.com/egroupware/setup` to access the remainder of the eGroupware setup provided that `example.com` points to the IP of your Linode. However, if you have virtual hosting setup, you will need to issue the following command to create a symbolic link to eGroupware:

    ln -s /usr/share/egroupware/ /srv/www/example.com/public_html/egroupware

Replace `/srv/example.com/public_html/` with the path to your virtual host's `DocumentRoot`, or other location within the `DocumentRoot` where you want eGroupware to be located. Then, visit `http://example.com/egroupware/setup/` to complete the setup process. You will be prompted for a password then brought to a configuration interface. Review the settings and modify them to reflect the specifics of your deployment, and create an "eGW Database Instance" for your deployment. Do not forget to create an administrative user for the database instance you are creating. When you have completed the eGroupware configuration, select the "'Write' Configuration file" option. Continue to the "Login" page.

# Configure eGroupware

When you have completed the initial "Header Setup," select the option to write the "header" file and then continue to the "Setup/Admin." Ensure that you've selected the correct "Domain" if you configured more than one. At this juncture you must install the eGroupware applications that you will expect to use. Select the proper character set and then select the button to "'Install' all applications." You can now "Recheck" your installation. Supply eGroupware with the configuration for your email server. Additionally, you will need to create an admin account for your eGroupware domain, which you can accomplish from this page.

When all applications have been installed, you will be provided with a number of options that you can use to fine-tune the operations and behavior of your eGroupware instance. If you wish to use eGroupware to help manage email, you will need to have a running email system. Consider running [Postfix with Courier and MySQL](/docs/email/postfix/courier-mysql-ubuntu-9-10-karmic).

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [eGroupware Home Page](http://www.egroupware.org/)
- [eGroupware Documentation](http://www.egroupware.org/wiki/)
- [eGroupware Applications](http://www.egroupware.org/applications)



