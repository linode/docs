---
slug: live-streaming-with-livekit-and-obs
title: "Live Streaming With Livekit and Obs"
description: 'Learn how to set up a LiveKit server for live streaming from OBS Studio in this tutorial.'
og_description: 'Learn how to set up a LiveKit server for live streaming from OBS Studio in this tutorial.'
keywords: ['streaming','obs','webrtc']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Nathaniel Stickman"]
published: 2023-11-15
modified_by:
  name: Nathaniel Stickman
external_resources:
- '[LiveKit Docs](https://docs.livekit.io/realtime/)'
---



    ``` output
    API Key: API4oMqFj5s4gnY
    API Secret: 3c5sDOXvxHWntVYPiVZnnW9FvgmJT0ScRdE5JK7ioRN

    Here's a test token generated with your keys: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzU0NzM4OTAsImlzcyI6IkFQSTRvTXFGajVzNGduWSIsIm5hbWUiOiJUZXN0IFVzZXIiLCJuYmYiOjE2OTk0NzM4OTAsInN1YiI6InRlc3QtdXNlciIsInZpZGVvIjp7InJvb20iOiJteS1maXJzdC1yb29tIiwicm9vbUpvaW4iOnRydWV9fQ.eHV4rJSGvBLbl961hpxhXbFKaeX7IOHnpe95Bb7hGPQ
    ```

    ```output
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTk2Mzc0ODgsImlzcyI6IkFQSTRvTXFGajVzNGduWSIsIm5hbWUiOiJleGFtcGxlLXVzZXIiLCJuYmYiOjE2OTk1NTEwODgsInN1YiI6ImV4YW1wbGUtdXNlciIsInZpZGVvIjp7InJvb20iOiJleGFtcGxlLXJvb20iLCJyb29tSm9pbiI6dHJ1ZX19.imGQoehR162lKqTkxEgJLHS-sUAwf8-m5bkfMlXalAM
    ```



LiveKit is an open-source stack for streaming audio and video. With modern APIs, LiveKit can readily integrate into your applications, and a scalable design ensures the performance you need even as your audience grows.

LiveKit also operates with a range of streaming sources, making it a good fit to bring an audience to your content. An open-source streaming tool like OBS Studio pairs excellently with LiveKit for a full open-source streaming solution.

In this tutorial, learn more about LiveKit and how to set up you own instance. Then, to get started streaming, see how you can use OBS Studio together with LiveKit for broadcasting your streams out into the world.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What is LiveKit?

