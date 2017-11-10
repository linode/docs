---
author:
  name: James Stewart
  email: jstewart@linode.com
description: 'Configuring a highly available WordPress installation.'
keywords: ["wordpress", "mysql", "replication", "master-master", "high availability"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-01-21
modified_by:
  name: James Stewart
published: 2015-01-09
title: High Availability WordPress Hosting
---

This guide configures a high availability WordPress site with a two-Linode cluster, using MySQL Master-Master replication and a Linode NodeBalancer front-end.

## Prerequisites

This guide is written for Debian 7 or Ubuntu 14.04. To complete this guide, ensure that there are two Linodes and a NodeBalancer present on your account.  Both Linodes need a [Private IP address](/docs/networking/remote-access#adding-private-ip-addresses). Also ensure that both of your Linodes have been configured with SSH keys, and place the opposing Linode's SSH key in the other's `/.ssh/authorized_keys` file.


{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with ``sudo``. If you're not familiar with the ``sudo`` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install Required Software Packages

Use the following commands to install Apache, PHP, and MySQL on each of the Linodes:

    sudo apt-get update
    sudo apt-get upgrade -y
    sudo apt-get install apache2 php5 php5-mysql mysql-server mysql-client

## Edit MySQL's Configuration to Set Up Master-Master Replication

1.  Edit the `/etc/mysql/my.cnf` file on each of the Linodes. Add or modify the following values:

    **Server 1:**

    {{< file-excerpt "/etc/mysql/my.cnf" aconf >}}
server_id           = 1
log_bin             = /var/log/mysql/mysql-bin.log
log_bin_index       = /var/log/mysql/mysql-bin.log.index
relay_log           = /var/log/mysql/mysql-relay-bin
relay_log_index     = /var/log/mysql/mysql-relay-bin.index
expire_logs_days    = 10
max_binlog_size     = 100M
log_slave_updates   = 1
auto-increment-increment = 2
auto-increment-offset = 1

{{< /file-excerpt >}}


    **Server 2:**

    {{< file-excerpt "/etc/mysql/my.cnf" aconf >}}
server_id           = 2
log_bin             = /var/log/mysql/mysql-bin.log
log_bin_index       = /var/log/mysql/mysql-bin.log.index
relay_log           = /var/log/mysql/mysql-relay-bin
relay_log_index     = /var/log/mysql/mysql-relay-bin.index
expire_logs_days    = 10
max_binlog_size     = 100M
log_slave_updates   = 1
auto-increment-increment = 2
auto-increment-offset = 2

{{< /file-excerpt >}}


2.  For each of the Linodes, edit the `bind-address` configuration in order to use the private IP addresses:

    {{< file-excerpt "/etc/mysql/my.cnf" >}}
bind-address    = x.x.x.x

{{< /file-excerpt >}}


3.  Once completed, restart the MySQL application:

        sudo service mysql restart

## Create Replication Users

1.  Log in to MySQL on each of the Linodes:

        mysql -u root -p

2.  Configure the replication users on each Linode. Replace `x.x.x.x` with the private IP address of the opposing Linode and `password` with a strong password:

        GRANT REPLICATION SLAVE ON *.* TO 'replication'@'x.x.x.x' IDENTIFIED BY 'password';

3.  Back in the terminal, run the following command to test the configuration. Use the private IP address of the opposing Linode:

        mysql -ureplication -p -h x.x.x.x -P 3306

    This command should connect you to the remote server's MySQL instance.

## Configure Database Replication


1.  While logged into MySQL on Server 1, query the master status:

        SHOW MASTER STATUS;

    Note the file and position values that are displayed:

        mysql> SHOW MASTER STATUS;
        +------------------+----------+--------------+------------------+
        | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB |
        +------------------+----------+--------------+------------------+
        | mysql-bin.000001 |      277 |              |                  |
        +------------------+----------+--------------+------------------+
        1 row in set (0.00 sec)

2.  On Server 2, at the MySQL prompt, set up the slave functionality for that database. Replace `x.x.x.x` with the private IP from the first server. Also replace the values for `master_log_file` and `master_log_pos` with the values from the previous step:

        SLAVE STOP;
        CHANGE MASTER TO master_host='x.x.x.x', master_port=3306, master_user='replication', master_password='password', master_log_file='mysql-bin.000001', master_log_pos=277;
        SLAVE START;

3.  On Server 2, query the master status. Note the file and position values:

        SHOW MASTER STATUS;

4.  Set the slave database status on Server 1, replacing the same values swapped in step 2 with those from the Server 2:

        SLAVE STOP;
        CHANGE MASTER TO master_host='x.x.x.x', master_port=3306, master_user='replication', master_password='password', master_log_file='mysql-bin.000001', master_log_pos=277;
        SLAVE START;

5.  Exit MySQL on both of your Linodes:

        exit

## Configure Apache

The steps in this section will need to be performed on **both** of your Linodes.

{{< note >}}
For the following sections of this guide, replace "example.com" with your domain name.
{{< /note >}}

1.  Disable the default Apache virtual host by entering the following command:

        sudo a2dissite *default

2.  Navigate to your /var/www directory:

        cd /var/www

3.  Create a folder to hold your website by entering the following command:

        sudo mkdir example.com

4.  Create a set of folders inside the folder you've just created to store your website's files, logs, and backups:

        sudo mkdir example.com/public_html
        sudo mkdir example.com/log

5.  Create the virtual host file for the website:



    {{< file-excerpt "/etc/apache2/sites-available/example.com.conf" apache >}}
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

{{< /file-excerpt >}}


    {{< caution >}}
The file name *must* end with `.conf` in Apache versions 2.4 and later, which Ubuntu 14.04 uses. The `.conf` extension is backwards-compatible with earlier versions.
{{< /caution >}}

6.  Enable the new website by entering the following command:

        sudo a2ensite example.com.conf

7.  Restart Apache:

        sudo service apache2 restart

## Install WordPress

1.  On the primary Linode, download and install the latest version of WordPress. Replace any paths listed with the correct path for your configuration:

        cd /var/www
        wget https://wordpress.org/latest.tar.gz
        tar -xvf latest.tar.gz
        cp -R wordpress/* /var/www/example.com/public_html

2.  Configure the MySQL database for the new WordPress installation. You'll need to replace `wordpressuser` and `password` with your own settings:

        mysql -u root -p
        CREATE DATABASE wordpress;
        GRANT ALL PRIVILEGES ON wordpress.* TO 'wordpressuser'@'localhost' IDENTIFIED BY 'password';
        FLUSH PRIVILEGES;
        EXIT

3.  Set permissions on the Document Root directory to enable WordPress to complete its configuration steps:

        chmod 777 /var/www/example.com/public_html/

4.  Connect to your Linode's IP address using your web browser, and walk through the configuration steps to fully install WordPress.

    {{< caution >}}
In order to ensure that each of your WordPress instances addresses the local database, you will need to ensure that the Database Host value in this step is set to `localhost`.  This should be filled in by default.
{{< /caution >}}

5.  Configure your WordPress URL and Site Address via the General Settings in the WordPress admin interface. Ensure that your domain is configured in both fields.

    [![WordPressURL](/docs/assets/WP-site-address-rs.png)](/docs/assets/WP-site-address.png)

    {{< note >}}
After completing your WordPress installation steps and logging in for the first time, you should reset permissions on your Document Root directory to ensure additional security. You can do so with the following command:


chmod 755 /var/www/example.com/public_html/
{{< /note >}}

6.  Once the WordPress installation steps have been completed, copy the configurations to your second Linode. Replace `x.x.x.x` with the second Linode's IP address:

        rsync -r /var/www/* x.x.x.x:/var/www/.


7.  Log in to the second Linode and restart Apache:

        sudo service apache2 restart


## Configure Folder Sync With Lsyncd

1.  Install Lsyncd on your primary Linode in the cluster.

        sudo apt-get install lsyncd

2.  Create a configuration file in order to perform sync actions.  Replace `x.x.x.x` with the Private IP address of the second Linode in your cluster.

    {{< file-excerpt "/etc/lsyncd/lsyncd.conf.lua" lua >}}
settings = {
logfile = "/var/log/lsyncd.log",
statusFile = "/var/log/lsyncd-status.log"
}
sync{
default.rsyncssh,
delete = false,
insist
source="/var/www",
host="x.x.x.x",
targetdir="/var/www",
rsync = {
archive = true,
perms = true,
owner = true,
_extra = {"-a"},
},
delay = 5,
maxProcesses = 4,
ssh = {
port = 22
}
}

{{< /file-excerpt >}}


3.  Start the Lsyncd daemon:

        service lsyncd start

4.  Test that Lsyncd started successfully:

        service lsyncd status

    If this command returns something other than `lsyncd is running`, double-check your `lsyncd.conf.lua` file and ensure that the RSA public key is in the right location on the secondary server.

5.  Test replication by creating a file in your primary Linode's `/var/www` folder.  You should be able to see that same file in that location on the second Linode within a few seconds.

## Configure Your Nodebalancer

1.  Visit the NodeBalancers tab in the Linode Manager.

2.  If you have not done so already, add a NodeBalancer, ensuring that it is in the same datacenter as your back-end Linodes.

3.  Select your new NodeBalancer and click "Create Configuration." Edit your configuration settings as follows:

        Port: 80
        Protocol: HTTP
        Algorithm: Least Connections
        Session Stickiness: Table
        Health Check Type: HTTP Valid Status

4.  Once you click the "Save Changes" button, you will be prompted to add your nodes. Provide a unique label for each one, and enter the private network address and port in the address field for each of the nodes.

5.  When you have added both of your nodes, ensure that the health checks mark them as up. Once both nodes are showing as up, return to the NodeBalancer's main page and note the IP address listed. You should now be able to navigate to that IP address and view your webpage.

In order to test the high-availability functionality, either stop the Apache2/MySQL services on one of your nodes or power them down one at a time. The website should continue to be served without issue even when one of the nodes is marked as down.

Congratulations, you have now configured your high-availability WordPress site!
