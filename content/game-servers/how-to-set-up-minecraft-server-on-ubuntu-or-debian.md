---
author:
  name: Alex Fornuto
  email: docs@linode.com
description: 'This tutorial will teach you basic installation and configuration of a Minecraft server on Ubuntu and Debian
distributions'
aliases: ['applications/game-servers/minecraft-on-debian-and-ubuntu/','game-servers/minecraft-on-debian-and-ubuntu/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-07-30
modified_by:
  name: Linode
published: 2015-01-28
title: 'How to Set Up a Minecraft Server on Ubuntu or Debian'
external_resources:
 - '[Minecraft.net](https://minecraft.net/)'
 - '[The Official Minecraft Wiki](http://minecraft.gamepedia.com/Minecraft_Wiki)'
 - '[Official MineCraft Install Guide](http://minecraft.gamepedia.com/Tutorials/Setting_up_a_server#Debian)'
 - '[Documentation on the World of Color Update](http://minecraft.gamepedia.com/1.12)'
---

Minecraft is one of the most popular games in the world with over 100 million users. In Minecraft you and other players are free to build and explore anything you want in a 3D generated world. If you host your own Minecraft server, you decide the rules, and you and your friends can play together in this interactive adventure game.

This guide shows you how to set up a personal [Minecraft](https://minecraft.net/game) server on a Linode running Debian 8 or Ubuntu 16.04 LTS. We have updated this guide to be compatible with the major release of 1.12: The World of Color Update.

## Prerequisites

1.  To use a Minecraft server you must also have a version of the game client from [Minecraft.net](https://minecraft.net/).

2.  Complete our [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/securing-your-server) guides.

3.  Update your Linode's software:

        sudo apt update && sudo apt upgrade

3.  Install *OpenJDK*, an open-source implementation of Java, and the GNU Screen package.

	{{< note >}}
Minecraft version 1.12 is only compatible with OpenJDK 8. If you are using OpenJDK 7 you must remove it using this command
`sudo apt remove openjdk-7-\*` before continuing with this guide.
{{< /note >}}

    - In Ubuntu 16.04:

          sudo apt install openjdk-8-jre-headless screen

    - In Debian 8:

          sudo apt install openjdk-8-jre-headless screen

4.  Create a new user for Minecraft to run as:

        sudo adduser minecraft

    Assign a secure password, and configure any additional [SSH hardening](/docs/security/use-public-key-authentication-with-ssh) options at this time.

{{< note >}}
If you have a firewall configured according to our [Securing Your Server](/docs/security/securing-your-server) guide, add the following line to your `iptables.firewall.rules` file to add an exception for port 25565:

-A INPUT -p tcp --dport 25565 -j ACCEPT
{{< /note >}}

## Install Minecraft

1.  Exit your current SSH session and log back in to your Linode as the `minecraft` user.

2.  Download the latest version of the Minecraft Multiplayer Server from [Minecraft.net](https://minecraft.net/). Replace the URL in this example to match the current version:

        wget https://s3.amazonaws.com/Minecraft.Download/versions/1.12/minecraft_server.1.12.jar

    Refer to the [Minecraft server page](https://minecraft.net/en/download/server) to check for the latest release.

3.  Create a script to run the Minecraft server:

    {{< file "/home/minecraft/run.sh" sh >}}
#!/bin/sh
BINDIR=$(dirname "$(readlink -fn "$0")")
cd "$BINDIR"

java -Xms1024M -Xmx1536M -jar minecraft_server.1.12.jar -o true

{{< /file >}}


    {{< note >}}
The `Xms` and `Xmx` flags define the minimum and maximum amount of RAM the Minecraft server will use. The settings above are recommended for a Linode 2GB used solely for this purpose. Adjust these values to fit your needs.
{{< /note >}}

4.  Make `run.sh` executable:

        chmod +x /home/minecraft/run.sh

## Run Minecraft

1.  The first time you run the Minecraft server it will create an EULA file and then exit:

        $ ./run.sh
        [21:39:43] [Server thread/INFO]: Starting minecraft server version 1.12
        [21:39:43] [Server thread/INFO]: Loading properties
        [21:39:43] [Server thread/WARN]: server.properties does not exist
        [21:39:43] [Server thread/INFO]: Generating new properties file
        [21:39:43] [Server thread/WARN]: Failed to load eula.txt
        [21:39:43] [Server thread/INFO]: You need to agree to the EULA in order to run the server. Go to eula.txt for more info.
        [21:39:43] [Server thread/INFO]: Stopping server

2.  Open the `eula.txt` file and change the value of `eula` to true:

    {{< file "/home/minecraft/eula.txt" sh >}}
#By changing the setting below to TRUE you are indicating your agreement to our EULA (https://account.mojang.com/documents/minecraft_eula).
#Tue Jan 27 21:40:00 UTC 2015
eula=true

{{< /file >}}



3.  To ensure that the Minecraft server runs independent of an SSH connection, execute `run.sh` from within a [GNU Screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions) session:

        screen /home/minecraft/run.sh

    This time the Minecraft server console will generate a lot of output as it creates required configuration files and generates the Minecraft world:

        [22:00:06] [Server thread/INFO]: Starting minecraft server version 1.12
        [22:00:06] [Server thread/INFO]: Loading properties
        [22:00:06] [Server thread/INFO]: Default game type: SURVIVAL
        [22:00:06] [Server thread/INFO]: Generating keypair
        [22:00:07] [Server thread/INFO]: Starting Minecraft server on *:25565

        ....

        [22:00:07] [Server thread/INFO]: Preparing level "world"
        [22:00:08] [Server thread/INFO]: Preparing start region for level 0
        [22:00:09] [Server thread/INFO]: Preparing spawn area: 3%

        ....

        [22:00:21] [Server thread/INFO]: Preparing spawn area: 96%
        [22:00:22] [Server thread/INFO]: Done (14.737s)! For help, type "help" or "?"

    {{< note >}}
To disconnect from the screen session without stopping the game server, press **CTRL+a** and then **d**. To resume the running screen session, use the command `screen -r`.
{{< /note >}}

4.  Optionally, you can take this opportunity to disconnect from the screen session and customize your game settings. When the `run.sh` script is executed, a world is created with the default variables. If you would like to create a new world with updated variables (like [world seeds](http://minecraft.gamepedia.com/Seed_(level_generation))), change the `level-name` directive in the `server.properties` file and modify other settings accordingly.

    After stopping and restarting the server script with the `level-name` changed, a new directory is created that contains your game data for that world. For more information on available settings and how to modify them, refer to the [Minecraft Wiki settings page](http://minecraft.gamepedia.com/Server.properties).

## Connect to your Minecraft Server

1.  Open your local Minecraft client. After logging in, click on the **Multiplayer** option:

    [![Minecraft Launch Menu.](/docs/assets/minecraft-select-multiplayer_small.png)](/docs/assets/minecraft-select-multiplayer.png)

2.  Click on **Add server** and enter your Linode's IP address or domain name. When you're finished click **Done**:

    [![Edit Server Info.](/docs/assets/minecraft-server-info_small.png)](/docs/assets/minecraft-server-info.png)

3.  Your server is now available to incoming connections. Click **Join Server** to connect:

    [![Minecraft Server List.](/docs/assets/minecraft-server-added_small.png)](/docs/assets/minecraft-server-added.png)

    [![Minecraft Players.](/docs/assets/minecraft-gameplay_small.png)](/docs/assets/minecraft-gameplay.png)

Congratulations! You can now play Minecraft in a persistent world with your friends. For more information on working with `screen`, check out our guide on [GNU Screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions).
