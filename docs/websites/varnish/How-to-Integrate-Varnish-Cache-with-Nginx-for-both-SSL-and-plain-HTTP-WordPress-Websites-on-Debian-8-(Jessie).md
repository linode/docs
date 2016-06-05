---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This tutorial offers the most effective method of integrating Varnish with Nginx to serve cached WordPress content, for both SSL and plain HTTP websites. In conjunction with Nginx, Varnish can speed up delivery of WordPress websites by orders of magnitude.'
keywords: 'Varnish, cache, Nginx, WordPress, SSL, speed, PHP-FPM'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Weekday, Month 00th, 2016'
modified: Weekday, Month 00th, 2016
modified_by:
  name: Linode
title: 'How to Integrate Varnish Cache with Nginx for both SSL and plain HTTP WordPress Websites, on Debian 8 (Jessie)'
contributor:
  name: Frederick Jost Zweig
  link: https://github.com/Fred-Zweig
  external_resources:
- '[Official Varnish Documentation](https://www.varnish-cache.org/docs)'
- '[Official Nginx Documentation](http://nginx.org/en/docs/)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>


# How to Integrate Varnish Cache with Nginx for both SSL and plain HTTP WordPress Websites, on Debian 8 (Jessie)

## Introduction

Varnish is a powerful and flexible caching HTTP reverse proxy. It can be installed in front of any HTTP server and can be configured to cache contents, offering a tremendous speed improvement and drastically reducing server load. When a client requests a page, Varnish first tries to send it from cache. In case the page is not in cache it forwards the request to the backend server, fetches the response, stores it in cache and delivers it to the client. A cached page is delivered in a matter of microseconds, since it is read from the RAM memory; the request doesn't even reach the web server and doesn't involve any PHP or MySQL execution. This guide uses Varnish 4.0 which is included in Debian 8 repositories.  

It is important to note that Varnish doesn't support SSL encrypted traffic. This problem can be circumvented by using Nginx both for SSL decryption and as a backend web server. Using Nginx for both tasks reduces the complexity of the setup, leading to fewer potential failure points, lower usage of hardware resources and fewer components to maintain.

Someone could ask if the time needed by Nginx to decrypt and then encrypt traffic to SSL websites doesn't defeat the purpose of using Varnish, but it should be noted that Nginx does the two operations in a negligible amount of time and the speed gained by using Varnish is outstanding, so this setup is valid and efficient. Another thing to be pointed out is that server level caching, such as that provided by Varnish, by far exceeds in efficiency any application level caching, such as that offered by WordPress caching plugins.

## Our setup

For HTTP traffic Varnish will listen on port 80. If content is found in cache, Varnish will serve it from cache. If not, it will pass the request to Nginx on port 8080, Nginx will send the requested content back to Varnish on the same port, Varnish will store the fetched content in cache and then deliver it on port 80 to the client.

For HTTPS traffic, Nginx will listen on port 443 and send decrypted traffic to Varnish on port 80. If content is found in cache, Varnish will send the unencrypted content from cache back to Nginx, which will encrypt it and send it to the client. If content is not found in cache, Varnish will request it from backend Nginx on port 8080, Nginx will deliver the requested content, Varnish will store it in cache and send it unencrypted to frontent Nginx which will encrypt it and send it to the client's browser. 

Our setup is illustrated below. Please note that frontend Nginx and backend Nginx are one and the same server:

[![Nginx-Varnish-Nginx server configuration diagram](/docs/assets/varnish-scheme-small.png)](/docs/assets/varnish-scheme.png)

In fact SSL (Secure Sockets Layer) was replaced by TLS (Transport Layer Security) many years ago. When we refer to SSL we really mean TLS.

## Before You Begin

This tutorial expects that you have ssh access to your server running Debian 8 (Jessie). You also need to have the following components installed:

