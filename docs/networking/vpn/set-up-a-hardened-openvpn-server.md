---
author:
  name: Chris Walsh
  email: docs@linode.com
description: 'Learn how to securely tunnel your traffic with OpenVPN and OpenSSL.'
keywords: 'openvpn,vpn,vpn tunnel,openssl'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['networking/vpn/set-up-a-hardened-openvpn-server-on-debian-8/']
modified: 'Thursday, August 17th, 2017'
modified_by:
  name: Linode
published: 'Wednesday, December 9th, 2015'
title: 'Set up a Hardened OpenVPN Server on Debian 9'
external_resources:
 - '[Official OpenVPN Documentation](https://openvpn.net/index.php/open-source/documentation/howto.html)'
---

[OpenVPN](https://openvpn.net/) is a tool for creating network tunnels between and among groups of computers that are not on the same local network. This is useful if you want to remotely access services on a network or computer without making those services publicly accessible. When integrated with OpenSSL, OpenVPN encrypts all VPN traffic to provide a secure connection between machines.

![Set up a Hardened OpenVPN Server on Debian](/docs/assets/hardened-openvpn-server-debian-8.png "Set up a Hardened OpenVPN Server on Debian")

An OpenVPN connection consists of two flow channels between the server and clients: the *Control Channel* and the *Data Channel*. A client connects to the server by initiating a TLS session over the control channel, in which credentials are exchanged between server and clients to establish the data channel. The data channel is the encrypted pipeline in which all traffic between server and clients is then transmitted.

This guide is the first of a three-part series. Part one sets up with a VPN server on Debian and prepares the access credentials for client devices. This VPN can be used to host internal services such as websites, game servers or file servers.

[Part two](***link***) shows you how to set up a routed VPN so all traffic from client devices is tunneled through your Linode out to the internet. [Part three](***link***) takes you through setting up the client-side software for various operating systems, including mobile platforms.


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and set your Linode's timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access and remove unnecessary network services. Do not follow the *Creating a Firewall* section. This guide has instructions specifically for firewall rules for an OpenVPN server.

3.  Update the system:

        sudo apt update && sudo apt upgrade


## Managing the OpenVPN Environment

You can manage the OpenVPN environment in [two ways](https://openvpn.net/index.php/access-server/section-faq-openvpn-as/32-general/225-compare-openvpn-community-and-enterprise-editions-.html):

*   The first method uses [OpenVPN Community Edition](https://openvpn.net/index.php/open-source.html), where server and client configurations are manually edited and client credentials are distributed to their respective devices using SCP or SFTP. Alternatively, you could copy credentials to a desktop computer, edit them and then transfer them by USB.

*   The second method uses [OpenVPN Access Server](https://openvpn.net/index.php/access-server/overview.html), a server-side application which lets you configure OpenVPN through a GUI in your web browser. Client machines access a private URL from which to download their credential packages.

For small applications, OpenVPN Access Server is the more streamlined and user-friendly solution. The free version allows up to two simultaneous users and, although each user can have as many client devices as they like, a user's clients will all have the same keys and certificates. More can be added by buying licensing. For more advanced configurations than what the GUI offers, you would still need to edit the VPN's configuration files.

If you are interested running OpenVPN Access Server on your Linode, see our guide: [Secure Communications with OpenVPN Access Server](/docs/networking/vpn/openvpn-access-server). **The remainder of *this* guide will focus on manual configuration using OpenVPN Community Edition.**


## Networking Configuration

OpenVPN currently does not support a dual-stack configuration from a single instance where clients can connect to a server simultaneously using IPv4 and IPv6; one transport layer must be chosen or the other. Furthermore, only OpenVPN versions 2.3 and above support [IPv6 over TUN devices](https://openvpn.net/index.php/open-source/faq/77-server/287-is-ipv6-support-plannedin-the-works.html). With versions earlier than 2.3, IPv6 can only be used with TAP devices, so some clients can be further limited.

For these reasons, this series assumes your VPN will operate over IPv4 only. If you instead wish to use IPv6, see [OpenVPN's documentation](https://community.openvpn.net/openvpn/wiki/IPv6) for more information.

### IPv4 Firewall Rules

1.  Change to the root user.

       su - root

2.  Flush any pre-existing rules and non-standard chains which may be in the system:

        iptables -F && iptables -X

3.  Install `iptables-persistent` so any iptables rules we make now will be restored on succeeding bootups. When asked if you want to save the current IPv4 and IPv6 rules, choose **No** for both protocols.

        apt install iptables-persistent

4. Add IPv4 rules: `iptables-persistent` stores its rulesets in the files `/etc/iptables/rules.v4` and `/etc/iptables/rules.v6`. Open the `rules.v4` file and replace everything in it with the information below:

    {: .file}
    /etc/iptables/rules.v4
    :   ~~~ conf
        *filter

        # Allow all loopback (lo) traffic and reject anything
        # to localhost that does not originate from lo.
        -A INPUT -i lo -j ACCEPT
        -A INPUT ! -i lo -s 127.0.0.0/8 -j REJECT
        -A OUTPUT -o lo -j ACCEPT

        # Allow ping and ICMP error returns.
        -A INPUT -p icmp -m state --state NEW --icmp-type 8 -j ACCEPT
        -A INPUT -p icmp -m state --state ESTABLISHED,RELATED -j ACCEPT
        -A OUTPUT -p icmp -j ACCEPT

        # Allow SSH.
        -A INPUT -i eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 22 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state ESTABLISHED --sport 22 -j ACCEPT

        # Allow UDP traffic on port 1194.
        -A INPUT -i eth0 -p udp -m state --state NEW,ESTABLISHED --dport 1194 -j ACCEPT
        -A OUTPUT -o eth0 -p udp -m state --state ESTABLISHED --sport 1194 -j ACCEPT

        # Allow DNS resolution and limited HTTP/S on eth0.
        # Necessary for updating the server and timekeeping.
        -A INPUT -i eth0 -p udp -m state --state ESTABLISHED --sport 53 -j ACCEPT
        -A OUTPUT -o eth0 -p udp -m state --state NEW,ESTABLISHED --dport 53 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m state --state ESTABLISHED --sport 80 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m state --state ESTABLISHED --sport 443 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 80 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 443 -j ACCEPT

        # Allow traffic on the TUN interface so OpenVPN can communicate with eth0.
        -A INPUT -i tun0 -j ACCEPT
        -A OUTPUT -o tun0 -j ACCEPT

        # Log any packets which don't fit the rules above.
        # (optional but useful)
        -A INPUT -m limit --limit 3/min -j LOG --log-prefix "iptables_INPUT_denied: " --log-level 4
        -A FORWARD -m limit --limit 3/min -j LOG --log-prefix "iptables_FORWARD_denied: " --log-level 4
        -A OUTPUT -m limit --limit 3/min -j LOG --log-prefix "iptables_OUTPUT_denied: " --log-level 4

        # then reject them.
        -A INPUT -j REJECT
        -A FORWARD -j REJECT
        -A OUTPUT -j REJECT

        COMMIT
        ~~~

5.  We'll disable IPv6 in the next section so add an ip6tables ruleset to reject all v6 traffic:

        cat >> /etc/iptables/rules.v6 << END
        *filter

        -A INPUT -j REJECT
        -A FORWARD -j REJECT
        -A OUTPUT -j REJECT

        COMMIT
        END

6.  Activate the rulesets immediately and verify:

        sudo iptables-restore < /etc/iptables/rules.v4
        sudo ip6tables-restore < /etc/iptables/rules.v6

    You can see your loaded rules with `sudo iptables -S`. For more specialized firewall rules, see `/usr/share/doc/openvpn/examples/sample-config-files/firewall.sh` on your server.

7.  Load the rulesets into `iptables-persistent`.  This time, answer **Yes** when asked if you want to save the current IPv4 and IPv6 rules.

        sudo dpkg-reconfigure iptables-persistent


### Disable IPv6

If you are exclusively using IPv4 on your VPN, IPv6 should be disabled unless you have a specific reason not to do so.

1.  Add the following kernel parameters for `systemd-sysctl` to set on boot:

        cat >> /etc/sysctl.d/99-sysctl.conf << END

        net.ipv6.conf.all.disable_ipv6 = 1
        net.ipv6.conf.default.disable_ipv6 = 1
        net.ipv6.conf.lo.disable_ipv6 = 1
        net.ipv6.conf.eth0.disable_ipv6 = 1
        END

2.  Activate them immediately:

        sudo sysctl -p

3.  Comment out the line for IPv6 resolution over localhost in `/etc/hosts`:

    {: .file}
    /etc/hosts
    :   ~~~ conf
        #::1     localhost ip6-localhost ip6-loopback
        ~~~


## Install and Begin Configuring OpenVPN

1.  Start by installing OpenVPN from the [OpenVPN Project's repository](https://community.openvpn.net/openvpn/wiki/OpenvpnSoftwareRepos). Choose OpenVPN's repo over Debian's so that you'll always have the most up to date build for Debian Stretch:

        wget -O - https://swupdate.openvpn.net/repos/repo-public.gpg|apt-key add -
        echo "deb http://build.openvpn.net/debian/openvpn/stable stretch main" > /etc/apt/sources.list.d/openvpn-aptrepo.list
        apt update && apt install openvpn

2.  By default, OpenVPN runs as root. While the user *nobody* given in the `server.conf` template has much fewer privileges than root, if *nobody* gets compromised, the intruder will have access to other processes running as *nobody*. This can include Apache when using `mod_php`, various NFS mounts and some cron jobs. Forcing OpenVPN to run as its own exclusive user and group is a good way to isolate it from other processes, especially if you will also be hosting a web or file server on the same operating system as your VPN.

    Create a new user account and group for the OpenVPN daemon to run as after startup. The name *ovpn* is used as an example.

        adduser --system --shell /usr/sbin/nologin --no-create-home ovpn
        groupadd ovpn
        usermod -g ovpn ovpn

4.  Require a matching HMAC signature for all packets involved in the TLS handshake between the server and connecting clients. Packets without this signature are dropped. To generate the HMAC signature file:

        openvpn --genkey --secret /etc/openvpn/server/ta.key

5.  Generate Diffie-Hellman parameter. This is a chunk of randomly generated data used when establishing [Perfect Forward Secrecy](https://en.wikipedia.org/wiki/Forward_secrecy#Perfect_forward_secrecy_.28PFS.29) during creation of a client's session key. The default size is 2048 bits, but [OpenVPN's documentation](https://community.openvpn.net/openvpn/wiki/GettingStartedwithOVPN) recommends to use a prime size equivalent to your RSA key size. Since we'll be using 4096 bit RSA keys, we'll use a 4096 bit DH prime. Depending on the size of your Linode, this can take about 10 minutes to complete.

        openssl genpkey -genparam -algorithm DH -out /etc/openvpn/server/dhp4096.pem -pkeyopt dh_paramgen_prime_len:4096

    {: .note }
    >
    >According to OpenSSL's man page, `genpkey -genparam` supersedes `dhparam`.

6.  Exit from the root shell and back to your standard user account.


## VPN Certificate Authority

Client certificates and keys should be not be managed directly on your VPN server. They should be created locally on a computer and stored offline. For the best quality entropy, they should be created on a computer which has as powerful of a CPU as you have access to, so no embedded devices or virtual machines. There are two main ways to do this: First is with the [EasyRSA](https://github.com/OpenVPN/easy-rsa) scripts, and the second way is to create your own public key infrastructure for your VPN which includes customizations not in the default OpenSSL configuration file.

We'll use EasyRSA for the rest of this guide. 

### Configure EasyRSA

1.  If you're using a local Unix-based operating system, install the package `easy-rsa` onto your local computer (CentOS will first need the EPEL repositories installed). For OS X or Windows, grab the `.zip` archive from the project's [Github page](https://github.com/OpenVPN/easy-rsa).

2.  Make yourCertificate Authority root directory and change to that location. The location of your CA is arbitrary, but we'll make a folder called `ca` in your user's home directory as an example. The certificates are created from that directory.

        make-cadir ~/ca && cd ~/ca

3.  The `vars` file created in `/ca` contains presets used by the EasyRSA. Here you can specify distinguished name  for your certificate authority which then will be passed to client certificates. Changing these fields is optional and you can always input them manually during certificate creation, but setting them here creates less work during client cert creation.

    {: .file-excerpt}
    ~/ca/vars
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

2.  From `~/ca`, [source](http://stackoverflow.com/a/9326746) the `vars` script:

        source ./vars

    This will return:

        NOTE: If you run ./clean-all, I will be doing a rm -rf on /home/user/ca/keys

3.  Run the `clean-all` script to create the `keys` directory and its containing files:

        ./clean-all

### Server Credentials

1.  A *root certificate*, sometimes also called a *Certificate Authority*, is the certificate and key pair that will be used to generate key pairs for clients and intermediate authorities (of which on this VPN server there are none). At each prompt, add or edit the information to be used in your certificate, or leave them blank. Use your VPN server's hostname or some other identifier as the `Common Name` and leave the challenge password blank.

        ./build-ca

2.  Then create the server's private key; again add or edit at the information prompts as needed:

        ./build-key-server server

    When you've completed the question section for the private key, confirm the signing of the certificate and the `certificate requests certified` by answering `yes` to those two questions.

3.  Now that you have the server credentials, they need to be uploaded to it. Do that from your local computer with SCP:

        scp ./keys/{ca.crt,server.crt,server.key} root@<your_linode's_IP>:/etc/openvpn/server

4.  You'll also want a copy of the HMAC key you created earlier to distribute to each client device:

        scp root@<your_linode's_IP>:/etc/openvpn/server/ta.key ./keys


### Client Credentials

Each client device connecting to the VPN should have its own unique key. Furthermore, each key should have its own identifier (client1, client2, etc.) but all other certificate information can remain the same. **If you need to add users at any time later, just repeat this step using a different client name**.

    cd ~/ca && source ./vars && ./build-key client1

{: .note}
>
>Anyone with access to `client1.key` will be able to access your VPN. To better protect against this scenario, you can issue `./build-key-pass client1` instead to build a client key which is encrypted with a passphrase.


## OpenVPN Configuration Files

### Server Configuration File

OpenVPN's server-side configuration file is `/etc/openvpn/server.conf`. Use the contents below to create a new file at that location:

{: .file}
/etc/openvpn/server.conf
:   ~~~ conf
    dev tun
    persist-key
    persist-tun
    topology subnet
    port 1194
    proto udp
    keepalive 10 120

    # Location of certificate authority's cert.
    ca /etc/openvpn/server/ca.crt

    # Location of VPN server's TLS cert.
    cert /etc/openvpn/server/server.crt

    # Location of server's TLS key
    key /etc/openvpn/server/server.key

    # Location of DH parameter file.
    dh /etc/openvpn/server/dhp4096.pem

    # The VPN's address block starts here.
    server 10.89.0.0 255.255.255.0

    explicit-exit-notify 1

    # Drop root privileges and switch to the `ovpn` user after startup.
    user ovpn

    # OpenVPN process is exclusive member of ovpn group.
    group ovpn

    # Cryptography options. We force these onto clients by
    # setting them here and not in client.ovpn. See
    # `openvpn --show-tls`, `openvpn --show-ciphers` and
    #`openvpn --show-digests` for all supported options.
    tls-auth /etc/openvpn/server/ta.key 0
    auth SHA512    # This needs to be in client.ovpn too though.
    tls-version-min 1.2
    tls-cipher TLS-DHE-RSA-WITH-AES-256-GCM-SHA384:TLS-DHE-RSA-WITH-AES-256-CBC-SHA256
    ncp-ciphers AES-256-GCM:AES-256-CBC

    # Logging options.
    ifconfig-pool-persist ipp.txt
    status openvpn-status.log
    log /var/log/openvpn.log
    verb 3
    ~~~

{: .note}
>
>You can extract a server template from OpenVPN's sample configuration files using:
>
>       gunzip -c /usr/share/doc/openvpn/examples/sample-config-files/server.conf.gz > /etc/openvpn/server.conf


### Client Configuration File

OpenVPN's client-side configuration file is `client.ovpn`. When you import an OpenVPN profile, location of that directory does not matter but this `.ovpn` file needs to be in the same directory as the client certificate and other credentials. OpenVPN does not refer to any of these files after import and they do not even need to remain on the client system.

{: .file}
client.ovpn
:   ~~~ conf
    # No cryptography options are specified here because we want
    # the VPN server to push those settings to clients rather than
    # allow clients to dictate their crypto.

    client
    dev tun
    persist-key
    persist-tun
    proto udp
    nobind
    user ovpn
    group ovpn
    remote-cert-tls server
    auth SHA512
    verb 3

    # Remote server's IP address and port. IP is
    # preferable over hostname so as not to rely
    # on DNS lookups.
    remote <your_linode's IP address> 1194

    # To successfully import this profile, you
    # want the client device's CA certificate copy,
    # client certificate and key, and HMAC signature
    # all in the same location as this .ovpn file.
    ca ca.crt
    cert client1.crt
    key client1.key
    tls-auth ta.key 1
    ~~~

{: .note}
>
>You can use a client template from OpenVPN's sample configuration files using the command below. Most clients require a `.ovpn` file format instead of `.conf`.
>
>       cp /usr/share/doc/openvpn/examples/sample-config-files/client.conf /etc/openvpn/client/client.ovpn


## Distribute Credentials

Each client device needs to contain the following files:

  *  `client1.key`    # Exclusive to this device.
  *  `client1.cert`   # Exclusive to this device.
  *  `CA.pem`         # Is shared among server and client devices.
  *  `ta.key`         # Is shared among server and client devices.
  *  `client.ovpn`    # Is shared among client devices.


## Initial Startup and Log Monitoring

Start the OpenVPN daemon and enable it on reboot:

    sudo systemctl restart openvpn.*

{: .note }
>
>This will scan the `/etc/openvpn` directory on the server for files with a `.conf` extension. For every file that it finds, it will spawn a VPN daemon (server instance) so make sure you don't have a `client.conf` or `client.ovpn` file in there.

The logs of both the OpenVPN client and servers will contain all the information you need to confirm connection specifications, view client address assignments and debug connection issues. Even if the connection completes seemingly without problems, the logs can contain alerts and messages for how to better configure your setup.

To check the status of the OpenVPN process:

    sudo systemctl status openvpn*

That should return:

    ● openvpn.service - OpenVPN service
       Loaded: loaded (/lib/systemd/system/openvpn.service; enabled; vendor preset: enabled)
      Active: active (exited) since Tue 2017-08-15 17:05:53 UTC; 3min 13s ago
     Process: 3786 ExecStart=/bin/true (code=exited, status=0/SUCCESS)
    Main PID: 3786 (code=exited, status=0/SUCCESS)
    Tasks: 0 (limit: 4915)
    CGroup: /system.slice/openvpn.service

    Aug 15 17:05:53 debian systemd[1]: Starting OpenVPN service...
    Aug 15 17:05:53 debian systemd[1]: Started OpenVPN service.

    ● openvpn@server.service - OpenVPN connection to server
       Loaded: loaded (/lib/systemd/system/openvpn@.service; disabled; vendor preset: enabled)
      Active: active (running) since Tue 2017-08-15 17:05:53 UTC; 3min 13s ago
     Docs: man:openvpn(8)
           https://community.openvpn.net/openvpn/wiki/Openvpn23ManPage
           https://community.openvpn.net/openvpn/wiki/HOWTO
     Process: 3793 ExecStart=/usr/sbin/openvpn --daemon ovpn-server --status /run/openvpn/server.status 10 --cd /etc/openvpn --config /etc/openvpn/server.conf --writepid /run/openvpn/server.pid (code=exited, status=0/SU
    Main PID: 3795 (openvpn)
    Tasks: 1 (limit: 4915)
    CGroup: /system.slice/system-openvpn.slice/openvpn@server.service
           └─3795 /usr/sbin/openvpn --daemon ovpn-server --status /run/openvpn/server.status 10 --cd /etc/openvpn --config /etc/openvpn/server.conf --writepid /run/openvpn/server.pid

    Aug 15 17:05:53 debian systemd[1]: Stopped OpenVPN connection to server.
    Aug 15 17:05:53 debian systemd[1]: Starting OpenVPN connection to server...
    Aug 15 17:05:53 debian systemd[1]: Started OpenVPN connection to server.

Use `sudo journalctl -f | grep vpn` to monitor the logs of your OpenVPN server in realtime; press **Control+C** to stop monitoring. The command `sudo journalctl -xe | grep openvpn` can also be useful for troubleshooting.

## Next Steps

You should now have a operational OpenVPN server and a set of certificate/key pairs for your desired client devices. If you intend to use your OpenVPN server as an extension of your local network, or for hosting services you want to access from your LAN, you would now need to configure the specific applications for your use.

If you want your VPN server to forward and receive traffic to/from the internet on behalf of VPN clients, see part two of this series: [Tunnel Your Internet Trafic Through an OpenVPN Server](/docs/networking/vpn/tunnel-your-internet-traffic-through-an-openvpn-server). To set up the connecting client devices, see part three: [Configuring OpenVPN Client Devices](/docs/networking/vpn/configuring-openvpn-client-devices).