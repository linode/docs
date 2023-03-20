---
title: "Available Protocols"
description: "Learn about each of the protocols that are available on NodeBalancers as well as the features and performance they offer."
published: 2022-10-07
authors: ["Linode"]
---

Each port configured on a NodeBalancer must use one of the following available protocols. The protocol that's selected can determine the performance of your NodeBalancer, the settings available to you, and how to configure the backend machines.

- [TCP](#tcp)
- [HTTP](#http)
- [HTTPS](#https)

## TCP

This mode acts as a TCP pass-through by forwarding all TCP requests to the backend machines. As such, it provides the most flexibility when compared to other protocol choices. Since it has the least amount of overhead, it is also more performant and
can service a high number of connections per second. The TCP protocol operates on the transport layer and supports any higher-layer protocol built on top of TCP/IP.

- Supports HTTP, HTTPS, SSH, SMTP, FTP, DNS, and other application layer protocols
- Can preserve client IP address details by using [Proxy Protocol](/docs/products/networking/nodebalancers/guides/proxy-protocol/)
- Operates on the transport layer (layer 4 of the OSI model)

## HTTP

When the HTTP protocol is selected, the HTTP request is terminated on the NodeBalancer and a new request is sent to the backend machines. While this does add some overhead, it enables features like HTTP cookie session stickiness.

- Supports HTTP/1.1 (not HTTP/2 or higher)
- Supports the HTTP Cookie session stickiness method (in addition to other methods)
- Adds the [X-Forwarded-For](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For) HTTP header to preserve the client IP address and the [X-Forwarded-Proto](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto) HTTP header to preserve the original protocol (`http` or `https`).
- [Keep-Alive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive) HTTP Headers are disabled
- Operates on the application layer (layer 7 of the OSI model)

## HTTPS

HTTPS protocol contains the same functionality and support as the HTTP protocol, but requests between the client's machine and the NodeBalancer are encrypted using the TLS (or SSL) protocol. Since encrypted HTTPS requests are terminated on the NodeBalancer, you must add your TLS/SSL certificate to the NodeBalancer itself (instead of your backend machines). Once the HTTPS request is decrypted, the NodeBalancer sends unencrypted HTTP requests to the backend machines.

- Same core functionality as [HTTP](#http)
- Supports TLS v1.2 and v1.3
- Requires a compatible TLS/SSL certificate and the associated private key
- HTTPS requests are terminated and decrypted on the NodeBalancer and traffic to the backend machines is *not* encrypted.
- Has the most overhead of all the protocol options, which means that it is less performant and accommodates fewer connections per second.