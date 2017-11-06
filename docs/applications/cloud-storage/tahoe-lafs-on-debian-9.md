---
author:
  name: Linode Community
  email: docs@linode.com
description: "Tahoe-LAFS keeps your data encrypted, validates at read time that it hasn't been tampered with and keeps redundant copies on multiple servers."
keywords: 'confidential, encrypted, integrity, redundant, private, filesystem, storage'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Tuesday, October 24th, 2017'
modified: Thursday, October 26th, 2017
modified_by:
  name: Linode
title: 'How to Keep Your Data Private in the Cloud with Tahoe-LAFS'
og_description: 'Tahoe Least Authority File Store, or LAFS, is a decentralized or distributed system. It focuses on confidentiality, data integrity, and redundancy to help keep files secure and accessible.'
contributor:
  name: Alexandru Andrei
external_resources:
- '[Tahoe-LAFS Project Page](https://tahoe-lafs.org/)'
- '[Tahoe-LAFS Documentation](http://tahoe-lafs.readthedocs.io)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

----

## What is Tahoe-LAFS?

While Tahoe-LAFS might resemble other decentralized or distributed file system, like Gluster, Ceph or others, the problems it solves are different. The *Least Authority File Store* (LAFS) is designed with these things in mind:

1.  **Confidentiality**: Keeping your data private, even if you store it on outside servers. When you keep sensitive data in the cloud, some inherent risks exist. For example:

    *  If the server is hacked, your data could be stolen.
    *  An user with read access might accidentally leak data or purposely steal it for their own gain.

    By encrypting data before it reaches your storage servers, these risks are reduced. 

2.  **Data integrity**: If the encrypted data is compromised, the software detects the change, and in some cases, may still restore the original.

3.  **Redundancy**: Tahoe-LAFS distributes your data in a redundant fashion.

    By default, it uses a 3-of-10 configuration. This means that when you upload a file, it is split into ten shares and distributed randomly between your available storage nodes. To reconstruct the file, you need to get three of those shares back. If you have ten servers and a few fail, you can still retrieve your data. In a uniform distribution of shares, you would need only three servers. Since distribution is random the number required differs. One server can hold zero, one, two, or more shares, depending on the random number generated (it does however tend to favor a near uniform distribution).

    Having more storage nodes and changing the default 3-of-10 to something else means you can make the setup more resistant to failure or attacks. 3-of-20 would give you a more uniform distribution. 1-of-10 would increase failure resistance but would keep ten copies of your data. So one gigabyte of data would require ten gigabytes of storage. This mechanism of shares makes it possible to destroy compromised or failed servers, create new ones, add them to the pool and redistribute shares if required.

