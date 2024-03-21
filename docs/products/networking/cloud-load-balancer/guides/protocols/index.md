---
title: "Available Protocols"
description: "Learn about each of the protocols that are available on Cloud Load Balancer as well as the features and performance they offer."
published: 2023-10-06
authors: ["Akamai"]
---

Each port configured on a Cloud Load Balancer must use one of the following available protocols. The protocol that's selected can determine the performance of your Load Balancer, the settings available to you, and how to configure the backend machines.

- [TCP](#tcp)
- [HTTP](#http)
- [HTTPS](#https)

## TCP

This mode acts as a TCP pass-through by forwarding all TCP requests to the service targets. It provides the most flexibility when compared to other protocol choices. TCP has the least amount of overhead, and it is also more performant. The TCP operates on the transport layer and supports any higher-layer protocol built on top of TCP/IP.
- Supports HTTP, HTTPS, SSH, SMTP, FTP, DNS, and other application layer protocols
- Operates on the transport layer (layer 4 of the OSI model)
- Since the Cloud Load Balancer serves as a pass-through, encrypted traffic is preserved and must be decrypted on the service targets.
- Proxy Protocol support?

## HTTP

Application layer  protocol for transferring unencrypted web traffic. When the HTTP protocol is selected, the HTTP incoming request is terminated on the load balancer and a new request is sent to the service targets.
Additional HTTP functionality:
- Supports HTTP/1.1 and HTTP/2
- Supports the HTTP Cookie session stickiness
- Adds the X-Forwarded-For HTTP header to preserve the client IP address and the X-Forwarded-Proto HTTP header to preserve the original protocol (http or https)?
- Keep-Alive HTTP Headers are disabled?
- Operates on the application layer (layer 7 of the OSI model)

## HTTPS

**HTTPS:** Contains the same functionality and support as the HTTP protocol, but requests between the client’s machine and Load Balancer are encrypted using the TLS (or SSL) protocol. Since encrypted HTTPS requests are terminated on Load Balancer, you must add your TLS/SSL certificate to the Load Balancer itself (instead of your service targets). Once the HTTPS request is decrypted, the load balancer sends unencrypted HTTP requests to the service targets over the private network. Additional HTTPS functionality:
- Same core functionality as [HTTP](#http)
- Supports TLS v1.2 and v1.3 (NA for Internal Beta)
- Requires a compatible TLS/SSL certificate and the associated private key
- Has the most overhead of all the protocol options, which means that it is less performant and accommodates fewer connections per second