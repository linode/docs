---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Installing and configuring the Django web application development framework for Apache on Debian 6.'
keywords: ["django", "python", "apache", "mod\\_wsgi"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/django-apache-mod-wsgi/debian-6-squeeze/','websites/apache/apache-and-modwsgi-on-debian-6-squeeze/']
modified: 2011-05-13
modified_by:
  name: Linode
published: 2011-02-17
title: 'Django, Apache and mod_wsgi on Debian 6 (Squeeze)'
---

Django is a web development framework for the Python programing language. It enables rapid development, while favoring pragmatic and clean design. Django was initially developed for use in a newspaper's website division, and as a result the Django framework is very well suited to developing content-centric applications.

This guide provides an introduction to getting started with the Django framework, using the `mod_wsgi` method of deploying python applications. Please complete the [getting started guide](/docs/getting-started/) prior to beginning this guide on an up to date system. Furthermore, you will want a running [Apache web server](/docs/web-servers/apache/installation/debian-6-squeeze) and a functional [MySQL database](/docs/databases/mysql/debian-6-squeeze)

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Install Dependencies

Issue the following commands to ensure that your system's package repositories and installed programs are up to date and all required software is installed:

    apt-get update
    apt-get upgrade
    apt-get install python-setuptools libapache2-mod-wsgi

Additionally you will need to install a database system and a python driver for this database system. If you want to run the [MySQL database engine](/docs/databases/mysql/debian-6-squeeze) issue the following command:

    apt-get install mysql-server python-mysqldb

If you want to run the [PostgreSQL database server](/docs/databases/postgresql/debian-6-squeeze) issue the following command:

    apt-get install postgresql python-psycopg2

If you want to use the SQLite embedded database, issue the following command:

    apt-get install sqlite3 python-sqlite

Your application may require additional dependencies. You may install these either using the Debian package tools or by using the `easy_install` command included in `python-setuptools`.

# Install Django

There are two methods for installing Django. You may either choose to install the Django packages from the Debian repositories, or you can install using the python `easy_install` method. The version of Django in the package repositories is more stable and benefits from testing and maintenance by Debian developers; however, using `easy_install` will always provide access to the latest features. To install Django from the Debian repositories issue the following command:

    apt-get install python-django

If you want to install Django using the `easy_install` tool, issue the following command:

    easy_install Django

At the time of writing, this will install version 1.2.5 of the Django framework. Consider the [package information for Django](http://pypi.python.org/pypi/Django) for more information.

# Configure Django Applications for WSGI

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

# Configure Apache

Consider the following example virtual host configuration:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost *:80>
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

When you have successfully configured your Apache virtual host, issue the following commands to disable the default virtual host and restart the web server:

    a2dissite default

> /etc/init.d/apache2 restart

You will need to restart the web server every time the `django.wsgi` file changes. However, all other modifications to your application do not require a web server restart. Congratulations! You have now successfully deployed a Django application using `mod_wsgi`.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The Django Project Home Page](http://www.djangoproject.com/)
- [The Django Project Introductory Tutorial](http://docs.djangoproject.com/en/dev/intro/tutorial01/#intro-tutorial01)
- [The Django Book](http://www.djangobook.com/)
- [Deploying Django Applications](http://www.djangobook.com/en/2.0/chapter12/)
- [A Basic "Hello World" Django Application](http://runnable.com/UWRVp6lLuONCAABD/hello-world-in-django-for-python)
- [Integrating Django and mod\_wsgi](http://code.google.com/p/modwsgi/wiki/IntegrationWithDjango)



