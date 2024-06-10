---
title: Large Diagram
---


## Large Diagram 1 With Title

![Figure 3](large.svg?diagram-description-id=figure-3-description-1 "Diagram Title")

Figure 3 is the built-out reference architecture that includes:

* A CI/CD workflow using GitOps at the bottom of the diagram
* A media processing lifecycle management workflow application built in Linode Kubernetes Engine using Argo Events and Argo Workflows
* Content distribution using Akamai CDN.

The illustrated deployment method for this architecture is via Terraform and Helm Charts.  Linode supports Terraform through the Linode Provider and Argo supports Argo Events Helm Chart and Argo Workflow Helm Chart for application deployment.  Our reference architecture also includes deployment automation using GitHub for source code and GitHub Actions for continuous delivery.  Finally, Argo configurations which include Event Sources, Sensors, Triggers, and Workflows are all set up using YAML files that can be applied through Kubectl or through Argo CLI.  There are a number of Argo Events YAML Configuration Examples as well as Argo Workflow YAML Configuration Examples to get you started.  The benefit of  this design is that the entire reference architecture from the infrastructure, to the application, to the application setup and configuration can be completely automated supporting cloud native and DevOps principles.

1. Starting at the left-hand side of the diagram we have content creators with the ability to ingest files into Linode Object Storage which is used as the content landing point.  Object storage can be set up to receive files from CLIs, programmatic integrations, and desktop tools such as Cyberduck.  Supported upload methods are described in the Linode Object Storage documentation. Additionally Linode Object Storage supports lifecycle policies so that we can automatically purge source files regularly. A purging policy should only be implemented if a separate system-of-record for your high resolution source content is maintained.

1. Argo Event Sources includes 20+ origination mechanisms that can be setup to generate event messages that are written to Argo Event Bus. In this reference architecture we have enabled a simple Webhook Event Source that a user or system can send and include the filename they are ingesting.

1. Argo Sensors is a configuration that maps well-defined Event Sources to a specific Argo Trigger. A Trigger is a definition of a target process to invoke. In our reference architecture the Trigger we have defined is an Argo Workflow. Specifically in this architecture we have defined a Sensor that will trigger a video transcoding workflow to convert the source file to an HLS adaptive bitrate output.

1.  Argo Workflows at their core enable well-defined sequences of tasks that are described by Argo Templates. Workflows use a YAML-based syntax to describe a flow of actions that should occur on artifacts invoking activities such as file transfers, container commands, web requests, and data manipulation. Argo workflow orchestration manages dynamic pod scheduling in Kubernetes based on the steps and processes defined in the Workflow definition which live for the lifecycle of the workflow. In this reference architecture the following capabilities of Argo are highlighted to create our desired HLS outputs.

    1.  In this reference architecture the workflow would create a persistent volume to be shared by all steps of the workflow where the source file and output files would reside. In essence this is a common file-based workspace for all steps of the workflow to leverage.

    1.  Argo has integrated capabilities to communicate with S3 compliant storage so we used Linode Object Storage as our mechanism of source file input. Shown here is the file being transferred from Object Storage to the local persistent volume claim.

    1.  MediaInfo and FFmpeg are two industry-standard open source tools for media processing workflows and are incorporated into this reference architecture using community-supported containers deployed in DockerHub to enable our desired outputs. At this step MediaInfo will gather file information about the source file to be used as part of the input for transcoding.

    1.  FFmpeg is used to transcode and package the file in HLS format.

    1.  MediaInfo gathers file information about the output files created in the previous step.

    1.  FFmpeg can also be used to generate one or more thumbnails from the original source file.

1. HLS outputs that have completed their process can be uploaded to a defined destination on Linode Object Storage and serve as the origin for the Akamai Content Delivery Network. Shown towards the top of the diagram it is worth noting that this solution provides operational observability from a systems as well as a content management perspective. In particular, Argo Workflows UI provides insight into the media workflows that are in process, completed, or failed so that real-time visibility and operational error handling can be achieved.

1. Additionally, Prometheus and Grafana can provide system-wide metrics and observability to developers and site reliability engineers for managing the capacity, performance, and health of the overall infrastructure.

