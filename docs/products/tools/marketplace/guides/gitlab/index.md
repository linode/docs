---
description: "This is a step-by-step guide on how to deploy the GitLab application, a solution for your software development needs, by using the Linode Marketplace."
keywords: ['gitlab','marketplace apps','version control','git']
tags: ["linode platform","version control system","marketplace","cloud-manager"]
published: 2019-03-27
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploy Gitlab through the Linode Marketplace"
external_resources:
- '[GitLab Adminstrator Documentation](https://docs.gitlab.com/ee/administration/)'
aliases: ['/platform/one-click/deploy-gitlab-with-one-click-apps/','/guides/deploy-gitlab-with-one-click-apps/', '/platform/marketplace/deploy-gitlab-with-marketplace-apps/', '/guides/deploy-gitlab-with-marketplace-apps/','/guides/gitlab-marketplace-app/']
authors: ["Linode"]
---

[GitLab](https://about.gitlab.com/) is a complete solution for all aspects of your software development. At its core, GitLab serves as your centralized remote Git repository. GitLab also features built-in tools that represent every task in your development workflow, from planning to testing to releasing.

Self-hosting your software development with GitLab offers total control of your codebase. At the same time, its familiar interface will ease collaboration for you and your team. GitLab is the most popular self-hosted Git repository software, so you'll benefit from a robust set of integrated tools and an active community.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Gitlab should be fully installed within 10-15 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Debian 11, Ubuntu 20.04 LTS
- **Recommended minimum plan:** 8GB Dedicated CPU Compute Instance

### GitLab Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

### Access the GitLab Site

Once your new Compute Instance has been fully deployed, follow the instructions below to access your new Gitlab app.

1. **Find the Gitlab root password:** Before logging in to your Gitlab site, you need to obtain the Gitlab root password that was generated during provisioning.

    1. Log in to your new Compute Instance through [Lish](/docs/products/compute/compute-instances/guides/lish/) or [SSH](/docs/guides/connect-to-server-over-ssh/) using either the `root` user or limited user and the associated password you entered when creating the instance.

    1.  Enter the following command in the lish console or terminal session:

            cat /etc/gitlab/initial_root_password

        The Gitlab root password is displayed within the output of that command.

1. **Log in to your Gitlab site:** Open a web browser and enter either your Compute Instance's default rDNS domain or your domain name (if you entered one during deployment). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing and setting the rDNS value.

    When presented with a login screen, enter the following credentials:

    - **Username:** `root`
    - **Password:** Use the password you obtained in the previous step.

1.  **Reset the root password:** Once you're logged in, it's recommended that you reset the root password. To do so, navigate to the following URL, replacing *[domain]* with the rDNS domain of your Compute instance or your custom domain:

        https://[domain]/-/profile/password/edit

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