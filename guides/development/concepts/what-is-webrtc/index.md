---
slug: what-is-webrtc
title: "What Is WebRTC?"
description: 'This guide provides an introduction to the WebRTC API, which enables audio and video capabilities for web applications.'
og_description: 'This guide provides an introduction to the WebRTC API, which enables audio and video capabilities for web applications.'
keywords: ['what is WebRTC', 'WebRTC API', 'WebRTC audio-visual', 'WebRTC browser']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Jeff Novotny"]
contributors: ["Jeff Novotny"]
published: 2023-04-20
external_resources:
- '[WebRTC Organization](https://webrtc.org/)'
- '[Real-Time Protocols for Browser-Based Applications Protocol RFC 8825](https://datatracker.ietf.org/doc/html/rfc8825)'
- '[WebRTC Code Samples](https://webrtc.github.io/samples/)'
- '[Getting Started with WebRTC](https://webrtc.org/getting-started/overview)'
- '[Mozilla WebRTC documentation](https://developer.mozilla.org/en-US/docs/Glossary/WebRTC)'
- '[Mozilla WebRTC API documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)'
- '[Media Capture and Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API)'
- '[Media Devices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)'
- '[WebRTC GitHub repository](https://github.com/webrtc)'
---

The [WebRTC](https://webrtc.org/) specification enables web applications to transmit high-quality audio and video content directly between users. WebRTC supplies a JavaScript API for direct integration into web page code. This guide introduces WebRTC, discusses its advantages, and explains how it is used.

## What is WebRTC?

WebRTC is a free, open-source specification originally developed by Global IP Solutions consisting of several interrelated APIs and protocols that work together. Google purchased WebRTC and subsequently licensed it as an open-source framework. It has since been standardized by the *World Wide Web Consortium* (W3C) and the IETF to allow greater interoperability and a wider reach. Most major vendors support WebRTC, including Google, Apple, Microsoft, and Mozilla.

The WebRTC API allows both browser and mobile-based web applications to integrate *real-time communication* (RTC) capabilities. Using WebRTC, high-quality peer-to-peer audio and video channels can be embedded inside a web page. After a connection is established, browsers can exchange streams or data without going through a central server.

WebRTC maintains two communication channels. The media communication channel streams real-time media or textual information between peers without any additional plug-ins, server-side file hosting, or helper applications. The WebRTC standard also specifies a separate data channel for sending text or binary data. In addition to browsers, WebRTC is also used in mobile and *Internet of Things* (IoT) devices.

Developers can integrate WebRTC capabilities into their applications using the JavaScript API. Like other JavaScript functions, the WebRTC code can be embedded inside HTTP markup. The WebRTC API is typically used together with the closely-related [Media Capture and Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API).

### How Does WebRTC Work?

Each media stream contains one or more *tracks*, and the majority of WebRTC streams consist of at least two tracks. A track can transmit both live and stored media, and corresponds to a media channel such as an audio or video stream. Text or binary files can also function as tracks.

WebRTC is designed for very low latency. Real-time video is delivered using a more secure variant of the *Real-time Transport Protocol* (RTP) known as *Secure RTP* (SRTP). SRTP sends packets using the *User Datagram Protocol* (UDP), can tolerate some measure of data loss, and does not retransmit packets. To compensate and assist with packet reordering, SRTP packets include a timestamp and sequence number.

The data channel uses the *Stream Control Transmission Protocol* (SCTP). SCTP combines some of the advantages of both UDP and the *Transmission Control Protocol* (TCP). SCTP is a message-oriented protocol like UDP, but it ensures reliable delivery and sends packets in order the same way TCP does. To enhance security, SCTP makes use of the *Datagram Transport Layer Security* (DTLS) service.

Before exchanging any information, peers must exchange connection parameters and negotiate a connection. Connection information is shared using the *Session Description Protocol* (SDP). An SDP message summarizes the available media channels and describes and stores formatting details for the WebRTC stream, including encryption, resolution, and codec information. WebRTC uses a codec to compress, decompress, and replay the track information.

WebRTC requires an intermediate server to create and establish the actual connection. *Interactive Connectivity Establishment* (ICE) provides a framework for resolving peer IP addresses. WebRTC does not handle the signaling itself, but it inter-operates with a wide variety of signaling solutions.

ICE typically employs an intermediary such as a *Session Traversal Utilities for NAT* (STUN) or *Traversal Using Relays around NAT* (TURN) service. STUN and TURN protocols are often both available on the same server, implement peer discovery, and set up the *signal channel*. The intermediate server returns a list of one or more *ICE candidates*. Each ICE candidate contains an IP address and port the client can potentially use to communicate with the peer. In most cases, the client receives a list of candidates and can choose the one it prefers. STUN is the more lightweight of the two options and is typically the default. TURN can more easily work around restrictions and must be used if STUN cannot create a connection without assistance. WebRTC can also set up signaling using WebSockets.

### Browser Support and Common Use Cases

All modern browsers and operating systems support WebRTC, including Microsoft Edge, Google Chrome, Firefox, Safari, and Opera, as well as Android, iOS, and ChromeOS platforms.

Some of the most common applications for WebRTC include the following:

- Teleconferencing
- Online education
- Telehealth
- Torrent services
- VoIP telephony over a browser
- Webcams
- Home security
- Screen sharing
- Identity management
- Collaborative art and illustration

### Advantages and Considerations

#### Advantages

- It is a free, widely used and supported open-source standard. WebRTC is economical to use and highly interoperable.
- It features cross-platform browser support.
- It is considered easy to use and can reduce application complexity.
- It supports high-quality audio and video, with built-in support for noise reduction and echo cancellation.
- It does not require additional plug-ins or other software.
- It has low latency and can keep up with real-time applications.
- It supports bandwidth management and adjusts transmission parameters based on the quality of the connection.
- It requires HTTPS and supports other security measures and encryption.

#### Considerations

- Not all browsers may follow standard implementation.
- The concepts underlying WebRTC can be somewhat complex.
- WebRTC may not be able to achieve real-time transmission with a very high resolution or frame rate. Some browser implementations set maximum values for these attributes, and there is no guarantee for quality of service.
- Some browsers can only support a single incoming WebRTC stream. This means many-to-many applications (i.e. conferencing) may not be supported. Most multi-user scenarios require the use of a multimedia server.

## WebRTC Design Details

### The WebRTC API

To implement the WebRTC framework, the standard includes a collection of JavaScript APIs. These APIs consist of a number of functions along with several predefined events. More information about the API and the events can be found in the [Mozilla WebRTC API documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API). Some frequently used API components include:

- **getUserMedia**: Provides access to the system's audio and video devices and other peripherals. For example, this interface is used to access a system's camera or microphone.
- **RTCPeerConnection**: This section of the API handles the technical details for peer-to-peer connectivity for video or audio communication. It manages bandwidth allocation, signal processing, security, and codec handling.
- **RTCDataChannel**: Sends and manages bidirectional data between the peers using SCTP.
- **RTCSessionDescription**: Stores the session parameters, including the SDP descriptor.
- **getStats**: Retrieves WebRTC session statistics.
- **RTCRtpSReceiver**: Manages the decoding and reception of data from a peer-to-peer connection.
- **RTCRtpSender**: Handles the encoding and transmission of data for a peer-to-peer connection.

WebRTC also tracks a number of events, including `open`, `close`, and `connectionstatechange`. Upon request, it monitors changes to the signaling state, ICE connection, data channel, and tracks. Security features are handled by a related API for identity and security.

### The WebRTC Workflow

1.  In a typical WebRTC workflow, the application first accesses and registers the appropriate local media devices. These devices might include a camera, microphone, tablet, or monitor display. In some cases, the program can search for a specific device, but it can also register a generic audio device. Each active device is assigned to a `mediaDevices` object using the `getUserMedia` API. The API allows the program to open the device, listen for state changes, and adjust track parameters like height, width, volume, and resolution. It also allows a program to set minimum and maximum values for all device attributes.

1.  After the local devices are acquired, WebRTC can open a connection with the peer device. Connections are managed using the `RTCPeerConnection` API. As part of the signaling procedure, client information is first transferred to the peer using the *Session Description Protocol* (SDP). After peers agree to the parameters, the peers are officially connected.

1.  The signaling channel must be established before any information can be transmitted across the new connection. Signaling is outside the scope of the WebRTC specification, which can inter-operate with a variety of solutions. However, clients for both peers must provide an ICE server configuration. An ICE candidate contains information about the underlying communication protocol, IP address, port number, and connection type. If the peers are on different networks, the connection must be established using a STUN or TURN server intermediary. STUN and TURN servers are available through the cloud and as self-hosted applications. In practice, each participant sends a list of potential ICE candidates to the peer, allowing for the best route to be selected.

1.  After the connection is established, data can be directly transmitted between the browsers, and the peer-to-peer video or audio streaming session can begin. A stream is associated with an `RTCPeerConnection` attribute. This object manages the transmission of the stream to the peer. Multiple media *tracks* can be attached to the same stream. For greater efficiency, the `RTCPeerConnection` can be assembled even before the peer connection is established. The client also uses `RTCPeerConnection` to listen for incoming tracks and receive the stream. Binary data and back channel information, such as metadata and status updates, are sent using the `RTCDataChannel` interface.

## Technical Resources

-   **WebRTC Samples:** The official WebRTC site includes a number of [WebRTC API samples](https://webrtc.github.io/samples/). These samples demonstrate the potential capabilities of WebRTC applications. Examples include how to stream a video element to a peer, record a stream, and instantiate messaging. Each case includes a link to the source code in the [WebRTC GitHub repository](https://github.com/webrtc). The site also includes a [Getting Started with WebRTC](https://webrtc.org/getting-started/overview) component, providing an overview of the APIs and the different steps of the streaming process.

-   **API Documentation:** [Mozilla's WebRTC API documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) provides low-level technical details about the specification. Developers can review implementation details for the major WebRTC APIs. Developers are likely to find the [Media Capture and Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API) and the related [Media Devices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices) highly useful. Mozilla also publishes tutorials, such as [How to Build an Internet-connected Phone](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Build_a_phone_with_peerjs), which can serve as a template for other WebRTC projects.
