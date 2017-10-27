---
author:
  name: Linode Community
  email: docs@linode.com
description: 'A guide describing how to install and configure HAProxy for TCP/HTTP load balancing'
keywords: 'haproxy,load balancing,high availability'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Friday, September 15th, 2017'
modified: Friday, September 15th, 2017
modified_by:
  name: Linode
title: 'Load Balancing using HAProxy'
contributor:
  name: Robert Hussey
  link: https://github.com/hussrj
  external_resources:
- '[HAProxy Documentation](http://www.haproxy.org/#docs)'
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*
----

## Introduction
HAProxy (High Availability Proxy) is a TCP/HTTP load balancer and proxy server that allows for spreading incoming requests across multiple endpoints. This is useful in cases where too many concurrent connections could over-saturate the capability of a single server. Instead of a client connecting to a single server which also processes their requests, the client will connect to an HAProxy instance which will use a reverse proxy to forward the request to one of the available endpoints based on the configured load-balancing algorithm.

This guide will describe the installation and configuration of HAProxy for load balancing HTTP requests but the configuration can be adapted for most load balancing scenarios. The setup is simplified from a typical production setup and will use a single HAProxy node with two web server nodes which will service the requests forwarded from the HAProxy node.

## Before You Begin

1.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. 

2.  Update your system:

        sudo apt-get update && sudo apt-get upgrade
        
3. This guide uses private IP addresses in the example configurations. Refer to our [Linux Static IP Configuration](/docs/networking/linux-static-ip-configuration) guide to add private IP addresses and internally network your Linodes.

{: .note}
>
> This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Installation
Most linux distributions have available HAProxy in the package management system.

### Ubuntu 17.04
    sudo apt-get install haproxy
### Fedora 26
    sudo yum install haproxy

## Initial Configuration

HAProxy installs a default configuration file at /etc/haproxy/haproxy.cfg. This default configuration defines a standard setup without any load-balancing to be performed:

{: .file }
/etc/haproxy/haproxy.cfg
:   ~~~ conf
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
    ~~~

The global section defines system level parameters such as file locations and the user and group under which HAProxy is executed. It's unlikely you will need to change anything in this section. The user 'haproxy' and group 'haproxy' are both created during installation.

The default section defines additional logging parameters and options related to timeouts and errors. By default, both normal and error messages will be logged. If you wish to disable normal operation messages from being logged you can add the following after 'option dontlognull':

    option dontlog-normal

Or you can have the error logs in a separate log file using the following option:

    option log-separate-errors
    
## Configuring Load Balancing

When configuring load balancing using HAProxy there are two types of nodes which will need to be defined: frontend and backend. The frontend is the node in which HAProxy listens for connections. The backend is a node to which HAProxy can forward requests. A third option node is the stats node which can be used to monitor the load balancer and the defined nodes.

The configuration for the nodes is to be appended to the /etc/haproxy/haproxy.cfg file. First the frontend:

{: .file-excerpt }
/etc/haproxy/haproxy.cfg
:   ~~~ conf
    frontend haproxynode
        bind *:80
        mode http
        default_backend backendnodes
    ~~~

{: .note}
>
> For the purposes of this guide we will assume the frontend has external IP address 203.0.113.2.

Here we have a frontend node named 'haproxynode' which is bound to all network interfaces on port 80. It will listen for HTTP connections (it is possible instead to use tcp mode for other purposes) and it will use the backend named 'backendnodes'.

Next the backend configuration:

{: .file-excerpt }
/etc/haproxy/haproxy.cfg
:   ~~~ conf
    backend backendnodes
        balance roundrobin
        option forwardfor
        http-request set-header X-Forwarded-Port %[dst_port]
        http-request add-header X-Forwarded-Proto https if { ssl_fc }
        option httpchk HEAD / HTTP/1.1\r\nHost:localhost
        server node1 192.168.1.3:8080 check
        server node2 192.168.1.4:8080 check
    ~~~

We define the backend named 'backendnodes' using the roundrobin strategy for load balancing. This strategy uses each server in turn but allows for weighting servers to allow for certain servers to be used more frequently. Other strategies include 'static-rr' which is like 'roundrobin' but with no support for weights as well as 'leastconn' which will forward requests to the server with the lowest number of connections. Our configuration also uses the 'forwardfor' option to ensure the forwarded request includes the actual client IP address. The http-request parameters allow the forwarded request to include the port of the client HTTP request and to include the proto header containing https if ssl_fc, a HAProxy system variable, returns true which will be the case if the connection was first made via an SSL/TLS transport layer. The option httpchk defines the check HAProxy uses to test if a web server is still valid for forwarding request. If the server does not respond to the defined request it will not be used for load balancing until it once again passes the test. Finally, the server lines define the actual server nodes and their IP addresses to which IP addresses will be forwarded. Here we have defined both 'node1' and 'node2', each of which will use the health check we have defined.

Now let's add the optional stats node to our configuration:

{: .file-excerpt }
/etc/haproxy/haproxy.cfg
:   ~~~ conf
    listen stats
        bind :32700
        stats enable
        stats uri /
        stats hide-version
        stats auth someuser:password
    ~~~

Our HAProxy stats node will listen on port 32500 for connections and is configured to hide the version of HAProxy as well as allow only the defined user 'someuser' to login with password 'password'. Obviously this should be changed to a more secure password and it is recommended to disable stats login in production.

Here is the full configuration file after our modifications:

{: .file }
/etc/haproxy/haproxy.cfg
:   ~~~ conf
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
    ~~~

## Running and Monitoring

With HAProxy configured we must now restart the HAProxy service:

    sudo service haproxy restart

Now any incoming requests to the HAProxy node at IP address 203.0.113.2 will be forwarded to an internally networked node with IP address 192.168.1.3 or 192.168.1.4. These backend nodes are the ones which will actually service the HTTP requests which are forwarded to them from the frontend node. If either of these nodes fail the health check which we have defined then they will not be used to service any requests until they pass the test once again.

In order to view statistics and monitor the health of the nodes, load the IP address or fully qualified domain name of the frontend node in a web browser with the defined port supplied, e.g. http://203.0.113.2:32700. This will display statistics such as the number of times a request was forwarded to a particular node as well the number of sessions currently being serviced and previously serviced by the frontend node.

## More Information

If you would like to read more in-depth information related to load balancing using HAProxy, the [HAProxy documentation page](http://www.haproxy.org/#docs) provides links to starter guides and configuration documentation for current and archived versions of HAProxy.

