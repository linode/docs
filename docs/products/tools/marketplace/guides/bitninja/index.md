---
description: "Deploy BitNinja on a Linode Compute Instance. This provides you with a general purpose security-as-a-service server defense tool powered by a social defense system."
keywords: ['spam','security','waf']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2021-11-12
modified: 2024-01-22
modified_by:
  name: Linode
title: "Deploy BitNinja through the Linode Marketplace"
external_resources:
- '[BitNinja](https://bitninja.com/)'
aliases: ['/guides/deploying-bitninja-marketplace-app/','/guides/bitninja-marketplace-app/']
authors: ["Linode"]
_build:
  list: false
noindex: true
deprecated: true

---
{{< note type="warning" title="This app is no longer available for deployment" >}}
BitNinja is no longer a deployable app in the App Marketplace, and this guide is for referential purposes only.
{{< /note >}}

[BitNinja](https://bitninja.com/) is a general purpose security-as-a-service server defense tool powered by a social defense system and many active defense modules. Its main purpose is to protect your server against hackers, botnets, attackers, and malicious activities, all with less effort and maintenance on your part. All BitNinja servers form a huge honey farm to collect and analyze attacks from different botnets and then use this knowledge to intelligently adapt to new threats.

{{< note >}}
BitNinja requires a valid license to use the software beyond the initial 7 day [free trial](https://registration.bitninja.io/) period. To purchase a license, visit [BitNinja's website](https://bitninja.com/pricing/) and select a plan that fits your needs. Licenses are not available directly through Linode.
{{< /note >}}

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** BitNinja should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** CentOS 7, Debian 11, Debian 10, Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

### BitNinja Options

- **License Key** *(required)*: Enter the license key for your BitNinja instance. You can purchase your license at https://bitninja.com/pricing/.

## Getting Started after Deployment

### Accessing the BitNinja App

Now that you’ve deployed your BitNinja instance, check out [the official BitNinja documentation](https://doc.bitninja.io/docs/command_line_interface#usage) to learn how to further utilize your BitNinja instance.

{{< content "marketplace-update-note-shortguide">}}