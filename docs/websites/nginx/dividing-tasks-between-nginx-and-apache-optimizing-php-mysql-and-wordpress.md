---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Fine tune Nginx for maximum performance'
keywords: 'nginx,performance,tuning,optimize,web servers'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Thursday, September 24th, 2015'
modified: Thursday, September 24th, 2015
modified_by:
    name: Linode
title: 'Dividing tasks between Nginx and Apache. Optimizing PHP, MYSQL and WORDPRESS '
contributor:
    name: Margot Paon Garcia
    link: https://github.com/margotpaon
---

Hello! I'm Margot Paon Garcia, I have 30 years, I am a system's analyst focused on frontend development for four years, work and live in the city of São Paulo, in São Paulo, in Brazil and I am Brazilian.

The focus of this article is to improve the performance of the **_Apache_** server using **_Nginx_** server and reverse proxy server to store cache and static files **_(Frontend)_** and Apache will take care of the dynamic part of the site and links to databases **_(Backend)_**. Also, will discuss the installation of _WORDPRESS_ (step - by - step), _PHP_ and _MYSQL_ (step - by -Step) and some optimizations for them in other articles.

####What is it?

Apache

When we access a website is created a request that is sent to the server that the site is running, thus performing a processing based on this request and responds to request a service. A Web server is a computer on a network that its function is to provide services to other computers (hosts) and this case is being offered access to a site.

It is the most widely used Apache web server in the world about 66% according to Netcraft

- Creator Rob McCool at the National Center for Supercomputing Applications (NCSA) in 1995
- The origin of the Apache Foundation (Apache Foundation) comes then: Brian Behlendorf and Cliff Skolnick resumed Rob McCool project after his departure from NCSA
- Brian and Cliff took control “patches” (adding features or fixes)
The foundation's name appears to have been based on that feature (patch use), since it can be interpreted as a play on the expression in English “a patchy”. But the name comes from a North American tribe called Apache.
- The Shambhala was a very important change in apache for it is an architecture that best and the apache memory management. It was created by Robert Thau
- Free software which means that anyone can study or change your source code, and you can use it for free.
- Available for Linux (Unix-based systems), Mac OS, Windows, OS / 2 and Novell Netware
- Executes code in PHP, Perl, Shell Script, ASP, Python, Ruby
- HTTP, FTP, POP, SMTP
- process-based web server
- Security with SSL &gt; HTTP + SSL = HTTPS 

**_Nginx_** (pronounced “engine x”)

- Free
- OpenSource
- HTTP server high performance
- reverse proxy
- IMAP / POP3
- Low resource consumption
- Asynchronous architecture to requests for answers
- Simple setup
- It's rich in number of features
- Written by Igor Sysoev in 2005
- event-based web server
- Available for Linux, Windows, MAC OS (via homebrew)
- The Nginx settings can be combined with the LUA language codes
<hr>

### What are your goals in this article?


**_Apache_**

Apache will take care of the backend of our site and / or blog, just processing the PHP code. Also in queries, responses, and changes in the database, or apache will only take care of dynamic data.

**_Nginx_**

Already Nginx will take care of Frontend our site managing static files such as CSS, JavaScript, HTML, images and other content that is not changed. We will also compaction cited these files and Supporting apache being a cache server.

Well without further ado follows what will be done.

My distro at the moment is the **_Debian 8 Jessie_**.

<hr>

### Installing Apache and Nginx

1. Open the command terminal

2. Log in terminal as root with `su` command and place
the administrator password

3. Check if  **_Apache_** and **_Nginx_** are installed with these simple commands

    Apache:
        # apache2 -v (this command will return the following information)
        Server Version: Apache / 2.4.10 (Debian)
        Server Built: 30 Aug 2015 21:52:23

		Note

            The first information is the installed version of Apache is 2.4.10 and the operating system is Debian, followed by the date that the Apache installation was on that machine

    Nginx:
        #nginx -v (this command only speaks what version of installed Nginx)
        nginx version: nginx / 1.6.2

	    Caution
         
             If I get no information or the command message not found. We'll have to do the installation of both or only one.

