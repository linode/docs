---
slug: deploy-owncast-with-marketplace-apps
author:
  name: Linode Community
  email: docs@linode.com
description: "Owncast is a self-hosted live video and web chat server for use with existing popular broadcasting software. Learn how to deploy Owncast with Linode's Marketplace Apps."
og_description: "Owncast is a self-hosted live video and web chat server for use with existing popular broadcasting software. Learn how to deploy Owncast with Linode's Marketplace Apps."
keywords: ['live streaming','marketplace','web chat']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-31
modified_by:
  name: Linode
title: "Deploy Owncast With Marketplace Apps"
h1_title: "How to Deploy Owncast With Marketplace Apps."
external_resources:
- '[Owncast](https://owncast.online/)'
- '[Owncast Github](https://github.com/owncast/owncast)'
---

## Owncast Marketplace App

<!-- Intro paragraph describing the app and what it accomplishes. -->
Owncast is a self-hosted, "Twitch in a box" live streaming and chat server for use with popular broadcasting software such as OBS. You can use Owncast to live stream anything from gaming with your friends to live events for you and your clients. Like other popular streaming platforms, you can use Owncast's APIs to build things such as chat bots and and stream overlays to drive further audience engagement.


### Deploy an Owncast Marketplace App

<!-- shortguide used by every Marketplace app to describe how to deploy from the Cloud Manger -->

{{< content "deploy-marketplace-apps">}}

### Owncast Options
<!-- The following table has three parts. The UDF name, in bold and in one column, followed by
     UDF description in the second column. The description is in normal text, with an optional
     "Required." tag at the end of the description, in italics, if the field is mandatory. -->
You can configure your Owncast App by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **Hostname** | Your public hostname for your Owncast server. Required for SSL. *Advanced Configuration*. |
| **Email** | Your email address for configuring SSL. *Advanced Configuration*. |
### Linode Options

After providing the App-specific options, provide configurations for your Linode server:
<!-- Be sure to edit the Select an Image and Linode Plan to match app's needs -->

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Debian 10 is currently the only image supported by the Owncast Marketplace App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). Owncast can be supported on any size Linode, but we suggest you deploy your Owncast App on a Linode plan that reflects how you plan on using it. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name is how you identify your server in the Cloud Manager Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

<!-- the following disclaimer lets the user know how long it will take
     to deploy the app -->
After providing all required Linode Options, click on the **Create** button. **Your Owncast App will complete installation anywhere between 2-5 minutes after your Linode has finished provisioning**.

## Getting Started after Deployment
<!-- the following headings and paragraphs outline the steps necessary
     to access and interact with the Marketplace app. -->
### Access your Owncast App
After Owncast has finished installing, you can access your server with your Linode's IPv4 address. Copy your Linode’s IPv4 address from the [Linode Cloud Manager](https://cloud.linode.com), and then connect to the server from your browser using your Linode's IPv4 address and port `8080`(for example `192.0.2.0:8080`).

![owncast.png 'The Owncast stream view'](owncast.png)

With Owncast running, you can begin to configure your new server. Visit the Admin settings, located at `/admin` (for example `192.0.2.0:8080/admin`). Visit the [Configuration Instructions](https://owncast.online/docs/configuration/?source=linodemarketplace) to learn how you can change your video settings, web page content, and more.

On the server, Owncast is installed in the  `/opt/owncast` directory. You'll find all your data files there. This is also where you can upgrade your Owncast server in the future.

{{< content "marketplace-update-note">}}
