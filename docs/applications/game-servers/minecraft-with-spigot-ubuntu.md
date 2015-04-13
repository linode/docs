---
author:
  name: Sam Mauldin
  email: --
description: 'Run a Mincecraft server with Spigot on Ubuntu'
keywords: 'garry''s mod,centos,centos 7'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/game-servers/minecraft-ubuntu12-04/']
published: 'Friday, April 10th, 2015'
modified: Friday, April 10th, 2015
modified_by:
  name: Elle Krout
title: 'Running a 1.8 Spigot Minecraft Server on Ubuntu 14.04 and 14.10'
contributor:
    name: Sam Mauldin
---

This guide shows you how to setup your own Minecraft server on a Linode running Ubuntu 14.04/14.10. You can play online with your friends and/or host a public server.

We'll compile the [Spigot](https://spigotmc.com) Minecraft server (1.8.3 at the time of publication) so you can use the whole expanse of Bukkit plugins available then deploy it so you can start crafting.

## Preparation

### Updating your system

Make sure your system is up to date before installing things. Run the following in a command line. Also, make sure that git is installed:

	sudo apt-get update && sudo apt-get upgrade
	sudo apt-get install git

### Installing Oracle Java

We'll need to install Oracle's JRE, because OpenJDK just won't cut it for running intensive applications.

1.	We'll being using the [Webupd8](http://www.webupd8.org) PPAs to install Java because it's not in the official package repositories.

		sudo add-apt-repository ppa:webupd8team/java
		sudo apt-get update
		sudo apt-get install oracle-java7-installer

	You'll be asked to accept the Oracle Java license.

2.	Now we should have Java installed. Type `java -version` to make sure. You should see something like this:

		java version "1.7.0_76"
		Java(TM) SE Runtime Environment (build 1.7.0_76-b13)
		Java HotSpot(TM) 64-Bit Server VM (build 24.76-b04, mixed mode)

	If not, you may already have a different version of Java installed. Try `sudo update-java-alternatives -s java-7-oracle` and check `java` again to see if it works.
	
	Now java is fully installed and we're ready to go!

### Add Firewall Exception

If running an IP tables firewall (as shown in the [Securing Your Server](/docs/security/securing-your-server/) guide), add an exception to your iptables rules:

	sudo iptables -A INPUT -p tcp --dport 25565 -j ACCEPT

If you are running a different form of firewall, an exception will also need to be added.

### Creating a Minecraft user

1.	Let's create a Minecraft user so we have somewhere to put all of the server files.

		sudo adduser minecraft

2.	Type a password then accept all the defaults. Then login to the Minecraft account.

		su - minecraft

## Installing SpigotMC

1.	Now let's install SpigotMC, a high performance Minecraft server based on Bukkit.

		mkdir build
		cd build
		wget https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar
		nice -n 15 java -jar BuildTools.jar

	This will take a few minutes, so take the opportunity to take a coffee break.

2.	When the build has finished, move the resulting jar to a server folder.

		mkdir ../server
		cd ../server
		mv ../build/spigot-1.*.jar spigot.jar

3.	We'll make a few scripts to make sure that your server's always up. Open a file called `wrapper.sh` in your perfered text editor. In the text editor, insert the following.

	{: .file}
	wrapper.sh
	:	~~~
		#!/bin/bash
		cd /home/minecraft/server;
	
		while true; do
		java -XX:MaxPermSize=128M -Xms512M -Xmx900M -jar spigot.jar
		sleep 5
		done
		~~~

You may want to change the RAM allocated depending on your Linode specs. Save your changes.

4.	Then make the file executable.

		chmod +x wrapper.sh

5.	Start your server for the first time.

		java -Xms512M -Xmx900M -jar spigot.jar

6.	It'll close itself and tell you to accept the EULA.

		nano eula.txt

	Change the value of eula to `true`.

### Starting your server on boot

1.	We'll add an entry to rc.local to start your server.

		sudo nano /etc/rc.local

2.	Change it to include the following before the `exit 0` line:

	{: .file-excerpt}
	/etc/local.rc
	:	~~~
		su -l minecraft -c "screen -dmS minecraft /home/minecraft/server/wrapper.sh"
		~~~

3.	Now, start your server!

		screen -dmS minecraft /home/minecraft/server/wrapper.sh

	To access the console, type `screen -r` as your Minecraft user. You might want to `/op` yourself so you can run admin commands. Have fun playing on your new Minecraft server! The IP that you connect with in Minecraft is the same as your Linode IP.

	Happy crafting!

## Customization

### Server Properties

-	**Enable command blocks**: Change the enable-command-block option of `/home/minecraft/server/server.properties` to true or false

-	**Gamemode**: Change the gamemode option of `/home/minecraft/server/server.properties` to 0, 1, 2, or 3; 0 is survival, 1 is creative, 2 is adventure and 3 is spectator

-	**Difficulty**: Change the difficuly option of `/home/minecraft/server/server.properties` to 0, 1, 2, or 3; 0 is peaceful, 1 is easy, 2 is normal, and 3 is hard.

-	**MOTD**: Change the MOTD option of `/home/minecraft/server/server.properties` to any text

-	**PVP**: Change the PVP option of `/home/minecraft/server/server.properties` to true or false.

-	**Other**: See the [Minecraft](http://minecraft.gamepedia.com/Server.properties) wiki for more details.

###Plugins

To add Bukkit plugins, put the .jar in `/home/minecraft/server/plugins` then type `stop`
into the server console.


