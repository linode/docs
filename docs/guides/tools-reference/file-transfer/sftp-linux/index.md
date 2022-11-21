---
slug: sftp-linux
author:
  name: Jeff Novotny
description: 'Learn how to use SFTP commands to transfer files to and from Linux servers.'
keywords: ['what is sftp','SFTP commands','Sftp server','sftp vs ftps', 'scp vs sftp']
tags: ['linux', 'ssh']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-10-01
modified_by:
  name: Linode
title: "Transferring Files with SFTP"
h1_title: "How to Transfer Files with SFTP"
enable_h1: true
contributor:
  name: Jeff Novotny
  link: https://github.com/JeffreyNovotny
external_resources:
- '[Wikipedia SFTP Page](https://en.wikipedia.org/wiki/SSH_File_Transfer_Protocol)'
- '[IETF Draft for SSH File Transfer Protocol](https://datatracker.ietf.org/doc/html/draft-ietf-secsh-filexfer-13)'
---

*SSH File Transfer Protocol* (SFTP) provides a mechanism for transferring, accessing, and managing files more securely compared to earlier protocols. It is a free and open-source utility that is available on all Linux systems. SFTP extends version 2.0 of the *Secure Shell* (SSH) protocol to provide greater security. This guide provides some background information about SFTP and explains how to use it to transfer files.

## What is SFTP

SFTP, sometimes referred to as the *Secure File Transfer Protocol*, was developed to address serious security concerns surrounding the original FTP protocol. Despite its acronym, [*it is based on the SSH program*](https://datatracker.ietf.org/doc/html/draft-ietf-secsh-filexfer-13) and not on the original FTP utility. SFTP is designed from scratch to provide comprehensive file management. This architecture allows SFTP to leverage and access SSH security and authentication features. One advantage of SSH is that all data is encrypted, including the control commands.

SFTP is a file management protocol rather than a pure file transfer utility. It also provides the ability to delete, rename, and move files, and create, list, and delete directories. SFTP requires the use of a secure channel, which it uses to carry out all operations. A number of protocols can provide this channel, but in practice, SSH is almost always used. When the secure channel has authenticated the client, SFTP can be used.

An enhancement over earlier protocols is that files are uploaded along with their basic attributes, such as timestamps. SFTP shares its default port `22` with SSH. This single-port architecture means it is easier to use and secure than other similar protocols. SFTP allows pipelined requests and asynchronous responses and uses binary communications. This is advantageous for security, but makes it difficult to log. Unfortunately, there are occasional compatibility issues between implementations from different vendors.

SFTP should not be confused with the original *Simple File Transfer Protocol*, which was also abbreviated as SFTP. This older protocol was never widely used and has fallen out of favor.

## How Does SFTP Differ From FTPS and SCP

The *Secure Copy Protocol* (SCP) utility is commonly used for file transfers. However, it lacks the functionality of SFTP. Here is a comparison between the two protocols:

- SFTP provides a wider set of capabilities, including file and directory management commands, while SCP is only used for file transfers. SCP is generally preferred for quickly transferring a single file, while SFTP is better for more complex file management.
- SFTP is considered more system independent than SCP.
- SCP is faster than SFTP, especially over high-latency connections, because it uses a more efficient algorithm. SFTP also spends more time acknowledging packets.
- Both services are widely available on Linux systems, although SCP is more commonly used.
- Both protocols use SSH capabilities, and both are considered quite secure. They both protect data from being intercepted.
- SFTP can resume file transfers that have been paused. SCP does not do this.
- SCP is completely non-interactive, but SFTP provides an interactive option. Third-party GUIs are available for SFTP, but not for SCP.

*File Transfer Protocol Secure* (FTPS) extends the FTP protocol to integrate *Transport Layer Security* (TLS) security services. By comparison, SFTP is based on the SSH protocol. So FTPS is not related to SFTP, nor is it compatible with it. The two protocols differ in the following ways:

- While SFTP uses a single port (`22`) for all requests, FTPS uses multiple ports. This makes FTPS more difficult to use and secure.
- SFTP uses the authentication methods from SSH. To use FTPS, an SSL certificate is also required. SFTP is considered easier to implement.
- FTPS is somewhat faster because the control and data channels run on two different connections. However, the performance difference is not as significant as the one between SFTP and SCP.
- FTPS services are somewhat more limited or restricted compared to SFTP. Certain file operations are not standardized or secured in FTPS.
- FTPS requires additional commercial or free software packages to be installed, whereas SFTP is installed as part of the SSH package.
- SFTP can use key-based authentication, but FTPS cannot.
- FTPS must be used on devices that lack SSH capabilities, such as cell phones.
- FTPS uses ASCII mode, which can corrupt binary files if the mode is not set correctly.
- FTPS can log file transfer activities in a human-readable format.

In summary, SFTP is a good, all-purpose utility with more functionality than the alternatives. It is the best choice for most remote file management scenarios. Due to its performance advantage, SCP is a better choice to transfer one or two large files. FTPS must be used if the source device does not support SSH or human-readable logging is required. All three protocols provide a good level of security for basic file transfers.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Create an SFTP Connection

Linux implements the SFTP protocol using the SFTP utility. Other SFTP clients are also available, but this guide only covers SFTP. This utility is installed as part of the SSH package.

Before performing any file operations, first, use SFTP to establish a connection to the remote computer. To connect successfully, you must have the appropriate privileges to access the remote system. While logged in to the local system, follow the steps below to establish a connection:

1. Enter the `sftp` command along with the username of the target account and the IP address of the remote system. Separate the username and address using a `@` symbol.

        sftp username@remote_system_address

    {{< note >}}
If SFTP is not using the standard port `22`, specify the port number using the `-P` option, for example, `sftp -P port_number username@remote_system_address`.
    {{< /note >}}

1. When prompted, provide the password associated with the specified user account.

    {{< output >}}
username@remote_system_address's password
    {{< /output >}}

1. Upon successful authentication, SFTP confirms the connection is now active and displays the `sftp>` prompt.

    {{< output >}}
Connected to remote_system_address.
sftp>
    {{< /output >}}

1. If you cannot connect to the remote server using SFTP, ensure the SSH server is running on the destination server. To verify the status of the SSH server, use the following command:

        sudo systemctl status ssh

    {{< output >}}
ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; vendor preset: enabled)
     Active: active (running) since Tue 2021-08-31 12:13:14 UTC; 46min ago
    {{< /output >}}

