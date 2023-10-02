---
slug: installing-and-using-docker-on-centos-and-fedora
description: 'A guide on installing Docker Engine on CentOS and Fedora Linux distributions'
keywords: ['docker','docker engine','containers']
tags: ["docker","containers","centos","fedora"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-16
modified_by:
  name: Linode
title: "Installing and Using Docker on CentOS and Fedora"
title_meta: "How to Install and Use Docker on CentOS and Fedora"
external_resources:
- '[Website for Docker](https://www.docker.com/)'
- '[Documentation for Docker](https://docs.docker.com/)'
- '[Website for containerd](https://containerd.io/)'
relations:
    platform:
        key: installing-and-using-docker
        keywords:
            - distribution: CentOS and Fedora
authors: ["Linode"]
---

Docker is a tool that enables you to create, deploy, and manage lightweight, stand-alone packages called *containers*. These containers have the necessary code, libraries, runtime, system settings, and dependencies needed to run an application.

This guide covers installing the Docker Engine on various Linux distributions using the **YUM** or **DNF** package manager, including CentOS and Fedora, as well as obtaining and running Docker images.

## Before You Begin

1.  Ensure you have command line access to a Linux server running a supported Linux distribution. If not, follow the [Getting Started](/docs/products/platform/get-started/) and [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guides to create a new Linode.

    {{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

1.  Review the following Docker guides to gain a better understanding of Docker, its benefits, and when to use it.

    - [An Introduction to Docker](/docs/guides/introduction-to-docker/)
    - [When and Why to Use Docker](/docs/guides/when-and-why-to-use-docker/)


## Installing Docker Engine

[Docker Engine](https://docs.docker.com/engine/) is the underlying containerization software used when deploying Docker containers. The following instructions will install Docker on CentOS and Fedora using the **YUM** package manager.

**Supported distributions:** CentOS 7, CentOS 8 (including other derivatives of RHEL 8 such as AlmaLinux and RockyLinux), and Fedora 32 (and later)

{{< note >}}
While the **YUM** package manager has been replaced with **DNF** on CentOS 8 and Fedora, the `yum` command is still present as a symlink to DNF. As such, these instructions still work as intended.
{{< /note >}}

1.  Ensure Docker is not currently installed. Output indicating that any of the packages aren't found can be safely ignored.

        sudo yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine

1.  Install the **yum-utils** package, which includes `yum-config-manager`. This will automatically install `dnf-plugins-core` when using DNF.

        sudo yum install yum-utils

1.  Add the docker repository, using `yum-config-manager`. This automatically maps to the `dnf config-manager` command when using DNF. In the following command, replace `[url]` with the url of the repository for your distribution:

        sudo yum-config-manager --add-repo [url]

    - **RHEL/CentOS and derivatives:** `https://download.docker.com/linux/centos/docker-ce.repo`
    - **Fedora 32 and later:** `https://download.docker.com/linux/fedora/docker-ce.repo`

1.  Install Docker Engine and other required packages:

        sudo yum install docker-ce docker-ce-cli containerd.io

    During this step, you may be prompted to accept the GPG key. The fingerprint should be `060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35`. Verify these details and enter *y* to accept.

Additional installation instructions for these distributions can be found within Docker's documentation:

- [Install Docker Engine on CentOS](https://docs.docker.com/engine/install/centos/)
- [Install Docker Engine on Fedora](https://docs.docker.com/engine/install/fedora/)

## Starting and Testing Docker

After Docker Engine is installed, start Docker and verify everything is working by running a test image.

1.  Ensure that the Docker server is running.

        sudo systemctl start docker

1.  Optionally configure Docker to start when the server boots up. This is recommended if you intend on running a production application within this Docker installation.

        sudo systemctl enable docker
        sudo systemctl enable containerd

1.  Verify Docker is correctly installed by running the "hello-world" image.

        sudo docker run hello-world

    If successful, Docker should download and run the hello-world image and output a success message. Among other text, the output should include a message similar to the following:

    {{< output >}}
Hello from Docker!
This message shows that your installation appears to be working correctly.
{{< /output >}}

## Managing Docker with a Non-Root User

By default, `sudo` is required to run Docker commands, but a new group, called *docker*, was created during installation. When the Docker daemon starts, it opens a Unix socket for the *docker* group members.

Before continuing, make sure you have a limited user account that *does not* belong to the sudo group. If you haven't created a limited user account yet, see the guides [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) or [Linux Users and Groups](/docs/guides/linux-users-and-groups/) for instructions.

1.  Enter the command below to add a user to the *docker* group, replacing *[user]* with the name of your limited user account.

        sudo usermod -aG docker [user]

1.  Log in to the system as the limited user.

1.  Verify the limited user can run `docker` commands without `sudo` by running the "hello-world" image once again.

        docker run hello-world

    The output should have a similar success message as the previous output.

{{< note type="alert" >}}
The *docker* group grants similar privileges to those of the root user. Review the [Docker Daemon Attack Surface](https://docs.docker.com/engine/security/#docker-daemon-attack-surface) guide within Docker's documentation for more information about how that can affect system security. To run the Docker daemon without using root privileges, follow the instructions within [Run the Docker daemon as a non-root user (Rootless mode)](https://docs.docker.com/engine/security/rootless/).
{{< /note >}}

### Resolving Errors with Loading Config Files

If the user had run `sudo docker` commands before joining the group, they might be presented with a failure loading the config file, like this:
    {{< output >}}
WARNING: Error loading config file: /home/user/.docker/config.json -
stat /home/user/.docker/config.json: permission denied
{{< /output >}}

The issue is the .docker directory in their home directory (~/.docker) was created with permissions granted by `sudo`.

There are two possible fixes:

1.  Remove the `.docker` directory from their home directory. Docker will automatically recreate it, but any custom settings will be lost.

1.  Change the permissions on the `.docker` directory using the commands:

        sudo chown example_user:example_user /home/example_user/.docker -R
        sudo chmod g+rwx "/home/example_user/.docker" -R

## Using Docker Images to Deploy Containers

Docker images are templates that include the instructions and specifications for creating a container. To use Docker, you first need to obtain an image or create your own by building a dockerfile. For more information, see [An Introduction to Docker
](/docs/guides/introduction-to-docker/).

### Listing Images

To list all of the images on your system, run the following command. This should output the *hello-world* image that was used in a previous step, as well as any additional images you may have already obtained.

    docker images

### Finding an Image

Images are stored on Docker registries, such as [Docker Hub](https://hub.docker.com/) (Docker's official registry). You can browse for images on that website or use the following command to search through the Docker registry. In the following command, replace `[keyword]` with the keywords you'd like to search for, such as *nginx* or *apache*.

    docker search [keyword]

### Obtaining an Image

Once you find an image, download it to your server. In the following command, replace `[image]` with the name of the image you'd like to use.

    docker pull [image]

For instance, to pull down the official nginx image, run: `docker pull nginx`.

### Running an Image

Next, create a container based on the image by using the `docker run` command. Again, replace `[image]` with the name of the image you'd like to use.

    docker run [image]

If the image hasn't been downloaded yet and is available in Docker's registry, the image will automatically be pulled down to your server.

## Managing Docker Containers

### Listing Containers

To list all active (and inactive) Docker containers running on your system, run the following command:

    docker ps -a

The output should resemble the following. This sample output shows the `hello-world` container.

{{< output >}}
CONTAINER ID   IMAGE         COMMAND    CREATED       STATUS                   PORTS     NAMES
5039168328a5   hello-world   "/hello"   2 hours ago   Exited (0) 2 hours ago             magical_varahamihira
{{< /output >}}

### Starting a Container

Start a Docker container with the following command, replacing `[ID]` with the container ID corresponding with the container you wish to start:

    docker start [ID]

### Stopping a Container

Stop a Docker container with the following command, replacing `[ID]` with the container ID corresponding with the container you wish to stop:

    docker stop [ID]

Some images (such as the `hello-world` image) automatically stop after they are run. However, many other containers continue running until explicitly commanded to stop, and you may want to run these containers in the background. For those cases, this command can come in handy.

### Removing a Container

Remove a Docker container with the following command, replacing `[ID]` with the container ID corresponding with the container you wish to remove:

    docker rm [ID]