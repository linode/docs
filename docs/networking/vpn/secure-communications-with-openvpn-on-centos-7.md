---
author:
  name: Linode
  email: docs@linode.com
description: 'Use OpenVPN to securely connect separate networks on a CentOS 7 Linux VPS.'
keywords: 'openvpn,networking,vpn,centos'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['networking/openvpn/centos-7/']
modified: Thursday, October 19th, 2014
modified_by:
  name: Dakota Schneider
published: 'Thursday, August 22nd, 2013'
title: 'Secure Communications with OpenVPN on Ubuntu 12.04 (Precise) and Debian 7'
---

OpenVPN, or Open Virtual Private Network, is a tool for creating networking "tunnels" between and among groups of computers that are not on the same local network. This is useful if you have services on a local network and need to access them remotely but don't want these services to be publicly accessible. By integrating with OpenSSL, OpenVPN can encrypt all VPN traffic to provide a secure connection between machines.

For many private networking tasks, Linode encourages users to consider the many capabilities of the OpenSSH package which can provide easier VPN and VPN-like services. OpenSSH is also installed and configured by default on all Linodes. Nevertheless, if your deployment requires a more traditional VPN solution like OpenVPN, this document covers the installation and configuration of the OpenVPN software, using Easy-RSA to generate certificates.

Before installing OpenVPN, we assume that you have followed the [getting started guide](/docs/getting-started/). If you're new to Linux server administration you may be interested in the [using Linux](/docs/using-linux/) document series including the [beginner's guide](/docs/beginners-guide/) and [administration basics guide](/docs/using-linux/administration-basics). If you're concerned about securing and "hardening" the system on your Linode, you might be interested in the [security basics](/docs/security/basics) and [securing your server](https://www.linode.com/docs/security/securing-your-server) articles as well.

Installing OpenVPN
------------------

The packages required to install OpenVPN and its dependencies are not available in the standard CentOS repositories. As a result, in order to install OpenVPN, you must install the "[EPEL](https://fedoraproject.org/wiki/EPEL)" system. EPEL, or "Extra Packages for Enterprise Linux," is a product of the Fedora Project that attempts to provide Enterprise-grade software that's more current than what is typically available in the CentOS repositories. Enable EPEL with the following command:

    yum install epel-release

Make sure your package repositories and installed programs are up to date by issuing the following command:

    yum update

Now we can install OpenVPN and Easy-RSA and with the following command:

    yum install openvpn easy-rsa

Easy-RSA is a set of encryption related tools that we'll use to generate security certificates and key pars.

These scripts are located by default in the `/usr/share/easy-rsa/` directory. However, in order to function properly, these scripts should be located in the `/etc/openvpn` directory. Copy the files with the following command:

    cp -R /usr/share/easy-rsa/ /etc/openvpn

Most of the relevant configuration for the OpenVPN public key infrastructure is contained in `/etc/openvpn/easy-rsa/2.0/`, and much of our configuration will be located in this directory.

### Configure Public Key Infrastructure Variables

Before we can generate the public key infrastructure for OpenVPN we must configure a few variables that the easy-rsa scripts will use to generate the commands. These variables are set near the end of the `/etc/openvpn/easy-rsa/2.0/vars` file. Here is an example of the relevant values:

{: .file }
/etc/openvpn/easy-rsa/2.0/vars
:   ~~~
    export KEY_COUNTRY="US"
    export KEY_PROVINCE="OH"
    export KEY_CITY="Oxford"
    export KEY_ORG="My Company"
    export KEY_EMAIL="squire@example.com"
    ~~~

Alter the examples to reflect your configuration. This information will be included in certificates you create and it is important that the information be accurate, particularly the `KEY_ORG` and `KEY_EMAIL` values.

### Initialize the Public Key Infrastructure (PKI)

Issue the following three commands in sequence to initialize the certificate authority and the public key infrastructure:

    cd /etc/openvpn/easy-rsa/2.0/
    . /etc/openvpn/easy-rsa/2.0/vars
    . /etc/openvpn/easy-rsa/2.0/clean-all
    . /etc/openvpn/easy-rsa/2.0/build-ca

