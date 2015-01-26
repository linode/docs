---
author:
  name: Julian Meyer
  email: --
description: 'A Garrys Mod Server for CentOS 7.'
keywords: 'garry''s mod,centos,centos 7'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/game-servers/minecraft-ubuntu12-04/']
published: 'Wednesday, January 21, 2015'
modified: Wednesday, January 21, 2015
modified_by:
  name: Elle Krout
title: 'Garry''s Mod on CentOS 7'
external_resources:
- '[SRCDS](http://www.srcds.com/)'
- '[GMod Forums](http://facepunch.com/forum.php)'
- '[GMod Wiki](http://wiki.garrysmod.com/page/Main_Page)'
contributor:
    name: Julian Meyer
    link: https://github.com/jmeyer2k # optional
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and
earn $100 per published guide.*

Garry's Mod enables complete control and modification of the video game engine, Source Engine. With Garry's Mod, you can create almost any game you want. Setting up a Garry's Mod server is a great way to play with friends over the internet while maintaining control over the server.

This guide shows how to create, maintain, and secure a Garry's Mod server.

{: .note}
>
>You will need a [Steam](http://www.steampowered.com) account and a copy of Garry's Mod to complete this guide.

##Preparation

Before you begin, install necessary packages, create a user, and edit your firewall privileges.

{: .note}
> This section assumes root access. Be sure to run the guide as `root` or with the sudo prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

### Update Packages

1.  Log in to your Linode via [SSH](/docs/getting-started#logging-in-for-the-first-time).
2.  Run the update command, and install the required dependencies to run SteamCMD:

    	yum update
	    yum install tmux gdb mailx postfix glibc.i686 libstdc++.i686

###Update Firewall

If you have a firewall on your Linode, add the following ruleset to `iptables.firewall.rules` in order to run SteamCMD:

{: .file-excerpt}
/etc/iptables.firewall.rules
:   ~~~
    # Allow SteamCMD
    -A INPUT -p udp -m udp --sport 27000:27030 --dport 1025:65355 -j ACCEPT
    -A INPUT -p udp -m udp --sport 4380 --dport 1025:65355 -j ACCEPT
    ~~~

### Add A User

1.  Create the user. In this example, the user is called `gmod`:

    	adduser gmod

2.  Set the password for your user:

	    passwd gmod

3.  Login to your new user:

    	su - gmod

## Installation

1.  Download the required script. This script installs both the server installer (SteamCMD) and the necessary server files:

    	wget http://danielgibbs.co.uk/dl/gmodserver

2.  Give the user execute permissions for the script:

    	chmod +x gmodserver

3.  Run the installer:

    	./gmodserver install

4.  Press `y` when it asks about the server directory.

5.  Ensure that the install was successful, press `y` if the output reads affirmative:

        Update state (0x61) downloading, progress: 97.37 (3695044726 / 3795030198)
	    Update state (0x61) downloading, progress: 99.92 (3792009490 / 3795030198)
	    Success! App '4020' fully installed.

	    =================================
	    Was the install successful? [y/N]

6.  You can choose to install [Game Server Query](https://code.google.com/p/ax-gameserver-query/) in the next step. The Game Server Query plugin improves monitoring of the server. 

7.  Configure your server by replacing `Example Server` and `password` with your desired server name and password.

	    Enter server name: Example Server
    	Enter rcon password: password

## Configuration

This section configures different aspects of the server, including gamemode and workshop addons.

1.  Create a collection of addons you want to install on your server at [Garry's Mod Collections](http://steamcommunity.com/workshop/browse/?section=collections&appid=4000&p=3). You will need to be logged into Steam.

2.  Note the collection ID. It is located at the end of the url, denoted by the 'X's here:

    	http://steamcommunity.com/sharedfiles/filedetails/?id=XXXXXXXXX

3.  Acquire a Steam API key from the [Steam API Keys](http://steamcommunity.com/dev/apikey) page. Note the key.

4.  Open `gmodserver` in the editor:

    	nano gmodserver

5.  Set the `workshopauth` to your Steam API Key, and your `workshopcollectionid` to your collection ID.

6.  Set the gamemode of the Garry's Mod server by adding the following to the `parms` variable on line 34:

    	+gamemode terrortown

    This sets the game for the Trouble in Terrorist Town (TTT) gamemode, but can be changed to your desired gamemode, if you have it downloaded.

7.  Save and exit with CTRL-X followed by Y.

### Running the Server

Start the server using:

    ./gmodserver start

To ensure it is running and access to the console, use:

    ./gmodserver console

{: .note}
>
>To exit the console, use CTRL-B followed by D. Do not CTRL-C out of the console, which shuts down the server.

To stop the server, use:

    ./gmodserver stop

## Server Maintenance

This section discusses how to do different maintenance functions for the server.

### Run on Boot

1.  Open up `/etc/rc.local`:

    	nano /etc/rc.local
	
2.  Add a line at the end of the file for Garry's Mod:

    {: .file-excerpt}
    /etc/rc.local
    :   ~~~
    	su - gmod -c '/home/gmod/gmodserver start'
    	~~~

3.  Save and exit using CTRL-X followed by Y.

### Enable Email Notification

1.  Open the `gmodserver` file:

    	nano gmodserver
	
2.  Turn on email notifications by editing these lines:

    {: .file}
    gmodserver
    :   ~~~
    	emailnotification="on"
	    email="test@example.com"
        ~~~

3.  Save and exit using CTRL-X followed by Y.

### Daily Server Update

1.  Edit the crontab using:

    	crontab -e

2.  Press `i` to enter insertion mode.

3.  Add this line to the the end of the crontab:

    	0 5 * * *  su - gmod -c '/home/gmod/gmodserver update-restart' > /dev/null 2>&1

	This configuration updates and restarts the server everyday at 5:00 am.

4.  Exit cron using ESC, `:x`, ENTER.

### Monitor the Server

This will make sure the server is online every 30 minutes.

1.  Edit the crontab using:

    	crontab -e

2.  Press `i` to enter insertion mode.

3.  Add this line to the end of the crontab:

    	*/30 * * * *  su - gmod -c '/home/gmod/gmodserver monitor' > /dev/null 2>&1

4.  Exit cron using ESC, `:x`, ENTER.

### Updating the Server

To update the server, run:

    ./gmodserver update

### Validating the Server

If you think your Garry's Mod version is corrupted for one reason or another, run:

    ./gmodserver validate



