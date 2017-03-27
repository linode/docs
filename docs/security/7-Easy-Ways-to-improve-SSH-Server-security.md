---
author:
  name: Linode Community
  email: docs@linode.com
description: '7 Easy Ways to improve SSH Server security'
keywords: 'SSH,Ubuntu,CentOS,security,2FA, server, Linux, port knock, fwknop, knockd, knockknock'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: ''
modified: ''
modified_by:
  name: Linode
title: '7 Easy Ways to improve SSH Server security'
contributor:
  name: Damaso Sanoja
  link: https://github.com/damasosanoja
external_resources:
 - '[OpenSSH](http://www.openssh.com/)'
 - '[knockd](http://zeroflux.org/projects/knock)'
 - '[knockknock](https://moxie.org/software/knockknock/)'
 - '[fwknop](http://www.cipherdyne.org/fwknop/)'
 - '[Diffie-Hellman](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

[OpenSSH](http://www.openssh.com/) is a suite of connectivity tools which sysadmins use daily to access remote servers. From a security point of view it's the "front door" for remote logins, and that's why is extremely important to harden it as much as possible.

The aim of this article is to go beyond [Securing Your Server](/docs/security/securing-your-server/) guide by means of seven easy steps that can be implemented in less than 10 minutes. This article also covers an "eighth step" which adds another extra layer of security through port knocking techniques.

**Assumptions:**

* You'll be deploying a Production Server open to the internet 24/7.
* Your primary concern is security over complexity or convenience. This point is very important be aware that more security implies, in most cases, less convenience.

## Before You Begin

1.  Complete the [Getting Started](/docs/getting-started) guide.

2.  Follow the [Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, create a basic firewall rule set and remove unnecessary network services; this guide will use `sudo` wherever possible.

3.  Log in to your Linode via SSH and check for updates using the corresponding package manager: `apt-get` (Ubuntu/Debian) or `yum` (RHEL/CentOS) .

		sudo apt-get update && sudo apt-get upgrade
		sudo yum update

4.  Make a backup of your server's `sshd_config` file.

		sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.BACKUP

## Step 1: Enforce the use of stronger Diffie-Hellman algorithm

[Diffie-Hellman](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) is the name of an asymmetric algorithm used to securely exchange cryptographic keys over public channels (like the Internet). OpenSSH uses the D-H algorithm based in a configuration file located at `/etc/ssh/moduli`. Many IT news alerted about the possibility that several nations could have broken commonly used primes which mean they can read encrypted traffic transmitted over "secure" channels.
Protecting your server against that threat is fairly simple, just edit the `/etc/ssh/moduli` file and comment the lines where the fifth field is 1023 or 1535 (approximately the first 87 lines). That forces the D-H to use keys from Group 14 (2048-bit). Higher groups mean more secure keys (less likely to be broken in near future) but also require additional time to compute.

![Enforcing a stronger Diffie-Hellman algorithm](/docs/assets/diffie_hellman_screenshot.png)

Remember to restart SSH service after changes are finished.

## Step 2: Implement SSH access control directives

Ideally, you should limit the number of users with server access to a bare minimum, fortunately, OpenSSH Access Control Directives brings an excellent mechanism to set permissions and establish restrictions to users and groups that connect to your server. 
There are four directives available executed in sequential order:

`DenyUsers`: block listed users from SSH service.
`AllowUsers`: login is allowed only for users listed in this directive.
`DenyGroups`: similar to `DenyUsers`, any user who belongs to this group(s) is blocked.
`AllowGroups`: only users part of this group(s) can access the SSH service.

The default behavior of SSH is to **allow any user to login the server**, the following access control examples shows how to filter who can access the service:

###Selectively denying users

`DenyUsers phpadmin tempuser dbuser@20.20.20.20`: the users `phpadmin` and `tempuser` have no SSH access, but the user `dbuser` is only blocked if is connecting from the specific IP address 20.20.20.20

###Selectively allowing users

`AllowUsers superadmin megauser@yourdomain.tld dbadmin@10.10.10.10`: only the users `superadmin`, `megauser` and `dbadmin` have SSH access, but `megauser` and `dbadmin` can only connect from explicit domain/IP addresses. On the other hand, `superadmin` has the necessary rights to connect from everywhere in this case.

###Custom rules example

`DenyUsers adam ben clark@148.20.57.0/24`: users `adam` and `ben` are blocked, user `clark` is blocked when connecting from specific IP range 148.20.57.0/24
`AllowUsers clark dan@192.168.5.200 eva`: the only users with SSH login access are `clark`, `dan` and `eva`, but `dan` can only connect from its local address and `clark` has the restrictions discussed in the previous directive. Only `eva` can access the server from everywhere.

To implement any of this directives just edit your server `/etc/ssh/sshd_config` as needed. Remember to restart your service after changes are done.

## Step 3: Use a strong password for key-pair phrase

In the [Securing Your Server](/docs/security/securing-your-server/) guide you're encouraged to use SSH Key Pair Authentication. This definitely is not optional if you are serious about security. But what about remote users that connect to the server with their laptops which are suceptible to be stolen or lost? Here is where protecting your private key with a strong pharase password comes in place, at least to gain time before changing the server keys. A strong password shouldn't be dictionary based, if security is your main concern, convenience of an easy to remember password isn't adecuate. OpenSSH offers an easy way to generate pseudo-random passwords, simple type:

		openssl rand -base64 32

The command will generate a 44 character long base64 encoded strong password like this:

		C4b7Yep8HGQFeG6kbnpEtrm+bg0+958xf1f85PU3/e0=

That kind of password is very hard to crack but have the obvious disadvantage of finding a viable way to use it each time you log to your server. The recommended method is to use a good password manager, because using a plain-text file for this kills the purpose of using the password in the first place. 

To add the generated password to your existing private key you can use the following command (same command is used to change a previously created password):

		ssh-keygen -p -f ~/.ssh/id_rsa

That assumes you keep your client SSH key in their default location `~/.ssh/id_rsa` you can modify the file location as needed.

An alternative to this method is the use of a [GPG smartcard](https://en.wikipedia.org/wiki/OpenPGP_card) or [YubiKey](https://www.yubico.com/products/yubikey-hardware/) which should be stored in a different place from your laptop. You can find more information about this implementation in the guide [How to use a GPG key for SSH authentication](/docs/security/gpg-key-for-ssh-authentication/)

## Step 4: Chroot users when possible

OpenSSH have a useful directive called `ChrootDirectory` that can be used in `sshd_config` to "jail" a user into any directory, similar to the behavior of `chroot_local=YES` in a ftp server. This allows sysadmins to implement an additional layer of security for those users that don't need access to all resources.

However, this strategy involves a time-consuming process to configure the "jailed" user. For the purpose of this guide we'll setup a bare enviroment with some basic commands available for the `restricted-user`.

1. Create a jailed directory in any desired location for `restricted-user`:

		sudo mkdir -p /home/chroot/restricted-user

2. Create the required `/dev` nodes using `mknod`:

		sudo mkdir -p /home/chroot/restricted-user/dev/
		sudo mknod -m 666 /home/chroot/restricted-user/dev/null c 1 3
		sudo mknod -m 666 /home/chroot/restricted-user/dev/tty c 5 0
		sudo mknod -m 666 /home/chroot/restricted-user/dev/zero c 1 5
		sudo mknod -m 666 /home/chroot/restricted-user/dev/random c 1 8

3. Establish permissions as needed for the jailed location, in this example we'll give ownership to `root`:

		sudo chown root:root /home/chroot/restricted-user
		sudo chmod 0755 /home/chroot/restricted-user

4. Create the rest of directories needed by `restricted-user`:

		sudo mkdir -p /home/chroot/restricted-user/bin /home/chroot/restricted-user/lib/ /home/chroot/restricted-user/lib64/ /home/chroot/restricted-user/lib/x86_64-linux-gnu/ /home/chroot/restricted-user/etc/

5. Install `bash` shell in the jailed directory:

		sudo cp -v /bin/bash /home/chroot/restricted-user/bin

6. For each binary we need to determine which shared libraries are needed, this is done through `ldd` command:

		sudo ldd /bin/bash

7. Next part of the process is to manually copy each library to the corresponding location in our `restricted-user` directory. This is necessary because our user won't have access ourside its own jail. 

		cp -v /lib/x86_64-linux-gnu/{libncurses.so.5,libtinfo.so.5,libdl.so.2,libc.so.6} /home/chroot/restricted-user/lib/
		cp -v /lib64/ld-linux-x86-64.so.2 /home/chroot/restricted-user/lib64/
		cp -va /lib/x86_64-linux-gnu/libnss_files* /home/chroot/restricted-user/lib/x86_64-linux-gnu/

8. Now its time to create our `restricted-user`

		sudo adduser restricted-user

9. Copy user information to jailed directory:

		sudo cp -vf /etc/{passwd,group} /home/chroot/restricted-user/etc/

10. Finally edit your server `/etc/ssh/sshd_config` file to configure your new user:

	{: .file}
	/etc/ssh/sshd_config
	:   ~~~ conf
		Match User restricted-user
		ChrootDirectory /home/chroot/restricted-user

11. Restart your server to apply changes.

Keep in mind that our user can't use any command or binary that is not manually installed in its jailed environment. The complete process to setup a user for specific tasks it overwhelming but has the advantage that is protected in case it gets compromized.

## Step 5: Update regularly your revoked keys list

There are cases where you want to revoke specific public keys to prevent attempts to log in with them. OpenSSH have a directive that comes handly for that `RevokedKeys`, just edit your `/etc/ssh/sshd_config` and add the desired location for revoked keys list:

	{: .file}
	/etc/ssh/sshd_config
	:   ~~~ conf
		RevokedKeys /etc/ssh/revoked_keys

The list should contain one key per line in plain text format. Remember to restart your SSH service each time you add a new key to the file.

## Step 6: Reduce timeout interval and login grace time

Unattended SSH sessions are a major security risk. Leaving a remote connection open gives anyone nearby the power to do anything in your server, after all, you're already logged. The idle time interval comes in useful to prevent this situation, all you need is to configure two directives:

`ClientAliveInterval` set the time in seconds before the server sends a message requesting a client response. Default is 0, which means the server won't request a client response (session can last forever).
`ClientAliveCountMax` specifies the number of client alive messages sent by the server before closing the connection (if no response is returned). Default is 3. 

According to that if you decide to limit an idle SSH connection to 2 minutes before disconnecting the client you can configure it like this:

		ClientAliveInterval 40
		ClientAliveCountMax 3

Which sends 3 messages to your client (every 40 seconds) requesting some action, after 120 seconds without response the user will be logged out. An alternative configuration could be:

		ClientAliveInterval 120
		ClientAliveCountMax 0

In this case no messages are sent, the server will disconnect any SSH session after 2 minutes of inactivity.

To apply any combination that suits your needs just edit your server's `/etc/ssh/sshd_config` and restart your SSH daemon afterwards.

## Step 7: Use a warning banner

This step will not harden your server security, but your legal-conscientious-parameters. In some countries the simple fact of warning unauthorized users of the consequences of their actions is determinant for taking legal actions. To enable a warning banner each time a user log to your server add the following line to the `/etc/ssh/sshd_config` configuration:

	{: .file}
	/etc/ssh/sshd_config
	:   ~~~ conf
		Banner /WarningMessage/Location

Where `/WarningMessage/Location` is the path to your banner text file. The following banner example was taken from OpenSSH Ubuntu help:

***************************************************************************
                            NOTICE TO USERS


This computer system is the private property of its owner, whether
individual, corporate or government.  It is for authorized use only.
Users (authorized or unauthorized) have no explicit or implicit
expectation of privacy.

Any or all uses of this system and all files on this system may be
intercepted, monitored, recorded, copied, audited, inspected, and
disclosed to your employer, to authorized site, government, and law
enforcement personnel, as well as authorized officials of government
agencies, both domestic and foreign.

By using this system, the user consents to such interception, monitoring,
recording, copying, auditing, inspection, and disclosure at the
discretion of such personnel or officials.  Unauthorized or improper use
of this system may result in civil and criminal penalties and
administrative or disciplinary action, as appropriate. By continuing to
use this system you indicate your awareness of and consent to these terms
and conditions of use. LOG OFF IMMEDIATELY if you do not agree to the
conditions stated in this warning.

****************************************************************************


