---
slug: getting-started-with-dedicated-cpu
author:
  name: Ryan Syracuse
  email: rsyracuse@linode.com
description: 'How to set up a Dedicated CPU Linode on your account, and a brief overview of what purpose they serve.'
keywords: ["cpu", "dedicated cpu", "getting started", "cpu steal", "steal"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Linode
published: 2019-09-20
title: Getting Started with Dedicated CPUs
tags: ["linode platform"]
aliases: ['/platform/dedicated-cpu/getting-started-with-dedicated-cpu/']
---

This guide will serve as a brief introduction into what a Dedicated CPU Linode is and how to add one to your Linode account. Review our [Use Cases for Dedicated CPUs](/docs/platform/dedicated-cpu/dedicated-cpu-use-cases/) guide for more information about the tasks that work well on this instance type.

## What is a Dedicated CPU Linode?

In contrast with a [Shared Linode](/docs/platform/how-to-choose-a-linode-plan/#1-shared), which gives you access to shared virtual CPU cores, a Dedicated CPU Linode offers entire physical CPU cores that are accessible only by your instance. Because your cores will be isolated to your Linode, no other Linodes can schedule processes on them, so your instance will never have to wait for another process to complete its execution, and your software can run at peak speed and efficiency.

While a Shared Linode is a good fit for most use cases, a Dedicated CPU Linode is recommended for a number of workloads related to high, sustained CPU processing, including:

- [CI/CD](/docs/development/ci/introduction-ci-cd/) toolchains and build servers
- CPU-intensive [game servers](/docs/game-servers/), like Minecraft or Team Fortress
- [Audio and video transcoding and streaming](/docs/applications/media-servers/)
- [Big data](/docs/applications/big-data/) and data analysis
- Scientific Computing
- [Machine learning](/docs/applications/big-data/how-to-move-machine-learning-model-to-production/)

    {{< note >}}
For more information on Dedicated CPU use cases, see our [Use Cases for Dedicated CPU Instances](/docs/platform/dedicated-cpu/dedicated-cpu-use-cases/).
{{< /note >}}

## Deploying a Dedicated CPU Linode

{{< content "dedicated-cpu-deploy-shortguide" >}}

## Next Steps

See our [Getting Started](/docs/getting-started/) guide for help with connecting to your Linode for the first time and configuring the software on it. Then visit the [How to Secure Your Server](/docs/security/securing-your-server/) guide for a collection of security best practices for your new Linode.
