---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: 'A basic Team Fortress 2 server installation guide for Debian and Ubuntu'
keywords: 'team fortress 2,team fortress,steam,ubuntu,debian'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Thursday, March 12th, 2015
modified_by:
  name: Elle Krout
published: 'Thursday, March 12th, 2015'
title: 'Team Fortress 2 on Debian and Ubuntu'
---

Team Fortress 2 is a team-based, first-person shooter, where you and a team of fellow players can play a variety of game modes. From capture the flag, to a battle pitting your team against a robotic horde, there are numerous options to choose. Setting up a personal game server puts you in control of what game modes and maps you use, as well as a variety of other settings to customize your experience.

##Prerequisites

Prior to installing Team Fortress 2, create a user for Steam and set up the Steam Console Client, SteamCMD, which allows you to use a command line version of Steam. You may also need to update your firewall permissions.

###Prepare Your Server

1.  Update your Linode:

		sudo apt-get update && sudo apt-get upgrade --show-upgraded

2.  Install the dependencies needed to run SteamCMD on 64-bit systems:

		sudo apt-get install lib32gcc1

3.  If you have a firewall on your server, open the `iptables.firewall.rules` file and add the following above the `DROP` command section:

	{: .file-excerpt}
	/etc/iptables.firewall.rules
	:	~~~
		# Allow SteamCMD
		-A INPUT -p udp -m udp --sport 26900:27030 --dport 1025:65355 -j ACCEPT
		-A INPUT -p udp -m udp --sport 4380 --dport 1025:65355 -j ACCEPT
		-A INPUT -p udp -m udp --dport 26900:27030 -j ACCEPT
		~~~

	Refresh the firewall:

		sudo iptables-restore < /etc/iptables.firewall.rules

###Install SteamCMD

1.  Create a separate user for Steam and switch to that user:

		sudo adduser steam
		su - steam

2.  From your home directory, create and switch to a new directory for SteamCMD:

		mkdir steamcmd
		cd steamcmd

3.  Download SteamCMD:

		wget http://media.steampowered.com/installer/steamcmd_linux.tar.gz

4.  Expand the file:

		tar -xvzf steamcmd_linux.tar.gz

5.  Remove the `steamcmd_linux.tar.qz` file:

		rm steamcmd_linux.tar.gz

6.  To start SteamCMD run:

		./steamcmd.sh

	{: .note}
	>
	>You must be in the `steamcmd` directory to boot SteamCMD.


##Install Team Fortress 2

With SteamCMD set up, Team Fortress 2 can now be installed.

1.  From the SteamCMD prompt, login anonymously:

		login anonymous

2.  Create a directory for Team Fortress 2 and install the game:

		force_install_dir ./tf2/
		app_update 232250

3.  Quit SteamCMD:

		quit

	{: .note}
	>
	>To update Team Fortress 2, run the above commands again.

##Start Your Server

