---
# Shortguide: Instructions on deploying a Marketplace App Cluster from Cloud Manager

headless: true
show_on_rss_feed: false
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
description: 'Marketplace marketplace app cluster shortguide'
---

The Linode Marketplace lets you easily deploy an application cluster on Compute Instances using Cloud Manager. See [Get Started with Marketplace Apps](/docs/marketplace-docs/get-started/) for complete steps.

1. Log in to [Cloud Manager](https://cloud.linode.com) and select the **Marketplace** link from the left navigation menu. This displays the Linode **Create** page with the **Marketplace** tab pre-selected.

1. Under the **Select App** section, select the cluster app you would like to deploy. Marketplace Apps that are deployed as clusters have a **cluster** label next to the app's name.

1. Complete the form by following the steps and advice within the [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guide. Depending on the Marketplace App you selected, there may be additional configuration options available. See the [Configuration Options](#configuration-options) section below for compatible distributions, recommended plans, and any additional configuration options available for this Marketplace App.

1. Click the **Create Linode** button. Once the first Compute Instance has been provisioned and has fully powered on, **wait for the software installation to complete**. If the instance is powered off or restarted before this time, the other Compute Instances may never be deployed and the software installation will likely fail.