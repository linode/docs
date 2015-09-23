---
author:
  name: James Stewart
  email: jstewart@linode.com
description: 'Installing McMyAdmin for Minecraft on Debian.'
keywords: 'minecraft,mcmyadmin,debian,debian jessie,debian wheezy,jessie,wheezy'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Friday August 28th, 2015
modified_by:
  name: James Stewart
published: 'Thursday, February 5th, 2015'
title: Installing McMyAdmin for Minecraft on Debian
external_resources:
 - '[McMyAdmin Home Page](https://mcmyadmin.com/)'
 - '[McMyAdmin Settings Reference](http://wiki.cubecoders.com/wiki/3/mcmyadmin-settings-reference)'
---

[McMyAdmin](https://mcmyadmin.com/) is one of the most popular Minecraft server control panels available. It boasts compatibility with third party mods, heavy focus on security and a sleek web interface for managing your server. This guide covers the installation and configuration of a new McMyAdmin server on a Linode running Debian 7 or 8. Be aware that to actually play on a Minecraft server you must also have the game client from [minecraft.net](https://minecraft.net/).

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides. Do **not** complete the *Creating a Firewall* section of Securing Your Server. This guide has a step specifically for firewall rules for a Minecraft server.

2.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

### Remove Unnecessary Network Services

By default, Debian installs with listening services for [Exim4](https://en.wikipedia.org/wiki/Exim), [NFS](https://en.wikipedia.org/wiki/Network_File_System) components, SSH and time synchronization (see `sudo netstat -tulpn`). SSH is necessary to adminster your server and timekeeping is important, but if Exim and NFS are not needed, they should be uninstalled to eliminate listening network services and reduce attack surface.

1.  Exim:
    
        sudo systemctl stop exim4.service
        sudo systemctl disable exim4.service

2.  `rpc-bind` and `rpc.statd` are needed for NFS. Reboot after disabling `rpcbind`:
    
        sudo systemctl stop rpcbind.service
        sudo systemctl disable rpcbind.service

    {: .note }
    >
    >If you do plan to use NFS on your Linode, see [our NFS guide](/docs/networking/basic-nfs-configuration-on-debian-7) to get started.

Run `sudo netstat -tulpn` again. You should now only see listening services for SSH (sshd) and NTP (ntpdate, network time protocol).

{: .note }
>
>NTPdate can be replaced with [OpenNTPD](https://en.wikipedia.org/wiki/OpenNTPD) (`sudo apt-get install openntpd`) if you prefer a time synchronization daemon which does not listen on all interfaces and you do not require nanosecond accuracy.

If you want to later re-enable either service:

    sudo systemctl enable service_name.service
    sudo systemctl start service_name.service

To remove either package:

	sudo apt-get purge service_name

### Configure the Firewall

1.  See our [Securing Your Server](/docs/security/securing-your-server/) guide and complete the section on iptables for Debian **using the below ruleset**:

    {: .file}
    Firewall Rules
    :   ~~~
        *filter
    
        # Allow all loopback (lo0) traffic
        # and drop all traffic to 127/8 that doesn't use lo0
        -A INPUT -i lo -j ACCEPT
        -A INPUT -d 127.0.0.0/8 -j REJECT
    
        # Allow SSH connections
        -A INPUT -p tcp -m state --state NEW --dport 22 -j ACCEPT
    
        # Allow pings
        -A INPUT -p icmp --icmp-type echo-request -j ACCEPT
    
        # Allow connections from other Minecraft clients
        -A INPUT -p tcp --dport 25565 -j ACCEPT
        
        # Allow web access to McMyAdmin
        -A INPUT -p tcp -m tcp --dport 8080 -j ACCEPT
    
        # Accept all established inbound connections
        -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
    
        # Log iptables denied calls
        -A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 7
    
        # Deny all other inbound traffic.
        -A INPUT -j REJECT
        -A FORWARD -j DROP
    
        COMMIT
        ~~~

2.  By default, both McMyAdmin and Minecraft operate on IPv4, but unlike a default Minecraft server installation, McMyAdmin does not listen for incoming IPv6 traffic. Since Minecraft can not use both protocols simultaneously, IPv4 is usually chosen over IPv6 because of its much greater availablity; thus, including players whose ISPs or hardware don't support IPv6.

	If you choose not to use IPv6 on your Minecraft server, you should disable it by adding the following lines to `/etc/sysctl.d/99-sysctl.conf`:
    
    {: .file-excerpt}
    /etc/sysctl.d/99-sysctl.conf
    :   ~~~
    	net.ipv6.conf.all.disable_ipv6 = 1
    	net.ipv6.conf.default.disable_ipv6 = 1
    	net.ipv6.conf.lo.disable_ipv6 = 1
    	net.ipv6.conf.eth0.disable_ipv6 = 1
        ~~~

	To activate the changes immediately:

    	sudo sysctl -p

	Then, go into `/etc/hosts` and comment out the line for IPv6 resolution over localhost:

	{: .file-excerpt}
	/etc/hosts
	:   ~~~ conf
	    #::1 localhost.localdomain localhost
	    ~~~

3.  Although we just disabled IPv6 in the kernel, we'll tell iptables to drop IPv6 traffic as an additional security layer:

		sudo ip6tables -F INPUT DROP
		sudo ip6tables -F FORWARD DROP
		sudo ip6tables -F OUTPUT DROP

3.  Run `iptables-persistent` to save the iptables rulesets:

		sudo dpkg-reconfigure iptables-persistent

	When asked to save current rules, choose `yes` for both IPv4 and IPv6.

##Install Prerequisite Software

1.  Install the Java Runtime Environment, OpenJDK:

		sudo apt-get install openjdk-7-jre

2.  [Mono](http://www.mono-project.com/). CubeCoders Limited, the company behind McMyAdmin, packages its own minimal installation of Mono with some necessary source and configuration files. This must be used instead of the generic Mono packages from Debian's repositories.

		cd /usr/local
		sudo wget http://mcmyadmin.com/Downloads/etc.zip
		sudo unzip etc.zip; sudo rm etc.zip

##Install and Start McMyAdmin

This section should be completed as your standard user, **not** as root. McMyAdmin will then install to `/home/username`.

1.  Create the installation directory and change location to it.

		mkdir ~/mcmyadmin && cd ~/mcmyadmin

2.  Download the McMyAdmin installer. You will want to double check its [Download](https://www.mcmyadmin.com/#/download) page to be sure you're grabbing the latest version.

		wget http://mcmyadmin.com/Downloads/MCMA2_glibc26_2.zip

3.  Extract the archive and delete the original zip file.

		unzip MCMA2_glibc26_2.zip; rm MCMA2_glibc26_2.zip

4.  Start the initial configuration of McMyAdmin. Replace `PASSWORD` with a strong password which you want for admin access to McMyAdmin's web interface.

		./MCMA2_Linux_x86_64 -setpass PASSWORD -configonly

	This will return the output:

		The updater will download and install McMyAdmin to the current directory:
		/home/your_user/mcmyadmin).

		Continue? [y/n] :

	Answer `y`. The installer will run and return you to the command prompt. If everything is as it should be, the only warning you'll see will be for a missing configuration file. As the output says, that would be normal since McMyAdmin was just started for the first time.

5.  Install screen, if it is not already installed.

		sudo apt-get install screen

6.  Start a screen session for the McMyAdmin client.

		screen -S mcma

7.  Change into the McMyAdmin installation directory and start the program.

		cd ~/mcmyadmin; ./MCMA2_Linux_x86_64

	If successful, the last three lines of the output will be:

		Notice	: McMyAdmin has started and is ready for use.
		Notice	: This is the first time McMyAdmin has been started.
		Notice	: You must complete the first-start wizard via the web interface.

	{: .note}
	>
	>To exit McMyAdmin and return to the command line, enter `/quit`.

##Managing your Minecraft Server

1.  Browse to the McMyAdmin web interface by visiting `http://YourLinodeIP:8080`.

2.  Log in with the username `admin` and the password that you provided in the installation step.

	![McMyAdmin Login Page](/docs/assets/mcmyadmin-login-page.png)
	
3.  Once the initial configuration steps are completed, select your settings and then, switch to the status page.

	![McMyAdmin Configuration Page](/docs/assets/mcmyadmin-config-page.png)
	
4.  Select *Start Server* and accept the Minecraft Server EULA.

	![McMyAdmin Status Page](/docs/assets/mymyadmin-status-page.png)

	![McMyAdmin Server Started](/docs/assets/mcmyadmin-server-running.png)

Congratulations, you have now set up a new Minecraft server using McMyAdmin.
