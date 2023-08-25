---
slug: getting-started-with-pytorch-lightning
title: "Getting Started With PyTorch Lightning"
description: 'This guide explains the PyTorch Lightning developer framework and covers general optimizations for its use on Linode GPU cloud instances.'
keywords: ['pytorch lightning','training datasets','python pytorch','pytorch lightning','neural networks','machine modeling','nn','ai research','gpu','nn modeling','ml','neural network modeling','pytorch optimization','pytorch lightning optimization','pytorch storage','pytorch lightning modeling','pytorch lightning s3','pytorch lightning gpu','pytorch lightning staging','pytorch lightning cost savings']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Tom Henderson"]
published: 2023-08-22
modified_by:
  name: Linode
external_resources:
- '[PyTorch](https://pytorch.org/)'
- '[Lightning AI](https://lightning.ai/)'
---

Lightning is a PyTorch module that works within a number of integrated development environments (IDEs). There are compelling reasons to familiarize yourself with it. It’s portable, enabling code usage across setups. Development can occur on a cheaper host before moving to a GPU, at which point PyTorch Lightning provides mechanisms that grant further savings.

Linode offers GPU plans optimized for graphics and neural network (NN) development utilizing NVIDIA's RTX 6000 GPU. Linode GPU plans are available with a range of memory, storage, and GPUs.

PyTorch Lightning can efficiently allocate the Nvidia RTX 6000's Compute Unified Device Architecture (CUDA) cores. The CUDA cores are allocated (either specifically or automatically) to match the demands of training loops and neural network modeling. Instances can be chained together and optimized for cost efficiency across training sessions.

Several steps are recommended to optimize the compute time cost savings of GPU-based sessions. This guide covers structuring data training sets, optimizing the working instance for productivity, and managing storage considerations, along with tips for session repeatability and replication.

## What Is PyTorch Lightning?

PyTorch Lightning is a module of [PyTorch](/docs/guides/pytorch-installation-ubuntu-2004/), a developer framework for deep learning. PyTorch builds upon Python's established strengths in data modeling and neural network training through the addition of GPU-optimized capabilities. PyTorch Lightning adds a framework to PyTorch that optimizes productivity in the research and modeling process. This allows portability of code while achieving the same results, as underlying hardware permits.

PyTorch Lightning allows developers to remove repetitive PyTorch setup code. The framework adds scaling and a command-line interface that allows developers to write modular code with repeatable results. Furthermore, PyTorch Lightning adds scaled GPU utilization that works well with Linode’s specialized GPU-enabled instances. In fact, no code change to existing PyTorch or PyTorch Lightning is needed to take advantage of Linode GPU instances.

## PyTorch Lightning vs. PyTorch

PyTorch additions to Python extend its tensor processing capabilities when used with GPUs and other math processors. Depending on the tensor size, GPU parallel processing can reduce both the modeling time and matrix processing needed in a neural network training model. PyTorch's parallelized GPU management can effectively increase the neural network and data training capability throughput.

Lightning optimizes module processing output for rapid iterative data training exercises, faster neural network training, and interim results tweaking with repeatable results. The combination of PyTorch and Lightning provides productive sessions that scale within the codebase. This eliminates the need for frequent restarts and alterations midway through the modeling process.

PyTorch Lightning can also be controlled through the use of YAML scripts. Sessions can take advantage of iterative changes in YAML scripting to control sophisticated neural network training loop sessions. Advanced Lightning modeling also offers a command-line control process.

## Use Cases

The PyTorch Lightning framework is optimized for and focused on data-intensive research using neural network training loops. It uses a wide variety of data sources for tensors and self-supervised machine learning (ML) loops. It’s designed for speed across grid searches and supports projects using highly complex models. According to its founding developer, William Falcon, PyTorch Lightning is "just really organized PyTorch".

PyTorch Lightning works most effectively when model complexity requires moving code from CPU to parallel-processing GPU instances. It also excels when new platforms require refactoring existing code. Lightning efficiently reuses GPU hardware resources. Developers can create initial models on inexpensive CPU or low-count GPU hardware, then migrate to high-density GPU environments without changing the code. Lightning code scales throughput automatically if ported to a higher parallel-GPU environment.

Lightning offers 16-bit precision training. Porting from low-density compute to high-density compute is simply a matter of moving code segments to another platform. When compared to PyTorch alone, Lightning code exhibits a 3x performance boost. What's more, batch size potentially doubles within the same memory space and executes in half the time.

Since Lightning automates GPU control code, evolving models can be transferred between instances to accommodate various development, training, validation, loss carryback, and processing requirements. This makes instances developed with Lightning highly portable. Researchers and ML/NN modelers have the ability to choose the right hardware instance for the right part of the development process.

## Setup Optimization

An optimized pipeline consists of a set of one or more "gold images". These become the basis for many iterations, epochs, and/or *sprints* if Agile development techniques are used. The pipeline also consists of data sources for training, pre-loading of training iterations, and plans for storage as models evolve.

Lightning code is configured to include multiple data loader steps to train neural networks. Depending on the desired training iterations and epochs, configured code can optionally store numerous intermediate storage objects and spaces. This allows for the isolation of training and validation steps for further testing, validation, and feedback loops.

Throughout the modeling process, various storage spaces are used for staging purposes. These spaces might be confined to the Linux instance running PyTorch Lightning. Alternatively, they can have inputs sourced from static or streaming objects located either within or outside the instance. Such sourced locations can include various URLs, local Linode volumes, Linode (or other S3 buckets), or external sources. This allows instances to be chained across multiple GPU instances if desired.

This introduces an additional stage in the pipeline between and among instances for high-volume or large tensor data source research.

### Setup and Staging Steps

There are several pre-processing steps to take in order to optimize a Lightning session and instance:

