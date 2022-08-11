---
slug: introduction-to-machine-learning-training-and-inference
author:
  name: Andy Patrizio
  email: ndy@andypatrizio.com
description: "Training and inference in machine learning each have their own requirements. We will walk you through the differences, along with hosting advice."
og_description: "Training and inference are interconnected pieces of machine learning. Training refers to the process of creating machine learning algorithms. This process uses deep-learning frameworks, like Apache Spark, to process large data sets, and generate a trained model. Inference uses the trained models to process new data and generate useful predictions. Training and inference each have their own hardware and system requirements. This guide discusses reasons why you may choose to host your machine learning training and inference systems in the cloud versus on premises."
keywords: ['cloud machine learning']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-05
image: IntroMachineLearning_trainandinterference.png
modified_by:
  name: Linode
title: "Machine Learning Training and Inference"
h1_title: "An Introduction to Machine Learning: Training and Inference"
enable_h1: true
contributor:
  name: Andy Patrizio
  link: https://twitter.com/apatrizio
external_resources:
- '[How to Move Your Machine Learning Model to Production](/docs/guides/how-to-move-machine-learning-model-to-production/)'
- '[Use Cases for Linode GPU Instances](/docs/products/compute/gpu/guides/use-cases/)'
---

Machine learning (ML) has been around conceptually since 1959, when [Arthur Samuel](https://en.wikipedia.org/wiki/Arthur_Samuel), a pioneer in the field of computer gaming and artificial intelligence, coined the term. Samuel said that machine learning "gives computers the ability to learn without being explicitly programmed". While at IBM he wrote a program to play Checkers, which became the first known self-learning program.

Machine learning falls under the umbrella of artificial intelligence (AI). ML enables computer algorithms to improve automatically through experience and by processing large amounts of data.

Sample data, known as *training data*, is used by machine learning algorithms to build a model. The training data enables the ML algorithms to find relationships and patterns, generate conclusions, and determine confidence scores. ML is used in image recognition, aberrant compute and network behavior, and spam recognition.

## An Introduction to Training and Inference

### Training

The training process creates machine learning algorithms, in which the ML application studies vast amounts of data to learn about a specific scenario. Training uses a deep-learning framework, such as [Google TensorFlow](https://www.tensorflow.org/learn), [PyTorch](https://pytorch.org/), or [Apache Spark](https://spark.apache.org/docs/latest/).

Training is a binary, yes/no endeavor. When you train a model to learn to recognize an image of a car, the question to answer is: *Does the image contain a car or not*? The training teaches the system to look for the hallmarks of a car: tires, headlights, doors, windows, and so on.

There are four types of learning models; *supervised*, *unsupervised*, *semi-supervised*, and *reinforcement*. Choosing which learning model to use depends on what your team is trying to accomplish.

- **Supervised learning**: This method requires the input data set to be labeled or categorized. This enables an algorithm to learn what the "right answer" should be when making predictions about the input data. This is the most common method of ML.

- **Semi-Supervised**: This model uses a small amount of labeled data with the rest of the data being unlabeled. Since a labeled data set can be costly to acquire, this approach works well when you only have access to a minimal amount of labeled data. You can use your small labeled data set to give the model some assistance when creating categories from the unlabeled data.

- **Unsupervised learning:** In this model, the data set is unlabeled. This algorithm's goal is to examine the data's underlying structure or distribution in order to discover hidden patterns or data groupings without the need for human intervention. It's more of an exploratory form of analysis looking to discover similarities and differences in the information. It is called unsupervised learning because there is no correct answer. The algorithm is tasked with finding and presenting the interesting structure in the data.

- **Reinforcement learning**: This uses trial and error to produce output based on the highest efficiency of the function. The generated output is analyzed in order to find errors and provide feedback. This information is incorporated back into the system to improve or maximize its performance. This method is used in a subcategory of ML known as [*deep learning*](https://en.wikipedia.org/wiki/Deep_learning).

### Inference

Once a machine learning model is trained, you can move on to the second phase, which is machine learning inference. During machine learning inference the trained models are used to draw conclusions from new data. For example, during the inference process a developer or data scientist might give the trained ML models some photos of cars that it has never seen before to discover what it can infer from what it has already learned.

## Machine Learning: Cloud vs. On Premises

Training and inference are distinct in their processing requirements. Training requires very powerful processors, with [high-end server CPUs and GPUs](/docs/products/compute/gpu/get-started/); whereas inference can often be accomplished on-device, even a mobile phone. Instagram filters that change a person's appearance are an example. The phone recognizes your facial features and suggests changes.

For training, it is not uncommon for systems to use tens or even hundreds of millions of data set examples. The question then becomes where to accumulate all of your data. If the data resides on premises, then it doesn't make sense to upload it to a cloud service provider (CSP). You should just process the data where it resides.

The best argument for on-premises data storage is data sensitivity. Regulatory compliance is a major reason to stay on-prem. If you are dealing with customer financial data then at best moving it to the cloud is highly regulated, at worst not permitted.

However, as the cloud grows, more and more data is being acquired in the cloud and left there. If a company already has rich data stores with a cloud provider, it makes no sense to download it on-prem. If, however, the cloud data and on-prem stores are matching data sets, you can download the data once and never again.

If a company suddenly acquires or requires petabytes of data, storing it on-prem means buying new drives or storage arrays, waiting for it to arrive, setting it up, testing, and deploying, all of which can take weeks. With the cloud, one requests more capacity and it's yours in minutes.

Cloud storage for machine learning data has multiple benefits and advantages. The main advantage to cloud-based ML training is what the cloud brings in all matters: scalability on demand. It breaks down in multiple ways:

- **Flexible resource usage**: The cloud is the best choice for occasional or seasonal hardware resource needs. AI training hardware is expensive and can run into the millions of dollars. If you only occasionally need it, then the massive investment sits idle more often than not.

- **Access to the newest hardware**: Cloud service providers consistently acquire and deploy the newest hardware. Budget considerations can restrict you from upgrading your on-prem AI hardware as often as a CSP is able to do.

- **De-coupled architecture is bound to specific hardware**: In an on-prem situation, a company is likely tied to its hardware. When the company upgrades their hardware it also has to undergo a major software rewrite. Cloud-based training has a layer of abstraction from the hardware, so when the hardware is upgraded, the training algorithms may not require a rewrite.

ML training is [where GPUs really shine](/docs/products/compute/gpu/guides/use-cases/), but at the cost of expensive hardware and a sizable electric bill. If you are doing training only a few times a year, then the argument for cloud-based training is clear. Do you really want to invest in millions of dollars in high-end GPU-based servers you might use a half dozen times a year? Take your data to the cloud for training and use the models you generate in the cloud or on premises.

## Tips for Machine Learning in the Cloud

- *When should you do your machine learning training in the cloud?* If your data is already there, and if you do it so infrequently that a cloud service provider is cheaper than acquiring the hardware.

- The following list includes a few additional tips:

    - Find a CSP whose data privacy and regulatory compliance best aligns with your business interests.
    - Ensure the cloud-based data is in the same cloud data center as the computation the software uses. It is not ideal to have data residing in an East Coast data center while all the computation is done on the West Coast.
    - Make sure the ML platform abstracts the hardware from the models. Data scientists should not need to worry about having the right hardware.
    - Update the ML models and computational programs. They can always be made better and more efficient.
    - Many frameworks don't require top-end GPU computation. The best computation is called double-precision calculations, or 64-bit processing, but it is the slowest and thus most expensive method. In many cases, single-precision (32-bit processing) or even half-precision (16-bit) are just as accurate and process a lot faster.
    - Go hybrid if you can. If you have the hardware in-house, start there and move up to the cloud, if needed. Since your costs are metered in the cloud, time consuming experimentation can accumulate your costs more rapidly.
