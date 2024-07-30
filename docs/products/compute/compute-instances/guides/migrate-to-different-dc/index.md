---
title: Migrate to a New Data Center
description: "Learn how to migrate a Compute Instance across data centers using Cloud Manager."
keywords: ["choose", "help", "migration", "data center"]
tags: ["linode platform","cloud manager"]
modified: 2024-05-09
modified_by:
  name: Linode
published: 2019-02-04
aliases: ['/platform/disk-images/how-to-initiate-a-cross-data-center-migration-for-your-linode/','/platform/migrating-to-a-different-data-center/','/guides/how-to-initiate-a-cross-data-center-migration-for-your-linode/']
---

When you create a Compute Instance, it's stored on a specific data center you select. If you need to change this, you can initiate a cross-data-center migration, to move it to another data center.

{{< note >}}
Review the [Choosing a Data Center](/docs/products/platform/get-started/guides/choose-a-data-center/) guide to learn how to choose and speed test a data center.
{{< /note >}}

## Before You Begin

Various changes applied by the migration can impact your instance's configuration and the devices connected to it. They can all be seen in a caution message before proceeding with your migration within Cloud Manager. Here are some changes you should be aware of:

- **IP addresses are not transferrable** They aren't migrated to the new data center with your Compute Instance. Akamai issues a new IPv4 and IPv6 address for your instance, and you can access them once the migration completes. When your instance enters the migration queue, new IP addresses are reserved and you can see them in your instance's **Networking** detail page. See the [Find Your Linode's IP Address](/docs/guides/find-your-linodes-ip-address/) guide to learn how to access Networking information in Cloud Manager.

- **DNS records need to be updated**. You need to update DNS records with the new IP address once migrated. If you're hosting your DNS with us, this can be done through the [DNS Manager](/docs/products/networking/dns-manager/), while [rDNS](/docs/products/compute/compute-instances/guides/configure-rdns/) can be configured directly on each Compute Instance's Networking detail page.

    {{< note >}}
    If any DNS records are in use, the software using them won't be able to connect during or after the migration. After the migration, you need to make the necessary changes to the DNS, and they need to propagate.
    {{< /note >}}

- **Existing Backups can't be migrated**. Any [Linode Backup Service](/docs/products/storage/backups/) backup you have scheduled during the migration is skipped. Once the migration completes, Cloud Manager restarts your backup service on its normal schedule.

- **Block Storage volumes can't be migrated to other data centers**. If you have a Block Storage volume attached to your Compute Instance, the migration detaches it as it begins. See our [Transfer Block Storage Data between Data Centers](/docs/products/storage/block-storage/guides/transfer-volume-data-between-data-centers/) guide to learn how to transfer a Block Storage volume's data between data centers.

- **Services need to be supported in the target data center**. If the Compute Instance is using IPv6 pools, VLANs, or other features that have not yet been deployed to all data centers, the destination data center needs to support these features, too. Any non-supported service is stripped from the migrated Compute Instance.

- **There is downtime during the migration**. Data transfer requires some time. This downtime varies, based on your total disk size and the speeds expected between each data center. Before the migration, Cloud Manager displays a calculated estimate for this downtime in the "Caution" message.

- **Pricing can vary between data centers**. In some newer data centers, services and network transfer are billed at separate rates due to higher region-based infrastructure costs. Before you migrate from one region to another, confirm any applicable price differences. See our [Pricing](https://www.linode.com/pricing/) page for a list of pricing and plan options.

- **Migration removes a compute instance from a placement group**. A [placement group](/docs/products/compute/compute-instances/guides/placement-groups/) needs to exist in a specific data center, and its member compute instances need to be in that *same data center*. If the target data center supports them, you can select to create a new placement group during the migration set up.

## Migrate to a New Data Center

1. Log in to [Cloud Manager](https://cloud.linode.com) and click on the **Linodes** link in the sidebar.

1. Locate the Compute Instance within the **Linodes** table, click the corresponding **More Options** ellipsis menu, and select *Migrate* to open the **Migrate Linode** form.

    ![How to initiate a cross data center migration.](linode-list-migrate-action.png "How to initiate a cross data center migration.")

    This same menu also appears within each individual Compute Instance's dashboard page.

3. In **Migrate Linode** form, review the details of the migration and check the **Accept** box to agree to these conditions and expectations.

1. Under **Configure Migration**, select the destination **Region** for the migration.

1. Click **Enter Migration Queue**. You can monitor the progress of your migration from the list of Compute Instances and the Compute Instance's dashboard. Cloud Manager returns your instance to its previous state (powered on or off) once the migration completes.