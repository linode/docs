---
slug: how-to-use-ipv6-on-apache
description: 'This guide explains how to configure and use IPv6 on the Apache or NGINX web servers along with useful IPv6-related tools'
keywords: ['IPv6 Apache','how to enable IPv6 on Apache','NGINX IPv6']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-16
modified_by:
  name: Linode
title: "Use IPv6 With Apache and NGINX"
title_meta: "How to Use IPv6 With Apache and NGINX"
external_resources:
- '[IPv6 rfc 8200](https://www.rfc-editor.org/rfc/rfc8200)'
- '[Wikipedia IPv6 page](https://en.wikipedia.org/wiki/IPv6)'
- '[Apache web server](https://httpd.apache.org/)'
- '[Apache documentation](https://httpd.apache.org/docs/)'
- '[Apache virtual host examples](https://httpd.apache.org/docs/2.4/vhosts/examples.html)'
- '[NGINX Website](https://www.nginx.com/)'
- '[NGINX Docs page](https://docs.nginx.com/)'
- '[RHEL documentation to enable IPv6](https://access.redhat.com/solutions/347693)'
authors: ["Jeff Novotny"]
---

The [Internet Protocol version 6 (IPv6)](https://www.rfc-editor.org/rfc/rfc8200) provides some performance advantages over IPv4 as well as additional features. On both the Apache and NGINX web servers, IPv6 is enabled by default. However, many users do not take full advantage of all IPv6 capabilities. This guide explains how to configure and use IPv6 on both the Apache and NGINX web server. It also introduces some useful IPv6 tools.

## What is IPv6?

IPv6 is the most recent version of the *Internet Protocol* (IP). It is defined in [RFC 8200](https://www.rfc-editor.org/rfc/rfc8200). Like the original IPv4 protocol, IPv6 provides consistent addressing for systems connected to the internet. This standard allows for a shared understanding of how to route data packets from source to destination.

IPv6 was implemented as a solution to IPv4 address exhaustion, meaning the internet was quickly depleting its pool of available IPv4 addresses. IPv6 is intended as a full replacement for IPv4, but the two systems continue to be used together. Many systems are provisioned with both IPv4 and IPv6 addresses. End users are not typically aware of what protocol they are using to access a given resource.

## Why to Use IPv6

Many system administrators prefer to use IPv6 due to its improved performance and additional features. Here are some of the advantages of IPv6, compared to IPv4.

-   Much larger address space of about 340 duodecillion, or `3.4 × 10^38`, addresses. This allows addresses to be liberally assigned and lets organizations receive large address blocks.
-   Better speed and performance. Web page load times are 5% to 15% faster with IPv6.
-   The header is smaller than the one used in IPv4, so IPv6 uses bandwidth more efficiently.
-   Better route aggregation, which limits the size of routing tables.
-   Improved multicast capabilities.
-   Security enhancements, including the mandatory use of *Internet Protocol Security* (IPSec) and optional data consistency verification.

Although IPv4 and IPv6 are not directly compatible, several transitional and upgrade strategies are available.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Configure IPv6

### How to Configure IPv6 on Apache

The following sections explain how to configure IPv6 on an Apache web server. IPv6 is enabled on Apache by default. Users do not have to do anything else to start using IPv6. However, it is possible to adjust or refine the default configuration.

Before proceeding, ensure Apache is already installed and running on the system. Enter the command `apache2 -v` to see the currently installed version. If the system displays the version number, Apache is already running on the system. If the system displays the error message `Command 'apache2' not found`, use the command `sudo apt install apache2` to install it. These instructions are geared towards Ubuntu users, but are generally valid for all Linux distributions.

{{< note respectIndent=false >}}
On some distributions, including CentOS/RHEL, IPv6 must be enabled on a system-wide level. See the [RHEL documentation](https://access.redhat.com/solutions/347693) for details.
{{< /note >}}

The standard `ports.conf` configuration includes the directives `Listen 80` and `Listen 443`. This tells Apache to listen for HTTP and HTTPS connections for all addresses on well-known ports `80` and `443`. In practice, many administrators configure Apache to only listen to the system IPv4 and IPv6 addresses. To force Apache to only listen for a specific IPv6 address, add the address to the `ports.conf` file. Additionally, use this technique to listen for different IPv6 addresses on different ports.

Follow these steps to configure IPv6 addresses on Apache.

1.  Ensure Apache is operational. The `systemctl status` command should return a value of `active`.

        sudo systemctl status apache2

    {{< output >}}
apache2.service - The Apache HTTP Server
    Loaded: loaded (/lib/systemd/system/apache2.service; enabled; vendor preset: enabled)
    Active: active (running) since Fri 2022-09-23 21:18:57 UTC; 9min ago
{{< /output >}}

2.  For better security, enable and configure the `ufw` firewall. Allow the `Apache Full` profile to permit HTTP and HTTPS connections through the firewall. `OpenSSH` connections must also be allowed. Enable `ufw` after making all changes. Use the `ufw status` command to validate the settings.

        sudo ufw allow OpenSSH
        sudo ufw allow in "Apache Full"
        sudo ufw enable
        sudo ufw status

    {{< output >}}
Status: active
To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Apache Full                ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
Apache Full (v6)           ALLOW       Anywhere (v6)
{{< /output >}}

3.  Use the Linux `ip` command to determine the IPv6 address of the system. The `ip` command replaces the older and now deprecated `ifconfig` command. To narrow down the output, `grep` for the `inet6` family in the output. The output typically displays several entries. Use the address that is shown as having `scope global`. In the following example, the second entry represents the relevant IPv6 system address.

        ip addr show | grep inet6

    {{< output >}}
inet6 ::1/128 scope host
inet6 2001:db8::f03c:93ff:fe25:6762/64 scope global dynamic mngtmpaddr noprefixroute
inet6 fe80::f03c:93ff:fe25:6762/64 scope link
{{< /output >}}


4.  Edit the `ports.conf` file and add `Listen` directives for the addresses on port `80` for HTTP, and port `443` for HTTPS. Enclose the IPv6 address in brackets `[]` and follow it with the `:` symbol and the port number. To listen for both IPv4 and IPv6 traffic, add both addresses. To restrict access to IPv6, do not include the IPv4 entry. The following example demonstrates how to configure Apache to only listen for specific requests for its IPv6 and IPv4 addresses.

    {{< note respectIndent=false >}}
On older installations of Apache, add this configuration to `httpd.conf`.
{{< /note >}}

        sudo vi /etc/apache2/ports.conf

    {{< file "/etc/apache2/ports.conf" aconf >}}
Listen [2001:db8::f03c:93ff:fe25:6762]:80
Listen 192.0.2.162:80

<IfModule ssl_module>
    Listen [2001:db8::f03c:93ff:fe25:6762]:443
    Listen 192.0.2.162:443
</IfModule>

<IfModule mod_gnutls.c>
    Listen [2001:db8::f03c:93ff:fe25:6762]:443
    Listen 192.0.2.162:443
</IfModule>
{{< /file >}}

5.  Before restarting Apache, run the `configtest` script to ensure the syntax is valid.

        sudo apache2ctl configtest

    {{< output >}}
Syntax OK
{{< /output >}}

6.  Restart the Apache server to apply the changes.

        sudo systemctl restart apache2

7.  Verify Apache is still `active`.

        sudo systemctl status apache2

    {{< output >}}
apache2.service - The Apache HTTP Server
    Loaded: loaded (/lib/systemd/system/apache2.service; enabled; vendor preset: enabled)
    Active: active (running) since Sat 2022-09-24 19:05:52 UTC; 7s ago
{{< /output >}}

8.  Use the `ss` "socket statistics" command to confirm the new sockets are in `LISTEN` mode.

        sudo ss -ltpn

    {{< output >}}
State     Recv-Q    Send-Q                          Local Address:Port       Peer Address:Port    Process
...
LISTEN    0         511                            192.0.2.162:80              0.0.0.0:*        users:(("apache2",pid=9303,fd=4),("apache2",pid=9302,fd=4),("apache2",pid=9301,fd=4))
...
LISTEN    0         511          [2001:db8::f03c:93ff:fe25:6762]:80                 [::]:*        users:(("apache2",pid=9303,fd=3),("apache2",pid=9302,fd=3),("apache2",pid=9301,fd=3))
{{< /output >}}

9.  As a final test, enter the system IPv6 address in the browser, enclosed between the `[]` brackets. You should see the default web page for the system. If both IPv4 and IPv6 addresses are configured, the host should also respond to a request for the IPv4 address.

        http://[2001:db8::f03c:93ff:fe25:6762]/

    {{< note respectIndent=false >}}
To host multiple domains on the same system using different ports or IP addresses, additional changes to the virtual host files are necessary. See the [Apache virtual host examples](https://httpd.apache.org/docs/2.4/vhosts/examples.html) for more complete information. Virtual host changes are not necessary if all domains are accessed using the same IPv6 address and port.
{{< /note >}}

### How to Configure IPv6 on NGINX

IPv6 is already enabled on NGINX. No further steps have to be taken to use IPv6. However, it is possible to edit the NGINX configuration to only accept configurations for a specified address. Ensure NGINX is already installed on the system. If not, install it using `sudo apt install nginx`. To configure IPv6 settings on NGINX, follow these steps.

1.  Ensure NGINX is `active` using the `systemctl status` command.

        sudo systemctl status nginx

    {{< output >}}
nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset:>
     Active: active (running) since Sun 2022-09-25 17:07:13 UTC; 17s ago
{{< /output >}}

2.  NGINX should be properly secured using the `ufw` firewall. The `Nginx Full` profit permits HTTP and HTTPS access. Enter the following commands to grant NGINX firewall access.

        sudo ufw allow OpenSSH
        sudo ufw allow in "Nginx Full"
        sudo ufw enable
        sudo ufw status

    {{< output >}}
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
Nginx Full (v6)            ALLOW       Anywhere (v6)
{{< /output >}}

3.  To determine the system's IPv6 address, use the Linux `ip` command. To restrict the output to IPv6 addresses, use the `grep` command and search for `inet6` in the output. The relevant address is the one having `scope global`. This is the second address in the following results.

        ip addr show | grep inet6

    {{< output >}}
inet6 ::1/128 scope host
inet6 2001:db8::f03c:93ff:fe64:3a0c/64 scope global dynamic mngtmpaddr noprefixroute
inet6 fe80::f03c:93ff:fe64:3a0c/64 scope link
{{< /output >}}

4.  To force NGINX to listen only to the default IPv6 address, add it to the main `server` block. Enclose the IPv6 address in square brackets `[]`. The `server` block containing the address might be included in either the `nginx.conf` file or in a virtual host file. For instance, if the default virtual host is used, add the configuration to `/etc/nginx/sites-enabled/default`. If the domain uses its own virtual host, add the configuration there. It is easier to use an existing `server` block because multiple server blocks and default servers might conflict with each other. Add the following configuration to the `server` block as follows.

    {{< file "/etc/nginx/sites-enabled/default" aconf >}}
server {
    listen 80 default_server;
    listen [2001:db8::f03c:93ff:fe64:3a0c]:80 default_server;
...
    }
{{< /file >}}

5.  **Optional:** To only listen for IPv6 requests, add the flag `ipv6only=on` to the IPv6 server configuration and delete the `listen 80` directive. In this configuration, the `server` block should resemble the following example.

    {{< file "/etc/nginx/sites-enabled/default" aconf >}}
server {
    listen [2001:db8::f03c:93ff:fe64:3a0c]:80 ipv6only=on default_server;
...
}
{{< /file >}}

6.  Before restarting the web server, use the NGINX test script to search for errors.

        sudo nginx -t

    {{< output >}}
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
{{< /output >}}

7.  Restart NGINX to incorporate the changes.

        sudo systemctl restart nginx

8.  Use the `ss` command to confirm there is a socket in the `LISTEN` state for the IPv6 address on the designated port.

        sudo ss -ltpn

    {{< output >}}
State  Recv-Q Send-Q                     Local Address:Port   Peer Address:Port Process
LISTEN 0      4096                       127.0.0.53%lo:53          0.0.0.0:*     users:(("systemd-resolve",pid=454,fd=14))
LISTEN 0      128                              0.0.0.0:22          0.0.0.0:*     users:(("sshd",pid=586,fd=3))
LISTEN 0      511     [2001:db8::f03c:93ff:fe64:3a0c]:80             [::]:*     users:(("nginx",pid=3928,fd=6),("nginx",pid=3927,fd=6))
LISTEN 0      128                                 [::]:22             [::]:*     users:(("sshd",pid=586,fd=4))
{{< /output >}}

9.  To confirm the server is reachable using its IPv6 address, enter the address in a browser. Enclose the address in square `[]` brackets. If the `ipv6only=on` flag is on, requests for the IPv4 address should not resolve.

        [2001:db8::f03c:93ff:fe64:3a0c]

## Adding an IPv6 Address to the Domain DNS Records

To enforce the use of an IPv6 address to access a hosted domain, update the DNS record for the domain. Change the DNS record to use the IPv6 address instead of the IPv4 address. For information on domain names and pointing the domain name to a Linode, see the [Linode DNS Manager guide](/docs/products/networking/dns-manager/). All DNS changes take some time to propagate across the internet. Changing the DNS record does not affect direct access to the node using the raw IPv4 or IPv6 addresses.

## Additional IPv6 Tools

For IPv4 networks, several handy tools are available to debug and monitor networks. For IPv6, equivalent tools are available. These often have similar names to their IPv4 equivalents, sometimes with an extra `6` at the end.

-   To restrict the output of the `ip` command to only list IPv6 addresses, use the `-6` option.

        ip -6 addr show

    {{< output >}}
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 state UNKNOWN qlen 1000
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP qlen 1000
    inet6 2001:db8::f03c:93ff:fe25:6762/64 scope global dynamic mngtmpaddr noprefixroute
       valid_lft 5133sec preferred_lft 1533sec
    inet6 fe80::f03c:93ff:fe25:6762/64 scope link
       valid_lft forever preferred_lft forever
{{< /output >}}

-   Likewise, the `ss` command accepts the same flag. The command `ss -6` only shows socket statistics for IPv6 addresses.

        ss -6ltpn

    {{< output >}}
State          Recv-Q         Send-Q                                    Local Address:Port                 Peer Address:Port        Process
LISTEN         0              128                                                [::]:22                           [::]:*
LISTEN         0              511                    [2001:db8::f03c:93ff:fe25:6762]:80                           [::]:*
{{< /output >}}

-   No special configuration is required for the `ufw` firewall. The `Nginx Full` profile permits both IPv4 and IPv6 connections.

-   The `nslookup` command is used to discover DNS information. The same command returns information about both IPv4 and IPv6 addresses, if any.

        nslookup google.com

    {{< output >}}
Server:     127.0.0.53
Address:    127.0.0.53#53

Non-authoritative answer:
Name:   google.com
Address: 142.250.187.206
Name:   google.com
Address: 2a00:1450:4009:816::200e
{{< /output >}}

-   `nslookup` can be used for reverse lookups of IPv6 addresses. The output displays the address in reverse order due to `nslookup` display conventions.

        nslookup 2620:0:862:ed1a::1

    {{< output >}}
1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.a.1.d.e.2.6.8.0.0.0.0.0.0.2.6.2.ip6.arpa name = text-lb.esams.wikimedia.org
{{< /output >}}

-   There are IPv6 variants of the popular `ping` and `traceroute` utilities. To `ping` an IPv6 address, use `ping6`.

        ping6 -c 3 2620:0:862:ed1a::1

    {{< output >}}
PING 2620:0:862:ed1a::1(2620:0:862:ed1a::1) 56 data bytes
64 bytes from 2620:0:862:ed1a::1: icmp_seq=1 ttl=56 time=6.44 ms
64 bytes from 2620:0:862:ed1a::1: icmp_seq=2 ttl=56 time=6.54 ms
64 bytes from 2620:0:862:ed1a::1: icmp_seq=3 ttl=56 time=6.55 ms

--- 2620:0:862:ed1a::1 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2004ms
rtt min/avg/max/mdev = 6.442/6.510/6.550/0.048 ms
{{< /output >}}

-   The IPv6 equivalent of `traceroute` is `traceroute6`. This utility is not pre-installed on Ubuntu. To install it, use `sudo apt install traceroute`.

        traceroute6 wikpedia.org

    {{< output >}}
traceroute to wikpedia.org (2620:0:862:ed1a::3), 30 hops max, 80 byte packets
1  2600:3c0f:7::1460 (2600:3c0f:7::1460)  0.667 ms  0.618 ms  0.603 ms
2  2600:3c0f:7:35::8 (2600:3c0f:7:35::8)  2.537 ms 2600:3c0f:7:35::7 (2600:3c0f:7:35::7)  3.104 ms  3.216 ms
3  2600:3c0f:7:32::2 (2600:3c0f:7:32::2)  0.633 ms  0.621 ms 2600:3c0f:7:32::1 (2600:3c0f:7:32::1)  0.699 ms
4  2600:3c0f:7:42::2 (2600:3c0f:7:42::2)  0.767 ms  0.755 ms 2600:3c0f:7:42::1 (2600:3c0f:7:42::1)  0.774 ms
5  lonap.he.net (2001:7f8:17::1b1b:1)  1.933 ms * *
{{< /output >}}

## Conclusion

More organizations are beginning to use IPv6 in their networks instead of IPv4 due to its larger address space, enhanced functionality, and better performance. It is easy to use IPv6 on Apache or NGINX because IPV6 is already enabled by default on both platforms. However, both the NGINX and Apache IPv6 configurations can be edited for better security and more flexibility. To properly monitor IPv6 performance and debug issues, several additional tools are available. See the [Apache](https://httpd.apache.org/docs/) and [NGINX](https://docs.nginx.com/) documentation for more information about IPv6.
