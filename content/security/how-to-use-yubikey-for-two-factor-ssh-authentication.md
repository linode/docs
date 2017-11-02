---
author:
  name: Huw Evans
  email: me@huw.nu
description: 'This guide shows you how to use a YubiKey for Two-Factor secure shell authentication - or make it the primary access method.'
keywords: ["ssh", "yubikey", "2fa", "2 factor authentication", "otp"]
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
title: 'How to use a YubiKey for Two-Factor Secure Shell Authentication'
published: 2017-08-28
modified: 2017-09-06
modified_by:
  name: Linode
contributor:
  name: Huw Evans
  link: https://github.com/huw
external_resources:
- '[Official Yubico PAM Module Documentation](https://developers.yubico.com/yubico-pam/)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>
## What is Yubikey?

[YubiKeys](https://www.yubico.com/products/yubikey-hardware/yubikey4/) are small USB dongles that you can plug into your computer. They can simulate keyboard input, allowing you to enter One Time Passwords (OTPs) with the press of a button to authenticate with services like Google, Dropbox and GitHub.

YubiKeys can also be used when logging into a remote server. This guide will show you how to configure your Linode so that a YubiKey must be plugged in and tapped in order to log in to your server using `ssh`. Depending on your needs, you can also configure a password in addition to the YubiKey for an extra level of security.

If you want to work through this guide but don't have a YubiKey, you can find one [at this link](https://www.yubico.com/products/yubikey-hardware/). As of this writing, any key that supports 'Yubico OTP' will support two-factor SSH authentication.

## Before You Begin

1.  Make sure you have a complete and working Linode as per the instructions in the [Getting Started](/docs/getting-started) guide.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your local system. Then update your server using the following:

        sudo apt-get update && sudo apt-get upgrade

4. Test your YubiKey at [demo.yubico.com](https://demo.yubico.com) to make sure it's working correctly.

{{< note >}}
Replace each instance of `user@example.com` in this guide with your site's domain name and the appropriate user.
{{< /note >}}

## Configure Your YubiKey

If your YubiKey still has its default configuration, you can skip this step. If you've made some changes, this section will tell you how to put the appropriate configuration for this guide onto slot 1 of your YubiKey. If you want to use a different slot, make sure you select it instead of slot 1 in the following instructions.

1. [Install](https://www.yubico.com/support/downloads/) the YubiKey Personalization Tool for your system and open it.

2. Click on the 'Yubico OTP' menu in the top-left corner, and select 'Quick'. Your screen should look like the one below.

[![YubiKey Personalization Tool](/docs/assets/yubikey-personalization-small.png)](/docs/assets/yubikey-personalization.png)

3. Click 'Write Configuration'. Click 'Cancel' on the pop-up window that asks where to save the log file.

![Prompt to save the log file](/docs/assets/yubikey-log-window.png)

4. Now select 'Upload to Yubico'. In the web form that opens, fill in your email address. Select the field asking for an 'OTP from the YubiKey' and touch the button on your YubiKey (or touch and hold if you programmed slot 2). This should fill the field with a string of letters. Complete the captcha and press 'Upload AES key'.

![AES key upload form](/docs/assets/yubikey-upload-form.png)

{{< note >}}
The page will respond with a table containing your key information. You should keep this data in a safe place. Should you ever lose your YubiKey, you will need this data to reconfigure a new one with the same settings.
{{< /note >}}

5. Test that your key works by following the instructions for single-factor authentication on [demo.yubico.com](https://demo.yubico.com). If it doesn't, you may need to wait up to 15 minutes for your key to process on their servers.

## Install the Authentication Software

1. Register for an API key [here](https://upgrade.yubico.com/getapikey/), by entering your email address and (with the 'YubiKey one time password' field selected) touching the button on your YubiKey. Keep the Client ID and Secret Key returned by the website.

    {{< note >}}
On Ubuntu, you may need to install `software-properties-common` and `python-software-properties` to add the repository.
{{< /note >}}

2. On your Linode, install the `pam_yubico` package.

    On Ubuntu:

        sudo add-apt-repository ppa:yubico/stable
        sudo apt-get update
        sudo apt-get install libpam-yubico

    On Debian (Wheezy):

        sudo apt-get install libpam-yubico

    On Fedora/EPEL/Arch Linux:

        sudo yum install pam_yubico

    Yubico's documentation also has instructions on [how to build `pam_yubico` from source](https://developers.yubico.com/yubico-pam/).

    {{< note >}}
You may need to move `pam_yubico.so` to wherever PAM modules are stored on your system (usually `lib/security`). The Ubuntu package will automatically install the module in the appropriate location, but you can check to see whether it's in the right location with `ls /lib/security`. It may also be stored in `/usr/local/lib/security`, in which case you will need to move it manually.
{{< /note >}}

3. Create the file `/etc/ssh/authorized_yubikeys`:

        sudo touch /etc/ssh/authorized_yubikeys

4. Populate this file with the usernames for which you want to enable two-factor authentication and their YubiKey IDs. You can obtain the ID by opening a text editor and touching the button on the YubiKey, and selecting *only the first 12 characters*. The first line below would be a typical configuration. The subsequent lines show a configuration where users `user2`, `user3`, and `user4` use multiple YubiKeys and plan to access the server with all of them.

    {{< file "/etc/ssh/authorized_yubikeys" >}}
user1:vvklhtiubdcu
user2:ccurrufnjder:ccturefjtehv:cctbhunjimko
user3:ccdvnvlcbdre:vvvglinuddek
user4:vvddhfjjasui:vvfjidkflssd

{{< /file >}}


5. Add `auth required pam_yubico.so id=client id authfile=/etc/ssh/yubikeys` to the start of `/etc/pam.d/sshd`. Replace `client id` with the ID you retrieved when applying for an API key, and `secret key` with the secret key. If you only want single-factor authentication (either a YubiKey or a password), change `required` to `sufficient` to tell the system that a valid YubiKey will be enough to log in.

    {{< file-excerpt "/etc/pam.d/sshd" >}}
# PAM configuration for the Secure Shell service

# Add your line below this one
# v v v v v v
auth required pam_yubico.so id=client id key=secret key authfile=/etc/ssh/yubikeys
# ^ ^ ^ ^ ^ ^
# Add your line above this one

# Standard Un*x authentication.
@include common-auth

{{< /file-excerpt >}}


    {{< note >}}
On some systems, like Arch Linux, you will need to edit `/etc/pam.d/system-remote-login` instead of `/etc/pam.d/sshd`.
{{< /note >}}

6. In `/etc/ssh/sshd_config`, add or edit the following settings:

    {{< file-excerpt "/etc/ssh/sshd_config" >}}
ChallengeResponseAuthentication yes
UsePAM yes

{{< /file-excerpt >}}


    If you want to only use a YubiKey for single-factor authentication, set `PasswordAuthentication no`.

7. Since you've edited SSH settings, you will need to restart your Linode. You can do this from the Linode Manager or by typing `sudo reboot`.

## Log Back In

Now that this process is done, you can test your login by typing `ssh user@example.com`. Depending on your setup, you may be prompted for your YubiKey. All you need to do is touch the button; it will enter the key for you. Then, type in your password if you are using multi-factor authentication. It will look something like the image below.

![SSH window](/docs/assets/yubikey-ssh.png)

You can now log into your server.

## Troubleshoot Yubikey, If Needed

If you encounter any problems, make sure you've followed all of the steps in this guide and restarted your server. If these steps don't solve your issues, you can enable logging, by following these steps:

1. Add the word `debug` to the end of the line you added in `/etc/pam.d/sshd`:

    {{< file-excerpt "/etc/pam.d/sshd" >}}
auth required pam_yubico.so id=<client id> key=<secret key> authfile=/etc/ssh/yubikeys debug

{{< /file-excerpt >}}


2. Create a debug log file:

        sudo touch /var/run/pam-debug.log
        sudo chmod go+w /var/run/pam-debug.log

3. Log data to this file:

        sudo journalctl -f -l
        tail -f /var/run/pam-debug.log

4. Log in again and analyze this file for clues as to what is causing the problem.

5. Once you're done, disable debugging by removing the `debug` flag from `/etc/pam.d/sshd`. Then, delete the log file.
