---
author:
  name: Linode
  email: docs@linode.com
description: 'Use the Web.py Python framework to develop powerful and innovative web applications on Ubuntu 10.10 (Maverick).'
keywords: ["web.py", "web applications", "python", "web frameworks"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['frameworks/webpy/ubuntu-10-10-maverick/','websites/frameworks/webpy-on-ubuntu-10-10-maverick/']
modified: 2012-10-08
modified_by:
  name: Linode
published: 2011-01-25
title: 'Web.py on Ubuntu 10.10 (Maverick)'
deprecated: true
---

Web.py is a web application framework that stresses minimalism, flexibility, rapid application development, and straight forward deployment. Originally developed to power the popular news and link aggregation site "Reddit," web.py is a powerful option for developing systems for the web.

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Installing Web.py

### Install Prerequisites

Before beginning with Web.py, we must issue the following commands to ensure your system's package repositories are up to date and the latest versions of all software are installed:

    apt-get update
    apt-get upgrade

Issue the following command to install all prerequisite software:

    apt-get install apache2 python

The application you develop using Web.py may require additional dependencies that you can discover and install using your system's [package management tool](/docs/using-linux/package-management#debian-and-ubuntu-package-management). The following command will install the PostgreSQL database and appropriate database drivers:

    apt-get install python-psycopg2 postgresql

For more information about installing and using the PostgreSQL database, [consider our documentation](/docs/databases/postgresql/ubuntu-10-04-lucid). Conversely, if you only need a simple embedded relational database, consider using SQLite, which you can install with the following command:

    apt-get install python-pysqlite2 sqlite3

### Install Web.py

Issue the following commands to download and install Web.py, using a packaged version provided by the Ubuntu project.

> apt-get install python-webpy

If you want to upload a more recent version, consider [this procedure](/docs/development/frameworks/webpy-on-ubuntu-12-04-precise-pangolin/), to install Web.py from source.

# Create a Basic Application with Web.py

There are a number of examples of basic applications developed using the web.py framework. The "main" application file is typically called "code.py". Consider the following "Hello World" application:

{{< file "code.py" python >}}
import web

urls = (
    '(.*)', 'hello'
)
app = web.application(urls, globals())

class hello:
    def GET(self, name):
        if not name:
            name = 'World'
        return 'Hello, ' + name + '!'

if __name__ == "__main__":
    app.run()

{{< /file >}}


Save this file at `/srv/www/example.com/application/code.py` or the equivalent path depending on your virtual hosting deployment, and proceed with the deployment of the application.

# Deploy Web.py Applications

Web.py provides a number of different possibilities for deploying and hosting applications. This document will describe a deployment using the Apache web server and the `mod_wsgi` process. However, you may choose to deploy your Web.py application using whatever web server and application interface method you are most comfortable with: nginx, lighttpd, or Cherokee with FastCGI, CGI, or embedded python interpreters are all viable options.

WSGI is an evolution of the CGI standard, and has performance comparable to FastCGI and embedded interpreter application deployments. Install the required Apache module with the following command:

    apt-get install libapache2-mod-wsgi

Issue the following command to ensure that the required modules are enabled within Apache:

    a2enmod rewrite

WSGI requires a slight modification to your web.py application. Add the following lines to the end of the `code.py` file:

{{< file-excerpt "code.py" python >}}
app = web.application(urls, globals(), autoreload=False)
application = app.wsgifunc()

{{< /file-excerpt >}}


Consider the following Apache VirtualHost configuration for a `mod_wsgi` powered Web.py application:

{{< file-excerpt "Apache VirtualHost Configuration" apache >}}
<VirtualHost example.com:80>
    ServerAdmin username@example.com
    ServerName example.com
       ServerAlias www.example.com
       DocumentRoot /srv/www/example.com/public_html/
       ErrorLog /srv/www/example.com/logs/error.log
       CustomLog /srv/www/example.com/logs/access.log combined

    WSGIScriptAlias / /srv/www/example.com/application
    Alias /static /srv/www/example.com/public_html

    <Directory /srv/www/example.com/application>
      SetHandler wsgi-script
      Options ExecCGI
    </Directory>

    AddType text/html .py

    <Location />
      RewriteEngine on
      RewriteBase /
      RewriteCond %{REQUEST_URI} !^/static
      RewriteCond %{REQUEST_URI} !^(/.*)+code.py/
      RewriteRule ^(.*)$ code.py/$1 [PT]
    </Location>
</VirtualHost>

{{< /file-excerpt >}}


Ensure that this virtual host has been enabled, and issue the following command to restart the server:

    /etc/init.d/apache2 restart

In the above example, requests for the `example.com` domain will be handled by WSGI, with the application files located in `/srv/www/example.com/application`. All static files can be stored in `/srv/www/example.com/public_html` and served directly by Apache. Furthermore, the rewrite rules convert requests so that paths beneath `example.com` are handled by the Web.py application without including `code.py` in the URL. For example, the request for `http://example.com/about` would be processed as `http://example.com/code.py/about` but requests for `http://example.com/static` would not be rewritten and content would be served from `/srv/www/example.com/public_html`.

# Build a Database Driven Application with Web.py

The "Hello World" application above is functional, but isn't able to store or access persistent data in a database system. The following example is simple but inserts and retrieves data from a database system. Consider the following code:

{{< file "code.py" python >}}
import web
urls = (
    '/(.*)', 'hello'
)
app = web.application(urls, globals())

db = web.database(dbn='postgres', db='webpy', user='webpy', pw='webweb')

class hello:
    def GET(self, notetext):
        notetext = dict(notes="a note")
        notes = db.select('notes', notetext, what='notes')
        if notes:
            notes = 'a note is found'
        else:
            notes = 'no notes are found'
        return notes

if __name__ == "__main__":
    app.run()


app = web.application(urls, globals(), autoreload=False)
application = app.wsgifunc()

{{< /file >}}


This program connects to the PostgreSQL database "webpy" and looks in the table "notes" for a note that matches the text "a note". If the note is found, the program returns the text "a note is found"; otherwise, the page will return "no notes are found". Make sure there is a role, or user, in your PostgreSQL database called "webpy" with the credentials specified on the `db` line of this example.

At the PosgreSQL prompt, issue the following commands to the PostgreSQL shell statement to create the required database and tables. The "webpy" user for PostgreSQL must already exist:

    CREATE DATABASE webpy;
    GRANT ALL ON notes TO webpy;
    \c webpy
    CREATE TABLE notes (note_id int, notes varchar);

While the application is running you can issue the following SQL statements to PostgreSQL to modify the output of the above script:

    INSERT INTO notes VALUES (1, 'a note');

    DELETE FROM notes WHERE note_id=1;

Congratulations on the development of your new Web.py application!

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The Web.py Project Home Page](http://webpy.org/)
- [Official Web.py Documentation](http://webpy.org/docs/0.3)
- [Rewrite URLs in Apache with Mod\_Rewrite](/docs/web-servers/apache/configuration/rewriting-urls)
- [WSGI Configuration Options](http://code.google.com/p/modwsgi/wiki/ConfigurationDirectives)



