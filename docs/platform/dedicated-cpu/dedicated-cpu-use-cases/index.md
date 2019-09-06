---
author:
  name: Ryan Syracuse
  email: rsyracuse@linode.com
description: 'Dedicated CPU use cases.'
keywords: ["dedicated cpu", "use cases", "linode cpu", "machine learning", "big data"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2019-08-28
modified_by:
  name: Linode
published: 2019-09-05
title: Dedicated CPU Use Cases
---

## Why Dedicated CPU

Dedicated CPU Linodes offer a complement to CPU intensive tasks, and have the potential to significantly reduce issues that arise from shared cloud hosting environments. Normally, when creating a Linode via our standard plan, you are paying for access to virtualized CPU cores, which are allocated to you from a host's shared physical CPU. While a standard plan is designed to maximize performance, the reality of a shared virtualized environment is that your processes are scheduled to use the same physical CPU cores as other customers. This can equate to a level of competition that can result in **CPU steal**, or a higher wait time from the underlying hypervisor to the physical CPU.

*CPU Steal* can be defined more strictly as a measure of *expected* CPU cycles against *actual* CPU cycles as your virtualized environment is scheduled access to the physical CPU. Although this number is generally small enough that it does not heavily impact standard workloads and use cases, if you are expecting high and constant regular consumption of your CPU resources, then you are most at risk of being negatively impacted.

Dedicated CPU Linodes have private access to entire physical CPU cores, meaning no other Linodes will be able to have any processes on the same cores that you're using. Dedicated CPUs are therefore exempt from any competition for CPU resources and the potential problems that could arise because of CPU steal, and depending on your workload, you can experience an improvement in performance by using them.

## Dedicated CPU use cases

While a standard plan is usually a good fit for most use cases, a Dedicated CPU Linode can be recommended for a number of workloads related to high and constant CPU processing. A few of these are as follows:

  - [CI/CD Toolchains and Build Servers](#ci-cd-toolchains-and-build-servers)
  - [Game Servers](#game-servers)
  - [Audio and Video Transcoding](#audio-and-video-transcoding)
  - [Big Data and Data Analysis](#big-data-and-data-analysis)
  - [Scientific Computing](#scientific-computing)
  - [Machine Learning](#machine-learning)

### CI/CD Toolchains and Build Servers

CI and CD are abbreviations for *Continuous Integration* and *Continuous Delivery* respectively, referring to an active approach to DevOps that aims to reduce overall workloads by having teams automatically test and regularly implement small changes. This can help to prevent last minute conflicts and bugs, and keeps tasks on schedule. For more information on the specifics of CI and CD, see our [Introduction to CI/CD Guide](/docs/development/ci/introduction-ci-cd/).

In many cases, the CI/CD pipeline can become resource intensive as many new code changes are built and tested against your build server. When a Linode is used as a remote server and is expected to be regularly active, a dedicated CPU Linode can add an additional layer of speed and reliability to your toolchain.

### Game Servers

Dependent on the intensity of demands they place on your Linode, [game servers](/docs/game-servers/) may benefit from a Dedicated CPU. Modern multiplayer games need to coordinate with a high number of clients, and require the capability of syncing entire game worlds for each of these players. If CPU resources are not available, then players will experience issues like stuttering and lag. Below is a short list of a few popular games that may see some benefit:

- [ARK: Survival Evolved](/docs/platform/one-click/deploying-ark-survival-evolved-with-one-click-apps/)
- [Rust](/docs/platform/one-click/deploying-rust-with-one-click-apps/)
- [Minecraft](/docs/platform/one-click/deploying-minecraft-with-one-click-apps/)
- [CS:GO](/docs/platform/one-click/deploying-cs-go-with-one-click-apps/)
- [Team Fortress 2](/docs/platform/one-click/deploying-team-fortress-2-with-one-click-apps/)

### Audio and Video Transcoding

[Audio and Video Transcoding](/docs/applications/media-servers/) (AKA Video/Audio Encoding) is the process of taking a video or audio file from its original or source format and converting it to another format for use with a different device or tool. As this is in many cases a time consuming and resource intensive task, a dedicated CPU or [dedicated GPU](/docs/platform/linode-gpu/getting-started-with-gpu/) Linode are recommended to help maximize performance. [FFmpeg](https://ffmpeg.org/) is a popular open source tool used specifically for the manipulation of audio and video, and is recommended for a wide variety of Encoding tasks.

### Big Data and Data Analysis

[Big Data and Data Analysis](/docs/applications/big-data/) is the process of analyzing and extracting meaningful insights from datasets so large that often require specialized software and hardware. Big data can be most easily recognized if it can be confirmed with the the **"three V's"** of big data:

- **Volume:** Generally, if you are working with terabytes, petabytes, exabytes, or more amounts of information you are in the realm of big data.
- **Velocity:** With Big Data, you are using data that is being created, called, moved, and interacted with at a high velocity. One example is the real time data generated on social media platforms by their users.
- **Variety:** Variety refers to the many different types of data formats with which you may need to interact. Photos, video, audio, and documents can all be written and saved in a number of different formats. It is important to consider the variety of data that you will collect in order to appropriately categorize it.

Processing big data is often especially hardware dependent. A dedicated CPU can give you access to the isolated resources that are often required to complete these tasks.

The following tools can be extremely useful when working with big data:

- [Hadoop](/docs/databases/hadoop/how-to-install-and-set-up-hadoop-cluster/) - an Apache project that allows for the creation of parallel processing applications on large data sets, distributed across networked nodes.

- [Apache Spark](https://spark.apache.org/) - a unified analytics engine for large-scale data processing designed with speed and ease of use in mind.

- [Apache Storm](https://storm.apache.org/) - a distributed computation system that processes streaming data in real time.

### Scientific Computing

**Scientific Computing** is a term used to describe the process of using computing power to solve complex scientific problems that are either impossible, dangerous, or otherwise inconvenient to solve via traditional means. Often considered the "Third Pillar" of modern science behind Theoretical Analysis and Experimentation, Scientific Computing has quickly become a prevalent tool in scientific spaces.

Scientific Computing involves many intersecting skills and tools for a wide array of more specific use cases, though solving complex mathematical formulas that are dependent on significant computing power is considered to be standard. While there are a large number of open source software tools available, below are two general purpose tools that we can recommend to get started with scientific computing.

- [Jupyter Notebook](https://jupyter.org/)
- [Numpy](https://numpy.org/)

It's worth keeping in mind that beyond general use cases, there are many more example of tools and software available often designed for use with individual fields of science.

### Machine Learning

[Machine learning](/docs/applications/big-data/how-to-move-machine-learning-model-to-production/) is a powerful approach to data science that uses large sets of data to build prediction algorithms. These prediction algorithms are commonly used in “recommendation” features on many popular music and video applications, online shops, and search engines. When you receive intelligent recommendations tailored to your own tastes, machine learning is often responsible. Other areas where you might find machine learning being used are in self-driving cars, process automation, security, marketing analytics, and health care.

Below is a list of common tools used for machine learning and AI that can be installed on a Linode CPU instance:

- [TensorFlow](https://www.tensorflow.org/) - a free, open-source, machine learning framework, and deep learning library. Tensorflow was originally developed by Google for internal use and later fully released to the public under the Apache License.

- [PyTorch](https://pytorch.org/) - a machine learning library for Python that uses the popular GPU optimized Torch framework.

- [Apache Mahout](https://mahout.apache.org/) - a scalable library of machine learning algorithms, and a distributed linear algebra framework designed to let mathematicians, statisticians, and data scientists quickly implement their own algorithms.

## Where to Go From Here

If you're ready to get started with a Dedicated CPU Linode, our [Getting Started With Dedicated CPU](/docs/platform/dedicated-cpu/getting-started-with-dedicated-cpu/index.md) guide will walk you through the process of an initial installation. Additionally, see our [Pricing Page](https://www.linode.com/pricing) for a rundown on both hourly and monthly costs.
