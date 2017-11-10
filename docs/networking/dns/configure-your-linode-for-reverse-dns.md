---
author:
  name: Linode
  email: docs@linode.com
description: 'Reverse DNS (rDNS) resolves an IP address to the designated domain name. This guide will teach you how to set it up.'
keywords: ["reverse dns", "dns manager", "dns configuration", "IP address", "PTR record"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['dns-manager/','dns-guides/configuring-dns-with-the-linode-manager/','networking/dns/setting-reverse-dns/','networking/Setting-Up-Reverse-DNS-Lookup/','networking/configure-your-linode-for-reverse-dns/']
modified: 2017-07-27
modified_by:
  name: Linode
published: 2015-07-09
title: Configure Your Linode for Reverse DNS (rDNS)
---

Your desktop computer uses DNS to determine the IP address associated with a domain name. *Reverse* DNS lookup does the opposite by resolving an IP address to a designated domain name. You should always set the reverse DNS, even if your Linode hosts more than one domain name.

Before setting up the reverse DNS for your Linode, be sure to set up your domain zone and DNS records through Linode's [DNS Manager](/docs/networking/dns/dns-manager). You may also wish to view our guide on [Common DNS Configurations](/docs/networking/dns/common-dns-configurations).

{{< note >}}
Reverse DNS uses a *PTR Record* or *pointer record* to match the IP address with the domain or subdomain. Because PTR records are generally set with your hosting provider, when hosting on a Linode, you will always set the reverse DNS within the Linode Manager, using the method detailed below.

For more information about [PTR records](/docs/networking/dns/dns-records-an-introduction/#ptr) and DNS in general please see our [Introduction to DNS Records](/docs/networking/dns/introduction-to-dns-records) guide.
{{< /note >}}

## Setting Reverse DNS

1.  Select the Linode you wish to set up reverse DNS for from your Linodes tab.
2.  Click the **Remote Access** tab.
3.  Select the **Reverse DNS** link:

	[![The Reverse DNS link](/docs/assets/1709-remoteaccess_reversedns.png)](/docs/assets/1709-remoteaccess_reversedns.png)

4.  Enter your Linode's fully qualified domain name in the **Hostname** field:

	[![Adding the domain name for reverse DNS](/docs/assets/1706-ptr_lookup_marked.png)](/docs/assets/1706-ptr_lookup_marked.png)

5.  Click **Look up**. A message appears indicating that a match has been found for both your IPv4 and IPv6 addresses:

	[![Reverse DNS Match found](/docs/assets/1707-ptr_lookup_match_found.png)](/docs/assets/1707-ptr_lookup_match_found.png)

6.  Click **Yes** beneath the desired address. Note that you can select only one address at a time. If you want to set up reverse DNS for both the IPv4 and IPv6 addresses, you can perform another lookup and select the other address.

Congratulations! You have set up reverse DNS for your domain name!
