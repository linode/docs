---
deprecated: true
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'Use OpenVPN to securely connect separate networks on an Ubuntu 12.04 (Precise) or Debian 7 Linode.'
keywords: ["openvpn", "networking", "vpn", "ubuntu", "ubuntu precise", "12.04", "debian 7", "debian"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['networking/openvpn/ubuntu-12-04-precise/']
modified: 2014-02-17
modified_by:
  name: Alex Fornuto
published: 2013-08-22
title: 'Secure Communications with OpenVPN on Ubuntu 12.04 (Precise) and Debian 7'
external_resources:
 - '[Official OpenVPN Documentation](http://openvpn.net/index.php/open-source/documentation/howto.html)'
 - '[Tunnelblick OS X OpenVPN Client](http://code.google.com/p/tunnelblick/)'
 - '[OpenVPN GUI for Windows](http://openvpn.se/)'
 - '[Network Manager GNOME Configuration Management Tool](http://projects.gnome.org/NetworkManager/)'
---

OpenVPN, or Open Virtual Private Network, is a tool for creating networking tunnels between and among groups of computers that are not on the same local network. This is useful if you want to remotely access services on a local network without making them publicly accessible. By integrating with OpenSSL, OpenVPN can encrypt all VPN traffic to provide a secure connection between machines.

Before installing OpenVPN, we assume that you have followed our [Getting Started Guide](/docs/getting-started/). If you're new to Linux server administration you may be interested in our [Introduction to Linux Concepts Guide](/docs/tools-reference/introduction-to-linux-concepts), [Beginner's Guide](/docs/beginners-guide/) and [Administration Basics Guide](/content/using-linux/administration-basics). If you're concerned about securing on your Linode, you might be interested in our [Security Basics](/content/security/basics) article as well.

{{< note >}}
For many private networking tasks, we suggest that you consider the functions of the OpenSSH package which can provide easier VPN and VPN-like services. OpenSSH is also installed and configured by default on all Linodes. For example, see [Using SSHFS on Linux and MacOS X](/docs/networking/ssh-filesystems) or our guide on [Setting up an SSH Tunnel](/docs/networking/ssh/setting-up-an-ssh-tunnel-with-your-linode-for-safe-browsing) for more information. Nevertheless, if your deployment requires a more traditional VPN solution like OpenVPN, this document covers the installation and configuration of the OpenVPN software.
{{< /note >}}

## How OpenVPN Works

Once configured, the OpenVPN server encrypts traffic between your local computer and your Linode's local network. While all other traffic is handled in the conventional manner, the VPN allows traffic on non-public interfaces to be securely passed through your Linode. This means you can connect to the local area network in your Linode's data center. Using OpenVPN in this manner is supported by the default configuration

[![Splash screen for TunnelBlick.](/docs/assets/1359-BasicVPNTraffic.jpg)](/docs/assets/1359-BasicVPNTraffic.jpg)

With the additional configuration we will set up at the end of this guide, all traffic coming from your local computer can be tunneled through the VPN server. This can be used to circumvent local traffic restrictions, or to mask the traffic coming from your computer.

[![Splash screen for TunnelBlick.](/docs/assets/1360-FullTunneling.jpg)](/docs/assets/1360-FullTunneling.jpg)

 {{< note >}}
Please note that only one public IP address is required to use OpenVPN
{{< /note >}}

## Installing OpenVPN

Follow these instructions to install OpenVPN:

1.  Update your package repositories with the following command:

        apt-get update

2.  Update your installed programs:

        apt-get upgrade

3.  Install the OpenVPN software with the following command:

        apt-get install openvpn

4.  The OpenVPN package provides a set of encryption-related tools called **easy-rsa**. In order for OpenVPN to function properly, these scripts should be located in the `/etc/openvpn/` directory. This is possible with the following command:

        cd /etc/openvpn/ && make-cadir easy-rsa

	Most of the relevant configuration for the OpenVPN public key infrastructure is contained in `/etc/openvpn/easy-rsa/`. We will create several files in this directory used to define the OpenVPN server and client security.

### Initializing the Public Key Infrastructure (PKI)

In this section, you will initialize the certificate authority and the public key infrastructure:

1.  Move into the `/etc/openvpn/easy-rsa/` directory:

        cd /etc/openvpn/easy-rsa/

2.  Create a symbolic link from `openssl-1.0.0.cnf` to `openssl.cnf`:

        ln -s openssl-1.0.0.cnf openssl.cnf

3.  Source the `vars` script:

        source ./vars

	This will return `NOTE: If you run ./clean-all, I will be doing a rm -rf on /etc/openvpn/easy-rsa/keys`

