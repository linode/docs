---
author:
  name: Linode
  email: docs@linode.com
description: 'Learn how to use Lish as a shell for managing or rescuing your Linode.'
keywords: ["Console", "Shell", "Lish", "rescue"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['using-lish-the-linode-shell/','troubleshooting/using-lish-the-linode-shell/','networking/using-the-linode-shell-lish/','platform/using-the-linode-shell-lish/']
modified: 2019-06-07
modified_by:
  name: Linode
published: 2009-08-04
title: 'Using the Linode Shell (Lish)'
classic_manager_link: platform/manager/using-the-linode-shell-lish-classic-manager/
---

![Using the Linode Shell (Lish)](using-the-linode-shell-lish.jpg)

The Linode Shell (*Lish*) provides console access to all of your Linodes. It also allows you to perform actions like rebooting a Linode or switching to a different configuration profile without having to open the Linode Manager. Lish is also a good rescue tool. The console provides out-of-band access to your Linode, which means you can use Lish to access your Linode even when you are unable to connect directly via SSH. This is useful if firewall settings or a bad network configuration prevent you from accessing your Linode using SSH. Lish can also be useful if you need to access your secure server on a local computer whose public key has not been added to the allowed list.

## Connect to Lish

There are two ways to access Lish. You can use a terminal application to connect to a *Lish SSH gateway*, or you can log in to the [Linode Cloud Manager](https://cloud.linode.com) and use the Lish console in your web browser. This section explains both methods.

 {{< note >}}
Lish used to be accessible via a direct SSH connection to your Linode's host machine, but as of May 10, 2013, all users must connect to a Lish SSH gateway to access Lish. For more information, please see [this blog post](https://blog.linode.com/2013/04/30/lish-ssh-gateway/).
{{< /note >}}

### Use a Terminal Application

You can connect to Lish with the SSH client of your choice. For example, you can use the Terminal application in Mac OS X, PuTTY in Windows, or your favorite X11 terminal emulator.

1.  Select a Lish SSH gateway. There's one in every data center. You can use any gateway to access your Linodes, but we recommend using one close to your Linode's data center. The gateway boxes are available over IPv4 and IPv6.

    | **Lish SSH gateway** | **Data Center** |
    | ---------------- | -----------|
    | `lish-atlanta.linode.com` | US, Atlanta, GA |
    | `lish-dallas.linode.com` | US, Dallas, TX |
    | `lish-fremont.linode.com` | US, Fremont, CA |
    | `lish-newark.linode.com` | US, Newark, NJ |
    | `lish-mum1.linode.com` | Mumbai, India |
    | `lish-singapore.linode.com` | Asia, Singapore, SG |
    | `lish-tokyo.linode.com` | Asia, Tokyo, JP |
    | `lish-tokyo2.linode.com` or `lish-shg1.linode.com` | Asia, Tokyo, JP |
    | `lish-tor1.linode.com` | Canada, Toronto, ON |
    | `lish-frankfurt.linode.com` | Europe, Frankfurt, DE |
    | `lish-london.linode.com` | Europe, London, UK |



1.  Open a terminal window and enter the following command, replacing `username` with your Linode Cloud Manager username, and `location` with your preferred Lish SSH gateway. Lish listens for connections on ports 22, 443, and 2200.

        ssh username@location

    For example, logging in as `user` via the Newark gateway would look like:

        ssh user@lish-newark.linode.com

    {{< note >}}
Users who have been granted "Access" rights on a particular Linode will have access to that Linode’s Lish console via the gateway. Linodes that a user can't access in the Linode Cloud Manager won’t show up in the Lish list. For more information about creating user accounts and configuring permissions, see [Accounts and Passwords](/docs/platform/manager/accounts-and-passwords-new-manager/).
{{< /note >}}

1.  Verify that the Lish SSH gateway's fingerprint is valid by verifying the Terminal's output against the list of our [Lish Gateway Fingerprints](#lish-gateway-fingerprints). Once verified, enter *yes* to proceed.

    {{< output >}}
The authenticity of host 'lish-newark.linode.com (66.228.40.59)' can't be established.
ECDSA key fingerprint is SHA256:57OGBNARJ1fhI+zrE3eTEeQWXVVDHRU8QHcP+BsWmN8.
Are you sure you want to continue connecting (yes/no)?
    {{</ output >}}

    {{< disclosure-note "ECDSA host key warning">}}
If after verifying the authenticity of the Lish SSH gateway's fingerprint, you receive a message indicating that the ECDSA host key differs from the key for the IP address, remove the cached IP address on your local machine. Ensure you replace `192.0.2.0` with the IP address indicated by the Terminal.

    ssh-keygen -R 192.0.2.0

Once you have removed the cached IP address, you can again attempt to SSH into the Lish gateway.

    {{</ disclosure-note >}}

1.  Enter the password you use to log in to the Linode Manager. You are now at the Lish shell. A list of your Linodes appears, as shown below:

        Linodes located in this data center:
        linode241706         Newark, NJ
        linode276072         Newark, NJ

        Linodes located in other data centers:
        linode287497         Dallas, TX

    {{< note >}}
You can add a public SSH key for Lish in the Linode Manager to automatically connect to Lish without a password. See [this section](#add-your-public-key) for more information.
{{< /note >}}

1.  At the Lish command prompt, type a Linode's name from the list. For example, typing `linode241706` will connect you to the screen console session for that Linode.

1.  Log in to the Linode with your username and password.

After you log in, you'll have console access to your Linode. You'll be able to restart services like `sshd`, edit firewall settings, and make other changes to your Linode. To exit your Linode's console, press **CTRL+A** then **D** to return to the host machine, and then press **CTRL+D** to return to the Lish menu. If you'd like to see the list of your Linodes again, type `list` from the gateway.

### Use a Web Browser

You can also connect to Lish using a web browser. This is useful when you don't have access to a terminal application, or if you just need quick and easy console access from the Linode Manager.

1. Log in to the [Linode Cloud Manager](https://cloud.linode.com).
1. Click on the Linodes link in the sidebar and select the desired Linode.
1. Click on the **Launch Console** link in the top right-hand corner of the Manager.

    ![Launch the Lish Console](launch-console.png)

1. The Lish Web Console window appears with your Linode's console, as shown below.

    ![An example of the Lish Web Console](lish-console.png)

1. From here, you can log in to your Linode with your root username and password, or any other username and password.

Now you can use the console, or exit to the Lish prompt by pressing **CTRL+A** then **D**. You cannot exit to a Lish gateway box using your web browser. To exit the session entirely, just close the Lish Web Console window.

### Add Your Public Key

If you don't want to enter your password every time you connect to Lish, you can add your public SSH key to the Linode Cloud Manager. If you haven't yet created SSH keys, please see our [Public Key Authentication with SSH](/docs/security/use-public-key-authentication-with-ssh/) guide for more information.

1. Log in to the [Linode Cloud Manager](https://manager.linode.com).

1. Click on your profile icon in the top right hand corner of the Manager and select **My Profile**.

1. Click on the **LISH** tab.

1. Copy your public SSH key into the **SSH Public Key** field, as shown below.

    ![Add your public ssh key](lish-add-public-key.png)

1. Click the **Save** button. Your Lish key will be saved in the Linode Cloud Manager.

Now you can log in to any of the Lish gateway boxes without having to type your password.

If you wish to disable Lish access for users without keys, use the **Authentication Mode** dropdown menu on the same page, and select **Allow key authentication only** then click **Save**.


## Understanding Lish Commands

The Lish shell provides access to many functions which are otherwise only accessible via the Linode Cloud Manager web-based administration tool. Enter the `help` command to see a full list of available commands. The output provides an introduction to Lish functionality:

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

{{< note >}}
You can activate the ability to scroll back through the Lish console by pressing **CTRL-A + ESC**
{{</ note >}}

## Advanced Lish Tricks

While the Lish interface as described above is useful as a basic command-line interface, you may find that you want to issue commands to your Linode without going through the Lish login process.

You can directly connect to a Linode's console:

    ssh -t [manager-username]@lish-[location].linode.com [linode-name]

You can also append Lish commands to the SSH command on your system prompt. For instance, to reboot your system, using your Linode Cloud Manager username, location, and the host-id for your Linode:

    ssh -t [manager-username]@lish-[location].linode.com [linode-name] reboot

Similarly, you can generate a view of the log using Lish:

    ssh -t [manager-username]@lish-[location].linode.com [linode-name] logview

This command format works for all Lish functionality.

## Lish Gateway Fingerprints

The valid fingerprints for the Lish gateway boxes are as follows:

### Atlanta

These are the fingerprints for the Lish gateway in our Atlanta data center (lish-atlanta.linode.com):

    RSA 59:30:1a:0b:93:5e:3f:4b:6f:d1:96:ff:7e:9e:12:f8
    ECDSA SHA256:8emv5PuUgPB2GFejMYWl1f4x1yj3YqAQPAYIrBm43ZI
    Ed25519 SHA256:7k2c442k+zqbGaraZvmqXM3MA5lCcthaR2lbrB651lg

### Dallas

These are the fingerprints for the Lish gateway in our Dallas data center (lish-dallas.linode.com):

    RSA 6d:3d:b5:d0:42:1c:49:45:a6:47:29:bd:88:4e:58:d4
    ECDSA SHA256:1fL1HTGas1APIpshCu1ZWys7LI97s8eTFN3+f8zEYXA
    Ed25519 SHA256:Ime9h7IAxAjBvMGR+G+EnbaLWpvXO+Z7TaGHzM9g5Sc

### Frankfurt

These are the fingerprints for the Lish gateway in our Frankfurt data center (lish-frankfurt.linode.com):

    RSA 43:76:22:43:0e:01:cb:84:6a:80:b9:9b:90:34:c7:b1
    ECDSA SHA256:e1FxEXiZVi6n13tagd1ZAQEW/fsRqz29ez5IfWf9kxg
    Ed25519 SHA256:vG1rnoGe7XRRY0nauJREQk75OamxCwRRpeaTDB8LpgM

### Fremont

These are the fingerprints for the Lish gateway in our Fremont data center (lish-fremont.linode.com):

    RSA 2c:43:0e:fc:88:f2:3a:dd:01:43:3a:fc:9f:67:9f:66
    ECDSA SHA256:fwuaKryHbvtKjFFviDocnMTNKWXUzfZSGPY8mgLgiNM
    Ed25519 SHA256:s3MVXFaTiL7Fb5oB0s9zMBk9VJsrkNxXXZfdeJG2enQ

### London

These are the fingerprints for the Lish gateway in our London data center (lish-london.linode.com):

    RSA 71:27:30:cd:dc:69:7a:fe:58:4a:04:e6:6b:5f:b4:e2
    ECDSA SHA256:mE/plOHLl+NJ7LUdW7AaMEOnhskXZxav5Em/rD6VZ5g
    Ed25519 SHA256:HXHM8/wCx7NrGsnfGpaexiBfOLKN9g0hoaL9wRaSeWg

### Mumbai

These are the fingerprints for the Lish gateway in our Mumbai data center (lish-mum1.linode.com):

    RSA 5:57:72:e0:79:a6:48:13:2b:8a:cd:1e:35:7c:c1:a2:ed
    ECDSA SHA256:uWVLSBPZ0E72VawrP4yWsW3YYHPM9b7A/seeEy7GG0c
    Ed25519 SHA256:5VkP3/dLsfrKic9p6y9QnFq4sKa92RBzxGJrsX5/dBQ

### Newark

These are the fingerprints for the Lish gateway in our Newark data center (lish-newark.linode.com):

    RSA 11:2a:57:a4:f8:ca:42:b2:c0:ab:17:58:0d:0c:b7:8b
    ECDSA SHA256:57OGBNARJ1fhI+zrE3eTEeQWXVVDHRU8QHcP+BsWmN8
    Ed25519 SHA256:tyelNHfgaPGbN2cppfJVr/db3/pHnItR9maW+ocAS18

### Singapore

These are the fingerprints for the Lish gateway in our Singapore data center (lish-singapore.linode.com):

    RSA 06:26:d8:2a:12:8b:2f:d7:6c:54:72:5a:a7:7b:da:7b
    ECDSA SHA256:rFYWuld4hWMbTzX+xZMuQ3kxiJ6t8A+FNQ5k889mKEA
    Ed25519 SHA256:q1G1pBrLuhsUAnZ04SOYoxVthKYyLz+wA0hBAUVkKtE

### Tokyo

These are the fingerprints for the Lish gateway in our Tokyo data center (lish-tokyo.linode.com):

    RSA af:ec:f0:b8:87:33:d5:12:04:0d:7c:bb:a6:c5:5f:be
    ECDSA SHA256:smE6PUuuG6tR4N8kN8UpoPx+XyVtAwxQ2dHuwoVS6eY
    Ed25519 SHA256:xAs8SdX91L7Xw5q9H+GGR5N9DoPGxP5RKG3aTvR60zw

### Tokyo 2

These are the fingerprints for the Lish gateway in our Tokyo2 data center (lish-tokyo2.linode.com):

    RSA 2c:60:9a:ce:cf:4b:8d:4e:8f:09:ae:e0:c2:b0:fb:b7
    ECDSA SHA256:0sRmstQ+6lfa4KwnAIQvuZMunq8KKNmu/n4KeAcAXmg
    Ed25519 SHA256:SWEV04SJt+DDG4ov2AfDYdZRavcg4GHufNP60QRkZzk

### Toronto

These are the fingerprints for the Lish gateway in our Toronto data center (lish-tor1.linode.com):

    RSA 4a:d9:fb:43:b8:0e:7f:fd:d3:cd:fc:87:06:61:51:df
    ECDSA SHA256:iAWnqR3XYcooliTQ7W1tiMmjsA4k1WJVItvLz4lUxQE
    Ed25519 SHA256:TSbQmRFaaWEHKEwgwvqQFKMfHKduPftou9/ue9K/Z2c
