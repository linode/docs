---
title: "HTTP/1.1 Connections"
description: "503 Service Unavailable error."
published: 2023-07-06
authors: ["Akamai"]
---

## HTTP/1.1 Connections

Cloud Load Balancer reuses TCP connections to endpoints in order to maximize performance. Consider the following if the connection between Cloud Load Balancer and the endpoint uses HTTP/1.1.

HTTP Connection headers specify if the HTTP/1.1 connection between the load balancer and endpoint remains open or closes after a response is delivered.

### Connection: keep-alive

When the connection header is `keep-alive`, the HTTP/1.1 connection persists and remains open. This is the default setting for HTTP/1.1.

### Connection: close

When the connection header is `close`, the HTTP/1.1 connection closes after the response is delivered.

The `Connection: close` header, also disables the functionality that the load balancer uses to keep the TCP connection to the endpoint open.

If the load balancer learns that the connection to the endpoint is closed, either from keepalive messages, or from header responses, it establishes a new connection when it receives another request.  If the load balancer isn’t aware that the connection is closed, a new connection isn't established and the client sending the request receives a 503 Service Unavailable error.

To avoid this error, always return the `Connection: close` response header before closing connections, or use HTTP/2 connections to the service target endpoint. The HTTP Connection header is not a valid header for HTTP/2.