---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: Tuning your Apache server to optimize your website.
keywords: 'configuration,apache,web server,resource tuning'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Friday, February 27, 2015
modified_by:
  name: Elle Krout
published: 'Friday, February 27, 2015'
title: Tuning Your Apache Server
external_resources:
 - '[Apache Performance Tuning](http://httpd.apache.org/docs/2.2/misc/perf-tuning.html)'
 - '[Apache MPM Common Directives](http://httpd.apache.org/docs/2.2/mod/mpm_common.html)'
 - '[Apache 2.4 Documentation](http://httpd.apache.org/docs/2.4/)' 
---

Apache configuration has a major affect on your Linode's performance. The easiest way to increase server performance is to turn off unneeded modules. This guide covers Apache modules, which modules to use or disable, and other Apache performance tuning options.

{: .note}
>
>The steps in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Tools

There are a variety of tools that can assist in determining if you need to alter resource settings, including the [*top* command](/docs/uptime/monitoring/top-htop-iotop) and the load-testing program [Siege](/docs/tools-reference/tools/load-testing-with-siege). Linode's own [Longview](/docs/platform/longview/longview) service can also help in server monitoring. At minimum, familiarize yourself with the RAM and CPU usage of your server. Discover usage statistics with these commands:

	echo [PID]  [MEM]  [PATH] &&  ps aux | awk '{print $2, $4, $11}' | sort -k2rn | head -n 20
	ps -eo pcpu,pid,user,args | sort -k 1 -r | head -20

For application-specific tools, there's Apache's `mod_status` module, and Apache2Buddy.

### Apache mod_status

Apache `mod_status` displays information about incoming server connections by generating a detailed status page. See Apache's [example status](http://www.apache.org/server-status).

1.  Open your website's configuration file. This file is located at `/etc/apache2/sites-available/example.com.conf` on Debian/Ubuntu systems or `/etc/httpd/conf.d/vhost.conf` on CentOS/Fedora systems.

2.  Add the following to the `<virtual_hosts>` block:

	{: .file-excerpt}
	/etc/apache2/sites-available/example.com.conf (Debian/Ubuntu)
	/etc/httpd/conf.d/vhost.conf (CentOS/Fedora)
	:	~~~
		<Location /server-status>
	      SetHandler server-status
	      Order Deny,Allow
	      Deny from all
		  Allow from localhost
		</Location>
		~~~

3.  Apache `mod_status` also offers an option called **ExtendedStatus**, which provides additional information about each request made to Apache. To enable **ExtendedStatus** edit your Apache configuration file:

	{: .file-excerpt}
	/etc/apache2/apache2.conf (Debian/Ubuntu)
	/etc/httpd/confd/httpd.conf (CentOS/Fedora)
	:	~~~
		ExtendedStatus On
		~~~

	{: .note}
	>
	>Enabling ExtendedStatus consumes additional system resources.

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

The Apache2Buddy script reviews your Apache setup, and makes suggestions based on your Apache process memory and the overall RAM available on your system. Although it is a fairly basic program, focusing on the `MaxClients` directive, Apache2Buddy is useful for optimization. You can run Apache2Buddy with this command:

	curl -L http://apache2buddy.pl/ | perl

## Multi Processing Modules

