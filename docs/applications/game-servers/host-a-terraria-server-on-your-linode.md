---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Terraria is a two-dimensional sandbox game similar to Minecraft that allows players to explore, build, and battle in an open world. This guide will outline everything required to run a Terraria server for yourself or others to play on'
keywords: 'terraria,steam,minecraft,gaming'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Monday, December 21st, 2015'
modified: Wednesday, January 6th, 2016
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

Due to Terraria's system requirements, **a Linode 2048 plan is the minimum required** to ensure the server has enough RAM to function. If your Linode does not meet Terraria's minimum requirements, the process will crash intermittently. If you already have a 1 GB Linode, it is possible to resize it to a larger plan. See our guide [Resizing a Linode](/docs/migrate-to-linode/disk-images/resizing-a-linode) for more info.


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the *Configure a Firewall* section yet--this guide includes firewall rules specifically for a Terraria server.

3.  Update your operating system's packages.

    **CentOS**

        sudo yum update

    **Debian / Ubuntu**

        sudo apt-get update && sudo apt-get upgrade


## Configure a Firewall

Now see our [Securing Your Server](/docs/security/securing-your-server) guide again and complete the section on iptables for your Linux distribution **using the rulesets below**:

### IPv4

~~~
*filter

# Allow all loopback (lo0) traffic and reject traffic
# to localhost that does not originate from lo0.
-A INPUT -i lo -j ACCEPT
-A INPUT ! -i lo -s 127.0.0.0/8 -j REJECT

# Allow ping.
-A INPUT -p icmp -m state --state NEW --icmp-type 8 -j ACCEPT

# Allow SSH connections.
-A INPUT -p tcp -m state --state NEW --dport 22 -j ACCEPT

# Allow connections from Terraria clients.
-A INPUT -p tcp --dport 7777 -j ACCEPT

# Allow inbound traffic from established connections.
# This includes ICMP error returns.
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Log what was incoming but denied (optional but useful).
-A INPUT -m limit --limit 3/min -j LOG --log-prefix "iptables_INPUT_denied: " --log-level 7
-A FORWARD -m limit --limit 3/min -j LOG --log-prefix "iptables_FORWARD_denied: " --log-level 7

# Reject all other inbound.
-A INPUT -j REJECT
-A FORWARD -j REJECT

COMMIT
~~~

###IPv6

Terraria currently supports multiplayer only over IPv4, so a Terraria server needs only basic IPv6 firewall rules.

~~~
*filter

# Allow all loopback (lo0) traffic and reject traffic
# to localhost that does not originate from lo0.
-A INPUT -i lo -j ACCEPT
-A INPUT ! -i lo -s ::1/128 -j REJECT

# Allow ICMP
-A INPUT -p icmpv6 -m state --state NEW -j ACCEPT

# Allow inbound traffic from established connections.
-A INPUT -m state --state ESTABLISHED -j ACCEPT

# Reject all other inbound.
-A INPUT -j REJECT
-A FORWARD -j REJECT

COMMIT
~~~


## Install and Configure Terraria

Check [Terraria news](http://terraria.org/news) to get the latest version, which is 1.3.0.8 at the time of this writing.

1.  Download the Terraria tarball to `/tmp`:

        sudo wget -P /tmp http://terraria.org/server/terraria-server-linux-1308.tar.gz

2.  Extract the archive and set its permissions:

        sudo tar xvzf /tmp/terraria-server-linux-1308.tar.gz -C /opt
        sudo chown -R root:root /opt/terraria*
        sudo find /opt/terraria* -type f -print0 | sudo xargs -0 chmod a+r
        sudo find /opt/terraria* -type d -print0 | sudo xargs -0 chmod a+rx

3.  Create a link to access the game files with a path that is easier to remember for future steps:

        sudo ln -s /opt/terraria-server-linux-1308 /opt/terraria

4.  Running daemons under discrete users is a good practice. Create a `terraria` user to run the game server as:

        sudo useradd -r -m -d /srv/terraria terraria

5.  Terraria can be configured to automatically create a world and start the server without any manual intervention. You can use several [server options](http://terraria.gamepedia.com/Server#Server_config_file) to customize settings such as difficulty, server passwords, and so on.

    The options given below will automatically create and serve `MyWorld` when the game server starts up. Note that you should change `MyWorld` to a world name of your choice.

    {: .file}
    /srv/terraria/config.txt
    :   ~~~ ini
        autocreate=1
        worldname=MyWorld
        world=/srv/terraria/Worlds/MyWorld.wld
        worldpath=/srv/terraria/Worlds
        ~~~


## Managing the Terraria Service

### Screen

Terraria, like many other game servers, runs an interactive console as part of its server process. While useful, accessing this console can be challenging when operating game servers under service managers. The problem can be solved by running Terraria in a [Screen](https://www.gnu.org/software/screen/) session that will enable you to send arbitrary commands to the listening admin console within Screen.

Install Screen with the system's package manager.

**CentOS**

    sudo yum install screen

**Debian / Ubuntu**

    sudo apt-get install screen

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
    ExecStart=/usr/bin/screen -dmS terraria /bin/bash -c "/opt/terraria/TerrariaServer -autoarch -config /srv/terraria/config.txt"
    ExecStop=/usr/local/bin/terrariad exit

    [Install]
    WantedBy=multi-user.target
    ~~~

*   **ExecStart** instructs systemd to spawn a Screen session containing `TerrariaServer` which starts the daemon and sets `KillMode=none` to ensure that systemd does not prematurely kill the server before it has had a chance to cleanly save and close down the server.

*   **ExecStop** calls a script to send the `exit` command to Terraria, which the server will recognize and ensure that the world is saved before shutting down. To do this, a script is needed to send arbitrary commands to the running `TerrariaServer` instance, which will be written next.

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
● terraria.service - server daemon for terraria
   Loaded: loaded (/etc/systemd/system/terraria.service; disabled)
   Active: inactive (dead)
user1@localhost:~$ sudo systemctl start terraria
user1@localhost:~$ sudo systemctl status terraria
● terraria.service - server daemon for terraria
   Loaded: loaded (/etc/systemd/system/terraria.service; disabled)
   Active: active (running) since Thu 2015-12-10 21:02:54 UTC; 1s ago
  Process: 12462 ExecStart=/usr/bin/screen -dmS terraria /bin/bash -c /opt/terraria/TerrariaServer -autoarch -config /srv/terraria/config.txt (code=exited, status=0/SUCCESS)
 Main PID: 12463 (screen)
   CGroup: /system.slice/terraria.service
           ├─12463 /usr/bin/SCREEN -dmS terraria /bin/bash -c /opt/terraria/TerrariaServer -autoarch -config /srv/terraria/config.txt
           ├─12464 /bin/bash /opt/terraria/TerrariaServer -autoarch -config /srv/terraria/config.txt
           └─12469 ./TerrariaServer.bin.x86_64 -autoarch -config /srv/terraria/config.txt
~~~

###Stop the Server

If you ever need to shut down Terraria, run the command:

    sudo systemctl stop terraria

That will save the world and shut down the game server.

###Attach to the Console

In the course of running your server, you may need to attach to the console to do things like kick players or change the message of the day. To do so, use the `terrariad` script:

    sudo terrariad attach

You'll enter the Terraria server console. Type `help` to get a list of commands. Once you're done, use the keyboard shortcut **CTRL+A** then **D** to detach from the screen session and leave it running in the background. Screen recognizes many different keyboard shortcuts so refer to the documentation on its [default key bindings](http://www.gnu.org/software/screen/manual/html_node/Default-Key-Bindings.html#Default-Key-Bindings) for more information.