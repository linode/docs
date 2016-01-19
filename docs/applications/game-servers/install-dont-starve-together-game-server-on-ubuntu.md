---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Install and Configure a Don''t Starve Together Multi-player Game Server for Ubuntu 14.04'
keywords: 'don''t starve together,game server,ubuntu, ubuntu 14.04,steam cmd,steamcmd,token'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Tuesday, April 14, 2015'
modified: Tuesday, April 14, 2015
modified_by:
    name: Alex Fornuto
title: 'Install Don''t Starve Together Game Server on Ubuntu 14.04'
alias: ['applications/game-servers/dont-starve-together-on-ubuntu']
contributor:
    name: Andrew Gottschling
    link: https://github.com/agottschling
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and
earn $250 per published guide.*

<hr>

Don’t Starve Together is a multiplayer game written and published by Klei Entertainment, and is a multiplayer add on to their single-player game Don’t Starve. This guide will explain how to prepare your Linode, install SteamCMD and install, then configure, Don’t Starve Together.

## Prerequisites

Have the following items before you begin:

- A [Steam](http://store.steampowered.com) account.
- A copy of [Don’t Starve Together](http://store.steampowered.com/app/322330/) that you have purchased on Steam.
- An up-to-date Linode running Ubuntu 14.04. We suggest you follow our [Getting Started](/docs/getting-started) guide for help configuring your Linode.

{: .note }
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the sudo command, reference the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Preparing your Linode

Don't Starve Together is sold on Steam, and requires a valid license. Therefore, we will use SteamCMD to download and maintain servers for games sold on steam.

Because current generation Linodes run a 64-bit operating system, we need to download a few extra libraries in order to run SteamCMD.

1.  Configure the package manager to include packages for i386 architecture:

        sudo dpkg --add-architecture i386

2.  Update the system:

         sudo apt-get update && sudo apt-get upgrade

3.  Install the 32-bit libraries required:

        sudo apt-get install lib32gcc1 lib32stdc++6 libcurl4-gnutls-dev:i386 screen

    {: .note }
    > If you're running a legacy Linode on a 32 bit kernel, install these packages instead:
    >
    >     sudo apt-get install libcurl4-gnutls-dev:i386 libgcc1 screen

If you have a firewall running on your Linode, add exceptions for SteamCMD:

    sudo iptables -A INPUT -p udp- m udp --sport 4380 --dport 1025:65355 -j ACCEPT
    sudo iptables -A INPUT -p udp -m udp --sport 10999 --dport 1025:65355 -j ACCEPT
    sudo iptables -A INPUT -p udp -m udp --sport 27000:27030 --dport 1025:65355 -j ACCEPT

{: .note }
> If you've configured your firewall according to our [Securing Your Server](/docs/security/securing-your-server) guide, be sure to add these port ranges to your `/etc/iptables.firewall.rules` file.

## Install SteamCMD and Don’t Starve Together

1.  From your user's home folder, download SteamCMD into its own directory:

        mkdir steamcmd
        cd steamcmd
        wget http://media.steampowered.com/installer/steamcmd_linux.tar.gz

3.  Extract the package and remove the archive file:

        tar -xvzf steamcmd_linux.tar.gz
        rm steamcmd_linux.tar.gz

4.  Run the SteamCMD Installer.

        ./steamcmd.sh

    This command will display output similar to this:

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
        [----] Extracting package...
        [----] Extracting package...
        [----] Installing update...
        [----] Installing update...
        [----] Installing update...
        [----] Cleaning up...
        [----] Update complete, launching Steam...
        Redirecting stderr to '/home/linode/Steam/logs/stderr.txt'
        [  0%] Checking for available updates...
        [----] Verifying installation...
        Steam Console Client (c) Valve Corporation
        -- type 'quit' to exit --
        Loading Steam API...OK.

        Steam>

    The `Steam>` prompt is similar to the Linux command prompt, with the exception of its not being able to execute normal Linux commands. 

4.  Install Don’t Starve Together from the SteamCMD prompt:

        login anonymous
        force_install_dir ../dstserver
        app_update 343050 validate

    Installation can take some time. If the download looks as if it has frozen, be patient; it may take about 10 minutes. Once the download is complete, you should see this output:

        Success! App '343050' fully installed.

        Steam>

5.  Finally, exit SteamCMD.

        quit

##Configure Don’t Starve Together

1.  Before you configure Don’t Starve Together, you should launch it at least once so that it can generate its configuration files:

        cd ~/dstserver/bin
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

3.  Press the **CONTROL + C** to quit the server. You will return to the linux command prompt.

4.  Create a settings file for your Don't Starve Together server in `~/.klei/DoNotStarveTogether/`. Below  is an example configuration file. You may use this and modify it as you need. Note that where several non-binary options exist, they are shown in this file delimited with a `|`, and numerical ranges are denoted with `..`. Choose a single option.

    {:.file }
    ~/.klei/DoNotStarveTogether/settings.ini
    :   ~~~
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
        ~~~

5.  Create a start script, `start_dst.sh` with the following contents:

    {: .file }
    ~/dstserver/bin/start_dst.sh
    :   ~~~
        screen -S "DST Server" dontstarve_dedicated_server_nullrenderer
        ~~~

    This script, when run, will execute the Don't Starve Together server in a [Screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions) session.

6.  Make the script executable:

        chmod +x ~/dstserver/bin/start_dst.sh

## Get your Authentication Token

You will need Don’t Starve Together installed on your personal computer to get your token.

1.  Open up the game on your computer. Once you reach the main menu, press the backtick key (<code>`</code>) on your keyboard. You will see a screen similar to this one: 

    [![DST Console.](/docs/assets/DSTconsole_resized.png)](/docs/assets/DSTconsole.png)

    {: .note }
    > If you've never before played the game, you first need to click on **Play** and create an account.

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

1.  Now that your server is installed and configured, it can be launched by running the `start_dst.sh` script from the `~/dstserver/bin/` directory. Please note that if your current working directory is not `~/dstserver/bin/` the game will fail to start:

        cd ~/dstserver/bin/
        ./start_dst.sh

    {: .caution}
    >Do not press the **CONTROL + C** keys while in the console unless you want to stop the server.

2.  To detach from the screen session running the server console, press these two key combinations in succession:

    **CONTROL + A**<br>
    **CONTROL + D**

3.  To bring the console back, type the following command:

        screen -r

4.  To stop the server, bring back the console and press **CONTROL + C**.

## Enter The Server

[![DST Server with users on it](/docs/assets/DSTrunning_resized.png)](/docs/assets/DSTrunning.png)

Now that you have installed and configured Don’t Starve together, you have your very own Don’t Starve Together server for you and your friends to play on. Your users can access the server by opening the server list and finding your server’s name, clicking **Connect**, and entering a password if you choose to set one.
