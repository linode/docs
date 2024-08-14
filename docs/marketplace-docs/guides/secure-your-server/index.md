---
title: "Secure Your Server through the Linode Marketplace"
description: "Automate common security tasks on a Linode Compute Instance by using the Secure Your Server Marketplace App."
published: 2023-01-24
keywords: ['security']
tags: ["marketplace", "linode platform", "cloud manager"]
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

This Marketplace App automatically configures a new Compute Instance with a limited user account and other best practices discussed in the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide. In addition to creating a limited user with sudo access, the app updates the system, optionally configures a domain in the DNS Manager, and optionally configures a Block Storage Volume. It also configures a basic firewall through [UFW](/docs/guides/configure-firewall-with-ufw/) and enables [Fail2Ban](/docs/guides/using-fail2ban-to-secure-your-server-a-tutorial/).

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** The Secure Your Server tasks should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS, Debian 10, Debian 11
- **Recommended plan:** All plan types and sizes can be used.

### Secure Your Server Options

{{% content "marketplace-required-limited-user-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

- **Email address:** The start of authority (SOA) email address for this server. This is a required field if you want the installer to create DNS records.

{{% content "marketplace-special-character-limitations-shortguide" %}}

#### Block Storage (Optional)

You can optionally specify an existing Block Storage Volume or create a new Block Storage Volume. This attaches and mounts the Volume to the Compute Instance so you can start using it right away.

- **Block Storage Volume label:** Enter a label for an existing Block Storage Volume you'd like to use.
- **Block Storage Volume size (in GB):** If you wish to create a new Block Storage Volume, enter the size in GB. This creates a billable resource. See [Block Storage pricing](/docs/products/storage/block-storage/#plans-and-pricing).

{{< note >}}
For more information on what Block Storage is and how to get started using it, review the [Block Storage product documentation](/docs/products/storage/block-storage/).
{{< /note >}}

{{% content "marketplace-update-note-shortguide" %}}