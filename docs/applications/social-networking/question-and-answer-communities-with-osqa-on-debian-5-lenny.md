---
author:
  name: Linode
  email: docs@linode.com
description: 'OSQA provides an advanced knowledge exchange system for vibrant communities.'
keywords: ["knowledge exchange", "question and answers", "q&a", "debian lenny"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/social-networking/osqa/']
modified: 2013-10-04
modified_by:
  name: Linode
published: 2010-05-10
title: 'Question and Answer Communities with OSQA on Debian 5 (Lenny)'
deprecated: true
---

OSQA, the Open Source Question and Answer platform, is a tool for structured community engagement centered around knowledge exchange. OSQA provides tools for groups of people to ask questions, get answers, and control the quality of the information exchanged within the system. OSQA models itself after the engine that powers sites like Stack Overflow and Server Fault. Thus, OSQA is not simply a tool for organizing user generated content, but also a tool for building vibrant and valuable forums that can serve as the informational backbone of entire communities.

Before beginning this guide, we assume that you have completed the [getting started guide](/docs/getting-started/). If you're new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics). Furthermore, this guide presumes that you have installed the [Apache HTTP server](/content/web-servers/apache/installation/debian-5-lenny) and the [MySQL database engine](/content/databases/mysql/debian-5-lenny). If you want your OSQA instance to be able to send email, install the [Exim send-only MTA](/content/email/exim/send-only-mta-debian-5-lenny).

# Install Prerequisites

Before beginning the installation of OSQA, issue the following commands to ensure that your system is up to date and that all required packages have been installed:

    apt-get update
    apt-get upgrade
    apt-get install python-setuptools build-essential libapache2-mod-wsgi subversion mysql-server libmysqlclient15-dev git-core wget libmysql++-dev checkinstall python-mysqldb

Issue the following sequence of commands to use the `easy_install` tool to install Python dependencies:

    easy_install Django==1.1
    easy_install mysql-python
    easy_install html5lib
    easy_install Markdown
    easy_install python-openid
    easy_install South
    easy_install django-debug-toolbar

Additionally, OSQA uses the Sphinx search engine tool, which is unfortunately not included in the Debian software repositories. At the time of this writing, the latest stable release of Sphinx is 0.9.9, but check the [Sphinx Search Upstream](http://sphinxsearch.com/downloads.html) to ensure that you're downloading the most up to date version of this software. Issue the following sequence of commands to download, compile, and create a Debian package for Sphinx, then install that package:

    cd /opt/
    wget http://www.sphinxsearch.com/downloads/sphinx-0.9.9.tar.gz
    tar -zxvf /opt/sphinx-0.9.9.tar.gz
    cd /opt/sphinx-0.9.9/
    ./configure
    make
    checkinstall

The `checkinstall` command will ask you a number of questions regarding the package you are building. `checkinstall` will allow you to modify ten possible options concerning your application. We recommend naming this package `sphinxsearch` to avoid overlapping with other packages for different software in Debian. Other modifications can be made at your discretion. When complete, `checkinstall` will generate the following output. Press enter, when you have completed this process:

    0 - Maintainer: [ username@example.com ]
    1 - Summary: [ Sphinx is a full-text search engine. ]
    2 - Name: [ sphinxsearch2 ]
    3 - Version: [ 0.9.9 ]
    4 - Release: [ 1 ]
    5 - License: [ GPL ]
    6 - Group: [ web ]
    7 - Architecture: [ i386 ]
    8 - Source location: [ sphinxsearch-2 ]
    9 - Alternate source location: [ http://sphinxsearch.com/downloads.html ]
    10 - Requires: [ ]

    Enter a number to change any of them or press ENTER to continue:

You will then be able to install Sphinx by issuing the following command:

    dpkg -i /opt/sphinx-0.9.9/sphinxsearch_0.9.9-1_i386.deb

Now, you will be able to remove Sphinx with the following command if need be:

    apt-get remove sphinxsearch

To complete the installation of prerequisites, issue the following commands to install the django-sphinx connector:

    cd /opt/
    git clone git://github.com/dcramer/django-sphinx.git
    cd /opt/django-sphinx/
    python setup.py install

Now, to upgrade to the latest version of the `django-sphinx` software, issue the following command sequence:

    cd /opt/django-sphinx/
    git pull
    python setup.py install

Continue reading to install the OSQA software. We will assume that your OSQA site will be located at `http://example.com/` which points at an Apache virtual host, with a document root located at `/srv/www/example.com/public_html/`.

# Install OSQA

### Download Software

OSQA software is distributed by way of a subversion repository rather than a conventional release cycle. Use the following command sequence to fetch a copy of the software:

    cd /srv/www/example.com/
    svn co http://svn.osqa.net/svnroot/osqa/trunk
    mv trunk osqa/

You can update your copy of OSQA to the latest version released by developers, by issuing the following commands:

    cd /srv/www/example.com/osqa/
    svn up

Please remember to take reasonable precautions before performing this operation on your production sites to avoid breaking the application without proper testing.

### Configure OSQA

To configure OSQA, copy the `settings_local.py.dist` file inside of the `/srv/www/example.com/osqa/` directory to `/srv/www/example.com/osqa/settings_local.py`.

Edit the newly created `/srv/www/example.com/osqa/settings_local.py` and set the following values to correspond to the database and database credentials that you have created.

{{< file-excerpt "settings\\_local.py" python >}}
DATABASE_NAME = 'osqa'                  # Or path to database file if using sqlite3.
DATABASE_USER = 'username'                # Not used with sqlite3.
DATABASE_PASSWORD = '5t1ck'             # Not used with sqlite3.
DATABASE_ENGINE = 'mysql'               # mysql, ext.

{{< /file-excerpt >}}


The majority of OSQA's features can be controlled from within the application itself. However, there are some options that can only be controlled from within the `setings_local.py` file. Consider the following settings, which you may need to modify to suit the needs of your application:

{{< file-excerpt "settings\\_local.py" python >}}
DEBUG=False                             # set to True to enable debug mode

SERVER_EMAIL = ''
DEFAULT_FROM_EMAIL = ''
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''                # not necessary if mailserver is run on local machine
EMAIL_SUBJECT_PREFIX = 'MORRIS '
EMAIL_HOST='example.com'
EMAIL_PORT='25'
EMAIL_USE_TLS=False
TIME_ZONE = 'America/NewYork'

FORUM_SCRIPT_ALIAS = ''                 # no leading slash, default = '' empty string
                                        # if you set FORUM_SCRIPT_ALIAS= 'forum/'
                                        # then OSQA will run at url http://example.com/forum
                                        # FORUM_SCRIPT_ALIAS cannot have leading slash, otherwise it can be set to anything

LANGUAGE_CODE = 'en'                    # forum language (see language instructions on the wiki)
EMAIL_VALIDATION = 'off'                # string - on|off
MIN_USERNAME_LENGTH = 3
EMAIL_UNIQUE = False                    # if True, email addresses must be unique in all accounts
APP_URL = 'http://example.com'      # used by email notif system and RSS
WIKI_ON = True                          # if False - community wiki feature is disabled

FEEDBACK_SITE_URL = None                # None or url
LOGIN_URL = '/%s%s%s' % (FORUM_SCRIPT_ALIAS,'account/','signin/')

DJANGO_VERSION = 1.1                    # must be either 1.0 or 1.1
RESOURCE_REVISION=4                     # increment when you update media files - clients will be forced to load new version

{{< /file-excerpt >}}


### Application Deployment

We'll deploy OSQA using the Apache web server using the `mod_wsgi` method of executing Python code. Include the following directives in your Apache virtual hosting configuration, presumably located at `/etc/apache2/sites-available/example.com`:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
WSGIScriptAlias / /srv/www/example.com/osqa/django.wsgi
<Directory /srv/www/example.com/osqa>
   Order allow,deny
   Allow from all
</Directory>

{{< /file-excerpt >}}


This directive tells Apache that all requests for the top level of your virtual host should be directed to the WSGI application specified in the `/srv/www/example.com/osqa/django.wsgi` file, which we'll create below. In order to allow Apache to continue to serve some static files, insert `Alias` directives in the following form:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
Alias /robots.txt /srv/www/example.com/public_html/robots.txt
Alias /favicon.ico /srv/www/example.com/public_html/favicon.ico
Alias /images /srv/www/example.com/public_html/images
Alias /static /srv/www/example.com/public_html/static

{{< /file-excerpt >}}


Now create the required `django.wsgi` file, as specified:

{{< file "/srv/www/example.com/osqa/django.wsgi" python >}}
import os
import sys

sys.path.append('/srv/www/example.com/osqa')

os.environ['PYTHON_EGG_CACHE'] = '/srv/www.example.com/.python-egg'
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()

{{< /file >}}


After the application has been configured, issue the following commands to properly initialize the database:

    python manage.py syncdb --all
    python manage.py migrate forum --fake

You will need to repeat this command sequence any time you update your software or your database. The first command will prompt to ask if you would like to create a superuser account: you do not. Issue the following commands to create the required directories, set the permissions of the application's logging directory and restart the web server:

    mkdir -p /srv/www/example.com/osqa/cache /srv/www/example.com/.python-egg
    chown -R www-data /srv/www/example.com/osqa/log/ /srv/www/example.com/osqa/cache /srv/www/example.com/.python-egg
    /etc/init.d/apache2 restart

Congratulations! You will now be able to visit your new OSQA powered site located at `http://example.com`.

# Monitor for Software Updates and Security Notices

When running software compiled or installed directly from sources provided by upstream developers, you are responsible for monitoring updates, bug fixes, and security issues. After becoming aware of releases and potential issues, update your software to resolve flaws and prevent possible system compromise. Monitoring releases and maintaining up to date versions of all software is crucial for the security and integrity of a system.

Please monitor the OSQ mailing lists for users and developers to ensure that you are aware of all updates to the software and can upgrade appropriately or apply patches and recompile as needed.

-   [OSQA Users Mailing List](http://lists.osqa.net/mailman/listinfo/users)
-   [OSQA Developers Mailing List](http://lists.osqa.net/mailman/listinfo/dev)

When upstream sources offer new releases, repeat the instructions for installing the OSQA software as needed. These practices are crucial for the ongoing security and functioning of your system.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [OSQA Home Page](http://www.osqa.net/)
- [OSQA Meta QA site](http://meta.osqa.net/)