1. Finally, a combination of Cert-Manager, Let’s Encrypt, Nginx Ingress, Linode Node Balancers, and Linode DNS can be leveraged to enable communication with helpful internals of the application over a secure TLS connection. This includes the Argo Workflow UI, Grafana UI, and Argo Events Webhook. High availability, disaster recovery, and scaling considerations are all well-documented and capable of being supported on this architecture.
{#figure-3-description-1 .large-diagram}

## Large Diagram 2 Without Title

![Figure 3](large.svg?diagram-description-id=figure-3-description-2)

Figure 3 is the built-out reference architecture that includes:

* A CI/CD workflow using GitOps at the bottom of the diagram
* A media processing lifecycle management workflow application built in Linode Kubernetes Engine using Argo Events and Argo Workflows
* Content distribution using Akamai CDN.

The illustrated deployment method for this architecture is via Terraform and Helm Charts.  Linode supports Terraform through the Linode Provider and Argo supports Argo Events Helm Chart and Argo Workflow Helm Chart for application deployment.  Our reference architecture also includes deployment automation using GitHub for source code and GitHub Actions for continuous delivery.  Finally, Argo configurations which include Event Sources, Sensors, Triggers, and Workflows are all set up using YAML files that can be applied through Kubectl or through Argo CLI.  There are a number of Argo Events YAML Configuration Examples as well as Argo Workflow YAML Configuration Examples to get you started.  The benefit of  this design is that the entire reference architecture from the infrastructure, to the application, to the application setup and configuration can be completely automated supporting cloud native and DevOps principles.

1. Starting at the left-hand side of the diagram we have content creators with the ability to ingest files into Linode Object Storage which is used as the content landing point.  Object storage can be set up to receive files from CLIs, programmatic integrations, and desktop tools such as Cyberduck.  Supported upload methods are described in the Linode Object Storage documentation. Additionally Linode Object Storage supports lifecycle policies so that we can automatically purge source files regularly. A purging policy should only be implemented if a separate system-of-record for your high resolution source content is maintained.

1. Argo Event Sources includes 20+ origination mechanisms that can be setup to generate event messages that are written to Argo Event Bus. In this reference architecture we have enabled a simple Webhook Event Source that a user or system can send and include the filename they are ingesting.

1. Argo Sensors is a configuration that maps well-defined Event Sources to a specific Argo Trigger. A Trigger is a definition of a target process to invoke. In our reference architecture the Trigger we have defined is an Argo Workflow. Specifically in this architecture we have defined a Sensor that will trigger a video transcoding workflow to convert the source file to an HLS adaptive bitrate output.

1.  Argo Workflows at their core enable well-defined sequences of tasks that are described by Argo Templates. Workflows use a YAML-based syntax to describe a flow of actions that should occur on artifacts invoking activities such as file transfers, container commands, web requests, and data manipulation. Argo workflow orchestration manages dynamic pod scheduling in Kubernetes based on the steps and processes defined in the Workflow definition which live for the lifecycle of the workflow. In this reference architecture the following capabilities of Argo are highlighted to create our desired HLS outputs.

    1.  In this reference architecture the workflow would create a persistent volume to be shared by all steps of the workflow where the source file and output files would reside. In essence this is a common file-based workspace for all steps of the workflow to leverage.

    1.  Argo has integrated capabilities to communicate with S3 compliant storage so we used Linode Object Storage as our mechanism of source file input. Shown here is the file being transferred from Object Storage to the local persistent volume claim.

    1.  MediaInfo and FFmpeg are two industry-standard open source tools for media processing workflows and are incorporated into this reference architecture using community-supported containers deployed in DockerHub to enable our desired outputs. At this step MediaInfo will gather file information about the source file to be used as part of the input for transcoding.

    1.  FFmpeg is used to transcode and package the file in HLS format.

    1.  MediaInfo gathers file information about the output files created in the previous step.

    1.  FFmpeg can also be used to generate one or more thumbnails from the original source file.

1. HLS outputs that have completed their process can be uploaded to a defined destination on Linode Object Storage and serve as the origin for the Akamai Content Delivery Network. Shown towards the top of the diagram it is worth noting that this solution provides operational observability from a systems as well as a content management perspective. In particular, Argo Workflows UI provides insight into the media workflows that are in process, completed, or failed so that real-time visibility and operational error handling can be achieved.

1. Additionally, Prometheus and Grafana can provide system-wide metrics and observability to developers and site reliability engineers for managing the capacity, performance, and health of the overall infrastructure.

1. Finally, a combination of Cert-Manager, Let’s Encrypt, Nginx Ingress, Linode Node Balancers, and Linode DNS can be leveraged to enable communication with helpful internals of the application over a secure TLS connection. This includes the Argo Workflow UI, Grafana UI, and Argo Events Webhook. High availability, disaster recovery, and scaling considerations are all well-documented and capable of being supported on this architecture.
{#figure-3-description-2 .large-diagram}