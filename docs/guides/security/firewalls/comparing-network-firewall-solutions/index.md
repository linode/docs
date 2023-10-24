---
slug: comparing-network-firewall-solutions
title: "Comparing Linux-based Network Firewall Software"
description: 'Learn compare the software options for configuring a firewall on your Linux system.'
og_description: 'Learn compare the software options for configuring a firewall on your Linux system.'
keywords: ['firewall','nftables','iptables','ufw','firewalld']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Nathaniel Stickman"]
published: 2023-10-21
modified_by:
  name: Nathaniel Stickman
---

Implementing a firewall is crucial for securing your Linux system. You have an array of software firewalls to choose from, and each of the most commonly used tools on Linux offers unique features. Understanding how these tools compare can help you choose the best firewall for your needs.

In this guide, learn more about each of the most common software firewall tools and how they compare. Throughout, follow links to our in-depth guides on each tool, and review brief examples for common firewall configurations to see how each tool handles.

## An Overview of Netfilter (the Linux Kernel-space Firewall Module)

[Netfilter](https://www.netfilter.org/) is a packet-filtering framework included in the Linux kernel (since 2.4.0). This framework provides kernel-level hooks which can be used in packet filtering and network address and port translation (NAT and NPT). And for that reason it is ultimately this framework that all firewall tools leverage for managing packets.

## Low-level User-space Firewall Utilities

Linux utilizes dedicated packet classification tools for users to manage network rules. These tools — nftables and iptables — are built on Netfilter and provide low-level firewall configurations. They are especially helpful when you need fine-grained control of your network's package filtering.

### nftables

[nftables](https://www.netfilter.org/projects/nftables/index.html) has become the default low-level packet classification tool, replacing iptables. Leveraging the Netfilter framework, nftables allows for users to configure network rulesets that govern network traffic, filtering and directing packets.

The model used by nftables for managing network rules is a *tables -> chains -> rules*. Tables organize sets of chains, and each chain consists of a list of rules, processed in order.

Unless you are running on an older Linux system, or prefer a higher-level tool (see [High-level Firewall Configuration Managers](#high-level-firewall-configuration-managers) below), you should be using nftables.

You can learn more about nftables and its usage in our [Getting Started with nftables](/docs/guides/how-to-use-nftables/) guide.

### iptables

[iptables](https://www.netfilter.org/projects/iptables/index.html) traditionally filled the space now occupied by nftables. iptables is, likewise, a low-level tool for packet classification, providing firewall and network traffic management through configuration of rulesets. And iptables uses the same *tables -> chains -> rules* hierarchical model as nftables.

Even though nftables has replaced iptables as the default, some systems, particularly ones using older Linux versions, only support iptables. So, unless you are looking for higher-level firewall configuration (see [High-level Firewall Configuration Managers](#high-level-firewall-configuration-managers) below), you need to use iptables in that case.

You can learn more about iptables and how to configure network rules with it in our guide [Controlling Network Traffics with iptables](/docs/guides/control-network-traffic-with-iptables/).

## High-level Firewall Configuration Managers

But unless you need fine-grained control of network traffic, typically you want a simpler process for setting up and managing your system's firewall. Depending on your Linux distribution, several tools exist for implementing firewall rules.

### UFW

[UFW](https://wiki.ubuntu.com/UncomplicatedFirewall) (short for UncomplicatedFirewall) offers firewall management with a command-line interface designed to be easy to use. It comes by default on Ubuntu systems, and is typically the go-to choice on Debian and Arch Linux systems as well.

What especially sets UFW apart is the simplicity its commands bring to firewall configuration. Setting up your desired firewall rules and enabling the firewall follows an *uncomplictated* set of commands.

See more on UFW and steps for getting started in our guide [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/).

### Firewalld

[Firewalld](https://firewalld.org/) provides an interface for configuring firewall rules both dynamically and persistently. The dynamic configuration feature allows Firewalld to set up rules that apply immediately, without having to restart the service or interrupt existing connections. Additionally, Firewalld implements a system of *zones* for further categorizing and managing rules.

Firewalld supports most Linux distributions, and it is included by default on RHEL-related systems (e.g., CentOS, Fedora, AlmaLinux, Rocky Linux) and openSUSE.

Take a look at our [Configure a Firewall with Firewalld](/docs/guides/introduction-to-firewalld-on-centos/) guide to find out more about using Firewalld.

## Managed Cloud Firewall Service

Cloud firewalls, like [Linode's](/docs/products/networking/cloud-firewall/) offer a different approach to cloud security over local software firewalls. A cloud firewall offers some advantages over software firewalls. For instance, Linode's Cloud Firewall tends to be easier to use and has the ability to configure and manage a firewall across multiple cloud instances.

That said, cloud firewalls likely do not cover all of the features of software firewalls. Typically, a software firewall can offer more fine-grained configuration, giving you advanced control of network traffic.

One solution is likely to better fit your needs than the other. But often you can get the best results by using a cloud firewall and a software firewall together. A cloud firewall can apply "absolute" network rules that apply across multiple cloud instances and prevent certain traffic from ever reaching your servers. A software firewall can then fine-tune your network filtering.

Learn more about cloud firewalls and how they compare to software firewalls in our guide [Comparing Cloud Firewalls to Linux Firewall Software](/docs/products/networking/cloud-firewall/guides/comparing-firewalls/).

## Basic Usage Comparison

To further compare the software firewall tools, what follows are a series of example firewall rules. Each covers a common scenario, showing the commands used for each of the four tools above to implement the necessary ruleset. These examples can give you more of a sense of how the tools differ, and for even more you can refer to the guides linked above.

### View Existing Configuration

Whether at the outset of configuring a firewall or when revising an existing configuration, it is helpful to get an overview of existing settings.

{{< tabs >}}
{{< tab "nftables" >}}

```command
sudo nft list ruleset
```

```output
table inet filter {
	chain input {
		type filter hook input priority filter; policy accept;
	}

	chain forward {
		type filter hook forward priority filter; policy accept;
	}

	chain output {
		type filter hook output priority filter; policy accept;
	}
}
```

{{< /tab >}}
{{< tab "iptables" >}}

To see IPv4 rules:

```command
sudo iptables -S
```

```output
-P INPUT ACCEPT
-P FORWARD ACCEPT
-P OUTPUT ACCEPT
```

To see IPv6 rules:

```command
sudo ip6tables -S
```

{{< /tab >}}
{{< tab "UFW" >}}

For firewall status and rules:

```command
sudo ufw status
```

```output
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
22/tcp (v6)                ALLOW       Anywhere (v6)
```

For more details, including default policies:

```command
sudo ufw status verbose
```

{{< /tab >}}
{{< tab "Firewalld" >}}

To see firewall rules for a specific zone (`public` in this example):

```command
sudo firewall-cmd --zone=public --list-all
```

```output
public (active)
  target: default
  icmp-block-inversion: no
  interfaces: eth0
  sources:
  services: cockpit dhcpv6-client ssh
  ports:
  protocols:
  forward: no
  masquerade: no
  forward-ports:
  source-ports:
  icmp-blocks:
  rich rules:
```

To see firewall rules for all zones:

``` command
sudo firewall-cmd --list-all-zones
```

{{< /tab >}}
{{< /tabs >}}

### Block All Traffic

For firewall configuration, it is crucial to be able to block traffic. The examples that follow first show how to block all traffic, then show the more typical policies denying incoming traffic and allowing outgoing.

{{< note type="alert" respectIndent=false >}}
Configuring a default reject or deny rule can lock you out of your Linode unless explicit allow rules are in place. Ensure that you have configured allow rules for SSH and other critical services as per the section below before applying default deny or reject rules.
{{< /note >}}

{{< tabs >}}
{{< tab "nftables" >}}

Set policies to block incoming and outgoing traffic:

```command
sudo nft add chain inet filter input '{type filter hook input priority 0; policy drop; }'
sudo nft add chain inet filter forward '{type filter hook forward priority 0; policy drop; }'
sudo nft add chain inet filter output '{type filter hook output priority 0; policy drop; }'
```

Set policies to block incoming traffic and allow outgoing:

```command
sudo nft add chain inet filter input '{type filter hook input priority 0; policy drop; }'
sudo nft add chain inet filter forward '{type filter hook forward priority 0; policy drop; }'
sudo nft add chain inet filter output '{type filter hook output priority 0; policy accept; }'
```

{{< /tab >}}
{{< tab "iptables" >}}

Set policies to block incoming and outgoing traffic:

```command
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT DROP
```

Set policies to block incoming traffic and allow outgoing:

```command
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT DROP
```

The same can be done for IPv6 traffic, replacing `iptables` with `ip6tables`.

{{< /tab >}}
{{< tab "UFW" >}}

To configure policies for blocking all traffic:

```command
sudo ufw default deny incoming
sudo ufw default deny outgoing
```

To set policies blocking incoming and allowing outgoing traffic:

```command
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

{{< /tab >}}
{{< tab "Firewalld" >}}

Firewalld blocks incoming traffic by default. But to ensure that policy is in place:

```command
sudo firewall-cmd --zone=public --set-target=DROP --permanent
```

Firewalld does not regulate outbound traffic by default. To block all outbound traffic, create a custom policy:

```command
sudo firewall-cmd --new-policy outgoing-default --permanent
sudo firewall-cmd --policy outgoing-default --add-ingress-zone HOST --permanent
sudo firewall-cmd --policy outgoing-default --add-egress-zone ANY --permanent
sudo firewall-cmd --policy outgoing-default --set-target DROP --permanent
sudo firewall-cmd --policy outgoing-default --set-priority -100 --permanent
```

{{< /tab >}}
{{< /tabs >}}

### Allow All Traffic from a Specific IP Address

Often a secure measure when configuring a tight firewall is specifying precisely which IP addresses have access to the system. Keep a default policy of denying incoming traffic — as shown above — and stipulating only what exceptions you need helps to ensure access only by known systems.

{{< tabs >}}
{{< tab "nftables" >}}

To allow traffic from an IPv4 source address:

```command
sudo nft add rule inet filter input ip saddr 192.0.2.0 accept
```

The same command works for an IPv6 address:

```command
sudo nft add rule inet filter input ip6 saddr 2001:db8:e001:1b8c::2 accept
```

{{< /tab >}}
{{< tab "iptables" >}}

Allow traffic from an IPv4 source address:

```command
sudo iptables -A INPUT -p tcp -s 192.0.2.0 -j ACCEPT
```

The same command can be used with `ip6tables` for IPv6 source addresses:

```command
sudo ip6tables -A INPUT -p tcp -s 2001:db8:e001:1b8c::2 -j ACCEPT
```

{{< /tab >}}
{{< tab "UFW" >}}

Allow traffic from a given IP address; the command operates the same whether the address is IPv4 or IPv6:

```command
sudo ufw allow from 192.0.2.0
sudo ufw allow from 2001:db8:e001:1b8c::2
```

{{< /tab >}}
{{< tab "Firewalld" >}}

Use the `trusted` zone to allow traffic from a given source address. The operation is the same regardless of IPv4 or IPv6:

```command
sudo firewall-cmd --zone=trusted --add-source=192.0.2.0
sudo firewall-cmd --zone=trusted --add-source=2001:db8:e001:1b8c::2
```

{{< /tab >}}
{{< /tabs >}}

### Block All Traffic from a Specific IP Address

Each firewall management tool covered here offers an option for blocking traffic from a given IP. Recommended setups and some default policies in these tools may already block all incoming traffic that is not explicitly approved. However, being able to explicitly block a given IP address gives you much more control and may be particularly useful in certain setups.

{{< tabs >}}
{{< tab "nftables" >}}

To block traffic from a given IP address:

```command
sudo nft add rule inet filter input ip saddr 192.0.2.0 drop
```

Use the same process for IPv6 addresses:

```command
sudo nft add rule inet filter input ip6 saddr 2001:db8:e001:1b8c::2 drop
```

{{< /tab >}}
{{< tab "iptables" >}}

To block connections from an IPv4 address:

```command
sudo iptables -A INPUT -p tcp -s 192.0.2.0 -j DROP
```

To block connections from an IPv6 address:

```command
sudo ip6tables -A INPUT -p tcp -s 2001:db8:e001:1b8c::2 -j DROP
```

{{< /tab >}}
{{< tab "UFW" >}}

Use commands like the ones below to block traffic from a given IP, whether IPv4 or IPv6:

```command
sudo ufw deny from 192.0.2.0
sudo ufw deny from 2001:db8:e001:1b8c::2
```

{{< /tab >}}
{{< tab "Firewalld" >}}

Use Firwalld's `drop` zone to block specific IP addresses. The same method holds whether IPv4 or IPv6:

```command
sudo firewall-cmd --zone=drop --add-source=192.0.2.0
sudo firewall-cmd --zone=drop --add-source=2001:db8:e001:1b8c::2
```

{{< /tab >}}
{{< /tabs >}}

### Allow Incoming Traffic from a Specific Port

Allowing traffic on specific ports is common, especially for web servers. Opening ports allows access for SSH connections (port `22`) and for web application usage (ports `80` and `443`), among other use cases.

In addition, the firewall tools covered here can use port specifications alongside IP address specifications. Doing so can ensure even tighter security, relegating incoming traffic from specific addresses to specific ports.

{{< tabs >}}
{{< tab "nftables" >}}

Allow traffic on port `22`:

```command
sudo nft add rule inet filter input tcp dport 22 accept
```

Allow traffic from a given IP address to port `22`:

```command
sudo nft add rule inet filter input ip saddr 192.0.2.0 tcp dport 22 accept
```

{{< /tab >}}
{{< tab "iptables" >}}

Open port `22` for traffic:

```command
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```

Allow traffic from a given address to port `22`:

```command
sudo iptables -A INPUT -p tcp -s 192.0.2.0 --dport 22 -j ACCEPT
```

Use `ip6tables` instead of `iptables` above to set rules for IPv6 traffic.

{{< /tab >}}
{{< tab "UFW" >}}

To allow traffic on a given port:

```command
sudo ufw allow 22/tcp
```

To allow a given IP address to connect via a given port:

```command
sudo ufw allow from 192.0.2.0 proto tcp to any port 22
```

{{< /tab >}}
{{< tab "Firewalld" >}}

To open port `22` for traffic:

```command
sudo firewall-cmd --zone=public --allow-port=22/tcp
```

Create a rich rule to allow traffic from a given IP address into port `22`:

```command
sudo firewall-cmd --zone=public --add-rich-rule 'rule source address="192.0.2.0" port port=22 protocol=tcp accept'
```

{{< /tab >}}
{{< /tabs >}}
