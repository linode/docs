---
author:
  name: Chris Walsh
  email: docs@linode.com
description: 'Install SteamCMD, a command-line version of the Steam client, which works with games that use SteamPipe. Installing SteamCMD is a prerequisite before hosting a Steam title on your own game server.'
keywords: ["steam", "steamcmd", "steam cmd", "games", "game server", "steam server", "steampipe"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2016-03-29
modified_by:
  name: Linode
published: 2016-02-15
title: 'Install SteamCMD for a Steam Game Server'
external_resources:
 - '[Valve Developer Community: SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD)'
 - '[Dedicated Steam Servers for Linux](https://developer.valvesoftware.com/wiki/Dedicated_Servers_List#Linux_Dedicated_Servers)'
 - '[Steam Support: Required Ports for Steam](https://support.steampowered.com/kb_article.php)'
aliases: ['applications/game-servers/install-steamcmd-for-a-steam-game-server/']
---

SteamCMD is a command-line version of the Steam client which works with games that use [SteamPipe](https://developer.valvesoftware.com/wiki/SteamPipe). If you intend to host a Steam title on your own game server, installing SteamCMD is a prerequisite.

![SteamCMD](/docs/assets/Install_SteamCMD_for_a_Steam_Game_Server_smg.jpg)

This guide is intended to get you quickly up and running with SteamCMD on your Linode. See Valve's [SteamCMD wiki page](https://developer.valvesoftware.com/wiki/SteamCMD) for more information and advanced setups.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Install

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Update Your Operating System:

    **CentOS**

        sudo yum update

    **Debian / Ubuntu**

        sudo apt-get update && sudo apt-get upgrade


## Secure Your Game Server

Game servers and clients are an especially ripe target for attack. Use our [Securing Your Server](/docs/security/securing-your-server) guide to:

1.  [Add a Steam user account](/docs/security/securing-your-server#add-a-limited-user-account). Make the username `steam` to coincide with the rest of [Linode's Steam guides](/docs/applications/game-servers/), as well as Valve's official documentation. Be sure to give the `steam` user `sudo` privileges.

2.  [Harden SSH access](/docs/security/securing-your-server#harden-ssh-access).

3.  [Remove unused network-facing services](/docs/security/securing-your-server#remove-unused-network-facing-services).

4.  If you are using iptables, complete the [Configure a firewall](/docs/security/securing-your-server#configure-a-firewall) steps **using the rulesets below**. If instead you are using **firewalld**, skip ahead to step 5.

    *IPv4*

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

    {{< note >}}
Some Steam games require a few additional rules which can be found in our [Steam game guides](/docs/applications/game-servers/). Steam can also use multiple port ranges for various purposes, but they should only be allowed if your game(s) make use of those services. See [this](https://support.steampowered.com/kb_article.php?ref=8571-GLVN-8711) Steam Support page for more information.
{{< /note >}}

    *IPv6*

    Steam currently supports multiplayer play over IPv4 only, so a Steam server only needs basic IPv6 firewall rules, shown below.

    ~~~
    *filter

    # Allow all loopback (lo0) traffic and reject traffic
    # to localhost that does not originate from lo0.
    -A INPUT -i lo -j ACCEPT
    -A INPUT ! -i lo -s ::1/128 -j REJECT

    # Allow ICMP.
    -A INPUT -p icmpv6 -j ACCEPT

    # Allow inbound traffic from established connections.
    -A INPUT -m state --state ESTABLISHED -j ACCEPT

    # Reject all other inbound.
    -A INPUT -j REJECT
    -A FORWARD -j REJECT

    COMMIT
    ~~~

5.  If you are using **firewalld** (CentOS 7, Fedora) instead of iptables, **use these rules**. If you are using iptables, do skip this step.

    ~~~
    sudo firewall-cmd --zone="public" --add-service=ssh --permanent
    sudo firewall-cmd --zone="public" --add-forward-port=port=27000-27030:proto=udp:toport=1025-65355 --permanent
    sudo firewall-cmd --zone="public" --add-forward-port=port=4380:proto=udp:toport=1025-65355 --permanent
    sudo firewall-cmd --reload
    ~~~

    Switch on firewalld and verify your ruleset:

        sudo systemctl start firewalld
        sudo systemctl enable firewalld
        sudo firewall-cmd --zone="public" --list-all


## Install SteamCMD

First, install `screen` to run Steam games in a separate session:

**CentOS 7**

    sudo yum install screen

**Debian / Ubuntu**

    sudo apt-get install screen


### From Package Repositories (Recommended)

Installing via the package manager allows you to more easily download updates and security patches, so we strongly recommend using this method if your distribution includes the SteamCMD package.

1.  Install the package:

        sudo apt-get install steamcmd

    {{< note >}}
On Debian you need to add the `non-free` area of the repository to your sources, because the package is available only there.
{{< /note >}}

2.  Create a symlink to the `steamcmd` executable in a convenient place, such as your home directory:

        cd ~
        ln -s /usr/games/steamcmd steamcmd

### Manually

1.  Newly created Linodes use 64-bit Linux operating systems. Since Steam is compiled for i386, install the appropriate libraries.

    **CentOS 7**

        sudo yum install glibc.i686 libstdc++.i686

    **Debian / Ubuntu**

        sudo apt-get install lib32gcc1

    {{< note >}}
Running `dpkg --add-architecture i386` is not necessary at this point. Our Steam game guides add [multiarch support](https://wiki.debian.org/Multiarch/HOWTO) only when a game requires it.
{{< /note >}}

2.  Create the directory for SteamCMD and change to it:

        mkdir ~/Steam && cd ~/Steam

3.  Download the SteamCMD tarball:

        wget https://steamcdn-a.akamaihd.net/client/installer/steamcmd_linux.tar.gz

4.  Extract the installation and runtime files:

        tar -xvzf steamcmd_linux.tar.gz

#### Add an Error Fix

When running a Steam game, you may encounter the following error:

    /home/steam/.steam/sdk32/libsteam.so: cannot open shared object file: No such file or directory

The game server will still operate despite this error, and it should be something fixed in a later release of SteamCMD. The temporary fix is to create the directory and symlink to `libsteam.so`.

    mkdir -p ~/.steam/sdk32/
    ln -s ~/Steam/linux32/steamclient.so ~/.steam/sdk32/steamclient.so

## Run SteamCMD

1.  Run the executable in a screen.

    If you have installed SteamCMD from repositories:

        screen ./steamcmd

    If you have installed SteamCMD manually:

        screen ./steamcmd.sh

    That will return an output similar to below and leave you at the `Steam>` prompt:

        Redirecting stderr to '/home/steam/Steam/logs/stderr.txt'
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
        Redirecting stderr to '/home/steam/Steam/logs/stderr.txt'
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

    {{< caution >}}
Be aware that some versions of the Steam CLI do **not** obfuscate passwords. If you're signing in with your Steam account, be aware of your local screen's security.
{{< /caution >}}

    {{< note >}}
You can exit the `Steam>` prompt at any time by typing `quit`.
{{< /note >}}

3.  To exit the screen session without disrupting the Steam process, press **CTRL + A** and then **D**. To resume, use the `screen -r` command. For more information, check out our guide on [how to use screen sessions](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions).

## Next Steps

You're ready to install your first Steam game server. From here, certain games may need a few more i386 libraries or firewall rules, and most will need their configuration settings to be modified. The game server should allow easy administrative access with as little interruption to players as possible. Its software should frequently be updated, and players' progress should be saved when the server is properly shut down.

Our [game server guides](/docs/applications/game-servers/) cover these requirements for specific games and contain various Steam tutorials which will pick you up exactly where this page leaves off.
