---
slug: tokyo2-migration
author:
  name: Linode
  email: docs@linode.com
description: Linode is retiring our Tokyo 1 data center, and this guide shows how to migrate to our new Tokyo 2 location.
keywords: ["tokyo 1", "tokyo 2", "migrate", "migration", "migrating", "data center"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Linode
published: 2018-12-31
title: Migrating from Tokyo 1 to Tokyo 2
promo_default: false
tags: ["linode platform"]
aliases: ['/platform/tokyo2-migration/']
_build:
  list: false
noindex: true
---

In November 2016, Linode [announced and opened](https://blog.linode.com/2016/11/21/new-linode-datacenter-tokyo-2/) the Tokyo 2 data center. This is the second facility operated by Linode in the Tokyo region. Linode is now making preparations to retire the original Tokyo 1 facility. All Linodes hosted in this data center will be migrated to Tokyo 2. This guide is written to prepare customers for this migration and to make migrating easier.

## Benefits of Tokyo 2

The Tokyo 2 data center provides access to features that are not available in Tokyo 1. These features are:

-  The [Block Storage Service](https://www.linode.com/blockstorage).
-  The [newest Linode plans](https://blog.linode.com/2018/05/17/updated-linode-plans-new-larger-linodes/).
-  Future features on Linode's product roadmap.

## When will My Linodes be Migrated?

The [Linode Classic Manager](https://manager.linode.com) will display the scheduled dates and times for the migrations of your Tokyo 1 Linodes. If you visit the Classic Manager before this schedule is set by Linode, the information will not be displayed.

When your migration schedule first becomes visible in the Classic Manager, you will receive a support ticket from Linode to let you know. This ticket will be sent to you at least two months in advance of the start of your first migration. Your different Linodes will be scheduled to migrate on different dates and times. **Linode will not be able to adjust this schedule of migrations.**

You are able to move your servers to Tokyo 2 before the scheduled migration dates. We recommend that all customers move their servers early. Moving early will help you better control the uptime of your services.

### Will my Linode Backups be Migrated?

If your Tokyo 1 Linode is enrolled in the [Linode Backup Service](https://www.linode.com/backups), it will remain enrolled in the service after the migration. However, the saved backups and snapshots that have been created for your Linode prior to the migration **will not move** to the new Tokyo 2 facility. Instead, your Linode will start creating new scheduled backups after it is migrated to the Tokyo 2 date center (according to its [backup schedule](/docs/products/storage/backups/guides/schedule/)).

{{< note >}}
Before migrating, we recommend that you create at least one backup **separate from the Linode Backup Service** for each of your Tokyo 1 Linodes. The [Backing Up your Data](/docs/guides/backing-up-your-data/) guide has suggestions for alternative ways to back up your Linode.
{{< /note >}}

## What are My Options for Migrating?

There are three different options for moving your servers to the Tokyo 2 data center. The first two of these methods can be followed before the scheduled migration deadlines for your Linodes.

Regardless of which option you choose, **all of your Tokyo 1 Linodes' IP addresses will change** when moving to the new location. This includes all public and private IPv4 addresses, as well as public and link-local IPv6 addresses. When the schedule for your Linodes' migrations is set, new IP addresses in the Tokyo 2 data center will be reserved in advance for each of your Tokyo 1 Linodes. These reserved addresses will be listed for each Linode under the [Networking tab](/docs/guides/managing-ip-addresses/#viewing-ip-addresses) of the Linode's dashboard.

Later sections in this guide describe how to update your [network interface configuration](#update-your-network-configuration) and [DNS records](#update-dns-records) to use the new IPs.

### Option 1: Migrate Early

When you receive the support ticket which announces your Tokyo 1 Linodes' migrations, you will also see a new banner appear in the dashboard of each of your Tokyo 1 Linodes. This banner will give you the option to initiate an early migration of your Linode to Tokyo 2.

{{< note >}}
The early migration banner will actually appear on your Tokyo 1 Linodes' dashboards before you receive the support ticket which announces the migrations. You will be able to perform a migration as soon as you see this banner. However, new IPs in the Tokyo 2 data center will not be reserved for your Linode until you receive the support ticket.

This means that if you migrate before you receive your ticket, you will not know what your new IP addresses will be before you start the migration. Once you start the early migration, your new Tokyo 2 IP addresses will become visible in the [Networking tab](/docs/guides/managing-ip-addresses/#viewing-ip-addresses) of the Linode's dashboard.
{{< /note >}}

Clicking on the banner will take you to a new page which shows the estimated duration for the migration. This page will let you initiate the migration.

The following sequence executes when you start the migration:

1.  If your Linode is running, your Linode is gracefully powered down.

1.  At the same time, your Linode will be assigned its reserved Tokyo 2 IP addresses. These new IPs will become visible in the [Networking tab](/docs/guides/managing-ip-addresses/#viewing-ip-addresses) of your Linode's dashboard.

1.  The migration of your Linode is started immediately after the shutdown completes.

1.  If the Linode was running before the migration started, it will be automatically booted after the migration completes. If the Linode was not running, it will remain offline after the migration.

You will be able to monitor the progress of your Linode's migration from its dashboard. While waiting on the migration to complete, update your [DNS records](#update-dns-records) to use your new IP addresses. DNS changes can take time to propagate, so we recommend doing this quickly after the migration is initiated. Consider updating your [domain's TTL](#update-your-ttl) *before* you initiate the migration.

When the migration finishes, you may need to update your Linode's [network configuration](#update-your-network-configuration) to work properly with its new IP addresses.

### Option 2: Clone your Linodes

Because migrating a Linode will power it down during the migration, your Linode's services will be offline during that time. In addition, if you run a cluster of multiple Linodes for a service, then migrating one or more of them may cause problems for the cluster.

To avoid these issues, you can instead create new Linodes in Tokyo 2 and then **clone** your Tokyo 1 Linode's disks to them. Performing a clone will create exact copies of your disks on the new Linode.

{{< note >}}
You can perform a clone of a Linode when it is running. However, this can sometimes result in filesystem inconsistencies on the target Linode (your source Linode will never be negatively affected, even if the clone fails). You may need to power your source Linode down to perform a successful clone.
{{< /note >}}

Cloning your Linodes offers these benefits:

-   You will be able to set up your new Linodes in Tokyo 2 and verify that they run normally before you remove your Tokyo 1 Linodes.

-   To move your customers to your new Tokyo 2 servers, you can update your DNS records with your new Tokyo 2 IP addresses. You can keep your Tokyo 1 servers running while you update your DNS. Updating your DNS records in this way will gracefully direct your users to your new servers without downtime.

{{< note >}}
New Linodes that you create in Tokyo 2 will not receive the IP addresses that are reserved for your Tokyo 1 Linodes' scheduled migrations. If you choose to clone your Linodes, your new Tokyo 2 Linodes' IP addresses will be listed in the [Networking tab](/docs/guides/managing-ip-addresses/#viewing-ip-addresses) of your Linodes' dashboards.
{{< /note >}}

To clone a Linode, follow these steps:

1.  Create a new Linode in Tokyo 2. Make sure that you [select a plan](https://www.linode.com/pricing) that has as much disk space as the size of your disks on your source Tokyo 1 Linode.

1.  Follow the [cloning guide](/docs/guides/clone-your-linode/) to complete the clone operation. When following these steps, enable all of the configuration profile options for your Linode.

1.  Boot the new Tokyo 2 Linode when the clone completes.

After you have completed the clone, you may need to update your new Linode's [network configuration](#update-your-network-configuration) to work properly with its new IP addresses. After making sure that your new Tokyo 2 servers all work as expected, update your [DNS records](#update-dns-records). Consider updating your [domain's TTL](#update-your-ttl) *before* you update your DNS records.

{{< caution >}}
If you clone your Tokyo 1 Linodes to Tokyo 2, your Tokyo 1 Linodes will remain running and active on your account by default. To prevent double-billing, [remove](/docs/guides/manage-billing-in-cloud-manager/#removing-services) the original Tokyo 1 Linodes after you have finished your clones.
{{< /caution >}}

### Option 3: Migrate when Scheduled

If you do not choose to migrate or clone early, Linode will automatically start your migrations at the time listed in your support ticket.

{{< caution >}}
If Linode initiates your migration when it is scheduled, **your Linode will not be powered on automatically when the migration finishes**. Your Linode is not powered on in order to minimize potential security issues that could result from booting under a new IP assignment.
{{< /caution >}}

After the scheduled migration completes, you can log into the Linode's dashboard and power it on. You may need to update your new Linode's [network configuration](#update-your-network-configuration) to work properly with its new IP addresses. Then, update your [DNS records](#update-dns-records). You can also choose to update your DNS records as soon as the migration starts. Consider updating your [domain's TTL](#update-your-ttl) *before* the scheduled migration starts.

## Update your Network Configuration

In order for your new IP address assignment to work, your Linux deployment's network interface configuration needs to use the new IPs. If Linode's [Network Helper](/docs/guides/network-helper/) tool is enabled for your configuration profile, your network interface should automatically adopt the new IPs without any extra action needed from you.

If Network Helper is not enabled, but you use DHCP for your network assignments, then your networking should also work automatically.

If you do not use Network Helper or DHCP, then you will need to update your static interface configuration files. Follow the [Linux Static IP Configuration](/docs/guides/linux-static-ip-configuration/) guide to enter your new IP addresses. Your new IPs are listed in the [Networking tab](/docs/guides/managing-ip-addresses/#viewing-ip-addresses) of your Linode's dashboard. These new IPs will only appear **after you start its migration** (if you choose to migrate instead of cloning).

You may also need to update the configuration of your applications if they explicitly bind to your public or private IP addresses. Review Linode's [web server](/docs/guides/web-servers/) and [application](/docs/guides/applications/) guides for more information on this topic.

## Update DNS Records

To direct your users to your new Tokyo 2 servers' IPs, you need to update your DNS records to use the new IPs. If you are using Linode's DNS Manager, follow the DNS Manager guide to update your [DNS records](/docs/guides/dns-manager/#edit-records).

If you use a different DNS provider, you will need to visit that provider's website to update your records.

{{< content "update-dns-at-common-name-server-authorities" >}}

### Update your TTL

DNS resolvers hold a cache for your domain's records. A resolver will update its cached records according to your domain's *Time To Live* (TTL) value. This means that when you update your DNS records, other DNS resolvers will not immediately update their records for your domain. Instead, they will receive your new records when their caches expires.

Having a short TTL means that your users will be directed to your new IP addresses faster when you update your DNS records. It is recommended that you lower your TTL ahead of your migrations. To set the TTL, review the [DNS Manager](/docs/guides/dns-manager/#set-the-time-to-live-or-ttl) guide. After you complete your migrations and have updated your DNS successfully, you can raise your TTL back to the default value of 24 hours.

## Contact Linode Support

If you have any issues when migrating or cloning to Tokyo 2, or if you have any questions about this process, please [contact Linode Support](https://www.linode.com/support/). Technical questions about your Linux deployment's configuration are often outside the scope of support. For any out-of-scope issues, we also recommend searching and asking technical questions in the [Linode Community Site](https://www.linode.com/community/questions/).
