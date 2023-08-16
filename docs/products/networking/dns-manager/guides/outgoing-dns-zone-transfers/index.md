---
description: "How to transfer domain zones using the Linode DNS Manager."
published: 2020-07-21
modified: 2022-11-08
modified_by:
  name: Linode
title: "Outgoing DNS Zone Transfers"
keywords: ["dns"]
tags: ["linode platform","cloud manager"]
aliases: ['/products/networking/dns-manager/guides/transfer-domain-zones/']
authors: ["Linode"]
---

When a domain zone is created within Linode's DNS Manager, you can select if it will operate as a *primary* or a read-only *secondary* zone (see [Select the Zone Type](/docs/products/networking/dns-manager/guides/create-domain/#select-the-zone-type)). Selecting *primary* allows you to edit the DNS records directly within the DNS Manager and is the most common choice.

If you have configured your domain zone as *primary*, you can designate external DNS name servers as *secondaries*. The DNS Manager will then send a NOTIFY request to those name servers when you make any DNS changes. The external name server should then respond back with an AXFR query, which triggers Linode to send an AXFR response with the updated DNS zone. This guide covers the configuration needed to perform outgoing DNS zone transfers, including updating your SOA record.

{{< note type="alert" >}}
To perform AXFR transfers, you must specify the IP address for each external DNS name server you wish to use. Granting another server access to zone information is potentially dangerous. Do not add any IP addresses that you do not know or trust.
{{< /note >}}

## Configure the External DNS Provider

Before continuing, make sure that you've added your domain to the external DNS provider you wish to use. When creating the domain zone on that provider, you may be given the option to create it as a *secondary* (or *read-only*) zone. Make sure to select that option. If you do not know how to create a secondary domain zone on that DNS provider, you may need to consult their documentation or contact them for assistance.

To facilitate quick updates, Linode immediately sends the external name servers a NOTIFY request when you update DNS records through the DNS Manager. If you wish to have this trigger an AXFR zone transfer, you will likely need to add the following IP addresses to the ACL or allow-list of those name servers. If you do not do this, the external name servers will only update DNS records when the refresh time has elapsed.

```
104.237.137.10
45.79.109.10 (was 65.19.178.10)
74.207.225.10
207.192.70.10
109.74.194.10
2600:3c00::a
2600:3c01::a
2600:3c02::a
2600:3c03::a
2a01:7e00::a
```

{{< note type="alert" >}}
On February 7th, 2023, the IP address `65.19.178.10` will be retired and replaced with `45.79.109.10`. Both IPs will respond to inbound requests until the cutover date. Outbound requests will only originate from the old IP address (`65.19.178.10`) until the cutover date. Please update your firewall rules and DNS server configurations to add the new IP address (`45.79.109.10`) prior to the cutover.
{{< /note >}}

## Add Secondary Name Servers

1. Log in to the [Cloud Manager](https://cloud.linode.com), select *Domains* from the left menu, and click on the domain you wish to update.

1. Locate the **SOA Record** section and click **Edit**. This action may appear within the corresponding **ellipsis** menu.

1. In the **Edit SOA Record** pane, find the **Domain Transfer IPs**. Add the IP addresses for each external name server you wish to notify of DNS changes and send the DNS zone. To add each additional IP address, click **Add an IP**.

1. Click on **Save** to keep the changes.

{{< note >}}
If you ever decide to stop using the secondary name server, be sure to remove its IP address from this list.
{{< /note >}}

## Test AXFR Transfers

When performing the AXFR DNS query, point your secondary name server to `axfr1.linode.com` (or up to `axfr5.linode.com`) instead of `ns1.linode.com`. To test the AXFR query locally, follow the above instructions to allow your computer's IP address as one of the ****Domain Transfer IPs**** in the SOA Record for your domain. This may take a few minutes before going into effect. Then run the following `dig` command, replacing **example.com** with your domain:

    dig axfr example.com @axfr1.linode.com

The query should output all DNS records on the domain. If a `Transfer failed` message is received instead, it may be because your computer's IP address wasn't added properly within the DNS Manager. Review the settings, wait a few minutes, and then try again.