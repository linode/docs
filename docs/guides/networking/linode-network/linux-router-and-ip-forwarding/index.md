---
slug: linux-router-and-ip-forwarding
description: "Learn how to set up a Linux server as a router, including configuring port forwarding and iptables."
keywords: ["static", "ip address", "addresses"]
tags: ["networking","linode platform"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-30
modified_by:
  name: Linode
title: "Configure Linux as a Router (IP Forwarding)"
authors: ["Linode"]
---

A computer network is a collection of computer systems that can communicate with each other. To communicate with a computer that's on a *different* network, a system needs a way to connect to that other network. A *router* is a system that acts as a intermediary between multiple different networks. It receives traffic from one network that is ultimately destined for another. It's able to identify where a particular packet should be delivered and then forward that packet over the appropriate network interface.

There are lots of options for off-the-shelf router solutions for both home and enterprise. In most cases, these solutions are preferred as they are relatively easy to configure, have lots of features, tend to have a user-friendly management interface, and may come with support options. Under the hood, these routers are stripped down computers running common operating systems, like Linux.

Instead of using one of these pre-built solutions, you can create your own using any Linux server, like a Linode Compute Instance. Using routing software like iptables, you have total control over configuring a router and firewall to suit your individual needs. This guide covers how to configure a Linux system as a basic router, including enabling IP forwarding and configuring iptables.

## Use Cases for a Cloud-based Router

Many workloads benefit from custom routing or port forwarding solutions, including those workloads hosted on cloud platforms like Linode. For example, it's common practice for security-minded applications to connect most of their systems together through a private network, like a VLAN. These systems might need access to an outside network, like other VLANs or the public internet. Instead of giving each one their own interface to the other network, one system on the private network can act as a router. The router is configured with multiple network interfaces (one to the private VLAN and one to the other network) and forwards packets from one interface to another. This can make monitoring, controlling, and securing traffic much easier, as it can all be done from a single system. Linode Compute Instances can be configured with up to 3 interfaces, each connecting to either the public internet or a private VLAN.

- **Connect systems on private VLAN to the public internet.**
- **Connect systems on two separate private VLANs.**
- **Forward IPv6 addresses** from a `/56` routed range.

## Configure a Linux System as a Router

1. **Deploy *at least* 2 Compute Instances** (or other virtual machines) to the same data center. All systems should be connected to the same private network, like a [VLAN](/docs/products/networking/vlans/). One system should be designated as the router and should also be connected to the public internet or a different private network. See [Deploy Compute Instances](#deploy-compute-instances).
1. **Enable IP forwarding** on the Compute Instance designated as the router. See [Enable IP Forwarding](#enable-ip-forwarding).
1. **Configure the routing software** on that same instance (the router). This guide covers using iptables, but you can also use other software. See [Configure iptables](#configure-iptables).
1. **Define a gateway** on each system *other than* the router. This gateway should point to the router's IP address on that network. See [Define the Gateway](#define-the-gateway).

## Deploy Compute Instances

To get started, you can use the Linode platform to deploy multiple Compute Instances. These can mimic a basic application that is operating on a private VLAN with a single router. If you already have an application deployed and just wish to know how to configure ip forwarding or iptables, you can skip this section.

1. Deploy 2 or more Compute Instances and designate one as the router. Each of these should be deployed to the same region. On the deployment page, you can skip the VLAN section for now. See [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) to learn how to deploy Linode Compute Instances.

1. On each Compute Instance *other than the router*, edit the instance's configuration profile. See [Managing Configuration Profiles](/docs/products/compute/compute-instances/guides/configuration-profiles/) for information on viewing and editing configuration profiles.
    - On the Compute Instance designated as the *router*, leave *eth0* as the public internet and set *eth1* to be configured as a VLAN. Enter a name for the VLAN and assign it an IP address from whichever subnet range you wish to use. For instance, if you wish to use the `10.0.2.0/24` subnet range, assign the IP address `10.0.2.1/24`. By convention, the router should be assigned the value of `1` in the last segment.
    - On each Compute Instance *other than the router*, remove all existing network interfaces. Set *eth0* as a VLAN, select the VLAN you just created, and enter another IP address within your desired subnet (such as `10.0.2.2/24` and `10.0.2.3/24`).

1. Confirm that [Network Helper](/docs/products/compute/compute-instances/guides/network-helper/) is enabled and reboot each Compute Instance for the changes to take effect.

1. Test the connectivity on each Compute Instance to ensure proper configuration. Log in to each instance and confirm the following is true:

    -   Ping the VLAN IPv4 address of another system within the same VLAN. Each Compute Instance should be able to ping the IP addresses of all other instances within that VLAN.

            ping 10.0.2.1

    -   Ping an IP address or website of a system on the public internet. This ping should only be successful for the Compute Instance configured as the router.

            ping linode.com

## Enable IP Forwarding

*IP forwarding* plays a fundamental role on a router. This is the functionality that allows a router to forward traffic from one network interface to another network interface. In this way, it allows computers on one network to reach a computer on a different network (when configured along with routing software). Forwarding for both IPv4 and IPv6 addresses are controlled within the Linux kernel. The following kernel parameters are used to enable or disable IPv4 and IPv6 forwarding, respectively.

- **IPv4:** `net.ipv4.ip_forward` or `net.ipv4.conf.all.forwarding`
- **IPv6:** `net.ipv6.conf.all.forwarding`

By default, forwarding is disabled on most Linux systems. To configure Linux as a router, this needs to be enabled. To enable forwarding, the corresponding parameter should be set to `1`. A value of `0` indicates that forwarding is disabled. To update these kernel parameters, edit the `/etc/sysctl.conf` file as shown in the steps below.

1. Log in to the Linux system you intend to use as a router. You can use [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/) (if you're using a Linode Compute Instance).

1.  Determine if IPv4 forwarding is currently enabled or disabled. The command below outputs the value of the given parameter. A value of `1` indicates that the setting is enabled, while `0` indicates it is disabled. If you intend to configure IPv6 forwarding, check that kernel parameter as well.

        sudo sysctl net.ipv4.ip_forward

    If this parameter is disabled (or otherwise not in the desired state), continue with the instructions below.

1.  Open the file `/etc/sysctl.conf` using your preferred command-line editor, such as [nano](/docs/guides/use-nano-to-edit-files-in-linux/).

        sudo nano /etc/sysctl.conf

1.  Find the line corresponding with the type of forwarding you wish to enable, uncomment it, and set the value to `1`. Alternatively, you can add the lines anywhere in the file.

    {{< file "/etc/sysctl.conf" >}}
...
## Configure IPv4 forwarding
net.ipv4.ip_forward = 1

## Configure IPv6 forwarding
net.ipv6.conf.all.forwarding = 1
...
{{</ file >}}

1.  After the changes have been saved, apply the changes by running the following command or by rebooting the machine.

        sudo sysctl -p

## Configure iptables

The iptables utility can serve as both a firewall (through the default `filter` table) and as a router (such as when using the `nat` table). This section covers how to configure iptables to function as a basic router. If you prefer, you can use any other firewall or routing software, such as [nftables](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page) or a commercial application.

1. Log in to the Linux system you intend to use as a router. You can use [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/) (if you're using a Linode Compute Instance).

1.  Review the existing iptables rules. If you are on a fresh installation of Linux and do not have any preconfigured rules, the output of the below command should by empty.

        iptables-save

    If do receive output, look for any rules that might interfere with your intended configuration. If you are unsure, you may want to consult your system administrator or the [iptables](https://linux.die.net/man/8/iptables) documentation. If needed, you can flush your iptables rules and allow all traffic.

        iptables -F
        iptables -X
        iptables -t nat -F
        iptables -t nat -X
        iptables -t mangle -F
        iptables -t mangle -X
        iptables -P INPUT ACCEPT
        iptables -P OUTPUT ACCEPT
        iptables -P FORWARD ACCEPT

1.  Configure iptables to allow port forwarding. This is the default setting for many systems.

        iptables -A FORWARD -j ACCEPT

1.  Next, configure NAT ([network address translation](https://en.wikipedia.org/wiki/Network_address_translation)) on iptables. This modifies the IP address details in network packets, allowing all systems on the private network to share the same public IP address of the router. Add the following iptables rule, replacing `10.0.2.0/24` with the subnet of your private VLAN.

        iptables -t nat -s 10.0.2.0/24 -A POSTROUTING -j MASQUERADE

    You can also forgo specifying any specific subnet and allow NAT over all traffic by using the command below.

        iptables -t nat -A POSTROUTING -j MASQUERADE

1.  By default, iptables rules are ephemeral. To make these changes persistent, install the `iptables-persistent` package. When you do this, the rules saved within `/etc/iptables/rules.v4` (and `rules.v6` for IPv6) are loaded when the system boots up. You can continue making changes to iptables as normal. When you are ready to save, save the output of [iptables-save](https://linux.die.net/man/8/iptables-save) to the `/etc/iptables/rules.v4` (or `rules.v6`) file. For more information, see the relevant section with the [Controlling Network Traffic with iptables](/docs/guides/control-network-traffic-with-iptables/#introduction-to-iptables-persistent) guide.

        iptables-save | sudo tee /etc/iptables/rules.v4

## Define the Gateway

The last step is to manually adjust the network configuration settings for each Compute Instance *other than* the router.

1. Log in to the [Cloud Manager](https://cloud.linode.com) and disable [Network Helper](/docs/products/compute/compute-instances/guides/network-helper/#enable-or-disable-network-helper) for each non-router Compute Instance you've deployed. While Network Helper was useful for automatically configuring the VLAN IP addresses, the configuration files controlled by Network Helper now need to be manually edited.

1. Log in to each Linux system that is *not* designated as the router. You can use [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/) (if you're using a Linode Compute Instance).

1.  Edit the configuration file that contains the settings for the private VLAN interface. This name and location of this file depends on the Linux distribution you are using. See the [Manual Network Configuration on a Compute Instance](/docs/products/compute/compute-instances/guides/manual-network-configuration/) series of guides and select the specific guide for your distribution. For a system running [ifupdown](/docs/products/compute/compute-instances/guides/ifupdown/) on Debian 10, the network configuration is typically stored within `/etc/network/interfaces`.

        sudo nano /etc/network/interfaces

1.  Within this file, adjust the parameter that defines the gateway for the VLAN interface. The value should be set to the IP address assigned to the *router's* VLAN interface, such as `10.0.2.1` if you've used the example in this guide. For a system running [ifupdown](/docs/products/compute/compute-instances/guides/ifupdown/) on Debian 10, you can add the gateway parameter in the location shown in the example below.

    {{< file "/etc/network/interfaces" >}}
...
iface eth0 inet static
    address 10.0.2.2/24
    gateway 10.0.2.1
{{</ file >}}

1.  After those settings have been saved, restart the Compute Instance or run the corresponding command to apply the changes. Continuing to use [ifupdown](/docs/products/compute/compute-instances/guides/ifupdown/) as an example, run the command below to apply the new network configuration settings.

        sudo ifdown eth0 && sudo ip addr flush eth0 && sudo ifup eth0

## Test the Connection

To verify the configuration settings are correct, run the same tests that were used within the last step of the [Deploy Compute Instances](#deploy-compute-instances) section. Specifically, ping a public IP address or domain from a Compute Instance within the private VLAN (that's not designated as the router). This ping should now complete successfully, indicating that the network traffic was successfully forwarded through the router to the public internet.

    ping linode.com