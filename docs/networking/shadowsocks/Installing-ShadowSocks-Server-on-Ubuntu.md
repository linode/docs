---
author:
  name: William Yuan
  email: docs@linode.com
description: 'Shadowsocks is a secure proxy server. It is ideal in restricted Internet situations where you want to surf securely and preserve privacy.'
keywords: 'Shadowsocks, proxy server, firewall, networking security'
title: 'Installing Shadowsocks Server and Client on Ubuntu 17.04'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 
modified: 
modified_by:
  name: Linode

---

*This is a Linode Community guide. If you're an expert on something we need a guide on, you too can [get paid to write for us](/docs/contribute).*
----

## Introduction
In this tutorial, I will show you how to setup Shadowsocks server and client on Linode. Shadowsocks is an open source SOCKS5 proxy server. It is ideal in restricted Internet situations where you want to surf securely and preserve privacy.

Originated in 2012, the use of Shadowsocks has been increasingly popular to bypass firewall or other control systems that employ advanced firewall mechanisms, such as deep packet inspection, TCP reset injection, DNS pollution, IP blacklist, and pattern matching, to control Internet traffic. Interested readers can refer to an analysis of the mechanisms published by the Princeton CS department in the *Reference* section. The use of Shadowsocks is also applicable to environments with restricted network access (company network) or where the telecom operator (ISP) enforces traffic shaping/analysis mechanisms.

Similar to a regular proxy, Shadowsocks works by serving as a relay between the client and target. In the process, all data transmission is encrypted and authenticated. In essence, it camouflages your traffic data so that the control system only recognize them as random traffic to the proxy server (i.e. Linode), which is not blocked. Consequently, the control system has no grounds to apply traffic obstruction.

Advantage of using Shadowsocks is three-folds:

1  Better alternative to VPN. VPN is also a popular choice to provide secure and private connection, however, the tunnel created by VPN is easily recognizable over the network. If the intent of the control system is to cut off unsolicited traffic, VPN would be the prime target. Moreover, VPN service providers are under constant scrutiny by control systems. VPN vendor with a large user-base it make them highly susceptible to blacklisting.

2  Control. By setting up your own server, you have control over the activities in the system, such as traffic logging, user management, and data limits.

3  Flexibility. Shadowsocks is easy to host and provides a plenty of ciphers to choose from. Detail discussion of which cipher is suitable can be found in the *Optimization* section.

Whilst Shadowsocks provides confidentiality and privacy, it is not designed to be a privacy solution. First, you are only as anonymous as your server node. Second, Shadowsocks' encryption has not been analyzed by security experts, although the source code is available on Github. You are cautioned not to use Shadowsocks for unlawful activities.

This tutorial will walk-through the setup of Shadowsocks on Ubuntu 17.04.

## Before You Begin

1  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and time zone.


2  Installing Shadowsocks will require super user privileges. If you have logged in as a standard user, type `sudo su` to get elevated privileges. In *Hardening Your Proxy Server* section, we will have basic guidelines for hardening your SSH access and setting up firewall.

3  Update your system! It is always helpful keeping your system up-to-date.

	apt-get update && sudo apt-get upgrade

	
4  The Windows client requires Microsoft .NET Framework 4.6.2 or higher
	
## Requirements and Setting Up Linode
In this guide we will install using the *shadowsocks-libev* fork of Shadowsocks. This fork adapted the original Shadowsocks fork, which was no longer maintained/removed. Written in C++, shadowsocks-libev is very lightweight and not very resource intensive.

### Instance Considerations
A typical proxy process will take up a network port and consume about 5-10M of RAM. Feel free to install on your existing Linode server. 

There are scenarios where you want to have a standalone Linode instance for the following reasons:

1  The desired proxy port is occupied by other application services
2  You want to isolate your production server and avoid cross process interferences
3  You want a standalone server to reduce risks of active probing or cyber-attacks

The Linode 1024 plan will suffice Shadowsocks resource requirements.

