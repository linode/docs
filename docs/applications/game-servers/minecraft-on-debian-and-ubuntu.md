---
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'A basic Minecraft server installation guide for Debian and Ubuntu'
keywords: 'minecraft,ubuntu,debian'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
external_resources:
- '[Minecraft.net](https://minecraft.net/)'
- '[The Official Minecraft Wiki](http://minecraft.gamepedia.com/Minecraft_Wiki)'
modified: Wednesday, January 28, 2015
modified_by:
  name: Alex Fornuto
published: 'Wednesday, January 28, 2015'
title: 'Minecraft on Debian and Ubuntu'
---

This guide shows you how to set up a personal [Minecraft](https://minecraft.net/game) server on a Linode running Debian 7 or Ubuntu 14.04 LTS.

##Prerequisites

{: .note }
> To use a Minecraft server you must also have a version of the game client from [Minecraft.net](https://minecraft.net/).

1.  Begin by updating your Linode's software:

        sudo apt-get update && sudo apt-get upgrade

2.  Install **OpenJDK**, an open-source implementation of Java:

        sudo apt-get install openjdk-7-jre-headless

3.  Create a new user for Minecraft to run as. Take note of the password you assign:

        sudo adduser minecraft

{: .note }
> If you have a firewall configured according to our [Securing Your Server](/docs/security/securing-your-server) guide, you will need to add an exception for port 25565. The line to add to your `iptables.firewall.rules` file is:
>
>     -A INPUT -p tcp --dport 25565 -j ACCEPT

##Install Minecraft

1.  Exit your SSH session, and log back in to your Linode as the `minecraft` user:

2.  Download the latest version of the Minecraft Multiplayer Server from [Minecraft.net](https://minecraft.net/). The current version as of publcation is 1.8.1. Refer to the linked page to download the latest version:

        wget https://s3.amazonaws.com/Minecraft.Download/versions/1.8.1/minecraft_server.1.8.1.jar

3.  Create a script to run the Minecraft server:

    {: .file }
    /home/minecraft/run.sh
    :   ~~~ sh
        #!/bin/sh
        BINDIR=$(dirname "$(readlink -fn "$0")")
        cd "$BINDIR"

        java -Xms512M -Xmx1000M -jar minecraft_server.1.8.1.jar -o true
        ~~~

    {: .note }
    > The `Xms` and `Xmx` flags define the minimum and maximum amount of RAM the Minecraft server will use. The settings above are recommended for a Linode 1GB used solely for this purpose. Adjust these values to fit your needs.

4.  Make `run.sh` executable:

        chmod +x run.sh

##Running Minecraft

1.  The first time you run the Minecraft server it will create an EULA file and then exit:

        $ ./run.sh
        [21:39:43] [Server thread/INFO]: Starting minecraft server version 1.8.1
        [21:39:43] [Server thread/INFO]: Loading properties
        [21:39:43] [Server thread/WARN]: server.properties does not exist
        [21:39:43] [Server thread/INFO]: Generating new properties file
        [21:39:43] [Server thread/WARN]: Failed to load eula.txt
        [21:39:43] [Server thread/INFO]: You need to agree to the EULA in order to run the server. Go to eula.txt for more info.
        [21:39:43] [Server thread/INFO]: Stopping server

2.  Open the `eula.txt` file and change the value of `eula` to true:

    {: .file }
    /home/minecraft/eula.txt
    :   ~~~ sh
        #By changing the setting below to TRUE you are indicating your agreement to our EULA (https://account.mojang.com/documents/minecraft_eula).
        #Tue Jan 27 21:40:00 UTC 2015
        eula=true
        ~~~


3.  To ensure that the Minecraft server runs, dependent of an SSH connection, execute `run.sh` from within a [GNU Screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions) session:

        screen /home/minecraft/run.sh

    The time, the Minecraft server console will generate a lot of output as it creates required text files, and generates the Minecraft world:

        [22:00:06] [Server thread/INFO]: Starting minecraft server version 1.8.1
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

##Connecting to your Minecraft Server

1.  Open your local Minecraft client. After logging in, click on the **Multiplayer** option:

    [![Minecraft Launch Menu.](/docs/assets/minecraft-select-multiplayer_small.png)](/docs/assets/minecraft-select-multiplayer.png)

2.  Click on **Add server** and enter your Linode's IP address or domain name. When you're finished click **Done**

    [![Edit Server Info.](/docs/assets/minecraft-server-info_small.png)](/docs/assets/minecraft-server-info.png)

3.  Your server is now available to connect to. Click **Join Server** to connect:

    [![Minecraft Server List.](/docs/assets/minecraft-server-added_small.png)](/docs/assets/minecraft-server-added.png)

    [![Minecraft Players.](/docs/assets/minecraft-gameplay_small.png)](/docs/assets/minecraft-gameplay.png)

Congratulations! You can now play Minecraft in a persistent world with your friends!


