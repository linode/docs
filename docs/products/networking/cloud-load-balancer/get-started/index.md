---
title: Get Started
title_meta: "Getting Started with Cloud Load Balancer"
description: "Learn how to quickly start using a Cloud Load Balancer, including advice on architecting your application and configuring the Load Balancer"
tab_group_main:
    weight: 20
keywords: ["loadbalancers", "loadbalancer", "load balancers", "load balancer", "load balancing"]
tags: ["cloud manager","linode platform","networking","web applications"]
aliases: ['/cloud-load-balancer/getting-started/']
published: 2023-06-26
authors: ["Linode"]
---

**Akamai Cloud Load Balancer**  offers global, configurable, scalable, distributed compute traffic management across physical, virtual, and cloud-hosted applications. It can automatically detect load conditions and route traffic to the optimal target while maintaining custom routing policies and consistent visitor session behavior.

## About Akamai Cloud Load Balancer

Nearly every production application can benefit from a load balancing solution like Akamai's Cloud Load Balancer. This guide covers how to get started with Load Balancer, including how to configure the Load Balancer, and update the DNS.

## Prepare the Application

To start using and benefiting from load balancing, your application should be available on at least two service targets. Each service target should be able to fully serve the needs of your users, including being able to respond to web requests, access all necessary files, and query any databases.

To sign up for an account and to start deploying your service targets from Compute Instances, see [Compute Instances - Get Started](/docs/products/compute/compute-instances/get-started/). If your service targets are not deployed from compute instances, ensure you have the public IP addresses for the service target endpoints.

To redirect web connections over port 443/HTTPS, generate TLS certificates for your domains.

## Create the Akamai Cloud Load Balancer

Once your application has been deployed on at least two backends, you are ready to create the Akamai Cloud Load Balancer which includes configuring and uploading the following components.

![This diagram shows the main components that are configured when creating a Cloud Load Balancer.](aclb-2.jpg)

**Create Routes:** Create Routes to define how the load balancer directs incoming requests to service targets. After a route is created, you can add rules to set match conditions and configure session stickiness.

**Configure Entry Point and Add Routes:** Configure the entry point protocol (TCP, HTTPS, or HTTP) and the port load balancer uses to listen on. Add routes for forwarding requests to service target endpoints.

**Upload TLS Termination Certificates:** When the entry point protocol is HTTPS, upload certificates and private keys.

**Upload CA Certificates:** Upload the service target CA certificates.

**DNS Record:** Add the Cloud Load Balancers to the DNS records for the associated service targets.

