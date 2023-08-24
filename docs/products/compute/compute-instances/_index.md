---
title: Compute Instances
title_meta: "Compute Instance Product Documentation"
description: "Host your workloads on Linode's secure and reliable cloud infrastructure using Compute Instances, versatile Linux-based virtual machines."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2023-01-18
    product_description: "Linux virtual machines equipped with a tailored set of resources designed to run any cloud-based workload."
modified: 2023-03-22
---

{{< content "new-data-center-notice" >}}

Compute Instances are virtual machines that run on Linode's secure and reliable cloud infrastructure. To support a variety of workloads, Compute Instance plans are organized under several basic plan types, each with their own set of resources, unique value propositions, and technical specifications (see [Plan Types](/docs/products/compute/compute-instances/plans/)). Each Compute Instance can run a variety of [supported Linux distributions](/docs/products/compute/compute-instances/guides/distributions/), including the latest versions of Ubuntu, CentOS Stream, Debian, and more.

## Availability

Compute Instances are available across [all regions](https://www.linode.com/global-infrastructure/).

## Plans and Pricing

{{< content "instance-comparison-shortguide" >}}

## Technical Specifications

In addition to the resources allocated to each available plan (outlined above), Compute Instances have the following specifications:

- Shared or Dedicated vCPU cores (dependent on the chosen plan)
- 100% SSD (Solid State Disk) storage
- 40 Gbps inbound network bandwidth
- Free inbound network transfer (ingress)
- Metered outbound network transfer (egress) that includes 1 TB - 20 TB of prorated* network transfer allowance
- Dedicated IPv4 and IPv6 addresses (additional addresses available on request)
- Deploy using the many available [Linux Distributions](https://www.linode.com/distributions/), [Marketplace Apps](https://www.linode.com/marketplace/), or Community [StackScripts](https://www.linode.com/products/stackscripts/)
- Direct console access through [Lish](/docs/products/compute/compute-instances/guides/lish/)
- Provisioning and management through the [Cloud Manager](https://cloud.linode.com/), [Linode CLI](https://www.linode.com/products/cli/), or programmatically through the [Linode API](https://www.linode.com/products/linode-api/)
- [Multi-queue NIC](/docs/products/compute/compute-instances/guides/multiqueue-nic/) support on plans with 2 or more vCPU cores.

\**If a service is not active for the entire month, the amount of network transfer allowance is prorated based on the number of hours the service is active.*

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