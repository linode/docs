---
author:
  name: Linode Community
  email: docs@linode.com
contributor:
  name: Jack Wallen
  link: https://twitter.com/jlwallen
description: 'An introduction to using Docker, containers, and dockerfiles on your Linode.'
keywords: ["docker", "container", "dockerfile"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-06-28
modified_by:
  name: Linode
published: 2017-06-28
title: 'An Introduction to Docker'
external_resources:
 - '[Docker Docs](http://docs.docker.com/)'
 - '[Docker Try it Tutorial](https://www.docker.com/tryit/)'
 - '[Docker Hub](https://hub.docker.com/)'
---

![An introduction to Docker](/docs/assets/docker-introduction.png "An introduction to Docker")

## What is Docker?

Docker is a tool that enables you to create, deploy, and manage lightweight, stand-alone packages that contain everything needed to run an application (code, libraries, runtime, system settings, and dependencies). These packages are called containers.

Each container is deployed with its own CPU, memory, block I/O, and network resources, all without having to depend upon an individual kernel and operating system. While it may be easiest to compare Docker and virtual machines, they differ in the way they share or dedicate resources.

Containers help expand your Linode's functionality in a number of ways. For example, you can deploy multiple instances of nginx with multiple stagings (such as development and production). Unlike deploying multiple virtual machines, the deployed containers will not tax your Linode's resources.

## Docker Images

Each Docker container is created from an image. You pull images from a Docker registry (such as the official [Docker Hub](https://hub.docker.com/)) and use them to build containers. A single image can create numerous containers. For example, you could use the latest nginx image to deploy a webserver container for:

*  Web dev ops
*  Testing
*  Production
*  Web applications

## Dockerfiles

A `dockerfile` is a text file that contains the necessary commands to assemble an image. Once a Dockerfile is written, the administrator uses the `docker build` command to create an image based on the commands within the file. The commands and information within the `dockerfile` can be configured to use specific software versions and dependencies to ensure consistent and stable deployments.

A Dockerfile uses the following commands for building the images:

*  **ADD** - copy files from a source on the host to the container's own filesystem at the set destination.
*  **CMD** - execute a specific command within the container.
*  **ENTRYPOINT** - set a default application to be used every time a container is created with the image.
*  **ENV** - set environment variables.
*  **EXPOSE** - expose a specific port to enable networking between the container and the outside world.
*  **FROM** - define the base image used to start the build process.
*  **MAINTAINER** - define the full name and email address of the image creator.
*  **RUN** - central executing directive for Dockerfiles.
*  **USER** - set the UID (the username) that will run the container.
*  **VOLUME** - enable access from the container to a directory on the host machine.
*  **WORKDIR** - set the path where the command, defined with CMD, is to be executed.

Not every command must be used. Below is a working Dockerfile example, using only the `MAINTAINER`, `FROM`, and `RUN` commands:

{{< file "dockerfile" docker >}}
MAINTAINER NAME EMAIL
FROM ubuntu:latest
RUN apt-get -y update && apt-get -y upgrade && apt-get install -y build-essential

{{< /file >}}


## Docker Swarm

Docker makes it easy to join servers together to form a cluster, called a Docker Swarm. Once you’ve created a Swarm manager, or *leader*, and attached nodes to the leader, you can scale out container deployment. The leader will automatically adapt the cluster by adding or removing tasks to maintain a desired state.

A *node* is a single instance of the Docker engine that participates in the Swarm. You can run one or more nodes on a single Linode. The Swarm manager uses ingress load balancing to expose services that can be made available to the Swarm. Docker Swarm can also:

*  Check the health of your containers.
*  Launch a fixed set of containers from a single Docker image.
*  Scale the number of containers up or down (depending upon the current load).
*  Perform rolling updates across containers.
*  Provide redundancy and failover.
*  Add or subtract container iterations as demands change.

## Next Steps

To explore Docker further, visit our [Docker Quick Reference](/docs/applications/containers/docker-quick-reference-cheat-sheet/), our guide on [deploying a Node.js web server](/docs/applications/containers/node-js-web-server-deployed-within-docker/), or the Linode [How to install Docker and deploy a LAMP Stack](/docs/applications/containers/how-to-install-docker-and-deploy-a-lamp-stack/) guide.
