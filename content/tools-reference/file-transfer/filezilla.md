---
author:
  name: Linode
  email: docs@linode.com
description: 'Securely copying files to and from your Linode with FileZilla, a free and open source file transfer client for Linux, OS X, and Windows systems.'
keywords: ["filezilla", "ftp", "linux scp", "sftp", "linux sftp program", "linux ftp"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['networking/file-transfer/transfer-files-filezilla/']
modified: 2014-10-13
modified_by:
  name: James Stewart
published: 2014-10-13
title: 'Transfer Files with FileZilla'
external_resources:
 - '[FileZilla Documentation](http://wiki.filezilla-project.org/Documentation)'
 - '[FileZilla SSH Key Documentation](https://wiki.filezilla-project.org/Howto#SFTP_using_SSH2:_Key_based_authentication)'
 - '[Tools & Reference](/docs/tools-reference/)'
---

FileZilla is a free, open source file transfer program written for Linux, MacOS X, and Windows systems. It implements several file transfer protocols, most notably SFTP via SSH. This tool allows you to securely transfer files to and from your Linode using an encrypted channel, avoiding the security problems and usability issues inherent in traditional FTP client/server systems. FileZilla can send both your login credentials and file transfers over the network securely encrypted (provided you're using SFTP), while standard FTP clients send this information as plaintext.

![Transfer Files with FileZilla](/docs/assets/transfer-files-with-filezilla.png "Transfer Files with FileZilla")

## Prerequisites

Prior to following this guide, you will need to ensure that the following steps have been taken on your Linode.

-  Created a user as per the instructions in our [securing your server](/docs/security/securing-your-server/) guide.

-  Ensure that you can connect to your Linode [via SSH](/docs/getting-started#connect-to-your-linode-via-ssh).

-  This guide is written for a non-root user. Commands that require elevated privileges are prefixed with ``sudo``. If you're not familiar with the ``sudo`` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

{{< note >}}
If you wish, you may use the `root` account on your Linode to perform file transfers, although you may need to change [file ownership and permissions](/docs/tools-reference/linux-users-and-groups) on the server after doing so.
{{< /note >}}

## Installing FileZilla

Windows and OS X users can download FileZilla [here](https://filezilla-project.org/download.php?show_all=1).

Linux users can run the following commands to install FileZilla.

Debian/Ubuntu:

    sudo apt-get install filezilla

CentOS/Fedora

    sudo yum install filezilla

## Using FileZilla

1.  Open FileZilla from your Windows start menu, OS X Launchpad, or the launcher provided by your Linux distribution of choice.

2.  Enter your Linode's IP address or domain name in the "Host" field. Enter the account username you wish to connect as in the "Username" field. Please note that this must be a user account on your Linode; if in doubt, enter "root" to log in as the root user. Enter the account's password in the "Password" field, and enter "22" in the "Port" field. Click "Quickconnect" to initiate the file transfer session.

    [![Quickconnect](/docs/assets/filezilla-quick-connect-resized.png)](/docs/assets/filezilla-quick-connect.png)

3.  If this is the first time you've connected to your Linode with an SSH or SFTP program, you'll receive a warning that the host key is unknown. Place a check mark in the box next to "Always trust this host, add this key to the cache." Checking this box prevents further warnings unless the key presented to FileZilla changes; this should only happen if you reinstall the remote server's operating system.

    [![Unknown Key](/docs/assets/filezilla-unknown-key.png)](/docs/assets/filezilla-unknown-key.png)

4.  Click the "OK" button to proceed. You'll be presented with a split view, with your local filesystem on the left and your Linode's filesystem on the right. You may transfer files by dragging and dropping them between each side.


If you have followed our [Securing Your Server](/docs/security/securing-your-server) guide, you won't be able to connect to your Linode using a password. If you are using Linux or OS X, the keys that you generated while following that guide will be automatically used for authentication.

{{< note >}}
If you are using OS X, the passphrase for your key will need to be stored in your keychain in order to successfully connect via SSH key. FileZilla will not be able to use a key that was generated without a passphrase to connect to your Linode.
{{< /note >}}

If you are using Windows, you'll need to follow a few additional steps to enable key based authentication. The instructions below assume that you have already completed the guide for [generating your SSH key with Putty](/docs/security/use-public-key-authentication-with-ssh#windows-operating-system).

1.  Install Pageant from the [Putty site](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html)

2.  Start Pagent from your Start menu. In your system tray, you'll see the Pageant icon appear.

3.  Right-click the icon and select "Add Key".

4.  Navigate to the location where you stored your keys and select your private key (PPK) file. You will be prompted for your passphrase if you provided one when creating the key.

5.  Launch FileZilla and connect to your server with your username and an empty password.  Your key will be used as authentication as long as the Pagent software is running.
