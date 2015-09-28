---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Setting up Mumble on Debian'
keywords: 'mumble, debian, murmur, open source, gaming, VOIP, voice chat'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Thursday, September 24th, 2015'
modified: Thursday, September 24th, 2015
modified_by:
    name: Linode
title: 'Mumble on Debian'
contributor:
    name: Your Name
    link: Github/Twitter Link
---

Mumble is an open-source VoIP client, designed for gamers, that requires a server for all clients to connect to. This guide instructs you on how to install and configure the Mumble server (also called Murmur) on Debian 8.

No changes need to be made to the system beforehand if you follow this guide. 

Througout this guide, all commands are run as root.  If you are not root user, you can prepend each command with "sudo." 

## Server Side

### Install and Simple Setup

1. Since Murmur is in the official Debian repositories, you can just use apt-get to install it.  Be careful though, the package is `mumble-server` and not `murmur`. Enter the following command (remember to prepend with sudo if needed):

	apt-get install mumble-server

2. After installation, you can use `dpkg-reconfigure` to configure the initial setup.

The first question asked during system config will be whether or not you want the server to run at boot.  This is identical to using the command `systemctl enable mumble-server`.

	[![Image description](/docs/assets/murmur-debian-auto-start-resized.png)](/docs/assets/murmur-debian-auto-start.png)

If you want Murmur to have a highter priority over other applications on the server, you can answer yes to this question.

	[![Image description](/docs/assets/murmur-debian-priority-resized.png)](/docs/assets/murmur-debian-priority.png)

Next, you will be asked to set a SuperUser password.  Murmur has a modifiable SuperUser account that lets you change server settings in Mumble on the client.  You may set it to whatever password you want.

	[![Image description](/docs/assets/murmur-debian-super-user-resized.png)](/docs/assets/murmur-debian-super-user.png)

You now have a working Mumble server.  It's time to configure it.

### More Configuration

If you need to address more exacting configuration specs, such as assigning port numbers and/or maximum users, Murmur has a settings file at `/etc/mumble-server.ini` that can be modified. Below is a partial list of settings included; more settings exist and are further explained in the settings file.

	- **autobanAttempts** - Set how many times someone can fail to connect to the server within a given timeframe.
	- **autobanTimeframe** - Set the given timeframe for attempts to login to the server. 
	- **autobanTime** - Set the amount of time that the login ban lasts.
	- **logfile** - Set the location of the log file, if you want it to reside in a different location.
	- **welcometext** - Set the text that shows in the text chat log when you login.
	- **port** - Set the port you wish to bind to and have your users connect to.
	- **serverpassword** - Set a password that users will have to use to login.  This is not the same as the SuperUser password and therefore, should be different.
	- **bandwidth** - Set the maximum bandwith (in bits per second) each user can use.
	- **users** - Set the maximum number of users that can connect to the server at once.

Once you are done configuring the settings in that file, save it and restart Murmur.

For Debian 8, enter:

	systemctl restart mumble-server

For Debian 7 or earlier, enter:

	service mumble-server restart

### Extra Information

If you wish to disable the server starting at boot, you can use your init system to disable it.

For Debian 8, enter:

	systemctl disable mumble-server

For Debian 7 or earlier, enter:

	service mumble-server disable

For more information on Murmur and Mumble, you can visit the [Mumble Wiki](http://wiki.mumble.info/wiki/Main_Page).

## Client Side

### Installation

On Windows, go to (link) and download and install the installer.
On Mac, go to (link) and download and install the installer.

On Ubuntu/Debian, install the package `mumble`, enter:

	sudo apt-get install mumble

On Fedora, install the package `mumble`, enter:

	sudo yum install mumble

On Arch Linux, install the package `mumble`, enter:

	sudo pacman -Sy mumble

### Connecting As SuperUser

After installing the client and server, if you want to grant permissions to other users or make changes to the server, you must connect as SuperUser. Be aware! SuperUser cannot be used to speak on the server, only to make changes.

To connect, open the client, then click Server, then Connect.  This opens the Mumble Server Connect dialog.

[![Image description](/docs/assets/mumble-server-list.png)](/docs/assets/mumble-server-list.png)

Next, click Add New at the bottom and enter the following.

	- **Label** - Name this anything you want.
	- **Address** - Enter the IP address or domain name of the server.
	- **Port** - Leave this as default (64738), unless you changed it in the server's configuration.
	- **Username** - Identify the SuperUser username.
	- **Password** - Set this to whatever you set the SuperUser password to in the server's setup.

[![Image description](/docs/assets/mumble-superuser-info.png)](/docs/assets/mumble-superuser-info.png)

Oonce these addition have been made to your server list, select it and click Connect.

[![Image description](/docs/assets/mumble-server-list-with-favorite.png)](/docs/assets/mumble-server-list-with-favorite.png)

Mumble may then ask you if you want to accept a self-signed certificate.  Since we never set up an SSL certificate, just select "Yes" for this dialog.

[![Image description](/docs/assets/mumble-accept-certificate.png)](/docs/assets/mumble-accept-certificate.png)

You should now be connected as SuperUser.  You can make changes to the server by right-clicking the Root channel and selecting edit.  Please refer to the [Mumble Wiki](http://wiki.mumble.info/wiki/Main_Page) for more information on how to configure channels.

[![Image description](/docs/assets/mumble-connected-as-superuser-resized.png)](/docs/assets/mumble-connected-as-superuser.png)

### Connecting As Normal User

When a normal user connects, you follow the same relative process as you did to connect as the SuperUser; however, a password is not necessary (unless you set one, which you can then use it to communicate).

To open the Mumble Server Connect dialog, first open the client, then click Server, and then Connect.  The following appears on your screen:

[![Image description](/docs/assets/mumble-server-list.png)](/docs/assets/mumble-server-list.png)

At page bottom, click Add New, then enter the following:

	- **Label** - Name this anything you want.
	- **Address** - Enter the IP address or domain name of the server.
	- **Port** - Leave this as default (64738), unless you changed it in the server's configuration.
	- **Username** - Name this anything you want, as your identifier on the server.

[![Image description](/docs/assets/mumble-connect-as-normal-user.png)](/docs/assets/mumble-connect-as-normal-user.png)

You should now be logged in as a normal user and can use the server normally.

[![Image description](/docs/assets/mumble-connected-as-normal-user-resized.png)](/docs/assets/mumble-connected-as-normal-user.png)
