---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Keep track of vital system statistics and troubleshoot performance problems with Munin on Debian 5 (Lenny).'
keywords: 'munin,monitoring'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['server-monitoring/munin/debian-5-lenny/']
modified: Monday, October 8th, 2012
modified_by:
  name: Linode
published: 'Thursday, January 7th, 2010'
expiryDate: 2013-10-08
title: 'Monitoring Servers with Munin on Debian 5 (Lenny)'
---



The Linode Manager provides some basic monitoring of system resource utilization, which includes information regarding Network, CPU, and Input/Output usage over the last 24 hours and 30 days. While this basic information is helpful for monitoring your system, there are cases where more fine-grained information is useful. For instance, if you need to monitor memory usage or resource consumption on a per-process level, a more precise monitoring tool like Munin might be helpful.

Munin is a system and network monitoring tool that uses RRDTool to generate useful visualizations of resource usage. The primary goal of the Munin project is to provide an easy to use tool that is simple to install and configure and provides information in an accessible web based interface. Munin also makes it possible to monitor multiple "nodes" with a single installation.

Before installing Munin, we assume that you have followed our [getting started](/docs/getting-started/) guide. If you're new to Linux server administration you may be interested in our [using Linux](/docs/tools-reference/introduction-to-linux-concepts) document series, including the [beginner's guide](/docs/platform/linode-beginners-guide/) and [administration basics guide](/docs/tools-reference/linux-system-administration-basics/). Additionally, you'll need to install a web server such as [Apache](/docs/web-servers/apache/installation/debian-5-lenny) in order to use the web interface.

Installing Munin
----------------

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

The Munin system has two components: a master component often referred to as simply "munin," and a "node" component, or "munin-node," which collects the data and forwards it to the master node. The munin-node is installed as a dependency of the `munin` package. If you are only monitoring one system, you only need to install the `munin` package. To install this package, issue the following command:

    apt-get install munin

On all of the additional machines you administer that you would like to monitor with Munin, issue the following command:

    apt-get install munin-node

The machines that you wish to monitor with Munin do not need to run Debian. The Munin project supports monitoring for a large number of operating systems: consult the Munin project's [installation guide](http://munin-monitoring.org/wiki/MuninInstallationLinux) for more information installing nodes on additional operating systems.

Configuring Munin
-----------------

### Munin Master Configuration

The master configuration file for Munin is `/etc/munin/munin.conf`. This file is used to set the global directives used by Munin, as well as the hosts monitored by Munin. This file is large, so we've opted to show the key parts of the file. For the most part, the default configuration will be suitable to your needs.

The first section of the file contains the paths to the directories used by Munin. When configuring your web server with Munin, make sure to point the root folder to the path of `htmldir`.

{: .file-excerpt }
/etc/munin/munin.conf

> \# Configfile for Munin master dbdir /var/lib/munin/ htmldir /var/www/munin/ logdir /var/log/munin/ rundir /var/run/munin/

There are additional directives after the directory location block such as `tmpldir`, which shows Munin where to look for HTML templates, and others that allow you to configure mail to be sent when something on the server changes. These additional directives are explained more in depth on the [munin.conf page of the Munin website](http://munin-monitoring.org/wiki/munin.conf). You can also find quick explanations inside the file itself via hash (`#`) comments. Take note that these global directives must be defined prior to defining hosts monitored by Munin. Do not place global directives at the bottom of the `munin.conf` file.

The last section of the `munin.conf` file defines the hosts Munin retrieves information from. For a default configuration, adding a host can be done in the form shown below:

{: .file }
/etc/munin/munin.conf

> [example.com]
> :   address example.com
>
For more complex configurations, including grouping domains, see the comment section in the file, reproduced below for your convenience:

{: .file }
/etc/munin/munin.conf

> \# From and including the first host, no more global directives can be defined. \# Everything after one host definition belongs to that host, until another host definition is found.
>
> [foo.example.com] \# Defines the group "example.com" and then
> :   \# "foo.example.com" under that group.
>
> > address localhost \# The address (IP or host name) of the host, where munin-node is running.
>
> [example.com;bar.example.com] \# Same as above, but with an explicit definition.
> :   \# of the host's group.
>
> address bar.example.com \# The address.
> :   df.contacts no \# Don't warn Nagios (or whatever) if the 'df' plugin exceed warning values.
>
> [Groupname;baz.example.com] \# Associates the host baz.example.com to this group
> :   address baz.example.com \# The address of the host, where munin-node is running. update no \# Specifies that no services on this host should be updated by munin-update
>
### Munin Node Configuration

The default `/etc/munin/munin-node.conf` file contains several variables you'll want to adjust to your preference. For a basic configuration, you'll only need to add the IP address of the master Munin server as a regular expression. Simply follow the style of the existing `allow` line if you're unfamiliar with regular expressions.

{: .file }
/etc/munin/munin-node.conf

> \# A list of addresses that are allowed to connect. This must be a \# regular expression, due to brain damage in Net::Server, which \# doesn't understand CIDR-style network notation. You may repeat \# the allow line as many times as you'd like
>
> allow \^127.0.0.1\$
>
> \# Replace this with the master munin server IP address allow \^123.45.67.89\$

The above line tells the munin-node that the master Munin server is located at IP address `123.45.67.89`. After updating this file, restart the `munin-node`. In Debian, use the following command:

    /etc/init.d/munin-node restart

### Web Interface Configuration

You can use Munin with the web server of your choice, simply point your web server to provide access to resources created by Munin. By default, these resources are located at `/var/www/munin`.

If you are using the [Apache HTTP Server](/docs/web-servers/apache/) you can create a Virtual Host configuration to serve the reports from Munin. In this scenario, we've created a subdomain in the DNS Manager and are now creating the virtual host file:

{: .file }
/etc/apache2/sites-available/stats.example.com
:   ~~~ apache
    <VirtualHost 123.45.67.89:80>
       ServerAdmin webmaster@stats.example.com
       ServerName stats.example.com
       DocumentRoot /var/www/munin
       <Directory />
           Options FollowSymLinks
           AllowOverride None
       </Directory>
       LogLevel notice
       CustomLog /var/log/apache2/access.log combined
       ErrorLog /var/log/apache2/error.log
       ServerSignature On
    </VirtualHost>
    ~~~

If you use this configuration you will want to issue the following commands to ensure that all required directories exist, and that your site is enabled:

    a2ensite stats.example.com

Now restart the server so that the changes to your configuration file can take effect. Issue the following command:

    /etc/init.d/apache2 restart

In most cases you will probably want to prevent the data generated by Munin from becoming publicly accessible. You can either limit access using [rule based access control](/docs/web-servers/apache/configuration/rule-based-access-control) so that only a specified list of IPs will be permitted access, or you can configure [HTTP Authentication](/docs/web-servers/apache/configuration/http-authentication) to require a password before permitting access. In addition to protecting the `stats.` virtual host, also ensure that the munin controls are also protected on the default virtual host (e.g. by visiting `http://12.34.56.78/munin/` where `12.34.56.78` is the IP address of your server.)

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Munin Homepage](http://munin-monitoring.org/)
- [Munin Exchange](https://github.com/munin-monitoring/contrib//)
- [Installing Munin on Other Linux Distributions](http://munin-monitoring.org/wiki/MuninInstallationLinux)
- [Installing Munin on Mac OSX](http://munin-monitoring.org/wiki/MuninInstallationDarwin)
- [Installing Munin on Solaris](http://munin-monitoring.org/wiki/MuninInstallationSolaris)



