---
author:
  name: Linode
  email: docs@linode.com
description: This guide presents troubleshooting strategies for Linodes that may be unresponsive due to issues caused by a firewall.
og_description: This guide presents troubleshooting strategies for Linodes that may be unresponsive due to issues caused by a firewall.
keywords: ["Linode troubleshooting", "Cloud Firewall", "Firewall"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-08-04
modified: 2020-08-04
modified_by:
  name: Linode
title: Troubleshooting Firewalls
h1_title: Diagnose & Resolve Issues with Firewalls
---

This guide presents troubleshooting strategies for Linodes that may be unresponsive due to issues caused by a firewall.

In many cases, you might suspect a firewall issue if only some of your services are inaccessible, or in situations of limited access. A firewall may also be suspected if an issue was noticed not long after implementing new firewall rules.

It's important to note that while a firewall is often responsible for cases of limited access, these issues may also potentially be caused by a wide array of other issues such as limited network access, resource contention like throttled memory, or internal processes or services that are not configured to communicate over the internet.

## Before You Begin

You should familiarize yourself with *Lish*. It is a helpful troubleshooting tool for diagnosing connection problems.

### The Linode Shell (Lish)

[*Lish*](/docs/platform/manager/using-the-linode-shell-lish/) is a shell that provides access to your Linode's serial console. Lish does not establish a network connection to your Linode, so you can use it when your networking is down or SSH is inaccessible. If you find yourself locked out of SSH, you can use Lish to perform much of the troubleshooting for basic connection issues.

To learn about Lish in more detail, and for instructions on how to connect to your Linode via Lish, review the [Using the Linode Shell (Lish)](/docs/platform/manager/using-the-linode-shell-lish/) guide. In particular, [using your web browser](/docs/platform/manager/using-the-linode-shell-lish/#use-a-web-browser) is a fast and simple way to access Lish.

{{< note >}}
The root user is available in Lish even if root user login is disabled in your SSH configuration.
{{< /note >}}

## Is my Linode Powered On?

To begin, log into the [Cloud Manager](https://cloud.linode.com/) and inspect the Linode's dashboard. If the Linode is powered off, turn it on.

## Is my Cloud Firewall Effecting Me?

If you are using Linode's Cloud Firewall then it's important to check your rules and observe which Linodes are currently affected by Cloud Firewall.

1.  Log into [Cloud Manager](https://cloud.linode.com) and select **Firewalls** from the menu.
1.  The Firewalls screen displays a list of all the firewalls currently active on your account.

    [![firewall-home](firewall-home.png)](firewall-home.png)

1.  To find the Linode that you believe is being affected, look in the `Linodes` column for the label you've assigned it.
1.  Next, check the `Status` column to confirm that the firewall is `Enabled`.
1.  If so, check what rules are currently applied by clicking on the `Edit` link in the row for the firewall you wish to edit, or by clicking on the label of the firewall itself. Doing either opens the **Rules** page.

    [![firewall-details](firewall-details.png)](firewall-details.png)

1.  The **Rules** page displays a list of all of the firewall rules that are affecting Linodes that the firewall has been applied to. You can also view these individual rules by `Type`, `Protocol`, `Port Range`, and `Sources` by clicking those words in the header.
1.  If these rules seem to be affecting your service or services, you can remove or edit these rules independently by clicking the `Edit` or `Delete` links to the right of each rule respectively.

    {{< note >}}
Cloud Firewall rules are applied on the host level and are not detectable internally on Linodes. For more on how to setup and use Cloud Firewall, see the guide [A Tutorial for Adding and Configuring Linode Cloud Firewalls](/docs/platform/cloud-firewall/getting-started-with-cloud-firewall).
{{< /note >}}

## Checking Firewall Rules with UFW

**Uncomplicated Firewall** or **UFW** is an iptables frontend that is designed for ease-of-use. To find more information, see our guide on [How to Configure a Firewall with UFW](/docs/security/firewalls/configure-firewall-with-ufw/).

To see all active UFW rules, enter the following command:

    sudo ufw status

Your output will be similar to the following:

{{< output >}}
Status: active

To                         Action      From
--                         ------      ----
22                         ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443                        ALLOW       Anywhere
22 (v6)                    ALLOW       Anywhere (v6)
80/tcp (v6)                ALLOW       Anywhere (v6)
443 (v6)                   ALLOW       Anywhere (v6)
{{< /output >}}

If the status is active, the rules listed are all in place and may be blocking one of your services. To remove any individual firewall rule, use the following syntax:

    sudo ufw delete <Action> <To>

For example, to delete the Allow rule for port 80 from the example output above, enter the following command:

    sudo ufw delete allow 80

## Checking Firewall Rules with FirewallD

`firewalld` is the default firewall tool for CentOS and Fedora. While also a frontend for iptables like UFW, firewalld has some behaviours that are unique, like configuration sets and zones.

To list all all configurations for all zones, enter the following command:

    sudo firewall-cmd --list-all-zones

If you find a rule that doesn't belong, you can safely remove it using the following syntax:

    sudo firewall-cmd --zone=zonename --remove-service=servicename --permanent

For more information on understanding firewalld, see our guide to firewalld, [Introduction to FirewallD on CentOS](/docs/security/firewalls/introduction-to-firewalld-on-centos/)


## Checking Firewall Rules with iptables

`iptables` is the most common firewall used on Linux systems. If you're unsure of which firewall software you may be using, chances are that it's iptables in some form.

To list all active firewall rules using iptables, enter the following commands for IPv4 and IPv6 respectfully:

    sudo iptables -L -nv

    sudo ip6tables -L -nv

Removing rules uses the same syntax to add rules, with the addition of the `-D` or `--delete` option. For example, use the following commands to delete a rule that drops connections to port 110, on the eth0 interface, towards the IPv4 address 198.51.100.0:

    iptables --delete INPUT -j DROP -p tcp --destination-port 110 -i eth0 -d 198.51.100.0

or

    iptables -D INPUT -j DROP -p tcp --destination-port 110 -i eth0 -d 198.51.100.0

For more information on reading and interpreting iptables rules see our guide on iptables, [A Tutorial for Controlling Network Traffic with iptables](https://www.linode.com/docs/security/firewalls/control-network-traffic-with-iptables/#basic-iptables-rulesets-for-ipv4-and-ipv6)
