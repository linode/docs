---
author:
    name: Linode
    email: docs@linode.com
description: 'An overview of Drush the Drupal Shell or Command Line Tool'
keywords: ["drupal", "WordPress", "joomla", "cms", "content management system", "content management framework", " debian", " "]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2014-11-21
modified_by:
    name: Linode
published: 2014-11-21
title: 'Installing & Using Drupal Drush on Debian 7'
external_resources:
 - '[SSL Certificates](/docs/security/ssl/)'
---

Drush is a command line tool for creating, maintaining, and modifying Drupal websites. Command line tools, like Drush, add functionality through additional command packages. Once installed, Drush is as easy to use as any of the basic Linux commands. Drush rhymes with rush or crush. The name comes from combining the words Drupal and shell. Drush is designed only for Drupal and cannot be used with other content management systems.

Both new and experienced Drupal users can benefit from learning Drush. Users that have worked with a command line interface before have an advantage, but Drush is an excellent application for beginners, too.

## Prerequisites

Before installing Drush and Drupal, ensure that the following prerequisites have been met:

1. Create a new Linode by following our [Getting Started](/docs/getting-started/) guide.
2. Address security concerns with the [Securing Your Server](/docs/securing-your-server) guide.
3. Configure a LAMP stack using the [Hosting a Website](/docs/websites/hosting-a-website) guide.
4. Make sure that your system is up to date, using:

       sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with ``sudo``. If you're not familiar with the ``sudo`` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install Git & Composer

The developers of Drush recommend installation through Composer, a PHP dependency manager. The Drush project is hosted on GitHub and controlled with Git, another necessary app to install.


1. Install Git:

       sudo apt-get install git

2. Install Composer:

       curl -sS https://getcomposer.org/installer | php

3. Move the composer.phar file to `/usr/local/bin/`, so that it can be accessed from any directory:

       sudo mv composer.phar /usr/local/bin/composer

## Install Drush for All Users on the Server

Composer is designed to install PHP dependencies on a per-project basis, but the steps below will install a global Drush for all projects.

1. Create a symbolic link between Composer's local bin directory, `/usr/local/bin/composer`, and the system's bin directory, `/usr/bin/`:

       sudo ln -s /usr/local/bin/composer /usr/bin/composer

2. Use Git to download - or clone - the GitHub Drush project into a new directory:

       sudo git clone https://github.com/drush-ops/drush.git /usr/local/src/drush

3. Change the working directory to the new Drush directory:

       cd /usr/local/src/drush

