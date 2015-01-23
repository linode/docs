---
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: Subsonic
keywords: 'subsonic, music, audio'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['communications/media-servers/shoutcast/']
modified: Friday, January 23th, 2015
modified_by:
  name: Linode
published: 'Friday, January 9, 2015'
title: Using Subsonic to Stream Music From Your Linode
---

One of the many things you can do with a Linode is create your own music server. By having your music "in the cloud" you don’t have to worry about syncing your music library between your various devices, and can have access to it wherever you have the Internet.

This guide explains how to set up [Subsonic](http://subsonic.org), an easy-to-use music streaming service with a user-friendly interface and the ability to share with multiple users, on a 1 GB Linode using Ubuntu 14.04.

##Preparing Your System

((On my example Linode, I’ve created a music folder in my home directory, and put one of my favorite albums in it.))

1.  Before you begin, create a music folder (Subsonic's default is in `/var/music`) and add your music to it:

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

2.  Subsonic runs on Java. If you don’t already have a Java Runtime Environment (JRE) installed the Oracle JRE is suggested. You will have to agree to Oracle’s EULA. The code snippet below can be run as-is, and will add a new repository to your Ubuntu system from which it can download the Oracle JRE:

        sudo apt-get install python-software-properties && sudo add-apt-repository ppa:webupd8team/java && sudo apt-get update && sudo apt-get install oracle-java7-installer

3.  Verify that Java is working by checking your version:

        java -version

    This should output your version information.


##Installing Subsonic

1.  The latest version of Subsonic as of this guide's publication is 5.1 and can always be found on their [download](http://www.subsonic.org/pages/download.jsp) page. The code below will download and install it onto your Linode:

        wget http://downloads.sourceforge.net/project/subsonic/subsonic/5.1/subsonic-5.1.deb
        sudo dpkg -i subsonic-5.1.deb

2.  By default, Subsonic listens on port 4040. To change this or any other options, look at it’s configuration file, located in `/etc/default/subsonic`:

        nano /etc/default/subsonic

    {: .file}
    /etc/default/subsonic
    :   ~~~
        # # This is the configuration file for the Subsonic service
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

    Here you can change change the port Subsonic listens on, increase the amount of memory it can use, and encrypt your streaming traffic with SSL. To use your own SSL certificate, look here. I’m going to set my server up to use https (with the default certificate) on port 8080:

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

Note that you can still use port 4040 when you first connect to the server, and it will redirect your browser or app. For these changes to take affect, restart the process:

    sudo service subsonic restart

If you’re using Subsonic’s default SSL certificate, you’ll see a message like this one the first time you browse to it. You can safely click ‘proceed anyway’, the the equivalent in your browser.

![Subsonic untrusted website](/docs/assets/subsonic-untrustedwebsite.png)

##Configuration and Use

1.  The first time you access your Subsonic server in your browser, you will see the following: 

    ![First time Subsonic access](/docs/assets/subsonic-firstlogin.png)

2.  As instructed, you can log in with admin/admin, or use the link to bring you to Subsonic, where you will be greeted with a *Getting Started* screen:

    ![First time Subsonic access](/docs/assets/subsonic-gettingstarted.png)

3. Create a password for your admin account. You can also set up any other accounts at this time, or wait to do that later. 

    {: .note}
    >
	>Passwords in the Subsonic database are stored in hex format, but not encrypted.

4.  Click on the **Media folders** link. Here you will need to point Subsonic to where you wish to store your music. If you decide to store your music files in /var/music, Subsonic's default directory, you can skip this step. Once Subsonic is looking in the right directories, you can press **Scan media folders now**. Subsonic will create a database of music files.

    ![First time Subsonic access](/docs/assets/subsonic-foldersetup.png)

Now you should be all set! To learn more about the many ways to customize your Subsonic setup, check out their website.



