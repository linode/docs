---
author:
  name: Angel
  email: docs@linode.com
description: "Nextcloud is an open source solution to hosting your own content online. In addition to the total control users gain over their own files, Nextcloud offers customizable security features that allow the user to take control of sharing and access privileges, among other features."
og_description: 'Nextcloud 13 Brings Improved UI, Video and Text Chat, End-to-end Encryption wrapped into a cloud storage platform. This guide will walk you through installing Nextcloud 13, using Docker."
keywords: ["nextcloud", "cloud", "open source hosting"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-03-14
modified: 2017-03-15
modified_by:
  name: Angel
title: 'Install NextCloud 13'
external_resources:
---

Nextcloud 13 offers users the ability to self-host a video and text chat platform, featuring end-to-end encryption, and of course the cloud storage platform. This guide will walk you through setting up Nextcloud, and taking advantage of the video chat platform built into the latest release of Nextcloud. 

When using [Docker](https://www.docker.com) to containerize your applications, it is common practice to run each component of the application in a separate container. For example, a website might have a web server, application, and database, each running in its own container.
## Before You Begin

### Install Docker CE

You will need a Linode with Docker CE installed to follow along with the steps in this guide.

{{< content "install_docker_ce.md" >}}

### Install Nextcloud 13 and Talk

Now that Docker is installed, pull the Nextcloud 13 image and run it. Talk is the video chat platform add-on offered by Nextcloud. It's built on [Spreed](https://github.com/nextcloud/spreed)

1. Pull and run the Nextcloud image:

        docker run -d -p 8080:80 nextcloud

2. Create an admin account:

![Admin_account_creation](/docs/assets/docker_nextcloud/admin_creation.png)

3. Install the Talk add-on:

![talk_addon](/docs/assets/docker_nextcloud/talk_addon.png)

### How to use Talk

Nextcloud 13 offers a full suite of addons that can be used my many people. Talk works by allowing all the users that are registered to your Nextcloud instance to communicate with each other. Nextcloud Talk offers simple text chat, private or group password protected calls, and screen sharing. Nextcloud Talk is built using [WebRTC](https://simplewebrtc.com/), and works on your browser. Navigate to the **Users** section of the Nextcloud interface, and create logins for your team to use. After the logins are distributed amongst your team, your team can communicate with eachother. 

