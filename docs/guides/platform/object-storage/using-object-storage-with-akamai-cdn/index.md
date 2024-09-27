---
slug: using-object-storage-with-akamai-cdn
title: "Using Object Storage With Akamai CDN"
description: "Two to three sentences describing your guide."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2024-09-27
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Object Storage Product Documentation](https://techdocs.akamai.com/cloud-computing/docs/object-storage)'
- '[Akamai Content Delivery Documentation](https://techdocs.akamai.com/platform-basics/docs/content-delivery)'
---

Object storage stores data in an unstructured, flat format where data is stored as “objects”. Object storage is cheaper than block storage, and can be especially useful for large volumes of unstructured data like photos, videos, documents, web pages, sensor data, and audio files. Cloud-based object storage systems distribute this unstructured data across multiple physical devices for redundancy, while users are able to access the content from a single interface. Object storage is HTTP accessible and ideal for building cloud-native applications that require scale and flexibility, as well as storage for existing data like analytics, backups, archives, and more.

With its reliability and cost-effectiveness, Linode Object Storage can be coupled with Akamai’s content delivery network (CDN) to create a viable solution for applications that need to serve large files and large amounts of data. This includes applications like video on demand (VOD) streaming, ecommerce, firmware updating, media-based website content, and more.

The solution presented in this guide focuses on the architectural best practices for designing and operating reliable, secure, efficient, and sustainable content storage and delivery systems using Linode Object Storage on Akamai Connected Cloud with Akamai CDN.

## Object Storage For Data Delivery

With the right bucket architecture, object storage can be used to house content for effective unstructured data delivery. Object storage supports file-critical features such as encryption, compression, deduplication, and versioning, and its accessibility via HTTP protocols offers instant access to objects.

For example, these factors make object storage ideal for storing unstructured data like video and audio files that don’t require frequent updating and services that require efficient input/output.

## Object Storage Specifications, Considerations, and Strategies

When considering applications like streaming that involve sourcing data from object storage, there are a few things to keep in mind, including content access, bandwidth limitations, latency sensitivity, scalability, egress costs, and other technical limitations:

-   **Bandwidth and latency:** Object storage solutions are not always optimized for high-bandwidth streaming applications. This can lead to potential buffering issues and slower delivery speeds.

-   **Scalability:** To preserve infrastructure integrity, object storage systems may have limitations in place for concurrent connections and simultaneous user streams. This can impact the ability to efficiently handle spikes in demand.

-   **Retrieval speed:** Without CDN edge-based caching, content streamed directly from object storage origin servers may result in slower data retrieval speeds and higher latency.

-   **Data transfer and egress costs:** Streaming directly from object storage can incur high egress costs since each user request may result in data transfer fees, whereas CDNs cache data at the edge to optimize delivery.

-   **Resource limits:** Object storage systems may have limitations on the size of individual objects, potentially restricting the size of videos that can be efficiently streamed.

-   **Rate limits:** Linode Object Storage currently has a per bucket rate limit of 750 requests per second (RPS). If users are accessing Object Storage endpoints directly without the use of a CDN, there is a greater chance RPS limits are reached.

-   **Updating manifests:** Bucket contents can be determined by syncing with a manifest. This means that when source manifests are updated often, buckets may constantly have their contents changed.

![DC-Based Architecture](DC-Based-Architecture.png)

Without the use of a CDN, object storage content distribution is limited to individual, origin data centers. As shown in the diagram above, data center-based delivery relies heavily on transit networks to pull and deliver content from regional origin points. At scale, this may result in bandwidth issues, high latency, and inefficient experiences for large numbers of users.

### Internet Considerations

There are multiple internet-related factors to consider when building out a content delivery solution:

-   **First mile:** The content provider connection point. Should content providers set up content to be accessible from a single physical location (i.e. origin), user access is limited by “first mile” connectivity limitations.

-   **Last mile:** The end-user connection point. Slow user internet connection speeds are uncontrollable and unpredictable, although they can mask problems related to the “first mile”, network peering, and bottleneck issues.

-   **Peering points:** The connection points between two networks. These connections are not guaranteed and are difficult to troubleshoot. Networks benefit financially from connectivity with content providers and end users but not each other.

-   **Backbone:** The infrastructure and physical connections that make up the internet. Hardware and network capacity limitations can cause performance issues.

## Advantages of Using Akamai CDN

CDNs are crucial for data delivery solutions because they cache content like images, videos, and other files on edge servers close to end-users. This reduces latency and overall load on origin servers, improves delivery speed and efficiency, and saves money by reducing origin requests and lowering egress. In use cases such as content streaming, CDNs can cache segments from streams to reduce startup times, limit stream interruptions, and eliminate potential buffering issues.

Object storage can’t scale linearly with the number of users, but using it as an origin point for CDN delivery overcomes this by allowing users to interact with the CDN directly. Applications can then store objects independently of user traffic, with the added benefit of CDN security.

### CDN-Based Distributed Architecture

Akamai’s distributed architecture brings content closer to end-users and offers several technical benefits for streaming applications, including:

-   Audience and end-user geographic reach
-   Programmability through well-defined APIs
-   Flexibility to support structured and semi-structured data
-   Scalable consumption models
-   Efficient data recovery and retrieval based on detailed metadata
-   Capacity advantages via distribution across multiple nodes
-   Enhanced data durability and availability through replication and distribution mechanisms
-   Limiting reliance on transit networks
-   Origin offloading, content caching, and reduced latency

![CDN-Based Architecture](CDN-Based-Architecture.png)

![Edge vs. DC Latency](Edge-vs-DC-latency.png)

## Using Akamai CDN with Object Storage for Data Delivery

Object storage is a standardized, key component in many content production tools, enabling seamless integration and organization of large amounts of files. Its interoperability across various applications, tools, and workflows ensures data is centralized and easily accessible. Object storage simplifies content distribution and backup processes, and it provides a secure, efficient method for storing and sharing large volumes of media data.

When architected properly and paired with Akamai’s CDN, object storage allows for fast, cost-effective access to vast libraries of content connected on the same backbone. This results in readily available content - a crucial factor for streaming and other data delivery workflows.

## Next Steps

To learn more about object storage bucket design for streaming and steps for CDN integration, see the following guides:

- [How to Optimize Object Storage Bucket Architecture for CDN]()