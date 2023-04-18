---
description: "Automate common security tasks on a Linode Compute Instance by using the Secure Your Server Marketplace App."
keywords: ['security']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2023-01-24
title: "Secure Your Server through the Linode Marketplace"
authors: ["Linode"]
---

This Marketplace App automatically configures a new Compute Instance with a limited user account and other best practices discussed in the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide. In addition to creating a limited user with sudo access, the app updates the system, optionally configures a domain in the DNS Manager, and optionally configures a Block Storage Volume. It also configures a basic firewall through [UFW](/docs/guides/configure-firewall-with-ufw/) and enables [Fail2Ban](/docs/guides/using-fail2ban-to-secure-your-server-a-tutorial/).

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** The Secure Your Server tasks should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS, Debian 10, Debian 11
- **Recommended plan:** All plan types and sizes can be used.

### Secure Your Server Options

#### Limited User (Required)

Fill out the following fields to automatically create a limited user for your new Compute Instance. This account will be assigned to the *sudo* group, which provides elevated permission when running commands with the `sudo` prefix.

- **Limited sudo user:** Enter your preferred username for the limited user.
- **Password for the limited user:** Enter a *strong* password for the new user.
- **SSH public key for the limited user:** If you wish to login as the limited user through public key authentication (without entering a password), enter your public key here. See [Creating an SSH Key Pair and Configuring Public Key Authentication on a Server](/docs/guides/use-public-key-authentication-with-ssh/) for instructions on generating a key pair.
- **Disable root access over SSH:** To block the root user from logging in over SSH, select *Yes* (recommended). You can still switch to the root user once logged in and you can also log in as root through [Lish](/docs/products/compute/compute-instances/guides/lish/).

{{< content "marketplace-custom-domain-fields-shortguide">}}

- **Email address:** The start of authority (SOA) email address for this server. This is a required field if you want the installer to create DNS records.
- **Send email from domain:** If you'd like to be able to send email from the custom domain you optionally configured, select **Yes**. This configures the related DNS records, allows traffic through relevant ports within the internal firewall, and sets the rDNS. It does not configure any email software or guarantee email deliverability.

    {{< content "email-warning-shortguide" >}}

{{< content "marketplace-special-character-limitations-shortguide">}}

#### Block Storage (Optional)

You can optionally specify an existing Block Storage Volume or create a new Block Storage Volume. This attaches and mounts the Volume to the Compute Instance so you can start using it right away.

- **Block Storage Volume label:** Enter a label for an existing Block Storage Volume you'd like to use.
- **Block Storage Volume size (in GB):** If you wish to create a new Block Storage Volume, enter the size in GB. This creates a billable resource. See [Block Storage pricing](/docs/products/storage/block-storage/#plans-and-pricing).

{{< note >}}
For more information on what Block Storage is and how to get started using it, review the [Block Storage product documentation](/docs/products/storage/block-storage/).
{{< /note >}}

{{< content "marketplace-update-note-shortguide">}}