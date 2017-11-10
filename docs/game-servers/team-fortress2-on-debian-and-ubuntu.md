---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: 'A basic Team Fortress 2 server installation guide for Debian and Ubuntu'
keywords: ["team fortress 2", "team fortress", "steam", "ubuntu", "debian"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2016-02-25
modified_by:
  name: Linode
published: 2015-03-12
title: 'Team Fortress 2 on Debian and Ubuntu'
aliases: ['applications/game-servers/team-fortress2-on-debian-and-ubuntu/']
---

[Team Fortress 2](http://teamfortress.com/) is a team-based, first-person shooter, where you and a team of fellow players can play a variety of game modes. From capture the flag, to a battle pitting your team against a robotic horde, there are numerous options to choose. Setting up a personal game server puts you in control of what game modes and maps you use, as well as a variety of other settings to customize your experience.

## Before You Begin

1.  You will need a [Steam](http://store.steampowered.com) account and a copy of [Team Fortress 2](http://store.steampowered.com/app/440/).

2.  Complete our guide: [Install SteamCMD for a Steam Game Server](/docs/game-servers/install-steamcmd-for-a-steam-game-server). This will get SteamCMD installed and running on your Linode and this guide will pick up where the SteamCMD page leaves off.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Prerequisites for Team Fortress 2

From the SteamCMD guide, two additional steps are needed specifically for TF2.

1.  Add an iptables firewall rule. This command assumes that you have **only** the iptables rules in place from the SteamCMD guide. This inserts a rule after the pre-existing iptables rules for SteamCMD.

        sudo iptables -I INPUT 7 -p udp -m udp --dport 26900:27030 -j ACCEPT

2.  After entering the above rule, run iptables-persistent again. You’ll be asked if you want to save the current IPv4 and IPv6 rules. Answer `yes` for IPv4 and `no` for IPv6.

        sudo dpkg-reconfigure iptables-persistent

3.  Install an additonal 32-bit package:

        sudo apt-get install lib32tinfo5

## Install Team Fortress 2

1.  Be sure you are in the directory `~/Steam`, then access the `Steam>` prompt.

        cd ~/Steam && ./steamcmd.sh

2.  From the SteamCMD prompt, login anonymously:

		login anonymous

    Or log in with your Steam username:

        login example_user

3.  Install TF2 to the `Steam` user's home directory:

		force_install_dir ./tf2
		app_update 232250

    This can take some time. If the download looks as if it has frozen, be patient. Once the download is complete, you should see this output:

        Success! App '232250' fully installed.

        Steam>

4.  Quit SteamCMD:

		quit

	{{< note >}}
To update TF2, run the above 4 commands again.
{{< /note >}}

## Configure Team Fortress 2

###Maps

You can select from a variety of maps on which you can play Team Fortress 2, a number of which are already installed to the server.

In order to create a custom list of maps for your server, create `mapcycle.txt` within the `tf2/tf/cfg` directory. The best way to do this is to copy the example file and edit it to include your chosen maps.

1.  Navigate to `Steam/tf2/tf/cfg`:

		cd ~/Steam/tf2/tf/cfg

2.  Copy `mapcycle_default.txt`:

		cp mapcycle_default.txt mapcycle.txt

3. Open the file and add or remove maps as desired.

### Message of the Day

The "Message of the Day" appears when joining a server. This can be a message to your normal group of players, a statement about the server's settings, or anything else. Configure this by editing the files:

*   `~/Steam/tf2/tf/cfg/motd_default.txt`
*   `~/Steam/tf2/tf/cfg/motd_text_default.txt`

The `motd_default.txt` file can contain HTML and is displayed as a website upon loading the server in-game. The `modt_text_default.txt` file should be the text copy, with no additional code.

### Server.cfg

The file `~/Steam/tf2/tf/cfg/server.cfg` is what contains all of the settings you need to customize the loadout of your game. A `server.cfg` file is not needed to run the game but we have a sample config file [here](/docs/assets/team_fortress_2_server_config) which you can edit for your own use.

{{< note >}}
For the configuration of this file, `0` means *off* and `1` means *on*.
{{< /note >}}

### Startup Script

1.  Create a startup script for TF2 with the following contents:

    {{< file "~/starttf2.sh" >}}
#!/bin/sh

cd ./Steam/tf2
screen -S "Team Fortress 2 Server" ./srcds_run -game tf +map ctf_2fort.bsp

{{< /file >}}


    When run, the script will change directories to `~/Steam/tf2` and execute TF2 in a [Screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions) session.

	Optionally, replace `cft_2fort.bsp` with the name of your chosen map’s file, or replace `+map ctf_2fort.bsp` with `+randommap` for a randomized map selection.

2.  Make the script executable:

        chmod +x ~/starttf2.sh

## Using the Server

1.  Now that your server is installed and configured, it can be launched by running the `starttf2.sh` script from your `steam` user's home directory.

        cd ~/ && ./starttf2.sh

    {{< caution >}}
From this point, do not press the **Control+C** keys while in the console unless you want to stop TF2.
{{< /caution >}}

2.  To detach from the screen session running the server console, press these two key combinations in succession:

    **Control+A**<br>
    **Control+D**

3.  To bring the console back, type the following command:

        screen -r

4.  To stop the server, bring back the TF2 console and press **CONTROL + C**.

## RCON

RCON allows you to make changes to your server from inside of the game.

1.  To start using RCON, go to the **Options** setting in the game, and then select **Advanced...**

	[![Enable the developer console.](/docs/assets/team-fortress-rcon-small.png)](/docs/assets/team-fortress-rcon.png)

2.  From here, check **Enable developer console** and apply these settings.

3.  To make changes in-game, it is recommended that you switch to spectator mode, and then press the backtick button (<code>`</code>) to access the developer's console.

	[![Press `~` to access the console](/docs/assets/team-fortress-rcon-console-small.png)](/docs/assets/team-fortress-rcon-console.png)

4.  Log in to RCON by typing in `rcon_password` followed by your password.

### RCON Commands

The commands for RCON are as follows:

-	**`rcon sv_password`**: Add a server password
-	**`rcon users`**: Display a list of users on the server
-	**`rcon kick`**: Boot user from server
-	**`rcon banid`**: Ban a user by their ID
-	**`rcon banip`**: Ban a user by their IP
-	**`rcon removeid`**: Remove a user from the ID ban list
-	**`rcon removeip`**: Remove a user from the IP ban list
-	**`rcon maps`**: Displays the maps available to your server
-	**`rcon changelevel [mapname]`**: Change to set map

Most `server.cfg` options can also be altered through RCON using the same values. For example, should you want to enable friendly fire, enter `rcon mp_friendlyfire 1`.
