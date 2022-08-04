---
slug: docker-security-essentials
author:
  name: Hackersploit
description: "This guide will show you the basics of securing Docker containers, including managing user access, preventing privilege escalations, and more."
keywords: ["docker security", "docker container security", "docker security best practices"]
tags: ["security", "docker"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-08-09
modified_by:
  name: Linode
published: 2021-03-26
title: "An Overview of Docker Security Essentials"
aliases: ['/security/basics/docker-security-essentials/']
image: DockerSecurityEssentials.png
---

## What is Docker?

Docker is a set of platform as a service (PaaS) products that use OS-level virtualization to deliver software in packages called containers. Containers are isolated from one another and bundle their own software, libraries, and configuration files. Docker containers can also communicate with each other through well-defined channels.

Docker utilizes the host OS Kernel, which makes Docker containers more efficient than hypervisors like VirtualBox. Docker containers also include dependencies and libraries that an application or service needs to run, eliminating the need for installing dependencies manually.

## Prerequisites and Requirements

In order to secure Docker containers, you need to have a Linux server with Docker running. For a quick an easy way to install Docker on Linode, check out our guide on [How to Deploy Docker with Marketplace Apps](/docs/products/tools/marketplace/guides/docker/). Otherwise, you can find instructions on how to manually install Docker in [Installing and Using Docker on Ubuntu and Debian](/docs/guides/installing-and-using-docker-on-ubuntu-and-debian/).

{{< note >}}
This demonstration has been performed on Ubuntu 18.04. All techniques demonstrated are distribution agnostic with the exception of package names and package managers.
{{< /note >}}

This guide assumes you are familiar with using Docker and Dockerfiles. For additional guidance, see our guide on [How to Use Dockerfiles](/docs/guides/how-to-use-dockerfiles/).

## 8 Best Practices for Docker Host Security

The security of the host kernel and operating system directly correlates to the security of your Docker containers given their utilization of the host kernel. It is therefore vitally important to keep your host secure. The following steps outline various security best practices to consider for securing your Docker host:

1.  [Secure and harden](/docs/guides/set-up-and-secure/) your host OS.
1.  Ensure your host is kept updated.
1.  Ensure you have the latest version of Docker running.
1.  Consider the use of a minimal Linux distribution such as Alpine that offers a much smaller threat surface.
1.  Add your host and containers to a robust vulnerability management plan and constantly scan your host and containers for vulnerabilities.
1.  Only run the services you need to run.
1.  Ensure your kernel is [up to date](/docs/guides/managing-the-kernel-on-a-linode/).
1.  Keep up with the latest vulnerability news for the Linux kernel and the Docker platform.

## Running Docker Containers with an Unprivileged User

Running Docker containers with an unprivileged user instead of the default "root" user prevents privilege escalation attacks. The following steps outline how to run Docker containers with an unprivileged user:

1.  Always reconfigure and build your own Docker images. This way, you can customize the various security parameters to your specification.

1.  Prior to building your Docker image, specify an unprivileged user in your Dockerfile by adding the following command, replacing `<USER>` with your username and `<GROUP>` with a non-sudo group:

        RUN groupadd -r <USER> && useradd -r -g <GROUP> <USER>

    Here is an example Dockerfile that includes the above command to create the unprivileged user `alexis` in the group `alexis`:

    {{< file Dockerfile docker >}}
FROM ubuntu:18.04

LABEL maintainer="Alexis Ahmed"

RUN groupadd -r alexis && useradd -r -g alexis alexis

# Environment Variables
ENV HOME /home/alexis
ENV DEBIAN_FRONTEND=noninteractive
{{< /file >}}

1.  Build a Docker image by running the following command from the directory that contains your Dockerfile:

        docker build .

1.  Run `/bin/bash` on a temporary Docker container utilizing your image, replacing `<USER>` with the unprivileged user and `<IMAGE-ID>` with the ID of the image you built in the previous step:

        docker run -u <USER> -it --rm <IMAGE-ID> /bin/bash

    The container shell confirms that it is using the unprivileged user.

    {{< output >}}
alexis@9883456a9e3a:/$
{{< /output >}}

## Disabling the Docker Container "root" User

As an added security measure, disable the "root" user by modifying your Dockerfile. You can disable the "root" user by changing the default shell from `/bin/bash` to `/usr/sbin/nologin`. This prevents any user on the container from accessing the "root" account irregardless of whether they have the "root" password.

To disable the "root" user, add the following command to your Dockerfile:

        RUN chsh -s /usr/sbin/nologin root

This configuration is only applicable if you want to disable the "root" account completely.

## Preventing Privilege Escalation Attacks

It is recommended to run your containers with specific permissions and ensure that they cannot escalate their privileges.

You can prevent privilege escalation through the exploitation of SETUID binaries by using the `--security-opt=no-new-privileges` flag when running containers:

    docker run --security-opt=no-new-privileges <IMAGE-ID>

## Limiting Docker Container Kernel Capabilities

Linux kernel capabilities are a set of privileges that can be used by privileged containers. However, it is always recommended to not run containers with the `--privileged` flag as it overrides any other user permission and security restrictions you have set.

Instead, you can change and drop the capabilities required to harden your Docker containers, or you can add some capabilities with the following steps:

1.  Drop all kernel capabilities by running the following command:

        docker run --cap-drop all <IMAGE-ID>

1.  You can also add the specific kernel capabilities required by your containers by running the following command, replacing `<CAPABILITY>` with the desired [capability key](https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities):

        docker run --cap-drop all --cap-add <CAPABILITY> <IMAGE-ID>

## File System Permissions and Access

You also have the ability to specify file system permissions and access. This allows you to set up containers with a read only file system or a temporary file system. This is useful if you would like to control whether your Docker containers can store data or make changes to the file system.

1.  Run a Docker container with a read-only file system by running the following command:

        docker run --read-only <IMAGE-ID>

1.  If your container has a service or application that requires the storage of data, you can specify a temporary file system by running the following command:

        docker run --read-only --tmpfs /tmp <IMAGE-ID>

## Disabling Inter-Container Communication

Given the notion of [virtual machine isolation](https://en.wikipedia.org/wiki/Temporal_isolation_among_virtual_machines), you can also isolate Docker containers from one another. This prevents them from communicating with each other.

This can be helpful if you want to isolate a particular Docker container. By default, Docker does not isolate containers, allowing them to communicate with each other.

1.  In order to disable inter-container communication, create a new Docker network with the `enable_icc` option set to `false` and replacing `<NETWORK-NAME>` with any desired name.

        docker network create \
          --driver bridge \
          -o "com.docker.network.bridge.enable_icc"="false" \
          <NETWORK-NAME>

1.  You can now run an isolated container by including the `--network` flag:

        docker run --network <NETWORK-NAME> <IMAGE-ID>
