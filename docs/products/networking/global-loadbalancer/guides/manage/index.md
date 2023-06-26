---
title: "Manage Global Balancer"
description: "Learn how to view, edit, and delete Global Load Balancer."
published: 2022-10-07
authors: ["Akamai"]
---

## View Global Load Balancer

Log in to the [Cloud Manager](https://cloud.linode.com) and select Load Balancers from the left menu. If any Load Balancers exist on your account, they are listed on this page.

![Screenshot of the Load Balancer listing page in Cloud Manager](nodebalancer-view-list.png)

Each Load Balancer in the matrix is displayed alongside the following details:

- **Backend Status:** The number of backend machines that are available and accepting connections (*up*) or have been removed from the rotation and are not accepting connections (*down*).
- **Transferred:** The amount of network transfer consumed by the inbound traffic to the NodeBalancer.
- **Ports:** A list of the ports that have been configured on the Load Balancer.
- **IP Address:** The Load Balancer's IPv4 address.
- **Region:** The data center where the Load Balancer is located.

## Create a Global Load Balancer

To create a Global Load Balancer, follow the [Get Started](/docs/products/networking/global-loadbalancer/) instructions.

## Review and Edit a Global Load Balancer

Navigate to the **Global Load Balancer** page in the Cloud Manager and select the Load Balancer you wish to edit. See [View Global Balancers](#view-Global Load Balancer).

![Screenshot of a LoadBalancer entry in the Cloud Manager](nodebalancer-edit.png)

This displays the details and settings for the selected Load Balancer. From here, the following pages are available:

- **Summary:** View important details and graphs. This includes viewing the IP addresses, the ports, the status of the backends, and graphs for both the number of connections and network traffic.
- **Configurations:** This lists each port configured for the NodeBalancer, with the ability to edit the settings for the existing port or add a new port. See [Configuration Options](/docs/products/networking/nodebalancers/guides/configure/) for more information on each of these settings.
- **Settings:** Displays additional settings for the NodeBalancer, including the label and setting a connection throttle.

![Screenshot of a NodeBalancer entry in the Cloud Manager](nodebalancer-summary.png)

## Delete a Global Load Balancer

1. Navigate to the **Global Balancer** page in the Cloud Manager and select the Load Balancer you wish to edit. See [View Global Load Balancers](#view-loadbalancer).

1. Navigate to the **Settings** tab, scroll to the *Delete Global Load Balancer* section, and click the **Delete** button.

    ![Screenshot of the Delete form](loadbalancer-delete.png)

1. A confirmation dialog appears. Click **Delete Gloabal Load Balancer** to proceed with removing the service from your account.