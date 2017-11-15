---
author:
    name: Linode Community
    email: docs@linode.com
description: 'This Counter Strike: Global Offensive (CS:GO) server guide contains instructions on how to install SteamCMD, download the dedicated server, and launch the game server.'
keywords: ["counter strike", "counter strike global offensive", "csgo", "cs:go", "csgo server", "csgo server hosting", " steam servers", "game servers", "games", "ubuntu", "ubuntu 14.04"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2016-02-25
modified: 2016-02-29
modified_by:
    name: Linode
title: 'Launch a Counter Strike: Global Offensive (CS:GO) server on Ubuntu 14.04'
contributor:
    name: Sam Mauldin
aliases: ['applications/game-servers/csgo-server-debian-ubuntu/','applications/game-servers/launch-a-counter-strike-global-offensive-server-on-ubuntu-14-04/']
external_resources:
 - '[Valve Developer Community - Counter-Strike: Global Offensive Dedicated Servers](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Dedicated_Servers)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

[Counter Strike: Global Offensive](http://store.steampowered.com/app/730) (CS:GO) is a first-person shooter by Valve. Hosting your own server gives you full control over your game and game modes, so you can play the exact flavor of CS:GO you want. This guide contains instructions on how to download the dedicated server and launch the game server.

![Launch a Counter Strike GO server on Ubuntu 14.04](/docs/assets/launch-a-cs-go-server-on-ubuntu-14-04.png)

## Before You Begin

1.  You will need a [Steam](http://store.steampowered.com) account and a copy of [Counter Strike: Global Offensive](http://store.steampowered.com/app/730/). A game server token is required to host a public CS:GO server. Without the token, client connections are restricted to the LAN only.

2.  Complete our guide: [Install SteamCMD for a Steam Game Server](/docs/applications/game-servers/install-steamcmd-for-a-steam-game-server). This will get SteamCMD installed and running on your Linode and this guide will pick up where the SteamCMD page leaves off.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Prerequisites for Counter-Strike: Global Offensive

From the SteamCMD guide, one additional step is needed specifically for CS:GO.

1.  Replace a firewall rule to slightly extend the port range available to the game. This command assumes that you have **only** the iptables rules in place from the SteamCMD guide:

        sudo iptables -R INPUT 5 -p udp -m udp --sport 26900:27030 --dport 1025:65355 -j ACCEPT

## Install Counter Strike: Global Offense

1.  Be sure you are in the directory `~/Steam`, then access the `Steam>` prompt.

        cd ~/Steam && ./steamcmd.sh

2.  From the SteamCMD prompt, login anonymously:

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

    {{< note >}}
To update CS:GO, run the above 4 commands again.
{{< /note >}}

## Game Server Login Token

CS:GO requires a server token unless you want to limit players to only clients connecting from within the server's LAN. This requires having a Steam account and owning CS:GO. See [Valve's CS:GO wiki](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Dedicated_Servers#Registering_Game_Server_Login_Token) for more info on the GSLT.

## Configure the Server

1.  Create a file called `server.cfg` using your prefered text editor. Choose a hostname and a unique RCON password that you don't use elsewhere.

    {{< file "~/Steam/csgo-ds/csgo/cfg/server.cfg" aconf >}}
hostname "server_hostname"
sv_password "server_password"
sv_timeout 60
rcon_password "rcon_password"
mp_autoteambalance 1
mp_limitteams 1
writeid
writeip

{{< /file >}}


    For an extensive list of `server.cfg` options, see [this page](http://csgodev.com/csgodev-server-cfg-for-csgo/).

2.  Create a startup script for CS:GO with the contents given below. **Be sure to replace `YOUR_GSLT` in the script's command with your game server login token**.

    {{< file "~/startcsgo.sh" >}}
#!/bin/sh

cd ./Steam/csgo-ds
screen -S "Counter-Strike: Global Offensive Server" ./srcds_run -game csgo -usercon +game_type 0 +game_mode 1 +mapgroup mg_bomb +map de_dust2 +sv_setsteamaccount YOUR_GSLT -net_port_try 1

{{< /file >}}


    When run, the script will change directories to `~/Steam/csgo-ds` and execute a Dust2 server in competitive game mode in a [Screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions) session. For more startup modes and game options, see Valve's [CS:GO wiki](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Dedicated_Servers#Starting_the_Server).

3.  Make the script executable:

        chmod +x ~/startcsgo.sh

## Start the Server

1.  Now that your server is installed and configured, it can be launched by running the `startcsgo.sh` script from your `steam` user's home directory.

        cd ~/ && ./startcsgo.sh

    {{< caution >}}
From this point, do not press the **Control+C** keys while in the console unless you want to stop CS:GO.
{{< /caution >}}

2.  To detach from the screen session running the server console, press these two key combinations in succession:

    **Control+A**<br>
    **Control+D**

3.  To bring the console back, type the following command:

        screen -r

4.  To stop the server, bring back the CS:GO console and press **CONTROL + C**.

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

When logged into the server, you can open the RCON console with the backtic button (<code>`</code>), or your mapped key. To log in type `rcon_password` followed by your password. For more information regarding RCON, click [here](/docs/game-servers/team-fortress2-on-debian-and-ubuntu/#rcon).
