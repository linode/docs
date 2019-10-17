---
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
---

This guide will serve as a brief introduction into what a Dedicated CPU Linode is and how to add one to your Linode account. Review our [Use Cases for Dedicated CPUs](/docs/platform/dedicated-cpu/dedicated-cpu-use-cases/) guide for more information about the tasks that work well on this instance type.

## What is a Dedicated CPU Linode?

In contrast with a [Standard Linode](/docs/platform/how-to-choose-a-linode-plan/#2-standard), which gives you access to shared virtual CPU cores, a Dedicated CPU Linode offers entire physical CPU cores that are accessible only by your instance. Because your cores will be isolated to your Linode, no other Linodes can schedule processes on them, so your instance will never have to wait for another process to complete its execution, and your software can run at peak speed and efficiency.

While a Standard Linode is a good fit for most use cases, a Dedicated CPU Linode is recommended for a number of workloads related to high, sustained CPU processing, including:

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

![Create a Dedicated CPU Linode in the Cloud Manager](dedi-cpu-with-new-manager.gif)

1. Log in to the [Linode Cloud Manager](https://cloud.linode.com).

1. Click on the **Create** dropdown menu at the top left of the page, and select the **Linode** option.

1. Select a [Distribution](/docs/quick-answers/linux/choosing-a-distribution/), [One-Click App](/docs/platform/one-click/how-to-use-one-click-apps-at-linode/), or [Image](/docs/platform/disk-images/linode-images/) to deploy from.

    {{< note >}}
Use a [StackScript](https://www.linode.com/stackscripts) to quickly deploy software platforms and system configuration options to your Linux distribution. You can read more about Stackscripts and how they work in our [Automating Deployments with Stackscripts Guide](/docs/platform/stackscripts/).
  {{< /note >}}

1. Choose the region where you would like your Linode to reside. If you’re not sure which to select, see our [How to Choose a Data Center guide](/docs/platform/how-to-choose-a-data-center/). You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network route between you and each of our data centers.

1. At the top of the **Linode Plan** section, click on the **Dedicated CPU** tab and select the Dedicated CPU plan you would like to use.

1. Enter a label for your new Linode under the **Linode Label** field.

1. Enter a strong root password for your Linode in the **Root Password** field. This password must be at least six characters long and contain characters from at least two of the following categories:

    - lowercase letters
    - uppercase letters
    - numbers
    - punctuation characters

    {{< note >}}
You will not be prompted to enter a root password if you are cloning another Linode or restoring from the Linode Backups service.
{{< /note >}}

1. Optionally, add an [SSH key](/docs/security/authentication/use-public-key-authentication-with-ssh/#upload-your-ssh-key-to-the-cloud-manager), [Backups](/docs/platform/disk-images/linode-backup-service/), or a [Private IP address](/docs/platform/manager/remote-access/#adding-private-ip-addresses).

1. Click the **Create** button when you have finished completing this form. You will be redirected to the overview page for your new Linode. This page will show a progress bar which will indicate when the Linode has been provisioned and is ready for use.

## Next Steps

See our [Getting Started](/docs/getting-started/) guide for help with connecting to your Linode for the first time and configuring the software on it. Then visit the [How to Secure Your Server](/docs/security/securing-your-server/) guide for a collection of security best practices for your new Linode.
