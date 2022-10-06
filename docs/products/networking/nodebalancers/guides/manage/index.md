---
author:
  name: Linode
  email: docs@linode.com
title: "Manage NodeBalancers"
description: "Learn how to view, edit, and delete NodeBalancers on the Linode platform."
published: 2022-10-06
---

## View NodeBalancers

Log in to the [Cloud Manager](https://cloud.linode.com) and select NodeBalancers from the left menu. If any NodeBalancers exist on your account, they are listed on this page.

![Screenshot of the NodeBalancer listing page in Cloud Manager](nodebalancer-view-list.png)

Each NodeBalancer in the matrix is displayed alongside the following details:

- **Backend Status:** The number of backend machines that are available and accepting connections (*up*) or have been removed from the rotation and are not accepting connections (*down*).
- **Transferred:** The amount of network transfer consumed by the inbound traffic to the NodeBalancer.
- **Ports:** A list of the ports that have been configured on the NodeBalancer.
- **IP Address:** The NodeBalancer's IPv4 address.
- **Region:** The data center where the NodeBalancer is located.

## Create a NodeBalancer

1. Log in to the [Cloud Manager](https://cloud.linode.com), select NodeBalancers from the left menu, and click the **Create Nodebalancer** button. This displays the *NodeBalancer Create* form.

1. Enter a **Label** for the NodeBalancer, as well as any **Tags** that may help you organize this new NodeBalancer with other services on your account.

1. Select a **Region** for this NodeBalancer. All of your *backend nodes* need to reside within the same region.

1. Within the *NodeBalancer Settings* area, there is a single configuration block with sections for configuring the port, defining health checks, and attaching backend nodes. Additional configurations can be added using the **Add another Configuration** button.

1. Review the summary and click the **Create NodeBalancer** button to provision your new NodeBalancer.

## Review and Edit a NodeBalancer

Navigate to the **NodeBalancer** in the Cloud Manager and select the NodeBalancer you wish to edit. See [View NodeBalancers](#view-nodebalancers).

![Screenshot of a NodeBalancer entry in the Cloud Manager](nodebalancer-edit.png)

This displays the details and settings for the selected NodeBalancer. From here, the following pages are available:

- **Summary:** View important details and graphs. This includes viewing the IP addresses, the ports, the status of the backends, and graphs for both the number of connections and network traffic.
- **Configurations:** This lists each port configured for the NodeBalancer, with the ability to edit the settings for the existing port or add a new port.
- **Settings:** Displays additional settings for the NodeBalancer, including the label and setting a connection throttle.

![Screenshot of a NodeBalancer entry in the Cloud Manager](nodebalancer-summary.png)

## Delete a NodeBalancer

1. Navigate to the **NodeBalancer** in the Cloud Manager and select the NodeBalancer you wish to edit. See [View NodeBalancers](#view-nodebalancers).

1. Navigate to the **Settings** tab, scroll to the *Delete NodeBalalancer* section, and click the **Delete** button.

    ![Screenshot of the Delete form](nodebalancer-delete.png)

1. A confirmation dialog appears. Click **Delete NodeBalancer** to proceed with removing the service from your account.