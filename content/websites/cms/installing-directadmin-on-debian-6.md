---
author:
  name: Chris Ciufo
  email: docs@linode.com
description: Installing DirectAdmin on Debian 6
keywords: ["directadmin", " install", " control panels", " debian"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-applications/control-panels/directadmin/installing-directadmin/']
modified: 2013-10-03
modified_by:
  name: Linode
published: 2011-11-02
title: Installing DirectAdmin on Debian 6
deprecated: true
---

[DirectAdmin](http://directadmin.com) is a commercial web-based control panel for server systems. It can help ease the burden of common system administration tasks such as website creation, database deployment and management, and more. This guide will help you get up and running with the DirectAdmin control panel on your Debian 6 Linode. Please note that Linode does not sell DirectAdmin licenses; you'll need to obtain one directly from DirectAdmin or an authorized distributor. Additionally, Linode does not provide DirectAdmin support, although you may contact [DirectAdmin support](http://www.directadmin.com/support.html) directly once you've purchased a license. This product should be installed on a freshly deployed Debian 6 Linode. These instructions should be performed as the "root" user via SSH.

Basic System Configuration
--------------------------

Edit your `/etc/hosts` file to resemble the following example. Replace "hostname" with a unique name for your server, "example.com" with your domain name, and "12.34.56.78" with your Linode's public IP address. If your Linode has two IPs assigned to it, use the first IP in the list displayed on the "Remote Access" tab of the Linode Manager.

{{< file >}}
/etc/hosts
{{< /file >}}

> 127.0.0.1 localhost.localdomain localhost 12.34.56.78 hostname.example.com hostname

Set your system's hostname by issuing the following commands, replacing quoted "hostname" entries with your system's short hostname:

    echo "hostname" >> /etc/hostname
    hostname -F "hostname"

Edit the `/etc/network/interfaces` file to resemble the following, replacing `12.34.56.78` with your Linode's IP address and `12.34.56.1` with its default gateway. If your Linode has two IPs assigned to it, use the first IP in the list displayed on the "Remote Access" tab of the Linode Manager.

{{< file >}}
/etc/network/interfaces
{{< /file >}}

> iface eth0 inet static
> :   address 12.34.56.78 netmask 255.255.255.0 gateway 12.34.56.1
>
If your Linode has a second IP address, edit the `/etc/network/interfaces` file to resemble the following. Replace `98.76.54.32` with the second IP address. No gateway should be specified for this IP address, as all traffic will be properly routed through the primary IP's gateway.

{{< file >}}
/etc/network/interfaces
{{< /file >}}

> iface eth0:0 inet static
> :   address 34.56.78.90 netmask 255.255.255.0
>
Restart networking by issuing the following command:

    /etc/init.d/networking restart

Edit the `/etc/resolv.conf` to resemble the following, replacing `11.11.11.11` and `22.22.22.22` with the DNS servers listed on the "Remote Access" tab in the Linode Manager.

{{< file >}}
/etc/resolv.conf
{{< /file >}}

> nameserver 11.11.11.11 nameserver 22.22.22.22 options rotate

Once you have confirmed that your networking settings have been correctly configured, issue the following command to uninstall the DHCP client, as it is no longer required:

    apt-get remove isc-dhcp-client dhcp3-client dhcpcd

You'll also need to install a few items to finish preparing your system for DirectAdmin:

    apt-get install gcc g++ make flex bison openssl libssl-dev perl perl-base perl-modules libperl-dev libaio1 libaio-dev

Installing DirectAdmin
----------------------

Before proceeding, make sure you've purchased a DirectAdmin license. You may obtain a license directly from [the DirectAdmin site](https://www.directadmin.com/createclient.php). Next, log into your Linode as the "root" user via SSH to its IP address (found on the "Remote Access" tab in the Linode Manager). Issue the following commands to download and install DirectAdmin.

    wget http://www.directadmin.com/setup.sh
    chmod 755 setup.sh
    ./setup.sh

When you start the install, you will be presented with several questions before the install begins:

    Please enter your Client ID : [Your User ID]
    Please enter your License ID : [Your License ID]
    -e Please enter your hostname \(server.domain.com\)
    It must be a Fully Qualified Domain Name
    Do *not* use a domain you plan on using for the hostname:
    eg. don't use domain.com. Use server.domain.com instead.
    Do not enter http:// or www
    Enter your hostname (FQDN) : server.example.com

You'll also need to select the interface:

    The following ethernet devices/IPs were found. Please enter the name of the device you wish to use:
    dummy0
    eth0       12.34.56.78
    gre0
    ip6tnl0
    teql0
    tunl0
    Enter the device name: eth0
    Is 12.34.56.78 the IP in your license? (y,n) : y

You'll then need to confirm the operating system you are installing DirectAdmin on:

    DirectAdmin will now be installed on: debian 6.0
    Is this correct? (must match license) (y,n) : y

You can then select your Apache/PHP installation:

    You now have 2 options for your apache/php setup.
    1: customapache: end-of-life software. Includes Apache 1.3, php 4 and frontpage.  **Not recommended**.  Will not work with newer OSs. Limited tech support.
    2: custombuild 1.1:  newer software (recommended). Includes any Apache version, php 4, 5, or both in cli and/or suphp. Frontpage not available.
                 Post any issues with custombuild to the forum: http://www.directadmin.com/forum/forumdisplay.php?f=61
    Enter your choice (1 or 2): 2

After you input your answers, the install will then proceed. You should go grab a cup of coffee and watch your favorite TV show or do some light reading, it will take a bit to complete. When the installer finishes, you'll receive some output you'll need to make a note of, specifically your admin username, password, and email, along with the DirectAdmin login URL.

Configuring DirectAdmin
-----------------------

You may want to configure the DirectAdmin manager login to use SSL, either on the main port or a separate port. To configure the main port (2222) to use SSL, you'll need to edit your `/usr/local/directadmin/conf/directadmin.conf` file. You'll want to find this line:

{{< file-excerpt >}}
/usr/local/directadmin/conf/directadmin.conf
{{< /file-excerpt >}}

> SSL=0

And change it to:

{{< file-excerpt >}}
/usr/local/directadmin/conf/directadmin.conf
{{< /file-excerpt >}}

> SSL=1

If you would prefer to leave 2222 open as a non-SSL port and run a copy of DirectAdmin on a separate port for SSL, you'll need to find this line:

{{< file-excerpt >}}
/usr/local/directadmin/conf/directadmin.conf
{{< /file-excerpt >}}

> port=2222

And add this line below it:

{{< file-excerpt >}}
/usr/local/directadmin/conf/directadmin.conf
{{< /file-excerpt >}}

> ssl\_port=2223

You can modify the ssl\_port value to any available port you like. Once you make your changes to the directadmin.conf file, you'll need to restart DirectAdmin for those changes to take effect:

    service directadmin restart

If you enable SSL for the DirectAdmin manager login, you can use either a commercial or self-signed SSL. To create a self-signed SSL for your DirectAdmin login page, simply issue these commands as root in SSH:

    /usr/bin/openssl req -x509 -newkey rsa:1024 -keyout /usr/local/directadmin/conf/cakey.pem -out /usr/local/directadmin/conf/cacert.pem -days 9000 -nodes
    chown diradmin:diradmin /usr/local/directadmin/conf/cakey.pem
    chmod 400 /usr/local/directadmin/conf/cakey.pem

If you are using a commercial SSL for your DirectAdmin manager, you can paste that data into the following files: Certificate: /usr/local/directadmin/conf/cacert.pem Key: /usr/local/directadmin/conf/cakey.pem CA Root Certificate: /usr/local/directadmin/conf/carootcert.pem

If your issuer does have a CA Root Cert, you'll also need to modify your directadmin.conf file to make use of that certificate: Find this section:

{{< file-excerpt >}}
/usr/local/directadmin/conf/directadmin.conf
{{< /file-excerpt >}}

> SSL=0 cacert=/usr/local/directadmin/conf/cacert.pem cakey=/usr/local/directadmin/conf/cakey.pem ssl\_cipher=SSLv3

And update it to:

{{< file-excerpt >}}
/usr/local/directadmin/conf/directadmin.conf
{{< /file-excerpt >}}

> SSL=0 cacert=/usr/local/directadmin/conf/cacert.pem cakey=/usr/local/directadmin/conf/cakey.pem carootcert=/usr/local/directadmin/conf/carootcert.pem ssl\_cipher=SSLv3

IPv6 with DirectAdmin
---------------------

DirectAdmin also has basic support for IPv6. To activate this support, you'll need to edit your directadmin.conf file again. You'll need to add this line anywhere in your directadmin.conf file:

{{< file-excerpt >}}
/usr/local/directadmin/conf/directadmin.conf
{{< /file-excerpt >}}

> ipv6=1

You'll then need to restart DirectAdmin for that change to take effect:

    service directadmin restart

Further information on DirectAdmin's IPv6 functionality can be viewed on their web site: <http://www.directadmin.com/features.php?id=936>

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [DirectAdmin Home Page](http://directadmin.com)
- [DirectAdmin Support](http://www.directadmin.com/support.html)
- [DirectAdmin Knowledgebase](http://help.directadmin.com/)
- [DirectAdmin Third Party Plugins](http://www.directadmin.com/forum/showthread.php?t=19688)