All of these things make Tahoe-LAFS a good fit for securely storing sensitive data on remote machines, while at the same time mitigating risks of data loss. Storage space can be increased dynamically by adding to the pool of machines. To learn more, visit the [Tahoe-LAFS documentation](http://tahoe-lafs.readthedocs.io/en/latest/about.html).

## Before You Begin

{: .note}
> The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide, deploy a Debian 9 (Stretch) image and complete the steps for setting your Linode's hostname and timezone.

2.  Update your system:

        apt-get update && apt-get upgrade

## Server Requirements and Recommendations

1.  With the default settings, at least 10 storage nodes will be needed for satisfactory results. For testing purposes you can launch fewer, but keep in mind that with less than seven storage units, most uploads will fail entirely. Read the documentation about `shares.needed`, `shares.total` and `shares.happy` to learn more about [how to configure your nodes](http://tahoe-lafs.readthedocs.io/en/latest/configuration.html?#client-configuration).

2.  Create the storage node Linodes with at least 2GB of RAM. The larger the files you plan to upload, the higher the memory and CPU pressure. With the current version of Tahoe-LAFS available in Debian 9's repositories, at least 1GB RAM is required when uploading mutable files larger than 40MB. Once the node runs out of RAM you will get an *out-of-memory kill*. Periodically check the Grid Status page in the web user interface to maintain your grid.

3.  For a more reliable and resilient setup, create Linodes in different data centers.

## Install Tahoe-LAFS and Set Up the Introducer

Introducers are the *middlemen*, central points that connect storage nodes and clients together in the grid.

Introducers have a variety of advantages and disadvantages:

*  Allow the system to alert every node when a new peer joins the grid.
*  Tell the joining machines about the currently active peers to which it can connect.
*  Potential for a single point of failure. But,
*  Without the introducers you would have to edit a configuration file on every node, and add a new IP address every time you insert another node into the grid.
*  Allow you to configure multiple introducers to make your setup more reliable in the event of crashes or other unforeseen events, ideally, in different datacenters.

After you get acquainted with the initial introducer setup, you can [read about additional introducers](http://tahoe-lafs.readthedocs.io/en/latest/configuration.html#additional-introducer-definitions).

1.  Log in as root and create an unprivileged user:

        adduser --disabled-password --gecos "" tahoe

2.  Install Tahoe-LAFS:

        apt-get install tahoe-lafs

3.  Log in as the `tahoe` user:

        su - tahoe

4.  Create the introducer configuration, replacing `203.0.113.1` with the public IP address of your Linode:

        tahoe create-introducer --port=tcp:1234 --location=tcp:203.0.113.1:1234 --basedir=introducer

    This creates a directory called `introducer` which contains a few configuration files. Logs and identifiers will be placed here as well.

5.  Generate an identifier by starting the introducer:

        tahoe run --basedir introducer

    The last line of output should mention `introducer running`. Press **CTRL+C** to stop the program. The identifier that is needed, called a *FURL* is now generated. 

6.  Display the FURL using `cat`:

        cat introducer/private/introducer.furl

    Copy the whole line starting with **pb://** and paste it somewhere you can access it later. The storage nodes and clients will need to be configured with that value.

7.  Logout from the user `tahoe` and return to root:

        exit

8.  To automatically start up the introducer on boot, create a systemd service file with the following:

      {:.file-excerpt}
      /etc/systemd/system/tahoe-autostart-introducer.service
      : ~~~
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
        ~~~

    While a rule to restart the process in case of a crash can be added here, it's better to inspect the Linode each time a node, client or introducer crashes, before restarting the process.

9.  Enable the service to automatically start at boot:

        systemctl enable tahoe-autostart-introducer.service

10. Start the introducer:

        systemctl start tahoe-autostart-introducer.service

    You can now close the SSH session to avoid confusing windows and entering commands on the wrong Linode when configuring the rest.

### How to Restart the Introducer

If the process crashes or encounters an error, start or restart the service with these commands.

Start the introducer service:

    systemctl start tahoe-autostart-introducer.service

Restart the service:

    systemctl restart tahoe-autostart-introducer.service

## Add Tahoe-LAFS Storage Nodes to the Grid

Although the process can be automated so that you can easily expand your storage pool, set up your first node manually to get a better understanding of how things work and where certain files are located. The initial steps from the [Before You Begin](#before-you-begin) section apply here as well.

{: .note}
>
> If you need large amounts of disk space, [configure block storage devices on your Linode](/docs/platform/how-to-use-block-storage-with-your-linode).
>
> Configure block storage before the other steps in this section.
>
> When you configure `/etc/fstab`, instead of mounting your volume in `/mnt/BlockStorage1` as instructed in the tutorial, mount it in `/home`. Use the same location when using the `mount` command. Unfortunately, going this route, has the added disadvantage that you won't be able to automate the creation of storage nodes with the steps provided in [the next subsection](#automatically-configure-storage-nodes-with-linode-stackscripts).

1.  After you launch a new Linode and deploy Debian 9, login as root and create an unprivileged user:

        adduser --disabled-password --gecos "" tahoe

2.  Install Tahoe-LAFS:

        apt-get install tahoe-lafs

3.  Log in as the unprivileged user:

        su - tahoe

4.  Retrieve the introducer FURL copied in Step 6 of [the introducer installation](#install-tahoe-lafs-and-set-up-the-introducer), and paste it after `--introducer=`. Replace `pb://<Introducer FURL>` with your own FURL. Replace `203.0.113.1` in `--location` with the public IP address of the Linode. Choose unique nicknames for each server as you repeat this step on new Linodes.

        tahoe create-node --nickname=node01 --introducer=pb://<Introducer FURL> --port=tcp:1235 --location=tcp:203.0.113.1:1235

    Configuration files, shares, logs and other data are in `/home/tahoe/.tahoe`.

5.  Return to the root shell:

        exit

6.  Create a systemd service file:

      {:.file}
      /etc/systemd/system/tahoe-autostart-node.service
      : ~~~
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
        ~~~

7.  Enable the service to autostart the storage node at boot:

        systemctl enable tahoe-autostart-node.service

8.  Start the service to launch the node:

        systemctl start tahoe-autostart-node.service

### How to Use Linode StackScripts to Automatically Configure Storage Nodes

Since some users may require tens or hundreds of storage nodes, automate configuration of newly deployed Linodes with StackScripts.

To confirm each successful setup instead of launching all instances before verifying that they work, you can temporarily skip to the next two sections, and use the web user interface in your local browser. Then, return to this section, and after launching each Linode refresh the page after a few minutes. The new storage node should appear along with a green checkmark next to it.

{: .note}
>
> This StackScript relies on *icanhazip.com* to retrieve each Linode's external IP address. While the site has redundant servers, there is a chance it may unavailable at times.

1.  [Familiarize yourself with StackScripts](/docs/platform/stackscripts), then navigate to the [StackScripts page](https://manager.linode.com/stackscripts/index) to add a new StackScript.

2.  Select Debian 9 as the distribution and paste the following in the **Script** section:

        #!/bin/bash

        #<UDF name="nickname" Label="Storage Node Nickname" example="node01" />
        #<UDF name="introducer" Label="Introducer FURL" example="pb://wfpe..." />

        apt-get update
        apt-get -y upgrade
        adduser --disabled-password --gecos "" tahoe
        apt-get -y install tahoe-lafs
        su - -c "tahoe create-node --nickname=$NICKNAME --introducer=$INTRODUCER --port=tcp:1235 --location=tcp:`curl -4 -s icanhazip.com`:1235" tahoe

        echo "[Unit]
        Description=Tahoe-LAFS autostart node
        After=network.target

        [Service]
        Type=simple
        User=tahoe
        WorkingDirectory=/home/tahoe
        ExecStart=/usr/bin/tahoe run .tahoe --logfile=logs/node.log

        [Install]
        WantedBy=multi-user.target" >> /etc/systemd/system/tahoe-autostart-node.service

        systemctl enable tahoe-autostart-node.service

        systemctl start tahoe-autostart-node.service

    Save the changes.

3.  Create a new Linode, deploy the StackScript on a Debian 9 image, and boot.

4.  Repeat this procedure to create as many nodes as necessary for your storage cluster.

## Set up the Tahoe-LAFS Client on Your Local Computer

To securely upload and download files to and from the grid, you must set up a client node on your local machine.

While you could use port forwarding to access the web user interface from a storage node hosted on Linode, or use the command line interface on a remote server to work with files in the grid, it's not recommended to do so. Going this route exposes you to a few risks like accidentally leaking unencrypted data or *filecaps/dircaps* (think of them as passwords, giving you access to files and directories; more about this later).

Install the Tahoe-LAFS Client for your operating system:

*  [Windows](http://tahoe-lafs.readthedocs.io/en/latest/windows.html)
*  [MacOS](http://tahoe-lafs.readthedocs.io/en/latest/OS-X.html)
*  Linux users should use their distribution's package manager to install Tahoe-LAFS (as in previous sections).

    *  If your distribution doesn't include Tahoe in its repositories, [build Tahoe-LAFS from source](http://tahoe-lafs.readthedocs.io/en/latest/INSTALL.html?highlight=build%20tahoe#preliminaries).

1.  Run `tahoe create-client` to configure a client node, replacing `pb://<Introducer FURL>` with your own introducer FURL:

        tahoe create-client --nickname=localclient --introducer=pb://<Introducer FURL>

2.  Launch the client to work with your grid:

        tahoe run

3.  Close the server with **CTRL+C**.

## Manage your Grid with Tahoe-LAFS's Web Interface

The web interface is the most user-friendly way to interact with your grid. One of the useful features of the interface is the bird's eye view it gives you over the whole grid, showing active and inactive nodes, connection status and errors, total storage space available, and other details.

1.  By default, the web server listens on the *loopback* interface, on port `3456`. Connect to it by launching the local client, then navigating to the address in your web browser:

        tahoe run --basedir client

    [![Tahoe-LAFS Web User Interface](/docs/assets/tahoe-lafs-web-user-interface_small.png)](/docs/assets/tahoe-lafs-web-user-interface.png "Tahoe-LAFS Web User Interface")

2.  Files can be uploaded using one of three algorithms:

    *  **Immutable**: Designed to store files that won't be altered.
    *  **SDMF (Small Mutable Distributed Files)**: Initially designed for small files, but supports larger sizes as well. May be slow for large files because it has to replace all blocks even when a few bytes have changed.
    *  **MDMF (Medium Distributed Mutable Files)**: Allows large files to be modified in-place, with only the segments that have changed, it allows you to append data, and selectively retrieve only certain blocks that the user requests. Use this for large files that you update often.

3.  After you upload a file, you get a *capability* or filecap. An SDMF filecap for example looks something like: 

        URI:SSK:4a4hv34xtt43a6s7ft76i563oa:7s643ebsf2yujglqhn55xo7c5ohunx2tpoi32dahgr23seob7t5q

    Filecaps are the only way you to access the data once it's encrypted. Store filecaps somewhere safe. **If you lose a filecap there is no way to retrieve your data.**

4.  Since it's hard to keep track of multiple random strings of characters, a more efficient way to store your data is to organize it in directories. These come with a handful of advantages:

    [![Directory Displayed in Web User Interface](/docs/assets/tahoe-lafs-directory-seen-in-wui_small.png)](/docs/assets/tahoe-lafs-directory-seen-in-wui.png "Directory Displayed in Web User Interface")

    *  They can be bookmarked in your browser, allowing you to easily come back to them.
        *  These are also accessed using cryptographic secrets. If you lose the bookmarks or directory writecaps/readcaps, there's no way to recover them. You can still access directory contents though if you have individual elements bookmarked or their capabilities saved somewhere.
    *  It's easier to keep track of a directory capability that gives you access to hundreds of objects rather than keep track of hundreds of capabilities.
    *  Click **More Info** or **More info on this directory** to get read only capabilities so you can share data with others, verify data integrity, or repair and redistribute unhealthy shares.

## How to Use Tahoe-LAFS's Command Line Interface

While the web user interface is easy to work with, it has some limitations. Another way to interact with files and directories is through the command line interface. Some of its advantages include the ability to recursively upload files, and synchronizing (backing up) directories.

*  After you've launched the local client, open another terminal window or command prompt and create an alias:

       tahoe create-alias testing

    This will create a directory on the grid and associate an alias to it so you can easily access it by typing `testing:` instead of a long capability.

*  To copy an existing file from your current, local working directory into your new alias:

       tahoe cp file1 testing:

*  List the alias contents:

       tahoe ls testing:

*  List the file/directory capabilities:

       tahoe ls --uri testing:

*  To upload an entire directory:

       tahoe cp --recursive name-of-local-directory testing:

*  Back up a directory:

       tahoe backup name-of-local-directory testing:

    This creates incremental backups, kept in timestamped directories, and it will only upload files that have changed when running the command again.

*  Fix problems and redistribute file shares when required:

       tahoe deep-check --repair testing:

    It's a good idea to routinely run this command on important directories and especially after you've lost a few storage nodes.

*  You should also save the capabilities stored in your aliases and keep them some place safe (back them up on another machine, preferably encrypted with a strong password). You can see these with:

       tahoe list-aliases

*  To display a list of available commands:

       tahoe
    
*  If you need additional help on a command:

       tahoe name-of-command --help
    
    For example: `tahoe ls --help`. For more information about Tahoe-LAFS, visit the [official documentation](http://tahoe-lafs.readthedocs.io/en/latest/frontends/CLI.html).

## Possible Next Steps

Now that you have your grid up and running, it's important to maintain it in good working condition. Some improvements can be made:

1.  If people with low upload bandwidth notice that it takes a long time to send a file to the grid, [set up helper nodes](http://tahoe-lafs.readthedocs.io/en/latest/helper.html). Slowdowns may occur because your local Tahoe client also has to send redundant data to multiple nodes.

2.  In time, your storage servers might get full with data you no longer need. Read about [garbage collection](http://tahoe-lafs.readthedocs.io/en/latest/garbage-collection.html) to understand how you can get rid of the unnecessary files.