4.  Execute the `clean-all` script.

        ./clean-all

5.  Execute the `build-ca` script. At each prompt, fill out the information to be used in your certificate.

        ./build-ca

After doing this, your PKI should be configured properly.

### Generating Certificates and Private Keys

With the certificate authority generated, you can generate the private key for the server and certificates for all the VPN clients.

1.  Create the key with the following command:

        ./build-key-server server

2.  You will be prompted for additional information. Change the default values as necessary. By default, the `Common Name` for this key will be **server**. The challenge password and company names are optional and can be left blank.
3.  When you've completed the question section, confirm the signing of the certificate and the `certificate requests certified` by answering **yes** to these questions.
4.  With the private keys generated, create certificates for all of your VPN clients. Issue the following command:

        ./build-key client1

    {{< note >}}
Anyone with access to `client1.key` will be able to access your VPN. To better protect against this scenario, you can issue `./build-key-pass client1` instead to build a client key which is encrypted with a passphrase.
{{< /note >}}

5.  Repeat the previous step for each client, replacing `client1` with an appropriate identifier.

You should generate a unique key for every user of the VPN. Each key should have its own unique identifier, but all other information can remain the same. If you need to add users to your OpenVPN at any time, repeat step 4 to create additional keys.

### Generating Diffie Hellman Parameters

The **Diffie Hellman Parameters** govern the method of key exchange used by the OpenVPN server. By creating a .pem file, you create the parameters by which the OpenVPN server will initiate secured connections with the clients.

Issue the following command to generate the `.pem` file:

    ./build-dh

This should produce the following output:

    Generating DH parameters, 1024 bit long safe prime, generator 2
    This is going to take a long time

This will be followed by a quantity of seemingly random output. Once it brings you back to a command prompt, the task has succeeded. In the `keys` subdirectory it's created a file called `dh1024.pem` which will be used to generate secure connections to the VPN server's clients.

### Relocating Secure Keys

Move all of the secure keys to their proper locations by following these instructions:

