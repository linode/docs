---
slug: deploy-ownCloud-with-marketplace-apps
author:
  name: Linode
  email: docs@linode.com
description: 'Deploy a ownCloud Server on Linode using Marketplace Apps.'
og_description: 'Deploy a ownCloud Server on Linode using Marketplace Apps.'
keywords: [ 'ownCloud','marketplace', 'server']
tags: ["cloud","linode platform", "marketplace"]
published: 2023-05-30
modified: 2023-05-30
modified_by:
  name: Linode
title: "How to Deploy a ownCloud Server with Marketplace Apps"
h1_title: "Deploying a ownCloud Server with Marketplace Apps"
contributor:
  name: Linode
external_resources:
- '[ownCloud Official](https://www.ownCloud.com)'
aliases: ['/platform/marketplace/deploy-ownCloud-with-marketplace-apps/', '/platform/one-click/deploy-ownCloud-with-one-click-apps/']
---

## ownCloud Marketplace App

ownCloud is a self-hosted file sharing and collaboration platform. It allows users to securely access and share files, calendars, and contacts from any device. With ownCloud, you have complete control over your data and can easily share files with others while maintaining full privacy and security. The app is easy to install and setup on Debian, and offers a wide range of features such as file syncing, versioning, access control and more.

## Deploy ownCloud with Marketplace Apps

{{< content deploy-marketplace-apps >}}

### ownCloud Options

| **Configuration** | **Description** |
|-------------------|-----------------|
| **The name of the admin user for ownCloud (required)** | Provide a name for the admin user with which you want to adminitrate ownCloud. |
| **The password for ownCloud's admin user (required)** | Provide a secure password for the admin user with which you want to adminitrate ownCloud. |
| **Admin Email for the ownCloud server (required)** | Provide the email adress of the ownCloud admin user. |
| **The root password for the database (required)** | Provide a secure password for the root user of the database. The root user has the ability to adminitrate the database. The password should be differ from the ownCloud admin password. |
| **The password for the created database user (required)** | Provide a secure password for the user who will be used by ownCloud to write and read the database. The password should be differ from the ownCloud admin password and the database root password. |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **The subdomain for Linode's DNS record** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **The domain for the Linode's DNS record** | The domain name where you wish to host your ownCloud server. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **Would you like to use a free CertBot SSL certificate?** | Select `Yes` if you would like the install to create an SSL certificate for you, or `No` if you do not. You cannot create secure, encrypted conferences without an SSL certificate. |
| **E-Mail Address for Let's Encrypt Certificate** |  E-mail address used as the start of authority (SOA) email address for this server and for Let's Encrypt installation. This email address is added to the SOA record for the domain. This is a required field if you want the installer to create DNS records. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |

### Linode Options

After providing the app-specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|-------------------|-----------------|
| **Select an Image** | Debian 9 and Debian 10 are currently the only images supported by the ownCloud Marketplace App, and it is pre-selected on the Linode creation page. *Required* |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). You can use any size Linode for your ownCloud App. The Linode plan that you select should be appropriate for the amount of data transfer, users, storage, and other stress that may affect the performance of server.  *Required* |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name is how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required* |
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |

When you've provided all required Linode Options, click on the **Create** button. **Your ownCloud app will complete installation anywhere between 5-10 minutes after your Linode has finished provisioning**.

## Setting up the ownCloud Server

Once the ownCloud Server is up and running you can login with your admin user name and the provided password.

Please see the following documentation about how to add new users: (https://doc.owncloud.com/server/admin_manual/configuration/user/user_management.html)

A documentation about the Web client and the possibilities for users can be found here: (https://doc.owncloud.com/webui/next/classic_ui/files/webgui/overview.html)

