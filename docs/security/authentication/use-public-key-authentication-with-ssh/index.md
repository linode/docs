---
author:
  name: Linode
  email: docs@linode.com
description: 'Access your Linode via SSH using Public Key authentication.'
keywords: ["ssh", "public key"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['security/ssh-keys/', 'tools-reference/ssh/use-public-key-authentication-with-ssh/','security/use-public-key-authentication-with-ssh/','security/authentication/use-public-key-authentication-with-ssh/']
modified_by:
  name: Linode
published: 2011-04-05
title: Use Public Key Authentication with SSH
---

![Use Public Key Authentication with SSH](use_public_key_authentication_with_ssh.png "Use Public Key Authentication with SSH")

Password authentication is the default method most SSH (Secure Shell) clients use to authenticate with remote servers, but it suffers from potential security vulnerabilities, like brute-force login attempts. An alternative to password authentication is [*public key authentication*](https://en.wikipedia.org/wiki/Key_authentication#Authentication_using_Public_Key_Cryptography), in which you generate and store on your computer a pair of cryptographic keys and then configure your server to recognize and accept your keys. Using key-based authentication offers a range of benefits:

-   Key-based login is not a major target for brute-force hacking attacks.

-   If a server that uses SSH keys is compromised by a hacker, no authorization credentials are at risk of being exposed.

-   Because a password isn't required at login, you are able to able to log in to servers from within scripts or automation tools that you need to run unattended. For example, you can set up periodic updates for your servers with a configuration management tool like [Ansible](/docs/applications/configuration-management/running-ansible-playbooks/), and you can run those updates without having to be physically present.

This guide will explain how the SSH key login scheme works, how to generate an SSH key, and how to use those keys with your Linode.

{{< note >}}
If you're unfamiliar with SSH connections, review the [Getting Started with Linode](/docs/getting-started/#connect-to-your-linode-via-ssh) guide.
{{< /note >}}

## How SSH Keys Work

SSH keys are generated in pairs and stored in plain-text files. The *key pair* (or *keypair*) consists of two parts:

-   A private key, usually named `id_rsa`. The private key is stored on your local computer and should be kept secure, with permissions set so that no other users on your computer can read the file.

    {{< caution >}}
Do not share your private key with others.
{{< /caution >}}

-   A public key, usually named `id_rsa.pub`. The public key is placed on the server you intend to log in to. You can freely share your public key with others. If someone else adds your public key to their server, you will be able to log in to that server.

When a site or service asks for your SSH key, they are referring to your SSH public key (`id_rsa.pub`). For instance, services like [GitHub](https://github.com) and [Gitlab](https://gitlab.com) allow you to place your SSH public key on their servers to streamline the process of pushing code changes to remote repositories.

### The authorized_keys File

In order for your Linode to recognize and accept your key pair, you will need to upload your public key to your server. More specifically, you will need to upload your public key to the home directory of the user you would like to log in as. If you would like to log in to more than one user on the server using your key pair, you will need to add your public key to each of those users.

To set up SSH key authentication for one of your server's users, add your public key to a new line inside the user's `authorized_keys` file. This file is stored inside a directory named `.ssh/` under the user's home folder. A user's `authorized_keys` file can store more than one public key, and each public key is listed on its own line. If your file contains more than one public key, then the owner of each key listed will be able to log in as that user.

### Granting Someone Else Access to your Server

To give someone else access to your server's user, simply add their public key on a new line in your `authorized_keys` file, just as you would add your own. To revoke access for that person, remove that same line and save the changes.

### Challenge-Response

When logging in to a server using SSH, if there is a public key on file on that server, the server will create a [*challenge*](https://en.wikipedia.org/wiki/Challenge–response_authentication). This challenge will be crafted in such a way that only the holder of the private SSH key will be able to decipher it.

This challenge-response action happens without any user interaction. If the person attempting to log in has the corresponding private key, then they will be safely logged in. If not, the login will either fail or fall back to a password-based authentication scheme.

### SSH Key Passphrases

You can optionally provide an additional level of security for your SSH keys by encrypting them with a *passphrase* at the time of creation. When you attempt to log in using an encrypted SSH key, you will be prompted to enter its passphrase. This is not to be confused with a password, as this passphrase only decrypts the key file locally and is not transferred over the Internet as a password might be.

If you'd like to set up your logins so that they require no user input, then creating a passphrase might not be desirable, but it is strongly recommended nevertheless.

## Linux and macOS

### Generate a Key Pair

Perform the steps in this section on your local machine.

1.  Create a new key pair.

    {{< caution >}}
**This command will overwrite an existing RSA key pair, potentially locking you out of other systems.**

If you've already created a key pair, skip this step. To check for existing keys, run `ls ~/.ssh/id_rsa*`.

If you accidentally lock yourself out of the SSH service on your Linode, you can still use the [Lish](/docs/networking/using-the-linode-shell-lish) console to login to your server. After you've logged in via Lish, update your `authorized_keys` file to use your new public key. This should re-establish normal SSH access.
{{< /caution >}}

        ssh-keygen -b 4096

    The `-b` flag instructs `ssh-keygen` to increase the number of bits used to generate the key pair, and is suggested for additional security.

1.  Press **Enter** to use the default names `id_rsa` and `id_rsa.pub` in the `/home/your_username/.ssh` directory before entering your passphrase.

    {{< output >}}
Generating public/private rsa key pair.
Enter file in which to save the key (/home/your_username/.ssh/id_rsa):
{{< /output >}}

1. While creating the key pair, you will be given the option to encrypt the private key with a passphrase. This means that the key pair cannot be used without entering the passphrase (unless you save that passphrase to your local machine's keychain manager). We suggest that you use the key pair with a passphrase, but you can leave this field blank if you don't want to use one.

    {{< output >}}
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/your_username/.ssh/id_rsa.
Your public key has been saved in /home/your_username/.ssh/id_rsa.pub.
The key fingerprint is:
f6:61:a8:27:35:cf:4c:6d:13:22:70:cf:4c:c8:a0:23 your_username@linode
{{< /output >}}

### Upload your Public Key

There are a few different ways to upload your public key to your Linode from Linux and macOS client systems:

#### Using ssh-copy-id

`ssh-copy-id` is a utility available on some operating systems that can copy a SSH public key to a remote server over SSH.

1.  To use `ssh-copy-id`, pass your username and the IP address of the server you would like to access:

        ssh-copy-id your_username@192.0.2.0

1.  You'll see output like the following, and a prompt to enter your user's password:

    {{< output >}}
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/your_username/.ssh/id_rsa.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
your_username@192.0.2.0's password:
{{</ output >}}

1.  [Verify that you can log in](#connect-to-the-remote-server) to the server with your key.

#### Using Secure Copy (scp)

Secure Copy (`scp`) is a tool that copies files from a local computer to a remote server over SSH:

{{< caution >}}
These instructions will overwrite any existing contents of the `authorized_keys` file on your server. If you have already set up other public keys on your server, use the [`ssh-copy-id` command](#using-ssh-copy-id) or [enter your key manually](#manually-copy-an-ssh-key).
{{< /caution >}}

1.  Connect to your server via SSH with the user you would like to add your key to:

        ssh your_username@192.0.2.0

1.  Create the `~/.ssh` directory and `authorized_keys` file if they don't already exist:

        mkdir -p ~/.ssh && touch ~/.ssh/authorized_keys

1.  Give the `~/.ssh` directory and `authorized_keys` files appropriate file permissions:

        chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys

1.  In another terminal on your local machine, use `scp` to copy the contents of your SSH **public** key (`id_rsa.pub`) into the `authorized_keys` file on your server. Substitute in your own username and your server's IP address:

        scp ~/.ssh/id_rsa.pub your_username@192.0.2.0:~/.ssh/authorized_keys

1.  [Verify that you can log in](#connect-to-the-remote-server) to the server with your key.

#### Manually Copy an SSH Key

You can also manually add an SSH key to a server:

1.  Begin by copying the contents of your **public** SSH key on your local computer. You can use the following command to output the contents of the file:

        cat ~/.ssh/id_rsa.pub

    You should see output similar to the following:

    {{< output >}}
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCyVGaw1PuEl98f4/7Kq3O9ZIvDw2OFOSXAFVqilSFNkHlefm1iMtPeqsIBp2t9cbGUf55xNDULz/bD/4BCV43yZ5lh0cUYuXALg9NI29ui7PEGReXjSpNwUD6ceN/78YOK41KAcecq+SS0bJ4b4amKZIJG3JWmDKljtv1dmSBCrTmEAQaOorxqGGBYmZS7NQumRe4lav5r6wOs8OACMANE1ejkeZsGFzJFNqvr5DuHdDL5FAudW23me3BDmrM9ifUzzjl1Jwku3bnRaCcjaxH8oTumt1a00mWci/1qUlaVFft085yvVq7KZbF2OPPbl+erDW91+EZ2FgEi+v1/CSJ5 your_username@hostname
{{</ output >}}

    Note that the public key begins with `ssh-rsa` and ends with `your_username@hostname`.

1.  Once you have copied that text, connect to your server via SSH with the user you would like to add your key to:

        ssh your_username@192.0.2.0

1.  Create the `~/.ssh` directory and `authorized_keys` file if they don't already exist:

        mkdir -p ~/.ssh && touch ~/.ssh/authorized_keys

1.  Give the `~/.ssh` directory and `authorized_keys` files appropriate file permissions:

        chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys

1.  Open the `authorized_keys` file with the text editor of your choice ([`nano`, for example](/docs/quick-answers/linux/use-nano-to-edit-files-in-linux/)). Then, paste the contents of your public key that you copied in step one on a new line at the end of the file.

1.  Save and close the file.

    {{< note >}}
If you initially logged into the server as `root` but edited the `authorized_keys` file of another user, then the `.ssh/` folder and `authorized_keys` file of that user may be owned by `root`. Set that other user as the files' owner:

        chown -R your_username:your_username /home/your_username/.ssh
{{< /note >}}

1.  [Verify that you can log in](#connect-to-the-remote-server) to the server with your key.

### Connect to the Remote Server

1.  SSH into the server from your local machine:

        ssh your_username@192.0.2.0

1.  If you chose to use a passphrase when creating your SSH key, you will be prompted to enter it when you attempt to log in. Depending on your desktop environment, a window may appear:

    ![Enter your SSH passphrase in the password field.](1461-SSH-Passphrase.png "A prompt for the password to unlock the key.")

    {{< caution >}}
Do not allow the local machine to remember the passphrase in its keychain unless you are on a private computer which you trust.
{{< /caution >}}

    You may also see the passphrase prompt at your command line:

    {{< output >}}
Enter passphrase for key '/root/.ssh/id_rsa':
{{< /output >}}

1.  Enter your password. You should see the connection establish in the local terminal.

## Windows

The following instructions use the [PuTTY](https://www.putty.org) software to connect over SSH, but [other options](/docs/networking/ssh/using-ssh-on-windows/) are available on Windows too.

### Generate a Key Pair with PuTTY

1.  Download PuTTYgen (`puttygen.exe`) and PuTTY (`putty.exe`) from the [official site](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

1.  Launch `puttygen.exe`. The `RSA` key type at the bottom of the window is selected by default for an [RSA](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) key pair but `ED25519` ([EdDSA](https://en.wikipedia.org/wiki/EdDSA) using [Curve25519](https://en.wikipedia.org/wiki/Curve25519)) is a comparable option if your remote machine's SSH server supports DSA signatures. Do not use the `SSH-1(RSA)` key type unless you know what you're doing.

1.  Increase the RSA key size from `2048` bits `4096` and click **Generate**:

    ![Generating the new public/private key pair.](putty-generate-key.png "Generating the new public/private key pair.")

1.  PuTTY uses the random input from your mouse to generate a unique key. Once key generation begins, keep moving your mouse until the progress bar is filled:

    ![Move the mouse until the key generating is complete.](putty-generating-key.png "Move the mouse until the key generating is complete.")

1.  When finished, PuTTY will display the new public key. Right-click on it and select **Select All**, then copy the public key into a Notepad file.

    ![The public key has now been created.](putty-key-generated.png "The public key has now been created.")

1.  **Save the public key as a `.txt` file** or some other plaintext format. **This is important**--a rich text format such as `.rtf` or `.doc` can add extra formatting characters and then your private key won't work:

    ![Copy the public key to a text file.](putty-ssh-pubkey-in-notepad.png "Copy the public key to a text file.")

1.  Enter a passphrase for the private key in the **Key passphrase** and **Confirm passphrase** text fields. **Important:** Make a note of your passphrase, you'll need it later:

    ![Enter a new passphrase.](putty-key-passphrase.png "Enter a new passphrase.")

1.  Click **Save private key**. Choose a file name and location in Explorer while keeping the `ppk` file extension. If you plan to create multiple key pairs for different servers, be sure to give them different names so that you don't overwrite old keys with new:

    ![Saving the private key.](putty-save-private-key.png "Saving the private key.")

### Manually Copy the SSH Key with PuTTY

1.  Launch `putty.exe`. Find the **Connection** tree in the Category window, expand **SSH** and select **Auth**. Click **Browse** and navigate to the private key you created above:

    ![Enter the private key location.](putty-private-key-location.png "Enter the private key location.")

1.  Scroll back to the top of the Category window and click **Session**. Enter the hostname or IP address of your Linode. PuTTY's default TCP port is `22`, the [IANA](https://en.wikipedia.org/wiki/Internet_Assigned_Numbers_Authority) assigned port for for SSH traffic. Change it if your server is listening on a different port. Name the session in the **Saved Sessions** text bar and click **Save**:

    ![Saving your connection information.](putty-session-window.png "Saving your connection information.")

1.  Click the **Open** button to establish a connection. You will be prompted to enter a login name and password for the remote server.

1.  Once you're logged in to the remote server, configure it to authenticate with your SSH key pair instead of a user's password. Create an `.ssh` directory in your home directory on your Linode, create a blank `authorized_keys` file inside, and set their access permissions:

        mkdir -p ~/.ssh && touch ~/.ssh/authorized_keys
        chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys

1.  Open the `authorized_keys` file with the text editor of your choice ([`nano`, for example](/docs/quick-answers/linux/use-nano-to-edit-files-in-linux/)). Then, paste the contents of your public key that you copied in step one on a new line at the end of the file.

1.  Save, close the file, and exit PuTTY.

1.  [Verify that you can log in](#connect-to-the-remote-server-with-putty) to the server with your key.

### Using WinSCP

Uploading a public key from Windows can also be done using [WinSCP](http://winscp.net/):

{{< caution >}}
These instructions will overwrite any existing contents of the `authorized_keys` file on your server. If you have already set up other public keys on your server, use the [PuTTY](#manually-copy-the-ssh-key-with-putty) instructions instead.
{{< /caution >}}

1.  In the login window, enter your Linode's public IP address as the hostname, the user you would like to add your key to, and your user's password. Click *Login* to connect.

1.  Once connected, WinSCP will show two file tree sections. The left shows files on your local computer and the right shows files on your Linode. Using the file explorer on the left, navigate to the file where you saved your public key in Windows. Select the public key file and click **Upload** in the toolbar above.

1.  You'll be prompted to enter a path on your Linode where you want to upload the file. Upload the file to `/home/your_username/.ssh/authorized_keys`.

1.  [Verify that you can log in](#connect-to-the-remote-server-with-putty) to the server with your key.

### Connect to the Remote Server with PuTTY

Start PuTTY and **Load** your saved session. You'll be prompted to enter your server user's login name as before. However, this time you will be prompted for your private SSH key's passphrase rather than the password for your server's user. Enter the passphrase and press *Enter*.

## Troubleshooting

If your SSH connections are not working as expected, or if you have locked yourself out of your system, review the [Troubleshooting SSH](/docs/troubleshooting/troubleshooting-ssh/) guide for troubleshooting help.

## Upload your SSH Key to the Cloud Manager

It is possible to provision each new Linode you create with an SSH public key automatically through the [Cloud Manager](https://cloud.linode.com).

1.  Log in to the [Cloud Manager](https://cloud.linode.com).

1.  Click on your username at the top right hand side of the page. Then click on **My Profile** in the dropdown menu that appears:

    ![My Profile menu](ssh-key-my-profile.png "Click on your username, and then select 'My Profile'")

    {{< note >}}
If you are viewing the Cloud Manager in a smaller browser window or on a smaller device, then the **My Profile** link will appear in the sidebar links. To view the sidebar links, click on the disclosure button to the left of the blue **Create** button at the top of the page.
{{< /note >}}

1.  From the My Profile page, select the **SSH Keys** tab, and then click **Add a SSH Key**:

    ![SSH Keys tab](ssh-key-my-keys.png "Click on the 'SSH Keys' tab, then click **Add a SSH Key**")

1.  Create a label for your key, then paste in the contents of your public SSH key (`id_rsa.pub`):

    ![Add SSH Key form](ssh-key-new-key.png "Create a label for your key, then paste in the contents of your public SSH key")

1.  Click **Add Key**.

1.  When you next create a Linode you'll be given the opportunity to include your SSH key in the Linode's creation. This key will be added to the root user of the new Linode.

    In the **Create Linode** form, select the SSH key you'd like to include. This field will appear below the **Root Password** field:

    ![SSH Keys field in the Create Linode form](ssh-key-new-linode.png "Include your SSH key when creating a new Linode")

## Next Steps

After you set up your SSH keys and confirm they are working as expected, review the [How to Secure Your Server](/docs/security/securing-your-server/#ssh-daemon-options) guide for instructions on disabling password authentication for your server.