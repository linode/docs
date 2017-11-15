---
author:
  name: Jared Kobos
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-11-10
modified: 2017-11-10
modified_by:
  name: Linode
title: "When and Why to Use Docker"
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

Since its release in 2012, [Docker](https://www.docker.com) has become one of the fastest-growing technologies in devops and web development. Like any new technology, however, it is still under development, has some limitations, and is not right for every project. This guide provides an overview of the pros and cons of Docker so that you can decide whether it would be a good addition to your project.

{{< note >}}
For a more basic introduction to Docker concepts and terminology, see our [An Introduction to Docker](/docs/applications/containers/introduction-to-docker) guide.
{{< /note >}}

## Benefits of Docker

1.  **Reproducibility**: Similar to a Java application, which will run exactly the same on any device capable of running a Java Virtual Machine, a Docker container is guaranteed to be identical on any computer or VPS that can run Docker. The exact specifications of a container are stored in a Dockerfile. By distributing this file among team members, an organization can guarantee that all images built from the same Dockerfile will function identically.

2.  **Isolation**: Dependencies or settings within a container will not affect any installations or configurations on your computer, or on any other containers that may be running. By using separate containers for each component of an application (for example a webserver, front end, and database for hosting a web site), you can avoid conflicting dependencies. You can also have multiple projects on a single server without worrying about creating conflicts on your system.

3.  **Security**: With important caveats, separating the different components of a large application into different containers can also have security benefits: if one container is compromised the others remain unaffected.

4.  **Docker Hub**: For common or simple use cases, such as a LAMP stack, the ability to save images and push them to Docker Hub means that there are already many well-maintained images available. Being able to quickly pull a premade image or build from an officially-maintained Dockerfile can make this kind of setup process extremely fast and simple.

5.  **Environment Management**: Docker makes it easy to maintain different versions of, for example, a website using nginx. You can have a separate container for testing, development, and production on the same Linode and easily deploy to each one.

6.  **Continuous Integration**: Docker works well as part of continuous integration pipelines with tools like Travis, Jenkins, and Wercker. Every time your source code is updated, one of these tools can save the new version as a Docker image, tag it with a version number and push it to Docker Hub, then deploy it to your production box.

## Limitations of Docker

1. **Clustering**: TBD

2. **Complexity**:

3. **Overhead**:

4. **Limited GUI suppport**:


## When to Use Docker

If your application fits into one or more of the following categories, Docker may be a good fit:

1.  **Learning new technologies**: If you want to get started with a new tool without spending time on installation and configuration, Docker can be a great choice. Many projects maintain Docker images with their applications already installed and configured. For example, if you want to check out a distributed tracing system like [Zipkin](http://zipkin.io), you can have a working setup on localhost simply by running:

      sudo docker run -d -p 9411:9411 openzipkin/zipkin

  This makes it easy to experiment.

2.  **Basic use cases**: Pulling images from Docker Hub is also a good solution if your application is basic or standard enough to work with a default Docker image. Cases such as hosting a website using a LAMP stack, running

## When Not to Use Docker

On the other hand, there are also times when Docker isn't the best solution. Here are some examples:

1.  **Your app is complicated and you are not a professional sysadmin.** For complicated applications, using a pre-made Dockerfile or pulling an existing image will not be sufficient. Building, editing, and managing communication between multiple containers is still a time-consuming task.

2.  **Performance is critical to your application.** Docker shines compared to virtual machines when it comes to performance, since its containers share the host kernel and do not emulate a full operating system. However, Docker does impose performance costs. Processes run from within a container will not be quite as fast as those run on the native OS. If you need to get the best possible performance out of your server, you may want to avoid Docker.

3.  **Multiple operating systems.** If you want to run or test the same application on different operating systems, you will need to use virtual machines instead of Docker.

4.  **Clusters.** Docker containers on separate servers can be combined to form a cluster with Docker Swarm. However, Docker does not take the place of provisioning or automation tools such as Ansible, SaltStack, and Chef. In addition, Docker has recently announced support for Kubernetes, hinting that Docker Swarm may not be sufficient as a stand-alone cluster manager.
