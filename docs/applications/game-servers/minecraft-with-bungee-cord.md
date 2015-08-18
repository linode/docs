---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Linking your Minecraft servers together using BungeeCord on your Linode with Ubuntu/Debian'
keywords: 'minecraft,spigot,bungeecord,link,bukkit,25565'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
external_resources:
 - '[Minecraft.net](https://minecraft.net/)'
 - '[The Official Minecraft Wiki](http://minecraft.gamepedia.com/Minecraft_Wiki)'
 - '[Official BungeeCord Site](https://www.spigotmc.org/wiki/bungeecord/)'
 - '[BungeeCord and Spigot Forums](https://www.spigotmc.org/)'
published: 'Tuesday, August 18th, 2015'
modified: Tuesday, August 18th, 2015
modified_by:
    name: linode
title: 'Setting up BungeeCord to link Spigot servers'
contributor:
    name: Thomas Wemyss
    link: https://github.com/twemyss
---

## Introduction

After you’ve got a Minecraft server up and running with [our article on setting up a Minecraft server with Spigot on Debian and Ubuntu](/docs/applications/game-servers/minecraft-with-spigot-ubuntu), you’ll naturally want to experiment and grow. At some point, you’re likely to want to connect different servers, with different collections of plugins, together, so that your players can simply connect to one address, yet also access a wider variety of activities than can be easily set up on a single Minecraft server instance.

BungeeCord acts as a proxy between the Minecraft Client and the server, and allows for simple and easy switching between your Spigot Servers.

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Setting up your Linode

For the purposes of this tutorial, you'll be creating another Linode to run BungeeCord. This helps to keep it separate from your other servers, and allows you to hide the IP of any back-end services.

We will assume that the IP of the Linode you're going to install BungeeCord on is `203.0.113.0`, and there are 2 Spigot servers, with the IP addresses `203.0.113.112` and `203.0.113.198`.

### Updating and installing prerequisite software

On the Linode that is going to host BungeeCord, you will need to carry out 4 steps prior to the installation.

1. Firstly, let's ensure the system is up to date, and update the package lists.

	sudo apt-get update && sudo apt-get upgrade

2. If you haven't already installed Java, you will need to install OpenJDK JRE, an open source Java environment.

	sudo apt-get install openjdk-7-jre-headless

3. Next, you should install GNU Screen. This allows BungeeCord to run in the background, even when you're not connected to SSH.

	sudo apt-get install screen

4. Finally, you may create another user for the BungeeCord proxy to be run as, so that it doesn't have the same privileges as your user. You'll need to keep this password for future reference.

	sudo adduser bungeecord

### Configuring the firewall on the BungeeCord node

If you're using iptables or ufw to act as a firewall, you'll need to make a rule on the Linode running BungeeCord, to permit tcp on port 25565.

This can be done by running

	sudo iptables -A INPUT -p tcp --dport 25565 -j ACCEPT

{: .caution}
>
>If improperly configured, you may lose SSH access to your Linode. If you don't save your iptables rules, then restarting the Linode from Linode manager should allow access. However, if you use `iptables-persistent` or save the rules in accordance with our [Securing Your Server](/docs/security/securing-your-server/) guide, you may not regain access. In this case, you can revert the saved rules by booting into [rescue mode](/docs/troubleshooting/rescue-and-rebuild) and deleting the iptables rules by running `rm /etc/iptables.firewall.rules`.

### Configuring the firewall on the Linodes that run your Spigot servers

For BungeeCord, the Spigot servers need to be in offline mode, as the BungeeCord proxy handles the authentication. This can make them vulnerable to people connecting directly, as they can connect with any username, potentially allowing for connection as a user with adminsitrative permissions.

To prevent this, you can set up `iptables` to limit connections to only the BungeeCord server.

{: .note}
>
> This section assumes that you've only got a Spigot server running on each Linode. If you have other services, you'll need to modify the rules to allow them to continue working.

1. Firstly, you will need to delete existing rules and then allow SSH. If you've changed your SSH port, make sure to change the `22` below

	sudo iptables -F
	sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

2. Now, you should limit the connections on port 25565 (TCP) to the IP of the BungeeCord Linode, `203.0.113.0`. You will need to change this for your system.

	sudo iptables -A INPUT -p tcp -s `203.0.113.0` --dport 25565 -j ACCEPT

3. If you're running other Spigot servers on the same Linode, then you will need to run step 2 again, but changing `25565` to the port of the other servers.

4. You must now allow loopback traffic through the firewall.

	sudo iptables -A INPUT -i lo -j ACCEPT
	sudo iptables -A OUTPUT -o lo -j ACCEPT

5. To finish, you will need to allow outgoing connections to work, and then drop all other packets.

	sudo iptables -I INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
	sudo iptables -A INPUT -j DROP

{: .note }
> If you've configured your `iptables` firewall by following our [Securing Your Server](/docs/security/securing-your-server/) tutorial, then you will need to append the exceptions in steps 1, 2 and 3 to `/etc/iptables.firewall.rules` to ensure that they're persistent between reboots.

## Installing BungeeCord

You'll now need to log into the VPS as the `bungeecord` user that you created earlier, and download BungeeCord with the following command. 

	wget -O BungeeCord.jar http://ci.md-5.net/job/BungeeCord/lastSuccessfulBuild/artifact/bootstrap/target/BungeeCord.jar

