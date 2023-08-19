---
title: "GPU Compute Instances"
linkTitle: "GPU"
description: "Virtual machines equipped with NVIDIA Quadro GPUs that are ideal for complex processing and GPU-optimized workloads."
published: 2023-01-18
modified: 2023-02-14
aliases: ['/products/compute/gpu/','/platform/linode-gpu/why-linode-gpu/','/guides/why-linode-gpu/','/products/compute/gpu/guides/use-cases/']
---

Scientists, artists, and engineers need access to significant parallel computational power. Linode offers GPU-optimized virtual machines accelerated by the NVIDIA Quadro RTX 6000, harnessing the power of CUDA, Tensor, and RT cores to execute complex processing, deep learning, and ray tracing workloads.

**GPU plans are ideal for highly specialized workloads that would benefit from dedicated NVIDIA GPUs, including machine learning, AI, and data/graphics processing.**

## On-demand

Between purchasing, installing, and maintaining GPUs, the cost of ownership is often high. GPU Compute Instances allow you to leverage the power of GPUs while benefiting from the main value proposition of cloud: turning a CapEx into an OpEx.

## Market Leading Hardware

Linode uses NVIDIA Quadro RTX 6000 GPUs, currently considered one of the best in market. With CUDA, Tensor, and RT cores in each unit, these GPUs support any use cases associated with parallel processing, deep learning, or ray tracing. See [GPU Specifications](#gpu-specifications) below for more details.

One GPU card isn’t enough for your projected workloads? Not a problem. Linode GPU plans offer up to four cards per instance, depending on how much horsepower you need.

## Dedicated Competition-Free Resources

A GPU Compute Instance's vCPU cores are dedicated and accessible only to you. Because the vCPU cores are not shared, no other Compute Instances can utilize them. Your instance never has to wait for another process, enabling your software to run at peak speed and efficiency. This allows you to run workloads that require full-duty work (100% CPU all day, every day) at peak performance.

## Recommended Workloads

GPU Compute Instances are suitable for specialized workloads that are optimized for GPUs:

- Machine learning and AI
- Big data processing
- Video encoding
- Graphics processing

See the [Use Cases for Linode GPU Instances](#gpu-use-cases) section to learn more about these use cases.

## Availability

Atlanta, GA, United States; Frankfurt, Germany; Newark, NJ, United States; Mumbai, India; Singapore, Singapore

## Plans and Pricing

| Resource | Available Plans |
| -- | -- |
| GPU cards | 1-4 cards |
| GPU Memory (VRAM) | 24 GB - 96 GB |
| vCPU cores | 8-24 cores (dedicated) |
| Memory (RAM) | 32 GB - 128 GB |
| Storage | 640 GB - 2560 GB |
| Outbound Network Transfer | 16 TB - 20 TB |
| Outbound Network Bandwidth | 10 Gbps |

Pricing starts at $1,000/mo ($1.50/hr) for a GPU Instance with 1 GPU card, 8 vCPU cores, 32 GB of memory, and 640 GB of SSD storage. Review the [Pricing page](https://www.linode.com/pricing/#row--compute) for additional plans and their associated costs. Review the [Compute Instance Plan Types](/docs/products/compute/compute-instances/plans/) page below to learn more about other instance types.

{{< content "gpu-deposit-shortguide" >}}

## GPU Specifications

Each of the NVIDIA Quadro RTX 6000 GPUs on the Linode Platform are equipped the following specifications:

| Specification | Value |
| -- | -- |
| GPU Memory (VRAM) | 24 GB GDDR6 |
| CUDA Cores (Parallel-Processing) | 4,608 |
| Tensor Cores (Machine & Deep Learning) | 576 |
| RT Cores (Ray Tracing) | 72 |
| RTX-OPS | 84T |
| FP32 Performance | 16.3 TFLOPS |

## What are GPUs?

GPUs (Graphical Processing Units) are specialized hardware originally created to manipulate computer graphics and image processing. GPUs are designed to process large blocks of data in parallel making them excellent for compute intensive tasks that require thousands of simultaneous threads. Because a GPU has significantly more logical cores than a standard CPU, it can perform computations that process large amounts of data in parallel, more efficiently. This means GPUs accelerate the large calculations that are required by big data, video encoding, AI, and machine learning.

Linode GPU Instances include NVIDIA Quadro RTX 6000 GPU cards with Tensor, ray tracing (RT), and CUDA cores. Read more about the NVIDIA RTX 6000 [here](https://www.nvidia.com/content/dam/en-zz/Solutions/design-visualization/technologies/turing-architecture/NVIDIA-Turing-Architecture-Whitepaper.pdf).

## GPU Use Cases

### Machine Learning and AI

Machine learning is a powerful approach to data science that uses large sets of data to build prediction algorithms. These prediction algorithms are commonly used in “recommendation” features on many popular music and video applications, online shops, and search engines. When you receive intelligent recommendations tailored to your own tastes, machine learning is often responsible. Other areas where you might find machine learning being used is in self-driving cars, process automation, security, marketing analytics, and health care.

AI (Artificial Intelligence) is a broad concept that describes technology designed to behave intelligently and mimic the cognitive functions of humans, like learning, decision making, and speech recognition. AI uses large sets of data to learn and adapt in order to achieve a specific goal. GPUs provide the processing power needed for common AI and machine learning tasks like input data preprocessing and model building.

Below is a list of common tools used for machine learning and AI that can be installed on a Linode GPU instance:

- [TensorFlow](https://www.tensorflow.org) - a free, open-source, machine learning framework, and deep learning library. Tensorflow was originally developed by [Google](http://google.com) for internal use and later fully released to the public under the Apache License.

- [PyTorch](https://pytorch.org/) - a machine learning library for Python that uses the popular GPU optimized [Torch](https://en.wikipedia.org/wiki/Torch_(machine_learning)) framework.

- [Apache Mahout](https://mahout.apache.org/) - a scalable library of machine learning algorithms, and a distributed linear algebra framework designed to let mathematicians, statisticians, and data scientists quickly implement their own algorithms.

### Big Data

Big data is a discipline that analyzes and extracts meaningful insights from large and complex data sets. These sets are so large and complex that they require specialized software and hardware to appropriately capture, manage, and process the data. When thinking of big data and whether or not the term applies to you, it often helps to visualize the “three Vs”:

- **Volume:** Generally, if you are working with terabytes, exabytes, petabytes, or more amounts of information you are in the realm of big data.

- **Velocity:** With Big Data, you’re using data that is being created, called, moved, and interacted with at a high velocity. One example is the real time data generated on social media platforms by its users.

- **Variety:** Variety refers to the many different types of data formats with which you may need to interact. Photos, video, audio, and documents can all be written and saved in a number of different formats. It is important to consider the variety of data that you will collect in order to appropriately categorize it.

GPUs can help give Big Data systems the additional computational capabilities they need for ideal performance. Below are a few examples of tools which you can use for your own big data solutions:

- [Hadoop](https://hadoop.apache.org/) - an Apache project that allows the creation of parallel processing applications on large data sets, distributed across networked nodes.

- [Apache Spark](https://spark.apache.org/) - a unified analytics engine for large-scale data processing designed with speed and ease of use in mind.

- [Apache Storm](https://storm.apache.org/) - a distributed computation system that processes streaming data in real time.

### Video Encoding

Video Encoding is the process of taking a video file's original source format and converting it to another format that is viewable on a different device or using a different tool. This resource intensive task can be greatly accelerated using the power of GPUs.

- [FFmpeg](https://developer.nvidia.com/ffmpeg) - a popular open-source multimedia manipulation framework that supports a large number of video formats.

### General Purpose Computing using CUDA

CUDA (Compute Unified Device Architecture) is a parallel computing platform and API that allows you to interact more directly with the GPU for general purpose computing. In practice, this means that a developer can write code in C, C++, or many other supported languages utilizing  their GPU to create their own tools and programs.

If you're interested in using CUDA on your GPU Linode, see the following resources:

- [NVIDIA's Library of Documentation](https://docs.nvidia.com/cuda/)

- [Introduction to CUDA](https://devblogs.nvidia.com/easy-introduction-cuda-c-and-c/)

- [NVIDIA's CUDA exercise repository](https://github.com/csc-training/CUDA/tree/master/exercises)

### Graphics Processing

One of the most traditional use cases for a GPU is graphics processing. Transforming a large set of pixels or vertices with a shader or simulating realistic lighting via ray tracing are massive parallel processing tasks. Ray tracing is a computationally intensive process that simulates lights in a scene and renders the reflections, refractions, shadows, and indirect lighting. It's impossible to do on GPUs in real-time without hardware-based ray tracing acceleration. The Linode GPU Instances offers real-time ray tracing capabilities using a single GPU.

New to the NVIDIA RTX 6000 are the following shading enhancements:

- Mesh shading models for vertex, tessellation, and geometry stages in the graphics pipeline
- Variable Rate Shading to dynamically control shading rate
- Texture-Space Shading which utilizes a private memory held texture space
- Multi-View Rendering allowing for rendering multiple views in a single pass.