Of both:

`#aptitude install apache2 nginx`

Apache:

`#aptitude install apache2`

Nginx:

`#aptitude install nginx`

	Note
    
        After installing the servers follow the steps 2.ae 2b to verify that everything worked out! If there is no website to show the localhost then configure the database, configure and install Wordpress, put it essential plugins, install the theme you want and insert text content, image and video (remember to use licensed content for free use).

<hr>

###Minimum requirements to install Wordpress

Check the minimum requirements for installation in Wordpress
localhost, the requirements are Apache, Mysql and of course a Linux Distro forming the LAMP (Linux, Apache, MySQL and PHP) and Nginx
formed the LEMP (Linux, Engine x, MySQL and PHP). The pronunciation of the word Nginx is [engine x] why it has formed the LEMP.

Install php and mysql with in the terminal `#aptutide install php mysql`

Apache:
    # apache2 -v
    Server Version: Apache / 2.4.10 (Debian)
    Server Built: 30 Aug 2015 21:52:23

Nginx:
    #nginx -v
    nginx version: nginx / 1.6.2

MYSQL:
    #mysql V
    mysql See 14:14 Distrib 5.5.44, for debian-linux-gnu (i686) using 6.3 readline

PHP:
    #PHP -v
    PHP 5.6.13 built: 8 Sep 2015 12:31:31
    Zend v2.6.0
        Zend OPcache v7.0.6
        
All right! But it was not mentioned an important thing and the LAMP
PML run inside a virtual machine and the host of this machine is an IMAC with MAC Yoshemite (10.10.3).

Create the info.php file with the contents `<? Php phpinfo ();?>`
Save the root of your apache server if the machine / var / www / html, and may vary Linux distro or even a custom directory.

Open your browser (here is the iceweasel 38.2.1) and access
with the only localhost URL `http: //localhost` . A PHP report, if it goes something like server is not found or not displayed nothing in this report on the terminal type should be displayed:

RESTART_APACHE:
    #service apache2 restart
    
Wait for a while and try again to present the same problem, it is advisable to review the basic Apache configurations and where Apache is pointing as the root directory.

###Installing Wordpress

- Enter http://www.wordpress.org/downloads site and download the latest version of wordpress
- Unzip the .zip file
- If we move the wordpress folder to the / var / www / html
- Open the terminal, run the `mysql` command
- Create a database for WordPress, for example, nginxapache with the command `CREATE DATABASE nginxapache`

		Caution
		    Care Mysql is case sensitive it creates the bank under the name _NginxApache_, will this name to be used everywhere you need it, the same with _NGINXAPACHE_ or _nginxapache_.


Edit the `wp-config-sample.php` file in the directory
`\ var \ wwww \ html \ wordpress`. You can rename the wordpress folder to the site name, for example, `\ var \ www \ html \ MySite \`

     / ** The name of the database for WordPress * /
    define ('DB_NAME', 'nginxapache');

    / ** MySQL database username * /
    define ('DB_USER', 'username');
    // = qual_usuário which manages the user database

    / ** MySQL database password * /
    define ('DB_PASSWORD', 'password');
    ** = Qual_senha which password for this user that manages the database

    / ** MySQL hostname * /
    define ('DB_HOST', 'localhost');
    
Save the file in the same directory but with the name `wp-config.php`
Open your browser and enter the event at `http://localhost/` wordpress that will appear the Wordpress installation screen. Install and configure a theme and at least 7 plugins (which you find in any top 10 for plugins) and how to use the theme Dazzling. Create 5 pages, each with 3 images of at least 1024 x 768 and a text with at least 10 paragraphs (about 1000 words) and attach to the Wordpress navigation menu

<hr>

### Configuring Ngnix as cache server and reverse proxy (optimizing the Front-end of the site)

