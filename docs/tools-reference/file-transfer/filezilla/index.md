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

FileZilla is a free, open source file transfer program written for Linux, Mac OS X, and Windows systems. It implements several file transfer protocols, most notably SFTP via SSH. This tool allows you to securely transfer files to and from your Linode using an encrypted channel, avoiding the security problems and usability issues inherent in traditional FTP client/server systems. FileZilla can send both your login credentials and file transfers over the network securely encrypted (provided you're using SFTP), while standard FTP clients send this information as plaintext.

![Transfer Files with FileZilla](transfer-files-with-filezilla.png "Transfer Files with FileZilla")

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

{{< content "filezilla-shortguide" >}}

### If You Use Public Key Authentication

If you have followed our [Securing Your Server](/docs/security/securing-your-server) guide, you won't be able to connect to your Linode using a password. If you are using Linux or OS X, the keys that you generated while following that guide will be automatically used for authentication.

{{< note >}}
If you are using OS X, the passphrase for your key will need to be stored in your keychain in order to successfully connect via SSH key. FileZilla will not be able to use a key that was generated without a passphrase to connect to your Linode.
{{< /note >}}

If you are using Windows, you'll need to follow a few additional steps to enable key based authentication. The instructions below assume that you have already completed the guide for [generating your SSH key with Putty](/docs/security/use-public-key-authentication-with-ssh#windows-operating-system).

1.  Install Pageant from the [Putty site](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html)

2.  Start Pagent from your Start menu. In your system tray, you'll see the Pageant icon appear.

3.  Right-click the icon and select `Add Key`.

4.  Navigate to the location where you stored your keys and select your private key (PPK) file. You will be prompted for your passphrase if you provided one when creating the key.

5.  Launch FileZilla and connect to your server with your username and an empty password.  Your key will be used as authentication as long as the Pagent software is running.
