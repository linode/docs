---
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'A third party server for Minecraft Pocket Edition'
keywords: ["minecraft", "pocketmine", "debian"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
 - '[PocketMine.net](https://www.pocketmine.net/)'
 - '[PocketMine Documentation](http://pocketmine-mp.readthedocs.org/en/latest/)'
modified: 2015-04-02
modified_by:
  name: Alex Fornuto
published: 2015-04-02
title: 'PocketMine Server on Debian 7'
aliases: ['applications/game-servers/pocketmine-server-on-debian-7/']
---

PocketMine is a third party server for the MineCraft - Pocket Edition game for [Android](https://play.google.com/store/apps/details?id=com.mojang.minecraftpe) and [iOS](https://itunes.apple.com/us/app/minecraft-pocket-edition/id479516143?mt=8). It features plugin support, allowing you to customize your gameplay with others. This guide details installing PocketMine on a Linode running Debian 7.

{{< note >}}
Minecraft - Pocket Edition is non-free software that you will need to purchase in order to take advantage of a PocketMine server.
{{< /note >}}

## Prerequisites

1.  Your Linode should already be configured per our [Getting Started](/docs/getting-started) guide, and secured per our [Securing Your Server](/docs/security/securing-your-server) guide.

2.  Ensure that your Linode is up to date:

        sudo apt-get update && sudo apt-get upgrade

3.  Install dependencies:

        sudo apt-get install perl gcc g++ make automake libtool autoconf m4

4.  Create a user for the PocketMine server:

        sudo adduser pocketmine

    {{< note >}}
If you've followed the steps in our [Securing Your Server](/docs/security/securing-your-server) guide, you will need to add your public key to `/home/pocketmine/.ssh/authorized_keys` in order to log in as this user later in the guide. You will also need to add an iptables exception for port `19132`
{{< /note >}}

## Installation

1.  Log in as the `pocketmine` user and go to its home directory:

        cd ~/

2.  Download and run the PocketMine installer script:

        wget -q -O - http://get.pocketmine.net/ | bash

    The installation will take several minutes.

## Running PocketMine Server

1.  Run the `start.sh` script within a GNU-screen instance:

        screen ./start.sh

    {{< note >}}
If you've used `su` to switch to the pocketmine user, you will get an error message stating `Cannot open your terminal '/dev/pts/0' - please check.` when attempting to start screen. You can resolve this by first running the command:

script /dev/null
{{< /note >}}

    {{< caution >}}
PocketMine may not run properly on systems not running PHP7. You can manually install it, or modify `start.sh`, replacing all instances of `php7` with `php5`:

sed -i -e 's/php7/php5/g' start.sh
{{< /caution >}}

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

5.  You can detach from the PocketMine screen session with the command `ctrl+a` then `d`. To reattach, run:

        screen -r

## Connecting to The Server

1.  Open Minecraft - Pocket Edition on your phone or tablet. Tap on **Play**:

    [![Minecraft Pocket Edition.](/docs/assets/pocketmine-game-home_small.png)](/docs/assets/pocketmine-game-home.png)

2.  From the next screen, tap **Edit**, then **External**.


3.  Enter a name under `Server Name`, and your Linode's domain or IP address under `Address`. When you're done, tap **Add Server**:

    [![Adding a remote server to Minecraft Pocket Edition.](/docs/assets/pocketmine-add-server_small.png)](/docs/assets/pocketmine-add-server.png)

4.  You can now connect to your server, and begin playing!

    [![Gameplay on the PocketMine server.](/docs/assets/pocketmine-gameplay_small.png)](/docs/assets/pocketmine-gameplay.png)

## Installing Plugins

You can downloaded plugins for PocketMine from their [site](http://forums.pocketmine.net/plugins/). As an example, we'll download and install the [RandomItem](http://forums.pocketmine.net/plugins/randomitem.203/) plugin.

1.  From the plugin page, copy the **Download Plugin** link address:

    [![A plugin download page.](/docs/assets/pocketmine-plugin-page_small.png)](/docs/assets/pocketmine-plugin-page.png)

2.  In your Linode terminal, while detached from your screen session, use `curl` to download the plugin into the `plugins` directory:

        cd /home/pocketmine/plugins
        curl -OJL http://forums.pocketmine.net/plugins/randomitem.203/download?version=1461

3.  Reattach to the screen session, and reload to activate the plugin:

        screen -r
        reload

4.  Confirm that your plugin is loaded with the command `plugins`:

        plugins
        18:36:45 [INFO] Plugins (1): RandomItem v4.2
