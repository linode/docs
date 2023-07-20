---
slug: install-and-configure-owncloud-on-debian-10
description: "A popular Dropbox alternative, ownCloud provides easy and secure file storage and file sharing. Here's how to install it on Debian 10."
keywords: ['ownCloud on Debian']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-01-29
modified_by:
  name: Linode
title: "Installing and Configuring ownCloud on Debian 10"
title_meta: "How to Install and Configure ownCloud on Debian 10"
tags: ["debian"]
aliases: ['/guides/how-to-install-owncloud-debian-10/']
relations:
    platform:
        key: how-to-install-owncloud
        keywords:
            - distribution: Debian 10
authors: ["Jack Wallen"]
---

## What is ownCloud?

With [ownCloud](https://owncloud.com/) you can host a private cloud for data synchronization, file storage, and file sharing. You can use ownCloud as an alternative to commercial services like DropBox or Box. This software is great for secure collaboration across your projects and teams.

ownCloud has plenty of compelling features:

- **Versioning**: A file history permits you to roll back to a previous version.
- **Encryption**: ownCloud protects user data in transit; when it’s transmitted between client and server.
- **Drag and drop upload**: Drag files from your desktop file manager to your ownCloud instance.
- **Theming**: Change the look of your ownCloud instance.
- **Viewing ODF files**: You can view Open Document Format files such as `.odt` documents and `.ods` spreadsheets.
- **Expansion via installable applications**: From within the [ownCloud Marketplace](https://marketplace.owncloud.com/), you can install a number of official and third party applications.
- **A mobile app for [Android](https://play.google.com/store/apps/details?id=com.owncloud.android) and [iOS](https://apps.apple.com/us/app/owncloud-file-sync-and-share/id1359583808)**: Mobile apps allow you to interact with your ownCloud server, such as for syncing, uploading, downloading, and viewing files.

Why would you want to host your own cloud? Some common reasons are:

- To save sensitive data, but not on a third-party, commercial option.
- You work from home and you need a private cloud to be used only by those in your household.
- You own a small business and want to keep everything in-house.
- You need an expandable storage solution.

This tutorial walks you through the steps to install ownCloud on Debian 10, one of the most reliable operating systems on the market. There are only a few steps to install ownCloud on Debian. You [install the LAMP (Linux Apache MySQL/MariaDB PHP) stack](/docs/guides/how-to-install-a-lamp-stack-on-debian-10/); create a database and database user; configure Apache; and set up ownCloud using its graphical user interface.

{{< note >}}
To automatically install ownCloud on a Compute Instance, consider deploying [ownCloud Server through the Linode Marketplace](/docs/products/tools/marketplace/guides/owncloud/).
{{< /note >}}

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
If you have a registered domain name that you want to point to your ownCloud instance, then use the [Linode DNS Manager to point the domain](/docs/products/networking/dns-manager/) to the Linode server on which you plan to install ownCloud. If you do not have a registered domain name, then replace example.com with the IP address of the Linode server when following the steps in the [Create an Apache Configuration File](#create-an-apache-configuration-file) section.
{{< /note >}}

## Install ownCloud
### Install Apache and PHP

In this section, you install the Apache web server and all of the necessary PHP components.

1. [Connect to your Linode via SSH](/docs/products/platform/get-started/#log-in-using-ssh).

1. Install Apache and all the required PHP packages:

        sudo apt-get install apache2 mariadb-server libapache2-mod-php openssl php-imagick php-common php-curl php-gd php-imap php-intl php-json php-ldap php-mbstring php-mysql php-pgsql php-smbclient php-ssh2 php-sqlite3 php-xml php-zip php-apcu -y


1. Once the packages are installed, start and enable Apache with the following commands:

        sudo systemctl start apache2
        sudo systemctl enable apache2


### Install the database

ownCloud relies on a database for storing data. Instead of MySQL, this installation uses MariaDB. MariaDB is a fork of MySQL that places a higher importance on security.

1. Install MariaDB:

        sudo apt-get install mariadb-server -y


1. Start and enable the database with the following commands:

        sudo systemctl start mariadb
        sudo systemctl enable mariadb


1. Set a MariaDB admin password and secure the installation. This is accomplished using a tool borrowed from MySQL:

        sudo mysql_secure_installation


    When prompted, hit **Enter** on your keyboard (as there is no current MariaDB admin password). Answer **y** (as in "yes") to set the admin password, and type and verify a new secure password for the MariaDB admin user. Finally, the database setup prompts you to answer four questions. Answer **y** (as in "yes") to each of these questions.

### Create the ownCloud Database

Now that you have installed the prerequisites, it’s time to create the ownCloud database and user. The commands in this section are issued from within the MariaDB console.

1. Access the MariaDB console:

        sudo mysql -u root -p


1. create your ownCloud database:

        CREATE DATABASE ownclouddb;


1. Create a new user with the necessary privileges, including a strong and unique password. Be sure to substitute `PASSWORD` with your own password:

        GRANT ALL ON ownclouddb.* TO 'ownclouduser'@'localhost' IDENTIFIED BY 'PASSWORD';


1. Flush your database's privileges:

        FLUSH PRIVILEGES;


1. Finally, exit the database console:

        exit


### Download ownCloud

At this point, the system is ready for ownCloud. Before you actually download the software, check the [ownCloud downloads page](https://owncloud.com/download-server/) to confirm the most recent version.


1. Download ownCloud. As of writing this guide, the latest version is 10.5.0. Replace `10.5.0` with the version you want to download.

        wget https://download.owncloud.org/community/owncloud-10.5.0.zip


1. Unzip the downloaded file:

        unzip owncloud-10.5.0.zip

    {{< note respectIndent=false >}}
If necessary, install `unzip` with the command:

    sudo apt-get install zip -y

{{< /note >}}

1. When you unzip the file, a new directory named `owncloud` is created. Move the new directory to the Apache document `root`. This example uses the default directory for Apache site files:

        sudo mv owncloud /var/www/html/


1. Change the ownership of the `owncloud` directory:

        sudo chown -R www-data: /var/www/html/owncloud

### Create an Apache Configuration File

Apache requires a [virtual host configuration file](https://httpd.apache.org/docs/2.4/vhosts/examples.html) in order to server your ownCloud instance to the web.

1. Create an Apache configuration file using the Nano text editor:

        sudo nano /etc/apache2/sites-available/owncloud.conf


1. Paste the following text into the new file. Replace mentions of `example.com` with your own domain name or your [Linode's IP Address](/docs/guides/find-your-linodes-ip-address/):

{{< file "/etc/apache2/sites-available/owncloud.conf">}}
<VirtualHost \*:80>
     ServerAdmin admin@example.com
     DocumentRoot /var/www/html/owncloud
     ServerName example.com
    <Directory /var/www/html/owncloud>
         Options FollowSymlinks
         AllowOverride All
         Require all granted
     </Directory>

ErrorLog ${APACHE_LOG_DIR}/example.com_error.log

CustomLog ${APACHE_LOG_DIR}/your-domain.com_access.log combined

</VirtualHost>
{{</ file >}}

1. Save and close the file by typing **Ctrl + O** and then, **Ctrl + X**:

1. Enable the `rewrite`, `mime`, and `unique_id` Apache modules:

        sudo a2enmod rewrite mime unique_id

1. Restart the Apache server:

        sudo systemctl restart apache2

The command line portion of the installation is complete.

### Configure ownCloud

This section covers the web-based portion of the installation.

1. Open a web browser and navigate to your site's domain, if it has been configured to use one `http://example.com/owncloud`. If you configured Apache to point to your server's IP address, navigate to `http://192.0.2.0/owncloud` and replace the example IP address with your own. You should see the ownCloud web-based installer.

1. Type a username and password for the admin user; click the `Storage & Database` drop-down; and then click `MySQL/MariaDB`.

1. The database information section is now available. Enter the following information:

    - Database User: `ownclouduser`
    - Database password: the password you set for the ownCloud database user
    - Database: `ownclouddb`
    - Localhost: leave as the default

    ![The database details section for the ownCloud installation](ownCloud_Debian_003.jpeg  "The database details section for the ownCloud installation")

1. Click **Finish setup**. When the install completes, the ownCloud login page appears. Login with the newly-created admin credentials. Once logged in, you are taken to the main ownCloud page.

    ![ownCloud is installed and ready to use as your private cloud](ownCloud_Debian_004.jpeg "ownCloud is installed and ready to use as your private cloud")

You now have a working instance of ownCloud, running on Debian 10.
