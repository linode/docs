---
author:
  name: Huw Evans
  email: me@huw.nu
description: 'If you have a YubiKey, you can use it as a 2nd factor for Secure Shell (SSH) authentication—or make it the primary access method.'
keywords: 'ssh,authentication,yubikey,2fa,2 factor authentication,otp'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
title: 'How to use a YubiKey for Two-Factor Secure Shell Authentication'
contributor:
  name: Huw Evans
  link: github.com/huw
  external_resources:
- '[Official Yubico PAM Module Documentation](https://developers.yubico.com/yubico-pam/)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

[YubiKeys are really neat.](https://www.yubico.com/products/yubikey-hardware/yubikey4/) They're little USB dongles that you can plug into your computer that simulate keyboard input, allowing you to enter One Time Passwords (OTPs) with the press of a button to authenticate with services like Google, Dropbox and GitHub. But they're so much more extensible—Facebook, one of the early corporate users of YubiKeys, [uses them to log into servers with Secure Shell (SSH)](http://www.wired.com/2013/10/facebook-yubikey/). This means that their engineers can type in `ssh user@192.168.xxx.xxx`, enter their password, and tap their keys for an extra layer of security. If their passwords are compromised, then the server won't let them in without the key.

This guide will tell you how to do exactly that. With little-to-no experience, you'll end up with a system where a YubiKey must be plugged in and tapped to strengthen your password, or a system where simply having it connected to your computer will mean you don't even have to use a password.

If you want to try this guide our yourself, but don't have a YubiKey, you can compare them [at this link](https://www.yubico.com/products/yubikey-hardware/). As of writing, any key that supports 'Yubico OTP' will support two-factor SSH authentication.

## Before You Begin

1.  Ensure you have a complete and working Linode as per the instructions in the [Getting Started](/docs/getting-started) guide.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your local system. Then you can update your server using the following:

        sudo apt-get update && sudo apt-get upgrade

4. Test your YubiKey at [demo.yubico.com](https://demo.yubico.com) to make sure it's working correctly.

## Configure Your YubiKey

If your YubiKey still has its default configuration, you can skip this step. If you've made some changes, this section will tell you how to put the appropriate configuration for this guide onto slot *1* of your YubiKey. If you want to use a different slot, make sure you select it instead of slot 1 in the following instructions.

1. [Install](https://www.yubico.com/support/downloads/) the YubiKey Personalization Tool for your system and open it.

2. Click on the 'Yubico OTP' menu in the top-left corner, and select 'Quick'. Your screen should look like the one below.

[![YubiKey Personalization Tool](/docs/assets/yubikey-personalization-small.png)](/docs/assets/yubikey-personalization.png)

3. Click 'Write Configuration'. Click 'Cancel' on the window that pops up asking you where to save the log file.

![Prompt to save the log file](/docs/assets/yubikey-log-window.png)

4. Now select 'Upload to Yubico'. In the web form that opens, fill in your email address. Select the field asking for an 'OTP from the YubiKey', and touch the button on your YubiKey (or touch and hold if you programmed slot 2). It should spit out a string of letters into the field. Fill in the captcha and press 'Upload AES key'.

![AES key upload form](/docs/assets/yubikey-upload-form.png)

    {: .note}
    >
    > The page will respond with a table containing your key information. You should keep this data in a safe place (for example, print it and put it in a locked safe). Should you ever lose your YubiKey, you will need this data to reconfigure a new one with the same settings.

5. Test that your key works by following the instructions for single-factor authentication on [demo.yubico.com](https://demo.yubico.com). If it doesn't, you may need to wait up to 15 minutes for your key to process on their servers.

## Install the Authentication Software

1. Register for an API key [here](https://upgrade.yubico.com/getapikey/), by entering your email address and (with the 'YubiKey one time password' field selected) touch the button on your YubiKey. Hold onto the Client ID and Secret Key returned by the website.

2. On your Linode, install the `pam_yubico` package.

    On Ubuntu:

        sudo add-apt-repository ppa:yubico/stable
        sudo apt-get update
        sudo apt-get install libpam-yubico

    On Debian (Wheezy):

        sudo apt-get install libpam-yubico

    On Fedora/EPEL/Arch Linux:

        sudo yum install pam_yubico

    Otherwise, Yubico's documentation has instructions on [how to build `pam_yubico` from source](https://developers.yubico.com/yubico-pam/).

    {: .note}
    >
    > You may need to move `pam_yubico.so` to wherever PAM modules live on your system (usually `lib/security`). The Ubuntu package will automatically install the module in the appropriate location, but you can check to see whether it's in the right location with `ls /lib/security`. Otherwise, it may be stored in `/usr/local/lib/security`, and you will need to move it manually.

3. Create the file `/etc/ssh/authorized_yubikeys`:

        sudo touch /etc/ssh/authorized_yubikeys

4. Populate this file with the usernames of the users you want to enable two-factor authentication for, and their YubiKey IDs. You can obtain the ID by touching the button on the YubiKey in a text editor, and selecting only the *first 12 characters*. The first line only would be a typical configuration, however the subsequent lines show a configuration where the user `mallory` uses multiple YubiKeys and would like to access the server with all of them; as do `sterling` and `cyril`.

    {: .file}
    /etc/ssh/authorized_yubikeys
    :   ~~~
        username:vvklhtiubdcu
        mallory:ccurrufnjder:ccturefjtehv:cctbhunjimko
        sterling:ccdvnvlcbdre:vvvglinuddek
        cyril:vvddhfjjasui:vvfjidkflssd
        ~~~

5. To the start of `/etc/pam.d/sshd`, add `auth required pam_yubico.so id=<client id> authfile=/etc/ssh/yubikeys`, replacing `<client id>` with the ID you retrieved when applying for an API key, and `<secret key>` with the secret key. If you only want single-factor authentication (just a YubiKey or a password), change `required` to `sufficient` to tell the system that a valid YubiKey will be enough to log in.

    {: .file-excerpt}
    /etc/pam.d/sshd
    :   ~~~
        # PAM configuration for the Secure Shell service

        # Add your line below this one
        # v v v v v v
        auth required pam_yubico.so id=<client id> key=<secret key> authfile=/etc/ssh/yubikeys
        # ^ ^ ^ ^ ^ ^
        # Add your line above this one

        # Standard Un*x authentication.
        @include common-auth
        ~~~

    {: .note}
    >
    > On some systems, like Arch Linux, you will need to edit `/etc/pam.d/system-remote-login` instead of `/etc/pam.d/sshd`.

6. In `/etc/ssh/sshd_config`, either write or edit the following settings:

    {: .file-excerpt}
    /etc/ssh/sshd_config
    :   ~~~
        ChallengeResponseAuthentication yes
        UsePAM yes
        ~~~

    If you want to *only* use a YubiKey for single-factor authentication (i.e. no passwords allowed), also set `PasswordAuthentication no`.

7. Since you've edited SSH settings, you will need to restart your Linode. You can do this from the Linode Manager, or by typing `sudo reboot`.

## Log Back In

Now that this process is done, you can test your login by typing `ssh you@yoursite.net` (or whatever your SSH address is). You should be prompted, depending on your setup, for your YubiKey. All you need to do is touch the button—it will enter it for you. Then, type in your password if you didn't choose single-factor authentication. It will look something like the image below.

![SSH window](/docs/assets/yubikey-ssh.png)

You should proceed to log into your server. Enjoy the really cool feeling you experience as a result.

## Troubleshooting

If you're experiencing any problems, make sure you've read over the guide and restarted your server. If this doesn't solve your issues, you can enable logging:

1. To the end of the line you added in `/etc/pam.d/sshd`, add the word `debug`:

    {: .file-excerpt}
    /etc/pam.d/sshd
    :   ~~~
        auth required pam_yubico.so id=<client id> key=<secret key> authfile=/etc/ssh/yubikeys debug
        ~~~

2. Create a debug log file:

        sudo touch /var/run/pam-debug.log
        sudo chmod go+w /var/run/pam-debug.log

3. Log data to this file:

        sudo journalctl -f -l
        tail -f /var/run/pam-debug.log

4. Try logging in again and looking at this file for hints as to what might be causing the problem.

5. Once you're done, disable debugging by removing the `debug` flag from `/etc/pam.d/sshd` and deleting the log file.