---
author:
    name: Linode
    email: docs@linode.com
description: 'Drush is a command line tool for creating, maintaining, and modifying Drupal websites. This guide will walk you through installing Drush on Ubuntu 18.04'
og_description: 'Drush is a command line tool for creating, maintaining, and modifying Drupal websites. This guide will walk you through installing Drush on Ubuntu 18.04'
keywords: ["drupal", "cms", "content management system", "content management framework", "ubuntu", "drush"]
aliases: ['websites/cms/drush-drupal/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-02-29
modified_by:
    name: Linode
published: 2020-02-29
title: How to Install Drush on Ubuntu 18.04
h1_title: Install Drush on Ubuntu 18.04
external_resources:
 - '[SSL Certificates](/docs/security/ssl/)'
 - '[Drush Documentation](http://docs.drush.org)'
---

Drush is a command line tool for creating, maintaining, and modifying Drupal websites. Command line tools, like Drush, add functionality through additional command packages. Once installed, Drush is as easy to use as any of the basic Linux commands. Drush rhymes with rush or crush. The name comes from combining the words Drupal and shell. Drush is designed only for Drupal and cannot be used with other content management systems.

Both new and experienced Drupal users can benefit from learning Drush. Users that have worked with a command line interface before have an advantage, but Drush is an excellent application for beginners, too.

## Before You Begin

Before installing Drush, ensure that the following prerequisites have been met:

1.  Create a new Linode by following our [Getting Started](/docs/getting-started/) guide.
2.  Address security concerns with the [Securing Your Server](/docs/securing-your-server) guide.
3.  Make sure that your system is up to date, using:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with ``sudo``. If you're not familiar with the ``sudo`` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install Git & Composer

The developers of Drush recommend installation through Composer, a PHP dependency manager. The Drush project is hosted on GitHub and controlled with Git, another necessary app to install.


1.  Install Git:

        sudo apt-get install git

2.  Install Composer:

        curl -sS https://getcomposer.org/installer | php

3.  Move the composer.phar file to `/usr/local/bin/`, so that it can be accessed from any directory:

        sudo mv composer.phar /usr/local/bin/composer

## Install Drush for All Users on the Server

Composer is designed to install PHP dependencies on a per-project basis, but the steps below will install a global Drush for all projects.

1.  Create a symbolic link between Composer's local bin directory, `/usr/local/bin/composer`, and the system's bin directory, `/usr/bin/`:

        sudo ln -s /usr/local/bin/composer /usr/bin/composer

2.  Use Git to download - or clone - the GitHub Drush project into a new directory:

        sudo git clone https://github.com/drush-ops/drush.git /usr/local/src/drush

3.  Change the working directory to the new Drush directory:

        cd /usr/local/src/drush

4.  Use Git to checkout the version of Drush that you wish to use. The release page is at [https://github.com/drush-ops/drush/releases](https://github.com/drush-ops/drush/releases).

    For a different release, replace the version number in the following command:

        sudo git checkout 9.7.2

5.  Create a symbolic link between the Drush directory in `/usr/local/src` to `/usr/bin`, so that the Drush command can be called from any directory:

        sudo ln -s /usr/local/src/drush/drush /usr/bin/drush

6.  Now, run the Composer install command:

        sudo composer install

7.  Drush has now been installed for all users on the server. Check for the proper version number:

        drush --version

## Install Drush for the Active User Only

You may want to install Drush for only certain users, for example, the **site owner**, **root**, and **www-data**. This may be optimal for a shared-hosting environment. Also, individual users can install their different versions of Drush and even install versions specific to a single project. The commands below should be run as the user in question, without `sudo`.

1.  Modify the user's `.bashrc` file to add the composer directory to it's path:

        nano ~/.bashrc

      {{< file "~/.bashrc" >}}
          export PATH="$HOME/.composer/vendor/bin:$PATH"

      {{< /file >}}


2.  Run **source** on `.bashrc` to enable the changes:

        source ~/.bashrc

3.  Install Drush:

        composer global require drush/drush:dev-master

    {{< note >}}
    To install a different version of Drush, replace `drush/drush:dev-master` with another version. For example, to install the stable release of Drush 6.x, use `drush/drush:9.*`. For more information, check out the [Drush GitHub](https://github.com/drush-ops/drush) repository.
    {{< /note >}}

4. Check to see that Drush was installed successfully:

        drush --version

## Using Drush

Drush has dozens of commands with hundreds of options. Drush can interface with MySQL, Drupal, Git, and more.

1.  To get started with Drush, run it without any following commands to list the help manual:

        drush

2.  View more detailed documentation for a specific command by typing `drush help` and then the command, for example:

        drush help site-install

3.  List many of the specs for your server and website with:

        drush status
