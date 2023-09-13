---
slug: what-is-a-service-mesh
description: 'In this guide you learn when to use a service mesh and how it can help optimize your web application''s operational overhead and centralize your service management.'
keywords: ['service mesh', 'what is a service mesh', 'microservices', 'service architecture']
tags: ['web applications', 'networking']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-22
modified_by:
  name: Linode
title: "The Benefits of a Service Mesh"
title_meta: "What is a Service Mesh?"
external_resources:
- "[The Service Mesh: What Every Software Engineer Needs to Know about the World's Most Over-Hyped Technology](https://buoyant.io/service-mesh-manifesto/)"
authors: ["Nathaniel Stickman"]
---

A service mesh can make managing a service-oriented application on the cloud much easier. It adds an infrastructure layer, keeping operational concerns out of service development, and centralizes service management. This guide covers how a service mesh works and when to use one.

## What is a Service Mesh?

A service mesh is a dedicated infrastructure layer to abstract and centralize your application's service-to-service communications. It is designed with modern service-oriented architectures, like microservices, and it is especially useful for cloud-based applications.

The key concept behind a service mesh is that the ideal place for operational functionality in a multi-service application is between the services themselves. By operating between services, a service mesh keeps your services independent not only of each other but also of your application's operational needs.

At the same time, a service mesh centralizes operational handling. The service mesh can register and manage service connections, push configuration parameters, and define communication rules from a central hub. This is especially useful in distributed service-oriented architectures, where services proliferate and are developed by various teams using diverse frameworks. In this way, a service mesh supports application scalability. Your application's number of services can continue to grow and sets of services can each be independently maintained. Additionally, the communication of your services is managed uniformly and centrally.

### Issues Addressed by Service Meshes

Service meshes centralize how services discover and access one another and how their configurations are managed. Doing so lets them address three significant issues that can arise when working with service discoverability, segmentation, and configuration. Here's how:

- A service mesh can keep each service in a registry, making each service easily **discoverable** by other services. Moreover, the service mesh can take a reference to a service and automatically direct it to an appropriate instance of the service. In this way, a service mesh essentially functions as a centralized load balancer for your services.

- Access rules between services can be defined by a service mesh and it can manage access through mechanisms like mutual TLS certification. It can thus ensure appropriate **segmentation** between services and also, manage intra-application security; a growing concern in web development.

- You can manage your service configurations centrally with a service mesh, because it allows you to push **configurations** to your services. This can be especially helpful when configuration parameters are repeated between multiple services. Centralizing them ensures consistent and easy maintenance.

### Parts of a Service Mesh

Broadly, a service mesh has two parts or *planes*. These planes work together to facilitate communication between services and to centralize management tasks.

- A *data plane*, consists of numerous proxies.
  - These proxies handle not only incoming and outgoing traffic but also traffic between services.
  - A service mesh tends to result in many proxies — often, either one per service node or one per service instance. Additionally, each call to a service mesh results in two proxy hops. So, the proxies need to be light and fast.

  - Typically, you can put the features these proxies offer into one of the following three categories:
    - Reliability features: handle traffic
    - Observational features: allow for aggregated metrics
    - Security features: define and enforcing access control and mutual TLS

- A *control plane*, consists of management processes.
  - These processes include whatever functionality the proxies need to function in a centrally coordinated manner. This includes service discovery, TLS certification, and configuration management.
  - The control plane also provides an API for managing and monitoring the service mesh as a whole.

## When to Use a Service Mesh

Using a service mesh brings a lot of additional performance and operational overhead. This is both because of the number of proxies needed and because of the additional operational tasks and knowledge required. So why use one?

You are likely to find a service mesh useful if any of the following is true for your cloud-based web application.

- Your application consists of distributed services that communicate synchronously.
- The application receives frequent modifications and enhancements that you need to deploy without taking the entire system down.
- Your web application has a proliferation of services, maintained by various teams, for which you need a uniform infrastructure.

The mesh operates between the application's services, allowing your services to be developed independently of operational concerns. The mesh also makes service-to-service communication more manageable at scale and helps to keep your stack uniform.

You may especially find a service mesh to be a boon if your service-oriented application is growing. More services in your application, and more teams working on those services, can bring more operational overhead. This is the case both in terms of infrastructure and in terms of service management. A service mesh's ability to abstract and centralize service management makes scaling your application easier and more reliable.

Although service meshes can be resource expensive right now, it seems likely that this is less the case as time goes on. More innovative approaches are emerging aimed to reduce and offset the costs of deploying and maintaining a service mesh.

## Service Mesh Providers

There are currently three major contenders in the field of service mesh providers:

- [Consul](https://www.consul.io/) is part of the HashiCorp infrastructure management suite. The Consul service mesh balances between simplicity and flexibility, and it can be an especially compelling solution if you already use HashiCorp products.

- [Istio](https://istio.io/) is an open-source service mesh solution initially developed by Lyft and backed by big names like Google, IBM, and Microsoft. It boasts a deep analytics system and the ability for its proxies to cache information from the control plane, improving performance. Its big-name backing can be a plus, but some note that it comes with added complexity.

- [Linkerd](https://linkerd.io/) was the first service mesh project — the one that introduced the term and the core concepts behind it. It is independently-backed and part of the [Cloud Native Computing Foundation](https://www.cncf.io/). The Linkerd service mesh emphasizes simplicity. While this reduces its flexibility, it can make it easier to approach and manage.

## Next Steps

In addition to the resources linked below, you can also continue to learn about service meshes and how to use them in the guides listed below. Each guide shows you how to get started with a specific service mesh provider.

- [How to Install HashiCorp's Consul Service Mesh](/docs/guides/how-to-install-hashicorp-consul-service-mesh/)
- [How to Deploy Linkerd 2 with Linode Kubernetes Engine](/docs/guides/how-to-deploy-linkerd-with-linode-kubernetes-engine/)
