---
title: "Secure Your Server through the Linode Marketplace"
description: "Automate common security tasks on a Linode Compute Instance by using the Secure Your Server Marketplace App."
published: 2023-01-24
modified: 2024-08-06
keywords: ['security']
tags: ["marketplace", "linode platform", "cloud manager"]
---

This Marketplace App automatically configures a new Compute Instance with a limited user account and other best practices discussed in the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide. It also configures a basic firewall through [UFW](/docs/guides/configure-firewall-with-ufw/) and enables [Fail2Ban](/docs/guides/using-fail2ban-to-secure-your-server-a-tutorial/).

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** The Secure Your Server tasks should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Suggested plan:** All plan types and sizes can be used.

### Secure Your Server Options

{{% content "marketplace-required-limited-user-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

- **Email address:** The start of authority (SOA) email address for the optional DNS records. This value is required to create new DNS Records in the deployment.

{{% content "marketplace-special-character-limitations-shortguide" %}}

{{% content "marketplace-update-note-shortguide" %}}