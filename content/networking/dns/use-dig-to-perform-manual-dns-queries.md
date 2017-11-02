---
author:
  name: Linode
  email: docs@linode.com
description: 'Use the dig utility to perform DNS queries at the command line.'
keywords: ["dig", "dns", "troubleshooting", "domain names"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/common-commands/dig/']
modified: 2017-10-04
modified_by:
  name: Linode
published: 2010-10-13
title: Use dig to Perform Manual DNS Queries
---

![Use dig to Perform Manual DNS Queries](/docs/assets/use-dig-to-perform-manual-dns-queries.jpg "Use dig to Perform Manual DNS Queries")

## What is dig?

`dig` is a command line domain name system (DNS) querying utility that allows you to diagnose issues with domain name resolution.

## Install dig

`dig` is part of a collection of DNS utilities often packaged with the DNS server "BIND". You can install these utilities by issuing the appropriate command for your Linux distribution. For users of Debian and Ubuntu systems, use the following command:

    apt-get install dnsutils

Users of CentOS and Fedora systems can use the following command:

    yum install bind-utils

In Arch Linux, use the following command:

    pacman -S dnsutils

## How to Use dig

Consider the following basic `dig` output:

    $ dig example.com

    ; <<>> DiG 9.6.1 <<>> example.com
    ;; global options: +cmd
    ;; Got answer:
    ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 11982
    ;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

    ;; QUESTION SECTION:
    ;example.com.               IN      A

    ;; ANSWER SECTION:
    example.com.         86400  IN      A       107.92.2.7

    ;; Query time: 54 msec
    ;; SERVER: 192.168.1.1#53(192.168.1.1)
    ;; WHEN: Tue Aug 24 14: 2010
    ;; MSG SIZE  rcvd: 57

There are a number of aspects of the DNS query that we can see from this output. The query returns a successful result of `NOERROR` and `dig` is able to retrieve an "A Record" for the name `example.com`, which resolves to the IP address `107.92.2.7`. `dig` concludes with a number of data points regarding the query itself including the DNS resolver used (`192.168.1.1`), the amount of time required to complete the query, and the size of the query response.

To query for a different kind of DNS record, both of the following commands will produce the same output:

    $ dig example.com mx
    $ dig mx example.com

    ; <<>> DiG 9.6.1 <<>> mx example.com
    ;; global options: +cmd
    ;; Got answer:
    ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 52563
    ;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

    ;; QUESTION SECTION:
    ;example.com.       IN      MX

    ;; ANSWER SECTION:
    example.com. 86400  IN      MX      10 example.com.

    ;; Query time: 53 msec
    ;; SERVER: 192.168.1.1#53(192.168.1.1)
    ;; WHEN: Tue Aug 24 15:14:05 2010
    ;; MSG SIZE  rcvd: 57

If you attempt to query a domain that doesn't exist, as is the case with `nonextant.example.com`, you will see a response that resembles the following:

    $ dig nonextant.example.com

    ; <<>> DiG 9.6.1 <<>> nonextant.example.com
    ;; global options: +cmd
    ;; Got answer:
    ;; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 53119
    ;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 1, ADDITIONAL: 0

    ;; QUESTION SECTION:
    ;nonextant.example.com. IN    A

    ;; AUTHORITY SECTION:
    example.com. 10800  IN      SOA     ns1.linode.com. username.example.com. 2010051349 14400 14400 1209600 86400

    ;; Query time: 91 msec
    ;; SERVER: 192.168.1.1#53(192.168.1.1)
    ;; WHEN: Tue Aug 24 15:19:11 2010
    ;; MSG SIZE  rcvd: 100

In this example, the query returns the status `NXDOMAIN` and the `SOA` or "Start of Authority" record that describes global values in every authoritative DNS zone. You may also occasionally see records that contain multiple A records. In these cases, multiple hosts are able to respond for a single name. See the following example:

    $ dig example.com

    ; <<>> DiG 9.6.1 <<>> example.com
    ;; global options: +cmd
    ;; Got answer:
    ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 11982
    ;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

    ;; QUESTION SECTION:
    ;example.com.               IN      A

    ;; ANSWER SECTION:
    example.com.         86400  IN      A       107.92.2.7
    example.com.         86400  IN      A       107.92.2.9
    example.com.         86400  IN      A       107.92.2.13

    ;; Query time: 54 msec
    ;; SERVER: 192.168.1.1#53(192.168.1.1)
    ;; WHEN: Tue Aug 24 14: 2010
    ;; MSG SIZE  rcvd: 57

## Use dig to Trace a DNS Query

With the `+trace` option, `dig` will provide output that allows you follow each successive hierarchical step that the query takes:

    dig +trace www.example.com

    ; <<>> DiG 9.6.1 <<>> +trace www.example.com
    ;; global options: +cmd
    .                       305393  IN      NS      m.root-servers.net.
    .                       305393  IN      NS      e.root-servers.net.
    .                       305393  IN      NS      f.root-servers.net.
    .                       305393  IN      NS      l.root-servers.net.
    .                       305393  IN      NS      k.root-servers.net.
    .                       305393  IN      NS      c.root-servers.net.
    .                       305393  IN      NS      i.root-servers.net.
    .                       305393  IN      NS      j.root-servers.net.
    .                       305393  IN      NS      g.root-servers.net.
    .                       305393  IN      NS      h.root-servers.net.
    .                       305393  IN      NS      a.root-servers.net.
    .                       305393  IN      NS      b.root-servers.net.
    .                       305393  IN      NS      d.root-servers.net.
    ;; Received 512 bytes from 192.168.1.1#53(192.168.1.1) in 19 ms

    com.                    172800  IN      NS      a.gtld-servers.net.
    com.                    172800  IN      NS      b.gtld-servers.net.
    com.                    172800  IN      NS      c.gtld-servers.net.
    com.                    172800  IN      NS      d.gtld-servers.net.
    com.                    172800  IN      NS      e.gtld-servers.net.
    com.                    172800  IN      NS      f.gtld-servers.net.
    com.                    172800  IN      NS      g.gtld-servers.net.
    com.                    172800  IN      NS      h.gtld-servers.net.
    com.                    172800  IN      NS      i.gtld-servers.net.
    com.                    172800  IN      NS      j.gtld-servers.net.
    com.                    172800  IN      NS      k.gtld-servers.net.
    com.                    172800  IN      NS      l.gtld-servers.net.
    com.                    172800  IN      NS      m.gtld-servers.net.
    ;; Received 504 bytes from 202.12.27.33#53(m.root-servers.net) in 109 ms

    example.com.        172800  IN      NS      ns1.linode.com.
    example.com.        172800  IN      NS      ns2.linode.com.
    example.com.        172800  IN      NS      ns3.linode.com.
    ;; Received 150 bytes from 192.52.178.30#53(k.gtld-servers.net) in 106 ms

    www.example.com.     86400  IN      A       107.92.2.7
    www.example.com.     86400  IN      NS      ns3.linode.com.
    www.example.com.     86400  IN      NS      ns4.linode.com.
    www.example.com.     86400  IN      NS      ns5.linode.com.
    www.example.com.     86400  IN      NS      ns1.linode.com.
    www.example.com.     86400  IN      NS      ns2.linode.com.
    ;; Received 234 bytes from 65.19.178.10#53(ns2.linode.com) in 96 ms

This example traces a DNS query for the domain `www.example.com`. This ultimately resolves to the IP address `107.92.2.7`. DNS queries start at the end of the domain with the root-level `.`, and continue from right to left until a DNS server is able to provide an authoritative A record.

DNS traces help you determine if DNS authority has delegated properly and if DNS "glue" records are leading to an incorrect resolution. DNS traces also provide information on how long queries take to complete and the specific servers that provide intermediate records.

## Use dig to Target a Specific DNS Server

Any DNS server can publish records for any domain; however, in normal use, DNS servers are only queried for records that have had authority delegated to them. You can use `dig` to query arbitrary DNS servers for records that they might not have been delegated authority, as in the following example:

    $ dig @ns1.linode.com example.com

    ; <<>> DiG 9.7.1-P2 <<>> @ns1.linode.com example.com
    ; (1 server found)
    ;; global options: +cmd
    ;; Got answer:
    ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 35939
    ;; flags: qr aa rd; QUERY: 1, ANSWER: 1, AUTHORITY: 5, ADDITIONAL: 5
    ;; WARNING: recursion requested but not available

    ;; QUESTION SECTION:
    ;example.com.               IN      A

    ;; ANSWER SECTION:
    example.com.        86400   IN      A       107.92.2.7

    ;; AUTHORITY SECTION:
    example.com.        86400   IN      NS      ns3.linode.com.
    example.com.      86400   IN      NS      ns2.linode.com.
    example.com.      86400   IN      NS      ns1.linode.com.
    example.com.      86400   IN      NS      ns5.linode.com.
    example.com.        86400     IN      NS      ns4.linode.com.

    ;; ADDITIONAL SECTION:
    ns1.linode.com.         86400   IN      A       69.93.127.10
    ns2.linode.com.         86400   IN      A       65.19.178.10
    ns3.linode.com.         86400   IN      A       75.127.96.10
    ns4.linode.com.         86400   IN      A       207.192.70.10
    ns5.linode.com.         86400   IN      A       109.74.194.10

    ;; Query time: 55 msec
    ;; SERVER: 69.93.127.10#53(69.93.127.10)
    ;; WHEN: Wed Aug 25 11:30:20 2010
    ;; MSG SIZE  rcvd: 234

Specify the name of the server that you wish to query as an argument to the `dig` command formatted as `@[server]`, where `[server]` is the name or address of the IP DNS server.

## Use dig to Retrieve Different Record Types

Specify a different type of DNS record by adding that record type (e.g. AAAA, MX, TXT, or SRV) to the `dig` command. Consider the following example of a query for SRV records:

    $ dig srv _jabber._tcp.example.com

    ; <<>> DiG 9.7.1-P2 <<>> srv _jabber._tcp.example.com
    ;; global options: +cmd
    ;; Got answer:
    ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 33643
    ;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

    ;; QUESTION SECTION:
    ;_jabber._tcp.example.com.      IN      SRV

    ;; ANSWER SECTION:
    _jabber._tcp.example.com. 300   IN      SRV     0 0 5269 hostname.example.com

    ;; Query time: 53 msec
    ;; SERVER: 192.168.1.1#53(192.168.1.1)
    ;; WHEN: Wed Aug 25 12:40:13 2010
    ;; MSG SIZE  rcvd: 90

## Use dig to Generate Condensed Output

Using the `+short` modifier after the dig command abbreviates the output of `dig`:

    $ dig example.com +short
    207.192.72.27

You can combine the `+short` modifier with other dig commands to generate output that may be more useful in scripts as follows:

    $ dig mx example.com +short
    10 mail.example.com.

    $ dig +trace +short example.com
    NS a.root-servers.net. from server 192.168.1.1 in 18 ms.
    NS b.root-servers.net. from server 192.168.1.1 in 18 ms.
    NS d.root-servers.net. from server 192.168.1.1 in 18 ms.
    NS m.root-servers.net. from server 192.168.1.1 in 18 ms.
    NS e.root-servers.net. from server 192.168.1.1 in 18 ms.
    NS f.root-servers.net. from server 192.168.1.1 in 18 ms.
    NS l.root-servers.net. from server 192.168.1.1 in 18 ms.
    NS k.root-servers.net. from server 192.168.1.1 in 18 ms.
    NS c.root-servers.net. from server 192.168.1.1 in 18 ms.
    NS i.root-servers.net. from server 192.168.1.1 in 18 ms.
    NS j.root-servers.net. from server 192.168.1.1 in 18 ms.
    NS g.root-servers.net. from server 192.168.1.1 in 18 ms.
    NS h.root-servers.net. from server 192.168.1.1 in 18 ms.
    A 107.92.2.7 from server ns2.linode.com in 94 ms.

    $ dig soa +short example.com
    ns1.linode.com. username.example.com. 2010051349 14400 14400 1209600 86400

    $ dig @ns2.linode.com ns +short example.com
    ns5.linode.com.
    ns1.linode.com.
    ns2.linode.com.
    ns3.linode.com.
    ns4.linode.com.