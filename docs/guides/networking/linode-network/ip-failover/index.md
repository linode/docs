---
slug: ip-failover
author:
  name: Linode
  email: docs@linode.com
description: "This guide discusses how to enable failover on a Linode Compute Instance through using our IP Sharing feature with software such as keepalived or FRR."
keywords: ['IP failover','IP sharing','elastic IP']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-22
modified_by:
  name: Linode
title: "Configuring Failover on a Compute Instance"
contributor:
  name: Linode
---



In cloud computing, *failover* is the concept of rerouting traffic to a backup system should the original system become inaccessible. Linode Compute Instances support failover through the [IP Sharing](/docs/guides/managing-ip-addresses/#configuring-ip-sharing) feature. This allows two Compute Instances to share a single IP address, one serving as the *primary* and one serving as the *secondary*. If the primary Compute Instance becomes unavailable, the shared IP address is seamlessly routed to the secondary Compute Instance (fail*over*). Once the primary instance is back online, the IP address route is restored (fail*back*).

## Why Should I Implement Failover?

There's always a possibility that your Compute Instance may become inaccessible, perhaps due to a spike in traffic, your own internal configuration issues, a natural disaster, or planned (or unplanned) maintenance. When this happens, any websites or services hosted on that instance would also stop working. Failover provides a mechanism for protecting your services against a single point of failure.

{{<note>}}
For many production applications, you may want to consider a load balancing tool that goes beyond basic failover. Linode's [NodeBalancers](/docs/products/networking/nodebalancers/) combines load balancing with built-in failover. You can also configure load balancing software, such as [HAProxy](https://www.linode.com/docs/guides/how-to-use-haproxy-for-load-balancing/), on your own Compute Instances and utilize our IP Sharing feature to provide failover.
{{</note>}}

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


- **New IP Sharing Method (BGP):** Supports IPv4 failover. This is currently being rolled out across our fleet in conjunction with our [planned network infrastructure upgrades](/docs/guides/network-infrastructure-upgrades/). Since it is implemented using BGP routing, customers can configure it on their Compute Instances using the Linode provided lelastic tool or FRR. Follow the instructions within this guide.

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

1.  Disable Network Helper on both instances. For instructions, see the [Network Helper](/docs/guides/network-helper/#single-per-linode) guide.

1. Add an additional IPv4 address to one of the Compute Instances. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/#adding-an-ip-address) guide for instructions. Make a note of the newly assigned IP address. *Each additional IP address costs $1 per month*.

1. On the *other* Compute Instance, add the newly assigned IP address as a *Shared IP* using Linode's *IP Sharing* feature. See [Managing IP Addresses](/docs/guides/managing-ip-addresses/#configuring-ip-sharing) for instructions on configuring IP sharing.

### Add the Shared IP to the Networking Configuration

Adjust the network configuration file on *each* Compute Instance, adding the shared IP address and restarting the service.

1.  Log in to the Compute Instance using [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/).

1.  Add the shared IP address to the system's networking configuration file. Within the instructions for your distribution below, open the designated file with a text editor (such as [nano](/docs/guides/use-nano-to-edit-files-in-linux/) or vim) and add the provided lines to the end of that file. Replace *[shared-ip]* with your own shared IP address.

    {{<note>}}
Review the configuration file and verify that the shared IP address does not already appear. If it does, delete associated lines before continuing.
{{</note>}}

    -   **Debian and Ubuntu 16.04 (and older)**: Using [ifupdown](https://manpages.debian.org/unstable/ifupdown/ifup.8.en.html).

        {{< file "/etc/network/interfaces" >}}
...
# Add Shared IP Address
iface lo inet static
    address [shared-ip]/32
{{</ file >}}

        To apply the changes, reboot the instance or run:

            sudo ifdown lo && sudo ip addr flush lo && sudo ifup lo

        If you receive the following output, you can safely ignore it: *RTNETLINK answers: Cannot assign requested address*.

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
        - [shared-ip]/32
{{</ file >}}

        To apply the changes, reboot the instance or run:

            sudo netplan apply

### Install and Configure Lelastic

Next, we need to configure the failover software on *each* Compute Instance. For this, the lelastic utility is used.

1.  Log in to the Compute Instance using [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/).

1.  Download and install the [lelastic](https://github.com/linode/lelastic) utility from GitHub by running the following commands:

        curl -LO https://github.com/linode/lelastic/releases/download/v0.0.3/lelastic.gz
        gunzip lelastic.gz
        chmod 755 lelastic
        sudo mv lelastic /usr/local/bin/

1.  Next, prepare the command to configure BGP routing through lelastic. Replace *[id]* with the ID corresponding to your data center in the [table above](/docs/guides/ip-failover/#ip-failover-support) and *[role]* with either `primary` or `secondary`. You do not need to run this command, as it is configured as a service in the following steps.

        lelastic -dcid [id] -[role] &

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
ExecStart=$command

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

        sudo systemctl start lelastic
        sudo systemctl enable lelastic

## Test Failover

Once configured, the shared IP address is routed to the *primary* Compute Instance. If that instance becomes inaccessible, the shared IP address is automatically routed to the *secondary* instance (fail*over*). Once the primary instance is back online, the shared IP address is restored to that instance (fail*back*).

If desired, both instances can be configured with the same role (both primary or both secondary). This prevents failback functionality, meaning that the shared IP address is not restored to the original system, even if the original system comes back online.

You can test the failover functionality of the shared IP using the steps below.

1.  Power off the *primary* Compute Instance.

1.  Using your local machine, ping the shared IP address.

        ping 192.0.2.1

    If failover is successfully configured, the output should be similar to the following (once the primary Compute Instance has fully powered off):

    {{< output >}}
64 bytes from 192.0.2.1: icmp_seq=3310 ttl=64 time=0.373 ms
{{</  output >}}

    If you are instead receiving output telling you that the host is unreachable, failover likely has not been configured successfully.

    {{< output >}}
From 192.0.2.1 icmp_seq=3293 Destination Host Unreachable
{{</  output >}}
