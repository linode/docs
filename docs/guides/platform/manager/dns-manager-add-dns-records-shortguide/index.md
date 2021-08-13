---
slug: dns-manager-add-dns-records-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to add DNS records.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-21
modified_by:
  name: Heather Zoppetti
published: 2020-07-21
title: Add a DNS Records in Cloud Manager
keywords: ["dns"]
headless: true
show_on_rss_feed: false
tags: ["linode platform","cloud manager"]
aliases: ['/platform/manager/dns-manager-add-dns-records-shortguide/']
---

After a domain has been created, you're able to add DNS records. Each type of DNS record is used for a different purpose. The applications that utilize your domain determine which DNS records you need to add.

1.  Select a domain from within the **Domains** section of the Cloud Manager.

1.  The page for a domain is divided into sections for each type of DNS record. Locate the section for the type of DNS record you want to add, then click **Add a Record** to display the **Create Record** form.

1.  Complete the **Create Record** form with the settings needed for your desired functionality. The exact form fields vary depending on the type of DNS record you select.

    {{< note >}}
For advice on creating various types of DNS records, see the following sections of the [DNS Records: An Introduction](/docs/guides/dns-records-an-introduction/) guide: [A and AAAA](/docs/guides/dns-records-an-introduction/#a-and-aaaa), [CNAME](/docs/guides/dns-records-an-introduction/#cname), [MX](/docs/guides/dns-records-an-introduction/#mx), [NS](/docs/guides/dns-records-an-introduction/#ns), [SPF](/docs/guides/dns-records-an-introduction/#spf), [TXT](/docs/guides/dns-records-an-introduction/#txt), and others.
{{< /note >}}

    As an example, a new A/AAAA record requires the following fields:

    - **Hostname:** The hostname you wish to use. This is also referred to as the subdomain. Leave this field blank (or enter a `@` character) to use the base domain (`example.com`) or enter a value to use a specific subdomain. For instance, entering `www` creates a record for `www.example.com`.
    - **IP Address:** Enter the IPv4 address of the target server if you wish to create an A record. Enter the IPv6 address of the server to create a AAAA (pronounced *quad A*) record. See the [Find Your Linode's IP Address](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/) guide for help locating an IP address on your Linode Compute Instance.
    - **TTL** - *Time To Live* (pronounced as `lɪv`): Sets the lifespan of the cache for the DNS record. Setting the TTL to **5 minutes** is recommended for many use cases. If **Default** is selected, the TTL is set to **24 hours**. To provide some context, most DNS queries are handled by a DNS resolver, which acts as the middle entity between the end user's computer and the authoritative name servers. When the DNS resolver receives a query for a new DNS record, it asks the authoritative name server and stores the result in its cache. If another request for that DNS record comes in and the TTL value *has not yet elapsed*, the DNS resolver uses the cached copy. If the TTL *has elapsed*, the DNS resolver re-queries the authoritative name server.

1.  Click **Save**. Your DNS record is created and visible in the Cloud Manager.

{{< note >}}
New DNS records may take up to 24 hours to propagate throughout the internet, although they are usually visible within several hours.
{{</ note >}}