---
author:
    name: Linode
    email: docs@linode.com
description: 'Migrating to a different data center.'
keywords: ["choose", "help", "migration", "data center"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-06-20
modified_by:
    name: Linode
published: 2019-02-04
title: Migrating to a Different Data Center
---

The Linode Cloud Manager provides direct support for easily self-configurable migrations between all of our data centers. This guide will explain changes you can expect due to a migration, and show you step by step how to proceed.
{{< note >}}
We recommend using our [Choosing a Data Center Guide](/docs/platform/how-to-choose-a-data-center/) for a closer look at the process of choosing a data center to migrate to.
{{< /note >}}

## Things to Know Before Migrating

Migrating your Linode to a new datacenter will result in a number of changes that may impact the configuration of your Linode and external devices connected to it. All of these changes can be seen in a caution message before proceeding with your migration within the Linode Manager. Changes to be aware of are as follows:

- IP addresses are not transferrable across data centers and they will not be migrated with you. You will be issued a new IPv4 and IPv6 address, which will be accessible as soon as the migration completes. Your new IP addresses can be found on the **Networking** tab for each Linode. For more information on how to find your Linodes's IP address, [see our guide](https://www.linode.com/docs/quick-answers/linode-platform/find-your-linodes-ip-address/).

- Any existing Backups through the [Linode Backup Service](/docs/platform/disk-images/linode-backup-service/) will not be migrated. Once the migration has completed, your backup service will restart on it's normal schedule.

- You will need to update all DNS records pointing towards this Linode to use your new IP address or addresses. If you're hosting your DNS with us, this can be done through your [DNS Manager](https://www.linode.com/docs/platform/manager/dns-manager/), while [rDNS](https://www.linode.com/docs/networking/dns/configure-your-linode-for-reverse-dns/) can be configured directly on each Linode's Networking Page.

- Block Storage volumes can not be migrated to other regions. If you have critical data on a block storage volume, it is recommended that you [copy this data to a new volume](/docs/security/data-portability/download-files-from-your-linode/) in your new datacenter before proceeding.

- Migrations will include a period of downtime while your data is transferred. This estimate varies depending on your total disk size and the the speeds expected between each datacenter. A calculated estimate will be displayed within the "Caution" message displayed before moving forward with your migration.

## Migrating to a New Data Center

![migrationdc.gif](migrate-dc.gif)

1. Log in to the [Cloud Manager](https://www.cloud.linode.com)

1. Select the Linode you'd like to Migrate.

2. Click on the "Advanced" tab at the top of the page.

3. Scroll down to the bottom of the following page to see the "Configure Migration" section. Click on the **Click here to get started** button to proceed.

4. Make sure you read and understand the "caution" message before clicking on the **Accept** checkbox. Select the region you'd like to migrate to, and finally select the **Enter Migration Queue** button.

5. You will be automatically redirected to your Linode's summary page. Here you can monitor the progress of your migration as it proceeds. Your Linode will return to it's previous state (powered on or off) once the migration has completed.
