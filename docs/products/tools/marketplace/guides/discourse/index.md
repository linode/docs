---
description: "In this guide, learn how to install Discourse, an open source discussion platform that provides powerful features using the Linode One-Click Marketplace."
keywords: ['discourse','one-click', 'server']
tags: ["ubuntu","one-click", "web applications","linode platform", "cloud manager"]
published: 2020-11-19
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploy Discourse through the Linode Marketplace"
external_resources:
- '[About Discourse](https://discourse.org/about/)'
- '[Discourse on Github](https://github.com/discourse/discourse)'
- '[Discourse Community](https://meta.discourse.org)'
aliases: ['/platform/marketplace/how-to-deploy-discourse-with-marketplace-apps/','/guides/deploy-discourse-with-marketplace-apps/','/guides/discourse-marketplace-app/']
authors: ["Linode"]
---

[Discourse](https://www.discourse.org/) is a self-hosted open-source discussion platform that provides a forum, mailing list, chat room, and more.

## Before You Begin

Discourse requires that you have a domain name and access to a personal SMTP email server before installation. This requires either having access to a pre-existing SMTP server, or setting up an [SMTP Relay](https://www.linode.com/community/questions/387/does-linode-offer-an-smtp-relay-service) through a third party. The Discourse Marketplace App **requires** an SMTP username and password for a server under your control in order to successfully complete the installation.

  - If you don't already have your domain hosted at Linode, the install creates A and AAAA domain records for you.

    - This means you need a Linode API token. If you don't have a token, you must [create one](/docs/products/tools/api/get-started/#get-an-access-token) before continuing.

    - Ensure that your domain registrar is [using Linode's name servers](/docs/products/networking/dns-manager/guides/authoritative-name-servers/).

  - Additionally, the SMTP user must be able to send email from `noreply@your-domain.com` for administrator account verification.

    - For example, if you enter a subdomain of `discourse` and your domain name is `example.com`, then the SMTP user must be able to send email from `noreply@discourse.example.com`.

    - You are not required to use a subdomain. Therefore, if you only setup `example.com` with no subdomain, the email used for verification would be `noreply@example.com`.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Discourse should be fully installed within 15-20 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended minimum plan:** 4GB Shared Compute Instance

### Discourse Options

- **Email for Admin Account and Let's Encrypt certificate:** The email you wish to use for the administrator account and the SSL certificate. This email address receives notifications when the certificate needs to be renewed.
- **SMTP Address:** The address for SMTP. Discourse uses this for sending email.
- **SMTP Username:** The username for the SMTP account entered above. The SMTP user must be able to send email from `noreply@your-fully-qualified-domain.com` for account verification.
- **Password for SMTP User:** The password for the SMTP account listed above.

#### Custom Domain

Discourse requires that you have a domain name and SMTP email. These fields are required for a successful installation and are marked *Required*. Additionally, the SMTP user must be able to send email from `noreply@your-fully-qualified-domain.com` for account verification.

- **Linode API Token:** If you wish to use the Linode's [DNS Manager](/docs/products/networking/dns-manager/) to manage DNS records for your custom domain, create a Linode API *Personal Access Token* on your account with Read/Write access to *Domains*. If this is provided along with the subdomain and domain fields (outlined below), the installation attempts to create DNS records via the Linode API. See [Get an API Access Token](/docs/products/tools/api/guides/manage-api-tokens/). If you do not provide this field, you need to manually configure your DNS records through your DNS provider and point them to the IP address of the new instance.
- **Subdomain:** The subdomain you wish to use, such as *www* for `www.example.com`.
- **Domain:** The domain name you wish to use, such as *example.com*.

{{< content "marketplace-limited-user-fields-shortguide">}}

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started After Deployment

Discourse is now installed and ready to use.

1.  Your A and AAAA Domain records for the domain and subdomain, if you designated one, have been created and you should see them in the Cloud Manager.

    - In the Cloud Manager [DNS Manager](/docs/products/networking/dns-manager/guides/create-domain/), confirm that there are now an entries for your domain and possible subdomain.
    - [Configure rDNS](/docs/products/compute/compute-instances/guides/configure-rdns/) on your Linode to point to `subdomain.your-domain.com` or `your-domain.com` if you did not enter a subdomain.

1.  While the installation has created the A and AAAA domain records, it does not create the email records you need. In the Cloud Manager DNS Manager, [add the MX, TXT, and any other records](/docs/products/networking/dns-manager/guides/manage-dns-records/) required to send email as specified by your email provider.

1.  You can now navigate to the Discourse app in your browser with the fully qualified domain name you entered during configuration, `https://subdomain.your-domain.com` or `https://your-domain.com`.

1.  Discourse welcomes you with a "Congratulations" screen and a **Register** button. Click the **Register** button to create the administrator account.

    ![Discourse Installation Congratulations Screen](discourse-installation-congrats-screen.png "Discourse Installation Congratulations Screen")

1.  On the Register Admin Account page, select one of the email addresses you entered during installation and enter a Username and Password. Then click the **Register** button.

    ![Discourse Register Admin Account Page](discourse-register-admin-account.png "Discourse Register Admin Account Page")

1.  Discourse sends a confirmation email for account verification from your SMTP server. After you receive the email and confirm, you are redirected to the welcome screen where you are walked through a wizard to setup your Discourse.

    ![Welcome to Discourse](discourse-welcome-screen.png "Welcome to Discourse")

1.  Once you are finished the setup wizard, Discourse launches the main discussion listing page where you can start adding discussion topics.

    ![Discourse Main Discussion Page](discourse-main-discussion-page.png "Discourse Main Discussion Page")

## Software Included

The Discourse Marketplace App installs the following software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Discourse**](https://www.discourse.org/) | Discourse is an open source discussion platform that provides a forum, mailing list, chat room, and more. |
| [**ufw**](https://wiki.ubuntu.com/UncomplicatedFirewall) | ufw is the uncomplicated firewall, a frontend for iptables.  |

{{< content "email-warning-shortguide" >}}

{{< content "marketplace-update-note-shortguide">}}

## Troubleshooting Email

If you did not get a confirmation email during setup it could be caused by several issues.

### Check DNS Records
Ensure that you have correctly setup the [email DNS records](/docs/products/networking/dns-manager/guides/manage-dns-records/) required to send email as specified from your email provider. The Installer does not do this for you as every email host has different required records and values.

### Change the Confirmation Email Sender
Discourse sends this email from `noreply@subdomain.your-domain.com`. The SMTP user you entered during setup must have permissions to send from this address. If this is not the case, and you did not receive the email, you can change this address in a configuration file.

1.  [Connect to your Marketplace App's Linode via SSH](/docs/products/compute/compute-instances/guides/set-up-and-secure/#connect-to-the-instance).

1.  Change into the directory `/var/discourse/containers/`:

        cd /var/discourse/containers

1.  Edit the file `app.yml` with the text editor of your choice. Uncomment the following line and edit the email address to the email you wish to send the confirmation email from. The SMTP user must have permissions to send email from this address.

    ```file {title="/var/discourse/containers/app.yml"}
    ...

    ## If you want to set the 'From' email address for your first registration, uncomment and change:
    - exec: rails r "SiteSetting.notification_email='noreply@example.com'"
    ## After getting the first signup email, re-comment the line. It only needs to run once.

    ...
    ```

1.  Save the file and exit.

1.  Change directory into `/var/discourse` and rebuild Discourse.

        cd ..
        ./launcher rebuild app

1.  Once Discourse has finished rebuilding, return to the confirmation email page in the browser and try again.