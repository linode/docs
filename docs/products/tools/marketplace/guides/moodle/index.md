---
description: "Moodle is the leading open source learning management system. This tutorial walks you through deploying Moodle using the Linode Marketplace."
keywords: ['learning','educator','management', and 'school']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2021-08-13
modified: 2023-04-11
modified_by:
  name: Linode
title: "Deploy Moodle through the Linode Marketplace"
aliases: ['/guides/deploying-moodle-marketplace-app/','/guides/moodle-marketplace-app/']
external_resources:
- '[Moodle](https://moodle.org/)'
authors: ["Linode"]
---

Moodle is the most widely used open source learning management system. It is aimed to provide learners, educators, and administrators with a single robust, secure, and integrated solution to develop customized learning environments.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Moodle should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

### Moodle Options

- **Moodle Admin Password** *(required)*: Enter a *strong* password for the Moodle admin account.
- **Moodle Admin Email** *(required)*: The email address you wish to use with the Moodle admin account.
| **MySQL Root Password** *(required)*: Enter a *strong* password for the MySQL root user.
- **Moodle database User Password** *(required)*: Enter a *strong* password for the database user.
- **Limited sudo user** *(required)*: Enter your preferred username for the limited user.
- **Password for the limited user** *(required)*: Enter a *strong* password for the new user.

{{< content "marketplace-custom-domain-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

#### Limited User SSH Options (Optional)

- **SSH public key for the limited user:** If you wish to login as the limited user through public key authentication (without entering a password), enter your public key here. See [Creating an SSH Key Pair and Configuring Public Key Authentication on a Server](/docs/guides/use-public-key-authentication-with-ssh/) for instructions on generating a key pair.
- **Disable root access over SSH:** To block the root user from logging in over SSH, select *Yes* (recommended). You can still switch to the root user once logged in and you can also log in as root through [Lish](/docs/products/compute/compute-instances/guides/lish/).

## Getting Started After Deployment

### Access Your Moodle App

To access your Moodle instance, Open a browser and navigate to your Linode rDNS domain `https://203-0-113-0.ip.linodeusercontent.com`. Replace `https://203-0-113-0.ip.linodeusercontent.com` with your [Linode's RDNS domain](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#viewing-ip-addresses).

From there, you can login by clicking the box on the top right of the page. Once you see the login page, you can enter `moodle` as the *username* and the *password* that was entered during the creation of the Linode.

Now that you’ve accessed your dashboard, checkout [the official Moodle documentation](https://docs.moodle.org/311/en/Main_page) to learn how to further configure your instance.

## Software Included

The Moodle Marketplace App installs the following required software on your Linode:

| Software | Description |
| -- | -- |
| [**PHP**](https://www.php.net) | A popular general-purpose scripting language that is especially suited to web development. |
| [**MariaDB Server**](https://mariadb.org) | A relational database server. The root password is set, locking down access outside the system. To gain access to the root user, obtain the password from `/root/.root_mysql_password` file. |
| [**UFW**](https://wiki.ubuntu.com/UncomplicatedFirewall) | Firewall utility that allows access only for SSH (port 22, rate limited), HTTP (port 80), and HTTPS (port 443). |
| [**Certbot**](https://certbot.eff.org) | Certbot is a fully-featured, easy-to-use, extensible client for the Let's Encrypt CA. |
| [**Apache2**](https://httpd.apache.org) | HTTP Server. |


{{< content "marketplace-update-note-shortguide">}}
