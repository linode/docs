---
slug: deploy-nirvashare-with-marketplace-apps
author:
  name: Linode Community
  email: docs@linode.com
description: 'A simplified secure enterprise level file sharing solution on top of your existing file storage.'
og_description: 'A simplified secure enterprise level file sharing solution on top of your existing file storage.'
keywords: ['storage','file sharing', and 'backups']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-20
modified_by:
  name: Linode
title: "Deploy NirvaShare With Marketplace Apps"
h1_title: "How to Deploy NirvaShare With Marketplace Apps"
enable_h1: true
external_resources:
- '[NirvaShare](https://nirvashare.com/)'
---

## NirvaShare Marketplace App

Securely share and collaborate Linode S3 object storage files/folders with your internal or external users such as customers, partners, vendors, etc with fine access control and in a very simplified manner.
While granting access to users, set authentications such as Basic, Form, OTP and SAML along with other security restrictions.
Easily integrates with multiple many external identity providers such as Active Directory, GSuite, AWS SSO, KeyClock, etc
The FREE edition supports Basic, Form and OTP authentication along with many great features.
To tryout advanced features contact us to obtain trial license.

### Deploy a NirvaShare Marketplace App

{{< content "deploy-marketplace-apps">}}

### NirvaShare Options
<!-- The following table has three parts. The UDF name, in bold and in one column, followed by
     UDF description in the second column. The description is in normal text, with an optional
     "Required." tag at the end of the description, in italics, if the field is mandatory. -->
You can configure your NirvaShare App by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **Database Password** | The database password for NirvaShare. *Required*. |

### Linode Options

After providing the App-specific options, provide configurations for your Linode server:
<!-- Be sure to edit the Select an Image and Linode Plan to match app's needs -->

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Ubuntu 20.04 LTS is currently the only image supported by the NirvaShare Marketplace App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). NirvaShare can be supported on any size Linode, but we suggest you deploy your NirvaShare App on a Linode plan that reflects how you plan on using it. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name is how you identify your server in the Cloud Manager Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

<!-- the following disclaimer lets the user know how long it will take
     to deploy the app -->
After providing all required Linode Options, click on the **Create** button. **Your NirvaShare App will complete installation anywhere between 5-10 minutes after your Linode has finished provisioning**.

## Getting Started after Deployment

After NirvaShare has finished installing, you can access your NirvaShare instance by visiting your [Linode's IP address](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/). (for example, `http://192.0.2.0`)

Once you visit the NirvaShare IP address you will be prompted with a Login page, you can enter `admin` as the *username* and `admin` as the *password*. 

![Nirvashare Login.](nirvashare-login.png)

From here, you will want to change the default admin password, you can do so clicking the icon at the top right of the dashboard and select *Change Password* option as shown in the image below:

![Nirvashare Change Password.](nirvashare-changepassword.png)

Now that you’ve accessed your dashboard, checkout [the official NirvaShare documentation](https://nirvashare.com/setup-guide/) to learn how to further configure your instance.

{{< content "marketplace-update-note">}}