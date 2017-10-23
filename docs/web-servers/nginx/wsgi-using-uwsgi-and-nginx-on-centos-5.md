---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Use uWSGI to deploy Python application servers in conjunction with nginx.'
keywords: 'uwsgi,wsgi,nginx,python'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['web-servers/nginx/python-uwsgi/centos-5/','websites/nginx/wsgi-using-uwsgi-and-nginx-on-centos-5/']
modified: Monday, May 9th, 2011
modified_by:
  name: Linode
published: 'Wednesday, November 10th, 2010'
title: WSGI using uWSGI and nginx on CentOS 5
---

The uWSGI server provides a non-FastCGI method for deploying Python applications with the nginx web server. In coordination with nginx, uWSGI offers great stability, flexibility, and performance. However, to deploy applications with uWSGI and nginx, you must compile nginx manually with the included uwsgi module.

Set the Hostname
----------------

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

Install uWSGI
-------------

Begin by issuing the following commands to update your system and install dependencies for uWSGI:

    yum update
    yum install python python-devel libxml2 libxml2-devel python-setuptools zlib-devel wget openssl-devel pcre pcre-devel sudo gcc make autoconf automake

Issue the following sequence of commands to download and compile uWSGI:

    cd /opt/
    wget http://projects.unbit.it/downloads/uwsgi-0.9.6.5.tar.gz
    tar -zxvf uwsgi-0.9.6.5.tar.gz
    mv uwsgi-0.9.6.5/ uwsgi/
    cd uwsgi/
    python2.4 setup.py build
    make

Issue the following command to create a dedicated system user to run the uwsgi processes:

    useradd -M -r --shell /bin/sh --home-dir /opt/uwsgi uwsgi

Send the following sequence of commands to set the required file permissions:

    chown -R uwsgi:uwsgi /opt/uwsgi
    touch /var/log/uwsgi.log
    chown uwsgi /var/log/uwsgi.log

Configure uWSGI
---------------

Issue the following command to download an init script to manage the uWSGI process, located at `/etc/init.d/uwsgi`:

    cd /opt/
    wget -O init-rpm.sh http://www.linode.com/docs/assets/701-init-rpm.sh
    mv /opt/init-rpm.sh /etc/init.d/uwsgi
    chmod +x /etc/init.d/uwsgi

Create an `/etc/default/uwsgi` file to specify specific settings for your Python application. The `MODULE` specifies the name of the Python module that contains your `wsgi` specification. Consider the following example:

{: .file-excerpt }
/etc/default/uwsgi
:   ~~~ bash
    PYTHONPATH=/srv/www/example.com/application
    MODULE=wsgi_configuration_module
    ~~~

If you want to deploy a "Hello World" application, insert the following code into the `/srv/www/example.com/application/wsgi_configuration_module.py` file:

{: .file }
/srv/www/example.com/application/wsgi\_configuration\_module.py
:   ~~~ python
    import os
    import sys

    sys.path.append('/srv/www/example.com/application')

    os.environ['PYTHON_EGG_CACHE'] = '/srv/www/example.com/.python-egg'

    def application(environ, start_response):
        status = '200 OK'
        output = 'Hello World!'

        response_headers = [('Content-type', 'text/plain'),
                            ('Content-Length', str(len(output)))]
        start_response(status, response_headers)

        return [output]
    ~~~

Issue the following commands to make this init script executable, ensure that uWSGI is restarted following the next reboot sequence, and start the service:

    chkconfig --add uwsgi
    chkconfig uwsgi on
    /etc/init.d/uwsgi start

Install nginx
-------------

Issue the following commands to install and configure the nginx web server from the [EPEL Repository](https://fedoraproject.org/wiki/EPEL):

    su -c 'rpm -Uvh http://download.fedora.redhat.com/pub/epel/5/i386/epel-release-5-4.noarch.rpm'
    yum update
    yum install nginx
    chkconfig nginx on
    /etc/init.d/nginx start

During this process you will be asked to confirm importing the EPEL GPG key. Confirm this option to successfully complete the installation process.

Configure nginx Server
----------------------

Create an nginx server configuration that resembles the following for the site where the uWSGI app will be accessible:

{: .file-excerpt }
nginx virtual host configuration
:   ~~~ nginx
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
    ~~~

All requests to URLs ending in `/static` will be served directly from the `/srv/www/example.com/public_html/static` directory. Restart the web server by issuing the following command:

    /etc/init.d/nginx restart

Additional Application Servers
------------------------------

If the Python application you've deployed requires more application resources than a single Linode instance can provide, all of the methods for deploying a uWSGI application server are easily scaled to rely on multiple uSWGI instances that run on additional Linodes with the request load balanced using nginx's `upstream` capability. See our documentation of [proxy and software load balancing with nginx](/docs/uptime/loadbalancing/how-to-use-nginx-as-a-front-end-proxy-server-and-software-load-balancer) for more information. For a basic example configuration, see the following example:

{: .file-excerpt }
nginx configuration
:   ~~~ nginx
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
    ~~~

In this example, we create the `uwsgicluster` upstream, which has five components. One runs on the local interface, and four run on the local network interface of distinct Linodes (the `192.168.` addresses or the private "back end" network). The application servers that run on those dedicated application servers are identical to the application servers described above. However, the application server process must be configured to bind to the appropriate network interface to be capable of responding to requests.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Installing Nginx on CentOS 5](/docs/web-servers/nginx/installation/centos-5)
- [Deploy a LEMP Server on CentOS 5](/docs/lemp-guides/centos-5/)
- [Configure nginx Proxy Servers](/docs/uptime/loadbalancing/how-to-use-nginx-as-a-front-end-proxy-server-and-software-load-balancer)
