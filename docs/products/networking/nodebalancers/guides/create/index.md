---
title: "Create a NodeBalancer"
description: "Instructions on creating a NodeBalancer, Linode's load balancing solution."
published: 2022-10-07
modified: 2023-02-06
authors: ["Linode"]
---

This guide walks you through creating a NodeBalancer through the Cloud Manager.

1. [Open the Create NodeBalancer Form in the Cloud Manager](#open-the-create-nodebalancer-form-in-the-cloud-manager)
1. [Set the Label](#set-the-label)
1. [Select a Region](#select-a-region)
1. [Add and Configure Ports](#add-and-configure-ports)
1. [Set Up Health Checks for Each Port](#set-up-health-checks-for-each-port)
1. [Add Backend Nodes to Each Port](#add-backend-nodes-to-each-port)
1. [Deploy the NodeBalancer](#deploy-the-nodebalancer)

## Open the Create NodeBalancer Form in the Cloud Manager

Log in to the [Cloud Manager](https://cloud.linode.com/) and select **NodeBalancers** from the left navigation menu. Click the **Create NodeBalancer** button. This opens the *[NodeBalancer Create](https://cloud.linode.com/nodebalancers/create)* form.

## Set the Label

Within the **Label** field, enter the label you wish to use to identify it from other NodeBalancers on your account. A good label should provide some indication as to what the NodeBalancer will be used for. The label must be alphanumeric, between 3 and 32 characters, and unique from other NodeBalancer labels on your account.

## Select a Region

Select the **region** where the NodeBalancer will reside. Regions correspond with individual data centers, each located in a different geographical area. Select the region where you've deployed the Compute Instances you intend on using with this NodeBalancer. If you haven't yet deployed Compute Instances or chosen a region, select the region closest to you and/or your customers. This helps reduce latency and can make a significant impact in connection speeds and quality.

- [Global Infrastructure](https://www.linode.com/global-infrastructure/)
- [Speed Tests for Data Centers](https://www.linode.com/speed-test/)
- [How to Choose a Data Center](/docs/products/platform/get-started/guides/choose-a-data-center/)

## Add and Configure Ports

To start load balancing traffic, you need to define which ports the NodeBalancer should listen to and how the incoming traffic should be routed to the backend nodes. These ports can be configured within the **NodeBalancer Settings** area. By default, a single port configuration is visible in this area. Additional ports can be added by clicking the **Add another Configuration** button. See [Configuration Options](/docs/products/networking/nodebalancers/guides/configure/) for more details regarding each of these settings.

- **Port:** Enter the *inbound* port the NodeBalancer should listen to. This can be any port from 1 through 65534 and should align with the port the client connects to. See [Configuration Options > Port](/docs/products/networking/nodebalancers/guides/configure/#port).
- **Protocol:** Select *TCP*, *HTTP*, or *HTTPS*. For many applications, using *TCP* offers the most flexibility and allows for TLS pass through. Using *HTTP* and *HTTPS* offers some additional NodeBalancer options and allows for TLS termination. See [Configuration Options > Protocol](/docs/products/networking/nodebalancers/guides/configure/#protocol).
- **Proxy Protocol:** *Only visible when the *TCP* protocol is selected.* Used for sending the client IP address to the backend nodes. See [Configuration Options > Proxy Protocol](/docs/products/networking/nodebalancers/guides/configure/#proxy-protocol).
- **Algorithm:** Controls how new connections are allocated across backend nodes. See [Configuration Options > Algorithm](/docs/products/networking/nodebalancers/guides/configure/#algorithm).
- **Session Stickiness:** Controls how subsequent requests from the same client are routed when selecting a backend node. See [Configuration Options > Session Stickiness](/docs/products/networking/nodebalancers/guides/configure/#session-stickiness).

{{< note >}}
For most web applications, it's common to configure two ports: port *80* and port *443*.
{{< /note >}}

## Set Up Health Checks for Each Port

Each port can optionally be configured with health checks. These health checks either proactively query the backend nodes (*active*) or monitor the existing traffic to backend nodes (*passive*). If a health check determines that the backends aren't responsive or are encountering another issue, they can be marked as *down* and taken out of rotation.

- **Active Health Checks:** Active health checks proactively query the backend nodes by performing TCP connections or making HTTP requests. See [Configuration Options > Active Health Checks](/docs/products/networking/nodebalancers/guides/configure/#active-health-checks).

- **Passive Checks:** Passive health checks monitor requests sent to the backend nodes and look for any issues. See [Configuration Options > Passive Health Checks](/docs/products/networking/nodebalancers/guides/configure/#passive-health-checks).

## Add Backend Nodes to Each Port

Load balancers work by distributing traffic to a pool of servers. For NodeBalancers, these servers are Linode Compute Instances and they are configured as *backend nodes*. Within the **Backend Nodes** area of the creation form, add each Compute Instance you intend on using with this NodeBalancer, making sure to select the correct private IP address for the NodeBalancer and the port that the application is using. For information on configuring backend nodes, see the [Configure Backend Nodes (Compute Instances)](/docs/products/networking/nodebalancers/guides/backends/) guide.

## Deploy the NodeBalancer

Once you've adjusted the settings to fit your needs, review the *NodeBalancer Summary* section and click the **Create NodeBalancer** button. The NodeBalancer should be provisioned within a few minutes.