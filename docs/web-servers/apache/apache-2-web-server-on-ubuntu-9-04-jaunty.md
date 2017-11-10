---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Instructions for getting started with the Apache web server on Ubuntu Jaunty.'
keywords: ["Apache", "web sever", "Ubuntu Jaunty"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/installation/ubuntu-9-04-jaunty/','websites/apache/apache-2-web-server-on-ubuntu-9-04-jaunty/']
modified: 2011-04-29
modified_by:
  name: Linode
published: 2009-08-13
expiryDate: 2013-04-29
deprecated: true
title: 'Apache 2 Web Server on Ubuntu 9.04 (Jaunty)'
---



This tutorial explains how to install and configure the Apache web server on Ubuntu 9.04 (Jaunty). All configuration will be done through the terminal; make sure you are logged in as root via SSH. If you have not followed the [getting started](/docs/getting-started/) guide, it is recommended that you do so prior to beginning this guide. Also note that if you're looking to install a full LAMP stack, you may want to consider using our [LAMP guide for Ubuntu 9.04](/docs/lamp-guides/ubuntu-9-04-jaunty).

# Install Apache 2

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Enter the following command to install the Apache 2 web server, its documentation and a collection of utilities.

    apt-get install apache2 apache2-doc apache2-utils

# Install Support for Scripting

The following commands are optional, and should be run if you want to have support within Apache for server-side scripting in PHP, Ruby, Python, or Perl.

To install Ruby support, issue the following command:

    apt-get install libapache2-mod-ruby

To install Perl support, issue the following command:

    apt-get install libapache2-mod-perl2

To install Python support, issue the following command:

    apt-get install libapache2-mod-python

If you need support for MySQL in Python, you will also need to install Python MySQL support:

    apt-get install python-mysqldb

To install PHP support, including common php extensions for added security and performance. Your PHP application may require additional dependencies included in Ubuntu. To check for available php dependencies run `apt-cache search php`, which will provide a list of package names and descriptions. To install, issue the following command:

    apt-get install libapache2-mod-php5 php5 php-pear php5-suhosin php5-xcache

If you're also hoping to run PHP with mysql, then also install mySQL support:

    apt-get install php5-mysql

# Configure Apache for Named-Based Virtual Hosting

Apache supports both IP-based and name-based virtual hosting, allowing you to host multiple domains on a single server.

Each virtual host needs its own file in the `/etc/apache2/sites-available/` directory. In this example, you'll create files for two **name-based** virtually hosted sites, "example.com" and "example.com".

Create the virtual hosting file for example.com, located at `/etc/apache2/sites-available/example.com`, to resemble the following:

{{< file-excerpt "/etc/apache2/sites-available/example.com" >}}
<VirtualHost 12.34.56.78:80>
     ServerAdmin username@example.com
     ServerName example.com
     ServerAlias www.example.com
     DocumentRoot /srv/www/example.com/public_html/
     ErrorLog /srv/www/example.com/logs/error.log
     CustomLog /srv/www/example.com/logs/access.log combined
</VirtualHost>
{{< /file-excerpt >}}

If you would like to enable Perl support, then add the following lines to the `VirtualHost` entry above.

{{< file-excerpt "Apache Virtual Hosting File" >}}
Options ExecCGI
AddHandler cgi-script .pl
{{< /file-excerpt >}}

Next, create the virtual hosting file for example.com, located in `/etc/apache2/sites-available/example.com`, to resemble the following:

{{< file-excerpt "/etc/apache2/sites-available/example.com" >}}
<VirtualHost 12.34.56.78:80>
     ServerAdmin username@example.com
     ServerName example.com
     ServerAlias www.example.com
     DocumentRoot /srv/www/example.com/public_html/
     ErrorLog /srv/www/example.com/logs/error.log
     CustomLog /srv/www/example.com/logs/access.log combined
</VirtualHost>
{{< /file-excerpt >}}

You'll note that some basic options are specified for both sites, including where the files for the site will reside (under `/srv/www/`). You can add (or remove) additional configuration options, such as the Perl support, on a site-by-site basis to these files as your needs dictate.

To enable a site issue the following command:

    a2ensite [sitename]

where the [sitename] is the same as the virtual host file name under `/etc/apache2/sites-available/`. To disable a site, use the `a2dissite [sitename]` command. Note before, you can use the above configuration you'll need to create the specified directories. For the above configuration, you can do this with the following commands:

    mkdir -p /srv/www/example.com/public_html
    mkdir -p /srv/www/example.com/logs
    mkdir -p /srv/www/example.com/public_html
    mkdir -p /srv/www/example.com/logs

Finally, restart the Apache server to initialize all the changes, with this command:

    /etc/init.d/apache2 restart

In the future when you create or edit any virtual host file, you'll need to reload the config, which you can do without restarting the server with the following command:

    /etc/init.d/apache2 reload

Congratulations! You now have Apache installed on your Ubuntu Linode and have configured the server for virtual hosting.

# Install Apache Modules

One of Apache's prime strengths is its extreme customizability and flexibility. With its support for a large number of modules, there are few web serving tasks that Apache cannot fulfill. By default, modules and their configuration files are installed in the `/etc/apache2/mods-available/` directory. Generating a list of this directory will tell you what modules are installed. To enable a module listed in this directory, use the following command:

    a2enmod [module-name]

Note that in the `/etc/apache2/mods-available/` directory, files have a `.load` and `.conf` extension. Module names do not include the extension.

To disable a module that is currently enabled, use the inverse command:

    a2dismod [module-name]

To get a list of available Apache modules modules in the Ubuntu repository use the following command:

    apt-cache search libapache2*

To install one of these modules use the command:

    apt-get install [module-name]

Modules should be enabled and ready to use following installation, though you may have to apply additional configuration options to have access to the modules' functionality. Consult the [Apache Module Documentation](http://httpd.apache.org/docs/2.0/mod/) for more information regarding the configuration of specific modules.

# Configuration Options

One of the strengths, and obstacles, of Apache is the immense amount of flexibility offered in its configuration files. In the default installation of Apache 2 on Debian Lenny, the main configuration is located in the `/etc/apache2/apache2.conf` files, but Apache configuration is loaded from files in a number of different locations, in a specific order. Configuration files are read in the following order, with items specified later taking precedence over earlier and potentially conflicting options:

1.  `/etc/apache2/apache2.conf`
2.  Files with `.load` or `.conf` extensions in `/etc/apache2/mods-enabled/` directory.
3.  `/etc/apache2/httpd.conf` (Blank by default.)
4.  `/etc/apache2/ports.conf`
5.  Files within the `/etc/apache2/conf.d/` directory.
6.  Files within the `/etc/apache2/sites-enabled/` directory.
7.  Per-directory `.htaccess` files in the directory.

Remember, later files take precedence over earlier-cited files. Within a directory of included configuration files, files will be read in order based on the sort of their file names.

Apache will follow symbolic links to read configuration files, so you can create links in these directories and locations to files that are actually located elsewhere in your file system.

Best practices for most installations dictate that we don't recommend modifying the following default configuration files: `/etc/apache2/httpd.conf`, files in `/etc/apache2/mods-enabled/`, and in most cases `/etc/apache2/apache2.conf`. This is to avoid unnecessary confusion and unintended conflicts in the future.

Generally, as specified in our [LAMP Guide for Debian Lenny](/docs/lamp-guides/debian-5-lenny) and elsewhere, files that configure virtual hosts should be located in the `/etc/apache2/sites-available/` directory (and symbolically linked to `sites-enabled/` with the `a2ensite` tool. This allows for a clear and specific per-site configuration.

In practice the vast majority of configuration options will probably be located in site-specific virtual host configuration files.

If you need to set system-wide configuration or aren't using virtual hosting, the best practice is to specify options in files created beneath the `conf.d/` directory.

# Multi-Processing Module

The default Apache configuration uses a tool called MPM-prefork, which allows Apache to handle requests without threading for greater compatibility with some software. Furthermore, using MPM allows Apache to isolate requests in separate processes so that if one request fails for some reason, other requests will be unaffected.

For more complex setups, however, we recommend that you consider using an alternate MPM module called "ITK." `mpm-itk` is quite similar to `prefork`, but it goes one step further and runs the processes for each site under a distinct user account. This is particularly useful in situations where you're hosting a number of distinct sites that you need to isolate sites on the basis of user privileges.

Begin by installing the mpm-itk module:

    apt-get install apache2-mpm-itk

Now, in the `<VirtualHost >` entries for your sites (the site-specific files in `/etc/apache2/sites-available/`) add the following sub-block:

{{< file-excerpt "Apache Virtual Hosting Configuration" >}}
<IfModule mpm_itk_module>
   AssignUserId webeditor webgroup
</IfModule>
{{< /file-excerpt >}}

In this example, `webeditor` is the name of the user of the specific site in question, and `webgroup` is the name of the particular group that "owns" the web server related files and processes. Remember that you must create the user accounts and groups using the `useradd` command.

# Understanding .htaccess Configuration

The `.htaccess` file is the Apache configuration interface that many webmasters and developers have the most experience with. Entering configuration options in these files allow you to control Apache's behavior on a per-directory basis. This allows you to "lock" a directory behind a password wall (for instance) to prevent general access to it. Additionally, directory specific `.htaccess` files are a common location to specify rules for rewriting URLs.

Remember that options specified in an `.htaccess` file apply to all directories below the file.

Furthermore, note that all options specified in `.htaccess` files can specify higher level configuration locations. If this kind of configuration organization is desirable for your setup you can specify directory-level options using `<Directory >` blocks within your virtual host.

# Password Protecting Directories

In a **non** web accessible directory, we need to create a .htpasswd file. For example, if the document root for your Virtual Host is `/srv/www/bleddington.com/public_html/`, use `/srv/www/bleddington.com/`. Enter this directory:

    cd /srv/www/bleddington.com/

Using the `htpasswd` command we'll create a new password entry for a user named `cecil`:

    htpasswd -c .htpasswd cecil

Note, you can specify an alternate name for the password file (eg. `.htpasswd`), which might be prudent if you wanted to store a number of `.htpasswd` files for different directories in the same location.

These usernames and passwords need not (and should not) correspond to system usernames passwords. Also, you can specify how passwords are encrypted/hashed with the `-m` flag for MD5, or `-s` for SHA hashes. Furthermore, note that when you're adding additional users to the `.htpasswd` file do not use the `-c` option (which creates a new file).

In the .htaccess file for the directory that you want to protect, add the following lines:

{{< file-excerpt ".htaccess" >}}
AuthUserFile /srv/www/bleddington.com/.htpasswd AuthType Basic AuthName "Advanced Choreographic Information" Require valid-user
{{< /file-excerpt >}}

Note, that the `AuthName` is presented to the user as an explanation for what they are authenticating in the authentication dialog.

# Rewriting URLs with mod\_rewrite

The mod\_rewrite engine is very powerful, and is available for your use by default. Although the capabilities of mod\_rewrite far exceed the scope of this section, we hope to provide a brief outline and some common use cases.

In a `<Directory >` block or `.htaccess` file, enable mod\_rewrite with the following line:

{{< file-excerpt "Apache Virtual Configuration or .htaccess file" >}}
RewriteEngine on
{{< /file-excerpt >}}

Now, you may create any number of separate rewrite rules. These rules provide a pattern that the server compares incoming requests against, and if a request matches a rewrite pattern, the server provides an alternate page. Here is an example rewrite rule:

{{< file-excerpt "Apache Virtual Configuration or .htaccess file" >}}
RewriteRule ^post-id/([0-9]+)$ /posts/$1.html
{{< /file-excerpt >}}

Let's parse this rule. First, note that the first string is the pattern for matching against incoming requests. The second string specifies the actual files to be served. Mod\_rewrite patterns use regular expression syntax: the `^` matches to the beginning of the string, and the `$` matches to the end of the string, meaning that the rewrite engine won't rewrite strings that partially match the pattern.

The string in question rewrites all URLs that specify paths that begin with `/post-id/` and contain one or more numbers (eg. `[0-9]+`), serving a corresponding `.html` file in the `/posts/` directory. The parenthetical term or terms in the pattern specify a variable that is passed to the second string as `$1`, `$2`, `$3` and so forth.

There are many other possibilities for using mod\_rewrite to allow users to see and interact with useful URLs, while maintaining a file structure that makes sense from a development or deployment perspective.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Apache HTTP Server Version 2.0 Documentation](http://httpd.apache.org/docs/2.0/)
- [URL Rewriting on HTML Source](http://www.yourhtmlsource.com/sitemanagement/urlrewriting.html)
- [Apache Configuration](/docs/web-servers/apache/configuration/)
