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

Whereas a Standard Linode gives you access to shared virtual CPU cores, a dedicated CPU Linode gives you access to entire physical CPU cores accessible only by your Linode. This eliminates the possibility of CPU steal, or what happens when two virtual CPU processes are scheduled at the same time and one has to wait to complete its process. While a standard plan is a good fit for most use cases, a Dedicated CPU Linode is recommended for a number of workloads related to high and constant CPU processing. A few of these are as follows:

- [CI/CD](/docs/development/ci/introduction-ci-cd/) toolchains and build servers
- CPU-intensive [game servers](/docs/game-servers/), like Minecraft or Team Fortress
- [Audio and video transcoding and streaming](/docs/applications/media-servers/)
- [Big data](/docs/applications/big-data/) and data analysis
- Scientific Computing
- [Machine learning](/docs/applications/big-data/how-to-move-machine-learning-model-to-production/)

{{< note >}}
For more information on Dedicated CPU use cases, see our [Dedicated CPU Use Case Guide](placeholder).
{{< /note >}}

## Deploying a Dedicated CPU Linode

![Create a Dedicated CPU Linode in the Cloud Manager](dedi-cpu-with-new-manager.gif)

1. Log in to the [Linode Cloud Manager](https://cloud.linode.com).

2. Click on the **Create** dropdown menu at the top left of the page, and select "Linode".

3. Select a [Distribution](/docs/quick-answers/linux/choosing-a-distribution/), [One-Click App](/docs/platform/one-click/how-to-use-one-click-apps-at-linode/), or [Image](/docs/platform/disk-images/linode-images/) to deploy from.

    {{< note >}}
Use a [StackScript](https://www.linode.com/stackscripts) to quickly deploy software platforms and system configuration options to your Linux distribution. You can read more about Stackscripts and how they work in our [Automating Deployments with Stackscripts Guide](/docs/platform/stackscripts/).
  {{< /note >}}

1. Choose the region where you would like your Linode to reside. If you’re not sure which to select, see our [How to Choose a Data Center guide](/docs/platform/how-to-choose-a-data-center/). You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the route between you and a data center in each specific region.

2. At the top of the **Linode Plan** section, click on *Dedicated CPU* and select the Dedicated CPU plan you would like to use.

3. Enter a label for your new Linode.

4. Enter a strong root password for your Linode in the **Root Password** field. This password must be at least six characters long and contain characters from at least two of the following categories:

  - lowercase and uppercase case letters
  - numbers
  - punctuation characters

1. Optionally, add an [SSH key](/docs/security/authentication/use-public-key-authentication-with-ssh/#upload-your-ssh-key-to-the-cloud-manager), [Backups](/docs/platform/disk-images/linode-backup-service/), or a [Private IP address](/docs/platform/manager/remote-access/#adding-private-ip-addresses).

1. Click the **Create** button to complete the creation process for your Dedicated CPU Linode, and to be redirected to it's overview page.
{{< note >}}
  See our [Getting Started Guide](https://www.linode.com/docs/getting-started/) for more information.
{{< /note >}}
