---
title: "Get Started"
description: "Learn how to deploy a GPU Compute Instance on Linode."
tab_group_main:
    weight: 20
aliases: ['/platform/linode-gpu/getting-started-with-gpu/', '/guides/getting-started-with-gpu/']
image: getting-started-with-linode-gpu-instances.png
---

{{< content "gpu-deposit-shortguide" >}}

## Deploy a GPU Linode Instance

1. Log in to the [Cloud Manager](https://cloud.linode.com/) with the username and password you created when signing up.

1. At the top of the page, click **Create** and select **Linode**.

1. Select the [Distribution](/docs/guides/choosing-a-distribution/), [Marketplace App](/docs/products/tools/marketplace/get-started/), or [Image](/docs/products/tools/images/) you would like to use.

    {{< note >}}
    Be sure to select a distribution that's compatible with the NVIDIA CUDA Toolkit. Review NVIDIA's [System Requirements](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html#system-requirements) to learn which distributions are supported.
    {{< /note >}}

1. Choose the region where you would like your Linode to reside. If you’re not sure which to select, see our [How to Choose a Data Center](/docs/guides/how-to-choose-a-data-center/) guide. You can also generate [MTR reports](/docs/guides/diagnosing-network-issues-with-mtr/) for a deeper look at the route path between you and a data center in each specific region.

1. Select a GPU Linode plan.

1. Give your Linode a label. This is a name to help you easily identify it within the Cloud Manager’s Dashboard. If desired, assign a tag to the Linode in the **Add Tags** field.

1. Create a root password for your Linode in the **Root Password** field. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique.

1. Click **Create**. You are directed back to the Linode's page, and this page reports the status of your Linode as it boots up. You can now use the Cloud Manager to:

    - Boot and shut down your Linode

    - Access monitoring statistics

    - Update your [billing](/docs/products/platform/billing/guides/) and [account](/docs/products/platform/accounts/guides/manage-users/) information

    - Add additional Linode services, like [Block Storage](/docs/products/storage/block-storage/)

    - Open a [support ticket](/docs/guides/support/) and perform other administrative tasks

1. Be sure to bookmark the [Linode Status page](https://status.linode.com/) or [subscribe](/docs/guides/linode-status-page/) to our system status updates by email.

1. After the Linode GPU is online, install the NVIDIA CUDA Toolkit:

    - [Installing the NVIDIA CUDA Toolkit](/docs/products/compute/gpu/guides/install-nvidia-cuda/)