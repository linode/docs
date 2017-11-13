---
author:
  name: James Stewart
  email: jstewart@linode.com
description: 'McMyAdmin is one of the most popular Minecraft server control panels available. It boasts compatibility with third party mods, heavy focus on security and a sleek web interface for managing your server. This guide covers the installation and configuration of a new McMyAdmin server on a Linode running Debian 7 or 8.'
keywords: ["minecraft", "mcmyadmin", "debian", "debian jessie", "debian wheezy", "jessie", "wheezy", "debian 7", "debian 8"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2016-02-03
modified_by:
  name: Linode
published: 2015-02-05
title: Installing McMyAdmin for Minecraft on Debian
external_resources:
 - '[McMyAdmin Home Page](https://mcmyadmin.com/)'
 - '[McMyAdmin Settings Reference](http://wiki.cubecoders.com/wiki/3/mcmyadmin-settings-reference)'
aliases: ['applications/game-servers/minecraft-with-mcmyadmin-on-debian/']
---

[McMyAdmin](https://mcmyadmin.com/) is one of the most popular Minecraft server control panels available. It boasts compatibility with third party mods, heavy focus on security and a sleek web interface for managing your server. This guide covers the installation and configuration of a new McMyAdmin server on a Linode running Debian 7 or 8. Be aware that to actually play on a Minecraft server you must also have the game client from [minecraft.net](https://minecraft.net/).

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the *Configure a Firewall* section yet--this guide includes firewall rules specifcally for a Minecraft server.

3.  Update your system.

        sudo apt-get update && sudo apt-get upgrade

## Configure a Firewall

Now see [Securing Your Server](/docs/security/securing-your-server/) again and complete the section on iptables for your Linux distribution **using the rulesets below**:

**IPv4**

    {{< file-excerpt "iptables" >}}
*filter

# Allow all loopback (lo0) traffic and reject traffic
# to localhost that does not originate from lo0.
-A INPUT -i lo -j ACCEPT
-A INPUT ! -i lo -s 127.0.0.0/8 -j REJECT

# Allow ping.
-A INPUT -p icmp -m state --state NEW --icmp-type 8 -j ACCEPT

# Allow SSH connections.
-A INPUT -p tcp -m state --state NEW --dport 22 -j ACCEPT

# Allow connections from other Minecraft players.
-A INPUT -p tcp -m state --state NEW --dport 25565 -j ACCEPT

# Allow web access to McMyAdmin.
-A INPUT -p tcp -m state --state NEW --dport 8080 -j ACCEPT

# Allow inbound traffic from established connections.
# This includes ICMP error returns.
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Log what was incoming but denied (optional but useful).
-A INPUT -m limit --limit 3/min -j LOG --log-prefix "iptables_INPUT_denied: " --log-level 7

# Reject all other inbound.
-A INPUT -j REJECT
-A FORWARD -j REJECT

COMMIT
{{< /file-excerpt >}}

**IPv6**

By default, both McMyAdmin and Minecraft operate on IPv4, but unlike a default Minecraft server installation, McMyAdmin does not listen for incoming IPv6 traffic. Since Minecraft can not use both protocols simultaneously, IPv4 is usually chosen over IPv6 because of its much greater availability, thus including players whose ISPs or hardware don't support IPv6.

If you choose *not* to use IPv6 on your Minecraft server, then it needs only basic IPv6 firewall rules.

    {{< file-excerpt "iptables" >}}
*filter

# Allow all loopback (lo0) traffic and reject traffic
# to localhost that does not originate from lo0.
-A INPUT -i lo -j ACCEPT
-A INPUT ! -i lo -s ::1/128 -j REJECT

# Allow ICMP
-A INPUT -p icmpv6 -j ACCEPT

# Allow inbound traffic from established connections.
-A INPUT -m state --state ESTABLISHED -j ACCEPT

# Reject all other inbound.
-A INPUT -j REJECT
-A FORWARD -j REJECT

COMMIT
{{< /file-excerpt >}}

## Install Prerequisite Software

1.  Install the Java Runtime Environment, OpenJDK:

		sudo apt-get install openjdk-7-jre

2.  [Mono](http://www.mono-project.com/). CubeCoders Limited, the company behind McMyAdmin, packages its own minimal installation of Mono with some necessary source and configuration files. This must be used instead of the generic Mono packages from Debian's repositories.

		cd /usr/local
		sudo wget http://mcmyadmin.com/Downloads/etc.zip
		sudo unzip etc.zip; sudo rm etc.zip

## Install and Start McMyAdmin

This section should be completed as your standard user, **not** as root. McMyAdmin will then install to `/home/username`.

1.  Create the installation directory and change location to it.

		mkdir ~/mcmyadmin && cd ~/mcmyadmin

2.  Download the McMyAdmin installer. You will want to double check its [Download](https://www.mcmyadmin.com/#/download) page to be sure you're grabbing the latest version.

		wget http://mcmyadmin.com/Downloads/MCMA2_glibc26_2.zip

3.  Extract the archive and delete the original zip file.

		unzip MCMA2_glibc26_2.zip; rm MCMA2_glibc26_2.zip

4.  Start the initial configuration of McMyAdmin. Replace `PASSWORD` with a strong password which you want for admin access to McMyAdmin's web interface.

		./MCMA2_Linux_x86_64 -setpass PASSWORD -configonly

	This will return the output:

		The updater will download and install McMyAdmin to the current directory:
		/home/your_user/mcmyadmin).

		Continue? [y/n] :

	Answer `y`. The installer will run and return you to the command prompt. If everything is as it should be, the only warning you'll see will be for a missing configuration file. As the output says, that would be normal since McMyAdmin was just started for the first time.

5.  Install screen, if it is not already installed.

		sudo apt-get install screen

6.  Start a screen session for the McMyAdmin client.

		screen -S mcma

7.  Change into the McMyAdmin installation directory and start the program.

		cd ~/mcmyadmin; ./MCMA2_Linux_x86_64

	If successful, the last three lines of the output will be:

		Notice	: McMyAdmin has started and is ready for use.
		Notice	: This is the first time McMyAdmin has been started.
		Notice	: You must complete the first-start wizard via the web interface.

	{{< note >}}
To exit McMyAdmin and return to the command line, enter `/quit`.
{{< /note >}}

## Managing your Minecraft Server

1.  Browse to the McMyAdmin web interface by visiting `http://YourLinodeIP:8080`.

2.  Log in with the username `admin` and the password that you provided in the installation step.

	![McMyAdmin Login Page](/docs/assets/mcmyadmin-login-page.png)

3.  Once the initial configuration steps are completed, select your settings and then switch to the status page.

	![McMyAdmin Configuration Page](/docs/assets/mcmyadmin-config-page.png)

4.  Select *Start Server* and accept the Minecraft Server EULA.

	![McMyAdmin Status Page](/docs/assets/mymyadmin-status-page.png)

	![McMyAdmin Server Started](/docs/assets/mcmyadmin-server-running.png)

Congratulations, you now have McMyAdmin running on your Minecraft server!
