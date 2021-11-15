---
slug: managing-ip-addresses
author:
  name: Linode
  email: docs@linode.com
description: "Our guide to the remote access area of the Linode Manager."
keywords: ["remote access", "ip addresses", "ip failover", "swapping ip addresses", "console access", "add additional ipv4 address", "add ip address", "add additional ip address"]
tags: ["linode platform","resolving","cloud manager","networking"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/platform/manager/remote-access-classic-manager/','/platform/manager/remote-access/','/remote-access/','/networking/remote-access/', '/guides/remote-access/']
modified: 2021-11-15
modified_by:
  name: Linode
published: 2016-08-23
title: "Managing IP Addresses"
---

Each Linode Compute Instance is equipped with several IP addresses. You're able to view these IP addresses, as well as add, remove, transfer, or share them, through the Cloud Manager.

## Viewing IP Addresses

1.  Log in to the [Cloud Manager](https://cloud.linode.com) and click the **Linodes** link in the sidebar.

1.  Click on your Linode Compute Instance from the list to view more details.

1.  Within the top *Summary* section, you can view the primary IPv4 and IPv6 addresses.

    ![](compute-ip-addresses-quick.png)

1.  To view all of your IP address for this Instance, click the **View all IP Addresses** link or navigate to the **Network** tab and review the **IP Addresses** section.

    ![](compute-ip-addresses-full.png)

## Types of IP Addresses

- **Public IPv4 Address:** All Compute Instances are created with at least one public IPv4 address, which enables your applications to be accessible over the Internet. Additional addresses can be provided with technical justification.

- **Private IPv4 Address:** Optionally, private IPv4 addresses can be assigned to a Compute Instance. This allows it to connect to other services located in the same data center, such as NodeBalancers or other Compute Instances.

    {{< note >}}
All private IPs in the same data center can communicate with each other over the private network. This means a Compute Instance's private IP address is accessible to all other Instances in that data center. It's recommended to set up firewall rules for your Linode to secure its network traffic. See our [firewall guides](/docs/security/firewalls/) for details on setting up firewall rules. In many cases, using [Private VLANs](/docs/products/networking/vlans/) is preferred over private IPv4.
{{</ note >}}

### IPv6 Addresses

- **IPv6 SLAAC Address:** This is the main IPv6 address used to communicate over the public Internet and within other services in the same data center.

- **IPv6 Link Local:** This IPv6 address is assigned to each Compute Instance and used for internal routing.

- **/64 Routed Range:** (18,446,744,073,709,551,616 addresses) This is the most common range provided to our customers and sufficient for most applications that require additional IPv6 addresses.

- **/56 Routed Range:** (4,722,366,482,869,645,213,696 addresses) These larger ranges are typically only required by specialized systems or networking applications.

- **/116 Pool:** *(4,096 addresses)* An IPv6 pool is accessible from every Linode on your account within the assigned data center. Addresses from that pool can be configured on each Linode within that data center. This can enable features like IPv6 failover.

    {{< caution >}}
The IPv6 `/116` prefix has been deprecated and is not available in the Toronto, Atlanta, Sydney, or Mumbai data centers.
{{</ caution >}}

## Adding an IP Address

1.  Log in to the [Cloud Manager](https://cloud.linode.com) and click the **Linodes** link in the sidebar.
1.  Click on your Linode Compute Instance from the list and navigate to the **Network** tab.
1.  Click the **Add an IP Address** button under the *IP Address* section. This displays the *Add an IP Address* panel.

    ![](add-ip-address-button.png)

1.  Within the form, select the type of IP address (or range) you wish to add. If you aren't sure, review the [Types of IP Addresses](#types-of-ip-addresses) section and consider your own use case.

    ![](add-ip-address-form.png)

1.  Click the **Allocate** button to add the additional address. If you receive a message similar to the following, you need to [contact our Support team](https://www.linode.com/support/) to request the IP address. Make sure to include any additional information or technical reasoning for the request.

    > Additional IPv4 addresses require technical justification. Please open a Support Ticket describing your requirement

Once the IP address or range has been added, it should be visible in the *IP Address* section.

{{< note >}}
Due to the [impending exhaustion of the IPv4 address space](http://en.wikipedia.org/wiki/IPv4_address_exhaustion), Linode requires users to provide technical justification for additional public IPv4 addresses. If you have an application that requires multiple IP addresses, consider using an IPv6 /64 range instead.
{{</ note >}}

## Configuring rDNS

The ability to associate an IP address with a domain name is referred to as *forward* DNS resolution. *Reverse* DNS lookup is the inverse process, where an IP address resolves to its designated domain name. Official Internet documents state that "every Internet-reachable host should have a name," and that the name should match a reverse pointer record. (See [RFC 1033](http://tools.ietf.org/html/rfc1033) and [RFC 1912](http://tools.ietf.org/html/rfc1912).)

You are able to configure rDNS (or reset it) through the Cloud Manager using the instructions below:

{{< note >}}
Before setting reverse DNS, verify that you have created a matching forward DNS record for the IP address. For instructions, see [Adding DNS Records](/docs/websites/hosting-a-website/#add-dns-records). If you use a third-party DNS provider, create the forward DNS record with your provider's management tool.
{{< /note >}}

1.  Log in to the [Cloud Manager](https://cloud.linode.com) and click the **Linodes** link in the sidebar.
1.  Click on your Linode Compute Instance from the list and navigate to the **Network** tab.
1.  Select the **Edit RDNS** menu option for the IP address to which you'd like to add a reverse pointer record, as shown in the below image.

    ![Select 'Edit RDNS' option from the IP address menu.](edit-rdns-button.png)

1.  The *Edit Reverse DNS* menu appears. Enter a domain as shown in the below image. If you wish to reset the rDNS back to its original `*.members.linode.com` (or `*.ip.linodeusercontent.com`) domain, make sure this field is empty.

    ![Adding the domain name for reverse DNS](edit-rdns-form.png)

1.  Click **Save** to make the change.

    {{< note >}}
If you receive the message that **no match was found**, this indicates that you need to update the forward DNS for this domain. Make sure the domain or subdomain in question resolves to the IP address for which you are trying to set the reverse DNS. If you've recently made a DNS change, you may need to wait 24-48 hours for it to propagate.
{{< /note >}}

You can verify the reverse DNS entry was properly submitted within the *IP addresses* table under the Reverse DNS column.

## Configuring IP Sharing

{{< note >}}
This feature is not yet supported in the Atlanta, Mumbai, Sydney, or Toronto data centers.
{{</ note >}}

*IP sharing*, called IP failover in the Classic Manager, is the process by which an IP address is reassigned from one Linode to another in the event the first one fails or goes down. If you're using two Linodes to make a website [highly available](/docs/websites/introduction-to-high-availability/) with Keepalived or a similar service, you can use the Linode Manager to configure IP failover. Here's how:

1.  Log in to the [Cloud Manager](https://cloud.linode.com).
1.  Click the **Linodes** link in the sidebar. A list of your available Linodes will appear.
1.  Select the Linode on which you wish to configure IP sharing. The Linode's detail page appears.
1.  Click the **Network** tab.
1.  Select the **IP Sharing** button.

    ![Configuring IP sharing](ip-sharing-button.png)

1.  A pop up menu will appear. Select the Linode you would like to share an IP address with.

    ![Select a Linode to share an IP address with.](remote_access_ip_sharing_add_an_ip.png)

1.  Click **Save**.

You have successfully configured IP sharing. Now, when a failover service such as Keepalived detects failure of your chosen Linode, its IP address will be assigned to the new Linode to avoid an interruption in service. For more information on a practical use case, see our guide on [hosting a website with high availability](/docs/websites/host-a-website-with-high-availability/).

{{< note >}}
IP sharing does not change ownership of the origin IP address, and the IP address will continue to belong to the same origin Linode. By default, IP sharing alone does not change the behavior of how traffic reaches your Linode and the capability must be further configured with tools like [keepalived](https://keepalived.org/) which affect routing, or a similar services.
{{< /note >}}

## Transferring IP Addresses

If you have two Linodes in the same data center, you can use the *IP transfer* feature to transfer or swap their IPv4 addresses. This could be useful in several situations. For example, if you've built a new server to replace an old one, you could swap IP addresses instead of updating the DNS records.

{{< note >}}
This process only transfers **IPv4** addresses, not IPv6. See [IPv6](#ipv6) below for additional information.
{{< /note >}}

Here's how to use the IP Transfer tool to transfer IPv4 addresses:

1.  Log in to the [Cloud Manager](https://cloud.linode.com) and click the **Linodes** link in the sidebar.

1.  Select a Linode and navigate to the **Network** tab.

1.  Select the **IP Transfer** button in the IP Addresses table.

    ![IP Transfer button](ip-transfer-button.png)

1.  Select an action from the dropdown menu. You can choose **move to** and **swap with**. "Swap with" switches the IP addresses of two Linodes. "Move to" moves an IP address from one Linode to another. To choose the "move to" option the Linode you are moving an IP address from needs to have more than one public IP address.

    ![The IP Transfer menu in the Cloud Manger](remote_access_ip_transfer.png)

    {{< note >}}
The menu only displays Linodes hosted in the same data center as the current Linode.
{{< /note >}}

1.  Click **Save** to transfer the requested IPs.

1.  To make sure the new IP addresses take affect within the internal configuration of each Linode, verify that [Network Helper](/docs/platform/network-helper/) is enabled and reboot the Linode(s).

    If Network Helper is turned off *and* you've [configured a static IP address](/docs/networking/linux-static-ip-configuration/), you need to update the configuration files with the new IP addresses or enable Network Helper.

    {{< note >}}
If the IP is unreachable after a few minutes, you may need to notify the router directly of the IP change with the `arp` command run on your Linode:

    arping -c5 -I eth0 -s 198.51.100.10 198.51.100.1
    ping -c5 198.51.100.10 198.51.100.1

Replace `198.51.100.10` with your new IP address, and `198.51.100.1` with the gateway address listed in your Networking tab under "Default Gateways".
{{< /note >}}

### Transferring an IPv6 SLAAC Address

IPv6 SLAAC addresses are not able to be transferred between Compute Instances. If this is something you need to do, consider moving the
applications you want to be hosted on that IPv6 address over to the Compute Instance containing that IPv6 address. One way to accomplish this is to clone the disks containing the data. See the [Cloning to an Existing Linode](/docs/guides/clone-your-linode/#cloning-to-an-existing-linode) section of the **Cloning a Linode** guide. After the cloning process has completed, transfer any required IPv4 addresses.