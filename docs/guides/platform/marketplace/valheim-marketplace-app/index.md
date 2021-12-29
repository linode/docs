---
slug: valheim-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "Deploy Valheim, an open-world Viking themed survivial game, on Linode using Marketplace Apps."
keywords: ['gaming','game server','valheim']
tags: ["linode platform", "cloud manager", "marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-09
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying Valheim through the Linode Marketplace"
external_resources:
- '[LinuxGSM Valheim Documentation](https://linuxgsm.com/lgsm/vhserver/)'
- '[Valheim official website](https://www.valheimgame.com/)'
aliases: ['/guides/deploy-valheim-with-marketplace-apps/']
---

Valheim is an open-world Viking-themed survival and sandbox game developed by [Iron Gate Studio](https://irongatestudio.se/). Play solo in single player mode, or invite your friends for player vs. environment multiplayer mode. With challenging combat, numerous boss battles, and a creative building system that lets you craft things like halls, forts, and even imposing Viking warships, there's always something to do. Explore, build, conquer, and survive. The further you travel the more challenging adventures await.

Install Valheim on Linode with the Valheim Game Server Marketplace App to maximize your gaming experience.

## Deploying the Valheim Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 5-10 minutes after the Linode has finished provisioning.**

## Configuration Options

### Valheim Options

You can configure your Valheim Game Server by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **The username to be used with Valheim** | Your Valheim Username. This is used to log in to Valheim. *Required*. |
| **The server name to be used with Valheim** | Your Valheim server name. This is used to log in to Valheim. *Required* |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Debian 10
- **Recommended minimum plan:** 4GB Dedicated CPU Compute Instance

## Getting Started after Deployment

### Access your Valheim Game Server

After Valheim has finished installing, you can access your server with your Linode's IPv4 address. Copy your Linode’s IPv4 address from the [Linode Cloud Manager](https://cloud.linode.com), and then connect to the server within the game using your Linode's IPv4 address and port `2456`(for example `192.0.2.0:2456`).

![Valheim Select Server screen](valheim-login.png "Valheim Select Server screen")

For more on Valheim, check out the following resources:

- [LinuxGSM Valheim Documentation](https://linuxgsm.com/lgsm/vhserver/)
- [Valheim official website](https://www.valheimgame.com/)

{{< content "marketplace-update-note-shortguide">}}