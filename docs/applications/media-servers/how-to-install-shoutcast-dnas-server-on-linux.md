---
author:
  name: Chris Ciufo
  email: docs@linode.com
description: 'This tutorial will guide you through setup and configuration of a SHOUTcast DNAS server for media streaming on Linux.'
keywords: ["shoutcast", " internet radio", " streaming media", " streaming audio"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['communications/media-servers/shoutcast/','applications/media-servers/shoutcast/']
modified: 2017-06-21
modified_by:
  name: Linode
published: 2012-06-07
title: How to Install A SHOUTcast DNAS Server on Linux
external_resources:
 - '[SHOUTcast Home Page](http://www.shoutcast.com)'
 - '[SHOUTcast Getting Started Guide](http://wiki.winamp.com/wiki/SHOUTcast_Getting_Started_Guide)'
 - '[SHOUTcast Broadcast Tools](http://www.shoutcast.com/broadcast-tools)'
 - '[SHOUTcast Transcoder MP3 Licensing](http://wiki.winamp.com/wiki/SHOUTcast_DNAS_Transcoder_2#Registering_for_MP3_Stream_Encoding)'
---

SHOUTcast is software designed for streaming media over the internet. The SHOUTcast system uses a classic client-server configuration. You can install SHOUTcast on your server and use it to broadcast a stream of music to clients connected to the server. A Shoutcast media server could benefit from large amounts of disk space, so consider using our [Block Storage](/docs/platform/how-to-use-block-storage-with-your-linode) service with this setup.

 {{< note >}}
Be sure to [check the broadcast tools download page](http://www.shoutcast.com/broadcast-tools) for the newest version of SHOUTcast.
{{< /note >}}

## SHOUTcast DNAS Software

The SHOUTcast DNAS (Distributed Network Audio Server) software is the server version of the software that allows you to broadcast to listeners. To use SHOUTcast, you'll need to download and install SHOUTcast DNAS on your Linode.

### Download and Install SHOUTcast

There are several versions of this software, so make sure you are downloading the correct one. The Linux version is offered in both 32-bit and 64-bit versions. You'll need to [download](http://www.shoutcast.com/broadcast-tools) whichever version corresponds to the operating system you have installed on your Linode.

1.  Create a user for running SHOUTcast, so you are not running it as root. Enter the following command:

        adduser shoutcast

2.  Change to the new user's home directory by entering the following command:

        cd /home/shoutcast

3.  Create a directory for SHOUTcast:

        mkdir sc

4.  Now we can download the DNAS package. In this example, we will download the 32-bit version:

        wget http://download.nullsoft.com/shoutcast/tools/sc_serv2_linux_07_31_2011.tar.gz

5.  Extract the SHOUTcast files to the new directory by entering the following command:

        tar -xzf sc_serv2_linux_07_31_2011.tar.gz -C sc

6.  Change the ownership from `root` to the SHOUTcast user:

        chown -R shoutcast.shoutcast /home/shoutcast/sc

The SHOUTcast DNAS software is now installed on your Linode.

### Configure SHOUTcast

Now, you'll want to modify the configuration. This is necessary to specify passwords and set the SHOUTcast port. Here's how to configure SHOUTcast:

1.  Open the SHOUTcast configuration file:

        nano sc/sc_serv_basic.conf

2.  This will bring up the configuration file for editing, as shown below.

    {{< file "/home/shoutcast/sc/sc_serv_basic.conf" >}}
; NOTE: for any relative paths specified are relative to
; sc_serv and not to where the conf file is being stored

; here we will setup where the log and other related files
; will be stored. make sure that these folders exist else
; sc_serv will throw an error and will close itself down.
; we will make the logs save to the sc_serv2 directory
logfile=logs/sc_serv.log
w3clog=logs/sc_w3c.log
banfile=control/sc_serv.ban
ripfile=control/sc_serv.rip


; for testing we will make the server only work locally
; (i.e. localhost / 127.0.0.1) though if this is left out
; or set to publicserver=always then we attempt to make a
; connection to the YP for listing - do not forget to add
; in a 'streamauthhash' value for any public streams made
;publicserver=never


; if you're wanting to use a different port to use for any
; connections then you can use this option e.g. to use 80
; otherwise port 8000 is used as the default to listen on.
;portbase=80


; password used by sc_trans or the Winamp dsp plug-in
; NOTE: remember to change this to something else
password=testing


; password used for accessing the administation pages
; NOTE: remember to change this to something else
adminpassword=changeme


; now we will specify the details of the stream we're going
; to serve which can be done as follows
streamid=1
streampath=/test.aac

; or

; it can be done like this which is how it needs to be done
; if you are going to provide multiple streams from sc_serv
;streamid_1=1
;streampath_1=/test.aac
;streamid_2=2
;streampath_2=/test2.aac

{{< /file >}}


3.  Set the `password` and `adminpassword` variables to whatever you want them to be.
4.  The `portbase` variable should be set to use a port you are not using for anything else. The default port for SHOUTcast is 8000.

    {{< note >}}
If you set the `portbase` variable to anything besides 8000, be sure to uncomment it by deleting the semicolon in front of the variable.
{{< /note >}}

5.  Save the changes to the SHOUTcast configuration file by pressing Control-X, and then Y.

Now that the configuration is set and saved, we can start the server.

### Start SHOUTcast

Now, you can start the SHOUTcast server. Here's how:

1.  You'll want to run your shoutcast in a [screen session](/docs/linux-tools/utilities/screen). Let's jump into a screen session by entering the following command:

        screen

2.  Start the SHOUTcast server by entering the following command:

        ./sc_serv sc_serv_simple.conf

3.  After you issue the start command, you should see the startup output ending with:

        2011-11-02 14:50:03     I       msg:[MICROSERVER] Listening for connection on port 8000
        2011-11-02 14:50:03     I       msg:[MICROSERVER] Listening for connection on port 8001

4.  You can detach from your screen session at this point. To do so, hold down the Control key and press A, let go, and then press D.
5.  You should be back at the command prompt outside of your screen session. If you need to reattach later on, simply type:

        screen -raAd

Your SHOUTcast server is now running! You can now connect to it and begin your broadcast.

## SHOUTcast Transcoder

The SHOUTcast Transcoder allows you to schedule DJ play times, broadcast an automatic playlist in a specific time slot, schedule time slots for relayed broadcasts, etc.

 {{< note >}}
To encode your streams in MP3 format, you *must* [purchase a license key from WinAmp, which costs \$5 USD](http://wiki.winamp.com/wiki/SHOUTcast_DNAS_Transcoder_2#Registering_for_MP3_Stream_Encoding).
{{< /note >}}

### Download and Install SHOUTcast Transcoder

We'll use the same shoutcast user to set up the Transcoder software. Here's how to download and install the transcoder:

1.  Change directories by entering the following command:

        cd /home/shoutcast

2.  Create a new directory for the transcoder by entering the following command:

        mkdir sct

3.  Download the SHOUTcast transcoder archive by entering the following command:

        wget http://download.nullsoft.com/shoutcast/tools/sc_trans_linux_10_07_2011.tar.gz

4.  Extract the SHOUTcast transcoder files by entering the following command:

        tar -xzf sc_trans_linux_10_07_2011.tar.gz -C sct

5.  Change ownership from `root` to the SHOUTcast user:

        chown -R shoutcast.shoutcast /home/shoutcast/sct

6.  Change directories by entering the following command:

        cd sct

7.  Change permissions by entering the following command:

        chmod a+x sc_trans

The SHOUTcast transcoder is now installed on your Linode.

### Configure the SHOUTcast Transcoder

This example will walk you through a basic configuration.

1.  Open the configuration file by entering the following command:

        nano /home/shoutcast/sct/sc_trans_basic.conf

2.  You can modify the bitrate to change the sound quality of the music and limit the amount of bandwidth consumed. If you purchase MP3 licensing, you can modify the encoder section to add the MP3 encoding and your unlock data:

    {{< file-excerpt "/home/shoutcast/sct/sc_trans_basic.conf" >}}
; for testing we will only setup a single encoder though it
; is easy to add in additional encoder configurations and
; we are using an aac plus encoder as the default due to
; the licensing requirements for mp3 encoding as detailed
; in sc_trans.txt - section 2.5).
encoder_1=aacp
encoder_2=mp3
bitrate_1=56000
bitrate_2=56000

unlockkeyname=YourUnlockName
unlockkeycode=YourUnlockCode

{{< /file-excerpt >}}


3.  Next, modify the sc\_trans to sc\_serv connection details:

    {{< file-excerpt "/home/shoutcast/sct/sc\\_trans\\_basic.conf" >}}
; this is where we define the details required for sc_trans
; to connect to the sc_serv instance being used where the
; details must match those specified in sc_serv_basic.conf
outprotocol_1=3
serverip_1=127.0.0.1
; default is 8000, if not change to sc_serv's 'portbase'
serverport_1=8000
; this is the same as 'password' in sc_serv_basic.conf
password_1=testing
; this is the same as 'streamid' in sc_serv_basic.conf for
; the stream we are acting as the source for
streamid_1=1
; this is a name for the source we're creating and is used
; with the AJAX control api or can be left blank to get a
; generic name created in the form of 'endpointX' where 'X'
; is the index of the created source from sc_trans lists.
endpointname_1=/Bob

{{< /file-excerpt >}}


4.  This step is optional, but you can also update your stream information:

    {{< file-excerpt "/home/shoutcast/sct/sc\\_trans\\_basic.conf" >}}
; here you would provide any information to fill in details
; provided to clients about the stream. it us up to you what
; is entered though do not do anything which will annoy, etc
streamtitle=My Test Server
streamurl=http://www.shoutcast.com
genre=Misc

{{< /file-excerpt >}}


5.  Set your playlist file for an automated stream:

    {{< file-excerpt "/home/shoutcast/sct/sc\\_trans\\_basic.conf" >}}
; here we specify a playlist to use as the master list from
; which to play files from.
playlistfile=playlists/main.lst

{{< /file-excerpt >}}


6.  Now set the port, username, and password for the transcoder admin panel access:

    {{< file-excerpt "/home/shoutcast/sct/sc\\_trans\\_basic.conf" >}}
; these options will allow you access the admin interfaces
; of sc_trans though also allows the 'testui' example to be
; accessed. remember to change the password, etc as needed
adminport=7999
adminuser=admin
adminpassword=goaway

{{< /file-excerpt >}}


7.  Save the changes to the SHOUTcast configuration file by pressing Control-X, and then Y.
8.  If you are using an automated playlist, upload your music files to the `/home/shoutcast/sct/music` directory.
9.  If you are using an automated playlist, you'll also need to create a playlist file. Here is an example:

    {{< file "/home/shoutcast/sct/playlists/playlist.lst" >}}
# This example playlist is used as the main playlist sc_trans will use to pick
# out the files it will use to create its output for the source we generate.
#
# Also remember to use the correct path format for the OS you are using and to
# ensure that the files you want to play are present in the location you choose
# e.g.
../music/shoutcast.mp3
#
# In this example we will just assume that all of the files associated to the
# playlist are in one folder and all have an mp3 extension though there is no
# reason why you cannot explicitly specify files to use or to reference a tool.
# See sc_trans.txt - section 7.1 for more information on how playlists work.

# Remember to change this to reference the files you want to use when trying
# the sc_trans_playlist.conf example which is best tried with full length files

{{< /file >}}


### Start SHOUTcast Transcoder

Once you have the transcoder configured and ready to go, you need to start it. To run the transcoder as a daemon, simply run this command, substituting `sc_trans_basic.conf` for whatever configuration file you are using:

    ./sc_trans daemon ./sc_trans_basic.conf

If no errors appear, you should see output similar to the line below, where XXXX is the PID:

    sc_trans going daemon with PID [XXXX]

To shut down the transcoder, you'll just need to issue a kill command:

    kill -15 PID

## SHOUTcast Source DSP

SHOUTcast's Source DSP plugin was developed for use with WinAmp version 5.5 and newer. This plugin gives you the ability to use WinAmp as a source for your sc\_serv (DNAS) or sc\_trans (Transcoder). It will also allow you to capture an audio input from your sound card and its line-in or microphone inputs. You will need a working installation of either the DNAS by itself, or the Transcoder feeding into a DNAS installation, before you can use the DSP WinAmp plugin. The download for the DSP plugin is near the bottom of the [broadcast tools page](http://www.shoutcast.com/broadcast-tools).

Instructions for installation and configuration are located in the [WinAmp wiki](http://wiki.winamp.com/wiki/Source_DSP_Plug-in#Installing_the_Plug-in).
