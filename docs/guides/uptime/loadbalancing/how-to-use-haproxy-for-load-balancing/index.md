---
slug: how-to-use-haproxy-for-load-balancing
title: "Using HAProxy for Load Balancing"
title_meta: "How to Use HAProxy for Load Balancing"
description: "HAProxy allows a webserver to spread incoming requests across multiple endpoints. Learn how to install and configure HAProxy on a Linode."
authors: ["Robert Hussey"]
contributors: ["Robert Hussey"]
published: 2017-10-30
modified: 2019-02-01
keywords: ["haproxy", "load balancing", "high availability"]
tags: ["proxy", "ecommerce", "media"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[HAProxy Documentation](http://www.haproxy.org/#docs)'
dedicated_cpu_link: true
aliases: ['/uptime/loadbalancing/how-to-use-haproxy-for-load-balancing/']
---

![HAProxy for Load Balancing](HAProxy.jpg)

## What is HAProxy?

HAProxy (High Availability Proxy) is a TCP/HTTP load balancer and proxy server that allows a webserver to spread incoming requests across multiple endpoints. This is useful in cases where too many concurrent connections over-saturate the capability of a single server. Instead of a client connecting to a single server that processes all of the requests, the client will connect to an HAProxy instance, which will use a reverse proxy to forward the request to one of the available endpoints, based on a load-balancing algorithm.

This guide will describe the installation and configuration of HAProxy for load-balancing HTTP requests, but the configuration can be adapted for most load-balancing scenarios. The setup is simplified from a typical production setup and will use a single HAProxy node with two web server nodes to service the requests forwarded from the HAProxy node.

## Before You Begin

1.  This guide will use `sudo` for commands that require administrative privileges. To get started, follow the steps in our [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to set up a standard user account, secure SSH access, and remove any unnecessary network services.

2.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

3.  This guide uses private IP addresses in the example configurations. To set up private IPs and enable internal networking between your Linodes, follow the steps in our [Linux Static IP Configuration](/docs/products/compute/compute-instances/guides/manual-network-configuration/) guide.

{{< note >}}
This guide is written for a non-root user. Commands requiring administrative privileges are prefixed with `sudo`. If you’re new to using `sudo`, refer to our [Users and Groups](/docs/guides/linux-users-and-groups/) guide for more information.
{{< /note >}}

## Installation

HAProxy is included in the package management systems of most Linux distributions:

- Ubuntu 17.04:

        sudo apt-get install haproxy

- Fedora 26:

        sudo yum install haproxy

## Initial Configuration

1.  Review the default configuration file located at `/etc/haproxy/haproxy.cfg`, which is generated automatically during installation. This file provides a basic setup without any load balancing configured:

    {{< file "/etc/haproxy/haproxy.cfg" aconf >}}
global
    log /dev/log    local0
    log /dev/log    local1 notice
    chroot /var/lib/haproxy
    stats socket /run/haproxy/admin.sock mode 660 level admin
    stats timeout 30s
    user haproxy
    group haproxy
    daemon

    # Default SSL material locations
    ca-base /etc/ssl/certs
    crt-base /etc/ssl/private

    # Default ciphers to use on SSL-enabled listening sockets.
    # For more information, see ciphers(1SSL). This list is from:
    #  https://hynek.me/articles/hardening-your-web-servers-ssl-ciphers/
    # An alternative list with additional directives can be obtained from
    #  https://mozilla.github.io/server-side-tls/ssl-config-generator/?server=haproxy
    ssl-default-bind-ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:RSA+AESGCM:RSA+AES:!aNULL:!MD5:!DSS
    ssl-default-bind-options no-sslv3

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    timeout connect 5000
    timeout client  50000
    timeout server  50000
    errorfile 400 /etc/haproxy/errors/400.http
    errorfile 403 /etc/haproxy/errors/403.http
    errorfile 408 /etc/haproxy/errors/408.http
    errorfile 500 /etc/haproxy/errors/500.http
    errorfile 502 /etc/haproxy/errors/502.http
    errorfile 503 /etc/haproxy/errors/503.http
    errorfile 504 /etc/haproxy/errors/504.http

{{< /file >}}


    The `global` section defines system-level parameters, such as file locations and the user and group that HAProxy runs under. Generally, no changes are needed in this section. During installation, both the **haproxy** user and **haproxy** group are  created automatically.

    The `defaults` section specifies additional logging parameters and options for handling timeouts and errors. By default, it logs both standard and error messages.

2.  To stop logging regular operation messages, add the following line after `option dontlognull`:

        option dontlog-normal

3.  You can also configure a separate log file for error messages using the following command:

        option log-separate-errors

## Configure Load Balancing

When configuring load balancing with HAProxy, you need to define two types of nodes: frontend and backend. The frontend node listens for incoming connections, while backend nodes handle the requests forwarded by HAProxy. A third node type, the stats node, can be set up to monitor the load balancer and the other two nodes.

1.  Open `/etc/haproxy/haproxy.cfg` in a text editor and add the following configuration for the frontend node:

    {{< file "/etc/haproxy/haproxy.cfg" aconf >}}
frontend haproxynode
    bind *:80
    mode http
    default_backend backendnodes

{{< /file >}}


    {{< note respectIndent=false >}}
Throughout this guide, replace `203.0.113.2` with the IP address of your frontend node. 192.168.1.3 and 192.168.1.4 will be used as the IP addresses for the backend nodes.
{{< /note >}}

    This configuration block specifies a frontend node named **haproxynode**, which is bound to all network interfaces on port 80. It will listen for HTTP connections (TCP mode can be used for other purposes) and direct traffic to the back end group, **backendnodes**.

2.  Add the back end configuration:

    {{< file "/etc/haproxy/haproxy.cfg" aconf >}}
backend backendnodes
    balance roundrobin
    option forwardfor
    http-request set-header X-Forwarded-Port %[dst_port]
    http-request add-header X-Forwarded-Proto https if { ssl_fc }
    option httpchk HEAD / HTTP/1.1\r\nHost:localhost
    server node1 192.168.1.3:8080 check
    server node2 192.168.1.4:8080 check

{{< /file >}}


    This defines **backendnodes** and specifies several configuration options:

      - The `balance` setting specifies the load-balancing strategy. In this example, the `roundrobin` strategy is used, which cycles through each server in turn. This strategy allows for assigning weights to servers, so those with higher weights receive more traffic.
      Other strategies include `static-rr`, which works like `roundrobin` but does not support dynamic weight adjustments, and `leastconn`, which routes requests to the server with the fewest active connections.
      - The `forwardfor` option ensures that the client's IP address is included in the forwarded request.
      - The first `http-request` line includes the client's original port in the forwarded request. The second `http-request` line adds the `proto` header with https if `ssl_fc`, a HAProxy system variable, is true. This happens when the initial connection is made over SSL/TLS.
      - `Option httpchk` specifies the health check HAProxy uses to determine if a web server is available for forwarding requests. If the server does not respond to the defined check, it will be excluded from load balancing until it passes the test.
      - The `server` lines define the server nodes and the IP addresses where requests will be forwarded. In this example, the servers are **node1** and **node2**, and each will use the defined health check.

3.  Add the optional stats node to the configuration:

    {{< file "/etc/haproxy/haproxy.cfg" aconf >}}
listen stats
    bind :32700
    stats enable
    stats uri /
    stats hide-version
    stats auth someuser:password

{{< /file >}}


    The HAProxy stats node is set to listen for connections on port 32700. It is configured to hide the HAProxy version and requires a password login. Replace `password` with a more secure password. It is recommended to disable stats login in production environments.

4.  Below is the complete configuration file after applying the modifications:

    {{< file "/etc/haproxy/haproxy.cfg" aconf >}}
global
    log /dev/log    local0
    log /dev/log    local1 notice
    chroot /var/lib/haproxy
    stats socket /run/haproxy/admin.sock mode 660 level admin
    stats timeout 30s
    user haproxy
    group haproxy
    daemon

    # Default SSL material locations
    ca-base /etc/ssl/certs
    crt-base /etc/ssl/private

    # Default ciphers to use on SSL-enabled listening sockets.
    # For more information, see ciphers(1SSL). This list is from:
    #  https://hynek.me/articles/hardening-your-web-servers-ssl-ciphers/
    # An alternative list with additional directives can be obtained from
    #  https://mozilla.github.io/server-side-tls/ssl-config-generator/?server=haproxy
    ssl-default-bind-ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:RSA+AESGCM:RSA+AES:!aNULL:!MD5:!DSS
    ssl-default-bind-options no-sslv3

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    timeout connect 5000
    timeout client  50000
    timeout server  50000
    errorfile 400 /etc/haproxy/errors/400.http
    errorfile 403 /etc/haproxy/errors/403.http
    errorfile 408 /etc/haproxy/errors/408.http
    errorfile 500 /etc/haproxy/errors/500.http
    errorfile 502 /etc/haproxy/errors/502.http
    errorfile 503 /etc/haproxy/errors/503.http
    errorfile 504 /etc/haproxy/errors/504.http

frontend haproxynode
    bind *:80
    mode http
    default_backend backendnodes

backend backendnodes
    balance roundrobin
    option forwardfor
    http-request set-header X-Forwarded-Port %[dst_port]
    http-request add-header X-Forwarded-Proto https if { ssl_fc }
    option httpchk HEAD / HTTP/1.1\r\nHost:localhost
    server node1 192.168.1.3:8080 check
    server node2 192.168.1.4:8080 check

listen stats
    bind :32700
    stats enable
    stats uri /
    stats hide-version
    stats auth someuser:password

{{< /file >}}


## Running and Monitoring

1.  Restart the HAProxy service to apply the new configuration:

        sudo service haproxy restart

Now, any incoming requests to the HAProxy node at IP address 203.0.113.2 will be forwarded to one of the backend nodes at 192.168.1.3 or 192.168.1.4, which will handle the HTTP requests. If either backend node fails the health check, it will be temporarily removed from service until it passes the test.

To view statistics and monitor node health, open a web browser and navigate to the frontend node's IP address or domain using the designated port, e.g., http://203.0.113.2:32700. This page displays statistics such as the number of requests each backend node has handled and the current and previous sessions handled by the frontend node.
