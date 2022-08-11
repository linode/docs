---
slug: kubernetes-use-cases
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide provides you with some use cases as well as advantages of using Kubernetes, the container and infrastructure orchestration technology.'
keywords: ['kubernets', 'k8s', 'use','cases','advantages']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-09-04
modified_by:
  name: Linode
title: "Advantages of Using Kubernetes"
contributor:
  name: Linode
aliases: ['/applications/containers/kubernetes/kubernetes-use-cases/','/kubernetes/kubernetes-use-cases/']
tags: ["kubernetes"]
---

## What is Kubernetes

Kubernetes is a container orchestration system that was initially designed by Google to help scale containerized applications in the cloud. Kubernetes can manage the lifecycle of containers, creating and destroying them depending on the needs of the application, as well as providing a host of other features. In the past few years Kubernetes has become one of the most discussed concepts in cloud based application development, and the rise of Kubernetes signals a shift in the way that applications are developed and deployed.

In general, Kubernetes is formed by a *cluster* of servers, called Nodes, each running Kubernetes agent processes and communicating with one another. The *Master Node* is made up of a collection of processes called the *control plane* that help enact and maintain the desired state of the Kubernetes cluster, while *Worker Nodes* are responsible for running the containers that form your applications and services.

For a more in-depth explanation of Kubernetes concepts, see our five-part [Beginner's Guide to Kubernetes](/docs/guides/beginners-guide-to-kubernetes/).

### What is Managed Kubernetes

*Managed Kubernetes* solutions are concerned with the management of one or more parts of a Kubernetes cluster. Because a cluster is formed from a number of different components, there are many different kinds of managed Kubernetes products, and each will solve a different set of problems.

{{< disclosure-note "Why use a managed Kubernetes solution?" >}}
Kubernetes can make managing containers and microservices easier, but Kubernetes itself also requires some administrative overhead. This includes:

- Performing updates to the Kubernetes control plane and agent software,
- Monitoring the health of those components, and
- Monitoring the health of the underlying hardware systems.

Managed Kubernetes solutions will help offload some or all of this work.
{{< /disclosure-note >}}

Here's a few common categories:

-   **Hosted, Managed Kubernetes**

    Several cloud computing companies offer products which provision clusters on their platform. The control plane and Master Nodes for these clusters are entirely managed by the platform, which means that all maintenance and updates for the control plane software are carried out by the platform, and the platform monitors the health of the Master Nodes and performs repairs as needed.

    The platform will provide interfaces for the customer to provision cloud instances that serve as Worker Nodes. These instances are pre-configured with Kubernetes' agent software and are automatically joined to your cluster.

    The customer generally assumes responsibility for deploying and maintaining their applications on the cluster. The Master Nodes are often provided at no cost, and the customer only pays for the Worker Nodes they provision.

    {{< note >}}
The [Linode Kubernetes Engine (LKE)](/docs/products/compute/kubernetes/) is an example of this category.
{{< /note >}}

-   **Software-as-a-Service Kubernetes**

    Other companies offer *Kubernetes-as-a-Service (KaaS)* products. These are cloud-based applications which assist in the provisioning and ongoing software maintenance of clusters. However, they do not necessarily provide the server instances which will act as your cluster's nodes. A frequent use-case for these products is using Kubernetes with on-premise servers:

    - The customer will create or build servers in their on-premise facility. The customer will usually need to complete some prerequisite instructions to prepare their servers for use with the KaaS application.

    - The KaaS application will connect to the customer's servers and form a cluster from them, where some servers are designated as Master Nodes and others as Worker Nodes. The KaaS product will install the appropriate Kubernetes control plane and agent software.

    - The KaaS application will continue to monitor the on-premise cluster and will perform software maintenance on them over time. The customer will need to perform repairs for any hardware issues on the cluster nodes.

    In this arrangement, the customer is responsible for the cost of the cluster nodes, but much of the administration complexity for Kubernetes is offloaded to the KaaS application.

    It's also possible to use some KaaS applications with other cloud infrastructure platforms. The KaaS application will provision a cluster that's formed from cloud instances on the platform, and the customer will pay that platform for all of the nodes in the cluster.

-   **Kubernetes management applications**

    In addition to cloud-based KaaS applications, there are some Kubernetes management applications that you can install and run on your own infrastructure. These provide a number of the same features as their cloud-hosted counterparts, including:

    - Monitoring of node and cluster health

    - Cluster software updates

    - Cluster creation tools

    While a customer will install and run these management applications on their own servers, the companies that author these applications may also offer support similar to cloud KaaS offerings.

    {{< note >}}
An example application in this category is [Rancher](https://rancher.com) from Rancher Labs.
{{< /note >}}

## Advantages

There are many reasons that developers would choose to use Kubernetes as a solution. Below is a short list of advantages and common use cases for implementing Kubernetes.

### Declarative in Nature

Kubernetes is declarative: describe to Kubernetes the desired state of the cluster and Kubernetes will ensure that this state is always fulfilled. If you want five containers running at any given time, all you need to do is create a [Deployment](/docs/kubernetes/beginners-guide-to-kubernetes-part-4-controllers/#deployments) and set the number of replicas to five. And, each set of instructions is rendered in human-readable YAML, which results in further benefits:

- **Version control of your infrastructure.** Because the resources in your cluster are declared in code, you can track changes to that code over time in version control systems like Git.

- **Minimization of human error.** Kubernetes' analysis of your configuration files will produce the same results every time it creates your declared resources.

- **Better collaboration among team members.** Your configuration files can be tracked in a version control system, so your team members can all contribute to the same centralized code-base and work on your Kubernetes services together.

### Portable, Cloud Agnostic Codebase

Kubernetes can run on virtually any public cloud, on-premise hardware, or even bare metal. Developing applications for Kubernetes means that code can be redeployed multiple times, allowing you to select the infrastructure of your choosing.

{{< note >}}
There are some caveats to this point. Many cloud infrastructure providers support Kubernetes, but there is no guarantee that they support all of the features of Kubernetes. For example, not every cloud provider offers [load balancing](https://en.wikipedia.org/wiki/Load_balancing_(computing)) as a feature, so a Kubernetes cluster on those providers will not support [Services of the type `LoadBalancer`](https://kubernetes.io/docs/concepts/services-networking/#loadbalancer).
{{</ note >}}

### Microservice Architecture

In contrast to monolithic applications whose constituent parts are not reusable and modular, Kubernetes encourages application developers to write code as microservices. Microservices are an application architecture that prescribes dividing code into independent, reusable, loosely coupled parts called services. These services run in separate containers that can be scaled depending on the needs of the application. Their small size and loose coupling make them easy to test and deploy in rapid fashion.

### Optimized Resource Usage

Kubernetes determines which Worker Nodes a container should run on based on available resources. By using Kubernetes you can rest assured that all of your compute resources are utilized efficiently across the cluster. As a result, you may be able to reduce the number of cloud instances or servers you operate, which can lead to cost savings.

### Zero Downtime with Rolling Deployments

[Pods](/docs/kubernetes/beginners-guide-to-kubernetes-part-3-objects/#pods) are the smallest unit of computing in Kubernetes, responsible for running your application's containers. Like many features of Kubernetes, pods have the additional capability of increasing your applications overall uptime when compared to other solutions. For example, consider the process that takes place when the code for your application and its container images has been updated by your team. To update your application running in your cluster, you'll need a way to update its Pods with the new container images.

Kubernetes offers a solution with [Deployments](/docs/kubernetes/beginners-guide-to-kubernetes-part-4-controllers/#deployments), which will create additional Pods with the newer image and assure that they are running and healthy before destroying the old Pods. Kubernetes will also roll back any changes should the newer containers fail. In this way there is limited downtime, ensuring a strong user experience.

### Self-Healing

For many reasons, containers can fail. Kubernetes keeps deployments healthy by restarting containers that have failed, killing and replacing unresponsive containers according to user-defined health checks, and re-creating containers that were on a failed backend Node across other available Nodes. This helps to mitigate what is a common pain point of the application upkeep process.

### Service Discoverability

It's important that all services have a predictable way of communicating with one another. However, within Kubernetes, containers are created and destroyed many times over, so a particular service may not exist permanently at a particular location. This traditionally meant that some kind of service registry would need to be created or adapted to the application logic to keep track of each container's location.

Kubernetes has a native [Service](/docs/kubernetes/beginners-guide-to-kubernetes-part-3-objects/#services) concept which groups your Pods and simplifies service discovery. Kubernetes will provide IP addresses for each Pod, assign a DNS name for each set of Pods, and then load-balance the traffic to the Pods in a set. This creates an environment where the service discovery can be abstracted away from the container level.

### Multi-Container Pods

Kubernetes [Pods](/docs/kubernetes/beginners-guide-to-kubernetes-part-3-objects/#pods) often run a single container, but they are capable of running multiple containers as well. This makes adding a loosely coupled, reusable "sidecar" container to a Pod easy. These sidecar containers serve to enhance the primary container running in a Pod; frequent use-cases including adding [logging](https://kubernetes.io/docs/concepts/cluster-administration/logging/) or a [service mesh](https://en.wikipedia.org/wiki/Service_mesh). These coupled containers will share an IP address with the primary container.

### Network Policy as Part of Application Deployment

By default, all Pods in Kubernetes can communicate with each other. A cluster administrator can declaratively apply networking policies, and these policies can restrict access to certain Pods or Namespaces. Basic network policy restrictions can be enforced by simply providing the name of Pods or Namespaces that you would like to give certain Pods egress and ingress capabilities to.

### Persistent Storage

While Kubernetes provides a storage solution, called a [Volume](https://kubernetes.io/docs/concepts/storage/), that allows data to outlive the lifecycle of a container, the data is still tied to the longevity of the Pod. However, Kubernetes also provides a mechanisms for [storing persistent data in cloud storage](https://kubernetes.io/docs/concepts/storage/persistent-volumes/). In particular, the [Container Storage Interface (CSI)](https://kubernetes.io/docs/concepts/storage/volumes/#csi) specification standard allows Kubernetes to create storage volumes on any cloud platform which supports the CSI.

For example, the [Linode Container Storage Interface (CSI)](/docs/kubernetes/deploy-volumes-with-the-linode-block-storage-csi-driver/), makes it easy for you to create and attach Linode Block Storage Volumes to your Pods. Even if a Pod that's attached to the Block Storage Volume is destroyed, the data will persist.

### Cron Jobs

Kubernetes provides a [Jobs](/docs/kubernetes/beginners-guide-to-kubernetes-part-4-controllers/#jobs) object for completing single tasks, like running a one-off script. For regular scheduled tasks, Kubernetes also provides [CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/) objects that can complete a task at a certain time, just like the [jobs you might find in a `crontab` file](/docs/guides/schedule-tasks-with-cron/). This is particularly useful because it provides a declarative way to schedule cron jobs from within a cluster.

### Secrets Management

One of the hurdles in container creation is the inclusion of secrets, tokens, and passwords. You simply don't want these sensitive values in your container images, especially if your containers are stored in a public registry like [DockerHub](https://hub.docker.com). Kubernetes helps to alleviate this burden by providing [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/) objects, an `etcd` database-backed secrets management solution. With Secrets, you can store sensitive data and later expose that data (for example, via environmental variables to the container), keeping the value out of the container's code.

### Declarative DNS Management

[Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) objects in Kubernetes allow for name based virtual hosting and HTTP routing in a straightforward, declarative manner. This means that Kubernetes is capable of directing multiple domains and URL paths to different Services. For instance, `domain1.com` and `domain2.com` can be hosted within the same cluster and target different services, and the URL paths `/first-service` and `/second-service` can be routed to the service `service1` and to `service2`, respectively.

### Scalability

Kubernetes makes it easy to horizontally scale the number of containers in use depending on the needs of the application. You can change this number from the command line, or you can use the [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) to change the number of containers based on usage metrics.

### Free and Open Source

Kubernetes is free and open source software (FOSS). While initially developed by Google, Kubernetes has been democratized and is now under the charter of the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/). Kubernetes is actively developed and maintained, with a number of high-profile companies championing its cause, all but ensuring it will have a long and influential tenure as the de-facto container orchestration solution.

## Additional Use Cases

### Testing Platform

With Kubernetes it's easy to create physical or virtual clusters that exactly mirror your production needs:

- You could create a separate testing cluster and use [`kubectl` contexts](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) to switch between testing and production.

- Virtual clusters are called [Namespaces](/docs/kubernetes/beginners-guide-to-kubernetes-part-3-objects/#namespaces). You can create Namespaces for testing, staging, and production, and run them all on the same hardware. With [ResourceQuotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/) you can easily limit the CPU and memory resource allocation of the Namespace, ensuring that every Namespace has exactly what it needs to run without stealing resources from other Namespaces.

### CI/CD Pipelines

A common integration for Kubernetes is setting up a continuous integration/continuous delivery (CI/CD) pipeline. Kubernetes offers the predictability of containers with the ease of service discovery to test, build, and deploy quickly.
