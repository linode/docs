---
author:
  name: Linode
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['bare metal','IaaS']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-22
modified_by:
  name: Linode
title: "Bare Metal Use Cases"
h1_title: "Use Cases for Linode Bare Metal Instances."
---

## Why Bare Metal

Bare Metal Linodes are single-tenant servers, giving you the utmost in control, security, and performance. This means that when you provision a Bare Metal Linode, you're getting an entire server with exclusive use of its underlying infrastructure processor and memory resources, rather than a virtual machine instance utilizing shared resources with other instances. Accordingly, Bare Metal Linodes come with several advantages:

-   **Top-tier infrastructure performance.** Free from the restrictions that come with virtual machines, Bare Metal Linodes are tailored for use cases that require the lowest possible latency and overhead.
-   **No CPU steal or noisy neighbors.** Like [Dedicated CPU Linodes](/docs/platform/dedicated-cpu/getting-started-with-dedicated-cpu/), Bare Metal Linodes won't experience CPU contention issues that may come with "noisy neighbors."
-   **Direct access to your hardware.** Bare Metal Linodes broaden the horizons of what you can build, allowing you to bring legacy systems and proprietary environments such as [VMware images](https://www.vmware.com/) or [Microsoft Windows](https://www.microsoft.com/en-us/software-download/windows10ISO) to the cloud.
-   **Security & Compliance.** Direct hardware access also gives you greater control over security and compliance requirements for standards like HIPAA and PCI DSS.
-   **Larger pool of resources.** As single-tenant servers, Bare Metal Linodes offer the most in terms of raw resources for potentially intensive workloads along with the best in per-capita cost efficiency.

## Bare Metal Use Cases

The advantages presented by Bare Metal Linodes can be particularly leveraged in these use cases:

-   [Nested Virtualization](#nested-virtualization)
-   [High Performance Databases](#high-performance-databases)
-   [Machine Learning](#machine-learning)
-   [Audio and Video Transcoding](#audio-and-video-transcoding)
-   [Big Data and Data Analysis](#big-data-and-data-analysis)
-   [Voice Over IP](#voice-over-ip)
-   [Legacy System Migration](#legacy-system-migration)
-   [Compliance with Security Standards](#compliance-with-security-standards)

### Nested Virtualization

Nested virtualization applications, such as those utilizing the [KVM](http://www.linux-kvm.org/page/Main_Page) and [Xen](https://xenproject.org/) hypervisors, are unable to run on virtual machine-based [Shared Linodes](/products/shared/). However, there are no such limitations on Bare Metal Linodes.

### High Performance Databases

Bare Metal Linodes offer the best option for large-scale, activity-intensive databases that require the utmost in read/write operation performance. Databases that prioritize scalability, portability, and agile deployment over performance may be better suited by [Block Storage](/docs/platform/block-storage/block-storage-use-cases/#databases).

### Machine Learning

[Machine learning](/docs/applications/big-data/how-to-move-machine-learning-model-to-production/) is a powerful approach to data science that uses large sets of data to build prediction algorithms. These prediction algorithms are commonly used in “recommendation” features on many popular music and video applications, online shops, and search engines. When you receive intelligent recommendations tailored to your own tastes, machine learning is often responsible. Other areas where you might find machine learning being used are in self-driving cars, process automation, security, marketing analytics, and health care.

Below is a list of common tools used for machine learning and AI that can be installed on a Bare Metal Linode:

-   [TensorFlow](https://www.tensorflow.org/) - a free, open-source, machine learning framework and deep learning library. Tensorflow was originally developed by Google for internal use and later fully released to the public under the Apache License.
-   [PyTorch](https://pytorch.org/) - a machine learning library for Python that uses the popular GPU-optimized Torch framework.
-   [Apache Mahout](https://mahout.apache.org/) - a scalable library of machine learning algorithms and  distributed linear algebra framework designed to let mathematicians, statisticians, and data scientists quickly implement their own algorithms.

### Audio and Video Transcoding

[Audio and Video Transcoding](/docs/applications/media-servers/) (AKA Video/Audio Encoding) is the process of taking a video or audio file from its original or source format and converting it to another format for use with a different device or tool. Because this is often a time-consuming and resource-intensive task, a Bare Metal, [Dedicated CPU](/docs/platform/dedicated-cpu/getting-started-with-dedicated-cpu/), or [Dedicated GPU](/docs/platform/linode-gpu/getting-started-with-gpu/) Linode are suggested to maximize performance. [FFmpeg](https://ffmpeg.org/) is a popular open source tool used specifically for the manipulation of audio and video, and is recommended for a wide variety of encoding tasks.

### Big Data and Data Analysis

[Big Data and Data Analysis](/docs/applications/big-data/) is the process of analyzing and extracting meaningful insights from datasets so large they often require specialized software and hardware. Big data is most easily recognized with the the **"three V's"** of big data:

-   **Volume:** Generally, if you are working with terabytes, petabytes, exabytes, or more amounts of information you are in the realm of big data.
-   **Velocity:** With Big Data, you are using data that is being created, called, moved, and interacted with at a high velocity. One example is the real time data generated on social media platforms by their users.
-   **Variety:** Variety refers to the many different types of data formats with which you may need to interact. Photos, video, audio, and documents can all be written and saved in a number of different formats. It is important to consider the variety of data that you will collect in order to appropriately categorize it.

Processing big data is often especially hardware-dependent. A Bare Metal Linode can give you access to the isolated resources often required to complete these tasks.

The following tools can be extremely useful when working with big data:

-   [Hadoop](/docs/databases/hadoop/how-to-install-and-set-up-hadoop-cluster/) - an Apache project for the creation of parallel processing applications on large data sets, distributed across networked nodes.
-   [Apache Spark](https://spark.apache.org/) - a unified analytics engine for large-scale data processing designed with speed and ease of use in mind.
-   [Apache Storm](https://storm.apache.org/) - a distributed computation system that processes streaming data in real time.

### Voice Over IP

System stability is paramount in providing consistent voice over IP (VOIP) performance, making Bare Metal Linodes a natural fit for large-scale VOIP applications that involve multiple concurrent connections.

Commonly-recommended software for implementing cloud-based VOIP systems include:

-   [FreePBX](https://www.freepbx.org/)
-   [Asterix](https://www.asterisk.org/)

### Legacy System Migration

Migrating legacy systems to the cloud to maintain business-critical workloads is often impossible without the ability to utilize virtual machine instances. While this would prevent migrating such systems to Linodes types that do not allow nested virtualization, Bare Metal Linodes have no such limitation.

### Compliance with Security Standards

Certain business must adhere to stringent standards such as [HIPAA and PCI DSS](/legal-compliance/) when managing data. Bare Metal Linodes, by virtue of single-tenancy, are best-suited for compliance with such standards as they provide the utmost in security and control over hardware resources.

## Where to Go From Here

If you're ready to get started with a Bare Metal Linode, our [Getting Started With Bare Metal](/docs/platform/bare-metal/getting-started-with-bare-metal/) guide will walk you through the process of an initial installation. Additionally, see our [Pricing Page](https://www.linode.com/pricing) for a rundown of both hourly and monthly costs.
