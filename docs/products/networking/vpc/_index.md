---
title: VPC
title_meta: "VPC Product Documentation"
description: "VPCs make it easy to create your own virtual private clouds on the Akamai cloud computing platform, providing an isolated network for your applications."
bundles: ['network-security']
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
published: 2024-01-09
cascade:
    product_description: "A virtual private enables private communication between Compute Instances, isolating your network traffic from other customers and the internet."
---

{{< note type="warning" title="VPC Beta Notice" >}}
VPCs are now publicly available in beta, providing customers with another method of isolating network traffic between Compute Instances (in addition to the [VLANs](/docs/products/networking/vlans/) feature). Not all data centers are currently supported. For more information, review the [Availability](#availability) section.
{{</ note >}}

A VPC (*Virtual Private Cloud*) is an isolated network that enables private communication between Compute Instances within the same data center. Since Cloud environments often necessitate sharing infrastructure with other users, VPCs are a critical component of many application architectures and can further isolate your workloads from other Akamai users.

## Protect Sensitive Data

Networking packets sent over a VPC are walled off from the public internet --- as well as from other services within the same data center that don't belong to the same VPC. When assigning a Compute Instance to a VPC, you can opt for it to be fully private or configure it with public internet access through either a 1:1 NAT on the VPC or a public internet interface.

## Segment Traffic Into Separate Subnets

Each VPC can further segment itself into distinct networks through the use of multiple subnets. These subnets can isolate various functionality of an application (such as separating public frontend service from private backend services) or separate out a production environment from staging or development.

## Compatible with Cloud Firewalls

If a Compute Instance is assigned to a Cloud Firewall, firewall rules that limit access and filter traffic will be applied to the public interface as well as the VPC interface. This means that private traffic between Compute Instances within a VPC will be filtered by the Cloud Firewall.

## Availability

VPCs are available to all customers as a public beta in a small number of data centers. Additional regions will be made available throughout the beta period and after the public launch.

## Pricing

VPCs are provided at no additional cost. Additionally, communication across your private VPC network does not count against your [monthly network transfer usage](/docs/products/platform/get-started/guides/network-transfer/).

## Difference Between Private Network Options (VPCs, VLANs, and Private IPs)

Both [VLANs](/docs/products/networking/vlans/) and [Private IP addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#types-of-ip-addresses) are private networking services offered by Akamai cloud computing. VLANs operate on layer 2 of the OSI model whereas VPCs and Private IPs operate on layer 3. While this allows VLANs to use any layer 3 protocol, it also means that there are limitations to routing and other layer 3 features. Since VPC is on layer 3 and uses the IP (Internet Protocol), IP addressing and IP routing features are built-in.

- **Latency:** All 3 services offer extremely low latency.

- **Cost:** There is no charge for VPCs, VLANs, and private IP addresses. The only costs are related to the associated Compute Instance service and any outbound traffic over the public IP addresses.

- **Network Isolation:** Both VPC and VLANs offer true network isolation from other tenants within the same data center. Private IP addresses are accessible by default from any other instance in the same region, provided that instance also has a private IP address. This is because they all use the same `192.168.128.0/17` range.

- **Multiple Subnets:** Each VPC can have multiple subnets. Each VLAN can only be configured with IP addresses from one specified range.

## Technical Specifications

- Users can create up to 10 VPCs per data center (by default). Each VPC can have up to 10 subnets.

- Compute Instances can join a VPC by specifying the VPC as a network interface. Other services, such as NodeBalancers, LKE clusters, and Managed Databases cannot join a VPC at this time.

- VPCs are deployed to a specific data center when created. Only compatible services within that data center can belong to a VPC.

- A VPC interface can be private or have public internet access through a 1:1 NAT.

## Additional Limits and Considerations

- VPCs peering is not supported (within the same data center or different data centers).

- While VPC traffic is isolated from other cloud tenants, it is not encrypted.

- IPv6 addresses are not available on a VPC interface.

- VPC IP addresses cannot use [IP Sharing](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#configuring-ip-sharing) or [IP Transfer](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#transferring-ip-addresses) features.