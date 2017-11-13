---
author:
  name: Chris Walsh
  email: docs@linode.com
description: 'This guide covers basic best practices for securing a production server, including setting up user accounts,  configuring a firewall, securing SSH, and disabling unused network services.'
og_description: 'This guide serves as a starting point from which to secure your Linode against unauthorized access and includes topics such as user account set up, configuring a firewall, securing SSH, and disabling unused network services.'
keywords: ["security", "secure", "firewall", "ssh", "add user", "quick start"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['securing-your-server/','security/linux-security-basics/','security/basics/','security/securing-your-server/index.cfm/']
modified: 2017-10-27
modified_by:
  name: Linode
published: 2012-02-17
title: How to Secure Your Server
---

In the [Getting Started](/docs/getting-started) guide, you learned how to deploy a Linux distribution, boot your Linode and perform basic administrative tasks. Now it's time to harden your Linode against unauthorized access.

<div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><iframe src="//fast.wistia.net/embed/iframe/971o40zba8?videoFoam=true" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="100%" height="100%"></iframe></div></div>
<script src="//fast.wistia.net/assets/external/E-v1.js" async></script>

## Update Your System--Frequently

Keeping your software up to date is the single biggest security precaution you can take for any operating system. Software updates range from critical vulnerability patches to minor bug fixes, and many software vulnerabilities are actually patched by the time they become public.

### Automatic Security Updates

There are arguments for and against automatic updates on servers. [Fedora's Wiki](https://fedoraproject.org/wiki/AutoUpdates#Why_use_Automatic_updates.3F) has a good breakdown of the pros and cons, but the risk of automatic updates will be minimal if you limit them to security updates. Not all package managers make that easy or possible, though.

The practicality of automatic updates is something you must judge for yourself because it comes down to what *you* do with your Linode. Bear in mind that automatic updates apply only to packages sourced from repositories, not self-compiled applications. You may find it worthwhile to have a test environment that replicates your production server. Updates can be applied there and reviewed for issues before being applied to the live environment.

* CentOS uses *[yum-cron](https://fedoraproject.org/wiki/AutoUpdates#Fedora_21_or_earlier_versions)* for automatic updates.

* Debian and Ubuntu use *[unattended upgrades](https://help.ubuntu.com/lts/serverguide/automatic-updates.html)*.

* Fedora uses *[dnf-automatic](https://dnf.readthedocs.org/en/latest/automatic.html)*.

## Add a Limited User Account

Up to this point, you have accessed your Linode as the `root` user, which has unlimited privileges and can execute *any* command--even one that could accidentally disrupt your server. We recommend creating a limited user account and using that at all times. Administrative tasks will be done using `sudo` to temporarily elevate your limited user's privileges so you can administer your server.

{{< note >}}
Not all Linux distributions include `sudo` on the system by default, but all the images provided by Linode have sudo in their package repositories. If you get the output `sudo: command not found`, install sudo before continuing.
{{< /note >}}

To add a new user, first [log in to your Linode](/docs/getting-started#log-in-for-the-first-time) via SSH.

### CentOS / Fedora

1.  Create the user, replacing `example_user` with your desired username, and assign a password:

        useradd example_user && passwd example_user

2.  Add the user to the `wheel` group for sudo privileges:

        usermod -aG wheel example_user

       {{< caution >}}
       In CentOS 6 a wheel group is disabled by default for sudo access. You must to configure it manually. Type from root: `/usr/sbin/visudo`. Then find the line `# %wheel` and uncomment this line. To began typing in vi, press `a`. To save and exit press `Escape`, then type `:w`(press enter), `:q`(press enter)
{{< /caution >}}

### Ubuntu

1.  Create the user, replacing `example_user` with your desired username. You'll then be asked to assign the user a password:

        adduser example_user

2.  Add the user to the `sudo` group so you'll have administrative privileges:

        adduser example_user sudo

### Debian

1.  Debian does not include `sudo` by default so it must be installed:

        apt install sudo

2.  Create the user, replacing `example_user` with your desired username. You'll then be asked to assign the user a password:

        adduser example_user

3.  Add the user to the `sudo` group so you'll have administrative privileges:

        adduser example_user sudo

After creating your limited user, disconnect from your Linode:

    exit

Log back in as your new user. Replace `example_user` with your username, and the example IP address with your Linode's IP address:

    ssh example_user@203.0.113.10

Now you can administer your Linode from your new user account instead of `root`. Nearly all superuser commands can be executed with `sudo` (example: `sudo iptables -L -nv`) and those commands will be logged to `/var/log/auth.log`.

## Harden SSH Access

By default, password authentication is used to connect to your Linode via SSH. A cryptographic key-pair is more secure because a private key takes the place of a password, which is generally much more difficult to brute-force. In this section we'll create a key-pair and configure the Linode to not accept passwords for SSH logins.

### Create an Authentication Key-pair

1.  This is done on your local computer, **not** your Linode, and will create a 4096-bit RSA key-pair. During creation, you will be given the option to encrypt the private key with a passphrase. This means that it cannot be used without entering the passphrase, unless you save it to your local desktop's keychain manager. We suggest you use the key-pair with a passphrase, but you can leave this field blank if you don't want to use one.

    **Linux / OS X**

    {{< caution >}}
If you've already created an RSA key-pair, this command will overwrite it, potentially locking you out of other systems. If you've already created a key-pair, skip this step. To check for existing keys, run `ls ~/.ssh/id_rsa*`.
{{< /caution >}}

        ssh-keygen -b 4096

    Press **Enter** to use the default names `id_rsa` and `id_rsa.pub` in `/home/your_username/.ssh` before entering your passphrase.

    **Windows**

    This can be done using PuTTY as outlined in our guide: [Use Public Key Authentication with SSH](/docs/security/use-public-key-authentication-with-ssh#windows-operating-system).

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

    **Windows**

    - **Option 1**: This can be done using [WinSCP](http://winscp.net/). In the login window, enter your Linode's public IP address as the hostname, and your non-root username and password. Click *Login* to connect.

      Once WinSCP has connected, you'll see two main sections. The section on the left shows files on your local computer and the section on the right shows files on your Linode. Using the file explorer on the left, navigate to the file where you've saved your public key, select the public key file, and click *Upload* in the toolbar above.

      You'll be prompted to enter a path where you'd like to place the file on your Linode. Upload the file to `/home/example_user/.ssh/authorized_keys`, replacing `example_user` with your username.

    - **Option 2:** Copy the public key directly from the PuTTY key generator into the terminal emulator connected to your Linode (as a non-root user):

          mkdir ~/.ssh; nano ~/.ssh/authorized_keys

      The above command will open a blank file called `authorized_keys` in a text editor. Copy the public key into the text file, making sure it is copied as a single line exactly as it was generated by PuTTY. Press **CTRL+X**, then **Y**, then **Enter** to save the file.

    Finally, you'll want to set permissions for the public key directory and the key file itself:

        sudo chmod 700 -R ~/.ssh && chmod 600 ~/.ssh/authorized_keys

    These commands provide an extra layer of security by preventing other users from accessing the public key directory as well as the file itself. For more information on how this works, see our guide on [how to modify file permissions](/docs/tools-reference/modify-file-permissions-with-chmod).

3.  Now exit and log back into your Linode. If you specified a passphrase for your private key, you'll need to enter it.

### SSH Daemon Options

1.  **Disallow root logins over SSH.** This requires all SSH connections be by non-root users. Once a limited user account is connected, administrative privileges are accessible either by using `sudo` or changing to a root shell using `su -`.


    {{< file-excerpt "/etc/ssh/sshd_config" aconf >}}
# Authentication:
...
PermitRootLogin no

{{< /file-excerpt >}}


2.  **Disable SSH password authentication.** This requires all users connecting via SSH to use key authentication. Depending on the Linux distribution, the line `PasswordAuthentication` may need to be added, or uncommented by removing the leading `#`.

    {{< file-excerpt "/etc/ssh/sshd_config" aconf >}}
# Change to no to disable tunnelled clear text passwords
PasswordAuthentication no

{{< /file-excerpt >}}


    {{< note >}}
You may want to leave password authentication enabled if you connect to your Linode from many different computers. This will allow you to authenticate with a password instead of generating and uploading a key-pair for every device.
{{< /note >}}

3.  **Listen on only one internet protocol.** The SSH daemon listens for incoming connections over both IPv4 and IPv6 by default. Unless you need to SSH into your Linode using both protocols, disable whichever you do not need. *This does not disable the protocol system-wide, it is only for the SSH daemon.*

    Use the option:

    *   `AddressFamily inet` to listen only on IPv4.
    *   `AddressFamily inet6` to listen only on IPv6.

    The `AddressFamily` option is usually not in the `sshd_config` file by default. Add it to the end of the file:

        echo 'AddressFamily inet' | sudo tee -a /etc/ssh/sshd_config

4.  Restart the SSH service to load the new configuration.

    If you’re using a Linux distribution which uses systemd (CentOS 7, Debian 8, Fedora, Ubuntu 15.10+)

        sudo systemctl restart sshd

    If your init system is SystemV or Upstart (CentOS 6, Debian 7, Ubuntu 14.04):

        sudo service ssh restart

### Use Fail2Ban for SSH Login Protection

[*Fail2Ban*](http://www.fail2ban.org/wiki/index.php/Main_Page) is an application that bans IP addresses from logging into your server after too many failed login attempts. Since legitimate logins usually take no more than three tries to succeed (and with SSH keys, no more than one), a server being spammed with unsuccessful logins indicates attempted malicious access.

Fail2Ban can monitor a variety of protocols including SSH, HTTP, and SMTP. By default, Fail2Ban monitors SSH only, and is a helpful security deterrent for any server since the SSH daemon is usually configured to run constantly and listen for connections from any remote IP address.

For complete instructions on installing and configuring Fail2Ban, see our guide: [Securing Your Server with Fail2ban](/docs/security/using-fail2ban-for-security).

## Remove Unused Network-Facing Services

Most Linux distributions install with running network services which listen for incoming connections from the internet, the loopback interface, or a combination of both. Network-facing services which are not needed should be removed from the system to reduce the attack surface of both running processes and installed packages.

### Determine Running Services

To see your Linode's running network services:

    sudo ss -lnp


The following is an example of the output given by `ss`. Note that because distributions run different services by default, your output will differ.

    {{< output >}}
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:5355            0.0.0.0:*               LISTEN      3539/systemd-resolv
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      3539/systemd-resolv
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      3913/sshd
tcp6       0      0 :::5355                 :::*                    LISTEN      3539/systemd-resolv
tcp6       0      0 :::22                   :::*                    LISTEN      3913/sshd
udp        0      0 127.0.0.53:53           0.0.0.0:*                           3539/systemd-resolv
udp        0      0 0.0.0.0:5355            0.0.0.0:*                           3539/systemd-resolv
udp6       0      0 :::5355                 :::*                                3539/systemd-resolv
Active UNIX domain sockets (only servers)
Proto RefCnt Flags       Type       State         I-Node   PID/Program name     Path
unix  2      [ ACC ]     STREAM     LISTENING     8717     1/init               /run/systemd/journal/stdout
unix  2      [ ACC ]     SEQPACKET  LISTENING     8728     1/init               /run/udev/control
unix  2      [ ACC ]     STREAM     LISTENING     8734     1/init               /run/systemd/fsck.progress
unix  2      [ ACC ]     STREAM     LISTENING     15990    3974/systemd         /run/user/0/systemd/private
unix  2      [ ACC ]     STREAM     LISTENING     13007    1/init               /run/uuidd/request
unix  2      [ ACC ]     STREAM     LISTENING     13010    1/init               /var/run/dbus/system_bus_socket
unix  2      [ ACC ]     STREAM     LISTENING     8700     1/init               /run/systemd/private
{{< /output >}}

`ss` tells us that services are running for [Remote Procedure Call](https://en.wikipedia.org/wiki/Open_Network_Computing_Remote_Procedure_Call) (rpc.statd and rpcbind), SSH (sshd), [NTPdate](http://support.ntp.org/bin/view/Main/SoftwareDownloads) (ntpd) and [Exim](http://www.exim.org/) (exim4).

#### TCP

See the **Local Address** column of the `ss` readout. The process `rpcbind` is listening on `0.0.0.0:111` and `:::111` for a foreign address of `0.0.0.0:*` or `:::*`. This means that it's accepting incoming TCP connections from other RPC clients on any external address, both IPv4 and IPv6, from any port and over any network interface. We see similar for SSH, and that Exim is listening locally for traffic from the loopback interface, as shown by the `127.0.0.1` address.

#### UDP

UDP sockets are *[stateless](https://en.wikipedia.org/wiki/Stateless_protocol)*, meaning they are either open or closed and every process's connection is independent of those which occurred before and after. This is in contrast to TCP connection states such as *LISTEN*, *ESTABLISHED* and *CLOSE_WAIT*.



### Determine Which Services to Remove

If you were to do a basic TCP and UDP [nmap](https://nmap.org/) scan of your Linode without a firewall enabled, SSH, RPC and NTPdate would be present in the result with ports open. By [configuring a firewall](#configure-a-firewall) you can filter those ports, with the exception of SSH because it must allow your incoming connections. Ideally, however, the unused services should be disabled.

* You will likely be administering your server primarily through an SSH connection, so that service needs to stay. As mentioned above, [RSA keys](/docs/security/securing-your-server/#create-an-authentication-key-pair) and [Fail2Ban](/docs/security/securing-your-server/#use-fail2ban-for-ssh-login-protection) can help protect SSH.

* An NTP daemon is one option for your server's timekeeping but there are alternatives. If you prefer a time synchronization method which does not hold open network ports, and you do not need nanosecond accuracy, then you may be interested in replacing NTPdate with [OpenNTPD](https://en.wikipedia.org/wiki/OpenNTPD).

* Exim and RPC, however, are unnecessary unless you have a specific use for them, and should be removed.


### Uninstall the Listening Services

How to remove the offending packages will differ depending on your distribution's package manager.

**Arch**

    sudo pacman -Rs package_name

**CentOS**

    sudo yum remove package_name

**Debian / Ubuntu**

    sudo apt purge package_name

**Fedora**

    sudo dnf remove package_name

Run `ss -lpn` again. You should now only see listening services for SSH (sshd) and NTP (ntpdate, network time protocol).

## Configure a Firewall

Using a *firewall* to block unwanted inbound traffic to your Linode provides a highly effective security layer. By being very specific about the traffic you allow in, you can prevent intrusions and network mapping. A best practice is to allow only the traffic you need, and deny everything else. See our documentation on some of the most common firewall applications:

*   [Iptables](/docs/security/firewalls/control-network-traffic-with-iptables) is the controller for netfilter, the Linux kernel's packet filtering framework. Iptables is included in most Linux distributions by default.

*   [FirewallD](/docs/security/firewalls/introduction-to-firewalld-on-centos) is the iptables controller available for the CentOS / Fedora family of distributions.

*   [UFW](/docs/security/firewalls/configure-firewall-with-ufw) provides an iptables frontend for Debian and Ubuntu.


## Next Steps

These are the most basic steps to harden any Linux server, but further security layers will depend on its intended use. Additional techniques can include application configurations, using [intrusion detection](https://linode.com/docs/security/ossec-ids-debian-7) or installing a form of [access control](https://en.wikipedia.org/wiki/Access_control#Access_Control).

Now you can begin setting up your Linode for any purpose you choose. We have a library of documentation to assist you with a variety of topics ranging from [migration from shared hosting](/docs/migrate-to-linode/migrate-from-shared-hosting) to [enabling two-factor authentication](/docs/security/linode-manager-security-controls) to [hosting a website](/docs/websites/hosting-a-website).
