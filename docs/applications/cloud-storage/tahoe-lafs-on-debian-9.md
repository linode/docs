---
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to store confidential data in the cloud: Tahoe-LAFS keeps your data encrypted, validates at read time that it hasn't been tampered with and keeps redundant copies on multiple servers'
keywords: 'confidential, encrypted, integrity, redundant, private, filesystem, storage'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Weekday, Month 00st, 2015'
modified: Weekday, Month 00th, 2015
modified_by:
  name: Linode
title: 'How to Keep Your Data Private in the Cloud with Tahoe-LAFS'
contributor:
  name: Alexandru Andrei
  link:
  external_resources:
- '[Tahoe-LAFS Project Page](https://tahoe-lafs.org/)'
- '[Tahoe-LAFS Extensive Documentation](http://tahoe-lafs.readthedocs.io)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

----

## Introduction

    While Tahoe-LAFS may look like yet another decentralized or distributed file system, similar to Gluster, Ceph or others, the problems it solves are entirely different. The *Least Authority File Store* is designed with these things in mind:

1.  **Confidentiality**: Keeping your data private, even if you store it on somebody else's servers. When you keep sensitive/secret data in the cloud, some inherent risks exist.

*   If the server is hacked, your data might be stolen.
*   An employee that has read access might accidentally leak data or purposely steal it for his own gain.

    By encrypting data **before** it reaches your storage servers, these risks are practically nullified. Even if somebody is actively monitoring your machine, he will never see your data unencrypted. If you're unfamiliar with modern cryptography schemes, all you need to know is that nobody has officially managed to crack any of the strongest algorithms yet, and a lot of people are trying. Even the military and secret services rely on this area of mathematics to securely and secretly communicate across the world.

2.  **Data integrity**: Nobody can read your data but what about writing? You need to be sure that what you store on your nodes is exactly what you get back. This problem is also solved with the help of complicated and reliable mathematical algorithms. If an attacker changes just one of the billions of bits from 1 to 0, the software on your local computer will catch the error (when you download the respective data). Furthermore, it will also give you back the original data if enough of the other storage nodes haven't been tampered with.

3.  **Redundancy**: Disks can fail, servers can be lost for various reasons. Tahoe-LAFS distributes your data in a redundant fashion. By default, it uses a 3-of-10 configuration. This means that when you upload a file, it is split in ten shares and distributed randomly between your available storage nodes. To reconstruct the file, you need to get three of those shares back. If you have ten servers and a few fail, you can still retrieve your data. In an uniform distribution of shares, you would need only three servers but since distribution is random you might need more or even less. One server can hold zero, one, two, or more shares, depending on how the dice rolls (the dice does however tend to favor a near uniform distribution). Having even more storage nodes and changing the default 3-of-10 to something else means you can make the setup even more resistant to failure or attacks. 3-of-20 would give you a more uniform distribution. 1-of-10 would increase failure resistance but would keep 10 copies of your data. So one gigabyte of data would require 10 gigabytes of storage. This mechanic of shares makes it possible to destroy compromised or failed servers, create new ones, add them to the pool and redistribute shares if it's required.

    All of these things make Tahoe-LAFS a good fit for securely storing sensitive data on remote machines, while at the same time mitigating risks of data loss. You can think of it as a sort of Google Drive that hackers and employees can't access or alter, backed up on many different servers. The ability to dynamically increase storage space, by just adding to the pool of machines, is another nice advantage. For those that want to know more, the [Tahoe-LAFS documentation](http://tahoe-lafs.readthedocs.io/en/latest/about.html) hosted on Read the Docs is a great resource.

## Before You Begin

{: .note}
> The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide, deploy a Debian 9 (Stretch) image and complete the steps for setting your Linode's hostname and timezone. 

2.  Update your system:

        apt-get update && apt-get upgrade

## Server Requirements and Recommendations

