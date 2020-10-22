---
author:
  name: Linode
  email: docs@linode.com
title: Configure Your Linode CentOS 8
---

Configure Your Linode to Communicate Over a Public and Private Network
When you attache a Linode to a Virtual LAN and reboot it Linode Network helper automatically configures your
[Linode Network Helper](/docs/guides/network-helper/#what-is-network-helper) automatically configures your public [Network Interface](/docs/products/networking/vlans/guides/linode-network-interfaces), however, you need to manually configure your Private Network Interface(s) so they can communicate across a Virtual LAN. Follow the steps outlined in this guide for each Linode that you want to communicate over a Virtual LAN.

{{< note >}}
Ensure you have rebooted your Linode prior to beginning the steps in this guide.
{{</ note >}}

## Configure a Linode to Communicate Over a Public and Private Network

### CentOS

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

1. Using a text editor, create a new Network Interface configuration file (`/etc/network/interfaces.d/eth1`) with a configuration entry for the Linode's `eth1` Private Network Interface along with the Interface's Private IP address and subnet mask (for example, `10.0.0.1/24`). You can find this value by following the steps in the [Access Your VLAN's Details](/docs/products/networking/vlans/guides/access-your-vlans-details) guide.

    {{< note >}}
The Private IP address must be unique within the Virtual LAN.
{{</ note >}}

    {{< note >}}
The location of the Network Interface configuration file varies based on the Linux distribution deployed to your Linode. The example below was created using a Debian 10 Linode. See our [Network Helper](/docs/platform/network-helper/#what-files-are-modified) guide for information on where different distributions store Network Interface configuration files.
    {{</ note >}}

      {{< file "/etc/sysconfig/network-scripts/ifcfg-eth1">}}
DEVICE="eth1"
NAME="eth1"
ONBOOT="yes"
BOOTPROTO="none"
IPADDR0=10.0.0.1
PREFIX0=24
      {{</ file >}}

1. Apply the new Network Interface configuration file.

        ifup eth1

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

Now that your Private Virtual LAN is configured, move on to the [Test Your Private Network](/docs/products/networking/vlans/guides/test-your-private-network) section to verify that communication is successful between Linodes over the LAN.

## Configure a Linode to Communicate Over a Private Network

The steps in this section are for a Linode that has a Private Network Interface that is attached to a LAN and does **not** have a Public Network Interface. Linodes under this circumstance are not reachable via SSH and their Public IPv4 address, so you must use the [Linode Shell (Lish)](/docs/platform/manager/using-the-linode-shell-lish/) to manually configure its Private Network Interface. Lish provides console access to your Linodes, which allows you to connect to a Linode even when you are unable to connect to it directly via SSH

1. Disable Network Helper for your Linode. This requires you to send a request to the [Update Configuration Profile](https://developers.linode.com/api/v4/linode-instances-linode-id-configs-config-id/#put) endpoint to change the `network` field's value from `true` to `false`. Ensure you replace `{linodeId}` and `{configId}` with your own ID numbers.

    {{< disclosure-note "Retrieve your {linodeId} and {configId}" >}}
Retrieve your `{linodeId}` by sending a request to the [List Linodes](https://developers.linode.com/api/v4/linode-instances) endpoint.

    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/linode/instances

Find your `{configId}` by sending a request to the [List Configuration Profiles](https://developers.linode.com/api/v4/linode-instances-linode-id-configs) endpoint. Replace `{linodeId}` with your own Linode's ID.

    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/linode/instances/{linodeId}/configs

    {{</ disclosure-note >}}

        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X PUT -d '{
              "helpers": {
                "network": false
              }
            }' \
            https://api.linode.com/v4/linode/instances/{linodeId}/configs/{configId}

    The API returns a similar response (part of the response is truncated for brevity):

    {{< output >}}
    {
      "id": 4567,
    ...
    "helpers": {
        ...
        "network": false,
        ...
      },
      ...
    }
    {{</ output >}}

1. Reboot your Linode so that your Configuration Profile updates can take effect.

        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X POST \
            https://api.linode.com/v4/linode/instances/{linodeId}/reboot

1. Log into your Linode via Lish following the steps in the [Using the Linode Shell](/docs/platform/manager/using-the-linode-shell-lish/#use-a-terminal-application) guide. Ensure you consult the [Use a Web Browser](/docs/platform/manager/using-the-linode-shell-lish/#use-a-web-browser) and [Add Your Public Key](/docs/platform/manager/using-the-linode-shell-lish/#add-your-public-key) sections for additional methods to connect to Lish.

1. Once you have accessed your Linode via Lish, view your Linode's current Network Interfaces by issuing the following command:

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

1. Using a text editor, create a new Network Interface configuration file (`/etc/network/interfaces.d/eth0`) with a configuration entry for the Linode's `eth0` Private Network Interface along with the Interface's Private IP address and subnet mask. The Private IP address must be unique within the LAN. The subnet mask that you use is the same as your LAN's `cidr_block`.

    {{< note >}}
The location of the Network Interface configuration file varies based on the Linux distribution deployed to your Linode. The example below was created using a Debian 10 Linode. See our [Network Helper](/docs/platform/network-helper/#what-files-are-modified) guide for information on where different distributions store Network Interface configuration files.
    {{</ note >}}

      {{< file "/etc/network/interfaces.d/eth0">}}
iface eth0 inet static
    address 10.0.0.1/24
      {{</ file >}}

    {{< note >}}
Send a request to the List Interfaces endpoint to view your Linode's `eth0` Private IP address. Replace `eth0` with your Linode's ID.

    curl -H "Authorization: Bearer $TOKEN" \
      https://api.linode.com/v4beta/linode/instances/{linodeId}/interfaces
{{</ note >}}

1. Update your Linode's `/etc/network/interfaces` file to **remove** the `eth0` entry created by Network Helper when the Linode was first deployed. Referring to the example, remove or comment out lines 16 - 18.

      {{< file "/etc/network/interfaces">}}
# Generated by Linode Network Helper
...
# /etc/network/interfaces

auto lo
iface lo inet loopback

source /etc/network/interfaces.d/*

auto eth
allow-hotplug eth

iface eth inet6 auto

# Remove this entry
iface eth inet static
    address 192.0.2.0/24
    gateway 192.0.2.0.1
      {{</ file >}}

1. Disable the `eth0` Network Interface. This is required in order to remove the `eth0` entry that was created by Network Helper when the Linode was first deployed.

        ifdown eth0

1. Enable the `eth0` Network Interface to apply the Private LAN settings you configured in step 5.

        ifup eth0

1. View the `eth1` Network Interface you just configured.

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

Now that your Private LAN is configured, move on to the [Test Your Private Network](#test-your-private-network) section to verify that communication is successful between Linodes over the LAN.