---
author:
  name: Chris Ciufo
  email: docs@linode.com
description: 'mod_evasive'
keywords: ["mod_evasive", " modevasive", " evasive", " apache"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/apache/mod-evasive/','websites/apache-tips-and-tricks/modevasive-on-apache/']
modified: 2013-02-05
modified_by:
  name: Linode
published: 2011-11-14
title: 'mod_evasive on Apache'
external_resources:
 - '[mod_evasive Home Page](http://www.zdziarski.com/blog/?page_id=442)'
---

mod_evasive is an evasive maneuvers module for Apache that provides evasive action in the event of an HTTP DoS attack or brute force attack. It is also designed to be a detection and network management tool, and can be easily configured to talk to ipchains, firewalls, routers, and more. mod_evasive presently reports abuse via email and syslog facilities.

![mod_evasive on Apache](/docs/assets/mod_evasive.png "mod_evasive on Apache")

This guide assumes you already have your LAMP server configured. Guides for setting up a LAMP stack can be found under our [LAMP guides](/docs/lamp-guides) section.

## Prerequisites

mod_evasive has just one prerequisite beyond the standard LAMP install. To install this module, just run the following command as root in SSH:

Debian / Ubuntu:

    apt-get install apache2-utils

CentOS / Fedora:

    yum install httpd-devel

## Installing mod_evasive

You'll first want to get the mod_evasive package, uncompress it, and install it using apxs:

    cd /usr/src
    wget http://www.zdziarski.com/blog/wp-content/uploads/2010/02/mod_evasive_1.10.1.tar.gz
    tar xzf mod_evasive_1.10.1.tar.gz
    cd mod_evasive
    apxs2 -cia mod_evasive20.c

You'll then need to add the mod_evasive configuration to your Apache configuration file. First, find this section:

{{< file "/etc/apache2/apache2.conf (Debian / Ubuntu)" >}}
# Include module configuration:
Include mods-enabled/*.load
Include mods-enabled/*.conf

{{< /file >}}


{{< file "/etc/httpd/conf/httpd.conf (CentOS / Fedora)" >}}
LoadModule evasive20_module /usr/lib/httpd/modules/mod_evasive20.so
#

{{< /file >}}


Below those sections, add the mod_evasive configuration:

{{< file-excerpt "mod_evasive configuration" >}}
<IfModule mod_evasive20.c>
    DOSHashTableSize 3097
    DOSPageCount 2
    DOSSiteCount 50
    DOSPageInterval 1
    DOSSiteInterval 1
    DOSBlockingPeriod 60
    DOSEmailNotify <someone@somewhere.com>
</IfModule>

{{< /file-excerpt >}}


You'll then need to restart Apache for your changes to take effect:

Debian / Ubuntu:

    /etc/init.d/apache2 restart

CentOS / Fedora:

    /etc/init.d/httpd restart

## mod_evasive Configuration Options

These configuration option descriptions were taken directly from the README file packaged with the mod_evasive tarball you downloaded during installation.

### DOSHashTableSize

The hash table size defines the number of top-level nodes for each child's hash table. Increasing this number will provide faster performance by decreasing the number of iterations required to get to the record, but consume more memory for table space. You should increase this if you have a busy web server. The value you specify will automatically be tiered up to the next prime number in the primes list (see mod_evasive.c for a list of primes used).

### DOSPageCount

This is the threshold for the number of requests for the same page (or URI) per page interval. Once the threshold for that interval has been exceeded, the IP address of the client will be added to the blocking list.

### DOSSiteCount

This is the threshold for the total number of requests for any object by the same client on the same listener per site interval. Once the threshold for that interval has been exceeded, the IP address of the client will be added to the blocking list.

### DOSPageInterval

The interval for the page count threshold; defaults to 1 second intervals.

### DOSSiteInterval

The interval for the site count threshold; defaults to 1 second intervals.

### DOSBlockingPeriod

The blocking period is the amount of time (in seconds) that a client will be blocked for if they are added to the blocking list. During this time, all subsequent requests from the client will result in a 403 (Forbidden) and the timer being reset (e.g. another 10 seconds). Since the timer is reset for every subsequent request, it is not necessary to have a long blocking period; in the event of a DoS attack, this timer will keep getting reset.

### DOSEmailNotify

If this value is set, an email will be sent to the address specified whenever an IP address becomes blacklisted. A locking mechanism using /tmp prevents continuous emails from being sent.

 {{< note >}}
Be sure MAILER is set correctly in mod_evasive.c (or mod_evasive20.c). The default is "/bin/mail -t %s" where %s is used to denote the destination email address set in the configuration. If you are running on linux or some other operating system with a different type of mailer, you'll need to change this.
{{< /note >}}

### DOSSystemCommand

If this value is set, the system command specified will be executed whenever an IP address becomes blacklisted. This is designed to enable system calls to ip filter or other tools. A locking mechanism using /tmp prevents continuous system calls. Use %s to denote the IP address of the blacklisted IP.

### DOSLogDir

Choose an alternative temp directory

By default "/tmp" will be used for locking mechanism, which opens some security issues if your system is open to shell users. In the event you have nonprivileged shell users, you'll want to create a directory writable only to the user Apache is running as (usually root), then set this in your httpd.conf.

### Whitelisting IP Addresses

IP addresses of trusted clients can be whitelisted to insure they are never denied. The purpose of whitelisting is to protect software, scripts, local searchbots, or other automated tools from being denied for requesting large amounts of data from the server. Whitelisting should *not* be used to add customer lists or anything of the sort, as this will open the server to abuse. This module is very difficult to trigger without performing some type of malicious attack, and for that reason it is more appropriate to allow the module to decide on its own whether or not an individual customer should be blocked.

To whitelist an address (or range) add an entry to the Apache configuration in the following fashion:

{{< file "/etc/apache2/apache2.conf" >}}
DOSWhitelist 127.0.0.1
DOSWhitelist 127.0.0.*

{{< /file >}}

Wildcards can be used on up to the last 3 octets if necessary. Multiple DOSWhitelist commands may be used in the configuration.
