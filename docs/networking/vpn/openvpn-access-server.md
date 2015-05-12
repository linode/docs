---
author:
  name: James Stewart
  email: jstewart@linode.com
description: 'Configuring OpenVPN Access Server on your Linode.'
keywords: 'openvpn,networking,vpn,debian,ubuntu,centos,fedora'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Thursday, April 30th, 2015
modified_by:
  name: James Stewart
published: 'Thursday, April 30th, 2015'
title: Secure Communications with OpenVPN Access Server
---

OpenVPN is a very popular software package utilized for creating encrypted tunnels for secure transfer of data.  In this guide, you will learn how to configure your Linode as a VPN gateway using the OpenVPN Access Server software, and connect your Windows, OSX, or Linux computer to it.

Before installing OpenVPN Access Server, you will need to follow our [getting started guide](/docs/getting-started/). You will also want to follow our [Securing Your Server](/docs/security/basics) guide to ensure the security of your Linode.

Installing OpenVPN Access Server
--------------------------------

1.  Update the Linode to ensure that you have the latest packages, using your installed package manager.

2.  Create a new directory to use for storing the OpenVPN installer

		mkdir openvpn
		cd openvpn

3.  Download the latest version of [OpenVPN Client Connect](https://openvpn.net/index.php/access-server/download-openvpn-as-sw.html) for your distribution of choice.  Installation packages are provided for the listed distributions in supported package formats.  Install using the following commands, based on your system's package manager.

	Debian based systems (Debian/Ubuntu):
		
		sudo dpkg -i /path/to/download

	RPM based systems(Fedora/CentOS/OpenSuse):
		
		sudo rpm --install /path/to/download

4.  Once the install process is completed, information on accessing the Admin and Client UI will be displayed.

		Access Server web UIs are available here:
		Admin  UI: https://192.0.2.1:943/admin
		Client UI: https://192.0.2.1:943/

	The Admin user interface will be utilized for configuration of the OpenVPN Access Server, while the Client UI is used for downloading the VPN packages to connect new client computers

5.  Set the password for the OpenVPN user.
		
		passwd openvpn

Configuring OpenVPN Access Server
---------------------------------

###Configuring Client Settings

1.  Connect to the OpenVPN Access Server admin web interface address shown at the end of the install process, using the password that you set for your OpenVPN User.

	[![OpenVPN Admin Web Interface.](/docs/assets/openvpn-admin-web-resize.png)](/docs/assets/openvpn-admin-web.png)

2.  Click the Client Settings option, and ensure that all options besides "Offer server-locked profile" are checked.

	[![OpenVPN Admin Web Interface.](/docs/assets/openvpn-server-profiles.png)](/docs/assets/openvpn-server-profiles.png)

3.  Once the changes to the settings have been saved, you will be prompted to reload the OpenVPN server.

	[![OpenVPN Admin Web Interface.](/docs/assets/openvpn-update-server-resize.png)](/docs/assets/openvpn-update-server.png)

###User Management

You can add additional users to your OpenVPN Access Server to enable auditing of connections to your VPN tunnel, and user level access control.

{: .note}
>
> OpenVPN Access Server's free edition is limited to two users.  If you require additional users for your VPN, you can view pricing details and purchase licenses at [OpenVPN's Website](https://openvpn.net/index.php/access-server/pricing.html)

1.  From the OpenVPN Access Server admin web interface, click the User Permissions tab.

2.  Enter the new username that you wish to add in the "New Username" field at the bottom fo the list.

	[![OpenVPN Admin User Interface.](/docs/assets/openvpn-admin-web-resize.png)](/docs/assets/openvpn-admin-web.png)

3.  View and configure additional settings for the new user by clicking the "Show" link in the More Settings column.

	[![OpenVPN Admin User Settings.](/docs/assets/openvpn-admin-user-settings.png)](/docs/assets/openvpn-admin-user-settings.png)

4.  Click the "Save Settings" option at the bottom of the page to complete the creation of the new user account.

###Permit Autologin Profiles

If you wish to configure autologin profiles, you will need to modify your user settings to allow autologin profiles to be displayed on the connections page.

{: .caution}
>
> This configuration type can be useful for connecting other servers to your VPN on startup, or for configuring a system that will always route all of its traffic over the VPN automatically.  Utilizing this type of profile will cause all of your non-local traffic to be routed over the VPN automatically.  If you wish to enable and disable your VPN at will, you will want to utilize User or Server locked profiles instead.

1.  From the OpenVPN Access Server admin web interface, visit the User Permissions tab.

2.  Fill in the check mark next to "Allow Auto Login" for the required user to enable this profile.

	[![OpenVPN Autologin.](/docs/assets/openvpn-autologin.png)](/docs/assets/openvpn-autologin.png)


Client Software Installation
----------------------------

###Windows

1.  Connect to the OpenVPN access server client interface.  Click the link to download the OpenVPN Connect software to your computer.

	[![OpenVPN Admin Web Interface.](/docs/assets/openvpn-download-page-resize.png)](/docs/assets/openvpn-download-page.png)

2.  When prompted, click run to kick off the installation process.

	[![Windows Client UI.](/docs/assets/openvpn-windows-installer-1-resize.png)](/docs/assets/openvpn-windows-installer-1.png)

3.  Once the installation has completed, you should be presented with the OpenVPN login window.  Your server's IP address should be pre-filled in.  You will need to enter the username and password of your OpenVPN user.

	[![Windows Client UI.](/docs/assets/openvpn-connect-windows-2-resize.png)](/docs/assets/openvpn-connect-windows-2.png)

4.  You can utilize the OpenVPN icon located in your Windows taskbar to view the status of your VPN connection, and disconnect or reconnect to the VPN.

	[![OpenVPN Taskbar Icon.](/docs/assets/openvpn-connect-windows-4-resize.png)](/docs/assets/openvpn-connect-windows-4-1.png)


###OSX

1.  Connect to the OpenVPN Access Server client interface, and click the link to download the OpenVPN Connect Software.

2.  Once the DMG package has downloaded, a Finder window will open with the Installer package icon.

	[![DMG Finder Window.](/docs/assets/openvpn-install-osx-1-resize.png)](/docs/assets/openvpn-install-osx-1.png)

3.  Double click the OpenVPN Connect installer package.  A prompt will open requesting approval to open the package.  Click Open to continue with the installation.

	[![DMG Finder Window.](/docs/assets/openvpn-osx-install-2-resize.png)](/docs/assets/openvpn-osx-install-2.png)

4.  Once the installation process has completed, you will see an OpenVPN icon in your OSX taskbar.  Right clicking this icon will bring up the context menu for starting your OpenVPN connection

	[![DMG Finder Window.](/docs/assets/openvpn-osx-install-3-resize.png)](/docs/assets/openvpn-osx-install-3.png)

5.  Clicking Connect will bring up a window prompting for the OpenVPN username and password.  Enter the credentials for your OpenVPN user and click Connect to establish a VPN tunnel

	[![DMG Finder Window.](/docs/assets/openvpn-osx-install-4-resize.png)](/docs/assets/openvpn-osx-install-4.png)

###Linux installation

1.  Download and install the OpenVPN client software using your distribution's package manager.

	Debian/Ubuntu

		sudo apt-get install openvpn

	Fedora/CentOS

		sudo yum install OpenVPN

2.  Connect to the OpenVPN Access Server client interface, and download the appropriate profile for your usage.

	[![DMG Finder Window.](/docs/assets/openvpn-download-profile-ubuntu-resize.png)](/docs/assets/openvpn-download-profile-ubuntu.png)

3.  Copy the downloaded profile to your /etc/openvpn folder, and rename it to client.conf.  Replace ~/Downloads/client.ovpn with the location of your download folder, if necessary.

		cp ~/Downloads/client.ovpn /etc/openvpn/client.conf

4.  Enter the following command to start your OpenVPN Tunnel.  Unless you have configured and downloaded an autologin profile, you will be prompted for your OpenVPN user's username and password.

		sudo service openvpn start

5.  Run the ifconfig command to view your network connections.  Once the VPN interface has come online, a "tun0" interface will be added to the list.

		ip addr

{: .note}
>
>After completing this process on any of the listed operating systems, you can utilize a website such as [WhatIsMyIp.com](https://www.whatismyip.com) to verify your VPN connectivity.  If successful, the site should return the IP address of your Linode rather than your local IP.

