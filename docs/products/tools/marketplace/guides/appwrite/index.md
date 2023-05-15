---
description: "Deploy Appwrite, an open-source Firebase alternative for Web, Mobile & Flutter Developers, on a Linode Compute Instance."
keywords: ['Appwrite','Firebase','backend', 'low-code']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2023-05-30
modified_by:
  name: Linode
title: "Deploy Appwrite through the Linode Marketplace"
authors: ["Linode"]
---

[Appwrite](https://appwrite.io/) is an open-source, self-hosted backend server that provides developers with a set of tools and services to build and manage web and mobile applications. It offers various features to simplify the development process, including user authentication, database management, file storage, and more.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Appwrite should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended plan:** We recommend a 4GB Dedicated CPU or Shared Compute instance for Appwrite.

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

### Accessing the Appwrite Web UI

1. Open your web browser and navigate to `https://[ip-address]`, where *[ip-address]* is your Compute Instance's IPv4 address. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses.

1. You will then be asked to sign into your Appwrite account, or create a new account if you have not signed up already.

Now that you’ve accessed your Appwrite instance, check out [the official Appwrite documentation](https://appwrite.io/docs) to learn how to further utilize your instance.

{{< content "marketplace-update-note-shortguide">}}