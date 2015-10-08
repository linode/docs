---
author:
  name: Linode
  email: docs@linode.com
description: 'Configuring client software to connect to an OpenVPN server.'
keywords: 'openvpn,vpn,debian,ubuntu,security,ios,os x,osx,mac,mobile,windows,android'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: 'Thursday, September 3, 2015'
modified_by:
  name: Linode
published: 'Thursday, September 3, 2015'
title: 'Configuring OpenVPN Client Devices'
external_resources:
 - '[Official OpenVPN Documentation](https://openvpn.net/index.php/open-source/documentation/howto.html)'
 - '[Tunnelblick OS X OpenVPN Client](http://code.google.com/p/tunnelblick/)'
 - '[OpenVPN GUI for Windows](https://tunnelblick.net/)'
 - '[Network Manager GNOME Configuration Management Tool](https://wiki.gnome.org/Projects/NetworkManager)'
---

This guide is the third of a three part series to set up a hardened OpenVPN environment. Though it's recommended that you have first completed parts one and two of the series, [Set up a Hardend OpenVPN Server on Debian 8](/docs/networking/vpn/set-up-a-hardened-openvpn-server-on-debian-8) and [Set Up a VPN Tunnel with Debian 8](/docs/networking/vpn/***), this guide can stand on its own as a general tutorial for configuring OpenVPN clients on various operating systems, including mobile.

## Before you Begin

You must already have have the client files on your OpenVPN server. These are:

*  The root certificate (CA): `ca.crt`.
*  Client certificate: `client1.crt`.
*  Client key: `client1.key`.
*  HMAC secret key: `ta.key`.
*  Client configuration file: `client.ovpn`.

