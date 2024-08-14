---
title: "Deploy NirvaShare through the Linode Marketplace"
description: "This guide shows you how to deploy NirvaShare, a simplified and secure enterprise file sharing solution by using the Linode One-Click Marketplace App."
published: 2021-08-13
modified: 2023-10-27
keywords: ['storage','file sharing', 'backups']
tags: ["marketplace", "linode platform", "cloud manager"]
aliases: ['/guides/deploying-nirvashare-marketplace-app/','/guides/nirvashare-marketplace-app/']
external_resources:
- '[NirvaShare](https://nirvashare.com/)'
authors: ["Akamai"]
---

NirvaShare is a simplified and secure enterprise file sharing solution built on top of your existing file storage. Use NirvaShare with SFTP, local storage, or even S3-compatible storage like Linode's [Object Storage](https://www.linode.com/products/object-storage/). Collaborate with your internal or external users such as customers, partners, and vendors. NirvaShare provides fine-tuned access control in a very simplified manner. NirvaShare integrates with multiple many external identity providers such as Active Directory, Google Workspace, AWS SSO, KeyClock, and others.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** NirvaShare should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

### NirvaShare Configuration Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

1. To access the NirvaShare login screen, open your web browser and navigate to `https://DOMAIN/`, where *DOMAIN* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing rDNS.

1. To login, enter `admin` as the *Username* and `admin` as the *Password*.

    ![Nirvashare Login.](nirvashare-login.png)

1. Once logged in, you will want to change the default admin password. You can do so by clicking the icon at the top right of the dashboard and selecting the *Change Password* option as shown in the image below:

    ![Nirvashare Change Password.](nirvashare-changepassword.png)

Now that you’ve accessed your dashboard, see [the official NirvaShare documentation](https://nirvashare.com/setup-guide/) to learn how to further configure your instance.

{{% content "marketplace-update-note-shortguide" %}}