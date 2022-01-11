---
slug: strong-swan-vpn-server-ubuntu
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-10
modified_by:
  name: Linode
title: "Strong Swan Vpn Server Ubuntu"
h1_title: "h1 title displayed in the guide."
enable_h1: true
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

StrongSwan is an open source implementation of the IPsec protocol (explain VPN host gateway)
StrongSwan is an open source virtual private network (VPN) tool that supports IPSec ISO/OSI Layer 2 networking. It also includes a variety of authentication tools, algorithms, and options. This tutorial shows you how to use StrongSwan and an Ubuntu 20.04 server as a gateway to network-connected resources “behind” or “inside” the server host. During this tutorial, you also learn how to install StrongSwan VPN on an Ubuntu 20.04 server. The Ubuntu server hosting the StrongSwan VPN makes network resources available to external Windows, macOS, iOS, Linux, and Android users who have the StrongSwan client software installed on their devices. VPN connections from the client to the server are encrypted and provide a secure gateway to other resource available on the server.

## Install StrongSwan on Ubuntu 20.04 Server

### Prerequisites

1. Deploy an Ubuntu 20.04 server and follow our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

### Install StrongSwan

1. Install StrongSwan and the supporting plugins and libraries.

    sudo apt install strongswan strongswan-pki libcharon-extra-plugins libcharon-extauth-plugins libstrongswan-extra-plugins libtss2-tcti-tabrmd0 -y

### Generate Server Keys and Certificate

1. Use the IPsec command line utility to create your IPsec private key. In the case of this tutorial, the private key is used to create the root certificate for StrongSwan. You can also use this key to generate other certificates.

    sudo ipsec pki --gen --size 4096 --type rsa --outform pem > /etc/ipsec.d/private/ca.key.pem

1. Create and sign the root certificate with the following configurations. Ensure you replace the value of the `CN` configuration with your own desired name for your StrongSwan VPN server.

    ipsec pki --self --in /etc/ipsec.d/private/ca.key.pem --type rsa --dn "CN=<Name of this VPN Server>" --ca --lifetime 3650 --outform pem > /etc/ipsec.d/cacerts/ca.cert.pem

In the example above, the `--lifetime 3650` configuration sets the certificate's lifetime to 3650 days, or approximately ten years. The lifetime of the certificate determines when it is to be regenerated and distributed to your StrongSwan server and to connected clients. You can adjust this setting to your preferred value.

1. Generate the StrongSwan VPN server's private certificate.

    ipsec pki --gen --size 4096 --type rsa --outform pem > /etc/ipsec.d/private/server.key.pem

1. Generate the host server certificate. There are two ways to generate the certificate, however, they cannot be mixed. The two ways are as follows:

    -  Use a local resolver, like DNS, your hosts file, or another resolver,
    -  Use a static host gateway server by providing its IPv4 address.

    **Local Resolver Method**
    The example below uses a local resolver. The IPsec utility takes the server key from step 2 and uses it as an input private certificate source, and generates a resolver-based certificate. Ensure you replace the value of `CN` and `san` with your own. The `--dn “CN=<serverhost.ourdomain.tld>` is a DNS or `/etc/hosts` call that should be changed to reflect your organization's own hostname.

        ipsec pki --pub --in /etc/ipsec.d/private/server.key.pem --type rsa | ipsec pki --issue --lifetime 3650 --cacert /etc/ipsec.d/cacerts/ca.cert.pem --cakey /etc/ipsec.d/private/ca.key.pem --dn "CN=<serverhost.ourdomain.tld>" --san="<server.ourdomain.tld>" --flag serverAuth --flag ikeIntermediate --outform pem > /etc/ipsec.d/certs/server.cert.pem

    **Gateway Server IPv4 Address**

    The duplicate `–san=”<server static IP address>` configuration in the command below is correct; do not omit both configurations. Replace their values with your own gateway server's IPv4 address.

    ipsec pki --pub --in /etc/ipsec.d/private/server.key.pem --type rsa | ipsec pki --issue --lifetime 3650 --cacert /etc/ipsec.d/cacerts/ca.cert.pem --cakey /etc/ipsec.d/private/ca.key.pem --dn "CN=<server static IP address>" –san=”<server static IP address>” --san="<server static IP address>" --flag serverAuth --flag ikeIntermediate --outform pem > /etc/ipsec.d/certs/server.cert.pem

