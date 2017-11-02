---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Installing and configuring the Django web application development framework for Apache on CentOS 5.'
keywords: ["django", "python", "apache", "mod\\_wsgi"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/django-apache-mod-wsgi/centos-5/','websites/frameworks/django-apache-and-modwsgi-on-centos-5/']
modified: 2011-08-22
modified_by:
  name: Linode
published: 2010-05-18
title: 'Django, Apache and mod_wsgi on CentOS 5'
external_resources:
 - '[The Django Project Home Page](http://www.djangoproject.com/)'
 - '[The Django Project Introductory Tutorial](http://docs.djangoproject.com/en/dev/intro/tutorial01/#intro-tutorial01)'
 - '[The Django Book](http://www.djangobook.com/)'
 - '[Deploying Django Applications](http://www.djangobook.com/en/2.0/chapter12/)'
 - '[A Basic "Hello World" Django Application](http://runnable.com/UWRVp6lLuONCAABD/hello-world-in-django-for-python)'
 - '[Integrating Django and mod\_wsgi](http://code.google.com/p/modwsgi/wiki/IntegrationWithDjango)'
---

Django is a web development framework for the Python programing language. It enables rapid development, while favoring pragmatic and clean design. Django was initially developed for use in a newspaper's website division, and as a result the Django framework is very well suited to developing content-centric applications.

This guide provides an introduction to getting started with the Django framework, using the `mod_wsgi` method of deploying python applications. Please complete the [getting started guide](/docs/getting-started/) prior to beginning this guide on an up to date system. Furthermore, you will want a running [Apache web server](/docs/web-servers/apache/installation/centos-5) and a functional [MySQL database](/docs/databases/mysql/centos-5) system installed.

## Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

## Install Dependencies

Before beginning to install software required for the deployment of Django applications, install the EPEL repositories which contain required packages that are not present in the main CentOS repositories:

    rpm -Uvh http://download.fedora.redhat.com/pub/epel/5/i386/epel-release-5-4.noarch.rpm

When you install your first package from EPEL, `yum` will ask you to import the PGP key for the EPEL repository. You should accept this request. Issue the following commands to ensure that your system's package repositories and installed programs are up to date and all required software is installed:

    yum update
    yum install python-setuptools httpd mod_wsgi

Additionally you will need to install a database system and a python driver for this database system. If you want to run the [PostgreSQL database server](/docs/databases/postgresql/centos-5) issue the following command:

    yum install postgresql python-psycopg2

If you want to use the SQLite embedded database, issue the following command:

    yum install sqlite python-sqlite

If you want to run the [MySQL database engine](/docs/databases/mysql/centos-5), download and install a more recent version of the `MySQL-python` package. Django requires at least version 1.2.1p2 of the Python MySQLdb adapter. We'll download and install a later version from [the upstream project](http://sourceforge.net/projects/mysql-python/) First, install the tools needed to build this package:

    yum install python-devel mysql-devel gcc wget python-setuptools

Check the [Python MySQLdb page](http://sourceforge.net/projects/mysql-python/files) for information regarding the latest release, then issue the following commands. This will download the archive of the source files, extract them from the archive, build the database adapter, and install the files on to your system.

    cd /opt/
    wget http://downloads.sourceforge.net/project/mysql-python/mysql-python/1.2.3/MySQL-python-1.2.3.tar.gz
    tar -zxvf MySQL-python-1.2.3.tar.gz
    cd MySQL-python-1.2.3/
    python setup.py build
    python setup.py install

Your application may require additional dependencies. You may install these either using the CentOS package tools or by using the `easy_install` command included in `python-setuptools`.

## Install Django

There are two methods for installing Django. You may either choose to install the Django packages from the EPEL repositories, or you can install using the python `easy_install` method. Installing the EPEL packages will install version 1.1.1 of the framework, but you will have the benefit of ongoing security and bug fixes from the Fedora Project if you install by way of the EPEL repositories. To install Django in this manner:

    yum install Django

If you want to install Django using the `easy_install` tool, issue the following command:

    easy_install Django

At the time of writing, this will install version 1.2.5 of the Django framework. Consider the [package information for Django](http://pypi.python.org/pypi/Django) for more information.

## Configure Django Applications for WSGI

In order for `mod_wsgi` to be able to provide access to your Django application, you will need to create a `django.wsgi` file inside of your application directory. For the purposes of this example, we assume that your application will be located *outside* of your `DocumentRoot` in the directory `/srv/www/example.com/application`. Modify this example and all following examples to conform to the actual files and locations used in your deployment.

{{< file "/srv/www/example.com/application/django.wsgi" python >}}
import os
import sys

sys.path.append('/srv/www/example.com/application')

os.environ['PYTHON_EGG_CACHE'] = '/srv/www/example.com/.python-egg'
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()

{{< /file >}}


You must append the path of your application to the system path as above. Additionally, declaration of the `PYTHON_EGG_CACHE` variable is optional but may be required for some applications when WSGI scripts are executed with the permissions of the web server. Finally, the `DJANGO_SETTINGS_MODULE` must refer to the Django `settings.py` file for your project. You will need to restart Apache after modifying the `django.wsgi` file.

## Configure Apache

Consider the following example virtual host configuration:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost example.com:80>
   ServerName example.com
   ServerAlias www.example.com
   ServerAdmin username@example.com

   DocumentRoot /srv/www/example.com/public_html

   WSGIScriptAlias / /srv/www/example.com/application/django.wsgi
   <Directory /srv/www/example.com/application>
      Order allow,deny
      Allow from all
   </Directory>

   Alias /robots.txt /srv/www/example.com/public_html/robots.txt
   Alias /favicon.ico /srv/www/example.com/public_html/favicon.ico
   Alias /images /srv/www/example.com/public_html/images
   Alias /static /srv/www/example.com/public_html/static

   ErrorLog /srv/www/example.com/logs/error.log
   CustomLog /srv/www/example.com/logs/access.log combined
</VirtualHost>

{{< /file-excerpt >}}


In this example, the `WSGIScriptAlias` directive tells Apache that for this virtual host, all requests below `/` should be handled by the WSGI script specified. In the directory block that follows, we allow Apache to serve these requests. Finally, the series of four `Alias` directives allow Apache to serve the `robots.txt` and `favicon.ico` files as well as all resources beneath the `/images` and `/static` locations, directly from the `DocumentRoot` without engaging the WSGI application. You can add as many Alias directives as you need to.

## Deploy Applications with Apache

Edit the `/etc/httpd/conf.d/wsgi.conf` file to enable the `mod_wsgi` by uncommenting or adding the following line:

{{< file-excerpt "/etc/httpd/conf.d/wsgi.conf" >}}
LoadModule wsgi_module modules/mod_wsgi.so

{{< /file-excerpt >}}


When you have successfully configured your Apache virtual host, and enabled the required module, issue the following command to restart the web server:

    /etc/init.d/httpd restart

Now issue the following command to ensure that Apache will start after a reboot cycle, if you have not already:

    chkconfig httpd on

You will need to restart the web server every time the `django.wsgi` file changes. However, all other modifications to your application do not require a web server restart. Congratulations! You have now successfully deployed a Django application using `mod_wsgi`.
