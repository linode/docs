---
slug: how-to-install-a-lamp-stack-on-centos-7
description: "Install a LAMP stack on a CentOS 7 Linode. A LAMP stack includes Linux, Apache, MariaDB, and PHP. ✓ Read now!"
keywords: ["LAMP", "CentOS", "CentOS 7", "apache", "mysql", "php", "centos lamp"]
tags: ["centos","web server","php","mysql","apache","lamp"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2022-01-14
modified_by:
    name: Linode
published: 2015-12-01
title: "Installing a LAMP Stack (PHP, MySQL, Apache) on CentOS 7"
title_meta: "Install a LAMP Stack (PHP, MySQL, Apache) on CentOS 7"
aliases: ['/websites/lamp/lamp-on-centos-7/','/web-servers/lamp/how-to-install-a-lamp-stack-on-centos-7/','/websites/lamp/lamp-server-on-centos-7/','/web-servers/lamp/lamp-on-centos-7/']
external_resources:
 - '[CentOS Linux Home Page](http://www.centos.org/)'
 - '[Apache HTTP Server Documentation](http://httpd.apache.org/docs/2.2/)'
 - '[MariaDB Documentation](https://mariadb.com/kb/en/mariadb/documentation/)'
 - '[PHP Documentation](http://www.php.net/docs.php)'
image: lamp-on-centos-7-title-graphic.jpg
relations:
    platform:
        key: install-lamp-stack
        keywords:
            - distribution: CentOS 7
authors: ["Joel Kruger"]
---

A *LAMP stack* is a particular bundle of software packages commonly used for hosting web content. The bundle consists of Linux, Apache, MariaDB, and PHP (LAMP). This guide shows you how to install a LAMP stack on a CentOS 7 Linode.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/products/platform/get-started/) and [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guides. Ensure that the Linode's [hostname is set](/docs/products/platform/get-started/#set-the-hostname).

    Check your Linode's hostname. The first command should show your short hostname and the second should show your fully qualified domain name (FQDN).

        hostname
        hostname -f

1.  Update your system:

        sudo yum update

    {{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
    {{< /note >}}

## Apache

### Install and Configure

Install Apache using CentOS’s package manager.

1.  Install Apache 2.4:

        sudo yum install httpd

1.  Enable Apache to start at boot and start the Apache service:

        sudo systemctl enable httpd.service
        sudo systemctl start httpd.service

1.  Create a `httpd-mpm.conf` file and add the code in the example to turn off KeepAlive and adjust the resource use settings. The settings shown below are a good starting point for a **Linode 2GB**:

    {{< note respectIndent=false >}}
As a best practice, you should create a backup of your Apache configuration file, before making any configuration changes to your Apache installation. To make a backup in your home directory:

    cp /etc/httpd/conf/httpd.conf ~/httpd.conf.backup
{{< /note >}}

    {{< file "/etc/httpd/conf.modules.d/httpd-mpm.conf" aconf >}}
KeepAlive Off

<IfModule prefork.c>
    StartServers        4
    MinSpareServers     20
    MaxSpareServers     40
    MaxClients          200
    MaxRequestsPerChild 4500
</IfModule>

{{< /file >}}

### Configure Name-based Virtual Hosts

There are different ways to set up virtual hosts; however, the method below is recommended.

1.  Create the directories to store your site files and logs. Replace `example.com` with your own site's domain name.

        sudo mkdir -p /var/www/html/example.com/{public_html,logs}

1.  Create the directories to store your site's virtual hosts files:

        sudo mkdir -p /etc/httpd/sites-available /etc/httpd/sites-enabled

1.  Edit Apache's configuration file to let it know to look for virtual host files in the `/etc/httpd/sites-enabled` directory. Add the example line to the bottom of your `httpd.conf` file:

    {{< file "/etc/httpd/conf/httpd.conf" apache>}}
IncludeOptional sites-enabled/*.conf
{{</ file >}}

1.  Navigate to your `/var/www/html/example.com` directory if you are not already there:

        cd /var/www/html/example.com

1.  Using your preferred text editor create a virtual hosts file. Copy the basic settings in the example below and paste them into the file. Replace all instances of `example.com` with your domain name:

    {{< file "/etc/httpd/sites-available/example.com.conf" apache>}}
<Directory /var/www/html/example.com/public_html>
    Require all granted
</Directory>
<VirtualHost *:80>
    ServerName example.com
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html/example.com/public_html
    ErrorLog /var/www/html/example.com/logs/error.log
    CustomLog /var/www/html/example.com/logs/access.log combined
</VirtualHost>
{{</ file>}}

1.  Create a symbolic link from your virtual hosts file in the `sites-available` directory to the `sites-enabled` directory. Replace `example.com.conf` with the name of your own virtual hosts file.

        sudo ln -s /etc/httpd/sites-available/example.com.conf /etc/httpd/sites-enabled/example.com.conf

1.  Reload to apply your new configuration:

        sudo systemctl reload httpd.service

    {{< note respectIndent=false >}}
If you receive an error when trying to reload your `httpd` service, follow the steps in the [Configure SELinux to Allow HTTP](#configure-selinux-to-allow-http) section and then reattempt to reload the service.
    {{< /note >}}

    Additional domains can be added to the `example.com.conf` file as needed.

    {{< note respectIndent=false >}}
`ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.
{{< /note >}}

### Configure SELinux to Allow HTTP

SELinux is enabled by default on CentOS 7 Linodes. Its default setting is to restrict Apache's access to directories until explicit permissions are granted.

Without these steps, Apache does not start and may give the following error:

{{< output >}}
Jun 21 17:58:09 example.com systemd[1]: Failed to start The Apache HTTP Server.
Jun 21 17:58:09 example.com systemd[1]: Unit httpd.service entered failed state.
Jun 21 17:58:09 example.com systemd[1]: httpd.service failed.
{{< /output >}}

1.  Use `chown` to make `apache` the owner of the web directory:

        sudo chown apache:apache -R /var/www/html/example.com/

1.  Modify the permissions for files and directories:

        cd /var/www/html/example.com/
        find . -type f -exec sudo chmod 0644 {} \;
        find . -type d -exec sudo chmod 0755 {} \;

1.  Use SELinux's `chcon` to change the file security context for web content:

        sudo chcon -t httpd_sys_content_t /var/www/html/example.com -R
        sudo chcon -t httpd_sys_rw_content_t /var/www/html/example.com -R

1.  Enable Apache to start at boot and restart the service for the above changes to take place:

        sudo systemctl enable httpd.service
        sudo systemctl restart httpd.service


{{< note respectIndent=false >}}
In addition, if you plan to use any HTTPD scripts on the server, update the corresponding SELinux Boolean variable. To allow HTTPD scripts and modules to connect to the network, use the `sudo setsebool -P httpd_can_network_connect on` command.
{{< /note >}}

### Configure FirewallD to Allow HTTP Connections

FirewallD is enabled for CentOS 7 Linodes, but HTTP is not included in the default set of services.

1.  View the default set of services:

        sudo firewall-cmd --zone=public --list-services

    {{< output >}}
ssh dhcpv6-client
{{< /output >}}

1.  To allow connections to Apache, add HTTP as a service:

        sudo firewall-cmd --zone=public --add-service=http --permanent
        sudo firewall-cmd --zone=public --add-service=http

    Visit your domain or public IP to test the Apache server and view the default Apache page.

    {{< note respectIndent=false >}}
Rename Apache's default welcome page. When this file is present it takes precedence over other configurations via the `LocationMatch` directive.

    sudo mv /etc/httpd/conf.d/welcome.conf /etc/httpd/conf.d/welcome.conf.bk
{{< /note >}}

Once Apache has been installed and configured on your server, it is time to install PHP and the MySQL database on your CentOS 7 Linode.

## MariaDB

### Install and Configure

 MariaDB is a *relational database management system* (RDBMS), and is a popular component of many applications.

1.  Install the MariaDB-server package:

        sudo yum install mariadb-server

1.  Set MariaDB to start at boot and start the daemon for the first time:

        sudo systemctl enable mariadb.service
        sudo systemctl start mariadb.service

1.  Run `mysql_secure_installation` to secure MariaDB. You will be given the option to change the MariaDB root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases and reload privileges. It is recommended that you answer yes to these options:

        sudo mysql_secure_installation

### Create a MariaDB Database

1.  Log in to MariaDB:

        mysql -u root -p

    Enter MariaDB’s root password. You will get the MariaDB prompt.

1.  Create a new database and user with permissions to use it:

        create database webdata;
        grant all on webdata.* to 'webuser' identified by 'password';

    In the above example `webdata` is the name of the database, `webuser` the user, and `password` a strong password.

1.  Exit MariaDB

        quit

With Apache and MariaDB installed, you are now ready to install PHP on your CentOS 7 Linode to provide scripting support for your web pages. CentOS needs PHP to connect to the MySQL to get information.


## PHP

###  Install and Configure

1.  Install PHP:

        sudo yum install php php-pear php-mysqlnd

1.  Edit `/etc/php.ini` for better error messages and logs, and upgraded performance. These modifications provide a good starting point for a **Linode 2GB**:

    {{< file "/etc/php.ini" ini >}}
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
error_log = /var/log/php/error.log
max_input_time = 30

{{< /file >}}


    {{< note respectIndent=false >}}
Ensure that all lines noted above are uncommented. A commented line begins with a semicolon (**;**).
{{< /note >}}

1.  Create the log directory for PHP and give the Apache user ownership:

        sudo mkdir /var/log/php
        sudo chown apache:apache /var/log/php

1.  Reload Apache:

        sudo systemctl reload httpd.service

## Optional: Test and Troubleshoot the LAMP Stack

In this section, you'll create a test page that shows whether Apache can render PHP and connect to the MariaDB database. This can be helpful in locating the source of an error if one of the elements of your LAMP stack is not communicating with the others.

1.  Paste the following code into a new file, `phptest.php`, in the `public_html` directory. Modify `webuser` and `password` to match the information entered in the [Create a MariaDB Database](#create-a-mariadb-database) section above:

    {{< file "/var/www/html/example.com/public_html/phptest.php" php >}}
<html>
<head>
<title>PHP Test</title>
</head>
    <body>
    <?php echo '<p>Hello World</p>';

    // In the variables section below, replace user and password with your own MariaDB credentials as created on your server
    $servername = "localhost";
    $username = "webuser";
    $password = "password";

    // Create MariaDB connection
    $conn = mysqli_connect($servername, $username, $password);

    // Check connection - if it fails, output includes the error message
    if (!$conn) {
    die('<p>Connection failed: </p>' . mysqli_connect_error());
    }
    echo '<p>Connected successfully</p>';
    ?>
    </body>
</html>

    {{< /file >}}

1.  Navigate to `example.com/phptest.php` from your local machine. If the components of your LAMP on CentOS 7 are working correctly, the browser displays a "Connected successfully" message. If not, the output is an error message.

1.  Remove the test file:

        sudo rm /var/www/html/example.com/public_html/phptest.php
