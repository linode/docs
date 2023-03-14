---
slug: popular-linux-games-overview-and-configuration-tips
description: 'This guide discusses popular Linux games and helpful configuration tips for common issues when setting them up.'
keywords: ['best linux games']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-03
modified_by:
  name: Linode
title: "An Overview of Popular Linux Games and Configuration Tips"
title_meta: "Popular Linux Games and Configuration Tips"
authors: ["Sandro Villinger"]
---

Once a niche industry, gaming under Linux is now a growing market for publishers and gamers alike. In this guide, you learn about popular Linux games and helpful configurations for common issues when setting them up.

## Dying Light: Enhanced Edition

Dying Light combines Parkour with a zombie apocalypse. This game was released in 2015 and is still being maintained by the publisher [Techland](https://techland.net/). The release of Dying Light 2 is scheduled for December 7th, 2021. Techland is currently releasing massive downloadable content (DLCs), which enhances the fun you can have while playing this game. It supports a four-player co-op via LAN so you can get a good old LAN party going.

### Dying Light Configuration Tip

The game’s performance can be slower on Linux. Use the `LD_PRELOAD="libpthread.so.0 libGL.so.1" __GL_THREADED_OPTIMIZATIONS=1 %command% -force-glcore` command when launching Steam.

## Desperados 3

Desperados 3 is a true gaming classic that made its comeback in 2020 with full support for Linux. The single-player top-down strategy game set in the wild west is notoriously hard, but captures the essence of the final frontier better than most other games. A unique soundtrack, great characters, and gameplay make it one of the top Linux titles to own.

### Desperados 3 Configuration Tip

If you’re coming from Windows and played the game before, you’ll notice that the saved games won’t sync between platforms. However, you can manually copy it over from Windows (`%appdata%\Desperados III`) to Linux (`$XDG_DATA_HOME/Desperados III`).

## Minecraft

One of the biggest games of all time runs on every platform imaginable. The Java version, which runs on Linux, is surprisingly stable, and offers the same experience every MC fan loves. Minecraft is an open-world sandbox that lets you explore and craft your own structures, play with friends, and play to survive.

### Minecraft Configuration Tip

We recommend [you use MultiMC](https://multimc.org/#Download). MultiMc is an open-source launcher for Minecraft that allows you to launch the game with mods, resource packs, and allows you to save games. It also offers extra diagnostic tools in case Minecraft stutters or freezes. If performance is a concern, one mod you need to try is [*OptiFine*](https://optifine.net/downloads) which allows for a massive FPS boost.

## Shadow of the Tomb Raider

One of the biggest comebacks in gaming history celebrated its glorious finale with Shadow of the Tomb Raider, the third installment in the series. Surprisingly, Eidos and Crystal Dynamics allowed 3rd party developer "[Feral Interactive](https://www.feralinteractive.com/en/)" to port the game to Linux.

The story centers around a young Lara Croft growing into the iconic adult explorer from the very first game. It sports beautiful set pieces, such as ancient Inca grounds or snow-covered mountains.

### Shadow of the Tomb Raider Configuration Tip

Feral tested the game with Ubuntu 18.04 which is where it runs best. To boost performance, Feral released its own [*Game Mode*](https://github.com/FeralInteractive/gamemode) which boosts its speed on Linux.

## Borderlands 2 and 3

The quirky cell-shading first-person shooter got its prequel a few years ago – which still stands as one of the best shooters ever made. It’s a space-western that combines classic FPS-style gameplay with role-playing elements. This means you can level up with a complex level and skill tree. You can specialize your character that way and turn them into very different classes, such as Assassin, Commando, or even Psycho. The game has a ton of new DLCs.

### Borderlands 2 and 3 Configuration Tip

If you experience crashes when launching the game, a workaround is copying a saved file from Windows to the save folder on your Linux machine. It sounds odd, but it can help you run the game on Linux without issues. You can even run the newly released Borderlands 3 via Steam Play. This method works, however, some videos might not play. Check out [this YoutTube video on how to run Borderlands 3 on Linux](https://www.youtube.com/watch?v=TQaO-TiSU1Q&feature=emb_title).

## Celeste

[Celeste](http://www.celestegame.com/) an Indie hit and an achievement in storytelling and atmosphere. The game combines mechanics from Super Mario, Metroid, and Super Meat Boy with a beautiful story about a depressed girl (Madeline) who is trying to reach a mountain. She finds quirky characters along the way, as well as a dark version of herself.

The Linux version on Steam should run normally. However, some gamers have recently complained about bugs that prevent it from launching. You can also try to launch the native version from [Itch.io](https://itch.io/search?q=celeste) to launch the game normally.

## Rocket League

Rocket League combines soccer with remote-controlled cars. Rocket League is no longer a small indie title, it’s one of the most played games ever. The game is addictive and supports a four-player co-op. It includes great graphics and an upbeat dance soundtrack.

{{< note respectIndent=false >}}
The official support for Linux has been stopped, but the game still runs well although some features might not work anymore. You can still play locally with friends.
{{< /note >}}

## Metro Exodus

Metro Exodus combines great storytelling with next-gen graphics. The Metro series blends exploration, horror, and alternative history. Set in an alternate 2036, mankind now lives in nuclear winter. The story is set in the ruins of Moscow where you have to fight mutants and other humans.

## How to Play Non-native Linux Games

There are a plethora of big games that are not natively available on Linux. In such cases, try Steam Play by right-clicking on a game in your library to force Steam Play. This runs a modified version of Wine and DXVK for DirectX 10/11 games, which allows for Linux compatibility. Some games work with this method, others might not run at all or will run with issues.

### How Do I Find Linux Games on Steam?

The biggest gaming client, [Steam](/docs/guides/install-steamcmd-for-a-steam-game-server/), lets you find, buy, and run Linux games easily. Open Steam, go to the [Store Page](https://store.steampowered.com/), click on **Categories**, and then click **SteamOS + Linux**.

This brings you to the storefront for Linux games. Scroll down to the **New and Trending**, **Top Sellers**, and **Upcoming** tabs to find the available games.
