---
deprecated: true
author:
  name: Dave Messina
  email: docs@linode.com
description: 'Using lighttpd to host multiple websites on Ubuntu 12.04 (Precise)'
keywords: ["lighttpd", "web server", "web hosting"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/lighttpd/ubuntu-12-04-precise/','websites/lighttpd/lighttpd-web-server-on-ubuntu-12-04-preci/']
modified: 2013-09-11
modified_by:
  name: Linode
published: 2013-09-11
title: 'lighttpd Web Server on Ubuntu 12.04 (Precise)'
external_resources:
 - '[Optimizing FastCGI Performance (lighttpd wiki)](http://redmine.lighttpd.net/projects/lighttpd/wiki/Docs:PerformanceFastCGI)'
 - '[mod\_fastcgi Documentation (lighttpd wiki)](http://redmine.lighttpd.net/projects/lighttpd/wiki/Docs:ModFastCGI)'
 - '[HowtoForge Guides for lighttpd (howtoforge.com)](http://www.howtoforge.com/howtos/lighttpd)'
 - '[NixCraft Guides for Ligttpd (nixcraft)](http://www.cyberciti.biz/tips/category/lighttpd)'
---

This tutorial explains how to install and configure the lighttpd (eg. "lighty") web server on Ubuntu 12.04 (Precise). Lighttpd is designed to provide a lightweight web server that is capable of serving large loads and using less memory than servers like the Apache HTTP server. It's commonly deployed on high traffic sites, including YouTube. You might want to consider using lighttpd if you're having problems scaling your current web server to meet your load requirements. Lighttpd makes sense for users who find "big" programs like Apache daunting and bloated.

Our example will illustrate the installation of a lighttpd server on an Ubuntu 12.04 (Precise) system. We assume that you've followed the [getting started guide](/docs/getting-started/) and are running on an updated system. This document does not, however, include instructions for deploying other common services in the web development stack. We recommend you consult additional resources (a few are listed at the end of this tutorial) to deploy the remainder of your web stack.

If you're switching from an alternate web server like Apache, remember to turn Apache off for testing purposes, or configure lighttpd to serve on an alternate port until it's configured properly.

For purposes of this tutorial we'll assume you are logged into an SSH session on your Linode as the root user.

## Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

## Installing lighthttpd

Issue the following commands to refresh your system's package database and ensure that you're running the most up to date software:

    apt-get update
    apt-get upgrade --show-upgraded

First, install the server using apt-get by issuing the following command:

    apt-get install lighttpd

Once the server is installed we'll want to check to make sure that it's running and is enabled. Visit `http://[your-ip-address]:80` in your browser. If you have set up lighttpd to run on an alternate port for testing, be sure to replace `80` with this port. You'll see a placeholder page for lighttpd that contains some important information. Notably:

-   The configuration file is located at `/etc/lighttpd/lighttpd.conf`, which we will be editing to further configure the server.
-   By default, the "DocumentRoot" (where all web-accessible files are stored) is located in the `/var/www/` directory. You'll be able to indicate another folder later in the process if you would like.
-   Ubuntu provides helper scripts to enable and disable server modules without directly editing the config file: `lighty-enable-mod` and `lighty-disable-mod`

## Configuring Lighttpd

You will want to configure your lighttpd instance to provide only the services that you need for your use case. Strictly speaking none of the configuration options described in this section are *required* for any or all setups. Nevertheless, many of these options may prove useful in your configuration process.

We've also provided an example configuration, with extensive comments, which might help contextualize this reference and the configuration process.

Begin by entering the command `lighty-enable-mod` at the command prompt. You will be provided with a list of available modules and a list of already enabled modules, as well as a prompt to enable a module. You can exit with Control-c, or you can enable one of the modules at this point. You may also use `lighty-enable` to activate this prompt.

For a basic compliment of modules we might begin by enabling SSI (for server side includes) and auth modules with the following command:

    lighty-enable-mod ssi auth

You may also want to enable the mod\_rewrite (rewriting URL requests) and mod\_evhost (virtual hosting of domains and subdomains) modules, which you can do by uncommenting the appropriate lines at the beginning of the config file (`/etc/lighttpd/lighttpd.conf`). Some highlights of this file allow you to:

-   change which TCP port lighttpd runs on, uncomment and modify `server.port`.
-   specify which network devices (statically configured IP addresses) you want the server to listen for new connection on. If you want to run lighttpd for some IP addresses, and another web server for other IP addresses, you can alter the `server.bind` property.
-   configure url rewriting by uncommenting and modifying `url.rewrite` values.

When you've completed your configuration you must reload the configuration with the following command:

    /etc/init.d/lighttpd force-reload

There are many additional modules that are included in separate Ubuntu packages. They can be installed with `apt-get install` and the salient ones are:

-   `lighttpd-mod-mysql-vhost` - This provides an alternate means of managing virtual hosts using a mySQL database, and is good for instances where you need to manage a large number of virtual hosts in a programmatic manner.
-   `lighttpd-mod-webdav` - provides support for the WebDAV extensions to the HTTP protocol for distributed authoring of HTTP resources.
-   `lighttpd-mod-magnet` - Provides a powerful mechanism for URL rewrites and caching abilities based on the Lua scripting language.

When you have installed these packages you will be able to enable them using the `lighty-enable-mod` interface. For more information regarding installation and configuration of specific modules, consult the [lighttpd documentation](http://redmine.lighttpd.net/projects/lighttpd/wiki/Docs).

Remember to reload lighttpd after you've finished installing, enabling, and configuring new modules.

## Virtual Host Setup with Simple Vhost

### Configure Simple Vhost Module

Ensure that all other virtual hosting modules are turned off.

This section covers configuration for simple virtual hosting. The mod\_simple\_virtual hosts allows you to quickly set up virtual hosts with respective DocumentRoots in folders named for the domains, below a "server root."

Begin by enabling mod\_simple-vhost with the following command:

    lighty-enable-mod simple-vhost

and continue by reloading lighttpd:

    /etc/init.d/lighttpd force-reload

Modify the following settings in your `/etc/lighttpd/conf-enabled/10-simple-vhost.conf` file:

{{< file-excerpt "/etc/lighttpd/conf-enabled/10-simple-vhost.conf" lighty >}}
simple-vhost.server-root = "/var/www"
simple-vhost.document-root = "/htdocs/"
# simple-vhost.default-host = "brackley.org"

{{< /file-excerpt >}}


After editing this file reload the web server again with the following command:

    /etc/init.d/lighttpd force-reload

The `server-root` defines the base directory under which all virtual host directories are created.

The `default-host` specifies which host name will be directed to the default site. For optimum operation, you should not set this value.

The `document-root` defines the subdirectory under the `default-host` directory that contains the pages to be served. This is comparable to the `public_html/` directory you may be familiar with from some Apache configurations, and is called `htdocs/` in the above configuration.

In this configuration, lighttpd will look for directories in `/var/www/` that correspond to domain and subdomain requests and serve results from those directories. If lighttpd receives a request and cannot find a directory it serves content from the default-host directory.

### Create Simple Virtual Hosts

Once the required `simple-vhost.` directives are instantiated as above, create the required directories to create the default virtual host:

    mkdir -p /var/www/example.com/htdocs/

Issue the following commands to create two additional virtual hosts:

    mkdir -p /var/www/example.net/htdocs/
    mkdir -p /var/www/example.org/htdocs/

Use the following sequence of commands to create default index pages for all sites:

    echo "<h1>Welcome to example.com</h1> <p>It is the default site</p>" > /var/www/example.com/htdocs/index.htm
    echo "<h1>Welcome to example.net</h1>" > /var/www/example.net/htdocs/index.htm
    echo "<h1>Welcome to example.org</h1>" > /var/www/example.org/htdocs/index.htm

## Virtual Host Setup with Enhanced Vhost

Begin by adding the "mod\_evhost" module in the server.modules block of the `/etc/lighttpd/lighttpd.conf` file.

To accomplish the same directory structure with evhost as with the simple-vhost, we would need to insert the following statement into `lighttpd.conf`:

{{< file-excerpt "lighttpd.conf" lighty >}}
evhost.path-pattern = "/var/www/%0/htdocs/"

{{< /file-excerpt >}}


You have maximum flexibility to create virtual hosts in this manner. The naming convention for these virtual hosts is derived from the domains names, given the following (fictitious) web address: `http://lookhere.somesubdomain.example.com/`

You can modify the url format lighttpd recognizes by defining the pattern that gets passed through to the directory from which the content lives.

{{< file-excerpt "lighttpd.conf" lighty >}}
# define a pattern for the host url finding
# %% => % sign
# %0 => domain name + tld
# %1 => tld
# %2 => domain name without tld
# %3 => subdomain 1 name
# %4 => subdomain 2 name
#
# evhost.path-pattern = "/home/storage/dev/www/%3/htdocs/"

{{< /file-excerpt >}}


We read domain names backwards, so `com` is the tld or "top level domain", `example` is the domain, `somesubdomain` is the subdomain 1 name, and `lookhere` is the subdomain 2 name. These can be combined using the above syntax to create a virtual hosting scheme that makes sense for your use case.

## Virtual Hosting Best Practices

The way you set up virtual hosting on your web server is highly dependent upon what kind of sites you need to host, their traffic, the number of domains, and the workflows associated with these domains. We recommend hosting all of your domains in a centralized top level directory (eg. `/var/www/` or `/srv/www`) and then symbolically linking these directories into more useful locations.

For instance, you can create a series of "web editor" user accounts. You may then link the "DocumentRoot" of each domain into a folder in the home folder of the account of the editor for that domain. For the user account "abraham-brown" that manages the "brackley.com" site, the link would be created like so:

    ln -s /home/myuser/example.com/ /var/www/example.com

You can also use symbolic links to cause multiple virtually hosted domains to host the same files. For example, to get example.org to point to example.com's files, create the following link:

    ln -s /var/www/example.org/ /var/www/example.com

No matter what you decide, we recommend developing some sort of systematic method for organizing virtual hosting so that you don't becomes confused down the road when you need to modify your system.

## Running Scripts with mod\_fastcgi

If you need your web server to execute dynamic content, the preferred way to accomplish this with lighttpd is to run these scripts using FastCGI. To run a script, FastCGI externalizes the interpreter for the script for dynamic web applications from the web server rather than running the scripts "inside" the web server. This is in contrast to the common Apache-based approaches such as mod\_perl, mod\_python, and mod\_php. If you're familar with Apache this might seem foreign and/or antiquated, but in high-traffic situations doing things this way is often more efficient and effective.

To set up FastCGI you need to make sure that an interpreter is installed on your system that is capable of running your scripts. Perl version 5.14.2 is included in Ubuntu by default. Issue one of the following commands:

    # to install python
        apt-get install python

    # to install ruby
        apt-get install ruby

    # to install PHP version 5 for CGI interfaces
        apt-get install php-cgi

You will almost certainly need to install and set up a database system of some sort as well, depending on the software you intend to run.

Lighttpd will send CGI requests to CGI handlers on the basis of file extensions, and every file extension can be forwarded individual handlers. You may also forward requests for one extension to multiple servers, and Lighttpd will automatically load balance these FastCGI connections.

If you install the php5-cgi package and enable mod\_fastcgi with `lighty-enable-mod fastcgi` then a default FastCGI handler will be configured in the file `/etc/lighttpd/conf-enabled/10-fastcgi.conf`. Though the handler will likely require specific customization for your use cases, it serves as an effective example:

{{< file-excerpt "/etc/lighttpd/conf-enabled/10-fastcgi.conf" lighty >}}
fastcgi.server    = ( ".php" =>
        ((
                "bin-path" => "/usr/bin/php-cgi",
                "socket" => "/tmp/php.socket",
        "max-procs" => 2,
                "idle-timeout" => 20,
                "bin-environment" => (
                        "PHP_FCGI_CHILDREN" => "4",
                        "PHP_FCGI_MAX_REQUESTS" => "10000"
                ),
                "bin-copy-environment" => (
                        "PATH", "SHELL", "USER"
                ),
                "broken-scriptfilename" => "enable"
        ))
)

{{< /file-excerpt >}}


You can map more than one file extensions to a single FastCGI handler by adding the following entry to your config file:

{{< file-excerpt "/etc/lighttpd/conf-enabled/10-fastcgi.conf" lighty >}}
fastcgi.map-extensions = ( ".[ALT-EXTENSION]" => ".[EXTENSION]" )

{{< /file-excerpt >}}


Again, mod\_fastcgi supports creating multiple handlers, and even adding multiple FastCGI back ends per-handler.

## Lighttpd Caveats

While lighttpd is an effective and capable web server there are two caveats regarding its behavior that you should be familiar with as you continue on your lighttpd path.

First, server side includes, which allow you to dynamically include content from one file into another do not function in lighttpd in the same way that they function in Apache's mod\_ssi. While it is an effective method for quickly assembling content, lighttpd's script handling via SSI is not a recommended work flow. [See lighttpd project documentation on mod\_ssi](http://redmine.lighttpd.net/projects/lighttpd/wiki/Docs:ModSSI)

Secondly, because of the way FastCGI works, running web applications with lighttpd requires additional configuration, particularly for users who are writing applications using interpreters embedded in the web server (eg. mod\_perl, mod\_python, mod\_php, etc.). This is especially true for [effective optimizations](http://redmine.lighttpd.net/projects/lighttpd/wiki/Docs:PerformanceFastCGI).

## Additional Ubuntu Configuration

The default configuration for Ubuntu (in addition to `/etc/lighttpd/lighttpd.conf`) automatically includes all of the files in the `/etc/lighttpd/conf-enabled/` directory with the `.conf` extension. Typically, these files are symbolically linked from the `/etc/lighttpd/conf-available/` directory by the `lighttpd-enable-mod`. You can add specific configuration directives for required modules in these files, or in the master `lighttpd.conf` file, depending on your needs and personal preference.
