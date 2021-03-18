---
slug: linux-game-server
author:
  name: Sandro Villinger
  email: webmaster@windows-tweaks.info
description: 'Are you considering hosting a game server on Linux? Here&#39;s what you need to get started, including resource requirements, choosing a Linux distro, and picking the games to host.'
og_description: 'Are you considering hosting a game server on Linux? Here&#39;s what you need to get started, including resource requirements, choosing a Linux distro, and picking the games to host.'
keywords: ['linux game server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-08
modified_by:
  name: Linode
title: "Get started with Linux game server hosting"
h1_title: "Get Started with Linux Game Server Hosting"
contributor:
  name: Sandro Villinger
  link:
---

If you want the best gaming performance and lowest latency, or if you just want to play by your own rules, it's time you set up your own dedicated game server. You can do so for [Minecraft](/docs/guides/deploying-minecraft-with-marketplace-apps/), CS:GO, Grand Theft Auto's popular [FiveM](https://fivem.net/) mod, or any other multiplayer game that supports dedicated server hosting.

This guide helps you understand what is involved in setting up your own Linux game servers. It covers the top reasons for hosting your own game server, computing requirements, Linux distro recommendations, and setup advice.

## The Benefits of Hosting Your Own Linux Game Server

Creating a dedicated gaming server seems like a daunting task, especially when the easiest option is to just join any server that's hosted by the game makers or various platforms. However, if you're really in love with a certain game, then hosting your own game server has massive benefits:

- **Limit who has access to your game servers**: Since you manage the game server, you can control who is able to join it. If you want to limit the game server to only host your friends, you have the power to do that. You can also set your game server's rules and add your favorite customizations. For example, host your own [Grand Theft Auto V FiveM](https://fivem.net/) world with unique [scripts](https://github.com/FiveM-Scripts). These scripts change the GTA V FiveM world into something entirely different, using new rules, jobs, overlays, and world principles.

     ![A small example of a FiveM script](Linux_game_server1.png)

    _This image displays a simple example of [a FiveM script](https://forum.cfx.re/latest). The script adds a dedicated HuD for any vehicle that shows the speed next to your world map. This is one of hundred scripts you can add to your Linux game server._

- **Improved network throughput**: Hosting your own server in a data center that is geographically closer to you and your players means decreased network latency.Capping the amount of players allowed to play at one time also helps decrease latency. High ping and latency can kill your gameplay – and your player characters. When you experience high latency, your character can be hit before you realize someone was shooting at you.

**Dedicated server resources**: If you use a dedicated CPU server on Linode, you are not sharing your server's resources. This means your gameserver can execute at top performance free from the effects of CPU steal. In most cases, you won't host hundreds of thousands of players, so you shouldn't expect any downtime or poor performance caused by overload.

## System Requirements

The games themselves often require [dedicated GPUs](https://www.linode.com/docs/guides/getting-started-with-gpu/) and CPUs. However, the game server only needs to handle your game's client-server requests. Even for higher-end games, such as GTA V FiveM, a 4 CPU core server running with 4GB of RAM should have sufficient resources. The server's SSD, allows it to handle requests from all gamers nearly instantaneously.

Linode's basic [dedicated CPU 4 GB plan](https://www.linode.com/products/dedicated-cpu/) includes two CPUs, and 80 GB SSD which can support most dedicated game servers.

You should, however, be aware that heavily modded games, like Minecraft, can consume a lot more system resources. In general, you should refer to a game's documentation to determine its specific resource requirements before selecting your game server's plan.

## Your Game Server's Linux Distribution

The general consensus in the gaming community is that Debian or Ubuntu are the best Linux distributions to use for when it comes to your game server. Both offer rock-solid performance and everything you need to get a game server up and running. Debian and Ubuntu are also designed to easily run headless without an active shell, which can save on your game server's system resources.

## Hosting your Game Server on a Linode

### Linode One-Click App Marketplace

[Linode's One-Click App Marketplace](https://www.linode.com/marketplace/apps/) offers easy to deploy gaming servers for some games including [Ark](https://www.linode.com/marketplace/apps/linode/ark-game-server/), [Team Fortress 2](https://www.linode.com/marketplace/apps/linode/tf2-game-server/) and [Terraria](https://www.linode.com/marketplace/apps/linode/terraria-game-server/). You can refer to each [Marketplace App's Linode documentation](https://www.linode.com/docs/guides/platform/marketplace/) to learn how to deploy your game server, provide the appropriate configurations, and select the server's appropriate plan size.

{{< note >}}
You can watch the developer Gardiner Bryant explaining [how to set up a Rust server through the Linode marketplace](https://www.youtube.com/watch?v=RPbIRbj0GyA) on Linode's YouTube channel.
{{</ note >}}

## Manually Installing Linux Game Servers

If your game isn't available as a Marketplace App, you can deploy a Linode and manually install your game. You can check out our documentation library, which has

To make life simpler, many popular games can be set up via [LinuxGSM](https://linuxgsm.com/lgsm/sdtdserver/), a command line tool that automates a lot of the process of installing Steam and its dependencies; it even downloads the game to your server. If you use LinuxGSM to set up a specific game, its website shows you which dependencies are necessary and usually downloads what&#39;s missing.

For Steam games you need to disable the Steam Guard feature that asks you to verify a login from a new computer. It wouldn't work, because you can&#39;t see the 2FA code in your headless Linux server.

To make things easier, consult these dedicated guides for popular games to help you set up your own Linode server:

- [How to set up a 7 Days to Die Server](https://www.linode.com/docs/guides/game-servers/7dtd/index.md
)
- [Launch a Counter Strike: Global Offensive (CS:GO) server on Ubuntu 18.04](https://www.linode.com/docs/guides/launch-a-counter-strike-global-offensive-server-on-ubuntu-18-04/)
- [How to Setup a Terraria Linux Server](https://www.linode.com/docs/guides/host-a-terraria-server-on-your-linode/)