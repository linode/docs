---
description: "Learn how to create A and AAAA records using Linode's DNS Manager"
published: 2023-02-03
modified_by:
  name: KincaidYang
title: "A and AAAA Records"
keywords: ["dns"]
tags: ["linode platform"]
authors: ["Linode"]
---

## A and AAAA Overview

An **A** (*Address*) record matches a domain name to an IPv4 address, specifically the address of the machine hosting the desired resource for the domain. **AAAA** (also called *quad A*) records are the same as *A* records, but store the IPv6 address of the machine instead of the IPv4 address. See [Overview of DNS and DNS Records > A and AAAA](/docs/guides/dns-overview/#a-and-aaaa).

## Properties

- **Hostname:** The root domain or the subdomain that you wish to use.

    - For the root domain (such as *example.com*), enter the `@` character or leave the field blank.
    - For a subdomain (such as *host.example.com*), enter a string that's 1-63 characters in length and contains only letters, numbers, and underscores. Hyphens can also be used, but the string cannot start with one.

- **IP Address:** The IPv4 or IPv6 address of the target server, such as a Linode Compute Instance. The Linode DNS Manager automatically creates either an A record or AAAA record depending on the type of IP address. See the [Find Your Linode's IP Address](/docs/guides/find-your-linodes-ip-address/) guide for help locating an IP address on your Linode Compute Instance.

- **TTL** (*Time To Live*): The length of time that DNS resolvers should store the DNS record *before* revalidating it with Linode's name servers. Setting the TTL to **5 minutes** is recommended for many use cases. If **Default** is selected, the TTL is set to **24 hours**.

## Examples

- **Hosting a website using the domain *example.com*.** Set the **Hostname** to `@` and the **IP Address** to the IPv4 address of the server hosting the website. If you wish to support IPv6 users (such as devices connected over many cellular networks), also create an AAAA record with the same hostname but using the IPv6 address of the server.

    {{< note >}}
    While you can also create an A record for a subdomain, like *www.example.com*, it's more common to use CNAME records if the subdomain points to the same server. This limits the amount of places you might need to enter your IP address and reduces the overall number of DNS records you need to maintain.
    {{< /note >}}

- **Configuring the FQDN (fully qualified domain name) for a server.** Machines are often addressed by their FQDN, not their IP addresses. To set up an FQDN, create an A (and/or AAAA) record using the hostname of the machine (such as `web01` for *web01.example.com*.) and map it to its primary IPv4 or IPv6 address.
