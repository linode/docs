---
title: "Deploy SimpleX Chat on Linode through the Linode Marketplace"
description: 'Deploy SimpleX Chat on Linode through the Linode Marketplace.'
published: 2023-09-15
keywords: [ 'simplex','chat', 'server']
tags: ["cloud","linode platform", "marketplace"]
author:
  name: shum
  email: sh@simplex.chat
external_resources:
- '[SimpleX Official](https://simplex.chat/)'
---

SimpleX Chat is a private messaging platform that uses temporary anonymous identifiers to eliminate the need for long-term user identification. This app deploys a self-hosted SMP relay server used to pass messages in the SimpleX network. It also installs the XFTP server to support XFTP file transfer protocol.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** SimpleX Chat should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended plan:** We recommend a 4GB Dedicated CPU or Shared CPU Compute Instance for SimpleX Chat.

### SimpleX Options

| **Configuration** | **Description** |
|-------------------|-----------------|
| **SMP server password (optional)** | Sets the password for smp-server. |
| **XFTP server quota (optional)** | Sets the file server storage quota in GB. |

### Linode Options

{{< content "marketplace-required-limited-user-fields-shortguide">}}
{{< content "marketplace-custom-domain-fields-shortguide">}}

## Getting Started after Deployment

Once the SimpleX Server is up and running you can display your SMP and XFTP connection strings with the following command while logged into the server:

```command
docker-compose --project-directory /etc/docker/compose/simplex logs grep 'Server address' | uniq
```

To start using your server, you will need to configure it to work with your SimpleX app. Available apps can be downloaded here: [Download SimpleX apps](https://simplex.chat/downloads/)

For more information on configuration and linking the SimpleX app to your SMP server, please see the following documentation from SimpleX:

- [Hosting your own SMP Server](https://simplex.chat/docs/server.html)

- [Hosting your own XFTP Server](https://simplex.chat/docs/xftp-server.html)

{{< content "marketplace-update-note-shortguide">}}