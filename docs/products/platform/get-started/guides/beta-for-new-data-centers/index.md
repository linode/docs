---
title: "Closed Beta for Akamai's New Data Centers"
description: "Details for the closed beta of Akamai Cloud Compute's newest data centers, which include the Washington, DC and Paris regions."
published: 2023-04-17
modified: 2023-07-05
modified_by:
  name: Linode
tags: ["linode platform"]
authors: ["Linode"]
_build:
  list: false
noindex: true
aliases: ['/products/platform/get-started/guides/iad/']
---

Akamai is expanding its services to new data centers across the globe. Each new data center will undergo a beta period, where a limited number of interested customers can deploy services in these regions. All Akamai cloud computing services are fully operational in these data centers. In addition, Premium plans and upgraded Object Storage clusters are *currently* only available in these new data centers (though these services will eventually be rolled out to the entire fleet). As a beta participant, please review this guide for additional specifications and details you may need when configuring your workloads in the one of these data centers.

{{< note type="warning" >}}
Capacity in beta data centers may be limited as we continue to scale up resources. Additionally, the beta environment is subject to change. We strongly suggest that participants do not run production workloads during the beta.
{{< /note >}}

## List of New Data Centers

| Data Center | Status | Region ID |
| -- | -- | -- |
| Chicago, IL, USA | Available to all customers | `us-ord` |
| Paris, France | Available to all customers | `fr-par` |
| Washington, DC, USA | Available to all customers | `us-iad` |

## Deploy Services in a Beta Data Center

Follow the instructions below to target one of the new data centers when deploying a service.

-   **Cloud Manager:** Select the name of the data center you wish to use in the region dropdown menu.

    ![Screenshot of the Cloud Manager region selection dropdown menu](select-washington-dc-cloud-manager.png)

