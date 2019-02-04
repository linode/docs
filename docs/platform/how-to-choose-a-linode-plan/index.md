---
author:
    name: Linode
    email: docs@linode.com
description: 'Decide which Linode plan is right for you.'
keywords: ["choose", "help", "plan", "size", "nanode", "standard", "high memory", "dedicated", "dedicated CPU"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-02-06
modified_by:
    name: Linode
published: 2019-02-06
title: How to Choose a Linode Plan
---

Linode offers four instance types: **Nanode**, **Standard**, **High Memory**, and **Dedicated CPU**. When selecting a plan, it is important to understand each instances specifications, like CPU, transfer, storage, and RAM. An understanding of your project's own needs and requirements is also useful. This guide provides an overview of all Linode instance types, their corresponding use cases, and how to choose which one is right for you.

{{< note >}}
You can easily change between instances on an existing Linode at any time. View the [Resizing a Linode](/docs/platform/disk-images/resizing-a-linode/) guide to learn how to change your plan type.
{{< /note >}}

## Definition of Specifications

Start by reviewing what each specification means for your application. If you're confident in your understanding of these concepts, please feel free to skip ahead.

| Specification | Description |
| ---- | ----------- |
| RAM | The working memory available for your server's processes. Your server stores information in memory that is needed to carry out its functions. Or, it caches data in memory for fast retrieval in the future, if it is likely that the data will be needed. Data stored in RAM is accessed faster than data stored in your Linode's disks, but it is not persistent storage. |
| CPU | The number of CPU cores available to your server. Your software is often designed to execute its tasks across multiple CPU cores in parallel. The higher your CPU core count, the more work you can perform simultaneously.
| vCPU        |In the context of a Linode Dedicated CPU instance, a virtual CPU is a method that allows the operating system to treat individual cores as several virtual cores. Virtual CPU's increases the performance and effeciency of applications by allowing the OS to triage processes using multiple threads. |
| Storage | Your server's built-in persistent storage. Large databases, media libraries, and other stores of files will require more storage space. Your Linode's storage is maintained on high-performance SSDs for fast access. You can also supplement your Linode's disks with extra [Block Storage Volumes](https://www.linode.com/blockstorage). |
| Transfer | The total amount of traffic your server can emit over the course of a month. Inbound traffic sent to your Linode does not count against your transfer quota. If you exceed your quota, your service will not be shut off; instead, an overage will be billed. Review the [Network Transfer Quota](/docs/platform/billing-and-support/network-transfer-quota/) guide for more information about how transfer works.
| Network In | The maximum bandwidth for inbound traffic sent to your Linode. The bandwidth you observe will also depend on other factors, like the geographical distance between you and your Linode and the bandwidth of your local ISP. For help with choosing a data center that will feature the lowest latency and best bandwidth, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center/) guide.
| Network Out | The maximum bandwidth for outbound traffic emitted by your Linode. The bandwidth you observe will also depend on other factors, like the geographical distance between you and your Linode and the bandwidth of your local ISP. For help with choosing a data center that will feature the lowest latency and best bandwidth, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center/) guide. |

## General Principles when Choosing an Instance

The different Linode plan types represent different balances of the above specifications. The Nanode and Standard plans offer a general-purpose array of specifications, the High Memory plans favor higher memory allocations, and the Dedicated CPU plans provide the best CPU performance.

At the same time, different kinds of applications have different resource requirements. Some applications may need to store a lot of data but require less processing power, some may need more memory than CPU, and some may be especially CPU-intensive. As a result, certain instance types can better serve certain applications. When choosing an instance, consider what resources your application needs and then compare it with the specifications of each of the instance types. The following sections include common use cases for each instance that may resemble your needs.

Finally, a common strategy when setting up a new server is to start with a smaller instance and then resize your Linode if needed. At a minimum, you will need to choose an instance that offers enough disk space to store your data. You can then [monitor](/docs/uptime/monitoring-and-maintaining-your-server-new-manager/) the CPU, memory, and network usage of your application to determine if you need more of those resources.

## 1. Nanode

The Nanode instance is great place to begin if you are new to the world of cloud hosting and are unsure of your requirements. This plan offers the essentials and costs $5/month. With this plan you have a fully functioning server with your preferred Linux distribution.

### Use Cases

- Personal projects
- Portfolio [websites](/docs/websites/)
- Small self-hosted services
- Small [code repositories](/docs/development/version-control/)
- [Virtual private networks](/docs/networking/vpn/) (VPNs)
- Prototypes and proof-of-concept demonstrations

