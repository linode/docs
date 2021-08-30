---
title: Dedicated CPU Instances
linkTitle: Dedicated CPU
toc: true
description: "Dedicated CPU Linodes offer a complement to CPU intensive tasks and offer competition-free resources."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2020-06-02
    product_description: "Dedicated CPU Compute Instances are virtual machines that provide gauranteed CPU resources. They are ideal for a variety of production applications and CPU-intensive workloads."
    product_description: "Virtual machines that provide dedicated CPU resources. Ideal for production and CPU-intensive workloads."
---

Dedicated CPU Compute Instances are virtual machines that provide you with dedicated CPU resources. Their vCPU cores are guaranteed (and, thus, competition-free) so their are no surprises or CPU-related performance degradation. This enables you to run your production applications with confidence that your performance won't be impacted by others. These Compute Instances are CPU-omptimized and can sustain CPU resource usage at 100% for as long as your workloads need.

**Dedicated CPU plans are ideal for nearly all production applications and CPU-intensive workloads, including high traffic websites, video encoding, machine learning, and data processing.** If your application would benefit from dedicated CPU cores as well as a larger amounts of memory, see [High Memory Compute Instances](/docs/products/compute/high-memory/).

## Availability

Dedicated CPU instances are available across [all regions](https://www.linode.com/global-infrastructure/).

## Plans and Pricing

| Resource | Available Plans |
| -- | -- |
| *Dedicated* vCPU cores | 2-64 cores |
| Memory | 4GB - 512GB |
| Storage | 80GB - 7200 GB |

Pricing starts at $30 for a Dedicated CPU Compute Instance with 2 vCPU cores, 4GB memory, and 80GB SSD storage. Review the [Pricing page](https://www.linode.com/pricing/#compute-dedicated) for additional plans and their associated costs.

## Dedicated Competition-Free Resources

A Dedicated CPU Compute Instance provides entire vCPU cores accessible only to you. Because the vCPU cores are not shared, no other Compute Instances can utilize them. Your instance never has to wait for another process, enabling your software to run at peak speed and efficiency. This allows you to run workloads that require full-duty work (100% CPU all day, every day) at top performance.

## Recommended Workloads

- Production websites and applications, especially those that might be negatively impacted by resource contention.
- Applications that required 100% sustained CPU usage.
- [CI/CD](/docs/development/ci/introduction-ci-cd/) toolchains and build servers
- CPU-intensive [game servers](/docs/game-servers/), like Minecraft or Team Fortress
- [Audio and video transcoding and streaming](/docs/applications/media-servers/)
- [Big data](/docs/applications/big-data/) and data analysis
- Scientific computing
- [Machine learning](/docs/applications/big-data/how-to-move-machine-learning-model-to-production/)

    {{< note >}}
For more information on Dedicated CPU use cases, see our [Use Cases for Dedicated CPU Instances](/docs/platform/dedicated-cpu/dedicated-cpu-use-cases/).
{{< /note >}}

## Features Common to All Compute Instances

- Predictable hourly and monthly pricing (see [Billing and Payments](/docs/guides/how-linode-billing-works/)).
- Blazing fast **SSD storage**.
- Free inbound network transfer and ample outbound transfer (see [Network Transfer Quota](/docs/guides/network-transfer-quota/)).
- Always-on [DDoS Protection](https://www.linode.com/products/ddos/)
- Can be provisioned and managed through the [Cloud Manager](https://cloud.linode.com/), [Linode CLI](https://www.linode.com/products/cli/), or programmatically through the [Linode API](https://www.linode.com/products/linode-api/).
- Access to our [DNS Manager](https://www.linode.com/products/dns-manager/) at no additional charge.
- Compatible with other Linode services, including Backups, Block Storage, Cloud Firewalls, Custom Images, NodeBalancers, VLAN private networks, and more.