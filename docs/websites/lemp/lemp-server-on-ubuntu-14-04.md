
w to install LEMP Stack on Ubuntu 14.04

LEMP Stack is a group of software that is used to server web applications.LEMP stands for Linux,Nginx (also called Engine X),Mysql and Php.In this guide we will explain how you can install LEMP Stack on Ubuntu 14.04.

Before starting this document please read and complete the [getting started guide](https://www.linode.com/docs/getting-started/).

##Setting up Hostname 
Before you begin installing LEMP STACK make sure you have followed our instructions on [setting up hostname](https://www.linode.com/docs/getting-started#sph_set-the-hostname).Issue the following commands.
~~~
hostname
hostname -f
~~~
##Getting Started

Before we start you should run these commands to ensure that your system's package database is upto date.
~~~
sudo apt-get update
sudo apt-get upgrade
~~~
##Install Nginx

Nginx is lightweight web server as compared to Apache.So our first step is to install Nginx on Ubuntu.
~~~
sudo apt-get install nginx
~~~
This will install Nginx on your server,visit your server Public IP address and you will get a default message of Nginx.If you don’t know your machine public IP use the following command.
~~~
ip addr show eth0 | grep inet | awk ‘{ print $2; }’ | sed ‘s/\/.*$//’
~~~
Open browser and type your server IP and press Enter and you will see a Nginx message if not you need to install it again.

##Install MySQL Database Server

MySQL is the leading open source database server.This is the most popular database server for many web applications like WordPress.Issue the following command to install MySQL server.
~~~
sudo apt-get install mysql-server
~~~
During installation it will ask you to configure MySQL root password.Choose a strong password and if possible use special character like @,$,*,&,#,also keep it save for future.
Now we have installed MySQL server we need to install an additional package so that MySQL can generate directory structure.Issue the command.
~~~
sudo mysql_install_db
~~~
**For security reasons you should perform this step so that you can change MySQL default settings.**
~~~
sudo mysql_secure_installation
~~~
Answer all the question according to your needs.

##Install PHP

Our webserver and database server are ready.Since Nginx does not support php processing we need to install php-fpm where fpm stands for **FastCGI Process Manager**.Type the following to 'install php-fpm'.
~~~
sudo apt-get install php5-fpm php5-mysql
~~~
Now PHP is installed on your machine,our next step is to configure PHP processors so that Nginx can server php files.

##Configuring PHP processor

We need to edit php-fpm configuration file.
~~~
sudo nano /etc/php5/fpm/php.ini
~~~
Now search for the term cgi.fix_pathinfo=1 and change 1 to 0.Now save the file and restart php-fpm processor.
~~~
sudo service php5-fpm restart
~~~
##Configuring Nginx to execute php files

Last and simple step is you need to configure Nginx to execute php files.We need to change the default server block.Type the following in terminal.
~~~
sudo nano /etc/nginx/sites-available/default
~~~
We need to change server block, in index line add index.php and the most important one is to configure Nginx to server php files add the following lines.

{:.file }
/etc/nginx/sites-available/default
: ~~~
	location ~ \.php$ {
	try_files $uri =404;
	fastcgi_split_path_info ^(.+\.php)(/.+)$;
	fastcgi_pass unix:/var/run/php5-fpm.sock;
	fastcgi_index index.php;
	fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
	include fastcgi_params;
	}
~~~

Now restart you Nginx server by typing.
	sudo service nginx restart
If we delete the comments of default file,our default server block looks like.
	{:.file }
/etc/nginx/sites-available/default
: ~~~
	server {
	listen 80 default_server;
	listen [::]:80 default_server ipv6only=on;
	root /usr/share/nginx/html;
	index index.php index.html index.htm;
	location ~ \.php$ {
	try_files $uri =404;
	fastcgi_split_path_info ^(.+\.php)(/.+)$;
	fastcgi_pass unix:/var/run/php5-fpm.sock;
	fastcgi_index index.php;
	fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
	include fastcgi_params;
	}
	}
~~~

##Test if Nginx is executing files or not

Before deploying your applications we should test if Nginx is executing files or not.We will create a simple php file that will display info about PHP.
~~~
sudo nano /usr/share/nginx/html/test.php
~~~
Add the following code in it.
	{:.file }
/usr/share/nginx/html/test.php
: ~~~
	<?php
	phpinfo();
	?>
~~~

Press Ctrl+X and then type y and press Enter again.It will save file.
Now visit your server ip by adding /test.php at the end.For example.
~~~
http://serverip/test.php
~~~
It will display php info.
**For security reasons you should remove this file.**
~~~
sudo rm /usr/share/nginx/html/test.php
~~~

Now we have successfully installed LEMP STACK on Ubuntu 14.04.

###Additional Resources
If you want to deploy more applications.Consider reading the following articles.

-[Basic Nginx Configuration](https://www.linode.com/docs/websites/nginx/basic-nginx-configuration)
-[Nginx and PHP-FastCGI on CentOS 5](https://www.linode.com/docs/websites/nginx/nginx-and-phpfastcgi-on-centos-5)
-[Websites with Nginx on Ubuntu 12.04 LTS ](https://www.linode.com/docs/websites/nginx/websites-with-nginx-on-ubuntu-12-04-lts-precise-pangolin)
