---
title: Using Proxy Protocol with NodeBalancers
description: "Learn how to enable and use Proxy Protocol on your NodeBalancer to send client connection details to the backend nodes."
keywords: ["nodebalancers", "nodebalancer", "load balancers", "load balancer", "load balancing", "high availability", "ha", "proxy protocol", "proxy"]
tags: ["cloud manager","linode platform","networking","web applications"]
published: 2022-10-07
modified_by:
  name: Linode
image: ProxyProtocol_NodeBalancers.png
aliases: ['/platform/nodebalancer/nodebalancer-proxypass-configuration/','/guides/nodebalancer-proxypass-configuration/']
authors: ["Linode"]
---

When a Linode NodeBalancer passes a request from a client to a backend Node, information regarding the original client is not included by default. While this is fine for many environments, your applications may require original client information such as IP address or port. For these cases, Linode NodeBalancers support **Proxy Protocol** for TCP connections so that you can pass client information to backend Nodes.

## What is Proxy Protocol

Proxy Protocol is an internet protocol for various high availability and load balancing solutions to carry information about a client directly to backend servers.

When selecting **TCP** as your NodeBalancer protocol, you can enable **Proxy Protocol** to add a header containing client information to backend Nodes.

{{< note >}}
[Backend Nodes](#configure-backend-node-proxy-protocol) must also have Proxy Protocol enabled on supported applications to receive the client information header.

Additional configuration options may need to be enabled on the application or service to accommodate traffic between the node and the NodeBalancer, including allowing IPv6 and/or IPv4 traffic, and enabling traffic on all necessary ports.
{{< /note >}}

Currently, there are two available versions of Proxy Protocol, **v1** and **v2**:

- **v1**: Proxy Protocol v1 adds a human readable string to all requests, similar to the following:

    ```output
    PROXY TCP4 192.0.2.0 203.0.113.0 56147 80
    ```

    The syntax for this output is as follows:

        PROXY, PROTOCOL, CLIENT_IP, NODEBALANCER_IP, CLIENT ORIGIN PORT, NODEBALANCER PORT

- **v2**: Proxy Protocol v2 adds a more efficient binary data header to all requests, similar to the following:

    ```output
    \r\n\r\n\x00\r\nQUIT\n!\x11\x00\x0c\xach\x11\x05\xcf\xc0D8\xfe\x1e\x04\xd2
    ```

More information on **v1** and **v2** is available in the [Proxy Protocol Specification](http://www.haproxy.org/download/1.8/doc/proxy-protocol.txt).

## Configure Proxy Protocol

In order to make use of Proxy Protocol, it needs to be configured on the NodeBalancer as well as each backend node Compute Instance.

### Configure the NodeBalancer

To enable Proxy Protocol for your NodeBalancer, follow the instructions below.

1.  Log in to the [Cloud Manager](http://cloud.linode.com), click **NodeBalancers** in the left menu, and select the NodeBalancer you wish to edit. See [Manage NodeBalancers](/docs/products/networking/nodebalancers/guides/manage/).

1.  Navigate to the **Configurations** tab and open the port configuration you wish to edit.

1.  Ensure that the **Protocol** option is set to *TCP*, which makes the **Proxy Protocol** dropdown menu appear. Select the desired Proxy Protocol version.

1.  Click the **Save** button on the bottom of the page to Save your changes.

### Configure the Backend Nodes

Once Proxy Protocol is configured for your NodeBalancer, ensure that it is also enabled for the receiving software on your backend Nodes. You can find a list of compatible software in the [Proxy Protocol documentation](https://www.haproxy.com/blog/haproxy/proxy-protocol/). Here are links to guidance for enabling Proxy Protocol for common software:

-   [NGINX](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/)
-   [Apache](https://httpd.apache.org/docs/2.4/mod/mod_remoteip.html)
-   [MySQL/MariaDB](https://mariadb.com/kb/en/proxy-protocol-support/)
