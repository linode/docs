---
author:
  name: Linode
  email: docs@linode.com
title: Test Your Private Network
description: "Use the steps in this guide to ensure that a Linode can successfully communicate over a Virtual LAN''s private network."
---
Once you have configured more than one Linode to communicate over your Virtual LAN's private network, verify that you can communicate from one Linode to another within the private network.

1. If your Linode has a public network configured, connect to your Linode via SSH

        ssh username@192.0.2.0

    If your Linode does not have a public network configured, connect to your Linode via Lish following the steps in the [Using the Linode Shell](/docs/platform/manager/using-the-linode-shell-lish/#use-a-terminal-application) guide. Ensure you consult the [Use a Web Browser](/docs/platform/manager/using-the-linode-shell-lish/#use-a-web-browser) and [Add Your Public Key](/docs/platform/manager/using-the-linode-shell-lish/#add-your-public-key) sections for additional methods to connect to Lish.

1. Ping another Linode within the Virtual LAN's private network via its Private IP address.

    {{< note >}}
Find a list of all the Linodes connected to your Virtual LAN and their private IP addresses from your [Virtual LAN's details page](/docs/products/networking/vlans/guides/access-your-vlans-details/).
{{</ note >}}

        ping 10.0.0.1

    Your output should display ICMP packets successfully transmitted and received from this Linode to the secondary Linode in the Private Network.

    {{< output >}}
PING 10.0.0.1 (10.0.0.1) 56(84) bytes of data.
64 bytes from 10.0.0.1: icmp_seq=1 ttl=64 time=0.733 ms
64 bytes from 10.0.0.1: icmp_seq=2 ttl=64 time=0.294 ms
^C
--- 10.0.0.1 ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 18ms
rtt min/avg/max/mdev = 0.294/0.513/0.733/0.220 ms
    {{</ output >}}