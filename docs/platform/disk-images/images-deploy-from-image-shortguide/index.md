---
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
---

Deploying one of your saved images to any Linode under your account is a simple process.

1.  Navigate to the **Images** page, click on the **more options ellipsis** to open the menu for the Image from which you would like to deploy, and select **Deploy New Linode**.

    {{< image src="images-select-deploy-from-menu.png" alt="Select 'Deploy New Linode' from the Image menu" title="Select 'Deploy New Linode' from the Image menu" >}}

1.  Select your Image from *My Images* under the *Create from Image* tab.

    {{< image src="images-create-linode-from-image.png" alt="Select your Image from the 'My Images' tab" title="Select your Image from the 'My Images' tab" >}}

    {{< caution >}}
You cannot deploy an image that was created from a RAW disk format. Attempting to do so will result in a failure.
{{< /caution >}}

1.  Select your desired Region, Linode Plan, Label, and set your root password, then click **Create** to create a Linode with your saved image.

    {{< image src="images-master-from-image.png" alt="A new Linode has been created from a disk" title="A new Linode has been created from a disk" >}}

Once you've completed these steps, your saved image will be deployed on your new Linode.
