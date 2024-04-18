---
slug: application-http-vs-network-tcp-load-balancers
title: "Application (HTTP) vs Network (TCP) Load Balancers"
description: 'Explore the differences between application-layer (HTTP) and transport-layer (TCP) load balancers. Learn how each functions, their key features, and when to choose one over the other.'
authors: ["Linode"]
contributors: ["Linode"]
published: 2024-01-16
keywords: ['load balancing protocols','http load balancing','tcp load balancing','application-layer load balancing','transport-layer load balancing']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

Load balancing is the process of distributing client requests across multiple servers. Originally, load balancers were dedicated hardware appliances connected to physical servers in data centers. Today, software products such as [Akamai NodeBalancers](/docs/products/networking/nodebalancers/) perform the same role with cloud-based servers.

Whether hardware or software, the concept is the same. Load balancers act as a reverse proxy for client requests, parceling out requests across servers to avoid resource exhaustion. Load balancers take many forms and offer [many features](/docs/guides/load-balancing-fundamentals/). However, they all route client requests to back-end servers using either application-layer (HTTP/S) or transport-layer (TCP) criteria. Distributing the load in this way can help ensure the best performance, availability, scalability, and security. With Akamai NodeBalancers, it’s simple to take advantage of the features available at either layer.

Transmission Control Protocol (TCP) resides at the transport layer (L4) in the [seven-layer OSI model](/docs/guides/introduction-to-osi-networking-model/). Meanwhile, Hypertext Transport Protocol (HTTP) and secure HTTP (HTTPS) reside at the higher application layer (L7). Both TCP and HTTP have their place when it comes to load balancing.

If your application is a website or uses a web-accessible front end, it can be preferable to use application-layer (HTTP) load balancing. Using an HTTP load balancer allows you to view the contents of a client's HTTP request *before* you determine which back-end machine it is routed to. This enables you to make use of application-layer data in HTTP headers. Depending on the features of the load balancer, it may be able to read these headers to dynamically route the traffic (such as routing requests for `example.com/app` to a different set of back-ends than `example.com/blog`).

There are many applications that do not use HTTP traffic, such as email, instant messaging, and SQL databases. For these, TCP load balancing is the right choice. In addition to working with a wider range of applications, it also typically has faster performance as it is not terminating HTTP requests and analyzing those requests.

In this guide, learn what benefits each protocol offers, and which makes the most sense for common use cases.

## HTTP (Application/L7) Load Balancing Overview

With HTTP/S load balancing, the [NodeBalancer](/docs/products/networking/nodebalancers/guides/configure/) examines each packet's application layer HTTP headers to decide how to route client requests to back-end servers. Besides improving application performance, availability, and horizontal scalability for Web applications, HTTP load balancing also affords web-specific benefits not available from TCP load balancing.

### HTTP Load Balancer Benefits

HTTP load balancing works with unencrypted Web traffic, but also in HTTPS mode using Transport Layer Security (TLS). With TLS, the load balancer hosts the certificate and private key for a given web site. It then decrypts client requests and passes them along to back-end servers.

Some load balancers such as HAProxy can even make URL-based routing decisions. This can be helpful if your cloud infrastructure is set up for some servers to handle video or image requests, while others return text objects.

### HTTP Load Balancer Use Cases

Web-based load balancing makes sense for virtually any application that runs over HTTP/S. This is true whether it’s a static Web site or a complex multi-tier application that uses a Web front end.

E-commerce sites require an item directory and a shopping cart, along with financial and shipping functions to complete transactions. In this case, the application load balancer sends browsing requests that contain product images or video to servers that don’t maintain open connections. Meanwhile, shopping cart and checkout requests are sent to those servers who retain client connections and cart contents.

## TCP (Transport/L4) Load Balancing Overview

TCP load balancing algorithms use a client request’s destination TCP port number to make forwarding decisions. Optionally, a load balancer may compute a hash of TCP source and destination port numbers to ensure session persistence. This ensures that the same client always reaches the same server. This is useful for applications or services that employ unique tokens for each session.

### TCP Load Balancing Benefits

TCP load balancing is relatively simple to implement and operate. It’s useful for applications that run over TCP but not HTTP/S. It does work with HTTP/S traffic by pointing to port `80` or `443`, but without any HTTP-specific capabilities.

The level of a load balancer refers to how far up the network stack a communication has to travel before it reaches its destination. Since TCP operates in the OSI model's fourth level, an application load balancer route based on TCP has less latency. This is because the communication doesn’t have to go all the way up and down the network stack.

### TCP Load Balancing Use Cases

Websites that require extreme performance and high availability to handle latency-sensitive applications, spike-heavy workloads, and high-volume inbound TCP requests benefit from TCP load balancing. TCP load balancing is also a good option when you need to support a static or elastic IP address. Another appropriate use case is if you are using container services and want to support more than one port on a compute instance.

## Conclusion

Load balancing is one of the best and easiest ways to boost the performance, availability, and scalability of your applications. With just a few clicks, you can set up an Akamai NodeBalancer to use Web- or TCP-specific features to minimize downtime and maximize performance.