4. Use Git to checkout the version of Drush that you wish to use. The release page is at [https://github.com/drush-ops/drush/releases](https://github.com/drush-ops/drush/releases). Below is a partial image of the release page with a red pointer displaying a sample version number.

    [![Drush Release Page.](/docs/assets/drush-release-page-with-arrow.png)](/docs/assets/drush-release-page-with-arrow.png)


    For a different release, replace the version number in the following command:

       sudo git checkout 7.0.0-alpha5

5. Create a symbolic link between the Drush directory in `/usr/local/src` to `/usr/bin`, so that the Drush command can be called from any directory:

       sudo ln -s /usr/local/src/drush/drush /usr/bin/drush

6. Now, run the Composer install command:

       sudo composer install

7. Drush has now been installed for all users on the server. Check for the proper version number:

       drush --version


## Using Drush

Drush has dozens of commands with hundreds of options. Drush can interface with MySQL, Drupal, Git, and more. To demonstrate using Drush, we will create a Drupal website along with a few other helpful commands.

1. To get started with Drush, run it without any following commands to list the help manual:

       drush

2. View more detailed documentation for a specific command by typing `drush help` and then the command, for example:

       drush help site-install

3. List many of the specs for your server and website with:

       drush status

### Create a Drupal Website with Drush

Drush can create a Drupal site with half the steps of a normal installation. The `drush dl drupal` command conveniently chooses the latest, stable installation of Drupal.

1. Install the required PHP graphics library:

       sudo apt-get install php5-gd

	{{< note >}}
If the install process displays a prompt concerning a modified configuration file, choose the "keep the local version currently installed" option.
{{< /note >}}

2. Check that the Apache2 rewrite module is enabled:

       sudo a2enmod rewrite

3. Reload the Apache server software:

       sudo service apache2 reload


4. Change the working directory to the location of the new website. The previous guides created a **/var/www/`example.com`/public_html** directory, replacing **`example.com`**, and made **`public_html`** the document root or the publicly viewable directory.

       cd  /var/www/example.com/public_html

5. Download Drupal to a folder named drupal:

       sudo drush dl drupal --drupal-project-rename=drupal

    {{< note >}}
You can specify versions of Drupal. For example to install Drupal 8, which is in beta at the time of this publication, use **`drush dl drupal-8`**.
{{< /note >}}

6. Change the working directory to the new 'drupal' folder:

       cd drupal


7. Now the server is ready for the installation of a Drupal site. Below, provide a MySQL username, password, and database in the mysql://`username`:`password`@localhost/`databasename` link option and the site's name in the --site-name=`example.com` option:

       sudo drush si standard --db-url=mysql://username:password@localhost/databasename --site-name=example.com


    {{< note >}}
Although MySQL accepts passwords with a special character, for example an exclamation point, the `drush si standard` command does not. If you have a special character in your MySQL password, you may need to change it.
{{< /note >}}

    After installation is complete, Drush creates a user, named `admin`, and a random password. An example is pictured below. These credentials are used for the Drupal sign-in page.


    [![Drush Username Password](/docs/assets/drush-username-password.png)](/docs/assets/drush-username-password.png)

8. Optionally, if you'd like to change the admin's password, we recommend you do so with Drush, rather than sending the password over a non-secure HTTP connection. In the following command, replace `newpass` with your new password:

       sudo drush user-password admin --password=newpass

### Setting the Site's Ownership and Permissions

In server administration, there are many options for user and group permissions. The directions below create a site owner and a site owner's group. The Apache user, named **www-data**, is added to the site owner's group. Then read, write, and execute permissions are granted to both the site owner and the site owner's group.

To create a new user for the site owner position, review the [Securing Your Server](/docs/security/securing-your-server#add-a-limited-user-account) guide.

1. From the `drupal` directory, change ownership of the site to the chosen owner and that owner's group. Replace `exampleuser` below with the chosen owner's username:

       sudo chown -R exampleuser:exampleuser .

2. Add Apache's **www-data** user to the site owner's group:

       sudo usermod -a -G exampleuser www-data

3. Restart Apache:

       sudo service apache2 restart

3. Make sure the permissions are set to allow access for the site owner and site owner's group:

        sudo chmod -R 770 .

    Now, **www-data**, **exampleuser**, and any user within the exampleuser group has read, write, and execute permissions for the entire Drupal site directory tree.

4. Finally, check the status of the new site:

        drush status

    {{< caution >}}
File permissions are a constant concern for the system owner or root user. When installing new files, like a module or theme, make sure the Apache user www-data has access rights. Use the command `ls -al` to list the file permissions within a directory.
{{< /caution >}}

Your site is now available at **`example.com`/drupal** or **`ipaddress`/drupal**. Sign-in with the generated username and password and start delivering content to the world!

When you're ready for the Drupal site to appear as your homepage, move the site to the **/var/www/`example.com`/** directory and double-check the document root listing in the virtual host file. See Step 5 in the [Configuring Name Based Virtual Hosts](/docs/web-servers/lamp/lamp-server-on-debian-7-wheezy/#configure-name-based-virtual-hosts) section of our *Hosting a Website* guide.

## Additional Options

There are many ways to set up administration for a website. Below are sections explaining some additional options. It's important to be aware of multi-site setups and additional security measures. The topics below touch on these subjects.

### File Ownership, Permissions, and Security

The above setup is designed for ease of use. However, there are setups designed for tighter security and other considerations.

- To design your own setup, read Linode's documentation on [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups) guide
- For an extremely secure setup, read Drupal's [Securing File Permissions and Ownership](https://www.drupal.org/node/244924) guide

### Multi-site Servers

To start, add a virtual host file with Apache. Next, build another site including the appropriate MySQL, PHP, and CMS configurations.

- To add a virtual host file, read Linode's [Configure Name-based Virtual Hosts](/docs/web-servers/lamp/lamp-server-on-debian-7-wheezy/#configure-name-based-virtual-hosts) guide

### Install Drush for the Active User Only

You may want to install Drush for only certain users, for example, the **site owner**, **root**, and **www-data**. This may be optimal for a shared-hosting environment. Also, individual users can install their different versions of Drush and even install versions specific to a single project. The commands below should be run as the user in question, without `sudo`.

1. Modify the user's `.bashrc` file to add the composer directory to it's path:

       nano ~/.bashrc

    {{< file-excerpt "~/.bashrc" >}}
export PATH="$HOME/.composer/vendor/bin:$PATH"

{{< /file-excerpt >}}


2. Run **source** on `.bashrc` to enable the changes:

       source ~/.bashrc

3. Install Drush:

       composer global require drush/drush:dev-master

    {{< note >}}
To install a different version of Drush, replace `drush/drush:dev-master` with another version. For example, to install the stable release of Drush 6.x, use `drush/drush:6.*`. For more information, check out the [Drush GitHub](https://github.com/drush-ops/drush) repository.
{{< /note >}}

4. Check to see that Drush was installed successfully:

       drush --version

