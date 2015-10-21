---
author:
  name: Linode
  email: docs@linode.com
description: 'Use OpenVPN to securely connect separate networks on Debian 8.'
keywords: 'openvpn,vpn,debian,tunnel,vpn tunnel,open vpn'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: 'Wednesday, October 21st, 2015'
modified_by:
  name: Linode
published: 'Wednesday, October 21st, 2015'
title: 'Set up a Hardened OpenVPN Server on Debian 8'
external_resources:
 - '[Official OpenVPN Documentation](https://openvpn.net/index.php/open-source/documentation/howto.html)'
---

[OpenVPN](https://openvpn.net/) is a tool for creating networking tunnels between and among groups of computers that are not on the same local network. This is useful if you want to remotely access services on a network or computer without making those services publicly accessible. When integrated with OpenSSL, OpenVPN can encrypt all VPN traffic to provide a secure connection between machines.

This guide the first of a three part series. Part one will set you up with a hardened VPN server in Debian and prepare the certificate and key pairs for connecting client devices. This VPN can be used to host internal services such as websites, game servers or file servers.

Part two will show you how to set up a classic routed VPN, where all traffic from client devices is tunneled through your Linode's VPN and out to the internet. Part three walks through setting up the client-side credentials and software for various operating systems, including mobile platforms.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Complete the beginning of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access and remove unnecessary network services; this guide will use `sudo` wherever possible. Do **not** follow the *Configuring a Firewall* section--this guide has instructions specifcally for an OpenVPN server.

3.  Update your system.

        sudo apt-get update && sudo apt-get upgrade

## Managing the OpenVPN Environment

There are [two ways to do this](https://openvpn.net/index.php/access-server/section-faq-openvpn-as/32-general/225-compare-openvpn-community-and-enterprise-editions-.html): The first is using [OpenVPN Community Edition](https://openvpn.net/index.php/open-source.html), where server and client configuration files are manually edited and client credentials are copied to their respective devices using SCP or SFTP. If you don't already have an application for this on your mobile device, you would need to install one. Alternatively, credentials would need to be copied to a desktop computer, edited and then imported into Android or iOS.

The second menthod is using [OpenVPN Access Server](https://openvpn.net/index.php/access-server/overview.html), a server-side application which lets you configure these things through a GUI in your web browser. Client machines access a private URL to download their credential packages.

For small applications, OpenVPN Access Server is the more streamlined and user-friendly method. The free version allows up to two simultaneous users and though each user can have as many client devices as they like, a user's clients will all have the same keys and certificates; more can be added by buying licensing. For more advanced configurations than what the GUI offers though, you would still need to resort to editing config files.

If you are interested getting OpenVPN Access Server running on your Linode, see our guide: [Secure Communications with OpenVPN Access Server](docs/networking/vpn/openvpn-access-server). **The remainder of *this* guide will focus on manual configuration using OpenVPN Community Edition.**

## Networking Rules

OpenVPN currently does not support a dual-stack configuration from a single instance where clients can connect to a server simultaneously using IPv4 and IPv6--one transport layer must be chosen or the other.

Adding this feature is planned for OpenVPN 2.4, but it will still be some time before that is released. Furthermore, only OpenVPN version 2.3 and above support [IPv6 over TUN devices](https://openvpn.net/index.php/open-source/faq/77-server/287-is-ipv6-support-plannedin-the-works.html). Below version 2.3, IPv6 can only be used with TAP devices, so some clients can be further limited.

For these reasons, this series will assume your VPN will operate over IPv4. If you instead wish to use IPv6, see [OpenVPN's documentation](https://community.openvpn.net/openvpn/wiki/IPv6) for more information.

### IPv4 Firewall

1.  Flush any pre-existing rules and non-standard chains which may be in the system.

        sudo iptables -F && sudo iptables -X

2.  See our [Securing Your Server](/docs/security/securing-your-server/#configuring-a-firewall) guide and complete the section on iptables for Debian **using the ruleset below**:

    {: .file}
    /tmp/v4
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
        # Necessary for updating the server and keeping time.
        -A INPUT -i eth0 -p udp -m state --state ESTABLISHED --sport 53 -j ACCEPT
        -A OUTPUT -o eth0 -p udp -m state --state NEW,ESTABLISHED --dport 53 -j ACCEPT

        -A INPUT -i eth0 -p tcp -m state --state ESTABLISHED --sport 80 -j ACCEPT
        -A INPUT -i eth0 -p tcp -m state --state ESTABLISHED --sport 443 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 80 -j ACCEPT
        -A OUTPUT -o eth0 -p tcp -m state --state NEW,ESTABLISHED --dport 443 -j ACCEPT

        # Allow traffic on the TUN interface.
        -A INPUT -i tun0 -j ACCEPT
        -A OUTPUT -o tun0 -j ACCEPT

        # Log any packets which don't fit the rules above...
        # (optional but useful)
        -A INPUT -m limit --limit 3/min -j LOG --log-prefix "iptables_INPUT_denied: " --log-level 4
        -A INPUT -m limit --limit 3/min -j LOG --log-prefix "iptables_FORWARD_denied: " --log-level 4
        -A INPUT -m limit --limit 3/min -j LOG --log-prefix "iptables_OUTPUT_denied: " --log-level 4

        # then reject them.
        -A INPUT -j REJECT
        -A FORWARD -j REJECT
        -A OUTPUT -j REJECT

        COMMIT
        ~~~

    {: .note }
    >
    >The `TUN` virtual interface is how the OpenVPN daemon communicates with your Linode's `eth0` hardware interface. `TUN` is actually what receives the VPN traffic from clients, not the bare-metal ethernet hardware.

    You can see your loaded rule list with `sudo iptables -S`. For more specialized firewall rules, see: `/usr/share/doc/openvpn/examples/sample-config-files/firewall.sh`.

### Disable IPv6

If you are exclusively using IPv4 on your VPN, IPv6 should be disabled unless you have a specific reason not to do so.

1.  Add the following lines to `/etc/sysctl.d/99-sysctl.conf`:

        net.ipv6.conf.all.disable_ipv6 = 1
        net.ipv6.conf.default.disable_ipv6 = 1
        net.ipv6.conf.lo.disable_ipv6 = 1
        net.ipv6.conf.eth0.disable_ipv6 = 1

2.  Activate the sysctl changes immediately:

        sudo sysctl -p

3.  Go into `/etc/hosts` and comment out the line for IPv6 resolution over localhost.

    {: .file-excerpt}
    /etc/hosts
    :   ~~~ conf
        #::1 localhost.localdomain localhost
        ~~~

4.  Add an ip6tables ruleset to reject all v6 traffic:

    {: .file}
    /etc/iptables/rules.v6
    :   ~~~ conf

        *filter

        -A INPUT -j REJECT
        -A FORWARD -j REJECT
        -A OUTPUT -j REJECT

        COMMIT
        ~~~

5.  Enforce the ruleset immeditately:

        sudo ip6tables-restore < /etc/iptables/rules.v6

## Install and Configure OpenVPN

For these next sections, you need to be the root user.

    sudo su -

1.  Start by installing OpenVPN:

        apt-get install openvpn

2.  OpenVPN's server-side configuration file is `/etc/openvpn/server.conf` which must be extracted from the archive of config templates.

        gunzip -c /usr/share/doc/openvpn/examples/sample-config-files/server.conf.gz > /etc/openvpn/server.conf

3.  Run the `make-cadir` script to copy over the necessary files from `/usr/share/doc/openvpn/examples/` and create our working directory. Then change location into it:

        make-cadir /etc/openvpn/easy-rsa && cd /etc/openvpn/easy-rsa/

4.  Create a symbolic link from `openssl-1.0.0.cnf` to `openssl.cnf`:

        ln -s openssl-1.0.0.cnf openssl.cnf

5.  The permissions of `/etc/openvpn/easy-rsa/keys` are `0700`, which do not allow for group or world access to the key and certificate files. This is in contrast to most directories in the filesystem which are a `0755`, allowing group read and execution, and are world readable.

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

6.  Enable IPv6 addressing for OpenVPN. Skip this step if you chose to disable IPv6. Run `ifconfig` in a terminal to see your ethernet interface's IPv6 address. The relevant line in the output under the `eth0` block will look similar to this:

        net6 addr: 2600:3c03::4f6u:0pje:4444:1dsx/64 Scope:Global

    Add that address to `server.conf`:

        echo 'server-ipv6 your_ipv6_address/64' >> /etc/openvpn/server.conf

6.  The `vars` file in `/etc/openvpn/easy-rsa` contains presets used by the [easy-rsa scripts](https://github.com/OpenVPN/easy-rsa). Here you can specify identification information for your OpenVPN server's certificate authority which then will be passed to client certificates. Changing these fields is optional and you can always input them manually during certificate creation, but setting them here creates less work during client cert creation.

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

7.  From the `easy-rsa`directory, [source](http://stackoverflow.com/a/9326746) the `vars` script:

        cd /etc/openvpn/easy-rsa && source ./vars

    This will return:

        NOTE: If you run ./clean-all, I will be doing a rm -rf on /etc/openvpn/easy-rsa/keys

8.  Run the `clean-all` script to be sure you're starting with no samples or templates in your `keys` folder.

        ./clean-all

### Generate Diffie-Hellman PEM

The *Diffie-Hellman parameter* is a chunk of randomly generated data used to create a client's session key upon connection so [Perfect Forward Secrecy](https://en.wikipedia.org/wiki/Forward_secrecy#Perfect_forward_secrecy_.28PFS.29) is used. We'll create the file at `/etc/openvpn/dh*.pem`, where `*` indicates the bit length of the Diffie-Hellman key. 2048 bits is the default.

Create the file with:

    openssl dhparam 2048 > /etc/openvpn/dh2048.pem

This should produce the following output:

    Generating DH parameters, 2048 bit long safe prime, generator 2
    This is going to take a long time

This can take several minutes to complete. When finished, it will return you to the command prompt.

{: .note }
>
>If you would prefer a stronger 4096 bit PEM, it will take longer to generate but otherwise incur unnoticeable overhead during connections on modern equipment. Replace `2048` in the command above with `4096`.
>
>To permanently change the default DH PEM size, edit the bit lengths in `vars` and `server.conf`. Then recreate the file. The DH PEM file can be arbitrily deleted and regenerated with no changes needed to server or client settings.

### Harden OpenVPN

An OpenVPN connection consists of two flow channels between the server and clients: the *Control Channel* and the *Data Channel*. A client connects to the server by initiating a TLS session over the control channel, in which credentials are exchanged between server and clients to establish the data hannel. The data channel is the encrypted pipeline in which all traffic between server and clients is then transmitted.

We'll make some further changes and additions to `server.conf` to strengthen the cryptography used in both channels and restrict the OpenVPN's daemon's priviledges. With exception to steps 1 and 5 which go together, these settings can be applied independently of each other. If you feel that a certain step adds unnecessary complexity, feel free to skip it.

1.  Require a matching HMAC signature for all packets involved in the TLS handshake between the server and connecting clients. Packets without this signature are dropped. Uncomment and edit the line: `tls-auth ta.key 0 # This file is secret`.

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
    tls-auth /etc/openvpn/easy-rsa/keys/ta.key 0 # This file is secret
    ~~~

    Generate the HMAC key file. Later we'll transfer it to each client device.

        openvpn --genkey --secret /etc/openvpn/easy-rsa/keys/ta.key

2.  Create a new limited user account for the OpenVPN daemon to run as and tell it to drop privileges to that account after startup. As an example, the name *ovpn_server* is used.

        adduser --system --shell /usr/sbin/nologin --no-create-home ovpn_server

    Uncomment the `user` and `group` lines, and edit `user` with the username above.

    {: .file-exceprt}
    /etc/openvpn/server.conf
    :   ~~~ conf
    # It's a good idea to reduce the OpenVPN
    # daemon's privileges after initialization.
    #
    # You can uncomment this out on
    # non-Windows systems.
    user openvpn_server
    group nogroup
    ~~~

    By default, OpenVPN runs as root and while the user *nobody* has much fewer priviledges than root, if nobody gets compromized, an intruder will have full access to anything else that user has access to. This includes other processes which run as nobody such as Apache, various NFS mounts and some cron jobs.

    Forcing OpenVPN to run under its own account is a good way of isolating it from the rest of the system, especially if you will also be hosting a web or file server on your VPN.

3.  Change the VPN's data channel to use AES with a 256 bit key in CBC mode. Blowfish-128 is the default, but AES_CBC is generally considered the most secure cipher/mode combination of those supported by OpenVPN (see `openvpn --show-ciphers`) and can take advantage of [AES-NI](https://en.wikipedia.org/wiki/AES_instruction_set) for increased performance.

        echo 'cipher AES-256-CBC' >> /etc/openvpn/server.conf

4.  Change the data channel's authentication digest to SHA512, a [SHA-2](https://en.wikipedia.org/wiki/SHA-2) hash function. SHA-1 is the default; see `openvpn --show-digests` for all supported digests.

        echo 'auth SHA512' >> /etc/openvpn/server.conf

5.  Restrict the VPN's control channel to a strong cipher suite or list of suites. [It is recommended](https://community.openvpn.net/openvpn/wiki/Hardening#Useof--tls-cipher) to be as restrictive as possible here, but not all cipher suites can be used with all versions of OpenVPN.

    Below are three pools of cipher suite options. These are secure choices, but exemplary. You may want to be more less strict depending on client-side support.

    **Option 1**

    If your clients are using **OpenVPN 2.3.3 or above**, you can force the control channel to use several TLS 1.2 cipher suites (or even just one) to ensure connections using forward secrecy, TLS 1.2, AES in [GCM mode](https://en.wikipedia.org/wiki/Galois/Counter_Mode) and SHA 2.

        echo 'tls-cipher TLS-DHE-RSA-WITH-AES-256-GCM-SHA384:TLS-DHE-RSA-WITH-AES-128-GCM-SHA256' >> /etc/openvpn/server.conf

    **Option 2**

    **OpenVPN 2.3.2 or below** does not support a Control Channel using TLS 1.2 cipher suites, so TLS 1.0 suites must be used. Since there are many insecure and otherwise undesirable suites available in TLS 1.0, we'll limit our pool to AES and Camellia in CBC mode using SHA 1. These suites still enforce forward secrecy.

        echo 'tls-cipher TLS-DHE-RSA-WITH-AES-256-CBC-SHA:TLS-DHE-RSA-WITH-CAMELLIA-256-CBC-SHA:TLS-DHE-RSA-WITH-AES-128-CBC-SHA:TLS-DHE-RSA-WITH-CAMELLIA-128-CBC-SHA' >> /etc/openvpn/server.conf

    **Option 3**

    If your VPN clients will be divided among **both OpenVPN versions**, combine the two cipher suite pools.

        echo 'tls-cipher TLS-DHE-RSA-WITH-AES-256-GCM-SHA384:TLS-DHE-RSA-WITH-AES-128-GCM-SHA256:TLS-DHE-RSA-WITH-AES-256-CBC-SHA:TLS-DHE-RSA-WITH-CAMELLIA-256-CBC-SHA:TLS-DHE-RSA-WITH-AES-128-CBC-SHA:TLS-DHE-RSA-WITH-CAMELLIA-128-CBC-SHA' >> /etc/openvpn/server.conf

    The default cipher suite used for the control channel is one agreed on by both server and client during the TLS handshake. The agreement is based on what is supported by their respective OpenSSL versions. See `openvpn --show-tls` for a list of supported ciphers in their order of preference.

## Certificate and Key Pairs

We'll again be working out of the `easy-rsa` directory so be sure you're in that location.

    cd /etc/openvpn/easy-rsa

### Server Credentials

1.  A *root certificate*, sometimes also referred to as a *Certificate Authority*, is the certificate and key pair that will be used to generate client keypairs. At each prompt, add or edit the information to be used in your certificate (or leave them blank). Use your server's hostname or some other identifer as the `Common Name` and leave the challenge password blank.

        ./build-ca

2.  Then create the server's private key and again add or edit at the information prompts as needed.

        ./build-key-server server

    When you've completed the question section for the private key, confirm the signing of the certificate and the `certificate requests certified` by answering `yes` to those two questions.

### Client Credentials

Each client device connecting to the VPN should have its own unique key. Further, each key should have its own identifier (client1, client2, etc.) but all other certificate information can remain the same. **If you need to add users at any time later, just repeat this step**.

    cd /etc/openvpn/easy-rsa && source ./vars && ./build-key client1

{: .note}
>
>Anyone with access to `client1.key` will be able to access your VPN. To better protect against this scenario, you can issue `./build-key-pass client1` instead to build a client key which is encrypted with a passphrase.

## Client Configuration File

Each client also needs a configuration file defining the OpenVPN server's settings for the client. A signle copy of `client.conf` can be used for all clients or you can configure some differently than others. Here we'll assume one client config file for all devices.

1.  Copy the `client.conf` template file to `/tmp` and open it for editing. Most clients require a `.ovpn` file format instead of .conf so we'll change the extension during extraction.

    We will keep a copy of our configured `client.ovpn` on the server as a backup and in case more clients are added in the future. It can **not** be located in `/etc/openvpn` because then the OpenVPN daemon won't know whether to load `client.conf` or `server.conf`. For this reason, we'll store it in the `keys` folder with the other client files, even though `client.ovpn` does not need to be kept secret.

        cp /usr/share/doc/openvpn/examples/sample-config-files/client.conf /etc/openvpn/easy-rsa/keys/client.ovpn

2.  Update the `remote` line with the OpenVPN server's IP address:

    {: .file }
    /etc/openvpn/easy-rsa/keys/client.ovpn
    :   ~~~ conf
        # The hostname/IP and port of the server.
        # You can have multiple remote entries
        # to load balance between the servers.

        remote 123.456.78.9 1194
        ~~~

    {: .note }
    >
    >A hostname would work too but since all Linodes have static public IP addresses, it's preferable for security reasons to connect by IP and bypass the DNS lookup.

3.  Tell the client-side OpenVPN service to drop root priviledges. For non-Windows machines only.

    {: .file }
    /etc/openvpn/easy-rsa/keys/client.ovpn
    :   ~~~ conf
        # Downgrade privileges after initialization (non-Windows only)
        user nobody
        group nogroup
        ~~~

4.  Further down in the file, edit the `crt` and `key` lines to reflect the names and locations **on the client device**. Specify the path to the files if these and `client.ovpn` will not be stored in the same folder.

    {: .file-excerpt}
    /etc/openvpn/easy-rsa/keys/client.ovpn
    :   ~~~ conf
        # SSL/TLS parms.
        # See the server config file for more
        # description.  It's best to use
        # a separate .crt/.key file pair
        # for each client.  A single ca
        # file can be used for all clients.
        ca /path/to/ca.crt
        cert /path/to/client1.crt
        key /path/to/client1.key
        ~~~

5.  Tell the client to use the HMAC key we generated earlier above; again specify the path if necessary.

    {: .file-excerpt}
    /etc/openvpn/easy-rsa/keys/client.ovpn
    :   ~~~ conf
        # If a tls-auth key is used on the server
        # then every client must also have the key.
        tls-auth /path/to/ta.key 1
        ~~~

6.  Since we're forcing certain cryptographic settings on the VPN server, the clients must have the same settings. Add these lines to the end of `client.ovpn`:

        cipher AES-256-CBC
        auth SHA512
        
    If you added any lines for Control Channel cipher suites to the server above ([step 6](/docs/networking/vpn/how-to-install-and-configure-an-openvpn-server#harden-openvpn) of Harden OpenVPN, add those lines to `client.ovpn` too.

7.  Pack all the necessary client files into a tarball ready for transferring. The specific files we want are:

    *  `/etc/openvpn/easy-rsa/keys/ca.crt`
    *  `/etc/openvpn/easy-rsa/keys/client1.crt`
    *  `/etc/openvpn/easy-rsa/keys/client1.key`
    *  `/etc/openvpn/easy-rsa/keys/client.ovpn`
    *  `/etc/openvpn/easy-rsa/keys/ta.key`

    ~~~
    tar -C /etc/openvpn/easy-rsa/keys -cvzf /etc/openvpn/client1.tar.gz {ca.crt,client1.crt,client1.key,client.ovpn,ta.key}
    ~~~

    {: .note}
    >
    >Windows will need [7zip](http://www.7-zip.org/) to extract `.tar` files.

8.  We no longer need to be `root` so change back to your standard user:

        exit

## Initial Startup

Start the OpenVPN daemon and enable it on reboot.

    sudo systemctl enable openvpn.service && sudo systemctl start openvpn.service

{: .note }
>
>This will scan the `/etc/openvpn` directory on the server for files with a `.conf` extension. For every file that it finds, it will create and run a VPN daemon (server) so make sure you don't have a `client.conf` or `client.ovpn` file in there.

### Monitoring OpenVPN for Issues

The logs of both the OpenVPN client and servers will contain all the information you need to confirm connection specifications, view client address assignments and debug connection issues. Even if the connection takes places with seemingly no problems, the logs can contain alerts and messages for how to better configure your setup.

To check the status of the OpenVPN process:

    sudo systemctl status openvpn*.service

That should return:

    ● openvpn.service - OpenVPN service
       Loaded: loaded (/lib/systemd/system/openvpn.service; enabled)
      Active: active (exited) since Tue 2015-10-13 20:55:13 UTC; 14min ago
     Process: 5698 ExecStart=/bin/true (code=exited, status=0/SUCCESS)
    Main PID: 5698 (code=exited, status=0/SUCCESS)
      CGroup: /system.slice/openvpn.service

    Oct 13 20:55:13 localhost systemd[1]: Stopping OpenVPN service...
    Oct 13 20:55:13 localhost systemd[1]: Starting OpenVPN service...
    Oct 13 20:55:13 localhost systemd[1]: Started OpenVPN service.

    ● openvpn@server.service - OpenVPN connection to server
       Loaded: loaded (/lib/systemd/system/openvpn@.service; disabled)
       Active: active (running) since Tue 2015-10-13 20:55:13 UTC; 14min ago
     Process: 5709 ExecStart=/usr/sbin/openvpn --daemon ovpn-%i --status /run/openvpn/%i.status 10 --cd /etc/openvpn --config /etc/openvpn/%i.conf (code=exited, status=0/SUCCESS)
    Main PID: 5725 (openvpn)
      CGroup: /system.slice/system-openvpn.slice/openvpn@server.service
           └─5725 /usr/sbin/openvpn --daemon ovpn-server --status /run/openvpn/server.status 10 --cd /etc/openvpn --config ...

Use `journalctl -f | grep vpn` to monitor the logs of your OpenVPN server in realtime; press **Control+X** to stop monitoring.

## Next Steps

At this point, you should have a operational OpenVPN server and a set of certificat/key pairs for your intended client devices.

If you want your server to forward and receive traffic to/from the internet on behalf of VPN clients, see part two of this series: [Tunnel Your Internet Trafic Through an OpenVPN Server](/docs/networking/vpn/tunnel-your-internet-traffic-through-an-openvpn-server).

If you intend to use your OpenVPN server as an extension of your local network or host services you want to access from your LAN, you would need to configure the specific applications for your use. To set up the connecting client devices, then see part three: [Configuring OpenVPN Client Devices](/docs/networking/vpn/configuring-openvpn-client-devices).

