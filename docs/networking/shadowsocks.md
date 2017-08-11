---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This tutorial will detail the installation of Shadowsocks-libev, which is a full featured port of Shadowsocks designed to require minimal system resources to operate. '
keywords: 'shadowsocks, proxy, socks, ubuntu, centos'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Tuesday, August 1st, 2017'
modified: Tuesday, August 1st, 2017
modified_by:
  name: Linode
title: Create a SOCKS5 Proxy Server With Shadowsocks on Ubuntu 14.04 and CentOS 7
contributor:
  name: Andrew Lescher
  link: '[Andrew Lescher](https://www.linkedin.com/in/andrew-lescher-87027940/)'
external_resouces:
- '[Google](http://www.google.com)'
---

*This is a Linode Community guide. 

---


Shadowsocks is a lightweight SOCKS5 web proxy tool that is primarily utilized to bypass network censorship and blocking on certain websites and web protocols. A full setup requires a basic Linode VPS server to host the Shadowsocks daemon and a client installed on your personal PC. Unlike other proxy software, Shadowsocks is designed to be indiscernible to third party monitoring tools, and able to disguise itself as a normal direct connection. Data passing through it is also encrypted for additional security and privacy.


## Before You Begin

1. the commands in this guide require root privileges in order to execute. You may work through the guide as-is if you can run the commands under the root account in your system. Alternatively, an elevated user account with sudo privileges can be used as long as each command is prefixed with `sudo`. If two commands are presented in the same instance (seperated by `&&`), you must prefix each command with `sudo` (ex. `sudo [command] && sudo [command]`).

2. A working firewall is a necessary security measure. Firewall instructions will be presented for UFW, FirewallD, and Iptables. Steps for setting up UFW can be found at [How to Configure a Firewall with UFW](/docs/security/firewalls/configure-firewall-with-ufw). FirewallD instructions are located at [Introduction to FirewallD on CentOS](/docs/security/firewalls/introduction-to-firewalld-on-centos).

#### Shadowsocks Server Installation

The first stage of a Shadowsocks setup is installing the server daemon on a Linux VPS. This guide will present instructions for the Ubuntu 17.04 and CentOS 7 distributions.

## Download Source Code and Dependencies

Update system and download and install dependencies:

**Ubuntu 17.04**
 
    apt-get update && apt-get upgrade -yuf
    apt-get install -y --no-install-recommends gettext build-essential autoconf libtool libpcre3-dev asciidoc xmlto libev-dev libudns-dev automake libmbedtls-dev libsodium-dev git python-m2crypto

**CentOS 7**

    yum update && yum upgrade -y
    yum install epel-release -y
    yum install -y gcc gettext autoconf libtool automake make pcre-devel asciidoc xmlto udns-devel libev-devel libsodium-devel mbedtls-devel git m2crypto

 Navigate to the `/opt` directory and download the Shadowsocks git module:

    
    git clone https://github.com/shadowsocks/shadowsocks-libev.git
    cd shadowsocks-libev
    git submodule update --init --recursive

 Install Shadowsocks-libev:

        ./autogen.sh
        ./configure
        make && make install


## Configure Shadowsocks

1. Create a new system user for Shadowsocks.

    **Ubuntu 17.04**

        adduser --system --no-create-home --group shadowsocks

     **CentOS 7**

	    adduser --system --no-create-home -s /bin/false shadowsocks


2. Create a new directory for the configuration file.


        mkdir -m 755 /etc/shadowsocks


3. Create the Shadowsocks config file. Copy the contents listed below into the file, noting the instructions in the **shadowsocks.json Breakdown** table for each property. Follow these instructions to determine the value you should set.


		vim /etc/shadowsocks/shadowsocks.json


## shadowsocks.json Breakdown


