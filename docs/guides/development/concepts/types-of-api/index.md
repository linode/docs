---
slug: types-of-api
description: "What are the different types of APIs and when should you use them? This guide discusses types of API and their different protocols."
keywords: ['types of apis','api formats','api types']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-04-08
modified_by:
  name: Nathaniel Stickman
title: "What are the Four Types of API Formats?"
title_meta: "A Guide to API Formats: The Different Types of APIs"
authors: ["Nathaniel Stickman"]
---

APIs are what keep software connected. Whether you are looking to link your application to others or you want to have smooth communication between services, APIs help bring multiple pieces of an application together.

Applications and services can be connected in myriad ways, depending on access limitations and communication protocols. APIs have developed several different approaches for making connections to support modern application architectures.

In this tutorial, learn about what APIs are, the types of APIs that are available, and the various protocols they can use to communicate.

## What is an API?

An API — short for *Application Programming Interface* — defines a set of rules by which applications and services can interact.

APIs are used in a wide variety of contexts. However, often, when people talk about APIs, they are talking about *web APIs*. These APIs allow for communication between applications and services using the [HTTP protocol](/docs/guides/introducing-http-2/).

Often, web APIs are used for web application servers and web browsers to communicate. However, you may also see web APIs used for communication between different web servers, or between applications on the same server. You may even see web APIs at work between different services acting as parts of the same application. One example of an API enabling communication between different services of the same application, is Kubernetes. The [Kubernetes API](/docs/guides/beginners-guide-to-kubernetes-part-1-introduction/#kubernetes-api) is the linchpin to its powerful orchestration system.

## The Four Main Types of APIs

APIs come in four different modalities. Each of these covers a different access level or, in the case of web APIs, a different usage.

Which one of these you use depends on your API's particular needs. The sections below provide descriptions of each kind of API and they can help you decide which is best for your use case. Each section also provides context and examples to make it easier to see how each API model can fit into different use cases.

### Open APIs

Open APIs, or public APIs, come with limited or no access restrictions. This essentially allows any developer to make requests to these APIs.

These APIs may have some limits. A developer may have to register an account to receive an API key, for instance. Additionally, limits may be placed on things like the number of requests in a given time frame.

But overall, open APIs are distinguished by being intended for widespread external use. They are meant for third-party developers to be able to access and make use of the API as they need.

An example of open APIs are those provided by [NASA](https://api.nasa.gov/). After completing a simple registration for an API key, NASA gives you access to numerous open APIs. NASA's open APIs include everything from Earth observation images to information about the weather on Mars.

#### When to Use an Open API?

Make your API open when you intend it for public consumption. Open APIs are especially useful when you have information or services you want to make available to the general public.

These APIs are often used for open source projects and for the dissemination of public knowledge, like NASA and other government agencies.

### Partner APIs

Partner APIs require authorization of some kind to use. They still allow external access, but are not intended for the general public to have access to. Instead, partner APIs are designed for use by pre-approved individuals, teams, or organizations.

A partner API may allow public access through a paid subscription or it may limit access to developers with a business relationship. Typically, the developer has an API key, as with open APIs, that require registration. But with partner APIs, keys tend to be given out more sparingly and with more access restrictions.

An example of a partner API is one that allows two companies to work together. Company A may have an application which Company B has agreed to provide services for. Developers at Company A receive API keys which they can use to access Company B's API. This allows Company A's application to make use of Company B's services while keeping access to these services limited.

#### When to Use a Partner API?

Make your API a partner API when it needs to be accessed externally but that access needs to be limited to authorized users. Partner APIs are ideal for business-to-business services or for subscription-based APIs.

You are likely to see partner APIs in companies that make use of external services for parts of an application's functionality. Often, this can be a preferred solution compared to developing services in house. It allows companies to integrate features that have been developed by experts elsewhere into their applications. At the same time, it lets the external experts retain control of their services.

### Internal APIs

Internal APIs, also called private APIs, disallow external access. Instead, these APIs can only be accessed by developers within a company or even within the particular application to which the API belongs.

These APIs are the most limited. APIs are incredibly useful in defining communication between applications and services, and this even applies when communication is within a single organization.

A simple example of an internal API use case is a company that has two applications for selling items. One application allows customers to purchase items directly; the other allows sales personnel to process sales. Both applications need access to the inventory. The company could have both applications independently access the inventory database. However, doing so would likely lead to more difficult and inconsistent maintenance.

So, instead, the company has an internal API for managing inventory. Both the customer-facing and sales-personnel applications can access this API to view and update inventory. Updates to each application can be made independently, as long as each adheres to the rules of the API.

#### When to Use an Internal API?

Make your API internal when you want to restrict access as much as possible. Internal APIs are designed to be private, with only applications and services within your organization having access. An internal API can even be used when different parts of an application need to communicate.

These APIs are common within enterprise organizations. When applications scale, it helps to define APIs for managing underlying logic. Take the example above, where business logic can be developed and maintained in the customer-facing and sales-personnel applications. This can be done without concern for the impact to the underlying data storage and retrieval tasks, since those are housed in the internal API.

### Composite APIs

Composite APIs allow for requests to be bundled or chained together, which, in turn, allows developers to receive single responses for request collections.

These APIs are useful for reducing server load and network traffic when you expect frequent requests to multiple API endpoints. Calls get made less frequently, resulting in reductions to server processing time and the number of requests across the network.

This makes composite APIs exceptionally effective for microservices. Often, applications built on microservices have to compile information from multiple sources. Having composite APIs that do this makes for more efficient applications.

To give an example of a composite API in action, think of an online ordering form. When the user completes and submits the form, the application often has to register the user, check and update inventory, and send a confirmation notification. A composite API allows all of these tasks to be handled simultaneously, in a single call.

#### When to Use a Composite API?

Make use of a composite API when your application exposes endpoints that are likely to be called in groups or in quick succession. This is often the case with microservices, where requests and responses frequently need to be combined.

This type of API can be especially useful when your [microservice application](/docs/guides/deploying-microservices-with-docker/#what-is-a-microservice) needs to communicate with users' web browsers. Here, you want to optimize network traffic to reduce load times and improve user experience. You also want to reduce your server load to make your application scalable for a larger number of users.

## What are the Different API Protocol Types?

Every API uses a particular protocol. An API's protocol defines the rules for how it can communicate. These rules make explicit the kinds of requests that can be made, what the API's responses look like, and what kinds of data the API can send and receive.

There are three main protocols used by web APIs.

- **REST**. Short for Representational State Transfer, REST implements stateless APIs with uniform interfaces using HTTP. REST is actually more of a set of architectural principles for APIs than a protocol proper. You can use the [Flask Python framework](/docs/guides/create-restful-api-using-python-and-flask/) to build your own REST API.

- **SOAP**. The Simple Object Access Protocol uses XML for requests and responses and maintains strict definitions for messages. SOAP is highly adaptable, designed to be neutral, and applicable in many contexts, not just for web APIs. It can even be used in conjunction with REST principles.

- **RPC**. Simpler than both REST and SOAP, the Remote Procedural Call protocol focuses on actions taken on a server. This is in contrast to both REST and SOAP, which tend to focus on server resources. RPC works primarily on running processes. Often, RPC APIs execute scripts on the server.

## Conclusion

This guide has walked you through the basics of APIs, explaining the different categories they fit into and the contexts they are used in. The four main types of APIs are open, partner, internal, and composite. The guide also covered the protocols web APIs use to send and receive messages. These API protocols are REST, SOAP, and RPC. You now have a strong foundation for entering into the world of web APIs. It is a wide and fast-moving world.

