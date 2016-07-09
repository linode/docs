---
author:
  name: Rainbow
  email: rainbow@hacker.horse
description: 'FreeBSD''s advanced security features can be used to safely provide a secured container for hosting game servers, like Minecraft.'
keywords: 'freebsd,bsd,minecraft'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Friday, July, 08, 2016
modified_by:
  name: Rainbow
published: 'Monday, March, 14, 2016'
title: 'Install Minecraft in a FreeBSD Jail'
external_resources:
 - '[The FreeBSD Handbook](https://www.freebsd.org/doc/handbook/)'
 - '[FreeBSD Handbook - Comparing BSD and Linux](https://www.freebsd.org/doc/en/articles/explaining-bsd/comparing-bsd-and-linux.html)'
 - '[FreeBSD Handbook - Linux® Binary Compatibility](https://www.freebsd.org/doc/handbook/linuxemu.html)'
 - '[IOCage](https://iocage.readthedocs.org)'
 - '[FreeBSD Handbook - Jails](https://www.freebsd.org/doc/handbook/jails.html)'

---

## Introduction to FreeBSD

[FreeBSD](https://www.freebsd.org/) is a free and open-source operating system based on the [Berkeley Software Distribution](https://en.wikipedia.org/wiki/Berkeley_Software_Distribution) originally developed at Berkeley Computer Systems Research Group from the late 1970's. BSD originally started as a series of addon programs and tweaks to Bell Labs UNIX, implementing features and new programs like the venerable [vi](https://en.wikipedia.org/wiki/Vi) editor's first release. Today FreeBSD is used all over the world, including in some major video game consoles! While Linux has recently gained notoriety for container support thanks to OpenVZ, LXC, and Docker, FreeBSD has provided a secure container platform since 1999.

{: .caution}
>
>FreeBSD is not officially supported by Linode at this time. This means that the [Linode Backup](/docs/platform/backup-service) service would be unavailable to you and issues with FreeBSD on your Linode would be outside the scope of Linode Support.

## Preparing Your Linode

1.    Begin by creating the Linode and making the changes described in [Install FreeBSD on Linode](https://linode.com/docs/tools-reference/custom-kernels-distros/install-freebsd-on-linode)

2.    Once your Linode is set up, log in. First, we're going to bootstrap pkgng, the FreeBSD binary package installer.
Type pkg at the prompt as root to bootstrap it.

3.    (Optional) Install the sudo package by running #pkg install sudo, and configure sudo via the #visudo command. Otherwise, run the following commands as root.

4.    Install iocage. iocage is a wrapper for the FreeBSD jail(8) command that will automatically handle creation of ZFS datasets for the containers, as well as provide an easy to use syntax to set up networking and set resource restrictions.

5.    Next, we're going to make some configuration changes. We'll be enabling the pf packet filter, creating a cloned loopback interface for the jail private network, and modifying some boot-time options.

Add the following to /boot/loader.conf via your favorite text editor.

     {:.file-excerpt}
     /boot/loader.conf
     : ~~~ conf
      # Tune ZFS ARC since we're on an SSD VM
      vfs.zfs.arc_max=512M
      # Enable kernel resource controls
      kern.racct.enable=1
       ~~~

Add the following to /etc/rc.conf via your favorite text editor.

     {:.file-excerpt}
     /etc/rc.conf
     : ~~~ conf
      # Enable pf packetfilter
      pf_enable="YES"
      # Set pf config location
      pf_rules="/etc/pf.conf"
      # Enable pf log function
      pflog_enable="YES"
      # Set pf log location
      pflog_logfile="/var/log/pflog"
      # Enable cloned interface
      cloned_interfaces="lo1"
      # Set cloned interface IPs. This will set it for 9 IPs, tune to taste
      ipv4_addrs_lo1="172.16.4.1-9/29"
       ~~~

Time to create /etc/pf.conf, which will contain our NAT rules. 
Please make sure to set IP_PUB to your Linode's primary IPv4 Address.
You can add more IP_JAILNAME arguments as well, specifying the jail's private IP address. This will allow you to separate services.

     {:.file-excerpt}
     /etc/pf.conf
     : ~~~ conf
      ### Variables ###

      ## Setting Public IP  and Network##
      IP_PUB="Your Public IP Address Here"
      NET_JAIL="172.16.4.0/29"

      ## JAIL IPS. Follow IP_JAILNAME ##
      IP_MINECRAFTJAIL="172.16.4.2"

      ## RULES ##          
      scrub in all
      # NAT for jails on private net
      nat pass on vtnet0 from $NET_JAIL to any -> $IP_PUB
      # Redirect for Minecraft port
      rdr pass on vtnet0 proto tcp from any to $IP_PUB port 25565 -> $IP_MINECRAFTJAIL
       ~~~

6.   Next, reboot your Linode to apply all the changes we've made so far. Once it's back up, the fun begins.

7.   Run iocage fetch release=10.3-RELEASE
     This will fetch the current (as of this writing) stable release of FreeBSD and create the base datasets.

8.   Time to create the jail! Run the following commands in order:
iocage create tag=servicejail ip4_addr="lo1|172.16.4.2/29" minecraft
iocage set pcpu=30:deny minecraft
iocage set memoryuse=1G:deny minecraft
iocage set rlimits=on minecraft
iocage set quota=5G minecraft
iocage set hostname=minecraft minecraft

pcpu tells iocage to not let the jail exceed 30% of the Linode's CPU. memoryuse sets a 1G limit on the jail's RAM usage.
quota sets a 5 gigabyte disk usage quota, meaning the jail only has a 5Gb disk. Tune these variables to your taste.

9.    Time to start the jail! Run iocage start minecraft. After it starts, run iocage console minecraft. This command drops us into a root shell inside the jail. From now on, any changes you make will only affect the jail.

10.   You should be sitting at the root prompt of a brand new FreeBSD 10.3-RELEASE jail at this point. iocage automatically applies updates when you first create a jail, so no worries about that! The next step is to bootstrap the ports tree, as well as pkgng. That's right, you have to bootstrap pkgng inside the jail too.

Run #pkg to bootstrap pkgng, and then pkg update to update the repository cache.

To install the ports system, run portsnap fetch extract. Ports allows us to compile programs for FreeBSD. pkgng simply provides binary builds of these packages with some sane defaults chosen. If we need to change the defaults like we do here, ports is good to have.

Once ports has extracted, cd to /usr/ports/games/minecraft-server/ and run make config-recursive.
This will let us set compile time options. In the minecraft port, please choose Daemon mode. The others are up to you, I suggest keeping the defaults. Most won't matter, as we'll be installing the dependancies via pkgng to save time.

Next run make all-depends-list | cut -c 12- | xargs pkg install -y
This will install all the dependencies for Minecraft. Once that's done, issue a simple make install clean, to install minecraft!

To ensure minecraft starts when the jail starts, edit /etc/rc.conf and add minecraft_enable="YES" to the bottom.

11. The last step to take is to run /usr/local/openjdk8/bin/java -Xmx1024M -Xms1024M -jar /usr/local/minecraft-server/minecraft_server.jar
This command will launch minecraft for the first time, in interactive mode. Run op <Your Minecraft Username Here> to add yourself as an Operator to the minecraft server. You can close this with ^C, and then run service minecraft start to launch the server for real!

12. Using the minecraft client, connect to the IP address or hostname of your Linode. Since pf is forwarding the minecraft port to the jail, it'll connect just like that! Congrats! You just set up a secured minecraft server on a rock-solid battle-tested operating system.