-   **Linode CLI and Linode API:** If a command or request requires a region ID, use the one that corresponds to your desired data center in the [table above](#list-of-new-data-centers).

{{< note type="warning" noTitle=true >}}
You must enrolled in the beta to select one of the new data centers when deploying services. If you are a beta participant but are not able to target one of these data centers, please contact the [Support team](https://www.linode.com/support/) for assistance. You need to request access to *each* data center you wish to use during the beta period.
{{< /note >}}

## Pricing

{{< note >}}
Starting July 1st 2023, services deployed in Chicago, Paris, and Washington, DC will no longer be free for beta participants. Charges will start to accrue for any new or existing services on your account. If you do not wish to be charged for a particular service, be sure to delete it prior to this date.
{{< /note >}}

Services utilized as part of the beta are free to users. Once the beta period ends for a particular data center, you will start accruing charges for any services that are still deployed to that region. You will receive an email notifying you of the billing start date as we transition each data center to general availability.

## Product Availability

Each data center in this beta is slated to have all of Akamai’s cloud computing services available during the beta period. In addition, we are launching a new Premium Plan tier and have made improvements to our Object Storage service.

### Object Storage

The new data centers feature consistent and reliable S3-compatiable Object Storage backed by a 100% SSD-based cluster capable of 750 requests per second per bucket. Object Storage includes 250 GB of storage for a pro-rated $5/month. For more information on pricing, consult our [Object Storage features and limitations](/docs/products/storage/object-storage/#pricing).

For the IDs and URLs of the new Object Storage clusters, see below:

| Data Center | Cluster ID | Cluster URL |
| --| -- | -- |
| Chicago, IL, USA | `us-ord-1` | `https://us-ord-1.linodeobjects.com` |
| Paris, France | `fr-par-1` | `https://fr-par-1.linodeobjects.com` |
| Washington, DC, USA | `us-iad-1` | `https://us-iad-1.linodeobjects.com` |

### Premium Plans

A new Premium tier Dedicated CPU plan type for Compute Instances is available only in the new data centers. This is in addition to our standard tier Dedicated CPU, Shared CPU, and High Memory instance types. These Premium tier instances guarantee a baseline hardware class that includes new AMD EPYC CPUs™. These Premium offerings are built for applications with critical performance needs such as enterprise video encoding, AI, CI/CD, build servers, and data analysis. Below are the pricing and hardware specifications for Premium tier Dedicated CPU Instances:

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

The new Premium plans can also be deployed as worker nodes in Linode Kubernetes Engine (LKE) clusters. There is no additional cost for Premium plan LKE worker nodes beyond the price listed in the Premium pricing table above.

Optionally, you can also add on the [Backup](/docs/products/storage/backups/) service to a Premium instance. The price for this service is outlined below:

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

The new Premium plans can also be deployed as worker nodes in Linode Kubernetes Engine (LKE) clusters. There is no additional cost for Premium plan LKE worker nodes beyond the price listed in the Premium pricing table above.

## Additional Specifications

### IP Sharing and Failover

All new data centers support IP sharing and BGP-based failover, which can be configured on IPv4 addresses (public and private) and addresses from IPv6 routed ranges (/64 and /56). To configure failover, you can use [lelastic](https://github.com/linode/lelastic), Linode's own software, or software like FRR, BIRD, or GoBGP. For more information on failover, consult our [failover documentation](/docs/products/compute/compute-instances/guides/failover/).

| Data Center | IP Sharing Support | Failover Method | Software | ID |
| --- | --- | --- | --- | --- |
| Chicago, IL, USA | Supported | BGP-based (new) | [lelastic](/docs/products/compute/compute-instances/guides/failover/#configure-failover) / [FRR](/docs/products/compute/compute-instances/guides/failover-bgp-frr/) | 18 |
| Paris, France | Supported | BGP-based (new) | [lelastic](/docs/products/compute/compute-instances/guides/failover/#configure-failover) / [FRR](/docs/products/compute/compute-instances/guides/failover-bgp-frr/) | 19 |
| Washington, DC, USA | Supported | BGP-based (new) | [lelastic](/docs/products/compute/compute-instances/guides/failover/#configure-failover) / [FRR](/docs/products/compute/compute-instances/guides/failover-bgp-frr/) | 17 |

### Lish Gateways

Lish and Glish provide direct access to your Compute Instances, bypassing the need for SSH or a VNC. For more information on Lish, consult our guide on how to [Access Your System Console Using Lish](/docs/products/compute/compute-instances/guides/lish/).

#### Chicago, IL, USA

-   **Lish SSH Gateway:** `lish-us-ord.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:rRwktOKfSApeffa+YOVxXXL70Ba1CpTYp/oFywEH2Pc lish-us-ord.linode.com
    ECDSA 256 SHA256:SV9A/24Jdb++ns/+6Gx7WqZCyN4+0y4ICFsaqK3Rm8s lish-us-ord.linode.com
    ED25519 256 SHA256:J+yN8rjhr9j27M4zLSF6OX9XmIoipWbPP/J1AGRlRYc lish-us-ord.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `us-ord.webconsole.linode.com`
-   **Glish Gateway:** `ord2.glish.linode.com`

#### Paris, France

-   **Lish SSH Gateway:** `lish-fr-par.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:qTliFB86axo9n07H0hUP/z5nm7Fbkzlf8eKnmtXBhZU lish-fr-par.linode.com
    ECDSA 256 SHA256:NU4UctBefhWIR3mpCrh+r2p5lNmtwFFoeelZspjMNYM lish-fr-par.linode.com
    ED25519 256 SHA256:GYNvVuHJqGIdCiU6yTPbkJmMgj+ZYBGRVGDqnrtJoQc lish-fr-par.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `fr-par.webconsole.linode.com`
-   **Glish Gateway:** `par3.glish.linode.com`

#### Washington, DC, USA

-   **Lish SSH Gateway:** `lish-us-iad.linode.com`

    {{< note type="secondary" title="Lish SSH Gateway Fingerprints" isCollapsible=true >}}
    ```command
    RSA 3072 SHA256:mzFtMaMVX6CsLXsYWn6c8BXnXk0XHfoOXGExDUEH2OI lish-us-iad.linode.com
    ECDSA 256 SHA256:of9osuoFwh7g5ZiO0G3ZGYi/8JcCw3BA/ZdkpaKQlT0 lish-us-iad.linode.com
    ED25519 256 SHA256:oFoUJn/xXV/+b7EJIcIt6G6hV5jXzjM/pOsoceDDOaA lish-us-iad.linode.com
    ```
    {{< /note >}}

-   **Weblish Gateway:** `us-iad.webconsole.linode.com`
-   **Glish Gateway:** `iad3.glish.linode.com`