### Geographic Considerations
Another variable that will impact the proxy network speed is the geographical region where you deployed Linode.
Since your are running a proxy server, all of your Internet traffic will go through an additional "hop" between you and the target. Therefore you want to setup the server at a region such that the connection to your home client is the fastest. You can run speed tests at [Linode Facilities Speedtest](https://www.linode.com/speedtest) 

In addition, ISP networks interlink by peering or transit. Depending on your ISP's arrangements, the Linode location nearest to you may not have the most efficient routing. That’s right, you read that correctly. Due to cost arrangements, your traffic may be routed to different regions *before* it reaches Linode server. You can run trace route tests to identify the route with minimal latency, which is particularly important in gaming and video streaming contexts. Also, try to get a first tier ISP (the one that actually owns Internet backbones) broadband.

## Simple Installation and Configuration

Let's build the latest Shadowsocks from source code. Latest is the greatest! The shadowsocks-libev is actively developed and maintained.

First, we need to get the relevant build dependencies and tools:

	apt-get install build-essential autoconf libtool libssl-dev \
	    gawk debhelper dh-systemd init-system-helpers pkg-config git
  
Then, get latest shadowsocks-libev code using Git:
  
	git clone https://github.com/shadowsocks/shadowsocks-libev.git

Navigate to the code directory:

	cd shadowsocks-libev

shadowsocks-libev comes with pre-configured build script, it will install all relevant package dependencies as needed. Run the following to start the building process:

	mkdir -p ~/build-area/
	cp ./scripts/build_deb.sh ~/build-area/
	cd ~/build-area
	./build_deb.sh

For certain Linux distributions, you may need manually install the following packages that Shadowsocks rely on: Libsodium and MbedTLS. **Skip** this step if you are using Ubuntu 17.04 (Zesty Zapus). 

Libsodium is the standard encryption library; MbedTLS (or PolarSSL) will enable Shadowsocks to incorporate encryption on network traffic.

To install Libsodium, run the following command:

	wget https://download.libsodium.org/libsodium/releases/LATEST.tar.gz
	tar xf LATEST.tar.gz && cd libsodium*
	./configure && make && make install
	ldconfig

And MbedTLS:

	export MBEDTLS_VER=2.5.1
	wget https://tls.mbed.org/download/mbedtls-$MBEDTLS_VER-gpl.tgz
	tar xvf mbedtls-$MBEDTLS_VER-gpl.tgz
	pushd mbedtls-$MBEDTLS_VER
	make SHARED=1 CFLAGS=-fPIC
	sudo make DESTDIR=/usr install
	popd
	sudo ldconfig

You are set! Now let’s try starting the Shadowsocks server with the `ss-server` executable:

	ss-server -s <server_host> -p <server_port> -l <local_port> -k <password> -m <encrypt_method>

where you should replace 
* `<server_host>` with the public IP of your Linode server, 
* `<server_port>` with the port you are opening to the client/user, we will use port 443 in this example, port 443 is the default port for HTTPS traffic, 
* `<local_port>` with 1080, this is the default local port for loopback listening, 
* `<password>` with password of at least 8 characters, 
* `<encrypt_method>` from one of the encryption methods listed below, we will use chacha20 in this example.

Examplar command for running ss-server:

	ss-server -s 1.2.3.4 -p 443 -l 1080 -k myPassword -m chacha20

{: .note}
>
> the list of support encryption methods are: rc4-md5, aes-128-gcm, aes-192-gcm, aes-256-gcm, aes-128-cfb, aes-192-cfb, aes-256-cfb, aes-128-ctr, aes-192-ctr, aes-256-ctr, camellia-128-cfb, camellia-192-cfb, camellia-256-cfb, bf-cfb, chacha20-poly1305, chacha20-ietf-poly1305, salsa20, chacha20 and chacha20-ietf.
	
## Advanced Setup (multiple user, system service)
Ideally you want to run Shadowsocks as a system service that starts automatically during each boot. Similarly, you want to setup the proxy for multiple users so multiple devices or users can use the proxy service.

The aforementioned executable *ss-server* does not allow multiple users. That is a design decision. But it does allow multiple instances of it running. Below I discuss using the *ss-manager* executable which is also bundled with shadowsocks-libev to setup multiple users and configure system service (daemon).


{: .note}
>
> The term *user* is used interchangeably with *port* since each user will take up a port when using proxy server.

Create a manager configuration file for multiple users by using the editor of your choice, `vi /etc/shadowsocks-libev/manager.json` and enter the following:

{: .file-excerpt }
/etc/shadowsocks-libev/manager.json
:   ~~~ json
    {
		"server":"<server_host>",
		"port_password":{
			"80":"<password>",
			"443":"<password>",
			"<server_port>":"<password>",
			"<server_port>":"<password>"
		},
		"timeout":600,
		"method":"chacha20",
		"fast_open": true
	}
    ~~~

Replace additional `"<server_port>":"<password>"` pairs as you deem necessary. Each pair comma delimited. Remove unused template `"<server_port>":"<password>"` pairs.
	
Next, edit the service configuration file `vi /lib/systemd/system/shadowsocks-libev.service` and change the values in `User` and `ExecStart` to:

{: .file-excerpt }
/lib/systemd/system/shadowsocks-libev.service
:   ~~~ service
    User=root
	ExecStart=/usr/bin/ss-manager -c /etc/shadowsocks-libev/manager.json -u
    ~~~

It tells the system to execute `ss-manager` according the manager configuration file provided, and run as root user.

Run `systemctl daemon-reload` to apply changes and restart the system service:

	systemctl restart shadowsocks-libev
	
You can check the status of the service by running:

	systemctl status shadowsocks-libev

Finally, keep the information from manager configuration file handy. You will need to enter this information in client setup.
	
## Client Usage
You can start using Shadowsocks on your client machine once the server has been setup and running. Shadowsocks has clients for Windows, MacOS, Android, OpenWRT and other platforms. I will show you setting up clients on Windows and Android.

**Windows Platform**
The official Windows client is available at [Shadowsocks Windows Client](https://github.com/shadowsocks/shadowsocks-windows/releases). Download the latest release, extract to a folder of your choice and run Shadowsocks.exe, a paper plane-like tray icon will appear in the Windows taskbar.

To add server(s):

	Right-click Shadowsocks icon\Servers\Edit Servers

In here you specify the exact information entered in the server config file on the VPS. This includes `<server_host>`, `<server_port>`, `<local_port>`, `<password>`, and `<encrypt_method>`.

{: .note}
>
> There is a Proxy Port setting at the bottom corner of the Edit Server form. This specifies the client local listening port. The default value is 1080. You may leave this value intact. 

To enable proxy on client:

	Right-click Shadowsocks icon\Enable System Proxy

There are 2 kinds of mode to run the proxy client, Global and PAC. Under PAC mode, a proxy auto-config (PAC) file is utilized to instruct the Shadowsocks client a list of websites (i.e. blocked websites) that should be proxied. Websites not listed in the PAC file *do not* go through the proxy. This is a useful way to segment traffic. On the other hand, Global mode simply means that all traffic is routed through your proxy server.

You can choose the mode of operation in:

	Right-click Shadowsocks icon\Mode\[Global or PAC]

Once System Proxy has been enabled, it will automatically update Windows system's default proxy configuration. This tells Windows programs to route traffic through `Local Address/Proxy Port` defined therein. This setting can be viewed at:

	Internet Explorer\Internet Options\Connections\LAN Settings
	
By default, the Chrome browser will direct all traffic to the proxy server found in this setting. Certain applications have implemented their own proxy configuration, such as Firefox and Dropbox. You need to change the values manually in their settings. If you follow this guide in entirety, the `Local Address/Proxy Port` value should be `127.0.0.1/1080`.

**Android Platform**
You can find the official Android client on Google Play store, [Shadowsocks Android Client](https://play.google.com/store/apps/details?id=com.github.shadowsocks&hl=en).

Install and open the app. Enter the same settings as described above. Click on the paper plane button at the bottom right corner to start. You are set!

## Optimization
The Shadowsocks official site contains optimization guidelines on your Linux system. While it is a cookie cutter approach, I will drill down a little deeper into each tweak and deviations from the official guide.

### Increase Maximum Number of File Descriptors
File Descriptors (FD) are access pointers to IO resources, not just files, but also network resources. By nature a proxy server would use a lot of concurrent TCP connections so raising the maximum limit of "access pointers" can alleviate bottleneck situations.

Fire up your favorite editor and edit the file `vi /etc/security/limits.conf`.

Add the following lines:

	* soft nofile 51200
	* hard nofile 51200
	root soft nofile 51200
	root hard nofile 51200

The asterisk at the beginning of the first 2 lines means "apply this rule to all users except root", and remember in the Shadowsocks service configuration we have ss-manager to run as root user, so we need the last 2 lines. As you might have guessed it, the last 2 lines will apply the FD limit to the root user.

Save and quit. You need to restart the server for this to take effect.

Run this command to verify the "open files" value has been changed to 51200 successfully:

	ulimit -a

### System and Networking Tweaks
Next we will make some system and network configuration tweaks. The gist of it is to increase buffer size or network queue size, and enable fast port open. Create `vi /etc/sysctl.d/local.conf` and paste the following:

{: .file-excerpt }
/etc/sysctl.d/local.conf
:   ~~~ conf
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
	net.core.default_qdisc = fq
	net.ipv4.tcp_congestion_control = bbr
    ~~~

Run `sysctl --system` to apply changes

Below is a brief description of the settings. An interesting part of the settings is the *net.ipv4.tcp_congestion_control*, which determines the TCP congestion algorithm. Starting from Linux Core version 4.9 and up, an algorithm developed by Google called bbr has been integrated. You can find detail of this algorithm in the *Reference* section. As an analogy, bbr adds additional traffic lights and patrols to optimize the network traffic.

{: .table .table-striped} 
| Option/Parameter | Description |
| ---------------- | ----------------------------------- |
| fs.file-max | Similar to above, this sets the max file descriptor at the **kernel** level |
| net.core.rmem_max | increase buffer size |
| net.core.wmem_max | increase buffer size |
| net.core.rmem_default | increase buffer size |
| net.core.wmem_default | increase buffer size |
| net.core.netdev_max_backlog | increase the queue size when client packets are faster than CPU can process |
| net.core.somaxconn | useful for heavy load servers where new connection rate is high |
| net.ipv4.tcp_syncookies | use cookies to handle SYN queue overflows, resists SYN attacks |
| net.ipv4.tcp_tw_reuse | enable to allow new connections to reuse socket |
| net.ipv4.tcp_tw_recycle | disabled, recycling causes issues with proxy server |
| net.ipv4.tcp_fin_timeout | default network timeout |
| net.ipv4.tcp_keepalive_time | decrease keep alive time |
| net.ipv4.ip_local_port_range | port range of outbound traffic |
| net.ipv4.tcp_max_syn_backlog | increase SYN queue size |
| net.ipv4.tcp_max_tw_buckets | timewait on system socket |
| net.ipv4.tcp_fastopen | enable to increase TCP traffic initialization, only works on Linux clients |
| net.ipv4.tcp_rmem | increase buffer size (TCP) |
| net.ipv4.tcp_wmem | increase buffer size (TCP) |
| net.ipv4.tcp_mtu_probing | enable to allow large payload |
| net.core.default_qdisc | sets the default queuing mechanism to fast queuing (fq) |
| net.ipv4.tcp_congestion_control | sets traffic congestion mechanism to Google's BBR (bbr) |

### Encryption and Port Selection Strategy
Shadowsocks offers 2 types of encryption family to choose from: stream and AEAD ciphers. Stream ciphers are regular encryption scheme where the content is shuffled with a pseudorandom cipher key. [AEAD](https://en.wikipedia.org/wiki/Authenticated_encryption) ciphers has additional authentication mechanism built-in to increase data confidentiality and integrity. Generally speaking, AEAD ciphers are more resilient to protocol based attacks, but they will incur additional overhead and impacts overall latency and throughput.

{: .table .table-striped} 
| Stream Ciphers | AEAD Ciphers |
| ---------------- | ---------------- |
| aes-128-ctr | chacha20-ietf-poly1305 |
| aes-192-ctr | aes-256-gcm |
| aes-256-ctr | aes-192-gcm |
| aes-128-cfb | aes-128-gcm |
| aes-192-cfb |  |
| aes-256-cfb |  |
| camellia-128-cfb |  |
| camellia-192-cfb |  |
| camellia-256-cfb |  |
| chacha20-ietf |  |

In terms of network protocol, ports are logical constructs that serve to identify the underlying application service. They are like *room numbers* assigned to different guests in a hotel. Common ports are 80 (HTTP), 25 (E-Mail), 443 (HTTPS). 

Depending on how strong the prevailing traffic analysis/control system operates, you can form your strategy by choosing a combination of port and encryption algorithm. The most complex encryption method (ones with 256-bit key size) may not be the optimal in your situation. In practical applications, AES encryption with 128-bit key size are sufficiently safe to use. As noted above, more complex key size will incur additional overhead with latency and total throughput, which is critical in gaming or video streaming contexts. You should experiment the level at which you are comfortable with, starting from lower band.

For example, the chacha20 type of encryption is designed for fast encryption-decryption sequence on mobile devices, you may want to try in order:

	chacha20 -> chacha20-ietf -> chacha20-ietf-poly1305
	
For desktop systems:

	rc4-md5 -> aes-128-cfb -> aes-256-cfb -> aes-128-gcm
	
Choosing the right port to go with encryption is also important. Certain ports are subject to close scrutiny by traffic control systems, such as 80, 8080, and 25. If you choose a complex encryption to go with the port 80, the control system may immediately raise a flag and start probing your traffic, because it would expects **unencrypted** data (HTTP) in that port. Instead, you should pair strong encryption with ports such as 443, which is the common port for encrypted HTTP traffic. Furthermore, users have reported success with unconventional ports, such as ports in the 8000-9000 range.

{: .caution}
>
> The proxy server will not work if you choose a port that has been occupied by other services on the server, for example, an e-mail server will take up port 25.

{: .caution}
>
> The author of Shadowsocks noted that there are inherent weakness in *chacha20* and *rc4-md5* ciphers.

### Hardening Your Proxy Server
It is imperative to harden your proxy server because your proxy service is now public. Most importantly your server is subject to cyber-attacks. The bare minimum requirement is to harden your SSH login and setup a proper firewall.

Linode Guide and Tutorials has excellent articles on [Securing Your Server](https://www.linode.com/docs/security/securing-your-server) and [How to Configure a Firewall with UFW](https://www.linode.com/docs/security/firewalls/configure-firewall-with-ufw).

The rule of thumb for hardening SSH access is to create an alternative user with administrative privileges, and then disable root user login from SSH. 

The rule of thumb for setting up a firewall is to deny all incoming traffic except for ports used by Shadowsocks or any other application you have on the server. This can be done by running the ufw commands. You should replace `<port>` with the port number you have on your system, and add additional `ufw allow` lines for each port as necessary.

	ufw default deny incoming
	ufw default allow outgoing
	ufw allow ssh
	ufw allow <port>/tcp
	ufw enable
	
You can check the existing ufw rules by running:

	ufw status
	
{: .caution}
>
> Before enabling the firewall, make sure you allow SSH access (port 22), otherwise you will get locked out of your system.


## Troubleshooting
**1. Build stuck at *connecting to security.ubuntu.com***

Edit the file `vi /etc/gai.conf`

change line ~54 and uncomment the following:

	precedence ::ffff:0:0/96  100

Now security.ubuntu.com will opt to resolve its IPv4 address first, before trying to resolve its IPv6 address

**2. ss-server prompts not enough entropy on startup**

	"This system doesn't provide enough entropy to quickly generate high-quality random numbers
	Installing the rng-utils/rng-tools or haveged packages may help."

The encryption library used by Shadowsocks requires entropy to generate random numbers for encryption. In some  virtualized environment, the OS cannot generate enough entropy in time. To remedy this, you can wait a day for collection to take place or install a entropy generator.

First, let's check the number of available entropy on the system:

	cat /proc/sys/kernel/random/entropy_avail

If you have a number below 1000, you can install haveged package with the following command:

	apt-get install haveged

You are set! It will run as a system daemon and continue to generate entropy. haveged's algorithm is based on hardware interrupts and continually re-seeded so it is pretty "random." Check your system's available entropy again and restart ss-server.

**3. Can Shadowsocks work with other application other than web browsers?**
Yes. On Windows platform, Shadowsocks can proxy any traffic provided that the application has an interface to change the proxy configuration manually or by reading the default proxy settings from `Internet Explorer\Internet Options\Connections\LAN Settings`. Some applications have internalized proxy settings and thus cannot route through the proxy, e.g. OneDrive, even if you are using Global mode.

**4. Which client should I use for iPhone/iOs?**
There are no official iOS client in the App Store. Third-party clients may present a privacy risk. Use at your own caution.

**5. Help, I am getting intermittent disconnects after a period of use**
Your traffic may be profiled by control system and flagged. Try stronger encryption method and port number combination. As a last result, request a different IP from Linode and be sure to change server IP address accordingly.

## Reference

*  [Shadowsocks Official Site](https://shadowsocks.org/en/index.html)
*  [shadowsocks-libev on Github repository](https://github.com/shadowsocks/shadowsocks-libev)
*  [The Great Firewall](https://en.wikipedia.org/wiki/Great_Firewall)
*  [Princeton Research Paper](https://www.cs.princeton.edu/~rensafi/papers/Ensafi2015a.pdf)
*  [Haveged](http://www.issihosts.com/haveged/faq.html)
*  [ACM Queue - BBR](http://queue.acm.org/detail.cfm?id=3022184)
