---
slug: ssh-key-authentication-how-to-troubleshoot-permission-issues
description: 'Learn the basics of SSH keys and how to troubleshoot the most common SSH permission issues in this short guide.'
keywords: ['ssh key authentication', 'what is ssh', 'ssh keys']
tags: ['ssh', 'web server', 'cloud manager', 'linode platform']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-17
modified_by:
  name: Linode
title: "Troubleshoot SSH Key Authentication Issues"
external_resources:
- '[SSH Protocol](https://en.wikipedia.org/wiki/Secure_Shell_Protocol)'
- '[SSH Wikipedia](https://en.wikipedia.org/wiki/Secure_Shell_Protocol)'

authors: ["Jeff Novotny"]
---

## What is SSH (Secure Shell Protocol)?

The *Secure Shell Protocol* (SSH) increases the security of remote network services through the use of public-key cryptography. All SSH communications are encrypted using a "shared key", which is used to both encrypt and decrypt messages on both ends. This is referred to as *symmetrical encryption*. It permits users to log in to a server more securely with a password.

SSH also permits authentication and access without a password. It accomplishes this by using a manually generated public-private key pair, which enables asymmetrical encryption. Although asymmetrical encryption is more secure, errors can occur if there is a problem with the key at either end of the connection. In these cases, users might receive a `Permission denied (publickey)` error and be unable to connect. This can be especially troublesome if password authentication is turned off. This guide explains how to debug and resolve SSH public key permission errors that prevent access to your Linode.

## SSH Keys: An Overview

When SSH asymmetrical encryption is working properly, two keys are in operation. The client requesting access shares its public key with the target system, while secretly holding on to the private key. The private key can decrypt messages that were encrypted by the public key. However, the public key cannot decrypt messages from the private key, nor can it be used to reconstruct the private key.

To initiate the connection, the client sends the ID of the key pair to the target. The target uses the ID to retrieve the correct public key from its `authorized_keys` account. It generates a magic number, encrypts it using the key, and transmits it back to the originator. The client can decode this message because it possesses a private key. This enables it to echo the number back to the target, thereby verifying its identity.