Multi processing modules, or *MPMs*, are Apache modules that handle the creation of child processes on startup. Child processes are responsible for the handling of [threads](https://en.wikipedia.org/wiki/Thread_(computing), which affect your server's ability to handle requests.

Apache offers two main MPMs: **Prefork** and **Worker**. for managing your settings. With Apache version 2.4, a third 

{: .note}
>
>Before making any changes to your Apache configuration, be sure to back up the configuration file:
>
>On Debian/Ubuntu:
>
>	cp /etc/apache2/apache2.config ~/apache2.conf.backup
>
>On CentOS/Fedora:
>
>	cp /etc/httpd/conf/httpd.config ~/httpd.conf.backup

### Prefork

The prefork module creates many child Apache processes, and each child handles one thread. Because each process handles a single thread, they can only handle one request at a time. If too many concurrent requests are made, some will have to wait to be acted on, and some clients' response times will suffer. If this happens, you can increase the number of child processes by changing your `StartServers` value, but be aware that this will increase your RAM usage. 

Prefork is generally considered the safest MPM, and is the best choice when using non-thread safe modules, such as `mod_php`.

### Worker

The worker module spawns multi-threaded child processes, meaning each child process can handle multiple requests. This allows your server to handle a greater number of concurrent requests with less RAM. The worker module offers high performance, but is less secure than prefork, and is incompatible with non-thread safe modules.

Worker is a good choice when you're running a high-traffic server on an Apache version before 2.4.

### Event

The event module is only available in Apache 2.4, and is based on the worker module. Like the worker, the event MPM spawns multi-threaded child processes with a thread dedicated to KeepAlive connections. These connections are handed to child threads once a request has been made. This works well with multiple concurrent connections that are not active at the same time, that make occasional requests. For SSL connections, the event MPM functions in the same way as the worker.

Event is a good choice when you need to minimize resource consumption on Apache 2.4.

## Module Values

Once you select your MPM, you will need to change the values inside the configuration. These settings are located in the `/etc/apache2/apache2.conf` file on Debian/Ubuntu, and the `/etc/httpd/conf/httpd.conf` file on CentOS/Fedora. The MPM looks like this:

{: .file-excerpt}
/etc/apache2/apache2.conf (Debian/Ubuntu)
/etc/httpd/conf/httpd.conf (CentOS/Fedora)
:	~~~
	<IfModule mpm_prefork_module>
    	StartServers          4
    	MinSpareServers       20
    	MaxSpareServers      40
    	MaxClients           200
    	MaxRequestsPerChild  4500
	</IfModule>
	~~~

For other MPMs replace `<IfModule mpm_prefork_module>` with `<IfModule mpm_worker_module>` or `<IfModule mpm_event_module>` for worker and event, respectively.

The next step toward optimizing your Apache server is to alter the above settings as needed. To do this, you need to be aware of what each value does, and how best to change it.

Again, the best way to make configuration changes is to make incremental changes and then monitor the effects.

{: .note}
>
>After making alterations to the Apache configuration, restart the service using `service apache restart` on Debian/Ubuntu or `/bin/systemctl reload httpd.service` on CentOS/Fedora.

#### StartServers

The `StartServers` value indicates the number of child processes created at startup, and is dynamically controlled depending on load. There is often little reason to alter this number, unless your server is restarted frequently and contains a large number of requests upon reboot.

#### MinSpareServers

Sets the minimum number of idle child processes. If there are fewer processes than the `MinSpareServer` number, more processes are created at the rate of one per second on Apache 2.2 or lower. With Apache 2.4, this rate increases exponentially starting with 1 and ending with 32 children spawned per second. The benefit of this value is that when a request comes in it can take an idle thread; should a thread not be available, Apache would have to spawn a new child, taking up resources and extending the time it takes for the request to go through. Note, too many idle processes would also have an adverse effect on the server.

#### MaxSpareServers

Sets the maximum number of idle child processes. If there are more idle processes than this number, then they are terminated. Unless your website is extremely busy, this number should not be set too high, since even idle processes consume resources.

#### MaxClients

The maximum amount of requests that can be served simultaneously, with any number going past the limit being queued. If this is set too low, connections sent to queue eventually time-out; however, if set too high, it causes the memory to start swapping. If this value is increased past 256, the `ServerLimit` value must also be increased.

One way to calculate the best value for this is to divide the amount of RAM each Apache process uses by the amount of RAM available, leaving some room for other processes. Use [ApacheBuddy](#apachebuddy) to help determine these values, or the commands below.

To determine the RAM each Apache process uses, replace `httpd` with `apache2` on Debian or Ubuntu systems:

	ps -ylC httpd --sort:rss

Divide the number by 2048 for megabytes.

To get information on memory usage:

	free -m

To receive a comprehensive view of the resources Apache is using, use the `top` command.

#### MaxRequestsPerChild

This limits the number of requests a child server handles during its life. Once the limit has been hit, the child server dies. If set to 0, the child servers are set to never expire. The suggested value for this is a few thousand, to prevent memory leakage. Be aware that setting this too low can slow down the system, since creating new processes does take up resources.

#### ServerLimit

If you need to increase the `MaxClients` above `256`, then increase your `ServerLimit` to match. To do this, add the `ServerLimit` line to your MPM code and alter the value:

	ServerLimit          256

#### KeepAlive

The `KeepAlive` directive, when set to `on` allows for multiple requests to come from the same TCP connection. When a KeepAlive connection is used, it counts as only one request against the `MaxRequestsPerChild` directive. This value is kept outside of your MPM, but can tie in closely to your MPM choices.
