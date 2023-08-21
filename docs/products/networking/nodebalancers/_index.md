---
title: NodeBalancers
title_meta: "NodeBalancer Product Documentation"
description: "Linode's managed cloud-based load balancing service, designed to provide high availability and horizontal scaling to any application."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
    product_description: "Managed cloud-based load balancing service that provides high availability and horizontal scaling to any application."
modified: 2022-08-24
aliases: ['/platform/nodebalancer/','/nodebalancers/','/guides/platform/nodebalancer/']
---

**NodeBalancers** are managed *load balancers as a service (LBaaS)*, making load balancing accessible and easy to configure on the Linode Platform. They intelligently distribute incoming requests to multiple backend Compute Instances, so that there's no single point of failure. This enables high availability, horizontal scaling, and A/B testing on any application hosted with Linode.

## High Availability

In a typical single machine configuration, issues with the machine may cause the application to stop working as expected or become inaccessible. High availability solutions remove this single point of failure through combining multiple machines (redundancy), monitoring systems, and automatic failover - all of which are implemented by NodeBalancers.

## Horizontal Scaling

There are two main ways to scale an application to increase the performance and capacity within your applications. *Vertical scaling* increases or decreases the resources on the existing machines. This is achieved by [resizing](/docs/products/compute/compute-instances/guides/resize/) your Compute Instances. *Horizontal scaling* adds or removes machines that are identically configured to serve your application or perform a certain task. This is commonly accomplished through a load balancing solution, like NodeBalancers. Horizontal scaling can be much more flexible and allows you to scale as needed without taking down your site while upgrading or downgrading.

## Additional Features

- **Managed:** NodeBalancers take the infrastructure management out of load balancing. They are designed to be maintenance free after initial configuration.

- **Sticky Sessions:** NodeBalancers can route subsequent requests to the same backend, so all application sessions work correctly.

- **Health Checks:** Traffic is only routed to healthy backends. Passive health checks happen on every request. You can configure active health checks based on your application or service.

- **SSL Termination:** NodeBalancers can terminate SSL traffic on your behalf and expose the requester’s IP through the backend. This is done using configurable rulesets that give you the power to fine-tune admissible traffic.

- **Throttling:** Prevent potential abuse (and preserve resources on your backends) by setting a client connection throttle on the NodeBalancer.

- **Multi-Port:** NodeBalancers support balancing traffic to multiple network ports. Several services can be load balanced with a single NodeBalancer.

## Recommended Workloads

- Enterprise applications
- High traffic and e-commerce websites
- Applications that require extreme reliability and uptime
- Applications that need to dynamically scale without any downtime
- A/B testing

## Availability

NodeBalancers are available across [all regions](https://www.linode.com/global-infrastructure/).

## Pricing

Each NodeBalancer on an account costs $10/mo ($0.015/hr).

## Technical Specifications

- Managed cloud-based load balancing service
- Dynamically routes traffic over any ports to configurable backend Compute Instances
- Highly available with built-in redundancy
- Up to 10,000 concurrent connections
- Supports TCP-based (layer 4) load balancing (UDP traffic is not supported)
- Supports HTTP and HTTPS (layer 7) load balancing through the HTTP/1.1 protocol (HTTP/2 is not yet available)
- Supports both SSL termination (using the HTTPS protocol mode) and SSL pass-through (using the TCP protocol mode)
- Equipped with both public IPv4 and IPv6 addresses
- Fully customizable health checks to ensure traffic lands on a functioning backend
- 40 Gbps inbound network bandwidth
- Free inbound network transfer
- Outbound network transfer usage is counted towards the account-wide [monthly network transfer pool](/docs/products/platform/get-started/guides/network-transfer/)
- Provisioning and management through the [Cloud Manager](https://cloud.linode.com/), [Linode CLI](https://www.linode.com/products/cli/), or programmatically through the [Linode API](https://www.linode.com/products/linode-api/)

## Limits and Considerations

- **Maximum number of concurrent connections:** NodeBalancers each support up to 10,000 concurrent connections. If your application needs to support more than that, [contact support](https://www.linode.com/support/) to determine additional options or consider using multiple NodeBalancers behind a DNS load balancing solution such as [Round-Robin DNS](/docs/guides/setting-up-round-robin-dns/).
- **Connections per second:** There are no defined rate limits for the number of connections over a given time period, though certain modes are more performant. A port configured in **TCP** mode allows for the most number of connections. A port configured in **HTTPS** mode is the most resource intensive and accommodates fewer connections.
- **IP addresses:** A public IPv4 address and IPv6 address are configured on each NodeBalancer. Additional addresses are not available.
- **Private network:** Communication with backend Linodes occurs over a data center's private network. As such, backend Linodes must be located within the same data center as the NodeBalancer.
- **HTTP support:** HTTP/1.1 (HTTP/2 support is not yet available).
- **Network transfer:** *Outbound transfer* usage is counted towards the account-wide [monthly network transfer pool](/docs/products/platform/get-started/guides/network-transfer/). This pool is the combined total of the network transfer allowance of each Linode on the account. Both *Incoming transfer* and transfer over the private network are provided at no cost.
- **TLS termination:** When using a NodeBalancer with an application that requires HTTPS, you can either terminate the TLS connection on the NodeBalancer (**HTTPS** mode) or on the backend Linodes (**TCP** mode). When terminating TLS connections directly on the NodeBalancer, there are a few key considerations:
    - **TLS protocols:** TLS v1.2 and v1.3 are supported in **HTTPS** mode.
    - While operating in **HTTPS** mode, internal traffic sent to the backend Linodes will be unencrypted.

    For applications that require a very high connection rate or otherwise need to overcome the above considerations present in **HTTPS** mode, consider operating in **TCP** mode and terminating TLS on the backend Linodes.