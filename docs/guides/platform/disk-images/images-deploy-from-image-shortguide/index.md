---
slug: images-deploy-from-image-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to deploy a new Linode from a saved Linode Image.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: How to Deploy a New Linode from a Saved Linode Disk Image
keywords: ["images"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/disk-images/images-deploy-from-image-shortguide/']
---

Deploying one of your saved images to any Linode under your account is a simple process.

1.  Navigate to the **Images** page, click on the **more options ellipsis** corresponding to the image you'd like to use, and select **Deploy New Linode**.

    ![Select 'Deploy New Linode' from the Image menu](images-select-deploy-from-menu.png "Select 'Deploy New Linode' from the Image menu")

    You are brought to the **Lionde Create** page where your image is preselected.

    ![Select your Image from the 'My Images' tab](images-create-linode-from-image.png "Select your Image from the 'My Images' tab")

    {{< caution >}}
You cannot deploy an image that was created from a RAW disk format. Attempting to do so will result in a failure.
{{< /caution >}}

1.  Provide the remaining configurations for your new Linode instancy by selecting your desired **Region**, **Linode Plan**, **Label**, and set your **Root Password**, then click **Create** to create a Linode from your saved image.

    You are brought to your new Linode's Details page where you can monitor its creation from your stored image.