### Label the Load Balancer and Select Regions
1. Log in to the [Cloud Manager](https://cloud.linode.com), select Cloud Load Balancers from the left menu, and click the **Create Load Balancer** button. This displays the *Cloud Load Balancers Create* form.

1. Enter a **Load Balancer Label** that uniquely identifies it from other load balancers. Consider using a name that indicates the load balancers purpose.

1. Optionally, create tags to help organize and group your load balancers.

    {{< note >}}
    `Tags` are not available for Beta.
    {{< /note >}}

1. Select the **Regions** where this load balancer processes requests. If your client traffic and targets are limited to a particular geography, select that region. You can also select multiple regions or `All` for global coverage. The number of regions selected, is one of the factors that determines the [Pricing](/docs/products/networking/cloud-load-balancer/#pricing) for this Load Balancer.

    {{< note >}}
    Five regions are automatically provisioned for Beta.
    {{< /note >}}

1. Click the **Create Load Balancer** button.

    The newly created load balancer is added.

### Create Service Targets
A service target is a cluster of endpoints that the load balancer directs incoming requests to. You can add different service targets and endpoints for different types of requests.

1. Click the **Service Targets** tab.

1. Click the **Create Service Target** button.

1. Refer to the following tables for information on configuring service targets.

| **Field**   | **Description** |
| :----------------| ----------------|
| **Add A Service Target**                            ||
|- Service Target Label          | Service Target name. |
|- Service Target Protocol | TCP, HTTP or HTTPs. The protocol this service target is configured to serve.||
|**Algorithm**                     | Select a load balancing policy that decides how new connections are allocated across your service targets. <li> **Round Robin:** Service targets are selected one after another in a repeating order. If unequal weights are assigned, service targets with a greater weight appear more frequently in the round robin rotation. </li><li> **Least Request:** The load balancer selects the service target with the fewest number of active requests. If unequal weights are assigned, weighted round robin rotation is applied.</li><li> **Ring Hash:** Each service target is mapped into a circle (ring) by hashing its address. Each request is then routed clockwise around the ring to the nearest service target.</li><li> **Random:** The load balancer selects a random available service target.</li><li> **Maglev:** The Maglev load balancer implements consistent hashing to upstream hosts. </li>    |
| **Endpoints** | A service target can not have endpoints that are exact duplicates. The port, IP or compute instance must differ. Capacity and health status are taken into consideration in the endpoint selection process.|
|- Linode or Public IP Address          | Select the Compute Instance (Linode). For non-Linode endpoints, enter the public IPv4 or IPv6 address. Do not use the localhost (127.0.0.0/8) or any IP address used internally by this load balancer for the endpoint IP address.|
|- Port| Enter the service target port that the load balancer directs incoming requests to. This is the port that the application is listening on.|
|- Host Header (optional)   | The host header for HTTP/S requests to the endpoint. The host header is not used to look up the IP address in the DNS.|
|- Rate Capacity (Requests per second)|The maximum number of requests/second that can be directed to this endpoint. If the actual number of requests/second exceeds the configured capacity value, requests are distributed to the other endpoints. The total requests per second allowed on each Load Balancer is defined in [Pricing](/docs/products/networking/cloud-load-balancer/#pricing). |

#### Service Target CA Certificate

When the HTTPS protocol is selected, you need to install TLS certificates on your Cloud Load Balancer. Cloud Load Balancer uses these certificates to verify responses from your service targets to your clients. You will be directed to upload service target endpoint CA certificates after the load balancer is created.
1. If you have uploaded CA certificates already, you can select the certificates you want to use.

#### Health Checks
Health checks are configured at the service target level and apply to all of the service targets endpoints. Health checks query the service targets by performing TCP connections or by making HTTP requests. For TCP, a service target is considered healthy and able to accept incoming requests when there is a successful TCP handshake with the service target. When HTTP/S is used to validate health status, the service target is considered healthy when requests to its path or host return a 2xx or 3xx status code response.

| **Field**   | **Description** |
| ----------------| ----------------|
|Use Health Checks| When enabled, health checks query the service targets by performing TCP connections or by making HTTP/S requests. Default is enabled.|
|Protocol| HTTP/S or TCP.  You can select TCP health checks even when the load balancers entrypoint protocol is HTTP or HTTPS. When set to TCP, path and host are not applicable.|
Interval (seconds) | The number of seconds between health checks for this service target. Minimum value is 1. |
|Healthy Thresholds | The number of consecutive health checks that must be successful before marking a service target as healthy. Minimum value is 1.|
|Unhealthy Threshold| The number of consecutive health checks that must fail before marking a service target as unhealthy. Minimum value is 1. |
|Timeout| How long to wait (in seconds) before canceling a health check because a connection could not be established with the service target. Minimum value is 1|
|Health Check Path (optional)|When *Protocol* is set to HTTP/S, enter the request url path for the health check. *Health Check Path* is not applicable when the health check *Protocol* is set to TCP.|
|Health Check Host (optional)| When *Protocol* is set to HTTP/S, enter the request host for the health check. *Health Check Host* is not applicable when the health check Protocol is set to TCP.|

4. Click the **Create and Add Service Target** button. The new service target is added and listed in the *Service Targets* table.

1. Add another service target, or if you have  finished adding your service targets, continue with the next steps to add routes.

### Configuration Routes - Add Routes and Rules
Routes have a unique label and rules. Routes define how the load balancer directs incoming requests to service targets. After a route is created, you add rules to set match conditions that are used for target selection.

TCP rules include the percentage of incoming requests that should be directed to each target.

For HTTP and HTTPS load balancers, in addition to setting the percentage of incoming requests to a target, other match conditions such as `Path` can be added to the route rules.

You can create new routes or use existing routes.

1. Click the **Next: Routes** button or the **Routes** stepper located on the left.

1. Click the **Add Route** button.

    - To use an existing route, select **Add Existing Route**, select the route from the **Route** list and click **Add Route**.

    - To create a new route, select **Create New Route**. Enter a **Route Label** for this route that uniquely identifies it from other routes.

1. Click **Create Route**. The route is added and listed in the *Routes* table.

1. Create or select additional routes. Once all Routes are added, the next steps involve adding rules.

Select the specific steps to add rules for TCP or HTTP/S load balancers;
- [Rules - TCP Load Balancers](/docs/products/networking/cloud-load-balancer/get-started/#routes---tcp-load-balancers)
- [Rules - HTTP and HTTPs Load Balancers](/docs/products/networking/cloud-load-balancer/get-started/#routes---http-and-https-load-balancers)

#### Rules - TCP Load Balancers
For TCP load balancers, route rules consist of service targets and the percentage of incoming requests that should be directed to each target. Add as many service targets as you require but the percentages for the rule must total 100.

1. In the *Route* table, click **Add Rule** for the route that you want to add rules to. The *Add Rule* drawer opens.

1. Select service targets from the **Service Target** pull down lists. You can also add more service targets by clicking on **Add Service Target**.

1. Assign a percentage of incoming requests that you want routed to each service target in the **Percent** field. All percentages must total 100.

1. Click **Add Rule**, to add the rule to the route.

1. Create or select additional rules. Once all rules are added, go to [Update the DNS](/docs/products/networking/cloud-load-balancer/get-started/#update-the-dns).

#### Rules - HTTP and HTTPs Load Balancers
 For HTTP and HTTPS load balancers, in addition to setting the percentage of incoming requests to each target, other match conditions such as host, path prefixes, query strings, request headers and request methods can be added to the route rules.  HTTP and HTTPS load balancers also support session stickiness.

1. In the *Route* table, click **Add Rule** for the route that you want to add rules to. The *Add Rule* drawer opens.


1. If this match rule applies to a specific target, enter the **Hostname** of the target or select the target. If a hostname or target is not specified, the rule applies to all targets. Wildcards (*) are not supported for Beta.

1. Add match conditions for each route. A match condition consists of a **Match Type**, and a **Match Value** pattern to match. Rules are evaluated in order, with the first match winning. Each rule can specify only one field/pattern pair (AND/OR logic is not supported). Match values are case sensitive and do not support wildcards. Supported **Match Types** and examples are available in the following table.

| Match Type     | Description |Match Value Examples       |
|----------------|-------------|--------------|
|**HTTP Header**       | Exact match based on both the name of a request header and its value. If no value is entered, any request containing the header name produces a match.|X-route-header=images|
|**Host**       | Exact Host name to match with.|example.com|
|**HTTP Method**       |Match based the type of request method.|GET, DELETE, POST, PUT |
|**Path**  | A URL path prefix. The format of the path entry is as follows: /pathprefix1/pathprefix2. The initial slash is required, the trailing slash is not.| /images |
|**Query String**        | Exact match based on both the name of the query and the single URL query value to match on. If there is no value, the match is to any request that contains the parameter.|?svc=images|

4. Select service targets from the **Service Target** pull down lists. You can also add more service targets by clicking on **Add Service Target**.

1. Assign a percentage of incoming requests that you want routed to each service target in the **Percent** field. All percentages must total 100.

{{< note >}}
Add a service target to use if no rule matches. Without a default target, non-matching requests are rejected.
{{</note >}}

### Configure Session Stickiness
Session stickiness controls how subsequent requests from the same user are routed. When enabled, subsequent requests by the same user to the same load balancer are sent to the same service target for the duration of the cookie, and as long as the target remains healthy. If the target is unhealthy, a different target is selected. When session stickiness is disabled, no session information is saved, and requests are routed in accordance with the algorithm and rules. Cloud Load Balancer supports session stickiness using load balancer generated cookies, or cookies from the origin.

If you are not using session stickiness, click **Add Rule**, to add this rule to the route.
Create or select additional rules. Once all rules are added, go to [Update the DNS](/docs/products/networking/cloud-load-balancer/get-started/#update-the-dns).

If you are using ssession stickiness, complete the following steps.

1. Enable **Use Session Stickiness** if you want to route subsequent requests from the same client to the same service target whenever possible.

    {{< note >}}
    The client must have cookies enabled. If the client has disabled cookies or deletes cookies, session stickiness is not preserved and each new request is routed in accordance with the chosen algorithm.
    {{< /note >}}
1. Select the **Cookie Type**, `Load Balancer Generated` or `Origin`.
    - If the **Cookie Type** is `Origin`, enter the `Cookie Key`. The `Cookie Key` is the cookie name used to obtain the cookie value from the downstream HTTP application.
    - If the **Cookie Type** is `Load Balancer Generated`, enter the **Stickiness TTL**. If the TTL is set to zero, the generated cookie is a session cookie only.
1. Click **Add Rule**, to add this rule to the route.
Create or select additional rules. Once all rules are added, continue with the next section.

### Configuration Details - Entry Point Protocol and Port
The entry point defines the port the load balancer listens on and the protocol used for routing incoming traffic to the service targets.

1. In the **Configuration** and **Details** area, select the **Protocol**. The protocol can be set to either TCP, HTTP, or HTTPS. See [Guides - Available Protocols](/docs/products/networking/cloud-load-balancer/guides/protocols/).

2. Enter the **Port** number Cloud Load Balancer listens on. For TCP, this can be any port from 1 through 1023, though it should be set to whichever port the client software connects to. For instance, web browsers use port 80 for HTTP traffic and port 443 for HTTPS traffic, though a client can change the port by specifying it as part of the URL.

1. Enter a unique name for this entry point in the **Configuration Label** field. If a label is not entered, a default value based on the selected protocol, or port number is used.

{{< note >}}
If the protocol used by this Load Balancer is TCP or HTTP, TLS termination certificates are not required. If the Load Balancer protocol is HTTPS, you will be directed to add certificates after the load balancer is created.
{{< /note >}}

4. If TLS certificates for this load balancer have been uploaded already, click **Apply Certificates**. In the *Apply Certificates* drawer, enter the host header for HTTPS that the load balancer responds to and select the certificate. Click **Save** to apply the TLS termination certificate.
## Upload TLS Certificates

## Update the DNS

After deploying your Load Balancer and putting your application behind Load Balancer, the application can now be accessed using the load balancer's public IPv4 and IPv6 addresses. Since most public-facing applications utilize domain names, you need to update any associated DNS records. The *A* record should use the load balancer's IPv4 address and the *AAAA* record (if you're using one) should use the load balancer's IPv6 address. See [Manage Load Balancers](/docs/products/networking/cloud-load-balancer/guides/manage/#review-and-edit-a-nodebalancer) to view your load balancer's IP addresses. For help changing the DNS records, consult your DNS provider's documentation. If you are using Linode's DNS Manager, see [Edit DNS Records](/docs/products/networking/dns-manager/guides/manage-dns-records/). Keep in mind that DNS changes can take up to 24 hours to fully propagate, though that typically happens much faster.

## Review and Create the Cloud Load Balancer

1. After you have configured the load balancers details, Service targets, Routes and TLS Certificates (for HTTPS only), click **Review Load Balancer**. The load balancer summary is displayed.

1. After reviewing the Load Balancer, you can **Edit** any of the components or click **Create Load Balancer**.