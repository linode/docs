---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: Methods for enabling dynamic content to run as individual users with PHP on Fedora 13
keywords: ["php cgi", "php apache", "php scripts", "dynamic apache", "web applications"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/php-cgi/fedora-13/','websites/apache/run-php-applications-under-cgi-with-apache-on-fedora-13/']
modified: 2013-10-04
modified_by:
  name: Linode
published: 2010-08-05
title: Run PHP Applications under CGI with Apache on Fedora 13
---



In most cases, we recommend using the `mod_php` module to run PHP scripts with the [Apache HTTP server](/docs/web-servers/apache/). This embeds a PHP interpreter in the web server process and makes running PHP applications easy. The embedded interpreter approach, however, is not without challenges; it forces all scripts to be executed with the permissions of a shared user account, and is incompatible with some other Apache modules and processes. For example, in our experience `mod_php` is incompatible with the `mod_rails` or Phusion Passenger method of running [Ruby On Rails](/docs/frameworks/). In these cases, if you want to run PHP and Rails applications within a single instance of Apache, you must run PHP scripts as CGI processes, using the method outlined below.

Before beginning this guide, we assume that you've completed the [getting started guide](/docs/getting-started/). If you are new to Linux server administration, we recommend considering the [beginner's guide](/docs/beginners-guide/), and the article concerning [systems administration basics](/docs/using-linux/administration-basics). If you're interested in learning more about the Apache HTTP server, we encourage you to consider our extensive documentation on [Apache configuration](/content/web-servers/apache/).

# Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

# Installing Apache and PHP

Make sure your system is up to date by issuing the following command:

    yum update

If you have not already installed the Apache HTTP server, issue the following command to install the packages for Apache:

    yum install httpd

To start Apache for the first time and ensure that it resumes following subsequent boot cycles issue the following commands:

    /etc/init.d/httpd start
    chkconfig httpd on

You can now [configure virtual hosting](/docs/web-servers/apache/apache-2-web-server-on-fedora-13/#configure-apache) in accordance with the needs of your server. To install the PHP CGI binaries, issue the following command:

    yum install php-cgi

When this process completes, we can configure Apache to hand PHP scripts to the CGI process for rendering these scripts.

# Configure Apache for PHP CGI

The directives required to enable PHP CGI may be set anywhere in Apache's [configuration tree](/docs/web-servers/apache/configuration/configuration-basics). We recommend creating the `php-cgi.conf` file in Apache's `conf.d/` directory and setting these variables there. For Fedora systems this is located at `/etc/httpd/conf.d/`. Regardless of their location, the relevant settings are:

{{< file-excerpt "Apache Configuration Block" apache >}}
ScriptAlias /local-bin /usr/bin
AddHandler application/x-httpd-php5 php
Action application/x-httpd-php5 /local-bin/php-cgi

{{< /file-excerpt >}}


In this example, the path to the `php-cgi` binary is `/usr/bin/php-cgi`. All files with the `php` extension will be handed to the PHP CGI binary.

You may also choose to put these configuration directives within a virtual hosting block. If you *do not* have `mod_php` enabled or installed, you can use this to selectively enable PHP for certain virtual hosts. Furthermore, if your deployment requires multiple versions of PHP, you can specify virtual host specific handlers by specifying paths to various versions of `php-cgi`.

The configuration file for PHP is located at `/etc/php.ini`. You can modify this file to suit the needs of your deployment.

{{< file-excerpt "/etc/php.ini" ini >}}
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
display_errors = Off
log_errors = On
error_log = /var/log/php.log
max_execution_time = 30
memory_limit = 64M
register_globals = Off

{{< /file-excerpt >}}


If you need support for MySQL in PHP, then you must install the php5-mysql package with the following command:

    yum install php-mysql

When PHP CGI is configured, you can now safely enable the `itk` message passing module for Apache. The installation process for `itk` will restart the Apache process. If you choose to use PHP CGI with the default or existing message passing module, then restart Apache by issuing the following command:

    /etc/init.d/httpd restart

Congratulations! Apache is now configured to run PHP scripts using CGI.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [The PHP Homepage](http://php.net/)
- [Apache 2.2 CGI documentation](http://httpd.apache.org/docs/2.2/howto/cgi.html)
