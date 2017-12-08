---
author:
  name: Linode
  email: docs@linode.com
description: 'Install a LEMP stack to serve websites and applications on CentOS 6'
keywords: ["nginx", "lemp", "php", "linux", "web applications"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['lemp-guides/centos-6/','websites/lemp/lemp-server-on-centos-6/']
modified: 2013-01-08
modified_by:
  name: Doug Freed
published: 2011-11-03
title: LEMP Server on CentOS 6
external_resources:
 - '[Basic nginx Configuration](/docs/websites/nginx/basic-nginx-configuration)'
 - '[Clustered Web Servers and Software Load Balancing with nginx](/docs/uptime/loadbalancing/how-to-use-nginx-as-a-front-end-proxy-server-and-software-load-balancer)'
 - '[Deploy CGI and Perl Scripts with Perl-FastCGI and nginx](/docs/web-servers/nginx/perl-fastcgi/centos-5)'
 - '[Use PostgeSQL as an Alternative to MySQL for data storage](/docs/databases/postgresql/centos-5)'
 - '[Deploy Python Applications with uWSGI and nginx](/docs/web-servers/nginx/python-uwsgi/centos-5)'
---

This document describes a compatible alternative to the "LAMP" (Linux, Apache, MySQL, and PHP) stack, known as "LEMP." The LEMP stack replaces the Apache web server component with nginx (pronounced "engine x," providing the "E" in LEMP,) which can increase the ability of the server to scale in response to demand.

Prior to beginning this guide, please complete the [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics).

## Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

## Prepare System For Deployment

Before beginning with the installation of this web application stack, issue the following command to ensure that your system's package database is up to date and that all installed software is running at the latest version:

    yum update

## Install the nginx Web Server

There are several viable and popular options for installing nginx. The first option retrieves packages from the Fedora Project's EPEL software repository and provides a more stable and tested version of the web server.

The second option requires downloading the source for nginx from the upstream provider and compiling the software manually. Manual compilation makes it possible to run the most current version of the software at the expense of the testing and automatic updates from the Fedora project. All options are compatible, but in most cases we recommend using the packages from the EPEL repositories, unless your needs require a version newer than the one available in the EPEL repositories. Possible reasons for compiling nginx yourself include access to optional compile-time modules and features added in more recent versions.

For more in-depth installation instructions consider our [guide to installing nginx](/docs/websites/lemp/lemp-server-on-centos-6).

### Deploy from EPEL Packages

If you choose to install nginx from the EPEL repository, issue the following commands to initialize the EPEL repository and install nginx:

    rpm -Uvh http://dl.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
    yum update
    yum install nginx sudo

This will install version 0.8.54 of the nginx server. Issue the following commands to start nginx for the first and ensure that nginx will start following the next reboot cycle :

    /etc/init.d/nginx start
    chkconfig --add nginx
    chkconfig nginx on

### Compile nginx from Source

If you want to compile and install nginx from source, issue the following command to install the prerequisites:

    yum install zlib-devel wget openssl-devel pcre pcre-devel sudo gcc make autoconf automake

Check the [nginx download page](http://nginx.org/en/download.html) and ensure that version 1.0.0 is the most recent "stable" version. If not, replace the version specified in the following command sequence with the latest stable version. Issue the following commands to download and install the nginx web server:

    cd /opt/
    wget http://nginx.org/download/nginx-1.0.0.tar.gz
    tar -zxvf nginx-1.0.0.tar.gz
    cd /opt/nginx-1.0.0/
    mkdir /var/lib/nginx

The following `./configure` command will prepare nginx for compilation:

    ./configure --prefix=/opt/nginx --user=nginx --group=nginx --with-http_ssl_module

When the `./configure` command completes it will display the following information regarding the location of important nginx-related files after the installation is completed.

    nginx path prefix: "/opt/nginx"
    nginx binary file: "/opt/nginx/sbin/nginx"
    nginx configuration prefix: "/opt/nginx/conf"
    nginx configuration file: "/opt/nginx/conf/nginx.conf"
    nginx pid file: "/opt/nginx/logs/nginx.pid"
    nginx error log file: "/opt/nginx/logs/error.log"
    nginx http access log file: "/opt/nginx/logs/access.log"
    nginx http client request body temporary files: "client_body_temp"
    nginx http proxy temporary files: "proxy_temp"
    nginx http fastcgi temporary files: "fastcgi_temp"

Issue the following commands to compile and then install the software as specified above:

    make
    make install

Create a dedicated system user to run the nginx process under by issuing the following command:

    useradd -M -r --shell /bin/sh --home-dir /opt/nginx nginx

Now create the init script to make it possible to start and stop the web server more easily. Create `/etc/rc.d/init.d/nginx` with the following content:

{{< file-excerpt "/etc/rc.d/init.d/nginx" bash >}}
#!/bin/sh
#
# nginx – this script starts and stops the nginx daemon
#
# chkconfig: - 85 15
# description: Nginx is an HTTP(S) server, HTTP(S) reverse \
# proxy and IMAP/POP3 proxy server
# processname: nginx
# config: /opt/nginx/conf/nginx.conf
# pidfile: /opt/nginx/logs/nginx.pid

# Source function library.
. /etc/rc.d/init.d/functions

# Source networking configuration.
. /etc/sysconfig/network

# Check that networking is up.
[ "$NETWORKING" = "no" ] && exit 0

nginx="/opt/nginx/sbin/nginx"
prog=$(basename $nginx)

NGINX_CONF_FILE="/opt/nginx/conf/nginx.conf"

lockfile=/var/lock/subsys/nginx

start() {
    [ -x $nginx ] || exit 5
    [ -f $NGINX_CONF_FILE ] || exit 6
    echo -n $"Starting $prog: "
    daemon $nginx -c $NGINX_CONF_FILE
    retval=$?
    echo
    [ $retval -eq 0 ] && touch $lockfile
    return $retval
}

stop() {
    echo -n $"Stopping $prog: "
    killproc $prog -QUIT
    retval=$?
    echo
    [ $retval -eq 0 ] && rm -f $lockfile
    return $retval
}

restart() {
    configtest || return $?
    stop
    start
}

reload() {
    configtest || return $?
    echo -n $”Reloading $prog: ”
    killproc $nginx -HUP
    RETVAL=$?
    echo
}

force_reload() {
    restart
}

configtest() {
    $nginx -t -c $NGINX_CONF_FILE
}

rh_status() {
    status $prog
}

rh_status_q() {
    rh_status >/dev/null 2>&1
}

case "$1" in
    start)
        rh_status_q && exit 0
        $1
        ;;
    stop)
        rh_status_q || exit 0
        $1
        ;;
    restart|configtest)
        $1
        ;;
    reload)
        rh_status_q || exit 7
        $1
        ;;
    force-reload)
        force_reload
        ;;
    status)
        rh_status
        ;;
    condrestart|try-restart)
        rh_status_q || exit 0
        ;;
    *)
        echo $"Usage: $0 {start|stop|status|restart|condrestart|try-restart|reload|force-reload|configtest}"
        exit 2
    esac

