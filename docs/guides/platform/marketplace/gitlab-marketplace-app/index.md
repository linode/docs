---
slug: gitlab-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "This is a step-by-step guide on how to deploy the GitLab application, a solution for your software development needs, by using the Linode One-Click Marketplace."
keywords: ['gitlab','marketplace apps','version control','git']
tags: ["linode platform","version control system","marketplace","cloud-manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-03-27
modified: 2022-02-17
modified_by:
  name: Linode
title: "Deploying GitLab through the Linode Marketplace"
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

- **Domain** *(optional)*: Your GitLab site's domain name. This domain will also be used by Postfix to send mail. Setting a value for this field will not automatically set up DNS for your app, so be sure to follow the DNS instructions in the [Access your GitLab Site](#access-your-gitlab-site) section. If you do not have a domain name, you can leave this field blank and Postfix will use your Linode's default Reverse DNS to send email instead (i.e. `gitlab@l203-0-113-0.ip.linodeusercontent.com`).

### General Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Debian 9
- **Recommended minimum plan:** 8GB Dedicated CPU Compute Instance

## Getting Started after Deployment

### Access your GitLab Site

Once your new Compute Instance has been fully deployed, follow the instructions below to access your new Gitlab app.

1. **Configure DNS:** If you entered a domain name during deployment, configure an [*A record*](/docs/networking/dns/dns-records-an-introduction/#a-and-aaaa) within your name server. This record should point to the IPv4 address of your new Compute Instance. Review the [DNS Manager](/docs/guides/dns-manager/) guide for instructions on setting up DNS records and also see the [Managing IP Addresses](/docs/guides/managing-ip-addresses/#viewing-ip-addresses) guide for instructions on viewing your IP addresses.

1. **Find the Gitlab root password:** Before logging in to your Gitlab site, you need to obtain the Gitlab root password that was generated during provisioning.

    1. Log in to your new Compute Instance through [Lish](/docs/guides/using-the-lish-console/) or [SSH](/docs/guides/connect-to-server-over-ssh/) using `root` user and the password you entered when creating the instance.

    1.  Enter the following command in the lish console or terminal session:

            cat /etc/gitlab/initial_root_password

        The Gitlab root password is displayed within the output of that command.

1. **Log in to your Gitlab site:** Open a web browser and enter either your Compute Instance's IP address or your domain name (if you entered one during deployment). See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/#viewing-ip-addresses) guide for instructions on viewing your IP addresses. Ensure you are using `http://` when visiting your site.

    When presented with a login screen, enter the following credentials:

    - **Username:** `root`
    - **Password:** Use the password you obtained in the previous step.

1.  **Reset the root password:** Once you're logged in, it's recommended that you reset the root password. To do so, navigate to the following URL, replacing *[ip-address]* with the IP address of your Compute instance:

        http://[ip-address]/-/profile/password/edit

You can now begin creating GitLab repositories, users, and more. See [GitLab's official documentation](https://docs.gitlab.com/ee/university/training/topics/getting_started.html) for more information.

### Add a Domain after Deploying your GitLab Instance

If you configured your GitLab Marketplace App without providing a domain, you can configure one after the app has been deployed. Begin by setting up DNS for your domain:

1.  Create an [*A record*](/docs/networking/dns/dns-records-an-introduction/#a-and-aaaa) associated with the IPv4 address for your Linode. Review the [DNS Manager](/docs/guides/dns-manager/) guide for instructions on setting up DNS records.

1.  Wait for your new DNS records to propagate to your internet service provider.

After setting up DNS, you will need to update your GitLab instance's `/etc/gitlab/gitlab.rb` file with your domain name. This will ensure that any emails sent to users by the GitLab instance will use your site's domain.

1.  [Connect to your Linode via SSH](/docs/getting-started/#connect-to-your-linode-via-ssh).

1.  With a text editor of your choice ([nano](/docs/quick-answers/linux/use-nano-to-edit-files-in-linux/), for example), open the `/etc/gitlab/gitlab.rb` file and modify the value of `external_url`. Ensure you replace `http://example.com` with your domain:

    {{< file "/etc/gitlab/gitlab.rb" >}}
## GitLab URL
##! URL on which GitLab will be reachable.
##! For more details on configuring external_url see:
##! https://docs.gitlab.com/omnibus/settings/configuration.html#configuring-the-external-url-for-gitlab
external_url 'http://example.com'
{{< /file >}}

1.  Issue the following command to enable your new configuration:

        gitlab-ctl reconfigure

1.  Navigate to the domain in a browser window and verify that you are directed to your GitLab instance.

## Software Included

The GitLab Marketplace App installs the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**GitLab**](https://about.gitlab.com/) | Remote Git repository software. |
| [**Postfix**](http://www.postfix.org/) | Postfix is a free and open-source mail transfer agent that routes and delivers electronic mail. |
| [**UFW**](https://wiki.ubuntu.com/UncomplicatedFirewall) | Firewall utility. Ports 22/tcp, 80/tcp, 443/tcp, 25, 587, and 110 for IPv4 and IPv6 will allow outgoing and incoming traffic. |
| [**Fail2ban**](https://www.fail2ban.org/wiki/index.php/Main_Page) | Fail2Ban is an intrusion prevention software framework that protects computer servers from brute-force attacks. |

{{< content "marketplace-update-note-shortguide">}}