These scripts will prompt you to enter a number of values. By configuring the `vars` you can be sure that your PKI is configured properly. If you set the correct values in `vars`, you will be able to press return at each prompt.

### Generate Certificates and Private Keys

With the certificate authority configured you can generate the private key for the server. To accomplish this, issue the following command:

    . /etc/openvpn/easy-rsa/2.0/build-key-server server

This script will also prompt you for additional information. By default, the `Common Name` for this key will be "server". You can change these values in cases where it makes sense to use alternate values. The challenge password and company names are optional and can be left blank. When you've completed the question section you can confirm the signing of the certificate and the "certificate requests certified" by answering "yes" to these questions.

With the private keys generated, we can create certificates for all of the VPN clients. Issue the following command:

    . /etc/openvpn/easy-rsa/2.0/build-key client1

Replace the `client1` parameter with a relevant identifier for each client. You will want to generate a unique key for every user of the VPN. Each key should have its own unique identifier. All other information can remain the same. If you need to add users to your network at any time, repeat this step to create additional keys. Every connection needs its own key pair, so if a user has multiple devices that may need to connect simultaneously, e.g. laptop and a workstation, you will need to generate two keys for that user, one for each device.

### Generate Diffie Hellman Parameters

The "Diffie Hellman Parameters" govern the method of key exchange and authentication used by the OpenVPN server. Issue the following command to generate these parameters (previous versions generated 1024-bit dh, current versions generate 2048-bit):

    . /etc/openvpn/easy-rsa/2.0/build-dh

This should produce the following output:

    Generating DH parameters, 2048 bit long safe prime, generator 2
    This is going to take a long time

This will be followed by a quantity of seemingly random output. The task has succeeded.

### Relocate Secure Keys

The `/etc/openvpn/easy-rsa/2.0/keys/` directory contains all of the keys that you have generated using the `easy-rsa` tools.

In order to authenticate to the VPN, you'll need to copy a number of certificate and key files to the remote client machines. They are:

-   `ca.crt`
-   `client1.crt`
-   `client1.key`

