---
title: "Deploy MainConcept Live Encoder through the Linode Marketplace"
description: "Deploy MainConcept Live Encoder, an enterprise ready live encoder, on a Linode Compute Instance.'"
keywords: ['ffmpeg','encoder','video']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2023-09-14
modified_by:
  name: Linode
authors: ["Linode"]
---

[MainConcept Live Encoder](https://www.mainconcept.com/live-encoder) 
is a media encoding platform focused on broadcast and OTT workflows. It utilized MainConcept HEVC and AVC codecs, and ships with a web GUI to streamline packaging common input sources for multiscreen delivery.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** MainConcept Live Encoder should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** CentOS Stream 9
- **Recommended plan:** We recommend a 4GB Dedicated CPU or Shared Compute instance for MainConcept Live Encoder.

### MainConcept Live Encoder Options

{{< content "marketplace-limited-user-fields-shortguide">}}
{{< content "marketplace-custom-domain-fields-shortguide">}}

## Getting Started after Deployment

Now that your MainConcept Live Encoder Marketplace App is deployed, you can log into MainConcept Live Encoder Dashboard.

1. Open a browser and navigate to the domain you created in the beginning of your deployment. If you did not use a Domain, you can use your Compute Instance's rDNS, which may look like `123-0-123-0.ip.linodeusercontent.com`. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/) guide for information on viewing and setting the rDNS value.

2. Once you visit the MainConcept Live Encoder URL, you can enter `admin` as the *username* and `admin` as the *password*. Please ensure you change the default password after logging into your MainConcept Live Encoder instance.

Please visit [MainConcept official documentation](https://www.mainconcept.com/live-encoder). 

{{< content "marketplace-update-note-shortguide">}}