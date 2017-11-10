---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Install Black Mesa on Debian or Ubuntu'
keywords: ["black mesa", "steam", "steamcmd", "sourcemod", "metamod"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2016-02-26
modified: 2016-02-26
modified_by:
  name: Linode
title: 'Install Black Mesa on Debian or Ubuntu'
contributor:
  name: Davide Beatrici
  link: https://github.com/davidebeatrici
external_resources:
- '[BlackMesaSource.com](http://www.blackmesasource.com/)'
- '[The Official Black Mesa Wiki](http://wiki.blackmesasource.com/)'
- '[The Valve Wiki](https://developer.valvesoftware.com/)'
- '[SourceMod.net](https://www.sourcemod.net)'
aliases: ['applications/game-servers/install-black-mesa-on-debian-or-ubuntu/']
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

This guide will show you how to set up your own [Black Mesa](https://blackmesasource.com/) server on a Linode running Debian or Ubuntu.


## Before You Begin

1.  You will need a [Steam](http://store.steampowered.com) account and a copy of [Black Mesa](http://store.steampowered.com/app/362890/).

2.  Complete our guide: [Install SteamCMD for a Steam Game Server](/docs/applications/game-servers/install-steamcmd-for-a-steam-game-server). This will get SteamCMD installed and running on your Linode and this guide will pick up where the SteamCMD page leaves off.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Prerequisites for Black Mesa

From the SteamCMD guide, one additional step is needed specifically for Black Mesa.

1.  Add two firewall rules to slightly extend the port range available to the game. This command assumes that you have **only** the iptables rules in place from the SteamCMD guide.

		sudo iptables -R INPUT 5 -p udp -m udp --sport 26900:27030 --dport 1025:65355 -j ACCEPT
		sudo iptables -I INPUT 7 -p udp -m udp --dport 26900:27030 -j ACCEPT


## Install Black Mesa, Dedicated Server

1.  Execute SteamCMD:

        cd ~/Steam && ./steamcmd.sh

2.  Login as anonymous:

		login anonymous

3.  Download the server:

		app_update 346680 validate

4.  Exit from SteamCMD:

		quit

## Run Black Mesa, Dedicated Server

1.  Go into the Black Mesa Dedicated Server folder:

		cd "steamapps/common/Black Mesa Dedicated Server"

2.  Run the Server:

		./srcds_run -game bms +hostname "My Linode" +map gasworks +maxplayers 24

{{< note >}}
The **game** parameter specifies the game's files directory; don't change it. This is the only parameter you can't write in server.cfg because it specifies the game folder, where the server.cfg file itself is.<br />
The **hostname** parameter specifies your server's name in the browser list. By default it's specified in server.cfg, so the +hostname parameter is overridden by it.<br />
The **map** parameter specifies the map with which the server needs to start. You must write the name of the map file without the prefix.<br />
The **maxplayers** parameter specifies the maximum number of players allowed to play on the server.<br />

You can read the entire list of parameters on the [Valve Wiki](https://developer.valvesoftware.com/wiki/Command_Line_Options).
{{< /note >}}

{{< note >}}
To keep the server running, execute it using [Screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions):

    screen ./srcds_run -game bms +map gasworks +maxplayers 24
{{< /note >}}

## Configure a Black Mesa Dedicated Server

{{< note >}}
At the time of writing this guide, Black Mesa has yet to share with customers any official documentation regarding configurations.
{{< /note >}}

### Server.cfg
The **server.cfg** file contains the settings of your server. It is not needed because you can start the server every time by specifying desidered values using parameters.

{{< file-excerpt "/home/steam/Steam/steamapps/common/Black Mesa Dedicated Server/bms/cfg/server.cfg" aconf >}}
// Black Mesa server.cfg file
hostname "Black Mesa: Deathmatch" --> Your server's name.
mp_timelimit 900                  --> Round time limit.
mp_warmup_time 30                 --> Time before the match starts.
// sv_lan 0                       --> LAN Mode. (0 = disabled|1 = enabled).
// rcon_password                  --> The RCON password to login as admin to send commands to your server while you're in-game.
// mp_flashlight 1                --> Flashlight allowed. (0 = disabled|1 = enabled).
// mp_forcerespawn 0              --> Forced respawn, without the player prompt. (0 = disabled|1 = enabled).
// mp_friendlyfire 0              --> When enabled, a player can shoot another one of his own team. (0 = disabled|1 = enabled).
// mp_fraglimit 45                --> The number of kills needed to end the match.
// sv_logecho 1                   --> Prints logs in the console (0 = disabled|1 = enabled).
// sv_logfile 1                   --> Saves the logs to a file (0 = disabled|1 = enabled).

{{< /file-excerpt >}}


{{< caution >}}
The settings in **server.cfg** will override the ones that you specify (using parameters) when you start the server.
{{< /caution >}}

### Config_deathmatch.cfg
The **config_deathmatch.cfg** file contains the settings of the gamemode. You can edit almost everything in this file.
It's located at: `/home/steam/Steam/steamapps/common/Black Mesa Dedicated Server/bms/cfg/config_deathmatch.cfg`

### Maps

Currently, there are 10 official maps in Black Mesa Dedicated Server:
*   dm_bounce
*   dm_chopper
*   dm_crossfire
*   dm_gasworks
*   dm_lambdabunker
*   dm_power
*   dm_stack
*   dm_stalkyard
*   dm_subtransit
*   dm_undertow

Three additional official maps are available in the Steam Workshop:
*   [dm_boom](http://steamcommunity.com/sharedfiles/filedetails/?id=432070352)
*   [dm_rail](http://steamcommunity.com/sharedfiles/filedetails/?id=432072942)
*   [dm_shipping](http://steamcommunity.com/sharedfiles/filedetails/?id=432074065)

### Custom Maps

*   Custom maps in **BSP** format need to be put in the same folder as the official ones: `/home/steam/Steam/steamapps/common/Black
Mesa Dedicated Server/bms/maps/`.

*   Custom maps in **VPK** format need to be put in the **addons** folder: `/home/steam/Steam/steamapps/common/Black Mesa Dedicated Server/bms/addons/`

*   Custom maps downloaded from the workshop need to be put in the **workshop** folder:  `/home/steam/Steam/steamapps/common/Black Mesa Dedicated Server/bms/addons/workshop`

The add-ons to be loaded need to be specified in the **addonlist.txt** file.
In the following example, maps that were downloaded from workshop to the list are added to **dm_boom** and **dm_shipping**:

{{< file "/home/steam/Steam/steamapps/common/Black Mesa Dedicated Server/bms/addonlist.txt" resource >}}
"AddonList"
  {
   "workshop\432070352.vpk"		"1"
   "workshop\432074065.vpk"		"1"
  }

{{< /file >}}


{{< note >}}
You can find more maps in the [Steam Workshop](http://steamcommunity.com/workshop/browse/?appid=362890&requiredtags[]=Multiplayer).
{{< /note >}}

### Maps Rotation

When a match ends, the server starts a new one with the next map in the rotation list.
The map rotation list is in **mapcycle.txt**:

{{< file-excerpt "/home/steam/Steam/steamapps/common/Black Mesa Dedicated Server/bms/cfg/mapcycle.txt" resource >}}
dm_bounce
dm_gasworks
dm_lambdabunker
dm_stalkyard
dm_subtransit
dm_undertow
dm_custom

{{< /file-excerpt >}}


To put a custom map in the rotation, simply write its name; for example: if you have the map **dm_custom.bsp**, you need to write **dm_custom** inside **mapcycle.txt**.

## Connect to Your Server

1.  Open Black Mesa, and click on the **PLAY ONLINE** option:

	[![Black Mesa Main Menu.](/docs/assets/black_mesa_menu_small.png)](/docs/assets/black_mesa_menu.png)

2.  Find your server in the server list:

	[![Black Mesa Server Browser.](/docs/assets/black_mesa_server_browser_small.png)](/docs/assets/black_mesa_server_browser.png)

3.  Double click on it to connect:

	[![Black Mesa In-Game.](/docs/assets/black_mesa_ingame_small.png)](/docs/assets/black_mesa_ingame.png)

## Extra

###Autostart with screen script

This script automatically starts a Black Mesa Dedicated Server into a **Screen session**.

1.  Go into the **Black Mesa Dedicated Server** folder:

		cd "/home/steam/Steam/steamapps/common/Black Mesa Dedicated Server/"

2.  Create the file to contain the script:

	{{< file "/home/steam/Steam/steamapps/common/Black Mesa Dedicated Server/run.sh" sh >}}
#!/bin/sh
cd "$HOME/Steam/steamapps/common/Black Mesa Dedicated Server"
screen -S "BMDS" -d -m
screen -r "BMDS" -X stuff "./srcds_run -game bms +map gasworks +maxplayers 24\n"


{{< /file >}}


3.  Run the script:

		./run.sh

{{< note >}}
The **game** parameter specifies the game's files directory, don't change it. This is the only parameter you can't write in server.cfg because it specifies the game folder, where the server.cfg file itself is.<br />
The **hostname** parameter specifies your server's name in the browser list. By default it's specified in server.cfg, so the +hostname parameter is overridden by it.<br />
The **map** parameter specifies with which map the server needs to start. You must write the name of the map file without the prefix.<br />
The **maxplayers** parameter specifies the maximum number of players allowed to play on the server.<br />

You can read the entire list of parameters on the [Valve Wiki](https://developer.valvesoftware.com/wiki/Command_Line_Options).
{{< /note >}}

### MetaMod

**MetaMod** is an add-on for servers using Source Engine that works as a "base" for other plug-ins like **SourceMod**.

1.  Go into the **bms** folder:

		cd "/home/steam/Steam/steamapps/common/Black Mesa Dedicated Server/bms/"

2.  Download **MetaMod**:

		wget http://www.metamodsource.net/mmsdrop/1.10/mmsource-1.10.7-git951-linux.tar.gz

      {{< note >}}
This URL costantly changes as MetaMod is updated. Please check the downloads [page](http://www.metamodsource.net/snapshots) for the current URL.
{{< /note >}}

3.  Extract the downloaded archive:

		tar -zxvf mmsource-1.10.7-git951-linux.tar.gz

4.  Cleanup:

		rm mmsource-1.10.7-git951-linux.tar.gz

5.  Run the server and enter the command **meta list** in the console:

		meta list
		No plugins loaded.

If you get the same output, it means that MetaMod is working.

### SourceMod

It is recommended that you install the **SourceMod** add-on. It provides useful functions, such as **votemap**, **random map cycle**, **bans**, **reserved slots**, **admin system**, and **player commands**; you can customize it as you want.

1.  Go into the **bms** folder:

		cd "/home/steam/Steam/steamapps/common/Black Mesa Dedicated Server/bms/"

2.  Download **SourceMod**:

		wget https://www.sourcemod.net/smdrop/1.8/sourcemod-1.8.0-git5829-linux.tar.gz

	{{< note >}}
This URL constantly changes as SourceMod is updated. Please check the downloads [page](https://www.sourcemod.net/downloads.php) for the current URL.
{{< /note >}}

3.  Extract the downloaded archive:

		tar -zxvf sourcemod-1.8.0-git5829-linux.tar.gz

4.  Cleanup:

		rm sourcemod-1.8.0-git5829-linux.tar.gz

5.  Run the server and enter the command **meta list** in the console:

		meta list
		Listing 2 plugins:
	 	 [01] SourceMod (1.8.0.5829) by AlliedModders LLC
	 	 [02] SDK Tools (1.8.0.5829) by AlliedModders LLC

If you get similar output, it means that MetaMod and SourceMod are working.

Now, SourceMod will be automatically loaded by MetaMod when starting the Black Mesa Dedicated Server.

{{< note >}}
Read the [MetaMod Official Wiki](https://wiki.alliedmods.net/Category:Metamod:Source_Documentation) and the [SourceMod Official Wiki](https://wiki.alliedmods.net/index.php/Category:SourceMod_Documentation) for info about configurations, plug-ins, files, etc.
{{< /note >}}

Enjoy!
