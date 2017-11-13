---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Configure and run your own DNS resolver using the Unbound Server on Ubuntu 9.10 (Karmic).'
keywords: ["ubuntu dns", "open source dns", "dns", "resolving", "caching", "unbound"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['dns-guides/unbound-dns-resolver-ubuntu-9-10-karmic/']
modified: 2013-07-15
modified_by:
  name: Linode
published: 2010-09-07
title: 'Use Unbound for Local DNS Resolution on Ubuntu 9.10 (Karmic)'
---



In the default configuration, Linode systems are configured to query DNS resolvers provided by Linode. If you don't want to use a third party DNS service on your system, you may consider running an independent DNS resolving and caching service such as [Unbound DNS resolver](http://unbound.net). Unbound is easy to install and configure, which makes it an ideal resolver for simple deployments.

If you are unfamiliar with DNS, you may want to consider our [introduction to the DNS system](/docs/dns-guides/introduction-to-dns). If you simply need to configure DNS services for your domain, you may want to consider [using Linode's DNS manager](/docs/dns-guides/configuring-dns-with-the-linode-manager). If you only need to modify the behavior of DNS for a small group of systems, consider [using /etc/hosts](/docs/using-linux/administration-basics#configure-the-etchosts-file) to provide this functionality.

# Install Unbound

The unbound package for Ubuntu is included in the `universe` repository. To enable `universe`, modify your `/etc/apt/sources.list` file to mirror the example file below. You'll need to uncomment the universe lines:

{{< file >}}
/etc/apt/sources.list
{{< /file >}}

> \#\# main & restricted repositories deb <http://us.archive.ubuntu.com/ubuntu/> karmic main restricted deb-src <http://us.archive.ubuntu.com/ubuntu/> karmic main restricted
>
> deb <http://security.ubuntu.com/ubuntu> karmic-security main restricted deb-src <http://security.ubuntu.com/ubuntu> karmic-security main restricted
>
> \#\# universe repositories deb <http://us.archive.ubuntu.com/ubuntu/> karmic universe deb-src <http://us.archive.ubuntu.com/ubuntu/> karmic universe deb <http://us.archive.ubuntu.com/ubuntu/> karmic-updates universe deb-src <http://us.archive.ubuntu.com/ubuntu/> karmic-updates universe
>
> deb <http://security.ubuntu.com/ubuntu> karmic-security universe deb-src <http://security.ubuntu.com/ubuntu> karmic-security universe

Next, make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

To install the packages for Unbound, issue the following command:

    apt-get install unbound

This will install and start the Unbound server on your system. Note that the unbound configuration files will be located at `/etc/unbound/unbound.conf`.

# Configure Unbound

### Configure Unbound Interfaces

In the default configuration, Unbound will only listen for requests on the local interface. If you want unbound to attach to additional interfaces, these interfaces must be configured manually. Possible interfaces include the public interface or the private networking interface. Specify those IP addresses after the `server:` directive in the following format:

{{< file-excerpt >}}
/etc/unbound/unbound.conf
{{< /file-excerpt >}}

> server:
> :   interface: 19.28.37.56 interface: 192.168.3.105
>
Modify these `interface:` directives to reflect the actual addresses assigned to your Linode. In this example, these directives would configure Unbound to listen for requests on the publicly accessible address `19.28.37.56`, and on the internal or private network address of `192.168.3.105`. If you specify interfaces other than the local interface using the `interface:` directive, it will disable the default local directive. If you would like to be able to perform queries on the local interface in addition to other interfaces, you will need to include an interface directive for `127.0.0.1`.

### Control Access to your Unbound Instance

By default, Unbound will only listen for and respond to requests for DNS queries on the localhost interface (i.e. from 127.0.0.1). Unbound must be configured to listen for requests on a given interface **and** be configured to allow requests from a given IP address before it can successfully provide DNS services. Insert lines similar to the following example into the `unbound.conf` file after the `server:` directive.

{{< file-excerpt >}}
/etc/unbound/unbound.conf
{{< /file-excerpt >}}

> server:
> :   access-control: 127.0.0.0/8 allow access-control: 192.168.0.0/16 allow\_snoop
>
>     access-control: 11.22.33.44/32 allow
>
>     access-control: 12.34.56.0/24 deny access-control: 34.0.0.0/8 refuse
>
Unbound uses CIDR notation to control access to the DNS resolver. This allows you permit or refuse DNS traffic to large or small groups of IP addresses in a simple and clear syntax. In the example above, we see a number of different access control approaches.

The first example will allow all requests from the `127.0.0.0/8` range, which covers all requests from localhost. This behavior mimics the default behavior of Unbound. The next example includes the `192.168.0.0/16` net block, or all IP addresses beginning with `192.168.`, which corresponds to the local "private" network. Specify this if you have private networking configured on your Linode and would like to allow multiple Linodes in the same data center to resolve domain addresses using your server.

The next example will allow all requests from the IP address `11.22.33.44`. To specify IP addresses in CIDR notation, simply append `/32` to the desired IP address. The remaining examples force Unbound to block access from two netblocks, or all IP addresses that begin with `12.34.56.` and the entire `34.` block. Specifying `deny` causes Unbound to drop all traffic from this address or addresses. By contrast, the `refuse` option returns an error message in response to requests from blocked sources.

To summarize, there are four possible access control behaviors:

1.  Unbound can `allow_snoop` traffic. This means that both recursive and nonrecusive requests will be filled when they originate from IP addresses belonging to specified netblocks. Nonrecursive request are needed to provide additional information for some tools, such as the `+trace` option of the `dig` utility.
2.  Unbound can `allow` traffic. This means that recursive requests will be filled when they originate from IP addresses belonging to specified netblocks.
3.  Unbound can `deny` traffic. In this case, unbound will simply drop traffic and offer no error message.
4.  Unbound can `refuse` traffic. This causes Unbound to send an error message in response to requests from disallowed sources.

When you have configured your Unbound server to acceptable parameters, issue the following command to restart Unbound:

    /etc/init.d/unbound restart

Unbound is now active and functional.

# Configure your System to Resolve DNS Using Unbound

Before you can begin using your Unbound instance to resolve DNS queries, you need to configure your `/etc/resolv.conf` file to point to the new resolver. You can remove all existing lines from this file or comment them by prepending hash marks (`#`) to every line.

**Important:** By default, Linodes use DHCP to assign networking settings, including the public IP address and DNS resolvers. For any systems that you intend to use a custom resolver with, you must follow our instructions for [static networking](/docs/networking/configuring-static-ip-interfaces/#static-network-configuration). This will prevent your `/etc/resolv.conf` file getting overwritten with the default resolvers after a system reboot.

If you're accessing your Unbound instance over the local interface, make sure your `/etc/resolv.conf` resembles the following:

{{< file >}}
/etc/resolve.conf
{{< /file >}}

> nameserver 127.0.0.1

If you're accessing your Unbound instance from another machine, modify the address to reflect the address on which Unbound is listening for requests. Ensure that Unbound's access control rules permit access from all clients that will be making requests from the server. If your Unbound instance is accessible on the public network, you can configure any machine on the Internet to resolve DNS using your Linode. While most Linux-based systems use the `/etc/resolve.conf` method for configuring DNS resolution, consult your operating system's networking configuration interface to reconfigure your DNS settings.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Unbound Home Page](http://www.unbound.net)
- [Wikipedia article on Classless Interdomain Routing](http://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing)
- [DNS Fundamentals](/docs/dns-guides/introduction-to-dns)
- [Linode Manager for DNS](/docs/dns-guides/configuring-dns-with-the-linode-manager)



