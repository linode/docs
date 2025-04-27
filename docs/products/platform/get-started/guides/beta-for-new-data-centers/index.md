---
title: "Limited Beta for Akamai's New Data Centers"
description: "This document provides details for the limited availability beta of Akamai Cloud Compute's latest data centers."
published: 2023-04-17
modified: 2024-07-31
tags: ["linode platform"]
_build:
  list: false
noindex: true
aliases: ['/products/platform/get-started/guides/iad/']
---

Akamai is expanding its services to new data centers across the globe. Each new data center will undergo a beta period, where a limited number of interested customers can deploy services in these regions. Premium plans are available in new data centers. As a beta participant, please review this guide for additional specifications and details you may need when configuring your workloads in the one of these data centers.

{{< note type="warning" >}}
Capacity in beta data centers may be limited as we continue to scale up resources. Additionally, the beta environment is subject to change. We strongly suggest that participants do not run production workloads during the beta.
{{< /note >}}

## List of Beta Data Centers

| Data Center | Status | Region ID |
| -- | -- | -- |
| London 2, United Kingdom | **Now available to all customers** | `gb-lon` |
| Melbourne, Australia | **Now available to all customers** | `au-mel` |

## Deploy Services in a Beta Data Center

Follow the instructions below to target one of the new data centers when deploying a service.

-   **Cloud Manager:** Select the name of the data center you wish to use in the region dropdown menu.

