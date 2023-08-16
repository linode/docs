---
title: "Backend Nodes (Compute Instances)"
description: "Instructions for adding and configuring backend nodes on a NodeBalancer"
published: 2022-10-07
authors: ["Linode"]
---

Load balancers work by distributing traffic to a pool of servers. For NodeBalancers, these servers are Linode Compute Instances and they are configured as *backend nodes*. Each Compute Instance operating as a backend node needs to be located within the same data center as the NodeBalancer and be assigned a private IPv4 address. See [Managing IP addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#adding-an-ip-address) for instructions on adding a private IP address to an existing Compute Instance.

{{< note >}}
While only a single backend node is required, *at least* two backends need to be configured to make use of load balancing functionality.
{{< /note >}}

## Add, Edit, and Remove Backend Nodes

Backend nodes can be defined through a NodeBalancer's [Configurations](/docs/products/networking/nodebalancers/guides/configure/), which contain all the settings and parameters for a particular *inbound* port.

1. Log in to the [Cloud Manager](http://cloud.linode.com), click **NodeBalancers** in the left menu, and select the NodeBalancer you wish to edit. See [Manage NodeBalancers](/docs/products/networking/nodebalancers/guides/manage/).

1. Navigate to the **Configurations** tab. This displays a list of all ports that have been configured.

1. Open the port configuration you wish to edit or create a new one by clicking the **Add Another Configuration** button.

1. Scroll down to the *Backend Nodes* section to see a list of backends that have already been added.

    - Adjust any of the existing fields to edit the backend.
    - Click the **Add a Node** button to add a new backend.
    - Click the **Remove** link to remove the backend.

1. Click the **Save** button to save the configuration.

{{< note >}}
Removing a backend from the NodeBalancer configuration does not delete the associated Compute Instance. It only removes that instance from operating as a backend for this particular NodeBalancer.
{{< /note >}}

## Backend Configuration Options

Each backend node contains the following configuration parameters.

- **Label**: Sets a label to identify the backend. While any label can be used, it's common to use the label of the associated Compute Instance.
- **IP Address**: Select the private IPv4 address of the Compute Instance you wish to use as the backend. This field has a dropdown list of all Compute Instances within the same region as the NodeBalancer that have a private IPv4 address assigned.
- **Port**: Identifies the port that the NodeBalancer should use when sending traffic to the backend. This should be the port that the application is listening on within this backend Compute Instance.
- **Weight**: Sets the priority of the backend. Backends with a higher weight are allocated more connections than backends with a lower weight.
- **Mode**: Determines if the backend accepts or rejects traffic and in what circumstances. See [Mode](#mode).

## Mode

By default, all backends are allocated traffic according to the configuration settings of the NodeBalancer, provided the backends have a status of *up*. To change this behavior, use the **Mode** setting to modify how a backend accepts or rejects traffic.

- **Accept**: Accept incoming connections
- **Reject**: Reject new incoming connections and discontinue health checks on this backend. Existing connections remain active, but session stickiness is not respected. Useful for taking the backend out of rotation to perform maintenance or decommission it.
- **Drain**: Only accept connections from clients whose session stickiness points to this backend. Use *in advance* of taking a backend out of rotation for maintenance or decommissioning to gradually drain connections.
- **Backup**: Only accept connections if all other backends are down. Useful if you use frontend caching servers, such as Varnish, and want to direct traffic to the origin servers if the caching servers are down.

{{< note >}}
Changes made to the Mode field are applied within 60 seconds.
{{< /note >}}

## Understand the Status of a Backend Node

Each backend node has a status of *up* or *down*.

- **Up**: The backend is healthy and should be kept in rotation, provided that the [Mode](#mode) is allowing traffic.
- **Down**: The backend is *unhealthy* and taken out of rotation. This means that a health check has failed or the **Mode** has been set to *Reject*.

## Configure Compute Instances

When adding a Compute Instance as a *Backend Node* to a NodeBalancer, you must also ensure that it has been properly configured for your application. As part of this, review the following:

- Install all required software on the Compute Instance.

- Verify that any required data has been properly replicated on each Compute Instance. There are many different methods of ensuring data is properly replicated between multiple servers, including [rsync](https://linux.die.net/man/1/rsync), [Gluster](https://www.gluster.org/), [Galera](https://galeracluster.com/), or CI/CD tooling.

- Verify that each instance accepts traffic over the port specified in the backend's configuration and is not blocking addresses from the NodeBalancer's private IP address range: `192.168.255.0/24`.