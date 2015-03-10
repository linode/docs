#How to install LEMP Stack on Ubuntu 14.04

LEMP Stack is a group of software that is used to server web applications.LEMP stands for Linux,Nginx (also called Engine X),Mysql and Php.In this guide we will explain how you can install LEMP Stack on Ubuntu 14.04.

##Getting Started

A non-root user with sudo privileges available.
Connect to your server using SSH and follow this guide

##Install Nginx

Since we are installing software using apt first time we should update the package index.
	'sudo apt-get update'
Nginx is lightweight web server as compared to Apache.So our first step is to install Nginx on Ubuntu.
	'sudo apt-get install nginx'

This will install Nginx on your server,visit your server Public IP address and you will get a default message of Nginx.If you don’t know your machine public IP use the following command.
	' ip addr show eth0 | grep inet | awk ‘{ print $2; }’ | sed ‘s/\/.*$//’ '
Open browser and type your server IP and press Enter and you will see a Nginx message if not you need to install it again.

##Install Mysql

We have installed Nginx,Our next step is to install Mysql to store data.Type the following to install Mysql
	'sudo apt-get install mysql-server'
it will ask you to configure root password for Mysql.After that we need to install Mysql Database so that it can generate directory structure.
	'sudo mysql_install_db'
**For security reasons you should perform this step so that you can change MySQL default.**
	'sudo mysql_secure_installation'
Then type you MySQL root password and it will ask you to change root password simply type N and press enter after that press enter for other queries it will change settings to default one.

Now we have installed MySQL next step is to install PHP.

##Install PHP

Our webserver and database management is ready and our next step is to install PHP. Since Nginx does not support php processing we need to install php-fpm where fpm stands for **FastCGI Process Manager**.Type the following to 'install php-fpm'.
	sudo apt-get install php5-fpm php5-mysql
Now PHP is installed on your machine,our next step is to configure PHP processors so that Nginx can server php files.

##Configuring PHP processor

We need to edit php-fpm configuration file.
	'sudo nano /etc/php5/fpm/php.ini'
Now search for the term cgi.fix_pathinfo=1 and change 1 to 0.Now save the file and restart php-fpm processor.
	'sudo service php5-fpm restart'

##Configuring Nginx to execute php files

Last and simple step is you need to configure Nginx to execute php files.We need to change the default server block.Type the following in terminal.
	'sudo nano /etc/nginx/sites-available/default'
We need to change server block, in index line add index.php and the most important one is to configure Nginx to server php files add the following lines.
	'location ~ \.php$ {
	try_files $uri =404;
	fastcgi_split_path_info ^(.+\.php)(/.+)$;
	fastcgi_pass unix:/var/run/php5-fpm.sock;
	fastcgi_index index.php;
	fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
	include fastcgi_params;
	}'
Now restart you Nginx server by typing.
	sudo service nginx restart
If we uncomment the line our default server block looks like.
	'server {
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
	}'

##Test if Nginx is executing files or not

Before deploying your applications we should test if Nginx is executing files or not.We will create a simple php file that will display info about PHP.
	'sudo nano /usr/share/nginx/html/test.php'
Add the following code in it.
	'<?php
	phpinfo();
	?>'
Press Ctrl+X and then type y and press Enter again.It will save file.
Now visit your server ip by adding /test.php at the end.For example.
	'http://serverip/test.php'
It will display php info.**For security reasons you should remove this file.**
	'sudo rm /usr/share/nginx/html/test.php'
