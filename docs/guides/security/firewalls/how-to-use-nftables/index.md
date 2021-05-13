---
slug: how-to-use-nftables
author:
  name: Linode Community
  email: docs@linode.com
description: "nftables is replacing iptables, redesigned from the ground up. With it come remarkable improvements but also changes in how you set up your packet rules. Learn about what nftables is and how it differs from iptables, and get a hands-on look at it in this guide."
og_description: "nftables is replacing iptables, redesigned from the ground up. With it come remarkable improvements but also changes in how you set up your packet rules. Learn about what nftables is and how it differs from iptables, and get a hands-on look at it in this guide."
keywords: ['nftables','iptables','netfilter','nftables examples']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-13
modified_by:
  name: Nathaniel Stickman
title: "How to Use nftables"
h1_title: "How to Use nftables"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[nftables Wiki: What is nftables?](https://wiki.nftables.org/wiki-nftables/index.php/What_is_nftables%3F)'
- "[Red Hat Developer: What comes after 'iptables'? Its successor, of course: 'nftables'](https://developers.redhat.com/blog/2016/10/28/what-comes-after-iptables-its-successor-of-course-nftables/)"
---

nftables has arrived to replace the successful iptables and its related frameworks built on Netfilter. With nftables come improvements to performance and usability, but also significant changes to syntax and usage.

Use this guide to get started learning about what nftables is and how it differs from iptables. Follow along with this guide's example to implement your own rules in nftables and get a hands-on idea of what it can do.

## Before You Begin

1. Familiarize yourself with our [Getting Started](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, you can do this with:

            sudo apt update && sudo apt upgrade

    - On CentOS, use:

            sudo yum update

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What is nftables?

nftables is a Linux packet classification framework that replaces the Netfilter infrastructure behind iptables, ip6tables, arptables, and ebtables. Frameworks using the legacy Netfilter infrastructure are being phased out as the major Linux distributions have begun to adopt nftables as the default packet classification framework.

Why? Despite the ubiquity of iptables, its architecture has several underlying limitations and inefficiencies, and these could only be resolved with a fundamental redesign. That redesign is what nftables set out to accomplish.

## nftables vs. iptables

nftables keeps some of the familiar parts of the Netfilter infrastructure and iptables. As with iptables, nftables still uses the tables, chains, and rules hierarchy — tables containing chains, and chains containing rules. While nftables changes the command-line syntax, it maintains a compatibility layer that allows you to run iptables commands over the nftables kernel.

But nftables also introduces significant changes in usage from iptables. For one, as mentioned above, the command-line syntax for nftables is different. What follows are additional notable differences between nftables and iptables:

- Unlike iptables, nftables does not have predefined tables or chains, which goes toward improving performance.
- In nftables, rules can take multiple actions, as opposed to iptables' limitation to a single action per rule.
- nftables comes with an `inet` address family that allows you to easily create tables that apply to both IPv4 and IPv6.
- nftables' ruleset is represented by a dynamic linked list, which improves the ruleset's maintainability compared to iptables' monolithic blob ruleset.

Additionally, nftables' generic set infrastructure opens new options for structuring your ruleset, even allowing for multidimensional "tree" structures. You can use this to significantly reduce the number of rules queried to determine an appropriate action for a packet.

## How to Install nftables

You do not need to install nftables if you are using one of the following distribution releases or later:

- Debian 10 (Buster)
- Ubuntu 20.10 (Groovy Gorilla)
- CentOS 8
- Fedora 32

Otherwise, you can manually install nftables using the following steps. These are specifically intended for Debian/Ubuntu distributions and CentOS distributions. However, with minor modifications, the steps should be adaptable for other distributions as well:

{{< note >}}
You need to be running one of the following releases or later to install nftables via the distributions' package managers:

- Debian 9
- Ubuntu 18.04
- CentOS 7

{{< /note >}}

1. Install nftables.

    - On Debian and Ubuntu distributions, use the command:

            sudo apt install nftables

    - On CentOS distributions, use:

            sudo yum install nftables

1. Enable and start the nftables service:

        sudo systemctl enable nftables
        sudo systemctl start nftables

1. If you have rules in iptables that you would like to preserve, install the `iptables-nftables-compat` tool. Then, export your iptables rules, translate them, and import into nftables:

        sudo apt install iptables-nftables-compat
        sudo iptables-save > iptables.dump
        sudo iptables-restore-translate -f iptables.dump > ruleset.nft
        sudo nft -f ruleset.nft

    You can verify the import by getting a list of tables now in nftables:

        sudo nft list tables

## How to Use nftables

This section breaks down each of the major components in nftables, providing their most useful commands. At the end, you can find a demonstration of how to set up a working rule, review nftables' output, and test the rule in action.

### Tables

Tables are the highest level of the nftables hierarchy. A given table corresponds to a single address family and contains chains which filter packets in that address family.

- To create a table, use a command like the following. Replace `example_table`, here and in subsequent examples, with a descriptive name for the table:

        nft add table inet example_table

    Here, `inet` identifies the address family for the table. Refer to the nftables documentation [on address families](https://wiki.nftables.org/wiki-nftables/index.php/Nftables_families) for a complete list of supported address family identifiers. The `inet` option used here is also used in subsequent examples where an address family is called for.

- You can list existing tables with the following command. Remember that nftables does not come with predefined tables, so the list only has the tables you have added:

        nft list tables

- To delete a table, use a command like:

        nft delete table inet example_table

- You can also "flush" a table. This deletes every rule in every chain attached to the table. For older Linux kernels (before **3.18**), you have to run this command before you are allowed to delete the table:

        nft flush table inet example_table

### Chains

Chains live under tables and filter packets. You attach each nftables rule to a chain, so that packets "caught" in the chain's filter is subsequently passed to the chain's rules.

Chains can be of two kinds. **Base** chains act as entry points for packets coming from the network stack. **Regular** chains do not act as filters, but can act as jump targets. They can help with controlling the flow and organization of your nftables.

- To create a base chain, use a command like the following. Replace `example_chain`, here and later, with a descriptive chain name:

        nft add chain inet example_table example_chain '{type filter hook input priority 0; }'

    Refer to the nftables documentation [on configuring chains](https://wiki.nftables.org/wiki-nftables/index.php/Configuring_chains) for a list of support types and hooks. Supported types and hooks vary according to the address family the chain operates on.

    In the example above, the `input` hook matches incoming packets addressed to the local system, while the `filter` type has the chain filter all matching packets. The priority (`0` above) determines the order in which chains are processed on a given hook; chains with lower priority values get processed first.

- To create a regular chain, the command is similar to the one used for a base chain above. However, the regular chain command lacks the portion of the command with the hook:

        nft add chain inet example_table example_chain

    Because regular chains lack hooks, they do not receive packets automatically. Instead, they rely on rules using the jump or goto action to relay packets to them. When this occurs, the regular chain processes packets just as a base chain does.

    Generally, the point in doing this is organizational. You can create a "tree" of base and regular chains, allowing you to control the arrangement and flow of your nftables.

- To delete a chain, use a command like:

        nft delete chain inet example_table example_chain

- To flush a chain, use a command like the following. As with tables, it may be necessary to flush a chain before you can delete it on older Linux kernels:

        nft flush chain example_table example_chain

### Rules

Rules receive the packets filtered by chains and take actions on them based on whether they match particular criteria.

Each rule consists of two parts, which follow the table and chain in the command. First, the rule has zero or more **expressions** which give the criteria for the rule. Second, the rule has one or more **statements** which determine the action or actions taken when a packet matches the rule's expressions. Both expressions and statements are evaluated from left to right. See following example for adding a rule to get a breakdown of these two parts.

 - To create a rule, use a command like the following. This rule takes packets from the `example_chain` and allows those representing TCP traffic on port **22**:

        nft add rule example_table example_chain tcp dport 22 counter accept

    Here, the `tcp dport 22` contains the rule's two expressions, matching TCP packets and then matching when those packets is directed to port **22**. The `counter accept` contains the rule's two statements, first adding to the rule's counter and then allowing the matching packets.

    The counter can be useful for logging and debugging, keeping a running count of how many times the rule has matched packets.

    Be aware that verdict commands, such as `accept` and `drop`, end processing of the rule, so they should be placed at the rule's end.

- The above command adds a rule to the end of a chain. Packets progress through a chain's rules from beginning to end and cease to be processed when they match and are acted on. To add the rule to the beginning of a chain, replace `add` with `insert` in the above command.

    You can also specify the position for a rule within a chain. The following adds the rule after an existing rule in position **3**. To add the new rule before position **3**, replace `add` with `insert`:

        nft add rule example_table example_chain position 3 inet tcp dport 22 counter accept

- You can use a command like to following to list all chains and rules living in the `example_table`:

        nft list table example_table

    Similarly, you can use a command like the following to list all of the rules within `example_chain` in the `example_table`:

        nft list chain example_table example_chain

## Example nftables Usage

Below, you can follow along to create a ruleset. This example ruleset uses an `inet` table, two chains — one for incoming packets and the other for outgoing — and a rule for each chain.

1. Create a table, `inet-table`:

        sudo nft add table inet inet-table

1. Create a chain for filtering outgoing packets, `output-filter-chain`:

        sudo nft add chain inet-table output-filter-chain '{ type filter hook output priority 0; }'

1. Add a rule to the chain for counting packets destined for `8.8.8.8`:

        sudo nft add rule inet-table output-filter-chain ip daddr 8.8.8.8 counter

1. Create another chain, this one for filtering incoming packets, and add a rule to it to count TCP packets targeting port **3030**:

        sudo nft add chain inet-table input-filter-chain '{ type filter hook input priority 0; }'
        sudo nft add rule inet-table input-filter-chain tcp dport 3030 counter

1. Verify the setup by listing the chains and rules within the table:

        sudo nft list table inet-table

    You should get output similar to:

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

    - From the machine running nftables, ping the destination address specified in the first rule:

            ping -c 1 8.8.8.8

    - From a remote machine, attempt to connect to the nftables machine via the port specified in the second rule. In this example, replace `198.51.100.0` with the IP address for machine running nftables:

            curl 198.51.100.0

    - Run the list command again, and this time your output should resemble:

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
