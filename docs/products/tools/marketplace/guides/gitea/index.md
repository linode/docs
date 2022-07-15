---
author:
  name: Linode
  email: docs@linode.com
description: "This is a step-by-step guide on how to deploy the Gitea application, a community managed, self-hosted Git service, by using the Linode One-Click App Marketplace."
keywords: ['Gitea','version control','git']
tags: ["linode platform","version control system","marketplace","cloud-manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-01-04
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploying Gitea through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[Gitea Documentation](https://docs.gitea.io/)'
aliases: ['/guides/deploy-gitea-with-one-click-apps/', '/guides/deploy-gitea-with-marketplace-apps/', '/guides/deploy-Gitea-with-marketplace-apps/','/guides/gitea-marketplace-app/']
---

[Gitea](https://gitea.io/) is a community managed, painless, self-hosted Git service. Gitea is a complete solution for all aspects of your software development. At its core, Gitea serves as your centralized remote Git repository. Gitea also features built-in tools that represent every task in your development workflow, from planning to testing to releasing.

Self-hosting your software development with the Gitea Marketplace App offers total control of your codebase. At the same time, its familiar interface eases collaboration for you and your team. Gitea is one of the most popular self-hosted Git repository platforms, allowing you to benefit from a robust set of integrated tools and an active community.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** Gitea should be fully installed within 3-7 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Debian 10
- **Recommended minimum plan:** 4GB Dedicated Compute Instance

### Gitea Options

- **MySQL root Password** *(required)*: The root password for your MySQL database.
- **Gitea Database Password** *(required)*: The password for your Gitea database user.

{{< content "marketplace-limited-user-fields-shortguide">}}
- **Enable passwordless sudo access for the limited user?** Select **Yes** to [disable SSH password authentication](/docs/guides/set-up-and-secure/#ssh-daemon-options) for your limited sudo user as an additional security measure. Requires an **SSH Public Key** for SSH access to your Linode.

#### Additional Security Configuration

- **Configure automatic security updates?** Select **Yes** to enable [automatic security updates](/docs/guides/set-up-and-secure/#automatic-security-updates) for your Linode.
- **Use fail2ban to prevent automated instrusion attempts?** Select **Yes** to enable [SSH login protection with Fail2Ban](/docs/guides/using-fail2ban-to-secure-your-server-a-tutorial/) as an additional security measure.

{{< content "marketplace-custom-domain-fields-shortguide">}}
- **SOA Email for your domain** The email address to register as your Start of Authority (SOA). This field is required for creating DNS records for a new domain.
- **Do you need an MX record for this domain?** Select **Yes** to automatically configure an [MX record](/docs/guides/dns-records-an-introduction/#mx) for the purpose of sending emails from your Linode. Additional configuration with Gitea is required after installation to enable sending emails with this app.
- **Do you need an SPF record for this domain?** Select **Yes** to automatically configure an [SPF record](/docs/guides/dns-records-an-introduction/#spf) for the purpose of sending emails from your Linode. Additional configuration with Gitea is required after installation to enable sending emails with this app.
- **Would you like to use a free Let's Encrypt SSL certificate for your fully qualified domain name?** Select **Yes** to configure an SSL Certificate for HTTPS access to your Gitea remote desktop. Requires a `Domain` and `Admin Email`.
- **Admin Email for Let's Encrypt certificate:** The email address to register with [Certbot](https://certbot.eff.org/) when generating an SSL certificate for your fully qualified domain name. This field is required for HTTPS access to your Gitea remote desktop.

{{< content "email-warning-shortguide" >}}

## Getting Started after Deployment

### Access your Gitea Site

After Gitea has finished installing, you can access your Gitea site using a web browser to complete setup and begin using your app.

1.  Enter your Linode's fully qualified domain name (for example, `https://www.example.com`) or [IPv4 address](/docs/guides/find-your-linodes-ip-address/) (for example, `http://192.0.2.0`) into a browser window to access the Gitea welcome page. Select the **Register** link to reach the initial configuration screen.

    ![The Gitea welcome page.](gitea-welcome-page.png 'Gitea welcome page')

1.  Enter your [Gitea Database Password](#gitea-options) in the **Password** field.

    ![Gitea initial configuration settings.](initial-configuration-password.png 'Gitea initial configuration settings')

1.  Replace `localhost` with your Linode's fully qualified domain name or IPv4 address under **SSH Server Domain** and **Gitea Base URL** fields. Specify `https` in the **Gitea Base URL** field if you configured an SSL certificate for your domain.

    ![Gitea general settings.](general-settings-domain-url.png 'Gitea general settings')

1.  Complete any other desired configurations, then select **Install Gitea** to complete initial configuration.

1.  You can now register a new administrative user and manage repositories with your Gitea App. For more configuration instructions and settings, refer to the official [Gitea Documentation](https://docs.gitea.io/).


## Software Included

The Gitea Marketplace App installs the following software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Gitea**](https://gitea.io/) | Open source remote Git repository software. [v1.13.0](https://github.com/go-gitea/gitea/releases/tag/v1.13.0) |
| [**MariaDB**](https://mariadb.org/) | Open source relational database fork of MySQL. |
| [**NGINX**](https://www.nginx.com/) | Open source web server. Used as a reverse proxy by this app. See our guide on [Getting Started with NGINX](/docs/guides/getting-started-with-nginx-part-1-installation-and-basic-setup/) for more information. |
| [**UFW**](https://wiki.ubuntu.com/UncomplicatedFirewall) | Firewall utility. Ports 22/tcp, 80/tcp, and 443/tcp for IPv4 and IPv6 are enabled with installation of this app. Additional ports must be opened to send email from your Linode for use with this app. See our guide on [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/) for instructions. |

{{< content "marketplace-update-note-shortguide">}}
