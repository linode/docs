---
slug: how-to-install-drush-on-ubuntu-18-04
author:
    name: Linode
    email: docs@linode.com
description: 'Drush is a command line tool for creating, maintaining, and modifying Drupal websites. This guide will walk you through installing Drush on Ubuntu 18.04'
og_description: 'Drush is a command line tool for creating, maintaining, and modifying Drupal websites. This guide will walk you through installing Drush on Ubuntu 18.04'
keywords: ["drupal", "cms", "content management system", "content management framework", "ubuntu", "drush"]
aliases: ['/websites/cms/drupal/how-to-install-drush-on-ubuntu-18-04/','/websites/cms/drupal/drush-drupal/how-to-install-drush-on-ubuntu-18-04/','/websites/cms/drush-drupal/']
tags: ["drupal","ubuntu","cms","lamp"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-02-29
modified_by:
    name: Linode
published: 2020-02-29
title: How to Install Drush on Ubuntu 18.04
h1_title: Install Drush on Ubuntu 18.04
image: Drush_onUbuntu1804.png
external_resources:
 - '[Drush Documentation](https://docs.drush.org/en/master/)'
 - '[Composer Documentation](https://getcomposer.org/doc/)'
relations:
    platform:
        key: how-to-install-drush
        keywords:
           - distribution: Ubuntu 18.04
---

[Drush](https://www.drush.org/) is a command line tool for creating, administrating, and modifying Drupal websites. Command line tools, like Drush, add functionality through additional command packages. Once installed, Drush is as easy to use as any of the basic Linux commands. The name comes from combining the words Drupal and shell. Drush is designed only for Drupal and cannot be used with other content management systems.

Both new and experienced Drupal users can benefit from learning Drush. Users that have worked with a command line interface before have an advantage, but Drush is an excellent application for beginners, too.

## Before You Begin

Before installing Drush, ensure that the following prerequisites have been met:

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  Install and configure a [LAMP stack on Ubuntu 18.04](/docs/guides/how-to-install-a-lamp-stack-on-ubuntu-18-04/)

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with ``sudo``. If you're not familiar with the ``sudo`` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install Git & Composer

The developers of Drush recommend installing Drush using [Composer](https://getcomposer.org/doc/00-intro.md), a PHP dependency manager. Since the Drush project is hosted on [GitHub](https://github.com/) and controlled with [Git](/docs/guides/how-to-configure-git/), you will also need to install Git. In this section, you will install both dependencies.

1.  Install Git:

        sudo apt-get install git

1.  Install Composer:

        curl -sS https://getcomposer.org/installer | php

1.  Move the composer.phar file to `/usr/local/bin/`, so that it can be accessed from any directory:

        sudo mv composer.phar /usr/local/bin/composer

1. Composer has a few PHP dependencies it needs in order to run. Install them on your Ubuntu system:

        sudo apt-get install php-xml, zip

## Install Drush Globally

Composer is designed to install PHP dependencies on a per-project basis. The steps below will install a global Drush for all projects. If you want to install Drush for a specific system user, skip to the [Install Drush for a Limited User Account](#install-drush-for-a-limited-user-account) section.

1.  Create a symbolic link between Composer's local bin directory, `/usr/local/bin/composer`, and the system's bin directory, `/usr/bin/`:

        sudo ln -s /usr/local/bin/composer /usr/bin/composer

1.  Use Git to download - or [clone](/docs/development/version-control/how-to-install-git-and-clone-a-github-repository/#clone-a-github-test-repository) - the [GitHub Drush project](https://github.com/drush-ops/drush) into a new directory, `/usr/local/src/drush`:

        sudo git clone https://github.com/drush-ops/drush.git /usr/local/src/drush

1.  Change the working directory to the new Drush directory:

        cd /usr/local/src/drush

1.   Use Git to checkout the version of Drush that you wish to use. View the GitHub project's [releases page](https://github.com/drush-ops/drush/releases) to view all available versions.

    For a different release, replace the version number, `10.2.2`, in the following command:

        sudo git checkout 10.2.2

1.  Create a symbolic link between the Drush directory in `/usr/local/src` to `/usr/bin`, so that the Drush command can be called from any directory:

        sudo ln -s /usr/local/src/drush/drush /usr/bin/drush

1.  Now, run the Composer install command:

        sudo composer install

1.  Drush has now been installed for all users on your Linode. To verify the installation, check Drush's version number.

        drush --version

    You should see a similar output:

    {{< output >}}
Drush Commandline Tool 10.2.2
    {{</ output >}}

## Install Drush for a Limited User Account

You may want to install Drush for only certain system users, for example, the **site admin** or the Apache webserver. This option may be optimal for a shared-hosting environment. Also, this allows individual users to install different versions of Drush and even install separate versions specific to a single project. Ensure you run the commands from the limited user account's home directory. Before you complete this section, ensure you have completed the steps in the [Install Git & Composer](#install-git-composer) section of the guide.

1.  Install Drush using Composer:

        composer require drush/drush

    This will install Drush in your `~/vendor/bin/drush` directory.

1.  Using the text editor of your choice, edit the user's `.bashrc` file to add the `vendor` directory to your path:

      {{< file "~/.bashrc" >}}
export PATH="$HOME/vendor/bin:$PATH"
      {{< /file >}}

1.  Run the `source` command on the `.bashrc` file to enable the changes:

        source ~/.bashrc

1. Check to see that Drush was installed successfully:

        drush --version

    {{< note >}}
You can install the [Drush Launcher](https://github.com/drush-ops/drush-launcher), a utility to be able to call Drush globally. This program listens on your `$PATH` and hands control to a site-local Drush that is in the `~/vendor` directory.
    {{</ note >}}

## Using Drush

Drush has dozens of [commands](https://www.drupal.org/docs/8/modules/d8-rules-essentials/for-developers/tools/drush-commands) with hundreds of options. Drush can interface with MySQL, Drupal, Git, and more. Below are a few examples of some useful Drush commands to get you started. Refer to the [Drush Commands](https://www.drupal.org/docs/8/modules/d8-rules-essentials/for-developers/tools/drush-commands) documentation for more details.

1. To get started with Drush, run it without any following commands to list the help manual:

        drush

1. View more detailed documentation for a specific command by typing `drush help` and then the command, for example:

        drush help site-install

1. List many of the specs for your server and website with:

        drush status
