---
slug: minecraft-with-spigot-ubuntu
description: 'This guide shows how to set up, configure, and customize a Minecraft game server using the Spigot application on a Linode running Ubuntu 14.04.'
keywords: ["minecraft", "spigot"]
tags: ["ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/applications/game-servers/minecraft-with-spigot-ubuntu/','/game-servers/minecraft-with-spigot-ubuntu/']
deprecated: true
published: 2015-04-21
modified: 2019-02-01
modified_by:
  name: Linode
title: "Setting Up a Spigot Server for Minecraft on Ubuntu 14.04"
title_meta: "How to Set Up a Spigot Server for Minecraft on Ubuntu 14.04"
dedicated_cpu_link: true
image: spigot-minecraft-ubuntu-title.jpg
authors: ["Sam Mauldin"]
---

This guide shows you how to setup your own Minecraft server on a Linode running Ubuntu 14.04/14.10. You can play online with your friends or host a public server.

We'll compile the [Spigot](https://spigotmc.com) Minecraft server (1.8.3 at the time of publication) so you can use the whole expanse of [Bukkit](https://bukkit.org/) plugins available.

## Preparation

1.  Make sure your system is up to date:

        sudo apt update && sudo apt upgrade

1.  Install `git` and `openJDK`:

        sudo apt install git openjdk-7-jre-headless

    {{< note respectIndent=false >}}
If your Linode is running Ubuntu 14.10 or higher, you can choose to install `openjdk-8-jre-headless` instead.
{{< /note >}}

1.  Run `java -version` to confirm. You should see something like this:

        java version "1.7.0_75"
        OpenJDK Runtime Environment (IcedTea 2.5.4) (7u75-2.5.4-1~trusty1)
        OpenJDK 64-Bit Server VM (build 24.75-b04, mixed mode)

1.  If you're running an IP tables firewall (as shown in the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide), add an exception to your `iptables` rules:

        sudo iptables -A INPUT -p tcp --dport 25565 -j ACCEPT

    If you're running a different firewall, an exception will also need to be added.

## Create a Minecraft user

1.  Create a Minecraft user:

        sudo adduser minecraft

1.  Login to the Minecraft user:

        sudo su - minecraft

## Install SpigotMC

1.  Download and build SpigotMC:

        mkdir build
        cd build
        wget https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar
        java -jar BuildTools.jar

    {{< note respectIndent=false >}}
This may take approximately 10 minutes, depending in the size of the Linode you are building on.
{{< /note >}}

1.	When the build has finished, move the resulting `.jar` file to a server folder:

        mkdir ../server
        cd ../server
        mv ../build/spigot-1.*.jar spigot.jar

1.	We'll make a few scripts to make sure that your server's always up. Open a file called `wrapper.sh` in your preferred text editor. In the text editor, insert the following:

    {{< file "/home/minecraft/server/wrapper.sh" sh >}}
#!/bin/bash
cd /home/minecraft/server;

java -XX:MaxPermSize=1024M -Xms512M -Xmx1536M -jar spigot.jar

{{< /file >}}


    The values in this file are suggested for a Linode 2GB. You may want to change the RAM allocation depending on your Linode size.

1.  Make the file executable:

        chmod +x /home/minecraft/server/wrapper.sh

1.  Start SpigotMC for the first time:

        java -Xms512M -Xmx900M -jar spigot.jar

    It will terminate with the message:

        INFO]: You need to agree to the EULA in order to run the server. Go to eula.txt for more info.

1.  Open `eula.txt` and set the value to `true`:

    {{< file "/home/minecraft/server/eula.txt" >}}
By changing the setting below to TRUE you are indicating your agreement to our EULA (https://account.mojang.com/documents/minecraft_eula).
#Fri Apr 17 17:02:15 UTC 2015
eula=true
{{< /file >}}


## Configure SpigotMC to start on boot

1.  Exit out of the minecraft user:

        exit

1.  As the root user or with `sudo`, open `/etc/rc.local` and add the following before the `exit 0` line:

    {{< file "/etc/local.rc" >}}
su -l minecraft -c "screen -dmS minecraft /home/minecraft/server/wrapper.sh"
{{< /file >}}

    This line will, at reboot, create a new [Screen](/docs/guides/using-gnu-screen-to-manage-persistent-terminal-sessions/) session as the Minecraft user, and launch SpigotMC in it.

1.  Manually start Spigot:

        sudo su -l minecraft -c "screen -dmS minecraft /home/minecraft/server/wrapper.sh"

    To access the console, type `screen -r` as your **minecraft** user (note if you `su` to the user, you will need to run `script /dev/null` before you can attach to the Screen session).

    You can now follow the [Connecting to your Minecraft Server](/docs/guides/how-to-set-up-minecraft-server-on-ubuntu-or-debian/#connect-to-your-minecraft-server) steps from our vanilla Minecraft guide to log in to your new SpigotMC server.

    To run admin commands during the game, first run `op username` from the console, replacing `username` with your in-game username. Have fun playing on your new Minecraft server!

## Customization

### Server Properties

Customize the server by editing values in `/home/minecraft/server/server.properties`.

-   **Enable command blocks:** Values available are `true` and `false`.

        enable-command-block=false


-   **Gamemode**: Values available are 0 through 3; 0 is survival, 1 is creative, 2 is adventure and 3 is spectator.

        gamemode=0

-   **Difficulty**: Values available are 0 through 3; 0 is peaceful, 1 is easy, 2 is normal, and 3 is hard.

        difficulty=1

-   **MOTD**: Stands for Message Of The Day. Accepts a string value.

        motd=A Minecraft Server

-   **PVP**: Values available are `true` and `false`.

        pvp=true

-	**Other**: See the [Minecraft](http://minecraft.gamepedia.com/Server.properties) wiki for more details.

### Plugins

Plugins can be found from the [Spigot Resources](http://www.spigotmc.org/resources/) or  [Bukkit Plugins](http://dev.bukkit.org/bukkit-plugins/) pages.

1.  To add plugins, download the `.jar` file to the `/home/minecraft/server/plugins` directory:

        wget -P /home/minecraft/server/plugins/ --content-disposition <plugin url>

    {{< note respectIndent=false >}}
When downloading plugins from Spigot, the `wget` flag `--content-disposition` will help ensure the plugin is downloaded with the correct filename.
{{< /note >}}

1.  From within your screen session, enter `stop` to stop the server and exit the screen session. Your plugin will be loaded when you next start the SpigotMC server:

        su -l minecraft -c "screen -dmS minecraft /home/minecraft/server/wrapper.sh"
