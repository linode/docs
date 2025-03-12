---
title: "Deploy Gitlab through the Linode Marketplace"
description: "This is a step-by-step guide on how to deploy the GitLab application, a solution for your software development needs, by using the Linode Marketplace."
published: 2019-03-27
modified: 2022-03-08
keywords: ['gitlab','marketplace apps','version control','git']
tags: ["linode platform","version control system","marketplace","cloud-manager"]
external_resources:
- '[GitLab Administrator Documentation](https://docs.gitlab.com/ee/administration/)'
- '[GitLab Official Documentation](https://docs.gitlab.com/ee/university/training/topics/getting_started.html)'
aliases: ['/products/tools/marketplace/guides/gitlab/','/platform/one-click/deploy-gitlab-with-one-click-apps/','/guides/deploy-gitlab-with-one-click-apps/', '/platform/marketplace/deploy-gitlab-with-marketplace-apps/', '/guides/deploy-gitlab-with-marketplace-apps/','/guides/gitlab-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 401707
marketplace_app_name: "Gitlab"
---

[GitLab](https://about.gitlab.com/) is a complete solution for all aspects of your software development. At its core, GitLab serves as your centralized remote Git repository. GitLab also features built-in tools that represent every task in your development workflow, from planning to testing to releasing.

Self-hosting your software development with GitLab offers total control of your codebase. At the same time, its familiar interface will ease collaboration for you and your team. GitLab is the most popular self-hosted Git repository software, so you'll benefit from a robust set of integrated tools and an active community.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Gitlab should be fully installed within 10-15 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended minimum plan:** 8GB Dedicated CPU Compute Instance

### GitLab Options

- **Email address** *(required)*: Enter the email address you want to use for generating the SSL certificates and configuring the server and DNS records.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

### Obtain the Credentials

Once the app is deployed, you need to obtain the credentials from the server.

To obtain the credentials:

1.  Log in to your new Compute Instance using one of the methods below:

    - **Lish Console**: Log in to Cloud Manager, click the **Linodes** link in the left menu, and select the Compute Instance you just deployed. Click **Launch LISH Console**. Log in as the `root` user. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH**: Log in to your Compute Instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

1.  Run the following command to access the credentials file:

    ```command
    cat /home/$USERNAME/.credentials
    ```

This returns passwords that were automatically generated when the instance was deployed. Save them. Once saved, you can safely delete the file.

## Getting Started after Deployment

Once your new Compute Instance has been fully deployed, follow the instructions below to access your new Gitlab app.

1. Log in to your Gitlab site by opening a web browser and entering either your Compute Instance's default rDNS domain or your domain name (if you entered one during deployment). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing and setting the rDNS value.

    On the login screen, enter the following credentials:

    - **Username:** `root`
    - **Password:** Use the password obtained from your credentials file.

1.  Once you're logged in, it's recommended that you reset the root password. To do so, go to the following URL, replacing *[domain]* with the rDNS domain of your Compute instance or your custom domain:

        https://[domain]/-/profile/password/edit

You can now begin creating GitLab repositories, users, and more. To learn more, see [GitLab's official documentation](https://docs.gitlab.com/ee/university/training/topics/getting_started.html).

## Software Included

The GitLab Marketplace App installs the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**GitLab**](https://about.gitlab.com/) | Remote Git repository software. |
| [**Postfix**](http://www.postfix.org/) | Postfix is a free and open-source mail transfer agent that routes and delivers electronic mail. |
| [**UFW**](https://wiki.ubuntu.com/UncomplicatedFirewall) | Firewall utility. Ports 22/tcp, 80/tcp, 443/tcp, 25, 587, and 110 for IPv4 and IPv6 will allow outgoing and incoming traffic. |
| [**Fail2ban**](https://www.fail2ban.org/wiki/index.php/Main_Page) | Fail2Ban is an intrusion prevention software framework that protects computer servers from brute-force attacks. |

{{% content "marketplace-update-note-shortguide" %}}