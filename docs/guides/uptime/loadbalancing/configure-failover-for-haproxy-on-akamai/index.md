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

HAProxy is an HTTP or TCP gateway server instance application that plays a key role as a reverse proxy between a public-facing IP address and servers behind them. The frontend input and backend traffic configuration rules manage traffic, repair HTTP requests, and serve as a network load balancer.

Services provided by HAProxy become a single point of failure, fully interrupting client connections with backend services. Rapid failover of HAProxy to a HAProxy backup instance re-establishes communications with clients.

As an application, the FOSS version of HAProxy does not maintain failover instances where the failover server preserves the state of the failed HAProxy instance. However, this means that HAProxy newly active backup hosts relearn frontend-backend routing freshly upon assuming the role. The enterprise edition of HAProxy has allowance for state-save and restore, and other mechanisms that restore a failover with configuration data.

## Initial Setup: Deploy HAProxy and Backend Instances

This guide expands on the platform built in the Getting Started With HAProxy Load Balancing Guide so you should begin by building your platform as instructed in [Getting Stated with HAProxy TCP Load Balancing and Health Checks](/docs/guides/getting-started-with-haproxy-tcp-load-balancing-and-health-checks). In this guide, you use the FOSS version of HAProxy to create and demonstrate basic HAProxy host failover pairs.

## Deploy A Second HAProxy Instance

Test a primary/failover pair by generating a second instance. The second HAProxy Instance is based on the same OS compute instance in the same datacenter as the HAProxy server instance generated in Part One. This instance is synchronized with the configuration used in the primary/initial server.

To mate the servers together, the pair receives a uniting IP address. Choose a Shared IP address in the data center where the HAProxy compute instances are located. Use a Shared IP address between both the primary and backup instance to create a private network. Your final step creating the private network uses a new network interface device in the primary and backup hosts.

Install the software link for the private network, FRRouting. The FRRouting application connects the newly created network interfaces, and is configured for private connection between the initial primary server and the backup server built in this guide. The `frr` application configuration specifies the Border Gateway Protocol (BGP) protocol, establishing the roles of primary and backup server.

