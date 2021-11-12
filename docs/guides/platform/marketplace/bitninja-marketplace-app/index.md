---
slug: bitninja-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "Deploy BitNinja on a Linode Compute Instance. This provides you with a general purpose security-as-a-service server defense tool powered by a social defense system."
keywords: ['spam','security','waf']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-12
modified_by:
  name: Linode
title: "Deploying BitNinja through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
external_resources:
- '[BitNinja](https://bitninja.io/)'
noindex: true
_build:
  list: false
---

BitNinja is a general purpose security-as-a-service server defense tool powered by a social defense system and many active defense modules. Its main purpose is to protect your server against hackers, botnets, attackers, and malicious activities, all with less effort and maintenance on your part. All BitNinja servers form a huge honey farm to collect and analyze attacks from different botnets and then use this knowledge to intelligently adapt to new threats.

## Deploying the BitNinja Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 5-10 minutes after the Linode has finished provisioning.**

## Configuration Options

### BitNinja Options

Here are the additional options available for this Marketplace App:

| **Field** | **Description** |
|:--------------|:------------|
| **License Key** | Enter the license key for your BitNinja instance. You can purchase your license at https://bitninja.io/pricing/ |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** CentOS 7, Debian 11, Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Accessing the BitNinja App

Now that you’ve deployed your BitNinja instance, check out [the official BitNinja documentation](https://doc.bitninja.io/command_line_interface.html#usage) to learn how to further utilize your BitNinja instance.

{{< content "marketplace-update-note-shortguide">}}