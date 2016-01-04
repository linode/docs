---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Launch Counter Strike: Global Offensive (CS:GO) by Installing SteamCMD, Downloading the Dedicated Server, and Launching the Game Server.'
keywords: 'counter strike,counter strike global offensive,csgo,csgo server,steamcmd,game servers,ubuntu 14.04,steam'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Tuesday, September 29th, 2015'
modified: Tuesday, September 29th, 2015
modified_by:
    name: Linode
title: 'Launch Counter Strike: Global Offensive (CS:GO) on Ubuntu 14.04'
contributor:
    name: Sam Mauldin
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

Counter Strike: Global Offensive (CS:GO) is a first-person shooter game by Valve. By hosting your own server, you will have full control over your game and game modes, so you can play exactly the flavor the CS:GO you want. This guide contains instructions on how to install SteamCMD, download the dedicated server and launch the game server.

## Before You Begin

1.  Ensure you own a copy of CS:GO on Steam.

2.  Configure your Ubuntu 14.04 Linode by following the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides.

3.  Add firewall exceptions. If using iptables, use the following:

        iptables -A INPUT -p udp -m udp --sport 27000:27030 --dport 1025:65355 -j ACCEPT
        iptables -A INPUT -p udp -m udp --sport 4380 --dport 1025:65355 -j ACCEPT
        
4.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Install SteamCMD

If you already have SteamCMD installed, skip this section.

1.  SteamCMD is 32 bit. Install needed 32-bit libraries and screen:

        sudo apt-get install lib32gcc1 lib32stdc++6 libcurl4-gnutls-dev:i386 screen

2.  Download SteamCMD:

        mkdir steamcmd; cd steamcmd
        wget http://media.steampowered.com/installer/steamcmd_linux.tar.gz
        tar xvzf steamcmd_linux.tar.gz
        rm steamcmd_linux.tar.gz


## Install Counter Strike: Global Offense

1.  Start SteamCMD:

        ./steamcmd.sh

    SteamCMD will update and then present you with a prompt.

2.  Login, set an install directory, and download CS:GO:

        login anonymous
        force_install_dir ./csgoserver
        app_update 740 validate

    Note that this is a large download and may take awhile.


## Configure the Server

1.  Exit SteamCMD once the download is complete:

        exit

2.  Move into the server directory:

        cd csgoserver/csgo/cfg

3.  Create and open a file called `server.cfg` using your prefered text editor.

4.  Choose a hostname and a secure password. You should use a unique password that you don't use elsewhere.

    {: .file}
    csgoserver/csgo/cfg
    :   ~~~ config
        hostname "<hostname>"
        rcon_password "<password>"
        ~~~

## Launch the Server

1.  Go back into the main CS:GO directory:

        cd ~/Steam/csgoserver

2.  Launch a Dust 2 server on the competitive gamemode. Make sure to put your public IP where it says `<public ip>`.
You may need to open UDP port 27015 in your firewall to connect:

        ./srcds_run -game csgo -console -usercon +net_public_adr <public ip> -port 27015 +game_type 0 +game_mode 1 +mapgroup mg_bomb +map de_dust2 -autoupdate
        
### Run the Server in the Background

{: .note}
>
>Close the connect to your current CS:GO server before proceeding with the next steps.

1.  Using screen, you can keep the server open without having an SSH connection open:

        screen -S csgo

2.  Launch the server like normal:

        ./srcds_run -game csgo -console -usercon +net_public_adr <public ip> -port 27015 +game_type 0 +game_mode 1 +mapgroup mg_bomb +map de_dust2 -autoupdate 

3.  Detach screen by pressing **Control-a**, then **d**. You can now exit the SSH session like normal while keeping the server running.

4.  To re-attach to the screen session:
    
        screen -r csgo


## Join the Game

1.  Launch Counter-Strike: Global Offensive.

2.  Once launched, go to **Play** and click **Browse Community Servers**.

3.  Click on the **Favorites** tab and then click **Add a Server** at the bottom.

4.  Type in the IP address of your Linode and click **Add this address to favorites**.

5.  You'll see your new Counter-Strike: Global Offensive server. Click **Connect** at the bottom right and start fragging away.


## Game Settings

### Game Modes and Types

You can change the game type and mode options to start different types of servers:

    Mode                   game_mode    game_type
    Classic Casual             0            0
    Classic Competitive        0            1
    Arms Race                  1            0
    Demolition                 1            1

These settings are changed in the launch command.

### RCON

When logged into the server, you can open the RCON console with the the backtic button (<code>`</code>), or your mapped key. To log in type `rcon_password` followed by your password. For more information regarding RCON, click [here](/docs/applications/game-servers/team-fortress2-on-debian-and-ubuntu#rcon).
