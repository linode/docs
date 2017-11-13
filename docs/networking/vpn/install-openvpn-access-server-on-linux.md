---
author:
    name: James Stewart
    email: jstewart@linode.com
description: 'This guide will show how to install and configure an OpenVPN access server on Linux distributions for secure communications.'
keywords: ["openvpn", "networking", "vpn", "debian", "ubuntu", "centos", "fedora"]
aliases: ['networking/vpn/openvpn-access-server/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-10-11
modified_by:
    name: Linode
published: 2015-04-30
title: Install OpenVPN Access Server on Linux for Secure Communications
---

## What is OpenVPN?

OpenVPN is a popular software package which creates encrypted tunnels for secure data transfer.  In this guide, you will learn to configure your Linode as a VPN gateway using the OpenVPN Access Server software, and connect your Windows, OSX, or Linux computer to it.

Before installing OpenVPN Access Server, you will need to follow our [Getting Started](/docs/getting-started/) guide. We also suggest following our [Securing Your Server](/docs/security/basics) guide.

{{< note >}}
After securing your server, ensure that TCP port `943` and UDP port `1194` are permitted through your firewall in order for the OpenVPN Access Server to function.
{{< /note >}}

## Install OpenVPN Access Server

1.  Update the Linode to ensure that you have the latest packages, using your installed package manager.

2.  Create a new directory for the OpenVPN installer.

		mkdir openvpn
		cd openvpn

3.  Download the latest version of [OpenVPN Access Server](https://openvpn.net/index.php/access-server/download-openvpn-as-sw.html) for your distribution of choice.  Installation packages are provided for the listed distributions in supported package formats.  Install using the following commands, based on your system's package manager.

	Debian based systems (Debian/Ubuntu):

		sudo dpkg -i openvpn-as-*.deb

	RPM based systems(Fedora/CentOS/OpenSuse):

		sudo rpm --install openvpn-as-*.rpm

4.  Once the install process is complete, information on accessing the Admin and Client UI will be displayed.

		Access Server web UIs are available here:
		Admin  UI: https://192.0.2.1:943/admin
		Client UI: https://192.0.2.1:943/

	The Admin UI is where you configure the OpenVPN Access Server, while the Client UI is used to download the VPN packages to connect new client computers

5.  Set the password for the OpenVPN user.

		sudo passwd openvpn

## Configure OpenVPN Client Settings

1.  Connect to the Admin UI address shown at the end of the install process, using the password for your OpenVPN User.

	[![OpenVPN Admin Web Interface.](/docs/assets/openvpn-admin-web-resize.png)](/docs/assets/openvpn-admin-web.png)

2.  Click the **Client Settings** link, and ensure that all options besides "Offer server-locked profile" are checked.

	[![OpenVPN Admin Web Interface.](/docs/assets/openvpn-server-profiles.png)](/docs/assets/openvpn-server-profiles.png)

3.  Once the changes to the settings have been saved, you will be prompted to update the running server.

    [![OpenVPN Admin Web Interface.](/docs/assets/openvpn-update-server-resize.png)](/docs/assets/openvpn-update-server.png)

### OpenVPN User Management

You can add additional users to your OpenVPN Access Server to enable auditing of connections to your VPN tunnel, and user level access control.

{{< note >}}
OpenVPN Access Server's free edition is limited to two users. If you require additional users for your VPN, you can view pricing details and purchase licenses at [OpenVPN's Website](https://openvpn.net/index.php/access-server/pricing.html)
{{< /note >}}

1.  From the admin web interface, click the **User Permissions** link under User Management.

2.  Enter the new username that you wish to add in the `New Username` field at the bottom of the list.

	[![OpenVPN Admin User Interface.](/docs/assets/openvpn-user-management-resize.png)](/docs/assets/openvpn-user-management.png)

3.  View and configure additional settings for the new user by clicking the **Show** link in the "More Settings" column.

	[![OpenVPN Admin User Settings.](/docs/assets/openvpn-admin-user-settings-resize.png)](/docs/assets/openvpn-admin-user-settings.png)

4.  Click the **Save Settings** option at the bottom of the page to complete the creation of the new user account.

### Permit Autologin Profiles

If you wish to configure autologin profiles, you will need to modify your user settings to allow autologin profiles to be displayed on the connections page.

{{< caution >}}
This configuration type can be useful for connecting other servers to your VPN on startup, or for configuring a system that will always route all of its traffic over the VPN automatically.  Utilizing this type of profile will cause all of your non-local traffic to be routed over the VPN automatically.  If you wish to enable and disable your VPN at will, you will want to utilize User or Server locked profiles instead.
{{< /caution >}}

1.  From the OpenVPN Access Server admin web interface, visit the User Permissions link.

2.  Fill in the check mark next to "Allow Auto Login" for the required user to enable this profile.

	[![OpenVPN Autologin.](/docs/assets/openvpn-autologin-resize.png)](/docs/assets/openvpn-autologin.png)

## Client Software Installation

### Windows

1.  Connect to the OpenVPN Access Server Client UI. Click the link to download the OpenVPN Connect software to your computer.

	[![OpenVPN Admin Web Interface.](/docs/assets/openvpn-download-page-resize.png)](/docs/assets/openvpn-download-page.png)

2.  When prompted, click run to kick off the installation process.

	[![Windows Client UI.](/docs/assets/openvpn-windows-installer-1-resize.png)](/docs/assets/openvpn-windows-installer-1.png)

3.  Once the installation has completed, you should be presented with the OpenVPN login window. Your server's IP address should be pre-filled in.  You will need to enter the username and password of your OpenVPN user.

4.  You can utilize the OpenVPN icon located in your Windows taskbar to view the status of your VPN connection, and disconnect or reconnect to the VPN.

	[![OpenVPN Taskbar Icon.](/docs/assets/openvpn-connect-windows-4-resize.png)](/docs/assets/openvpn-connect-windows-4.png)

### Mac OS

1.  Connect to the OpenVPN Access Server Client UI, and click the link to download the OpenVPN Connect Software.

2.  Once the DMG package has downloaded, a Finder window will open with the Installer package icon.

	[![DMG Finder Window.](/docs/assets/openvpn-install-osx-1-resize.png)](/docs/assets/openvpn-install-osx-1.png)

3.  Double click the OpenVPN Connect installer package. A prompt will open requesting approval to open the package.  Click Open to continue with the installation.

	[![DMG Finder Window.](/docs/assets/openvpn-osx-install-2-resize.png)](/docs/assets/openvpn-osx-install-2.png)

4.  Once the installation process has completed, you will see an OpenVPN icon in your OSX taskbar. Right clicking this icon will bring up the context menu for starting your OpenVPN connection.

	[![DMG Finder Window.](/docs/assets/openvpn-osx-install-3-resize.png)](/docs/assets/openvpn-osx-install-3.png)

5.  Clicking Connect will bring up a window prompting for the OpenVPN username and password. Enter the credentials for your OpenVPN user and click Connect to establish a VPN tunnel.

	[![DMG Finder Window.](/docs/assets/openvpn-osx-install-4-resize.png)](/docs/assets/openvpn-osx-install-4.png)

### OpenVPN for Linux

1.  Download and install the OpenVPN client software using your distribution's package manager.

	Debian/Ubuntu:

		sudo apt-get install openvpn

	Fedora/CentOS:

		sudo yum install OpenVPN

2.  Connect to the OpenVPN Access Server Client UI, and download the appropriate profile for your usage.

	[![DMG Finder Window.](/docs/assets/openvpn-download-profile-ubuntu-resize.png)](/docs/assets/openvpn-download-profile-ubuntu.png)

    {{< note >}}
If you are connecting a headless machine to your OpenVPN server, such as another Linode, you will need to utilize the wget tool to download the appropriate profile.  You can do so by copying the link from the OpenVPN Access Server client page for your required profile, and then utilizing the [wget](/docs/tools-reference/tools/download-resources-from-the-command-line-with-wget) tool to download the client profile.
{{< /note >}}

3.  Copy the downloaded profile to your `/etc/openvpn` folder, and rename it to `client.conf`. Replace `~/Downloads/client.ovpn` with the location of your download folder, if necessary.

		sudo cp ~/Downloads/client.ovpn /etc/openvpn/client.conf

4.  Start the OpenVPN Tunnel service. Unless you have configured and downloaded an autologin profile, you will be prompted for your OpenVPN user's username and password.

		sudo service openvpn start

5.  Run the ifconfig command to view your network connections. Once the VPN interface has come online, a `tun0` interface will be added to the list.

		ip addr

{{< note >}}
After completing this process on any of the listed operating systems, you can utilize a website such as [WhatIsMyIp.com](https://www.whatismyip.com) to verify your VPN connectivity. You can also query from the command line with `curl ifconfig.me` If successful, these steps should return the IP address of your Linode rather than your local IP.
{{< /note >}}
