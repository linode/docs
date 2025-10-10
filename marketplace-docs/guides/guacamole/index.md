---
title: "Deploy Apache Guacamole through the Linode Marketplace"
description: "Deploy Apache Guacamole, a clientless remote desktop gateway that supports VNC, RDP, and SSH protocols through a web browser, on an Akamai Compute Instance."
published: 2020-12-11
modified: 2025-10-03
keywords: ['guacamole', 'marketplace', 'remote desktop']
tags: ["cloud-manager","linode platform","marketplace"]
aliases: ['/products/tools/marketplace/guides/guacamole/','/platform/marketplace/guacamole/','/guides/deploy-guacamole-with-marketplace-apps/','/guides/guacamole-marketplace-app/']
external_resources:
 - '[Guacamole Documentation](https://guacamole.apache.org/doc/gug/)'
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 688914
marketplace_app_name: "Apache Guacamole"
---

[Apache Guacamole](https://guacamole.apache.org/) is a clientless remote desktop gateway that provides access to desktop environments using remote desktop protocols (VNC, RDP, SSH) through a standard web browser. Unlike traditional remote access solutions, Guacamole requires no plugins or client software installation, making it ideal for accessing remote systems from any device. This deployment uses Docker containers with PostgreSQL database backend for scalable user and connection management, NGINX reverse proxy for security, and automated SSL certificate management.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Apache Guacamole should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended plan:** All plan types and sizes can be used. For production workloads managing multiple remote connections, consider at least 4GB Dedicated CPU or Shared CPU Compute or higher for optimal performance.

### Guacamole Options

- **Email address** *(required)*: Enter a valid email address to use for generating the SSL certificates.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

### Accessing the Guacamole Web Interface

1.  Open your web browser and navigate to `https://[domain]`, where *[domain]* is the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). To learn more about viewing IP addresses and rDNS, see the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/).

2.  You should see the Apache Guacamole login page. Log in using the default credentials:
    - **Username:** `guacadmin`
    - **Password:** The password is automatically generated and stored in the credentials file. To retrieve it, log in to your Compute Instance via SSH or Lish and run the below `cat` command:
        ```command
        cat /home/$USER/.credentials
        ```

After logging in, you are brought to the Guacamole Web Interface. This is your central dashboard where you can create connections, and manage user accounts and permissions.

{{% content "marketplace-update-note-shortguide" %}}
