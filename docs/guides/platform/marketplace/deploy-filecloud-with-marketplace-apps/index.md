---
slug: deploy-filecloud-with-marketplace-apps
author:
  name: Linode
  email: docs@linode.com
description: 'Deploy a FileCloud Server on Linode using Marketplace Apps.'
og_description: 'Deploy a FileCloud Server on Linode using Marketplace Apps.'
keywords: [ 'filecloud','marketplace', 'server']
tags: ["cloud-manager","linode platform", "marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-18
modified: 2020-03-18
modified_by:
  name: Linode
title: "How to Deploy a FileCloud Server with Marketplace Apps"
h1_title: "Deploying a FileCloud Server with Marketplace Apps"
contributor:
  name: Linode
external_resources:
- '[FileCloud Official](https://www.getfilecloud.com/supportdocs/display/cloud/Home)'
aliases: ['/platform/marketplace/deploy-filecloud-with-marketplace-apps/', '/platform/one-click/deploy-filecloud-with-one-click-apps/']
---

## FileCloud Marketplace App

FileCloud is a cloud-based file-sharing application, similar to tools like Dropbox, that allows users to remotely access, upload, and sync hosted files.

## Deploy FileCloud with Marketplace Apps

{{< content deploy-marketplace-apps >}}

### FileCloud Options

| **Configuration** | **Description** |
|-------------------|-----------------|
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **The subdomain for Linode's DNS record** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **The domain for the Linode's DNS record** | The domain name where you wish to host your FileCloud server. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **Would you like to use a free CertBot SSL certificate?** | Select `Yes` if you would like the install to create an SSL certificate for you, or `No` if you do not. You cannot create secure, encrypted conferences without an SSL certificate. |
| **E-Mail Address for Let's Encrypt Certificate** |  E-mail address used as the start of authority (SOA) email address for this server and for Let's Encrypt installation. This email address is added to the SOA record for the domain. This is a required field if you want the installer to create DNS records. |
| **The SSH Public Key that will be used to access the Linode** | If you wish to access [SSH via Public Key](/docs/security/authentication/use-public-key-authentication-with-ssh/) (recommended) rather than by password, enter the public key here. |
| **Disable root access over SSH?** | Select `Yes` to block the root account from logging into the server via SSH. Select `No` to allow the root account to login via SSH. |

### Linode Options

After providing the app-specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|-------------------|-----------------|
| **Select an Image** | Debian 9 and Ubuntu 18.04 are currently the only images supported by the FileCloud Marketplace App, and it is pre-selected on the Linode creation page. *Required* |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). You can use any size Linode for your FileCloud App. The Linode plan that you select should be appropriate for the amount of data transfer, users, storage, and other stress that may affect the performance of server.  *Required* |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name is how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required* |
| **The limited sudo user to be created for the Linode** | This is the limited user account to be created for the Linode. This account has sudo user privileges. |
| **The password for the limited sudo user** | Set a password for the limited sudo user. The password must meet the complexity strength validation requirements for a strong password. This password can be used to perform any action on your server, similar to root, so make it long, complex, and unique. |

When you've provided all required Linode Options, click on the **Create** button. **Your FileCloud app will complete installation anywhere between 2-5 minutes after your Linode has finished provisioning**.

## Setting up the FileCloud Server

Once the FileCloud server is up and running, a few additional steps must be completed before you can begin using your application.

### Creating Secure Login Credentials

A new administrator password must be created to secure the server:

1. Log in to the FileCloud admin page with the default log-in information at the following URL, replacing `my-ip-or-domain` with the IP address of your Linode or domain you set up on initial installation:

    `http://my-ip-or-domain/admin`

1. In the login fields that appear, enter the default credentials:

| **Login Field** | **Credential** |
|-------------------|-----------------|
| **Username** | admin |
| **Password** | password |

![Admin Login Page](filecloud-admin-login.png)

1. A number of messages and warnings appear. For now, dismiss them to clear your screen.

1. Navigate to the **Settings** sidebar option, followed by the **Admin** tab. Click on the **Reset Admin Password** to reset your Admin Password to something more secure.

![FileCloud Admin Page](filecloud-admin-pass.png)
1. Follow the prompts and select the **Reset Password** button to complete the password reset.

1. If the password reset was successful, you are logged out and redirected to the administrator login page. Enter the administrator username and your new password to proceed.

### Obtain a new License Key

FileCloud by default is inaccessible without either a trial or paid license key provided by FileCloud.

1. To obtain a trial license key, sign on or create an account at FileCloud's customer portal at the following address:

    https://portal.getfilecloud.com/ui/user/index.html#

After logging in to your new account, click on the `Begin Trial` button and follow the prompts to obtain a new trial license key file.

1. Alternatively, licenses can be purchased or renewed by following instructions at the Link below:

    https://www.getfilecloud.com/supportdocs/display/cloud/FileCloud+-+License+Purchase+And+Renewal

1. Once you have a valid license key, log in to the FileCloud administrator page at the Linode's IP address or the domain you specified during installation. After a new successful login, you will see the `Action Items` popup.

{{< note >}}
New Licenses can also be added at any time by selecting the `Settings` sidebar option followed by and the `License` tab.
{{< /note >}}

1. Select the `Install License` button, followed by `Choose File` to upload your `license.xlm` file and tie your License Key to the FileCloud installation.

![FileCloud License](filecloud-license.png)

{{< content "marketplace-update-note">}}