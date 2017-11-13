---
deprecated: true
author:
    name: Linode
    email: docs@linode.com
description: 'A basic guide to installing nginx from source on Ubuntu 12.04 LTS (Precise Pangolin)'
keywords: ["nginx", "nginx ubuntu 12.04", "http", "web servers", "ubuntu", "ubuntu l2.04", "ubuntu precise pangolin"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/installation/ubuntu-12-04-precise-pangolin','websites/nginx/websites-with-nginx-on-ubuntu-12-04-lts-precise-pangolin/','websites/nginx/websites-with-nginx-on-ubuntu-12-04-lts-precise-pangolin/index.cfm/','websites/nginx/install-nginx-ubuntu-12-04/','websites/nginx/installing-nginx-on-ubuntu-12-04-lts-precise-pangolin/']
modified: 2015-09-16
modified_by:
  name: Elle Krout
published: 2012-10-24
title: 'Installing Nginx on Ubuntu 12.04 LTS (Precise Pangolin)'
external_links:
 - '[Linode nginx Documentation](/docs/web-servers/nginx/)'
 - '[nginx Community Documentation](http://wiki.nginx.org)'
 - '[Configure Perl and FastCGI with nginx](/docs/web-servers/nginx/perl-fastcgi/ubuntu-10.04-lucid)'
 - '[Configure PHP and FastCGI with nginx](/docs/web-servers/nginx/php-fastcgi/ubuntu-10.04-lucid)'
---

Nginx is a lightweight, high performance web server designed to deliver large amounts of static content quickly and with efficient use of system resources. In contrast to the [Apache server](/docs/web-servers/apache/), Nginx uses an asynchronous event-driven model which provides more predictable performance under load.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname run:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

2.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Installing Nginx

There are [two branches](https://www.nginx.com/products/feature-matrix/) of Nginx. *Nginx Open Source* will be the focus of this guide and there are two sources from which you can install it on your Linode: Either from a distro's repositories or from [NGINX Inc.](https://www.nginx.com/), the company which formed behind the software to provide commercial features and support. Each way has its benefits and drawbacks.

### Installing from Ubuntu's Repositories

This method is the easiest and it ensures that Nginx has been tested to run at its best on Ubuntu. The Ubuntu repositories are often a few versions behind the latest Nginx stable release, so while Nginx will still receive security patches, it can be lacking features and bug fixes in comparison.

1.  Install the Nginx web server:

        sudo apt-get install nginx

    The server will automatically start after the installation completes.

2.  Go to the [Testing Nginx](#testing-nginx) section of this guide to ensure your server is accessible.


### Installing from NGINX

Nginx's [downloads page](https://www.nginx.com/download-oss-information/) has two more ways to install the web server: Using pre-built packages from the official Nginx repository or by building from source code. Either method will give you a more current version than what's available in Trusty Tahr but with a slightly higher chance of encountering unforseen issues because of newly-introduced bugs, and that these releases are not tested exclusively for a specific Linux distribution.

#### Installing from the Offcial Nginx Repository

The binary packages from Nginx's repo will update you to new versions of the web server when available. You can choose the [stable](http://nginx.org/en/linux_packages.html#stable) or [mainline](http://nginx.org/en/linux_packages.html#mainline) versions. If unsure, choose stable, which will be the example used for the remainder of this guide.

1.  Add the Nginx repository to Ubuntu's `sources.list` file:

    {{< file-excerpt "/etc/apt/sources.list" >}}
deb http://nginx.org/packages/ubuntu/ trusty nginx
deb-src http://nginx.org/packages/ubuntu/ trusty nginx

{{< /file-excerpt >}}


    {{< note >}}
The `deb-src` line is only needed if you want repository access to Nginx's source code.
{{< /note >}}

2.  Download and add Nginx's repository key to your GPG keyring:

        sudo wget http://nginx.org/keys/nginx_signing.key
        sudo apt-key add nginx_signing.key

3.  Update the repository lists and install Nginx:

    The server will automatically start after the installation completes.

4. Go to the [Testing Nginx](#testing-nginx) section of this guide to ensure your server is accessible.


#### Installing from Source Distribution

Compiling from source gives you the most flexibility and choice for optimization with [compiling options](http://wiki.nginx.org/InstallOptionsz) and [third-party modules](http://wiki.nginx.org/Nginx3rdPartyModules). You can also verify the PGP signature of the distributed tarball before compiling.

1.  Install the needed dependencies to build Nginx:

        sudo apt-get install libpcre3-dev build-essential libssl-dev

2.  You can use any location you prefer to build from. Here, `/opt` will be used. Navigate to it:

        cd /opt

3.  [Download](https://www.nginx.com/) the latest version of Nginx Open Source and its PGP signature. You will have the choice of mainline, stable or legacy versions. Again, stable (1.8.0 at the time of this writing) is used as an example.

        sudo wget http://nginx.org/download/nginx-1.8.0.tar.gz
        sudo wget http://nginx.org/download/nginx-1.8.0.tar.gz.asc

4.  Attempt to verify the tarball's signature:

        gpg nginx-1.8.0.tar.gz.asc

    **The check will fail** because you don't yet have the public RSA key of the signer, and to get it you first need the RSA key ID from the output:

        gpg: Signature made Tue 21 Apr 2015 02:14:01 PM UTC using RSA key ID A1C052F8
        gpg: Can't check signature: public key not found

    Run the key check again:

        gpg nginx-1.8.0.tar.gz.asc

    The output should include:

        gpg: Good signature from "Maxim Dounin <mdounin@mdounin.ru>"
        gpg: key A1C052F8: public key "Maxim Dounin <mdounin@mdounin.ru>" imported
        gpg: no ultimately trusted keys found
        gpg: Total number processed: 1
        gpg:               imported: 1  (RSA: 1)

5.  Expand the source code and change to the new directory:

        sudo tar -zxvf nginx*.tar.gz
        cd /opt/nginx-*

5.  Configure the build options:

        sudo ./configure --prefix=/opt/nginx --user=nginx --group=nginx --with-http_ssl_module

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

7.  As the root user, create a separate user and group for Nginx:

        sudo adduser --system --no-create-home --disabled-login --disabled-password --group nginx

    NGINX is now installed in `/opt/nginx`.

8.  Installing from source doesn't include an init file to control when Nginx starts and stops during boot and shutdown. You can either extract that file from the *[nginx-common](http://packages.ubuntu.com/trusty/nginx-common)* package at packages.ubuntu.com, or create an SysV script to manage NGINX as shown below:

    {{< file "/etc/init.d/nginx" >}}
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

{{< /file >}}


9.  Make the file executable and add it to the default run levels:

        sudo chmod +x /etc/init.d/nginx
        sudo /usr/sbin/update-rc.d -f nginx defaults

10. Start Nginx:

        sudo service nginx start

## Testing Nginx

Regardless of installation source or method, Nginx can be tested by navigating to your Linode's IP address or FQDN in your browser. You should see the NGINX welcome banner shown below.

![Nginx welcome](/docs/assets/nginx-welcome.png)

Continue reading our introduction to [Basic NGINX Configuration](/docs/websites/nginx/basic-nginx-configuration) for more information about using and setting up a web server.
