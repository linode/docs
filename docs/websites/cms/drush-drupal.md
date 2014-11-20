---
author:
    name: Joseph Dooley
    email: jdooley@linode.com
description: 'An overview of Drush the Drupal Shell or Command Line Tool'
keywords: 'drupal,WordPress,joomla,cms,content management system,content management framework, debian, '
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, November 12th, 2014
modified_by:
    name: Joseph Dooley
published: 'Friday, November 14th, 2014'
title: 'Installing & Using Drupal Drush on Debian 7'
external_resources:
 - '[SSL Certificates](/docs/security/ssl/)'
---

Drush is a command line tool for creating, maintaining, and modifying Drupal websites. Command line tools, like Drush, add functionality through additional command packages. Once installed, Drush is as easy to use as any of the basic Linux commands. Drush is pronounced like rush or crush. The name comes from combining the words Drupal and shell. Drush is designed only for Drupal, and cannot be used with other content management systems.

Both new and experienced Drupal users can benefit from learning Drush. Users that have worked with a command line interface before have an advantage, but Drush is an excellent application for beginners too.

## Prerequisites

Before installing Drush and Drupal, ensure that the following prerequisites have been met:

1. Create a new Linode by following our [Getting Started](/docs/getting-started/) guide.
2. Address security concerns with the [Securing Your Server](/docs/securing-your-server) guide.
3. Configure a LAMP stack using the [Hosting a Website](/docs/websites/hosting-a-website) guide.
4. Make sure that your system is up to date, using:

       apt-get update && apt-get upgrade

{: .note } 
>The steps required in this guide require root privileges. Be sure to run the steps below as ``root`` or with the **sudo** prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Install Git & Composer

The developers of Drush recommend installation through Composer, a PHP dependency manager. The Drush project is hosted on Github and controlled with Git, which we will also install.


1. Install Git:

       apt-get install git

2. Install Composer:

       curl -sS https://getcomposer.org/installer | php

3. Move the composer.phar file to `/usr/local/bin/` so that it can be accessed from any directory:

       mv composer.phar /usr/local/bin/composer

##Install Drush for All Users on the Server

Composer is designed to install PHP dependancies on a per-project basis, but the steps below will install a "global drush for all projects".

1. Create a symbolic link between Composer's local bin directory, `/usr/local/bin/composer`, and the system's bin directory, `/usr/bin/`:

       ln -s /usr/local/bin/composer /usr/bin/composer

2. Use Git to download, or clone, the Github Drush project into a new directory:

       git clone https://github.com/drush-ops/drush.git /usr/local/src/drush

3. Change the working directory to the new Drush directory:

       cd /usr/local/src/drush

