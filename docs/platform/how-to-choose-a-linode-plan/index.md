---
author:
    name: Linode
    email: docs@linode.com
description: 'Decide which Linode plan is right for you.'
keywords: ["choose", "help", "plan", "size", "shared", "high memory", "dedicated", "dedicated CPU", "GPU instance"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-06-20
modified_by:
    name: Linode
published: 2019-02-04
title: How to Choose a Linode Plan
tags: ["linode platform"]
---

Linode offers four instance types: **Shared**, **High Memory**, **Dedicated CPU**, and **GPU Instances**. For all Linode Instance types, there are several hardware resource tiers, or plans, that you can choose from.

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

The different Linode instance types represent different balances of the above resources. Shared instances offer a general-purpose array of resources, High Memory instances favor higher memory allocations, Dedicated CPU instances reserve physical CPU cores for you, and GPU instances give you access to both dedicated CPU cores and are the only plan type that gives you access to a GPU.

At the same time, different kinds of applications have different resource requirements. Some applications may need to store a lot of data but require less processing power, some may need more memory than CPU, and some may be especially CPU-intensive. As a result, certain instance types can better serve certain applications. When creating your instances, consider what resources your application needs and then compare it with the resources specified by each of the instance types. The following sections include common use cases for each type, and one of these may resemble your needs.

Finally, a common strategy when setting up a new server is to start with a smaller instance and then resize your Linode if needed. At a minimum, you will need to choose a plan that offers enough disk space to store your data. For more information, see [Resizing a Linode](/docs/platform/disk-images/resizing-a-linode/). You can then [monitor](/docs/uptime/monitoring-and-maintaining-your-server-new-manager/) the CPU, GPU, memory, and network usage of your application to determine if you need more of those resources.

## 1. Shared

{{< content "about-shared-shortguide" >}}

### Use Cases

- [Websites](/docs/websites/) and web applications
- [Code repositories](/docs/development/version-control/)
- [Game servers](/docs/game-servers/)
- [Database servers](/docs/databases/)
- [Code repositories](/docs/development/version-control/)
- [Virtual private networks](/docs/networking/vpn/) (VPNs)
- [Container](/docs/applications/containers/) clusters
- Application and database clusters
- Content delivery network (CDN) nodes

### Base Plan

| Resource | Value |
| -------- | ----- |
| RAM | 1GB |
| CPU | 1 vCPU |
| Storage | 25 GB SSD Storage |
| Transfer | 1 TB |
| Network In | 40 Gbps |
| Network Out | 1000 Mbps |

To view a full list of the Shared instance plans, visit the [Linode Pricing](https://www.linode.com/pricing/) page.

## 2. High Memory

{{< content "about-highmem-shortguide" >}}

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

To view a full list of the High Memory instance plans, visit the [Linode Pricing](https://www.linode.com/pricing/) page.

## 3. Dedicated CPU

{{< content "about-dedicated-shortguide" >}}

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

To view a full list of the Dedicated CPU instance plans, visit the [Linode Pricing](https://www.linode.com/pricing/) page.

## 4. GPU Instances

{{< content "about-gpu-shortguide" >}}

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

To view a full list of the Dedicated CPU instance plans, visit the [Linode Pricing](https://www.linode.com/pricing/) page.

## Pricing

Think about pricing when considering which Linode plan is right for you. You can view all the pricing at [Linode Pricing](https://www.linode.com/pricing/).

You can also compare cost per month and save with Linode's predictable and transparent pricing with our [Cloud Estimator](https://www.linode.com/estimator/). Explore bundled compute, storage, and transfer packages against AWS, GCP, and Azure.

Migrating from on-premise or between cloud providers for hosting, cloud storage, or cloud computing? Use our [Total Cost of Ownership (TCO) cloud pricing calculator](https://www.linode.com/cloud-pricing-calculator/) to receive a full cost breakdown and technical recommendations.
