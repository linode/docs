---
slug: what-is-iptables
author:
  name: Hackersploit
description: 'This guide helps you understand iptables and explains what is iptables. It gets you started with examples and an overview of commands.'
og_description: 'This guide helps you understand iptables and explains what is iptables. It gets you started with examples and an overview of commands.'
keywords: ['understanding iptables', 'what is iptables']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-10-07
modified_by:
  name: Linode
published: 2020-10-07
title: What is iptables
h1_title: Understanding iptables
tags: ['networking','security']
image: "Understanding_iptables.png"
aliases: ['/security/firewalls/what-is-iptables/']
---

Implemented as Netfilter modules, iptables is a user-space utility program that allows a system administrator to configure the IP packet filter rules of the Linux kernel firewall. The filters are organized into tables containing chains of rules which govern how to treat network traffic packets.

Netfilter is the firewall framework on Linux, and iptables is the utility that is used to manage and control Netfilter. You can use iptables to filter both incoming and outgoing packets as well as route network packets.

This guide helps you understand iptables and explains what is iptables. It gets you started with examples and an overview of commands.

## Tables

A table is a collection of chains that serves a particular function. The 3 main tables in iptables are the Filter, NAT, and Mangle tables.

!["iptables table of tables](iptables-table-of-tables.png "iptables table of tables")

  - The **Filter Table** is used to control the flow of packets in and out of a system.
  - The **NAT Table** is used to redirect connections to other interfaces on the network.
  - The **Mangle Table** is used to modify packet headers.

Each of these tables has a chain of rules.

### Chains

Chains are a list of rules that are processed in order.

There are 5 main chains in iptables:

  - Input: Used to manage incoming packets/connections to service or protocol.
  - Output: Outgoing packet after it has been created/processed.
  - Forward: Forwards incoming packets from their source to destination (routing).
  - Prerouting: After the packet enters the network interface.
  - Postrouting: Before the packet leaves the network interface after the routing decision has been made.

{{< note >}}
The filter table is responsible for blocking or allowing connections and is the default filter used in iptables.
{{</ note >}}

### Understanding Packet Flow

Incoming packets are analyzed at each chain and are tested against a set of rules. If a rule is matched, the target is set. These are the targets available:

  - ACCEPT: Stop processing and lets the packet flow.
  - REJECT: Drops the packet with feedback.
  - DROP: Stops processing at the current chain and drops the packet.
  - LOG: Similar to ACCEPT, however, it is logged to the /var/log/messages.

For example, say you want to block all incoming connections to your web server on port 80. You should add a rule to the incoming chain in the filter table and set the target to `REJECT`. If the packet reaches the end of the chain without matching to any rules, the default rule is used. If there isn't a default rule, the packet is accepted.

## Installing iptables

In most Linux distributions, iptables is included as a utility by default. It is recommended that you disable or delete any rules you have before beginning or creating a new configuration. You must also uninstall any other firewall management utilities like UFW.

You can install iptables by running the following command:

    sudo apt install iptables

The default configuration file for iptables can be found in `/etc/sysconfig/iptables`. You can modify it with vim, or the text editor of your choice, with the following command:

    vim /etc/sysconfig/iptables

## Using iptables

### Building iptables commands

Here are some common command options:

| Option | Functionality |
|--------|---------------|
| `-t` or `--table` | Specifies the packet matching table. Default table is set to filter if no table is specified. |
| `-I` or `--insert` _chain_ [_rule-number_] _rule_  | Inserts one or more rule(s) to the in the selected chain as the given rule number. Indexing begins with 1. |
| `-A` or `--append` _chain_ _rule-specification_ | Appends one or more rule(s) to the list of rules to the end of the selected chain. |
| `-L` or `--list` [_chain_] | Lists all the rules in the selected chain. If no chain is specified all chains are listed. |
| `-D` or `--delete` _chain_ _rule-specification_ | Deletes one or more rule(s) in the selected chain. |
| `-D` or `--delete` _chain_ _rule-number_ | Deletes the specified rule in the selected chain. Indexing begins with 1. |
| `-p` or `--protocol` [!] | The protocol to check (TCP, UDP, icmp, or all). Using the `!` argument before the protocol inverts the test. |
| `-s` or `--source` [!] | The source specification. This can be either a network, hostname, or IP address. Using the `!` argument before the source inverts the sense of the address. |
| `--destination-port` or `--dport` | The destination port range. |
| `-j` or `--jump` _target_ | This is the target of the rule and specifies what to do in the case of a match. |
| `-m` or `--match` _match_ | Specifies an extension module that tests for a specific property. |
| `-p` or `--policy` _chain_ _target_ | Sets the policy for the chain to the target. |
| `F` or `--flush` [_chain_] | Flushes the selected chain. If no chain is specified, all chains are flushed. Flushing is akin to deleting all rules one by one. |

For all available options, see the [iptables man page](https://manpages.debian.org/stable/iptables/iptables.8.en.html).

Example command:

    sudo iptables -t filter -I INPUT -m tcp -p tcp --dport 80 -j REJECT

The above command blocks any incoming traffic to the web server/HTTP.

### Listing Chains

You can list all of the available chains in the filter table by using the list command:

    sudo iptables -L

This displays all the chains in the filter table and all the rules within the `INPUT`, `FORWARD`, and `OUTPUT` chains.

{{< output >}}
Chain INPUT (policy ACCEPT)
target     prot opt source               destination

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination
{{</ output >}}

### Specifying Default Policy

During a fresh configuration, you do not have any predefined rules, so you have to begin by setting the default target policy. In this case, the default policy is set to `ACCEPT`, which means that all traffic is accepted by default.

You can specify the default policy for all the chains by running the following commands:

    sudo iptables --policy INPUT ACCEPT

    sudo iptables --policy FORWARD ACCEPT

    sudo iptables --policy OUTPUT ACCEPT

This sets the default policy for all chains to `ACCEPT`. You can also change this to `DROP` or `REJECT` if you wish to disable access to any services on the server and manually allow the services you wish to expose.

### Blocking & Allowing Connections From IP Address

{{< note >}}
In the following examples, replace the sample 198.168.1.1 IP address with the IP address you wish to block or allow.
{{</ note >}}

You can block all incoming requests from an IP address by adding the following rule:

    sudo iptables -A INPUT -s 192.168.1.1 -j DROP

You can also block all incoming connections from an entire subnet by adding the following rule:

    sudo iptables -A INPUT -s 192.168.1.1/24 -j DROP

To block all outgoing connections to a particular IP or subnet you can add the following rule to the `OUTPUT` chain:

    sudo iptables -I OUTPUT -s 192.168.1.1 -j DROP

To allow connections to these services and ports change the target to `ACCEPT` instead of `DROP`.

### Blocking & Allowing Connections To Ports

To block connections to ports and services, specify the protocol and the destination port. For example, if you want to block any incoming SSH connections to the server, add the following rule:

    sudo iptables -I INPUT -p tcp --dport 22 -j DROP

You can also block any incoming connections to your web server running on port 80 by adding the following rule:

    sudo iptables -I INPUT -p tcp --dport 80 -j DROP

You can go a step further and block a particular IP from connecting to a particular service. For example, you can block an IP from accessing our web server by adding the following rule:

    sudo iptables -I INPUT -p tcp --dport 80 -s <IP> -j DROP

To allow connections to these services and ports change the target to `ACCEPT` instead of `DROP`.

### Saving Changes

To save the changes you have made to your rule-set so that they are persistent, execute the following binary:

    sudo /sbin/iptables-save

### Deleting & Clearing Rules

If you want to delete a specific rule, you need to determine the rule line number. To do this, list the chains and the rules with the following options:

    sudo iptables -L --line-numbers

This lists out the relevant line numbers for each rule. Once the rule is identified and correlated to it’s line number you can delete it by running the following command:

    sudo iptables -D INPUT 3

If you want to clear all the rules that you have added to start over, you can use the flush option:

    sudo iptables -F

## Next Steps

For more detailed information on iptables, including using ip6tables, rulesets, and iptables-persistent, see the [Controlling Network Traffic with iptables - A Tutorial](/docs/guides/control-network-traffic-with-iptables/) guide.
