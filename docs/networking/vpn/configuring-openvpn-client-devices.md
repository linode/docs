---
author:
  name: Chris Walsh
  email: docs@linode.com
description: 'This guide will show you how to install, configure and fine-tune OpenVPN clients on Android, iOS, Linux, OS X and Windows.'
keywords: 'openvpn,vpn,vpn tunnel,ios,os x,mac,windows,android'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 'Thursday, August 17th, 2017'
modified_by:
  name: Linode
published: 'Wednesday, December 9th, 2015'
title: 'Configuring OpenVPN Client Devices'
external_resources:
 - '[Official OpenVPN Documentation](https://openvpn.net/index.php/open-source/documentation/howto.html)'
 - '[Tunnelblick OS X OpenVPN Client](https://www.tunnelblick.net/)'
 - '[OpenVPN GUI for Windows](https://openvpn.net/index.php/open-source/downloads.html)'
 - '[Network Manager GNOME Configuration Management Tool](https://wiki.gnome.org/Projects/NetworkManager)'
---

This guide is the third of a three-part series to set up a hardened OpenVPN environment. Though it's recommended that you first complete parts one and two, [Set up a Hardend OpenVPN Server on Debian](/docs/networking/vpn/set-up-a-hardened-openvpn-server) and [Tunnel Your Internet Traffic Through an OpenVPN Server](/docs/networking/vpn/tunnel-your-internet-traffic-through-an-openvpn-server), this guide can stand on its own as a general tutorial for configuring OpenVPN clients on various operating systems, including mobile.

![Configuring OpenVPN Client Devices](/docs/assets/configuring-openvpn-client-devices.png "Configuring OpenVPN Client Devices")

## Before You Begin

