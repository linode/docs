---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: Tuning your Apache server to optimize your website.
keywords: 'configuration,apache,web server,resource tuning'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Friday, February 6, 2015
modified_by:
  name: Elle Krout
published: 'Friday, February 6, 2015'
title: Tuning Your Apache Server
external_resources:
 - '[Apache Performance Tuning](http://httpd.apache.org/docs/2.2/misc/perf-tuning.html)'
 - '[Apache MPM Common Directives](http://httpd.apache.org/docs/2.2/mod/mpm_common.html)'
 - '[Apache 2.4 Documentation](http://httpd.apache.org/docs/2.4/)' 
---

Your Apache server can take up much of your server's resources, depending on the amount of processes and threads it is using. How Apache is configured also affects the amount of clients Apache can serve and a poor configuation can ultimately hog your system's memory.

##Tools

There are a variety of tools that can assist in determining if you need to alter resource settings, including the `top` command and Siege, which you can learn about in [Using top to Monitor Server Performance](/docs/uptime/monitoring/top-htop-iotop) and [Load Testing Web Servers with Siege](/docs/tools-reference/tools/load-testing-with-siege). Knowing commands for your memory and CPU usage can also approve helpful:

Memory usage as percentage:

	echo [PID]  [MEM]  [PATH] &&  ps aux | awk '{print $2, $4, $11}' | sort -k2rn | head -n 20

CPU usage as percentage:

	ps -eo pcpu,pid,user,args | sort -k 1 -r | head -20

More specific resources for resource tuning Apache includes Apache mod_status and ApacheBuddy.

###Apache mod_status

Apache's mod_status module allows you to access information related to the connections being made to Apache by generating a detailed status page. You can view an example server status page at [Apache's own website](http://www.apache.org/server-status).

1.  Open your website's Apache configuration file. This file will be located at `/etc/apache2/sites-available/example.com.conf` on Debian/Ubuntu systems or `/etc/httpd/conf.d/vhost.conf` on CentOS/Fedora systems.

2.  Add the following to your `<virtual_hosts>` block:

	{: .file-excerpt}
	/etc/apache2/sites-available/example.com.conf
	/etc/httpd/conf.d/vhost.conf
	:	~~~
		<Location /server-status>
	      SetHandler server-status
	      Order Deny,Allow
	      Deny from all
		  Allow from localhost
		</Location>
		~~~

3.  Apache mod_status also offers an option called **ExtendedStatus** which provided additional information about each request made to Apache. To enable it edit your Apache configuration file:

	{: .file-excerpt}
	/etc/apache2/apache2.conf
	/etc/httpd/confd/httpd.conf
	:	~~~
		ExtendedStatus On
		~~~

	{: .note}
	>
	>Be aware that when enabling ExtendedStatus it will take up system resources.

4.  Restart Apache:

	Debian/Ubuntu:

		service apache2 restart

	CentOS/Fedora:

		/bin/systemctl reload httpd.service

5.  To view the file generated, download Lynx:

	Debian/Ubuntu:

		apt-get install lynx

	Fedora/CentOS:

		yum install lynx

6.  Open the file:

		lynx http://localhost/server-status

##Multi Processing Modules

Apache offers two Multi Processing Modules (three in Apache 2.4) for altering your settings. Selecting the right MPM can improve the speed and stability of your server.

Each module creates child processes, differing primarily in how these handle their threads per process.

###Prefork
The prefork module creates a number of child processes at launch, with each child handling only one thread. These processes deal solely with one thread at a time, making request speed suffer should there be too many concurrent processes happening at once. Should there be too many requests, some will essentially have to wait in line to be acted upon. To handle this, you can increase the numbers of child processes spawned, but be aware that this will the amount of RAM being used. Prefork, however, is the safest module, and should be used when using mods that are not thread safe.


###Worker
The worker module's child process's spawn many threads per process, each thread ready to take on new requests. This allows for a greeater number of concurrent requests to come in, and in turn is easier on the server's RAM usage. Overall, Worker offers higher performance, but is less secure than Prefork and cannot be used with modules that are not thread safe.

###Event
The event module is *only* available on Apache 2.4 and is based off the Worker MPM. Like the Worker, it creates multiple threads per child process, with a thread dedicated to KeepAlive connections that are handed down to child threads once the request has been made. This is good for multiple concurrent connections, especially those that are not all active at the same time but make the occasional request. The event MPM functions the same at worker in the event of SSL connections.

##Module Values

Once you select your MPM, you will need to change the values inside the configuration. These settings are located in the `/etc/apache2/apache2.config` file on Debian/Ubuntu, and the `/etc/httpd/conf/httpd.conf` file on CentOS/Fedora. MPM configuration will look like this:

{: .file-excerpt}
/etc/apache2/apache2.config
/etc/httpd/conf/httpd.config
:	~~~
	<IfModule mpm_prefork_module>
    	StartServers          2
    	MinSpareServers       6
    	MaxSpareServers      12
    	MaxClients           60
    	MaxRequestsPerChild  3000
	</IfModule>
	~~~

For other MPMs replace `<IfModule mpm_prefork_module>` with `<IfModule mpm_worker_module>` or `<IfModule mpm_event_module>` for worker and event, respectively.

The next step altering your Apache server is altering the above settings. To do this, you need to be aware of what each value does, and how best to change it.

Again, it should be noted that the best way to make configuration changes is to make incremental changes and then restart your server to monitor the effects.

####StartServers
The StartServers value indicates the number of child processes created at startup, and is dynamically controlled depending on load. There is often little reason to alter this number, unless your server is restarted frequently and contains a large number of requests that would slow down the server upon reboot.

####MinSpareServers
Sets the minimum number of idle child processes. If there are fewer processes than the MinSpareServer number, more will be created at the rate of one per second on Apache 2.2 or lower. With Apache 2.4, this rate increases exponentially starting with 1 and ending with 32 children spawned per second. The benefit of this value is that when a request comes in it can take an idle thread; should a thread not be available Apache would have to spawn a new child, taking up resources and extending the time it takes for the request to go through. Please note that too many idle processes would also have an adverse effect on the server.

####MaxSpareServers
Sets the maximum number of idle child processes. If there are more idle processes than this number than they will be killed off. Unless you run a budy website, this number should not be set too high, since even idle processes consume resources.

####MaxClients
The maximum amount of requests that can be served simultaneously, with any number going past the limit being queued. If this is set too low, connections sent to queue will eventually time-out. However, if set too low it will cause the memory to start swapping. If this value is increased past 256, the ServerLimit value must also be increased.

One way to calculate the best value for this is to divife the amount of RAM each Apache process uses by the amount of RAM available, leaving some room for other processes.

To determine the RAM each Apache process uses you can run, replacing `httpd` with `apache2` on Debian or Ubuntu systems.:

	ps -ylC httpd --sort:rss

Divide the number by 1024 if you need it in Megabytes.

For memory information you can use:

	free -m

If you would rather a fuller view of the resources Apache is using, you can use the `top` command.

###MaxRequestsPerChild

This limits the number of requests a child server will handle during its life. Once the limit has been hit, the child server will die. If set to 0, the child servers are set to never expire, but setting this (normally to a few thousand) can help prevent memory leakage. If this is set too low, it can slow the system down since creating new processes does take resources.

###ServerLimit

If you need to increase your above `256` you will need to increase your `SeverLimit` to match. To do this simply add the `SeverLimit` line to your MPM code:

	ServerLimit          256
