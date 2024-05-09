---
title: "Change Plans (Resize)"
title_meta: "How to Resize a Compute Instance"
description: "A walkthrough on upgrading or downgrading a Compute Instance's plan, including switching to a different plan type."
published: 2017-02-14
modified: 2023-10-31
keywords: ["upgrading", "resizing", "disk space"]
tags: ["linode platform","cloud manager"]
image: resizing_a_linode.png
aliases: ['/platform/disk-images/resizing-a-linode-classic-manager/','/resizing/','/platform/disk-images/resizing-a-linode/','/migrate-to-linode/disk-images/resizing-a-linode/','/guides/resizing-a-linode/']
---

You can easily change a Compute Instance's plan using Cloud Manger. Are you expecting a temporary burst of traffic to your website? Or, are you using your plan's resource allotment less than you thought? To accommodate, you can upgrade to a larger plan or downgrade to a smaller one, respectively. You can also change to a different plan type, such as switching from a Shared CPU plan to a Dedicated CPU plan.

## Before you begin

Consider these points before attempting a resize:

- **Hardware changes, but performance is preserved**. While resizing a Compute Instance, Cloud Manager migrates it to a different physical host within the same data center. This new host may have slightly different hardware, but performance is consistent across our entire network.

- **There are two resize types**. You can choose from two resize types: a **warm resize** or a **cold resize**. The type you choose determines the amount of migration downtime during a resize. See [Warm Resize vs. Cold Resize](#warm-resize-vs-cold-resize) to determine which resize type is right for you.

- **What's preserved**. All of your existing data and configuration settings are preserved during the resize, and your IP addresses remain the same.

- **Placement groups aren't supported**. Resizing a compute instance removes it from a [placement group](/docs/products/compute-instances/guides/placement-groups/). The migration required for resizing moves the compute instance to a different physical host in a data center. This can break the Affinity Type setting that's required for a placement group. If your compute instance is in a placement group and you need to resize it, talk to your Akamai account team about other options.

- **The transfer rate during a resize**. Your compute instance's disks are transferred to the new hardware at approximately 150 MB/sec. However, actual transfer speeds may vary.

## Warm resize vs. cold resize

You have two resize options to choose from: **warm** and **cold**. Each refer to the [type of migration](/docs/products/compute/compute-instances/guides/compute-migrations/) that occurs during the resize process.

- **Warm resize**. Your compute instance remains up during the migration and it's rebooted once the migration completes. So, make sure your instance is powered on for this resize. If you see a warning message about an inability to power down your compute instance, try the resize again using the cold resize option. There is less downtime during a warm resize than a cold resize.

- **Cold resize**. This shuts down your compute instance, migrates it to a new host, and restores it to its booted state prior to the resize process.

## Resize a compute instance

1.  Log in to the [Cloud Manager](https://cloud.linode.com) and select **Linodes**.

2.  In the list of compute instances, find the one you want to resize, click the corresponding **...**, and select **Resize**. The **Resize Linode** panel is displayed.

    ![The Resize Linode panel in the Cloud Manager](resize-linode-plan.jpg)

3.  Select the plan you want:

    -  **Select a larger plan**. Review [Upgrade to a Larger Plan](#upgrading-to-a-larger-plan).

    -  **Select a smaller plan**. First, resize the instance's disks. See [Downgrade to a smaller plan](#downgrading-to-a-smaller-plan).

    -  **Select a different plan type**. Review [Switch to a different plan type](#switching-to-a-different-plan-type).

4. Under **Choose Your Resize Type**, select **warm resize** or **cold resize**. See [Warm resize vs. cold resize](#warm-resize-vs-cold-resize) to help decide which option best suits your need.

5.  Check **Auto Resize Disk** if you want to automatically resize your compute instance's primary disk. You can only select this if you meet these conditions:

    - The new plan provides more storage space than the current plan.

    - There is only a single ext3 or ext4 disk (not a raw disk). A swap disk can also be present, but the process doesn't resize it.

    ![The Auto Resize Disk checkbox](auto-resize-disk.png)

6.  Enter the Compute Instance's label in the **Confirm** field and click **Resize Linode**.

With a warm resize, Cloud Manager powers your instance on to complete the resize process. If performing a cold resize, Cloud Manager returns your instance to its original power state.

## Upgrade to a larger plan

You can scale vertically when upgrading your compute instance to a plan with additional resources and capacity. Larger plans can accommodate increased traffic and give your application the additional computing power it needs. Since larger plans come equipped with more resources, you may want to make adjustments to take advantage of these resources.

- **Resize Disks**. In most cases, you can opt to automatically resize the disks when resizing your compute instance. If your instance doesn't meet the requirements for this functionality, or if you decide not to do this automatically, you can manually resize the disks later. See [Resize a Linode's Disk](/docs/products/compute/compute-instances/guides/disks-and-storage/)

- **Optimize Applications**. You can enhance the performance for many applications if additional resources are available. You can do things like increase the memory limit, enable multiple threads, and increase the maximum size of data, cache, logs, or other files. Review the documentation for your application and any software such as PHP, MySQL, Apache, or NGINX.

- **Enable Multi-Queue NICS**. If you're upgrading to a plan with two or more vCPU cores, make sure the **multi-queue NICs** feature is enabled. Typically this is enabled by default. However, older distributions may require additional steps. See [Configuring Multi-Queue NICS](/docs/products/compute/compute-instances/guides/multiqueue-nic/).

## Downgrade to a smaller plan

If you're looking to reduce computing costs, you can downgrade to a plan that uses fewer resources. This can also apply if you've tuned your application to use system resources more efficiently.

1. Determine the amount of disk space you're using on your compute instance. Log in to your instance via [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/) and run the following command and review the *Used* column data:

    ```command
    df -h
    ```

2. Review Compute Instance plans to see if you can downsize. See the [Pricing Page](https://www.linode.com/pricing/).

   {{< note >}}
   If you're close to a downgraded size plan, you can try to free up space on your compute instance. See the options for doing this in the [Download Files from Your Linode](/docs/guides/download-files-from-a-compute-instance/) guide.
   {{< /note >}}

3.  Resize the compute instance's disks to fit within the new plan. See [Resize a Disk](/docs/products/compute/compute-instances/guides/disks-and-storage/).

## Switch to a different plan type

When resizing your instance, you can also switch to a different plan type that better suits your workload. Here are the Compute Instance plan types Akamai offers:

- **Dedicated CPU**. Optimized for CPU-intensive applications. This plan type is equipped with dedicated vCPU cores, suitable for almost any workload that requires consistently high CPU performance. Use cases include production (and high traffic) websites, e-commerce sites, machine learning, data processing, and much more. See [Dedicated CPU Compute Instances](https://www.linode.com/products/dedicated-cpu/).

- **Shared CPU**. Balancing performance with value. This plan type is a solid foundation for many common use cases, including development, low-traffic websites, or any workload that doesn't require consistent 100% CPU usage. See [Shared CPU Compute Instances](https://www.linode.com/products/shared/).

- **Premium CPU**. Guaranteed hardware for CPU-intensive workloads. Built off of our Dedicated CPU offering, this plan comes equipped with the latest AMD EPYC™ CPUs to make sure your applications are running on the best available hardware with consistent high performance. Use cases include enterprise-grade production applications, video transcoding, and more. See [Premium CPU Compute Instances](https://www.linode.com/products/premium-cpu/).

- **High Memory**. Optimized for memory-intensive applications. This plan type is also equipped with dedicated vCPU cores, though they contain more memory than other similarly priced plans. Use cases include large or high-traffic databases, caching servers, and more. See [High Memory Compute Instances](https://www.linode.com/products/high-memory/).

- **GPU:** The only plan type that is equipped with high performance NVIDIA GPU cards. GPU plans are capable of processing large amounts of data in parallel, performing complex calculations much more efficiently. See [GPU Compute Instances](https://www.linode.com/products/gpu/).

{{< note >}}
- See the [Choosing a Compute Instance Type and Plan](/docs/products/compute/compute-instances/plans/choosing-a-plan/) guide for advice and a comparison of each plan.

- Pricing and plan options may vary by region. See our [Pricing](https://www.linode.com/pricing/) page for more information on pricing options and [How to Choose a Data Center](/docs/products/platform/get-started/guides/choose-a-data-center/#product-availability) for plan and product availability.
{{< /note >}}

### How to switch

Follow the instructions in [Resize a Linode](#resizing-a-linode). When choosing the plan, select the tab that corresponds with your desired plan type.

## Troubleshooting

- **If a warm resize fails**. Cloud Manager generates a notification, and you get an email notification regarding the failed job. There are several reasons a warm resize may fail, including the inability to successfully reboot due to internal configuration settings. If this happens, try a cold resize.

- **If a cold resize fails**. Retry it. If it continues to fail, reach out to our [Support](/docs/products/platform/get-started/guides/support/) department for assistance.

For additional information on troubleshooting resizes or migrations, please see our [Compute Migrations](/docs/products/compute/compute-instances/guides/compute-migrations/) guide.
