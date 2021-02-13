---
slug: cloud-native
author:
  name: Steven J. Vaughan-Nichols
  email: sjvn@vna1.com
description: 'Cloud-native computing includes several components, including open-source Linux containers, Kubernetes, and microservices.'
og_description: 'Cloud-native computing includes several components, including open-source Linux containers, Kubernetes, and microservices.'
keywords: ['cloud native computing']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-13
modified_by:
  name: Linode
title: "What is Cloud Native Computing?"
h1_title: "What is Cloud Native Computing?"
contributor:
  name: Steven J. Vaughan-Nichols
  link: http://www.twitter.com/sjvn
---

# What is cloud-native computing?

Cloud-native computing includes several components, including open-source Linux containers, Kubernetes, and microservices. Its aim is to make the cloud the fundamental computing platform. Not hardware, not even the operating system – the cloud itself.

The benefits are flexibility, speed-of-delivery, and ease of development. Cloud-native computing makes [continuous integration (CI) and continuous delivery (CD)](https://www.linode.com/docs/guides/introduction-ci-cd/) possible. Cloud-native computing promises to help IT professionals create applications that are easy to deploy quickly when needed and for only as long as it&#39;s necessary. Because they can elastically scale up and down on the fly, cloud-native programs are cheaper and faster to deploy.

More technically: According to the [Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF) definition, [cloud-native computing uses open-source, vendor-neutral programs](https://github.com/cncf/toc/blob/master/DEFINITION.md) to build and run scalable applications in modern, dynamic environments such as public, private, and hybrid clouds. To do this, it uses containers, service meshes, microservices, immutable infrastructure, and declarative APIs. These programs work together on loosely coupled systems, which are resilient, manageable, and observable.

Even simplified, that&#39;s still quite a mouthful. But while cloud-native computing is complicated, it isn&#39;t hard. It does, however, require a lot of pieces to work together. This image shows every significant program that the CNCF considers to be part of the [Cloud Native Landscape](https://landscape.cncf.io/).

![Cloud Native landscape](CloudNative.png)

When you break it down, however, cloud native computing isn&#39;t as confusing as it initially appears.

To put it in simpler terms, cloud-native computing uses an open-source software stack to deploy applications as microservices; package each part into its own container; and dynamically orchestrate those containers to optimize resource utilization.

Cloud-native computing uses containers that run on dynamic clouds. Without containers or the elastic cloud, cloud-native doesn&#39;t exist. That&#39;s because the combination enables system administrators and developers to dynamically run applications from components that spring up and fall down as required by the services they provide.

So far, that&#39;s not too different from what you could do with virtual machines (VM) in a data center. But there&#39;s more.

First, cloud-native programs are **loosely coupled**. System components are interconnected in such a way that they depend on each other to the least extent practicable; the elements need little direct knowledge of one another. The code isn&#39;t hard-wired to any given infrastructure. In the case of cloud-native software, the elements are connected using APIs, service meshes, and networks.

Cloud-native programs are also **stateless**. They store their data and status in external databases. A cloud-native program doesn&#39;t &quot;know&quot; where its data resides. The data could be stored anywhere; it only matters that it can be accessed when it&#39;s needed.

As the name suggests, cloud-native programs live and die on clouds. They&#39;re developed there; staged and tested there; secured and debugged there; deployed there; and constantly improved via (CI/CD). It&#39;s a fundamentally different architecture.

## Managing cloud-native applications

To manage cloud-computing systems, administrators orchestrate the containers with [Kubernetes](https://www.linode.com/docs/guides/kubernetes/). Indeed, some would argue Kubernetes is essential to cloud-native computing.

Applications run inside Linux-based containers, They rarely use old-school development languages such as C++ or Java. Instead, cloud-native applications usually are written using web-centric languages, such as Go, Node.js, Rust, and Ruby. There&#39;s nothing wrong with the older languages, but cloud-native programming emphasizes flexibility and interoperability.

To further those goals, cloud-native computing also makes use of two other concepts: [serverless computing](https://www.linode.com/docs/guides/what-is-serverless-computing/) and [micro-services](https://www.linode.com/docs/guides/deploying-microservices-with-docker/).

Serverless computing ensures that applications don&#39;t need to know a thing about the hardware or how it&#39;s managed. The software just calls on the functions that the serverless platform provides without sweating the details. That means developers can focus on an application&#39;s business logic, rather than on architectural issues (such as whether the server has enough RAM or if it&#39;s running the latest Windows Server patch).

Micro-services provides lightweight, loosely coupled services via an API endpoint. These are connected by lightweight protocols such as [Representational State Transfer](https://www.service-architecture.com/articles/web-services/representational_state_transfer_rest.html) (REST) or [gRPC](https://grpc.io/). In cloud-native computing, data tends to be represented by [JavaScript Object Notation](https://www.json.org/) (JSON) or [Protobuf](https://github.com/google/protobuf/). They provide modular, basic services. It may be helpful to think of these as akin to Linux shell programs, which provide single services done well, but for the cloud.
