---
author:
  name: Linode
  email: docs@linode.com
description: 'Accessing CouchDB databases remotely using an SSH tunnel.'
keywords: 'couchdb tunnel,couchdb over SSH,SSH tunnel'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['databases/couchdb/ssh-tunnel/']
modified: Tuesday, May 17th, 2011
modified_by:
  name: Linode
published: 'Thursday, February 4th, 2010'
title: Securely Administer CouchDB with an SSH Tunnel
external_resources:
 - '[Using PuTTY](/docs/networking/using-putty#using_ssh_tunnels)'
 - '[CouchDB Documentation](/docs/databases/couchdb/)'
---

During the development and administration of your CouchDB server and application you may wish to access the "Futon" interface, or interact with the data store from the local machine. This guide shows you how to connect to your CouchDB instance in a secure manner using an SSH tunnel. We assume you have CouchDB up and running on your Linode, and that it is configured to listen on `localhost` (127.0.0.1) on the server, which is the default configuration. After following these instructions, you'll be able to connect to `localhost` on your local workstation. The connection will be securely forwarded to your Linode over the Internet.

## Create a Tunnel with PuTTY on Windows

### Connecting to your VPS

You can obtain the software from the [PuTTY download page](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html). For Microsoft Windows users, PuTTY is compatible with Windows 95 or greater (practically any modern Windows computer can run it). Simply save the program to your desktop and double-click it to begin. You'll be presented with this screen:

[![The session login screen in PuTTY on Windows.](/docs/assets/385-putty-01-session.png)](/docs/assets/385-putty-01-session.png)

Enter the hostname or IP address of the system you'd like to log into and click "Open" to start an SSH session. If you haven't logged into this system with PuTTY before, you will receive a warning similar to the following:

[![An unknown host key warning in PuTTY on Windows.](/docs/assets/386-putty-02-host-key-warning.png)](/docs/assets/386-putty-02-host-key-warning.png)

In this case, PuTTY is asking you to verify that the server you're logging into is who it says it is. This is due to the possibility that someone could be eavesdropping on your connection and posing as the server you are trying to log into. You need some "out of band" method of comparing the key fingerprint presented to PuTTY with the fingerprint of the public key on the server you wish to log into. You may do so by logging into your Linode via the AJAX console (see the "Console" tab in the Linode Manager) and executing the following command:

    ssh-keygen -l -f /etc/ssh/ssh_host_rsa_key.pub 

The key fingerprints should match; click "Yes" to accept the warning and cache this host key in the registry. You won't receive further warnings unless the key presented to PuTTY changes for some reason; typically, this should only happen if you reinstall the remote server's operating system. If you should receive this warning again from a system you already have the host key cached on, you should not trust the connection and investigate matters further.

### Setting up the Tunnel

Visit the "Connection -\> SSH -\> Tunnels" screen in PuTTY. Enter "5984" for the "Source port" field and "127.0.0.1:5984" for the "Destination" field.

Once you've connected to the remote server with this tunnel configuration, you'll be able to direct the browser on your local machine to `http://localhost:5984/_utils/` to access CouchDBs "Futon" interface. You will also be able to access CouchDB directly by way of its HTTP interface located at `http://localhost:5984` without needing to access the CouchDB server over a public IP.

## Create a Tunnel with couchdb-tunnel on Mac OS X or Linux

Save the following Perl script to your local home directory as `couchdb-tunnel.pl`:

{: .file }
couchdb-tunnel.pl
:   ~~~ perl
    #!/usr/bin/perl

    # CouchDB Tunnel Tool for MacOS X and Linux
    # Copyright (c) 2010 Linode, LLC
    # Author: Philip C. Paradis <pparadis@linode.com>
    # Modifications: Linode <sam@linode.com>
    # Usage: couchdb-tunnel.pl [start|stop]
    # Access a CouchDB database instance by way of an SSH tunnel.

    ## 
    ## Edit these values to reflect the authentication credentials for the
    ## server running the CouchDB instance with which you wish to
    ## connect. If you have chosen to run CouchDB on an alternate port,
    ## modify the `$remote_port` value. You should not need to modify the
    ## `$remote_ip` value. 
    ## 

    $remote_user = "username";
    $remote_host = "hostname.example.com";
    $remote_port = "5984";
    $remote_ip   = "127.0.0.1";

    ##
    ## Modify these values only if you are running a local CouchDB
    ## instance. 
    ## 

    $local_ip    = "127.0.0.1";
    $local_port  = "5984";

    ##
    ## You do not need to edit this file beyond this point. 
    ## 

    $a = shift;
    $a =~ s/^\s+//;
    $a =~ s/\s+$//;

    $pid=`ps ax|grep ssh|grep $local_port|grep $remote_port`;
    $pid =~ s/^\s+//;
    @pids = split(/\n/,$pid);
    foreach $pid (@pids)
    {
     if ($pid =~ /ps ax/) { next; }
     split(/ /,$pid);
    }

    if (lc($a) eq "start")
    {
     if ($_[0]) { print "CouchDB tunnel already running.\n"; exit 1; }
     else
     {
      system "ssh -f -L $local_ip:$local_port:$remote_ip:$remote_port $remote_user\@$remote_host -N";
      exit 0;
     }
    }
    elsif (lc($a) eq "stop")
    {
     if ($_[0]) { kill 9,$_[0]; exit 0; }
     else { exit 1; }
    }
    else
    {
     print "Usage: couchdb-tunnel.pl [start|stop]\n";
     exit 1;
    }
    ~~~

Modify the variables "\$remote\_user" and "\$remote\_host" to reflect your remote user account and server name. If you're already running a local copy of CouchDB on your workstation, you'll want to adjust the "\$local\_host" variable to something different (e.g. port number `5985`). Make the script executable by issuing the following command in a terminal window:

    chmod +x ~/couchdb-tunnel.pl

To start the tunnel, issue the following command:

    ./couchdb-tunnel.pl start

When you're done with the tunnel, you may stop it with this command:

    ./couchdb-tunnel.pl stop

Once you've connected to the remote server with this tunnel configuration, you'll be able to direct the browser on your local machine to `http://localhost:5984/_utils/` to access CouchDBs "Futon" interface. You will also be able to access CouchDB directly by way of its HTTP interface located at `http://localhost:5984` without needing to access the CouchDB server over a public IP.