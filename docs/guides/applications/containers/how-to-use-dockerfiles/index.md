---
slug: how-to-use-dockerfiles
title: "How to Use a Dockerfile to Build a Docker Image."
description: "A guide that introduces how to use a Dockerfile and provides examples on how to use it to build and run a Docker image on your Linode."
authors: ["Linode"]
contributors: ["Linode"]
published: 2017-08-11
modified: 2021-06-17
keywords: ["docker", "container", "dockerfile","dockerfiles","docker image","docker images"]
tags: ["container","docker"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
 - '[Best Practices for Writing Dockerfiles](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices)'
 - '[Official Docker Images on Docker Hub](https://hub.docker.com/search?q=&type=image&image_filter=official&page=1)'
 - '[Docker Docs](http://docs.docker.com/)'
aliases: ['/applications/containers/how-to-use-dockerfiles/']
---
![How to Use a Dockerfile](how-to-use-dockerfile.png "How to Use a Dockerfile")

A Dockerfile is a text file of a list of commands in an order. It is used to automate installation and configuration of a [Docker image](/docs/applications/containers/how-to-install-docker-and-pull-images-for-container-deployment#pull-docker-images). Dockerfile makes it easy to deploy multiple Docker containers without having to maintain the same image across multiple virtual machines. This guide covers the basics, with an example, of how a Dockerfile works.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/products/platform/get-started/) guide, create and update a Linode, and install Docker. Alternatively, you can quickly deploy an updated, Docker-enabled Linode with the [Docker Marketplace App](https://www.linode.com/marketplace/apps/linode/docker/).

1.  Ensure your Linode is secure by following our guide on [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/).

1.  Update the system with the package manager that it uses.

## How Does a Dockerfile Work?

A Dockerfile is a script that carries out different commands and actions to create a Docker image. The Dockerfile automates the image creation process and simplifies the deployment pipeline, and a Docker container is made from a Docker image. A [Docker registry](https://docs.docker.com/registry/) is where the public (or private) Docker images can be stored.

After a Dockerfile is created, the `docker build` command is used to create a Docker image using the commands in the file. The commands are configured to use specific software versions and dependencies for stable deployments.

A Dockerfile can use the following commands for building images:

-  **ADD**: Copy files from a source on the host to the container's file system at the set destination.
-  **CMD**: Execute a specific command within the container.
-  **ENTRYPOINT**: Set a default application to be used every time a container is created with the image.
-  **ENV**: Set environment variables.
-  **EXPOSE**: Expose a specific port to enable networking between the container and the outside world.
-  **FROM**: Define the base image used to start the build process.
-  **MAINTAINER**: Define the full name and email address of the image creator.
-  **RUN**: Central executing directive for a Dockerfile.
-  **USER**: Set the UID or the username that runs the container.
-  **VOLUME**: Enable access from the container to a directory on the host machine.
-  **WORKDIR**: Set the path where the command, defined with CMD, is executed.

Each command doesn't need to be used. Next, is an example of how to use some of these commands.

## Creating a Dockerfile

To create the Dockerfile:

1.  At the command prompt (either via SSH or Lish in the Linode Manager), create and change to a new directory:

    ```command
    mkdir ~/mydockerbuild && cd ~/mydockerbuild
    ```

    {{< note >}}
    This places the Docker build directory in your home directory. As a matter of good practice, do not store the Dockerfile in your home directory itself or the server's root directory. Instead, create a separate directory and place all necessary files within it (alongside the Dockerfile) as shown in this guide.
    {{< /note >}}

1.  Create the file by entering `touch Dockerfile`.

1.  Open the Dockerfile using the text editor of your choice, the command to type if you are using nano is `sudo nano Dockerfile`.

1.  Copy the following example into nano. This creates a Dockerfile that generates an Ubuntu image and simply prints "Hello, Sunshine!" when you run:

    ```file {title="Dockerfile" lang=docker}
    FROM ubuntu

    MAINTAINER linode

    RUN apt-get update

    CMD ["echo", "Hello, Sunshine!"]
    ```

1.  Save the Dockerfile.

1.  Enter `cat Dockerfile` and ensure the text from above is included.

## Building a Docker Image from a Dockerfile

Build the image from the Dockerfile using the `sudo docker build` command within the same directory by entering `sudo docker build -t example_image .`.

The output should look something like this:

```output
Sending build context to Docker daemon  2.048kB
Step 1/4 : FROM ubuntu
latest: Pulling from library/ubuntu
345e3491a907: Pull complete
57671312ef6f: Pull complete
5e9250ddb7d0: Pull complete
Digest: sha256:cf31af331f38d1d7158470e095b132acd126a7180a54f263d386da88eb681d93
Status: Downloaded newer image for ubuntu:latest
---> 7e0aa2d69a15
Step 2/4 : MAINTAINER linode
---> Running in 1a67c8ac2958
Removing intermediate container 1a67c8ac2958
---> 49ce40cbee95
Step 3/4 : RUN apt-get update
---> Running in 91b5f90f9e15
Get:1 http://security.ubuntu.com/ubuntu focal-security InRelease [109 kB]
Get:2 http://security.ubuntu.com/ubuntu focal-security/multiverse amd64 Packages [21.7 kB]
Get:3 http://archive.ubuntu.com/ubuntu focal InRelease [265 kB]
Get:4 http://security.ubuntu.com/ubuntu focal-security/universe amd64 Packages [687 kB]
Get:5 http://security.ubuntu.com/ubuntu focal-security/main amd64 Packages [778 kB]
Get:6 http://security.ubuntu.com/ubuntu focal-security/restricted amd64 Packages [243 kB]
Get:7 http://archive.ubuntu.com/ubuntu focal-updates InRelease [114 kB]
Get:8 http://archive.ubuntu.com/ubuntu focal-backports InRelease [101 kB]
Get:9 http://archive.ubuntu.com/ubuntu focal/restricted amd64 Packages [33.4 kB]
Get:10 http://archive.ubuntu.com/ubuntu focal/multiverse amd64 Packages [177 kB]
Get:11 http://archive.ubuntu.com/ubuntu focal/universe amd64 Packages [11.3 MB]
Get:12 http://archive.ubuntu.com/ubuntu focal/main amd64 Packages [1275 kB]
Get:13 http://archive.ubuntu.com/ubuntu focal-updates/main amd64 Packages [1194 kB]
Get:14 http://archive.ubuntu.com/ubuntu focal-updates/restricted amd64 Packages [274 kB]
Get:15 http://archive.ubuntu.com/ubuntu focal-updates/multiverse amd64 Packages [29.7 kB]
Get:16 http://archive.ubuntu.com/ubuntu focal-updates/universe amd64 Packages [955 kB]
Get:17 http://archive.ubuntu.com/ubuntu focal-backports/universe amd64 Packages [4305 B]
Fetched 17.6 MB in 3s (6241 kB/s)
Reading package lists...
Removing intermediate container 91b5f90f9e15
---> 40d2978e2295
Step 4/4 : CMD ["echo", "Hello, Sunshine!"]
---> Running in 5a07e8b4eccc
Removing intermediate container 5a07e8b4eccc
---> ba6d90c3982b
Successfully built ba6d90c3982b
Successfully tagged example_image:latest
```

The image has now been built from the Dockerfile.

## Running Your Docker Image

Running the image you just created is as easy as typing `sudo docker run example_image`. The output looks similar to:

```output
Hello, Sunshine!
```

{{< note >}}
If the `sudo docker run` command is executed and the Docker image is not available in the current working directory, it is pulled from the Docker registry.
{{</ note >}}

## Further Reading

Congratulations! You've built your first Dockerfile and run your first Docker image.

For more examples and information on using Dockerfiles with Docker images and containers, see:

-   our [Further Introduction to Docker Images and Containers](/docs/guides/applications/containers/a-further-introduction-to-docker-images-and-containers);

-   Docker's [Dockerfile Best Practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/).