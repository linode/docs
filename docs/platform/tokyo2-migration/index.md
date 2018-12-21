---
author:
  name: Linode
  email: docs@linode.com
description: Linode is retiring our Tokyo 1 data center, and this guide shows how to migrate to our new Tokyo 2 location.
keywords: ["tokyo 1", "tokyo 2", "migrate", "migration", "migrating", "data center"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-09-27
modified_by:
  name: Linode
published: 2018-09-27
title: Migrating from Tokyo 1 to Tokyo 2
hiddenguide: true
promo_default: false
---

In November 2016, Linode [announced and opened](https://blog.linode.com/2016/11/21/new-linode-datacenter-tokyo-2/) the Tokyo 2 data center. This is the second facility operated by Linode in the Tokyo region. Linode is now making preparations to retire the original Tokyo 1 facility. All Linodes hosted in this data center will be migrated to Tokyo 2. This guide is written to prepare customers for this migration and to make migrating easier.

## Benefits of Tokyo 2

The Tokyo 2 data center provides access to features that are not available in Tokyo 1. These features are:

-  The [Block Storage Service](https://www.linode.com/blockstorage) (available starting Q3 2018).
-  The [newest Linode plans](https://blog.linode.com/2018/05/17/updated-linode-plans-new-larger-linodes/).
-  Future features on Linode's product roadmap.

## When will My Linodes be Migrated?

You will receive a support ticket from Linode that lists the scheduled dates and times for the migration of your Tokyo 1 Linodes. This ticket will be sent to you at least three months in advance of the start of your first migration.

Different Linodes will be scheduled to migrate on different dates and times. The support ticket you receive will list the migration schedule for all of your Tokyo 1 Linodes. **Linode will not be able to adjust this schedule of migrations.**

You are able to move your servers to Tokyo 2 before the scheduled migration dates. We recommend that all customers move their servers early. Moving early will help you better control the uptime of your services.

## What are My Options for Migrating?

There are three different options for moving your servers to the Tokyo 2 data center. The first two of these methods can be followed before the scheduled migration deadlines for your Linodes.

Regardless of which option you choose, **all of your Tokyo 1 Linodes' IP addresses will change** when moving to the new location. This includes all public and private IPv4 addresses, as well as public and link-local IPv6 addresses.

Later sections in this guide describe how to update your [network interface configuration](#update-your-network-configuration) and [DNS records](#update-dns-records) to use the new IPs.

{{< note >}}
If your Tokyo 1 Linode is enrolled in the [Linode Backup Service](https://www.linode.com/backups), it will remain enrolled in the service after the migration. However, the saved backups and snapshots that have been created for your Linode prior to the migration **will not move** to the new Tokyo 2 facility. Instead, your Linode will start creating new scheduled backups after it is migrated to the Tokyo 2 date center (according to its [backup schedule](/docs/platform/disk-images/linode-backup-service/#schedule-backups)).
{{</ note >}}

### Option 1: Migrate Early

When you receive the support ticket which lists your migration times, you will also see a new banner appear in the dashboard of each of your Tokyo 1 Linodes. This banner will give you the option to initiate an early migration of your Linode to Tokyo 2.

Clicking on the banner will take you to a new page which shows the estimated duration for the migration. This page will let you initiate the migration.

The following sequence executes when you start the migration:

1.  If your Linode is running, your Linode is gracefully powered down.

1.  At the same time, your Linode will be assigned new IP addresses. You will be able to view these new IPs from the [Remote Access tab](/docs/platform/manager/remote-access/) of your Linode's dashboard.

1.  The migration of your Linode is started immediately after the shutdown completes.

1.  If the Linode was running before the migration started, it will be automatically booted after the migration completes. If the Linode was not running, it will remain offline after the migration.

You will be able to monitor the progress of your Linode's migration from its dashboard. While waiting on the migration to complete, [update your DNS records](#update-dns-records) to use your new IP addresses. DNS changes can take time to propagate, so we recommend doing this quickly after the migration is initiated.

When the migration finishes, you may need to update your Linode's [network configuration](#update-your-network-configuration) to use the new IPs.


### Option 2: Clone your Linodes

Because migrating a Linode will power it down during the migration, your Linode's services will be offline during that time. In addition, if you run a cluster of multiple Linodes for a service, then migrating one or more of them may cause problems for the cluster.

To avoid these issues, you can instead create new Linodes in Tokyo 2 and then **clone** your Tokyo 1 Linode's disks to them. Performing a clone will create exact copies of your disks on the new Linode.

{{< note >}}
You can perform a clone of a Linode when it is running. However, this can sometimes result in filesystem inconsistencies on the target Linode (your source Linode will never be negatively affected, even if the clone fails). You may need to power your source Linode down to perform a successful clone.
{{< /note >}}

Cloning your Linodes offers these benefits:

-   You will be able to set up your new Linodes in Tokyo 2 and verify that they run normally before you remove your Tokyo 1 Linodes.

-   When you have verified that your Tokyo 2 Linodes work, you can update your DNS records. Updating your DNS records will gracefully direct your users to your new servers without downtime.

To clone a Linode, follow these steps:

1.  Create a new Linode in Tokyo 2. Make sure that you [select a plan](https://www.linode.com/pricing) that has as much disk space as the size of your disks on your source Tokyo 1 Linode.

1.  Follow the [cloning guide](/docs/platform/disk-images/clone-your-linode/) to complete the clone operation. When following these steps, enable all of the configuration profile options for your Linode.

After you have created your new Linode and completed the clone, you may need to update your new Linode's [network configuration](#update-your-network-configuration). After making sure that your new Tokyo 2 servers all work as expected, [update your DNS records](#update-dns-records).

{{< note >}}
If you clone your Tokyo 1 Linodes to Tokyo 2, your Tokyo 1 Linodes will remain running and active on your account by default. To prevent double-billing, [remove](/docs/platform/billing-and-support/billing-and-payments/#removing-services) the original Tokyo 1 Linodes after you have finished your clones.
{{< /note >}}

### Option 3: Migrate when Scheduled

If you do not choose to migrate or clone early, Linode will automatically start your migrations at the time listed in your support ticket.

{{< caution >}}
If Linode initiates your migration when it is scheduled, **your Linode will not be powered on automatically when the migration finishes**. Your Linode is not powered on in order to minimize potential security issues that could result from booting under a new IP assignment.
{{< /caution >}}

After the scheduled migration completes, you can log into the Linode's dashboard and power it on. You may need to update your new Linode's [network configuration](#update-your-network-configuration). Then, [update your DNS records](#update-dns-records). You can also choose to update your DNS records as soon as the migration starts.

## Update your Network Configuration

In order for your new IP address assignment to work, your Linux deployment's network interface configuration needs to use the new IPs. If Linode's [Network Helper](/docs/platform/network-helper/) tool is enabled for your configuration profile, your network interface should automatically adopt the new IPs without any extra action needed from you.

If Network Helper is not enabled, but you use DHCP for your network assignments, then your networking should also work automatically.

If you do not use Network Helper or DHCP, then you will need to update your static interface configuration files. Follow the [Linux Static IP Configuration](/docs/networking/linux-static-ip-configuration/) guide to enter your new IP addresses. Your new IPs are listed in the [Remote Access tab](/docs/platform/manager/remote-access/) of your Linode's dashboard. These new IPs will only appear **after you start its migration** (if you choose to migrate instead of cloning).

You may also need to update the configuration of your applications if they explicitly bind to your public or private IP addresses. Review Linode's [web server](/docs/web-servers/) and [application](/docs/applications/) guides for more information on this topic.

## Update DNS Records

To direct your users to your new Tokyo 2 servers' IPs, you need to update your DNS records to use the new IPs. If you are using Linode's DNS Manager, follow the DNS Manager guide to [update your records](/docs/platform/manager/dns-manager/#edit-records).

If you use a different DNS provider, you will need to visit that provider's website to update your records.

{{< content "update-dns-at-common-name-server-authorities" >}}

## Contact Linode Support

If you have any issues when migrating or cloning to Tokyo 2, or if you have any questions about this process, please [contact Linode Support](/docs/platform/billing-and-support/support/#contacting-linode-support). Technical questions about your Linux deployment's configuration are often outside the scope of support. For any out-of-scope issues, we also recommend searching and asking technical questions in the [Linode Community Site](/community/questions/).