---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This tutorial offers the most effective method of integrating Varnish with Nginx to serve cached WordPress content, for both SSL and plain HTTP websites. In conjunction with Nginx, Varnish can speed up delivery of WordPress websites by orders of magnitude.'
keywords: 'Varnish, cache, Nginx, WordPress, SSL, speed, PHP-FPM'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Monday, September 19th, 2016'
modified: Monday, September 19th, 2016
modified_by:
    name: Linode
title: Use Varnish with nginx to Serve Cached Wordpress Content over SSL on Debian 8
contributor:
  name: Frederick Jost Zweig
  link: https://github.com/Fred-Zweig
external_resources:
- '[Official Varnish Documentation](https://www.varnish-cache.org/docs)'
- '[Official Nginx Documentation](http://nginx.org/en/docs/)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

**Varnish** is a powerful and flexible caching HTTP reverse proxy. It can be installed in front of any web server and used to cache its contents, offering tremendous speed improvement and reducing server load. When a client requests a page, Varnish first tries to send it from cache. If the page is not cached it forwards the request to the backend server, fetches the response, stores it in cache and delivers it to the client. A cached page is delivered in a matter of microseconds, since it is read from system memory. The request doesn't reach the web server and doesn't involve any PHP or MySQL execution. This guide uses Varnish 4.0 which is included in the Debian 8 repositories.  

It is important to note that Varnish doesn't support SSL encrypted traffic. This problem can be circumvented by using **nginx** both for SSL decryption and as a backend web server. Using nginx for both tasks reduces the complexity of the setup, leading to fewer potential failure points, lower usage of hardware resources and less components to maintain.

Both Varnish and nginx are versatile tools with a variety of uses. This guide will present a basic setup that you can refine to meet your specific needs.

## Our setup

For this example, we will configure nginx and Varnish for two Wordpress sites:

  * `example-over-http.com` will be an unencrypted, HTTP-only site.
  * `example-over-https.com` will be a separate, HTTPS-encrypted site.

For HTTP traffic Varnish will listen on port 80. If content is found in cache, Varnish will serve it from cache. If not, it will pass the request to nginx on port 8080. nginx will send the requested content back to Varnish on the same port, and Varnish will store the fetched content in cache and then deliver it to the client of port 80.

For HTTPS traffic, nginx will listen on port 443 and send decrypted traffic to Varnish on port 80. If content is found in cache, Varnish will send the unencrypted content from cache back to nginx, which will encrypt it and send it to the client. If content is not found in cache Varnish will request it from backend nginx on port 8080, store it in cache and then send it unencrypted to frontend nginx which will encrypt it and send it to the client's browser.

Our setup is illustrated below. Please note that frontend nginx and backend nginx are one and the same server:

[![Nginx-Varnish-Nginx server configuration diagram](/docs/assets/varnish-scheme-small.png)](/docs/assets/varnish-scheme.png)

## Before You Begin

This tutorial assumes that you have SSH access to your Linode running Debian 8 (Jessie). Before you get started, make sure you've completed the following:

*   Complete the steps in our [Getting Started](/docs/getting-started) and [Securing your Server](/docs/security/securing-your-server) guides.

*   Follow the steps outlined in our [LEMP on Debian 8](/docs/websites/lemp/lemp-server-on-debian-8). You should skip the nginx configuration section as we'll address it later on in our tutorial.

*   Follow the steps in our [WordPress](docs/websites/cms/how-to-install-and-configure-wordpress) guide to install and configure WordPress.

## Install and Configure Varnish

1.  Issue the following commands to install Varnish:

		sudo apt-get update
		sudo apt-get install varnish

2.  Use 'nano' or other text editor to edit the `/etc/default/varnish` file:

		sudo nano /etc/default/varnish

3.  To make Varnish start at boot, under `Should we start varnishd at boot?` set the `START` parameter to `yes`:

		START=yes

