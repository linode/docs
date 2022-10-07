---
author:
  name: Linode
  email: docs@linode.com
title: Get Started
enable_h1: true
tab_group_main:
    weight: 30
description: "This is a step-by-step guide on how to use a NodeBalancer to begin managing a simple web application that can support a large number of users."
keywords: ["nodebalancers", "nodebalancer", "load balancers", "load balancer", "load balancing", "high availability", "ha"]
tags: ["cloud manager","linode platform","networking","web applications"]
aliases: ['/nodebalancers/getting-started/','/platform/nodebalancer/getting-started-with-nodebalancers-new-manager/','/platform/nodebalancer/getting-started-with-nodebalancers/','/linode-platform/nodebalancer-howto/','/platform/nodebalancer/getting-started-with-nodebalancers-classic-manager/', '/guides/nodebalancer/getting-started-with-nodebalancers/','/guides/getting-started-with-nodebalancers/']
published: 2015-02-12
modified: 2022-10-07
---

## Deploy an Application

When thinking of implementing load balancing or high availability solutions, the main focus should be the needs of the application.

To start, determine which application you would like to load balance. If you do not yet have an application in mind but would like to test, consider deploying a LAMP or LEMP stack on the Linode Marketplace.

## Create a NodeBalancer

## Configure the Backends








## Old

Nearly all applications that are built using Linodes can benefit from load balancing, and load balancing itself is the key to expanding an application to larger numbers of users. Linode provides NodeBalancers, which can ease the deployment and administration of a load balancer.

This guide provides a high-level overview setting up a NodeBalancer, but it's outside this page's scope to explain each application a NodeBalancer could balance. For more information on various applications that might be useful behind NodeBalancer, see the rest of [Linode Guides & Tutorials on NodeBalancers](/docs/guides/platform/nodebalancer/).

## Before You Begin

- This tutorial assumes a basic understanding of load balancing and NodeBalancers. We recommend reviewing the following guides:

    - [What Are NodeBalancers](/docs/guides/what-are-nodebalancers/)
    - [Introduction to High Availability](/docs/guides/introduction-to-high-availability/)
    - Going further: [NodeBalancer Reference Guide](/docs/guides/nodebalancer-reference-guide/)

