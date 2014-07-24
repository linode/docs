---
author:
  name: Linode
  email: docs@linode.com
description: 'Using the open source pgAdmin program to securely manage remote PostgreSQL databases from a Mac OS X workstation.'
keywords: 'pgadmin,pgadmin mac os x,postgresql gui,manage postgresql databases'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Tuesday, May 17th, 2011
modified_by:
  name: Linode
published: 'Friday, April 30th, 2010'
title: Securely Manage Remote PostgreSQL Servers with pgAdmin on Mac OS X
---

pgAdmin is a free, open source PostgreSQL database administration GUI for Microsoft Windows, Apple Mac OS X and Linux systems. It offers excellent capabilities with regard to database server information retrieval, development, testing, and ongoing maintenance. This guide will help you get up and running with pgAdmin on Mac OS X, providing secure access to remote PostgreSQL databases. It is assumed that you have already installed PostgreSQL on your Linode VPS in accordance with our [PostgreSQL installation guides](/docs/databases/postgresql/).

Installing pgAdmin
------------------

Visit the [pgAdmin download page](http://www.pgadmin.org/download/macosx.php) to obtain the most recent version of the program. Save the installer to your desktop and launch it. Read the license agreement and click the "Agree" button to continue.

[![pgAdmin on Mac OS X installer license agreement dialog](/docs/assets/375-pgadmin-macos-install-1.png)](/docs/assets/375-pgadmin-macos-install-1.png)

After the program has uncompressed itself, you'll see a pgAdmin icon in a Finder window. You may drag this to your Applications folder or your dock.

SSH Tunnel Configuration
------------------------

While PostgreSQL supports SSL connections, it is not advisable to instruct it to listen on public IP addresses unless absolutely necessary. For this reason, you'll be using the script found below to create an SSH tunnel to your database server. Save it to your local home directory as `postgresql-tunnel.pl`, making sure to change the `$remote_user` and `$remote_host` variables to match your setup.

~~~ perl
#!/usr/bin/perl

# PostgreSQL Tunnel Tool for Mac OS X and Linux
# Copyright (c) 2010 Linode, LLC
# Author: Philip C. Paradis <pparadis@linode.com>
# Usage: postgresql-tunnel.pl [start|stop]
# Access a PostgreSQL database server via an SSH tunnel.

$local_ip    = "127.0.0.1";
$local_port  = "5433";
$remote_ip   = "127.0.0.1";
$remote_port = "5432";
$remote_user = "alison";
$remote_host = "hostname.example.com";

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
 if ($_[0]) { print "Tunnel already running.\n"; exit 1; }
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
 print "Usage: postgresql-tunnel.pl [start|stop]\n";
 exit 1;
}
~~~

You can start the tunnel by issuing the following commands from your home directory in a terminal window:

    chmod +x postgresql-tunnel.pl
    ./postgresql-tunnel.pl start

Using pgAdmin
-------------

Launch pgAdmin and you'll be presented with a default view containing no servers. Click "File -\> Add Server" as shown below.

[![pgAdmin III default view on Mac OS X](/docs/assets/376-pgadmin-mac-os-x-use-1-add-server.png)](/docs/assets/376-pgadmin-mac-os-x-use-1-add-server.png)

In the "New Server Registration" dialog that appears, enter appropriate values for your server name and PostgreSQL account credentials. Be sure to specify "localhost" for the "Host" field, as you'll be connecting via your SSH tunnel. Click "OK" to connect to your server.

[![pgAdmin III new server details dialog on Mac OS X](/docs/assets/377-pgadmin-mac-os-x-use-2-new-server-details.png)](/docs/assets/377-pgadmin-mac-os-x-use-2-new-server-details.png)

You will be presented with a full view of the databases that your user account has access to.

[![pgAdmin III full database view on Mac OS X](/docs/assets/378-pgadmin-mac-os-x-use-3-database-view.png)](/docs/assets/378-pgadmin-mac-os-x-use-3-database-view.png)

Congratulations! You've securely connected to your remote PostgreSQL server with pgAdmin III.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [pgAdmin Documentation](http://www.pgadmin.org/docs/)
- [PostgreSQL Documentation](http://www.postgresql.org/docs/)



