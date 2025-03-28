---
title: Get Started
title_meta: "Getting Started with NodeBalancers"
description: "Learn how to quickly start using a NodeBalancer, including advice on architecting your application and configuring the NodeBalancer"
published: 2022-10-07
tab_group_main:
    weight: 30
keywords: ["nodebalancers", "nodebalancer", "load balancers", "load balancer", "load balancing", "high availability", "ha"]
tags: ["cloud manager","linode platform","networking","web applications"]
aliases: ['/nodebalancers/getting-started/','/platform/nodebalancer/getting-started-with-nodebalancers-new-manager/','/platform/nodebalancer/getting-started-with-nodebalancers/','/linode-platform/nodebalancer-howto/','/platform/nodebalancer/getting-started-with-nodebalancers-classic-manager/', '/guides/nodebalancer/getting-started-with-nodebalancers/','/guides/getting-started-with-nodebalancers/']
---

Nearly every production application can benefit from a load balancing solution like Linode's NodeBalancers. This guide covers how to get started with NodeBalancers, including how to architect your application, configure the NodeBalancer, and update the DNS.

## Prepare the Application

To start using a NodeBalancer and benefiting from load balancing, your application should be stored on at least two Compute Instances. Each instance of your application should be able to fully serve the needs of your users, including being able to respond to web requests, access all necessary files, and query any databases. When determine your application's infrastructure, consider the following components:

- **Application deployment:** *How will you deploy your application's code and software infrastructure to each Compute Instance?* Consider using automated git deployments or more advanced CI/CD tooling.

