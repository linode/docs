---
author:
  name: Linode
  email: docs@linode.com
description: 'Accessing remote servers with PuTTY, a free and open source SSH client for Windows and UNIX systems.'
keywords: ["putty", "putty ssh", "windows ssh client"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['networking/using-putty/']
modified: 2017-10-09
modified_by:
  name: Linode
published: 2009-09-20
title: SSH Connections Using PuTTY on Windows
external_resources:
 - '[PuTTY Documentation](http://www.chiark.greenend.org.uk/~sgtatham/putty/docs.html)'
 - '[Xming Manual](http://www.straightrunning.com/XmingNotes/manual.php)'
---

![Using PuTTY](/docs/assets/using-putty.png "Using PuTTY")

PuTTY is a free and open source SSH client for Windows and UNIX systems. It provides easy connectivity to any server running an SSH daemon so you can work as if you were logged into a console session on the remote system.

## Install PuTTY and Connect to a Remote Host

1.  Download and run the PuTTY installer from [here](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

2.  When you open PuTTY, you'll be shown the configuration menu.

    ![PuTTY session configuration](/docs/assets/putty-configuration-window.png)

    Enter your Linode's hostname or IP address. The default port for SSH is **22**. If your remote server's SSH daemon is running on a different port, you'll need to specify it in the **Session** category.

3.  Click **Open** to start an SSH session. If you have never previously logged into this system with PuTTY (we'll assume here you have not), you will see a message alerting you that the server's SSH key fingerprint is new, and asking if you want to proceed.

    **Do not click anything yet! You first need to verify the fingerprint.**

    ![PuTTY verify SSH fingerprint](/docs/assets/putty-verify-host-ssh-key-fingerprint.png)

4.  Use [Lish](/docs/networking/using-the-linode-shell-lish) to log in to your Linode. Use the command below to query OpenSSH for your Linode's SSH fingerprint:

        ssh-keygen -E md5 -lf /etc/ssh/ssh_host_ed25519_key.pub

    The output will look similar to this:

        256 MD5:58:72:65:6d:3a:39:44:26:25:59:0e:bc:eb:b4:aa:f7  root@localhost (ED25519)

    {{< note >}}
For the fingerprint of an RSA key instead of elliptical curve, use: `ssh-keygen -lf /etc/ssh/ssh_host_rsa_key.pub`.
{{< /note >}}

5.  Compare the output from Step 4 above to what PuTTY is showing in the alert message in Step 3. **The two fingerprints should match.**

6.  If the fingerprints match, then click **Yes** on the PuTTY message to connect to your Linode and cache that host fingerprint.

    **If the fingerprints do not match, do not connect to the server!** You won't receive further warnings unless the key presented to PuTTY changes for some reason; typically, this should only happen if you reinstall the remote server's operating system. If you should receive this warning again from a system you already have the host key cached on, you should not trust the connection and investigate matters further.


## Port Forwarding (SSH Tunnels) with PuTTY

SSH tunnels allow you to access network services running on a remote server though a secure channel. This is useful in cases where the service you wish to access doesn't run over SSL, or you do not wish to allow public access to it. As an example, you can use tunneling to securely access a MySQL server running on a remote server.

To do so:

 - In PuTTY's configuration window, go to the **Connection** category.
 - Go to **SSH**, then **Tunnels**.
 - Enter **3306** in the **Source port** field.
 - Enter **127.0.0.1:3306** in the **Destination** field.
 - Click **Add**, then click **Open** to log in.

    ![Tunneling a remote MySQL connection with PuTTY.](/docs/assets/putty-port-forwarding.png)

Once you've connected to the remote server with this tunnel configuration, you'll be able to direct your local MySQL client to `localhost:3306`. Your connection to the remote MySQL server will be encrypted through SSH, allowing you to access your databases without running MySQL on a public IP.

## Run Remote Graphical Applications over SSH

PuTTY can securely run graphical applications hosted on a remote Linux server. You can run virtually any X11 application in this manner, and the connection will be encrypted through SSH, providing a safe means of interacting with remote graphical systems.

1.  You wll need an X11 server for Windows. Download and install [Xming](http://sourceforge.net/projects/xming/), a free X server for Windows. Accept the defaults presented by the installer and you'll be running an X11 server when the install process completes.

    {{< note >}}
You will need the `xauth` package installed on your remote server for X11 forwarding to work correctly. It is installed by default on Debian and ReHat based systems, but may not be for other Linux distributions.
{{< /note >}}

2.  Next, you'll need to tell PuTTY to forward X11 connections to your desktop.

    - In PuTTY's configuration window, make sure the remote server's hostname or IP, and the correct port, are entered on the **Session** category.
    - In the **Connection** category, go to **SSH**, then **X11**.
    - Check the box for **Enable X11 forwarding**.
    - Enter **localhost:0** in the **X display location** field.
    - Click **Open** to log in.

    ![Configure X11 forwarding in PuTTY.](/docs/assets/putty-x11-forwarding.png)

3.  Once you're logged into the remote server, you may start any graphical application hosted there. The application will be projected onto your local desktop. Here's the `xcalc` application running on a remote server, visible a Windows desktop:

    ![xcalc running in PuTTY.](/docs/assets/162-putty-03-xcalc-running.png)
