---
# Shortguide: Instructions on deploying a Marketplace App from the Cloud maanger

headless: true
show_on_rss_feed: false

# Ignore the below front matter. It is included to comply with existing tests.

slug: deploy-marketplace-apps-shortguide
title: "Shortguide"
description: "Shortguide"
keywords: ["shortguide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-09
author:
  name: Linode
  email: docs@linode.com
modified_by:
  name: Linode
---

The Linode Marketplace allows you to easily deploy software on a Compute Instance using the Cloud Manager.

1. Log in to the [Cloud Manager](https://cloud.linode.com) and select the **Marketplace** link from the left navigation menu. This displays the Linode **Create** page with the **Marketplace** tab pre-selected.

1. Under the **Select App** section, select the app you would like to deploy.

1. Complete the form by following the steps and advice within the [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guide. Depending on the Marketplace App you selected, there may be additional configuration options available. See the [Configuration Options](#configuration-options) section below for compatible distributions, recommended plans, and any additional configuration options available for this Marketplace App.

1. Click the **Create Linode** button. Once the Compute Instance has provisioned and has fully powered on, **wait for the software installation to complete**. If the instance is powered off or restarted before this time, the software installation will likely fail. To verify that the app has been fully installed, see the [Getting Started After Deployment](#getting-started-after-deployment) section below.

1. Follow the instructions within the [Getting Started After Deployment](#getting-started-after-deployment) section to access and start using your application.
