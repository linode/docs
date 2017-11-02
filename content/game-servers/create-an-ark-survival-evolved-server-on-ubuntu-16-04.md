---
author:
  name: Nick Brewer
  email: docs@linode.com
description: 'A basic ARK server installation guide for Ubuntu 16.04'
keywords: ["ark survival evolved", " ubuntu", " server"]
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
external_resources:
 - '[PlayARK.com](http://www.playark.com/)'
 - '[The Official ARK: Survival Evolved Wiki](http://ark.gamepedia.com/ARK_Survival_Evolved_Wiki)'
modified: 2016-12-28
modified_by:
  name: Nick Brewer
published: 2016-12-28
title: 'Create an ARK: Survival Evolved Server on Ubuntu 16.04'
aliases: ['applications/game-servers/create-an-ark-survival-evolved-server-on-ubuntu-16-04/']
---

This guide will show you how to set up a personal [ARK: Survival Evolved](http://www.playark.com/) server on a Linode running Ubuntu 16.04 LTS (Xenial Xerus).

![Create an ARK: Survival Evolved Server on Ubuntu 16.04](/docs/assets/ark-survival-evolved.png "Create an ARK: Survival Evolved Server on Ubuntu 16.04")

{{< note >}}
The steps in this guide require root privileges unless otherwise noted. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  To connect to your ARK server, you must have a copy of the [ARK](http://www.playark.com/) game client.

2.  In keeping with the [system requirements](http://ark.gamepedia.com/Dedicated_Server_Setup#Hardware) for an ARK server, we recommend using our **8GB** plan or a [high memory Linode](https://www.linode.com/pricing#high-memory) when following these steps.

3.  Update your Linode's software:

        apt-get update && apt-get upgrade

4.  Install **SteamCMD**, the Steam command line interface:

        apt-get install steamcmd

    During the installation process, you will be prompted to agree to the Steam License Agreement. Select **I Agree** and hit **Ok** to accept the terms of the agreement.

5.  For security reasons, you'll create a separate `ark` user to run your server application. Take note of the password you assign:

        adduser ark

## Adjust Your System Settings

1.  Run the following command to increase the allowed number of open files:

        echo "fs.file-max=100000" >> /etc/sysctl.conf && sysctl -p

2.  Update the hard and soft file limits by running:

        echo "* soft nofile 1000000" >> /etc/security/limits.conf
        echo "* hard nofile 1000000" >> /etc/security/limits.conf

3.  Enable PAM limits by issuing this command:

        echo "session required pam_limits.so" >> /etc/pam.d/common-session

## Install Your ARK Server

1.  Switch your session to that of the `ark` user, and create a `server` directory that will contain your ARK server files:

        su - ark
        mkdir server

2.  Create a symlink from `/usr/games/steamcmd` to `steamcmd` in the `ark` user's home directory:

        ln -s /usr/games/steamcmd steamcmd

3.  Run `steamcmd` with the following options to install the ARK server:

        steamcmd +login anonymous +force_install_dir /home/ark/server +app_update 376030 +quit

    This will take several minutes to complete.

## Create a systemd Unit for Your ARK Server

By creating a systemd unit file for your ARK server, it can be set to start automatically after a reboot.

1.  Switch back to your root user session:

        su -

2.  Create a new systemd service file and add the following values to it. Fill in the `SessionName` value on line 12 with the name you'll use to identify your ARK server:

    {{< file "/lib/systemd/system/ark.service" >}}
[Unit]
Description=ARK Survival Evolved
[Service]
Type=simple
Restart=on-failure
RestartSec=5
StartLimitInterval=60s
StartLimitBurst=3
User=ark
Group=ark
ExecStartPre=/home/ark/steamcmd +login anonymous +force_install_dir /home/ark/server +app_update 376030 +quit
ExecStart=/home/ark/server/ShooterGame/Binaries/Linux/ShooterGameServer TheIsland?listen?SessionName=example -server -log
ExecStop=killall -TERM srcds_linux
[Install]
WantedBy=multi-user.target

{{< /file >}}


    Save and exit the file.

3.  Update systemd to apply your changes:

        systemctl daemon-reload

4.  Enable your new systemd unit and start your ARK server:

        systemctl enable ark.service
        systemctl start ark

## Configure Your ARK Server

Once you've started the server, you can add or remove settings by editing the `GameUserSettings.ini` file under `/home/ark/server/ShooterGame/Saved/Config/LinuxServer`. Add the following settings within the `[ServerSettings]` section of that file, replacing the "example" passwords with your own:

  {{< file "/home/ark/server/ShooterGame/Saved/Config/LinuxServer/GameUserSettings.ini" >}}
ServerPassword=example
ServerAdminPassword=example

{{< /file >}}


`ServerPassword` determines the password that users will be required to enter when connecting to your server. You can omit this line to allow access without a password. `ServerAdminPassword` specifies the administrative password that will be used when issuing [game commands](http://ark.gamepedia.com/Console_Commands).

{{< note >}}
If you choose to use the `ServerPassword` option, when connecting to the server you will need to click on **Show Password Protected**, or manually add the server to your favorites list. Both options are shown in the next section.
{{< /note >}}

A number of options can be configured within this file - for more information take a look at the [Server Configuration](http://ark.gamepedia.com/Server_Configuration#GameUserSettings.ini) section of the ARK wiki.

## Connect the Game Client to Your ARK Server

You can connect to your new ARK server using two different methods. Because the game is currently in pre-release and under heavy development, some functionality may change or work intermittently. While finding your server from within the game itself is often easier, it's not always reliable (as of this guide's publication), so we'll also go over how to add it to your favorite servers in the Steam client.

### In-Game Server List

1.  On your local computer, open the ARK: Survival Evolved game client. Click on **JOIN ARK**:

    [![The ARK: Survival Evolved Main Menu](/docs/assets/ark-menu-small.png "The ARK: Survival Evolved Main Menu")](/docs/assets/ark-menu.png "The ARK: Survival Evolved Main Menu")

2.  As the server list populates, you can filter the results using the **Server Name Filter** field (1). You must also select *UnOfficial* from the **Server Filter** field (2). If you've password-protected your ARK server, you must also check the **Show Password Protected** box (3):

    [![The ARK: Survival Evolved Server List](/docs/assets/ark-server-list-small.png "The ARK: Survival Evolved Server List")](/docs/assets/ark-server-list.png "The ARK: Survival Evolved Server List")

3.  Select your server, and click **Join**. If your server is password-protected, you'll be prompted to enter the password.

### Steam Server Favorites
1.  Open the Steam application on your local machine, select the **File** (or **View** on OS X) menu and navigate to **Servers**.

2.  Under **FAVORITES** select **ADD A SERVER** and direct Steam to connect to your Linode's IP address or domain name:

    [![Steam Add Server](/docs/assets/ark-add-server-small.png)](/docs/assets/ark-add-server.png)

3.  Once Steam identifies your ARK server, it should appear in the **SERVERS** list. Choose your server and hit **CONNECT**:

    [![Steam Servers](/docs/assets/ark-servers-small.png)](/docs/assets/ark-servers.png)

    Alternately, you can select **Favorites** from the **Server Filter** in the in-game server list:

    [![ARK: Survival Evolved Favorites List](/docs/assets/ark-favorites-list-small.png "ARK: Survival Evolved Favorites List")](/docs/assets/ark-favorites-list.png "ARK: Survival Evolved Favorites List")

4.  If you've created a server password in your `GameUserSettings.ini` file, enter it here:

    ![ARK Server Password](/docs/assets/ark-password.png)

    Or if you are using the in-game menu, enter the server password here:

    [![ARK: Survival Evolved Server Password Prompt](/docs/assets/ark-server-password-small.png "ARK: Survival Evolved Server Password Prompt")](/docs/assets/ark-server-password.png "ARK: Survival Evolved Server Password Prompt")


Congratulations! You can now explore the world of ARK in your own persistent server.

[![ARK: Survival Evolved Gameplay](/docs/assets/ark-gameplay-small.png "ARK: Survival Evolved Gameplay")](/docs/assets/ark-gameplay.png "ARK: Survival Evolved Gameplay")