{: .note}
>
> This downloads the latest version of BungeeCord. You can find older versions, for older Minecraft server versions, [here](http://ci.md-5.net/job/BungeeCord/)

### Setting up BungeeCord

Now that you've got BungeeCord downloaded, there are a few steps that need to be taken before it's ready to use.

1. To get started, you must start BungeeCord up, allowing it to generate the configuration files.

	java -jar BungeeCord.jar


After the prompt `[INFO] Listening on /0.0.0.0:25577` is displayed in the console, type `end` and press Enter.

2. You now need to edit `config.yml`. 

	nano config.yml

You should replace the section of theconfiguration that says `host: 0.0.0.0:25577` to `host: 0.0.0.0:25565` as this is the default port that the Minecraft Client attempts to connect to. 

The next stage is to edit the following block of the configuration, in order to add our existing Spigot servers.

	servers:
	  lobby:
	    address: localhost:25565
	    restricted: false
	    motd: '&1Just another BungeeCord - Forced Host'

For the servers that are specified as examples in the introduction, it would look as follows.

        servers:
          lobby:
            address: 203.0.113.112:25565
            restricted: false
            motd: '&1Just another BungeeCord - Forced Host'
	  games:
	    address: 203.0.113.198:25565
	    restricted: false
	    motd: '&1Just another BungeeCord - Forced Host'

Each server block has a label, in the case of the example `lobby` or `games`. These can be any word you want, but it's important that they are descriptive, as they will be used by the players to change server.

So that players can recognise your server more easily in their server list, you can set a custom message. Change the line that says `motd: '&1Another Bungee server'` and put your custom message between the quotes. You can use Minecraft Colour codes here.

To allow for UUIDs to be correct in the Spigot servers, you should also ensure that you set `ip_forward` to `true`. 

Finally, you need to set the default server for players who connect. You can do this by replacing the `lobby` in the line that says `default_server: lobby` with the label for your server.

You can now press `Control+O` and `Control+X` to save and exit.
 
### Running BungeeCord

{: .file}
/home/bungeecord/bungeestart.sh
:   ~~~ shell
	#!/bin/bash	

	screen -dmS "bungeecord" java -jar BungeeCord.jar
    ~~~

After you've created the file above, simply run `chmod +x bungeestart.sh`.

Then, when you want to start your server, run `./bungeestart.sh`

To connect to the server console, you can run the following:

	screen -r bungeecord

Whenever you want to detach from the console, press `Control-A` followed by `Control-D`

## Configuring your Spigot servers for BungeeCord

In the directory where you've got your Spigot server, you'll need to do the following:

	nano spigot.yml

Change `bungeecord: false` to `bungeecord: true`.

Then, you need to switch the server to offline mode.

	nano server.properties

Here, you should change `online-mode=true` to `online-mode=false`.

Now, just restart the servers.

## Switching between servers without reconnecting

Connect to your BungeeCord address in Minecraft, and run `/server name` where `name` is the name you configured in the BungeeCord config.yml file.

It's that simple!

To see who is online on any of the BungeeCord servers that you've linked, you can run

	/glist

## Troubleshooting

If your setup is working, then there's no need to read this section! You can get on with enjoying your server.

### Help, I can't connect in Minecraft!

If you've got an issue connecting, then it's important to check that the login servers are up. These quite frequently come under attack, so you'll need to check if you can access other servers. If you can, and you're using the right version of Minecraft, there are some simple steps that you can follow to isolate the problem.

### Isolating the issue

[![Server Ping](/docs/assets/ping.png)](/docs/assets/ping.png)

If the server shows the MOTD and a ping in the server list of your client as per the image above, it's likely that the problem lies between BungeeCord and your Spigot servers.

To check, you can log into your BungeeCord server, and you'll most likely see a line similar to the following in the logs, where the IP `198.51.100.0` is replaced by your IP. This shows that your client is successfully pinging the BungeeCord server.

	00:20:34 [INFO] [/198.51.100.0:50677] <-> InitialHandler has connected

In that case, you're most likely getting the following error:

[![Backend connection error](/docs/assets/connection.png)](/docs/assets/connection.png)

This indicates that Bungee couldn't contact your Spigot servers, so there are a few steps you should take:

1. Ensure that the settings in the BungeeCord config.yml are correct, especially the server IP addresses and ports. If not, edit them to correct the mistake, and restart BungeeCord.
2. If the settings are correct, then you may want to change the default server to another of the Spigot servers, in case the problem is isolated to only one, and then restart BungeeCord to try again.
3. If the problem continues, then you'll need to check the Spigot configs to ensure you've configured them for BungeeCord as detailed above.
4. If the problem still occurs, it's likely to be with the firewall on your Spigot servers. You can try running `iptables -F` to clear the rules. You can now test connecting without any firewall, to see if that was causing the issue. As soon as possible after this, you should reconfigure the firewall as above.

### Resolving inability to ping in server list

In other cases, the server won't even show a response in the server list.

[![BungeeCord connection error](/docs/assets/noping.png)](/docs/assets/noping.png)

If this happens, you should check that BungeeCord is actually running, and that you're attempting to connect to the correct IP address. In our example, it would be `203.0.113.0`.

Assuming that the issue is not solved, the issue is likely to be the firewall. You can flush your firewall walls with

	iptables -F

You should try again to reconnect. If you can connect now, then you'll need to reconfigure the firewall as detailed above.

## More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.