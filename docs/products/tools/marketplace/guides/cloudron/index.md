---
description: "Cloudron is a platform that makes it easy to install, manage and secure web apps on a server. Deploy Cloudron on a Linode with Marketplace Apps."
keywords: ['cloudron','web apps','platform','marketplace']
tags: ["ubuntu","marketplace", "web applications","linode platform", "cloud manager"]
published: 2020-12-15
modified: 2022-05-17
modified_by:
  name: Linode
title: "Deploy Cloudron through the Linode Marketplace"
external_resources:
- '[Cloudron Documentation](https://docs.cloudron.io)'
aliases: ['/platform/marketplace/how-to-deploy-cloudron-with-marketplace-apps/', '/platform/one-click/how-to-deploy-cloudron-with-one-click-apps/','/guides/how-to-deploy-cloudron-with-one-click-apps/','/guides/deploy-cloudron-with-marketplace-apps/','/guides/cloudron-marketplace-app/']
authors: ["Linode"]
---

[Cloudron](https://www.cloudron.io) is a platform that makes it easy to install, manage, and secure web apps on a server. Cloudron provides a centralized way to manage users and specify which apps they can access.

{{< note >}}
Cloudron offers both free and paid plans. Visit [Cloudron's website](https://www.cloudron.io/pricing.html) to view available plans and pricing information.
{{< /note >}}

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** Cloudron should be fully installed within 10-12 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used.

## Getting Started after Deployment

The Cloudron application is served on the Linode, however it still requires a few additional steps to fully complete the installation process.

1.  The Cloudron setup wizard is served at the IP address of the Linode server . For example, `http://203.0.113.0 `, replacing the IP address with values for the Linode server and accept the self-signed certificate.

    {{< note >}}
    In Chrome, you can accept the self-signed certificate by clicking on Advanced and then click Proceed to <ip> (unsafe). In Firefox, click on Advanced, then Add Exception and then Confirm Security Exception.
    {{< /note >}}

1.  At this point, the Cloudron Domain setup wizard appears.

    ![Cloudron Domain Setup Screen](cloudron-domain-setup.png "Cloudron Domain Setup")

1.  In the setup screen, fill in the fields and click the **Next** button. The **Setup Admin Account** page appears.

    ![Cloudron Setup Admin Screen](cloudron-setup-admin.png "Cloudron Setup Admin Account")

1.  After the account is created, Cloudron prompts you to proceed to the dashboard on completing the setup and displays a confirmation screen.

    ![Cloudron Post-Setup Wizard](cloudron-post-setup.png "Cloudron Post Setup")

{{< content "marketplace-update-note-shortguide">}}
