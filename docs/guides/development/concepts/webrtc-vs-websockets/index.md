---
slug: webrtc-vs-websockets
title: "WebRTC vs WebSockets"
description: 'This guide compares and contrasts WebRTC and the WebSocket Protocol explaining under which conditions each should be used.'
keywords: ['WebRTC', 'WebSockets', 'WebSockets vs WebRTC', 'choice between WebRTC and WebSockets']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Jeff Novotny"]
published: 2023-04-27
modified_by:
  name: Linode
external_resources:
- '[The WebSocket Protocol RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455)'
- '[Real-Time Protocols for Browser-Based Applications Protocol RFC 8825](https://datatracker.ietf.org/doc/html/rfc8825)'
- '[WebRTC Organization](https://webrtc.org/)'
- '[Mozilla WebRTC documentation](https://developer.mozilla.org/en-US/docs/Glossary/WebRTC)'
- '[Mozilla WebSockets documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)'
---

[*The WebSocket Protocol*](https://datatracker.ietf.org/doc/html/rfc6455) and [*WebRTC framework*](https://webrtc.org/) are two very common technologies for real-time web communications. The two protocols are often assumed to be very similar, but there are important differences between them. This guide compares and contrasts WebSockets vs WebRTC and explains the situations in which each should be used.

{{< note >}}
The terms *WebSocket* and *WebSockets* are often used interchangeably. The official term for the protocol in the RFC is the WebSocket Protocol. The framework, API, and technology are usually referred to as WebSockets. This guide uses the phrasing that best fits the particular context.
{{< /note >}}

## What is WebRTC?

WebRTC is a free, open-source specification for transmitting high-quality audio and video content directly between peer users. The standard consists of a JavaScript API and several supporting protocols. WebRTC has been standardized by the *World Wide Web Consortium* (W3C) and through the IETF in [RFC 8825](https://datatracker.ietf.org/doc/html/rfc8825). All modern platforms and browsers support WebRTC.

The WebRTC standard allows developers to integrate multimedia content directly into a browser for direct peer-to-peer transmission. It is used in such applications as online education, torrent services, webcams, home security, telehealth, VoIP telephony, and screen sharing. WebRTC does not require additional plug-ins, server-side file hosting, helper applications, or an intermediate server. However, it does require assistance in establishing the initial connection.

The WebRTC JavaScript API is used to access the microphone, camera, screen, and other devices on the system. It also manages the connection and sends, receives, encodes, and decodes data. WebRTC is able to listen for, and respond to, a number of events, including `open`, `close`, and `connectionstatechange`. Additional components of the API handle interactions with the signaling channel, security, and authentication.

WebRTC transmits information using two main channels. The streaming channel is used for real-time media communications. It is designed to transmit audio and video information. A stream contains at least one *track*, but it typically contains two or more components. Each media component, for example, the audio stream, maps to a different track. WebRTC uses a more secure variant of the *Real-time Transport Protocol* (RTP) known as *Secure RTP* (SRTP) to transmit the streams. SRTP packets are sent over *User Datagram Protocol* (UDP). UDP has low latency and can tolerate some data loss. A corresponding data channel for sending text or binary files uses the *Stream Control Transmission Protocol* (SCTP). SCTP combines features of both UDP and the *Transmission Control Protocol* (TCP) to ensure reliable ordered delivery of packets with reasonably low latency.

To establish the initial peer-to-peer connection, WebRTC must rely on an intermediate signaling server. The protocol is agnostic regarding what signaling service to use. Most implementations use a *Traversal Using Relays around NAT* (TURN) or *Session Traversal Utilities for NAT* (STUN) server to set up the *signal channel*. Peers share connection parameters and advertise their media channels using the *Session Description Protocol* (SDP).

For more in-depth information about WebRTC, see the [Linode introduction to WebRTC](/docs/guides/what-is-webrtc/). API information can be found inside the [Mozilla WebRTC documentation](https://developer.mozilla.org/en-US/docs/Glossary/WebRTC).

### The Advantages and Disadvantages of WebRTC

Because it has several pros and comparatively few cons, WebRTC has been widely adopted. Some of its main advantages are:

-   It is an open-source standard that is free to use and has high interoperability.
-   It supports high-quality audio and video, with advanced features including noise reduction and echo cancellation.
-   It features very high performance and low latency. This means it is suitable for real-time applications.
-   It is easy to implement and can simplify development work.
-   It is very widely supported on different platforms and browsers.
-   It does not require the user to install plug-ins or other software.
-   It supports bandwidth management and can adjust transmission quality on low-speed or low-quality connections.
-   It prioritizes security and includes an encryption feature.

However, WebRTC also has some disadvantages:

-   Browsers might not always follow the official specification.
-   The technology involves several interrelated components and can be complex and difficult to understand.
-   It does not have a quality of service component, and cannot always guarantee real-time transmission at high resolution or frame rates.
-   It is more suited for one-to-one transmission than multi-user scenarios. Many-to-many applications typically require the use of a multi-media server.

## What are WebSockets?

WebSockets is also an open standard protocol for web applications. It enables a persistent full-duplex channel between a client and a server. WebSockets typically runs on a browser on the client side but can use other services. The current WebSockets implementation is defined in [RFC6455](https://datatracker.ietf.org/doc/html/rfc6455) and is supported on all major browsers, platforms, and web servers.

WebSockets run on top of the TCP transport layer. TCP reliably delivers packets in their original order. It is designed to be highly compatible with HTTP. Both protocols use ports 80 and 443 and reside at the application layer of the network stack. The WebSockets negotiation process even uses the HTTP *upgrade header* to switch over to WebSockets from HTTP. After the client and server, both agree to use WebSockets, the session continues to send messages over the existing TCP connection. However, both sides now send messages using the WebSocket protocol rather than HTTP. WebSocket URLs begin with the `ws` or `wss` prefix.

Each WebSockets message is fragmented into frames. The frames have very small headers to reduce overhead and minimize latency. A WebSocket client can determine if the connection involves a proxy and sets up a persistent tunnel if necessary.

The full-duplex nature of the connection allows for real-time data to be transmitted between a client and the server. WebSockets maintains an ongoing open connection. This allows messages to be sent and received at any time. The server automatically and proactively "pushes" content to the client without waiting for a request. This makes WebSockets a good choice for fast-changing content such as sports scores and stock prices. It is also used for real-time updates, gaming, collaborative document editing, chatbots, and online help.

The WebSocket protocol offers an event-based API for incorporation into JavaScript or other programming languages. Developers can listen for, and react to, events from the server. Polling is never required. Servers can choose from four different events, including `Open`, `Message`, `Error`, and `Close`. For more information on WebSockets, including how to create and use a socket, see the [Linode Introduction to WebSockets](/docs/guides/introduction-to-websockets/). The [Mozilla WebSockets documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) contains technical details about the web API.

### The Advantages and Disadvantages of WebSockets

There are many reasons why WebSockets are widely used in web applications. Some of its main advantages are as follows:

-   It allows for ongoing bidirectional communication between a client and a server. The connection is full-duplex, so both the client and server can simultaneously send messages.
-   It sends updates very quickly with low latency and overhead.
-   It does not force the client to send repeated HTTP requests.
-   It maintains the same session instead of creating new connections. This reduces the load on the web server.
-   It is widely supported. Because it works seamlessly with HTTP, it is available on all modern platforms and browsers.

WebSockets also carries a few drawbacks:

-   It carries a few security risks. It is particularly vulnerable to cross-site scripting and hijacking attempts unless extra protection is added.
-   It is meant for sending self-contained messages, not for streaming.
-   A WebSocket session does not automatically reconnect after an error. Some WebSocket-based applications suffer from reliability problems.
-   It is more complex to use than traditional HTTP polling.
-   It lacks a caching mechanism.

## Predecessors to Both WebRTC and WebSockets

Before WebSockets and WebRTC became commonplace, *polling* was frequently used for real-time communications. In polling, the web client sends HTTP requests at regular intervals and waits for a response. When the client receives a response, it refreshes the page to reflect the new data. Unfortunately, this is resource intensive and inefficient in terms of bandwidth. Many times, no new information is available, and nothing is gained by the poll.

*Long polling*, also referred to as the *Comet* protocol, is an optimization to polling. The server holds the request for a set duration and only sends a response when an update is available. Otherwise, it times out and returns an empty request. In addition to having some of the same problems as polling, *Comet* is often error-prone, inefficient, and difficult to set up. Both techniques increase latency. These technologies are still used on some web pages but have been largely superseded by WebRTC and WebSockets.

## What are the Similarities and Differences Between WebRTC and WebSockets?

On the surface, WebRTC and WebSockets are more alike than they are different. In many cases, developers could build a workable application on top of either technology. Here is a list of some of the main similarities between the two frameworks.

-   **Main purpose and use case**: WebRTC and WebSockets are both useful for ongoing two-way communications and are both widely used in web applications.
-   **Standardization**: Both features are open-source technologies and follow an official standard. They are free to use and do not require any license, add-ons, plug-ins, or supporting applications.
-   **Latency and performance**: Both are low-latency applications with little overhead. They are designed for efficiency.
-   **Interoperability**: Both frameworks are largely browser, server, and platform independent.
-   **API**: Both WebRTC and WebSockets include a web API for inclusion in JavaScript code or other web programming languages.

WebRTC and WebSockets can even be used together in one situation. WebRTC requires assistance with signaling and session creation. WebSockets can establish this connection using an intermediate server. WebRTC does not specify how to handle signaling, so it can work with a variety of technologies, including WebRTC.

However, the differences between WebRTC and WebSockets are even more significant. They follow different architectural models and have different strengths and weaknesses. Here are some of the main distinctions.

-   **Architectural model**: WebSockets is only designed for client-server communications. Two peers can not communicate directly without passing messages through an intermediate server. WebRTC is a true peer-to-peer protocol. It requires help with signaling, but after the connection is established, the peers can talk directly to each other. Data does not have to pass through a central server.
-   **Transport layer protocols**: WebSockets and WebRTC use different transport layer protocols. WebSockets uses TCP to guarantee reliable in-sequence delivery and data integrity. WebRTC transmits real-time media using Secure RTP over UDP. UDP is fast but does not guarantee delivery of all packets and it does not retransmit lost packets.
-   **Speed vs. reliability**: Both applications are fairly fast, but WebRTC explicitly prioritizes speed and low latency. It does not guarantee the delivery of all packets and is tolerant of some data loss. WebSockets attempts to deliver all packets in order. It is a good choice for transmitting text and binary files where packet loss is unacceptable.
-   **Media processing and peripherals**: WebRTC provides direct access to devices, including the screen, microphone, video camera, and tablet. The WebSockets API is not capable of handling device inputs directly. WebRTC has very sophisticated media processing and codec features, which WebSockets largely lacks. For instance, WebRTC can adjust transmission quality based on the speed and congestion rate of the connection. It also includes features for noise reduction and echo cancellation.
-   **Security**: WebRTC is more secure than WebSockets. WebRTC messages are encrypted and authenticated. WebSocket messages are vulnerable to certain attacks and hijacking attempts.
-   **Integration and Ease of Use**: WebSockets integrate better with HTTP and are generally easier to understand. It uses fewer resources and does not require assistance with signaling as WebRTC does. For a widely-used WebRTC application, it might be necessary to pay for one or more signaling servers to initiate and manage the connections. Smaller sites might be able to manage using free STUN/TURN servers.
-   **Maturity**: WebSockets is more mature and is used by more applications than WebRTC is. The WebRTC framework is still evolving in some aspects.

## How to Choose Between WebRTC vs WebSockets

Due to their differences, WebRTC and WebSockets have different optimal use cases. WebRTC specializes in real-time streaming media. WebSockets is designed to handle real-time updates.

The following guidelines can help determine when to use WebSockets and when to avoid it.

-   WebSockets is the best framework for sending unidirectional real-time updates and notifications. It works especially well in conjunction with the JSON format to define a custom API for use by the server and its users. Updates should be presented as separate stand-alone messages.
-   It is a good choice for message-based applications, including chats, online quizzes, and dashboards. It is recommended for event-driven environments that must react to certain notifications and alerts.
-   WebSockets is particularly good for live feeds, such as stock tickers, sports scoreboards, and social media feeds. Use WebSockets when the information updates frequently, but not constantly.
-   Because WebSockets sends asynchronous updates, it is the better option for collaborative document editing or coding. Updates are ordered events with timestamps, so conflicts can be easily resolved.
-   It has some limited multimedia capabilities. Along with text and binary files, WebSockets can handle images and short videos.
-   WebSockets is better for low-quality or unstable connections. The TCP connection retransmits packets and does not time out immediately.
-   WebSockets is not optimized for streaming media like movies, music, and webcams.

WebRTC is designed for a very different type of application. Here are some of the situations where it is the better choice.

-   WebRTC is far superior for all audio or video communications and for streaming real-time media. It is the natural choice for movies and music and can handle specialty applications such as screen sharing, live broadcasting, or bidirectional live feeds. WebSockets is not designed for these tasks.
-   Because WebRTC has very low latency and minimizes jitter, it is the best choice for applications like VoIP that cannot handle any delay.
-   WebRTC is a good technology for bidirectional video applications, including e-learning, telehealth, and video calls.
-   WebRTC maintains two data channels, so it is particularly good for applications that want to send media alongside meta-information. One example might be a music streaming site where song lyrics and production information are sent alongside the audio track.
-   Although WebRTC can send text and files using the data channel, this is not what it is really intended for. It is not as reliable a choice for text and binary files as WebSockets.
-   In collaborative editing, WebRTC is more susceptible to editing conflicts than WebSockets.
-   WebRTC is recommended whenever security is very important, like in telehealth or sensitive exchanges.
-   WebRTC does not treat updates as events and it does not guarantee reliable delivery. So it is not the right choice for any monitoring or dashboard application designed to respond to critical events.

Neither application handles one-to-many broadcast or many-to-many multicast scenarios very well on its own. Many-to-many applications require a dedicated multimedia server to assemble the streams. WebRTC can be used as a building block alongside a media server.

## Conclusion

The WebSockets protocol and WebRTC framework are two different methods of handling real-time communications. WebSockets is designed for client-to-server communications and is a good choice for real-time updates or two-way event-driven applications. WebRTC can process true peer-to-peer communications. It is the best option for real-time audio and video streams. It is also suitable for applications requiring a higher level of security or less jitter. For more information on these protocols, see the [Linode Introduction to WebSockets](/docs/guides/introduction-to-websockets/) and the [Linode introduction to WebRTC](/docs/guides/what-is-webrtc/).
