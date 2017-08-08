---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide explains how to setup a server on Debian/Ubuntu for the game Half-Life 2: Deathmatch'
keywords: 'half-life 2,deathmatch,game,server,steam,steamcmd,sourcemod,metamod,bots'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: -
modified: Tuesday, August 8th, 2017
modified_by:
  name: Linode
title: 'Install Half-Life 2: Deathmatch Dedicated Server on Debian or Ubuntu'
contributor:
  name: Davide Beatrici
  link: https://github.com/davidebeatrici
  external_resources:
- '[Steam Community](https://steamcommunity.com/app/320)'
- '[Valve Developer Community](https://developer.valvesoftware.com)'
- '[Combine OverWiki](http://combineoverwiki.net/wiki/Half-Life_2:_Deathmatch)'
- '[AlliedModders Wiki](https://wiki.alliedmods.net)'
- '[Botrix](http://www.famaf.unc.edu.ar/~godin/botrix)'
alias: ['applications/game-servers/install-half-life-2-deathmatch-on-debian-or-ubuntu/']
---

*This is a Linode Community guide. If you're an expert on something we need a guide on, you too can [get paid to write for us](/docs/contribute).*
----

<hr>

This guide will show you how to set up your own [Half-Life 2 Deathmatch](http://steamcommunity.com/app/320) server on a Linode running Debian or Ubuntu.

##Before You Begin

Complete our guide: [Install SteamCMD for a Steam Game Server](/docs/applications/game-servers/install-steamcmd-for-a-steam-game-server). This will get SteamCMD installed and running on your Linode and this guide will pick up where the SteamCMD page leaves off.

{: .note}
>
> This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

{: .note}
>
> After #run-the-server, the guide assumes that the game server's folder is your working directory.

##Prerequisites

From the SteamCMD guide, one additional step is needed specifically for Half-Life 2: Deathmatch Dedicated Server.

1.  Add two firewall rules to slightly extend the port range available to the server. This command assumes that you have **only** the iptables rules in place from the SteamCMD guide.

        sudo iptables -R INPUT 5 -p udp -m udp --sport 27000:27030 --dport 1025:65355 -j ACCEPT
        sudo iptables -I INPUT 7 -p udp -m udp --dport 27000:27030 -j ACCEPT

##Install the server

1.  Execute SteamCMD:

        steamcmd
        
2.  Login as anonymous:

        login anonymous

3.  Download the server:

        app_update 232370 validate

4.  Exit from SteamCMD:

        quit

{: .note}
>
> You may have to repeat the installation process multiple times in order to retrieve all of the game data, even if SteamCMD succeedes.
> 
> The simplest way to verify that all of the data has been downloaded is to run the server and see if it works as expected.

##Run the server

1.  Go into the server folder:

        cd ~/".steam/SteamApps/common/Half-Life 2 Deathmatch Dedicated Server"

2.  Run the server:

        ./srcds_run -game hl2mp +sv_password MyLinode +mp_teamplay 1 +maxplayers 8 +map dm_runoff

{: .note}
>
> The **game** parameter specifies the game's files directory; don't change it. This is the only parameter you can't write in server.cfg because it specifies the game folder, where the server.cfg file itself is.<br />
> The **sv_password** parameter specifies the password required to enter your server. If this parameter is not set, the server is accessible without a password.
> The **mp_teamplay** parameter specifies if the game mode is team deathmatch or deathmatch.<br />
> The **maxplayers** parameter specifies the maximum number of players allowed to play on the server. Half-Life 2: Deathmatch officially supports a maximum of 16 players.<br />
> The **map** parameter specifies the map with which the server needs to start. You must write the name of the map file without the extension (.bsp).<br />
>
> You can read the entire list of parameters on the [Valve Wiki](https://developer.valvesoftware.com/wiki/Command_Line_Options).

{: .note}
>
> To keep the server running, execute it using [Screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions):
>
>     screen ./srcds_run -game hl2mp +sv_password MyLinode +mp_teamplay 1 +maxplayers 8 +map dm_runoff

###Stop the server

The best way to stop a running server is by pressing CTRL+C while in its console. If everything went fine, you should see an output like:

        Thu Jul 25 04:06:48 CEST 2017: Server Quit
        

Forcibly killing the server shouldn't be harmful, but it can cause data corruption if you have plugins which write to a database, for example. 

###Autostart with screen script

This script automatically starts your server into a **Screen session**.

1.  Create the file to contain the script:

{: .file}
~/.steam/SteamApps/common/Half-Life 2 Deathmatch Dedicated Server/run.sh
: ~~~ sh
#!/bin/sh
cd "$HOME/.steam/SteamApps/common/Half-Life 2 Deathmatch Dedicated Server"
screen -S "HL2DM" -d -m
screen -r "HL2DM" -X stuff "./srcds_run -game hl2mp +sv_password MyLinode +mp_teamplay 1 +maxplayers 8 +map dm_runoff\n"
~~~

2.  Mark the file as executable:

        chmod +x run.sh

3.  Run the script:

        ./run.sh

##Configure the server

###Server.cfg
The **server.cfg** file contains the settings of your server. It is not present by default because you can start the server every time by specifying the desidered settings using parameters.

Below is a server configuration with the most important settings.

{: .file-excerpt}
~/.steam/SteamApps/common/Half-Life 2 Deathmatch Dedicated Server/hl2mp/cfg/server.cfg
:  ~~~config
// Server's name [Default: Half-Life 2 Deathmatch]
hostname "My Linode"

// Frags limit before ending the match (0 = No limit) [Default: 0]
mp_fraglimit 50

// Time limit before ending the match (0 = No limit) [Default: 0]
mp_timelimit 30

// Team deathmatch mode [Default: 0]
mp_teamplay 0

// Allow friendly fire [Default: 0]
mp_friendlyfire 0

// Automatically respawn a player after death [Default: 0]
mp_forcerespawn 1

// Enable player footstep sounds [Default: 1]
mp_footsteps 1

// Enable flashlight [Default: 0]
mp_flashlight 1

// Allow spectators [Default: 1]
mp_allowspectators 1

// Amount of damage inflicted from a fall [Default: 0]
mp_falldamage 10

// Weapons respawn time [Default: 20]
sv_hl2mp_weapon_respawn_time 10

// Items (health, energy, ammo, props...) respawn time [Default: 30]
sv_hl2mp_item_respawn_time 15

// Enable voice on server [Default: 1]
sv_voiceenable 1

// Talk to everyone (1) or only to your team (0)? [Default: 0]
sv_alltalk 1

// Allow players to upload sprays [Default: 1]
sv_allowupload 1

// Allow sprays, custom maps and other extra content to be downloaded [Default: 1]
sv_allowdownload 1

// Max bandwidth rate allowed on server (0 = No limit) [Default: 0]
sv_maxrate 0

// Minimum bandwidth rate allowed on server, (0 = No limit) [Default: 3500]
sv_minrate 3500

// Maximum updates per second that the server allows [Default: 66]
sv_maxupdaterate 300

// Minimum updates per second that the server allows [Default: 10]
sv_minupdaterate 10

// After how many seconds without a message should the client be disconnected? (0 = Disabled) [Default: 65]
sv_timeout 65

// LAN mode (only class C addresses allowed) [Default: 0]
sv_lan 0

// Server password for players to join [Default: Empty]
sv_password "MyLinode"
~~~

{: .caution}
>
> The settings in **server.cfg** will override the ones that you specify (using parameters) when you start the server.

###Maps

There are 8 official maps in Half-Life 2: Deathmatch:
*   dm_lockdown
*   dm_overwatch
*   dm_powerhouse
*   dm_resistance
*   dm_runoff
*   dm_steamlab
*   dm_underpass
*   halls3

You can see every map's preview on [Combine OverWiki's official page](http://combineoverwiki.net/wiki/Half-Life_2:_Deathmatch#Maps).

*   Custom maps in **VPK** format need to be put in the **custom** folder: `~/.steam/SteamApps/common/Half-Life 2 Deathmatch Dedicated Server/hl2mp/custom`.

*   Custom maps in **BSP** format need to be put in a specific folder inside **custom**: `~/.steam/SteamApps/common/Half-Life 2 Deathmatch Dedicated Server/hl2mp/custom/maps`

Once the maps are in the right folder, the server will be able to load them as if they were original maps already present in the game.
The resources upload system is enabled by default, meaning that if a client doesn't have the map it will automatically download it from your server, including any extra content required to load it.

{: .note}
> 
> You can find custom maps on [GAMEBANANA](http://gamebanana.com/games/5).

###Maps Rotation

When a match ends, the server starts a new one with the next map in the rotation list.
The default map rotation list is in **mapcycle_default.txt**, which is used as fallback in case **mapcycle.txt** isn't present.

{: .file-excerpt}
~/.steam/SteamApps/common/Half-Life 2 Deathmatch Dedicated Server/hl2mp/cfg/mapcycle_default.txt
:  ~~~txt
// Default mapcycle file for hl2mp
//
// DO NOT MODIFY THIS FILE!
// Instead, copy it to mapcycle.txt and modify that file.  If no custom mapcycle.txt file is found,
// this file will be used as the default.
//
// Also, note that the "mapcyclefile" convar can be used to specify a particular mapcycle file.

dm_lockdown
dm_overwatch
dm_powerhouse
dm_resistance
dm_runoff
dm_steamlab
dm_underpass
~~~
    
To add a custom map to the rotation:

1.  Copy **mapcycle_default.txt** to **mapcycle.txt**:

        cp hl2mp/cfg/mapcycle_default.txt hl2mp/cfg/mapcycle.txt

2.  Write the custom map's name inside the **mapcycle.txt**. For example: if you have the map **dm_custom.bsp**:

{: .file-excerpt}
~/.steam/SteamApps/common/Half-Life 2 Deathmatch Dedicated Server/hl2mp/cfg/mapcycle.txt
:  ~~~txt
// Default mapcycle file for hl2mp
//
// DO NOT MODIFY THIS FILE!
// Instead, copy it to mapcycle.txt and modify that file.  If no custom mapcycle.txt file is found,
// this file will be used as the default.
//
// Also, note that the "mapcyclefile" convar can be used to specify a particular mapcycle file.

dm_custom // Your custom map
dm_lockdown
dm_overwatch
dm_powerhouse
dm_resistance
dm_runoff
dm_steamlab
dm_underpass
~~~

##Extra
        
###MetaMod

**MetaMod** is a plugin for Source Engine servers that works as a "base" for addons like **SourceMod**.

1.  Download **MetaMod**:

        wget https://mms.alliedmods.net/mmsdrop/1.10/mmsource-1.10.7-git959-linux.tar.gz -P /tmp/

{:.note}
>
> This URL costantly changes as MetaMod is updated. Please check the downloads [page](https://www.sourcemm.net/downloads.php) for the current URL.

2.  Extract the downloaded archive:

        tar -zxvf /tmp/mmsource-1.10.7-git959-linux.tar.gz -C hl2mp

3.  Cleanup:

        rm /tmp/mmsource-1.10.7-git959-linux.tar.gz

4.  Run the server and enter the command `meta list` in the console:

        meta list
        No plugins loaded.

If you get the same output, it means that MetaMod is working.

###SourceMod

It is recommended that you install the **SourceMod** add-on. It provides useful functions, such as **votemap**, **random map cycle**, **bans**, **reserved slots**, **admin system**, and **player commands**; you can customize it as you want.

1.  Download **SourceMod**:

        wget https://sm.alliedmods.net/smdrop/1.8/sourcemod-1.8.0-git6017-linux.tar.gz -P /tmp/

{:.note}
>
> This URL constantly changes as SourceMod is updated. Please check the downloads [page](https://www.sourcemod.net/downloads.php) for the current URL.

2.  Extract the downloaded archive:

        tar -zxvf /tmp/sourcemod-1.8.0-git6017-linux.tar.gz -C hl2mp

3.  Cleanup:

        rm /tmp/sourcemod-1.8.0-git6017-linux.tar.gz

4.  Run the server and enter the command `meta list` in the console:

        meta list
        Listing 2 plugins:
          [01] SourceMod (1.8.0.6017) by AlliedModders LLC
          [02] SDK Tools (1.8.0.6017) by AlliedModders LLC

If you get a similar output, it means that MetaMod and SourceMod are working.

To be able to use SourceMod's commands from your game client you need to add yourself as admin, as explained on [SourceMod's Wiki](https://wiki.alliedmods.net/Adding_Admins_(SourceMod)).

{:.note}
>
> Read the [MetaMod Official Wiki](https://wiki.alliedmods.net/Category:Metamod:Source_Documentation) and the [SourceMod Official Wiki](https://wiki.alliedmods.net/index.php/Category:SourceMod_Documentation) for info about configurations, plug-ins, files, etc.

###Bots

Half-Life 2: Deathmatch doesn't support bots by default, but there are plugins which add a bot system with many features. The best one at the time of writing is [Botrix](http://www.famaf.unc.edu.ar/~godin/botrix/).

This is a standalone plugin, just like MetaMod, meaning that it doesn't depend on other 3rd party plugins.

1.  Download the latest archive:

        wget http://www.famaf.unc.edu.ar/~godin/files/botrix.zip -P /tmp/

2.  The archive contains instructions files and Windows/MacOS content. With the following command we only extract what we need to run the plugin on Linux:

        unzip "/tmp/botrix.zip" -d "hl2mp/" -x "botrix-*" "botrix.cfg" "__MACOSX/*" "*.DS_Store" "*.dylib" "*.dll"

3.  Cleanup:

        rm /tmp/botrix.zip

4.  Run the server:

        [Botrix] Cannot open interface VDebugOverlay003
        [Botrix] Looking for configuration file /home/steam/.steam/SteamApps/common/Half-Life 2 Deathmatch Dedicated Server/hl2mp/addons/botrix/config.ini
        [Botrix]   found.
        [Botrix] Console log level: info.
        [Botrix] Log to file: botrix.log.
        [Botrix] File log level: trace.
        [Botrix] File /home/steam/.steam/SteamApps/common/Half-Life 2 Deathmatch Dedicated Server/hl2mp/addons/botrix/config.ini:
        [Botrix]   There is no mod that matches current game (half-life 2 deathmatch dedicated server) & mod (hl2mp) folders.
        [Botrix]   Using default mod 'HalfLife2Deathmatch'.
        [Botrix] Botrix loaded. Current mod: HalfLife2Deathmatch.

If you get a similar output, it means that Botrix has been loaded successfully.

To add a bot with random name and skills, enter the command `botrix bot add` in the server's console:

        [Botrix] Bot added: Charles (pro).

You can see the list of available commands on [Botrix's website](http://www.famaf.unc.edu.ar/~godin/botrix/commands.html).

To be able to use Botrix's commands from your game client you need to add yourself as admin, as explained in [Botrix's readme](https://github.com/borzh/botrix/blob/master/runtime/botrix-readme.txt).

##Connect to your server

1.  Open Half-Life 2 Deathmatch, and click on the **FIND SERVERS** option:

[![Main menu](/docs/assets/half-life-2-deathmatch-menu_small.png)](/docs/assets/half-life-2-deathmatch-menu.png)

2.  Find your server in the servers list:

[![Server browser](/docs/assets/half-life-2-deathmatch-server-browser_small.png)](/docs/assets/half-life-2-deathmatch-server-browser.png)

3.  Double click on it to connect:

[![In-game](/docs/assets/half-life-2-deathmatch-in-game_small.png)](/docs/assets/half-life-2-deathmatch-in-game.png)

Enjoy!
