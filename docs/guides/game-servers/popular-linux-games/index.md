---
slug: popular-linux-games-overview-and-configuration-tips
author:
  name: Sandro Villinger
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-23
modified_by:
  name: Linode
title: "An Overview of Popular Linux Games"
h1_title: "An Overview of Popular Linux Games and Configuration Tips"
enable_h1: true
contributor:
  name: Sandro Villinger
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

Once a niche industry, gaming under Linux is now a growing market for publishers and gamers alike. In this guide, you learn about popular Linux games and helpful configurations for common issues when setting them up.

## Dying Light: Enhanced Edition

Dying Light combines Parkour with a zombie apocalypse. This game was released in 2015 and is still being maintained by publisher [Techland](https://techland.net/). The release of Dying Light 2 is scheduled for December 7th, 2021. Techland is currently releasing massive downloadable content (DLCs), which enhances the fun you can have while playing this game. It supports four player co-op via LAN so you can get a good old LAN party going.

### Dying Light Configuration Tip

The game’s performance can be slower on Linux. Use the `LD_PRELOAD="libpthread.so.0 libGL.so.1" __GL_THREADED_OPTIMIZATIONS=1 %command% -force-glcore` command when launching Steam.

## Desperados 3

Desperados 3 is a true gaming classic that made its comeback in 2020 with full support for Linux. The single-player top-down strategy game set in the wild west is notoriously hard but captures the essence of the final frontier better than most other games. A unique soundtrack, great characters, and great gameplay make it one of the top Linux titles to own.

### Desperados 3 Configuration Tip

If you’re coming from Windows and played the game before, you’ll notice that the save games won’t sync between platforms. However, you can manually copy it over from Windows (`%appdata%\Desperados III`) to Linux (`$XDG_DATA_HOME/Desperados III`).

## Minecraft

One of the biggest games of all time essentially runs on every platform imaginable. It’s not surprising that Linux support came in early and it’s working as well as under Linux. The Java version, which runs on Linux, is surprisingly stable and offers the same experience every MC fan loves: An open world sandbox which lets you explore and craft your own structures, play with friends and simply survive.

### Minecraft Configuration Tip

We recommend [you use MultiMC](https://multimc.org/#Download) – an open source launcher for Minecraft that allows you to launch the game with mods, save games, and resource packs. It also offers extra diagnostic tools in case Minecraft stutters or freezes. One mod you need to try if performance is a concern is OptiFine which allows for a massive FPS boost.

## Shadow of the Tomb Raider

One of the biggest comebacks in gaming history celebrated its glorious finale with Shadow of the Tomb Raider, the third installment in the series. Surprisingly, Eidos and Crystal Dynamics allowed 3rd party developer “Feral interactive” to port the game to Linux.

The story centers around a young Lara Croft growing into the iconic adult explorer from the very first game. It sports beautiful set pieces, such as ancient Inca grounds or snow-covered mountains.

### Shadow of the Tomb Raider Configuration Tip
Feral tested the game with Ubuntu 18 which is where it runs best. To boost performance, Feral released its own [*Game Mode*](https://github.com/FeralInteractive/gamemode) which boosts speed on Linux on demand. We plan to cover this app in a future blog post.

## Borderlands 2 and 3

The quirky cell-shading first person shooter got its prequel a few years ago – which still stands as one of the best shooters ever made. It’s a space-western which combines classic FPS style gameplay with role playing elements, so you can level up with a complex level and skill tree. You can specialize your character that way and turn him or her into very different classes, such as Assassin, Commando, or even “Psycho”. The game has a ton of new DLCs.

### Borderlands 2 and 3 Configuration Tip

If you experience crashes when launching the game, a workaround is copying a save file from Windows to the save folder on Linux. It sounds odd, but it can help you run the game on Linux without issues. You can even run the newly released Borderlands 3 via Steam Play. This works fine, except that some videos might not play. Check out [this video on how to run Borderlands 3 on Linux](https://www.youtube.com/watch?v=TQaO-TiSU1Q&feature=emb_title).

## Celeste

When an NES-style game makes you cry and feel empathetic with a character that consists of a few dozen of pixels only, it’s quite an achievement in storytelling and atmosphere. Indie hit Celeste is one of my favorite games to play on Linux.

The game is a tough as nails 2D platformer that combines mechanics from Super Mario, Metroid, and Super Meat Boy with a beautiful story about a depressed girl (Madeline) who is trying to reach a mountain. She finds quirky characters along the way, as well as a dark version of herself.

The Linux version on Steam should run normally. However, some gamers have recently complained about bugs that prevent it from launching which should be resolved soon. You can also try to launch the native version from [Itch.io](https://itch.io/) to launch the game normally.

## Rocket League

Whoever thought of combining soccer with remote controlled cars must be a genius. The concept sounds crazy, but it works. Rocket League is no longer a small indie title, it’s one of the most played games ever. The game is addictive and supports four player co-op so you can sit down with your best friends and have “soccer” matches at home that exceed the real deal. The fancy graphics and a sweet upbeat dance soundtrack are icing on the cake.

{{< note >}}
The official support for Linux has been stopped, but the game still runs well although some features might not work anymore. You can still play locally with friends just fine.
{{< /note >}}

## Metro Exodus

This big title is on my pile of shame. Great storytelling combined with next gen graphics. The Metro series blends exploration, horror, and alternative history into one near and dark package. Set in an alternate 2036, mankind now lives in nuclear winter. The story is set in the ruins of Moscow where you have to fight mutants and other humans.

## What about all big blockbuster games?

There are a plethora of big games that are not natively available on Linux. In such cases, try Steam Play by right-clicking on a game in your library to force Steam Play. This will run a modified version of Wine and DXVK for DirectX 10/11 games, which allows for Linux compatibility. Some games work with this “hack”, others might not run at all or with issues.

### What about VR?

Virtual Reality headsets like the Oculus Quest 2 seen above, are becoming more mainstream. Linux still remains a niche in the gaming space. Facebook focuses on Windows first and getting VR to run on Mac is not an easy undertaking. For now we would not recommend trying out VR under Linux. This blog post, [The State of Virtual Reality on Linux](https://boilingsteam.com/the-state-of-virtual-reality-on-linux/) - Boiling Steam, covers it well.

### How do I find Linux games on Steam?

The biggest gaming client, Steam, lets you find, buy, and run Linux games easily. Open up Steam, go to the [Store page](https://store.steampowered.com/) and click on Categories.

Click on SteamOS + Linux. This gets you to the storefront for Linux games. Scroll down and go to the Top Seller, New, and Trending and Upcoming section to find great games.