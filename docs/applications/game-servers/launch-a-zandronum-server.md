---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Zandronum is a client-server multiplayer fork of the highly extensible GZDoom source port. This guide shows you how to set up a server on your Linode.'
keywords: 'zandronum,doom,gaming'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Weekday, Month 00th, 2015'
modified: Weekday, Month 00th, 2015
modified_by:
  name: Linode
title: 'Launch a Zandronum server on your Linode'
contributor:
  name: Sean Baggaley
  link: https://github.com/csnxs
  external_resources:
- '[Zandronum](https://zandronum.com)'
- '[Command Line Parameters (Zandronum Wiki)](http://wiki.zandronum.com/Command_Line_Parameters)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

{: .note}
>
>This guide was written for Zandronum 2.1.2. For newer versions, installation will be the same, but if you're using the tar archives, you will have to replace the version in the URL.

This guide will show you how to set up your own [Zandronum](http://zandronum.com) server on any Linode running a Linux-based operating system.

## Before You Begin

1. You **need** a valid Doom IWAD. `doom2.wad` is recommended as it is the most common, and most mods and maps depend upon it.

2. Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

3. This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

4. Update your system.
  **Debian/Ubuntu**
        sudo apt-get update && sudo apt-get upgrade
  **Arch Linux**
        sudo pacman -Syu
  **CentOS**
        sudo yum update

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


## Secure Your Server

### Firewall
Now see our [Securing Your Server](/docs/security/securing-your-server) guide again and complete the section on iptables for your Linux distribution **using the rulesets below**:

#### IPv4
Zandronum does not support IPv6 as of yet. Add this rule to your iptables:

    iptables -A INPUT -p udp --dport 10666:10700

This allows clients to access ports 10666 (Zandronum's default port) to 10700.

### Zandronum User
For security (and for your directories to be a little more organised), it is recommended you use a seperate user for Zandronum.
See the [Add a limited user account](/docs/security/securing-your-server#add-a-limited-user-account) section of the Securing Your Server guide, and create a user called `zandronum`.

After creating the account, change into it, and create your directories:

    sudo su - zandronum
    mkdir ~/bin
    mkdir ~/wads
    mkdir ~/iwads

If you plan on creating more than one server, create these too:

    mkdir -p ~/servers/configs
    mkdir -p ~/servers/scripts

Now exit the `zandronum` user:

    exit

 Upload your IWADs to /home/zandronum/iwads/ using your preferred method of file transfer.

## Install Dependencies
Zandronum requires OpenSSL and zlib. This guide also uses `wget` on non-Debian distributions.

### Debian/Ubuntu
    sudo apt-get install openssl zlib

#### Arch Linux
    sudo pacman -S --needed openssl zlib wget
The `--needed` parameter ensures you don't uselessly install the packages again if you already have them installed.


## Download Zandronum
### Debian/Ubuntu
A semi-official package repository is provided by [DRDTeam](http://drdteam.org). To add it, execute these commands:

    sudo add-apt-repository 'deb http://debian.drdteam.org/ stable multiverse'
    wget -O - http://debian.drdteam.org/drdteam.gpg | sudo apt-key add -

Update your package databases:

    sudo apt-get update

Install the Zandronum server package:

    sudo apt-get install zandronum-server

### Other Distributions
Switch user to `zandronum`:

    sudo su - zandronum

Change to your `bin` directory, where you'll store the Zandronum binaries:

    cd ~/bin

Use `wget` to download the Zandronum binary archives:

**64-bit:** `wget https://zandronum.com/downloads/zandronum2.1.2-linux-x86_64.tar.bz2`

**32-bit:** `wget https://zandronum.com/downloads/zandronum2.1.2-linux-x86.tar.bz2`

Extract the archive:
`tar -xvf zandronum2.1.2-linux-x86*.tar.bz2`

Add your `bin` dir to your `PATH`:
`export PATH=$PATH:$HOME/bin && echo "export PATH=$PATH:$HOME/bin" >> ~/.profile`

## Run the Zandronum server
For a basic Doom 2 co-operative server called *My Linode Powered Server* on port 10666, run this command:

    zandronum-server \
    -iwad $HOME/iwads/doom2.wad \
    -port 10666 \
    +sv_hostname "My Linode Powered Server"

{: .note}
>
> The **iwad** parameter specifies the IWAD being used. Usually, you'll want this to be `doom2.wad`.<br />
> The **port** parameter specifies your server's port.<br />
> The **sv_hostname** parameter specifies the hostname of the server which will be broadcast to server browsers. Notice that this starts with a plus (`+`), instead of a dash (`-`). This means that this is a [console variable](http://wiki.zandronum.com/Console_Variables) (more specifically, a [server variable](http://wiki.zandronum.com/Server_Variables)).<br />
>
> You can read a list of all parameters on the [Zandronum Wiki](http://wiki.zandronum.com/Command_Line_Parameters).
{: .note}

>
> To keep the server running, even when you disconnected from ssh, execute it using [GNU screen](/docs/networking/ssh/using-gnu-screen-to-manage-persistent-terminal-sessions).

It's recommended you make this a shell script and put this into `~/servers/scripts`.

## Configuring your Server
### Global Configuration
This configuration will be applied to every server you own. This is recommended for setting your ban list files, your server contact information and website. Save this to `/home/zandronum/servers/configs/base.cfg`.

```
sv_hostemail "you@domain.tld"

sv_adminlistfile "/home/zandronum/servers/adminlist.txt"
sv_banfile "/home/zandronum/servers/banlist.txt"
sv_banexemptionfile "/home/zandronum/servers/whitelist.txt"
```

### Server Configuration
This configuration will be applied to the individual server that loads it. Save it to something relevantly named in `/home/zandronum/servers/configs/`. In this example it will be named `coop.cfg`.

You can apply any [server variables](http://wiki.zandronum.com/Server_Variables) here. Most configuration will be found in the [DMFlags](http://wiki.zandronum.com/DMFlags) section.

For example, here would be a configuration for a standard Doom 2 co-operative server:
```
// Sets the gamemode
cooperative true

// Sets our server name
sv_hostname "My Linode Powered Server"

// Set the skill level to 'Hurt Me Plenty'
// Skills start at 0 (which is 'I'm Too Young To Die!')
skill 2

//// DMFlags
// This makes weapons stay after being picked up by a player.
sv_weaponstay true
// Disables deathmatch weapons spawning
sv_noweaponspawn true

// Change the map to MAP01
// Changing the map ensures that all settings are set properly.
map MAP01
```

### Start your server with your configurations
Use the `exec` command to execute configuration files:
```
zandronum-server \
+exec /home/zandronum/servers/configs/base.cfg \
+exec /home/zandronum/servers/configs/coop.cfg \
-iwad $HOME/iwads/doom2.wad \
-port 10666 \
+sv_hostname "My Linode Powered Server"
```

### Loading custom data files
You can use the `-file` parameter to load custom data files, like `.wad`s and `.pk3`s.
You can also use `-optfile` to load optional data files, like high-quality music packs.
```
zandronum-server \
+exec $HOME/servers/configs/base.cfg \
-iwad $HOME/iwads/doom2.wad \
-file $HOME/wads/my_map_pack.wad \
-optfile $HOME/wads/my_hq_music.pk3
```

## What now?
You should now know the basics of starting a Zandronum server. Feel free to repeat this for as many servers as you want to host.

Don't forget to read up on the [Zandronum Wiki](http://wiki.zandronum.com), which answers basically every question you may have:
 - [Server variables](http://wiki.zandronum.com/Server_Variables)
 - [Game modes](http://wiki.zandronum.com/Game_Modes)
 - [Moderating game servers](http://wiki.zandronum.com/Moderating_Game_Servers)
