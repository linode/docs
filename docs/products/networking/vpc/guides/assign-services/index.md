---
title: "Assign (and Remove) Services"
title_meta: "Assign (and Remove) Services on a VPC"
description: ""
published: 2023-10-24
authors: ["Linode"]
---

VPCs enable private communication between services within a data center and are a critical component of many application architectures. Both new and existing Compute Instances can be added to VPCs. Follow the instructions withing this guide to add (or remove) Compute Instances to a subnet on a VPC.

## Components and Options

- **Network Interface:** Every Compute Instance can have up to 3 network interfaces (Public, VPC, and VLAN). If you wish for an instance to be configured on a VPC, the **VPC** option needs to be selected on at least one interface. See [Configuration Profile Settings](/docs/products/compute/compute-instances/guides/configuration-profiles/#settings).

- **Subnet:** When a Compute Instance is assigned to a VPC, a subnet needs to be selected. The subnet that the Compute Instance is assigned to.

- **VPC IPv4 address:** The IPv4 address of the Compute Instance within the private network of the subnet. It must be within the CIDR range defined in the subnet. The address can be automatically generated or manually entered.

- **Public internet connectivity:** The Compute Instance can connect to the public internet through a 1:1 NAT on the VPC interface (the *Assign a public Ipv4 address for this Linode* option) or can have a separate network interface configured as *Public Internet*. The latter option may be preferred for existing Compute Instances that are already functioning and you wish to keep VPC traffic separated.

## Considerations

- Newly created Compute Instances configured with a VPC will have a VPC network interface configured and set as the default. There will not be any public interface configured.

- A Compute Instance configured on a VPC but without a 1:1 NAT configured and without a *Public Internet* network interface is only be able to communicate within the VPC subnet it is assigned to.

- Compute Instances can only be assigned to a single subnet of a single VPC. Multiple VPC interfaces are not allowed.

## Assign Existing Compute Instances

1.  Navigate to the **Subnets** section of a VPC. See [View Subnets](/docs/products/networking/vpc/guides/subnets/#view-subnets).

1.  Locate the subnet you wish to use, expand the corresponding ellipsis menu, and click **Assign Linodes**. This opens the **Assign Linodes to subnet** panel.

1.  Within the **Linodes** dropdown menu, select the instance you would like to add to the VPC on the selected subnet.

1.  By default, an IPv4 address will be automatically generated for the instance on the subnet's defined CIDR range. If you want to manually assign an IP address, uncheck the **Auto-assign a VPC IPv4 address for this Linode** option and enter your custom IPv4 address. This address must still be within the subnet's IP range.

1.  Click the **Assign Linode** button to add the instance to the subnet.

1.  You can review the list of all instances assigned to that subnet. Once you have added all instances you wish to assign, click the **Done** button.

1.  Restart each added Compute Instance to automatically configure the VPC interface on the system.

## Assign a New Compute Instance

Review the [Create a Compute Instance](/docs/products/compute/compute-instances/guides/create/) workflow and complete the VPC section.

## Remove Services

1.  Navigate to the **Subnets** section of a VPC. See [View Subnets](/docs/products/networking/vpc/guides/subnets/#view-subnets).

1.  Locate the subnet you wish to use, expand the corresponding ellipsis menu, and click **Unassign Linodes**. This opens the **Unassign Linodes from subnet** panel.

1.  Open the **Linodes** dropdown menu and select each instance you wish to remove from the subnet.

1.  Review the list of instances to be removed and then click the **Unassign Linodes** button to confirm.

1.  Restart each Compute Instance to automatically remove the VPC interface from the system.