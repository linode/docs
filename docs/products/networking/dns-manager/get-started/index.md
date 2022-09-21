---
title: Get Started
description: "Get started with the Linode DNS Manager. Learn to add a domain and add DNS records."
tab_group_main:
    weight: 20
---

## Add a Domain

If you're new to Linode, or if you've just purchased a new domain name, the first step is to add a new domain. Domains can be created and managed in the **Domains** section of the Cloud Manager.

{{< note >}}
Domains can't be purchased through Linode. Instead, purchase a domain through a domain name *registrar*. The domain can then be added to the Cloud Manager.
{{< /note >}}

If you don't know what DNS records to add to your new domain, the DNS Manager can insert some basic records when you create the new domain.

{{< note >}}
Creating a domain also creates its corresponding domain zone.
{{</ note >}}

1.  From the **Domains** section, click on **Create Domain**. The **Create Domain** panel appears, and this panel displays a form for your domain's information.

1. If you want to add a *secondary zone* instead of a primary zone, click the **Secondary** radio button.

   {{< note >}}
In order for Linode's DNS servers to function as secondaries, your DNS primary server must notify and allow AXFR requests from the following IP addresses:

    104.237.137.10
    65.19.178.10
    74.207.225.10
    207.192.70.10
    109.74.194.10
    2600:3c00::a
    2600:3c01::a
    2600:3c02::a
    2600:3c03::a
    2a01:7e00::a
{{< /note >}}

1.  Enter your domain name in the **Domain** field.

1.  Enter an administrator's email address in the **SOA Email Address** field.

1.  If you are unfamiliar with DNS, the DNS Manager can automatically create some basic DNS records to get you started.

      - To have it insert these records, select **Yes, insert a few records to get me started**, then select from the drop-down menu the Linode with which you want this domain zone associated.

      - Alternatively, to keep the domain zone empty and prevent the DNS Manager from creating DNS records, select **No, I want the zone empty**.

1.  Click **Create**. If you selected the option to have the DNS Manager insert basic DNS records, those records are now visible on the Domain's detail page. The created records should include SOA, NS, MX, and A/AAA.

   If you elected to keep the zone empty, you can start adding DNS records now. The Domain detail page contains an SOA and NS record for the domain. Skip to the [Adding DNS Records](/docs/networking/dns/dns-manager-overview/##add-dns-records) section for instructions.

## Add DNS Records

When you first create a domain, you also need to add some DNS records to the domain. This section explains how to add your own records.

1.  Select a domain from within the **Domains** section of the Cloud Manager. The domain's detail page appears.

1.  The page is divided into different sections for each type of DNS record. Locate the section for the type of DNS record you want to add, then click **Add a Record**.

      {{< note >}}
The exact form fields vary depending on the type of DNS record you select.
{{< /note >}}

1.  Enter a hostname in the **Hostname** field.

1.  Enter the IP address of your server in the **IP Address** field. See [this quick answer page](/docs/guides/find-your-linodes-ip-address/) to find your Linode's IP address.

1.  Select a time interval from the **TTL** menu. *TTL* stands for *time to live*, and affects how long DNS records are cached by DNS resolvers. When the designated time to live is reached, the resolver must query the authoritative name servers for new records.

1.  Click **Save**. After a few minutes, the new DNS records become active.
