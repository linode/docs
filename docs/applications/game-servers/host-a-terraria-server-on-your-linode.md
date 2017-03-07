---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Terraria is a two-dimensional sandbox game similar to Minecraft that allows players to explore, build, and battle in an open world. This guide will outline everything required to run a Terraria server for yourself or others to play on'
keywords: 'terraria,steam,minecraft,gaming'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Monday, December 21st, 2015'
modified: Tuesday, March 7th, 2017
modified_by:
  name: Linode
title: 'Host a Terraria Server on Your Linode'
contributor:
  name: Tyler Langlois
  link: https://github.com/tylerjl
external_resources:
 - '[Terraria Wiki](http://terraria.gamepedia.com/Terraria_Wiki)'
 - '[Terraria Wiki: Server](http://terraria.gamepedia.com/Server)'
 - '[Terraria Wiki: Setting up a Terraria Server](http://terraria.gamepedia.com/Guide:Setting_up_a_Terraria_server)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*
<hr>

[Terraria](https://terraria.org/) is a two-dimensional sandbox game similar to [Minecraft](https://minecraft.net/) which allows players to explore, build and battle in an open world. The Terraria developers recently announced [support for Linux](http://terraria.org/news/terraria-1-3-0-8-now-for-mac-linux-too), which means that players can host their own standalone Terraria servers as well.

This guide outlines everything required to run a Terraria server for yourself or others to play on, and is compatible with any Linux distribution that uses systemd. This includes recent versions of CentOS, Debian and Ubuntu, Arch Linux and Fedora.

Due to Terraria's system requirements, a Linode with at least two CPU cores and adequate RAM is required. For this reason, we recommend using our 4GB plan or higher when following this guide. If your Linode does not meet Terraria's minimum requirements, the process will crash intermittently.


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the *Configure a Firewall* section yet--this guide includes firewall rules specifically for a Terraria server.

3.  Ensure your operating system's packages are fully updated.


## Configure a Firewall

{:.note}
>
>Terraria does not use IPv6, only IPv4.

### firewalld

firewalld is the default iptables controller in CentOS 7+ and Fedora. See our guide on using firewalld for more info.

1.  Ensure firewalld is enabled and running:

    sudo systemctl enable firewalld && sudo systemctl start firewalld

  You should be using the public zone by default. Verify with:

    sudo firewall-cmd --get-active-zones

2.  Create a firewalld service file for Terraria:

    {: .file}
    /etc/firewalld/services/terraria.xml
    :   ~~~ config
        <?xml version="1.0" encoding="utf-8"?>
        <service>
          <short>Terraria</short>
          <description>Open TCP port 7777 for incoming Terria client connections.</description>
          <port protocol="tcp" port="7777"/>
        </service>
        ~~~

3.  Enable the firewalld service, reload firewalld and verify the Terraria service is being used:

    sudo firewall-cmd --zone=public --permanent --add-service=terraria
    sudo firewall-cmd --reload
    sudo firewall-cmd --zone=public --permanent --list-services

  The output of the last command should be similar to:

    dhcpv6-client ssh terraria


### ufw

ufw is an iptables controller packaged with Ubuntu but it's not installed in Debian by default. 

1.  Install ufw if needed:

    sudo apt install ufw

2.  Add SSH and a rule for Terraria. It's important you add rules before enabling ufw. If you don't, you'll terminate your SSH session and will need to access your Linode using [Lish](https://www.linode.com/docs/networking/using-the-linode-shell-lish/).

    sudo ufw allow ssh
    sudo ufw allow 7777/tcp

3.  Only after your rules are added, enable ufw. Then remove the Terraria rule for IPv6 since it's not needed.

    sudo ufw enable
    sudo ufw delete 4





### iptables

If you wish to use only iptables with no controller, see our [iptables guide](https://www.linode.com/docs/security/firewalls/control-network-traffic-with-iptables) for a general ruleset.

1.  You'll also want to add the rule below for Terraria:

    sudo iptables -A INPUT -p tcp --dport 7777 -j ACCEPT

2.  Verify with:

    sudo iptables -L


## Install and Configure Terraria

1.  Change your working directory to `/opt` and download the Terraria tarball. You'll need to check [Terraria's website](http://terraria.gamepedia.com/Server#How_to_.28Linux.29) for the current release version. Right-click and copy the link to use with `curl` or `wget`. At the time of this writing, the current version is 1.3.3.3 so that is what will be used in this guide.
 
        cd /opt && curl -O http://terraria.org/server/terraria-server-1333.zip

2. You will need the `unzip` utility to decompress the .zip file. Install it using your distribution's package manager:

        sudo apt install unzip

        sudo yum install unzip

3.  Extract the archive and set the necessary permissions:
 
        sudo unzip terraria-server-1333.zip
        sudo mv /opt/Dedicated\ Server/Linux /opt/terraria
        sudo rm -rf Dedicated\ Server/
        sudo chown -R root:root /opt/terraria
        sudo chmod +x /opt/terraria/TerrariaServer.bin.x86_64

4.  Running daemons under discrete users is a good practice. Create a `terraria` user to run the game server as:

        sudo useradd -r -m -d /srv/terraria terraria

5.  Terraria has a server configuration file which can be edited with settings such as automatically creating a world, server passwords and other options shown [here](http://terraria.gamepedia.com/Server#serverconfig). Create a copy of the default file so you have something to revert back to if you run into problems.

    sudo mv /opt/terraria/serverconfig.txt /opt/terraria/serverconfig.txt.bak


    Then create a new server configuration file for yourself. The options below will automatically create and serve `MyWorld` when the game server starts up. Note that you should change `MyWorld` to a world name of your choice.

    {: .file}
    /opt/terraria/serverconfig.txt
    :   ~~~ ini
        world=/srv/terraria/Worlds/MyWorld.wld
        autocreate=1
        worldname=MyWorld
        worldpath=/srv/terraria/Worlds
        ~~~


## Managing the Terraria Service

### Screen

Terraria runs an interactive console as part of its server process. While useful, accessing this console can be challenging when operating game servers under service managers. The problem can be solved by running Terraria in a [Screen](https://www.gnu.org/software/screen/) session that will enable you to send arbitrary commands to the listening admin console within Screen.

Install Screen with the system's package manager:

**CentOS**

    sudo yum install screen

**Debian / Ubuntu**

    sudo apt install screen

### systemd

It's useful to have an automated way to start, stop, and bring up Terraria on boot. This is important if the system restarts unexpectedly. This guide will manage the Terraria service using a systemd service file to define how to start and stop the server.

Create the following file to define the `terraria` systemd service:

{: .file}
/etc/systemd/system/terraria.service
:   ~~~ ini
    [Unit]
    Description=server daemon for terraria

    [Service]
    Type=forking
    User=terraria
    KillMode=none
    ExecStart=/usr/bin/screen -dmS terraria /bin/bash -c "/opt/terraria/TerrariaServer.bin.x86_64 -config /opt/terraria/serverconfig.txt"
    ExecStop=/usr/local/bin/terrariad exit

    [Install]
    WantedBy=multi-user.target
    ~~~

*   **ExecStart** instructs systemd to spawn a Screen session containing the 64 bit `TerrariaServer` binary, which starts the daemon. `KillMode=none`is used to ensure that systemd does not prematurely kill the server before it has had a chance to cleanly save and shut it down.

*   **ExecStop** calls a script to send the `exit` command to Terraria, which the server will recognize and ensure that the world is saved before shutting down. To do this, a script is needed to send arbitrary commands to the running Terraria instance. This script will be added next.

{: .caution}
>
>This script is intended to save your world in the even you reboot the operating system within the Linode. It is **not** intended to save your progress if you reboot your Linode from the Linode Manager. If you must reboot your Linode, first stop the Terraria service using `sudo systemctl stop terraria`. This will save your world, and then you can reboot from the Linode Manager.

### Scripting Basic Administration of Terraria

Two primary functions are needed for the Terraria administration script:

*   Attaching to the running Screen session, which offers a helpful administration console.
*   The ability to broadcast input into the Screen session so the script can be run to to save the world, exit the server, etc.

1.  Create the following script:

    {: .file}
    /usr/local/bin/terrariad
    :   ~~~
        #!/usr/bin/env bash

        send="`printf \"$*\r\"`"
        attach='script /dev/null -qc "screen -r terraria"'
        inject="screen -S terraria -X stuff $send"

        if [ "$1" = "attach" ] ; then cmd="$attach" ; else cmd="$inject" ; fi

        if [ "`stat -c '%u' /var/run/screen/S-terraria/`" = "$UID" ]
        then
                $cmd
        else
                su - terraria -c "$cmd"
        fi
        ~~~

2.  Ensure the script can be executed:

        sudo chmod +x /usr/local/bin/terrariad

This script permits you to attach to the console, or send it commands like `save` or `exit` while it's running without needing to attach at all (useful when services like systemd need to send server commands.)

{: .note }
>
>Throughout the rest of this guide, you may encounter "command not found" errors when running the `terrariad` command. This may result from the directory `/usr/local/bin/` not being found in the `$PATH` when running sudo commands, which can occur with some Linux distributions. You can work around this problem by calling the script with the full path. For example, instead of running `sudo terrariad attach`, use `sudo /usr/local/bin/terrariad attach`.


## Running Terraria

###Start and Enable the Server

With the game server installed, scripts written and the service ready, the server can be started with a single command:

    sudo systemctl start terraria

The first run of the server must generate the world defined earlier, so give it time before trying to connect. You can use `sudo terrariad attach` to watch the world generation progress and see when the server is ready to accept players.

In addition to starting and stopping the `terraria` service, systemd can also use the service file created earlier to automatically start Terraria on boot.

To enable the service at startup:

    sudo systemctl enable terraria

If the operating system is restarted for any reason, Terraria will launch itself on reboot.

###Server Status

To check if the server is running, use the command:

    sudo systemctl status terraria

The output should be similar to:

~~~
● terraria.service
   Loaded: loaded (/etc/systemd/system/terraria.service; disabled)
   Active: active (running) since Tue 2017-03-07 17:37:03 UTC; 7s ago
  Process: 31143 ExecStart=/usr/bin/screen -dmS terraria /bin/bash -c /opt/terraria/TerrariaServer.bin.x86_64 -config /opt/terraria/serverconfig.txt (code=exited, status=0/SUCCESS)
 Main PID: 31144 (screen)
   CGroup: /system.slice/terraria.service
           ├─31144 /usr/bin/SCREEN -dmS terraria /bin/bash -c /opt/terraria/TerrariaServer.bin.x86_64 -config /opt/terraria/serverconfig.txt
           └─31145 /opt/terraria/TerrariaServer.bin.x86_64 -config /opt/terraria/serverconfig.txt
~~~

###Stop the Server

If you ever need to shut down Terraria, run the command:

    sudo systemctl stop terraria

That will save the world and shut down the game server.

###Attach to the Console

In the course of running your server, you may need to attach to the console to do things like kick players or change the message of the day. To do so, use the `terrariad` script:

    sudo terrariad attach

You'll enter the Terraria server console. Type `help` to get a list of commands. Once you're done, use the keyboard shortcut **CTRL+A** then **D** to detach from the screen session and leave it running in the background. Screen recognizes many different keyboard shortcuts so refer to the documentation on its [default key bindings](http://www.gnu.org/software/screen/manual/html_node/Default-Key-Bindings.html#Default-Key-Bindings) for more information.
