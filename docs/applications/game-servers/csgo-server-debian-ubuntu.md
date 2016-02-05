---
author:
    name: Linode Community
    email: docs@linode.com
description: 'This Counter Strike: Global Offensive (CS:GO) server guide contains instructions on how to install SteamCMD, download the dedicated server, and launch the game server.'
keywords: 'counter strike,counter strike global offensive,csgo,cs:go,csgo server,csgo server hosting, steam servers,game servers,games,ubuntu,ubuntu 14.04,steam,cs,cs:go'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Tuesday, September 29th, 2015'
modified: Tuesday, September 29th, 2015
modified_by:
    name: Linode
title: 'Install a Counter Strike: Global Offensive (CS:GO) server on Ubuntu 14.04'
contributor:
    name: Sam Mauldin
external_resources:
 - '[Valve Developer Community - Counter-Strike: Global Offensive Dedicated Servers](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Dedicated_Servers)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

Counter Strike: Global Offensive (CS:GO) is a first-person shooter by Valve. Hosting your own server gives you full control over your game and game modes, so you can play the exact flavor of CS:GO you want. This guide contains instructions on how to download the dedicated server and launch the game server.

## Before You Begin

1.  You will need a [Steam](http://store.steampowered.com) account and a copy of [Counter Strike: Global Offensive](http://store.steampowered.com/app/730/).

2.  Complete our guide: [Install SteamCMD for a Steam Game Server](/docs/applications/game-servers/install-steamcmd-for-a-steam-game-server.md). This will get SteamCMD installed and running on your Linode and this guide will pick up where the SteamCMD page leaves off.

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Install Counter Strike: Global Offense

1.  Be sure you are in the directory `~/steamcmd`, then access the `Steam>` prompt.

        cd ~/steamcmd && ./steamcmd.sh

2.  Log in anonymously:

        login anonymous

    Or log in with your Steam username:

        login example_user

3.  Install CS:GO to the `Steam` user's home directory:

        force_install_dir ./csgo-ds
        app_update 740 validate

    This can take some time. If the download looks as if it has frozen, be patient. Once the download is complete, you should see this output:

        Success! App '740' fully installed.

        Steam>

4.  Exit SteamCMD.

        quit

    {: .note}
    >
    >To update CS:GO, run the above commands again.

## Configure and Launch the Server

1.  Create a file called `server.cfg` using your prefered text editor. Choose a hostname and a unique RCON password that you don't use elsewhere.

    {: .file}
    ~/steamcmd/csgo-ds/csgo/cfg/server.cfg
    :   ~~~ config
        hostname "<hostname>"
        rcon_password "<password>"
        ~~~

    For a complete list of available `server.cfg` options, see [this page](http://csgodev.com/csgodev-server-cfg-for-csgo/).

2.  Using [GNU Screen](https://www.gnu.org/software/screen/), you can launch your CS:GO server and keep it running without needing an SSH connection open. Launching Screen and CS:GO with the necessary options can be easily done with a script. **Be sure to replace `<public ip>` in the script's command with your Linode's IP addres**.

    {: .file }
    ~/start_csgo.sh
    :   ~~~
        screen -S "CS:GO Server" ./steamcmd/csgo-ds/srcds_run -game csgo -console -usercon +net_public_adr <public ip> -port 27015 +game_type 0 +game_mode 1 +mapgroup mg_bomb +map de_dust2 -autoupdate
        ~~~

    {: .note}
    >
    >The above example command launches a Dust 2 server in the competitive gamemode; change the command as you like for your own server. You may need to open UDP port 27015 in your firewall for clients to connect.

4.  Make the script executable:

        chmod +x ~/start_csgo.sh

5.  Launch the server by running the `start_csgo.sh` script from the `steam` user's home directory. Please note that if your current working directory is not `~/`, the game will fail to start.

        cd ~/
        ./start_csgo.sh

    The end of the resulting output is shown below. Your CS:GO server is now running and ready for players to join.

    ~~~
****************************************************
*                                                  *
*  No Steam account token was specified.           *
*  Logging into anonymous game server account.     *
*  Connections will be restricted to LAN only.     *
*                                                  *
*  To create a game server account go to           *
*  http://steamcommunity.com/dev/managegameservers *
*                                                  *
****************************************************
Connection to Steam servers successful.
   Public IP is 203.0.113.0.
Assigned anonymous gameserver Steam ID [A:1:4034621959(6342)].
VAC secure mode is activated.
GC Connection established for server version 262, instance idx 1
    ~~~

    {: .caution}
    >Do not press **Control+C** while in the console unless you want to stop the server.

## Using Screen

1.  To detach from the screen session running the server console, press these two key combinations in succession:

    **Control+A**<br>
    **Control+D**

3.  To bring the console back, type:

        screen -r

4.  To stop CS:GO, bring back the Screen console and press **CONTROL + C**.

## Joining the Game

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
