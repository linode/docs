---
slug: how-to-install-streamlink-cli-on-ubuntu-macos
description: 'In this guide, you learn how to install and configure Streamlink on the macOS, Ubuntu, and Debian distributions'
keywords: ['streamlink']
tags: ['ubuntu', 'debian']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-03
modified_by:
  name: Linode
title: "Install Streamlink CLI on Ubuntu and macOS"
title_meta: "How to Install Streamlink CLI on Ubuntu and macOS"
external_resources:
- "[Streamlink's Plugins documentation](https://streamlink.github.io/plugin_matrix.html)"
- "[Streamlink's Player Options](https://streamlink.github.io/cli.html#positional-arguments)"
authors: ["Sandro Villinger"]
---

Streamlink lets you watch any stream inside your favorite media players such as [VLC](https://www.videolan.org/vlc/), [MPlayer](https://mplayerhq.hu/design7/news.html), and [QuickTime](https://support.apple.com/downloads/quicktime). You can watch [YouTube](https://www.youtube.com), [Twitch](https://www.twitch.tv), or [DailyMotion](https://www.dailymotion.com/us) video streams on your desktop instead of in your browser. Aside from a cleaner experience, streaming via any desktop player has far less impact on your PC's resources leading to smoother playback.

In this guide, you learn how to install and configure Streamlink on the macOS, Ubuntu, and Debian distributions. For a list of all available streaming resources, see [Streamlink's Plugins documentation](https://streamlink.github.io/plugin_matrix.html).

## Before You Begin

Streamlink connects your stream to any media player, so make sure you have a compatible player installed on your computer. Streamlink supports [MPlayer](http://www.mplayerhq.hu/design7/dload.html), [MPV](https://mpv.io/installation/), [VLC](https://www.videolan.org/vlc/#download), and [QuickTime](https://support.apple.com/downloads/quicktime) (on macOS).

## Streamlink Installation Steps

### Install Streamlink on Ubuntu and Debian

Start with the basic requirements to get Streamlink installed.

1. Update the packages on your Debian or Linux system.

        sudo apt update

1. If you're using an Ubuntu distribution, add the following software repository to APT.

        sudo add-apt-repository ppa:nilarimogard/webupd8

1. Use APT to install Streamlink on your system.

        sudo apt install streamlink

1. Confirm the installation with  **Y** and wait for the download and package installation to complete. You’re now ready to start streaming on your Ubuntu or Debian desktop computer. The steps in the following section covers those details.

    {{< note respectIndent=false >}}
If you receive a `No playable streams found on this URL` error, install Streamlink using the [Python Package Installer (pip)](/docs/guides/how-to-manage-packages-and-virtual-environments-on-linux/#what-is-pip):

Check the version of your system's `pip` installation by running the command below:

    pip --version

Depending on your version of `pip`, use one of the commands below:

    pip3 install --user --upgrade streamlink

   Or:

    pip install --user --upgrade streamlink

{{< /note >}}

### Install Streamlink on macOS

1. If you do not have [Homebrew](https://brew.sh/) installed on your macOS, install it using the following command:

        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

1. Install Streamlink.

        brew install streamlink

You’re now ready to start streaming on your macOS desktop computer.

## Start a Stream Using the Command Line

1. To watch a stream using the Streamlink CLI, issue the command below. Replace the URL with your own stream's URL.

        streamlink https://www.twitch.tv/linode

    You see a list of available streaming options.

    {{< note respectIndent=false >}}
When using Ubuntu or Debian, you may have to specify the video player to open the stream in. For example, to open your stream using VLC, issue the following command:

    streamlink -p vlc twitch.tv/linode

This selects VLC as the desired media player. This works across most supported streaming platforms.
    {{< /note >}}

1. Select the desired resolution by using the following command:

        streamlink twitch.tv/linode 900p60

    Alternatively, you can select the best available streaming resolution with the following command:

        streamlink twitch.tv/linode best

To learn more about the available Streamlink CLI configuration options, see [Streamlink's Player Options](https://streamlink.github.io/cli.html#positional-arguments) documentation.
