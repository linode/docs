---
description: "Learn how to create MX records using Linode's DNS Manager"
published: 2022-10-28
modified_by:
  name: Linode
title: "MX Records"
keywords: ["dns"]
tags: ["linode platform"]
authors: ["Linode"]
---

## MX Overview

An **MX** (*mail exchanger*) record sets the mail delivery destination for a domain or subdomain. This tells others what server is operating as the mail  server so emails are routed to that destination. If MX records are configured incorrectly, emails might not be delivered to the intended users.

## Properties

- **Mail Server:** The root domain or subdomain where email should be routed. There should be a corresponding A record for this domain that stores the IP address of the mail server. This value should ideally point to a domain that is also the designated [hostname](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-custom-hostname) for the mail server.

    {{< note >}}
    The mail server does not need to be hosted on a Compute Instance. You can also use a domain for a third-party email provider, like Gmail (through Google Workspace), Outlook (through Office 365), or ProtonMail (on plans that support custom domains).
    {{< /note >}}

- **Preference** (also called *priority*): A number representing the priority of the mail server, with lower numbers having higher priority. This value matters when you have more than one MX record for the same subdomain.

- **Subdomain:** The domain that you wish to use for your email addresses.

    - For email addresses on the root domain (*user@example.com*), leave the field blank.
    - For email addresses on a subdomain (*user@subdomain.example.com*), enter a string that's 1-63 characters in length and contains only letters, numbers, and underscores. Hyphens can also be used, but the string cannot start with one.

- **TTL** (*Time To Live*): The length of time that DNS resolvers should store the DNS record *before* revalidating it with Linode's name servers. Setting the TTL to **5 minutes** is recommended for many use cases. If **Default** is selected, the TTL is set to **24 hours**.

## Null MX Record

If you do not intend to accept any email through your domain, you can add a **Null MX** record, which is simply a specially formatted MX record. This is preferable to not adding any MX records, which causes the sender to still perform email delivery attempts on any A or AAAA records for that domain. A Null MX record tells the sending mail server to stop all delivery attempts, freeing up resources and allowing the sender to resolve any issues with the email address faster.

The instructions for creating a Null MX record vary by DNS provider. For Linode's DNS Manager, the *Subdomain* (name) field should be blank, the *Preference* (priority) field should be 0, and the *Mail Server* field should be blank. This prevents you from creating any other MX records for the domain.