4. Use Git to checkout the version of Drush that you wish to use. The release page is at [https://github.com/drush-ops/drush/releases](https://github.com/drush-ops/drush/releases). Below is a partial image of the release page with a red pointer displaying a sample version number.

    [![Drush Release Page.](/docs/assets/drush-release-page-with-arrow.png)](/docs/assets/drush-release-page-with-arrow.png)


    For a different release, replace the version number in the following command:

       git checkout 7.0.0-alpha5

5. Create a symbolic link between the Drush directory in `/usr/local/src` to `/usr/bin`, so that the drush command can be called from any directory:

       ln -s /usr/local/src/drush/drush /usr/bin/drush

6. Now, run the Composer install command:

       composer install

7. Drush has now been installed for all users on the server. Check for the proper version number:

       drush --version

##Install Drush for the Active User Only

You may want to install Drush only for a specific user, perhaps for a shared hosting setup. This allows individual users to install their own version of drush, and even install versions specific to a single project. These commands should be run as the user in question, without `sudo`.

1. Modify the user's `.bashrc` file to add the composer directory to it's path:
    
    {: .file-excerpt }
    ~/.bashrc
    :   ~~~
        export PATH="$HOME/.composer/vendor/bin:$PATH"
        ~~~

2. Run **source** on `.bashrc` to enable the changes:

        source ~/.bashrc

3. Install Drush:

       composer global require drush/drush:dev-master

    {: .note }
    > To install a different version of Drush, replace `drush/drush:dev-master` with another version. For example, to install the stable release of Drush 6.x, use `drush/drush:6.*`. For more information, check out the [Drush GitHub](https://github.com/drush-ops/drush) repository.

4. Check to see that Drush was installed successfully:

       drush --version

Please bear in mind, if you install website files into a home directory not owned by the Apache user `www-data`, you will need to make adjustments to file ownerships and permissions accordingly. For more information please read our [Linux Users and Groups](https://www.linode.com/docs/tools-reference/linux-users-and-groups) guide.

##Using Drush

Drush has dozens of commands with hundreds of options. Drush can interface with MySQL, Drupal, Git, and more. To demonstrate using Drush, we will create a Drupal website along with a few other helpful commands.

{: .caution}
> When you run Drush commands, any files created will be owned by the user you run it as. Because of this we advise that you never run Drush as the root user. In our configuration from [Hosting a Website](/docs/websites/hosting-a-website) where web files are stored in `/var/www/`, we suggest using `sudo -u www-data drush...`, with `www-data` being the user Apache runs as.

1. To get started with Drush, run it without any operators to list the help manual:

       drush

2. View more detailed documentation for a specific command by typing `drush help`, and then the command, for example:

       drush help site-install

3. List many of the specs for your server and website with:

       drush status

### Create a Drupal Website with Drush

Drush can create a Drupal site with half the steps of a normal installation. The `drush dl drupal` command conveniently chooses the latest, stable installation of Drupal.

1. Install the required PHP graphics library:

       apt-get install php5-gd

	{: .note }
	> If the install process displays a prompt concerning a modified configuration file, choose the "keep the local version currently installed" option.

2. Check that the Apache2 rewrite module is enabled:

       a2enmod rewrite

3. Reload the Apache server software:

       service apache2 reload


4. Change the working directory to the location of the new website. The previous guides created a **/var/www/`example.com`/public_html** directory, replacing **`example.com`**, and making it the document root, or the publicly viewable directory.

       cd  /var/www/example.com/public_html

5. Download Drupal to a folder named drupal:

       sudo -u www-data drush dl drupal --drupal-project-rename=drupal

    {: .note }
    > You can specify specific versions of Drupal if you prefer. For example. To install Drupal 8, which is in beta at the time of this writing, use `drush dl drupal-8`.

6. Change the working directory to the new 'drupal' folder:

       cd drupal


7. Now the server is ready for the installation of a Drupal site. Below, provide a MySQL username, password, and database in the mysql://`username`:`password`@localhost/`databasename` link option, and the site's name in the --site-name=`example.com` option:

       sudo -u www-data drush si standard --db-url=mysql://username:password@localhost/databasename --site-name=example.com


    {: .note }
    >Although MySQL accepts passwords with a special character, for example an exclamation point, the `drush si standard` command does not. If you have a special character in your MySQL password, you may need to change it.



    After installation is complete, Drush creates a username, `admin`, and a random password. An example is pictured below. These credentials are used for the Drupal sign-in page.


    [![Drush Username Password](/docs/assets/drush-username-password.png)](/docs/assets/drush-username-password.png)

8. Finally, check the status of the new site:

       drush status

Your site is now available at **`example.com`/drupal** or **`ipaddress`/drupal**. Sign-in with the username and password from step 7, change your password, and start delivering content to the world!

{: .note}
> If you'd like to change the admin user's password, we recommend you do so with Dush, rather than sending the password over a non-secure HTTP connection. You can use the command `drush user-password admin --password="newpass"`, replacing `newpass` with your new password.

When you're ready for the Drupal site to appear as your homepage, move the site to the **/var/www/`example.com`/** directory and double-check the document root listing in the virtual host file. See step 5 in the [Configuring Name Based Virtual Hosts](/docs/websites/hosting-a-website#configuring-name-based-virtual-hosts) section of the [Hosting a Website](/docs/websites/hosting-a-website) guide.