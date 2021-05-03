---
slug: deploy-image-to-existing-linode-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to deploy an Image to an existing Linode'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-04-28
modified_by:
  name: Linode
published: 2021-04-28
title: How to Deploy an Image to an Existing Linode
keywords: ["images"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
---

1. Log in to the Cloud Manager and navigate to the **Images** page.

1. On this page, locate the Image you wish to deploy and click the corresponding **ellipsis** options menu. Select **Deploy to an Existing Linode**.

    [![Click the button labeled Deploy to an Existing Linode](images-deploy-existing-linode.png)](images-deploy-existing-linode.png "Click the button labeled Deploy to an Existing Linode")

1. You are redirected to the dashboard page for that Linode and the **Rebuild** form is displayed with the chosen Image preselected. Complete the remainder of this form, making sure to select your desired **Root Password**, and any other options that may be needed. See [Rescue and Rebuild → Rebuilding](/docs/guides/rescue-and-rebuild/#rebuilding) for full instructions on rebuilding a Linode.

1. Click the **Rebuild Linode** button to rebuild the Linode. All existing disks will be deleted and a new disk will be created using the selected Image.