If you would like to set up your server with custom settings see [Configure Team Fortress 2](#configure-team-fortress-2).

1. Switch to your `tf2` directory:

		cd tf2

	{: .note}
	>
	>You must be in the `steamcmd/tf2` directory to launch the server.

2.  If logged in through the `su - steam` command, transfer ownership of the shell to steam:

		script /dev/null

3.  To have the server continuously running, use the screen command in conjunction with the start up command.

	- 	If you're running the server with a `server.cfg`, file use:

			screen ./srcds_run -game tf +map ctf_2fort.bsp

	- 	Otherwise, use:

			screen ./srcds_run -game tf +map ctf_2fort.bsp +maxplayers 24

	Optionally, replace `cft_2fort.bsp` with the name of your chosen map's file, or replace `+map ctf_2fort.bsp` with `+randommap` for a randomized map select.

##Configure Team Fortress 2

###Maps

You can select from a variety of maps on which you can play Team Fortress 2, a number of them are already installed to the server.

In order to create a custom list of maps for your server, create `mapcycle.txt` within the `tf2/tf/cfg` directory. The best way to do this is to copy the example file and edit it to include your chosen maps.

1.  Navigate to `steamcmd/tf2/tf/cfg`:

		cd ~/steamcmd/tf2/tf/cfg

2.  Copy `mapcycle_default.txt`:

		cp mapcycle_default.txt mapcycle.txt

3. Open the file and add or remove maps as desired.

###Message of the Day

The "Message of the Day" appears when loaded onto a server. This can be a message to your normal group of players, a statement about the server's settings, or anything else. Configure this by editing the `motd_default.txt` and `motd_text_default.txt` file.

The `motd_default.txt` file can contain HTML and is displayed as a website upon loading the server in-game. The `modt_text_default.txt` file should be the text copy, with no additional code.

###Server.cfg

The `server.cfg` file is what contains all of the settings you need to customize the loadout of your game. A `server.cfg` file is not needed to run the game.

{: .note}
>
>For the configuration of this file, `0` means "off" and `1` means "on".

{: .file}
~/steamcmd/tf2/tf/cfg/server.cfg
:	~~~
	// General Settings //

	hostname Your Hostname
	sv_contact user@example.com
	sv_lan 0			// Server type; 0 = Internet; 1 = LAN
	sv_region -1 			// Region: -1 = World; 0 = USA East; 1 = USA West; 2 = S. America;
									// 3 = Europe; 4 = Asia; 5 = Australia; 6 = Middle East; 7 = Africa

	// Passwords //

	rcon_password adminpass		// Password for administrator access
	sv_password			// Server password


	// Server Logs //

	log on
	sv_logecho 1			// Echo log information into your console
	sv_logfile 1			// Add log file
	sv_log_onefile 0 		// Log to a single file
	sv_stats 1 			// Collect CPU usage states


	// Bans and Ban Logs //

	sv_rcon_maxfailures 5 		// Max amount of failed RCON logins before ban (between 1 - 20)
	sv_rcon_banpenalty 60 		// Ban time for RCON failed login in minutes
	sv_logbans 1			// Turn on ban logging


	// Server Downloads/Uploads //

	sv_allowdownload 1
	sv_allowupload 1
	sv_consistency 1 		// File consistency check
	net_maxfilesize 15		// Max file size for uploading in MB


	// Pure Server //
	// Pure Servers force all clients to use content that matches the server

	sv_pure 2 			// 0 = Off; 1 = Enforce via pure_server_whitelist.txt
									// 2 = Steam official content
	sv_pure_kick_clients 1 		// Kick clients in violation
	sv_pure_trace 1 		// Display violation message


	// Bandwidth & Frame Rates //

	sv_maxrate 50000		// Max bandwidth rate; 0 = Unlimited
	sv_minrate 0 			// Min bandwidth rate; 0 = Unlimited
	sv_maxupdaterate 66 		// Max updates per second
	sv_minupdaterate 10		// Min updates per second
	fps_max 600 			// Frame Rates; 0 = Unlimited


	// Server Variables //

	mp_allowspectators 1
	sv_cheats 0
	sv_pausable 0
	mp_footsteps 1
	sv_allow_votes 1 		// Vote on maps
	mp_forcecamera 1 		// Camera restriction for dead players
	mp_idlemaxtime 3 		// Max idle time for players (in minutes)
	mp_idledealmethod 1 		// Idle player kick method; 0 = Off; 1 = Move to spectate; 2 = Boot


	// Game Variables //

	sv_visiblemaxplayers 24 	//Max players
	mp_friendlyfire 1
	mp_flashlight 1
	mp_falldamage 0
	tf_weapon_criticals 1 		// Allows crits
	tf_damage_disablespread 0 	// Random damage spread (±10%)
	tf_use_fixed_weaponspreads 0 	// Consistent spread for weapons


	// Team Autobalance //

	mp_autoteambalance 1
	mp_teams_unbalance_limit 2 	// Amount of additional players on team before unbalanced


	// Round Variables //

	mp_enableroundwaittime 1 	// Enables timers between rounds (setting this to 0 causes a known bug)
	mp_bonusroundtime 15 		// Time after win until restart
	mp_restartround 0 		// Round restart in seconds
	mp_stalemate_enable 0 		// Enable sudden death
	mp_stalemate_timelimit 240	// Timelimit of stalemate round
	mp_maxrounds 0 			// Max rounds before map change
	mp_winlimit 0 			// Max wins before map change
	mp_timelimit 0 			// Max time before map change


	// Communication //

	sv_voiceenable 1
	sv_alltalk 0 			// Players can hear all other players
	mp_chattime 10 			// Post-game chat in seconds


	// Execute ban files //

	exec banned_user.cfg
	exec banned_ip.cfg
	writeid
	writeip
	~~~

##RCON

RCON allows you to make changes to your server from inside of the game.

1.  To start using RCON, go to the **Options** setting in the game, and then select **Advanced...**  

	[![Enable the developer console.](/docs/assets/team-fortress-rcon-small.png)](/docs/assets/team-fortress-rcon.png)

2.  From here, check **Enable developer console** and apply these settings.

3.  To make changes in-game, it is recommended that you switch to spectator mode, and then press the backtick button (<code>`</code>) to access the developer's console.

	[![Press `~` to access the console](/docs/assets/team-fortress-rcon-console-small.png)](/docs/assets/team-fortress-rcon-console.png)

4.  Log in to RCON by typing in `rcon_password` followed by your password.

###RCON Commands

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
