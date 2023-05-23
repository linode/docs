---
description: 'Configurations for common DNS records.'
og_description: 'This guide provides you with step-by-step instructions for using the Linode Cloud Manager to configure DNS records such as A, AAA, MX, and other DNS records.'
keywords: ["dns", "dnssec"]
tags: ["dns","networking","cloud manager","linode platform"]
aliases: ['/networking/dns/common-dns-configurations/','/dns-guides/configuring-dns-with-the-linode-manager/','/networking/dns/common-dns-configurations-classic-manager/','/guides/common-dns-configurations/']
modified: 2019-03-14
modified_by:
  name: Linode
published: 2015-01-20
title: Common DNS Configurations
authors: ["Linode"]
---

{{< youtube Vb1JsfZlFLE >}}

## Set Up a Domain

The most common DNS configuration is a single domain name on a single Linode. For this, you'll need to add *SOA* and *NS records* for all of your name servers, and *A/AAAA* records for your domain names. Use the screenshot below as a guide.

![The SOA record is set to "example-site-demo.com". The NS records are set to "ns1.linode.com" through "ns5.linode.com", inclusive. The MX record is set to "mail.example-site-demo.com". There are A records for [blank], which is the primary domain, and the "mail" and "www" subdomains. They are all set to the same IP.](common-dns-set-up-a-domain.png)

 {{< note >}}
The Domains section of the Cloud Manager can automatically add all of these records when you create a domain. For instructions, see the *Add a Domain* section of the [DNS Manager](/docs/products/networking/dns-manager/) guide.
{{< /note >}}

## Configure Subdomains

1.  To configure a subdomain (e.g. `staging.example-site-demo.com`), create an A record with the subdomain's hostname. Click **Add an A/AAAA Record**:

    ![Create a new A record by first click on "Add an A/AAAA Record"](common-dns-add-an-a-record.png)

1.  Add the subdomain under the **Hostname** field. Assign the IP address of the server you want to host the subdomain:

    ![Create a new A record, following the instructions in the "Adding" section. Add the subdomain text to the "Hostname" field. For example, you could type "staging" - NOT "staging.example-site-demo.com".](common-dns-add-an-a-record-menu.png)

1. Click on the **Save** button to create the record.

    {{< note title="Multi-level Subdomains" >}}
    The Linode Cloud Manager does not support adding a subdomain of a subdomain in the same domain zone. For example, if you have `example.com` as a domain with an A record for `staging.example.com`, you cannot create `test.staging.example.com` within that same domain zone. Instead, create a separate domain zone for the subdomain `staging.example.com`. Then, add an A record for `test.staging.example.com` to that new zone.

    See the [subdomains](/docs/products/networking/dns-manager/guides/manage-dns-records/#second-level-subdomains) section of the [DNS manager](/docs/products/networking/dns-manager/) guide for more information.
    {{< /note >}}

## Host Multiple Domains on a Single Server

To host multiple domain names on a single server, create a separate domain entry for each domain name as shown below. When creating the new domain entry, we recommend that you allow the Domains section of the Cloud Manager to automatically [insert basic records](/docs/products/networking/dns-manager/#add-a-domain-zone). At a minimum, you'll need an A record for each domain name pointing to the server's IP address.

![This page shows the Domains page with three different domain zones listed.](common-dns-multiple-domains-one-server.png)

## Use One Domain on Multiple Servers

If you have more than one server, but only one domain name, you can point A records with server-specific hostnames to all servers that need domain names. One machine will be the "front end" for the domain, by virtue of the first-level domain's A record pointing to it, but the domain can serve as a proxy for services provided by other machines, if needed. For example, if you wanted to create a development environment on another server, you could create an A record for `staging.example.com` and point it at another Linode's IP address.

## Route Email to Third-Party Mail Services

To route email to a third-party email service, create MX records that associate your mail server (for example, `mail.example-site-demo.com`) with a *hostname* provided by the third-party service. For more detailed instructions, see the website of your third-party email service.

## Use Wildcard DNS Records

A *wildcard* DNS record matches requests for non-existent domain names. For example, if you create an A record for `*.example.com`, and a user visits `nonexistantname.example.com`, that user will be redirected to `example.com`. An example wildcard DNS record is shown below.

![Create a new A record, following the instructions in the "Adding" section. Add a single asterisk (\*) in the "Hostname" field. Set your IP address in the "IP Address" field. Then click the "Save Changes" button.](common-dns-use-wildcard.png)
