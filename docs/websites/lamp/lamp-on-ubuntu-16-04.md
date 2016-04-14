---
author:
  name: Linode
  email: docs@linode.com
description: 'How to install a LAMP (Linux, Apache, MySQL, PHP) stack on an Ubuntu 16.04 long term support (LTS) system.'
keywords: 'ubuntu lamp,ubuntu 16.04 lamp,lamp install,ubuntu web server,apache,mysql,php,ubuntu 16-04'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['websites/lamp/lamp-server-on-ubuntu-16-04/','websites/lamp/how-to-install-a-lamp-stack-on-ubuntu-16-04/']
modified: Thursday, April 14, 2016
modified_by:
  name: Edward Angert
published: ''
title: 'LAMP on Ubuntu 16.04'
external_resources:
 - '[Ubuntu Server Edition Homepage](http://www.ubuntu.com/server)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.4/)'
 - '[MySQL Documentation](http://dev.mysql.com/doc/)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
---

A LAMP (Linux, Apache, MySQL, PHP) stack is a common web stack used for hosting web content. This guide shows how to install and test a LAMP stack on a Ubuntu 16.04 (LTS) server.

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, see the [Linux Users and Groups guide](/docs/tools-reference/linux-users-and-groups).
>
>Replace each instance of `example.com` in this guide with your site's information.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and that the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

2.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Apache

### Install and Configure

1.  Install Apache 2.4:

        sudo apt-get install apache2

2.  Edit the main Apache configuration file, `apache2.conf`, to adjust the `KeepAlive` setting:

    {: .file }
    /etc/apache2/apache2.conf
    :   ~~~ conf
        KeepAlive Off
        ~~~

3.  The default *multi-processing module* (MPM) for Apache is the *event* module, but by default PHP uses the *prefork* module. Open the `mpm_prefork.conf` file located in `/etc/apache2/mods-available` and edit the configuration. Below is the suggested values for a **1GB Linode**:

    {: .file}
    /etc/apache2/mods-available/mpm_prefork.conf
    :   ~~~ conf
        <IfModule mpm_prefork_module>
                StartServers            2
                MinSpareServers         6
                MaxSpareServers         12
                MaxRequestWorkers       39
                MaxConnectionsPerChild  3000
        </IfModule>
        ~~~

4.  Disable the event module and enable prefork:

        sudo a2dismod mpm_event
        sudo a2enmod mpm_prefork

5.  Restart Apache:

        sudo service apache2 restart


### Configure Virtual Hosts

There are several different ways to set up virtual hosts; however, below is the recommended method. By default, Apache listens on all IP addresses available to it.

1.  Create the above-referenced directories:

        sudo mkdir -p /var/www/html/example.com/public_html
        sudo mkdir /var/www/html/example.com/logs

2.  Create a copy of the default Apache configuration file for your site:

        sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/example.com.conf

3.  Edit the new `example.com.conf` configuration file by uncommenting `ServerName` and replacing `example.com` with your site's IP or Fully Qualified Domain Name (FQDN). Enter the document root path referenced in Step 1, and add the following before the `</VirtualHost>`:

    {: .file }
    /etc/apache2/sites-available/example.com.conf
    :   ~~~ apache
         <Directory /var/www/html/example.com/public_html>
            Require all granted
         </Directory>
        ~~~

4.  Link your virtual host file from the `sites-available` directory to the `sites-enabled` directory:

        sudo a2ensite example.com.conf

    {: .note}
    >
    >If you later need to disable your website, run:
    >
    >     a2dissite example.com.conf
    
5.  Reload Apache:

        sudo service apache2 reload

    Assuming that you have configured the DNS for your domain to point to your Linode's IP address, virtual hosting for your domain should now work.

    If there are additional websites you wish to add to your Linode repeat the above steps to add a folder and configuration file for each.


## MySQL

### Install and Configure

1.  Install the `mysql-server` package:

        sudo apt-get install mysql-server 

    Choose a secure password when prompted.

2.  Run `mysql_secure_installation`, a program that helps secure MySQL. You will be presented with the opportunity to change the MySQL root password, remove anonymous user accounts, disable root logins outside of `localhost`, and remove test databases:

        mysql_secure_installation

### Create a MySQL Database

1.  Log into MySQL:

        mysql -u root -p 

    Enter MySQL's root password, and you'll be presented with a MySQL prompt.

4.  Create a database and a user with permissions for it. In this example the database is called `webdata`, the user `webuser` and password `password`:

        create database webdata; 
        grant all on webdata.* to 'webuser' identified by 'password'; 

5.  Exit MySQL:

        quit 

## PHP 7.0

1.  Install PHP, the PHP Extension and Application Repository, Apache support, and MySQL support:

        sudo apt-get install php7.0 php-pear libapache2-mod-php7.0 php7.0-mysql

    Optionally, install additional cURL, JSON, and CGI support

        sudo apt-get install php7.0-curl php7.0-json php7.0-cgi

2.  Once PHP7 is installed, tune the configuration file located in `/etc/php/7.0/apache2/php.ini` to enable more descriptive errors, logging, and better performance. The following modifications provide a good starting point:

    {: .file-excerpt}
    /etc/php7/apache2/php.ini
    :   ~~~ ini
        max_input_time = 30
        error_reporting = E_COMPILE_ERROR | E_RECOVERABLE_ERROR | E_ERROR | E_CORE_ERROR
        error_log = /var/log/php/error.log
        ~~~

    {: .note}
    >
    >The beginning of the `php.ini` file contains examples commented out with a semicolon (**;**). Ensure that the lines you modify in this step are after the examples section and are uncommented. 

3.  Create the log directory for PHP and give the Apache user ownership:

        sudo mkdir /var/log/php
        sudo chown www-data /var/log/php

4.  Reload Apache:

        sudo systemctl restart apache2


##Optional: Test and Troubleshoot the LAMP Stack

Create a file which tests if Apache can render PHP and connect to the MySQL database.

1.  Paste the following code into a new file, `phptest.php`, in the `public_html` directory. Modify `localhost`, `user`, and `password` to match the information entered in the **Create a MySQL Database** section above:

    {: .file-excerpt}
    /var/www/html/example.com/public_html/phptest.php
    :   ~~~ php
        <html>
        <head>
            <title>PHP Test</title>
        </head>
            <body>
            <?php echo '<p>Hello World</p>'; 

            // In the variables section below, replace user and password with your own MySQL credentials as created on your server
            $servername = "localhost";
            $username = "user";
            $password = "password";

            // Create MySQL connection 
            $conn = mysqli_connect($servername, $username, $password);

            // Check connection - if it fails, output will include the error message
            if (!$conn) {
                die('<p>Connection failed: <p>' . mysqli_connect_error());
            }
            echo '<p>Connected successfully</p>';
            ?>
        </body>
        </html>
        ~~~

2.  Navigate to `example.com/phptest.php` from your local machine

###Troubleshooting

*  If the site does not load at all, check if Apache is running, and restart if required:

        service apache2 status
        sudo service apache2 restart

*  If the site loads, but the page it returns is the default "Congratulations" page, return to the **Configure Virtual Hosts** section above, and check that the `DocumentRoot` matches your `example.com/public_html` folder

*  If the page it returns says "Index of /" or has a similar folder tree structure, create a test `index.html` file or a test file as shown above

Congratulations! You have now set up and configured a LAMP stack.