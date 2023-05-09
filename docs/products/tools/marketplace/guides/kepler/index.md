---
description: "This guide shows how to install Kepler, a powerful drag-and-drop WordPress website builder that is highly customizable, using the One-Click Marketplace App"
keywords: ['wordpress','wp cli','marketplace apps', 'cms', 'deploy wordpress with marketplace', 'easy install wordpress', kepler]
tags: ["debian","cloud manager","linode platform","cms","wordpress","marketplace","ssl","web applications", kepler]
published: 2021-01-09
modified: 2022-05-17
modified_by:
  name: Linode
title: "Deploy Kepler through the Linode Marketplace"
aliases: ['/guides/deploy-kepler-with-marketplace-apps/','/guides/kepler-marketplace-app/']
external_resources:
- '[About Kepler](https://kepler.app)'
- '[Kepler Community](https://help.kepler.app)'
authors: ["Linode"]
---

[Kepler](https://www.kepler.app) is a powerful drag & drop WordPress website builder with all-new website style filters that instantly change the look and feel of your website.

{{< note >}}
Kepler requires a valid license to use the software beyond the initial 14 day free trial period. To purchase a license, visit [Kepler's website](https://kepler.app/pricing.php) and select a plan that fits your needs. Licenses are not available directly through Linode.
{{< /note >}}

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Kepler should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Debian 10
- **Recommended minimum plan:** All plan types and sizes can be used.

### Kepler Options

- **Email address** *(required)*: Enter the email address you wish to use when configuring the WordPress admin user, generating SSL certificates, and optionally creating DNS records for a custom domain.
- **Admin Username** *(required)*: Username for your WordPress admin user account.
- **Admin Password** *(required)*: Password for your WordPress admin user account.
- **MySQL `root` password** *(required)*: The root password for your MySQL database.
- **WordPress Database Password** *(required)*: The root password for your WordPress database.
- **Website Title:** Enter a title for your WordPress site.

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

#### Additional Security Options (Optional)

- **Configure automatic security updates:** Select `Yes` to have the system automatically update WordPress with the latest security updates. Select `No` to if you wish to manage all updates manually.
- **Use fail2ban to prevent automated intrusion attemps?** Select `Yes` to install fail2ban. Select `No` to not install fail2ban during installation. You [can install this at a later time](/docs/products/compute/compute-instances/guides/set-up-and-secure/#use-fail2ban-for-ssh-login-protection).

{{< content "marketplace-custom-domain-fields-shortguide">}}
- **Do you need an MX record for this domain?** Check `Yes` if you plan on using WordPress to send email. The installer, along with your `API Token` (required) sets up the necessary MX records in the DNS Manager. Select `No` if you do not plan on using WordPress to send email. You can [add an MX record manually](/docs/guides/dns-overview/#mx) at a later time if you change your decision.
- **Do you need an SPF record for this domain?** Check `yes` if you plan on using WordPress to send email. The installer, along with your `API Token` (required) sets up the necessary SPF records in the DNS Manager. Select `No` if you do not plan on using WordPress to send email. You can [add an SPF record manually](/docs/guides/dns-overview/#spf) at a later time if you change your decision.
- **Would you like to use a free Let's Encrypt SSL certificate?** Select `Yes` if you would like the install to create an SSL certificate for you, or `No` if you do not. You cannot create secure, encrypted conferences without an SSL certificate.

## Getting Started After Deployment

### Access Your WordPress Site

After Kepler has finished installing, you can access your WordPress site by copying your Linode's IPv4 address and entering it in the browser of your choice. If you've set up DNS during installation, you can go to your domain name in the browser. To find your Linode's IPv4 address:

1. Click on the **Linodes** link in the sidebar to see a list of all your Linodes.

1. Find the Linode you just created when deploying your app and select it.

1. Navigate to the **Networking** tab.

1. Your IPv4 address is listed under the **Address** column in the **IPv4** table.

1. Copy and paste the IPv4 address into a browser window. You should see your WordPress site's home page.

### Software Included

The WordPress Marketplace App installs the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**MySQL Server**](https://www.mysql.com/) | Relational database. |
| [**PHP 7**](https://www.php.net/) | WordPress is written in PHP and requires PHP to operate. |
| [**Apache HTTP Server**](https://httpd.apache.org/) | Web server used to serve the WordPress site. |
| [**WordPress**](https://wordpress.org/) | Content management system. |
| [**WP CLI**](https://wp-cli.org/) | The command line interface for WordPress. |

{{< content "email-warning-shortguide" >}}

{{< content "marketplace-update-note-shortguide">}}
