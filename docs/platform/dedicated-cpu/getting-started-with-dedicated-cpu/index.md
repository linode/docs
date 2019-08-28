---
author:
  name: Ryan Syracuse
  email: rsyracuse@linode.com
description: 'Getting Started with Dedicated CPU'
keywords: ["cpu", "dedicated cpu", "getting started"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-08-23
modified_by:
  name: Linode
published: 2019-08-23
title: Getting Started with Dedicated CPU
---

This guide will serve as a brief introduction into what a Dedicated CPU Linode is and how to add one to your Linode account. For more specific information regarding CPU use cases, see our [Dedicated CPU Use Case Guide](placeholder).

## What is a Dedicated CPU Linode?

A dedicated CPU Linode gives you access to entire physical CPU cores accessible only by your Linode.
While a standard plan is a good fit for most use cases, a Dedicated CPU Linode can be recommended for a number of workloads related to high and constant CPU processing. A few of these are as follows:

- [CI/CD](https://www.linode.com/docs/development/ci/introduction-ci-cd/) toolchains and build servers
- CPU-intensive [game servers](https://www.linode.com/docs/game-servers/), like Minecraft or Team Fortress
- [Audio and video transcoding and streaming](https://www.linode.com/docs/applications/media-servers/)
- [Big data](https://www.linode.com/docs/applications/big-data/) and data analysis
- Scientific Computing
- [Machine learning](https://www.linode.com/docs/applications/big-data/how-to-move-machine-learning-model-to-production/)

{{< note >}}
For more information on Dedicated CPU use cases, see our [Dedicated CPU Use Case Guide](placeholder).
{{< /note >}}

## Deploying a Dedicated CPU Linode

![newdedicatedcpugif](newdedicatedcpu.gif)

1. Log in to your [Linode Manager](cloud.linode.com).

1. Click on the "Create" dropdown menu at the top left of the page, and select "Linode".

1. Select your [Distribution](/docs/quick-answers/linux/choosing-a-distribution/), [One-Click App](docs/platform/one-click/how-to-use-one-click-apps-at-linode/), or [Image](/docs/platform/disk-images/linode-images/) to deploy from.
{{< note >}}
Use a [StackScript](https://www.linode.com/stackscripts) to quickly deploy software platforms and system configuration options to your Linux distribution. You can read more about Stackscripts and how they work in our [Automating Deployments with Stackscripts Guide](/docs/platform/stackscripts/).
  {{< /note >}}

1. Choose the region where you would like your Linode to reside. If you’re not sure which to select, see our [How to Choose a Data Center guide](/docs/platform/how-to-choose-a-data-center/). You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the route between you and a data center in each specific region.

1. At the top of the "Linode Plan" section, click on "Dedicated CPU" and select the Dedicated CPU plan you would like to use.

1. Enter a label for your new Linode.

1. Enter a strong Root Password for your Linode in the **Root Password** field. This password must be at least six characters long and contain characters from at least two of the following categories:

  - lowercase and uppercase case letters
  - numbers
  - punctuation characters


1. Optionally, add an [SSH key](/docs/security/authentication/use-public-key-authentication-with-ssh/#upload-your-ssh-key-to-the-cloud-manager), [Backups](/docs/platform/disk-images/linode-backup-service/), or a [Private IP address](/docs/platform/manager/remote-access/#adding-private-ip-addresses).

1. Select "Create" towards the right of the page to complete the creation process for your Dedicated CPU Linode, and to be redirected to it's overview page.
{{< note >}}
  See our [Getting Started Guide](https://www.linode.com/docs/getting-started/) for more information.
{{< /note >}}
