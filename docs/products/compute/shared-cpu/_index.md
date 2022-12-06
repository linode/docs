---
title: Shared CPU
description: "Shared CPU Compute Instances offer an international content delivery network (CDN) and several plan choices so you can find the best price and performance for your workloads."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
    product_description: "Balanced and affordable virtual machines equipped with shared CPU resources. Ideal for general workloads."
aliases: ['/products/compute/shared-linodes/']
---

Shared CPU Compute Instances are our most affordable virtual machines that offer a significant price-to-performance ratio. They provide a well balanced set of resources that are ideal for a wide range of applications. While most of our other Compute Instance types are equipped with dedicated CPUs, Shared Instances are not. This means that CPU resources are shared with other Compute Instances and a small amount of resource contention is possible.

**Shared plans are ideal for development servers, staging servers, low traffic websites, personal blogs, and production applications that may not be affected by resource contention.**

## Recommended Workloads

Shared CPU Compute Instances are suitable for general workloads that value cost over maximum performance:

- Production applications with low to medium CPU requirements and are not affected by resource contention
- Applications that require a balanced set of resources
- Medium to low traffic websites, such as for marketing content and blogs
- Forums
- Development and staging servers
- Low traffic databases
- Worker nodes within a container orchestration cluster

## Availability

Shared CPU instances are available across [all regions](https://www.linode.com/global-infrastructure/).

## Plans and Pricing

| Resource | Available Plans |
| -- | -- |
| vCPU cores | 1-32 cores |
| Memory | 1 GB - 192 GB |
| Storage | 25 GB - 3840 GB |
| Outbound Network Transfer | 1 TB - 20 TB |
| Outbound Network Bandwidth | 1 Gbps - 12 Gbps |

Pricing starts at $5 for a Shared CPU Compute Instance with 1 vCPU core, 1 GB of memory, and 25 GB of SSD storage. Review the [Pricing page](https://www.linode.com/pricing/#row--compute) for additional plans and their associated costs. See the [Comparison of Compute Instances](#comparison-of-compute-instances) section below to learn more about other Instance types.

## Additional Technical Specifications

In addition to the resources allocated to each available plan (outlined above), Shared CPU Compute Instances have the following specifications:

- Shared vCPU cores
- 100% SSD (Solid State Disk) storage
- 40 Gbps inbound network bandwidth
- Free inbound network transfer
- Dedicated IPv4 and IPv6 addresses (additional addresses available on request)
- Deploy using the many available [Linux Distributions](https://www.linode.com/distributions/), [Marketplace Apps](https://www.linode.com/marketplace/), or Community [StackScripts](https://www.linode.com/products/stackscripts/)
- Direct console access through [Lish](/docs/guides/lish/)
- Provisioning and management through the [Cloud Manager](https://cloud.linode.com/), [Linode CLI](https://www.linode.com/products/cli/), or programmatically through the [Linode API](https://www.linode.com/products/linode-api/)
- [Multi-queue NIC](/docs/guides/multiqueue-nic/) support on plans with 2 or more vCPU cores.

## Services Included at No Extra Cost

Linode bundles the following services with all Compute Instances:

- Always-on [DDoS Protection](https://www.linode.com/products/ddos/)
- Domain management through our [DNS Manager](https://www.linode.com/products/dns-manager/)
- Seamless firewall management with [Cloud Firewalls](https://www.linode.com/products/cloud-firewall/)
- Private Layer 2 networks with [VLANs](https://www.linode.com/products/vlan/)
- Metrics and monitoring through the [Cloud Manager](https://www.linode.com/products/monitoring/) and [Longview](/docs/guides/linode-longview-pricing-and-plans/) (free plan)
- Reusable deployment scripts through [StackScripts](https://www.linode.com/products/stackscripts/)

## Complementary Paid Services

To help build and manage your applications, consider complementing your Compute Instance with the following compatible services:

- Automated daily and weekly backups with our [Backups service](https://www.linode.com/products/backups/)
- Add additional storage drives with [Block Storage](https://www.linode.com/products/block-storage/)
- Create and store reusable images with [Custom Images](https://www.linode.com/products/images/)
- Advanced metrics and monitoring through [Longview Pro](/docs/guides/what-is-longview/)
- Automated service deployments with [LKE (Linode Kubernetes Engine)](https://www.linode.com/products/kubernetes/)
- Incident response (and more) with [Managed Services](https://www.linode.com/products/managed/)
- Enable load balancing and horizontal scaling with [NodeBalancers](https://www.linode.com/products/nodebalancers/)
- Add scalable storage to your application with [Object Storage](https://www.linode.com/products/object-storage/)

## Comparison of Compute Instances

{{< content "instance-comparison-shortguide" >}}