4. In the `Alternative 2` section, make the following changes to the `DAEMON_OPTS` section:

    {: .file-excerpt }
    /etc/default/varnish
    :   ~~~ conf
        DAEMON_OPTS="-a :80 \
        -T localhost:6082 \
        -f /etc/varnish/custom.vcl \
        -S /etc/varnish/secret \
        -s malloc,500M"
        ~~~

      This will set Varnish to listen on port 80, and will instruct it to use the `custom.vcl` configuration file. If you make the configuration changes in the `default.vcl` file, a future update to Varnish may overwrite it. Save and exit the file.

	The `-s malloc,500M` line sets the maximum amount of RAM that will be used by Varnish to store content. This value can be adjusted to suit your needs, taking into account the server's total RAM along with the size and expected traffic of your website. For example, on a system with 4 GB of RAM , you can allocate 1 or 2 or 3 GB to Varnish but obviously not all the system's RAM. To allocate 1 GB you should write: `-s malloc,1G`.

5.  To start customizing your Varnish configuration, we will create a new configuration file called `custom.vcl`:

		sudo nano /etc/varnish/custom.vcl

7.  Varnish configuration uses a domain-specific language called Varnish Configuration Language (VCL). First we specify the VCL version used:

    {: .file-excerpt }
    /etc/varnish/custom.vcl
    :   ~~~ conf
        vcl 4.0;
        ~~~

8.  Set the backend (which is nginx) to listen on port 8080, by editing the `backend default` directive as follows:

    {: .file-excerpt }
    /etc/varnish/custom.vcl
    :   ~~~ conf
        backend default {
        .host = "localhost";
        .port = "8080";
        }
        ~~~

9.  Allow cache purging requests only from localhost by setting the `acl` directive:

    {: .file-excerpt }
    /etc/varnish/custom.vcl
    :   ~~~ conf
        acl purger {
        "localhost";
        "your_server_ip";
        "your_server_ipv6";
        }
        ~~~

        Now, we have to configure the `sub vcl_recv` routine which is used when a request is sent by a HTTP client.

10. Redirect HTTP requests to our HTTPS for our SSL website:

    {: .file-excerpt }
    /etc/varnish/custom.vcl
    :   ~~~ conf
        if (client.ip != "127.0.0.1" && req.http.host ~ "example-over-ssl.com") {
        set req.http.x-redir = "https://www.example-over-ssl.com" + req.url;
        return(synth(850, ""));
        }
        ~~~

11. Allow cache purging requests only from the IPs mentioned in the above `acl purger` section. If a purge request comes from a different IP, an error message will be produced:

    {: .file-excerpt }
    /etc/varnish/custom.vcl
    :   ~~~ conf
        if (req.method == "PURGE") {
        if (!client.ip ~ purger) {
        return(synth(405, "This IP is not allowed to send PURGE requests."));
        }
        return (purge);
        }
        ~~~

12. Change the `X-Forwarded-For` header:

    {: .file-excerpt }
    /etc/varnish/custom.vcl
    :   ~~~ conf
        if (req.restarts == 0) {
        if (req.http.X-Forwarded-For) {
        set req.http.X-Forwarded-For = client.ip;
          }
        }
        ~~~

13. Exclude POST requests or those with basic authentication from caching:

    {: .file-excerpt }
    /etc/varnish/custom.vcl
    :   ~~~ conf
        if (req.http.Authorization || req.method == "POST") {
        return (pass);
        }
        ~~~

14. Exclude RSS feeds from caching:

    {: .file-excerpt }
    /etc/varnish/custom.vcl
    :   ~~~ conf
        if (req.url ~ "/feed") {
        return (pass);
        }
        ~~~

15. Tell Varnish not to cache the WordPress admin and login pages:

    {: .file-excerpt }
    /etc/varnish/custom.vcl
    :   ~~~ conf
        if (req.url ~ "wp-admin|wp-login") {
        return (pass);
        }
        ~~~

