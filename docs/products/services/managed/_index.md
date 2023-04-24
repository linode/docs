---
title: Managed
title_meta: "Linode Managed Service Product Documentation"
description: "Linode Managed is a service that offers incident response as well as free migrations and discounted professional services."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    product_description: "A suite of services that includes a robust monitoring system, 24/7 incident response, backups, and cPanel licenses."
aliases: ['/guides/platform/managed/']
published: 2023-04-11
---

Downtime is expensive and puts your company’s reputation at risk. [Linode Managed](https://www.linode.com/products/managed/) helps minimize this risk through a suite of services and products aimed at monitoring your Compute Instances, minimizing downtime, protecting your data, and migrating to the Linode Platform.

{{< note >}}
Linode Managed applies to all Compute Instances on an account **except** for nodes created and implemented by the [Linode Kubernetes Engine (LKE)](https://www.linode.com/products/kubernetes/). All eligible nodes are billed at a rate of $100 per month for each Linode. If this service is not needed for all instances, a second account can be created to separate Managed Compute Instances from non-Managed ones. To move instances between accounts, review the [Transfer Services to a Different Account](/docs/products/platform/accounts/guides/service-transfers/) guide.
{{< /note >}}

## Benefits

- **24/7 Monitoring and Incident Response:** The core benefit of Linode Managed is 24/7 monitoring and incident response. You can configure monitors for URLs, IP addresses, or TCP ports. This monitor periodically makes a TCP or HTTP request to that property. If a check fails, our experts take immediate steps to get your systems back online as quickly as possible. If they are not able to fix the issue, our experts will share their findings and the steps they've taken so far. Managed services does not include assistance with maintenance, updates, or the configuration of software on your Compute Instances. For that, contact our [Professional Services](https://www.linode.com/products/pro-services/) team.

- **Included Services and Software:** The following services and software applications are included at no additional charge to Linode Managed customers

    - [cPanel](https://cpanel.net/): A cPanel license is included for each Compute Instance on your Linode account. Each license automatically scales to accommodate the number of [cPanel accounts](https://support.cpanel.net/hc/en-us/articles/1500004931582-What-is-an-Account/) you've configured within the cPanel installation.
    - [Backups](/docs/products/storage/backups/): The Backup service is added to each Compute Instance on your account for no extra charge. This service automatically backs up the Compute Instance each day and allows you to restore from the most recent daily backup, weekly backup, and biweekly backup. See [Get Started with Backups](/docs/products/storage/backups/get-started/) for more information on backup restore points.
    - [Longview Pro](/docs/guides/linode-longview-pricing-and-plans/): Longview is our own metric service designed to help you keep track of your Compute Instances' performance. Whereas the free version of Longview is limited to collecting data at 5 minute intervals and storing only 12 hours worth of historical data, Longview Pro dramatically increases the data collection intervals and retains this data for longer:
        - 1 minute resolution for the past 24 hours
        - 5 minute resolution for the past week
        - 2 hour resolution for the past month
        - 1 day resolution for the past year

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