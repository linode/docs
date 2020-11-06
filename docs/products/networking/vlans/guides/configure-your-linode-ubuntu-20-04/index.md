---
author:
  name: Linode
  email: docs@linode.com
title: Configure Your Ubuntu 20.04 Linode
---

When you attach a Linode to a Virtual LAN and reboot the Linode, [Network Helper](/docs/guides/network-helper/#what-is-network-helper) generates network configurations for a Public Network Interface and a Private Network Interface. However, Network Helper **does not enable** the Private Network Interface. You must connect to your Linode and manually enable the Private Network Interface(s) before your Linode can communicate over a Virtual LAN's private network. See the [Configure a Linode to Communicate Over a Public and Private Network](#configure-a-linode-to-communicate-over-a-public-and-private-network) section of this guide for these steps.

If you want your Linode to **only have access to your Virtual LAN's Private Network**, you must connect to your Linode and manually configure it to disable the Public Network Interface that is automatically configure by Network Helper. See the [Configure a Linode to Communicate Over a Private Network](#configure-a-linode-to-communicate-over-a-private-network) for these steps.

{{< note >}}
For more details on the differences between Public and Private Network Interfaces, see [Linode Network Interfaces](/docs/products/networking/vlans/guides/linode-network-interfaces).
{{</ note >}}

## Configure a Linode to Communicate Over a Public and Private Network

{{< note >}}
- This section assumes that your Linode has Network Helper enabled. See [Network Helper Settings](/docs/guides/network-helper/#network-helper-settings) to learn how to verify your Linode's settings.

- Ensure you have rebooted your Linode after attaching it to a Virtual LAN and beginning the steps in this section.
{{</ note >}}

1. [Connect to your Linode via SSH](/docs/guides/getting-started/#connect-to-your-linode-via-ssh).

1. View your Linode's current Network Interfaces by issuing the following command:

        ip a

    Your output displays your Linode's Network Interfaces:

    {{< output >}}
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether f2:3c:92:9c:e3:f9 brd ff:ff:ff:ff:ff:ff
    inet 192.0.2.0/24 brd 192.0.2.0.255 scope global dynamic eth0
       valid_lft 77230sec preferred_lft 77230sec
    inet6 2600:3c04::f03c:92ff:fe9c:e3f9/64 scope global dynamic mngtmpaddr
       valid_lft 2592000sec preferred_lft 604800sec
    inet6 fe80::f03c:92ff:fe9c:e3f9/64 scope link
       valid_lft forever preferred_lft forever
3: eth1: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether ba:c2:6d:9c:e3:f9 brd ff:ff:ff:ff:ff:ff
  {{</ output >}}

1. Using a text editor, create a new Network Interface configuration file (`/etc/systemd/network/06-eth1.network`) with a configuration entry for the Linode's `eth1` Private Network Interface. Include the Interface's Private IP address and subnet mask (for example, `10.0.0.1/24`). You can find this value by following the steps in the [Access Your VLAN's Details](/docs/products/networking/vlans/guides/access-your-vlans-details) guide.

    {{< note >}}
The Private IP address must be unique within the Virtual LAN.
{{</ note >}}

      {{< file "/etc/systemd/network/06-eth1.network">}}
[Match]
Name=eth1

[Network]
DHCP=no
Address=10.0.0.1/24
      {{</ file >}}

1. Apply the new Network Interface configuration file.

        systemctl restart systemd-networkd

1. View the `eth1` Network Interface you just configured.

        ip a show eth1

    Your output displays information about your `eth1` Network Interface:

      {{< output >}}
3: eth1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether ba:c2:6d:8d:93:79 brd ff:ff:ff:ff:ff:ff
    inet 10.0.0.1/24 brd 10.0.0.255 scope global eth1
       valid_lft forever preferred_lft forever
    inet6 fe80::b8c2:6dff:fe8d:9379/64 scope link
       valid_lft forever preferred_lft forever
      {{</ output >}}

1. Repeat steps 1 - 5 for any other Linode that is part of your Private Network and has both a Public and a Private Network Interface.

Now that your Private Virtual LAN is configured, move on to the [Test Your Private Network](/docs/products/networking/vlans/guides/test-your-private-network) guide to verify that communication is successful between Linodes over the Virtual LAN.

## Configure a Linode to Communicate Over a Private Network

{{< note >}}
The steps in this section remove your Linode’s Public Network Interface, which make it inaccessible via SSH. You can use the [Linode Shell (Lish)](/docs/platform/manager/using-the-linode-shell-lish/) to connect to your Linode once your Public Network Interface has been disabled.
{{</ note >}}

1. [Connect to your Linode via SSH](/docs/guides/getting-started/#connect-to-your-linode-via-ssh).

1. View your Linode's current Network Interfaces by issuing the following command:

        ip a

    Your output displays your Linode's Network Interfaces:

    {{< output >}}
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether f2:3c:92:9c:e3:f9 brd ff:ff:ff:ff:ff:ff
    inet 192.0.2.0/24 brd 192.0.2.0.255 scope global dynamic eth0
       valid_lft 77230sec preferred_lft 77230sec
    inet6 2600:3c04::f03c:92ff:fe9c:e3f9/64 scope global dynamic mngtmpaddr
       valid_lft 2592000sec preferred_lft 604800sec
    inet6 fe80::f03c:92ff:fe9c:e3f9/64 scope link
       valid_lft forever preferred_lft forever
3: eth1: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group default qlen 1000
    link/ether ba:c2:6d:9c:e3:f9 brd ff:ff:ff:ff:ff:ff
  {{</ output >}}

1. Create a backup of your Network Interface's configuration file.

        mv /etc/systemd/network/05-eth0.network /etc/systemd/network/05-eth0.network.bak

1. Using a text editor, create a new Network Interface configuration file (`/etc/systemd/network/05-eth0.network`) with a configuration entry for the Linode's `eth0` Private Network Interface. Include the Interface's Private IP address and subnet mask (for example, `10.0.0.1/24`). You can find this value by following the steps in the [Access Your VLAN's Details](/docs/products/networking/vlans/guides/access-your-vlans-details) guide.

      {{< file "/etc/systemd/network/05-eth0.network">}}
[Match]
Name=eth0

[Network]
DHCP=no
Address=10.0.0.1/24
      {{</ file >}}

1. Enable your Network Interface configuration file's new settings.

    {{< note >}}
Running this command breaks your SSH connection since your Public Network Interface has been disabled by your new configurations.
{{</ note >}}

        systemctl restart systemd-networkd

1. Log into your Linode via Lish following the steps in the [Using the Linode Shell](/docs/platform/manager/using-the-linode-shell-lish/#use-a-terminal-application) guide. Ensure you consult the [Use a Web Browser](/docs/platform/manager/using-the-linode-shell-lish/#use-a-web-browser) and [Add Your Public Key](/docs/platform/manager/using-the-linode-shell-lish/#add-your-public-key) sections for additional methods to connect to Lish.

1. View the `eth0` Private Network Interface you just configured.

        ip a show eth0

    Your output displays information about your `eth1` Network Interface:

      {{< output >}}
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether ba:c2:6d:8d:86:e0 brd ff:ff:ff:ff:ff:ff
    inet 10.0.0.1/24 brd 10.0.0.255 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::b8c2:6dff:fe8d:86e0/64 scope link
       valid_lft forever preferred_lft forever
{{</ output >}}

1. Repeat steps 1 - 7 for any other Linode that is part of your Private Network and that you want to be configured with only a Private Network Interface.

{{< note >}}
To configure your same Linode to communicate over another Virtual LAN, create a new Network Interface configuration file using the next Network Interface alias that is available. (`eth1` and/or `eth2`).
{{</ note >}}

Now that your Private Virtual LAN is configured, move on to the [Test Your Private Network](/docs/products/networking/vlans/guides/test-your-private-network) guide to verify that communication is successful between Linodes over the Virtual LAN.