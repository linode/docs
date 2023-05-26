---
description: "Deploy Saltcorn on a Linode Compute Instance. This platform is made for building database web applications without writing a single line of code."
keywords: ['saltcorn','database','development']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2022-02-22
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploy Saltcorn through the Linode Marketplace"
external_resources:
- '[Saltcorn](https://saltcorn.com/)'
aliases: ['/guides/saltcorn-marketplace-app/']
authors: ["Linode"]
---

[Saltcorn](https://saltcorn.com/) is an flexible open source no-code database application builder. You can use it to build web applications based on relational data with flexible views, data types, and layouts.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Saltcorn should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS, Debian 11
- **Recommended plan:** All plan types and sizes can be used.

### Saltcorn Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

### Accessing the Saltcorn App

1.  Open your web browser and navigate to `https://[domain]/`, where *[domain]* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing rDNS.

    ![Screenshot of the URL bar](saltcorn-url.png)

1.  Within the Saltcorn **Create user** page that appears, create your first user account.

    ![The Saltcorn create user page](saltcorn-create-user.png)

1.  After you create the user, you are automatically logged in and the Saltcorn admin dashboard appears.

    ![The Saltcorn admin dashboard](saltcorn-admin.png)

Now that you’ve accessed your dashboard, check out [the official Saltcorn documentation](https://wiki.saltcorn.com/) to learn how to further utilize your Saltcorn instance.

{{< content "marketplace-update-note-shortguide">}}