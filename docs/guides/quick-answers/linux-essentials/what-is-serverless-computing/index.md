---
slug: what-is-serverless-computing
description: 'Serverless computing is an application deployment architecture where cloud resources are supplied on-demand.  Learn how it works and why people use it.'
og_description:  'Serverless computing is an application deployment architecture where cloud resources are supplied on-demand.  Learn how it works and why people use it.'
keywords: ['serverless computing']
tags: ["linux", "container"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-01-29
modified_by:
  name: Linode
title: 'What is Serverless Computing?'
authors: ["Andy Patrizio"]
---
Serverless computing is a type of application deployment architecture that allows developers to write an application that is executed on-demand. When the application is no longer needed system resources are not allocated to the app. You don't need to set up a server to host your application, because this is typically managed by a service provider. The usage of the term *serverless* can be misleading because it implies that no servers are involved. However, servers are definitely involved; but the terminology points to the fact the servers are not something developers need to worry about when using this approach to development.

Serverless applications are often referred to as *functions*. That is because the applications are very often simple applets that do one thing, a single function. They are not comprised of complex functions like server-side applications.

In many ways, serverless computing (often shortened to just *serverless*) is a natural evolution of [Platform-as-a-Service (PaaS)](/docs/guides/what-is-cloud-computing/#cloud-computing-models). Whereas Infrastructure-as-a-Service (IaaS) is the basic cloud service that offers storage, networking, and virtualization, PaaS is an operating system plus a development tool environment for building applications. All back-end operations are handled by the cloud provider so the developer only has to worry about their application. To learn more about IaaS and Paas, you can view our guide [What is Cloud Computing?](https://www.linode.com/what-is-cloud-computing/) or our [Glossary of Cloud Computing Terms](https://www.linode.com/cloud-computing-terms/).

Serverless is similar to PaaS. It offers a fully-managed platform that frees developers from the need to maintain a server and to deal with system resources. This means the application is no longer tied to a specific server; the software runs on whatever server is available.

With serverless computing, rather than provisioning virtual machines and deploying code to them, the development team has only a few requirements. Developers upload the code and let the server determine how to best deploy and run those functions.

## The Benefits of Serverless Computing

Serverless computing has a number of benefits:

- There are no servers to provision or manage.
- Scaling is done dynamically and in response to the application's resource needs.
- The cloud provider takes care of availability issues, such as keeping the application running and restarting it in case of failure.
- It can save money. You only pay for resources the application uses. You don't pay when the code isn't running.

There are also disadvantages:

- Testing and debugging is more difficult because developers lack visibility into backend processes.
- Security concerns can come up due to a lack of control over the back end and how data is handled. Because of the simplicity of the functions, proper data security features may be missing that would be present in an enterprise application.
- Because of its nature and design, serverless is not ideal for long-running processes. You don't run an [ERP](https://en.wikipedia.org/wiki/Enterprise_resource_planning) application as serverless. Serverless is designed for running a single task for a short period.

### On-Prem or in the Cloud

Serverless computing can be used in both an on-premises scenario or via a cloud provider. There are two categories of serverless computing platforms. You likely have heard of at least one of these: *Kubernetes*. Kubernetes is an open source containerized platform for deploying serverless functions in an on-premises environment. It's extremely popular. There are a number of non-Kubernetes platforms as well that don't depend on another framework. The best known is [Apache OpenWhisk](https://openwhisk.apache.org/), developed by IBM, as well as [IronFunctions](https://github.com/iron-io/functions), [Fn Project](https://fnproject.io/), [OpenLambda](https://open-lambda.org/), and [OpenFaaS](https://docs.openfaas.com/).

Given that you can use serverless computing in the cloud or on-prem, which is better? It depends.

#### Pluses and Minuses of the Cloud

Cloud-based serverless computing has several advantages:

- Cost: On-premise serverless infrastructure has high operating costs because you are running your own hardware. These costs must be paid regardless of utilization. When using a cloud provider you only pay for the computing resources you use.
- Scaling: Cloud providers always have more capacity than you. In these scenarios, serverless scaling capabilities are essentially infinite and can be added or reduced immediately.
- Low latency: Because the cloud providers have multiple data centers distributed around the globe, latency times remain low. Customers always enjoy rapid response regardless of location.

And then there are the caveats:

- Security and compliance: Regulatory concerns such as financial or medical laws may hinder the nature of what you can store in the cloud. And anything outside of your data center can be more vulnerable than on-premise servers – at least in the perception of decision-makers.
- Debugging: Debugging is generally more difficult. Every time a serverless instance spins up, it creates a new version of itself. When it winds down, it erases its data, making it much harder to trace activity, and gather telemetry.
- Vendor lock-in: Moving your application to a different cloud provider might require rewriting your application code. Every vendor has its own set of APIs, so you may have to update your code to work with a new vendor's API and service.

#### Pluses and Minuses of On-Premises

On-prem execution has several advantages over cloud-based serverless computing:

- Avoid vendor lock-in: As described, cloud vendors use proprietary APIs that tie you to their service. Yes, you still use a vendor to provide on-premises software but the majority are open source with fewer lock-in hooks.
- Enhanced infrastructure control: Since you control the hardware, you can make sure certain functions don't run at the same time or that too many run at once.
- Potentially cheaper: Depending on your usage it may cost less to run on-prem. Since the cost is tied to usage, if you are running a large number of functions you might be better off using on-prem.
- Reduced security risks: Compliance and regulatory issues might force your hand.

Serverless computing is the finer point of virtualization. In a virtual environment, you had the whole operating system in an instance. Then came containers, with smaller, trimmed-down operating environments to run simpler applications. Because of their smaller size, more containers could be run on the same physical hardware than on virtual machines. And containers were easier to manage than VMs.

Serverless takes things down one more notch. There's no server deployment at all, a single function runs in a sparse amount of memory and shuts down when done. It is the simplest form of computing. For now.
