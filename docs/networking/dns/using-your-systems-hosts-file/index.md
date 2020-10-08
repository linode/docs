---
author:
  name: Linode
  email: docs@linode.com
description: 'Mapping aliases, domains or hostnames to IP addresses using the system host file.'
keywords: ["hosts", "hosts file", "hostname", "alias", "dnsec"]
tags: ["dns","networking","resolving"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-01-28
modified_by:
  name: Linode
published: 2017-09-14
title: Using Your System's hosts File
---

![Using Your System's Hosts File](using-your-systems-hosts-files.jpg)

The Linux [hosts file](http://man7.org/linux/man-pages/man5/hosts.5.html) lives at `/etc/hosts` and it creates static associations between IP addresses and hostnames, domains, or machine aliases. Your Linode then gives those associations higher priority than hostnames or domains which must be resolved by DNS.

## Example Host Entries

There are various ways to use the hosts file and the types of associations you set would depend on your specific use case. Below are some examples.

- Map the alias `mywebsite` to a given IP address. This is often done when previewing a site during development before the domain is live.

        203.0.113.10 mywebsite

- Map the domain `example.com` to the given IP address. This is useful when hosting a web or mail server.

        203.0.113.10 example.com

- Combine the two options above so both the domain and alias map to the IP address:

        203.0.113.10 example.com mywebsite

- Map the alias `backupserver` to the given private IPv6 address:

        fe80::f03c:91ff:fe24:3a2f backupserver

- Block all traffic to and from the domain `example.com`. This is frequently used for content filtering or blocking advertisements via a hosts file.

        0.0.0.0 example.com

- Set a [fully qualified domain name](https://en.wikipedia.org/wiki/Fully_qualified_domain_name) (FQDN). In the example below, replace *example_hostname* with your system's hostname. The domain *example.com* can be a public internet domain (ex. a public website), or the domain of a private network (ex. your home LAN), or a subdomain (subdomain.example.com). It's important to add the FQDN entry immediately after the *localhost* line, so it looks like below:

        127.0.0.1 localhost
        127.0.1.1 hostname.example.com example_hostname

    A FQDN does not necessarily have any relationship to websites or other services hosted on the server (although it may if you wish). As an example, you might host `www.something.com` on your server, but the system’s FQDN might be `mars.somethingelse.com`.

    The domain you assign as your system’s FQDN should have an “A” record in DNS pointing to your Linode’s IPv4 address. For IPv6, you should set up a “AAAA” record in DNS pointing to your Linode’s IPv6 address. For more information on configuring DNS, see our [DNS records](/docs/networking/dns/dns-records-an-introduction/) guide.

- Debian and Ubuntu include a line in their host file for the loopback domain. However, when you change the system's hostname, the loopback domain should be changed too. If you do not, then you'll see the message *sudo: unable to resolve host* when running sudo commands. If you are not using a FQDN like shown above, then all you need to eliminate the sudo message is:

        127.0.1.1 example_hostname

## Name Service Switch

The file `etc/nsswitch.conf` is important to keep in mind if you choose to rely on your hosts file for domain mapping. To ensure than the system prefers resolving domains listed in your hosts file over DNS resolution, the word `files` must appear in the line before `dns`. So the line should look as shown below:

    root@localhost:~# grep hosts /etc/nsswitch.conf
    hosts:          files dns

See `man nsswitch.conf` from your system's terminal for more information.
