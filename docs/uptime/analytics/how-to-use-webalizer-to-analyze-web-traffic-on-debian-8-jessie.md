---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This tutorial explains how to configure Webalizer to process Nginx logs on Debian 8. Webalizer is a popular web traffic analysis tool that has the advantage of being lightweight yet powerful, so it is capable to deliver in-depth analysis without using any significant amount of resources.'
keywords: 'Webalizer, traffic analysis, access log, Nginx, reports'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Weekday, Month 00th, 2016'
modified: Weekday, Month 00th, 2016
modified_by:
  name: Linode
title: 'How to Use Webalizer to Analyze Web Traffic on Debian 8 (Jessie)'
contributor:
  name: Frederick Jost Zweig
  link: https://github.com/Fred-Zweig
  external_resources:
- '[Official Webalizer website](http://www.webalizer.org/download.html)'
- '[Official Webalizer repository](ftp://ftp.mrunix.net/pub/webalizer/)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>


# How to Use Webalizer to Analyze Web Traffic on Debian 8 (Jessie)

## Introduction

Webalizer is a very popular web log analysis tool. It uses web server logs to generate detailed reports about the total number of visits to a website, unique visitors, visited pages, browsers used, visitors' countries, amount of downloaded data, etc. Results are presented as tables and charts and are organized by different time frames, such as by month, day or hour. 

There are alternative tools for web traffic analysis that involve the insertion of some 3rd party *java script* code into the web pages, but apart from the privacy issue, these methods lead to increased web page complexity and can in some cases slow down a website. When properly configured, Webalizer has no negative impact on the site performance since it doesn't directly interact with it or with the web server; instead it analyzes server logs at specific moments, when the server is less busy.

This tutorial will explain how to install Webalizer on a Debian 8 server, and how to configure it to process Nginx access logs. 

## Before You Begin

This tutorial expects that you have ssh access to your server with Debian 8 (Jessie) installed. You'll also need the following:

