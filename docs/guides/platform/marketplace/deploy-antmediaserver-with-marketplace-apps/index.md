---
slug: deploy-antmediaserver-with-marketplace-apps
author:
  name: Linode Community
  email: docs@linode.com
description: 'Ant Media Server is a streaming engine software that provides low latency streaming in the cloud using WebRTC technology. Learn how to deploy Ant Media Server with Linode Marketplace Apps.'
og_description: 'Ant Media Server is a streaming engine software that provides low latency streaming in the cloud using WebRTC technology. Learn how to deploy Ant Media Server with Linode Marketplace Apps.'
keywords: ['streaming', "marketplace", "live video streaming"]
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-30
modified_by:
  name: Linode
title: "Deploy Ant Media Server With Marketplace Apps"
h1_title: "How to Deploy Ant Media Server With Marketplace Apps."
external_resources:
- '[Ant Media](https://antmedia.io)'
- '[Document](https://github.com/ant-media/Ant-Media-Server/wiki)'
---

## Ant Media Server Marketplace App

<!-- shortguide used by every Marketplace app to describe how to deploy from the Cloud Manger -->

Ant Media Server is Highly Scalable Live Video Streaming Platform with ultra low latency. It supports WebRTC live streaming, in addition to CMAF and HLS streaming. It can be ingested through RTMP, WebRTC, or HLS. Any IP Camera can be connected through RTSP or ONVIF. It also enables live restreaming to social media platforms. All codes (H.264, H.265, and VP8) are enabled, and GPU based encoding is also available.

Ant Media Server Community Edition is a limited version of Ant Media Server Enterprise edition and supports the following features.

* Publish live streams with WebRTC, RTMP - Play Live and VoD streams with RTMP and HLS
* RTMP, RTSP, MP4 and HLS Support
* WebRTC to RTMP Adapter
* 360 Degree Live & VoD Streams
* Web Management Dashboard
* IP Camera Support
* Re-stream Remote Streams (IPTV)
* Open Source https://github.com/ant-media/Ant-Media-Server
* Simulcasting to Periscope
* Your Live or VoD streams can play anywhere including mobile(Android, iOS) browsers.

If you need adaptive streaming, cluster, load balancer, and hardware encoding, please use Enterprise Edition http://antmedia.io

### Deploy a Ant Media Server Marketplace App

<!-- shortguide used by every Marketplace app to describe how to deploy from the Cloud Manger -->
{{< content "deploy-marketplace-apps">}}

### Linode Options

After providing the App-specific options, provide configurations for your Linode server:
<!-- Be sure to edit the Select an Image and Linode Plan to match app's needs -->

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Ubuntu 20.04 LTS is currently the only image supported by the Ant Media Server Marketplace App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). Ant Media Server can be supported on any size Linode, but we suggest you deploy your Ant Media Server App on a Linode 8GB plan. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name is how you identify your server in the Cloud Manager Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

<!-- the following disclaimer lets the user know how long it will take
     to deploy the app -->
After providing all required Linode Options, click on the **Create** button. **Your Ant Media Server App will complete installation anywhere between 2-5 minutes after your Linode has finished provisioning**.

## Getting Started after Deployment
<!-- the following headings and paragraphs outline the steps necessary
     to access and interact with the Marketplace app. -->

### Access your Ant Media Server App
After Ant Media Server has finished installing, you can access your server with your Linode's IPv4 address. Copy your Linode’s IPv4 address from the [Linode Cloud Manager](https://cloud.linode.com), and then connect to the server from your browser using your Linode's IPv4 address and port `5080`(for example `192.0.2.0:5080`).

![antmediaserver.png 'Ant Media Server account creation page.'](antmediaserver.png)

For more on Ant Media Server, check out the following resources:

- [Ant Media Server wiki](https://github.com/ant-media/Ant-Media-Server/wiki)
- [Publishing a Live Stream](https://github.com/ant-media/Ant-Media-Server/wiki/Publishing-Live-Streams)


<!-- the following shortcode informs the user that Linode does not provide automatic updates to the Marketplace app, and that the user is responsible for the security and longevity of the installation. -->
{{< content "marketplace-update-note">}}