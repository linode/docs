---
author:
  name: Linode
  email: docs@linode.com
description: 'How to identify and solve common configuration problems encountered when using Apache.'
keywords: ["apache", "webserver", "httpd", "troubleshooting"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/troubleshooting/']
modified: 2017-10-04
modified_by:
  name: Linode
published: 2009-11-06
title: Troubleshooting Common Apache Issues
external_resources:
 - '[Apache documentation](http://httpd.apache.org/docs/)'
 - '[Apache user wiki](http://wiki.apache.org/httpd/)'
---

![Troubleshooting Common Apache Issues](/docs/assets/troubleshooting-common-apache-issues.jpg "Troubleshooting Common Apache Issues")

This article provides troubleshooting guidelines for the [Apache web server](/docs/web-servers/apache/). Apache is a highly customizable tool for serving HTTP traffic. Because it allows for so many different configurations and settings in so many different places, sometimes Apache configuration can befuddle even advanced users.

In this guide, you'll start with some basic troubleshooting steps and then proceed to more advanced techniques that can help you untangle conflicting directives. We recommend starting at the beginning of this guide and going through it in order. By the time you're done, you should be able to debug your Apache installation.

## Is Apache Running?

First, check whether Apache is running. Follow the process in this [Troubleshooting Guide](/docs/troubleshooting/troubleshooting/#is-the-web-server-running).

If it isn't, go ahead and restart Apache, as explained in the next section.

You may also want to investigate the possibility of [memory issues](/docs/troubleshooting/troubleshooting-memory-and-networking-issues#diagnosing-and-fixing-memory-issues), if Apache is stopping unexpectedly.

## Restart Apache

Even if Apache is running, it can be useful to restart the server. This will let you read the Apache startup message. If you get an error, you can use the text of the error in an online search to help you find more details and solutions. Restarting the server may produce several seconds of downtime.

Debian and Ubuntu:

    sudo service apache2 restart

Fedora and CentOS:

    sudo service httpd restart

 {{< note >}}
You can use one of the following three commands instead, depending on your Linux distribution:

/etc/init.d/httpd restart

/etc/init.d/apache2 restart

/etc/rc.d/httpd restart
{{< /note >}}

## Reload Apache

Restarting or reloading Apache is also useful if you've recently made changes to your server, but they don't seem to be taking effect. This is true for changes made directly in the Apache configuration files, as well as for changes you've made to the configuration for a dynamic language like `mod_python`, `mod_rails` (for example, Phusion Passenger, or `mod_rack`), `mod_ruby`, etc. These interfaces cache code internally, and do not reread scripts on new requests.

Reloading makes Apache reread its configuration files and incorporate the changes without a full restart, which avoids web server downtime. To reload Apache's configuration, run the following command:

Debian and Ubuntu:

    /etc/init.d/apache2 reload

Fedora and CentOS:

    /etc/init.d/httpd reload

## Check the Logs

The best place to check for Apache errors is the Apache error logs. To view the error logs, we recommend using the `tail` command with the `-f` flag, which shows you the most recent part of the log live as it's updated. Example:

    tail -f /var/log/apache2/error.log

Type **CTRL-C** to exit the live log.

The default error log locations are:

**Debian and Ubuntu:** `/var/log/apache2/error.log`

**Fedora and CentOS:** `/var/log/httpd/error_log`

The access logs can also help you find specific information about visitors to your server. The default access log locations are:

**Debian and Ubuntu:** `/var/log/apache2/access.log`

**Fedora and CentOS:** `/var/log/httpd/access_log`

## Enable Verbose Logs

Sometimes it can be helpful to see extra information from Apache. You can increase the amount of detail shown in the logs by changing the *log level*.

1.  Open your Apache configuration file for editing. The Fedora and CentOS configuration file should be located at `/etc/httpd/httpd.conf`. This example shows the location of the Debian and Ubuntu configuration file:

        sudo nano /etc/apache2/apache2.conf

2.  Locate the `LogLevel` variable, and update it from the default `warn` to `info` or `debug`. `debug` will produce the greatest amount of output.

    {{< file-excerpt "/etc/apache2/apache2.conf" >}}
# LogLevel: Control the number of messages logged to the error_log.
# Possible values include: debug, info, notice, warn, error, crit,
# alert, emerg.
#
LogLevel debug

{{< /file-excerpt >}}


3.  Restart Apache:

        sudo service apache2 restart

4.  Perform the operation that was giving you trouble, then [check the logs](#check-the-logs) for more detailed information and errors.

 {{< caution >}}
Remember to set the `LogLevel` back to `warn` when you're done troubleshooting, or your server may fill up with logs.
{{< /caution >}}

## Check Apache Configuration Syntax

Apache includes a nice little syntax checking tool. Use it to make sure you aren't missing any brackets in your configuration files (and similar problems).

Debian and Ubuntu:

    apache2ctl -t

Fedora and CentOS:

    httpd -t

## Check Virtual Host Definitions

Another helpful Apache tool lets you see all the virtual hosts on the server, their options, and the file names and line numbers of where they are defined. This will help you inventory all the domains that are configured on your host. It will also help you locate the correct file where you should update the configuration details for a domain, if you're not quite sure where you originally put them.

Debian and Ubuntu:

    apache2ctl -S

Fedora and CentOS:

    httpd -S

Make sure all your `<VirtualHost>` directives use IP addresses and port numbers that match the ones defined in the `NameVirtualHost` directives. For example, if you have set `NameVirtualHosts *:80`, then the virtual host configuration should begin with `<VirtualHost *:80>`. If you've set `NameVirtualHosts 123.234.123.234:80`, then the virtual host configuration should begin with `<VirtualHost 123.234.123.234:80>`. If you've set `NameVirtualHosts *`, then the virtual host configuration should begin with `<VirtualHost *>`.

 {{< note >}}
You can have multiple `NameVirtualHost` values, which is what you'll need to do if you're running sites on multiple IPs and ports. Just make sure the `<VirtualHost>` configurations correspond to the configured `NameVirtualHost` directives.
{{< /note >}}

## Troubleshoot Conflicting Directives

If you've modified a configuration option, and you're still not seeing it take effect even after [reloading the server configuration](#restart-apache), it's possible that the new option may have been overridden by a conflicting directive. The main point to remember is that later directives override conflicting earlier ones. So, the directive that is read the *latest* will always be the one that takes effect.

These points should help clarify the order in which directives are read:

-   Remember that *included files* are read at the point of their inclusion, before the rest of the original file is read.
-   `<Directory>` settings are read whenever the server starts or is reloaded. `.htaccess` files, on the other hand, are read before resources are served. As a result, `.htaccess` files can override directory configurations. To test whether this is occurring, temporarily disable `.htaccess` files.
-   `<Location>` directives are read after `<Directory>` and `<Files>` sections, so settings here might override other earlier settings.
-   Configuration files are read serially. For example, an option set in the beginning of the `apache2.conf` or `httpd.conf` file could be overridden by a setting in the `conf.d/` file or a virtual host file.
-   When an entire directory is included, the files from that directory are included sequentially (alphabetically) based on name.
-   Debian and Ubuntu systems have a file called `/etc/apache2/ports.conf`, where the `NameVirtualHost` and `Listen` directives are set. These values determine the IP address or addresses to which Apache binds, and on which port(s) the web server listens for HTTP requests. This can sometimes conflict with settings in other files.

## Further Troubleshooting

If you're continuing to have issues with Apache, we encourage you to make contact with the [Linode user community](https://forum.linode.com/). The Apache web server is *very* widely deployed, so you'll find a large number of Linode users (and system administrators in general) with Apache experience. So, dive into the Linode [IRC channel](https://www.linode.com/chat/) and [forums](http://linode.com/forums/)! You'll more than likely find someone who can help you out.

You might want to look at the following Linode guides:

-   A group of guides for various [web frameworks](/docs/frameworks/)
-   General [Apache HTTP server](/docs/web-servers/apache) guides
