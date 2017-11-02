---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Use PHP CGI to run PHP scripts as indivudual users.'
keywords: ["php cgi", "php", "apache", "cgi", "http", "php scripts", "web apps", "web applications"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/php-cgi/centos-6/','websites/apache/run-php-applications-under-cgi-with-apache-on-centos-6/','websites/apache/run-php-cgi-apache-centos-6/']
modified: 2014-01-14
modified_by:
  name: Linode
published: 2014-01-14
title: Run PHP with CGI and Apache on CentOS 6
external_resources:
 - '[The PHP Homepage](http://php.net/)'
 - '[Apache 2.2 CGI documentation](http://httpd.apache.org/docs/2.2/howto/cgi.html)'
---

In instances where running the `mod_php` module to run PHP scripts on Apache is not sufficient, PHP can be run as a CGI binary. Combined with the `itk` multi-processing module (MPM), PHP scripts can be run as user processes in a per-virtual host setup. This guide will walk users through the proccess of setting up Apache and PHP CGI.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname run:

        hostname
	        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

2.  Update your system:

        sudo yum update

## Installing Apache and PHP

1.  If you have not already installed the Apache HTTP server, do so:

        sudo yum install httpd

2.  Ensure that Apache will start following the next reboot cycle:

        sudo chkconfig httpd on

    You can now [configure virtual hosting](/docs/web-servers/apache/apache-2-web-server-on-centos-5/#configure-apache) in accordance with the needs of your server.

3.  Install the PHP CGI binaries:

        sudo yum install php-cgi

    When this process completes, we can configure Apache to hand PHP scripts to the CGI process for rendering these scripts.


### Configure Apache for PHP CGI

The directives required to enable PHP CGI may be set anywhere in Apache's [configuration tree](/docs/web-servers/apache/configuration/configuration-basics). We recommend creating the `php-cgi.conf` file in Apache's `conf.d/` directory and setting these variables there. For CentOS systems, this is located at `/etc/httpd/conf.d/`. Regardless of their location, the relevant settings are:

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
max_execution_time = 300
memory_limit = 64M
register_globals = Off

{{< /file-excerpt >}}


If you need support for MySQL in PHP, then you must install the php5-mysql package with the following command:

    sudo yum install php-mysql

Congratulations! Apache is now configured to run PHP scripts using CGI.
