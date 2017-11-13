---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Left 4 Dead 2 is a single-player game developed and published by Valve Inc. Left 4 Dead 2 also offers a great multiplayer mode. This guide will explain how to prepare your Linode, install SteamCMD, and then install and configure Left 4 Dead 2.'
keywords: ["left 4 dead", "l4d2", "game server", "steamCMD"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2016-02-25
modified: 2016-02-25
modified_by:
    name: Linode
title: 'Left 4 Dead 2 Multiplayer Server Installation'
contributor:
    name: Andrew Gottschling
    link: https://github.com/agottschling
aliases: ['applications/game-servers/left-4-dead-2-multiplayer-server-installation/']
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

[Left 4 Dead 2](http://www.l4d.com/game.html) is a single-player game developed and published by Valve Inc. Besides its fantastic single-player mode, Left 4 Dead 2 also offers a great multiplayer mode so you can blast zombies with your friends. This guide will explain how to prepare your Linode, install SteamCMD, and then install and configure Left 4 Dead 2 on Debian or Ubuntu.

## Before You Begin

You will need the following items to get started:

- A [Steam](http://store.steampowered.com) account.
- OPTIONAL (needed to test the server): A copy of [Left 4 Dead 2](http://store.steampowered.com/app/550/).
- A Linode with at least 2GB of RAM and 10GB of free disk space.
- An up-to-date Linode running Ubuntu or Debian. We suggest you follow our [Getting Started](/docs/getting-started) guide for help configuring your Linode.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the sudo command, reference the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Preparing your Linode

Left 4 Dead 2 is sold on Steam. Therefore, you will use SteamCMD to download and maintain the server for the game.

Because a current Linode runs on a 64-bit operating system, you need to download a few extra libraries in order to run SteamCMD.

1.  Configure the package manager to include accommodations for i386 architecture:

        sudo dpkg --add-architecture i386

2.  Update the system:

        sudo apt-get update && sudo apt-get upgrade

3.  Install requisite 32-bit libraries:

        sudo apt-get install lib32gcc1 lib32stdc++6 libc6-i386 libcurl4-gnutls-dev:i386 screen

    {{< note >}}
If you're running a legacy Linode on a 32-bit kernel, install these packages instead:

sudo apt-get install libcurl4-gnutls-dev:i386 libc6-i386 libgcc1 screen
{{< /note >}}

4.  If you have a firewall running on your Linode, add exceptions for SteamCMD:

        sudo iptables -A INPUT -p udp- m udp --sport 4380 --dport 1025:65355 -j ACCEPT
        sudo iptables -A INPUT -p udp -m udp --sport 10999 --dport 1025:65355 -j ACCEPT
        sudo iptables -A INPUT -p udp -m udp --sport 7777 --dport 1025:65355 -j ACCEPT
        sudo iptables -A INPUT -p udp -m udp --sport 27015 --dport 1025:65355 -j ACCEPT

    {{< note >}}
If you've configured your firewall according to our [Securing Your Server](/docs/security/securing-your-server) guide, be sure to add these port ranges to your `/etc/iptables.firewall.rules` file.
{{< /note >}}

## Install SteamCMD and Left 4 Dead 2

{{< note >}}
This guide requires additional libraries which are not included in our standard [SteamCMD Guide](/docs/applications/game-servers/install-steamcmd-for-a-steam-game-server).  This guide includes standalone configuration instructions for SteamCMD.  If you have already followed our SteamCMD installation guide, you can skip to step 4.
{{< /note >}}

1.  From your user's home folder, download SteamCMD into its own directory:

        mkdir Steam
        cd Steam
        wget http://media.steampowered.com/installer/steamcmd_linux.tar.gz

2.  Extract the package and remove the archive file:

        tar -xvzf steamcmd_linux.tar.gz
        rm steamcmd_linux.tar.gz

3.  Run the SteamCMD installer:

        ./steamcmd.sh

    This command will display output similar to this:

        Redirecting stderr to '/home/steam/Steam/logs/stderr.txt'
        [  0%] Checking for available updates...
        [----] Downloading update (0 of 7,013 KB)...
        [  0%] Downloading update (1,300 of 7,013 KB)...
        [ 18%] Downloading update (3,412 of 7,013 KB)...
        [ 48%] Downloading update (5,131 of 7,013 KB)...
        [ 73%] Downloading update (6,397 of 7,013 KB)...
        [ 91%] Downloading update (7,013 of 7,013 KB)...
        [100%] Download complete.
        [----] Installing update...
        [----] Extracting package...
        [----] Extracting package...
        [----] Extracting package...
        [----] Installing update...
        [----] Installing update...
        [----] Installing update...
        [----] Cleaning up...
        [----] Update complete, launching Steam...
        Redirecting stderr to '/home/steam/Steam/logs/stderr.txt'
        [  0%] Checking for available updates...
        [----] Verifying installation...
        Steam Console Client (c) Valve Corporation
        -- type 'quit' to exit --
        Loading Steam API...OK.

        Steam>

    The `Steam>` prompt is similar to the Linux command prompt - with the exception of not being able to execute normal Linux commands.

4.  Install Left 4 Dead 2 from the SteamCMD prompt:

        login anonymous
        force_install_dir ./L4D2-server
        app_update 222860 validate

    If the download looks like it has frozen, be patient. This can take some time. Once the download is complete, you should see this output:

        Success! App '222860' fully installed.

        Steam>

5.  Finally, exit SteamCMD:

        quit

## Configure Left 4 Dead 2

1.  Before you configure the server, you should download an example config file:

        cd ~/Steam/L4D2-server/left4dead2/cfg

	Choose one of the following example files:

        wget https://www.gottnt.com/l4d2/basic-server.cfg
        wget https://www.gottnt.com/l4d2/detailed-server.cfg

    Make sure to rename the file to `server.cfg` before launching the server:

2.  Open the configuration file with `nano` to edit the configuration. Most server options are explained in the configuration file. Simply follow the instructions:

        nano server.cfg

3.  When you are finished, exit `nano` and save your changes.

4.  Next, it is a good idea to write a custom startup script that will execute your custom config files.

    {{< file "~/Steam/L4D2-server/start_L4D2.sh" >}}
screen ./srcds_run -console -game left4dead2 +port 27020 +maxplayers 8 +exec server.cfg +map c2m1_highway

{{< /file >}}


    {{< note >}}
The `+port 27020` parameter is not required but is recommended so that your server always starts on the same port. The port number may be changed to whichever one you prefer, so long as it is not a privileged port.
{{< /note >}}

    You can change the map to whichever one you prefer.
	This script, when run, will execute the L4D2 server in a [Screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions) session.

5.  Make the script executable:

        chmod +x ~/Steam/L4D2-server/start_L4D2.sh

## Use the Server

1.  To start the server, simply input and run:

        ./start_L4D2

2.  To detach from the screen session which runs the server console, press these two key combinations in succession:

    **CONTROL + A**<br>
    **CONTROL + D**

3.  To bring the console back, type the following command:

        screen -r

4.  To stop the server, bring back the console and type `exit`.

## Entering The Server

You can connect to the server in any one of three easy methods:

1.  Ensure that the developer console is enabled. On the main menu, press the tilde (`~`) key to open the console. Next, type the following: `connect 12.34.56.78:27020` where 12.34.56.78 is your Linode's ip, and 27020 is your port.

2.  A slightly easier method is to install the following add-on before launching the game: [Link](https://steamcommunity.com/sharedfiles/filedetails/?id=214945910). After doing this, launch the game, click the new `Console` button on the main menu, and type the command found in method 1, above.

3.  A third method is to install the following add-on: [Link](https://steamcommunity.com/sharedfiles/filedetails/?id=121088946) and then launch the game. Next, click on the new `Server Browser` option on the main menu and find your server in the long list of servers. This method only works if you have set the `hostname`, `sv_search_key`, and `sv_tags` options in the config file.

    {{< note >}}
Your L4D2 server will only show up in the `Custom` list of servers. Therefore, we recomend that you add it to your favorites to avoid having to look for it again.
{{< /note >}}

Finally, invite friends to the game using the Steam Overlay (`SHIFT + TAB`). Let the playing begin!
