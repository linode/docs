---
title: "Deploy Plex Media Server through the Linode Marketplace"
description: "Stream your personal media collection to nearly any device with your own Plex Media Server using Linode Marketplace Apps."
published: 2020-09-28
modified: 2025-02-19
keywords: ['streaming','plex','video','media server']
tags: ["debian","docker","marketplace", "web applications","linode platform", "cloud manager"]
image: Deploy_Plex_oneclickapps.png
external_resources:
- '[Plex Support Articles](https://support.plex.tv/articles/)'
aliases: ['/products/tools/marketplace/guides/plex/','/platform/marketplace/deploy-plex-with-marketplace-apps/', '/platform/marketplace/deploy-plex-with-one-click-apps/', '/guides/deploy-plex-with-one-click-apps/', '/guides/deploy-plex-with-marketplace-apps/','/platform/one-click/deploy-plex-with-one-click-apps/','/guides/plex-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 662119
marketplace_app_name: "Plex Media Server"
---

[Plex](https://www.plex.tv/) is a feature-rich streaming platform that lets you organize and stream your own digital video and audio to your devices. This guide shows you how to deploy the [**Plex Media Server**](https://hub.docker.com/r/plexinc/pms-docker/) using Linode's Plex Marketplace App, upload media to your Plex Server, and connect to it from a Plex client application. Your Plex Media Server could benefit from large amounts of disk space, so consider using our [Block Storage](/docs/products/storage/block-storage/) service with this app.

## Why Use Plex Media Server

Owning a Plex Media Server enables you to maintain a personal media library in addition to accessing [Plex's own content](https://mediaverse.plex.tv/), all available to stream to nearly [any device](https://www.plex.tv/apps-devices/). The ability to stream your own media is a unique advantage over other streaming services like [Netflix](https://www.netflix.com/), and comes only at the cost of your Akamai cloud computing services. Additional features, including local downloading, bandwidth limiting, and hardware transcoding are also available through the paid [Plex Pass](https://www.plex.tv/plex-pass/) service.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Plex should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Suggested minimum plan:** 4GB Dedicated CPU or Shared Compute Instance

### Plex Options
{{% content "marketplace-required-limited-user-fields-shortguide" %}}
- **SOA Email Address:** *(required)*: Enter an email address you want to use for generating the SSL certificates and configuring the server and DNS records.

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started After Deployment

After your Plex Server has been deployed, you can upload media and configure access to your Plex Server from Plex clients for your media devices.

Before you begin, ensure that you signed up to [Plex](https://www.plex.tv/sign-up/).

### Initial Setup

Administration of your Plex Server is performed from its web interface. Open a web browser and go to the custom domain provided during deployment, or the instance's default rDNS.
    ![Plex Login Screen](plex-login.png "Plex login screen.")

1.  Enter a name for your Plex server and select the **Allow me to access my media outside my home** checkbox. Click **NEXT**.

    ![Plex Server Setup - Name](initial-setup-set-hostname.png "Plex Server Setup - Name.")

1.  Skip Media Library setup by clicking **NEXT**. You will [Upload Media](#uploading-media) and [Add Media Libraries](#adding-media-libraries) in the sections below.

    ![Plex Server Setup - Skip Add Media Library](initial-setup-skip-media-library.png "Plex Server Setup - Skip Add Media Library.")

1.  To finish the initial setup, click **DONE**.

    ![Plex Server Setup - Finish](initial-setup-finish.png "Plex Server Setup - Finish.")

1.  Click the **Settings** icon in top-right corner of the Plex web interface.

    ![Plex Settings Icon](initial-setup-settings-icon.png "Plex Settings Icon.")

1.  On the left side bar, ensure that your new Plex Server is selected and in the **Settings** section, select **Remote Access**.

    ![Plex Server Remote Access Settings](initial-setup-remote-access.png "Plex Remote Access Settings.")

1.  Select the **Manually specify public port** checkbox and keep the default value of `32400`. Click **Retry** or **Apply**. You may need to select **Show advanced** to see these settings.

    ![Enable Plex Server Remote Access](initial-setup-enable-remote-access.png "Enable Plex Server Remote Access.")

1.  Wait until you see a message stating that your Plex Server is *Fully accessible outside your network*.

    ![Plex Server Remote Access Successful](initial-setup-remote-access-success.png "Plex Server Remote Access Successful.")

You can now access [uploaded media](#uploading-media) and manage your Plex Server from any Plex Client, such as the [Plex Web App](https://app.plex.tv). If you are unable to reach your Plex Server remotely, you can repeat the steps in this section to re-establish a direct connection for administrative purposes.

### (Optional) Connecting a Linode Block Storage Volume

If your media collection is larger than the space available from your Linode plan, [Block Storage](/docs/products/storage/block-storage/) is a convenient solution. This section outlines the steps for creating and connecting a Block Storage Volume for use with your Plex Server.

{{< note >}}
For future reference, you can find examples of the instructions provided in this section in Cloud Manager by navigating to [**Volumes**](https://cloud.linode.com/volumes), then selecting **Show Configuration** from the option menu for your Volume.
{{< /note >}}

1.  [View, Create, and Delete Block Storage Volumes](/docs/products/storage/block-storage/guides/manage-volumes/) if you don't have one already prepared.

1.  Establish an SSH connection to your Plex Server Linode as your [Limited User](#plex-marketplace-app-options).

1.  On your Plex Server Linode, create a directory to your Volume's mountpoint:

        mkdir ~/plex/media/linode-volume

1.  Mount your Volume path to the mountpoint you have created, substituting `$FILE_SYSTEM_PATH` with your Volume's file system path (which you can get in the Cloud Manager's [**Volumes**](https://cloud.linode.com/volumes) dashboard):

        sudo mount $FILE_SYSTEM_PATH ~/plex/media/linode-volume

1.  Check available disk space:

        df -BG

    ```output
    Filesystem     1G-blocks  Used Available Use% Mounted on
    udev                  1G    0G        1G   0% /dev
    tmpfs                 1G    1G        1G  11% /run
    /dev/sda             49G    3G       45G   5% /
    tmpfs                 1G    0G        1G   0% /dev/shm
    tmpfs                 1G    0G        1G   0% /run/lock
    tmpfs                 1G    0G        1G   0% /sys/fs/cgroup
    tmpfs                 1G    0G        1G   0% /run/user/1000
    /dev/sdc             20G    1G       19G   1% /home/username/plex/media/linode-volume
    ```

    Notice that there is some overhead with the Volume due to the file system.

1.  To ensure that your Volume automatically mounts every time your Linode reboots, run the following command to modify your `/etc/fstab` file, substituting `$FILE_SYSTEM_PATH` with your Volume's file system path (the `$HOME` environment variable should already be set as your user's home directory):

        echo "$FILE_SYSTEM_PATH $HOME/plex/media/linode-volume ext4 defaults,noatime,nofail 0 2" | \
        sudo tee -a /etc/fstab

1.  Restart your Plex Server Docker container:

        docker restart plex

Media on your Volume is now accessible through the Plex web interface at the mounted directory on your Linode. Next, follow the instructions below on how to [Upload Media](#uploading-media) to your Volume (use your Volume's mountpoint instead of creating a new subdirectory), and [Add Media Libraries](#adding-media-libraries) to enable streaming media stored on your Volume.

### Uploading Media

Your Plex Server is set up to access media files in the `~/plex/media` directory. You have many options for uploading or downloading media to your Plex Server. This section shows you how to organize and upload files to your Plex Server using the `scp` command.

{{< note >}}
This section directs you to run commands either on your Plex Server Linode through an SSH connection as your [Limited User](#plex-options), or from the workstation [terminal](/docs/guides/using-the-terminal/) where the media files you wish to upload are stored.
{{< /note >}}

1.  On your Plex Server Linode, create a subdirectory within `~/plex/media` to store your media files. Plex recommends [organizing media by type](https://support.plex.tv/articles/naming-and-organizing-your-movie-media-files/), so pick a subdirectory name that matches the type of media you plan to upload. For example, to create a directory to store movie files, enter the following command:

        mkdir ~/plex/media/movies

1.  From your media workstation, use the `scp` command to move media to your Plex Server's media subdirectory, substituting `$USERNAME` with your Linux [Limited User Name](#plex-marketplace-app-options), and `$IP_ADDRESS` with the [IP address](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) of your Plex Server Linode:

        scp example_video.mp4 $USERNAME@$IP_ADDRESS:~/plex/media/movies

    Depending on the files' size, this may take a few minutes.

    {{< note >}}
    There are other ways to upload files to your Plex Server Linode. See our section in [Linux System Administration Basics](/docs/guides/linux-system-administration-basics/#upload-files-to-a-remote-server) for more information.
    {{< /note >}}

### Adding Media Libraries

1.  Log into a Plex Client, such as the [Plex Web App](https://app.plex.tv), and on the side bar, click **More**.

    ![Plex Home Side Bar — More](media-library-side-bar.png "Plex Home Side Bar — More.")

1.  Hover over your Plex Server's name in the Plex side bar and click **+**.

    ![Add Media Library — Start](media-library-add.png "Add Media Library — Start.")

1.  Select your library type, set a name and language for your media library. Click **Next**.

    ![Set Media Library Type, Name, and Language](media-library-type-name-language.png "Set Media Library Type, Name, and Language.")

1.  Click **Browse for media folder**. Go to the directory within `/media` where your files are stored and click **Add**.

    ![Select Media Library Directory](media-library-select-directory.png "Select Media Library Directory.")

1.  Once you are satisfied with your selection, click **Add library**.

    ![Add Media Library — Finish](media-library-finish.png "Add Media Library — Finish.")

1.  Pin your new media library to make it accessible from the Plex home screen.

    ![Pin Media Library](media-library-pin.png "Pin Media Library.")

1.  Repeat the steps in this section to add additional media folders.

You now have all the tools you need to create an online media library and stream it to [any device](https://www.plex.tv/apps-devices/) with Plex.

## Software Included

The Plex Marketplace App installs the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**NGINX**](https://www.nginx.com/) | Open Source webserver and reverse proxy. See our guide on [Getting Started with NGINX](/docs/guides/getting-started-with-nginx-part-1-installation-and-basic-setup/) for more information. |
| [**UFW**](https://wiki.ubuntu.com/UncomplicatedFirewall) | Firewall utility. Ports 22/tcp, 80/tcp, and 443/tcp for IPv4 and IPv6 are enabled with installation of this app. Additional ports must be opened to send email from your Linode for use with this app. To learn more, see [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/). |
| [**Plex Media Server**](https://hub.docker.com/r/plexinc/pms-docker/) | The Plex Media Server transmits locally-stored media files, enabling you to stream your personal media collection to any device that can support a [Plex Client](https://www.plex.tv/apps-devices/). The Latest release in Plex's Public Main branch is installed by this deployment. |


{{% content "marketplace-update-note-shortguide" %}}
