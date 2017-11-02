---
author:
  name: Linode Community
  email: docs@linode.com
contributor:
  name: Jack Wallen
  link: https://twitter.com/jlwallen
description: 'This guide introduces Dockerfiles and how to use them to build a Docker Image on your Linode.'
keywords: ["docker", "container", "dockerfile"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-08-29
modified_by:
  name: Linode
published: 2017-08-11
title: 'How to Use Dockerfiles'
external_resources:
 - '[Dockerfile Best Practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices)'
 - '[Docker Docs](http://docs.docker.com/)'
 - '[Docker Try it Tutorial](https://www.docker.com/tryit/)'
 - '[Docker Hub](https://hub.docker.com/)'
---

![How to Use Dockerfiles](/docs/assets/docker/how-to-use-dockerfiles.png "How to Use Dockerfiles")

[Docker images](/docs/applications/containers/how-to-install-docker-and-pull-images-for-container-deployment#pull-docker-images) make it easy to deploy multiple containers without having to maintain the same across multiple virtual machines.

You can use a Dockerfile to automate installation and configuration of an image and its dependencies.

## Dockerfile Basics

A `dockerfile` is a text file that contains the necessary commands to assemble an image. Once a Dockerfile is created, the administrator uses the `docker build` command to create an image based on the commands within the file. The commands and information within the `dockerfile` can be configured to use specific software versions and dependencies to ensure consistent and stable deployments.

{{< note >}}
Do not store the Dockerfile in your root directory.

Create a separate directory for the Dockerfile and place all necessary files within the same directory as the Dockerfile.
{{< /note >}}

A Dockerfile uses the following commands for building the images:

*  **ADD**: Copy files from a source on the host to the container's own filesystem at the set destination.
*  **CMD**: Execute a specific command within the container.
*  **ENTRYPOINT**: Set a default application to be used every time a container is created with the image.
*  **ENV**: Set environment variables.
*  **EXPOSE**: Expose a specific port to enable networking between the container and the outside world.
*  **FROM**: Define the base image used to start the build process.
*  **MAINTAINER**: Define the full name and email address of the image creator.
*  **RUN**: Central executing directive for Dockerfiles.
*  **USER**: Set the UID (the username) that will run the container.
*  **VOLUME**: Enable access from the container to a directory on the host machine.
*  **WORKDIR**: Set the path where the command, defined with CMD, is to be executed.

Not every command must be used. You will create a working Dockerfile example in the following section.

## Create a Dockerfile

Dockerfiles require specific setup and format with no extra spaces.

Docker reuses cache from the previous step. This may result in commands not running properly or not running at all. To avoid this caching issue, combine `apt` commands into a single `RUN` statement. To avoid other caching issues, combine multiple `RUN` statements for commands like `apt-get update/upgrade/install`.

Note that in the example below, multiple packages are installed on separate lines. This optional step is recommended by the [Dockerfile Best Practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/#sort-multi-line-arguments) in order to ease future updates and maintenance.

1.  Create and change to a new directory and create a `Dockerfile` file:

        mkdir ~/mydockerbuild && cd ~/mydockerbuild
        touch Dockerfile

2.  Open `Dockerfile` using a text editor and enter the following example to create a Dockerfile that installs `build-essential`, `curl`, and `make` onto a Ubuntu image:

    {{< file "Dockerfile" docker >}}
FROM ubuntu
MAINTAINER NAME EMAIL
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    curl \
    make

{{< /file >}}


        In this example:

        *  **NAME**: Full name of the creator.
        *  **EMAIL**: Email address of the creator.

3.  Save and close `Dockerfile`.

## Build a Docker Image from the Dockerfile

Build the `Dockerfile` using the `docker build` command within the same directory. Substitute `NAME` in the following example with the name of the image to be created:

    docker build --tag=“Build-Essential:Dockerfile” /path/to/file .

To build three images using the same Dockerfile, give each image a new name. In this example, `webdev1`, `webdev2`, `webdev3`:

    docker build -t “webdev1:Dockerfile” .
    docker build -t “webdev2:Dockerfile” .
    docker build -t “webdev3:Dockerfile” .

Each image created will be tagged `Dockerfile`. To change the tag during build, change `Dockerfile`:

    docker build -t “debian-webdev3:dev” .

## Just the basics

This guide covered the basics of using Dockerfiles to build images. For more information on Dockerfiles, visit the official [Dockerfile Best Practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/) documentation.
