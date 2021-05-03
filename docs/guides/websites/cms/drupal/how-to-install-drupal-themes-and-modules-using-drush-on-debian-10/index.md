---
slug: how-to-install-drupal-themes-and-modules-using-drush-on-debian-10
author:
    name: Linode
    email: docs@linode.com
description: 'Use Drush to install and enable themes and modules on your Drupal site running on Debian 10.'
og_description: 'Use Drush to install and enable themes and modules on your Drupal site running on Debian 10.'
keywords: ["drupal", "cms", "content management system", "content management framework", "debian", "drush"]
tags: ["drupal","lamp","cms","debian"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-03-11
modified_by:
    name: Linode
published: 2014-12-05
title: How to Install Drupal Themes and Modules Using Drush on Debian 10
h1_title: Install Drupal Themes and Modules Using Drush on Debian 10
image: DrupalThemesMods_DrushDeb10.png
external_resources:
 - '[SSL Certificates](/docs/security/ssl/)'
 - '[Drush Commands](https://docs.drush.org/en/9.x/)'
 - '[Backup and Migrate](https://www.drupal.org/docs/8/modules/backup-and-migrate/howto-for-backup-and-migrate)'
relations:
    platform:
        key: how-to-install-drupal-themes
        keywords:
           - distribution: Debian 10
aliases: ['/websites/cms/drupal/drush-drupal/how-to-install-drupal-themes-and-modules-using-drush-on-debian-10/','/websites/cms/drupal/how-to-install-drupal-themes-and-modules-using-drush-on-debian-10/']
---

Drush is a command line tool, which can be used for various Drupal projects. This tutorial uses Drush to install themes, modules, and covering some basic administration tasks such as backup and migrate for Drupal websites.

Linode has another guide for installing Drush and creating a Drupal website, [Install Drupal using Drush on Debian 10](/docs/websites/cms/drupal/drush-drupal/how-to-install-drupal-using-drush-on-debian-10). Depending on your experience level with Drush, you may want to start with that guide.

## Before You Begin

Before installing themes, modules, and a backup system with Drush, make sure that the following prerequisites have been met:

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for [setting your Linode's hostname](/docs/getting-started/#set-the-hostname) and [timezone](/docs/getting-started/#set-the-timezone).

1. Follow our [Securing Your Server](/docs/security/securing-your-server) guide to [create a standard user account](/docs/security/securing-your-server/#add-a-limited-user-account), [harden SSH access](/docs/security/securing-your-server/#harden-ssh-access), [remove unnecessary network services](/docs/security/securing-your-server/#remove-unused-network-facing-services) and [create firewall rules](/docs/security/securing-your-server/#configure-a-firewall) for your web server; you may need to make additional firewall exceptions for your specific application.

    {{< content "limited-user-note-shortguide" >}}

1.  Install and configure a [LAMP stack on Debian 10](/docs/web-servers/lamp/how-to-install-a-lamp-stack-on-debian-10)

1.  Install [Composer and Drush on Debian 10](/docs/websites/cms/drupal/drush-drupal/how-to-install-drush-on-debian-10)


1.  Make sure that your system is up to date, using:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
The Drush commands to download or enable themes and modules vary depending on the version of Drush that you have installed. This guide uses Drush 10.
{{< /note >}}

## Installing Themes with Drush

In this section you will download, enable, and set a Drupal theme using Drush.

1. Navigate to [Drupal's Download and Extend page](https://www.drupal.org/project/project_theme) to find the theme you want to download. The Drush download name is usually appended to the end of the Drupal theme page's URL; for example, `drupal.org/project/project/my_theme`.

1. Move into your Drupal site's document root, `/var/www/html/example.com/public_html/`. Replace `example.com` with your own domain's name.

        cd /var/www/html/example.com/public_html

1.  Download your desired theme using [Composer](https://getcomposer.org/doc/). For example to download the `bootstrap` theme use:

         composer require drupal/bootstrap

    {{< note >}}
If you receive an error related to not being able to write to the `composer.json` file, see the [Setting the Site’s Ownership and Permissions](/docs/websites/cms/drupal/drush-drupal/how-to-install-drupal-using-drush-on-debian-10/#setting-the-site-s-ownership-and-permissions) section of the [Install Drupal using Drush on Debian 10](/docs/websites/cms/drupal/drush-drupal/how-to-install-drupal-using-drush-on-debian-10/) guide.

Ensure that your `/var/www/html/example.com/public_html` directory has user and group read, write, and execute permissions.

    sudo chmod 774 -R /var/www/html/example.com/public_html
    {{</ note >}}

1.  Enable the theme that you downloaded in the previous step. For example, to enable the `bootstrap` theme run the following command. Replace `bootstrap` with the name of your theme.

        drush theme:enable bootstrap

1.  As an example, set the [Omega](https://www.drupal.org/project/omega) theme as the default and active theme:

        drush config-set system.theme default omega

    Check the homepage of your site and the new theme should appear.

## Installing Modules with Drush

Downloading and enabling a module is similar to working with a theme. However, modules can be used for almost any purpose. From enhancing public-facing functionality to providing a better administrative UI; there are thousands of Drupal modules. It is helpful to use modules with clear documentation, since once a module is installed, its interface can be challenging to use if it is not well documented and designed by the contributor.

1. Move into your Drupal site's document root, `/var/www/html/example.com/public_html/`. Replace `example.com` with your own domain's name.

        cd /var/www/html/example.com/public_html

1. Download the [Backup and Migrate](https://www.drupal.org/project/backup_migrate) module. This module enables you to perform the backup, restore, and migrate tasks

        composer require drupal/backup_migrate

1.  Enable the `backup_migrate` module:

        drush en backup_migrate -y

1.  Sign in to your Drupal site's browser interface and navigate to the **Extend** menu item (or **Administration > Extend**). Under the **OTHER** section, the Backup and Migrate module will be listed and selected.

You have successfully installed and enabled a new module. The module is now running and ready to be used.

## Backup a Drupal Site

It's always important to keep regular backups of a website. Backups protect you from losing data due to configuration changes, vulnerabilities, or system failures. Backups should be stored on a separate system whenever possible. The **Backup and Migrate** module helps you to create backups of your site.

1.  To configure backup and migrate, navigate to **Administration > Configuration > Development > Backup and Migrate**

1. For a quick backup, select the type of **Backup Source** and select the **Backup Destination**, and click **Backup now**

{{< note >}}
Always download a backup prior to updating or installing modules.
{{</ note >}}
