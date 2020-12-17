---
title: Get Started
description: "Get Started with GPU Linodes. Deploy a GPU Linode Instance using the Linode Cloud Manager."
tab_group_main:
    weight: 20
---

## Deploy a GPU Linode Instance

1. Log in to the [Cloud Manager](https://cloud.linode.com/) with the username and password you created when signing up.

1. At the top of the page, click **Create** and select **Linode**.

1. Select the [Distribution](/docs/quick-answers/linux/choosing-a-distribution/), [One Click App](/docs/platform/one-click/how-to-use-one-click-apps-at-linode/), or [Image](/docs/platform/disk-images/linode-images/) you would like to use.

    {{< note >}}
Use a [StackScript](https://www.linode.com/stackscripts) to quickly deploy software platforms and system configuration options to your Linux distribution. Some of the most popular StackScripts do things like install a LAMP stack, VPN, or WordPress. You can read more about Stackscripts and how they work in our [Automating Deployments with Stackscripts](/docs/platform/stackscripts/) guide.
{{< /note >}}

1. Choose the region where you would like your Linode to reside. If you’re not sure which to select, see our [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the route path between you and a data center in each specific region.

1. Select a GPU Linode plan.

1. Give your Linode a label. This is a name to help you easily identify it within the Cloud Manager’s Dashboard. If desired, assign a tag to the Linode in the **Add Tags** field.

1. Create a root password for your Linode in the **Root Password** field. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique.

1. Click **Create**. You are directed back to the Linode's page, and this page reports the status of your Linode as it boots up. You can now use the Cloud Manager to:

    - Boot and shut down your Linode

    - Access monitoring statistics

    - Update your [billing](/docs/platform/billing-and-support/manage-billing-in-cloud-manager/) and [account](/docs/platform/manager/accounts-and-passwords/) information

    - Add additional Linode services, like [Block Storage](/docs/platform/block-storage/how-to-use-block-storage-with-your-linode/)

    - Open a [support ticket](/docs/platform/billing-and-support/support/) and perform other administrative tasks

1. Be sure to bookmark the [Linode Status page](https://status.linode.com/) or [subscribe](/docs/platform/linode-status-page/) to our system status updates by email.

1. After the Linode GPU is online, install the appropriate NVIDIA drivers:

    - [Install NVIDIA Driver Dependencies](/docs/products/compute/gpu/guides/install-nvidia-driver-dependencies/): Some dependencies need to be installed before the drivers are installed.

    - [NVIDIA Driver CUDA Installation](/docs/products/compute/gpu/guides/install-nvidia-drivers-with-cuda/): If you're running Ubuntu 18.04, CentOS 7, or OpenSUSE, install the NVIDIA driver with CUDA.

    - [NVIDIA Driver Manual Installation](/docs/products/compute/gpu/guides/install-nvidia-drivers-manually/): If you're running Debian 9, install the NVIDIA driver manually.
