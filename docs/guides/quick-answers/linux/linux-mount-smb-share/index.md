---
slug: linux-mount-smb-share
title: "Linux Mount SMB Share"
title_meta: "Quick Guide to Linux: Mount SMB Share Commands"
description: 'In Linux, mount SMB share commands attach a share at a specific point in the directory tree. Learn the mount & CIFS commands and how to use them.'
keywords: ['linux mount smb share', 'mount smb share linux', 'mount cifs', 'linux cifs mount']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["John Mueller"]
published: 2023-05-03
modified_by:
  name: Linode
external_resources:
- '[Server Message Block (SMB) share](https://docs.microsoft.com/en-us/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview)'
- '[Common Internet File System (CIFS) utils](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-cifs/d416ff7c-c536-406e-a951-4f04b2fd1d2b)'
---

Managing disk resources can be a time-consuming task without the right tools. In addition, knowing the correct terminology to use when working with disk resources is important when discussing techniques or locating help. This guide discusses the techniques Linux uses to mount a [Server Message Block (SMB) share](https://docs.microsoft.com/en-us/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) by relying on [Common Internet File System (CIFS)](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-cifs/d416ff7c-c536-406e-a951-4f04b2fd1d2b) utils. In this case, you use Linux (Ubuntu is specifically used in this case) to mount the Windows shares to allow the client access to the share as if it were a local resource. This guide assumes you have a [Linux](https://help.ubuntu.com/community/How%20to%20Create%20a%20Network%20Share%20Via%20Samba%20Via%20CLI%20(Command-line%20interface/Linux%20Terminal)%20-%20Uncomplicated,%20Simple%20and%20Brief%20Way!) or [Windows share](https://support.microsoft.com/en-us/windows/file-sharing-over-a-network-in-windows-b58704b2-f53a-4b82-7bc1-80f9994725bf) to use. Even though the instructions are specific to mount a Windows share on Linux, they also work to mount an SMB share for Linux. The commands are somewhat generic and you need to use your share specifics to make them work properly.


## What are SMB and CIFS?

The SMB protocol was originally created by Barry Feigenbaum at IBM in 1983 as a means of sharing files and printers across an OS/2 network. Microsoft and 3COM implemented SMB as [LAN Manager](https://www.techopedia.com/definition/7992/lan-manager) in 1987 for inclusion in Windows NT 3.1. (You can still find support for an updated version of [LAN Manager in Windows 10](https://docs.microsoft.com/en-us/windows/security/threat-protection/security-policy-settings/network-security-lan-manager-authentication-level)). In 1996, Microsoft updated SMB 1.0 with support for symbolic links, hard links, larger file sizes, and minimal direct connections over TCP port 445. They renamed this upgrade CIFS. So, what the original version of CIFS really amounts to is an updated and improved SMB 1.0. CIFS has received upgrades over the years, which is why it’s still in use.

SMB continues to go through changes and improvements. The current version, [SMB 3.1.1](https://4sysops.com/archives/the-smb-protocol-all-you-need-to-know/), appears as part of Windows 10, Windows Server 2016, and above. Most of the upgrades over the years concern security because the original LAN Manager setup had some serious security flaws. SMB 3.1.1 includes [AES-128 GCM encryption](https://www.cryptosys.net/pki/manpki/pki_aesgcmauthencryption.html). It also supports newer features such as Remote Direct Memory Access (RDMA), SMB Multichannel, and SMB Transparent Failover. Most versions of [Linux also support SMB 3.x](https://www.snia.org/sites/default/files/SDC/2016/presentations/smb/Steve_French_SMB3-1-1_and_Beyond_in_the_Linux_Kernel.pdf) today; although, they may not implement all SMB features for all protocol versions.

### What Is the mount Command?

The Linux SMB `mount` command is responsible for making data resources available on a Linux system. These resources are arranged in a giant tree starting at the root directory, which is indicated as `/`. As resources are added, they are attached to the tree in various locations. The resources need not physically reside on the same hard drive to allow Linux to mount the SMB share. For that matter, they can reside on remote systems. The tree structure makes it appear as if all of these resources are located in the same place, so everyone can use the resources; the system handles the details of where a resource is physically located once the resource is mounted onto the directory tree.

The mount `command` has a companion called umount. The `umount` command does the opposite of the `mount` command, it removes a resource from the directory tree so it can no longer be used.

To view a list of the resources that are currently mounted, type `mount` and press **Enter**. To view just the resources of a particular type, then you type `mount -t <resource type>` and press **Enter**. If the system has any resources of the specified type mounted, they will be displayed in a list similar to the following:

```output
tmpfs on /run type tmpfs (rw,nosuid,nodev,noexec,relatime,size=99272k,mode=755,inode64)
```

The `mount` command output displays several details about the mounted resource. It shows the logical location of the resource (in this case, `/run`), the resource type (`tmpfs`), and the [resource characteristics](https://man7.org/linux/man-pages/man5/tmpfs.5.html). The resource characteristics vary depending on the [resource type](https://linux.die.net/man/8/mount). In this example, the resource is located in virtual memory so it doesn’t have a physical location. The `mode` entry is especially important. A [value of 755](https://www.multacom.com/faq/password_protection/file_permissions.htm) signifies that the owner has read, write, and search permissions to the mount, whereas others can only search it (since this is a directory; file permissions are different). To modify the mode of the resource, you can use the `chmod` command. The `size` entry specifies that this resource provides 99,272 KB of storage.


### Understanding mount Points

A mount point is a location in the directory tree to which an unmounted resource is mounted. The mount point determines how the resource is accessed. For example, if `C:\Temp` on a **Windows** server is mounted to `/windows/drive_c/temp` on a **Linux** server, then users on the Linux server can access the resource through `/windows/drive_c/temp`. When a user enters dir `/windows/drive_c/temp` and presses **Enter**, what the user sees is `C:\Temp` on the Windows server, not a location on the Linux server. Once the resource is mounted to the directory tree of the Linux server, the system takes care of all the requirements for accessing the resource.

Linux doesn’t check to verify that the mount point you specify is empty. If you create a mount point for `C:\Temp` on Windows server A as `/windows/drive_c/temp`, and then create the same mount point for Server B, what the user sees is Server B, not Server A. The Server A resource is covered by the Server B resource. Once you unmount the Server B resource, the Server A resource becomes visible again. This usually happens without any complaint from Linux, so it’s essential to choose unique mount points when mounting new resources.


## How to Mount an SMB Share in Linux

The following sections detail specifically how to create a CIFS mount on Ubuntu, but the essential process is the same for other Linux flavors. The only requirement is that you have a share (any kind) to mount using CIFS on Linux.

### Install CIFS Utilities Packages

The CIFS utility package provides the tools needed to connect to a share and manage mounts on a Linux system. You use it to help create and manage a connection to a Windows, macOS, or Linux share. The following steps show how to install this software:

1. Update the list of available packages using the below command:

    ```command
    sudo apt update
    ```

    ```output
    $ sudo apt update
    Hit:1 http://security.ubuntu.com/ubuntu bionic-security InRelease
    Hit:2 http://archive.ubuntu.com/ubuntu bionic InRelease
    Hit:3 http://archive.ubuntu.com/ubuntu bionic-updates InRelease
    Hit:4 http://archive.ubuntu.com/ubuntu bionic-backports InRelease
    Reading package lists... Done
    Building dependency tree
    Reading state information... Done
    All packages are up to date.
    ```

    If all packages are updated, skip to step 4.

2. Upgrade all installed packages to their latest versions using the following command. The `-y` option is used to automatically answer "yes" to any questions that may arise during the upgrade process.

    ```command
    sudo apt -y upgrade
    ```

3. Reboot your server and/or restart services as needed to complete the upgrade process. This step is important to ensure that any changes made during the upgrade process take effect.

4. Install the CIFS utility package which is needed to mount SMB shares on Linux using the following command:

    ```command
    sudo apt -y install cifs-utils
    ```

    The output shows a series of installation steps.

    ```output
    Reading package lists... Done
    Building dependency tree
    Reading state information... Done
    The following additional packages will be installed:
      keyutils libdcerpc0 libgssglue1 libldb2 libndr-standard0 libndr0 libnetapi0 libntdb1 libtevent0 libwbclient0 python-ldb python-samba
      python-tdb samba-common-bin samba-libs tdb-tools
    Suggested packages:
      heimdal-clients ldb-tools ntp smbldap-tools winbind
    The following NEW packages will be installed:
      cifs-utils keyutils libdcerpc0 libgssglue1 libldb2 libndr-standard0 libndr0 libnetapi0 libntdb1 libtevent0 libwbclient0 python-ldb
      python-samba python-tdb samba-common-bin samba-libs tdb-tools
    0 upgraded, 16 newly installed, 0 to remove and 0 not upgraded.
    Need to get 8,236 kB of archives.
    After this operation, 36.8 MB of additional disk space will be used.
    Do you want to continue? [Y/n] y
    ```

5. Verify that CIFS is available using the following command:

    ```command
    mount -t cifs
    ```

    No error or output message is expected as there are no CIFS connections set up yet.

### Install the psmisc Package

The `psmisc` package contains a number of miscellaneous utilities that rely on the [/proc File System](https://www.kernel.org/doc/html/latest/filesystems/proc.html) and are used in [various file management tasks](https://packages.debian.org/stretch/psmisc). Installing the CIFS utilities can also install the `psmisc` package, but you may see an error message stating that `fuser` is missing when you try to use it, which means that you need to perform this separate installation. Installing this package depends on the platform you are using. The reason you need this package is to gain access to the `fuser` command, which shows you which users are using the various mounts on your server. It’s not possible to unmount a share if someone is using it. The following steps show how to install the `psmisc` package on Ubuntu.

1. Install the `psmisc` package using the following command. The installation command verifies that the latest version of `psmisc` is installed.

    ```command
    sudo apt -y install psmisc
    ```

1. Type `fuser` and press **Enter**. This command shows a list of the various command line switches that can be used with the `fuser` utility.

    ```output
    Usage: fuser [-fMuvw] [-a|-s] [-4|-6] [-c|-m|-n space] [-k [-i] [-s sig] | -SIGNAL] NAME...
    ```

    The command lists the available command line switches and their usage.

### Perform a Simple Linux CIFS Mount

There are a number of ways to automate the process used to mount CIFS on your system. The following steps show you how.

1. Obtain the necessary information required to access the share. This includes the server's IP address and the share information.  If you want to work locally, create a local directory using the `mkdir` command and then [create a Samba share to it](https://ubuntu.com/tutorials/install-and-configure-samba#1-overview).

1. Create an empty directory using the `mkdir` command. This directory will be used as the mount point.

1. Enter the following command to mount the CIFS share and press **Enter**.

    ```command
    mount -t cifs //<IP Address of Server>/<Share on Server> /<Mount Point>
    ```

    You are prompted to provide the password to connect to the remote share.

1. Type the password for the remote share and press **Enter**.

1. If the connection is successful, you should see the remote share mounted on the mount point directory you created. To verify this, type the following command:

    ```command
    mount -t cifs
    ```

    The command above will list all mounted CIFS shares, and you should see the share you just mounted listed as output.


### Create a Credentials File

You don’t want to have to type in your credentials every time you access a share. On the other hand, putting the credentials where everyone can see is not a good idea. The following steps help you create a credentials file to automate the process of logging in.

1. Use your preferred text editor such as vi or nano to create a file to store the credentials. You can name the file anything you want, but using a period before the filename will hide it from view. For example, you can create a file named `.credentials` using the following command:

    ```command
    nano ~/.credentials
    ```

1. Add the necessary credentials to the file in the following format:

    ```file {title=".credentials"}
    username=target_user_name
    password=target_user_password
    domain=domain
    ```

    If the `domain` is not required (except on Windows systems), you can omit that entry. Replace the `target_user_name` and `target_user_password` with the actual credentials you need to use to access the CIFS share. Save and close the file.

1. Set ownership of the credentials file to the current user by running the following command:

    ```command
    sudo chown <User Name>:<Credentials Filename>
    ```

    Replace `<User Name>` with your username and `<Credentials Filename>` with the name of your credentials file.

1. Set the file permissions to `600` to ensure that only the owner has read and write access:

    ```command
    sudo chmod 600 <Credentials Filename>
    ```

1. To mount the share using the credentials file, run the following command:

    ```command
    sudo mount -t cifs -o credentials=<Credentials Filename> //<IP Address of Server>/<Share on Server> /<Mount Point>
    ```

    Replace `<IP Address of Server>` with the IP address of the server hosting the share, `<Share on Server>` with the name of the share you want to mount, and `<Mount Point>` with the local mount point where you want to access the share. You aren’t asked for credentials this time because mount uses the credentials file instead.

1. Verify that the share has been successfully mounted using the following command:

    ```command
    mount -t cifs
    ```

    This should show you the share information as output, confirming that the share has been successfully mounted using the credentials file.

### Mount a Share Automatically

Remounting the CIFS share every time you restart the server would be annoying. You can set your server up to automatically remount the share every time you restart it using the following steps. Make sure that the share is currently unmounted.

1. Open the `/etc/fstab` file in your preferred text editor. This file contains configurations that the server uses on reboot to reconnect to shares (among other things). There are columns for the file system, mount point, type, and options.

1. Enter the information below in each of the columns:

    ```file {title="/etc/fstab"}
    <file system>: //<IP Address of Server>/<Share on Server>
    <mount point>: <Mount Point>
    <type>: cifs
    <options>: credentials=<Credentials Filename>
    ```

    From the file above, replace `<IP Address of Server>` with the IP address of the server hosting the share, `<Share on Server>` with the name of the share you want to mount, `<Mount Point>` with the local mount point where you want to access the share, `<Credentials Filename>` with the name of your credentials file,

1. Save the file so the share is available next time you reboot the server.

1. Verify that the share is mounted correctly using the `<Mount Point>` as an identifier because the mount is reading the `/etc/fstab` file.


### Unmount a Share

You may need to unmount a share at some point. Perhaps the share just isn’t useful any longer or you’ve done something like move the share to a different location. To unmount a CIFS share that has been mounted using the `mount` command, you can use the `umount` command followed by the mount point of the share. The correct command is `umount`, not `unmount`.

So to unmount a CIFS share at the mount point `<Mount Point>`, run the following command:

```command
umount -t cifs /<Mount Point>
```

The share should not appear in the output of this command.


## Conclusion

You now have an understanding of SMB and CIFS, what a share is, and what a mount point is. These pieces of information allow you to share remote data in a way that’s transparent to users. As far as they’re concerned, the resource is local to the server that they’re accessing.

This guide also shows you how to use the mount and umount commands in a basic way to create and delete shares, how to create and use a credentials file to automate the sharing process to some extent, and how to automatically remount the share after a reboot.
