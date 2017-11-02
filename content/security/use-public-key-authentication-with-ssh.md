---
author:
  name: Linode
  email: docs@linode.com
description: 'Access your Linode via SSH using Public Key Authentication.'
keywords: ["ssh", "pki", "ssh keys", "secure shell", "vpn", "tunneling"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['security/ssh-keys/']
modified: 2017-03-23
modified_by:
  name: Linode
published: 2011-04-05
title: Use Public Key Authentication with SSH
---

Public key authentication provides SSH users with the convenience of logging in to their Linodes without entering their passwords. SSH keys are also more secure than passwords, because the private key used to secure the connection is never shared. Private keys can also be *encrypted* so their contents can't be read as easily. While SSH passwords are not required once keys are set up, passwords for *decrypting* the private keys locally are still required. For added convenience, depending on your local workstation's security, you can add the new password to your local keychain so it's saved after the first login.

![Use Public Key Authentication with SSH](/docs/assets/use_public_key_authentication_with_ssh.png "Use Public Key Authentication with SSH")

## Intro to SSH Keys Authentication

SSH keys come in pairs; a private and a public key. Usually the private key is saved as `~/.ssh/id_<type>` and the public key is `~/.ssh/id_<type>.pub`. The type of encryption most often used by default is RSA, so your keys should be named `id_rsa` and `id_rsa.pub`. The public key is meant to be handed out freely, and added to servers you wish to connect to in the `~/.ssh/authorized_keys` file. The private key should be secured on your local machine with strict access rules.

It might be easier to think of SSH keys in terms of a lock and key. The public part is the lock, which can be copied to multiple locations as long as the private component, or key, is not compromised. Since the private key is password-protected when encrypted, it is analogous to keeping a physical key in a lockbox. With this example in mind, using an SSH key works as follows. First, the lockbox/passphrase is opened to obtain the key/private key, which is then used to open the lock/public key and grant access to your Linode.

### Intro to Local Encryption

Since private keys need to be kept secret to prevent unauthorized access to your Linode, it is recommended that they be encrypted on your local system. This helps guarantee that only individuals with the encryption passphrase will be able to use the private keys, even if the key itself becomes compromised. A passphrase is only used to unlock the private key *locally* and is not transmitted in any form to the remote host.

When you create your private key, be sure to make a note of your passphrase, as you will need it for the first login to the remote server.

## Linux and Unix-like Operating Systems

The process for generating SSH keys and connecting to a remote server from a Linux, Apple OS X, or Unix-like operating system is outlined below.

### Generating Keys

The process for creating keys with a recent version of the OpenSSH package is the same across many different Unix-like operating systems. This includes all Linux distributions provided by Linode, workstations running Linux, and Apple's OS X.

{{< caution >}}
Be careful when running `ssh-keygen` if you've already created and saved keys to the default path, `/home/user/.ssh/id_rsa`. If you run the command again and do not specify a different path, you may overwrite the private key on your local system. If you overwrite the local private key after using the matching public key to secure your server, you may lose your ability to access your server via SSH.

If you accidentally lock yourself out of your Linode this way, you can use [Lish](/docs/networking/using-the-linode-shell-lish) to update your `authorized_keys` file and regain SSH access.
{{< /caution >}}

1.  To generate SSH keys for your host, issue the following command on your *local system*:

        ssh-keygen

	**Optional:** to increase the security of your key, increase the size with the `-b` flag. The minimum value is 768 bytes and the default, if you do not use the flag, is 2048 bytes. We recommend a 4096 byte key:

		ssh-keygen -b 4096

2.  Answer all questions when prompted. You can accept the defaults for everything except the passphrase. When you get to the passphrase question, enter a series of letters and numbers for the passphrase twice; once to enter the new passphrase and once to confirm.

	**Important:** make a note of your passphrase, as you will need it later.

	You may accept the defaults for the other questions by pressing *Return* when prompted:

        user@linode: ssh-keygen -b 4096
        Generating public/private rsa key pair.
        Enter file in which to save the key (/home/user/.ssh/id_rsa):
        Enter passphrase (empty for no passphrase):
        Enter same passphrase again:
        Your identification has been saved in /home/user/.ssh/id_rsa.
        Your public key has been saved in /home/user/.ssh/id_rsa.pub.
        The key fingerprint is:
        f6:61:a8:27:35:cf:4c:6d:13:22:70:cf:4c:c8:a0:23 user@linode

The newly-generated SSH keys are located in the `~/.ssh/` directory. You will find the private key in the `~/.ssh/id_rsa` file and the public key in the `~/.ssh/id_rsa.pub` file.

### Uploading Keys

Please note that the following steps are performed on your remote location/Linode.

1.  Before you upload the keys, verify that your `.ssh` directory exists by using the following command from your home directory (the default directory when you log in):

        ls -al

2.  If the `.ssh` directory is present, proceed to Step 3. If the directory is not present, issue the following command in the `/home/user` directory to create it:

        mkdir .ssh

	The following steps are performed on your local machine/PC:

3.  Copy the *public key* into the `~/.ssh/authorized_keys` file on the **remote machine**, using the following command. Substitute your own SSH user and host names:

        scp ~/.ssh/id_rsa.pub user@example.com:/home/user/.ssh/uploaded_key.pub

4.  Run the following command to copy the key to the `authorized_keys` file. Substitute your own SSH user and host names:

        ssh user@example.com "echo `cat ~/.ssh/uploaded_key.pub` >> ~/.ssh/authorized_keys"

### Connecting to the Remote Server

The final part in the SSH key process is to access your Linode with your new private key.

1.  Connect to the remote server.
2.  Depending on your desktop environment, a window may appear prompting you for a password. Otherwise, you will be prompted in your terminal. This password is the passphrase you created for the private key encryption.

    ![Enter your passphrase in the password field.](/docs/assets/1461-SSH-Passphrase.png)

3.  If you're on a private computer, you can check the **Remember password in my keychain** box to save your passphrase. If you are logged on via a public machine, don't check this box, as this would compromise your security and allow access to your Linode.
4.  Click the **OK** button.

You should now be connected to your Linode using the SSH key.

## Windows Operating System

Before you can generate an SSH key, you will need to download and install PuTTYgen (puttygen.exe) and PuTTY (putty.exe). These two programs are available for download [here](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

### PuTTY Key Generation

When PuTTYgen has finished downloading, it can be run immediately, without installation.

1.  Double-click on the downloaded executable program and select **Run**.

    ![Beginning the PuTTY key gen install.](/docs/assets/1463-begin-install.png)

2.  Read the warning, and then select **Run** to continue.

    ![Ignore installation warning.](/docs/assets/1468-warning.png)

3. You will be taken directly to the key generating screen. You can choose at this point to increase the number of bits to `4096`. Click on the **Generate** button to create the new public/private key pair.

    ![Generating the new public/private key pair.](/docs/assets/1464-generate-key.png)

4.  Once the keys begin to generate, keep moving your mouse until the entire bar fills with green. The program uses the random input from your mouse to generate a unique key.

    ![Move the mouse until the key generating is complete.](/docs/assets/1470-random-generating.png)

5.  The public key is now generated and appears in the first window.

    ![The public key has now been created.](/docs/assets/1466-new-public-key.png)

6.  Before you continue, you will need to copy the newly-created public key to Notepad. Just select the text and copy it to a new  text file. Be sure the file is saved in a location you remember, as you will need it later.

    ![Copy the public key to a text file.](/docs/assets/1476-key-txt-file.png)

    {{< caution >}}
When saving the public key, make sure you save it in a plaintext format such as .txt. Other file formats such as .rtf and .doc may add extra characters to the key through encoding, which may prevent your keypair from matching. The public key should be a single line, with no breaks.
{{< /caution >}}

7.  Enter a passphrase in the **Key passphrase** text field, and enter it again to confirm. The passphrase can be any string of letters and numbers. The passphrase should be something unique and not easily recognized. **Important:** make a note of your passphrase, as you will need it later.

    ![Enter a new passphrase.](/docs/assets/1465-new-passphrase.png)

8.  After you have entered your passphrase, click on the **Save private key** button. This will save the private key to your PC.

    ![Click on the Save private key button.](/docs/assets/1472-private-key-button.png)

9.  Keep the default location and name of the private key file and click on the **Save** button. Note that if you plan on creating multiple keys to connect to different SSH servers, you will need to save each pair of keys for each server with different names to prevent overwriting the key files. Make a note of the name and location of the private key. You'll need it in the next section.

    ![Saving the private key.](/docs/assets/1474-save-private-key.png)

### Connecting to the Remote Server

Now it is time to connect to your Linode with the SSH connection you just created.

1.  Launch PuTTY.
2.  Under the **Connection** menu, under **SSH**, select **Auth**.

    ![Select auth under the SSH submenu under connection.](/docs/assets/1462-auth-location.png)

3.  You will need to tell PuTTY the location of the private key. This may be accomplished by either clicking on the **Browse** button and navigating to the private key file, or by typing in the location of the file from Step 10 in the previous section.

    ![Enter the private key location.](/docs/assets/1473-private-key-file-location.png)

4.  To establish a session, click on **Session** under the **Category** list. Enter the hostname or IP address of your Linode. Note: the SSH radio button is selected by default and the **Port** number field is already filled in.

    **Optional:**You can either save this connection as the default by clicking on the **Save** button, or by entering a name in the **Saved Sessions** text field, and clicking on the **Save** button.

    ![Saving your connection information.](/docs/assets/1475-saved-session.png)

5.  Click the **Open** button to establish a connection. You will be prompted to enter your login name and password.
6.  The combination of commands shown below will create a `.ssh` directory in your home directory on your Linode, create a blank `authorized_keys` file inside, and set the access permissions. Enter the following commands at the prompt and press *Enter*:

        mkdir ~/.ssh; touch ~/.ssh/authorized_keys; chmod 700 ~/.ssh

7.  Edit the newly-created file by using a text editor such as nano:

        nano ~/.ssh/authorized_keys

8.  Copy the contents of the public key from your workstation to the `authorized_keys` file. Be sure you save the file on exit. For an additional layer of security, modify the file permissions:

        chmod 600 ~/.ssh/authorized_keys

9.  Exit PuTTY, then reconnect and **Load** your saved session. (Or, follow Steps 3 and 4 again to start a new SSH session.) You will be prompted to enter your login name as before. However, this time you will be prompted for your SSH key's passphrase, rather then your Linode user's password. Enter your passphrase and press *Enter*.

Uploading the public key in Windows can also be done using [WinSCP](http://winscp.net/). In the login window, enter your Linode's public IP address as the hostname, and your non-root username and password. Click *Login* to connect.

Once WinSCP has connected, you'll see two main sections. The section on the left shows files on your local computer and the section on the right shows files on your Linode. Using the file explorer on the left, navigate to the file where you've saved your public key, select the public key file, and click *Upload* in the toolbar above.

You'll be prompted to enter a path where you'd like to place the file on your Linode. Upload the file to `/home/user/.ssh/authorized_keys`, replacing `user` with your username.

{{< caution >}}
When uploading a public key with WinSCP, make sure you are using a txt formatted file. If your public key is saved in a different format, such as .rtf or .doc, extra formatting characters will be added and your private key will not work properly.

When you create the text file, make sure the public key is a single line of text, exactly as it appears in the PuTTY key generator.
{{< /caution >}}

You should now be connected to your Linode using the SSH key.
