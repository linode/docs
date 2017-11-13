---
deprecated: true
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'A basic Minecraft server installation for Ubuntu 12.04'
keywords: ["minecraft", "ubuntu", "ubuntu precise", "12.04"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/game-servers/minecraft-ubuntu12-04/','applications/game-servers/minecraft-on-linode-with-ubuntu-12-04/']
modified: 2013-10-01
modified_by:
  name: Linode
published: 2013-09-30
title: 'Minecraft on Linode with Ubuntu 12.04'
---

This guide shows you how to set up a personal Minecraft server on a Linode running Ubuntu 12.04 LTS (64 bit).

Minecraft has rapidly become one of the more popular online games for kids and adults alike. It is a sandbox game, offering a limitless world in which to create, as well as an end goal to strive towards: defeating the *Ender Dragon* and *The Wither*.

The game starts you in the vast wilderness with nothing but your bare hands. By chopping at trees you can acquire wood. With the wood you can construct a crafting bench, and with that simple tools. The more materials you gather, the more you can create. As you explore you will encounter monsters, lava, and other hazards that could spell disaster for your character. Counter these dangers with armor, enchantments, traps, and seek out the path to *The End*.

Running your own Minecraft server allows you to control whom you play with, and keeps a persistent world available whenever you want to rejoin the game.

In this guide, we will show you how to install the official or *Vanilla* server version of Minecraft, but you can use the same instructions for [Craftbukkit](http://dl.bukkit.org/downloads/craftbukkit/) or [Spigot](http://www.spigotmc.org/), which are popular versions of Minecraft that allow plugins and customization. We will also show you how to create a new user to run the Minecraft server.

# Preparation

In this section, we'll prepare your Linode for installing the Minecraft server.

-   We recommend that you install the Minecraft on at least a Linode 2GB so it runs smoothly.
-   We will also be installing Oracle Java Runtime Environment (JRE) 7 as a prerequisite.

### Updating Packages

1.  Log in to your Linode via [SSH](/docs/getting-started#ssh-overview).
2.  Gain administrator privileges:

        su

3.  Execute the following two commands to make sure your packages are up to date:

        apt-get update
        apt-get upgrade

### Installing Oracle JRE

This guide uses Oracle JRE 7, which offers the best performance for your Minecraft server, but is not available in Ubuntu's repositories. The website [webupd8.org](http://www.webupd8.org/) has provided instructions for installing the official version on Debian-based systems, including Ubuntu. The full guide is [here](http://www.webupd8.org/2012/01/install-oracle-java-jdk-7-in-ubuntu-via.html).

For convenience, all the necessary commands for installing JRE 7 are also listed below.

1.  Run these commands to set up the third-party repository for the Oracle JRE:

        apt-get install python-software-properties
        add-apt-repository ppa:webupd8team/java

2.  You will see the following output, which provides more information on the method we're using to install Java. Press **Enter** when the final prompt appears:

        You are about to add the following PPA to your system:
        Oracle Java (JDK) Installer (automatically downloads and installs Oracle
        JDK6 / JDK7 / JDK8). There are no actual Java files in this PPA. More info:
        http://www.webupd8.org/2012/01/install-oracle-java-jdk-7-in-ubuntu-via.html
        More info: https://launchpad.net/~webupd8team/+archive/java
        Press [ENTER] to continue or ctrl-c to cancel adding it

3.  Then run the following commands to install JRE:

        apt-get update
        apt-get install oracle-java7-installer

    You will need to agree to Oracle’s license agreement.

4.  Test the installation by running this command:

        java -version

    You should see the following output:

        java version "1.7.0_40"
        Java(TM) SE Runtime Environment (build 1.7.0_40-b43)
        Java HotSpot(TM) 64-Bit Server VM (build 24.0-b56, mixed mode)

If you don’t see this output or you get errors, refer to webupd8.org’s [guide](http://www.webupd8.org/2012/01/install-oracle-java-jdk-7-in-ubuntu-via.html) for more steps. Or if you prefer, you can download the installer for Oracle’s JRE [directly from Oracle](http://www.oracle.com/technetwork/java/javase/downloads/jre7-downloads-1880261.html), and install it on your own.

# Installing and Setting Up Minecraft

There are many popular versions of the Minecraft server, but for this guide we'll be using the official version. You can follow these same steps with the third-party servers as well. One of the more popular versions is Craftbukkit. The list of available CraftBukkit versions is available [here](http://dl.bukkit.org/downloads/craftbukkit/).

To find the latest version of the Minecraft server, visit the [Minecraft download page](https://minecraft.net/download).

1.  Create the user to run the server:

        adduser minecraft

2.  Switch to the **minecraft** user:

        su minecraft

3.  Move into the **minecraft** user's home directory:

        cd

4.  Download the latest version of the Minecraft server:

        wget https://s3.amazonaws.com/Minecraft.Download/versions/1.6.4/minecraft_server.1.6.4.jar

    {{< note >}}
This URL will change as Minecraft is updated. Please check the downloads [page](https://minecraft.net/download) for the current URL.
{{< /note >}}

5.  Using your preferred text editor, create the following text file. This is a script that invokes the JRE and tells it to run Minecraft:

    {{< file "/home/minecraft/run.sh" >}}
#!/bin/sh
BINDIR=$(dirname "$(readlink -fn "$0")")
cd "$BINDIR"

java -Xms1024M -Xmx1536M -jar minecraft_server.1.6.4.jar -o true

{{< /file >}}


    {{< note >}}
If you are using a different or newer version of the Minecraft server, make sure to adjust this file to name the correct `.jar` file.

The variable `-Xms` defines for Java the minimum amount of memory to allocate for the Minecraft server, and `-Xmx` defines the maximum. These values are set for a Linode 2GB, but you will want to adjust these numbers based on your Linode’s size and other uses.
{{< /note >}}

6.  Make the script executable:

        chmod +x run.sh

7.  Exit the **minecraft** user's shell:

        exit

8.  We recommend running Minecraft from a screen session under your username, and running the server as the **minecraft** user. Screen is already installed on Ubuntu 12.04, and is available in most Linux distributions' repositories. With the Minecraft server running in a screen session, you can keep it running even when you disconnect from the Linode. When you reconnect, you can access the Minecraft console again with the `screen -rd` command and the name you gave the screen session. To put Minecraft into a screen session, execute the following command:

        screen -S minecraft

    {{< note >}}
To leave this screen session running in the background, type **CTRL-a** and then **d**. You can now safely exit from your SSH session. To reattach to the session later, use the command `screen -rd minecraft`.
{{< /note >}}

9.  In your screen session (which you started in the previous step), switch to the **minecraft** user:

        su minecraft

10. Change your working directory:

        cd

11. Launch the server:

        ./run.sh

    This will take several seconds, as the server needs to generate the initial environment for your players. Once you see the output `Done`, your server is live:

        minecraft@li510-161:~$ ./run.sh
        2013-09-22 23:37:24 [INFO] Starting minecraft server version 1.6.4
        2013-09-22 23:37:24 [INFO] Loading properties
        2013-09-22 23:37:24 [WARNING] server.properties does not exist
        2013-09-22 23:37:24 [INFO] Generating new properties file
        2013-09-22 23:37:24 [INFO] Default game type: SURVIVAL
        2013-09-22 23:37:24 [INFO] Generating keypair
        2013-09-22 23:37:26 [INFO] Starting Minecraft server on *:25565
        2013-09-22 23:37:26 [WARNING] Failed to load operators list: java.io.FileNotFoundException: ./ops.txt (No such file or directory)
        2013-09-22 23:37:26 [WARNING] Failed to load white-list: java.io.FileNotFoundException: ./white-list.txt (No such file or directory)
        2013-09-22 23:37:26 [INFO] Preparing level "world"
        2013-09-22 23:37:28 [INFO] Preparing start region for level 0
        2013-09-22 23:37:29 [INFO] Preparing spawn area: 0%
        2013-09-22 23:37:30 [INFO] Preparing spawn area: 2%
        2013-09-22 23:37:31 [INFO] Preparing spawn area: 4%
        ....
        2013-09-22 23:37:53 [INFO] Preparing spawn area: 89%
        2013-09-22 23:37:54 [INFO] Preparing spawn area: 95%
        2013-09-22 23:37:55 [INFO] Done (29.209s)! For help, type "help" or "?"

# Configuring Your Minecraft Client

For you and your friends to play Minecraft, you will all need to install the Minecraft client on your computers.

1.  Visit [minecraft.net](http://minecraft.net/).
2.  Create an account, which you will use to log in to your Minecraft client and to access your (or any other) server.
3.  Download the Minecraft client from the Minecraft website.
4.  Run the Minecraft client.
5.  Log in with the credentials you created in Step 2.
6.  Click **Multiplayer**.
7.  Click **Add server**.
8.  In the **Server Name** field, enter your desired name for your Minecraft server. This is only for your convenience, and will only be visible to you.
9.  In the **Server Address** field, enter your [Linode’s IP address](/docs/getting-started#find-the-ip-address-of-your-linode), or any domain that resolves to your Linode.
10. Click **Done** to return to the server list screen.

    {{< note >}}
Sometimes the Minecraft Client will show a newly-added server as unavailable the first time around. Just click the **Refresh** button to reload the screen.
{{< /note >}}

11. Double-click your newly-added server to log in.

Congratulations! You’ve created a working Minecraft server. Feel free to look around and begin playing, but remember that your work isn’t done yet, and your server is not yet fully configured. Once you’re ready, log out and continue with this guide.

# Configuring Your New Minecraft Server

Once you’re ready to continue and have logged out of your server, log back in to your Linode.

1.  Rejoin your screen session:

        screen -rd minecraft

2.  Switch to the **minecraft** user:

        su minecraft

3.  Change your working directory:

        cd

4.  Stop the Minecraft server:

        stop

5.  Take a look at what’s just been created for us, so we can start configuring the server:

        2013-09-22 23:47:27 [INFO] Stopping the server
        2013-09-22 23:47:27 [INFO] Stopping server
        2013-09-22 23:47:27 [INFO] Saving players
        2013-09-22 23:47:27 [INFO] Saving worlds
        2013-09-22 23:47:27 [INFO] Saving chunks for level 'world'/Overworld
        java.net.SocketException: Socket closed
                at java.net.PlainSocketImpl.socketAccept(Native Method)
                at java.net.AbstractPlainSocketImpl.accept(AbstractPlainSocketImpl.java:398)
                at java.net.ServerSocket.implAccept(ServerSocket.java:530)
                at java.net.ServerSocket.accept(ServerSocket.java:498)
                at iy.run(SourceFile:61)
        2013-09-22 23:47:27 [INFO] Closing listening thread
        2013-09-22 23:47:27 [INFO] Saving chunks for level 'world'/Nether
        2013-09-22 23:47:27 [INFO] Saving chunks for level 'world'/The End
        minecraft@li510-161:~$

These next sections contain descriptions for certain files or directories in your `/minecraft` directory. These are not all the files that you may want to configure, nor are these complete descriptions. For more details, see the [Minecraft Wiki](http://minecraft.gamepedia.com/Minecraft_Wiki).

### Edit the Configuration Files

In the `/minecraft` home folder, run this command:

    cd

Now that the server has been started once, you will see (in addition to the `run.sh` file) several new files and directories. Below are explanations and instructions on how to use them.

1.  Edit the `ops.txt` file:

        nano /home/minecraft/ops.txt

    This file holds the usernames of players that have **ops** privileges on your server, each on their own line. Add your Minecraft username to this file, but be careful who else you put on this list. Players on this list can change their game mode, ban and unban players, etc. You can also add players to the ops list while the server is running by typing `op playername` into the server console, or `/op playername` from within the game (replacing `playername` with the actual name of the player). Note that you need to add your player name to this list manually or from the console in order to be able to do so from within the game for other users.

2.  Edit the white list:

        nano /home/minecraft/white-list.txt

    If you decide you want to make your server accessible only to select players, you can add their names to the file `white-list.txt`. You will need to edit the `server.properties` file as described in step 3, and change `white-list=false` to `white-list=true`.

3.  Edit the `server.properties` file:

        nano server.properties

    In addition to changing the white list settings as described in Step 2, you can also use this file to change the public message for your Minecraft server. Edit the `motd=A Minecraft Server` line to show the name or phrase for your server that you want to display publicly.

Any time you modify these files while the game is running, you will need to stop and restart the server for the changes to take effect.

### Description of Directories

-   `/world`
-   `/world_nether`
-   `/world_the_end`

The directories `world`, `world_nether`, and `world-the-end` contain the map and player data for those realms in your game. We suggest [backing up](/docs/platform/backup-service) these directories on a regular basis so that you can revert to previous versions in case of catastrophe or [griefing](http://www.minecraftwiki.net/wiki/Griefing). These directories may be in different locations, depending on which version of the Minecraft server you installed. Note that the directories for the *nether* and *the end* will not be created until a player goes to this area on the server.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Official Minecraft Site](http://minecraft.net/)
- [Minecraft Wiki](http://minecraft.gamepedia.com/Minecraft_Wiki)
- [Official CraftBukkit Site](http://dl.bukkit.org/)
- [Bukkit Plugins](http://dev.bukkit.org/bukkit-plugins/)



