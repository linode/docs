---
author:
 name: Linode Community
 email: docs@linode.com
description: 'NextCloud is an open source solution to hosting your own content online. In addition to the total control users gain over their own files, NextCloud offers customizable security features that allow the user to take control of sharing and access priviledges, among other features.'
keywords: 'nextcloud, cloud, open source hosting'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published:
modified:
modified_by:
  name: Linode
title: 'Own Your Cloud With NextCloud On CentOS 7'
contributor:
   name: Andrew Lescher
   link: [Andrew Lescher](https://www.linkedin.com/in/andrew-lescher-87027940/)
external_resources:
  - '[Using the occ command](https://docs.nextcloud.com/server/12/admin_manual/configuration_server/occ_command.html#http-user-label)'
  - '[Nginx Configuration](https://docs.nextcloud.com/server/12/admin_manual/installation/nginx.html)'
  - '[Enabling SSL](https://docs.nextcloud.com/server/12/admin_manual/installation/source_installation.html#enabling-ssl)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn up to $300 per published guide.*

---

## Introduction To This Tutorial

This guide will acquaint the user with the installation of NextCloud on a CentOS 7 Linux machine. Any special requirements which must be in place in order to successfully complete this tutorial will be defined in the section below.

## Before You Begin

1. Working through this tutorial requires the use of a root user account, and is written as if commands are issued from the root user. Readers choosing to use a limited user account will need to prefix commands with `sudo` where required. Deploying a firewall to protect your system is also recommended, but not required to complete this guide. If you have yet to create a limited user account or setup a firewall, follow the steps in the [Securing Your Server](/docs/security/securing-your-server) guide.

2. The instructions in this guide were written for and tested on CentOS 7 only. These instructions may work for other Fedora-based distros, but this has not been verified.

# Install NextCloud And Pre-Requisites

## Install Pre-Requisites

1. Update the system.

        yum update -y

2. Install the *EPEL* repository.

        yum install epel-release -y

### Install MariaDB Database Server

1. Add the MariaDB 10.2 repository to force the latest 10.2 version installation.

{: .file}
**/etc/yum.repos.d/MariaDB.repo**
~~~ repo
[mariadb]
name = MariaDB-10.2.3
baseurl = http://yum.mariadb.org/10.2.3/centos7-amd64
gpgkey=https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck=1
~~~

2. Install MariaDB and enable the service on system startup.

        yum install mariadb mariadb-server -y
        systemctl start mariadb
        systemctl enable mariadb

3. Setup the MariaDB server by running the mysql secure installation script. Respond to the prompts with the replies shown below.

        mysql_secure_installation

        Enter current password for root (enter for none): ENTER
        Set root password? [Y/n] Y
        Remove anonymous users? [Y/n] Y
        Disallow root login remotely? [Y/n] Y
        Remove test database and access to it? [Y/n] Y
        Reload privilege tables now? [Y/n] Y

4. Create a database and user for NextCloud in MariaDB. Login as "root" and enter the password you just set earlier. Be sure to create a strong password to replace the "CREATE PASSWORD HERE" text.

        mysql -u root -p

        MariaDB [(none)]> CREATE DATABASE nextcloud;
        MariaDB [(none)]> GRANT ALL PRIVILEGES ON nextcloud.* TO 'nextclouduser'@'localhost' IDENTIFIED BY 'CREATE PASSWORD HERE' WITH GRANT OPTION;
        MariaDB [(none)]> FLUSH PRIVILEGES;
        MariaDB [(none)]> quit 

### Install The Apache Web Server

1. Install Apache and enable the service on system startup.

        yum install httpd -y
        systemctl start httpd
        systemctl enable httpd

2. Disable Apache's WebDAV modules to prevent confliction with NextCloud's own WebDAV modules.

        sudo sed -i 's/^/#&/g' /etc/httpd/conf.modules.d/00-dav.conf

3. Restart Apache to reflect changes.

        systemctl restart httpd

### Install PHP 7.1 And Required Modules

1. Add the Remi repository.

        rpm -Uvh http://rpms.remirepo.net/enterprise/remi-release-7.rpm

2. Install the *yum-utils* package.

        yum install yum-utils -y

3. Update the system to populate the Remi repository.

        yum update -y

4. Direct the system to use PHP 7.1 and issue installation command.

        yum-config-manager --enable remi-php71
        yum install php71-php php-mbstring php-zip php71-php-opcache php71-php-mysql php71-php-pecl-imagick php71-php-intl php71-php-mcrypt php71-php-pdo php-ZendFramework-Db-Adapter-Pdo-Mysql php71-php-pecl-zip php71-php-mbstring php71-php-gd php71-php-xml -y

5. The default file upload size php will allow is 2MB. Increase (or decrease) the allowed filesize to your preferred value. The example below will set a 512MB file upload size and no limit for the post size.

        sudo cp /etc/php.ini /etc/php.ini.bak
        sudo sed -i "s/post_max_size = 8M/post_max_size = 0/" /etc/php.ini
        sudo sed -i "s/upload_max_filesize = 2M/upload_max_filesize = 512M/" /etc/php.ini

6. Restart Apache.

        systemctl restart httpd

## Install NextCloud 12

1. As the date of publication, the most current version of NextCloud is 12.0.4 Checking the NextCloud [Download Page](https://nextcloud.com/install/#instructions-server) is recommended before proceeding. Don't forget to replace **x.y.z** in the below commands with the appropriate version number.

        cd /opt
        sudo yum install wget
        wget https://download.nextcloud.com/server/releases/nextcloud-x.y.z.zip

2. Unzip the package.
        
        sudo yum install unzip
        unzip nextcloud-x.y.z.zip 

3. Move the entire unzipped NextCloud folder to the root web directory and grant permissions to the *apache* user for all contents.

        cp -r nextcloud /var/www/html

4. Grant permissions to the NextCloud folder and all its contents to the Apache user. Determine which user Apache is running as by issuing the first command. Replace *apache:apache* in the second command with the output if it differs.

        ps -ef | egrep '(httpd|apache2|apache)' | grep -v `whoami` | grep -v root | head -n1 | groups $(awk '{print $1}')
        
        chown apache:apache -R /var/www/html/nextcloud

5. Complete the NextCloud installation via the command line with the *occ* command. Navigate to the nextcloud root web directory folder before you begin.

        cd /var/www/html/nextcloud
        sudo -u apache php occ maintenance:install --database "mysql" --database-name "nextcloud"  --database-user "nextclouduser" --database-pass "yourpassword" --admin-user "admin" --admin-pass "adminpassword"

6. If the installation is successful, you will receive the following message.

        Nextcloud was successfully installed

7. Since these files are now internet-facing, set stronger permissions to improve security.

        find /var/www/html -type f -print0 | sudo xargs -0 chmod 0640
        find /var/www/html -type d -print0 | sudo xargs -0 chmod 0750

8. Update the URL in the **config.php** file to accommodate for the *nextcloud* subfolder added behind the document root. Match the **overwrite.cli.url** and **htaccess.RewriteBase** lines below to your own file.

{: .file}
**/var/www/html/nextcloud/config/config.php**
~~~ php
. . .

),
  'datadirectory' => '/var/www/html/nextcloud/data',
  'overwrite.cli.url' => 'http://localhost/nextcloud',
  'htaccess.RewriteBase' => '/nextcloud',
  'dbtype' => 'mysql',
  'version' => '12.0.3.3',
  'dbname' => 'nextcloud',

. . .
~~~

9. Update the **.htaccess** file with the URL changes.

        sudo -u apache php /var/www/nextcloud/occ maintenance:update:htaccess

10. Lastly, navigate to your Linode's IP address/nextcloud and the NextCloud website should load with a login page for the admin user you created earlier. You can always check on the status of your NextCloud environment by issuing the below *occ* command.

        sudo -u apache /var/www/html/nextcloud/ php occ status

## Where To Go From Here

Once you have successfully installed you NextCloud environment, you may want to further integrate it into an owned domain name, or make adjustments to you web server to serve SSL encrypted pages. See the [Enabling SSL](https://docs.nextcloud.com/server/12/admin_manual/installation/source_installation.html#enabling-ssl) link in the NextCloud documentation for direction on enabling SSL. Although Apache was used as the web server in this guide, installing NextCloud with Nginx is possible as well. Navigating to the [Nginx Configuration](https://docs.nextcloud.com/server/12/admin_manual/installation/nginx.html) page should provide all the necessary steps to setup NextCloud with Nginx.
