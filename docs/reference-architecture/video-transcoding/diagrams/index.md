---
title: "Video Transcoding Reference Architecture"
description: "A scalable, portable, and cost-effective media processing workflow using Akamai Cloud Compute, Linode Kubernetes Engine, Akamai CDN, and a GitHub Actions."
linkTitle: "Diagrams"
license: "[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)"
tab_group_main:
    title: Diagrams
    weight: 20
published: 2022-09-08
---

## Figure 1: High Level Typical Media Ingest Workflow

Figure 1 illustrates a media processing lifecycle that has two typical contributors.  The content creator produces some type of multimedia content, let’s assume a video in this case.  Typically the original content is in a high quality format so that it can be archived in the highest quality possible so that it can be edited at any time or transformed into other outputs suitable for distribution.  Content distribution is the role in a workflow that takes the original high resolution format of the content and converts it into formats suitable for online distribution.  Let’s quickly break down some activities happening in this diagram as shown in numbered steps below.

1. Prior to ingesting new content from a creator, a strategy is devised to understand what types of platforms, audiences, and devices the content will be distributed to.  For example, over a decade ago, HTTP Live Streaming (HLS) was the ubiquitous format specified to support video playback on Apple devices.  While it is supported much more widely today beyond just Apple devices, there are always considerations for video distribution formats based on budgets, audiences, devices to be supported, geographic regions, etc.  It is the role of the content distribution team to understand what intake formats they are expecting from content creators (they typically standardize on acceptable formats), what destinations they will be publishing to, and what transcoded output formats they will need to support for those destinations as well as any ancillary content such as metadata and images.  Those concepts are encapsulated in transcoding system configurations called workflow specifications and transcode profiles and are defined prior to any content ingestion.  Argo Workflows is an example of a tool that supports DAG-based (Directed Acyclic Graph) Workflows which illustrate an example of how workflow specifications can be defined.  An open-source tool called PyTranscoder demonstrates how transcode profiles can be created for FFMPEG.

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

## Figure 2: Akamai Cloud Compute LKE with Argo Events and Argo Workflow

Figure 2 provides an overview of the tools and technologies that we can overlay onto our VOD workflow use case using Akamai Cloud Compute with Linode Kubernetes Engine (LKE) combined with an event-driven and highly scalable workflow management tool called Argo to achieve a flexible, portable, and cost-effective media processing solution.  Argo is an open source Kubernetes-native workflow engine supporting DAG and step-based workflows and is a member of the Cloud Native Computing Foundation (CNCF).

## Figure 3: End-to-End VOD Workflow with HLS Video Output

![Figure 3](figure3.svg?diagram-description-id=figure-3-description)

Figure 3 is the built-out reference architecture that includes:

* A CI/CD workflow using GitOps at the bottom of the diagram
* A media processing lifecycle management workflow application built in Linode Kubernetes Engine using Argo Events and Argo Workflows
* Content distribution using Akamai CDN.

The illustrated deployment method for this architecture is via Terraform and Helm Charts.  Linode supports Terraform through the Linode Provider and Argo supports Argo Events Helm Chart and Argo Workflow Helm Chart for application deployment.  Our reference architecture also includes deployment automation using GitHub for source code and GitHub Actions for continuous delivery.  Finally, Argo configurations which include Event Sources, Sensors, Triggers, and Workflows are all set up using YAML files that can be applied through Kubectl or through Argo CLI.  There are a number of Argo Events YAML Configuration Examples as well as Argo Workflow YAML Configuration Examples to get you started.  The benefit of  this design is that the entire reference architecture from the infrastructure, to the application, to the application setup and configuration can be completely automated supporting cloud native and DevOps principles.

1. Starting at the left-hand side of the diagram we have content creators with the ability to ingest files into Linode Object Storage which is used as the content landing point.  Object storage can be set up to receive files from CLIs, programmatic integrations, and desktop tools such as Cyberduck.  Supported upload methods are described in the Linode Object Storage documentation. Additionally Linode Object Storage supports lifecycle policies so that we can automatically purge source files regularly. A purging policy should only be implemented if a separate system-of-record for your high resolution source content is maintained.

1. Argo Event Sources includes 20+ origination mechanisms that can be setup to generate event messages that are written to Argo Event Bus. In this reference architecture we have enabled a simple Webhook Event Source that a user or system can send and include the filename they are ingesting.

1. Argo Sensors is a configuration that maps well-defined Event Sources to a specific Argo Trigger. A Trigger is a definition of a target process to invoke. In our reference architecture the Trigger we have defined is an Argo Workflow. Specifically in this architecture we have defined a Sensor that will trigger a video transcoding workflow to convert the source file to an HLS adaptive bitrate output.

1. Argo Workflows at their core enable well-defined sequences of tasks that are described by Argo Templates. Workflows use a YAML-based syntax to describe a flow of actions that should occur on artifacts invoking activities such as file transfers, container commands, web requests, and data manipulation. Argo workflow orchestration manages dynamic pod scheduling in Kubernetes based on the steps and processes defined in the Workflow definition which live for the lifecycle of the workflow. In this reference architecture the following capabilities of Argo are highlighted to create our desired HLS outputs:

    1. In this reference architecture the workflow would create a persistent volume to be shared by all steps of the workflow where the source file and output files would reside. In essence this is a common file-based workspace for all steps of the workflow to leverage.

    1. Argo has integrated capabilities to communicate with S3 compliant storage so we used Linode Object Storage as our mechanism of source file input. Shown here is the file being transferred from Object Storage to the local persistent volume claim.

    1. MediaInfo and FFmpeg are two industry-standard open source tools for media processing workflows and are incorporated into this reference architecture using community-supported containers deployed in DockerHub to enable our desired outputs. At this step MediaInfo will gather file information about the source file to be used as part of the input for transcoding.

    1. FFmpeg is used to transcode and package the file in HLS format.

    1. MediaInfo gathers file information about the output files created in the previous step.

    1. FFmpeg can also be used to generate one or more thumbnails from the original source file.

1. HLS outputs that have completed their process can be uploaded to a defined destination on Linode Object Storage and serve as the origin for the Akamai Content Delivery Network. Shown towards the top of the diagram it is worth noting that this solution provides operational observability from a systems as well as a content management perspective. In particular, Argo Workflows UI provides insight into the media workflows that are in process, completed, or failed so that real-time visibility and operational error handling can be achieved.

1. Additionally, Prometheus and Grafana can provide system-wide metrics and observability to developers and site reliability engineers for managing the capacity, performance, and health of the overall infrastructure.

1. Finally, a combination of Cert-Manager, Let’s Encrypt, Nginx Ingress, Linode Node Balancers, and Linode DNS can be leveraged to enable communication with helpful internals of the application over a secure TLS connection. This includes the Argo Workflow UI, Grafana UI, and Argo Events Webhook. High availability, disaster recovery, and scaling considerations are all well-documented and capable of being supported on this architecture.
{#figure-3-description .large-diagram}