The primary and backup server are two separate compute instances in this configuration. The networking interfaces are joined together to one IP address via IP Sharing. The protocol used to join them is BGP. The [FRRouting configuration establishes ROLES of primary and backup](https://www.linode.com/docs/products/compute/compute-instances/guides/failover-bgp-frr/#configure-frr) in the HAProxy server instances.

Using the BGP protocol and configuration information, the backup server recognizes failure in the primary, and allows the backup HAProxy server to accept traffic. The backup must pick up the same logic that the primary server does through its configuration. This requires that you synchronize the HAProxy configuration file from the primary to the backup server. Any changes made to the primary are subsequently pushed to the backup instance, replacing the backup instance `/etc/haproxy/haproxy.conf` file, as well as after each change in the HAProxy configuration.

## Configure IP Sharing

This guide uses Akamai’s IP Host Address Sharing. The TCP/IP protocol is built on unique IP/MAC address pairs, and IP Sharing is a method to permit two physical IP/MAC pairs in different host instances to share the same IP address where one host is active, and the other host is passive. IP Sharing is available in most Linode data centers. You need specific information for the datacenter you're using prior to undertaking failover testing, because both hosts must be instances within the same datacenter when using IP Sharing.

Instructions for building either an Ubuntu 22.04 LTS server, a CentOS Stream 9, or openSUSE Leap server are shown in Part One. This demonstration uses a second server, that you build identically as you did the original HAProxy server compute instance, which you need to build within the same datacenter location. This instance shows the IP Sharing and failover settings. Create and deploy this instance, then configure [IP Sharing for the original primary host, and the newly created backup HAProxy host](https://www.linode.com/docs/products/compute/compute-instances/guides/manage-ip-addresses/#configuring-ip-sharing).

The primary and backup HAProxy servers interact on their private network using the BGP protocol chosen in the FRRouting configuration file. The backup takes over from the primary using a "ping-like" test of the primary server, after recognizing failure which is when failover begins using the HAProxy reverse proxy service.

## Configure Failover

Use the FRRouting software daemon, and the BGP protocol to connect the HAProxy primary and backup hosts to each other.

### Install and Configure FRRouting

FRRouting is installed on the primary and backup server. Install IP Sharing onto both HAProxy server compute instances. Install the FRRouting application into each host, using the LISSH terminal.

### Ubuntu 22.04 LTS FRRouting Installation

Login to each HAProxy host, primary and backup, using the LISH console. Update the base software, then install `frr`:

```command
apt update && apt upgrade -y
apt install frr frrtools frr-pythontools
```

Start the `frr` app after configuration:

```command
systemctl start frr
```

Make `frr` survive restart:

```command
systemctl enable frr
```

### Install FRRouting on CentOS Stream 9

Login to each HAProxy host, primary and backup, using the LISH console. Install the `frr` software using `dnf`:

```cmmand
sudo dnf install frr frr-pythontools
```

Start the `frr` app after configuration:

```command
systemctl start frr
```

Then make `frr` survive restart:

```command
systemctl enable frr
```

### Installing FRRouting on openSUSE Leap

For openSUSE Leap as an HAProxy instance, login using the LISH console for each instance, primary and backup. Install the `frr` software using `zypper`:

```command
sudo zypper frr
```

Then make `frr` survive restart:

```command
code systemctl enable frr
```

The FRRouting requires a [unique configuration in the primary and failover/backup server instance](https://www.linode.com/docs/products/compute/compute-instances/guides/failover-bgp-frr/#configure-frr). The `frr` daemon checks the servers in its configuration list and begins to accept incoming traffic when the primary server fails. Using the BGP protocol, the configuration shown monitors the primary server for health. It does not failback to the primary server, once the primary server is restored to duty, in this test configuration. Pay special attention to the daemons file detail in `/etc/frr/daemons` and the `frr` configuration in the `/etc/frr/frr.conf` files.

Restart the `frr` daemon after creating and editing these files:

```command
sudo systemctl restart frr
```

## Ensure HAProxy Configuration Between Primary and Backup Servers

The backup HAProxy server requires a correct HAProxy configuration file of the primary server. To accomplish this, log in to the server designated as backup and copy the HAProxy configuration file from the primary server to the backup. After a primary failure, copy this file back to the primary server that is promoted to primary after the failure. From the backup server, log in to it via the LISH console then copy the configuration file:

```command
scp {{< placeholder "USERNAME" >}}@{{< placeholder "PRIMARY_SERVER_IP_ADDRESS" >}}:/etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg
```

Give the `root` password of the primary server, or substitute a `sudo` user and password for the `scp` copy. Verify that the configuration file is correct.

## Configure The Secondary HAProxy Instance with Shared IP Address

After you build the additional HAProxy server instance, [add an additional network interface](https://www.linode.com/docs/products/compute/compute-instances/guides/failover/#add-the-shared-ip-to-the-networking-configuration). This joins the two servers under one IP address, but only one HAProxy instance is active at once.

Restart both host’s network services to recognize the shared IP address setting.

```command
systemctl restart networkd
```

After the restart, the FRRouting daemon in the backup server starts to interrogate the primary host for a correct BGP routing path. Once the path fails to respond to the backup server, the backup server must accept traffic, and route the traffic as a gateway according to the copy of the HAproxy configuration rules from the primary server.

During the initial startup of the backup server, latency occurs as pairs from frontend access from clients arrive at backend server compute instances. In a high-traffic network, the latency is noticeable. You may need to refresh user sessions, and some may encounter TCP or HTTP error messages.

Programmatically, client-side code should provide instructions in a browser or other client app access to trap the latency message and perform retries until the failover cycle normalizes traffic.

## Test Failover

Use the test setup for TCP health described in Part One. This consists of browser access to the three backend servers, `backend1`, `backend2`, and `backend3`, through the IP address set for the IP address represented by the IP Sharing address.

To test failover, test initial access to the three servers with your browser to verify the HAProxy primary server is serving pages according to the correct configuration.

Using the management console, power down the primary HAProxy server instance.

As the primary server instance becomes unavailable, continue testing by refreshing the browser pages associated with your prior test access. Within a few seconds, the pages should re-appear, now proxied through the backup server. The test is complete.

### Troubleshooting Test Failures

If the failover test fails and browser refreshes do not restore page access from the backup server after several seconds, troubleshoot the failover logic:

-   Verify the IP Sharing steps were followed.
-   Verify the backup server can be reached using the ICMP Ping command; if not, IP Sharing isn’t working.
-   Check that the Roles section of the FRRouting `frr.config` was configured according to directions.
-   Check that the backup server `/etc/haproxy/haproxy.cfg` file was correctly copied from the primary server.
-   Using a browser access, point the browser at the direct IP address of the backend server `backup1`; if the server responds, the failover server configuration is incorrectly installed.

Latency in the failover from primary to backup should never take more than a few seconds. The FRRouting daemon and configuration can use numerous settings to optimize detection and failover speed.

## Conclusion

This series of HAProxy guides show the basic TCP and HTTP backend network load balancing and failover mechanisms available. These examples only skim the surface of a sophisticated number of options that you can deploy. They work for the FOSS version, and more extensive and expansive options are available in the HAProxy non-FOSS Enterprise Edition.

HAProxy is extremely popular for backend load balancing and reverse proxy services, including its ability to serve as an SSL/TLS processor. Akamai IP Sharing services glue high-traffic instances together, using FOSS tools such as FRRouting and HAProxy for higher reliability.