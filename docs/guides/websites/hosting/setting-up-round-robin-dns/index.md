---
slug: setting-up-round-robin-dns
author:
  name: Linode
  email: docs@linode.com
description: 'How to set up round-robin DNS'
keywords: ["hosting a website", "website", "linode quickstart guide", "high availability", "failover"]
tags: ["web server","nginx","monitoring"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-05-07
modified_by:
  name: Linode
published: 2012-03-13
title: Setting up Round-Robin DNS
aliases: ['/websites/hosting/setting-up-round-robin-dns/','/websites/setting-up-round-robin-dns/']
---

## What is Round-Robin DNS

**Round-Robin DNS** is a method of distributing site traffic between two or more different Linodes configured to use the same domain.

While similar to NodeBalancers and other high availability solutions, Round-Robin DNS does not provide a complex level of redundancy and fault tolerance that can be achieved through other means. Using round-robin DNS will distribute the load between servers for example, however it does not necessarily do this based on whether or not the server is active. In other words, if one Linode goes down, some users will still be directed to an out of service Linode, as DNS is typically not aware of the state of running servers. This effect can be worsened if the DNS response is cached, which could continue to force users to connect to a failed or failing server repeatedly instead of redirecting them to one that works. While using a low TTL in your DNS configuration can reduce the impact of caching issues, it can not guarantee high availability.

This guide will explain how to configure round-robin DNS in it's most basic configuration, as well as apply it to a NodeBalancer configuration for additional fault tolerance and redundancy, and to ensure that our application can be served and balanced across different data centers.

## Before you Begin

- Create a Linode on any plan that will host your server. While a round-robin DNS configuration is possible with all major distros, the steps in this guide were specifically created using Debian 10.

- [Add a domain and configure an A record](https://www.linode.com/docs/products/networking/dns-manager/get-started/) to point to your new Linode. When using round-robin DNS, a low TTL is recommended.
- [Configure a Web Server](https://www.linode.com/docs/guides/how-to-install-nginx-debian-10/) using your Domain Name. While any major web server will be able to accommodate round-robin DNS, this guide was specifically created using NGINX.

{{< note>}}
 Additional required Linodes will be cloned in a later step. Note that any round robin DNS configuration requires at least two Linodes.
{{< /note >}}

After creating your Linode, configuring DNS, and setting up your web server, you should be able to freely access a webpage using your domain name:

![Hello World](helloworld.png "hello world")

### Cloning your Web Server

Once your Linode is fully configured, the next step is to copy your configuration to additional Linodes in different data centers. The following steps can be repeated for as many additional Linodes as needed:

1. **Recommended**: Power off the Linode you would like to clone. This is recommended to prevent data corruption.

1. Click **Create** at the top of the Cloud Manager and select **Linode**.

1. In the **Create New Linode** form, click on the **My Images** tab and then the **Clone Linode** tab:

    ![Select the 'Clone Linode' tab to clone an existing Linode.](clone-linode-menu.png)

1. Under **Select Linode to Clone From**,click on the Linode you wish to clone.

1. Select the region and plan for the clone. A different region is recommended for backend nodes when using round-robin DNS.

  {{< note >}}
You will not be able to choose a plan for your clone that is smaller than the plan of the Linode you are cloning. For example, a 2GB Linode can not be cloned into a 1GB Linode (Nanode).
{{</ note >}}

1. Provide a label for your new Linode.

1. Click **Create**.

1. The cloning process will begin. Depending on the size of your Linode, it may take some time. You will see a status bar above the Linode you cloned with the percentage of completion.

1. While your Linode is being cloned, your new clone will appear on the Linodes page in a powered off state. Once the cloning process is complete you will need to manually power on your new Linode.

### Configuring Your Clone

1. Create an [identical A record](/docs/products/networking/dns-manager/get-started/) pointing towards the cloned Linodes. You should now have two or more A records pointing to two or more different Linodes in different data centers, all using the same domain name.

![DNS record round robin.](dns-record-round-robin.png)

1. Power on the cloned Linodes.

1. To ensure that the DNS is correctly configured for all new Linode servers, use the following command from your local machine, replacing `example.com` with your domain name:

        dig +short example.com

The output should list the IP address of every Linode currently configured to resolve your domain name.

{{< output >}}
203.0.113.0
198.51.100.255
203.0.113.255
{{< /output >}}

## Putting NodeBalancers in Charge

While the above configuration is a functional round-robin DNS configuration, it does not provide a complex level of redundancy and fault tolerance that can be achieved through other means. This has to do with the way DNS functions. While using round-robin DNS will distribute the load between servers, it does not necessarily do this based on whether or not the server is active. In other words, if one Linode goes down, some users will still be directed to an out of service Linode, as DNS is typically not aware of the state of running servers. This effect can be worsened if the DNS response is cached, which could continue to force users to connect to a failed or failing server repeatedly instead of redirecting them to one that works. While using a low TTL in your DNS configuration can reduce the impact of caching issues, it can not guarantee high availability.

Due to these reasons, some users may have better performance combining Round-Robin DNS with High Availability Solutions like NodeBalancers, distributed between different datacenters.

### Creating NodeBalancers

In this example, round-robin DNS will be used to alternate between two NodeBalancers on two different data centers, hosting a total of four Linodes.

1. Follow the [Cloning Your Web Server](##cloning-your-web-server)steps until you have 4 Linodes fully configured. You should have two Linodes available for each data center you will be creating a NodeBalancer in.

{{< note >}}
If using NodeBalancers, DNS records should not be configured for the individiual Linodes since they will instead be created for the NodeBalancers themselves. You should delete any A records for the individual Linodes now.
{{< /note >}}

1. [Add a Private IP Address](/docs/guides/remote-access/#adding-private-ip-addresses) for each Linode that has been pre-configured for round-robin DNS.

1. Boot or Reboot all Linodes once they have been given a private IP address to ensure that the network configuration will be applied.

1.  Visit the NodeBalancers page in the Linode [Cloud Manager](http://cloud.linode.com) and select **Create NodeBalancer**.

1.  A NodeBalancer is configured using [ports](/docs/platform/nodebalancer/nodebalancer-reference-guide/#port). The current web application only uses port 80 (for regular HTTP traffic).

    **HTTP**

    For the traditional web application, the settings in the screenshot above are a good start. HTTP cookie stickiness is preferred so that the same client always lands on the same backend. For a simple web application that keeps sessions in memory, this is necessary to avoid session errors on clients.

    **HTTPS**

    If you select the HTTPS protocol, two new fields appear. These fields accept your SSL certificate, chained certificates (if applicable) and a private key (which must not have passphrase protection).

    Every ten seconds, the NodeBalancer requests the root of the web application and looks for a valid response code. With this example setup, there is only one backend node (which is added in the next step). If the backend goes down, the NodeBalancer serves a plain 503 Service Unavailable error page. This is more desirable than refusing connections or making browsers wait for a timeout.

1.  Next, add two backend nodes from the same datacenter to the NodeBalancer's configuration. Point your configuration at the private IP address of each Linode.

    These configuration changes take a few moments to be reflected by your NodeBalancer. If everything is configured on your backend correctly, once the changes have gone through, the **Node Status** column updates to **1 up / 0 down**.

    If the backend status reports **0 up / 1 down**, check to make sure that your web application is configured to respond on the Linode's private IP address. You do this by adding the private IP address to your `/etc/hosts` file on your Linode and then reboot your Linode. There might be a virtual host mismatch as well -- check the notes in the next section.

1. Repeat the steps to create a NodeBalancer until you have two NodeBalancers fully configured accross two different data centers.

1.  Now that the NodeBalancers are up, go directly to your NodeBalancer's IP addresses in a browser. You should see your web application freely available as the NodeBalancer proxies the traffic through.

1. After confirming that the Node Balancer is working, [Add a domain and configure two A records](https://www.linode.com/docs/products/networking/dns-manager/get-started/) pointing towards the NodeBalancers you have created. Each A record should be using the same DNS name, and pointing towards the public IP address of your NodeBalancers.

After completing these steps, round-robin DNS is now successfully configured for your NodeBalancers. Additional Linodes and NodeBalancers can be added to suit your application's specific needs.






