{: .table .table-striped .table-bordered}
 |  **Property**  | **Explanation** | **Possible Values** |
 |:----------:|:-----------:|:---------------:|
 | server | Enter your server's public IP address here. | User determined |
 | server_port | Shadowsocks will listen on this port. Use the default value of 8388. | User determined |
 | local_address | Local listening address. Use your loopback address, 127.0.0.1. | Loopback address |
 | local_port | Local listening port. Use the default value of 1080. | User determined |
 | password | Connection password. Set a strong password here. | User determined |
 | timeout | Connection timeout, in seconds. The default value should be sufficient here. | User determined |
 | method | Encryption method. Using AEAD algorithms is recommended. | See [Stream Ciphers](https://shadowsocks.org/en/spec/Stream-Ciphers.html) and [AEAD Ciphers](https://shadowsocks.org/en/spec/AEAD-Ciphers.html) |
 | fast_open | Reduces latency when turned on. Can only be used with kernel versions 3.7.1 or higher. Execute this command to check your kernel version: `umame -r`. | true, false |



{: .file}
**/etc/shadowsocks/shadowsocks.json**
: ~~~ json
  {
      "server":"192.0.0.1",
      "server_port":8388,
      "local_address": "127.0.0.1",
      "local_port":1080,
      "password":"mypassword",
      "timeout":300,
      "method":"aes-256-gcm",
      "fast_open": true
  }
  ~~~


## Optimize Shadowsocks

Apply the following optimizations to your system kernel to provide for a smooth running Shadowsocks installation.

1. Create the system optimization file. Copy and paste the contents shown below into your file.

{: .caution}
> These settings provide the optimal kernel configuration for Shadowsocks. If you have previously configured your system kernel settings for any reason, make sure no conflicts exist.


	vim /etc/sysctl.d/local.conf


{: .file}
**/etc/sysctl.d/local.conf**
: ~~~ conf
  # max open files
  fs.file-max = 51200
  # max read buffer
  net.core.rmem_max = 67108864
  # max write buffer
  net.core.wmem_max = 67108864
  # default read buffer
  net.core.rmem_default = 65536
  # default write buffer
  net.core.wmem_default = 65536
  # max processor input queue
  net.core.netdev_max_backlog = 4096
  # max backlog
  net.core.somaxconn = 4096

  # resist SYN flood attacks
  net.ipv4.tcp_syncookies = 1
  # reuse timewait sockets when safe
  net.ipv4.tcp_tw_reuse = 1
  # turn off fast timewait sockets recycling
  net.ipv4.tcp_tw_recycle = 0
  # short FIN timeout
  net.ipv4.tcp_fin_timeout = 30
  # short keepalive time
  net.ipv4.tcp_keepalive_time = 1200
  # outbound port range
  net.ipv4.ip_local_port_range = 10000 65000
  # max SYN backlog
  net.ipv4.tcp_max_syn_backlog = 4096
  # max timewait sockets held by system simultaneously
  net.ipv4.tcp_max_tw_buckets = 5000
  # turn on TCP Fast Open on both client and server side
  net.ipv4.tcp_fastopen = 3
  # TCP receive buffer
  net.ipv4.tcp_rmem = 4096 87380 67108864
  # TCP write buffer
  net.ipv4.tcp_wmem = 4096 65536 67108864
  # turn on path MTU discovery
  net.ipv4.tcp_mtu_probing = 1

  # for high-latency network
  # net.ipv4.tcp_congestion_control = hybla

  # for low-latency network, use cubic instead
  net.ipv4.tcp_congestion_control = cubic
  ~~~


2. Apply optimizations.


        sysctl --system


### Create a Shadowsocks Systemd Service

Creating a systemd service for Shadowsocks allows the daemon to be automatically started on system boot and ran in the background.

1. Create a systemd file. Copy and paste the following content into your file with `vi /etc/systemd/system/shadowsocks.service`


{: .file}
**/etc/systemd/system/shadowsocks.service**
: ~~~ service
  [Unit]
  Description=Shadowsocks proxy server

  [Service]
  User=root
  Group=root
  Type=simple
  ExecStart=/usr/local/bin/ss-server -c /etc/shadowsocks/shadowsocks.json -a shadowsocks -v start
  ExecStop=/usr/local/bin/ss-server -c /etc/shadowsocks/shadowsocks.json -a shadowsocks -v stop

  [Install]
  WantedBy=multi-user.target
  ~~~

2. Enable and start shadowsocks.service.


	    systemctl daemon-reload
        systemctl enable shadowsocks
        systemctl start shadowsocks


## Open Firewall Port For Shadowsocks Client

Depending on your preference, you may use either the iptables, UFW, or firewallD (CentOS 7 only) commands to complete this section.

1. Open port 8388 for the Shadowsocks Client.

**Iptables**

	iptables -4 -A INPUT -p tcp --dport 8388 -m comment --comment "Shadowsocks server listen port" -j ACCEPT

**UFW**

	ufw allow proto tcp to 0.0.0.0/0 port 8388 comment "Shadowsocks server listen port"

**FirewallD**

	firewall-cmd --permanent --zone=public --add-rich-rule='
		rule family="ipv4"
		port protocol="tcp" port="8388" accept'

	firewall-cmd --reload


# Shadowsocks Client Installation

The second stage to a Shadowsocks setup is the installation of the client on the user's device. This could include a PC, mobile device or tablet, an Apple device, and even home network routers. Supported operating systems include Windows, OS X, iOS, Linux, Android, and OpenWRT.  

On OSX the ShadowsocksX-NG client, has the ability to connect to your Linode's Shadowsocks server. Download ShadowsocksX-NG, or the appropriate GUI or CLI client for your system:

![shadowsocks_download](/docs/assets/shadowsocks/shadowsocks_download.png)

Once the program is installed, run it, and input your information in the **New Server** button:

![shadowsocks_config](/docs/assets/shadowsocks/shadowsocks_config.png)

You can then push the **Global Mode** button, to enable Shadowsocks globally on your computer.

## Install Windows Client

1. Open a web browser in Windows and navigate to the [Windows Shadowsocks](https://github.com/shadowsocks/shadowsocks-windows/releases) page. Click on **Shadowsocks-4.0.4.zip** under "*Downloads*".

2. Extract the contents of the .zip file to any folder of your choice and run the *Shadowsocks.exe file*. Shadowsocks will now start running as a background process. From the *Hidden Icons* menu in the taskbar, right-click on the Shadowsocks icon, then click on *Edit Servers*. Input the appropriate information here that you saved in the *shadowsocks.json* file.

![shadowsocks_01](/docs/assets/shadowsocks/shadowsocks_01.png)

3. Right-click again on the Shadowsocks icon. Mouse over  **PAC** and make sure **Local PAC** and **Secure Local PAC** are checked. Also, mouse over **Servers** and verify that your Linode's IP address is checked.





# Where To Go From here

Now with your Shadowsocks server online, you may want to configure your mobile phone, tablet, or any other devices you own. The [Shadowsocks client download](https://shadowsocks.org/en/download/clients.html) page supports all mainstream platforms. If you are accessing the internet in China and would like to bypass the Golden Shield, you may add [this URL](https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt) to the **Auto Switch** profile in SwitchyOmega in the *Rule List URL* form. Adding this URL will trigger SwitchyOmega to download a rule list text file containing all websites currently blocked by the Golden Shield. Using this configuration, your browser will automatically invoke a proxy connection to your Shadowsocks server whenever you visit a blocked site.

