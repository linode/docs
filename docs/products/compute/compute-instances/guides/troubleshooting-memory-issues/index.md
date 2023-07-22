---
title: Troubleshooting Memory Issues on Compute Instances
description: 'Many common issues with Compute Instances are caused by excessive memory consumption or errors. This guide provides suggestions for resolving this.'
keywords: ["Linode troubleshooting", "Linux configuration","troubleshoot"]
tags: ["networking", "mysql", "apache"]
published: 2009-08-05
modified: 2023-03-14
modified_by:
  name: Linode
bundles: ['troubleshooting']
aliases: ['/troubleshooting/troubleshooting-memory-and-networking-issues/','/troubleshooting/memory-networking/','/guides/troubleshooting-memory-and-networking-issues/']
---

Many common issues with Compute Instances are caused by excessive memory consumption. When your Compute Instance is running low on physical memory, it may start to "swap thrash." This means it's attempting to use your swap partition heavily instead of real RAM. We recommend you limit your swap partition size to 256 MB; heavy use of swap in a virtualized environment will cause major performance problems.

## Determining Free Memory and Swap Activity

You can use the following command to display memory use on your Compute Instance:

```command
free -m
```

You can use the following snippet to see a list of your running processes sorted by memory use:

```command
ps -eo pmem,pcpu,rss,vsize,args | sort -k 1 -r | less
```

To see IO activity on your Compute Instance, you may use the following command (you may need to install the `sysstat` package under Debian or Ubuntu first):

```command
iostat -d -x 2 5
```

This will give an extended device utilization report five times at two second intervals. If your Compute Instance is OOMing (running out of memory), Apache, MySQL, and SpamAssassin are the usual suspects.

## MySQL Low-Memory Settings

In your MySQL configuration file (typically found in `/etc/mysql/my.cnf`), change your entries for the various settings shown below to match the recommended values:

```file {title="/etc/mysql/my.cnf"}
key_buffer = 16K
max_allowed_packet = 1M
thread_stack = 64K
table_cache = 4
sort_buffer = 64K
net_buffer_length = 2K
```

If you don't use InnoDB tables, you should disable InnoDB support by adding the following line:

```command
skip-innodb
```

{{< note type="warning" >}}
The settings in this section are designed to help you temporarily test and troubleshoot MySQL. We recommend that you do not permanently use these settings.
{{< /note >}}

## Apache 2 Low-Memory Settings

Determine the type of MPM in use by your Apache install by issuing the following command. This will tell you which section to edit in your Apache configuration file.

**Debian-based systems** :

```command
apache2 -V | grep 'MPM'
```

**Fedora/CentOS systems** :

```command
httpd -V | grep 'MPM'
```

In your Apache 2 configuration file (typically found at `/etc/apache2/apache2.conf` in Debian and Ubuntu systems, and `/etc/httpd/httpd.conf` in CentOS and other similar systems), change your entries for the various settings shown below to match the recommended values.

```file {title="/etc/apache2/apache2.conf"}
KeepAlive Off
---

StartServers 1
MinSpareServers 3
MaxSpareServers 6
ServerLimit 24
MaxClients 24
MaxRequestsPerChild 3000
```

{{< note type="warning" >}}
The settings in this section are designed to help you temporarily test and troubleshoot Apache. We recommend that you do not permanently use these settings.
{{< /note >}}

## Reducing SpamAssassin Memory Consumption

If you're filtering mail through SpamAssassin in standalone mode and running into load issues, you'll need to investigate switching to something to keep the program persistent in memory as a daemon. We suggest looking at [amavisd-new](http://www.ijs.si/software/amavisd/).