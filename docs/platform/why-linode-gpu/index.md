---
author:
  name: Linode
  email: docs@linode.com
description: 'Why use GPU Instances'
keywords: ["", "grub"]
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)'
aliases: []
published: 2019-06-12
title: Why use GPU Instances?
modified_by:
  name: Linode
---

## Why Choose a Linode GPU Instance?

When considering the benefits of a GPU, a good analogy to keep in mind is the difference between a speedboat and a cargo ship. Though a speedboat will always be the fastest option when traveling between point A and B (and the better option for most people), the cargo ship is still needed whenever massive quantities of “cargo” or "simple data" need to be moved. Although a cargo ship is slower than a speedboat overall, it can transport data significantly faster when compared to the round trips a speedboat would need to make to transport the same data. In this sense, your GPU can be thought of as a cargo ship, while your CPU is a speedboat.

GPU’s (Graphical Processing Units) are generally needed in situations where the few cores and threads provided by a CPU alone wouldn’t be enough to handle the large scale tasks that require the use of thousands of threads at a single given point in time. A GPU has significantly more logical cores than a standard CPU, and although they work similarly, this makes a GPU significantly better for performing any task that would benefit from many simple long-term computations performed in tandem with each other. In othe words, this means that GPUs are the perfect fit for the large scale monotonous calculations that are required to perform many of the tasks required for big data, video encoding, AI, Machine Learning, and more.

## Machine Learning and AI

Machine Learning is a powerful, modern approach to data science, where a machine is given a set of data to parse that it then uses to learn through experience without being explicitly told to do so. You can see this most often in your day to day through the “recommendation” features on many popular music and video applications, online shops, search engines, and more.  In these cases where you are intelligently being recommended something specifically for your own tastes, machine learning is often responsible. This isn’t the only place where machine learning can be applied however. Self-driving cars, process automation, Security, Marketing Analytics, and even the field of Medicine are just a few additional areas where machine learning can now be seen applied in various ways.

AI, or Artificial Intelligence, is a more broad concept, applying to any application of technology which is designed to act intelligently and mimic the cognitive functions of human or animal brains. It’s important to consider that Machine Learning is a subset of AI but is not it’s only application.

Machine Learning and AI are generally designed and configured using the same tools. Below are a few recommendations:

- [tensorflow](https://www.tensorflow.org) - A free, open-source, machine learning framework and deep learning library. Originally developed by [Google](google.com) for internal use before being fully released to the public under the Apache License, Tensorflow is a powerful open source machine learning platform.

- [pytorch](https://pytorch.org/) - Tailored for GPU functionality in Python, Pytorch is a deep learning research platform designed for maximum flexibility and speed.

- [Apache Mahout](https://mahout.apache.org/) - Apache Mahout is a scalable library of machine learning algorithms, and a distributed linear algebra framework designed to let mathematicians, statisticians, and data scientists quickly implement their own algorithms.

## Big Data

Big data is a term used to refer to data sets so large and complex that they require their own set of software and hardware tools to interact with them. When thinking of big data and whether or not the term applies to you, it often helps to visualize the “three Vs”:

-   **Volume:** “Big Data” is just another way to say “Large Quantities of Data."

    Generally when you consider multiple Terabytes, Exabytes, Petabytes, or more, you're talking about the quantity of information that is found in Big Data.


-   **Velocity:** With Big Data, you’re dealing with data that is being created, called, moved,and interacted with quickly, or with high velocity. This is something especially true on social media platforms, where large amounts of data are designed to be interacted with in as close to real time as possible.

-   **Variety:** Variety refers to the many different types of data you may need to be able to interact with. Photos, video, audio, documents, and more can all be written and saved in a number of different formats. Variety is worth being mindful of in order to ensure that all of your different data is classified into appropriate categories.

If these definitions seem to describe your environment, or your use case, then a Big Data Solution may be right for you.

In the modern Big Data world, GPUs can help to give Big Data systems the additional computational capabilities they often need for ideal performance. Below are a few examples of tools which you can use for your own Big Data solutions:

-   [Hadoop](https://hadoop.apache.org/) - Hadoop is an Apache project that allows creation of parallel processing applications on large data sets, distributed across networked nodes. It is designed specifically for large data sets, and would be considere

-   [Apache Spark](https://spark.apache.org/) - Apache Spark is a unified analytics engine for large-scale data processing. Designed with speed and ease of use in mind.

-   [Apache Storm](https://storm.apache.org/) - Apache Storm is a distributed computation system that processes streaming data at real time.

### Video Encoding

Video Encoding is the process of taking the original source format of a video file, and converting it to another which can be viewable on a different device or using a different tool. Though this process has been around for a good long while and is normally resource intensive, having a good GPU can give you more speed and mobility when completing these tasks:

 -  [FFmpeg](https://developer.nvidia.com/ffmpeg) - FFmpeg is an extremely popular multimedia framework able that supports a massive number of video formats, making it the top choice for video encoding by a number of Linux users and professionals.


## Cuda

Cuda Is a parallel computing platform and programming model that allows you to interact more directly with your GPU for general purpose computing. In practice, this would mean that a developer could write code in C, C++, or many other supported languages to utilize their GPU to create their own tools and programs. You can see an example of code written with Cuda below:

Cuda is the technology that powers some other well known tools like [Tensorflow](#machine-learning-and-ai).

If you're interested in using CUDA on your GPU Linode, we can recommend referencing NVIDIA's [Library of Documentation](https://docs.nvidia.com/cuda/) or this [Introduction to Cuda](https://devblogs.nvidia.com/easy-introduction-cuda-c-and-c/) for more information.
