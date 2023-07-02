---
slug: introducing-http-2
description: 'This guide provides a brief introduction to HTTP/2, compares it with the original HTTP specification, and explains why you should use it.'
keywords: ['http2 vs http1']
tags: ['web server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-16
modified_by:
  name: Linode
title: "An Introduction to HTTP/2"
title_meta: "HTTP/2 vs. HTTP/1.1: Why You Should Use HTTP/2"
authors: ["Jeff Novotny"]
---

[*HTTP/2*](https://en.wikipedia.org/wiki/HTTP/2) (also known as HTTP 2) updates and expands the original Hypertext Transfer Protocol (HTTP) implementation. HTTP/2 is designed to improve throughput and latency while maintaining backward compatibility with earlier versions. Because HTTP/2 offers many advantages and no real disadvantages when compared to HTTP/1.1, web servers and clients should use the new version. This guide provides an introduction to HTTP/2, compares it with the original HTTP specification, and explains why you should use it.

## Understanding the HTTP/2 Protocol

HTTP/2 builds on version 1.1 of the [*Hypertext Transfer Protocol*](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) (HTTP) in a way that is transparent to users and developers. HTTP/2 still serves the same role, functioning as the application layer protocol that is the foundation of the internet. It continues to support all significant World Wide Web use cases, such as mobile and desktop browsers, web servers, and proxies. HTTP/2 uses the [*Transmission Control Protocol*](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) (TCP) as its transport mechanism, as the first version did.

HTTP/2 is derived from Google's [*SPDY protocol*](https://en.wikipedia.org/wiki/SPDY) and was fully approved in 2015. It was adopted relatively quickly by most browsers, including Firefox, Internet Explorer, Edge, Chrome, and Safari. Over 50% of the top 10 million websites currently support HTTP/2, which has already become the consensus standard.

The main rationale for HTTP/2 is to increase speed and decrease latency. Many of its most significant changes involve how messages are transmitted. HTTP/2 introduces the concept of a stream, a bidirectional flow that can transmit one or more messages. This allows for the multiplexing of individual messages.

The addition of multiplexed streams partially fixes some existing issues, such as the head-of-line blocking problem. This complication occurs when a delayed or missing packet blocks subsequent packets. While the new changes solve the problem at the application layer, the problem can still occur at the TCP transport level. In some cases, multiplexing only moves the problem around. Although HTTP/2 supports both encrypted and unencrypted traffic, most clients enforce data encryption. In practical terms, this means HTTPS is the de facto standard in HTTP/2.

## HTTP/1 vs HTTP/2

HTTP version 2 supersedes and replaces HTTP/1.1, but the two versions are more alike than they are different. HTTP/2 is best thought of as an extension rather than a wholesale overhaul. The new version continues to use a request-response protocol over TCP. Clients issue requests and the server responds. Both versions make use of web caches and proxies, use *Uniform Resource Locators* (URLs) and hyperlinks, and support HTTPS. They are both stateless and all messages can be understood in isolation.

### Compatibility Between HTTP/2 and HTTP/1

HTTP/2 is designed for compatibility with earlier versions, and there are no mandatory changes for clients or end-users. All of the main fields, such as the URL, header fields, and status codes, are the same, and the old message format is maintained. For each session, the client and server negotiate a version through a mechanism that allows them to choose between HTTP/2 and HTTP/1.1. Both the client and server must support HTTP/2 to use the protocol. Otherwise, they must both fall back to HTTP/1.1.

Many changes are internal optimizations governing how data packets are framed and transported. These changes are handled at the client and server level and are mostly transparent to users and developers. However, certain workarounds from HTTP/1.1, such as concatenated files, have been removed. Additionally, HTTP/2 no longer supports "chunked transfer encoding", which allows clients to transmit and receive chunks of data independently. New mechanisms are available in HTTP/2 to achieve the same results.

### Changes to Message Transmission in HTTP/2

A major new structural change is the introduction of *binary framing* and *streams* to manage the flow of messages. A single connection containing multiple streams now carries all communication between the client and server. A stream is a bidirectional data flow that transports a series of messages. Each message still represents a request or response, but it is now composed of a series of frames. A single frame contains a portion of the message data, such as the HTTP header. Each frame, in turn, maps back to the parent stream. Binary framing assists with the encapsulation and translation of the messages into frames and streams.

The advantage of a stream-based approach is that it supports multiplexing. Frames from different streams can now be interleaved across a single connection, and different requests and responses can be delivered in parallel. Multiplexing requires fewer TCP connections, but the average connection persists for a longer duration. Many times, only one connection is used for the whole session. This strategy uses TCP more effectively because it is optimized for long-lived connections. Multiplexing reduces the head-of-line blocking problem. This occurs when a missing packet holds up a queue of subsequent packets. Interleaving allows other requests and responses to be delivered while the client waits for the outstanding packet.

### New Features in HTTP/2

Along with the changes to the internal transmission mechanism, HTTP/2 introduces a handful of new features and optimizations. Some of these improvements include:

- **Data compression of headers:** HTTP/2 allows for the compression of HTTP header information. It compresses the request and response header metadata using the [*HPACK compression format*](https://tools.ietf.org/html/draft-ietf-httpbis-header-compression-12). This optimization reduces the amount of header data by over 80%.

- **Server push:** This permits the webserver to pre-emptively send resources to a client before the client requests them. The server knows what to send because it is already aware of the resources the page requires. After it transmits the original web page, it can immediately advertise the remaining elements. This technique removes the cycle where the browser has to examine the web page code and make the additional requests. For example, a server can proactively send the client `.css` and `.js` files to go along with the `html` code. This can be wasteful if the resources are not needed, and in practice, this feature is inconsistently used. Fortunately, HTTP/2 allows the client to decline the resources if it does not want them.

- **Prioritization of requests:** HTTP/2 also permits the client to prioritize any pending requests. It can assign each stream a weight and mark a stream as being dependent on another stream. This triggers the server to allocate the parent stream or high-priority item first.

- **Support for flow control:** HTTP/2 provides clients and servers with the ability to implement flow control according to their own specifications. HTTP/2 flow control is credit-based, with credits incrementing and decrementing according to network activity. Each side is permitted to set and change its own window size. For instance, if a client wants to request a preview image, it can set its credit counter to zero, and then work on something else. When it is ready for the full image, it can increase the number of credits again.

## Advantages of HTTP/2

The use of HTTP/2 is highly recommended as it significantly enhances the browsing experience for end-users and has no real drawbacks. Both the client and the server benefit from the performance improvements, decreased latency, and reduced metadata overhead. HTTP/2 uses fewer connections, significantly diminishing the demand for memory and resources on the server-side. For HTTPS, fewer negotiations and handshakes are required.

The main criticism of HTTP/2 is that it duplicates tasks TCP already handles and violates the protocol layer hierarchy. However, this issue is not likely to concern most users.

## HTTP/3 and the Future

While HTTP/2 is widely seen as a big improvement over HTTP/1.1, the new version missed some additional opportunities for improvement. The new HTTP/3 protocol is already being rolled out to address some of these issues. As with HTTP/2, HTTP/3 maintains the same codes and fields and serves the same basic purpose. However, it replaces TCP at the transport layer with the [*QUIC protocol*](https://en.wikipedia.org/wiki/QUIC), which connects over the *User Datagram Protocol* (UDP). This enables it to implement "user-space congestion control" to work around head-of-line blocking at the lower layer. HTTP/3 implements transport multiplexing, so only the stream suffering data loss is affected when a frame is lost. Google Chrome already supports HTTP/3, which is expected to become more widely used shortly.

## Implement HTTP/2 on Apache or NGINX

More in-depth resources on HTTP/2 are available for those who want to learn more about the protocol. You can refer to our [How to Configure HTTP/2 on Apache](/docs/guides/how-to-configure-http-2-on-apache) and [NGINX](/docs/guides/how-to-configure-http-2-on-nginx) to use the protocol for your websites.


