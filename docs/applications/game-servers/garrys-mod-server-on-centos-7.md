This guide will show you how to setup, secure, and enable maintenance functions on a Garry's Mod server for CentOS 7. 

Garry's Mod is a game that enables complete control and modification to the main game, allowing it to be essentially any game you want it to be. The modifications are coded in Lua.

Setting up a Garry's Mod server is a great way to play with friends over the internet and allows for complete control over what the server runs.

In this guide, we will show you how to create a Garry's Mod server running TTT, one of the many gamemodes for Garry's Mod, and maintain the server. We will also show you how to secure the server so no nasty admins ruin your Linode.

Preparation
-----------

First, we'll need to install necessary packages and create a user.

### Update Packages

1.  Log in to your Linode via [SSH](/docs/getting-started#sph_logging-in-for-the-first-time).
2.  Run the update command:

	```
	yum update
	yum install tmux gdb mailx postfix glibc.i686 libstdc++.i686
	```

### Add a gmod user

1.  Create the user:

	```
	adduser gmod
	```

2.  Set the password for gmod:

	```
	passwd gmod
	```

3.  Login as gmod:

	```
	su - gmod
	```

	Enter the password that you set before.

Installation
------------

1.  Download the required script:

	```
	wget http://danielgibbs.co.uk/dl/gmodserver
	```

2.  Give the user execute permissions for the script (this means that you can run it):

	```
	chmod +x gmodserver
	```

3.  Run the installer

	```
	./gmodserver install
	```

4.  Press `Y` when it asks about the server directory.
5.  Ensure that the install was successful and press `Y` when it asks you:

	```
	 Update state (0x61) downloading, progress: 97.37 (3695044726 / 3795030198)
	 Update state (0x61) downloading, progress: 99.92 (3792009490 / 3795030198)
	Success! App '4020' fully installed.

	=================================
	Was the install successful? [y/N]
	```

6.  You can choose to install [GameServerQuery](https://code.google.com/p/ax-gameserver-query/) in the next step.
7.  Configure your server by changing the next couple of values:

	```
	Enter server name: Example Server
	Enter rcon password: example
	```

Configuration
=============

In this step, we will configure different aspects of the server including gamemode and workshop addons.

1.  Create a collection of addons you want to install on your server here: [Garry's Mod Collections](http://steamcommunity.com/workshop/browse/?section=collections&appid=4000&p=3).
2.  Note the collection ID of your collection:

	```
	http://steamcommunity.com/sharedfiles/filedetails/?id=XXXXXXXXX
	```

3.  Grab a Steam API key from here: [Steam API Keys](http://steamcommunity.com/dev/apikey).
4.  Start the `nano` editor:

	```
	nano gmodserver
	```

5.  Set the `workshopauth` to your Steam API Key, and your `workshopcollectionid` to your collection ID.
6.  Set the gamemode of the Garry's Mod server by adding this to the `parms` variable on line 34.

	```
	+gamemode terrortown 
	```

7.  Save and exit `nano` with CTRL-X followed by Y.

### Running the Server

You can now start the server using:

```
./gmodserver start
```

To ensure it is running and access the console use:

```
./gmodserver console
```

**To exit the console, use CTRL-B followed by D. DO NOT USE CTRL-C!**

To stop the server user:

```
./gmodserver stop
```

Server Maintenance
==================

In this section, we will discuss how to do different maintenance functions for the server.

### Run on Boot

1.  Open up nano:

	```
	nano /etc/rc.local
	```

2.  Add a line at the end of the file for Garry's Mod.

	```
	su - gmod -c '/home/gmod/gmodserver start'
	```

3.  Save and exit using CTRL-X followed by Y.

### Email Notification

1.  Open up nano:

	```
	nano gmodserver
	```

2.  Turn on email notification by editing these lines:

	```
	emailnotification="on"
	email="test@example.com"
	```

3.  Save and exit using CTRL-X followed by Y.

### Update the Server Everyday

1.  Edit the crontab using:

	```
	crontab -e
	```

2.  Press I to enter insertion mode.
3.  Add this line to the the end of the crontab:

	```
	0 5 * * *  su - gmod -c '/home/gmod/gmodserver update-restart' > /dev/null 2>&1
	```

	This will update and restart the server everyday at 5:00 am.

4.  Exit cron using ESC, `:X`, ENTER.

### Monitor the Server

Make sure the server is online every 30 minutes.

1.  Edit the crontab using:

	```
	crontab -e
	```

2.  Press I to enter insertion mode.
3.  Add this line to the end of the crontab:

	```
	*/30 * * * *  su - gmod -c '/home/gmod/gmodserver monitor' > /dev/null 2>&1
	```

	This will make sure the server is online every 30 minutes.

4.  Exit cron using ESC, `:X`, ENTER.

### Updating the Server

To update the server, run:

```
./gmodserver update
```

### Validating the Server

If you think your Garry's Mod version is corrupted for one reason or another, run:

```
./gmodserver validate
```

More Information
----------------

For more information see the links below:
- [SRCDS](http://www.srcds.com/)
- [GMod Forums](http://facepunch.com/forum.php)
- [GMod Wiki](http://wiki.garrysmod.com/page/Main_Page)