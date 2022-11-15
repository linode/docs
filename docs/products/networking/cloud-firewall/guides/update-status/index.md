---
author:
  name: Linode
  email: docs@linode.com
title: Update Cloud Firewall Status
description: "How to update the status of your Linode Cloud Firewall."
---

When you [add a Cloud Firewall](/docs/products/networking/cloud-firewall/guides/create-a-cloud-firewall/), the Firewall is enabled by default. Enabled means that the Firewall is active. If it is applied to a Linode service it filters your Linode service's network traffic according to the Firewall's rules. Disabling a Firewall deactivates the Firewall and it no longer filters any traffic for the Linode services it has been applied to.

1. Log into your [Linode Cloud Manager](https://cloud.linode.com/) and select **Firewalls** from the navigation menu. This takes you to the **Firewalls** listing page.

1. Click on the **Enable/Disable** button corresponding to the firewall whose status you would like to update:

    ![Update your Firewall's status.](update-the-firewall-status.png "Update your Firewall's status.")

    The **Status** column on the **Firewalls** listing page updates to display the Firewall's current status.

    ![View the updated status of your Firewall.](view-the-firewall-status.png "View the updated status of your Firewall.")