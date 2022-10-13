---
title: Dedicated CPU Instances
linkTitle: Dedicated CPU
toc: true
description: "Dedicated CPU Compute Instances are virtual machines that provide gauranteed CPU resources. They are ideal for a variety of production applications and CPU-intensive workloads."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
    product_description: "Virtual machines that provide dedicated CPU resources. Ideal for production and CPU-intensive workloads."
---

Dedicated CPU Compute Instances are virtual machines that provide you with dedicated CPU resources. Their vCPU cores are guaranteed (and, thus, competition-free) so there are no surprises or CPU-related performance degradation. This enables you to run your production applications with confidence that your performance won't be impacted by others. These Compute Instances are CPU-omptimized and can sustain CPU resource usage at 100% for as long as your workloads need.

**Dedicated CPU plans are ideal for nearly all production applications and CPU-intensive workloads, including high traffic websites, video encoding, machine learning, and data processing.** If your application would benefit from dedicated CPU cores as well as a larger amounts of memory, see [High Memory Compute Instances](/docs/products/compute/high-memory/).

## Dedicated Competition-Free Resources

A Dedicated CPU Compute Instance provides entire vCPU cores accessible only to you. Because the vCPU cores are not shared, no other Compute Instances can utilize them. Your instance never has to wait for another process, enabling your software to run at peak speed and efficiency. This allows you to run workloads that require full-duty work (100% CPU all day, every day) at peak performance.

## Upgrading from a Shared CPU Instance

Moving from a Shared CPU Instance to a Dedicated CPU Instance is a seamless process that can positively impact your applications and users. Review the [Choosing Between Shared and Dedicated CPUs (and Determining When to Upgrade)](/docs/guides/comparing-shared-and-dedicated-cpus/) guide to learn more about the differences between Shared and Dedicated CPU plans and when each one might be appropriate. This guide also shows you how to investigate your CPU performance to determine if your application is experiencing resource contention on a Shared CPU Compute Instance. If you wish to upgrade, reference the [Resizing a Linode](/docs/guides/resizing-a-linode/) guide for more details on resizing your Linode to a different plan type.

## Recommended Workloads

Dedicated CPU Compute Instances are suitable for almost any workload that requires consistently high performant CPU resources. This includes:

- Production websites and e-commerce sites
- Applications that required 100% sustained CPU usage.
- Applications that might be impacted by resource contention.
- [CI/CD](/docs/guides/introduction-ci-cd/) toolchains and build servers
- [Game servers](/docs/game-servers/) (like Minecraft or Team Fortress)
- [Audio and video transcoding](/docs/applications/media-servers/)
- [Big data](/docs/applications/big-data/) (and data analysis)
- Scientific computing
- [Machine learning](/docs/guides/how-to-move-machine-learning-model-to-production/) and AI
- High Traffic Databases (Galera, PostgreSQL with Replication Manager, MongoDB using Replication Sets)
- Replicated or Distributed Filesystems (GlusterFS, DRBD)

For more details and use cases, see the [Use Cases for Dedicated CPU Instances](/docs/guides/dedicated-cpu-use-cases/) guide.

## Availability

Dedicated CPU instances are available across [all regions](https://www.linode.com/global-infrastructure/).

## Plans and Pricing

| Resource | Available Plans |
| -- | -- |
| vCPU cores | 2-64 cores |
| Memory | 4 GB - 512 GB |
| Storage | 80 GB - 7200 GB |
| Outbound Network Transfer | 4 TB - 12 TB |
| Outbound Network Bandwidth | 4 Gbps - 12 Gbps |

Pricing starts at $30 for a Dedicated CPU Compute Instance with 2 vCPU cores, 4GB memory, and 80GB SSD storage. Review the [Pricing page](https://www.linode.com/pricing/#compute-dedicated) for additional plans and their associated costs. See the [Comparison of Compute Instances](#comparison-of-compute-instances) section below to learn more about other Instance types.

## Additional Technical Specifications

In addition to the resources allocated to each available plan (outlined above), Dedicated CPU Compute Instances have the following specifications:

- Dedicated vCPU cores
- 100% SSD (Solid State Disk) storage
- 40 Gbps inbound network bandwidth
- Free inbound network transfer
- Dedicated IPv4 and IPv6 addresses (additional addresses available on request)
- Deploy using the many available [Linux Distributions](https://www.linode.com/distributions/), [Marketplace Apps](https://www.linode.com/marketplace/), or Community [StackScripts](https://www.linode.com/products/stackscripts/)
- Direct console access through [Lish](/docs/guides/using-the-lish-console/)
- Provisioning and management through the [Cloud Manager](https://cloud.linode.com/), [Linode CLI](https://www.linode.com/products/cli/), or programmatically through the [Linode API](https://www.linode.com/products/linode-api/)
- [Multi-queue NIC](/docs/guides/multiqueue-nic/) support

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