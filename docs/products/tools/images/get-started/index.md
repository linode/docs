---
title: Get Started
description: "Get started with Linode Images. Learn to create an image with the Linode Images service."
tab_group_main:
    weight: 20
---

Linode Images captures an exact copy of your disk at the moment when the process is kicked off. Here's how to capture your first image.

1.  Navigate to the Images page in the [Linode Cloud Manager](https://cloud.linode.com/) and click on **Add an Image**.

1.  In the **Create an Image** side panel, select the **Linode** and **Disk** you would like to freeze, and provide a **Label** for the Image. You may also add an optional **Description** of the image. Then, click **Create**.

    {{< caution >}}
CoreOS disk images are in RAW format. You cannot deploy new Linodes with images made from CoreOS disks.
{{< /caution >}}

1.  Once you click the **Create** button, your image is frozen for later use. You can view the progress under the bell notifications at the top of the page.

    Once the job has completed, your Linode's disk is captured, stored, and can be used to [deploy new Linode instances from your saved image](/docs/products/tools/images/guides/deploy-from-a-saved-image/).

    {{< note >}}
See the [Capture a Disk Image](/docs/products/tools/images/guides/capture-an-image/) guide for details on Image size restrictions and best practices.
    {{</ note >}}

