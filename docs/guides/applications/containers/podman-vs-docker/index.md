---
slug: podman-vs-docker
author:
  name: Linode Community
  email: docs@linode.com
description: "Containers offer portable, lightweight environments for developing and deploying applications. And while Docker has been the most popular containerization tool, Podman has arisen as a compelling alternative. What sets the two tools apart, and when should you use one over the other? Find out in this tutorial comparing Podman and Docker."
og_description: "Containers offer portable, lightweight environments for developing and deploying applications. And while Docker has been the most popular containerization tool, Podman has arisen as a compelling alternative. What sets the two tools apart, and when should you use one over the other? Find out in this tutorial comparing Podman and Docker."
keywords: ['podman vs docker','docker podman','podman vs docker performance']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-26
modified_by:
  name: Nathaniel Stickman
title: "Podman vs Docker: Comparing the Two Containerization Tools"
h1_title: "Podman vs Docker: Comparing the Two Containerization Tools"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Red Hat Developer: Podman and Buildah for Docker Users](https://developers.redhat.com/blog/2019/02/21/podman-and-buildah-for-docker-users#)'
- '[phoenixNAP: Podman vs Docker - Everything You Need to Know](https://phoenixnap.com/kb/podman-vs-docker)'
- '[How-to Geek: What Is Podman and How Does It Differ from Docker?](https://www.howtogeek.com/devops/what-is-podman-and-how-does-it-differ-from-docker/)'
---

Containers offer you powerful tool for developing and deploying applications. They give you distinct and portable virtual environments with a fraction of the overhead of traditional virtual machines.

Likely if you have started looking at containerization, you have seen Docker, the most popular and widely-used containerization tool. But recently a capable and compelling alternative has risen, Podman.

Both tools follow the Open Container Initiative standards, and both offer robust capabilities for running and managing containers.

So which one should you use? What features would make Docker best for some use cases and Podman for some others?

This tutorial aims to help you answer those questions. Learn the key characteristics of each tool, see a breakdown of their pros and cons, and walk through an analysis of each tool's best use cases.

## What Are Containers?

Containers are lightweight and standalone virtual environments for applications. With containers, you can do everything from running multiple application environments on a single system to packaging application environments as images for others to easily run on different systems.

Each container works off of a set of instructions, allowing it to replicate the necessary virtual infrastructure and applications. The container then houses and manages the applications and all of their dependencies.

A container can be rendered to a *container image*. Such an image can then be used to construct the base container on other systems, only requiring a containerization tool, like Docker or Podman.

Today, most containerization tools follow the Open Container Initiative (OPI) container standards. Any containerization tools that conform to this standard can operate OCI containers built from other such tools. Thus, Podman can run containers built with Docker, and vice versa

## What Is Docker?

[Docker](https://www.docker.com/) is a platform for creating, deploying, and managing applications via containers. With Docker, you can create OCI-compliant containers using Dockerfiles — scripts for container creation — or existing container images.

Docker has become an incredibly popular containerization tool, at least in part due to its relative simplicity. Its straightforward commands and the wealth of available documentation make Docker immanently approachable.

Learn more about Docker in our guide [An Introduction to Docker](/docs/guides/introduction-to-docker/).

## What Is Podman?

[Podman](https://podman.io/), like Docker, is an open-source engine for deploying and managing containerized applications. Podman builds OCI-compliant containers from existing images or from Containerfiles and Dockerfiles.

The Podman engine was originally developed by Red Hat with the intention of providing a daemonless alternative to Docker. By employing a daemonless architecture, Podman seeks to remedy security concerns around Docker's daemon-based process.

Additionally, Podman's daemonless architecture grants it a truly rootless mode. Docker commands can be run by non-root users, but its daemon that executes those commands continues to run on root. Podman, instead, executes commands directly and avoids the need for root privileges.

Learn more about getting started with Podman in our guide [How to Install Podman for Running Containers](/docs/guides/using-podman/).

## Docker vs Podman: Pros and Cons

Both Podman and Docker are containerization tools. With either one, you can fully start up, deploy, and manage containers.

That said, each tool has its draws and drawbacks. These next couple of sections explore each, providing a list of pros and cons to compare and contrast the two containerization engines.

Keep reading on after that to see our advice on which tool to use when.

### Docker Pros and Cons

Pros:

- Simple and approachable. Docker's commands are designed to be relatively simple and easy to use. Alongside that, Docker maintains one of the most frequently used registries for container images.

    The Docker Hub holds a wide collection of well-maintained container images, many of which are composed and updated officially. This makes it relatively easy to, say, pull a container image for a LAMP stack and start working quickly with Docker.

- Popular. Docker's wide-spread usage means that you are more likely to encounter it anywhere you go that works with containers. It also means that you have a vast and easily-accessible collection of user documentation and troubleshooting to pull from.

Cons:

- Daemon-based architecture. Docker runs on a long-running daemon process, which may pose security concerns for some. Additionally, that daemon process runs with root privileges. Thus, even limited users executing Docker commands are getting those commands fulfilled by a process with root privileges, a further security concern.

### Podman

Pros:

- Daemonless architecture. Podman directly interacts with containers and container images, without a long-running daemon process. Doing so reduces exposure to security risks.

- Rootless processes. Because of its daemonless architecture, Podman can perform truly rootless operations. Users do not have to be granted root privileges to run Podman commands, and Podman does not have to rely on a root-privileged process.

- Access to image registries. Podman can find and pull container images from numerous registries, including the Docker Hub registry. This means that, with maybe a little configuration, Podman can access the same image registries as Docker.

Cons:

- Limited build features. Podman concerns itself primarily with running and managing containers. It can build containers and render them as images, often effectively for many use cases. However, its functionality for doing so represents a limited portion of the Buildah source code.

    Podman, instead, endorses using Buildah as a compliment tool for more a feature-rich container building and more fine control over the process.

## Which One Should You Use?

Docker and Podman each stand as viable containerization options. Each tool has a lot to offer, and for most containerization either one works as well as the other.

But in what cases particularly should you consider one of these two tools over the other?

### When to Use Docker

Docker is best suited for cases when you want a more approachable containerization option. Docker's design makes it relatively quick to take up, and its feature set includes everything you are likely to need when working with containers.

Docker covers the full container life cycle, from container composition to deployment and maintenance. And Docker accomplishes this with a straightforward set of commands.

Docker also has going for it a proliferation of people with experience in it. When it comes to containerization tools, you are more likely to find people familiar with Docker than most other tools. Not to mention that Docker has established usage with many companies.

Looking to go forward with Docker? Be sure to reference the guide to it linked above, as well as our guide [When and Why to Use Docker](/docs/guides/when-and-why-to-use-docker/). And to see Docker in action, you may also want to look at our guide on [How to install Docker and deploy a LAMP Stack](/docs/guides/how-to-install-docker-and-deploy-a-lamp-stack/).

### When to Use Podman

Podman offers higher security options. Its daemonless architecture allows you to run rootless containers, and this combined with Podman's direct rather than long-running processes for managing containers further secure them.

Podman also comes as a lightweight and specialized solution. Podman focuses on running, deploying, and managing containers, and it gives you fine-grained control of these processes.

At the same time, its options for building containers and images are available but limited. Podman keeps tightly focused on its specialization and prefers to work with Buildah as a complimentary tool for building containers and container images.

This specialization and light weight can be useful in contexts where you want more fine control for running and managing containers and do not need the more advanced build capabilities, or are able to rely on another tool for them.

In fact, you can use Docker and Podman side-by-side effectively with this in mind, considering both tools are OCI-compliant. For instance, use Docker for your development environment, where you are creating application images but where high security is less of a concern. Then, use Podman to run and maintain those images for a production environment.

Start moving forward with Podman by checking out our guide [How to Install Podman for Running Containers](/docs/guides/using-podman/). And you may also be interested in look at Buildah via our guide [How to Use Buildah to Build OCI Container Images](/docs/guides/using-buildah-oci-images/).

## Conclusion

You now have the knowledge you need to make a decision between Podman and Docker. Both are OCI-compliant containerization tools, each offering its particular advantages. Each tool stands as a robust option for running, deploying, and managing containers, and which one you use comes down to what particular features and use cases you need to cover.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
