---
author:
  name: Dave Messina
  email: docs@linode.com
description: 'Use lighttpd to Host Multiple Websites on Ubuntu 16.04 (Xenial Xerus)'
keywords: ["lighttpd", "web server", "web hosting"]
aliases: ['websites/lighttpd/lighttpd-web-server-on-ubuntu-16-04/','websites/lighttpd/use-lighttpd-web-server-on-ubuntu-16-04/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2016-05-19
modified_by:
  name: Phil Zona
published: 2016-05-19
title: 'Use lighttpd Web Server on Ubuntu 16.04 (Xenial Xerus)'
external_resources:
 - '[Optimizing FastCGI Performance (lighttpd wiki)](http://redmine.lighttpd.net/projects/lighttpd/wiki/Docs:PerformanceFastCGI)'
 - '[mod_fastcgi Documentation (lighttpd wiki)](http://redmine.lighttpd.net/projects/lighttpd/wiki/Docs:ModFastCGI)'
 - '[HowtoForge Guides for lighttpd (howtoforge.com)](http://www.howtoforge.com/howtos/lighttpd)'
 - '[NixCraft Guides for Ligttpd (nixcraft)](http://www.cyberciti.biz/tips/category/lighttpd)'
---

Lighttpd provides a lightweight web server that is capable of serving large loads while using less memory than servers like Apache. It's commonly deployed on high traffic sites, including WhatsApp and xkcd.

This guide explains how to install and configure the lighttpd ("lighty") web server on Ubuntu 16.04 (Xenial Xerus). Consult the resources at the end for more information about deploying other services commonly found in web server stacks.

![Use lighttpd Web Server on Ubuntu 16.04](/docs/assets/using_lighttpd_web_server_on_ubuntu_1604_xenial_xerus.png "Use lighttpd Web Server on Ubuntu 16.04")

## Before You Begin

1.  Familiarize yourself with and complete the [Getting Started Guide](/docs/getting-started/), setting your Linode's hostname and timezone.

2.  Lighttpd is a network-facing service and failing to secure your server may expose you to vulnerabilities. Consult the [Securing Your Server Guide](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  If you're switching from a different web server like Apache, remember to turn off the other server for testing purposes, or [configure lighttpd](#configure-lighttpd) to use an alternate port until it's configured properly.

4.  Update your system:

        apt-get update && apt-get upgrade

{{< note >}}
The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups guide](/docs/tools-reference/linux-users-and-groups).
{{< /note >}}

## Install Lighttpd

Install the server from the Ubuntu package repository:

    apt-get install lighttpd

Once the server is installed, make sure that it's running and is enabled. Visit `http://198.51.100.10:80` in your browser, replacing `198.51.100.10` with your Linode's IP address. If you configured lighttpd to run on an alternate port for testing, be sure to replace `80` with this port. You'll see a placeholder page for lighttpd that contains some important information:

-   Configuration files are located in `/etc/lighttpd`.
-   By default, the "DocumentRoot" (where all HTML files are stored) is located in the `/var/www` directory. You'll be able to configure this later.
-   Ubuntu provides helper scripts to enable and disable server modules without directly editing the config file: `lighty-enable-mod` and `lighty-disable-mod`.

## Configure Lighttpd

The main lighttpd configuration file is located at `/etc/lighttpd/lighttpd.conf`. This file provides a list of server modules to be loaded and allows you to change global settings for the web server.

The first directive in the configuration is `server.modules`, which lists modules to be loaded upon starting or reloading the lighttpd server. To disable a module, add a `#` at the beginning of the corresponding line to comment it out. Remove the `#` to enable the module. Modules can also be added to this list. For example, in the default file, you can enable the `mod_rewrite` (rewriting URL requests) module by uncommenting the appropriate line, or add `mod_auth` to enable the authentication module. Note that these modules will be loaded in the order they appear.

Following the `server.modules` block is a list of other settings to configure the server and its modules. Most directives are self-explanatory, but not all available options are listed by default and you may want to add them, depending on your needs. A few performance settings you may want to add yourself include:

-   `server.max-connections` - Specifies how many concurrent connections will be supported
-   `server.max-keep-alive-requests` - Sets the maximum number of requests within a keep alive session before the connection is terminated
-   `server.max-worker` - Specifies the number of worker processes to spawn. If you're familiar with Apache, a worker is analogous to a child process.
-   `server.bind` - Defines the IP address, hostname, or path to the socket lighttpd will listen on. Multiple lines can be created to listen on different IP addresses. The default setting is to bind to all interfaces.

Some settings depend on certain modules. For example, `url.rewrite` requires that `mod_rewrite` be enabled because it is specific to that module. However, for ease of use, most modules have their own configuration files and can be enabled and disabled via command line rather than by editing the configuration file.

### Enable and Disable Modules via Command Line

For ease of use, you may wish to enable and disable modules via the command line. Lighttpd provides a simple method to do this, so the configuration doesn't need to be edited every time a new module is needed.

Run `lighty-enable-mod` from the command line to see a list of available modules and a list of already enabled modules, as well as a prompt to enable a module. This can also be accomplished in one line. For example, to enable the `auth` authentication module:

    lighty-enable-mod auth

This command creates a symbolic link to the module's configuration file in `/etc/lighttpd/conf-enabled`, which is read by a script in the main configuration file. To edit the configuration for a specific module, look for its `.conf` file in `/etc/lighttpd/conf-available`.

There are many additional modules that are included in separate Ubuntu packages. Some useful ones are:

-   `lighttpd-mod-mysql-vhost` - Manages virtual hosts using a MySQL database. This module works well when you need to manage a large number of virtual hosts
-   `lighttpd-mod-webdav` - Supports WebDAV extensions to HTTP for distributed authoring of HTTP resources
-   `lighttpd-mod-magnet` - Controls the request handling module

When you have installed these packages you will be able to enable them using `lighty-enable-mod`.

Restart lighttpd to load changes:

    systemctl restart lighttpd.service

For a comprehensive list of available options and modules, refer to the lighttpd project's documentation on [configuration options](https://redmine.lighttpd.net/projects/lighttpd/wiki/Docs_ConfigurationOptions).

## Virtual Host Setup with Simple Vhost

This section covers configuration for simple virtual hosting. The `simple-vhost` module allows you to set up virtual hosts with respective document roots in user-defined folders named for the domains, below a server root. Ensure that all other virtual hosting modules are turned off before proceeding.

1.  Begin by enabling `simple-vhost`:

        lighty-enable-mod simple-vhost

2.  Restart lighttpd to load your changes:

        systemctl restart lighttpd.service

3.  Modify the following settings in your `/etc/lighttpd/conf-available/10-simple-vhost.conf` file:

    {{< file-excerpt "/etc/lighttpd/conf-available/10-simple-vhost.conf" lighty >}}
simple-vhost.server-root = "/var/www/html"
simple-vhost.document-root = "htdocs"
simple-vhost.default-host = "example.com"

{{< /file-excerpt >}}

    The `server-root` defines the base directory under which all virtual host directories are created.

    The `document-root` defines the subdirectory under the host directory that contains the pages to be served. This is comparable to the `public_html` directory in some Apache configurations, but is called `htdocs` in the above configuration.

    If lighttpd receives a request and cannot find a matching directory, it serves content from the `default-host`.

    In the above configuration, requests are checked against existing directory names within `/var/www/html`. If a directory matching the requested domain exists, the result is served from the corresponding `htdocs`. If it doesn't exist, content is served from `htdocs` within the `default-host` directory.

    To clarify this concept, suppose that `/var/www/html` contains only the directories `exampleA.com` and `example.com`, both of which contain `htdocs` folders with content:

    -   If a request is made for the URL `exampleA.com`, content will be served from `/var/www/html/exampleA.com/htdocs`.
    -   If a request is made for a URL which resolves to the server, but does not have a directory, content will be served from `/var/www/html/example.com/htdocs`, since `example.com` is the default host.

    For subdomains, create host directories for each subdomain in the same way. For instance, to use `exampleSub` as a subdomain of `exampleA.com`, create a directory called `exampleSub.exampleA.com` with a `htdocs` directory for content. Be sure to add [DNS records](https://www.linode.com/docs/networking/dns/dns-manager-overview) for any subdomains you plan to use.

4.  Restart the web server again to reload changes:

        systemctl restart lighttpd.service

For more examples, consult the [lighttpd official documentation](https://redmine.lighttpd.net/projects/lighttpd/wiki/Docs_ModSimpleVhost).

## Virtual Host Setup with Enhanced Vhost

Enhanced virtual hosting works slightly differently than Simple by building the document root based on a pattern containing wildcards. Be sure that all other virtual hosting modules are disabled before beginning.

1.  Run the following command to enable the enhanced virtual hosting module:

        lighty-enable-mod evhost

2.  Restart lighttpd to load the configuration changes:

        systemctl restart lighttpd.service

3.  To accomplish the same directory structure with `evhost` as with `simple-vhost` above, you need to modify the `/etc/lighttpd/conf-available/10-evhost.conf` file:

    {{< file-excerpt "/etc/lighttpd/conf-available/10-evhost.conf" lighty >}}
evhost.path-pattern = "/var/www/html/%0/htdocs/"

{{< /file-excerpt >}}


4.  Modify the `server.document-root` in the main lighttpd configuration file:

    {{< file-excerpt "/etc/lighttpd/lighttpd.conf" lighty >}}
server.document-root = "/var/www/html/example.com/htdocs"

{{< /file-excerpt >}}


    With the configuration you set in Steps 3 and 4, if `example.com` is requested, and `/var/www/html/example.com/htdocs/` is found, that directory becomes the document root when serving requests. The `0%` in the path pattern specifies that a request will be checked against host files named in the format of domain and Top Level Domain (TLD). The `server.document-root` directive specifies a default host that is used when a matching directory does not exist.

    {{< caution >}}
These steps configure `server.document-root` to `/var/www/html`. According to lighttpd documentation, this [may expose your server to a vulnerability](https://redmine.lighttpd.net/projects/lighttpd/wiki/Docs_ModEVhost#A-Bad-Example) in which authentication can be bypassed in certain situations. If improperly configured, this may also redirect unmatched requests to the lighttpd index page rather than the default host of your choosing.
{{< /caution >}}

5.  Restart lighttpd to load the configuration changes:

        systemctl restart lighttpd.service

The naming convention for these virtual hosts is derived from the domain names. Take the following web address as an example: `http://exampleSub2.exampleSub.exampleA.com/` We read domain names from highest level on the right, to lowest on the left. So `com` is the TLD, `exampleA` is the domain, `exampleSub` is the subdomain 1 name, and `exampleSub2` is the subdomain 2 name.

To modify the host directory format lighttpd recognizes, define the pattern that gets passed to the directory in which the content lives. The following table shows what host directory format is used as the document root for each pattern. It also shows which host file will be used to serve content, using the above URL as an example request:

| Pattern | Host Directory Format   | Document Root Path                                     |
| --------|-------------------------|--------------------------------------------------------|
| %0      | Domain name and TLD     | /var/www/html/example.com/htdocs                        |
| %1      | TLD only                | /var/www/html/com/htdocs                               |
| %2      | Domain name without TLD | /var/www/html/example/htdocs                            |
| %3      | Subdomain 1 name        | /var/www/html/exampleSub/htdocs                     |
| %4      | Subdomain 2 name        | /var/www/html/exampleSub2/htdocs                          |
| %_      | Full domain name        | /var/www/html/exampleSub2.exampleSub.example.com/htdocs |

## Create Virtual Host Directories

Whether using `simple-vhost` or `evhost`, you'll need to create directories before lighttpd can use them to serve content. Once the required directives are configured as above, create the required directories, replacing `example.com` with your domain name:

    mkdir -p /var/www/html/example.com/htdocs/

The following command will create two additional virtual hosts for .net and .org top level domains:

    mkdir -p /var/www/html/{example.net/htdocs,example.org/htdocs}

The following command will create two additional virtual hosts for the subdomains from the `evhost` example:

    mkdir -p /var/www/html/{exampleSub/htdocs,exampleSub2/htdocs}

## Virtual Hosting Best Practices

The way you set up virtual hosting on your web server depends upon what kind of sites you host, their traffic, the number of domains, and their workflows. We recommend hosting all of your domains in a centralized directory (e.g., `/var/www/html`) and then symbolically linking these directories into more useful locations.

For instance, you can create a series of "web editor" user accounts. You may then link the document root of each domain into a folder in the home folder of the editor for that domain. For the user account `example-user` that manages the `example.com` site:

    ln -s /home/example-user/example.com/ /var/www/html/example.com

You can also use symbolic links to cause multiple virtually hosted domains to host the same files. For example, to get `example.org` to point to `example.com`'s files, create the following link:

    ln -s /var/www/html/example.org/ /var/www/html/example.com

No matter what you decide, we recommend developing a systematic method for organizing virtual hosting to simplify any modifications to your system.

## Run Scripts with FastCGI

If you need your web server to execute dynamic content, you may run these scripts using FastCGI. To run a script, FastCGI externalizes the interpreter from the web server rather than running the scripts "inside" the web server. This is in contrast to approaches such as `mod_perl`, `mod_python`, and `mod_php`, but in high-traffic situations this way is often more efficient.

To set up FastCGI, make sure that an interpreter is installed on your system for your language of choice:

To install Python:

    apt-get install python

To install Ruby:

    apt-get install ruby

To install PHP 7 for CGI interfaces:

    apt-get install php7.0-cgi

Perl version 5.22.1 is included in Ubuntu 16.04 by default. Depending on the software you intend to run, you may need to install and set up a database system as well.

Lighttpd will send CGI requests to CGI handlers on the basis of file extensions, which can be forwarded to individual handlers. You may also forward requests for one extension to multiple servers and lighttpd will automatically load balance these FastCGI connections.

For example, if you install the `php7.0-cgi` package and enable FastCGI with `lighty-enable-mod fastcgi-php` then a default FastCGI handler will be configured in the file `/etc/lighttpd/conf-enabled/15-fastcgi-php.conf`. Though the handler will likely require specific customization, the default settings offer an effective example:

{{< file-excerpt "/etc/lighttpd/conf-enabled/15-fastcgi-php.conf" lighty >}}
fastcgi.server   += ( ".php" =>
        ((
                "bin-path" => "/usr/bin/php-cgi",
                "socket" => "/var/run/lighttpd/php.socket",
                "max-procs" => 1,
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


To map more than one file extension to a single FastCGI handler, add the following entry to your configuration file:

{{< file-excerpt "/etc/lighttpd/conf-enabled/15-fastcgi-php.conf" lighty >}}
fastcgi.map-extensions = ( ".[ALT-EXTENSION]" => ".[EXTENSION]" )

{{< /file-excerpt >}}


## Things to Keep in Mind

While lighttpd is an effective and capable web server there are two caveats regarding its behavior:

Server side includes, which allow you to dynamically include content from one file in another, do not function in lighttpd in the same way as they do in Apache's `mod_ssi`. While it is an effective method for quickly assembling content, lighttpd's script handling via SSI is not a recommended work flow. See [lighttpd project documentation on mod_ssi](http://redmine.lighttpd.net/projects/lighttpd/wiki/Docs:ModSSI).

Because of the way FastCGI works, running web applications with lighttpd requires additional configuration, particularly for users who are writing applications using interpreters embedded in the web server (e.g., `mod_perl`, `mod_python`, `mod_php`). For more information, consult the [lighttpd project documentation on optimizing FastCGI performance](http://redmine.lighttpd.net/projects/lighttpd/wiki/Docs:PerformanceFastCGI).
