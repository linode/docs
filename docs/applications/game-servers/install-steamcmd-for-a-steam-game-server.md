---
author:
  name: Linode
  email: docs@linode.com
description: 'SteamCMD is a command-line version of the Steam client which works with games that use SteamPipe. If you intend to host a Steam title on your own game server, installing SteamCMD is a prerequisite.'
keywords: 'steam,steamcmd,games,game server'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: 'Thursday, January 7th, 2016'
modified_by:
  name: Linode
published: 'Thursday, January 7th, 2016'
title: 'Install SteamCMD for a Steam Game Server'
external_resources:
 - '[Valve Developer Community: SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD)'
 - '[Dedicated Steam Servers for Linux](https://developer.valvesoftware.com/wiki/Dedicated_Servers_List#Linux_Dedicated_Servers)'
 - '[Steam Support: Required Ports for Steam](https://support.steampowered.com/kb_article.php?ref=8571-GLVN-8711)'
---

SteamCMD is a command-line version of the Steam client which works with games that use [SteamPipe](https://developer.valvesoftware.com/wiki/SteamPipe). If you intend to host a Steam title on your own game server, installing SteamCMD is a prerequisite.

This guide is intended to get you quickly up and running with SteamCMD on your Linode. See Valve's [SteamCMD wiki page](https://developer.valvesoftware.com/wiki/SteamCMD) for more information and advanced setups.


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` where possible. See our Securing Your Server guide to [create a limited user acount](/docs/security/securing-your-server#add-a-limited-user-account). **Make the account name** `steam`**!** This will coincide with the rest of [Linode's Steam guides](/docs/applications/game-servers/), as well as Valve's official documentation.

3.  Update Your Operating System:

	**CentOS**

		sudo yum update

	**Debian / Ubuntu**

		sudo apt-get update && sudo apt-get upgrade


## Secure Your Game Server

Game servers and clients are an especially ripe target for attack. Use our [Securing Your Server](/docs/security/securing-your-server) guide to:

*   [Harden SSH access](/docs/security/securing-your-server#harden-ssh-access)

*   [Remove unused network-facing services](/docs/security/securing-your-server#remove-unused-network-facing-services)

*   [Configure a firewall](/docs/security/securing-your-server#configure-a-firewall) for IPv4 and IPv6 **using the rulesets below**:

**IPv4**

~~~
*filter

# Allow all loopback (lo0) traffic and reject traffic
# to localhost that does not originate from lo0.
-A INPUT -i lo -j ACCEPT
-A INPUT ! -i lo -s 127.0.0.0/8 -j REJECT

# Allow ping.
-A INPUT -p icmp -m state --state NEW --icmp-type 8 -j ACCEPT

# Allow SSH connections.
-A INPUT -p tcp -m state --state NEW --dport 22 -j ACCEPT

# Allow the Steam client.
-A INPUT -p udp -m udp --sport 27000:27030 --dport 1025:65355 -j ACCEPT
-A INPUT -p udp -m udp --sport 4380 --dport 1025:65355 -j ACCEPT

# Allow inbound traffic from established connections.
# This includes ICMP error returns.
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Log what was incoming but denied (optional but useful).
-A INPUT -m limit --limit 3/min -j LOG --log-prefix "iptables_INPUT_denied: " --log-level 7
-A FORWARD -m limit --limit 3/min -j LOG --log-prefix "iptables_FORWARD_denied: " --log-level 7

# Reject all other inbound.
-A INPUT -j REJECT
-A FORWARD -j REJECT

COMMIT
~~~

{: .note}
>
>Some Steam games require a few additional rules which can be found in our [Steam game guides](/docs/applications/game-servers/). Steam can also use multiple port ranges for various purposes but they should only be allowed if your game(s) make use of those services. See [this](https://support.steampowered.com/kb_article.php?ref=8571-GLVN-8711) Steam Support page for more information.

**IPv6**

Steam currently supports multiplayer only over IPv4, so a Steam server only needs basic IPv6 firewall rules as shown below.

~~~
*filter

# Allow all loopback (lo0) traffic and reject traffic
# to localhost that does not originate from lo0.
-A INPUT -i lo -j ACCEPT
-A INPUT ! -i lo -s ::1/128 -j REJECT

# Allow ICMP.
-A INPUT -p icmpv6 -m state --state NEW -j ACCEPT

# Allow inbound traffic from established connections.
-A INPUT -m state --state ESTABLISHED -j ACCEPT

# Reject all other inbound.
-A INPUT -j REJECT
-A FORWARD -j REJECT

COMMIT
~~~


## Install SteamCMD

1.  Newly created Linodes use 64-bit operating Linux systems. Since Steam is compiled for i386, a few libraries need to be installed for your distro:

	**CentOS 7**

		sudo yum install glibc.i686 libstdc++.i686

	**Debian / Ubuntu**

		sudo apt-get install lib32gcc1

	{: .note}
	>
	>Running `dpkg --add-architecture i386` is not necessary at this point. Our Steam game guides add [multiarch support](https://wiki.debian.org/Multiarch/HOWTO) only when a game requires it.

2.  Create the directory for SteamCMD and change to it:

		mkdir ~/steamcmd && cd ~/steamcmd

3.  Download the SteamCMD tarball:

		wget https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz

4.  Extract the installation and runtime files:

		tar -xvzf steamcmd_linux.tar.gz


## Running SteamCMD

1.  Run the installer:

		./steamcmd.sh

	That will return an output similar to below and leave you at the `Steam>` prompt:

		Redirecting stderr to '/home/linode/Steam/logs/stderr.txt'
		[  0%] Checking for available updates...
		[----] Downloading update (0 of 7,013 KB)...
		[  0%] Downloading update (1,300 of 7,013 KB)...
		[ 18%] Downloading update (3,412 of 7,013 KB)...
		[ 48%] Downloading update (5,131 of 7,013 KB)...
		[ 73%] Downloading update (6,397 of 7,013 KB)...
		[ 91%] Downloading update (7,013 of 7,013 KB)...
		[100%] Download complete.
		[----] Installing update...
		[----] Extracting package...
				. . .
		[----] Cleaning up...
		[----] Update complete, launching Steam...
		Redirecting stderr to '/home/linode/Steam/logs/stderr.txt'
		[  0%] Checking for available updates...
		[----] Verifying installation...
		Steam Console Client (c) Valve Corporation
		-- type 'quit' to exit --
		Loading Steam API...OK.

		Steam>

2.  Most Steam game servers allow anonymous logins. You can verify this for your title with Valve's list of [dedicated Linux servers](https://developer.valvesoftware.com/wiki/Dedicated_Servers_List#Linux_Dedicated_Servers).

	To log in anonymously:

		login anonymous

	To log in with your Steam username:

		login example_user

{: .note}
>
>Exit the `Steam>` prompt at any time by typing `quit`.

## Next Steps

At this point, you're ready to install your first Steam game server and you should again be at the `Steam>` prompt.

1.  The very next steps are:

		force_install_dir /home/steam/game_title
		app_update server_id validate

	*   The `game-title` should be the name of the Steam game you're installing.

	*   The `server_id` can be found in Valve's list of [dedicated Linux servers](https://developer.valvesoftware.com/wiki/Dedicated_Servers_List#Linux_Dedicated_Servers).

2.  From there, certain games may need a few more i386 libraries or firewall rules and most will need their configuration settings edited. The game server should allow easy administrative access with as little interruption to players as possible, its software should frequently be updated, and players' progress should be saved when the server is properly shut down. 

	Our [game server guides](/docs/applications/game-servers/) cover these requirements and contain various Steam tutorials which will pick you up exactly where this page leaves off.