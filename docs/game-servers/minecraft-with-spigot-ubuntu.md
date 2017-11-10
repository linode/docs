---
author:
  name: Linode Community
  email: contribute@linode.com
description: 'Set up, configure, and customize a Minecraft server using Spigot'
keywords: ["minecraft", "spigot", ""]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/game-servers/minecraft-ubuntu12-04/','applications/game-servers/minecraft-with-spigot-ubuntu/']
published: 2015-04-21
modified: 2015-04-21
modified_by:
  name: Elle Krout
title: 'Running a Spigot Minecraft Server on Ubuntu 14.04 and 14.10'
contributor:
    name: Sam Mauldin
    link: https://github.com/Sxw1212
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and
earn $250 per published guide.*

<hr>

This guide shows you how to setup your own Minecraft server on a Linode running Ubuntu 14.04/14.10. You can play online with your friends or host a public server.

We'll compile the [Spigot](https://spigotmc.com) Minecraft server (1.8.3 at the time of publication) so you can use the whole expanse of [Bukkit](https://bukkit.org/) plugins available.

## Preparation


1.  Make sure your system is up to date:

        sudo apt-get update && sudo apt-get upgrade

2.  Install `git` and `openJDK`:

        sudo apt-get install git openjdk-7-jre-headless

    {{< note >}}
If your Linode is running Ubuntu 14.10 or higher, you can choose to install `openjdk-8-jre-headless` instead.
{{< /note >}}

3.  Run `java -version` to confirm. You should see something like this:

        java version "1.7.0_75"
        OpenJDK Runtime Environment (IcedTea 2.5.4) (7u75-2.5.4-1~trusty1)
        OpenJDK 64-Bit Server VM (build 24.75-b04, mixed mode)

4.  If you're running an IP tables firewall (as shown in the [Securing Your Server](/docs/security/securing-your-server/) guide), add an exception to your `iptables` rules:

        sudo iptables -A INPUT -p tcp --dport 25565 -j ACCEPT

    If you're running a different firewall, an exception will also need to be added.

## Create a Minecraft user

1.  Create a Minecraft user:

        sudo adduser minecraft

2.  Login to the Minecraft user:

        sudo su - minecraft

## Install SpigotMC

1.  Download and build SpigotMC:

        mkdir build
        cd build
        wget https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar
        java -jar BuildTools.jar

    {{< note >}}
This may take approximately 10 minutes, depending in the size of the Linode you are building on.
{{< /note >}}

2.	When the build has finished, move the resulting `.jar` file to a server folder:

        mkdir ../server
        cd ../server
        mv ../build/spigot-1.*.jar spigot.jar

3.	We'll make a few scripts to make sure that your server's always up. Open a file called `wrapper.sh` in your preferred text editor. In the text editor, insert the following:

    {{< file "/home/minecraft/server/wrapper.sh" sh >}}
#!/bin/bash
cd /home/minecraft/server;

java -XX:MaxPermSize=1024M -Xms512M -Xmx1536M -jar spigot.jar

{{< /file >}}


    The values in this file are suggested for a Linode 2GB. You may want to change the RAM allocation depending on your Linode size.

4.  Make the file executable:

        chmod +x /home/minecraft/server/wrapper.sh

5.  Start SpigotMC for the first time:

        java -Xms512M -Xmx900M -jar spigot.jar

    It will terminate with the message:

        INFO]: You need to agree to the EULA in order to run the server. Go to eula.txt for more info.

6.  Open `eula.txt` and set the value to `true`:

    {{< file "/home/minecraft/server/eula.txt" >}}
By changing the setting below to TRUE you are indicating your agreement to our EULA (https://account.mojang.com/documents/minecraft_eula).
#Fri Apr 17 17:02:15 UTC 2015
eula=true

{{< /file >}}


## Configure SpigotMC to start on boot

1.  Exit out of the minecraft user:

        exit

2.  As the root user or with `sudo`, open `/etc/rc.local` and add the following before the `exit 0` line:

    {{< file-excerpt "/etc/local.rc" >}}
su -l minecraft -c "screen -dmS minecraft /home/minecraft/server/wrapper.sh"

{{< /file-excerpt >}}


    This line will, at reboot, create a new [Screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions) session as the Minecraft user, and launch SpigotMC in it.

5.  Manually start Spigot:

        sudo su -l minecraft -c "screen -dmS minecraft /home/minecraft/server/wrapper.sh"

    To access the console, type `screen -r` as your **minecraft** user (note if you `su` to the user, you will need to run `script /dev/null` before you can attach to the Screen session).

    You can now follow the [Connecting to your Minecraft Server](/docs/game-servers/how-to-set-up-minecraft-server-on-ubuntu-or-debian#connect-to-your-minecraft-server) steps from our vanilla Minecraft guide to log in to your new SpigotMC server.

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

    {{< note >}}
When downloading plugins from Spigot, the `wget` flag `--content-disposition` will help ensure the plugin is downloaded with the correct filename.
{{< /note >}}

2.  From within your screen session, enter `stop` to stop the server and exit the screen session. Your plugin will be loaded when you next start the SpigotMC server:

        su -l minecraft -c "screen -dmS minecraft /home/minecraft/server/wrapper.sh"

