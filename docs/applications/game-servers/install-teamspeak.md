---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Set up TeamSpeak on your Linode and chat with your friends or coworkers while gaming, working, or otherwise'
keywords: 'teamspeak,virtual intercom,chat'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Thursday, June 25th, 2015'
modified: Thursday, June 25th, 2015
modified_by:
    name: Elle Krout
title: 'Install a TeamSpeak Server on Linode'
contributor:
    name: Scott Somner
    link: 
---

This guide will show you how to install TeamSpeak Server on your Linode.  What's TeamSpeak?  Its a voice server or a "virtual intercom" that lets you talk with your friends.  It's most popular for gaming but people also use it to collaborate with their work groups, hobby projects, or just to chat with friends and family.  Let's get started.

Before you begin, ensure you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server/) guides.

While Teamspeak should run on any flavor of Linux the instructions provided here are specific to Ubuntu / Debian.

## Install TeamSpeak

### Getting the Teamspeak Download

1.	On your own computer visit **www.teamspeak.com**.

2.	From the Downloads menu in the upper right click TeamSpeak 3

3.	Select Server AMD64

5.	Click the download button

6.	Read and agree to the license agreement, then click Submit

7.	On the download page copy the download link; you can quit the automatic download.

### Fetch and Extract Teamspeak

1.	Log into your Linode via SSH, and create a new directory:

		mkdir teamspeak

2.	Change to the new directory:

		cd teamspeak

3. 	Download the teamspeak package, replacing the URL with the one copied in the previous section:

		wget http://dl.4players.de/ts/releases/3.0.11.3/teamspeak3-server_linux-amd64-3.0.11.3.tar.gz

4. 	Extract the package with tar:

		tar -xvf teamspeak3-server_linux-amd64-3.0.11.3.tar.gz


## Running TeamSpeak

Once Teamspeak is downloaded you're ready to start the server.  Teamspeak comes pre-compiled so no configuration or building is required.

1.	Change to the newly-extracted directory

		cd teamspeak3-server_linux-amd64

2. 	Run the server startup script

		./ts3server_startscript.sh start

3. 	Make note of the loginname, password, and token that are printed the first time the server is started.  You'll need them when you connect the first time.

4.	From your computer, open your TeamSpeak client, and open the connect dialog.

	![The connect dialog box](/docs/assets/teamspeak-connect.png)

5. 	Enter the IP address of your Linode, the nickname as **serveradmin** and the password as provided.

6.	Once the connection is succesful the client will ask you for the security token.  Copy it from the SSH session and paste it into the dialog box in the client.


## Making TeamSpeak Start Automatically

If you want Teamspeak to automatically start every time your Linode boots follow these instructions.

1. 	Check your server path:

		pwd

	It should output something similar to:

		/home/user/teamspeak/teamspeak3-server_linux-amd64

2. 	Create a new file as root called `/etc/init/teamspeak.conf` in your prefered text editor, and insert the following code, replacing `user` with your username and `/home/user/teamspeak/teamspeak3-server_linux-amd64/` with the path noted above:

	{: .file}
	/etc/init/teamspeak.conf
	:	~~~ conf
		#!/bin/sh
		chdir /home/user/teamspeak/teamspeak3-server_linux-amd64/

		respawn

		setuid user
		setgid user

		exec /home/user/teamspeak/teamspeak3-server_linux-amd64/ts3server_minimal_runscript.sh

		start on runlevel [2]
		stop on runlevel [013456]
		~~~

	Next time your Linode reboots TeamSpeak will start automatically.

## Firewall Configuration

If you use a firewall a couple of ports will need to be opened: 9987, 30033, 10011, and 41144.  Here's the commands to open those ports in IPtables.  Run each line as a separate command.

	iptables -A INPUT -p udp --dport 9987 -j ACCEPT
	iptables -A INPUT -p tcp --dport 30033 -j ACCEPT
	iptables -A INPUT -p tcp --dport 10011 -j ACCEPT
	iptables -A INPUT -p tcp --dport 41144 -j ACCEPT