*   **a LEMP (Linux, Nginx (pronounced "engine x"), MySQL, PHP) stack**. To install a LEMP stack you can follow [this tutorial](https://www.linode.com/docs/websites/lemp/lemp-server-on-debian-8). However, you should skip the Nginx configuration because we'll address it later on in our tutorial.

*   **WordPress**. [This tutorial](https://www.linode.com/docs/websites/cms/how-to-install-and-configure-wordpress) will show you how to install WordPress. 

*   **a non-root user with sudo priviledges**. To create a non-root user with sudo privileges, follow [this tutorial](https://www.linode.com/docs/tools-reference/linux-users-and-groups).

## Install and Configure Varnish

1.  To install Varnish 4.0 just run:

		sudo apt-get update
		sudo apt-get install varnish

	Varnish is indeed extremely flexible and the configuration we describe below is a basic configuration which can be further refined to adapt it to specific requirements.

2.  Use 'nano' or other text editor to edit the `/etc/default/varnish` file:

		sudo nano /etc/default/varnish

3.  To make Varnish start at boot, under `Should we start varnishd at boot?` set the `START` parameter to `yes`:

		START=yes

4.  To set Varnish to listen on port 80, to change the configuration file and allocate memory, in the `Alternative 2` section, make `DAEMON_OPTS` look like this:

	{: .file-excerpt }
	/etc/default/varnish
	:   ~~~ conf
	
		DAEMON_OPTS="-a :80 \
				 	-T localhost:6082 \
				 	-f /etc/varnish/custom.vcl \
				 	-S /etc/varnish/secret \
				 	-s malloc,500M"
		~~~

	The `-s malloc,500M` line sets the maximum amount of RAM that will be used by Varnish to store content, so you should set that to whatever suits your needs, taking into account the server's total RAM, the size and expected traffic of your website. For example, on a 4 GB RAM system, you can allocate 1 or 2 or 3 GB to Varnish but obviously not all the system's RAM. To allocate 1 GB you should write: `-s malloc,1G`. In the `-f` directive you must specify a new configuration file, namely `/etc/varnish/custom.vcl`; if you make the configuration changes in the `default.vcl` file, a future update of Varnish may overwrite it. Save and exit the file.

5.  To start customizing your Varnish configuration, first copy the default configuration file to a new file called `custom.vcl`:

		cd /etc/varnish
		sudo cp default.vcl custom.vcl

6.  Open the `/etc/varnish/custom.vcl` file:

		sudo nano /etc/varnish/custom.vcl

	First of all delete everything inside this file. Then edit it as described below.  

7.  Varnish configuration uses a domain-specific language called Varnish Configuration Language (VCL). We specify the VCL version used:

		vcl 4.0;

8.  To set the backend (which is Nginx) to listen on port 8080, we edit the `backend default` directive as follows:

		backend default {
		  .host = "localhost";
		  .port = "8080";
		}

9.  To allow cache purging requests only from localhost we have to set the `acl` directive:

		acl purger {
		  "localhost";
		  "your_server_ip";
		  "your_server_ipv6";
		}

	Now, we have to configure the `sub vcl_recv` routine which is used when a request is sent by a HTTP client.

10.  First, we handle the case in which someone requests the SSL website over HTTP. In this situation we redirect the request from HTTP to HTTPS:

		if (client.ip != "127.0.0.1" && req.http.host ~ "example-over-ssl.com") {
		  set req.http.x-redir = "https://www.example-over-ssl.com" + req.url;
		  return(synth(850, ""));
		}
	  
11.  Then we allow cache purging requests only from the IPs mentioned in the above `acl purger` section. If a purge request comes from a different IP, an error message will be produced:

		if (req.method == "PURGE") {
		  if (!client.ip ~ purger) {
		  return(synth(405, "This IP is not allowed to send PURGE requests."));
		}	
		  return (purge);
		}
	
12.  We change the `X-Forwarded-For` header:

		if (req.restarts == 0) {
		  if (req.http.X-Forwarded-For) {
		  set req.http.X-Forwarded-For = client.ip;
		  }
		}

13.  We exclude POST requests or those with basic authentication from caching:

		if (req.http.Authorization || req.method == "POST") {
		  return (pass);
		}

14.  We also exclude RSS feeds from caching:

		if (req.url ~ "/feed") {
		  return (pass);
		}
	
15.  We tell Varnish not to cache the admin and login WordPress pages:

		if (req.url ~ "wp-admin|wp-login") {
		  return (pass);
		}
 
16.  WordPress sets many cookies that are safe to ingnore. To remove them we add the following lines:

		set req.http.cookie = regsuball(req.http.cookie, "wp-settings-\d+=[^;]+(; )?", "");
		set req.http.cookie = regsuball(req.http.cookie, "wp-settings-time-\d+=[^;]+(; )?", "");
		  if (req.http.cookie == "") {
		  unset req.http.cookie;
		  }
		}

	This is where the `sub vcl_recv` routine ends.
 
17.  Now, to make redirecting of HTTP to HTTPS effective we use the `sub vcl_synth` directive with the following settings:

		sub vcl_synth {
		  if (resp.status == 850) {  
		   set resp.http.Location = req.http.x-redir;       
		   set resp.status = 302;
		   return (deliver);
		  }
		}

18.  Cache purging for a particular page must occur each time we make edits to that page. To implement this, aside from specifying which IPs can send purge requests, which we did earlier, we have to use the `sub vcl_purge` directive as follows:

		sub vcl_purge {
		  set req.method = "GET";
		  set req.http.X-Purger = "Purged";
		  return (restart);
		}

19.  The `sub vcl_backend_response` directive is used to handle the communication with the backend. We use it to set the amount of time the content remains in cache. We can also set a *grace period*, which is the period in which Varnish will serve content from cache even if the backend server is down for any reason. Time can be set in seconds (s), minutes (m), hours (h) or days (d). Here we've set the caching time to 24 hours, and the grace period to 1 hour, but you can adjust these settings based on your needs:

		sub vcl_backend_response {
		  set beresp.ttl = 24h;
		  set beresp.grace = 1h;

20.  In this section we also allow cookies to be set only if we are on admin pages or on WooCommerce specific pages:

		if (bereq.url !~ "wp-admin|wp-login|product|cart|checkout|my-account|/?remove_item=") {
		  unset beresp.http.set-cookie;    
		  }
		}

	Please remember to add to the above series any page that requires cookies to work, for example `phpmyadmin|webmail|postfixadmin` etc. Obviously, if you change the WordPress login page from `wp-login.php` to something else, you must also add the new name to this series.

21.  Now, we need to change the headers for purge requests by adding the following lines to the `sub vcl_deliver` directive:

		sub vcl_deliver {
		  if (req.http.X-Purger) {
		  set resp.http.X-Purger = req.http.X-Purger;
		  }
		}

	This concludes the `custom.vcl` configuration. You can save and exit the file.

	The final `custom.vcl` file will look like this:

	{: .file }
	/etc/varnish/custom.vcl
	:   ~~~ conf
	
		vcl 4.0;
		
		backend default {
		.host = "localhost";
		.port = "8080";
		}
		
		acl purger {
		"localhost";
		"your_server_ip";    
		"your_server_ipv6";
		}
		
		sub vcl_recv {
		
		 if (client.ip != "127.0.0.1" && req.http.host ~ "example-over-ssl.com") {
			set req.http.x-redir = "https://www.example-over-ssl.com" + req.url;
			return(synth(850, ""));
		 }
		 
		 if (req.method == "PURGE") {
			if (!client.ip ~ purger) {
			return(synth(405, "This IP is not allowed to send PURGE requests."));
		 }	
		 return (purge);
		 }
		
		 if (req.restarts == 0) {
			if (req.http.X-Forwarded-For) {
			set req.http.X-Forwarded-For = client.ip;
			}
		 }
		
		 if (req.http.Authorization || req.method == "POST") {
			return (pass);
		 }
		
		 if (req.url ~ "/feed") {
			return (pass);
		 }
		
		 if (req.url ~ "wp-admin|wp-login") {
			return (pass);
		 }
		
		 set req.http.cookie = regsuball(req.http.cookie, "wp-settings-\d+=[^;]+(; )?", "");
		 set req.http.cookie = regsuball(req.http.cookie, "wp-settings-time-\d+=[^;]+(; )?", "");
		
		 if (req.http.cookie == "") {
		 unset req.http.cookie;
		 }
		}
		
		sub vcl_synth {
		 if (resp.status == 850) {  
			 set resp.http.Location = req.http.x-redir;       
			 set resp.status = 302;
			 return (deliver);
		 }
		}
		
		sub vcl_purge {
		 set req.method = "GET";
		 set req.http.X-Purger = "Purged";
		 return (restart);
		}
		
		sub vcl_backend_response {
		 set beresp.ttl = 24h;
		 set beresp.grace = 1h;
		
		 if (bereq.url !~ "wp-admin|wp-login|product|cart|checkout|my-account|/?remove_item=") {
		 unset beresp.http.set-cookie;    
		 }
		}
		
		sub vcl_deliver {
		 if (req.http.X-Purger) {
			set resp.http.X-Purger = req.http.X-Purger;
		 }
		}
		~~~


	For Varnish to work we also need to edit the `varnish.service` file and change the name of the configuration file, port number and allocated memory to match the values specified in the `/etc/default/varnish` file.

22.  Open the `/lib/systemd/system/varnish.service` file: 

		sudo nano /lib/systemd/system/varnish.service

23.  Find the two lines beginning with  `ExecStart` and make them look like this:

	{: .file-excerpt }
	/lib/systemd/system/varnish.service
	:   ~~~ conf
	
		ExecStartPre=/usr/sbin/varnishd -C -f /etc/varnish/custom.vcl
		ExecStart=/usr/sbin/varnishd -a :80 -T localhost:6082 -f /etc/varnish/custom.vcl -S /etc/varnish/secret -s malloc,500M
		~~~

24.  After saving and exiting the file you have to reload the systemd process:

		sudo systemctl daemon-reload

25.  To make Varnish start at boot up, just run the following command:

		sudo systemctl enable varnish.service

We won't start Varnish server at this point because we need to configure Nginx first.

## Configure Nginx

Before configuring Nginx we have to install PHP-FPM (FPM means FastCGI Process Manager. FastCGI is a variation on the earlier Common Gateway Interface (CGI)). PHP-FPM will make the web server act as a proxy, passing all the requests having the `php` file extension to the PHP interpreter.

1.  To install PHP-FPM just run:

		sudo apt-get install php5-fpm php5-mysql

2.  To configure PHP-FPM first open `/etc/php5/fpm/php.ini`:

		sudo nano /etc/php5/fpm/php.ini

3.  Find the directive `cgi.fix_pathinfo=` and set it to 0, for safety reasons. If this parameter is set to 1, the PHP interpreter will try to process the file who's path is as close to the requested path as possible, if it's set to 0, the interpreter will only process the file with the exact path, which is a safer alternative.

		cgi.fix_pathinfo=0
	
4.  Now open `www.conf`:

		sudo nano /etc/php5/fpm/pool.d/www.conf

5.  Edit the `listen = ` directive to specify the socket that will be used by Nginx to pass requests to PHP-FPM:

		listen = /var/run/php5-fpm.sock

6.  Restart PHP-FPM:

		sudo systemctl restart php5-fpm

7.  Now open `/etc/nginx/fastcgi_params`:

		sudo nano /etc/nginx/fastcgi_params

8.  Find the line `fastcgi_param  HTTPS  $https if_not_empty;`. Bellow that line add the following two lines, necessary for Nginx to interact with the FastCGI service:

	{: .file-excerpt }
	/etc/nginx/fastcgi_params
	:   ~~~ nginx
	
		fastcgi_param  SCRIPT_FILENAME    $request_filename;
		fastcgi_param  PATH_INFO          $fastcgi_path_info;
		~~~

	Save and exit the file.

9.  Open `/etc/nginx/nginx.conf`:

		sudo nano /etc/nginx/nginx.conf

10.  Comment out the following two lines, because we'll include these SSL settings in the server block for the SSL websites in the `/etc/nginx/sites-enabled/default` file. So, make them look like this:

	{: .file-excerpt }
	/etc/nginx/nginx.conf
	:   ~~~ nginx
	
		# ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
		# ssl_prefer_server_ciphers on;
		~~~

11.  Since the access logs and error logs will be defined for each individual website in the server block, you will also need to comment out the two lines specifying these logs. They must look as follows:

	{: .file-excerpt }
	/etc/nginx/nginx.conf
	:   ~~~ nginx
	
		# access_log /var/log/nginx/access.log;
		# error_log /var/log/nginx/error.log;
		~~~

12.  It's time to note that the default access log format of Nginx is a type of log format called 'combined'. This type of logging is used by many web servers because it records all the information that is generally needed by log analysis tools etc. Of course the access log format can be changed from default to a custom one by using the `log_format` directive, but since we don't need custom logging we'll let Nginx use the default 'combined' format which is internally defined. All we have to do is specify the location of the access log in the server block of each SSL website, in the `/etc/nginx/sites-enabled/default` file. So, no need to change anything else in this file. You can save and exit now.

	It should be pointed out that like Varnish, Nginx is very flexible and powerful and this is the reason its configuration can take a variety of forms, depending on specific individual requirements, so we will present a basic configuration, future refinement being possible.

	Let's start by configuring Nginx for the plain HTTP website which we'll call `www.example-over-http.com`.

13.  Open the default Nginx configuration file:

		sudo nano /etc/nginx/sites-enabled/default

14.  Delete everything inside this file and add the following blocks:

	{: .file-excerpt }
	/etc/nginx/sites-enabled/default
	:   ~~~ nginx
		
		server {
		   listen  8080;
		   listen  [::]:8080;
		   server_name  example-over-http.com;
		   return       301 http://www.example-over-http.com$request_uri;
		   }
		
		server {
		   listen 8080;
		   listen [::]:8080;
		   server_name  www.example-over-http.com;
		   root /var/www/example-over-http.com;
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
		   }
		~~~

	A few things are to be noted here:

	*   The first server block is used to redirect all requests for `example-over-http.com` to `www.example-over-http.com`.
	*   **`listen [::]:8080;`** is needed if you want your site to be also accesible over IPv6.
	*   **`port_in_redirect off;`** is needed to prevent Nginx from appending the port number to the requested URL.
	*   **`fastcgi`** directives are used to proxy requests for PHP code execution to PHP-FPM, via the FastCGI protocol.

15.  To configure Nginx for the SSL website which we called `www.example-over-ssl.com`, we need two server blocks. So, under the previous lines add the following blocks: 

	{: .file-excerpt }
	/etc/nginx/sites-enabled/default
	:   ~~~ nginx
	
		server {
		   listen  443 ssl;
		   listen  [::]:443 ssl;
		   server_name  www.example-over-ssl.com  example-over-ssl.com;
		   port_in_redirect off;
		   
		   ssl                  on;
		   ssl_certificate      /etc/nginx/ssl/ssl-bundle.crt;
		   ssl_certificate_key  /etc/nginx/ssl/example-over-ssl.com.key;
		   ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
		   ssl_ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:ECDH+3DES:DH+3DES:RSA+AESGCM:RSA+AES:RSA+3DES:!aNULL:!MD5:!DSS;
		   ssl_prefer_server_ciphers   on;
		   
		   ssl_session_cache   shared:SSL:20m;
		   ssl_session_timeout 60m;
		   
		   add_header Strict-Transport-Security "max-age=31536000";
		   add_header X-Content-Type-Options nosniff;
		   
		   location / {
		     proxy_pass http://127.0.0.1:80;
		     proxy_set_header Host $http_host;
		     proxy_set_header X-Forwarded-Host $http_host;
		     proxy_set_header X-Real-IP $remote_addr;
		     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		     proxy_set_header X-Forwarded-Proto https;
		     proxy_set_header HTTPS "on";
		     
		     access_log /var/log/allsites/example-over-ssl.com/logs/access.log;
		     error_log  /var/log/nginx/example-over-ssl.com.error.log notice;
		     }
		   }
		
		server {
		   listen 8080;
		   listen [::]:8080;
		   server_name  www.example-over-ssl.com  example-over-ssl.com;
		   root /var/www/example-over-ssl.com;
		   index index.php;
		   port_in_redirect off;
		   
		   ssl                  on;
		   ssl_certificate      /etc/nginx/ssl/ssl-bundle.crt;
		   ssl_certificate_key  /etc/nginx/ssl/www.example-over-ssl.com.key;
		   ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
		   ssl_ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:ECDH+3DES:DH+3DES:RSA+AESGCM:RSA+AES:RSA+3DES:!aNULL:!MD5:!DSS;
		   ssl_prefer_server_ciphers   on;
		   
		   ssl_session_cache   shared:SSL:20m;
		   ssl_session_timeout 60m;
		   
		   location / {
		      try_files $uri $uri/ /index.php?$args;
		   }
		   
		   location ~ \.php$ {
		       try_files $uri =404;
		       fastcgi_split_path_info ^(.+\.php)(/.+)$;
		       include fastcgi_params;
		       fastcgi_index index.php;
		       fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
		       fastcgi_param HTTPS on;
		       fastcgi_pass unix:/var/run/php5-fpm.sock;
		       }
		    }
		~~~


	First of all please note that for a SSL website we need a server block to receive traffic on port 443 and pass decrypted traffic to Varnish on port 80, and also a second server block to serve unencrypted traffic to Varnish on port 8080, whenever Varnish asks for it. Also note that the SSL directives are included in both blocks. 

	The `ssl_certificate` directive must specify the location and name of the SSL certificate file; this file can be named `your_domain_name.crt` or `your_domain_name.pem`  or differently, depending on the Certificate Authority (CA) that issued it. The same with the `ssl_certificate_key` directive. So, edit those directives according to your situation. 

	Alternatively, if you don't have a SSL certificate issued by a CA, you can issue a self-signed SSL certificate using *openssl*, but this should be done only for testing purposes, because when trying to access your site, all browsers will show a warning like: "This Connection is Untrusted".

	Now let's explain the key points of the previous two server blocks:

	*   **`ssl_session_cache   shared:SSL:20m;`** creates a cache shared between all worker processes that has 20 MB. This cache is used to store SSL session parameters so as to avoid SSL handshakes for parallel and subsequent connections. 1MB can store about 4000 sessions, so adjust this cache size according to the expected traffic for your website.
	*   **`ssl_session_timeout 60m;`** specifies the ssl session cache timeout. Here it's set to 60 minutes, but it can be decreased or increased, depending on traffic and hardware resources.
	*   **`ssl_prefer_server_ciphers   on;`** means that when a SSL connection is established the server ciphers should be preferred over client ciphers.
	*   **`add_header Strict-Transport-Security "max-age=31536000";`** tells web browsers they should only interact with this server using a secure HTTPS connection. The `max-age` specifies in seconds what period of time the site is willing to accept HTTPS-only connections.
	*   **`add_header X-Content-Type-Options nosniff;`** this header tells the browser not to override the response content type. So, if the server says the content is text, the browser will render it as text.
	*   **`proxy_pass http://127.0.0.1:80;`** this directive proxies all SSL traffic to Varnish which listens on port 80.
	*   **`proxy_set_header`** directives add to requests specific headers, so as SSL traffic could be recognised.
	*   **`access_log`** and **`error_log`** indicate the location and name of the respective types of logs. Please adjust these locations and names according to your setup.
	*   **`fastcgi`** directives present in the last server block are used to correctly proxy requests for PHP code execution to PHP-FPM, via the FastCGI protocol. 

16.  To prevent users to access the website specified by the first block of this file just by typing your IP address in a browser, you can put a catch-all default server block right at the top of the file:

	{: .file-excerpt }
	/etc/nginx/sites-enabled/default
	:   ~~~ nginx
	
		server {
		  listen 8080 default_server;
		  listen [::]:8080;
		  server_name _;
		  root /var/www;
		  index index.html;
		}
		~~~

	The `/var/www/index.html` file can contain just a simple message like "Page not found!".

17.  You can restart Nginx now:

		sudo systemctl restart nginx

18.  And finally start Varnish:

		sudo systemctl start varnish

## Install the "Varnish HTTP Purge" Plugin

When you edit a WordPress page and update it, the modification won't be visible even if you refresh the browser, because it will receive the old version of that page, served by Varnish from cache. To purge Varnish cache for a particular page automatically whenever you edit a page you must install a free WordPress plugin called "Varnish HTTP Purge".

To install this plugin login to your WordPress website, go to **Plugins**, **Add New**, search for **Varnish HTTP Purge**, find it among the results, click on **Install Now**, then on **Activate Plugin**. That's all. This plugin doesn't need any configuration.

## Test Your Setup

To test if Varnish and Nginx are doing their job for the plain HTTP website, just run:

	wget -SS http://www.example-over-http.com

The output should look like this:

	--2016-03-27 00:33:42--  http://www.example-over-http.com/
	Resolving www.example-over-http.com (www.example-over-http.com)... your_server_ip
	Connecting to www.example-over-http.com (www.example-over-http.com)|your_server_ip|:80... connected.
	HTTP request sent, awaiting response... 
	  HTTP/1.1 200 OK
	  Server: nginx/1.6.2
	  Date: Sat, 26 Mar 2016 22:25:55 GMT
	  Content-Type: text/html; charset=UTF-8
	  Link: <http://www.example-over-http.com/wp-json/>; rel="https://api.w.org/"
	  X-Varnish: 360795 360742
	  Age: 467
	  Via: 1.1 varnish-v4
	  Transfer-Encoding: chunked
	  Connection: keep-alive
	  Accept-Ranges: bytes
	Length: unspecified [text/html]
	Saving to: \u2018index.html.2\u2019
	
	index.html.2            [ <=>                  ]  12.17K  --.-KB/s   in 0s     
	
	2016-03-27 00:33:42 (138 MB/s) - \u2018index.html.2\u2019 saved [12459]

So, the third line specifies the connection port number: `80`, the backend server is correctly identified: `Server: nginx/1.6.2`, the traffic passes through Varnish as intended: `Via: 1.1 varnish-v4`; the period of time the object has been kept in cache by Varnish is also displayed in seconds: `Age: 467`.

To test the SSL website run the same command and the output should be similar.

By using Nginx in conjunction with Varnish as we've just shown, the speed of any WordPress website can be dramatically improved, while making best use of hardware resources. 

You can strengthen the security of the SSL connection by generating a custom Diffie-Hellman (DH) parameter, needed for a more secure cryptographic key exchange process.

A step further can be to enable Varnish logging for the plain HTTP websites, since now Varnish is the first to receive the clients' requests, while Nginx only receives requests for those pages that are not found in cache. For SSL websites the logging should be done by Nginx, because clients' requests pass through it first. Logging becomes even more important if you use log monitoring software such as Fail2ban, Awstats or Webalizer. 

You might also want to look into ways of speeding up your WordPress websites even further by refining the Varnish configuration according to your specific needs or by modifying the Nginx configuration; for example SSL websites can be delivered faster if you enable 'OCSP stapling' in Nginx. Speed improvements can also be achieved by enabling the HTTP/2 protocol in Nginx. You can even use the ngx_pagespeed module, although this may involve additional configuration changes due to Varnish and the disadvantage that you have to build Nginx from source whenever a new version is available.

## More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

*   [Official Varnish Documentation](https://www.varnish-cache.org/docs)
*   [Official Nginx Documentation](http://nginx.org/en/docs/)
