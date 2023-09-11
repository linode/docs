---
title: Get Started
title_meta: "Getting Started with Global Load Balancer"
description: "Learn how to quickly start using a Global Load Balancer, including advice on architecting your application and configuring the Load Balancer"
tab_group_main:
    weight: 20
keywords: ["loadbalancers", "loadbalancer", "load balancers", "load balancer", "load balancing"]
tags: ["cloud manager","linode platform","networking","web applications"]
aliases: ['/global-loadbalancer/getting-started/']
published: 2023-06-26
authors: ["Linode"]
---

**Akamai Global Load Balancer**  offers global, configurable, scalable, distributed compute traffic management across physical, virtual, and cloud-hosted applications. It can automatically detect load conditions and route traffic to the optimal target while maintaining custom routing policies and consistent visitor session behavior.

## About Akamai Global Load Balancer

Nearly every production application can benefit from a load balancing solution like Akamai's Enterprise Global Load Balancer. This guide covers how to get started with Load Balancers, including how to configure the Load Balancer, and update the DNS.

## Prepare the Application

To start using and benefiting from load balancing, your application should be deployed on at least two Compute Instances. Each instance of your application should be able to fully serve the needs of your users, including being able to respond to web requests, access all necessary files, and query any databases.

To sign up for a Linode account and to start deploying Compute Instances, see [Getting Started on the Linode Platform](/docs/products/compute/compute-instances/get-started/)

To redirect all web connections over port 443/HTTPS generate an TLS certificate for your domain name that supports TLS version 1.2 or later.

## Create the Akamai Global Load Balancer

Once your application has been deployed on multiple Compute Instances, you are ready to create the Akamai Global Load Balancer which includes configuring the following components.

![This diagram shows the main components that are configured when creating a Global Load Balancer.](glb-2.jpg)

1. **Load Balancer:** Label the load balancer and select regions.

1. **Entry Point:** Select the entry point protocol (TCP or HTTP) and port the load balancer uses to listen on.

1. **TLS Termination Certificates:** Upload your certificate and private key.

1. **Routes:** Create routes and route rules used to select the service target.

1. **Targets:** Configure the service endpoints (targets) and their policy type and health checks.

1. **CA Certificates:**

