---
slug: assign-a-cloud-firewall-to-linode-service-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that describes how to add Cloud Firewalls to a Linode'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-11-09
modified_by:
  name: Ryan Syracuse
published: 2020-11-09
title: Add a Cloud Firewall to a Linode
keywords: ["cloud firewall"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/cloud-firewall/assign-a-cloud-firewall-to-linode-service-shortguide/']
---

1. Log into your [Linode Cloud Manager](https://cloud.linode.com/) and select **Firewalls** from the navigation menu.

    ![Access the Firewalls listing page.](access-firewalls-listing.png "Access the Firewalls listing page.")

1. From the **Firewalls** listing page, click on the Firewall that you would like to attach to a Linode. This takes you to the Firewall's **Rules** page.

1. Click on the **Linodes** tab. This takes you to the **Firewalls Linodes** page. If the Firewall is assigned to any Linode services they are displayed on the page.

1. Click on the **Add Linodes to Firewall** link.

    ![Assign a Cloud Firewall to a Linode service.](assign-firewall-to-linode-service.png "Assign a Cloud Firewall to a Linode service.")

1. From the **Add Linode to Firewall** drawer, click on the dropdown menu and select the Linode service to which you'd like to apply this Firewall. You can also start typing the Linode service's label to narrow down your search.

    {{< note >}}
You can assign the Firewall to more than one Linode service at a time. Continue the previous step to assign the Firewall to another Linode service.
{{</ note >}}

1. Click on the **Add** button to assign the Firewall to your Linode(s).

    ![Click on the Add button to assign the Firewall to your Linode service.](complete-add-firewall-to-service.png "Click on the Add button to assign the Firewall to your Linode service.")

{{< note >}}
If you have a Cloud Firewall attached to a Linode and you attempt to [migrate the Linode to a data center](/docs/guides/how-to-initiate-a-cross-data-center-migration-for-your-linode/) that does not support Cloud Firewalls, the migration fails.
{{</ note >}}
