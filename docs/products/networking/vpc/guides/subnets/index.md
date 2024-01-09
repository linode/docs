---
title: "Manage Subnets"
title_meta: "Manage Subnets on a VPC"
description: ""
published: 2023-10-24
authors: ["Linode"]
---

Subnets are integral to VPCs. Every service that is added to a VPC is assigned to a particular subnet. These subnets can create multiple networks within the VPC, allowing groups of related services to be separated from other services. Every VPC must have at least 1 subnet, though multiple subnets are common and up to 10 can be created for each VPC. Multiple subnets can be added to isolate services that are used for certain functionality of an application (like frontend and backend services) or can segment a VPC and its attached services into different environments (such as development, staging, and production).

## Components

- **Subnet Label:** An alphanumeric string (containing only letters, numbers, and hyphens) used to identify the subnet. It should be unique among other subnets in the same VPC and should provide an indication as to its intended usage.

- **Subnet IP Address Range:** VPC subnet ranges must be in the RFC1918 IPv4 address space designated for private networks. That said, it cannot overlap with the `192.168.128.0/17` range set aside for [Private IP addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#types-of-ip-addresses) on Compute Instances.

- **Assigned Services:** Each subnet can have multiple services assigned to it. These services can communicate with others in the same subnet, but are not able to communicate outside the subnet unless they belong to another subnet or have an interface configured for the public internet.

## Considerations

- Up to 10 subnets can be created on a VPC.
- Each subnet can have at most one IPv4 CIDR compliant with the [RFC1918](https://datatracker.ietf.org/doc/html/rfc1918) specification for private internets (though not within the 192.168/16 space as that is reserved for Private IP address). IPv6 address ranges are not available.
- Each service assigned to a subnet must have a unique IP address in the defined range.

## View Subnets

1.  Log in to the [Cloud Manager](https://cloud.linode.com) and click the **VPC** link in the sidebar.

1.  Click on your VPC from the list to view more details.

1.  Review the **Subnets** section to view all of the subnets, including the CIDR range and the number of services assigned. Subnets can be expanded to view all services assigned to that particular subnet. These services are listed alongside their assigned IPv4 address and any firewalls that are applied to that interface.

## Assign a Service to a Subnet

See [Assign (and Remove) Services to a VPC](/docs/products/networking/vpc/guides/assign-services/).

## Add a Subnet

1.  Navigate to the **Subnets** section of a VPC. See [View Subnets](#view-subnets).

1. Click the **Create Subnet** button. This opens the **Create Subnet** panel.

1. Enter a unique label and IP address range.

## Edit a Subnet

1.  Navigate to the **Subnets** section of a VPC. See [View Subnets](#view-subnets).

1.  Locate the subnet you wish to edit, expand the corresponding ellipsis menu, and click the **Edit** option. This opens the **Edit Subnet** panel.

1.  Modify any desired fields and click **Save**.