All these messages are further encrypted using the shared session key that was generated when the connection was opened. The private-public key pair is not used to encrypt data after the connection is established. Only the shared session key is used for this. More detailed information about SSH can be found on the [SSH Wikipedia](https://en.wikipedia.org/wiki/Secure_Shell_Protocol) page.

## SSH Key Permission Errors: The Main Causes

If any part of the SSH negotiation fails, the connection is not established. In these cases, the error message `Permission denied (publickey)` is displayed. Most permission errors of this type can be traced back to one of the following three reasons:

1. The client is using the wrong public key or the wrong identifier.
1. The client does not possess a private key.
1. The target server does not have a copy of the public key.

Each of these cases is covered in its own separate section. The following instructions are geared to Ubuntu-style distributions, but are generally applicable to all Linux systems.

## Debug and Fix SSH Connection Errors

Before proceeding, you can extract some information about the failure and potentially work around the issue.

1. Retrieve more information about the cause of the errors using the `vvv` option. Substitute your `accountname` and `ip_address` of the target for the placeholder values. This command provides a log of the actions the client and target server take while trying to connect. A sample of the output is shown below.

        ssh -vvv <accountname>@<ip_address>

    {{< output >}}
debug1: Reading configuration data /etc/ssh/ssh_config
debug1: /etc/ssh/ssh_config line 47: Applying options for *
debug2: resolve_canonicalize: hostname XX.XX.XX.XX is address
debug2: ssh_connect_direct
debug1: Connecting to XX.XX.XX.XX[XX.XX.XX.XX] port 22.
debug1: Connection established.
debug1: identity file /Users/username/.ssh/id_rsa type 0
    {{< /output >}}

1. If password authentication is enabled on the target server, try to override the public key method altogether and simply use your password. Use the following command to force password authentication.

        ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no <accountname>@<ip_address>

1. If you were able to gain access to your Linode in the previous step, follow our [Use SSH Public Key Authentication on Linux, macOS, and Windows](/docs/guides/use-public-key-authentication-with-ssh/) guide to properly configure public key authentication.

1. (**Optional**) If you do not want to use public-key authentication in the future, turn off `PubKeyAuthentication` in the `/etc/ssh/sshd_config` file.

        vi /etc/ssh/sshd_config

    {{< file "/etc/ssh/sshd_config" aconf >}}
...
PubKeyAuthentication No
...
PasswordAuthentication Yes
...
    {{< /file >}}

1. If you turned off public key authentication (``PubKeyAuthentication``) in the previous step, restart the SSH daemon to apply the change.

        systemctl restart sshd

### SSH Client: Incorrect Key is in Use

If there are several keys on the client, it is possible that SSH is choosing an old or incorrect key. You can select a specific key using the `-i` option.

Specify the exact key pair using the following command:

    ssh -i /path/to/key/id_rsa <accountname>@<ip_address>

### The SSH Client Does Not Possess the Correct Private Key

This section covers the situation where the client does not have the correct private key and password authentication is not enabled on the server. In this case, use the [Linode Shell](/docs/products/compute/compute-instances/guides/lish/), also known as the LISH Console, to access the Linode.

1. Log in to the Linode using the [LISH Console](/docs/products/compute/compute-instances/guides/lish/). The LISH Console can be accessed from the [*Linode Cloud Manager*](https://cloud.linode.com/). Select the appropriate Linode, and click the **Launch LISH Console** link at the top right-hand side of the page.

1. Edit the file located at `/etc/ssh/sshd_config` and change the value of `PasswordAuthentication` to `Yes`. If you are not planning to generate and use an SSH private key in the near future, change `PubKeyAuthentication` to `No` at the same time.

        vi /etc/ssh/sshd_config

    {{< file "/etc/ssh/sshd_config" aconf >}}
...
PubKeyAuthentication No
...
PasswordAuthentication Yes
...
    {{< /file >}}

1. Restart the `sshd` service to apply the changes.

        systemctl restart sshd
1. Use SSH to access the Linode using only a password.

### The Target Server Does Not Have a Copy of the Public Key

This situation arises because the target server does not have your public key. Without that information, it cannot locate the key when it receives the SSH request. To correct this, copy the public key into the `authorized_keys` file in your directory on the Linode. For more information on how to generate a public key, see our [Use SSH Public Key Authentication on Linux, macOS, and Windows](/docs/guides/use-public-key-authentication-with-ssh/) guide.

1. Locate the file containing the public key file on your client. The file is usually named `id_rsa.pub`. On macOS devices, it is typically located at `/Users/<username>/.ssh/`, while on Linux systems it can be found at `/home/<username>/.ssh/`. On Windows systems, the file location is user-defined.

1. Inspect the contents of this file using either a text editor or the `cat` utility. A sample key is displayed below. Keep this file open for later.

        cat ~/.ssh/id_rsa.pub

    {{< note type="alert" respectIndent=false >}}
Share only your public key. Your private key, which is usually named `id_rsa`, must always be kept secret.
    {{< /note >}}

    {{< file "/Users/<username>/.ssh/id_rsa.pub" >}}
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC3tvOQFGAnY3p1t6gv6rXEat8maN
YghZYuAuci3Pd0gEr3MHMFwZ3NqYA87VM+HLbu9EbBjvPjuFmNkdT7yN8TJkv1Z61g
+NJ3+aJBGHNe8MDKs69z3yNgakiI2ynT8+GDOz545fQfZdyl5oQ9IvcODz0k7yoKP9
yQdSj8l9dCN9Zf8GBLQTbryHgaSEoinpX5SFmNkdT7yN8TJkv1Z61gpB+NJ3+aJBGH
Jvl72P8ePqG2nIvSqHsm/4OfdJshaXHA+j6DpvSQ== user@userdevice.local
    {{< /file >}}

1. Log in to the Linode through the [LISH Console](/docs/products/compute/compute-instances/guides/lish/). Access the LISH Console through the [*Linode Cloud Manager*](https://cloud.linode.com/). Select the Linode to access, then click the **Launch LISH Console** link at the top right-hand side of the page.

1. Display the contents of the `~/.ssh/authorized_keys` file.

        cat ~/.ssh/authorized_keys

1. If the file exists, verify whether your public key is among the entries. If it does not match one of the keys, or if the file is empty or does not exist, you must add the key.

1. If necessary, create the `.ssh` directory and the `authorized_keys` file. Enter the following command on the target server to verify whether the directory exists.

        ls ~/.ssh/

    If the system displays an error, create the folder and set its permissions as follows:

        mkdir -p ~/.ssh
        chmod 700 ~/.ssh

1. Determine whether the `authorized_keys` file exists using the following command:

        ls ~/.ssh/authorized_keys

    In the event of an error, create the file and set the correct permissions for it.

        touch ~/.ssh/authorized_keys
        chmod 600 ~/.ssh/authorized_keys

1. If you are using a macOS or Linux system as a client, use the `scp` utility to securely copy the contents of your public key. The first argument to `scp` should be the location of the public key on the client. The second parameter is your `accountname` and the `ip_address` of the target, a `:` symbol, and the location of the `authorized_keys` file on the target.

        scp ~/.ssh/id_rsa.pub <accountname>@<ip_address>:~/.ssh/authorized_keys

    {{< note respectIndent=false >}}
If your client does not have the `scp` tool installed, copy the key to the target server manually. Open the public key file and copy the entire key, including the `ssh-rsa` prefix and the user identifier at the end. Then open the `authorized_keys` file on the target server and add a new line to the end of the file. Paste in the public key you copied earlier. Each key should be on its own line and should not contain any line breaks. Save and close the file.
    {{< /note >}}

1. Ensure public key authentication is permitted on the target server. Set `PubKeyAuthentication` to `Yes` in the `sshd_config` file. To completely disable password authentication, set `PasswordAuthentication` to `No`.

        vi /etc/ssh/sshd_config

    {{< file "/etc/ssh/sshd_config" aconf >}}
...
PubKeyAuthentication Yes
...
PasswordAuthentication No
...
    {{< /file >}}

1. Restart the `sshd` service to apply the changes.

        systemctl restart sshd

1. Try accessing the target server without entering a password. Your private key should be used to authenticate the connection.

{{< note respectIndent=false >}}
Some Linux systems include a tool named `ssh-copy-id` which further simplifies the process of copying a public key. To use this utility, run the command `ssh-copy-id <accountname>@<ip_address>`. After you enter your password, your public key is copied to the correct destination on the target server.
{{< /note >}}