{{< tabs >}}
{{< tab "Cloud Manager" >}}
### Label the Load Balancer and Select Regions
1. Log in to the [Cloud Manager](https://cloud.linode.com), select Load Balancers from the left menu, and click the **Create Global Load Balancer** button. This displays the *Load Balancers Create* form.

1. Enter a **Name** for this Load Balancer that uniquely identifies it from other load balancers. Consider using a name that indicates the load balancers purpose. The **Name** can contain between 3? and 32? alphanumeric characters.

1. Optionally, create tags to help organize and group your load balancers.

1. Select the **Regions** where this load balancer processes requests. If your client traffic and targets are limited to a particular geography, select that region. You can also select multiple regions or `All` for global coverage. The number of regions selected, is one of the factors that determines the [Pricing](/docs/products/networking/global-loadbalancer/#pricing) for this load balancer.

### Select the Entry Point Protocol and Port
An Entry Point defines the port the load balancer listens on and the protocol for routing incoming traffic to the service targets. Once the port is selected, the name for the Entry Point is created.

1. Within the **Entry Point Configuration** area, select the protocol and enter the port number used to listen to incoming requests.

    - **Protocol:** The protocol can be set to either TCP, HTTP, or HTTPS. The *TCP* protocol supports HTTP/1.1 and HTTP/2, and maintains encrypted connections to the backend Compute Instances. If you intend to manage and terminate the TLS certificate on the Global Load Balancer, use *HTTP* for port 80 and *HTTPS* for port 443.

        - **TCP**: Supports most application-layer protocols, including HTTP and HTTPS. TCP should be selected when you want to enable layer 4 load balancing, use TLS/SSL pass-through, use HTTP/2.0 or higher, balance non-HTTP services, or make use of [Proxy Protocol](#proxy-protocol). Since the Global Load Balancer serves as a pass-through for these TCP packets, any encrypted traffic is preserved and must be decrypted on the backend nodes.

        - **HTTP:** Unencrypted web traffic using HTTP/1.1 or HTTP/2. When HTTP is selected, the HTTP request is terminated on the Global Load Balancer, allowing the Load Balancer to create a new HTTP request to the backend machines. This can be used when serving most standard web applications, especially if you intend on configuring the Global Load Balancer to use HTTPS mode with TLS/SSL termination.

        - **HTTPS:** Encrypted web traffic using HTTP/1.1 or HTTP/2. Since this terminates the request on the Global Load Balancer, it also terminates the TLS/SSL connection to decrypt the traffic. Use this if you wish to configure TLS/SSL certificates on the Global Load Balancer and not on individual backend nodes.
                When using the **HTTPS** protocol setting, all traffic is decrypted on the Global Load Balancer. Traffic between the Global Load Balancer and the backend nodes is sent over the private data center network, is not encrypted, and uses the HTTP protocol.

    - **Port:** This is the *inbound* port that the Global Load Balancer is listening on. For TCP, this can be any port from 1 through 1023, though it should be set to whichever port the client software connects to. For instance, web browsers use port 80 for HTTP traffic and port 443 for HTTPS traffic, though a client can change the port by specifying it as part of the URL.


1. When the HTTPS protocol is selected, you need to install an TLS certificate on your Global Load Balancer to redirect all web connections over port 443/HTTPS using TLS.

    - **Certificate Name:** 

    - **TLS Certificate:** Paste the PEM-formatted contents of your TLS certificate. If you have linked multiple segments of a chained certificate, be sure to copy all of its contents into the text field, appearing one after another. The certificate must be signed using the RSA algorithm, which is the default in most cases.

    - **Private Key:** Paste the PEM-formatted contents of your private key. Your private key must not have a passphrase.

    - **SNI Hostname:**

### Configure Routes
Routes define how the load balancer directs incoming requests to service targets. You can configure the  service target and the percentage of incoming requests that should be  directed to that target. For HTTP and HTTPS protocol load balancers, additional match conditions can be added to the route.

Follow the steps to configure routes for the type of load balancer; 
- [Routes for TCP Load Balancers](/docs/products/networking/global-loadbalancer/get-started/?tabs=cloud-manager#routes-for-tcp-load-balancers)
- [Routes for HTTP and HTTPs Load Balancers](/docs/products/networking/global-loadbalancer/get-started/?tabs=cloud-manager#routes-for-http-and-https-load-balancers)

#### Routes for TCP Load Balancers
For TCP load balancers, a route consists of a service target and the percentage of incoming requests that should be  directed to that target. Add as many routes/service targets as you require but the percentages for all routes must total 100. You can create a new route or select existing routes.

1. Select an exisiting route from the list and continue with Configuring Session Stickness. For a new route, click the **Add Route** button.

1. Enter a **Route Name** for this route that uniquely identifies it from other routes. The **Route Name** can contain between 3? and 32? alphanumeric characters.

1. Select a **Service Target** from the pull list.

1. Enter the percentage of traffic that you want routed to this service target in the **Percent** field.

1. Add or select additonal routes.

#### Routes for HTTP and HTTPs Load Balancers
 Routes provide the set of traffic routing rules that the load balancer uses to select the target for the incoming request. Routes are configurable for load balancers using HTTP or HTTPS protocols.

1. Enter a **Route Name** for this route that uniquely identifies it from other Routes. The **Route Name** can contain between 3? and 32? alphanumeric characters.

1. Add an optional **Default target** to use if no rule matches. Without a default target, non-matching requests are rejected.

**Add Match Conditions for Each Route**

A match condition consists of a **Match Field**, and a **Match Value** pattern to match. Rules are evaluated in order, with the first match winning. Each rule can specify only one field/pattern pair (AND/OR logic is not supported).

| Match Field     | Description |Match Value Examples       |Operators|Wildcards|Case Sensitivity|
|----------------|-------------|--------------|---------|---------|----------------|
|**Path Prefix**  | A URL path prefix. The format of the path entry is as follows: /pathprefix1/pathprefix2. The initial slash is required, the trailing slash is not.| /images |is one of |?|?|
|**Query**        | Exact match based on both the name of the query and the single URL query value to match on. If there is no value, the match is to any request that contains the parameter.|?svc=images| ? | ? | ?|
|**Header**       | Exact match based on both the name of a request header and its value. If no value is entered, any request containing the header name produces a match.|X-route-header=images|is |?|?|
|**Method**       |Match based the type of request method.|GET, DELETE, POST, PUT |is|?|?|

1. Enter a **Rule Label**.

1. Select a **Match Type**.

1. Select an operator and enter the **Match Value**.

1. If this rule applies to a specific target, enter the **Hostname** of the target or select the target. If a hostname or target is not specified, the rule applies to all targets. Wildcards (*) are supported.

### Configure Session Stickiness

1. Enable **Session Stickiness** if you want to route subsequent requests from the same client to the same service target when possible. For testing, consider keeping Session Stickiness off.

    **None:** When **Session Stickiness** is disabled, no session information is saved and requests are routed in accordance with the algorithm only.

    **Table:** This preserves the initial backend selected for an IP address by the chosen algorithm. Subsequent requests by the same client are routed to that backend, when possible. This map is stored within the Load Balancer and expires after ?? minutes from when it was added. If a backend target goes offline, entries in the table for that backend are removed. When a client sends a new request, it is then rerouted to another backend target (in accordance with the chosen algorithm) and a new entry is created in the table.

    **HTTP Cookie:** Requires the configuration protocol be set to HTTP or HTTPS. The load balancer stores a cookie (named `LB_SRVID??`) on the client that identifies the backend where the client is initially routed to. Subsequent requests by the same client are routed to that backend, when possible. If a backend node goes offline, the request is rerouted to another backend node (in accordance with the chosen algorithm) and the cookie is rewritten with the new backend identifier.

    {{< note >}}
    The client must have cookies enabled. If the client has disabled cookies or deletes cookies, session persistence is not preserved and each new request is routed in accordance with the chosen algorithm.
    {{< /note >}}

### Configure Service Targets

1. Select the load balancing **Algorithm**.

The load balancing algorithm controls how new connections are allocated across backend targets. Performance and Weighted methods are supported.
- **Performance:** selects the backend target by evaluating routes using real-time load feedback and the shortest geographic route.
- **Weighted:** routes requests to backend targets according to the proportion (%) configured.

1. If Weighted is selected, enter the percentage of traffic that should be routed to each selected target. All of the percentages must total 100%.

    - **Health Checks:** Load Balancers have both *active* and *passive* health checks available. These health checks help take unresponsive or problematic backend Compute Instances out of the rotation so that no connections are routed to them. These settings can be left at the default for most applications. Review [Configuration Options > Health Checks](/docs/products/networking/global-loadbalancer/guides/configure/#health-checks) for additional information.

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

After deploying your load balancer and putting your application behind the load balancer, the application can now be accessed using the load balancer's public IPv4 and IPv6 addresses. Since most public-facing applications utilize domain names, you need to update any associated DNS records. The *A* record should use the load balancer's IPv4 address and the *AAAA* record (if you're using one) should use the load balancer's IPv6 address. See [Manage Load Balancers](/docs/products/networking/global-loadbalancer/guides/manage/#review-and-edit-a-nodebalancer) to view your load balancer's IP addresses. For help changing the DNS records, consult your DNS provider's documentation. If you are using Linode's DNS Manager, see [Edit DNS Records](/docs/products/networking/dns-manager/guides/manage-dns-records/). Keep in mind that DNS changes can take up to 24 hours to fully propagate, though that typically happens much faster.