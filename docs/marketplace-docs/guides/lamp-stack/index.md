---
title: "Deploy a LAMP Stack through the Linode Marketplace"
description: "This guide shows you how to use the Linode Marketplace One-Click Application to deploy a LAMP (Linux, Apache, MySQL, PHP) stack on a Linode running Linux."
published: 2019-03-26
modified: 2025-04-29
keywords: ['LAMP', 'apache', 'web server', 'mysql', 'php']
tags: ["apache","lamp","cloud-manager","linode platform","php","mysql","marketplace"]
external_resources:
- '[Apache Getting Started](http://httpd.apache.org/docs/current/getting-started.html)'
aliases: ['/products/tools/marketplace/guides/lamp-stack/','/platform/marketplace/deploy-lamp-stack-with-marketplace-apps/', '/platform/marketplace/deploy-lamp-stack-with-one-click-apps/','/platform/one-click/deploy-lamp-stack-with-one-click-apps/','/guides/deploy-lamp-stack-with-one-click-apps/','/guides/deploy-lamp-stack-with-marketplace-apps/','/guides/lamp-stack-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 401701
marketplace_app_name: "LAMP"
---

A LAMP (Linux, [Apache](https://www.apache.org), [MySQL](https://www.mysql.com), [PHP](https://www.php.net)) stack is a popular, free, and open-source web software bundle used for hosting websites on Linux. This software environment is a foundation for popular PHP application frameworks like WordPress, Drupal, and Laravel. After you deploy your LAMP Marketplace App, you can upload your existing PHP application code to it or use a PHP framework to write a new application on your Linode.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** The LAMP stack should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended minimum plan:** 1GB Shared Compute Instance or higher, depending on the number of sites and size of the sites you plan on hosting.

### LAMP Stack Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

- **Install PHPMyAdmin**: Choose whether to install PHPMyAdmin during deployment. This provides a web-based interface for managing your MySQL databases.

    {{< note >}}
    The password for the MySQL root user is automatically generated and provided in the file `/home/$USERNAME/.credentials` when the LAMP deployment completes.
    {{< /note >}}

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started After Deployment

After your LAMP stack has finished deploying, you can:

- [Connect to your Linode via SSH](/docs/products/compute/compute-instances/guides/set-up-and-secure/#connect-to-the-instance). You will need your Linode's root password to proceed. Note that your Linode's web root will be located in the `/var/www/html` directory.

- [Navigate to the public IP address or domain entered during creation](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) of your Linode in a browser. You will see the default Apache webpage.

- Consult the following guides to learn more about working with the various components of the LAMP stack:

    - [Secure HTTP Traffic with Certbot](/docs/guides/secure-http-traffic-certbot/)
    - [Apache Configuration Basics](/docs/guides/apache-configuration-basics/)
    - [How to Optimize MySQL Performance Using MySQLTuner](/docs/guides/how-to-optimize-mysql-performance-using-mysqltuner/)

-   Upload files to your web root directory with an SFTP application like [FileZilla](/docs/guides/filezilla/). Use the same root credentials that you would use for SSH.

-   Assign a domain name to your Linode's IP address. Review the [DNS Manager](/docs/products/networking/dns-manager/) guide for instructions on setting up your DNS records in Cloud Manager, and read through [DNS Records: An Introduction](/docs/guides/dns-overview/) for general information about how DNS works.

## Software Included

The LAMP Stack Marketplace App installs the following software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Apache HTTP Server**](https://www.apache.org) | Web server that can be used to serve your site or web application.|
| [**MySQL Server**](https://www.mysql.com) | Relational database. |
| [**PHP 7**](https://www.php.net) | General purpose programming language. |
| [**UFW (Uncomplicated Firewall)**](https://en.wikipedia.org/wiki/Uncomplicated_Firewall) | Firewall utility. Ports 22/tcp, 80/tcp, and 443/tcp for IPv4 and IPv6 will allow outgoing and incoming traffic. |

## Going Further

- [Marketplace Apps Repository](https://github.com/akamai-compute-marketplace/marketplace-apps): Review the deployment Ansible playbooks.

{{% content "marketplace-update-note-shortguide" %}}
