---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Orangescrum is an open source, free project management and collaboration tool for small and medium size businesses. It helps you to manage projects, team, documents, tasks all at one place.'
keywords: 'Orangescrum, project management, Apache'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Weekday, Month 00th, 2016'
modified: Weekday, Month 00th, 2016
modified_by:
  name: Linode
title: 'Manage Projects with Orangescrum on Ubuntu 14.04'
contributor:
  name: Hitesh Jethva
  link: https://github.com/hitjethva
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

##Introduction

Orangescrum is an open source, free project management and collaboration tool for small and medium size businesses. It helps you to manage projects, team, documents, tasks all at one place.
Using OrangeScrum, You can organize your tasks, communicate with the team on important issues, and manage project documents easily.

OrangeScrum provides various features like collaboration, agile project management, issue tracking, notifications, task management, reporting  and traditional project management functionality for small/medium businesses.


## Before You Begin

1. Ensure that you have followed the Getting Started and the Linode’s hostname is set.

To check your hostname run:

	hostname
	hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

2. Update your system:

	sudo apt-get update -y

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


##Requirements

<ul>Server running Ubuntu 14.04
<ul>Static IP Address for your server

##Install Mysql

1. By default mysql package is available in Ubuntu 14.04 repository.

So, you can install mysql using following command:

	sudo apt-get install mysql-server

2. After this, start mysql service and enable mysql to start on boot.

	sudo /etc/init.d/mysql start
	sudo update-rc.d mysql defaults

##Install Php and Apache

1. After installing mysql, you need to install Php and Apache.

To do this run:

	sudo apt-get install   libapache2-mod-php5 php5 php5-cli php5-common php5-gd php5-mcrypt php5-mysql apache2

2. After this, start Apache service and enable Apache to start on boot.

To do this run:

	sudo /etc/init.d/apache2 start
	sudo update-rc.d apache2 defaults


##Download the Orangescrum and Upload it to Apache Web root

1. You can download the orangescrum open source version from url `https://github.com/Orangescrum/orangescrum`.

To download Orangescrum run:

	sudo wget https://github.com/Orangescrum/orangescrum/archive/master.zip

2. After downloading orangescrum, You need to unzip `master.zip`.

To unzip `master.zip` file run:

	sudo unzip master.zip

3. After this, You will find `orangescrum-master` directory.

Now, move this directory with name orangescrumPM to your Apache web root directory.

You can do this by running:

	sudo mv orangescrum-master /var/www/html/orangescrumPM

4. Give proper permission to `orangescrumPM` directory.

	sudo chown -R www-data:www-data /var/www/html/orangescrumPM
	sudo chmod -R 777 /var/www/html/orangescrumPM

##Configure Mysql 

1. First of all you need to setup the MySql root password.

You can do this by running:

	sudo mysql_secure_installation

Answer all the questions shown as below:

Enter current password for root (enter for none): **currentrootpasswd**
Set root password? [Y/n]: **Press Enter**
New password: **rootsqlpasswd**
Re-enter new password: **rootsqlpasswd**
Remove anonymous users? [Y/n]: **Press Enter**
Disallow root login remotely? [Y/n]: **Press Enter**
Remove test database and access to it? [Y/n] : **Press Enter**
Reload privilege tables now? [Y/n] : **Press Enter**

All done! If you've completed all of the above steps, your MySQL installation should now be secure.

2. Now, You need login to mysql, create database and user for orangescrum.

You can do this by running following command:

login to mysql:

	sudo mysql -u root -p

3. create the database with name orangescrum:

	mysql> create database orangescrum;

4. create the user with name orangescrum:

	mysql> create user orangescrum;

5. Grant all privileges while assigning the password:

	mysql> grant all on orangescrum.* to 'orangescrum'@'localhost' identified by 'orangescrum';

6. Exit from the mysql shell:

	mysql> exit

7. Now, You need to import database from `database.sql` file located in `/var/www/html/orangescrumPM` directory.

You can do this by running:

	sudo cd /var/www/html/orangescrumPM/
	sudo mysql -u orangescrum -porangescrum < database.sql

8. Next, By default `STRICT mode` is `On` in Mysql. So you need to disable it.

You can do this by editing `my.cnf` file:

{: .file-excerpt}
/etc/mysql/my.cnf
:       ~~~ ini
	sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES
        ~~~


