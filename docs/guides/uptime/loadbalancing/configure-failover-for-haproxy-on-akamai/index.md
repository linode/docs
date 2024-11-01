---
slug: configure-failover-for-haproxy-on-akamai
title: "Configure Failover for Haproxy on Akamai"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Tom Henderson"]
contributors: ["Tom Henderson"]
published: 2024-09-18
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

HAProxy is an HTTP and TCP gateway server that functions as a reverse proxy between a public-facing IP address and backend servers. It manages incoming traffic using frontend rules and distributes it across backend servers, providing load balancing and repairing HTTP requests when needed.

However, HAProxy introduces a single point of failure. If HAProxy goes down, client connections to backend services are interrupted. To mitigate this, rapid failover to a backup HAProxy instance re-establishes communications with clients.

The free and open source (FOSS) version of HAProxy does not preserve the state of the failed instance during failover. As a result, the backup server must relearn frontend-backend routing upon activation. In contrast, the enterprise edition offers state-saving and restoration capabilities, along with other features that restore a failover with configuration data.

## Initial Setup: Deploy HAProxy and Backend Instances

This guide builds on the setup covered in [Getting Stated with HAProxy TCP Load Balancing and Health Checks](/docs/guides/getting-started-with-haproxy-tcp-load-balancing-and-health-checks). Begin by following those instructions to establish your initial platform. This guide uses the FOSS version of HAProxy to create and demonstrate basic HAProxy failover pairs.

## Deploy A Second HAProxy Instance

Deploy a second HAProxy instance located in the same data center and using the same configuration settings as the HAProxy server instance generated in [Getting Stated with HAProxy TCP Load Balancing and Health Checks](/docs/guides/getting-started-with-haproxy-tcp-load-balancing-and-health-checks).

Link the two servers by assigning a shared IP address in the same data center where the HAProxy instances are located. This creates a new network interface on each instance and allows them to communicate over a private network.

