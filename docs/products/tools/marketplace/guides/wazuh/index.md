---
description: "Deploy Wazuh on a Linode Compute Instance. This provides you with an open source a security monitoring solution."
keywords: ['security','vulnerability','monitoring']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2021-11-12
modified: 2023-07-05
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

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended plan:** Wazuh recommends a minimum of a 4GB Linode, though an 8-core plan (32GB and up) is recommended for production.

### Wazuh Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

### View Credentials

1.  Log into your new Compute Instance through [LISH](/docs/products/compute/compute-instances/guides/lish/) or [SSH](/docs/products/compute/compute-instances/guides/set-up-and-secure/#connect-to-the-instance) using the root user and the password you entered when creating the instance.

1.  The usernames and passwords have been saved in a `.deployment-secrets.txt` file located in your root directory. You can view this file in your preferred text editor or through the `cat` command.

    ```command
    cat /root/.deployment-secrets.txt
    ```

    This file contains all of your Wazuh credentials. The admin user and its associated password are needed when following the [Access the Wazuh App](#access-the-wazuh-app) section below.

    ```file {title="/root/.deployment-secrets.txt"}
    # Admin user for the web user interface and Wazuh indexer. Use this user to log in to Wazuh dashboard
      indexer_username: 'admin'
      indexer_password: '3O*NRpS5B5*sohufTz?TuM.Vef6zoN5d'

    # Wazuh dashboard user for establishing the connection with Wazuh indexer
      indexer_username: 'kibanaserver'
      indexer_password: 'Z.0M8rorxRS+DQfefe96N?.Cb+?byn7k'

    # Regular Dashboard user, only has read permissions to all indices and all permissions on the .kibana index
      indexer_username: 'kibanaro'
      indexer_password: 'W?PVE08Pk2AYE8*brrg4Ni+LXAbBKJl++2II'

    # Filebeat user for CRUD operations on Wazuh indices
      indexer_username: 'logstash'
      indexer_password: 'FGH6rDIgrg.zvXz?qZfQ1dv?2QAAQuiX7'

    # User with READ access to all indices
      indexer_username: 'readall'
      indexer_password: 'jVVugegfB0ldF+fNN?0bS0iMviFe8RnY'

    # User with permissions to perform snapshot and restore operations
      indexer_username: 'snapshotrestore'
      indexer_password: 'YN17mfegnWy*efeL30KC1Zz.7yrhCma7'

    # Password for wazuh API user
      api_username: 'wazuh'
      api_password: 'PtE5y+esjMmB74g4ttjY+ds0lGfP??uk'

    # Password for wazuh-wui API user
      api_username: 'wazuh-wui'
      api_password: '6?PPR1o0fwfgefLiBjbYxBz+icG0rGojT'
    ```

### Access the Wazuh App

1.  Open a web browser and navigate to the domain you created in the beginning of your deployment. You can also use your Compute Instance's rDNS, which may look like `203-0-113-0.ip.linodeusercontent.com`. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing and setting the rDNS value.

1.  In the login screen that appears, enter `admin` as the username and enter its corresponding password (which can be found by following the [View Credentials](#view-credentials) section).

    ![Screenshot of the login page](wuzah-login.png)

Now that you’ve accessed your Wazuh instance, you need to configure a [Wazuh Agent](https://documentation.wazuh.com/current/installation-guide/wazuh-agent/index.html) on the server you'd like to monitor with Wazuh.

For more documentation on Wazuh, check out [the official Wazuh documentation](https://documentation.wazuh.com/current/installation-guide/index.html) to learn how to further utilize your instance.

{{< content "marketplace-update-note-shortguide">}}