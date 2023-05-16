---
title: Cancel Managed Services
description: "Learn how to cancel Managed Services on your account."
published: 2023-04-11
authors: ["Linode"]
---

If you no longer need Linode's Managed Services offering, you can cancel it by [contacting the Support team](https://www.linode.com/support/). This removes all service monitors and any other data (such as saved credentials and contacts) that is stored as part of Managed Services. In addition to this, the following services are also affected:

- **Backup Service:** By default, the Backup service for each Compute Instance remains active. This means that all of your backups are retained and that you will be billed for this service going forward. If desired, you can make a note in your request to cancel Managed Services that you also wish to remove all Backup services. Otherwise, you can remove backups for individual Compute Instances by following the [Cancel Backups](/docs/products/storage/backups/guides/cancel/) guide.

- **Longview Pro:** If any Longview Pro clients have been configured, the Longview Pro service remains on your account as a paid service. Your Longview clients will continue to work as expected. If desired, you can make a note in your request to cancel Managed Services that you also wish to cancel Longview Pro. If you do so, your Longview clients will be migrated to the free plan (which supports up to 10 clients). See [Longview Pricing and Plans](/docs/guides/linode-longview-pricing-and-plans/).

- **cPanel:** When the service is cancelled, any cPanel licenses acquired through Managed Services are also revoked. If you still wish to use cPanel, you can purchase licenses directly through the [cPanel website](https://cpanel.net/pricing/).

{{< note >}}
There is not currently a self-service option for cancelling Managed Services in the Cloud Manager, Linode CLI, or Linode API. You will need to contact the Support team to do so.
{{< /note >}}