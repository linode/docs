---
slug: ip-failover
author:
  name: Linode
  email: docs@linode.com
description: "This guide discusses how to enable failover on a Linode Compute Instance through using our IP Sharing feature with software such as keepalived or FRR."
keywords: ['IP failover','IP sharing','elastic IP']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-23
modified: 2022-04-06
modified_by:
  name: Linode
title: "Configuring Failover on a Compute Instance"
contributor:
  name: Linode
---

In cloud computing, *failover* is the concept of rerouting traffic to a backup system should the original system become inaccessible. Linode Compute Instances support failover through the [IP Sharing](/docs/guides/managing-ip-addresses/#configuring-ip-sharing) feature. This allows two Compute Instances to share a single IP address, one serving as the *primary* and one serving as the *secondary*. If the primary Compute Instance becomes unavailable, the shared IP address is seamlessly routed to the secondary Compute Instance (fail*over*). Once the primary instance is back online, the IP address route is restored (fail*back*).

## Why Should I Implement Failover?

There's always a possibility that your Compute Instance may become inaccessible, perhaps due to a spike in traffic, your own internal configuration issues, a natural disaster, or planned (or unplanned) maintenance. When this happens, any websites or services hosted on that instance would also stop working. Failover provides a mechanism for protecting your services against a single point of failure.

{{< note >}}
For many production applications, you may want to consider a load balancing tool that goes beyond basic failover. Linode's [NodeBalancers](/docs/products/networking/nodebalancers/) combines load balancing with built-in failover. You can also configure load balancing software, such as [HAProxy](https://www.linode.com/docs/guides/how-to-use-haproxy-for-load-balancing/), on your own Compute Instances and utilize our IP Sharing feature to provide failover.
{{</ note >}}

## IP Sharing Availability

Within Linode's platform, failover is configured by first enabling [IP Sharing](/docs/guides/managing-ip-addresses/#configuring-ip-sharing) and then configuring software on both the primary and secondary Compute Instances. IP Sharing availability varies by data center. Review the list below to learn which data centers support IP Sharing and how it can be implemented.

| Data Center | IP Sharing Support | Software | ID |
| -- | -- | -- | -- |
| Atlanta (Georgia, USA) | *Not supported* | - | 4 |
| Dallas (Texas, USA) | Legacy method (ARP) | [keepalived](/docs/guides/ip-failover-keepalived/) | 2 |
| **Frankfurt (Germany)** | **New method (BGP)** | **lelastic** | 10 |
| Fremont (California, USA) | Legacy method (ARP) | [keepalived](/docs/guides/ip-failover-keepalived/) | 3 |
| London (United Kingdom) | Legacy method (ARP) | [keepalived](/docs/guides/ip-failover-keepalived/) | 7 |
| Mumbai (India) |  *Not supported* | - | 14 |
| Newark (New Jersey, USA) | Legacy method (ARP) | [keepalived](/docs/guides/ip-failover-keepalived/) | 6 |
| Singapore | Legacy method (ARP) | [keepalived](/docs/guides/ip-failover-keepalived/) | 9 |
| Sydney (Australia) |  *Not supported* | - | 16 |
| Tokyo (Japan) | Legacy method (ARP) | [keepalived](/docs/guides/ip-failover-keepalived/) | 11 |
| Toronto (Canada) |  *Not supported* | - | 15 |

- **New IP Sharing Method (BGP):** Supports IPv4 and IPv6 failover. This is currently being rolled out across our fleet in conjunction with our [planned network infrastructure upgrades](/docs/guides/network-infrastructure-upgrades/). Since it is implemented using BGP routing, customers can configure it on their Compute Instances using the Linode provided lelastic tool or FRR. Follow the instructions within this guide.

- **Legacy IP Sharing Method (ARP):** Supports IPv4 failover within limited data centers. Since it is arp-based, customers can configure it on their Compute Instances using a service like keepalived. Follow the instructions within the [keepalived](/docs/guides/ip-failover-keepalived/) guide.

{{<note>}}
IP failover for VLAN IP addresses is supported within every data center where VLANs are available. This feature does not depend on Linode's IP Sharing feature and is configurable through keepalived.
{{</note>}}

## Configure Failover

The instructions within this guide enable you to configure failover using IP Sharing and the [lelastic](https://github.com/linode/lelastic) tool, a Linode provided tool based on GoBGP that automates much of the configuration. If you prefer to manually configure failover software, follow the [Configuring IP Failover over BPG using FRR](/docs/guides/ip-failover-bgp-frr/) guide or use any BGP client that you wish.

{{<note>}}
If your data center supports the legacy method (ARP), use the [Configuring IP Failover using keepalived](/docs/guides/ip-failover-keepalived/) guide instead. That guide should also be used when setting up failover for VLAN IP addresses.
{{</note>}}

To configure failover, complete each section in the order shown:

1. [Create and Share the Shared IP Address](#create-and-share-the-shared-ip-address)
1. For *each* Compute Instance:
      - [Add the Shared IP to the Networking Configuration](#add-the-shared-ip-to-the-networking-configuration)
      - [Install and Configure Lelastic](#install-and-configure-lelastic)
1. [Test Failover](#test-failover)

### Create and Share the Shared IP Address

1. Log in to the [Cloud Manager](https://cloud.linode.com/).

1. Determine which two Compute Instances are to be used within your failover setup. They both must be located in the same data center. If you need to, create those Compute Instances now and allow them to fully boot up.

    {{< note >}}
To support this new BGP method of IP Sharing and failover, your Compute Instance must be assigned an IPv6 address. This is not an issue for most instances as an IPv6 address is assigned during deployment. If your Compute Instance was created *before* IPv6 addresses were automatically assigned, contact [Linode Support](https://www.linode.com/support/) if you would like to enable IP Sharing within a data center that uses BGP-based failover.
{{</ note >}}

1.  Disable Network Helper on both instances. For instructions, see the [Network Helper](/docs/guides/network-helper/#single-per-linode) guide.

1. Add an additional IPv4 address _or_ IPv6 range (/64 or /56) to one of the Compute Instances. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/#adding-an-ip-address) guide for instructions. Make a note of the newly assigned IP address. *Each additional IPv4 address costs $1 per month*.

1. On the *other* Compute Instance, add the newly assigned IPv4 address or IPv6 range as a *Shared IP* using Linode's **IP Sharing** feature. See [Managing IP Addresses](/docs/guides/managing-ip-addresses/#configuring-ip-sharing) for instructions on configuring IP sharing.

### Add the Shared IP to the Networking Configuration

Adjust the network configuration file on *each* Compute Instance, adding the shared IP address and restarting the service.

1.  Log in to the Compute Instance using [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/).

1.  Add the shared IP address to the system's networking configuration file. Within the instructions for your distribution below, open the designated file with a text editor (such as [nano](/docs/guides/use-nano-to-edit-files-in-linux/) or vim) and add the provided lines to the end of that file. When doing so, make the following replacements:

    - **[shared-ip]**: The IPv4 address you shared or an address from the IPv6 range that you shared. You can choose any address from the IPv6 range. For example, within the range *2001:db8:e001:1b8c::/64*, the address `2001:db8:e001:1b8c::1` can be used.
    - **[prefix]**: For an IPv4 address, use `32`. For an IPv6 address, use either `56` or `64` depending on the size of the range you are sharing.

    {{< note >}}
Review the configuration file and verify that the shared IP address does not already appear. If it does, delete associated lines before continuing.
{{</ note >}}

    -   **Ubuntu 18.04 LTS and newer**: Using [netplan](https://netplan.io/). The entire configuration file is shown below, though you only need to copy the `lo:` directive.

        {{< file "/etc/netplan/01-netcfg.yaml" >}}
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: yes
    lo:
      match:
        name: lo
      addresses:
        - [shared-ip]/[prefix]
{{</ file >}}

        To apply the changes, reboot the instance or run:

            sudo netplan apply

    -   **CentOS/RHEL**: Using [NetworkManager](https://en.wikipedia.org/wiki/NetworkManager). Since NetworkManager does not support managing the loopback interface, the Shared IP must instead be added to the eth0 interface. When doing so, you must also add the `-allifs` option to the lelastic command (discussed in a separate section below)

        {{< file "/etc/sysconfig/network-scripts/ifcfg-eth0" >}}
...
# Add Shared IPv4 Address
IPADDR1=[shared-ip]
PREFIX1=32

# Or Add Shared IPv6 Address
IPV6ADDR_SECONDARIES=[shared-ip]/[prefix]
{{</ file >}}

        To apply the changes, reboot the instance.

    -   **Debian and Ubuntu 16.04 (and older)**: Using [ifupdown](https://manpages.debian.org/unstable/ifupdown/ifup.8.en.html).

        {{< file "/etc/network/interfaces" >}}
...
# Add Shared IP Address
iface lo inet static
    address [shared-ip]/[prefix]
{{</ file >}}

        To apply the changes, reboot the instance or run:

            sudo ifdown lo && sudo ip addr flush lo && sudo ifup lo

        If you receive the following output, you can safely ignore it: *RTNETLINK answers: Cannot assign requested address*.

### Install and Configure Lelastic

Next, we need to configure the failover software on *each* Compute Instance. For this, the lelastic utility is used.

1.  Log in to the Compute Instance using [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/).

1.  Download and install the [lelastic](https://github.com/linode/lelastic) utility from GitHub by running the following commands:

        curl -LO https://github.com/linode/lelastic/releases/download/v0.0.4/lelastic.gz
        gunzip lelastic.gz
        chmod 755 lelastic
        sudo mv lelastic /usr/local/bin/

    {{< note >}}
**CentOS/RHEL:** If running a distribution with SELinux enabled (such as most CentOS/RHEL distributions), you must also set the SELinux type of the file to `bin_t`.

    sudo chcon -t bin_t /usr/local/bin/lelastic
{{</ note >}}

1.  Next, prepare the command to configure BGP routing through lelastic. Replace *[id]* with the ID corresponding to your data center in the [table above](/docs/guides/ip-failover/#ip-failover-support) and *[role]* with either `primary` or `secondary`. You do not need to run this command, as it is configured as a service in the following steps.

        lelastic -dcid [id] -[role] &

    {{< note >}}
**CentOS/RHEL:** Since the Shared IP address is configured on the *eth0* interface for NetworkManager distributions (like CentOS/RHEL), you must add the `-allifs` option to the lelastic command. This should also be done for any system where the Shared IP is added to an interface other than *lo* (loopback).

    lelastic -allifs -dcid [id] -[role] &
{{</ note >}}

    See [Test Failover](#test-failover) to learn more about the expected behavior for each role.

1.  Create and edit the service file using either nano or vim.

        sudo nano /etc/systemd/system/lelastic.service

1.  Paste in the following contents and then save and close the file. Replace *$command* with the lelastic command you prepared in a previous step.

    {{< file "/etc/systemd/system/lelastic.service" >}}
[Unit]
Description= Lelastic
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/$command
ExecReload=/bin/kill -s HUP $MAINPID

[Install]
WantedBy=multi-user.target
{{</ file >}}

1.  Apply the correct permissions to the service file.

        sudo chmod 644 /etc/systemd/system/lelastic.service

1.  Start and enable the lelastic service.

        sudo systemctl start lelastic
        sudo systemctl enable lelastic

    You can check the status of the service to make sure it's running (and to view any errors)

        sudo systemctl status lelastic

    If you need to, you can stop and disable the service to stop failover functionality on the particular Compute Instance.

        sudo systemctl stop lelastic
        sudo systemctl disable lelastic

## Test Failover

Once configured, the shared IP address is routed to the *primary* Compute Instance. If that instance becomes inaccessible, the shared IP address is automatically routed to the *secondary* instance (fail*over*). Once the primary instance is back online, the shared IP address is restored to that instance (fail*back*).

If desired, both instances can be configured with the same role (both primary or both secondary). This prevents failback functionality, meaning that the shared IP address is not restored to the original system, even if the original system comes back online.

You can test the failover functionality of the shared IP using the steps below.

1.  Using a machine other than the two Compute Instances within the failover configuration (such as your local machine), ping the shared IP address.

        ping 192.0.2.1

    Review the output to verify that the ping is successful. The output should be similar to the following:

    {{< output >}}
64 bytes from 192.0.2.1: icmp_seq=3310 ttl=64 time=0.373 ms
{{</  output >}}

    {{< note >}}
If you are sharing an IPv6 address, the machine from which you are running the `ping` command must have IPv6 connectivity. Not all ISPs have this functionality.
{{</ note >}}

1.  While the ping command is running successfully, power off the *primary* Compute Instance. The ping command should continue to be able to reach your Shared IP address, even when the primary Compute Instance is fully powered off.
