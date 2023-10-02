---
title: "Dedicated CPU Compute Instances"
linkTitle: "Dedicated CPU"
description: "Dedicated CPU Compute Instances are virtual machines that provide gauranteed CPU resources. They are ideal for a variety of production applications and CPU-intensive workloads."
published: 2023-01-18
modified: 2023-03-31
aliases: ['/products/compute/dedicated-cpu/','/platform/dedicated-cpu/getting-started-with-dedicated-cpu/','/guides/getting-started-with-dedicated-cpu/','/platform/dedicated-cpu/dedicated-cpu-use-cases/','/guides/dedicated-cpu-use-cases/','/platform/dedicated-cpu/','/guides//platform/dedicated-cpu/']
tags: ["media"]
---

Dedicated CPU Compute Instances are virtual machines that provide you with dedicated CPU resources. Their vCPU cores are guaranteed (and, thus, competition-free) so there are no surprises or CPU-related performance degradation. This enables you to run your production applications with confidence that your performance won't be impacted by others. These Compute Instances are CPU-optimized and can sustain CPU resource usage at 100% for as long as your workloads need.

**Dedicated CPU plans are ideal for nearly all production applications and CPU-intensive workloads, including high traffic websites, video encoding, machine learning, and data processing.** If your application would benefit from dedicated CPU cores as well as a larger amounts of memory, see [High Memory Compute Instances](/docs/products/compute/compute-instances/plans/high-memory/).

## Dedicated Competition-Free Resources

A Dedicated CPU Compute Instance provides entire vCPU cores accessible only to you. Because the vCPU cores are not shared, no other Compute Instances can utilize them. Your instance never has to wait for another process, enabling your software to run at peak speed and efficiency. This allows you to run workloads that require full-duty work (100% CPU all day, every day) at peak performance.

## Upgrading from a Shared CPU Instance

Moving from a Shared CPU Instance to a Dedicated CPU Instance is a seamless process that can positively impact your applications and users. Review the [Choosing Between Shared and Dedicated CPUs (and Determining When to Upgrade)](/docs/guides/comparing-shared-and-dedicated-cpus/) guide to learn more about the differences between Shared and Dedicated CPU plans and when each one might be appropriate. This guide also shows you how to investigate your CPU performance to determine if your application is experiencing resource contention on a Shared CPU Compute Instance. If you wish to upgrade, reference the [Resize a Compute Instance](/docs/products/compute/compute-instances/guides/resize/) guide for more details on resizing your Linode to a different plan type.

## Recommended Workloads

Dedicated CPU Compute Instances are suitable for almost any workload that requires consistently high performant CPU resources. This includes:

- Production websites and e-commerce sites
- Applications that required 100% sustained CPU usage.
- Applications that might be impacted by resource contention.
- [CI/CD](/docs/guides/introduction-ci-cd/) toolchains and build servers
- [Game servers](/docs/game-servers/) (like Minecraft or Team Fortress)
- [Audio and video transcoding](/docs/applications/media-servers/)
- [Big data](/docs/applications/big-data/) (and data analysis)
- Scientific computing
- [Machine learning](/docs/guides/how-to-move-machine-learning-model-to-production/) and AI
- High Traffic Databases (Galera, PostgreSQL with Replication Manager, MongoDB using Replication Sets)
- Replicated or Distributed Filesystems (GlusterFS, DRBD)