{{< note >}}
Virtually all Linux distributions include SSH and SFTP as part of the default package. However, if the `sftp` command is not available, install the `ssh` package using `apt` or another package manager.
{{< /note >}}

### Open the SFTP Port

In some cases, the [UFW firewall](/docs/guides/configure-firewall-with-ufw/) might not be configured to allow SFTP requests. To allow SFTP configurations, enable the `ssh` component.

1. Verify the current `ufw` settings to see whether `ssh` is allowed. If SFTP requests are allowed, port `22` is shown with an action of `ALLOW`. In this example, SFTP is not yet enabled.

        sudo ufw status
    {{< output >}}
OpenSSH                    ALLOW       Anywhere
Apache Full                ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
Apache Full (v6)           ALLOW       Anywhere (v6)
80/tcp (v6)                ALLOW       Anywhere (v6)
    {{< /output >}}

1. Enable SSH to allow SFTP requests.

        sudo ufw allow ssh

    {{< output >}}
Rule added
Rule added (v6)
    {{< /output >}}

1. Verify port `22/tcp` is now shown in the output using the `ufw status` command. If `ufw` is not active, enable it using the `sudo ufw enable` command.

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

1. To terminate the SFTP connection at any time, enter `quit`.

        quit

## Navigate the Directory Structure with SFTP

1. By default, the remote SFTP server places users in their home directory when they first connect. To confirm the working remote directory, use the `pwd` command.

        pwd

    {{< output >}}
Remote working directory: /home/username
    {{< /output >}}

1. File navigation works much as it does in a normal Linux context. Use the `cd` command to change to a new directory. To navigate relative to another directory, follow `cd` with the name of the target directory. The `cd ..` command moves the context up one level.

        cd wpbackup
        cd ..

1. The `cd` command can also be used with an absolute pathname, as shown in the example below:

        cd /usr/bin

1. Return to the remote home directory at any time by entering `cd` without any arguments.

        cd

1. To list the contents of the remote working directory, use the `ls` command.

        ls

1. These commands can all be preceded with an `l` to execute the command locally. To change the local working directory, use the `lcd` command. The command `lpwd` displays the local working directory. `lls` lists the contents of the local working directory.

        lcd accounts
        lpwd

    {{< output >}}
