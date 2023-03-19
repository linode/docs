---
slug: mitigating-memcached-amplification-attacks
description: "This guide shows you how to secure your memcached instance so it's not exploited in any large-scale UDP reflection and amplification attacks across the internet."
keywords: ["memcached","deluge","amplification","memcrashed","denial","DoS","DDoS"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-03-02
modified_by:
  name: Linode
published: 2018-03-02
title: Mitigating memcached Amplification Attacks
tags: ["security"]
aliases: ['/security/mitigations/mitigating-memcached-amplification-attacks/']
authors: ["Linode"]
---

## What is Memcrashed?

Recently there has been a significant increase in large-scale UDP reflection and amplification attacks across the internet. These attacks were all using the [memcached](https://memcached.org/) protocol and originating from port `11211`. Attackers send ordinary-sized UDP packets from a spoofed IP address to a server running memcached. These requests elicit extremely large packet responses from memcached, which quickly congest the victim's network and results in a Denial of Service (DoS) scenario.

The vulnerability of memcached to aiding in massive Denial of Service attacks was presented at the POC 2017 security conference in Seoul, South Korea, in a paper titled [Deluge – How to generate 2TB/s reflection DDoS data flow via a family network](http://powerofcommunity.net/poc2017/shengbao.pdf). Dubbed [Memcrashed](https://blog.cloudflare.com/memcrashed-major-amplification-attacks-from-port-11211/) by Cloudflare, these attacks are now being observed in the wild, reaching several hundred gigabits per second of inbound UDP memcached traffic.

## What has Linode done to mitigate this attack?

* Inbound and outbound UDP `11211` traffic is blocked at the edge of our network. This is only a temporary solution.

* Your Linode can not send or receive UDP traffic on port `11211` from outside of Linode's network. Linodes can still communicate with each other over Linode's network using UDP `11211`.

## I'm running memcached. What do I do?

Memcached should not be exposed to the internet. There are a few basic steps you can take to secure your memcached instance.

* If you require memcached to communicate over a private network:

    1.  Bind memcached to a specific private IP address and port.

    2.  Configure your Linode's firewall accordingly. If you need help setting up a firewall, see [our firewall guides](/docs/security/firewalls/) for more information.

* If you do not require memcached to communicate over any network connection, disable UDP for memcached and ensure it is only listening on `localhost`.

### CentOS

1.  Memcached is configured by default to listen for incoming connections from any IP address on RHEL-based distributions, on both TCP and UDP. Change this to only listen on `localhost`, and as an added precaution, disable UDP for memcached.

    Edit the `OPTIONS` line in the memcached config file:

    {{< file "/etc/sysconfig/memcached" >}}
OPTIONS="-l 127.0.0.1 -U 0"
{{< /file >}}

2.  Restart memcached. If your system uses systemd:

        sudo systemctl restart memcached

    If your system uses SysV:

        sudo service memcached restart

### Debian and Ubuntu

1.  Memcached is configured to listen on `localhost` by default in Debian and Ubuntu. This configuration is not susceptible to the amplification exploit, but you should still verify you're not running a vulnerable setup:

        grep 127.0.0.1 /etc/memcached.conf

    That should return:

        -l 127.0.0.1

    As you can see, memcached is listening on the `localhost` IP address.

    You can also use `ss` or `netstat` to check your system's listening UDP ports:

        sudo ss -apu
        sudo netstat -lpu

    Memcached should again show that it's listening on `localhost`, or address `127.0.0.1`, as shown below:

        root@localhost:~# ss -aup
        State      Recv-Q Send-Q Local Address:Port                 Peer Address:Port
        UNCONN     0      0      127.0.0.1:11211                    *:*                     users:(("memcached",pid=5021,fd=30),("memcached",pid=5021,fd=29),("memcached",pid=5021,fd=28),("memcached",pid=5021,fd=27))

2.  Disable memcached's use of UDP as an additional precaution:

        cat <<EOT >> /etc/memcached.conf

        # Disable UDP
        -U 0
        EOT

3.  Restart memcached. If your system uses systemd:

        sudo systemctl restart memcached

    If your system uses SysV:

        sudo service memcached restart
