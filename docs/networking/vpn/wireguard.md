---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-11-14T17:32:04-05:00
modified: 2017-11-14T17:32:04-05:00
modified_by:
  name: Linode
title: "How to Set Up WireGuard VPN on Debian"
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

----


This is a comprehensive guide to configure a WireGuard VPN server on Debian Jessie or newer GNU/Linux distribution. Although, I am going to use my favorite Debian Stable for this guide but it would equally work for derivatives including but not limited to Ubuntu.

[WireGuard](https://www.wireguard.com) is an extremely simple yet fast and modern VPN that utilizes state-of-the-art cryptography. It aims to be faster, simpler, leaner, and more useful than other VPN protocols such as OpenVPN and IPSec. WireGuard is still under development, but even in its unoptimized state it is up to four times faster than popular OpenVPN protocol and delivers much lower ping time in comparison.

WireGuard aims to be as simple to configure as SSH. A connection is established by an exchange of public keys between server and client just like SSH keys and only a client with its public key present in server configuration file would be authorized.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

## Install WireGuard

1.  Start a root session:

        su -

2.  Add the Debian unstable repository to your sources list:

        echo "deb http://deb.debian.org/debian/ unstable main" > /etc/apt/sources.list.d/unstable-wireguard.list
        printf 'Package: *\nPin: release a=unstable\nPin-Priority: 150\n' > /etc/apt/preferences.d/limit-unstable

3.  Install Wireguard and its dependencies:

        apt update
        apt install wireguard-dkms wireguard-tools

4.  Exit the root session:

        exit


## Configure WireGuard Server

1.  Generate a private key for the WireGuard server:

        wg genkey

2. Open `/etc/wireguard/wg0.conf` in a text editor and add the following content:

  {{< file "/etc/wireguard/wg0.conf" aconf >}}
[Interface]
PrivateKey = MELpgc0wVUTJGgmCVePjIg12KRm9IbqW5E37kLgY+Wo=
Address = 10.0.0.1/24, fd86:ea04:1115::1/64
ListenPort = 51820
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE; ip6tables -A FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE; ip6tables -D FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
SaveConfig = true
{{< /file >}}

  This file specifies the following configuration options:

  {{< file-excerpt  "/etc/wireguard/wg0.conf" aconf >}}
[Interface]
PrivateKey = MELpgc0wVUTJGgmCVePjIg12KRm9IbqW5E37kLgY+Wo=
{{< /file-excerpt}}


  These lines define the tunnel interface and specifies WireGuard server's private key (replace with the private key generated above).

  {{< file-excerpt  "/etc/wireguard/wg0.conf" aconf >}}
Address = 10.0.0.1/24, fd86:ea04:1115::1/64
ListenPort = 51820
{{< /file-excerpt}}

  **Address** sets private IPv4 and IPv6 addresses for WireGuard server to be setup behind public IP of your Linode. **ListenPort** specifies UDP port the VPN server will use to listen for connections.


     PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE; ip6tables -A FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
    PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE; ip6tables -D FORWARD -i wg0 -j ACCEPT; ip6tables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
    SaveConfig = true

*PostUp* and *PostDown* sets Linux IP Masquerade rules respectively to allow all the clients to share Linux server's Internet IPv4 and IPv6 address and clear the rules once the tunnel is down, keeping the tables neat and tidy. *SaveConfig* saves anything added while the tunnel is up and running like a newly added client to server configuration file.

**D. Packet forwarding, firewall rules and more**

*Packing forwarding* is required to forward traffic from clients to the Internet.

Edit */etc/sysctl.conf* as follows:

    # nano /etc/sysctl.conf

Look for following entries and uncomment them by removing a '#' in beginning .

    net.ipv4.ip_forward=1
    net.ipv6.conf.all.forwarding = 1

Save, exit and then enable it as follows:

    # sysctl -p

***Firewall rules***

Configuring a firewall is a must to prevent unauthorized access to your VPS. I have used ufw, which is a popular and easy to use front-end for iptables.

Lets start by installing it

    # aptitude install ufw

Allowing connections to SSH and WireGuard VPN port in *ufw* before enabling it:

    # ufw allow 51820/udp
    # ufw allow 22/tcp
    # ufw enable

Enabling ufw with ufw enable, would give you a warning, “Command may disrupt existing ssh connections. Proceed with operation (y|n)?”

Once enabled verify it with the following command:

    # ufw status verbose

One last firewall rule for VPN client isolation:

The OpenVPN “gateway” is actually a router and routing a packet back from where it came from is not a corner case or needs special handling. When multiple clients would connect to the VPN server, each would be alloted a private IP viz. 10.8.0.2,.3,.4 etc. So, even if we do not use *client-to-client* nothing is stopping them from reaching each other with minimal efforts. It poses a security and privacy threat. You are required to set the following iptables rule to prevent such a situation:

    # iptables -I FORWARD -i tun0 -o tun0 -j DROP

It drops packets that were received on the tun0 interface and where the outgoing interface is tun0, creating effective VPN client isolation.

This iptable rule won’t persist upon reboot, so install a package called iptables-persistent to make it persist as follows:

    # aptitude install iptables-persistent

**E. Create a PKI for OpenVPN, build a CA, generate server/client certs and keys.**

In this guide, I am going to use easy-rsa, which is a CLI utility to build and manage a PKI CA. I have used EasyRSA version 3 for creating a PKI for OpenVPN instead of version 2 that ships with major GNU/Linux distributions. EasyRSA version 2 is dated and has insecure options and values by default. With EasyRSA3 you get encrypted ca.key by default and better default digest for signing certs and also has support for cn_only DN mode. It also comes with elliptic curve crypto mode support, so now you can use tls cipher suites with ECDHE-ECDSA.

You can get EasyRSA version 3 by cloning it from github as follows:

    $ git clone https://github.com/OpenVPN/easy-rsa.git

*NOTE: Before we build a CA and generate other certs/keys, I highly recommend you to do this on a local computer (preferably an air-gapped computer) instead of VPS, depending on how paranoid you are. And only transfer ca.crt,main_server.crt,server.key,static.key to VPS from local system using a secure transfer protocol like scp or sftp and the client cert/key has no use on the VPS where the VPN server is going to be deployed.*

I am going generate it on our secure Linode Linux server for the purpose of this guide as desired by most. Once cloned using the above git clone command, do as follows:

    # cp -R easy-rsa/easyrsa3/ /etc/openvpn/
    # cd /etc/openvpn/easyrsa3

EasyRSA uses a vars file for parameter settings. You can use the already provided vars.example file to edit it on your own. I have used RSA crypto mode, but you could also go with ec mode, if you desire to do so.

Make a copy of vars.example as vars as follows:

    # cp vars.example vars
    # nano vars

Look for the following options in vars file and uncomment them and make changes as per your needs or use them as it is.

    set_var EASYRSA "$PWD"
    set_var EASYRSA_OPENSSL "openssl"
    set_var EASYRSA_PKI "$EASYRSA/pki"
    set_var EASYRSA_DN "cn_only"
    set_var EASYRSA_KEY_SIZE 4096
    set_var EASYRSA_ALGO rsa
    set_var EASYRSA_CA_EXPIRE 3650
    set_var EASYRSA_CERT_EXPIRE 365
    set_var EASYRSA_CRL_DAYS 180
    set_var EASYRSA_SSL_CONF "$EASYRSA/openssl-1.0.cnf"
    set_var EASYRSA_DIGEST "sha512"

Save and exit vars file.

Now lets create a new PKI and CA as follows:

    # ./easyrsa init-pki
    # ./easyrsa build-ca

This would generate a root CA key/server set. When prompted for a password, input a long pass phrase to encrypt your ca.key, which would be required for issuing server/client certs.

It would prompt you for Common Name, just hit return key and leave it to the default.

Generate a private key and request for server, client as follows:

    # ./easyrsa gen-req server nopass
    # ./easyrsa gen-req client nopass

I've generated private keys for server/client along with request file, as you might have noticed we have mentioned nopass argument, this would generate unencrypted private keys. You might not want to use nopass for client and use a passphrase to encrypt its respective private key for additional security. But, I personally find using additional pass phrase for private key for client as redundant, albeit, I always create a new PKI for OpenVPN on a local air-gapped system and only transfer the required files to VPS where VPN server is to be deployed.

Import the requests, giving it an arbitrary “short name” with the syntax:

*./easyrsa import-req /path/to/received.req UNIQUE_SHORT_FILE_NAME*

    # ./easyrsa import-req pki/reqs/server.req main_server
    # ./easyrsa import-req pki/reqs/client.req client1

The request has been successfully imported with a short name of: main_server/client1.

Finally sign it as one of the types: server or client.

    # ./easyrsa sign server main_server
    # ./easyrsa sign client client1

You would be prompted to enter pass phrase for private ca.key, just input the same and hit the return key. The CA returns the signed certs which are stored in ../pki/issued/.

    # ./easyrsa gen-crl

Generates a CRL at ../pki/crl.pem

Once last thing is static.key which is required for *tls-crypt* option:

    # cd /etc/openvpn
    # openvpn --genkey --secret static.key

**F. Managing root CA cert, server cert/key and other files:**

Finally, we are done with all the difficult part, now have to move ca.crt,server.key,server.crt,crl.pem to the right places.

    # cp easyrsa3/pki/issued/main_server.crt .
    # cp easyrsa3/pki/private/server.key .
    # cp easyrsa3/pki/ca.crt .
    # cp easyrsa3/pki/crl.pem /home/cipher/

Setting the **right permissions** is almost important:

    # chmod 400 *.key

Makes the server/static.key read only by root being the owner.

    # chmod 444 /home/cipher/crl.pem

Makes the crl.pem read only by anyone.

**G.  Starting OpenVPN server and enabling it to run on reboot**

    # systemctl start openvpn@udp
    # systemctl enable openvpn@udp

You can check if the OpenVPN instance is running as follows:

    # systemctl status openvpn@udp
    # ifconfig tun0

If the status shows active then look at */etc/openvpn/v.log* for any non-fatal errors as follows:

    # cat v.log

If you see nothing wrong, then change ***log*** and ***status*** in */etc/openvpn/udp.conf* to */dev/null* like we stated above and restart the OpenVPN instance as follows:

    # nano udp.conf

Change log, status and verb in *udp.conf* as follows:

    log /dev/null
    status /dev/null
    verb 0

Save and exit.

Restart the OpenVPN instance and check the status as follows:

    # systemctl restart openvpn@udp
    # systemctl status openvpn@udp

Hurrah! Done with OpenVPN server-side setup.

**H. Client configuration**

Download client1.crt, client.key, ca.crt, static.key from the server to a local computer with scp on a GNU/Linux (assuming you use it or else go with WinSCP or Filezilla to securely transfer these files)as follows:

    $ scp root@<Linux server IP>:/etc/openvpn/easyrsa3/pki/ca.crt .
    $ scp root@<Linux server IP>:/etc/openvpn/easyrsa3/pki/issued/client1.crt .
    $ scp root@<Linux server IP>:/etc/openvpn/easyrsa3/pki/private/client.key .
    $ scp root@<Linux server IP>:/etc/openvpn/static.key .

Replace <Linux server IP> with the IP/hostname of your VPS. The above commands are required to be followed on a client system.

I have already written a model *client.ovpn*, which is made available below. All the options used therein are either similar to server configuration or self-explanatory, so refer to the manual whenever required. You can use it as it is or make changes if needed.

    # model client.ovpn

    client

    dev tun
    proto udp4
    remote <VPS IP> 1194

    resolv-retry infinite
    nobind
    persist-key
    persist-tun
    compress
    mute-replay-warnings
    reneg-sec 0
    explicit-exit-notify 3

    ca ca.crt
    cert client1.crt
    key client.key

    remote-cert-tls server
    tls-crypt static.key

    #block-outside-dns
    # uncomment the above for Windows 8 or newer to prevent DNS leaks

    verb 3
    # change it to verb 0 once you have a stable client connection

    # user openvpn
    # group openvpn

Save client.ovpn in the same DIR where you have client key/cert and other files we downloaded using SSH.

Connect to the OpenVPN server on GNU/Linux OpenVPN client as follows to test your VPN setup:

    $ sudo openvpn --config client.ovpn

Upon successful connection you would see as follows:

    Sat Aug 5 00:24:48 2017 Initialization Sequence Completed

Kindly visit a website like https://ipchicken.com to check your IP, if it is your VPS IP then you did it! Else dig for errors on the server.

In order to connect to your VPN server using official OpenVPN clients on Windows/OSX/Android, just copy all the files client.ovpn,client1.crt,client.key,ca.crt,static.key to any folder for example myvpn, and just import client.ovpn to the respective OpenVPN client for the given platform and it should work just fine.

Some tips to secure your VPN client configuration on GNU/Linux OpenVPN client would be to set the *user* and *group* to openvpn even in *client.ovpn*, which would require us to create openvpn group/user just like we did with OpenVPN server above. Also you can set the –verb 0, provided that you have no issues and a stable VPN connection for a good amount of time during the 1st trial itself.

Finally! We have successfully hosted a no-logs OpenVPN server on a Linode Linux server not just for you but even for your loved ones. It enforces TLSv1.2, uses AEAD cipher only for both tls control channel and data channel, also encrypt the key exchange itself with *tls-crypt* making your OpenVPN connection harder to be identified. We have made efforts to isolate VPN clients. We have also setup a chroot with a tmpfs mounted inside it. We made our OpenVPN instance drop privileges once properly executed to least privileged system users making it even more secure.

**Additional instructions for IPv6 support:**

For setting up OpenVPN with IPv6 support, a routed network block of IPv6 that will reach the host configured as the OpenVPN server is a must.

1. We would not set **IPv6=no** in */etc/default/ufw* as mentioned above under Firewall rules.

2. In */etc/sysctl.conf*, along with #net.ipv4.ip_forward=1, we would also look for #net.ipv6.conf.all.forwarding=1 and uncomment it.

    net.ipv6.conf.all.forwarding=1

3. We would also require the following changes in */etc/openvpn/udp.conf*:

	a. proto udp4 would change to:

    proto udp

	b. Add as follows in addition to what is already configured:

    server-ipv6 2001:db8:0:123::/64
    push "route-ipv6 2000::/3"

Replace the network block in *server-ipv6* with the one allotted to your Linux server by Linode. *route-ipv6* is being pushed to the client in order to redirect all internet-bound IPv6 traffic as desired.

There is not much to change in the client configuration other than the *proto udp4* to *proto udp*.
