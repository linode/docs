---
slug: optimizing-obj-bucket-architecture-for-akamai-cdn
title: "Optimizing Object Storage Bucket Architecture for Akamai CDN"
description: "This guide discusses design strategies and best practices for optimizing Linode Oject Storage bucket architecture for integrating with Akamai CDN."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2024-09-27
keywords: ['object storage','cdn','delivery','linode object storage','akamai cdn','akamai connected cloud','bucket architecture']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Object Storage Product Documentation](https://techdocs.akamai.com/cloud-computing/docs/object-storage)'
- '[Akamai Content Delivery Documentation](https://techdocs.akamai.com/platform-basics/docs/content-delivery)'
- '[Using Object Storage With Akamai CDN](/docs/guides/using-object-storage-with-akamai-cdn/)'
---

Linode Object Storage can be an efficient, cost-effective solution for streaming and data delivery applications when used as an origin point for Akamai CDN. Since Object Storage is a part of Akamai Connected Cloud and uses the same backbone as Akamai CDN, egress can also be significantly reduced.

Your Object Storage bucket architecture is critical to performance success. Distributing content across buckets helps with load distribution, CDN optimization, and adds security benefits like segmentation and origin obfuscation. This guide walks through bucket design strategies using a commerce site example, including an optimal bucket architecture approach for Akamai CDN integration.

## How Object Storage Works

[Object Storage](https://techdocs.akamai.com/cloud-computing/docs/object-storage) stores files in a “flat” or unstructured file structure. This means that bucket contents do not exist in a hierarchy like traditional file structures; however, hierarchy can be emulated by creating folders within a bucket. Files (or “objects”) are stored alongside their rich metadata, and access can be granted on a per-object level, with each object receiving its own URL.

With this in mind, the bucket architecture you use is a crucial element for your application and general CDN integration. The more efficient your bucket design, the better the CDN will perform.

For up-to-date technical specifications of Linode Object Storage such as bucket and rate limits, see: [Object Storage: Technical Specifications and Considerations](https://techdocs.akamai.com/cloud-computing/docs/object-storage#technical-specifications-and-considerations)

## Bucket Architecture Strategies

### Example Scenario

For the example bucket architecture, consider the following scenario:

-   An online commerce site serving audio, video, and image-based content
-   All audio, video, and image files are stored on object storage as an origin point

### What "Not" To Do

In the first bucket example, the top-level, root directory `store` has paths to three lower-level directories containing different types of content: music, video, and images. `store` and its sub-directories are in a single bucket with a defined requests per second (RPS) limit, where the RPS limit is shared by all objects in the bucket.

Paths in this bucket are: `store/music`, `store/video`, and `store/images`.

![Single Bucket Arch Level 1](Single-bucket-arch-level1.png)

Continuing with this approach, additional content such as copyrighted music or free music may logically be placed in the `/music` directory and would continue on for each sub-directory.

Paths in this bucket now include: `store/music`, `store/music/copyright`, `store/music/free`, `store/video`, and `store/images`

![Single Bucket Arch Level 2](Single-bucket-arch-level2.png)

This architecture places content paths and object endpoints all within the same bucket, `store`. This may potentially result in poor performance with rate limits for the bucket being reached as the number of users and requests increases.

### What To Do & How To Leverage CDN Advantages

#### CDN Offloading

One way to overcome these issues is by utilizing Akamai CDN and its ability to cache and deliver content closer to end users. Once the CDN caches an object like a song, video, or image, it doesn’t need to be pulled from origin storage again until the object file changes or the cache timeout expires. For example, by offloading requests to the CDN, a single mp3 audio file downloaded 1 million times only requires a single request to the source bucket.

#### Distributed Bucket Architecture

While Akamai CDN can help get around some limitations of a single-bucket architecture, you can improve and optimize your object storage performance even further by **distributing content across multiple buckets**. Doing this results in:

-   Overall load distribution
-   Increased requests-per-second (RPS) capacity
-   Segmentation of content across endpoints can act as a security measure in case of compromise
-   Distribution of the number of single endpoint requests from the CDN

Rather than placing music, video, and image content folders within the same root directory, you can triple [RPS capacity](https://techdocs.akamai.com/cloud-computing/docs/object-storage#technical-specifications-and-considerations) by placing each type of content (music, video, and images) in their own buckets. In the example below, additional content is placed underneath each top-level directory (`store-music`, `store-video`, and `store-images`).

-   Paths for the `store-music` bucket include: `store-music`, `store-music/copyright`, and `store-music/free`
-   Paths for the `store-video` bucket include: `store-video`
-   Paths for the `store-images` bucket include: `store-images`

![Multi-Bucket Arch 1](Multi-bucket-arch1.png)

As the site scales, you can create additional buckets and move sub-category content (such as copyrighted or free music) to their *own buckets*. This further increases RPS capacity while further distributing the number of endpoints from which the CDN can cache content. In the example below, RPS capacity is now four times the original bucket architecture.

-   Paths for the `copyright` bucket include: `copyright`
-   Paths for the `store-music` bucket now include: `store-music` and `store-music/free`
-   Paths for the `store-video` bucket include: `store-video`
-   Paths for the `store-images` bucket include: `store-images`

![Multi-Bucket Arch 2](Multi-bucket-arch2.png)

## CDN & the Relationship To Bucket Design

### CDN Considerations

Each bucket in your architecture has the ability to serve as a single origin endpoint from which Akamai CDN can pull content. This results in a distributed backend with less opportunities for RPS limits to be reached. The more distributed your backend architecture is, the higher the capacity for scaling.

### Relationship To Bucket Design

Bucket design is strictly architectural, and CDNs can often overcome flaws of poorly architected environments. However, when bucket architecture is designed well, the benefits can directly translate to the CDN. Object Storage bucket architecture should be designed to be functional, scalable, performant, resilient, and cost efficient so that Akamai CDN serves your content as effectively as possible.