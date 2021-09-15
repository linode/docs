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

The Linode Marketplace allows you to easily deploy software on a Linode using the Linode Cloud Manager.

1. Log in to the [Cloud Manager](https://cloud.linode.com) and select the **Marketplace** link from the left navigation menu. This displays the Linode Compute **Create** page with the **Marketplace** tab pre-selected.

1. Under the **Select App** section, select the app you would like to deploy.

1. Fill out all required **Options** for the selected app as well as any desired **Advanced Options** (which are optional). See the [Configuration Options](#configuration-options) section for details.

1. Complete the rest of the form as discussed within the [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode).

1. Click the **Create Linode** button. Once the Linode has provisioned and has fully powered on, **wait for the software installation to complete**. If the Linode is powered off or restarted before this time, the software installation will likely fail. To determine if the installation has completed, open the Linode's [Lish console](/docs/guides/using-the-linode-shell-lish/) and wait for the system login prompt to appear.

1. Follow the instructions within the [Getting Started After Deployment](#getting-started-after-deployment) section.
