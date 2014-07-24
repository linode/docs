---
deprecated: true
author:
  name: Linode
  email: skleinman@linode.com
description: 'Mango publishes markdown documents from plain text files in a dynamic website.'
keywords: 'markdown,content management systems,cms,plain text'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/cms-guides/mango/debian-5-lenny/']
modified: Monday, October 8th, 2012
modified_by:
  name: Linode
published: 'Tuesday, February 15th, 2011'
title: 'Manage Content with Markdown and Mango on Debian 5 (Lenny)'
---



Mango is a simple static content management system for publishing blogs from content stored in plain text files. Built as a dynamic web application using components from the Django framework, Mango is simple to deploy and administer and uses the Markdown lightweight markup language to process text. This guide describes the process for configuring a Mango-based site using the Apache HTTP Server and `mod_wsgi` to handle the dynamic aspects of the website.

Set the Hostname
----------------

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#sph_set-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

Prepare System
--------------

Issue the following commands to update your system's package database, ensure that all installed applications are up to date, and install all dependencies required for running Mango:

    apt-get update
    apt-get upgrade
    apt-get install apache2 python-setuptools libapache2-mod-wsgi build-essential mercurial python-dev libxml2-dev libxslt-dev zlib1g-dev
    easy_install pip

This guide describes the process for installing the Mango CMS on the root level of the `ducklington.org`, with the `DocumentRoot` of `/srv/www/ducklington.org/public_html`. Throughout this guide, replace these paths and domains in examples with the actual paths of your site.

Install Mango
-------------

Issue the following command to create the required directories for the Mango `VirtualHost`:

    mkdir -p /srv/www/ducklington.org/public_html
    mkdir -p /srv/www/ducklington.org/logs

Issue the following commands to install Django, create a Django project in the `application` directory, download the Mango application, install required Python modules, and prepare files and file permissions for Mango:

    cd /srv/www/ducklington.org/
    pip install Django
    django-admin.py startproject application
    cd /srv/www/ducklington.org/application
    hg clone http://bitbucket.org/davidchambers/mango
    pip install -r /srv/www/ducklington.org/application/mango/requirements.txt
    mkdir /srv/www/ducklington.org/application/content
    touch /srv/www/ducklington.org/application/mango/mango.log
    chown www-data:www-data /srv/www/ducklington.org/application/mango/mango.log

Edit the `INSTALLED_APPS` list at the end of the `/srv/www/ducklington.org/application/settings.py` file to resemble the following:

{: .file-excerpt }
/srv/www/ducklington.org/application/settings.py
:   ~~~ python
    INSTALLED_APPS = (
        'mango',
    )
    ~~~

Edit the `ROOT_URLCONF` variable in the `/srv/www/ducklington.org/application/settings.py` file to resemble the following:

{: .file-excerpt }
/srv/www/ducklington.org/application/settings.py
:   ~~~ python
    ROOT_URLCONF = 'mango.urls'
    ~~~

Edit the `urlpatterns` array in the `/srv/www/ducklington.org/application/urls.py` file to resemble the following:

{: .file-excerpt }
/srv/www/ducklington.org/application/urls.py
:   ~~~ python
    urlpatterns = patterns('',
        (r'', include('mango.urls')),
    )
    ~~~

Create a `application.wsgi` file, using the following as a model:

{: .file }
/srv/www/ducklington.org/application/application.wsgi
:   ~~~ python
    import os
    import sys

    path = '/srv/www/ducklington.org'
    if path not in sys.path:
        sys.path.append(path)
        sys.path.append(path + '/application')
        sys.path.append(path + '/application/mango')

    sys.path.append('/srv/www/ducklington.org/application')

    os.environ['PYTHON_EGG_CACHE'] = '/srv/www/ducklington.org/.python-egg'

    os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

    import django.core.handlers.wsgi
    application = django.core.handlers.wsgi.WSGIHandler()
    ~~~

Configure Apache
----------------

Create a `VirtualHost` specification based on the following example:

{: .file-excerpt }
/etc/apache2/sites-available/ducklington.org
:   ~~~ apache
    <VirtualHost *:80>
       ServerName ducklington.org
       ServerAlias www.ducklington.org
       ServerAdmin squire@ducklington.org

       DocumentRoot /srv/www/ducklington.org/public_html

       ErrorLog /srv/www/ducklington.org/logs/error.log 
       CustomLog /srv/www/ducklington.org/logs/access.log combined

       WSGIScriptAlias / /srv/www/ducklington.org/application/application.wsgi

       Alias /static /srv/www/ducklington.org/application/mango/static 
    </VirtualHost>
    ~~~

Issue the following command to enable the "`VirtualHost` and restart the web server to load the configuration:

    a2ensite ducklington.org
    /etc/init.d/apache2 restart

You will need to restart the server anytime you make changes to the Apache configuration or `application.wsgi` files.

Configure the Mango Site
------------------------

The behavior of the Mango application is controlled the settings in the `/srv/www/ducklington.org/application/mango/settings/default.py` file which you can override in a `/srv/www/ducklington.org/application/mango/settings/custom.py` file. Add configuration values to `custom.py` as needed to produce your site. The most relevant settings are below:

{: .file-excerpt }
/srv/www/ducklington.org/application/mango/settings/custom.py
:   ~~~ python
    DOCUMENTS_PATH = 'content'

    SITE_TITLE = 'Ducklington Blog'
    ~~~

The paths specified in this file are relative to the top level of the Django application, for this document: `/srv/www/ducklington.org/application/`. In the above example, all documents processed by Mango are stored in the `/srv/www/ducklington.org/application/content/` directory. Explore each setting in this document while you configure your site.

Write Content with Mango
------------------------

All content with Mango exists in source as Markdown, a lightweight markup language that mirrors formatting conventions for plain text emails. Markdown is designed to be easy to read and write, and can be translated efficiently into high quality HTML. Consider the following example entry:

{: .file-excerpt }
/srv/www/ducklington.org/application/content/first-post.text

> date: 02 February 2011 time: 08:06am tags: blog, meta, example
>
> #### First Post
>
> Welcome to Mango. If this page appears in full HTML glory (with **bold** and \_emphasized\_ text) then everything's probably working correctly. **Congratulations!**
>
> \#\# More Details
>
> Learn more about [mango](<http://mango.io>) and [Markdown][]!
>
> [Markdown]:<http://daringfireball.net/projects/markdown/>

The first three lines of this file define header values that are processed by the Markdown implementation and used to control how Mango displays and organizes the posts. The format of the date and time fields is very strict, adhere to the format above. You may now visit your site at `http://ducklington.org/`. To add new posts to your site, simply save files using the above format in the `content/` directory.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Mango Home Page](http://mango.io/)
- [Mango Documentation](http://mango.io/docs/)