[LiveKit](https://livekit.io/) offers an open-source WebRTC stack, capable of scalable, multi-user, real-time streaming of audio and video. With a set of modern APIs — accessible through server-side and frontend SDKs — LiveKit's streaming capabilities lend themselves to integrating with your applications.

Each LiveKit instance consists of three parts.

-   The LiveKit server. The server hosts *rooms*, where streamed content becomes available. Each room can have a set of *participants*, which can either subscribe to content or broadcast content on one or more *tracks*.

-   Ingress. This controls the import of audio and video into LiveKit. LiveKit's Ingress can receive content from a WebRTC flow, as well as from RTMP, WHIP, and HTTP servers. You can even create an Ingress stream from one of its supported file types:

    - HTTP Live Streaming (HLS) segments
    - MP4
    - MOV
    - OGG
    - WEBM
    - MP3
    - M4A

-   Egress. This controls the export of audio and video from a given room or track. With LiveKit's Egress, you can make content available as an RTMP or WebSocket stream for a web application or for services like Twitch and YouTube Live. You can also export content to one of the supported file types:

    - HLS segments
    - MP4
    - OGG
    - WEBM


### Installation Methods

While LiveKit has a fully-managed Cloud service, you can also self-host its open-source stack. A self-hosted LiveKit server can be set up in several ways. For a high level of control, you can install and configure all of the components manually. For a convenient setup, you can use LiveKit's Docker image to generate a configuration and a start-up script. Or, for more scalability, you can leverage LiveKit's Helm chart for a Kubernetes deployment.

This tutorial walks you through using the Docker set up method. Not only is this approach convenient, but it provides a ready LiveKit instance for you to start working with. Then, should your needs grow, you have the experience and tested configuration to confidently expand into a Kubernetes setup.

## How to Install LiveKit with Docker

The most convenient way to get started with LiveKit is using its Docker setup. A dedicated Docker image runs all the necessary steps to configure and prepare a full LiveKit server on your system.

Through this segment of the tutorial, follow along to get Docker, apply the appropriation settings on your server, and start up your own LiveKit instance.

### Configuring the Host

Before deploying the LiveKit server, you need to conduct some initial set up with your Compute Instance.

1.  Configure domain names for the LiveKit server and its associated TURN server, both pointing to the instance's public IP address. This entails creating two DNS A/AAAA records.

    - One for the LiveKit server. The examples in this tutorial use `livekit.example.com`.

    - One for the TURN server, bundled with LiveKit to help manage traffic. This tutorial uses `livekit-turn.example.com`.

    One of the easiest ways to complete this setup is using Linode's [DNS Manager](/docs/products/networking/dns-manager/get-started/). Following the guide just linked, add your domain (`example.com`) and create A records for the `livekit` and `livekit-turn` subdomains.

1.  Install the Docker Engine and Docker Compose. To do so, follow the appropriate section of our [How to Use Docker Compose V2](/docs/guides/how-to-use-docker-compose-v2/#how-to-install-docker-compose-and-docker-engine) guide.

### Configuring LiveKit

With the Compute Instance prepared, you can now set up the LiveKit server and install the LiveKit CLI.

#### LiveKit Server

1.  Run LiveKit's Docker set up. Once this starts up, you get a series of prompts to configure the LiveKit instance to your needs.

    ```command
    sudo docker run --rm -it -v$PWD:/output livekit/generate
    ```

1.  Complete the LiveKit setup's prompts as follows.

    - Enter the LiveKit server and TURN domains as created further above
    - Leave the WHIP domain empty
    - Select *Let's Encrypt* for SSL
    - Select *no* for an external Redis — have the installation bundle Redis
    - Select to create a start-up shell script

1.  The process outputs an API key and an API secret. Keep these safe and secure. They are your primary means of interfacing with the LiveKit server later.

    ``` output
    API Key: <LIVEKIT_API_KEY>
    API Secret: <LIVEKIT_API_SECRET>
    ```

1.  The process also outputs a series of ports that need to be opened for the LiveKit server to function. For the set of responses used in this tutorial, the required ports should be:

    - 80 (HTTP)

    - 443 (HTTPS)

    - 7881 (WebRTC TCP)

    - 3478/UDP (TURN UDP)

    - 50000-60000/UDP (WebRTC UDP)

    - 1935 (RTMP for Ingress)

    - 7885/UDP (WebRTC WHIP for Ingress)

1.  Open all of the required ports in your system's firewall. The exact commands to do so vary depending on your distribution and firewall manager. You can see the appropriate section of our guide on [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-firewall) for links to our guides on common firewall managers.

    As an example, here are a series of commands to open the set of ports shown above using the UFW firewall manager.

    ``` command
    sudo ufw allow http
    sudo ufw allow https
    sudo ufw allow 7881/tcp
    sudo ufw allow 3478/udp
    sudo ufw allow 5000:6000/udp
    sudo ufw allow 1935/tcp
    sudo ufw allow 7885/udp
    sudo ufw reload
    ```

1.  Make some modifications to the start-up shell script. By default, the script attempts to install Docker and Docker Compose, which causes issues as your system should already have these. To solve this, open the script file — `livekit.example.com/init_script.sh` — with your preferred text editor, and make the changes described below.

    -   Locate and remove the commands for installing Docker and Docker Compose. Here, the commands have been commented out, using `#`.

        ```file {title="livekit.example.com/init_script.sh" lang="sh"}
        # [...]

        # Docker & Docker Compose will need to be installed on the machine
        #curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
        #sh /tmp/get-docker.sh
        #curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        #chmod 755 /usr/local/bin/docker-compose

        # [...]
        ```

    -   Locate the command that creates the LiveKit systemd service file. Modify the `Exec` lines there to point to your actual Docker location and to use the Docker Compose plugin.

        In this case, the Docker binary is located at `/usr/bin/docker`. And changing the commands from `docker-compose` to `docker compose` adapts the lines to use the Docker Compose plugin rather than the standalone. (But leave the `docker-compose.yaml` name as is.)

        ```file {title="livekit.example.com/init_script.sh" lang="sh"}
        # [...]

        # systemd file
        cat << EOF > /etc/systemd/system/livekit-docker.service
        [Unit]
        Description=LiveKit Server Container
        After=docker.service
        Requires=docker.service

        [Service]
        LimitNOFILE=500000
        Restart=always
        WorkingDirectory=/opt/livekit
        # Shutdown container (if running) when unit is started
        ExecStartPre=/usr/bin/docker compose -f docker-compose.yaml down
        ExecStart=/usr/bin/docker compose -f docker-compose.yaml up
        ExecStop=/usr/bin/docker compose -f docker-compose.yaml down

        [Install]
        WantedBy=multi-user.target

        # [...]
        ```

1.  Run the start-up script. Doing so requires that you first give the script executable permission.

    ```command
    cd livekit.example.com
    sudo chmod +x init_script.sh
    sudo ./init_script.sh
    ```

1.  Give the LiveKit service time to start up all of the necessary components. You can check the progress with the command here.

    ```command
    sudo systemctl status livekit-docker
    ```

1.  Once the components are running, you can verify the LiveKit server with a cURL command.

    ```command
    curl https://livekit.example.com
    ```

    ```output
    OK
    ```

#### CLI

The LiveKit CLI tool offers the most convenient interface for managing and testing your LiveKit server. Though not strictly required, the tool is almost indispensable when setting up your LiveKit stack, including testing the server and generating Ingress and Egress credentials.

To install the LiveKit CLI, use the installation script.

```command
sudo curl -sSL https://get.livekit.io/cli | sudo bash
```

The LiveKit CLI requires your LiveKit server's address, API key, and API secret. A convenient way to provide these is through environment variables, as shown below and assumed for subsequent CLI commands in this tutorial.

The steps below additionally show how to create a user token with CLI. In a production environment, you are likely to leverage LiveKit's API for generating user tokens. But when it comes to generating tokens for testing, the CLI makes a convenient solution.

1.  Store your LiveKit parameters in environment variables. Later sections of the tutorial similarly leverage these stored values.

    In this example, replace the URL with your LiveKit server's. Replace `<LIVEKIT_API_KEY>` and `<LIVEKIT_API_SECRET>` with the API key and API secret output during the LiveKit setup above.

    ```command
    export LIVEKIT_URL=https://livekit.example.com
    export LIVEKIT_API_KEY=<LIVEKIT_API_KEY>
    export LIVEKIT_API_SECRET=<LIVEKIT_API_SECRET>
    ```

1.  Generate a token. The token here designates a room — `example-room` — and a user — `example-user` — both of which get created if they do not exist already. The token is valid for 24 hours, after which the user requires another.

    ```command
    livekit-cli create-token \
        --join --room example-room --identity example-user \
        --valid-for 24h
    ```

Further on, the tutorial uses the CLI to create Ingress credentials for streaming from OBS Studio. The LiveKit CLI [documentation](https://github.com/livekit/livekit-cli) provides more information on this and additional uses for the CLI, such as load testing with simulated streams and subscribers.

#### Initial Test

With the test token from the LiveKit CLI, you can actually conduct a full test of your LiveKit server's streaming. This is done using LiveKit's Meet example application, which essentially provides a frontend for a specified LiveKit server.

1.  Go to the [LiveKit Meet](https://meet.livekit.io/?tab=custom) example application.

1.  Enter your LiveKit server's domain with the WebSocket protocol (`wss://livekit.example.com`) and the user token generated above.

1.  Click **Connect**, and, when prompted, allow access to your camera and microphone.

![LiveKit Meet demo](livekit-meet-demo.png)

## Configuring OBS for Streaming

Open Broadcaster Software (OBS) Studio offers an open-source tool for recording and live-streaming video. Its high-performance, real-time capturing can effectively create custom streams from your device. And OBS Studio readily integrates as an Ingress stream with a LiveKit server.

Follow along with this section of the tutorial to configure LiveKit for Ingress and set up streaming from an OBS Studio instance.

### Configuring the LiveKit Ingress

LiveKit first needs an Ingress instance designated for streaming from OBS Studio. The LiveKit CLI includes a command for creating a new Ingress, and the Ingress can be configured with a short JSON file. You can learn more from LiveKit's [Ingress Overview documentation](https://docs.livekit.io/egress-ingress/ingress/overview/).

1.  Create a JSON configuration file for the Ingress. To start, what follows is a simple Ingress configuration to support an OBS stream. The `"input_type": 0` indicates an RTMP stream, while the remaining parameters name the Ingress, identify the room, and create a participant for content broadcasting.

    ```file {title="ingress.json" lang="json"}
    {
        "input_type": 0,
        "name": "obs-stream",
        "room_name": "example-room",
        "participant_identity": "obs-streamer",
        "participant_name": "OBS Stream"
    }
    ```

1.  Once you have a configuration file, you can create the Ingress with a command like the one below. This example assumes you named your configuration file `ingress.json`, and that you have your LiveKit server's information in environment variables, as shown further above.

    ```command
    livekit-cli create-ingress --request ingress.json
    ```

1.  The CLI outputs information about the Ingress. You need to keep track of two parts of this output in order to configure your OBS Studio stream: the URL and the Stream Key. Examples of these are shown below.

    ```output
    Using url, api-key, api-secret from environment
    IngressID: IN_oQ7SV4GNzdkq Status: ENDPOINT_INACTIVE
    URL: rtmp://livekit.example.com:1935/x Stream Key: 6fBdud6A3NYb
    ```

### Setting Up OBS Studio

On the machine from which you want to stream content — typically your local computer — you need to install the OBS Studio client.

1.  Navigate to the [OBS website](https://obsproject.com/), and download the OBS Studio installer for your system.

1.  Run the installer to get OBS Studio on your system. You may wish to refer to the [OBS Studio Quickstart](https://obsproject.com/wiki/OBS-Studio-Quickstart) guide for more on configuring your OBS Studio installation. However, doing so is not necessary for the example in this tutorial.

1.  Start up OBS Studio. When prompted, grant permissions for OBS to record your screen and access your camera and microphone, as needed for your streaming goals.

1.  During the setup steps, indicate that you are using OBS for streaming. Then, when prompted for stream information, complete the form as follows.

    -   **Service**: *Custom*
    -   **Server**: Your LiveKit's Ingress URL; `rtmp://livekit.example.com:1935/x` from the example output above
    -   **Stream Key**: Your LiveKit's Ingress stream key; `6fBdud6A3NYb` from the example output above

When you have completed the setup, you should be taken to the main OBS Studio dashboard.

### Viewing the Stream

The above gives you a setup ready to start streaming from OBS Studio to a LiveKit room. All you need to do is create your stream in OBS and start streaming.

To see what that can look like, follow along with the steps below to put together a complete simple stream in OBS. Then once again leverage the LiveKit Meet example application to see the stream broadcasting from your LiveKit server.

#### OBS

1.  Add a video source, using the **+** icon in the **Sources** pane. For this example, the tutorial uses the **Text** source with the text `This is a test`. You can, however, use any other source you would like.

1.  Click **Start Streaming** to have OBS begin streaming the source or sources to the LiveKit Ingress.

#### LiveKit Meet

The easiest way to test the stream is using LiveKit Meet, the LiveKit example application used further above to verify the LiveKit setup.

Just as above, visit [LiveKit Meet](https://meet.livekit.io/?tab=custom), enter your LiveKit server URL and a participant token, and then click **Connect**. Make sure that your LiveKit participant token is associated with the same room as the OBS Ingress. This was `example-room` in the examples above.

You should see your participant stream, but also the OBS stream, with video from the source or sources you created.

![LiveKit Meet view of an OBS stream](livekit-meet-obs-stream.png)
