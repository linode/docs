---
title: "Deploy Focalboard through the Linode Marketplace"
description: "Deploy Focalboard on a Linode Compute Instance. This provides you with an open source alternative to the popular project management tool Trello."
published: 2022-02-22
modified: 2023-10-27
keywords: ['focalboard','project','productivity','kanban']
tags: ["marketplace", "linode platform", "cloud manager"]
external_resources:
- '[Focalboard](https://www.focalboard.com/)'
aliases: ['/products/tools/marketplace/guides/focalboard/','/guides/focalboard-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 971045
marketplace_app_name: "Focalboard"
---

[Focalboard](https://www.focalboard.com/) is an open source alternative to project management tools such as Asana, Trello, and Notion. It helps teams, individuals, and developers stay aligned and organized on their everyday tasks. With Focalboard, you can reach milestones, keep track of project notes, and achieve goals.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Focalboard should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

### Focalboard Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Accessing the Focalboard App

1.  Open your web browser and navigate to `https://DOMAIN/`, where *DOMAIN* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing rDNS.

    ![Screenshot of the URL bar](focalboard-url.png)

1.  On the Focalboard login page that appears, click the *create an account* link.

    ![The Focalboard login page](focalboard-login.png)

1.  Complete the sign-up form and click the **Register** button.

    ![The Focalboard registration page](focalboard-create-account.png)

1.  You are automatically logged in and the **Create Board** screen should display.

    ![The Focalboard Create a Board page](focalboard-create-board.png)


Now that you’ve accessed your dashboard, check out [the official Focalboard documentation](https://www.focalboard.com/guide/user/) to learn how to further use your Focalboard instance.

{{% content "marketplace-update-note-shortguide" %}}