At the end of this section, you should have generated the following files on your Ubuntu server:

| Location | Component |
|---------------- | ---------------- |
| `/etc/ipsec.d/private/ca.key.pem` | VPN Host Gateway Private Key |
| `/etc/ipsec.d/cacerts/ca.cert.pem` | VPN Host Gateway Root Certificate |
| `/etc/ipsec.d/private/server.key.pem` | VPN Host Gateway Private Key |
| `/etc/ipsec.d/certs/server.cert.pem` | VPN Host Gateway Server Certificate |

### StrongSwan Configurations

1. The Linux kernel aids in packet forwarding between internal and external interfaces, but this is disabled by default in Ubuntu 20.04.

    Use your preferred text editor, open your `/etc/sysctl.conf` file and add the configurations to enable packet forwarding for IPsec and StrongSwan on your Ubuntu system. Ensure the configurations displayed below are uncommented and display the example values.

    {{< file "/etc/sysctl.conf" >}}

net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0

    {{</ file >}}

1. Configure the StrongSwan file. Open your `/etc/ipsec.conf` file and add the configurations included in the example file.

    Within the context of StrongSwan, the gateway host server (your Ubuntu server) is referred to as *left* resources. External hosts connecting to the StrongSwan VPN are referred to as *right* resources.

    {{< file >}}
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

    {{< note >}}
1. The `leftid` configuration matches the tunneled network assets that are exposed to VPN clients. A route through this subnet must be reachable if a local resolver is used to access resources.

    The syntax for `leftid` must match the server certificate, resolver/DNS or IP address from step 4 in the [Generate Server Keys and Certificate]() secction. If the resolver/DNS method was used, place an `@` before the resolved host address. Do not place an `@` symbol in front of an IPv4 address.

1. The `rightsourceip` configuration sets the client IP addresses that are allowed to connect to the StrongSwan VPN. It is possible to limit the scope to an IP address range. This limits the number of addresses that will be considered for admission through the tunnel created by the host server VPN gateway. If the source addresses should only be allowed from a single subnet, specify that subnet. An example would be `10.0.100.0/24`. This subnet allows the 254 hosts in the `10.0.100.0` subnet. This configuration is used for internal VPN resource admittance control.

1. The `rightdns` value may correspond to a public server's IPv4 address. You can also use a private DNS server address for clients to use DNS or hostname resolution. Networks using a local resolver must specify the desired resolver `rightdns` IPv4 address, otherwise queries made to the local tunneled resources fail.

    {{</ note >}}

1. Create authentication and access secrets. Access control and authentication requires that StrongSwan clients provide a username and password. This information is contained in the `/etc/ipsec.secrets` file.

    Using a text editor, create a the `/etc/ipsec.secrets` file with the following contents:

    {{< file "/etc/ipsec.secrets" >}}
: RSA "/etc/ipsec.d/private/server.key.pem"
username : EAP "<user’s password>"
another_username : EAP "<user’s password>"

    {{</ file >}}

    {{< note >}}
Make sure that you use unique usernames each time you add a new user to the access secrets file.
    {{</ note >}}

## Install and Configure the StrongSwan Client

### Ubuntu

StrongSwan should be installed on a Linux systems using Ubuntu 16.04. Older versions require moderate or extensive updates that may break other installed applications.

1. Update your Ubuntu system.

    sudo apt update && upgrade -y

1. Install the StrongSwan client and required plugins.

    sudo apt install strongswan libcharon-extra-plugins

1. Download or copy the StrongSwan host gateway VPN server's certificate. The certificate is located on the VPN server in `/etc/ipsec.d/cacerts/ca.cert.pem`. Store the copied or downloaded certificate in the client's `/etc/ipsec.d/` directory.

1. Add the IPsec secrets file to the StrongSwan client. Using a text editor, add the `/etc/ipsec.secrets` file. The credentials for this user must exactly match those created on the StrongSwan VPN server.

    {{< file "/etc/ipsec.secrets" >}}
<username> : "<password>"
    {{</ file >}}

    If the username or password are changed in the StrongSwan VPN server, then the client's secrets file must be update as well.

1. Create or modify the `/etc/ipsec.conf` configuration file. The file can be configured to support a host gateway VPN server configured for a resolver/DNS or to support access via an IPv4 address. Refer to the example configuration below that corresponds to your StrongSwan VPN server.

    **Resolver/DNS**

    **Server IPv4 Address**

