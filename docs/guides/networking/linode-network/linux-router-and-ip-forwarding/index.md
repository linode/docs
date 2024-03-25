---
slug: linux-router-and-ip-forwarding
title: "Configure Linux as a Router (IP Forwarding)"
description: "Learn how to set up a Linux server as a router, including configuring port forwarding and iptables."
keywords: ["static", "ip address", "addresses"]
tags: ["networking","linode platform"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-30
modified: 2024-02-14
modified_by:
  name: Nathaniel Stickman
title: "Configure Linux as a Router (IP Forwarding)"
authors: ["Linode", "Nathaniel Stickman"]
---

A computer network is a collection of computer systems that can communicate with each other. In order to communicate with a computer that's on a *different* network, a system needs a way to connect to that other network. A *router* is a system that acts as an intermediary between multiple different networks. It receives traffic from one network that is ultimately destined for another. It identifies where a particular packet should be delivered, then forwards that packet over the appropriate network interface.

There are lots of options for off-the-shelf router solutions for both home and enterprise use. These solutions are often preferred for numerous reasons. They are relatively easy to configure, have lots of features, tend to have a user-friendly management interface, and may even come with support options. Under the hood, these routers are stripped-down computers running common operating systems, such as Linux.

Instead of using one of these pre-built solutions, you can create your own using any Linux server, such as an Akamai Cloud Compute Instance. Routing software like iptables provides total control over configuring a router and firewall to suit your individual needs. This guide covers how to set up a Linux system as a basic router, including enabling IP forwarding and configuring network routing.

## Use Cases for a Cloud-based Router

Many workloads benefit from custom routing or port forwarding solutions, including those workloads hosted on cloud platforms like Akamai. For example, it's common practice for security-minded applications to connect most of their systems together through a private network, like a VLAN. These systems might need access to an outside network, such as other VLANs or the public internet. Instead of giving each system their own interface to the other network, one system on the private network can act as a router. The router is configured with multiple network interfaces: one to the private VLAN and another to the other network. It then forwards packets from one interface to another. This can make monitoring, controlling, and securing traffic much easier, as it can all be done from a single system. Akamai Cloud Compute Instances can be configured with up to three interfaces, each connecting to either the public internet or a private VLAN:

- Connect systems on private VLAN to the public internet.
- Connect systems on two separate private VLANs.
- Forward IPv6 addresses from a `/56` routed range.

## Configure a Linux System as a Router

Here are the basic steps needed to configure a Linux system as a router:

1. **[Deploy *at least two* Compute Instances](#deploy-compute-instances)** (or other virtual machines) to the same data center. Connect all systems to the same private network, like a [VLAN](/docs/products/networking/vlans/). Designate one system as the router and connect it to the public internet or a different private network.

1.  **[Enable IP Forwarding](#enable-ip-forwarding)** on the Compute Instance designated as the router.

1.  **[Configure the Routing Software](#configure-the-routing-software)** on that router instance. This guide covers using nftables, iptables, or Firewalld.

1.  **[Define the Gateway](#define-the-gateway)** on each system *other than* the router. This gateway should point to the router's IP address on that network.

Continue reading for detailed instructions on each of these steps.

## Deploy Compute Instances

To get started, use the Akamai Cloud Compute platform to deploy multiple Compute Instances. These can mimic a basic application that is operating on a private VLAN with a single router. Skip this section if you already have an application deployed and just wish to know how to configure IP forwarding or the router software.

1.  Deploy two or more Compute Instances to the same region and designate one as the router. This guide uses Debian 12, but the instructions are generally applicable to other Linux distributions. On the deployment page, skip the VLAN section for now. See [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) to learn how to deploy Linode Compute Instances.

1.  Edit each Compute Instance's configuration profile. See [Managing Configuration Profiles](/docs/products/compute/compute-instances/guides/configuration-profiles/) for information on viewing and editing configuration profiles.

    - **Router Instance**: On the Compute Instance designated as the *router*, leave **eth0** as the public internet and set **eth1** as a VLAN. Enter a name for the VLAN and assign it an IP address from whichever subnet range you wish to use. For example, if you wish to use the `10.0.2.0/24` subnet range, assign the IP address `10.0.2.1/24`. By convention, the router should be assigned the value of `1` in the last segment.

    - **Other Instance/s**: On each Compute Instance *other than the router*, remove all existing network interfaces. Set *eth0* as a VLAN, select the VLAN you just created, and enter another IP address within your desired subnet (e.g. `10.0.2.2/24`, `10.0.2.3/24`, and so on).

1.  Confirm that [Network Helper](/docs/products/compute/compute-instances/guides/network-helper/) is enabled and reboot each Compute Instance for the changes to take effect.

1.  Log in to each instance and test the connectivity on each Compute Instance to ensure proper configuration. To do this, you can use [SSH](/docs/guides/connect-to-server-over-ssh/), or [Lish](/docs/products/compute/compute-instances/guides/lish/) if utilizing an Akamai Cloud Compute Instance.

    -   Ping the VLAN IPv4 address of another system within the same VLAN:

        ```command {title="Router Instance"}
        ping 10.0.2.2
        ```

        ```command {title="Other Instance/s"}
        ping 10.0.2.1
        ```

        Each Compute Instance should be able to ping the IP addresses of all other instances within that VLAN.

    -   Ping an IP address or website of a system on the public internet.

        ```command {title="All Instances"}
        ping linode.com
        ```

        This ping should only be successful for the Compute Instance configured as the router.

## Enable IP Forwarding

*IP forwarding* plays a fundamental role on a router. This is the functionality that allows a router to forward traffic from one network interface to another. When configured along with routing software, it allows a computer on one network to reach a computer on a different network. Forwarding for both IPv4 and IPv6 addresses are controlled within the Linux kernel. The following kernel parameters are used to enable or disable IPv4 and IPv6 forwarding, respectively:

- **IPv4**: `net.ipv4.ip_forward` or `net.ipv4.conf.all.forwarding`
- **IPv6**: `net.ipv6.conf.all.forwarding`

Forwarding is disabled on most Linux systems by default. However, this must be enabled to configure Linux as a router. To enable forwarding, the corresponding parameter should be set to `1`. A value of `0` indicates that forwarding is disabled. To update these kernel parameters, edit the `/etc/sysctl.conf` file as shown in the steps below:

1.  On the Linux system you intend to use as a *router*, determine if IPv4 forwarding is currently enabled or disabled. The command below outputs the value of the given parameter. A value of `1` indicates that the setting is enabled, while `0` indicates it is disabled.

    ```command {title="Router Instance"}
    sudo sysctl net.ipv4.ip_forward
    ```

    ```output
    net.ipv4.ip_forward = 0
    ```

    If this parameter returns with a value of `0`, it is disabled, and you must continue with the instructions below.

    {{< note >}}
    If you intend to configure IPv6 forwarding, check that kernel parameter as well:

    ```command
    sudo sysctl net.ipv6.conf.all.forwarding
    ```
    {{< /note >}}

1.  Open the `/etc/sysctl.conf` file using a command-line text editor with `sudo` permissions such as [nano](/docs/guides/use-nano-to-edit-files-in-linux/):

    ```command {title="Router Instance"}
    sudo nano /etc/sysctl.conf
    ```

1.  Find the line corresponding with the type of forwarding you wish to enable, uncomment it, and set the value to `1`. Alternatively, you can add the following lines anywhere in the file.

    ```file {title="/etc/sysctl.conf" lang="aconf" linenostart="27" hl_lines="2,7"}
    # Uncomment the next line to enable packet forwarding for IPv4
    net.ipv4.ip_forward=1

    # Uncomment the next line to enable packet forwarding for IPv6
    #  Enabling this option disables Stateless Address Autoconfiguration
    #  based on Router Advertisements for this host
    net.ipv6.conf.all.forwarding=1
    ```

1.  When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Once the changes are saved, run the following command (or reboot the machine) to apply them:

    ```command {title="Router Instance"}
    sudo sysctl -p
    ```

    ```output
    net.ipv4.ip_forward = 1
    net.ipv6.conf.all.forwarding = 1
    ```

## Configure the Routing Software

Linux network utilities like nftables, iptables, and Firewalld can serve as both a firewall and as a router. This section covers how to configure each of these tools to function as a basic router. You can, alternatively, opt for a commercial routing application.

1.  On the Linux system you intend to use as a *router*, review the existing network rules. On a fresh Linux installation, there may not be any preconfigured rules. If there are, look for any rules that might interfere with your intended configuration. Consult a system administrator or the network utility documentation linked below to help determine.

    {{< tabs >}}
    {{< tab "nftables" >}}

    ```command {title="Router Instance"}
    sudo nft list ruleset
    ```

    Refer to the [nftables](https://www.netfilter.org/projects/nftables/manpage.html) documentation for an explanation of any existing rules.

    If necessary, flush the existing rules and configure nftables to allow all traffic:

    ```command {title="Router Instance"}
    sudo nft flush ruleset
    sudo nft add table inet filter
    sudo nft add chain inet filter input '{type filter hook input priority 0; policy accept; }'
    sudo nft add chain inet filter forward '{type filter hook forward priority 0; policy accept; }'
    sudo nft add chain inet filter output '{type filter hook output priority 0; policy accept; }'
    ```

    {{< /tab >}}
    {{< tab "iptables" >}}

    ```command {title="Router Instance"}
    sudo iptables -S
    ```

    Refer to the [iptables](https://linux.die.net/man/8/iptables) documentation for clarification on any extant rules.

    If necessary, flush your existing rules and configure iptables to allow all traffic:

    ```command {title="Router Instance"}
    sudo iptables -F
    sudo iptables -X
    sudo iptables -t nat -F
    sudo iptables -t nat -X
    sudo iptables -t mangle -F
    sudo iptables -t mangle -X
    sudo iptables -P INPUT ACCEPT
    sudo iptables -P OUTPUT ACCEPT
    sudo iptables -P FORWARD ACCEPT
    ```

    {{< /tab >}}
    {{< tab "Firewalld" >}}

    ```command {title="Router Instance"}
    sudo firewall-cmd --list-all-zones
    ```

    Refer to the [Firewall-cmd](https://firewalld.org/documentation/man-pages/firewall-cmd) documentation for more on any existing configuration.

    If necessary, return to Firewalld defaults and subsequently allow all traffic:

    ```command {title="Router Instance"}
    sudo rm -rf /etc/firewalld/zones/
    sudo firewall-cmd --zone=public --set-target=ACCEPT --permanent
    sudo firewall-cmd --complete-reload
    ```

    ```output
    success
    success
    ```

    {{< /tab >}}
    {{< /tabs >}}

1.  Configure the utility to allow port forwarding. This is the default setting for many systems.

    {{< tabs >}}
    {{< tab "nftables" >}}

    ```command {title="Router Instance"}
    sudo nft add chain inet filter forward '{type filter hook forward priority 0; policy accept; }'
    ```

    {{< /tab >}}
    {{< tab "iptables" >}}

    ```command {title="Router Instance"}
    sudo iptables -A FORWARD -j ACCEPT
    ```

    {{< /tab >}}
    {{< tab "Firewalld" >}}

    ```command {title="Router Instance"}
    sudo firewall-cmd --zone=public --add-forward
    ```

    ```output
    success
    ```
    {{< /tab >}}
    {{< /tabs >}}

1.  Configure NAT ([network address translation](https://en.wikipedia.org/wiki/Network_address_translation)) within the utility. This modifies the IP address details in network packets, allowing all systems on the private network to share the same public IP address of the router. Replace `10.0.2.0/24` in the following command with the subnet of your private VLAN.

    {{< tabs >}}
    {{< tab "nftables" >}}

    nftables does not include a `nat` table by default, so you should create one, along with `prerouting` and `postrouting` chains. While the masquerading rule only applies to the postrouting chain, the nftables configuration requires the complementary prerouting chain as well.

    ```command {title="Router Instance"}
    sudo nft add table inet nat
    sudo nft add chain inet nat prerouting '{ type nat hook prerouting priority -100; }'
    sudo nft add chain inet nat postrouting '{ type nat hook postrouting priority 100; }'
    ```

    From there, you can add the `masquerade` rule to apply to connections from the private network.

    ```command {title="Router Instance"}
    sudo nft add rule inet nat postrouting ip saddr 10.0.2.0/24 masquerade
    ```

    {{< note >}}
    Alternatively, you can apply the rule without a specific subnet. In this case, the masquerade applies to any connection passed through the router.

    ```command {title="Router Instance"}
    sudo nft add rule inet nat postrouting masquerade
    ```
    {{< /note >}}

    {{< /tab >}}
    {{< tab "iptables" >}}

    ```command {title="Router Instance"}
    sudo iptables -t nat -s 10.0.2.0/24 -A POSTROUTING -j MASQUERADE
    ```

    {{< note >}}
    Alternatively, you can forgo specifying a subnet and allow NAT over all traffic using the command below:

    ```command {title="Router Instance"}
    sudo iptables -t nat -A POSTROUTING -j MASQUERADE
    ```
    {{< /note >}}
    {{< /tab >}}
    {{< tab "Firewalld" >}}

    ```command {title="Router Instance"}
    sudo firewall-cmd --zone=public --add-rich-rule='rule family=ipv4 source address=10.0.2.0/24 masquerade'
    ```

    ```output
    success
    ```
    {{< note >}}
    Alternatively, to masquerade and allow NAT over all traffic through the router, use the command below:

    ```command {title="Router Instance"}
    sudo firewall-cmd --zone=public --add-masquerade
    ```
    {{< /note >}}
    {{< /tab >}}
    {{< /tabs >}}

1.  Make the configurations persistent.

    {{< tabs >}}
    {{< tab "nftables" >}}

    nftables rules apply immediately, but only hold until the nftables service restarts. To persist an nftables setup across restarts, you need to define that setup in the nftables configuration file, located at `/etc/nftables.conf`. The file needs to begin with two lines, the first executing the nftables command and the second flushing the current ruleset:

    ```file {title="/etc/nftables.conf" lang="aconf"}
    #!/usr/sbin/nft -f

    flush ruleset
    ```

    After this, you can paste your ruleset. To get the current ruleset, use the same list command as shown further above:

    ```command {title="Router Instance"}
    sudo nft list ruleset
    ```

    {{< note >}}
    More conveniently, you can combine these steps into a set of commands to automatically recreate the configuration file from your current nftables rules. The first command recreates the configuration file with the necessary preamble lines, while the second adds your current configuration to the file:

    ```command {title="Router Instance"}
    sudo sh -c 'echo -e "#!/usr/sbin/nft -f\n\nflush ruleset\n" > /etc/nftables.conf'
    sudo sh -c 'nft list ruleset >> /etc/nftables.conf'
    ```
    {{< /note >}}
    {{< /tab >}}
    {{< tab "iptables" >}}

    By default, iptables rules are ephemeral. To make your configuration changes persistent, install the `iptables-persistent` package. When you do this, the rules saved within `/etc/iptables/rules.v4` (and `rules.v6` for IPv6) are loaded when the system boots up.

    You can continue making changes to iptables as normal. When you are ready to save, save the output of [iptables-save](https://linux.die.net/man/8/iptables-save) to the `/etc/iptables/rules.v4` (or `rules.v6`) file. For more information, see the relevant section in the [Controlling Network Traffic with iptables](/docs/guides/control-network-traffic-with-iptables/#introduction-to-iptables-persistent) guide.

    ```command {title="Router Instance"}
    sudo mkdir /etc/iptables | sudo iptables-save | sudo tee /etc/iptables/rules.v4
    ```

    {{< /tab >}}
    {{< tab "Firewalld" >}}

    The Firewalld commands above are dynamic, meaning they take effect immediately but are not persistent. You can add the `--permanent` option to each command to make it persistent, however, Firewalld offers a dedicated command to persist its current dynamic configuration:

    ```command {title="Router Instance"}
    sudo firewall-cmd --runtime-to-permanent
    ```

    ```output
    success
    ```

    {{< note >}}
    Linux systems using SELinux may need to first set SELinux enforcement to `permissive` in order to convert runtime rules to persistent rules. You can do so with the following command:

    ```command {title="Router Instance"}
    sudo setenforce permissive
    ```

    When you have made the rules persistent, you can return to the previous SELinux setting with `setenforce 1`.
    {{< /note >}}

    {{< /tab >}}
    {{< /tabs >}}

## Define the Gateway

The last step is to manually adjust the network configuration settings for each Compute Instance *other than* the router.

1.  Log in to the [Cloud Manager](https://cloud.linode.com) and disable [Network Helper](/docs/products/compute/compute-instances/guides/network-helper/#enable-or-disable-network-helper) for each non-router Compute Instance you've deployed. While Network Helper was useful for automatically configuring the VLAN IP addresses, the configuration files controlled by Network Helper now need to be manually edited.

1.  Log in to each Linux system that is *not* designated as the router. To do so, you can use [SSH](/docs/guides/connect-to-server-over-ssh/) from the router, or [Lish](/docs/products/compute/compute-instances/guides/lish/) if using an Akamai Cloud Compute Instance.

1.  Edit the configuration file that contains the settings for the private VLAN interface. The name and location of this file depends on the Linux distribution you are using. See the [Manual Network Configuration on a Compute Instance](/docs/products/compute/compute-instances/guides/manual-network-configuration/) series of guides and select the specific guide for your distribution. For a system running [ifupdown](/docs/products/compute/compute-instances/guides/ifupdown/) on Debian 12, the network configuration is typically stored within `/etc/network/interfaces`:

    ```command {title="Other Instance/s"}
    sudo nano /etc/network/interfaces
    ```

1.  Within this file, adjust the parameter that defines the gateway for the VLAN interface. The value should be set to the IP address assigned to the *router's* VLAN interface, such as `10.0.2.1` if using the examples in this guide. For a system running [ifupdown](/docs/products/compute/compute-instances/guides/ifupdown/) on Debian 12, add the gateway parameter in the location shown in the example below:

    ```file {title="/etc/network/interfaces" hl_lines="27"}
    # Generated by Linode Network Helper
    # Wed Dec 20 16:02:08 2023 UTC
    #
    # This file is automatically generated on each boot with your Linode's
    # current network configuration. If you need to modify this file, please
    # first disable the 'Auto-configure networking' setting within your Linode's
    # configuration profile:
    #  - https://cloud.linode.com/linodes/53248278/configurations
    #
    # For more information on Network Helper:
    #  - https://www.linode.com/docs/guides/network-helper/
    #
    # A backup of the previous config is at /etc/network/.interfaces.linode-last
    # A backup of the original config is at /etc/network/.interfaces.linode-orig
    #
    # /etc/network/interfaces

    auto lo
    iface lo inet loopback

    source /etc/network/interfaces.d/*

    auto eth0

    iface eth0 inet static
        address 10.0.2.2/24
        gateway 10.0.2.1
    ```

1.  When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Once those settings are saved, restart the Compute Instance or run the corresponding command to apply the changes. Continuing to use [ifupdown](/docs/products/compute/compute-instances/guides/ifupdown/) as an example, run the command below to apply the new network configuration settings:

    ```command {title="Other Instance/s"}
    sudo ifdown eth0 && sudo ip addr flush eth0 && sudo ifup eth0
    ```

    {{< note >}}
    The first part of the command shuts down networking services, causing you to briefly lose connection, which outputs the following error message:

    ```output
    RTNETLINK answers: No such process
    ```

    This error can be safely ignored.
    {{< /note >}}

## Test the Connection

To verify the configuration settings are correct, run the same tests from the last step of the [Deploy Compute Instances](#deploy-compute-instances) section. Specifically, ping a public IP address or domain from a Compute Instance within the private VLAN that's not designated as the router:

```command {title="Other Instance/s"}
ping linode.com
```

This ping should now complete successfully, indicating that the network traffic was successfully forwarded through the router to the public internet.