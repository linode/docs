---
title: Get Started
title_meta: "Getting Started with Enterprise Global Load Balancer"
description: "Learn how to quickly start using a Enterprise Global Load Balancer, including advice on architecting your application and configuring the Load Balancer"
tab_group_main:
    weight: 30
keywords: ["loadbalancers", "loadbalancer", "load balancers", "load balancer", "load balancing"]
tags: ["cloud manager","linode platform","networking","web applications"]
aliases: ['/loadbalancer-draft/getting-started/']
published: 2023-05-01
authors: ["Linode"]
---

**Akamai Global Load Balancer**  offers global, configurable, scalable, distributed compute traffic management across physical, virtual, and cloud-hosted applications. It can automatically detect load conditions and route traffic to the optimal target while maintaining custom routing policies and consistent visitor session behavior.

## About Akamai Global Load Balancer

Nearly every production application can benefit from a load balancing solution like Akamai's Enterprise Global Load Balancer. This guide covers how to get started with Load Balancers, including how to configure the Load Balancer, and update the DNS.

## Prepare the Application

To start using and benefiting from load balancing, your application should be stored on at least two Compute Instances. Each instance of your application should be able to fully serve the needs of your users, including being able to respond to web requests, access all necessary files, and query any databases.

To redirect all web connections over port 443/HTTPS generate an SSL certificate for your domain name that supports TLS version 1.2 or later.

## Create the Akamai Global Load Balancer

Once your application has been deployed on multiple Compute Instances, you are ready to create the Akamai Global Load Balancer. General instructions have been provided below. For detailed instructions, see the [Create a Akamai Global Load Balancer](/docs/products/networking/loadbalancer-draft/guides/create/) guide.

To sign up for a Linode account and to start deploying Compute Instances, see [Getting Started on the Linode Platform](/docs/products/platform/get-started/)

