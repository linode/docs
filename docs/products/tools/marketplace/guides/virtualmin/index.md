---
author:
  name: Linode Community
  email: docs@linode.com
description: "Virtualmin is an open source control panel for web hosting management. Deploy a Virtualmin server using Linode''s Marketplace Apps."
keywords: ['virtualmin','control panel','dashboard','marketplace']
tags: ["debian","marketplace", "web applications","linode platform", "cloud manager", "cms", "email"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-09-28
modified: 2022-03-08
image: Deploy_Virtualmin_oneclickapps.png
modified_by:
  name: Linode
title: "Deploying Virtualmin through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[Virtualmin Documentation](https://www.virtualmin.com/documentation)'
- '[Virtualmin Support](https://www.virtualmin.com/support)'
aliases: ['/platform/marketplace/how-to-deploy-virtualmin-with-marketplace-apps/', '/platform/one-click/how-to-deploy-virtualmin-with-one-click-apps/','/guides/how-to-deploy-virtualmin-with-one-click-apps/','/guides/how-to-deploy-virtualmin-with-marketplace-apps/', '/platform/one-click/deploy-virtualmin-with-one-click-apps/','/guides/virtualmin-marketplace-app/']
---

[Virtualmin](https://www.virtualmin.com) is an open source control panel for web hosting management. It offers an easy to use graphical interface for managing websites, email, and databases. It's built on top of and integrated with the popular Webmin.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** Virtualmin should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Debian 10
- **Recommended minimum plan:** All plan types and sizes can be used.

### Virtualmin Options

{{< content "marketplace-limited-user-fields-shortguide">}}
- **Enable passwordless sudo access for the limited user?** Select **Yes** to [disable SSH password authentication](/docs/guides/set-up-and-secure/#ssh-daemon-options) for your limited sudo user as an additional security measure. Requires an **SSH Public Key** for SSH access to your Linode.

#### Additional Security Configuration

- **Configure automatic security updates?** Select **Yes** to enable [automatic security updates](/docs/guides/set-up-and-secure/#automatic-security-updates) for your Linode.
- **Use fail2ban to prevent automated instrusion attempts?** Select **Yes** to enable [SSH login protection with Fail2Ban](/docs/guides/using-fail2ban-to-secure-your-server-a-tutorial/) as an additional security measure.

{{< content "marketplace-custom-domain-fields-shortguide">}}
- **SOA Email for your domain** The email address to register as your Start of Authority (SOA). This field is required for creating DNS records for a new domain.
- **Do you need an MX record for this domain?** Select **Yes** to automatically configure an [MX record](/docs/guides/dns-records-an-introduction/#mx) for the purpose of sending emails from your instance.
- **Do you need an SPF record for this domain?** Select **Yes** to automatically configure an [SPF record](/docs/guides/dns-records-an-introduction/#spf) for the purpose of sending emails from your instance.

## Getting Started after Deployment

Virtualmin is now installed and ready to use.

1.  Before you go to our app, if you filled out the optional Virtualmin configuration fields:

    - In the Cloud Manager [DNS Manager](/docs/guides/dns-manager/#add-a-domain) there is now an entry for your domain with possible subdomain, MX, and SPF records pointing to your new server.
    - [Configure the rDNS](/docs/guides/configure-your-linode-for-reverse-dns/) on your Linode.

1.  Virtualmin is served on port 10000, to access it, navigate to either the IP address of your server or to your domain name followed by port 10000. For example, `http://example.com:10000` or `http://203.0.113.0:10000`, replacing the domain name or IP address with values for your server.

    ![Virtualmin Login Screen](virtualmin-login-screen.png "Virtualmin Login Screen")

1.  At the login screen, login using either:

    - The system root username and password
    - The sudo username and password if you set that up in the Virtualmin optional configuration during installation.

1.  After logging in for the first time, a Post-Installation Wizard walks you through some initial setup to optimize your system. If you choose `Cancel` the wizard will use the default settings.

    ![Virtualmin Post-Installation Wizard](virtualmin-post-installation-wizard.png "Virtualmin Post-Installation Wizard")

1.  On the main dashboard, Virtualmin must check its configuration before virtual servers can be added. Click the **Re-check and refresh configuration** button.

    ![Virtualmin Check Configuration](virtualmin-check-config.png "Virtualmin Check Configuration")

1.  Virtualmin checks your system and returns a list of statuses and recommendations that you can choose to take action on if desired.

    ![Virtualmin Check Configuration Results](virtualmin-check-config-results.png "Virtualmin Check Configuration Results")

1.  Click the **Return to virtual servers list** button at the bottom of the screen when you are finished. You are now ready to start administering your server.

    ![Virtualmin Virtual Servers Page](virtualmin-virtual-servers-page.png "Virtualmin Virtual Servers Page")

{{< content "marketplace-update-note-shortguide">}}
