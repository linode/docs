---
slug: when-to-upgrade-to-dedicated-cpu
author:
  name: Ryan Syracuse
  email: rsyracuse@linode.com
description: 'A collection of diagnostic tasks that identify the potential for benefits from dedicated CPU cores.'
keywords: ["dedicated cpu", "use cases", "linode cpu", "machine learning", "big data"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Linode
published: 2021-08-27
title: When to Upgrade to Dedicated CPU Linodes
tags: ["linode platform"]
aliases: ['/platform/dedicated-cpu/when-to-upgrade-to-dedicated-cpu/']
---

## When is it Time to Upgrade to Dedicated CPU

Dedicated CPU Linodes offer a complement to CPU intensive tasks, and have the potential to significantly reduce issues that arise from shared cloud hosting environments. Normally, when creating a Linode via our shared plan, you are paying for access to virtualized CPU cores, which are allocated to you from a host’s shared physical CPU. While a shared plan is designed to maximize performance, the reality of a shared virtualized environment is that your processes are scheduled to use the same physical CPU cores as other customers. This can produce a level of competition that results in CPU steal, or a higher wait time from the underlying hypervisor to the physical CPU.

CPU Steal can be defined more strictly as a measure of expected CPU cycles against actual CPU cycles as your virtualized environment is scheduled access to the physical CPU. Although this number is generally small enough that it does not heavily impact standard workloads and use cases, if you are expecting high and constant consumption of CPU resources, you are at risk of being negatively impacted by CPU Steal.

Dedicated CPU Linodes have private access to entire physical CPU cores, meaning no other Linodes will have any processes on the same cores you’re using. Dedicated CPUs are therefore isolated from any competition for CPU resources. Depending on your workload, you can experience an improvement in performance by using Dedicated CPU.

## In This Guide

In this guide, you will learn how to best determine whether or not you can see a benefit from a Dedicated CPU Linode through manual diagnosis leveraging internal tools, graphs found in the Linode Manager, and by observing your use case.

## Diagnosing CPU Steal

Diagnosing CPU steal requires internal access to your Linode over SSH, then running and understanding diagnostic commands.

The first test that should be performed is to run the `iostat` command for a period of time to get a wide array of data. By using the `-c` flag, the `iostat` command can focus specifically on data for the CPU. In the following example, steal data is outputted every `1` second, for a total of `10` seconds.

    sudo iostat -c 1 10

When reviewing output, the main column to focus on is `%steal`, followed by `%user`. The `%steal` column will show how much of your CPU is currently being utilized due to CPU steal, while the `%user` column shows how much of the CPU is being utilized at the user level. A Linode that isn't experiencing any CPU steal and has a small workload would see output resembling the following:

{{< output >}}
avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           0.11    0.00    0.10    0.01    0.06   99.71


avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           0.00    0.00    0.00    0.00    0.00  100.00


avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           0.00    0.00    0.00    0.00    0.00  100.00
{{< /output >}}

A Linode that is experiencing CPU steal however will have CPU steal that can be as high as several percentage points. The following for example, reflects a Linode that is encountering a low level of steal:

{{< output >}}
avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           88.11    0.00    0.10    0.01    10.06   0.14


avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           86.00    0.00    0.00    0.00    12.00  1.69


avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           89.00    0.00    0.00    0.00    9.91  1.78
{{< /output >}}

It's important to keep in mind that while some steal won't usually have a noticeable impact on smaller workloads, it can have a larger impact on a system that is already using a significant amount of it's available CPU. In the latter example, this user should consider an upgrade to a dedicated CPU to boost their performance. It's worth keeping in mind that this test only reflects steal occurring at the moment that this test is performed, and there is no guarantee that steal cannot or will not occur in the future. Generally, in shared hosting, some level of steal can be expected.

## Viewing CPU Usage Graphs

By default, the Linode Manager will log a history of resource usage and plot CPU data to a graph. We recommend observing CPU usage in the cloud manager because it will have the most amount of data pertaining to the lifetime of your Linode. By looking at your CPU graph, you'll be empowered to make a value based judgement on any possible upgrade you may need.

1. To investigate CPU usage on the Linode Manager, log in and click on the Linodes sidebar menu.

1. Select the Linode you'd like to inspect further.

1. By default, the `analytics` tab for the Linode will be automatically selected, and directly underneat the CPU usage graph will be observable.

Generally, when observing the CPU graph, good candidates for an upgrade to a dedicated CPU will have high and often steady CPU usage. That being said, this does not necessarily need to be constant and may have high peaks that reflect a possibility for improvement with a dedicated CPU.

![Dedicated CPU Candidate Graph](cpuusagethrottle.png "Create a Dedicated CPU Linode in the Cloud Manager")

## Finding a Need Through Use Cases

Any time you notice a high and steady level of CPU usage you are in a position where a Dedicated CPU would benefit your workload. That being said, the following use cases specifically tend to see noticeable performance benefits from a dedicated CPU.

- CI/CD Toolchains and Build Servers
- Game Servers
- Audio and Video Transcoding
- Big Data and Data analysis
- Scientific Computing and Data Science
- Machine Learning and AI
- High Traffic Databases (Galera, PostgreSQL with Replication Manager, MongoDB using Replication Sets)
- Replicated or Distributed Filesystems (GlusterFS, DRBD)

For more information on these use cases and whether or not your use case may be a good fit for dedicated CPU, see our guide on [Use Cases for Dedicated CPU](/docs/guides/dedicated-cpu-use-cases/).

