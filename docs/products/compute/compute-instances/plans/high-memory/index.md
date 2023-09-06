---
title: "High Memory Compute Instances"
linkTitle: "High Memory"
description: "High Memory Linodes offer cost-effective fast data retrieval and in-memory processing."
published: 2023-01-18
aliases: ['/products/compute/high-memory/']
---

High Memory Compute Instances are virtual machines that offer a greater price-to-performance ratio for memory-intensive applications. When compared to [Dedicated CPU Instances](/docs/products/compute/compute-instances/plans/dedicated-cpu/), High Memory Instances provide the same dedicated CPU resources but are equipped with more memory per CPU core. This tunes them specifically for memory-intensive applications that value larger amounts of memory over a larger number of CPU cores.

**High Memory plans are ideal for production applications and CPU-intensive workloads that value greater memory over CPU resources, including caching systems, high-performance databases, and in-memory data processing.**

## Fast Data Retrieval and In-Memory Processing

Optimized for in-memory databases and caches, the High Memory Linode is perfect for high-performance querying and is a good addition to any enterprise-level database solution.

Keep recently-accessed data in memory to speed up retrieval times. Use a High Memory Linode as a Memcached or Redis in-memory data store for better application performance.

Run queries on large data volumes. High memory Linodes make it possible to process your data completely in memory and quickly get query results.

## Dedicated Competition-Free Resources

A High Memory Instance provides entire vCPU cores accessible only to you. Because the vCPU cores are not shared, no other Compute Instances can utilize them. Your instance never has to wait for another process, enabling your software to run at peak speed and efficiency. This allows you to run workloads that require full-duty work (100% CPU all day, every day) at peak performance.

## Recommended Workloads

High Memory Compute Instances are suitable for workloads that value much larger amounts of memory than other plans of a similar price. This includes:

- Any production application that requires large amounts of memory
- In-memory database caching systems, such as [Redis](https://redis.io/) and [Memcached](https://memcached.org/)
- In-memory databases, such as possible with [NoSQL](/docs/guides/what-is-nosql/) and [other solutions](https://en.wikipedia.org/wiki/List_of_in-memory_databases)
- [Big data processing](/docs/applications/big-data/) (and data analysis)

## Availability

High Memory instances are available across [all regions](https://www.linode.com/global-infrastructure/).

## Plans and Pricing

| Resource | Available Plans |
| -- | -- |
| vCPU cores | 2-16 cores |
| Memory | 24 GB - 300 GB |
| Storage | 20 GB - 340 GB |
| Outbound Network Transfer | 5 TB - 9 TB |
| Outbound Network Bandwidth | 5 Gbps - 9 Gbps |

Pricing starts at $60 for a High Memory Compute Instance with 2 vCPU cores, 24GB memory, and 20GB SSD storage. Review the [Pricing page](https://www.linode.com/pricing/#compute-high-memory) for additional plans and their associated costs. Review the [Compute Instance Plan Types](/docs/products/compute/compute-instances/plans/) page below to learn more about other instance types.