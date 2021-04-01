---
slug: deploy-plex-with-marketplace-apps
author:
  name: Ben Bigger
  email: docs@linode.com
description: 'Stream your personal media collection to nearly any device with your own Plex Media Server using Linode Marketplace Apps.'
og_description: 'Stream your personal media collection to nearly any device with your own Plex Media Server using Linode Marketplace Apps.'
keywords: ['streaming','plex','video','media server']
tags: ["debian","docker","marketplace", "web applications","linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-09-28
modified_by:
  name: Linode
title: "How to Deploy Plex Media Server with Marketplace Apps"
h1_title: "Deploying Plex Media Server with Marketplace Apps"
external_resources:
- '[Plex Support Articles](https://support.plex.tv/articles/)'
aliases: ['/platform/marketplace/deploy-plex-with-marketplace-apps/', '/platform/marketplace/deploy-plex-with-one-click-apps/']
---

## Plex Marketplace App

[Plex](https://www.plex.tv/) is a feature-rich streaming platform that allows you to organize and stream your own digital video and audio to your devices. This guide shows you how to deploy the [**Plex Media Server**](https://hub.docker.com/r/plexinc/pms-docker/) using Linode's Plex Marketplace App, upload media to your Plex Server, and connect to it from a Plex client application. Your Plex Media Server could benefit from large amounts of disk space, so consider using our [Block Storage](/docs/platform/block-storage/how-to-use-block-storage-with-your-linode) service with this app.

### Why Use Plex Media Server

Owning a Plex Media Server enables you to maintain a personal media library in addition to accessing [Plex's own content](https://mediaverse.plex.tv/), all available to stream to nearly [any device](https://www.plex.tv/apps-devices/). The ability to stream your own media is a unique advantage over other streaming services like [Netflix](https://www.netflix.com/), and comes only at the cost of your Linode services. Additional features, including local downloading, bandwidth limiting, and hardware transcoding are also available through the paid [Plex Pass](https://www.plex.tv/plex-pass/) service.

### Deploy a Plex Marketplace App

{{< content "deploy-marketplace-apps">}}

### Plex Marketplace App Options

The following configuration options create a secure [Limited User](/docs/security/basics/securing-your-server/#add-a-limited-user-account) to run your Plex Media Server.

{{< note >}}
-   As a security measure, [root login over SSH](/docs/security/basics/securing-your-server/#ssh-daemon-options) is disabled for this App. Use your Limited User credentials to access your Linode via SSH instead.
-   The Limited User configurations below are for your Linode's [Linux user](/docs/tools-reference/basics/linux-users-and-groups/), which is distinct from your [Plex account user](https://www.plex.tv/sign-up/).
{{< /note >}}

| **Configuration** | **Description** |
|--------------|------------|
| **Limited User Name** | The [username](/docs/security/basics/securing-your-server/#add-a-limited-user-account) for SSH access to your Linode. *Required*. <br><br> If the username `root` is specified, a limited user is not be created and extra security features are not configured. In this case, you can access your Plex Server and complete this guide as `root` using your [Linode Options](#linode-options) credentials. |
| **Limited User Password** | The user password for SSH access to your Linode. *Required*. |
| **Limited User SSH Key** | The user public SSH key for SSH access to your Linode. *Optional*. <br><br> You can find instructions on generating an SSH key pair in our guide on [Using Public Key Authentication with SSH](/docs/security/authentication/use-public-key-authentication-with-ssh/). For an additional layer of security, you can require SSH key access by [disabling password authentication](/docs/security/basics/securing-your-server/#ssh-daemon-options). |

### Linode Options

The following configuration options are possible for your Linode server:

| **Configuration** | **Description** |
|--------------|------------|
| **Select an Image** | Debian 10 is currently the only image supported by the Plex Marketplace App. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a data center, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). Plex recommends 2GB of RAM to run Plex Media Server on its own, and more if you plan to run additional applications. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name is how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you access the root user. The password must meet complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

When you have provided all required Linode Options, select on the **Create** button. **Your Plex app will complete installation anywhere between 1-5 minutes after your Linode has finished provisioning**.

### Software Included

The Plex Marketplace App installs the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Docker Engine**](https://docs.docker.com/engine/) | Docker Engine is an open source containerization technology for building and containerizing your applications. This Marketplace App deploys Plex Media Server as a Docker container. |
| [**Plex Media Server**](https://hub.docker.com/r/plexinc/pms-docker/) | The Plex Media Server transmits locally-stored media files, enabling you to stream your personal media collection to any device that can support a [Plex Client](https://www.plex.tv/apps-devices/). |

{{< content "marketplace-update-note">}}

## Getting Started After Deployment

After your Plex Server has been deployed, you can upload media and configure access to your Plex Server from Plex clients for your media devices.

Before you begin, ensure that you have signed up for a [Plex account](https://www.plex.tv/sign-up/).

### Initial Setup

Administration of your Plex Server is performed from its web interface. Before you can connect to the web interface from your workstation, you first need to create an SSH tunnel to your Linode.

{{< note >}}
This guide occasionally directs you to substitute variables beginning with `$` in certain commands.

An easy way to make these substitutions is to set the variables in your shell, then simply copy the commands as they are provided in this guide — your shell automatically substitutes the `$` variables in those commands with the values you have set.

For example, you can set configure a substitution for `$IP_ADDRESS` like so:

    IP_ADDRESS=192.0.2.0

Your shell then interprets `$IP_ADDRESS` as the value you have provided in following commands, for example:

    echo $IP_ADDRESS

{{< output >}}
192.0.2.0
{{< /output >}}
{{< /note >}}

1.  From your workstation [terminal](/docs/tools-reference/tools/using-the-terminal/), enter the following the command, substituting `$USERNAME` with your Linux [Limited User Name](#plex-marketplace-app-options), and `$IP_ADDRESS` with the [IP address](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/) of your Plex Server Linode:

        ssh $USERNAME@$IP_ADDRESS -L 8888:localhost:32400

    You now have an established SSH connection to your Plex Server Linode in your terminal, and can also access the Plex web interface from your workstation browser.

1.  Enter `http://localhost:8888/web` into your workstation browser to access the Plex Server setup web interface. Enter your Plex account username and password to proceed with the setup process.

    ![Plex Login Screen](plex-login.png "Plex login screen.")

1.  Give your Plex Server a name. Be sure to leave the **Allow me to access my media outside my home** box **checked**, and select **NEXT**.

    ![Plex Server Setup - Name](initial-setup-set-hostname.png "Plex Server Setup - Name.")

1.  Skip Media Library setup by selecting **NEXT** for now. You will [Upload Media](#upload-media) and [Add Media Libraries](#add-media-libraries) in the sections below.

    ![Plex Server Setup - Skip Add Media Library](initial-setup-skip-media-library.png "Plex Server Setup - Skip Add Media Library.")

1.  Finish initial setup and reach the Plex home screen by selecting **DONE**.

    ![Plex Server Setup - Finish](initial-setup-finish.png "Plex Server Setup - Finish.")

1.  Click on the **Settings** icon in top-right corner of the Plex web interface.

    ![Plex Settings Icon](initial-setup-settings-icon.png "Plex Settings Icon.")

1.  On the left side bar, ensure that your new Plex Server is selected and select on **Remote Access** under the **Settings** section.

    ![Plex Server Remote Access Settings](initial-setup-remote-access.png "Plex Remote Access Settings.")

1.  Click the check box next to **Manually specify public port**, keep the default value of `32400`, and select **RETRY** or **APPLY**. You may need to select **SHOW ADVANCED** to see these settings.

    ![Enable Plex Server Remote Access](initial-setup-enable-remote-access.png "Enable Plex Server Remote Access.")

1.  Wait until you see a message stating that your Plex Server is **Fully accessible outside your network**.

    ![Plex Server Remote Access Successful](initial-setup-remote-access-success.png "Plex Server Remote Access Successful.")

You can now access [uploaded media](#upload-media) and manage your Plex Server from any Plex Client, such as the [Plex Web App](https://app.plex.tv). If you are unable to reach your Plex Server remotely, you can repeat the steps in this section to re-establish a direct connection for administrative purposes.

### (Optional) Connect a Linode Block Storage Volume

If your media collection is larger than the space available from your Linode plan, [Block Storage](/docs/platform/block-storage/how-to-use-block-storage-with-your-linode) is a convenient solution. This section outlines the steps for creating and connecting a Block Storage Volume for use with your Plex Server.

{{< note >}}
For future reference, you can find examples of the instructions provided in this section in Cloud Manager by navigating to [**Volumes**](https://cloud.linode.com/volumes), then selecting **Show Configuration** from the option menu for your Volume.
{{< /note >}}

1.  [Create a Block Storage Volume](/docs/platform/block-storage/how-to-use-block-storage-with-your-linode/#add-a-volume-from-the-linode-detail-page) if you do not already have one prepared.

1.  Establish an SSH connection to your Plex Server Linode as your [Limited User](#plex-marketplace-app-options).

1.  On your Plex Server Linode, create a directory to your Volume's mountpoint:

        mkdir ~/plex/media/linode-volume

1.  Mount your Volume path to the mountpoint you have created, substituting `$FILE_SYSTEM_PATH` with your Volume's file system path (which is viewable from the Cloud Manager [**Volumes**](https://cloud.linode.com/volumes) dashboard):

        sudo mount $FILE_SYSTEM_PATH ~/plex/media/linode-volume

1.  Check available disk space:

        df -BG

    {{< output >}}
Filesystem     1G-blocks  Used Available Use% Mounted on
udev                  1G    0G        1G   0% /dev
tmpfs                 1G    1G        1G  11% /run
/dev/sda             49G    3G       45G   5% /
tmpfs                 1G    0G        1G   0% /dev/shm
tmpfs                 1G    0G        1G   0% /run/lock
tmpfs                 1G    0G        1G   0% /sys/fs/cgroup
tmpfs                 1G    0G        1G   0% /run/user/1000
/dev/sdc             20G    1G       19G   1% /home/username/plex/media/linode-volume
    {{< /output >}}

    Notice that there is some overhead with the Volume due to the file system.

1.  To ensure that your Volume automatically mounts every time your Linode reboots, run the following command to modify your `/etc/fstab` file, substituting `$FILE_SYSTEM_PATH` with your Volume's file system path (the `$HOME` environment variable should already be set as your user's home directory):

        echo "$FILE_SYSTEM_PATH $HOME/plex/media/linode-volume ext4 defaults,noatime,nofail 0 2" | \
        sudo tee -a /etc/fstab

1.  Restart your Plex Server Docker container:

        docker restart plex

Media on your Volume is now accessible through the Plex web interface at the mounted directory on your Linode. Next, follow the instructions below on how to [Upload Media](#upload-media) to your Volume (use your Volume's mountpoint instead of creating a new subdirectory), and [Add Media Libraries](#add-media-libraries) to enable streaming media stored on your Volume.

### Upload Media

Your Plex Server is set up to access media files in the `~/plex/media` directory. You have many options for uploading or downloading media to your Plex Server. This section shows you how to organize and upload files to your Plex Server using the `scp` command.

{{< note >}}
This section directs you to run commands either on your Plex Server Linode through an SSH connection as your [Limited User](#plex-options), or from the workstation [terminal](/docs/tools-reference/tools/using-the-terminal/) where the media files you wish to upload are stored.
{{< /note >}}

1.  On your Plex Server Linode, create a subdirectory within `~/plex/media` to store your media files. Plex recommends [organizing media by type](https://support.plex.tv/articles/naming-and-organizing-your-movie-media-files/), so pick a subdirectory name that matches the type of media you plan to upload. For example, to create a directory to store movie files, enter the following command:

        mkdir ~/plex/media/movies

1.  From your media workstation, use the `scp` command to move media to your Plex Server's media subdirectory, substituting `$USERNAME` with your Linux [Limited User Name](#plex-marketplace-app-options), and `$IP_ADDRESS` with the [IP address](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/) of your Plex Server Linode:

        scp example_video.mp4 $USERNAME@$IP_ADDRESS:~/plex/media/movies

    Depending on the file size(s), this may take a few minutes.

    {{< note >}}
There are other ways to upload files to your Plex Server Linode. See our section in [Linux System Administration Basics](/docs/tools-reference/linux-system-administration-basics/#upload-files-to-a-remote-server) for more information.
    {{< /note >}}

### Add Media Libraries

1.  Log into a Plex Client, such as the [Plex Web App](https://app.plex.tv), then select the **MORE >** link on the Plex side bar.

    ![Plex Home Side Bar — More](media-library-side-bar.png "Plex Home Side Bar — More.")

1.  Hover over your Plex Server's name in the Plex side bar, then select the **+** icon.

    ![Add Media Library — Start](media-library-add.png "Add Media Library — Start.")

1.  Select your library type, set the name for your media library, select your language, then select the **NEXT** button.

    ![Set Media Library Type, Name, and Language](media-library-type-name-language.png "Set Media Library Type, Name, and Language.")

1.  Click **BROWSE FOR MEDIA FOLDER**, navigate to the directory within `/media` where your files are stored, then select the **ADD** button.

    ![Select Media Library Directory](media-library-select-directory.png "Select Media Library Directory.")

1.  Once you are satisfied with your selection, select the **ADD LIBRARY** button.

    ![Add Media Library — Finish](media-library-finish.png "Add Media Library — Finish.")

1.  Pin your new media library to make it accessible from the Plex home screen.

    ![Pin Media Library](media-library-pin.png "Pin Media Library.")

1.  Repeat the steps in this section to add additional media folders.

You now have all the tools you need to create an online media library and stream it to [any device](https://www.plex.tv/apps-devices/) with Plex.
