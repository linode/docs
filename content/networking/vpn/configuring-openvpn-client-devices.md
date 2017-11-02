---
author:
  name: Chris Walsh
  email: docs@linode.com
description: 'This guide will show you how to install, configure, and fine-tune OpenVPN clients on Android, iOS, Linux, OS X and Windows.'
keywords: ["openvpn", "vpn", "vpn tunnel", "ios", "os x", "mac", "windows", "android"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-09-26
modified_by:
  name: Linode
published: 2015-12-09
title: 'Configure OpenVPN Client Devices'
external_resources:
 - '[Official OpenVPN Documentation](https://openvpn.net/index.php/open-source/documentation/howto.html)'
 - '[Tunnelblick OS X OpenVPN Client](https://www.tunnelblick.net/)'
 - '[OpenVPN GUI for Windows](https://openvpn.net/index.php/open-source/downloads.html)'
 - '[Network Manager GNOME Configuration Management Tool](https://wiki.gnome.org/Projects/NetworkManager)'
---

This guide is the third of a three-part series on setting up a hardened OpenVPN environment. Though it's recommended that you first complete parts one and two, [Set up a Hardened OpenVPN Server on Debian](/docs/networking/vpn/set-up-a-hardened-openvpn-server) and [Tunnel Your Internet Traffic Through an OpenVPN Server](/docs/networking/vpn/tunnel-your-internet-traffic-through-an-openvpn-server), this guide can stand on its own as a general tutorial for configuring OpenVPN clients on various operating systems, including mobile.

![Configuring OpenVPN Client Devices](/docs/assets/configuring-openvpn-client-devices.png "Configuring OpenVPN Client Devices")

## Before You Begin

You must already have the client files ready to transfer to the device. These are listed below. **Each client** will need its own copies. If you need client credentials, see the [VPN Certificate Authority](/docs/networking/vpn/set-up-a-hardened-openvpn-server/#vpn-certificate-authority) area of part one of in series.

  *  `client1.key`    # Exclusive to this device.
  *  `client1.cert`   # Exclusive to this device.
  *  `CA.pem`         # Is shared among server and client devices.
  *  `ta.key`         # Is shared among server and client devices.
  *  `client.ovpn`    # Is shared among client devices.


## Transfer Client Credentials
Client credentials must be moved to the client device using an encrypted transfer protocol, like [SCP or SFTP](/docs/tools-reference/linux-system-administration-basics#how-to-upload-files-to-a-remote-server). FTP or telnet should **not** be used because these protocols do not encrypt traffic. Windows, has no native SCP or SFTP support. See [our Filezilla guide](/docs/tools-reference/file-transfer/filezilla) if you are using Windows for transferring the VPN credentials. Since you created the credentials on a local computer in part one of this series, you can also transfer them by Bluetooth or USB. Apple OS X can also use iTunes to transfer the files to iOS devices. A Linux computer with the package `gvfs-backends` installed can mount the iOS device as external storage.

## Client-Side Configurations

### Android

There are two main options for an Android OpenVPN client. The first is *OpenVPN Connect* on [Google Play](https://play.google.com/store/apps/details?id=net.openvpn.openvpn), the official client from OpenVPN Technologies, Inc., the parent company behind OpenVPN software. The second option is *OpenVPN for Android* on both [Google Play](https://play.google.com/store/apps/details?id=de.blinkt.openvpn) and [F-droid](https://f-droid.org/packages/de.blinkt.openvpn/). OpenVPN for Android is open source, more feature-rich, and usually updated more often so we'll use it for this guide, though the two clients are similar.

{{< note >}}
If you have a Linux computer with the package `gvfs-backends` installed, or a Windows computer, you can connect the device by USB and it will be visible in the system's file manager as an external USB device. If you have Apple OS X, you need to first install [Android File Transfer](https://android.com/filetransfer/).
{{< /note >}}

1.  Ensure that your Android device is fully updated, then install OpenVPN for Android from whichever source you prefer.

    ![Google Play Store OpenVPN for Android](/docs/assets/google-play-openvpn-for-android.png)

2.  Connect your Android device by USB to your computer. From the USB settings notification, put the device into file transfer mode. See [here](https://support.google.com/nexus/answer/2840804) for more information. Copy over the folder containing the VPN client credentials. You can put it into the `/../Internal storage/` directory.

3.  Disconnect the device from USB and launch OpenVPN for Android. To import the VPN profile, tap the Import icon at the top right.

    ![OpenVPN for Android import profile](/docs/assets/openvpn-for-android-import-profile.png)

    You'll then be shown the file browser. Navigate to the folder you copied to the device in the previous step and tap the `client.ovpn` file to import it as a VPN profile.

    ![OpenVPN for Android file browser](/docs/assets/openvpn-for-android-file-browser.png)

4.  At the *Convert Config File* screen, verify the certificate and key file names are correct. Then tap the check mark at the top right of the screen to complete the process.

    ![OpenVPN for Android profile imported](/docs/assets/openvpn-for-android-imported.png)

5.  To connect to the VPN server, tap the profile you just created and confirm the connection request. The log screen will show the connection status and shortly after, Android will be connected.

    ![OpenVPN for Android](/docs/assets/openvpn-for-android-profile.png)

    ![OpenVPN for Android](/docs/assets/openvpn-for-android-connection-request.png)

    ![OpenVPN for Android](/docs/assets/openvpn-for-android-log.png)

    You can customize the profile further in the app's settings tab.

6.  After the profile is imported and you confirm it works properly, back up the client credential files to external storage and delete the key and certificate files from the device. Once imported, they'll reside in the VPN profile and no longer need to remain on the device storage.


### iOS

*OpenVPN Connect* is used to manage OpenVPN connections in Apple's iOS for iPhones and iPads. We'll use iTunes to transfer the file to the iOS device from a computer running OS X or Windows. A Linux computer with the package `gvfs-backends` installed can mount the iOS device as external storage.

{{< note >}}
The following example was performed on iOS 9.0.2 and OS X 10.10 using iTunes 12 and OpenVPN Connect 1.0.5.
{{< /note >}}

1.  Ensure that your iOS device is fully updated, then install [OpenVPN Connect](https://itunes.apple.com/us/app/openvpn-connect/id590379981) from the App store.

    ![iTunes App Store OpenVPN Connect](/docs/assets/itunes-appstore-openvpn-connect.png)

2.  Connect your iOS device by USB to your computer running OS X or Windows. Open iTunes.

3.  Select the icon for iPad or iPhone near the top-left of the menu bar.

    [![iTunes device summary](/docs/assets/itunes-device-summary-small.png)](/docs/assets/itunes-device-summary.png)

    {{< note >}}
If this is the first time connecting your iOS device to iTunes, you'll need to click on the overflow menu (the three horizontal dots) and choose **Apps**, then click **Get Started**.
{{< /note >}}

4.  In the left sidebar, choose **Apps** and scroll down to the **File Sharing** category in the main window. You will see the icon for OpenVPN Connect. Click it, then click **Add** in the **OpenVPN Documents** box. Navigate to your `ta.key` file and `.opvn` client profile and drag them into the window from Finder. If you add them individually, add the key before the client profile. Otherwise, OpenVPN Connect will fail to find the key.

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

9.  After the profile is imported and you confirm it works properly, back up the client credential files to external storage and delete the key and certificate files from the device. Once imported, they'll reside in the VPN profile and no longer need to remain on your client's internal storage, which is readable by other applications.


### Linux

These steps assume your distribution uses NetworkManager. Depending on the NetworkManager version your distribution packages, the windows and prompts may look slightly different than the screenshots below.

1.  Be sure you have the package `network-manager-openvpn` or `networkmanager-openvpn` installed, depending on your distribution. This will bring in the necessary dependencies with it, including the `openvpn` package.

2.  Some Linux distributions start services automatically after installation and on reboot. If yours does not, start and enable the OpenVPN Service.

    For distros with systemd (CentOS 7, Fedora, OpenSUSE):

        sudo systemctl enable openvpn*.service && sudo systemctl start openvpn*.service

    For distros which do not use systemd:

        sudo service openvpn start

3.  Go to the **System Settings** menu and open the **Network** settings to add a new connection to NetworkManager. In the network connections window, select the plus sign at the bottom of the window to add a new connection.

    ![NetworkManager OpenVPN](/docs/assets/networkmanager-openvpn-new-connection.png)

4.  You'll then see the window shown below. Choose **VPN**, and then **Import from file**.

    ![NetworkManager OpenVPN](/docs/assets/networkmanager-openvpn-vpn.png)

    ![NetworkManager OpenVPN](/docs/assets/networkmanager-openvpn-vpn-import-ovpn.png)

5.  The file browser will then open. Navigate to the computer's `client.ovpn` file and click *Open* to import it.

6.  At the **Add Network Connection** window, select IPv6 in the left column. Switch IPv6 from **On**, to **Off**. Then click **Add**.

    ![NetworkManager OpenVPN](/docs/assets/networkmanager-openvpn-imported.png)

7.  The VPN client is now configured and ready to connect. How you do this will differ by desktop environment and NetworkManager version, but after configuring the VPN, an entry for it will appear in the desktop environment's network connection menu.

    {{< note >}}
Before connecting for the first time, it's a good idea to run `journalctl -f | grep vpn` or `tail -f /var/log/syslog | grep vpn` in a terminal on your client. The command gives you a real-time output of OpenVPN's logging, all errors will be visible here.
{{< /note >}}

8.  After the profile is imported, and you confirm it works properly, back up the client credential files to external storage and delete the key and certificate files from the device. Once imported, they'll reside in the VPN profile and no longer need to remain on the device storage which is readable by other applications.


### OS X

Apple OS X doesn't support the OpenVPN protocol natively. [Tunnelblick](https://tunnelblick.net/) is a free and open source application that lets you control OpenVPN connections on OS X and Tunnelblick.com has an excellent [installation guide](https://www.tunnelblick.net/cInstall.html).

![Tunnelblick spash](/docs/assets/1346-tunnelblick2.png)

Back up the client credential files to external storage. After the profile is imported and you confirm it works properly, delete the key and certificate files from the device. Once imported, they'll reside in the VPN profile and no longer need to remain on the device storage.

### Windows

1.  Download and install [OpenVPN's installer](https://openvpn.net/index.php/open-source/downloads.html) using the default settings. Be sure to choose **Install** when prompted about the TAP network adapter.

    ![OpenVPN Windows TAP Installer](/docs/assets/openvpn-windows-tap-installer.png)

    {{< note >}}
OpenVPN provides a GPG signature file to check the installer's integrity and authenticity. [GnuPG](https://gnupg.org/) must be installed to do this and performing the check is highly recommended.
{{< /note >}}

2.  Move the extracted client credentials into `C:\Program Files\OpenVPN\config`.

3.  OpenVPN must be run as an administrator to function properly. There are two ways you can do this:

    **Option 1**

    Right-click on the OpenVPN desktop shortcut and select **Run as administrator**. This must be done each time you to connect to your VPN.

    **Option 2**

    Configure the shortcut to run with admin privileges automatically. *This will apply to all users on the system!* Right-click on the OpenVPN GUI shortcut, select **Properties**. Go to the **Compatibility** tab and select **Change settings for all users**. Select **Run this program as an administrator**, then **OK** to exit the menus.

4.  When you launch the OpenVPN application, its icon will appear in the taskbar. Right-click on it and select **Connect**. The OpenVPN taskbar icon will turn yellow and a dialog box will appear showing the verbose output of the connection process. When you successfully connect, the icon will turn green and show a confirmation.

    ![OpenVPN Windows Taskbar Icon](/docs/assets/openvpn-windows-taskbar-icon.png)

    ![OpenVPN Windows Connected](/docs/assets/openvpn-windows-client-connected.png)

5.  After the profile is imported and you confirm it works properly, back up the client credential files to external storage and delete the key and certificate files from the device. Once imported, they'll reside in the VPN profile and no longer need to remain on the device storage.


##  Revoke a VPN Client Certificate

To remove a client device's access to the VPN, go back to the EasyRSA root directory. The folder `~/ca` was used in the [VPN Certificate Authority](/docs/networking/vpn/set-up-a-hardened-openvpn-server/#vpn-certificate-authority) section of part one of this series.

1.  Change to the `easy-rsa` folder and source `vars`:

        cd ~/ca && source ./vars

2.  Run the `revoke-full` script, substituting **client1** with the name of the client whose certificate you want to revoke:

        ./revoke-full client1

## Connection Testing

1.  With your VPN connection enabled, go to [https://dnsleaktest.com/](https://dnsleaktest.com/) in a web browser from your VPN client. The IP address shown should be that of your Linode's public IPv4 address.

2.  Choose **Extended test**. The resulting IP addresses should be for either: The DNS resolvers you chose in `server.conf`, or The DNS resolvers you chose for your client device (if applicable).

    If the client device you're testing is using OpenVPN Connect with Google DNS fallback enabled, you may see Google in the results as well.

3.  To ensure that no IPv6 traffic can be detected, run the test at [http://test-ipv6.com/](http://test-ipv6.com/). Your public IP address should again be that of your Linode VPN, and the results should show that no IPv6 address was detected.

{{< caution >}}
If the test results show you any IP addresses other than those of your Linode and intended DNS servers, your VPN is not properly tunneling traffic. Review the logs on both server and client to determine how to troubleshoot the connection.
{{< /caution >}}
