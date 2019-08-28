---
author:
  name: Ryan Syracuse
  email: rsyracuse@linode.com
description: 'Dedicated CPU use cases.'
keywords: ["dedicated cpu", "use cases", "linode cpu", "machine learning", "big data"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-08-28
modified_by:
  name: Linode
published: 2019-08-28
title: Dedicated CPU Use Cases
---

The following guide will describe in a higher level of detail the benefits of a dedicated CPU Linode and it's associated use cases.

## Why Dedicated CPU

Dedicated CPU Linodes offer a focus on CPU intensive tasks that significantly reduce potential issues normally seen in a shared cloud hosting environment. Normally, when creating a Linode via our standard plan, you are paying for access to virtualized CPU cores, which in reality are allocated to you from a host's physical CPU. While a standard plan is designed to be both secure and to maximize performance, the reality of a shared virtualized environment is that your processes are scheduled to use the same physical CPU cores as other customers, which equates to a level of competition that can result in _CPU steal_, or a higher wait time from the underlying hypervisor to the physical CPU.

Dedicated CPU Linodes would have access to entire physical CPU cores, and would be exempt from any competition for CPU resources and potential problems that could come up for this reason. With a Dedicated CPU Linode, no other Linodes will be able to have any processes on the same cores that you're using, and depending on your workload, you can experience an increase in performance.

## Dedicated CPU use cases

While a standard plan is usually a good fit for most use cases, a Dedicated CPU Linode can be recommended for a number of workloads related to high and constant CPU processing. A few of these are as follows:

- [CI/CD](https://www.linode.com/docs/development/ci/introduction-ci-cd/) toolchains and build servers
- CPU-intensive [game servers](https://www.linode.com/docs/game-servers/), like Minecraft or Team Fortress
- [Audio and video transcoding and streaming](https://www.linode.com/docs/applications/media-servers/)
- [Big data](https://www.linode.com/docs/applications/big-data/) and data analysis
- Scientific Computing
- [Machine learning](https://www.linode.com/docs/applications/big-data/how-to-move-machine-learning-model-to-production/)