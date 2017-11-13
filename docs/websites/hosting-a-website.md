---
author:
  name: Linode
  email: docs@linode.com
description: 'Our guide to hosting a website on your Linode.'
keywords: ["linode guide", "hosting a website", "website", "linode quickstart guide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['hosting-website/']
modified: 2017-01-18
modified_by:
  name: Phil Zona
published: 2012-03-13
title: Hosting a Website
---

Now that you've installed Linux and secured your Linode, it's time to start *doing* stuff with it. In this guide, you'll learn how to host a website. Start by installing a web server, database, and PHP - a popular combination which is commonly referred to as the LAMP stack (Linux, Apache, MySQL, and PHP). Then create or import a database, upload files, and add DNS records. By the time you reach the end of this guide, your Linode will be hosting one or more websites!

**Debian 8** and **Ubuntu 14.04 LTS** are the [Linux distributions](/docs/getting-started#deploy-an-image) used in this guide. If you'd like to use **Ubuntu 16.04 LTS**, refer to the distribution-specific guide on configuring a [LAMP Stack](/docs/websites/lamp/install-lamp-on-ubuntu-16-04), and then continue to the [upload files](#upload-files) section.

{{< note >}}
This guide is designed for small and medium-size websites running on WordPress, Drupal, or another PHP content management system. If your website doesn't belong in that category, you'll need to assess your requirements and install custom packages tailored for your particular requirements.

This guide is written for a non-root user. Commands that require elevated privileges are prefixed with ``sudo``. If you're not familiar with the ``sudo`` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

<div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><iframe src="//fast.wistia.net/embed/iframe/f067hwymxy?videoFoam=true" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="100%" height="100%"></iframe></div></div>
<script src="//fast.wistia.net/assets/external/E-v1.js" async></script>

## Web Server

Hosting a website starts with installing a *web server*, an application on your Linode that delivers content through the Internet. This section will help you get started with *Apache*, the world's most popular web server. For more information about Apache and other web servers, see our [web server reference manuals](/docs/web-servers).

### Install Apache

Check for and install all system updates, and install Apache on your Linode:

    sudo apt-get update && sudo apt-get upgrade
    sudo apt-get install apache2

Your Linode will download, install, and start the Apache web server.

### Optimize Apache for a Linode 2GB

Installing Apache is easy, but if you leave it running with the default settings, your server could run out of memory. That's why it's important to optimize Apache *before* you start hosting a website on your Linode.

{{< note >}}
These guidelines are designed to optimize Apache for a **Linode 2GB**, but you can use this information for any size Linode. These values are based on the amount of memory available, so if you have a Linode 4GB, multiply all of the values by 2 and use those numbers for your settings.
{{< /note >}}

1.  Just to be safe, make a copy of Apache's configuration file. You can restore the duplicate (`apache2.backup.conf`) if anything happens to the configuration file.

        sudo cp /etc/apache2/apache2.conf /etc/apache2/apache2.backup.conf

2.  Open Apache's configuration file for editing:

        sudo nano /etc/apache2/apache2.conf

    This will open the file in `nano`, but you may use whatever text editor you are comfortable with.

3.  Make sure that the following values are set:

    {{< note >}}
In Ubuntu 14.04, you will need to append the module section noted below to the end of your `apache2.conf` file:
{{< /note >}}

    {{< file-excerpt "/etc/apache2/apache2.conf" apache >}}
KeepAlive Off

   ...

   <IfModule mpm_prefork_module>
       StartServers 4
       MinSpareServers 20
       MaxSpareServers 40
       MaxClients 200
       MaxRequestsPerChild 4500
   </IfModule>

{{< /file-excerpt >}}


4.  Save the changes to Apache's configuration file. If you are using `nano`, do this by pressing **CTRL+X** and then pressing **Y**. Press **ENTER** to confirm.

5.  Restart Apache to incorporate the new settings:

        sudo service apache2 restart

Good work! You've successfully optimized Apache for your Linode, increasing performance and implementing safeguards to prevent excessive resource consumption. You're almost ready to host websites with Apache.

### Configure Name-based Virtual Hosts

Now that Apache is optimized for performance, it's time to starting hosting one or more websites. There are several possible methods of doing this. In this section, you'll use *name-based virtual hosts* to host websites in your home directory.

{{< note >}}
You should *not* be logged in as `root` while executing these commands. To learn how to create a new user account and log in as that user, see [Adding a New User](/docs/securing-your-server#sph_adding-a-new-user).
{{< /note >}}

1.  Disable the default Apache virtual host:

        sudo a2dissite *default

2.  Navigate to your /var/www/html directory:

        cd /var/www/html

3.  Create a folder to hold your website, replacing `example.com` with your domain name:

        sudo mkdir example.com

4.  Create a set of folders inside the folder you've just created to store your website's files, logs, and backups. Enter the following commands, replacing `example.com` with your domain name:

        sudo mkdir -p example.com/public_html
		sudo mkdir -p example.com/log
		sudo mkdir -p example.com/backups

5.  Create the virtual host file for your website. Replace the `example.com` in `example.com.conf` with your domain name:

        sudo nano /etc/apache2/sites-available/example.com.conf

    {{< caution >}}
The file name *must* end with `.conf` in Apache versions 2.4 and later, which is the default version in Ubuntu 14.04. The `.conf` extension is backwards-compatible with earlier versions.
{{< /caution >}}

6.  Now it's time to create a configuration for your virtual host. We've created some basic settings to get your started. Copy and paste the settings shown below in to the virtual host file you just created. Replace all instances of `example.com` with your domain name.

    {{< file-excerpt "/etc/apache2/sites-available/example.com.conf" apache >}}
# domain: example.com
# public: /var/www/html/example.com/public_html/

<VirtualHost *:80>
  # Admin email, Server Name (domain name), and any aliases
  ServerAdmin webmaster@example.com
  ServerName  example.com
  ServerAlias www.example.com

  # Index file and Document Root (where the public files are located)
  DirectoryIndex index.html index.php
  DocumentRoot /var/www/html/example.com/public_html
  # Log file locations
  LogLevel warn
  ErrorLog  /var/www/html/example.com/log/error.log
  CustomLog /var/www/html/example.com/log/access.log combined
</VirtualHost>

{{< /file-excerpt >}}


7.  Save the changes to the virtual host configuration file by pressing **CTRL+X** and then pressing **Y**. Press **ENTER** to confirm.

8. Enable your new website, replacing `example.com` with your domain name:

        sudo a2ensite example.com.conf

    This creates a symbolic link to your `example.com.conf` file in the appropriate directory for active virtual hosts.

9. The previous command will alert you that you need to restart Apache to save the changes. Restart to apply your new configuration:

        sudo service apache2 restart

10. Repeat steps 1-9 for any other websites you want to host on your Linode.

Congratulations! You've configured Apache to host one or more websites on your Linode. After you [upload files](#upload-files) and [add DNS records](#add-dns-records) later in this guide, your websites will be accessible to the outside world.

## Database

Databases store data in a structured and easily accessible manner, serving as the foundation for hundreds of web and server applications. A variety of open source database platforms exist to meet the needs of applications running on your Linode. This section will help you get started with *MySQL*, one of the most popular database platforms. For more information about MySQL and other databases, see our [database reference guides](/docs/databases).

### Install MySQL

1.  Install MySQL. Your Linode will download, install, and start the MySQL database server.

        sudo apt-get install mysql-server

2.  You will be prompted to enter a password for the MySQL root user. This is not related to the root user for your Linode, so be sure to choose a different password for security purposes.

3.  Secure MySQL using the `mysql_secure_installation` utility:

        sudo mysql_secure_installation

4.  The `mysql_secure_installation` utility appears. Follow the instructions to remove anonymous user accounts, disable remote root login, and remove the test database.

That's it! MySQL is now installed and running on your Linode.

### Optimize MySQL for a Linode 2GB

MySQL consumes a lot of memory when using the default configuration. To set resource constraints, you'll need to edit the MySQL configuration file.

{{< note >}}
These guidelines are designed to optimize MySQL 5.5 and up for a **Linode 2GB**, but you can use this information for any size Linode. If you have a larger Linode, start with these values and modify them while carefully watching for memory and performance issues.
{{< /note >}}

1.  Open the MySQL configuration file for editing:

        sudo nano /etc/mysql/my.cnf

2.  Comment out all lines beginning with `key_buffer`. This is a deprecated setting and we'll use the correct option instead.

3.  Edit following values:

    {{< file-excerpt "/etc/mysql/my.cnf" aconf >}}
max_allowed_packet = 1M
thread_stack = 128K

...

max_connections = 75

{{< /file-excerpt >}}


    {{< note >}}
In MySQL 5.6 and above, you may need to add these lines as one block with `[mysqld]` at the top. In earlier MySQL versions, there may be multiple entries for a single option so be sure to edit both lines.
{{< /note >}}

4.  Add the following lines to the end of `my.cnf`:

    {{< file-excerpt "/etc/mysql/my.cnf" aconf >}}
table_open_cache = 32M
key_buffer_size = 32M

{{< /file-excerpt >}}


5.  Save the changes to MySQL's configuration file by pressing **CTRL+X** and then pressing **Y** and hitting **ENTER** to save.

6.  Restart MySQL to save the changes:

        sudo service mysql restart

Now that you've edited the MySQL configuration file, you're ready to start creating and importing databases.

### Create a Database

The first thing you'll need to do in MySQL is create a *database*. (If you already have a database that you'd like to import, skip to the section [Import a Database](#import-a-database).)

1.  Log in using the MySQL root password:

        mysql -u root -p

2.  Create a database, replacing `exampleDB` with your own database name:

        CREATE DATABASE exampleDB;

3.  Create a new user in MySQL and then grant that user permission to access the new database, replacing `example_user` with your username, and `password` with your password:

        GRANT ALL ON exampleDB.* TO 'example_user' IDENTIFIED BY 'password';

    {{< note >}}
MySQL usernames and passwords are only used by scripts connecting to the database. They do not need to represent actual user accounts on the system.
{{< /note >}}

4.  Tell MySQL to reload the grant tables:

        FLUSH PRIVILEGES;

5.  Now that you've created the database and granted a user permissions to the database, you can exit MySQL:

        quit

Now you have a new database that you can use for your website. If you don't need to import a database, go ahead and skip to [PHP](#php).

### Import a Database

If you have an existing website, you may want to import an existing database in to MySQL. It's easy, and it allows you to have an established website up and running on your Linode in a matter of minutes.

1.  Upload the database file to your Linode. See the instructions in the [Upload Files](#upload-files) section.

2.  Import the database, replacing `username` with your MySQL username and `database_name` with the database name you want to import to. You will be prompted for your MySQL password:

        mysql -u username -p database_name < FILE.sql

Your database will be imported in to MySQL.

## PHP

PHP is a general-purpose scripting language that allows you to produce dynamic and interactive webpages. Many popular web applications and content management systems, like WordPress and Drupal, are written in PHP. To develop or host websites using PHP, you must first install the base package and a couple of modules.

### Install PHP

1.  Install the base PHP package:

        sudo apt-get install php5 php-pear

2.  Add the MySQL support extension for PHP:

        sudo apt-get install php5-mysql

### Optimize PHP for a Linode 2GB

After you install PHP, you'll need to enable logging and tune PHP for better performance. The setting you'll want to pay the most attention to is `memory_limit`, which controls how much memory is allocated to PHP.

{{< note >}}
These guidelines are designed to optimize PHP for a Linode 2GB, but you can use this information as a starting point for any size Linode. If you have a larger Linode, you could increase the memory limit to a larger value, like 256M.
{{< /note >}}

1.  Open the PHP configuration files:

        sudo nano /etc/php5/apache2/php.ini

2.  Verify that the following values are set. All of the lines listed below should be uncommented. Be sure to remove any semicolons (`;`) at the beginning of the lines.

    {{< file-excerpt "/etc/php5/apache2/php.ini" ini >}}
max_execution_time = 30
memory_limit = 128M
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
display_errors = Off
log_errors = On
error_log = /var/log/php/error.log
register_globals = Off

{{< /file-excerpt >}}


    {{< note >}}
The 128M setting for `memory_limit` is a general guideline. While this value should be sufficient for most websites, larger websites and some web applications may require 256 megabytes or more.
{{< /note >}}

3.  Save the changes by pressing `Control-x` and then pressing `y`. Hit `Enter` to confirm the changes.

4.  Create the `/var/log/php/` directory for the PHP error log:

        sudo mkdir -p /var/log/php

5.  Change the owner of the `/var/log/php/` directory to `www-data`, the user under which PHP runs:

        sudo chown www-data /var/log/php

6.  Restart Apache to load the PHP module:

        sudo service apache2 restart

Congratulations! PHP is now installed on your Linode and configured for optimal performance.

## Upload Files

You've successfully installed Apache, MySQL, and PHP. Now it's time to upload a website to your Linode. This is one of the last steps before you "flip the switch" and publish your website on the Internet.

1.  If you haven't done so already, download and install an SFTP capable client on your computer. We recommend using the [FileZilla](/docs/tools-reference/file-transfer/filezilla) SFTP client.

2.  Follow the instructions in the guide listed above to connect to your Linode.

3.  Upload your website's files to the `/var/www/html/example.com/public_html` directory. Replace `example.com` with your domain name.

    {{< note >}}
If you configured multiple name-based virtual hosts, don't forget to upload the files for the other websites to their respective directories.
{{< /note >}}

If you're using a content management system like WordPress or Drupal, you may need to configure the appropriate settings file to point the content management system at the MySQL database.

## Test your Website

It's a good idea to test your website(s) before you add the DNS records. This is your last chance to check everything and make sure that it looks good before it goes live.

1.  Enter your Linode's IP address in a web browser (e.g., type `http://192.0.2.0` in the address bar, replacing the example IP address with your own). Your website should load in the web browser.

2.  If you plan on hosting multiple websites, you can test the virtual hosts by editing the `hosts` file on your local computer. Check out the [Previewing Websites Without DNS](/docs/networking/dns/previewing-websites-without-dns) guide for more information.

3.  Test the name-based virtual hosts by entering the domain names in the address bar of the web browser on your desktop computer. Your websites should load in the web browser.

    {{< caution >}}
Remember to remove the entries for the name-based virtual hosts from your `hosts` file when you're ready to test the DNS records.
{{< /caution >}}

## Add DNS Records

Now you need to point your domain name(s) at your Linode. This process can take a while, so please allow up to 24 hours for DNS changes to be reflected throughout the Internet.

1.  Log in to the [Linode Manager](https://manager.linode.com).

2.  Click the **DNS Manager** tab.

3.  Select the **Add a domain zone** link. The form shown below appears.

    [![Create a domain zone](/docs/assets/910-hosting-1-small.png)](/docs/assets/909-hosting-1.png)

4.  In the **Domain** field, enter your website's domain name in the **Domain** field.

5.  In the **SOA Email** field, enter the administrative contact email address for your domain.

6.  Select the **Yes, insert a few records to get me started** button.

7.  Click **Add a Master Zone**. Several DNS records will be created for your domain, as shown below.

    [![The DNS records created for the domain](/docs/assets/911-hosting-2-small.png)](/docs/assets/912-hosting-2.png)

8. Through your domain registrar (where you bought the domain), make sure that your domain name is set to use Linode's DNS. Use your domain name registrar's interface to set the name servers for your domain to the following:

    - `ns1.linode.com`
    - `ns2.linode.com`
    - `ns3.linode.com`
    - `ns4.linode.com`
    - `ns5.linode.com`

9.  Repeat steps 1-8 for each name-based virtual host you created earlier.

You've now added DNS records for your website(s). Remember, DNS changes can take up to 48 hours to propagate through the Internet. Be patient! Once the DNS changes are completed, you will be able to access your website by typing the domain name in to your browser's address bar.

## Setting Reverse DNS

You're almost finished! The last step is setting reverse DNS for your domain name.

1.  Log in to the [Linode Manager](https://manager.linode.com).

2.  Click the **Linodes** tab.

3.  Select your Linode.

4.  Click the **Remote Access** tab.

5.  Select the **Reverse DNS** link, as shown below.

    [![Select Reverse DNS link](/docs/assets/951-hosting-3-1.png)](/docs/assets/951-hosting-3-1.png)

6.  Enter the domain in the **Hostname** field, as shown below.

    [![Enter domain in Hostname field](/docs/assets/914-hosting-4-small.png)](/docs/assets/915-hosting-4.png)

7.  Click **Look up**. A message appears, indicating that a match has been found.

8.  Click **Yes**.

You have set up reverse DNS for your domain name.