Save and close the file, restart mysql to reflect changes.

	sudo /etc/init.d/mysql restart

##Configure PHP

1. Now, You need to change the 'post_max_size' and `upload_max_filesize` to `200M` in `php.ini`.

You can do this by editing `php.ini` file:

{: .file-excerpt}
/etc/php5/cli/php.ini
:       ~~~ ini
	post_max_size=200M
	upload_max_filesize=200M
        ~~~


Save and close the file.

##Configure Apache

1. The next step is to add orangescrumPM in apache default configuration file.

You can do this by editing apache2.conf file:

{: .file-excerpt}
/etc/apache2/apache2.conf
:       ~~~ ini
	<Directory "/var/www/html/orangescrumPM">
	Options Indexes ExecCGI MultiViews FollowSymLinks
	AllowOverride All
	Order allow,deny
	Allow from all
	</Directory>
        ~~~

2. When you are finished, It is recommended to check the configuration for syntax.

You can check the syntax of files with following command.

	sudo apachectl configtest

3. After syntax check is done, You need to enable Apache headers and rewrite module.

You can do this by running:

	sudo a2enmod rewrite
	sudo a2enmod headers

4. Now, restart Apache to reflect changes:

	sudo /etc/init.d/apache2 restart


##Configure Orangescrum

1. Now, You need to update the database connection details in `database.php` file.

You can do this by editing `database.php` file.

{: .file-excerpt}
/var/www/html/orangescrumPM/app/Config/database.php
:       ~~~ ini
	class DATABASE_CONFIG {

        	public $default = array(
                	'datasource' => 'Database/Mysql',
	                'persistent' => false,
        	        'host' => 'localhost',
                	'login' => 'orangescrum',
	                'password' => 'orangescrum',
        	        'database' => 'orangescrum',
                	'prefix' => '',
	                'encoding' => 'utf8',
        	);
	}
        ~~~

Save and close the file, when you are finished.

2. Next, you need to provide your valid Gmail ID and Password for SMTP email sending and update the FROM_EMAIL_NOTIFY and SUPPORT_EMAIL.

You can do this by editing `constants.php` file:


{: .file-excerpt}
/var/www/html/orangescrumPM/app/Config/constants.php
:       ~~~ ini
	//Gmail SMTP
	define("SMTP_HOST", "ssl://smtp.gmail.com");
	define("SMTP_PORT", "465");
	define("SMTP_UNAME", "user@gmail.com");
	define("SMTP_PWORD", "**********");

	define('FROM_EMAIL_NOTIFY', 'user@gmail.com'); //(REQUIRED)
	define('SUPPORT_EMAIL', 'user@gmail.com'); //(REQUIRED) From Email
	define("DEV_EMAIL", 'user@gmail.com'); // Developer Email ID to report the application error

	define('SUB_FOLDER', '/');

        ~~~


Save and close the file, when you are finished.

##Testing Orangescrum

1. From remote machine, open your firefox browser and type url `http://your-server-ip-address`

You will be asked to provide your Company Name, Email address and a Password to login and start using Orangescrum. 

After this, You can see the orangescrum welcome page shown in below image.


![Orangescrum Login Page](/docs/assets/orangescrum1.png)
![Orangescrum Home Page](/docs/assets/orangescrum2.png)

##Setup Orangescrum From Web Browser

Now, you need to complete just 3 steps to complete orangescrum setup.

1. First, you need to create and assign project.

To do this, Click on `Create and Assign Project` button and fill up all required information as you wish then click on `create` button.
You can see all the things in below image.

![Orangescrum Create Project Page](/docs/assets/orangescrum3.png)

2. Next, You need to invite some users you wish to add on this project.

To do this, Click on `Invite User` button and give email id and project name of user then click on `add` button.
You can see all the things in below image.

![Orangescrum Invite User Page](/docs/assets/orangescrum4.png)

3. Next, You need to create task and assign it to user.
To do this, Click on `Create Task` button and fill up all information as you wish then click on `post` button.
You can see all the things in below image.

![Orangescrum Invite Create Task Page](/docs/assets/orangescrum5.png)


Finally, Orangescrum is ready to use in production environment.

##Conclusion

In this article, you learned how to setup a popular project management web application orangescrum on Ubuntu-14.04.
It is an awesome and very useful cross platform application which makes project management, bug tracking and time tracking very easy with a bunch of different features. 

**Enjoy!!!**

