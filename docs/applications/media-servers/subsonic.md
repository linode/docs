---
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: Subsonic
keywords: 'subsonic, music, audio'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['communications/media-servers/shoutcast/']
modified: Monday, January 26, 2015
modified_by:
  name: Elle Krout
published: 'Monday, January 26, 2015'
title: Using Subsonic to Stream Music From Your Linode
---

One of the many things you can do with a Linode is create your own music server. By having your music "in the cloud" you don’t have to worry about syncing your music library between your various devices, and can have access to it wherever you have the Internet.

This guide explains how to set up [Subsonic](http://subsonic.org) on a 1 GB Linode using Ubuntu 14.04 LTS. Subsonic is an easy-to-use music streaming service with a user-friendly interface, and the ability to share music with multiple users.

{: .note }
>The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the **sudo** prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

##Preparing Your System

1.  Before you begin, create a directory for your music (Subsonic's default is in `/var/music`), and upload your songs:

	{: .file}
	/var/music/
	:	~~~
	    alex@localhost:~$ ls -x music/Christopher_Colucci/Force_of_Circumstance,The/
	    01.Available_light.mp3            02.Sacred_games.mp3            03.Alone.mp3
	    04.The_Idea_of_Alone.mp3          05.Maggi`s_Cafe.mp3            06.Agnus.mp3
	    07.One_Night,_After_Dreaming.mp3  08.As_Deep_As_Your_Ocean.mp3   09.The_Last_Stand_Up.mp3
	    10.David`s_Third_Story.mp3        11.Spontaneous_Corruption.mp3  12.The_Force_of_Circumstance.mp3
	    13.Look_Back.mp3
	    ~~~

2.  Update your system:

        apt-get update && apt-get upgrade

2.  Install a Java Runtime Environment (JRE). Subsonic runs on Java. If you don’t already have a JRE installed, the Oracle JRE is suggested. You will have to agree to Oracle’s EULA:

        sudo apt-get install python-software-properties && sudo add-apt-repository ppa:webupd8team/java && sudo apt-get update && sudo apt-get install oracle-java7-installer

3.  Verify that Java is working by a performing a version check:

        java -version

    This should output your version information.


##Installing Subsonic

1.  The latest version of Subsonic is 5.1, and the most recent release can always be found on their [download](http://www.subsonic.org/pages/download.jsp) page. Download and install Subsonic onto your Linode:

        wget http://downloads.sourceforge.net/project/subsonic/subsonic/5.1/subsonic-5.1.deb
        sudo dpkg -i subsonic-5.1.deb

2.  By default, Subsonic listens on port 4040. To change this or any other options, look at it’s configuration file, located in `/etc/default/subsonic`:

        nano /etc/default/subsonic

    {: .note}
    >
    >If you have a firewall set up on your Linode, be sure to edit the permissions to allow connections from the port Subsonic is listening on.

    {: .file}
    /etc/default/subsonic
    :   ~~~
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
        ~~~

    Here you can change the port Subsonic listens on, increase the amount of memory it can use, and encrypt your streaming traffic with SSL. To use your own SSL certificate, look here. The following is an example of the server set up to use https on port 8080 with the default SSL certificate:

    {: .file-excerpt}
    /etc/default/subsonic
    :   ~~~
        # Type "subsonic --help" on the command line to read an
        # explanation of the different options.
        #
        # For example, to specify that Subsonic should use port 80 (for http)
        # and 443 (for https), and use a Java memory heap size of 200 MB, use
        # the following:
        #
        # SUBSONIC_ARGS="--port=80 --https-port=443 --max-memory=200"
        #SUBSONIC_ARGS="--max-memory=150"
        SUBSONIC_ARGS="--https-port=8443 --max-memory=150"
        ~~~

    Note that you can still use port 4040 when you first connect to the server, and it will redirect your browser or app.

3. Restart Subsonic:

        sudo service subsonic restart

##Configuration and Use

1.  Open Subsonic in your brower. If you’re using Subsonic’s default SSL certificate, you’ll see a message like the following. You can safely "procede anyway":

    ![Subsonic untrusted website](/docs/assets/subsonic-untrustedwebsite.png)

2.  The first time you access your Subsonic server in your browser, you will see the following: 

    ![First time Subsonic access](/docs/assets/subsonic-firstlogin.png)

3.  As instructed, you can log in with admin/admin, or use the link to bring you to Subsonic, where you will be greeted with the *Getting started* screen:

    ![First time Subsonic access](/docs/assets/subsonic-gettingstarted.png)

4. Create a password for your admin account. You can also set up any other accounts at this time. 

    {: .note}
    >
	>Passwords in the Subsonic database are stored in hex format, but not encrypted.

5.  Click on the **Media folders** link. Here you will need to point Subsonic to where you wish to store your music. If you decide to store your music files in `/var/music`, Subsonic's default directory, you can skip this step. Once Subsonic is looking in the right directories, you can press **Scan media folders now**. Subsonic will create a database of music files.

    ![First time Subsonic access](/docs/assets/subsonic-foldersetup.png)

You have now installed and configured Subsonic! To learn more about the many ways to customize your Subsonic setup, check out their [website](http://subsonic.org/).



