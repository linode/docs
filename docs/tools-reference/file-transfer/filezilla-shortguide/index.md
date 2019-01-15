---
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide which shows how to use FileZilla after it has been installed.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: []
aliases: ['networking/file-transfer/transfer-files-filezilla/']
modified: 2019-01-15
modified_by:
  name: Linode
published: 2018-08-14
title: 'Transfer Files with FileZilla'
headless: true
---

FileZilla is a popular free and open source FTP, FTPS, and SFTP client which has a GUI but can also take CLI arguments. In contrast to to SCP, SFTP can list directory contents, create or delete files, and resume interrupted file transfers.

 1.  Download FileZilla [here](https://filezilla-project.org/download.php) for MacOS and Windows. Use your distribution's package manager to install FileZilla on Linux:

     - CentOS:

            sudo yum install filezilla

     - Debian / Ubuntu:

            sudo apt install filezilla

1.  Launch FileZilla and enter your Linode's IP address or domain name in the `Host` field. Enter the username and password for the account on the Linode you want to connect as, and enter "22" in the `Port` field. Click **Quickconnect** to initiate the file transfer session.

    {{< image src="filezilla-quick-connect.png" alt="Quickconnect" title="FileZilla Quickconnect screenshot" >}}

1.  If this is the first time you've connected to your Linode by SSH or SFTP, you'll receive a warning that the host key is unknown. Verify the host key fingerprints and if valid, check the box next to `Always trust this host, add this key to the cache`. This prevents further warnings unless the key presented to FileZilla changes, which should only happen if you reinstall the remote server's operating system.

    {{< image src="filezilla-unknown-key.png" alt="Unknown Key" title="FileZilla Unknown Key warning" >}}

1.  Click the **OK** button to proceed. You'll be presented with a split view, with your local filesystem on the left and your Linode's filesystem on the right. You can transfer files by dragging and dropping them from one side to the other.
