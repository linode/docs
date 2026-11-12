---
slug: secure-site-to-site-vpn-between-akamai-and-aws
title: "Create a Secure Site-to-Site VPN Between Akamai and AWS"
description: "Learn how to set up a secure site-to-site VPN connection between AWS and Linode using StrongSwan. This guide covers VPC and VLAN networking with dual-NIC configuration for hybrid cloud deployments."
authors: ["Sandip Gangdhar"]
contributors: ["Sandip Gangdhar"]
published: 2025-07-16
keywords: ['vpn', 'aws', 'linode', 'strongswan', 'ipsec', 'site-to-site', 'vpc', 'vlan', 'hybrid cloud']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[AWS Site-to-Site VPN Documentation](https://docs.aws.amazon.com/vpn/latest/s2svpn/SetUpVPNConnections.html)'
- '[StrongSwan Configuration Guide](https://strongswan.org/)'
---

As hybrid and multi-cloud strategies become more common, securely connecting workloads across cloud providers is no longer a luxury—it's a necessity. This guide walks through setting up a secure site-to-site VPN between AWS and Linode using StrongSwan, enabling private, encrypted communication between private subnets in both environments.

Whether you're building distributed applications, enabling disaster recovery, or syncing cloud services, this solution provides a scalable, secure, and cloud-native approach to hybrid connectivity.

## Architecture Overview

At a high level, the architecture consists of:

-   A VPN Gateway in AWS, using AWS Managed VPN
-   A StrongSwan VPN server hosted on Linode
-   A dual-NIC setup on the Linode VPN server, using:
    -   `eth0`: connected to Linode VPC
    -   `eth1`: connected to a VLAN subnet
-   Scripts for automation and failover:
    -   `vpn-updown.sh`: Manages the tunnel interfaces, routes, and iptables configurations when the tunnel state changes
    -   `vpn-failover.sh`: Continuously monitors the tunnel state and initiates a failover if the primary tunnel becomes unreachable
-   Route-based IPsec tunnels between both environments
-   Custom routing and iptables rules to isolate and control traffic flow

## Why VPC Alone Isn't Enough: The Case for VLAN in Linode

While setting up a site-to-site VPN between AWS and Linode, it's natural to deploy your VPN server inside Linode's Virtual Private Cloud (VPC). This works initially — for example, once the tunnel is up, you can successfully ping AWS resources from the Linode VPN server itself using private IPs.

However, problems arise when you attempt to access AWS resources from instances behind the VPN server. Despite proper static routes and firewall rules, traffic forwarding fails.

### The Reason: Linode VPC's Strict Anti-Spoofing Enforcement

Linode's VPC is designed with strict source IP validation to enhance security and prevent IP spoofing. This means:

-   Instances can only send packets with their assigned source IP.
-   Forwarding traffic from one Linode instance (e.g., a private backend) through another (e.g., a VPN gateway) is blocked unless the traffic is encapsulated.

This filtering ensures strong network boundaries, but it also means traditional IP forwarding or NAT within a VPC doesn't behave as it would in a typical on-premises or other cloud environments.

## Why VLAN Solves This

A Linode VLAN provides a layer 2 (Ethernet-level) network segment that bypasses the IP-level spoofing filters present in VPCs. VLANs enable:

-   Custom routing and encapsulated traffic forwarding
-   Full control over packet headers
-   Easier support for complex setups like site-to-site VPN with StrongSwan

By binding the VLAN interface (e.g., `eth1`) to the VPN tunnel, and separating internal traffic (VPC) from tunnel traffic (VLAN), we enable clean, policy-compliant routing of packets between Linode and AWS.

## Why Not Use GRE as a Workaround?

GRE (Generic Routing Encapsulation) is sometimes proposed to bypass VPC filtering. While technically effective, it has significant limitations:

-   **Point-to-point by design**: Each instance behind the VPN would need a dedicated GRE tunnel. This is not scalable for environments with multiple instances.
-   **Manual configuration on both ends**: Including each AWS resource — which is not scalable or feasible in managed environments.
-   **Operational overhead**: Debugging GRE tunnels across multiple nodes increases complexity.
-   **MTU (Maximum Transmission Unit) issues** are common due to double encapsulation.
-   **Fragmentation risks** increase as GRE adds an additional header to every packet.
-   **Stateful Firewall Challenges**: GRE packets are stateless by design, making them harder to manage in stateful firewalls.

## Why VLAN Alone Doesn't Cut It Either

When designing a secure site-to-site VPN between AWS and Linode, a common question arises:

*"Can't I just use a VLAN for the VPN and assign a public IP to the same instance for tunnel connectivity?"*

At first glance, using one interface for VLAN traffic and another for public access might seem sufficient — especially if your goal is to terminate a VPN tunnel. But in practice, it introduces security, scalability, and compliance challenges. Let's explore why this setup falls short and why combining Linode VPC + VLAN in a dual NIC setup is the right design pattern.

### Why VPC Is Still Necessary

Linode's VPC (Virtual Private Cloud) provides a private Layer 3 network designed for internal communication between Linode instances. It enables:

-   Clean subnet separation (e.g., app, database, monitoring layers)
-   Easier network segmentation for security and traffic flow control
-   Support for cloud-native architecture such as LKE (Kubernetes on VPC)

If you omit the VPC and rely only on a VLAN + public IP setup, you lose the internal isolation and networking primitives that are critical for building secure and scalable cloud infrastructure.

### The Limitations of VLAN + Public IP Setup

While it might technically work to assign a public IP and use a VLAN for VPN traffic, this approach has serious drawbacks:

**1. Each Instance Becomes Publicly Exposed**

-   Assigning public IPs to every instance effectively places them in a public subnet.
-   Even with firewall rules in place, each VM has an internet-facing presence, increasing the attack surface.

**2. Violates the Principle of Least Privilege**

-   VPN servers are the only components that need public access. Other internal services (e.g., app servers, databases) should be kept fully private.
-   Giving public IPs to all instances creates unnecessary exposure and increases risk of lateral movement if any service is compromised.

**3. Harder to Manage Firewall & Ingress Rules**

-   With each instance directly exposed, you must individually manage inbound security controls, rather than centralizing ingress through a single VPN gateway or NAT instance.

**4. Complicates Auditing & Logging**

-   Publicly routable interfaces across your environment make traffic tracing and audit trail generation more complex.
-   Any traffic from a compromised instance would appear as "valid" outbound internet traffic, making anomaly detection harder.

**5. VLAN-Only Deployments Are Not Supported by Design**

Linode's networking architecture is intentionally designed to ensure each instance has a primary network interface. Currently, VLAN interfaces are intended to be supplementary, not primary. As a result, every primary network interface must attach either to:

-   A Public Internet interface, or
-   A VPC (Virtual Private Cloud) for private Layer 3 networking

This design promotes flexibility, security, and compatibility across a wide range of use cases. However, it also means that a VLAN-only setup is not feasible in isolation.

For this reason, the recommended architecture is a dual-NIC configuration — combining:

-   VPC for general internet access.
-   VLAN for specialized, high-throughput, or isolated traffic such as VPN tunnels or backend database replication.

This dual-NIC model leverages the best of both networking layers — providing secure isolation, network efficiency, and scalable architecture within Linode's robust cloud infrastructure.

## Why VPC + VLAN Dual NIC Is the Secure & Scalable Approach

Combining VPC and VLAN interfaces on the Linode VPN server offers a best-practice design:

{{< table >}}
| NIC | Role | Benefits |
| --- | --- | --- |
| eth0 | VPC Interface | Internet access for Linode instances in a private network |
| eth1 | VLAN Interface | Dedicated to VPN tunnel communication with AWS and internal traffic between Linode instances in a private network |
{{< /table >}}

This architecture ensures:

-   Private instances remain isolated from direct internet exposure.
-   Only the VPN server requires a public IP, minimizing the attack surface.
-   All AWS-destined traffic is routed via the VLAN interface through a secure, encrypted IPsec tunnel.
-   You gain the flexibility to implement firewall rules, NAT, and traffic logging at a centralized point.
-   Full compatibility with Linode's IP filtering policies

## Bonus: You're Futureproofing Your Infrastructure

By integrating Linode VPC today, you're also making your network future ready.

Linode is actively building new VPC-native features such as:

-   Managed NAT Gateway
-   VPC Endpoints for private access to:
    -   Linode Object Storage
    -   NodeBalancers
    -   LKE (Linode Kubernetes Engine)

By aligning with the VPC model now, you'll be able to seamlessly adopt these features when they become available — without needing to rearchitect your network later.

The VPC + VLAN dual-NIC setup is more than just a workaround — it's a secure, scalable, and strategic foundation for hybrid cloud networking:

-   Protects workloads from unnecessary exposure
-   Provides a centralized point of control for traffic and security
-   Ensures compatibility with current and future Linode networking features

Avoid public IPs on every instance. Embrace the power of VPC + VLAN for a clean, cloud-native VPN design.