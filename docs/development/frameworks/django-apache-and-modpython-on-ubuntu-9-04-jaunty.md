---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Installing and configuring the Django web application development framework for Apache on Ubuntu 9.04 (Jaunty).'
keywords: ["django", "python", "apache", "mod\\_python", "ubuntu", "ubuntu 9.04", "jaunty"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/django-apache-mod-python/ubuntu-9-04-jaunty/','websites/frameworks/django-apache-and-modpython-on-ubuntu-9-04-jaunty/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2009-08-31
expiryDate: 2011-05-17
title: 'Django, Apache and mod_python on Ubuntu 9.04 (Jaunty)'
---



Django is a web development framework for the Python programing language. It enables rapid development, while favoring pragmatic and clean design. Django was initially developed for use in a newspaper's website division, and as a result the Django framework is very well suited to developing content-centric applications. It's also very flexible in its ability to facilitate many complex content management operations.

This guide provides an introduction to getting started with the Django Framework. We will be installing Django and related packages from the Ubuntu repository, and deploying applications with mod\_python and the Apache web server. This setup is generally accepted as a good platform for getting started with Django, although the framework is quite flexible with regards to how applications can be deployed. There are many base platforms that you may consider in the future as your needs grow and change.

We assume that you've completed the [getting started guide](/docs/getting-started/) and have a running and up to date Ubuntu 9.04 (Jaunty) system. Furthermore, you will want to have a running [Apache web server](/docs/web-servers/apache/installation/ubuntu-9-04-jaunty) and a functional [MySQL database](/docs/databases/mysql/ubuntu-9-04-jaunty) installed.

# Enabling the "Universe" Repository

The package that contains the Django application is contained in the "universe" repository for Ubuntu Jaunty. To make this repository accessible to your system, add or uncomment the following lines to your `/etc/apt/sources.list` file:

{{< file-excerpt "/etc/apt/sources.list" >}}
deb http://us.archive.ubuntu.com/ubuntu/ jaunty universe
deb-src http://us.archive.ubuntu.com/ubuntu/ jaunty universe

{{< /file-excerpt >}}


Then, to refresh your system issue the following command:

    apt-get update
    apt-get upgrade

With these prerequisites out of the way, we can begin installing tools for running Django applications on our server.

# Installing Python Dependencies

There are a number of packages that we need to install before we can deploy a Django application. The following command will download and install all of these dependencies:

    apt-get install libapache2-mod-python python-mysqldb python-django

This installs mod\_python, which embeds a Python interpreter in the Apache web server (`libapache2-mod-python`), MySQL database bindings for Python, and version 1.02 of the Django web framework.

You may also want to install the following libraries and tools with apt:

-   `python-setuptools` - [Setup Tools](http://pypi.python.org/pypi/setuptools) provides a method for installing and managing Python packages/modules ("eggs"). This is helpful if you need to use a Python module that isn't available through `apt`.
-   `python-psycopg2` - Provides an interface for using PostgreSQL in Python, if you prefer PostgreSQL to MySQL. You will also need to install the `postgresql` server. If you are running PostgreSQL you may not need to install or use MySQL and `python-mysqldb`.
-   `python-sqlite` - Enables Python to access SQLite databases. These create a full-featured database inside a file. While this is often not suitable for high traffic production environments, it is often quite useful for testing and smaller deployments.
-   `python-cjson` and `python-yaml` - These packages provide very efficient Python interfaces for dealing with [JSON](http://www.json.org/) and [YAML](http://www.yaml.org/) data.

Any of these tools can be installed with `apt-get install` followed by the package or packages listed above. There are many additional Python-related packages in the operating system repositories. You can search the package database using the `apt-cache search python` command. If you need more information about a package, use the `apt-cache show [package-name]` command.

# Configuring Apache

With all of the dependencies installed, we must configure Apache for virtual hosting. You will want to insert a `<Location >` block inside of the virtual hosting block for the domain where you want the Django application to run. The location block looks like this:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<Location "/">
    SetHandler python-program
    PythonHandler django.core.handlers.modpython
    SetEnv DJANGO_SETTINGS_MODULE mysite.settings
    PythonDebug Off
</Location>

{{< /file-excerpt >}}


You will need to change the `mysite.settings` to correspond to the settings file for your application in the Python path. The Python path is specific to the instance and version of Python that you're using and can be modified in your Python settings. If you want to store your Django application in another location, we'll need to specify a `PythonPath` variable in the `<Location >` block above by adding the following line:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
PythonPath "['/srv/www/brackley.net/application'] + sys.path"

{{< /file-excerpt >}}


This line will allow mod\_python to look for your settings file in the `/srv/www/brackley.net/application` directory, for an application in the "brackley.net" virtual host entry.

The `Location` block tells Apache what to do when a request comes in for a given URL location. For instance, if the above block is located in the `VirtualHost` entry for the `example.com` domain, then all requests for the URL `http://example.com/` would be directed to the Django application. Consider the following complete virtual host configuration.

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost 12.34.56.78:80>
    ServerName example.com
    ServerAdmin webmaster@example.com
    DocumentRoot /srv/www/example.com/public_html

    PythonPath "['/srv/www/example.com/application'] + sys.path"
    <Location "/">
        SetHandler python-program
        PythonHandler django.core.handlers.modpython
        SetEnv DJANGO_SETTINGS_MODULE settings
        PythonDebug Off
    </Location>

    ErrorLog /srv/logs/error.log
    CustomLog /srv/logs/access.log combined
</VirtualHost>

{{< /file-excerpt >}}


Given this configuration the `DocumentRoot` is optional, but we recommend that you keep this directive in your configuration.

# Hosting Static Content

If you wanted to have a static page located at the root of the domain and only use Django to power a blog at the URL `http://example.com/blog/`, the above block would begin with `<Location "/blog">`. In this situation, you would need to set up a DocumentRoot to contain the files for the static portion of the site.

Typically, Django applications use a secondary "media" web server to more efficiently serve static content like images, video, audio, and even static text resources. This permits more effective scaling possibilities. If you need to turn off Django and mod\_python for a particular URL, add a second location block, like so:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<Location "/files/">
    SetHandler None
</Location>

{{< /file-excerpt >}}


In the above example, this would allow any static content requested with the URL `http://example.com/files/` to be served without Django interference. An alternate, and potentially easier solution, would use a second VirtualHost for all non-Python content.

# Hosting Multiple Django Applications

The easiest way to host multiple Django applications with one instance of Apache is to place each application in its own virtual host. If, however, you need to host more than one application within a single VirtualHost entry you'll need specify different locations in `<Location >` blocks *within* that VirtualHost entry. Here are two example location blocks that would be inserted in your VirtualHost entry:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<Location "/lollipop">
    SetHandler python-program
    PythonHandler django.core.handlers.modpython
    SetEnv DJANGO_SETTINGS_MODULE lollipop.site.settings
    PythonDebug Off
    PythonInterpreter lollipop
</Location>

<Location "/funnyjoke">
    SetHandler python-program
    PythonHandler django.core.handlers.modpython
    SetEnv DJANGO_SETTINGS_MODULE funnyjoke.site.settings
    PythonDebug Off
    PythonInterpreter funnyjoke
</Location>

{{< /file-excerpt >}}


We'll note that the `PythonInterpreter` option needs to be set in these situations to avoid confusing mod\_python.

# Using Django

Once you have the base system installed and mod\_python configured properly with Django, the majority of your time can be spent developing your application. There are, however, a few concerns of which you should be aware.

Because of the way that mod\_python works, it's necessary to restart the web server whenever you update, change, or modify your Django application. This is because of the way that mod\_python caches code. To restart Apache, issue the following command:

    /etc/init.d/apache2 restart

As the site and your Django application begins receiving additional traffic, there are a number of steps you can take to scale your infrastructure with Django to increase performance. Some of these approaches are fairly simple and straightforward, while others may take much longer.

The first step is to separate services onto different servers. If you're having performance issues, move the database (e.g. MySQL or PostgreSQL) onto its own server or even a cluster of database servers. We alluded to this earlier with regard to static files, but it's often easier and more efficient to use a separate high-performance web server like nginx or lighttpd for static content. Such a server may also run on a separate Linode, isolated from the Apache instance running the Django application. Advanced solutions including front end reverse proxies like Squid, or hosting duplicate copies of your application servers and using a round-robin DNS setup, can offer you a great deal of scalability for high-demand situations.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The Django Project Home Page](http://www.djangoproject.com/)
- [The Django Project Introductory Tutorial](http://docs.djangoproject.com/en/dev/intro/tutorial01/#intro-tutorial01)
- [The Django Book](http://www.djangobook.com/)
- [Deploying Django Applications](http://www.djangobook.com/en/2.0/chapter12/)
- [A Basic "Hello World" Django Application](http://runnable.com/UWRVp6lLuONCAABD/hello-world-in-django-for-python)



