---
slug: streamlink-twitch-gui-install-and-configure
description: 'This guide shows you how to install and configure the Streamlink Twitch GUI on macOS and Linux distributions.'
keywords: ['streamlink twitch gui']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-17
modified_by:
  name: Linode
title: "Install and Configure the Streamlink Twitch GUI"
title_meta: "How to Install and Configure the Streamlink Twitch GUI"
authors: ["Sandro Villinger"]
---
Streamlink allows you to watch your favorite Twitch streams using the most popular media players on Linux and macOS. The [Streamlink Twitch GUI](https://streamlink.github.io/streamlink-twitch-gui/) project gives you a straightforward GUI on top of the StreamLink CLI with a focus on Twitch streams only. You can also watch multiple streams at once and manage your favorite Twitch streamers in a single, clean UI. This guide shows you how to install and use the Streamlink GUI on macOS and Linux (Debian/Ubuntu).

## Streamlink Twitch GUI Installation Steps

### How to Install Streamlink GUI on macOS

1. Go to [Streamlink's releases page on GitHub](https://github.com/streamlink/streamlink-twitch-gui/releases) and pick the right installer for macOS.

1. Extract the archive and open up the **Streamlink Twitch GUI** application file. macOS prevents the file from being installed so you have to allow it under **System Preferences** and **Security & Privacy**.

    ![Access your macOS security and privacy settings](macos-security-privacy-preferences.png)

1. Click on **Open Anyway** and confirm the next security dialogue.

1. The Streamlink UI launches and you can get started.

### How to Install Streamlink GUI on Linux

1. Go to [Streamlink's releases page on GitHub](https://github.com/streamlink/streamlink-twitch-gui/releases) and pick the right installer for your Linux system.

1. Once downloaded, right-click on the file and select Permissions.

    ![Right-click on the downloaded file and select Permissions](open-permissions-dialog-window.png)

1. Then, check **Allow executing file as program** and give it **Read and write permissions**. Once done, you can open and start using the Streamlink Twitch GUI.

    ![View the Streamlink Twitch GUI](streamlink-twitch-gui.png)

## Configure the Streamlink Twitch GUI

Now that Streamlink Twitch GUI is installed, here’s a walkthrough of its most important and best features.

1. **Connect to your Twitch account**: You can watch streams via Streamlink Twitch GUI, and do so with your own account. Click on the **Login** button and then, click **Authorize** to connect.

1. **Watch multiple streams at the same time**: You can watch as many streams as your bandwidth permits. To do that, click on any stream and hit the **play** button. Wait for VLC to launch. Now, hit the **purple back arrow** and select another stream – and once again, hit the **play** button.

    ![After VLC launches, click on the purple back arrow and select another stream.](watch-multiple-twitch-streams.png)

1. **Enable low-latency streaming**: Most channel streams use the low latency mode. This reduces the delay between the streamer and your player, as well as chat delays. You should enable this feature in Streamlink Twitch GUI too. To do so, go to **Settings** and switch over to the **Streaming** tab. Check **Enable low latency** streaming. You may experience some hiccups when streaming regular streams – however, low latency is the default in Twitch so it’s unlikely you'll encounter any issues.

    ![Access your Streamlink Twitch settings and enable low latency streaming.](enable-low-latency-settings.png)

1. **Open a chat**: Since your game is streamed through your media player (e.g. VLC or MPV), the only way to chat with your fellow viewers or the streamer is through a separate small browser window. To open this, click on a **stream** and then on the **chat** icon.

    ![Click on the chat icon to open a stream's chat window.](open-a-stream-chat.png)

With the above configurations, you should be able to watch your favorite Twitch streams using the Streamlink GUI. If you prefer to use the Streamlink CLI, see our [Install Streamlink CLI on Ubuntu and macOS](/docs/guides/how-to-install-streamlink-cli-on-ubuntu-macos/) guide.
