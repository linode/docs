---
description: "This guide shows you how to use the Linode Marketplace to deploy a LEMP (Linux, NGINX, MySQL, PHP) server stack on a Linode Compute Instance."
keywords: ['LEMP', 'nginx', 'web server', 'mysql', 'php']
tags: ["lemp","nginx","cloud-manager","linode platform","php","mysql","marketplace"]
published: 2020-03-11
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploy a LEMP Stack through the Linode Marketplace"
image: feature.png
external_resources:
- '[NGINX Getting Started](https://www.nginx.com/resources/wiki/start/)'
aliases: ['/platform/marketplace/deploy-lemp-stack-with-marketplace-apps/', '/platform/marketplace/deploy-lemp-stack-with-one-click-apps/', '/guides/deploy-lemp-stack-with-one-click-apps/','/guides/deploy-lemp-stack-with-marketplace-apps/','/guides/lemp-stack-marketplace-app/']
authors: ["Linode"]
---

The LEMP stack (Linux, [NGINX](https://www.nginx.com/), [MySQL](https://www.mysql.com/), [PHP](https://www.php.net/)) is a popular, free, and open-source web software bundle used for hosting websites on the Linux operating system. While similar to the [LAMP Stack](/docs/products/tools/marketplace/guides/lamp-stack/), a LEMP stack uses the NGINX web server instead of [Apache](https://httpd.apache.org/). NGINX is preferred by many users for a variety of reasons, including its flexibility, speed, and ability to perform under high load.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** The LEMP stack should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended minimum plan:** 1GB Shared Compute Instance or higher, depending on the number of sites and size of the sites you plan on hosting.

### LEMP Stack Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

    {{< note >}}
    The password for the MySQL root user is automatically generated and provided in the file `/root/.linode_credentials.txt` when the LEMP deployment completes.
    {{< /note >}}

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-custom-domain-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started After Deployment

After your LEMP stack has finished deploying, you can view it and upload your own files using one of the methods below:

- Log in to your new Compute Instance through [Lish](/docs/products/compute/compute-instances/guides/lish/) or [SSH](/docs/guides/connect-to-server-over-ssh/) using either the `root` user or limited user and the associated password you entered when creating the instance. Your application's web files are located in the `/var/www/html` directory.

- Navigate to the domain entered during the creation of the Linode instance. If you did not enter a domain, you can also use your Compute Instance's rDNS, which may look like `123-0-123-0.ip.linodeusercontent.com`. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing and setting the rDNS value.

- Consult the following guides to learn more about working with the various components of the LEMP stack:

    - [Secure HTTP Traffic with Certbot](/docs/guides/secure-http-traffic-certbot/)
    - [How to Configure NGINX](/docs/guides/how-to-configure-nginx/)
    - [How to Optimize MySQL Performance Using MySQLTuner](/docs/guides/how-to-optimize-mysql-performance-using-mysqltuner/)

- Upload files to your web root directory with an SFTP application like [FileZilla](/docs/guides/filezilla/). Use the same root credentials that you would use for SSH.

## Software Included

The LEMP Stack Marketplace App installs the following software on your Compute Instance:

| **Software** | **Description** |
|:--------------|:------------|
| [**NGINX**](https://www.nginx.com/) | Web server that can be used to serve your site or web application.|
| [**MySQL Server**](https://www.mysql.com) | Relational database. |
| [**PHP 7.4**](https://www.php.net) | General purpose programming language. |
| [**UFW (Uncomplicated Firewall)**](https://en.wikipedia.org/wiki/Uncomplicated_Firewall) | Firewall utility. Ports 22/tcp and 80/tcp for IPv4 and IPv6 will allow outgoing and incoming traffic. |

## Going Further

- [Marketplace Apps Repository](https://github.com/linode-solutions/marketplace-apps): Review the deployment Ansible playbooks.

{{< content "marketplace-update-note-shortguide">}}
