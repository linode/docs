---
title: "Deploy Peppermint through the Linode Marketplace"
description: "This guide shows how to install Peppermint, a ticket management system that allows teams to create tickets, and more, with the Linode One-Click Marketplace."
published: 2021-03-31
modified: 2023-10-27
keywords: ["ticket management", "marketplace"]
tags: ["marketplace", "linode platform", "cloud manager"]
aliases: ['/guides/deploy-peppermint-with-marketplace-apps/','/guides/peppermint-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

[Peppermint Ticket Management](https://peppermint.sh/) is a ticket management system that allows teams and solo users the ability create & track tickets, to-do items, and more. The project is meant to provide help desks and services desks manage internal and customer requests, but Peppermint is a good solution for anyone looking for a ticket management system that is free and easy to use.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Peppermint should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Peppermint options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

### Access your Peppermint App

1. To access the Peppermint login screen, open your web browser and navigate to `https://DOMAIN/`, where *DOMAIN* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing rDNS.

    ![Peppermint login screen](peppermint.png)

    The default credentials to log in to your Peppermint Ticket Management Panel are:

       Email: admin@admin.com
       Password: 1234

1. Once you log in to the Peppermint Ticket Management Panel, update the email and password you used to log in. To do this, click the Settings gear logo in the top right corner.

![peppermint_settings.png](peppermint_settings.png)

For more on Peppermint, consult the following resources:

- [Peppermint Github](https://github.com/Peppermint-Lab/Peppermint/blob/master/README.md)
- [Peppermint Documentation](https://docs.peppermint.sh/)

{{% content "marketplace-update-note-shortguide" %}}