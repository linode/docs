---
author:
  name: Linode
  email: docs@linode.com
deprecated: yes
description: 'Securely copying files to and from your Linode with Filezilla, a free and open source file transfer client for Linux desktop systems.'
keywords: ["filezilla", "ftp", "linux scp", "sftp", "linux sftp program", "linux ftp"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['networking/file-transfer/transfer-files-filezilla-ubuntu-9-10/']
modified: 2011-08-22
modified_by:
  name: Linode
published: 2009-11-13
title: 'Transfer Files with Filezilla on Ubuntu 9.10 Desktop'
---

Filezilla is a free, open source file transfer program written for Linux, MacOS X, and Windows systems. It implements several file transfer protocols, most notably SFTP via SSH. This tool allows you to securely transfer files to and from your Linode using an encrypted channel, avoiding the security problems and usability issues inherent in traditional FTP client/server systems. Filezilla can send both your login credentials and file transfers over the network securely encrypted (provided you're using SFTP), while standard FTP clients send this information as plaintext.

You'll need to make sure your Linode is running an SSH daemon (all Linodes run an OpenSSH server by default), and that you have a user account on the server before following these instructions. If you wish, you may use the `root` account on your Linode to perform file transfers, although you may need to change [file ownership and permissions](/docs/tools-reference/linux-users-and-groups) on the server after doing so.

# Installing Filezilla

On your desktop, click "System" -\> "Administration" -\> "Synaptic Package Manager" as shown below to start the package installer.

[![Launching Synaptic on Ubuntu 9.10 desktop edition.](/docs/assets/179-filezilla-ubuntu-synaptic.png)](/docs/assets/179-filezilla-ubuntu-synaptic.png)

In the package manager's "Quick search" box, enter "sftp" and click the "Search" icon. A list of packages related to sftp programs will appear. Locate "filezilla" in this list and check its box to select it for installation. Click the "Apply" button to proceed.

[![Finding a package in Synaptic on Ubuntu 9.10 desktop edition.](/docs/assets/180-filezilla-ubuntu-selected.png)](/docs/assets/180-filezilla-ubuntu-selected.png)

You will be asked to confirm your installation request. Click the "Apply" button to proceed.

[![Confirming package installation in Synaptic on Ubuntu 9.10 desktop edition.](/docs/assets/181-filezilla-ubuntu-apply.png)](/docs/assets/181-filezilla-ubuntu-apply.png)

Filezilla and required dependency files will be installed on your system. You may close Synaptic once the install has completed.

# Using Filezilla

On your desktop, click "Applications" -\> "Internet" -\> "Filezilla" to launch the program.

[![Menu entry for Filezilla on Ubuntu 9.10 desktop edition.](/docs/assets/182-filezilla-ubuntu-menu-entry.png)](/docs/assets/182-filezilla-ubuntu-menu-entry.png)

Enter your Linode's IP address in the "Host" field. Enter the account username you wish to connect as in the "Username" field. Please note that this must be a user account on your Linode; if in doubt, enter "root" to log in as the root user. Enter the account's password in the "Password" field, and enter "22" in the "Port" field. Click "Quickconnect" to initiate the file transfer session.

[![Quickconnect in Filezilla on Ubuntu 9.10 desktop edition.](/docs/assets/183-filezilla-ubuntu-quick-connect.png)](/docs/assets/183-filezilla-ubuntu-quick-connect.png)

If this is the first time you've connected to your Linode with an SSH or SFTP program, you'll receive a warning that the host key is unknown.

[![Unknown SSH key warning in Filezilla on Ubuntu 9.10 desktop edition.](/docs/assets/184-filezilla-ubuntu-unknown-key.png)](/docs/assets/184-filezilla-ubuntu-unknown-key.png)

This is due to the possibility that someone could be eavesdropping on your connection, posing as the server you are trying to log into. You need some "out of band" method of comparing the key fingerprint presented to Filezilla with the fingerprint of the public key on the server you wish to log into. You may do so by logging into your Linode via the AJAX console (see the "Console" tab in the Linode Manager) and executing the following command:

    ssh-keygen -l -f /etc/ssh/ssh_host_rsa_key.pub

The key fingerprints should match; click "Yes" to accept the warning and cache this host key. You won't receive further warnings unless the key presented to Filezilla changes for some reason; typically, this should only happen if you reinstall the remote server's operating system. If you should receive this warning again from a system you already have the host key cached on, you should not trust the connection and investigate matters further.

When you're ready to proceed, click the "Ok" button. You'll be presented with a split view, with your local filesystem on the left and your Linode's filesystem on the right. You may transfer files by dragging and dropping them between each side.

# Connecting Without a Password (SSH Keys)

If you'd like to use SSH keys to allow access to your Linode without the need to specify a password, you'll need to make sure you have an SSH keypair generated for your local user account. To verify this, open a terminal (click "Applications" -\> "Accessories" -\> "Terminal") and type the following command:

    ls ~/.ssh/

If you see a list of files including `id_rsa` or `id_dsa`, you already have keys on your workstation. If you don't see such files listed, issue the following command to create a keypair:

    ssh-keygen -t rsa

Next, you'll need to copy your public key (created as `id_rsa.pub`) to your Linode. Issue the following commands to do so. If your files are called `id_dsa` and `id_dsa.pub`, change the command accordingly. Substitute the name of the user account you wish to log into on your Linode (or "root") for the "user" portion of the command, and substitute your Linode's IP address or domain name for the "hostname.com" portion of the command.

    scp ~/.ssh/id_rsa.pub user@hostname.com:~/.ssh/uploaded_key.pub
    ssh user@hostname.com "echo \`cat ~/.ssh/uploaded_key.pub\` >> ~/.ssh/authorized_keys2"

Test the ability to log in without a password by issuing the following command:

    ssh user@hostname.com

If you're asked for a password, please double-check the preceding steps in this section. If you're logged into your Linode, you may type `exit` to close the SSH connection. Provided you were able to log in without entering a password, return to Filezilla and initiate a new connection. You should now be able to connect to your Linode without entering a password in the "Password" field.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Filezilla Documentation](http://wiki.filezilla-project.org/Documentation)
- [Tools & Resources](/docs/tools-reference/)



