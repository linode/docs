---
slug: how-to-optimize-bucket-architecture-for-cdn
title: "How to Optimize Bucket Architecture for CDN"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2024-09-27
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

Linode Object Storage can be an efficient, cost-effective solution for streaming and data delivery applications when used as an origin point for Akamai CDN. Since Object Storage is a part of Akamai Connected Cloud, egress can also be significantly reduced.

Your Object Storage bucket architecture is critical to performance success. Distributing content across buckets helps with load distribution, CDN optimization, and adds security benefits like segmentation and origin obfuscation. This guide walks through bucket design strategies using a commerce site example, including optimal bucket architecture for Akamai CDN integration.

## How Object Storage Works

[Object Storage](https://techdocs.akamai.com/cloud-computing/docs/object-storage) stores files in a “flat” or unstructured file structure. This means that bucket contents do not exist in a hierarchy like traditional file structures, however, hierarchy can be emulated by creating folders within a bucket. Files (or “objects”) are stored alongside their rich metadata, and access can be granted on a per-object level, with each object receiving its own URL.

With this in mind, the bucket architecture you use is a crucial element for your application and general CDN integration.

For up-to-date technical specifications of Linode Object Storage such as bucket and rate limits, see: [Object Storage: Technical Specifications and Considerations](https://techdocs.akamai.com/cloud-computing/docs/object-storage#technical-specifications-and-considerations)

## Bucket Architecture Strategies

### Example Scenario

For the example bucket architecture, consider a commerce site serving audio, video, and image-based content.

### What "Not" To Do

In the first bucket example, the top-level, root directory “store” has paths to three lower-level directories containing different types of content: music, video, and images.

Paths in this bucket are: `store/music`, `store/video`, and `store/images`

![Single Bucket Arch Level 1](Single-bucket-arch-level1.png)

Continuing with this approach, additional content such as copyrighted music or free music may logically be placed in the music directory and would continue on for each sub-directory.

Paths in this bucket now include: `store/music`, `store/music/copyright`, `store/music/free`, `store/video`, and `store/images`

![Single Bucket Arch Level 2](Single-bucket-arch-level2.png)

This architecture places content paths all within the same bucket (“store”). This may potentially result in poor performance with rate limits for the bucket being reached as the number of users and requests increases.

One way to overcome these issues is by utilizing Akamai CDN and its ability to cache and deliver content closer to end users. Once the CDN caches an object (like a song, video, or image), it doesn’t need to be pulled from origin storage again until the object file changes or the cache timeout expires.

-   **For example:** This offloading means that a single mp3 audio file downloaded 1 million times would only require a single request to the bucket.

### What To Do & How To Leverage CDN Advantages

The better way to architect your bucket is to **distribute content across multiple buckets** to improve performance. Doing this results in:

-   Overall load distribution
-   Increased requests-per-second (RPS) capacity
-   Segmentation of content across endpoints can act as a security measure in case of compromise
-   Distribution of the number of single endpoint requests from the CDN

Rather than placing music, video, and image content folders within the same root directory, you can triple [RPS capacity](https://techdocs.akamai.com/cloud-computing/docs/object-storage#technical-specifications-and-considerations) by placing each type of content (music, video, and images) in their own buckets. In the example below, additional content can be placed underneath each top-level directory (store-music, store-video, and store-images).

-   Paths for the store-music bucket include: `store-music`, `store-music/copyright`, and `store-music/free`
-   Paths for the store-video bucket include: `store-video`
-   Paths for the store-images bucket include: `store-images`

![Multi-Bucket Arch 1](Multi-bucket-arch1.png)

As the site scales, you can create additional buckets and move sub-category content (such as copyrighted or free music) to their own buckets. This further increases RPS capacity while further distributing the number of endpoints from which the CDN can cache content. In the example below, RPS capacity is now 4x the original bucket architecture.

-   Paths for the copyright bucket include: `copyright`
-   Paths for the store-music bucket now include: `store-music` and `store-music/free`
-   Paths for the store-video bucket include: `store-video`
-   Paths for the store-images bucket include: `store-images`

![Multi-Bucket Arch 2](Multi-bucket-arch2.png)

## CDN & the Relationship To Bucket Design

### CDN Considerations

Each bucket in your architecture has the ability to serve as a single origin endpoint from which Akamai CDN can pull content. This results in a distributed backend with less opportunities for RPS limits to be reached. The more distributed your backend architecture is, the higher the capacity for scaling.

### Relationship To Bucket Design

Bucket design is strictly architectural, and CDNs can often overcome flaws of poorly architected environments. However, when bucket architecture is designed well, the benefits can directly translate to the CDN. Object Storage bucket architecture should be designed to be functional, scalable, performant, resilient, and cost efficient so that Akamai CDN serves your content as effectively as possible.