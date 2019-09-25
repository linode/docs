---
author:
    name: Linode
    email: docs@linode.com
description: 'Decide which Linode plan is right for you.'
keywords: ["choose", "help", "plan", "size", "nanode", "standard", "high memory", "dedicated", "dedicated CPU", "GPU instance"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-06-20
modified_by:
    name: Linode
published: 2019-02-04
title: How to Choose a Linode Plan
---

Linode offers five instance types: **Nanode**, **Standard**, **High Memory**, **Dedicated CPU**, and **GPU Instances**. For the Standard, High Memory, Dedicated CPU, and GPU Instance types, there are several hardware resource tiers, or plans, that you can choose from.

When selecting a plan, it is important to understand the hardware resources allocated to your instance, like CPU, transfer, storage, and RAM. An understanding of your project's own needs and requirements is also useful. This guide provides an overview of all Linode instance types and plans, their corresponding use cases, and how to choose which one is right for you.

{{< note >}}
You can easily change between instance types and plans on an existing Linode at any time. Review the [Resizing a Linode](/docs/platform/disk-images/resizing-a-linode/) for instructions.
{{< /note >}}

## Hardware Resource Definitions

Start by reviewing what each resource means for your application. If you're confident in your understanding of these concepts, please feel free to skip ahead.

| Resource | Description |
| ---- | ----------- |
| RAM | The working memory available for your server's processes. Your server stores information in memory that is needed to carry out its functions. Or, it caches data in memory for fast retrieval in the future, if it is likely that the data will be needed. Data stored in RAM is accessed faster than data stored in your Linode's disks, but it is not persistent storage. |
| CPU | The number of virtual CPUs (vCPUs) available to your server. Your software is often designed to execute its tasks across multiple CPUs in parallel. The higher your vCPU count, the more work you can perform simultaneously. |
| Storage | Your server's built-in persistent storage. Large databases, media libraries, and other stores of files will require more storage space. Your Linode's storage is maintained on high-performance SSDs for fast access. You can also supplement your Linode's disks with extra [Block Storage Volumes](https://www.linode.com/blockstorage). |
| Transfer | The total amount of traffic your server can emit over the course of a month. Inbound traffic sent to your Linode does not count against your transfer quota. If you exceed your quota, your service will not be shut off; instead, an overage will be billed. Review the [Network Transfer Quota](/docs/platform/billing-and-support/network-transfer-quota/) guide for more information about how transfer works. |
| Network In | The maximum bandwidth for inbound traffic sent to your Linode. The bandwidth you observe will also depend on other factors, like the geographical distance between you and your Linode and the bandwidth of your local ISP. For help with choosing a data center that will feature the lowest latency and best bandwidth, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center/) guide. |
| Network Out | The maximum bandwidth for outbound traffic emitted by your Linode. The bandwidth you observe will also depend on other factors, like the geographical distance between you and your Linode and the bandwidth of your local ISP. For help with choosing a data center that will feature the lowest latency and best bandwidth, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center/) guide.
| GPU | GPU's, or Graphical Processing Units are specialized hardware units only available on our GPU instances. Originally designed to manipulate computer graphics and handle image processing, GPUs are now commonly also used for many compute intensive tasks that require thousands of simultaneous threads and the higher number of logical cores that a CPU can not provide alone.
## General Principles when Choosing a Plan

The different Linode instance types represent different balances of the above resources. Nanode and Standard instances offer a general-purpose array of resources, High Memory instances favor higher memory allocations, Dedicated CPU instances reserve physical CPU cores for you, and GPU instances give you access to both dedicated CPU cores and are the only plan type that gives you access to a GPU.

At the same time, different kinds of applications have different resource requirements. Some applications may need to store a lot of data but require less processing power, some may need more memory than CPU, and some may be especially CPU-intensive. As a result, certain instance types can better serve certain applications. When creating your instances, consider what resources your application needs and then compare it with the resources specified by each of the instance types. The following sections include common use cases for each type, and one of these may resemble your needs.

Finally, a common strategy when setting up a new server is to start with a smaller instance and then resize your Linode if needed. At a minimum, you will need to choose a plan that offers enough disk space to store your data. For more information, see [Resizing a Linode](/docs/platform/disk-images/resizing-a-linode/). You can then [monitor](/docs/uptime/monitoring-and-maintaining-your-server-new-manager/) the CPU,    GPU, memory, and network usage of your application to determine if you need more of those resources.

## 1. Nanode

The Nanode instance is a great place to begin if you are new to the world of cloud hosting and are unsure of your requirements. The Nanode offers the essentials and costs $5/month. With this instance you have a fully functioning server with your preferred Linux distribution.

### Use Cases

- Personal projects
- Portfolio [websites](/docs/websites/)
- Small self-hosted services
- Small [code repositories](/docs/development/version-control/)
- [Virtual private networks](/docs/networking/vpn/) (VPNs)
- Prototypes and proof-of-concept demonstrations

### Resource Specifications

| Resource | Value |
| -------- | ----- |
| RAM | 1GB |
| CPU | 1 vCPU |
| Storage | 25 GB SSD Storage |
| Transfer | 1 TB |
| Network In | 40 Gbps |
| Network Out | 1000 Mbps |

## 2. Standard

Standard instances start with 2GB of RAM and 1 vCPU and can go all the way up to 192GB of RAM with 32 vCPUs. These instances offer a balanced array of resources and can support a wide range of modern cloud applications, from personal projects to production deployments of an enterprise application.

### Use Cases

