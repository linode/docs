---
slug: how-to-deploy-jitsi-with-marketplace-apps
author:
  name: Linode
  email: docs@linode.com
description: 'Jitsi is an open source suite that helps you host your own virtual video conferences. Follow this guide to deploy Jitsi on Linode using Marketplace Apps.'
og_description: 'Jitsi is an open source suite that helps you host your own virtual video conferences. Follow this guide to deploy Jitsi on Linode using Marketplace Apps.'
keywords: ['jitsi','marketplace', 'server']
tags: ["ubuntu","marketplace", "web applications","linode platform", "cloud manager", "ssl"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-09-28
modified: 2020-12-04
modified_by:
  name: Linode
title: "How to Deploy Jitsi with Marketplace Apps"
h1_title: "Deploying Jitsi with Marketplace Apps"
contributor:
  name: Linode
external_resources:
- '[About Jitsi](https://jitsi.org/about/)'
- '[Jitsi Documentation](https://jitsi.github.io/handbook/docs/intro)'
- '[Scale Your Jitsi Setup](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-scalable)'
aliases: ['/platform/marketplace/how-to-deploy-jitsi-with-marketplace-apps/', '/platform/one-click/how-to-deploy-jitsi-with-one-click-apps/']
---

## Jitsi Marketplace App

[Jitsi](https://jitsi.org) is a suite of open source projects that allows you to host your own virtual video conferences.

## Deploy Jitsi with Marketplace Apps

{{< content deploy-marketplace-apps >}}

### Jitsi Options

The Jitsi Marketplace form includes advanced fields to setup your Jitsi server's domain records and a free Let's Encrypt SSL certificate. These are optional configurations and are not required for installation.

{{< note >}}
To use Jitsi with encrypted connections, you need an SSL certificate. If you choose to create the free SSL certificate during setup, you must have a fully qualified domain name registered prior to installation.

If Jitsi is not created with the SSL option enabled, it uses a self-signed certificate which may trigger an `invalid certificate` response in some browsers.
{{</ note >}}

| **Field** | **Description** |
|:--------------|:------------|
| **The hostname for your server** | The [hostname](/docs/guides/getting-started/#set-the-hostname) for the server. The default value "meet" is filled in when you select Jitsi from the Marketplace Apps; feel free to change this. |
| **Your domain** | The domain name where you wish to host your Jitsi server. For example, `example.com`. |
| **Your Linode API Token.** | Your Linode API access token is needed to create your DNS records and to create the Let's Encrypt SSL certificate. If you don't have a token, you must [create one](/docs/guides/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Would you like to use a free Let's Encrypt SSL certificate?** | Select `Yes` if you would like the install to create an SSL certificate for you, or `No` if you do not. You cannot create secure, encrypted conferences without an SSL certificate. If `No` is selected, the Jitsi app triggers security warnings in most web browsers. |
| **Admin Email for Let's Encrypt certificate** | The email you wish to use for the SSL certificate. This email address receives notifications when the certificate needs to be renewed. |

{{< note >}}
If you enter a domain name, the address to access Jitsi is `hostname`.`domain name`. For example, if you kept the default hostname, `meet`, and your domain name is `example.com`, to access Jitsi, the address is: `https://meet.example.com`.
{{</ note >}}

### Linode Options

After providing the app-specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|-------------------|-----------------|
| **Select an Image** | Ubuntu 20.04 LTS is currently the only image supported by Jitsi Marketplace Apps, and it is pre-selected on the Linode creation page. *Required* |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/guides/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/guides/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/guides/how-to-choose-a-linode-plan/#hardware-resource-definitions). The Linode plan that you select should be appropriate for the amount of data transfer, users, and other stress that may affect the performance of your server. We recommend you create at least a Linode 8GB. If you want to host large meetings, or many simultaneous meetings, consider a larger and/or dedicated plan. *Required* |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name is how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required* |

When you've provided all required Linode Options, click on the **Create** button. **Your Jitsi app will complete installation anywhere between 3-5 minutes after your Linode has finished provisioning**.

## Getting Started After Deployment

Jitsi is now installed and ready to use.

1.  Before you go to your app, if you filled out the optional Jitsi configuration fields:

    - In the Cloud Manager [DNS Manager](/docs/guides/dns-manager/#add-a-domain) there is now an entry for your domain with two `A/AAAA` records pointing to your new server. One for the domain name and one for the hostname.
    - [Configure the rDNS](/docs/guides/configure-your-linode-for-reverse-dns/) on your Linode.

1.  If you didn't setup a domain, navigate to the rDNS address of the Linode in your browser. You can find the rDNS address in the **Networking** tab for your Linode in the [Cloud Manager](https://cloud.linode.com). If you did setup a domain, navigate to the address as described in the [Jitsi Options](#jitsi-options) section above.

1.  Jitsi prompts you to start a meeting.

!["Jitsi Start a Meeting"](jitsi-start-a-meeting.png "Jitsi Start a Meeting")

### Software Included

The Jitsi Marketplace App installs the following software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Jitsi Meet**](https://jitsi.org/jitsi-meet) | The WebRTC compatible JavaScript application that enables the video conferencing.|
| [**Jitsi Videobridge (jvb)**](https://jitsi.org/jitsi-videobridge) | WebRTC compatible server that routes the video streams between participants in the conference. |
| [**Jitsi Conference Focus (jicofo)**](https://github.com/jitsi/jicofo) | The server-side focus component that manages sessions between participants. |
| [**Jitsi Gateway to SIP (jigasi)**](https://github.com/jitsi/jigasi) | A server-side application enabling regular SIP clients to join the conference. |
| [**Jibri**](https://github.com/jitsi/jibri) | Tools for recording and streaming the conference. |
| [**Prosody**](https://prosody.im/) | XMPP server for signalling. |

{{< content "marketplace-update-note">}}
