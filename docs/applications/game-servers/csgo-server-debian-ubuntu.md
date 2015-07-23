---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Install a Counter Strike: Global Offensive server on Ubuntu 14.04
keywords: 'counter strike,counter strike global offensive,csgo,game servers,games,ubuntu, ubuntu 14.04,steam'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Thursday, July 23rd, 2015'
modified: Thursday, July 23rd, 2015
modified_by:
    name: James Stewart
title: 'Install a Counter Strike: Global Offensive server on Ubuntu 14.04
contributor:
    name: Sam Maudlin
---

# Counter Strike: Global Offensive Server on Ubuntu 14.04

CS:GO is a FPS game by Valve. We'll install SteamCMD, download the dedicated server, then launch it.

## Prerequisites

- A copy of CS:GO on Steam.
- A Linode, preferable one near you.

## Setting up

If you already have SteamCMD installed, you can skip this section.

1. SteamCMD is 32 bit, so we'll have to install some 32 bit libraries.
We'll go ahead and install screen too, since we'll use that later.

```
sudo apt-get update; sudo apt-get upgrade
sudo apt-get install lib32gcc1 lib32stdc++6 libcurl4-gnutls-dev:i386 screen
```

2. Now we can download SteamCMD.

```
mkdir steamcmd; cd steamcmd
wget http://media.steampowered.com/installer/steamcmd_linux.tar.gz
tar xvzf steamcmd_linux.tar.gz
rm steamcmd_linux.tar.gz
```


## Installing CS:GO

3. Now we start SteamCMD.

```
./steamcmd.sh
```

It should update itself then present you with a prompt.
4. We need to login, set an install directory, then download CS:GO.

```
login anonymous
force_install_dir ./csgoserver
app_update 740 validate
```

Note that this is a large download and may take awhile.
If the login fails with no connection, you may have to add the following to your firewall.

```
iptables -A INPUT -p udp -m udp --sport 27000:27030 --dport 1025:65355 -j ACCEPT
iptables -A INPUT -p udp -m udp --sport 4380 --dport 1025:65355 -j ACCEPT
```

## Configuring the server

5. Exit SteamCMD once the download is done.

```
exit
```

6. Move into the server directory.

```
cd csgoserver/csgo/cfg
```

7. Make a file called server.cfg.

```
nano server.cfg
```

8. Choose a hostname and a secure password.
You should probably use something you don't use somewhere else.
You'll use this later for server administration while ingame.

```
hostname "<hostname>"
rcon_password "<password>"
```

## Launching the server for the first time

9. Go back into the main CS:GO directory.

```
cd ~/Steam/csgoserver
```

10. Launch a Dust 2 server on the competitive gamemode. Make sure to put your public ip where it says <public ip>.
You may need to open UDP port 27015 in your firewall to connect.

```
./srcds_run -game csgo -console -usercon +net_public_adr <public ip> -port 27015 +game_type 0 +game_mode 1 +mapgroup mg_bomb +map de_dust2 -autoupdate 
```

Now try joining. Open your console in CS:GO using whatever key you use, usually, `.

```
connect <public ip>
```

## Game Modes and Types

You can change the game type and mode options to start different types of servers.

```
Mode                   game_mode    game_type
Classic Casual             0            0
Classic Competitive        0            1
Arms Race                  1            0
Demolition                 1            1
```

## RCON

When logged into the server, open your console using whatever key you have it bound to.
Set the rcon password then you're ready to use server commands.
```
rcon_password <password>
rcon sv_cheats 1
```

## Running the server in the background

1. Using screen you can keep the server open without having an SSH connection open.

```
screen -S csgo
```

2. From there you can launch the server like normal.

```
./srcds_run -game csgo -console -usercon +net_public_adr <public ip> -port 27015 +game_type 0 +game_mode 1 +mapgroup mg_bomb +map de_dust2 -autoupdate 
```

3. Then, exit the screen by pressing Control-A, then pressing D.
You can now exit the SSH session like normal while keeping the server running.

4. You can also open the screen later.

```
screen -r csgo
```
