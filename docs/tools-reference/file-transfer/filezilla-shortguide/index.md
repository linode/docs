---
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide which shows how to use FileZilla after it has been installed.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: []
aliases: ['networking/file-transfer/transfer-files-filezilla/']
modified: 2018-08-14
modified_by:
  name: Linode
published: 2018-08-14
title: 'Transfer Files with FileZilla'
headless: true
---

1.  Open FileZilla from your Windows start menu, OS X Launchpad, or the launcher provided by your Linux distribution of choice.

1.  Enter your Linode's IP address or domain name in the `Host` field. Enter the account username you wish to connect as in the `Username` field. Please note that this must be a user account on your Linode; if in doubt, enter `root` to log in as the root user. Enter the account's password in the `Password` field, and enter "22" in the `Port` field. Click **Quickconnect** to initiate the file transfer session.

    {{< image src="filezilla-quick-connect.png" alt="Quickconnect" title="FileZilla Quickconnect screenshot" >}}

1.  If this is the first time you've connected to your Linode with an SSH or SFTP program, you'll receive a warning that the host key is unknown. Place a check mark in the box next to `Always trust this host, add this key to the cache`. Checking this box prevents further warnings unless the key presented to FileZilla changes; this should only happen if you reinstall the remote server's operating system.

    {{< image src="filezilla-unknown-key.png" alt="Unknown Key" title="FileZilla Unknown Key warning" >}}

1.  Click the **OK** button to proceed. You'll be presented with a split view, with your local filesystem on the left and your Linode's filesystem on the right. You may transfer files by dragging and dropping them between each side.
