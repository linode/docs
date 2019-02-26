---
author:
  name: Linode
  email: docs@linode.com
description: 'Access your Linode via SSH using Public Key authentication.'
keywords: ["ssh", "public key"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['security/ssh-keys/', 'tools-reference/ssh/use-public-key-authentication-with-ssh/','security/use-public-key-authentication-with-ssh/','security/authentication/use-public-key-authentication-with-ssh/']
modified: 2019-02-21
modified_by:
  name: Linode
published: 2011-04-05
title: Use Public Key Authentication with SSH
---

![Use Public Key Authentication with SSH](use_public_key_authentication_with_ssh.png "Use Public Key Authentication with SSH")

While password authentication is the default method most SSH (Secure Shell ) clients use to authenticate remote servers, SSH keys are a [Public Key authentication](https://en.wikipedia.org/wiki/Key_authentication#Authentication_using_Public_Key_Cryptography) mechanism for SSH that offers a number of advantages over traditional password-based login schemes. SSH key based login is not a major target for brute-force hacking attacks, and if a server that uses SSH keys is compromised by a hacker no authorization credentials are at risk of being exposed. Another advantage is that SSH key logins take the place of traditional password based logins, and can create a password-less login experience.

This guide will explain how the SSH key login scheme works, how to generate an SSH key, and how to use those keys with your Linode.

## How SSH Keys Work

SSH keys are generated in pairs: one private key, usually named `id_rsa`, and one public key, usually named `id_rsa.pub`. The private key is stored on your local computer and should be kept secure, whereas a copy of the public key is placed on the server you intend to log in to.

When logging in to a server using SSH, if there is a public key on file on that server, the server will create a challenge. This challenge will be crafted in such a way that only the holder of the private SSH key will be able to decipher it. This challenge-response action happens without any user interaction. If the person attempting to log in has the corresponding private key they will be safely logged in, if not, then the login will either fail or fall back to a password based authentication scheme.

You can optionally provide an additional level of security to your SSH keys by encrypting them with a passphrase at the time of creation. When you attempt to log in using an encrypted SSH key, you will be prompted to enter its passphrase. This is not to be confused with a password, as this passphrase only decrypts the file locally and is not transferred over the internet as a password might be. If you'd like to set up your logins so that they require no user input then creating a passphrase might not be desirable, but it is strongly recommended nevertheless.

When a site or service asks for your SSH key, they are referring to your SSH public key (`id_rsa.pub`). For instance, services like [GitHub](https://github.com) and [Gitlab](https://gitlab.com) allow you to place your SSH public key on their servers to streamline the process of pushing code changes to remote repositories.

## Linux / macOS

### Generate a Key Pair

Perform the steps in this section on your local machine.

1.  Create a new key pair.

    {{< caution >}}
**This command will overwrite an existing RSA key pair, potentially locking you out of other systems.**

If you've already created a key pair, skip this step. To check for existing keys, run `ls ~/.ssh/id_rsa*`.

If you accidentally lock yourself out of your Linode, use [Lish](/docs/networking/using-the-linode-shell-lish) to update your `authorized_keys` file and regain SSH access.
{{< /caution >}}

        ssh-keygen -b 4096

    The `-b` flag instructs `ssh-keygen` to increase the number of bits used to generate the key pair, and is suggested for additional security.

1.  Press **Enter** to use the default names `id_rsa` and `id_rsa.pub` in the `/home/your_username/.ssh` directory before entering your passphrase.

    {{< output >}}
Generating public/private rsa key pair.
Enter file in which to save the key (/home/bob/.ssh/id_rsa):
{{< /output >}}

1. While creating the key pair, you will be given the option to encrypt the private key with a passphrase. This means that the key pair cannot be used without entering the passphrase unless you save it to your local machine's keychain manager. We suggest that you use the key pair with a passphrase, but you can leave this field blank if you don't want to use one.

    {{< output >}}
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/bob/.ssh/id_rsa.
Your public key has been saved in /home/bob/.ssh/id_rsa.pub.
The key fingerprint is:
f6:61:a8:27:35:cf:4c:6d:13:22:70:cf:4c:c8:a0:23 bob@linode
{{< /output >}}

### Upload Your Keypair

Now that you have your keys, it's time to place the public key on the Linode you would like to log in to. There are a number of ways to accomplish this task.

#### Using ssh-copy-id

`ssh-copy-id` is a utility available on some operating systems that can copy a SSH public key to a remote server over SSH. To use `ssh-copy-id` you pass it a username and the IP address of the server to which you would like to access. For example:

    ssh-copy-id bob@192.0.2.0

You'll see output like the following, and a prompt to enter your user's password:

  {{< output >}}
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/bob/.ssh/id_rsa.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
bob@192.0.2.0's password:
  {{</ output >}}

Enter the password and the copying to the remote server will complete. You can now log in to your server with SSH as you normally would. If you chose to use a passphrase when creating your SSH key, it will prompt you to enter it:

    ssh bob@192.0.2.0

#### Using Secure Copy (scp)

Secure Copy (`scp`) is a tool that copies files from a local computer to a remote server over SSH.

1.  Log in to your server and run the following commands to create the `~/.ssh` directory and `authorized_keys` file if they don't already exist.

        mkdir ~/.ssh && touch ~/.ssh/authorized_keys

2.  Give the `~/.ssh` directory and `authorized_keys` files the appropriate file permissions:

        chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys

3.  On your local machine, use `scp` to copy the contents of your SSH public key (`id_rsa.pub`) into the `authorized_keys` file on your server. Substitute in your own username (in place of `bob`), and your server's IP address (192.0.2.0).

        scp ~/.ssh/id_rsa.pub bob@192.0.2.0:~/.ssh/authorized_keys

4.  Once the file is done copying you are now able to log in to your server with your SSH key.

#### Manually Copy an SSH Key

If your local system does not offer `ssh-copy-id` or `scp` you can manually add an SSH key to a server.

1.  Begin by copying the contents of your **public** SSH key on your local computer. You can use the following command to output the contents of the file:

        cat ~/.ssh/id_rsa.pub

    You should see output similar to the following:

      {{< output >}}
      ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCyVGaw1PuEl98f4/7Kq3O9ZIvDw2OFOSXAFVqilSFNkHlefm1iMtPeqsIBp2t9cbGUf55xNDULz/bD/4BCV43yZ5lh0cUYuXALg9NI29ui7PEGReXjSpNwUD6ceN/78YOK41KAcecq+SS0bJ4b4amKZIJG3JWmDKljtv1dmSBCrTmEAQaOorxqGGBYmZS7NQumRe4lav5r6wOs8OACMANE1ejkeZsGFzJFNqvr5DuHdDL5FAudW23me3BDmrM9ifUzzjl1Jwku3bnRaCcjaxH8oTumt1a00mWci/1qUlaVFft085yvVq7KZbF2OPPbl+erDW91+EZ2FgEi+v1/CSJ5 bob@host
      {{</ output >}}

    Note that the public key begins with `ssh-rsa` and ends with `username@host-name`, which in this example is `bob@host`.

1.  Once you have copied that text, connect to your server via SSH:

        ssh bob@192.0.2.0

1.  Create a directory called `.ssh/` in your home directory, and a file called `authorized_keys`:

        mkdir ~/.ssh && touch ~/.ssh/authorized_keys

1.  Change the permissions of the `~/.ssh` directory and the `authorized_keys` files:

        chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys

1.  Open the `authorized_kyes` file with the text editor of your choice. Then, paste the contents of your public key that you copied in step one on a new line at the end of the file.

        nano ~/.ssh/authorized_keys

    Save and close the file.

1.  Make sure that your `~/.ssh` directory has the proper permissions. Run the following command to remove 'group' and 'other permissions' from the directory.

        chmod -R go= ~/.ssh

1.  If you are currently logged in as `root` you will also need to make sure that the `~/.ssh` folder is owned by the user that intends to log in with their SSH key. In this example the user is named `bob`, so you will want to run the following command:

        chown -R bob:bob ~/.ssh

    Replace both instances of `bob` with your username.

1.  You can now log out and log back in in with your SSH key.

### Connect to the Remote Server

1.  SSH into the server from your local machine:

        ssh user@example.com

2.  Depending on your desktop environment, a window may appear, prompting you for the private key's passphrase you assigned earlier when creating the key pair:

    ![Enter your SSH passphrase in the password field.](1461-SSH-Passphrase.png "A prompt for the password to unlock the key.")

    {{< caution >}}
Do not allow the local machine to remember the passphrase in its keychain unless you are on a private computer which you trust.
{{< /caution >}}

1.  Click **OK** and you should see the connection establish in the local terminal.

## Windows

### Generate and Upload a Key Pair with PuTTY

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

### Connect to the Remote Server

1.  Launch `putty.exe`. Find the **Connection** tree in the Category window, expand **SSH** and select **Auth**. Click **Browse** and navigate to the private key you created above:

    ![Enter the private key location.](putty-private-key-location.png "Enter the private key location.")

1.  Scroll back to the top of the Category window and click **Session**. Enter the hostname or IP address of your Linode. PuTTY's default TCP port is `22`, the [IANA](https://en.wikipedia.org/wiki/Internet_Assigned_Numbers_Authority) assigned port for for SSH traffic. Change it if your server is listening on a different port. Name the session in the **Saved Sessions** text bar and click **Save**:

    ![Saving your connection information.](putty-session-window.png "Saving your connection information.")

1.  Click the **Open** button to establish a connection. You will be prompted to enter a login name and password for the remote server.

1.  Once you're logged in to the remote server, configure it to authenticate with your SSH key pair instead of a user's password. Create an `.ssh` directory in your home directory on your Linode, create a blank `authorized_keys` file inside, and set their access permissions:

        mkdir ~/.ssh && touch ~/.ssh/authorized_keys
        chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys

1.  Copy the public key from your local workstation to the `authorized_keys` file on your Linode.

1.  Exit PuTTY, then reconnect and **Load** your saved session. You'll be prompted to enter your Linode user's login name as before. However, this time you will be prompted for your private SSH key's passphrase rather then your Linode user's password. Enter the passphrase and press *Enter*.

### Using WinSCP

Uploading a public key from Windows can also be done using [WinSCP](http://winscp.net/).

1.  In the login window, enter your Linode's public IP address as the hostname, your non-root username, and password. Click *Login* to connect.

1.  Once connected, WinSCP will show two file tree sections. The left shows files on your local computer and the right shows files on your Linode. Using the file explorer on the left, navigate to the file where you saved your public key in Windows. Select the public key file and click **Upload** in the toolbar above.

1.  You'll be prompted to enter a path on your Linode where you want to upload the file. Upload the file to `/home/example_user/.ssh/authorized_keys`, replacing `example_user` with your username.

## Upload Your SSH Key to the Cloud Manager

It is possible to provision each new Linode you create with an SSH public key automatically through the [Cloud Manager](https://cloud.linode.com).

1.  Log in the [Cloud Manager](https://cloud.linode.com).

1.  Click on your username at the top right hand side of the page, and click on **My Profile**:

    ![Click on your username, and then select 'My Profile'](ssh-key-my-profile.png)

1.  From the My Profile page, select the **SSH Keys** tab, and then click **Add a SSH Key**:

    ![Click on the 'SSH Keys' tab, then click **Add a SSH Key**](ssh-key-my-keys.png)

1.  Create a label for your key, then paste in the contents of your public SSH key (`id_rsa.pub`):

    ![Create a label for your key, then paste in the contents of your public SSH key](ssh-key-new-key.png)

1.  Click **Add Key**. Now whenever you create a Linode you'll be given the opportunity to include your SSH key in the Linode's creation. Simply select the SSH key you'd like to include after you've supplied a password:

    ![Include your SSH key when creating a new Linode](ssh-key-new-linode.png)