16. WordPress sets many cookies that are safe to ignore. To remove them add the following lines:

    {: .file-excerpt }
    /etc/varnish/custom.vcl
    :   ~~~ conf
        set req.http.cookie = regsuball(req.http.cookie, "wp-settings-\d+=[^;]+(; )?", "");
        set req.http.cookie = regsuball(req.http.cookie, "wp-settings-time-\d+=[^;]+(; )?", "");
        if (req.http.cookie == "") {
        unset req.http.cookie;
      }
    }
        ~~~

	This is where the `sub vcl_recv` routine ends.

17. Redirect HTTP to HTTPS using the `sub vcl_synth` directive with the following settings:

    {: .file-excerpt }
    /etc/varnish/custom.vcl
    :   ~~~ conf
        sub vcl_synth {
        if (resp.status == 850) {  
        set resp.http.Location = req.http.x-redir;       
        set resp.status = 302;
        return (deliver);
      }
    }
        ~~~

18. Cache purging for a particular page must occur each time we make edits to that page. To implement this, we have to use the `sub vcl_purge` directive as follows:

    {: .file-excerpt }
    /etc/varnish/custom.vcl
    :   ~~~ conf
        sub vcl_purge {
        set req.method = "GET";
        set req.http.X-Purger = "Purged";
        return (restart);
    }
        ~~~

19. The `sub vcl_backend_response` directive is used to handle communication with the backend server, in this case nginx. We use it to set the amount of time the content remains in cache. We can also set a *grace period*, which determines how Varnish will serve content from cache even if the backend server is down for any reason. Time can be set in seconds (s), minutes (m), hours (h) or days (d). Here we've set the caching time to 24 hours, and the grace period to 1 hour, but you can adjust these settings based on your needs:

    {: .file-excerpt }
    /etc/varnish/custom.vcl
    :   ~~~ conf
        sub vcl_backend_response {
        set beresp.ttl = 24h;
        set beresp.grace = 1h;
        ~~~

20. Allow cookies to be set only if we are on admin pages or WooCommerce-specific pages:

    {: .file-excerpt }
    /etc/varnish/custom.vcl
    :   ~~~ conf
        if (bereq.url !~ "wp-admin|wp-login|product|cart|checkout|my-account|/?remove_item=") {
        unset beresp.http.set-cookie;    
        }
        }
        ~~~

	Please remember to add to the above series any page that requires cookies to work, for example `phpmyadmin|webmail|postfixadmin`, etc. If you change the WordPress login page from `wp-login.php` to something else, you must also add the new name to this series.

21. Change the headers for purge requests by adding the following lines to the `sub vcl_deliver` directive:

    {: .file-excerpt }
    /etc/varnish/custom.vcl
    :   ~~~ conf
        sub vcl_deliver {
        if (req.http.X-Purger) {
        set resp.http.X-Purger = req.http.X-Purger;
        }
        }
        ~~~

	This concludes the `custom.vcl` configuration. You can save and exit the file. The final `custom.vcl` file will look like this:

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


	For Varnish to work we also need to edit the `varnish.service` file to use our custom configuration file, with the port number and allocated memory values updated to match the changes we made in our `/etc/default/varnish` file.

22. Open the `/lib/systemd/system/varnish.service` file:

        sudo nano /lib/systemd/system/varnish.service

23. Find the two lines beginning with  `ExecStart` and edit them to look like this:

    {: .file-excerpt }
    lib/systemd/system/varnish.service
    :   ~~~ conf
        ExecStartPre=/usr/sbin/varnishd -C -f /etc/varnish/custom.vcl
        ExecStart=/usr/sbin/varnishd -a :80 -T localhost:6082 -f /etc/varnish/custom.vcl -S /etc/varnish/secret -s malloc,500M
        ~~~

24. After saving and exiting the file you have to reload the systemd process:

        sudo systemctl daemon-reload

25. To make Varnish start at boot up, just run the following command:

		sudo systemctl enable varnish.service

