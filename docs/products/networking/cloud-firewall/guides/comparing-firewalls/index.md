---
title: Comparing Cloud Firewalls to Linux Firewall Software
description: ""
modified: 2023-11-01
---

With the addition of Linode’s Cloud Firewall solution, there are now two primary ways to control network traffic on a Linode Compute Instance: through a Cloud Firewall or locally installed firewall software. While both are robust solutions, there may be certain cases in which you choose to use one over the other. More often than not, both solutions should be used in tandem.

{{< note >}}
Inbound and outbound rules configured through Linode’s Cloud Firewall are applied to Compute Instances, but only inbound rules apply to NodeBalancers.

Additionally, NodeBalancers do not support installation of third-party firewall software. If you need to manage inbound traffic rules for a NodeBalancer, we recommend using the Cloud Firewall service.
{{< /note >}}

## Cloud Firewalls

Linode’s free Cloud Firewall service is a powerful firewall solution that operates between your Linode services and the Internet. It provides an easy to use interface for filtering out unwanted network traffic. Through this service, you can create, configure, and add stateful network-based firewalls to any Linode Compute Instance or NodeBalancer.

- **Cost:** Free
- **Interface:** Cloud Manager (graphic user interface), the Linode CLI (command-line interface), and the Linode API (application programming interface).
- **Ease of use:** Relatively easy to configure using tools Linode customers may already be familiar with.
- **Advanced configurability:** Supports many common firewall rules, but does not support all configuration options available on software-based solutions like nftables.
- **Ideal use cases:**
    - Users wanting to conveniently configure firewalls using familiar Linode tooling.
    - Cascading rules over multiple servers simultaneously.
    - Automatically generating rules through software compatible with the Linode API (such as integrating directly with your existing custom software).
    - Users wanting to configure inbound firewall rules for NodeBalancers.

{{< note >}}
If you choose to manage inbound firewall rules for NodeBalancers using Cloud Firewalls, you still need to protect any back-end nodes (Compute Instances) configured to the NodeBalancer. The Cloud Firewall only filters incoming traffic to the NodeBalancer’s public IP and not the IPs of the individual instances unless they are also added to the Cloud Firewall.

You can protect your back-end nodes by either assigning the individual nodes to a Cloud Firewall (the same as your NodeBalancer or a new one) or by manually configuring firewalls internally on the instances themselves.
{{< /note >}}

## Firewall Software

*(Including nftables, iptables, ufw, and firewalld)*

The standard firewall software available on most modern Linux distributions is *nftables*, which replaces the older *iptables* software. Both of these utilities are packet filtering frameworks that integrate with the Linux kernel. These software solutions are configured through the command line. Their syntax is quite different from one another and formulating rules can be complicated for beginners. To make these utilities more user friendly, many distributions employ an easy to use front-end tool. These include *UFW* (Uncomplicated Firewall) on Ubuntu and Debian and *firewalld* on CentOS and RHEL derivatives.

- **Cost:** Free
- **Interface:** Command-line interface tools
- **Ease of use:** More difficult since a command-line is required and rule syntax can be quite complex, especially when working directly with *nftables* or *iptables*.
- **Advanced configurability:** Offers more comprehensive configuration for complex rules.
- **Ideal use cases:**
    - Users comfortable with both the command-line and the software's syntax.
    - Creating complex firewall rules.
    - Automatically generating rules through software like [*fail2ban*](https://www.fail2ban.org/wiki/index.php/Main_Page).


## Deciding Which Option to Use

When deciding on which firewall solution to use, consider your unique needs and the requirements for your application.

- **Familiarity:** A major reason you may decide to use one option over another is your own comfort level with the tools and interfaces need to configure each firewall. If you're more familiar with Linode's own tooling (such as Cloud Manager or CLI), the Cloud Firewall service may be easier for you to quickly configure. If you're more familiar with nftables or front-end software like *UFW*, you may want to stick to your existing tools and workflow. Consider your entire team's familiarity with the tooling, not just yours.

- **Configuration options:** While each solution is quite robust, using *nftables* allows for the creation of the most complex rules and provides absolute control of the firewall. That said, Cloud Firewalls are generally easier to configure and can be applied to multiple Linode services. This lets you quickly add or modify firewall rules across multiple Compute Instances simultaneously.

- **Automation possibilities:** Some Linux software products already integrate directly with nftables and can automatically create firewall rules. Perhaps the most commonly used example of this is [*fail2ban*](https://www.fail2ban.org/wiki/index.php/Main_Page), which can automatically create firewall rules to permanently or temporarily ban suspicious traffic. If you are configuring your own software, you may find it easier to integrate with the Linode API and use Cloud Firewalls instead of integrating directly with software-based firewalls.

## Combining Both Solutions

While Cloud Firewalls and local firewall software are separate tools, they can often be used together to combine their strengths and create an even more powerful firewall solution.

Consider using Cloud Firewalls to provide a line of defense *before* traffic even reaches your server. It is very user friendly and can quickly cascade rules over multiple different Linode Compute Instances. Consider using Firewall software like *nftables* when you need to create complex rules and want to integrate your firewall with existing software like *fail2ban*.

{{< note >}}
When using both solutions together, consider when each rule will be processed on incoming and outgoing traffic. **For inbound traffic, Cloud Firewall rules are processed first. For outbound traffic, local firewall rules are processed first.**
{{< /note >}}