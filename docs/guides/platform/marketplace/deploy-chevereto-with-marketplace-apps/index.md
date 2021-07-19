---
slug: deploy-chevereto-with-marketplace-apps
author:
  name: Linode Community
  email: docs@linode.com
description: 'Chevereto is a modern image sharing solution with drag-and-drop upload experience, multi-server support, moderation tools, categories, user accounts, private albums and more.'
og_description: 'Chevereto is a modern image sharing solution with drag-and-drop upload experience, multi-server support, moderation tools, categories, user accounts, private albums and more.'
keywords: ['photo storage','images','Marketplace']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-13
modified_by:
  name: Linode
title: "Deploy Chevereto With Marketplace Apps"
h1_title: "How to Deploy Chevereto With Marketplace Apps."
enable_h1: true
external_resources:
- '[Chevereto](https://chevereto.com/)'
- '[Chevereto Documentation](https://chevereto.com/docs)'
---

## Chevereto Marketplace App

Chevereto is a self-hosted multipurpose multi-user, full-featured image sharing solution. It can be used to create a myriad of applications or to empower existing systems, all around the concept of users sharing image content. 

### Deploy a Chevereto Marketplace App

{{< content "deploy-marketplace-apps">}}

After providing the App-specific options, provide configurations for your Linode server:
<!-- Be sure to edit the Select an Image and Linode Plan to match app's needs -->

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Ubuntu 20.04 LTS is currently the only image supported by the Chevereto Marketplace App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). Chevereto can be supported on any size Linode, but we suggest you deploy your Chevereto App on a Linode plan that reflects how you plan on using it. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name is how you identify your server in the Cloud Manager Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

<!-- the following disclaimer lets the user know how long it will take
     to deploy the app -->
After providing all required Linode Options, click on the **Create** button. **Your Chevereto App will complete installation anywhere between 2-5 minutes after your Linode has finished provisioning**.

## Getting Started after Deployment

### Access your Chevereto App
1. After Chevereto has finished installing,log into your Linode via SSH, replacing `192.0.2.0` with your [Linode's IP address](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/), and entering your Linode's root password when prompted:

         ssh root@192.0.2.0
2. 
{{< content "marketplace-update-note">}}