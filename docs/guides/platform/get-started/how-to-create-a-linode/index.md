---
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that provides instructions to create a Linode'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: 
published: 2020-10-23
title: Create a Linode
keywords: []
headless: true
slug: how-to-create-a-linode
show_on_rss_feed: false
---
## Create a Linode

1.  Log in to the [Cloud Manager](https://cloud.linode.com) with the username and password you created when signing up.

1.  At the top left of the console, click the **Create...** button and then select **Linode**.

1.  Select the [Distributions](/docs/quick-answers/linux/choosing-a-distribution/), [Marketplace](/docs/platform/one-click/how-to-use-one-click-apps-at-linode/), or [Images](/docs/platform/disk-images/linode-images/) you would like to use.

    {{< note >}}
Use a [StackScripts](http://www.linode.com/stackscripts) to quickly deploy software platforms and system configuration options to your Linux distribution. Some of the most popular StackScripts do things like install a LAMP stack, VPN, or WordPress. You can read more about Stackscripts and how they work in our [Automating Deployments with Stackscripts Guide.](/docs/platform/stackscripts/)
{{< /note >}}

1.  Choose the region where you would like the Linode to reside. If you're not sure which to select, see the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for details about the route path between you and a data center in each specific region.

1. Select a Linode plan.

1.  Give your Linode a label. This is a name to help you easily identify it within the Cloud Manager's Dashboard. If desired, assign a tag to the Linode in the **Add Tags** field.

1. Create a root password for your Linode in the **Root Password** field. This password must be provided when you log in to your Linode via SSH. It must be at least 6 characters long and contain characters from two of the following categories:

    - lowercase and uppercase case letters
    - numbers
    - punctuation characters

1.  In the right panel of the page, click the **Create** button. The *Linodes* page appears that reports the status of the Linode as it boots up. You can now use the Cloud Manager to:

    * Boot and shut down the Linode
    * Access monitoring statistics
    * Update the [billing](/docs/platform/billing-and-support/billing-and-payments-new-manager/) and [account](/docs/platform/manager/accounts-and-passwords-new-manager/) information
    * Add additional Linode services, like [Block Storage](/docs/platform/block-storage/how-to-use-block-storage-with-your-linode-new-manager/)
    * Open a [support](/docs/platform/billing-and-support/support-new-manager/) ticket and perform other administrative tasks

1.  Be sure to bookmark the [Linode Status page](https://status.linode.com/) or [subscribe](/docs/platform/linode-status-page/) to our system status updates by email.

