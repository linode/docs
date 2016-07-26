---
author:

    name: Suyash Jain
    email: me@suyashjain.com

description: 'Complete NGINX based load balancer.'

keywords: 'Nginx WAF,SSL Termination,'

license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'

published: 'Wednesday, June 29th, 2016'

modified: Wednesday, June 29th, 2016

modified_by:

     name: Suyash Jain

title: 'Nginx Based SSL Terminator and Web Application Firewall'

contributor:
  
    name: Suyash Jain
    link: https://github.com/suyashjain

---


# NGINX Load Balancer #

### Before You Begin ###

1.  This guide assumes that you have some level of knowledge about NGINX.This guide does not provide detailed explanation of configuration.
2.  This guide also request to go through the entire guide once before you actaully start implementing things.

### 1.	Introduction ###

This document will help you in setting up an NGINX with the following facilities.

- Web Application Firewall - Naxsi module
- SSL Termination with A+ TLS configuration(verified by Qualys SSL Labs)
- Compression
- Load Balancer

Note: The installation is based on CentOS 6/RHEL 6 but should work on ubuntu also with small change.

### 2.Install Prerequisite Packages ###
- **Install epel repo**



		yum -y install https://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm

- **Install required packages**


		yum –y install unzip wget pcre pcre-devel gcc openssl-devel 

- Create a temporary directory in /tmp



		mkdir /tmp/nginx
		cd /tmp/nginx

- Install PCRE From source (only if rpm is not available)

			wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.36.tar.gz
			cd pcre-8.36
			./configure --enable-jit
			make
	     	make install 
     
### 3. Download NGINX and Naxsi ###

The NGINX rpm is also available but that does not provide you the NAXSI module, So here we will compile it from source.

Download NGINX latest release from the following location. 

While writing the paper, NGINX1.10.1 was the latest stable release.

