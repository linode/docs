---
description: "Learn how to create SOA records using Linode's DNS Manager"
published: 2022-10-28
modified_by:
  name: Linode
title: "SOA Record"
keywords: ["dns"]
tags: ["linode platform"]
authors: ["Linode"]
---

## SOA Overview

The **SOA** (*Start of Authority*) record stores administrative information for the domain. This includes the responsible party's email address and various time periods for actions taken by secondary name servers. While some DNS providers do not offer the ability to modify the SOA record, some fields can be modified in Linode's DNS Manager.

## Properties

- **Domain** (also called *NAME*): The domain name for the *Domain* entry and the corresponding zone file. Only change this value if you wish to change the domain name that is managed by Linode's DNS Manager.

- **SOA Email** (also called *RNAME*): The administrative email address for the domain. This email should belong to a *different* domain.

- **Domain Transfer IPs:** A list of IP addresses that are able to perform AXFR transfers. If you wish to allow other DNS providers the ability to transfer the domain zone, their corresponding IP addresses can be added here. See [Transfer Domain Zones](/docs/products/networking/dns-manager/guides/outgoing-dns-zone-transfers/)

- **Default TTL** (*Time To Live*): The length of time that DNS resolvers should store the DNS record *before* revalidating it with Linode's name servers. Setting the TTL to **5 minutes** is recommended for many use cases. If **Default** is selected, the TTL is set to **24 hours**.

- **Refresh Rate:** The amount of time (in seconds) a secondary DNS server will keep the zone file before it checks for changes.

- **Retry Rate:** The amount of time a secondary DNS server will wait before retrying a failed zone file transfer.

- **Expire Rate:** The amount of time a secondary DNS server will wait before expiring its current zone file copy if it cannot update itself.