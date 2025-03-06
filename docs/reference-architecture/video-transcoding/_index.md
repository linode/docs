---
title: "Video Transcoding Reference Architecture"
description: "A scalable, portable, and cost-effective media processing workflow using Akamai Cloud Compute, Linode Kubernetes Engine, Akamai CDN, and a GitHub Actions."
published: 2023-12-19
license: "[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)"
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
---

## Abstract

This reference architecture provides a concrete example of how to create a scalable, portable, and cost-effective media processing workflow. A traditional Video On-Demand (VOD) workflow is demonstrated in which a source video is output to an online distribution format. The prescribed architecture for this workflow can be cost-effectively scaled and extended to the formats required for your video transcoding use-cases. Some use-cases addressed by this workflow include:

- Supporting content for blogs or social media
- Producing video or digital assets for streaming services
- Embedding content in business applications

Review the [video transcoding architecture diagrams](/docs/reference-architecture/video-transcoding/diagrams/) for a high-level depiction of a general video transcoding workflow, as well as a more granular version which prescribes specific technologies to implement the workflow.

## Technologies Used

The workflow in this document is implemented on the [Akamai Connected Cloud](https://www.akamai.com/) (in particular, the [Linode Kubernetes Engine](https://www.linode.com/products/kubernetes/)), Akamai CDN, and a GitHub Actions-powered CI/CD powered pipeline. The full accounting of technologies used includes:

- **Akamai Connected Cloud technologies**:

    | Technology                        | Description |
    |-----------------------------------|-------------|
    | [Linode Kubernetes Engine (LKE)](https://www.linode.com/products/kubernetes/)    | A fully-managed K8s container orchestration engine for deploying and managing containerized applications and workloads |
    | [NodeBalancers](https://www.linode.com/products/nodebalancers/)                     | Managed cloud load balancers |
    | [Object Storage](https://www.linode.com/products/object-storage/)                    | Amazon S3-compatible Object Storage, used to manage unstructured data like video files |
    | [Block Storage](https://www.linode.com/products/block-storage/)                           | Network-attached block file storage volumes |
    | [API](https://www.linode.com/products/linode-api/)                               | Programmatic access to Linode products and services |
    | [DNS Manager](https://www.linode.com/products/dns-manager/)                               | Domain management, free for Akamai Connected Cloud customers |

- **Other software and services**:

    | Technology | Description |
    |------------|-------------|
    | [Argo](https://argoproj.github.io/) | Kubernetes-native workflow engine |
    | [FFmpeg](https://ffmpeg.org/) | Encoding/decoding/transcoding multimedia framework |
    | [PyTranscoder](https://pytranscoder.readthedocs.io/en/latest/) | Python wrapper for FFmpeg |
    | [MediaInfo](https://mediaarea.net/en/MediaInfo) | Gathers metadata for audio/video files |
    | [GitHub](https://github.com/) | Git-based managed version control service |
    | [Terraform](https://www.terraform.io/) | Infrastructure-as-code provisioning tool |
    | [Helm](https://helm.sh/) | Package manager for Kubernetes |
    | [DockerHub](https://hub.docker.com/) | Container image library |
    | [Let’s Encrypt](https://letsencrypt.org/) | Free, automated, open certificate authority |
    | [cert-manager](https://cert-manager.io/) | Cloud native certificate management |
    | [NGINX](https://www.nginx.com/) | Load balancer, web server, and reverse proxy |
    | [Prometheus](https://prometheus.io/) | Monitoring system and time series database |
    | [Grafana](https://grafana.com/) | Observability platform |

## Business Benefits

- **Extensibility**: This reference architecture supports a myriad of media output format types and workflow step definitions. It can be configured to output to any device, platform, or audience specification.

- **Scalability**: This solution supports horizontal scalability by adding more Linodes within the Kubernetes cluster, which enables high throughput. Scaling this solution allows you to process a large amount of content in a short period of time. Scaling can support service launch or marketing campaign requirements.

- **Cost-effectiveness**: Traditional media workflows have to keep a deployed capacity for peak usage. This reference architecture is built on Kubernetes and uses the Argo workflow engine, which supports dynamic pod scheduling and tear-down. Because of this dynamic resource usage, your cost footprint can be minimized.