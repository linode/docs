---
slug: how-to-use-dockerfiles
description: 'A guide that introduces how to use a Dockerfile and provides examples on how to use it to build and run a Docker image on your Linode.'
keywords: ["docker", "container", "dockerfile","dockerfiles","docker image","docker images"]
tags: ["container","docker"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-06-17
modified_by:
  name: Linode
published: 2017-08-11
title: 'How to Use a Dockerfile to Build a Docker Image.'
title_meta: 'How to Use a Dockerfile to Build a Docker Image'
external_resources:
 - '[Best Practices for Writing Dockerfiles](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices)'
 - '[Official Docker Images on Docker Hub](https://hub.docker.com/search?q=&type=image&image_filter=official&page=1)'
 - '[Docker Docs](http://docs.docker.com/)'
aliases: ['/applications/containers/how-to-use-dockerfiles/']
authors: ["Linode"]
---
![How to Use a Dockerfile](how-to-use-dockerfile.png "How to Use a Dockerfile")

A Dockerfile is a text file of instructions which are used to automate installation and configuration of a [Docker image](/docs/guides/introduction-to-docker/#docker-images). Dockerfiles make it easy to deploy multiple Docker containers without having to maintain the same image across multiple virtual machines. Instructions are executed in the order they appear in the Dockerfile, which makes using and updating them clear and intuitive. This article covers the basics, with an example, of how a Dockerfile works.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/products/platform/get-started/) guide, create and update a Linode, and install Docker. Alternatively, you can quickly deploy an updated, Docker-enabled Linode with the [Docker Marketplace App](https://www.linode.com/marketplace/apps/linode/docker/).

2.  Ensure your Linode is secure by following our guide on [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/).

3.  This guide assumes you are comfortable with using the Docker command-line interface (CLI). To learn more about the Docker CLI, check out their [documentation](https://docs.docker.com/engine/reference/commandline/cli/).

## How Does a Dockerfile Work?

A Dockerfile is a script that carries out different commands and actions to build a Docker image, which can then be used to deploy a Docker container. The commands and information within the Dockerfile can be configured to use specific software versions and dependencies for stable deployments. You can also use a [Docker registry](https://docs.docker.com/registry/) to store and access your public (or private) Docker images.

Once a Dockerfile is written, you can use the `docker build` command to generate a Docker image based on the Dockerfile's instructions. Then, you can deploy a container based on the image with commands like `docker run` or `docker create`.

Here are common instructions that you can use in your Dockerfiles to build images:

**Basic Definitions**

- **FROM**: Define the base image, such as `ubuntu` or `debian`, used to start the build process. Required for each Dockerfile.
- **MAINTAINER**: Define the full name and email address of the image creator.

**Variables**

- **ENV**: Set environment variables that persist when the container is deployed.
- **ARG**: Set a passable build-time variable. Can be used as an alternative to `ENV` to create a variable that does not persist when the container is deployed from the image.

**Command Execution**

- **RUN**: Execute commands, such as package installation commands, on a new image layer.
- **CMD**: Execute a specific command within the container that is deployed with the image, or set default parameters for an `ENTRYPOINT` instruction. Only one is used per Dockerfile.
- **ENTRYPOINT**: Set a default application to be used every time a container is deployed with the image. Only one is used per Dockerfile.
- **USER**: Set the UID (the username) to run commands in the container.
- **WORKDIR**: Set the container path where subsequent Dockerfile commands are executed.

{{< note >}}
`RUN`, `CMD`, and `ENTRYPOINT` can each be run in *shell* form, which takes normal arguments, or *exec* form, which takes arguments as a JSON array. Because *exec* form does not invoke a command shell, it is generally preferred and utilized in this guide.
{{< /note >}}

**Data Management**

- **ADD**: Copy files from a source to the image's filesystem at the set destination with automatic tarball and remote URL handling.
- **COPY**: Similar to `ADD` but without automatic tarball and remote URL handling.
- **VOLUME**: Enable access from a specified mount point in the container to a directory on the host machine.

**Networking**

- **EXPOSE**: Expose a specific port to enable networking between the container and the outside world.

Next, we will create an example Dockerfile that utilizes some of these commands.

## Creating a Dockerfile

To create the Dockerfile:

1.  At the command prompt (either via SSH or Lish in the Linode Manager), create and change to a new directory:

        mkdir ~/mydockerbuild && cd ~/mydockerbuild

    {{< note respectIndent=false >}}
This places the Docker build directory in your home directory. As a matter of good practice, do not store the Dockerfile in your home directory itself or the server's root directory. Instead, create a separate directory and place all necessary files within it (alongside the Dockerfile) as shown in this guide.
{{< /note >}}

2.  Create an example Dockerfile:

        touch example_dockerfile

3.  Open the Dockerfile using the text editor of your choice (for this example, we use nano):

        nano example_dockerfile

4.  Copy the following example into your Dockerfile. This creates a Dockerfile that generates a Debian image, sets the maintainer information, and simply returns "Hello, Sunshine!" when run:

    {{< file "example_dockerfile" docker >}}
FROM debian
MAINTAINER Jane Doe jdoe@example.com
CMD ["echo", "Hello, Sunshine!"]
{{< /file >}}

5.  Save the Dockerfile.

6.  Enter `cat example_dockerfile` and ensure the text from above is included.

## Building a Docker Image from a Dockerfile

Build the image from the Dockerfile using the `docker build` command:

    docker build ~/mydockerbuild -f example_dockerfile -t example_image

Labelling your image with `example_image` makes it easier to deploy a container in the next step.

The output should look something like this:

{{< output >}}
Sending build context to Docker daemon  4.096kB
Step 1/3 : FROM debian
 ---> 4a7a1f401734
Step 2/3 : MAINTAINER Jane Doe jdoe@example.com
 ---> Running in fdd81bd8b5c6
Removing intermediate container fdd81bd8b5c6
 ---> 1253842068a3
Step 3/3 : CMD ["echo", "Hello, Sunshine!"]
 ---> Running in d33e1bacf1af
Removing intermediate container d33e1bacf1af
 ---> a5d95e138b97
Successfully built a5d95e138b97
Successfully tagged example_image:latest
{{< /output >}}

As you can see, the instructions from `example_dockerfile` are executed in order. The image labelled `example_image` is now ready for running to deploy a container.

## Running Your Docker Image to Deploy a Container

Running the image you just built to deploy a Docker container is now as easy as entering the following:

    docker run example_image

A new container based on `example_image` is deployed, and the command specified in the `CMD` instruction is then executed from the container with the following output:

{{< output >}}
Hello, Sunshine!
{{< /output >}}

{{< note >}}
If the `docker run` command is executed and the Docker image is not available in your current working directory, it is pulled from the Docker registry instead.
{{< /note >}}

## Further Reading

Congratulations! You've built your first Dockerfile and run your first Docker image.

For more examples and information on using Dockerfiles with Docker images and containers, see:

-   our guide on [How to Use Docker Images, Containers, and Dockerfiles in Depth](/docs/guides/docker-images-containers-and-dockerfiles-in-depth);

-   Docker's [Dockerfile Best Practices](https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/).