1.  **Normalize Inputs: Gather and Parse Training Data Sets**

    Initial training data sets and any data sets required for epochs and inputs to subsequent training must be ready and parsed for abnormalities. Bad data invalidates a session and leads to unexpected and difficult-to-interpret results, also known as the "garbage-in, garbage-out" effect. Similar steps are taken during validation phases when training neural network models.

1.  **Create and Organize and Link Data Buckets**

    The initial loading of data sets is performed from within a Linode storage object. When the setup and parsing stage is complete, data sets are pushed through the model. Their outputs are tested for fitting, adjustments are made, and machine learning commences through iterative modeling cycles.

1.  **Plan For Future Analysis**

    It's important to save the sources and inputs for each phase of the modeling process. This data can be used for forensic analysis and/or subsequent processing. The storage options are local, cached within PyTorch, or nearby storage objects (further described below).

1.  **Create Image Templates**

    Linode makes it simple to create image templates from scratch or use an instance pre-configured to run on a Linode GPU plan.

Instances intended for models that take advantage of PyTorch Lightning are optimized when pre-built and debugged before modeling on less expensive instances. This staging model is often based on an existing image using PyTorch and Lightning. The image can be ported to a Linode GPU instance at run time.

Procedurally, a chosen Linux image is generated after the latest updates. The most recent versions of PyTorch and Lightning are added along with other desired code. This image may also be pre-built and staged online as a standard Linode for re-use. Optionally, it can be uploaded as a pre-configured Linode image tailored for neural network processing. Because the GPU management code is eliminated, the image may be re-used in a code-processing or research modeling pipeline. A less expensive Linode instance can be created, updated, upgraded, and equipped with the latest versions of Python and PyTorch. Porting to GPU instances can occur after processes are staged and ready. The image SSH keys are optionally pre-seeded, as well as other modules and libraries needed for research, experimentation, trial, or production use.

You can upload your own image that’s been pre-configured and pre-seeded with configuration and/or trial data sets. Version sets that continue modelling from other sources can also be included. The only limitation to uploading an image is that it must not exceed five gigabytes in size when compressed with tar.gz. There is a storage charge for images stored on Linode, and optional data volumes are mounted at run time where needed.

Multiple instances, pre-seeded and chained in this way, must have unique instance names for pre-loading purposes. A 40GB backplane is provided for Linode GPU instances, permitting instances to be chained together for training, validation, retraining, and epoch management at high speed.

### Storage Configuration Options

Several storage profiles work for the needs of modeling research, including:

-   **On-Instance Storage**: Natively allocated and pre-determined storage within the instance. This is included in the cost of the instance.

-   **Mounted Linode Volumes**: Up to eight logical disk volumes ranging from 10 GB to 80 TB can be optionally added to any Linode. Volumes are mounted and unmounted either manually or programmatically. Volumes may be added, deleted, and/or backed-up during the research cycle. Volume storage costs are optional.

-   **Linode Object Storage**: Similar to CORS S3 storage, Linode Object Storage emulates AWS or DreamHost S3 storage, so S3 objects can be migrated to Linode and behave similarly. Standard S3 buckets can be imported, stored, or deleted as needed during the research cycle. Object storage costs are optional.

-   **External URL Code Calls**: External networked data sources are subject to the data flow charges associated with the Linode GPU or other instance cost.

PyTorch Lightning can take inputs from static training model file sources or streams. Static data set models represent files, objects, or data flows (e.g. IoT data feeds). Streams can be inputs from periodic, non-file data such as video, IoT, and audio sources. Optimal retrieval time performance for static data sets is achieved by pre-loading them into Linode storage as objects or logical disk volumes.

### Instance Time Optimization

The cost savings represented by Instance Time Optimization requires instance staging. Staging results in conservation of GPU instance time, efficient allocation of storage, and less forensic, test, and/or validation phases needed during the development of a neural network.

Interactive research modeling techniques are optimized with PyTorch Lightning as it automatically adjusts to the chosen GPU platform. The model, image, and data sets used are then stored, re-used, and forensically analyzed through the production process. Moving code out of more expensive GPU instances is performed by saving images then remounting them on less costly hardware instances.

Using a pre-loaded PyTorch Lightning-based image is strongly suggested. The pre-loaded image is developed on a simple, less costly Linode as part of the staging and optimization process. When further developed, the image can be instantiated on one or more GPU-based Linodes to run suite-heavy workloads through training, testing, and validation. Once validation is satisfied, production models are moved to an appropriate platform via the image.

Staging requires data sources to be initially organized, their storage allocated, downloaded, or instantiated, the image deployed, and the neural network training process started. Once the neural network and its modeling is validated, the forensic record is available to be stored for future use, training, or debugging. Maintaining logs or employing git-source control aids in monitoring the success and failure of code deployments, forensic activities, and debugging efforts.

Such a production process also allows teams to work on allied modeling schemes using the same resources. This produces an excellent chance of obtaining the same results through the same process and data sources. Researchers retracing their steps are able to potentially achieve better quality assurance through rapid modeling with repeatable results.

## Conclusion

PyTorch Lightning is a PyTorch module that offers conservation of resources in neural network modeling research. As a module, Lightning allows the porting of code to different platforms. These platform can each be optimized for specific use cases and tailored for each cycle of neural network model development.

Process optimization can cut costs and deliver repeatable results more quickly than either Python alone or Python with PyTorch. Techniques include pre-imaging, data source queuing, data storage modeling, and choosing the correct instance for the modelling state and research requirements.

Optimized images for Python Lightning are initially developed on inexpensive hardware before being deployed, optimized, and re-used. These images become part of a development system for researchers to validate a wide variety of complex models that automatically adjust to the platform.