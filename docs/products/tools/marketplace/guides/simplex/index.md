---
title: "Deploy SimpleX Chat on Linode through the Linode Marketplace"
description: 'Deploy SimpleX Chat on Linode through the Linode Marketplace.'
keywords: [ 'simplex','chat', 'server']
tags: ["cloud","linode platform", "marketplace"]
published: 2023-09-15
author:
  name: shum
  email: sh@simplex.chat
external_resources:
- '[SimpleX Official](https://simplex.chat/)'
---

SimpleX Chat is the first messaging platform that has no user identifiers of any kind - 100% private by design.

## Deploying a Marketplace App 

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** SimpleX Chat should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended plan:** We recommend a 4GB Dedicated CPU or Shared Compute instance for SimpleX Chat.

### SimpleX Options

| **Configuration** | **Description** |
|-------------------|-----------------|
| **SMP server password (optional)** | Sets the password for smp-server. |
| **XFTP server quota (optional)** | Sets the file server storage quota in GB. |

### Linode Options

{{< content "marketplace-limited-user-fields-shortguide">}}
{{< content "marketplace-custom-domain-fields-shortguide">}}

## Getting Started after Deployment

Once the SimpleX Server is up and running you can display your SMP and XFTP connection strings with this command on the server:


      docker-compose --project-directory /etc/docker/compose/simplex logs grep 'Server address' | uniq


Please see the following documentation: [SMP Documentation](https://simplex.chat/docs/server.html) and [XFTP Documentation](https://simplex.chat/docs/xftp-server.html)