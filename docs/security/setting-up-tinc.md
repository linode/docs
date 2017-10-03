---
author:
  name: Linode Community
  email: docs@linode.com
description: 'The guide details how to set up TINC VPN on your Linode.'
keywords: 'VPN,tinc,mesh-type network,security'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'September 30, 2017'
modified: ''
modified_by:
  name: Linode
title: 'How to Set Up Tinc, a Peer-to-Peer VPN'
contributor:
  name: Damaso Sanoja
external_resources:
 - '[tinc Project](https://www.tinc-vpn.org/)'

---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $300 per published guide.*
<hr>
## What Kind of VPN is tinc?

Virtual Private Networks (VPN) are an essential part of any serious security-wise network deployment. There are many open-source VPN options, but one of them shines among the others: *tinc*. While each VPN behaves as a secure tunnel between two points, tinc separates from the rest because of its "peer-to-peer" design. What that means for you is a great deal of flexibility, especially if you are planning a mesh-type network.

This guide will describe how to configure tinc VPN in three different use-case scenarios, from the simpler two-server connection to the more complex mesh private-network.

## Before You Begin

1.  Complete the [Getting Started](/docs/getting-started) guide.

2.  Follow the [Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access and remove unnecessary network services.

    This guide will use `sudo` wherever possible. Please ensure you have access to privileged user rights.

3.  Update your packages:

		sudo apt update && sudo apt upgrade
		sudo yum update

{: .note}
>
>In order to focus on a *tinc* configuration alone, three assumptions are being made in this guide:
>1. There are no active firewalls on any server.
>2. Each server is connected directly to the internet (no router or proxy is involved).
>3. Each server is running the same tinc version.

## The Most Basic Setup: Two Node tinc VPN

A typical use case is a web-based invoicing software where the database should be on a separate server (for security and disaster recovery purposes) and needs to communicate sensitive data to the application server through the internet.

This first use-case for *tinc* is a very simple setup involving only two instances:

![Two Node VPN](/docs/assets/tinc-two-node.png)

Let's call them Application Server *(appserver)* and Database Server *(dbserver)*, respectively. Each one resides in its own Linode. But for this example, their physical location is not important.

### Gathering Network Information

Before getting started, it's a good idea to create a "cheat-sheet" with the necessary network information, like Public IPv4 address for both servers, desired VPN address for each instance, VPN network name designation, and tinc-daemon name for each node. Finding the public IPv4 address is a simple task from your Linode Manager (use the Remote Access tab); but if you prefer to use the terminal, one way to find it is using `dig`:

		dig +short myip.opendns.com @resolver1.opendns.com

Remember to run the `dig` command from each server console. Next, identify the VPN address, which can be any arbitrary private network value. The only rule to follow (if you want to avoid extra routing work) is that each VPN address must have the **same network prefix**, just like a typical LAN. 

Regarding VPN and daemon names, they must be unique and cannot contain any space or special symbol. For this basic use-case, the following information will be used for tinc configuration:

![Two node VPN cheat-sheet](/docs/assets/tinc-2-node-cheat-sheet.jpg)

### Install tinc VPN on CentOS 7 and Ubuntu 16.04

At the time of this writing the latest stable version of tinc is 1.0.31. Both the CentOS and Ubuntu servers should run the same tinc version, which means the installation approach will be different. For CentOS 7, the procedure is as follows:

1. Enable EPEL repository:

        sudo yum install wget -y
        wget http://dl.fedoraproject.org/pub/epel/7/x86_64/e/epel-release-7-10.noarch.rpm
        rpm -ivh epel-release-7-10.noarch.rpm

2. Install tinc software and dependencies:

        sudo yum install tinc -y

Now for the database server running Ubuntu 16.04, you will need to build the package because the supplied tinc version is older.

1. Install the necessary dependencies for building tinc:

        sudo apt install build-essential automake libssl-dev liblzo2-dev libbz2-dev zlib1g-dev

2. Get the latest version of tinc from developer's site:

        wget http://tinc-vpn.org/packages/tinc-1.0.31.tar.gz

3. Extract the archive into a temporary folder:

        tar -xf tinc-1.0.31.tar.gz

4. Compile tinc in your system:

        cd tinc-1.0.31
        ./configure --prefix=
        make
        sudo make install

### Create a VPN Working Directory

You can implement as many tinc networks as you need as long as you create a unique working directory for each one (e.g., gaming VPN, backups VPN). The name of the folder must match the designated name for your VPN, in this case, *linodeVPN*. You also need to use the same structure across the servers, that means you need to create the working directory on both:

        sudo mkdir -p /etc/tinc/linodeVPN/hosts

### Create Configuration Files

You must set up a "main" configuration file `tinc.conf` on each server. The default location for this file is the root of the working directory. Let's start with the Application Server file:

{: .file}
/etc/tinc/linodeVPN/tinc.conf
:   ~~~ conf
	Name = appserver                 
	Device = /dev/net/tun           
	AddressFamily = ipv4 
	~~~

* `Name` - This is daemon-specific name within the VPN. It should be unique.
* `Device` - Determines the virtual network to use; tinc will automatically detect what kind of device is being used.
* `AddressFamily` - Tell tinc which type of address to use.

Now you need to generate the database server configuration file:

{: .file}
/etc/tinc/linodeVPN/tinc.conf
:   ~~~ conf
	Name = dbserver                 
	Device = /dev/net/tun           
	AddressFamily = ipv4
	ConnectTo = appserver 
	~~~

`ConnectTo` - This value points to the tinc daemon with which you want to connect. When it is not present (like in the previous file), tinc enters in listening mode, waiting for connections.

{: .note}
>
>You can customize tinc behavior with many other parameters available within the configuration file. For more information, visit the [tinc documentation](https://www.tinc-vpn.org/documentation/tinc.conf.5).

It's now time to create the "hosts" configuration files. Because tinc is built using a peer-to-peer model, each node needs to know about the others. The basic host file for the application server is:

{: .file}
/etc/tinc/linodeVPN/hosts/appserver
:   ~~~ conf
	Address = 11.11.11.11
	Subnet = 192.168.100.209 
	~~~

In a similar way, create a host file for the database server:

{: .file}
/etc/tinc/linodeVPN/hosts/dbserver
:   ~~~ conf
	Address = 22.22.22.22
	Subnet = 192.168.100.130 
	~~~

Your host files are almost complete. Now, it's only necessary to add the public key of each node. Fortunately, tinc can create the key pair using the following command:

        sudo tincd -n linodeVPN -K 4096

For this example you use 4096-bit encryption, and can choose a higher level if necessary. Save both keys `rsa_key.pub` and `rsa_key.priv` in the root of your working directory `/etc/tinc/linodeVPN`. 

The next step is to append the `rsa_key.pub` at the end of each host file.

From the application server run the command:

        sudo bash -c "cat /etc/tinc/linodeVPN/rsa_key.pub >> /etc/tinc/linodeVPN/hosts/appserver"

Now, from the databases server run a similar command:

        sudo bash -c "cat /etc/tinc/linodeVPN/rsa_key.pub >> /etc/tinc/linodeVPN/hosts/dbserver"

### Create VPN Control Scripts

Control scripts are responsible for setting up the virtual interfaces on each server. They are needed on both servers.

From the application server, you want to create the following file to enable the tinc interface:

{: .file}
/etc/tinc/linodeVPN/tinc-up
:   ~~~ conf
	#!/bin/sh
	ip link set $INTERFACE up                                       
	ip addr add 192.168.100.209 dev $INTERFACE                      
	ip route add 192.168.100.0/24 dev $INTERFACE  
	~~~

Still from application server, create the script to disable the interface:

{: .file}
/etc/tinc/linodeVPN/tinc-down
:   ~~~ conf
    #!/bin/sh
    ip route del 192.168.100.0/24 dev $INTERFACE
    ip addr del 192.168.100.209 dev $INTERFACE
    ip link set $INTERFACE down  
	~~~

A similar procedure, creating a file for enabling the virtual interface, will be used for the database server:

{: .file}
/etc/tinc/linodeVPN/tinc-up
:   ~~~ conf
    #!/bin/sh
    ip link set $INTERFACE up                                       
    ip addr add 192.168.100.130 dev $INTERFACE                      
    ip route add 192.168.100.0/24 dev $INTERFACE  
	~~~

And another script needs to be created to shut it down:

{: .file}
/etc/tinc/linodeVPN/tinc-down
:   ~~~ conf
    #!/bin/sh
    ip route del 192.168.100.0/24 dev $INTERFACE
    ip addr del 192.168.100.209 dev $INTERFACE
    ip link set $INTERFACE down  
	~~~

After creating the control scripts, you will need to change the permissions accordingly (on both servers):

        sudo chmod -v +x /etc/tinc/linodeVPN/tinc-{up,down}

### CentOS 7 and Ubuntu 16.04 tinc Unit

In order to run tinc as a service on startup, you will need to set up the proper unit file for each server.

On the application server (CentOS 7):

{: .file}
/etc/systemd/system/tinc.service
:   ~~~ conf
	[Unit]
	Description=Tinc net linodeVPN
	After=network.target

	[Service]
	Type=simple
	WorkingDirectory=/etc/tinc/linodeVPN
	ExecStart=/usr/sbin/tincd -n linodeVPN -D -d3
	ExecReload=/usr/sbin/tincd -n linodeVPN -kHUP
	TimeoutStopSec=5
	Restart=always
	RestartSec=60

	[Install]
	WantedBy=multi-user.target ~~~

On the database server (Ubuntu 16.04):

{: .file}
/etc/systemd/system/tinc.service
:   ~~~ conf
	[Unit]
	Description=Tinc net linodeVPN
	After=network.target

	[Service]
	Type=simple
	WorkingDirectory=/etc/tinc/linodeVPN
	ExecStart=/sbin/tincd -n linodeVPN -D -d3
	ExecReload=/sbin/tincd -n linodeVPN -kHUP
	TimeoutStopSec=5
	Restart=always
	RestartSec=60

	[Install]
	WantedBy=multi-user.target ~~~

{: .note}
>
>For the unit file, a debug level of "3" was chosen in the `tincd` command. This will log all requests from other daemons and include some authentication interchange between them. For more information about debug levels, please read [tincd documentation](https://www.tinc-vpn.org/documentation/tincd.8).

### Host Files Interchange

Up to this point, you have all configuration files created on each server. Because of tinc P2P nature, the final step is to exchange host files between nodes. There are many ways to accomplish this. For the purpose of this guide, we will use `scp`.

From `appserver`

        scp /etc/tinc/linodeVPN/hosts/appserver <user>@<dbserver>:/tmp/
        ssh -t <user>@<dbserver> sudo mv -v /tmp/appserver /etc/tinc/linodeVPN/hosts/

From `dbserver`

        scp /etc/tinc/linodeVPN/hosts/dbserver <user>@<appserver>:/tmp/
        ssh -t <user>@<appserver> sudo mv -v /tmp/dbserver /etc/tinc/Two/hosts/

### Tinc Testing

It is time to test your newly configured VPN. From the application server, start the `tincd` daemon:

        sudo tincd -n linodeVPN -D -d3

And now from database server, do the same:

        sudo tincd -n linodeVPN -D -d3

If everything goes as planned, you should see an output similar to this:

![VPN output](/docs/assets/appserver-dbserver-output.jpg)

You can open another terminal (i.e., from `appaserver`) and check active interfaces:

        sudo ip a

You should have at least three interfaces, one of them your `linodeVPN`.

Another quick test you can perform is to `ping` the database server from the application server using its VPN address:

        ping 192.168.100.130

If you encounter errors during your testing you can always add this flag to your daemon command:

        sudo tincd -n --logfile[=FILE] linodeVPN -D -d5

### Finish Your tinc Configuration

Once you have your tinc VPN ready, you can enable the service on startup:

        sudo systemctl enable tinc.service

Now, you can start, stop, restart and check the service using common `systemd` syntax.

        sudo systemctl status tinc.service

## Deploy a Three Node tinc Mesh Network

This topology can be considered as a variant of the first example, where a high-traffic application requires separate instances for better scalability, optimized resources, and faster response (asynchronous processing).

For the purpose of this section, we will use the following use-case scenario:

![Three Node VPN](/docs/assets/tinc-three-node.png)

In the interest of showcasing tinc's easy expandability, we will assume that **LINODE 1** and **LINODE 2** are the very same application server and database server you just configured.

The "Cheat-Sheet" for this topology is:

![Three node cheat-sheet](/docs/assets/tinc-3-node-cheat-sheet.jpg)

Let's start with the new web server. Follow the previously explained steps to install tinc VPN and create its working directory. The main configuration file for this instance would be:

{: .file}
/etc/tinc/linodeVPN/tinc.conf
:   ~~~ conf
	Name = webserver                 
	Device = /dev/net/tun           
	AddressFamily = ipv4
	ConnectTo = appserver
	ConnectTo = dbserver 
	~~~

Please note that this server uses the `ConnectTo` directive to look for the other two daemons right away.

According to the cheat-sheet, its host file should be as follows:

{: .file}
/etc/tinc/linodeVPN/hosts/webserver
:   ~~~ conf
	Address = 33.33.33.33
	Subnet = 192.168.100.140 
	~~~

For the encryption keys, lets increase the security level:

        sudo tincd -n linodeVPN -K 8192

Once again, you need to append the public key to the host file:

        sudo bash -c "cat /etc/tinc/linodeVPN/rsa_key.pub >> /etc/tinc/linodeVPN/hosts/webserver"

As for the control scripts, they would be:

{: .file}
/etc/tinc/linodeVPN/tinc-up
:   ~~~ conf
	#!/bin/sh
	ip link set $INTERFACE up                                       
	ip addr add 192.168.100.140 dev $INTERFACE                      
	ip route add 192.168.100.0/24 dev $INTERFACE  
	~~~


{: .file}
/etc/tinc/linodeVPN/tinc-down
:   ~~~ conf
    #!/bin/sh
    ip route del 192.168.100.0/24 dev $INTERFACE
    ip addr del 192.168.100.140 dev $INTERFACE
    ip link set $INTERFACE down  
	~~~

Remember to change permissions:

        sudo chmod -v +x /etc/tinc/linodeVPN/tinc-{up,down}

Since this server uses Ubuntu 16.04, its unit file is identical to that of your database server.

{: .file}
/etc/systemd/system/tinc.service
:   ~~~ conf
	[Unit]
	Description=Tinc net linodeVPN
	After=network.target

	[Service]
	Type=simple
	WorkingDirectory=/etc/tinc/linodeVPN
	ExecStart=/sbin/tincd -n linodeVPN -D -d3
	ExecReload=/sbin/tincd -n linodeVPN -kHUP
	TimeoutStopSec=5
	Restart=always
	RestartSec=60

	[Install]
	WantedBy=multi-user.target ~~~

Just like the previous section, this last step is to exchange host files between all nodes. So, you will need to copy the application and database servers' host files to the webserver and webserver's host file.

This last step makes a slight modification to the `tinc.conf` file on `appserver` and `dbserver`. The new configuration files need to tell tinc to look for other nodes:

On the application server:

{: .file}
/etc/tinc/linodeVPN/tinc.conf
:   ~~~ conf
	Name = appserver                 
	Device = /dev/net/tun           
	AddressFamily = ipv4
	ConnectTo = dbserver
	ConnectTo = webserver 
	~~~

On the database server:

{: .file}
/etc/tinc/linodeVPN/tinc.conf
:   ~~~ conf
	Name = dbserver                 
	Device = /dev/net/tun           
	AddressFamily = ipv4
	ConnectTo = appserver
	ConnectTo = webserver 
	~~~

As you can see, adding a new node to a tinc VPN is very easy. Once you get a hold of configuration files, the rest is simple.

## Using tinc for Centralized Cloud Interconnection

This setup illustrates a use-case where regional branches need to interact with an application running in the headquarters, e.g., a centralized inventory management software.

In this final use-case example, you will configure a VPN with four LINODE servers, each of which is in a different geographic location.

![Centralized Cloud VPN](/docs/assets/tinc-four-node.png)

The cheat sheet in this case is:

![Centralized VPN cheat-sheet](/docs/assets/tinc-4-node-cheat-sheet.jpg)

After the previous two sections, you should be familiar with the configuration procedure:

1. Install tinc VPN on each node.
2. Create VPN working directory on each node.
3. Create `tinc.conf` and host files on every node.
4. Create VPN control scripts for all tinc instances.
5. Create Unit files.
6. Interchange host files across all nodes.
7. Enable tinc Unit(s)

The configuration file, `tinc.conf` on LINODE 1, 2 and 3, should point only to LINODE HQ (`ConnectTo`). On the other hand, the configuration file on LINODE HQ should define connections with all nodes, using the same directive. The corresponding config files are:

On remote server 1:
{: .file}
/etc/tinc/linodeVPN/tinc.conf
:   ~~~ conf
	Name = linode1                 
	Device = /dev/net/tun           
	AddressFamily = ipv4
	ConnectTo = linodeHQ
	~~~

On remote server 2:
{: .file}
/etc/tinc/linodeVPN/tinc.conf
:   ~~~ conf
	Name = linode2                 
	Device = /dev/net/tun           
	AddressFamily = ipv4
	ConnectTo = linodeHQ
	~~~

On remote server 3:
{: .file}
/etc/tinc/linodeVPN/tinc.conf
:   ~~~ conf
	Name = linode3                
	Device = /dev/net/tun           
	AddressFamily = ipv4
	ConnectTo = linodeHQ
	~~~

And finally, on the central server:

{: .file}
/etc/tinc/linodeVPN/tinc.conf
:   ~~~ conf
	Name = linodeHQ                 
	Device = /dev/net/tun           
	AddressFamily = ipv4
	ConnectTo = linode1
	ConnectTo = linode2
	ConnectTo = linode3
	~~~