1.  With the default settings, at least 10 storage nodes (servers) will be needed for satisfactory results. For testing purposes you can launch less, keeping in mind though that this is an "unhealthy" setup. Also note that with less than seven storage units, most uploads will fail entirely. Read the documentation about `shares.needed`, `shares.total` and `shares.happy` if you want to know more about [how to configure your nodes](http://tahoe-lafs.readthedocs.io/en/latest/configuration.html?#client-configuration
)

2.  Give your Linodes (that run storage nodes) at least 2GB of RAM. The larger the files you upload, the higher the memory and CPU pressure. With the current version of Tahoe-LAFS available in Debian 9's repositories, approximately 1GB (or more) of Random Access Memory (RAM) has been observed to be required when uploading mutable files larger than 40 Megabytes. Once the node runs out of RAM you will get an *out-of-memory kill*. Periodically check the Grid Status page in the web user interface to maintain your grid in good health.

3.  It's a good idea to distribute your Linodes among different datacenters. This makes the setup more reliable and resilient in the event of major problems with one of the locations.

## Install Tahoe-LAFS and Setup the Introducer

    Introducers are the "middlemen", central points that connect storage nodes and clients together in the grid. This allows the system to let every node know when a new peer joins the grid. It also tells the joining machines about the currently active peers it can connect to. There is however a downside to this: introducing a single point of failure. But without the introducers you would have to edit a configuration file on every node and add a new IP address every time you insert another node into the grid. The upside is that you can (and should) configure multiple introducers to make your setup more reliable in the event of crashes or other unforeseen events. These too would be, ideally, in different datacenters. After you get acquainted with the simple one introducer setup, you can [read about additional introducers](http://tahoe-lafs.readthedocs.io/en/latest/configuration.html#additional-introducer-definitions).

1.  After you've logged in as root, create an unprivileged user:

        adduser --disabled-password --gecos "" tahoe

2.  Now install Tahoe-LAFS:

        apt-get install tahoe-lafs

3.  Log in as the previously created unprivileged user:

        su - tahoe

4.  And finally, create the introducer configuration, replacing `203.0.113.1` with the public IP address of your Linode:

        tahoe create-introducer --port=tcp:1234 --location=tcp:203.0.113.1:1234 --basedir=introducer

5.  This will create a directory called `introducer` which contains a few configuration files. Logs and identifiers will be placed here as well. You'll need the identifier in the next steps so generate it now by starting up the introducer:

        tahoe run --basedir introducer

6.  The last line of output should mention **introducer running**. At this point you can hit **CTRL+C** to stop the program. The identifier that is needed, called a *FURL* is now generated. Display it in the terminal with the following command:

        cat introducer/private/introducer.furl

    Copy the whole line starting with **pb://** and paste it somewhere you can access it later. The storage nodes and clients will need to be configured with that value.

7.  Now logout from the user `tahoe` and return to root.

        exit

8.  To automatically start up the introducer every time your Linode boots, you will create a systemd service file (systemd is Debian's initialization system and service manager). Copy and paste all these lines together:

        cat <<EOF > /etc/systemd/system/tahoe-autostart-introducer.service
        [Unit]
        Description=Tahoe-LAFS autostart introducer
        After=network.target
        
        [Service]
        Type=simple
        User=tahoe
        WorkingDirectory=/home/tahoe
        ExecStart=/usr/bin/tahoe run introducer --logfile=logs/introducer.log
        
        [Install]
        WantedBy=multi-user.target
        EOF

    While a rule to restart the process in case of a crash can be added here, it's not a good idea since you want to inspect your Linode every time a node, client or introducer crashes, before restarting the process. In case you ever need to do so, start your introducer with `systemctl start tahoe-autostart-introducer.service` and restart it with `systemctl restart tahoe-autostart-introducer.service`.

2.  Enable the service to automatically start it at boot time:

        systemctl enable tahoe-autostart-introducer.service

3.  Start the introducer:

        systemctl start tahoe-autostart-introducer.service

    You can now close this SSH session to avoid confusing windows and entering commands on the wrong Linode when configuring the rest.

## Add Tahoe-LAFS Storage Nodes to the Grid

    Although the process can be automated, so you can easily expand your storage pool, it's recommended you set up your first node manually to get a better understanding of how things work and where certain files are located. The initial steps from the "Before You Begin" section apply here as well. Don't forget to `apt-get update && apt-get upgrade` before continuing.

    {: .note}
    >
    > If you need very large amounts of disk space, you can [configure block storage devices on your Linode](/docs/platform/how-to-use-block-storage-with-your-linode
). This should be done before all the other steps in this section. When you configure `/etc/fstab`, instead of mounting your volume in `/mnt/BlockStorage1` as instructed in the tutorial, mount it in `/home`. Use the same location when using the `mount` command. Unfortunately, going this route, has the added disadvantage that you won't be able to automate the creation of storage nodes with the steps provided in the next subsection.

1.  After you launch a new Linode and deploy Debian 9, login as root and create an unprivileged user:

        adduser --disabled-password --gecos "" tahoe

2.  Install Tahoe-LAFS:

        apt-get install tahoe-lafs

3.  And log in as the unprivileged user:

        su - tahoe

4.  At this point you need to retrieve the introducer FURL you've previously copied and paste it after `--introducer=`. Replace `pb://wfpeyyt7gyy6zu4sljsdelousqj5b5n7@tcp:203.0.113.1:1234/6jwlp57a4wdkrhquunyye6zyolowlbux` with your own FURL. Also replace `203.0.113.1` in --location with the public IP address of this Linode. And remember to choose unique nicknames for each server if you repeat this step on new Linodes.

    tahoe create-node --nickname=node01 --introducer=pb://wfpeyyt7gyy6zu4sljsdelousqj5b5n7@tcp:203.0.113.1:1234/6jwlp57a4wdkrhquunyye6zyolowlbux --port=tcp:1235 --location=tcp:203.0.113.1:1235 

    Configuration files, shares, logs and other data will be found under the `/home/tahoe/.tahoe` directory.

5.  Logout to get back to your root shell:

        exit

6.  Now create a systemd service file:

        cat <<EOF > /etc/systemd/system/tahoe-autostart-node.service
        [Unit]
        Description=Tahoe-LAFS autostart node
        After=network.target
        
        [Service]
        Type=simple
        User=tahoe
        WorkingDirectory=/home/tahoe
        ExecStart=/usr/bin/tahoe run .tahoe --logfile=logs/node.log
        
        [Install]
        WantedBy=multi-user.target
        EOF

7.  And enable the service to autostart your storage node at boot time:

        systemctl enable tahoe-autostart-node.service

8.  Finally, start the service to launch your node:

        systemctl start tahoe-autostart-node.service

### Automatically Configure Storage Nodes with Linode StackScripts

    Since some users may require tens or hundreds of storage nodes, newly deployed Linodes can be automated to go through the previous steps for you.

 {: .note}
    >
    > To make sure you're proceeding correctly, you can temporarily skip to the next two sections, and then open the web user interface in your local browser. Then, return to this section, and after launching each Linode you can wait one or two minutes and then refresh the page. The new storage node should appear in a list there, along with a green checkmark next to it. This allows you to confirm each successful setup, instead of launching all instances in the dark, only to find out later something has gone wrong.

    {: .caution}
    >
    > The following StackScript relies on icanhazip.com to retrieve each Linode's external IP address. While the site has redundant servers, for various reasons, it might function incorrectly or be unavailable at some moment in time. That's why you should check that it works correctly before continuing.

    1.  After reading [about StackScripts](https://www.linode.com/docs/platform/stackscripts), navigate to the page where you can add a new StackScript, select Debian 9 as the distribution and paste the following in the **Script** section:

        #!/bin/bash
        
        #<UDF name="nickname" Label="Storage Node Nickname" example="node01" />
        #<UDF name="introducer" Label="Introducer FURL" example="pb://wfpe..." />
        
        apt-get update
        apt-get -y upgrade
        adduser --disabled-password --gecos "" tahoe
        apt-get -y install tahoe-lafs
        su - -c "tahoe create-node --nickname=$NICKNAME --introducer=$INTRODUCER --port=tcp:1235 --location=tcp:`curl -4 -s icanhazip.com`:1235" tahoe
        
        cat <<EOF > /etc/systemd/system/tahoe-autostart-node.service
        [Unit]
        Description=Tahoe-LAFS autostart node
        After=network.target
        
        [Service]
        Type=simple
        User=tahoe
        WorkingDirectory=/home/tahoe
        ExecStart=/usr/bin/tahoe run .tahoe --logfile=logs/node.log
        
        [Install]
        WantedBy=multi-user.target
        EOF
        
        systemctl enable tahoe-autostart-node.service
        
        systemctl start tahoe-autostart-node.service

2.  After you've saved the changes, launch a new Linode, deploy this StackScript on a Debian 9 image and boot.

## Set up the Tahoe-LAFS Client on Your Local Computer

1.  To securely upload and download files to and from the grid, you must set up a client node on your local machine. While you could use port forwarding to access the web user interface from a storage node hosted on Linode, or use the command line interface on a remote server to work with files in the grid, it's not recommended to do so. Going this route exposes you to a few risks like accidentally leaking unencrypted data or *filecaps/dircaps* (think of them as passwords, giving you access to files and directories; more about this later).

2.  Windows users can follow these instructions to [setup Tahoe-LAFS on Windows](http://tahoe-lafs.readthedocs.io/en/latest/windows.html), the [instructions for MacOS users are here](http://tahoe-lafs.readthedocs.io/en/latest/OS-X.html) and Linux users should use their distribution's package manager to install Tahoe-LAFS. If you're unlucky, and your distribution doesn't include Tahoe in its repositories, you might have to [build Tahoe-LAFS](http://tahoe-lafs.readthedocs.io/en/latest/INSTALL.html?highlight=build%20tahoe#preliminaries).

3.  After you've installed the software, run the following command to configure a client node, replacing `pb://wfpeyyt7gyy6zu4sljsdelousqj5b5n7@tcp:203.0.113.1:1234/6jwlp57a4wdkrhquunyye6zyolowlbux` with your own introducer FURL:

        tahoe create-client --basedir client --nickname=localclient --introducer=pb://wfpeyyt7gyy6zu4sljsdelousqj5b5n7@tcp:203.0.113.1:1234/6jwlp57a4wdkrhquunyye6zyolowlbux

4.  Whenever you need to work with your grid, launch the client:

    tahoe run --basedir client

5.  When you're done, close it by pressing **CTRL+C**.

## How to Use Tahoe-LAFS' Web User Interface

1.  Out of the multiple ways to interact with your grid, the web user interface is the most user-friendly. One very useful feature is the bird's eye view it gives you over the whole grid, showing active and inactive nodes, connection statuses and errors, total storage space available and other details.

2.  By default, the web server is listening on the *loopback* interface, on port 3456, which means you can connect to it by launching the local client (`tahoe run --basedir client`) and then entering this address in your preferred web browser: **localhost:3456**.

[![Tahoe-LAFS Web User Interface](/docs/assets/tahoe-lafs-web-user-interface_small.png)](/docs/assets/tahoe-lafs-web-user-interface.png)

3.  Files can be uploaded using one of three different algorithms:

*   Immutable: designed to store files that won't be altered.
*   SDMF (Small Mutable Distributed Files): although initially designed for very small files, it supports much larger sizes now but has one flaw; it has to replace all blocks even when just a few bytes have changed. When working with a few megabytes of data you won't really notice a problem though.
*   MDMF (Medium Distributed Mutable Files): allows large files to be modified in-place, with only the segments that changed, append data, and selectively retrieve only certain blocks that the user requests. Use this for large files that you update often.

4.  After you upload a file, you get a so-called *capability* or filecap. An SDMF filecap for example looks something like this: URI:SSK:4a4hv34xtt43a6s7ft76i563oa:7s643ebsf2yujglqhn55xo7c5ohunx2tpoi32dahgr23seob7t5q. These are the only way you can access your data, that's why it's important to keep them somewhere safe. **Once you lose a filecap there is no way you can get your data back.**

5.  Since it's hard to keep track of multiple random strings of characters, a more efficient way to store your data is to organize it in directories. These come with a handful of advantages:

[![Directory Displayed in Web User Interface](/docs/assets/tahoe-lafs-directory-seen-in-wui_small.png)](/docs/assets/tahoe-lafs-directory-seen-in-wui.png)

*   They can be bookmarked in your browser, allowing you to easily come back to them. Keep in mind that these too are accessed by using cryptographic secrets. If you lose the bookmarks or directory writecaps/readcaps, there's no way you can recover. You can still access directory contents though if you have individual elements bookmarked or their capabilities saved somewhere.
*   It's easier to keep track of a directory capability that gives you access to hundreds of objects rather than keep track of hundreds of capabilities.
*   Clicking on **More Info** or **More info on this directory** allows you to get read only capabilities (so you can share data with others), verify data integrity, repair and redistribute unhealthy shares.

## How to Use Tahoe-LAFS' Command Line Interface

1.  Although the web user interface is easy to work with, it has some limitations. Another way to interact with files and directories is by using the command line interface. Some of its advantages include: ability to recursively upload files, synchronizing (backing up) directories. 

    After you've launched the local client, open another terminal window or command prompt and create an alias:

        tahoe create-alias testing:

    This will create a directory on the grid and associate an alias to it so you can easily access it by typing `testing:` instead of a long capability.

2.  To copy an existing file from your current, local working directory into your new alias:

        tahoe cp file1 testing:

3.  Listing the alias' contents is done with:

        tahoe ls testing:

4.  If you want to list the file/directory capabilities as well, type:

        tahoe ls --uri testing:

5.  If you want to upload an entire directory use:

        tahoe cp --recursive name-of-local-directory testing:

6.  Backing up a directory is done with:

        tahoe backup name-of-local-directory testing:

    This will create incremental backups, kept in timestamped directories, and it will only upload files that have changed when running the command again.

7.  Another useful command to remember is:

        tahoe deep-check --repair testing:

    This can fix problems and also redistribute file shares when it is required. It's a good idea to routinely run this command on important directories and especially after you've lost a few storage nodes.

8.  You should also save the capabilities stored in your aliases and keep them some place safe (back them up on another machine, preferably encrypted with a strong password). You can see these with:

        tahoe list-aliases

9.  To display a list of available commands you can simply type `tahoe`. If you need additional help on a command type `tahoe name-of-command --help`, for example: `tahoe ls --help`. On the following page, you can find [additional information about Tahoe-LAFS' commands](http://tahoe-lafs.readthedocs.io/en/latest/frontends/CLI.html).

## Possible Next Steps

1.  Now that you have your grid up and running, your only job is to maintain it in good working condition. Some improvements can be made, especially if they're also necessary. For example, people with low upload bandwidth will notice that it can take a long time to send a file to the grid. That's because your local Tahoe client also has to send redundant data to multiple nodes. The following document describes [how to set up a helper node](http://tahoe-lafs.readthedocs.io/en/latest/helper.html).

2.  In time, your storage servers might get full with data you no longer need. Read about [garbage collection](http://tahoe-lafs.readthedocs.io/en/latest/garbage-collection.html) to understand how you can get rid of the unnecessary files.
