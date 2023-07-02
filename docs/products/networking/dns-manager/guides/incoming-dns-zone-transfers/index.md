---
description: "Learn how to import DNS records from external DNS providers by using AXFR transfers"
published: 2022-10-28
modified: 2022-11-08
modified_by:
  name: Linode
title: "Incoming DNS Zone Transfers"
keywords: ["dns"]
tags: ["linode platform","cloud manager"]
authors: ["Linode"]
---

Linode supports importing DNS records from external DNS providers in one of two ways:

- [**Import a DNS zone**](#import-a-dns-zone): Initiate a one-time transfer from an external DNS service. *This allows you to migrate to Linode and manage your DNS records from the DNS Manager.*
- [**Operate as a *secondary* read-only DNS service**](#operate-as-a-secondary-read-only-dns-service): Get notified of (or periodically check for) DNS changes from an external DNS service and automatically update the zone file with those changes. *This allows you to manage your DNS records in an external DNS service but take advantage of Linode's reliable and geographically distributed DNS platform.*

## Before You Begin

As part of DNS zone transfers, Linode sends an AXFR query to whichever external name server you specify. That external name server must then send back an AXFR response, which includes a copy of the DNS zone file data.

**Before continuing, verify that your current external DNS provider offers the ability to perform outgoing DNS zone transfers through AXFR.** If they do, add the IP addresses for Linode's AXFR servers to the ACL or allow-list of that DNS provider. These IP addresses vary depending on if you're importing a zone or operating as a secondary and are listed in their corresponding section below.

{{< note >}}
AXFR functionality is typically available on enterprise-level plans. If your DNS provider does not support AXFR, DNS zone transfers will not work. If you still wish to use Linode's name servers, you can instead manually create the DNS zone and update it as needed. See [Create a Domain](/docs/products/networking/dns-manager/guides/create-domain/).
{{< /note >}}

## Import a DNS Zone

This section walks you through the first option, importing a DNS zone. This method gathers all of the DNS records from an external DNS service, creates a new domain zone within the DNS Manager, and imports each record into new zone.

1. Within your external name server, allow AXFR transfers to the following Linode IP addresses:

    ```
    96.126.114.97
    96.126.114.98
    2600:3c00::5e
    2600:3c00::5f
    ```

1. Log in to the [Cloud Manager](https://cloud.linode.com/) and select **Domains** from the left navigation menu. Click the **Import a Zone** button.

1. In the **Domain** field, enter the domain name you wish to import.

1. Enter your DNS provider's name server into the **Remote Nameserver** field. This name server needs to allow AXFR queries from the IP addresses listed in a previous step.

1.  Click the **Import** button. The DNS Manager connects to the remote name server and imports your existing DNS records. If there is an issue connecting to the name server, you may see an error stating that the request was refused. If this is the case, you may want to contact your external DNS provider and verify their domain transfer process.

1. Once the DNS records have been imported, update the authoritative name servers on your domain's registrar. Remove your current provider's name servers and add Linode's own name servers (ns1.linode.com through ns5.linode.com).

## Operate as a Secondary Read-Only DNS Service

Using Linode's DNS Manager as a *secondary* DNS service allows you to manage your DNS records elsewhere but still take advantage of Linode's reliable and distributed platform. Chose this option if your existing DNS provider:

- does not offer secondary name server,
- is not equipped to handle large amounts of DNS traffic,
- or does not implement any high availability features.

As part of this, a common reason for using Linode's DNS Manager as a secondary DNS provider is if your primary name server is self-hosted. This is true for users of cPanel, Plesk, and other web-hosting panels. It is also true for power-users that prefer to run their own dedicated DNS software, such as BIND, and manually update their DNS zone files. In these cases, you may value the control or automation from your current solution, but you desire more reliability and availability.

1. Within your primary name server, allow AXFR transfer from the following Linode IP addresses. You should also make sure your name server sends NOTIFY requests to these IP addresses, which serves to notify Linode of any DNS changes so an AXFR zone transfer is triggered.

    ```
    104.237.137.10
    45.79.109.10 (was 65.19.178.10)
    74.207.225.10
    207.192.70.10
    109.74.194.10
    2600:3c00::a
    2600:3c01::a
    2600:3c02::a
    2600:3c03::a
    2a01:7e00::a
    ```

    {{< note type="alert" >}}
    On February 7th, 2023, the IP address `65.19.178.10` will be retired and replaced with `45.79.109.10`. Both IPs will respond to inbound requests until the cutover date. Outbound requests will only originate from the old IP address (`65.19.178.10`) until the cutover date. Please update your firewall rules and DNS server configurations to add the new IP address (`45.79.109.10`) prior to the cutover.
    {{< /note >}}

1. Log in to the [Cloud Manager](https://cloud.linode.com/) and select **Domains** from the left navigation menu. Click the **Create Domain** button.

1. Select **Secondary** as the zone type. This changes some of the form options below it.

1. Enter the domain name you wish to use into the **Domain** field.

1. Add the IP Address of your external DNS provider's name server. If they have more than one name server, click **Add an IP** to add each additional one if desired.

1. Click the **Create Domain** button to create the domain zone and start the transfer.

1. Once the DNS zone transfer is finished, update the authoritative name servers on your domain's registrar to use some or all of Linode's name servers (ns1.linode.com through ns5.linode.com). If desired, add them alongside your current DNS provider's name servers (so Linode operates as one of many name servers) or you can delete their name servers (so Linode the only authoritative name server).

Linode checks for DNS changes when the refresh time elapses for the domain *or* when it receives a NOTIFY request from one of the designated external name servers.