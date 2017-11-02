---
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'This guide shows how to install Subsonic media server on a Linode and then configure and run it on Ubuntu or Debian to stream music.'
og_description: 'Subsonic is a media streaming service that makes it easy to share music and video files with multiple users. Learn how to install it on Ubuntu and Debian.'
keywords: ["subsonic", " music", " audio"]
aliases: ['applications/media-servers/subsonic/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-10-27
modified_by:
  name: Alex Fornuto
published: 2015-02-02
title: Install Subsonic Media Server on Ubuntu or Debian to Stream Music Through Your Linode
---

## What is Subsonic?

[Subsonic](http://subsonic.org) is an easy-to-use media streaming service with a user-friendly interface, and the ability to share music and video with multiple users. A Subsonic media server could benefit from large amounts of disk space, so consider using our [Block Storage](/docs/platform/how-to-use-block-storage-with-your-linode) service with this setup.

This guide explains how to set up [Subsonic](http://subsonic.org) on a Linode running Debian or Ubuntu.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the **sudo** prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Prepare Your System

1.  Update your system:

        apt-get update && apt-get upgrade

2.  Subsonic runs on Java. If you do not already have a Java Runtime Environment, install one:

        apt-get install openjdk-7-jre-headless

3.  Verify that Java is working by a performing a version check:

        java -version


## Install Subsonic

1.  The latest version of Subsonic (as of publication) is 6.1.2, and the most recent release can always be found on their [download](http://www.subsonic.org/pages/download.jsp) page. Download and install Subsonic onto your Linode:

        wget https://s3-eu-west-1.amazonaws.com/subsonic-public/download/subsonic-6.1.2.deb
        dpkg -i subsonic-6.1.2.deb

2.  Subsonic runs as the root user by default, which is insecure. Create a new system user for subsonic to run as:

        service subsonic stop
        useradd --system subsonic
        gpasswd --add subsonic audio

3. Open the configuration file `/etc/default/subsonic`:

    {{< file "/etc/default/subsonic" >}}
#
# This is the configuration file for the Subsonic service
# (/etc/init.d/subsonic)
#
# To change the startup parameters of Subsonic, modify
# the SUBSONIC_ARGS variable below.
#
# Type "subsonic --help" on the command line to read an
# explanation of the  different options.
#
# For example, to specify that Subsonic should use port 80 (for http)
# and 443 (for https), and use a Java memory heap size of 200 MB, use
# the following:
#
# SUBSONIC_ARGS="--port=80 --https-port=443 --max-memory=200"

SUBSONIC_ARGS="--max-memory=150"

# The user which should run the Subsonic process. Default "root".
# Note that non-root users are by default not allowed to use ports
# below 1024. Also make sure to grant the user write permissions in
# the music directories, otherwise changing album art and tags will fail.

SUBSONIC_USER=root

{{< /file >}}


    Here you can change the user, the port Subsonic listens on, increase the amount of memory it can use, and encrypt your streaming traffic with SSL. To use your own SSL certificate, look [here](http://www.subsonic.org/pages/getting-started.jsp#4). The following is an example of the server set up to use https on port 8080 with the default SSL certificate:

    {{< file-excerpt "/etc/default/subsonic" >}}
# Type "subsonic --help" on the command line to read an
# explanation of the different options.
#
# For example, to specify that Subsonic should use port 80 (for http)
# and 443 (for https), and use a Java memory heap size of 200 MB, use
# the following:
#
# SUBSONIC_ARGS="--port=80 --https-port=443 --max-memory=200"

SUBSONIC_ARGS="--https-port=8443 --max-memory=150"

SUBSONIC_USER=subsonic

{{< /file-excerpt >}}


    {{< note >}}
If you have a firewall set up on your Linode, be sure to edit the permissions to allow connections from the port Subsonic is listening on.
{{< /note >}}

3. Start Subsonic:

        service subsonic start

## Configuration and Use

1.  Make the directory `/var/music` and change it's ownership to the `subsonic` user. If you plan on storing media files elsewhere, adjust accordingly:

        mkdir /var/music
        chown subsonic:subsonic /var/music

2.  Open Subsonic in your broswer by navigating to the Linode's IP address or domain name. Be sure to append a colon and the port number after the address. If you've configured subsonic to use SSL, be sure to prepend `https` to the address.

    If you’re using Subsonic’s default SSL certificate, you’ll see a message like the following. You can safely "proceed anyway":

    ![Subsonic untrusted website](/docs/assets/untrusted-connection.png)

3.  The first time you access your Subsonic server in your browser, you will see the following:

    ![First time Subsonic access](/docs/assets/subsonic-firstlogin.png)

4.  As instructed, you can log in with admin/admin, or use the link to bring you to Subsonic, where you will be greeted with the *Getting started* screen:

    ![First time Subsonic access](/docs/assets/subsonic-gettingstarted.png)

5. Create a password for your admin account. You can also set up any other accounts at this time.

    {{< note >}}
Passwords in the Subsonic database are stored in hex format, but not encrypted.
{{< /note >}}

6.  Click on the **Media folders** link. Here you will need to point Subsonic to where you wish to store your music. If you decide to store your music files in `/var/music`, Subsonic's default directory, you can skip this step. Once you've pointed Subsonic to the correct directory and uploaded your music, you can press **Scan media folders now**. Subsonic will then create a database of music files.

    ![First time Subsonic access](/docs/assets/subsonic-foldersetup.png)

&nbsp;

[![The Subsonic Interface.](/docs/assets/subsonic-setup_small.png)](/docs/assets/subsonic-setup.png)

You have now installed and configured Subsonic! To learn more about the many ways to customize your Subsonic setup, check out their [website](http://subsonic.org/).



