---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Deploy Python WSGI Applications with Apache and mod_wsgi.'
keywords: ["python", "apache", "mod_wsgi", "django"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/mod-wsgi/ubuntu-12-04-precise-pangolin/','websites/apache/apache-and-modwsgi-on-ubuntu-12-04-precise-pangolin/']
modified: 2015-11-18
modified_by:
  name: Linode
published: 2012-10-18
title: 'Apache and mod_wsgi on Ubuntu 12.04 (Precise Pangolin)'
external_resources:
 - '[A Basic "Hello World" Django Application](http://runnable.com/UWRVp6lLuONCAABD/hello-world-in-django-for-python)'
 - '[Deploy Django Applications with mod\_wsgi](/docs/websites/apache/apache-and-modwsgi-on-ubuntu-12-04-precise-pangolin)'
 - '[Deploy Web.py Applications with mod\_wsgi](/docs/websites/frameworks/webpy-on-ubuntu-12-04-precise-pangolin/)'
 - '[Flask Framework](http://flask.pocoo.org/)'
 - '[Werkzug](http://werkzeug.pocoo.org/)'
 - '[Django](http://www.djangoproject.com/)'
 - '[Web.py](http://webpy.org/)'
---

The WSGI specification provides a standard and efficient method for dynamic web applications to communicate with web servers. `mod_wsgi` provides a method for simply deploying WSGI applications with Apache. WSGI is used to deploy applications written with frameworks and tools like Django, Web.py, Werkzug, Chery.py, TurboGears, and Flask. This guides outline this installation and configuration process for WSGI with Apache on Ubuntu 12.04.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

2.  We recommend that you are already familiar with [Apache](/docs/websites/apache/how-to-install-and-configure-apache-2-web-server-on-ubuntu-12-04-lts-precise-pangolin) before beginning this guide.

3.  Update your system:

        sudo apt-get update
        sudo apt-get upgrade

{{< note >}}
The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install Dependencies

Issue the following commands to ensure that your system's package repositories and installed programs are up to date and that all required software is installed:

    apt-get install apache2 python-setuptools libapache2-mod-wsgi

Your application may require additional dependencies. Install these either using the Ubuntu package tools or by using the `easy_install` command included in `python-setuptools` before proceeding.

## Configure WSGI Handler

In order for `mod_wsgi` to be able to provide access to your application, you will need to create a `application.wsgi` file inside of your application directory. The application directory should be located *outside* of your `DocumentRoot`. The following three sections each present a different `application.wsgi` example file to illustrate the basic structure of this file:

### Basic Hello World WSGI Configuration

In this example, the application is stored in `/var/www/example.com/application` directory. Modify this example and all following examples to conform to the actual files and locations used in your deployment.

{{< file "/var/www/example.com/application/application.wsgi" python >}}
import os
import sys

sys.path.append('/var/www/example.com/application')

os.environ['PYTHON_EGG_CACHE'] = '/var/www/example.com/.python-egg'

def application(environ, start_response):
    status = '200 OK'
    output = 'Hello World!'

    response_headers = [('Content-type', 'text/plain'),
                        ('Content-Length', str(len(output)))]
    start_response(status, response_headers)

    return [output]

{{< /file >}}


You must append the path of your application to the system path as above. The declaration of the `PYTHON_EGG_CACHE` variable is optional but may be required for some applications when WSGI scripts are executed with the permissions of the web server. The WSGI application must be callable as `application`, regardless of how the application code is structured.

### Web.py WSGI Configuration

In this example the Web.py *application* is embedded in a `application.wsgi` file. The [Web.py Framework](/docs/websites/frameworks/webpy-on-ubuntu-12-04-precise-pangolin/) must be installed in order for the following application to run successfully.

{{< file-excerpt "/var/www/example.com/application/application.wsgi" python >}}
import web

urls = (
    '/(.*)', 'hello'
)

class hello:
    def GET(self, name):
        if not name:
            name = 'World'
        return 'Hello, ' + name + '!'

if __name__ == "__main__":
    app.run()

app = web.application(urls, globals(), autoreload=False)
application = app.wsgifunc()

{{< /file-excerpt >}}


### Django WSGI Configuration

The following example `application.wsgi` file is configured for Django applications:

{{< file-excerpt "/var/www/example.com/application/application.wsgi" python >}}
import os
import sys

sys.path.append('/var/www/example.com/application')

os.environ['PYTHON_EGG_CACHE'] = '/var/www/example.com/.python-egg'

os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()

{{< /file-excerpt >}}


`Django` must be installed on your system along with a working Django application before this example will function. The `DJANGO_SETTINGS_MODULE` points to the "`settings.py` file for your application, which would be located at `/var/www/example.com/application/settings.py` in the case of this example.

## Configure Apache

Deploy the following `VirtualHost` configuration and modify the paths and domains to reflect the requirements of your application:

{{< file-excerpt "Apache `VirtualHost` Configuration" apache >}}
<VirtualHost *:80>
   ServerName example.com
   ServerAlias www.example.com
   ServerAdmin username@example.com

   DocumentRoot /var/www/example.com/public_html

   ErrorLog /var/www/example.com/logs/error.log
   CustomLog /var/www/example.com/logs/access.log combined

   WSGIScriptAlias / /var/www/example.com/application/application.wsgi

   Alias /robots.txt /var/www/example.com/public_html/robots.txt
   Alias /favicon.ico /var/www/example.com/public_html/favicon.ico
   Alias /images /var/www/example.com/public_html/images
   Alias /static /var/www/example.com/public_html/static
</VirtualHost>

{{< /file-excerpt >}}


In this example, the `WSGIScriptAlias` directive tells Apache that for this `VirtualHost`, all requests below `/` should be handled by the WSGI script specified. The series of four `Alias` directives allow Apache to serve the `robots.txt` and `favicon.ico` files as well as all resources beneath the `/images` and `/static` locations, directly from the `DocumentRoot` without engaging the WSGI application. You can add as many `Alias` directives as you require.

When you have configured your Apache `VirtualHost`, issue the following command to restart the web server:

    service apache2 restart

You will need to restart the web server every time the `application.wsgi` file changes. However, all other modifications to your application do not require a web server restart. Congratulations! You have now successfully deployed a WSGI application using `mod_wsgi`.
