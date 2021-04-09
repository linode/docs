---
slug: dns-manager-transfer-domain-zone-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to transfer a domain zone.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-21
modified_by:
  name: Heather Zoppetti
published: 2020-07-21
title: Transfer a Domain Zone in Cloud Manager
keywords: ["dns"]
headless: true
show_on_rss_feed: false
tags: ["linode platform","cloud manager"]
aliases: ['/platform/manager/dns-manager-transfer-domain-zone-shortguide/']
---

Linode's DNS servers allow Domain zone transfers to non-Linode DNS servers that you designate and trust. This feature can be used to transfer a Domain zone to another hosting provider's DNS servers. To enable this capability, you will need to alter your Domain's SOA record. This section will cover these steps.

  {{< caution >}}
Granting another server access to zone information is potentially dangerous. Do not add any IP addresses that you do not know or trust.
  {{</ caution >}}

1. From the **Domains** section of the Cloud Manager, find the domain for which you would like to enable Domain zone transfer and click on the entry to access its Domain records.

1. Viewing your Domain's records, under the **SOA Record** section, click on the **more options ellipsis** corresponding to your Domain's SOA records and select **Edit**.

    ![Edit SOA records](edit-soa-record.png "Edit SOA records")

1. In the **Edit SOA Record** pane, find the **Domain Transfer IPs** section and enter the IP addresses corresponding to the DNS servers you'd like to give access to your Domain's zone file. Each field should contain a single IP address and additional fields will appear when the **Add an IP** link is clicked.

1. When you've completed your update, click on **Save**.

    {{< note >}}
When the DNS servers no longer need access to your Domain's zone file, remove the IP address from the **Domain Transfers** field.
    {{</ note >}}

When performing the AXFR DNS query, point your secondary name server to `axfr1.linode.com` (or up to `axfr5.linode.com`) instead of `ns1.linode.com`. To test the AXFR query locally, follow the above instructions to allow your computer's IP address as one of the ****Domain Transfer IPs**** in the SOA Record for your domain. This may take a few minutes before going into effect. Then run the following `dig` command, replacing **example.com** with your domain:

    dig axfr example.com @axfr1.linode.com

The query should output all DNS records on the domain. If a `Transfer failed` message is received instead, it may be because your computer's IP address wasn't added properly within the DNS Manager. Review the settings, wait a few minutes, and then try again.