You must already have have the client files ready for transfer to the device. These are listed below. **Each client** will need its own copies. If you still need your client credentials, see the [VPN Certificate Authority](/docs/networking/vpn/set-up-a-hardened-openvpn-server/#vpn-certificate-authority) area of part one of this series.

  *  `client1.key`    # Exclusive to this device.
  *  `client1.cert`   # Exclusive to this device.
  *  `CA.pem`         # Is shared among server and client devices.
  *  `ta.key`         # Is shared among server and client devices.
  *  `client.ovpn`    # Is shared among client devices.


## Transfer Client Credentials

Client credentials must be moved to the client device using an encrypted transfer protocol such as [SCP or SFTP](/docs/tools-reference/linux-system-administration-basics#how-to-upload-files-to-a-remote-server). FTP or telnet should **not** be used because these protocols do not encrypt any traffic. Windows, however, has no native SCP or SFTP support. See [our Filezilla guide](/docs/tools-reference/file-transfer/filezilla) to use it for transferring the VPN credentials. Since you created the credentials on a local computer in part one of this series, you can also transfer them by Bluetooth or USB. Apple OS X can also use iTunes to transfer the files to iOS devices. A Linux computer with the pacage `gvfs-backends` installed can mount the iOS device as external storage.

## Client-Side Configurations

### Android

There are two main options for an Android OpenVPN client. The first is *OpenVPN Connect* on [Google Play](https://play.google.com/store/apps/details?id=net.openvpn.openvpn), the official client from OpenVPN Technologies, Inc., the parent company behind OpenVPN software. The second option is *OpenVPN for Android* on both [Google Play](https://play.google.com/store/apps/details?id=de.blinkt.openvpn) and [F-droid](https://f-droid.org/packages/de.blinkt.openvpn/). OpenVPN for Android is open source, more feature-full and generally updated more often so we'll use it for this guide, though the two clients are similar.

{: .note}
>
>If you have a Linux computer with the package `gvfs-backends` installed, or a Windows computer, you can connect the device by USB and it will be visible in the system's file manager as an external USB device. If you have Apple OS X, you need to first install [Android File Transfer](https://android.com/filetransfer/).

1.  Ensure that your Android device is fully updated, then install OpenVPN for Android from whichever source you prefer. Here we'll use the Google Play Store.

    ![Google Play Store OpenVPN Connect](/docs/assets/google-play-openvpn-connect.png)

2.  Ensure that [Media Transfer Protocol](https://en.wikipedia.org/wiki/Media_Transfer_Protocol) is enabled. In **Settings** > **Storage**, open the **overflow menu** (the three vertical dots) and tap **USB computer connection**; **Media device (MTP)** should be checked. Connect your Android device by USB to your computer and copy over the folder containing the client credentials.

3.  Import the VPN profile from **Menu** > **Import** > **Import Profile from SD card**. Navigate to the profile location, tap it and then tap **SELECT**.

4.  Tap **Connect** to connect to the VPN server, then **OK** at the Connection request prompt for OpenVPN. Shortly after, Android will be connected.

    ![OpenVPN Connect profile imported](/docs/assets/openvpn-connect-android-profiile-imported.png)

    ![OpenVPN Connect profile imported](/docs/assets/openvpn-connect-android-connected.png)

5.  OpenVPN Connect's app settings can be used to further tweak the connection. Here you can specify whether the VPN is to be used over WiFi connections, cellular, or both; disable Google DNS if you want to only receive DNS addresses from the VPN server.

    For detailed explanations of each choice, see the [OpenVPN Connect Android FAQ](https://docs.openvpn.net/docs/openvpn-connect/openvpn-connect-android-faq.html).

    ![OpenVPN Connect Android settings.](/docs/assets/openvpn-settings-android.png)

6.  After the profile is imported and you confirm it works properly, back up the client credential files to external storage and delete the key and certificate files from the device. Once imported, they'll reside in the VPN profile and no longer need to remain on the device storage which is readable by other applications.


### iOS

*OpenVPN Connect* is used to manage OpenVPN connections in Apple's iOS for iPhones and iPads. We'll use iTunes to transfer the file to the iOS device from a computer running OS X or Windows. A Linux computer with the package `gvfs-backends` installed can mount the iOS device as external storage. From there, the file manager can be used.

{: .note }
>
>The following example was performed on iOS 9.0.2 and OS X 10.10 using iTunes 12 and OpenVPN Connect 1.0.5.

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

8.  OpenVPN Connect's app settings can be used to further tweak the connection. Here you can specify whether the VPN is to be used over WiFi connections, cellular, or both; disable Google DNS if you want to only receive DNS addresses from the VPN server.

    For detailed explanations of each choice, see the [OpenVPN Connect iOS FAQ](https://docs.openvpn.net/docs/openvpn-connect/openvpn-connect-ios-faq.html).

    [![OpenVPN Connect settings.](/docs/assets/openvpn-settings-ios-small.png)](/docs/assets/openvpn-settings-ios.png)

9.  After the profile is imported and you confirm it works properly, back up the client credential files to external storage and delete the key and certificate files from the device. Once imported, they'll reside in the VPN profile and no longer need to remain on the device storage which is readable by other applications.


### Linux

{: .note }
>
>The following example was performed using OpenVPN 2.3.2-7ubuntu3.1 and `network-manager-openvpn` 0.9.8.2-1ubuntu4 on Ubuntu 14.04.

These steps assume your distribution uses Network Manager.

1.  Install the package `network-manager-openvpn` or `networkmanager-openvpn`, depending on your distribution. This will bring in the necessary dependencies with it, including the package `openvpn`.

2.  Some Linux distributions start services automatically after installation and on reboot. If yours does not, start and enable the OpenVPN Service.

    For distros with systemd (CentOS 7, Fedora, OpenSUSE):

        sudo systemctl enable openvpn*.service && sudo systemctl start openvpn*.service

    For distros which do not use systemd:

        sudo service openvpn start

3.  Go to the **System Settings** menu and open the **Network** settings to add a new connection to NetworkManager. In the **Choose a Connection Type** window, select **OpenVPN** from the dropdown.

    ![Choose a Connection Type](/docs/assets/networkmanager-openvpn-connectiontype.png)

    You'll then see the window shown below. **Gateway** must be your Linode's public IPv4 address; multiple IPs can be entered. For each entry under **Authentication**, point NetworkManager to the correct files in `/etc/openvpn/keys`. Then click **Advanced**.

    ![NetworkManager VPN tab](/docs/assets/networkmanager-openvpn-vpn.png)

4.  In the **Security** tab, set the **Cipher** to AES-256-CBC and **HMAC Authentication** to SHA512.  THen choose the **TLS Authentication** tab.

    ![OpenVPN Advanced Options Security tab](/docs/assets/networkmanager-openvpn-vpn-advanced-security.png)

    If you had set the OpenVPN server's Common Name when generating the certificates in part one, it can be used in the **Subject Match** field. Check the box to verify certificate usage signature and make sure the dropdown menu is set to **Server**.

    Check the box for additional TLS authentication. This is the HMAC signature checking from [Part One, Step 1](/docs/networking/vpn/set-up-a-hardened-openvpn-server-on-debian-8#harden-openvpn) of the *Harden OpenVPN* area. Locate your key file and make sure the **Key Direction** is set to **1**. Click **OK** to exit the window.

    ![OpenVPN Advanced Options TLS Authentication tab](/docs/assets/networkmanager-openvpn-vpn-advanced-tlsauthentication.png)

5.  The VPN client is now configured and ready to connect. How you do this will differ by desktop environment and NetworkManager version, but after configuring the VPN, an entry for it will appear in the desktop environment's network connection menu.

    {: .note }
    >
    >Before first connection, it's a good idea to run `journalctl -f | grep vpn` or `tail -f /var/log/syslog | grep vpn` in a terminal on your client. This gives you a real-time output of OpenVPN's logging so if anything goes wrong or there are any errors or warning messags, they'll be visible here.

6.  After the profile is imported and you confirm it works properly, back up the client credential files to external storage and delete the key and certificate files from the device. Once imported, they'll reside in the VPN profile and no longer need to remain on the device storage which is readable by other applications.

### OS X

Apple OS X does not natively support the OpenVPN protocol. [Tunnelblick](https://tunnelblick.net/) is a free and open source application that lets you control OpenVPN connections on OS X and Tunnelblick.com has an excellent [installation guide](https://www.tunnelblick.net/cInstall.html).

![Tunnelblick spash](/docs/assets/1346-tunnelblick2.png)

Back up the client credential files to external storage. After the profile is imported and you confirm it works properly, delete the key and certificate files from the device. Once imported, they'll reside in the VPN profile and no longer need to remain on the device storage which is readable by other applications.

### Windows

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

5.  After the profile is imported and you confirm it works properly, back up the client credential files to external storage and delete the key and certificate files from the device. Once imported, they'll reside in the VPN profile and no longer need to remain on the device storage which is readable by other applications.


##  Revoke a VPN Client Certificate

To remove a client device's access to the VPN, go back to the EasyRSA root directory. The folder `~/ca` was used in the [VPN Certificate Authority](/docs/networking/vpn/set-up-a-hardened-openvpn-server/#vpn-certificate-authority) section of part one of this series.

1.  Change to the `easy-rsa` folder and source `vars`:

        cd ~/ca && source ./vars

2.  Run the `revoke-full` script, substituting **client1** with the name of the client whose certificate you want to revoke:

        ./revoke-full client1

## Connection Testing

1.  With your VPN connection enabled, go to [https://dnsleaktest.com/](https://dnsleaktest.com/) in a web browser from your VPN client. The IP address shown should be that of your Linode's public IPv4 address.

2.  Choose **Extended test**. The resulting IP addresses should be for either: 1) The DNS resolvers you chose in `server.conf`; or 2) The DNS resolvers you chose for your client device (if possible).

    If the client device you're testing is using OpenVPN Connect with Google DNS fallback enabled, you may see Google in the results as well.

3.  To ensure that no IPv6 traffic can be detected, run the test at [http://test-ipv6.com/](http://test-ipv6.com/). Your public IP address should again be that of your Linode VPN, and the results should show that no IPv6 address was detected.

{: .caution}
>
>If the test results show you any IP addresses other than those of your Linode and intended DNS servers, your VPN is not properly tunneling traffic. Review the logs on both server and client to determine how to troubleshoot the connection.