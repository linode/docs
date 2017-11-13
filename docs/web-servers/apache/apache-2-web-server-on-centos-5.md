---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Instructions for getting started with the Apache web server on CentOS 5.'
keywords: ["Apache", "web sever", "CentOS 5"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/installation/centos-5/','websites/apache/apache-2-web-server-on-centos-5/']
modified: 2013-11-18
modified_by:
  name: Linode
published: 2009-07-27
title: Apache 2 Web Server on CentOS 5
---



This tutorial explains how to install and configure the Apache web server on CentOS 5. All configuration will be done through the terminal; make sure you are logged in as root via SSH. If you have not followed the [getting started](/docs/getting-started/) guide, it is recommended that you do so prior to beginning this guide. Also note that if you're looking to install a full LAMP stack, you may want to consider using our [LAMP guide for CentOS](/docs/lamp-guides/centos-5).

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Install Apache HTTP Server

Make sure your system is up to date by issuing the following command:

    yum update

You'll want to make sure your CentOS install is configured to allow inbound traffic to port 80; you can configure the built-in firewall by issuing the command `system-config-securitylevel-tui` at the shell prompt.

Enter the following command to install the Apache HTTP Server:

    yum install httpd

Issue the following command to start the web server:

    /etc/init.d/httpd start

To ensure that Apache starts following the next reboot cycle, issue the following command:

    chkconfig httpd on

# Install Support for Scripting

The following commands are optional, and should be run if you want to have support within Apache for server-side scripting in PHP, Ruby, Python, or Perl.

To install Ruby support, issue the following command:

    yum install ruby

Note that this only installs support for the Ruby programing language. Running scripts and applications written in Ruby in web pages will require some sort of CGI handler.

To install Perl support, issue the following command:

    yum install mod_perl

To install Python support, issue the following command:

    yum install mod_python

If you need support for MySQL in Python, you will also need to install Python MySQL support:

    yum install MySQL-python

To install PHP support, including common support bundles, issue the following command:

    yum install php php-pear

If you're also hoping to run PHP with mysql, then also install mySQL support:

    yum install php-mysql

# Configure Apache

All configuration for Apache are contained in the `httpd.conf` file, which is located at: `/etc/httpd/conf/httpd.conf`. We advise you to make a backup of this file into your home directory, like so:

    cp /etc/httpd/conf/httpd.conf ~/httpd.conf.backup

By default all files ending in the `.conf` extension in `/etc/httpd/conf.d/` are treated as configuration files, and we recommend placing your non-standard configuration options in files in these directories. Regardless how you choose to organize your configuration files, making regular backups of known working states is highly recommended.

Now we'll configure virtual hosting so that we can host multiple domains (or subdomains) with the server. These websites can be controlled by different users, or by a single user, as you prefer.

Before we get started, we suggest that you combine all configuration on virtual hosting into a single file called `vhost.conf` located in the `/etc/httpd/conf.d/` directory. Open this file in your favorite text editor, and we'll begin by setting up virtual hosting.

### Configure Name-based Virtual Hosts

First we must configure Apache to only "listen" for requests on a specific IP address. By default Apache listens to requests on *all* IP addresses.

For name based Virtual Hosting, begin with a line that reads:

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
NameVirtualHost *:80

{{< /file-excerpt >}}


Now, you will create virtual host entries for each site that you need to host with this server. Here are two examples for sites at "example.org" and "example.net:"

{{< file-excerpt "Apache Virtual Host Configuration" apache >}}
<VirtualHost *:80>
     ServerAdmin admin@example.org
     ServerName example.org
     ServerAlias www.example.org
     DocumentRoot /srv/www/example.org/public_html/
     ErrorLog /srv/www/example.org/logs/error.log
     CustomLog /srv/www/example.org/logs/access.log combined
</VirtualHost>

<VirtualHost *:80>
     ServerAdmin webmaster@example.net
     ServerName example.net
     ServerAlias www.example.net
     DocumentRoot /srv/www/example.net/public_html/
     ErrorLog /srv/www/example.net/logs/error.log
     CustomLog /srv/www/example.net/logs/access.log combined
</VirtualHost>

{{< /file-excerpt >}}


Notes regarding this example configuration:

-   All of the files for the sites that you host will be located in directories that exist underneath `/srv/www`. You can symbolically link these directories into other locations if you need them to exist in other places.
-   `ErrorLog` and `CustomLog` entries are suggested for more fine-grained logging, but are not required. If they are defined (as shown above), the `logs` directories must be created before you restart Apache.

Before you can use the above configuration you'll need to create the specified directories. For the above configuration, you can do this with the following commands:

    mkdir -p /srv/www/example.org/public_html
    mkdir -p /srv/www/example.org/logs
    mkdir -p /srv/www/example.net/public_html
    mkdir -p /srv/www/example.net/logs

After you've set up your virtual hosts, issue the following command to run Apache for the first time:

    /etc/init.d/httpd start

Virtual hosting for your domain should now work -- assuming of course that you have already configured DNS to point your domain to your Linode's IP address. Remember that you can create as many virtual hosts with Apache as you need.

Any time you change an option in your `vhost.conf` file, or any other Apache configuration remember to reload the configuration with the following command:

    /etc/init.d/httpd reload

# Configuration Options

One of the strengths, and obstacles, of Apache is the immense amount of flexibility offered in its configuration files. In the default installation of Apache 2 on CentOS 5, the main configuration file is located at `/etc/httpd/conf/httpd.conf`, but Apache configuration is also loaded from files in a number of different locations, in a specific order. Configuration files are read in the following order, with items specified later taking precedence over earlier and potentially conflicting options:

1.  `/etc/httpd/conf/httpd.conf`
2.  Files with`.conf` extensions in `/etc/httpd/conf.d/` directory are read in order, sorted alphabetically by file name.

Remember, later files take precedence over earlier-cited files. Within a directory of included configuration files, files will be read in order based on an alpha-numeric sort of their file names.

Apache will follow symbolic links to read configuration files, so you can create links in these directories and locations to files that are actually located elsewhere in your file system.

In accordance with best practices, we do not recommend modifying the default configuration file in most cases, as most control of Apache can be administered from files included in the `conf.d/` directory, which can help administrators avoid unforeseen conflicts. If you do decide to edit `httpd.conf`, make a backup of the standard configuration file, as well as backups of known-working states. This will help you quickly restore your server to a working state in case your modifications introduce an unforeseen error.

    cp /etc/httpd/conf/httpd.conf /etc/httpd/conf/httpd-conf.backup-1

Generally, as specified above and in our [LAMP guide for CentOS 5.2](/docs/lamp-guides/centos-5) configuration files related to virtually hosted sites should be located in hosts should be located in a specific virtual host file, such as `/etc/httpd/conf.d/vhost.conf`, though you can split site-specific configuration information into additional files if needed.

# Install Apache Modules

One of Apache's prime strengths is its extreme customizability and flexibility. With its support for a large number of modules, there are few web serving tasks that Apache cannot fulfill. By default, modules are located in the `/etc/httpd/modules/` directory. Configuration directives for the default modules are located in `/etc/httpd/conf/httpd.conf`, while configuration options for optional modules installed with yum are generally placed in `.conf` files in `/etc/httpd/conf.d/`.

To see if a module is enabled, look in "conf" files for lines beginning with `LoadModule` statements. The following two `grep` commands should generate a list of currently available modules:

    grep ^LoadModule /etc/httpd/conf/httpd.conf
    grep ^LoadModule /etc/httpd/conf.d/*

To disable an existing module (at your own risk) edit the file in question, and comment out the `LoadModule` statement by prefixing the line with a hash (e.g. `#`).

To get a list of available Apache modules modules in the CentOS repository use the following commands:

    yum search mod_

You can then install one of these modules with the command:

    yum install mod_[module-name]

Modules should be enabled and ready to use following installation, though you may have to apply additional configuration options to have access to the modules' functionality. Consult the [Apache Module Documentation](http://httpd.apache.org/docs/2.0/mod/) for more information regarding the configuration of specific modules.

# Understanding .htaccess Configuration

The `.htaccess` file is the Apache configuration interface that many webmasters and developers have the most experience with. Entering configuration options in these files allow you to control Apache's behavior on a per-directory basis. This allows you to "lock" a directory behind a password wall (for instance) to prevent general access to it. Additionally, directory specific `.htaccess` files are a common location to specify rules for rewriting URLs.

Remember that options specified in an `.htaccess` file apply to all directories below the file. Furthermore, note that all options specified in `.htaccess` files can specify higher level configuration locations. If this kind of configuration organization is desirable for your setup you can specify directory-level options using `<Directory >` blocks within your virtual host.

# Password Protecting Directories

In a **non** web accessible directory, we need to create a .htpasswd file. For example, if the document root for your Virtual Host is `/srv/www/example.com/public_html/`, use `/srv/www/example.com/`. Enter this directory:

    cd /srv/www/example.com/

Using the `htpasswd` command we'll create a new password entry for a user named `cecil`:

    htpasswd -c .htpasswd cecil

Note, you can specify an alternate name for the password file (eg. `.htpasswd`), which might be prudent if you wanted to store a number of `.htpasswd` files for different directories in the same location.

These usernames and passwords need not (and should not) correspond to system usernames and passwords. Also, you can specify how passwords are encrypted/hashed with the `-m` flag for MD5, or `-s` for SHA hashes. Furthermore, note that when you're adding additional users to the `.htpasswd` file you should not use the `-c` option (which creates a new file).

In the .htaccess file for the directory that you want to protect, add the following lines:

{{< file-excerpt ".htaccess" apache >}}
AuthUserFile /srv/www/example.com/.htpasswd
AuthType Basic
AuthName "Advanced Choreographic Information"
Require valid-user

{{< /file-excerpt >}}


Note, that the `AuthName` is presented to the user as an explanation in the authentication dialog for what they are requesting access to on the server.

# Rewriting URLs with mod\_rewrite

The mod\_rewrite engine is very powerful, and is available for your use by default. Although the capabilities of mod\_rewrite far exceed the scope of this section, we hope to provide a brief outline and some common use cases.

In a `<Directory >` block or `.htaccess` file, enable mod\_rewrite with the following line:

{{< file-excerpt "Apache Virtual Host Configuration or .htaccess" apache >}}
RewriteEngine on

{{< /file-excerpt >}}


Now, you may create any number of separate rewrite rules. These rules provide a pattern that the server compares incoming requests against, and if a request matches a rewrite pattern, the server provides an alternate page. Here is an example rewrite rule:

{{< file-excerpt "Apache Virtual Host Configuration or .htaccess" apache >}}
RewriteRule ^post-id/([0-9]+)$ /posts/$1.html

{{< /file-excerpt >}}


Let's parse this rule. First, note that the first string is the pattern for matching against incoming requests. The second string specifies the actual files to be served. Mod\_rewrite patterns use regular expression syntax: the `^` matches to the beginning of the string, and the `$` matches to the end of the string, meaning that the rewrite engine won't rewrite strings that partially match the pattern.

The string in question rewrites all URLs that specify paths that begin with `/post-id/` and contain one or more numbers (eg. `[0-9]+`), serving a corresponding `.html` file in the `/posts/` directory. The parenthetical term or terms in the pattern specify a variable that is passed to the second string as `$1`, `$2`, `$3` and so forth.

There are many other possibilities for using mod\_rewrite to allow users to see and interact with useful URLs, while maintaining a file structure that makes sense from a development or deployment perspective.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Apache HTTP Server Version 2.0 Documentation](http://httpd.apache.org/docs/2.0/)
- [Apache Configuration](/docs/web-servers/apache/configuration/)
