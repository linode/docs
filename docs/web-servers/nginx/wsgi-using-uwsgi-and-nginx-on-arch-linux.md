---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Use uWSGI to deploy Python application servers in conjunction with nginx.'
keywords: ["uwsgi", "wsgi", "nginx", "python", "arch linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/python-uwsgi/arch-linux/','websites/nginx/wsgi-using-uwsgi-and-nginx-on-arch-linux/']
modified: 2013-10-07
modified_by:
  name: Linode
published: 2010-12-28
title: WSGI using uWSGI and nginx on Arch Linux
---



The uWSGI server provides a non-FastCGI method for deploying Python applications with the nginx web server. In coordination with nginx, uWSGI offers great stability, flexibility, and performance. However, to deploy applications with uWSGI and nginx, you must compile nginx manually with the included uwsgi module.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Install uWSGI

Begin by issuing the following command to update your system's package repositories and install nginx:

    pacman -Sy
    pacman -S pacman
    pacman -S nginx

Issue the following sequence of commands to download and compile all prerequisites and uWSGI:

    pacman -S base-devel openssl pcre zlib libxml2 python2
    cd /opt
    wget http://aur.archlinux.org/packages/uwsgi/uwsgi.tar.gz
    tar -zxvf uwsgi.tar.gz
    cd /opt/uwsgi
    makepkg --asroot
    pacman -U uwsgi*.pkg.*

Because you have built these packages from source, you will want to monitor their pages in the Arch User Repository (AUR) so that you'll be able to recompile the [uwsgi](http://aur.archlinux.org/packages.php?ID=41075) package when updates are available.

# Create uWSGI Init Script

Issue the following command to download an init script to manage the uWSGI process, located at `/etc/rc.d/uwsgi`:

    cd /opt/
    wget -O init-arch.sh http://www.linode.com/docs/assets/700-init-arch.sh
    mv /opt/init-arch.sh /etc/rc.d/uwsgi

Create an `/etc/conf.d/uwsgi` file to specify specific settings for your Python application. The `MODULE` specifies the name of the Python module that contains your `wsgi` specification. Consider the following example:

{{< file-excerpt "/etc/conf.d/uwsgi" bash >}}
PYTHONPATH=/srv/www/example.com/application
MODULE=wsgi_configuration_module

{{< /file-excerpt >}}


Issue the following sequence of commands to prepare the new init script and log files:

    chmod +x /etc/rc.d/uwsgi
    touch /var/log/uwsgi.log
    chown http /var/log/uwsgi.log

Start `uWSGI` for the first time by issuing the following command:

    /etc/rc.d/uwsgi start

You will want to add the `uwsgi` daemon to the `DAEMONS=()` array at the end of the `/etc/rc.conf` file to ensure that the uWSGI daemon starts following the next reboot cycle.

# Configure nginx Server

Create an nginx server configuration that resembles the following for the site where the uWSGI app will be accessible:

{{< file-excerpt "nginx virtual host configuration" nginx >}}
server {
    listen   80;
    server_name www.example.com example.com;
    access_log /srv/www/example.com/logs/access.log;
    error_log /srv/www/example.com/logs/error.log;

    location / {
        include        uwsgi_params;
        uwsgi_pass     127.0.0.1:9001;
    }

    location /static {
        root   /srv/www/example.com/public_html/static/;
        index  index.html index.htm;
    }
}

{{< /file-excerpt >}}


All requests to URLs ending in `/static` will be served directly from the `/srv/www/example.com/public_html/static` directory. Restart the web server by issuing the following command:

    /etc/rc.d/nginx restart

# Additional Application Servers

If the Python application you've deployed requires more application resources than a single Linode instance can provide, all of the methods for deploying a uWSGI application server are easily scaled to rely on multiple uSWGI instances that run on additional Linodes with the request load balanced using nginx's `upstream` capability. Consider our documentation of [proxy and software load balancing with nginx](/docs/uptime/loadbalancing/how-to-use-nginx-as-a-front-end-proxy-server-and-software-load-balancer) for more information. For a basic example configuration, consider the following example:

{{< file-excerpt "nginx configuration" nginx >}}
upstream uwsgicluster {
     server 127.0.0.1:9001;
     server 192.168.100.101:9001;
     server 192.168.100.102:9001;
     server 192.168.100.103:9001;
     server 192.168.100.104:9001;
}

server {
    listen   80;
    server_name www.example.com example.com;
    access_log /srv/www/example.com/logs/access.log;
    error_log /srv/www/example.com/logs/error.log;

    location / {
        include        uwsgi_params;
        uwsgi_pass     uwsgicluster;
    }

    location /static {
        root   /srv/www/example.com/public_html/static/;
        index  index.html index.htm;
    }
}

{{< /file-excerpt >}}


In this example we create the `uwsgicluster` upstream, which has five components. One runs locally on the local interface, and four run on the local network interface of distinct Linodes (e.g. the `192.168.` addresses or the private "back end" network). The application servers that run on those dedicated application servers are identical to the application servers described above. However, the application server process must be configured to bind to the appropriate network interface to be capable of responding to requests.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Deploy a LEMP Server on Arch Linux](/docs/lemp-guides/arch-linux/)
- [Configure nginx Proxy Servers](/docs/uptime/loadbalancing/how-to-use-nginx-as-a-front-end-proxy-server-and-software-load-balancer)
