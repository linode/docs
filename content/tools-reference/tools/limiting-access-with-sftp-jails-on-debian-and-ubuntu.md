---
author:
  name: Linode
  email: docs@linode.com
description: 'Restricting remote users to their home directories, only allowing access to SFTP for transferring files.'
keywords: ["sftp", "sftp jail", "openssh", "ssh jail"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['security/sftp-jails/']
modified: 2014-04-16
modified_by:
  name: Linode
published: 2010-01-06
title: Limiting Access with SFTP Jails on Debian and Ubuntu
external_resources:
- '[OpenSSH Documentation](http://www.openssh.org/manual.html)'
- '[An Introduction to Users and Groups](/docs/tools-reference/linux-users-and-groups)'
---

As the system administrator for your Linode, you may want to give your users the ability to securely upload files to your server. The most common way to do this is to allow file transfers via SFTP, which uses SSH to provide encryption. This means you need to give your users SSH logins. But, by default, SSH users are able to view your Linode's entire filesystem, which may not be desirable.

![Limiting Access with SFTP Jails on Debian and Ubuntu](/docs/assets/limiting-access-with-sftp-jails-on-debian-and-ubuntu.png)

This guide will help you configure OpenSSH to restrict users to their home directories, and to SFTP access only. Please note that these instructions are not intended to support shell logins; any user accounts modified in accordance with this guide will have the ability to transfer files, but not the ability to log into a remote shell session.

These instructions will work for Ubuntu 9.04, Debian 5, and later. Unfortunately, the version of SSH packaged with Ubuntu 8.04 is too old to support this configuration.

## Configure OpenSSH

First, you need to configure OpenSSH.

1.  Edit your `/etc/ssh/sshd_config` file with your favorite text editor:

        vim /etc/ssh/sshd_config

2.  Add or modify the `Subsystem sftp` line to look like the following:

    {{< file-excerpt "/etc/ssh/sshd\\_config" >}}
Match Group filetransfer
    ChrootDirectory %h
    X11Forwarding no
    AllowTcpForwarding no
    ForceCommand internal-sftp

{{< /file-excerpt >}}


   Save the changes to your file.

4.  Restart OpenSSH:

        service ssh restart

OpenSSH has been successfully modified.

## Modify User Accounts

In this section, we'll set up the correct new groups, ownership, and permissions for your user accounts.

1.  Create a system group for users whom you want to restrict to SFTP access:

        addgroup --system filetransfer

2.  Modify the user accounts that you wish to restrict to SFTP. Issue the following commands for each account, substituting the appropriate username. Please keep in mind that this will prevent these users from being able to log into a remote shell session.

        usermod -G filetransfer username
        chown root:root /home/username
        chmod 755 /home/username

    These users will now be unable to create files in their home directories, since these directories are owned by the root user.

3.  Next, you need to create new directories for each user, to which they will have full access. Issue the following commands for each user, changing the directories created to suit your needs:

        cd /home/username
        mkdir docs public_html
        chown username:filetransfer *

Your users should now be able to log into their accounts via SFTP and transfer files to and from their assigned subdirectories, but they shouldn't be able to see the rest of your Linode's filesystem.
