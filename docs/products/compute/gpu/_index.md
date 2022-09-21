---
title: GPU
description: "GPU Linodes offer on-demand computational power on market leading hardware."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
    product_description: "Virtual machines equipped with NVIDIA Quadro GPUs. Ideal for complex processing and GPU-optimized workloads."
---

Scientists, artists, and engineers need access to significant parallel computational power. Linode offers GPU-optimized virtual machines accelerated by the NVIDIA Quadro RTX 6000, harnessing the power of CUDA, Tensor, and RT cores to execute complex processing, deep learning, and ray tracing workloads.

**GPU plans are ideal for highly specialized workloads that would benefit from dedicated NVIDIA GPUs, including maching learning, AI, and data/graphics processing.**

## On-demand

Between purchasing, installing, and maintaining GPUs, the cost of ownership is often high. Linode GPUs allow you to leverage the power of GPUs while benefiting from the main value proposition of cloud: turning a CapEx into an OpEx.

## Market Leading Hardware

Linode GPUs are NVIDIA Quadro RTX 6000 units, currently considered one of the best in market GPUs. With CUDA, Tensor, and RT cores in each unit, these GPUs support any use cases associated with parallel processing, deep learning, or ray tracing.

One GPU card isn’t enough for your projected workloads? Not a problem. Linode GPU plans offer up to four cards per instance, depending on how much horsepower you need.

## Dedicated Competition-Free Resources

A GPU Compute Instance's vCPU cores are dedicated and accessible only to you. Because the vCPU cores are not shared, no other Compute Instances can utilize them. Your instance never has to wait for another process, enabling your software to run at peak speed and efficiency. This allows you to run workloads that require full-duty work (100% CPU all day, every day) at peak performance.

## Recommended Workloads

GPU Compute Instances are suitable for specialized workloads that are optimized for GPUs:

- Machine learning and AI
- Big data processing
- Video encoding
- Graphics processing

See the [Use Cases for Linode GPU Instances](/docs/products/compute/gpu/guides/use-cases/) guide to learn more about these use cases.

## Availability

Atlanta, GA, United States; Frankfurt, Germany; Newark, NJ, United States; Mumbai, India; Singapore, Singapore

## Plans and Pricing

| Resource | Available Plans |
| -- | -- |
| GPU cards | 1-4 cards |
| vCPU cores | 8-24 cores |
| Memory | 32 GB - 128 GB |
| Storage | 640 GB - 2560 GB |
| Outbound Network Transfer | 16 TB - 20 TB |
| Outbound Network Bandwidth | 10 Gbps |

Pricing starts at $1,000/mo ($1.50/hr) for a GPU Instance with 1 GPU card, 8 vCPU cores, 32 GB of memory, and 640 GB of SSD storage. Review the [Pricing page](https://www.linode.com/pricing/#row--compute) for additional plans and their associated costs. See the [Comparison of Compute Instances](#comparison-of-compute-instances) section below to learn more about other Instance types.

{{< content "gpu-deposit-shortguide" >}}

## Additional Technical Specifications

In addition to the resources allocated to each available plan (outlined above), GPU Compute Instances have the following specifications:

- NVIDIA Quadro RTX 6000 GPUs
- Dedicated vCPU cores
- 100% SSD (Solid State Disk) storage
- 40 Gbps inbound network bandwidth
- Free inbound network transfer
- Dedicated IPv4 and IPv6 addresses (additional addresses available on request)
- Deploy using the many available [Linux Distributions](https://www.linode.com/distributions/), [Marketplace Apps](https://www.linode.com/marketplace/), or Community [StackScripts](https://www.linode.com/products/stackscripts/)
- Direct console access through [Lish](/docs/guides/using-the-lish-console/)
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