- Web applications and [websites](/docs/websites/)
- [Game servers](/docs/game-servers/)
- [Database servers](/docs/databases/)
- [Code repositories](/docs/development/version-control/)
- Corporate [VPNs](/docs/networking/vpn/)
- [Container](/docs/applications/containers/) clusters
- Application and database clusters
- Content delivery network (CDN) nodes

### Base Plan

| Resource | Value |
| -------- | ----- |
| RAM | 2GB |
| CPU | 1 vCPU |
| Storage | 50 GB SSD Storage |
| Transfer | 2 TB |
| Network In | 40 Gbps |
| Network Out | 2000 Mbps |

To view a full list of the Standard instance plans, visit the [Linode Pricing](https://www.linode.com/pricing#all) page.

## 3. High Memory

High Memory instances feature higher RAM allocations and relatively fewer vCPUs and less storage. This keeps your costs down and provides power to memory-intensive applications.

### Use Cases

Two primary applications for High Memory instances are in-memory caches and in-memory databases, like [Memcached](https://memcached.org) and [Redis](https://redis.io). These applications offer very fast retrieval of data, but they store data in a non-persistent manner (with some caveats). So, they are usually used in conjunction with another persistent database server running on a separate instance.

The kinds of data you might store in one of these applications includes: information about your users' sessions; frequently-requested pages on your website; and data that needs to be computed (for example, the average rating of a product on a retail store's site).

### Base Plan

| Resource | Value |
| -------- | ----- |
| RAM | 24GB |
| CPU | 1 vCPU |
| Storage | 20 GB SSD Storage |
| Transfer | 5 TB  |
| Network In | 40 Gbps |
| Network Out | 5000 Mbps |

To view a full list of the High Memory instance plans, visit the [Linode Pricing](https://www.linode.com/pricing#all) page.

## 4. Dedicated CPU

Dedicated CPU instances offer entire dedicated CPU cores for your own Linode's use. No other instances can run processes on the same cores that you're using, which means that your software can run at peak speed and efficiency.

Under the Nanode, Standard, and High Memory instances, your processes are scheduled on the same CPU cores as the processes from other servers. This shared scheduling is done in a secure and performant manner, and Linode works to minimize competition for CPU resources between your server and other servers, but the Dedicated CPU instances provide an environment with zero competition. With Dedicated CPU instances, you can run your software for prolonged periods of maximum CPU usage, and you can ensure the lowest latency possible for latency-sensitive operations.

### Dedicated CPUs and the Linode API

Some data analysis and processing tasks are well-suited for Dedicated CPU instances. For these workloads, you may only need your Dedicated CPU instance until the task is finished, at which point you can remove the instance.

Furthermore, some CPU-intensive tasks may be triggered from other events in your workflow. For example, if you're a software developer that uses continuous integration and delivery (CI/CD) tools, those tools are generally run whenever you push code to your repository. By leveraging the [Linode API](https://developers.linode.com), you can programmatically create a Dedicated CPU instance, run these tools, and destroy the instance on every code push.

### Use Cases

- [CI/CD](/docs/development/ci/introduction-ci-cd/) toolchains and build servers
- CPU-intensive [game servers](/docs/game-servers/), like Minecraft or Team Fortress
- [Audio and video](/docs/applications/media-servers/) transcoding and streaming
- [Big data](/docs/applications/big-data/) and data analysis
- Scientific computing
- [Machine learning](/docs/applications/big-data/how-to-move-machine-learning-model-to-production/)

### Base Plan

| Resource | Value |
| -------- | ----- |
| RAM | 4GB |
| vCPU    | 2 vCPUs |
| Storage | 80 GB SSD Storage |
| Transfer | 4 TB |
| Network In | 40 Gbps |
| Network Out | 4000 Mbps |

To view a full list of the Dedicated CPU instance plans, visit the [Linode Pricing](https://www.linode.com/pricing#all) page.

## 5. GPU Instances

GPU instances are the only plan that give you access to [NVIDIA Quadro RTX 6000 GPU cards](https://www.nvidia.com/content/dam/en-zz/Solutions/design-visualization/technologies/turing-architecture/NVIDIA-Turing-Architecture-Whitepaper.pdf) with Tensor, ray tracing (RT), and CUDA cores. GPUs are designed to process large blocks of data in parallel, meaning that they are an excellent choice for any workload requiring thousands of simultaneous threads. With significantly more logical cores than a standard CPU, GPUs can perform computations that process large amounts of data in parallel more efficiently.

### Use Cases

- [Machine Learning and AI](/docs/platform/linode-gpu/why-linode-gpu/#machine-learning-and-ai)
- [Big Data](/docs/platform/linode-gpu/why-linode-gpu/#big-data)
- [Video Encoding](/docs/platform/linode-gpu/why-linode-gpu/#video-encoding)
- [General Purpose Computing Using NVIDIA's CUDA Toolkit](/docs/platform/linode-gpu/why-linode-gpu/#general-purpose-computing-using-cuda)
- [Graphics Processing](/docs/platform/linode-gpu/why-linode-gpu/#graphics-processing)

### Base Plan

| Resource | Value |
| -------- | ----- |
| RTX6000 GPU | 1 GPU |
| RAM | 32GB |
| vCPU    | 8 vCPUs |
| Storage | 640 GB SSD Storage |
| Transfer | 16 TB |
| Network In | 40 Gbps |
| Network Out | 100000 Mbps |

To view a full list of the Dedicated CPU instance plans, visit the [Linode Pricing](https://www.linode.com/pricing#all) page.
