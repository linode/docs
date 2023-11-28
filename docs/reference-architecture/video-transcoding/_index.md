---
title: "Video Transcoding Reference Architecture"
description: "A scalable, portable, and cost-effective media processing workflow using Akamai Cloud Compute, Linode Kubernetes Engine, Akamai CDN, and a GitHub Actions."
license: "[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)"
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
published: 2022-09-08
---

[![Figure 3 Preview](figure-3-preview.jpg)](/docs/reference-architecture/video-transcoding/diagrams/)

*Click to visit detailed diagrams*

## Abstract

This document provides a concrete example of how to create a scalable, portable, and cost-effective media processing workflow using Akamai Cloud Compute, Linode Kubernetes Engine, Akamai CDN and a CI/CD pipeline powered by GitHub Actions.  Specifically we will demonstrate a traditional Video On-Demand (VOD) workflow that takes a source video and shows you how you can output this to an online distribution format and how this architecture will allow you to cost-effectively scale to as many unique formats that you might need for your video transcoding needs.

The vast majority of use cases involve handling multi-media content.  Whether your infrastructure supporting user consumable content for blogs or social media, producing video or digital assets for streaming services, or other business using your applications at a global scale, you rely on engaging content. To start we want to quickly explore what a high level generic content workflow might look like.

## Technologies Used

* Argo
* FFmpeg
* MediaInfo
* GitHub
* Terraform
* Helm
* DockerHub
* Let’s Encrypt
* Cert-Manager
* Nginx
* Prometheus
* Grafana
* Akamai Connected Cloud Technologies
   * LKE
   * Node Balancer
   * Object Storage
   * Volumes
   * API
   * DNS

## Business Benefits

* Extensibility for unlimited media workflow possibilities. This reference architecture is highly extensible to support a myriad of media output format types and unique workflow steps definitions to output to any device, platform, or audience specification.
* Scalability. If you need to process a large amount of content in a short period of time to meet service launch or marketing campaign requirements, this solution supports horizontal scalability by adding more Linodes within the Kubernetes cluster, which enables high throughput.
* Cost-effectiveness. Traditional media workflows had to keep a deployed capacity for peak usage, but because this is built on Kubernetes and the workflow mechanism with Argo support dynamic pod scheduling and tear-down you can minimize your cost footprint.


1. Prior to ingesting new content from a creator, a strategy is devised to understand what types of platforms, audiences, and devices the content will be distributed to. For example, over a decade ago, HTTP Live Streaming (HLS) was the ubiquitous format specified to support video playback on Apple devices.[^1]

1. A content workflow is illustrated here and includes content creators sending content files into the media processing system.  A way to upload content into a Media Ingest Location (typically a file system, FTP/SFTP endpoint, cloud storage bucket, etc.)

1. When new files are added a Media Ingest Event kicks off the workflow lifecycle (e.g. there is an application process watching for new files to trigger the workflow, a webhook is received, etc.)

1. Because transcoding is very CPU intensive and parallel processing is dependent on available compute, it is typical for any media processing workflow to queue up workloads in a Media Ingest Queue and work through the queue as processing slots become available.

1. The Media Ingest Workers represent the actual processing tasks that are done to a file within a workflow.  The diagram illustrates the typical sub-processes that are enacted on video files which includes the steps below.

    1. The file is downloaded from an object storage location to the local compute instance where it is processed.

    1. Metadata is obtained about the source file using a programmatic process

    1. Next, the source file is transcoded to the desired outputs. These outputs are specified by the transcoding parameters, which are based on the content distribution requirements.

    1. After the new transcoded outputs are created, metadata is gathered for them. This information is used to validate that the output formats match the specifications desired.  This metadata can also be used to catalog the content in other systems of record.

    1. After transcoding to the required outputs, one or more thumbnail images may be generated. These typically accompany the content when published on consumption platform.

1. The files are uploaded to the desired Media Destination Location (also sometimes referred to as the content origin).

1. After being prepared in the proper distribution formats, most content is delivered to end consumers through a Content Delivery Network (CDN). The CDN caches content in the geographic regions it is served to, which reduces latency and increases reliability of playback.

1. A system is set up to allow observability of the content workflows. Content distributors need to be able to handle errors, assess utilization, and make decisions based on the types of workloads their systems are processing.  A dashboard or tool to view and collect this information is key to keeping things running smoothly.