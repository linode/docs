---
title: "Deploy Jitsi Cluster through the Linode Marketplace"
description: "Jitsi is an open source suite that helps you host your own virtual video conferences. Follow this guide to deploy Jitsi on Linode using Marketplace Apps."
published: 2024-04-26
keywords: ['jitsi','marketplace', 'server']
tags: ["ubuntu","marketplace", "web applications","linode platform", "cloud manager", "ssl", "education"]
external_resources:
- '[About Jitsi](https://jitsi.org/about/)'
- '[Jitsi Documentation](https://jitsi.github.io/handbook/docs/intro)'
- '[Scale Your Jitsi Setup](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-scalable)'
aliases: ['/products/tools/marketplace/guides/jitsi-cluster/']
authors: ["Akamai"]
contributors: ["Akamai"]
---

## Cluster Deployment Architecture

!["Jitsi Cluster Architecture"](jitsi-cluster.png "Jitsi Cluster Architecture")

[Jitsi](https://jitsi.org) is a suite of open source projects that lets you host your own virtual video conferences.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Jitsi cluster should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Suggested minimum plan:** All plan types and sizes can be used. For best results, use a 8GB Dedicated CPU or Shared Compute Instance when hosting large meetings or multiple simultaneous meetings.

### Jitsi Options

{{% content "marketplace-custom-domain-fields-shortguide" %}}
- **Admin Email for the Jitsi server**

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started After Deployment

Jitsi is now installed and ready to use.

1.  Before you go to your app, if you filled out the optional Jitsi configuration fields:

    - In Cloud Manager's [DNS Manager](/docs/products/networking/dns-manager/guides/create-domain/) there is now an entry for your domain with two `A/AAAA` records pointing to your new server. One for the domain name and one for the hostname.
    - [Configure the rDNS](/docs/products/compute/compute-instances/guides/configure-rdns/) on your Linode.

1.  If you didn't setup a domain, navigate to the rDNS address of the Linode in your browser. You can find the rDNS address in the **Networking** tab for your Linode in [Cloud Manager](https://cloud.linode.com). If you did setup a domain, navigate to the address as described in the [Jitsi Options](#jitsi-options) section above.

1.  Jitsi prompts you to start a meeting.

!["Jitsi Start a Meeting"](jitsi-start-a-meeting.png "Jitsi Start a Meeting")

## Software Included

The Jitsi Marketplace App installs the following software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Jitsi Meet**](https://jitsi.org/jitsi-meet) | The WebRTC compatible JavaScript application that enables the video conferencing.|
| [**Jitsi Videobridge (jvb)**](https://jitsi.org/jitsi-videobridge) | WebRTC compatible server that routes the video streams between participants in the conference. |
| [**Jitsi Conference Focus (jicofo)**](https://github.com/jitsi/jicofo) | The server-side focus component that manages sessions between participants. |
| [**Prosody**](https://prosody.im/) | XMPP server for signalling. |

{{% content "marketplace-update-note-shortguide" %}}
