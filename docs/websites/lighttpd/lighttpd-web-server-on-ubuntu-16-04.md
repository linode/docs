---
author:
  name: Dave Messina
  email: docs@linode.com
description: 'Using lighttpd to host multiple websites on Ubuntu 16.04 (Xenial Xerus)'
keywords: 'lighttpd,web server,web hosting'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-servers/lighttpd/ubuntu-16-04/']
modified: Friday, April 1st, 2016
modified_by:
  name: Phil Zona
published: 'Friday, April 1st, 2016'
title: 'lighttpd Web Server on Ubuntu 16.04 (Xenial Xerus)'
external_resources:
 - '[Optimizing FastCGI Performance (lighttpd wiki)](http://redmine.lighttpd.net/projects/lighttpd/wiki/Docs:PerformanceFastCGI)'
 - '[mod_fastcgi Documentation (lighttpd wiki)](http://redmine.lighttpd.net/projects/lighttpd/wiki/Docs:ModFastCGI)'
 - '[HowtoForge Guides for lighttpd (howtoforge.com)](http://www.howtoforge.com/howtos/lighttpd)'
 - '[NixCraft Guides for Ligttpd (nixcraft)](http://www.cyberciti.biz/tips/category/lighttpd)'
---

This tutorial explains how to install and configure the lighttpd ("lighty") web server on Ubuntu 16.04 (Xenial Xerus). Lighttpd is designed to provide a lightweight web server that is capable of serving large loads and using less memory than servers like the Apache HTTP server. It's commonly deployed on high traffic sites, including YouTube. Lighttpd makes sense for users who find "big" programs like Apache daunting and bloated.

Our example will illustrate the installation of a lighttpd server on an Ubuntu 16.04 system. We assume that you've followed the [getting started guide](/docs/getting-started/) and are running on an updated system. This document does not, however, include instructions for deploying other common services in the web development stack. We recommend you consult additional resources (a few are listed at the end of this tutorial) to deploy the remainder of your web stack.

If you're switching from an alternate web server like Apache, remember to turn Apache off for testing purposes, or configure lighttpd to serve on an alternate port until it's configured properly.

For purposes of this tutorial we'll assume you are logged into an SSH session on your Linode as the root user.

## Install Lighthttpd

Issue the following commands to refresh your system's package database and ensure that you're running the most up to date software:

    apt-get update
    apt-get upgrade --show-upgraded

First, install the server using apt-get:

    apt-get install lighttpd

Once the server is installed we'll want to check to make sure that it's running and is enabled. Visit `http://[your-ip-address]:80` in your browser. If you have set up lighttpd to run on an alternate port for testing, be sure to replace `80` with this port. You'll see a placeholder page for lighttpd that contains some important information. Notably:

-   The configuration file is located at `/etc/lighttpd/lighttpd.conf`, which we will be editing to further configure the server.
-   By default, the "server.document-root" (where all web-accessible files are stored) is located in the `/var/www` directory. You'll be able to indicate another folder later in the process if you would like.
-   Ubuntu provides helper scripts to enable and disable server modules without directly editing the config file: `lighty-enable-mod` and `lighty-disable-mod`

## Configuring Lighttpd

You will want to configure lighttpd to provide only the services that you need. Strictly speaking, none of the configuration options described in this section are *required*, but many of these options may prove useful in your configuration process.

We've provided an example configuration with extensive comments, which might help contextualize this reference and the configuration process.

Begin by entering the command `lighty-enable-mod` at the command prompt. You will be provided with a list of available modules and a list of already enabled modules, as well as a prompt to enable a module. You can exit with **CTRL+C**, or you can enable one of the modules at this point. You may also use `lighty-enable` to activate this prompt.

For a basic compliment of modules, we might begin by enabling SSI (for server-side includes) and authentication modules:

    lighty-enable-mod ssi auth

You may also want to enable the mod_rewrite (rewriting URL requests) and mod_evhost (virtual hosting of domains and subdomains) modules, which you can do by uncommenting the appropriate lines at the beginning of the config file (`/etc/lighttpd/lighttpd.conf`). Some options in this file allow you to:

