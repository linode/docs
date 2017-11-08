---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Tips to improve the security of your SSH server'
keywords: ["SSH", "secure shell", "Ubuntu", "CentOS", "security", "2FA", "server", "Linux"]
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-04-07
modified: 2017-04-07
modified_by:
  name: Linode
title: 'Use Advanced OpenSSH Features to Harden Access to Your Linode'
contributor:
  name: Damaso Sanoja
  link: https://github.com/damasosanoja
external_resources:
 - '[OpenSSH](http://www.openssh.com/)'
 - '[Diffie-Hellman](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

There's a good chance you've been using SSH (Secure Shell) to access your Linode from your computer. Although SSH is a secure protocol, most system compromises are a result of human error or failure to take advantage of the security features offered. In this guide, we'll cover a few key features provided by OpenSSH.

![Use Advanced OpenSSH Features to Harden Access to Your Linode](/docs/assets/advanced-ssh-server-security.png "Use Advanced OpenSSH Features to Harden Access to Your Linode")

[OpenSSH](http://www.openssh.com/) is a suite of connectivity tools that sysadmins use daily to access remote servers. From a security point of view, it's the 'front door' for remote logins so it is extremely important to harden SSH as much as possible. The aim of this guide is to build upon our [Securing Your Server](/docs/security/securing-your-server/) guide with easy steps that can be implemented in just a few minutes.

**Assumptions:**

* You'll be deploying a server open to the internet 24/7.
* Your primary concern is security over simplicity or convenience. Be aware that in most cases, more security implies less convenience.

## Before You Begin

1.  Complete the [Getting Started](/docs/getting-started) guide.

2.  Follow the [Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, create a basic firewall rule set and remove unnecessary network services.

3.  Log in to your Linode via SSH and check for updates using the corresponding package manager: `apt` (Ubuntu/Debian) or `yum` (RHEL/CentOS) .

        sudo apt update && sudo apt upgrade
        sudo yum update

4.  Make a backup of your server's `sshd_config` file.

        sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.BACKUP

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Use a Stronger Diffie-Hellman Algorithm

[Diffie-Hellman](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) is the name of an asymmetric algorithm used to securely exchange cryptographic keys over public channels (like the Internet). OpenSSH uses the D-H algorithm to generate keys from a configuration file located at `/etc/ssh/moduli`. Several IT news outlets have reported the possibility that nations may have broken commonly used primes, which mean they could read encrypted traffic transmitted over "secure" channels.

Protecting your server against that threat is fairly simple, just edit the `/etc/ssh/moduli` file and comment the lines where the fifth field is 1023 or 1535 (which denotes the size). This forces the algorithm to use keys from Group 14 (2048-bit or more). Higher groups mean more secure keys that are less likely to be broken in near future, but also require additional time to compute.

![Enforcing a stronger Diffie-Hellman algorithm](/docs/assets/diffie_hellman_screenshot.png)

### Optional: Generate Your Own Keys

The `/etc/ssh/moduli` file ships with OpenSSH, so assuming two servers have the same version of OpenSSH, their default `moduli` files will be identical. This does *not* mean they are insecure; because Diffie-Hellman is an asymmetric algorithm, the keys it generates are incredibly difficult to crack when generated from sufficiently large primes. That being said, if you want to take the extra time to do so, you may generate new Diffie-Hellman parameters yourself:

    ssh-keygen -G "${HOME}/moduli" -b 2048
    sudo ssh-keygen -T /etc/ssh/moduli -f "${HOME}/moduli"
    rm "${HOME}/moduli"

{{< caution >}}
Before running these commands on a production server, be aware that depending on the size of the keys you're generating, this will use significant CPU power and may take anywhere from a minute to several hours.
{{< /caution >}}

This sequence of commands generates a new file containing thousands of candidate primes for the Diffie-Hellman algorithm. Next, it tests the candidates and adds suitable primes to your `moduli` file. Note that these keys append to your existing ones; they do not overwrite the file, so it is still possible that your SSH connection will use a precomputed prime in its key exchange. As stated above, however, this is not a vulnerability.

In our example, we generated Diffie-Hellman parameters with 2048 bits. This is generally considered secure, but you are welcome to modify this value to generate larger prime candidates.

Remember to restart the SSH service after making these changes, whether you edited the file or generated your own:

    sudo systemctl restart ssh

For more detailed information on how to decide whether to edit the existing file or generate your own, please refer to [RFC4419](https://tools.ietf.org/html/rfc4419#section-7).

## SSH Access Control

Ideally, you should limit the number of users with server access to a bare minimum. Fortunately, OpenSSH Access Control Directives bring an excellent mechanism to set permissions and establish restrictions to users and groups that connect to your server.

There are four directives available executed in sequential order:

`DenyUsers`: block listed users from SSH service.
`AllowUsers`: login is allowed only for users listed in this directive.
`DenyGroups`: similar to `DenyUsers`, any user who belongs to this group(s) is blocked.
`AllowGroups`: only users part of this group(s) can access the SSH service.

The default behavior of SSH is to allow *any* user to log in to the server, but this can be changed by adding access control directives to your `/etc/ssh/sshd_config` file. The following examples shows how to filter who can access the service:

### Selectively Deny Users

`DenyUsers phpadmin tempuser dbuser@198.51.100.0` - The users `phpadmin` and `tempuser` have no SSH access at all, but the user `dbuser` is only blocked if is connecting from the specific IP address of 198.51.100.0.

### Selectively Allow Users

`AllowUsers superadmin megauser@yourdomain.tld dbadmin@198.51.100.0` - only the users `superadmin`, `megauser` and `dbadmin` have SSH access, but `megauser` and `dbadmin` can only connect from specific domains/IP addresses. On the other hand, `superadmin` has the ability to connect from any computer.

### Custom Rules Example

{{< file-excerpt "/etc/ssh/sshd_config" aconf >}}
DenyUsers adam ben clark@198.51.100.0/24

AllowUsers clark dan@192.168.5.200 eva

{{< /file-excerpt >}}


Let's look at these rules in more detail. In the first line, Adam and Ben are blocked from accessing the server via SSH under any circumstances. Clark is not able to connect from a specific range of IP addresses, specified by `198.51.100.0/24`. In the second line, only Clark, Dan, and Eva will have SSH access. However, Clark's previous restriction from the `DenyUsers` line applies and Dan is *only* able to connect from one specific IP address. Eva is the only one who is able to connect via SSH from any computer.

Remember to restart your SSH service after changes have been made:

    sudo systemctl restart ssh

## Use a Strong Password for your Key-pair

In the [Securing Your Server](/docs/security/securing-your-server/) guide, you're encouraged to use SSH Key Pair Authentication. This is not optional if you are serious about security. But what about remote users that connect to the server with their laptops, which are susceptible to be stolen or lost? Here is where protecting your private key with a strong password or passphrase comes in, at least to gain time before changing the server keys. A strong password shouldn't be dictionary based. If security is your main concern, the convenience of an easy to remember password isn't adequate. [OpenSSL](https://www.openssl.org/) offers an easy way to generate pseudo-random passwords:

    openssl rand -base64 32

The command will generate a 44 character long, base64-encoded password like this:

    C4b7Yep8HGQFeG6kbnpEtrm+bg0+958xf1f85PU3/e0=

This kind of password is very hard to crack, but has the obvious disadvantage of being inconvenient each time you log to your server. The recommended method is to use a good password manager, because using a plain-text file for this dilutes the purpose of using the password in the first place.

To add the generated password to your existing private key:

		ssh-keygen -p -f ~/.ssh/id_rsa

This assumes you keep your client's private SSH key in its default location, `~/.ssh/id_rsa`. You can modify the file location as needed and use the same command to change your password in the future.

An alternative to this method is the use of a [GPG smartcard](https://en.wikipedia.org/wiki/OpenPGP_card) or [YubiKey](https://www.yubico.com/products/yubikey-hardware/) which should be stored in a different place from your laptop. You can find more information about this implementation in the guide [How to use a GPG key for SSH authentication](/docs/security/gpg-key-for-ssh-authentication/)

## Chroot Users

OpenSSH has a useful directive called `ChrootDirectory` that can be used in `sshd_config` to 'jail' a user into any directory, similar to the behavior of `chroot_local=YES` in an FTP server. This allows sysadmins to implement an additional layer of security for those users that don't need access to all of a server's resources.

However, this strategy involves a time-consuming process to configure the jailed user. For the purposes of this guide we'll setup a bare environment with some basic commands available for a user we'll create called `restricted-user`.

1.  Create a jail directory in any desired location for `restricted-user`:

        sudo mkdir -p /home/chroot/restricted-user

2.  Create the required `/dev` nodes using `mknod`:

        sudo mkdir -p /home/chroot/restricted-user/dev/
        sudo mknod -m 666 /home/chroot/restricted-user/dev/null c 1 3
        sudo mknod -m 666 /home/chroot/restricted-user/dev/tty c 5 0
        sudo mknod -m 666 /home/chroot/restricted-user/dev/zero c 1 5
        sudo mknod -m 666 /home/chroot/restricted-user/dev/random c 1 8

3.  Establish permissions as needed for the jail. In this example, we'll give ownership to `root`:

        sudo chown root:root /home/chroot/restricted-user
        sudo chmod 0755 /home/chroot/restricted-user

4.  Create the remaining directories needed by `restricted-user`:

        sudo mkdir -p /home/chroot/restricted-user/bin /home/chroot/restricted-user/lib/ /home/chroot/restricted-user/lib64/ /home/chroot/restricted-user/lib/x86_64-linux-gnu/ /home/chroot/restricted-user/etc/

5.  Install the `bash` shell into the jail:

        sudo cp -v /bin/bash /home/chroot/restricted-user/bin

6.  For each binary copied into the jail, we need to determine which shared libraries are needed. This is done through the `ldd` command:

        sudo ldd /bin/bash

7.  Manually copy each library from the output to the corresponding location in our `restricted-user` directory. This is necessary because our user won't have access outside its own jail.

        cp -v /lib/x86_64-linux-gnu/{libncurses.so.5,libtinfo.so.5,libdl.so.2,libc.so.6} /home/chroot/restricted-user/lib/
        cp -v /lib64/ld-linux-x86-64.so.2 /home/chroot/restricted-user/lib64/
        cp -va /lib/x86_64-linux-gnu/libnss_files* /home/chroot/restricted-user/lib/x86_64-linux-gnu/

8.  Next, create the `restricted-user`. You may use a different name for your user if you like:

        sudo adduser restricted-user

9.  Copy user information to the jail:

        sudo cp -vf /etc/{passwd,group} /home/chroot/restricted-user/etc/

10. Finally, edit your `/etc/ssh/sshd_config` file to configure your new user:

    {{< file "/etc/ssh/sshd_config" aconf >}}
Match User restricted-user
ChrootDirectory /home/chroot/restricted-user

{{< /file >}}


11.  Restart your SSH service to apply these changes.

        sudo systemctl restart sshd

Keep in mind that our restricted user can't use any command or binary that is not manually installed in its jail environment. The complete process to setup a user for specific tasks is overwhelming but has the advantage that anything outside the jail is protected in the event that the user is compromised.

## Regularly Update your Revoked Keys List

There are cases where you want to revoke specific public keys to prevent attempts to log in with them. For example, if you rotate your SSH keys every few months, you may want to disable them from being used in the future. OpenSSH has a directive to do just that: `RevokedKeys`. Simply edit your `/etc/ssh/sshd_config` and add the desired location for revoked keys list:

{{< file "/etc/ssh/sshd_config" aconf >}}
RevokedKeys /etc/ssh/revoked_keys

{{< /file >}}


The list should contain one key per line in plain text format. Remember to restart your SSH service each time you add a new key to the file.

## Reduce Timeout Interval and Login Grace Time

Unattended SSH sessions are a major security risk. Leaving a remote connection open may allow unauthorized users the power to do whatever they like with your server. After all, you're already logged. The idle time interval comes in useful to prevent this situation, all you need is to configure two directives:

`ClientAliveInterval` set the time in seconds before the server sends a message requesting a client response. Default is 0, which means the server won't request a client response (the session can last forever).
`ClientAliveCountMax` specifies the number of client alive messages sent by the server before closing the connection if no response is returned.  The default is 3.

For example, if you decide to limit an idle SSH connection to 2 minutes before disconnecting the client, you can configure it as follows:

    ClientAliveInterval 40
    ClientAliveCountMax 3

This sends 3 messages to your client (every 40 seconds) requesting some action, after 120 seconds without response the user will be logged out. An alternative configuration could be:

    ClientAliveInterval 120
    ClientAliveCountMax 0

With these settings, if no messages are sent, the server will disconnect any SSH session after 2 minutes of inactivity.

To apply any combination that suits your needs just edit your server's `/etc/ssh/sshd_config` and restart your SSH daemon afterwards.

## Use a Warning Banner

This step will not harden your server security, but your legal-conscientious-parameters. In some locations, the simple fact of warning unauthorized users of the consequences of their actions is determinant for taking legal action. To display a warning banner each time a user logs to your server, add the following line to the `/etc/ssh/sshd_config` configuration:

{{< file "/etc/ssh/sshd_config" aconf >}}
Banner /location/of/WarningMessage

{{< /file >}}


The value `/location/of/WarningMessage` is the path to your banner text file. The following banner example was taken from [Ubuntu's Community Help page](https://help.ubuntu.com/community/SSH/OpenSSH/Configuring) for OpenSSH:

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

