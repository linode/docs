---
author:
  name: Linode
  email: docs@linode.com
description: 'Securely accessing remote filesystems with SSHFS from a variety of operating systems.'
keywords: 'sshfs,ssh filesystem,sshfs linux,sshfs macos'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['networking/ssh-filesystems/']
modified: Tuesday, May 17th, 2011
modified_by:
  name: Linode
published: 'Monday, October 26th, 2009'
title: Using SSHFS on Linux and MacOS X
---

SSHFS allows users to securely access remote filesystems over the SSH protocol. This guide will help you get started with SSHFS on Linux or MacOS X. SSHFS eliminates the need to use specialized software (such as SFTP/FTP clients) to transfer files to and from a remote server. This document assumes the server hosting the filesystem you wish to access has an SSH daemon running on it, and that you have an account on the server with sufficient privileges to access the desired filesystem locations.

Using SSHFS with Linux
----------------------

### Install Prerequisite Packages

This example uses Debian 5 (Lenny) as the client operating system. We'll be accessing a remote server running Ubuntu 9.04. Issue the following commands to ensure that your system's package database is up to date and the latest versions of your packages have been installed:

    apt-get update
    apt-get upgrade

Issue the following command to install sshfs:

    apt-get install sshfs

The above sequence of commands will work on Ubuntu clients as well. If you're running CentOS or Fedora on the client, issue the following commands to install the client and ensure that your system is up to date:

    yum update
    yum install sshfs

### Linux Client - Mount a Remote Filesystem

After the required packages are installed, you may use the `sshfs` command in your terminal to mount a remote filesystem. If you wish to use a normal user account to mount filesystems using SSHFS, you'll need to add your user to the `fuse` group first. Execute the following command as root, substituting your user account name for "someuser":

    usermod -a -G fuse someuser

Log out and log back into the client system before proceeding using a normal user account. If we wanted to mount the home directory of a user named "alex" on a remote server named "archimedes.example.com", we might issue the following commands:

    mkdir alex-archimedes
    sshfs alex@archimedes.example.com:/home/alex alex-archimedes

To umount the filesystem, issue the `umount` command:

    umount alex-archimedes

### SSH Keys and Persistent Mounts

If you'd like to make a filesystem mount persistent between reboots, you may modify your `/etc/fstab` file to include an entry for it. Before doing so, you'll need to make sure you can log into the remote server without entering a password; you'll need to configure SSH keys to accomplish this. This will allow you to mount the remote filesystem without needing to enter a password.

You might issue the following commands to generate an SSH key and copy it to the remote server's `authorized_keys2` file. Please note that this file may be named `authorized_keys` instead; consult your remote server's configuration file (usually `/etc/ssh/sshd_config`) if you're unsure which filename is valid. Note that these commands are for the fictional "example.com" server. You'll need to substitute values appropriate for your server in commands that include a hostname or user account name.

If your remote server user account doesn't already have key in `~/.ssh`, issue this command on the remote server, accepting the defaults:

    ssh-keygen -t rsa

If your local (client) user account doesn't already have keys in `~/.ssh`, issue the same command on the client system, accepting the defaults:

    ssh-keygen -t rsa

Issue these commands on the client system to copy your public SSH key to the remote server:

    scp ~/.ssh/id_rsa.pub alex@archimedes.example.com:/home/alex/.ssh/uploaded_key.pub
    ssh alex@archimedes.example.com "echo \`cat ~/.ssh/uploaded_key.pub\` >> ~/.ssh/authorized_keys2"

At this point, you should be able to log into the remote server as "alex" without entering a password. Next, you may modify your local client's `/etc/fstab` file to include a mount directive for the remote user directory.

{: .file-excerpt }
/etc/fstab
: ~~~
	<sshfs#alex@archimedes.example.com>:/home/alex /root/alex-archimedes fuse defaults 0 0
~~~

This entry would mount the home directory for "alex" on the server "archimedes.example.com" locally at `/root/alex-archimedes` each time the system is booted. You may treat this entry like any other in `/etc/fstab`; please consult the man page for `fstab` for an in-depth explanation of available options.

