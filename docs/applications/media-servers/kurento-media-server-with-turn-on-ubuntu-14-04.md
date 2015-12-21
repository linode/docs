---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Installing Kurento Media Server with TURN server on Ubuntu 14.04'
keywords: 'webrtc,kurento,turn'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: 'Wednesday, December 21st, 2015'
modified_by:
  name: Sergey Pariev
published: 'Wednesday, November 25th, 2015'
title: 'Installing Kurento Media Server on Ubuntu 14.04'
contributor:
  name: Sergey Pariev
  link: https://twitter.com/spariev
external_resources:
  - '[Installing Kurento](https://www.kurento.org/docs/current/installation_guide.html)'
  - '[Configure Kurento to work with TURN server](https://www.kurento.org/docs/current/faq.html)'
  - '[Using reTurn Server](http://www.resiprocate.org/Using_reTurn_Server)'
  - '[Hello World Kurento tutorial](https://www.kurento.org/docs/current/tutorials/js/tutorial-1-helloworld.html)'
---

[Kurento](https://www.kurento.org/) is a *WebRTC* media server and a set of client APIs for the development of advanced video applications. Kurento features include group communications, transcoding, recording, mixing, broadcasting and routing of audiovisual flows. Kurento also provides advanced media processing capabilities involving computer vision, video indexing, augmented reality and speech analysis.

This article will guide you through the installation and basic setup of Kurento Media Server on Ubuntu 14.04 LTS. You will also setup reTurn server to improve connectivity for clients behind NAT and firewalls.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system.

		sudo apt-get update && sudo apt-get upgrade

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Install Kurento Media Server

1.  Add kurento package source and package GPG key:

		echo "deb http://ubuntu.kurento.org trusty kms6" | sudo tee /etc/apt/sources.list.d/kurento.list
		wget -O - http://ubuntu.kurento.org/kurento.gpg.key | sudo apt-key add -

2.  Install the packages required for Kurento Media Server:

        sudo apt-get update
		sudo apt-get install kurento-media-server-6.0

3.  Start `kurento-media-server-6.0` service by running

		sudo service kurento-media-server-6.0 start

## Run Sample Application to Test Kurento Media Server

To test Kurento Media Server, you can use tutorial apps provided with the project. The simplest one is the WebRTC video loopback sample - browser app, which takes a local video stream from the webcam and displays the remote stream sent by the media server back to the client.

1.  To run tutorial app you will need to install Node.js and Bower, so run the following commands:

		curl -sL https://deb.nodesource.com/setup | sudo bash -
		sudo apt-get install -y nodejs npm
		sudo npm install -g bower

2.  Install Node.js HTTP server to serve the tutorial application

		sudo npm install http-server -g

3.  You will also need to check out the tutorial application source code from GitHub. To do this, run the following -

		sudo apt-get install -y git
		git clone https://github.com/Kurento/kurento-tutorial-js.git
		cd kurento-tutorial-js/kurento-hello-world
		git checkout 6.1.0

4.  Install application dependencies and start the application:

		bower install
		http-server

	{: .note}
	>
	> If you get `/usr/bin/env: node: No such file or directory` error while executing `bower install`, symlink `/usr/bin/nodejs` to `/usr/bin/node` with command `sudo ln -s /usr/bin/nodejs /usr/bin/node`

5.  Now visit http://&lt;your-linode-public-ip&gt;:8080/ URL in WebRTC enabled browser such as Chrome or Firefox and you will see the tutorial application UI.

	[![Kurento tutorial application UI](/docs/assets/kurento-tutorial-app-small.png)](/docs/assets/kurento-tutorial-app.png)

6.  Click `Play` button. You will see two video streams: local stream from the webcam and the remote stream sent back by the media server without any modifications.

7.  Switch back to console and stop the tutorial app with **Ctrl-C**.

## Install and Configure reTurn Server

1.  Install system package for the *reTurn* server -

		sudo apt-get install -y resiprocate-turn-server

	reTurn Server is an open source implementation of Traversal Using Relays around NAT (TURN) RFC 5766 protocol. TURN protocol provides a standardised solution for VoIP/WebRTC applications to find the most efficient way to route media streams when NAT and firewall devices may be present.

2.  Edit config file `etc/reTurn/reTurnServer.config` using `sudo`. Find the `TurnAddress` configuration option and change it from `0.0.0.0` to your Linode public IP:

{: .file-excerpt}
etc/reTurn/reTurnServer.config
:   ~~~ conf
	TurnAddress = your.linode.public.ip
	~~~

3.  Now you need to add user credentials, login and password, into configuration file `/etc/reTurn/users.txt`. Since passwords must be hashed, first run the following command, substituting `webrtcuser` and `webrtcpass` with username and password you prefer:

		echo -n webrtcuser:reTurn:webrtcpass | md5sum

4.  Edit file `/etc/reTurn/users.txt` using `sudo` and add line `webrtcuser:<md5_hash>:reTurn:authorized` to the end of the file, substituting `webrtcuser` and `<md5_hash>` with username you've chosen and md5 hash you've got as the result of the previous command.

{: .file-excerpt}
/etc/reTurn/users.txt
:   ~~~ conf
	webrtcuser:<md5_hash>:reTurn:authorized
	~~~

5.  Restart reTurn server with

		sudo service resiprocate-turn-server restart

## Configure Kurento Media Server to Use TURN

1.  Edit file `/etc/kurento/modules/kurento/WebRtcEndpoint.conf.ini` and set `turnURL` property to `webrtcuser:webrtcpass@<your-linode-public-ip>:3478` (again, substitute `webrtcuser`/`webrtcpass` with login/password you've chosen) -

{: .file-excerpt}
/etc/kurento/modules/kurento/WebRtcEndpoint.conf.ini
:   ~~~ ini
	turnURL=webrtcuser:webrtcpass@<your-linode-public-ip>:3478
	~~~

2.  Restart Kurento Media Server service -

		sudo service kurento-media-server-6.0 restart

	{: .note}
	>
	>Make sure that the following ports are open on your Linode:
	> *   3478 TCP & UDP
	> *   49152 - 65535 UDP: As per RFC 5766, these are the ports that the TURN server will use to exchange media.

## Run Sample App Using TURN

1.  Switch to the tutorial app directory and start it again with `http-server`:

		cd ~/kurento-tutorial-js/kurento-hello-world && http-server

2.  This time, an additional parameter `ice_servers` should be supplied in the URL, so visit `http://<your-linode-public-ip>:8080/index.html?ice_servers=[{"urls":"turn:<your-linode-public-ip>","username":"webrtcuser","credential":"webrtcpass"}]` in the WebRTC enabled browser of your choice. Again,do not forget to substitute `webrtcuser`/`webrtcpass` in URL with login/password you've chosen.

3.  Tutorial application UI should load and everything should work like the first time, but now using TURN server to establish the connection. You should see line starting with `Use ICE servers` in beginning of output in web app console under the video streams, as shown in the picture below.

	![Use ICE servers log](/docs/assets/kurento-console.png)
