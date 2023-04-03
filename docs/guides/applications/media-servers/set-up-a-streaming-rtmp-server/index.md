---
slug: set-up-a-streaming-rtmp-server
description: "Learn how to configure an RTMP Server for streaming, including broadcasting, connecting to streams, and streaming simultaneously to YouTube and Twitch."
keywords: ['RTMP','streaming','multi-streaming','NGINX']
tags: ['rtmp', 'stream', 'nginx', 'vlc', "media"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-21
image: StreamingServer.jpg
modified_by:
  name: Linode
title: "Setting Up a Streaming RTMP Server"
title_meta: "How to Set Up an RTMP Streaming Server"
external_resources:
- '[RTMP Specification](https://www.adobe.com/devnet/rtmp.html)'
- '[OBS](https://obsproject.com/)'
- '[VLC Media Player](https://www.videolan.org/vlc/)'
- '[Adobe development](https://www.adobe.com/devnet/rtmp.html)'
- '[Wikipedia](https://en.wikipedia.org/wiki/Real-Time_Messaging_Protocol)'
- '[NGINX](https://www.nginx.com/)'
- '[NGINX GitHub](https://github.com/arut/nginx-rtmp-module#example-nginxconf)'
- '[Open Broadcaster Software (OBS)](https://obsproject.com/)'
- '[OBS website](https://obsproject.com/)'
- '[OBS Wiki](https://obsproject.com/wiki/)'
- '[OBS GitHub page](https://github.com/obsproject/obs-studio/wiki/Dropped-Frames-and-General-Connection-Issues)'
- '[VideoLAN site](https://www.videolan.org/vlc/)'
- '[VideoLAN support page](https://www.videolan.org/support/)'
- '[list of all of its ingest points](https://stream.twitch.tv/ingests/)'
- '[NGINX GitHub page](https://github.com/arut/nginx-rtmp-module)'
authors: ["Jeff Novotny"]
---

Live streaming has become an important way for creators, gamers, instructors, and media personalities to reach new audiences. Many live streamers are using sites such as Twitch and Facebook Live to stream. However, a *Real-Time Messaging Protocol* (RTMP) Streaming Server is another popular way to distribute live streams. RTMP allows you to send your stream to a central server, which can store it or retransmit it for audience playback.

This guide discusses how to configure an RTMP streaming server, and how to use open-source software to broadcast and connect to a stream. It also explains how to set up multi-streaming to transmit a live stream simultaneously to several social media sites.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## More Information About RTMP

RTMP is a networking protocol, not an application. It uses the *Transmission Control Protocol* (TCP) layer, so most media servers can process it. RTMP was originally a proprietary technology belonging to Adobe and was designed for high-performance transmission of audio, video, and data. However, it is now available for free public use and is currently one of the most popular streaming formats. Most encoders can transmit RTMP, and the large media sites accept it, but browser support can be patchy. We recommend you to use a dedicated media player such as the free open-source [*VLC Media Player*](https://www.videolan.org/vlc/) to receive streams.

If you want to learn more about the technical details behind RTMP, you can find out more on the [*Adobe development*](https://www.adobe.com/devnet/rtmp.html) site. The [*Wikipedia*](https://en.wikipedia.org/wiki/Real-Time_Messaging_Protocol) page also provides a good introduction.

## Advantages of Using an RTMP Streaming Server

- RTMP is a robust protocol offering *low-latency*, persistent connections, and reliable transmission. Streams are split into fragments, with the size negotiated between the client and the streaming server. Different streams can be multiplexed over the same connection. It is fairly easy to set up and use RTMP, but you must use RTMP-compatible software to transmit your stream to the server.

- Using an RTMP server also allows you to implement *multi-streaming*, which reduces the amount of bandwidth used on your local connection. You only transmit one copy of your stream to the server, even if you want to stream to multiple platforms. RTMP takes care of forwarding copies of your stream to as many sites as you want. This makes it easy and convenient to simultaneously live stream to YouTube, Facebook, and Twitch at the same time. However, for some sites, you must transcode the stream into a particular format by altering or recompressing your stream.

## System Requirements

An RTMP streaming server does not necessarily require much processing power or memory. For a single stream, a [*Linode 1GB*](https://www.linode.com/products/dedicated-cpu/) solution should suffice. If you are retransmitting to several sites or have to convert a stream into a different format, you might require a more powerful solution. In this case, we recommend a host with at least **4GB of memory**, such as a [*Linode 4GB*](https://www.linode.com/products/dedicated-cpu/) solution.

## A Summary of the RTMP Streaming Server Configuration Process

These installation instructions are geared for Ubuntu 20.04, but the procedure is similar on most Linux distributions. RTMP is a protocol rather than an application, so you do not have to install it. To make use of RTMP, you must install a web server, such as [*NGINX*](https://www.nginx.com/), and perform several other configuration steps. The following sections describe each step in more detail.

1. Install NGINX and Related Components
2. Configure NGINX to Support RTMP
3. Configure and Use the Open Broadcaster Software (OBS) Client
4. View and Test the Stream
5. Set Up and Test Multi-streaming

## Install NGINX and Related Components

NGINX features full RTMP support and we recommend it as your RTMP streaming server. Follow these steps to install NGINX.

1. Upgrade your host with the latest package updates.

        sudo apt update
        sudo apt upgrade
2. Install the NGINX server, RTMP support, and other related modules.

        sudo apt install build-essential libpcre3 libpcre3-dev libssl-dev nginx-full libnginx-mod-rtmp ffmpeg
3. Verify the status of the server.

        systemctl status nginx.service
    After installation, `Systemctl` returns a status of `active`.
    {{< output >}}
nginx.service - A high performance web server and a reverse proxy server
Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
Active: active (running) since Sun 2021-02-14 15:21:39 UTC; 41s ago
    {{< /output >}}

## Configure NGINX to Support RTMP

To stream, you must configure some server parameters through the `nginx.conf` file and create a stream application. This section explains how to configure RTMP to accept a stream and make it available for viewing. Multi-streaming is discussed in a later section.

1. Use your favorite text editor and open the NGINX configuration file, typically located at `/etc/nginx/nginx.conf`.

        sudo vi /etc/nginx/nginx.conf
    {{< note respectIndent=false >}}
If you cannot find the `nginx.conf` file, run the command `sudo nginx -t`. It displays the file's location and validates its syntax.
{{< /note >}}
1. Add some RTMP configuration to the end of the `nginx.conf` file as shown in this example.
    - The `chunk_size` setting configures the fragment size. The optimal size varies depending on the server, but `4096` is a reasonable default value.
    - The default port for the `listen` variable is `1935`.
    - Within the server configuration, create an application and give it a name. This example uses `livestream` as the application name, but for security reasons, we recommend you choose a more distinctive name. You must set `live` to `on` to enable streaming.
    - If you want to save a copy of your streams, set the `record` variable to `all`. Otherwise, set it to `none`.
    - If you set `record` to `all`, you must configure a value for `record_path`. This is where the recordings of your streams are saved.
    - We recommend adding an authentication method so your streams cannot be hijacked. Defining a location for `on_publish` here allows you to enable password validation in a subsequent step.

    {{< file "/etc/nginx/nginx.conf" >}}
...
rtmp {
        server {
                listen 1935;
                chunk_size 4096;
                notify_method get;

                application livestream {
                            live on;
                            on_publish http://localhost/auth;
                            #Set this to "record off" if you don't want to save a copy of your broadcasts
                            record all;
                            #The directory in which the recordings will be stored
                            record_path /var/www/html/streams;
                            record_unique on;
                }
        }

   }
    {{< /file >}}

1. Create a directory to save your streams. The directory location should match the value of `record_path`.

        sudo mkdir -p /var/www/html/streams
1. Set the permissions for the new directory so the server can write to it.

        sudo chown -R www-data:www-data /var/www/html/streams/
1. If you intend to enforce authentication for inbound streams, open the `/etc/nginx/sites-enabled/default` file and add the following information inside the `server` block. Replace `yourpassword` with a more secure password.
   - If the password you provide when you start your stream matches the password in this file, the streaming server returns an HTML code of `200` ("OK").
   - If the password is incorrect, it returns a code of `401` ("Unauthorized") and disconnects the session.

    {{< file "/etc/nginx/sites-enabled/default" >}}
...
listen 8080;
location /auth {
        if ($arg_pwd = 'yourpassword') {
            return 200;
            }
            return 401;
}
    {{< /file >}}
1. Restart the server to apply your changes.

        systemctl restart nginx.service
1. Review the server status to ensure it is still running. Look for the status of `active`.

        systemctl status nginx.service

{{< note >}}
You can find more detailed examples of NGINX configurations for RTMP on the [*NGINX GitHub*](https://github.com/arut/nginx-rtmp-module#example-nginxconf) page.

You can force viewers to authenticate before watching a stream with the `on_play` variable, which works the same way as `on_publish`. For extra security, you can remove the `html` configuration from this file if you are not planning to use NGINX as a web server. Ensure you do not delete the `events` configuration block while doing so.
{{< /note >}}

## Configure and Use the Open Broadcaster Software (OBS) Client

Streamers typically use either a commercial web-based streaming service or an application on their computer. To stream to your RTMP server, we recommend the [*Open Broadcaster Software (OBS)*](https://obsproject.com/). OBS is a free open-source broadcasting application that is flexible and straightforward to use. It is available for most common operating systems including Ubuntu.

1. Go to the [*OBS website*](https://obsproject.com/) and choose the appropriate download for your system. This software should be **installed on your computer** and not on the RTMP streaming server.

1. Open the application and look for the `Controls` menu in the lower right part of the application window. Click the **Settings** button.

    ![The Controls section of OBS](OBS-Settings-Control.png)
1. When the Settings window appears, click **Stream** on the left-hand panel, and enter the following information about your stream:
    - `Service`: `Custom`
    - `Server`: `rtmp://<yourserverIP>/<RTMP_application>`.
        - Replace `yourserverIP` with the actual IP address of your streaming server.
        - Replace `RTMP_application` with the name you chose for your application in the RTMP configuration block. In the earlier example, we used the name `livestream`.
    - `Stream Key`: `<your_stream_name?pwd=yourpassword>`.
       - `your_stream_name` can be any name you want to identify the stream.
       - `yourpassword` is the password you configured in `/etc/nginx/sites-enabled/default`.
    - Click **OK**.

    ![Stream Settings for OBS](Stream-Settings.png)
1. To begin streaming, click on the **Start Streaming** button in the lower right of the application in the `Controls` section.
    ![Start Streaming Button for OBS](Start-Streaming.png)
    {{< note respectIndent=false >}}
A quick way to test your stream is with a scrolling text message. Click the **+** button under the `sources` menu to create a text object. When you have created the object, right-click on the source and select **filter** to apply a scrolling effect. See the [*OBS Wiki*](https://obsproject.com/wiki/) for more information.
    {{< /note >}}
1. If you are recording your streams, you can easily confirm whether the server is accepting the streamed input or not. Navigate to the `record_path` directory (from your RTMP configuration), and list its contents with the `ls` command. If you see a new file, the streaming server is correctly receiving and saving your stream.

        cd /var/www/html/streams
        ls
    {{< note respectIndent=false >}}
Streaming at too high a rate could cause OBS to disconnect from the server. If your connection bounces, click  **Settings** and then select **Output**. Set the `Video Bitrate` to a lower value. OBS provides some helpful debugging tips on the [*OBS GitHub page*](https://github.com/obsproject/obs-studio/wiki/Dropped-Frames-and-General-Connection-Issues).
    {{< /note >}}

## View and Test the Stream

You are now ready to connect to and view your stream in a multimedia player. We recommend the open-source [*VLC Video Player*](https://www.videolan.org/vlc/) because it is simple, free, has good performance, and runs on all platforms. These instructions and the associated screenshots are for an Apple desktop, but the process is similar for other operating systems.

1. Navigate to the [*VideoLAN site*](https://www.videolan.org/vlc/) and download the VLC software for your operating system.
1. Click on the **File** menu and select **Open Network**.

    ![Open Network option for VLC](VLC-Open-Network.png)
1. This displays the "Open Source" dialogue box. In the `URL` field, enter your stream information in the format of `rtmp://<yourserverIP>/<RTMPApplication>/<your_stream_name>`. Replace `yourserverIP` with the actual IP of your streaming server and `RTMPApplication` with the name of the stream application from the server configuration file. The value for `your_stream_name` must match the stream name from OBS. Finally, check the `Stream output` box.

    ![Network configuration for VLC](VLC-Network-Details.png)

{{< note >}}
Beyond the basics, VLC can get complicated. If you run into trouble, consult the [*VideoLAN support page*](https://www.videolan.org/support/).
{{< /note >}}

## Set Up and Test Multi-Streaming

RTMP is particularly a good choice for streaming to multiple sites at once because it efficiently saves bandwidth. Instead of having to broadcast a separate stream to each channel, you can send one stream to the RTMP streaming server. The server then handles the redistribution of streams, sending one copy to each endpoint. You can enable multi-streaming in your RTMP configuration with a `push` entry for each destination. To set up multi-streaming, follow the below procedure:

1. Open the `/etc/nginx/nginx.conf` file for editing.

        sudo vi /etc/nginx/nginx.conf
1. Locate the ingest information for the service you want to stream to. For example, Twitch provides a [*list of all of its ingest points*](https://stream.twitch.tv/ingests/). Find the ingest point closest to you and take note of its ingest URL. For YouTube, you can find the ingest server URL on your YouTube Studio page. Consult the documentation for your streaming service for more detailed information.
1. Add a push notification for each service to the stream application block within the RTMP configuration. The configuration must be in the format `push rtmp://<streaming_service_ingest_url>/<stream_key>;`. The `streaming_service_ingest_url` is the ingest URL you located in the previous step. Each streaming service provides a way for you to determine your private `stream_key`. In Twitch, you can find your stream key from your dashboard, while in YouTube, it is in the same place you found the ingest server URL. This example illustrates the configuration to push to Twitch's London ingest server.
    {{< file "/etc/nginx/nginx.conf" >}}
...
rtmp {
        server {
...
                application livestream {
...
                            push rtmp://lhr04.contribute.live-video.net/app/<stream_key>;
                }
        }
}
    {{< /file >}}
1. Add additional `push` entries for the other sites you are streaming to.
1. Restart the server to apply your changes.

        systemctl restart nginx.service
1. Start your stream again. You can now view it on the streaming site of your choice.
1. **(Optional)** For enhanced security and more granular control, you can create an application for each streaming service and call it from the main application. This technique gives you the ability to override the `livestream` settings and turn off recording for some services. Edit each `push` notification in your `livestream` application to push to the new application.

   In the example above:
   - Change the push configuration for Twitch to `push rtmp://localhost/twitch;`.
   - Add the configuration for `application twitch` as shown below.
   - Restart the server and your stream once you are done to verify that your changes are correct.
    {{< file "/etc/nginx/nginx.conf" >}}
...
rtmp {
        server {
...
                application livestream {
...
                            push rtmp://localhost/twitch;
                }
                 application twitch {
                            live on;
                            record off;
                            allow publish 127.0.0.1;
                            deny publish all;
                            push rtmp://lhr04.contribute.live-video.net/app/<stream_key>;
                }
        }
}
    {{< /file >}}

{{< note >}}
Ingest servers can change without notice. We recommend you review the specifications for your streaming service regularly.
Some streaming services, such as Facebook Live, require you to transcode your stream into their particular format. You can accomplish this using the *FFmpeg library*.

See the [*NGINX GitHub page*](https://github.com/arut/nginx-rtmp-module) for a sample configuration.
{{< /note >}}
