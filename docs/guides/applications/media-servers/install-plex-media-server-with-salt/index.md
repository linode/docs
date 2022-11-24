---
slug: install-plex-media-server-with-salt
author:
  name: Linode
  email: docs@linode.com
description: 'This guide shows you how to install Plex Media Server, an application that organizes and can stream your photos, videos, music, and more, using Salt.'
keywords: ['plex','media','server','ubuntu 18.04','ubuntu','salt','saltstack']
tags: ["ubuntu", "salt"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-01-31
modified: 2019-01-02
modified_by:
  name: Linode
title: "How to Install Plex Media Server on Ubuntu 18.04 Using Salt"
h1_title: "Installing Plex Media Server on Ubuntu 18.04 Using Salt Masterless"
enable_h1: true
contributor:
  name: Linode
external_resources:
  - '[Salt Masterless Walkthough](https://docs.saltstack.com/en/latest/topics/tutorials/quickstart.html)'
  - '[Salt Fileserver Backend Walthrough](https://docs.saltstack.com/en/latest/topics/tutorials/gitfs.html)'
  - '[Plex Media Server Quick State](https://support.plex.tv/articles/200264746-quick-start-step-by-step-guides/)'
dedicated_cpu_link: true
aliases: ['/applications/media-servers/install-plex-media-server-with-salt/']
---

Plex is a media server that allows you to stream video and audio content that you own to many different types of devices. In this guide you will learn how to use a masterless Salt minion to set up a Plex server, attach and use a Block Storage Volume, and how to connect to your media server to stream content to your devices.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/guides/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1. Follow the steps in the [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide.

1.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

2. You will need to create a Block Storage Volume and attach it to your Linode. You will format and mount the drive as part of this guide. This volume will be used to store your media, so you should pick a size that's appropriate for your media collection, though you can resize the volume later if you need more storage. For more on Block Storage, see our [Block Storage Overview](/docs/products/storage/block-storage/) guide.

3.  Plex requires an account to use their service. Visit the [Plex website](https://www.plex.tv/) to sign up for an account if you do not already have one.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Prepare the Salt Minion

1.  On your Linode, create the `/srv/salt` and `/srv/pillar` directories. These are where the Salt state files and Pillar files will be housed.

        mkdir /srv/salt && mkdir /srv/pillar

1.  Install `salt-minion` via the Salt bootstrap script:

        curl -L https://bootstrap.saltstack.com -o bootstrap_salt.sh
        sudo sh bootstrap_salt.sh

1. The Salt minion will use the official [Plex Salt Formula](https://github.com/saltstack-formulas/plex-formula), which is hosted on the SaltStack GitHub repository. In order to use a Salt formula hosted on an external repository, you will need GitPython installed. Install GitPython:

        sudo apt-get install python-git

## Modify the Salt Minion Configuration

1.  Because the Salt minion is running in masterless mode, you will need to modify the minion configuration file (`/etc/salt/minion`) to instruct Salt to look for state files locally. Open the minion configuration file in a text editor, uncomment the line `#file_client: remote`, and set it to `local`:

    {{< file "/etc/salt/minion" yaml >}}
...

# Set the file client. The client defaults to looking on the master server for
# files, but can be directed to look at the local file directory setting
# defined below by setting it to "local". Setting a local file_client runs the
# minion in masterless mode.
file_client: local

...
{{< /file >}}

1.  There are some configuration values that do not normally exist in `/etc/salt/minion` which you will need to add in order to run your minion in masterless mode. Copy the following lines into the end of `/etc/salt/minion`:

    {{< file "/etc/salt/minion" yaml >}}
...

fileserver_backend:
  - roots
  - gitfs

gitfs_remotes:
  - https://github.com/saltstack-formulas/plex-formula.git

gitfs_provider: gitpython
{{< /file >}}

    The `fileserver_backend` block instructs the Salt minion to look for Salt configuration files in two places. First, it tells Salt to look for Salt state files in our minion's `roots` backend (`/srv/salt`). Secondly, it instructs Salt to use the Git Fileserver (gitfs) to look for Salt configuration files in any Git remote repositories that have been named in the `gitfs_remotes` section. The address for the Plex Salt formula's Git repository is included in the `gitfs_remotes` section.

    {{< note >}}
It is best practice to create a fork of the Plex formula's Git repository on GitHub and to add your fork's Git repository address in the `gitfs_remotes` section. This will ensure that any further changes to the upstream Plex formula which might break your current configuration can be reviewed and handled accordingly, before applying them.
{{< /note >}}

    Lastly, GitPython is specified as the `gitfs_provider`.

## Create the Salt State Tree

1.  Create a Salt state top file at `/srv/salt/top.sls` and copy in the following configuration. This file tells Salt to look for state files in the plex folder of the Plex formula's Git repository, and for a state files named `disk.sls` and `directory.sls`, which you will create in the next steps.

    {{< file "/srv/salt/top.sls" yaml >}}
base:
  '*':
    - plex
    - disk
    - directory
{{< /file >}}


1.  Create the `disk.sls` file in `/srv/salt`:

    {{< file "/srv/salt/disk.sls" yaml >}}
disk.format:
  module.run:
    - device: /dev/disk/by-id/scsi-0Linode_Volume_{{ pillar['volume_name'] }}
    - fs_type: ext4

/mnt/plex:
  mount.mounted:
    - device: /dev/disk/by-id/scsi-0Linode_Volume_{{ pillar['volume_name'] }}
    - fstype: ext4
    - mkmnt: True
    - persist: True
{{< /file >}}

    This file instructs Salt to prepare your Block Storage Volume for use with Plex. It first formats your Block Storage Volume with the `ext4` filesystem type by using the `disk.format` Salt module, which can be run in a state file using `module.run`. Then `disk.sls` instructs Salt to mount your volume at `/mnt/plex`, creating the mount target if it does not already exist with `mkmnt`, and persisting the mount to `/etc/fstab` so that the volume is always mounted at boot.

1.  Create the `directory.sls` file in `/srv/salt`:

    {{< file "/srv/salt/directory.sls" >}}
/mnt/plex/plex-media:
  file.directory:
    - require:
      - mount: /mnt/plex
    - user: username
    - group: plex

/mnt/plex/plex-media/movies:
  file.directory:
    - require:
      - mount: /mnt/plex
    - user: username
    - group: plex

/mnt/plex/plex-media/television:
  file.directory:
    - require:
      - mount: /mnt/plex
    - user: username
    - group: plex
{{< /file >}}

    The directories that are created during this step are for organizational purposes, and will house your media. Make sure you replace `username` with the name of the limited user account you created when following the [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide. The location of the directories is the volume you mounted in the previous step. If you wish to add more directories, perhaps one for your music media, you can do so here, just be sure to include the `- require` block, as this prevents Salt from trying to create the directory before the Block Storage Volume has been mounted.

1.  Go to the [Plex Media Server download page](https://www.plex.tv/media-server-downloads/#plex-media-server) and note the most recent version of their Linux distribution. At the time of writing, the most recent version is `1.13.9.5456-ecd600442`. Create the `plex.sls` Pillar file in `/srv/pillar` and change the Plex version number and the name of your Block Storage Volume as necessary:

    {{< file "/srv/pillar/plex.sls" yaml >}}
plex:
  version: 1.13.9.5456-ecd600442
volume_name: plex
{{< /file >}}

1.  Create the Salt Pillar top file in `/srv/pillar`. This file will instruct Salt to look for the `plex.sls` Pillar file you created in the previous step.

    {{< file "/srv/pillar/top.sls" >}}
base:
  '*':
    - plex
{{< /file >}}

1.  Apply your Salt state locally using `salt-call`:

        salt-call --local state.apply

    You should see a list of the changes Salt applied to your system. You have successfully installed Plex using Salt.

## Set Up Plex

### Initial Configuration

1.  You'll need to create an SSH tunnel to your Linode to connect to Plex's web UI. On your local computer, run the following command, replacing `<your_ip_address>` with your Plex server's IP address.:

        ssh username@<your_ip_address> -L 8888:localhost:32400

1.  In a browser, navigate to `http://localhost:8888/web/`.

1.  Sign in with your Plex username and password.

1.  Name your media server. This example uses the name `linode-plex`. Be sure to check the box that reads *Allow me to access my media outside my home* and then click **Next**.

    ![Name your media server](plex-salt-name-server.png)

### Organize Your Media

1.  Click on the **Add Library** button:

    ![Click on Add Media](plex-salt-organize-media.png)

2.  Select *Movies* and click **Next**:

    ![Select Movies and click next](plex-salt-add-library1.png)

3.  Click **Browse for Media Folder** and select the appropriate folder at `/mnt/plex/plex-media/movies`. Then click **Add**:

    ![Select the appropriate folder](plex-salt-add-library2.png)

4.  Repeat the process to add your 'Television' folder.

5.  When you are done adding your libraries, click **Add Library**.

5.  To continue the configuration process, click **Next**.

6.  Click on **Get Plex Apps** to download the appropriate Plex client for your device. Then click **Done**.

    ![Download the appropriate client for your device](plex-salt-download-app.png)

7.  In the future you can add more libraries by hovering over the menu and clicking the plus sign (+) next to *LIBRARIES*.

    ![Add more libraries](plex-salt-add-library3.png)

### Disable DLNA (Recommended)

[DLNA](https://en.wikipedia.org/wiki/Digital_Living_Network_Alliance) is a protocol that incorporates [Universal Plug and Play](https://en.wikipedia.org/wiki/Universal_Plug_and_Play) (or UPnP) standards for digital media sharing across devices. If you do not wish to make use of it, it’s recommended that you disable this feature, as it is openly connectable on port `1900`. From the Plex web interface, click the wrench icon in the upper right corner, and navigate to the **DLNA** section under *SETTINGS*. Uncheck *Enable the DLNA server*, and click **Save Changes**:

![Disable DLNA](plex-salt-disable-dlna.png)

## Connect to Your Plex Server

1. Visit the [Plex Apps](https://www.plex.tv/media-server-downloads/#plex-app) download page or the app store on your device to download Plex Media Player if you have not already done so.

1.  Open your Plex app. The example provided here will use the Plex Media Player for macOS.

1.  Sign in to Plex.

1.  On the left there's a dropdown menu where you can select your server by the name you chose. Select your server.

    ![Connect to your Plex Server](plex-salt-select-remote.png)

1.  You are now able to stream your content with Plex.

    ![Plex's macOS App](plex-salt-mac-app.png)

## Transfer Media to Your Server

1.  You can use SCP to transfer media to your server from your local computer. Replace your username and `123.456.7.8` with the IP address of your Linode.

        scp example_video.mp4 username@123.456.7.8:/mnt/plex/plex-media/movies

1.  Once you've transferred files to your Plex media server, you may need to scan for new files before they show up in your Library. Click on the ellipsis next to a Library and select **Scan Library Files**.

    ![Scan your Library for new files](plex-salt-scan-for-files.png)
