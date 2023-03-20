---
title: "Client's IP Address Pass-through"
description: "Learn the methods of retaining client connection details and passing them to backend nodes on a NodeBalancer"
published: 2022-10-07
authors: ["Linode"]
---

In some applications, it's helpful (or required) to know the IP address where the request originally came from, referred to as the client IP. When a NodeBalancer routes traffic to a backend node, the originating IP address becomes the NodeBalancer's private IP address. This means that the client IP's address is not visible in the location that the application might typically check. To overcome this, there are a few ways to pass the client's IP address to the backend nodes. The method you select depends on the protocol the NodeBalancer's port is using.

- **Proxy Protocol**: This method works for the TCP protocol, provided the backend application also supports it. See [Proxy Protocol](/docs/products/networking/nodebalancers/guides/proxy-protocol/).
- **HTTP Headers:** This method works for the HTTP and HTTPS protocols and is discussed below.

## HTTP Headers (Using HTTP or HTTPS Protocols)

NodeBalancers add an X-Forwarded-For (XFF) HTTP header field, which allows your nodes to identify a client's originating IP address. This is useful for logging purposes. Here's an example XFF HTTP header:

    X-Forwarded-For: 196.180.44.172

You'll need to configure your web server software to use the XFF header.

### Apache

If you're using the Apache web server, you can use the `mod_rpaf` to replace `REMOTE_ADDR` with the clent's IP address in the XFF header. After you install the module, you'll need to specify 192.168.255.0/24 as a proxy in `httpd.conf`.

### Nginx

If you're using the Nginx web server, you can add the following lines to your Nginx configuration file:

    real_ip_header X-Forwarded-For;
    set_real_ip_from 192.168.255.0/24;

This will allow Nginx to capture the client's IP address in the logs.