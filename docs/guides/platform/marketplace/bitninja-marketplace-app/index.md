---
slug: {{ path.Base .File.Dir }}
author:
  name: Linode Community
  email: docs@linode.com
description: "A general purpose security-as-a-service server defense tool powered by a social defense system and many active defense modules."
keywords: ['spam','security','waf']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: {{ now.Format "2006-01-02" }}
modified_by:
  name: Linode
title: "Deploying BitNinja through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
external_resources:
- '[BitNinja](https://bitninja.io/)'
---

BitNinja is a general purpose security-as-a-service server defense tool powered by a social defense system and many active defense modules. Its main purpose is to protect your server with less effort and maintenance from you. BitNinja does its job silently in the dark and using powerful tools - just like a ninja :-) BitNinja fights against hackers, botnets, attackers, and malicious activities. All of the Ninja servers form a huge honey farm to collect and analyze attacks from different botnets and then use this knowledge to form an even harder shield for all the Ninja servers.

### Deploying the BitNinja Marketplace App

<!-- shortguide used by every Marketplace app to describe how to deploy from the Cloud Manger -->

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 5-10 minutes after the Linode has finished provisioning.**

### BitNinja Options
<!-- The following table has three parts. The UDF name, in bold and in one column, followed by
     UDF description in the second column. The description is in normal text, with an optional
     "Required." tag at the end of the description, in italics, if the field is mandatory. -->
Here are the additional options available for this Marketplace App:

| **Field** | **Description** |
|:--------------|:------------|
| **License Key** | Enter the license key for your BitNinja instance. You can purchase your license at https://bitninja.io/pricing/ |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** CentOS 7, Debian 11, Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment
<!-- the following headings and paragraphs outline the steps necessary
     to access and interact with the Marketplace app. -->
### Accessing the BitNinja App

Now that you’ve deployed your BitNinja instance, checkout [the official BitNinja documentation](https://doc.bitninja.io/command_line_interface.html#usage) to learn how to further utilize your BitNinja instance.

<!-- the following shortcode informs the user that Linode does not provide automatic updates
     to the Marketplace app, and that the user is responsible for the security and longevity
     of the installation. -->
{{< content "marketplace-update-note-shortguide">}}