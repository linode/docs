---
slug: forward-proxy-for-vpc
title: "Configure a Forward Proxy to Enable Internet Access within a VPC"
description: "This guide explains how to use a forward proxy to securely enable public internet access on Compute Instances located entirely behind a VPC."
keywords: ['forward proxy vpc','configure forward proxy firewall','access internet from vpc','how to use forward proxy']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
contributors: ["Jeff Novotny", "Matt Wildman"]
published: 2024-02-14
---

Placing sensitive computing resources inside of a [*Virtual Private Cloud* (VPC)](https://en.wikipedia.org/wiki/Virtual_private_cloud) helps limit exposure and protect those systems. However, this also means it is impossible for these servers to directly access the internet without additional infrastructure. This limitation can be resolved through the use of a forward proxy, which acts as a gateway between the VPC and the public internet. This guide explains how to use a forward proxy to enable public internet access for devices within a VPC. It also demonstrates how to secure the VPC using an Akamai Cloud Firewall and how to provide applications with proxy access.

## Methods of Enabling Internet Access for VPC Resources

A server within a VPC cannot access other networks, or the internet, without additional configuration. To use the public internet, a server must either enable *Network Address Translation* (NAT) or send traffic to a forward proxy.

### NAT

A *One-to-one NAT* (1:1 NAT), also known as a *Basic NAT*, grants full internet access to the device. It connects two IP networks with different addressing schemes at the network layer. A 1:1 NAT maps an internal address and port to an external address and port. This technique allows the device to present a public IP address to the wider network while using a VPC-based address inside the private network.

NAT modifies the source and destination addresses in the IP header to correspond to the next address space. When sending a packet from the VPC to a different network, it swaps out the internal address for the public address. It reverses this process when traffic moves in the opposite direction. There are many variations of NAT, but the 1:1 type is the simplest and most common. It recalculates the IP address and any associated checksums, while leaving the rest of the packet intact. For more detailed information about 1:1 NAT, see the [NAT page on Wikipedia](https://en.wikipedia.org/wiki/Network_address_translation).

### Forward Proxy

A proxy is a general term for any intermediate device or application lying between a client and the target server. A forward proxy is a boundary point between the internet and a private network. It is used to retrieve resources for clients from the wider network. In addition to validating client requests, it processes packets and routes them towards their destinations. A forward proxy often changes the source or destination address, but it can also modify other fields. It keeps track of the active requests, responses, destinations, and sources, allowing it to match responses to the original client.

A proxy greatly enhances security by hiding some or all of the original addressing information. To the destination server, the request appears to come from the forward proxy. All details about the originating VPC remain hidden. Proxies can also be configured with traffic management policies. These policies can drop or filter unwanted packets, and limit the rate of incoming and outgoing packets. Some forward proxies also inspect packets to implement data protection and threat prevention. A forward proxy is typically used with a cloud or server-based firewall for extra security.

In contrast to NAT, a forward proxy works at the application layer. The proxy information is configured as part of the web server configuration, similar to a website. While NAT is self-contained, a forward proxy is part of a networking solution. A device on the VPC first transmits an outbound packet to a forward proxy. The proxy analyzes the packet and redirects it towards its ultimate destination. A common architecture is to use a 1:1 NAT and a forward proxy together. The forward proxy uses NAT to bridge multiple address spaces.

## Configuration Steps

Here are the basic steps needed to configure a forward proxy on a Compute Instance and then utilize that forward proxy on other instances within a VPC.

1. **[Deploy *at least two* Compute Instances](#deploy-compute-instances)** to the same data center. Connect all systems to the same VPC. Designate one system that will act as the forward proxy and connect it to the public internet or a different private network.

1.  **[Configure a Firewall](#configure-a-firewall-for-the-forward-proxy-instance)** that will protect the forward proxy instance. This guide uses our free Cloud Firewall service.

1.  **[Install and Configure Apache](#install-apache-and-configure-it-as-a-forward-proxy)** on the Compute Instance you've designated to act as the forward proxy.

1.  **[Test Connectivity through the Forward Proxy](#test-connectivity-through-the-forward-proxy)** on one of the other Compute Instances within the same VPC.

Continue reading for detailed instructions on each of these steps.

## Deploy Compute Instances

To get started, use the Akamai Cloud Compute platform to deploy multiple Compute Instances within a VPC.

1.  Deploy two or more Compute Instances to the same region and the same VPC. This guide uses Ubuntu 22.04 as the distribution image, but the instructions are generally applicable to other Linux distributions (with some modifications). See [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) for additional instructions on how to deploy Linode Compute Instances.

    - **Forward Proxy Instance**: On the Compute Instance designated as the *forward proxy*, configure this instance with a 1:1 NAT by selecting the **Assign a public IPv4 address for this Linode** option. This enables your instance to connect to the internet. Additional NAT-specific configuration is not required. In later steps, we'll need to know the IP address configured for the VPC interface. You can find this information later or manually set the VPC IPv4 address when creating the instance. To do this, uncheck the *Auto-assign a VPC IPv4 address* option and manually enter a valid IPv4 address from the defined subnet range. For example, if the subnet range is `10.0.2.0/24`, you can use `10.0.2.2` as IPv4 address. The last segment of the IPv4 address cannot be `1` or `255` as they are reserved.

    - **Other Instance(s)**: On each Compute Instance *other than the forward proxy*, do not check the **Assign a public IPv4 address for this Linode** option. When this remains deselected, the instances are created without public internet access.

    When creating these instances, *do not* enable the **Private IP** option under **Add-ons**. This is for an unrelated feature.

1.  For the VPC interface to be automatically configured within the internal system of each Compute Instance, [Network Helper](/docs/products/compute/compute-instances/guides/network-helper/) needs to enabled. This is the default setting for Compute Instances on new accounts so, in most cases, you can proceed without issues. If Network Helper is disabled, enable it on each Compute Instance and reboot each instance.

1.  Log in to each instance using [Lish](/docs/products/compute/compute-instances/guides/lish/) and test the connectivity to ensure the VPC has been configured properly.

    - Ping the private VPC IPv4 address of another instance. Each Compute Instance on the VPC should be able to ping the IP addresses of all other instances within that same VPC.

    - Ping an IP address or website of a system on the public internet. This ping should only be successful for the Compute Instance configured with 1:1 NAT (the forward proxy instance).

## Configure a Firewall for the Forward Proxy Instance

After configuring the VPC and forward proxy instance, add a cloud firewall to protect the network. It is important to configure a firewall to restrict inbound access to the proxy, while leaving outbound traffic unrestricted. An insecure and open proxy can expose the network inside the VPC to security threats and misuse.

1.  Create the Cloud Firewall in the same data center as your VPC. When doing so, assign the Cloud Firewall to the newly created forward proxy instance.

1.  Set the default **inbound policy** to *Drop*, leaving the default **outbound policy** as *Accept*.

1.  Add the following three *inbound* rules. No *outbound* rules should be configured.

    - **Allow proxy traffic** from other instances within the VPC:

        - **Label**: Set this to `VPC`.
        - **Protocol**: Use `TCP`.
        - **Ports**: Choose `Custom`, then set the **Custom Port Range** to `8080`.
        - **Sources**: Select `IP / Netmask`. List all subnets within the VPC under **IP / Netmask**.
        - **Action**: Set to `Accept`.
        - Click **Add Rule** to save the configuration.

    - **Allow ICMP (ping) traffic** within the VPC:

        - **Label**: Choose `VPC-ICMP`.
        - **Protocol**: Use `ICMP`.
        - **Ports**: Leave this field blank.
        - **Sources**: Select `IP/Netmask` and enter all VPC subnets using the **IP / Netmask** field.
        - **Action**: Set to `Accept`.
        - Click the **Add Rule** button.

    - **Allow SSH connections** from other instances in the VPC as well as any administrative systems:

        - **Label**: Set this to `ssh`.
        - **Protocol**: Use `TCP`.
        - **Ports**: Use `SSH (22)`.
        - **Sources**: select `IP/Netmask`, entering all VPC subnets in the **IP / Netmask** field. Also include the IP addresses of any administrative servers used to connect to the forward proxy. Ensure these addresses are as specific as possible, for example, `Admin_Addr/32`.
        - **Action**: Set to `Accept`.
        - Click the **Add Rule** button.

1.  Save the changes to apply the new firewall rules.

Test the new firewall restrictions. It should be possible to initiate an SSH connection to the forward proxy from one of the designated administrative addresses. However, all attempts from other addresses should be silently blocked.

## Install Apache and Configure It as a Forward Proxy

The next step is to configure a Compute Instance to act as the forward proxy. Ideally, this proxy server should have only one role, which is to act as a forward proxy. Other than the web server and proxy information, it should have minimal additional configuration. In most cases, other applications should not be installed. This reduces the possible attack surface of the proxy.

This guide uses Apache as the forward proxy, though other HTTP proxy software can also be used.

1.  Log in to the Compute Instance you've designated as the forward proxy using [Lish](/docs/products/compute/compute-instances/guides/lish/) or [SSH](/docs/guides/connect-to-server-over-ssh/).

1.  Install the Apache software package, making sure to download the latest package lists first.

    ```command
    sudo apt update -y && sudo apt install apache2 -y
    ```

1.  Enable the Apache modules that provide the forward proxy functionality.

    ```command
    sudo a2enmod proxy proxy_http proxy_connect
    ```

1.  Create and edit an Apache configuration file to store the forward proxy settings. This should be located wherever Apache configuration files are stored within your system (such as the `/etc/apache2/sites-available` directory).

    ```command
    sudo nano /etc/apache2/sites-available/fwd-proxy.conf
    ```

1.  Paste in the following example configuration, customizing these directives:

    - Replace {{< placeholder "10.0.2.2" >}} in the *Listen* directive with the internal VPC address of the forward proxy, using the format `IP_ADDRESS:8080` (such as `10.0.2.2:8080`). Do not use the public IP address.
    - Replace {{< placeholder "10.0.2.0/24" >}} in the *Require* directive (within the *Proxy* group) with the VPC subnet range. Use the format `NETWORK_ADDR/MASK`. For example, to permit proxy service for the `10.0.2.0/24` subnet, include the line `Require ip 10.0.2.0/24`. Multiple subnets can be added using a space as the delimiter.

    ```file {title="/etc/apache2/sites-available/fwd-proxy.conf" lang="aconf"}
    Listen {{< placeholder "10.0.2.2" >}}:8080
    <VirtualHost *:8080>
        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html
        ErrorLog ${APACHE_LOG_DIR}/fwd-proxy-error.log
        CustomLog ${APACHE_LOG_DIR}/fwd-proxy-access.log combined
        ProxyRequests On
        ProxyVia On
        <Proxy "*">
            Require ip {{< placeholder "10.0.2.0/24" >}}
        </Proxy>
    </VirtualHost>
    ```

1.  Set the owner of the file to `root:root` and set the correct file permissions:

    ```command
    sudo chown root:root /etc/apache2/sites-available/fwd-proxy.conf
    sudo chmod 0644 /etc/apache2/sites-available/fwd-proxy.conf
    ```

1.  Enable the Apache configuration file that was created in a previous step.

    ```command
    sudo a2ensite fwd-proxy
    ```

1.  Restart the Apache server to activate the new configuration:

    ```command
    sudo systemctl restart apache2
    ```

## Test Connectivity through the Forward Proxy

All servers in the VPC can now utilize the forward proxy to access the internet. This is configured per application and the instructions depend on that particular application.

### Package Management

A common use case is to enable internet access for package management (such as through the apt tool). This allows administrators to install updates on the instances inside the VPC. Follow the steps below to enable `apt` connectivity on the VPC nodes and use `curl`.

1.  Log in to one of the servers in the VPC. To access the node, use the LISH console. Alternatively, log in to the forward proxy from one of the designated administrative addresses, then establish a new SSH connection to the target instance.

1.  Add the following line to the `apt` proxy configuration, replacing {{< placeholder "10.0.2.2" >}} with the internal VPC IP address of the forward proxy:

    ```command
    echo 'Acquire::http::proxy "http://{{< placeholder "10.0.2.2" >}}:8080";' > /etc/apt/apt.conf.d/proxy.conf
    ```

1.  Attempt to update the local packages using `apt update`:

    ```command
    sudo apt update
    ```

    The command should now function correctly, using the proxy as a forwarding agent.

### cURL

To transmit `curl` requests, append the `--proxy` parameter to the request, again replacing {{< placeholder "10.0.2.2" >}} with the internal VPC IP address of the forward proxy:

```command
curl --proxy {{< placeholder "10.0.2.2" >}}:8080 http://example.com
```