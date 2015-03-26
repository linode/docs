---
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'A third party server for Minecraft Pocket Edition'
keywords: 'minecraft,pocketmine,debian'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
external_resources:
 - '[PocketMine.net](https://www.pocketmine.net/)'
 - '[PocketMine Documentation](http://pocketmine-mp.readthedocs.org/en/latest/)'
modified: Thursday, March 26, 2015
modified_by:
  name: Alex Fornuto
published: ''
title: 'PocketMine Server on Debian 7'
---

PocketMine is a third party server for the MineCraft - Pocket Edition game for [Android](https://play.google.com/store/apps/details?id=com.mojang.minecraftpe) and [iOS](https://itunes.apple.com/us/app/minecraft-pocket-edition/id479516143?mt=8). It features plugin support, allowing you to customize your gameplay with others. This guide details installing PocketMine on a Linode running Debian 7.

{: .note }
> Minecraft - Pocket Edition is non-free software that you will need to purchase in order to take advantage of a PocketMine server.

##Prerequisites

1.  Ensure that your Linode is up to date:

        apt-get update; apt-get upgrade

2.  Install dependancies:

        apt-get install perl gcc g++ make automake libtool autoconf m4

2.  Create a user for the PocketMine server:

        adduser pocketmine


##Installation

1.  Log in as the `pocketmine` user and go to its home directory:

        cd ~/

2.  Download and run the PocketMine installer script:

        wget -q -O - http://get.pocketmine.net/ | bash

    The installation will take several minutes.

## Running PocketMine Server

1.  Run the `start.sh` script within a GNU-screen instance:

        screen ./start.sh

2.  The set-up wizard will begin by asking you to select a language. Enter the two-character value for your language of choice, or just press **return** for English.

        [*] PocketMine-MP set-up wizard
        [*] Please select a language:
         English => en
         Español => es
         中文 => zh
         Pyccĸий => ru
         日本語 => ja
         Deutsch => de
         한국어 => ko
         Nederlands => nl
         Français => fr
         Italiano => it
         Melayu => ms
         Norsk => no
         Svenska => sv
         Suomi => fi
         Türkçe => tr
        [?] Language (en):

3.  Type `y` to accept the license agreement:

        Welcome to PocketMine-MP!
        Before starting setting up your new server you have to accept the license.
        PocketMine-MP is licensed under the LGPL License,
        that you can read opening the LICENSE file on this folder.

          This program is free software: you can redistribute it and/or modify
          it under the terms of the GNU Lesser General Public License as published by
          the Free Software Foundation, either version 3 of the License, or
          (at your option) any later version.

        [?] Do you accept the License? (y/N):y

4.  The set-up wizard will ask if you would like to skip ahead. If you would like to configure additional non-standard options, press **return**. Otherwise, you can enter `y` to skip the remainder of the wizard:

        [?] Do you want to skip the set-up wizard? (y/N): y

    You are now at the PocketMine console. You can type `help` to see all available commands, and begin using your new server!

        23:16:35 [INFO] Starting Minecraft: PE server version v0.10.5 alpha
        23:16:35 [INFO] Loading pocketmine.yml...
        23:16:35 [INFO] Loading server properties...
        23:16:35 [INFO] Starting Minecraft PE server on 0.0.0.0:19132
        sh: 1: ifconfig: not found
        23:16:36 [INFO] This server is running PocketMine-MP version 1.4.1-980 "絶好(Zekkou)ケーキ(Cake)" (API 1.11.0)
        23:16:36 [INFO] PocketMine-MP is distributed under the LGPL License
        23:16:36 [NOTICE] Level "world" not found
        23:16:36 [INFO] Preparing level "world"
        23:16:36 [NOTICE] Spawn terrain for level "world" is being generated in the background
        23:16:36 [INFO] Starting GS4 status listener
        23:16:36 [INFO] Setting query port to 19132
        23:16:36 [INFO] Query running on 0.0.0.0:19132
        23:16:36 [INFO] Default game type: SURVIVAL
        23:16:36 [INFO] Done (275.348s)! For help, type "help" or "?"

## Connecting to The Server

