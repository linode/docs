---
slug: how-to-use-nftables
author:
  name: Linode Community
  email: docs@linode.com
description: 'In this guide you will learn about what nftables is and how it differs from iptables, plus you""ll get a look at how to use and create tables, rules, and chains.'
og_description: 'In this guide you will learn about what nftables is and how it differs from iptables, plus you""ll get a look at how to use and create tables, rules, and chains.'
keywords: ['nftables']
bundles: ['debian-security', 'centos-security', 'network-security']
tags: ['ubuntu', 'centos', 'debian', 'security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-09
modified_by:
  name: Nathaniel Stickman
title: "How to Use nftables"
h1_title: "Get Started with nftables"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[nftables](https://netfilter.org/projects/nftables/)'
- '[nftables Address Families](https://wiki.nftables.org/wiki-nftables/index.php/Nftables_families)'
- '[Configuring Chains in nftables](https://wiki.nftables.org/wiki-nftables/index.php/Configuring_chains)'
---

[*nftables*](https://netfilter.org/projects/nftables/) replaces the successful [iptables](/docs/guides/what-is-iptables/) and its related frameworks built on Netfilter. With nftables come improvements to performance and usability, but also significant changes to syntax and usage. Use this guide to get started learning about what nftables is and how it differs from iptables. Follow along with this guide's example to implement your own rules in nftables and get a hands-on idea of what it can do.

## What are nftables?

nftables is a Linux packet classification framework that replaces the *Netfilter* infrastructure behind iptables, ip6tables, arptables, and ebtables. Frameworks using the legacy Netfilter infrastructure are being phased out of the major Linux distributions. These frameworks have begun to adopt nftables as the default packet classification framework.

Despite the ubiquity of iptables, its architecture has several underlying limitations and inefficiencies, and these could only be resolved with a fundamental redesign. That redesign is what nftables set out to accomplish.

## nftables vs. iptables

nftables keeps some of the familiar parts of the Netfilter infrastructure and iptables. As with iptables, nftables still uses the tables, chains, and rules hierarchy — tables containing chains, and chains containing rules. While nftables change the command-line syntax, it maintains a compatibility layer that allows you to run iptables commands over the nftables kernel.

nftables also introduce significant changes in usage from iptables. For one, as mentioned above, the command-line syntax for nftables is different. What follows are additional notable differences between nftables and iptables.

- Unlike iptables, nftables do not have predefined tables or chains, which goes toward improving performance.
- In nftables, rules can take multiple actions, as opposed to iptables' limitation to a single action per rule.
- nftables comes with an `inet` address family that allows you to easily create tables that apply to both IPv4 and IPv6.
- nftables' ruleset is represented by a dynamic linked list, which improves the ruleset's maintainability compared to iptables' monolithic blob ruleset.

Additionally, nftables' generic set infrastructure opens new options for structuring your ruleset, even allowing for multidimensional "tree" structures. You can use this to significantly reduce the number of rules queried to determine appropriate action for a packet.

## How to Install nftables

You do not need to install nftables if you are using one of the following distribution releases or later:

- Debian 10 (Buster)
- Ubuntu 20.10 (Groovy Gorilla)
- CentOS 8
- Fedora 32

Otherwise, you can manually install nftables using the following steps. These steps work for Debian 9, Ubuntu 18.04, and CentOS 7, and later releases of these distributions.

### Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

### Installation Steps

1. Install nftables.

    - On Debian and Ubuntu distributions, use the command:

            sudo apt install nftables

    - On CentOS distributions, use the command:

            sudo yum install nftables

1. Enable and start the nftables service.

        sudo systemctl enable nftables
        sudo systemctl start nftables

1. If you have rules in iptables that you would like to preserve, install the `iptables-nftables-compat` tool. Then, export your iptables rules, translate them, and import them into nftables.

        sudo apt install iptables-nftables-compat
        sudo iptables-save > iptables.dump
        sudo iptables-restore-translate -f iptables.dump > ruleset.nft
        sudo nft -f ruleset.nft

    You can verify the import by getting a list of tables now in nftables.

        sudo nft list tables

## How to Use nftables

This section breaks down each of the major components in nftables, providing their most useful commands. At the end of this guide, you can find a demonstration of how to set up a working ruleset and see it in action.

### Tables

Tables are the highest level of the nftables hierarchy. A given table corresponds to a single address family and contains chains that filter packets in that address family.

- To create a table, use the example command. Replace `example_table` below and in subsequent examples, with a descriptive name for the table.

        sudo nft add table inet example_table

    Here, `inet` identifies the address family for the table. Refer to the nftables documentation [on address families](https://wiki.nftables.org/wiki-nftables/index.php/Nftables_families) for a complete list of supported address family identifiers. The `inet` option used here is also used in subsequent examples where an address family is called for.

    As you can see in subsequent commands, any time you refer to a table, you should include the table's address family before the table name.

- You can list existing tables with the following command. Remember that nftables do not come with predefined tables, so the list only has the tables you have added.

        sudo nft list tables

- To delete a table, use the command:

        sudo nft delete table inet example_table

- You can also "flush" a table. This deletes every rule in every chain attached to the table. For older Linux kernels (before **3.18**), you have to run the command below before you are allowed to delete the table.

        sudo nft flush table inet example_table

### Chains

Chains live under tables and filter packets. You attach each nftables rule to a chain so that packets "caught" in the chain's filter are subsequently passed to the chain's rules.

Chains can be of two kinds. *Base* chains act as entry points for packets coming from the network stack. *Regular* chains do not act as filters, but can act as jump targets. They can help with controlling the flow and organization of your nftables.

- To create a base chain, use a command like the example command below. Replace `example_chain`, here and later, with a descriptive chain name.

        sudo nft add chain inet example_table example_chain '{type filter hook input priority 0; }'

    Refer to the nftables documentation on [configuring chains](https://wiki.nftables.org/wiki-nftables/index.php/Configuring_chains) for a list of support types and hooks. Supported types and hooks vary according to the address family of the table the chain operates on.

    In the example above, the `input` hook matches incoming packets addressed to the local system, while the `filter` type has the chain filter all matching packets. The "priority" (`0` above) determines the order in which chains are processed on a given hook; chains with lower priority values get processed first.

- To create a regular chain, the command is similar to the one used for a base chain above. However, the command for creating a regular chain lacks the portion with the `type`, `hook`, and `priority`.

        sudo nft add chain inet example_table example_chain

    Because regular chains lack hooks, they do not receive packets automatically. Instead, they rely on rules using the jump or goto action to relay packets to them. When this occurs, the regular chain processes packets just as a base chain does.

    Generally, the point in doing this is organizational. You can create a "tree" of base and regular chains, allowing you to control the arrangement and flow of your nftables ruleset.

- To delete a chain, use the command:

        sudo nft delete chain inet example_table example_chain

- To flush a chain, use a command like the following. As with tables, it may be necessary to flush a chain before you can delete it on older Linux kernels.

        sudo nft flush chain inet example_table example_chain

### Rules

Rules receive the packets filtered by chains and take actions on them based on whether they match particular criteria. Each rule consists of two parts, which follow the table and chain in the command. First, the rule has zero or more *expressions* which give the criteria for the rule. Second, the rule has one or more *statements* which determine the action or actions taken when a packet matches the rule's expressions. Both expressions and statements are evaluated from left to right. See the following example for adding a rule to get a breakdown of these two parts.

- To create a rule, use a command similar to the example. This rule takes packets from the `example_chain` and allows those representing TCP traffic on port **22**:

        sudo nft add rule inet example_table example_chain tcp dport 22 counter accept

  - Here, the `tcp dport 22` portion contains the rule's two expressions. It matches TCP packets and then matches when those packets are directed to port 22.

  - The `counter accept` portion contains the rule's two statements. First, matched packets add to the rule's counter, keeping a running count of packets matched by the rule. Second, matched packets are then accepted.

  - Be aware that verdict commands, such as `accept` and `drop`, end processing of the rule, so they should be placed at the rule's end.

- The above command adds a rule to the end of a chain. Packets progress through a chain's rules from beginning to end and cease to be processed when they match and are acted on. To add the rule to the beginning of a chain, replace `add` with `insert` in the above command.

    You can also specify the position for a rule within a chain. The following adds the rule after an existing rule in position **3**. To add the new rule before position 3, replace `add` with `insert`.

        sudo nft add rule inet example_table example_chain position 3 tcp dport 22 counter accept

- You can use a command like the example to list all chains and rules living in the `example_table`:

        sudo nft list table inet example_table

    Similarly, you can use a command like the example to list all of the rules within `example_chain` in the `example_table`.

        sudo nft list chain inet example_table example_chain

- To delete a rule, use a command like the following:

        sudo nft delete rule inet example_table example_chain handle 2

    Here, the handle is an identifier for the rule you are deleting. You can get a rule's handle by using the `-a` option when running the command for listing rules, as in:

        sudo nft list table inet example_table -a

## Example nftables Usage

Below, you can follow along to create a ruleset. The example ruleset uses an `inet` table, two chains — one for incoming packets and the other for outgoing — and a rule for each chain.

1. Create a table, `inet-table`.

        sudo nft add table inet inet-table

1. Create a chain for filtering outgoing packets, `output-filter-chain`.

        sudo nft add chain inet inet-table output-filter-chain '{ type filter hook output priority 0; }'

1. Add a rule to the chain for counting packets destined for `8.8.8.8`.

        sudo nft add rule inet inet-table output-filter-chain ip daddr 8.8.8.8 counter

1. Create another chain, this one for filtering incoming packets, and add a rule to it to count TCP packets targeting port **3030**.

        sudo nft add chain inet inet-table input-filter-chain '{ type filter hook input priority 0; }'
        sudo nft add rule inet inet-table input-filter-chain tcp dport 3030 counter

1. Verify the setup by listing the chains and rules within the table.

        sudo nft list table inet inet-table

    You should get output similar to the following:

    {{< output >}}
table ip inet-table {
    chain output-filter-chain {
        type filter hook output priority 0; policy accept;
        ip daddr 8.8.8.8 counter packets 0 bytes 0
    }
    chain input-filter-chain {
        type filter hook input priority 0; policy accept;
        tcp dport 3030 counter packets 0 bytes 0
    }
}
    {{< /output >}}

1. Test the two rules out.

    - From the machine running nftables, ping the destination address specified in the first rule.

            ping -c 1 8.8.8.8

    - From a remote machine, attempt to connect to the nftables machine via the port specified in the second rule. In this example, replace `192.0.2.0` with the IP address for the machine running nftables.

            curl 192.0.2.0:3030

    - Run the list command again, and this time your output should resemble the following:

        {{< output >}}
table ip inet-table {
    chain output-filter-chain {
        type filter hook output priority 0; policy accept;
        ip daddr 8.8.8.8 counter packets 1 bytes 84
    }
    chain input-filter-chain {
        type filter hook input priority 0; policy accept;
        tcp dport 3030 counter packets 1 bytes 64
    }
}
        {{< /output >}}

        You should see that each rule has now logged a packet in its counter, confirming that the chains and rules have successfully caught and handled the traffic.
