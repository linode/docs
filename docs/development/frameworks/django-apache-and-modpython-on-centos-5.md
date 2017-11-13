---
author:
  name: Linode
  email: docs@linode.com
description: 'Installing and configuring the Django web application development framework for Apache on Centos 5.'
keywords: ["django", "python", "apache", "mod\\_python", "centos"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/django-apache-mod-python/centos-5/','websites/frameworks/django-apache-and-modpython-on-centos-5/']
modified: 2013-09-27
modified_by:
  name: Linode
published: 2010-02-03
title: 'Django, Apache and mod_python on CentOS 5'
deprecated: true
---

Django is a web development framework for the Python programing language. It enables rapid development, while favoring pragmatic and clean design. Django was initially developed for use in a newspaper's website division, and as a result the Django framework is very well suited to developing content-centric applications. It's also very flexible in its ability to facilitate many complex content management operations.

This guide provides an introduction to getting started with the Django framework on CentOS 5. We will be installing Django and related packages provided by the EPEL effort. The Django application itself will be deployed using mod\_python and the Apache web server. EPEL, or Extra Packages for Enterprise Linux, is a project of the Fedora community that provides more current software for CentOS and other systems derived from Red Hat Enterprise Linux.

The EPEL effort is similar to the "backporting" efforts that exist in other distributions. Furthermore with EPEL we can cleanly install and manage an up to date version of the Django framework without needing to install software directly from the upstream project.

There are many different ways to deploy Django applications that all have distinct advantages and disadvantages depending on the nature of your deployment. Our setup is designed to be fully functional and simple to set up for people who are new to systems administration. Nevertheless, Django is very flexible with regards to how applications are deployed; you can feel totally free to alter your approach as your needs and abilities change and grow.

As a prerequisite for this guide, we assume that you've completed the [getting started guide](/docs/getting-started/) and have a running and up to date CentOS 5 system. Furthermore, you will want to have a running [Apache web server](/docs/web-servers/apache/installation/centos-5) and a functional [MySQL database](/docs/databases/mysql/centos-5). With these prerequisites out of the way, we can begin installing tools for running Django applications on our server.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Installing Django

Before we begin to install packages we need to first install the EPEL repositories:

    rpm -Uvh http://download.fedora.redhat.com/pub/epel/5/i386/epel-release-5-4.noarch.rpm

When you install your first package from EPEL, `yum` will ask you to import the PGP key for the EPEL repository. You should accept this request.

Now we can install Django using the `yum` [package management](/docs/using-linux/package-management) interface. The following command will also install required dependencies on your system:

    yum update
    yum install mod_python Django

This installs `mod_python`, which embeds a Python interpreter in the Apache HTTP Server.

# Installing Database Support

If you would like to use a relational [database server](/docs/databases/) with Django, you will need to install and configure that independently of this guide. Consider one of our [database installation and configuration guides](/docs/databases/).

Whichever database system you use, you'll need to install the appropriate bindings for Python to allow Django applications to communicate with the database. The easiest database to install and use is SQLite. SQLite is easy to set up and provides a fully transactional database system inside of a single file. Such a system is likely sufficient for development purposes and deployments that won't need to scale beyond a single server. You can install SQLite support by issuing the following command:

    yum install python-sqlite2

If you want to use the [PostgreSQL](/docs/databases/postgresql/) database system you will need to install the Psycop2 database adapter with the following command:

    yum install python-psycopg2

To use the [MySQL](/docs/databases/mysql/) engine, download and install a more recent version of the `MySQL-python` package. Django requires at least version 1.2.1p2 of the Python MySQLdb adapter. We'll download and install a later version from [the upstream project](http://sourceforge.net/projects/mysql-python/) First, install the tools needed to build this package:

    yum install python-devel mysql-devel gcc wget python-setuptools

Check the [Python MySQLdb page](http://sourceforge.net/projects/mysql-python/files) for information regarding the latest release. Then issue the following commands. This will download the archive of the source files, extract them from the archive, build the database adapter, and install the files on to your system.

    cd /opt/
    wget http://downloads.sourceforge.net/project/mysql-python/mysql-python/1.2.3/MySQL-python-1.2.3.tar.gz
    tar -zxvf MySQL-python-1.2.3.tar.gz
    cd MySQL-python-1.2.3/
    python setup.py build
    python setup.py install

You may choose to install additional Python-related tools for your specific application. You can search the repositories using the `yum search [package-name]` command. To discover more information about a package, issue the `yum info [package-name]` command. Finally, to install a package use `yum install [package-name]`.

# Configuring Apache

With all of the dependencies installed, we must configure Apache for virtual hosting. If you're new to administering and configuring Apache web servers, please consider our documentation on [configuring and using the Apache HTTP server](/docs/web-servers/apache/). If you did not previously have Apache installed, it would have been installed when you installed the `mod_python` package. In these cases, [configure Apache for virtual hosting](/docs/web-servers/apache/apache-2-web-server-on-centos-5#configure-apache) before configuring Apache for Django.

You will want to insert a `Location` block inside the virtual hosting block for the domain where you want the Django application to run. The location block looks like this:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<Location "/">
    SetHandler python-program
    PythonHandler django.core.handlers.modpython
    SetEnv DJANGO_SETTINGS_MODULE mysite.settings
    PythonDebug Off
</Location>

{{< /file-excerpt >}}


You will need to change the `mysite.settings` to correspond to the settings file for your Django application in the Python path. The pPython path is specific to the instance and version of Python that you're using and can be modified in your Python settings. If you want to store your Django application in another location, you'll need to specify a `PythonPath` variable in the `Location` block above by adding the following line:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
PythonPath "['/srv/www/brackley.net/application'] + sys.path"

{{< /file-excerpt >}}


This line will allow `mod_python` to look for your settings file in the `/srv/www/brackley.net/application` directory for an application in the "brackley.net" virtual host entry.

The `Location` block tells Apache what to do when a request comes in for a given URL location. For instance, if the above block is located in the `VirtualHost` entry for the `example.com` domain, then all requests for the URL `http://example.com/` would be directed to the Django application. Consider the following complete virtual host configuration:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost example.com:80>
    ServerName example.com
    ServerAdmin username@example.com
    DocumentRoot /srv/www/example.com/public_html

    PythonPath "['/srv/www/example.com/application'] + sys.path"
    <Location "/">
        SetHandler python-program
        PythonHandler django.core.handlers.modpython
        SetEnv DJANGO_SETTINGS_MODULE settings
        PythonDebug Off
    </Location>

    ErrorLog /srv/www/example.com/logs/error.log
    CustomLog /srv/www/example.com/logs/access.log combined
</VirtualHost>

{{< /file-excerpt >}}


Given this configuration the `DocumentRoot` is optional, but we recommend that you keep this directive in your configuration.

# Hosting Static Content

If you wanted to have a static page located at the root of the domain and only use Django to power a blog located at the URL `http://example.com/blog/`, the above block would begin with `<Location "/blog">`. In this situation, you would need to set up a `DocumentRoot` to contain the files for the static portion of the site.

Typically, Django applications use a secondary "media" web server to more efficiently serve static content like images, video, audio, and even static text resources. This permits more effective scaling possibilities. If you need to turn off Django and `mod_python` for a particular URL, add a second location block like so:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<Location "/files/">
    SetHandler None
</Location>

{{< /file-excerpt >}}


In the above example, this would allow any static content requested with the URL `http://example.com/files/` to be served without Django interference. An alternate, and potentially easier solution, would use a second `VirtualHost` for all non-Python content.

# Hosting Multiple Django Applications

The easiest way to host multiple Django applications with one instance of Apache is to place each application in its own virtual host. However, if you need to host more than one application within a single `VirtualHost` entry, you'll need to specify different locations in `Location` blocks *within* that `VirtualHost` entry. Here are two example location blocks that would be inserted in your `VirtualHost` entry:

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


Note that the `PythonInterpreter` option needs to be set in these situations to avoid confusing `mod_python`, and your applications must be configured to properly handle these requests.

# Using Django

Once you have the base system installed and mod\_python has been configured properly with Django, the majority of your time can be spent developing your application. There are, however, a few things of which you should be aware.

Because of the way that `mod_python` works, it's necessary to restart the web server whenever you update, change, or modify your Django application. This is because of the way that `mod_python` caches code. To restart Apache, issue the following command:

    /etc/init.d/httpd restart

Issue the following command to ensure that the web server will start following the next system reboot cycle:

    chkconfig httpd on

As the site and your Django application begin receiving additional traffic, there are a number of steps you can take to scale your infrastructure to increase performance. Some of these approaches are fairly simple and straightforward, while others may take much longer.

The first step is to separate services onto different servers. If you're having performance issues, move the database (e.g. MySQL or PostgreSQL) onto its own server or even a cluster of database servers. We alluded to this earlier with regard to static files, but it's often easier and more efficient to use a separate high-performance web server like nginx or lighttpd for static content. Such a web server can also run on a separate Linode, isolated from the Apache instance running the Django application. Advanced solutions including front end reverse proxies like Squid, hosting duplicate copies of your application servers, and using a round-robin DNS setup can offer you a great deal of scalability for high-demand situations.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The Django Project Home Page](http://www.djangoproject.com/)
- [The Django Project Introductory Tutorial](http://docs.djangoproject.com/en/dev/intro/tutorial01/#intro-tutorial01)
- [The Django Book](http://www.djangobook.com/)
- [Deploying Django Applications](http://www.djangobook.com/en/2.0/chapter12/)
- [A Basic "Hello World" Django Application](http://runnable.com/UWRVp6lLuONCAABD/hello-world-in-django-for-python)