### Specifications

| Specification | Value |
| ------------- | ----- |
| RAM | 1GB |
| CPU | 1 CPU Core |
| Storage | 25 GB SSD Storage |
| Transfer | 1 TB |
| Network In | 40 Gbps |
| Network Out | 1000 Mbps |

## 2. Standard

The Linode Standard plans begin at 2GB of RAM with 1 CPU core and go all the way up to 192GB of RAM with 32 CPU cores. These individual instances offer a balanced array of specifications and can support a wide range of modern cloud applications, from personal projects to production deployments of an enterprise application.

### Use Cases

- Web applications and [websites](/docs/websites/)
- [Game servers](/docs/game-servers/)
- [Database servers](/docs/databases/)
- [Code repositories](/docs/development/version-control/)
- Corporate [VPNs](/docs/networking/vpn/)
- [Container](/docs/applications/containers/) clusters
- Application and database clusters
- Content delivery network (CDN) nodes

### Base Specifications

| Specification | Value |
| ------------- | ----- |
| RAM | 2GB |
| CPU | 1 CPU Core |
| Storage | 50 GB SSD Storage |
| Transfer | 2 TB |
| Network In | 40 Gbps |
| Network Out | 2000 Mbps |

To view a full list of the Standard plan specifications, visit the [Linode Pricing](https://www.linode.com/pricing#all) page.

## 3. High Memory

High Memory plans increase your system's available RAM and feature relatively fewer CPU cores and less storage. This keeps your costs down and provides power to memory-intensive applications.

### Use Cases

High memory allocations benefit in-memory caches and in-memory databases, like [Memcached](https://memcached.org) and [Redis](https://redis.io). These applications offer very fast retrieval of data, but they store data in a non-persistent manner (with some caveats). So, they are usually used in conjunction with another persistent database server.

The kinds of data you might store in one of these applications includes: information about your users' sessions, frequently-requested pages on your website, and data that needs to be computed (for example, the average rating of a product on a retail store's site).

### Base Specifications

| Specification | Value |
| ------------- | ----- |
| RAM | 24GB |
| CPU | 1 CPU Core |
| Storage | 20 GB SSD Storage |
| Transfer | 5 TB  |
| Network In | 40 Gbps |
| Network Out | 5000 Mbps |

To view a full list of High Memory plan specifications, visit the [Linode Pricing](https://www.linode.com/pricing#all) page.

## 4. Dedicated CPU

Dedicated CPU instances offer entire dedicated physical CPU cores for your own Linode's use. No other servers can run processes on the same physical cores that you're using, which means that your software can run at peak speed and efficiency.

Under the Nanode, Standard, and High Memory plans, your processes are scheduled on the same physical CPU cores as the processes from other servers. This shared scheduling is done in a secure and performant manner, and Linode works to minimize any competition for CPU resources between your server and other servers, but the Dedicated CPU instances offer the absolute best processing performance. With Dedicated CPUs, you can run your processes for prolonged periods of maximum CPU usage, and you can ensure the lowest latency possible for latency-sensitive operations.

### Dedicated CPUs and the Linode API

Some data analysis and processing tasks are well-suited for Dedicated CPU instances, you may only need your Dedicated CPU Linode until the task is finished, at which point you can remove the server.
Furthermore, some CPU-intensive tasks may be triggered from other events in your workflow. For example, if you're a software developer that uses continuous integration and delivery (CI/CD) tools, those tools are run whenever you push code to your repository. By leveraging the [Linode API](https://developers.linode.com), you can programmatically create a Dedicated CPU Linode, run these tools, and destroy the server on every code push.

### Use Cases

- [CI/CD](/docs/development/ci/introduction-ci-cd/) toolchains and build servers
- CPU intensive [game servers](/docs/game-servers/), like Minecraft or Team Fortress
- [Audio and video](/docs/applications/media-servers/) transcoding and streaming
- [Big data](/docs/applications/big-data/) and data analysis
- Scientific computing
- [Machine learning](/docs/applications/big-data/how-to-move-machine-learning-model-to-production/)

### Base Specifications

| Specification | Value |
| ------------- | ----- |
| RAM | 4GB |
| CPU | 1 CPU Core (dedicated) |
| vCPU    |2 Virtual CPU       | 
| Storage | 50 GB SSD Storage |
| Transfer | 2 TB |
| Network In | 40 Gbps |
| Network Out | 2000 Mbps |

To view a full list of Dedicated CPU plan specifications, visit the [Linode Pricing](https://www.linode.com/pricing#all) page.
