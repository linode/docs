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

[OpenVPN](https://openvpn.net/) is a tool for creating networking tunnels between and among groups of computers that are not on the same local network. This is useful if you want to remotely access services on a local network without making them publicly accessible. When integrated with OpenSSL, OpenVPN can encrypt all VPN traffic to provide a secure connection between machines.

This guide the first of a three part series. Part one will set you up with a hardened VPN server in Debian or Ubuntu and prepare the certificate and key pairs for connecting client devices. Part two will show you how to tunnel all traffic from client devices through your Linode's VPN and out to the internet, and part three walks through setting up the client-side software for various operating systems, including mobile platforms.

{: .note }
>
>For many private networking tasks, we suggest that you consider the functions of the OpenSSH package which can provide easier VPN and VPN-like services. OpenSSH is also installed and configured by default on all Linodes. For example, see [Using SSHFS on Linux and MacOS X](/docs/networking/ssh-filesystems) or our guide on [Setting up an SSH Tunnel](/docs/networking/ssh/setting-up-an-ssh-tunnel-with-your-linode-for-safe-browsing) for more information. Nevertheless, if your deployment requires a more traditional VPN solution like OpenVPN, this document covers the installation and configuration of the OpenVPN software.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Complete the beginning of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account and harden SSH access; this guide will use `sudo` wherever possible. Do **not** follow the Creating a Firewall section--this guide has instructions specifcally for firewall rules for an OpenVPN server.

3.  Update your system.

        sudo apt-get update && sudo apt-get upgrade

## Pre-Configure Debian

Two basic but significant steps in hardening a server are to set up restrictive firewall rules and disable unnecessary network services. We'll do this before even installing anything related to OpenVPN.

### Create Firewall Rulesets

#### IPv4

1.  Flush any pre-existing rules and non-standard chains which may be in the system.

        sudo iptables -F && sudo iptables -X

2.  See our [Securing Your Server](/docs/security/securing-your-server/#creating-a-firewall) guide and complete the section on iptables for Debian **using the ruleset below**:

    {: .file}
    /tmp/ipv4
    :   ~~~ conf

        *filter

        # Allow all loopback (lo0) traffic
        # and reject traffic to 127/8 that doesn't use lo0.
        -A INPUT -i lo -j ACCEPT
        -A INPUT ! -i lo -d 127.0.0.0/8 -j REJECT
        -A OUTPUT -o lo -j ACCEPT

        # Allow pings.
        -A INPUT -p icmp --icmp-type echo-request -j ACCEPT
        -A OUTPUT -p icmp -j ACCEPT

        # Allow SSH.
        -A INPUT -i eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 22 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state ESTABLISHED --sport 22 -j ACCEPT

        # Allow UDP traffic to port 1194.
        -A INPUT -i eth0 -p udp -m state --state NEW,ESTABLISHED --dport 1194 -j ACCEPT
        -A OUTPUT -o eth0 -p udp -m state --state ESTABLISHED --sport 1194 -j ACCEPT

        # Allow limited DNS resolution and HTTP/S on eth0.
        # Necessary for updating the server and keeping time.
        -A INPUT -i eth0 -p udp -m state --state ESTABLISHED --sport 53 -j ACCEPT
        -A OUTPUT -o eth0 -p udp -m state --state NEW,ESTABLISHED --dport 53 -j ACCEPT

        -A INPUT -i eth0 -p tcp -m state --state ESTABLISHED --sport 80 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m state --state ESTABLISHED --sport 443 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 80 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 443 -j ACCEPT

        # Allow traffic on the TUN interface.
        -A INPUT -i tun+ -j ACCEPT
        -A OUTPUT -o tun+ -j ACCEPT

        # Log any packets which don't fit the rules above...
        # (optional but useful)
        -A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables_INPUT_denied: " --log-level 4
        -A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables_FORWARD_denied: " --log-level 4
        -A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables_OUTPUT_denied: " --log-level 4

        # then reject them.
        -A INPUT -j REJECT
        -A FORWARD -j REJECT
        -A OUTPUT -j REJECT

        COMMIT
        ~~~

    {: .note }
    >
    >The `TUN` virtual interface is how the OpenVPN daemon communicates with your Linode's `eth0` hardware interface. `TUN` is actually what receives the VPN traffic from clients, not the bare-metal ethernet hardware.

    {: .note }
    >
    >For more specialized firewall rules, see: `/usr/share/doc/openvpn/examples/sample-config-files/firewall.sh`.

    You can see your loaded rule list with `sudo iptables -S`.

#### IPv6

**If you do not want IPv6 access** to your OpenVPN server, disable it by adding the following lines to `/etc/sysctl.d/99-sysctl.conf`:

    net.ipv6.conf.all.disable_ipv6 = 1
    net.ipv6.conf.default.disable_ipv6 = 1
    net.ipv6.conf.lo.disable_ipv6 = 1
    net.ipv6.conf.eth0.disable_ipv6 = 1

To activate the sysctl changes immediately:

    sudo sysctl -p

Then go into `/etc/hosts` and comment out the line for IPv6 resolution over localhost.

{: .file-excerpt}
/etc/hosts
:   ~~~ conf
    #::1 localhost.localdomain localhost
    ~~~

**If you do want IPv6 access**, the process is the same as was for IPv4 above, but subtitute the command `ip6tables` for `iptables`.

1.  Flush any previous rules.

        sudo ip6tables -F && sudo ip6tables -X

2.  Create a temporary rule list. The rules above work equally for both v4 and v6, but only choose those you would need. For example: You likely won't be updating the server over IPv6 but you would want to accept incoming IPv6 traffic to OpenVPN on port 1194.

    Such a ruleset could look like this:

    {: .file}
    /tmp/ipv6
    :   ~~~ conf

        *filter

        #Set all default policies to drop anything not specified below.
        -P INPUT ACCEPT
        -P FORWARD DROP
        -P OUTPUT DROP

        #Allow loopback interface to only ::1.
        -A INPUT -s ::1 -j ACCEPT
        -A OUTPUT -s 0:0:0:0:0:0:0:1 -j ACCEPT

        #Allow pings.
        -A INPUT -p icmpv6 --icmpv6 -j ACCEPT
        -A OUTPUT -p icmpv6 --icmpv6 -j ACCEPT

        #Allow UDP traffic to port 1194.
        -A INPUT -i eth0 -p udp -m state --state NEW --dport 1194 -j ACCEPT
        -A OUTPUT -o eth0 -p udp -m state --state ESTABLISHED --sport 1194 -j ACCEPT

        #Allow traffic on the TUN interface.
        -A INPUT -i tun+ -j ACCEPT
        -A OUTPUT -o tun+ -j ACCEPT

        #Log and reject any packets which
        #don't fit the rules above.
        -A INPUT -m limit --limit 5/min -j LOG --log-prefix "ip6tables denied: " --log-level 4
        -A INPUT -j REJECT

        COMMIT
        ~~~

3.  Import your rule list.

        sudo ip6tables-restore < /tmp/myip6tables

4.  Run `sudo iptables-persistent` again. Select `no` to save the current IPv4 rules (because they were not changed) and `yes` for IPv6 rules.

### Disable Unnecessary Network Services

By default, Debian installs with services listening on localhost for [Exim](https://en.wikipedia.org/wiki/Exim), [NFS](https://en.wikipedia.org/wiki/Network_File_System) components, [SSH](https://en.wikipedia.org/wiki/Secure_Shell) and time synchronization (see `sudo netstat -tulpn`).

SSH is necessary to adminster your server and timekeeping is important, but **if** Exim and NFS are not needed, they should be disabled (or removed completely) to reduce attack surface.

1.  Exim.
    
        sudo systemctl stop exim4.service && sudo systemctl disable exim4.service

2.  `rpc-bind` and `rpc.statd` are needed for NFS. Reboot after disabling `rpcbind`.
    
        sudo systemctl stop rpcbind.service && sudo systemctl disable rpcbind.service

    {: .note }
    >
    >If you will be using NFS on your Linode's VPN, see [our NFS guide](https://www.linode.com/docs/networking/basic-nfs-configuration-on-debian-7) to get started.

Run `sudo netstat -tulpn` again. You should now only see listening services for SSH (sshd) and NTP (ntpdate, network time protocol).

{: .note }
>
>NTPdate can be replaced with [OpenNTPD](https://en.wikipedia.org/wiki/OpenNTPD) (`sudo apt-get install openntpd`) if you prefer a time synchronization daemon which does not listen on all interfaces and you do not require nanosecond accuracy.

If you want to later re-enable Exim or rpcbind:

    sudo systemctl enable service_name.service && sudo systemctl start service_name.service

## Install and Configure OpenVPN

For these next sections, you need to be the root user.

    sudo su -

1.  Start by installing OpenVPN:

        apt-get install openvpn

2.  OpenVPN's server-side configuration file is `/etc/openvpn/server.conf` which must be extracted from the archive of config templates.

        gunzip -c /usr/share/doc/openvpn/examples/sample-config-files/server.conf.gz > /etc/openvpn/server.conf

3.  Run the `make-cadir` script to copy over the necessary files from `/usr/share/doc/openvpn/examples/` and create our working directory. Then change location into it.

        make-cadir /etc/openvpn/easy-rsa && cd /etc/openvpn/easy-rsa/

4.  Create a symbolic link from `openssl-1.0.0.cnf` to `openssl.cnf` *** WHY.

        ln -s openssl-1.0.0.cnf openssl.cnf

5.  The permissions of `/etc/openvpn/easy-rsa/keys` are 0700, which recursively do not allow for group or world access to the key and certificate files. This is in contrast to most directories in the filesystem which are a `0755`, allowing group read and execution, and are world readable.

    For this reason, we'll keep `keys` as the storage location for server credentials but to do so, we must specify the absolute paths for OpenVPN in `server.conf`.

    {: .file-exceprt}
    /etc/openvpn/server.conf
    :   ~~~ conf
        # Any X509 key management system can be used.
        # OpenVPN can also use a PKCS #12 formatted key file
        # (see "pkcs12" directive in man page).
        ca /etc/openvpn/easy-rsa/keys/ca.crt
        cert /etc/openvpn/easy-rsa/keys/server.crt
        key /etc/openvpn/easy-rsa/keys/server.key  # This file should be kept secret

        # Diffie hellman parameters.
        # Generate your own with:
        #   openssl dhparam -out dh1024.pem 1024
        # Substitute 2048 for 1024 if you are using
        # 2048 bit keys.
        dh /etc/openvpn/dh2048.pem
        ~~~

6.  The `vars` file in `/etc/openvpn/easy-rsa` contains presets for the [easy-rsa scripts](https://github.com/OpenVPN/easy-rsa). One of the most important parameters in `vars` is `export KEY_NAME`. This is used during the [server certificate verification](https://openvpn.net/index.php/open-source/documentation/howto.html#secnotes) process by each client and is a security precaution against MITM attacks where a malicious client could pose as a server to other VPN clients during a new connection's TLS handshake.

    By default, it's set to *EASY_RSA*; change it to `server`.

    {: .file-exceprt}
    /etc/openvpn/easy-rsa/vars
    :   ~~~ conf
        # X509 Subject Field
        export KEY_NAME="server"
        ~~~

7.  In `vars` you can also specify identification information for your OpenVPN server's certificate authority which then will be passed to client certificates. Changing these fields is optional but recommended for anything more than personal use.

    {: .file-exceprt}
    /etc/openvpn/easy-rsa/vars
    :   ~~~ conf
        # These are the default values for fields
        # which will be placed in the certificate.
        # Don't leave any of these fields blank.
        export KEY_COUNTRY="US"
        export KEY_PROVINCE="CA"
        export KEY_CITY="SanFrancisco"
        export KEY_ORG="Fort-Funston"
        export KEY_EMAIL="me@myhost.mydomain"
        export KEY_OU="MyOrganizationalUnit"
        ~~~

8.  Be sure you're in the `easy-rsa`directory and [source](http://stackoverflow.com/a/9326746) the `vars` script.

        cd /etc/openvpn/easy-rsa && source ./vars

    This will return:

        NOTE: If you run ./clean-all, I will be doing a rm -rf on /etc/openvpn/easy-rsa/keys

9.  Run the `clean-all` script to be sure you're starting with no samples or templates in your `keys` directory.

        ./clean-all

### Generate Diffie-Hellman PEM

The *Diffie-Hellman parameter* is a chunk of randomly generated data used to create a client's session key upon connection so [Perfect Forward Secrecy](https://en.wikipedia.org/wiki/Forward_secrecy#Perfect_forward_secrecy_.28PFS.29) is used. We'll create the file at `/etc/openvpn/dh*.pem`, where `*` indicates the bit length of the Diffie-Hellman key. 2048 bits is the default.

Create the file with:

    /usr/bin/openssl dhparam 2048 > /etc/openvpn/dh2048.pem

This should produce the following output:

    Generating DH parameters, 2048 bit long safe prime, generator 2
    This is going to take a long time

This can take several minutes to complete. When finished, it will return you to the command prompt.

{: .note }
>
>If you would prefer a stronger 4096 bit PEM, it will take longer to generate but otherwise incur unnoticeable overhead during connections on modern equipment. Replace `2048` in the command above with `4096`.
>
>To permanently change the default DH PEM size, edit the bit lengths in `vars` and `server.conf`. Then recreate the file. The DH PEM file can arbitrily be deleted and regenerated with no changes needed to server or client settings.

### Harden OpenVPN

An OpenVPN connection consists of two flow channels between the server and clients: the *Control Channel* and the *Data Channel*. A client connects to the server by initiating a TLS session over the control channel, in which credentials are exchanged between server and clients to establish the data channel. The data channel is the encrypted pipeline in which all traffic between server and clients is then transmitted.

We'll make some further changes and additions to `server.conf` to strengthen the cryptography used in both channels, and restrict the OpenVPN's daemon's priviledges. These settings can be applied independently of each other.

1.  Require a matching HMAC signature for all packets involved in the TLS handshake between the server and connecting clients. Packets without this signature are dropped. Uncomment `tls-auth ta.key 0 # This file is secret`.

    {: .file-exceprt}
    /etc/openvpn/server.conf
    :   ~~~ conf
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

2.  Uncomment the `user` and `group` lines so OpenVPN drops root priviledges after startup.

    {: .file-exceprt}
    /etc/openvpn/server.conf
    :   ~~~ conf
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

3.  Change the VPN's data channel to use AES with a 256 bit key in CBC mode. Blowfish-128 is the default, but AES_CBC is generally considered the most secure cipher/mode combination of those supported by OpenVPN (see `openvpn --show-ciphers`) and can take advantage of [AES-NI](https://en.wikipedia.org/wiki/AES_instruction_set) for increased performance.

        echo 'cipher AES-256-CBC' >> /etc/openvpn/server.conf

4.  Change the data channel's authentication digest to SHA512, a [SHA-2](https://en.wikipedia.org/wiki/SHA-2) hash function. SHA-1 is the default; see `openvpn --show-digests` for all supported digests.

        echo 'auth SHA512' >> /etc/openvpn/server.conf

5.  Now generate the HMAC key file for step 1. Later we'll transfer it to each client device.

        openvpn --genkey --secret /etc/openvpn/easy-rsa/keys/ta.key

6.  Force the control channel to use a minimum of TLS 1.2 specification (see `openssl ciphers -s 'TLSv1.2'`).

    {: .caution }
    >
    >This option can only be used if both server **and** clients are using OpenVPN 2.3.3 or above. See `openvpn --version`.

     The setting below limits the cipher suites used to only those which support forward secrecy.

        echo 'tls-version-min 1.2' >> /etc/openvpn/server.conf

    Alternatively, use a specifc cipher suite or list of cipher suites. This is more specific than limiting by TLS version so *there is no reason to use both methods*. [It is recommended](https://community.openvpn.net/openvpn/wiki/Hardening#Useof--tls-cipher) to limit this as much as possible.

    Chosen below is TLS 1.2 using RSA keys exchanged with a Diffie-Hellman agreement, AES 256 as a block cipher in GCM mode, and SHA512 for the message digest.

        echo 'tls-cipher TLS-DHE-RSA-WITH-AES-256-GCM-SHA512' >> /etc/openvpn/server.conf

    The default selection is a cipher suite agreed on by both server and client during the TLS handshake. The agreement is based on what is supported by their respective OpenSSL versions. See `openvpn --show-tls` for a list of supported ciphers in their order of preference.

## Certificate and Key Pairs

From here, we'll be working out of the `easy-rsa` directory so change location.

    cd /etc/openvpn/easy-rsa

### Server Credentials

1.  A *root certificate*, sometimes also referred to as a *Certificate Authority*, is the certificate and key pair that will be used to generate each client's keypair. At each prompt, fill out the information to be used in your certificate (or leave them blank). Use your server's hostname or some other identifer as the `Common Name` and leave the challenge password blank.

        ./build-ca

 s2.  Then create the server's private key and again fill in the information prompts.

        ./build-key-server server

    When you've completed the question section for the private key, confirm the signing of the certificate and the `certificate requests certified` by answering `yes` to those two questions.

### Client Credentials

Each client device connecting to the VPN should have its own unique key. Further, each key should have its own identifier (client1, client2, etc.) but all other information can remain the same. If you need to add users at any later time, repeat this step.

    ./build-key client1

{: .note}
>
>Anyone with access to `client1.key` will be able to access your VPN. To better protect against this scenario, you can issue `./build-key-pass client1` instead to build a client key which is encrypted with a passphrase.

## Client Configuration File

Each client also needs a configuration file defining the server-side settings for the client. One `client.conf` can be used for all client devices or you can configure some clients differently than others. Here we'll assume one client config file for all devices.

1.  Copy the `client.conf` template file to /tmp and open it for editing.

        cp /usr/share/doc/openvpn/examples/sample-config-files/client.conf /tmp

2.  Update the `remote` line with the OpenVPN server's IP address:

    {: .file }
    /etc/openvpn/client.conf
    :   ~~~ conf
        # The hostname/IP and port of the server.
        # You can have multiple remote entries
        # to load balance between the servers.

        remote 123.456.78.9 1194
        ~~~

    {: .note }
    >
    >A hostname would work just as well but since this a security-minded OpenVPN guide and Linodes all have static public IP addresses, it's preferable here to connect by IP and bypass the DNS lookup.

3.  Tell the client-side OpenVPN service to drop root priviledges.

    {: .file }
    /etc/openvpn/client.conf
    :   ~~~ conf
        # Downgrade privileges after initialization (non-Windows only)
        user nobody
        group nogroup
        ~~~

4.  Further down in the file, edit the `cert` and `key` lines to reflect the name of your key and their location *on the client device*.

    {: .file-excerpt}
    /etc/openvpn/client.conf
    :   ~~~ conf
        # SSL/TLS parms.
        # See the server config file for more
        # description.  It's best to use
        # a separate .crt/.key file pair
        # for each client.  A single ca
        # file can be used for all clients.
        /etc/openvpn/keys ca.crt
        /etc/openvpn/keys client1.crt
        /etc/openvpn/keys client1.key
        ~~~

5.  Tell the client to use the HMAC key we generated earlier above; again specify the absolute path.

    {: .file-excerpt}
    /etc/openvpn/client.conf
    :   ~~~ conf
        # If a tls-auth key is used on the server
        # then every client must also have the key.
        tls-auth /etc/openvpn/keys/ta.key 1
        ~~~

6.  Enable checking for nsCertType within the client-supplied certificate. This is the server and deny a connection if it's not the `server` attribute we specified in `vars` earlier.

    {: .file-excerpt}
    /etc/openvpn/client.conf
    :   ~~~ conf
    # Verify server certificate by checking
    # that the certicate has the nsCertType
    # field set to "server".  This is an
    # important precaution to protect against
    # a potential attack discussed here:
    #  http://openvpn.net/howto.html#mitm
    #
    # To use this feature, you will need to generate
    # your server certificates with the nsCertType
    # field set to "server".  The build-key-server
    # script in the easy-rsa folder will do this.
    ns-cert-type server
        ~~~

7.  Since we're forcing certain cryptographic settings on the OpenVPN server, make sure the clients have the same settings. Add these lines to the end of `client.conf`:

        tls-version-min 1.2
        tls-cipher TLS-DHE-RSA-WITH-AES-256-GCM-SHA512
        cipher AES-256-CBC
        auth SHA512

8.  Pack all the necessary client files into a tarball ready for transferring.

        cd /etc/openvpn

        tar -cvzf client1.tar.gz client.conf /etc/openvpn/easy-rsa/keys/{ca.crt,client1.crt,client1.key,ta.key}

9.  We no longer need to be `root` so change back to your standard user:

        exit

## Initial Startup

Start the OpenVPN daemon and enable it on reboot.

    sudo systemctl enable openvpn.service && sudo systemctl start openvpn.service

This will scan the `/etc/openvpn` directory on the server for files with a `.conf` extension. For every file that it finds, it will create and run a VPN daemon (server).

Running:

    sudo systemctl status openvpn.service

should then return:

    ● openvpn.service - OpenVPN service
       Loaded: loaded (/lib/systemd/system/openvpn.service; enabled)
       Active: active (exited) since Wed 2015-09-16 18:54:18 UTC; 56min ago
      Process: 3309 ExecReload=/bin/true (code=exited, status=0/SUCCESS)
     Main PID: 2850 (code=exited, status=0/SUCCESS)

## Next Steps

At this point, you should have a operational OpenVPN server and a set of certificat/key pairs for your intended client devices. If you want your clients to have internet access from behind the VPN, see part two of this series: [How to Set up a VPN Tunnel with Debian 8](/docs/networking/vpn/how-to-set-up-a-vpn-tunnel-with-debian-8).

If you only intend to use your OpenVPN server as an extension of your local network, move on to part three: [How to Configure OpenVPN Client Devices](/docs/networking/vpn/how-to-configure-openvpn-client-devices).

## Troubleshooting


    journalctl | grep vpn