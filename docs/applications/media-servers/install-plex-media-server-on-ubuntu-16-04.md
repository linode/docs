---
author:
  name: Nick Brewer
  email: nbrewer@linode.com
description: View and organize your media library with Plex on Ubuntu 16.04
keywords: ["plex media server", " install plex", " plex ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-06-21
modified_by:
  name: Nick Brewer
published: 2017-05-03
title: Install Plex Media Server on Ubuntu 16.04
external_resources:
- '[Plex Media Server Documentation](https://support.plex.tv/hc/en-us/categories/200007567-Plex-Media-Server)'
---

[Plex](https://www.plex.tv/) is a feature-rich media library platform that allows you to organize and stream your digital video and audio from virtually anywhere. This guide will show you how to set up the **Plex Media Server** on your Linode running Ubuntu 16.04 LTS, as well as how to connect to your media server from a Plex [client](https://support.plex.tv/hc/en-us/categories/200006953-Plex-Apps) application. A Plex media server could benefit from large amounts of disk space, so consider using our [Block Storage](/docs/platform/how-to-use-block-storage-with-your-linode) service with this setup.

![Install Plex Media Server on Ubuntu 16.04](/docs/assets/install-plex-media-server-on-ubuntu-16-04.png)

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before you Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account with `sudo` privileges.

3.  Ensure that your system is up to date:

        sudo apt-get update && sudo apt-get upgrade

4.  Plex requires that you create an [account](https://www.plex.tv/features/) to make use of the service, and provides additional features such as DVR capability and offline viewing if you pay for their premium [Plex Pass](https://www.plex.tv/features/plex-pass/) offering. To complete this guide, you will need a Plex account.

## Install Plex

1.  Head to the Plex [Downloads](https://www.plex.tv/downloads/) page and copy the installation link for Ubuntu. Use `wget` to download the installer via the copied link:

        wget https://downloads.plex.tv/plex-media-server/1.5.5.3634-995f1dead/plexmediaserver_1.5.5.3634-995f1dead_amd64.deb

    This example uses the current link for Ubuntu, at the time of writing. Be sure to use the up-to-date version supplied on the Plex website.

2.  Use `dpkg` to install the Plex server:

        sudo dpkg -i plexmediaserver*.deb

3.  Enable Plex Media Server to start on reboot, and then start the server:

        sudo systemctl enable plexmediaserver.service
        sudo systemctl start plexmediaserver.service


## Configure Plex

This section will show you how to complete your server setup and start adding media libraries.

### Initial Setup

1.  Administration of the Plex server is performed via its web interface. Before you can connect to the web interface from your workstation, you will first need to create an SSH tunnel to your Linode. Substitute `user` with the `sudo` user on your Linode, and `192.0.2.1` with the IP address of the Plex server:

        ssh user@192.0.2.1 -L 8888:localhost:32400

2.  Enter `http://localhost:8888/web` into your browser to view the Plex web interface, as shown below. Input your Plex account username and password to proceed with the setup process:

    [![Plex web interface.](/docs/assets/plex-browser-view-small.png)](/docs/assets/plex-browser-view.png)

3.  Give your Plex server a name. Be sure to leave the **Allow me to access my media outside my home** box checked, and click **Next**:

    [![Plex web interface - Server Name.](/docs/assets/plex-server-name-small.png)](/docs/assets/plex-server-name.png)

4.  Finally, you'll create the directories that will store your Plex media. In this example we'll create library directories for `movies` and `television` within a `plex-media` directory. These will be located within your user's `/home`:

        cd ~/
        mkdir -p plex-media/movies && mkdir plex-media/television

### Add and Organize Media

1.  Now that you've signed into Plex, you should see the following page. Click the **Add Library** button to start setting up your media libraries:

    [![Plex web interface - Add Library](/docs/assets/plex-add-library-small.png)](/docs/assets/plex-add-library.png)

2.  Select your library type, and click **Next**:

    [![Plex web interface - Library type](/docs/assets/plex-library-type-small.png)](/docs/assets/plex-library-type.png)

3.  Navigate to the corresponding media directory that you created previously, then click **Add**:

    [![Plex web interface - Library location](/docs/assets/plex-library-location-small.png)](/docs/assets/plex-library-location.png)

4.  You can add additional libraries by clicking the **+** symbol next to the **Libraries** list on the Plex side bar:

    ![Plex web interface - additional Library](/docs/assets/plex-additional-library.png)

5.  Add your media to the appropriate directories. Be sure to review Plex's [naming conventions](https://support.plex.tv/hc/en-us/categories/200028098-Media-Preparation) for media files, to ensure that your files are identified correctly.

### Disable DLNA (Recommended)

[DLNA](https://en.wikipedia.org/wiki/Digital_Living_Network_Alliance) is a protocol that incorporates [Universal Plug and Play](https://en.wikipedia.org/wiki/Universal_Plug_and_Play) (or UPnP) standards for digital media sharing across devices. If you do not wish to make use of it, it's recommended that you disable this feature, as it is openly connectable on port `1900`. From the Plex web interface, click the wrench icon in the upper right corner, select **Server**, and navigate to the **DLNA** section. Uncheck **Enable the DLNA server**, and click **Save Changes**:

[![Plex media client](/docs/assets/plex-dlna-disable-small.png)](/docs/assets/plex-dlna-disable.png)

## Connect to your Plex Server

Now that your server is set up, you're ready to connect to it from your Plex client application. Plex is supported by a number of different platforms, and you can find a full list of client applications [here](https://support.plex.tv/hc/en-us/categories/200006953-Plex-Apps).

The examples provided here will use **Plex Media Player** for MacOS.

1.  [Download](https://www.plex.tv/downloads/) the appropriate media player application, or install it via your device's application store.

2.  Sign in to the Plex client application using the same Plex account as your server.

3.  Your Plex client will have a drop down menu where you can select your server. Once it's selected, you can navigate to the library with the content that you wish to view:

    [![Plex media client](/docs/assets/plex-media-client-small.png)](/docs/assets/plex-media-client.png)
