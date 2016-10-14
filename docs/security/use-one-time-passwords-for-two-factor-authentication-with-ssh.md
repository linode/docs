---
author:
  name: Phil Zona
  email: docs@linode.com
description: 'Use Google Authenticator to enable two-factor authentication for SSH connections.'
keywords: 'two-factor,authentication,ssh,google authenticator'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 'Wednesday, October 12th, 2016'
modified_by:
  name: Phil Zona
published: 'Wednesday, October 12th, 2016'
title: Use One-Time Passwords for Two-Factor Authentication with SSH
external_resources:
 - '[One-Time Passwords](https://en.wikipedia.org/wiki/One-time_password)'
 - '[Linux PAM Documentation](http://www.linux-pam.org/)'
---

No matter what kind of data you are hosting, securing access to your Linode is a critical step in preventing your information from falling into the wrong hands. By default, you will need a password to log in, and you may also configure a key pair for even greater security. However, another option exists to complement these methods: time-based one-time passwords (TOTPs).

TOTPs allow you to enable two-factor authentication for SSH with single-use passwords that change every 30 seconds. By combining this method with a regular password or publickey (or both), you can add an extra layer of security to ensure your server is well protected.

This guide will explain how to install the necessary software, configure your system to use two-factor authentication (2FA), and use your new time-based one-time password in combination with existing security features.

## Before You Begin

1.  This guide is meant to be used with Linodes running Ubuntu 16.04 or CentOS 7. Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, and remove unnecessary network services. This guide will explain a different way to harden SSH access, but you may use a keypair in addition for even greater protection.