Using SSHFS with MacOS X
------------------------

With MacFUSE and Macfusion, you can mount remote filesystems over SSH in Mac OS X. You may use Finder or the terminal to access files in this manner.

Visit the [MacFUSE homepage](http://code.google.com/p/macfuse/) to download a current copy of the MacFUSE installer for MacOS X 10.5 or greater. Open the disk image in Finder and double-click "MacFUSE.pkg" to start the installation process:

[![Opening the MacFUSE disk image in MacOS X.](/docs/assets/185-macfuse-install-01.png)](/docs/assets/185-macfuse-install-01.png)

You'll be presented with information on MacFUSE. Click "Continue" to proceed:

[![MacFUSE information screen in MacOS X.](/docs/assets/186-macfuse-install-02.png)](/docs/assets/186-macfuse-install-02.png)

Review the software license agreement and click "Continue" to proceed:

[![MacFUSE software license agreement on MacOS X.](/docs/assets/187-macfuse-install-03.png)](/docs/assets/187-macfuse-install-03.png)

Click "Install" to confirm installation:

[![MacFUSE software installer confirmation on MacOS X.](/docs/assets/188-macfuse-install-04.png)](/docs/assets/188-macfuse-install-04.png)

As stated in the installer, please restart your system before proceeding further. This is to ensure MacFUSE is running properly before you proceed with later steps.

Once MacFUSE is installed, visit the [Macfusion homepage](http://www.macfusionapp.org/) and extract the program to your desktop. Double-click the Macfusion icon to start the program. Select the option to start the agent automatically if desired, and click "Start" to continue:

[![Macfusion start confirmation on MacOS X.](/docs/assets/189-macfusion-install-01.png)](/docs/assets/189-macfusion-install-01.png)

You will be presented with an empty connection list. Click the "+" icon in the bottom left of the window and select "SSHFS" to continue:

[![Macfusion with an empty connection list on MacOS X.](/docs/assets/189-macfusion-install-01.png)](/docs/assets/189-macfusion-install-01.png)

Fill in your server and remote user account details on the "SSH" tab. Optionally, you can specify a remote filesystem path.

[![Macfusion SSH connection details on MacOS X.](/docs/assets/190-macfusion-install-03.png)](/docs/assets/190-macfusion-install-03.png)

On the "Macfusion" tab, you may select a mount point for this filesystem. Do not specify a directory that already exists; a link will be created at the location you specify here.

[![Macfusion mount point details on MacOS X.](/docs/assets/191-macfusion-install-04.png)](/docs/assets/191-macfusion-install-04.png)

Allow Macfusion to access your keychain:

[![Macfusion keychain access query on MacOS X.](/docs/assets/192-macfusion-install-05.png)](/docs/assets/192-macfusion-install-05.png)

Once all connection information is entered, click "Mount" in the connection list. Your remote server will mounted at the location you specified.

[![Remote filesystem connection in Macfusion on MacOS X.](/docs/assets/193-macfusion-install-06.png)](/docs/assets/193-macfusion-install-06.png)

Use Finder to navigate to the location your remote filesystem is mounted at locally.

[![Remote SSHFS filesystem icon in Finder on MacOS X.](/docs/assets/194-macfusion-install-07.png)](/docs/assets/194-macfusion-install-07.png)

Double-click on the icon to display the contents of your remote filesystem.

[![A remote SSHFS filesystem in Finder on MacOS X.](/docs/assets/195-macfusion-install-08.png)](/docs/assets/195-macfusion-install-08.png)

Congratulations! You've mounted a remote filesystem via SSH on MacOS X.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [SSHFS Home Page](http://fuse.sourceforge.net/sshfs.html)
- [MacFUSE Home Page](http://code.google.com/p/macfuse/)
- [Macfusion Home Page](http://www.macfusionapp.org/)
- [Linux Security Basics](/docs/security/basics)



