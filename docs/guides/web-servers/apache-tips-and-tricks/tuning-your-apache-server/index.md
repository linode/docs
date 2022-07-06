---
slug: tuning-your-apache-server
author:
  name: Elle Krout
  email: ekrout@linode.com
description: 'This guide provides you with information on tuning the performance and configuration of your Apache web server to optimize the load times of your website.'
keywords: ["configuration", "apache", "web server", "resource tuning"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/websites/apache-tips-and-tricks/tuning-your-apache-server/','/web-servers/apache-tips-and-tricks/tuning-your-apache-server/']
modified: 2019-02-01
modified_by:
  name: Linode
published: 2015-02-27
title: Tuning Your Apache Server
external_resources:
 - '[Apache Performance Tuning](https://httpd.apache.org/docs/2.4/misc/perf-tuning.html)'
 - '[Apache MPM Common Directives](http://httpd.apache.org/docs/2.4/mod/mpm_common.html)'
 - '[Apache 2.4 Documentation](http://httpd.apache.org/docs/2.4/)'
dedicated_cpu_link: true
tags: ["web server","apache"]
---

![Tuning Your Apache Server](tuning-your-apache-server.png "Tuning Your Apache Server")

Your Apache configuration settings have a major effect on your Linode's performance. There are several tools that can be used to further inspect your Apache server's performance and make informed decisions on how to begin tuning your Apache configurations. This guide will provide an overview of some process monitoring and system resource usage tools that can be used to inspect how Apache is affecting your Linode's performance. You will also learn about important Apache modules, like the Multi-Processing modules, that will allow you to make use of Apache's power and flexibility.

## Tools

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

There are a variety of tools that can assist in determining if you need to alter resource settings, including the [*top* command](/docs/guides/top-htop-iotop/) and the load-testing program [Siege](/docs/guides/load-testing-with-siege/). Linode's own [Longview](/docs/guides/what-is-longview/) service can also help with server monitoring. A good place to start is to familiarize yourself with the RAM and CPU usage of your server.

Discover usage statistics with the following variations of the `ps` command. The `ps` command is used to generate a report of the running processes on your Linode:

    echo [PID]  [MEM]  [PATH] &&  ps aux | awk '{print $2, $4, $11}' | sort -k2rn | head -n 20
    ps -eo pcpu,pid,user,args | sort -k 1 -r | head -20

### Apache mod_status

The Apache Status module, `mod_status`, provides performance information about your server in a detailed status page.

1.  Open your website's configuration file. This file is located at `/etc/apache2/sites-available/hostname.example.com.conf` on Debian/Ubuntu systems or `/etc/httpd/conf.d/vhost.conf` on CentOS/Fedora systems.

1.  Add the following to the `<virtual_hosts>` block:

    {{< file "/etc/apache2/sites-available/hostname.example.com.conf (Debian/Ubuntu)" apache >}}
<Location /server-status>
     SetHandler server-status
     Order Deny,Allow
     Deny from all
  Allow from localhost
</Location>
    {{< /file >}}


1.  Apache `mod_status` also offers an option called **ExtendedStatus**, which provides additional information about each request made to Apache. To enable **ExtendedStatus** edit your Apache configuration file and add the following line:

    {{< file "/etc/apache2/apache2.conf (Debian/Ubuntu)" apache >}}
ExtendedStatus On
    {{< /file >}}


    {{< note >}}
Enabling `ExtendedStatus` consumes additional system resources.
{{< /note >}}

1.  Restart Apache:

    -     Debian/Ubuntu:

            systemctl restart apache2

    -    CentOS/Fedora:

            systemctl restart httpd

1.  To view the generated file, download Lynx, a text-mode web browse:

    -    Debian/Ubuntu:

            apt-get install lynx

    -     Fedora/CentOS:

            yum install lynx

1.  Open the file:

        lynx http://localhost/server-status

### Apache2Buddy

The Apache2Buddy script, similar to [MySQLTuner](/docs/guides/how-to-optimize-mysql-performance-using-mysqltuner/), reviews your Apache setup, and makes suggestions based on your Apache process memory and overall RAM. Although it is a fairly basic program, that focuses on the `MaxClients` directive, Apache2Buddy is useful. You can run the script with the following command:

    curl -sL https://raw.githubusercontent.com/richardforth/apache2buddy/master/apache2buddy.pl | sudo perl

## Multi Processing Modules

Apache version 2.4 offers three Multi Processing Modules (MPM) for managing your settings. Each module creates child processes, but differs in how they handle threads.

{{< disclosure-note "Back up your Apache configuration file">}}
Before making any changes to your Apache configuration, be sure to back up the configuration file:

 - On Debian/Ubuntu:

        cp /etc/apache2/apache2.conf ~/apache2.conf.backup

- On CentOS/Fedora:

        cp /etc/httpd/conf/httpd.conf ~/httpd.conf.backup
{{</ disclosure-note >}}

### Prefork
The prefork module creates a number of child processes at launch, each child handles only one thread. Since these processes deal solely with one thread at a time, request speed can suffer should there be too many concurrent requests. When this occurs, some requests essentially have to wait in line to be acted upon. To handle this, you can increase the number of child processes that are spawned, however, this increases the amount of RAM being used. Prefork is the safest module, and should be used when using non-thread-safe libraries.

### Worker
The worker module's child processes spawn many threads per process with each thread ready to take on new requests. This allows for a greater number of concurrent requests to come in, and in turn, is easier on the server's RAM usage. Overall, the worker module offers higher performance, but is less secure than the prefork module and cannot be used with modules that are not thread safe.

### Event
The event module is *only* available on Apache 2.4 and is based off of the worker MPM. Like the worker, it creates multiple threads per child process, with a thread dedicated to KeepAlive connections that are handed down to child threads once the request has been made. This is good for multiple concurrent connections, especially those that are not all active at the same time but make the occasional request. The event MPM functions the same as worker in the event of SSL connections.

## Module Values

Once you select your MPM, you will need to change the values inside the configuration. These settings are located in the `/etc/apache2/apache2.conf` file on Debian/Ubuntu, and the `/etc/httpd/conf/httpd.conf` file on CentOS/Fedora. Below, is an example configuration for the MPM prefork module:

{{< file "/etc/apache2/apache2.conf (Debian/Ubuntu)" apache >}}
<IfModule mpm_prefork_module>
       StartServers              4
       MinSpareServers          20
       MaxSpareServers          40
       MaxRequestWorkers       200
       MaxConnectionsPerChild 4500
</IfModule>
{{< /file >}}

To use the worker or event modules, replace `<IfModule mpm_prefork_module>` with `<IfModule mpm_worker_module>` or `<IfModule mpm_event_module>`, respectively.

Next, you should alter the module settings you added in the previous step. To do this, you should take into consideration what each value does, and how best to change it. It is recommended to make incremental changes to your configuration settings and then monitor the effects.

{{< note >}}
After making alterations to the Apache configuration file, restart the service.

- On Debian/Ubuntu:

        sudo systemctl restart apache2

- On CentOS/Fedora:

        sudo systemctl restart httpd.service
{{< /note >}}

The sections below provide an overview of each MPM module setting.

### StartServers
The `StartServers` value indicates the number of child processes created at startup, and is dynamically controlled depending on load. There is often little reason to alter this number, unless your server is restarted frequently and contains a large number of requests upon reboot.

### MinSpareServers
Sets the minimum number of idle child processes. If there are fewer processes than the `MinSpareServer` number, more processes are created at the rate of one per second on Apache 2.2 or lower. With Apache 2.4, this rate increases exponentially starting with 1 and ending with 32 children spawned per second. The benefit of this value is that when a request comes in it can take an idle thread; should a thread not be available, Apache would have to spawn a new child, taking up resources and extending the time it takes for the request to go through. Note, too many idle processes would also have an adverse effect on the server. Tuning this value should only be necessary on very busy sites. It is not recommended to change this value to a high number.

### MaxSpareServers
This parameter sets the maximum number of idle child processes. If there are more idle processes than this number, then they are terminated. Unless your website is extremely busy, this number should not be set too high, since even idle processes consume resources.

### MaxRequestWorkers
Previously known as `MaxClients` (Apache 2.3.13 or lower), this parameter indicates the maximum amount of requests that can be served simultaneously, with any number going past the limit being queued. The size of the queue is based on the `ListenBacklog` directive. If `MaxRequestWorkers` is set too low, connections sent to the queue eventually time-out; however, if set too high, it causes the memory to start swapping. If this value is increased past 256, the `ServerLimit` value must also be increased.

One way to calculate the best value for this is to divide the amount of RAM each Apache process uses by the amount of RAM available, leaving some room for other processes. Use [Apache2Buddy](#apache2buddy) to help determine these values, or the commands below.

To determine the RAM each Apache process uses issue the following command. The Resident Set Size (RSS) value displays the RAM that is currently being used by a process, in kilobytes. Replace `httpd` with `apache2` on Debian or Ubuntu systems:

    ps -ylC httpd --sort:rss

Divide the number under the RSS column by 1024 to convert it to megabytes.

To get information on memory usage:

    free -m

To receive a more detailed view of the resources Apache is using, use the [`top` command](/docs/guides/top-htop-iotop/).

### MaxConnectionsPerChild

`MaxConnectionsPerChild` limits the number of requests a child process handles during its life. Once the limit has been hit, the child process dies. If set to 0, the child process will never expire. The suggested value for this is a few thousand, to prevent memory leakage. Be aware that setting this too low can slow down the system, since creating new processes does take up resources. This setting was named `MaxRequestsPerChild` in versions lower than Apache 2.3.9.

### ServerLimit

In the context of the `prefork` module, the `ServerLimit` setting configures the maximum value for `MaxRequestWorkers` for the entire lifetime of the Apache httpd process. If you need to increase `MaxRequestWorkers` above `256`, then increase your `ServerLimit` to match.

When using the `worker` and `event` modules, `ServerLimit` and `ThreadLimit` determine the maximum value for `MaxRequestWorkers` for the duration of the Apache httpd process. Note that if `ServerLimit` is set to a value higher than needed, unused shared memory will be set aside.

### KeepAlive

[KeepAlive](https://httpd.apache.org/docs/2.4/mod/core.html#keepalive) allows connecting clients to use a single TCP connection to make multiple requests, instead of opening a new one for each request. This decreases page load times and lowers CPU use for your web server, at the expense of an increase in your server's RAM use. A KeepAlive connection will be counted as a single "request" for the [MaxConnectionsPerChild](/docs/web-servers/apache-tips-and-tricks/tuning-your-apache-server/#maxconnectionsperchild).

In the past, this setting was often disabled to conserve RAM use, but server resources have become less expensive, and the option is now enabled by default in Apache 2.4. Enabling KeepAlive can significantly benefit your site's user experience, so be wary of disabling it without testing the effects of doing so. KeepAlive can be enabled or disabled in your web server configuration, or within a Virtual Host block.