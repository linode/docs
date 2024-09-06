---
slug: getting-started-with-haproxy-part-2-http-load-balancing
title: "Getting Started With HAProxy Part 2: HTTP Load Balancing"
description: "Learn how to configure HAProxy for HTTP load balancing, with instructions on updating frontend and backend settings, path-based routing, and health checks."
authors: ["Tom Henderson"]
contributors: ["Tom Henderson"]
published: 2024-08-29
keywords: ['haproxy','http load balancing','http health checks','haproxy acl']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

[HAProxy](http://www.haproxy.org) is an intermediary gateway application that manages traffic between clients (frontends) and server resources (backends). It routes client requests to backend servers based on several options. These include round-robin rotation and health checks using TCP (Layer 4) or HTTP (Layer 7) protocols.

This guide is the second in a series on HAProxy. [Part One]() covered the basics of TCP network load balancing with HAProxy and provided steps to build a network using minimally configured Nanodes. The HAProxy node was set up as a TCP load balancer with both passive and active TCP health checks for its backend servers. Be sure to review Part One and complete those steps to set up your test network before starting this guide.

## Before You Begin

1.  Follow the instructions in [Getting Started with HAProxy Part One](/docs/guides/getting-started-with-haproxy-part-one-tcp-load-balancing/), specifically the [Before You Begin](/docs/guides/getting-started-with-haproxy-part-one-tcp-load-balancing/#before-you-begin) and [Install HAProxy](/docs/guides/getting-started-with-haproxy-part-one-tcp-load-balancing/#install-haproxy) sections.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

### Test Platform Build Review

The demonstration in Part One sets up HAProxy on one of three server platforms: Ubuntu 24.04 LTS, CentOS Stream 9, or openSUSE Leap 15.6. The HAProxy server acts as a gateway, handling inbound client frontend connections.

The backend consists of three Linode Marketplace WordPress servers, labeled `backend1`, `backend2`, and `backend3`. The WordPress servers are grouped as a backend pool, identified by their names and IP addresses.

WordPress is used to test the backend. HAProxy handles the frontend, directing traffic to the backend IP addresses of the three WordPress instances. This testbed provides an example of simple back-end server failure.

This guide shows how to set up frontend-backend HTTP logic matches and use HTTP health checks to ensure requests are routed to healthy servers. HTTP queries to backend servers permit HAProxy to match requests based on server health conditions as queried through http logic.

When a server fails, HAProxy continues to query it until it responds correctly and is marked as "up" again in the back-end pool. This setup allows HAPRoxy to maintain existing connections, preventing session loss for busy servers that temporarily fail to respond.

## Deploy Additional Backend Servers

The three WordPress backend server instances from [Getting Started With HAProxy Part One]() are used to demonstrate a path-based routing configuration. The servers, named `backend1`, `backend2`, and `backend3`, respond with their default homepages when accessed through the HAProxy gateway's IP address in a web browser.

To demonstrate path-based deterministic routing, modify the HAProxy configuration file to specify paths for web browsers to access the backend servers. Here, HAProxy examines incoming HTTP requests, identifies the path specified in the URL (e.g. `/backend1`), and routes the request to the appropriate back-end server. This configuration allows each backend server to be accessed through distinct paths. Successful routing is confirmed when the named back-end server responds correctly.

## Configure Path-based Routing in HAProxy

### Define Application Backends in HAProxy

Next, configure the backend instances and update the HAProxy configuration file to direct incoming frontend requests to the correct backend server.

HAProxy examines incoming HTTP requests, matches the request path or header to a specified string, and routes traffic to the corresponding backend server. If no match is found, HAProxy directs the request to a default backend server. Both directed and default routes can also be subject to health checks to ensure server availability.

The default homepage of each backend server should display the server's name at the top left corner, confirming correct routing.

### Methods of HTTP Redirection

HAProxy offers redirection based on logic statement configured on the frontend. This typically involves matching a client-sent header URL to a resource variable name. The inbound HTTP header contains data that links a frontend request to an associated backend service by matching the URL to specified variable name strings. The backend service can be an HTTP server, database, Node.js responder, or another destination of your choice. Once the logic matches, HAPRoxy connects the frontend with the backend resource to establish a direct path between the client and server.

### Define the Application Front Ends in HAProxy

In this example, HAProxy is used to direct URL requests to backend servers based on the incoming HTTP string.
Achieve this by using the frontend ACL (Access Control List) function to match the URL and client request. The HAProxy server from Part One uses a configuration file located at `/etc/haproxy/haproxy.conf`. This file allows HAProxy to select a backend server based on the incoming HTTP header.

The syntax for frontend ACL URL processing is:

```file {title="/etc/haproxy/haproxy.conf"}
frontend #Describes a condition for incoming header statements
ACL {{< placeholder "CHOSEN_VARIABLE_NAME" >}} {{< placeholder "URL_INPUT_STRING" >}} {{< placeholder "INBOUND_HTTP_REQUEST" >}}
```

Here, [URL processing](http://docs.haproxy.org/2.4/configuration.html#7.3.6-url) determines which backend resource is chosen based on the inbound HTTP header in a GET or POST request addressed to the frontend.

### Update the HAProxy Frontend

1.  To update the HAProxy configuration, edit the `/etc/haproxy/haproxy.cfg` file using a text editor such as `nano`.

    ```command
    nano /etc/haproxy/haproxy.conf
    ```

    Update the HAProxy configuration file to match the code below:

    ```file {title="/etc/haproxy/haproxy.cfg"}
    frontend http
      bind *:80
      mode http
      acl sample-page path_beg /index.php/sample-page/
      acl author-archive path_beg /index.php/author/admin/
      use_backend backend1 if sample-page
      use_backend backend2 if author-archive
      default_backend mybackend

    backend mybackend
      mode http
      server backend1 {{< placeholder "backend1_VLAN_IP_ADDRESS" >}}:80
      server backend2 {{< placeholder "backend2_VLAN_IP_ADDRESS" >}}:80
      server backend3 {{< placeholder "backend3_VLAN_IP_ADDRESS" >}}:80

    backend backend1
      mode http
      server backend1 {{< placeholder "backend1_VLAN_IP_ADDRESS" >}}:80

    backend backend2
      mode http
      server backend2 {{< placeholder "backend2_VLAN_IP_ADDRESS" >}}:80
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Open a web browser and access the HAProxy server’s IP address:

    ```command
    http://{{< placeholder "HAPROXY_SERVER_IP_ADDRESS" >}}
    ```

    {{< note >}}
    If your browser complains of no HTTPS/TLS certificate, ignore the warning or use the advanced settings to reach the site.
    {{< /note >}}

1.  Now connect to each individual backend server by changing the URL in your browser, like so:

    ```command
    http://{{< placeholder "HAPROXY_SERVER_IP_ADDRESS" >}}/server1
    ```

    ```command
    http://{{< placeholder "HAPROXY_SERVER_IP_ADDRESS" >}}/server2
    ```

    ```command
    http://{{< placeholder "HAPROXY_SERVER_IP_ADDRESS" >}}/server3
    ```

The ACL function evaluates incoming HTTP requests based on specified URL paths (`/server1`, `/server2`, `/server3`) and routes them to the corresponding backend server. [Other methods of evaluation](http://docs.haproxy.org/2.4/configuration.html) are available to direct frontend requests to the appropriate backend resources.

## HTTP Health Checks

In Part One, the HAProxy gateway was configured to test TCP and Layer 4 connectivity, marking servers as down when errors accumulate over time. HTTP health checks work similarly but use standard HTTP response codes to mark servers as down based on their performance over a specified interval.

Like TCP health checks, HTTP health checks continue to test a server marked as down to see if it begins to respond. If it starts responding correctly, the server is added back to the pool of active servers.

You can also configure HTTP health checks to look for specific values rather than standard HTTP response codes. This can be done using REGEX or simple text matches within the first 32 KB of the GET or POST reply from the backend server. For example, a string could match phrases like "Alive" or "Logged In" within a session.

### Basic HTTP Health Check

To monitor the health of backend servers, configure HAProxy to use the `check` directive within the `backend` section of your HAProxy configuration file:

```file {title="/etc/haproxy/haproxy.cfg"}
backend mybackend
    option httpchk GET /health
    server backend1 {{< placeholder "backend1_IP_ADDRESS" >}}:80 check
    server backend2 {{< placeholder "backend2_IP_ADDRESS" >}}:80 check
    server backend3 {{< placeholder "backend3_IP_ADDRESS" >}}:80 check
```

Using the `check` option, standard responses from the server in the `200`-`399` range indicate to HAProxy that the server is healthy. Meanwhile, responses in the `400`-`500` range mark the server as down and removes it from the active pool until it recovers.

### Configuring String-based HTTP Health Checks

The HTTP health check can query and match specific strings in the backend server's responses. However, only the first 16 KB of the response is examined. If headers are lengthy or include large elements like inline graphics, the desired string might be missed if it’s not within this limit.

The `http-check` directive checks a server response three times before marking the server as down. The code below configures HAProxy to check that a response was returned "OK":

```file {title="/etc/haproxy/haproxy.cfg"}
backend our_test
  option httpchk
  http-check expect string OK
  server backend1 {{< placeholder "backend1_IP_ADDRESS" >}}:80 check
  server backend2 {{< placeholder "backend2_IP_ADDRESS" >}}:80 check
  server backend3 {{< placeholder "backend3_IP_ADDRESS" >}}:80 check
```

You can adjust this string to match any other server response that indicates a healthy state.

## Test Load Balancing Functionality and Verify Health Checks

To ensure that your HAProxy configuration file is functioning correctly, perform a syntax check with the following command:

```command
haproxy -c /etc/haproxy/haproxy.cfg
```

An error message is returned if the configuration file has logical or syntax errors. When the check is complete, each error is listed one per line. This command only verifies the syntax and basic logic of the configuration, it does not guarantee that the configuration works as intended when running.

The logs are stored in different locations based on the Linux distribution HAProxy is installed on:

-   **Ubuntu and openSUSE Leap**: HAProxy hosts, HAProxy logs are typically located at `/var/log/haproxy.log`.
-   **CentOS Stream**: HAProxy runs as a service managed by `systemctl`, with logs directed to a file specified during and `rsyslog` configuration. Refer to the [rsyslog configuration](https://www.server-world.info/en/note?os=CentOS_Stream_9&p=haproxy&f=1) for exact log locations.

The functionality of your HAPRoxy configuration depends on how you configure your frontend and backend resources. Complex sites may involve multiple configuration option to optimize traffic handling and health checks. To better understand traffic handling and diagnosing issues, review the [HAProxy logs](http://docs.haproxy.org/2.4/configuration.html#8). These logs are clearly defined for sorting purposes, and follow one of five different formats, including a custom option.

### Testing Load Balancing


1.  **Alter the Load Balancinng Method**: Modify the load balancing algorithm in the HAProxy configuration file (e.g. round-robin, least connections) to test how traffic is distributed among the servers.

1.  **Simulate a Server Failure**: Manually power off a backend server from the Cloud Manager to see if HAProxy correctly identifies and marks it as down.

1.  **Monitor HAProxy's Response**: After inducing the error, HAProxy typically attempts three health checks before marking the server as down. Check the logs or [HAPRoxy's statistics page](https://www.haproxy.com/blog/exploring-the-haproxy-stats-page) to verify that the server is correctly marked as down.

1.  **Verify Load Redistribution**: Once a server is marked down, HAProxy should automatically redistribute the incoming traffic to the remaining healthy servers. Test this by sending traffic through the load balancer and ensuring requests are being handled by the active backend servers.

This process helps ensure that your HAProxy configuration responds correctly to server failures and continues to route traffic efficiently.

### Verifying Health Checks

There are several methods to test both active and passive health checks:

1.  **Simulate Backend Server Failure**: Shut down a backend server or stop its Apache `httpd` service to simulate a failure. This should trigger the health checks.

1.  **Refresh the Client Browser**: Refresh the browser where the client request is made. HAProxy reroutes the request to an available backend server based on the URL path. If no servers are available, HAProxy should return an HTTP `400` or `500` error.

1.  **Monitor Logs**: Use the log aggregators like FluentD or other syslog tools to monitor HAProxy and backend server logs. This helps confirm the health responses and backend server status.

1.  **Verify Database Connectivity**: In a WordPress setup with MySQL/MariaDB, verify the database connection as art of the health check process. Database disconnections can also be a point of failure that needs monitoring.

1.  **Use Third-Party Plugins**: Consider third-party plugins and tools that integrate with HAProxy to monitor specific applications, databases, or message bus systems for additional health check insights.