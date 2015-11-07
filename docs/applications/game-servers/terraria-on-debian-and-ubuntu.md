---
author:
   name: Linode Community
   email: docs@linode.com
description: 'A basic Terraria server installation guide for Debian and Ubuntu'
keywords: 'terraria,server,ubuntu,debian'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
external_resources:
 - '[Terraria.org](https://terraria.org/)'
 - '[The Official Terraria Wiki](http://terraria.gamepedia.com/Server)'
modified: Saturday, November 07, 2015
modified_by:
   name: Linode
published: '-'
title: 'Terraria Server on Debian and Ubuntu'
contributor:
   name: Davide Beatrici
   link: https://github.com/davidebeatrici
---

This guide will show you how to set up your own [Terraria](https://terraria.org/) server on a Linode running Debian or Ubuntu.

##Prerequisites

1.  Check for updates:

        sudo apt-get update && sudo apt-get upgrade

2.  Create a new user for Terraria to run as. Never run as root, for security:
        
        useradd -m terraria

{: .note }
> If you have a firewall configured according to our [Securing Your Server](/docs/security/securing-your-server) guide, you will need to add an exception for port 7777. The line to add to your `iptables.firewall.rules` file is:
>
>     -A INPUT -p tcp --dport 7777 -j ACCEPT

##Download Terraria Server

1.  Switch to your newly created account:

        sudo -u terraria -i

2.  Download the latest version of Terraria Server from [Terraria.gamepedia.com](http://terraria.gamepedia.com/Server). Refer to the linked page to download the latest version. The current version as of this publication is 1.3.0.8:

        wget http://terraria.org/server/terraria-server-linux-1308.tar.gz

3.  Extract the archive:

        tar -zxvf terraria-server-linux-1308.tar.gz

4.  Cleanup:

        rm terraria-server-linux-1308.tar.gz

5.  Move into the new folder:

        cd terraria-server-linux-1308

##Run Terraria Server

1.  Open the `serverconfig.txt` file to change the values if you want to:

    {: .file }
    /home/terraria/terraria-server-linux-1308/serverconfig.txt :
    
        #this is an example config file for TerrariaServer.exe
		#use the command 'TerrariaServer.exe -config serverconfig.txt' to use this configuration or run start-server.bat
		#please report crashes by emailing crashlog.txt to support@terraria.org

		#the following is a list of available command line parameters:

		#-config <config file>				            Specifies the configuration file to use.
		#-port <port number>				            Specifies the port to listen on.
		#-players <number> / -maxplayers <number>	    Sets the max number of players
		#-pass <password> / -password <password>	    Sets the server password
		#-world <world file>				            Load a world and automatically start the server.
		#-autocreate <#>			                    Creates a world if none is found in the path specified by -world. World size is specified by: 1(small), 2(medium), and 3(large).
		#-banlist <path>			                    Specifies the location of the banlist. Defaults to "banlist.txt" in the working directory.
		#-worldname <world name>             			Sets the name of the world when using -autocreate.
		#-secure			                            Adds addition cheat protection to the server.
		#-noupnp				                        Disables automatic port forwarding
		#-steam                         			    Enables Steam Support
		#-lobby <friends> or <private>                  Allows friends to join the server or sets it to private if Steam is enabled
		#-ip <ip address>	                            Sets the IP address for the server to listen on
		#-forcepriority <priority>	                    Sets the process priority for this task. If this is used the "priority" setting below will be ignored.

		#remove the # in front of commands to enable them.

		#Load a world and automatically start the server.
		#world=C:\Users\YOUR_USERNAME_HERE\My Documents\My Games\Terraria\Worlds\world1.wld

		#Creates a new world if none is found. World size is specified by: 1(small), 2(medium), and 3(large).
		#autocreate=1

		#Sets the name of the world when using autocreate
		#worldname=Terraria

		#Sets the difficulty of the world when using autocreate 0(normal), 1(expert)
		#difficulty=1

		#Sets the max number of players allowed on a server.  Value must be between 1 and 255
		#maxplayers=8

		#Set the port number
		#port=7777

		#Set the server password
		#password=p@55w0rd

		#Set the message of the day
		#motd=Please don’t cut the purple trees!

		#Sets the folder where world files will be stored
		#worldpath=C:\Users\Defaults\My Documents\My Games\Terraria\Worlds\

		#The location of the banlist. Defaults to "banlist.txt" in the working directory.
		#banlist=banlist.txt

		#Adds addition cheat protection.
		#secure=1

		#Sets the server language 1:English, 2:German, 3:Italian, 4:French, 5:Spanish
		#lang=1

		#Automatically forward ports with uPNP
		#upnp=1

		#Reduces enemy skipping but increases bandwidth usage. The lower the number the less skipping will happen, but more data is sent. 0 is off.
		#npcstream=60

		#Default system priority 0:Realtime, 1:High, 2:AboveNormal, 3:Normal, 4:BelowNormal, 5:Idle
		priority=1

2.  Run Terraria Server:

        ./TerrariaServer

3.  It will ask you to select a world:

        $ ./TerrariaServer
        Terraria Server v1.3.0.8

        n               New World
        d <number>      Delete World

        Choose World:

4.  To ensure that Terraria server keeps running, dependent of an SSH connection, execute `TerrariaServer` from within a [GNU Screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions) session:

        screen /home/terraria/terraria-server-linux-1308/TerrariaServer.sh

Your server is now available to connect to. 

##Connecting to your Terraria Server

1.  Open Terraria and click on the **Multiplayer** option:

    [![Terraria Main Menu.](/docs/assets/terraria-select-multiplayer_small.png)](/docs/assets/terraria-select-multiplayer.png)

2.  Click on **Join via IP**:

    [![join via IP.](/docs/assets/terraria-join-via-ip_small.png)](/docs/assets/terraria-join-via-ip.png)

3.  Select your player:

    [![Select Player.](/docs/assets/terraria-select-player_small.png)](/docs/assets/terraria-select-player.png)

4.  Enter the IP address or domain name of your Linode:

    [![Enter IP or domain name.](/docs/assets/terraria-enter-ip_small.png)](/docs/assets/terraria-enter-ip.png)
	
4.  Enter the port:

    [![Enter port.](/docs/assets/terraria-enter-port_small.png)](/docs/assets/terraria-enter-port.png)
	
5.  Play:
	
    [![Enjoy.](/docs/assets/terraria-gameplay_small.png)](/docs/assets/terraria-gameplay.png)

You can now play Terraria together with your friends. Enjoy!
