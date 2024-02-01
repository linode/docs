---
title: "Upscale A Database Cluster"
description: "Learn how to upscale your database cluster."
authors: ["Linode"]
---

{{< content "dbass-eos" >}}

You can upscale database clusters to adapt them to your needs. Upscaling works only within the already selected instance type; if your cluster uses Shared CPU, you can only select an upscaled Shared CPU plan. Clusters can’t be downscaled.

{{< note type="alert" >}}
This operation causes downtime for the upscaled node clusters.

{{< /note >}}

1. Log in to the [Cloud Manager](https://cloud.linode.com/) and select **Databases** from the left navigation menu.

1. Select a database cluster from the list. 

1. Navigate to the **Scale Up** tab.

1. In the *Choose a plan* section, select a new, upscaled plan for your database. 

    ![Screenshot of Choose a plan section](upscale-plan.png)

1. In the *Summary* section, verify the changes. Click **Scale Up Database Cluster**.

1. Click **Scale up** to confirm. The cluster will be upscaled within a few minutes. 