{{< tabs >}}
{{< tab "Cloud Manager" >}}
1. Log in to the [Cloud Manager](https://cloud.linode.com), select Load Balancers from the left menu, and click the **Create Global Load Balancer** button. This displays the *Load Balancers Create* form.

1. Enter a **Label/Name** for this Load Balancer. The label can contain ...and must be unique.

1. Select the **Regions** where this load balancer processes requests. If your client traffic and targets are limited to a particular geography, select that region. You can also select multiple regions or `All` for global coverage.

1. Within the **Entry Point Configuration** area, select the protocol and enter the port number used to listen to incoming requests.

    - **Protocol:** The protocol can be set to either TCP, HTTP, or HTTPS. The *TCP* protocol supports HTTP/1.1 and HTTP/2, and maintains encrypted connections to the backend Compute Instances. If you intend to manage and terminate the TLS certificate on the Global Load Balancer, use *HTTP* for port 80 and *HTTPS* for port 443.

        - **TCP**: Supports most application-layer protocols, including HTTP and HTTPS. This should be selected when you want to enable layer 4 load balancing, use TLS/SSL pass-through, use HTTP/2.0 or higher, balance non-HTTP services, or make use of [Proxy Protocol](#proxy-protocol). Since the Global Load Balancer serves as a pass-through for these TCP packets, any encrypted traffic is preserved and must be decrypted on the backend nodes.

        - **HTTP:** Unencrypted web traffic using HTTP/1.1 or HTTP/2. This terminates the HTTP request on the Global Load Balancer, allowing the Load Balancer to create a new HTTP request to the backend machines. This can be used when serving most standard web applications, especially if you intend on configuring the Global Load Balancer to use HTTPS mode with TLS/SSL termination.

        - **HTTPS:** Encrypted web traffic using HTTP/1.1 or HTTP/2. Since this terminates the request on the Global Load Balancer, it also terminates the TLS/SSL connection to decrypt the traffic. Use this if you wish to configure TLS/SSL certificates on the Global Load Balancer and not on individual backend nodes.
        
            When using the **HTTPS** protocol setting, all traffic is decrypted on the Global Load Balancer. Traffic between the Global Load Balancer and the backend nodes is sent over the private data center network, is not encrypted, and uses the HTTP protocol.

    - **Port:** This is the *inbound* port that the Global Load Balancer is listening on. This can be any port from 1 through 65534, though it should be set to whichever port the client software connects to. For instance, web browsers use port 80 for HTTP traffic and port 443 for HTTPS traffic, though a client can change the port by specifying it as part of the URL.


1. Click **Authorization**, to install an SSL certificate on your Global Load Balancer to redirect all web connections over port 443/HTTPS using SSL.

    - **SSL Certificate:** Paste the PEM-formatted contents of your SSL certificate. If you have linked multiple segments of a chained certificate, be sure to copy all of its contents into the text field, appearing one after another. The certificate must be signed using the RSA algorithm, which is the default in most cases.

    - **Private Key:** Paste the PEM-formatted contents of your private key. Your private key must not have a passphrase.

1. Add the **Entry Point Label**. Each Entry Point includes a list of **Routes**. Routes are the set of rules that the load balancer uses to select the target for the incoming request.

  - **Algorithm:** Controls how new connections are allocated across backend targets. The *Performance* method selects the backend target by evaluating routes using real-time load feedback and the shortest geographic route. The *Weighted* method routes requests to backend targets according to the proportion (%) configured. See [Configuration Options > Algorithm](/docs/products/networking/loadbalancer-drafts/guides/configure/#algorithm).

    - **Session Stickiness:** This controls how subsequent requests from the same client are routed when selecting a backend target. For testing, consider keeping Session Stickiness off. See [Configuration Options > Session Stickiness](/docs/products/networking/nodebalancers/guides/configure/#session-stickiness).

    - **Health Checks:** Load Balancers have both *active* and *passive* health checks available. These health checks help take unresponsive or problematic backend Compute Instances out of the rotation so that no connections are routed to them. These settings can be left at the default for most applications. Review [Configuration Options > Health Checks](/docs/products/networking/loadbalancer-draft/guides/configure/#health-checks) for additional information.

    - **Backend Targets:** Load balancers work by distributing traffic to a pool of servers. For Enterprise Global Load Balancer, these servers are Linode Compute Instances that can be in different regions. For information on configuring backends, see the Configure Backend Nodes (Compute Instances) guide. Compute Instances can be located in any region. Set a **Label** for each instance, select the corresponding **IP address** from the dropdown menu, and enter the **Port** that the application is using on that instance. See [Backend Targets (Compute Instances)](/docs/products/networking/loabalancer-draft/guides/backends/).

        For most web applications that have the *inbound* ports 80 and 443 configured using the *TCP* protocol, you can set the backend nodes to use the same ports. If you are using the *HTTPS* protocol, TLS termination happens on the NodeBalancer and your Compute Instances should only need to listen on port 80 (unencrypted). If that's the case, backend nodes for both *inbound* ports can be configured to use port 80.

1. Review the summary and click the **Create Global Load Balancer** button to provision your new load balancer.
{{< /tab >}}
{{< tab "APIv4" >}}
1. API Procedure
1. ...
1. ...
{{< /tab >}}
{{< /tabs >}}

## Update the DNS

After deploying your load balancer and putting your application behind the load balancer, the application can now be accessed using the load balancer's public IPv4 and IPv6 addresses. Since most public-facing applications utilize domain names, you need to update any associated DNS records. The *A* record should use the load balancer's IPv4 address and the *AAAA* record (if you're using one) should use the load balancer's IPv6 address. See [Manage Load Balancers](/docs/products/networking/loadbalancer/guides/manage/#review-and-edit-a-nodebalancer) to view your load balancer's IP addresses. For help changing the DNS records, consult your DNS provider's documentation. If you are using Linode's DNS Manager, see [Edit DNS Records](/docs/products/networking/dns-manager/guides/manage-dns-records/). Keep in mind that DNS changes can take up to 24 hours to fully propagate, though that typically happens much faster.