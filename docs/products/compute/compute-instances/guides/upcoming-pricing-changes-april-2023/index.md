---
keywords: ["april pricing update", "pricing", "pricing changes"]
description: "Information related to the Akamai Compute pricing changes effective April 1st, 2023"
published: 2023-03-01
modified: 2023-03-31
modified_by:
  name: Linode
title: "Recent Pricing Changes (Effective 4/1/2023)"
authors: ["Linode"]
---

New pricing for some Compute services has gone into effect starting April 1st 2023. This includes an increase in cost for most Shared and Dedicated CPU Compute Instance plans (excluding the $5/mo 1GB Shared plan), a decrease in cost of network transfer (egress) overage fees, and an increase in cost for additional IPv4 addresses. This page covers each pricing change so you know exactly what to expect on your invoice moving forward.

{{< note >}}
To learn more about these changes, review the [Akamai’s Cloud Computing Services: Pricing Update](https://www.linode.com/blog/linode/akamai_cloud_computing_price_update/) blog post.
{{< /note >}}

## Compute Instances

On April 1st 2023, the price for most Shared CPU and Dedicated CPU Compute Instance plans increased by 20%. This excludes the 1 GB Shared CPU (Nanode) plan, which remains at its current $5/mo price. This change also does not affect High Memory and GPU plans. The tables below outline each plan along with the corresponding resources, the original price, and the new price.

### Shared CPU Plans and Pricing

| Plan | Previous<br>$/Mo | <span style="color:#02b159">New<br>$/Mo</span> | RAM | CPUs | Storage | Transfer | Network In/Out |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **1 GB Shared CPU** | $5 | **<span style="color:#02b159">$5 (no change)</span>** | 1 GB | 1 | 25 GB | 1 TB | 40/1 Gbps |
| **2 GB Shared CPU** | $10 | **<span style="color:#02b159">$12</span>** | 2 GB | 1 | 50 GB | 2 TB | 40/2 Gbps |
| **4 GB Shared CPU** | $20 | **<span style="color:#02b159">$24</span>**  | 4 GB | 2 | 80 GB | 4 TB | 40/4 Gbps |
| **8 GB Shared CPU** | $40 | **<span style="color:#02b159">$48</span>** | 8 GB | 4 | 160 GB | 5 TB | 40/5 Gbps |
| **16 GB Shared CPU** | $80 | **<span style="color:#02b159">$96</span>** | 16 GB | 6 | 320 GB | 8 TB | 40/6 Gbps |
| **32 GB Shared CPU** | $160 | **<span style="color:#02b159">$192</span>** | 32 GB | 8 | 640 GB | 16 TB | 40/7 Gbps |
| **64 GB Shared CPU** | $320| **<span style="color:#02b159">$384</span>** | 64 GB | 16 | 1280 GB | 20 TB | 40/9 Gbps |
| **96 GB Shared CPU** | $480 | **<span style="color:#02b159">$576</span>** | 96 GB | 20 | 1920 GB | 20 TB | 40/10 Gbps |
| **128 GB Shared CPU** | $640 | **<span style="color:#02b159">$768</span>** | 128 GB | 24 | 2560 GB | 20 TB | 40/11 Gbps |
| **192 GB Shared CPU** | $960 | **<span style="color:#02b159">$1,152</span>** | 192 GB | 32 | 3840 GB | 20 TB | 40/12 Gbps |

### Dedicated CPU Plans and Pricing

| Plan | Previous<br>$/Mo | <span style="color:#02b159">New $/Mo</span> | RAM | CPUs | Storage | Transfer | Network In/Out |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **4 GB Dedicated CPU** | $30 | **<span style="color:#02b159">$36</span>** | 4 GB | 2 |  80 GB  | 4 TB | 40/4 Gbps |
| **8 GB Dedicated CPU** | $60 | **<span style="color:#02b159">$72</span>** | 8 GB | 4 | 160 GB  | 5 TB | 40/5 Gbps |
| **16 GB Dedicated CPU** | $120 | **<span style="color:#02b159">$144</span>** | 16 GB | 8 | 320 GB  | 6 TB | 40/6 Gbps |
| **32 GB Dedicated CPU** | $240 | **<span style="color:#02b159">$288</span>** | 32 GB | 16 | 640 GB  | 7 TB | 40/7 Gbps |
| **64 GB Dedicated CPU** | $480 | **<span style="color:#02b159">$576</span>** | 64 GB | 32 | 1280 GB | 8 TB | 40/8 Gbps |
| **96 GB Dedicated CPU** | $720 | **<span style="color:#02b159">$864</span>** | 96 GB | 48 | 1920 GB | 9 TB | 40/9 Gbps |
| **128 GB Dedicated CPU** | $960 | **<span style="color:#02b159">$1,152</span>** | 128 GB | 50 | 2500 GB | 10 TB | 40/10 Gbps |
| **256 GB Dedicated CPU** | $1,920 | **<span style="color:#02b159">$2,304</span>** | 256 GB | 56 | 5000 GB | 11 TB | 40/11 Gbps |
| **512 GB Dedicated CPU** | $3,840 | **<span style="color:#02b159">$4,608</span>** | 512 GB | 64 | 7200 GB | 12 TB | 40/12 Gbps |

## Network Transfer (Egress) Overages

Each Compute Instance plan includes a certain allowance of outbound network transfer per month (ranging from 1 TB to 20 TB). The monthly network allowance of each instance active during a billing period (prorated) is then combined into a monthly transfer pool. Any additional transfer usage that exceeds this monthly pool is billed as a per GB overage charge. To learn more about how network transfer works (and how it is billed), see [Network Transfer Usage and Costs](/docs/products/platform/get-started/guides/network-transfer/).

Starting on April 1st 2023, the network transfer (egress) overage fees was cut in half, from $0.01/GB (previous fee) to $0.005/GB (new fee). The table below details this change.

| Network Transfer Type | Previous Price | <span style="color:#02b159">New Price</span> |
| -- | -- | -- |
| Inbound network transfer (Ingress) | Free (no defined limit) | **<span style="color:#02b159">Free (no defined limit)</span>** |
| Outbound network transfer (Egress) Overage | $0.01/GB | **<span style="color:#02b159">$0.005/GB</span>** |

## Additional IPv4 Addresses

Each Compute Instance includes a free IPv4 address and IPv6 address. Additional IPv4 addresses can be purchased for a fee and added to an instance. Starting on April 1st 2023, the cost for each additional IP address increased from $1/mo to $2/mo.

| IP Address Quantity | Previous Price | <span style="color:#02b159">New Price</span> |
| -- | -- | -- |
| First IPv4 Address | Free | **<span style="color:#02b159">Free</span>** |
| Additional IPv4 Addresses | $1/mo | **<span style="color:#02b159">$2/mo</span>** |