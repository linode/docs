---
slug: deploy-Gitea-with-marketplace-apps
author:
  name: Linode
  email: docs@linode.com
description: 'Deploy Gitea on Linode using Marketplace Apps.'
og_description: 'Deploy Gitea on Linode using Marketplace Apps.'
keywords: ['Gitea','version control','git']
tags: ["linode platform","version control system","marketplace","cloud-manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-01-04
modified: 2021-01-04
modified_by:
  name: Linode
title: "Deploy Gitea with Marketplace Apps"
contributor:
  name: Linode
external_resources:
- '[Gitea Documentation](https://docs.gitea.io/'
aliases: ['/guides/deploy-gitea-with-one-click-apps/']
---
## Gitea Marketplace App

[Gitea](https://gitea.io/) is a community managed, painless, self-hosted Git service. Gitea is a complete solution for all aspects of your software development. At its core, Gitea serves as your centralized remote Git repository. Gitea also features built-in tools that represent every task in your development workflow, from planning to testing to releasing.

Self-hosting your software development with the Gitea Marketplace App offers total control of your codebase. At the same time, its familiar interface eases collaboration for you and your team. Gitea is one of the most popular self-hosted Git repository platforms, allowing you to benefit from a robust set of integrated tools and an active community.

### Deploy a Gitea Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

### Gitea Options

You can configure your Gitea App by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **MySQL root Password** | The root password for your MySQL database. *Required*. |
| **Gitea Database Password** | The password for your Gitea database user. *Required*. |
| **The limited sudo user to be created for the Linode** | The Linux username created for this Linode with sudo permissions. |
| **The password for the limited sudo user** | The password for your limited sudo user. |
| **SSH Public Key** | The [public key](/docs/guides/use-public-key-authentication-with-ssh/) for SSH access with your limited sudo user. |
| **Enable passwordless sudo access for the limited user?** | Select **Yes** to [disable SSH password authentication](/docs/guides/securing-your-server/#ssh-daemon-options) for your limited sudo user as an additional security measure. Requires an **SSH Public Key** for SSH access to your Linode. |
| **Disable root access over SSH?** | Select **Yes** to [disallow root logins over SSH](/docs/guides/securing-your-server/#ssh-daemon-options) as an additional security measure. Requires a configuration of a **limited sudo user** for SSH access to your Linode. |
| **Configure automatic security updates?** | Select **Yes** to enable [automatic security updates](/docs/guides/securing-your-server/#automatic-security-updates) for your Linode. |
| **Use fail2ban to prevent automated instrusion attempts?** | Select **Yes** to enable [SSH login protection with Fail2Ban](/docs/security/using-fail2ban-to-secure-your-server-a-tutorial/) as an additional security measure. |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `Subdomain` and `Domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create a token](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) to use in this field before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup, for example `www`. Requires a `Domain` and `API Token`. If no subdomain is specified, a DNS record is created for the root domain. |
| **Domain** | The domain name where you wish to host your Gitea server, for example `example.com`. Requires an `API Token`. For more guidance on using domains with Linode, see our [DNS Manager Guide](/docs/guides/dns-manager/). |
| **SOA Email for your domain** | The email address to register as your Start of Authority (SOA). This field is required for creating DNS records for a new domain. |
| **Do you need an MX record for this domain?** | Select **Yes** to automatically configure an [MX record](/docs/guides/dns-records-an-introduction/#mx) for the purpose of sending emails from your Linode. Additional configuration with Gitea is required after installation to enable sending emails with this app.|
| **Do you need an SPF record for this domain?** | Select **Yes** to automatically configure an [SPF record](/docs/guides/dns-records-an-introduction/#spf) for the purpose of sending emails from your Linode. Additional configuration with Gitea is required after installation to enable sending emails with this app. |
| **Would you like to use a free Let's Encrypt SSL certificate for your fully qualified domain name?** | Select **Yes** to configure an SSL Certificate for HTTPS access to your Gitea remote desktop. Requires a `Domain` and `Admin Email`. |
| **Admin Email for Let's Encrypt certificate** | The email address to register with [Certbot](https://certbot.eff.org/) when generating an SSL certificate for your fully qualified domain name. This field is required for HTTPS access to your Gitea remote desktop. |

{{< content "email-warning-shortguide" >}}

### Linode Options

After providing the app specific options, provide configurations for your Linode server:

| **Configuration** | **Description**|
|--------------|------------|
| **Select an Image** | Debian 10 is currently the only image supported by the Gitea Marketplace App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). We recommend that you use, at minimum, an **4GB Linode plan** for your Gitea server. For more information on Gitea's system requirements see their [official documentation](https://docs.gitea.io/). If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name is how you identify your server in the Cloud Manager Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

When you've provided all required Linode Options, click on the **Create** button. **Your Gitea App will complete installation anywhere between 3-7 minutes after your Linode has finished provisioning**.

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
| [**NGINX**](https://www.nginx.com/) | Open source web server. Used as a reverse proxy by this app. See our guide on [Getting Started with NGINX](/docs/guides/nginx-installation-and-basic-setup/) for more information. |
| [**UFW**](https://wiki.ubuntu.com/UncomplicatedFirewall) | Firewall utility. Ports 22/tcp, 80/tcp, and 443/tcp for IPv4 and IPv6 are enabled with installation of this app. Additional ports must be opened to send email from your Linode for use with this app. See our guide on [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/) for instructions. |

{{< content "marketplace-update-note">}}
