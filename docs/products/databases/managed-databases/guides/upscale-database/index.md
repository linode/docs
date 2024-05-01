---
title: "Resize A Database Cluster"
description: "Learn how to resize your database cluster."
published: 2024-04-09
---

{{< content "dbass-eos" >}}

You can upscale database clusters to adapt them to your needs. Clusters can’t be downscaled.

{{< note type="alert" >}}
This operation causes downtime for the resized node clusters.

{{< /note >}}

1. Log in to the [Cloud Manager](https://cloud.linode.com/) and select **Databases** from the left navigation menu.

1. Select a database cluster from the list. 

1. Navigate to the **Resize** tab.

1. In the *Choose a plan* section, select a new plan for your database cluster. 

    ![Screenshot of Choose a plan section](upscale-plan.png)

1. In the *Summary* section, verify the changes. Click **Resize Database Cluster**.

1. Follow the on-screen instructions and click **Resize Cluster** to confirm. The cluster will be upscaled within two hours.