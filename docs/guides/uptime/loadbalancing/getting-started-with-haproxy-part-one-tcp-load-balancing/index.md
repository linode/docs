---
slug: getting-started-with-haproxy-part-one-tcp-load-balancing
title: "Getting Started with HAProxy Part One: TCP Load Balancing"
description: "Learn how to install and configure HAProxy for load balancing and health checks on Ubuntu, CentOS, and openSUSE in this guide."
authors: ["Tom Henderson"]
contributors: ["Tom Henderson"]
published: 2024-08-21
keywords: ['haproxy','haproxy tcp load balancing','configure haproxy load balancer','haproxy setup tutorial','haproxy active and passive health checks','install haproxy on ubuntu','install haproxy on centos','install haproxy on opensuse','ha proxy frontend configuration','haproxy backend configuration','haproxy network load balancing','haproxy health check configuration','load balancing with haproxy example','wordpress load balancing with haproxy']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

[HAProxy](https://www.haproxy.org/) serves as a reverse proxy between front-end client requests and back-end server resources. It functions as a shared uniform resource indicator (URI) similar to a URL, directing client traffic to back-end compute resources.

HAProxy can also perform optional services, which are masked and transparent to clients. These include session management, Transport Layer Security (TLS) encryption and decryption, and masking back-end resources against malformed client traffic (whether malicious and benign).

The HAProxy network (TCP) load balancer uses stateful routing to manage connections between front-end and back-end resources. It keeps track of clients and determines their destination using one of several configuration choices. HAProxy can be configured at Layer 4 (network) or Layer 7 (application) to establish these connections.

HAProxy can reduce compute workloads by performing many gateway and server tasks within the Linux kernel, which optimizes capacity. Administrators have additional options to further minimize congestion. These include different methods of linking clients to servers, TLS encryption/decryption for the back-end servers, and monitoring back-end server traffic load and/or health.

HAProxy also maintains detailed logs for trend analysis, troubleshooting, and forensics.

The most common use of HAProxy is as an intelligent network load balancer. In this role, HAProxy uses simple round-robin, client-to-server routing, or more complex routing based on back-end server health.

This guide demonstrates how to install HAProxy onto three common Linux distributions: Ubuntu, CentOS Stream, and openSUSE Leap. It also provides instructions for deploying WordPress on Linode Marketplace Nanode instances and developing a proof-of-concept based on HAProxy network load balancing features.

## Before You Begin

1.  If you do not already have a virtual machine to use, create a Compute Instance. HAProxy can be deployed on a simple [Nanode](https://www.linode.com/blog/linode/akamai_cloud_computing_price_update/). Under **Linux Distribution**, choose either `Ubuntu 24.04 LTS`, `CentOS Stream 9`, or `openSUSE Leap 15.6`, and assign the instance to a VLAN. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  This guide uses simple WordPress backend instances to demonstrate how HAProxy controls network traffic flows at both the TCP/Network (Layer 4) and HTTP/Application (Layer 7) levels. Follow the steps in our [Deploy WordPress through the Linode Marketplace](/docs/marketplace-docs/guides/wordpress/) guide to create three back-end WordPress test instances. Under **WordPress Setup**, fill out all of the required fields and use the default values, along with the following options:

    -   **The stack you are looking to deploy Wordpress on**: Choose either **LAMP** or **LEMP**.
    -   **Website title**: Enter `backend1`, `backend2`, and `backend3`, respectively.
    -   **Region**: Select the same location the HAProxy instance is in.
    -   **Linode Plan**: A **Shared CPU**, **Nanode 1 GB** is sufficient to test and demonstrate HAProxy options.
    -   **Linode Label**: Once again, enter `backend1`, `backend2`, and `backend3`, respectively.
    -   **VLAN**: Attach the instances to the same VLAN as the HAProxy instance.

    Each of these servers are generated with an `index.html` home page that indicates the name of the server (`backend1`, `backend2`, `backend3`). Open a web browser and check each server by its IP address to verify that the example test servers are functioning. Take note of the IP addresses of the three instances, as you need them later.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Install HAProxy

To install HAProxy, log in to your HAProxy instance as `root` and follow the instructions below for your distribution:

{{< tabs >}}
{{< tab "Ubuntu 24.04 LTS" >}}
Use `apt` to install HAProxy on an Ubuntu 24.04 LTS instance:

```command
apt install haproxy
```
{{< /tab >}}
{{< tab "CentOS Stream 9" >}}
Use `dnf` to install HAProxy on a CentOS Steam 9 instance:

```command
dnf install haproxy
```
{{< /tab >}}
{{< tab "openSUSE Leap 15.6" >}}
Use `zypper`to install HAProxy on a openSUSE Leap 15.6 instance:

```command
zypper in haproxy
```
{{< /tab >}}
{{< /tabs >}}

Verify the HAProxy installation by checking the installed version number:

```command
haproxy -v
```

The application and libraries are now installed. However, HAProxy must be set to restart upon reboot and the HAProxy configuration file needs editing.

### Starting and Stopping HAProxy

The `systemctl` command is used to start HAProxy:

```command
systemctl start haproxy
```

You can also use `systemctl` to start HAProxy after a reboot:

```command
systemctl enable haproxy
```

When you make a change to the configuration file, use the following command to restart HAProxy:

```command
systemctl restart haproxy
```

{{< note >}}
If you encounter an error when restarting HAProxy, run the following command to check for syntax errors in your `haproxy.cfg` file:

```command
haproxy -c -f /etc/haproxy/haproxy.cfg
```
{{< /note >}}

### HAProxy Configuration File

HAProxy is controlled through its configuration file and CLI. The HAProxy configuration file contains the settings needed to perform network balancing and flow control. A default file is written during HAProxy installation. All of the HAProxy instances described above use a similar configuration file found at `/etc/haproxy/haproxy.cfg`. Edit this file with `nano`, `vi`, or another text editor to set options:

```command
nano /etc/haproxy/haproxy.cfg
```

## Configure HAProxy as a TCP Load Balancer

HAProxy routes incoming front-end traffic to designated back-end instances. By default, no load balancing is applied. However, you can configure HAProxy to use various load balancing methods, including:

-   **Round Robin**: Distributes incoming connections evenly across all available back-end servers by sequentially assigning each new connection to the next server in the pool.
-   **Least Conn**: Directs incoming connections to the back-end server with the fewest active connections, helping to balance the load more evenly based on current server utilization.
-   **Health Checks**: Continuously monitors the health of back-end servers. Servers that fail health checks are automatically removed from the pool until they recover, ensuring that only healthy servers receive traffic.

### Set Up Backends in HAProxy (TCP)

Backend servers are listed in the `haproxy.cfg` file. Append the following code to the `/etc/haproxy/haproxy.cfg` file:

```file {title="/etc/haproxy/haproxy.cfg"}
backend web-test
  mode tcp
  balance roundrobin
  server server1 {{< placeholder "backend1_VLAN_IP_ADDRESS" >}}:80
  server server2 {{< placeholder "backend2_VLAN_IP_ADDRESS" >}}:80
  server server3 {{< placeholder "backend3_VLAN_IP_ADDRESS" >}}:80
```

These additions configure your HAProxy gateway to listen for port `80` (HTTP traffic) and establish the name `web-test` for the frontend. The back-end servers are defined in the server statements, using the VLAN addresses specified during the initial HAProxy setup.

In the example, the Round Robin method connects each client reaching the HAProxy server's IP address to the next server in the list.

### Set Up Frontends in HAProxy (TCP)

The HAProxy instance listens to its IP addresses for traffic. The back-end name defined in the previous section must match the front-end client listening ports:

```file {title="/etc/haproxy/haproxy.cfg"}
frontend web-test
  bind *:80
  mode tcp
  default_backend web-test
```

The `bind` command specifies the interface and port that HAProxy should listen to for incoming connections. In this example, `*:80` means HAProxy listens on all available IP addresses (`*`) on port `80`, which is the standard port for web traffic. The next line sets the mode to TCP, so that HAPRoxy handles traffic at the transport layer. Finally, the `default_backend` directive directs this traffic to the backend named `web-test`, as defined earlier.

## Configure Health Checks

HAProxy’s network load balancing function can also select servers based on their health status. These health checks can be either active or passive. An active health check probes each back-end server individually for specific health attributes. In contrast, a passive check relies on basic connection error information by protocol (Layer 4/TCP or Layer7/HTTP).

### Active Health Checks

To enable a server health check, include the `check` keyword in the server entry of your HAProxy configuration file:

```file {title="/etc/haproxy/haproxy.cfg"}
server server1 {{< placeholder "backend1_VLAN_IP_ADDRESS" >}}:80 check
```

When the `check` keyword is included, HAProxy sends a SYN/ACK to determine if the server is active. Even though some servers correctly respond to this type of query, their services might still be down or unavailable.

Active health checks provide more sophisticated monitoring by sending application-specific queries to the back-end servers and expecting a valid response.

HAProxy checks server health at intervals you specify, for example:

```file {title="/etc/haproxy/haproxy.cfg"}
backend web-test
server server1 {{< placeholder "backend1_VLAN_IP_ADDRESS" >}}:80 check inter 4
```

In this example, HAProxy checks the first server in the pool every four seconds. If the server does not respond, it is marked as down. This process is similar to a ping-type health check that verifies server availability.

### Passive Health Checks

HAProxy uses the TCP protocol to perform passive health checks on back-end servers. With passive health checks, HAProxy monitors Layer 4 (TCP) traffic for errors and marks a server as down when a specified error limit is reached.

For example, using this guide’s configuration:

```file {title="/etc/haproxy/haproxy.cfg"}
backend web-test
server backend1 {{< placeholder "backend1_VLAN_IP_ADDRESS" >}}:80 check observe layer4 error-limit 10 on-error mark-down
```

This configuration specifies a passive health check that observes TCP errors (`observe layer4`). If the number of errors reaches the specified limit of 10 (`error-limit 10`), the server is marked as down (`on-error mark-down`). To optimize performance and reliability, you can adjust the intervals and error limits for different servers based on their capacity, role, or complexity. For more information, refer to the [HAProxy documentation on active health checks](https://www.haproxy.com/documentation/hapee/1-8r1/load-balancing/health-checking/active-health-checks/).

## Test Load Balancing Functionality and Verify Health Checks

Use the following example code in your `/etc/haproxy/haproxy.cfg` file to test load balancing:

```file {title="/etc/haproxy/haproxy.cfg"}
frontend web-test
  bind *:80
  mode tcp
  default_backend web-test
backend web-test
  mode tcp
  balance roundrobin
  server server1 {{< placeholder "backend1_VLAN_IP_ADDRESS" >}}:80
  server server2 {{< placeholder "backend2_VLAN_IP_ADDRESS" >}}:80
  server server3 {{< placeholder "backend3_VLAN_IP_ADDRESS" >}}:80
```

To test the setup, open a web browser and enter the HAPRoxy gateway IP address (from your initial HAPRoxy server instance). The WordPress web page for `backend1` should appear. Open a second browser window and enter the same HAProxy server IP address; this time, the default page for `backend2` should be displayed. Repeat this process in a third browser window, and the `backend3` server's web page should appear.

Once these pages are loaded, HAPRoxy considers them part of a balanced backend. You can test the load balancing functionality in several ways:

-   Remove one of the servers by powering it down. Then, reload or open a new browser request. The HAProxy configuration should no longer route traffic to the powered-down server effectively removing it from the pool.

-   You can also SSH into any of the servers and shut down its Apache service using the following command:

    ```command
    systemctl apache2 stop
    ```

-   Alternatively, disable the network connection of a back-end server to simulate a network failure.

These should trigger a health check failure, causing HAProxy to exclude the unresponsive server from the back-end pool.

HAProxy can perform more advanced health checks, such as using an active health check to request a specific response from a controlled server. If the response does not match the expected regex pattern, HAProxy marks the server as down and removes it from the availability pool.