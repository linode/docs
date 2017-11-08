---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Generate a GPG key-pair, and convert it to an SSH key for authentication with your Linode.'
keywords: ["gpg", "ssh", "authentication", "ssh-agent", "gpg-agent", "yubikey", "smartcard", "ssh key"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
title: 'How to use a GPG key for SSH authentication'
contributor:
  name: Huw Evans
  link: https://github.com/huw
external_resources:
 - '[Securely set up smartcard](https://gist.github.com/abeluck/3383449)'
 - '[Instructions for GPG 2.1](https://incenp.org/notes/2015/gnupg-for-ssh-authentication.html)'
modified: 2016-10-03
modified_by:
  name: Alex Fornuto
published: 2016-10-03
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

![GPG key for SSH Authentication](/docs/assets/gpg-key-for-ssh-authentication/How_to_use_a_GPG_key_smg.jpg)

You may be familiar with [public key authentication](/docs/security/use-public-key-authentication-with-ssh) for Secure Shell (SSH) on your Linode. But you may not have known that you can also use a GNU Privacy Guard (GPG) keypair to authenticate with SSH.

The chief benefit of this method is that instead of having separate keys for GPG messaging and SSH authentication, they can both belong to the same GPG keyring. This configuration really shines, however, when used with a [GPG smartcard](https://en.wikipedia.org/wiki/OpenPGP_card) or [YubiKey](https://www.yubico.com/products/yubikey-hardware/), because the card/dongle can store the underlying private key and only authenticate SSH sessions when it's plugged in. WIRED reported that [engineers at Facebook use this method](http://www.wired.com/2013/10/facebook-yubikey/) for authenticating with local servers, so why shouldn't you?

This guide will show you how to generate a GPG key, set up your computer to serve it in place of an SSH key, and put the new public key onto your server for authentication. It will also detail how to optionally move your GPG private key onto a smartcard or YubiKey to prevent authentication when the device isn't plugged into your computer.

## Before You Begin

{{< note >}}
This guide will only work on UNIX-based (Linux & OS X) machines! The process is very complicated on Windows but may be possible with some research.
{{< /note >}}

This guide assumes:

 - You have a fully functional Linode
 - You have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and updated your Linode with `sudo apt-get update && sudo apt-get upgrade`)
 - You are familiar with the [command line](/docs/tools-reference/introduction-to-linux-concepts#so-youre-staring-at-a-shell-prompt)

You don't necessarily need to be familiar with [SSH public key authentication](/docs/security/use-public-key-authentication-with-ssh) or [GPG encryption](https://en.wikipedia.org/wiki/GNU_Privacy_Guard), but an understanding of their operation will help you out if you run into problems.

## Generate a GPG Keypair

This section explains how to generate a new GPG keypair. If you already have one, you may skip these steps, as the next section will include instructions for how to create a subkey to use specifically for authentication. You will just need the 8-digit ID for your existing key to do so.

{{< caution >}}
As an additional security measure, this process may be undertaken on an offline (non network-connected) machine or single-use Virtual Machine (VM). After installing the pre-requisite packages and *only* the pre-requisite packages, disconnect it from the network and continue with the steps below.
{{< /caution >}}

All of these steps should be performed on a local machine, *not* your Linode.

1.  Install GPG:

    On Debian and its derivatives:

        sudo apt-get install gnupg2

    On OS X:

    [GPGTools](https://gpgtools.org) provides the simplest implementation of GPG for OS X. Otherwise, you could run `brew install gnupg2` if you have [Homebrew](https://brew.sh).

    On other operating systems, this process should be fairly clear. GPG is likely already installed, but if it isn't, a quick internet search should give you the instructions you need.

2.  Open a command prompt and execute:

        gpg2 --gen-key

3.  When prompted to select the kind of key you want, select `(1) RSA and RSA`.

4.  When asked for a keysize, type `4096`. If you want to store your key on a YubiKey Neo or certain smartcards, you may be restricted to a 2048-bit key size, so ensure that you aware of limitations for your device, if applicable.

5.  Choose an expiration period that you think will be suitable for this key. **After that date, the key will no longer work, so choose carefully.**

6.  Enter your full name, email address, and a comment (if you want). Select `O` for 'Okay'.

7.  After looking over your shoulders for secret agents, enter a long and secure passphrase that will be used to encrypt your key in local storage. Write this down somewhere you know to be physically secure while your computer generates the keypair.

Once this is done, your output should resemble the following:

    $ gpg2 --gen-key
    Please select what kind of key you want:
       (1) RSA and RSA (default)
       (2) DSA and Elgamal
       (3) DSA (sign only)
       (4) RSA (sign only)
    Your selection? 1
    RSA keys may be between 1024 and 4096 bits long.
    What keysize do you want? (2048) 4096
    Requested keysize is 4096 bits
    Please specify how long the key should be valid.
             0 = key does not expire
          <n>  = key expires in n days
          <n>w = key expires in n weeks
          <n>m = key expires in n months
          <n>y = key expires in n years
    Key is valid for? (0) 1y
    Key expires at Sun Apr  9 18:27:05 2017 AEST
    Is this correct? (y/N) y

    GnuPG needs to construct a user ID to identify your key.

    Real name: Your Name
    Email address: you@yoursite.net
    Comment: Test for GPG -> SSH
    You selected this USER-ID:
        "Your Name (Test for GPG -> SSH) <you@yoursite.net>"

    Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O
    You need a Passphrase to protect your secret key.

    We need to generate a lot of random bytes. It is a good idea to perform some other action (type on the keyboard, move the mouse, utilize the disks) during the prime generation; this gives the random number generator a better chance to gain enough entropy.
    gpg: key 71735D23 marked as ultimately trusted
    public and secret key created and signed.

    pub   4096R/71735D23 2016-04-09 [expires: 2017-04-09]
          Key fingerprint = 4B63 8069 E016 F6E9 35BA  24B9 FFDD B2DF 7173 5D23
    uid       [ultimate] Your Name (Test for GPG -> SSH) <you@yoursite.net>
    sub   4096R/693C5635 2016-04-09 [expires: 2017-04-09]

This process has created a master GPG key and a subkey for encrypting messages and files. To authenticate with SSH, we need to generate a second subkey for authentication.

### Generating the Authentication Subkey

1.  In a command prompt or terminal, type:

        gpg2 --expert --edit-key key-id

    Replace `key-id` with the eight-character string output from the key generation process. This will be found in the line beginning with `pub`. In the example above, the ID is `71735D23`.

2.  At the new `gpg> ` prompt, enter:

        addkey

3.  When prompted, enter your passphrase.

4.  When asked for the type of key you want, select: `(8) RSA (set your own capabilities)`.

5.  Enter `S` to toggle the 'Sign' action off.

6.  Enter `E` to toggle the 'Encrypt' action off.

7.  Enter `A` to toggle the 'Authenticate' action on. The output should now include `Current allowed actions: Authenticate`, with nothing else on that line.

8.  Enter `Q` to continue.

9.  When asked for a keysize, choose `4096`. The same limitation from Step 4 in the first section applies, so ensure your card/YubiKey can support this key size.

10. Enter an expiration date, just as before. You should probably keep this the same as the first one. If you choose a lower expiration date, your main private key will continue to function but your SSH authentication will break on this date.

11. When you're sure all of the information entered is correct, enter `y` at the `Really create? (y/N)` prompt to complete the process.

12. Once the key is created, enter `quit` to leave the gpg prompt, and `y` at the prompt to save changes.

Your terminal should now look like this:

    $ gpg2 --expert --edit-key 71735D23

    Secret key is available.

    pub  4096R/71735D23  created: 2016-04-09  expires: 2017-04-09  usage: SC
                         trust: ultimate      validity: ultimate
    sub  4096R/693C5635  created: 2016-04-09  expires: 2017-04-09  usage: E
    [ultimate] (1). Your Name (Test for GPG -> SSH) <you@yoursite.net>

    gpg> addkey
    Key is protected.

    You need a passphrase to unlock the secret key for
    user: "Your Name (Test for GPG -> SSH) <you@yoursite.net>"
    4096-bit RSA key, ID 71735D23, created 2016-04-09

    Please select what kind of key you want:
       (3) DSA (sign only)
       (4) RSA (sign only)
       (5) Elgamal (encrypt only)
       (6) RSA (encrypt only)
       (7) DSA (set your own capabilities)
       (8) RSA (set your own capabilities)
    Your selection? 8

    Possible actions for a RSA key: Sign Encrypt Authenticate
    Current allowed actions: Sign Encrypt

       (S) Toggle the sign capability
       (E) Toggle the encrypt capability
       (A) Toggle the authenticate capability
       (Q) Finished

    Your selection? S

    Possible actions for a RSA key: Sign Encrypt Authenticate
    Current allowed actions: Encrypt

       (S) Toggle the sign capability
       (E) Toggle the encrypt capability
       (A) Toggle the authenticate capability
       (Q) Finished

    Your selection? E

    Possible actions for a RSA key: Sign Encrypt Authenticate
    Current allowed actions:

       (S) Toggle the sign capability
       (E) Toggle the encrypt capability
       (A) Toggle the authenticate capability
       (Q) Finished

    Your selection? A

    Possible actions for a RSA key: Sign Encrypt Authenticate
    Current allowed actions: Authenticate

       (S) Toggle the sign capability
       (E) Toggle the encrypt capability
       (A) Toggle the authenticate capability
       (Q) Finished

    Your selection? Q
    RSA keys may be between 1024 and 4096 bits long.
    What keysize do you want? (2048) 4096
    Requested keysize is 4096 bits
    Please specify how long the key should be valid.
             0 = key does not expire
          <n>  = key expires in n days
          <n>w = key expires in n weeks
          <n>m = key expires in n months
          <n>y = key expires in n years
    Key is valid for? (0) 1y
    Key expires at Sun Apr  9 18:49:58 2017 AEST
    Is this correct? (y/N) y
    Really create? (y/N) y
    We need to generate a lot of random bytes. It is a good idea to perform some other action (type on the keyboard, move the mouse, utilize the disks) during the prime generation; this gives the random number generator a better chance to gain enough entropy.

    pub  4096R/71735D23  created: 2016-04-09  expires: 2017-04-09  usage: SC
                         trust: ultimate      validity: ultimate
    sub  4096R/693C5635  created: 2016-04-09  expires: 2017-04-09  usage: E
    sub  4096R/48B9C23C  created: 2016-04-09  expires: 2017-04-09  usage: A
    [ultimate] (1). Your Name (Test for GPG -> SSH) <you@yoursite.net>

    gpg> quit
    Save changes? (y/N) y

### Secure Your GPG Key

{{< caution >}}
If you fail to back up or otherwise secure your key, any hardware failure will lead to you being unable to access your Linode with this key. If you lock out password access through SSH, you'll need to use [Lish](/docs/networking/using-the-linode-shell-lish) to regain access.
{{< /caution >}}

You should always have a backup of your private key in case something goes wrong and you end up locked out of everything that requires it. This private key, along with the instructions in this guide, will be enough to get your setup working again if you need to start afresh on a new computer.

1.  Back up your `~/.gnupg` folder with the following command, replacing `USB_DEVICE` with the name of your device:

        cp -r ~/.gnupg/ /Volumes/USB_DEVICE/

    This assumes you have a storage device mounted at `/Volumes/USB_DEVICE/`. Different operating systems may use different naming conventions for this path. You can safely ignore any `Operation not supported on socket` warnings that appear when you enter this command.

2.  Back up your private key, replacing `key-id` with the eight-character key ID for your private key:

        gpg2 -a --export-secret-key key-id >> /Volumes/USB_DEVICE/key-id.master.key

3.  Back up your subkeys, replacing `key-id` with the eight-character key ID for each subkey:

        gpg2 -a --export-secret-subkeys key-id >> /Volumes/USB_DEVICE/<key id>.sub.key

If something bad happens and you lose your keys, you can re-import them by overwriting the `~/.gnupg` directory with your copy, and using:

    gpg2 --allow-secret-key-import --import key-file

Be sure to replace `key-file` with the location of each of your files.

### Export Your Public Key

If you're working on a VM or offline machine, you'll also need to export your public key to be reimported later:

    gpg2 -a --export key-id >> /Volumes/USB_DEVICE/key-id.public.key

Be sure to replace `key-id` with your own key ID.

You can reimport it with the ever-handy `gpg2 --import key-file` command.

## Move Your Key to a Smartcard or YubiKey (Optional)

{{< note >}}
If you're using a brand new YubiKey, you'll need to enable OpenPGP Card / CCID Mode first. This can be done through the YubiKey Personlisation Tool, or by running `ykpersonalise -m82`. `ykpersonalise` can be installed through your package manager.
{{< /note >}}

### Secure Your Card

It is assumed that you have already configured your card/YubiKey's (herein referred to as 'GPG device') owner information. It is highly recommended that you secure your card before you start this section.

{{< note >}}
Some of these commands may ask for a PIN or Admin PIN. The default PIN is usually `123456`, and the default Admin PIN is usually `12345678`. If these don't work, contact the manufacturer or review online documentation.
{{< /note >}}

1.  Plug in the device and execute:

        gpg2 --card-edit

2.  Enable admin commands:

        admin

3.  Enter the password change menu:

        passwd

4.  Change the password to your device by selecting `2 - unblock PIN`. This will unblock your PIN, and prompt you to change it. This PIN will be required every time you want to access your GPG key (e.g. every time you authenticate with SSH), and has a limit of eight characters.

5.  Change the admin PIN by selecting `3 - change Admin PIN`. This PIN is required to make administrative changes, like in step 2, and has a limit of 6 characters. For optimum security, never store this PIN in a digital location, since it will be unnecessary for daily use of the YubiKey.

6.  Exit these menus by selecting `Q` and then typing `quit`.

For reference, your window should resemble the following. This example is abbreviated:

    $ gpg2 --card-edit
    gpg/card> admin
    Admin commands are allowed

    gpg/card> passwd
    gpg: OpenPGP card no. D0000000000000000000000000000000 detected

    1 - change PIN
    2 - unblock PIN
    3 - change Admin PIN
    4 - set the Reset Code
    Q - quit

    Your selection? 1
    PIN changed.
    Your selection? 3
    PIN changed.
    Your selection? q

    gpg/card> quit

### Transfer Your Subkey

1.  Enter the key edit menu from a normal command prompt, replacing `key-id` with your own key ID:

        gpg2 --edit-key key-id

2.  Switch to the private key editor:

        toggle

3.  Select only the authentication subkey:

        key 2

    Remember, if you have more subkeys this command should be changed as appropriate.

4.  Transfer the key:

        keytocard

5.  Select `(3) Authentication key` to store your key on the third slot of the device. If this is not an option, ensure that you've selected the appropriate subkey.

6.  Enter your passphrase.

7.  Type `save` to exit this menu.

8.  If you're working on a VM or offline machine, export the subkey stubs (pointers so GPG knows your subkeys are on the device):

        gpg -a --export-secret-subkeys key-id >> /Volumes/USB_DEVICE/key-id.stubs.gpg

    Be sure to substitute your own key ID for `key-id`. You can reimport these with an ordinary `gpg2 --import <stub file>` on your private machine.

After all this, your output should resemble the following:

    $ gpg2 --edit-key 71735D23

    Secret key is available.

    pub  4096R/71735D23  created: 2016-04-09  expires: 2017-04-09  usage: SC
                     trust: ultimate      validity: ultimate
    sub  4096R/693C5635  created: 2016-04-09  expires: 2017-04-09  usage: E
    sub  4096R/48B9C23C  created: 2016-04-09  expires: 2017-04-09  usage: A
    [ultimate] (1) Your Name <you@yoursite.net>

    gpg> toggle

    sec  4096R/71735D23  created: 2016-04-09  expires: 2017-04-09
    ssb  4096R/693C5635  created: 2016-04-09  expires: never
    ssb  4096R/48B9C23C  created: 2016-04-09  expires: never
    (1) Your Name <you@yoursite.net>

    gpg> key 2

    sec  4096R/71735D23  created: 2016-04-09  expires: 2017-04-09
    ssb  4096R/693C5635  created: 2016-04-09  expires: never
    ssb* 4096R/48B9C23C  created: 2016-04-09  expires: never
    (1) Your Name <you@yoursite.net>

    gpg> keytocard
    Signature key ....: none
    Encryption key....: none
    Authentication key: none

    Please select where to store the key:
       (3) Authentication key
    Your selection? 3

    You need a passphrase to unlock the secret key for
    user: "Your Name <you@yoursite.net>"
    4096-bit RSA key, ID 71735D23, created 2016-04-09

    gpg> save

Congratulations! You've successfully transferred your authentication subkey to your device.

{{< caution >}}
If you weren't using a VM or offline machine, back up your local copies of the private keys, delete them, and ensure that the rest of the keys are still on the card.
{{< /caution >}}

## Serve Your GPG key Instead of an SSH key

In this section, we'll configure your local machine so the connection between GPG and SSH works properly.

Return to your local machine, import all of the appropriate GPG keys and insert the appropriate GPG device. Install GPG if you don't already have it on your local computer (e.g. if you performed all the above steps on a VM).

1.  Edit the `~/.bash_profile` file (or similar shell startup file) to include:

    **Linux:**

    {{< file-excerpt "~/.bash_profile" >}}
if [ -f "${HOME}/.gpg-agent-info" ]; then
     source "${HOME}/.gpg-agent-info"
       export GPG_AGENT_INFO
       export SSH_AUTH_SOCK
       export SSH_AGENT_PID
else
    eval $( gpg-agent --daemon --write-env-file ~/.gpg-agent-info )
fi

{{< /file-excerpt >}}


    **OS X**

    {{< file-excerpt "~/.bash_profile" >}}
[ -f ~/.gpg-agent-info ] && source ~/.gpg-agent-info
if [ -S "${GPG_AGENT_INFO%%:*}" ]; then
    export GPG_AGENT_INFO
    export SSH_AUTH_SOCK
    export SSH_AGENT_PID
else
    eval $( gpg-agent --daemon --write-env-file ~/.gpg-agent-info )
fi

{{< /file-excerpt >}}


    This ensures that SSH can 'see' your GPG keys and automatically starts `gpg-agent` as needed.

2.  Edit or create `~/.gnupg/gpg-agent.conf`:

    {{< file-excerpt "~/.gnupg/gpg-agent.conf" >}}
default-cache-ttl 600
max-cache-ttl 7200
enable-ssh-support
write-env-file ~/.gpg-agent-info

{{< /file-excerpt >}}


    If you're on OS X and previously installed [GPGTools](https://gpgtools.org/), you can also add the line:

        pinentry-program /usr/local/MacGPG2/libexec/pinentry-mac.app/Contents/MacOS/pinentry-mac

    This allows you to use the PIN entry program provided by GPGTools.

3.  Restart the GPG agent:

        sudo killall gpg-agent
        gpg-agent --daemon --write-env-file ~/.gpg-agent-info --enable-ssh-support
        source ~/.gpg-agent-info

## Add the New Key to Your Linode

The steps from the previous sections will take your GPG keys and pipe them through SSH so they can be used for authentication. The result of this process is that you've created a new RSA public key for use with SSH authentication.

1.  On your local machine, extract the public key:

        ssh-add -L

    You should see a long output of alphanumeric characters. If you see `The agent has no identities`, try the steps to restart the GPG agent from above.

2.  Copy the whole string of output, including `ssh-rsa`. If you see multiple strings beginning with `ssh-rsa`, copy the one that ends with `cardno:`. It might look like this:

        ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDxAZn1IQ2cBxIbgwksWOfkAMKKLa3cUYMkbQBaR9Nw4CfoLs8xiu0Kb8oN4JH6p+E4C1MrlmFQuMZbVzs9JseV2pe6kw0xKQgLINopyF6letzCOEzPH7THicxyQc35vMIa8JTAMU6X3hpzzSUVSQGKDljj+c4XayTZCVQVg2Yqc67Vdm+4q4OQCU7Fns73KWmqwsdYtuyk74yPWjAvKkEaW7I9d3TLKVI8LLdzC6FoP2jJyGEoqxWEf2yL0eWelmJi/ikLJFSdXvdVCzvyI3dTeNqEdaisKQ0SJ7W0ysH1Os2hYyxBazWonMYI/T8Sh9J21xcWGmBumFTIcsbLEP17tojR4ttFq69ebtJIMkbPo0e+u4gWdvM44MyWsDm8jkKDuqNcduGIhF0dFY57niq4TEv5+Yvya2gwqBS4ttq/NlUAseL4zAcaP+kpDae4GMiRXwpFAiKA3ctn6/gf5QLvcAHMz62ASHeo9gG9t6n0eGUzBD/lv0qMsaYgmxfgIpqoU6Sr1w2EVp8TYjIVAaO/96Kljb2v9mB+0/BTO7gxJicxUNYQLOhEYdMnbr0bFNAG93hlUiq5eGTTG7nn1mre2OHWyGB8fZN9EukbMeFicgFTxgl3ddQawjn1Qb6u//ZpSCD++IH4HQCjz1fI9r+yZ+6CqfUrM0PI+dwAfcL4pw== cardno:000500001BDE

3.  Paste this into a new file (for example, `~/gpg-key.pub`) and save it.

4.  Copy the file to your Linode:

        scp ~/gpg-key.pub you@yoursite.net:/home/you/.ssh/gpg-key.pub

5.  Log into your Linode and append the key to the `authorized_hosts` file:

        ssh you@yoursite.net "echo `cat ~/.ssh/gpg-key.pub` >> ~/.ssh/authorized_keys"

You're done! Disconnect, and all new logins should now use your GPG key instead of a passphrase. This SSH key can also be used with GitHub, Bitbucket, other SSH-based Version Control Systems, or anywhere else that accepts SSH keys.
