---
author:
  name: Angel
  email: docs@linode.com
description: "Nextcloud is an open source solution to hosting your own content online. In addition to the total control users gain over their own files, Nextcloud offers customizable security features that allow the user to take control of sharing and access privileges."
og_description: "Nextcloud 13 Brings Improved UI, video and text chat, and end-to-end encryption wrapped into a cloud storage platform. This guide will walk you through installing Nextcloud 13 using Docker."
keywords: ["nextcloud", "cloud", "open source hosting", "video chat"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-03-14
modified: 2018-03-07
modified_by:
  name: Angel
title: 'Install NextCloud 13'
external_resources:
  - '[Nextcloud Docker Image Documentation](https://github.com/nextcloud/docker)'
---

Nextcloud 13 is a cloud storage platform that also offers users the ability to self-host a video and text chat platform, featuring end-to-end encryption. This guide will walk you through setting up Nextcloud, and show how to use the video chat platform built into the latest release.

## Install Docker CE

You will need a Linode with Docker CE installed to follow along with the steps in this guide.

{{< content "install_docker_ce.md" >}}

## Install Nextcloud 13 and Talk

### Nextcloud

1. Pull and run the Nextcloud image:

        docker run -d -p 8080:80 nextcloud

2.  In a browser, navigate to port 8080 on your Linode (e.g. `192.0.2.0:8080`) to launch the Nextcloud console.

3. Create an admin account when prompted:

![Admin_account_creation](/docs/assets/docker_nextcloud/admin_creation.png)

### Talk

**Talk** is the video chat platform add-on offered by Nextcloud. It's built on [Spreed](https://github.com/nextcloud/spreed).

1. From the Nextcloud console main page, click the **Settings** icon on the right side of the navigation bar. Choose **+ Apps**.

2.  Install the Talk add-on. It is located in the **Social & communication** section; select the app and click **Enable**.

![talk_addon](/docs/assets/docker_nextcloud/talk_addon.png)

### How to Use Talk

Nextcloud 13 offers a full suite of addons. Talk works by allowing all the users that are registered to your Nextcloud instance to communicate with each other. Nextcloud Talk offers simple text chat, private or group password protected calls, and screen sharing. Nextcloud Talk is built using [WebRTC](https://simplewebrtc.com/), and works in your browser. Navigate to the **Users** section of the Nextcloud interface, and create logins for your team to use. After the logins are distributed to your team members, they will be able to communicate with each other.

1.  Choose **Users** from the settings menu and add one or more additional users. Give the username and password combinations to each user and have them log in by accessing the web console from their browsers.

2.  Once Talk is installed, an icon for the addon will appear on the nav menu:

    ![Talk Menu Icon](/docs/assets/docker_nextcloud/navbar-talk-icon.png)

3.  Click this icon to enter Talk and allow the use of your system's camera and microphone when prompted. Once this is done, you will be able to start a chat or video call with any of the users you have created.

  {{< note >}}
The basic configuration here will allow you to make video calls on Firefox. Google Chrome requires an HTTPS connection in order to allow access to the camera and microphone. To do this, you should place Nextcloud behind a [reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/.
{{< /note >}}

## Docker Compose

The basic Nextcloud Docker image is already configured for persistent data in the event that your container crashes. However,  Docker Compose makes it easy to launch a configuration using a separate database container and persistent data volume, which will keep your data consistent through upgrades and automatically handle all container restarts.

### Install Docker Compose

{{< content "install_docker_compose.md" >}}

### Create docker-compose.yaml

1.  In a text editor, create `docker-compose.yaml` and add the following configuration (from the [Nextcloud Github repo](https://github.com/nextcloud/docker)). Fill in the `MYSQL_ROOT_PASSWORD` and `MYSQL_PASSWORD` with suitable values.

    {{< file "docker-compose.yaml" yaml >}}
  version: '2'

  volumes:
    nextcloud:
    db:

  services:
    db:
      image: mariadb
      restart: always
      volumes:
        - db:/var/lib/mysql
      environment:
        - MYSQL_ROOT_PASSWORD=
        - MYSQL_PASSWORD=
        - MYSQL_DATABASE=nextcloud
        - MYSQL_USER=nextcloud

    app:
      image: nextcloud
      ports:
        - 8080:80
      links:
        - db
      volumes:
        - nextcloud:/var/www/html
      restart: always
{{< /file >}}

2.  Stop the container from the previous section if it is still running using `docker stop` and the container name or ID.

3.  Launch the Docker Compose configuration:

      docker-compose up -d

    Nextcloud should be available at port 8080 on your Linode's public IP address.

4.  When creating an admin account, open the **Storage & database** drop-down menu, fill in the information as shown below, and enter the MySQL password you used in the `docker-compose` file.

    ![Nextcloud Database Connection](/docs/assets/docker_nextcloud/connect-mysql-container.png)

{{< caution >}}
The setup provided by Nextcloud does not include any SSL encryption. To secure your data and communications, the Nextcloud service should be placed behind a [reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/). A Docker Compose file using a NGINX reverse proxy and Let's Encrypt is also [available](https://github.com/nextcloud/docker/blob/master/.examples/docker-compose/with-nginx-proxy/mariadb/apache/docker-compose.yml).
{{< /caution >}}
