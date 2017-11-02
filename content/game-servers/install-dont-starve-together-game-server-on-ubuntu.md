---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Install and Configure a Don''t Starve Together Multi-player Game Server for Ubuntu 14.04'
keywords: ["don''t starve", "don''t starve together", "game servers", "games", "ubuntu", " ubuntu 14.04", "steam cmd", "steamcmd", "token"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2015-04-14
modified: 2016-02-25
modified_by:
    name: Linode
title: 'Install Don''t Starve Together Game Server on Ubuntu 14.04'
aliases: ['applications/game-servers/dont-starve-together-on-ubuntu/','applications/game-servers/install-dont-starve-together-game-server-on-ubuntu/']
contributor:
    name: Andrew Gottschling
    link: https://github.com/agottschling
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and
earn $250 per published guide.*

<hr>

[Don’t Starve Together](https://www.kleientertainment.com/games/dont-starve-together) is a multiplayer game written and published by Klei Entertainment, and is a multiplayer add- on to their single-player game Don’t Starve. This guide will explain how to prepare your Linode and install, then configure, Don’t Starve Together.


## Before You Begin

1.  You will need a [Steam](http://store.steampowered.com) account and a copy of [Don’t Starve Together](http://store.steampowered.com/app/322330/).

2.  Complete our guide: [Install SteamCMD for a Steam Game Server](/docs/applications/game-servers/install-steamcmd-for-a-steam-game-server). This will get SteamCMD installed and running on your Linode and this guide will pick up where the SteamCMD page leaves off.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Prerequisites for Don't Starve Together

From the SteamCMD guide, two additional steps are needed specifically for DST.

1.  Add an iptables firewall rule. This command assumes that you have **only** the iptables rules in place from the SteamCMD guide. This inserts a rule for port 10999 after the pre-existing iptables rules for SteamCMD.

        sudo iptables -I INPUT 7 -p udp --sport 10999 --dport 1025:65355 -j ACCEPT

2.  After entering the above rule, run iptables-persistent again. You’ll be asked if you want to save the current IPv4 and IPv6 rules. Answer `yes` for IPv4 and `no` for IPv6.

        sudo dpkg-reconfigure iptables-persistent

3.  Install some additonal 32-bit packages:

        sudo apt-get install libcurl4-gnutls-dev:i386


## Install Don’t Starve Together

1.  Be sure you are in the directory `~/Steam`, then access the `Steam>` prompt.

        cd ~/Steam && ./steamcmd.sh

2.  From the SteamCMD prompt, login anonymously:

        login anonymous

    Or log in with your Steam username:

        login example_user

3.  Install Don't Starve Together to the `Steam` user's home directory:

        force_install_dir ./dstserver
        app_update 343050 validate

    This can take some time. If the download looks as if it has frozen, be patient. Once the download is complete, you should see this output:

        Success! App '343050' fully installed.

        Steam>

4.  Exit SteamCMD.

        quit

    {{< note >}}
To update DST, run the above 4 commands again.
{{< /note >}}

## Configure Don’t Starve Together

1.  Before you configure DST, you should launch it at least once to generate its configuration files:

        cd ~/Steam/dstserver/bin
        ./dontstarve_dedicated_server_nullrenderer

2.  Once you see this output, the server has been successfully launched:

        Telling Client our new session identifier: XXXXXXXXXXXXXXXX
        ModIndex: Load sequence finished successfully.
        Reset() returning


    You will see a error that looks similar to this:

        [200] Account Failed (6): "E_INVALID_TOKEN"
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        !!!! Your Server Will Not Start !!!!
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    This is completely normal and we will fix this in the next step.

3.  Press **Control+C** to quit the server. You will return to the linux command prompt.

4.  Create a settings file for your Don't Starve Together server in `~/.klei/DoNotStarveTogether/`. Below  is an example configuration file. You may use this and modify it as you need. Note that where several non-binary options exist, they are shown in this file delimited with a `|`, and numerical ranges are denoted with `..`. Choose a single option.

    {{< file "~/.klei/DoNotStarveTogether/settings.ini" >}}
[network]
default_server_name = Your unique server name
default_server_description = A very nice server description
server_port = 10999
server_password = password
max_players = 1 .. 64
pvp = true | false
game_mode = endless | survival | wilderness
 enable_autosaver = true | false
tick_rate = 30
connection_timeout = 8000
server_save_slot = 1
enable_vote_kick = true | false
pause_when_empty = true | false

[account]
dedicated_lan_server = false


[STEAM]
DISABLECLOUD = true


[MISC]
CONSOLE_ENABLED = true
autocompiler_enabled = true

{{< /file >}}


4.  Create a startup script for DST with the following contents:

    {{< file "~/startdst.sh" >}}
#!/bin/sh

cd ./Steam/dstserver/bin
screen -S "Don't Starve Together Server" ./dontstarve_dedicated_server_nullrenderer

{{< /file >}}

    When run, the script will change directories to `~/Steam/dstserver/bin` and execute DST in a [Screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions) session.

5.  Make the script executable:

        chmod +x ~/startdst.sh

## Get your Authentication Token

You will need Don’t Starve Together installed on your personal computer to get your token.

1.  Open up the game on your computer. Once you reach the main menu, press the backtick key (<code>`</code>) on your keyboard. You will see a screen similar to this one:

    [![DST Console.](/docs/assets/DSTconsole_resized.png)](/docs/assets/DSTconsole.png)

    {{< note >}}
If you've never before played the game, you first need to click on **Play** and create an account.
{{< /note >}}

2.  Copy the following string into the box at the bottom of the console:

        TheNet:GenerateServerToken()

    It should look like this:
    [![DST Console with command](/docs/assets/DSTconsolecommand_resized.png)](/docs/assets/DSTconsolecommand.png)

    Once you have done this, press **ENTER** on your keyboard. The console will close, and you can exit the game. Locate the file that has been generated in one of the following directories, depending on your operating system.

    On Windows, the file is located in:

        %USERPROFILE%/My Documents/Klei/DoNotStarveTogether/server_token.txt

    On Linux:

        ~/.klei/DoNotStarveTogether/server_token.txt

    On Mac OS X:

        ~/Documents/Klei/DoNotStarveTogether/server_token.txt

    This file is your server token. Do not share it with anyone.

3.  Upload the token file to your Linode. If you're running OS X or Linux, you can use the following command, replacing your IP address and username:

         scp ~/Documents/Klei/DoNotStarveTogether/server_token.txt user@12.34.56.78:~/.klei/DoNotStarveTogether/

## Start the Server

1.  Now that your server is installed and configured, it can be launched by running the `startdst.sh` script from your `steam` user's home directory.

        cd ~/ && ./startdst.sh

    {{< caution >}}
From this point, do not press the **Control+C** keys while in the console unless you want to stop DST.
{{< /caution >}}

2.  To detach from the screen session running the server console, press these two key combinations in succession:

    **Control+A**<br>
    **Control+D**

3.  To bring the console back, type the following command:

        screen -r

4.  To stop the server, bring back the DST console and press **CONTROL + C**.

## Enter The Server

[![DST Server with users on it](/docs/assets/DSTrunning_resized.png)](/docs/assets/DSTrunning.png)

Now you have your very own Don’t Starve Together server for you and your friends to play on. Players can access the server by opening the server list and finding your server’s name, clicking **Connect**, and entering a password if you chose to set one.
