---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide shows how to install and configure HAProxy for TCP/HTTP load balancing.'
og_description: 'HAProxy (High Availability Proxy) is a TCP/HTTP load balancer and proxy server that allows a webserver to spread incoming requests across multiple endpoints. This guide shows how to install and configure HAProxy on a Linode.'
keywords: ["haproxy", "load balancing", "high availability"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-10-30
modified: 2017-11-01
modified_by:
  name: Linode
title: 'How to Use HAProxy for Load Balancing'
contributor:
  name: Robert Hussey
  link: https://github.com/hussrj
external_resources:
- '[HAProxy Documentation](http://www.haproxy.org/#docs)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

---

![HAProxy for Load Balancing](/docs/assets/haproxy/HAProxy.jpg)

## What is HAProxy?

HAProxy (High Availability Proxy) is a TCP/HTTP load balancer and proxy server that allows a webserver to spread incoming requests across multiple endpoints. This is useful in cases where too many concurrent connections over-saturate the capability of a single server. Instead of a client connecting to a single server which processes all of the requests, the client will connect to an HAProxy instance, which will use a reverse proxy to forward the request to one of the available endpoints, based on a load-balancing algorithm.

This guide will describe the installation and configuration of HAProxy for load-balancing HTTP requests, but the configuration can be adapted for most load-balancing scenarios. The setup is simplified from a typical production setup and will use a single HAProxy node with two web server nodes which will service the requests forwarded from the HAProxy node.

## Before You Begin

1.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access and remove unnecessary network services.

2.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

3.  This guide uses private IP addresses in the example configurations. Refer to our [Linux Static IP Configuration](/docs/networking/linux-static-ip-configuration) guide to add private IP addresses and internally network your Linodes.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Installation

HAProxy is included in the package management systems of most Linux distributions:

- Ubuntu 17.04:

      sudo apt-get install haproxy

- Fedora 26:

      sudo yum install haproxy

## Initial Configuration

1.  Review the default configuration file at `/etc/haproxy/haproxy.cfg`, which is created automatically during installation. This file defines a standard setup without any load balancing:

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


    The `global` section defines system level parameters such as file locations and the user and group under which HAProxy is executed. In most cases you will not need to change anything in this section. The user **haproxy** and group **haproxy** are both created during installation.

    The `defaults` section defines additional logging parameters and options related to timeouts and errors. By default, both normal and error messages will be logged.

2.  If you wish to disable normal operation messages from being logged you can add the following after `option dontlognull`:

        option dontlog-normal

3.  You can also choose to have the error logs in a separate log file:

        option log-separate-errors

## Configure Load Balancing

When you configure load balancing using HAProxy, there are two types of nodes which need to be defined: frontend and backend. The frontend is the node by which HAProxy listens for connections. Backend nodes are those by which HAProxy can forward requests. A third node type, the stats node, can be used to monitor the load balancer and the other two nodes.

1.  Open `/etc/haproxy/haproxy.cfg` in a text editor and append the configuration for the front end:

    {{< file-excerpt "/etc/haproxy/haproxy.cfg" aconf >}}
frontend haproxynode
    bind *:80
    mode http
    default_backend backendnodes

{{< /file-excerpt >}}


    {{< note >}}
Throughout this guide, replace `203.0.113.2` with the IP address of your frontend node. 192.168.1.3 and 192.168.1.4 will be used as the IP addresses for the backend nodes.
{{< /note >}}

    This configuration block specifies a frontend node named **haproxynode**, which is bound to all network interfaces on port 80. It will listen for HTTP connections (it is possible to use TCP mode for other purposes) and it will use the back end **backendnodes**.

2.  Add the back end configuration:

    {{< file-excerpt "/etc/haproxy/haproxy.cfg" aconf >}}
backend backendnodes
    balance roundrobin
    option forwardfor
    http-request set-header X-Forwarded-Port %[dst_port]
    http-request add-header X-Forwarded-Proto https if { ssl_fc }
    option httpchk HEAD / HTTP/1.1\r\nHost:localhost
    server node1 192.168.1.3:8080 check
    server node2 192.168.1.4:8080 check

{{< /file-excerpt >}}


    This defines **backendnodes** and specifies several configuration options:

      - The `balance` setting specifies the load-balancing strategy. In this case, the `roundrobin` strategy is used. This strategy uses each server in turn but allows for weights to be assigned to each server: servers with higher weights are used more frequently.
      Other strategies include `static-rr`, which is similar to `roundrobin` but does not allow weights to be adjusted on the fly; and `leastconn`, which will forward requests to the server with the lowest number of connections.
      - The `forwardfor` option ensures the forwarded request includes the actual client IP address.
      - The first `http-request` line allows the forwarded request to include the port of the client HTTP request. The second adds the proto-header containing https if `ssl_fc`, a HAProxy system variable, returns true. This will be the case if the connection was first made via an SSL/TLS transport layer.
      - `Option httpchk` defines the check HAProxy uses to test if a web server is still valid for forwarding requests. If the server does not respond to the defined request it will not be used for load balancing until it passes the test.
      - The `server` lines define the actual server nodes and their IP addresses, to which IP addresses will be forwarded. The servers defined here are **node1** and **node2**, each of which will use the health check you have defined.

3.  Add the optional stats node to the configuration:

    {{< file-excerpt "/etc/haproxy/haproxy.cfg" aconf >}}
listen stats
    bind :32700
    stats enable
    stats uri /
    stats hide-version
    stats auth someuser:password

{{< /file-excerpt >}}


    The HAProxy stats node will listen on port 32700 for connections and is configured to hide the version of HAProxy as well as to require a  password login. Replace `password` with a more secure password. In addition, it is recommended to disable stats login in production.

4.  Here is the complete configuration file after modifications:

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

1.  Restart the HAProxy service so that the new configuration can take effect:

        sudo service haproxy restart

Now, any incoming requests to the HAProxy node at IP address 203.0.113.2 will be forwarded to an internally networked node with an IP address of either 192.168.1.3 or 192.168.1.4. These backend nodes will serve the HTTP requests. If at any time either of these nodes fails the health check, they will not be used to serve any requests until they pass the test.

In order to view statistics and monitor the health of the nodes, navigate to the IP address or domain name of the frontend node in a web browser at the assigned port, e.g., http://203.0.113.2:32700. This will display statistics such as the number of times a request was forwarded to a particular node as well the number of current and previous sessions handled by the frontend node.
