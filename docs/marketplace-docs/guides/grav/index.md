---
title: "Deploy Grav through the Linode Marketplace"
description: "Learn how to deploy Grav, a modern open source flat-file CMS, on a Linode Compute Instance."
published: 2022-02-22
modified: 2025-04-08
keywords: ['cms','blog','website']
tags: ["marketplace", "linode platform", "cloud manager"]
external_resources:
- '[Grav](https://getgrav.org/)'
aliases: ['/products/tools/marketplace/guides/grav/','/guides/grav-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 970559
marketplace_app_name: "Grav"
---

[Grav](https://getgrav.org/) is a flexible open source flat-file CMS (Content Management System). It can be used by both technical and non-technical people, allowing users to operate in the command line through its own [CLI](https://learn.getgrav.org/17/cli-console/command-line-intro) or in a web browser through its [Admin panel](https://learn.getgrav.org/17/admin-panel/introduction). Page templates in Grav are constructed using the highly customizable [Twig templating engine](https://twig.symfony.com/) and content can be written directly in Markdown. Using Grav also enables you to pull from a plethora of pre-built resources, including [starter templates](https://getgrav.org/downloads/skeletons), unique [themes](https://getgrav.org/downloads/themes), and quite a few [plugins](https://getgrav.org/downloads/plugins). If you need assistance getting started, there is an active [community form](https://discourse.getgrav.org/) and [extensive documentation](https://learn.getgrav.org/17/basics/what-is-grav).

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Grav should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

### Grav Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Accessing the Grav Admin Panel

1.  Open your web browser and navigate to `http://[domain]/admin`, where *[domain]* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). You can also use your IPv4 address, though your connection will not be encrypted. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses and rDNS.

    ![Screenshot of the URL bar with the Grav URL](grav-url.png)

1.  Use the following credentials to log in:
    - **Username:** *admin*
    - **Password:** Enter the password stored in the credentials file on your server. To obtain it, log in to your Compute Instance via SSH or Lish and run:
        ```command
        cat /home/$USER/.credentials
        ```

    ![Screenshot of the Grav login page](grav-login.png)

You're now logged in and on the Admin dashboard. From here, you can fully administer your new Grav site, including creation of content, modification of your configuration, change your theme, and much more.

![Screenshot of the Admin dashboard](grav-admin.png)

Check out [the official Grav documentation](https://learn.getgrav.org/) to learn how to further use your Grav instance.

{{% content "marketplace-update-note-shortguide" %}}