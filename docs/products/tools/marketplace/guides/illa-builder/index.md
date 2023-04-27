---
description: "Deploy Illa Builder, an open-source low-code development tool, on a Linode Compute Instance.'"
keywords: ['Illa','builder','low-code']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2023-05-30
modified_by:
  name: Linode
title: "Deploy Illa Builder through the Linode Marketplace"
authors: ["Linode"]
---

[ILLA Builder](https://github.com/illacloud/illa-builder) is an open-source low-code development tool that allows developers to quickly build internal tools. Illa lets developers focus more on the core functionality of the tools they are building and spend less time on websites and integrations.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Illa Builder should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS, Ubuntu 20.04 LTS
- **Recommended plan:** We recommend a 4GB Dedicated CPU or Shared Compute instance for Illa Builder.

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

### Accessing Illa Builder

1. Open your web browser and navigate to `http://[ip-address]`, where *[ip-address]* is your Compute Instance's IPv4 address. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses. Illa Builder supports setting a custom HTTP port, but will default to 80. 

2. The Illa Builder login page is displayed. After signing in or registering your account you can begin using Illa Builder.

    ![Screenshot of the Illa Builder login](illa-login.png)

3. For additional guidance on using Illa Builder please see the [documentation](https://www.illacloud.com/docs/about-illa).

{{< content "marketplace-update-note-shortguide">}}
