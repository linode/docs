---
title: "Premium Compute Instances"
linkTitle: "Premium"
description: "Premium instances guarantee a minimum hardware class utilizing the latest available AMD Epyc™ CPUs, providing consistent high-peformance for your workloads."
published: 2023-07-06
---

Premium Compute Instances are virtual machines that come equipped with the latest AMD Epyc™ CPUs, ensuring your applications are running on the latest hardware with consistent high-peformance. Premium instances build off of our [Dedicated CPU instances](/docs/products/compute/compute-instances/plans/dedicated-cpu/), offering similar plan resources but with a guaranteed minimum hardware model.

**Premium plans are ideal for enterprise-grade, business-critical, and latency-sensitive applications, including any workload that benefits from consistent performance with the latest hardware.**

{{< note >}}
Premium instances are not currently available in all regions. Review the [Availability](#availability) section to learn which data centers can be used to deploy Premium instances.
{{< /note >}}

## Latest Hardware

The key differentiator for Premium instances is its guaranteed minimum hardware class, which ensures your workloads run on the latest AMD Epyc™ CPUs. To learn more about AMD CPUs on the Linode platform, review the [AMD page](https://www.linode.com/amd/). This outlines CPU models, benefits of AMD processors, and the CPU models that are available across our fleet.

## Dedicated Competition-Free Resources

CPU cores on a Premium instance are accessible only to that instance (not other instances on the same hardware). Because the vCPU cores are not shared, no other Compute Instances can utilize them. Your instance never has to wait for another process, enabling your software to run at peak speed and efficiency. This allows you to run workloads that require full-duty work (100% CPU all day, every day) at peak performance.

## Recommended Workloads

Premium Compute Instances are suitable for workloads that benefit a balanced set of resources and consistent performance. This includes:

- Enterprise-grade production applications
- [Audio and video transcoding](/docs/applications/media-servers/)
- [Big data](/docs/applications/big-data/) (and data analysis)
- Scientific computing
- [Machine learning](/docs/guides/how-to-move-machine-learning-model-to-production/) and AI

## Availability

Premium Compute Instances are currently available in select data centers.

| Data center | Status |
| -- | -- |
| Atlanta (Georgia, USA) | *Not available* |
| **Chicago (Illinois, USA)** | **Available** |
| Dallas (Texas, USA) | *Not available* |
| Frankfurt (Germany) | *Not available* |
| Fremont (California, USA) | *Not available* |
| London (United Kingdom) | *Not available* |
| Mumbai (India) | *Not available* |
| Newark (New Jersey, USA) | *Not available* |
| **Paris (France)** | **Available** |
| Singapore | *Not available* |
| Sydney (Australia) | *Not available* |
| Tokyo (Japan) | *Not available* |
| Toronto (Canada) | *Not available* |
| **Washington, DC (USA)** | **Available** |

## Plans and Pricing

| Resource | Available Plans |
| -- | -- |
| vCPU cores | 2-64 cores |
| Memory | 4 GB - 512 GB |
| Storage | 80 GB - 7,200 GB |
| Outbound Network Transfer | 4 TB - 12 TB |
| Outbound Network Bandwidth | 4 Gbps - 12 Gbps |

Pricing starts at $43 for a Premium Compute Instance with 2 vCPU cores, 4GB memory, and 80GB SSD storage. Review the [Pricing page](https://www.linode.com/pricing/) for additional plans and their associated costs. Review the [Compute Instance Plan Types](/docs/products/compute/compute-instances/plans/) page below to learn more about other instance types.