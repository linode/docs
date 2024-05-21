---
title: "GPU Compute Instances"
description: "Virtual machines equipped with NVIDIA Quadro GPUs that are ideal for complex processing and GPU-optimized workloads."
published: 2023-01-18
modified: 2024-05-21
linkTitle: "GPU"
aliases: ['/products/compute/gpu/','/platform/linode-gpu/why-linode-gpu/','/guides/why-linode-gpu/','/products/compute/gpu/guides/use-cases/']
---

Scientists, artists, and engineers need access to significant parallel computational power. Akamai Cloud Computing offers GPU-optimized virtual machines accelerated by NVIDIA RTX 4000 Ada (Beta) or NVIDIA Quadro RTX 6000. These GPU compute instances harness the power of CUDA, Tensor, and RT cores to execute complex processing, transcoding, and ray tracing workloads.

GPU plans using NVIDIA Quadro RTX 6000 were first introduced in 2019 and have limited deployment availability. The new NVIDIA RTX 4000 Ada GPU plans are being tested by Beta customers. You can register your interest in the new plans by completing the [Reservation Request Form](https://www.linode.com/products/gpu/#gpu-form).

**GPU plans are ideal for highly specialized workloads that would benefit from dedicated NVIDIA GPUs, including machine learning, AI inferencing, graphics processing, and big data analysis.**

## On-demand

When the costs associated with purchasing, installing, and maintaining GPUs are taken into account, the overall cost of ownership is often high. GPU Compute Instances allow you to leverage the power of GPUs while benefiting from the main value proposition of cloud: turning a CapEx into an OpEx.

## Market Leading Hardware

Akamai Cloud Computing uses industry-leading NVIDIA GPUs with CUDA, Tensor, and RT cores in each unit. These GPUs support use cases associated with parallel processing, transcoding, and ray tracing. See [GPU Specifications](#gpu-specifications) for more details.

If one GPU card isn’t enough for your projected workloads, Akamai Cloud Computing offers GPU plans with up to eight cards per instance.

## Dedicated Competition-Free Resources

A GPU Compute Instance's vCPU cores are dedicated, not shared, and accessible only to you. Your instance never has to wait for another process, enabling your software to run at peak speed and efficiency. This allows you to run workloads that require full-duty work (100% CPU all day, every day) at peak performance.

## Recommended Workloads

GPU Compute Instances are suitable for specialized workloads that are optimized for GPUs:

- Video encoding
- Graphics processing
- AI inferencing
- Big data analysis

See [GPU Use Cases](#gpu-use-cases) to learn more.

## Availability


| GPU Plan | Regions |
| -- | -- |
| NVIDIA RTX 4000 Ada (Beta) | Seattle, WA, US; Chicago, IL, US; Paris, FR; Osaka, JP |
| NVIDIA Quadro RTX 6000 | Atlanta, GA, US; Newark, NJ, US; Frankfurt, DE; Mumbai, IN; Singapore, SG |

## Plans and Pricing

| Resource | NVIDIA RTX 4000 Ada (Beta) | NVIDIA Quadro RTX 6000
| -- | -- | -- |
| GPU cards | 1-8 | 1-4 |
| GPU Memory (VRAM) | 20 GB - 160 GB |24 GB - 96 GB |
| vCPU cores (dedicated) | 20 - 60 cores | 8-24 cores |
| Memory (RAM) | 64 GB - 512 GB | 32 GB - 128 GB |
| Storage | 1.5 TB - 12 TB | 640 GB - 2560 GB |
| Outbound Network Transfer | 10 TB - 25 TB | 16 TB - 20 TB |
| Outbound Network Bandwidth | 10 Gbps | 10 Gbps |

Pricing starts at $600/mo ($0.83/hr) for an NVIDIA RTX 4000 Ada GPU Instance (Beta) with 1 GPU card, 20 vCPU cores, 64 GB of memory, and 1.5 TB of SSD storage. Pricing starts at $1,000/mo ($1.50/hr) for an NVIDIA Quadro RTX 6000 GPU Instance with 1 GPU card, 8 vCPU cores, 32 GB of memory, and 640 GB of SSD storage.

Review the [Pricing page](https://www.linode.com/pricing/#row--compute) for additional plans and their associated costs. Review the [Compute Instance Plan Types](/docs/products/compute/compute-instances/plans/) page to learn more about other instance types.

{{% content "gpu-deposit-shortguide" %}}

## GPU Specifications

Each of the NVIDIA RTX 4000 Ada GPUs (Beta) is equipped the following specifications:

| Specification | Value |
| -- | -- |
| GPU Memory (VRAM) | 20 GB GDDR6 |
| CUDA Cores (Parallel-Processing) | 6144 |
| Tensor Cores (Transcoding) | 192 |
| RT Cores (Ray Tracing) | 48 |
| FP32 Performance | 26.7 TFLOPS |

Each of the NVIDIA Quadro RTX 6000 GPUs is equipped the following specifications:

| Specification | Value |
| -- | -- |
| GPU Memory (VRAM) | 24 GB GDDR6 |
| CUDA Cores (Parallel-Processing) | 4608 |
| Tensor Cores (Transcoding) | 576 |
| RT Cores (Ray Tracing) | 72 |
| FP32 Performance | 16.3 TFLOPS |

## What are GPUs?

GPUs (Graphical Processing Units) are specialized hardware originally created to manipulate computer graphics and process images. GPUs are designed to process large blocks of data in parallel making them excellent for compute intensive tasks that require thousands of simultaneous threads. Because a GPU has significantly more logical cores than a standard CPU, it can perform computations that process large amounts of data in parallel, more efficiently. This means GPUs accelerate the large calculations that are required by big data, video encoding, AI, and machine learning.

GPU Compute Instances include NVIDIA RTX 4000 Ada or NVIDIA Quadro RTX 6000 GPU cards with Tensor, RT, and CUDA cores. NVIDIA RTX 4000 Ada GPU plans are currently only available to Beta customers. Read more about NVIDIA RTX 4000 Ada [here](https://resources.nvidia.com/en-us-design-viz-stories-ep/rtx-4000-ada-datashe?lx=CCKW39&contentType=data-sheet).

## GPU Use Cases

### Machine Learning and AI

Machine learning is a powerful approach to data science that uses large sets of data to build prediction algorithms. These prediction algorithms are commonly used in “recommendation” features on many popular music and video applications, online shops, and search engines. When you receive intelligent recommendations tailored to your own tastes, machine learning is often responsible. Other areas where you might find machine learning being used include self-driving cars, process automation, security, marketing analytics, and health care.

AI (Artificial Intelligence) is a broad concept that describes technology designed to behave intelligently and mimic the cognitive functions of humans, like learning, decision making, and speech recognition. AI uses large sets of data to learn and adapt in order to achieve a specific goal. GPUs provide the processing power needed for common AI and machine learning tasks like input data preprocessing and model building.

Below is a list of common tools used for machine learning and AI that can be installed on a GPU Compute Instance:

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

If you're interested in using CUDA on your GPU Compute Instance, see the following resources:

- [NVIDIA's Library of Documentation](https://docs.nvidia.com/cuda/)

- [Introduction to CUDA](https://devblogs.nvidia.com/easy-introduction-cuda-c-and-c/)

- [NVIDIA's CUDA exercise repository](https://github.com/csc-training/CUDA/tree/master/exercises)

### Graphics Processing

One of the most traditional use cases for a GPU is graphics processing. Transforming a large set of pixels or vertices with a shader or simulating realistic lighting via ray tracing are massive parallel processing tasks. Ray tracing is a computationally intensive process that simulates lights in a scene and renders the reflections, refractions, shadows, and indirect lighting. It's impossible to do on GPUs in real-time without hardware-based ray tracing acceleration. GPU Compute Instances offers real-time ray tracing capabilities using a single GPU.

Akamai Cloud Computing GPU plans support advanced shading capabilities such as:

- Mesh shading models for vertex, tessellation, and geometry stages in the graphics pipeline
- Variable Rate Shading to dynamically control shading rate
- Texture-Space Shading which utilizes a private memory held texture space
- Multi-View Rendering which allows for rendering multiple views in a single pass.