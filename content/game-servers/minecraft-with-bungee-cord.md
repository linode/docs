---
author:
    name: Linode Community
    email: docs@linode.com
description: 'How to link your Minecraft servers together using BungeeCord on your Linode with Ubuntu/Debian'
keywords: ["minecraft", "spigot", "bungeecord", "link", "bukkit", "25565", "minecraft servers", "linking minecraft servers", "how to set up bungeecord"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
 - '[Minecraft.net](https://minecraft.net/)'
 - '[The Official Minecraft Wiki](http://minecraft.gamepedia.com/Minecraft_Wiki)'
 - '[Official BungeeCord Site](https://www.spigotmc.org/wiki/bungeecord/)'
 - '[BungeeCord and Spigot Forums](https://www.spigotmc.org/)'
published: 2015-09-09
modified: 2015-09-09
modified_by:
    name: linode
title: 'How to Set Up BungeeCord to Link Spigot Servers'
contributor:
    name: Thomas Wemyss
    link: https://github.com/twemyss
aliases: ['applications/game-servers/minecraft-with-bungee-cord/']
---

After you’ve got a Minecraft server up and running with [Spigot on Debian and Ubuntu](/docs/game-servers/minecraft-with-spigot-ubuntu), you may want to connect different servers with different collections of plugins. BungeeCord acts as a proxy between the Minecraft client and the server, and allows for simple and easy switching between your Spigot servers. It allows for players to connect to one address, yet also access a wider variety of activities than can be easily set up on a single Minecraft server instance.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Setting Up Your Linode

For the purposes of this tutorial, you will be creating another Debian or Ubuntu Linode to run BungeeCord. This helps to keep it separate from your other servers, and allows you to hide the IP of any back-end services.

We will assume that the IP of the Linode you're going to install BungeeCord on is `203.0.113.0`, and there are two Spigot servers, with the IP addresses `203.0.113.112` and `203.0.113.198`.


### Updating and Installing Prerequisite Software

On the Linode that is going to host BungeeCord:

1.  Update the system:

        sudo apt-get update && sudo apt-get upgrade

2.  If not previously installed, you will need to install OpenJDK JRE, an open source Java environment:

        sudo apt-get install openjdk-7-jre-headless

3.  Install GNU Screen. This allows BungeeCord to run in the background, even when you're not connected to SSH.

        sudo apt-get install screen

4.  Create another user for the BungeeCord proxy, so that it doesn't have the same privileges as your user. You'll need to keep this password for future reference.

	    sudo adduser bungeecord

### Configuring the Firewall on the BungeeCord Node

If you're using iptables or ufw to act as a firewall, you'll need to make a rule on the Linode running BungeeCord, to permit TCP on port 25565. This can be done by running:

	sudo iptables -A INPUT -p tcp --dport 25565 -j ACCEPT


### Configuring the Firewall on the Spigot Server Linodes

For BungeeCord, the Spigot servers need to be in offline mode, as the BungeeCord proxy handles the authentication. This can make the servers vulnerable to people connecting directly, as they can connect with any username, potentially allowing for connection as a user with adminsitrative permissions. To prevent this, you can set up iptables to limit connections to only the BungeeCord server.

{{< note >}}
This section assumes that you've only got a Spigot server running on each Linode. If you have other services, you'll need to modify the rules to allow them to continue working.
{{< /note >}}

1.  Delete existing rules and then allow SSH. If you've changed your SSH port, make sure to change the `22` below:

        sudo iptables -F
        sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

2.  Limit the connections on port 25565 (TCP) to the IP of the BungeeCord Linode, `203.0.113.0`. You will need to change this for your system:

        sudo iptables -A INPUT -p tcp -s `203.0.113.0` --dport 25565 -j ACCEPT

    {{< note >}}
If you're running other Spigot servers on the same Linode, then you will need to run step 2 again, but changing `25565` to the port of the other servers.
{{< /note >}}

3.  Allow loopback traffic through the firewall:

        sudo iptables -A INPUT -i lo -j ACCEPT
        sudo iptables -A OUTPUT -o lo -j ACCEPT

5.  Allow outgoing connections, and then drop all other packets:

        sudo iptables -I INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
        sudo iptables -A INPUT -j DROP

    {{< note >}}
If you've configured your `iptables` firewall by following our [Securing Your Server](/docs/security/securing-your-server/) tutorial, then you will need to append the exceptions in steps 1, 2 and 3 to `/etc/iptables.firewall.rules` to ensure that they're persistent between reboots.
{{< /note >}}

## Installing BungeeCord

Log into the BungeeCord Linode as the `bungeecord` user created earlier, and download BungeeCord:

	wget -O BungeeCord.jar http://ci.md-5.net/job/BungeeCord/lastSuccessfulBuild/artifact/bootstrap/target/BungeeCord.jar

{{< note >}}
This downloads the latest version of BungeeCord. You can find older versions for older Minecraft server versions, [here](http://ci.md-5.net/job/BungeeCord/).
{{< /note >}}

### Setting up BungeeCord

1.  Start BungeeCord up, allowing it to generate the configuration files:

    	java -jar BungeeCord.jar


    After the prompt `[INFO] Listening on /0.0.0.0:25577` is displayed in the console, type `end` and press Enter.

2.  Edit `config.yml` by replacing the section of the configuration that says `host: 0.0.0.0:25577` to `host: 0.0.0.0:25565` as this is the default port that the Minecraft Client attempts to connect to.

3.  Edit the following block of the configuration, in order to add our existing Spigot servers:

	{{< file-excerpt "config.yml" yaml >}}
servers:
  lobby:
    address: localhost:25565
    restricted: false
    motd: 'Just another BungeeCord - Forced Host'

{{< /file-excerpt >}}


    For the servers that are specified as examples in the introduction, it would look like:

    {{< file-excerpt "config.yml" yaml >}}
servers:
  lobby:
    address: 203.0.113.112:25565
    restricted: false
    motd: 'Just another BungeeCord - Forced Host'
	      games:
 address: 203.0.113.198:25565
 restricted: false
 motd: 'Just another BungeeCord - Forced Host'

{{< /file-excerpt >}}


    Each server block has a label: In the case of the example, `lobby` or `games`. These can be any word you want, but it's important that they are descriptive, as they will be used by the players to change servers.

    So that players can recognise your server more easily in their server list, you can set a custom message. Change the line that says `motd: 'Just another Bungeecord - Forced Host'` and put your custom message between the quotes. You can use Minecraft color codes here.

    To allow for UUIDs to be correct in the Spigot servers, you should also ensure that you set `ip_forward` to `true`.

    Finally, you need to set the default server for players who connect. You can do this by replacing the `lobby` in the line that says `default_server: lobby` with the label for your server.

    Save and exit.

### Running BungeeCord

1.  Create the file:

    {{< file "/home/bungeecord/bungeestart.sh" shell >}}
#!/bin/bash

screen -dmS "bungeecord" java -jar BungeeCord.jar

{{< /file >}}


2.  Run `chmod +x bungeestart.sh`, to make the file executable.

3.  When you want to start your server, run `./bungeestart.sh`.

    To connect to the server console, run:

        screen -r bungeecord

    Whenever you want to detach from the console, press `Control-a` followed by `d`


## Configuring your Spigot servers for BungeeCord

1.  On your Spigot servers, navigate to the Spigot directory and open `spigot.yml`.

2.  Change `bungeecord: false` to `bungeecord: true`. Save and exit.

3.  Open `server.properties`.

4.  Change `online-mode=true` to `online-mode=false`. Save and exit.

5.  Restart the Spigot servers.


## Switching Between Servers Without Reconnecting

Connect to your BungeeCord address in Minecraft, and run `/server name` where `name` is the name you configured in the BungeeCord `config.yml` file. It's that simple!

To see who is online on any of the BungeeCord servers that you've linked, you can run:

	/glist


## Troubleshooting

### Unable to Connect to Minecraft

If there is an issue connecting, then it's important to check that the login servers are up. These quite frequently come under attack, so you'll need to check if you can access other servers. If you can, and you're using the right version of Minecraft, there are some simple steps that you can follow to isolate the problem:


#### Check the Ping

[![Server Ping](/docs/assets/ping.png)](/docs/assets/ping.png)

If the server shows the MOTD and a ping in the server list, as per the image above, it's likely that the problem lies between BungeeCord and your Spigot servers. To check, you can log into your BungeeCord server, and you'll most likely see a line similar to the following in the logs, where the IP `198.51.100.0` is replaced by your IP. This shows that your client is successfully pinging the BungeeCord server:

	00:20:34 [INFO] [/198.51.100.0:50677] <-> InitialHandler has connected

If the logs look similar to above, the following error is likely occurring:

[![Backend connection error](/docs/assets/connection.png)](/docs/assets/connection.png)

This indicates that Bungee couldn't contact your Spigot servers. There are a few steps you can take:

1.  Ensure that the settings in the BungeeCord `config.yml` are correct, especially the server IP addresses and ports. If not, edit them to correct the mistake, and restart BungeeCord.

2.  If the settings are correct, then you may want to change the default server to another of the Spigot servers, in case the problem is isolated to the default. Restart BungeeCord.

3.  If the problem continues, then you'll need to check the Spigot configs to ensure you've configured them for BungeeCord as detailed above.

4.  If the problem still occurs, it's likely to be with the firewall on your Spigot servers. You can try running `iptables -F` to clear the rules. You can now test connecting without any firewall, to see if that was causing the issue. As soon as possible after this, you should reconfigure the firewall as above.

#### Unable to Ping

In other cases, the server won't even show a response in the server list:

[![BungeeCord connection error](/docs/assets/noping.png)](/docs/assets/noping.png)

If this happens, you should check that BungeeCord is actually running, and that you're attempting to connect to the correct IP address. In our example, it would be `203.0.113.0`.

Assuming that the issue is not solved, the issue is likely to be the firewall. You can flush your firewalls with:

	iptables -F

You should try again to reconnect. If you can connect now, then you'll need to reconfigure the firewall as detailed above.