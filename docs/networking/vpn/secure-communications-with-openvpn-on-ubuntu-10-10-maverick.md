---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Use OpenVPN to securely connect separate networks on Ubuntu 10.10 (Maverick).'
keywords: ["openvpn", "networking", "vpn", "ubuntu", "ubuntu maverick", "ubuntu 10.10"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['networking/openvpn/ubuntu-10-10-maverick/']
modified: 2012-10-08
modified_by:
  name: Linode
published: 2010-11-29
title: 'Secure Communications with OpenVPN on Ubuntu 10.10 (Maverick)'
---



OpenVPN, or Open Virtual Private Network, is a tool for creating networking "tunnels" between and among groups of computers that are not on the same local network. This is useful if you have services on a local network and need to access them remotely but don't want these services to be publicly accessible. By integrating with OpenSSL, OpenVPN can encrypt all VPN traffic to provide a secure connection between machines.

For many private networking tasks, we urge users to consider the many capabilities of the OpenSSH package which can provide easier VPN and VPN-like services. OpenSSH is also installed and configured by default on all Linodes. Nevertheless, if your deployment requires a more traditional VPN solution like OpenVPN, this document covers the installation and configuration of the OpenVPN software.

Before installing OpenVPN, we assume that you have followed our [getting started guide](/docs/getting-started/). If you are new to Linux server administration, you may be interested in our [introduction to Linux concepts guide](/docs/tools-reference/introduction-to-linux-concepts/), [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/content/using-linux/administration-basics). If you're concerned about securing and "hardening" the system on your Linode, you might be interested in our [security basics](/content/security/basics) article as well.

# Installing OpenVPN

Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Begin by installing the OpenVPN software, the `udev` dependency, and `iptables` by issuing the following command:

    apt-get install openvpn udev iptables

The OpenVPN package provides a set of encryption-related tools called "easy-rsa". By default these scripts are located in the `/usr/share/doc/openvpn/examples/easy-rsa/` directory. However, in order to function properly, these scripts should be located in the `/etc/openvpn` directory. Copy these files with the following command:

    cp -R /usr/share/doc/openvpn/examples/easy-rsa/ /etc/openvpn

Most of the relevant configuration for the OpenVPN public key infrastructure is contained in `/etc/openvpn/easy-rsa/2.0/`, and much of our configuration will be located in this directory.

### Configure Public Key Infrastructure Variables

Before we can generate the public key infrastructure for OpenVPN we must configure a few variables that the easy-rsa scripts will use to generate the scripts. These variables are set near the end of the `/etc/openvpn/easy-rsa/2.0/vars` file. Here is an example of the relevant values.

{{< file "/etc/openvpn/easy-rsa/2.0/vars" >}}
export KEY_COUNTRY="US"
export KEY_PROVINCE="OH"
export KEY_CITY="Oxford"
export KEY_ORG="My Company"
export KEY_EMAIL="username@example.com"

{{< /file >}}


Alter the examples to reflect your configuration. This information will be included in certificates you create and it is important that the information be accurate, particularly the `KEY_ORG` and `KEY_EMAIL` values.

### Initialize the Public Key Infrastructure (PKI)

Issue the following three commands in sequence to initialize the certificate authority and the public key infrastructure:

    cd /etc/openvpn/easy-rsa/2.0/
    . /etc/openvpn/easy-rsa/2.0/vars
    . /etc/openvpn/easy-rsa/2.0/clean-all
    . /etc/openvpn/easy-rsa/2.0/build-ca

These scripts will prompt you to enter a number of values. By configuring the `vars` you can be sure that your PKI is configured properly. If you set the correct values in `vars`, you will be able to press return at each prompt.

### Generate Certificates and Private Keys

With the certificate authority generated you can generate the private key for the server. To accomplish this, issue the following command:

    . /etc/openvpn/easy-rsa/2.0/build-key-server server

This script will also prompt you for additional information. By default, the `Common Name` for this key will be "server". You can change these values in cases where it makes sense to use alternate values. The challenge password and company names are optional and can be left blank. When you've completed the question section you can confirm the signing of the certificate and the "certificate requests certified" by answering "yes" to these questions.

With the private keys generated, we can create certificates for all of the VPN clients. Issue the following command:

    . /etc/openvpn/easy-rsa/2.0/build-key client1

Replace the `client1` parameter with a relevant identifier for each client. You will want to generate a unique key for every user of the VPN. Each key should have its own unique identifier. All other information can remain the same. If you need to add users to your OpenVPN at any time, repeat this step to create additional keys.

### Generate Diffie Hellman Parameters

The "Diffie Hellman Parameters" govern the method of key exchange and authentication used by the OpenVPN server. Issue the following command to generate these parameters:

    . /etc/openvpn/easy-rsa/2.0/build-dh

This should produce the following output:

    Generating DH parameters, 1024 bit long safe prime, generator 2
    This is going to take a long time

This will be followed by a quantity of seemingly random output. The task has succeeded.

### Relocate Secure Keys

The `/etc/openvpn/easy-rsa/2.0/keys/` directory contains all of the keys that you have generated using the `easy-rsa` tools.

In order to authenticate to the VPN, you'll need to copy a number of certificate and key files to the remote client machines. They are:

-   `ca.crt`
-   `client1.crt`
-   `client1.key`

You can use the `scp` tool, or any [other means of transferring](/docs/tools-reference/linux-system-administration-basics#upload-files-to-a-remote-server). Be advised, these keys should transferred with the utmost attention to security. Anyone who has the key or is able to intercept an unencrypted copy of the key will be able to gain full access to your virtual private network.

Typically we recommend that you encrypt the keys for transfer, either by using a protocol like SSH, or by encrypting them with the PGP tool.

The keys and certificates for the server need to be relocated to the `/etc/openvpn` directory so the OpenVPN server process can access them. These files are:

-   `ca.crt`
-   `ca.key`
-   `dh1024.pem`
-   `server.crt`
-   `server.key`

Issue the following commands:

    cd /etc/openvpn/easy-rsa/2.0/keys
    cp ca.crt ca.key dh1024.pem server.crt server.key /etc/openvpn

These files need not leave your server. Maintaining integrity and control over these files is of the utmost importance to the integrity of your server. If you ever need to move or back up these keys, ensure that they're encrypted and secured. If these files are compromised, they will need to be recreated along with all client keys.

### Revoking Client Certificates

If you need to remove a user's access to the VPN server, issue the following command sequence.

    . /etc/openvpn/easy-rsa/2.0/vars
    . /etc/openvpn/easy-rsa/2.0/revoke-full client1

This will revoke the ability of users who have the `client1` certificate to access the VPN. For this reason, keeping track of which users are in possession of which certificates is crucial.

# Configuring the Virtual Private Network

We'll now need to configure our server file. There's an example file in `/usr/share/doc/openvpn/examples/sample-config-files`. Issue the following sequence of commands to retrieve the example configuration file and move it to the `/etc/openvpn` directory:

    cd /usr/share/doc/openvpn/examples/sample-config-files
    gunzip -d server.conf.gz
    cp server.conf /etc/openvpn/
    cp client.conf ~/
    cd ~/

Modify the `remote` line in your `~/client.conf` file to reflect the OpenVPN server's name.

{{< file "~/client.conf" >}}
# The hostname/IP and port of the server.
# You can have multiple remote entries
# to load balance between the servers.
remote example.com 1194

{{< /file >}}


Edit the `client.conf` file to reflect the name of your key. In this example we use `client1` for the file name.

{{< file "~/client.conf" >}}
# SSL/TLS parms.
# See the server config file for more
# description. It's best to use
# a separate .crt/.key file pair
# for each client. A single ca
# file can be used for all clients.
ca ca.crt
cert client1.crt
key client1.key

{{< /file >}}


Copy the `~/client.conf` file to your client system. You'll need to repeat the entire key generation and distribution process for every user and every key that will connect to your network.

# Connect to the OpenVPN

To initialize the OpenVPN server process, run the following command:

    /etc/init.d/openvpn start

This will scan the `/etc/openvpn` directory on the server for files with a `.conf` extension. For every file that it finds, it will create and run a VPN daemon (server).

The process for connecting to the VPN varies depending on your specific operating system and distribution running on the *client* machine. You will need to install the OpenVPN package for your operating system if you have not already done so.

Most network management tools provide some facility for managing connections to a VPN. Configure connections to your OpenVPN through the same interface where you might configure wireless or ethernet connections. If you choose to install and manage OpenVPN manually, you will need to place the `client1.conf` file and the requisite certificate files in the *local* machine's `/etc/openvpn` directory, or equivalent location.

If you use OS X on a Mac, we have found that the [Tunnelblick](http://code.google.com/p/tunnelblick/) tool provides an easy method for managing OpenVPN connections. If you use Windows, the [OpenVPN GUI](http://openvpn.se/) tool may be an effective tool for managing your connections too. Linux desktop users can install the OpenVPN package and use the network management tools that come with your desktop environment.

# Using OpenVPN

### Connect Remote Networks Securely With the VPN

Once configured, the OpenVPN server allows you to encrypt traffic between your local computer and your Linode's local network. While all other traffic is handled in the conventional manner, the VPN allows traffic on non-public interfaces to be securely passed through your Linode. This will also allow you to connect to the local area network in your Linode's data center if you are using the LAN to connect to multiple Linodes in the same datacenter. Using OpenVPN in this manner is supported by the default configuration, and if you connect to the OpenVPN you have configured at this point you will have access to this functionality.

### Tunnel All Connections through the VPN

By deploying the following configuration, you will be able to forward *all* traffic from client machines through your Linode, and encrypt it with transport layer security (TLS/SSL) between the client machine and the Linode. Begin by adding the following parameter to the `/etc/openvpn/server.conf` file to enable "full tunneling":

{{< file-excerpt "/etc/openvpn/server.conf" >}}
push "redirect-gateway def1"

{{< /file-excerpt >}}


Now edit the `/etc/sysctl.conf` file to uncomment or add the following line to ensure that your system is able to forward IPv4 traffic:

{{< file-excerpt "/etc/sysctl.conf" >}}
net.ipv4.ip_forward=1

{{< /file-excerpt >}}


Issue the following command to set this variable for the current session:

    echo 1 > /proc/sys/net/ipv4/ip_forward

Issue the following commands to configure `iptables` to properly forward traffic through the VPN:

    iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
    iptables -A FORWARD -s 10.8.0.0/24 -j ACCEPT
    iptables -A FORWARD -j REJECT
    iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE

Before continuing, insert these `iptables` rules into your system's `/etc/rc.local` file to ensure that these `iptables` rules will be recreated following your next reboot cycle:

{{< file-excerpt "/etc/rc.local" >}}
#!/bin/sh -e
#
# [...]
#

iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -s 10.8.0.0/24 -j ACCEPT
iptables -A FORWARD -j REJECT
iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE

exit 0

{{< /file-excerpt >}}


This will enable all client traffic *except* DNS queries to be forwarded through the VPN. To forward DNS traffic through the VPN you will need to install the `dnsmasq` package and modify the `/etc/opnevpn/server.conf` package. Install the `dnsmasq` package with the following command:

    apt-get install dnsmasq

After completing the installation the configuration will need to be modified so that dnsmasq is not listening on a public interface. You will need to find the following lines in the configuration file and make sure the lines are uncommented and have the appropriate values:

{{< file-excerpt "/etc/dnsmasq.conf" >}}
listen-address=127.0.0.1,10.8.0.1

bind-interfaces

{{< /file-excerpt >}}


This will configure dnsmasq to listen on localhost and the gateway IP address of your OpenVPN's tun device.

When your system boots, dnsmasq will try to start prior to the OpenVPN tun device being enabled. This will cause dnsmasq to fail at boot. To ensure that dnsmasq is properly started at boot, you'll need to modify your `/etc/rc.local` file once again. By adding the following line, dnsmasq will start after all the init scripts have finished. You should place the restart command below your iptables rules:

{{< file-excerpt "/etc/rc.local" >}}
/etc/init.d/dnsmasq restart

exit 0

{{< /file-excerpt >}}


Add the following directive to the `/etc/openvpn/server.conf` file:

{{< file-excerpt "/etc/openvpn/server.conf" >}}
push "dhcp-option DNS 10.8.0.1"

{{< /file-excerpt >}}


Finally, before attempting to connect to the VPN in any configuration, restart the OpenVPN server and dnsmasq by issuing the following commands:

    /etc/init.d/openvpn restart
    /etc/init.d/dnsmasq restart

Once these configuration options have been implemented, you can test the VPN connection by connecting to the VPN from your local machine, and access one of the many websites that will display your IP address. If the IP address displayed matches the IP address of your Linode, all network traffic from your local machine will be filtered through your Linode and encrypted over the VPN between your Linode and your local machine. If, however, your apparent public IP address is different from your Linode's IP address, your traffic is not being filtered through your Linode or encrypted by the VPN.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Official OpenVPN Documentation](http://openvpn.net/index.php/open-source/documentation/howto.html)
- [Tunnelblick OS X OpenVPN Client](http://code.google.com/p/tunnelblick/)
- [OpenVPN GUI for Windows](http://openvpn.se/)
- [Network Manager GNOME Configuration Management Tool](http://projects.gnome.org/NetworkManager/)



