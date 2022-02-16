---
slug: set-up-and-secure
author:
  name: Linode
  email: docs@linode.com
description: "This guide serves as a starting point for securing your Linode, including user accounts, firewall configuration, SSH, and disabling unused network services."
keywords: ["security", "secure", "firewall", "ssh", "add user", "quick start"]
tags: ["ssh","security"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/securing-your-server/','/security/linux-security-basics/','/security/basics/','/security/securing-your-server/index.cfm/','/security/basics/securing-your-server/','/security/securing-your-server/','/guides/securing-your-server/']
modified: 2022-02-16
modified_by:
  name: Linode
published: 2012-02-17
title: "Set Up and Secure a Linode Compute Instance"
h1_title: "Setting Up and Securing a Compute Instance"
enable_h1: true
---

After you have successfully created a Compute Instance, there are a few initial configuration steps you should perform within your new Linux system. This includes updating your system, setting the timezone, configuring a custom hostname, adding a limited user, hardening SSH to prevent unauthorized access, and configuring a firewall. These steps ensure your instance is update to date, secure, and ready for use.

{{<note>}}
Each workflow discussed in this guide is entirely optional. Once you create a Compute Instance, you can begin using it without following these instructions. That said, this guide walks you through best practices and important steps to secure your server and ensure it's operating as you intend.
{{</note>}}

1. [View your Instance in the Cloud Manager](#view-your-instance-in-the-cloud-manager)
1. [Connect to the Instance](#connect-to-the-instance)
1. [Perform System Updates](#perform-system-updates)
1. [Set the Timezone](#set-the-timezone)
1. [Configure a Custom Hostname](#configure-a-custom-hostname)
1. [Add a Limited User Account](#add-a-limited-user-account)
1. [Harden SSH Access](#harden-ssh-access)
1. [Configure a Firewall](#configure-a-firewall)
1. [Common Lockout Recovery Steps](#common-lockout-recovery-steps)

## Before You Begin

If you haven't done so already, review the following guides to learn more about using Linode and Compute Instances.

- [Getting Started with Linode](/docs/guides/getting-started/)
- [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/)
- [Linode Beginner's Guide](/docs/guides/linode-beginners-guide/)

## View your Instance in the Cloud Manager

Log in to the [Cloud Manager](https://cloud.linode.com/), click the **Linodes** link in the left menu, and select your Compute Instance from the list. This opens the details page for that instance, which allows you to view key information and further configure it to your meet your needs.

![Details page in Cloud Manager](create-instance-details.png)

## Connect to the Instance

Once the Compute Instance has been created and is done initializing, you can start connecting to it over Weblish, Lish, or SSH. Communicating with your Linode is usually done using the SSH protocol, though you can use Weblish (through your browser) or Lish (through SSH) as an alternative means of connecting.

-   **Weblish (via the Cloud Manager):** Click the **Launch LISH Console** link at the top right corner of the Compute Instance's detail page. See [Using the Lish Console > Through a Browser](/docs/guides/using-the-lish-console/#through-the-cloud-manager-weblish).

-   **Lish (via SSH):** Copy the command from the *LISH Console via SSH* field under the **Access** section on the Compute Instance's detail page (see screenshot above) and paste it into your local computer's terminal. The command should look similar to the one below, only with your username, data center, and Linode label. Review [Using the Lish Console > Through SSH](/docs/guides/using-the-lish-console/#through-ssh-using-a-terminal) for more instructions.

        ssh -t user@lish-newark.linode.com Example-Linode

-   **SSH:** Copy the command from the *LISH Console via SSH* field under the **Access** section on the Compute Instance's detail page (see screenshot above) and paste it into your local computer's terminal. The command should look similar to the following, only with the IP address of your newly created instance.

        ssh root@192.0.2.1

    - **Windows:** Windows 10 and 11 users can connect to their Linode using the [Command Prompt (or PowerShell)](/docs/guides/connect-to-server-over-ssh-on-windows/#command-prompt-or-powershell---windows-10-or-11) application, provided their system is fully updated. For users of Windows 8 and earlier, [Secure Shell on Chrome](/docs/guides/connect-to-server-over-ssh-on-chrome/), [PuTTY](/docs/guides/connect-to-server-over-ssh-using-putty/), or many other third party tools can be used instead. See [Connecting to a Remote Server Over SSH on Windows](/docs/guides/connect-to-server-over-ssh-on-windows/).
    - **macOS:** The *Terminal* application is pre-installed on macOS. See [Connecting to a Remote Server Over SSH on a Mac](/docs/guides/connect-to-server-over-ssh-on-mac/).
    - **Linux:** You can use a terminal window, regardless of desktop environment or window manager. See [Connecting to a Remote Server Over SSH on Linux](/docs/guides/connect-to-server-over-ssh-on-linux/)

## Perform System Updates

Updating your system frequently is the single biggest security precaution you can take for any operating system. Software updates range from critical vulnerability patches to minor bug fixes and many software vulnerabilities are actually patched by the time they become public. Updating also provides you with the latest software versions available for your distribution.

### Ubuntu and Debian

    apt update && apt upgrade

{{< note >}}
You may be prompted to make a menu selection when the Grub package is updated on Ubuntu. If prompted, select `keep the local version currently installed`.
{{< /note >}}

### CentOS/RHEL Stream and Fedora

*This includes CentOS Stream (and 8), other RHEL derivatives (including AlmaLinux 8, and Rocky Linux 8), and Fedora.*

    dnf upgrade

### Other Distributions

#### Alpine

    apk update && apk upgrade

#### Arch Linux

    pacman -Syu

#### CentOS 7

    yum update

#### Gentoo

    emaint sync -a

After running a sync, it may end with a message that you should upgrade Portage using a `--oneshot` emerge command. If so, run the Portage update. Then update the rest of the system:

    emerge -uDU --keep-going --with-bdeps=y @world

#### OpenSUSE

    zypper update

#### Slackware

    slackpkg update
    slackpkg upgrade-all

## Set the Timezone

All new Linodes are set to UTC time by default. However, you may prefer your Linode use the time zone which you live in so log file timestamps are relative to your local time.

### Most Distributions

*This includes CentOS 7 (and newer), other RHEL derivatives (including AlmaLinux 8, and Rocky Linux 8), Fedora, and Arch. These instructions also work for most Ubuntu, Debian, and OpenSuse distributions, though other methods may be preferred in those cases.*

1.  Use `timedatectl` to output a list of available timezones.

        timedatectl list-timezones

1.  Use the arrow keys, `Page Up`, and `Page Down` to navigate. Copy the time zone you want as a mouse selection. Then press **q** to exit the list.

1.  Set the time zone (for example, `America/New_York`).

        timedatectl set-timezone 'America/New_York'

### Ubuntu and Debian

The instructions under the [Most Distributions](#most-distributions-1) section above (which outlines the `timedatectl` command) are valid. That said, both Ubuntu and Debian come with a more friendly tool called `tzdata`, outlined below.

1.  Open the `tzdata` tool.

        dpkg-reconfigure tzdata

1.  Select the continent of your choice using the arrow keys and press **Enter**.
1.  Select your region using the arrow keys and press **Enter**.

### Other Distributions

#### Alpine

1.  Use the [setup-timezone](https://wiki.alpinelinux.org/wiki/Alpine_setup_scripts#setup-timezone) command to initiate the timezone selection process:

        setup-timezone

1.  Enter the timezone you are located within. If you aren't sure of the timezone string to use, enter `?` to display a list of available timezones

1.  If you selected a region with sub-timezones, enter `?` again to see a list of available sub-timezones and then enter the sub-timezone you are located within.

#### Gentoo

1.  View a list of available time zones.

        ls /usr/share/zoneinfo

1.  Write the selected time zone to `/etc/timezone` (for example, EST for Eastern Standard Time).

        echo "EST" > /etc/timezone

1.  Configure the `sys-libs/timezone-data` package, which sets `/etc/localtime`.

        emerge --config sys-libs/timezone-data

#### OpenSUSE

The instructions under the [Most Distributions](#most-distributions-1) section above (which outlines the `timedatectl` command) are valid. OpenSuse also has a more friendly way to select a timezone, discussed below.

1.  Open the YaST2 timezone selector tool.

        yast2 timezone

1.  Use the arrow keys to select your region within the *Region* pane.

1.  Press **tab** to switch to the *Time Zone* pane and then use the arrow keys to select your time zone or sub-region.

1. Press **F10** to save the changes. Alternatively, press **tab** until the `[OK]` text button is highlighted. Then press **enter**.

#### Slackware

1.  Run the `timeconfig` tool.

        timeconfig

1.  Select `NO Hardware clock is set to local time`.
1.  Select a timezone.

### Check the Time

Use the `date` command to view the current date and time according to your server.

{{< output >}}
root@localhost:~# date
Thu Feb 16 12:17:52 EST 2018
{{< /output >}}

## Configure a Custom Hostname

A hostname is used to identify your Linode using an easy-to-remember name. Your Linode's hostname doesn't necessarily associate with websites or email services hosted on the system, but see our guide on using the [hosts file](/docs/networking/dns/using-your-systems-hosts-file/) if you want to assign your Linode a fully qualified domain name.

 Your hostname should be something unique, and should not be *www* or anything too generic. Some people name their servers after planets, philosophers, or animals. After you've made the change below, you may need to log out and log back in again to see the terminal prompt change from `localhost` to your new hostname. The command `hostname` should also show it correctly.

### Most Distributions

*This includes Ubuntu 16.04 (and newer), CentOS 7 (and newer), other RHEL derivatives (including AlmaLinux 8 and Rocky Linux 8), Debian 8 (and newer), Fedora, OpenSuse, and Arch.*

Replace `example-hostname` with one of your choice.

    hostnamectl set-hostname example-hostname

### Other Distributions

#### Alpine

See [Update Your Systems hosts File](#update-your-systems-hosts-file).

#### Gentoo

    echo "HOSTNAME=\"example-hostname\"" > /etc/conf.d/hostname
    /etc/init.d/hostname restart

#### Slackware

    echo "example-hostname" > /etc/HOSTNAME
    hostname -F /etc/HOSTNAME

### Update Your System's `hosts` File

The `hosts` file creates static associations between IP addresses and hostnames or domains which the system prioritizes before DNS for name resolution. Open this file in a text editor and add a line for your Linode's public IP address. You can associate this address with your Linode's **Fully Qualified Domain Name** (FQDN) if you have one, and with the local hostname you set in the steps above. In the example below, `203.0.113.10` is the public IP address, `example-hostname` is the local hostname, and `example-hostname.example.com` is the FQDN.

{{< file "/etc/hosts" >}}
127.0.0.1 localhost.localdomain localhost
203.0.113.10 example-hostname.example.com example-hostname
{{< /file >}}

Add an entry for your Linode's IPv6 address. Applications requiring IPv6 will not work without this entry:

{{< file "/etc/hosts" >}}
127.0.0.1 localhost.localdomain localhost
203.0.113.10 example-hostname.example.com example-hostname
2600:3c01::a123:b456:c789:d012 example-hostname.example.com example-hostname
{{< /file >}}

The value you assign as your system's FQDN should have an "A" record in DNS pointing to your Linode's IPv4 address. For IPv6, you should also set up a DNS "AAAA" record pointing to your Linode's IPv6 address.

See our guide to [Adding DNS Records](/docs/guides/dns-manager/) for more information on configuring DNS. For more information about the `hosts` file, see [Using your System's hosts File](/docs/networking/dns/using-your-systems-hosts-file/)

## Add a Limited User Account

Up to this point, you have accessed your Linode as the `root` user, which has unlimited privileges and can execute *any* command--even one that could accidentally disrupt your server. We recommend creating a limited user account and using that at all times. Administrative tasks will be done using `sudo` to temporarily elevate your limited user's privileges so you can administer your server.

{{< note >}}
Not all Linux distributions include `sudo` on the system by default, but all the images provided by Linode have sudo in their package repositories. If you get the output `sudo: command not found`, install sudo before continuing.
{{< /note >}}

To add a new user, first [log in to your Linode](/docs/getting-started/#log-in-for-the-first-time) via SSH.

### CentOS/RHEL Stream and Fedora

1.  Create the user, replacing `example_user` with your desired username, and assign a password:

        useradd example_user && passwd example_user

2.  Add the user to the `wheel` group for sudo privileges:

        usermod -aG wheel example_user

### Ubuntu and Debian

A standard Debian Server installation does not include `sudo` by default, but Linode packages it in our Debian images. If you don't already have `sudo`, you'll need to install it before going further.

1.  Create the user, replacing `example_user` with your desired username. You'll then be asked to assign the user a password:

        adduser example_user

2.  Add the user to the `sudo` group so you'll have administrative privileges:

        adduser example_user sudo

### Log in as the New User

3.  After creating your limited user, disconnect from your Linode:

        exit

4.  Log back in as your new user. Replace `example_user` with your username, and the example IP address with your Linode's IP address:

        ssh example_user@203.0.113.10

Now you can administer your Linode from your new user account instead of `root`. Nearly all superuser commands can be executed with `sudo` (example: `sudo iptables -L -nv`) and those commands will be logged to `/var/log/auth.log`.

## Harden SSH Access

By default, password authentication is used to connect to your Linode via SSH. A cryptographic key-pair is more secure because a private key takes the place of a password, which is generally much more difficult to brute-force. In this section we'll create a key-pair and configure the Linode to not accept passwords for SSH logins.

### Create an Authentication Key-pair

{{< note >}}
As of Autumn 2018, [OpenSSH](https://www.openssh.com/) has been added to Windows 10, simplifying the process for securing SSH. **Windows 10** in this guide assumes OpenSSH has been installed as part of this update, while **Earlier Windows Versions** would apply to earlier versions.
{{< /note >}}

1.  This is done on your local computer, **not** your Linode, and will create a 4096-bit RSA key-pair. During creation, you will be given the option to encrypt the private key with a passphrase. This means that it cannot be used without entering the passphrase, unless you save it to your local desktop's keychain manager. We suggest you use the key-pair with a passphrase, but you can leave this field blank if you don't want to use one.

    **Linux / OS X / Windows 10**

    {{< caution >}}
If you've already created an RSA key-pair, this command will overwrite it, potentially locking you out of other systems. If you've already created a key-pair, skip this step. To check for existing keys, run `ls ~/.ssh/id_rsa*`.
{{< /caution >}}

        ssh-keygen -b 4096

    Press **Enter** to use the default names `id_rsa` and `id_rsa.pub` before entering your passphrase. On Linux and OS X, these files will be saved in the `/home/your_username/.ssh` directory. On Windows, they will be saved in `C:\Users\MyUserName\.ssh`

    **Earlier Windows Versions**

    This can be done using PuTTY as outlined in our guide: [Use Public Key Authentication with SSH](/docs/security/authentication/use-public-key-authentication-with-ssh/#windows-operating-system).

2.  Upload the public key to your Linode. Replace `example_user` with the name of the user you plan to administer the server as, and `203.0.113.10` with your Linode's IP address.

    **Linux**

    From your local computer:

        ssh-copy-id example_user@203.0.113.10

    **OS X**

    On your Linode (while signed in as your limited user):

        mkdir -p ~/.ssh && sudo chmod -R 700 ~/.ssh/

    From your local computer:

        scp ~/.ssh/id_rsa.pub example_user@203.0.113.10:~/.ssh/authorized_keys

    {{< note >}}
`ssh-copy-id` is available in [Homebrew](http://brew.sh/) if you prefer it over SCP. Install with `brew install ssh-copy-id`.
{{< /note >}}

    **Windows 10**

    On your Linode (while signed in as your limited user):

        mkdir -p ~/.ssh && sudo chmod -R 700 ~/.ssh/

    From your local computer:

        scp C:\Users\MyUserName\.ssh/id_rsa.pub example_user@203.0.113.100:~/.ssh/authorized_keys
    **Earlier Windows Versions**
    - **Option 1:** This can be done using [WinSCP](http://winscp.net/). In the login window, enter your Linode's public IP address as the hostname, and your non-root username and password. Click *Login* to connect.

        Once WinSCP has connected, you'll see two main sections. The section on the left shows files on your local computer and the section on the right shows files on your Linode. Using the file explorer on the left, navigate to the file where you've saved your public key, select the public key file, and click *Upload* in the toolbar above.

        You'll be prompted to enter a path where you'd like to place the file on your Linode. Upload the file to `/home/example_user/.ssh/authorized_keys`, replacing `example_user` with your username.

    -   **Option 2:** Copy the public key directly from the PuTTY key generator into the terminal emulator connected to your Linode (as a non-root user):

            mkdir ~/.ssh; nano ~/.ssh/authorized_keys

        The above command will open a blank file called `authorized_keys` in a text editor. Copy the public key into the text file, making sure it is copied as a single line exactly as it was generated by PuTTY. Press **CTRL+X**, then **Y**, then **Enter** to save the file.

    Finally, you'll want to set permissions for the public key directory and the key file itself:

        sudo chmod -R 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys

    These commands provide an extra layer of security by preventing other users from accessing the public key directory as well as the file itself. For more information on how this works, see our guide on [how to modify file permissions](/docs/tools-reference/tools/modify-file-permissions-with-chmod/).

3.  Now exit and log back into your Linode. If you specified a passphrase for your private key, you'll need to enter it.

### SSH Daemon Options

1.  **Disallow root logins over SSH.** This requires all SSH connections be by non-root users. Once a limited user account is connected, administrative privileges are accessible either by using `sudo` or changing to a root shell using `su -`.

    {{< file "/etc/ssh/sshd_config" aconf >}}
# Authentication:
...
PermitRootLogin no

{{< /file >}}

1.  **Disable SSH password authentication.** This requires all users connecting via SSH to use key authentication. Depending on the Linux distribution, the line `PasswordAuthentication` may need to be added, or uncommented by removing the leading `#`.

    {{< file "/etc/ssh/sshd_config" aconf >}}
# Change to no to disable tunnelled clear text passwords
PasswordAuthentication no

{{< /file >}}

    {{< note >}}
You may want to leave password authentication enabled if you connect to your Linode from many different computers. This will allow you to authenticate with a password instead of generating and uploading a key-pair for every device.
    {{< /note >}}

1.  **Listen on only one internet protocol.** The SSH daemon listens for incoming connections over both IPv4 and IPv6 by default. Unless you need to SSH into your Linode using both protocols, disable whichever you do not need. *This does not disable the protocol system-wide, it is only for the SSH daemon.* Depending on the Linux distribution, the line `AddressFamily` may need to be added, or uncommented by removing the leading `#`

    Use the option:

    *   `AddressFamily inet` to listen only on IPv4.
    *   `AddressFamily inet6` to listen only on IPv6.

    {{< file "/etc/ssh/sshd_config" aconf >}}
# Port 22
AddressFamily inet

{{< /file >}}


1.  Restart the SSH service to load the new configuration.

    If you’re using a Linux distribution which uses systemd (CentOS 7, Debian 8, Fedora, Ubuntu 15.10+)

        sudo systemctl restart sshd

    If your init system is SystemV or Upstart (CentOS 6, Debian 7, Ubuntu 14.04):

        sudo service sshd restart

### Use Fail2Ban for SSH Login Protection

[*Fail2Ban*](http://www.fail2ban.org/wiki/index.php/Main_Page) is an application that bans IP addresses from logging into your server after too many failed login attempts. Since legitimate logins usually take no more than three tries to succeed (and with SSH keys, no more than one), a server being spammed with unsuccessful logins indicates attempted malicious access.

Fail2Ban can monitor a variety of protocols including SSH, HTTP, and SMTP. By default, Fail2Ban monitors SSH only, and is a helpful security deterrent for any server since the SSH daemon is usually configured to run constantly and listen for connections from any remote IP address.

For complete instructions on installing and configuring Fail2Ban, see our guide: [A Tutorial for Using Fail2ban to Secure Your Server](/docs/security/using-fail2ban-to-secure-your-server-a-tutorial/).

## Configure a Firewall

{{< content "cloud-firewall-shortguide" >}}

Using a *firewall* to block unwanted inbound traffic to your Linode provides a highly effective security layer. By being very specific about the traffic you allow in, you can prevent intrusions and network mapping. A best practice is to allow only the traffic you need, and deny everything else. See our documentation on some of the most common firewall applications:

- [Iptables](/docs/security/firewalls/control-network-traffic-with-iptables/) is the controller for netfilter, the Linux kernel's packet filtering framework. Iptables is included in most Linux distributions by default.

- [FirewallD](/docs/security/firewalls/introduction-to-firewalld-on-centos/) is the iptables controller available for the CentOS / Fedora family of distributions.

- [UFW](/docs/security/firewalls/configure-firewall-with-ufw/) provides an iptables frontend for Debian and Ubuntu.

## Common Lockout Recovery Steps

If for whatever reason you find yourself locked out of your Linode after putting your security controls into place, there are still a number of ways that you can regain access to your Linode.

- Access your Linode through our out-of-band [Lish console](/docs/guides/using-the-lish-console/) to regain access to the internals of your Linode without relying on SSH.

-   If you need to re-enable password authentication and/or root login over ssh to your Linode, you can do this by reversing the following sections of this file to reflect these changes

    {{< file "/etc/ssh/sshd_config" aconf >}}
# Authentication:
...
PermitRootLogin yes
...
PasswordAuthentication yes
{{< /file >}}

    From there, you just need to restart SSH.

    If you’re using a Linux distribution which uses systemd (CentOS 7, Debian 8, Fedora, Ubuntu 15.10+)

        sudo systemctl restart sshd

    If your init system is SystemV or Upstart (CentOS 6, Debian 7, Ubuntu 14.04):

        sudo service sshd restart

-   If you need to remove your public key from your Linode, you can enter the following command:

        rm ~/.ssh/authorized_keys

    You can then replace your key by re-following the [Create an Authentication Key-pair](/docs/security/securing-your-server/#create-an-authentication-key-pair) section of this guide.

## Next Steps

These are the most basic steps to harden any Linux server, but further security layers will depend on its intended use. Additional techniques can include application configurations, using [intrusion detection](/docs/uptime/monitoring/ossec-ids-debian-7/), installing a form of [access control](https://en.wikipedia.org/wiki/Access_control#Access_Control), [fine tuning sudo access](/docs/tools-reference/linux-users-and-groups/#understanding-sudo), [removing exposed services](/docs/guides/remove-unused-network-facing-services), and [more](/docs/security/).

Now you can begin setting up your Linode for any purpose you choose. We have a library of documentation to assist you with a variety of topics ranging from [migration from shared hosting](/docs/migrate-to-linode/migrate-from-shared-hosting) to [enabling two-factor authentication](/docs/security/linode-manager-security-controls) to [hosting a website](/docs/websites/hosting-a-website).
