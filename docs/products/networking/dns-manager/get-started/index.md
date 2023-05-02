---
title: Get Started
title_meta: "Getting Started with the Linode DNS Manager"
description: "Learn how to get up and running with the Linode DNS Manager, including creating and importing domains."
tab_group_main:
    weight: 20
modified: 2023-03-16
---

Linode's DNS Manager enables users to manage DNS records for each of their domains directly within the tools they already use: like the Cloud Manager, Linode CLI, or Linode API. It supports most common DNS record types, including A, AAAA (quad A), CNAME, MX, TXT, NS, SOA, SRV, and CAA. Follow this guide to learn how to start using the DNS Manager.

1. [Register the Domain](#register-the-domain)
1. [Create the Domain Zone](#create-the-domain-zone)
1. [Add DNS Records](#add-dns-records)
1. [Use Linode's Name Servers](#use-linodes-name-servers)

## Understanding DNS

The Domain Name System (DNS) attaches human-readable domain names to machine-usable IP addresses. In many ways, it is the phone book of the Internet. Just like a phone book can help you find the phone number of a business, DNS can take a domain name like `google.com` and translate it into an IP address like `74.125.19.147`. This global system allows users to remember the names of websites instead of their numeric IP addresses. To learn more, see [Overview of DNS and DNS Records](/docs/guides/dns-overview/).

## Register the Domain

Determine what domain name you wish to use and, if you haven't done so already, register it through a domain registrar. The registration process gives you ownership of the domain for the specified number of years. The cost depends on the registrar, the TLD (top level domain), and the number of years. Domains cannot be purchased directly through Linode. Instead, use a third-party domain registrar such as [GoDaddy](https://www.godaddy.com/), [Namecheap](https://www.namecheap.com/), or [Hover](https://www.hover.com/).

## Create the Domain Zone

A *domain zone* (also called a [DNS zone](https://en.wikipedia.org/wiki/DNS_zone)) is a collection of DNS records for a particular domain. For full instructions on creating a domain zone, see [Create a Domain](/docs/products/networking/dns-manager/guides/create-domain/).

1. Log in to the [Cloud Manager](https://cloud.linode.com/) and select **Domains** from the left navigation menu. Click the **Create Domain** button.

1. Select either **Primary** or **Secondary** as the zone type. This changes some of the form options below it.

1. Enter the domain name you wish to use into the **Domain** field.

1. For *primary* domains, enter the **SOA Email** and optionally use the **Insert Default Records** dropdown if you would like to pre-populate the domain zone with information from an existing service.

1. For *secondary* domains, add the IP Address of your external DNS provider's name server. If they have more than one name server, click **Add an IP** to add each additional one if desired. See [Incoming DNS Zone Transfers > Operate as a Secondary Read-Only DNS Service](/docs/products/networking/dns-manager/guides/incoming-dns-zone-transfers/#operate-as-a-secondary-read-only-dns-service).

1. Click the **Create Domain** button to create the domain zone.

{{< note type="warning" title="DNS Manager Compute Instance requirement">}}
To use the Linode DNS Manager to serve your domains, you must have at least one active Compute Instance on your account. If your account does not have any Compute Instances (for instance, if they have all been removed), DNS records will not be served.
{{< /note >}}

## Add DNS Records

DNS records can associate specific domain names with pieces of information, such as a server's IP address. After the domain has been created, you can immediately start adding and editing DNS records for it. See [Manage DNS Records](/docs/products/networking/dns-manager/guides/manage-dns-records/) for instructions. You can also view each supported DNS record type to learn more about what it does and how to create it.

- [A and AAAA Records](/docs/products/networking/dns-manager/guides/a-record/)

- [CNAME Records](/docs/products/networking/dns-manager/guides/cname-record/)

- [MX Records](/docs/products/networking/dns-manager/guides/mx-record/)

- [TXT Records](/docs/products/networking/dns-manager/guides/txt-record/)

- [NS Records](/docs/products/networking/dns-manager/guides/ns-record/)

- [SOA Record](/docs/products/networking/dns-manager/guides/soa-record/)

- [SRV Records](/docs/products/networking/dns-manager/guides/srv-record/)

- [CAA Records](/docs/products/networking/dns-manager/guides/caa-record/)

If you are migrating to Linode from another DNS provider, make sure you have added all of the necessary DNS records to your domain zone before adding Linode’s name servers to your domain's registrar.

## Use Linode's Name Servers

Once you are ready, set Linode's name servers as the authoritative name servers for your domain. To do this, log in to your domain registrar's control panel and set the name servers for your domain name to the entries below. See the instructions on your domain name registrar's website for more information.

- `ns1.linode.com`
- `ns2.linode.com`
- `ns3.linode.com`
- `ns4.linode.com`
- `ns5.linode.com`

The name for this setting various among registrars, but it is commonly called *external* or *custom* name servers. Follow the instructions for your registrar:

- [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/)
- [GoDaddy](https://www.godaddy.com/help/change-nameservers-for-my-domains-664)
- [Hover](https://help.hover.com/hc/en-us/articles/217282477--Changing-your-domain-nameservers)

{{< note >}}
DNS changes can take up to 24 hours to propagate throughout the internet, although the changes are usually visible within several hours.
{{< /note >}}
