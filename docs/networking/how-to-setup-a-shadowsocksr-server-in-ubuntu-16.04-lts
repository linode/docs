---
author:
  name: Linode Community
  email: sorataiwan@gmail.com
description: 'A guide to setup a ShadowsocksR server in your Linode server.'
keywords: 'shadowsocksr, server, install'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
title: 'How to setup a ShadowsocksR server in Ubuntu 16.04 LTS'
---

*This is a Linode Community guide. If you're an expert on something we need a guide on, you too can [get paid to write for us](/docs/contribute).*
----

## Introduction

ShadowsocksR is a fork of Shadowsocks. And it has lots of new feature such as obfs and more. Some people live in network control area use it to bypass firewall and access the banned Internet service such as Youtube, Google... And this guide will show you how to setup up a ShadowsocksR server in Linode server and connect to it from your device(such as Android and Windows).

Be different with some one-step script in Internet, you will setup a ShadowsocksR server step by step and will know the meaning of every step. So if you bump into some problem you can solve by yourself.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

{: .P.S}
> Linode 1024 is enough. And in this post we will use Ubuntu 16.04 LTS fkr example.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an ShadowsocksR server.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{: .note}
> The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Install git

Git is a version control tool. We will use this tool to pull ShadowsocksR code and keep it in latest easily.

```

apt-get install git

```

## Install libsodium

libsodium is a encrypt library. ShadowsocksR use it for some encrypt method(Chacha20...).

1. Install build tool

```

apt-get install build-essential

```

2. Get libsodium(Current Version: 1.0.13, you can check the latest version at [here](https://github.com/jedisct1/libsodium/releases)) and extract it.

```

cd /tmp
wget https://github.com/jedisct1/libsodium/releases/download/1.0.13/libsodium-1.0.13.tar.gz
tar xf libsodium-1.0.13.tar.gz && cd libsodium-1.0.13

```

3. Build it!

```

./configure && make -j2 && make install
ldconfig

```

4. Remove the file we won't need any more.

```

cd /tmp
rm -rf libsodium-1.0.13

```

## Install ShadowsocksR server

1. Pull ShadowsocksR code

```

cd /usr/local
git clone -b manyuser https://github.com/shadowsocksr/shadowsocksr.git

```

2. Enter the dictionary, and run the initial script.

```

cd shadowsocksr
./initcfg.sh

```

3. Add a systemd script for ShadowsocksR server.Copy from [here](https://github.com/breakwa11/shadowsocks-rss/wiki/System-startup-script).

```

vi /etc/systemd/system/shadowsocksr.service

```

And here is the file content.

```

[Unit]
Description=ShadowsocksR server
After=syslog.target
After=network.target

[Service]
LimitCORE=infinity
LimitNOFILE=512000
LimitNPROC=512000
Type=simple
WorkingDirectory=/usr/local/shadowsocksr
ExecStart=/usr/bin/python /usr/local/shadowsocksr/server.py
ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s TERM $MAINPID
Restart=always

[Install]
WantedBy=multi-user.target

```

## Configure and run ShadowsocksR server

Make sure you are still in the dictionary(/usr/local/shadowsocksr).

1. Edit the mudbjson, change

```

API_INTERFACE = 'sspanelv2'

```

to

```

API_INTERFACE = 'mudbjson'

```

It will let server read config from json.

2. And now we will use the mudb json manage script to add a port for connection. For example, I want to open 80 port for connection.

```

python mujson_mgr.py -a -p 80 -o http_simple -O auth_chain_a -m none -k Linode -u port_80

```

The last arg is a symbol to identify the port.

And connection info is:

> Port: 80
> Obfs: http_simple
> Protocol: auth_chain_a
> Method: none
> Password: Linode

{: .note}
> There are some suggest port and config. It will make the proxy server hard to discover and protect your server from the monitor of your ISP and government.
> Port: 80, Obfs: http_simple, Protocol: auth_chain_a, Method: none, Password: Linode
> Port: 443, Obfs: tls1.2_auth_ticket, Protocol: auth_chain_a, Method: none, Password: Linode
> The traffic to these port will seem like http/https traffic, it will hide the server to protect it.

> And if you want to use the other port, you should only take care of the protocol setting, recommend protocols are auth_chain_a/auth_aes128_md5/auth_aes128_sha1. About the difference you can see [here](https://github.com/breakwa11/shadowsocks-rss/blob/master/ssr.md)(Chinese version only).

> You can see more advanced usage(Speed limit, and forbbiden user to access some port by your proxy) by type:
> python mujson_mgr.py -h


3. Now, you can run ShadowsocksR by start the service.

```

systemctl enable shadowsocksr.service && systemctl start shadowsocksr.service

```

## Connect to your server

Now you can connect to your server and use it to access Internet.

Here are the Clients.

Windows: [SSR C#](https://github.com/shadowsocksr/shadowsocksr-csharp)
Linux: [SSR python manyuser](https://github.com/shadowsocksr/shadowsocksr/tree/manyuser), [SSR-libev](https://github.com/shadowsocksr/shadowsocksr-libev)  
Android: [SSR-android](https://github.com/shadowsocksr/shadowsocksr-android/releases)  
iOS： [Shadowrocket](https://itunes.apple.com/us/app/shadowrocket/id932747118), [Potatso2](https://download.potatso.com), [Cross](https://itunes.apple.com/cn/app/cross-shadowsocks-proxy-client/id1194595243)  
MAC：[ShadowsocksX-NG](https://github.com/qinyuhang/ShadowsocksX-NG/releases), [ShadowsocksX-R](https://github.com/yichengchen/ShadowsocksX-R/releases)  

Use the connection info previous mentioned to connect~

## Advance usage

### Redirect abnormal traffic to the another host or port.

It makes you proxy server more like a web server and make it hard to discover to protect it from network monitor.

1. Edit the user-config.json in /usr/local/shadowsocksr

modify

```

"redirect": "",

```

to

```

"redirect": ["*:80#http://www.harvard.edu/:80"],

```

And restart your ShadowsockaR server service, and access the port directly in browser. You will see the Harvard university's website. It rediect the traffic your browser access to the website. But when you use ShadowsocksR client to connect to this port, it will still is a proxy port.

{: .note}
> [Here](https://github.com/shadowsocksr/shadowsocksr/commit/c7815a0ee83cd48365caaa7bd15b1dc33696a43f) is the syntax for this redirect rule.

### Add a access port restrict

If you want to share this proxy with your friends and don't want them set it as a proxy in a bittorrent client to proxy the download traffic(It let you receive a DMCA warn). You should set the forbidden ports.

Make sure you are in /usr/local/shadowsocksr. And exec

```

python mujson_mgr.py -e -u port_80 -f "1-52,54-79,81-442,444-65535"

```

-e means edit,
-u port_80 means the target user is port_80(previous identify).
-f "1-52,54-79,81-442,444-65535" means I only allow user use my proxy to access the remote host port 53, 80, 443(Only allow http/https/dns).You can decide what port should ban.

### Add speed limit

You can set a speed limit for your user.

Make sure you are in /usr/local/shadowsocksr. And exec

```

python mujson_mgr.py -e -u port_80 -S 10240

```

-e means edit,
-u port_80 means the target user is port_80(previous identify).
-S 10240 means I want to limit the speed of this user in 10240 ***Kbps***.
