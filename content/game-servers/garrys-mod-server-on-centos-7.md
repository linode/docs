---
author:
  name: Julian Meyer
  email: --
description: 'A Garrys Mod Server for CentOS 7.'
keywords: ["garry''s mod", "centos", "centos 7"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/game-servers/minecraft-ubuntu12-04/','applications/game-servers/garrys-mod-server-on-centos-7/']
published: 2015-01-21
modified: 2016-02-25
modified_by:
  name: Linode
title: 'Garry''s Mod on CentOS 7'
external_resources:
- '[SRCDS](http://www.srcds.com/)'
- '[GMod Forums](http://facepunch.com/forum.php)'
- '[GMod Wiki](http://wiki.garrysmod.com/page/Main_Page)'
contributor:
    name: Julian Meyer
    link: https://github.com/jmeyer2k
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

[Garry's Mod](http://www.garrysmod.com/) enables complete control and modification of the video game engine, Source Engine. With Garry's Mod, you can create almost any game you want. Setting up a Garry's Mod server is a great way to play with friends over the internet while maintaining control over the server.

This guide shows how to create, maintain, and secure a Garry's Mod server.

## Before You Begin

1.  You will need a [Steam](http://store.steampowered.com) account and a copy of [Garry's Mod](http://store.steampowered.com/app/4000/).

2.  Complete our guide: [Install SteamCMD for a Steam Game Server](/docs/applications/game-servers/install-steamcmd-for-a-steam-game-server). This will get SteamCMD installed and running on your Linode and this guide will pick up where the SteamCMD page leaves off.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Prerequisites for Garry's Mod

From the SteamCMD guide, two additional steps are needed specifically for Gmod.

1.  Add a firewall rule. This command assumes that you have **only** the firewalld rules in place from the SteamCMD guide. This inserts a rule for port 10999 after the pre-existing rules for SteamCMD.

        sudo firewall-cmd --zone=public --add-port=27000 27030/udp --permanent

2.  Install an additonal 32-bit package:

        sudo yum install ncurses-libs.i686

## Install Garry's Mod

1.  Be sure you are in the directory `~/Steam`, then access the `Steam>` prompt.

        cd ~/Steam && ./steamcmd.sh

2.  From the SteamCMD prompt, login anonymously:

        login anonymous

    Or log in with your Steam username:

        login example_user

3.  Install Gmod to the `Steam` user's home directory:

        force_install_dir ./gmod
        app_update 4020 validate

    This can take some time. If the download looks as if it has frozen, be patient. Once the download is complete, you should see this output:

        Success! App '4020' fully installed.

        Steam>

4.  Quit SteamCMD:

        quit

    {{< note >}}
To update Gmod, run the above 4 commands again.
{{< /note >}}

## Configure Garry's Mod

This section configures different aspects of the server, including gamemode and workshop addons.

### Startup Script

1.  Create a startup script for Gmod with the following contents:

    {{< file "~/startgmod.sh" >}}
#!/bin/sh

cd ./Steam/gmod
screen -S "Garry's Mod Server" ./srcds_run -game garrysmod +maxplayers 20 +map gm_flatgrass

{{< /file >}}


    When run, the script will change directories to `~/Steam/gmod` and execute Garry's Mod in a [Screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions) session. The `srcds_run` binary can take many more arguments which you can see at [Valve's Developer wiki](https://developer.valvesoftware.com/wiki/Command_Line_Options#Source_Dedicated_Server).

2.  Make the script executable:

        chmod +x ~/startgmod.sh

### Update Script

The Garry's Mod wiki has instructions to use a script to update Gmod rather than manually through SteamCMD. See under [*Installing Garry's Mod*](http://wiki.garrysmod.com/page/Linux_Dedicated_Server_Hosting).

### Automatic Startup After Server Reboots

This will automatically restart Garry's Mod when your server reboots.

1.  Open Crontab (this will open in `vim`):

        crontab -e

2.  Enter the startup command. **Be sure that the binary flags are the same as in your startup script.**

        @reboot /home/steam/Steam/gmod/srcds_run -game garrysmod +maxplayers 20 +map gm_flatgrass

3.  To exit `vim`, press **Esc**, then type **:x** and hit **Enter**.

### Server Config File

The default `server.cfg` file is blank, and any configuration options you want to specify for the server must be added. This are optional, but below is a sane starting point.

{{< file "~/Steam/gmod/garrysmod/cfg/server.cfg" >}}
hostname "server_hostname"
sv_password "server_password"
sv_timeout 60
rcon_password "rcon_password"
mp_autoteambalance 1
mp_limitteams 1
writeid
writeip

{{< /file >}}


### Workshop Addons

1.  Create a collection of addons you want to install on your server at [Garry's Mod Collections](http://steamcommunity.com/workshop/browse/?section=collections&appid=4000&p=3). You will need to be logged in to Steam.

2.  Note the collection ID. It is located at the end of the url, denoted by the 'X's here:

    	http://steamcommunity.com/sharedfiles/filedetails/?id=XXXXXXXXX

3.  Acquire a Steam API key from the [Steam API Keys](http://steamcommunity.com/dev/apikey) page. Note the key.

4.  Paste the Steam API key and Workshop Collection ID into your startup script. For example:

        ./srcds_run +maxplayers 20 +gamemode terrortown +map cs_office -authkey YOURKEYGOESHERE +host_workshop_collection 157384458

    This sets the game for the Trouble in Terrorist Town (TTT) gamemode, but can be changed to your desired gamemode, if you have it downloaded.

    For more info on Workshop Addons, see [Workshop for Dedicated Servers](http://wiki.garrysmod.com/page/Workshop_for_Dedicated_Servers) in the Garry's Mod wiki.

## Using the Server

1.  Now that your server is installed and configured, it can be launched by running the `startgmod.sh` script from your `steam` user's home directory.

        cd ~/ && ./startgmod.sh

    {{< caution >}}
From this point, do not press the **Control+C** keys while in the console unless you want to stop Gmod.
{{< /caution >}}

2.  To detach from the screen session running the server console, press these two key combinations in succession:

    **Control+A**<br>
    **Control+D**

3.  To bring the console back, type the following command:

        screen -r

4.  To stop the server, bring back the Gmod console and press **CONTROL + C**.