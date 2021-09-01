---
slug: sftp-linux
author:
  name: Linode Community
  email: docs@linode.com
description: 'Learn how to  use SFTP commands to transfer files to and from Linux servers.'
og_description: 'Learn how to  use SFTP commands to transfer files to and from Linux servers.'
keywords: ['sftp','SFTP commands','Sftp server','SFTP vs FTP']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-30
modified_by:
  name: Linode
title: "How to Transfer Files with SFTP"
h1_title: "How to Transfer Files with SFTP"
enable_h1: true
contributor:
  name: Jeff Novotny
external_resources:
- '[Wikipedia SFTP Page](https://en.wikipedia.org/wiki/SSH_File_Transfer_Protocol)'
- '[IETF Draft for SSH File Transfer Protocol](https://datatracker.ietf.org/doc/html/draft-ietf-secsh-filexfer-13)'
---

*SSH File Transfer Protocol* (SFTP) provides a mechanism of transferring, accessing, and managing files in a more secure manner compared to earlier protocols. It is a free open source utility that is available on all Linux systems. SFTP extends version 2.0 of the *Secure Shell Protocol* (SSH) to provide greater security. This guide provides some background information about SFTP and explains how to use it to transfer files.

## What is SFTP

SFTP, sometimes referred to as the *Secure File Transfer Protocol*, was developed to address serious security concerns surrounding the original FTP protocol. Despite its acronym, [*it is based on the SSH program*](https://datatracker.ietf.org/doc/html/draft-ietf-secsh-filexfer-13) and not on the original FTP utility. SFTP is designed from scratch to provide comprehensive file management abilities. This architecture allows SFTP to leverage and access SSH security and authentication features. One advantage of SSH is that all data is encrypted, including the control commands.

SFTP is a file management protocol rather than a pure file transfer utility. It also provides the ability to delete, rename, and move files, and create, list, and delete directories. SFTP requires the use of a secure channel, which it uses to carry out all operations. A number of protocols can provide this channel, but in practice SSH is almost always used. When the secure channel has authenticated the client, SFTP can be used.

An enhancement over earlier protocols is that files are uploaded along with their basic attributes, such as timestamps. SFTP shares its default port 22 with SSH. This single-port architecture means it is easier to use and secure than other similar protocols. SFTP allows pipe-lined requests and asynchronous responses, and uses binary communications. This is advantageous for security, but makes it difficult to log. Unfortunately, there are occasional compatibility issues between implementations from different vendors.

SFTP should not be confused with the original *Simple File Transfer Protocol*, which was also abbreviated as SFTP. This older protocol was never widely used and has fallen out of favor.

## How Does SFTP Differ From FTPS and SCP

The *Secure Copy Protocol* (SCP) utility is commonly used for file transfers. However, it lacks the functionality of SFTP. Here is a comparison between the two protocols:

*   SFTP provides a wider set of capabilities, including file and directory management commands, while SCP is only used for file transfers. SCP is generally preferred for quickly transferring a single file, while SFTP is better for more complex file management.
*   SFTP is considered more system independent than SCP.
*   SCP is faster than SFTP, especially over high-latency connections, because it uses a more efficient algorithm. SFTP also spends more time acknowledging packets.
*   Both services are widely available on Linux systems, although SCP is somewhat more commonly used.
*   Both protocols use SSH capabilities, and both are considered quite secure. They both protect data from being intercepted.
*   SFTP can resume file transfers that have been paused. SCP does not do this.
*   SCP is completely non-interactive, but SFTP provides an interactive option. Third-party GUIs are available for SFTP, but not for SCP.

*File Transfer Protocol Secure* (FTPS) extends the FTP protocol to integrate *Transport Layer Security* (TLS) security services. By comparison, SFTP is based on the SSH protocol. So FTPS is not related to SFTP, nor is it compatible with it. The two protocols differ in the following ways:

*   While SFTP uses a single port (#22) for all requests, FTPS uses multiple ports. This makes FTPS more difficult to use and secure.
*   SFTP uses the authentication methods from SSH. To use FTPS, a SSL certificate is also required. SFTP is considered easier to implement.
*   FTPS is somewhat faster because the control and data channels run on two different connections. However, the performance difference is not as significant as the one between SFTP and SCP.
*   FTPS services are somewhat more limited or restricted compared to SFTP. Certain file operations are not standardized or secured in FTPS.
*   FTPS requires additional commercial or free software packages to be installed, whereas SFTP is installed as part of the SSH package.
*   SFTP can use key-based authentication, but FTPS cannot.
*   FTPS must be used on devices that lack SSH capabilities, such as cell phones.
*   FTPS uses ASCII mode, which can corrupt binary files if the mode is not set correctly.
*   FTPS can log file transfer activities in a human-readable format.

In summary, SFTP is a good, all-purpose utility with more functionality than the alternatives. It is the best choice for most remote file management scenarios. Due to its performance advantage, SCP is a better choice to transfer one or two large files. FTPS must be used if the source device does not support SSH or human-readable logging is required. All three protocols provide a good level of security for basic file transfers.

## Before You Begin

1.  Familiarize yourself with Linode's [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide uses `sudo` wherever possible. Complete the sections of Linode's [Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet. This guide includes firewall rules specifically for an OpenVPN server.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Creating an SFTP Connection

Linux implements the SFTP protocol using the `sftp` utility. Other SFTP clients are also available, but this guide only covers `sftp`. This utility is installed as part of the `ssh` package.

Before performing any file operations, first use `sftp` to establish a connection to the remote computer. To connect successfully, you must have the appropriate privileges to access the remote system. While logged in to the local system, follow these steps to establish a connection:

1.  Enter the `sftp` command along with the username of the target account and the IP address of the remote system. Separate the username and address using a `@` symbol.

        sftp userid@remote_system_address
    {{< note >}}
If SFTP is not using the standard port 22, specify the port number using the `-P` option, for example `sftp -P port_number userid@remote_system_address`.
    {{< /note >}}
2.  When prompted, provide the password associated with the specified user account.

    {{< output >}}
userid@remote_system_address's password
    {{< /output >}}
3.  Upon successful authentication, `sftp` confirms the connection is now active and displays the `sftp>` prompt.

    {{< output >}}
Connected to remote_system_address.
sftp>
    {{< /output >}}

4.  If you cannot connect to the remote server using SFTP, ensure the SSH server is running on the destination server. To verify the status of the SSH server, use the following command:

        sudo systemctl status ssh
    {{< output >}}
ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; vendor preset: enabled)
     Active: active (running) since Tue 2021-08-31 12:13:14 UTC; 46min ago
    {{< /output >}}

{{< note >}}
Virtually all Linux distributions include SSH and SFTP as part of the default package. However, if the `sftp` command is not available, install the `ssh` package using `apt` or another package manager.
{{< /note >}}

### Opening the SFTP Port

In some cases, the `ufw` firewall might not be configured to allow SFTP requests. To allow SFTP configurations, enable the `ssh` component.

1.  Verify the current `ufw` settings to see whether `ssh` is allowed. If SFTP requests are allowed, port `22` is shown with an action of `ALLOW`. In this example, SFTP is not yet enabled.

        sudo ufw status
    {{< output >}}
OpenSSH                    ALLOW       Anywhere
Apache Full                ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
Apache Full (v6)           ALLOW       Anywhere (v6)
80/tcp (v6)                ALLOW       Anywhere (v6)
    {{< /output >}}
2.  Enable `ssh` to allow SFTP requests.

        sudo ufw allow ssh
    {{< output >}}
Rule added
Rule added (v6)
    {{< /output >}}
3.  Verify port `22/tcp` is now shown in the output of the `ufw status` command. If `ufw` is not active, enable it using the `sudo ufw enable` command.

        sudo ufw status
    {{< output >}}
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Apache Full                ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
22/tcp                     ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
Apache Full (v6)           ALLOW       Anywhere (v6)
80/tcp (v6)                ALLOW       Anywhere (v6)
22/tcp (v6)                ALLOW       Anywhere (v6)
    {{< /output >}}
4.  To terminate the SFTP connection at any time, enter `quit`.

        quit

## Navigating the Directory Structure with SFTP

1.  By default, the remote SFTP server places users in their home directory when they first connect. To confirm the working remote directory, use the `pwd` command.

        pwd
    {{< output >}}
Remote working directory: /home/userid
    {{< /output >}}
2.  File navigation works much like it does in a normal Linux context. Use the `cd` command to change to a new directory. To navigate relatively, follow `cd` with the name of the target directory. The `cd ..` command moves the context up one level.

        cd wpbackup
        cd ..
3.  The `cd` command can also be used with an absolute path name, as shown here.

        cd /usr/bin
4.  Return to the remote home directory at any time by entering `cd` without any arguments.

        cd
5.  To list the contents of the remote working directory, use the `ls` command.

        ls
6.  These commands can all be preceded with a `l` to execute the command locally. To change the local working directory, use the `lcd` command. The command `lpwd` displays the local working directory. `lls` lists the contents of the local working directory.

        lcd accounts
        lpwd
    {{< output >}}
Local working directory: /home/userid/accounts
    {{< /output >}}

    {{< note >}}
File transfers occur to/from the local working and remote working directories. It is important to confirm both settings before performing any transfers. A common source of errors is forgetting to set the local working directory correctly.
    {{< /note >}}

## Transferring Files with SFTP

To transfer files, use the `get` and `put` commands. These commands can be used to transfer a single file or an entire directory. Additionally, SFTP allows users to resume interrupted transfers.

1.  Set the local and remote working directories with the `cd` and `lcd` commands. When transferring a file from the remote system, it is retrieved from the remote working directory and copied to the local working directory.

        cd remote_source_directory
        lcd local_target_directory
2.  To retrieve a single file from the remote system, enter the `get` command and the name of the file. SFTP updates the progress of the transfer until it completes.

        get states.txt
    {{< output >}}
Fetching /home/userid/states.txt to states.txt
/home/userid/states.txt                        100%   51    50.5KB/s   00:00
    {{< /output >}}
3.  To save the file with a different name, append the new name as the last argument to the `get` command. In this example, the file named `states.txt` on the remote system is saved as `states2.txt` in the local working directory.

        get states.txt states2.txt
4.  If the transfer is interrupted for any reason, resume it using the `reget` command.

        reget states.txt
    {{< output >}}
Resuming /home/userid/states.txt to states.txt
/home/userid/states.txt                        100%   51     0.0KB/s   00:00
    {{< /output >}}
5.  To retrieve all files in a directory, use the `get` command with the `-r` option and the name of the directory.

        get -r php_backup
6.  To upload a file to the remote server, use the `put` command. The following example demonstrates how to transfer a single file. Once again, SFTP uses the local and remote working directories to identify the source and target directories.

        put countries.txt
    {{< output >}}
Uploading countries.txt to /home/userid/countries.txt
countries.txt                                 100%   42    97.9KB/s   00:00
    {{< /output >}}
7.  Use the `-r` option to upload all files in a directory. The following example transfers all files in the `accounts` directory to the remote working directory on the SFTP server.

        put -r accounts
    {{< output >}}
Uploading accounts/ to /home/userid/accounts
Entering accounts/
accounts/states2.txt                          100%   51   119.3KB/s   00:00
accounts/states.txt                           100%   51   138.2KB/s   00:00
accounts/cities.txt                           100%   29    78.7KB/s   00:00
accounts/countries.txt                        100%   42   118.3KB/s   00:00
    {{< /output >}}

## Other Useful SFTP Commands

Because SFTP provides full file management capabilities, it is able to duplicate most traditional Linux file commands. Users can rename or remove files, change permissions, add directories, or display information about files.

1.  To remove a file on the remote system, use the `rm` command.

        rm testconnection2.php
    {{< output >}}
Removing /home/userid/testconnection2.php
    {{< /output >}}
2.  To remove an entire directory on the remote system, use the `rmdir` command. The directory must be empty before it can be removed.

        rmdir backup
3.  The `mkdir` command can be used to create a new directory on the remote system. The new directory is created inside the remote working directory.

        mkdir backup
4.  Rename a file on the remote system using the `rename` command.

        rename testconnection.php testconnection2.php
5.  SFTP provides all the Linux file administration commands, such as `chown`, `chmod`, and `chgrp`. For example, to change file permissions, use the `chmod` command.

        chmod 644 testconnection2.php
     {{< output >}}
Changing mode on /home/userid/testconnection2.php
    {{< /output >}}
6.  The `df` command provides information about disk usage on the remote system.

        df -h
    {{< output >}}
    Size     Used    Avail   (root)    %Capacity
  78.2GB    7.1GB   67.2GB   71.1GB           9%
    {{< /output >}}
7.  SFTP provides a mechanism to run a local command that is not available in SFTP without breaking the connection. To escape to the local shell, type `!`. Type `exit` to return to the SFTP prompt.

        !
        exit
8.  SFTP supports wild cards for most commands. To list all text files in the remote working directory, run the following command.

        ls *.txt*
9.  To display a full list of all the available SFTP commands, type `help`.

        help
    {{< output >}}
Available commands:
bye                                Quit sftp
cd path                            Change remote directory to 'path'
...
!command                           Execute 'command' in local shell
!                                  Escape to local shell
?                                  Synonym for help
    {{< /output >}}