- **File storage and synchronization:** *Should the application's files be stored alongside the application's code or should you consider implementing a distributed storage solution on separate instances?* For simple applications, consider file synchronization/backup tools like [rsync](https://linux.die.net/man/1/rsync) or [csync2](https://linux.die.net/man/1/csync2). For a more robust solution, consider a distributed file system like [GlusterFS](https://www.gluster.org/).

- **Database replication:** *How will you maintain consistency between multiple databases?* Consider the suggested architecture and available tooling for the database software you intend to use. Linode [Managed Databases](/docs/products/databases/managed-databases/), when deployed with high availability enabled, are a great fully-managed solution. Alternatively, [Galera](https://galeracluster.com/) is a self-hosted option that can be used with MySQL.

    {{% content "dbass-eos" %}}

In some simple applications, the servers that store your application's code can also store its files and databases. For more complex applications, you may want to consider designating separate application servers, file servers, and database servers. The application servers (where the web server software and application code resides) operate as the back ends to the NodeBalancer. The file servers and database servers can be built on cloud-based solutions (like Managed Databases) or self-hosted software on Compute Instances.

For advice on load balancing and high availability, review the following resources:

- [Introduction to Load Balancing](/docs/products/networking/nodebalancers/guides/load-balancing/)
- [Introduction to High Availability](/docs/guides/introduction-to-high-availability/)
- [Host a Website with High Availability](/docs/guides/host-a-website-with-high-availability/)

## Create the NodeBalancer

If you are using a Cloud Firewall with this NodeBalancer, have the name of the firewall available. To see a listing of available firewalls, log in to [Cloud Manager](https://cloud.linode.com) and select **Firewalls** from the navigation menu. If the firewall doesn't exist yet, [Create a Cloud Firewall](/docs/products/networking/cloud-firewall/guides/create-a-cloud-firewall/) and [Add Firewall Rules](/docs/products/networking/cloud-firewall/guides/manage-firewall-rules/).

Once your application has been deployed on multiple Compute Instances, you are ready to create the NodeBalancer. Simple instructions have been provided below. For complete instructions, see the [Create a NodeBalancer](/docs/products/networking/nodebalancers/guides/create/) guide.

1. Log in to [Cloud Manager](https://cloud.linode.com), select **NodeBalancers** from the left menu, and click the **Create NodeBalancer** button. This displays the *NodeBalancers Create* form.

1. Enter a **Label** for the NodeBalancer, as well as any **Tags** that may help you organize this new NodeBalancer with other services on your account.

1. Select a **Region** for this NodeBalancer. The NodeBalancer needs to be located in the same data center as your application's Compute Instances.

1. If you are using a firewall, select a firewall from the **Assign Firewall** list. Only one Firewall can be selected, however you can attach the same Cloud Firewall to multiple NodeBalancers or other services (devices).

    You can also create a new Firewall by clicking the **Create Firewall** button. This displays the *Create Firewall* drawer. Configure the required field.

    | **Configuration** | **Description** |
    | --------------- | --------------- |
    | **Label** (Required)| The label is used as an identifier for this Cloud Firewall. |
    | **Additional Linodes** (Optional)| The Linode(s) on which to apply this Firewall. A list of all Linodes on your account are visible. You can leave this blank if you do not yet wish to apply the Firewall to a Linode. |
    | **Additional NodeBalancers** (Optional) | The NodeBalancers on which to apply this Firewall. A list of all created NodeBalancers on your account are visible. You can leave this blank if you do not want to apply this Cloud Firewall to other NodeBalancers.|

    Click on the **Create Firewall** button to finish creating the Cloud Firewall and to returned to the *NodeBalancers Create* form.

    {{< note >}}
    By default, a new Cloud Firewall accepts all inbound and outbound connections. Only inbound firewall rules apply to NodeBalancers, see [Cloud Firewall Inbound Rules for NodeBalancer](/docs/products/networking/nodebalancers/guides/create/#cloud-firewall-inbound-rules-for-nodebalancer). Custom rules can be added as needed in the Firewall application. See [Add New Cloud Firewall Rules](/docs/products/networking/cloud-firewall/guides/manage-firewall-rules/).
    {{< /note >}}

5. Within the *NodeBalancer Settings* area, there is a single configuration block with sections for configuring the port, defining health checks, and attaching back-end nodes. Additional ports can be added using the **Add another Configuration** button.

    {{< note >}}
    The following recommended parameters can be used for deploying a website. For other applications or to learn more about these settings, see the [Configuration Options](/docs/products/networking/nodebalancers/guides/configure/) guide.
    {{< /note >}}

    - **Port:** For load balancing a website, configure two ports: port 80 and port 443. Each of these ports can be configured separately. See [Configuration Options > Port](/docs/products/networking/nodebalancers/guides/configure/#port).

    - **Protocol:** Most applications can benefit from using the *TCP* protocol. This option is more flexible, supports HTTP/2, and maintains encrypted connections to the back-end Compute Instances. If you intend to manage and terminate the TLS certificate on the NodeBalancer, use *HTTP* for port 80 and *HTTPS* for port 443. See [Configuration Options > Protocol](/docs/products/networking/nodebalancers/guides/configure/#protocol).

    - **Algorithm:** This controls how new connections are allocated across back-end nodes. Selecting *Round Robin* can be helpful when testing (in conjunction with no session stickiness). Otherwise, *Least Connections* can help evenly distribute the load for production applications. See [Configuration Options > Algorithm](/docs/products/networking/nodebalancers/guides/configure/#algorithm).

    - **Session Stickiness:** This controls how subsequent requests from the same client are routed when selecting a back-end node. For testing, consider selecting *None*. Otherwise, *Table* can be used for any protocol and *HTTP Cookie* can be used for *HTTP* and *HTTPS*. See [Configuration Options > Session Stickiness](/docs/products/networking/nodebalancers/guides/configure/#session-stickiness).

    - **Health Checks:** NodeBalancers have both *active* and *passive* health checks available. These health checks help take unresponsive or problematic back-end Compute Instances out of the rotation so that no connections are routed to them. These settings can be left at the default for most applications. Review [Configuration Options > Health Checks](/docs/products/networking/nodebalancers/guides/configure/#health-checks) for additional information.

    - **Back-end nodes:** Each Compute Instance for your application should be added as a *back-end node* to the NodeBalancer. These Compute Instances need to be located in the same data center as your NodeBalancer and have private IP addresses assigned to them. Set a **Label** for each instance, select the corresponding **IP address** from the dropdown menu, and enter the **Port** that the application is using on that instance. See [Back-end Nodes (Compute Instances)](/docs/products/networking/nodebalancers/guides/backends/).

        For most web applications that have the *inbound* ports 80 and 443 configured using the *TCP* protocol, you can set the back-end nodes to use the same ports. If you are using the *HTTPS* protocol, TLS termination happens on the NodeBalancer and your Compute Instances should only need to listen on port 80 (unencrypted). If that's the case, back-end nodes for both *inbound* ports can be configured to use port 80.

1. Review the summary and click the **Create NodeBalancer** button to provision your new NodeBalancer.

## Update the DNS

After deploying your NodeBalancer and putting your application behind the NodeBalancer, the application can now be accessed using the NodeBalancer's public IPv4 and IPv6 addresses. Since most public-facing applications use domain names, you need to update any associated DNS records. The *A* record should use the NodeBalancer's IPv4 address and the *AAAA* record (if you're using one) should use the NodeBalancer's IPv6 address. See [Manage NodeBalancers](/docs/products/networking/nodebalancers/guides/manage/#review-and-edit-a-nodebalancer) to view your NodeBalancer's IP addresses. For help changing the DNS records, consult your DNS provider's documentation. If you are using Linode's DNS Manager, see [Edit DNS Records](/docs/products/networking/dns-manager/guides/manage-dns-records/). Keep in mind that DNS changes can take up to 24 hours to fully propagate, though that typically happens much faster.