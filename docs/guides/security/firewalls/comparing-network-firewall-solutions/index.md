---
slug: comparing-network-firewall-solutions
title: "Comparing Linux-Based Network Firewall Software"
description: 'Learn to compare the software options for configuring a firewall on your Linux system.'
keywords: ['firewall', 'nftables', 'iptables', 'ufw', 'firewalld']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Nathaniel Stickman"]
published: 2023-10-24
modified_by:
  name: Linode
---

Implementing a firewall is crucial for securing your Linux system. There are an array of popular software firewalls to choose from, and each offers unique features. So understanding how these tools compare can help you choose the best firewall for your needs.

In this guide, learn more about each of the most common software firewall tools on Linux and how they compare. Throughout, follow links to our in-depth guides on each of these tools, and compare examples of each handles common firewall configurations.

## An Overview of Netfilter (The Linux Kernel-Space Firewall Module)

[Netfilter](https://www.netfilter.org/) is a packet-filtering framework included in the Linux kernel (since 2.4.0). This framework provides kernel-level hooks that are used to implement packet filtering and network address and port translation (NAT and NPT). Ultimately, it is this framework that all firewall tools leverage for managing packets.

Low-level tools like those covered below are the default interfaces for Netfilter. For that reason, these tools give you a lot of control, but they can also be difficult to learn and work with. Thus, you can also find high-level tools, like the ones further below, built on top of these low-level tools. Such high-level tools can further simplify firewall configuration.

## Low-Level User-Space Firewall Utilities

Linux utilizes dedicated packet classification tools for users to manage network/firewall rules. These tools — `nftables` and `iptables` — are built on Netfilter and provide low-level firewall configurations. They are especially helpful when you need fine-grained control of your network's package filtering.

### nftables

[nftables](https://www.netfilter.org/projects/nftables/index.html) has become the default low-level packet classification tool, replacing `iptables`. Leveraging the Netfilter framework, `nftables` allows users to configure network rulesets that filter and route packets and ultimately define network traffic.

`nftables` uses a *tables -> chains -> rules* structure for managing network rules. Tables organize sets of chains, and each chain consists of a list of rules, processed in order.

Because `nftables` has superseded `iptables`, you should opt to use it when possible. The main exception is older Linux systems, many of which do not support `nftables`. Alternatively, you may prefer a high-level tool like those covered [below](#high-level-firewall-configuration-managers).

You can learn more about `nftables` and its usage in our [Getting Started with nftables](/docs/guides/how-to-use-nftables/) guide.

### iptables

[iptables](https://www.netfilter.org/projects/iptables/index.html) traditionally filled the space now occupied by `nftables`. `iptables` is, like `nftables`, a low-level tool for packet classification, providing firewall and network traffic management through the configuration of rulesets. `iptables` uses a similar *tables -> chains -> rules* hierarchical model as well.

Even though `nftables` has replaced `iptables` as the default, some systems, particularly ones using older Linux versions, only support `iptables`. So, unless you are looking for higher-level firewall configuration (see [High-Level Firewall Configuration Managers](#high-Level-firewall-configuration-managers) section below), you need to use `iptables` in those cases.

You can learn more about `iptables` and how to configure network rules with them in our [Controlling Network Traffics with iptables](/docs/guides/control-network-traffic-with-iptables/) guide.

## High-Level Firewall Configuration Managers

When you do not need fine-grained control of network traffic, low-level tools may prove overly cumbersome. High-level tools offer simpler solutions for implementing firewalls that may better fit your needs. By abstracting lower-level details, these tools can make it easier to manage network rules.

### UFW

[UFW](https://wiki.ubuntu.com/UncomplicatedFirewall) (short for UncomplicatedFirewall) offers firewall management in a user-friendly command-line interface. It comes by default on Ubuntu systems and is typically the go-to choice on Debian and Arch Linux systems as well.

What especially sets UFW apart is the simplicity its commands bring to firewall configuration. Setting up your desired firewall rules and enabling the firewall follows an *uncomplictated* set of commands.

See more on UFW and steps for getting started in our [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/) guide.

### Firewalld

[Firewalld](https://firewalld.org/) provides an interface for configuring firewall rules both dynamically and persistently. The dynamic configuration feature allows firewalld to set up rules that apply immediately, without having to restart the service or interrupt existing connections. Additionally, firewalld's *zones* system provides convenience for categorizing and managing levels of trust.

Firewalld supports most Linux distributions, and it is included by default on RHEL-related systems (e.g., CentOS, Fedora, AlmaLinux, Rocky Linux) and openSUSE.

Take a look at our [Configure a Firewall with Firewalld](/docs/guides/introduction-to-firewalld-on-centos/) guide to find out more about using firewalld.

## Managed Cloud Firewall Service

Cloud firewalls, like [Linode's](/docs/products/networking/cloud-firewall/), offer a different approach to cloud security, and some advantages over local software firewalls. For instance, Linode's Cloud Firewall can configure and manage firewall rules across multiple cloud instances.

That said, cloud firewalls often do not cover all of the features of software firewalls. Typically, a software firewall can offer more configuration options and advanced control of network traffic.

One solution — cloud or software firewall — is likely to better fit your needs than the other. But often you can get the best results by using both together. As an example: Use a cloud firewall to apply "absolute" network rules across multiple cloud instances and prevent unwanted traffic from ever reaching your servers. Then, use a software firewall to fine-tune your network filtering on each server.

Learn more about cloud firewalls and how they compare to software firewalls in our [Comparing Cloud Firewalls to Linux Firewall Software](/docs/products/networking/cloud-firewall/guides/comparing-firewalls/) guide.

## Basic Usage Comparison

To further compare the software firewall tools, what follows are a series of example network filtering rules. Each covers a common scenario and shows how each of the four tools above implements the necessary ruleset. These examples offer a sense of how the tools differ, and for even more, you can refer to the guides linked above.

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
{{< tab "firewalld" >}}

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

For firewall configuration, it is crucial to be able to block traffic. The examples that follow first show how to block all traffic, then show the more typical policy configuration — denying incoming traffic and allowing outgoing.

{{< note type="alert" >}}
Configuring default reject or deny rules can lock you out of your Linode unless explicit allow rules are in place. Ensure that you have configured allow rules for SSH and other critical services before trying any of the following.
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
{{< tab "firewalld" >}}

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

### Allow All Traffic From a Specific IP Address

Tighter network security stipulates specifically which IP address has access to the system. Denying incoming traffic by default — as shown above — and adding exceptions as needed helps to ensure access only by known systems.

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

Use the same approach with the `ip6tables` command for IPv6 source addresses:

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
{{< tab "firewalld" >}}

Use the `trusted` zone to allow traffic from a given source address. The operation is the same regardless of IPv4 or IPv6:

```command
sudo firewall-cmd --zone=trusted --add-source=192.0.2.0
sudo firewall-cmd --zone=trusted --add-source=2001:db8:e001:1b8c::2
```

{{< /tab >}}
{{< /tabs >}}

### Block All Traffic From a Specific IP Address

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
{{< tab "firewalld" >}}

Use firwalld's `drop` zone to block specific IP addresses. The same method holds whether IPv4 or IPv6:

```command
sudo firewall-cmd --zone=drop --add-source=192.0.2.0
sudo firewall-cmd --zone=drop --add-source=2001:db8:e001:1b8c::2
```

{{< /tab >}}
{{< /tabs >}}

### Allow Incoming Traffic From a Specific Port

Allowing traffic on specific ports is common, especially for web servers. Opening ports allow access for SSH connections (port `22`) and for web application usage (ports `80` and `443`), among other use cases.

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
{{< tab "firewalld" >}}

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
