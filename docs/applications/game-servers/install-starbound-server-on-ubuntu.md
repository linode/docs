---
author:
    name: Rob Palkowski
    email: dopeghoti@gmail.com
description: 'Install and Configure a Starbound Dedicated Game Server for Ubuntu 16.04 and later'
keywords: 'don''t starve,don''t starve together,game servers,games,ubuntu, ubuntu 14.04,steam cmd,steamcmd,token'
keywords: 'starbound,game servers,games,ubuntu, ubuntu 16.04,steam cmd,steamcmd'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Sunday, August 7th, 2016'
modified: Sunday, August 7th, 2016
modified_by:
    name: Rob Palkowski
title: 'Install a Starbound dedicated server on Ubuntu 16.04'
alias: ['applications/game-servers/starbound-on-ubuntu/']
contributor:
    name: DopeGhoti
    link: https://github.com/dopeghoti
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and
earn $250 per published guide.*

<hr>

[Starbound](http://playstarbound.com) is a single- and multi-player game written and published by Chucklefish.  This guide will explain how to prepare and run a Starbound server on your Linode or other Ubuntu-based host.  It is written with an eye toward Ubuntu 16.04, but should be accurate for later releases.

## Before You Begin

1.  You will need a [Steam](http://store.steampowered.com) account and a copy of [Starbound](http://store.steampowered.com/app/211820/).

2.  Install the command-line client for [Steam](http://store.steampowered.com), SteamCMD.  This application is helpfully already in Ubuntu's software repositoroes, so can be accomplished with the following command:

        sudo apt install steamcmd

>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


## Prerequisites for Starbound

1.  Add an iptables firewall rule. This command assumes that you are using the iptables firewall and have already stealthed and closed all ports you have not explicitly kept open.  This command will instert a rule for port 21025 after the pre-existing iptables rules.

        sudo iptables -I INPUT 7 -p udp --sport 21025 --dport 1025:65355 -j ACCEPT

2.  After entering the above rule, run iptables-persistent again. You’ll be asked if you want to save the current IPv4 and IPv6 rules. Answer `yes` for IPv4 and `no` for IPv6.

        sudo dpkg-reconfigure iptables-persistent


## Install Starbound

1.  Start the SteamCMD Steam client:

        steamcmd

2.  From the SteamCMD prompt, login with your Steam account which has purchased Starbound (you will be prompted for your password and, if your account haѕ it enabled, your SteamGuard second authentication factor):

        login steam_username_here

3.  Install Don't Starve Together to the Starbound directory of the logged-in user:

        force_install_dir ./Starbound
        app_update 211820 validate

    This can take some time. If the download looks as if it has frozen, be patient. Once the download is complete, you should see this output:

        Success! App '211820' fully installed.

        Steam>

4.  Exit SteamCMD.

        quit

    >To update Starbound, run the above 4 commands again, only without the validate parameter.

## Configure Starbound

1.  Before you configure DST, you should launch it at least once to generate its configuration files:

        cd ~/Starbound/linux
        ./starbound_server

2.  Once you see this output, the server has been successfully launched:

        [Info] UniverseServer: listening for incoming TCP connections on 0000:0000:0000:0000:0000:0000:0000:0000:21024

3.  Press **Control+C** to terminate the server. You will return to the linux command prompt.

4.  A new default configuration file will have been written at `~/Starbound/storage/starbound_server.config`.  Below is an example as of version 1.0.5.  Edit the file to suit your needs, including setting up an administrative account for yourself, enabling RCON (a topic for another guide), and the like.

```
        {
          "allowAdminCommands" : true,
          "allowAdminCommandsFromAnyone" : false,
          "allowAnonymousConnections" : true,
          "allowAssetsMismatch" : true,
          "anonymousConnectionsAreAdmin" : false,
          "bannedIPs" : [],
          "bannedUuids" : [],
          "checkAssetsDigest" : false,
          "clearPlayerFiles" : false,
          "clearUniverseFiles" : false,
          "clientIPJoinable" : false,
          "clientP2PJoinable" : true,
          "configurationVersion" : {
            "basic" : 1,
            "server" : 4
          },
          "crafting" : {
            "filterHaveMaterials" : false
          },
          "gameServerBind" : "::",
          "gameServerPort" : 21025,
          "interactiveHighlight" : true,
          "inventory" : {
            "pickupToActionBar" : true
          },
          "maxPlayers" : 8,
          "maxTeamSize" : 4,
          "playerBackupFileCount" : 3,
          "queryServerBind" : "::",
          "queryServerPort" : 21025,
          "rconServerBind" : "::",
          "rconServerPassword" : "",
          "rconServerPort" : 21026,
          "rconServerTimeout" : 1000,
          "runQueryServer" : false,
          "runRconServer" : false,
          "safeScripts" : true,
          "scriptInstructionLimit" : 10000000,
          "scriptInstructionMeasureInterval" : 10000,
          "scriptProfilingEnabled" : false,
          "scriptRecursionLimit" : 100,
          "serverFidelity" : "automatic",
          "serverName" : "A Starbound Server",
          "serverOverrideAssetsDigest" : null,
          "serverUsers" : {
          },
          "tutorialMessages" : true
        }
```

4.  Create a startup script ( e. g. `~/start_starbound.sh`) for the Starbound server with the following contents.  When run, the script will launch the Starbound server in a [Screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions) session.

```
        #!/bin/bash

        cd ~/Starbound/linux
        screen -S "Starbound" ./starbound_server
```


5.  Make the script executable:

        chmod +x ~/start_starbound.sh

## Start the Server

1.  Now that your server is installed and configured, it can be launched by running the `start_starbound.sh` script from your user's home directory.

        ~/start_starbound.sh

    >From this point, do not press the **Control+C** keys while in the console unless you want to stop the server.

2.  To detach from the screen session running the server console, press these two key combinations in succession:

    **Control+A**<br>
    **Control+D**

3.  To bring the console back, type the following command:

        screen -x Starbound

4.  To stop the server, reattach to the Screen session as described above in point #3, and press **CONTROL + C**.

## Enter The Server

Now you have your very own Starbound server for you and your friends to play on. Players can access the server by selecting 'Join Game' from the main menu, and entering your server's address or hostname.
