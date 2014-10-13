---
author:
  name: Linode
  email: docs@linode.com
description: 'Our guide to hosting a website on your Linode.'
keywords: 'linode guide,hosting a website,website,linode quickstart guide'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['hosting-website/']
modified: Wednesday, January 29th, 2014
modified_by:
  name: Linode
published: 'Tuesday, March 13th, 2012'
title: Hosting a Website
---

Now that you've installed Linux and secured your Linode, it's time to start *doing* stuff with it. In this guide, you'll learn how to host a website. Start by installing a web server, database, and PHP - a popular combination which is commonly referred to a LAMP stack (Linux, Apache, MySQL, and PHP). Then create or import a database, upload files, and add DNS records. By the time you reach the end of this guide, your Linode will be hosting one or more websites!

 {: .note }
>
> Debian 7 and Ubuntu 14.04 LTS are the [Linux distributions](/docs/getting-started#sph_deploying-a-linux-distribution) we're using as the starting point for the packages and configurations mentioned in this guide.
>
> This guide is designed for small and medium-size websites running on WordPress, Drupal, or another PHP content management system. If your website doesn't belong in that category, you'll need to assess your requirements and install custom packages tailored for your particular requirements.
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with ``sudo``. If you're not familiar with the ``sudo`` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

Web Server
----------

Hosting a website starts with installing a *web server*, an application on your Linode that delivers content through the Internet. This section will help you get started with *Apache*, the world's most popular web server. For more information about Apache and other web servers, see our [web server reference manuals](/docs/web-servers).

### Installing Apache

Install Apache on your Linode by entering the following command:

    sudo apt-get install apache2

Your Linode will download, install, and start the Apache web server.

### Optimizing Apache for a Linode 1GB

Installing Apache is easy, but if you leave it running with the default settings, your server could run out of memory. That's why it's important to optimize Apache *before* you start hosting a website on your Linode. Here's how to optimize the Apache web server for a Linode 1GB:

 {: .note }
>
> These guidelines are designed to optimize Apache for a Linode 1GB, but you can use this information for any size Linode. The values are based on the amount of memory available, so if you have a Linode 2GB, multiply all of the values by 2 and use those numbers for your settings.

1.  Just to be safe, make a copy of Apache's configuration file by entering the following command. You can restore the duplicate (`apache2.backup.conf`) if anything happens to the configuration file.

        sudo cp /etc/apache2/apache2.conf /etc/apache2/apache2.backup.conf

2.  Open Apache's configuration file for editing by entering the following command:

        sudo nano /etc/apache2/apache2.conf

3.  Make sure that the following values are set.

 {: .note }
>
> In Ubuntu 14.04 LTS, you will need to append the module section noted below to the end of your apache2.conf file:

{: .file-excerpt}
/etc/apache2/apache2.conf
:	~~~ apache
	KeepAlive Off

	...
	<IfModule mpm_prefork_module>
	StartServers 2
	MinSpareServers 6
	MaxSpareServers 12
	MaxClients 80
	MaxRequestsPerChild 3000
	</IfModule>
	~~~

4.  Save the changes to Apache's configuration file by pressing `Control` + `x` and then pressing `y`. Press `Enter` to confirm.
5.  Restart Apache to incorporate the new settings. Enter the following command:

        sudo service apache2 restart

Good work! You've successfully optimized Apache for your Linode, increasing performance and implementing safeguards to prevent excessive resource consumption. You're almost ready to host websites with Apache.

### Configuring Name-based Virtual Hosts

Now that Apache is optimized for performance, it's time to starting hosting one or more websites. There are several possible methods of doing this. In this section, you'll use *name-based virtual hosts* to host websites in your home directory. Here's how:

 {: .note }
>
> You should *not* be logged in as `root` while executing these commands. To learn how to create a new user account and log in as that user, see [Adding a New User](/docs/securing-your-server#sph_adding-a-new-user).

1.  Disable the default Apache virtual host by entering the following command:

        sudo a2dissite *default

2.  Navigate to your /var/www directory:

        cd /var/www

3.  Create a folder to hold your website by entering the following command, replacing 'example.com' with your domain name:

        sudo mkdir example.com

4.  Create a set of folders inside the folder you've just created to store your website's files, logs, and backups. Enter the following command, replacing `example.com` with your domain name:

        sudo mkdir -p example.com/public_html
		sudo mkdir -p example.com/log
		sudo mkdir -p example.com/backups


5.  Create the virtual host file for your website by entering the following command. Replace the `example.com` in `example.com.conf` with your domain name:

        sudo nano /etc/apache2/sites-available/example.com.conf

    {:.caution}
    > The file name *must* end with `.conf` in Apache versions 2.4 and later, which Ubuntu 14.04 uses. The `.conf` extension is backwards-compatible with earlier versions.

6.  Now it's time to create a configuration for your virtual host. We've created some basic settings to get your started. Copy and paste the settings shown below in to the virtual host file you just created. Replace `example.com` with your domain name.

{: .file-excerpt}
/etc/apache2/sites-available/example.com.conf
:   ~~~ apache
    # domain: example.com
    # public: /var/www/example.com/public_html/

    <VirtualHost *:80>
      # Admin email, Server Name (domain name), and any aliases
      ServerAdmin webmaster@example.com
      ServerName  www.example.com
      ServerAlias example.com

      # Index file and Document Root (where the public files are located)
      DirectoryIndex index.html index.php
      DocumentRoot /var/www/example.com/public_html
      # Log file locations
      LogLevel warn
      ErrorLog  /var/www/example.com/log/error.log
      CustomLog /var/www/example.com/log/access.log combined
    </VirtualHost>
    ~~~

7.  Save the changes to the virtual host configuration file by pressing `Control + x` and then pressing `y`. Press `Enter` to confirm.

8. Enable your new website by entering the following command. Replace `example.com` with your domain name:

        sudo a2ensite example.com.conf

    This creates a symbolic link to your `example.com.conf` file in the appropriate directory for active virtual hosts.

11. The previous command will alert you that you need to restart Apache to save the changes. Enter the following command to apply your new configuration:

        sudo service apache2 restart

12. Repeat steps 1-11 for every other website you want to host on your Linode.

Congratulations! You've configured Apache to host one or more websites on your Linode. After you [upload files](#uploading-files) and [add DNS records](#adding-dns-records) later in this guide, your websites will be accessible to the outside world.

Database
--------

Databases store data in a structured and easily accessible manner, serving as the foundation for hundreds of web and server applications. A variety of open source database platforms exist to meet the needs of applications running on your Linux VPS. This section will help you get started with *MySQL*, one of the most popular database platforms. For more information about MySQL and other databases, see our [database reference manuals](/docs/databases).

### Installing MySQL

Here's how to install and configure MySQL:

1.  Install MySQL by entering the following command. Your Linode will download, install, and start the MySQL database server.

        sudo apt-get install mysql-server

2.  You will be prompted to enter a password for the MySQL `root` user. Enter a password.
3.  Secure MySQL by entering the following command to open `mysql_secure_installation` utility:

        sudo mysql_secure_installation

4.  The `mysql_secure_installation` utility appears. Follow the instructions to remove anonymous user accounts, disable remote root login, and remove the test database.

That's it! MySQL is now installed and running on your Linode.

### Optimizing MySQL for a Linode 1GB

MySQL consumes a lot of memory when using the default configuration. To set resource constraints, you'll need to edit the MySQL configuration file. Here's how to optimize MySQL for a Linode 1GB:

 {: .note }
>
> These guidelines are designed to optimize MySQL for a Linode 1GB, but you can use this information for any size Linode. If you have a larger Linode, start with these values and modify them while carefully watching for memory and performance issues.

1.  Open the MySQL configuration file for editing by entering the following command:

        sudo nano /etc/mysql/my.cnf

2.  Make sure that the following values are set:

	{: .file-excerpt}
    /etc/mysql/my.cnf
    :   ~~~ ini
        max_connections = 75
        key_buffer = 32M
        max_allowed_packet = 1M
        thread_stack = 128K
        table_cache = 32
        ~~~

3.  Save the changes to MySQL's configuration file by pressing `Control + x` and then pressing `y`.
4.  Restart MySQL to save the changes. Enter the following command:

        sudo service mysql restart

Now that you've edited the MySQL configuration file, you're ready to start creating and importing databases.

### Creating a Database

The first thing you'll need to do in MySQL is create a *database*. (If you already have a database that you'd like to import, skip to [Importing a Database](#importing-a-database).) Here's how to create a database in MySQL:

1.  Log in to MySQL by entering the following command and then entering the MySQL root password:

        mysql -u root -p

2.  Create a database by entering the following command. Replace `exampleDB` with your own database name:

        create database exampleDB;

3.  Create a new user in MySQL and then grant that user permission to access the new database by issuing the following command. Replace `example_user` with your username, and `5t1ck` with your password:

        grant all on exampleDB.* to 'example_user' identified by '5t1ck';

    {: .note }
    > MySQL usernames and passwords are only used by scripts connecting to the database. They do not need to represent actual user accounts on the system.

4.  Tell MySQL to reload the grant tables by issuing the following command:

        flush privileges;

5.  Now that you've created the database and granted a user permissions to the database, you can exit MySQL by entering the following command:

        quit

Now you have a new database that you can use for your website. If you don't need to import a database, go ahead and skip to [PHP](#php).

### Importing a Database

If you have an existing website, you may want to import an existing database in to MySQL. It's easy, and it allows you to have an established website up and running on your Linode in a matter of minutes. Here's how to import a database in to MySQL:

1.  Upload the database file to your Linode. See the instructions in [Uploading Files](#uploading-files).
2.  Import the database by entering the following command. Replace `username` with your MySQL username and `database_name` with the database name you want to import to. You will be prompted for your MySQL password:

        mysql -u username -p database_name < FILE.sql

Your database will be imported in to MySQL.

PHP
---

PHP is a general-purpose scripting language that allows you to produce dynamic and interactive webpages. Many popular web applications and content management systems, like WordPress and Drupal, are written in PHP. To develop or host websites using PHP, you must first install the base package and a couple of modules.

### Installing PHP

Here's how to install PHP with MySQL support:

1.  Install the base PHP package by entering the following command:

        sudo apt-get install php5 php-pear

2.  Add MySQL support by entering the following command:

        sudo apt-get install php5-mysql

### Optimizing PHP for a Linode 1GB

After you install PHP, you'll need to enable logging and tune PHP for better performance. The setting you'll want to pay the most attention to is `memory_limit`, which controls how much memory is allocated to PHP. Here's how to enable logging and optimize PHP for performance:

{: .note }
> These guidelines are designed to optimize PHP for a Linode 1GB, but you can use this information as a starting point for any size Linode. If you have a larger Linode, you could increase the memory limit to a larger value, like 256M.

1.  Open the PHP configuration files by entering the following command:

        sudo nano /etc/php5/apache2/php.ini

2.  Verify that the following values are set. All of the lines listed below should be uncommented. Be sure to remove any semi-colons (;) at the beginning of the lines.

    {: .file-excerpt}
    /etc/php5/apache2/php.ini
    :	~~~ ini
        max_execution_time = 30
        memory_limit = 128M
        error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
        display_errors = Off
        log_errors = On
        error_log = /var/log/php/error.log
        register_globals = Off
        ~~~

    {: .note }
    > The 128M setting for `memory_limit` is a general guideline. While this value should be sufficient for most websites, larger websites and some web applications may require 256 megabytes or more.

3.  Save the changes by pressing `Control` + `x` and then pressing `y`.
4.  Create the `/var/log/php/` directory for the PHP error log with the following command:

        sudo mkdir -p /var/log/php

5.  Change the owner of the `/var/log/php/` directory to `www-data`, which the PHP user runs as:

        sudo chown www-data /var/log/php

6.  Restart Apache to load the PHP module by entering the following command:

        sudo service apache2 restart

Congratulations! PHP is now installed on your Linode and configured for optimal performance.

Uploading Files
---------------

You've successfully installed Apache, MySQL, and PHP. Now it's time to upload a website to your Linode. This is one of the last steps before you "flip the switch" and publish your website on the Internet. Here's how to upload files to your Linode:

1.  If you haven't done so already, download and install an SFTP capable client on your computer. We recommend using the [FileZilla](/docs/tools-reference/file-transfer/filezilla) SFTP client.
2.  Follow the instructions in the guides listed above to connect to your Linode.
3.  Upload your website's files to the `/var/www/example.com` directory. Replace `example.com` with your domain name.

     {: .note }
    >
    > If you configured name-based virtual hosts, don't forget to upload the files for the other websites to their respective directories.

If you're using a content management system like WordPress or Drupal, you may need to configure the appropriate settings file to point the content management system at the MySQL database.

Testing
-------

It's a good idea to test your website(s) before you add the DNS records. This is your last chance to check everything and make sure that it looks good before it goes live. Here's how to test your website:

1.  Enter your Linode's IP address in a web browser (e.g., type `http://123.456.78.90` in the address bar, replacing the example IP address with your own.) Your website should load in the web browser.

2.  If you plan on hosting multiple websites you can test the virtual hosts by editing the `hosts` file on your desktop computer. Check out the [Previewing Websites Without DNS](/docs/networking/dns/previewing-websites-without-dns) guide for more information.

3.  Test the name-based virtual hosts by entering the domain names in the address bar of the web browser on your desktop computer. Your websites should load in the web browser.

    {: .caution}
    >Remember to remove the entries for the name-based virtual hosts from your `hosts` file when you're ready to test the DNS records.

Adding DNS Records
------------------

Now you need to point your domain name(s) at your Linode. This process can take a while, so please allow up to 24 hours for DNS changes to be reflected throughout the Internet. Here's how to add DNS records:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **DNS Manager** tab.
3.  Select the **Add a domain zone** link. The form shown below appears.

    [![Create a domain zone.](/docs/assets/910-hosting-1-small.png)](/docs/assets/909-hosting-1.png)

4.  In the **Domain** field, enter your website's domain name in the **Domain** field.
5.  In the **SOA Email** field, enter the administrative contact email address for your domain.
6.  Select the **Yes, insert a few records to get me started** button.
7.  Click **Add a Master Zone**. Several DNS records will be created for your domain, as shown below.

    [![The DNS records created for the domain.](/docs/assets/911-hosting-2-small.png)](/docs/assets/912-hosting-2.png)

8. Over at your domain registrar (where you bought the domain), make sure that your domain name is set to use our DNS server. Use your domain name registrar's interface to set the name servers for your domain to the following:

    - `ns1.linode.com`
    - `ns2.linode.com`
    - `ns3.linode.com`
    - `ns4.linode.com`
    - `ns5.linode.com`

9.  Repeat steps 1-8 for every other name-based virtual host you created earlier.

You've added DNS records for your website(s). Remember, DNS changes can take up to 24 hours to propagate through the Internet. Be patient! Once the DNS changes are completed, you will be able to access your website by typing the domain name in to your browser's address bar.

Setting Reverse DNS
-------------------

You're almost finished! The last step is setting reverse DNS for your domain name. Here's how:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select your Linode.
4.  Click the **Remote Access** tab.
5.  Select the **Reverse DNS** link, as shown below.

    [![Select Reverse DNS link.](/docs/assets/951-hosting-3-1.png)](/docs/assets/951-hosting-3-1.png)

6.  Enter the domain in the **Hostname** field, as shown below.

    [![Enter domain in Hostname field.](/docs/assets/914-hosting-4-small.png)](/docs/assets/915-hosting-4.png)

7.  Click **Look up**. A message appears indicating that a match has been found.
8.  Click **Yes**.

You have set up reverse DNS for your domain name.



