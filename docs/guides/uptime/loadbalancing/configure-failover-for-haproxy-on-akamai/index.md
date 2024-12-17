---
slug: configure-failover-for-haproxy-on-akamai
title: "Configure Failover for HAProxy on Akamai"
description: "Learn how to set up HAProxy load balancing with IP sharing, FRRouting, and BGP failover in this step-by-step guide."
authors: ["Tom Henderson"]
contributors: ["Tom Henderson"]
published: 2024-12-17
keywords: ['haproxy','load balancing','failover','ip sharing','frrouting','bgp','high availability']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

[HAProxy](https://www.haproxy.org/) is an HTTP and TCP gateway server that functions as a reverse proxy between a public-facing IP address and a set of backend servers. It manages incoming traffic using frontend rules and distributes it across the backend servers, providing load balancing and repairing HTTP requests when needed.

However, HAProxy introduces a single point of failure. If the HAProxy server goes down, client connections to backend services are interrupted. This guide demonstrates how to configure HAProxy with a shared IP address and [FRRouting](https://frrouting.org/) to manage failover. The IP Sharing setup enables two HAProxy instances (primary and backup) to operate under the same IP address. In this setup, the primary instance is always active and the backup instance stands ready to take over in case of failure of the primary instance. FRRouting, configured with the Border Gateway Protocol (*BGP*), facilitates this automatic failover and maintains service continuity.

This guide uses the free and open source (*FOSS*) version of HAProxy to create and demonstrate basic HAProxy failover pairs. With the FOSS version of HAProxy, the backup server doesn't retain the connection states of the primary instance. Therefore, when the backup becomes active, clients may need to reconnect to re-establish sessions. In contrast, the enterprise edition offers state-saving and restoration capabilities, along with other features that restore a failover with configuration data.

## Before You Begin

1.  Follow the steps in [Getting Started with HAProxy TCP Load Balancing and Health Checks](/docs/guides/getting-started-with-haproxy-tcp-load-balancing-and-health-checks/) to create the example HAProxy instance and WordPress backend servers.

1.  Deploy a second HAProxy instance in the same data center, configured identically to the first HAProxy server.

1.  Disable Network Helper on both HAProxy instances by following the *Individual Compute Instance setting* section of our [Network Helper](https://techdocs.akamai.com/cloud-computing/docs/automatically-configure-networking#individual-compute-instance-setting) guide.

1.  Add an IP address to the first HAProxy instance by following the steps in the *Adding an IP Address* section of [Managing IP Addresses on a Compute Instance](https://techdocs.akamai.com/cloud-computing/docs/managing-ip-addresses-on-a-compute-instance#adding-an-ip-address).

1.  Link the second HAProxy instance to the new IP address on the first instance by following the *Configuring IP Sharing* section of [Managing IP Addresses on a Compute Instance](https://techdocs.akamai.com/cloud-computing/docs/managing-ip-addresses-on-a-compute-instance#configuring-ip-sharing).

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Configure the Shared IP Address

Follow the instructions for your distribution to add the shared IP address to the networking configuration on both the primary and backup HAProxy servers:

{{< tabs >}}
{{< tab "Ubuntu 24.04 LTS" >}}
Ubuntu 24.04 LTS uses `netplan` to manage network settings.

1.  Open the `/etc/netplan/01-netcfg.yaml` file in a text editor such as `nano`:

    ```command
    sudo nano /etc/netplan/01-netcfg.yaml
    ```

    Append the highlighted lines to the end of the file:

    ```file {title="/etc/netplan/01-netcfg.yaml" hl_lines="7-11"}
    network:
      version: 2
      renderer: networkd
      ethernets:
        eth0:
          dhcp4: yes
        lo:
          match:
            name: lo
          addresses:
            - YOUR_SHARED_IP_ADDRESS/YOUR_PREFIX
    ```

    Be sure to make substitute your actual values for the following placeholders:

    -   {{< placeholder "YOUR_SHARED_IP_ADDRESS" >}}: The shared IP address you set for HAProxy failover.
    -   {{< placeholder "YOUR_PREFIX" >}}: Use `32` for IPv4 addresses. For IPv6, use either `56` or `64`, depending on the range you're sharing.

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Run the following command to apply the changes:

    ```command
    sudo netplan apply
    ```
{{< /tab >}}
{{< tab "CentOS Stream 9" >}}
CentOS Stream 9 uses NetworkManager to configure network settings.

1.  Open the network configuration file for editing:

    ```command
    sudo nano /etc/sysconfig/network-scripts/ifcfg-lo:1
    ```

    Add the following configurations to set up the shared IP address:

    ```file {title="/etc/sysconfig/network-scripts/ifcfg-lo:1"}
    DEVICE=lo:1
    IPADDR=YOUR_SHARED_IP_ADDRESS
    NETMASK=YOUR_NETMASK
    ONBOOT=yes
    ```

    Be sure to make substitute your actual values for the following placeholders:

    -   {{< placeholder "YOUR_SHARED_IP_ADDRESS" >}}: The shared IP address you set for HAProxy failover.
    -   {{< placeholder "YOUR_NETMASK" >}}: Use `255.255.255.255` for IPv4 addresses.

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Restart `NetworkManager` to apply the settings:

    ```command
    sudo systemctl restart NetworkManager
    ```
{{< /tab >}}
{{< tab "openSUSE Leap 15.6" >}}
openSUSE Leap 15.6 uses `wicked` to manage network configurations.

1.  Edit the loopback configuration file:

    ```command
    sudo nano /etc/sysconfig/network/ifcfg-lo
    ```

    Append the shared IP address settings to the end of the file:

    ```file {title="/etc/sysconfig/network/ifcfg-lo"}
    IPADDR=YOUR_SHARED_IP_ADDRESS
    NETMASK=YOUR_NETMASK
    LABEL=1
    ```

    Be sure to make substitute your actual values for the following placeholders:

    -   {{< placeholder "YOUR_SHARED_IP_ADDRESS" >}}: The shared IP address you set for HAProxy failover.
    -   {{< placeholder "YOUR_NETMASK" >}}: Use `255.255.255.255` for IPv4 addresses.

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Restart the network to activate the settings:

    ```command
    sudo systemctl restart wicked
    ```
{{< /tab >}}
{{< /tabs >}}

## Duplicate the HAProxy Configuration File

To prepare for failover, the backup HAProxy instance must have an identical HAProxy configuration file to the primary instance. To ensure this, copy the HAProxy configuration file from the primary server to the backup server.

Run this `scp` command on the backup server, replacing {{< placeholder "USERNAME" >}} with either `root` or another user with `sudo` access, and {{< placeholder "PRIMARY_SERVER_IP_ADDRESS" >}} with the actual IP address of the primary HAProxy server:

```command {title="Backup Instance"}
scp {{< placeholder "USERNAME" >}}@{{< placeholder "PRIMARY_SERVER_IP_ADDRESS" >}}:/etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg
```

When prompted, enter the primary server's `root` or `sudo` user password to complete the transfer.

Once the command finishes, verify that the configuration files on both servers are identical.

{{< note >}}
In this example failover configuration, the primary server does not automatically become active once restored. After a failover event, copy the configuration file back to the primary server from the backup server to restore active status.
{{< /note >}}

## Install FRRouting

With IP Sharing properly configured, you're ready to install FRRouting. Follow these instructions on both the primary and backup HAProxy servers:

1.  Install FRRouting:

    {{< tabs >}}
    {{< tab "Ubuntu 24.04 LTS" >}}
    Install `frr` and `frr-pythontools` using `apt`:

    ```command
    sudo apt install frr frr-pythontools
    ```
    {{< /tab >}}
    {{< tab "CentOS Stream 9" >}}
    Install `frr` and `frr-pythontools` using `dnf`:

    ```command
    sudo dnf install frr
    ```
    {{< /tab >}}
    {{< tab "openSUSE Leap 15.6" >}}
    Install `frr` using `zypper`:

    ```command
    sudo zypper install frr
    ```
    {{< /tab >}}
    {{< /tabs >}}

1.  Start the FRRouting service using `systemctl`:

    ```command
    sudo systemctl start frr
    ```

1.  Enable FRRouting to run on startup:

    ```command
    sudo systemctl enable frr
    ```

## Configure FRRouting

FRRouting must be configured on both the primary and backup HAProxy instances. Follow these instructions on both instances:

1.  Open the FRRouting `/etc/frr/daemons` file to enable the BGP daemon:

    ```command
    sudo nano /etc/frr/daemons
    ```

    Locate the `bgpd` line and change its value to `yes` to activate the BGP daemon:

    ```file {title="/etc/frr/daemons"}
    # The watchfrr and zebra daemons are always started.
    #
    bgpd=yes
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Open the FRRouting configuration file located at `/etc/frr/frr.conf`:

    ```command
    sudo nano /etc/frr/frr.conf
    ```

    Append the following content to the end of the file to configure BGP settings:

    ```file {title="/etc/frr/frr.conf" hl_lines="1,11-14,16,17"}
    hostname {{< placeholder "YOUR_HOSTNAME" >}}

    router bgp 65001
    no bgp ebgp-requires-policy
    coalesce-time 1000
    bgp bestpath as-path multipath-relax
    neighbor RS peer-group
    neighbor RS remote-as external
    neighbor RS ebgp-multihop 10
    neighbor RS capability extended-nexthop
    neighbor 2600:3c0f:{{< placeholder "YOUR_DC_ID" >}}:34::1 peer-group RS
    neighbor 2600:3c0f:{{< placeholder "YOUR_DC_ID" >}}:34::2 peer-group RS
    neighbor 2600:3c0f:{{< placeholder "YOUR_DC_ID" >}}:34::3 peer-group RS
    neighbor 2600:3c0f:{{< placeholder "YOUR_DC_ID" >}}:34::4 peer-group RS

    address-family {{< placeholder "YOUR_PROTOCOL" >}} unicast
      network {{< placeholder "YOUR_SHARED_IP_ADDRESS" >}}/{{< placeholder "YOUR_PREFIX" >}} route-map {{< placeholder "YOUR_ROLE" >}}
      redistribute static
    exit-address-family

    route-map primary permit 10
      set community 65000:1
    route-map secondary permit 10
      set community 65000:2

    ipv6 nht resolve-via-default
    ```

    Substitute the following placeholders for your actual information:

    -   {{< placeholder "YOUR_HOSTNAME" >}}: Your instance's hostname.
    -   {{< placeholder "YOUR_DC_ID" >}}: The data center ID where your instances are located. Reference our [IP Sharing Availability table](https://techdocs.akamai.com/cloud-computing/docs/configure-failover-on-a-compute-instance#ip-sharing-availability) to determine the ID for your data center.
    -   {{< placeholder "YOUR_PROTOCOL" >}}: Either `ipv4` for IPv4 or `ipv6` for IPv6.
    -   {{< placeholder "YOUR_SHARED_IP_ADDRESS" >}}: Your shared IP address.
    -   {{< placeholder "YOUR_PREFIX" >}}: Use `32` for IPv4 addresses. For IPv6, use either `56` or `64`, depending on the range you're sharing.
    -   {{< placeholder "YOUR_ROLE" >}}: Set as `primary` on the primary instance and `secondary` on the backup instance.

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Restart `frr` to apply the configuration changes:

    ```command
    sudo systemctl restart frr
    ```

## Test Failover

FRRouting on the backup server monitors the primary server's status using a "ping-like" test. If the primary does not respond, the backup automatically takes over, providing continuous access to backend services.

To test failover, follow these steps:

1.  **Verify Initial Access**: Ensure the primary HAProxy server is actively serving pages. Open the shared IP address in a web browser and refresh until all three backend servers respond successfully.

1.  **Simulate Primary Failure**: Use the Akamai Cloud Manager to power down the primary HAProxy instance, triggering a failover to the backup server.

1.  **Confirm Failover**: Refresh the browser after powering down the primary HAProxy instance. Within a few seconds, the pages should load again, now served through the backup HAProxy instance. This indicates that failover is working as expected.

### Troubleshooting Test Failures

If failover does not occur and refreshing the browser does not restore page access through the backup server after several seconds, follow these troubleshooting steps:

-   **Verify IP Sharing Configuration**: Double-check that all steps for configuring IP Sharing were followed correctly.
-   **Check Network Connectivity**: Use the ICMP `ping` command to test if the backup server is reachable. If the backup server is not reachable, there may be an issue with the IP Sharing configuration.
-   **Review FRRouting Configuration**: Ensure that the FRRouting `frr.config` file is correctly configured, especially the Roles section, which should be set according to the provided instructions.
-   **Confirm HAProxy Configuration**: Verify that the backup server's `/etc/haproxy/haproxy.cfg` file matches the configuration of the primary server by comparing the two files directly.
-   **Test Backend Server Accessibility**: Try accessing a backend server directly (e.g. `backend1`) by its IP address. If the backend server responds correctly, the issue may lie with the failover configuration rather than the backend services.

Failover latency should be minimal, ideally within a few seconds. If failover takes longer, the FRRouting daemon's configuration offers several settings to optimize detection and failover speed.