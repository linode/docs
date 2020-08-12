---
author:
  name: Linode
  email: docs@linode.com
description: 'The Domains section of the Linode Cloud Manager is a comprehensive DNS management interface that allows you to add DNS records for all of your domain names. This guide covers the use of the Domains section and basic domain setup.'
og_description: 'The Domains section of the Linode Cloud Manager is a comprehensive DNS management interface that allows you to add DNS records for all of your domain names. This guide covers the use of the Domains section and basic domain setup.'
keywords: ["dns manager", "linode dns", "Linode Cloud Manager dns", "dns configuration", "ttl", "domain zones", "domain name"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['networking/dns/dns-manager/','platform/manager/dns-manager-classic-manager/','dns-manager/','networking/dns/dns-manager-overview/','platform/manager/dns-manager-new-manager/']
modified: 2018-08-24
modified_by:
  name: Linode
published: 2009-07-16
title: DNS Manager
---

![DNS Manager](dns-manager.png "DNS Manager")

<!-- ![DNS Manager Overview](dns-manager-overview.png) -->

The *Domains* section of the [Linode Cloud Manager](https://cloud.linode.com/domains) is a comprehensive DNS management interface that allows you to add DNS records for all of your domain names. This guide covers the use of the **Domains** section and basic domain setup. For an introduction to DNS in general, see our [Introduction to DNS Records](/docs/networking/dns/dns-records-an-introduction/) guide.

{{< note >}}
Linode's DNS service employs [Cloudflare](https://cloudflare.com) to provide denial of service (DDoS) mitigation, load balancing, and increased geographic distribution for our [name servers](/docs/networking/dns/dns-records-an-introduction/#name-servers). These factors make our service reliable, fast, and a great choice for your DNS needs.
{{</ note>}}

{{< note >}}
To use the Linode DNS Manager to serve your domains, you must have an active Linode on your account. If you remove all active Linodes, your domains will no longer be served.
{{</ note >}}

## Getting Started

The Domain Name System (DNS) attaches human-readable domain names to machine-usable IP addresses. In many ways, it is the phone book of the Internet. Just like a phone book can help you find the phone number of a business, DNS can take a domain name like `google.com` and translate it into an IP address like `74.125.19.147`. This global system allows users to remember the names of websites instead of their numeric IP addresses.

{{< note >}}
All steps in this guide are completed within the **[Domains](https://cloud.linode.com/domains)** section of the [Linode Cloud Manager](https://cloud.linode.com/).
{{< /note >}}

## DNS Set-Up Checklist

DNS records are only actively hosted on accounts with at least one Linode. When setting up a domain name on your Linode, make sure you perform the following steps:

1.  Register (purchase) a domain name if you haven't already.
2.  Set your domain name to [use Linode's name servers](#use-linode-s-name-servers-with-your-domain). You'll need to do this on your domain registrar's website and then wait up to 24 hours for the change to take effect.
3.  Use the DNS Manager to [add a domain](#add-a-domain), and then start [adding some basic DNS records](#add-dns-records).
4.  [Set reverse DNS](/docs/networking/dns/configure-your-linode-for-reverse-dns/).
5.  If you have any special DNS requirements, such as when using a third-party email server, add additional DNS records [for your specific needs](/docs/networking/dns/common-dns-configurations/).

## Use Linode's Name Servers with Your Domain

After you purchase a domain, log in to your domain registrar's control panel and set the name servers for your domain name to the entries below. See the instructions on your domain name registrar's website for more information.

-   `ns1.linode.com`
-   `ns2.linode.com`
-   `ns3.linode.com`
-   `ns4.linode.com`
-   `ns5.linode.com`

 {{< note >}}
DNS changes can take up to 24 hours to propagate throughout the internet, although the changes are usually visible within several hours.
{{< /note >}}

## Create and Manage Domains

The Linode DNS Manager allows you to create and manage domains. The DNS manager can be accessed from the **Domains** section of the Linode Cloud Manager. To find this area, log in to your [Cloud Manager](https://cloud.linode.com/) account and click the **Domains** link in the sidebar.

![The DNS Manger](access-domains-section.png "The DNS Manager")

### DNS Manager Options Overview

The section below provides a detailed description of the available options within the **Domains** section of the Linode Cloud Manager:

![The DNS Manger](domains-overview.png "The DNS Manager")

1.  All of your domains are listed under the **Domains** heading. To access your Domain's DNS records, click the name of a Domain.

    Click the name of a domain to add or edit its DNS records. When you add a domain, the Cloud Manager will automatically create a zone file for your Domain.  Before you can add any DNS records, you must [add a domain](#add-a-domain).

    {{< note >}}
A *domain zone* is a collection of DNS records for a single domain name. **Creating a domain also creates its corresponding domain zone.** [Linode's APIv4](https://developers.linode.com/api/v4/), which is the backbone of the Cloud Manager, will validate the created zone file for any errors.

The term *domain zone* becomes synonymous with the term *domain*, both in terms of use and administration.
{{< /note >}}

1.  If you have a zone that can be exported from a server or another hosting provider, click **Import a Zone** to import it.

1.  Click **Add a Domain** to create a new domain zone.

1.  Click on the **more options ellipsis** to corresponding to a domain zone to edit DNS records within a zone, clone an existing zone, or remove a zone.

### Add a Domain

If you're new to Linode, or if you've just purchased a new domain name, the first step is to add a new domain in the **Domains** section of the Cloud Manager. If you don't know what DNS records to add, the DNS Manager can insert some basic records when you create the new domain.

{{< note >}}
Creating a domain also creates its corresponding domain zone.
{{</ note >}}

1.  From the **Domains** section, click on **Add a Domain**. The **Add a New Domain** panel will appear where you can fill out the form fields with your domain's information.

    ![This page lets you add a new domain](add-new-domain.png "This page let's you add a new domain.")

1. If you want to add a *slave zone* instead of a master zone, click the **Slave** radio button.

    {{< note >}}
In order for Linode's DNS servers to function as slaves, your DNS master server must notify and allow AXFR requests from the following IP addresses:

    104.237.137.10
    65.19.178.10
    75.127.96.10
    207.192.70.10
    109.74.194.10
    2600:3c00::a
    2600:3c01::a
    2600:3c02::a
    2600:3c03::a
    2a01:7e00::a
{{< /note >}}

1.  Enter your domain name in the **Domain** field. An example is shown above.
1.  Enter an administrator's email address in the **SOA Email Address** field.
1.  If you are unfamiliar with DNS, the DNS Manager can automatically create some basic DNS records to get you started. To have it insert these records, select **Yes, insert a few records to get me started**, then select from the drop-down menu the Linode with which you want this domain zone associated.

    ![Create default DNS records when adding a new domain.](create-default-records.png "Create default DNS records when adding a new domain.")

     Alternatively, to keep the domain zone empty and prevent the DNS Manager from creating DNS records, select **No, I want the zone empty**.

1.  Click **Create**. If you selected the option to have the DNS Manager insert basic DNS records, those records will be visible on the Domains detail page. The created records should include SOA, NS, MX, and A/AAA.

    If you elected to keep the zone empty, you can start adding DNS records now. The Domain detail page will contain an SOA and NS record for the domain. Skip to the [Adding DNS Records](/docs/networking/dns/dns-manager-overview/##add-dns-records) section for instructions.

<!--
1.  If you are unfamiliar with DNS, the DNS Manager can automatically create some basic DNS records to get you started. To have it insert these records, select **Yes, insert a few records to get me started**, then select from the drop-down menu the Linode with which you want this domain zone associated.

    Alternatively, to keep the domain zone empty and prevent the DNS Manager from creating DNS records, select **No, I want the zone empty**.

If you selected the option to have the DNS Manager insert basic DNS records, those records will be visible, as shown above. If you elected to keep the zone empty, you can start adding DNS records now. Skip to the [Adding DNS Records](/docs/networking/dns/dns-manager-overview/#add-records) section for instructions.

-->

### Add DNS Records

When you first create a domain, you'll need to add some DNS records. <!-- The DNS Manager can create some basic records to get you started when you create your domain zone, --> This section explains how to add your own records.

1.  Select a domain from within the **Domains** section of the Cloud Manager. The domain's detail page appears:

    ![This page has seven sections showing eight different types of records: SOA, NS, MX, and A/AAAA, CNAME, TXT, SRV, AND CAA.](domain-details-page-no-records.png)

1.  The page is divided into different sections for each type of DNS record. Locate the section for the type of DNS record you want to add, then click **Add a Record**. The example below shows how to add an A/AAAA record.

    ![This page allows you to create a new A/AAAA record.](add-dns-record-ipv4.png)

    {{< note >}}
The exact form fields will vary depending on the type of DNS record you select.
{{< /note >}}

1.  Enter a hostname in the **Hostname** field.

1.  Enter the IP address of your server in the **IP Address** field. See [this quick answer page](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/) to find your Linode's IP address.

1.  Select a time interval from the **TTL** menu. *TTL* stands for *time to live*, and affects how long DNS records are cached by DNS resolvers. When the designated time to live is reached, the resolver must query the authoritative name servers for new records.

1.  Click **Save**. It will only take a few minutes for new DNS records to become active.

### Edit DNS Records

To modify a Domain's existing DNS records:

1.  From the **Domains** section of the Cloud Manager, select the domain whose DNS records you'd like to edit. The DNS records for the selected domain zone will appear.

1.  Next to the DNS record you would like to edit, click on the **more options ellipsis**.

1.  Select **Edit** from the menu.

    [![Select 'Edit' from the menu.](domain-edit-a-record-small.png "Select 'Edit' from the menu.")](domain-edit-a-record.png)

1.  Edit the DNS record by modifying the existing values in the fields that appear.

1.  Click **Save**. It will only take a few minutes for the record to be updated.

### Subdomains

Add a subdomain by adding an entry under the *A/AAAA Record* heading, with just the subdomain. For example, for `subdomain.example.com`

1. Add `subdomain` under *Host*.

1. Set the IP address.

1. Adjust the TTL if necessary.

1. Click **Save**. It will only take a few minutes for the record to be updated.


### Wildcards

A wildcard DNS record will match requests for domains that do not exist. Wildcards are often used to point all non-existing subdomains to an existing top level domain. For example, if a queried first-level subdomain does not exist, the IP address specified in the wildcard DNS record will respond.

To create a [wildcard DNS record](https://en.wikipedia.org/wiki/Wildcard_DNS_record):

1. Navigate to the **Domains** section of the Cloud Manager and click on the Domain that you'd like to add a wildcard DNS record to.

1. Find the **A/AAAA Record** section and select **Add an A/AAAA Record**.

1. When the **Create A/AAAA Record** panel appears, enter an asterisk (`*`) in the **Hostname** field and provide a valid IP address in the **IP Address** field.

1. Click **Save**. It will only take a few minutes for the record to be updated.

{{< note >}}
A wildcard must always be the furthest subdomain from the TLD (top level domain), i.e. `*.example.com`. If you would like to add a wildcard as a subdomain for a subdomain, you will need to add a new domain zone for that subdomain and then add the wildcard record to it. For example, to create `*.subdomain.example.com`, you must add a separate domain zone for `subdomain.example.com` first, then add an A/AAAA DNS record to that zone as indicated above.
{{</ note >}}

### Sub-Subdomains

The Linode Cloud Manager does not support the addition of a subdomain on top of an existing subdomain in the same domain zone. For example, if you have `example.com` as a domain with an A record for `subdomain.example.com`, you cannot create `another.subdomain.example.com` within that same domain zone.

Instead, [add the subdomain](#add-a-domain) to the Cloud Manager as a separate domain with its own domain zone and DNS records. Then add an A/AAAA record for the second-level subdomain. In the previous example, you would create a domain zone named `subdomain.example.com`, the create an A/AAAA record with hostname `another` inside of it.

### Import Domains with AXFR

If you're migrating domains to Linode from another hosting provider and that provider allows zone transfers from its DNS server, it may be possible to import your existing domain and its DNS records into the Linode Cloud Manager. If the import is successful, the domain along with all of its existing DNS records will be available in the **Domains** section of the Cloud Manager.

Here's how to import a zone file:

1.  From the **Domains** section, click on **Import a Zone**.

    ![This page lets you import a domain zone.](domain-import-a-zone.png)

1.  Enter the domain name in the **Domain** field, as shown in the example above.

1.  Enter the name server in the **Remote Nameserver** field.

    {{< note >}}
The name server must allow zone transfers (AXFR) from the following IP addresses:

    96.126.114.97
    96.126.114.98
    2600:3c00::5e
    2600:3c00::5f
{{< /note >}}

1.  Click **Save**. The Linode Cloud Manager will connect to the remote name server and import your existing DNS records.

### Clone DNS records

The *Clone* feature allows you to copy DNS records from an existing domain in your Linode account to a new domain. If you've already set up DNS records for one of the services you host on your Linode account, this is a good way to quickly assign another domain to that same service.

Here's how to clone DNS records for an existing domain:

1.  Click on the **more options ellipsis** corresponding to the domain whose DNS records you would like to clone and select **Clone** from the menu.

1.  Enter the name of the new domain in the **New Domain** field.

    ![Clone an existing domain zone](domain-clone-a-zone.png "Clone an existing domain zone.")

1.  Click **Create**. The DNS records will then be copied from the existing domain to the domain.

### Remove Domains

If one of your domain names has expired or if you want to start hosting it on another DNS provider, you should permanently remove the domain and all of its associated DNS records.

1.  From the **Domains** section of the Cloud Manager, find the domain you would like to remove and click its **more options ellipsis**.

1.  Select **Remove** to permanently delete the domain, including all associated DNS records. It will only take a few minutes for the changes to take effect.

![This menu lets you remove a DNS zone.](domain-remove-a-zone.png "This menu lets you remove a DNS zone.")

{{< caution >}}
Once removed, you **MUST** delete the Linode nameserver entries from the domain at the registrar level. This is a very important step; if the entries are not removed, someone could use your domain without your permission.
{{< /caution >}}

### Transfer a Domain Zone

Linode's DNS servers allow Domain zone transfers to non-Linode DNS servers that you designate and trust. This feature can be used to transfer a Domain zone to another hosting provider's DNS servers. To enable this capability, you will need to alter your Domain's SOA record. This section will cover these steps.

  {{< caution >}}
Granting another server access to zone information is potentially dangerous. Do not add any IP addresses that you do not know or trust.
  {{</ caution >}}

1. From the **Domains** section of the Cloud Manager, find the domain for which you would like to enable Domain zone transfer and click on the entry to access its Domain records.

1. Viewing your Domain's records, under the **SOA Record** section, click on the **more options ellipsis** corresponding to your Domain's SOA records and select **Edit**.

    ![Edit SOA records](edit-soa-record.png "Edit your SOA records")

1. In the **Edit SOA Record** pane, find the **Domain Transfers** form field and enter in a comma separated list of IP addresses corresponding to the DNS servers you'd like to give access to your Domain's zone file.

1. When you've completed your update, click on **Save**.

    {{< note >}}
When the DNS servers no longer need access to your Domain's zone file, remove the IP address from the **Domain Transfers** field.
    {{</ note >}}

## DNSSEC Limitations

The Linode DNS Manager does not support DNSSEC at this time. If you have DNSSEC enabled at your domains registrar it will cause name resolution failures such as `NXDOMAIN` when an attempt is made to access the DNS.

## Next Steps

Now that you are familiar with Linode's DNS Manager, you should set up your [reverse DNS configuration](/docs/networking/dns/configure-your-linode-for-reverse-dns/), and consider reading through at our [Common DNS Configurations](/docs/networking/dns/common-dns-configurations/) guide. For help with DNS records, see our [Troubleshooting DNS](/docs/platform/manager/troubleshooting-dns) guide.
