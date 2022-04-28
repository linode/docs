---
slug: vsftpd-on-ubuntu-2004-installation-and-configuration
author:
  name: Cameron Laird
description: 'Learn to install a VSFTPD server on Ubuntu 20.04 for secure FTP file transfers.'
keywords: ['vsftpd','vstpd conf','vsftpd ubuntu']
tags: ['ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-14
modified_by:
  name: Linode
title: "VSFTPD on Ubuntu 20.04: Installation and Configuration"
h1_title: "Install VSFTPD on Ubuntu 20.04:"
enable_h1: true
contributor:
  name: Cameron Laird
  link: https://twitter.com/Phaseit
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

This guide teaches you what VSFTPD is, and its advantages, and demonstrates how to install VSFTPD on Ubuntu 20.04. It also shows you the basic configurations needed to securely connect to a Linode server via VSFTPD. By the end of this guide, you connect to a fully functioning VSFTPD Ubuntu Linode server. You also learn to read from, and write files to the server.

## What is VSFTPD?

VSFTPD (very secure FTP daemon) is an open-source FTP (File Transfer Protocol) server that is the default for several prominent Linux distributions. VSFTPD is widely believed to be as secure as any competitive FTP server. It installs on several Linux distributions and on a wide range of Unix and Unix-like operating systems. VSFTPD supports TLS (Transport-Layer Security), FTPS (File Transfer Protocol Secure), and IPv6 (the most recent version of the internet protocol which underlies all Internet operations).

VSFTPD is important because several prominent platforms, including the WordPress content manager, rely on FTP for crucial workflows. It is widely used in such "vertical markets" as accounting, architecture, construction, medicine, and transcription to move, share, and archive large files. FTP allows a remote computer to connect to a server, examine parts of the server's filesystem, retrieve files, and upload files. While more modern protocols offer advantages in security, performance, and convenience, FTP at its best is a fast, and well-established file-sharing platform.

## VSFTPD Installation Steps

To install a standard VSFPTD on Ubuntu 20.04 through the command line follow the steps below:

1. Update your system's packages.

        sudo apt update

1. Install a VSFTPD, FTP, and the UFW firewall.

        sudo apt install systemctl vsftpd ftp ufw -y

1. Set VSFTPD to start when your server boots.

        sudo systemctl enable vsftpd

1. Launch VSFPTD.

        sudo systemctl start vsftpd

1. Verify that VSFTPD is running properly after this installation.

        sudo systemctl status vsftpd

    You should see a similar output:

    {{< output >}}
vsftpd.service - vsftpd FTP server
    Loaded: loaded (/usr/lib/systemd/system/vsftpd.service, enabled)
    Active: active (running)
    {{</ output >}}

1. To see VSFTPD in action--a kind of "Hello, world" for FTP, create a special-purpose account on your server.

        sudo useradd -m ftp_client

1. Set the password for your new user.

        sudo passwd ftp_client

1. Create a new example file to use for the remainder of the steps.

        echo "This is the content in the file." > /home/ftp_client/testfile.txt

1. Simulate a VSFTPD remote host connection by connecting to your system's localhost.

        ftp localhost

    Fill in the information requested by the FTP client:

    {{< output >}}
Name: ftp_client
Password: $PASSWORD
    {{</ output >}}

1. Verify that the sample file `testfile.txt` passed through FTP and made its way to the directory, `/home/ftp_client/`.

        ls /home/ftp_client

1. You now see:

    {{< output >}}
testfile.txt
    {{</ output >}}

    At its most basic, you now see how VSFTPD works.  You can also establish network connections, and add more sophisticated account management, encryption, and security restrictions, as the next sections illustrate.

## How to Restart VSFTPD

Restart the service with the `systemctl restart vsftpd` command. This command stops then starts the service. Restarting is important because each time VSFTPD starts, it configures itself using its current configuration files. When you want to update VSFTPD's configuration, the way to do so is a two-step process:

1. Edit the configuration file; and

1. Restart VSFTPD:

        systemctl restart vsftpd

## VSFTPD's Configuration File

As its name promises, one of VSFTPD's goals is security. It offers a wide range of settings to help match a range of security and business requirements. The [official manual page](http://vsftpd.beasts.org/vsftpd_conf.html) on the subject of configuration outlines all the possibilities. This section introduces what's most important for you to know about configuration as you first use VSFTPD.

In Ubuntu and other common distributions, VSFTPD's configuration appears to be located in the following location: `/etc/vsftpd.conf`.

Before you do anything else with the configuration, back it up by making a copy:

    sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.bak

### VSFTPD User Permissions

VSFTPD's default configuration emphasizes security. To make VSFTPD useful for any real-world situation, you need to adjust at least a couple of its defaults.

Start by blocking anonymous access, enabling authentication through your server's account system, enabling uploads, and restricting access to the local user's `$HOME`. Update the `/etc/vsftpd.conf` file so that the specific attributes shown below have the specified `YES` and `NO` values.

{{< file "/etc/vsftpd.conf" >}}
...
anonymous_enable=NO
local_enable=YES
write_enable=YES
allow_writeable_chroot=YES
...
{{</ file >}}

Restart the VSFTPD as explained above.

    systemctl restart vsftpd

Another common variation in working with user accounts is to adjust VSFTPD's `userlist_*` attributes so that the server allows only a selected subset of local accounts to log into FTP sessions.

### VSFTPD Log File

VSFTPD logs its actions. The default location of the log file is: `/var/log/vsftpd.log`. The configuration attribute `xferlog_file` controls this location. View its content from time to time to understand the information the logfile preserves:

    more /var/log/vsftpd.log

## Uploading with VSFTPD

1. The `get test_file.txt` example above illustrates how to **read** a file served by VSFTPD. The permissions in place make it possible to **write** or **upload** a file through VSFTPD. Create an example file:

        cd /tmp
        echo "This is sample content for uploading through FTP." > test_file2.txt

1. Log in to FTP as before, supplying account name and password when asked:

        ftp localhost

1. While within the FTP session, upload the file just created:

        put test_file2.txt

1. Exit the FTP session:

        quit

1. Verify that the sample file `test_file2.txt` passed through FTP and made its way to the home directory of the `ftp_client` user:

        ls /home/ftp_client

1. You should see a similar output:

    {{< output >}}
testfile.txt testfile2.txt
    {{</ output >}}

Your basic VSFTPD installation can read the content on the VSFTPD host, and it can upload content to the VSFTPD host.

## Connect to Your Server using VSFTPD

To open your server up to connections from remote clients that connect to VSFTPD, follow the steps in this section.

Ubuntu's default built-in firewall blocks FTP traffic. Open the firewall to allow desired FTP traffic by creating an exception in UFW (uncomplicated firewall) with the commands:

    sudo ufw allow from any to any port 20,21 proto tcp
    sudo ufw disable
    sudo ufw enable

Use any convenient FTP client on your desktop to connect to the VSFTPD server you've configured at the address `ftp://ftp_client@IP_Address`.

## Conclusion

The list below contains some additional configurations you may consider depending on how you use your VSFTPD server:

- Is it advisable to disable VSFTPD's ability to "shell out" to its host operating system?
- Do you need to encrypt VSFTPD's communications?
- Should any user account on the VSFTPD server be authorized to connect, or is it better to restrict access to a reduced list?
- Does your FTP use case have a role for anonymous access?

Whatever the answers to these questions, their implementation involves the same configuration and connection techniques used in this guide.
