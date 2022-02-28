---
slug: gitlab-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "This is a step-by-step guide on how to deploy the GitLab application, a solution for your software development needs, by using the Linode Marketplace."
keywords: ['gitlab','marketplace apps','version control','git']
tags: ["linode platform","version control system","marketplace","cloud-manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-03-27
modified: 2022-02-17
modified_by:
  name: Linode
title: "Deploying Gitlab through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[GitLab Adminstrator Documentation](https://docs.gitlab.com/ee/administration/)'
aliases: ['/platform/one-click/deploy-gitlab-with-one-click-apps/','/guides/deploy-gitlab-with-one-click-apps/', '/platform/marketplace/deploy-gitlab-with-marketplace-apps/', '/guides/deploy-gitlab-with-marketplace-apps/']
---

[GitLab](https://about.gitlab.com/) is a complete solution for all aspects of your software development. At its core, GitLab serves as your centralized remote Git repository. GitLab also features built-in tools that represent every task in your development workflow, from planning to testing to releasing.

Self-hosting your software development with GitLab offers total control of your codebase. At the same time, its familiar interface will ease collaboration for you and your team. GitLab is the most popular self-hosted Git repository software, so you'll benefit from a robust set of integrated tools and an active community.

## Deploying the GitLab Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 10-15 minutes after the Linode has finished provisioning.**

## Configuration Options

### GitLab Options

Here are the additional options available for this Marketplace App:

| **Field** | **Description** |
|:--------------|:------------|
| **Admin Email for the server** | E-Mail address for Let's Encrypt SSL certificate. This is also used as the SOA email address if you also enter a domain. *Required*. |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name where you wish to host your BeEF instance. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Debian 11, Ubuntu 20.04 LTS
- **Recommended minimum plan:** 8GB Dedicated CPU Compute Instance

## Getting Started after Deployment

### Access your GitLab Site

Once your new Compute Instance has been fully deployed, follow the instructions below to access your new Gitlab app.

1. **Find the Gitlab root password:** Before logging in to your Gitlab site, you need to obtain the Gitlab root password that was generated during provisioning.

    1. Log in to your new Compute Instance through [Lish](/docs/guides/using-the-lish-console/) or [SSH](/docs/guides/connect-to-server-over-ssh/) using `root` user and the password you entered when creating the instance.

    1.  Enter the following command in the lish console or terminal session:

            cat /etc/gitlab/initial_root_password

        The Gitlab root password is displayed within the output of that command.

1. **Log in to your Gitlab site:** Open a web browser and enter either your Compute Instance's default rDNS domain or your domain name (if you entered one during deployment). See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/) guide for information on viewing and setting the rDNS value. Ensure you are using `http://` when visiting your site.

    When presented with a login screen, enter the following credentials:

    - **Username:** `root`
    - **Password:** Use the password you obtained in the previous step.

1.  **Reset the root password:** Once you're logged in, it's recommended that you reset the root password. To do so, navigate to the following URL, replacing *[ip-address]* with the IP address of your Compute instance:

        http://[ip-address]/-/profile/password/edit

You can now begin creating GitLab repositories, users, and more. See [GitLab's official documentation](https://docs.gitlab.com/ee/university/training/topics/getting_started.html) for more information.

## Software Included

The GitLab Marketplace App installs the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**GitLab**](https://about.gitlab.com/) | Remote Git repository software. |
| [**Postfix**](http://www.postfix.org/) | Postfix is a free and open-source mail transfer agent that routes and delivers electronic mail. |
| [**UFW**](https://wiki.ubuntu.com/UncomplicatedFirewall) | Firewall utility. Ports 22/tcp, 80/tcp, 443/tcp, 25, 587, and 110 for IPv4 and IPv6 will allow outgoing and incoming traffic. |
| [**Fail2ban**](https://www.fail2ban.org/wiki/index.php/Main_Page) | Fail2Ban is an intrusion prevention software framework that protects computer servers from brute-force attacks. |

{{< content "marketplace-update-note-shortguide">}}