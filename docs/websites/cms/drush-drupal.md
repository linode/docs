---
author:
  name: Joseph Dooley
  email: jdooley@linode.com
description: 'An overview of Drush the Drupal Shell or Command Line Tool'
keywords: 'drupal,WordPress,joomla,cms,content management system,content management framework, '
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias:
modified: Wednesday, November 12th, 2014
modified_by:
  name: Joseph Dooley
published: 'Friday, November 14th, 2014'
title: 'Installing and Using Drupal Drush'
---

Drush is a command line tool for creating, maintaining, and modifying Drupal websites. Command line tools, like Drush, add functionality through additional command packages. Once installed, Drush is as easy to use as any of the basic Linux commands. Drush is pronounced like rush or crush. The name comes from combining the words Drupal and shell. Drush is designed only for Drupal, and cannot be used with other content management systems.

Both new Drupal users and experienced Drupal users can benefit from learning Drush. Users that have worked with a command line interface before have an advantage, but Drush is an excellent application for beginners too.

##Prerequisites

Before installing Drush and Drupal, ensure that the following prerequisites have been met:

1. Create a new Linode by following our [Getting Started](/docs/getting-started/) guide.
2. Address security concerns with the [Securing Your Server](/docs/securing-your-server) guide.
3. Configure a LAMP stack using the [Hosting a Website](/docs/websites/hosting-a-website) guide.
4. Make sure that your system is up to date, using:

            apt-get update

Also, some commands may require root-level permissions. This guide assumes that you are either logged in as root or are familiar with the sudo prefix. This guide is written for Debian 7 but can be easily adapted for other Linux distributions.

##Installing Drush

To install Drush, use the version control app called Git and the PHP dependency manager called Composer. Drush can be installed for a single user or for all the users on the server.


1. The Drush project is hosted on Github and controlled with Git, so to download the latest, stable version install Git:

        apt-get install git

2. Install Composer:

        curl -sS https://getcomposer.org/installer | php

3. Move the composer.phar file to a new directory:

        mv composer.phar /usr/local/bin/composer


4. Open the `.bashrc` file for editing.

        nano $HOME/.bashrc

5. On the first line of the `.bashrc` file, create a listing for Composer's bin directory. Afterwards, Composer can be used from anywhere in the operating system:

      {: .file-excerpt}
      $HOME/.bashrc
      : ~~~
        export PATH="$HOME/.composer/vendor/bin:$PATH"
        # ~/.bashrc: executed by bash(1) for non-login shells.
        # Note: PS1 and umask are already set in /etc/profile. You should not
        # need this unless you want different defaults for root.
        ~~~

5. Run the `.bashrc` file to reset the user paths:

        source $HOME/.bashrc

####Install Drush for the Active User Only

If you want to install Drush for all users, proceed to the next section. If you want to use Drush for the current, active user, continue with this section.

6. Composer uses Git to install Drush:

        composer global require drush/drush:dev-master

7. Check to see that Drush was installed successfully:

        drush --version

####Install Drush for All Users on the Server


6. Create a symbolic link between Composer's local bin directory, `/usr/local/bin/composer`, and a new directory in the system's bin directory, `/usr/bin/composer`:

        ln -s /usr/local/bin/composer /usr/bin/composer

7. Use Git to download, or clone, the Github Drush project into a new directory:

        git clone https://github.com/drush-ops/drush.git /usr/local/src/drush

8.  Change the working directory to the new Drush directory:

        cd /usr/local/src/drush

9.  Next, use a Git command to checkout the version of Drush that you wish to use. The release page is at [https://github.com/drush-ops/drush/releases](https://github.com/drush-ops/drush/releases). Below is a partial image of the release page with a red pointer displaying a sample version number.

      [![Drush Release Page.](/docs/assets/drush-release-page-with-arrow.png)](/docs/assets/drush-release-page-with-arrow.png)


       For a different release, replace the version number in the following command. Enter the command:

        git checkout 7.0.0-alpha5

10.  Create a symbolic link between the local, Drush directory and a new system Drush directory:

        ln -s /usr/local/src/drush/drush /usr/bin/drush

11. Now, run the Composer install command:

        composer install

12. Drush has now been installed for all users on the server. Check for the proper version number:

        drush --version

##Using Drush

Drush has dozens of commands with hundreds of options. Drush can interface with MySQL, Drupal, Git, and more. To demonstrate using Drush, we will create a Drupal website along with a few other helpful commands.

1. To get started with Drush, open the help manual:

        drush

2. View more detailed documentation for a specific command by typing `drush help`, and then the command, for example:

        drush help site-install

3. List many of the specs for your server and website with:

        drush status

#### Create a Drupal Website with Drush

Drush can create a Drupal site with half the steps of a normal installation. The `drush dl drupal' command conveniently chooses the latest, stable installation of Drupal.

1. Install the required PHP graphics library:

        apt-get install php5-gd

      {: .note }
    >
    > If the install process displays a prompt concerning a modified configuration file, choose the "keep the local version currently installed" option.

2. Check that the Apache2 rewrite module is enabled:

        a2enmod rewrite

3. Restart the Apache server software:

        service apache2 restart


4. Change the working directory to the location of the new website. The previous guides created a **/var/www/`example.com`/public_html** directory, replacing **`example.com`**, and making it the document root, or the publicly viewable directory.

        cd  /var/www/example.com/public_html

5. Download Drupal to a folder named drupal:

        drush dl drupal --drupal-project-rename=drupal

6. Change the working directory to the new 'drupal' folder:

        cd drupal


7. Now the server is ready for the installation of a Drupal site. Below, provide a MySQL username, password, and database in the mysql://`username`:`password`@localhost/`databasename` link option, and the site's name in the --site-name=`example.com` option:

        drush si standard --db-url=mysql://username:password@localhost/databasename --site-name=example.com


   {: .note }
  >
  >Although MySQL accepts passwords with a special character, for example an exclamation point, the `drush si standard` command does not. If you have a special character in your MySQL password, you may need to change it.



    After installation is complete, Drush creates a username, `admin`, and a random password, an example is pictured below. These credentials are used for the Drupal sign-in page.


    [![Drush Username Password](/docs/assets/drush-username-password.png)](/docs/assets/drush-username-password.png)


8. Change the ownership for the **/var/www/`example.com`/public_html/drupal/sites/default/files**:

        chown -R root:www-data /var/www/example.com/public_html/drupal/sites/default/files

9. Change the read, write, and execute permissions for the same directory:

        chmod -R 775 /var/www/example.com/public_html/drupal/sites/default/files

10. Finally, check the status of the new site:

        drush status

Your site is now available at **`example.com`/drupal** or **`ipaddress`/drupal**. Sign-in with the username and password from step 7, change your password, and start delivering content to the world!

When you're ready for the Drupal site to appear as your homepage, move the site to the **/var/www/`example.com`/** directory and change the document root listing in the virtual host file, see step 5 in the [Configuring Name Based Virtual Hosts](/docs/websites/hosting-a-website#configuring-name-based-virtual-hosts) section of the [Hosting a Website](/docs/websites/hosting-a-website) guide.
