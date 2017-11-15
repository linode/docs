---
author:
  name: Linode
  email: docs@linode.com
description: 'Learn how to use Lish as a shell for managing or rescuing your Linode.'
keywords: ["Console", "Shell", "Lish", "rescue"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['using-lish-the-linode-shell/','troubleshooting/using-lish-the-linode-shell/']
modified: 2016-11-21
modified_by:
  name: Linode
published: 2009-08-04
title: 'Using the Linode Shell (Lish)'
---

![Using the Linode Shell (Lish)](/docs/assets/using-the-linode-shell-lish.jpg "Using the Linode Shell (Lish)")

The Linode Shell (*Lish*) provides console access to all of your Linodes. It also allows you to perform actions like rebooting a Linode or switching to a different configuration profile without having to open the Linode Manager. Lish is also a good rescue tool. The console provides out-of-band access to your Linode, which means you can use Lish to access your Linode even when you are unable to connect directly via SSH. This is useful if firewall settings or a bad network configuration prevent you from accessing your Linode using SSH. Lish can also be useful if you need to access your secure server on a local computer whose public key has not been added to the allowed list.

## Connect to Lish

There are two ways to access Lish. You can use a terminal application to connect to a *Lish SSH gateway*, or you can log in to the [Linode Manager](https://manager.linode.com) and use the Lish console in your web browser. This section explains both methods.

 {{< note >}}
Lish used to be accessible via a direct SSH connection to your Linode's host machine, but as of May 10, 2013, all users must connect to a Lish SSH gateway to access Lish. For more information, please see [this blog post](https://blog.linode.com/2013/04/30/lish-ssh-gateway/).
{{< /note >}}

### Use a Terminal Application

You can connect to Lish with the SSH client of your choice. For example, you can use the Terminal application in Mac OS X, PuTTY in Windows, or your favorite X11 terminal emulator.

1.  Select a Lish SSH gateway. There's one in every data center. You can use any gateway to access your Linodes, but we recommend using one close to your Linode's data center. The gateway boxes are available over IPv4 and IPv6.
    -   lish-atlanta.linode.com
    -   lish-dallas.linode.com
    -   lish-frankfurt.linode.com
    -   lish-fremont.linode.com
    -   lish-london.linode.com
    -   lish-newark.linode.com
    -   lish-singapore.linode.com
    -   lish-tokyo.linode.com
    -   lish-tokyo2.linode.com

2.  Open a terminal window and enter the following command, replacing `username` with your Linode Manager username, and `location` with your preferred Lish SSH gateway. Lish listens for connections on ports 22, 443, and 2200.

        ssh username@location

    For example, logging in as `user` via the Newark gateway would look like:

        ssh user@lish-newark.linode.com

	{{< note >}}
Users who have been granted "Access" rights on a particular Linode will have access to that Linode’s Lish console via the gateway. Linodes that a user can't access in the Linode Manager won’t show up in the Lish list. For more information about creating user accounts and configuring permissions, see [Accounts and Passwords](/docs/accounts-and-passwords).
{{< /note >}}

3.  Verify that the Lish SSH gateway's fingerprint is valid. [Click here](#lish-gateway-fingerprints) for more information.
4.  Enter the password you use to log in to the Linode Manager. You are now at the Lish shell. A list of your Linodes appears, as shown below:

        Linodes located in this data center:
        linode241706         Newark, NJ
        linode276072         Newark, NJ

        Linodes located in other data centers:
        linode287497         Dallas, TX

	{{< note >}}
You can add a public SSH key for Lish in the Linode Manager to automatically connect to Lish without a password. See [this section](#add-your-public-key) for more information.
{{< /note >}}

5.  At the Lish command prompt, type a Linode's name from the list. For example, typing `linode241706` will connect you to the screen console session for that Linode.
6.  Log in to the Linode with your username and password.

After you log in, you'll have console access to your Linode. You'll be able to restart services like `sshd`, edit firewall settings, and make other changes to your Linode. To exit your Linode's console, press **CTRL+A** then **D** to return to the host machine, and then press **CTRL+D** to return to the Lish menu. If you'd like to see the list of your Linodes again, type `list` from the gateway.

### Use a Web Browser

You can also connect to Lish using a web browser. This is useful when you don't have access to a terminal application, or if you just need quick and easy console access from the Linode Manager.

1.  Log in to the Linode Manager.
2.  Select a Linode.
3.  Click on the **Remote Access** tab.
4.  In the **Console Access** section, click **Launch Lish Console**, as shown below.

    [![Click Lish via Browser.](/docs/assets/lish-via-browser.png)](/docs/assets/lish-via-browser.png)

5.  The Lish Web Console window appears with your Linode's console, as shown below.

    [![Ajax Lish](/docs/assets/1283-lish_ajax.png)](/docs/assets/1283-lish_ajax.png)

6.  From here, you can log in to your Linode with your root username and password, or any other username and password.

Now you can use the console, or exit to the Lish prompt by pressing **CTRL+A** then **D**. You cannot exit to a Lish gateway box using your web browser. To exit the session entirely, just close the Lish Web Console window.

### Add Your Public Key

If you don't want to enter your password every time you connect to Lish, you can add your public SSH key to the Linode Manager. If you haven't yet created SSH keys, please see our [Public Key Authentication with SSH](/docs/security/use-public-key-authentication-with-ssh/) guide for more information.

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Select the **my profile** link.
3.  Enter your password, and then click **Authenticate**, as shown below.

    [![Re-enter your password.](/docs/assets/1280-manager_reauth_linodedemo.png)](/docs/assets/1280-manager_reauth_linodedemo.png)

4.  Select the **Lish Settings** tab.
5.  Copy your public SSH key into the **Lish Keys** field, as shown below.

    [![Copy your SSH public key(s) into the text field.](/docs/assets/1282-manager_lish_keys.png)](/docs/assets/1282-manager_lish_keys.png)

6.  Click **Submit Keys**. Your Lish key will be saved in the Linode Manager.

Now you can log in to any of the Lish gateway boxes without having to type your password.

If you wish to disable Lish access for users without keys, use the **Authentication modes** dropdown menu on the same page, and then click **Save Setting**.


## Understanding Lish Commands

The Lish shell provides access to many functions which are otherwise only accessible via the Linode Manager web-based administration tool. Enter the `help` command to see a full list of available commands. The output provides an introduction to Lish functionality:

    kill            - kill stuck screen sessions
    exit            - exit from lish
    help            - this menu

    [return]        - connect to console
    version         - display running kernel version
    boot            - boot last used (or the only) config profile
    boot N          - boot the specified config profile
    shutdown        - shut down the Linode
    reboot          - shut down, then boot the last used config profile
    reboot N        - shut down, then boot the specified config profile
    sysrq X         - send SysRq X to your Linode
    destroy         - pulls the plug on a running Linode, no fs sync, no warning

    jobs            - view the job queue for your Linode
    configs         - view the configuration profiles for your Linode
    config N        - view configuration profile details for profile N
    status          - view the status of your Linode
    logview         - view contents of console log

There are two ways to run these commands for a specific Linode. If you are at the main Lish gateway, you can prefix the command with a Linode ID, like this:

    linode123456 logview

You can also bring up the Linode's console, then type **CTRL+A** then **D** to drop back to the host for that Linode. Now all of the commands above will be run for that Linode specifically. To exit back to the main Lish menu, type `exit`.

## Advanced Lish Tricks

While the Lish interface as described above is useful as a basic command-line interface, you may find that you want to issue commands to your Linode without going through the Lish login process.

You can directly connect to a Linode's console:

    ssh -t [manager-username]@lish-[location].linode.com [linode-name]

You can also append Lish commands to the SSH command on your system prompt. For instance, to reboot your system, using your Linode Manager username, location, and the host-id for your Linode:

    ssh -t [manager-username]@lish-[location].linode.com [linode-name] reboot

Similarly, you can generate a view of the log using Lish:

    ssh -t [manager-username]@lish-[location].linode.com [linode-name] logview

This command format works for all Lish functionality.


## Lish Gateway Fingerprints

The valid fingerprints for the Lish gateway boxes are as follows:

### Atlanta

These are the fingerprints for the Lish gateway in our Atlanta data center (lish-atlanta.linode.com):

    RSA 59:30:1a:0b:93:5e:3f:4b:6f:d1:96:ff:7e:9e:12:f8
    DSA 0b:90:ed:f2:a1:e0:55:5b:38:6e:5d:6e:fa:00:63:7f
    ECDSA SHA256 9V/AK2EcQFjYzm1PU3XhOJbzhwYCoqqThl2vnFxbyvg

### Dallas

These are the fingerprints for the Lish gateway in our Dallas data center (lish-dallas.linode.com):

    RSA 6d:3d:b5:d0:42:1c:49:45:a6:47:29:bd:88:4e:58:d4
    DSA 58:bc:07:fa:c1:61:a4:3b:b5:00:3b:9b:6b:78:c6:c5
    ECDSA SHA256 IVXyNAH78L7KJFgfrScp948+56BTew8Z41nOkAw2kGo

### Frankfurt

These are the fingerprints for the Lish gateway in our Frankfurt data center (lish-frankfurt.linode.com):

    RSA 43:76:22:43:0e:01:cb:84:6a:80:b9:9b:90:34:c7:b1
    DSA 87:2d:c9:5a:76:06:e6:3d:08:70:1b:2e:a6:b4:e8:c2
    ECDSA SHA256 4F/M6SYqrukVHJJbCkzw4tw4TjRVfAY98cDKwqXT9MY

### Fremont

These are the fingerprints for the Lish gateway in our Fremont data center (lish-fremont.linode.com):

    RSA 2c:43:0e:fc:88:f2:3a:dd:01:43:3a:fc:9f:67:9f:66
    DSA 19:30:1a:48:85:aa:78:ab:46:8d:0f:4d:00:88:e6:b7
    ECDSA SHA256 0BmmvUv/itqa1ruA4KmqzMFaY4Ijdw/YW+SoiMJT1mo

### London

These are the fingerprints for the Lish gateway in our London data center (lish-london.linode.com):

    RSA 71:27:30:cd:dc:69:7a:fe:58:4a:04:e6:6b:5f:b4:e2
    DSA ce:41:c0:48:2c:93:de:c8:d2:a9:bf:3f:97:1f:04:ad
    ECDSA SHA256 L7sQgnpnoBwRoyIYXAFBs8SdSnwtyYmhXs1p/mQDKQM

### Newark

These are the fingerprints for the Lish gateway in our Newark data center (lish-newark.linode.com):

    RSA 11:2a:57:a4:f8:ca:42:b2:c0:ab:17:58:0d:0c:b7:8b
    DSA a1:e2:f5:5a:71:f9:b8:98:d9:a6:4c:65:e5:05:ea:04
    ECDSA SHA256 p+fsr503gCnyZhAG7wx5mzrvw9MIPdgzvKauScUm8wk

### Singapore

These are the fingerprints for the Lish gateway in our Singapore data center (lish-singapore.linode.com):

    RSA 06:26:d8:2a:12:8b:2f:d7:6c:54:72:5a:a7:7b:da:7b
    DSA 0c:f9:f9:d6:f3:0a:f6:bb:82:82:07:4b:51:db:e2:35
    ECDSA SHA256 LzlyP1Uj1nne2KwCkB5HlOWoHLH/7YrApZlNCn5204A


### Tokyo

These are the fingerprints for the Lish gateway in our Tokyo data center (lish-tokyo.linode.com):

    RSA af:ec:f0:b8:87:33:d5:12:04:0d:7c:bb:a6:c5:5f:be
    DSA 1d:7d:bd:5c:a1:41:29:c3:78:de:e7:0f:d3:f2:63:34
    ECDSA SHA256 XcBYWsYm4p/bZ/tfWEntUzScDlTxvzTrmd7emeRBMJc

### Tokyo 2

These are the fingerprints for the Lish gateway in our Tokyo2 data center (lish-tokyo2.linode.com):

    RSA 2c:60:9a:ce:cf:4b:8d:4e:8f:09:ae:e0:c2:b0:fb:b7
    DSA 2d:0f:b0:a5:d0:bd:4a:71:1a:75:dc:de:b1:06:61:a6
    ECDSA SHA256 nE/1fY3QdCXuoTBfnvQtXzwFVOnO+/gbijm4ZM9wvaY
