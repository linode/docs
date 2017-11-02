---
author:
  name: Linode
  email: docs@linode.com
description: 'Help with common Linode memory use and networking issues.'
keywords: ["Linode troubleshooting", "Linode troubleshooting", "Linux configuration"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['troubleshooting/memory-networking/']
modified: 2013-11-19
modified_by:
  name: Linode
published: 2009-08-05
title: Troubleshooting Memory and Networking Issues
---

Many common issues with Linodes are caused by excessive memory consumption or networking configuration errors. This guide provides suggestions for alleviating these problems.

## Diagnosing and Fixing Memory Issues

When your Linode is running low on physical memory, it may start to "swap thrash." This means it's attempting to use your swap partition heavily instead of real RAM. We recommend you limit your swap partition size to 256 MB; heavy use of swap in a virtualized environment will cause major performance problems.

### Determining Free Memory and Swap Activity

You can use the following command to display memory use on your Linode:

    free -m

You can use the following snippet to see a list of your running processes sorted by memory use:

    ps -eo pmem,pcpu,rss,vsize,args | sort -k 1 -r | less

To see IO activity on your Linode, you may use the following command (you may need to install the `sysstat` package under Debian or Ubuntu first):

    iostat -d -x 2 5

This will give an extended device utilization report five times at two second intervals. If your Linode is OOMing (running out of memory), Apache, MySQL, and SpamAssassin are the usual suspects.

### MySQL Low-Memory Settings

In your MySQL configuration file (typically found in `/etc/mysql/my.cnf`), change your entries for the various settings shown below to match the recommended values:

~~~ ini
key_buffer = 16K
max_allowed_packet = 1M
thread_stack = 64K
table_cache = 4
sort_buffer = 64K
net_buffer_length = 2K
~~~

If you don't use InnoDB tables, you should disable InnoDB support by adding the following line:

    skip-innodb

 {{< caution >}}
The settings in this section are designed to help you temporarily test and troubleshoot MySQL. We recommend that you do not permanently use these settings.
{{< /caution >}}

### Apache 2 Low-Memory Settings

Determine the type of MPM in use by your Apache install by issuing the following command. This will tell you which section to edit in your Apache configuration file.

**Debian-based systems** :

    apache2 -V | grep 'MPM'

**Fedora/CentOS systems** :

    httpd -V | grep 'MPM'

In your Apache 2 configuration file (typically found at `/etc/apache2/apache2.conf` in Debian and Ubuntu systems, and `/etc/httpd/httpd.conf` in CentOS and other similar systems), change your entries for the various settings shown below to match the recommended values.

~~~ apache
KeepAlive Off
---

StartServers 1
MinSpareServers 3
MaxSpareServers 6
ServerLimit 24
MaxClients 24
MaxRequestsPerChild 3000
~~~

 {{< caution >}}
The settings in this section are designed to help you temporarily test and troubleshoot Apache. We recommend that you do not permanently use these settings.
{{< /caution >}}

### Reducing SpamAssassin Memory Consumption

If you're filtering mail through SpamAssassin in standalone mode and running into load issues, you'll need to investigate switching to something to keep the program persistent in memory as a daemon. We suggest looking at [amavisd-new](http://www.ijs.si/software/amavisd/).

## Troubleshooting Network Issues

If you've added multiple IP addresses to your Linode, you must set up static networking as described in the [Linux Static Networking Guide](/docs/networking/configuring-static-ip-interfaces). Please be sure to specify only one gateway. Using multiple gateways frequently causes problems.

If you just added an IP address to your Linode, please be sure to reboot before attempting to use it. This is required to properly route the IP address on our network.

If you've added a private IP address, please be sure to use the network settings shown in the "Remote Access" of the Linode Manager, paying special attention to the subnet mask. Note that private IP addresses do not require a gateway (nor should one be specified).