---
slug: remote-access
author:
  name: Linode
  email: docs@linode.com
description: Our guide to the remote access area of the Linode Manager.
keywords: ["remote access", "ip addresses", "ip failover", "swapping ip addresses", "console access", "add additional ipv4 address", "add ip address", "add additional ip address"]
tags: ["linode platform","resolving","cloud manager","networking"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/platform/manager/remote-access-classic-manager/','/platform/manager/remote-access/','/remote-access/','/networking/remote-access/']
modified: 2021-10-14
modified_by:
  name: Linode
published: 2016-08-23
title: Remote Access
---

The Networking tab of the Linode detail page in the [Cloud Manager](https://cloud.linode.com) contains important network settings for your Linode. Use this tab to find your IP address, set the reverse DNS, configure IP sharing (called IP failover in the Classic Manager), and swap IP addresses with another Linode. You can also access the Linode Shell (Lish) console to remotely connect to your Linode and troubleshoot problems.

## Access Section

The Access section displays default gateways, and DNS resolvers. It also provides quick access to SSH and Lish commands.

## Setting Reverse DNS

The ability to associate an IP address with a domain name is referred to as *forward* DNS resolution. *Reverse* DNS lookup is the inverse process, where an IP address resolves to its designated domain name. Official Internet documents state that "every Internet-reachable host should have a name," and that the name should match a reverse pointer record. (See [RFC 1033](http://tools.ietf.org/html/rfc1033) and [RFC 1912](http://tools.ietf.org/html/rfc1912).)

Here's how to set reverse DNS for your domain names:

{{< note >}}
Before setting reverse DNS, verify that you have created a matching forward DNS record for the IP address. For instructions, see [Adding DNS Records](/docs/websites/hosting-a-website/#add-dns-records). If you use a third-party DNS provider, create the forward DNS record with your provider's management tool.
{{< /note >}}

1.  Log in to the [Cloud Manager](https://cloud.linode.com).
1.  Click the **Linodes** link in the sidebar.
1.  Select your Linode. The Linode's detail page appears.
1.  Click the **Network** tab.
1.  Select the **Edit RDNS** menu option for the IP address to which you'd like to add a reverse pointer record, as shown in the below image.

    ![Select 'Edit RDNS' option from the IP address menu.](remote_access_edit_rdns_more_options.png)

1.  The *Edit Reverse DNS* menu appears. Enter a domain as shown in the below image.

    ![Adding the domain name for reverse DNS](remote_access_rdns_menu.png)

1.  Click **Save**. You will be taken back to the Linode's detail page where you can verify the reverse DNS entry under the Reverse DNS column.

1.  Repeat steps 1-8 for every other domain name you host on your Linode.

You have successfully configured reverse DNS.

 {{< note >}}
If you receive the message that **no match was found**, this indicates that you need to update the forward DNS for this domain. Make sure the domain or subdomain in question resolves to the IP address for which you are trying to set the reverse DNS. If you've recently made a DNS change, you may need to wait 24-48 hours for it to propagate.
{{< /note >}}

## Resetting Reverse DNS

To reset reverse DNS to the Linode domain, which will be something like **li12-345.members.linode.com**, follow these instructions:

1.  Log in to the [Cloud Manager](https://cloud.linode.com).
1.  Click the **Linodes** link in the sidebar.
1.  Select your Linode. The Linode's detail page appears.
1.  Click the **Network** tab.
1.  Select the **Edit RDNS** menu option, as shown in the below image.

    ![Select 'Edit RDNS' option from the IP address menu.](remote_access_edit_rdns_more_options.png)

1.  Remove the domain name from the text field and click **Save**.

The reverse DNS will be reset.

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

    ![Configuring IP sharing](remote_access_ip_sharing.png)

1.  A pop up menu will appear. Select the Linode you would like to share an IP address with.

    ![Select a Linode to share an IP address with.](remote_access_ip_sharing_add_an_ip.png)

1.  Click **Save**.

You have successfully configured IP sharing. Now, when a failover service such as Keepalived detects failure of your chosen Linode, its IP address will be assigned to the new Linode to avoid an interruption in service. For more information on a practical use case, see our guide on [hosting a website with high availability](/docs/websites/host-a-website-with-high-availability/).

{{< note >}}
IP sharing does not change ownership of the origin IP address, and the IP address will continue to belong to the same origin Linode. By default, IP sharing alone does not change the behavior of how traffic reaches your Linode and the capability must be further configured with tools like [keepalived](https://keepalived.org/) which affect routing, or a similar services.
{{< /note >}}

## Networking Restrictions

Linode's philosophy is to provide a plain Internet connection to every customer. We also implement some networking restrictions to prevent malicious activity and the abuse of our service.

By default, Linodes are able to send and receive traffic only for the MAC and IP addresses they are assigned. This restriction also applies to all ARP and IPv6 Neighbor Discovery traffic.

If you want to allow one Linode to use another Linode's IP address, such as for a high availability setup, you will need to enable IP Sharing in the Cloud Manager for every Linode that needs to use the IP address. For more information on enabling IP Sharing, please see the [previous section](#configuring-ip-sharing) of this guide.

## Transferring IP Addresses

### IPv4

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

### IPv6

#### Moving an IPv6 Range to a Different Linode

To transfer an IPv6 routed range (`/64` or `/56`) or pool (`/116`) to a different Linode, contact [Linode Support](https://www.linode.com/support/). A member of the Linode Support Team can perform the transfer for you.

#### Moving an IPv6 SLAAC Address to a Different Linode

IPv6 SLAAC addresses are not able to be transferred between Linodes. That said, you can move disks between Linodes. For instance, if you would like to transfer the IPv6 SLAAC address of Linode A to Linode B, instead consider moving Linode B's disks to Linode A. This effectively provides a similar outcome: you now have a Linode with Linode A's IPv6 address and Linode B's content.

1.  As a precaution against data loss, perform a backup on any impacted Linodes.

1.  On the Linode with the desired IPv6 address, ensure there's enough unallocated storage space to accommodate the disk(s) to be cloned.

1.  Follow the instructions for cloning a disk and the configuration profile within the [Cloning to an Existing Linode](/docs/guides/clone-your-linode/#cloning-to-an-existing-linode) section of the **Cloning a Linode** guide.

1.  After the cloning process has completed, transfer any required IPv4 addresses.

## Adding Private IPv4 Addresses

The Cloud Manager allows you to add private IP addresses for fast and secure connections between Linodes located in the same data center. Here's how to add a private IP address:

1.  Log in to the [Cloud Manager](https://cloud.linode.com) and click the **Linodes** link in the sidebar.

1.  Select a Linode and navigate to the **Network** tab.

1.  Select the **Add an IP Address** button, as shown below.

    ![Adding Private IP addresses](remote_access_add_private_ip.png)

1.  The menu for adding an IP address will appear. Select `IPv4-Private` from the dropdown menu, and click on the **Allocate** button.

1.  Make sure [Network Helper](/docs/platform/network-helper/) is enabled on your configuration profile, and reboot your Linode. Otherwise, configure static networking. See the [Linux Static IP Configuration](/docs/networking/linux-static-ip-configuration/) guide for instructions.

If you'd like to add more than one private IP address to your Linode, please [contact support](/docs/platform/billing-and-support/support/).

{{< note >}}
Private IPs in the same data center can communicate over the private network. This means a Linode's private IP address is accessible to all Linodes in a data center. It is recommended to set up firewall rules for your Linode to secure its network traffic. See our [firewall guides](/docs/security/firewalls/) for details on setting up firewall rules.
{{</ note >}}

## Adding Public IP Addresses

You can use the Linode Manager to add additional public IP addresses to your account. However, due to the [impending exhaustion of the IPv4 address space](http://en.wikipedia.org/wiki/IPv4_address_exhaustion), Linode requires users to provide technical justification. To add another public IP address, please [contact support](/docs/platform/billing-and-support/support/) with your justification.

## Console Access

The Lish console allows you to access your Linode at any time, even if you've messed up your network settings. To access Lish, use the Lish console or an SSH client application installed on your computer. For more information about Lish, including usage tips, see [Using the Linode Shell](/docs/platform/manager/using-the-linode-shell-lish/).

### Using the Lish Console

If you need to quickly access Lish, use the Lish Console to open it directly from your web browser. Here's how:

1.  Log in to the [Cloud Manager](https://cloud.linode.com).
1.  Click the **Linodes** link in the sidebar.
1.  Select a Linode. The Linode's detail page appears.
1.  Select the **Launch Console** link as shown below.

    ![Launch the Lish console by clicking the 'Launch Console' link.](remote_access_launch_lish_console.png)

1.  Enter a username and password to log in.

You are now logged in to the Lish console.

## Using SSH

You can also access Lish with an SSH client application installed on your computer. Here's how:

1.  Log in to the [Cloud Manager](https://cloud.linode.com).

1.  Accessing Lish via SSH requires additional authentication over and above your Linode's username and password. To change authentication requirements or to add an SSH key, navigate to **My Profile** and select the **Lish Console Settings** link:

    ![Navigate to 'My Profile'](remote_access_profile.png)

1.  If using SSH key pair authentication, copy and paste your public key in to the **SSH Public Key** field, and then click **Save**. You can optionally add more than one SSH public key by clicking on the **Add SSH Public Key** button.

    ![The LISH menu in 'My Profile' settings](remote_access_lish_menu.png)

1.  To log in to Lish over SSH, click the **Linodes** link in the sidebar.
1.  Select a Linode. The Linode's detail page appears.
1.  Copy the **Lish Console via SSH** text in the *Access* pane:

    ![Copy the 'Lish via SSH' text in the 'Access' pane](remote_access_lish_via_ssh.png)


1.  Paste the text into the shell of your choice.
1. Your SSH client connects to your Linode via Lish.

You are now logged in to Lish via SSH.

