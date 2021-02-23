---
slug: ml-cloud
author:
  name: Andy Patrizio
  email: ndy@andypatrizio.com
description: 'Machine Learning is a two-step process to train and then utilize learning models.'
og_description: 'Making Machine Learning a thing is a two-step dance. The first one is a doozy.'
keywords: ['cloud machine learning']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-23
modified_by:
  name: Linode
title: "Machine Learning in the Cloud: Training and Inference"
h1_title: "Machine Learning in the Cloud: Training and Inference"
contributor:
  name: Andy Patrizio
  link: https://twitter.com/apatrizio
external_resources:
- '[How to Move Your Machine Learning Model to Production](https://www.linode.com/docs/guides/how-to-move-machine-learning-model-to-production/)'
- '[Use Cases for Linode GPU Instances](https://www.linode.com/docs/guides/why-linode-gpu/)'
---

# Machine Learning in the Cloud: Training and Inference

Machine learning has been around conceptually since 1959, when Arthur Samuel, a pioneer in the field of computer gaming and artificial intelligence, coined the term. Samuel said that machine learning &quot;gives computers the ability to learn without being explicitly programmed.&quot; While at IBM [he wrote a program to play Checkers](http://infolab.stanford.edu/pub/voy/museum/samuel.html), which became the first known self-learning program.

Machine learning (ML) falls under the greater umbrella of artificial intelligence (AI). It is focused on the practice of computer algorithms that improve automatically through experience and by processing large amounts of data.

Machine learning algorithms build a model based on sample data, known as training data, in order to learn the right and wrong answers or perform pattern matching, without being explicitly programmed to do so. Examples include image recognition, aberrant compute and network behavior, and spam recognition. One such example with which most people are familiary is Google Images, wherein users upload an image and find matching or similar images.

## The training two-step

Machine learning is a two-step process: training and inference. The names are wholly descriptive.

Training refers to the process of creating an machine learning algorithm, in which the ML application studies vast amounts of data to learn what it needs to learn. Training uses a deep-learning framework, such as Google TensorFlow, PyTorch, or Apache Spark.

Training is a binary, yes/no endeavor. When you train a model to learn to recognize an image of a car, the answer is pretty binary: Is it a car or not? The training teaches the system to look for the hallmarks of a car: tires, headlights, doors, windows, and so on.

There are four types of learning models—supervised, unsupervised, semi-supervised, and reinforcement. Which to use depends mainly on what a team is trying to accomplish.

**Supervised learning**: This requires the input data to be labeled or categorized for the algorithms to do their jobs. The system has to know what the input data is to figure out what to do with it. This is the most common method of ML. It&#39;s used to make recommendations on Amazon or Netflix based on a previous purchase (&quot;Since you bought X, you might be interested in Y.&quot;)

**Semi-Supervised:** Machine learning algorithms normally utilize labeled and unlabeled data, where the unlabeled data amount is as large as labeled data. Unsupervised learning requires no labels. In this case, the model looks for patterns and creates its own categories. For example, one semi-supervised machine learning system discovered that internal fraud in financial systems often ended in eleven cents (e.g. $450.11). Nobody would go looking for that sort of correlation; the ML algorithm discovered it based on large scale data analysis.

**Unsupervised learning:** In this model, there is only have input data and no corresponding output variables. Its goal is to examine the data&#39;s underlying structure or distribution in order to discover hidden patterns or data groupings without the need for human intervention. It&#39;s more of an exploratory form of analysis looking to discover similarities and differences in the information. It is called unsupervised learning because there is no correct answer. Algorithms are left to their own devices to discover and present the interesting structure in the data.

**Reinforcement learning: This** uses trial and error to churn out output based on the highest efficiency of the function. The output is compared to find errors and feedback which are incorporated back into the system to improve or maximize its performance. This method is used in a different type of AI known as deep learning, which is a whole other story.

**Inference** is the easy part. It takes data or input of some kind and compares it to trained models, applying the model&#39;s newly-learned knowledge to new data. So, in the car analogy, developers training the system might give the software some photos of cars that it&#39;s never seen before to discover what it can &quot;infer&quot; from what it&#39;s already learnt.

## Cloud vs. on-prem vs. end point

Training and inference are distinct in their processing requirements. Training requires very powerful processors, with [high-end server CPUs and GPUs](https://www.linode.com/docs/guides/getting-started-with-gpu/); whereas inference can often be accomplished on-device, even a mobile phone. Instagram filters that change a person&#39;s appearance are an example. The phone recognizes your facial features and suggests changes.

For training, it is not uncommon for systems to use tens or even hundreds of millions of dataset examples. The question then becomes where to accumulate it all. If the data resides on-premises, then it doesn&#39;t make sense to upload it to a cloud service provider. Just process it where it resides.

The best argument for on-premises data storage is data sensitivity. Regulatory compliance is a major reason to stay on-prem. If one is dealing with customer financial data then at best moving it to the cloud is highly regulated, at worst not permitted.

However, as the cloud grows, more and more data is being acquired in the cloud and left there. So if a company already has rich data stores with a cloud provider, it makes no sense to download it on-prem, unless the cloud data and on-prem stores are matching data sets. In which case you download it once and never again.

If a company suddenly acquires or requires petabytes of data, storing it on-prem means buying new drives or storage arrays, waiting for it to arrive, setting it up, testing, and deploying, all of which can take weeks. With the cloud, one requests more capacity and it&#39;s yours in minutes.

Cloud storage for machine learning data has multiple benefits and advantages. The main advantage to cloud-based ML training is what the cloud brings in all matters: scalability on demand. It breaks down in multiple ways:

- **Flexible resource usage**: The cloud is the best choice for occasional or seasonal hardware resource needs. AI training hardware is expensive and can run into the millions of dollars. If you only occasionally need it, then the massive investment sits idle more often than not.

- **Access to the newest hardware**: CSPs are aggressive about acquiring and deploying the newest hardware. Once you sink millions into an AI training system, how often will enterprises upgrade? Probably not as often as its CSP.

- **De-coupled architecture is bound to specific hardware**: In an on-prem situation, a company will likely find itself tied to its hardware, so when the company goes to upgrade the hardware it also has to undergo a major software rewrite. Cloud-based training has a layer of abstraction from the hardware, so when the hardware is upgraded, the training algorithms do not require a rewrite.

ML training is [where GPUs really shine](https://www.linode.com/docs/guides/why-linode-gpu/), but at the cost of expensive hardware and a sizable electric bill. If you are doing training only a few times a year, then the argument for cloud-based training is clear. Do you really want to invest in millions of dollars in high-end GPU-based servers you might use a half dozen times a year? Take your data to the cloud for training and use the models you generate in the cloud or on-premises.

## Advice for machine learning in the cloud

When you should do training in the cloud? If your data is already there, and if you do it so infrequently that a CSP is cheaper than acquiring the hardware.

What else should you do? Here are a few tips:

- Find a CSP whose data privacy and regulatory compliance best aligns with your business interests.
- Ensure the cloud-based data is in the same cloud data center as the computation the software uses. It is not ideal to have data residing in an east-coast data center while all the computation is done on the west coast.
- Make sure the ML platform abstracts the hardware from the models. Data scientists should not need to worry about having the right hardware.
- Update the ML models and computational programs. They can always be made better and more efficient.
- Many frameworks don&#39;t require top-end GPU computation. The best computation is called double-precision calculations, or 64-bit processing, but it is the slowest and thus most expensive method. In many cases, single-precision (32-bit processing) or even half-precision (16-bit) are just as accurate and process a lot faster. You want speed. In the cloud, time is money. Yours.
- Go hybrid if you can. If you have the hardware in-house, start with that to learn and move up to the cloud. The cloud isn&#39;t the best place to experiment since the costs are metered.
