---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Install and configure a Just Cause 2 Multiplayer Server on Ubuntu 14.04.'
keywords: ["just cause 2", "game servers", "ubuntu", "ubuntu 14.04", "steamcmd", "steam", "multiplayer game server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2015-10-09
modified: 2016-02-25
modified_by:
    name: Linode
title: 'Deploy a Just Cause 2 Multiplayer Server on Ubuntu 14.04'
aliases: ['applications/game-servers/just-cause-2-multiplayer-on-ubuntu/','applications/game-servers/deploy-just-cause-2-multiplayer-server-on-ubuntu/']
contributor:
    name: Andrew Gottschling
    link: https://github.com/agottschling
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

[Just Cause 2](http://www.justcause2.com/) is a single-player game published by Square Enix. Because it has no multiplayer mode, the modding community has created a multiplayer mod for the game that is quite popular. This guide will explain how to prepare your Linode, install SteamCMD and then install and configure Just Cause 2's multiplayer mod.

## Before You Begin

1.  You will need a [Steam](http://store.steampowered.com) account, a copy of [Just Cause 2](http://store.steampowered.com/app/8190/) and the [Just Cause 2 Multiplayer Mod](http://store.steampowered.com/app/259080/).

2.  Complete our guide: [Install SteamCMD for a Steam Game Server](/docs/applications/game-servers/install-steamcmd-for-a-steam-game-server). This will get SteamCMD installed and running on your Linode and this guide will pick up where the SteamCMD page leaves off.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Prerequisites for Just Cause 2

From the SteamCMD guide, two additional steps are needed specifically for JC2.

1.  Add two iptables firewall rules. These commands assume that you have **only** the iptables rules in place from the SteamCMD guide. These insert a rules after the pre-existing iptables rules for SteamCMD.

        sudo iptables -I INPUT 7 -p udp -m udp --sport 10999 --dport 1025:65355 -j ACCEPT
        sudo iptables -I INPUT 8 -p udp -m udp --dport 7777 -j ACCEPT
        sudo iptables -I INPUT 9 -p udp -m udp --dport 7778 -j ACCEPT

2.  After entering the above rules, run iptables-persistent again. You’ll be asked if you want to save the current IPv4 and IPv6 rules. Answer `yes` for IPv4 and `no` for IPv6.

        sudo dpkg-reconfigure iptables-persistent

## Install Just Cause 2

1.  Be sure you are in the directory `~/Steam`, then access the `Steam>` prompt.

        cd ~/Steam && ./steamcmd.sh

2.  From the SteamCMD prompt, login anonymously:

        login anonymous

    Or log in with your Steam username:

        login example_user

3.  Install JC2 to the `Steam` user's home directory:

        force_install_dir ./jc2mp-server
        app_update 261140 validate

    This can take some time. If the download looks as if it has frozen, be patient. Once the download is complete, you should see this output:

        Success! App '261140' fully installed.

        Steam>

4.  Quit SteamCMD:

        quit

    {{< note >}}
To update JC2, run the above 4 commands again.
{{< /note >}}

## Configure Just Cause 2 - Multiplayer (JC2-MP)

1.  Before you configure JC2-MP, make a copy of the default configuration file:

        cd ~/Steam/jc2mp-server
        cp default_config.lua config.lua

2.  Open `config.lua` with your preferred text editor. Every possible server option is explained in the configuration file. Simply follow the instructions and when finished, be sure to save your changes. At minimum, you'll want to set a server name and access password.

3.  Before starting up the server for the first time, it is good to symlink a library file to avoid a possible error:

        ln -s ~/Steam/linux32/libstdc++.so.6 libstdc++.so.6

4.  Create a startup script for JC2 with the following contents:

    {{< file "~/startjc2.sh" >}}
#!/bin/sh

cd ./Steam/jc2mp-server
screen -S "Just Cause 2 Muliplayer Server" ./Jcmp-Server

{{< /file >}}


    When run, the script will change directories to `~/Steam/jc2mp-server` and execute JC2 in a [Screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions) session.

5.  Make the script executable:

        chmod +x ~/startjc2.sh

## Start the Server

1.  Now that your server is installed and configured, it can be launched by running the `startjc2.sh` script from your `steam` user's home directory.

        cd ~/ && ./startjc2.sh

    {{< caution >}}
From this point, do not press the **Control+C** keys while in the console unless you want to stop JC2.
{{< /caution >}}

2.  To detach from the screen session running the server console, press these two key combinations in succession:

    **Control+A**<br>
    **Control+D**

3.  To bring the console back, type the following command:

        screen -r

4.  To stop the server, bring back the JC2 console and press **CONTROL + C**.

## Enter The Server

[![JC2-MP Server with users on it](/docs/assets/JC2running_resized.png)](/docs/assets/JC2running.png)

Now that you have installed and configured Just Cause 2 - Multiplayer, you have your very own Just Cause 2 server for you and your friends to play on. Your users can access the server by opening the server list, finding your server’s name, clicking **Connect**, and then entering a password - if you choose to set one.
