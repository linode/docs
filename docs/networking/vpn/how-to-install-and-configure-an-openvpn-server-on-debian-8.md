---
author:
  name: Linode
  email: docs@linode.com
description: 'Use OpenVPN to securely connect separate networks on an Ubuntu 12.04 (Precise) or Debian 7 Linux VPS.'
keywords: 'openvpn,vpn,debian 7,debian 8,debian jessie,debian wheezy'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: 'Thursday, September 3, 2015'
modified_by:
  name: Linode
published: 'Thursday, September 3, 2015'
title: 'How to Set up a Hardened OpenVPN Server on Debian 8'
external_resources:
 - '[Official OpenVPN Documentation](https://openvpn.net/index.php/open-source/documentation/howto.html)'
 - '[Tunnelblick OS X OpenVPN Client](http://code.google.com/p/tunnelblick/)'
 - '[OpenVPN GUI for Windows](https://tunnelblick.net/)'
 - '[Network Manager GNOME Configuration Management Tool](https://wiki.gnome.org/Projects/NetworkManager)'
---

[OpenVPN](https://openvpn.net/) is a tool for creating networking tunnels between and among groups of computers that are not on the same local network. This is useful if you want to remotely access services on a local network without making them publicly accessible. By integrating with OpenSSL, OpenVPN can encrypt all VPN traffic to provide a secure connection between machines.

This guide the first of a three part series. Part one will set you up with a hardened VPN server in Debian or Ubuntu and prepare the certificate and key pairs for connecting client devices. Part two will show you how to tunnel all traffic from client devices through your Linode's VPN and out to the internet, and part three walks through setting up the client-side software for various operating systems.

{: .note }
>
>For many private networking tasks, we suggest that you consider the functions of the OpenSSH package which can provide easier VPN and VPN-like services. OpenSSH is also installed and configured by default on all Linodes. For example, see [Using SSHFS on Linux and MacOS X](/docs/networking/ssh-filesystems) or our guide on [Setting up an SSH Tunnel](/docs/networking/ssh/setting-up-an-ssh-tunnel-with-your-linode-for-safe-browsing) for more information. Nevertheless, if your deployment requires a more traditional VPN solution like OpenVPN, this document covers the installation and configuration of the OpenVPN software.

## Before You Begin

1.  Ensure that you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and the Linode's [hostname is set](/docs/getting-started#setting-the-hostname).

    To check your hostname run:

        hostname
        hostname -f

    The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

2.  Update your system.

        sudo yum update

## Configure the OpenVPN Server

Start by installing OpenVPN:

    sudo apt-get install openvpn

### Create a Firewall Ruleset

#### IPv4

1.  Flush any pre-existing rules and chains which may be in the system.

        sudo iptables -F && sudo iptables -X

2.  Create a temporary file and paste in the ruleset below. The `TUN` virtual interface is how the OpenVPN daemon communicates with your Linode's `eth0` hardware interface.

    {:. file}
    /tmp/myiptables
    :   ~~~ conf

        *filter

        #Set all default policies to drop anything not specified below.
        -P INPUT ACCEPT
        -P FORWARD DROP
        -P OUTPUT DROP

        #Allow loopback interface to only 127.0.0.1.
        -A INPUT -i lo -d 127.0.0.1 -j ACCEPT
        -A OUTPUT -o lo -d 127.0.0.1 -j ACCEPT

        #Allow pings.
        -A INPUT -p icmp --icmp-type echo-request -j ACCEPT
        -A OUTPUT -p icmp --icmp-type echo-reply -j ACCEPT

        #Allow SSH.
        -A INPUT -i eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 22 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state ESTABLISHED --sport 22 -j ACCEPT

        #Allow limited DNS resolution and HTTP/S.
        #Necessary for updating the server and keeping time.
        -A INPUT -i eth0 -p udp -m state --state ESTABLISHED --sport 53 -j ACCEPT
        -A OUTPUT -o eth0 -p udp -m state --state NEW,ESTABLISHED --dport 53 -j ACCEPT

        -A INPUT -i eth0 -p tcp -m state --state ESTABLISHED --sport 80 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m state --state ESTABLISHED --sport 443 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 80 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 443 -j ACCEPT

        #Allow UDP traffic to port 1194.
        -A INPUT -i eth0 -p udp -m state --state NEW --dport 1194 -j ACCEPT
        -A OUTPUT -o eth0 -p udp -m state --state ESTABLISHED --sport 1194 -j ACCEPT

        #Allow traffic on the TUN interface.
        -A INPUT -i tun+ -j ACCEPT
        -A OUTPUT -o tun+ -j ACCEPT

        #Log and reject any packets which
        #don't fit the rules above.
        -A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 4
        -A INPUT -j REJECT

        COMMIT
        ~~~

    {: .note }
    >
    >For more specialized firewall rules, see: `/usr/share/doc/openvpn/examples/sample-config-files/firewall.sh`.

3.  Import the ruleset. The command should complete with no output.

        sudo iptables-restore < /tmp/myiptables

    You can see your loaded rule list with `sudo iptables -S`.

4.  To make the rules persistent across reboots, install `iptables-persistent` and answer `yes` to save the current ruleset for IPv4 and `no` for IPv6.

        sudo apt-get install iptables-persistent

#### IPv6

**If you do not need IPv6 access** to your OpenVPN server, disable it by adding the following lines to `/etc/sysctl.d/99-sysctl.conf`:

    net.ipv6.conf.all.disable_ipv6 = 1
    net.ipv6.conf.default.disable_ipv6 = 1
    net.ipv6.conf.lo.disable_ipv6 = 1
    net.ipv6.conf.eth0.disable_ipv6 = 1

To activate the sysctl changes immediately:

    sudo sysctl -p

Then go into `/etc/hosts` and comment out the line for IPv6 resolution over localhost.

{:. file-excerpt}
/etc/hosts
:   ~~~ ini
    #::1 localhost.localdomain localhost
    ~~~

**If you do want IPv6 access**, the process is the same as was for IPv4 above but subtitute the command `ip6tables` for `iptables`.

1.  Flush any previous rules.

        sudo ip6tables -F && sudo ip6tables -X

2.  Create a temporary rule list. The rules above work equally for both v4 and v6, but only choose those you would need. For example: You likely won't SSH into the server over IPv6, but you would want to accept the incoming traffic to port 1194 for OpenVPN.

3.  Import your rule list.

        sudo ip6tables-restore < /tmp/myip6tables

4.  Run `sudo iptables-persistent` again. Select `no` to save the current IPv4 rules and `yes` for IPv6 rules.

### Remove Unnecessary Network Services

By default, Debian installs with services listening on localhost for [Exim4](https://en.wikipedia.org/wiki/Exim), [NFS](https://en.wikipedia.org/wiki/Network_File_System) components, SSH and time synchronization (see `sudo netstat -tulpn`).

SSH is necessary to adminster your server and timekeeping is important, but if Exim and NFS are not needed, they should be uninstalled to reduce attack surface. *These steps are optional* but if unsure, at least disable them.

1.  Exim. Don't disable if you want to configure receiving administrative emails.
    
        sudo systemctl stop exim4.service
        sudo systemctl disable exim4.service

2.  `rpc-bind` and `rpc.statd` are needed for NFS; don't disable if you plan to use it. Reboot after disabling `rpcbind`.
    
        sudo systemctl stop rpcbind.service
        sudo systemctl disable rpcbind.service

    {: .note }
    >
    >If you do plan to use NFS on your Linode's VPN, see [our NFS guide](https://www.linode.com/docs/networking/basic-nfs-configuration-on-debian-7) to get started.

Run `sudo netstat -tulpn` again to view your listening network services. You should now only see listening services for SSH and NTP (network time protocol).

{: .note }
>
>NTPdate can be replaced with [OpenNTPD](https://en.wikipedia.org/wiki/OpenNTPD) (`sudo apt-get install openntpd`) if you prefer a time synchronization daemon which does not listen on all interfaces and do not require nanosecond accuracy.

If you want to later re-enable either service:

    sudo systemctl enable service_name.service
    sudo systemctl start service_name.service

### Prepare the OpenVPN Working Directory

1.  The OpenVPN client and server configuration files will be created in `/etc/openvpn/easy-rsa/`. Change to that location and run the `make-cadir` script to copy over all the necessary files from `/usr/share/doc/openvpn/examples/`

        cd /etc/openvpn/easy-rsa/
        sudo make-cadir /etc/openvpn/easy-rsa

2.  Create a symbolic link from `openssl-1.0.0.cnf` to `openssl.cnf`.

        ln -s openssl-1.0.0.cnf openssl.cnf

3.  [Source](http://stackoverflow.com/a/9326746) the `vars` script.

        source ./vars

    This will return: `NOTE: If you run ./clean-all, I will be doing a rm -rf on /etc/openvpn/easy-rsa/keys`

4.  Run the `clean-all` script to be sure you're starting with no samples or templates in your `keys` directory.

        ./clean-all

### Generate Diffie-Hellman PEM

The *Diffie-Hellman parameter* is a chunk of randomly generated data used to create a client's session key upon connection so [Perfect Forward Secrecy](https://en.wikipedia.org/wiki/Forward_secrecy#Perfect_forward_secrecy_.28PFS.29) is used. This data is contained in a `dh*.pem` file, where `*` indicates the bit length of the Diffie-Hellman key. 2048 bits is the default.

To generate the file:

    ./build-dh

This should produce the following output:

    Generating DH parameters, 2048 bit long safe prime, generator 2
    This is going to take a long time

This can take several minutes to complete. Once you're returned to the command prompt, the task has succeeded and the .pem file will be in `/etc/openvpn/easy-rsa/keys`.

{: .note }
>
>If you would prefer a stronger 4096 bit key, it will take longer to generate but otherwise incur unnoticeable overhead during connections. Instead of `.build-dh`, use: `sudo /usr/bin/openssl dhparam 4096 > /etc/openvpn/easy-rsa/keys/dh4096.pem`. The DH PEM file can arbitrily be deleted and regenerated with no changes needed to server or client settings.

### Harden OpenVPN

OpenVPN's server-side configuration file is `/etc/openvpn/server.conf` and it must be extracted from the archive of config templates.

    gunzip -c /usr/share/doc/openvpn/examples/sample-config-files/server.conf.gz > /etc/openvpn/server.conf

We'll make some changes and additions to this file to increase connection security and restrict the daemon's priviledges. These settings can be applied independently of each other and while not mandatory, they are highly recommended.

1.  Require a matching HMAC signature for all UDP packets involved in the TLS handshake between the OpenVPN server and connecting clients. Any packet without this signature is dropped.

    {: .file-exceprt}
    /etc/openvpn/server.conf
    :   ~~~ ini
    # For extra security beyond that provided
    # by SSL/TLS, create an "HMAC firewall"
    # to help block DoS attacks and UDP port flooding.
    #
    # Generate with:
    #   openvpn --genkey --secret ta.key
    #
    # The server and each client must have
    # a copy of this key.
    # The second parameter should be '0'
    # on the server and '1' on the clients.
    tls-auth ta.key 0 # This file is secret
    ~~~

    Uncomment `tls-auth ta.key 0 # This file is secret`. Then generate the key file. Later we'll transfer it to each client device.

        openvpn --genkey --secret /etc/openvpn/easy-rsa/keys/ta.key

2.  Uncomment the `user...` and `group...` lines so the OpenVPN daemon drops root priviledges after startup.

    {: .file-exceprt}
    /etc/openvpn/server.conf
    :   ~~~ ini
    # It's a good idea to reduce the OpenVPN
    # daemon's privileges after initialization.
    #
    # You can uncomment this out on
    # non-Windows systems.
    user nobody
    group nogroup
    ~~~

    {: .note }
    >
    >While the user `nobody` has much fewer priviledges than `root`, if `nobody` gets compromized, an intruder will have full access to anything else that user has access to. This includes other processes which run as `nobody` such as Apache and some cron jobs. The most secure option is to create a standard user for OpenVPN so it has no priviledges outside of those required to function.

3.  Force client/server authentication to take place over a connection using a minimum of TLS 1.2 specification (see `openssl ciphers -s 'TLSv1.2'` in a terminal). This also limits the cipher suites used to only those which support forward secrecy.

        echo 'tls-version-min 1.2' >> /etc/openvpn/server.conf

    The default here is to use a cipher suite which is agreed on by both client and server. Ciphers are ranked by preference on both ends an which ciphers are available depends on the version of OpenSSL used on the machine (see `openvpn --show-tls`).

4.  Force TLS connections for client/server authentication to take place using a specifc cipher suite, or list of cipher suites. This is a more exact alternative to step 3 above; there is no reason to use both. Chosen below is TLS 1.2 using RSA keys exchanged with a Diffie-Hellman agreement, AES 256 as a block cipher in GCM mode, and SHA384 for the message digest.

    [It is recommended](https://community.openvpn.net/openvpn/wiki/Hardening#Useof--tls-cipher), as long as server and clients support the cipher suite, to limit this as much as possible.

        echo 'tls-cipher TLS-DHE-RSA-WITH-AES-256-GCM-SHA384' >> /etc/openvpn/server.conf

    The default here works similar to TLS cipher suite negotiations for a handshake over HTTPS. OpenVPN and clients will reach an agreement on which cipher suite to use based on what is supported by their respective OpenSSL versions. See `openvpn --show-tls` for a list of supported ciphers in their order of preference.

5.  Change the VPN's data channel to use AES with a 256 bit key in CBC mode. Blowfish-128 is the default. AES_CBC is generally considered the most secure cipher/mode combination of those supported by OpenVPN (see `openvpn --show-ciphers`) and can take advantage of AES-NI for increased performance.

        echo 'cipher AES-256-CBC' >> /etc/openvpn/server.conf

6.  Change VPN data channel's authentication digest. SHA-1 is the default; see `openvpn --show-digests` for all supported digests.

        echo 'auth SHA384' >> /etc/openvpn/server.conf

## Certificate and Key Pairs

The OpenVPN server needs a private key which is used to create certificates for each client that will connect to it. The client keys are then transfererd to their respective client device. Creating the key pairs takes place in `/etc/openvpn/easy-rsa` so change to that location.

    cd /etc/openvpn/easy-rsa

All keys will be generated in `/etc/openvpn/easy-rsa/keys` but we must tell OpenVPN to look for them there. Edit `server.conf` with the appropriate paths.

{: .file-exceprt}
/etc/openvpn/server.conf
:   ~~~ ini
    # Any X509 key management system can be used.
    # OpenVPN can also use a PKCS #12 formatted key file
    # (see "pkcs12" directive in man page).
    /etc/openvpn/easy-rsa/keysca ca.crt
    /etc/openvpn/easy-rsa/keyscert server.crt
    /etc/openvpn/easy-rsa/keyskey server.key  # This file should be kept secret
    ~~~

### Server Credentials

1.  A *root certificate*, also referred to as a *Certificate Authority*, is the certificate and key pair that will be used to generate each client's keypair. At each prompt, fill out the information to be used in your certificate.

        ./build-ca

    {: .note}
    >
    >Use your server's hostname as the `Common Name`. The challenge password and company names are optional and can be left blank (press **Enter** at those prompts).

2.  Then create the server's private key and again fill in the information prompts.

        ./build-key-server server

    When you've completed the question section for the private key, confirm the signing of the certificate and the `certificate requests certified` by answering `yes` to those two questions.

### Client Credentials

Each client device connecting to the VPN should have its own unique key. Further, each key should have its own identifier (client1, client2, etc.) but all other information can remain the same. If you need to add users at any later time, repeat this step.

        ./build-key client1

{: .note}
>
>Anyone with access to `client1.key` will be able to access your VPN. To better protect against this scenario, you can issue `./build-key-pass client1` instead to build a client key which is encrypted with a passphrase.

## Next Steps

At this point, you should have a operational*** OpenVPN server and a set of certificat/key pairs for your intended client devices. If you want your client devices to have internet access from behind the VPN, see part two of this series.

If you only intend to use your OpenVPN server as an extension of your local network, move on to part three to get the client credentials uploaded and software installed.