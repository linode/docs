---
slug: what-is-infrastructure-as-a-service
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide provides you with an overview of IaaS (Infrastructure as a Service), a cloud computing service that provides the virtual infrastructure to customers on demand.'
og_description: 'This guide provides you with an overview of IaaS (Infrastructure as a Service), a cloud computing service that provides the virtual infrastructure to customers on demand.'
keywords: ['infrastructure as a service','iaas','infrastructure','cloud networks']
tags: ['networking', 'linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-06
modified_by:
  name: Linode
title: "What Is Infrastructure as a Service?"
image: An_introduction _to_ Infrastructure_as_a_Service.jpg
h1_title: "An Introduction to Infrastructure as a Service"
enable_h1: true
contributor:
  name: Jeff Novotny
  link: https://github.com/JeffreyNovotny
external_resources:
- '[Open Stack](https://www.openstack.org/)'
- '[Apache CloudStack](https://cloudstack.apache.org/)'
- '[Docker](https://www.docker.com/)'
---

*Infrastructure as a Service* (IaaS) is a cloud computing service that provides virtual infrastructure to customers on demand. However, customers still manage and operate their own resources. This model frees users from having to operate and maintain their own costly equipment. Some of the infrastructure components offered by IaaS providers include servers, data storage, and networking capabilities. This guide describes IaaS and explains its advantages and rationale, and outlines how to use it.

## Characteristics of Infrastructure as a Service

IaaS is a mature computing model that first became popular about a decade ago. Although it faces competition from newly emerging technologies, it is currently the most common cloud computing paradigm.

IaaS cloud providers, such as [Linode](https://www.linode.com/), offer IaaS services from their extensive pool of physical servers in their data centers. These vendors use a *hypervisor*, also known as a *Virtual Machine Monitor* (VMM), to create the virtual service. A hypervisor is a type of emulator that runs on an actual hardware host, which is referred to as the host machine. It runs a Virtual Machine (VM) that mimics an actual server or network. Some common types of hypervisors include Xen, Oracle VirtualBox, Oracle VM, KVM, and VMware ESX.

The most common way of creating an IaaS VM is by using cloud orchestration technologies such as [OpenStack](https://www.openstack.org/) or [Apache CloudStack](https://cloudstack.apache.org/). These programs choose a hypervisor to run the VM on and then create the virtual machine. They also frequently allocate storage and add firewalls, logging services, and networking essentials including IP addresses. Advanced services might include clustering, encryption, billing, load balancing, and more complicated  *Virtual Local Area Networks* (VLAN). A Virtual Private Cloud (VPC) can assist in further isolating the cloud resources. Both [Central Processing Unit](https://www.linode.com/products/dedicated-cpu/) (CPU) and [Graphics Processing Unit](https://www.linode.com/products/gpu/) (GPU) systems are typically available.

Customers of IaaS access their virtualized infrastructure over the internet. They use a visual dashboard or Graphical User Interface (GUI) to quickly create or modify devices, often with the push of a button. The dashboard can also be used to monitor performance, collect data, troubleshoot, and track costs. All services are provided on a pay-as-you-go model. Some organizations might develop their own private cloud rather than using a provider, but this model is typically only used by large technology companies.

Services can also be provisioned programmatically using APIs. This technique is often used together with *Infrastructure as Code* (IaC) technologies, which deploys the infrastructure using scripts. IaC allows users to standardize common infrastructure tasks and test their deployments using automation.

One important point about IaaS is the customer does not control the underlying physical hardware components and interconnections. These remain under the control of the cloud provider. Users of IaaS are typically responsible for the selection and installation of the operating system and all software applications, including databases and middleware.

## IaaS and Other Cloud Service Models

IaaS is only one of several types of cloud-based or virtualized services. The other variants include *Software as a Service* (SaaS), *Platform as a Service* (PaaS), and serverless computing. These models are differentiated by the level of service they provide and the amount of control they allow. Here is a short summary of some of the main IaaS alternatives.

- **Bare Metal as a Service (BMaaS):** This service provides users with direct access to the hardware, except the provider owns the devices. It is very similar to a straight rental service. BMaaS gives customers more control over the architecture and layout of their network. Users of BMaaS should find this very similar to running their own on-premise server, without the operational costs or capital expenses. However, BMaaS provides no further advantages over an in-house server and none of the IaaS optimizations.
- **PaaS:** PaaS extends the IaaS model to include operating systems, web servers, tools, databases, and other managed services. The PaaS user is still responsible for adding and managing applications on top of the vendor-provided platform. This makes deployment even easier at the cost of some flexibility. PaaS services are often used for software and application development.
- **SaaS:** SaaS provides software services to customers on demand. Users access the software on the provider's server, typically through a web browser. SaaS clients are only responsible for configuring the application, maintaining an access control list, and the actual content. SaaS is usually geared towards a completely different audience. Most SaaS clients do not require a platform and do not need IaaS capabilities.
- **Serverless:** Serverless computing eliminates the need to manage your infrastructure. It lies somewhere between PaaS and SaaS in term of the control/ease-of-use it provides, but is not exactly like either model. The name "serverless" is somewhat misleading. Servers are being used, but the end-user has no knowledge or visibility of them. Serverless computing provisions all resources on-demand, and automatically and dynamically scales them up and down in close to real-time. This makes more efficient use of computer resources because the provider allocates the memory, CPU, and networking resources based on the calculated demand. Serverless computing is well suited to a microservices model and is frequently used in software development. However, it can add more latency, and cold starts can affect the system's performance.

Containers, such as [Docker](https://www.docker.com/), are another option for implementing virtualization, but they follow a completely different model. Containers do not use hypervisors. They run on a Linux partition directly on the hardware. Containers could be said to offer operating-system-level virtualization. Containers offer better performance than hypervisor-based servers at the cost of some additional complexity and have become increasingly popular.

## Reasons to Use IaaS

Although efficiency and ease of use prompt most deployments, the IaaS model is particularly well suited to the following scenarios.

- **Testing and rapid development:** IaaS allows for quick prototyping and efficient automated testing. Servers can be created and deleted as required. IaaS facilitates the testing of an application on different platforms and networks. It is also useful for temporary or experimental workflows.
- **Backup and recovery:** IaaS services are handy for backing up applications and data, and for rapid recovery systems for on-site networks. In this case, the IaaS network typically mirrors the configuration of the on-site servers.
- **Legal and compliance requirements:**  IaaS systems are a good choice for data retention and other record-keeping requirements.
- **High-performance and specialized computing:** The cost of buying high-performance equipment capable of specialized tasks might otherwise be prohibitive for smaller businesses. IaaS enables smaller businesses to access advanced systems capable of handling data analysis, computer modeling, and 3-D graphics.
- **Managing unpredictable demand:** The ability to scale up and down means IaaS is a good choice for unpredictable scenarios when the demand is unknown or might vary dramatically. It allows companies to handle unexpected surges.
- **Rapid migration to the cloud:** IaaS APIs allow for the easy translation of the original network and configuration into IaaS specifications.
- **Application and web development:**. IaaS is also frequently used for web hosting.

## Advantages and Disadvantages

Overall, IaaS offers several distinct advantages and only a few disadvantages. Some of the main advantages are as follows:

- It reduces maintenance, operating costs, and lab space. IaaS allows businesses to focus on their core activities instead of running a on-premises servers.
- It eliminates the need for capital expenditures on equipment. The pay-as-you-go operating expense of IaaS is easier to budget for than large capital expenditures.
- IaaS networks can react rapidly to changing business demands, by quickly expanding or contracting. New services are easily created, and customers only use and pay for what they need.
- IaaS elegantly handles system backups and redundancy and increases reliability. For example, cloud providers have multiple labs and are hardened against failures.
- Providers of IaaS offer different packages with different levels of memory and performance. It is easy for a customer to find the right package for their network. Customers can also upgrade or downgrade according to their current situation.
- IaaS providers have more expertise with hardware and networking technologies and can provide advice and support.
- Many IaaS vendors have geographically diverse locations. This makes it easier for organizations to position their resources closer to their end-users. It also provides an even greater level of redundancy and protection in the case of local outages or failures.
- IaaS can provide better security because vendors are more familiar with updated security protocols.

There are very few disadvantages to IaaS platforms. The biggest drawback is the relative lack of flexibility and low-level visibility compared to on-premises servers. Customers cannot deploy a system that their IaaS vendor does not offer, and they cannot control attributes such as IP address blocks and subnets. However, this is usually not a big concern for most deployments.

Customers should also be aware that most hypervisors support multiple users, and their performance and throughput could be affected by other customers at times.

## How to Use IaaS

IaaS-based networks are easy to create and configure, but it is important to plan out deployments so they are efficient and effective. It is particularly critical to consider all the implementation details before migrating an existing network.

### Migration Strategies

Several options are available to organizations that want to relocate their existing network to use an IaaS model.

- **Staged:** In a staged migration, certain components of the old network are moved over to IaaS before others. For instance, the database or the data could be moved over first. Meanwhile, the original on-site servers are still used to access the database. This strategy reduces the overall risk of the move.
- **Re-hosting:** This method is also known as the "lift and shift" strategy. The existing configuration, data, and applications are migrated to an IaaS model without any significant modifications. The new IaaS servers are configured the same way the original physical servers were.
- **Refactoring:** Refactoring re-engineers the environment from scratch to take advantage of IaaS capabilities. This might involve a more detailed API roll-out using IaC products, closer attention to scalability, and more efficient use of cloud resources. During the move, candidate tasks for automation and streamlining can be identified.
- **Hybrid:** With this strategy, infrastructure items are moved to IaaS selectively. Some resources might remain on the old network for security, logistical, business, or legal reasons.

Additionally, a company might reduce or retire certain legacy systems. This is especially likely to happen during a refactoring process. However, any detailed planning process should seek to identify unnecessary items. Occasionally, a finished prototype or experimental product could be migrated the other way, from an IaaS network back to the on-premise server.

### IaaS Deployment Strategies

Each IaaS deployment is unique, but the following high-level principles generally apply.

- Understand and be clear about the business requirements and the budget before proceeding with any deployments.
- Carefully review and understand the policies of the cloud provider and their plans, packages, and products. Be clear about the capabilities of the virtualized infrastructure, including the throughput, storage, and memory/performance of each item.
- Consider how any existing databases and servers should be migrated using one of the techniques in the [Migration Strategies](/docs/guides/what-is-infrastructure-as-a-service/#migration-strategies) section.
- Attempt to reduce downtime. Schedule a maintenance window for the migration.
- Test the new network before live deployment.
- Consider how much storage and what storage types should be used. The main types of storage are [object storage](/docs/products/storage/object-storage/guides/use-cases/), file storage, and [block storage](/docs/products/storage/block-storage/guides/use-cases/). Object storage has become more popular recently because its distributed architecture fits well with the IaaS model.
- Consider the resiliency and reliability requirements for the network.
- If necessary, determine the level of support and the service package that is required.
- Decide what network metrics are important, and monitor these items during and after the initial deployment. Scrutinize the entire network as a single system and continue to regularly maintain, adjust, and optimize it.
