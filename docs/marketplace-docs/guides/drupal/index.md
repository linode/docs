---
title: "Deploy Drupal through the Linode Marketplace"
description: "Learn how to use the Drupal Marketplace App to easily install the popular open source content management system."
published: 2019-03-25
modified: 2023-09-11
keywords: ['drupal','marketplace', 'cms']
tags: ["cloud-manager","linode platform","drupal","cms","marketplace"]
aliases: ['/products/tools/marketplace/guides/drupal/','/platform/marketplace/deploying-drupal-with-marketplace-apps/','/platform/marketplace/how-to-deploy-drupal-with-marketplace-apps/', '/platform/one-click/deploying-drupal-with-one-click-apps/','/guides/deploying-drupal-with-one-click-apps/','/platform/one-click/how-to-deploy-drupal-with-one-click-apps/','/guides/how-to-deploy-drupal-with-one-click-apps/','/guides/how-to-deploy-drupal-with-marketplace-apps/','/guides/drupal-marketplace-app/']
external_resources:
 - '[Drupal 9 Official Documentation](https://www.drupal.org/docs/understanding-drupal)'
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

[Drupal](https://www.drupal.org/) is a content management system (CMS) designed for building custom websites for personal and business use. Built for high performance and scalability, Drupal provides the necessary tools to create rich, interactive "community" websites with forums, user blogs, and private messaging. Drupal also has support for personal publishing projects and can power podcasts, blogs, and knowledge-based systems, all within a single, unified platform.

In addition to the core infrastructure, there are a number of freely available Drupal modules that allow administrators of Drupal sites to provide additional functionality, and a robust API makes it easy to enable these features. Furthermore, Drupal has an advanced theming engine that allows for a great amount of flexibility for displaying content.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Drupal should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

### Drupal Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.
- **Drupal Site Name** *(required)*: Drupal site name.
- **Drupal Site Email** *(required)*: Site email for system notifications.
- **Drupal Account Email** *(required)*: Account email address for admin user.
- **Drupal User Name** *(required)*: Admin username for Drupal site.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

### Obtain the Credentials

Once the app has been *fully* deployed, you need to obtain the credentials from the server.

1.  Log in to your new Compute Instance using one of the methods below:

    - **Lish Console:** Within Cloud Manager, navigate to **Linodes** from the left menu, select the Compute Instance you just deployed, and click the **Launch LISH Console** button. Log in as the `root` user. See [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH:** Log in to your Compute Instance over SSH using the `root` user. See [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/) for assistance.

1.  Once logged in, access the credentials file by running the following command:

    ```command
    cat /home/$USERNAME/.credentials
    ```

1.  This displays the passwords that were automatically generated when the instance was deployed. Once you save these passwords, you can safely delete this file.

## Getting Started after Deployment

### Access your Drupal Site

1.  Open a web browser and navigate to the domain you entered when creating the instance: `https://domain.tld`. If you did not enter a domain, use your Compute Instance's default rDNS domain (`192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing the rDNS value. Ensure that you are securely accessing the website by prefixing `https` to the URL.

## Software Included

The Drupal Marketplace App installs the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**MariaDB Server**](https://mariadb.org/) | Relational database. |
| [**PHP**](https://www.php.net) | Drupal is written in PHP and requires PHP to operate. |
| [**Apache HTTP Server**](https://httpd.apache.org) | Web Server used to serve the Drupal site. |
| [**Drupal**](https://www.drupal.org/) | Content management system. |

{{% content "marketplace-update-note-shortguide" %}}
