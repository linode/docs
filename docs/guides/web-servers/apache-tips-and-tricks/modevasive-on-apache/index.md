---
slug: modevasive-on-apache
author:
  name: Chris Ciufo
  email: docs@linode.com
description: 'Learn what is mod_evasive on Apache web server, understand how to configure and test it.'
og_description: "Configure your Apache web server to evade DoS attacks with mod_evasive."
keywords: ["mod_evasive", "modevasive", "evasive", "apache"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/web-servers/apache-tips-and-tricks/modevasive-on-apache/','/websites/apache-tips-and-tricks/modevasive-on-apache/','/web-servers/apache/mod-evasive/']
modified: 2021-07-07
modified_by:
  name: Linode
published: 2011-11-14
title: 'mod_evasive on Apache'
h1_title: "Configure mod_evasive to Help Survive DoS/DDoS Attacks"
external_resources:
 - '[mod_evasive on GitHub](https://github.com/jzdziarski/mod_evasive)'
tags: ["web server","apache"]
---

## What is mod_evasive?

mod_evasive is a module for Apache that provides evasive action in the event of an HTTP Distributed Denial of Service (DDoS/DoS) attack or brute force attack. It is also designed to be a detection and network management tool, and can be easily configured to talk to ipchains, firewalls, routers, and more. mod_evasive presently reports abuse via email and syslog facilities.

![mod_evasive on Apache](mod_evasive.png "mod_evasive on Apache")

This guide assumes you already have your LAMP server configured. Guides for setting up a LAMP stack can be found in our [LAMP guides](/docs/lamp-guides) section.

## How mod_evasive works?

mod_evasive works on top of a dynamic IP table and URIs to issue or deny permissions to incoming requests. These two are what enables executive evasive actions during sophisticated attacks on your systems and reports certain actions to your web servers.

To understand how exactly mod_evasive handles both DDoS and brute force attacks we have to understand the common denominator between these two attacks - which is the surge in the number of requests your servers receive. When you are under these two attacks, you either experience a high volume of requests (which is DDoS) or a very high number of log-in attempts using different user-name and password combinations.

For each listener in your web servers, mod_evasive uses your web server's (Apache) own capacity to scale as request volumes scale. mod_evasive evaluates each incoming request it gets and the IP is looked up against a hash table.

This hash table has URIs and IPs that are dynamically updated. And each request's IP address is matched against a backlist of temporary IPs that have potentially tried sending too many requests. If the request's IP address is found in the temporary blacklist a 403 status code is returned as a result of the request.

## Prerequisites

mod_evasive has just one prerequisite beyond the standard LAMP install. To install this module, run the following as root:

**Debian / Ubuntu:**

    apt-get install apache2-utils

**CentOS / Fedora:**

    yum install httpd-devel

## Install mod_evasive

1.  Download the mod_evasive package, uncompress it, and install it using apxs:

        cd /usr/src
        wget https://www.zdziarski.com/blog/wp-content/uploads/2010/02/mod_evasive_1.10.1.tar.gz
        tar xzf mod_evasive_1.10.1.tar.gz
        cd mod_evasive
        apxs2 -cia mod_evasive20.c

2.  To add the mod_evasive configuration to your Apache configuration file, find the section appropriate to your Apache config:

    **Debian / Ubuntu:**

    {{< file "/etc/apache2/apache2.conf" >}}
# Include module configuration:
Include mods-enabled/*.load
Include mods-enabled/*.conf
{{< /file >}}

    **CentOS / Fedora:**

    {{< file "/etc/httpd/conf/httpd.conf" >}}
LoadModule evasive20_module /usr/lib/httpd/modules/mod_evasive20.so
#
{{< /file >}}

3.  Below that section, add the mod_evasive configuration:

    {{< file "mod_evasive configuration" >}}
<IfModule mod_evasive20.c>
    DOSHashTableSize 3097
    DOSPageCount 2
    DOSSiteCount 50
    DOSPageInterval 1
    DOSSiteInterval 1
    DOSBlockingPeriod 60
    DOSEmailNotify <someone@somewhere.com>
</IfModule>
{{< /file >}}

4.  Restart Apache for your changes to take effect:

    **Debian / Ubuntu:**

        /etc/init.d/apache2 restart

    **CentOS / Fedora:**

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

## How To Restrict mod_evasive For Only One Virtual Host On Apache?

When you define a mod_evasive configuration on Apache, you by default set it to work at a global level. To enable it for specific hosts, you can apply two different methods:
1. Put your default mod_evasive configuration to work with a large range of numbers. You can define these numbers in a way that a ban is never triggered.
2. Leave mod_evasive set at the global level, but put `DOSBlockingPeriod` to `0` for certain vhosts

If we try adding numbers to never trigger a ban from mod_evasive it is highly likely to create a performance issue in your Apache web server. These performance issues are also the reason why it is not a recommended practice.

To exclude certain vhosts from mod_evasive bans or triggers without compromising on the system level performance, we can use the `DOSBlockingPeriod`. We can add the following to exclude vhosts:

{{< file "default.conf" >}}
<IfModule mod_evasive24.c>
    DOSBlockingPeriod 0
</IfModule>
{{< /file >}}

## How To Check If mod_evasive Is Working?

To test if our mod_evasive configuration is working as intended, we can use `test.pl` by mod_evasive's developers. If you don't already have it in your system, you can use the following test.pl file:

{{< file "test.pl" >}}
#!/usr/bin/perl

# test.pl: a small perl script that test's mod_dosevasive's effectiveness

use IO::Socket;
use strict;

for(0..100) {
  my($response);
  my($SOCKET) = new IO::Socket::INET( Proto   => "tcp",
                                      PeerAddr=> "127.0.0.1:80");
  if (! defined $SOCKET) { die $!; }
  print $SOCKET "GET /?$_ HTTP/1.0\n\n";
  $response = <$SOCKET>;
  print $response;
  close($SOCKET);
}
{{< /file >}}

If you don't have Pearl installed on your system, you can install it by running the following command on your terminal:

        sudo yum install -y perl

Let's run a test of our mod_evasive configuration to see if our mod_evasive is working well with the Apache web server. Our test is to send 100 requests to trigger mod_evasive. 

We can run `test.pl` using the following command:

        sudo perl /usr/share/doc/mod_evasive/test.pl

You should see the output of these requests as shown below:

{{< output >}}
HTTP/1.1 403 Forbidden
HTTP/1.1 403 Forbidden
HTTP/1.1 403 Forbidden
HTTP/1.1 403 Forbidden
HTTP/1.1 403 Forbidden
HTTP/1.1 403 Forbidden
HTTP/1.1 403 Forbidden
…
{{< /output >}}

Apart from the terminal's output, we also have logs of all mod_evasive activities that we can check to understand actions associated with IPs.

We can run the following command on our logs to check the last five lines to see possible mod_evasive actions:

        Oct 25 03:11:08 Ubuntu[18290]: Blacklisting address 127.0.0.1: possible DoS attack.
        Oct 25 03:11:35 Ubuntu[18290]: Blacklisting address 127.0.0.1: possible DoS attack.
        Oct 25 03:12:28 Ubuntu[18290]: Blacklisting address 127.0.0.1: possible DoS attack.
        Oct 25 15:36:42 CentOS-7 mod_evasive[2732]: Blacklisting address 192.168.1.42: possible DoS attack.
        Oct 27 15:36:42 CentOS-7 mod_evasive[2732]: Blacklisting address 192.168.1.42: possible DoS attack.

In the output above, the part that says `Blacklisting address 192.165.1.42: possible DoS attack` highlights a mod_evasive action. Here the IP address 192.168.1.42 is blocked by mod_evasive.

## Test mod_evasive

Refer to our guide on [Load Testing with Siege](/docs/tools-reference/tools/load-testing-with-siege/) to test your site's performance. Before you attempt to DDoS yourself, be aware that you risk banning your own IP. Linode does not recommend testing any server that isn't your own.
