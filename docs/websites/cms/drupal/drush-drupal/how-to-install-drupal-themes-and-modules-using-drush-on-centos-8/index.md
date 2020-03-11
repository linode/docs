---
author:
    name: Linode
    email: docs@linode.com
description: 'Using Drush to install themes, modules, and backup systems'
keywords: ["drupal", "WordPress", "joomla", "cms", "content management system", "content management framework", "centos", "drush"]
aliases: ['websites/cms/themes-modules-backups-drupal-drush-on-debian-7/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2014-12-05
modified_by:
    name: Linode
published: 2014-12-05
title: How to Install Themes, and Modules on CentOS 8
h1_title: Install Themes, and Modules on CentOS 8
external_resources:
 - '[SSL Certificates](/docs/security/ssl/)'
 - '[Drush Commands](https://docs.drush.org/en/9.x/)'
 - '[Backup and Migrate](https://www.drupal.org/docs/8/modules/backup-and-migrate/howto-for-backup-and-migrate)'
---

Drush is a command line tool, which can be used for various Drupal projects. This tutorial uses Drush to install themes, modules, and covering some basic administration tasks such as backup and migrate for Drupal websites.

Linode has another guide for installing Drush and creating a Drupal website, [Install Drupal using Drush on CentOS 8](/docs/websites/cms/drupal/drush-drupal/how-to-install-drupal-using-drush-on-centos-8). Depending on your experience level with Drush, you may want to start with that guide.

## Before You Begin

Before installing themes, modules, and a backup system with Drush, make sure that the following prerequisites have been met:

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for [setting your Linode's hostname](/docs/getting-started/#set-the-hostname) and [timezone](/docs/getting-started/#set-the-timezone).

1. Follow our [Securing Your Server](/docs/security/securing-your-server) guide to [create a standard user account](/docs/security/securing-your-server/#add-a-limited-user-account), [harden SSH access](/docs/security/securing-your-server/#harden-ssh-access), [remove unnecessary network services](/docs/security/securing-your-server/#remove-unused-network-facing-services) and [create firewall rules](/docs/security/securing-your-server/#configure-a-firewall) for your web server; you may need to make additional firewall exceptions for your specific application.

    {{< content "limited-user-note-shortguide" >}}

3.  Install and configure a [LAMP stack on CentOS 8](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-centos-8)

4.  Install [Composer and Drush on CentOS 8](/docs/websites/cms/drupal/drush-drupal/how-to-install-drush-on-centos-8)


5.  Make sure that your system is up to date, using:

        sudo yum update


{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with ``sudo``. If you're not familiar with the ``sudo`` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

{{< note >}} The drush commands to download or enable themes, and modules depend on the version of drush that you have installed. This guide uses Drush 9.
{{< /note >}}

## Installing Themes with Drush

Downloading, enabling, and setting the theme is extremely easy with Drupal Drush.

1.  Find a theme to download. The drush download name is usually appended at the end of `drupal.org/project/project_theme` theme page. Spaces are either removed or replaced with an underscore. For example, the theme "ZURB Foundation" would have the download name `zurb_foundation` appended to the URL of the theme page.

2. Navigate to `var/www/html/example.com/public_html/` and download the theme. For example to download `bootstrap` theme use:
         cd /var/www/html/example.com/public_html
         sudo composer require drupal/bootstrap

3.  Enable the theme that you downloaded. For example, to enable `bootstrap` theme:

        drush theme:enable bootstrap

4.  Set Corporate Clean as the default, active theme:

        drush config-set system.theme default omega

    Check the homepage of your site and the new theme should appear.

## Installing Modules with Drush

Downloading and enabling a module is similar to working with a theme. However, modules can be used for almost any purpose. From enhancing public-facing functionality to providing a better administrative UI, there are thousands of Drupal modules. Try to find modules with clear documentation. Once installed, the browser interface can still be challenging.

1.  To download a very useful module `backup_migrate`, that enables you to perform the backup, restore, and migrate tasks:

        sudo composer require drupal/backup_migrate

2.  To enable `backup_migrate` module:

        drush en backup_migrate -y

3.  Sign in to the Drupal browser interface and navigate to Extend (or Administration > Extend) and **Backup and Migrate** module will be listed and selected under **OTHER** section.

You have successfully installed and turned on a new module. The module is now running and ready to be used.

## Backup a Drupal Site

It's always important to keep regular backups of a website. Backups protect you from losing data due to configuration changes, vulnerabilities, or system failures. Backups should be stored on a separate system whenever possible. The **Backup and Migrate** module helps you to create backups of your site.

1.  To configure backup and migrate, navigate to **Administration > Configuration > Development > Backup and Migrate**

2. For a quick backup select the type of **Backup Source** and select the **Backup Destination**, and click **Backup now**

     Always download a backup prior to updating or installing modules.

## Next Steps

This guide was part of a series that created a Drupal site from start to finish on Linode. Your server is complete. Now that everything is installed, master the Drupal interface, Drupal modules, and themes. Create a stunning site for the world to see.