-  To properly configure a NodeBalancer, you must have at least two Linode Compute Instances within the same data center. Both of these servers must also have private IPv4 addresses. See [Managing IP Addresses](/docs/guides/managing-ip-addresses/#adding-an-ip-address).

## Configuring a NodeBalancer

1.  Visit the NodeBalancers page in the Linode [Cloud Manager](https://cloud.linode.com) and select **Add a NodeBalancer**.

1.  For the example web application, only one NodeBalancer is needed. Add one in the same data center that your backend Linodes are located in.

    ![The NodeBalancer Creation Screen](nodebalancers-create-choose-region.png "The NodeBalancer Creation Screen")

1.  A NodeBalancer is configured using [ports](/docs/platform/nodebalancer/nodebalancer-reference-guide/#port), and in this example web application, you'll use only one, port 80 for regular HTTP traffic.

    ![Adding a Port Configuration to a NodeBalancer](nodebalancers-settings.png "Adding a Port Configuration to a NodeBalancer")

    **HTTP**

    For the traditional web application, the settings in the screenshot above are a good start. HTTP cookie stickiness is preferred so that the same client will always land on the same backend -- for a simple web application that keeps sessions in memory, this is necessary to avoid session errors on clients.

    **HTTPS**

    If you select the HTTPS protocol, two new fields will appear where you can add your SSL certificate, chained certificates (if applicable) and a private key (which must not have passphrase protection).

    Every ten seconds, the NodeBalancer will request the root of the web application and look for a valid response code. With this example setup, there is only one backend node (which you will add shortly); if the backend goes down, the NodeBalancer will serve a plain 503 Service Unavailable error page. This is more desirable than refusing connections or making browsers wait for a timeout.

    {{< note >}}
The port you select for the NodeBalancer must match the port you are going to use on the backend Linode(s) in the next step. For example, if you are going to be receiving only regular HTTP traffic, it's common to use port `80`. The [NodeBalancer SSL Configuration](/docs/platform/nodebalancer/nodebalancer-ssl-configuration) guide will show you how to redirect port `443`, HTTPS traffic, to port `80` for SSL certificates.
{{</ note >}}

1.  Now you will add the single backend node to the NodeBalancer's configuration. Point this at the private IP address of your web server Linode.

    ![Adding a Backend Node to a NodeBalancer](nodebalancers-backend-nodes.png "Adding a Backend Node to a NodeBalancer")

    These configuration changes will take a few moments to be reflected by your NodeBalancer. If everything is configured on your backend correctly, once the changes have gone through, the **Node Status** column will update to **1 up / 0 down**.

    ![The Backend Node Has Been Added and is Now Status Up](nodebalancers-1up.png "The Backend Node Has Been Added and is Now Status Up")

    If the backend status reports **0 up / 1 down**, check to make sure that your web application is configured to respond on the Linode's private IP address. You do this by adding the private IP address to your `/etc/hosts` file on your Linode and then reboot your Linode. There might be a virtual host mismatch as well -- check the notes in the next section.

1.  Now that the backend is up, go directly to your NodeBalancer's IP address in a browser. You should see your web application as the NodeBalancer proxies the traffic through.

    ![Viewing the NodeBalancer-driven Web Site in a Browser](nodebalancers-hello-world.png "Viewing the NodeBalancer-driven Web Site in a Browser")

### A Note about Virtual Hosts

You might not see the web application that you expect when you go directly to the NodeBalancer's IP address. This is due to virtual hosts, and is not an issue unique to NodeBalancers. In the default configurations of many web servers, an application might only be configured to respond for certain hostnames. This can impact testing NodeBalancers as well as the behavior of their health checks.

It is important to configure the "default" virtual host in your web server to point at something useful. The NodeBalancer will pass the Host header from a browser untouched, so virtual hosts will work entirely normally once you are pointing a domain at the NodeBalancer. It is only mentioned here because testing NodeBalancers can demonstrate quirks in a web server's configuration, particularly when browsing by the NodeBalancer's IP address.

{{< note >}}
Health checks are transmitted with a Host header (in HTTP/1.0 mode).
{{< /note >}}

## Putting the NodeBalancer in Charge

Your NodeBalancer is now working and is able to pass traffic to your web application. It is important to note at this point that configuring the NodeBalancer has not impacted your application's normal operations at all -- you can test the NodeBalancer without your users ever knowing.

Once you are satisfied that NodeBalancer is working normally, you can switch your web application's traffic over to it through DNS.

1.  On the NodeBalancer's overview, you can see its IP address. Take note of the IP address, to use in the A record for your domain.

1.  Edit or create an A record for your website's domain name, pointing to your NodeBalancer's IP address.

    ![Adding an A Record.](nodebalancers-add-a-name.png)

1.  Also add an AAAA record for the IPv6 address.

Once the DNS changes propagate, traffic will begin flowing through the NodeBalancer. At this point, you will want to wait up to 24 hours for all caches to catch up to the NodeBalancer before proceeding.

## Additional Backends and Features

On another Linode, make an exact copy of your current web server. The [Linode Backups](/docs/products/storage/backups/) service can be instrumental for doing so, as a snapshot can be restored to any other Linode. Once you have another backend ready, simply repeat step four of [Configuring a NodeBalancer](/docs/platform/nodebalancer/getting-started-with-nodebalancers/#configuring-a-nodebalancer) to add it to the NodeBalancer configuration.

![Adding another backend to the NodeBalancer's configuration.](nodebalancers-backend-nodes2.png)

Once the configuration is sent to the backend, users will be balanced over the two Linodes and each will be monitored for health. This configuration is easy to work with, as upgrades can be rolled out to each backend without disrupting service and backend Linodes can be taken in and out of rotation at will.

This is just the beginning; NodeBalancers are extremely flexible and cater to a lot of needs. From here, the API can be used to add many backends. Multiple ports on one backend can be balanced for complex setups. Additionally, new tools like *memcached* can be introduced to the application to allow session stickiness to become irrelevant.

## IP Address Range

NodeBalancers all have private IP addresses in the `192.168.255.0/24` range. It's important to note that while their public IP address is persistent, the private IP address **will** change. When configuring a firewall or other network restriction on back-end Linodes, be sure to allow the entire `192.168.255.0/24` range and not a specific IP address.
