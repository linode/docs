---
slug: how-to-initiate-a-cross-data-center-migration-for-your-linode
author:
  name: Linode
  email: docs@linode.com
description: "You can migrate your Linode across data centers using the Linode Cloud Manager. This guide explains how to do so, and what you should know beforehand."
og_description:  "You can migrate your Linode across data centers using the Linode Cloud Manager. This guide explains how to do so, and what you should know beforehand."
keywords: ["choose", "help", "migration", "data center"]
tags: ["linode platform","cloud manager"]
license: "[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)"
modified: 2021-04-29
modified_by:
  name: Linode
published: 2019-02-04
aliases: ['/platform/disk-images/how-to-initiate-a-cross-data-center-migration-for-your-linode/','/platform/migrating-to-a-different-data-center/']
h1_title: How to Initiate a Cross Data Center Migration for your Linode
title: Initiating a Cross Data Center Migration for your Linode
enable_h1: true
---

You can migrate your Linode across data centers using the Linode Cloud Manager. This is a self-service feature that does not require any action from Linode to initiate your migration.

{{< note >}}
We recommend using our [Choosing a Data Center](/docs/guides/how-to-choose-a-data-center/) guide to learn how to choose and speed test a data center.
{{< /note >}}

## In this Guide:

This guide will cover the following topics:

- [Important details to know before initiating a cross data center migration](#things-to-know-before-migrating).
- [How to migrate your Linode to a different data center](#migrating-to-a-new-data-center).

## Things to Know Before Migrating

Migrating your Linode to a new data center will result in a number of changes that may impact your Linode's configuration and external devices connected to it. All of these changes can be seen in a caution message before proceeding with your migration within the Linode Manager. Changes to be aware of are as follows:

- IP addresses are not transferrable across data centers and they will not be migrated with your Linode. Your Linode will be issued a new IPv4 and IPv6 address, which will be accessible once the migration completes. When your Linode enters the migration queue, new IP addresses are reserved and can be viewed on your Linode's **Networking** detail page. See the [Find Your Linode's IP Address](/docs/guides/find-your-linodes-ip-address/) guide to learn how to access Networking information in the Cloud Manager.

- You will need to update all your Linode's DNS records to use your new IP address or addresses. If you're hosting your DNS with us, this can be done through the [DNS Manager](/docs/guides/dns-manager/), while [rDNS](/docs/guides/configure-your-linode-for-reverse-dns/) can be configured directly on each Linode's Networking detail page.

- Any existing Backups created through our [Linode Backup Service](/docs/products/storage/backups/) will not be migrated. Once the Linode's migration has completed, your backup service will restart on its normal schedule.

- Block Storage volumes cannot be migrated to other regions. If you have a Block Storage volume attached to your Linode, it will be detached when the migration begins. See our [Transfer Block Storage Data between Data Centers](/docs/products/storage/block-storage/guides/transfer-volume-data-between-data-centers/) guide to learn how to transfer a Block Storage volume's data between data centers.

- If the Linode is using IPv6 pools, VLANs, or other features that have not yet been deployed to all data centers, the destination data center must also support these features.

- Migrations will include a period of downtime while your data is transferred. This estimate varies depending on your total disk size and the speeds expected between each data center. A calculated estimate will be displayed within the "Caution" message displayed before moving forward with your migration.

## Migrating to a New Data Center

1. Log in to the [Cloud Manager](https://www.cloud.linode.com) and click on the **Linodes** link in the sidebar.

1. Locate the Linode within the **Linodes** table, click the corresponding **More Options** ellipsis menu, and select *Migrate* to open the **Migrate Linode** form.

    ![How to initiate a cross data center migration.](linode-list-migrate-action.png "How to initiate a cross data center migration.")

    This same menu also appears within each individual Linode's dashboard page.

1. In **Migrate Linode** form, review the details of the migration and check the **Accept** box to agree to these conditions and expectations.

1. Under **Configure Migration**, select the destination region. This will be the data center that the Linode is migrated to.

1. Click on the **Enter Migration Queue** button, which closes the form and enters the Linode into the migration queue. You can monitor the progress of your migration from both within the list of Linodes and the Linode's dashboard. Your Linode will return to its previous state (powered on or off) once the migration has completed.
