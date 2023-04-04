---
slug: cloud-containers
description: 'What is a cloud container? This guide introduces you to cloud containers, the benefits of container cloud computing and various use cases.'
keywords: ['cloud containers','containers in cloud computing ','what is a container in cloud']
tags: ['container', 'kubernetes']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-10
modified_by:
  name: Linode
title: "How Cloud Containers Work And Their Benefits"
title_meta: "Introduction to Containers in Cloud Computing"
authors: ["Andy Patrizio"]
---

Tech trends come and go but cloud containers are one tech that’s here to stay. Their origins can be traced back to 1982 Unix, but containers didn't gain wide acceptance until the last decade as the next logical step from virtualization. Today they are a popular means of application modernization and deployment.

The goal of containerization – that is, the process of migrating legacy apps to containers – is to offer a better way to create, package, and deploy complex software applications across different environments. Containerization provides a way to make applications less complex to deploy, update/change/modify, and scale.

Containers are increasingly popular in cloud environments because of their light weight relative to virtual machines (VMs). Many organizations view containers as an alternative to VM’s large-scale workloads.

## What Are Cloud Containers?

Compute containers contain application code along with its libraries and function dependencies so they can be run anywhere; whether on a desktop PC, traditional IT server infrastructure, or the cloud.

They are small, fast, and portable because unlike a virtual machine, containers do not need to include a full blown OS in every instance. All they need are the libraries and dependencies necessary to run the app, and leverage the other features and required resources from the host OS.

Containers are created from container images, which are templates that contain the system, applications, and environment of the container. With container images, much of the work of creating a container is already done for you. All you have to do is add the compute logic. There are many different templates for creating use-specific containers, just as there are libraries and templates for developing code.

There are multiple container template sites but the market leader is Docker, which kicked off the container trend in 2013. Docker is a set of tools that allows users to create container images, push or pull images from external registries, and run and manage containers in many different environments. It also runs the largest distribution hub of container templates. To learn how to install Docker on your Linux system, see our [Installing and Using Docker](/docs/guides/installing-and-using-docker-on-ubuntu-and-debian/) guide.

Containers are significantly reduced in size and complexity, and often perform only a single function. Just because they are small doesn't mean they don’t have to be managed. Containers are maintained through a process known as orchestration, which automates much of the operational tasks needed to run containerized workloads and services.

Orchestration covers managing a container's lifecycle, provisioning, deployment, scaling up or down, networking, load balancing, and more. There are several orchestration apps, but far and away the most popular is [Kubernetes](/docs/guides/beginners-guide-to-kubernetes/) originally designed by Google and now maintained by the Cloud Native Computing Foundation.

## Containers vs. Virtual Machines

Containers are regularly compared to VMs here and elsewhere and for good reason. They operate on the same concept, which is the operation of multiple application environments on the same physical hardware.

VMs are considered the foundation of the first generation of cloud computing. With the advent of 64-bit computing, servers evolved past the 4GB memory limit of 32-bit processors. The arrival of multi-core produced processing power for multiple virtual environments. With enough memory and cores it is possible to run a hundred or more VMs on one physical system.

A VM needs a full operating environment that consumes one to two gigabytes of memory, regardless of whether it’s on a Windows Server, or a version of Linux. A container is a significantly reduced operating environment and uses as little as 6MB of memory.

The benefit is you can have hundreds of containers on one robust server, so long as you have the memory and processing power to handle it all.

VM hypervisors virtualize the physical hardware, and containers virtualize the operating system. The hypervisor manages and coordinates all I/O and machine activity, balances out the load and processes all physical tasks such as processing and data movement.

A container manager like Kubernetes handles software tasks that the container is not set up for. The app within the container has what it needs with its libraries and dependencies. If it needs something else from the OS, the container manager handles it.

It is not an either/or decision when it comes to VMs and containers. They can co-exist easily, with containers inside VMs working away.

## How Do Cloud Containers Work?

Container technology was born with the first separation of partitions and chroot processes in Unix, which was later added to Linux. Containers bundle their dependency files and libraries in the container rather than rely on the underlying OS. The apps that run in containers are not full-blown, complex apps that run in a standard virtual or non-virtual environment. Each container operates in virtual isolation with each application accessing a shared OS kernel without the need for VMs.

Cloud containers are designed to virtualize a single application, whether it’s a simple single-purpose app or a MySQL database. Containers have an isolation boundary at the application level rather than at the server level so the container is isolated if there is a problem. If there was an app crash or unexplained excessive consumption of resources by a process, it only affects that individual container and not the whole VM, or whole server. The orchestrator is able to spin up another container to replace the problematic container. It also shuts down and restarts the container with the issue.

## The Benefits of Containers in Cloud Computing

The benefits of using containers are numerous. First, the use of templates is similar to how classes and libraries work in object-oriented programming (OOP). In OOP, you create a class or object and then reuse it in multiple apps. The same holds true for containers. A single container image is used to create multiple containers. The OOP concept of inheritance also applies to containers since container images act as the parent for other, more customized container images.

Containers run consistently on a desktop, local server, or the cloud. This makes testing them before deployment uncomplicated. Some scenarios require a test bed similar in scale to the deployment setting, which means dedicating considerable resources for the test environment. Containers can be tested locally before cloud deployment with the knowledge that performance will be consistent.

The primary advantage of containers, especially when compared to a VM, is that containers are lightweight and portable. Containers share the machine OS kernel, which eliminates a lot of overhead. Their smaller size compared to VMs means they can spin up quickly and better support cloud-native applications that scale horizontally.

1. They are platform independent: Containers carry all their dependencies with them, and you can use them on different Linux flavors so long as you don’t make kernel calls.

1. Supports modern development architectures: Due to a combination of their deployment portability/consistency across platforms and their small size, containers are an ideal fit for modern development and application methodologies, such as Agile, DevOps, serverless, and microservices.

1. Improves performance: Containerized apps are typically big apps broken down into manageable pieces. This has multiple benefits, not the least of which is performance improvements because if a component needs increased resources, the container automatically scales to offer more CPU cores/memory/networking, then scales down when the load drops.

1. Efficient debugging: Another benefit of containerization over monolithic apps is it becomes quicker to find performance bottlenecks. With a monolithic app, developers have to do a lot of trial and error/process of elimination to find a performance bottleneck. When broken down into components, the offending code becomes more visible and the developers can zoom in on the problem spot faster.

1. Hybrid/multi-cloud support: Because of its portability, containers can migrate back and forth between on-prem and the cloud. They can also move from one cloud provider to another.

1. Application modernization: A common way to modernize a legacy on-prem application is to containerize it and move it “as is” to the cloud. This model is known as “lift and shift,” and is not recommended. On-prem apps behave differently than cloud-native apps and just moving an on-prem app to the cloud unchanged doesn't take advantage of cloud benefits like automatic scaling up and down.

1. Improves utilization: Under a monolithic app, the whole app and all its memory use has to increase performance. This slows down the server. With a containerized app, just that performance-intensive component needs to scale. It does it automatically, and the orchestrator scales up resources when required, and then scales down when the task is done.

## Conclusion

Containers are an increasingly popular way for companies to migrate on-premises apps to the cloud and reap all the benefits the cloud brings: scale, elasticity, DevOps development, and off-loading on-prem resources to a cloud provider.

The technology is mature, with a number of competitors to Docker, including Microsoft Azure, and competitors to Kubernetes, such as Red Hat OpenShift. Most cloud providers offer some ready-made container and orchestration services, including us here at Linode, with a [managed Kubernetes](https://www.linode.com/products/kubernetes/) service.