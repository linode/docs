
---
author:
  name: The Linux Gamer
description: 'Jellyfin is a Free Software Media System that puts you in control of managing and streaming your media, this guide walks you through installing it on a Linode'
keywords: ["Jellyfin", "Media Server", "PLEX"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-08-07
modified_by:
  name: Linode
published: 2019-08-07
title: How to Install Jellyfin on Linux
---
Jellyfin is an open source media library management and streaming platform. This document will guide you through the process of installing and configuring **Jellyfin** on your Linode running Ubuntu 18.04. Media management generally use a large amount of disk space, an economical option for that is to use [Block Storage](https://www.linode.com/docs/platform/how-to-use-block-storage-with-your-linode) to store your media.

> **Note** This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](https://www.linode.com/docs/tools-reference/linux-users-and-groups/) guide.

## Before you Begin

1. If you have not set up your Linode yet, check out our [Getting Started](https://www.linode.com/docs/getting-started/) guide and complete the steps for setting your Linode’s hostname and timezone.

2. Follow that up with our [Securing Your Server](https://www.linode.com/docs/security/securing-your-server/) guide to create a standard user account with `sudo` privileges.

3. Run the following command to upgrade your packages:

```
sudo apt-get update && sudo apt-get upgrade
```

## Install Jellyfin

1. First, you'll want to enable HTTPS transport for APT if you haven't:

```
sudo apt install apt-transport-https
```

2. Next, enable the Universe repository for all the `ffmpeg` dependencies:

```
sudo add-apt-repository universe
```

3. You'll now want to import the GPG signing keys from the Jellyfin team:

```
wget -O - https://repo.jellyfin.org/ubuntu/jellyfin_team.gpg.key | sudo apt-key add -
```

4. Create a new file located at `/etc/apt/sources.list.d/jellyfin.list`

5. Follow that up with this command to add a the Jellyfin `apt` repo to your Linode.

```
echo "deb [arch=$( dpkg --print-architecture )] https://repo.jellyfin.org/ubuntu $( lsb_release -c -s ) main" | sudo tee /etc/apt/sources.list.d/jellyfin.list
```

> Current supported releases are `xenial`, `bionic`, `cosmic`, and `disco`. Since we're using Ubuntu 18.04, you'll want to use `bionic`.

6. Now you'll want to update your packages and install Jellyfin

```
sudo apt update && sudo apt install jellyfin
```

## Configure Jellyfin

Okay, Jellyfin's set up! Now we need to configure it and point it to our media.

### Initial Setup

1. Setting up Jellyfin is done through the web interface. Before you can access the web interface, you'll want to create a tunnel via SSH to your Linode.

```
ssh user@192.0.2.1 -L 8888:localhost:32400
```

> Substitute `user` with the `sudo user` on your Linode, and `192.0.2.1` with your Linode's IP address.

2. Open your browser and navigate to `http://localhost:8888/`. You should now see the Jellyfin first-time configuration screen. Start by selecting your preferred language!

![Language Setup](https://heavyelement.io/localcontent/01-language.png)

3. Create your user account:

![Account Creation](https://heavyelement.io/localcontent/02-account-creation.png)

4. Now you'll create the directories to store your media. You'll do this on your Linode. Let's say we wanted to have music and movies on our server. We would create them like so:

```
cd ~/
mkdir -p jellyfin-media/music && mkdir jellyfin-media/movies
```

### Add and Organize Media

1. Now you'll want to add your media. Content in Jellyfin is organized into Libraries:

![Library Setup](https://heavyelement.io/localcontent/03-library-setup.png)

> Each kind content type provides different options for you to set such as where you would like your metadata retrieved from, etc.

2. Libraries can have multiple directories from which they aggregate their media. You can specify directories using the Folders (+) button.

![Choose the "Folders" button](https://heavyelement.io/localcontent/04-library-setup.png)

3. Find your way to the media directory we created earlier, (`/home/username/jellyfin-media/movies`) then hit "Ok."

!\[https://heavyelement.io/localcontent/05-library-setup.png\](Hit the Ok button)

4. You can add as many libraries as you'd like. Alternatively, you can and more later on through the "Dashboard" under "Libraries":

![Library Dashboard](https://heavyelement.io/localcontent/10-library-dashboard.png)

5. Disable port mapping

![Library Dashboard](https://heavyelement.io/localcontent/07-disable-port-mapping.png)

6. Finally, you'll want to add your media files to the appropriate directories.

### Disable Unneeded Features (Recommended)

[DLNA](https://en.wikipedia.org/wiki/Digital_Living_Network_Alliance) is a protocol that incorporates [Universal Plug and Play](https://en.wikipedia.org/wiki/Universal_Plug_and_Play) (or UPnP) standards for digital media sharing across devices. If you do not wish to make use of it, it’s recommended that you disable this feature, as it is openly connectable on port `1900`. Click the "hamburger" menu in the top left corner of Jellyfin, choose "Dashboard," and on the left side of the screen choose "DLNA," then disable and save the DLNA options.

![Disable DLNA](https://heavyelement.io/localcontent/08-disable-dlna.png)

## Connect to your Jellyfin Server

Jellyfin primarily works as a web frontend for your media. That means you'll want to proxy the default Jellyfin websocket to requests.

The following Apache virtual host configuration file will help you get set up. Replace `jellyfin.example.com` with your domain/subdomain.

```
<VirtualHost *:80>
        ServerName jellyfin.example.com
        
                ErrorLog /var/log/apache2/jellyfin-error.log
                        CustomLog /var/log/apache2/jellyfin-access.log combined
                        
                                ProxyPreserveHost On
                                
                                        ProxyPass "/embywebsocket" "ws://127.0.0.1:8096/embywebsocket"
                                                ProxyPassReverse "/embywebsocket" "ws://127.0.0.1:8096/embywebsocket"
                                                
                                                        ProxyPass "/" "http://127.0.0.1:8096/"
                                                                ProxyPassReverse "/" "http://127.0.0.1:8096/"
                                                                
                                                                </VirtualHost>
                                                                ```
                                                                
                                                                You'll probably also want to [set up SSL encryption for this virtual host](https://www.linode.com/docs/quick-answers/websites/secure-http-traffic-certbot/).~
