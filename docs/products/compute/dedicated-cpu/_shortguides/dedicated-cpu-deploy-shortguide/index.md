---
slug: dedicated-cpu-deploy-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to delpoy a Dedicated CPU in the Linode Cloud Manager.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Deploy a Dedicated CPU in the Linode Cloud Manager
keywords: ["dedicated CPU"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/dedicated-cpu/dedicated-cpu-deploy-shortguide/']
---

![Create a Dedicated CPU Linode in the Cloud Manager](dedi-cpu-with-new-manager.gif "Create a Dedicated CPU Linode in the Cloud Manager")

1. Log in to the [Linode Cloud Manager](https://cloud.linode.com).

1. Click on the **Create** dropdown menu at the top left of the page, and select the **Linode** option.

1. Select a [Distribution](/docs/quick-answers/linux/choosing-a-distribution/), [Marketplace App](/docs/platform/marketplace/how-to-use-marketplace-apps-at-linode/), or [Image](/docs/platform/disk-images/linode-images/) to deploy from.

    {{< note >}}
Use a [StackScript](https://www.linode.com/stackscripts) to quickly deploy software platforms and system configuration options to your Linux distribution. You can read more about Stackscripts and how they work in our [Automating Deployments with Stackscripts Guide](/docs/platform/stackscripts/).
  {{< /note >}}

1. Choose the region where you would like your Linode to reside. If you’re not sure which to select, see our [How to Choose a Data Center guide](/docs/platform/how-to-choose-a-data-center/). You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network route between you and each of our data centers.

1. At the top of the **Linode Plan** section, click on the **Dedicated CPU** tab and select the Dedicated CPU plan you would like to use.

1. Enter a label for your new Linode under the **Linode Label** field.

1. Enter a strong root password for your Linode in the **Root Password** field. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique.

    {{< note >}}
You are not prompted to enter a root password if you are cloning another Linode or restoring from the Linode Backups service.
{{< /note >}}

1. Optionally, add an [SSH key](/docs/security/authentication/use-public-key-authentication-with-ssh/#upload-your-ssh-key-to-the-cloud-manager), [Backups](/docs/platform/disk-images/linode-backup-service/), or a [Private IP address](/docs/platform/manager/remote-access/#adding-private-ip-addresses).

1. Click the **Create** button when you have finished completing this form. You are redirected to the overview page for your new Linode. This page shows a progress bar which indicates when the Linode has been provisioned and is ready for use.