Local working directory: /home/username/accounts
    {{< /output >}}

    {{< note >}}
File transfers occur to/from the local working and remote working directories. It is important to confirm both settings before performing any transfers. A common source of errors is forgetting to set the local working directory correctly.
    {{< /note >}}

## Transfer Files with SFTP

To transfer files, use the `get` and `put` commands. These commands can be used to transfer a single file or an entire directory. Additionally, SFTP allows users to resume interrupted transfers.

1. Set the local and remote working directories with the `cd` and `lcd` commands. When transferring a file from the remote system, it is retrieved from the remote working directory and copied to the local working directory.

        cd remote_source_directory
        lcd local_target_directory

1. To retrieve a single file from the remote system, enter the `get` command and the name of the file. SFTP updates the progress of the transfer until it completes.

        get states.txt

    {{< output >}}
Fetching /home/username/states.txt to states.txt
/home/username/states.txt                        100%   51    50.5KB/s   00:00
    {{< /output >}}

1. To save the file with a different name, append the new name as the last argument to the `get` command. In this example, the file named `states.txt` on the remote system is saved as `states2.txt` in the local working directory.

        get states.txt states2.txt

1. If the transfer is interrupted for any reason, resume it using the `reget` command.

        reget states.txt

    {{< output >}}
Resuming /home/username/states.txt to states.txt
/home/username/states.txt                        100%   51     0.0KB/s   00:00
    {{< /output >}}

1. To retrieve all files in a directory, use the `get` command with the `-r` option and the name of the directory.

        get -r php_backup

1. To upload a file to the remote server, use the `put` command. The following example demonstrates how to transfer a single file. Once again, SFTP uses the local and remote working directories to identify the source and target directories.

        put countries.txt

    {{< output >}}
Uploading countries.txt to /home/username/countries.txt
countries.txt                                 100%   42    97.9KB/s   00:00
    {{< /output >}}

1. Use the `-r` option to upload all files in a directory. The following example transfers all files in the `accounts` directory to the remote working directory on the SFTP server.

        put -r accounts

    {{< output >}}
Uploading accounts/ to /home/username/accounts
Entering accounts/
accounts/states2.txt                          100%   51   119.3KB/s   00:00
accounts/states.txt                           100%   51   138.2KB/s   00:00
accounts/cities.txt                           100%   29    78.7KB/s   00:00
accounts/countries.txt                        100%   42   118.3KB/s   00:00
    {{< /output >}}

## Other Useful SFTP Commands

Because SFTP provides full file management capabilities, it can duplicate most traditional Linux file commands. Users can rename or remove files, change permissions, add directories, or display information about files.

1. To remove a file on the remote system, use the `rm` command.

        rm testconnection2.php

    {{< output >}}
Removing /home/username/testconnection2.php
    {{< /output >}}

1. To remove an entire directory on the remote system, use the `rmdir` command. The directory must be empty before it can be removed.

        rmdir backup

1. The `mkdir` command can be used to create a new directory on the remote system. The new directory is created inside the remote working directory.

        mkdir backup

1. Rename a file on the remote system using the `rename` command.

        rename testconnection.php testconnection2.php

1. SFTP provides all the Linux file administration commands, such as `chown`, `chmod`, and `chgrp`. For example, to change file permissions, use the `chmod` command.

        chmod 644 testconnection2.php

     {{< output >}}
Changing mode on /home/username/testconnection2.php
    {{< /output >}}

1. The `df` command provides information about disk usage on the remote system.

        df -h

    {{< output >}}
    Size     Used    Avail   (root)    %Capacity
  78.2GB    7.1GB   67.2GB   71.1GB           9%
    {{< /output >}}

1. SFTP provides a mechanism to run a local command that is not available in SFTP without breaking the connection. To escape to the local shell, type `!`. Type `exit` to return to the SFTP prompt.

        !
        exit

1. SFTP supports wild cards for most commands. To list all text files in the remote working directory, run the following command:

        ls *.txt*

1. To display a full list of all the available SFTP commands, type `help`.

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

## Use an SFTP GUI Client to Transfer Files

If you prefer to use a graphical user interface (GUI) to work with files remotely, there are several available options. FileZilla is a popular open source SFTP client that supports SFTP, FTPS, FTP, and IPv6. To learn how to install and use this tool, see our [Transfer Files with FileZilla](/docs/guides/filezilla/) guide.