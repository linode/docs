---
description: "Learn how to create domain zones to manage your DNS records using the Linode DNS Manager."
modified: 2022-10-28
modified_by:
  name: Linode
published: 2020-07-21
title: "Create a Domain"
keywords: ["dns"]
tags: ["linode platform","cloud manager"]
aliases: ['/products/networking/dns-manager/guides/add-domains/']
authors: ["Linode"]
---

This guide walks you through how to create a domain through the Cloud Manager. Adding a domain only takes a few steps. Here's an outline on how to create a domain using Cloud Manager.

1. [Open the Create Domain Form in the Cloud Manager](#open-the-create-domain-form-in-the-cloud-manager)
1. [Select the Zone Type](#select-the-zone-type)
1. [Enter the Domain and SOA Contact](#enter-the-domain-and-soa-contact)
1. [Pre-populate DNS Records](#pre-populate-dns-records)
1. [Create the Domain](#create-the-domain)
1. [Finish the Setup](#finish-the-setup)

After you’ve figured out how to create domains, you’ll never need to call IT support for help again. Let’s look at each step in more detail.

## Open the Create Domain Form in the Cloud Manager

Figuring out how to create a domain starts with getting into the system. Log in to the [Cloud Manager](https://cloud.linode.com/) and choose **Domains** from the left navigation menu. Click the **Create Domain** button. This opens the [Domain Create](https://cloud.linode.com/domains/create) form.

## Select the Zone Type

Select *Primary* to use Linode as the main DNS provider, allowing you to add and edit DNS records directly on Linode. Alternatively, select *Secondary* if you want Linode to serve as a secondary DNS provider and obtain DNS records from a third-party service.

- **Primary:** *This is the most common option.* Linode serves as the primary DNS provider. This enables you to manage all of your DNS records for the domain directly on the Linode platform. This option supports *outgoing* AXFR zone transfers so that other services can serve as secondary DNS providers. See [Outgoing DNS Zone Transfers](/docs/products/networking/dns-manager/guides/outgoing-dns-zone-transfers/).
- **Secondary**: Linode serves as the secondary DNS provider. All DNS records are managed through a third party DNS provider and are imported to Linode through AXFR zone transfers. See [Incoming DNS Zone Transfers > Operate as a Secondary Read-Only DNS Service](/docs/products/networking/dns-manager/guides/incoming-dns-zone-transfers/#operate-as-a-secondary-read-only-dns-service).

## Enter the Domain and SOA Contact

Enter the domain name you wish to use into the **Domain** field. This is typically the bare domain (such as *example.com*) but could also include a subdomain (such as *web.example.com*). Make sure the domain name has been registered (purchased) from your preferred registrar.

Within the **SOA Email Address** field, enter the email address for the domain administrator. Ideally the SOA email should not be on the domain it's administering, as it should be accessible if there are any issues with the domain or the infrastructure hosting the domain.

## Pre-populate DNS Records

The **Insert Default Records** dropdown field allows you to pre-populate DNS records with the IP addresses corresponding to one of your Compute Instances or NodeBalancers. If you already know the Compute Instance or NodeBalancer you'd like to use with your domain, this adds the basic DNS records (A, AAAA, and MX) for that service automatically.

- **Do not insert default records for me.** No DNS records are automatically created.
- **Insert default records from one of my Lindoes.** Select one of your Compute Instances and DNS records are automatically created using the IPv4 and IPv6 addresses for that instance.
- **Insert default records from one of my NodeBalancers.** Select one of your NodeBalancers and DNS records are automatically created using the IPv4 and IPv6 addresses for that service.

## Create the Domain

Once you've made your selections, click the **Create Domain** button to add your domain to DNS Manager. The domain zone is created within seconds and is automatically set to an *Active* status. And that's how to create a domain in Cloud Manager. But, you are not done yet.

## Finish the Setup

After adding a new domain, there are a few additional steps required to complete the process:
- **Add DNS Records.** After the domain has been created, you can immediately start adding and editing DNS records for it. If you are migrating to Linode from an existing DNS provider, make sure you have added all of the necessary DNS records to your domain *before* adding Linode's name servers to your domain (on your registrar). See [Manage DNS Records](/docs/products/networking/dns-manager/guides/manage-dns-records/).

- **Add Linode's Name Servers.** To use Linode as the authoritative name servers for your domain, you need to change the name servers on your registrar. Note that the process for this varies for each registrar.

    - [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/): Look for the *Custom DNS* option.
    - [GoDaddy](https://www.godaddy.com/help/change-nameservers-for-my-domains-664): Select *Enter my own name servers (advanced)*.
    - [Hover](https://help.hover.com/hc/en-us/articles/217282477--Changing-your-domain-nameservers): Find the *Edit* option for your name servers.

    And that’s it. Now you know how to add a domain in Cloud Manager!
