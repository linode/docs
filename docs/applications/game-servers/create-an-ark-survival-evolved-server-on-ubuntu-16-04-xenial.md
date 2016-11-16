---
author:
  name: Nick Brewer
  email: docs@linode.com
description: 'A basic ARK server installation guide for Ubuntu 16.04'
keywords: 'ark survival evolved, ubuntu, server'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
external_resources:
 - '[PlayARK.com](http://www.playark.com/)'
 - '[The Official ARK Survival Evolved Wiki](http://ark.gamepedia.com/ARK_Survival_Evolved_Wiki)'
modified: Friday, November 11th, 2016
modified_by:
  name: Nick Brewer
published: 'Friday, November 11th, 2016'
title: 'Create an ARK Survival Evolved Server on Ubuntu 16.04 (Xenial)'
---

This guide will show you how to set up a personal [ARK Survival Evolved](http://www.playark.com/) server on a Linode running Ubuntu 16.04 LTS.

{: .note}
> The steps in this guide require root privileges unless otherwise noted. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

##Before you Begin

1.  To connect to your ARK server, you must have a copy of the [ARK](http://www.playark.com/) game client.

2.  In keeping with the [system requirements](http://ark.gamepedia.com/Dedicated_Server_Setup#Hardware) for an ARK server, we recommend using our **Linode 8192** plan or higher when following these steps.

1.  Update your Linode's software:

        apt-get update && apt-get upgrade

2.  Install **SteamCMD**, the Steam command line interface:

        apt-get install steamcmd

    During the installation process, you will be prompted to agree to the Steam License Agreement. Select **I Agree** and hit **Ok** to accept the terms of the agreement.

3.  For security reasons, you'll create a separate `ark` user to run your server application. Take note of the password you assign:

        adduser ark

##Adjust Your System Settings

1.  Run the following command to increase the allowed number of open files:

        echo "fs.file-max=100000" >> /etc/sysctl.conf && sysctl -p

2.  Update the hard and soft file limits by running:

        echo "* soft nofile 1000000" >> /etc/security/limits.conf
        echo "* hard nofile 1000000" >> /etc/security/limits.conf

3.  Enable PAM limits by issuing this command:

        echo "session required pam_limits.so" >> /etc/pam.d/common-session

##Install your ARK Server

1.  Switch your session to that of the `ark` user, and create a `server` directory that will contain your ARK server files:

        su - ark
        mkdir server

2.  Create a symlink from `/usr/games/steamcmd` to `steamcmd` in the `ark` user's home directory:

        ln -s /usr/games/steamcmd steamcmd

3.  Run `steamcmd` with the following options to install the ARK server:

        steamcmd +login anonymous +force_install_dir /home/ark/server +app_update 376030 +quit


##Create a Systemd Unit for your ARK Server

1.  Next you'll create a systemd unit so that the ARK server can be started automatically on reboot. Switch back to your root user session by running:

        su -

2.  Create a new systemd service file with the text editor of your choice:

        nano /lib/systemd/system/ark.service

3.  Add the following values to your `ark.service` file. Fill in the `SessionName` with the name you'll use to identify your ARK server:

    {: .file }
    /lib/systemd/system/ark.service
    :   ~~~
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
        ~~~

4.  Save the file and update systemd to apply your changes:

        systemctl daemon-reload

5.  Enable your new systemd unit and start your ARK server:

        systemctl enable ark.service
        systemctl start ark

## Configure your ARK Server

Once you've started the server, you can add or remove settings by editing the `GameUserSettings.ini` file under `/home/ark/server/ShooterGame/Saved/Config/LinuxServer`. Add the following settings within the "Server Settings" section of that file, replacing the "example" passwords with your own:

  {: .file }
  /home/ark/server/ShooterGame/Saved/Config/LinuxServer/GameUserSettings.ini
  :   ~~~
      ServerPassword=example
      ServerAdminPassword=example
      ~~~

`ServerPassword` determines the password that users will be required to enter when connecting to your server. You can omit this line to allow access without a password. `ServerAdminPassword` specifies the administrative password that will be used when issuing [game commands](http://ark.gamepedia.com/Console_Commands).

There are a number of options that can be configured within this file - for more information take a look at the [server configuration](http://ark.gamepedia.com/Server_Configuration#GameUserSettings.ini) section of the ARK wiki.

##Connect the Game Client to Your ARK Server

1.  Open the Steam application on your local machine, select the **File** menu and navigate to **Servers**.

2.  Select **Add A Server** and direct Steam to connect to your Linode's IP address or DNS entry on port `27015`:

    [![Steam Add Server](/docs/assets/ark-add-server-small.png)](/docs/assets/ark-add-server.png)

3.  Once Steam identifies your ARK server, it should appear in the Servers window. Choose your server and hit **Connect**:

    [![Steam Servers](/docs/assets/ark-servers-small.png)](/docs/assets/ark-servers.png)

4.  If you've created a server password in your `GameUserSettings.ini` file, enter it here:

    ![ARK Server Password](/docs/assets/ark-password.png)

    Congratulations! You can now explore the world of ARK in your own persistent server.
