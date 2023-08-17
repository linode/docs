---
slug: what-are-cloud-native-applications
title: "What Are Cloud-Native Applications"
description: 'Learn what cloud native means, and how cloud-native apps differ from traditional on-premises applications.'
keywords: ['cloud-native applications','cloud native apps','microservices','kubernetes','docker']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Andy Patrizio"]
published: 2023-06-12
modified_by:
  name: Linode
---

"Cloud-native applications" is a term that has evolved as it has grown. As part of that growth, the [Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF) was launched in 2015 by the Linux Foundation. It serves as a vendor-neutral platform for many projects around cloud-native apps, including Kubernetes, Prometheus, and Envoy.

Cloud-native is an app modernization technique, usually driven by a business need to modernize applications as much as possible to drastically improve scale. Older, on-premises, monolithic applications are broken up into autonomous subsystems called microservices. These microservices can be deployed and scaled independently from other areas of the application. This allows the components to evolve independently as needed, and scale up more than would be possible in the old design.

Considering the term is cloud *native*, it implies that apps live in the public cloud, as opposed to an on-premises data center. This is true, as they can be set up to run in cloud data centers owned by Amazon, Microsoft, or Google. However, they can also run in a private cloud within your own environment.

The CNCF defines cloud-native computing an open source software stack used for containers. Each part of the app is packaged in its own container and dynamically orchestrated. They are actively scheduled and managed to optimize resource utilization. They are microservices-oriented to increase overall agility and maintainability.

## Cloud vs. On-Premises

In contrast to on-premises apps, cloud-native apps are architected specifically to run in the elastic and distributed nature of the cloud. One of the key differences between on-premises and the cloud is that cloud usage is metered. You pay for every CPU cycle, disk I/O, and even network traffic.

On-premises apps have no such restrictions. It’s your environment, so apps are limited only by hardware resources and other apps on your network.

Another key difference is on-premesis apps are usually monolithic, meaning all of the functions are contained in the app. Meanwhile, cloud-based apps are broken up into a microservices architecture. Here, functions are separated, so one specific function can be used without needing the rest.

Because of this, cloud apps are described as "loosely coupled". This means that the code is not hardwired to any of the infrastructure components, so the app can scale up and down on demand. These architectures are typically built using microservices, but it's not mandatory.

## What Are Microservices?

Red Hat defines microservices as an architectural approach to building applications. As an architectural framework, microservices are distributed and loosely coupled, so one team’s changes won’t break the entire app. The benefit to using microservices is that development teams are able to rapidly build new components of apps to meet changing business needs.

The microservice architecture enables the rapid, frequent, and reliable delivery of large, complex applications as needed.

For example, when Microsoft issues its monthly fixes, does it send down a whole new installation of Windows? No, that would be completely inefficient when only a small piece of the overall operating system is being updated. Instead, the company pushes out a few megabytes of updated code to replace the existing code.

With a monolithic on-prem app, updates mean that you have to update the whole app. With microservices, you just push the updated code.

Cloud-native apps run in what is known as a container. Containers are similar to virtual machines, but slimmer. A virtual machine has a full operating system and gigabytes allocated to it, while containers have only a sliver of the OS and megabytes allocated.

Containers effectively virtualize the host operating system (or kernel) and isolate an application’s dependencies from other containers running on the same machine. So if a container crashes, it doesn’t take down the whole app.

The most popular container manager is Docker, however, there are a large [number of competitors](https://www.winosbite.com/docker-alternatives/).

Kubernetes is another important component of cloud native. Developed by Google, Kubernetes is an open source container management platform that unifies a cluster of machines into a single pool of compute resources. Kubernetes organizes applications into groups of containers using the Docker engine, and keeps your application running as intended.

## Key Differences Between Cloud-Native and On-Premises Applications

Cloud-native requires a very different architecture than traditional on-premises enterprise applications. Here are the key differences:

1.  **Languages**: On-premises apps tend to be written in traditional languages like C/C++ and enterprise Java. If it’s on a mainframe, it’s likely in COBOL. Cloud-native apps are more likely to be written in a Web-centric language like Java, JavaScript, .Net, Node.js, PHP, Python, and Ruby.

1.  **Updateable**: Cloud-native apps are updated far more regularly and routinely through a DevOps process known as Constant Iteration and Constant Delivery (CI/CD). On-premises apps also require downtime as updates are installed, while cloud-native apps are always available.

1.  **Resilience**: Because the microservices architecture breaks an app into its core functions, each function is called a *service* that can be built and deployed independently. This means that individual services can function without negatively affecting others. If a function crashes, it doesn’t bring down the whole system like an on-premises app would.

1.  **Elasticity**: Cloud-native apps take advantage of the elasticity of the cloud by dynamically increasing resources when there is a spike in usage. If your cloud-based app experiences a burst in use, extra compute resources are automatically made available until the spike subsides and those extra resources are then deallocated. An on-premises app can’t do that.

1.  **Multi-Tenancy**: A cloud-native app has no problem working in a virtualized space and sharing resources with other apps. That’s what they are designed for. Most on-premises apps don’t work well in a virtual environment, or don’t work at all, thus requiring all the resources of a server.

1.  **Connected Resources**: An on-premises app usually has hard-coded connections to resources, such as networks, security, and storage. That means things can break if anything is moved or changed. A cloud-native app can automatically find those resources without requiring human intervention.

1.  **Automated**: Unlike on-premises apps, much of the cloud is automated, and that includes app management. Container management tools like Docker and Kubernetes automate everything, including scale up/scale down, self-service, rollback of problematic apps, and auditing of the app’s performance. With on-premises, this is usually done manually.

## The Challenges

Because cloud-native and on-premises are so different, the biggest mistake is to do what is called "lift and shift". This is where old on-premises apps are simply moved to AWS or Azure unchanged. This completely fails to take advantage of everything the cloud has to offer, such as scale and ease of updates.

The real decision is whether to migrate an old on-premises app to the cloud, or simply rewrite from scratch. Here, the rule of thumb is that the more rewriting you have to do, the more appealing a rewrite from scratch becomes.