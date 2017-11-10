---
author:
  name: Linode
  email: docs@linode.com
description: 'This tutorial outlines the steps needed to install a LAMP (Linux, Apache, MySQL, PHP) stack on an Ubuntu 16.04 Long Term Support (LTS) system.'
keywords: ["install lamp ubuntu 16.04", "apache install", "mysql install", "php 7.0", " ubuntu 16.04 "]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/lamp/install-lamp-on-ubuntu-16-04/','web-servers/lamp/install-lamp-on-ubuntu-16-04/']
modified: 2017-07-28
modified_by:
  name: Edward Angert
published: 2016-04-28
title: 'How to Install a LAMP Stack on Ubuntu 16.04'
external_resources:
 - '[Ubuntu Server Edition Homepage](http://www.ubuntu.com/server)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.4/)'
 - '[MySQL Documentation](http://dev.mysql.com/doc/)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
---

A LAMP (Linux, Apache, MySQL, PHP) stack is a common, free and open-source web stack used for hosting web content in a Linux environment. Many consider it the platform of choice on which to develop and deploy high-performance web apps.

This guide shows how to install and test a LAMP stack on Ubuntu 16.04 (LTS).

![Install LAMP on Ubuntu 16.04](/docs/assets/install-lamp-on-ubuntu-1604.png "Install LAMP on Ubuntu 16.04")

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, see the [Linux Users and Groups guide](/docs/tools-reference/linux-users-and-groups).

Replace each instance of `example.com` in this guide with your site's domain name.
{{< /note >}}

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides and that the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

2.  Update your system:

        sudo apt update && sudo apt upgrade

## Quick Install Using Tasksel
Instead of installing Apache, MySQL, and PHP separately, tasksel offers a convenient way to get a LAMP stack running quickly.

1.  Install tasksel if not already installed by default.

        sudo apt install tasksel

2.  Use tasksel to install the LAMP stack.

        sudo tasksel install lamp-server

3.  Enter the prompt for a MySQL root password. See the steps below for Apache configurations, creating a virtual host, and installation of PHP modules for Wordpress installation.

## Apache

### Install and Configure Apache

1.  Install Apache 2.4 from the Ubuntu repository:

        sudo apt install apache2