*   **a LEMP (Linux, Nginx (pronounced "engine x"), MySQL, PHP) stack**. To install a LEMP stack you can follow [this tutorial](https://www.linode.com/docs/websites/lemp/lemp-server-on-debian-8). However, you can skip the Nginx configuration because we'll address it later on in this tutorial.
*   **a non-root user with sudo priviledges**. To create a non-root user with sudo privileges you can follow the steps in [this tutorial](https://www.linode.com/docs/tools-reference/linux-users-and-groups).

## Install and Configure Webalizer

1.  Webalizer is included in the Debian 8 repositories, so to install it just run:

		sudo apt-get install webalizer

	To make Webalizer report the countries of your website's visitors you have to enable the `DNSCache` directive in the main configuration file: `/etc/webalizer/webalizer.conf `. This way Webalizer will do reverse DNS lookups for any IP address found in the log file in order to determine the country of origin for any user visiting the site. For this to work you have to specify a DNS cache file where Webalizer will store the DNS data for future use.

2.  First make a directory to contain the DNS cache file:

		cd /var/log
		sudo mkdir webalizer

3.  It's recommended to restrict access to this directory, so change permissions:

		sudo chmod 750 webalizer

4.  Create a file called `dns_cache.db` inside the `webalizer` directory:

		cd webalizer
		sudo touch dns_cache.db

5.  Restrict access to `dns_cache.db`:

		sudo chmod 640 dns_cache.db

6.  For Webalizer to correctly identify the geographic location of any IP in the log, its native geolocation service must also be enabled in the main configuration file. Before doing this you have to download the latest Webalizer GeoDB database from the [official Webalizer website](http://www.webalizer.org/download.html):

		cd /tmp
		wget ftp://ftp.mrunix.net/pub/webalizer/webalizer-geodb-latest.tgz

7.  Extract the files from archive:

		tar -xvf webalizer-geodb-latest.tgz

8.  You have to save the `GeoDB.dat` file in the  `/usr/share/GeoDB` directory. So first create the directory:

		cd /usr/share
		sudo mkdir GeoDB 

9.  Move the `GeoDB.dat` file to the newly created directory:

		sudo mv /tmp/GeoDB.dat /usr/share/GeoDB

10.  The files used by Webalizer should be owned by 'root', so change ownership:

		sudo chown root:root GeoDB.dat

11.  Now open the main configuration file using 'nano' or other text editor:

		sudo nano /etc/webalizer/webalizer.conf

12.  First you have to specify the name of the history file produced by Webalizer, which will contain the data for previous months and will be used to generate the `index.html` page, the main page of the reports. The default name is `webalizer.hist` and it will be stored in the output directory for Webalizer that we'll specify later on. So, the history file directive should look as follows:

		HistoryName	 webalizer.hist

13.  Generally, web servers don't write access data to one big log file. When log files reach a certain dimension they are rotated and Webalizer must find a way to analyze the new files resulted after rotation. So, it saves its internal state before exiting and then restores it on the next run so as to continue data processing where it left off. The file `webalizer.current` is used to store the current state data, and is located in the output directory of Webalizer. To enable the incremental processing of logs, change the directive to look like this:

		Incremental	yes

14.  Next, you have to specify the location of the `dns_cache.db` file you previously created:

		DNSCache	/var/log/webalizer/dns_cache.db

15.  The `DNSChildren` setting will specify the number of child processes Webalizer is allowed to run in order to perform the DNS lookups. A large number of processes may affect normal system operations, so a reasonable number of child processes would be between 5 and 20. Let's set 10:

		DNSChildren	  10

16.  As mentioned earlier, to make Webalizer correctly identify the visotors' country, the native geolocation service must be enabled. This will be done using the `GeoDB` directive:   

		GeoDB		yes

	The next setting is the name and location of the GeoDB database to be used. The GeoDB database is the `GeoDB.dat` file that you downloaded earlier; so, since you are using the default name and location for this database, which is `/usr/share/GeoDB/GeoDB.dat`, you don't need to specify it again in this section.

17.  Another adjustment that you may want to make is to tell Webalizer not to display the 'Top Users' table. If you protect the Webalizer subdirectory with HTTP authentication to prevent any random visitor to access the site's statistics, the 'Top Users' table will contain the login usernames of all the users who accessed the Webalizer report through HTTP authentication; this usernames, although not shown together with their respective passwords, represent sensitive information that is safe not to display in a report. To disable the 'Top Users' table, you just have to set the `TopUsers` parameter (located approximately on the 480th row of the `webalizer.conf` file) to 0:

		TopUsers     0

18.  You must also adjust the list of search engines and their respective query strings. This list allows Webalizer to identify the search strings used by visitors to find the site. The first word in this list is a substring used by Webalizer to pick out the search engine in the 'referer' section of each log entry, while the second is the URL variable used by that search engine to define its search terms. So, find the list of search engines that begins with this line:

		SearchEngine	.google.	q=

	Replace it with this more up-to-date list:

	{: .file-excerpt }
	/etc/webalizer/webalizer.conf
	:   ~~~ conf
		. . .
		
		SearchEngine    facebook.       q=
		SearchEngine    fastbrowsersearch.com q=
		SearchEngine    image.youdao.com        q=
		SearchEngine    kvasir.no       q=
		SearchEngine    eureka.com      q=
		SearchEngine    hotbot.com      MT=
		SearchEngine    infoseek.com    qt=
		SearchEngine    mamma.com       query=
		SearchEngine    sensis.com.au   find=
		SearchEngine    frontier.com    q=
		SearchEngine    pavlovmedia.com q=
		SearchEngine    zoominternet.net        q=
		SearchEngine    mediacomcable.com       q=
		SearchEngine    webcache.googleusercontent.com  q=
		SearchEngine    .google.     q=
		SearchEngine    .yahoo.      p=
		SearchEngine    yahoo.com       p=
		SearchEngine    bingj.  q=
		SearchEngine    bing.   q=
		SearchEngine    msn.com         q=
		SearchEngine    about.com       terms=
		SearchEngine    alltheweb.com   q=
		SearchEngine    altavista.com   q=
		SearchEngine    aol.com         query=
		SearchEngine    ask.com         q=
		SearchEngine    ask.co          q=
		SearchEngine    aolsearch.      query=
		SearchEngine    looksmart.com   qt=
		SearchEngine    lycos.com       query=
		SearchEngine    netscape.com    query=
		SearchEngine    search.com      q=
		SearchEngine    search.alot.    q=
		SearchEngine    search.comcast.net      q=
		SearchEngine    search.conduit. q=
		SearchEngine    search.pro      q=
		
		. . .
		~~~

	It is worth mentioning that in many cases, depending on the type of browsers and their user-defined settings, the browser will send request headers in which it will include the domain of the search engine that was used, but not the actual search terms. In this case Webalizer will know the search engine used to find the site but not the actual search terms. Webalizer only reports search terms when they are sent by browsers in the request headers.

	You can save and exit the file now.

## Configure Nginx

The next step is to configure Nginx but before doing this you have to create the output directory for Webalizer.

### Create the Webalizer Output Directory

	The web server will be configured so that the Webalizer reports will be accessible on a subdirectory of the website (something like 'www.example1.com/webalizer') which will be in fact the alias of the Webalizer output directory, so, for safety reasons it's a good idea to name the alias something different than 'webalizer', for example 'up-webalizer', or anything similar but difficult to guess. This way you'll prevent unauthorised users to even reach the reports. Of course the main security measure will be to protect the reports directory with http authentication so that only users with a valid username and password can get access to these reports, as we'll exaplain below.

	As about the location of the output directory, this can be `/var/log/sites/example1.com`. So, Webalizer will put the report files it will generate in `/var/log/sites/example1.com/webalizer`. The reports will be accessible by typing `www.example1.com/up-webalizer` in a web browser and then authenticating with a username and password.

1.  You can create with one command the Webalizer output directory, the `logs` directory that will hold the access logs of `www.example1.com`, and the parent directories like this:

		cd /var/log
		sudo mkdir -p sites/example1.com/{webalizer,logs}

2.  Change ownership for all the newly created directories so as to make the Webalizer reports accessible on the web:

		sudo chown -R www-data:www-data sites

	Now let's configure the web server.

### Configure Nginx

	The first thing you want to do is to set usernames and passwords for http authentication for all the users that will be given access to the Webalizer reports. 

1.  Create the directory that will hold the username and password files:

		cd /etc/nginx
		sudo mkdir httppass

2.  Change ownership and permissions:

		sudo chown www-data:www-data httppass
		sudo chmod 700 httppass

3.  Switch to the newly created directory:

		cd httppass

4.  To generate passwords with the `htpasswd` tool you need to have the `apache2-utils` package installed. If it's not already installed just run:

		sudo apt-get install apache2-utils

5.  Now let's suppose you want to give permission to the user `sammy`. Run the following command:

		htpasswd -c /etc/nginx/httppass/passwd1 sammy

	This command will prompt you to type and retype a password for the user 'sammy' and it will create a file called `passwd1` to store the username followed by the password hashed using the default MD5 algorithm. The content of the file will look something like this:

	{: .file }
	/etc/nginx/httppass/passwd1
	:   ~~~ conf
	
		sammy:$apr1$dNwvAUPd$JROs/szkb7MAqN99/sNCm1
		~~~

6.  To add the credentials for a new user `jerry` to the `passwd1` file you must run:
 
		htpasswd /etc/nginx/httppass/passwd1 jerry

	If you have a website for which you want the users 'sammy', 'jerry' and 'alice' to access the Webalizer reports, you have to create a password file that will contain the credentials of all the three users. This file will be referenced in the web server configuration for the respective website. Generally, for each website there will be a different set of users with access to the traffic reports, so, for each website you may need to create a different password file containing a different set of users. 

7.  Don't forget to change ownership and restrict permissions for all password files. If you have let's say three files, you should run:

		sudo chown www-data:www-data passwd1 passwd2 passwd3
		sudo chmod 600 passwd1 passwd2 passwd3

	It should be noted however that when the username and password are sent by the browser, they are Base64 encoded but not encrypted, so, to increase security for http basic access authentication it is generally recommended to use it in conjunction with the https protocol.

8.  The next step is to disable the default 'access log' and 'error log' settings in the `nginx.conf` file, because they will be specified for each site in their respective server block in the Nginx main configuration file. Open the `/etc/nginx/nginx.conf` file:

		sudo nano /etc/nginx/nginx.conf

9.  In the `# Logging Settings` section comment out the `access_log` and the `error_log` rows. They should look like this:

	{: .file-excerpt }
	/etc/nginx/nginx.conf
	:   ~~~ conf
	
		# access_log /var/log/nginx/access.log;
		# error_log /var/log/nginx/error.log;
		~~~

	You can save and exit the file.

10.  Now open the `/etc/nginx/sites-enabled/default` file:

		sudo nano /etc/nginx/sites-enabled/default

	This file will contain the server blocks for all the websites served by Nginx. The server block for `www.example1.com` should look similar to this:

	{: .file-excerpt }
	/etc/nginx/sites-enabled/default
	:   ~~~ nginx
	
		server {
				listen 80;
				listen [::]:80;
				server_name www.example1.com;
				
				root /var/www/example1.com;
				port_in_redirect off;
				index index.php;
				
				location / {
						try_files $uri $uri/ /index.php?$args;
				}
				
				location ~ \.php$ {
				  try_files $uri =404;
				  fastcgi_split_path_info ^(.+\.php)(/.+)$;
				  include fastcgi_params;
				  fastcgi_index index.php;
				  fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
				  fastcgi_pass unix:/var/run/php5-fpm.sock;
				}
				
				access_log  /var/log/sites/example1.com/logs/access.log;
				error_log  /var/log/nginx/example1.com.error.log notice;
				
				location /up-webalizer {
					auth_basic "Restricted";
					auth_basic_user_file /etc/nginx/httppass/passwd1;
					alias /var/log/sites/example1.com/webalizer/;
					index index.html;
				  }        
		}
		~~~

	Please note the `access_log` and the `error_log` directives that specify the name and location of the respective log files. Also note the `location /up-webalizer` section that tells Nginx to serve the Webalizer reports on the `up-webalizer` subdirectory of the current website, which is an alias of the Webalizer output directory. The `auth_basic` directive denies access to this directory to users not having their username and password stored in the `passwd1` file. 

11.  After saving and exiting the file, don't forget to restart Nginx:

		sudo systemctl restart nginx

	To conclude this section about the web server configuration we must point out that the configuration we described above aplies to any web server setup except the situation in which a cache proxy server like Varnish is placed in front of the web server. In this case, the access log files should be written by the cache server, since it will be the one to receive all the http requests while the web server will receive just a small fraction of these requests, namely those for pages that will not be found in cache. So, the name, location and format of the access log files can remain the same but the directives that specify them will not be included in the Nginx configuration; they will be specified in the cache server configuration.

	Another thing to note is that the Webalizer related directives in the Nginx 'server' block that we described above for a HTTP website, are the same for HTTPS websites.

## Write the Webalizer Script

1.  The next step is to write a script that will run Webalizer periodically, for every website hosted on the server. You can name this script anyway you like and you can save it in any location, but let's say you name it `webalizer-script.sh` and you save it in a directory called `scripts` located in `/var`. First let's create the directory:

		cd /var
		sudo mkdir /scripts

2.  Then switch to the newly created directory and create the script:

		cd /scripts
		sudo touch webalizer-script.sh

3.  Change permissions:

		sudo chmod 750 webalizer-script.sh

4.  Open the script for editing:

		sudo nano webalizer-script.sh

	This script will contain the commands used to run webalizer for each individual website. It should look like this:

	{: .file-excerpt }
	/var/scripts/webalizer-script.sh
	:   ~~~ conf
	
		#!/bin/sh
		
		webalizer -n www.example1.com -o /var/log/sites/example1.com/webalizer /var/log/sites/example1.com/logs/access.log
		webalizer -n www.example2.com -o /var/log/sites/example2.com/webalizer /var/log/sites/example2.com/logs/access.log
		
		. . .
		~~~

	Let's see what these commands mean.

	The format of the command that starts Webalizer is:

		webalizer [options ...] [log-file]

	`options` is one or more of the options supported by Webalizer, which alter the way it runs. `log-file ` is the name of the log file to be processed. The two options that we used were:

	*   `-n name` - This option specifies the hostname for the reports. The hostname appears in the title of all reports, and is also prepended to URLs in the reports.
	*   `-o dir` - This option specifies the output directory for the reports. 

	So, to make Webalizer analyze the access log of `www.example1.com`, which is `/var/log/sites/example1.com/logs/access.log`, and save the traffic statistics it generates in the `/var/log/sites/example1.com/webalizer` directory, the command must be:

		sudo webalizer -n www.example1.com -o /var/log/sites/example1.com/webalizer /var/log/sites/example1.com/logs/access.log

	You can save and exit the file.

## Configure Logrotate

To prevent logs to grow indefinitely and fill useful disk space, Debian uses a process called 'logrotate' to compress and rotate log files.

Periodically a new logfile is created and the old logfile is renamed by appending  a '1' to its name. Thus 'access.log' becomes 'access.log.1'. Each time a new log file is created, the numbers in the file names of old logfiles are increased by one, so the files 'rotate' through the numbers. Older log files are also archived and when the number of archives reaches a certain threshold, the oldest archives are deleted one by one.

When it runs, 'logrotate' checks the configuration directory: `/etc/logrotate.d`, where many applications store configuration files that specify the way 'logrotate' will handle their logs. Nginx will store its own logrotate configuration file in the `/etc/logrotate.d` directory.  This file must instruct 'logrotate' to rotate the logs so that Webalizer would have the opportunity to analyze them before the actual rotation takes place. This way Webalizer will not miss any log entries because of the rotation process. 

1.  Open the `/etc/logrotate.d/nginx` file:

		sudo nano /etc/logrotate.d/nginx

2.  At the end of the file, add a configuration block similar to this:

	{: .file-excerpt }
	/etc/logrotate.d/nginx
	:   ~~~ conf
		. . . 
		
		/var/log/sites/example1.com/logs/access.log {
			missingok
			rotate 5
			compress
			delaycompress
			notifempty
			create 0640 root adm
			size 5M
			sharedscripts
			prerotate
						webalizer -n www.example1.com -o /var/log/sites/example1.com/webalizer /var/log/sites/example1.com/logs/access.log
				if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
					run-parts /etc/logrotate.d/httpd-prerotate; \
				fi; \
			endscript
			postrotate
				[ ! -f /var/run/nginx.pid ] || kill -USR1 `cat /var/run/nginx.pid`
			endscript
		}
		~~~

	For each website add a similar configuration block.

	Let's explain the parameters used:

	*   `missingok` - If the log file is missing, go on to the next one without issuing an error message.
	*   `rotate 5` - Create a maximum of 5 archives.
	*   `compress` - Compress the old log files with gzip.
	*   `delaycompress` - Postpone compression of the previous log file to the next rotation cycle. This way, at any moment there are two uncomplressed log files: the current log file and the previous one, while all the other log files are compressed.
	*   `notifempty` - Don't rotate empty log files.
	*   `create 0640 root adm` - Create new log files as being owned by the user 'root' and the group 'adm', with the specified permissions.
	*   `size 5M` - Rotate the current log file when it grows over 5 MB.
	*   `sharedscripts` - Run the postrotate script only once, after the old logs have been compressed, not once for each log which is rotated.
	*   `prerotate` - The lines between 'prerotate' and 'endscript' are executed before the current log file is rotated. 
	*   `postrotate` - The lines between 'postrotate' and 'endscript' are executed after the current log file is rotated.

	This is only an example of a functional configuration and these parameters can be changed or adjusted to meet any specific needs.

	Please note in the `prerotate` section the command that runs Webalizer for `www.example1.com`. This command will be run before log rotation so that the rotation won't cause Webalizer to miss any log entries.

	The `postrotate` command tells Nginx to reload the log file once the rotation is complete. This will enable it to write log data to the new log file.

	The 'logrotate' process is executed once per day, but you can schedule it to run at a specific moment by setting up a cron job, as we'll explain below.

3.  You can also run 'logrotate' manually for a specific configuration file. To run 'logrotate' for Nginx logs manually, use the following command:

		logrotate -f /etc/logrotate.d/nginx

## Set Up the Cron Job

If you want to run Webalizer for every site hosted on your server all you have to do now is to run the `webalizer-script.sh` script that you created earlier by typing the following command:

	sudo /var/scripts/webalizer-script.sh

But what if you want to run Webalizer on a regular basis, let's say once a day at a specific hour and minute? In this situation you would want to set up a cron job by editing the 'crontab' file.

1.  First open the 'crontab' file:

		sudo crontab -e

2.  At the end of the file add a line similar to this:

		30 3 * * * /var/scripts/webalizer-script.sh > /dev/null 2>&1

	This command tells 'cron' to run the `webalizer-script.sh` script every day at 3:30 a.m. The last part of the command, `> /dev/null 2>&1`, means that any standard output message or error produced by this command will be ignored; it won't be shown to the user.

	Please note that it's highly recommended to set Webalizer to run at a moment during the day when the websites are having the fewest vistors so that Webalizer won't use precious processing power when it's most needed. The low traffic hours in the early morning are generally a good choise.

	You can save and exit the file now. 

## Step Six - Test Webalizer

1.  To test Webalizer first you have to access each website so that the access log files could be populated. You can do it using a browser or by using the `wget` command:

		wget www.example1.com
		wget www.example2.com

2.  Then you just have to run:

		sudo /var/scripts/webalizer-script.sh

	To access the reports generated by Webalizer for `www.example1.com` just open a browser, type in `www.example1.com/up-webalizer` and enter your username and password when prompted.

	The traffic statistics will look similar these:

![Webalizer - Summary by month](/docs/assets/webalizer1.png)

![Webalizer - Daily usage](/docs/assets/webalizer2.png)

![Webalizer - Usage by country](/docs/assets/webalizer3.png)

	Please note that Webalizer calls 'total unique visitors' 'Total Unique Sites'. It is worth mentioning that Webalizer considers search engine bots as normal visitors and counts them as such.
 
## Conclusion

No web server is complete without a traffic analysis tool. Such an application allows a website owner to evaluate the popularity of a website, to understand how visitors reach the site and to articulate strategies for future improvement both at the level of content and site structure.

Webalizer has the advantage of being lightweight yet powerful, so it is capable to deliver in-depth analysis without using any significant amount of resources.