[Nginx download link](http://NGINX.org/en/download.html) - http://NGINX.org/en/download.html

Naxsi is hosted on github, download it through the following URL directly.

[Naxsi download link](https://github.com/nbs-system/naxsi/archive/master.zip) 

Download the packages:- 

		wget http://NGINX.org/download/nginx-1.10.1.tar.gz
		wget https://github.com/nbs-system/naxsi/archive/master.zip
  	
un archive the dpackages.

		unzip master.zip
		tar –zxvf nginx-1.10.1.tar.gz


confirm the folders:-
 
     [root@suyash NGINX]# ls
      master.zip  naxsi-master  nginx-1.10.1  nginx-1.10.1.tar.gz


### 4.Compile NGINX ###

Compile nginx with required modules and disable un necessary one.


		cd NGINX-1.10.1
		./configure --conf-path=/etc/nginx/nginx.conf --add-module=../naxsi-master/naxsi_src/  --error-log-path=/var/log/nginx/error.log --http-client-body-temp-path=/var/lib/nginx/body --http-fastcgi-temp-path=/var/lib/nginx/fastcgi --http-log-path=/var/log/nginx/access.log --http-proxy-temp-path=/var/lib/nginx/proxy --lock-path=/var/lock/nginx.lock --pid-path=/var/run/nginx.pid --with-http_ssl_module --without-mail_pop3_module --without-mail_smtp_module --without-mail_imap_module --without-http_uwsgi_module --without-http_scgi_module  --prefix=/usr --with-http_stub_status_module   --without-http_autoindex_module
		make
		make install

- copy naxsi rule files - copied with source

		cp ../naxsi-master/naxsi_config/naxsi_core.rules /etc/nginx/

- some arrangements

		mkdir /etc/nginx/sites-enabled/
		useradd www
		mkdir "/var/lib/nginx/body"

### 5.Configuration ###

NGINX have four important files.

- /etc/nginx/nginx.conf
- /etc/nginx/sites-enabled/default
- /etc/nginx/naxsi.rules
- /etc/nginx/naxsi_core.rules


### /etc/nginx/nginx.conf ###
   
- global config
 

        user www;
        worker_rlimit_core  500M;
        working_directory   /var/nginx/;
        error_log   		/var/nginx/log/error.log;
        pid 				/var/nginx/nginx.pid;

		events {
			worker_connections  1024;
			use epoll;
		}

- include naxsi core rules (in http section )
    
    	include /etc/nginx/naxsi_core.rules;
    	include /etc/nginx/mime.types;
- default access-log (in http section )

    	server_names_hash_bucket_size   128;
    	access_log  /var/nginx/log/access.log;

    	sendfile on;
    	keepalive_timeout   6 5;
    	tcp_nodelay on;

- enable compression (in http section )
    
	    gzip on;
    	gzip_disable "MSIE [1-6]\.(?!.*SV1)";
    	gzip_vary   on;
    	gzip_buffers16 8k;
    	gzip_http_version 1.0;
    	gzip_comp_level 6;
    	gzip_proxied any;
    	gzip_types  text/plain text/css application/x-javascript text/xml application/xml application/xml+rss text/javascript;
    
    	fastcgi_buffers 16 16k;
    	fastcgi_buffer_size 32k;

- disble signature (in http section )

    	server_tokens   off;

- client specific configuration (in http section )

    	client_body_buffer_size 1k;
    	client_header_buffer_size   1k;
	    large_client_header_buffers 2 1k;
    	client_header_timeout   10;
    	send_timeout 10;
    	client_body_timeout 10;

- cache config (in http section )
    
    	proxy_cache_path/var/nginx/cache levels=1:2 keys_zone=one:10m max_size=1g inactive=30m;
    	proxy_intercept_errors  on;
    	proxy_cache one;

- log format (in http section )
    
    	log_format  main'$remote_addr - $remote_user [$time_local] '
    					'"$request" $status $body_bytes_sent "$http_referer" '
    					'"$http_user_agent" "$connection"';

- include other configuration files (in http section )
    
    	include /etc/nginx/sites-enabled/*;
    
     
### /etc/nginx/sites-enabled/default ###
    
- Configue the backend servers
 
         upstream backend80 {
         server  172.16.1.2:80;
         server  172.16.1.3:80;
         server  172.16.1.4:80 backup;
        }

- Configue the SSL (in server section)

    
    
    	listen  *:443 ssl;
    
    	ssl on;
    	ssl_certificate /etc/nginx/ssl/certificate.pem;
    	ssl_certificate_key /etc/nginx/ssl/certificate-privateKey.key;
    	ssl_trusted_certificate 	  /etc/nginx/ssl/certificate.pem;
- do not allow SSLv1 and SSLv2
    
   		ssl_protocols   TLSv1 TLSv1.1 TLSv1.2;
- disable weak ciphers

    	ssl_ciphers'!DHE-DSS-AES256-GCM-SHA384:!DHE-RSA-AES256-GCM-SHA384:!DHE-RSA-AES256-SHA256:!DHE-DSS-AES256-SHA256:!DHE-RSA-AES256-SHA:!DHE-DSS-AES256-SHA:!DHE-RSA-CAMELLIA256-SHA:!DHE-DSS-CAMELLIA256-SHA:!DHE:!MD5:!RC4:!EXPORT:!aNULL:!eNull:!DHE-RSA-AES128-GCM-SHA256:!DHE-RSA-AES128-CBC-SHA256:kEECDH+ECDSA+AES128:kEECDH+ECDSA+AES256:kEECDH+AES128:kEECDH+AES256:kEDH+AES128:kEDH+AES256:DES-CBC3-SHA:+SHA:!aNULL:!eNULL:!LOW:!kECDH:!DSS:!MD5:!EXP:!PSK:!SRP:!CAMELLIA:!SEED';

- configure dhparam

    	ssl_dhparam /etc/nginx/ssl/dhparam.pem;

**Note:- If you are running java 6 in backend (tomcat or weblogic), in that case you must use 1024 bit dhparam as 2048bit is not supported by upto java 6.**

- Force to use server supported ciphers only    
    
    	ssl_prefer_server_ciphers   on;
    	ssl_session_cache   builtin:1000  shared:SSL:10m;

- Configure Error Pages  (in server section)
    
    	error_page  404 /404.html;
    	error_page  418 /404.html;
    	location = /404.html {
        	root	html;
    	}

- Configure the additional headers for security (in server section)

   		add_header  Strict-Transport-Security max-age=63072000;
    	add_header  X-Frame-Options "SAMEORIGIN";
    	add_header  X-Forwarded-Proto $scheme;

- Configure the log to sent to syslog:- you must enable the syslog to accept syslog messages on 514/udp.      (in server section)
    	
    	error_log   syslog:server=127.0.0.1,facility=local7,tag=WEB_LB01_443,severity=error;
    	access_log  syslog:server=127.0.0.1,facility=local7,tag=WEB_LB01_443,severity=info main;
    
- configure Proxy header  (in server section)
       
    	location / {

    		proxy_buffering 							on;
    		proxy_buffer_size   						8k;
    		proxy_buffers   							24 4k;
    		proxy_busy_buffers_size 					8k;
    
    		proxy_max_temp_file_size					2048m;
    		proxy_temp_file_write_size  				32k;
    
    		proxy_read_timeout  300;
    
    		proxy_set_headerhost 						$host:$server_port;
    		proxy_set_headerX-Real-IP 					$remote_addr;
    		proxy_set_headerX-Forwarded-For 			$proxy_add_x_forwarded_for;
    		proxy_set_headerX-Forwarded-Proto 			$scheme;
    		proxy_set_headerX-Frame-Options 			"SAMEORIGIN";

- Enable Naxsi  (in server section)

    		include /etc/nginx/naxsi.rules;
- Configure the Load balancer requests  (in server section)

    		proxy_pass  http://backend80;

    

    
    
### /etc/NGINX/naxsi.rules ###

     LearningMode; #Enables learning mode
     SecRulesEnabled;
     #SecRulesDisabled;
     DeniedUrl "/RequestDenied";
     ## check rules
     CheckRule "$SQL >= 8" BLOCK;
     CheckRule "$RFI >= 8" BLOCK;
     CheckRule "$TRAVERSAL >= 4" BLOCK;
     CheckRule "$EVADE >= 4" BLOCK;
     CheckRule "$XSS >= 8" BLOCK;
     CheckRule "$FILETYPE >=8" BLOCK;

Note:-

- In current setup NGINX will not drop any malicious request as we have enabled the **LearningMode** option in **naxsi.rules** file. 
- o once you are sure that nothing genuine is being blocked then you can comment that out and restart the NGINX.

### 6.Start/Stop NGINX ###

Execute the following command
	
	nginx


You should see the following two lines in running programs

	ps uax | grep nginx
	root  7688  0.0  0.0  45300  1244 ?Ss   May18   0:00 nginx: master process NGINX
	www   7689  0.0  0.1  45856  2576 ?SMay18   0:01 nginx: worker process
  

To stop NGINX

	nginx –s stop

**Thats ALL**


***Extra Notes:-***

- How to generate dhparam.pem

		openssl dhparam -out dhparam.pem 2048

- download the files

	You can download the files from the following [github](https://github.com/suyashjain/nginx-lb) location.

- for ubuntu installation
	
	Just install the required packagaes. Rest is same.
- nginx root home

	in general **/usr/html** is the root path where you save the static files, like error files. 
	
	Write you own error files in html format.
- logs to file

	you can enable the logs to file through the following configuration

		access_log <access log file path>
		error_log <error log file path>