We won't start Varnish at this point because we need to configure nginx first.

## Install and Configure PHP

Before configuring nginx we have to install PHP-FPM. FPM is short for FastCGI Process Manager, and it allows the web server to act as a proxy passing all requests with the `.php` file extension to the PHP interpreter.

1. To install PHP-FPM just run:

        sudo apt-get install php5-fpm php5-mysql

2. Open the `/etc/php5/fpm/php.ini` file to configure PHP-FPM:

		sudo nano /etc/php5/fpm/php.ini

3. Find the directive `cgi.fix_pathinfo=` and set it to `0`, for safety reasons. If this parameter is set to `1`, the PHP interpreter will try to process the file who's path is as close to the requested path as possible, if it's set to `0`, the interpreter will only process the file with the exact path, which is a safer alternative.

		cgi.fix_pathinfo=0

4. Now open `www.conf`:

		sudo nano /etc/php5/fpm/pool.d/www.conf

5. Edit the `listen =` directive to specify the socket that will be used by nginx to pass requests to PHP-FPM:

		listen = /var/run/php5-fpm.sock

6.  Restart PHP-FPM:

		sudo systemctl restart php5-fpm

7.  Now open `/etc/nginx/fastcgi_params`:

		sudo nano /etc/nginx/fastcgi_params

8.  Find the line `fastcgi_param  HTTPS  $https if_not_empty;`. Below it add the following two lines, necessary for nginx to interact with the FastCGI service:

	{: .file-excerpt }
	/etc/nginx/fastcgi_params
	:   ~~~ nginx

		fastcgi_param  SCRIPT_FILENAME    $request_filename;
		fastcgi_param  PATH_INFO          $fastcgi_path_info;
		~~~

	Save and exit the file.

## Configure nginx

9.  Open `/etc/nginx/nginx.conf`:

		sudo nano /etc/nginx/nginx.conf

10. Comment out the following two lines, because we'll include these SSL settings in the server block within the `/etc/nginx/sites-enabled/default` file:

	{: .file-excerpt }
	/etc/nginx/nginx.conf
	:   ~~~ nginx

		# ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
		# ssl_prefer_server_ciphers on;
		~~~

11. By default nginx makes use of an access log format called 'combined.' This type of logging is used by many web servers because it records all the information that is generally required by log analysis tools. The access log format can be changed from default to a custom one by using the `log_format` directive, but since we don't need custom logging we'll let nginx use the default 'combined' option.

    Since the access logs and error logs will be defined for each individual website in the server block, you will also need to comment out the two lines below:

	{: .file-excerpt }
	/etc/nginx/nginx.conf
	:   ~~~ nginx

		# access_log /var/log/nginx/access.log;
		# error_log /var/log/nginx/error.log;
		~~~

12. Save and exit the file.

13. Next we'll configure the HTTP-only website, `example-over-http.com`. Open the default nginx configuration file:

		sudo nano /etc/nginx/sites-available/default

14. Delete everything inside this file and add the following blocks:

    {: .file-excerpt }
    /etc/nginx/sites-available/default
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

	A few things to be noted here:

	*   The first server block is used to redirect all requests for `example-over-http.com` to `www.example-over-http.com`.
	*   `listen [::]:8080;` is needed if you want your site to be also accesible over IPv6.
	*   `port_in_redirect off;` is needed to prevent nginx from appending the port number to the requested URL.
	*   `fastcgi` directives are used to proxy requests for PHP code execution to PHP-FPM, via the FastCGI protocol.

