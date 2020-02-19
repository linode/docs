---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide will explain how to set up and run a self-hosted instance of the bitwarden_rs password manager.'
keywords: ['security', 'web application', 'password', 'bitwarden']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-02-24
published: 2020-02-24
modified_by:
  name: Linode
title: "How to Self-Host the bitwarden_rs Password Manager"
h1_title: "Self-Host the bitwarden_rs Password Manager"
contributor:
  name: Tyler Langlois
  link: https://tjll.net
draft: true
---

[Bitwarden](https://bitwarden.com/) is an open source password management application that can be self-hosted and run on your own infrastructure. The [bitwarden_rs](https://github.com/dani-garcia/bitwarden_rs) project provides a lightweight, single-process, API-compatible service ideal for running personal instances. By running your own bitwarden_rs service, you can use Bitwarden browser extensions and mobile applications backed by your own server.

{{< note >}}
By self-hosting your own password manager, you are taking on the responsibility for the security and resiliency of the passwords stored within bitwarden_rs. Before storing important information and credentials within the application, ensure that you are confident with the security of your server and have taken the necessary backup measures mentioned in this tutorial.
{{</ note >}}

## In this Guide

This guide will use the bitwarden_rs [Docker image](https://github.com/dani-garcia/bitwarden_rs/wiki/Which-container-image-to-use) in order to run an instance of the service. A reverse proxy ([Caddy](https://caddyserver.com/)) will be configured in front of the Docker container and provide TLS termination for both the web-based vault interface as well as the websocket server.

This configuration of bitwarden_rs will also use the default SQL backend for the application (sqlite3). The SQL datastore backing bitwarden_rs contains the user data for the application and is therefore the primary concern for a backup scheme to ensure that sensitive data stored within bitwarden_rs is saved in the event of a data loss scenario.

The version of bitwarden_rs that this guide references is 1.13.1, which is the latest version at the time of writing. As part of regular maintenance and to ensure that any relevant security updates are applied to the application, ensure that you follow the [upgrade instructions](https://github.com/dani-garcia/bitwarden_rs/wiki/Updating-the-bitwarden-image) provided by the project regularly to keep your deployment up to date with current upstream releases.

Because this guide uses the Docker image for bitwarden_rs, no assumptions are made about the choice of Linux distribution. Aside from installing the system packages for Docker and Caddy, these instructions should apply equally to Debian-based distributions, Red Hat-based distributions, or similar distributions that provide the underlying required packages.

### Before you Begin

1. Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

1. Follow the "[How to Secure Your Server](/docs/security/securing-your-server/)" guide in order to properly harden your Linode against malicious users.

1. Make sure you have registered a Fully Qualified Domain Name (FQDN) and set up [A and AAAA](/docs/networking/dns/dns-records-an-introduction/#a-and-aaaa) DNS records that point to your Linode's public [IPv4 and IPv6 addresses](/docs/getting-started/#find-your-linode-s-ip-address). Consult our [DNS Records: An Introduction](/docs/networking/dns/dns-records-an-introduction/) and [DNS Manager](/docs/platform/manager/dns-manager/) guides for help with setting up a domain.

1. Install and configure Docker according to the steps for your chosen Linux distribution. Linode provides a general-purpose guide covering both Ubuntu and CentOS in [this guide](/docs/applications/containers/what-is-docker/).

## Install bitwarden_rs

This section will outline how to download the bitwarden_rs Docker image, setup volume persistence, and manage the Docker container.

1. Pull the bitwarden_rs image.

        sudo docker pull bitwardenrs/server:1.13.1

1. Select the desired filesystem path to store application data. In this guide, the path `/srv/bitwarden` will be used. Create the directory if necessary, and enforce strict permissions for the root user only.

        sudo mkdir /srv/bitwarden
        sudo chmod go-rwx /srv/bitwarden

1. Create the Docker container for bitwarden_rs.

        sudo docker run -d --name bitwarden -v /srv/bitwarden:/data -e WEBSOCKET_ENABLED=true -p 127.0.0.1:80:80 -p 127.0.0.1:3012:3012 --restart=on-failure bitwardenrs/server:1.13.1

    This command uses the following flags to establish a persistent container to serve the bitwarden_rs application:
    
    - `-d` daemonizes the container to run in the background.
    - Using `--name bitwarden` gives the container a human-readable name to avoid the need to reference the running container by a temporary identifier.
    - By passing the host path `/srv/bitwarden` to the volume (`-v`) flag, data will be persisted outside of the container whenever it is stopped.
    - The environment variable `WEBSOCKET_ENABLED` enables the extra websocket server for bitwarden_rs.
    - Each `-p` flag forwards the respective host ports to the container (port 80 for the main bitwarden_rs web service and port 3012 for websocket traffic).
    - `--restart=on-failure` ensures that the container remains up in the event of container failure or host restart.

   As part of these steps, note that the container will listen for traffic on the local loopback interface (`127.0.0.1`) and _not_ a publicly reachable IP address. This is to ensure that any traffic originating from outside the host must connect to the Caddy server, which will enforce encrypted TLS connections.
    
## Configure Caddy as a Reverse Proxy

External clients will communicate with Caddy, which will automatically manage reverse proxying websocket traffic. Caddy will also provision as well as renew TLS certificates via Let's Encrypt automatically.

1. Install Caddy following the instructions in the [Install and Configure Caddy on CentOS 7](/docs/web-servers/caddy/install-and-configure-caddy-on-centos-7/) guide.

1. Create the following Caddyfile. Be sure to replace `example.com` with the name of your domain that you set up in the "Before You Begin" section of this guide. This domain will be where the web interface for bitwarden_hs hosted and secured by Caddy's automatic TLS.
