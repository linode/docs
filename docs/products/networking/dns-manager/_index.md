---
title: DNS Manager
title_meta: "Linode DNS Manager Product Documentation"
description: "The Linode DNS Manager provides simple and convenient management for all your high availability DNS records. You can import DNS zones with ease and Cloudflare DDoS mitigation is built-in."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
    product_description: "A comprehensive, reliable, and fast DNS service, providing easy domain management to Linode customers at no charge."
modified: 2023-03-16
aliases: ['/dns-manager/','/platform/manager/dns-manager/','/networking/dns/dns-manager/','/platform/manager/dns-manager-new-manager/','/networking/dns/dns-manager-overview/','/platform/manager/dns-manager-classic-manager/','/guides/dns-manager/']
---

The *Domains* section of the [Cloud Manager](https://cloud.linode.com/domains) is a comprehensive DNS management interface, referred to as the Linode DNS Manager. Within the DNS Manager, you can add your registered domain names and manage DNS records for each of them.

## High Availability

Linode's DNS service is anycasted to over 250 locations (*PoPs*) around the world. This provides distributed denial-of-service (DDoS) attack mitigation, load balancing, and increased geographic distribution for our [name servers](/docs/guides/dns-overview/#name-servers). If one name server suffers an outage, the service will automatically failover to a redundant name server. These factors make our service reliable, fast, and a great choice for your DNS needs.

## Flexible Configuration

In addition to supporting a wide range of DNS record types, the Linode DNS Manager offers even more flexibility through AXFR transfers and zone types (*primary* and *secondary*). These two features work together so you can create a DNS configuration that works for your own application. Using Linode as the *primary* DNS Manager is the most common option and allows you to manage DNS records directly on the Linode platform. Operating as a *secondary* DNS provider, you can mange your DNS records within other services or tools (like cPanel) but still host them on Linode, taking advantage of the reliability and high availability of our platform.

## Pricing and Availability

The DNS Manager is available at no charge across [all regions](https://www.linode.com/global-infrastructure/).

{{< note type="warning" title="DNS Manager Compute Instance requirement">}}
To use the Linode DNS Manager to serve your domains, you must have at least one active Compute Instance on your account. If your account does not have any Compute Instances (for instance, if they have all been removed), DNS records will not be served.
{{< /note >}}

## Technical Specifications

- High-availability managed DNS provider
- Anycast DNS with over 250 PoPs (*point of presence*)
- DDoS mitigation
- Supports outgoing and incoming DNS zone transfers
- Can be configured as a read-only secondary DNS
- IPv6 support
- Manage domains through an intuitive web-based control panel ([Cloud Manager](https://cloud.linode.com/)), the [Linode CLI](https://www.linode.com/products/cli/), or programmatically through the [Linode API](https://www.linode.com/products/linode-api/)

## Limits and Considerations

- *DNSSEC* is not supported and should be disabled on your domain's registrar.

- *CNAME flattening* is not supported. This means that you are not able to use the root (apex) domain as the hostname for a CNAME record.
