---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: Tuning your Apache server to optimize your website.
keywords: ["configuration", "apache", "web server", "resource tuning"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/apache-tips-and-tricks/tuning-your-apache-server/']
modified: 2017-08-11
modified_by:
  name: AMiller
published: 2015-02-27
title: Tuning Your Apache Server
external_resources:
 - '[Apache Performance Tuning](http://httpd.apache.org/docs/2.2/misc/perf-tuning.html)'
 - '[Apache MPM Common Directives](http://httpd.apache.org/docs/2.2/mod/mpm_common.html)'
 - '[Apache 2.4 Documentation](http://httpd.apache.org/docs/2.4/)'
---

Apache configuration has a major affect on your Linode's performance. The easiest way to increase server performance is to turn off unneeded modules. This guide covers Apache modules, information on which modules to turn off, and other Apache performance tuning options.

![Tuning Your Apache Server](/docs/assets/tuning-your-apache-server.png "Tuning Your Apache Server")

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Tools

There are a variety of tools that can assist in determining if you need to alter resource settings, including the [*top* command](/docs/uptime/monitoring/top-htop-iotop) and the load-testing program [Siege](/docs/tools-reference/tools/load-testing-with-siege). Linode's own [Longview](/docs/platform/longview/longview) service can also help in server monitoring. At minimum, familiarize yourself with the RAM and CPU usage of your server. Discover usage statistics with these commands:

	echo [PID]  [MEM]  [PATH] &&  ps aux | awk '{print $2, $4, $11}' | sort -k2rn | head -n 20
	ps -eo pcpu,pid,user,args | sort -k 1 -r | head -20

More specific resources for resource tuning Apache includes Apache `mod_status` and Apache2Buddy.

### Apache mod_status

Apache `mod_status` diplays information related to incoming server connections by generating a detailed status page. View an example of this page at [Apache's own website](http://www.apache.org/server-status).

1.  Open your website's configuration file. This file is located at `/etc/apache2/sites-available/example.com.conf` on Debian/Ubuntu systems or `/etc/httpd/conf.d/vhost.conf` on CentOS/Fedora systems.

2.  Add the following to the `<virtual_hosts>` block:

	{{< file-excerpt "/etc/apache2/sites-available/example.com.conf (Debian/Ubuntu)" >}}
<Location /server-status>
     SetHandler server-status
     Order Deny,Allow
     Deny from all
  Allow from localhost
</Location>


{{< /file-excerpt >}}


3.  Apache `mod_status` also offers an option called **ExtendedStatus**, which provides additional information about each request made to Apache. To enable **ExtendedStatus** edit your Apache configuration file:

	{{< file-excerpt "/etc/apache2/apache2.conf (Debian/Ubuntu)" >}}
ExtendedStatus On


{{< /file-excerpt >}}


	{{< note >}}
Enabling ExtendedStatus consumes additional system resources.
{{< /note >}}

4.  Restart Apache:

	- 	Debian/Ubuntu:

			systemctl restart apache2

	-	CentOS/Fedora:

			systemctl restart httpd

5.  To view the file generated, download Lynx:

	-	Debian/Ubuntu:

			apt-get install lynx

	- 	Fedora/CentOS:

			yum install lynx

6.  Open the file:

		lynx http://localhost/server-status

### Apache2Buddy

The Apache2Buddy script, similar to MySQLTuner, reviews your Apache setup, and makes suggestions based on your Apache process memory and overall RAM. Although it is a fairly basic program, focusing on the `MaxClients` directive, Apache2Buddy is useful, and can be run through a single command:

	curl -sL https://raw.githubusercontent.com/richardforth/apache2buddy/master/apache2buddy.pl | perl

## Multi Processing Modules

{{< note >}}
Before making any changes to your Apache configuration, be sure to back up the configuration file:

On Debian/Ubuntu:

cp /etc/apache2/apache2.config ~/apache2.conf.backup

On CentOS/Fedora:

cp /etc/httpd/conf/httpd.config ~/httpd.conf.backup
{{< /note >}}

Apache offers two Multi Processing Modules, three if on Apache 2.4, for managing your settings.

Each module creates child processes, differing primarily in how they handle threads.

### Prefork
The prefork module creates a number of child processes at launch, each child handles only one thread. Since these processes deal solely with one thread at a time, making request speed suffer should there be too many concurrent requests. Should this occur, some requests essentially have to wait in line to be acted upon. To handle this, increase the number of child processes spawned, but be aware that this increases the amount of RAM being used. Prefork is the safest module, and should be used when using mods that are not thread safe.


### Worker
The worker module's child processes spawn many threads per process, each thread ready to take on new requests. This allows for a greater number of concurrent requests to come in, and in turn is easier on the server's RAM usage. Overall, the worker module offers higher performance, but is less secure than prefork and cannot be used with modules that are not thread safe.

### Event
The event module is *only* available on Apache 2.4 and is based off the worker MPM. Like the worker, it creates multiple threads per child process, with a thread dedicated to KeepAlive connections that are handed down to child threads once the request has been made. This is good for multiple concurrent connections, especially those that are not all active at the same time but make the occasional request. The event MPM functions the same as worker in the event of SSL connections.

## Module Values

Once you select your MPM, you will need to change the values inside the configuration. These settings are located in the `/etc/apache2/apache2.conf` file on Debian/Ubuntu, and the `/etc/httpd/conf/httpd.conf` file on CentOS/Fedora. The MPM looks like this:

{{< file-excerpt "/etc/apache2/apache2.conf (Debian/Ubuntu)" >}}
<IfModule mpm_prefork_module>
   	StartServers          4
   	MinSpareServers       20
   	MaxSpareServers      40
   	MaxClients           200
   	MaxRequestsPerChild  4500
</IfModule>


{{< /file-excerpt >}}


For other MPMs replace `<IfModule mpm_prefork_module>` with `<IfModule mpm_worker_module>` or `<IfModule mpm_event_module>` for worker and event, respectively.

The next step to reconfiguring your Apache server is altering the above settings. To do this, you need to be aware of what each value does, and how best to change it.

Again, the best way to make configuration changes is to make incremental changes and then monitor the effects.

{{< note >}}
After making alterations to the Apache configuration, restart the service using `service apache restart` on Debian/Ubuntu or `/bin/systemctl reload httpd.service` on CentOS/Fedora.
{{< /note >}}

### StartServers
The `StartServers` value indicates the number of child processes created at startup, and is dynamically controlled depending on load. There is often little reason to alter this number, unless your server is restarted frequently and contains a large number of requests upon reboot.

### MinSpareServers
Sets the minimum number of idle child processes. If there are fewer processes than the `MinSpareServer` number, more processes are created at the rate of one per second on Apache 2.2 or lower. With Apache 2.4, this rate increases exponentially starting with 1 and ending with 32 children spawned per second. The benefit of this value is that when a request comes in it can take an idle thread; should a thread not be available, Apache would have to spawn a new child, taking up resources and extending the time it takes for the request to go through. Note, too many idle processes would also have an adverse effect on the server.

### MaxSpareServers
Sets the maximum number of idle child processes. If there are more idle processes than this number, then they are terminated. Unless your website is extremely busy, this number should not be set too high, since even idle processes consume resources.

### MaxClients
The maximum amount of requests that can be served simultaneously, with any number going past the limit being queued. If this is set too low, connections sent to queue eventually time-out; however, if set too high, it causes the memory to start swapping. If this value is increased past 256, the `ServerLimit` value must also be increased.

One way to calculate the best value for this is to divide the amount of RAM each Apache process uses by the amount of RAM available, leaving some room for other processes. Use [Apache2Buddy](#apache2buddy) to help determine these values, or the commands below.

To determine the RAM each Apache process uses, replace `httpd` with `apache2` on Debian or Ubuntu systems:

	ps -ylC httpd --sort:rss

Divide the number by 2048 for megabytes.

To get information on memory usage:

	free -m

To receive a fuller view of the resources Apache is using, use the `top` command.

### MaxRequestsPerChild

This limits the number of requests a child server handles during its life. Once the limit has been hit, the child server dies. If set to 0, the child servers are set to never expire. The suggested value for this is a few thousand, to prevent memory leakage. Be aware that setting this too low can slow down the system, since creating new processes does take up resources.

### ServerLimit

If you need to increase the `MaxClients` above `256`, then increase your `ServerLimit` to match. To do this, add the `ServerLimit` line to your MPM code and alter the value:

	ServerLimit          256

### KeepAlive

The `KeepAlive` directive, when set to `on` allows for multiple requests to come from the same TCP connection. When a KeepAlive connection is used, it counts as only one request against the `MaxRequestsPerChild` directive. This value is kept outside of your MPM, but can tie in closely to your MPM choices.