1.  The `/etc/openvpn/easy-rsa/keys/` directory contains all of the keys and certificates for the server and its clients generated using the `easy-rsa` tools. Copy the following certificate and key files to the remote client machines, using **scp** or another [means of transferring](/docs/tools-reference/linux-system-administration-basics#upload-files-to-a-remote-server):

    -   `ca.crt`
    -   `client1.crt`
    -   `client1.key`

    {{< note >}}
Transfer these keys with the utmost attention to security. Anyone who has the key or is able to intercept an unencrypted copy of the key will be able to gain full access to your virtual private network. Typically we recommend that you encrypt the keys for transfer, either by using a protocol like SSH, or by encrypting them with the PGP tool.
{{< /note >}}

2.  On your server, change to the `/etc/openvpn/easy-rsa/keys` directory:

        cd /etc/openvpn/easy-rsa/keys

3.  Copy the keys to the `/etc/openvpn` directory of the server so the OpenVPN server process can access them:

        cp ca.crt ca.key dh1024.pem server.crt server.key /etc/openvpn

Keeping control of these files is of the utmost importance to the integrity of your server. If you ever need to move or back up these keys, ensure that they're encrypted and secured. If these files become compromised, they must be recreated along with all client keys.

### Revoking Client Certificates

If you need to remove a user's access to the VPN server, follow these instructions:

1.  Run the `vars` script. Note that for this script to function properly your working (current) directory must be /etc/openvpn/easy-rsa/ :

        source ./vars

2.  Run the `revoke-full` script, substituting **client1** with the name of the certificate you want to revoke:

        ./revoke-full client1

This will revoke the ability of all users using the `client1` certificate to access the VPN. Make sure you don't accidentally revoke access for someone who still needs it, and who uses that certificate.

### Configuring Server and Client Settings

In this section, you'll create two important configuration files. One is for the server and defines the scope and settings for the VPN. The other is for your local computer, and defines the settings you will pass on to your VPN client. For each client connecting to the VPN you will need to generate a separate configuration file.

1.  Configure your server file. There's an example file in `/usr/share/doc/openvpn/examples/sample-config-files` which you'll use as a starting point. First, extract and copy the file to the `/etc/openvpn/` directory:

        gunzip -c /usr/share/doc/openvpn/examples/sample-config-files/server.conf.gz >/etc/openvpn/server.conf

2.  Copy the `client.conf` file to your home directory:

        cp client.conf ~/

3.  Move to your home directory:

        cd ~

4.  Open your `~/client.conf` file for editing, and update the `remote` line to reflect the OpenVPN server's name:

        nano ~/client.conf

    {{< file "~/client.conf" >}}
# The hostname/IP and port of the server.
# You can have multiple remote entries
# to load balance between the servers.

remote example.com 1194

{{< /file >}}


5.  In the same file, `client.conf`, edit the `cert` and `key` lines to reflect the name of your key. In this example we use `client1` for the file name.

    {{< file "~/client.conf" >}}
# SSL/TLS parms.
# See the server config file for more
# description.  It's best to use
# a separate .crt/.key file pair
# for each client.  A single ca
# file can be used for all clients.
ca ca.crt
cert client1.crt
key client1.key

{{< /file >}}


6.  Copy the `~/client.conf` file to your client system.
7.  Repeat the entire key generation and distribution process for every user and every key that will connect to your network.
8. To start the OpenVPN server, run the following command:

        service openvpn start

This will scan the `/etc/openvpn` directory on the server for files with a `.conf` extension. For every file that it finds, it will create and run a VPN daemon (server).

## Installing Client-Side Software

The process for connecting to the VPN varies depending on the specific operating system and distribution running on the *client* machine. You will need to install the right OpenVPN package for your client operating system.

Most network management tools provide some facility for managing connections to a VPN. Configure connections to your OpenVPN through the same interface where you might configure wireless or ethernet connections. If you choose to install and manage OpenVPN manually, you will need to place the `client1.conf` file and the requisite certificate files in the *local* machine's `/etc/openvpn` directory, or equivalent location.

If you use OS X on a Mac, we have found that the [Tunnelblick](http://code.google.com/p/tunnelblick/) tool provides an easy method for managing OpenVPN connections. If you use Windows, the [OpenVPN GUI](http://openvpn.se/) tool may be an effective tool for managing your connections too. Linux desktop users can install the OpenVPN package and use the network management tools that come with the desktop environment.

Here we will go through installing Tunneblick on OSX:

1.  To download the latest version of Tunnelblick, [click here](https://tunnelblick.net/downloads.html#Tunnelblick_Stable_Release). After opening the dmg file you can drag it into applications or open it immediately and it will copy itself.
2.  After starting, you will see this splash screen:

    ![Splash screen for TunnelBlick.](/docs/assets/1346-tunnelblick2.png)

	At the next screen click the **I have configuration files** button.

    ![Splash screen for TunnelBlick.](/docs/assets/1342-tunnelblick1.png)

3.  At the next screen, click **OpenVPN Configuration(s)**:

    [![Splash screen for TunnelBlick.](/docs/assets/1347-tunnelblick3.png)](/docs/assets/1347-tunnelblick3.png)

4.  Tunnelblick will open a Finder window into which you can copy the client.conf and client1 ca, crt, and key files you created on the Linode and copied to this client machine. Follow the rest of the instructions shown in Tunnelblick to create and install your Tunnelblick configuration file.

## Connecting to the VPN

If you are using Tunnelblick, click on the tray icon to initiate the connection:

[![Splash screen for TunnelBlick.](/docs/assets/1351-tunnelblick7.png)](/docs/assets/1351-tunnelblick7.png)

A notification will show you the status as it connects:

[![Splash screen for TunnelBlick.](/docs/assets/1353-tunnelblick9.png)](/docs/assets/1353-tunnelblick9.png)

### Accessing your Linode over the VPN

Once you're connected to your VPN, you can SSH to another Linode over the private network. If you want to access files directly from your Linode, you will need to install a compatible network file sharing protocol, like [Samba](https://help.ubuntu.com/community/Samba/SambaServerGuide), [NFS](https://help.ubuntu.com/community/SettingUpNFSHowTo), or [Appletalk](https://help.ubuntu.com/community/AppleTalk).

### Tunneling All Connections through the VPN

By deploying the following configuration, you will be able to forward *all* traffic from client machines through your Linode, and encrypt it with transport layer security (TLS/SSL) between the client machine and the Linode.

1.  Uncomment the following parameter by removing the semicolon to the `/etc/openvpn/server.conf` file to enable full tunneling:

        nano /etc/openvpn/server.conf

    {{< file-excerpt "/etc/openvpn/server.conf" >}}
push "redirect-gateway def1 bypass-dhcp"

{{< /file-excerpt >}}


2.  Edit the `/etc/sysctl.conf` file to uncomment or add the following line to ensure that your system can forward IPv4 traffic:

        nano /etc/sysctl.conf

    {{< file-excerpt "/etc/sysctl.conf" >}}
net.ipv4.ip_forward=1

{{< /file-excerpt >}}


3.  Issue the following command to set this variable for the current session:

        echo 1 > /proc/sys/net/ipv4/ip_forward

4.  Issue the following set of commands, one line at a time, to configure `iptables` to properly forward traffic through the VPN:

        iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
        iptables -A FORWARD -s 10.8.0.0/24 -j ACCEPT
        iptables -A FORWARD -j REJECT
        iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE
        iptables -A INPUT -i tun+ -j ACCEPT
        iptables -A FORWARD -i tun+ -j ACCEPT
        iptables -A INPUT -i tap+ -j ACCEPT
        iptables -A FORWARD -i tap+ -j ACCEPT

5.  Add the same `iptables` rules to your system's `/etc/rc.local` file, so they will be recreated following your next reboot cycle:

        nano /etc/rc.local

    {{< file-excerpt "/etc/rc.local" >}}
#!/bin/sh -e
#
# [...]
#

iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -s 10.8.0.0/24 -j ACCEPT
iptables -A FORWARD -j REJECT
iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE
iptables -A INPUT -i tun+ -j ACCEPT
iptables -A FORWARD -i tun+ -j ACCEPT
iptables -A INPUT -i tap+ -j ACCEPT
iptables -A FORWARD -i tap+ -j ACCEPT

exit 0

{{< /file-excerpt >}}


    This will enable all client traffic except for DNS queries to be forwarded through the VPN.

6.  To forward DNS traffic through the VPN, you will need to install the `dnsmasq` package and modify the `/etc/opnevpn/server.conf` package. Install and configure the `dnsmasq` package with the following command:

        apt-get install dnsmasq && dpkg-reconfigure resolvconf

	{{< note >}}
If you are using Debian 7, replace this command with `apt-get install dnsmasq resolvconf` and skip steps 7 through 9
{{< /note >}}

7.  You will be presented with a series of options in an ncurses menu. First, choose **yes** to prepare `/etc/resolv.conf` for dynamic updates.

    [![A curses menu.](/docs/assets/1338-curses1.png)](/docs/assets/1338-curses1.png)

8.  At the next option select **No**. This means that you will need to update `/etc/network/interfaces` but won't need to remove the workaround afterwards.

    [![A curses menu.](/docs/assets/1339-curses2.png)](/docs/assets/1339-curses2.png)

9.  The third menu simply warns you that a reboot will be required to prevent a known bug.

    [![A curses menu.](/docs/assets/1340-curses3.png)](/docs/assets/1340-curses3.png)

10. Modify its configuration so that dnsmasq is not listening on a public interface. Open `/etc/dnsmasq.conf` for editing, and make sure the following lines are uncommented and have the appropriate values:

        nano /etc/dnsmasq.conf

    {{< file-excerpt "/etc/dnsmasq.conf" >}}
listen-address=10.8.0.1

bind-interfaces

{{< /file-excerpt >}}


11. Now that dnsmasq is configured, you will need to add two new lines to /etc/network/interfaces. First, go to the Linode's **Remote Access** page, shown below. You'll need the IP addresses listed under **DNS Resolvers** for the `dns-nameservers` line:

    [![DNS resolvers in the Linode Manager.](/docs/assets/1341-resolvers.png)](/docs/assets/1341-resolvers.png)

12. Open the interfaces file and insert the addresses listed under **DNS Resolvers**:

        nano /etc/network/interfaces

	{{< file-excerpt "/etc/network/interfaces" >}}
# The primary network interface
auto eth0
iface eth0 inet dhcp

dns-search members.linode.com
dns-nameservers 97.107.133.4 207.192.69.4 207.192.69.5

{{< /file-excerpt >}}
~

	{{< note >}}
If you're not utilizing IPv6, you can omit the addresses starting with 2600:
{{< /note >}}

13. When your system boots, dnsmasq will try to start before the OpenVPN tun device has been enabled. This will cause dnsmasq to fail at boot. To rectify this, modify your `/etc/rc.local` file to add a line that will restart dnsmasq after all the init scripts have finished. You should place the restart command after your iptables rules:

        nano /etc/rc.local

    {{< file-excerpt "/etc/rc.local" >}}
/etc/init.d/dnsmasq restart

exit 0

{{< /file-excerpt >}}


14. Add the following line to the `/etc/openvpn/server.conf` file:

        nano /etc/openvpn/server.conf

    {{< file-excerpt "/etc/openvpn/server.conf" >}}
push "dhcp-option DNS 10.8.0.1"

{{< /file-excerpt >}}


15. Restart the Linode:

        reboot

To test your connection, connect to the VPN connection from your local machine, then access one of the many [websites that will display your public IP address](http://www.whatismyip.com/). If the IP address displayed doesn't match the IP address of your Linode, your traffic is not being filtered through your Linode or encrypted by the VPN. If the IP matches, network traffic from your local machine is being filtered through your Linode and encrypted over the VPN, and you have successfully completed your OpenVPN setup!
