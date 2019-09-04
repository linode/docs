---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Advantages of using Kubernetes.'
keywords: ['kubernets', 'k8s', 'use','cases','advantages']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-09-04
modified_by:
  name: Linode
title: "Advantages of Using Kubernetes"
contributor:
  name: Linode
---

## What is Kubernetes

Kubernetes is a container orchestration system that was initially designed by Google to help scale containerized applications in the cloud. Kubernetes can manage the lifecycle of containers, creating and destroying them depending on the needs of the application, as well as providing a host of other features. In the past few years Kubernetes has become one of the most talked about concepts in cloud based application development, and the rise of Kubernetes signals a shift in the way that applications are developed and deployed. There are many reasons that developers should seek out Kubernetes solutions. Below are a sampling of advantages and use cases that Kubernetes posseses.

For a more in-depth explanation of Kubernetes concepts, see our five-part [Beginner's Guide to Kubernetes](/docs/applications/containers/kubernetes/beginners-guide-to-kubernetes/).

## Advantages

### Declarative in Nature

Kubernetes is declarative: describe to Kubernetes the desired state of the cluster and Kubernetes will ensure that this state is always fulfilled. If you want five containers running at any given time, all you need to do is create a Deployment and set the number of replicas to five. And, each set of instructions is rendered in human-readable YAML.

### Portable, Cloud Agnostic Codebase

Kubernetes can run on virtually any public cloud, on-premise hardware, or even bare metal. Developing applications for Kubernetes means that code is replicable, allowing you to select the infrastructure of your choosing.

{{< note >}}
There are some caveats to this point. Many Cloud infrastructure providers support Kubernetes, but there is no guarantee that they support all of the features of Kubernetes. For instance, not every cloud provider offers load balancing as a feature, so not every provider will support Services of the type `LoadBalancer`.
{{</ note >}}

### Microservice Architecture

In contrast to monolithic applications whose constituant parts are not reusable and modular, Kubernetes encourages application developers to write code as microservices. Microservices are an application architecture that prescribes dividing code into independent, reusable, loosely coupled parts called services. These services run in separate containers that can be scaled depending on the needs of the application. Their small size and loose coupling make them easy to test and deploy in rapid fashion.

### Optimized Resource Usage

Kubernetes determines which backend nodes a container should run on based on available resources. By using Kubernetes you can rest assured that all of your compute resources are distributed efficiently across the cluster, ultimtately providing a cost savings by reducing the number of necessary backend ends.

### Zero Downtime with Rolling Deployments

It's easy to create a Pod, the atomic unit of Kubernetes that contains a container. But what happens when you need to update a Pod with a new container image? Kubernetes will create additional Pods with the newer image and assure that they are running and healthy before destroying the old Pods. Kubernetes will also roll back any changes should the newer containers fail. In this way there is limited downtime, ensuring a strong user experience.

### Self-Healing

For many reasons, containers can fail. Kubernetes keeps deployments healthy by restarting containers that have failed, killing and replacing unresponsive containers according to user-defined healthchecks, and re-creating containers that were on a failed backend Node across other available Nodes. This helps to mitigate what is a common pain point of the application upkeep process.

### Service Discoverability

It's important that all services have a predictable way of communicating with one another. However, within Kubernetes, containers are created and destroyed many times over, so a particular service may not exist permanently at a particular location. This traditionally meant that some kind of service registry would need to be created or adapted to the application logic to keep track of each container's location. Kubernetes makes service discovery simple by providing IP addresses for each Pod and a DNS name for each set of Pods, and providing load-balancing between Pods in a set. This creates an environment where the service discovery can be abstracted away from the container level.

### Multi Container Services

In Kubernetes a Pod contains a container, but a Pod can contain multiple containers as well. This makes adding a loosely coupled, reusable sidecar container for something like logging or a service mesh easy, and allows the coupled containers to share an IP address.

### Network Policy as Part of Application Deployment

By default, all Pods in Kubernetes can communicate with each other. Kubernetes also allows developers to declaratively apply networking policies, allowing the developer to restrict access to certain Pods or Namespaces. Basic network policy restrictions can be enforced by simply providing the name of Pods or Namespaces that you would like to give certain Pods egress and ingress capabilities to.

### Persistent Storage

While Kubernetes provides a storage solution, called a Volume, that allows data to outlive the lifecycle of a container, the data is still tied to the longevity of the Pod. However, Kubernetes also provides a mechanism for storing data in cloud storage, like the [Linode Container Storage Interface (CSI)](/docs/applications/containers/deploy-volumes-with-the-linode-block-storage-csi-driver/), which allows for data to be stored on a Linode Block Storage Volume. Even if a Pod that's attached to the Block Storage Volume is destroyed, the data will persist.

### Cron Jobs

Kubernetes provides a Jobs object for completing single tasks, such deploying a script. But, it also provides CronJob objects that can complete a task at a certain time, just like the the jobs you might find in a `crontab` file. This is particularly useful because it provides a declarative way to schedule cron jobs from within a cluster.

### Secrets Management

One of the hurdles in container creation is the inclusion of secrets, tokens, and passwords. You simply don't want these sensitive values in your container images, especially if your containers are stored in a public registry like DockerHub. Kubernetes helps to aleviate this burden by providing Secrets objects, an `etcd` database-backed secrets management solution. With Secrets, you can store sensitive data and later expose that data, for example, via environmental variables to the container, keeping the value out of the container's code.

### Declarative DNS Management

Ingress objects in Kubernetes allow for name based virtual hosting and HTTP routing in a straightforward, declarative manner. This means that Kubernetes is capable of directing multiple domains and URL paths to different Services. For instance, `domain1.com` and `domain2.com` can be hosted within the same cluster and target different services, and the URL paths `/first-service` and `/second-service` can be routed to the service `service1` and to `service2`, respectively.

### Free and Open Source

Kubernetes is free and open source software (FOSS). While initially developed by Google, Kubernetes has been democratized and is now under the charter of the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/). Kubernetes is actively developed and maintained, with a number of high-profile companies championing its cause, all but ensuring it will have a long and impactful tenure as the de-facto container orchestration solution.

### Scalability

Kubernetes makes it easy to horizontally scale the number of containers in use depending on the needs of the application. You can change this number from the command line, or you can use the [Horiztonal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) to change the number of containers based on usage metrics.

## Additional Use Cases

### Testing Platform

With Kubernetes it's easy to create virtual clusters that exactly mirror your production needs. These virtual clusters are called [Namespaces](/docs/applications/containers/kubernetes/beginners-guide-to-kubernetes-part-3-objects/#namespaces). You could easily create a separate testing cluster and use `kubectl` contexts to switch between testing and production. But, you could also create Namespaces for testing, staging, and production, and run them all on the same hardware. With [ResourceQuotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/) you can easily limit the CPU and memory resource allocation of the namespace, ensuring that every namespace has exactly what it needs to run without stealing resources from other namespaces.

### CI/CD Pipelines

A common integration for Kubernetes is setting up a continuous integration / continuous delivery pipeline. Kubernetes offers the predictability of containers with the ease of service discovery to test, build, and deploy quickly.