-   **Linode CLI and Linode API:** If a command or request requires a region ID, use the one that corresponds to your desired data center in the [table above](#list-of-new-data-centers).

{{< note type="warning" noTitle=true >}}
You must be enrolled in the beta to select a beta data center when deploying services. If you are a beta participant but are not able to target a beta data center, please contact the [Support team](https://www.linode.com/support/) for assistance. You need to request access to *each* data center you wish to use during the beta period.
{{< /note >}}

## Pricing

Services used as part of the beta are free to users. Once the beta period ends for a particular data center, you will start accruing charges for any services that are still deployed to that region. You will receive an email notifying you of the billing start date as we transition each data center to general availability.

## Product Availability

Each data center in this beta is slated to have most of Akamai’s cloud computing services available during the beta period. In addition, we are launching a new Premium Plan tier and have made improvements to our Object Storage service.

### Object Storage

The London 2 (gb-lon) and Melbourne (au-mel) data centers do not support Object Storage.

### Premium Plans

[Premium tier](/docs/products/compute/compute-instances/plans/premium/) Dedicated CPU Compute Instance plans are available only in newer data centers, including those in beta. These plans are in addition to our standard tier Dedicated CPU, Shared CPU, and High Memory instance types. These Premium instances guarantee a baseline hardware class that includes new AMD EPYC™ CPUs. These Premium offerings are built for applications with critical performance needs such as enterprise video encoding, AI, CI/CD, build servers, and data analysis.

The table below outlines the default pricing and hardware specifications for Premium tier Dedicated CPU Instances. [Pricing](https://www.linode.com/pricing/) may vary by region:

| <div class="w-40">Plan</div> | <div class="w-36">Price</div> | RAM (GB) | CPU Cores | Storage (GB) | Transfer (TB) | Network In/Out (Gbps)
| --- |  --- | --- | --- | --- | --- | --- | --- |
| Premium 4 GB   | $43/mo ($0.06/hr)    | 4   | 2  | 80    | 4  | 40/4  |
| Premium 8 GB   | $86/mo ($0.13/hr)    | 8   | 4  | 160   | 5  | 40/5  |
| Premium 16 GB  | $173/mo ($0.26/hr)   | 16  | 8  | 320   | 6  | 40/6  |
| Premium 32 GB  | $346/mo ($0.52/hr)   | 32  | 16 | 640   | 7  | 40/7  |
| Premium 64 GB  | $892/mo ($1.04/hr)   | 64  | 32 | 1,280 | 8  | 40/8  |
| Premium 96 GB  | $1,037/mo ($1.56/hr) | 96  | 48 | 1,920 | 9  | 40/9  |
| Premium 128 GB | $1,383/mo ($2.07/hr) | 128 | 50 | 2,500 | 10 | 40/10 |
| Premium 256 GB | $2,765/mo ($4.15/hr) | 256 | 56 | 5,000 | 11 | 40/11 |
| Premium 512 GB | $5,530/mo ($8.29/hr) | 512 | 64 | 7,200 | 12 | 40/12 |

Premium CPU plans can also be deployed as worker nodes in Linode Kubernetes Engine (LKE) clusters. There is no additional cost for Premium plan LKE worker nodes beyond the price listed in the Premium pricing table above.

{{< note isCollapsible=true title="Details of the Backup service for Premium CPU Plans" >}}
Optionally, you can also add the [Backup](/docs/products/storage/backups/) service to a Premium instance. The default prices for this service are outlined below. [Pricing](https://www.linode.com/pricing/) may vary by region:

| <div class="w-40">Plan</div> | Price for the Backup service |
| --- | --- |
| Premium 4 GB  | $5/mo ($0.008/hr)    |
| Premium 8 GB  | $10/mo ($0.015/hr)   |
| Premium 16 GB | $20/mo ($0.03/hr)   |
| Premium 32 GB | $40/mo ($0.06/hr)   |
| Premium 64 GB | $80/mo ($0.12/hr)   |
| Premium 96 GB | $120/mo ($0.18/hr)  |
| Premium 128 GB | $160/mo ($0.24/hr) |
| Premium 256 GB | $200/mo ($0.30/hr) |
| Premium 512 GB | $240/mo ($0.36/hr) |
{{< /note >}}

## Additional Specifications

### IP Sharing and Failover

Beta data centers support IP sharing and BGP-based failover, which can be configured on IPv4 addresses (public and private) and addresses from IPv6 routed ranges (/64 and /56). To configure failover, you can use [lelastic](https://github.com/linode/lelastic), Linode's own software, or software like FRR, BIRD, or GoBGP. For more information on failover, consult our [failover documentation](/docs/products/compute/compute-instances/guides/failover/).

| Data Center | IP Sharing Support | Failover Method | Software | ID |
| --- | --- | --- | --- | --- |
| London 2, United Kingdom | Supported | BGP-based (new) | [lelastic](/docs/products/compute/compute-instances/guides/failover/#configure-failover) / [FRR](/docs/products/compute/compute-instances/guides/failover-bgp-frr/) | 44 |
| Melbourne, Australia | Supported | BGP-based (new) | [lelastic](/docs/products/compute/compute-instances/guides/failover/#configure-failover) / [FRR](/docs/products/compute/compute-instances/guides/failover-bgp-frr/) | 45 |

### Lish Gateways

Lish and Glish provide direct access to your Compute Instances, bypassing the need for SSH or a VNC. For more information on Lish, consult our guide on how to [Access Your System Console Using Lish](/docs/products/compute/compute-instances/guides/lish/).

#### London 2, United Kingdom

-   **Lish SSH Gateway:** `lish-gb-lon.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:EIKjJlF0nmpuj795Y4DhwYjIMCDa2yodWKk9rKxg67o lish-gb-lon.linode.com
    ECDSA 256 SHA256:MvMwule197MvqJIjvJq7vjnxlvX0XveAocRPDs5jbMA lish-gb-lon.linode.com
    ED25519 256 SHA256:4IUSmmru/F/Q4nHVZjBZUzSol7XLaE33i8hLPD8VJ2o lish-gb-lon.linode.com
    ```
    {{< /note >}}

-   **Weblish/Glish Gateway:** `gb-lon.webconsole.linode.com`

#### Melbourne, Australia

-   **Lish SSH Gateway:** `lish-au-mel.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:JX2eVSdHIJzb3iDJFpTtHVGQq1paEh53D9cnsEPNvvU lish-au-mel.linode.com
    ECDSA 256 SHA256:88mN/wieI4kG1rkuohob3ZyqhvCMiMWiCTVN1XECvLU lish-au-mel.linode.com
    ED25519 256 SHA256:e8xMMpHXjDRi9vSiNliiMEHtsKzAjGdG0WkeFS3W1RU lish-au-mel.linode.com
    ```
    {{< /note >}}

-   **Weblish/Glish Gateway:** `au-mel.webconsole.linode.com`
