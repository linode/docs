---
slug: members-linode-com-migration
author:
  name: Linode Community
  email: docs@linode.com
description: 'The members.linode.com and nodebalancer.linode.com are deprecated. Follow the steps in this guide to use the new domain for forward and reverse DNS.'
og_description: 'The members.linode.com and nodebalancer.linode.com domains are deprecated. Follow the steps in this guide to use the new domain for forward and reverse DNS.'
keywords: ['dns','members.linode.com','reverse dns']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-07
modified_by:
  name: Linode
title: "members.linode.com and nodebalancer.linode.com Migration"
h1_title: "Migrating Away from members.linode.com and nodebalancer.linode.com"
enable_h1: true
---

## What are members.linode.com and nodebalancer.linode.com?

All Linodes and NodeBalancers are created with a *forward* DNS address and a *reverse* DNS entry. For all Linode Instances, the address follows the `[signifier].members.linode.com` pattern. For NodeBalancers, the pattern is `nb-[ip-address].[region].nodebalancer.linode.com`. For example, below is a typical Linode Instance's forward DNS on the `members.linode.com` domain:

    li999-999.members.linode.com

The forward DNS for a NodeBalancer looks like the following:

    nb-192-0-2-1.dallas.nodebalancer.linode.com

Linode Instances and NodeBalancers are accessible at these addresses. Typically, these addresses are not used publicly in production. It's much more favorable to provide access to these services with a personal or company domain name. But, some users may use these addresses in scripts, applications, or DNS configurations.

## What's Changing, and What Action Should I Take?

Linode is changing the forward and reverse DNS associated with every Linode Instance, and the forward DNS and reverse DNS associated with every NodeBalancer. This new domain name follows a new pattern. Both Linode Instances and NodeBalancers are available at `[ip-address].ip.linodeusercontent.com`. For instance, if your Linode Instance or NodeBalancer has an IP address of `192.0.2.1`, the corresponding forward DNS address is:

    192-0-2-1.ip.linodeusercontent.com

Note that dashes separate the values of the IP address, and not periods.

If you *don't* actively use the `members.linode.com` or `nodebalancer.linode.com` forward or reverse DNS in any of your scripts, applications, or domain settings, then this migration does not impact your properties.

If you *do* use your Linode Instance's `members.linode.com` or `nodebalancer.linode.com` forward or reverse DNS, you have until December 31st, 2021 to change your scripts, applications, or domain settings to the new address. After this date, Linode will end support for `members.linode.com` and `nodebalancer.linode.com`.

### How to Adopt the New Domain Addresses

For forward DNS, all Linodes and NodeBalancers can be accessed at the new address of `[ip-address].ip.linodeusercontent.com` without further configuration. However, you should locate all instances of prior `members.linode.com` or `nodebalancer.linode.com` domain addresses in your codebase, application configuration files, etc., and change them to the new address.

{{< note >}}
While Linode provides forward and reverse DNS for Linodes and NodeBalancers as a courtesy, Linode encourages all users to use their own domain addresses for these purposes. Any application that is dependent on these addresses should be re-imagined to have less dependence on them.
{{</ note >}}

#### Finding a Linode's IP Address

1. In [Cloud Manager](https://cloud.linode.com), select **Linodes** from the navigation menu, then select the Linode for which you'd like to find the IP Address.

1. Under IP Addresses, select the top IPv4 address. This is the IP address that you can use with the new forward DNS.

#### Finding a NodeBalancer's IP Address

1. In [Cloud Manager](https://cloud.linode.com), select **NodeBalancers** from the navigation menu, then select the NodeBalancer for which you'd like to find the IP Address.

1. On the right hand of the screen, under *IP Addresses*, note the top IPv4 Address. This is the address you can use to access your NodeBalancer's forward DNS.

#### Finding an Existing members.linode.com Address

To find an existing `members.linode.com` address:

1. In [Cloud Manager](https://cloud.linode.com), select **Linodes** from the navigation menu, then select the Linode for which you'd like to find the domain.

1. Click on the **Network** tab.

1. Under **IP Addresses**, find the Linode Instance's IP address and it's corresponding reverse DNS entry.

    !["A Linode Instance's Network page displays the Linode's reverse DNS"](locate-rdns-linode.png)

    The value under reverse DNS is the Linode Instance's current `members.linode.com` address.

#### Finding an Existing nodebalancer.linode.com Address

To find an existing `nodebalancer.linode.com` address:

1. In [Cloud Manager](https://cloud.linode.com), select **NodeBalancers** from the navigation menu, then select the NodeBalancer for which you'd like to find the domain.

1. On the **Summary** page, on the right of the page, find the NodeBalancer's Hostname.

    !["A NodeBalancer's forward DNS is available on a NodeBalancer's summary page"](locate-domain-nodebalancer.png)

    This is your NodeBalancer's existing forward DNS.

### Updating Reverse DNS

To change a Linode's reverse DNS, review the [Configure Your Linode for Reverse DNS](https://www.linode.com/docs/guides/configure-your-linode-for-reverse-dns/) guide. If a user does not take action to change their reverse DNS to either the new `ip.linodeusercontent.com` domain or another domain of their choosing, Linode will change the corresponding reverse DNS entry on December 31st, 2021.

There is no way for a customer to change a NodeBalancer's reverse DNS, and as such the change will be made by Linode.
