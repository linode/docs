---
title: Get Started
title_meta: "Getting Started with the Linode Managed Service"
description: "Learn how to get up and running with Linode Managed and start monitoring your Compute Instances."
tab_group_main:
    weight: 20
keywords: ["managed", "managed services", "linode managed"]
aliases: ['/products/services/managed/guides/sign-up/','/linode-managed/','/uptime/linode-managed/','/platform/linode-managed-classic-manager/','/platform/linode-managed/','/guides/linode-managed/']
published: 2023-04-11
authors: ["Linode"]
---

[Linode Managed](https://www.linode.com/products/managed/) is a 24/7 incident response service coupled with Longview Pro, the Backup service, cPanel, additional dashboard metrics, and free site migrations. This robust, multi-homed monitoring system sends out monitoring checks to ensure that your monitored services remain online and available at all times. Managed Services can monitor any service or software stack reachable over TCP or HTTP.

## Enable Managed Services

Follow the instructions below to sign up for Managed Services.

{{< note type="warning" >}}
This is an account-wide setting. Enabling Managed Services will result in additional charges *for each* Compute Instance on your account. If you would like to only enable this for some instances and not others, you will need to create a separate account and transfer any services you do (or do not) want to have managed. See [Transferring Ownership of Linode Services with Service Transfers](/docs/products/platform/accounts/guides/service-transfers/).
{{< /note >}}

1. Log in to the [Cloud Manager](https://cloud.linode.com) and click the **Account** link in the sidebar.

1. Navigate to the **Settings** tab and click the **Add Linode Managed** button at the bottom of this page.

1. A confirmation dialog appears that outlines the total cost of the service for your account. Click the **Add Linode Managed** button in this confirmation dialog to enable Managed Services.

## Initial Setup

After signing up for Managed Services, the next steps are to configure which services or resources you'd like to monitor on your Compute Instances, allow the Support team to log in to the Compute Instances and access these services, and then let the Support team know who to contact in case of a failure.

1. **Provide access to the Support team:** In order to investigate any issues with your Compute Instances, our Support team requires access to those instances. Because of this requirement, you should install your unique Managed Services public key on any instances you intend for us to monitor. You may also need to add any credentials that are specific to the applications or services you are running. For example, if you run a WordPress site that communicates with a MySQL database, you should provide the MySQL username and password if you would like us to troubleshoot it in the event of outage for your site. See the following guides:

    - [Configure SSH Access](/docs/products/services/managed/guides/ssh-access/)
    - [Manage Credentials](/docs/products/services/managed/guides/credentials/)
    - [Configure Firewall Rules to Allow Access from Linode Infrastructure](/docs/products/services/managed/guides/allow-access-from-linode-infrastructure/)

1. **Configure contacts:** If a service monitor fails a check, all associated contacts are notified. Contacts may also be contacted by the Support team if additional information is needed when troubleshooting. See [Manage Contacts](/docs/products/services/managed/guides/contacts/).

1. **Create service monitors:** Next, configure the actual monitors that are responsible for watching a particular website or service and checking for issues. You can even add checks to make sure specific strings of text appear on your monitored website or in the response body of your service. See [Create and Manage Service Monitors](/docs/products/services/managed/guides/service-monitors/).

## Optional: Install cPanel

Each Compute Instance on a Managed account is eligible to receive a [cPanel](https://cpanel.net/) license at no additional charge.

1. **Installing cPanel:** The easiest method to quickly get cPanel up and running is to deploy a new Linode using the [cPanel Marketplace App](https://www.linode.com/marketplace/apps/cpanel/cpanel/). Review the [How to Deploy cPanel with Marketplace Apps](/docs/products/tools/marketplace/guides/cpanel/) guide for additional instructions. If the cPanel Marketplace App does not support your desired Linux distribution, you can also follow the instructions within the [Install cPanel on CentOS](/docs/guides/install-cpanel-on-centos/) guide or the [Installation Guide](https://docs.cpanel.net/installation-guide/) on cPanel's documentation site. At this time, cPanel supports the following Linode-provided distribution images: CentOS 7, AlmaLinux 8, Rocky Linux 8, and Ubuntu 20.04 LTS. See [What operating systems are supported by cPanel](https://support.cpanel.net/hc/en-us/articles/1500001216582-What-operating-systems-are-supported-by-cPanel-) for a full list.

1. **Obtaining a License:** Contact the Support team to obtain a cPanel license for your Linode. If you do not subscribe to Linode Managed, you will need to obtain your license directly from cPanel. cPanel is typically licensed by the number of accounts within the cPanel installation, each account typically corresponding to a single website or group of similar websites. The license we provide will automatically scale based on the number of cPanel accounts you've configured.