---
author:
  name: Linode
  email: docs@linode.com
description: 'Use the open-source pgAdmin program to securely manage remote PostgreSQL databases from a Windows workstation.'
keywords: ["pgadmin", "pgadmin windows", "postgresql gui", "postgresql windows", "manage postgresql databases", "ssh tunnel"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2016-05-12
modified_by:
  name: Linode
published: 2010-04-28
title: How to Access PostgreSQL Database Remotely Using pgAdmin on Windows
aliases: ['databases/postgresql/pgadmin-windows/','databases/postgresql/securely-manage-remote-postgresql-servers-with-pgadmin-on-windows/']
external_resources:
 - '[pgAdmin Documentation](http://www.pgadmin.org/docs/)'
 - '[PostgreSQL Documentation](http://www.postgresql.org/docs/)'
---

PgAdmin is a free, open-source PostgreSQL database administration GUI for Microsoft Windows, Apple MacOS X and Linux systems. It offers database server information retrieval, development, testing, and ongoing maintenance. This guide will help you install pgAdmin on Windows, providing secure, remote access to PostgreSQL databases. It is assumed that you have already installed PostgreSQL on your Linode in accordance with our [PostgreSQL installation guides](/docs/databases/postgresql/).

## Install pgAdmin

Visit the [pgAdmin download page](https://www.pgadmin.org/download/windows4.php) to obtain the most recent version of the program. Save the installer to your desktop and launch it. You'll be greeted with the following screen; click "Next" to continue.

[![pgAdmin on Windows installer welcome dialog](/docs/assets/364-pgadmin-windows-install-1.png)](/docs/assets/364-pgadmin-windows-install-1.png)

Read the license agreement and check the box below it to accept the terms. Click "Next" to continue.

[![pgAdmin on Windows installer license agreement dialog](/docs/assets/365-pgadmin-windows-install-2.png)](/docs/assets/365-pgadmin-windows-install-2.png)

You will be prompted to specify which features you want to install. The default settings are recommended. Click "Next" to continue.

[![pgAdmin on Windows installer feature selection dialog](/docs/assets/366-pgadmin-windows-install-3.png)](/docs/assets/366-pgadmin-windows-install-3.png)

If you're running Windows Vista or Windows 7, you may receive the following warning dialog. Click "Yes" to finish the installation.

[![Windows 7 system modification warning dialog](/docs/assets/367-pgadmin-windows-install-4.png)](/docs/assets/367-pgadmin-windows-install-4.png)

Next, you'll configure an SSH tunnel to securely connect to your remote database server.

## Configure SSH Tunnel

While PostgreSQL supports SSL connections, it is not advisable to instruct it to listen on public IP addresses unless absolutely necessary. For this reason, you'll be using PuTTY (a free SSH client) to create a secure SSH tunnel to your Linode. Obtain the program by visiting the [PuTTY download page](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html). Save it to your desktop and launch it. You'll be greeted with the "Session" dialog shown below; enter your Linode's IP address or FQDN in the "Host Name" field.

[![PuTTY on Windows 7 session dialog](/docs/assets/368-putty-01-session.png)](/docs/assets/368-putty-01-session.png)

Open the "Connection -> SSH -> Tunnels" screen. Enter "5433" in the "Source port" field. Although PostgreSQL uses 5432 for TCP connections, you'll want to specify 5433 as the port number in case you decide to install PostgreSQL locally later on. Enter "127.0.0.1:5432" in the "Destination" field, and click the "Add" button.

[![PuTTY tunnels screen on Windows 7](/docs/assets/369-putty-03-postgresql-ssh-tunnel.png)](/docs/assets/369-putty-03-postgresql-ssh-tunnel.png)

The "Forwarded ports" list should now contain an entry like the one shown below.

[![PuTTY tunnels screen showing forwarded ports on Windows 7](/docs/assets/370-putty-04-postgresql-ssh-tunnel-open.png)](/docs/assets/370-putty-04-postgresql-ssh-tunnel-open.png)

Click the "Open" button to start your connection. If you haven't logged into your Linode with PuTTY before, you will receive a warning similar to the following:

[![An unknown host key warning in PuTTY on Windows 7](/docs/assets/371-putty-02-host-key-warning.png)](/docs/assets/371-putty-02-host-key-warning.png)

PuTTY is asking you to verify that the server you're logging into is who it says it is. This is due to the possibility that someone could be eavesdropping on your connection and posing as the server you are trying to log into. You need some "out of band" method to compare the key fingerprint presented to PuTTY with the fingerprint of the public key on the server you wish to log into. You may do so by logging into your Linode via [Lish](https://www.linode.com/docs/networking/using-the-linode-shell-lish) and executing the following command:

    ssh-keygen -l -f /etc/ssh/ssh_host_rsa_key.pub

If the fingerprints match, click "Yes" to accept the warning and cache this host key in the registry. You won't receive further warnings unless the key presented to PuTTY changes for some reason; typically, this should only happen if you reinstall the remote server's operating system. If you should receive this warning again from a system you already have the host key cached on, you should not trust the connection and investigate matters further.

You may log into your Linode with any user account you have configured on it. Next, you'll use pgAdmin to connect to PostgreSQL through the tunnel.

## Use pgAdmin

Launch pgAdmin and you'll be presented with a default view containing no servers. Click "File -> Add Server" as shown below.

[![pgAdmin III default view on Windows 7](/docs/assets/372-pgadmin-windows-use-1-add-server.png)](/docs/assets/372-pgadmin-windows-use-1-add-server.png)

In the "New Server Registration" dialog that appears, enter appropriate values for your server name and PostgreSQL user credentials. Be sure to specify "localhost" for the "Host" field, as you'll be connecting via your SSH tunnel. Click "OK" to connect to your server.

[![pgAdmin III new server details dialog](/docs/assets/373-pgadmin-windows-use-2-new-server-details.png)](/docs/assets/373-pgadmin-windows-use-2-new-server-details.png)

You will be presented with a full view of the databases that your user account has access to.

[![pgAdmin III full database view](/docs/assets/374-pgadmin-windows-use-3-database-view.png)](/docs/assets/374-pgadmin-windows-use-3-database-view.png)

Congratulations! You've gained secure, remote access to your PostgreSQL server with pgAdmin III.
