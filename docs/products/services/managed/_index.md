---
title: Managed
description: "Linode Managed is a service that offers incident response as well as free migrations and discounted professional services."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    product_description: "A suite of services that includes a robust monitoring system, 24/7 incident response, backups, and cPanel licenses."
aliases: ['/guides/platform/managed/']
published: 2023-04-04
---

Downtime is expensive and puts your company’s reputation at risk. [Linode Managed](https://www.linode.com/products/managed/) helps minimize this risk through a suite of services and products aimed at monitoring your Compute Instances, minimizing downtime, protecting your data, and migrating to the Linode Platform.

{{< note >}}
Linode Managed applies to all Compute Instances on an account **except** for nodes created and implemented by the [Linode Kubernetes Engine (LKE)](https://www.linode.com/products/kubernetes/). All eligible nodes are billed at a rate of $100 per month for each Linode. If this service is not needed for all instances, a second account can be created to separate Managed Compute Instances from non-Managed ones. If needed, instances can be transferred by [opening up a Support ticket](/docs/guides/support/#contacting-linode-support) from both accounts and requesting the transfer. You can also contact the support team to install cPanel, add a cPanel license, or transfer a cPanel license.
{{< /note >}}

## Benefits

- **24/7 Monitoring and Incident Response:** The core benefit of Linode Managed is 24/7 monitoring and incident response. You can configure monitors for URLs, IP addresses, or tcp ports. This monitor periodically makes a TCP or HTTP request to that property. If a check fails, our experts take immediate steps to get your systems back online as quickly as possible. If they are not able to fix the issue, they'll let you know their findings and the steps they've taken so far. Managed services does not include assistance with maintenance, updates, or the configuration of software on your Compute Instances. For that, contact our [Professional Services](https://www.linode.com/products/pro-services/) team.

- **Included Services and Software:** The following services and software applications are included at no additional charge to Linode Managed customers

    - [cPanel](https://cpanel.net/): A cPanel license is included for each Linode on your account. cPanel is typically licensed by the number of accounts within the cPanel installation, each account typically corresponding to a single website or group of similar websites. This license will automatically scale based on the number of cPanel accounts you've configured.
    - [Backups](https://www.linode.com/products/backups/): Each Linode on your account will also be subscribed to our Backup service for no extra charge. This service automatically backs up each Linode every day and allows you to restore from the last daily backup, last week's backup, or the previous week's backup.
    - [Longview Pro](/docs/guides/linode-longview-pricing-and-plans/): Longview is our own metric service designed to help you keep track of Linode's performance. Whereas the free version of Longview provides 12 hours worth of data refreshed every 5 minutes, Longview Pro dramatically expands this functionality. It provides all historical data at increased data resolution, including data points for every minute over the last 24 hours.

- **Professional Services:**

    - **Discounted services:** Linode Managed customers receive a 20% discount for any projects completed by our [Professional Services](https://www.linode.com/products/pro-services/) team. This team of experts can handle server installations, configurations, architectures, deployments, one-off sysadmin jobs, site migrations, and more.
    - **Free migrations:** Customers who sign up with Linode Managed for a minimum of 3 months receive 2 free site migrations, performed by our Professional Services team. Use the [Professional Services contact form](https://www.linode.com/products/pro-services/#contactus) to learn more and to schedule your site migrations.

## Pricing

The cost for Linode Managed is $100 per Linode Compute Instance per month. For example, if there are 10 Compute Instances on your account, your total monthly cost will be $1,000.

{{< note >}}
Worker nodes created by the [Linode Kubernetes Engine (LKE)](https://www.linode.com/products/kubernetes/) are not considered Linode Compute Instances for Managed billing purposes. These instances are not billed when enrolling in the Managed service.
{{< /note >}}

## Availability

Managed Services can be added to any account and can be used to monitor services across [all regions](https://www.linode.com/global-infrastructure/).

## Technical Specifications

- Monitors can be configured to send TCP or HTTP requests to an IP address or URL on any TCP port (default port is 80).
    - **TCP:** Periodically initiates a TCP handshake to the specified property.
    - **HTTP:** Periodically sends an HTTP/S request to the specified property and either looks for a `200 OK` response header or a specified string in the response body.
- Credentials can be added to allow our experts access to your system when troubleshooting. These credentials are encrypted and can be revoked by you at any time.