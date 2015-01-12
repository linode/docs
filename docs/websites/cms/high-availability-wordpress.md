---
author:
  name: James Stewart
  email: jstewart@linode.com
description: 'Configuring a highly available Wordpress installation.'
keywords: 'wordpress,mysql,replication,master-master,high availability'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, December 24, 2014
modified_by:
  name: James Stewart
published: 'Wednesday, December 24, 2014'
title: High Availability Wordpress Hosting
---
This guide configures a high availability Wordpress site with a two Linode cluster, using MySQL Master-Master replication and a Linode NodeBalancer frontend.

##Prerequisites

This guide is written for Debian 7 or Ubuntu 14.04.

To complete this guide, ensure that there are two Linodes and a NodeBalancer present on your account. Both Linodes need to be assigned a [private IP address](/docs/networking/remote-access#adding-private-ip-addresses) and configured with SSH keys. Place the opposing Linode's SSH key in the other's `/.ssh/authorized_keys` file.

{: .note}
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with ``sudo``. If you're not familiar with the ``sudo`` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

##Install Required Software Packages

Use the following commands to install Apache, PHP, and MySQL on each of the Linodes:

    sudo apt-get update
    sudo apt-get upgrade -y
    sudo apt-get install apache2 php5 php5-mysql mysql-server mysql-client

##Edit MySQL's Configuration to Set Up Master-Master Replication

1.  Edit the `/etc/mysql/my.cnf` file on each of the Linodes. Add or modify the following values:

    **Server 1:**

    {: .file-excerpt }
    /etc/mysql/my.cnf
    : ~~~ conf
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
    ~~~

    **Server 2:**

    {: .file-excerpt }
    /etc/mysql/my.cnf
    : ~~~ conf
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
    ~~~

2.  For each of the Linodes, edit the `bind-address` configuration in order to use the private IP addresses:

    {: .file-excerpt }
    /etc/mysql/my.cnf
    : ~~~
    bind-address    = x.x.x.x
    ~~~

3.  Once completed, restart the MySQL application:

        sudo service mysql restart

##Create Replication Users

1.  Log in to MySQL on each of the Linodes:

        mysql -u root -p

2.  Configure the replication users on each Linode. Replace "x.x.x.x" with the private IP address of the opposing Linode, and "password" with a strong password:

        GRANT REPLICATION SLAVE ON *.* TO 'replication'@'x.x.x.x' IDENTIFIED BY 'password';

3.  Back in the terminal, run the following command to test the configuration. Use the private IP address of the opposing Linode:

        mysql -ureplication -p -h x.x.x.x -P 3306
        
    This command should connect you to the remote server's MySQL instance.

##Configure Database Replication


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

2.  On Server 2, at the MySQL prompt, set up the slave functionality for that database. Replace "x.x.x.x" with the private IP from the first server. Also replace the values for `master_log_file` and `master_log_pos` with the values from the previous step:

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

##Configure Apache

The steps in this section will need to be performed on **both** of your Linodes.

{: .note}
>For the following sections of this guide, replace "example.com" with your domain name.

1.  Disable the default Apache virtual host by entering the following command:

        sudo a2dissite *default

2.  Navigate to your /var/www directory:

        cd /var/www

3.  Create a folder to hold your website by entering the following command:

        sudo mkdir example.com

4.  Create a set of folders inside the folder you've just created to store your website's files, logs, and backups:

        sudo mkdir example.com/public_html
        sudo mkdir example.com/log

5.  Create the virtual host file for the website by entering the following command:

        sudo nano /etc/apache2/sites-available/example.com.conf

    {:.caution}
    > The file name *must* end with `.conf` in Apache versions 2.4 and later, which Ubuntu 14.04 uses. The `.conf` extension is backwards-compatible with earlier versions.

6.  Create the new virtual host file:

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

7.  Save the changes to the virtual host configuration file by pressing `Control + x` and then `y`. Press `Enter` to confirm.

8. Enable the new website by entering the following command:

        sudo a2ensite example.com.conf

9.  Restart Apache:

        sudo service apache2 restart

##Install Wordpress

1.  On the primary Linode, download and install the latest version of WordPress. Replace any paths listed with the correct path for your configuration:

        cd /var/www
        wget https://wordpress.org/latest.tar.gz
        tar -xvf latest.tar.gz
        cp -R wordpress/* /var/www/example.com/public_html

2.  Configure the MySQL database for the new WordPress installation. You'll need to replace "wordpressuser" and "password" with your own settings:

        mysql -u root -p
        CREATE DATABASE wordpress;
        GRANT ALL PRIVILEGES ON wordpress.* TO 'wordpressuser'@'localhost' IDENTIFIED BY 'password';
        FLUSH PRIVILEGES;
        EXIT

3.  Set permissions on the Document Root directory to enable WordPress to complete its configuration steps:

        chmod 777 /var/www/example.com/public_html/

4.  Connect to your Linode's IP address using your web browser, and walk through the configuration steps to fully install WordPress.

    {: .note}
    >In order to ensure that each of your Wordpress instances addresses the local database, you will need to ensure that the Database Host value in this step is set to 'localhost'.  This should be filled in by default.

5.  Configure your Wordpress URL and Site Address via the General Settings in the Wordpress admin interface. Ensure that your domain is configured in both fields.

    [![WordpressURL](/docs/assets/WP-site-address-rs.png)](/docs/assets/WP-site-address.png)

    {: .note}
    >
    >After completing your WordPress installation steps and logging in for the first time, you should reset  permissions on your Document Root directory to ensure additional security. You can do so with the following command.
    >
    >
    >     chmod 755 /var/www/example.com/public_html/

6.  Once the WordPress installation steps have been completed, copy the configurations to your second Linode. Replace "x.x.x.x" with the second Linode's IP address:

        rsync -r /var/www/* x.x.x.x:/var/www/.

        {: .note}
        >If you install new Wordpress themes or plugins, you will need to re-run this command in order to syncronize the changes between your Linodes.

7.  Log in to the second Linode and restart Apache:

        sudo service apache2 restart


You should now be able to visit the new Wordpress site on both of your Linodes, and updates from one Linode should be seen immediately on the other.

##Configure Your Nodebalancer

1.  Visit the NodeBalancers tab in the Linode Manager.

2.  If you have not done so already, add a NodeBalancer, ensuring that it is in the same datacenter as your backend Linodes.

3.  Select your new NodeBalancer, and click "Create Configuration." Edit your configuration settings as follows:

        Port: 80
        Protocol: HTTP
        Algorithm: Least Connections
        Session Stickiness: Table
        Health Check Type: HTTP Valid Status

4.  Once you click the "Save Changes" button, you will be prompted to add your nodes. Provide a unique label for each one, and enter the private network address and port in the address field for each of the nodes.

5.  When you have added both of your nodes, ensure that the health checks mark them as up. Once both nodes are showing as up, return to the NodeBalancer's main page and note the IP address listed. You should now be able to navigate to that IP address and view your webpage.

In order to test the high availability functionality, either stop the Apache2/MySQL services on one of your nodes, or power them down one at a time. The website should continue to be served without issue even when one of the nodes is marked as down.

Congratulations, you have now configured your high availability Wordpress site!