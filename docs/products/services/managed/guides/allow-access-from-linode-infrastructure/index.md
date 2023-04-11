---
title: Configure Firewall Rules to Allow Access from Linode Infrastructure (for Managed Services Customers)
title_meta: Configure Firewall Rules to Allow Access from Linode Infrastructure
linkTitle: Configure Firewall Rules
description: "Learn how to configure your firewall rules so that the Managed Service's team of experts are able to access your Compute Instances and troubleshoot issues."
published: 2023-04-11
authors: ["Linode"]
---

As a Managed Services customer, you may need to add or modify your firewall rules to allow access from our infrastructure. When done alongside [configuring SSH access for Managed Services](/docs/products/services/managed/guides/ssh-access/), this enables the Support team to log in to your system and troubleshoot issues. It also enables our infrastructure to perform the checks configured on your monitors. The exact procedure varies based on the firewall software in use. See the following guides for help configuring firewalls:

- Linode Cloud Firewall: [Manage Cloud Firewall Rules](/docs/products/networking/cloud-firewall/guides/manage-firewall-rules/)
- UFW: [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/)
- FirewallD: [Introduction to FirewallD on CentOS](/docs/guides/introduction-to-firewalld-on-centos/)
- iptables: [Controlling Network Traffic with iptables - A Tutorial](/docs/guides/control-network-traffic-with-iptables/)

### Incident Response Infrastructure

Allow the following hostnames and IP addresses so that our incident response team can access your server.

```command
blackbox1-dallas.linode.com 50.116.31.27
blackbox1-newark.linode.com 66.175.214.213
```

### Monitor Infrastructure

Allow the following hostnames and IP addresses so that our infrastructure can perform the checks configured on your monitors.

-   **Atlanta:**

    ```command
    monitor1-atlanta.linode.com 2600:3c02::f03c:91ff:feae:8540 66.228.57.137
    monitor2-atlanta.linode.com 2600:3c02::f03c:91ff:feae:69d5 50.116.38.168
    ```

-   **Dallas:**

    ```command
    monitor1-dallas.linode.com 2600:3c00::f03c:91ff:feae:8351 50.116.25.212
    monitor2-dallas.linode.com 2600:3c00::f03c:91ff:feae:47d9 198.58.98.236
    ```

-   **Frankfurt:**

    ```command
    monitor1-frankfurt.linode.com 2a01:7e01::f03c:91ff:fe26:e120 139.162.128.25
    monitor2-frankfurt.linode.com 2a01:7e01::f03c:91ff:fe26:8a6a 139.162.128.26
    ```

-   **Fremont:**

    ```command
    monitor1-fremont.linode.com 2600:3c01::f03c:91ff:feae:85e2 50.116.11.198
    monitor2-fremont.linode.com 2600:3c01::f03c:91ff:feae:47d3 66.175.221.50
    ```

-   **London:**

    ```command
    monitor1-london.linode.com 2a01:7e00::f03c:91ff:feae:6965 176.58.113.114
    monitor2-london.linode.com 2a01:7e00::f03c:91ff:feae:6924 178.79.189.96
    ```

-   **Mumbai:**

    ```command
    monitor1-mum1.linode.com 2400:8904::f03c:91ff:fe5d:25b5 172.105.41.4
    monitor2-mum1.linode.com 2400:8904::f03c:91ff:fe5d:2595 172.105.42.4
    ```

-   **Newark:**

    ```command
    monitor1-newark.linode.com 2600:3c03::f03c:91ff:feae:832c 198.74.56.5
    monitor2-newark.linode.com 2600:3c03::f03c:91ff:feae:4766 198.74.59.104
    ```

-   **Singapore:**

    ```command
    monitor1-singapore.linode.com 2400:8901::f03c:91ff:fe33:54f2 103.3.60.25
    monitor2-singapore.linode.com 2400:8901::f03c:91ff:fe33:5401 103.3.60.26
    ```

-   **Sydney:**

    ```command
    monitor1-syd1.linode.com 2400:8907::f03c:92ff:fe67:b794 172.105.176.9
    monitor2-syd1.linode.com 2400:8907::f03c:92ff:fe67:b74f 172.105.162.10
    ```

-   **Tokyo:**

    ```command
    monitor1-shg1.linode.com 2400:8902::f03c:91ff:fe2c:ff57 139.162.65.25
    monitor2-shg1.linode.com 2400:8902::f03c:91ff:fe2c:6eda 139.162.65.26
    ```

-   **Toronto:**

    ```command
    monitor1-tor1.linode.com 2600:3c04::f03c:91ff:fe82:1151 172.105.0.13
    monitor2-tor1.linode.com 2600:3c04::f03c:91ff:fe82:de74 172.105.14.4
    ```