2. The `KeepAlive` setting allows Apache to utilize server-side memory, reducing latency for users on the hosted site. `KeepAlive` will make a website faster if the host has enough memory to support it. This is done by allowing Apache to reuse connections, instead of opening a new connection for every request.

    The state of `KeepAlive` depends on the type of site you plan to run. Please read more about your specific use-case [here](https://httpd.apache.org/docs/2.4/mod/core.html#keepalive) open the Apache config file, `apache2.conf`, and adjust the `KeepAlive` setting:

    {{< file "/etc/apache2/apache2.conf" aconf >}}
KeepAlive On
MaxKeepAliveRequests 50
KeepAliveTimeout 5

{{< /file >}}


    {{< note >}}
The `MaxKeepAliveRequests` setting controls the maximum number of requests during a persistent connection. 50 is a conservative amount; you may need to set this number higher depending on your use-case. The `KeepAliveTimeout` controls how long the server waits for new requests from already connected clients, setting this option to 5 will avoid wasting RAM.
{{< /note >}}

3.  The default *multi-processing module* (MPM) is the **prefork** module. `Mpm_prefork` is the module that is compatible with most systems. Since the LAMP stack requires PHP, it may be best to stick with the default. Open the `mpm_prefork.conf` file located in `/etc/apache2/mods-available` and edit the configuration. Below are the suggested values for a **2GB Linode**:

    {{< file "/etc/apache2/mods-available/mpm_prefork.conf" aconf >}}
<IfModule mpm_prefork_module>
        StartServers            4
        MinSpareServers         3
        MaxSpareServers         40
        MaxRequestWorkers       200
        MaxConnectionsPerChild  10000
</IfModule>

{{< /file >}}


4.  Disable the event module and enable prefork:

        sudo a2dismod mpm_event
        sudo a2enmod mpm_prefork

5.  Restart Apache:

        sudo systemctl restart apache2

### Configure Virtual Hosts

You can set up virtual hosts several ways; however, below is the recommended method. By default, Apache listens on all IP addresses available to it. For all steps below, replace `example.com` with your domain name.

1.  Create a copy of the default Apache configuration file for your site:

        sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/example.com.conf

2.  Edit the new `example.com.conf` configuration file by uncommenting `ServerName` and replacing `example.com` with your site's IP or Fully Qualified Domain Name (FQDN). Enter the document root path and log directories as shown below, and add a `Directory` block before `</VirtualHost>`:

    {{< file "/etc/apache2/sites-available/example.com.conf" apache >}}
<Directory /var/www/html/example.com/public_html>
        Require all granted
</Directory>
<VirtualHost *:80>
        ServerName example.com
        ServerAlias www.example.com
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html/example.com/public_html

        ErrorLog /var/www/html/example.com/logs/error.log
        CustomLog /var/www/html/example.com/logs/access.log combined

</VirtualHost>

{{< /file >}}


    {{< note >}}
The file example above has all comment sections removed for brevity; you may keep or remove the commented areas as you see fit.

The `ServerAlias` directive allows you to include multiple domain names or subdomains for a single host. The example above allows visitors to use `example.com` or `www.example.com` to navigate to this virtual host.
{{< /note >}}

3.  Create the directories referenced above:

        sudo mkdir -p /var/www/html/example.com/{public_html,logs}

    {{< note >}}
Make sure that you do not put space after comma between `public_html` and `logs` because it will create a folder named `{public_html,` and will cause an error when you will reload Apache.
{{< /note >}}

4.  Link your virtual host file from the `sites-available` directory to the `sites-enabled` directory:

        sudo a2ensite example.com.conf

    {{< note >}}
If you need to disable your website, run:

a2dissite example.com.conf
{{< /note >}}

5.  Disable the default virtual host to minimize security risks:

        sudo a2dissite 000-default.conf

6.  Reload Apache:

        sudo systemctl reload apache2

Virtual hosting should now be enabled. To allow the virtual host to use your domain name, be sure that you have configured [DNS services](https://www.linode.com/docs/networking/dns/dns-manager-overview) for your domain to point to your Linode's IP address.

If there are additional websites you wish to host on your Linode, repeat the above steps to add a folder and configuration file for each.

## MySQL

### Install MySQL

Install the `mysql-server` package and choose a secure password when prompted:

    sudo apt install mysql-server

### Create a MySQL Database

1.  Log into MySQL:

        mysql -u root -p

    Enter MySQL's root password, and you'll be presented with a MySQL prompt.

2.  If no password was entered in the previous section, or if you want to change the root password, enter the following command. Replace `password` with a new root password:

        ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'password';

3.  Create a database and a user with permissions for it. In this example, the database is called `webdata`, the user `webuser`, and password `password`:

        CREATE DATABASE webdata;
        GRANT ALL ON webdata.* TO 'webuser' IDENTIFIED BY 'password';

4.  Exit MySQL:

        quit

## PHP 7.0

1.  Install PHP, the PHP Extension and Application Repository, Apache support, and MySQL support:

        sudo apt install php7.0 libapache2-mod-php7.0 php7.0-mysql

    Optionally, install additional cURL, JSON, and CGI support:

        sudo apt install php7.0-curl php7.0-json php7.0-cgi

2.  Once PHP7.0 is installed, edit the configuration file located in `/etc/php/7.0/apache2/php.ini` to enable more descriptive errors, logging, and better performance. The following modifications provide a good starting point:

    {{< file-excerpt "/etc/php/7.0/apache2/php.ini" ini >}}
max_input_time = 30
error_reporting = E_COMPILE_ERROR | E_RECOVERABLE_ERROR | E_ERROR | E_CORE_ERROR
error_log = /var/log/php/error.log

{{< /file-excerpt >}}


    {{< note >}}
The beginning of the `php.ini` file contains examples commented out with a semicolon (**;**), which disables these directives. Ensure that the lines you modify in this step follow the examples section and are uncommented.
{{< /note >}}

3.  Create the log directory for PHP and give ownership to the Apache system user:

        sudo mkdir /var/log/php
        sudo chown www-data /var/log/php

4.  Restart Apache:

        sudo systemctl restart apache2


	{{< note >}}
If you plan on using your LAMP stack to host a WordPress server, download these PHP modules: `apt install php-curl php-gd php-mbstring php-mcrypt php-xml php-xmlrpc`
{{< /note >}}

### Optional: Test and Troubleshoot the LAMP Stack

In this section, you'll create a test page that shows whether Apache can render PHP and connect to the MySQL database. This can be helpful in locating the source of an error if one of the elements of your LAMP stack is not communicating with the others.

1.  Paste the following code into a new file, `phptest.php`, in the `public_html` directory. Modify `webuser` and `password` to match the information entered in the **Create a MySQL Database** section above:

    {{< file-excerpt "/var/www/html/example.com/public_html/phptest.php" php >}}
<html>
<head>
    <title>PHP Test</title>
</head>
    <body>
    <?php echo '<p>Hello World</p>';

    // In the variables section below, replace user and password with your own MySQL credentials as created on your server
    $servername = "localhost";
    $username = "webuser";
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

{{< /file-excerpt >}}


2.  Navigate to `example.com/phptest.php` from your local machine. If the components of your LAMP stack are working correctly, the browser will display a "Connected successfully" message. If not, the output will be an error message.

### Troubleshooting

*   If the site does not load at all, check if Apache is running, and restart it if required:

        systemctl status apache2
        sudo systemctl restart apache2

*   If the site loads, but the page returned is the default "Congratulations" page, return to the **Configure Virtual Hosts** section above and check that the `DocumentRoot` matches your `example.com/public_html` folder.

*   If the page returned says "Index of /" or has a similar folder tree structure, create a test `index.html` file or a test file as shown above.

Congratulations! You have now set up and configured a LAMP stack on Ubuntu 16.04 (LTS).
