---
deprecated: true
author:
  name: Brett Kaplan
  email: docs@linode.com
description: 'Install and configure NSD to handle DNS queries.'
keywords: 'NSD,DNS,resolving,Ubuntu 9.10,networking'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['dns-guides/nsd-authoritative-dns-ubuntu-9-10-karmic/']
modified: Tuesday, May 17th, 2011
modified_by:
  name: Linode
published: 'Friday, August 27th, 2010'
title: 'Provide Authoritative DNS Services with NSD on Ubuntu 9.10 (Karmic)'
---



NSD is a lightweight yet full-featured open source name server daemon created to provide an alternative to BIND.

Before beginning, you should be familiar with basic [DNS terminology and records](/docs/dns-guides/introduction-to-dns). You will also need to ensure that your current Linode plan has enough memory to run the NSD daemon. Use the developer's [memory usage calculator](http://www.nlnetlabs.nl/projects/nsd/nsd-memsize.html) to determine the memory requirement for your NSD deployment.

Enable Universe Repositories
----------------------------

The NSD packages are included in the Ubuntu's universe repositories. Before installing NSD, edit your `/etc/apt/sources.list` file to enable the "universe" repositories by removing the hash symbol in front of the universe lines. The file should resemble the following example:

{: .file }
/etc/apt/sources.list

> \#\# main & restricted repositories deb <http://us.archive.ubuntu.com/ubuntu/> karmic main restricted deb-src <http://us.archive.ubuntu.com/ubuntu/> karmic main restricted
>
> deb <http://security.ubuntu.com/ubuntu> karmic-security main restricted deb-src <http://security.ubuntu.com/ubuntu> karmic-security main restricted
>
> \#\# universe repositories deb <http://us.archive.ubuntu.com/ubuntu/> karmic universe deb-src <http://us.archive.ubuntu.com/ubuntu/> karmic universe deb <http://us.archive.ubuntu.com/ubuntu/> karmic-updates universe deb-src <http://us.archive.ubuntu.com/ubuntu/> karmic-updates universe
>
> deb <http://security.ubuntu.com/ubuntu> karmic-security universe deb-src <http://security.ubuntu.com/ubuntu> karmic-security universe

When you have saved this file, issue the following command to refresh your system's package database and upgrade installed packages:

    apt-get update
    apt-get upgrade

Install Required Software
-------------------------

Ensure that your package repositories are up to date and that you've installed all available software upgrades by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Install NSD with the following commands:

    apt-get install nsd3

You will now need to configure the daemon.

Configuring the NSD Daemon
--------------------------

You will need to create the `nsd.conf` file to properly configure the NSD service as well as the DNS zones. There is an example configuration file located in `/etc/nsd3/nsd.conf` that you can uncomment directives in. You may also create your own from scratch.

{: .file-excerpt }
/etc/nsd3/nsd.conf

> server:
> :   logfile: "/var/log/nsd.log" username: nsd
>
### Host Zones with NSD

You must specify at least one zone in the `/etc/nsd3/nsd.conf` file before NSD will begin serving DNS records. Refer to the following example configuration for proper syntax.

{: .file-excerpt }
/etc/nsd3/nsd.conf

> zone:
> :   name: example.com zonefile: /etc/nsd3/example.com.zone
>
> zone:
> :   name: example.org zonefile: /etc/nsd3/example.org.zone
>
Once zones are added to the `nsd.conf` file, proceed to create a zone file for each DNS zone.

Creating Zone Files
-------------------

Each domain has zone file specified in the `nsd.conf` file. The syntax of an NSD zone file is similar BIND zone files. Refer to the example zone files that follow for syntax, and modify domain names and IP addresses to reflect the needs of your deployment.

{: .file-excerpt }
/etc/nsd3/example.com.zone

> \$ORIGIN example.com. \$TTL 86400
>
> @ IN SOA ns1.example.com. admin.example.com. (
> :   2010011801 ; serial number 28800 ; Refresh 7200 ; Retry 864000 ; Expire 86400 ; Min TTL )
>
> NS ns1.example.com.
> :   NS ns2.example.com.
>
>     MX 10 mail.example.com.
>
> ns1 IN A 11.22.33.44 ns2 IN A 22.33.44.55 www IN A 77.66.55.44 tomato IN A 77.66.55.44 mail IN A 88.77.66.55 \* IN A 77.66.55.44

{: .file-excerpt }
/etc/nsd3/example.org.zone

> \$ORIGIN example.org. \$TTL 86400
>
> @ IN SOA ns1.example.org. web-admin.example.org. (
> :   2009011803 ; serial number 28800 ; Refresh 7200 ; Retry 864000 ; Expire 86400 ; Min TTL )
>
> NS ns1.example.org.
> :   NS ns2.example.org.
>
>     MX 10 mail.example.org.
>
> ns1 IN A 11.22.33.44
> :   ns2 IN A 22.33.44.55
>
> www IN A 44.33.22.11 paisano IN A 44.33.22.11 mail IN A 99.88.77.66
>
> pizzapie IN CNAME paisano

Rebuild the NSD database and restart the daemon with following command sequence:

    nsdc rebuild
    /etc/init.d/nsd3 restart

Rebuild the database and restart NSD each time you edit an existing zone or create a new one.

Test the configuration and functionality of the DNS serve using `dig`, which provides a [command line DNS client](/docs/networking/dns/use-dig-to-perform-manual-dns-queries). If `dig` is not installed, install the utility by issuing the following command:

    apt-get install dnsutils

Issue the following command to test the DNS server:

    dig @localhost www.example.org

The output should resemble the following:

    ; <<>> DiG 9.6.1-P2 <<>> @localhost pizzapie.example.org
    ; (1 server found)
    ;; global options: +cmd
    ;; Got answer:
    ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 25199
    ;; flags: qr aa rd; QUERY: 1, ANSWER: 2, ORGNAMEITY: 2, ADDITIONAL: 0
    ;; WARNING: recursion requested but not available

    ;; QUESTION SECTION:
    ;pizzapie.example.org.  IN  A

    ;; ANSWER SECTION:
    pizzapie.example.org. 86400 IN  CNAME   paisano.example.org.
    paisano.example.org. 86400  IN  A   44.33.22.11

    ;; ORGNAMEITY SECTION:
    example.org.    86400   IN  NS  ns1.example.org.
    example.org.    86400   IN  NS  ns2.example.org.

    ;; Query time: 18 msec

Congratulations, you have successfully installed NSD!

Adjusting NSD for Low-Memory Situations
---------------------------------------

If you are running NSD in a low-memory environment, amending the values of the following directives in your `/etc/nsd3/nsd.conf` file will lower your memory and system resource usage.

{: .file-excerpt }
/etc/nsd3/nsd.conf

> ip4-only: yes tcp-count: 10 server-count: 1

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [NSD Homepage](http://nlnetlabs.nl/projects/nsd/)
- [NSD Memory Usage Calculator](http://nlnetlabs.nl/projects/nsd/nsd-memsize.html)



