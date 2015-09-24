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

Mumble is an open source VoIP client that is designed for gamers.  Mumble requires use of a server for all of the clients to connect to and this guide shows how to install and configure the Mumble server (also called Murmur) on Debian 8.

This guide requires nothing to be done on the system beforehand.

All commands are ran as root in this guide.  If you are not root, you can use sudo for this.  Just prepend sudo to all the commands.

## Server Side

### Install and Simple Setup

1. Since murmur is in the official Debian repositories, we can just use apt-get to install it.  Be careful though, the package is `mumble-server` and not `murmur`.

	apt-get install mumble-server

2. After you install it, you can use `dpkg-reconfigure` to do the initial setup.

The first question it will ask is if you want the server to run at boot.  This is the same as using the command `systemctl enable mumble-server`.

	[![Image description](/docs/assets/murmur-debian-auto-start-resized.png)](/docs/assets/murmur-debian-auto-start.png)

If you want murmur to have a highter priority over other applications on the server, you can answer yes here.

	[![Image description](/docs/assets/murmur-debian-priority-resized.png)](/docs/assets/murmur-debian-priority.png)

Now it will ask you to set a SuperUser password.  Murmur has a SuperUser account that you can change the settings for the server in Mumble on the client.  Set it to whatever you want.

	[![Image description](/docs/assets/murmur-debian-super-user-resized.png)](/docs/assets/murmur-debian-super-user.png)

You now have a working mumble server.  Now it's time to configure it.

### More Configuration

If you need more configuration, such as port numbers and maximum users, murmur has a settings file at `/etc/mumble-server.ini`.  Here's a list of settings that are included.  There are more settings than listed and are further explained in the settings file.

	- **autobanAttempts** - How many times someone can fail to connect to the server within the timeframe.
	- **autobanTimeframe** - This is the timeframe for the previous setting.
	- **autobanTime** - The amount of time that the ban lasts.
	- **logfile** - Location of the log file, if you want it in a different place.
	- **welcometext** - The text that shows in the text chat log when you log in.
	- **port** - The port you wish to bind to and have your users connect to.
	- **serverpassword** - A password that users will have to use to log in.  This is not the same as the SuperUser password and should be different.
	- **bandwidth** - The maximum bandwith (in bits per second) each user can use.
	- **users** - The maximum users that can connect to the server at once.

Once you are done setting the settings in that file, save it and restart murmur.

For Debian 8:

	systemctl restart mumble-server

For Debian 7 or earlier:

	service mumble-server restart

### Extra Information

If you wish to disable the server starting at boot, you can use your init system to disable it.

For Debian 8

	systemctl disable mumble-server

For Debian 7 or earlier:

	service mumble-server disable

For more information on mumble and murmur, you can visit the [Mumble Wiki](http://wiki.mumble.info/wiki/Main_Page).

## Client Side

### Installation

On Windows, go to (link) and download and install the installer.
On Mac, go to (link) and download and install the installer.

On Ubuntu/Debian, install the package `mumble`.

	sudo apt-get install mumble

On Fedora, install the package `mumble`.

	sudo yum install mumble

On Arch Linux, install the package `mumble`.

	sudo pacman -Sy mumble

### Connecting As SuperUser

After you install the client and server, if you want to grant permissions to other users or make changes to the server, you must connect as 
SuperUser.  SuperUser cannot be used to speak on the server, only to make changes.

To connect, open the client, then click Server then Connect.  This opens the Mumble Server Connect dialog.

[![Image description](/docs/assets/mumble-server-list.png)](/docs/assets/mumble-server-list.png)

There click Add New at the bottom, them type in the following.

	- **Label** - Anything you want.
	- **Address** - The IP address or domain name of the server.
	- **Port** - Leave default (64738) unless you changed in the server's configuration.
	- **Username** - SuperUser
	- **Password** - Whatever you set the SuperUser password to in the server's setup.

[![Image description](/docs/assets/mumble-superuser-info.png)](/docs/assets/mumble-superuser-info.png)

Then once it's added to your server list, select it and click Connect.

[![Image description](/docs/assets/mumble-server-list-with-favorite.png)](/docs/assets/mumble-server-list-with-favorite.png)

Mumble may then ask you if you want to accept a self-signed certificate.  Since in this guide, we never set up an SSL certificate, just select "Yes" on this dialog.

[![Image description](/docs/assets/mumble-accept-certificate.png)](/docs/assets/mumble-accept-certificate.png)

You should now be connected as SuperUser.  You can make changes to the server by right-clicking the Root channel and selecting edit.  Please refer to the [Mumble Wiki](http://wiki.mumble.info/wiki/Main_Page) for more information on how to configure channels.

[![Image description](/docs/assets/mumble-connected-as-superuser-resized.png)](/docs/assets/mumble-connected-as-superuser.png)

### Connecting As Normal User

When a normal user connects, it's relatively the same process as connecting as SuperUser, just without a password (unless you set one) and you can use it to communicate.

To connect, open the client, then click Server then Connect.  This opens the Mumble Server Connect dialog.

[![Image description](/docs/assets/mumble-server-list.png)](/docs/assets/mumble-server-list.png)

There click Add New at the bottom, them type in the following.

	- **Label** - Anything you want.
	- **Address** - The IP address or domain name of the server.
	- **Port** - Leave default (64738) unless you changed in the server's configuration.
	- **Username** - Anything you want to be named on the server.

[![Image description](/docs/assets/mumble-connect-as-normal-user.png)](/docs/assets/mumble-connect-as-normal-user.png)

You should now be logged in as a normal user and can use the server normally.

[![Image description](/docs/assets/mumble-connected-as-normal-user-resized.png)](/docs/assets/mumble-connected-as-normal-user.png)
