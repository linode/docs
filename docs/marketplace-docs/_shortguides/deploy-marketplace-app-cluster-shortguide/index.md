---
# Shortguide: Instructions on deploying a Quick Deploy App Cluster from Cloud Manager

headless: true
show_on_rss_feed: false
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
description: 'Quick Deploy App cluster shortguide'
---

Akamai Quick Deploy Apps let you easily deploy an application cluster on Compute Instances using Cloud Manager. See [Get Started with Quick Deploy Apps](/docs/marketplace-docs/get-started/) for complete steps.

1. Log in to [Cloud Manager](https://cloud.linode.com) and select the **Quick Deploy App** link from the left navigation menu. This displays the Linode **Create** page with the **Marketplace** tab pre-selected.

1. Under the **Select App** section, select the cluster app you would like to deploy. Quick Deploy Apps that are deployed as clusters have a **cluster** label next to the app's name.

1. Complete the form by following the steps and advice within the [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guide. Depending on the Quick Deploy App you selected, there may be additional configuration options available. See the [Configuration Options](#configuration-options) section below for compatible distributions, recommended plans, and any additional configuration options available for this Quick Deploy App.

1. Click the **Create Linode** button. Once the first Compute Instance has been provisioned and has fully powered on, **wait for the software installation to complete**. If the instance is powered off or restarted before this time, the other Compute Instances may never be deployed and the software installation will likely fail.