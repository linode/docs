---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This tutorial details how to install Shadowsocks-libev, a full-featured, resource-efficient port of the web proxy tool, Shadowsocks.'
keywords: ["shadowsocks", "proxy", "shadowsocks server", "ubuntu", "centos", " strong vpn"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-08-16
modified: 2017-08-16
modified_by:
  name: Linode
title: Create a SOCKS5 Proxy Server with Shadowsocks on Ubuntu and CentOS 7
contributor:
  name: Andrew Lescher
  link: https://www.linkedin.com/in/andrew-lescher-87027940
external_resources:
 - '[Shadowsocks official](https://shadowsocks.org/)'
 - '[Shadowsocks-libev GitHub](https://github.com/shadowsocks/shadowsocks-libev)'
---

*This is a Linode Community guide. If you're an expert on something open-source for which our core audience could use a guide, you too can [get paid to write for us](/docs/contribute).*

---

![Create a SOCKS5 Proxy Server with Shadowsocks on Ubuntu and CentOS 7](/docs/assets/shadowsocks.jpg "Create a SOCKS5 Proxy Server with Shadowsocks on Ubuntu and CentOS 7")

Shadowsocks is a lightweight SOCKS5 web proxy tool primarily utilized to bypass network censorship and blocking on certain websites and web protocols. A full setup requires a Linode server to host the Shadowsocks daemon, and a client installed on PC, Mac, Linux, or a mobile device. Unlike other proxy software, Shadowsocks traffic is designed to be both indiscernible from other traffic to third-party monitoring tools, and also able to disguise itself as a normal direct connection. Data passing through Shadowsocks is encrypted for additional security and privacy.

Since there is currently no Shadowsocks package available for Ubuntu or CentOS, this guide shows how to build Shadowsocks from source.

## Before You Begin

1.  The commands in this guide require root privileges. To run the steps as an elevated user with sudo privileges, prepend each command with `sudo`. If two commands are presented in the same instance (separated by `&&`), remember to use `sudo` after the `&&` (ex. `sudo [command] && sudo [command]`). To create a standard user account with `sudo` privileges, complete the [Add a Limited User Account](/docs/security/securing-your-server#add-a-limited-user-account) section of our Securing your Server guide.

2.  A working firewall is a necessary security measure. Firewall instructions [will be presented](#open-firewall-port-for-shadowsocks-client) for UFW, FirewallD, and Iptables. To configure a firewall on your Linode, visit one of our guides:

    *  [How to Configure a Firewall with UFW](/docs/security/firewalls/configure-firewall-with-ufw)
    *  [Introduction to FirewallD on CentOS](/docs/security/firewalls/introduction-to-firewalld-on-centos)

## Install the Shadowsocks Server

### Download Source Code and Dependencies

1.  Update system repositories, then download and install dependencies:

    **Ubuntu 17.04**

        apt-get update && apt-get upgrade -yuf
        apt-get install -y --no-install-recommends gettext build-essential autoconf libtool libpcre3-dev asciidoc xmlto libev-dev libudns-dev automake libmbedtls-dev libsodium-dev git python-m2crypto

    **CentOS 7**

        yum update && yum upgrade -y
        yum install epel-release -y
        yum install -y gcc gettext autoconf libtool automake make pcre-devel asciidoc xmlto udns-devel libev-devel libsodium-devel mbedtls-devel git m2crypto

2.  Navigate to the `/opt` directory and download the Shadowsocks Git module:

        git clone https://github.com/shadowsocks/shadowsocks-libev.git
        cd shadowsocks-libev
        git submodule update --init --recursive

3.  Install Shadowsocks-libev:

        ./autogen.sh
        ./configure
        make && make install

## Configure the Shadowsocks Server

1. Create a new system user for Shadowsocks:

    **Ubuntu 17.04**

        adduser --system --no-create-home --group shadowsocks

    **CentOS 7**

	adduser --system --no-create-home -s /bin/false shadowsocks

2. Create a new directory for the configuration file:

        mkdir -m 755 /etc/shadowsocks

3. Create the Shadowsocks config file. Paste the contents listed below into the file, noting the instructions in the **shadowsocks.json Breakdown** table for each property. Follow these instructions to determine the value you should set for each property.

## shadowsocks.json Breakdown

 |  **Property**  | **Explanation** | **Possible Values** |
 |:----------:|:-----------:|:---------------:|
 | server | Enter your server's public IP address. | User determined |
 | server_port | Shadowsocks will listen on this port. Use the default value of `8388`. | User determined |
 | local_address | Local listening address. Use your loopback address, `127.0.0.1`. | Loopback address |
 | local_port | Local listening port. Use the default value of `1080`. | User determined |
 | password | Connection password. Set a strong password. | User determined |
 | timeout | Connection timeout in seconds. The default value should be sufficient here. | User determined |
 | method | Encryption method. Using AEAD algorithms is recommended. | See [Stream Ciphers](https://shadowsocks.org/en/spec/Stream-Ciphers.html) and [AEAD Ciphers](https://shadowsocks.org/en/spec/AEAD-Ciphers.html) |
 | fast_open | Reduces latency when turned on. Can only be used with kernel versions 3.7.1 or higher. Check your kernel version with `umame -r`. | true, false |
 | nameserver | Name servers for internal DNS resolver. | User determined |

{{< file "**/etc/shadowsocks/shadowsocks.json**" json >}}
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

{{< /file >}}


## Optimize Shadowsocks

Apply the following optimizations to your system kernel to provide for a smooth running Shadowsocks installation.

1. Create the `/etc/sysctl.d/local.conf` system optimization file and paste the contents shown below into your file.

    {{< caution >}}
These settings provide the optimal kernel configuration for Shadowsocks. If you have previously configured your system kernel settings for any reason, make sure no conflicts exist.
{{< /caution >}}

    {{< file "/etc/sysctl.d/local.conf" aconf >}}
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
net.ipv4.tcp_congestion_control = hybla

# for low-latency network, use cubic instead
net.ipv4.tcp_congestion_control = cubic

{{< /file >}}


2. Apply optimizations:

        sysctl --system

### Create a Shadowsocks Systemd Service

The Shadowsocks systemd service allows the daemon to automatically start on system boot and run in the background.

1. Create a systemd file with the following content:

    {{< file "/etc/systemd/system/shadowsocks.service" service >}}
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

{{< /file >}}


2. Enable and start `shadowsocks.service`:

        systemctl daemon-reload
        systemctl enable shadowsocks
        systemctl start shadowsocks

## Open Firewall Port for Shadowsocks Client

Depending on your preference, you may use either the iptables, UFW, or firewallD (CentOS 7 only) commands to complete this section.

Open port `8388` for the Shadowsocks Client:

**Iptables**

    iptables -4 -A INPUT -p tcp --dport 8388 -m comment --comment "Shadowsocks server listen port" -j ACCEPT

**UFW**

    ufw allow proto tcp to 0.0.0.0/0 port 8388 comment "Shadowsocks server listen port"

**FirewallD**

    firewall-cmd --permanent --zone=public --add-rich-rule='
        rule family="ipv4"
        port protocol="tcp" port="8388" accept'

        firewall-cmd --reload

## Install a Shadowsocks Client

The second stage to a Shadowsocks setup is to install a client on the user's device. This could include a computer, mobile device, tablet, and even home network router. Supported operating systems include Windows, OS X, iOS, Linux, Android, and OpenWRT.

### Mac OS Shadowsocks Client

Download ShadowsocksX-NG, or the appropriate GUI or CLI client for your system:

![Shadowsocks download page](/docs/assets/shadowsocks/shadowsocks_download.png "Shadowsocks download page")

Once the program is installed, run it, and then enter your information in the **New Server** button:

![Shadowsocks configuration](/docs/assets/shadowsocks/shadowsocks_config.png "Shadowsocks configuration")

Press the **Global Mode** button to enable Shadowsocks globally on your computer.

### Install Windows Client

1. Navigate to the [Windows Shadowsocks](https://github.com/shadowsocks/shadowsocks-windows/releases) page. Click on **Shadowsocks-4.0.4.zip** under **Downloads**.

2. Extract the contents of the .zip file into any folder and run `Shadowsocks.exe`. Shadowsocks will run as a background process. Locate the Shadowsocks icon in the taskbar (it may be in the *Hidden Icons* taskbar menu), right-click on the Shadowsocks icon, then click on **Edit Servers**. Enter the information that you saved in the *shadowsocks.json* file.

    ![New server configuration dialog](/docs/assets/shadowsocks/shadowsocks-windows-edit-servers.png "Windows New Server configuration dialog")

3. Right-click on the Shadowsocks icon again. Mouse over **PAC** and select both **Local PAC** and **Secure Local PAC**. To confirm that your Linode's IP address is selected, mouse over **Servers**.

## Where to Go from Here

Once your Shadowsocks server is online, configure a client on your mobile phone, tablet, or any other devices you use. The [Shadowsocks client download](https://shadowsocks.org/en/download/clients.html) page supports all mainstream platforms.
