---
author:
  name: Linode
  email: docs@linode.com
description: 'Resolving an IP address to your domain name.'
keywords: 'linode dns,linode manager dns,dns configuration'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['dns-manager/','dns-guides/configuring-dns-with-the-linode-manager/']
modified: Monday, April 7th, 2014
modified_by:
  name: Linode
published: 'Thursday, July 16th, 2009'
title: Reverse DNS
---

Your desktop computer uses DNS to determine the IP address associated with a domain name. *Reverse* DNS lookup does the opposite by resolving an IP address to a designated domain name. You should always set the reverse DNS, even if your Linode hosts more than one domain name.

Before setting up the reverse DNS for your Linode, be sure to set up your domain zone and DNS records through Linode's [DNS Manager](/docs/networking/dns/dns-manager). You may also wish to view our guide on [Common DNS Configurations](/docs/networking/dns/common-dns-configurations).

Setting Reverse DNS
-------------------

1.  Select the Linode you wish to set up reverse DNS for from your Linodes tab.
2.  Click the **Remote Access** tab.
3.  Select the **Reverse DNS** link:

	[![The Reverse DNS link](/docs/assets/1709-remoteaccess_reversedns.png)](/docs/assets/1709-remoteaccess_reversedns.png)

4.  Enter a domain name in the **Hostname** field:

	[![Adding the domain name for reverse DNS](/docs/assets/1706-ptr_lookup_marked.png)](/docs/assets/1706-ptr_lookup_marked.png)

5.  Click **Look up**. A message appears indicating that a match has been found for both your IPv4 and IPv6 addresses:

	[![Reverse DNS Match found](/docs/assets/1708-ptr_lookup_match_found_small.png)](/docs/assets/1707-ptr_lookup_match_found.png)

6.  Click **Yes** beneath the desired address. Note that you can select only one address at a time. If you want to set up reverse DNS for both the IPv4 and IPv6 addresses, you can perform another lookup and select the other address.

Congratulations! You have set up reverse DNS for your domain name!

{: .note}
>
>Reverse DNS uses a *PTR Record* or *pointer record* to match up the IP address with the domain or subdomain. Because PTR records are generally set with your hosting provider, when hosting on a Linode you will always set the reverse DNS within the Linode Manager using the method detailed above.
>
>For more information about [PTR records](/docs/networking/dns/introduction-to-dns-records#ptr) and DNS in general please see our [Introduction to DNS Records](/docs/networking/dns/introduction-to-dns-records) guide.