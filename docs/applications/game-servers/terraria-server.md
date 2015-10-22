---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Guide for running a Terraria gaming server on different Linux distributions.'
keywords: 'terraria,gaming,server,steam'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: Wednesday, October 18th, 2015
modified: Wednesday, October 18th, 2015
modified_by:
    name: Tyler Langlois
title: Installing Terraria Server
contributor:
  name: Tyler Langlois
  link: https://github.com/tylerjl
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

[Terraria](http://terraria.org/) is a two-dimensional sandbox game similar to Minecraft that allows players to explore, build, and battle in an open world. The Terraria developers recently [announced support for Linux](http://terraria.org/news/terraria-1-3-0-8-now-for-mac-linux-too), which means that players can host their own standalone Terraria servers as well.

These steps will outline everything required in order to run a Terraria server for yourself or others to play on.

{: .note}
>
>This guide is compatible with any Linux distribution that uses systemd as an init system, including recent versions of Debian and Ubuntu, Arch Linux, or recent RHEL-based distributions.

{: .caution }
>
>Take note of the system requirements for running a Terraria server when checking the Terraria site for latest download information. If your machine does not meet the minimum requirements, your server may be prohibitively slow or may crash intermittently.

## Before You Begin

Running a game server entails opening services to the outside world, so before getting started, become familiar with the following guides:

-   [Getting Started](/docs/getting-started)
-   [Securing Your Server](/docs/security/securing-your-server)

Doing so will ensure your server is in good shape and secure against threats when operating on the open internet.

Also note that if you are using a firewall, you will need to open the port used to access Terraria, which by default is port 7777:

	sudo iptables -I INPUT 9 -p tcp --dport 7777 -j ACCEPT
	sudo ip6tables -I INPUT 9 -p tcp --dport 7777 -j ACCEPT

## Installing Terraria

You should check [Terraria news](http://terraria.org/news) to get the latest version which, at the time of this writing, is version 1.3.0.8. First, download the tarball to `/tmp`:

	sudo wget -P /tmp http://terraria.org/server/terraria-server-linux-1308.tar.gz

Extract the archive, fix permissions, and create a link to access the game files with an easier-to-remember path in future steps:

	sudo tar xvzf /tmp/terraria-server-linux-1308.tar.gz -C /opt
	sudo chown -R root:root /opt/terraria*
	sudo find /opt/terraria* -type f -print0 | sudo xargs -0 chmod a+r
	sudo find /opt/terraria* -type d -print0 | sudo xargs -0 chmod a+rx
	sudo ln -s /opt/terraria-server-linux-1308 /opt/terraria

Finally, running daemons under discrete users is a good practice, so create a `terraria` user to run the game server:

	sudo useradd -r -m -d /srv/terraria terraria

With the server files installed, we need an automated way to start, stop, and automatically bring up our server - this is important if the machine Terraria is running on is rebooted. This guide will use systemd to manage the service, which is rapidly becoming common on most distributions.

### Creating a Terraria Service

Terraria, like many other game servers, runs an interactive console as part of its server process. While useful, this can be challenging to use when operating servers under service managers. This can be solved by running Terraria under a [screen](https://www.gnu.org/software/screen/) session to enable us to send arbitrary commands to the listening admin console within screen.

First install screen with the system package manager. In a Debian-based distribution:

	sudo apt-get install screen

Or, in a distribution with `yum`:

	sudo yum install screen

Now make a systemd service file to define how to start and stop the server. Create the following file to define the `terraria` systemd service:

{: .file}
/etc/systemd/system/terraria.service
:   ~~~ ini
	[Unit]
	Description=server daemon for terraria

	[Service]
	Type=forking
	User=terraria
	KillMode=none
	ExecStart=/usr/bin/screen -dmS terraria /bin/bash -c "/opt/terraria/TerrariaServer -autoarch -config /srv/terraria/config.txt"
	ExecStop=/usr/local/bin/terrariad exit
    ~~~

The `ExecStart` line instructs systemd to spawn a screen session containing `TerrariaServer` which starts the daemon, and sets `KillMode=none` to ensure that systemd does not prematurely kill the server before it has had a chance to cleanly save and close down the server.

The `ExecStop` line calls a script to send arbitrary commands to the running `TerrariaServer` instance, which will be written next.

### Writing Scripts to Run Terraria

Two primary functions are needed for the Terraria administration script: attaching to the running screen session, which offers a helpful administration console, and the ability to broadcast input into the screen session, so the script can be run to to save the world, exit the server, and so on.

Create the following script:

{: .file}
/usr/local/bin/terrariad
:   ~~~
	#!/usr/bin/env bash

	send="`printf \"$*\r\"`"
	attach='script /dev/null -qc "screen -r terraria"'
	inject="screen -S terraria -X stuff $send"

	if [ "$1" = "attach" ] ; then cmd="$attach" ; else cmd="$inject" ; fi

	if [ "`stat -c '%u' /var/run/screen/S-terraria/`" = "$UID" ]
	then
			$cmd
	else
			su - terraria -c "$cmd"
	fi
    ~~~

Ensure this script can be run as an executable:

	sudo chmod +x /usr/local/bin/terrariad

This script will permit you to attach to the console or send it commands like `save` or `exit` when it's running. Before starting the server, `TerrariaServer` needs a configuration file.

## Configuring Terraria

Terraria can be configured at run-time by a configuration file, which can automatically create a world and start the server without any manual intervention.

Create the following text file, which will be used the systemd service created earlier. Note that you should change "MyWorld" to be a world name of your own choice:

{: .file}
/srv/terraria/config.txt
:   ~~~ ini
	autocreate=1
	worldname=MyWorld
	world=/srv/terraria/Worlds/MyWorld.wld
	worldpath=/srv/terraria/Worlds
	~~~

{: .note}
>
>There are several server options that you can customize to configure settings such as difficulty, server passwords, and so on. See the [list of config file options](http://terraria.gamepedia.com/Server#Server_config_file) if you need to customize your server.

These options will automatically create and select a world to serve.

## Running Terraria

With the game server installed, scripts written, and the service ready, the server can be started with a single command:

	sudo systemctl start terraria

That's it! To check if the server is running, use:

	sudo systemctl status terraria

Which should have several lines of information, including a line that says `active (running)`. The first run of the server must generate the world we defined earlier, so give it time if you want to connect to it right away (use `sudo terrariad attach` if you need to check whether the world has been generated or not.)

In the course of running your server, you may need to attach to the console to do things like kick players or change the message of the day. To do so, use the `terrariad` script:

	sudo terrariad attach

You'll enter the Terraria server console. Type `help` to get a list of commands. Once you're done, use the keyboard shortcut **CTRL-A** then **d** to **d**etach from the screen session and leave it running in the background (there are many different keyboard shortcuts that `screen` recognizes, see the [shortcut documentation](http://www.gnu.org/software/screen/manual/html_node/Default-Key-Bindings.html#Default-Key-Bindings) for more information.)

If you ever need to shut down Terraria, run the command:

	$ sudo systemctl stop terraria

Which will save the world and shut down the game server.