Install FRRouting (FRR) to connect the newly created network interfaces and establishes a private connection between the instances. Configure FRRouting with the Border Gateway Protocol (BGP) protocol to designate the roles of primary and backup, thus enabling failover. Follow the instructions in our [Configure IP failover over BGP using FRR (advanced)](/docs/products/compute/compute-instances/guides/failover-bgp-frr/#configure-frr) guide to designate these roles on your HAProxy instances.

In this setup, the primary and backup servers are two separate compute instances joined to a single shared IP address using BGP. If the backup HAProxy server detects failure in the primary it then begins to accept traffic. The HAProxy configuration file (`/etc/haproxy/haproxy.conf`) from the primary instance must be replicated verbatim on the backup server. Any subsequent changes made to the HAProxy configuration file on primary must be replicated on the backup instance.

## Configure IP Sharing

This guide uses Akamai’s IP Host Address Sharing. While the TCP/IP protocol requires unique IP/MAC address pairs, it does support IP sharing within the same data center. IP Sharing allows two distinct IP/MAC pairs on different instances to share the same IP address, with one being active and the other passive.

The primary and backup HAProxy servers communicate over their private network using the BGP protocol chosen in the FRRouting configuration file. The backup server uses a "ping-like" test on the primary server to detect failure. If the primary server fails, the backup automatically takes over the duties of the primary, allowing HAProxy's reverse proxy service to continue operating.

In order to use IP Sharing, both instances must be within the same datacenter, and IP Sharing is available in most Linode data centers. Follow the instructions in [Getting Stated with HAProxy TCP Load Balancing and Health Checks](/docs/guides/getting-started-with-haproxy-tcp-load-balancing-and-health-checks) to build an identical instance in the same data center as the original HAProxy server. Once deployed, [configure IP sharing](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#configuring-ip-sharing) for both the original HAProxy server and the newly created instance.

This additional instance demonstrates both IP Sharing and failover functionality.

## Configure Failover

To establish failover, use the FRRouting software daemon (`frr`) with the BGP protocol to connect the primary and backup HAProxy instances.

### Install FRRouting

1.  Follow the instructions for your distribution to install FRRouting on both the primary and backup HAProxy servers:

    {{< tabs >}}
    {{< tab "Ubuntu 24.04 LTS" >}}
    Use `apt` to install `frr`:

    ```command
    apt install frr frrtools frr-pythontools
    ```
    {{< /tab >}}
    {{< tab "CentOS Stream 9" >}}
    Use `dnf` to install `frr`:

    ```command
    sudo dnf install frr frr-pythontools
    ```
    {{< /tab >}}
    {{< tab "openSUSE Leap 15.6" >}}
    Use `zypper` to install `frr`:

    ```command
    sudo zypper frr
    ```
    {{< /tab >}}
    {{< /tabs >}}

1.  Use `systemctl` to start `frr`:

    ```command
    systemctl start frr
    ```

1.  Enable `frr` to automatically run on startup:

    ```command
    systemctl enable frr
    ```

### Configure FRRouting for Failover

FRRouting requires unique configurations for the primary and backup instances. Follow the **Configure FRR** section of our [Configure IP failover over BGP using FRR (advanced)](/docs/products/compute/compute-instances/guides/failover-bgp-frr/#configure-frr) guide to set up the `frr` daemon. The `frr` daemon checks the servers in its configuration list and begins to accept incoming traffic when the primary server fails. The configuration shown monitors the primary server for health using the BGP protocol.

After ensuring that the `frr` configuration files `/etc/frr/daemons` and `/etc/frr/frr.conf` files are updated correctly, restart the `frr` daemon:

```command
sudo systemctl restart frr
```

{{< note >}}
In this example failover configuration, the primary server does not automatically become active once restored.
{{< /note >}}

## Sync HAProxy Configuration Between Primary and Backup Servers

The backup HAProxy server must have an exact copy of the HAProxy configuration file from the primary server. To ensure this, copy the HAProxy configuration file from the primary server to the backup.

Issue the following `scp` command from the backup server, substituting {{< placeholder "USERNAME" >}} for either `root` or a user with `sudo` access and {{< placeholder "PRIMARY_SERVER_IP_ADDRESS" >}} with the actual IP address of the primary HAProxy server:

```command {title="Backup Instance"}
scp {{< placeholder "USERNAME" >}}@{{< placeholder "PRIMARY_SERVER_IP_ADDRESS" >}}:/etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg
```

When prompted, enter the primary server's `root` or `sudo` user password to complete the `scp` command.

Before proceeding, verify that the configuration files on both of the servers are identical.

{{< note >}}
After a failover event, copy this file back to the primary server from the backup server in order to restore it to active duty.
{{< /note >}}

## Configure the Secondary HAProxy Instance with Shared IP Address

Once the additional HAProxy server instance is set up, [add an additional network interface](/docs/products/compute/compute-instances/guides/failover/#add-the-shared-ip-to-the-networking-configuration) to both servers. This allows both HAProxy servers to operate under the same IP address, though only one instance is active at a time.

Restart both host’s network services to apply the shared IP address setting:

```command {title="Primary Instance & Backup Instance"}
systemctl restart networkd
```

After restarting, the FRRouting daemon on the backup server begins checking for an active BGP routing path from the primary. If the primary fails to respond, the backup takes over, routing traffic according to the HAproxy configuration rules copied from the primary server.

During the backup server's initial activation, some latency may occur as frontend client requests are directed to backend instances. This latency may be noticeable in high-traffic environments, potentially requiring users to refresh sessions or retry connections. Some users may also encounter temporary TCP or HTTP error messages.

{{< note >}}
Client-side applications (such as web browsers or mobile apps) should include code that detects connection errors during failover. When latency or errors occur, the client app can automatically retry the connection until traffic normalizes on the backup server.
{{< /note >}}

## Test Failover

Use the TCP health check setup described in [Getting Stated with HAProxy TCP Load Balancing and Health Checks](/docs/guides/getting-started-with-haproxy-tcp-load-balancing-and-health-checks) to confirm proper routing to the three backend servers (`backend1`, `backend2`, and `backend3`) through the shared IP address.

Follow the steps below to test failover:

1.  **Verify Initial Access**: Ensure that the primary HAProxy server is serving pages correctly. Navigate to the shared IP address in a web browser and refresh until you can access all three backend servers.

1.  **Simulate Primary Failure**: In the Akamai Cloud Manager, power down the primary HAProxy server instance to trigger a failover.

1.  **Confirm Failover**: After shutting down the primary server, refresh the browser. Within a few seconds, the pages should re-appear, now routed through the backup server. This indicates that failover is functioning correctly.

### Troubleshooting Test Failures

If the failover test fails and refreshing the browser does not restore page access from the backup server after several seconds, follow these troubleshooting steps:

-   **Verify IP Sharing Configuration**: Ensure that all steps for setting up IP Sharing were followed correctly.
-   **Check Network Connectivity**: Use the ICMP Ping command to verify that the backup server is reachable. If it isn't, there may be an issue with IP Sharing.
-   **Review FRRouting Configuration**: Check the Roles section of`frr.config` to confirm that it is configured according to the provided directions.
-   **Confirm HAProxy Configuration**: Ensure that the backup server's `/etc/haproxy/haproxy.cfg` file was correctly copied from the primary server.
-   **Test Backend Server Accessibility**: Use a web browser to directly access a backend server (e.g. `backend1`) by its IP address. If the server responds, the failover server configuration may no be set up correctly.

Latency during the failover from primary to backup should not exceed a few seconds. The FRRouting daemon's configuration offers several settings to optimize detection and failover speed.

## Conclusion

This series of HAProxy guides show the basic TCP and HTTP backend network load balancing and failover mechanisms available. These examples only skim the surface of a sophisticated number of options that you can deploy. They work for the FOSS version, and more extensive and expansive options are available in the HAProxy non-FOSS Enterprise Edition.

HAProxy is extremely popular for backend load balancing and reverse proxy services, including its ability to serve as an SSL/TLS processor. Akamai IP Sharing services glue high-traffic instances together, using FOSS tools such as FRRouting and HAProxy for higher reliability.