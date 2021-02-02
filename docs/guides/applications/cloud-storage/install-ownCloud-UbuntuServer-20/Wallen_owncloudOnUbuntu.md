author:
  name: Jack Wallen
  email: jlwallen@monkeypantz.net
description: 'Installing ownCloud on Ubuntu Server 20.04 is incredibly easy. Just follow these steps.'
keywords: "owncloud on Ubuntu"
license:  guides/applications/cloud-storage/
Author: Jack Wallen
published:
modified_by:
  name: Linode
title: 'How to install ownCloud on Ubuntu Server 20.04'
contributor:
  name: Jack Wallen
  link:
external_resources:
  - '[Link Title 1](http://www.example.com)'
  - '[Link Title 2](http://www.example.net)'
---

# How to install ownCloud on Ubuntu Server 20.04

By Jack Wallen

Deck/social: Installing ownCloud on Ubuntu Server 20.04 is incredibly easy. Just follow these steps.

[ownCloud](https://owncloud.com/) is a self-hosted open source file synchronization and share server that helped spin off the likes of [Nextcloud](https://nextcloud.com/). ownCloud is a great way to host your own personal cloud, with support for versioning, encryption, drag and drop uploads, a mobile app, and app installation. Because anyone can install ownCloud on off-the-shelf hardware (or spin it up on a cloud-hosted instance, such as Linode), it&#39;s a popular option.

There are plenty of reasons to choose a personal cloud. You might prefer to store sensitive data somewhere other than third-party, commercial options. Security and privacy are additional factors; an in-house cloud can help you feel safe that your information is secure. Or maybe you want a private cloud to be used only by your family or small business; why pay for storage when only a few people need to access it?

This article shows you how to install ownCloud on one of the most user-friendly server operating systems available, Ubuntu Server 20.04.

To install ownCloud on Ubuntu Server you install the LAMP stack, set up a database for ownCloud, ensure PHP is configured to support the software, set up ownCloud, and finally configure Apache.

Let&#39;s get to work.

## Install the LAMP stack

ownCloud requires a full LAMP (Linux, Apache, MySQL, PHP) stack, so the first step is to install this foundation. Although you don&#39;t have to use Apache as the web server, the ownCloud developers highly recommend it over web servers like NGINX and lightHTTP.

With Ubuntu Server, the entire LAMP stack can be installed with the single command:

```
sudo apt-get install lamp-server^ -y
```

When the LAMP stack installation completes, enable and start Apache with the commands:

```
sudo systemctl start apache2

sudo systemctl enable apache2
```

That is everything you need for the basic LAMP stack functionality.

Start and enable the database with the commands:

```
sudo systemctl start mysql

sudo systemctl enable mysql
```

Set an admin password to secure the database:

```
sudo mysql\_secure\_installation
```

During this process, the system asks if you want to enable the `VALIDATE PASSWORD COMPONENT` – a feature that ensures all passwords used are strong and unique. Answer `n` (as in &quot;no&quot;). When prompted, type and verify a new secure password for the MySQL admin user. You are then prompted to answer four questions, to all of which you should respond `y` (as in &quot;yes&quot;).

## Install PHP

The server now has the full LAMP stack installed and the database secured. Next is the PHP installation, which is required for ownCloud to function properly.

Install PHP and the necessary modules with the command:

```
sudo apt-get install php php-opcache php-gd php-curl php-mysqlnd php-intl php-json php-ldap php-mbstring php-mysqlnd php-xml php-zip -y
```

Restart Apache with the command:

```
sudo systemctl restart apache2
```

## Create the ownCloud database

With the LAMP stack in place, it&#39;s time to create the ownCloud database. That&#39;s accomplished from within the MySQL console. To access the console, issue the command:

```
sudo mysql -u root -p
```

From here, create the database with:

```
CREATE DATABASE ownclouddb;
```

Create a new user, including a strong, unique password:

```
CREATE USER &#39;ownclouduser&#39;@&#39;localhost&#39; IDENTIFIED WITH mysql\_native\_password BY &#39;password&#39;;
```

Grant the necessary database privileges:

```
GRANT ALL PRIVILEGES ON ownclouddb.\* TO &#39;ownclouduser&#39;@&#39;localhost&#39;;
```

Flush the privileges with the command:

```
FLUSH PRIVILEGES;
```

Finally, exit the database console:

```
exit
```

## Download, unpack, and move ownCloud

At this point, the system is set up to support the software. It&#39;s time to download the latest release of ownCloud. Before you actually download the application, check the [ownCloud downloads page](https://owncloud.com/download-server/) to confirm its most recent version.

To download ownCloud version 10.5.0 the command is:

```
wget https://download.owncloud.org/community/owncloud-10.5.0.zip
```

Unzip the downloaded file:

```
unzip owncloud-10.5.0.zip
```

If unzip isn&#39;t available, install it by typing:

```
sudo apt-get install zip -y
```

Move the newly created owncloud directory to the Apache document root (the directory that serves as the default location for websites) with the command:

```
sudo mv owncloud /var/www/html/
```

Change the ownership of the owncloud directory. Type:

```
sudo chown -R www-data: /var/www/html/owncloud
```

## Create an Apache configuration file

Apache needs to know about ownCloud, which requires a configuration file; otherwise it would present a 404 error in the web browser.

To create an Apache configuration file, type:

```
sudo nano /etc/apache2/sites-available/owncloud.conf
```

Paste the following text into the new file:

```
\&lt;VirtualHost \*:80\&gt;

     ServerAdmin admin@your\_domain.com

     DocumentRoot /var/www/html/owncloud

     ServerName your-domain.com

    \&lt;Directory /var/www/html/owncloud\&gt;

         Options FollowSymlinks

         AllowOverride All

         Require all granted

     \&lt;/Directory\&gt;

ErrorLog ${APACHE\_LOG\_DIR}/your-domain.com\_error.log

CustomLog ${APACHE\_LOG\_DIR}/your-domain.com\_access.log combined

\&lt;/VirtualHost\&gt;
```

Save and close the file.

Restart Apache:

```
sudo systemctl restart apache2
```

Congratulations! You&#39;ve completed the command line portion of the installation.

## Finish up the installation

From a web browser, navigate to `http://SERVER/owncloud` where SERVER is the IP address of the hosting server. You should see the ownCloud web-based installer.

![The ownCloud web-based installer](owncloud_ubuntu_a.jpg)

Type a username and password for the admin user, and then enter the following:

- Database User: ownclouduser
- Database Password: the password you set for the ownclouduser
- Database: ownclouddb
- Localhost: leave as the default

Click Finish setup. When the install completes, ownCloud prompts you to login with the newly-created admin credentials. Upon successful login, you&#39;ll find yourself on the main ownCloud page.

![OwnCloud is installed and ready to be used](owncloud_ubuntu_b.jpg)

Congratulations, you now have a working instance of ownCloud, running on Ubuntu Server 20.04.