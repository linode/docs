---
author:
  name: Linode
  email: docs@linode.com
description: 'Serve dynamic websites and applications with the lightweight nginx web server and PHP-FastCGI on Ubuntu 11.04 (Natty).'
keywords: ["nginx", "nginx ubuntu 11.04", "nginx fastcgi", "nginx php"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/php-fastcgi/ubuntu-11-04-natty/','websites/nginx/nginx-and-phpfastcgi-on-ubuntu-11-04-natty/']
modified: 2013-02-18
modified_by:
  name: Linode
published: 2011-05-06
title: 'Nginx and PHP-FastCGI on Ubuntu 11.04 (Natty)'
deprecated: true
---

The nginx web server is a fast, lightweight server designed to efficiently handle the needs of both low and high traffic websites. Although commonly used to serve static content, it's quite capable of handling dynamic pages as well. This guide will help you get nginx up and running with PHP via FastCGI on your Ubuntu 11.04 (Natty) Linode.

It is assumed that you've already followed the steps outlined in our [getting started guide](/docs/getting-started/). These steps should be performed via a root login to your Linode over SSH.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Install Required Packages

Issue the following commands to update your system and install the nginx web server, PHP, and compiler tools:

    apt-get update
    apt-get upgrade
    apt-get install nginx php5-cli php5-cgi spawn-fcgi psmisc

# Configure Virtual Hosting

### Create Directories

In this guide, the domain "example.com" is used as an example site. You should substitute your own domain name in the configuration steps that follow. First, create directories to hold content and log files:

    mkdir -p /srv/www/www.example.com/public_html
    mkdir /srv/www/www.example.com/logs
    chown -R www-data:www-data /srv/www/www.example.com

### UNIX Sockets Configuration Example

Next, you'll need to define the site's virtual host file. This example uses a UNIX socket to connect to fcgiwrap. Be sure to change all instances of "example.com" to your domain name.

{{< file "/etc/nginx/sites-available/www.example.com" nginx >}}
server {
    server_name www.example.com example.com;
    access_log /srv/www/www.example.com/logs/access.log;
    error_log /srv/www/www.example.com/logs/error.log;
    root /srv/www/www.example.com/public_html;

    location / {
        index  index.html index.htm;
    }

    location ~ \.php$ {
        include /etc/nginx/fastcgi_params;
        fastcgi_pass unix:/var/run/php-fastcgi/php-fastcgi.socket;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME /srv/www/www.example.com/public_html$fastcgi_script_name;
    }
}

{{< /file >}}


Create a file named `/usr/bin/php-fastcgi` with the following contents:

{{< file "/usr/bin/php-fastcgi" bash >}}
#!/bin/bash

FASTCGI_USER=www-data
FASTCGI_GROUP=www-data
SOCKET=/var/run/php-fastcgi/php-fastcgi.socket
PIDFILE=/var/run/php-fastcgi/php-fastcgi.pid
CHILDREN=6
PHP5=/usr/bin/php5-cgi

/usr/bin/spawn-fcgi -s $SOCKET -P $PIDFILE -C $CHILDREN -u $FASTCGI_USER -g $FASTCGI_GROUP -f $PHP5

{{< /file >}}


Make it executable by issuing the following command:

    chmod +x /usr/bin/php-fastcgi

### TCP Sockets Configuration Example

Alternately, you may wish to use TCP sockets instead. If so, modify your nginx virtual host configuration file to resemble the following example. Again, make sure to replace all instances of "example.com" with your domain name.

{{< file "/etc/nginx/sites-available/www.example.com" nginx >}}
server {
    server_name www.example.com example.com;
    access_log /srv/www/www.example.com/logs/access.log;
    error_log /srv/www/www.example.com/logs/error.log;
    root /srv/www/www.example.com/public_html;

    location / {
        index  index.html index.htm;
    }

    location ~ \.php$ {
        include /etc/nginx/fastcgi_params;
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME /srv/www/www.example.com/public_html$fastcgi_script_name;
    }
}

{{< /file >}}


Create a file named `/usr/bin/php-fastcgi` with the following contents:

{{< file "/usr/bin/php-fastcgi" bash >}}
#!/bin/bash

FASTCGI_USER=www-data
FASTCGI_GROUP=www-data
ADDRESS=127.0.0.1
PORT=9000
PIDFILE=/var/run/php-fastcgi/php-fastcgi.pid
CHILDREN=6
PHP5=/usr/bin/php5-cgi

/usr/bin/spawn-fcgi -a $ADDRESS -p $PORT -P $PIDFILE -C $CHILDREN -u $FASTCGI_USER -g $FASTCGI_GROUP -f $PHP5

{{< /file >}}


Make it executable by issuing the following command:

    chmod +x /usr/bin/php-fastcgi

### Important Security Considerations

If you're planning to run applications that support file uploads (images, for example), the above configurations may expose you to a security risk by allowing arbitrary code execution. The short explanation for this behavior is that a properly crafted URI which ends in ".php", in combination with a malicious image file that actually contains valid PHP, can result in the image being processed as PHP.

To mitigate this issue, you may wish to modify your configuration to include a `try_files` directive. Please note that this fix requires nginx and the php-fcgi workers to reside on the same server.

{{< file-excerpt "/etc/nginx/sites-available/www.example.com" nginx >}}
location ~ \.php$ {
    try_files $uri =404;
    include /etc/nginx/fastcgi_params;
    fastcgi_pass unix:/var/run/php-fastcgi/php-fastcgi.socket;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /srv/www/www.example.com/public_html$fastcgi_script_name;
}
{{< /file-excerpt >}}

Additionally, it's a good idea to secure any upload directories your applications may use. The following configuration excerpt demonstrates securing an "/images" directory.

{{< file-excerpt "/etc/nginx/sites-available/www.example.com" nginx >}}
location ~ \.php$ {
    include /etc/nginx/fastcgi_params;
    if ($uri !~ "^/images/") {
        fastcgi_pass unix:/var/run/php-fastcgi/php-fastcgi.socket;
    }
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /srv/www/www.example.com/public_html$fastcgi_script_name;
}
{{< /file-excerpt >}}

### Enable and Start Services

Issue the following commands to enable the site:

    cd /etc/nginx/sites-enabled/
    ln -s /etc/nginx/sites-available/www.example.com

Create a file named `/etc/init.d/php-fastcgi` with the following contents:

{{< file "/etc/init.d/php-fastcgi" bash >}}
#!/bin/bash

PHP_SCRIPT=/usr/bin/php-fastcgi
FASTCGI_USER=www-data
FASTCGI_GROUP=www-data
PID_DIR=/var/run/php-fastcgi
PID_FILE=/var/run/php-fastcgi/php-fastcgi.pid
RET_VAL=0

case "$1" in
    start)
      if [[ ! -d $PID_DIR ]]
      then
        mkdir $PID_DIR
        chown $FASTCGI_USER:$FASTCGI_GROUP $PID_DIR
        chmod 0770 $PID_DIR
      fi
      if [[ -r $PID_FILE ]]
      then
        echo "php-fastcgi already running with PID `cat $PID_FILE`"
        RET_VAL=1
      else
        $PHP_SCRIPT
        RET_VAL=$?
      fi
  ;;
    stop)
      if [[ -r $PID_FILE ]]
      then
        kill `cat $PID_FILE`
        rm $PID_FILE
        RET_VAL=$?
      else
        echo "Could not find PID file $PID_FILE"
        RET_VAL=1
      fi
  ;;
    restart)
      if [[ -r $PID_FILE ]]
      then
        kill `cat $PID_FILE`
        rm $PID_FILE
        RET_VAL=$?
      else
        echo "Could not find PID file $PID_FILE"
      fi
      $PHP_SCRIPT
      RET_VAL=$?
  ;;
    status)
      if [[ -r $PID_FILE ]]
      then
        echo "php-fastcgi running with PID `cat $PID_FILE`"
        RET_VAL=$?
      else
        echo "Could not find PID file $PID_FILE, php-fastcgi does not appear to be running"
      fi
  ;;
    *)
      echo "Usage: php-fastcgi {start|stop|restart|status}"
      RET_VAL=1
  ;;
esac
exit $RET_VAL

{{< /file >}}


Start php-fastcgi and nginx by issuing the following commands:

    chmod +x /etc/init.d/php-fastcgi
    update-rc.d php-fastcgi defaults
    /etc/init.d/php-fastcgi start
    /etc/init.d/nginx start

# Test PHP with FastCGI

Create a file called "test.php" in your site's "public\_html" directory with the following contents:

{{< file "/srv/www/example.com/public\\_html/test.php" php >}}
<?php phpinfo(); ?>

{{< /file >}}


When you visit `http://www.example.com/test.php` in your browser, the standard "PHP info" output is shown. Congratulations, you've configured the nginx web server to use PHP-FastCGI for dynamic content!

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The nginx Homepage](http://nginx.org/)
- [FastCGI Project Homepage](http://www.fastcgi.com/)
- [PHP Documentation](http://www.php.net/docs.php)
- [Basic Ngnix Configuration](/docs/websites/nginx/basic-nginx-configuration)
