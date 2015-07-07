---
author:
  name: Linode
  email: docs@linode.com
description: 'A basic guide to installing nginx from source on Ubuntu 14.04 LTS (Trusty Tahr)'
keywords: 'nginx,nginx ubuntu 14.04,http,web servers,ubuntu,ubuntu 14.04,ubuntu'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Tuesday, July 7th, 2015
modified_by:
  name: Elle Krout
published: 'Tuesday, July 7th, 2015'
title: 'Installing Nginx on Ubuntu 14.04 LTS'
external_links:
 - '[Linode Library nginx Documentation](/docs/web-servers/nginx/)'
 - '[nginx Community Documentation](http://wiki.nginx.org)'
---

Nginx is a lightweight, high performance web server designed with the purpose of delivering large amounts of static content quickly and with efficient use of system resources. In contrast to the [Apache server](/docs/web-servers/apache/), Nginx uses an asynchronous event-driven model which provides more predictable performance under load.

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname run:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

2.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Installing Nginx


### Install Nginx from Ubuntu Repositories

Nginx is included in the Ubuntu software repositories. While using this method will leave you with a working web server *it is not the preferred method for installing Nginx.* Installing Nginx from the Ubuntu repositories ensures that Nginx has been tested and successfully runs at its best on Ubuntu. However, the Ubuntu repositories are often a few versions behind the latest Nginx release.

1.  Install the Nginx web server:

        sudo apt-get install nginx

2.  Start the server:

        sudo service nginx start

3.  Nginx can be tested by navigating to your FQDN in your browser. The default Nginx page should be present.


### Install Nginx from a Source Distribution


1.  Install Nginx's dependencies:

        sudo apt-get install libpcre3-dev build-essential libssl-dev

2.  The source files and binaries will be downloaded in the `/opt/` directory. Navigate to `/opt/`:

        cd /opt/

3.  Download the [latest version](http://nginx.org/) of Nginx, which can be found on their website. At the time of publication, Nginx 1.9.2 is the mainline version:

        sudo wget http://nginx.org/download/nginx-1.9.2.tar.gz

4.  Expand the file, then navigate to the new directory:

        sudo tar -zxvf nginx*.tar.gz
        cd /opt/nginx-*

5.  Configure the build options:

        sudo ./configure --prefix=/opt/nginx --user=nginx --group=nginx --with-http_ssl_module --with-ipv6

    When the configuration process completes successfully, you will see the following output:

        Configuration summary
          + using system PCRE library
          + using system OpenSSL library
          + md5: using OpenSSL library
          + sha1: using OpenSSL library
          + using system zlib library

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
          nginx http uwsgi temporary files: "uwsgi_temp"
          nginx http scgi temporary files: "scgi_temp"

6.  Build and install Nginx with the above configuration:

        sudo make
        sudo make install

7.  As the root user create a user and group for Nginx:

        sudo adduser --system --no-create-home --disabled-login --disabled-password --group nginx 

    Nginx is now installed in `/opt/nginx`.

8.  Create a script to manage Nginx:

    {: .file}
    /etc/init.d/nginx
    :   ~~~
        #! /bin/sh

        ### BEGIN INIT INFO
        # Provides:          nginx
        # Required-Start:    $all
        # Required-Stop:     $all
        # Default-Start:     2 3 4 5
        # Default-Stop:      0 1 6
        # Short-Description: starts the nginx web server
        # Description:       starts nginx using start-stop-daemon
        ### END INIT INFO

        PATH=/opt/nginx/sbin:/sbin:/bin:/usr/sbin:/usr/bin
        DAEMON=/opt/nginx/sbin/nginx
        NAME=nginx
        DESC=nginx

        test -x $DAEMON || exit 0

        # Include nginx defaults if available
        if [ -f /etc/default/nginx ] ; then
                . /etc/default/nginx
        fi

        set -e

        case "$1" in
          start)
                echo -n "Starting $DESC: "
                start-stop-daemon --start --quiet --pidfile /opt/nginx/logs/$NAME.pid \
                        --exec $DAEMON -- $DAEMON_OPTS
                echo "$NAME."
                ;;
          stop)
                echo -n "Stopping $DESC: "
                start-stop-daemon --stop --quiet --pidfile /opt/nginx/logs/$NAME.pid \
                        --exec $DAEMON
                echo "$NAME."
                ;;
          restart|force-reload)
                echo -n "Restarting $DESC: "
                start-stop-daemon --stop --quiet --pidfile \
                        /opt/nginx/logs/$NAME.pid --exec $DAEMON
                sleep 1
                start-stop-daemon --start --quiet --pidfile \
                        /opt/nginx/logs/$NAME.pid --exec $DAEMON -- $DAEMON_OPTS
                echo "$NAME."
                ;;
          reload)
                  echo -n "Reloading $DESC configuration: "
                  start-stop-daemon --stop --signal HUP --quiet --pidfile     /opt/nginx/logs/$NAME.pid \
                      --exec $DAEMON
                  echo "$NAME."
                  ;;
              *)
                    N=/etc/init.d/$NAME
                    echo "Usage: $N {start|stop|restart|reload|force-reload}" >&2
                    exit 1
                    ;;
            esac

            exit 0
        ~~~

9.  Make the file executable and add it to the default run levels:

        sudo chmod +x /etc/init.d/nginx
        /usr/sbin/update-rc.d -f nginx defaults 

10. Start Nginx:

        sudo service nginx start

Continue reading our introduction to [Basic Nginx Configuration](/docs/websites/nginx/basic-nginx-configuration) for more information about using and setting up a web server.