You can use the `scp` tool, or any [other means of transferring](/docs/using-linux/administration-basics#how_to_upload_files_to_a_remote_server). Be advised, these keys should transferred with the utmost attention to security. Anyone who has the key or is able to intercept an unencrypted copy of the key will be able to gain full access to your virtual private network.

Typically we recommend that you encrypt the keys for transfer, either by using a protocol like SSH, or by encrypting them with the PGP tool.

The keys and certificates for the server need to be relocated to the `/etc/openvpn` directory so the OpenVPN server process can access them. These files are:

-   `ca.crt`
-   `ca.key`
-   `dh2048.pem`
-   `server.crt`
-   `server.key`

Issue the following commands:

    cd /etc/openvpn/easy-rsa/2.0/keys
    cp ca.crt ca.key dh2048.pem server.crt server.key /etc/openvpn

These files need not leave your server. Maintaining integrity and control over these files is of the utmost importance to the integrity of your server. If you ever need to move or back up these keys, ensure that they're encrypted and secured. *If these files are compromised, they will need to be recreated along with all client keys*.

### Revoking Client Certificates

If you need to remove a user's access to the VPN server, issue the following command sequence.

    . /etc/openvpn/easy-rsa/2.0/vars
    . /etc/openvpn/easy-rsa/2.0/revoke-full client1

This will revoke the ability of users who have the `client1` certificate to access the VPN. For this reason, keeping track of which users are in possession of which certificates is crucial.

Configuring the Virtual Private Network
---------------------------------------

We'll now need to configure our server file. There is an example file in `/usr/share/doc/openvpn-2.1.4/examples/sample-config-files`. Issue the following sequence of commands to retrieve the example configuration files and move them to the required directories:

    cp /usr/share/doc/openvpn-*/sample/sample-config-files/server.conf /etc/openvpn/
    cp /usr/share/doc/openvpn-*/sample/sample-config-files/client.conf ~/
    cd ~/

Edit the `/etc/openvpn/server.conf` file and ensure that the Diffie hellman Parameters match the content below.

{: .file }
/etc/openvpn/server.conf
:   ~~~
    # Diffie hellman parameters.
    # Generate your own with:
    #   openssl dhparam -out dh1024.pem 1024
    # Substitute 2048 for 1024 if you are using
    # 2048 bit keys.
    dh dh2048.pem
    ~~~

Modify the `remote` line in your `~/client.conf` file to reflect the OpenVPN server's name.

{: .file }
~/client.conf
:   ~~~
    # The hostname/IP and port of the server.
    # You can have multiple remote entries
    # to load balance between the servers.
    remote example.com 1194
    ~~~

Edit the `client.conf` file to reflect the name of your key. In this example we use `client1` for the file name.

{: .file }
~/client.conf
:   ~~~
    # SSL/TLS parms.
    # See the server config file for more
    # description. It's best to use
    # a separate .crt/.key file pair
    # for each client. A single ca
    # file can be used for all clients.
    ca ca.crt
    cert client1.crt
    key client1.key
    ~~~

Copy the `~/client1.conf` file to your client system. You'll need to repeat the entire key generation and distribution process for every user and every key that will connect to your network.

Connect to the OpenVPN
----------------------

As of version 7, CentOS no longer uses `init.d` scripts for most service control tasks. This includes OpenVPN, which is now controlled through `systemctl` (documentation on this system specifically regarding OpenVPN can be found in [the ArchLinux Wiki](https://wiki.archlinux.org/index.php/OpenVPN#systemd_service_configuration)). To initialize the OpenVPN server process, run the following command:

    systemctl start openvpn@server.service

If you renamed your server configuration file (ours is named `server.conf`, note the syntax for the above command , when generalized, is `systemctl enable openvpn@<configuration>.service` where <configuration> matches the name of `/etc/openvpn/<configuration>.conf` that describes the server configuration.

You can have multiple configurations for VPNs on a single server, and this syntax allows them to be controlled individually.

To enable OpenVPN to start on the following boot, issue the following command:

    systemctl enable openvpn@server.service

The process for connecting to the VPN varies depending on your specific operating system and distribution running on the *client* machine. You will need to install the OpenVPN package for your operating system if you have not already done so.

Most network management tools provide some facility for managing connections to a VPN. Configure connections to your OpenVPN through the same interface where you might configure wireless or ethernet connections. If you choose to install and manage OpenVPN manually, you will need to place the the `client1.conf` file and the requisite certificate files in the *local* machine's `/etc/openvpn` directory, or equivalent location.

If you use OS X on a Mac, we have found that the [Tunnelblick](http://code.google.com/p/tunnelblick/) tool provides an easy method for managing OpenVPN connections. If you use Windows, the [OpenVPN GUI](http://openvpn.se/) tool may be an effective tool for managing your connections too. If you use OS X and Windows, you may prefer the multiplatform tool [Viscosity](https://www.sparklabs.com/viscosity/). Linux desktop users can install the OpenVPN package and use the network management tools that come with your desktop environment. iOS users can use [OpenVPN Connect](https://itunes.apple.com/us/app/openvpn-connect/id590379981?mt=8).

Using OpenVPN
-------------

### Connect Remote Networks Securely With the VPN

Once configured, the OpenVPN server allows you to encrypt traffic between your local computer and your Linode's local network. While all other traffic is handled in the conventional manner, the VPN allows traffic on non-public interfaces to be securely passed through your Linode. This will also allow you to connect to the local area network in your Linode's data center if you are using the LAN to connect to multiple Linodes in the same datacenter. Using OpenVPN in this manner is supported by the default configuration, and if you connect to the OpenVPN you have configured at this point, you will have access to this functionality.

### Tunnel All Connections through the VPN

By deploying the following configuration, you will be able to forward *all* traffic from client machines through your Linode, and encrypt it with transport layer security (TLS/SSL) between the client machine and the Linode. Begin by adding the following parameter to the `/etc/openvpn/server.conf` file to enable "full tunneling":

{: .file-excerpt }
/etc/openvpn/server.conf
:   ~~~
    push "redirect-gateway def1 bypass-dhcp"
    ~~~

Now edit the `/etc/sysctl.conf` file to modify the following line to ensure that your system is able to forward IPv4 traffic:

{: .file-excerpt }
/etc/sysctl.conf
:   ~~~
    net.ipv4.ip_forward = 1
    ~~~

Issue the following command to set this variable for the current session:

    echo 1 > /proc/sys/net/ipv4/ip_forward

As of version 7, CentOS uses [firewalld](http://fedoraproject.org/wiki/Features/firewalld-default) to manage firewalls. For now, we'll revert to the old `iptables` system as documented on the [Fedora Project Wiki](http://fedoraproject.org/wiki/FirewallD#Using_static_firewall_rules_with_the_iptables_and_ip6tables_services):

    yum install iptables-services
    systemctl mask firewalld.service
    systemctl enable iptables.service
    systemctl enable ip6tables.service

Issue the following commands to configure `iptables` to properly forward traffic through the VPN:

    iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
    iptables -A FORWARD -s 10.8.0.0/24 -j ACCEPT
    iptables -A FORWARD -j REJECT
    iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE

Before continuing, insert these `iptables` rules into your system's `/etc/rc.local` file to ensure that theses `iptables` rules will be recreated following your next reboot cycle:

{: .file-excerpt }
/etc/rc.local
:   ~~~
    #!/bin/sh
    #
    # [...]
    #

    iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
    iptables -A FORWARD -s 10.8.0.0/24 -j ACCEPT
    iptables -A FORWARD -j REJECT
    iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE

    touch /var/lock/subsys/local
    ~~~

Finally, we'll disable `firewalld` and set `iptables` to start at boot:

    systemctl stop firewalld.service
    systemctl start iptables.service
    systemctl start ip6tables.service

This will enable all client traffic *except* DNS queries to be forwarded through the VPN. To forward DNS traffic through the VPN you will need to install the `dnsmasq` package and modify `/etc/openvpn/server.conf`. Begin by issuing the following command to install the service:

    yum install dnsmasq

After completing the installation the configuration will need to be modified so that dnsmasq is not listening on a public interface. You will need to find the following lines in the configuration file and make sure the lines are uncommented and have the appropriate values:

{: .file-excerpt }
/etc/dnsmasq.conf
:   ~~~
    listen-address=127.0.0.1,10.8.0.1

    bind-interfaces
    ~~~

This will configure dnsmasq to listen on localhost and the gateway IP address of your OpenVPN's tun device.

When your system boots, dnsmasq will try to start prior to the OpenVPN tun device being enabled. This will cause dnsmasq to fail at boot. To ensure that dnsmasq is properly started at boot, you'll need to modify your `/etc/rc.local` file once again. By adding the following line, dnsmasq will start after all the init scripts have finished. You should place the restart command below your iptables rules:

{: .file-excerpt }
/etc/rc.local
:   ~~~
    /etc/init.d/dnsmasq restart

    touch /var/lock/subsys/local
    ~~~

Add the following directive to the `/etc/openvpn/server.conf` file:

{: .file-excerpt }
/etc/openvpn/server.conf
:   ~~~
    push "dhcp-option DNS 10.8.0.1"
    ~~~

Finally, *before attempting to connect to the VPN in any configuration, restart the OpenVPN server*. You will also need to start dnsmasq and configure it to start at boot by issuing the following commands:

    systemctl restart openvpn@server.service
    service dnsmasq restart
    systemctl enable dnsmasq

Once these configuration options have been implemented, you can test the VPN connection by connecting to the VPN from your local machine, and access one of the many websites that will display your IP address. If the IP address displayed matches the IP address of your Linode, all network traffic from your local machine will be filtered through your Linode and encrypted over the VPN between your Linode and your local machine. If, however, your apparent public IP address is different from your Linode's IP address, your traffic is not being filtered through your Linode or encrypted by the VPN.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Official OpenVPN Documentation](http://openvpn.net/index.php/open-source/documentation/howto.html)
- [Tunnelblick OS X OpenVPN Client](http://code.google.com/p/tunnelblick/)
- [OpenVPN GUI for Windows](http://openvpn.se/)
- [Network Manager GNOME Configuration Management Tool](http://projects.gnome.org/NetworkManager/)