The serious stuff starts now we edit Nginx configuration file so that it will serve as a cache server, a reverse proxy to communicate with Apache and optimize the Front-end Site. We will also use PHP-FPM.

To install PHP-FPM

`# Aptitude install php-fpm`

Open the nginx configuration file is `/et /nginx/nginx.conf` with your text editor favorite.

The code bellow:

	user       www-data;  ## Default: nobody
	worker_processes  2;  ## Default: 1 number of core's of the your processor
	error_log  logs/error.log;
	pid        logs/nginx.pid;
	worker_rlimit_nofile 40000;

	events {
	  worker_connections  8192;  ## Default: 1024
	  multi_accept on;
	  use epoll;
	}

	http {
	  include    /etc/nginx/mime.types;
	  include    /etc/nginx/proxy_params.conf;
	  include    /etc/nginx/fastcgi_params.conf;
	  index    index.html index.htm index.php;
	  sendfile on;
	  tcp_nopush on;
	  tcp_nodelay on;
	  keepalive_timeout 15;

		# Gzip Configuration.
	    gzip on;
	    gzip_disable "MSIE [1-6]\.";
	    gzip_static on;
	    gzip_vary on;
	    gzip_comp_level 4;
	    gzip_proxied any;
	    gzip_types text/plain
	               text/css
	               application/x-javascript
	               text/xml
	               application/xml
	               application/xml+rss
	               text/javascript;

	    default_type application/octet-stream;
			    log_format   main '$remote_addr $remote_user [$time_local]  $status '
	    '"$request" $body_bytes_sent "$http_referer" '
	    '"$http_user_agent" "$http_x_forwarded_for"';
	    access_log   logs/access.log  main;
	    sendfile     on;
	    tcp_nopush   on;
	    server_names_hash_bucket_size 128; # this seems to be required for some vhosts

	    server { # php-FPM/fastcgi
	        listen       80;
	        server_name  domain1.com www.domain1.com;
	        access_log   logs/domain1.access.log  main;
	        root         html;

	        location ~ [^/]\.php(/|$) {
			    fastcgi_split_path_info ^(.+?\.php)(/.*)$;
		    if (!-f $document_root$fastcgi_script_name)     {
        return 404;
    }

    fastcgi_pass 127.0.0.1:9000;
    fastcgi_index index.php;
    include fastcgi_params;
			}
	    }

	    server { # simple reverse-proxy
	        listen       80;
	        server_name  domain2.com www.domain2.com;
	        access_log   logs/domain2.access.log  main;

	        # serve static files
			  location ~ ^/(images|javascript|js|css|flash|media|static|ico|xml|woff|eot|ttf)/  {
		      root /var/www/wordpress/;
		      expires 30d;
		 }
	     
	     # pass requests for dynamic content to rails/turbogears/zope, et al
	     location / {
		     proxy_pass      http://127.0.0.1:8080;
	     }

		#Aqui configuramos os DNS's que nossa fornece sendo aqueles que começam com NSx.yyy.com ou endereço IP
		127.0.0.1, para que eles sejam usados para load balancing
	    upstream big_server_com {
	        server 127.0.0.3:8000 weight=5;
	        server 127.0.0.3:8001 weight=5;
	        server 192.168.0.1:8000;
	        server 192.168.0.1:8001;
	    }

	    server { # simple load balancing
	        listen          80;
	        server_name     big.server.com;
	        access_log      logs/big.server.access.log main;

	        location / {
	            proxy_pass      http://big_server_com;
	        }
	    }
	}

This setting gave us a gain of 5 seconds from the version without any optimization and using only apache.

Cya!

Margot Paon Garcia

Twitter @margotpaon
 https://github.com/margotpaon

Resources
   Apache  http://www.apache.org
   Nginx  https://www.nginx.com/resources
   Wordpress  https://wordpress.org/
   PHP  http://www.php.net
   Mysql  https://dev.mysql.com/

