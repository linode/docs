---
title: "Available Protocols"
description: "Learn about each of the protocols that are available on Cloud Load Balancer as well as the features and performance they offer."
published: 2023-10-06
authors: ["Akamai"]
---

Each port configured on a Cloud Load Balancer must use one of the following available protocols. The protocol that's selected can determine the performance of your Load Balancer, the settings available to you, and how to configure the routes and service targets.

- [TCP](#tcp)
- [HTTP](#http)
- [HTTPS](#https)

## TCP

This mode acts as a TCP pass-through by forwarding all TCP requests to the service targets. It provides the most flexibility when compared to other protocol choices. TCP has the least amount of overhead, and it is also more performant. The TCP operates on the transport layer and supports any higher-layer protocol built on top of TCP/IP.
- Supports HTTP, HTTPS, SSH, SMTP, FTP, DNS, and other application layer protocols
- Operates on the transport layer (layer 4 of the OSI model)
- Since the Cloud Load Balancer serves as a pass-through, encrypted traffic is preserved and must be decrypted on the service targets.

## HTTP

Application layer  protocol for transferring unencrypted web traffic. When the HTTP protocol is selected, the HTTP incoming request is terminated on the load balancer and a new request is sent to the service targets.
Additional HTTP functionality:
- Supports HTTP/1.1 and HTTP/2
- Supports the HTTP Cookie session stickiness
- Adds the X-Forwarded-For HTTP header to preserve the client IP address and the X-Forwarded-Proto HTTP header to preserve the original protocol.
- Operates on the application layer (layer 7 of the OSI model)

### HTTP/1.1 Connections

Cloud Load Balancer reuses TCP connections to endpoints in order to maximize performance. Consider the following if the connection between Cloud Load Balancer and the endpoint uses HTTP/1.1.

HTTP Connection headers specify if the HTTP/1.1 connection between the load balancer and endpoint remains open or closes after a response is delivered.

#### Connection: keep-alive

When the connection header is `keep-alive`, the HTTP/1.1 connection persists and remains open. This is the default setting for HTTP/1.1.

#### Connection: close

When the connection header is `close`, the HTTP/1.1 connection closes after the response is delivered.

The `Connection: close` header, also disables the functionality that the load balancer uses to keep the TCP connection to the endpoint open.

If the load balancer learns that the connection to the endpoint is closed, either from keepalive messages, or from header responses, it establishes a new connection when it receives another request.  If the load balancer isn’t aware that the connection is closed, a new connection isn't established and the client sending the request receives a 503 Service Unavailable error.

To avoid this error, always return the `Connection: close` response header before closing connections or use HTTP/2 connections to the service target endpoint. The HTTP Connection header is not a valid header for HTTP/2.

## HTTPS

**HTTPS:** Contains the same functionality and support as the HTTP protocol, but requests between the client’s machine and Load Balancer are encrypted using the TLS (or SSL) protocol. Since encrypted HTTPS requests are terminated on Load Balancer, you must add your TLS/SSL certificate to the Load Balancer itself (instead of your service targets). Once the HTTPS request is decrypted, the load balancer sends unencrypted HTTP requests to the service targets over the private network. Additional HTTPS functionality:
- Same core functionality as [HTTP](#http).
- Supports TLS v1.2 and v1.3 (NA for Internal Beta).
- Requires a compatible TLS/SSL certificate and the associated private key.