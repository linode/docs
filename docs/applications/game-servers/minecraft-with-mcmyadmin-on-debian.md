---
author:
  name: James Stewart
  email: jstewart@linode.com
description: 'Installing McMyAdmin for Minecraft on Debian 7.'
keywords: 'minecraft,mcmyadmin,debian'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Thusday, February 5th, 2015
modified_by:
  name: James Stewart
published: 'Thursday, February 5th, 2015'
title: Installing McMyAdmin for Minecraft on Debian 7
external_resources:
 - '[McMyAdmin Home Page](http://mcmyadmin.com/#/home)'
---

McMyAdmin is a leading control panel for adminstration of Minecraft servers. It boasts compatibility with third party mods and a very slick web interface for managing your server. This guide will walk you through installation and configuration of your new McMyAdmin server. This guide assumes that you have an up to date Debian 7 Linode. If you have not followed our [getting started](/docs/getting-started/) guide, we recommend that you do so prior to following these instructions.

{: .note }
> To use a Minecraft server you must also have a version of the game client from [Minecraft.net](https://minecraft.net/).

##Prerequisite software

1.  Ensure that you have the latest operating system updates:

		sudo apt-get update && sudo apt-get upgrade

2.  Install the Java Runtime Environment:

		sudo apt-get install openjdk-7-jre

3.  If you have configured your firewall, ensure that a port is open for accessing the McMyAdmin web interface.
		
		 sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT

##Install Mono

1.  Switch to the installation directory:

		cd /usr/local

2.  Download the extra required files from McMyAdmin's website:

		wget http://mcmyadmin.com/Downloads/etc.zip
		unzip etc.zip; rm etc.zip

##Install McMyAdmin

1.  Change to the MdMyAdmin installation directory:

		mkdir ~/mcmyadmin
		cd ~/mcmyadmin

2.  Download the latest version of McMyAdmin:

		wget http://mcmyadmin.com/Downloads/MCMA2_glibc26_2.zip

3.  Extract the downloaded zip file.

		unzip MCMA2_glibc26_2.zip

4.  Start the initial configuration of McMyAdmin.  Replace PASSWORD with the admin password for your McMyAdmin web interface:

		 ./MCMA2_Linux_x86_64 -setpass PASSWORD -configonly

##Running McMyAdmin

1.  Install screen, if it is not already installed on your system:

		sudo apt-get install screen

2.  Start a screen session for your McMyAdmin client to run in:

		screen -S mcma

3.  Ensure that you are in the correct directory, then execute the McMyAdmin server:

		cd ~/McMyAdmin; ./MCMA2_Linux_x86_64

##Managing your Minecraft Server

1.  Browse to the McMyAdmin web interface by visiting `http://YourLinodeIP:8080`.

	[![Login Page](/docs/assets/mcma-login-resize.png)](/docs/assets/mcma-login.png)

2.  Log in with the password that you provided in the installation step.
	
	[![Configuration Page](/docs/assets/mcma-config-resize.png)](/docs/assets/mcma-config.png)

3.  Once you have completed the initial configuraition steps and selected your settings, switch to the status page.
	
	[![Status Page](/docs/assets/mcma-status-resize.png)](/docs/assets/mcma-status.png)

4.  Click on "Start Server"

	[![Server Started](/docs/assets/mcma-running-resize.png)](/docs/assets/mcma-running.png)


Congratulations, you've now set up a new Minecraft server using McMyAdmin.