{{< /file-excerpt >}}


Next issue the following commands to make the script executable, set nginx to start on boot, and start the server for the first time:

    chmod +x /etc/rc.d/init.d/nginx
    chkconfig --add nginx
    chkconfig nginx on
    service nginx start

## Configure nginx Virtual Hosting

Regardless of the method you use to install nginx, you will need to configure `server` declarations to specify name-based virtual hosts. There are a number of approaches to organizing configuration files with nginx. Regardless of the organizational strategy, all virtual host configurations are contained within `server` configuration blocks that are in turn contained within the `http` block in the `nginx.conf` file. Consider the following nginx virtual host configuration:

{{< file-excerpt "nginx server configuration" nginx >}}
server {
       listen   80;
       server_name www.example.com example.com;
       access_log /srv/www/example.com/logs/access.log;
       error_log /srv/www/example.com/logs/error.log;

       location / {
           root   /srv/www/example.com/public_html;
           index  index.html index.htm;
       }
}

{{< /file-excerpt >}}


Create the directories referenced in this configuration by issuing the following commands:

    mkdir -p /srv/www/example.com/public_html
    mkdir -p /srv/www/example.com/logs

You may insert the server directives directly into the `http` section of the `/opt/nginx/conf/nginx.conf` or `/etc/nginx/nginx.con` file, although this may be difficult to manage. You may also replicate the management system created by the Debian/Ubuntu operating systems by creating `sites-available/` and `sites-enabled/` directories and inserting the following line into your `nginx.conf` file:

