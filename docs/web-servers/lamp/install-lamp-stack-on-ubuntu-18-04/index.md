---
author:
  name: Linode
  email: docs@linode.com
description: 'This tutorial outlines the steps needed to install a LAMP (Linux, Apache, MySQL, PHP) stack on Ubuntu 18.04 Long Term Support (LTS).'
keywords: ["install lamp ubuntu 18.04", "apache install", "mysql install", "php", "ubuntu 18.04"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-08-27
modified_by:
  name: Linode
published: 2018-06-04
title: 'How to Install a LAMP Stack on Ubuntu 18.04'
external_resources:
 - '[Ubuntu Server Edition Homepage](http://www.ubuntu.com/server)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.4/)'
 - '[MySQL Documentation](http://dev.mysql.com/doc/)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
---

## What is a LAMP Stack?

A LAMP (Linux, Apache, MySQL, PHP) stack is a common, free, and open-source web stack used for hosting web content in a Linux environment. Many consider it the platform of choice on which to develop and deploy high-performance web apps.

This guide shows how to install and test a LAMP stack on Ubuntu 18.04 (LTS).

<!-- ![Install LAMP on Ubuntu 18.04](install-lamp-on-ubuntu-18-04.png "Install LAMP on Ubuntu 18.04") -->

{{< content "limited-user-note-shortguide" >}}

Replace each instance of `example.com` in this guide with your site's domain name or IP.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started/) and [Securing Your Server](/docs/security/securing-your-server/) guides and that the Linode's [hostname is set](/docs/getting-started/#set-the-hostname).

2.  Update your system:

        sudo apt update && sudo apt upgrade

## Installation

### Install Using Tasksel

Instead of installing Apache, MySQL, and PHP separately, Tasksel offers a convenient way to get a LAMP stack running quickly.

1.  Install Tasksel if not already installed by default:

        sudo apt install tasksel

1.  Use Tasksel to install the LAMP stack:

        sudo tasksel install lamp-server

### Install Packages Separately

If you prefer not to install the bundled packages via Tasksel, you can instead install them separately:

1.  Install Apache 2.4 from the Ubuntu repository:

        sudo apt install apache2

1.  Install the `mysql-server` package:

        sudo apt install mysql-server

1.  Install PHP, the PHP Extension and Application Repository, Apache support, and MySQL support:

        sudo apt install php7.2 libapache2-mod-php7.2 php-mysql

    Optionally, install additional cURL, JSON, and CGI support:

        sudo apt install php-curl php-json php-cgi

## Configuration

### Apache

1. The `KeepAlive` setting allows Apache to better utilize server-side memory, reducing latency for users on the hosted site. `KeepAlive` makes a website faster if the host has enough memory to support it. This is done by allowing Apache to reuse connections, instead of opening a new connection for every request.

    Open the `apache2.conf` Apache config file and adjust the `KeepAlive` setting:

    {{< file "/etc/apache2/apache2.conf" aconf >}}
KeepAlive On
MaxKeepAliveRequests 50
KeepAliveTimeout 5

{{< /file >}}

    {{< note >}}
The `MaxKeepAliveRequests` setting controls the maximum number of requests during a persistent connection. 50 is a conservative amount; you may need to set this number higher depending on your use-case. The `KeepAliveTimeout` setting controls how long the server waits (measured in seconds) for new requests from already connected clients. Setting this to 5 will avoid wasting RAM.
{{< /note >}}

1.  The default *multi-processing module* (MPM) is the **prefork** module. `mpm_prefork` is the module that is compatible with most systems. Open the `mpm_prefork.conf` file located in `/etc/apache2/mods-available` and edit the configuration. Below are the suggested values for a **2GB Linode**:

    {{< file "/etc/apache2/mods-available/mpm_prefork.conf" aconf >}}
<IfModule mpm_prefork_module>
        StartServers            4
        MinSpareServers         3
        MaxSpareServers         40
        MaxRequestWorkers       200
        MaxConnectionsPerChild  10000
</IfModule>
{{< /file >}}

1.  Enable the firewall to allow web traffic. This guide lists the commands to enable web traffic if you configured UFW on your server.

    a. Check the ports that are enabled for `Apache Full` Profile:

        sudo ufw app info "Apache Full"

       Ports `80` and `443` should be listed as enabled for `Apache Full` profile.

    b. To allow incoming HTTP and HTTPS traffic for `Apache Full` profile:

        sudo ufw allow in "Apache Full"


1. Disable the event module and enable prefork:

        sudo a2dismod mpm_event
        sudo a2enmod mpm_prefork

1.  Restart Apache:

        sudo systemctl restart apache2

### Virtual Hosts

You can set up virtual hosts several ways, and the following steps outline the recommended method. For each of these steps, replace `example.com` with your domain name.

1.  Create a copy of the default Apache configuration file for your site:

        sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/example.com.conf

1.  Open the new `example.com` configuration file in your text editor. Uncomment the `ServerName` option and update it with your domain. Enter the document root path and log directories as shown below, and add a `Directory` block before `<VirtualHost>`:

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
    The file example above has all comment sections removed for brevity. Keep or remove the commented areas as you see fit.

The `ServerAlias` directive allows you to include multiple domain names or subdomains for a single host. The example above allows visitors to use `example.com` or `www.example.com` to navigate to this virtual host.
{{< /note >}}

1.  Create the directories referenced above:

        sudo mkdir -p /var/www/html/example.com/{public_html,logs}

    {{< note >}}
Make sure that you do not put a space after the comma between `public_html` and `logs` because it will create a folder named `{public_html,` and will cause an error when you will reload Apache.
{{< /note >}}

1.  Assign ownership of `public_html` directory to the `$USER` environment variable:

        sudo chown -R $USER:$USER /var/www/html/example.com/public_html

1. Check that the permissions are correct:

        sudo chmod -R 755 /var/www/html/example.com/public_html

1.  Link your virtual host file from the `sites-available` directory to the `sites-enabled` directory:

        sudo a2ensite example.com

    {{< note >}}
To disable your website, run `a2dissite example.com`.
{{< /note >}}

1.  Disable the default virtual host to minimize security risks:

        sudo a2dissite 000-default.conf

1.  Reload Apache:

        sudo systemctl reload apache2

Virtual hosting should now be enabled. To allow the virtual host to use your domain name, be sure that you have configured [DNS services](/docs/platform/manager/dns-manager/) for your domain to point to your Linode's IP address.

If there are additional websites you wish to host on your Linode, repeat the above steps to add a folder and configuration file for each.

### MySQL

1.  Log in to MySQL's SQL shell:

        sudo mysql -u root

    {{< content "mysql-authsocket-authentication-note-shortguide" >}}

1.  Create a database and a user with permissions for it. In this example, the database is called `webdata`, the user `webuser`, and password `password`. Be sure to enter your own password. This should be different from the root password for MySQL:

    {{< highlight sql >}}
CREATE DATABASE webdata;
GRANT ALL ON webdata.* TO 'webuser' IDENTIFIED BY 'password';
{{< /highlight >}}

1.  Exit the SQL shell:

    {{< highlight sql >}}
quit
{{< /highlight >}}

1.  Use the *[mysql_secure_installation](https://mariadb.com/kb/en/library/mysql_secure_installation/)* tool to configure additional security options. This tool will ask if you want to set a new password for the MySQL root user, but you can skip that step:

        sudo mysql_secure_installation

    Answer **Y** at the following prompts:

    -  Remove anonymous users?
    -  Disallow root login remotely?
    -  Remove test database and access to it?
    -  Reload privilege tables now?

### PHP

1.  Edit the configuration file located in `/etc/php/7.2/apache2/php.ini` to enable more descriptive errors, logging, and better performance. The following modifications provide a good starting point:

    {{< file "/etc/php/7.2/apache2/php.ini" ini >}}
error_reporting = E_COMPILE_ERROR | E_RECOVERABLE_ERROR | E_ERROR | E_CORE_ERROR
max_input_time = 30
error_log = /var/log/php/error.log
{{< /file >}}

    {{< note >}}
The beginning of the `php.ini` file contains examples commented out with a semicolon (**;**), which disables these directives. Ensure that the lines you modify in this step follow the examples section and are uncommented.
{{< /note >}}

1.  Create the log directory for PHP and give ownership to the Apache system user:

        sudo mkdir /var/log/php
        sudo chown www-data /var/log/php

1.  Restart Apache:

        sudo systemctl restart apache2

    {{< note >}}
If you plan on using your LAMP stack to host a WordPress server, install additional PHP modules: `sudo apt install php-curl php-gd php-mbstring php-xml php-xmlrpc`
{{< /note >}}

## Optional: Test and Troubleshoot the LAMP Stack

In this section, you'll create a test page that shows whether Apache can render PHP and connect to the MySQL database. This can be helpful in locating the source of an error if one of the elements of your LAMP stack is not communicating with the others.

1.  Paste the following code into a new file, `phptest.php`, in the `public_html` directory. Modify `webuser` and `password` to match the information entered in the **Create a MySQL Database** section above:

    {{< file "/var/www/html/example.com/public_html/phptest.php" php >}}
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
        die('<p>Connection failed: </p>' . mysqli_connect_error());
    }
    echo '<p>Connected successfully</p>';
    ?>
</body>
</html>

{{< /file >}}

1.  Navigate to `example.com/phptest.php` from your local machine. If the components of your LAMP stack are working correctly, the browser will display a "Connected successfully" message. If not, the output will be an error message.

1.  Remove the test file:

        sudo rm /var/www/html/example.com/public_html/phptest.php

### Troubleshooting

*   If the site does not load at all, check if Apache is running, and restart it if required:

        sudo systemctl status apache2
        sudo systemctl restart apache2

*   If the site loads, but the page returned is the default "Congratulations" page, return to the **Configure Virtual Hosts** section above and check that the `DocumentRoot` matches your `example.com/public_html` folder.

*   If the page returned says "Index of /" or has a similar folder tree structure, create a test `index.html` file or a test file as shown above.

Congratulations! You have now set up and configured a LAMP stack on Ubuntu 18.04 (LTS).
