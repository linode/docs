---
description: "Deploy Wazuh on a Linode Compute Instance. This provides you with an open source a security monitoring solution."
keywords: ['security','vulnerability','monitoring']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2021-11-12
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploy Wazuh through the Linode Marketplace"
external_resources:
- '[Wazuh](https://wazuh.com/)'
aliases: ['/guides/deploying-wazuh-marketplace-app/','/guides/wazuh-marketplace-app/']
authors: ["Linode"]
---

[Wazuh](https://wazuh.com/) provides a security solution for monitoring your infrastructure and detecting threats, intrusion attempts, system anomalies, poorly configured applications, and unauthorized user actions. It also provides a framework for incident response and regulatory compliance.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Wazuh should be fully installed within 10-15 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** Wazuh recommends a minimum of a 4GB Linode, though an 8-core plan (32GB and up) is recommended for production.

### Wazuh Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

### Accessing the Wazuh App

1.  Open a web browser and navigate to the domain you created in the beginning of your deployment. You can also use your Compute Instance's rDNS, which may look like `203-0-113-0.ip.linodeusercontent.com`. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing and setting the rDNS value.

1.  In the login screen that appears, enter `admin` as the username and `admin` as the password. Since the default admin user is set to read-only, you need to follow the steps below to reset the admin password.

    1.  Log in to your Compute Instance over SSH. See [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/) for assistance.

    1.  Run the Wazuh Password reset tool that has been preloaded onto your instance in the root directory:

            bash /root/wazuh-passwords-tool.sh -a

    1. After the tool finishes running, it outputs all of the new passwords for each system. Record these credentials.

    1. You are now able to log in to your Wazuh instance with your new admin credentials.

Now that you’ve accessed your Wazuh instance, you need to configure a [Wazuh Agent](https://documentation.wazuh.com/current/installation-guide/wazuh-agent/index.html) on the server you'd like to monitor with Wazuh.

For more documentation on Wazuh, check out [the official Wazuh documentation](https://documentation.wazuh.com/current/installation-guide/index.html) to learn how to further utilize your instance.

{{< content "marketplace-update-note-shortguide">}}