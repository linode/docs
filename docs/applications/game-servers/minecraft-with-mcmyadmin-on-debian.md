---
author:
  name: James Stewart
  email: jstewart@linode.com
description: 'Installing McMyAdmin for Minecraft on Debian.'
keywords: 'minecraft,mcmyadmin,debian,debian jessie,debian wheezy,jessie,wheezy'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Friday August 28th, 2015
modified_by:
  name: James Stewart
published: 'Thursday, February 5th, 2015'
title: Installing McMyAdmin for Minecraft on Debian
external_resources:
 - '[McMyAdmin Home Page](https://mcmyadmin.com/)'
 - '[McMyAdmin Settings Reference](http://wiki.cubecoders.com/wiki/3/mcmyadmin-settings-reference)'
---

[McMyAdmin](https://mcmyadmin.com/) is one of the most popular Minecraft server control panels available. It boasts compatibility with third party mods, heavy focus on security and a sleek web interface for managing your server. This guide covers the installation and configuration of a new McMyAdmin server on a Linode running Debian 7 or 8. Be aware that to actually play on a Minecraft server you must also have the game client from [minecraft.net](https://minecraft.net/).

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname run:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

2.  Update your system.

        sudo apt-get update && sudo apt-get upgrade

##Install Prerequisite Software

1.  Java Runtime Environment

		sudo apt-get install openjdk-7-jre

2.  [Mono](http://www.mono-project.com/). CubeCoders Limited, the company behind McMyAdmin, packages their own minimal installation of Mono with some necessary source and configuration files. This must be used instead of a generic Mono packages from Debian's repositories.

		cd /usr/local
		sudo wget http://mcmyadmin.com/Downloads/etc.zip
		sudo unzip etc.zip; sudo rm etc.zip

## Configure Firewall

This section assumes that you have followed our [Securing Your Server](/docs/security/securing-your-server) guide, so you already have those iptables rules in place and have the package `iptables-persistent` installed.

Your Linode now also needs to allow *incoming* TCP connections on port 8080 so McMyAdmin can be accessed. The rule must be inserted among those already in the `rules.v4` file.

1.  Take a look at your current iptables rules. Bear in mind that the order in which they're applied to incoming traffic is from the top to the bottom of the INPUT, FORWARD or OUTPUT chain. For this rule addition, only INPUT is of concern here.

		sudo iptables -L

	Again assuming you've followed the Securing Your Server guide, you should see this returned:

	~~~
	stuff
	~~~

2. To insert the rule for McMyAdmin as the 6th rule in the INPUT chain:

		sudo iptables -I INPUT 6 -p tcp --dport 8080 -j ACCEPT

3.  Once the rule is in place, run `iptables-persistent` again to add it to its ruleset.

		sudo dpkg-reconfigure iptables-persistent

	When asked to save current IPv4 rules, choose `yes`. When asked about IPv6, choose `no`.


3.  Then install `iptables-persistent` this is a package in Debian and Ubuntu repositories to automatically save and restore iptables rules on shutdown and boot for both IPv4 and IPv6.

		sudo apt-get install iptables-persistent
##Install Mono

1.  Change to the installation directory.

		cd /usr/local

2.  Download and extract the extra required files from McMyAdmin's website.

		sudo wget http://mcmyadmin.com/Downloads/etc.zip
		sudo unzip etc.zip; sudo rm etc.zip

##Install and Start McMyAdmin

This section should be completed as your standard user, *not* root. McMyAdmin will then install to `/home/username`.

1.  Create the installation directory and change location to it.

		mkdir ~/mcmyadmin && cd ~/mcmyadmin

2.  Download the McMyAdmin installer. You will want to double check its [Download](https://www.mcmyadmin.com/#/download) page to be sure you're grabbing the latest version.

		wget http://mcmyadmin.com/Downloads/MCMA2_glibc26_2.zip

3.  Extract the archive and delete the original zip file.

		unzip MCMA2_glibc26_2.zip; rm MCMA2_glibc26_2.zip

4.  Start the initial configuration of McMyAdmin. Replace `PASSWORD` with a strong password which you want for admin access to McMyAdmin's web interface.

		./MCMA2_Linux_x86_64 -setpass [PASSWORD] -configonly

5.  Install screen, if it is not already installed.

		sudo apt-get install screen

6.  Start a screen session for the McMyAdmin client.

		screen -S mcma

7.  Check the current working directory, then execute the McMyAdmin server.

		cd ~/McMyAdmin; ./MCMA2_Linux_x86_64

	This will return the output:

		The updater will download and install McMyAdmin to the current directory:
		/home/your_user/mcmyadmin).

		Continue? [y/n] :

	Answer `y`. The installer will run and return you to the command prompt. If everything is as it should be, the only warning you'll see will be for a missing configuration file. As the output says, that would be normal since McMyAdmin was just started for the first time.

8.  Change into the McMyAdmin installation directory and start the program.

		cd ~/mcmyadmin; ./MCMA2_Linux_x86_64

	If successful, the last three lines of the output will be:

		Notice	: McMyAdmin has started and is ready for use.
		Notice	: This is the first time McMyAdmin has been started.
		Notice	: You must complete the first-start wizard via the web interface.

	{: .note}
	>
	>To exit McMyAdmin and return to the command line, enter `/quit`.

##Managing your Minecraft Server

1.  Browse to the McMyAdmin web interface by visiting `http://YourLinodeIP:8080`.

	![McMyAdmin Login Page](/docs/assets/mcmyadmin-login-page.png)

2.  Log in with the username `admin` and the password that you provided in the installation step.
	
	![McMyAdmin Configuration Page](/docs/assets/mcmyadmin-config-page.png)

3.  Once the initial configuration steps are completed,  select your settings, then switch to the status page.
	
	![McMyAdmin Status Page](/docs/assets/mymyadmin-status-page.png)

4.  Select "Start Server" and accept the Minecraft Server EULA

	![McMyAdmin Server Started](/docs/assets/mcmyadmin-server-running.png)


Congratulations, you have now set up a new Minecraft server using McMyAdmin.