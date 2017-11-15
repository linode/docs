---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Use PHP CGI to run PHP scripts as indivudual users on Ubuntu 12.04.'
keywords: ["php", "php cgi", "cgi", "apache", "php scripts", "web apps", "web applications"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/php-cgi/ubuntu-12-04-precise-pangolin/','websites/apache/run-php-applications-under-cgi-with-apache-on-ubuntu-12-04-lts-precise-pangolin/','websites/apache/run-php-cgi-apache-ubuntu-12-04/']
modified: 2012-10-31
modified_by:
  name: Linode
published: 2012-10-31
title: 'Run PHP with CGI and Apache on Ubuntu 12.04 LTS (Precise Pangolin)'
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

    To check your hostname, run:

        hostname
	hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

2.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Installing Apache and PHP

1.  If you have not already installed the Apache HTTP server, do so:

        sudo apt-get install apache2

    You can now [configure virtual hosting](/docs/web-servers/apache/apache-web-server-ubuntu-12-04#configure-virtual-hosting) in accordance with the needs of your server.

2.  Install the PHP CGI binaries:

        sudo apt-get install php5-cgi

    When this process completes, we can configure Apache to hand PHP scripts to the CGI process for rendering these scripts.

### Configure Apache for PHP CGI

In order to set up Apache to use PHP-CGI on Ubuntu systems, you must enable the `mod_actions` module. Issue the following command:

    sudo a2enmod actions

The required directives can be set anywhere in Apache's [configuration tree](/docs/web-servers/apache/configuration/configuration-basics). We recommend creating the `php-cgi.conf` file in Apache's `conf.d/` directory and setting these variables there. For Ubuntu systems, this is located at `/etc/apache2/conf.d/`. You may also choose to place these settings in your `/etc/apache2/httpd.conf` file. Regardless of their location, the relevant settings are:

{{< file-excerpt "Apache Configuration Block" apache >}}
ScriptAlias /local-bin /usr/bin
AddHandler application/x-httpd-php5 php
Action application/x-httpd-php5 /local-bin/php-cgi

{{< /file-excerpt >}}


In this example, the path to the `php-cgi` binary is `/usr/bin/php-cgi`. All files with the `php` extension will be handed to the PHP CGI binary.

You may also choose to put these configuration directives within a virtual hosting block. If you *do not* have `mod_php` enabled or installed, you can use this to selectively enable PHP for certain virtual hosts. Furthermore, if your deployment requires multiple versions of PHP, you can specify virtual host specific handlers by specifying paths to various versions of `php-cgi`.

The configuration file for the CGI executable of PHP is located at `/etc/php5/cgi/php.ini`. You can modify this file to suit the needs of your deployment.

{{< file-excerpt "/etc/php5/cgi/php.ini" ini >}}
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
display_errors = Off
log_errors = On
error_log = /var/log/php.log
max_execution_time = 30
memory_limit = 64M
register_globals = Off

{{< /file-excerpt >}}


If you need support for MySQL in PHP, then you must install the php5-mysql package with the following command:

    sudo apt-get install php5-mysql

When `php-cgi` is configured, you can now safely enable the `itk`  multi-processing module for Apache. The installation process for `itk` will restart the Apache process. If you choose to use PHP CGI with the default or existing MPM, then restart Apache by issuing the following command:

    sudo service apache2 restart

## Enabling the "itk" MPM

The default Apache configuration uses a multi-processing module called `worker` which uses a threaded approach to efficiently handle HTTP requests. An alternative MPM is `prefork` which does not use threads and is compatible with non-thread-safe libraries. Both the `worker` and `prefork` modules require that all requests be handled by a process running under a user with particular permissions. On Ubuntu systems, Apache processes run under the `www-data` user.

This may not be ideal if you have multiple users running publicly accessible scripts on your server. In some of these cases, it is prudent to isolate virtual hosts under specific user accounts using an alternative MPM, known as `itk` or `mpm-itk`. Functionally, `mpm-itk` is quite similar to `prefork`; however, `itk` can process requests for each virtual host or each site under a specified user account. This is useful in situations where you're hosting a number of distinct sites and you need to isolate sites on the basis of user privileges.

1.  Install the mpm-itk module:

        sudo apt-get install apache2-mpm-itk

2.  In the `<VirtualHost >` entries for your sites (the site-specific files in `/etc/apache2/sites-avalible/`) add the following sub-block:

    {{< file-excerpt "Apache Virtual Hosting Configuration Block" apache >}}
<IfModule mpm_itk_module>
	   AssignUserId webeditor webgroup
</IfModule>

{{< /file-excerpt >}}


In this example, `webeditor` is the name of the user of the specific site in question, and `webgroup` is the name of the user group that "owns" the web server related files and processes for this host. Remember that you must create the user accounts and groups using the `useradd` command. Consider our documentation of [user groups and permissions](/docs/tools-reference/linux-users-and-groups) for more information about creating the necessary users and groups.
