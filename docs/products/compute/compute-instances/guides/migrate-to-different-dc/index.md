---
description: "Learn how to migrate a Compute Instance across data centers using the Cloud Manager."
keywords: ["choose", "help", "migration", "data center"]
tags: ["linode platform","cloud manager"]
title: Initiate a Cross Data Center Migration for a Compute Instance
modified: 2023-01-18
modified_by:
  name: Linode
published: 2019-02-04
aliases: ['/platform/disk-images/how-to-initiate-a-cross-data-center-migration-for-your-linode/','/platform/migrating-to-a-different-data-center/','/guides/how-to-initiate-a-cross-data-center-migration-for-your-linode/']
authors: ["Linode"]
---

When a Compute Instance is created, it is stored on whichever data center was selected during the creation process. If you wish to change this data center, you can initiate a cross data center migration at any time. This moves your Compute Instance to whichever data center you wish.

{{< note >}}
Review the [Choosing a Data Center](/docs/products/platform/get-started/guides/choose-a-data-center/) guide to learn how to choose and speed test a data center.
{{< /note >}}

## In this Guide:

This guide will cover the following topics:

- [Important details to know before initiating a cross data center migration](#things-to-know-before-migrating).
- [How to migrate your Compute Instance to a different data center](#migrating-to-a-new-data-center).

## Things to Know Before Migrating

Migrating your Compute Instance to a new data center will result in a number of changes that may impact your instance's configuration and external devices connected to it. All of these changes can be seen in a caution message before proceeding with your migration within the Cloud Manager. Changes to be aware of are as follows:

- IP addresses are not transferrable across data centers and they will not be migrated with your Compute Instance. Your instance will be issued a new IPv4 and IPv6 address, which will be accessible once the migration completes. When your instance enters the migration queue, new IP addresses are reserved and can be viewed on your instance's **Networking** detail page. See the [Find Your Linode's IP Address](/docs/guides/find-your-linodes-ip-address/) guide to learn how to access Networking information in the Cloud Manager.

- Any DNS records that point to the original IP address should be changed to use the new IP address once migrated. If you're hosting your DNS with us, this can be done through the [DNS Manager](/docs/products/networking/dns-manager/), while [rDNS](/docs/products/compute/compute-instances/guides/configure-rdns/) can be configured directly on each Compute Instance's Networking detail page.

    {{< note >}}
    If any of these DNS records are in use, the software using them will not be able to connect after the migration is completed *until* the DNS records have been upgraded and the changes have propagated.
    {{< /note >}}

- Any existing Backups created through our [Linode Backup Service](/docs/products/storage/backups/) will not be migrated. Once the Compute Instance's migration has completed, your backup service will restart on its normal schedule.

- Block Storage volumes cannot be migrated to other regions. If you have a Block Storage volume attached to your Compute Instance, it will be detached when the migration begins. See our [Transfer Block Storage Data between Data Centers](/docs/products/storage/block-storage/guides/transfer-volume-data-between-data-centers/) guide to learn how to transfer a Block Storage volume's data between data centers.

- If the Compute Instance is using IPv6 pools, VLANs, or other features that have not yet been deployed to all data centers, the destination data center must also support these features.

- Migrations will include a period of downtime while your data is transferred. This estimate varies depending on your total disk size and the speeds expected between each data center. A calculated estimate will be displayed within the "Caution" message displayed before moving forward with your migration.

## Migrating to a New Data Center

1. Log in to the [Cloud Manager](https://www.cloud.linode.com) and click on the **Linodes** link in the sidebar.

1. Locate the Compute Instance within the **Linodes** table, click the corresponding **More Options** ellipsis menu, and select *Migrate* to open the **Migrate Linode** form.

    ![How to initiate a cross data center migration.](linode-list-migrate-action.png "How to initiate a cross data center migration.")

    This same menu also appears within each individual Compute Instance's dashboard page.

1. In **Migrate Linode** form, review the details of the migration and check the **Accept** box to agree to these conditions and expectations.

1. Under **Configure Migration**, select the destination region. This will be the data center that the Compute Instance is migrated to.

1. Click on the **Enter Migration Queue** button, which closes the form and enters the Compute Instance into the migration queue. You can monitor the progress of your migration from both within the list of Compute Instances and the Compute Instance's dashboard. Your instance will return to its previous state (powered on or off) once the migration has completed.