---
author:
    name: Andrew Gottschling
    email: andrewgottschling@gmx.us
description: 'Install and configure a Don''t Starve Together server for Ubuntu 14.04'
keywords: 'don''t starve, don''t starve together, game servers, games, ubuntu, ubuntu 14.04'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['web-applications/game-servers/minecraft-ubuntu12-04/']
published: 'Monday, March 30th, 2015'
modified: Monday, March 30th, 2015
modified_by:
  name: Elle Krout
title: 'Install and Configure Don''t Starve Together Server on Ubuntu 14.04'
contributor:
    name: Andrew Gottschling
    link: https://github.com/agottschling
---

Don’t Starve Together is a multiplayer game written and published by Klei Entertainment, and is a multiplayer add on to their single-player game Don’t Starve. This guide will explain how to prepare your VPS, install SteamCMD, and install, then configure, Don’t Starve Together.


## Prerequisites

Have the following items before you begin:

- A [Steam](http://store.steampowered.com) account.
- A copy of [Don’t Starve Together](http://store.steampowered.com/app/322330/) that you have purchased on Steam.
- A Up-to-date Linode running Ubuntu 14.04. We suggest you follow our [Getting Started](/docs/getting-started) guide for help configuring your Linode.

{: .note }
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the sudo command, reference the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Preparing your Linode

Don't Starve Together is sold on Steam, and requires a valid license. Therefore, we will use SteamCMD to download and maintain servers for games sold on steam. Because current generation Linodes run a 64-bit operating system, we need to download a few extra libraries in order to run SteamCMD.


1.  Update the system: 

        sudo apt-get update && sudo apt-get upgrade


2.  Install the i386 architecture:

        sudo dpkg --add-architecture i386
    

3.  Install the 32-bit libraries required:

        sudo apt-get install lib32gcc1 lib32stdc++6 libcurl4-gnutls-dev:i386 screen

{: .note }
> If you're running a legacy Linode on a 32 bit kernel, install these packages instead:
>
>     sudo apt-get install libcurl4-gnutls-dev:i386 libgcc1 screen

If you've a firewall running on your Linode, add exceptions for SteamCMD:

    sudo iptables -A INPUT -p udp- m udp --sport 4380 --dport 1025:65355 -j ACCEPT
    sudo iptables -A INPUT -p udp -m udp --sport 10999 --dport 1025:65355 -j ACCEPT
    sudo iptables -A INPUT -p udp -m udp --sport 27000:27030 --dport 1025:65355 -j ACCEPT


{: .note }
> If you've configured your firewall according to our [Securing Your Server](/docs/security/securing-your-server) guide, be sure to add these ports to your `/etc/iptables.firewall.rules` file.

## Install SteamCMD and Don’t Starve Together

1.  Change directory to your user's home folder:

        cd ~

2.  Download SteamCMD into its own directory:

        mkdir steamcmd
        mkdir dstserver
        cd steamcmd
        wget http://media.steampowered.com/installer/steamcmd_linux.tar.gz

3.  Extract the package and remove the archive file:

        tar -xvzf steamcmd_linux.tar.gz
        rm steamcmd_linux.tar.gz

4.  Once the package is extracted, we can install the game server. Make sure to change any text that is `highlighted` so that it matches your correct configuration.

        cd ~
        cd steamcmd
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

The **Steam>** prompt is similar to the linux command prompt, with the exception of not being able to execute normal linux commands. 

Now that you have SteamCMD installed and ready for commands, let’s install Don’t Starve Together. Run these commands at the **Steam>** prompt, making sure to change any `highlighted text` to match your configuration.

    login anonymous
    force_install_dir ../dstserver
    app_update 343050 validate

This can take some time. If the download looks as if it has frozen, be patient. In my case, the download took about 10 minutes.
Once the download is complete, you should see something like this:

    Success! App '343050' fully installed.

    Steam>

Finally, type this to exit SteamCMD.

    quit


## Step 3 — Configuring Don’t Starve Together


Before you configure Don’t Starve Together, you should launch it at least once so that it can generate its configuration files. 

    cd ~
    cd dstserver
    cd bin
    ./dontstarve_dedicated_server_nullrenderer

Once you see something similar to this, the server has been successfully launched.

    Telling Client our new session identifier: XXXXXXXXXXXXXXXX
    ModIndex: Load sequence finished successfully.  
    Reset() returning


You will see a error that looks similar to this:

    [200] Account Failed (6): "E_INVALID_TOKEN"
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    !!!! Your Server Will Not Start !!!!
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

This is completely normal and we will fix this in the next step. 

Now, press the **CONTROL + C** keys simultaneously for a moment to quit the server. You will be left with your linux command prompt.

We now need to edit the configuration file for your server. Move your shell to the configuration directory:

    cd ~/.klei/DoNotStarveTogether/

This is the folder for Don’t Starve Together’s configuration and world save data. To begin, open the `settings.ini` file in the current folder using nano.

    nano `settings.ini`

Here is an example configuration file. You may use this and modify it as you need. 

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

Press the **CONTROL + X** keys simultaneously for a moment. The bottom of **nano** will ask you this:

    Save modified buffer (ANSWERING "No" WILL DESTROY CHANGES) ?                    
     Y Yes
     N No           ^C Cancel

Press the **Y**  key on your keyboard. You should then see something like this:

    File Name to Write: settings.ini                                          

    ^G Get Help                               M-D DOS Format                            M-A Append                                M-B Backup File
    ^C Cancel                                 M-M Mac Format                            M-P Prepend

Press the **ENTER** key on your keyboard to save your changes, and exit nano.


## Step 4 - Getting your Authentication Token

The next step involves your personal computer. Having Don’t Starve Together installed on your personal computer is necessary to get your token.

Open up the game on your computer. Once you reach the main menu, press the **~** key on your keyboard. You will see a screen similar to this one: 

[![DST Console.](/docs/assets/DSTconsole_resized.png)](/docs/assets/DSTconsole.png)

You have to type or paste the following string of text **EXACTLY** as it is shown below into the box at the bottom of the console:

    TheNet:GenerateServerToken()

It should look like this:
[![DST Console with command](/docs/assets/DSTconsolecommand_resized.png)](/docs/assets/DSTconsolecommand.png)

Once you have done this, press **ENTER** on your keyboard. The console will close, and you can exit the game. What we care about is a file that has been generated in one of the following directories, depending on your operating system. 

On Windows, the file is located in: 

    %USERPROFILE%/My Documents/Klei/DoNotStarveTogether/server_token.txt

On Linux:

    ~/.klei/DoNotStarveTogether/server_token.txt

On Mac OS X:

    ~/Documents/Klei/DoNotStarveTogether/server_token.txt

This file is your server token. Do not share it with anyone. This needs to be uploaded to your Linode in the ~/.klei/DoNotStarveTogether/ directories. 

Next we need to make a start script. This will make it easier to start the server, and allows you to logout of the server while keeping it running. To begin, move into the directory that contains your server files.

    cd ~
    cd `dstserver`
    cd bin

Next, create and open the file start.sh

    nano start.sh

Paste in the following text into the file:

    screen -S "DST Server" ./dontstarve_dedicated_server_nullrenderer

Press the **CONTROL + X** keys simultaneously for a moment. The bottom of nano will ask you this:

    Save modified buffer (ANSWERING "No" WILL DESTROY CHANGES) ?                    
     Y Yes
     N No           ^C Cancel

Press the **Y**  key on your keyboard. You should then see something like this:

    File Name to Write: start.sh                                                                                                                                        
    ^G Get Help                               M-D DOS Format                            M-A Append                                M-B Backup File
    ^C Cancel                                 M-M Mac Format                            M-P Prepend

Press the **ENTER** key on your keyboard to save your changes and exit nano.

Finally, make the script executable by running the following command:

    chmod 775 start.sh


## Step 5 — Using the Server


Now that your server is installed and configured, it can be launched by running the start.sh script that you created. 

{: .caution}
>
>Do not press the **CONTROL + C** keys while in the console unless you want to stop the server. To hide the server console, press these two key combinations in succession:
>**CONTROL + A**
>**CONTROL + D**

To bring the console back, type the following command:

    screen -r

To stop the server, bring back the console, press **CONTROL + C** for a moment, and you will return to the linux prompt.


## Conclusion

[![DST Server with users on it](/docs/assets/DSTrunning_resized.png)](/docs/assets/DSTrunning.png)

Now that you have installed and configured Don’t Starve together, you have your very own Don’t Starve Together server for you and your friends to play on. Your users can access the server by opening the server list and finding your server’s name, clicking **Connect**, and entering a password if you choose to set one.