In Part One of this series, they were packaged into a tarball located at `/etc/openvpn/client1.tar.gz`. **Each client** will need its own credential archive with its own unique key. If you still need your client credentials, see [Part One, step 7](/docs/networking/vpn/set-up-a-hardened-openvpn-server-on-debian-8#client-configuration-file) of the client configuration area.

## Transfer Client Credentials

The credentials must be moved to the client device using an encrypted transfer protocol like [SCP or SFTP](/docs/tools-reference/linux-system-administration-basics#how-to-upload-files-to-a-remote-server). FTP or telnet should **not** be used because these protocols do not encrypt any traffic.

### Android / iOS

There are many apps in both platform's app stores for SCP and SFTP support. If you don't already have one and don't want to install new software or take the time to find something you prefer, the best option is to transfer the VPN client files to a desktop computer, and then import them into Android or iOS over a USB connection.

The import process is explained further down this page under *Installing Client-Side Software* for [Android](#android) and [iOS](#ios).

### Linux / OS X

Linux and OS X can use SCP natively from the command line. To download your client's tarball to your local user's Home directory using SCP:

    scp server's_user_name@server_ip_address:/etc/openvpn/client1.tar.gz ~/

### Windows

Windows has no native SCP or SFTP support. See [our Filezilla guide](/docs/tools-reference/file-transfer/filezilla) to use it for transferring the files.

## Installing Client-Side Software

### Android

Android uses OpenVPN Connect to manage OpenVPN connections. If you have a Linux computer with the package `gvfs-backends` installed, or a Windows computer, you can connect the device by USB and it will be seen as an external USB device. If you have Apple OS X, you need to first install [Android File Transfer](https://android.com/filetransfer/).

{: .note }
>
>This example walkthrough was done with Android 5.1.1 and OpenVPN Connect 1.0.5.

1.  Ensure that your Android device is fully updated and install [OpenVPN Connect](https://play.google.com/store/apps/details?id=net.openvpn.openvpn) from the Google Play Store.

    ![Google Play Store OpenVPN Connect](/docs/assets/google-play-openvpn-connect.png)

2.  Ensure that [Media Transfer Protocol](https://en.wikipedia.org/wiki/Media_Transfer_Protocol) is enabled. In **Settings** > **Storage** > **overflow menu** > **USB computer connection**, **Media device (MTP)** should be checked. Connect your Android device by USB to your computer.

3.  **Menu** > **Import** > **Import Profile from SD card**. Navigate to the profile location, tap it and then tap **SELECT**.

    ![OpenVPN Connect profile imported](/docs/assets/openvpn-connect-android-profiile-imported.png)

4.  Tap **Connect** to connect to the VPN server, and **OK** at the Connection request prompt for OpenVPN. Shortly after, Android will be connected.

    ![OpenVPN Connect profile imported](/docs/assets/openvpn-connect-android-connected.png)

5.  OpenVPN Connect's app settings can be used to further tweak the connection. Here you can specify whether the VPN is to be used over WiFi connections, cellular or both, disable Google DNS and other options.

    For detailed explanations of each choice, see the [OpenVPN Connect Android FAQ](https://docs.openvpn.net/docs/openvpn-connect/openvpn-connect-android-faq.html).

    ![OpenVPN Connect Android settings.](/docs/assets/openvpn-settings-android.png)



### IaaS (Linode)

There are situations where you could want to access your Linode's OpenVPN server from another Linode or server.

1.  

2.  

### iOS

Apple's iOS for iPhones and iPads uses OpenVPN Connect to manage OpenVPN connections. We'll use iTunes to transfer the file to the iOS device from a computer running OS X or Windows. A Linux computer with the pacage `gvfs-backends` installed can mount the iOS device as external storage. From there, the file manager can be used.

{: .note }
>
>This example walkthrough was done with iOS 9.0.2, OS X 10.10, iTunes 12 and OpenVPN Connect 1.0.5.

1.  Ensure that your iOS device is fully updated and install [OpenVPN Connect](https://itunes.apple.com/us/app/openvpn-connect/id590379981) from the App store.

    ![iTunes App Store OpenVPN Connect](/docs/assets/itunes-appstore-openvpn-connect.png)

2.  Connect your iOS device by USB to your computer running OS X or Windows, and open iTunes.

3.  Select the icon for iPad or iPhone near the top-left of the menu bar.

    [![iTunes device summary](/docs/assets/itunes-device-summary-small.png)](/docs/assets/itunes-device-summary.png)

    {: .note}
    >
    >If this is the first time connecting your iOS device to iTunes, you'll need to click the overflow menu (the three vertical dots) and choose **Apps**, then click **Get Started**.

4.  In the left sidebar, choose **Apps** and scroll down to the **File Sharing** category in the main window. You will see the icon for OpenVPN Connect. Click it, then click **Add** in the **OpenVPN Documents** box. Navigate to your `ta.key` file and `.opvn` client profile. **Add them in that order**. Otherwise, OpenVPN Connect on the iOS device will say it can't find the key.

    [![iTunes File Sharing](/docs/assets/itunes-file-sharing-small.png)](/docs/assets/itunes-file-sharing.png)

5.  After you've added the profile to iTunes on your computer, go back to the iOS device and open the OpenVPN Connect app. You'll see an area saying that a new OpenVPN profile is available for import. Tap it to highlight the profile, then tap the green button to add it.

    [![OpenVPN Connect import profile](/docs/assets/openvpn-connect-itunes-import-profile-small.png)](/docs/assets/openvpn-connect-itunes-import-profile.png)

6.  In the next screen, tap the **Connection** slider to start the connection.

    [![OpenVPN Connect connection status](/docs/assets/openvpn-connect-status-small.png)](/docs/assets/openvpn-connect-status.png)

7.  You'll see a notification prompt asking to allow OpenVPN to enable the connection. Choose **Yes**. Shortly after, iOS will be connected.

    [![OpenVPN Connect, connected.](/docs/assets/openvpn-ios-connected-small.png)](/docs/assets/openvpn-ios-connected.png)

8.  OpenVPN Connect's app settings can be used to further tweak the connection. Here you can specify whether the VPN is to be used over WiFi connections, cellular or both, disable Google DNS, force UDP protocol to be used and other ***.

    For detailed explanations of each choice, see the [OpenVPN Connect iOS FAQ](https://docs.openvpn.net/docs/openvpn-connect/openvpn-connect-ios-faq.html).

    [![OpenVPN Connect settings.](/docs/assets/openvpn-settings-ios-small.png)](/docs/assets/openvpn-settings-ios.png)

### Linux

Most network management tools provide some facility for managing connections to a VPN. Configure connections to your OpenVPN through the same interface where you might configure wireless or ethernet connections. These steps will assume using Network Manager to configure VPN connections.

1.  Install the package `network-manager-openvpn` or `networkmanager-openvpn`, depending on your distro. This will bring in the necessary dependencies with it, including the package `openvpn`.

        sudo apt-get install network-manager-openvpn

2.  Some Linux distributions start services automatically after installation (Debian, Ubuntu) but if yours does not, start and enable the OpenVPN Service.

    For distros with systemd:

        sudo systemctl openvpn enable && sudo systemctl openvpn start

    For distros with SystemV or Upstart:

        sudo service openvpn start

3. As was done on the VPN server, we'll create a `keys` directory to store the client's credentials in but the `.ovpn` file must be located in `/etc/openvpn`. Create the directory, extract the credentials tarball into it and move the `client.ovpn` file into the necessary folder.

        sudo mkdir /etc/openvpn/keys
        sudo tar -xzf /path/to/client1.tar.gz /etc/openvpn/keys && sudo mv /etc/openvpn/keys/client.ovpn /etc/openvpn

      {: .caution }
      >
      >Remember that anyone with access to your `client.key` file can connect to your VPN. If you are***.

4.  Configure NetworkManager

    In the **Choose a Connection Type** window, select **OpenVPN** from the dropdown.

    ![Choose a Connection Type](/docs/assets/networkmanager-openvpn-connectiontype.png)

    You'll then see the window shown below. **Gateway** must be your Linode's public IPv4 address; multiple IPs can be entered. For each entry under **Authentication**, point NetworkManager to the correct files in `/etc/openvpn/keys`. Then click **Advanced**.

    ![NetworkManager VPN tab](/docs/assets/networkmanager-openvpn-vpn.png)

5.  In the **Advanced Options** window, check the box for **Use LZO data compression**, then choose the **Security** tab. Set the **Cipher** to AES-256-CBC and **HMAC Authentication** to SHA512. Choose the *TLS Authentication* tab.

    ![OpenVPN Advanced Options Security tab](/docs/assets/networkmanager-openvpn-vpn-advanced-security.png)

    In Part One of this series we set the OpenVPN server's Common Name so it can be used in the **Subject Match** field here. Check the box to verify certificate usage signature and make sure the dropdown menu is set to **Server**.

    Check the box for additional TLS authentication--this is the HMAC signature checking from [Part One, step 1](/docs/networking/vpn/set-up-a-hardened-openvpn-server-on-debian-8#harden-openvpn) of the *Harden OpenVPN* area. Locate your key file and make sure the **Key Direction** is set to **1**. Click **OK** to exit the window.

    ![OpenVPN Advanced Options TLS Authentication tab](/docs/assets/networkmanager-openvpn-vpn-advanced-tlsauthentication.png)

6. The VPN client is now configured and ready to connect. How you do this will differ by desktop environment and NetworkManager version, but after configuring the VPN, an entry for it will appear in the network connection menu.

    {: .note }
    >
    >Before first connection, it's a good idea to run `journalctl -f | grep vpn` or `tail -f /var/log/syslog | grep vpn` in a terminal on your client so you have a real-time output of OpenVPN's logging. If anything goes wrong or there are any errors or warning messags, they'll be visible here.


### OS X

Apple OS X does not natively support the OpenVPN protocol and there is no community project to release pre-built OpenVPN binaries; to use OpenVPN on OS X you must compile from source.

Instead, [Tunnelblick](https://tunnelblick.net/) is a free and open source application that lets you control OpenVPN connections on OS X. Tey have an excellent installation guide [here](https://www.tunnelblick.net/cInstall.html).

{: .note }
>
>Tunnelblick will ask if you want to convert your OpenVPN configuration file to a Tunnelblick configuration file. Choose **Convert Configurations** to let it.

### Windows

1.  Download an run the OpenVPN [Windows installer](https://openvpn.net/index.php/open-source/downloads.html).

2.  Drop the client files which were copied over from the server into:

        C:\Program Files\OpenVPN\config

3.  Run OpenVPN as an administrator to connect.

##  Revoking a Client Certificate

To remove a user's access to the VPN server:

SSH into your OpenVPN server and change to the root user with `sudo su`.

1.  Run the `vars` script.

        cd /etc/openvpn/easy-rsa/
        source ./vars

2.  Run the `revoke-full` script, substituting **client1** with the name of the client whose certificate you want to revoke:

        ./revoke-full client1

## Connection Testing

Accessing your Linode over the VPN

To test your connection, connect to the VPN connection from your local machine, then access one of the many [websites that will display your public IP address](http://www.whatismyip.com/). If the IP address displayed doesn't match the IP address of your Linode, your traffic is not being filtered through your Linode or encrypted by the VPN. If the IP matches, network traffic from your local machine is being filtered through your Linode and encrypted over the VPN, and you have successfully completed your OpenVPN setup!