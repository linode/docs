---
author:
  name: Chris Walsh
  email: docs@linode.com
description: 'This guide will show you how to install, configure and fine-tune OpenVPN clients on Android, iOS, Linux, OS X and Windows.'
keywords: 'openvpn,vpn,vpn tunnel,ios,os x,mac,windows,android'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 'Thursday, July 13th, 2017'
modified_by:
  name: Steven Jacobs
published: 'Wednesday, December 9th, 2015'
title: 'Configuring OpenVPN Client Devices'
external_resources:
 - '[Official OpenVPN Documentation](https://openvpn.net/index.php/open-source/documentation/howto.html)'
 - '[Tunnelblick OS X OpenVPN Client](https://www.tunnelblick.net/)'
 - '[OpenVPN GUI for Windows](https://openvpn.net/index.php/open-source/downloads.html)'
 - '[Network Manager GNOME Configuration Management Tool](https://wiki.gnome.org/Projects/NetworkManager)'
---

This guide is the third of a three-part series to set up a hardened OpenVPN environment. Though it's recommended that you first complete parts one and two, [Set up a Hardend OpenVPN Server on Debian 8](/docs/networking/vpn/set-up-a-hardened-openvpn-server) and [Tunnel Your Internet Traffic Through an OpenVPN Server](/docs/networking/vpn/tunnel-your-internet-traffic-through-an-openvpn-server), this guide can stand on its own as a general tutorial for configuring OpenVPN clients on various operating systems, including mobile.

![Configuring OpenVPN Client Devices](/docs/assets/configuring-openvpn-client-devices.png "Configuring OpenVPN Client Devices")

## Before You Begin

You must already have the client files on your OpenVPN server. These are:

*  The root certificate (CA): `ca.crt`.
*  Client certificate: `client1.crt`.
*  Client key: `client1.key`.
*  HMAC secret key: `ta.key`.
*  Client configuration file: `client.ovpn`.

