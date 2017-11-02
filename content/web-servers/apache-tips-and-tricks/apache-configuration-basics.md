---
author:
  name: Linode
  email: docs@linode.com
description: An advanced overview of configuration for the Apache web server including virtual hosts and configuration file management
keywords: ["configuration", "apache", "web server", "virtual hosting", "http"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/configuration/configuration-basics/','websites/apache-tips-and-tricks/apache-configuration-basics/']
modified: 2011-08-22
modified_by:
  name: Linode
published: 2009-11-06
title: Apache Configuration Basics
external_resources:
 - '[Apache Installation](/docs/websites/apache/)'
 - '[LAMP stack guides](/docs/websites/lamp/)'
 - '[Troubleshooting Common Issues with Apache](/docs/troubleshooting/troubleshooting-common-apache-issues/)'
 - '[Linode User Community](http://linode.com/community/)'
 - '[Apache Virtual Host Documentation](http://httpd.apache.org/docs/2.2/vhosts/)'
 - '[Virtual Host Directives](http://httpd.apache.org/docs/2.2/mod/core.html#virtualhost)'
 - '[Apache Control Interface](http://httpd.apache.org/docs/2.2/programs/apachectl.html)'
 - '[HTTP Command](http://httpd.apache.org/docs/2.2/programs/httpd.html)'
---

The Apache HTTP web server is in many respects the *defacto* standard for general purpose HTTP services. Through its large number of modules, it provides flexible support for proxy servers, URL rewriting, and granular access control. Furthermore, web developers often choose Apache for its support of server-side scripting using CGI, FastCGI, and embedded interpreters. These capabilities facilitate the quick and efficient execution of dynamic code. While there are several prominent alternatives to Apache, even within the boundaries of open source, the breadth of Apache usage is unique.

The extraordinary degree of flexibility provided by Apache does not come without some cost; this mostly takes the form of a configuration structure that is sometimes confusing and often complicated. For this reason we've created this document and a number of other guides that seek to address this complexity and explore some more advanced and *optional* functionality of the Apache HTTP Sever.

If you're interested in just getting a running web server and installing Apache for the first time, we recommend using the appropriate "[installing Apache guide](/docs/websites/apache/)" for your distribution of Linux. If you need a more full-featured LAMP stack, consider trying the appropriate [LAMP guide](/docs/websites/lamp/) for your distribution. This guide assumes that you have a running and up to date Linux system, have successfully installed Apache, and have logged into a shell session with root access.

## Apache Basics

The default configuration of Apache varies significantly between various distributions of Linux. Debian and Ubuntu distributions, as well as Gentoo, refer to Apache as "Apache2" and place the configuration files in the `/etc/apache2/` directory. Other distributions, including Fedora, CentOS, and Arch Linux refer to Apache as "httpd" and store configuration files in `/etc/httpd/`. Most configuration options do not vary between operating systems, though we encourage you to become familiar with the default configuration of your Apache server. The greatest challenges in configuring Apache are in understanding the distributions' standard configurations and their quirks and differences from the Apache upstream.

To administer basic Apache functionality you can use the "init" scripts, which provide a safe and easy way to start, stop, and restart the server. The init script also allows you to reload the configuration and check on the status of the server. To access these functions, issue the appropriate command:

    /etc/init.d/apache2 start
    /etc/init.d/apache2 stop
    /etc/init.d/apache2 restart
    /etc/init.d/apache2 reload
    /etc/init.d/apache2 status

If you're using a distribution that refers to Apache as httpd, then the commands are as follows:

    /etc/init.d/httpd start
    /etc/init.d/httpd stop
    /etc/init.d/httpd restart
    /etc/init.d/httpd reload
    /etc/init.d/httpd status

For some distributions, the path to the script may be `/etc/rc.d/init.d/` instead of `/etc/init.d/`.

If you're using `mod_disk_cache` on Debian-based distributions, the init script contains functionality to control the functionality of the htcache, with the following command:

    /etc/init.d/apache2 start-htcacheclean
    /etc/init.d/apache2 stop-htcacheclean

There is also additional functionality provided from a command line interface. To check the syntax of your Apache configuration files without needing to restart the server and test, you can issue the following command on Debian and Ubuntu systems:

    apache2ctl -t

On CentOS and Fedora systems, use the following form:

    httpd -t

Additionally, the `apache2ctl -S` or `httpd -S` commands provide a report on currently running virtual hosts, containing the port that the host is listening on, the name of the virtual host (i.e. the domain), and information about the location of the site's configuration settings including file names and line numbers.

Typically, the "master" configuration file for Apache is located in the `httpd.conf` file. In Debian-based distributions, this is located in the `apache2.conf` file, and the `httpd.conf` file contains user-specific configuration. In addition to the master file, a number of additional files are included by the master file. To get a list of these files, issue one of the following commands, depending on your distribution:

    grep "Include" /etc/apache2/apache2.conf
    grep "Include" /etc/apache2/httpd.conf
    grep "Include" /etc/httpd/httpd.conf

Note that the order in which these files are included can affect the behavior of the web server. If later options contradict options set in earlier files, the later options override earlier options. Familiarizing yourself with the existing default configuration can be a helpful learning experience.

## Configuration File Organization

One of the most common use cases for the Apache web server is to use its "virtual hosting" capabilities, which allow a single instance of Apache to serve numerous websites and subdomains. Because most websites don't tend to use a significant amount of system resources, virtual hosting is often a great way to fully utilize a web server. As a result of this capability, configuration files for virtual hosts can be complex and difficult to organize. There are two major approaches to the solution for this problem.

### Symbolic Links and the Debian Way

In an effort to increase usability, the Debian project makes it possible for users to mostly avoid editing the "base configuration" of the web server. As a result, Debian and Ubuntu use a sequence of symbolic links to allow administrators to enable and disable various configuration options without deleting configuration options outright.

If you use an operating system other than Debian or would like to use the "sites-enabled" organization for your configuration files, make sure that the appropriate line from the following exists in your `apache.conf` or `httpd.conf` file:

{{< file-excerpt "/etc/httpd/httpd.conf or /etc/apache2/apache2.conf" apache >}}
Include /etc/httpd/sites-enabled/
Include /etc/apache2/sites-enabled/

{{< /file-excerpt >}}


If you haven't yet created this directory, you will need to do so with a command similar to the following: `mkdir -p /etc/httpd/sites-enabled/`. Now your Apache server will include configuration options specified in any files stored in these directories. To create a link to this directory, issue the following command:

    ln -s /etc/httpd/vhosts/example.com /etc/httpd/sites-enabled/example.com

The syntax for creating symbolic links is `ln -s` followed by the "target" or the original file you are linking, and then the path to the link you wish to create. If you omit the final term, the link name, `ln` will create a link with the same name as the target file in the current directory. If you remove a link, the original file will be unaffected. Apache will follow multiple layers of symbolic links, though this can become confusing in its own right.

One possible advantage of this is that the configuration files for a virtual host can be kept in close proximity to the other related files for that virtual host. Often all resources related to your virtual host are located in a directory such as `/srv/www/example.com/`. The `DocumentRoot`, logs directory, and application support files are located beneath this directory at `public_html/`, `logs/`, and `application/` respectively. Given this organization, you may find it convent to store your virtual host configuration file at `/srv/www/example.com/`. This makes backing up and moving a virtual host easy, as all files are located in a single directory. If the virtual host configuration file is located at `/srv/www/example.com/apache.conf` you might create the symbolic link as follows:

    ln -s /srv/www/example.com/apache.conf /etc/apache2/sites-available/example.com

If you're using a Debian-based distribution, you can use the `a2ensite` and `a2dissite` tools to manage virtual host files. You can also manually link your configuration files to `/etc/apache2/sites-enabled/example.com`. If you aren't using a Debian-based distribution, the symbolic link might look something like the following, although the file names and locations may change somewhat:

    ln -s /srv/www/example.com/apache.conf /etc/httpd/conf.d/example.conf

### Create a Single Virtual Hosts file

The Debian approach of keeping a single configuration file for each virtual host can be helpful for managing a number of websites that are not interconnected, or that need to be edited by a number of distinct and non-privileged users. However, there are some situations where having too many individual virtual host files that set the same cluster of configuration options for a group of hosts can cause confusion and increase the maintenance burden.

In these cases, a single file may be the best option for keeping Apache configured properly. This is the preferred organization for virtual host configuration in some distributions, including CentOS, Fedora, and Arch Linux. While you should check the default Apache configuration for your distribution, commonly there is a `conf.d/` directory where user-created configuration can be stored. If you want to combine a number of virtual host configuration files into a single file, create a `vhosts.conf` in the `conf.d/` folder and place all of your configuration options in this file. The `conf.d/` folder is located within Apache's `/etc/` directory, either: `/etc/apache2/conf.d/` or `/etc/httpd/conf.d/` depending on your distribution.

Both configuration options are functionally equivalent, but offer easier administration in different scenarios. The configuration file organization that you choose depends on the needs of your particular deployment.
