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

Since its release in 2012, [Docker](https://www.docker.com) has become one of the fastest-growing technologies in devops and web development. For those who are still unfamiliar with Docker, however, the new approach to development and server management can be confusing. This guide addresses some of the questions you may have after first hearing about Docker and wondering if it is right for your project. 

# What is Docker?

Docker is an open-source container technology. A **container** is an Unlike a virtual machine (VM), which emulates an entire operating system, containers share the kernel of the host operating system. This significantly reduces the resource requirements for running a container, and makes it possible to run multiple containers on a single server without straining system resources.

Containers are not a new technology, but Docker has simplified the process of building and working with containers, so that they can be used more easily in production environments.


# What are the benefits of using Docker?

1.  **Reproducibility**: Similar to a Java application, which will run exactly the same on any device capable of running a Java Virtual Machine, a Docker container is guaranteed to run exactly the same on any computer or VPS that can run the Docker software. The exact specifications of a container are specified in a Dockerfile. By distributing this file among team members, an organization can guarantee that all images built from the same Dockerfile will function identically.


