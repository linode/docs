---
slug: owncloud-centos
author:
  name: Jack Wallen
  email: jlwallen@monkeypantz.net
description: 'It's easy to get ownCloud working on CentOS Stream. Just follow these steps.'
og_description: 'It's easy to get ownCloud working on CentOS Stream. Just follow these steps.'
keywords: ['owncloud on Centos']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-16
modified_by:
  name: Linode
title: "How to install ownCloud on CentOS Stream"
h1_title: "How to install ownCloud on CentOS Stream"
contributor:
  name: Jack Wallen
  link: Github/Twitter Link
external_resources:
- '[How to Install ownCloud on Ubuntu 20.04](https://www.linode.com/docs/guides/how-to-install-owncloud-ubuntu-20-04/)'
- '[How to Install ownCloud on Debian 10](https://www.linode.com/docs/guides/how-to-install-owncloud-debian-10/)'
---

# How to install ownCloud on CentOS Stream

[ownCloud](https://owncloud.com/) is a self-hosted open source file synchronization and share server. Like commercial subscription-based tools such as Dropbox, Google Drive, and Box, it supports versioning, encryption, and drag and drop uploads. There are good reasons to do so. With more people are working from home, you might want to host your own personal cloud, independent of third-party services. This can provde a level of security and privacy you might not get otherwise.

Anyone can get ownCloud up and running on either an in-house server or a cloud-hosted instance (such as Linode).

This article shows how to install ownCloud on an instance of [CentOS Stream](https://www.centos.org/centos-stream/). Why Stream? Because as of 2021, CentOS is migrating to the rolling release candidate. If you plan to stick with CentOS, consider either converting your standard releases to Stream, or installing a fresh instance of the rolling release.

To install ownCloud on CentOS Stream you install the LAMP stack, set up a database for ownCloud to use, ensure PHP is configured to support it, get ownCloud set up, and finally configure Apache.

## Install the LAMP stack

ownCloud runs on the [LAMP (Linux, Apache, MySQL, PHP) stack](https://www.linode.com/docs/guides/web-servers/lamp/?q=]), so the first step is to ensure that the foundation is in place. You don&#39;t have to use Apache as your web server, but the ownCloud developers find that it performs more reliably than with NGINX and other servers.

Begin that installation by ensuring your server has the Apache web server set up.

From the Linux command line interface, type:

```
sudo dnf install httpd httpd-tools -y
```

When its installation completes, enable and start Apache with the commands:

```
sudo systemctl start httpd

sudo systemctl enable httpd
```

That process should ensure that Apache is installed and running.

Next, update the firewall so that Apache permits HTTP/HTTPS traffic. This can be accomplished with the following commands:

```
sudo firewall-cmd --permanent --zone=public --add-service=http

sudo firewall-cmd --permanent --zone=public --add-service=https

sudo firewall-cmd --reload
```
Make sure you can reach the Apache server. Point a web browser to `http://SERVER` (where SERVER is the IP address of the hosting server). You should see the Apache welcome page.

![The default Apache welcome page on CentOS Stream.](owncloud_centos_a.jpg)

## Install the database

ownCloud requires a database to store data. You can use [MariaDB](https://www.linode.com/docs/guides/databases/mariadb/), [MySQL](https://www.linode.com/docs/guides/databases/mysql/), [PostgreSQL](https://www.linode.com/docs/guides/databases/postgresql/), or [Oracle Database](https://www.linode.com/docs/guides/databases/oracle/), but ownCloud recommends either MariaDB or MySQL. For this example, we use MariaDB.

To install MariaDB, from the Linux command line, issue the command:

```
sudo dnf install mariadb-server mariadb -y
```

Start and enable the database with the commands:

```
sudo systemctl start mariadb

sudo systemctl enable mariadb
```

Set an admin password to secure the database. Type:

```
sudo mysql\_secure\_installation
```

(Note that the command includes `mysql` even though we use MariaDB.)

When prompted, type and verify a new secure password for the MariaDB admin user. The installation prompts you to answer a number of questions, to which you answer `y` (as in `yes`).

## Install PHP

So far the LAMP stack installed includes Apache and a database. Next up is the programming language, PHP 7.4. To install the current version, add the EPEL repository. Type:

```
sudo dnf install epel-release -y
```

CentOS Stream installs PHP 7.2 by default, but PHP 7.4 (or better) is required for ownCloud.

This takes a couple of steps. To reset the PHP modules, type:

```
sudo dnf module reset php
```

Then enable PHP 7.4:

```
sudo dnf module enable php:7.4
```

Finally, install the PHP modules:

```
sudo dnf install php php-opcache php-gd php-curl php-mysqlnd php-intl php-json php-ldap php-mbstring php-mysqlnd php-xml php-zip -y
```

Before you can use PHP 7.4, restart and enable the PHP Fast Process Manager (PHP-FPM). Type:

```
sudo systemctl start php-fpm

sudo systemctl enable php-fpm
```

SELinux needs to allow Apache to execute PHP code via PHP-FPM. To do this, type:

```
sudo setsebool -P httpd\_execmem 1
```

And then restart the Apache web server:

```
sudo systemctl restart httpd
```

## Create the ownCloud database

With the foundation in place, it&#39;s time to create the ownCloud database. That&#39;s accomplished from the database you installed.

To access the MariaDB console use the command:

```
sudo mysql -u root -p
```

From the MariaDB console, create the database:

```
CREATE DATABASE owncloud\_db;
```

Then create a new user:

```
GRANT ALL ON owncloud_db.* TO 'owncloud_user'@'localhost' IDENTIFIED BY 'PASSWORD';
```

Where `PASSWORD` is a strong, unique password.

Flush the privileges with the command:

```
FLUSH PRIVILEGES;
```

Finally, exit the database console. Type:

```
exit
```

## Download, unpack, and move ownCloud

Finally! We can download the latest release of ownCloud. First, check the [ownCloud downloads page](https://download.owncloud.org/community/) to confirm the most recent version. To download ownCloud version 10.5.0 the command is:

```
wget https://download.owncloud.org/community/owncloud-10.5.0.zip
```

From the Linux command line, unzip the downloaded file:

```
unzip owncloud-10.5.0.zip
```

Or if the unzip command isn&#39;t available, you can install it by typing:

```
sudo dnf install zip -y
```

Move the newly created directory to the Apache document root directory with the command:

```
sudo mv owncloud /var/www/html/
```

Change the ownership of the directory. Type:

```
sudo chown -R apache: /var/www/html/owncloud
```

## Create an Apache configuration

Apache doesn&#39;t know about ownCloud yet; if we don&#39;t create a configuration file, it would present a 404 error instead of the ownCloud web installer (or main page).

To create an Apache configuration file, type:

```
sudo nano /etc/httpd/conf.d/owncloud.conf
```

Paste the following text into the new file:

```
Alias /owncloud "/var/www/html/owncloud/"
<Directory /var/www/html/owncloud/>
  Options +FollowSymlinks
  AllowOverride All

 <IfModule mod_dav.c>
  Dav off
 </IfModule>

 SetEnv HOME /var/www/html/owncloud
 SetEnv HTTP_HOME /var/www/html/owncloud

</Directory>
```

Save and close the file.

Restart Apache:

```
sudo systemctl restart httpd
```

Make sure the Apache server can write to the ownCloud directory. Type:

```
sudo setsebool -P httpd\_unified 1
```

Congratulations! You&#39;re officially done with the command line portion of the installation.

## Complete the installation

Confirm that ownCloud is running on your Centos Stream server.

From a web browser, navigate to `http://SERVER/owncloud` where `SERVER` is the IP address of the hosting server. You should see the ownCloud web-based installer ( **Figure B** owncloud\_centos\_b.jpg).

![The ownCloud web-based installer](owncloud_centos_a.jpg)

If the address gives you a permissions error, it means you need to configure SELinux. Do so by typing the following commands from a shell prompt:

```
su
semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/owncloud/data(/.*)?'
semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/owncloud/config(/.*)?'
semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/owncloud/apps(/.*)?'
semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/owncloud/apps-external(/.*)?'
semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/owncloud/.htaccess'
semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/owncloud/.user.ini'

restorecon -Rv '/var/www/html/owncloud/'
exit
```

If SELinux continues to give you problems, you can always (as a last resort) temporarily disable it by running the command:

```
sudo setenforce 0
```

On the web-based installer, create an admin user, and then click MySQL/MariaDB.

In the database configuration section, enter the following:

- User: **owncloud\_user**
- Password: the password you set for the owncloud\_user
- Database: **owncloud\_db**
- Localhost: leave as the default

Click **Finish setup.** When the installation completes, ownCloud prompts you to login with the newly-created admin credentials.

Congratulations, you now have a working instance of ownCloud, running on CentOS Stream. It&#39;s time to celebrate!