For more details and use cases, see the [Use Cases for Dedicated CPU Instances](#dedicated-cpu-use-cases) section.

## Availability

Dedicated CPU instances are available across [all regions](https://www.linode.com/global-infrastructure/).

## Plans and Pricing

| Resource | Available Plans |
| -- | -- |
| vCPU cores | 2-64 cores |
| Memory | 4 GB - 512 GB |
| Storage | 80 GB - 7200 GB |
| Outbound Network Transfer | 4 TB - 12 TB |
| Outbound Network Bandwidth | 4 Gbps - 12 Gbps |

Pricing starts at $36 for a Dedicated CPU Compute Instance with 2 vCPU cores, 4GB memory, and 80GB SSD storage. Review the [Pricing page](https://www.linode.com/pricing/#compute-dedicated) for additional plans and their associated costs. Review the [Compute Instance Plan Types](/docs/products/compute/compute-instances/plans/) page below to learn more about other instance types.

## Dedicated CPU Use Cases

While a shared plan is usually a good fit for most use cases, a Dedicated CPU Linode may be recommended for a number of workloads related to high and constant CPU processing. Such examples include:

  - [CI/CD Toolchains and Build Servers](#ci-cd-toolchains-and-build-servers)
  - [Game Servers](#game-servers)
  - [Audio and Video Transcoding](#audio-and-video-transcoding)
  - [Big Data and Data Analysis](#big-data-and-data-analysis)
  - [Scientific Computing](#scientific-computing)
  - [Machine Learning](#machine-learning)

### CI/CD Toolchains and Build Servers

CI and CD are abbreviations for *Continuous Integration* and *Continuous Delivery*, respectively, and refer to an active approach to DevOps that reduces overall workloads by automatically testing and regularly implementing small changes. This can help to prevent last-minute conflicts and bugs, and keeps tasks on schedule. For more information on the specifics of CI and CD, see our [Introduction to CI/CD Guide](/docs/guides/introduction-ci-cd/).

In many cases, the CI/CD pipeline can become resource-intensive if many new code changes are built and tested against your build server. When a Linode is used as a remote server and is expected to be regularly active, a Dedicated CPU Linode can add an additional layer of speed and reliability to your toolchain.

### Game Servers

Depending on the intensity of demands they place on your Linode, [game servers](/docs/game-servers/) may benefit from a Dedicated CPU. Modern multiplayer games need to coordinate with a high number of clients, and require syncing entire game worlds for each player. If CPU resources are not available, then players will experience issues like stuttering and lag. Below is a short list of popular games that may benefit from a Dedicated CPU:

- [ARK: Survival Evolved](/docs/products/tools/marketplace/guides/ark-survival-evolved/)
- [Rust](/docs/products/tools/marketplace/guides/rust/)
- [Minecraft](/docs/products/tools/marketplace/guides/minecraft/)
- [CS:GO](/docs/products/tools/marketplace/guides/counter-strike-go/)
- [Team Fortress 2](/docs/products/tools/marketplace/guides/team-fortress-2/)

### Audio and Video Transcoding

[Audio and Video Transcoding](/docs/applications/media-servers/) (AKA Video/Audio Encoding) is the process of taking a video or audio file from its original or source format and converting it to another format for use with a different device or tool. Because this is often a time-consuming and resource-intensive task, a Dedicated CPU or [Dedicated GPU](/docs/products/compute/compute-instances/get-started/) Linode are suggested to maximize performance. [FFmpeg](https://ffmpeg.org/) is a popular open source tool used specifically for the manipulation of audio and video, and is recommended for a wide variety of encoding tasks.

### Big Data and Data Analysis

[Big Data and Data Analysis](/docs/applications/big-data/) is the process of analyzing and extracting meaningful insights from datasets so large they often require specialized software and hardware. Big data is most easily recognized with the **"three V's"** of big data:

- **Volume:** Generally, if you are working with terabytes, petabytes, exabytes, or more amounts of information you are in the realm of big data.
- **Velocity:** With Big Data, you are using data that is being created, called, moved, and interacted with at a high velocity. One example is the real time data generated on social media platforms by their users.
- **Variety:** Variety refers to the many different types of data formats with which you may need to interact. Photos, video, audio, and documents can all be written and saved in a number of different formats. It is important to consider the variety of data that you will collect in order to appropriately categorize it.

Processing big data is often especially hardware-dependent. A Dedicated CPU can give you access to the isolated resources often required to complete these tasks.

The following tools can be extremely useful when working with big data:

- [Hadoop](/docs/guides/how-to-install-and-set-up-hadoop-cluster/) - an Apache project for the creation of parallel processing applications on large data sets, distributed across networked nodes.

- [Apache Spark](https://spark.apache.org/) - a unified analytics engine for large-scale data processing designed with speed and ease of use in mind.

- [Apache Storm](https://storm.apache.org/) - a distributed computation system that processes streaming data in real time.

### Scientific Computing

**Scientific Computing** is a term used to describe the process of using computing power to solve complex scientific problems that are either impossible, dangerous, or otherwise inconvenient to solve via traditional means. Often considered the "Third Pillar" of modern science behind Theoretical Analysis and Experimentation, Scientific Computing has quickly become a prevalent tool in scientific spaces.

Scientific Computing involves many intersecting skills and tools for a wide array of more specific use cases, though solving complex mathematical formulas dependent on significant computing power is considered to be standard. While there are a large number of open source software tools available, below are two general purpose tools we can recommend to get started with Scientific Computing.

- [Jupyter Notebook](https://jupyter.org/)
- [Numpy](https://numpy.org/)

It's worth keeping in mind that, beyond general use cases, there are many more example of tools and software available and often designed for individual fields of science.

### Machine Learning

[Machine learning](/docs/guides/how-to-move-machine-learning-model-to-production/) is a powerful approach to data science that uses large sets of data to build prediction algorithms. These prediction algorithms are commonly used in “recommendation” features on many popular music and video applications, online shops, and search engines. When you receive intelligent recommendations tailored to your own tastes, machine learning is often responsible. Other areas where you might find machine learning being used are in self-driving cars, process automation, security, marketing analytics, and health care.

Below is a list of common tools used for machine learning and AI that can be installed on a Linode CPU instance:

- [TensorFlow](https://www.tensorflow.org/) - a free, open-source, machine learning framework and deep learning library. Tensorflow was originally developed by Google for internal use and later fully released to the public under the Apache License.

- [PyTorch](https://pytorch.org/) - a machine learning library for Python that uses the popular GPU-optimized Torch framework.

- [Apache Mahout](https://mahout.apache.org/) - a scalable library of machine learning algorithms and  distributed linear algebra framework designed to let mathematicians, statisticians, and data scientists quickly implement their own algorithms.