3.  You will need a smartphone or another client device with an authenticator application such as [Google Authenticator](https://en.wikipedia.org/wiki/Google_Authenticator) or [Authy](https://www.authy.com/). Many other options exist, and this guide should be compatible with nearly all of them.

4.  Update your system:

        sudo apt-get update && sudo apt-get upgrade
        sudo yum update && sudo yum upgrade

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Install TOTP Packages

In this section, we'll review the software packages you'll need to install in order to set up two-factor authentication on both Ubuntu 16.04 and CentOS 7. This software will generate keys on your Linode, which will then be paired with an app on a client device (often a smartphone) to generate single-use passwords that expire after a set period of time.

### Ubuntu 16.04

In Ubuntu, the password generator is included in the default package repositories:

    sudo apt-get install libpam-google-authenticator

### CentOS 7

The CentOS installation requires a couple extra steps, but will provide you with similar functionality. First, enable the [EPEL](https://fedoraproject.org/wiki/EPEL) repository since the package we're looking for isn't included by default:

    sudo wget https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
    sudo rpm -Uvh epel-release-latest-7.noarch.rpm

Next, install the packages that we'll be using to generate keys and passwords:

    sudo yum install liboath gen-oath-safe pam_oath

Ubuntu 16.04 uses the Google Authenticator package, although the keys it generates are compatible with other authentication apps. CentOS 7, however, does not include this package, and instead uses the `liboath`, `gen-oath-safe`, and `pam_oath`  packages, which combine to provide an open-source alternative. The packages offer slightly different options, but both will allow you to set up one-time passwords for two-factor authentication.

## Generate a Key

Now that the packages have been installed, we'll use them to generate keys. These keys are then used by software on client devices to generate time-based one-time passwords. To understand the difference between these passwords and the ones you already use, let's break down the concept of a TOTP:

-   **Time-based** - The generated password will change every 30-60 seconds. This means that if an attacker tries to use brute force, they'll almost certainly run out of time before new credentials are needed to gain access.
-   **One-time** - The password will only be valid for a single authentication, which minimizes the risk of replay attacks. Even if your TOTP is intercepted upon sending it to the server, it will no longer be valid once you've logged in.

To generate a TOTP, follow the steps below for your distribution. 

{: .note}
> Be sure to have your phone or mobile device ready, since this is where we'll be adding the password to your authenticator app. If you haven't downloaded an authenticator app, you'll also need to do that before proceeding.

### Ubuntu 16.04

These instructions will generate a password for the user that is running the commands, so if you are configuring two-factor authentication for multiple users, you will need to follow these steps for each user.

1.  Run the `google-authenticator` program:

        google-authenticator

    A prompt will appear asking you to specify whether you'd like to use a time-based authentication (as opposed to counter-based). Choose "yes" by entering `y` at the prompt.

2.  You should see a [QR code](https://en.wikipedia.org/wiki/QR_code) in your terminal:

    [![The Google Authenticator QR Code and keys on Ubuntu 16.04.](/docs/assets/google-authenticator-ubuntu.png)](/docs/assets/google-authenticator-ubuntu.png)

    Using the authenticator app on your phone or mobile device, scan the code. A new entry should be added to your authenticator app in the format `username@hostname`. You'll also see a "secret key" below the QR code. You may enter this into the app manually instead of scanning the QR code to add your account.

3.  Record your emergency scratch codes in a secure location. These codes can be used for authentication if you lose your device, but be aware that each code is only valid *once*. 

4.  You should be prompted to answer the following questions:

        Do you want me to update your "/home/exampleuser/.google_authenticator" file (y/n)

    This specifies whether the authentication settings will be set for this user. Answer `y` to create the file that stores these settings.

        Do you want to disallow multiple uses of the same authentication
        token? This restricts you to one login about every 30s, but it increases
        your chances to notice or even prevent man-in-the-middle attacks (y/n)

    This makes your token a true one-time password, preventing the same password from being used twice. For example, if you set this to "no," and your password was intercepted while you logged in, someone may be able to gain entry to your server by entering it before the time expires. We *strongly* recommend answering `y`.

        By default, tokens are good for 30 seconds and in order to compensate for
        possible time-skew between the client and the server, we allow an extra
        token before and after the current time. If you experience problems with poor
        time synchronization, you can increase the window from its default
        size of 1:30min to about 4min. Do you want to do so (y/n)

    This setting accounts for time syncing issues across devices. Unless you have reason to believe that your phone or device may not sync properly, you can answer `n` here.

        If the computer that you are logging into isn't hardened against brute-force
        login attempts, you can enable rate-limiting for the authentication module.
        By default, this limits attackers to no more than 3 login attempts every 30s.
        Do you want to enable rate-limiting (y/n)

    This setting prevents attackers from using brute force to guess your token. Although the time limit should be enough to prevent most attacks, this will ensure that an attacker only has three chances per 30 seconds to guess your password. We recommend answering `y` here.

5.  Before you log out, review the next section carefully to avoid getting locked out of your Linode.

### CentOS 7

1.  Generate a password:

        gen-oath-safe example-user totp

    Replace `example-user` in the above command with the user for which you'd like to enable two-factor authentication. The `totp` option specifies that will be a time-based one-time password, as opposed to counter-based.

2.  A QR code will appear in your terminal, which you can scan with your mobile device to set up your password:

    [![The generated QR Code and keys in CentOS 7.](/docs/assets/two-factor-keys-centos.png)](/docs/assets/two-factor-keys-centos.png)

    You'll also notice some additional information displayed above and below the code. Notably, the secret key in the line beginning with "URI" provides you with a hex code that you can use to manually configure the code on your device. You'll also see another hex code on a line containing the user name, resembling the following:

        HOTP/T30 example-user - aae4f8b27eba8376005a2291c185c21a6f9aa8c3

3.  Copy the above line into a new file, `/etc/liboath/users.oath`, which will store the key for each user:

        echo 'HOTP/T30 example-user - aae4f8b27eba8376005a2291c185c21a6f9aa8c3' | sudo tee /etc/liboath/users.oath

    To configure two-factor authentication for multiple users, use this command to append the keys for each user to the `users.oath` file.

4.  Before you log out, review the next section carefully to avoid getting locked out of your Linode.

Congratulations! You have finished generating your key and adding it to your client, but some additional configuration is needed before these settings will go into effect. See the next section for instructions on how to require two-factor authentication for all SSH login attempts.

## Configure Authentication Settings

The time-based one-time password authentication methods in this guide use *PAM*, or Pluggable Authentication Modules. [PAM](http://www.linux-pam.org/) is mechanism that integrates low-level authentication mechanisms into modules that can be configured for different applications and services. Because we're using additional software (i.e., programs that aren't built into the Linux distro), we'll need to configure PAM to properly authenticate users.

{: .caution}
> It is strongly recommended that you have another terminal session open while configuring your authentication settings. This way, if you disconnect to test authentication and something is not properly configured, you won't be locked out of your Linode.

1.  Open `/etc/pam.d/sshd` with sudo privileges and edit the file, depending on your distribution:

    **Ubuntu 16.04**:

    Add these lines to the end of the file:

    {: .file-excerpt}
    /etc/pam.d/sshd
    :   ~~~
        auth    required      pam_unix.so     no_warn try_first_pass
        auth    required      pam_google_authenticator.so
        ~~~

    The first line tells PAM to authenticate with a normal Unix user password before other methods. The second line specifies an additional method of authentication, which in this case, is the TOTP software we installed earlier.

    **CentOS 7**

    Add the following line to your file (it has been marked by a comment here for clarity, but you can omit everything following the `#`). The surrounding lines are included for context, but they should not be modified. The line *must* be added between the lines specified here:

    {: .file-excerpt}
    /etc/pam.d/sshd
    :   ~~~
        auth   	required 	pam_sepermit.so
        auth    required   	password-auth
        auth 	required   	pam_oath.so usersfile=/etc/liboath/users.oath window=10 digits=6 #Add this line
        auth   	include   	postlogin 
        ~~~

    This line specifies the PAM OATH module as an additional method of authentication, the path for the users file, a window that specifies which passphrases will be accepted (to account for potential time syncing issues), and a length of six digits. 

    {: .note}
    > If you follow the rest of the CentOS 7 steps and find that you are still unable to connect, try adding `debug=1` to the third line. 

2.  Edit your `/etc/ssh/sshd_config` file to include the following lines, replacing `example-user` with any system user for which you'd like to enable two-factor authentication. Comments are included here, but do not need to be added to your actual configuration file. These lines will be the same on both Ubuntu and CentOS:

    {: .file-excerpt}
    /etc/ssh/sshd_config
    :   ~~~
        # This line already exists in the file, and should be changed from 'no' to 'yes'
        ChallengeResponseAuthentication yes

        ...

        # These lines should be added to the end of the file
        Match User example-user
            AuthenticationMethods keyboard-interactive
        ~~~

    If you created TOTPs for multiple users, and you'd like to have them all use two-factor authentication, create additional `Match User` blocks for each additional user, using the same format shown above.

3.  Restart the SSH daemon to apply these changes:

    **Ubuntu 16.04**

        sudo systemctl restart ssh

    **CentOS 7**

        sudo systemctl restart sshd

## Combine Two-Factor and Public Key Authentication

This section is optional. The above configuration provides two layers of security for your server, but if you'd like to combine [public key authentication](/docs/security/use-public-key-authentication-with-ssh) with password and TOTP, modify the `AuthenticationMethods` line in `/etc/ssh/sshd_config`:

{: .note}
> Confirm that your public key has been copied to your Linode before completing this section. View installed SSH keys by entering `ssh-add -l` in your terminal.

{: .file-excerpt}
/etc/ssh/sshd_config
:   ~~~
    Match User example-user
        AuthenticationMethods publickey,keyboard-interactive
    ~~~

Configure this setting in the `Match User` block for each user as appropriate. When any of these users log in, they will not only need to provide their SSH key, but they will be authenticated via password and TOTP as well. Be sure to restart your SSH daemon to apply these changes.

## Next Steps

First, be sure you have followed our guide to [Securing Your Server](/docs/security/securing-your-server). Although there is no single, foolproof method to protecting your data, firewalls and services like [Fail2Ban](/docs/security/using-fail2ban-for-security) are a great way to minimize risk.

When you use two-factor authentication with TOTPs, an important point to consider is the physical security of the device on which you've configured your authenticator app. Be sure your phone or device is secured with a passphrase, so that even if it falls into the wrong hands, it can't easily be used to compromise your server. If you lose the phone or device that stores your credentials, you can use [Lish](/docs/networking/using-the-linode-shell-lish) to access your Linode and disable two-factor authentication. If this happens, you should switch to a different, hardened method of SSH access, such as [public key authentication](/docs/security/use-public-key-authentication-with-ssh), in the interim.

While two-factor authentication may be a great security feature, total security is an ongoing process, not an end goal that can be achieved by adding extra layers of authentication. To provide the best protection for your data, take care to follow security best practices at all times.
