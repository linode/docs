---
slug: strongswan-vpn-server-install
author:
  name: Tom Henderson
description: 'This guide shows you how to install a StrongSwan VPN server on an Ubuntu 20.04 server. You also learn how to connect to a StrongSwan VPN server from Ubuntu, Windows, and macOS clients.'
keywords: ['install strongswan', 'strongswan client', 'connecting to strongswan VPN', 'troubleshoot strongswan']
bundles: ['network-security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-18
modified_by:
  name: Linode
title: "Install and Configure a StrongSwan Gateway VPN Server on Ubuntu 20.04"
h1_title: "How to Install and Configure a StrongSwan Gateway VPN Server on Ubuntu 20.04"
enable_h1: true
contributor:
  name: Tom Henderson
external_resources:
- '[Introduction to StrongSwan](https://wiki.strongswan.org/projects/strongswan/wiki/IntroductionTostrongSwan)'
---

StrongSwan is an open-source tool that operates as a keying daemon and uses the [Internet Key Exchange protocols](https://en.wikipedia.org/wiki/Internet_Key_Exchange) (IKEv1 and IKEv2) to secure connections between two hosts. In this way, you can use StrongSwan to establish a Virtual Private Network (VPN). VPN connections from a client to the StrongSwan server are encrypted and provide a secure gateway to other resources available on the server and its network. This guide shows you how to install and configure a StrongSwan gateway VPN server on Ubuntu 20.04. You also learn how to set up and connect to a StrongSwan server from an Ubuntu, Windows, and macOS client.

## Install StrongSwan on Ubuntu 20.04 Server

The steps in this section show you how to install and configure a StrongSwan gateway VPN server on Ubuntu 20.04. See the [Install and Configure the StrongSwan Client](#install-and-configure-the-strongswan-client) section if you have already installed and configured the StrongSwan server.

### Prerequisites

1. Deploy an Ubuntu 20.04 server and follow our [Getting Started with Linode](/docs/guides/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/guides/set-up-and-secure/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

### Install StrongSwan

1. [SSH into your Ubuntu 20.04 server](/docs/guides/connect-to-server-over-ssh-on-linux/).

1. [Use APT](/docs/guides/apt-package-manager/) to install StrongSwan and the supporting plugins and libraries.

        sudo apt install strongswan strongswan-pki libcharon-extra-plugins libcharon-extauth-plugins libstrongswan-extra-plugins libtss2-tcti-tabrmd0 -y

### Generate Server Keys and Certificate

1. Use the IPsec command-line utility to create your IPsec private key. In the case of this tutorial, the private key is used to create the root certificate for StrongSwan. You can also use this key to generate other certificates.

        sudo ipsec pki --gen --size 4096 --type rsa --outform pem > /etc/ipsec.d/private/ca.key.pem

1. Create and sign the root certificate with the configurations included below. Ensure you replace the value of the `CN` configuration with your own desired name for your StrongSwan VPN server.

        ipsec pki --self --in /etc/ipsec.d/private/ca.key.pem --type rsa --dn "CN=<Name of this VPN Server>" --ca --lifetime 3650 --outform pem > /etc/ipsec.d/cacerts/ca.cert.pem

    In the example above, the `--lifetime 3650` configuration sets the certificate's lifetime to 3650 days or approximately ten years. The lifetime of the certificate determines when it is to be regenerated and distributed to your StrongSwan server and connected clients. You can adjust this setting to your preferred value.

1. Generate the StrongSwan VPN server's private certificate.

        ipsec pki --gen --size 4096 --type rsa --outform pem > /etc/ipsec.d/private/server.key.pem

1. Generate the host server certificate. There are two ways to generate the certificate, however, they cannot be mixed. The two ways are as follows:

    -  Use a local resolver, like DNS, your hosts' file, or another resolver.
    -  Use a static host gateway server by providing its IPv4 address.

    **Local Resolver Method**
    The example below uses a local resolver. The IPsec utility takes the server key from step 2 and uses it as an input private certificate source, and generates a resolver-based certificate. Ensure you replace the value of `CN` and `san` with your own. The `--dn “CN=<serverhost.ourdomain.tld>` is a DNS or `/etc/hosts` call that should be changed to reflect your organization's own hostname.

        ipsec pki --pub --in /etc/ipsec.d/private/server.key.pem --type rsa | ipsec pki --issue --lifetime 3650 --cacert /etc/ipsec.d/cacerts/ca.cert.pem --cakey /etc/ipsec.d/private/ca.key.pem --dn "CN=<serverhost.ourdomain.tld>" --san="<server.ourdomain.tld>" --flag serverAuth --flag ikeIntermediate --outform pem > /etc/ipsec.d/certs/server.cert.pem

    **Gateway Server IPv4 Address**

    The duplicate `–san=”<server static IP address>` configuration in the command below is correct; do not omit both configurations. Replace their values with your own gateway server's IPv4 address.

        ipsec pki --pub --in /etc/ipsec.d/private/server.key.pem --type rsa | ipsec pki --issue --lifetime 3650 --cacert /etc/ipsec.d/cacerts/ca.cert.pem --cakey /etc/ipsec.d/private/ca.key.pem --dn "CN=<server static IP address>" –san=”<server static IP address>” --san="<server static IP address>" --flag serverAuth --flag ikeIntermediate --outform pem > /etc/ipsec.d/certs/server.cert.pem

At the end of this section, you should have generated the following files on your Ubuntu 20.04 server:

| Location | Component |
|---------------- | ---------------- |
| `/etc/ipsec.d/private/ca.key.pem` | VPN Host Gateway Private Key |
| `/etc/ipsec.d/cacerts/ca.cert.pem` | VPN Host Gateway Root Certificate |
| `/etc/ipsec.d/private/server.key.pem` | VPN Host Gateway Private Key |
| `/etc/ipsec.d/certs/server.cert.pem` | VPN Host Gateway Server Certificate |

### StrongSwan Configurations

1. The Linux kernel aids in packet forwarding between internal and external interfaces, but this is disabled by default in Ubuntu 20.04.

    Use your preferred text editor to edit your `/etc/sysctl.conf` file. The configurations to add enable packet forwarding for IPsec and StrongSwan on your Ubuntu system. Ensure the configurations displayed below are uncommented.

    {{< file "/etc/sysctl.conf" >}}

net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
    {{</ file >}}

1. Configure the StrongSwan file. Open your `/etc/ipsec.conf` file and add the configurations included in the example file below.

    Within the context of StrongSwan, the gateway host server (your Ubuntu server) is referred to as *left* resources. External hosts connecting to the StrongSwan VPN are referred to as *right* resources.

    {{< file "/etc/ipsec.conf" >}}
config setup
        charondebug="ike 1, knl 1, cfg 0, net 1"
        strictcrlpolicy=no
        uniqueids=yes
        cachecrls=no
conn ipsec-ikev2-vpn
      auto=add
      compress=no
      type=tunnel
      keyexchange=ikev2
      fragmentation=yes
      forceencaps=yes
      dpdaction=clear
      dpddelay=300s
      rekey=no
      left=%any
      leftid=@vpn.domain.com #<Note 1>
      leftcert=server.cert.pem
      leftsendcert=always
      leftsubnet=0.0.0.0/0
      right=%any
      rightid=%any
      rightauth=eap-mschapv2
      rightsourceip=0.0.0.0/0 #<Note 2>
      rightdns= #<preferred external DNS server - Note 3>
      rightsendcert=never
      eap_identity=%identity
      ike=chacha20poly1305-sha512-curve25519-prfsha512,aes256gcm16-sha384-prfsha384-ecp384,aes256-sha1-modp1024,aes128-sha1-modp1024,3des-sha1-modp1024!
      esp=chacha20poly1305-sha512,aes256gcm16-ecp384,aes256-sha256,aes256-sha1,3des-sha1!
    {{</ file >}}

    - The `leftid` configuration matches the tunneled network assets that are exposed to VPN clients. A route through this subnet must be reachable if a local resolver is used to access resources.

        The syntax for `leftid` must match the server certificate, resolver/DNS or IP address from step 4 in the [Generate Server Keys and Certificate](#generate-server-keys-and-certificate) section. If the resolver/DNS method was used, place an `@` before the resolved host address. Do not place an `@` symbol in front of an IPv4 address.

    - The `rightsourceip` configuration sets the client IP addresses that are allowed to connect to the StrongSwan VPN. It is possible to limit the scope to an IP address range. This limits the number of addresses that are admitted through the tunnel created by the host server VPN gateway. If the source addresses should only be allowed from a single subnet, specify that subnet. An example would be `10.0.100.0/24`. This subnet allows the 254 hosts in the `10.0.100.0` subnet. This configuration is used for internal VPN resource admittance control.

    - The `rightdns` value may correspond to a public server's IPv4 address. You can also use a private DNS server address for clients to use DNS or hostname resolution. Networks using a local resolver must specify the desired resolver `rightdns` IPv4 address, otherwise queries made to the local tunneled resources fail.

1. Create authentication and access secrets. Access control and authentication require that StrongSwan clients provide a username and password. This information is contained in the `/etc/ipsec.secrets` file.

    Using a text editor, create a the `/etc/ipsec.secrets` file with the following contents:

    {{< file "/etc/ipsec.secrets" >}}
: RSA "/etc/ipsec.d/private/server.key.pem"
username : EAP "<user’s password>"
another_username : EAP "<user’s password>"
    {{</ file >}}

    {{< note >}}
Make sure that you use unique usernames each time you add a new user to the access secrets file.
    {{</ note >}}

Your StrongSwan server is now ready to receive client connections. To check the status of the IPsec tunnel created by StrongSwan, use the following command:

    sudo ipsec status

## Install and Configure the StrongSwan Client

This section shows you how to install the StrongSwan client. The StrongSwan client is used to connect to a StrongSwan server. Ensure you have your StrongSwan server's access credentials ready before beginning the steps corresponding to your computer's operating system.

### Connecting to StrongSwan VPN on Ubuntu

StrongSwan should be installed on Linux systems using Ubuntu 16.04. Older versions require moderate or extensive updates that may break other installed applications.

1. Update your Ubuntu system.

        sudo apt update && upgrade -y

1. Install the StrongSwan client and required plugins.

        sudo apt install strongswan libcharon-extra-plugins

1. Download or copy the StrongSwan host gateway VPN server's certificate. The certificate is located on the VPN server in `/etc/ipsec.d/cacerts/ca.cert.pem`. Store the copied or downloaded certificate in the client's `/etc/ipsec.d/` directory.

1. Add the IPsec secrets file to the StrongSwan client. Using a text editor, add the `/etc/ipsec.secrets` file. The credentials for this user must exactly match those created on the StrongSwan VPN server.

    {{< file "/etc/ipsec.secrets" >}}
<username> : "<password>"
    {{</ file >}}

    If the username or password are changed in the StrongSwan VPN server, then the client's secret file must be updated as well.

1. Create or modify the `/etc/ipsec.conf` configuration file. The file can be configured to support a host gateway VPN server configured for a resolver/DNS or to support access via an IPv4 address. Refer to the example configuration below that corresponds to your StrongSwan VPN server.

    **Resolver/DNS**

    {{< file "/etc/ipsec.conf" >}}
config setup
conn ikev2-rw
    right=<qualified domain name and can also be left blank>
    rightid=<qualified domain of this host>
    rightsubnet=0.0.0.0/0
    rightauth=pubkey
    leftsourceip=%config
    leftid=<username as matched in /etc/ipsec.secrets>
    leftauth=eap-mschapv2
    eap_identity=%identity
    auto=start
    {{</ file >}}

    **Server IPv4 Address**

    {{< file "/etc/ipsec.conf" >}}
config setup
conn ikev2-rw
    right=<IP address of the host VPN>
    rightid=<host as named /etc/ipsec.conf>
    rightsubnet=0.0.0.0/0
    rightauth=pubkey
    leftsourceip=%config
    leftid=<username as matched in /etc/ipsec.secrets>
    leftauth=eap-mschapv2
    eap_identity=%identity
    auto=start
    {{</ file >}}

1. To start the StrongSwan client VPN, use the following command:

        systemctl start strongswan-starter

1. Verify the StrongSwan connection from the client to server, use the following command:

        sudo ipsec status

If needed, the commands below show you how to start and stop StrongSwan using systemctl.

- To automatically start the VPN client after all reboots, use the following command:

        systemctl enable strongswan-starter

-  To stop StrongSwan use the following command:

        systemctl stop strongswan-starter

### Connecting to StrongSwan VPN on Windows 10

#### Importing the VPN Root Certificate on Windows 10

To connect to a StrongSwan VPN gateway server, your Windows 10 system needs a copy of the gateway VPN server's certificate.

- Import the VPN gateway server's certificate that is located in `/etc/ipsec.d/certs/server.cert.pem`. The certificate must be marked as a *VPN Root Certificate*.

- Use the Microsoft Management Console/MMC to configure the VPN’s IPsec information.

1. Open the **Run dialog** box, (**Windows_key-R**), or press the **Windows key**, and enter into the lower-left dialog box, `mmc.exe`. This starts the Microsoft Management Console/MMC.

1. From the **File** menu of the MMC, scroll to **Add or Remove Snap-in**. Select **Certificates** from the list, and click **Add**.

    The Snap-in asks for the account type to manage. From the list that appears, choose **Computer account**.

    Then, choose **Local Compute** unless you manage other computers that also use this certificate. Click **Finish**, and the process is completed.

1. The Console Root MMC displays a list of certificate types on the left side of the MMC, and in the middle, a list of certificates pertaining to the selection on the left.

    On the left of the MMC, open **Trusted Root Certificate Authorities**, then click the **Certificates** folder that appears directly under **Trusted Root Certificate Authorities**.

1. From the MMC **Action** menu, choose **All Tasks**, then **Import**. The **Certificate Import Wizard** appears. Choose **Local Machine**, then browse to the location where the `server.cert.pem` file was imported, and select it.

1. The **Certificate Import Wizard** asks where to import the certificate. The wizard recognizes the type, and places the certificate into the **Trusted Root Certification Authorities certificate store**. Click **Finish** to complete the certificate import process.

#### Connecting a Windows Client to the StrongSwan Gateway VPN Server

The client authentication process relies on the `ipsec.secrets` file located on the gateway VPN server.

1. To configure a new VPN connection on your Windows computer, launch the **Control Panel** from the Windows menu by pressing the **Windows** key. Then, select **Network** and **Sharing Center**.

1. Choose **Setup a new connection or network** and then, select **Connect to a workplace**. Next, select **Choose Use my Internet Connection (VPN)**.

    During this step, you need some details about your gateway VPN server. You should know the server's DNS name if that’s how it was configured in the `ipsec.conf` file. If, however, you used an IPv4 address when configuring the `leftid` value in the `ipsec.conf` file, provide the server's IPv4 address. Finally, you enter a username and password that matches the VPN server's `ipsec.secrets` entry.

1. Start the VPN by clicking its name from the **Taskbar Networks** list of choices.

1. To terminate your VPN connection, click the VPN again and you have disconnected another network.

### Connecting to StrongSwan VPN on macOS

#### Importing the VPN Root Certificate on macOS

1. Download the `ca.cert.pem` file from the StrongSwan gateway VPN server host to your macOS computer [using scp](/docs/guides/download-files-from-your-linode/#secure-copy-protocol-scp).

1. Click on the downloaded file to open **Keychain Access**. Provide your user's administrative password, to accept the certificate. Then, click **Modify Keychain**.

    A dialog appears that asks you about the certificate's trust level. Choose *IP Security (IPSec) to Always Trust**, and enter the macOS user password again.

#### Connecting a macOS Client to the StrongSwan Gateway VPN Server

1. Open **Systems Preferences** from your **Finder**. Click on the **Network** icon. Add a new network by clicking on the **+** button. You may be prompted to enter your user password again.

1. Once the new network choice appears, set the **Interface** to **VPN**. Then, set the **VPN Type** to **IKEv2** and provide a name for this connection. Choose the name of the StrongSwan VPN server from the list.

    You are prompted to provide the server name. Depending on how the VPN server was configured, provide its DNS name or its IPv4 address.

    Provide the username and password configured in the VPN servers `ipsec.secrets` for the current user.

1. To start the VPN, click on the **Network** icon in the top-right menu bar and choose your StrongSwan VPN server's name from the list.

    You can also start the connection from **System Preferences > Network**. Then, click on your StrongSwan VPN server's name.

1. To disconnect, click the VPN server's name. VPN connections are persistent on macOS during **sleep** mode, but not after a reboot.

## Troubleshooting StrongSwan

- Connection problems are frequently due to mismatched username and passwords between the host gateway VPN server (`/etc/ipsec.secrets`) and the VPN client settings.

- Connection issues can also be caused by your firewall settings. Ensure you [check your system's firewall settings](/docs/guides/configure-firewall-with-ufw/) when troubleshooting.

- Finally, check your StrongSwan VPN server's log file (`/var/log/syslog`) to further investigate connection issues.



