---
slug: choosing-a-compute-instance-plan
author:
    name: Linode
    email: docs@linode.com
description: "Get help deciding which Compute Instance type is right for your use case and learn how to select the most appropriate plan"
keywords: ["choose", "help", "plan", "size", "shared", "high memory", "dedicated", "dedicated CPU", "GPU instance"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2022-08-10
modified_by:
    name: Linode
published: 2019-02-04
title: "How to Choose a Compute Instance Plan"
h1_title: "Choosing a Compute Instance Type and Plan"
enable_h1: true
tags: ["linode platform"]
aliases: ['/platform/how-to-choose-a-linode-plan/','/guides/how-to-choose-a-linode-plan/']
---

Linode offers multiple Compute Instance types, each of which can be equipped with various amounts of resources. This allows you to create a Compute Instance tailored to the requirements of your application or workload. For example, some applications may need to store a lot of data but require less processing power. Others may need more memory than CPU. Some may be especially CPU-intensive and require more computing power.

This guide provides you with the information needed to select the most appropriate instance, helping you sort through all of Linode's offerings and land on the right one for the job.

{{< note >}}
You can easily change between instance types and plans on an existing Compute Instance at any time. Review the [Resizing a Linode](/docs/guides/resizing-a-linode/) for instructions.
{{< /note >}}

## Instance Types

These are the instance types offered by Linode:

- [Shared CPU instances](#shared-cpu-instances)
- [Dedicated CPU instances](#dedicated-cpu-instances)
- [High Memory instances](#high-memory-instances)
- [GPU instances](#gpu-instances)

They each have unique characteristics and their resources are optimized for different types of workloads. Learn about each of these instance types below, along with the resources provided and their suggested use cases.

Most of these plan types are equipped with dedicated CPU cores for maximum peak performance and competition-free resources, though the Shared CPU plan comes with shared CPU cores. To learn more about the differences, see [Choosing Between Shared and Dedicated CPUs (and Determining When to Upgrade)](/docs/guides/comparing-shared-and-dedicated-cpus/).

### Shared CPU Instances

**1 GB - 192 GB Memory, 1 - 32 Shared vCPU Cores, 25 GB - 2840 GB Storage**<br>
Starting at $5/mo ($0.0075/hour). See [Shared CPU Pricing](https://www.linode.com/pricing/#compute-shared) for a full list of plans, resources, and pricing.

[Shared CPU Instances](/docs/products/compute/shared-cpu/) offer a balanced array of resources coupled with shared CPU cores. These CPU cores can be used at 100% for short bursts, but should remain below 80% sustained usage on average. This keeps costs down while still supporting a wide variety of cloud applications. Your processes are scheduled on the same CPU cores as processes from other Compute Instances. This shared scheduling is done in a secure and performant manner. While Linode works to minimize competition for CPU resources between your instance and other instances on the same hardware, it's possible that high usage from neighboring instances can negatively impact the performance of your instance.

**Recommended Use Cases:**

*Best for development servers, staging servers, low traffic websites, personal blogs, and production applications that may not be affected by resource contention.*

- Medium to low traffic websites, such as for marketing content and blogs
- Forums
- Development and staging servers
- Low traffic databases
- Worker nodes within a container orchestration cluster

### Dedicated CPU Instances

**4 GB - 512 GB Memory, 2 - 64 Dedicated vCPUs, 80 GB - 7200 GB Storage**<br>
Starting at $30/mo ($0.045/hour). See [Dedicated CPU Pricing](https://www.linode.com/pricing/#compute-dedicated) for a full list of plans, resources, and pricing.

[Dedicated CPU Instances](/docs/products/compute/dedicated-cpu/) reserve physical CPU cores that you can utilize at 100% load 24/7 for as long as you need. This provides competition free guaranteed CPU resources and ensures your software can run at peak speed and efficiency. With Dedicated CPU instances, you can run your software for prolonged periods of maximum CPU usage, and you can ensure the lowest latency possible for latency-sensitive operations. These instances offer a perfectly balanced set of resources for most production applications.

**Recommended Use Cases:**

*Best for production websites, enterprise applications, high traffic databases, and any application that requires 100% sustained CPU usage or may be impacted by resource contention.*

- [CI/CD](/docs/guides/introduction-ci-cd/) toolchains and build servers
- [Game servers](/docs/game-servers/) (like Minecraft or Team Fortress)
- [Audio and video transcoding](/docs/applications/media-servers/)
- [Big data](/docs/applications/big-data/) (and data analysis)
- Scientific computing
- [Machine learning](/docs/guides/how-to-move-machine-learning-model-to-production/) and AI
- High Traffic Databases (Galera, PostgreSQL with Replication Manager, MongoDB using Replication Sets)
- Replicated or Distributed Filesystems (GlusterFS, DRBD)

### High Memory Instances

**24 GB - 300 GB Memory, 2 - 16 Dedicated vCPUs, 20 GB - 340 GB Storage**<br>
Starting at $60/mo ($0.09/hour). See [High Memory Pricing](https://www.linode.com/pricing/#compute-high-memory) for a full list of plans, resources, and pricing.

[High Memory Instances](/docs/products/compute/high-memory/) are optimized for memory-intensive applications and equipped with dedicated CPUs, which provide competition free guaranteed CPU resources. These instances feature higher RAM allocations and relatively fewer vCPUs and less storage. This keeps your costs down and provides power to memory-intensive applications.

**Recommended Use Cases:**

*Best for in-memory databases, in-memory caching systems, big data processing, and any production application that requires a large amount of memory while keeping costs down.*

- Any production application that requires large amounts of memory
- In-memory database caching systems, such as [Redis](https://redis.io/) and [Memcached](https://memcached.org/). These applications offer very fast retrieval of data, but they store data in a non-persistent manner (with some caveats). So, they are usually used in conjunction with another persistent database server running on a separate instance.
- In-memory databases, such as possible with [NoSQL](/docs/guides/what-is-nosql/) and [other solutions](https://en.wikipedia.org/wiki/List_of_in-memory_databases)
- [Big data processing](/docs/applications/big-data/) (and data analysis)

### GPU Instances

**32 GB - 128 GB Memory, 8 - 24 Dedicated vCPUs, 640 GB - 2560 GB Storage**<br>
Starting at $1000/mo ($1.50/hour). See [GPU Pricing](https://www.linode.com/pricing/#compute-gpu) for a full list of plans, resources, and pricing.

[GPU Instances](/docs/products/compute/gpu/) are the only instance type equipped with [NVIDIA Quadro RTX 6000 GPU cards](https://www.nvidia.com/content/dam/en-zz/Solutions/design-visualization/technologies/turing-architecture/NVIDIA-Turing-Architecture-Whitepaper.pdf) (up to 4) for on demand execution of complex processing workloads. These GPUs have CUDA cores, Tensor cores, and RT (Ray Tracing) cores. GPUs are designed to process large blocks of data in parallel, meaning that they are an excellent choice for any workload requiring thousands of simultaneous threads. With significantly more logical cores than a standard CPU, GPUs can perform computations that process large amounts of data in parallel more efficiently.

**Recommended Use Cases:**

*Best for applications that require massive amounts of parallel processing power, including machine learning, AI, graphics processing, and big data analysis.*

- [Machine Learning and AI](/docs/platform/linode-gpu/why-linode-gpu/#machine-learning-and-ai)
- [Big Data](/docs/platform/linode-gpu/why-linode-gpu/#big-data)
- [Video Encoding](/docs/platform/linode-gpu/why-linode-gpu/#video-encoding)
- [General Purpose Computing Using NVIDIA's CUDA Toolkit](/docs/platform/linode-gpu/why-linode-gpu/#general-purpose-computing-using-cuda)
- [Graphics Processing](/docs/platform/linode-gpu/why-linode-gpu/#graphics-processing)

## Compute Resources

When selecting a plan, it is important to understand the hardware resources allocated to your instance. These resources include the amount of vCPU cores, memory, storage space, network transfer, and more. Start by reviewing each resource below and the implications it may have for your application.

| Resource | Description |
| ---- | ----------- |
| Memory (RAM) | The working memory available for your server's processes. Your server stores information in memory that is needed to carry out its functions. Or, it caches data in memory for fast retrieval in the future, if it is likely that the data will be needed. Data stored in RAM is accessed faster than data stored in your Linode's disks, but it is not persistent storage. |
| vCPU Cores | The number of virtual CPUs (vCPUs) available to your server. Your software is often designed to execute its tasks across multiple CPUs in parallel. The higher your vCPU count, the more work you can perform simultaneously. Plans are also equipped with either shared CPU cores or dedicated CPU cores. Dedicated CPU cores allow your system to utilize 100% of your CPU resources at all times, while shared CPU cores require a lower sustained usage and may be affected by resource contention. See [Choosing Between Shared and Dedicated CPUs (and Determining When to Upgrade)](/docs/guides/comparing-shared-and-dedicated-cpus/). |
| Storage | Your server's built-in persistent storage. Large databases, media libraries, and other stores of files will require more storage space. Your Linode's storage is maintained on high-performance SSDs for fast access. You can also supplement your Linode's disks with extra [Block Storage Volumes](https://www.linode.com/blockstorage). |
| Transfer | The total amount of traffic your server can emit over the course of a month. Inbound traffic sent to your Linode does not count against your transfer quota. If you exceed your quota, your service will not be shut off; instead, an overage will be billed. Review the [Network Transfer Quota](/docs/guides/network-transfer/) guide for more information about how transfer works. |
| Network In | The maximum bandwidth for inbound traffic sent to your Linode. The bandwidth you observe will also depend on other factors, like the geographical distance between you and your Linode and the bandwidth of your local ISP. For help with choosing a data center that will feature the lowest latency and best bandwidth, review the [How to Choose a Data Center](/docs/guides/how-to-choose-a-data-center/) guide. |
| Network Out | The maximum bandwidth for outbound traffic emitted by your Linode. The bandwidth you observe will also depend on other factors, like the geographical distance between you and your Linode and the bandwidth of your local ISP. For help with choosing a data center that will feature the lowest latency and best bandwidth, review the [How to Choose a Data Center](/docs/guides/how-to-choose-a-data-center/) guide.
| GPU | GPU's, or Graphical Processing Units are specialized hardware units only available on our GPU instances. Originally designed to manipulate computer graphics and handle image processing, GPUs are now commonly also used for many compute intensive tasks that require thousands of simultaneous threads and the higher number of logical cores that a CPU can not provide alone.

## Pricing

If you run a business, you likely need to think about pricing when considering which plan is right for you. You can view all the pricing at [Linode Pricing](https://www.linode.com/pricing/). You can also compare cost per month and save with Linode's predictable and transparent pricing with our [Cloud Estimator](https://www.linode.com/estimator/). Explore bundled compute, storage, and transfer packages against AWS, GCP, and Azure.

Migrating from on-premise or between cloud providers for hosting, cloud storage, or cloud computing? Use our [Total Cost of Ownership (TCO) cloud pricing calculator](https://www.linode.com/cloud-pricing-calculator/) to receive a full cost breakdown and technical recommendations.