{{< file-excerpt "nginx.conf" nginx >}}
http {
# [...]

include /opt/etc/nginx/sites-enabled/*;

# [...]
}

{{< /file-excerpt >}}


Modify the include statement to point to the path of your `sites-enabled` directory. Create site configurations in the `sites-available` directory and then create symbolic links to these files in the `sites-enabled` directory. In other circumstances, it may make more sense to create and include a file named `/opt/nginx-sites.conf` that is included in the `nginx.conf` file as follows:

{{< file-excerpt "nginx.conf" nginx >}}
http {
# [...]

include /opt/nginx-sites.conf;

# [...]
}

{{< /file-excerpt >}}


Depending on the size and nature of your deployment, place your virtual host configurations either directly in the `/opt/nginx-sites.conf` file or include statements for server-specific configuration files in the `nginx-sites.file` format. For more information regarding nginx configuration options, consider our [overview of nginx configuration](/docs/websites/nginx/basic-nginx-configuration).

Once you've configured and loaded the nginx configuration, restart the web server to implement the new configuration by issuing the following command:

    /etc/init.d/nginx restart

Make sure that the directories referenced in your configuration exist on your file system before restarting.

## Deploy PHP with FastCGI

If your application includes PHP code you will need to implement the following "PHP-FastCGI" solution to allow nginx to properly handle and serve pages that contain PHP code. Begin the deployment process by issuing the following commands to install the required dependencies:

    rpm -Uvh http://dl.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
    yum update
    yum install php-cli php spawn-fcgi wget

Next you will need to create the scripts that start and control the php-cgi process. First create `/usr/bin/php-fastcgi` with the following contents:

{{< file-excerpt "/usr/bin/php-fastcgi" bash >}}
#!/bin/sh

if [ `grep -c "nginx" /etc/passwd` = "1" ]; then
   FASTCGI_USER=nginx
elif [ `grep -c "www-data" /etc/passwd` = "1" ]; then
   FASTCGI_USER=www-data
elif [ `grep -c "http" /etc/passwd` = "1" ]; then
   FASTCGI_USER=http
else
# Set the FASTCGI_USER variable below to the user that
# you want to run the php-fastcgi processes as

FASTCGI_USER=
fi

/usr/bin/spawn-fcgi -a 127.0.0.1 -p 9000 -C 6 -u $FASTCGI_USER -f /usr/bin/php-cgi

{{< /file-excerpt >}}


Then create the init script to automatically start and the php-cgi process. To do so create a file at `/etc/init.d/php-fastcgi` with the following content:

{{< file-excerpt "/etc/init.d/php-fastcgi" bash >}}
#!/bin/sh

# php-fastcgi - Use php-fastcgi to run php applications
#
# chkconfig: - 85 15
# description: Use php-fastcgi to run php applications
# processname: php-fastcgi

if [ `grep -c "nginx" /etc/passwd` = "1" ]; then
   OWNER=nginx
elif [ `grep -c "www-data" /etc/passwd` = "1" ]; then
   OWNER=www-data
elif [ `grep -c "http" /etc/passwd` = "1" ]; then
   OWNER=http
else
# Set the OWNER variable below to the user that
# you want to run the php-fastcgi processes as

OWNER=
fi

PATH=/sbin:/bin:/usr/sbin:/usr/bin
DAEMON=/usr/bin/php-fastcgi

NAME=php-fastcgi
DESC=php-fastcgi

test -x $DAEMON || exit 0

# Include php-fastcgi defaults if available
if [ -f /etc/default/php-fastcgi ] ; then
    . /etc/default/php-fastcgi
fi

set -e

case "$1" in
  start)
    echo -n "Starting $DESC: "
    sudo -u $OWNER $DAEMON
    echo "$NAME."
    ;;
  stop)
    echo -n "Stopping $DESC: "
    killall -9 php-cgi
    echo "$NAME."
    ;;
  restart)
    echo -n "Restarting $DESC: "
    killall -9 php-cgi
    sleep 1
    sudo -u $OWNER $DAEMON
    echo "$NAME."
    ;;
      *)
        N=/etc/init.d/$NAME
        echo "Usage: $N {start|stop|restart}" >&2
        exit 1
        ;;
    esac
    exit 0

{{< /file-excerpt >}}


Issue the following sequence of commands to make the scripts executable, start the process for the first time, and ensure that the process will start following a reboot cycle:

    chmod +x /usr/bin/php-fastcgi
    chmod +x /etc/init.d/php-fastcgi
    service php-fastcgi start
    chkconfig --add php-fastcgi
    chkconfig php-fastcgi on

Edit the `/etc/sudoers` file to comment the `Defaults    requiretty` line and ensure that the init script will start on boot. Create a comment by prepending a hash (e.g. `#`) to the beginning of the line, so that it resembles the following:

{{< file-excerpt "/etc/sudoers" >}}
# Defaults requiretty

{{< /file-excerpt >}}


Consider the following nginx virtual host configuration. Modify your configuration to resemble the one below, and ensure that the `location ~ \.php$ { }` resembles the one in this example:

{{< file "nginx virtual host configuration" nginx >}}
server {
    server_name www.example.com example.com;
    access_log /srv/www/example.com/logs/access.log;
    error_log /srv/www/example.com/logs/error.log;
    root /srv/www/example.com/public_html;

    location / {
        index index.html index.htm index.php;
    }

    location ~ \.php$ {
        include /etc/nginx/fastcgi_params;
        fastcgi_pass  127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME /srv/www/example.com/public_html$fastcgi_script_name;
    }
}

{{< /file >}}

**Important security note:** If you're planning to run applications that support file uploads (images, for example), the above configuration may expose you to a security risk by allowing arbitrary code execution. The short explanation for this behavior is that a properly crafted URI which ends in ".php", in combination with a malicious image file that actually contains valid PHP, can result in the image being processed as PHP. For more information on the specifics of this behavior, you may wish to review the information provided on [Neal Poole's blog](https://nealpoole.com/blog/2011/04/setting-up-php-fastcgi-and-nginx-dont-trust-the-tutorials-check-your-configuration/).

To mitigate this issue, you may wish to modify your configuration to include a `try_files` directive. Please note that this fix requires nginx and the php-fcgi workers to reside on the same server.

{{< file-excerpt "nginx virtual host configuration" nginx >}}
location ~ \.php$ {
    try_files $uri =404;
    include /etc/nginx/fastcgi_params;
    fastcgi_pass 127.0.0.1:9000;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /srv/www/example.com/public_html$fastcgi_script_name;
}
{{< /file-excerpt >}}

Additionally, it's a good idea to secure any upload directories your applications may use. The following configuration excerpt demonstrates securing an "/images" directory.

{{< file-excerpt "nginx virtual host configuration" nginx >}}
location ~ \.php$ {
    include /etc/nginx/fastcgi_params;
    if ($uri !~ "^/images/") {
    fastcgi_pass 127.0.0.1:9000;
    }
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME /srv/www/example.com/public_html$fastcgi_script_name;
}
{{< /file-excerpt >}}

When you've completed the modifications to the configuration, make sure that the virtual host is enabled and issue the following command to restart the web server:

    /etc/init.d/nginx restart

Congratulations! You can now deploy PHP scripts with your LEMP stack.

## Install the MySQL Database Server

The MySQL database engine may be the leading open source relational database engine, and is a popular database solution for web-based applications. Issue the following command to install the MySQL server packages:

    yum install mysql-server php-mysql

Issue the following commands to start the MySQL service and ensure that the service starts following the next boot sequence:

    /etc/rc.d/init.d/mysqld start
    chkconfig mysqld on

Issue the following command to secure the MySQL instance. Answer all questions as prompted during this process:

    mysql_secure_installation

Issue the following command to get a root prompt for the MySQL server:

    mysql -u root -p

Enter the root password created above and then issue the following sequence of commands to create the `example` and `username` database users, grant the `username` user access to the `example` database, and exit from the database:

    CREATE DATABASE example;
    CREATE USER 'username' IDENTIFIED BY 's8723hk2';
    GRANT ALL PRIVILEGES ON example.* TO 'username';
    exit

You may now provide the credentials for the `example` database and the `bagman` user to your application, which will now be able to use the database for its purposes. To ensure that PHP will be able to access the MySQL connector your just installed, restart the PHP service by issue the following command:

    /etc/init.d/php-fastcgi restart

Congratulations! You now have a fully functional and fully featured LEMP stack for application deployment.

## Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please follow the announcements, lists, and RSS feeds on the pages linked below to ensure you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed:

-   [nginx Security Advisories](http://nginx.org/en/security_advisories.html)
-   [nginx Announcements](http://nginx.org/)

When upstream sources offer new releases, repeat the instructions for installing nginx and recompile your software when needed. These practices are crucial for the ongoing security and functioning of your system.
