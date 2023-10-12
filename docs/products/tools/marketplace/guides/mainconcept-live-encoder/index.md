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

[MainConcept Live Encoder](https://www.mainconcept.com/live-encoder) is a media encoding platform focused on broadcast and OTT workflows. Live Encoder utilizes MainConcept HEVC and AVC codecs, and ships ready-to-use with a web GUI to streamline packaging common input sources for multi-screen delivery.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** MainConcept Live Encoder should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** CentOS Stream 9
- **Recommended plan:** We recommend a 4GB Dedicated CPU or Shared CPU Compute Instance for MainConcept Live Encoder.

### MainConcept Live Encoder Options

- **Email address for SSL Generation (Required):** This is the contact email address used for communication regarding the SSL certificate created during deployment. This should be the email address of your web server administrator.

{{< content "marketplace-limited-user-fields-shortguide">}}
{{< content "marketplace-custom-domain-fields-shortguide">}}

## Getting Started after Deployment

Once your MainConcept Live Encoder Marketplace App is deployed, you can log into the MainConcept Live Encoder Dashboard in your browser.

1. Open a browser and navigate to the domain you created in the beginning of your deployment. If you did not use a domain, you can use your Compute Instance's rDNS, which may look like the example below:

    ```
    203-0-113-1.ip.linodeusercontent.com
    ```

    See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/#configuring-rdns) guide for information on viewing and configuring your rDNS.

2. Once the login prompt loads, enter `admin` as the *Username* and `admin` as the *Password*.

    ![MainConcept Live Encoder Login](mainconcept-live-encoder-login.jpg "MainConcept Live Encoder Login")

    {{< note type="warning" title="Important">}}
    Please ensure you change the default password after logging into your MainConcept Live Encoder instance. To change your password, select the **Users** tab, find your user named "admin", and click the **Op** option.
    {{< /note >}}

## Next Steps

Please see [the official documentation for MainConcept Live Encoder](https://www.mainconcept.com/live-encoder) for more information on usage and resources.

{{< content "marketplace-update-note-shortguide">}}