-   change which TCP port lighttpd runs on by modifying `server.port`.
-   specify which network devices (statically configured IP addresses) you want the server to listen for new connection on. If you want to run lighttpd for some IP addresses, and another web server for other IP addresses, you can alter the `server.bind` property.
-   configure url rewriting by modifying `url.rewrite` values.

When you've completed your configuration you must reload the configuration with the following command:

    /etc/init.d/lighttpd force-reload

There are many additional modules that are included in separate Ubuntu packages. They can be installed with `apt-get install` and the salient ones are:

-   `lighttpd-mod-mysql-vhost` - Provides an alternate means of managing virtual hosts using a MySQL database, and is good for instances where you need to manage a large number of virtual hosts in a programmatic manner.
-   `lighttpd-mod-webdav` - Provides support for the WebDAV extensions to the HTTP protocol for distributed authoring of HTTP resources.
-   `lighttpd-mod-magnet` - Provides a powerful mechanism for URL rewrites and caching abilities based on the Lua scripting language.

When you have installed these packages you will be able to enable them using `lighty-enable-mod`. For more information regarding installation and configuration of specific modules, consult the [lighttpd documentation](http://redmine.lighttpd.net/projects/lighttpd/wiki/Docs).

Remember to reload lighttpd after you've finished installing, enabling, and configuring new modules.

## Virtual Host Setup with Simple Vhost

### Configure Simple Vhost Module

This section covers configuration for simple virtual hosting. Ensure that all other virtual hosting modules are turned off before proceeding. 

The mod_simple_virtual hosts allows you to quickly set up virtual hosts with respective document roots in folders named for the domains, below a server root.

Begin by enabling `simple-vhost` with the following command:

    lighty-enable-mod simple-vhost

Continue by reloading lighttpd:

    /etc/init.d/lighttpd force-reload

Modify the following settings in your `/etc/lighttpd/conf-enabled/10-simple-vhost.conf` file:

{: .file-excerpt }
/etc/lighttpd/conf-enabled/10-simple-vhost.conf
:   ~~~ lighty
    simple-vhost.server-root = "/var/www" 
    simple-vhost.document-root = "/htdocs/" 
    # simple-vhost.default-host = "www.example.com" 
    ~~~
The `server-root` defines the base directory under which all virtual host directories are created.

The `default-host` specifies which host name will be directed to the default site. For optimal operation, you should not set this value.

The `document-root` defines the subdirectory under the `default-host` directory that contains the pages to be served. This is comparable to the `public_html/` directory you may be familiar with from some Apache configurations, and is called `htdocs/` in the above configuration.

In this configuration, lighttpd will look for directories in `/var/www` that correspond to domain and subdomain requests and serve results from those directories. If lighttpd receives a request and cannot find a directory it serves content from the `default-host` directory.

After editing this file reload the web server again with the following command:

    /etc/init.d/lighttpd force-reload

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

Begin by adding the mod_evhost module in the `server.modules` block of the `/etc/lighttpd/lighttpd.conf` file.

To accomplish the same directory structure with `evhost` as with the `simple-vhost`, we need to insert the following statement into `lighttpd.conf`:

{: .file-excerpt }
lighttpd.conf
:   ~~~ lighty
    evhost.path-pattern = "/var/www/%0/htdocs/"
    ~~~

You have maximum flexibility to create virtual hosts in this manner. The naming convention for these virtual hosts is derived from the domain names, given the following (fictitious) web address: `http://lookhere.somesubdomain.example.com/`

You can modify the url format lighttpd recognizes by defining the pattern that gets passed through to the directory from which the content lives.

{: .file-excerpt }
lighttpd.conf
:   ~~~ lighty
    # define a pattern for the host url finding
    # %% => % sign
    # %0 => domain name + tld
    # %1 => tld
    # %2 => domain name without tld
    # %3 => subdomain 1 name
    # %4 => subdomain 2 name
    #
    # evhost.path-pattern = "/home/storage/dev/www/%3/htdocs/"
    ~~~

We read domain names backwards, so `com` is the tld or "top level domain", `example` is the domain, `somesubdomain` is the subdomain 1 name, and `lookhere` is the subdomain 2 name. These can be combined using the above syntax to create a virtual hosting scheme that makes sense for your use case.

## Virtual Hosting Best Practices

The way you set up virtual hosting on your web server is dependent upon what kind of sites you need to host, their traffic, the number of domains, and the workflows associated with these domains. We recommend hosting all of your domains in a centralized top level directory (eg. `/var/www/` or `/srv/www`) and then symbolically linking these directories into more useful locations.

For instance, you can create a series of "web editor" user accounts. You may then link the document root of each domain into a folder in the home folder of the account of the editor for that domain. For the user account "example-user" that manages the "example.com" site, the link would be created like so:

    ln -s /home/example-user/example.com/ /var/www/example.com

You can also use symbolic links to cause multiple virtually hosted domains to host the same files. For example, to get example.org to point to example.com's files, create the following link:

    ln -s /var/www/example.org/ /var/www/example.com

No matter what you decide, we recommend developing some sort of systematic method for organizing virtual hosting so that you don't becomes confused down the road when you need to modify your system.

## Running Scripts with mod_fastcgi

If you need your web server to execute dynamic content, the preferred way to accomplish this with lighttpd is to run these scripts using FastCGI. To run a script, FastCGI externalizes the interpreter for the script for dynamic web applications from the web server rather than running the scripts "inside" the web server. This is in contrast to the common Apache-based approaches such as mod_perl, mod_python, and mod_php. If you're familar with Apache this might seem antiquated, but in high-traffic situations doing things this way is often more efficient and effective.

To set up FastCGI you need to make sure that an interpreter is installed on your system that is capable of running your scripts. Perl version 5.22.1 is included in Ubuntu 16.04 by default. Issue one of the following commands:

    # to install Python
        apt-get install python

    # to install Ruby
        apt-get install ruby

    # to install PHP version 7 for CGI interfaces
        apt-get install php-cgi

You may need to install and set up a database system as well, depending on the software you intend to run.

Lighttpd will send CGI requests to CGI handlers on the basis of file extensions, and every file extension can be forwarded to an individual handler. You may also forward requests for one extension to multiple servers, and lighttpd will automatically load balance these FastCGI connections.

If you install the php-cgi package and enable mod_fastcgi with `lighty-enable-mod fastcgi` then a default FastCGI handler will be configured in the file `/etc/lighttpd/conf-enabled/10-fastcgi.conf`. Though the handler will likely require specific customization, the default serves as an effective example:

{: .file-excerpt }
/etc/lighttpd/conf-enabled/10-fastcgi.conf
:   ~~~ lighty
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
    ~~~

You can map more than one file extension to a single FastCGI handler by adding the following entry to your config file:

{: .file-excerpt }
/etc/lighttpd/conf-enabled/10-fastcgi.conf
:   ~~~ lighty
    fastcgi.map-extensions = ( ".[ALT-EXTENSION]" => ".[EXTENSION]" )
    ~~~

## Lighttpd Caveats

While lighttpd is an effective and capable web server there are two caveats regarding its behavior that you should be familiar with.

First, server side includes, which allow you to dynamically include content from one file into another, do not function in lighttpd in the same way that they function in Apache's mod_ssi. While it is an effective method for quickly assembling content, lighttpd's script handling via SSI is not a recommended work flow. [See lighttpd project documentation on mod_ssi](http://redmine.lighttpd.net/projects/lighttpd/wiki/Docs:ModSSI)

Second, because of the way FastCGI works, running web applications with lighttpd requires additional configuration, particularly for users who are writing applications using interpreters embedded in the web server (eg. mod_perl, mod_python, mod_php, etc.). This is especially true for [effective optimizations](http://redmine.lighttpd.net/projects/lighttpd/wiki/Docs:PerformanceFastCGI).

## Additional Ubuntu Configuration

The default configuration for Ubuntu (in addition to `/etc/lighttpd/lighttpd.conf`) automatically includes all of the files in the `/etc/lighttpd/conf-enabled/` directory with the `.conf` extension. Typically, these files are symbolically linked from the `/etc/lighttpd/conf-available/` directory by the `lighttpd-enable-mod`. You can add specific configuration directives for required modules in these files, or in the master `lighttpd.conf` file, depending on your needs.