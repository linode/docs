---
slug: enable-ssh-ubuntu
description: 'Want to learn how to enable SSH on Ubuntu? Read our guide to learn what SSH is and how you can install SSH on Ubuntu 20.04 LTS. ✓ Click here!'
keywords: ['enable SSH ubuntu','ubuntu enable SSH','ubuntu SSH','install SSH ubuntu','ubuntu install SSH','enable SSH ubuntu 20.04','ubuntu install SSH server','SSH ubuntu','ubuntu enable SSH server','install SSH server ubuntu']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-08
modified_by:
  name: Linode
title: "How to Enable SSH on Ubuntu 20.04 LTS"
title_meta: "Step-by-Step Guide: How to Enable SSH on Ubuntu"
external_resources:
- '[Ubuntu Server Documentation](https://ubuntu.com/server/docs/service-openssh)'
authors: ["Tom Henderson"]
---

On Linode's Ubuntu 20.04 LTS instances, the installation of `ssh` (client) and `sshd` (server) takes place when the instance is first started. The instructions that follow are to install the SSH if previously removed, or if a non-Linode installation is used. These instructions check if SSH services are correctly started on an Ubuntu instance. If `ssh` or `sshd` is not installed, instructions are supplied on how SSH (as OpenSSH) is installed on Ubuntu 20.04 LTS.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What is SSH?

The Secure SHell protocol securely connects two hosts using authentication. The SSH connection between hosts is requested by an SSH client (or application). The SSH client is usually used to achieve shell/terminal sessions on another host running the SSH server. SSH client connection services can be called by other applications for use as an authenticated and encrypted network between hosts.

The SSH server manages the communications services for client requests. These could be a shell/terminal access to the host running the SSH server software, or other applications such as `scp` or `rsync`.

All Linode Ubuntu instances contain the SSH client software and an SSH server. The SSH server is dormant, and must be enabled. Upon each Linode Ubuntu 20.04 LTS initial provisioning, keys for the SSH client are generated, making the SSH client application immediately available for use.

The SSH client and the SSH server are two different programs. At system boot time, the SSH server starts, listens continuously for connections, and is controlled by an application that manages always-on applications, called `systemd`. The SSH client program is started only when used, and can be left on. It is usually terminated when a user session is over, or when an application using SSH client-to-server connectivity is finished. This is for security and resource conservation reasons. An application that uses SSH usually terminates the SSH client/server connection when the application’s work is done. The SSH server, however, continues to listen for connections until it’s actively disabled.

An SSH connection is encrypted and authenticated each time it’s used. An application that uses the SSH connection is therefore also encrypted and requires authentication each time it’s used. Each time the SSH connection is called from the script, it requires encryption and authentication to establish a connection between the two hosts.

There are two different SSH configuration files. One is for client use, while the other is for server use. The options are different between the two configuration files.

## Step One: Check Status

Checking the status of the SSH server requires using `systemctl` to query the status of the SSH server. On Linode Ubuntu 20.04 LTS instances, the server is installed when the instance is initially powered up/installed. Use the Lish or GLISH console to check the status, or log in from an externally connected SSH client.

To check the status of the SSH server:

```command
sudo systemctl status SSH
```

The status should appear:

```output
● ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; vendor preset: e>
    Drop-In: /etc/systemd/system/ssh.service.d
             └─linode.conf
     Active: active (running) since Wed 2023-03-01 14:03:18 EST; 2h 12min ago
       Docs: man:sshd(8)
             man:sshd_config(5)
   Main PID: 708 (sshd)
      Tasks: 1 (limit: 4611)
     Memory: 6.0M
     CGroup: /system.slice/ssh.service
             └─708 sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups
```

The above information shows the running status of the `SSHd` service, which is the SSH server.

If not shown as above, start the service using the following command:

```command
sudo systemctl enable ssh
```

If the service replies with a "Unit SSH.service could not be found", install it as instructed in Step Two. Skip to Step Three if your SSH server is already enabled.

## Step Two: Optionally Install OpenSSH

Where a non-Linode Ubuntu 20.04 LTS is used, install and enable OpenSSH for SSH services. OpenSSH is available from Ubuntu’s default repositories. Installation requires a root or sudo-enabled user account, and a connection to the Internet or a local Ubuntu repository. When using Linode, you can use an Internet repository which requires no action to use with the commands below. The `apt` application causes the openSSH installer to generate and install public/private encryption key pairs. Keys are a string of text used to encrypt and authenticate the conversation between an SSH client and an SSH server.

1.  Make sure the system us up-to-date Before installing OpenSSH:

    ```command
    sudo apt update && sudo apt upgrade -y
    ```

1.  Enter the following command to install OpenSSH:

    ```command
    sudo apt install openssh-server openssh-client
    ```

1.  Now start the server:

    ```command
    sudo systemctl enable ssh
    ```

1.  Check the status of the newly installed server:

    ```command
    sudo systemctl status ssh
    ```

## Step Three: Customization Options

### Configuration Files

There are two different configuration files for SSH: One for client configuration and one for server configuration. Both user and host configuration file options are overridden by any SSH command-line option invoked.

Client configuration files are found in two places. The client configuration file for the current user is located in `~/.SSH/config`, while the host SSH configuration file is located in `/etc/SSH/SSH_config`.

It’s suggested to harden the OpenSSH server [immediately after installation or before first use](https://www.linode.com/docs/guides/advanced-ssh-server-security/).

Additional software can be used to harden SSH servers and protect against various authentication attacks. One such application, [fail2ban](https://www.linode.com/docs/guides/how-to-use-fail2ban-for-ssh-brute-force-protection/), adds a layer of protection to applications like SSH and other commonly used Linux applications.

## Summary

Linode's Ubuntu 20.04 LTS instances already have the SSH client software installed and enabled. If not installed, OpenSSH is simple to install, and is enabled using `systemctl`.
