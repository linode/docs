---
author:
  name: Linode
  email: docs@linode.com
description: 'Use Cases for Linode GPU Instances'
keywords: ["", "grub"]
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)'
aliases: []
published: 2019-06-12
title: Linode GPU Use Cases
modified_by:
  name: Linode
---

## What are GPUs?

GPUs (Graphical Processing Units) are specialized hardware originally created to manipulate computer graphics and image processing. GPUs are designed to process large blocks of data in parallel making them excellent for compute intensive tasks that require thousands of simultaneous threads. Because a GPU has significantly more logical cores than a standard CPU, it can perform computations that process large amounts of data in parallel, more efficiently. This means GPUs accelerate the large calculations that are required by big data, video encoding, AI, and machine learning.

## Use Cases
### Machine Learning and AI

Machine learning is a powerful approach to data science that uses large sets of data to build prediction algorithms. These prediction algorithms are commonly used in “recommendation” features on many popular music and video applications, online shops, and search engines. When you receive intelligent recommendations tailored to your own tastes, machine learning is often responsible. Other areas where you might find machine learning being used is in self-driving cars, process automation, security, marketing analytics, and health care.

AI (Artificial Intelligence) is a broad concept that describes technology designed to behave intelligently and mimic the cognitive functions of humans, like learning, decision making, and speech recognition. AI uses large sets of data to learn and adapt in order to achieve a specific goal. GPUs provide the processing power needed for common AI and machine learning tasks like input data preprocessing and model building.

Below is a list of common tools used for machine learning and AI that can be installed on a Linode GPU instance:

- [tensorflow](https://www.tensorflow.org) - a free, open-source, machine learning framework and deep learning library. Tensorflow was originally developed by [Google](google.com) for internal use and later fully released to the public under the Apache License.

- [pytorch](https://pytorch.org/) - a machine learning library for Python that uses the popular GPU optimized [Torch](https://en.wikipedia.org/wiki/Torch_(machine_learning)) framework.

- [Apache Mahout](https://mahout.apache.org/) - a scalable library of machine learning algorithms, and a distributed linear algebra framework designed to let mathematicians, statisticians, and data scientists quickly implement their own algorithms.

### Big Data

Big data is a discipline that analyzes and extracts meaningful insights from large and complex data sets. These sets are so large and complex that they require specialized software and hardware to appropriately capture, manage, and process the data. When thinking of big data and whether or not the term applies to you, it often helps to visualize the “three Vs”:

-   **Volume:** Generally, if you are working with terabytes, exabytes, petabytes, or more amounts of information you are in the realm of big data.


-   **Velocity:** With Big Data, you’re using data that is being created, called, moved, and interacted with at a high velocity. One example is the real time data generated on social media platforms by its users.

-   **Variety:** Variety refers to the many different types of data formats with which you may need to interact. Photos, video, audio, and documents can all be written and saved in a number of different formats. It is important to consider the variety of data that you will collect in order to appropriately categorize your it.

GPUs can help give Big Data systems the additional computational capabilities they need for ideal performance. Below are a few examples of tools which you can use for your own big data solutions:

-   [Hadoop](https://hadoop.apache.org/) - an Apache project that allows the creation of parallel processing applications on large data sets, distributed across networked nodes.

-   [Apache Spark](https://spark.apache.org/) - a unified analytics engine for large-scale data processing designed with speed and ease of use in mind.

-   [Apache Storm](https://storm.apache.org/) - a distributed computation system that processes streaming data in real time.

### Video Encoding

Video Encoding is the process of taking a video file's original source format and converting it to another format that is viewable on a different device or using a different tool. This resource intensive task can be greatly accelerated using the power of GPUs.

 -  [FFmpeg](https://developer.nvidia.com/ffmpeg) - a popular open-source multimedia manipulation framework that supports a large number of video formats.


### General Purpose Computing using CUDA

CUDA (Compute Unified Device Architecture) is a parallel computing platform and application programming interface that allows you to interact more directly with your GPU for general purpose computing. In practice, this means that a developer can write code in C, C++, or many other supported languages to utilize their GPU to create their own tools and programs.

If you're interested in using CUDA on your GPU Linode, see NVIDIA's [Library of Documentation](https://docs.nvidia.com/cuda/) or an [Introduction to Cuda](https://devblogs.nvidia.com/easy-introduction-cuda-c-and-c/) for more information.