In part one of this series, these files were packaged into a tarball located at `/etc/openvpn/client1.tar.gz` on your OpenVPN server. **Each client** will need its own credentials archive with its own unique key. If you still need your client credentials, see [Part One, Step 7](/docs/networking/vpn/set-up-a-hardened-openvpn-server#client-configuration-file) of the client configuration area to create them.

## Transfer Client Credentials

Client credentials must be moved to the client device using an encrypted transfer protocol such as [SCP or SFTP](/docs/tools-reference/linux-system-administration-basics#how-to-upload-files-to-a-remote-server). FTP or telnet should **not** be used because these protocols do not encrypt any traffic.

### Android / iOS

Various apps for SCP and SFTP support are available in both platforms' app stores. If you don't already have one and do not want to install new software or take the time to find something you prefer, then you should transfer the VPN client files to a desktop computer. From there, they can be imported into Android or iOS over a USB connection as explained later on this page.

### Linux / OS X

Linux and OS X can use SCP natively from the command line. To download your client's tarball to your local user's Home directory using SCP:

    scp example_user@server_ip_address:/etc/openvpn/client1.tar.gz ~/

{: .note}
>
>`example_user` is the VPN server's user account you want to connect as.

### Windows

Windows has no native SCP or SFTP support. See [our Filezilla guide](/docs/tools-reference/file-transfer/filezilla) to use it for transferring the VPN credentials. Windows will also need [7zip](http://www.7-zip.org/) to extract a tarball. An alternative to installing 7zip in Windows would be to install the package `zip` on your VPN server and use it to create a `.zip` archive.

## Client-Side Configurations

### Android

Android uses OpenVPN Connect to manage OpenVPN connections. If you have a Linux computer with the package `gvfs-backends` installed, or a Windows computer, you can connect the device by USB and it will be visible in the system's file manager as an external USB device. If you have Apple OS X, you need to first install [Android File Transfer](https://android.com/filetransfer/).

{: .note }
>
>The following example was peformed on Android 5.1.1 with OpenVPN Connect 1.0.5.

1.  Ensure that your Android device is fully updated, then install [OpenVPN Connect](https://play.google.com/store/apps/details?id=net.openvpn.openvpn).

    ![Google Play Store OpenVPN Connect](/docs/assets/google-play-openvpn-connect.png)

2.  Ensure that [Media Transfer Protocol](https://en.wikipedia.org/wiki/Media_Transfer_Protocol) is enabled. In **Settings** > **Storage**, open the **overflow menu** (the three vertical dots) and tap **USB computer connection**; **Media device (MTP)** should be checked. Connect your Android device by USB to your computer and copy over the folder containing the client credentials.

3.  Import the VPN profile from **Menu** > **Import** > **Import Profile from SD card**. Navigate to the profile location, tap it and then tap **SELECT**.

4.  Tap **Connect** to connect to the VPN server, then **OK** at the Connection request prompt for OpenVPN. Shortly after, Android will be connected.

    ![OpenVPN Connect profile imported](/docs/assets/openvpn-connect-android-profiile-imported.png)

    ![OpenVPN Connect profile imported](/docs/assets/openvpn-connect-android-connected.png)

5.  OpenVPN Connect's app settings can be used to further tweak the connection. Here you can specify whether the VPN is to be used over WiFi connections, cellular, or both; disable Google DNS and other options.

    For detailed explanations of each choice, see the [OpenVPN Connect Android FAQ](https://docs.openvpn.net/docs/openvpn-connect/openvpn-connect-android-faq.html).

    ![OpenVPN Connect Android settings.](/docs/assets/openvpn-settings-android.png)

### iOS

Apple's iOS for iPhones and iPads uses OpenVPN Connect to manage OpenVPN connections. We'll use iTunes to transfer the file to the iOS device from a computer running OS X or Windows. A Linux computer with the pacage `gvfs-backends` installed can mount the iOS device as external storage. From there, the file manager can be used.

{: .note }
>
>The following example was peformed on iOS 9.0.2 and OS X 10.10 using iTunes 12 and OpenVPN Connect 1.0.5.

1.  Ensure that your iOS device is fully updated, then install [OpenVPN Connect](https://itunes.apple.com/us/app/openvpn-connect/id590379981) from the App store.

    ![iTunes App Store OpenVPN Connect](/docs/assets/itunes-appstore-openvpn-connect.png)

2.  Connect your iOS device by USB to your computer running OS X or Windows. Open iTunes.

3.  Select the icon for iPad or iPhone near the top-left of the menu bar.

    [![iTunes device summary](/docs/assets/itunes-device-summary-small.png)](/docs/assets/itunes-device-summary.png)

    {: .note}
    >
    >If this is the first time connecting your iOS device to iTunes, you'll need to click on the overflow menu (the three horizontal dots) and choose **Apps**, then click **Get Started**.

4.  In the left sidebar, choose **Apps** and scroll down to the **File Sharing** category in the main window. You will see the icon for OpenVPN Connect. Click it, then click **Add** in the **OpenVPN Documents** box. Navigate to your `ta.key` file and `.opvn` client profile and drag them into the window from Finder. If you add them individually, add the key before the client profile. Otherwise, OpenVPN Connect will say it can't find the key.

    [![iTunes File Sharing](/docs/assets/itunes-file-sharing-small.png)](/docs/assets/itunes-file-sharing.png)

5.  After you've added the profile to iTunes on your computer, go back to the iOS device and open the OpenVPN Connect app. You'll see an area saying that a new OpenVPN profile is available for import. Tap it to highlight the profile, then tap the green button to add it.

    [![OpenVPN Connect import profile](/docs/assets/openvpn-connect-itunes-import-profile-small.png)](/docs/assets/openvpn-connect-itunes-import-profile.png)

6.  In the next screen, tap the **Connection** slider to start the connection.

    [![OpenVPN Connect connection status](/docs/assets/openvpn-connect-status-small.png)](/docs/assets/openvpn-connect-status.png)

7.  You'll see a notification prompt asking to allow OpenVPN to enable the connection. Choose **Yes**. Shortly after, iOS will be connected.

    [![OpenVPN Connect, connected.](/docs/assets/openvpn-ios-connected-small.png)](/docs/assets/openvpn-ios-connected.png)

8.  OpenVPN Connect's app settings can be used to further tweak the connection. Here you can specify whether the VPN is to be used over WiFi connections, cellular, or both; disable Google DNS and other options.

    For detailed explanations of each choice, see the [OpenVPN Connect iOS FAQ](https://docs.openvpn.net/docs/openvpn-connect/openvpn-connect-ios-faq.html).

    [![OpenVPN Connect settings.](/docs/assets/openvpn-settings-ios-small.png)](/docs/assets/openvpn-settings-ios.png)

### Linux

{: .note }
>
>The following example was performed using OpenVPN 2.3.2-7ubuntu3.1 and `network-manager-openvpn` 0.9.8.2-1ubuntu4 on Ubuntu 14.04.

#### VPN

Configure VPN connections using the same method you would use to configure wireless or ethernet connections. These steps assume you are using Network Manager for your network management.

1.  Install the package `network-manager-openvpn` or `networkmanager-openvpn`, depending on your distro. This will bring in the necessary dependencies with it, including the package `openvpn`.

2.  Some Linux distributions start services automatically after installation and on reboot (Debian, Ubuntu). If yours does not, start and enable the OpenVPN Service.

    For distros with systemd (CentOS 7, Debian 8, Fedora, Ubuntu 15.10+):

        sudo systemctl enable openvpn*.service && sudo systemctl start openvpn*.service

    For distros with System V or Upstart (CentOS 6, Debian 7, Ubuntu 14.04):

        sudo service openvpn start

3.  This step will assume you transferred the client credentials to your local user's Home folder. As was done on the VPN server, we'll create a `keys` directory to store the client's credentials in, but the `.ovpn` file must be located in `/etc/openvpn`. Create the directory, extract the credentials tarball into it and move the `client.ovpn` file into the necessary folder.

        sudo mkdir /etc/openvpn/keys
        sudo tar -C /etc/openvpn/keys -xzf ~/client1.tar.gz && sudo mv /etc/openvpn/keys/client.ovpn /etc/openvpn

4.  Go to the **System Settings** menu and open the **Network** settings to add a new connection to NetworkManager. In the **Choose a Connection Type** window, select **OpenVPN** from the dropdown.

    ![Choose a Connection Type](/docs/assets/networkmanager-openvpn-connectiontype.png)

    You'll then see the window shown below. **Gateway** must be your Linode's public IPv4 address; multiple IPs can be entered. For each entry under **Authentication**, point NetworkManager to the correct files in `/etc/openvpn/keys`. Then click **Advanced**.

    ![NetworkManager VPN tab](/docs/assets/networkmanager-openvpn-vpn.png)

5.  In the **Security** tab, set the **Cipher** to AES-256-CBC and **HMAC Authentication** to SHA512.  THen choose the **TLS Authentication** tab.

    ![OpenVPN Advanced Options Security tab](/docs/assets/networkmanager-openvpn-vpn-advanced-security.png)

    If you had set the OpenVPN server's Common Name when generating the certificates in part one, it can be used in the **Subject Match** field. Check the box to verify certificate usage signature and make sure the dropdown menu is set to **Server**.

    Check the box for additional TLS authentication. This is the HMAC signature checking from [Part One, Step 1](/docs/networking/vpn/set-up-a-hardened-openvpn-server-on-debian-8#harden-openvpn) of the *Harden OpenVPN* area. Locate your key file and make sure the **Key Direction** is set to **1**. Click **OK** to exit the window.

    ![OpenVPN Advanced Options TLS Authentication tab](/docs/assets/networkmanager-openvpn-vpn-advanced-tlsauthentication.png)

6.  Now that NetworkManager has the credentials, change the `keys` directory's permissions to limit user access on the local machine.

        sudo chmod 700 /etc/openvpn/keys

7.  The VPN client is now configured and ready to connect. How you do this will differ by desktop environment and NetworkManager version, but after configuring the VPN, an entry for it will appear in the desktop environment's network connection menu.

    {: .note }
    >
    >Before first connection, it's a good idea to run `journalctl -f | grep vpn` or `tail -f /var/log/syslog | grep vpn` in a terminal on your client. This gives you a real-time output of OpenVPN's logging so if anything goes wrong or there are any errors or warning messags, they'll be visible here.

#### Static DNS

It is ideal for VPN clients to store their own DNS resolver addresses. This can prevent DNS leaks and allows you more flexibility in choosing DNS addresses (including using [DNSCrypt](https://dnscrypt.org/)) compared to the choices pushed by the VPN server.

1.  From NetworkManager's VPN connection menu, choose the **IPv4 Settings** tab.

2.  From the **Method** dropdown menu, choose **Automatic (VPN) addresses only**.

3.  In the blank for **DNS servers**, add in the resolver IPs you wish to use for the VPN connection. Then click **Save**.

    ![OpenVPN NetworkManager Static DNS](/docs/assets/openvpn-linux-static-dns.png)

### OS X

Apple OS X does not natively support the OpenVPN protocol. [Tunnelblick](https://tunnelblick.net/) is a free and open source application that lets you control OpenVPN connections on OS X and Tunnelblick.com has an excellent [installation guide](https://www.tunnelblick.net/cInstall.html).

![Tunnelblick spash](/docs/assets/1346-tunnelblick2.png)

### Windows

{: .note }
>
>The following example was performed using OpenVPN 2.3.8-I601 on Windows 7 Service Pack 1.

#### VPN

1.  Download and install [OpenVPN's installer](https://openvpn.net/index.php/open-source/downloads.html) using the default settings. Be sure to choose **Install** when prompted about the TAP network adapter.

    ![OpenVPN Windows TAP Installer](/docs/assets/openvpn-windows-tap-installer.png)

    {: .note }
    >
    >OpenVPN provides a GPG signature file to check the installer's integrity and authenticity. [GnuPG](https://gnupg.org/) must be installed to do this and performing the check is highly recommended.

2.  Move the extracted client credentials into `C:\Program Files\OpenVPN\config`.

3.  OpenVPN must be run as an administrator to function properly. There are two ways you can do this:

    **Option 1**

    Right-click on the OpenVPN GUI desktop shortcut and select **Run as administrator**. This must be done each time you to connect to your VPN.

    **Option 2**

    Configure the shortcut to automatically run with admin privileges. *This will apply to all users on the system!* Right-click on the OpenVPN GUI shortcut, select **Properties**. Go to the **Compatibility** tab and select **Change settings for all users**. Select **Run this program as an administrator**, then **OK** to exit the menus.

4.  When you launch the OpenVPN GUI, its icon will appear in the Taskbar. Right-click on it and select **Connect**. The OpenVPN Taskbar icon will turn yellow and a dialog box will appear showing the verbose output of the connection process. When successfully connected, the icon will turn green and show a confirmation.

    ![OpenVPN Windows Taskbar Icon](/docs/assets/openvpn-windows-taskbar-icon.png)

    ![OpenVPN Windows Connected](/docs/assets/openvpn-windows-client-connected.png)

#### Static DNS

It is ideal for VPN clients to store their own DNS resolver addresses. This can prevent DNS leaks and allows you more flexibility in choosing DNS addresses (including using [DNSCrypt](https://dnscrypt.org/)) compared to the choices pushed by the VPN server.

1.  Open the **Control Panel** and go to **Network and Sharing Center**.

2.  At the top right, choose **Change network adapter settings**. This will show you all netowrking adapters on the computer; ethernet, wireless, and the TAP adapter for OpenVPN. Right-click on the **TAP-Windows-Adatper** and select **Properties**.

    ![OpenVPN Windows TAP Adapter](/docs/assets/openvpn-windows-tap-adapter.png)

3.  Uncheck the box for **Internet Protocol Version 6 (TCP/IPv6)**. Select **Internet Protocol Version 4 (TCP/IP)** and then click **Properties**.

    ![OpenVPN Windows TAP Adapter Properties](/docs/assets/openvpn-tap-adapter-properties.png)

4.  Select the radio button for **Use the following DNS server addresses** and fill in the IPs you want.

    ![OpenVPN Windows TAP DNS v4](/docs/assets/openvpn-tap-windows-dns-v4.png)

5.  Choose **Advanced**, then the **WINS** tab. Select the radio button to **Disable NetBIOS over TCP/IP**. Choose **OK**.

    {: .note }
    >
    >Don't do this if you need file access to your VPN through Windows for things like SMB or Active Directory.

    ![OpenVPN Windows TAP NetBIOS](/docs/assets/openvpn-tap-windows-disable-netbios.png)

##  Revoke a VPN Client Certificate

To remove a client device's access to the VPN, SSH into your OpenVPN server and change to a root shell with `sudo su -`.

1.  Change to the `easy-rsa` folder and source `vars`:

        cd /etc/openvpn/easy-rsa/ && source ./vars

2.  Run the `revoke-full` script, substituting **client1** with the name of the client whose certificate you want to revoke:

        ./revoke-full client1

## Connection Testing

1.  With your VPN connection enabled, go to [https://dnsleaktest.com/](https://dnsleaktest.com/) in a web browser from your VPN client. The IP address shown should be that of your Linode's public IPv4 address.

2.  Choose **Extended test**. The resulting IP addresses should be for either: 1) The DNS resolvers you chose in `server.conf`; or 2) The DNS resolvers you chose for your client device (if possible).

    If the client device you're testing is using OpenVPN Connect with Google DNS fallback enabled, you may see Google in the results as well.

3.  To ensure that no IPv6 traffic can be detected, run the test at [http://test-ipv6.com/](http://test-ipv6.com/). Your public IP address should again be that of your Linode VPN, and the results should show that no IPv6 address was detected.

{: .caution}
>
>If the test results show you any IP addresses other than those of your Linode and intended DNS servers, your VPN is not properly tunnenling traffic. Reivew the logs on both server and client to determine how to troubleshoot the connection.
