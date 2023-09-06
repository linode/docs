---
description: "Learn how to create CNAME records using Linode's DNS Manager"
published: 2022-10-28
modified_by:
  name: Linode
title: "CNAME Records"
keywords: ["dns"]
tags: ["linode platform"]
authors: ["Linode"]
---

## CNAME Overview

A **CNAME** (*Canonical Name*) record maps one subdomain to another subdomain, a root domain, or even a different domain entirely. Essentially, it creates an *alias* to the specified *target* domain. CNAME records are very common and prevent administrators from repeating IP addresses or other information across multiple DNS records.

To provide an example, consider that *docs.example.com* is hosted on the same server as *example.com*. Also consider that an [A record](/docs/products/networking/dns-manager/guides/a-record/) already exists for *example.com*, which specifies the IP address of the server. Instead of creating another A record, you can create a CNAME record for *docs.example.com* and set it as an alias to *example.com*. When a DNS lookup occurs on *docs.example.com*, the DNS resolver sees that it is a CNAME record and performs another DNS lookup on the target domain. As the second query is for an A record, the IP address of the server is returned, which allows the user to access the website on that server.

In most cases, the target domain should resolve to another type of DNS record, like an A record. However, you can configure CNAME looping, which occurs when a CNAME points to another CNAME. In this case, the last record in the chain must be another type of record.

## Properties

- **Hostname:** The subdomain that you wish to use.

    - Enter a string that's 1-63 characters in length and contains only letters, numbers, and underscores. Hyphens can also be used, but the string cannot start with one.

    {{< note >}}
    Using the root domain as the hostname for a CNAME record is called *CNAME flattening* and is not supported on Linode's DNS Manager.
    {{< /note >}}

- **Alias to:** The full domain name of the canonical domain, where traffic should be redirected. You can also use the `@` character to use the root domain.

- **TTL** (*Time To Live*): The length of time that DNS resolvers should store the DNS record *before* revalidating it with Linode's name servers. Setting the TTL to **5 minutes** is recommended for many use cases. If **Default** is selected, the TTL is set to **24 hours**.