15. To configure nginx for the SSL website which we called `example-over-ssl.com`, we need two server blocks. Append the follow server blocks to your `/etc/nginx/sites-available/default` file:

	{: .file-excerpt }
	/etc/nginx/sites-available/default
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


	Please note that for an SSL website we need a server block to receive traffic on port 443 and pass decrypted traffic to Varnish on port 80, and also a second server block to serve unencrypted traffic to Varnish on port 8080, whenever Varnish asks for it. Also note that the SSL directives are included in both blocks.

	The `ssl_certificate` directive must specify the location and name of the SSL certificate file. Take a look at our guide to using [SSL on nginx](/docs/security/ssl/provide-encrypted-resource-access-using-ssl-certificates-on-nginx) for more information.

	Alternatively, if you don't have an SSL certificate issued by a CA, you can issue a self-signed SSL certificate using *openssl*, but this should be done only for testing purposes. Self-signed sites will return a "This Connection is Untrusted" message when opened in a browser.

	Now let's explain the key points of the previous two server blocks:

	*   `ssl_session_cache   shared:SSL:20m;` creates a cache shared between all worker processes that has 20 MB. This cache is used to store SSL session parameters so as to avoid SSL handshakes for parallel and subsequent connections. 1MB can store about 4000 sessions, so adjust this cache size according to the expected traffic for your website.
	*   `ssl_session_timeout 60m;` specifies the ssl session cache timeout. Here it's set to 60 minutes, but it can be decreased or increased, depending on traffic and hardware resources.
	*   `ssl_prefer_server_ciphers   on;` means that when a SSL connection is established the server ciphers should be preferred over client ciphers.
	*   `add_header Strict-Transport-Security "max-age=31536000";` tells web browsers they should only interact with this server using a secure HTTPS connection. The `max-age` specifies in seconds what period of time the site is willing to accept HTTPS-only connections.
	*   `add_header X-Content-Type-Options nosniff;` this header tells the browser not to override the response content type. So, if the server says the content is text, the browser will render it as text.
	*   `proxy_pass http://127.0.0.1:80;` this directive proxies all SSL traffic to Varnish which listens on port 80.
	*   `proxy_set_header` directives add to requests specific headers, so as SSL traffic could be recognised.
	*   `access_log` and `error_log` indicate the location and name of the respective types of logs. Please adjust these locations and names according to your setup.
	*   `fastcgi` directives present in the last server block are used to correctly proxy requests for PHP code execution to PHP-FPM, via the FastCGI protocol.

16. To prevent access to your website via direct input of your IP address into a browser, you can put a catch-all default server block right at the top of the file:

	{: .file-excerpt }
	/etc/nginx/sites-available/default
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

17. You can restart nginx now:

		sudo systemctl restart nginx

18. And finally start Varnish:

		sudo systemctl start varnish

## Install the "Varnish HTTP Purge" Plugin

When you edit a WordPress page and update it the modification won't be visible even if you refresh the browser, because it will receive the cached version of the page. To purge the cached page automatically whenever you edit a page you must install a free WordPress plugin called "Varnish HTTP Purge".

To install this plugin login to your WordPress website, go to **Plugins**, **Add New**, and search for **Varnish HTTP Purge**. Click on **Install Now**, then on **Activate Plugin**.

## Test Your Setup

To test if Varnish and nginx are doing their job for the plain HTTP website, just run:

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

The third line specifies the connection port number: `80`, the backend server is correctly identified: `Server: nginx/1.6.2`, and the traffic passes through Varnish as intended: `Via: 1.1 varnish-v4`. The period of time the object has been kept in cache by Varnish is also displayed in seconds: `Age: 467`.

To test the SSL website run the same command and the output should be similar.

By using nginx in conjunction with Varnish as we've just shown, the speed of any WordPress website can be dramatically improved, while making best use of hardware resources.

You can strengthen the security of the SSL connection by generating a custom Diffie-Hellman (DH) parameter, needed for a more secure cryptographic key exchange process.

A step further can be to enable Varnish logging for the plain HTTP websites, since now Varnish is the first to receive the client requests, while nginx only receives requests for those pages that are not found in cache. For SSL websites the logging should be done by nginx, because client requests pass through it first. Logging becomes even more important if you use log monitoring software such as Fail2ban, Awstats or Webalizer.
