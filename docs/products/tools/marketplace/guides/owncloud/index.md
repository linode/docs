---
description: "Learn how to deploy ownCloud Server, a self-hosted file-sharing and collaboration platform on the Linode Marketplace."
keywords: ['owncloud','filesharing','collaboration']
tags: ["marketplace", "linode platform", "cloud manager"]
published: 2023-05-30
title: "Deploy ownCloud through the Linode Marketplace"
external_resources:
- '[ownCloud](https://owncloud.com/)'
authors: ["Holden Morris"]
---

ownCloud is a self-hosted file sharing and collaboration platform. It allows users to securely access and share files, calendars, and contacts from any device. With ownCloud, you have complete control over your data and can easily share files with others while maintaining full privacy and security. The app is easy to install and setup on Debian, and offers a wide range of features such as file syncing, versioning, access control and more.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** ownCloud should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Debian 11
- **Recommended plan:** All plan types and sizes can be used.

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

## Getting Started after Deployment

After deployment, follow the instructions below to access your application.

### Accessing the ownCloud App

Open your web browser and navigate to `https://[domain]`, replacing *[domain]* with the domain entered during the deployment or rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses and rDNS. You will be presented a login field where you can enter the credentials you previously specified in the *ownCloud Username* and *ownCloud Password* fields when you deployed the app.

Now that you’ve accessed your ownCloud instance, check out [the official ownCloud documentation](https://doc.owncloud.com/server) to learn how to further utilize your ownCloud instance.

{{< content "marketplace-update-note-shortguide">}}
