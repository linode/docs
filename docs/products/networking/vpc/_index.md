---
title: VPC
title_meta: "VPC Product Documentation"
description: "VPCs make it easy to create your own virtual private clouds on the Akamai cloud computing platform, providing an isolated network for your applications."
published: 2024-02-06
modified: 2024-05-16
bundles: ['network-security']
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    product_description: "A virtual private cloud enables private communication between Compute Instances, isolating your network traffic from other customers and the internet."
---

{{< note title="VPC Availability" >}}
VPCs are now publicly available to all customers in select data centers. For a list of supported regions, review the [Availability](#availability) section.
{{</ note >}}

A VPC (*Virtual Private Cloud*) is an isolated network that enables private communication between Compute Instances within the same data center. Since Cloud environments often necessitate sharing infrastructure with other users, VPCs are a critical component of many application architectures and can further isolate your workloads from other Akamai users.

## Protect Sensitive Data

Networking packets sent over a VPC are walled off from the public internet --- as well as from other services within the same data center that don't belong to the same VPC. When assigning a Compute Instance to a VPC, you can opt for it to be fully private or configure it with public internet access through either a 1:1 NAT on the VPC or a public internet interface.

## Segment Traffic Into Separate Subnets

Instead of assigning a single IPv4 range for the entire VPC, Akamai's VPC design allows users to configure multiple RFC1918 ranges through the use of subnets. This has the benefit of segmenting services into distinct networks and can be useful when migrating or combining existing networking environments so that there are no changes to routing or static IPs. These subnets can isolate various functionality of an application (such as separating public frontend services from private backend services) or separate out a production environment from staging or development.

Routing between subnets on a VPC is configured automatically. By default, all Compute Instances on a VPC can communicate with any other instance on that VPC, regardless of which subnet the other instance is assigned to use.

## Compatible with Cloud Firewalls

If a Compute Instance is assigned to a Cloud Firewall, firewall rules that limit access and filter traffic will be applied to the public interface as well as the VPC interface. This means that private traffic between Compute Instances within a VPC will be filtered by the Cloud Firewall.

## Availability

VPCs are available in: Amsterdam (Netherlands), Chennai (India), Chicago IL (USA), Jakarta (Indonesia), Los Angeles CA (USA), Miami FL (USA), Milan (Italy), Paris (France), Osaka (Japan), São Paulo (Brazil), Seattle WA (USA), Stockholm (Sweden), and Washington DC (USA).

## Pricing

VPCs are provided at no additional cost. Additionally, communication across your private VPC network does not count against your [monthly network transfer usage](/docs/products/platform/get-started/guides/network-transfer/).

## Difference Between Private Network Options (VPCs, VLANs, and Private IPs)

Both [VLANs](/docs/products/networking/vlans/) and [Private IP addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#types-of-ip-addresses) are private networking services offered by Akamai cloud computing. VLANs operate on layer 2 of the OSI model whereas VPCs and Private IPs operate on layer 3. While this allows VLANs to use any layer 3 protocol, it also means that there are limitations to routing and other layer 3 features. Since VPC is on layer 3 and uses the IP (Internet Protocol), IP addressing and IP routing features are built-in.

- **Latency:** All 3 services offer extremely low latency.

- **Cost:** There is no charge for VPCs, VLANs, and private IP addresses. The only costs are related to the associated Compute Instance service and any outbound traffic over the public IP addresses.

- **Network Isolation:** Both VPC and VLANs offer true network isolation from other tenants within the same data center. Private IP addresses are accessible by default from any other instance in the same region, provided that instance also has a private IP address. This is because they all use the same `192.168.128.0/17` range.

- **Multiple Subnets:** Each VPC can have multiple subnets. Each VLAN can only be configured with IP addresses from one specified range.

## Technical Specifications

- Users can create up to 10 VPCs per data center (by default).

- Each VPC can have up to 10 subnets.

- Compute Instances can join a VPC by specifying the VPC as a network interface. Other services, such as NodeBalancers, LKE clusters, and Managed Databases cannot join a VPC at this time.

- VPCs can only be deployed to a single data center. As such, Compute Instances within different data centers cannot belong to the same VPC.

- A VPC interface can be private or have public internet access through a 1:1 NAT.

## Additional Limits and Considerations

- VPCs peering is not supported (within the same data center or different data centers).

- While VPC traffic is isolated from other cloud tenants, it is not encrypted.

- IPv6 addresses are not available on a VPC interface.

- VPC IP addresses cannot use [IP Sharing](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#configuring-ip-sharing) or [IP Transfer](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#transferring-ip-addresses) features.

- To facilitate routing between different subnets on the same VPC, configure the VPC network interface as the primary interface.

- Network traffic across a private VPC network does not count against your [monthly network transfer usage](/docs/products/platform/get-started/guides/network-transfer/). The network transfer allowance for Compute Instances configured on VPCs still counts towards the _global network transfer pool_ on your account.

- Using the [Metadata service](/docs/products/compute/compute-instances/guides/metadata/) over a VPC is supported, but use of cloud-init is not.